---
title: 'Azure Cosmos DB: Build an app with Python and the Cassandra API | Microsoft Docs'
description: earn how to use the Azure Cosmos DB Cassandra API to create a get started application with the Azure portal and Java
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 4ebc883e-c512-4e34-bd10-19f048661159
ms.service: cosmos-db
ms.custom: quick start connect, mvc
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: quickstart
ms.date: 11/08/2017
ms.author: govindk

---
# Azure Cosmos DB: Build a Cassandra API app with Python and the Azure portal

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can quickly create and query document, table, key-value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This quick start demonstrates how to create an Azure Cosmos DB account for the [Cassandra API](cassandra-introduction.md) by using the Azure portal. You'll then build a profile console app, as shown in the following image, with sample data cloning a Python sample from GitHub.  

![View and verify the output](./media/create-cassandra-python/output.png)

## Prerequisites

* Before you can run this sample, you must have the following prerequisites:
	* [Python](https://www.python.org/downloads/) version v2.7.14
	* [Git](http://git-scm.com/)
    * [Python Driver for Apache Cassandra](https://github.com/datastax/python-driver)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 


## Create a database account

Before you can create a document database, you need to create a Cassandra account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount-cassandra](../../includes/cosmos-db-create-dbaccount-cassandra.md)]

## Clone the sample application

Now let's clone a Cassandra API app from github, set the connection string, and run it. You see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and `CD` to a working directory.  

2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-cassandra-python-getting-started.git
    ```

## Review the code

Let's make a quick review of what's happening in the app. Open the `pyquickstart.py` file and you find that these lines of code create the Azure Cosmos DB resources. 

* User name and password  is set using the connection string page in the Azure portal.  

   ```python
   auth_provider = PlainTextAuthProvider(username=cfg.config['username'], password=cfg.config['password'])
   ```

* The `cluster` is initialized with contactPoint information. The contactPoint is retrieved from the Azure portal.

    ```python
   cluster = Cluster([cfg.config['contactPoint']], port = cfg.config['port'], auth_provider=auth_provider)
    ```

* The `cluster` connects to the Azure Cosmos DB Cassandra API.

    ```python
    session = cluster.connect()
    ```

* A new keyspace is created.

    ```python
   session.execute('CREATE KEYSPACE IF NOT EXISTS uprofile WITH replication = {\'class\': \'SimpleStrategy\', \'replication_factor\': \'3\' }')
    ```

* A new table is created.

   ```
   session.execute('CREATE TABLE IF NOT EXISTS uprofile.user (user_id int PRIMARY KEY, user_name text, user_bcity text)');
   ```

* Key/value entities are inserted.

    ```Python
    insert_data = session.prepare("INSERT INTO  uprofile.user  (user_id, user_name , user_bcity) VALUES (?,?,?)")
    batch = BatchStatement()
    batch.add(insert_data, (1, 'VinodS', 'Dubai'))
    batch.add(insert_data, (2, 'MohammedS', 'Toronto'))
    batch.add(insert_data, (3, 'SiddeshV', 'Mumbai'))
    batch.add(insert_data, (4, 'KirilG', 'Seattle'))
    ....
    session.execute(batch)
    ```

* Query to get get all key values.

    ```Python
    rows = session.execute('SELECT * FROM uprofile.user')
    ```  
    
 * Query to get a key-value.

    ```Python
    
    rows = session.execute('SELECT * FROM uprofile.user where user_id=1')
    ```  

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app.

1. In the [Azure portal](http://portal.azure.com/), in your Azure Cosmos DB account, in the left navigation click **Connection String**, and then click **Read-write Keys**. You'll use the copy buttons on the right side of the screen to copy the CONTACT POINT, USERNAME, and PASSWORD into the `config.py` file in the next step.

    ![View and copy an access user name, password and contact point in the Azure portal, connection string blade](./media/create-cassandra-python/keys.png)

2. Open the `config.py` file. 

3. Copy your CONTACT POINT value from the portal (using the copy button) and make it the value of the contactPoint key in `config.py`. 

    `contactPoint': '<FILLME>"`

4. Copy your USERNAME value from the portal (using the copy button) and make it the value of the username key in `config.py`

    ` 'username': '<FILLME>'`
    
5. Copy your PASSWORD value from the portal (using the copy button) and make it the value of the password key in `config.py`

    `  'password': '<FILLME>'`

6. Copy your PORT value from the portal (using the copy button) and make it the value of the port key in `config.py`

    `  'port':'10350'`
    
## Run the app
1. Run `python -m pip install cassandra-driver`, `python -m pip install prettytable` in a terminal to install required modules

2. Run `python pyquickstart.py` in a terminal to start your node application.

3. Verify the results as expected from the command line.

    ![View and verify the output](./media/create-cassandra-dotnet/output.png)

4. You can now go back to Data Explorer to see query, modify, and work with this new data. 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this quickstart in the Azure portal with the following steps:

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a collection using the Data Explorer, and run an app. You can now import additional data to your Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import Cassandra data into Azure Cosmos DB](cassandra-import-data.md)

