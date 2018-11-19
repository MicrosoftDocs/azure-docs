---
title: How to configure virtual network and subnet-based access for your Azure Cosmos account
description: This document describes steps required to setup Azure Cosmos DB virtual network service endpoint. 
author: kanshiG

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 11/06/2018
ms.author: govindk

---

# How to access Azure Cosmos DB resources from virtual networks

Azure CosmosDB accounts can be configured to allow access only from specific subnet of Azure Virtual Network. There are two steps required to limit access to Azure Cosmos account with connections from a subnet in a virtual network (VNET).
 
1. Enable the subnet to send the subnet and VNET identity to Azure Cosmos DB. You can achieve this by enabling service endpoint for Azure Cosmos DB on the specific subnet.

1. Add a rule in Azure Cosmos account specifying the subnet as a source from which, the account can be accessed.

> [!NOTE]
> Once service endpoint for your Azure Cosmos account is enabled on a subnet, the source of the traffic reaching Azure Cosmos DB switches from public IP to VNET and subnet. The traffic switching applies for any Azure Cosmos account being accessed from this subnet. If your Azure Cosmos account(s) have IP based firewall to allow this subnet, requests from service enabled subnet would no longer match the IP firewall rules and they are rejected. To learn more, see the steps outlined in [migrating from IP firewall rule to VNET Access Control List](#migrate-from-firewall-to-vnet) section of this article. 

The following sections describe how to configure VNET service endpoint for an Azure Cosmos account.

## <a id="configure-using-portal"></a>Configure service endpoint by using Azure portal

### Configure service endpoint for an existing Azure virtual network and subnet

1. From **All resources** blade, find the Azure Cosmos account you want to secure.

1. Select **Firewalls and virtual networks** from settings menu and choose allow access from **Selected networks**.

1. To grant access to an existing virtual network's subnet, under **Virtual networks**, select **Add existing Azure virtual network**.

1. Select the **Subscription** from which you want to add Azure virtual network. Select the Azure **Virtual networks** and **Subnets** that you wish to provide access to your Azure Cosmos account. Next select **Enable** to enable selected networks with service endpoints for "Microsoft.AzureCosmosDB". When it’s complete, select **Add**. 

   ![Select virtual network and subnet](./media/how-to-configure-vnet-service-endpoint/choose-subnet-and-vnet.png)


1. After the Azure Cosmos account is enabled to access from a virtual network, it will only allow traffic from this chosen subnet. The virtual network and subnet you added should appear as shown in the following screenshot:

   ![virtual network and subnet configured successfully](./media/how-to-configure-vnet-service-endpoint/vnet-and-subnet-configured-successfully.png)

> [!NOTE]
> To enable virtual network service endpoints, you would need the following subscription permissions:
  * Subscription with VNET: Network contributor
  * Subscription with Azure Cosmos account: DocumentDB Account Contributor

### Configure service endpoint for a new Azure virtual network and subnet

1. From **All resources** blade, find the Azure Cosmos account you want to secure.

1. Select **Firewalls and Azure virtual networks** from settings menu and choose allow access from **Selected networks**.  

1. To grant access to a new Azure virtual network, under virtual networks, select **Add new virtual network**.  

1. Provide the details required to create a new virtual network, and then select Create. The subnet will be created with a service endpoint for "Microsoft.AzureCosmosDB" enabled.

   ![Select virtual network and subnet for new virtual network](./media/how-to-configure-vnet-service-endpoint/choose-subnet-and-vnet-new-vnet.png)

If your Azure Cosmos account is used by other Azure services like Azure Search, or accessed from Stream analytics or Power BI, you allow access by checking **Accept connections from within public Azure datacenters**.

To ensure you have access to Azure Cosmos DB metrics from the portal, you need to enable **Allow access from Azure Portal** options. To learn more about these options, see requests from Azure portal and request from Azure PaaS services sections of the configure [IP firewall](how-to-configure-firewall.md) article. After selecting access, select **Save** to save the settings.

## <a id="remove-vnet-or-subnet"></a>Remove a virtual network or subnet 

1. From **All resources** blade, find the Azure Cosmos account for which you assigned service endpoints.  

2. Select **Firewalls and virtual networks** from settings menu.  

3. To remove a virtual network or subnet rule, select "..." next to the virtual network or subnet and select **Remove**.

   ![Remove a virtual network](./media/how-to-configure-vnet-service-endpoint/remove-a-vnet.png)

4.	Click **Save** to apply your changes.

## <a id="configure-using-powershell"></a>Configure service endpoint by using Azure PowerShell 

Use the following steps to configure service endpoint to an Azure Cosmos account by using Azure PowerShell:  

1. Install the latest [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) and [Login](https://docs.microsoft.com/powershell/azure/authenticate-azureps).  

1. Enable the service endpoint for an existing subnet of a virtual network.  

   ```powershell
   $rgname = "<Resource group name>"
   $vnName = "<Virtual network name>"
   $sname = "<Subnet name>"
   $subnetPrefix = "<Subnet address range>"

   Get-AzureRmVirtualNetwork `
    -ResourceGroupName $rgname `
    -Name $vnName | Set-AzureRmVirtualNetworkSubnetConfig `
    -Name $sname  `
    -AddressPrefix $subnetPrefix `
    -ServiceEndpoint "Microsoft.AzureCosmosDB" | Set-AzureRmVirtualNetwork
   ```

1. Get VNET information.

   ```powershell
   $vnProp = Get-AzureRmVirtualNetwork `
     -Name $vnName `
     -ResourceGroupName $rgName
   ```

1. Get properties of Azure Cosmos account by running the following cmdlet:  

   ```powershell
   $apiVersion = "2015-04-08"
   $acctName = "<Azure Cosmos account name>"

   $cosmosDBConfiguration = Get-AzureRmResource `
     -ResourceType "Microsoft.DocumentDB/databaseAccounts" `
     -ApiVersion $apiVersion `
     -ResourceGroupName $rgName `
     -Name $acctName
   ```

1. Initialize the variables for use later. Set up all the variables from the existing account definition. In this step, you also configure virtual network service endpoint by setting the "accountVNETFilterEnabled" variable to "True". This value is later assigned to the "isVirtualNetworkFilterEnabled" parameter.

   ```powershell
   $locations = @()

   foreach ($readLocation in $cosmosDBConfiguration.Properties.readLocations) {
      $locations += , @{
         locationName = $readLocation.locationName;
         failoverPriority = $readLocation.failoverPriority;
      }
   }

   $consistencyPolicy = $cosmosDBConfiguration.Properties.consistencyPolicy
   $accountVNETFilterEnabled = $True
   $subnetID = $vnProp.Id+"/subnets/" + $sname  
   $virtualNetworkRules = @(@{"id"=$subnetID})
   $databaseAccountOfferType = $cosmosDBConfiguration.Properties.databaseAccountOfferType
   ```

1. Update Azure Cosmos account properties with the new configuration by running the following cmdlets: 

   ```powershell
   $cosmosDBProperties = @{
      databaseAccountOfferType = $databaseAccountOfferType;
      locations = $locations;
      consistencyPolicy = $consistencyPolicy;
      virtualNetworkRules = $virtualNetworkRules;
      isVirtualNetworkFilterEnabled = $accountVNETFilterEnabled;
   }

   Set-AzureRmResource `
     -ResourceType "Microsoft.DocumentDB/databaseAccounts" `
     -ApiVersion $apiVersion `
     -ResourceGroupName $rgName `
     -Name $acctName `
     -Properties $CosmosDBProperties
   ```

1. Run the following command to verify that your Azure Cosmos account is updated with the virtual network service endpoint that you configured in the previous step:

   ```powershell
   $UpdatedcosmosDBConfiguration = Get-AzureRmResource `
     -ResourceType "Microsoft.DocumentDB/databaseAccounts" `
     -ApiVersion $apiVersion `
     -ResourceGroupName $rgName `
     -Name $acctName

   $UpdatedcosmosDBConfiguration.Properties
   ```

## <a id="configure-using-cli"></a>Configure service endpoint by using Azure CLI 

1. Enable the service endpoint for a subnet in a virtual network.

1. Update existing Azure Cosmos account with subnet ACLs

   ```azurecli-interactive

   name="<Azure Cosmos account name>"
   resourceGroupName="<Resource group name>"

   az cosmosdb update \
    --name $name \
    --resource-group $resourceGroupName \
    --enable-virtual-network true \
    --virtual-network-rules "/subscriptions/testsub/resourceGroups/testRG/providers/Microsoft.Network/virtualNetworks/testvnet/subnets/frontend"
   ```

1. Create a new Azure Cosmos account with subnet ACLs

   ```azurecli-interactive
   az cosmosdb create \
    --name $name \
    --kind GlobalDocumentDB \
    --resource-group $resourceGroupName \
    --max-interval 10 \
    --max-staleness-prefix 200 \
    --enable-virtual-network true \
    --virtual-network-rules "/subscriptions/testsub/resourceGroups/testRG/providers/Microsoft.Network/virtualNetworks/testvnet/subnets/default"
   ```

## <a id="migrate-from-firewall-to-vnet"></a>Migrating from IP firewall rule to VNET ACL 

The following steps are only needed for Azure Cosmos accounts with existing IP firewall rules allowing a subnet and you want to use VNET and subnet-based ACLs instead of IP firewall rule.

Once service endpoint for Azure Cosmos account is turned on for a subnet, the requests are sent with source containing VNET and subnet information instead of public IP. Therefore, such requests do not match an IP filter. This source switch happens for all Azure Cosmos accounts accessed from the subnet with service endpoint enabled. In order to prevent downtime, use the following steps:

1. Get properties of Azure Cosmos account by running the following cmdlet:

   ```powershell
   $apiVersion = "2015-04-08"
   $acctName = "<Cosmos account name>"

   $cosmosDBConfiguration = Get-AzureRmResource `
     -ResourceType "Microsoft.DocumentDB/databaseAccounts" `
     -ApiVersion $apiVersion `
     -ResourceGroupName $rgName `
     -Name $acctName
   ```

1. Initialize the variables to use them later. Set up all the variables from the existing account definition. Add the VNET ACL to all Azure Cosmos accounts being accessed from the subnet with `ignoreMissingVNetServiceEndpoint` flag. In this step, you also configure virtual network service endpoint by setting the "accountVNETFilterEnabled" variable to "True". This value is later assigned to the "isVirtualNetworkFilterEnabled" parameter.

   ```powershell
   $locations = @()

   foreach ($readLocation in $cosmosDBConfiguration.Properties.readLocations) {
      $locations += , @{
         locationName = $readLocation.locationName;
         failoverPriority = $readLocation.failoverPriority;
      }
   }

   $consistencyPolicy = $cosmosDBConfiguration.Properties.consistencyPolicy
   $accountVNETFilterEnabled = $True
   $subnetID = "Subnet ARM URL" e.g "/subscriptions/f7ddba26-ab7b-4a36-a2fa-7d01778da30b/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworks/testvnet/subnets/subnet1"

   $virtualNetworkRules = @(@{"id"=$subnetID, "ignoreMissingVNetServiceEndpoint"="True"})
   $databaseAccountOfferType = $cosmosDBConfiguration.Properties.databaseAccountOfferType
   ```

1. Update Azure Cosmos account properties with the new configuration by running the following cmdlets:

   ```powershell
   $cosmosDBProperties = @{
      databaseAccountOfferType = $databaseAccountOfferType;
      locations = $locations;
      consistencyPolicy = $consistencyPolicy;
      virtualNetworkRules = $virtualNetworkRules;
      isVirtualNetworkFilterEnabled = $accountVNETFilterEnabled;
   }

   Set-AzureRmResource `
    -ResourceType "Microsoft.DocumentDB/databaseAccounts" `
    -ApiVersion $apiVersion `
    -ResourceGroupName $rgName `
    -Name $acctName `
    -Properties $CosmosDBProperties
   ```

1. Repeat steps 1-3 for all Azure Cosmos accounts you access from the subnet.

1.	Wait for 15 mins and then update subnet to enable service endpoint.

1.	Enable the service endpoint for an existing subnet of a virtual network.

   ```powershell
   $rgname= "<Resource group name>"
   $vnName = "<virtual network name>"
   $sname = "<Subnet name>"
   $subnetPrefix = "<Subnet address range>"

   Get-AzureRmVirtualNetwork `
    -ResourceGroupName $rgname `
    -Name $vnName | Set-AzureRmVirtualNetworkSubnetConfig `
    -Name $sname `
    -AddressPrefix $subnetPrefix `
    -ServiceEndpoint "Microsoft.AzureCosmosDB" | Set-AzureRmVirtualNetwork
   ```

1. Remove IP firewall rule for the subnet.

## Next steps

* To configure a firewall for Azure Cosmos DB, see [firewall support](firewall-support.md) article.

