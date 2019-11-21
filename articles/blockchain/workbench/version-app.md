---
title: Blockchain app versioning - Azure Blockchain Workbench
description: How to use application versions in Azure Blockchain Workbench Preview.
ms.date: 11/20/2019
ms.topic: article
ms.reviewer: brendal
#Customer intent: As a developer, I want to create and use multiple versions of an Azure Blockchain Workbench app.
---
# Azure Blockchain Workbench Preview application versioning

You can create and use multiple versions of an Azure Blockchain Workbench Preview app. If multiple versions of the same application are uploaded, a version history is available and users can choose which version they want to use.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* A Blockchain Workbench deployment. For more information, see [Azure Blockchain Workbench deployment](deploy.md) for details on deployment
* A deployed blockchain application in Blockchain Workbench. See [Create a blockchain application in Azure Blockchain Workbench](create-app.md)

## Add an app version

To add a new version, upload the new configuration and smart contract files to Blockchain Workbench.

1. In a web browser, navigate to the Blockchain Workbench web address. For example, `https://{workbench URL}.azurewebsites.net/` For information on how to find your Blockchain Workbench web address, see [Blockchain Workbench Web URL](deploy.md#blockchain-workbench-web-url)
2. Sign in as a [Blockchain Workbench administrator](manage-users.md#manage-blockchain-workbench-administrators).
3. Select the blockchain application you want to update with another version.
4. Select **Add version**. The **Add version** pane is displayed.
5. Choose the new version contract configuration and contract code files to upload. The configuration file is automatically validated. Fix any validation errors before you deploy the application.
6. Select **Add version** to add the new blockchain application version.

    ![Add a new version](media/version-app/add-version.png)

Deployment of the blockchain application can take a few minutes. When deployment is finished, refresh the application page. Choosing the application and selecting the **Version history** button, displays the version history of the application.

> [!IMPORTANT]
> Previous versions of the application are disabled. You can individually re-enable past versions.
>
> You may need to re-add members to application roles if changes were made to the application roles in the new version.

## Using app versions

By default, the latest enabled version of the application is used in Blockchain Workbench. If you want to use a previous version of an application, you need to choose the version from the application page first.

1. In Blockchain Workbench application section, select the application checkbox that contains the contract you want to use. If previous versions are enabled, the version history button is available.
2. Select the **Version history** button.
3. In the version history pane, choose the version of the application by selecting the link in the *Date modified* column.

    ![Choose a previous version](media/version-app/use-version.png)

    You can create new contracts or take actions on previous version contracts. The version of the application is displayed following the application name and a warning is displayed about the older version.

## Next steps

* [Azure Blockchain Workbench troubleshooting](troubleshooting.md)
