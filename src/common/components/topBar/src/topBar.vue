<template>
  <div class="topBar">
    <span class="top-bar-back" @click="goBack"><i></i></span>
    <h3 v-text="title"></h3>
    <span v-if="rightBtn" @click="rightBtn.func" v-text="rightBtn.name" class="right-btn"></span>
  </div>
</template>
<script>
  export default {
    name: 'TopBar',
    props: {
      title: {
        type: String,
        required: true
      },
      rightBtn: {
        type: Object
      },
      hasBackHandle: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      goBack () {
        if (this.hasBackHandle) {
          this.$emit('goBack')
        } else {
          window.history.go(-1)
        }
      }
    }
  }
</script>
<style scoped>
    .topBar {
      width: 100%;
      height: 45px;
      line-height: 45px;
      background-color: #f0f0f0;
      color: #27272f;
      font-size: 18px;
      text-align: center;
      position: relative;
      border-bottom: 1px solid #d5d5d5;
    }
    
    h3 {
      font-size: 18px;
      line-height: 44px;
    }
    
    .top-bar-back {
      display: inline-block;
      position: absolute;
      width: 44px;
      height: 44px;
      left: 0px;
    }
    
    .top-bar-back i {
      display: block;
      width: 10px;
      height: 10px;
      border-bottom: 2px solid #666666;
      border-left: 2px solid #666666;
      position: absolute;
      left: 17px;
      top: 18px;
      -webkit-transform: rotate(45deg);
    }
    
    .right-btn {
      position: absolute;
      color: #545c66;
      font-size: 12px;
      display: inline-block;
      right: 10px;
      top: 0px;
    }
</style>