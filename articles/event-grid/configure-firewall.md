---
title: Configure IP firewall for Azure Event Grid topics or domains 
description: This article describes how to configure firewall settings for Event Grid topics or domains. 
ms.topic: conceptual
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 03/24/2023
---

# Configure IP firewall for Azure Event Grid topics or domains 
By default, topic and domain are accessible from internet as long as the request comes with valid authentication and authorization. With IP firewall, you can restrict it further to only a set of IPv4 addresses or IPv4 address ranges in [CIDR (Classless Inter-Domain Routing)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation. Publishers originating from any other IP address will be rejected and will receive a 403 (Forbidden) response. For more information about network security features supported by Event Grid, see [Network security for Event Grid](network-security.md).

This article describes how to configure IP firewall settings for Azure Event Grid topics or domains.

## Use Azure portal
This section shows you how to use the Azure portal to enable public or private access while creating a topic or for an existing topic. The steps shown in this section are for topics. You can use similar steps to enable public or private access for **domains**. 

### When creating a topic
This section shows you how to enable public or private network access for an Event Grid topic or a domain. For step-by-step instructions to create a new topic, see [Create a custom topic](custom-event-quickstart-portal.md#create-a-custom-topic).

1. On the **Basics** page of the **Create topic** wizard, select **Next: Networking** at the bottom of the page after filling the required fields. 

    :::image type="content" source="./media/configure-firewall/networking-link.png" alt-text="Screenshot showing the selection of Networking link at the bottom of the page. ":::
1. If you want to allow clients to connect to the topic endpoint via a public IP address, keep the **Public access** option selected. 

    You can restrict access to the topic from specific IP addresses by specifying values for the **Address range** field. Specify a single IPv4 address or a range of IP addresses in Classless inter-domain routing (CIDR) notation. 

    :::image type="content" source="./media/configure-firewall/networking-page-public-access.png" alt-text="Screenshot showing the selection of Public access option on the Networking page of the Create topic wizard. ":::
1. To allow access to the Event Grid topic via a private endpoint, select the **Private access** option. 

    :::image type="content" source="./media/configure-firewall/networking-page-private-access.png" alt-text="Screenshot showing the selection of Private access option on the Networking page of the Create topic wizard. ":::    
1. Follow instructions in the [Add a private endpoint using Azure portal](configure-private-endpoints.md#use-azure-portal) section to create a private endpoint. 

### For an existing topic
1. In the [Azure portal](https://portal.azure.com), Navigate to your Event Grid topic or domain, and switch to the **Networking** tab.
2. Select **Public networks** to allow all networks, including the internet, to access the resource. 

    You can restrict access to the topic from specific IP addresses by specifying values for the **Address range** field. Specify a single IPv4 address or a range of IP addresses in Classless inter-domain routing (CIDR) notation. 

    :::image type="content" source="./media/configure-firewall/public-networks-page.png" alt-text="Screenshot that shows the Public network access page with Public networks selected.":::
3. Select **Private endpoints only** to allow only private endpoint connections to access this resource. Use the **Private endpoint connections** tab on this page to manage connections. 
 
    For step-by-step instructions to create a private endpoint connection, see [Add a private endpoint using Azure portal](configure-private-endpoints.md#use-azure-portal).

    :::image type="content" source="./media/configure-firewall/select-private-endpoints.png" alt-text="Screenshot that shows the Public network access page with Private endpoints only option selected.":::
4. Select **Save** on the toolbar. 

## Use Azure CLI
This section shows you how to use Azure CLI commands to create topics with inbound IP rules. The steps shown in this section are for topics. You can use similar steps to create inbound IP rules for **domains**. 


### Enable or disable public network access
By default, the public network access is enabled for topics and domains. You can also enable it explicitly or disable it. You can restrict traffic by configuring inbound IP firewall rules. 

#### Enable public network access while creating a topic

```azurecli-interactive
az eventgrid topic create \
    --resource-group $resourceGroupName \
    --name $topicName \
    --location $location \
    --public-network-access enabled
```


#### Disable public network access while creating a topic

```azurecli-interactive
az eventgrid topic create \
    --resource-group $resourceGroupName \
    --name $topicName \
    --location $location \
    --public-network-access disabled
```

> [!NOTE]
> When public network access is disabled for a topic or domain, traffic over public internet isn't allowed. Only private endpoint connections will be allowed to access these resources. 


#### Enable public network access for an existing topic

```azurecli-interactive
az eventgrid topic update \
    --resource-group $resourceGroupName \
    --name $topicName \
    --public-network-access enabled 
```

#### Disable public network access for an existing topic 

```azurecli-interactive
az eventgrid topic update \
    --resource-group $resourceGroupName \
    --name $topicName \
    --public-network-access disabled
```

### Create a topic with single inbound ip rule
The following sample CLI command creates an Event Grid topic with inbound IP rules. 

```azurecli-interactive
az eventgrid topic create \
    --resource-group $resourceGroupName \
    --name $topicName \
    --location $location \
    --public-network-access enabled \
    --inbound-ip-rules <IP ADDR or CIDR MASK> allow 
```

### Create a topic with multiple inbound ip rules

The following sample CLI command creates an Event Grid topic two inbound IP rules in one step: 

```azurecli-interactive
az eventgrid topic create \
    --resource-group $resourceGroupName \
    --name $topicName \
    --location $location \
    --public-network-access enabled \
    --inbound-ip-rules <IP ADDR 1 or CIDR MASK 1> allow \
    --inbound-ip-rules <IP ADDR 2 or CIDR MASK 2> allow
```

### Update an existing topic to add inbound IP rules
This example creates an Event Grid topic first and then adds inbound IP rules for the topic in a separate command. It also updates the inbound IP rules that were set in the second command. 

```azurecli-interactive

# create the event grid topic first
az eventgrid topic create \
    --resource-group $resourceGroupName \
    --name $topicName \
    --location $location

# add inbound IP rules to an existing topic
az eventgrid topic update \
    --resource-group $resourceGroupName \
    --name $topicName \
    --public-network-access enabled \
    --inbound-ip-rules <IP ADDR or CIDR MASK> allow

# later, update topic with additional ip rules
az eventgrid topic update \
    --resource-group $resourceGroupName \
    --name $topicName \
    --public-network-access enabled \
    --inbound-ip-rules <IP ADDR 1 or CIDR MASK 1> allow \
    --inbound-ip-rules <IP ADDR 2 or CIDR MASK 2> allow
```

### Remove an inbound IP rule
The following command removes the second rule you created in the previous step by specifying only the first rule while updating the setting. 

```azurecli-interactive
az eventgrid topic update \
    --resource-group $resourceGroupName \
    --name $topicName \
    --public-network-access enabled \
    --inbound-ip-rules <IP ADDR 1 or CIDR MASK 1> allow
```


## Use PowerShell
This section shows you how to use Azure PowerShell commands to create Azure Event Grid topics with inbound IP firewall rules. The steps shown in this section are for topics. You can use similar steps to create inbound IP rules for **domains**. 

By default, the public network access is enabled for topics and domains. You can also enable it explicitly or disable it. You can restrict traffic by configuring inbound IP firewall rules. 

### Enable public network access while creating a topic

```azurepowershell-interactive
New-AzEventGridTopic -ResourceGroupName MyResourceGroupName -Name Topic1 -Location eastus -PublicNetworkAccess enabled
```

### Disable public network access while creating a topic

```azurepowershell-interactive
New-AzEventGridTopic -ResourceGroupName MyResourceGroupName -Name Topic1 -Location eastus -PublicNetworkAccess disabled
```

> [!NOTE]
> When public network access is disabled for a topic or domain, traffic over public internet isn't allowed. Only private endpoint connections will be allowed to access these resources.

### Create a topic with public network access and inbound ip rules
The following sample CLI command creates an Event Grid topic with public network access and inbound IP rules. 

```azurepowershell-interactive
New-AzEventGridTopic -ResourceGroupName MyResourceGroupName -Name Topic1 -Location eastus -PublicNetworkAccess enabled -InboundIpRule @{ "10.0.0.0/8" = "Allow"; "10.2.0.0/8" = "Allow" }
```
### Update an existing a topic with public network access and inbound ip rules
The following sample CLI command updates an existing Event Grid topic with inbound IP rules. 

```azurepowershell-interactive
Set-AzEventGridTopic -ResourceGroupName MyResourceGroupName -Name Topic1 -PublicNetworkAccess enabled -InboundIpRule @{ "10.0.0.0/8" = "Allow"; "10.2.0.0/8" = "Allow" } -Tag @{}
```

### Disable public network access for an existing topic 

```azurepowershell-interactive
Set-AzEventGridTopic -ResourceGroup MyResourceGroupName -Name Topic1 -PublicNetworkAccess disabled -Tag @{} -InboundIpRule @{}
```


## Next steps

* For information about monitoring event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* For more information about the authentication key, see [Event Grid security and authentication](security-authentication.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* To troubleshoot network connectivity issues, see [Troubleshoot network connectivity issues](troubleshoot-network-connectivity.md)
