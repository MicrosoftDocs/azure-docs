---
title: Azure Blockchain Service Create and Manage Blockchain Service with Azure CLI
description: How to create and manage Azure Blockchain Service with Azure CLI
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 04/16/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: seal
manager: femila
#Customer intent: As a network operator, I want to use CLI to configure transaction nodes.
---

# Create and Manage Blockchain Service with Azure CLI

In addition to the Azure Portal, you can use Azure CLI to quickly create and manage blockchain members and transaction nodes for your Azure Blockchain Service.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

Make sure that you have installed the latest [Azure CLI](/cli/azure/install-az-cli2) and logged to an Azure account in with [az login](/cli/azure/reference-index).

In the following examples, replace example `<parameter names>` with your own values. 

## Create blockchain member
myStartIpAddress: start of the IP address range for whitelisting<br/>
myEndIpAddress: end of the IP address range for whitelisting
skuName: Tier type. Use S0 for Standard and B0 for Basic.
```cli
az resource create -g <myResourceGroup> -n <myMemberName> --resource-type Microsoft.Blockchain/blockchainMembers --is-full-object --properties '{ "location": "<myBlockchainLocation>", "properties": {"password": "<myStrongPassword>", "protocol": "Quorum", "consortium": "<myConsortiumName>", "consortiumManagementAccountPassword": "<myConsortiumManagementAccountPassword>", "firewallRules": [ { "ruleName": "<myRuleName>", "startIpAddress": "<myStartIpAddress>", "endIpAddress": "<myEndIpAddress>" } ] }, "sku": { "name": "<skuName>" } }'
```

## Change blockchain member password
myStrongPassword: must have 3 of thefollowing: 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not '#', '\`', '*', '\"', ''', '-', '%', ';'"
```cli
az resource update -g <myResourceGroup> -n <myMemberName> --resource-type Microsoft.Blockchain/blockchainMembers --set properties.password="<myStrongPassword>" --remove properties.consortiumManagementAccountAddress
```

## Create transaction node
myStartIpAddress: start of the IP address range for whitelisting<br/>
myEndIpAddress: end of the IP address range for whitelisting
```cli
az resource create -g <myResourceGroup> -n <myMemberName>/transactionNodes/<myTransactionNode> --resource-type Microsoft.Blockchain/blockchainMembers  --is-full-object --properties '{ "location": "<myRegion>", "properties": { "password": "<myStrongPassword>", "firewallRules": [ { "ruleName": "<myRuleName>", "startIpAddress": "<myStartIpAddress>", "endIpAddress": "<myEndIpAddress>" } ] } }'
```

## Change transaction node password
myStrongPassword: must have 3 of thefollowing: 1 lower case character, 1 upper case character, 1 number, and 1 special character that is not '#', '\`', '*', '\"', ''', '-', '%', ';'"
```cli
az resource update -g <myResourceGroup> -n <myMemberName>/transactionNodes/<myTransactionNode> --resource-type Microsoft.Blockchain/blockchainMembers  --set properties.password="<myStrongPassword>"
```

## Change consortium management account password
The consortium management account is used for consortium membership management. Each member is uniquely identified by a consortium management account and you can change the password of this account with the following command.
```cli
az resource update -g <myResourceGroup> -n <myMemberName> --resource-type Microsoft.Blockchain/blockchainMembers --set properties.consortiumManagementAccountPassword="<myConsortiumManagementAccountPassword>" --remove properties.consortiumManagementAccountAddress
```
  
## Update firewall rules
myStartIpAddress: start of the IP address range for whitelisting<br/>
myEndIpAddress: end of the IP address range for whitelisting
```cli
az resource update -g <myResourceGroup> -n <myMemberName> --resource-type Microsoft.Blockchain/blockchainMembers --set properties.firewallRules='[ { "ruleName": "<myRuleName>", "startIpAddress": "<myStartIpAddress>", "endIpAddress": "<myEndIpAddress>" } ]' --remove properties.consortiumManagementAccountAddress
```

## List API keys
API keys can be used for node access similar to user name and password. There are two API keys to support key rotation. Use the following command to list your API keys.
```cli
az resource invoke-action -g <myResourceGroup> -n <myMemberName>/transactionNodes/<myTransactionNode> --action "listApiKeys" --resource-type Microsoft.Blockchain/blockchainMembers
```

## Regenerate API keys
Use the following command to regenerate your API keys. Replace keyValue with either key1 or key2.
```cli
az resource invoke-action -g <myResourceGroup> -n <myMemberName>/transactionNodes/<myTransactionNode> --action "regenerateApiKeys" --resource-type Microsoft.Blockchain/blockchainMembers --request-body '{"keyName":"<keyValue>"}'
```

## Delete a transaction node

```cli
az resource delete -g <myResourceGroup> -n <myMemberName>/transactionNodes/<myTransactionNode> --resource-type Microsoft.Blockchain/blockchainMembers
```

## Delete a blockchain member

```cli
az resource delete -g <myResourceGroup> -n <myMemberName> --resource-type Microsoft.Blockchain/blockchainMembers
```

## Azure Active Directory

### Grant node access for Azure AD user

```cli
az role assignment create --role <role> --assignee <assignee> --scope /subscriptions/<subId>/resourceGroups/<groupName>/providers/Microsoft.Blockchain/blockchainMembers/<myMemberName>
```

### Example 
Grant node access for Azure AD user to blockchain **member**:

az role assignment create --role "myRole" --assignee user@contoso.com --scope /subscriptions/mySubscriptionId/resourceGroups/<myResourceGroup>/providers/Microsoft.Blockchain/blockchainMembers/<myMemberName>


### Example 
Grant node access for Azure AD user to blockchain **transaction node**:

az role assignment create --role "MyRole" --assignee user@contoso.com --scope /subscriptions/mySubscriptionId/resourceGroups/<myResourceGroup>/providers/Microsoft.Blockchain/blockchainMembers/<myResourceGroup>/transactionNodes/<myTransactionNode>

### Grant node access for Azure AD usergroup or application role

```cli
az role assignment create --role <role> --assignee-object-id <assignee_object_id>
```

### Example 
Grant node access for **application role**

az role assignment create --role "myRole" --assignee-object-id 22222222-2222-2222-2222-222222222222 --scope /subscriptions/mySubscriptionId/resourceGroups/<myResourceGroup>/providers/Microsoft.Blockchain/blockchainMembers/<myMemberName>


### Remove Azure AD node access 

```cli
az role assignment delete --role <myRole> --assignee user@contoso.com --scope /subscriptions/mySubscriptionId/resourceGroups/<myResourceGroup>/providers/Microsoft.Blockchain/blockchainMembers/<myResourceGroup>/transactionNodes/<myTransactionNode>
```

## Next steps

> [!div class="nextstepaction"]
> [Configure Azure Blockchain Service transaction nodes with the Azure portal](configure-transaction-nodes.md)
