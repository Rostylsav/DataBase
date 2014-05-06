require(['js/myForm', 'js/MyCollection', 'js/templateOfDOM', 'js/logic', 'jquery', 'jquery.validate'], 
    function ( MyForm, MyCollection, templates, logic){

    var collectionOfUser, userId, registrationForm, updateForm, loginForm,
        warningWindow, tasksWindow, taskToDo = 0, loginUser;

    /**
    * Called in case of error during request to the server.
    * @param {String} text. String for display.
    */   
    function error(text){

        if(text === 501){
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
            if(registrationForm === null || registrationForm === undefined){
                console.log('Create registration form');
                createRegistrationForm();
            }
            registrationForm.show(300);
        });

        $('#editUser').on('click', function(){
            if(userId){
                if(updateForm === null || updateForm === undefined){
                    console.log('Create update form');
                    createUpdateForm();
                }
                updateForm.setValueForm(
                    collectionOfUser.getElementById(userId)
                );
                updateForm.show(300);
            }
            else{
                if(warningWindow === null || warningWindow === undefined){
                    createWarningWindow();
                }
                warningWindow.show(300);
            }
        });

        $('#delUser').on('click', function(){
            if(userId){
                collectionOfUser.remove(
                    collectionOfUser.getElementById(userId),
                    function(){
                        $('tr[data-id='+ userId +']').remove();
                    },
                    error
                )
            }
            else{
                if(warningWindow === null || warningWindow === undefined){
                    createWarningWindow();
                }
                warningWindow.show(300);
            }
        });

        $('#tasksButton').on('click', function(){  
            if(tasksWindow === null || tasksWindow === undefined ){
                console.log('create tasks window');
                createTasksWindow();
            }
            tasksWindow.show(300);
        });
       
    }

    function createEditButon(){
        var editButton = logic.template(templates.tEditButton);
        $('#actionButtons').append(editButton);
        $('#editUser').on('click', function(){
            if(userId){
                if(updateForm === null || updateForm === undefined){
                    console.log('Create update form');
                    createUpdateForm();
                }
                updateForm.setValueForm(loginUser);
                updateForm.show(300);
            }
            else{
                if(warningWindow === null || warningWindow === undefined){
                    createWarningWindow();
                }
                warningWindow.show(300);
            }
        });
    }

    function createTasksButton(){
        var tasksButton = logic.template(templates.tTasksButton);
        $('#actionButtons').append(tasksButton);
        $('#tasksButton').on('click', function(){
            if(tasksWindow === null || tasksWindow === undefined){
                console.log('create tasks window');
                createTasksWindow();
            }
            tasksWindow.show(300);
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
    * Selected user from the list
    */
    function select(e){
        if(userId){
            $('tr[data-id='+ userId +']').css('background', 'none');
        }
        $('tr[data-id='+ e.currentTarget.getAttribute('data-id') +']').css('background', '#999');
        userId = e.currentTarget.getAttribute('data-id');
    }


    function clear(){
        $('#loggedOut').unbind();
        $('#onSite').remove();
        $('#actionButtons').html('');
        $('#dbOfUser').html('');
        $('#tasksWindow').remove();
        tasksWindow = null;
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
                    if(loginUser.login === 'admin'){
                        $('#db').append(createNewRow(newUser));
                    }
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
        collectionOfUser.update(
        {
            id : loginUser.id,
            logIN : false,
        },
        function(){},
        error
        );
        clear();
    }

    /**
    * checking if login and password is exist and do some action
    */
    function checkPassword(e){
        var userName = loginForm.form.find('input[name="login"]').val(),
            password = loginForm.form.find('input[name="password"]').val();
            logout();
        e.preventDefault();
        loginForm.form.find('label[class = "error"]').remove();
        logic.reqRes(
            'http://localhost:3000/loginAndPassword',
             function (user){
                var userIdForUpdate;
                loginUser = JSON.parse(user);
                loginForm.hide();

                if( loginUser.length > 0 ){
                    userIdForUpdate = loginUser[0].id;
                }
                else{
                    userIdForUpdate = loginUser.id;
                }
                collectionOfUser.update(
                    {
                        id : userIdForUpdate,
                        logIN : true,
                    },
                    function(user){
                        loginUser = user;
                        displayData(loginUser);
                    },
                    error
                );
            },
            error,
            {
                method : 'POST',
                data : JSON.stringify(
                    {
                        login : userName,
                        password : password,
                    }
                )
            }
        );
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
    * Create form for registration user
    */
    function createRegistrationForm(){
        registrationForm = new MyForm(
            templates.tNewForm,
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
            ]
        );
        validation(registrationForm.form);
    }

    /**
    * Create form for update selected user
    */
    function createUpdateForm(){
        updateForm = new MyForm(
            templates.tNewForm,
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
            ]
        );
        validation(updateForm.form);
    }

    function createLoginForm(){
        loginForm = new MyForm( 
            templates.tLoginForm, 
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
            ]
        );
        validation(loginForm.form);
    }

    /**
    * Create form for warning
    */
    function createWarningWindow(){
     
        warningWindow = logic.template(templates.tAlertForm);
        warningWindow.find('button').on(
            'click',
            function(e){
                e.preventDefault();
                warningWindow.hide();
            }
        );
        $('body').append(warningWindow);
    }


    function createTasksWindow(){
        tasksWindow = logic.template(templates.tContainerTask);
        $('body').append(tasksWindow);
        $('#enterTask').on('keypress',createTask);
        $('#checkAll').on('click', checkAllTask);
        $('#close').on('click', function(){
            tasksWindow.hide();
        });
        showAllTasks( loginUser.tasks);
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
                if(loginUser.tasks[0]){
                    loginUser.tasks.push({id : (loginUser.tasks[loginUser.tasks.length - 1].id + 1), task : taskName, status : false});
                    displayTask(loginUser.tasks[loginUser.tasks.length-1]);
                }
                else{
                    loginUser.tasks.push({id : 0, task : taskName, status : false});
                    displayTask(loginUser.tasks[0]);
                }
                collectionOfUser.update(
                    {
                        id : loginUser.id,
                        tasks : loginUser.tasks
                    },
                    function(user){
                        loginUser = user;
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
        for (var i = 0 ; i< loginUser.tasks.length; i ++){
            if(parseInt(loginUser.tasks[i].id) === parseInt(e.target.getAttribute('data-id'))){
                loginUser.tasks[i].status = status;
                $('#components' + e.target.getAttribute('data-id')).remove();
                displayTask(loginUser.tasks[i]);
                collectionOfUser.update(
                    {
                        id : loginUser.id,
                        tasks : loginUser.tasks
                    },
                    function(user){
                        loginUser = user;
                    },
                    error   
                );
            }
        }

    }

    function deleteTask (e){
        for (var i = 0 ; i< loginUser.tasks.length; i ++){
            if(parseInt(loginUser.tasks[i].id) === parseInt(e.target.getAttribute('data-id'))){
                if(loginUser.tasks[i].status === false){
                    taskToDo--;
                    $('#countOfTask').text('').text('Task to do: '+ taskToDo);
                }
                loginUser.tasks.splice(i, 1);
                $('#task' + e.target.getAttribute('data-id')).remove();
                collectionOfUser.update(
                    {
                        id : loginUser.id,
                        tasks : loginUser.tasks
                    },
                    function(user){
                        loginUser = user;
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

        for(var i = 0 ; i < loginUser.tasks.length; i++){
            loginUser.tasks[i].status = status;
        }
        collectionOfUser.update(
            {
                id : loginUser.id,
                tasks : loginUser.tasks
            },
            function(user){
                loginUser = user;
                $('#containerShowTask').html('');
                showAllTasks(loginUser.tasks);
            },
            error   
        );
    }

    function filter(e){
        var arrayactive = [], arraycompleted = [];
        for (var i = 0; i< loginUser.tasks.length; i++){
            if(loginUser.tasks[i].status === false){
                arrayactive.push(loginUser.tasks[i]);
            }
            else{
                arraycompleted.push(loginUser.tasks[i]);
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
                showAllTasks(loginUser.tasks);
            }
        }
    }

    function displayData(user){
        $('#loggedOut').on('click', logout);

        var onSite = $('<div></div>').attr({
            'id' : 'onSite',
        });
        $('body').append(onSite);
        $('#onSite').text('Welcome,' + user.name + ' on our site');

        if(user.login === 'admin'){
            createActionButtons();
            collectionOfUser.load(
                function(data){
                    createTable(data);
                }
            )
        }
        else{
            createEditButon();
            createTasksButton();
            createTable([]);
            $('#db').append(createNewRow(user));
        }
    }



    
    /**
    * set forms and display date from server
    */
    $(function(){
        collectionOfUser = new MyCollection('http://localhost:3000/user');      
        $('#login').on('click', function(){
            if(loginForm === null || loginForm === undefined){
                    console.log('Create login form');
                    createLoginForm();
                }
                loginForm.show(300);
            }
        );
        $('#registration').on('click', function(){
            if(registrationForm === null || registrationForm === undefined){
                console.log('Create registration form');
                createRegistrationForm();
            }
            registrationForm.show(300);
        }); 

        logic.reqRes(
            'http://localhost:3000/islogin',
             function (user){
                loginUser = JSON.parse(user);
                displayData(loginUser);
            },
            error,
            {
                method : 'POST',
                data : JSON.stringify(
                    {
                        logIN : true,
                    }
                )
            }
        );
    });
});