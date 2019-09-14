import React, {useState, useCallback} from 'react';

function useGroups(initialGroups = []) {
    const [groups, setGroups] = useState(initialGroups)

    console.log(groups)

    const addGroup = useCallback((group = []) => {
        setGroups([...groups, group])
    }, [groups])

    const removeGroup = useCallback((index) => {
        setGroups([...groups.slice(0, index), ...sequence.slice(index + 1)])
    }, [groups])
    
    const updateModuleFunc = useCallback((func, groupIndex, funcIndex) => {
        const group = groups[groupIndex]
        const theModule = group[funcIndex]
        
        setGroups([...groups.slice(0, groupIndex), 
            [...group.slice(0, funcIndex), {...theModule, func}, ...group.slice(funcIndex + 1)]
        , ...groups.slice(groupIndex + 1)])
    }, [groups])

    return [groups, addGroup, removeGroup, updateModuleFunc];
}

export default useGroups