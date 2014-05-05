require(['js/myForm', 'js/MyCollection', 'js/templateOfDOM', 'js/logic', 'jquery', 'jquery.validate'], 
    function ( MyForm, MyCollection, templates, logic){

    var collectionOfUser, userId, form, addForm, updateForm, 
        confirmForm, warningForm, loginForm, registrationForm,
        taskToDo = 0, activeUser, elementId;

    /**
    * Called in case of error during request to the server.
    * @param {String} text. String for display.
    */   
    function error(text){

        if(text === 501){
            addForm.form.find('input[name = "login"]').after('<label class = "error">This username is already using by another user.</label>');
            registrationForm.form.find('input[name = "login"]').after('<label class = "error">This username is already using by another user.</label>');

        }
        if(text === 502){
            loginForm.form.find('input[name = "password"]').after('<label class = "error">Incorrectly entered password or login.</label>');
        }
        console.log('Error is :' + text);
    }

    /**
    * Create buttons : 'Add', 'Update', 'Delete' .
    * Set him function for create new user, update selected user, delete selected user
    */
    function createActionButtons(){
        var actionButtons = logic.template(templates.tActionButtons);
        $('#actionButtons').append(actionButtons);
        $('#addUser').on('click', function(){
            if(!addForm.form.find('button').length){
                createAddForm();
            }
            addForm.show(300);
        });
        $('#editUser').on('click', function(){
            if(!updateForm.form.find('button').length){
                createUpdateForm();
            }
            if(userId){
                updateForm.setValueForm(
                    collectionOfUser.getElementById(userId)
                );
                updateForm.show(300);
            }
            else{
                if(!warningForm.form.find('button').length){
                    createWarningForm();
                }
                warningForm.show(300);
            }
        });
        $('#delUser').on('click', function(){
            if(userId){
                updateForm.setValueForm(
                    collectionOfUser.getElementById(userId)
                );
                if(!confirmForm.form.find('button').length){
                    createConfirmForm();
                }
                confirmForm.show(300);
            }
            else{
                warningForm.show(300);
            }
        });
       
    }

    /**
    * Create new row in table whicj contains a tade of user
    * @param {Object} obj. Object which contains property of user.
    * {name, age, workPlace, addres, tel, skype, email}
    */
    function createNewRow(obj){
        var row = $('<tr></tr>').attr({
            'data-id' : obj.id
        });
        var colums = logic.template(templates.tColumOfTable, obj);
        row.append(colums);
        row.on('click', select);
        return row;
    }

    /**
    * Create table which display all date about user. 
    * @param {Array} array. Collection of users.
    */
    function createTable(array){
        var table = $('<table></table>').attr({
            'id' : 'db',
            'class' : 'table'
        });
        table.append(logic.template(templates.tFirstRow));

        for (var i = 0; i<array.length; i++){
            var row = createNewRow(array[i]);
            table.append(row);
        }
        $('#dbOfUser').append(table);
    }

    /**
    * Create new user and display him
    */
    function createUser(e){
        addForm.form.find('label[class = "error"]').remove();
        var val = addForm.form.find('#myForm').valid();
        if(val){
            var user = addForm.getValueForm();
            user.logIN = false;
            user.tasks = [];
            e.preventDefault();
            collectionOfUser.create(
                user,
                function(newUser){
                   var row = createNewRow(newUser);
                    $('#db').append(row);
                    addForm.hide();
                },
                error
            );   
         }
    }

    /**
    * Create new user and display him
    */
    function registrationUser(e){
        registrationForm.form.find('label[class = "error"]').remove();
        var val = registrationForm.form.find('#myForm').valid();
        if(val){
            var user = registrationForm.getValueForm();
            user.logIN = false;
            user.tasks = [];
            e.preventDefault();
            collectionOfUser.create(
                user,
                function(newUser){
                    registrationForm.hide();
                },
                error
            );   
         }
    }
    /**
    * Update user and display him instead old.
    */
    function updateUser(e){
        var user = updateForm.getValueForm();
        user["id"] = userId;
        var val = updateForm.form.find('#myForm').valid();
        if(val){
            e.preventDefault();
            collectionOfUser.update(
                user,
                function(newUser){
                    $('tr[data-id='+userId +']').html('').html(logic.template(templates.tColumOfTable, newUser))
                    $('tr[data-id='+userId +']').on('click', select);
                    updateForm.hide();
                },
                error
            );  
        }
    }

    /**
    * Delete selected user.
    */
    function deleteUser(){
        var user = collectionOfUser.getElementById(userId);
        collectionOfUser.remove(
            user,
            function(){
                $('tr[data-id='+userId +']').remove();
                confirmForm.hide();
            },
            error
        )
    }

    /**
    * log out the user and give him status logged= false, hide all date show login form.
    */
    function logout (){
        collectionOfUser.collection.forEach(function(item){
            if(item.logIN){
                collectionOfUser.update(
                    {
                        id : item.id,
                        logIN : false,
                    },
                    function(){},
                    error
                );
            }
        })
        $('#loggedOut').unbind();
        $('#loggedOut').css('background', '#E6E6FA');
        $('#onSite').remove();
        $('#actionButtons').html('');
        $('#dbOfUser').html('');
        $('#conteinerForDisply').html('');
    }

    /**
    * checking if login and password is exist and do some action
    */
    function checkPassword(e){
        collectionOfTask = [];
        logout();
        e.preventDefault();
        loginForm.form.find('label[class = "error"]').remove();
        var userName = loginForm.form.find('input[name="login"]').val(),
            password = loginForm.form.find('input[name="password"]').val();

        loginAndPassword.create(
            {
                login : userName,
                password : password,
            },
            function (user){
                taskToDo = 0;
                $('#conteinerForDisply').append(logic.template(templates.tContainerTask));
                $('#loggedOut').on('click', logout);
                $('#loggedOut').removeAttr('style');
                var userIdForUpdate;
                loginForm.hide();
                createActionButtons();
                var onSite = $('<div></div>').attr({
                    'id' : 'onSite',
                });
                $('body').append(onSite);

                if( user.length > 0 ){
                    activeUser = user[0];
                    userIdForUpdate = user[0].id;
                    user[0].logIN = true;
                    $('#onSite').text('Welcome,' + user[0].name + ' on our site');
                    createTable(user);
                }
                else{
                    activeUser = user;
                    userIdForUpdate = user.id;
                    user.logIN = true;
                    $('#onSite').text('Welcome,' + user.name + ' on our site');
                    $('#addUser').remove();
                    $('#delUser').remove();
                    createTable([]);
                    $('#db').append( createNewRow(user) ); 
                }



                $('#enterTask').on('keypress',createTask);
                $('#checkAll').on('click', checkAllTask);
                showAllTasks(activeUser.tasks);
                console.log(activeUser);

                collectionOfUser.update(
                    {
                        id : userIdForUpdate,
                        logIN : true,
                    },
                    function(){},
                    error
                );
            },
            error
        );     
    }
    /**
    * Selected user from the list
    */
    function select(e){
        if(userId){
            $('tr[data-id='+ userId +']').css('background', 'none');
        }
        $('tr[data-id='+ e.currentTarget.getAttribute('data-id') +']').css('background', '#999');
        userId = e.currentTarget.getAttribute('data-id');
    }

    /**
    * Set validation rules and  messages
    */
    function validation(forma){
        forma.find("#myForm").validate({
            rules : {
                name : {
                    required : true,
                    minlength : 4,  
                },
                login :{
                    required : true,
                    minlength : 5,
                },
                password: { 
                    required : true,
                    minlength : 5,
                }, 
                c_password: { 
                    required : true, 
                    equalTo :  forma.find("#password"), 
                    minlength : 5,
                },
                tel : {
                    required : true,
                    number : true,
                },
                email : {
                    required : true,
                    email : true,
                },
           },

           messages : {
                name : {
                    required : "This field is required",
                    minlength : "Username must be at least 4 characters",
                },
                login : { 
                    required : "This field is required",
                    minlength : "Minimum length of login is five characters",
                },
                password : { 
                    required : "This field is required",
                    minlength : "Minimum length of password is five characters",
                },
                c_password : { 
                    required : "This field is required",
                    equalTo : "Your passwords do not match",
                    minlength : "Minimum length of password is five characters",
                },
                tel : {
                    required : "This field is required",
                    number : "You can use only numbers",
                },
                email : {
                    required : "This field is required",
                    email : "Wrong email format",
                },
            }
        });
    }

    /**
    * Create form for add user
    */
    function createAddForm(){
        
        addForm.appendForm(
            $('#wrraper'),
            [
                {
                    id : 'add',
                    class : 'btn btn-primary',
                    name : 'Add',
                    action : createUser
                },
                {
                    id : 'cancel',
                    class : 'btn btn-primary',
                    name : 'Cancel',
                    action : function(e){
                        e.preventDefault();
                        addForm.hide();
                    }
                }
            ],
            '#myForm'
        );
        validation(addForm.form);
    }

    /**
    * Create form for registration user
    */
    function createRegistrationForm(){
        
        registrationForm.appendForm(
            $('#wrraper'),
            [
                {
                    id : 'registrate',
                    class : 'btn btn-primary',
                    name : 'Registrate',
                    action : registrationUser
                },
                {
                    id : 'cancel',
                    class : 'btn btn-primary',
                    name : 'Cancel',
                    action : function(e){
                        e.preventDefault();
                        registrationForm.hide();
                    }
                }
            ],
            '#myForm'
        );
        validation(registrationForm.form);
    }

    /**
    * Create form for update selected user
    */
    function createUpdateForm(){
        updateForm.appendForm(
            $('#wrraper'),
            [
                {
                    id : 'update',
                    class : 'btn btn-primary',
                    name : 'Update',
                    action : updateUser
                },
                {
                    id : 'esc',
                    class : 'btn btn-primary',
                    name : 'Cancel',
                    action : function(e){
                        e.preventDefault();
                        updateForm.hide();
                    }
                }
            ],
            '#myForm'
        );
        validation(updateForm.form);
    }

    /**
    * create form for confirm delete user
    */
    function createConfirmForm(){
        confirmForm.appendForm(
            $('#wrraper'),
            [
                {
                    id : 'yes',
                    class : 'btn btn-primary',
                    name : 'Yes',
                    action : deleteUser
                },
                {
                    id : 'no',
                    class : 'btn btn-primary',
                    name : 'No',
                    action : function(e){
                        e.preventDefault();
                        confirmForm.hide();
                    }
                }
            ],
            'div'
        );
    }

    /**
    * Create form for warning
    */
    function createWarningForm(){
        warningForm.appendForm(
            $('#wrraper'),
            [
                {
                    id : 'ok',
                    class : 'btn btn-primary',
                    name : 'Ok',
                    action : function(e){
                        e.preventDefault();
                        warningForm.hide();
                    }
                }
            ],
            'div'
        );
    }
    /**
    * Create form for login
    */
    function createLoginForm(){
        loginForm.appendForm(
            $('#wrraper'),
            [
                {
                    id : 'login',
                    class : 'btn btn-primary',
                    name : 'Login',
                    action : checkPassword
                },
                {
                    id : 'don"tLogin',
                    class : 'btn btn-primary',
                    name : 'Cancel',
                    action : function(e){
                        e.preventDefault();
                        loginForm.hide();
                    }
                }
            ],
            '#myForm'
        );
        validation(loginForm.form);
    }
 





    function displayTask(task){
        var container= $('#containerShowTask');
        if($('#task' + task.id).length){
            var containerOfOneTask = $('#task' + task.id);
        }
        else{
            var containerOfOneTask = $('<div>').attr({
                'id' : 'task'+ task.id,
                'class' : 'containerOfOneTask' 
            });
        }
        task.statusClass = task.status ? 'checkedTask' : 'showValueOfTask';
        task.checked = task.status ? 'checked = "checked"' : '';
        var components = logic.template( templates.templateTask, task);
        components.find('input').on("click", markTask);
        components.find('button').on('click',deleteTask);

        containerOfOneTask.append(components);
        if(!($('#task' + task.id).length)){
            container.append(containerOfOneTask);
            containerOfOneTask.hide();
            containerOfOneTask.show(500);
        }
        $('#enterTask').val('');
    }

   function displayBottomContainer(){
        var container = $('#bottomContainer');
        container.html('');
        var bottomContainer = logic.template(templates.templateBottomContainer, {taskToDo:taskToDo});
        container.append(bottomContainer);
        $('#active').on('click', filter);
        $('#completed').on('click', filter);
        $('#all').on('click', filter);
    }

    /**
    * Shows all task
    * @param {Array} array. collection of task for display.
    */ 
    function showAllTasks(array){
        $('#containerShowTask').text('');
        taskToDo = 0;
        for( var i = 0 ; i < array.length ; i++){
            displayTask(array[i]);
            if(array[i].status == false){
                taskToDo++;
            } 
        }
        displayBottomContainer();
    }

    /**
    * Creates a new task.
    * @param {Event} e.
    */ 
    function createTask(e){
        var taskName = $('#enterTask').val();
        if (e.keyCode === 13){
            if( taskName != ''){
                taskToDo++;
                $('#countOfTask').text('').text('Task to do: '+ taskToDo);
                if(activeUser.tasks[0]){
                    activeUser.tasks.push({id : (activeUser.tasks[activeUser.tasks.length - 1].id + 1), task : taskName, status : false});
                    displayTask(activeUser.tasks[activeUser.tasks.length-1]);
                }
                else{
                    activeUser.tasks.push({id : 0, task : taskName, status : false});
                    displayTask(activeUser.tasks[0]);
                }
                collectionOfUser.update(
                    {
                        id : activeUser.id,
                        tasks : activeUser.tasks
                    },
                    function(user){
                        activeUser = user;
                    },
                    error   
                );
            }
            else{
                console.log('Error. task is not enter');
            }
        }
    }


    function markTask(e){
        var status = false;

        if(e.target.checked){
            status = true;
            taskToDo --;
            $('#countOfTask').text('').text('Task to do: '+ taskToDo);
        }
        else{
            taskToDo ++;
            $('#countOfTask').text('').text('Task to do: '+ taskToDo);
        }
        for (var i = 0 ; i< activeUser.tasks.length; i ++){
            if(parseInt(activeUser.tasks[i].id) === parseInt(e.target.getAttribute('data-id'))){
                activeUser.tasks[i].status = status;
                $('#components' + e.target.getAttribute('data-id')).remove();
                displayTask(activeUser.tasks[i]);
                collectionOfUser.update(
                    {
                        id : activeUser.id,
                        tasks : activeUser.tasks
                    },
                    function(user){
                        activeUser = user;
                    },
                    error   
                );
            }
        }

    }

    function deleteTask (e){
        for (var i = 0 ; i< activeUser.tasks.length; i ++){
            if(parseInt(activeUser.tasks[i].id) === parseInt(e.target.getAttribute('data-id'))){
                if(activeUser.tasks[i].status === false){
                    taskToDo--;
                    $('#countOfTask').text('').text('Task to do: '+ taskToDo);
                }
                activeUser.tasks.splice(i, 1);
                $('#task' + e.target.getAttribute('data-id')).remove();
                collectionOfUser.update(
                    {
                        id : activeUser.id,
                        tasks : activeUser.tasks
                    },
                    function(user){
                        activeUser = user;
                    },
                    error   
                );
            }
        }
    }

    function checkAllTask(e){

        var status = false;
        if(e.target.checked){
            status = true;
        }

        for(var i = 0 ; i < activeUser.tasks.length; i++){
            activeUser.tasks[i].status = status;
        }
        collectionOfUser.update(
            {
                id : activeUser.id,
                tasks : activeUser.tasks
            },
            function(user){
                activeUser = user;
                $('#containerShowTask').html('');
                showAllTasks(activeUser.tasks);
            },
            error   
        );
    }

    function filter(e){
        var arrayactive = [], arraycompleted = [];
        for (var i = 0; i< activeUser.tasks.length; i++){
            if(activeUser.tasks[i].status === false){
                arrayactive.push(activeUser.tasks[i]);
            }
            else{
                arraycompleted.push(activeUser.tasks[i]);
            }
        }
        if(e.target.id === 'active'){
            showAllTasks(arrayactive);
        }
        else{
            if(e.target.id === 'completed'){
                showAllTasks(arraycompleted);
            }
            else{
                showAllTasks(activeUser.tasks);
            }
        }
    }


    
    /**
    * set forms and display date from server
    */
    $(function(){


        collectionOfUser = new MyCollection('http://localhost:3000/user');
        loginAndPassword = new MyCollection('http://localhost:3000/loginAndPassword');
        

        addForm = new MyForm( templates.tNewForm );
        registrationForm = new MyForm( templates.tNewForm );
        updateForm = new MyForm( templates.tNewForm );
        confirmForm = new MyForm( templates.tConfirmForm );
        warningForm = new MyForm( templates.tAlertForm );
        loginForm = new MyForm( templates.tLoginForm );

        $('#loggedOut').css('background', '#ADD8E6');
        $('#login').on('click', function(){
                if(!loginForm.form.find('button').length){
                    createLoginForm();
                }
                loginForm.show(300);
            }
        );
        $('#registration').on('click', function(){
            if(!registrationForm.form.find('button').length){
                createRegistrationForm();
            }
            registrationForm.show(300);
        });  
        collectionOfUser.load(
            function(data){
                for(var i = 0; i<data.length; i++){
                    if(data[i].logIN){
                        activeUser = data[i];
                        $('#conteinerForDisply').append(logic.template(templates.tContainerTask));
                        $('#loggedOut').on('click', logout);
                        $('#loggedOut').removeAttr('style');
                        createActionButtons();
                        $('#enterTask').on('keypress',createTask);
                        $('#checkAll').on('click', checkAllTask);
                        showAllTasks(activeUser.tasks);
                        $('#onSite').text('Welcome,' + data[i].name + ' on our site');

                        if(data[i].login === 'admin'){
                            createTable(data);
                        }
                        else{
                            $('#addUser').remove();
                            $('#delUser').remove();
                            createTable([]);
                            $('#db').append(createNewRow(data[i]));
                        }
                    }
                }
            }
        );
    });
});