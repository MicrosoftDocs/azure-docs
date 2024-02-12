---
title: Integrate Azure Relay with Azure Private Link Service
description: Learn how to integrate Azure Relay with Azure Private Link Service
ms.date: 02/15/2023
ms.topic: article 
ms.custom: devx-track-azurepowershell
---

# Integrate Azure Relay with Azure Private Link 
Azure **Private Link Service** enables you to access Azure services (for example, Azure Relay, Azure Service Bus, Azure Event Hubs, Azure Storage, and Azure Cosmos DB) and Azure hosted customer/partner services over a private endpoint in your virtual network. For more information, see [What is Azure Private Link?](../private-link/private-link-overview.md)

A **private endpoint** is a network interface that allows your workloads running in a virtual network to connect privately and securely to a service that has a **private link resource** (for example, a Relay namespace). The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute, VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can provide a level of granularity in access control by allowing connections to specific Azure Relay namespaces. 

> [!NOTE]
> If you use the **relay listener** over a private link, open ports **9400-9599** for outgoing communication along with the standard relay ports. Note that you need to do this step only for the **relay listener**.

## Add a private endpoint using Azure portal

### Prerequisites
To integrate an Azure Relay namespace with Azure Private Link, you need the following entities or permissions:

- An Azure Relay namespace.
- An Azure virtual network.
- A subnet in the virtual network.
- Owner or contributor permissions on the virtual network.

Your private endpoint and virtual network must be in the same region. When you select a region for the private endpoint using the portal, it will automatically filter only virtual networks that are in that region. Your namespace can be in a different region.

Your private endpoint uses a private IP address in your virtual network.

### Configure private access for a Relay namespace
The following procedure provides step-by-step instructions for disabling public access to a Relay namespace and then adding a private endpoint to the namespace. 


1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the search bar, type in **Relays**.
3. Select the **namespace** from the list to which you want to add a private endpoint.
4. On the left menu, select the **Networking** tab under **Settings**.
1. On the **Networking** page, for **Public network access**, select **Disabled** if you want the namespace to be accessed only via private endpoints. 
1. For **Allow trusted Microsoft services to bypass this firewall**, select **Yes** if you want to allow [trusted Microsoft services](#trusted-microsoft-services) to bypass this firewall. 

    :::image type="content" source="./media/private-link-service/public-access-disabled.png" alt-text="Screenshot of the Networking page with public network access as Disabled.":::
1. Select the **Private endpoint connections** tab at the top of the page
1. Select the **+ Private Endpoint** button at the top of the page.

    :::image type="content" source="./media/private-link-service/add-private-endpoint-button.png" alt-text="Screenshot showing the selection of the Add private endpoint button on the Private endpoint connections tab of the Networking page.":::
7. On the **Basics** page, follow these steps: 
    1. Select the **Azure subscription** in which you want to create the private endpoint. 
    2. Select the **resource group** for the private endpoint resource.
    3. Enter a **name** for the **private endpoint**. 
    1. Enter a **name** for the **network interface**.
    1. Select a **region** for the private endpoint. Your private endpoint must be in the same region as your virtual network, but can be in a different region from the Azure Relay namespace that you're connecting to. 
    1. Select **Next: Resource >** button at the bottom of the page.

        :::image type="content" source="./media/private-link-service/create-private-endpoint-basics-page.png" alt-text="Screenshot showing the Basics page of the Create a private endpoint wizard.":::
8. Review settings on the **Resource** page, and select **Next: Virtual Network**. 

    :::image type="content" source="./media/private-link-service/create-private-endpoint-resource-page.png" alt-text="Screenshot showing the Resource page of the Create a private endpoint wizard.":::
9. On the **Virtual Network** page, select the **virtual network** and the **subnet** where you want to deploy the private endpoint. Only virtual networks in the currently selected subscription and location are listed in the drop-down list. 

    :::image type="content" source="./media/private-link-service/create-private-endpoint-virtual-network-page.png" alt-text="Screenshot showing the Virtual Network page of the Create a private endpoint wizard.":::

    You can configure whether you want to **dynamically** allocate an IP address or **statically** allocate an **IP address** to the private endpoint

    You can also associate a new or existing **application security group** to the private endpoint. 
3. Select **Next: DNS** to navigate to the **DNS** page of the wizard. On the **DNS** page, **Integrate with private DNZ zone** setting is enabled by default (recommended). You have an option to disable it. 

    :::image type="content" source="./media/private-link-service/create-private-endpoint-dns-page.png" alt-text="Screenshot showing the DNS page of the Create a private endpoint wizard.":::

    To connect privately with your private endpoint, you need a DNS record. We recommend that you integrate your private endpoint with a **private DNS zone**. You can also utilize your own DNS servers or create DNS records using the host files on your virtual machines. For more information, see [Azure Private Endpoint DNS Configuration](../private-link/private-endpoint-dns.md). 
3. Select **Next: Tags >** button at the bottom of the page. 
10. On the **Tags** page, create any tags (names and values) that you want to associate with the private endpoint and the private DNS zone (if you had enabled the option). Then, select **Review + create** button at the bottom of the page. 
11. On the **Review + create**, review all the settings, and select **Create** to create the private endpoint.
12. On the **Private endpoint** page, you can see the status of the private endpoint connection. If you're the owner of the Relay namespace or have the manage access over it and had selected **Connect to an Azure resource in my directory** option for the **Connection method**, the endpoint connection should be **auto-approved**. If it's in the **pending** state, see the [Manage private endpoints using Azure portal](#manage-private-endpoints-using-azure-portal) section.

    :::image type="content" source="./media/private-link-service/private-endpoint-page.png" alt-text="Screenshot showing the Private endpoint page in the Azure portal.":::
13. Navigate back to the **Networking** page of the **namespace**, and switch to the **Private endpoint connections** tab. You should see the private endpoint that you created. 


    :::image type="content" source="./media/private-link-service/private-endpoint-created.png" alt-text="Screenshot showing the Private endpoint connections tab of the Networking page with the private endpoint you just created.":::

## Add a private endpoint using PowerShell
The following example shows you how to use Azure PowerShell to create a private endpoint connection to an Azure Relay namespace.

Your private endpoint and virtual network must be in the same region. Your Azure Relay namespace can be in a different region. And, Your private endpoint uses a private IP address in your virtual network.

```azurepowershell-interactive

$rgName = "<RESOURCE GROUP NAME>"
$vnetlocation = "<VNET LOCATION>"
$vnetName = "<VIRTUAL NETWORK NAME>"
$subnetName = "<SUBNET NAME>"
$namespaceLocation = "<NAMESPACE LOCATION>"
$namespaceName = "<NAMESPACE NAME>"
$peConnectionName = "<PRIVATE ENDPOINT CONNECTION NAME>"

# create resource group
New-AzResourceGroup -Name $rgName -Location $vnetLocation 

# create virtual network
$virtualNetwork = New-AzVirtualNetwork `
                    -ResourceGroupName $rgName `
                    -Location $vnetlocation `
                    -Name $vnetName `
                    -AddressPrefix 10.0.0.0/16

# create subnet with endpoint network policy disabled
$subnetConfig = Add-AzVirtualNetworkSubnetConfig `
                    -Name $subnetName `
                    -AddressPrefix 10.0.0.0/24 `
                    -PrivateEndpointNetworkPoliciesFlag "Disabled" `
                    -VirtualNetwork $virtualNetwork

# update virtual network
$virtualNetwork | Set-AzVirtualNetwork

# create a relay namespace
$namespaceResource = New-AzResource -Location $namespaceLocation -ResourceName $namespaceName -ResourceGroupName $rgName -Properties @{} -ResourceType "Microsoft.Relay/namespaces" 

# create a private link service connection
$privateEndpointConnection = New-AzPrivateLinkServiceConnection `
                                -Name $peConnectionName `
                                -PrivateLinkServiceId $namespaceResource.ResourceId `
                                -GroupId "namespace"

# get subnet object that you'll use in the next step                                
$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName  $rgName -Name $vnetName
$subnet = $virtualNetwork | Select -ExpandProperty subnets `
                                | Where-Object  {$_.Name -eq $subnetName}  
   
# now, create private endpoint   
$privateEndpoint = New-AzPrivateEndpoint -ResourceGroupName $rgName  `
                                -Name $vnetName   `
                                -Location $vnetlocation `
                                -Subnet  $subnet   `
                                -PrivateLinkServiceConnection $privateEndpointConnection

(Get-AzResource -ResourceId $namespaceResource.ResourceId -ExpandProperties).Properties


```

## Manage private endpoints using Azure portal

When you create a private endpoint, the connection must be approved. If the resource (Relay namespace) for which you're creating a private endpoint is in your directory, you can approve the connection request provided you've manage privileges over the Relay namespace. If you're connecting to a Relay namespace for which you don't have the manage access, you must wait for the owner of that resource to approve your connection request.

There are four provisioning states:

| Service action | Service consumer private endpoint state | Description |
|--|--|--|
| None | Pending | Connection is created manually and is pending approval from the Azure Relay namespace owner. |
| Approve | Approved | Connection was automatically or manually approved and is ready to be used. |
| Reject | Rejected | Connection was rejected by the Azure Relay namespace owner. |
| Remove | Disconnected | Connection was removed by the Azure Relay namespace owner, the private endpoint becomes informative and should be deleted for cleanup. |
 
###  Approve, reject, or remove a private endpoint connection

1. Sign in to the Azure portal.
1. In the search bar, type in **Relay**.
1. Select the **namespace** that you want to manage.
1. Select the **Networking** tab.
5. Go to the appropriate section below based on the operation you want to: approve, reject, or remove. 

### Approve a private endpoint connection

1. If there are any connections that are pending, you see a connection listed with **Pending** in the provisioning state. 
2. Select the **private endpoint** you wish to approve
3. Select the **Approve** button.

    :::image type="content" source="./media/private-link-service/private-endpoint-approve.png" alt-text="Screenshot showing the Approve button on the command bar for the selected private endpoint.":::
4. On the **Approve connection** page, enter an optional **comment**, and select **Yes**. If you select **No**, nothing happens. 

    :::image type="content" source="./media/private-link-service/approve-connection-page.png" alt-text="Screenshot showing the Approve connection page asking for your confirmation.":::
5. You should see the status of the connection in the list changed to **Approved**.

### Reject a private endpoint connection

1. If there are any private endpoint connections you want to reject, whether it's a pending request or existing connection that was approved earlier, select the endpoint connection and select the **Reject** button.

    :::image type="content" source="./media/private-link-service/private-endpoint-reject.png" alt-text="Screenshot showing the Reject button on the command bar for the selected private endpoint.":::
2. On the **Reject connection** page, enter an optional comment, and select **Yes**. If you select **No**, nothing happens. 

    :::image type="content" source="./media/private-link-service/reject-connection-page.png" alt-text="Screenshot showing the Reject connection page asking for your confirmation.":::
3. You should see the status of the connection in the list changed **Rejected**.


### Remove a private endpoint connection

1. To remove a private endpoint connection, select it in the list, and select **Remove** on the toolbar. 

    :::image type="content" source="./media/private-link-service/remove-endpoint.png" alt-text="Screenshot showing the Remove button on the command bar for the selected private endpoint.":::
2. On the **Delete connection** page, select **Yes** to confirm the deletion of the private endpoint. If you select **No**, nothing happens. 

    :::image type="content" source="./media/private-link-service/delete-connection-page.png" alt-text="Screenshot showing the Delete connection page asking you for the confirmation.":::
3. You should see the status changed to **Disconnected**. Then, you won't see the endpoint in the list. 

## Validate that the private link connection works
You should validate that resources within the virtual network of the private endpoint are connecting to your Azure Relay namespace over its private IP address.

For this test, create a virtual machine by following the steps in the [Create a Windows virtual machine in the Azure portal](../virtual-machines/windows/quick-create-portal.md)

In the **Networking** tab: 

1. Specify **Virtual network** and **Subnet**. Select the Virtual Network on which you deployed the private endpoint.
2. Specify a **public IP** resource.
3. For **NIC network security group**, select **None**.
4. For **Load balancing**, select **No**.

Connect to the VM and open the command line and run the following command:

```console
nslookup <your-relay-namespace-name>.servicebus.windows.net
```

You should see a result that looks like the following. 

```console
Non-authoritative answer:
Name:    <namespace-name>.privatelink.servicebus.windows.net
Address:  10.0.0.4 (private IP address associated with the private endpoint)
Aliases:  <namespace-name>.servicebus.windows.net
```

## Limitations and Design Considerations

### Design considerations
- For pricing information, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

### Limitations 
- Maximum number of private endpoints per Azure Relay namespace: 64.
- Maximum number of Azure Relay namespaces with private endpoints per subscription: 64.
- Network Security Group (NSG) rules and User-Defined Routes don't apply to Private Endpoint. For more information, see [Azure Private Link service: Limitations](../private-link/private-link-service-overview.md#limitations)

[!INCLUDE [trusted-services](./includes/trusted-services.md)]

## Next Steps

- Learn more about [Azure Private Link](../private-link/private-link-service-overview.md)
- Learn more about [Azure Relay](relay-what-is-it.md)
