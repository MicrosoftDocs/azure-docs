---
title: Build a Python Flask web app using Azure Cosmos DB's API for MongoDB
description: Presents a Python Flask code sample you can use to connect to and query using Azure Cosmos DB's API for MongoDB.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: python
ms.topic: quickstart
ms.date: 12/26/2018
ms.custom: tracking-python

---
# Quickstart: Build a Python app using Azure Cosmos DB's API for MongoDB

> [!div class="op_single_selector"]
> * [.NET](create-mongodb-dotnet.md)
> * [Java](create-mongodb-java.md)
> * [Node.js](create-mongodb-nodejs.md)
> * [Python](create-mongodb-flask.md)
> * [Xamarin](create-mongodb-xamarin.md)
> * [Golang](create-mongodb-go.md)
>  

In this quickstart, you use an Azure Cosmos DB for Mongo DB API account or the Azure Cosmos DB Emulator to run a Python Flask To-Do web app cloned from GitHub. Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). Or [try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription. Or, you can use the [Azure Cosmos DB Emulator](local-emulator.md). 
- [Python 3.6+](https://www.python.org/downloads/)
- [Visual Studio Code](https://code.visualstudio.com/Download) with the [Python Extension](https://marketplace.visualstudio.com/items?itemName=donjayamanne.python).

## Clone the sample application

Now let's clone a Flask-MongoDB app from GitHub, set the connection string, and run it. You see how easy it is to work with data programmatically.

1. Open a command prompt, create a new folder named git-samples, then close the command prompt.

    ```bash
    md "C:\git-samples"
    ```

2. Open a git terminal window, such as git bash, and use the `cd` command to change to the new folder to install the sample app.

    ```bash
    cd "C:\git-samples"
    ```

3. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/CosmosDB-Flask-Mongo-Sample.git
    ```
3. Run the following command to install the python modules.

    ```bash 
    pip install -r .\requirements.txt
    ```
4. Open the folder in Visual Studio Code.

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Run the web app](#run-the-web-app). 

The following snippets are all taken from the *app.py* file and uses the connection string for the local Azure Cosmos DB Emulator. The password needs to be split up as seen below to accommodate for the forward slashes that cannot be parsed otherwise.

* Initialize the MongoDB client, retrieve the database, and authenticate.

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

1. Make sure the Azure Cosmos DB Emulator is running.

2. Open a terminal window and `cd` to the directory that the app is saved in.

3. Then set the environment variable for the Flask app with `set FLASK_APP=app.py`, `$env:FLASK_APP = app.py` for PowerShell editors, or `export FLASK_APP=app.py` if you are using a Mac. 

4. Run the app with `flask run` and browse to *http:\//127.0.0.1:5000/*.

5. Add and remove tasks and see them added and changed in the collection.

## Create a database account

If you want to test the code against a live Azure Cosmos DB account, go to the Azure portal to create an account.

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount-mongodb.md)]

## Update your connection string

To test the code against the live Azure Cosmos DB account, get your connection string information. Then copy it into the app.

1. In your Azure Cosmos DB account in the Azure portal, in the left navigation select **Connection String**, and then select **Read-write Keys**. You'll use the copy buttons on the right side of the screen to copy the username, connection string, and password. 

2. Open the *app.py* file in the root directory.

3. Copy your **username** value from the portal (using the copy button) and make it the value of the **name** in your *app.py* file.

4. Then copy your **connection string** value from the portal and make it the value of the **MongoClient** in your *app.py* file.

5. Finally copy your **password** value from the portal and make it the value of the **password** in your *app.py* file.

You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. You can run it the same way as before.

## Deploy to Azure

To deploy this app, you can create a new web app in Azure and enable continuous deployment with a fork of this GitHub repo. Follow this [tutorial](https://docs.microsoft.com/azure/app-service/deploy-continuous-deployment) to set up continuous deployment with GitHub in Azure.

When deploying to Azure, you should remove your application keys and make sure the section below is not commented out:

```python
    client = MongoClient(os.getenv("MONGOURL"))
    db = client.test    #Select the database
    db.authenticate(name=os.getenv("MONGO_USERNAME"),password=os.getenv("MONGO_PASSWORD"))
```

You then need to add your MONGOURL, MONGO_PASSWORD, and MONGO_USERNAME to the application settings. You can follow this [tutorial](https://docs.microsoft.com/azure/app-service/configure-common#configure-app-settings) to learn more about Application Settings in Azure Web Apps.

If you don't want to create a fork of this repo, you can also select the **Deploy to Azure** button below. You should then go into Azure and set up the application settings with your Azure Cosmos DB account info.

<a href="https://deploy.azure.com/?repository=https://github.com/heatherbshapiro/To-Do-List---Flask-MongoDB-Example" target="_blank">
<img src="https://azuredeploy.net/deploybutton.png" alt="Click to Deploy to Azure">
</a>

> [!NOTE]
> If you plan to store your code in GitHub or other source control options, please be sure to remove your connection strings from the code. They can be set with application settings for the web app instead.

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB for Mongo DB API account, and use the Azure Cosmos DB Emulator to run a Python Flask To-Do web app cloned from GitHub. You can now import additional data to your Azure Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](mongodb-migrate.md)
