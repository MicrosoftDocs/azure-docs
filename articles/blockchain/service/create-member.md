---
title: Create an Azure Blockchain Service member - Azure portal
description: Create an Azure Blockchain Service member for a blockchain consortium using the Azure portal.
ms.reviewer: ravastra
ms.date: 07/16/2020
ms.topic: quickstart
ms.custom:
  - references_regions
  - mode-portal
#Customer intent: As a network operator, I want use Azure Blockchain Service so that I can create a managed ledger on Azure.
---

# Quickstart: Create an Azure Blockchain Service blockchain member using the Azure portal

In this quickstart, you deploy a new blockchain member and consortium in Azure Blockchain Service using the Azure portal.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

None.

## Create a blockchain member

An Azure Blockchain Service member is a blockchain node in a private consortium blockchain network. When provisioning a member, you can create or join a consortium network. You need at least one member for a consortium network. The number of blockchain members needed by participants depends on your scenario. Consortium participants may have one or more blockchain members or they may share members with other participants. For more information on consortia, see [Azure Blockchain Service consortium](consortium.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource** in the upper left-hand corner of the Azure portal.
1. Select **Blockchain** > **Azure Blockchain Service (preview)**.

    ![Create Service](./media/create-member/create-member.png)

    Setting | Description
    --------|------------
    Subscription | Select the Azure subscription that you want to use for your service. If you have multiple subscriptions, choose the subscription in which you get billed for the resource.
    Resource group | Create a new resource group name or choose an existing one from your subscription.
    Region | Choose a region to create the member. All members of the consortium must be in the same location. Features may not be available in some regions. Azure Blockchain Data Manager is available in the following Azure regions: East US and West Europe.
    Protocol | Currently, Azure Blockchain Service Preview supports the Quorum protocol.
    Consortium | For a new consortium, enter a unique name. If joining a consortium through an invite, choose the consortium you are joining. For more information on consortia, see [Azure Blockchain Service consortium](consortium.md).
    Name | Choose a unique name for the Azure Blockchain Service member. The blockchain member name can only contain lowercase letters and numbers. The first character must be a letter. The value must be between 2 and 20 characters long.
    Member account password | The member account password is used to encrypt the private key for the Ethereum account that is created for your member. You use the member account and member account password for consortium management.
    Pricing | The node configuration and cost for your new service. Select the **Change** link to choose between **Standard** and **Basic** tiers. Use the *Basic* tier for development, testing, and proof of concepts. Use the *Standard* tier for production grade deployments. Also use the *Standard* tier if you are using Blockchain Data Manager or sending a high volume of private transactions. Changing the pricing tier between basic and standard after member creation is not supported.
    Node password | The password for the member's default transaction node. Use the password for basic authentication when connecting to blockchain member's default transaction node public endpoint.

1. Select **Review + create** to validate your settings. Select **Create** to provision the service. Provisioning takes about 10 minutes.
1. Select **Notifications** on the toolbar to monitor the deployment process.
1. After deployment, navigate to your blockchain member.

Select **Overview**, you can view the basic information about your service including the RootContract address and member account.

![Blockchain member overview](./media/create-member/overview.png)

## Clean up resources

You can use the member you created for the next quickstart or tutorial. When no longer needed, you can delete the resources by deleting the `myResourceGroup` resource group you created for the quickstart.

To delete the resource group:

1. In the Azure portal, navigate to **Resource group** in the left navigation pane and select the resource group you want to delete.
2. Select **Delete resource group**. Verify deletion by entering the resource group name and select **Delete**.

## Next steps

In this quickstart, you deployed an Azure Blockchain Service member and a new consortium. Try the next quickstart to use Azure Blockchain Development Kit for Ethereum to attach to an Azure Blockchain Service member.

> [!div class="nextstepaction"]
> [Use Visual Studio Code to connect to Azure Blockchain Service](connect-vscode.md)
