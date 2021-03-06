require(['js/logic', 'jquery', 'underscore', 'backbone','backbone.localStorage'], 
    function (logic){
        var addForm,loginForm, loginUserModel; 
        function error(text){
            if(text === 501){

               $('#myForm').find('input[name = "login"]').after('<label class = "error">This username is already using by another user.</label><br>');
            }
            if(text === 502){
                loginForm.$el.find('input[name = "password"]').after('<label class = "error">Incorrectly entered password or login.</label><br>');
            }
            console.log('Error is :' + text);
        }
        /*
            Model
        **/
        var UserModel = Backbone.Model.extend({
            idAttribute: "id",
            defaults: {
                name : "Visitor",
                login : this.name,
                password : 'password',
                email: "someEmail@gmail.com",
                listOfTasks : null
            }
        });

        /*
            Collection
        **/
        var CollectionOfUsers = Backbone.Collection.extend({
            model : UserModel,
            url : 'http://localhost:3000/user',
        });
        var listOfUsers = new CollectionOfUsers();

        /*
            View for display table of users
        **/
        var UserDisplay = Backbone.View.extend({
            tagName:  "tr", 
            template: _.template($('#tableRow').html()),
            events:{
                'click #showTasks' : 'showTasks'
            },
            render: function() {
                this.$el.append($(this.template(this.model)));
                return this;
            },
            showTasks : function(){
                if(this.model.listOfTasks === null){
                    loginUserModel.listOfTasks = new CollectionOfTasks();
                }
                var appToDo = new ToDoView();
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
                listOfUsers.create(user);
                this.$el.html('');
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
            getLoginUser : function (users){
                var  user = JSON.parse(users);
                if(user.length){
                    loginUserModel = user[0];

                    user.forEach(
                        function(obj){
                            var view = new UserDisplay({model: obj});
                            $("#users").append(view.render().el);
                        }
                    );
                }
                else{
                    loginUserModel = new UserModel(user);
                    var view = new UserDisplay({model: user});
                    $("#users").append(view.render().el);
                }  
                loginForm.remove();                      
            },
            login : function(e){
                var that = this;
                e.preventDefault();
                var user = logic.getValueForm(this.$el);
                logic.reqRes(
                    'http://localhost:3000/loginAndPassword',
                    that.getLoginUser,
                    error,
                    {
                        method : 'POST',
                        data : JSON.stringify(user)
                    }
                );
            },
            cancel : function (e) {
                e.preventDefault();
                loginForm.remove();
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

        var TaskModel = Backbone.Model.extend({
            defaults: {
                title: 'Something to do...',
                order: index,
                done: false
            },
            toggle: function() {
                var that = this;
                this.set('done', !(that.get('done')));
            },
            clear : function(){
                this.destroy();
            }
        });

        var CollectionOfTasks = Backbone.Collection.extend({
            model: TaskModel,
            done: function() {
                return this.filter(function(task){ return task.get('done'); });
            },
            remaining: function() {
                return this.without.apply(this, this.done());
            }
        });

        var TaskDisplay = Backbone.View.extend({
            tagName:  'div',
            template: _.template($('#item-template').html()),
            events: {
                "click .toggle"   : "toggleDone",
                "click button.destroy" : "clear"
            },
            initialize: function() {
                this.model.bind('change', this.render, this);
                this.model.bind('destroy', this.remove, this);
            },
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                this.$el.toggleClass('done', this.model.get('done'));
                return this;
            },
            toggleDone: function() {
                this.model.toggle();
            },
            clear: function() {
                this.model.clear();
            }
        });

        var ToDoView = Backbone.View.extend({
            el: $("#containerForTodo"),
            events: {
                "keypress #newTask": "createOnEnter",
                "click #chackAll": "chackAll",
                "click #all": 'allTasks',
                "click #active": 'activeTasks',
                "click #done": 'doneTasks',
                "click #hide": 'hideFormTodo'
            },
            initialize: function() {
                $('#todo').show();
                this.input = this.$("#newTask");
                this.allCheckbox = this.$("#chackAll")[0];

                loginUserModel.listOfTasks.bind('add', this.showTask, this);
                loginUserModel.listOfTasks.bind('all', this.render, this);

                this.main = $('#containerForTasks');
            },
            render: function() {
                if (loginUserModel.listOfTasks.length) {
                    this.main.show();
                    this.main.find('#countOfTasks').text('task to do ' + loginUserModel.listOfTasks.remaining().length);
                }
                else {
                    this.main.hide();
                }
            },
            showTask: function(task) {
                var view = new TaskDisplay({model: task});
                this.$("#listOfTasks").append(view.render().el);
            },
            createOnEnter: function(e) {
                if (e.keyCode === 13){
                    if (this.input.val()) {
                        loginUserModel.listOfTasks.add({title: this.input.val()});
                        this.input.val('');
                    }
                }
            },
            chackAll: function () {
                var done = this.allCheckbox.checked;
                loginUserModel.listOfTasks.forEach(function (task) { task.toggle();});
            },
            displayAll: function(array){
                var that = this;
                this.$("#listOfTasks").html('');
                array.forEach(
                    function(task){
                        that.showTask(task);
                    }
                );
            },
            allTasks: function(){
                this.displayAll(loginUserModel.listOfTasks.models);
            },
            activeTasks: function(){
                this.displayAll(loginUserModel.listOfTasks.remaining());
            },
            doneTasks: function(){
                this.displayAll(loginUserModel.listOfTasks.done());
            },

            hideFormTodo: function(){
                
                
                loginUserModel.save(this);
            }
        });

        $(function(){
            var app = new AppView();
        });
    }
);