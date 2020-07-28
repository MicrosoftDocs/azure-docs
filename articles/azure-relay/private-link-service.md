---
title: Integrate Azure Relay with Azure Private Link Service
description: Learn how to integrate Azure Relay with Azure Private Link Service
ms.date: 06/23/2020
ms.topic: article
---

# Integrate Azure Relay with Azure Private Link (Preview)
Azure **Private Link Service** enables you to access Azure services (for example, Azure Relay, Azure Service Bus, Azure Event Hubs, Azure Storage, and Azure Cosmos DB) and Azure hosted customer/partner services over a private endpoint in your virtual network. For more information, see [What is Azure Private Link (Preview)?](../private-link/private-link-overview.md)

A **private endpoint** is a network interface that allows your workloads running in a virtual network to connect privately and securely to a service that has a **private link resource** (for example, a Relay namespace). The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute, VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network eliminating exposure from the public Internet. You can provide a level of granularity in access control by allowing connections to specific Azure Relay namespaces. 


> [!IMPORTANT]
> This feature is currently in **preview**. 
>
> We currently support private link connections on sender clients. 


## Add a private endpoint using Azure portal

### Prerequisites
To integrate an Azure Relay namespace with Azure Private Link (Preview), you'll need the following entities or permissions:

- An Azure Relay namespace.
- An Azure virtual network.
- A subnet in the virtual network.
- Owner or contributor permissions on the virtual network.

Your private endpoint and virtual network must be in the same region. When you select a region for the private endpoint using the portal, it will automatically filter only virtual networks that are in that region. Your namespace can be in a different region.

Your private endpoint uses a private IP address in your virtual network.

### Steps
For step-by-step instructions on creating a new Azure Relay namespace and entities in it, see [Create an Azure Relay namespace using the Azure portal](relay-create-namespace-portal.md).

1. Sign in to the [Azure portal](https://portal.azure.com). 
2. In the search bar, type in **Relays**.
3. Select the **namespace** from the list to which you want to add a private endpoint.
4. Select the **Networking** tab under **Settings**.
5. Select the **Private endpoint connections (preview)** tab at the top of the page
6. Select the **+ Private Endpoint** button at the top of the page.

    ![Add private endpoint button](./media/private-link-service/add-private-endpoint-button.png)
7. On the **Basics** page, follow these steps: 
    1. Select the **Azure subscription** in which you want to create the private endpoint. 
    2. Select the **resource group** for the private endpoint resource.
    3. Enter a **name** for the private endpoint. 
    5. Select a **region** for the private endpoint. Your private endpoint must be in the same region as your virtual network, but can be in a different region from the Azure Relay namespace that you are connecting to. 
    6. Select **Next: Resource >** button at the bottom of the page.

        ![Create Private Endpoint - Basics page](./media/private-link-service/create-private-endpoint-basics-page.png)
8. On the **Resource** page, follow these steps:
    1. For connection method, if you select **Connect to an Azure resource in my directory**, you have owner or contributor access to the namespace and that namespace is in the same directory as the private endpoint, follow these steps: 
        1. Select the **Azure subscription** in which your **Azure Relay namespace** exists. 
        2. For **Resource type**, Select **Microsoft.Relay/namespaces** for the **Resource type**.
        3. For **Resource**, select a Relay namespace from the drop-down list. 
        4. Confirm that the **Target subresource** is set to **namespace**.
        5. Select **Next: Configuration >** button at the bottom of the page. 
        
            ![Create Private Endpoint - Resource page](./media/private-link-service/create-private-endpoint-resource-page.png)    
    2. If you select **Connect to an Azure resource by resource ID or alias** because the namespace is not under the same directory as that of the private endpoint, follow these steps:
        1. Enter the **resource ID** or **alias**. It can be the resource ID or alias that someone has shared with you. The easiest way to get the resource ID is to navigate to the Azure Relay namespace in the Azure portal and copy the portion of URI starting from `/subscriptions/`. Here is an example: `/subscriptions/000000000-0000-0000-0000-000000000000000/resourceGroups/myresourcegroup/providers/Microsoft.Relay/namespaces/myrelaynamespace.` 
        2. For **Target sub-resource**, enter **namespace**. It's the type of the sub-resource that your private endpoint can access.
        3. (optional) Enter a **request message**. The resource owner sees this message while managing private endpoint connection.
        4. Then, select **Next: Configuration >** button at the bottom of the page.

            ![Create Private Endpoint - Connect using resource ID](./media/private-link-service/connect-resource-id.png)
9. On the **Configuration** page, you select the subnet in a virtual network to where you want to deploy the private endpoint. 
    1. Select a **virtual network**. Only virtual networks in the currently selected subscription and location are listed in the drop-down list. 
    2. Select a **subnet** in the virtual network you selected. 
    3. Enable **Integrate with private DNS zone** if you want to integrate your private endpoint with a private DNS zone. 
    
        To connect privately with your private endpoint, you need a DNS record. We recommend that you integrate your private endpoint with a **private DNS zone**. You can also utilize your own DNS servers or create DNS records using the host files on your virtual machines. For more information, see [Azure Private Endpoint DNS Configuration](../private-link/private-endpoint-dns.md). In this example, the **Integrate with private DNS zone** option is selected and a private DNS zone will be created for you. 
    3. Select **Next: Tags >** button at the bottom of the page. 

        ![Create Private Endpoint - Configuration page](./media/private-link-service/create-private-endpoint-configuration-page.png)
10. On the **Tags** page, create any tags (names and values) that you want to associate with the private endpoint and the private DNS zone (if you had enabled the option). Then, select **Review + create** button at the bottom of the page. 
11. On the **Review + create**, review all the settings, and select **Create** to create the private endpoint.
    
    ![Create Private Endpoint - Review and Create page](./media/private-link-service/create-private-endpoint-review-create-page.png)
12. On the **Private endpoint** page, you can see the status of the private endpoint connection. If you are the owner of the Relay namespace or have the manage access over it and had selected **Connect to an Azure resource in my directory** option for the **Connection method**, the endpoint connection should be **auto-approved**. If it's in the **pending** state, see the [Manage private endpoints using Azure portal](#manage-private-endpoints-using-azure-portal) section.

    ![Private endpoint page](./media/private-link-service/private-endpoint-page.png)
13. Navigate back to the **Networking** page of the **namespace**, and switch to the **Private endpoint connections (preview)** tab. You should see the private endpoint that you created. 

    ![Private endpoint created](./media/private-link-service/private-endpoint-created.png)

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
az group create -l $vnetLocation -n $rgName

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

# get subnet object that you will use in the next step                                
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

When you create a private endpoint, the connection must be approved. If the resource (Relay namespace) for which you're creating a private endpoint is in your directory, you can approve the connection request provided you have manage privileges over the Relay namespace. If you're connecting to a Relay namespace for which you don't have the manage access, you must wait for the owner of that resource to approve your connection request.

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

1. If there are any connections that are pending, you will see a connection listed with **Pending** in the provisioning state. 
2. Select the **private endpoint** you wish to approve
3. Select the **Approve** button.

    ![Approve private endpoint](./media/private-link-service/private-endpoint-approve.png)
4. On the **Approve connection** page, enter an optional **comment**, and select **Yes**. If you select **No**, nothing happens. 

    ![Approve connection page](./media/private-link-service/approve-connection-page.png)
5. You should see the status of the connection in the list changed to **Approved**.

### Reject a private endpoint connection

1. If there are any private endpoint connections you want to reject, whether it is a pending request or existing connection that was approved earlier, select the endpoint connection and click the **Reject** button.

    ![Reject button](./media/private-link-service/private-endpoint-reject.png)
2. On the **Reject connection** page, enter an optional comment, and select **Yes**. If you select **No**, nothing happens. 

    ![Reject connection page](./media/private-link-service/reject-connection-page.png)
3. You should see the status of the connection in the list changed **Rejected**.


### Remove a private endpoint connection

1. To remove a private endpoint connection, select it in the list, and select **Remove** on the toolbar. 

    ![Remove button](./media/private-link-service/remove-endpoint.png)
2. On the **Delete connection** page, select **Yes** to confirm the deletion of the private endpoint. If you select **No**, nothing happens. 

    ![Delete connection page](./media/private-link-service/delete-connection-page.png)
3. You should see the status changed to **Disconnected**. Then, you will see the endpoint disappear from the list. 

## Validate that the private link connection works
You should validate that resources within the same subnet of the private endpoint are connecting to your Azure Relay namespace over its private IP address.

For this test, create a virtual machine by following the steps in the [Create a Windows virtual machine in the Azure portal](../virtual-machines/windows/quick-create-portal.md)

In the **Networking** tab: 

1. Specify **Virtual network** and **Subnet**. You must select the Virtual Network on which you deployed the private endpoint.
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
- Private Endpoint for Azure Relay is in **public preview**. 
- For pricing information, see [Azure Private Link (preview) pricing](https://azure.microsoft.com/pricing/details/private-link/).

### Limitations 
- Maximum number of private endpoints per Azure Relay namespace: 64.
- Maximum number of Azure Relay namespaces with private endpoints per subscription: 64.
- Network Security Group (NSG) rules and User-Defined Routes don't apply to Private Endpoint. For more information, see [Azure Private Link service: Limitations](../private-link/private-link-service-overview.md#limitations)

## Next Steps

- Learn more about [Azure Private Link (Preview)](../private-link/private-link-service-overview.md)
- Learn more about [Azure Relay](relay-what-is-it.md)
