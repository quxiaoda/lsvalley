<template>
  <div class="zheui-swipe-item" @click="tap">
    <slot></slot>
  </div>
</template>

<script>
    export default {
        name: 'swipe-item',
        props: {
            handleClick: {
                type: Function
            }
        },
        mounted() {
            this.$parent && this.$parent.swipeItemCreated(this);
        },
        methods: {
            tap: function(){
                if (this.handleClick){
                    this.handleClick()
                }
            }
        }
    }
</script>