/*
    工具方法
*/
(function (w) {
    var root = Globle = this, Wx;
    var breaker = {};
    var
        ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;
    var
        push = ArrayProto.push,
        slice = ArrayProto.slice,
        concat = ArrayProto.concat,
        toString = ArrayProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    //对于支持高版本的js浏览器，如果浏览器本身支持这些方法。
    var
        nativeForEach = ArrayProto.forEach,
        nativeMap = ArrayProto.map,
        nativeReduce = ArrayProto.reduce,
        nativeReduceRight = ArrayProto.reduceRight,
        nativeFilter = ArrayProto.filter,
        nativeEvery = ArrayProto.every,
        nativeSome = ArrayProto.some,
        nativeIndexOf = ArrayProto.indexOf,
        nativeLastIndexOf = ArrayProto.lastIndexOf,
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind;

    if (Wx != undefined) return;
    Wx = {};

    //遍历对象（包括数组）中的每个元素，并执行回调函数，返回
    var each = Wx.each = function (obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) { //如果是数组对象
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else { //对象
            for (var key in obj) {
                if (Wx.has(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) return;
                }
            }
        }
    };

    //对象obj是否包含key属性
    var has = Wx.has = function (obj, key) {
        return hasOwnProperty.call(obj, key);
    };

    //copy对象src的属性到对象des当中
    var extend = Wx.extend = function (des, src) {
        for (var k in src) {
            des[k] = src[k];
        }
        return des;
    };

    //判断浏览器
    var Brower = Wx.Browser = (function () {
        var ua = navigator.userAgent;
        var isOpera = ObjProto.toString.call(window.opera) == '[object Opera]';
        return {
            IE: !!window.attachEvent && !isOpera,
            Opera: isOpera,
            Webkit: ua.indexOf('AppleWebKit/') > -1,
            Gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
            MobileSafari: /Apple.*Mobile/.test(ua)
        }
    })();

    //事件对象
    var event = Wx.event = {

    }
    var $ = Wx.$ = function (id) {
        return typeof (id) == "string" ? document.getElementById(id) : id;
    }

    w.Wx = Wx;
})(window);


/*创建类方法*/
(function (exports) {
    var klass = Wx.klass = function (parent) {
        var clas = function () {
            this.init.apply(this, arguments);
        }

        //继承类
        if (parent) {
            var subclass = function () { };
            subclass.prototype = parent.prototype;
            clas.prototype = new subclass;
        }

        clas.prototype.init = function () { };

        clas.fn = clas.prototype;
        clas.fn.parent = clas;
        clas._super = clas.__proto__;

        //委托
        var proxy = clas.proxy = function (func) {
            var self = this;
            return (function () {
                return func.apply(self, arguments);
            });
        };

        clas.fn.proxy = proxy;

        //扩展类方法
        var extend = clas.extend = function (obj) {
            var extended = obj.extended;
            for (var k in obj) {
                clas[k] = obj[k];
            }
            if (extended) extended(clas);
        }

        clas.fn.extend = extend;

        //扩展类实例方法
        var include = clas.include = function (obj) {
            var included = obj.included;
            for (var k in obj) {
                clas.fn[k] = obj[k];
            }
            if (included) included(clas);
        }

        clas.fn.include = include;

        return clas;
    }
}).call(this);