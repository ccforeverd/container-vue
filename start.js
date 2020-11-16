/* eslint-disable no-console */

const path = require('path')
const nodemon = require('nodemon')
const debounce = require('lodash.debounce')

console.log('DEV_MODE:', process.env.DEV_MODE)

function onError (reject) {
  return (error) => {
    reject()
    console.log(error)
    process.exit(1)
  }
}

function buildServer () {
  return new Promise((resolve, reject) => {
    console.log('Start build server file...')
    require('child_process').exec('yarn build:server', (err, _stdout, stderr) => {
      if (err) {
        return onError(reject)(err)
      }
      if (stderr) {
        return onError(reject)(stderr)
      }
      // console.log(stdout)
      console.log('Finish build server file!')
      resolve()
    })
  })
}

function watchServer () {
  return new Promise((resolve, reject) => {
    let isReady = false
    const onChange = debounce(async () => {
      if (isReady) {
        await buildServer()
        // await new Promise(resolve => setTimeout(resolve, 500))
        nodemon.restart()
      }
    }, 300)
    const watcher = require('chokidar').watch(path.resolve(__dirname, 'server'))
    watcher
      .on('add', onChange)
      .on('change', onChange)
      .on('ready', () => {
        console.log('Keep watching ./server')
        isReady = true
        resolve()
      })
      .on('error', onError(reject))
  })
}

function nodemonServer () {
  return new Promise((resolve, reject) => {
    nodemon({
      script: '.server/index.js',
      watch: ['none'] // 设置一个不存在的文件夹, 避免监听 server 文件夹
    })
    nodemon
      .on('crash', onError(reject))
      // 使用 once 避免每次 restart 时重复触发 start 回调
      .once('start', () => {
        console.log('nodemon start!')
        resolve()
      })
      .on('restart', () => console.log('nodemon restart!'))
      .on('quit', () => {
        console.log('App has quit!')
        process.exit()
      })
  })
}

async function start () {
  try {
    await buildServer()
    await watchServer()
    await nodemonServer()
  } catch (e) {
    console.log('Error in start:', e)
    process.exit(1)
  }
}

start()
