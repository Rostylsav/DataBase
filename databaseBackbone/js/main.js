require(['jquery', 'underscore', 'backbone','backbone.localStorage'], 
    function (){
        var addForm;
            /*
                Model
            **/
            var User = Backbone.Model.extend({
                defaults: {
                    name : "Visitor",
                    login : this.name,
                    password : 'password',
                    email: "someEmail@gmail.com",
                    tasks : []
                },
            });
            /*
                Collection
            **/
            var ListOfUsers = Backbone.Collection.extend({
                model : User,
                url : 'http://localhost:3000/user',
            });
            var users = new ListOfUsers;

            /*
                View for display table of users
            **/
            var UserDisplay = Backbone.View.extend({
                tagName:  "tr",
                template: _.template($('#tableRow').html()),
                render: function() {
                    this.$el.append($(this.template(this.model.toJSON())));
                    return this;
                },
            });

            /*
                View for display form of registration
            **/
            var FormRegistration = Backbone.View.extend({
                el : 'body',
                template : _.template($('#formRegist').html()),
                render : function(){
                    $(this.el).append(this.template);
                    $(this.template).find('#createUser').on('click', this.createUser);
                    $(this.template).find('#cancel').on('click', this.cancel);
                },
                createUser : function(e){
                    e.preventDefault();

                    console.log('createUser');
                },
                cancel : function (e) {
                    e.preventDefault();
                    console.log('cancel');
                }
            });

            /*
                Global view.
            **/
            var AppView = Backbone.View.extend({
                el: $("#containerForUsers"),
                events : {
                    "click #login"  : "login",
                    "click #logout"  : "logout",
                    "click #registration"  : "showFormRegist",
                },
                showFormRegist : function(){
                    if(!addForm){
                        addForm = new FormRegistration();
                    }
                    addForm.render();
                }
            });
        $(function(){
            var app = new AppView();
        });
    }
);