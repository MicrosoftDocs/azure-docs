---
title: Configure Azure Private Link for an Azure Cosmos account
description: Learn how to set up Azure Private Link to access an Azure Cosmos account using a private IP address in a virtual network. 
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: thweiss
---

# Configure Azure Private Link for an Azure Cosmos account (preview)

By using Azure Private Link, you can connect to an Azure Cosmos account via a private endpoint. The private endpoint is a set of private IP addresses in a subnet within your virtual network. By using Private Link, you can limit access to a given Azure Cosmos account over private IP addresses. When combined with restricted NSG policies, Private link helps reduce the risk of data exfiltration. To learn more about private endpoints, see [Azure Private Link](../private-link/private-link-overview.md) article.

Additionally, Private Link allows an Azure Cosmos account to be accessible from within the virtual network or any peered virtual network. Resources mapped to Private Link are also accessible from on premises over private peering through VPN or ExpressRoute. 

You can connect to an Azure Cosmos account configured with Private Link by using the "Automatic" or "Manual" approval methods. To learn more, see the [approval workflow](../private-link/private-endpoint-overview.md#access-to-a-private-link-resource-using-approval-workflow) section of the Private Link documentation. This article describes the steps to create a Private Link assuming that you are using Automatic approval method.

## Create a Private Link using the Azure portal

Use the following steps to create a Private Link for an existing Azure Cosmos account using Azure portal:

1. From the **All resources** pane, find the Azure Cosmos DB account that you want to secure.

1. Select **Private Endpoint Connection**  from the settings menu and select **Private endpoint** option:

   ![Create a private endpoint using Azure portal](./media/how-to-configure-private-endpoints/create-private-endpoint-portal.png)

1. In **Create a private endpoint (Preview) – Basics**, pane enter or select the following details:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select a resource group.|
    | **Instance details** |  |
    | Name | Enter any name for your private endpoint; if this name is taken, create a unique one. |
    |Region| Select the region where you want to deploy the Private Link. The private endpoint should be created in the same location where your virtual network exists.|
    |||
1. Select **Next: Resource**.
1. In **Create a private endpoint - Resource**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    |Connection method  | Select connect to an Azure resource in my directory. <br/><br/> This option allows you to choose one of your resources to set up a Private Link or connect to someone else's resource with a resource ID or alias that they've shared with you.|
    | Subscription| Select your subscription. |
    | Resource type | Select **Microsoft.AzureCosmosDB/databaseAccounts**. |
    | Resource |Select your Azure Cosmos account |
    |Target sub-resource |Select the Cosmos DB API type you want to map. This defaults to only one choice for the SQL, MongoDB and Cassandra APIs. For the Gremlin and Table APIs, you can also choose *Sql* as these APIs are interoperable with the SQL API. |
    |||
1. Select **Next: Configuration**.
1. In **Create a private endpoint (Preview) - Configuration**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    |**Networking**| |
    | Virtual network| Select your virtual network. |
    | Subnet | Select your subnet. |
    |**Private DNS Integration**||
    |Integrate with private DNS zone |Select **Yes**. |
    |Private DNS Zone |Select *privatelink.documents.azure.com* |
    |||

1. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration.
1. When you see the **Validation passed** message, select **Create**.

When you have approved Private Links for an Azure Cosmos account, in the Azure portal the **All networks** option in the **Firewall and virtual networks** pane is greyed out.

### Fetch the private IP addresses

After the private endpoint is provisioned, you can query the IP addresses. To view the IP addresses from Azure portal. Select **All resources**, search for the private endpoint you created earlier in this case it's "dbPrivateEndpoint3" and select the Overview tab to see the DNS settings and IP addresses:

![Private IP addresses in Azure portal](./media/how-to-configure-private-endpoints/private-ip-addresses-portal.png)

Multiple IP addresses are created per private endpoint:

* One for the global (region-agnostic) endpoint of the Azure Cosmos account.
* One for each region where the Azure Cosmos account is deployed.

## Create a Private Link using Azure PowerShell

Run the following PowerSehll script to create a Private Link named "MyPrivateEndpoint" for an existing Azure Cosmos account. Make sure to replace the variable values with the details specific to your environment.

```azurepowershell-interactive
Fill in these details, make sure to replace the variable values with the details specific to your environment.
$SubscriptionId = "<your Azure subscription ID>"
# Resource group where the Cosmos DB and VNet resources live
$ResourceGroupName = "myResourceGroup"
# Name of the Cosmos DB account
$CosmosDbAccountName = "mycosmosaccount"

# API type of the Cosmos DB account: Sql or MongoDB or Cassandra or Gremlin or Table
$CosmosDbApiType = "Sql"
# Name of the existing VNet
$VNetName = "myVnet"
# Name of the target subnet in the VNet
$SubnetName = "mySubnet"
# Name of the private endpoint to create
$PrivateEndpointName = "MyPrivateEndpoint"
# Location where the private endpoint can be created. The private endpoint should be created in the same location where your subnet or the virtual network exists
$Location = "westcentralus"

$cosmosDbResourceId = "/subscriptions/$($SubscriptionId)/resourceGroups/$($ResourceGroupName)/providers/Microsoft.DocumentDB/databaseAccounts/$($CosmosDbAccountName)"

$privateEndpointConnection = New-AzPrivateLinkServiceConnection -Name "myConnectionPS" -PrivateLinkServiceId $cosmosDbResourceId -GroupId $CosmosDbApiType
 
$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName  $ResourceGroupName -Name $VNetName  
 
$subnet = $virtualNetwork | Select -ExpandProperty subnets | Where-Object  {$_.Name -eq $SubnetName}  
 
$privateEndpoint = New-AzPrivateEndpoint -ResourceGroupName $ResourceGroupName -Name $PrivateEndpointName -Location "westcentralus" -Subnet  $subnet -PrivateLinkServiceConnection $privateEndpointConnection
```

### Fetch the private IP addresses

After the private endpoint is provisioned, you can query the IP addresses and the FQDNS mapping by using the following PowerShell script:

```azurepowershell-interactive

$pe = Get-AzPrivateEndpoint -Name MyPrivateEndpoint -ResourceGroupName myResourceGroup
$networkInterface = Get-AzNetworkInterface -ResourceId $pe.NetworkInterfaces[0].Id
foreach ($IPConfiguration in $networkInterface.IpConfigurations)
{
    Write-Host $IPConfiguration.PrivateIpAddress ":" $IPConfiguration.PrivateLinkConnectionProperties.Fqdns
}
```

## Create a Private Link using a Resource Manager template

You can set up Private Link by creating a private endpoint in a virtual network subnet. This is achieved by using an Azure Resource Manager template. Create a Resource Manager template named "PrivateEndpoint_template.json" with the following code. This template creates a private endpoint for an existing Azure Cosmos SQL API account in an existing virtual network:

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
          "type": "string",
          "defaultValue": "[resourceGroup().location]",
          "metadata": {
            "description": "Location for all resources."
          }
        },
        "privateEndpointName": {
            "type": "string"
        },
        "resourceId": {
            "type": "string"
        },
        "groupId": {
            "type": "string"
        },
        "subnetId": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[parameters('privateEndpointName')]",
            "type": "Microsoft.Network/privateEndpoints",
            "apiVersion": "2019-04-01",
            "location": "[parameters('location')]",
            "properties": {
                "subnet": {
                    "id": "[parameters('subnetId')]"
                },
                "privateLinkServiceConnections": [
                    {
                        "name": "MyConnection",
                        "properties": {
                            "privateLinkServiceId": "[parameters('resourceId')]",
                            "groupIds": [ "[parameters('groupId')]" ],
                            "requestMessage": ""
                        }
                    }
                ]
            }
        }
    ],
    "outputs": {
        "privateEndpointNetworkInterface": {
          "type": "string",
          "value": "[reference(concat('Microsoft.Network/privateEndpoints/', parameters('privateEndpointName'))).networkInterfaces[0].id]"
        }
    }
}
```

### Define the template parameters file

Create a parameters file for the template, and name it "PrivateEndpoint_parameters.json". Add the following code to the parameters file:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "privateEndpointName": {
            "value": ""
        },
        "resourceId": {
            "value": ""
        },
        "groupId": {
            "value": ""
        },
        "subnetId": {
            "value": ""
        }
    }
}
```

### Deploy the template by using a PowerShell script

Next create a PowerShell script with the following code. Before you run the script, make sure to replace the subscription ID, resource group name, and other variable values with the details specific to your environment:

```azurepowershell-interactive
### This script creates a private endpoint for an existing Cosmos DB account in an existing VNet

## Step 1: Fill in these details, make sure to replace the variable values with the details specific to your environment.
$SubscriptionId = "<your Azure subscription ID>"
# Resource group where the Cosmos DB and VNet resources live
$ResourceGroupName = "myResourceGroup"
# Name of the Cosmos DB account
$CosmosDbAccountName = "mycosmosaccount"
# API type of the Cosmos DB account. It can be one of the following: "Sql", "MongoDB", "Cassandra", "Gremlin", "Table"
$CosmosDbApiType = "Sql"
# Name of the existing VNet
$VNetName = "myVnet"
# Name of the target subnet in the VNet
$SubnetName = "mySubnet"
# Name of the private endpoint to create
$PrivateEndpointName = "myPrivateEndpoint"

$cosmosDbResourceId = "/subscriptions/$($SubscriptionId)/resourceGroups/$($ResourceGroupName)/providers/Microsoft.DocumentDB/databaseAccounts/$($CosmosDbAccountName)"
$VNetResourceId = "/subscriptions/$($SubscriptionId)/resourceGroups/$($ResourceGroupName)/providers/Microsoft.Network/virtualNetworks/$($VNetName)"
$SubnetResourceId = "$($VNetResourceId)/subnets/$($SubnetName)"
$PrivateEndpointTemplateFilePath = "PrivateEndpoint_template.json"
$PrivateEndpointParametersFilePath = "PrivateEndpoint_parameters.json"

## Step 2: Sign in to your Azure account and select the target subscription.
Login-AzAccount
Select-AzSubscription -SubscriptionId $subscriptionId

## Step 3: Make sure private endpoint network policies are disabled in the subnet.
$VirtualNetwork= Get-AzVirtualNetwork -Name "$VNetName" -ResourceGroupName "$ResourceGroupName"
($virtualNetwork | Select -ExpandProperty subnets | Where-Object  {$_.Name -eq "$SubnetName"} ).PrivateEndpointNetworkPolicies = "Disabled"
$virtualNetwork | Set-AzVirtualNetwork

## Step 4: Create the private endpoint.
Write-Output "Deploying private endpoint on $($resourceGroupName)"
$deploymentOutput = New-AzResourceGroupDeployment -Name "PrivateCosmosDbEndpointDeployment" `
	-ResourceGroupName $resourceGroupName `
	-TemplateFile $PrivateEndpointTemplateFilePath `
	-TemplateParameterFile $PrivateEndpointParametersFilePath `
	-SubnetId $SubnetResourceId `
	-ResourceId $CosmosDbResourceId `
	-GroupId $CosmosDbApiType `
	-PrivateEndpointName $PrivateEndpointName

$deploymentOutput
```

In the PowerShell script, the "GroupId" variable can only contain one value, which is the API type of the account. Allowed values are: SQL, MongoDB, Cassandra, Gremlin, and Table. Some Azure Cosmos account types are accessible through multiple APIs. For example:

* A Gremlin API account can be accessed from both Gremlin and SQL API accounts.
* A Table API account can be accessed from both Table and SQL API accounts.

For such accounts, you must create one private endpoint for each API type, with the corresponding API type specified in the "GroupId" array.

After the template is deployed successfully, you can see an output similar to what is shown in the following image. The provisioningState value is "Succeeded" if the private endpoints are set up correctly.

![Resource Manager template deployment output](./media/how-to-configure-private-endpoints/resource-manager-template-deployment-output.png)

After the template is deployed, the private IP addresses are reserved within the subnet. The firewall rule of the Azure Cosmos account is configured to accept connections from the private endpoint only.

## Configure private DNS

During the preview of Private Link, you should use a private DNS within the subnet where the private endpoint has been created. And configure the endpoints so that each of the private IP address is mapped to a DNS entry (see the "fqdns" property in the response shown above).

## Firewall configuration with Private Link

The following are different situations and outcomes when you use Private Link in combination with firewall rules:

* If there are no firewall rules configured, then by default, an Azure Cosmos account is accessible to all traffic.

* If public traffic or service endpoint is configured and private endpoints are created, then different types of incoming traffic are authorized by the corresponding type of firewall rule.

* If no public traffic or service endpoint is configured and private endpoints are created, then the Azure Cosmos account is only accessible through the private endpoints.

## Update private endpoint when you add or remove a region

Adding or removing regions to an Azure Cosmos account requires you to add or remove DNS entries for that account. These changes should be updated accordingly in the private endpoint. Currently you should manually make this change by using the following steps:

1. The Azure Cosmos DB administrator adds or removes regions. Then the network administrators are notified about the pending changes. The private endpoint mapped to an Azure Cosmos account sees its "ActionsRequired" properties changed from "None" to "Recreate". Then the network administrator updates the private endpoint by issuing a PUT request with the same Resource Manager payload used to create it.

1. After this operation, the subnet's private DNS also has to be updated to reflect the added or removed DNS entries and their corresponding private IP addresses.

For example, if you deploy an Azure Cosmos account in 3 regions: "West US", "Central US", and "West Europe". When you create a private endpoint for your account, 4 private IPs are reserved in the subnet. One for each region, which counts to a total of 3, and one for the global/region-agnostic endpoint.

Later if you add a new region, for example "East US" to the Azure Cosmos account. By default, the new region is not accessible from the existing private endpoint. The Azure Cosmos account administrator should refresh the private endpoint connection before accessing it form the new region.

When you run the ` Get-AzPrivateEndpoint -Name <your private endpoint name> -ResourceGroupName <your resource group name>` command, the output of the command contains the `ActionRequired` parameter, which is set to "Recreate". This value indicates that the private endpoint should be refreshed. Next the Azure Cosmos account administrator runs the `Set-AzPrivateEndpoint` command to trigger the private endpoint refresh.

```powershell
$pe = Get-AzPrivateEndpoint -Name <your private endpoint name> -ResourceGroupName <your resource group name>

Set-AzPrivateEndpoint -PrivateEndpoint $pe
```

A new private IP is automatically reserved in the subnet under this private endpoint, and the value `ActionRequired` becomes `None`. If you don’t have any private DNZ zone integration (in other words, if you are using a custom private DNS), you have to configure your private DNS to add a new DNS record for the private IP corresponding to the new region.

You can use the same steps when you remove a region. The private IP of the removed region is automatically reclaimed, and the `ActionRequired` flag becomes `None`. If you don’t have any private DNZ zone integration, you must configure your private DNS to remove the DNS record for the removed region.

## Current limitations

The following limitations apply when using the Private Link with an Azure Cosmos account:

* When using Private Links with Azure Cosmos account using Direct mode connection, you can only use TCP protocol. HTTP protocol is not yet supported

* When using Azure Cosmos DB’s API for MongoDB accounts, private endpoint is supported for accounts on server version 3.6 only (that is accounts using the endpoint in the format `*.mongo.cosmos.azure.com`). Private Link is not supported for accounts on server version 3.2 (that is accounts using the endpoint in the format `*.documents.azure.com`). To use Private Link, you should migrate old accounts to new version.

* When using Azure Cosmos DB’s API for MongoDB accounts that have Private Link, you can’t use tools such as Robo 3T, Studio 3T, Mongoose etc. The endpoint can have Private Link support only if the appName=<account name> parameter is specified. For example: replicaSet=globaldb&appName=mydbaccountname. Because these tools don’t pass the app name in the connection string to the service so you can’t use Private Link. However you can still access these accounts with SDK drivers with 3.6 version.

* Private Link support for Azure Cosmos accounts and VNETs is available in specific regions only. For a list of supported regions, see the [Available regions](../private-link/private-link-overview.md#availability) section of the Private Link article.

* A virtual network can't be moved or deleted if it contains Private Link.

* An Azure Cosmos account can't be deleted if it is attached to a private endpoint.

* An Azure Cosmos account can't be failed over to a region that's not mapped to all private endpoints attached to it. For more information, see Adding or removing regions in the previous section.

* A network administrator should be granted at least the "*/PrivateEndpointConnectionsApproval" permission at the Azure Cosmos account scope by an administrator to create automatically-approved private endpoints.

## Next steps

To learn more about the other Azure Cosmos DB security features, see the following article:

* To configure a firewall for Azure Cosmos DB, see [Firewall support](firewall-support.md).

* [How to configure virtual network service endpoint for your Azure Cosmos account.](how-to-configure-vnet-service-endpoint.md)

* To learn more about Private Link, see the [Azure Private Link](../private-link/private-link-overview.md) documentation.
