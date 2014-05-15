require(['jquery', 'underscore', 'backbone','backbone.localStorage'], 
    function (){
            var User = Backbone.Model.extend({
                defaults: {
                    name : "Visitor",
                    age : 18,
                    email: "someEmail@gmail.com"
                },
                remove: function() {
                    this.destroy();
                }
            });

            var ListOfUsers = Backbone.Collection.extend({
                model : User,
                localStorage : new Store("users"),
            });
            var users = new ListOfUsers;

            var UserDisplay = Backbone.View.extend({
                tagName:  "tr",
                template: _.template($('#tableRow').html()),
                events: {
                    "click button#destroy" : "del"
                },
                initialize: function() {
                    this.model.bind('destroy', this.remove, this);
                },
                render: function() {
                    this.$el.append($(this.template(this.model.toJSON())));
                    return this;
                },
                del: function() {
                    this.model.remove();
                }
            });

            var FormAddUser = Backbone.View.extend({
                template : _.template($('#myForm').html()),
                events: {
                    "click #createUser":  "createUser",
                },
                initialize: function() {
                    //users.bind('add', , this);
                    this.render();
                },
                render: function(user) {
                   $('#containerForm').html(this.template);
                },
                createUser: function(e) {
                    console.log('work good');
                    users.create(
                        {
                            name: $('input[name = name]').val(),
                            age: $('input[name = age]').val(),
                            email: $('input[name = email]').val()
                        }
                    );
                }
            });

            var AppView = Backbone.View.extend({
                el: $("#containerForUsers"),
                events : {
                    "click #addUser"  : "showForm",
                },
                initialize: function() {
                    users.bind('add', this.render, this);
                    users.fetch();
                },
                render: function(user) {
                    var view = new UserDisplay({model: user});
                    this.$("#users").append(view.render().el);
                },
                showForm : function(){
                    var form = new FormAddUser;
                }
            });
        $(function(){
            var app = new AppView
        });
    }
);