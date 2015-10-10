define([
  'text!./mask.html'
  ], function(tpl){

  var dom = Regular.dom;

  var Mask  = Regular.extend({
    name: "mask",
    template: tpl,

    node: function(){},

    config: function (data){ },

    init: function(){
      var data = this.data;
      this.$watch('!!show', function(show, oshow){
        var body = data.container || document.body
        this.$inject(show? body: false)

      }, {init: true})
    },
    toggle: function(){
      this.$update('show', !this.data.show)
    },
    show: function(){
      this.$update('show', true)
    },
    hide: function(){
      this.$update('show', false)
    }
  });

  return Mask


})