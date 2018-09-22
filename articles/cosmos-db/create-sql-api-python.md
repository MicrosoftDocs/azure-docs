---
title: 'Azure Cosmos DB: Build an app with Python and the SQL API | Microsoft Docs'
description: Presents a Python code sample you can use to connect to and query the Azure Cosmos DB SQL API
services: cosmos-db
author: SnehaGunda
manager: kfile

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.custom: quick start connect, mvc, devcenter
ms.devlang: python
ms.topic: quickstart
ms.date: 09/24/2018
ms.author: sngun

---
# Azure Cosmos DB: Build a SQL API app with Python and the Azure portal

> [!div class="op_single_selector"]
> * [.NET](create-sql-api-dotnet.md)
> * [Java](create-sql-api-java.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)
> * [Xamarin](create-sql-api-xamarin-dotnet.md)
>  

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This quick start demonstrates how to create an Azure Cosmos DB [SQL API](sql-api-introduction.md) account, document database, and container using the Azure portal. You then build and run a console app built with the Python SDK for [SQL API](sql-api-sdk-python.md). This quickstart uses version 3.0 of the [Python SDK].(https://pypi.org/project/azure-cosmos)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] [!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

## Prerequisites

* [Python 3.6](https://www.python.org/downloads/) with \<install location\>\Python36 and \<install location>\Python36\Scripts added to your PATH. 
* [Visual Studio Code](https://code.visualstudio.com/)
* [Python extention for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python#overview)

## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

## Add a collection

[!INCLUDE [cosmos-db-create-collection](../../includes/cosmos-db-create-collection.md)]

## Add sample data

[!INCLUDE [cosmos-db-create-sql-api-add-sample-data](../../includes/cosmos-db-create-sql-api-add-sample-data.md)]

## Query your data

[!INCLUDE [cosmos-db-create-sql-api-query-data](../../includes/cosmos-db-create-sql-api-query-data.md)]

## Clone the sample application

Now let's clone a SQL API app from GitHub, set the connection string, and run it.

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
    git clone https://github.com/Azure-Samples/azure-cosmos-db-python-getting-started.git
    ```  
    
## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-string). 

Note, if you are familiar with the previous version of the Python SDK, you may be used to seeing the terms "collection" and "document." Because Azure Cosmos DB supports multiple API models, version 3.0+ of the Python SDK uses the generic terms "container,", which may be a collection, graph, or table and "item" to describe the content of the container.

The following snippets are all taken from the `CosmosGetStarted.py` file.

* The CosmosClient is initialized.

    ```python
    # Initialize the Cosmos client
    client = cosmos_client.CosmosClient(url_connection=config['ENDPOINT'], auth={'masterKey': config['MASTERKEY']})
    ```

* A new database is created.

    ```python
    # Create a database
    db = client.CreateDatabase({ 'id': config['DATABASE'] })
    ```

* A new collection is created.

    ```python
    # Create collection options
    options = {
        'offerThroughput': 400
    }

    # Create a container
    container = client.CreateContainer(db['_self'], container_definition, options)
    ```

* Some items are added to the container.

    ```python
    # Create and add some items to the container
    item1 = client.CreateItem(container['_self'], {
        'serverId': 'server1',
        'Web Site': 0,
        'Cloud Service': 0,
        'Virtual Machine': 0,
        'message': 'Hello World from Server 1!'
        }
    )

    item2 = client.CreateItem(container['_self'], {
        'serverId': 'server2',
        'Web Site': 1,
        'Cloud Service': 0,
        'Virtual Machine': 0,
        'message': 'Hello World from Server 2!'
        }
    )
    ```

* A query is performed using SQL

    ```python
    query = {'query': 'SELECT * FROM server s'}

    options = {}
    options['enableCrossPartitionQuery'] = True
    options['maxItemCount'] = 2

    result_iterable = client.QueryItems(container['_self'], query, options)
    for item in iter(result_iterable):
        print(item['message'])
    ```

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app.

1. In the [Azure portal](http://portal.azure.com/), in your Azure Cosmos DB account, in the left navigation click **Keys**. You'll use the copy buttons on the right side of the screen to copy the **URI** and **Primary Key** into the `CosmosGetStarted.py` file in the next step.

    ![View and copy an access key in the Azure portal, Keys blade](./media/create-sql-api-dotnet/keys.png)

2. Open the `CosmosGetStarted.py` file in C:\git-samples\azure-cosmos-db-python-getting-started in Visual Studio Code.

3. Copy your **URI** value from the portal (using the copy button) and make it the value of the **endpoint** key in ``CosmosGetStarted.py``. 

    `'ENDPOINT': 'https://FILLME.documents.azure.com',`

4. Then copy your **PRIMARY KEY** value from the portal and make it the value of the **config.PRIMARYKEY** in ``CosmosGetStarted.py``. You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

    `'PRIMARYKEY': 'FILLME',`

5. Save the ``CosmosGetStarted.py`` file.
    
## Run the app

1. In Visual Studio Code, select **View**>**Command Palette**. 

2. At the prompt, enter  **Python: Select Interpreter** and then select the version of Python to use.

    The Footer in Visual Studio Code is updated to indicate the interpreter selected. 

3. Select **View** > **Integrated Terminal** to open the Visual Studio Code integrated terminal.

4. In the integrated terminal window, ensure you are in the azure-cosmos-db-python-getting-started folder. If not, run the following command to switch to the sample folder. 

    ```
    cd "C:\git-samples\azure-cosmos-db-python-getting-started"`
    ```

5. Run the following command to install the azure-cosmos package. 

    ```
    pip3 install azure-cosmos
    ```

    If you get an error about access being denied when attempting to install azure-cosmos, you'll need to [run VS Code as an administrator](https://stackoverflow.com/questions/37700536/visual-studio-code-terminal-how-to-run-a-command-with-administrator-rights).

6. Run the following command to run the sample and create and store new documents in Azure Cosmos dB.

    ```
    python CosmosGetStarted.py
    ```

7. To confirm the new items were created and saved, in the Azure portal, select **Data Explorer**, expand **coll**, expand **Documents**, and then select the **server1** document. The server1 document contents match the content returned in the integrated terminal window. 

    ![View the new documents in the Azure portal](./media/create-sql-api-python/azure-cosmos-db-confirm-documents.png)

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a collection using the Data Explorer, and run an app. You can now import additional data to your Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB for the SQL API](import-data.md)


