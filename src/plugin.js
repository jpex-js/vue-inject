module.exports = {
  name : 'vue-inject',
  install : function (o) {
    o.on('extend', function (payload) {
      Object.defineProperties(payload.Class, {
        get : {
          enumerable : true,
          configurable : true,
          get : function () {
            return this.$resolve;
          }
        },
        clearCache : {
          enumerable : true,
          configurable : true,
          get : function () {
            return this.$clearCache;
          }
        },
        factory : {
          enumerable : true,
          configurable : true,
          get : function () {
            return this.register.factory;
          }
        },
        service : {
          enumerable : true,
          configurable : true,
          get : function () {
            return this.register.service;
          }
        },
        constant : {
          enumerable : true,
          configurable : true,
          get : function () {
            return this.register.constant;
          }
        },
        decorator : {
          enumerable : true,
          configurable : true,
          get : function () {
            return this.register.decorator;
          }
        }
      });
    });
  }
};
