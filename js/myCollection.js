define(['js/logic'], function(logic) {

    /**
    * Creates object MyCollection.
    * @constructor
    * @property {string} url. Link to data.
    */
    function MyCollection(url)
    {
        /**
        * @property {string} url. Link to data.
        * @property {Array} collection. Array for object.
        */
        this.url = url;
        this.collection = [];

        /**
        * Data are taken from the server and the function is performed on them
        * @param {Function} callback. Function which will run after receiving data.    
        */    
        this.load = function(callback){
            var that = this;
            logic.reqRes(that.url, function(text){ 
                that.collection = JSON.parse(text); 
                callback(JSON.parse(text));
            });
        };

        /**
        * Creates new element after run callback.
        * @param {Object} obj. It contains properties for create new element.
        * @param {Function} callback. Function which will run after receiving data.
        * @param {Function} callbackError. Function which will run if will be some errors.
        */  
        this.create = function( obj, callback, errorCallback ) {
            var that = this;
            logic.reqRes(
                that.url,
                function(data){ 
                    that.collection.push(JSON.parse(data));
                    callback(JSON.parse(data));
                },
                errorCallback,
                {
                    method : 'POST',
                    data : JSON.stringify(obj)
                }
            );
        };

        /**
        * Change elemtn in colection on new element bu id.
        * @param {Object} obj. Object for change.
        */ 
        this.changeInCollection = function( obj) {
            for( var i = 0 ; i < this.collection.length; i++)
            { 
                if(this.collection[i].id === obj.id)
                {
                    this.collection[i] = obj;
                }
            }
        };

        /**
        * Update element after run callback.
        * @param {Object} obj. It contains properties for updata .
        * @param {Function} callback. Function which will run after receiving data.
        * @param {Function} callbackError. Function which will run if will be some errors.
        */ 
        this.update = function( obj, callback, errorCallback ) {
            var that = this;
            logic.reqRes(
                that.url,
                function(newData){ 
                    var data = JSON.parse(newData);
                    that.changeInCollection(data);
                    callback(data);
                },
                errorCallback,
                {
                    method : 'PUT',
                    data : JSON.stringify(obj)
                }
            );
        };

        /**
        * Delete elment in collection by id.
        * @param {Number} id. Id of element.
        */
        this.deleteInColection = function( id ){
            for( var i = 0 ; i < this.collection.length; i++)
            { 
                if(this.collection[i].id === id)
                {
                    this.collection.splice(i, 1);
                }
            }
        };

        /**
        * Delete element after run callback.
        * @param {Object} obj. It contains properties for delete .
        * @param {Function} callback. Function which will run after receiving data.
        * @param {Function} callbackError. Function which will run if will be some errors.
        */
        this.remove = function ( obj, callback, errorCallback ){
            var that = this;
            logic.reqRes(
                that.url,
                function(){
                    that.deleteInColection(obj.id);
                    callback();
                },
                errorCallback,
                {
                    method : 'DELETE',
                    data : JSON.stringify(obj)
                }
            );
        };

        /**
        * Get elment from collection by id.
        * @param {Number} id. Id of element.
        * @returns {Object}  element of collection.
        */
        this.getElementById = function( id ){
            for( var i = 0 ; i < this.collection.length; i++){ 
                if(parseInt(this.collection[i]['id']) === parseInt(id))
                {
                    return this.collection[i];
                }
            }
        };

        /**
        * Get new colection by property.
        * @param {Object} obj. Object with property for filter colection.
        * @returns {Array} resul. Filtered array of elements.
        */
        this.getFilteredCollection = function (obj){
            var result = this.collection,
                proxyCollection = [];

            for ( var item in obj){
                for (var i = 0; i < result.length; i++){
                    if(result[i].hasOwnProperty(item)){
                        if(result[i][item] === obj[item]){
                            proxyCollection.push(result[i]);
                        }
                    }
                }
                result = proxyCollection;
                proxyCollection = [];
            }
            return result;
        };
    }
    return MyCollection ;
});



