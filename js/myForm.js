define(['js/logic', 'jquery'], 
    function( logic ){

    /**
    * Creates object MyForm.
    * @constructor
    * @property {String} tString. Tamplate of form in form of string.
    * @property {Object} obj. Object which contains property for create form.
    * @property {Array} propertyOfButtons. Collection of object which contain property for creating buttons in form.
    */
    function MyForm(tString,  propertyOfButtons, obj)
    {
        /**
        * @property {String} templateForm. Tamplate of form in form of string.
        * @property {Object} obj. Object which contains property for create form.
        * @property {Array Object} form. Established form
        */
        this.templateForm = tString;
        this.obj = obj;
        this.buttons = propertyOfButtons;


        this.createForm = function(){
            var that = this,
                form = logic.template(that.templateForm, that.obj);
            this.buttons.forEach(function(elem){
                var button = $('<button></button>').attr({
                    'id' : elem.id,
                    'class' : elem.class
                });
                button.text(elem.name);
                button.on('click', elem.action);
                form.find('form').append(button);
            });
            $('body').append(form);
            return form;
        }

        this.form = this.createForm();
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



