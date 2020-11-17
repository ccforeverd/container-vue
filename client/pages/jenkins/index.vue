<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="3">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="formData.username"
            :rules="[v => !!v || 'Username is required']"
            label="Your Jenkins Username"
          />
          <v-text-field
            v-model="formData.token"
            :rules="[v => !!v || 'Token is required']"
            label="Your Jenkins Token"
          />
          <v-btn
            :disabled="!valid"
            color="success"
            @click="getAllJobs"
          >
            Get All Jobs
          </v-btn>
          <v-alert
            :value="!!formError"
            type="error"
            transition="scale-transition"
            style="margin-top: 14px;"
          >
            {{ formError }}
          </v-alert>
        </v-form>
      </v-col>
      <v-col cols="12" sm="9">
        <v-data-table
          :headers="jobHeaders"
          :items="jobList"
          height="calc(100vh - 240px)"
          fixed-header
          disable-sort
        >
          <template #item.operation="{ item }">
            <v-btn small @click="viewJob(item)">
              查看信息
            </v-btn>
            <v-btn small @click="viewLast(item)">
              查看最新构建
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogJob" width="90%">
      <v-tabs>
        <v-tab>项目信息</v-tab>
        <v-tab>Json View</v-tab>

        <v-tab-item style="padding: 0 10%;">
          <v-row>
            <v-col cols="3">
              项目名称
            </v-col>
            <v-col>{{ jobData.name }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              线上地址
            </v-col>
            <v-col>{{ jobData.url }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              上次构建
            </v-col>
            <v-col>{{ (jobData.lastBuild || {}).url }}</v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-card light>
            <no-ssr>
              <json-view :data="jobData" />
            </no-ssr>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-dialog>
    <v-dialog v-model="dialogBuild">
      <v-tabs>
        <v-tab>构建信息</v-tab>
        <v-tab>Json View</v-tab>
        <v-tab>Build Console</v-tab>

        <v-tab-item style="padding: 0 10%;">
          <v-row>
            <v-col cols="3">
              构建ID
            </v-col>
            <v-col>{{ buildData.id }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              构建结果
            </v-col>
            <v-col>{{ buildData.result }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              线上地址
            </v-col>
            <v-col>{{ buildData.url }}</v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-card light>
            <no-ssr>
              <json-view :data="buildData" />
            </no-ssr>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card light>
            <pre>{{ buildConsole }}</pre>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  components: {
    // 避免服务端
    'json-view': async () => (await import('vue-json-component')).JSONView
  },
  asyncData () {
    return {
      valid: true,
      formData: {
        username: 'zhangshuyao',
        token: '112dfd30533500b17490fc62b89c3ceb7b'
      },
      formError: '',
      jobHeaders: [
        {
          text: '序号',
          align: 'center',
          value: 'index'
        },
        {
          text: '名称',
          align: 'start',
          value: 'name'
        },
        {
          text: '操作',
          align: 'center',
          value: 'operation'
        }
      ],
      jobList: [],
      jobData: {},
      buildData: {},
      buildConsole: '',
      dialogJob: false,
      dialogBuild: false
    }
  },
  methods: {
    async getAllJobs () {
      this.formError = ''

      const valid = this.$refs.form.validate()
      if (!valid) {
        return
      }

      try {
        this.jobList = (await this.$axios.$get('/jenkins/jobs/all', { params: this.formData }))
          .map((item, index) => {
            item.index = index + 1
            return item
          })
      } catch (e) {
        if (e.response.status === 500) {
          this.formError = e.response.data || 'service error'
        }
        this.jobList = []
      }
    },
    async viewJob (item) {
      try {
        this.jobData = await this.$axios.$get('/jenkins/jobs/info', {
          params: Object.assign({
            jobname: item.name
          }, this.formData)
        })
        this.dialogJob = true
      } catch (e) {
        if (e.response.status === 500) {
          this.formError = e.response.data || 'service error'
        }
        this.jobData = {}
        this.dialogJob = false
      }
    },
    async viewLast (item) {
      try {
        const formData = Object.assign({
          jobname: item.name
        }, this.formData)
        this.buildData = await this.$axios.$get('/jenkins/jobs/last/info', {
          params: formData
        })
        this.buildConsole = await this.$axios.$get('/jenkins/jobs/last/console', {
          params: formData
        })
        this.dialogBuild = true
      } catch (e) {
        if (e.response.status === 500) {
          this.formError = e.response.data || 'service error'
        }
        this.buildData = {}
        this.buildConsole = ''
        this.dialogBuild = false
      }
    }
  }
}

</script>
