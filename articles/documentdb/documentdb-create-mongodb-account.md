---
redirect_url: https://docs.microsoft.com/azure/documentdb/documentdb-create-account
ROBOTS: NOINDEX, NOFOLLOW


---

# Create an Azure Cosmos DB account with MongoDB API
Azure Cosmos DB databases can now be used as the data store for apps written for MongoDB. To use this functionality, you need an Azure account and an Azure Cosmos DB account. This tutorial walks you through the process of creating an Azure Cosmos DB account for use with MongoDB apps. 

You can create an Azure Cosmos DB with support for MongoDB account using either the Azure portal or Azure CLI with Azure Resource Manager templates. This article shows how to create an Azure Cosmos DB with support for MongoDB account using the Azure portal. To create an account using Azure CLI with Azure Resource Manager, see [Automate Azure Cosmos DB account management using Azure CLI 2.0](documentdb-automation-resource-manager-cli.md).

## Prerequisite
An Azure account. If you don't have an Azure account, create a [free Azure account](https://azure.microsoft.com/free/) now.
## Create an Azure Cosmos DB account

1. In an internet browser, sign in to the [Azure Portal](https://portal.azure.com).
2. In the left navigation, click on **Azure Cosmos DB**.

    ![Screen shot of the Portal left navigation, highlighting DocumentDB NoSQL entry](./media/documentdb-create-mongodb-account/portalleftnav.png)

3. Alternatively, click **More services >**, type **DocumentDB** in the top search bar, and click **Azure Cosmos DB**.

    ![Screen shot of the More services blade, searching for DocumentDB NoSQL entry](./media/documentdb-create-mongodb-account/more-services-search.PNG)

4. On the top of the **Azure Cosmos DB** blade, click **+ Add** on the top action bar.

    ![Screen shot of the Add button on the Cosmos DB resource blade](./media/documentdb-create-mongodb-account/add-documentdb-account.png)

5. In the **Azure Cosmos DB account** blade, specify the desired configuration for the account.

   ![Screen shot of the New Azure Cosmos DB with protocol support for MongoDB blade](./media/documentdb-create-mongodb-account/create-documentdb-mongodb-account.PNG)

    - In the **ID** box, enter a name to identify the account.  When the **ID** is validated, a green check mark appears in the **ID** box. The **ID** value becomes the host name within the URI. The **ID** may contain only lowercase letters, numbers, and the '-' character, and must be between 3 and 50 characters. Note that *documents.azure.com* is appended to the endpoint name you choose, the result of which will become your account endpoint.

    - For **API**, select **MongoDB**. This specifies the communication API you would like to use to interact with your Azure Cosmos DB database.

    - For **Subscription**, select the Azure subscription that you want to use for the account. If your account has only one subscription, that account is selected by default.

    - In **Resource Group**, select or create a resource group for the account.  By default, an existing Resource group under the Azure subscription will be chosen.  You may, however, choose to select to create a new resource group to which you would like to add the account. For more information, see [Using the Azure portal to manage your Azure resources](../azure-portal/resource-group-portal.md).

    - Use **Location** to specify the geographic location in which to host the account.

6. Once the new account options are configured, click **Create**.  It can take a few minutes to create the account.

   You can monitor your progress from the Notifications hub.  

   ![Screen shot of the Notifications hub, showing that the Azure Cosmos DB account is being created](./media/documentdb-create-mongodb-account/create-documentdb-mongodb-deployment-status.png)  

7. To access your new account, click **Azure Cosmos DB** on the left-hand menu. In your list of regular DocumentDB and DocumentDB with Mongo protocol support accounts, click on your new account's name.
8. Your Azure Cosmos DB account is now ready to use with your MongoDB app.

   ![Screen shot of the default account blade](./media/documentdb-create-mongodb-account/defaultaccountblade.png)

## Next steps
* Learn how to [connect](documentdb-connect-mongodb-account.md) to a DocumentDB account with protocol support for MongoDB.
