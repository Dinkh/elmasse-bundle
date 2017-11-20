Ext.define('elmasse.i18n.reader.Json', {
    alternateClassName: 'Ext.i18n.reader.Json',
    extend: 'Ext.data.reader.Json',
    alias: 'reader.i18n.json',


    extractData: function (root) {
        var me = this,
            records = [],
            Model = me.getModel(),
            node, record, i, j;

        // my
        if (!root.length && Ext.isObject(root)) {
            var keyed = me.getKeyed(root);
        }

        Object.keys(keyed).forEach(function (key) {
            node = {
                key: key,
                value: keyed[key]
            };

            record = new Model(node);

            // If the server did not include an id in the response data, the Model constructor will mark the record
            // as phantom. We  need to set phantom to false here because records created from a server response using
            // a reader by definition are not phantom records.
            record.phantom = false;

            records.push(record);
        });

        return records;
    },


    /**
     * Used the flatten method from hughsk
     * https://github.com/hughsk/flat/blob/master/index.js
     * @param {object} target JS object which need to be converted
     * @returns {object} flattened object with only one level
     */
    getKeyed: function (target) {
        var delimiter = '.',
            keys = {};

        function step(object, prev, currentDepth) {
            currentDepth = currentDepth || 1;
            Object.keys(object).forEach(function (key) {
                var value = object[key],
                    isarray = Array.isArray(value),
                    type = Object.prototype.toString.call(value),
                    //isbuffer = isBuffer(value),
                    isobject = (type === '[object Object]' || type === '[object Array]'),

                    newKey = prev ? prev + delimiter + key : key;

                if (!isarray /*&& !isbuffer*/ && isobject && Object.keys(value).length) {
                    return step(value, newKey, currentDepth + 1)
                }

                keys[newKey] = value
            })
        }

        step(target);

        return keys;
    }
});
