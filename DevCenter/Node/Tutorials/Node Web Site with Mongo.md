# Node.js Web Application with Storage on MongoDB

This tutorial describes how to use MongoDB to store and access data from a Windows Azure web site written in Node.js. This guide assumes that you have some prior experience using Node.js. For information on Node.js, see the [Node.js website]. The guide also assumes that you have some knowledge of MongoDB. For an overview of MongoDB, see the MongoDB website.

You will learn how to:

* Use npm to install the MongoDB driver for Node.js.

* Use MongoDB within a Node.js application.

* Publish a Node.js application to a Windows Azure web site.

Throughout this tutorial you will build a simple web-based task-management application that allows retrieving and creating tasks, which are stored in MongoDB. MongoDB is hosted in a Windows Azure Virtual Machine, and the web application is hosted in a web role.
 
The project files for this tutorial will be stored in C:\node and the completed application will look similar to:

## Setting up your deployment environment

In order to create and test a Node.js application, you will need the following:

* A text editor or Integrated Development Environment (IDE)

* A web browser

* Node 0.6.14 or above. You can find the latest installation for your platform at http://nodejs.org.

Note: While the examples in this tutorial show vi and Chrome being used, any text editor or web browser should work.

## Install MongoDB on a Linux VM

(TODO: Optional section that points the user to related topics and additional information.  Start with a short  summary and then transition to a list of related articles.)

## Creating a Node.js application

In this section you will create a new Node application and use npm to add module packages. This application will use the express module to build a task-list application, which will use MongoDB as storage.
 
For the task-list application you will use the following modules:

* express - A web framework inspired by Sinatra.

* node-uuid - A utility library for creating universally unique identifiers (UUIDs) (similar to GUIDs)

* mongodb - The driver for communicating with MongoDB.

Open the Terminal application and perform the following steps to create the application directory and install the required modules:

1. Enter the following commands to create a new **tasklist** directory and change to this directory.

	    mkdir tasklist
        cd tasklist

    The output of these commands should appear similar to the following:

    (TODO: Insert screenshot)

3. Enter the following command to install the express, node-uuid, and mongodb modules:

        npm install express node-uuid mongodb

    The output of these commands should appear similar to the following:

    (TODO: Insert screenshot)

4. To created the scaffolding which will be used for this application, issue the express command. When prompted to overwrite the destination, enter **y** or **yes**. The output of this command should appear similar to the following:

        ./node_modules/express/bin/express

    The output of this command should appear as follows:

    (TODO: Insert screenshot)

5. To install additional modules required by the express application, enter the following command:

        npm install

    The output of this command should appear as follows:

    (TODO: Insert screenshot)

## Using MongoDB in a Node Application

In this section you will extend your application to create a web-based task-list application that you will deploy to Azure. The task list will allow a user to retrieve tasks, add new tasks, and mark tasks as completed. The application will utilize MongoDB to store task data.

### Create the connector for the MongoDB driver

1. In the tasklist folder, create a new file named *taskProvider.js*. This file will contain the connector for the MongoDB driver for the tasklist application.

2. At the beginning of the file add the following code to reference required libraries:

        var mongoDb = require('mongodb').Db;
        var mongoDbConnection = require('mongodb').Connection;
        var mongoServer = require('mongodb').Server;
        var bson = require('mongodb').BSONNative;
        var objectID = require('mongodb').ObjectID;

3. Next, you will add code to set up the TaskProvider object. This object will be used to perform interactions with the MongoDB database.

        var TaskProvider = function() {
          var self = this;

          self.db = new mongoDb('tasks', new mongoServer('192.168.1.86', 27017, {}));
          self.db.open(function() {});
        };

    (TODO: Figure out a way to automagically find the IP address instead of hard coding it)
 
4. The remaining code to finish off the MongoDB driver is fairly standard code that you may be familiar with from previous MongoDB projects:

    	TaskProvider.prototype.getCollection = function(callback) {
  		  var self = this;

  		  var ensureMongoDbConnection = function(callback) {
            if (self.db.state !== 'connected') {
              self.db.open(function (error, client) {
                callback(error);
              });
            } else {
              callback(null);      
            }
          }

          ensureMongoDbConnection(function(error) {
            if (error) {
              callback(error);
            } else {
              self.db.collection('task', function(error, task_collection) {
                if (error) {
                  callback(error);
                } else {
                  callback(null, task_collection);
                }
              });
            }
          });
        };

        TaskProvider.prototype.findAll = function(callback) {
          this.getCollection(function(error, task_collection) {
            if (error) {
              callback(error)
            } else {
              task_collection.find().toArray(function(error, results) {
                if (error) {
                  callback(error)
                } else {
                  callback(null, results)
                }
              });
            }
          });
        };

        TaskProvider.prototype.save = function(tasks, callback) {
          this.getCollection(function (error, task_collection) {
            if (error) {
              callback(error)
            } else {
              if (typeof (tasks.length) == "undefined") {
                tasks = [tasks];
              }
              for (var i = 0; i < tasks.length; i++) {
                task = tasks[i];
                task.created_at = new Date();
              }
              task_collection.insert(tasks, function (err) {
                callback(null, tasks);
              });
            }
          });
        };
        exports.TaskProvider = TaskProvider;

5. Save and close the taskprovider.js file.

## Modify app.js

1. Open the *app.js* file in a text editor. This file was created earlier by running the express command.

2. Include the node-uuid, home, and azure modules. The home module does not exist yet, but you will create it shortly. Add the code below after the line that ends with express.createServer().

        var TaskProvider = require('./taskProvider').TaskProvider;
        var taskProvider = new TaskProvider();
        var Home = require('./home');
        var home = new Home(taskProvider); 

3. Replace the existing code in the route section with the code below. It will create a home controller instance and route all requests to "/" or "/home" to it.

        //Routes
        app.get('/', home.showItems.bind(home));
        app.get('/home', home.showItems.bind(home));

4. Replace the last two lines of the file with the code below. This configures Node to listen on the environment PORT value provided by Windows Azure when published to the cloud, or port 1337 when you run the application locally.

        app.listen(process.env.port || 1337);

## Create the home controller

The home controller will handle all requests for the task list site.

1. Create a new *home.js* and open it in a text editor. This will be the controller for handling the logic for the task list.

2. Replace the contents with the code below and save the file. The code below uses the javascript module pattern. It exports a Home function. The Home prototype contains the functions to handle the actual requests.

        module.exports = Home;
        function Home (taskProvider) {
          this.taskProvider = taskProvider;
        };
        Home.prototype = {
          showItems: function (req, res) {
            var self = this;
            this.getItems(function (error, tasklist) {
              if (!tasklist) {
                tasklist = [];
              }
              self.showResults(res, tasklist);
            });
          },
          getItems: function (callback) {
            this.taskProvider.findAll(callback);
          },
          showResults: function (res, tasklist) {
            res.render('home', { title: 'Todo list', layout: false, tasklist: tasklist });
          },
        newItem: function (req, res) {
            var self = this;
            var createItem = function (resp, tasklist) {
              if (!tasklist) {
                tasklist = [];
              }
              var count = tasklist.length;
              var item = req.body.item;
              item.completed = false;
              var newtasks = new Array();
              newtasks[0] = item;
              self.taskProvider.save(newtasks, function (error, tasks) { 
                self.showItems(req, res);
              });
            };
            this.getItems(createItem);
          },
        }; 

    Your home controller now includes three functions:

    * showItems handles the request.

    * getItems uses the table client to retrieve open task items from your tasks table. Notice that the query can have additional filters applied; for example, the above query filters only show tasks where completed is equal to false.

    * showResults calls the Express render function to render the page using the home view that you will create in the next section.
 
3. Save and close the home.js file.

### Modify the home view using jade

1. Change directories to the views folder and create a new *home.jade* file, and then open the file in a text editor.

2. Replace the contents of the home.jade file with the code below and save the file. The form below contains functionality for reading and updating the task items. (Note that currently the home controller only supports reading; you will change this later.) The form contains details for each item in the task list.

        html
        head
        title Index
        body
        h1 My ToDo List
        form
        table(border="1")
          tr
            td Name
            td Category
            td Date
            td Complete
          each item in tasklist
            tr
              td #{item.name}
              td #{item.category}
              td #{item.date}
              td
                input(type="checkbox", name="completed", value="#{item.RowKey}") 
        hr
        form(action="/home/newitem", method="post")
          table(border="1") 
            tr
              td Item Name: 
              td 
                input(name="item[name]", type="textbox")
            tr
              td Item Category: 
              td 
                input(name="item[category]", type="textbox")
            tr
              td Item Date: 
              td 
                input(name="item[date]", type="textbox")
          input(type="submit", value="Add item")

3. Save and close the home.jade file.

## Run your application locally

To test the application on your local machine, perform the following steps:

1. Open the Terminal application if it is not already open, and change directories to the tasklist folder.

2. To launch the application, use the following command:

        node app.js

3. Open your browser and navigate to http://127.0.0.1:1337. This should display a web page similar to the following:

(TODO: Insert screenshot)

4. Use the providied fields for Item Name, Item Category, and Item Date to enter information, and then click Add item.

5. The page should update to display the item in the ToDo List table.

(TODO: Insert screenshot)

6. In the terminal application, press Ctrl + C to terminate the node session.

## Deploy your application to Windows Azure



* (TODO: Short sentence of link1): [(TODO: Enter link1 text)] [NextStepsLink1]
* (TODO: Short sentence of link2): [(TODO: Enter link2 text)] [NextStepsLink2]

[NextStepsLink1]: (TODO: enter Next Steps 1 URL)
[NextStepsLink2]: (TODO: enter Next Steps 2 URL)

[Node.js website]: http://nodejs.org

[Image1]: (TODO: if used an image1, enter the url here, otherwise delete this)
[Image2]: (TODO: if used an image2, enter the url here, otherwise delete this)