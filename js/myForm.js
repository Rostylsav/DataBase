define(['js/logic', 'jquery'], 
    function( logic ){

    /**
    * Creates object MyForm.
    * @constructor
    * @property {String} tString. Tamplate of form in form of string.
    * @property {Object} obj. Object which contains property for create form.
    */
    function MyForm(tString, obj)
    {
        /**
        * @property {String} templateForm. Tamplate of form in form of string.
        * @property {Object} obj. Object which contains property for create form.
        * @property {Array Object} form. Established form
        */
        this.templateForm = tString;
        this.obj = obj;
        this.form = logic.template(this.templateForm, this.obj);

        /**
        * Add buttons tp form with listeners. 
        * @param {Array} arrayButton. It contains properties for create buttons.
        * {id, class, name, action}
        * @param {DOM object} placeForButton. Place for add buttons.
        */ 
        this.addButtons = function(arrayButton, placeForButton){
            var that = this;
            arrayButton.forEach(function(elem){
                var button = $('<button></button>').attr({
                    'id' : elem.id,
                    'class' : elem.class
                });
                button.text(elem.name);
                button.on('click', elem.action);
                placeForButton.append(button);
            });
        }

        /**
        * Shows form in browser 
        * @param {Number} speed. Speed for display.
        */ 
        this.show = function(speed){
            this.form.show(speed);
            if(this.form.find('input').length){
                ((this.form.find('input'))[0]).focus();
                ((this.form.find('input'))[0]).select();
            }
        }
        /**
        * hide formin browser
        */ 
        this.hide = function(){
            this.form.hide();
            this.form.find('input').val('');
        }

        /**
        * Append form with buttons in html element 
        * @param {DOM Object} inElement. element that contains a form
        * @param {Array} arrayButton. It contains properties for create buttons.
        * {id, class, name, action}
        * @param {DOM object} placeForButton. Place for add buttons.
        */ 
        this.appendForm = function(inElement, arrayButton, placeForButton){
            inElement.append(this.form);
            this.hide();
            this.addButtons(arrayButton, this.form.find(placeForButton));
        }

        /**
        * get value from form
        */
        this.getValueForm = function(){
            var user = {};
            this.form.find('input').each(
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
        this.setValueForm = function(obj){
            for (key in obj){
               this.form.find('input[name = "' + key + '"]').val(obj[key]);
            }
        }
    }
    return MyForm ;
});



