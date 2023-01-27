---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.custom: ignite-2022
ms.date: 01/30/2022
---
On the *Create Azure Cosmos DB Account* page, fill out the form as follows.

1. For the **Resource Group**, choose the same resource group from the dropdown list as you used for your web app in App Service (*msdocs-expressjs-mongodb-quickstart*). This logically groups together all of the components needed for this application together in the same resource group for easier discoverability and management.

1. Enter an **Account Name** of **msdocs-expressjs-mongodb-database-XYZ** for the name of the Azure Cosmos DB instance where XYZ is any three unique characters.  Azure Cosmos DB account names must be unique across Azure. The name must be between 3 and 44 characters in length and only contain lowercase letters, numbers and the hyphen (-) symbol.

1. For the **Location**, select the same Azure location as you used for your App service web app.  It is important to host your application and database in the same Azure location to minimize network latency between different components of the solution.

1. If the **Free Tier Discount** is available for your account, you may apply it.

1. Select **Review + create** to go to the confirmation page and then select **Create** to create your database.

Creating a new Azure Cosmos DB instance typically takes about 5 minutes.
