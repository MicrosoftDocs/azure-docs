---
title: 'Azure Cosmos DB: Build a Flask web app with Python and the Azure Cosmos DB MongoDB API | Microsoft Docs'
description: Presents a Python Flask code sample you can use to connect to and query the Azure Cosmos DB MongoDB API
services: cosmos-db
documentationcenter: ''
author: hshapiro
manager: sramsay
editor: ''

ms.assetid: 
ms.service: cosmos-db
ms.custom: quick start connect
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 8/3/2017
ms.author: hshapiro

---
# Azure Cosmos DB: Build a Flask app with the MongoDB API

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB.

This quick start guide, uses the following [Flask example](https://github.com/CoolBoi567/To-Do-List---Flask-MongoDB-Example) and demonstrates how to build the app with the [Azure Cosmos DB Emulator](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator) instead of MongoDB.

## Prerequisites

- Download the [Azure Cosmos DB Emulator](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator). The emulator is currently only supported on Windows. The sample will also show how to use the sample with a production key from Azure, which can be done on any platform.

- If you don’t already have Visual Studio Code installed, you can quickly install [VS Code](https://code.visualstudio.com/Download) for your platform (Windows, Mac, Linux).

- Be sure to add Python Language support by installing one of the popular Python extensions.
    1. Select an extension.
    2. Install the extension by typing `ext install` into the Command Palette `Ctrl+Shift+P`.

    The examples in this document will use Don Jayamanne's popular and full featured [Python Extension](https://marketplace.visualstudio.com/items?itemName=donjayamanne.python).

## Clone the sample application

Now let's clone a Flask-MongoDB API app from github, set the connection string, and run it. You'll see how easy it is to work with data programmatically.

1. Open a git terminal window, such as git bash, and `cd` to a working directory.
2. Run the following command to clone the sample repository.

    ```bash
    git clone https://github.com/heatherbshapiro/To-Do-List---Flask-MongoDB-Example.git
    ```
3. Run the following command to install the python modules.
    ```bash
    pip install -r .\requirements.txt
    ```
4. Open the folder in Visual Studio Code.

## Review the code

Let's take a quick review of what's happening in the app. Open the **app.py** file under the root directory and you'll find that these lines of code create the Azure Cosmos DB connection. The below code uses the connection string for the local CosmosDB Emulator. The password needs to be split up as seen below to accommodate for the forward slashes that cannot be parsed otherwise.

* Initialize the Mongo Client, Retrieve the Database and Authenticate.

    ```python
    client = MongoClient("mongodb://127.0.0.1:10250/?ssl=true") #host uri
    db = client.test    #Select the database
    db.authenticate(name="localhost",password='C2y6yDjf5' + r'/R' + '+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw' + r'/Jw==')
    ```

* Retrieve the collection or create it if it does not already exist.

    ```python
    todos = db.todo #Select the collection
    ```

* Create the app

    ```Python
    app = Flask(__name__)
    title = "TODO with Flask"
    heading = "ToDo Reminder"
    ```
## Run the web app

1. Make sure the CosmosDB Emulator is running.

2. Open a terminal window and `cd` to the directory that the app is saved in.

3. Then set the environment variable for the Flask app with `set FLASK_APP=app.py` or `export FLASK_APP=app.py` if you using a Mac.

4. Run the app with `flask run` and browse to [http://127.0.0.1:5000/](http://127.0.0.1:5000/).

5. Add and remove tasks and see them added and changed in the collection.

## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount-mongodb.md)]

## Update your connection string

If you want to test the code against a live CosmosDB Account, go to the Azure portal to create an account and get your connection string information. Then copy it into the app.

1. In the [Azure portal](http://portal.azure.com/), in your Azure Cosmos DB account, in the left navigation click **Connection String**, and then click **Read-write Keys**. You'll use the copy buttons on the right side of the screen to copy the Username, Password, and Host into the Dal.cs file in the next step.

2. Open the **app.py** file in the root directory.

3. Copy your **username** value from the portal (using the copy button) and make it the value of the **name** in your **app.py** file.

4. Then copy your **connection string** value from the portal and make it the value of the MongoClient in your **app.py** file.

5. Finally copy your **password** value from the portal and make it the value of the **password** in your **app.py** file.

You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. You can run it the same way as before.

## Deploy to Azure

To deploy this app you can create a new web app in Azure and enable continuous deployment with a fork of this github repo. Please follow this [tutorial](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-continuous-deployment) to set up continuous deployment with Github in Azure.

When deploying to Azure, you should remove your application keys and make sure the section below is not commented out:

```python
    client = MongoClient(os.getenv("MONGOURL"))
    db = client.test    #Select the database
    db.authenticate(name=os.getenv("MONGO_USERNAME"),password=os.getenv("MONGO_PASSWORD"))
```

You will then need to add your MONGOURL, MONGO_PASSWORD, and MONGO_USERNAME to the application settings. You can follow this [tutorial](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-configure#application-settings) to learn more about Application Settings in Azure Web Apps.

If you don't want to create a fork of this repo, you can also click the deploy to Azure button below. You will then need to go into Azure and set up the application settings with your Cosmos DB account info.

<a href="https://deploy.azure.com/?repository=https://github.com/heatherbshapiro/To-Do-List---Flask-MongoDB-Example" target="_blank">
<img src="http://azuredeploy.net/deploybutton.png"/>
</a>

## Note

If you plan to store your code in Github or other source control options, please be sure to remove your connection strings from the code. They can be set with application settings for the web app instead.

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this quickstart in the Azure portal with the following steps:

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account and run a Flask app using the API for MongoDB.
