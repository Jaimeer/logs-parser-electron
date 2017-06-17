<template>
  <div>
    <span class="title">
      Files
    </span>
    <ul>
      <li v-for="file in files">
        <a @click="selectFile(file)">{{file}}</a>
        <span class="icon is-small cursor-pointer" @click="editFile(file)">
          <i class="fa fa-pencil-square-o"></i>
        </span>
        <span class="icon is-small cursor-pointer is-pulled-right" @click="deleteFile(file)">
          <i class="fa fa-trash-o"></i>
        </span>
      </li>
    </ul>
    <AddFile @endProcessingFile="endProcessingFile" @startProcessingFile="startProcessingFile"></AddFile>
    <div class="modal" :class="{'is-active':modalOpen}">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="section">
          <div class="field">
            <label class="label">File Name</label>
            <p class="control">
              <input class="input" type="text" placeholder="File Name" v-model="editNameText">
            </p>
          </div>
          <div class="field is-grouped">
            <p class="control">
              <button class="button is-primary" @click="changeName">Change Name</button>
            </p>
            <p class="control">
              <button class="button is-link" @click="modalOpen=false">Cancel</button>
            </p>
          </div>
        </div>
      </div>
      <button class="modal-close"></button>
    </div>
  </div>
</template>

<script>
import fs from 'fs-extra'
import AddFile from './AddFile'
import FileProcess from '../../../api/FileProcess.js'

export default {
  name: 'files-menu',
  components: { AddFile },
  data() {
    return {
      files: [],
      modalOpen: false,
      fileNameText: '',
      editNameText: ''
    }
  },
  async created() {
    this.loadFiles()
  },
  methods: {
    loadFiles() {
      const folderFiles = FileProcess.getDataFolder()
      fs.readdir(folderFiles, (err, dir) => {
        if (err) {
          console.log(err)
        }
        this.files = dir
      })
    },
    selectFile(file) {
      this.$emit('selectedFile', file)
    },
    endProcessingFile() {
      this.loadFiles()
      this.$emit('endProcessingFile')
    },
    startProcessingFile() {
      this.$emit('startProcessingFile')
    },
    deleteFile(file) {
      const folderFiles = FileProcess.getDataFolder()
      fs.removeSync(folderFiles + '/' + file)
      this.loadFiles()
    },
    editFile(file) {
      this.fileNameText = file
      this.editNameText = file
      this.modalOpen = true
    },
    changeName() {
      const folderFiles = FileProcess.getDataFolder()
      console.log(fs)
      if (this.editNameText !== '' && this.fileNameText !== this.editNameText) {
        console.log(`${folderFiles}/${this.fileNameText}`, `${folderFiles}/${this.editNameText}`)
        fs.renameSync(`${folderFiles}/${this.fileNameText}`, `${folderFiles}/${this.editNameText}`)
      }
      this.modalOpen = false
      this.loadFiles()
    }
  }
}
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
</style>
