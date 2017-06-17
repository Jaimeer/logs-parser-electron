<template>
  <div class="container is-fluid">
    <div class="section">
      <div class="columns">
        <div class="column is-one-quarter">
          <FilesMenu @selectedFile="selectedFile" @startProcessingFile="startProcessingFile" @endProcessingFile="endProcessingFile"></FilesMenu>
        </div>
  
        <div class="column">
          <template v-if="loading">
            Loading
            <span class="icon">
              <i class="fa fa-refresh fa-spin"></i>
            </span>
          </template>
          <template v-else-if="processing">
            Processing
            <span class="icon">
              <i class="fa fa-refresh fa-spin"></i>
            </span>
          </template>
          <template v-else-if="stats.length===0">
            Select File
          </template>
          <template v-else>
            <ResultData :stats="stats"></ResultData>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fs from 'fs-extra'
import ResultData from './LandingPage/ResultData'
import FilesMenu from './LandingPage/FilesMenu'
import FileProcess from '../../api/FileProcess.js'

export default {
  name: 'landing-page',
  components: { ResultData, FilesMenu },
  data() {
    return {
      stats: [],
      loading: false,
      processing: false
    }
  },
  methods: {
    selectedFile(file) {
      console.log('selectFile', file)
      this.stats = []
      this.loading = true

      const filePath = FileProcess.getDataFolder() + '/' + file
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          alert(`An error ocurred reading the file : ${err.message}`)
          this.loading = false
          return
        }

        // Change how to handle the file content
        this.stats = JSON.parse(data)
        this.loading = false
      })
    },
    startProcessingFile() {
      this.stats = []
      this.processing = true
    },
    endProcessingFile() {
      this.processing = false
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
</style>
