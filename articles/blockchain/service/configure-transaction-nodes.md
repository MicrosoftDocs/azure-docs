---
title: Azure Blockchain Service Transaction Node Configuration
description: How to configure Azure Blockchain Service transaction nodes
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 04/23/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: seal
manager: femila
#Customer intent: As a network operator, I want to use the Azure portal to create and configure transaction nodes.
---

# Configure Azure Blockchain Service transaction nodes

To quickly create and manage transaction nodes for your Azure Blockchain blockchain member, you can use Azure portal for configuration.

## Prerequisites

* [Create an Azure Blockchain member](create-member.md)

## Transaction node overview

Transaction nodes are used to send blockchain transactions to Azure Blockchain Service through a public endpoint. When you create a blockchain member, a default transaction node with the same name as the blockchain member is provisioned. The default transaction node can't be deleted.

To view the default transaction node details:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your Azure Blockchain Service member and select **Transaction nodes**.

    [screenshot]

Overview details include public endpoint addresses and public key.

## Create transaction node

You can add transaction nodes to your blockchain member. By adding transaction nodes, you can increase scalability or distribute load. For example, you could have a transaction node endpoint for different client applications.

To add a transaction node:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your Azure Blockchain Service member and select **Transaction nodes > Add**.
1. Complete the settings for the new transaction node.

    [screenshot]

    | Setting | Description |
    |---------|-------------|
    | Name | Transaction node name. The name is used to create the DNS address for the transaction node endpoint. For example, `newnode-mymanagedledger.blockchain.azure.com`. The node name cannot be changed once it is created. |
    | Password | Set a strong password. Use the password to access the transaction node endpoint with basic authentication.

1. Select **Create**.

    Provisioning a new transaction node takes about 10 minutes. Additional transaction nodes incur cost. For more information on costs, see [Azure pricing](https://azure.microsoft.com/pricing/).

## Connection security

Transaction node endpoints are secure and require authentication. You can connect to a transaction endpoint using HTTP basic authentication, an access key, or Azure AD authentication.

To view or change transaction node security settings:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to one of your Azure Blockchain Service member transaction nodes and select **Transaction nodes > Connection security**.

Security settings are organized in tabs by authentication type.

### Azure Active Directory access control

Azure Blockchain Service transaction node endpoints support Azure Active Directory (Azure AD) authentication. You can grant Azure AD user, group, and service principal access to your endpoint.

To grant Azure AD access control to your endpoint:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your Azure Blockchain Service member and select **Transaction nodes > Access control (IAM) > Add > Add role assignment**.

    [screenshot]

1. Create a new role assignment for a user, group, or service principal (application roles).

    [screenshot]

    | Setting | Action |
    |---------|-------------|
    | Role | Select **Owner**, **Contributor**, or **Reader**.
    | Assign access to | Select **Azure AD user, group, or service principal**.
    | Select | Search for the user, group, or service principal you want to add.

1. Select **Save** to add the role assignment.

For more information on Azure AD access control, see [Manage access to Azure resources using RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md)

For details on how to connect using Azure AD authentication, see [connect to your node using AAD authentication](configure-aad.md).

### Basic authentication

For HTTP basic authentication, user name and password credentials are passed in the HTTP header of the request to the endpoint. The user name is the name of your node and cannot be changed. Initially, the password set when the node is provisioned. Select the **change** link to update the password.

[screenshot]

### Access keys

For access key authentication, the access key is included in the endpoint URL. When the transaction node is provisioned, two access keys are generated. Either access key can be used for authentication. Two keys enable you change and rotate keys.

[screenshot]

### Firewall rules

Firewall rules enable you to limit the IP addresses that can attempt to authenticate to your transaction node.  If no firewall rules are configured for your transaction node, it cannot be accessed by any party.  

To view transaction node connection strings:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to one of your Azure Blockchain Service member transaction nodes and select **Transaction nodes > Firewall rules**.

To enable a single IP address to access your transaction node, you can enter the address as a rule.  For example, if you want to enable 10.221.34.142 to access your transaction node, you would create a rule as follows:

1. Enter a rule name.  This can be anything you like.
2. In the Start IP field, enter the IP address you want to enable.  In this case, 10.221.34.142
3. In the End IP field, enter the same IP address 10.221.34.142

[screenshot]

If you want to enable a range of IP addresses, such as the entire subnet of 10.221.34.xxx, you would enter the rule as follows:

1. Enter a rule name of your choosing.
2. In the Start IP field, enter 10.221.34.0
3. In the End IP field, enter 10.221.34.255

[screenshot]

If you want to open the firewall to any IP address, simply create a rule with a Start IP of 0.0.0.0 and an End IP of 255.255.255.255.

[screenshot]

## Connection strings

Connection string syntax for your transaction node is provided for Basic Authentication, as well as for Access Keys both over HTTPS and WSS.

To view transaction node connection strings:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to one of your Azure Blockchain Service member transaction nodes and select **Transaction nodes > Connection strings**.

    [screenshot]
    
## Sample code

Sample code is provided to quickly enable connecting to your transaction node via Web3, Nethereum, Web3js and Truffle.

To view transaction node sample code:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to one of your Azure Blockchain Service member transaction nodes and select **Transaction nodes > Sample code**.
3. Choose the tab of the code sample you want to view/copy.

    [screenshot]

## Next steps

> [!div class="nextstepaction"]
> [Configure transaction nodes using Azure CLI](manage-cli.md)
