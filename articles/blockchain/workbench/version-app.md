---
title: Blockchain application versioning in Azure Blockchain Workbench
description: How to use application versions in Azure Blockchain Workbench.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 1/7/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: brendal
manager: femila
#customer intent: As a developer, I want to create and use multiple versions of an Azure Blockchain Workbench app.
---
# Azure Blockchain Workbench application versioning

You can create and use multiple versions of an Azure Blockchain Workbench app.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* A Blockchain Workbench deployment. For more information, see [Azure Blockchain Workbench deployment](deploy.md) for details on deployment
* A deployed blockchain application in Blockchain Workbench. See [Create a blockchain application in Azure Blockchain Workbench](create-app.md)

## Add an app version

You can add new versions of an application to Blockchain Workbench. To add a new version, upload the new configuration and smart contract files to Blockchain Workbench. If multiple versions of the same application are uploaded, a version history is available and users can choose which version they want to use.

1. In a web browser, navigate to the Blockchain Workbench web address. For example, `https://{workbench URL}.azurewebsites.net/` For information on how to find your Blockchain Workbench web address, see [Blockchain Workbench Web URL](deploy.md#blockchain-workbench-web-url)
2. Sign in as a [Blockchain Workbench administrator](manage-users.md#manage-blockchain-workbench-administrators).
3. Select the blockchain application you want to update with another version.
4. Select **Add version**. The **New application** pane is displayed.
1. Select **Upload the contract configuration** > **Browse** to locate the **HelloBlockchain.json** configuration file you created. The configuration file is automatically validated. Select the **Show** link to display validation errors. Fix validation errors before you deploy the application.
1. Select **Upload the contract code** > **Browse** to locate the **HelloBlockchain.sol** smart contract code file. The code file is automatically validated. Select the **Show** link to display validation errors. Fix validation errors before you deploy the application.
1. Select **Deploy** to create the blockchain application based on the configuration and smart contract files.

Deployment of the blockchain application takes a few minutes. When deployment is finished, the new application is displayed in **Applications**. 

## Using app versions

Select the version.

## Next steps

In this how-to article, you've created a basic request and response application. To learn how to use the application, continue to the next how-to article.

> [!div class="nextstepaction"]
> [Using a blockchain application](use.md)
