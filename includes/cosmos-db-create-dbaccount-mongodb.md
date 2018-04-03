---
 title: Create an Azure Cosmos DB MongoDB API account
 description: Describes how to create an Azure Cosmos DB MongoDB API account in the Azure portal
 services: cosmos-db
 author: mimig1
 ms.service: cosmos-db
 ms.topic: include
 ms.date: 03/20/2018
 ms.author: mimig
 ms.custom: include file
---

1. In a new window, sign in to the [Azure portal](https://portal.azure.com/).
2. In the left menu, click **Create a resource**, click **Databases**, and then under **Azure Cosmos DB**, click **Create**.
   
   ![Screen shot of the Azure portal, highlighting More Services, and Azure Cosmos DB](./media/cosmos-db-create-dbaccount-mongodb/create-nosql-db-databases-json-tutorial-1.png)

3. In the **New account** blade, specify **MongoDB** as the API and fill out your desired configuration for the Azure Cosmos DB account.
 
    ![Screen shot of the New Azure Cosmos DB blade](./media/cosmos-db-create-dbaccount-mongodb/create-nosql-db-databases-json-tutorial-2.png)

    * **ID** must be a unique name you wish to use to identify your Azure Cosmos DB account. It may only contain lower case letters, numbers, the '-' character, and must be between 3 and 50 characters.
    * **Subscription** is your Azure subscription. It will be filled out for you.
    * **Resource Group** is the resource group name for your Azure Cosmos DB account.
    * **Location** is the geographic location where your Azure Cosmos DB instance is located. Choose the location closest to your users.

4. Click **Create** to create the account.
5. On the toolbar, click **Notifications** to monitor the deployment process.

    ![Deployment started notification](./media/cosmos-db-create-dbaccount-mongodb/azure-documentdb-nosql-notification.png)

6.  When the deployment is complete, open the new account from the All Resources tile. 

    ![Azure Cosmos DB account on the All Resources tile](./media/cosmos-db-create-dbaccount-mongodb/azure-documentdb-all-resources.png)
