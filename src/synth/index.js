import BrowserPlayer from 'output/BrowserPlayer'

let x = 0; // Master clock

const generator = waveGenerator();
let isFirstTime = true;

const attackSize = 1000;
const releaseSize = 20000;
const instances = {

}
let postFrequencyModulation = 1;

let numOfGeneratingInstances = 0;

// Returns the stop function
export const play = (frequencyModulation, id) => {
  instances[id] = {
    shouldGenerate: true,
    frequencyModulation: frequencyModulation,
    xAtStart: x
  }
  numOfGeneratingInstances++;

  if (isFirstTime) {
    BrowserPlayer.play(generator)
    isFirstTime = false;
  }
}


export const envelopeAttack = (y, x, size) => {
  const m = 1 / (size)
  return y * (x * m)
}

export const envelopeRelease = (y, x, size) => {
  const m = -1 / (size);

  return y * ((x * m) + (1))
}

export const stop = (id) => {
  instances[id].shouldGenerate = false
  instances[id].xAtStop = x
  numOfGeneratingInstances--;
}

let _modules = [];

export function* waveGenerator() {
  while(true) {
    const wave = 0;
    const modules = [..._modules]
    //const masterGroup = groups.pop()

    const generatingModules = modules.filter(({type}) => type === 'generator')
    const restModules = modules.filter(({type}) => type !== 'generator')

    Object.keys(instances).forEach(id => {
      if(!instances[id]) 
        return;

      let y = 1;
      generatingModules.forEach(({func, module:name}) => {
        if(func) {
          const result = func(y, x, instances[id].frequencyModulation);

          if (typeof result === 'object') {
            [y, instances[id].frequencyModulation] = result
          } else {
            y = result
          }
        }
      })

      if (!instances[id].shouldGenerate && (x - instances[id].xAtStop) >= releaseSize ) {
        y = 0;
        delete instances[id]
        return;
      } else {
        y = envelope(y, id)
      }
      
      // Provide headroom for instance
      wave += (y * 0.4)
    })


    restModules.forEach(({func, module:name}) => {
      if(func) {
        const result = func(wave, x, postFrequencyModulation);

        if (typeof result === 'object') {
          [wave, postFrequencyModulation] = result
        } else {
          wave = result
        }
      }
    })

    x++;

    // Decrease volume until I will make a master volume component
    const mixVolume =  1
    yield wave * mixVolume
  }
}

const envelope = (y, id) => {

  const xFromStart = x - instances[id].xAtStart;
  
  if (xFromStart < attackSize) {
    return envelopeAttack(y, xFromStart, attackSize)
  } 
  
  const xFromStop = x - instances[id].xAtStop;
  if (!instances[id].shouldGenerate && xFromStop < releaseSize) {
    return (envelopeRelease(y, xFromStop, releaseSize))
  }
  
  return y;
}

export const setGlobalModules = (modules) => {
  _modules = modules;
}
