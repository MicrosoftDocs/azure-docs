---
title: 'Quickstart: Table API with Python - Azure Cosmos DB'
description: This quickstart shows how to use the Azure Cosmos DB Table API to create an application with the Azure portal and Python
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: python
ms.topic: quickstart
ms.date: 04/10/2018
ms.author: sngun
ms.custom: seo-python-october2019

---
# Quickstart: Build a Table API app with Python and Azure Cosmos DB

> [!div class="op_single_selector"]
> * [.NET](create-table-dotnet.md)
> * [Java](create-table-java.md)
> * [Node.js](create-table-nodejs.md)
> * [Python](create-table-python.md)
> 

In this quickstart, you create and manage an Azure Cosmos DB Table API account from the Azure portal, and from Visual Studio with a Python app cloned from GitHub. Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). Or [try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription. You can also use the [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator) with a URI of `https://localhost:8081` and the key `C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==`.
- [Visual Studio 2019](https://www.visualstudio.com/downloads/), with the **Azure development** and **Python development** workloads selected during setup. 
- [Git](https://git-scm.com/downloads).

## Create a database account

> [!IMPORTANT] 
> You need to create a new Table API account to work with the generally available Table API SDKs. Table API accounts created during preview are not supported by the generally available SDKs.
>

[!INCLUDE [cosmos-db-create-dbaccount-table](../../includes/cosmos-db-create-dbaccount-table.md)]

## Add a table

[!INCLUDE [cosmos-db-create-table](../../includes/cosmos-db-create-table.md)]

## Add sample data

[!INCLUDE [cosmos-db-create-table-add-sample-data](../../includes/cosmos-db-create-table-add-sample-data.md)]

## Clone the sample application

Now let's clone a Table app from GitHub, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

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
    git clone https://github.com/Azure-Samples/storage-python-getting-started.git
    ```

3. Then open the solution file in Visual Studio. 

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app. This enables your app to communicate with your hosted database. 

1. In your Azure Cosmos DB account in the [Azure portal](https://portal.azure.com/), select **Connection String**. 

    ![View and copy the CONNECTION STRING in the Connection String settings](./media/create-table-python/view-and-copy-connection-string-in-connection-string-settings.png)

2. Copy the ACCOUNT NAME using the button on the right side.

3. Open the *config.py* file, and paste the ACCOUNT NAME from the portal into the STORAGE_ACCOUNT_NAME value on line 19.

4. Go back to the portal and copy the PRIMARY KEY.

5. Paste the PRIMARY KEY from the portal into the STORAGE_ACCOUNT_KEY value on line 20.

6. Save the *config.py* file.

## Run the app

1. In Visual Studio, right-click on the project in **Solution Explorer**.

2. Select the current Python environment, then right click.

2. Select **Install Python Package**, then enter *azure-storage-table*.

3. Press F5 to run the application. Your app displays in your browser. 

You can now go back to Data Explorer and see, query, modify, and work with this new data. 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a table using the Data Explorer, and run a Python app in Visual Studio to add table data.  Now you can query your data using the Table API.  

> [!div class="nextstepaction"]
> [Import table data to the Table API](table-import.md)
