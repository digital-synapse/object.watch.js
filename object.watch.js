/**************************************************************************************
*  method: object.watch()
*      creates a watch that will trigger on any changes to properties in the given
*      object. Note: object.watch will not know of any NEW properties that are added
*      after the watch was created.
*
*  params:
*       onChange [function](prop): the callback function. The prop argument is the name
*                                  of the property that changed.
*      options [object|optional] : the optional options object
*   -------------------------------------------------------------------------------------
*            depth [int|optional]: the maximum depth of tree traversal to build the watch
*                                  for. the default value is 0 which is no traversal.
*                                  -1 will traverse the full object graph.
*     watchArrays [bool|optional]: flag to watch array values for changes. default: false
*      watchProps [bool|optional]: flag to watch property values for changes.
*                                  default value: true
*  traverseArrays [bool|optional]: flag that tells the builder to enumerate arrays to 
*                                  look for objects to further traverse.
*                                  default value: false
* toWatch [string|array|optional]: the specific property name to watch or an array of
*                                  property names to watch. If ommitted, all properties
*                                  will be watched for changes
*/
Object.prototype.watch = function (onChange, options) {
    var TYPES = {
        'undefined': 'undefined',
        'number': 'number',
        'boolean': 'boolean',
        'string': 'string',
        '[object Function]': 'function',
        '[object RegExp]': 'regexp',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object Error]': 'error'
    },
    TOSTRING = Object.prototype.toString;
    var type = function (o) {
        return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
    };
    var iterate = function (obj, callback, depth, maxdepth) {
        var props = 0;
        if (depth <= maxdepth || maxdepth == -1) {
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (!options.toWatch || options.toWatch[property]) {
                        if (type(obj[property]) == "array") {
                            var array = obj[property];
                            for (var i = 0; i < array.length; i++) {
                                if (options.traverseArrays)
                                    iterate(array[i], callback, ++depth, maxdepth);
                                if (options.watchArrays) {
                                    var etype = type(array[i]);
                                    if (etype != "array" && etype != "object")
                                        callback(array, i);
                                }
                            }
                        }
                        else if (type(obj[property]) == "object")
                            iterate(obj[property], callback, ++depth, maxdepth);
                        else {
                            if (options.watchProps) callback(obj, property);
                            props++;
                        }
                    }

                }
            }
        }
        return props;
    };
    var watch_prop = function (obj, prop, onChange) {
        var oldval = obj[prop]
		, newval = oldval
		, getter = function () {
			return newval;
		}
		, setter = function (val) {
		    if (val != oldval) {
			oldval = newval;
			newval = val;
			onChange.call(obj, prop, val, oldval);
		    }
	  	}
		;
    	if (delete obj[prop]) { // can't watch constants
            Object.defineProperty(obj, prop, {
                get: getter
				, set: setter
				, enumerable: true
				, configurable: true
            });
        }
    }
    if (!onChange) throw 'object.watch : onChange callback is required';
    if (!options) options = {};
    if (!options.depth) options.depth = 0;
    if (type(options.watchArrays) == 'undefined') options.watchArrays = false;
    if (type(options.watchProps) == 'undefined') options.watchProps = true;
    if (type(options.traverseArrays) == 'undefined') options.traverseArrays = false;
    var tmp = options.toWatch;
    options.toWatch = {};
    if (type(tmp) == 'undefined') options.toWatch = undefined;
    if (type(tmp) == 'string') options.toWatch[tmp] = true;
    if (type(tmp) == 'array') {
        for (var i = 0; i < tmp.length; i++) {
            options.toWatch[tmp[i]] = true;
        }
    }
    var obj = this;
    iterate(obj, function (obj, prop) {
        watch_prop(obj, prop, function (prop) { onChange.call(obj, prop); })
    }, 0, options.depth);
};
