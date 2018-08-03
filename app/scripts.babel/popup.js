var vm = new Vue({
  el: '#app',
  data: {
    editor:'',
  },
  watch: {
    editor: function () {
      return this.save(this.editor);
    }
  },
  mounted: function () {
    this.loadData();
  },
  computed: {},
  methods: {

    create: function create() {



    },

    eventAction: function eventAction() {

    },
    update: function update(e) {
      this.editor = e.target.value;
    },
    save: function save(input) {
      chrome.storage.sync.set({
        'storedData': input
      }, function () {
        return true;
      });
    },

    loadData: function loadData() {
      // Check if local storage is enabled
      self = this;
      chrome.storage.sync.get('storedData', function (item) {
        var x = item.storedData;
        self.editor = x;
      });
    },
    changeHandler: function () {
      return this.editor;
    }
  }
});