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
                getByName : function(name){
                    return this.filter(function(user){ return task.name === name; });
                }
            });

            var users = new ListOfUsers;

            var userDisplay = Backbone.View.extend({
                tagName:  "tr",
                template: _.template($('#tableRow').html()),
                events: {
                    "click button.destroy" : "del"
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

            var AppView = Backbone.View.extend({
                el: $("#containerForUsers"),
                events: {
                    "click #addUser":  "createUser",
                },
                initialize: function() {
                    users.bind('add', this.render, this);
                    users.fetch();
                },
                render: function(user) {
                    var view = new userDisplay({model: user});
                    this.$("#users").append(view.render().el);
                },
                createUser: function(e) {
                    users.create(
                        {
                            name: $('input[name = name]').val(),
                            age: $('input[name = age]').val(),
                            email: $('input[name = email]').val()
                        }
                    );
                }
            });
        $(function(){
            var app = new AppView
        });
    }
);