---
title: Azure Notification Hubs Private Link
description: Learn how to use the Private Link feature in Azure Notification Hubs. 
author: sethmanheim
ms.author: sethm
ms.service: notification-hubs
ms.topic: conceptual
ms.date: 11/06/2023

---

# Use Private Link

This article describes how to use *Private Link* to restrict access to managing resources in your subscriptions. Private links enable you to access Azure services over a private endpoint in your virtual network. This prevents exposure of the service to the public internet.

This article describes the Private Link setup process using the [Azure portal](https://portal.azure.com).

> [!IMPORTANT]
> You can enable this feature on tiers, for an additional fee.

## Create a private endpoint along with a new notification hub in the portal

The following procedure creates a private endpoint along with a new notification hub using the Azure portal:

1. Create a new notification hub, and select the **Networking** tab.
1. Select **Private access**, then select **Create**.

   :::image type="content" source="media/private-link/create-hub.png" alt-text="Screenshot of notification hub creation page on portal showing private link option." lightbox="media/private-link/create-hub.png":::

1. Fill in the subscription, resource group, location, and a name for the new private endpoint. Choose a virtual network and a subnet. In **Integrate with Private DNS Zone**, select **Yes** and type **privatelink.notificationhubs.windows.net** in the **Private DNS Zone** box.

   :::image type="content" source="media/private-link/create-private-endpoint.png" alt-text="Screenshot of notification hub private endpoint creation page." lightbox="media/private-link/create-private-endpoint.png":::

1. Select **OK** to see confirmation of namespace and hub creation with a private endpoint.
1. Select **Create** to create the notification hub with a private endpoint connection.

   :::image type="content" source="media/private-link/private-endpoint-confirm.png" alt-text="Screenshot of notification hub private endpoint confirmation page." lightbox="media/private-link/private-endpoint-confirm.png":::

### Create a private endpoint for an existing notification hub in the portal

1. In the portal, on the left-hand side under the **Security + networking** section, select **Notification Hubs**, then select **Networking**.
1. Select the **Private access** tab.

   :::image type="content" source="media/private-link/networking-private-access.png" alt-text="Screenshot of private access tab." lightbox="media/private-link/networking-private-access.png":::

1. Fill in the subscription, resource group, location, and a name for the new private endpoint. Choose a virtual network and subnet. Select **Create**.

   :::image type="content" source="media/private-link/create-properties.png" alt-text="Screenshot of private link creation properties." lightbox="media/private-link/create-properties.png":::

## Create a private endpoint using PowerShell

The following example shows how to use PowerShell to create a private endpoint connection to a Notification Hubs namespace. Your private endpoint uses a private IP address in your virtual network.

1. Sign in to Azure via PowerShell and set a subscription:

   ```powershell
   Login-AzAccount
   Set-AzContext -SubscriptionId <azure_subscription_id>
   ```

1. Create a new resource group:

   ```powershell
   New-AzResourceGroup -Name <resource_group_name> -Location <azure_region>
   ```

1. Register **Microsoft.NotificationHubs** as a resource provider:

   ```powershell
   Register-AzResourceProvider -ProviderNamespace Microsoft.NotificationHubs
   ```

1. Create a new Azure Notification Hubs namespace:

   ```powershell
   New-AzNotificationHubsNamespace -ResourceGroup <resource_group_name> -Location <azure_region> -Namespace <namespace_name> -SkuTier "Standard"
   ```

1. Create a new notification hub. First, create a JSON file with the notification hub details. This file is used as an input to the create notification hub PowerShell command. Paste the following content into the JSON file:

   ```json
   {
       "ResourceGroup": "resource_group_name",
       "NamespaceName": "namespace_name",
       "Location": "azure_region",
       "Name": "notification_hub_name"
   }
   ```

1. Run the following PowerShell command:

   ```powershell
   New-AzNotificationHub -ResourceGroup <resource_group_name> -Namespace <namespace_name> -InputFile <path_to_json_file>
   ```

1. Create a virtual network with a subnet:

   ```powershell
   New-AzVirtualNetwork -ResourceGroup <resource_group_name> -Location <azure_region> -Name <your_VNet_name> -AddressPrefix <address_prefix>
   Add-AzVirtualNetworkSubnetConfig -VirtualNetwork (Get-AzVirtualNetwork -Name <your_VNet_name> -ResourceGroup <resource_group_name>) -Name <subnet_name> -AddressPrefix <address_prefix>
   ```

1. Disable virtual network policies:

   ```powershell
   $net = @{
    Name = 'myVNet'
    ResourceGroupName = 'RG'
   }
   $vnet = Get-AzVirtualNetwork @net

   $sub = @{
       Name = <subnet_name>
       VirtualNetwork = $vnet
       PrivateEndpointNetworkPoliciesFlag = 'Disabled'
   }
   Set-AzVirtualNetworkSubnetConfig @sub
   ```

1. Add private DNS zones and link them to the virtual network:

   ```powershell
   New-AzPrivateDnsZone -ResourceGroup <resource_group_name> -Name privatelink.servicebus.windows.net
   New-AzPrivateDnsZone -ResourceGroup <resource_group_name> -Name privatelink.notificationhub.windows.net
   
   New-AzPrivateDnsVirtualNetworkLink -ResourceGroup <resource_group_name> -Name <dns_Zone_Link_Name> -ZoneName "privatelink.servicebus.windows.net" -VirtualNetworkId "/subscriptions/<azure_subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.Network/virtualNetworks/<vNet_name>"
   
   New-AzPrivateDnsVirtualNetworkLink -ResourceGroup <resource_group_name> -Name <dns_Zone_Link_Name> -ZoneName "privatelink.notificationhub.windows.net" -VirtualNetworkId "/subscriptions/<azure_subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.Network/virtualNetworks/<vNet_name>"
   ```

1. Create a private endpoint:

   ```powershell
   $plsConnection= New-AzPrivateLinkServiceConnection -Name <private_link_connection_name> -PrivateLinkServiceId '/subscriptions/<azure_subscription_id> /resourceGroups/<resource_group_name>/providers/Microsoft.NotificationHubs/namespaces/<namespace_name>' 
   
   New-AzPrivateEndpoint -ResourceGroup <resource_group_name> -Location <azure_region> -Name <private_endpoint_name> -Subnet (Get-AzVirtualNetworkSubnetConfig -Name <subnet_name> -VirtualNetwork (Get-AzVirtualNetwork -Name <vNet_name> -ResourceGroup <resource_group_name>)) -PrivateLinkServiceConnection  $plsConnection
   ```

1. Show the connection status:

   ```powershell
   Get-AzPrivateEndpointConnection -ResourceGroup <resource_group_name> -Name <private_endpoint_name>
   ```

## Create a private endpoint using CLI

1. Sign in to Azure CLI and set a subscription:

   ```azurecli
   az login
   az account set --subscription <azure_subscription_id>
   ```

1. Create a new resource group:

   ```azurecli
   az group create -n <resource_group_name> -l <azure_region>
   ```

1. Register **Microsoft.NotificationHubs** as a provider:

   ```azurecli
   az provider register -n Microsoft.NotificationHubs
   ```

1. Create a new Notification Hubs namespace and hub:

   ```azurecli
   az notification-hub namespace create 
        --name <namespace_name>
        --resource-group <resource_group_name>
        --location <azure_region>
        --sku "Standard"

    az notification-hub create 
        --name <notification_hub_name>
        --namespace-name <namespace_name>
        --resource-group <resource_group_name>
        --location <azure_region>
   ```

1. Create a virtual network with a subnet:

   ```azurecli
   az network vnet create
        --resource-group <resource_group_name>
        --name <vNet name>
        --location <azure_region>

   az network vnet subnet create
        --resource-group <resource_group_name>
        --vnet-name <vNet_name>
        --name <subnet_name>
        --address-prefixes <address_prefix>
   ```

1. Disable virtual network policies:

   ```azurecli
   az network vnet subnet update
        --name <subnet_name>
        --resource-group <resource_group_name>
        --vnet-name <vNet_name>
        --disable-private-endpoint-network-policies true
   ```

1. Add private DNS zones and link them to a virtual network:

   ```azurecli
   az network private-dns zone create
        --resource-group <resource_group_name>
        --name privatelink.servicebus.windows.net

   az network private-dns zone create
        --resource-group <resource_group_name>
        --name privatelink.notoficationhub.windows.net
   
   az network private-dns link vnet create
        --resource-group <resource_group_name>
        --virtual-network <vNet_name>
        --zone-name privatelink.servicebus.windows.net 
        --name <dns_zone_link_name>
        --registration-enabled true

   az network private-dns link vnet create
        --resource-group <resource_group_name>
        --virtual-network <vNet_name>
        --zone-name privatelink.notificationhub.windows.net 
        --name <dns_zone_link_name>
        --registration-enabled true
   ```

1. Create a private endpoint (automatically approved):

   ```azurecli
   az network private-endpoint create
        --resource-group <resource_group_name>
        --vnet-name <vNet_name>
        --subnet <subnet_name>
        --name <private_endpoint_name>  
        --private-connection-resource-id "/subscriptions/<azure_subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.NotificationHubs/namespaces/<namespace_name>" 
        --group-ids namespace 
        --connection-name <private_link_connection_name>
        --location <azure-region>
   ```

1. Create a private endpoint (with manual request approval):

   ```azurecli
   az network private-endpoint create
        --resource-group <resource_group_name>
        --vnet-name <vnet_name>
        --subnet <subnet_name>
        --name <private_endpoint_name>
        --private-connection-resource-id "/subscriptions/<azure_subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.NotificationHubs/namespaces/<namespace_name>" 
        --group-ids namespace
        --connection-name <private_link_connection_name>
        --location <azure-region>
        --manual-request
   ```

1. Show the connection status:

   ```azurecli
   az network private-endpoint show --resource-group <resource_group_name> --name <private_endpoint_name>
   ```

## Manage private endpoints using the portal

When you create a private endpoint, the connection must be approved. If the resource for which you're creating a private endpoint is in your directory, you can approve the connection request, provided you have sufficient permissions. If you're connecting to an Azure resource in another directory, you must wait for the owner of that resource to approve your connection request.

There are four provisioning states:

|     Service action    |     Service consumer   private endpoint state    |     Description                                                                                                                                   |
|-----------------------|--------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
|     None              |     Pending                                      |     Connection is created manually and is pending approval from the private link resource owner.                                              |
|     Approve           |     Approved                                     |     Connection was automatically or manually approved and is ready to be used.                                                                  |
|     Reject            |     Rejected                                     |     Connection was rejected by the private link resource owner.                                                                                 |
|     Remove            |     Disconnected                                 |     Connection was removed by the private link resource owner. The private endpoint becomes informative and should be deleted for cleanup.    |

### Approve, reject, or remove a private endpoint connection

1. Sign in to the Azure portal.
1. In the search bar, type **Notification Hubs**.
1. Select the namespace that you want to manage.
1. Select the **Networking** tab.
1. Go to the appropriate section based on the operation you want to approve, reject, or remove.

### Approve a private endpoint connection

1. If there are any connections that are pending, a connection is displayed with **Pending** in the provisioning state.
1. Select the private endpoint you want to approve.
1. Select **Approve**.

   :::image type="content" source="media/private-link/networking-approve.png" alt-text="Screenshot showing Networking tab ready for approval." lightbox="media/private-link/networking-approve.png":::

1. On the **Approve connection** page, enter an optional comment, then select **Yes**. If you select **No**, nothing happens.

   :::image type="content" source="media/private-link/approve-connection.png" alt-text="Screenshot showing approve connection page." lightbox="media/private-link/approve-connection.png":::

1. You should see the status of the connection in the list change to **Approved**.

### Reject a private endpoint connection

1. If there are any private endpoint connections you want to reject, whether it is a pending request or existing connection that was approved earlier, select the endpoint connect icon and select **Reject**.

   :::image type="content" source="media/private-link/reject-connection.png" alt-text="Screenshot showing reject connection option." lightbox="media/private-link/reject-connection.png":::

1. On the **Reject connection** page, enter an optional comment, then select **Yes**. If you select **No**, nothing happens.
1. You should see the status of the connection in the list change to **Rejected**.

### Remove a private endpoint connection

1. To remove a private endpoint connection, select it in the list, and select **Remove** on the toolbar:

   :::image type="content" source="media/private-link/remove-connection.png" alt-text="Screenshot showing remove connection page." lightbox="media/private-link/remove-connection.png":::

1. On the **Delete connection** page, select **Yes** to confirm the deletion of the private endpoint. If you select **No**, nothing happens.
1. You should see the status of the connection in the list change to **Disconnected**. The endpoint then disappears from the list.

### Validate that the private link connection works

You should validate that resources within the virtual network of the private endpoint are connecting to your Notification Hubs namespace over a private IP address, and that they have the correct private DNS zone integration.

First, create a virtual machine by following the steps in [Create a Windows virtual machine in the Azure portal](/azure/virtual-machines/windows/quick-create-portal).

In the **Networking** tab:

1. Specify the **Virtual network** and **Subnet**. You must select the Virtual Network on which you deployed the private endpoint.
1. Specify a **public IP** resource.
1. For **NIC network security group**, select **None**.
1. For **Load balancing**, select **No**.

Connect to the VM, open a command line, and run the following command:

```powershell
Resolve-DnsName <namespace_name>.privatelink.servicebus.windows.net
```

When the command is executed from the VM, it returns the IP address of the private endpoint connection. When it's executed from an external network, it returns the public IP address of one of the Notification Hubs clusters.

## Limitations and design considerations

**Limitations**: This feature is available in all Azure public regions.
**Maximum number of private endpoints per Notification Hubs namespace**: 200

For more information, see [Azure Private Link service: Limitations](/azure/private-link/private-link-service-overview#limitations).

## Next steps

- [Azure Notification Hubs overview](notification-hubs-push-notification-overview.md)
