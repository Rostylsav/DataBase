define(['jquery'], function ()
{
    /**
    * Creates a request to the server
    * @param {String} url. Adres of file which contains data.
    * @param {Function} callback. Function which will run after receiving data.
    * @param {Function} callbackError. Function which will run if will be some errors.
    * @param {Object} obj. It contains properties: method{string}(name of method for creation XmlHttpRequest) and
    * data{string}(data to send to the server).
    */  
    function reqRes(url, callback, callbackError, obj) 
    {
        var options = obj || {},
            method = options.method || 'GET',
            data = null,
            xhr = new XMLHttpRequest();
        
        xhr.open(method, url, true);
        if(options.data)
        {
            xhr.setRequestHeader('Content-Type', 'application/json');
            data = options.data;
        }
        xhr.onreadystatechange = function() {             
                if (xhr.readyState === 4 )  
                {
                    if(xhr.status === 200 || xhr.status === 201)
                    {
                        if(typeof(callback) === 'function')
                        {
                            callback(xhr.responseText);
                        }
                        else
                        {
                            console.log(callback + 'is not a function.')
                        }
                    }
                    else
                    {
                        if(typeof(callbackError) === 'function')
                        {
                            callbackError(xhr.status);
                        }
                        else
                        {
                            console.log(callbackError + 'is not a function.')
                        }
                    }
                }  
            }
        xhr.send(data);
    } 

    var getValueForm = function(jqueryObject){
        var user = {};
        jqueryObject.find('input').each(
            function(item){
                if(($(this).attr('name')) != 'c_password'){
                    user[$(this).attr('name')] = $(this).val();
                }
            }
        )
        return user;
    }

    /**
    * set value to the form
    */
    var setValueForm = function(obj){
        for (key in obj){
           this.form.find('input[name = "' + key + '"]').val(obj[key]);
        }
    }

    /**
    * Creates a DOM element
    * @param {Object} obj. It contains properties which we will use for create a DOM element
    * @param {String} row. String which contains a structure of DOM element.
    */
    function template(row, obj){
        if(obj){
            for (var property in obj){
                var stringProperty = '{{' + property + '}}'; 
                row = row.replace(new RegExp(stringProperty,'g'),obj[property]);
            }
        }
        return $(row);
    }

    /**
    *  Global functions.
    */
    return {
        reqRes : reqRes,
        template : template,
        getValueForm : getValueForm
    }
});
