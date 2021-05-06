---
title: Get access key for an Event Grid resource
description: This article describes how to get access key for an Event Grid topic or domain
ms.topic: how-to
ms.date: 07/07/2020
---

# Get access keys for Event Grid resources (topics or domains)
Access keys are used to authenticate an application publishing events to Azure Event Grid resources (topics and domains). We recommend regenerating your keys regularly and storing them securely. You are provided with two access keys so that you can maintain connections using one key while regenerating the other.

This article describes how to get access keys for an Event Grid resource (topic or domain) using Azure portal, PowerShell, or CLI. 

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
Use the [az eventgrid topic key list](/cli/azure/eventgrid/topic/key#az_eventgrid_topic_key_list) to get access keys for topics. 

```azurecli-interactive
az eventgrid topic key list --resource-group <RESOURCE GROUP NAME> --name <TOPIC NAME>
```

Use [az eventgrid domain key list](/cli/azure/eventgrid/domain/key#az_eventgrid_domain_key_list) to get access keys for domains. 

```azurecli-interactive
az eventgrid domain key list --resource-group <RESOURCE GROUP NAME> --name <DOMAIN NAME>
```

## Next steps
See the following article: [Authenticate publishing clients](security-authenticate-publishing-clients.md). 
