define(function(){
/**
* templaet for create buttons
*/
var tActionButtons = '<button id="addUser"  class="btn btn-primary">Add new User</button>'+
                         '<button id="editUser" class="btn btn-primary">Edit User</button>'+
                         '<button id="delUser" class="btn btn-primary">Delete User</button>',

/**
* templaet for create colums with date in row of table
*/
        tColumOfTable = '<td id = "name"><div>{{name}}</div></td>'+
                            '<td id = "age"><div>{{login}}</div></td>'+
                            '<td id = "age"><div>{{password}}</div></td>'+
                            '<td id = "workPlace"><div>{{workPlace}}</div></td>'+
                            '<td id = "addres"><div>{{addres}}</div></td>'+
                            '<td id = "tel"><div>{{tel}}</div></td>'+
                            '<td id = "skype"><div>{{skype}}</div></td>'+
                            '<td id = "email"><div>{{email}}</div></td>',

/**
* templaet for create names of colums
*/
        tFirstRow = ' <tr>'+
                            '<td><div>Full Name</div></td>'+
                            '<td><div>Login</div></td>'+
                            '<td><div>Password</div></td>'+
                            '<td><div>Work Place</div></td>'+
                            '<td><div>Addres</div></td>'+
                            '<td><div>Phone</div></td>'+
                            '<td><div>Skype</div></td>'+
                            '<td><div>E-mail</div></td>'+
                        '</tr>',

/**
* templaet for create warning form
*/
        tAlertForm ='<div id="parentAlertForm" class = "parentForm"></div>'+
                        '<div id="alertForm" class = "form">'+
                            '<div>Please select a user from the list<br></div>'+
                        '</div>',

/**
* templaet for create confirm form
*/
        tConfirmForm = '<div id="confirmParentForm" class = "parentForm"></div>'+
                        '<div id="confirmForm" class = "form">'+
                            '<div> You really want to remove this user from the list?<br></div>'+
                        '</div>',

/**
* templaet for create add and update form
*/
        tNewForm  = '<div id = "parentForm" class = "parentForm"></div>'+
                        '<div id = "form" class = "form">'+
                            '<form id = "myForm">'+
                                '<label class = "nameOfRow">Your full name  </label>' +
                                '<input class = "form-control"  type="text" name = "name"></input>' + 

                                '<label class = "nameOfRow">Your login : </label>' +
                                '<input class = "form-control" type = "text"  name = "login"></input>' + 

                                '<label class = "nameOfRow">Your password : </label>' +
                                '<input class = "form-control" id = "password" type ="password"  name = "password"></input>' + 

                                '<label class = "nameOfRow">Repeat your password : </label>' +
                                '<input class = "form-control" type ="password" name = "c_password"></input>' + 

                                '<label class = "nameOfRow">Your work place : </label>' +
                                '<input class = "form-control" type="text" name = "workPlace"></input>' + 

                                '<label class = "nameOfRow">Your addres : </label>' +
                                '<input class = "form-control" type="text" name = "addres"></input>' + 

                                '<label class = "nameOfRow">Your phone : </label>' +
                                '<input class = "form-control" type="number" name = "tel"></input>' + 

                                '<label class = "nameOfRow">Your skype : </label>' +
                                '<input class = "form-control" type="text" name = "skype"></input>' + 

                                '<label class = "nameOfRow">Your email : </label>' +
                                '<input class = "form-control" type="email" name = "email"></input>' + 

                            '</form>'+
                        '</div>',

        tLoginForm  = '<div id = "parentForm" class = "parentForm"></div>'+
                        '<div id = "form" class = "form">'+
                            '<form id = "myForm">'+

                                '<label class = "nameOfRow">Your login : </label>' +
                                '<input class = "form-control"  name = "login"></input>' + 

                                '<label class = "nameOfRow">Your password : </label>' +
                                '<input class = "form-control" id = "password" type = "password"  name = "password"></input>' + 

                            '</form>'+
                        '</div>',

        templateTask = '<div id="components{{id}}" class="containerOfOneTask">'+
                            '<input class="checkbox" type="checkbox" data-id="{{id}}" {{checked}}></input>'+
                            '<div class="{{statusClass}}" data-id="{{id}}">'+
                                '{{task}}'+
                            '</div>'+
                            '<button class="button" data-id="{{id}}">R</button>'+
                        '</div>',

        templateBottomContainer =   '<div id="countOfTask" class="countOfTask">'+
                                        'Task to do: {{taskToDo}}'+        
                                    '</div>'+
                                    '<button id="all" class="buttomFilter">All</button>'+
                                    '<button id="active" class="buttomFilter">Active</button>'+
                                    '<button id="completed" class="buttomFilter">Completed</button>',

        templateFormForChange = '<div id="parentForm" class = "parentForm"></div>'+
                                '<div id="form" class = "form">'+
                                    '<input class="input" type="text"></input>'+
                                    '<button id="buttonEnter" class="showValue">Change</button>'+
                                    '<button id="buttonEsc" class="showValue">Close</button>'+
                                '</div>',
        tContainerTask = '<div id="conteinerForEnterTask">'+
                            '<input id="checkAll" class="checkbox" type="checkbox"></input>'+
                            '<input id="enterTask" type="text" autofocus="" placeholder="What needs to be done?" name="task"></input>'+
                        '</div>'+
                        '<div id="containerShowTask"></div>'+
                        '<div id="bottomContainer" class="containerOfOneTask"></div>';

    return {
        tActionButtons : tActionButtons,
        tColumOfTable : tColumOfTable,
        tFirstRow : tFirstRow,
        tAlertForm : tAlertForm,
        tConfirmForm : tConfirmForm,
        tNewForm : tNewForm,
        tLoginForm : tLoginForm,
        templateTask : templateTask,
        templateBottomContainer : templateBottomContainer,
        templateFormForChange : templateFormForChange,
        tContainerTask : tContainerTask,
    }
});