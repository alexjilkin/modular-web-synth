import React from 'react';
import {useDrag} from 'react-dnd'
import {ItemTypes} from 'synth/consts'
import * as Modules from 'modules'
import './DraggableModule.scss'

const DraggableModule = ({moduleName, groupIndex, moduleIndex, theModule, ...props}) => {
  const {removeModuleFromGroup} = props;

  const [{isDragging}, drag] = useDrag({
    item: { type: ItemTypes.MODULE, groupIndex, moduleIndex, theModule },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
  })

  const Module = Modules[moduleName]

  return (
    <div styleName="container">
      <div styleName="drag-container"  ref={drag}>
        <div styleName="drag">

        </div>
        <div styleName="remove" onClick={() => removeModuleFromGroup(groupIndex, moduleIndex)}>
          x
        </div>
      </div>
      <Module {...props} />
      {isDragging && <div styleName="overlay"></div>}
    </div>
  )
  }

  export default DraggableModule;