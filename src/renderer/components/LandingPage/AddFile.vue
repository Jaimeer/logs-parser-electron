<template>
  <div class="margin-top">
    <label class="label">Process new Files</label>
    <p class="control">
      <input class="input" type="file" multiple @change="onFileChange">
    </p>
  </div>
</template>

<script>
import FileProcess from '../../../api/FileProcess.js'

export default {
  name: 'files-menu',
  data() {
    return {
    }
  },
  methods: {
    async onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.$emit('startProcessingFile')
      await FileProcess.processFiles(files)
      this.$emit('endProcessingFile')
    }
  }
}
</script>

<style>
.margin-top {
  margin-top: 50px;
}
</style>
