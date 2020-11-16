<template>
  <main>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="formData.token"
        :rules="formRules.token"
        label="Jenkins Token"
        required
      />
    </v-form>
  </main>
</template>

<script lang="ts">

export default {
  asyncData () {
    return {
      valid: true,
      formData: {
        token: ''
      },
      formRules: {
        token: [
          (value: string) => !value && 'Jenkins Token is required!'
        ]
      }
    }
  }
}

</script>
