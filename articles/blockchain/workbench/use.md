---
title: Using applications in Azure Blockchain Workbench
description: How to use application contracts in Azure Blockchain Workbench.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 10/1/2018
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
#customer intent: As a developer, I want to use a blockchain application I created in Azure Blockchain Workbench.
---

# Using applications in Azure Blockchain Workbench

You can use Blockchain Workbench to create and take actions on contracts. You can also view contract details such as status and transaction history.

## Prerequisites

* A Blockchain Workbench deployment. For more information, see [Azure Blockchain Workbench deployment](deploy.md) for details on deployment
* A deployed blockchain application in Blockchain Workbench. See [Create a blockchain application in Azure Blockchain Workbench](create-app.md)

[Open the Blockchain Workbench](deploy.md#blockchain-workbench-web-url) in your browser.

![Blockchain Workbench](./media/use/workbench.png)

You need to sign in as a member of the Blockchain Workbench. If there are no applications listed, you are a member of Blockchain Workbench but not a member of any applications. The Blockchain Workbench administrator can assign members to applications.

## Create new contract 

To create a new contract, you need to be a member specified as an contract **initiator**. For information defining application roles and initiators for the contract, see [workflows in the configuration overview](configuration.md#workflows). For information on assigning members to application roles, see [add a member to application](manage-users.md#add-member-to-application).

1. In Blockchain Workbench application section, select the application tile that contains the contract you want to create. A list of active contracts are displayed.

2. To create a new contract, select **New contract**.

    ![New contract button](./media/use/contract-list.png)

3. The **New contract** pane is displayed. Specify the initial parameters values. Select **Create**.

    ![New contract pane](./media/use/new-contract.png)

    The newly created contract is displayed in the list with the other active contracts.

    ![Active contracts list](./media/use/active-contracts.png)

## Take action on contract

Depending on the state the contract is in, members can take actions to transition to the next state of the contract. Actions are defined as [transitions](configuration.md#transitions) within a [state](configuration.md#states). Members belonging to an allowed application or instance role for the transition can take the action. 

1. In Blockchain Workbench application section, select the application tile that contains the contract to take the action.
2. Select the contract in the list. Details about the contract are displayed in different sections. 

    ![Contract details](./media/use/contract-details.png)

    | Section  | Description  |
    |---------|---------|
    | Status | Lists the current progress within the contract stages |
    | Details | The current values of the contract |
    | Action | Details about the last action |
    | Activity | Transaction history of the contract |
    
3. In the **Action** section, select **Take action**.

4. The details about the current state of the contract are displayed in a pane. Choose the action you want to take in the drop-down. 

    ![Choose action](./media/use/choose-action.png)

5. Select **Take action** to initiate the action.
6. If parameters are required for the action, specify the values for the action.

    ![Take action](./media/use/take-action.png)

7. Select **Take action** to execute the action.

## Next steps

> [!div class="nextstepaction"]
> [How to troubleshoot Azure Blockchain Workbench](troubleshooting.md)
