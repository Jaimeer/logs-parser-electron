const fs = require('fs-extra')
const readline = require('readline')
const {
  remote
} = require('electron')

function processFile(file, items) {
  var lineReader = readline.createInterface({
    input: fs.createReadStream(file)
  })

  let linesProcessed = 0
  lineReader.on('line', (line) => {
    processLine(line, items, file)
    linesProcessed++
    if (!(linesProcessed % 10000)) {
      console.log(`File[${file}] NumLines[${linesProcessed}]`)
    }
  })

  return new Promise((resolve, reject) => {
    lineReader.on('close', resolve)
    lineReader.on('error', reject)
  })
}

function processLine(line, items, file) {
  const {
    host,
    status,
    day,
    hour
  } = getHost(line)

  if (host !== '') {
    let item = items[host]

    if (item) {
      if (status) {
        item.value.ok += 1
      } else {
        item.value.ko += 1
      }
      if (item.dates[day]) {
        if (item.dates[day][hour]) {
          if (status) {
            item.dates[day][hour].ok += 1
          } else {
            item.dates[day][hour].ko += 1
          }
        } else {
          item.dates[day][hour] = {
            ok: status ? 1 : 0,
            ko: status ? 0 : 1
          }
        }
      } else {
        item.dates[day] = {}
        item.dates[day][hour] = {
          ok: status ? 1 : 0,
          ko: status ? 0 : 1
        }
      }
    } else {
      let value = {
        ok: status ? 1 : 0,
        ko: status ? 0 : 1
      }
      let dates = {}
      if (!dates[day]) {
        dates[day] = {}
      }
      if (!dates[day][hour]) {
        dates[day][hour] = {
          ok: status ? 1 : 0,
          ko: status ? 0 : 1
        }
      }

      items[host] = {
        host,
        dates: dates,
        value: value
      }
    }
  }
}

function getHost(line) {
  let initString = ''
  let endString = ''
  let status = null
  let host = ''
  let day = line.substr(0, 10)
  let hour = line.substr(11, 2)
  if (~line.indexOf('FastCGI sent in stderr')) {
    host = 'FastCGI ERROR'
    status = 0
  } else {
    if (~line.indexOf(' request: "')) {
      initString = 'request: "'
      endString = ' HTTP/1'
      status = 0
    } else {
      initString = '] "'
      endString = ' HTTP/1'
      status = 1
    }
    const lineIni = line.indexOf(initString) + initString.length
    const lineEnd = line.indexOf(endString) - lineIni
    host = line.substr(lineIni, lineEnd)

    if (~host.indexOf('?')) {
      host = host.split('?')[0]
    }
  }
  return {
    host,
    status,
    day,
    hour
  }
}

function getDataFolder() {
  return `${remote.app.getPath('documents')}/logParser/data`
}

export default {
  getDataFolder() {
    return getDataFolder()
  },
  async processFiles(files) {
    let items = {}

    console.log(`Files To Process: ${files.length - 1}`)
    for (let file of files) {
      if (file !== '.gitkeep') {
        console.log(`> Ini Process File: ${file.path}`)
        await processFile(file.path, items)
        console.log(`< End Process File: ${file.path}`)
      }
    }

    items = Object.keys(items).map((host) => {
      return items[host]
    })

    const folderData = getDataFolder()
    if (!fs.existsSync(folderData)) {
      fs.mkdirpSync(folderData)
    }
    const hash = (+new Date()).toString(36)
    fs.writeFile(`${folderData}/data_${hash}.json`, JSON.stringify(items), function (err) {
      if (err) {
        return console.log(err)
      }
      console.log('The file was saved!')
    })
    return 'Processed all files'
  }
}
