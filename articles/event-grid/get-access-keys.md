---
title: Get access key for an Event Grid resource
description: This article describes how to get access key for an Event Grid topic or domain
ms.topic: how-to
ms.date: 06/17/2024 
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Get access keys for Event Grid resources (topics or domains)
Access keys are used to authenticate an application publishing events to Azure Event Grid resources (topics and domains). We recommend regenerating your keys regularly and storing them securely. You're provided with two access keys so that you can maintain connections using one key while regenerating the other.

This article describes how to get access keys for an Event Grid resource (topic or domain) using Azure portal, PowerShell, or CLI. 

> [!IMPORTANT]
> From August 20, 2024 to August 31, 2024, Azure Event Grid will rollout a security improvement which will increase the SAS key size from 44 to 84 characters. This change is being made to strengthen the security of your data in Event Grid resources. The change doesn't impact any application or service that currently publishes events to Event Grid with the old SAS key but it may impact only if you regenerate the SAS key of your Event Grid topics, domains, namespaces, and partner topics, after the update.
> 
> We recommend that you regenerate your SAS key on or after August 31, 2024. After regenerating the key, update any event publishing applications or services that use the old key to use the enhanced SAS key.


## Azure portal
In the Azure portal, switch to **Access keys** tab of the **Event Grid Topic** or **Event Grid Domain** page for your topic or domain.  

:::image type="content" source="./media/get-access-keys/azure-portal.png" alt-text="Access keys page":::

## Azure PowerShell
Use the [Get-AzEventGridTopicKey](/powershell/module/az.eventgrid/get-azeventgridtopickey) command to get access keys for topics. 

```azurepowershell-interactive
Get-AzEventGridTopicKey -ResourceGroup <RESOURCE GROUP NAME> -Name <TOPIC NAME>
```

Use [Get-AzEventGridDomainKey](/powershell/module/az.eventgrid/get-azeventgriddomainkey) command to get access keys for domains. 

```azurepowershell-interactive
Get-AzEventGridDomainKey -ResourceGroup <RESOURCE GROUP NAME> -Name <DOMAIN NAME>
```

## Azure CLI
Use the [`az eventgrid topic key list`](/cli/azure/eventgrid/topic/key#az-eventgrid-topic-key-list) to get access keys for topics. 

```azurecli-interactive
az eventgrid topic key list --resource-group <RESOURCE GROUP NAME> --name <TOPIC NAME>
```

Use [`az eventgrid domain key list`](/cli/azure/eventgrid/domain/key#az-eventgrid-domain-key-list) to get access keys for domains. 

```azurecli-interactive
az eventgrid domain key list --resource-group <RESOURCE GROUP NAME> --name <DOMAIN NAME>
```

## Next steps
See the following article: [Authenticate publishing clients](security-authenticate-publishing-clients.md). 
