---
title: Configure private endpoints for Event Grid topics or domains
description: This article describes how to configure private endpoints for Event Grid topics or domain. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: how-to
ms.date: 03/09/2020
ms.author: spelluru
---

# Configure private endpoints for Event Grid topics or domains (Preview)
You can use [private endpoints](../private-link/private-endpoint-overview.md) to allow ingress of events directly from your virtual network to your topics and domains securely over a [private link](../private-link/private-link-overview.md) without going through the public internet. The private endpoint uses an IP address from the VNet address space for your topic or domain. For more conceptual information, see [Network security](network-security.md).

This article describes how to configure private endpoints for Event Grid topics or domains.

## Use Azure portal 
This section shows you how to use the Azure portal to create a private endpoint for an Event Grid topic or a domain.

1. Switch to the **Networking** tab of your Event Grid topic page. Select **+ Private endpoint** on the toolbar.

    ![Add private endpoint](./media/configure-private-endpoints/add-private-endpoint-button.png)
2. One the **Basics** page, follow these steps: 
    1. Select an **Azure subscription** in which you want to create the private endpoint. 
    2. Select an **Azure resource group** for the private endpoint. 
    3. Enter a **name** for the endpoint. 
    4. Select the **region** for the endpoint. Your private endpoint must be in the same region as your virtual network, but can in a different region from the private link resource (in this example, the Event Grid topic). 
    5. Then, select **Next: Resource >** button at the bottom of the page. 

      ![Private endpoint - basics page](./media/configure-private-endpoints/private-endpoint-basics-page.png)
3. On the **Resource** page, follow these steps: 
    1. For connection method, if you select **Connect to an Azure resource in my directory**, follow these steps. This example shows how to connect to an Azure resource in your directory. 
        1. Select the **Azure subscription** in which your **Event Grid topic/domain** exists. 
        1. For **Resource type**, Select **Microsoft.EventGrid/topics** or **Microsoft.EventGrid/domains** for the **Resource type**.
        2. For **Resource**, select an Event Grid topic/domain from the drop-down list. 
        3. Confirm that the **Target subresource** is set to **topic** or **domain** (based on the resource type you selected).    
        4. Select **Next: Configuration >** button at the bottom of the page. 

            ![Private endpoint - resource page](./media/configure-private-endpoints/private-endpoint-resource-page.png)
    2. If you select **Connect to a resource using a resource ID or an alias**, follow these steps:
        1. Enter the ID of the resource. For example: `/subscriptions/00000000000-0000-0000-0000-00000000000000/resourceGroups/myegridrg/providers/Microsoft.EventGrid/topics/mytopic0130`.  
        2. For **Resource**, enter **topic** or **domain**. 
        3. (optional) Add a request message. 
        4. Select **Next: Configuration >** button at the bottom of the page. 

            ![Private endpoint - resource page](./media/configure-private-endpoints/connect-azure-resource-id.png)
4. On the **Configuration** page, you select the subnet in a virtual network to where you want to deploy the private endpoint. 
    1. Select a **virtual network**. Only virtual networks in the currently selected subscription and location are listed in the drop-down list. 
    2. Select a **subnet** in the virtual network you selected. 
    3. Select **Next: Tags >** button at the bottom of the page. 

    ![Private endpoint - configuration page](./media/configure-private-endpoints/private-endpoint-configuration-page.png)
5. On the **Tags** page, create any tags (names and values) that you want to associate with the private endpoint resource. Then, select **Review + create** button at the bottom of the page. 
6. On the **Review + create**, review all the settings, and select **Create** to create the private endpoint. 

    ![Private endpoint - review & create page](./media/configure-private-endpoints/private-endpoint-review-create-page.png)
    

## Manage private link connection

When you create a private endpoint, the connection must be approved. If the resource for which you're creating a private endpoint is in your directory, you can approve the connection request provided you have sufficient permissions. If you're connecting to an Azure resource in another directory, you must wait for the owner of that resource to approve your connection request.

There are four provisioning states:

| Service action | Service consumer private endpoint state | Description |
|--|--|--|
| None | Pending | Connection is created manually and is pending approval from the Private Link resource owner. |
| Approve | Approved | Connection was automatically or manually approved and is ready to be used. |
| Reject | Rejected | Connection was rejected by the private link resource owner. |
| Remove | Disconnected | Connection was removed by the private link resource owner, the private endpoint becomes informative and should be deleted for cleanup. |
 
###  How to manage a private endpoint connection

1. Sign in to the Azure portal.
1. In the search bar, type in **Event Grid topics** or **Event Grid domains**.
1. Select the **topic** or **domain** that you want to manage.
1. Select the **Networking** tab.
1. If there are any connections that are pending, you will see a connection listed with **Pending** in the provisioning state. 

### To approve a private endpoint
You can approve a private endpoint that's in the pending state. To approve, follow these steps: 

1. Select the **private endpoint** you wish to approve, and select **Approve** on the toolbar.

    ![Private endpoint - pending state](./media/configure-private-endpoints/endpoint-pending.png)
1. On the **Approve connection** dialog box, enter a comment (optional), and select **Yes**. 

    ![Private endpoint - approve](./media/configure-private-endpoints/endpoint-approve.png)
1. Confirm that you see the status of the endpoint as **Approved**. 

    ![Private endpoint - approved state](./media/configure-private-endpoints/endpoint-approved-status.png)

### To reject a private endpoint
You can reject a private endpoint that's in the pending state or approve state. To reject, follow these steps: 

1. Select the **private endpoint** you wish to reject, and select **Reject** on the toolbar.

    ![Private endpoint - reject](./media/configure-private-endpoints/endpoint-reject-button.png)
1. On the **Reject connection** dialog box, enter a comment (optional), and select **Yes**. 

    ![Private endpoint - reject](./media/configure-private-endpoints/endpoint-reject.png)
1. Confirm that you see the status of the endpoint as **Rejected**. 

    ![Private endpoint - rejected state](./media/configure-private-endpoints/endpoint-rejected-status.png)


## Use Azure CLI
To create a private endpoint, use the [az network private-endpoint create](/cli/azure/network/private-endpoint?view=azure-cli-latest#az-network-private-endpoint-create) method as shown in the following example:

```azurecli
az network private-endpoint create \
    --resource-group <RESOURECE GROUP NAME> \
    --name <PRIVATE ENDPOINT NAME> \
    --vnet-name <VIRTUAL NETWORK NAME> \
    --subnet <SUBNET NAME> \
    --private-connection-resource-id "/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.EventGrid/topics/<TOPIC NAME> \
    --connection-name <PRIVATE LINK SERVICE CONNECTION NAME> \
    --location <LOCATION> \
    --group-ids topic
```

For descriptions of the parameters used in the example, see [documentation for az network private-endpoint create method](/cli/azure/network/private-endpoint?view=azure-cli-latest#az-network-private-endpoint-create). A few points to note in this example are: 

- For `private-connection-resource-id`, specify the resource ID of the Event Grid **topic** or **domain**. In the preceding example, a topic name is used. 
- for `group-ids`, specify `topic` or `domain` basic. In the preceding example, `topic` is used. 

To delete a private endpoint, use the [az network private-endpoint delete](/cli/azure/network/private-endpoint?view=azure-cli-latest#az-network-private-endpoint-delete) method as shown in the following example:

```azurecli
az network private-endpoint delete --resource-group <RESOURECE GROUP NAME> --name <PRIVATE ENDPOINT NAME>
```

### Full script 
Here's the full script to create the following Azure resources:

- Resource group
- Virtual network
- Subnet in the virtual network
- Event Grid topic (premium tier )
- Private endpoint for the topic

```azurecli
subscriptionID="<AZURE SUBSCRIPTON ID>"
resourceGroupName="<AZURE RESOURCE GROUP NAME>"
location="<LOCATION>"
vNetName="<VIRTUAL NETWORK NAME>"
subNetName="<SUBNET NAME>"
topicName = "<TOPIC NAME>"
connectionName="<ENDPOINT CONNECTION NAME>"


-- setup subscription
az account set --subscription $subscriptionID

-- create resource group
az group create --name $resourceGroupName --location $location

-- create vnet and subnet in $resourceGroupName
az network vnet create --resource-group $resourceGroupName --name $vNetName --address-prefix 10.0.0.0/16
az network vnet subnet create --resource-group $resourceGroupName --vnet-name $vNetName --name $subNetName --address-prefixes 10.0.0.0/24
az network vnet subnet update --resource-group $resourceGroupName --vnet-name $vNetName --name $subNetName --disable-private-endpoint-network-policies true

-- create topic. Replace <SUBSCRIPTION ID>, <RESOURCE GROUP NAME>, <TOPIC NAME>, and <LOCATION> with appropriate values. 
az rest --method put --uri "/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.EventGrid/topics/<TOPIC NAME>?api-version=2020-04-01-preview" --body "{\""location\"":\""<LOCATION>\"", \""sku\"": {\""name\"": \""premium\""}, \""properties\"": {\""publicNetworkAccess\"":\""Disabled\""}}"

-- verify that the topic was created.
az rest --method get --uri "/subscriptions/$subscriptionID/resourceGroups/$resourceGroupName/providers/Microsoft.EventGrid/topics/$topicName?api-version=2020-04-01-preview"

-- create private endpoint. Replace <SUBSCRIPTION ID>, <RESOURCE GROUP NAME>, and <TOPIC NAME> with appropriate values. 
az network private-endpoint create --resource-group $resourceGroupName --name $endpointName --vnet-name $vNetName --subnet $subNetName --private-connection-resource-id "/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.EventGrid/topics/<TOPIC NAME> --connection-name $connectionName --location $location --group-ids topic

-- get topic in $resourceGroupName
az rest --method get --uri "/subscriptions/$subscriptionID/resourceGroups/$resourceGroupName/providers/Microsoft.EventGrid/topics/$topicName?api-version=2020-04-01-preview"

```

## Use PowerShell

```azurepowershell
$privateEndpointConnection = New-AzPrivateLinkServiceConnection -Name <PRIVATE LINK SERVICE CONNECTION NAME> -PrivateLinkServiceId $topic.Id  -GroupId "topic" 

$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName  "example-privatelinkRg1" -Name "example-privatelinkvnet"

$subnet = $virtualNetwork  | Select -ExpandProperty subnets  | Where-Object  {$_.Name -eq 'example-privatelinksubnet'}  

$privateEndpoint = New-AzPrivateEndpoint -ResourceGroupName "example-privatelinkRg1"  -Name "myPrivateEndpoint"  -Location "<LOCATION>"  -Subnet  $subnet  -PrivateLinkServiceConnection $privateEndpointConnection
```

## Next steps
To learn about how to configure IP firewall settings, see [Configure IP firewall for Event Grid topics or domains](configure-firewall.md).