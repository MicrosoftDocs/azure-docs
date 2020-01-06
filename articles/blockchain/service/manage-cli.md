---
title: Manage Azure Blockchain Service using Azure CLI
description: How to manage Azure Blockchain Service with Azure CLI
ms.date: 11/22/2019
ms.topic: article
ms.reviewer: janders
#Customer intent: As a network operator, I want to use CLI to configure transaction nodes.
---

# Manage Azure Blockchain Service using Azure CLI

In addition to the Azure portal, you can use Azure CLI to manage blockchain members and transaction nodes for your Azure Blockchain Service.

Make sure that you have installed the latest [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and logged in to an Azure account in with `az login`.

In the following examples, replace example `<parameter names>` with your own values.

## Create blockchain member

Example creates a blockchain member in Azure Blockchain Service that runs the Quorum ledger protocol in a new consortium.

```azurecli
az resource create \
                     --resource-group <myResourceGroup> \
                     --name <myMemberName> \
                     --resource-type Microsoft.Blockchain/blockchainMembers \
                     --is-full-object \
                     --properties '{ "location":"<myBlockchainLocation>", "properties": {"password":"<myStrongPassword>", "protocol":"Quorum","consortium":"<myConsortiumName>", "consortiumManagementAccountPassword":"<myConsortiumManagementAccountPassword>", "firewallRules":[{"ruleName":"<myRuleName>","startIpAddress":"<myStartIpAddress>", "endIpAddress":"<myEndIpAddress>"}]}, "sku":{"name":"<skuName>"}}'
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources are created. |
| **name** | A unique name that identifies your Azure Blockchain Service blockchain member. The name is used for the public endpoint address. For example, `myblockchainmember.blockchain.azure.com`. |
| **location** | Azure region where the blockchain member is created. For example, `eastus`. Choose the location that is closest to your users or your other Azure applications. |
| **password** | The member account password. The member account password is used to authenticate to the blockchain member's public endpoint using basic authentication. The password must meet three of the following four requirements: length needs to be between 12 & 72 characters, 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not number sign(#), percent(%), comma(,), star(*), back quote(\`), double quote("), single quote('), dash(-) and semicolumn(;)|
| **protocol** | Public preview supports Quorum. |
| **consortium** | Name of the consortium to join or create. |
| **consortiumManagementAccountPassword** | The consortium management password. The password is used for joining a consortium. |
| **ruleName** | Rule name for whitelisting an IP address range. Optional parameter for firewall rules.|
| **startIpAddress** | Start of the IP address range for whitelisting. Optional parameter for firewall rules. |
| **endIpAddress** | End of the IP address range for whitelisting. Optional parameter for firewall rules. |
| **skuName** | Tier type. Use S0 for Standard and B0 for Basic. |

## Change blockchain member password

Example changes a blockchain member's password.

```azurecli
az resource update \
                     --resource-group <myResourceGroup> \
                     --name <myMemberName> \
                     --resource-type Microsoft.Blockchain/blockchainMembers \
                     --set properties.password='<myStrongPassword>' \
                     --remove properties.consortiumManagementAccountAddress
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources are created. |
| **name** | Name that identifies your Azure Blockchain Service member. |
| **password** | The member account password. The password must meet three of the following four requirements: length needs to be between 12 & 72 characters, 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not number sign(#), percent(%), comma(,), star(*), back quote(\`), double quote("), single quote('), dash(-) and semicolon(;). |

## Create transaction node

Create a transaction node inside an existing blockchain member. By adding transaction nodes, you can increase security isolation and distribute load. For example, you could have a transaction node endpoint for different client applications.

```azurecli
az resource create \
                     --resource-group <myResourceGroup> \
                     --name <myMemberName>/transactionNodes/<myTransactionNode> \
                     --resource-type Microsoft.Blockchain/blockchainMembers \
                     --is-full-object \
                     --properties '{"location":"<myRegion>", "properties":{"password":"<myStrongPassword>", "firewallRules":[{"ruleName":"<myRuleName>", "startIpAddress":"<myStartIpAddress>", "endIpAddress":"<myEndIpAddress>"}]}}'
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources are created. |
| **name** | Name of the Azure Blockchain Service blockchain member that also includes the new transaction node name. |
| **location** | Azure region where the blockchain member is created. For example, `eastus`. Choose the location that is closest to your users or your other Azure applications. |
| **password** | The transaction node password. The password must meet three of the following four requirements: length needs to be between 12 & 72 characters, 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not number sign(#), percent(%), comma(,), star(*), back quote(\`), double quote("), single quote('), dash(-) and semicolon(;). |
| **ruleName** | Rule name for whitelisting an IP address range. Optional parameter for firewall rules. |
| **startIpAddress** | Start of the IP address range for whitelisting. Optional parameter for firewall rules. |
| **endIpAddress** | End of the IP address range for whitelisting. Optional parameter for firewall rules.|

## Change transaction node password

Example changes a transaction node password.

```azurecli
az resource update \
                     --resource-group <myResourceGroup> \
                     --name <myMemberName>/transactionNodes/<myTransactionNode> \
                     --resource-type Microsoft.Blockchain/blockchainMembers \
                     --set properties.password='<myStrongPassword>'
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources exist. |
| **name** | Name of the Azure Blockchain Service blockchain member that also includes the new transaction node name. |
| **password** | The transaction node password. The password must meet three of the following four requirements: length needs to be between 12 & 72 characters, 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not number sign(#), percent(%), comma(,), star(*), back quote(\`), double quote("), single quote('), dash(-) and semicolon(;). |

## Change consortium management account password

The consortium management account is used for consortium membership management. Each member is uniquely identified by a consortium management account and you can change the password of this account with the following command.

```azurecli
az resource update \
                     --resource-group <myResourceGroup> \
                     --name <myMemberName> \
                     --resource-type Microsoft.Blockchain/blockchainMembers \
                     --set properties.consortiumManagementAccountPassword='<myConsortiumManagementAccountPassword>' \
                     --remove properties.consortiumManagementAccountAddress
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources are created. |
| **name** | Name that identifies your Azure Blockchain Service member. |
| **consortiumManagementAccountPassword** | The consortium management account password. The password must meet three of the following four requirements: length needs to be between 12 & 72 characters, 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not number sign(#), percent(%), comma(,), star(*), back quote(\`), double quote("), single quote('), dash(-) and semicolon(;). |
  
## Update firewall rules

```azurecli
az resource update \
                     --resource-group <myResourceGroup> \
                     --name <myMemberName> \
                     --resource-type Microsoft.Blockchain/blockchainMembers \
                     --set properties.firewallRules='[{"ruleName":"<myRuleName>", "startIpAddress":"<myStartIpAddress>", "endIpAddress":"<myEndIpAddress>"}]' \
                     --remove properties.consortiumManagementAccountAddress
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources exist. |
| **name** | Name of the Azure Blockchain Service blockchain member. |
| **ruleName** | Rule name for whitelisting an IP address range. Optional parameter for firewall rules.|
| **startIpAddress** | Start of the IP address range for whitelisting. Optional parameter for firewall rules.|
| **endIpAddress** | End of the IP address range for whitelisting. Optional parameter for firewall rules.|

## List API keys

API keys can be used for node access similar to user name and password. There are two API keys to support key rotation. Use the following command to list your API keys.

```azurecli
az resource invoke-action \
                            --resource-group <myResourceGroup> \
                            --name <myMemberName>/transactionNodes/<myTransactionNode> \
                            --action "listApiKeys" \
                            --resource-type Microsoft.Blockchain/blockchainMembers
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources exist. |
| **name** | Name of the Azure Blockchain Service blockchain member that also includes the new transaction node name. |

## Regenerate API keys

Use the following command to regenerate your API keys.

```azurecli
az resource invoke-action \
                            --resource-group <myResourceGroup> \
                            --name <myMemberName>/transactionNodes/<myTransactionNode> \
                            --action "regenerateApiKeys" \
                            --resource-type Microsoft.Blockchain/blockchainMembers \
                            --request-body '{"keyName":"<keyValue>"}'
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources exist. |
| **name** | Name of the Azure Blockchain Service blockchain member that also includes the new transaction node name. |
| **keyName** | Replace \<keyValue\> with either key1 or key2. |

## Delete a transaction node

Example deletes a blockchain member transaction node.

```azurecli
az resource delete \
                     --resource-group <myResourceGroup> \
                     --name <myMemberName>/transactionNodes/<myTransactionNode> \
                     --resource-type Microsoft.Blockchain/blockchainMembers
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources exist. |
| **name** | Name of the Azure Blockchain Service blockchain member that also includes the transaction node name to be deleted. |

## Delete a blockchain member

Example deletes a blockchain member.

```azurecli
az resource delete \
                     --resource-group <myResourceGroup> \
                     --name <myMemberName> \
                     --resource-type Microsoft.Blockchain/blockchainMembers
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
