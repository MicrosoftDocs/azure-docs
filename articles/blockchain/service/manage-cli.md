---
title: Manage Azure Blockchain Service using Azure CLI
description: How to manage Azure Blockchain Service with Azure CLI
ms.date: 07/23/2020
ms.topic: how-to
ms.reviewer: ravastra
#Customer intent: As a network operator, I want to use CLI to configure transaction nodes.
---

# Manage Azure Blockchain Service using Azure CLI

In addition to the Azure portal, you can use Azure CLI to manage blockchain members and transaction nodes for your Azure Blockchain Service.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

If you prefer to install and use the CLI locally, see [install Azure CLI](/cli/azure/install-azure-cli).

## Prepare your environment

1. Sign in.

    Sign in using the [az login](/cli/azure/reference-index#az_login) command if you're using a local install of the CLI.

    ```azurecli
    az login
    ```

    Follow the steps displayed in your terminal to complete the authentication process.

1. Install the Azure CLI extension.

    When working with extension references for the Azure CLI, you must first install the extension.  Azure CLI extensions give you access to experimental and pre-release commands that have not yet shipped as part of the core CLI.  To learn more about extensions including updating and uninstalling, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

    Install the [extension for Azure Blockchain Service](/cli/azure/blockchain) by running the following command:

    ```azurecli-interactive
    az extension add --name blockchain
    ```

## Create blockchain member

Example [creates a blockchain member](/cli/azure/blockchain/member#az_blockchain_member_create) in Azure Blockchain Service that runs the Quorum ledger protocol in a new consortium.

```azurecli
az blockchain member create \
                            --resource-group <myResourceGroup> \
                            --name <myMemberName> \
                            --location <myBlockchainLocation> \
                            --password <strongMemberAccountPassword> \
                            --protocol "Quorum" \
                            --consortium <myConsortiumName> \
                            --consortium-management-account-password <strongConsortiumManagementPassword> \
                            --sku <skuName>
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources are created. |
| **name** | A unique name that identifies your Azure Blockchain Service blockchain member. The name is used for the public endpoint address. For example, `myblockchainmember.blockchain.azure.com`. |
| **location** | Azure region where the blockchain member is created. For example, `eastus`. Choose the location that is closest to your users or your other Azure applications. Features may not be available in some regions. |
| **password** | The password for the member's default transaction node. Use the password for basic authentication when connecting to blockchain member's default transaction node public endpoint. The password must meet three of the following four requirements: length needs to be between 12 & 72 characters, 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not number sign(#), percent(%), comma(,), star(*), back quote(\`), double quote("), single quote('), dash(-) and semicolumn(;)|
| **protocol** | Blockchain protocol. Currently, *Quorum* protocol is supported. |
| **consortium** | Name of the consortium to join or create. For more information on consortia, see [Azure Blockchain Service consortium](consortium.md). |
| **consortium-management-account-password** | The consortium account password is also known as the member account password. The member account password is used to encrypt the private key for the Ethereum account that is created for your member. You use the member account and member account password for consortium management. |
| **sku** | Tier type. *Standard* or *Basic*. Use the *Basic* tier for development, testing, and proof of concepts. Use the *Standard* tier for production grade deployments. You should also use the *Standard* tier if you are using Blockchain Data Manager or sending a high volume of private transactions. Changing the pricing tier between basic and standard after member creation is not supported. |

## Change blockchain member passwords or firewall rules

Example [updates a blockchain member](/cli/azure/blockchain/member#az_blockchain_member_update)'s password, consortium management password, and firewall rule.

```azurecli
az blockchain member update \
                     --resource-group <myResourceGroup> \
                     --name <myMemberName> \
                     --password <strongMemberAccountPassword> \
                     --consortium-management-account-password <strongConsortiumManagementPassword> \
                     --firewall-rules <firewallRules>
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources are created. |
| **name** | Name that identifies your Azure Blockchain Service member. |
| **password** | The password for the member's default transaction node. Use the password for basic authentication when connecting to blockchain member's default transaction node public endpoint. The password must meet three of the following four requirements: length needs to be between 12 & 72 characters, 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not number sign(#), percent(%), comma(,), star(*), back quote(\`), double quote("), single quote('), dash(-) and semicolumn(;)|
| **consortium-management-account-password** | The consortium account password is also known as the member account password. The member account password is used to encrypt the private key for the Ethereum account that is created for your member. You use the member account and member account password for consortium management. |
| **firewall-rules** | Start and end IP address for IP allow list. |

## Create transaction node

[Create a transaction node](/cli/azure/blockchain/transaction-node#az_blockchain_transaction_node_create) inside an existing blockchain member. By adding transaction nodes, you can increase security isolation and distribute load. For example, you could have a transaction node endpoint for different client applications.

```azurecli
az blockchain transaction-node create \
                     --resource-group <myResourceGroup> \
                     --member-name <myMemberName> \
                     --password <strongTransactionNodePassword> \
                     --name <myTransactionNodeName>
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources are created. |
| **location** | Azure region of the blockchain member. |
| **member-name** | Name that identifies your Azure Blockchain Service member. |
| **password** | The password for the transaction node. Use the password for basic authentication when connecting to the transaction node public endpoint. The password must meet three of the following four requirements: length needs to be between 12 & 72 characters, 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not number sign(#), percent(%), comma(,), star(*), back quote(\`), double quote("), single quote('), dash(-) and semicolumn(;)|
| **name** | Transaction node name. |

## Change transaction node password

Example [updates a transaction node](/cli/azure/blockchain/transaction-node#az_blockchain_transaction_node_update) password.

```azurecli
az blockchain transaction-node update \
                     --resource-group <myResourceGroup> \
                     --member-name <myMemberName> \
                     --password <strongTransactionNodePassword> \
                     --name <myTransactionNodeName>
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources exist. |
| **member-name** | Name that identifies your Azure Blockchain Service member. |
| **password** | The password for the transaction node. Use the password for basic authentication when connecting to the transaction node public endpoint. The password must meet three of the following four requirements: length needs to be between 12 & 72 characters, 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not number sign(#), percent(%), comma(,), star(*), back quote(\`), double quote("), single quote('), dash(-) and semicolumn(;)|
| **name** | Transaction node name. |

## List API keys

API keys can be used for node access similar to user name and password. There are two API keys to support key rotation. Use the following command to [list your API keys](/cli/azure/blockchain/member#az_blockchain_transaction_node_list-api-key).

```azurecli
az blockchain member list-api-key \
                            --resource-group <myResourceGroup> \
                            --name <myMemberName>
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources exist. |
| **name** | Name of the Azure Blockchain Service blockchain member |

## Regenerate API keys

Use the following command to [regenerate your API keys](/cli/azure/blockchain/member#az_blockchain_transaction_node_regenerate-api-key).

```azurecli
az blockchain member regenerate-api-key \
                            --resource-group <myResourceGroup> \
                            --name <myMemberName> \
                            [--key-name {<keyValue1>, <keyValue2>}]
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources exist. |
| **name** | Name of the Azure Blockchain Service blockchain member. |
| **keyName** | Replace \<keyValue\> with either key1, key2, or both. |

## Delete a transaction node

Example [deletes a blockchain member transaction node](/cli/azure/blockchain/transaction-node#az_blockchain_transaction_node_delete).

```azurecli
az blockchain transaction-node delete \
                     --resource-group <myResourceGroup> \
                     --member-name <myMemberName> \
                     --name <myTransactionNode>
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources exist. |
| **member-name** | Name of the Azure Blockchain Service blockchain member that also includes the transaction node name to be deleted. |
| **name** | Transaction node name to delete. |

## Delete a blockchain member

Example [deletes a blockchain member](/cli/azure/blockchain/member#az_blockchain_member_delete).

```azurecli
az blockchain member delete \
                     --resource-group <myResourceGroup> \
                     --name <myMemberName>

```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources exist. |
| **name** | Name of the Azure Blockchain Service blockchain member to be deleted. |

## Azure Active Directory

### Grant access for Azure AD user

```azurecli
az role assignment create \
                            --role <role> \
                            --assignee <assignee> \
                            --scope /subscriptions/<subId>/resourceGroups/<groupName>/providers/Microsoft.Blockchain/blockchainMembers/<myMemberName>
```

| Parameter | Description |
|---------|-------------|
| **role** | Name of the Azure AD role. |
| **assignee** | Azure AD user ID. For example, `user@contoso.com` |
| **scope** | Scope of the role assignment. Can be either a blockchain member or transaction node. |

**Example:**

Grant node access for Azure AD user to blockchain **member**:

```azurecli
az role assignment create \
                            --role 'myRole' \
                            --assignee user@contoso.com \
                            --scope /subscriptions/mySubscriptionId/resourceGroups/contosoResourceGroup/providers/Microsoft.Blockchain/blockchainMembers/contosoMember1
```

**Example:**

Grant node access for Azure AD user to blockchain **transaction node**:

```azurecli
az role assignment create \
                            --role 'MyRole' \
                            --assignee user@contoso.com \
                            --scope /subscriptions/mySubscriptionId/resourceGroups/contosoResourceGroup/providers/Microsoft.Blockchain/blockchainMembers/contosoMember1/transactionNodes/contosoTransactionNode1
```

### Grant node access for Azure AD group or application role

```azurecli
az role assignment create \
                            --role <role> \
                            --assignee-object-id <assignee_object_id>
```

| Parameter | Description |
|---------|-------------|
| **role** | Name of the Azure AD role. |
| **assignee-object-id** | Azure AD group ID or application ID. |
| **scope** | Scope of the role assignment. Can be either a blockchain member or transaction node. |

**Example:**

Grant node access for **application role**

```azurecli
az role assignment create \
                            --role 'myRole' \
                            --assignee-object-id 22222222-2222-2222-2222-222222222222 \
                            --scope /subscriptions/mySubscriptionId/resourceGroups/contosoResourceGroup/providers/Microsoft.Blockchain/blockchainMembers/contosoMember1
```

### Remove Azure AD node access

```azurecli
az role assignment delete \
                            --role <myRole> \
                            --assignee <assignee> \
                            --scope /subscriptions/mySubscriptionId/resourceGroups/<myResourceGroup>/providers/Microsoft.Blockchain/blockchainMembers/<myMemberName>/transactionNodes/<myTransactionNode>
```

| Parameter | Description |
|---------|-------------|
| **role** | Name of the Azure AD role. |
| **assignee** | Azure AD user ID. For example, `user@contoso.com` |
| **scope** | Scope of the role assignment. Can be either a blockchain member or transaction node. |

## Next steps

Learn how to [Configure Azure Blockchain Service transaction nodes with the Azure portal](configure-transaction-nodes.md).
