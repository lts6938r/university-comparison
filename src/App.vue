<template>
  <el-container>
    <el-main>
      <el-card class="comparison-container" :body-style="{padding: '40px'}">
        <SchoolComparison />
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import SchoolComparison from './components/SchoolComparison2.vue'

export default {
  components: {
    SchoolComparison
  }
}
</script>

<style scoped>
.comparison-container {

  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

}


</style>