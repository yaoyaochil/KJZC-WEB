<template>
  <div>
    <div class="bodo-search-box">

    </div>
    <div class="bodo-table-box">
      <div class="bodo-btn-box">

      </div>
      <div class="bodo-table">
        <el-table ref="multipleTable" style="width: 100%;" tooltip-effect="light" :data="tableData" row-key="reward_rule_id">
          <el-table-column align="center" label="创建时间" width="240">
            <template #default="scope">
              {{ formatDate(scope.row.CreatedAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="reward_rule_id" label="ID" width="80" />
          <el-table-column prop="reward_name" label="规则名称" />
          <el-table-column prop="first_place_reward_percent" align="center" label="第一名获奖比例" />
          <el-table-column prop="second_place_reward_percent" align="center" label="第二名获奖比例" />
          <el-table-column prop="third_place_reward_percent" align="center" label="第三名获奖比例" />
          <el-table-column align="center" label="最后更新" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.UpdatedAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="editRule(row)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteRule(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">

</style>
