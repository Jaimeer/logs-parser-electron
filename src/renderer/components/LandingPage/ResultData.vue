<template>
  <div>
    <nav class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Filter</p>
          <p class="title">
            <input class="input" v-model="filter"></input>
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div v-if="filter===''">
          <p class="heading">Requests</p>
          <p class="title">{{stats.length}}</p>
        </div>
        <div v-else>
          <p class="heading">Request Filtered</p>
          <p class="title">{{statsOrdered.length}}/{{stats.length}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Export</p>
          <p class="title">
            <button class="button is-primary" @click="csvExport">Download</button>
          </p>
        </div>
      </div>
    </nav>
    <template v-if="stats.length>0">
      <table class="table">
        <thead>
          <tr>
            <th>Total</th>
            <th>OK</th>
            <th>KO</th>
            <th>Request</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>Total</th>
            <th>OK</th>
            <th>KO</th>
            <th>Request</th>
          </tr>
        </tfoot>
        <tbody>
          <tr v-for="stat in statsOrdered">
            <td>{{stat.value.ok + stat.value.ko}}</td>
            <td>{{stat.value.ok}}</td>
            <td>{{stat.value.ko}}</td>
            <td>{{stat.host}}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
import FileSaver from 'file-saver'

export default {
  name: 'result-data',
  props: ['stats'],
  data() {
    return {
      filter: ''
    }
  },
  computed: {
    statsOrdered() {
      let stats = this.stats
      if (this.filter !== '') {
        stats = stats.filter(stat => {
          return stat.host.toLowerCase().indexOf(this.filter.toLowerCase()) > 0
        })
      }
      return stats.sort(function (a, b) {
        if (a.value.ok + a.value.ko < b.value.ok + b.value.ko) {
          return 1
        }
        if (a.value.ok + a.value.ko > b.value.ok + b.value.ko) {
          return -1
        }
        return 0
      })
    }
  },
  methods: {
    csvExport() {
      let stats = this.statsOrdered
      console.log('csvExport - ini:', stats.length)
      // stats = stats.slice(0, 100)

      let csvContent = 'Total,OK,KO,Host\n'
      for (let stat of stats) {
        csvContent += stat.value.ok + stat.value.ko + ',' + stat.value.ok + ',' + stat.value.ko + ',' + stat.host + '\n'
      }
      let blob = new Blob([csvContent], { type: 'text/csv' })
      FileSaver.saveAs(blob, name)
      console.log('csvExport - end: ', stats.length)
    }
  }
}
</script>

<style>
.table td,
.table th {
  padding: 0 0.75em;
}
</style>
