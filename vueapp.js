const app = new Vue({
  el: "#app",
  data: {
    lessons: [],
    onHome: true,
    ascending: true,
    sortBy: "subject",
    cart: [],
    search: "",
  },
  created: function () {
    fetch("http://localhost:3000/collections/products")
      .then((response) => response.json())
      .then((lessons) => {
        this.lessons = lessons;
      });
  },
  methods: {
    //Change Pages
    changePage() {
      this.onHome = !this.onHome;
    },
    //Add item to Cart
    addToCart(item) {
      if (item.space > 0) {
        --item.space;
      }

      this.cart.push(item);
      // item.Space - this.cartCount(item);
    },
    canAddToCart(item) {
      return item.space > 0;
    },
    // Item Cart count
    cartCount(item) {
      let count = 0;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === item) {
          count++;
        }
      }
      return count;
    },
    //Remove item from cart
    removeFromCart(item) {
      //Remove 1 item from cart
      this.cart.splice(this.cart.indexOf(item), 1);
      // increase number of spaces for removed cart item
      var lessonRemoved = this.lessons.find((lesson) => lesson.id == item.id);
      lessonRemoved.space++;
      //Switch to home page if cart becomes empty
      if (this.cart.length <= 0) {
        this.changePage();
      }
    },
    //Submitted Form Message
    submitForm() {
      alert("Your order has been Submitted");
    },
  },
  computed: {
    // Number of items in Cart
    cartItemCount: function () {
      return this.cart.length || "";
    },
  },
});
