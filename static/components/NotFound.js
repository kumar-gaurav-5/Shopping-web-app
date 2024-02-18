export default {
    template: `<div>
      
      <h4>Page Doesn't exist</h4>
      You will be redirected to previous page in 10 seconds
    </div>
    `,
    created() {
      // Waiting for 10 seconds and then redirecting to the previous page
      setTimeout(() => {
        this.redirectToPrevious();
      }, 10000); // 10000 milliseconds
    },
    methods: {
      redirectToPrevious() {
        // Use Vue Router to navigate to the previous page
        this.$router.go(-1);
      },
    },
  };
  