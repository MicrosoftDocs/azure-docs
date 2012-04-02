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

Note: While the examples in this tutorial show **blank** and **blank** being used, any text editor or web browser should work.

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

        express

    The output of this command should appear as follows:

    (TODO: Insert screenshot)

5. To install additional modules required by the express application, enter the following command:

        npm install

    The output of this command should appear as follows:

    (TODO: Insert screenshot)

## Using MongoDB in a Node Application

## Install MongoDB on the Linux VM

(TODO: Optional section that points the user to related topics and additional information.  Start with a short  summary and then transition to a list of related articles.)

* (TODO: Short sentence of link1): [(TODO: Enter link1 text)] [NextStepsLink1]
* (TODO: Short sentence of link2): [(TODO: Enter link2 text)] [NextStepsLink2]

[NextStepsLink1]: (TODO: enter Next Steps 1 URL)
[NextStepsLink2]: (TODO: enter Next Steps 2 URL)

[Node.js website]: http://nodejs.org

[Image1]: (TODO: if used an image1, enter the url here, otherwise delete this)
[Image2]: (TODO: if used an image2, enter the url here, otherwise delete this)