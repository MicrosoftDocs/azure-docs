---
title: Secure access to an Azure Cosmos DB account by using Azure Virtual Network service endpoint | Microsoft Docs
description: This document describes steps required to setup Azure Cosmos DB virtual network service endpoint. 
services: cosmos-db
author: SnehaGunda
manager: kfile

ms.service: cosmos-db
ms.workload: data-services
ms.topic: article
ms.date: 05/01/2018
ms.author: sngun

---

# Secure access to an Azure Cosmos DB account by using Azure Virtual Network service endpoint

Azure CosmosDB accounts can be configured to allow access only from specific Azure Virtual Network’s subnet. By enabling a [Service Endpoint]() for Azure Cosmos DB from a Virtual Network and its subnet, traffic is ensured an optimal and secure route to the Azure Cosmos DB.  

Once an Azure Cosmos DB account is configured with a VNet service endpoint, it can be accessed only from the specified subnet, all public/internet access is removed. To learn in detailed about service endpoints, refer to the Azure [Virtual network service endpoints overview]() article.

Azure Cosmos DB is a globally distributed, multi-model database service. You can replicate the data present in Azure Cosmos DB account to multiple regions. When Azure Cosmos DB is configured with a VNet service endpoint, each region is secure and allow access from IPs that belong to the subnet only. The following image shows an illustration of an Azure Cosmos DB that has VNet service endpoint enabled:

![VNet service endpoint architecture](./media/vnet-service-endpoint/vnet-service-endpoint-architecture.png)

> [!NOTE]
> Currently Azure Virtual network service endpoints can be configured for Azure Cosmos DB SQL API or Mongo API accounts. Configuring service endpoints for other multi-model APIs and sovereign clouds such as Azure Germany or Azure Government will be available soon.

## Configure service endpoint by using Azure portal
### Configure service endpoint for an existing Azure virtual network and subnet

1. From **All resources** blade, find the Azure Cosmos DB account you want to secure.  

2. Select **Firewalls and virtual networks** from settings menu and choose allow access from **Selected networks**.  

   ![Choose selected networks](./media/vnet-service-endpoint/choose-selected-networks.png)

3. To grant access to an existing virtual network, under Virtual networks, select **Add existing Azure virtual network**.  

4. Select the **Subscription** from which you want to add Azure virtual network. Select the Azure **Virtual networks** and **Subnets** that you wish to provide access to your Azure Cosmos DB account. Next select **Enable** to enable selected networks with service endpoints for "Microsoft.AzureCosmosDB". When it’s complete, select **Add**.  

   > [!NOTE]
   > If service endpoint for Azure Cosmos DB isn’t previously configured for the selected Azure virtual networks and subnets, it can be configured as a part of this operation. Enabling access will take up to 15 minutes to complete. 

   ![Select VNet and subnet](./media/vnet-service-endpoint/choose-subnet-and-vnet.png)

### Configure service endpoint for a new Azure virtual network and subnet

1. From **All resources** blade, find the Azure Cosmos DB account you want to secure.  

2. Select **Firewalls and Azure virtual networks** from settings menu and choose allow access from **Selected networks**.  

3. To grant access to a new Azure virtual network, under Virtual networks, select **Add new virtual network**.  

4. Provide the details required to create a new virtual network, and then select Create. The subnet will be created with a service endpoint for "Microsoft.AzureCosmosDB" enabled.

   ![Select VNet and subnet for new VNet](./media/vnet-service-endpoint/choose-subnet-and-vnet-new-vnet.png)

## Allow access from Azure portal

After Azure Virtual Network service endpoints are enabled for your Azure Cosmos DB database account, access from portal or other Azure services is disabled by default. Access to your Azure Cosmos DB database account from machines outside the configured subnet are blocked including access from portal.

![Allow access from portal](./media/vnet-service-endpoint/allow-access-from-portal.png)

If you want to allow access from Azure portal or from other Azure services, you can do so by checking **Allow access to Azure Services** and/or **Allow access to Azure Portal** options. To learn more about these options, see [connections from Azure portal](firewall-support.md#connections-from-the-azure-portal) and [connections from Azure PaaS services](firewall-support.md#connections-from-other-azure-paas-services) sections. After selecting access, select **Save** to save the settings.

## Remove a virtual network or subnet 

1. From **All resources** blade, find the Azure Cosmos DB account for which you assigned service endpoints.  

2. Select **Firewalls and virtual networks** from settings menu.  

3. To remove a virtual network or subnet rule, select "..." next to the virtual network or subnet and select **Remove**.

   ![Remove a VNet](./media/vnet-service-endpoint/remove-a-vnet.png)

4.	Click **Save** to apply your changes.

## Configure Service endpoint by using Azure PowerShell 

Use the following steps to configure Service endpoint to an Azure Cosmos DB account by using Azure PowerShell:  

1. Install the latest [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) and [Login](https://docs.microsoft.com/powershell/azure/authenticate-azureps).  

2. Enable the service endpoint for an existing subnet of a virtual network.  

   ```powershell
   $rgname= "<Resource group name>"
   $vnName = "<VNet name>"
   $sname = "<Subnet name>"
   $subnetPrefix = "<Subnet address range>"

   Get-AzureRmVirtualNetwork `
    -ResourceGroupName $rgname `
    -Name $vnName | Set-AzureRmVirtualNetworkSubnetConfig `
    -Name $sname  `
    -AddressPrefix $subnetPrefix `
    -ServiceEndpoint "Microsoft.AzureCosmosDB" | Set-AzureRmVirtualNetwork
   ```

3. Get ready for the enablement of ACL on the CosmosDB Account by making sure that the VNet and subnet have service endpoint enabled for Azure Cosmos DB.

   ```powershell
   $subnet = Get-AzureRmVirtualNetwork `
    -ResourceGroupName $rgname `
    -Name $vnName  | Get-AzureRmVirtualNetworkSubnetConfig -Name $sname
   $vnProp = Get-AzureRmVirtualNetwork `-Name $vnName  -ResourceGroupName $rgName
   ```

4. Get properties of Azure Cosmos DB account by running the following cmdlet:  

   ```powershell
   $cosmosDBConfiguration = Get-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" `
     -ApiVersion $apiVersion `
     -ResourceGroupName $rgName `
     -Name $acctName
   ```

5. Initialize the variables for use later. Setup all the variables from the existing account definition, if you have multiple locations, you need to add them as part of the array. In this step, you also configure VNet service endpoint by setting the "accountVNETFilterEnabled" variable to "True". This value is later assigned to the "isVirtualNetworkFilterEnabled" parameter.  

   ```powershell
   $locations = @(@{})
   $consistencyPolicy = @{}
   $cosmosDBProperties = @{}

   $locations[0]['failoverPriority'] = $cosmosDBConfiguration.Properties.failoverPolicies.failoverPriority
   $locations[0]['locationName'] = $cosmosDBConfiguration.Properties.failoverPolicies.locationName
   $consistencyPolicy = $cosmosDBConfiguration.Properties.consistencyPolicy

   $accountVNETFilterEnabled = $True
   $subnetID = $vnProp.Id+"/subnets/" + $subnetName  
   $virtualNetworkRules = @(@{"id"=$subnetID})
   $databaseAccountOfferType = $cosmosDBConfiguration.Properties.databaseAccountOfferType
   ```

6. Update Azure Cosmos DB account properties with the new configuration by running the following cmdlets: 

   ```powershell
   $cosmosDBProperties['databaseAccountOfferType'] = $databaseAccountOfferType
   $cosmosDBProperties['locations'] = $locations
   $cosmosDBProperties['consistencyPolicy'] = $consistencyPolicy
   $cosmosDBProperties['virtualNetworkRules'] = $virtualNetworkRules
   $cosmosDBProperties['isVirtualNetworkFilterEnabled'] = $accountVNETFilterEnabled

   Set-AzureRmResource ``
     -ResourceType "Microsoft.DocumentDb/databaseAccounts" `
     -ApiVersion $apiVersion `
     -ResourceGroupName $rgName `
     -Name $acctName -Properties $CosmosDBProperties
   ```

7. Run the following command to verify that your Azure Cosmos DB account is updated with the VNet service endpoint that you configured in the previous step:

   ```powershell
   $upDatedcosmosDBConfiguration = Get-AzureRmResource `
     -ResourceType "Microsoft.DocumentDb/databaseAccounts" `
     -ApiVersion $apiVersion `
     -ResourceGroupName $rgName `
     -Name $acctName

   $upDatedcosmosDBConfiguration.Properties
   ```

## Add VNet service endpoint for an Azure Cosmos DB account that has IP Firewall enabled

1. First disable the IP firewall access to Azure Cosmos DB account.  

2. Enable virtual network endpoint to the Azure Cosmos DB account by using one of the methods described in the previous sections.  

3. Re-enable the IP firewall access. 

## Test the access

To check if service endpoints for Azure Cosmos DB are configured as expected use the following steps:

* Set up two subnets in a virtual network as frontend and backend, enable Cosmos DB service endpoint for the backend subnet.  

* Enable access in the Cosmos DB account for the backend subnet.  

* Create two virtual machines- one in backend subnet and another in the frontend subnet.  

* Try accessing the Azure Cosmos DB account from both virtual machines. You should be able to connect from virtual machine created in backend subnet but not from the one created in frontend subnet. The request will error out with 404 when you try connecting from the frontend subnet which confirms that the access to Azure Cosmos DB is secured by using the VNet service endpoint. The machine in the backend subnet will be able to work fine.

## Frequently asked questions

### What happens when you access an Azure Cosmos DB account that has VNet Access Control List (ACL) enabled?  

HTTP 404 error is returned.  

### Are subnets of a VNet created in different regions allowed to access an Azure Cosmos DB account in another region? For example, if Azure Cosmos DB account is in West US or East US and VNet’s are in multiple regions, can the VNet access Azure Cosmos DB?  

Yes, virtual networks created in different regions can access by the new capability. 

### Can an Azure Cosmos DB account have both VNet Service endpoint and a firewall?  

Yes, Virtual Network Service endpoint and a firewall can co-exist. In general, you should ensure that access to portal is always enabled before configuring a virtual network service endpoint to enable you to view the metrics associated with the container.

### Can I "allow access to other Azure services from a region x" when service endpoint access is enabled for Azure Cosmos DB?  

This is required only when you want your Azure Cosmos DB account to be accessed by other Azure first party services or any service that is deployed in given Azure. 

### How many virtual network service endpoints are allowed for Azure Cosmos DB?  

64 virtual network service endpoints are allowed for an Azure Cosmos DB account.

### What is the relationship of Service Endpoint with respect to Network Security Group (NSG) rules?  

NSG has allow Azure Cosmos DB rule to control access to Azure Cosmos DB IP address range.
  
### What is relationship between an IP firewall and Virtual Network service endpoint capability?  

These two features complement each other to ensure isolation of Azure Cosmos DB assets and secure them. Using IP firewall ensures that static IPs can access Azure Cosmos DB account. VNet service endpoints on other hand ensure that incoming traffic can be from all IPs within a subnet of Azure VNet. 

### Can an on-premise device’s IP address that is connected through Azure Virtual Network gateway(VPN) or Express route gateway access Azure Cosmos DB account?  

The on-premise device’s IP address or IP address range should be added to the list of static IPs’ in order to access the Azure Cosmos DB account.  

### What happens if you delete a VNet that has service endpoint setup for Azure Cosmos DB?  

When a VNet is deleted, the ACL information associated with that Azure Cosmos DB is deleted and it removes the interaction between VNet and the Azure Cosmos DB account. 

### What happens if an Azure Cosmos DB account that has VNet service endpoint enabled is deleted?

The metadata associated with the specific Azure Cosmos DB account is deleted from the subnet. And it’s the end user’s responsibility to delete the subnet and VNet used.

### Can I use a peered VNet to create service endpoint for Azure Cosmos DB?  

No, only direct VNet and their subnets can create Azure Cosmos DB service endpoints.

### What happens to the source IP address of resource like virtual machine in the subnet that has Azure Cosmos DB service endpoint enabled?

When VNet service endpoints are enabled, the source IP addresses of resources in your VNet's subnet will switch from using public IPV4 addresses to Azure Virtual Network's private addresses for traffic to Azure Cosmos DB.

### Does Azure Cosmos DB reside in the Azure virtual network  provided by the customer?  

Azure Cosmos DB is a multi-tenant service with a public IP address. When you restrict access to a subnet of a Azure Virtual network by using the service endpoint feature, access is restricted for your Azure Cosmos DB account through the given Azure Virtual Network and its subnet.  Azure Cosmos DB account does not reside in that Azure Virtual Network. 

### What if anything will be logged in Log Analytics/OMS if it is enabled?  

Azure Cosmos DB will push logs with IP address (without the last octet) with status 403 for request blocked by ACL.  

## Next steps
To configure a firewall for Azure Cosmos DB see [firewall support](firewall-support.md) article.

