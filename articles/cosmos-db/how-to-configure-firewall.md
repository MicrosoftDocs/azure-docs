---
title: Configure an IP firewall for your Azure Cosmos DB account
description: Learn how to configure IP access control policies for firewall support on Azure Cosmos DB database accounts.
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/23/2019
ms.author: mjbrown
---

# Configure IP firewall in Azure Cosmos DB

You can secure the data stored in your Azure Cosmos DB account by using IP firewalls. Azure Cosmos DB supports IP-based access controls for inbound firewall support. You can set an IP firewall on the Azure Cosmos DB account by using one of the following ways:

* From the Azure portal
* Declaratively by using an Azure Resource Manager template
* Programmatically through the Azure CLI or Azure PowerShell by updating the **ipRangeFilter** property

## <a id="configure-ip-policy"></a> Configure an IP firewall by using the Azure portal

To set the IP access control policy in the Azure portal, go to the Azure Cosmos DB account page and select **Firewall and virtual networks** on the navigation menu. Change the **Allow access from** value to **Selected networks**, and then select **Save**. 

![Screenshot showing how to open the Firewall page in the Azure portal](./media/how-to-configure-firewall/azure-portal-firewall.png)

When IP access control is turned on, the Azure portal provides the ability to specify IP addresses, IP address ranges, and switches. Switches enable access to other Azure services and the Azure portal. The following sections give details about these switches.

> [!NOTE]
> After you enable an IP access control policy for your Azure Cosmos DB account, all requests to your Azure Cosmos DB account from machines outside the allowed list of IP address ranges are rejected. Browsing the Azure Cosmos DB resources from the portal is also blocked to ensure the integrity of access control.

### Allow requests from the Azure portal

When you enable an IP access control policy programmatically, you need to add the IP address for the Azure portal to the **ipRangeFilter** property to maintain access. The portal IP addresses are:

|Region|IP address|
|------|----------|
|Germany|51.4.229.218|
|China|139.217.8.252|
|US Gov|52.244.48.71|
|All other regions|104.42.195.92,40.76.54.131,52.176.6.30,52.169.50.45,52.187.184.26|

You can enable access to the Azure portal by selecting the **Allow access from Azure portal** option, as shown in the following screenshot: 

![Screenshot showing how to enable Azure portal access](./media/how-to-configure-firewall/enable-azure-portal.png)

### Allow requests from global Azure datacenters or other sources within Azure

If you access your Azure Cosmos DB account from services that don’t provide a static IP (for example, Azure Stream Analytics and Azure Functions), you can still use the IP firewall to limit access. To allow access to the Azure Cosmos DB account from such services, add the IP address 0.0.0.0 to the list of allowed IP addresses. The 0.0.0.0 address restricts requests to your Azure Cosmos DB account from Azure datacenter IP range. This setting does not allow access for any other IP ranges to your Azure Cosmos DB account.

> [!NOTE]
> This option configures the firewall to allow all requests from Azure, including requests from the subscriptions of other customers deployed in Azure. The list of IPs allowed by this option is wide, so it limits the effectiveness of a firewall policy. Use this option only if your requests don’t originate from static IPs or subnets in virtual networks. Choosing this option automatically allows access from the Azure portal because the Azure portal is deployed in Azure.

You can enable access to the Azure portal by selecting the **Accept connections from within public Azure datacenters** option, as shown in the following screenshot: 

![Screenshot showing how to open the Firewall page in the Azure portal](./media/how-to-configure-firewall/enable-azure-services.png)

### Requests from your current IP

To simplify development, the Azure portal helps you identify and add the IP of your client machine to the allowed list. Apps running your machine can then access your Azure Cosmos DB account. 

The portal automatically detects the client IP address. It might be the client IP address of your machine, or the IP address of your network gateway. Make sure to remove this IP address before you take your workloads to production. 

To add your current IP to the list of IPs, select **Add my current IP**. Then select **Save**.

![Screenshot showing a how to configure firewall settings for the current IP](./media/how-to-configure-firewall/enable-current-ip.png)

### Requests from cloud services

In Azure, cloud services are a common way for hosting middle-tier service logic by using Azure Cosmos DB. To enable access to your Azure Cosmos DB account from a cloud service, you must add the public IP address of the cloud service to the allowed list of IP addresses associated with your Azure Cosmos DB account by [configuring the IP access control policy](#configure-ip-policy). This ensures that all role instances of cloud services have access to your Azure Cosmos DB account. 

You can retrieve IP addresses for your cloud services in the Azure portal, as shown in the following screenshot:

![Screenshot showing the public IP address for a cloud service displayed in the Azure portal](./media/how-to-configure-firewall/public-ip-addresses.png)

When you scale out your cloud service by adding role instances, those new instances will automatically have access to the Azure Cosmos DB account because they're part of the same cloud service.

### Requests from virtual machines

You can also use [virtual machines](https://azure.microsoft.com/services/virtual-machines/) or [virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) to host middle-tier services by using Azure Cosmos DB. To configure your Cosmos DB account such that it allows access from virtual machines, you must configure the public IP address of the virtual machine and/or virtual machine scale set as one of the allowed IP addresses for your Azure Cosmos DB account by [configuring the IP access control policy](#configure-ip-policy). 

You can retrieve IP addresses for virtual machines in the Azure portal, as shown in the following screenshot:

![Screenshot showing a public IP address for a virtual machine displayed in the Azure portal](./media/how-to-configure-firewall/public-ip-addresses-dns.png)

When you add virtual machine instances to the group, they automatically receive access to your Azure Cosmos DB account.

### Requests from the internet

When you access your Azure Cosmos DB account from a computer on the internet, the client IP address or IP address range of the machine must be added to the allowed list of IP addresses for your account.

## <a id="configure-ip-firewall-arm"></a>Configure an IP firewall by using a Resource Manager template

To configure access control to your Azure Cosmos DB account, make sure that the Resource Manager template specifies the **ipRangeFilter** attribute with a list of allowed IP ranges. For example, add the following JSON code to your template:

```json
   {
     "apiVersion": "2015-04-08",
     "type": "Microsoft.DocumentDB/databaseAccounts",
     "kind": "GlobalDocumentDB",
     "name": "[parameters('databaseAccountName')]",
     "location": "[resourceGroup().location]",
     "properties": {
       "databaseAccountOfferType": "Standard",
       "name": "[parameters('databaseAccountName')]",
       "ipRangeFilter":"183.240.196.255,104.42.195.92,40.76.54.131,52.176.6.30,52.169.50.45,52.187.184.26"
     }
   }
```

## <a id="configure-ip-firewall-cli"></a>Configure an IP access control policy by using the Azure CLI

The following command shows how to create an Azure Cosmos DB account with IP access control: 

```azurecli-interactive

name="<Azure Cosmos DB account name>"
resourceGroupName="<Resource group name>"

az cosmosdb create \
  --name $name \
  --kind GlobalDocumentDB \
  --resource-group $resourceGroupName \
  --max-interval 10 \
  --max-staleness-prefix 200 \
  --ip-range-filter "183.240.196.255,104.42.195.92,40.76.54.131,52.176.6.30,52.169.50.45,52.187.184.26"
```

To update the firewall settings for an existing account, run the following command:

```azurecli-interactive
az cosmosdb update \
      --name $name \
      --resource-group $resourceGroupName \
      --ip-range-filter "183.240.196.255,104.42.195.92,40.76.54.131,52.176.6.30,52.169.50.45,52.187.184.26"
```

## <a id="configure-ip-firewall-ps"></a>Configure an IP access control policy by using PowerShell

The following script shows how to create an Azure Cosmos DB account with IP access control:

```azurepowershell-interactive

$resourceGroupName = "myResourceGroup"
$accountName = "myaccountname"

$locations = @(
    @{ "locationName"="West US"; "failoverPriority"=0 },
    @{ "locationName"="East US"; "failoverPriority"=1 }
)

# Add local machine's IP address to firewall, InterfaceAlias is your Network Adapter's name
$ipRangeFilter = Get-NetIPConfiguration | Where-Object InterfaceAlias -eq "Ethernet 2" | Select-Object IPv4Address

$consistencyPolicy = @{ "defaultConsistencyLevel"="Session" }

$CosmosDBProperties = @{
    "databaseAccountOfferType"="Standard";
    "locations"=$locations;
    "consistencyPolicy"=$consistencyPolicy;
    "ipRangeFilter"=$ipRangeFilter
}

Set-AzResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" `
    -ApiVersion "2015-04-08" -ResourceGroupName $resourceGroupName `
    -Name $accountName -PropertyObject $CosmosDBProperties
```

## <a id="troubleshoot-ip-firewall"></a>Troubleshoot issues with an IP access control policy

You can troubleshoot issues with an IP access control policy by using the following options: 

### Azure portal 
By enabling an IP access control policy for your Azure Cosmos DB account, you block all requests to your account from machines outside the allowed list of IP address ranges. To enable portal data-plane operations like browsing containers and querying documents, you need to explicitly allow Azure portal access by using the **Firewall** pane in the portal.

### SDKs 
When you access Azure Cosmos DB resources by using SDKs from machines that are not in the allowed list, a generic **403 Forbidden** response is returned with no additional details. Verify the allowed IP list for your account, and make sure that the correct policy configuration is applied to your Azure Cosmos DB account. 

### Source IPs in blocked requests
Enable diagnostic logging on your Azure Cosmos DB account. These logs show each request and response. The firewall-related messages are logged with a 403 return code. By filtering these messages, you can see the source IPs for the blocked requests. See [Azure Cosmos DB diagnostic logging](logging.md).

### Requests from a subnet with a service endpoint for Azure Cosmos DB enabled
Requests from a subnet in a virtual network that has a service endpoint for Azure Cosmos DB enabled sends the virtual network and subnet identity to Azure Cosmos DB accounts. These requests don't have the public IP of the source, so IP filters reject them. To allow access from specific subnets in virtual networks, add an access control list as outlined in [How to configure virtual network and subnet-based access for your Azure Cosmos DB account](how-to-configure-vnet-service-endpoint.md). It can take up to 15 minutes for firewall rules to apply.


## Next steps

To configure a virtual network service endpoint for your Azure Cosmos DB account, see the following articles:

* [Virtual network and subnet access control for your Azure Cosmos DB account](vnet-service-endpoint.md)
* [Configure virtual network and subnet-based access for your Azure Cosmos DB account](how-to-configure-vnet-service-endpoint.md)

