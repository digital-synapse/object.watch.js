name:	object.watch.js		
date:	10/9/2014	
author: digital-synapse

 A cross browser object.watch. Allows you to watch one more more properties of an object.
also works for arrays, nested objects, nested arrays, etc...

        // deep object watch (full traversal)
        someobject.watch({
            onChange: watchCallback,
            depth:-1,
            traverseArrays:true,
            watchArrays:true,
            watchProps:true
        });

        //shallow object watch (no traversal)
        someobject.watch({
            onChange: watchCallback
        });

        // object watch (partial traversal)
        someobject.watch({
            onChange: watchCallback,
            depth: 1
        });

	// object watch (single property)
        someobject.watch({
            onChange: watchCallback,
            toWatch: 'a'
        });

	// object watch (specific properties)
        someobject.watch({
            onChange: watchCallback,
            toWatch: ['a','b','c']
        });

        // object watch override value
        someobject.watch({
            onChange: function (prop, val, oldval) {
                return oldval;
            }
        });

	// unwatch
	someobject.unwatch();
 
If you like this project send me an email:

    digital.synapse.software [ಠ_ಠ] gmail.com
