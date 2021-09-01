
const DEFAULT_CONFIG = {
  deg: -45,
  text: '林英杰',
  repeat: true,
  fontSize: undefined,
  fontColor: 'rgba(0,0,0,.6)',
  fontFamily: 'sans-serif',
  quality: 0.92,
  fileName: undefined,
  downLoad: false
}



/** @type {HTMLCanvasElement} */


function watermark(src, callback, param = {}) {
  if (!callback) {
    throw new Error('callback is required.')
  }
  let config = Object.assign(DEFAULT_CONFIG, param)
  let img = new Image()
  img.onload = function () {
    let naturalWidth = img.naturalWidth
    let naturalHeight = img.naturalHeight

    let canvas = document.createElement('canvas')
    canvas.width = naturalWidth
    canvas.height = naturalHeight
    let fontSize = config.fontSize || pixelToFontSize(img)
    let text = config.text
    const ctx = canvas.getContext("2d")

    ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight)

    ctx.font = `${fontSize}px ${config.fontFamily}`;
    ctx.fillStyle = config.fontColor
    ctx.rotate(-45 * Math.PI / 180)
    let xAxisPoints = Math.floor(naturalWidth / (fontSize))
    let yAxisPoints = Math.floor(naturalHeight / (fontSize))
    for (let i = -yAxisPoints; i < yAxisPoints; i++) {

      for (let j = -xAxisPoints; j < xAxisPoints; j++) {
        let offset = i * -fontSize * text.length
        let xSpace = 3
        let ySpace = 4.5
        ctx.fillText(text, j * fontSize * text.length * xSpace + offset, i * fontSize * ySpace)
      }
    }
    canvas.toBlob(blob => {
      let fileName = new Date().getTime() + '.jpeg'
      config.downLoad && downLoad(blob, config.fileName || fileName)
      callback(blob)
    }, 'image/jpeg', config.quality)
  }
  img.onerror = function () {
    throw new Error('can not load image , please check resource')
  }
  img.src = src


}

function downLoad(blob, fileName) {
  let link = document.createElement('a')
  let downloadUrl = window.URL.createObjectURL(blob)
  link.href = downloadUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)
  }, 0);
}

function pixelToFontSize(img) {
  const { naturalWidth } = img
  //base 1080 / 30 = 36   设计图1080宽，字体大小30
  let fontSize = Math.floor(naturalWidth / 36)
  return fontSize < 10 ? 10 : fontSize
}

export default watermark