---
title: Tutorial - Create a MEAN stack on a Linux virtual machine in Azure | Microsoft Docs
description: In this tutorial, you learn how to create a MongoDB, Express, AngularJS, and Node.js (MEAN) stack on a Linux VM in Azure. 
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 08/08/2017
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn how to install the MEAN stack so that I can quickly prepare a Linux VM to run web applications.
---

# Tutorial: Create a MongoDB, Express, AngularJS, and Node.js (MEAN) stack on a Linux virtual machine in Azure

This tutorial shows you how to implement a MongoDB, Express, AngularJS, and Node.js (MEAN) stack on a Linux virtual machine (VM) in Azure. The MEAN stack that you create enables adding, deleting, and listing books in a database. You learn how to:

> [!div class="checklist"]
> * Create a Linux VM
> * Install Node.js
> * Install MongoDB and set up the server
> * Install Express and set up routes to the server
> * Access the routes with AngularJS
> * Run the application

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).


## Create a Linux VM

Create a resource group with the [az group create](https://docs.microsoft.com/cli/azure/group#az_group_create) command and create a Linux VM with the [az vm create](https://docs.microsoft.com/cli/azure/vm#az_vm_create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example uses the Azure CLI to create a resource group named *myResourceGroupMEAN* in the *eastus* location. A VM is created named *myVM* with SSH keys if they do not already exist in a default key location. To use a specific set of keys, use the --ssh-key-value option.

```azurecli-interactive
az group create --name myResourceGroupMEAN --location eastus
az vm create \
    --resource-group myResourceGroupMEAN \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --admin-password 'Azure12345678!' \
    --generate-ssh-keys
az vm open-port --port 3300 --resource-group myResourceGroupMEAN --name myVM
```

When the VM has been created, the Azure CLI shows information similar to the following example: 

```azurecli-interactive
{
  "fqdns": "",
  "id": "/subscriptions/{subscription-id}/resourceGroups/myResourceGroupMEAN/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "13.72.77.9",
  "resourceGroup": "myResourceGroupMEAN"
}
```
Take note of the `publicIpAddress`. This address is used to access the VM.

Use the following command to create an SSH session with the VM. Make sure to use the correct public IP address. In our example above our IP address was 13.72.77.9.

```bash
ssh azureuser@13.72.77.9
```

## Install Node.js

[Node.js](https://nodejs.org/en/) is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js is used in this tutorial to set up the Express routes and AngularJS controllers.

On the VM, using the bash shell that you opened with SSH, install Node.js.

```bash
sudo apt-get install -y nodejs
```

## Install MongoDB and set up the server
[MongoDB](http://www.mongodb.com) stores data in flexible, JSON-like documents. Fields in a database can vary from document to document and data structure can be changed over time. For our example application, we are adding book records to MongoDB that contain book name, isbn number, author, and number of pages. 

1. On the VM, using the bash shell that you opened with SSH, set the MongoDB key.

    ```bash
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
    echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
    ```

2. Update the package manager with the key.
  
    ```bash
    sudo apt-get update
    ```

3. Install MongoDB.

    ```bash
    sudo apt-get install -y mongodb
    ```

4. Start the server.

    ```bash
    sudo service mongodb start
    ```

5. We also need to install the [body-parser](https://www.npmjs.com/package/body-parser-json) package to help us process the JSON passed in requests to the server.

    Install the npm package manager.

    ```bash
    sudo apt-get install npm
    ```

    Install the body parser package.
    
    ```bash
    sudo npm install body-parser
    ```

6. Create a folder named *Books* and add a file to it named *server.js* that contains the configuration for the web server.

    ```node.js
    var express = require('express');
    var bodyParser = require('body-parser');
    var app = express();
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.json());
    require('./apps/routes')(app);
    app.set('port', 3300);
    app.listen(app.get('port'), function() {
        console.log('Server up: http://localhost:' + app.get('port'));
    });
    ```

## Install Express and set up routes to the server

[Express](https://expressjs.com) is a minimal and flexible Node.js web application framework that provides features for web and mobile applications. Express is used in this tutorial to pass book information to and from our MongoDB database. [Mongoose](http://mongoosejs.com) provides a straight-forward, schema-based solution to model your application data. Mongoose is used in this tutorial to provide a book schema for the database.

1. Install Express and Mongoose.

    ```bash
    sudo npm install express mongoose
    ```

2. In the *Books* folder, create a folder named *apps* and add a file named *routes.js* with the express routes defined.

    ```node.js
    var Book = require('./models/book');
    module.exports = function(app) {
      app.get('/book', function(req, res) {
        Book.find({}, function(err, result) {
          if ( err ) throw err;
          res.json(result);
        });
      }); 
      app.post('/book', function(req, res) {
        var book = new Book( {
          name:req.body.name,
          isbn:req.body.isbn,
          author:req.body.author,
          pages:req.body.pages
        });
        book.save(function(err, result) {
          if ( err ) throw err;
          res.json( {
            message:"Successfully added book",
            book:result
          });
        });
      });
      app.delete("/book/:isbn", function(req, res) {
        Book.findOneAndRemove(req.query, function(err, result) {
          if ( err ) throw err;
          res.json( {
            message: "Successfully deleted the book",
            book: result
          });
        });
      });
      var path = require('path');
      app.get('*', function(req, res) {
        res.sendfile(path.join(__dirname + '/public', 'index.html'));
      });
    };
    ```

3. In the *apps* folder, create a folder named *models* and add a file named *book.js* with the book model configuration defined.  

    ```node.js
    var mongoose = require('mongoose');
    var dbHost = 'mongodb://localhost:27017/test';
    mongoose.connect(dbHost);
    mongoose.connection;
    mongoose.set('debug', true);
    var bookSchema = mongoose.Schema( {
      name: String,
      isbn: {type: String, index: true},
      author: String,
      pages: Number
    });
    var Book = mongoose.model('Book', bookSchema);
    module.exports = mongoose.model('Book', bookSchema); 
    ```

## Access the routes with AngularJS

[AngularJS](https://angularjs.org) provides a web framework for creating dynamic views in your web applications. In this tutorial, we use AngularJS to connect our web page with Express and perform actions on our book database.

1. Change the directory back up to *Books* (`cd ../..`), and then create a folder named *public* and add a file named *script.js* with the controller configuration defined.

    ```node.js
    var app = angular.module('myApp', []);
    app.controller('myCtrl', function($scope, $http) {
      $http( {
        method: 'GET',
        url: '/book'
      }).then(function successCallback(response) {
        $scope.books = response.data;
      }, function errorCallback(response) {
        console.log('Error: ' + response);
      });
      $scope.del_book = function(book) {
        $http( {
          method: 'DELETE',
          url: '/book/:isbn',
          params: {'isbn': book.isbn}
        }).then(function successCallback(response) {
          console.log(response);
        }, function errorCallback(response) {
          console.log('Error: ' + response);
        });
      };
      $scope.add_book = function() {
        var body = '{ "name": "' + $scope.Name + 
        '", "isbn": "' + $scope.Isbn +
        '", "author": "' + $scope.Author + 
        '", "pages": "' + $scope.Pages + '" }';
        $http({
          method: 'POST',
          url: '/book',
          data: body
        }).then(function successCallback(response) {
          console.log(response);
        }, function errorCallback(response) {
          console.log('Error: ' + response);
        });
      };
    });
    ```
    
2. In the *public* folder, create a file named *index.html* with the web page defined.

    ```html
    <!doctype html>
    <html ng-app="myApp" ng-controller="myCtrl">
      <head>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>
        <script src="script.js"></script>
      </head>
      <body>
        <div>
          <table>
            <tr>
              <td>Name:</td> 
              <td><input type="text" ng-model="Name"></td>
            </tr>
            <tr>
              <td>Isbn:</td>
              <td><input type="text" ng-model="Isbn"></td>
            </tr>
            <tr>
              <td>Author:</td> 
              <td><input type="text" ng-model="Author"></td>
            </tr>
            <tr>
              <td>Pages:</td>
              <td><input type="number" ng-model="Pages"></td>
            </tr>
          </table>
          <button ng-click="add_book()">Add</button>
        </div>
        <hr>
        <div>
          <table>
            <tr>
              <th>Name</th>
              <th>Isbn</th>
              <th>Author</th>
              <th>Pages</th>
            </tr>
            <tr ng-repeat="book in books">
              <td><input type="button" value="Delete" data-ng-click="del_book(book)"></td>
              <td>{{book.name}}</td>
              <td>{{book.isbn}}</td>
              <td>{{book.author}}</td>
              <td>{{book.pages}}</td>
            </tr>
          </table>
        </div>
      </body>
    </html>
    ```

##  Run the application

1. Change the directory back up to *Books* (`cd ..`) and start the server by running this command:

    ```bash
    nodejs server.js
    ```

2. Open a web browser to the address that you recorded for the VM. For example, *http://13.72.77.9:3300*. You should see something like the following page:

    ![Book record](media/tutorial-mean/meanstack-init.png)

3. Enter data into the textboxes and click **Add**. For example:

    ![Add book record](media/tutorial-mean/meanstack-add.png)

4. After refreshing the page, you should see something like this page:

    ![List book records](media/tutorial-mean/meanstack-list.png)

5. You could click **Delete** and remove the book record from the database.

## Next steps

In this tutorial, you created a web application that keeps track of book records using a MEAN stack on a Linux VM. You learned how to:

> [!div class="checklist"]
> * Create a Linux VM
> * Install Node.js
> * Install MongoDB and set up the server
> * Install Express and set up routes to the server
> * Access the routes with AngularJS
> * Run the application

Advance to the next tutorial to learn how to secure web servers with SSL certificates.

> [!div class="nextstepaction"]
> [Secure web server with SSL](tutorial-secure-web-server.md)
