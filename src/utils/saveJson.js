// import module pour manipuler les fichiers
import fs from 'fs'
// Les données sont sauvegardés dans un fichier JSON
const saveJson = (data, path) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

export default saveJson