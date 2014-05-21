require(['js/logic', 'jquery', 'underscore', 'backbone','backbone.localStorage'], 
    function (logic){
        var addForm,loginForm;
        function error(text){
            if(text === 501){
                console.log('This username is already using by another user.');
            }
            if(text === 502){
                console.log('Incorrectly entered password or login.');
            }
            console.log('Error is :' + text);
        }
            /*
                Model
            **/
            var User = Backbone.Model.extend({
                defaults: {
                    name : "Visitor",
                    login : this.name,
                    password : 'password',
                    email: "someEmail@gmail.com",
                    logIN : false,
                    tasks : []
                },
                online: function() {
                    this.save({logIN: !this.get("logIN")});
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
                events:{
                    'click #showTasks' : 'showTasks'
                },
                showTasks : function(){
                    $('#continerForm').append(_.template($('#todo').html()));
                    var appTodo = new AppViewTodo();

                },
                render: function() {
                    this.$el.append($(this.template(this.model)));
                    return this;
                }
            });

            /*
                View for display form of registration
            **/
            var FormRegistration = Backbone.View.extend({
                el : '#continerForm',
                template : _.template($('#formRegist').html()),
                events : {
                    'click #createUser' : 'createUser',
                    'click #cancel' : 'cancel',
                },
                render : function(){
                    $(this.el).append(this.template);
                },
                createUser : function(e){
                    e.preventDefault();
                    var user = logic.getValueForm(this.$el);
                    users.create(user);
                    this.$el.html('');
                    console.log('user created');
                },
                cancel : function (e) {
                    e.preventDefault();
                    this.$el.html('');
                }
            });

            /*
                View for login
            **/
            var FormLogin = Backbone.View.extend({
                el : '#continerForm',
                template : _.template($('#formLogin').html()),
                events : {
                    'click #login' : 'login',
                    'click #cancel' : 'cancel',
                },
                render : function(){
                    $(this.el).append(this.template);
                },
                login : function(e){
                    e.preventDefault();
                    var user = logic.getValueForm(this.$el);
                    logic.reqRes(
                        'http://localhost:3000/loginAndPassword',
                        function (users){
                            var view, user = JSON.parse(users);
                            if(user.length){
                                user.forEach(
                                    function(obj){
                                        view = new UserDisplay({model: obj});
                                        $("#users").append(view.render().el);
                                    }
                                );
                            }
                            else{
                                view = new UserDisplay({model: user});
                                $("#users").append(view.render().el);
                            }                        
                        },
                        error,
                        {
                            method : 'POST',
                            data : JSON.stringify(user)
                        }
                    );
                    this.$el.html('');
                },
                cancel : function (e) {
                    e.preventDefault();
                    this.$el.html('');
                }
            });

            /*
                Global view.
            **/
            var AppViewTodo = Backbone.View.extend({
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
                },
                login : function(){
                    if(!loginForm){
                        loginForm = new FormLogin();
                    }
                    loginForm.render();
                },
                logout : function() {
                    $("#users").html('');
                }
            });












            var index = 1;

            var Task = Backbone.Model.extend({
                defaults: {
                    title: "Something to do...",
                    order: index,
                    done: false
                },
                initialize: function() {
                    if (this.get("title") === '') {
                        this.set({"title": this.defaults.title});
                    }
                },
                toggle: function() {
                    this.save({done: !this.get("done")});
                },
                remove: function() {
                    this.destroy();
                }
            });

            var TasksList = Backbone.Collection.extend({
                model: Task,
                done: function() {
                    return this.filter(function(task){ return task.get('done'); });
                },
                remaining: function() {
                    return this.without.apply(this, this.done());
                }
            });
            var tasksList = new TasksList();

            var TaskView = Backbone.View.extend({
                tagName:  "div",
                template: _.template($('#item-template').html()),
                events: {
                    "click .toggle"   : "toggleDone",
                    "click button.destroy" : "del"
                },

                initialize: function() {
                    this.model.bind('change', this.render, this);
                    this.model.bind('destroy', this.del, this);
                },
                render: function() {
                    this.$el.html(this.template(this.model.toJSON()));
                    this.$el.toggleClass('done', this.model.get('done'));
                    return this;
                },
                toggleDone: function() {
                    this.model.toggle();
                },
                del: function() {
                    this.model.remove();
                }
            });

            var AppView = Backbone.View.extend({
                el: $("#containerForTodo"),
                events: {
                    "keypress #newTask": "createOnEnter",
                    "click #chackAll": "chackAll",
                    "click #all": 'allTasks',
                    "click #active": 'activeTasks',
                    "click #done": 'doneTasks'
                },
                initialize: function() {
                    this.input = this.$("#newTask");
                    this.allCheckbox = this.$("#chackAll")[0];

                    tasksList.bind('add', this.displayTask, this);
                    tasksList.bind('all', this.render, this);

                    this.main = $('#containerForTasks');
                    tasksList.fetch();
                },
                render: function() {
                    if (tasksList.length) {
                        this.main.show();
                        this.main.find('#countOfTasks').text('task to do ' + tasksList.remaining().length);
                    }
                    else {
                        this.main.hide();
                    }
                },
                displayTask: function(task) {
                    var view = new TaskView({model: task});
                    this.$("#listOfTasks").append(view.render().el);
                },
                createOnEnter: function(e) {
                    if (e.keyCode === 13){
                        if (this.input.val()) {
                            tasksList.create({title: this.input.val()});
                            this.input.val('');
                        }
                    }
                },
                chackAll: function () {
                    var done = this.allCheckbox.checked;
                    tasksList.forEach(function (task) { task.save({'done': done}); });
                },
                displayAll: function(array){
                    var that = this;
                    this.$("#listOfTasks").html('');
                    array.forEach(
                        function(task){
                            that.displayTask(task);
                        }
                    );
                },
                allTasks: function(){
                    this.displayAll(tasksList.models);
                },
                activeTasks: function(){
                    this.displayAll(tasksList.remaining());
                },
                doneTasks: function(){
                    this.displayAll(tasksList.done());
                }
            });
        $(function(){
            var app = new AppView();
        });
    }
);