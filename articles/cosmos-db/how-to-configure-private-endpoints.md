---
title: Configure Azure Private Link for Azure Cosmos DB
description: Learn how to set up Azure Private Link to access an Azure Cosmos DB account by using a private IP address in a virtual network. 
author: seesharprun
ms.service: cosmos-db
ms.topic: how-to
ms.date: 04/24/2023
ms.author: sidandrews 
ms.custom: devx-track-azurecli, devx-track-azurepowershell, ignite-2022
---

# Configure Azure Private Link for an Azure Cosmos DB account

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

By using Azure Private Link, you can connect to an Azure Cosmos DB account through a private endpoint. The private endpoint is a set of private IP addresses in a subnet within your virtual network. You can then limit access to an Azure Cosmos DB account over private IP addresses. When Private Link is combined with restrictive NSG policies, it helps reduce the risk of data exfiltration. To learn more about private endpoints, see [What is Azure Private Link?](../private-link/private-link-overview.md)

> [!NOTE]
> Private Link doesn't prevent your Azure Cosmos DB endpoints from being resolved by public DNS. Filtering of incoming requests happens at application level, not transport or network level.

Private Link allows users to access an Azure Cosmos DB account from within the virtual network or from any peered virtual network. Resources mapped to Private Link are also accessible on-premises over private peering through VPN or Azure ExpressRoute.

You can connect to an Azure Cosmos DB account configured with Private Link by using the automatic or manual approval method. To learn more, see the [approval workflow](../private-link/private-endpoint-overview.md#access-to-a-private-link-resource-using-approval-workflow) section of the Private Link documentation.

This article describes how to set up private endpoints for Azure Cosmos DB transactional store. It assumes that you're using the automatic approval method. If you're using the analytical store, see [Configure private endpoints for the analytical store](analytical-store-private-endpoints.md).

## Create a private endpoint by using the Azure portal

Follow these steps to create a private endpoint for an existing Azure Cosmos DB account by using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com), then select an Azure Cosmos DB account.

1. Select **Networking** from the list of settings, and then select **+ Private endpoint** under the **Private access** tab:

   :::image type="content" source="./media/how-to-configure-private-endpoints/create-private-endpoint-portal.png" alt-text="Screenshot of selections to create a private endpoint in the Azure portal":::

1. In the **Create a private endpoint - Basics** pane, enter or select the following details:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select a resource group.|
    | **Instance details** |  |
    | Name | Enter any name for your private endpoint. If this name is taken, create a unique one. |
    |Region| Select the region where you want to deploy Private Link. Create the private endpoint in the same location where your virtual network exists.|

1. Select **Next: Resource**.

1. In the **Create a private endpoint - Resource** pane, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    |Connection method  | Select **Connect to an Azure resource in my directory**. <br><br> You can then choose one of your resources to set up Private Link. Or you can connect to someone else's resource by using a resource ID or alias that they've shared with you.|
    | Subscription| Select your subscription. |
    | Resource type | Select **Microsoft.AzureCosmosDB/databaseAccounts**. |
    | Resource |Select your Azure Cosmos DB account. |
    |Target subresource |Select the Azure Cosmos DB API type that you want to map. This defaults to only one choice for the APIs for SQL, MongoDB, and Cassandra. For the APIs for Gremlin and Table, you can also choose **NoSQL** because these APIs are interoperable with the API for NoSQL. If you have a [dedicated gateway](./dedicated-gateway.md) provisioned for an API for NoSQL account, you also see an option for **SqlDedicated**. |

1. Select **Next: Virtual Network**.

1. In the **Create a private endpoint - Virtual Network** pane, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network| Select your virtual network. |
    | Subnet | Select your subnet. |

1. Select **Next: DNS**.

1. In the **Create a private endpoint - DNS** pane, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    |Integrate with private DNS zone |Select **Yes**. <br><br> To connect privately with your private endpoint, you need a DNS record. We recommend that you integrate your private endpoint with a private DNS zone. You can also use your own DNS servers or create DNS records by using the host files on your virtual machines. <br><br> When you select yes for this option, a private DNS zone group is also created. DNS zone group is a link between the private DNS zone and the private endpoint. This link helps you to auto update the private DNS zone when there's an update to the private endpoint. For example, when you add or remove regions, the private DNS zone is automatically updated. |
    |Configuration name |Select your subscription and resource group. <br><br> The private DNS zone is determined automatically. You can't change it by using the Azure portal.|

1. Select **Next: Tags** > **Review + create**. On the **Review + create** page, Azure validates your configuration.

1. When you see the **Validation passed** message, select **Create**.

When you have an approved Private Link for an Azure Cosmos DB account, in the Azure portal, the **All networks** option in the **Firewall and virtual networks** pane is unavailable.

## <a id="private-zone-name-mapping"></a>API types and private zone names

Please review [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md) for a more detailed explanation about private zones and DNS configurations for private endpoint. The following table shows the mapping between different Azure Cosmos DB account API types, supported subresources, and the corresponding private zone names. You can also access the Gremlin and API for Table accounts through the API for NoSQL, so there are two entries for these APIs. There's also an extra entry for the API for NoSQL for accounts using the [dedicated gateway](./dedicated-gateway.md).

|Azure Cosmos DB account API type  |Supported subresources or group IDs |Private zone name  |
|---------|---------|---------|
|NoSQL    |   Sql      | privatelink.documents.azure.com   |
|NoSQL    |   SqlDedicated      | privatelink.sqlx.cosmos.azure.com   |
|Cassandra    | Cassandra        |  privatelink.cassandra.cosmos.azure.com    |
|Mongo   |  MongoDB       |  privatelink.mongo.cosmos.azure.com    |
|Gremlin     | Gremlin        |  privatelink.gremlin.cosmos.azure.com   |
|Gremlin     |  Sql       |  privatelink.documents.azure.com    |
|Table    |    Table     |   privatelink.table.cosmos.azure.com    |
|Table     |   Sql      |  privatelink.documents.azure.com    |

### Fetch the private IP addresses

After the private endpoint is provisioned, you can query the IP addresses. To view the IP addresses from the Azure portal:

1. Search for the private endpoint that you created earlier. In this case, it's **cdbPrivateEndpoint3**.
1. Select the **Overview** tab to see the DNS settings and IP addresses.

:::image type="content" source="./media/how-to-configure-private-endpoints/private-ip-addresses-portal.png" alt-text="Screenshot of private IP addresses in the Azure portal":::

Multiple IP addresses are created per private endpoint:

* One for the global region-agnostic endpoint of the Azure Cosmos DB account.
* One for each region where the Azure Cosmos DB account is deployed.

## Create a private endpoint by using Azure PowerShell

Run the following PowerShell script to create a private endpoint named *MyPrivateEndpoint* for an existing Azure Cosmos DB account. Replace the variable values with the details for your environment.

```azurepowershell-interactive
$SubscriptionId = "<your Azure subscription ID>"
# Resource group where the Azure Cosmos DB account and virtual network resources are located
$ResourceGroupName = "myResourceGroup"
# Name of the Azure Cosmos DB account
$CosmosDbAccountName = "mycosmosaccount"

# Resource for the Azure Cosmos DB account: Sql, SqlDedicated, MongoDB, Cassandra, Gremlin, or Table
$CosmosDbSubResourceType = "Sql"
# Name of the existing virtual network
$VNetName = "myVnet"
# Name of the target subnet in the virtual network
$SubnetName = "mySubnet"
# Name of the private endpoint to create
$PrivateEndpointName = "MyPrivateEndpoint"
# Location where the private endpoint can be created. The private endpoint should be created in the same location where your subnet or the virtual network exists
$Location = "westcentralus"

$cosmosDbResourceId = "/subscriptions/$($SubscriptionId)/resourceGroups/$($ResourceGroupName)/providers/Microsoft.DocumentDB/databaseAccounts/$($CosmosDbAccountName)"

$privateEndpointConnection = New-AzPrivateLinkServiceConnection -Name "myConnectionPS" -PrivateLinkServiceId $cosmosDbResourceId -GroupId $CosmosDbSubResourceType
 
$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName  $ResourceGroupName -Name $VNetName  
 
$subnet = $virtualNetwork | Select -ExpandProperty subnets | Where-Object  {$_.Name -eq $SubnetName}  
 
$privateEndpoint = New-AzPrivateEndpoint -ResourceGroupName $ResourceGroupName -Name $PrivateEndpointName -Location $Location -Subnet  $subnet -PrivateLinkServiceConnection $privateEndpointConnection
```

### Integrate the private endpoint with a private DNS zone

After you create the private endpoint, you can integrate it with a private DNS zone by using the following PowerShell script:

```azurepowershell-interactive
Import-Module Az.PrivateDns

# Zone name differs based on the API type and group ID you are using. 
$zoneName = "privatelink.documents.azure.com"
$zone = New-AzPrivateDnsZone -ResourceGroupName $ResourceGroupName `
  -Name $zoneName

$link  = New-AzPrivateDnsVirtualNetworkLink -ResourceGroupName $ResourceGroupName `
  -ZoneName $zoneName `
  -Name "myzonelink" `
  -VirtualNetworkId $virtualNetwork.Id  
 
$pe = Get-AzPrivateEndpoint -Name $PrivateEndpointName `
  -ResourceGroupName $ResourceGroupName

$networkInterface = Get-AzResource -ResourceId $pe.NetworkInterfaces[0].Id `
  -ApiVersion "2019-04-01"

# Create DNS configuration

$PrivateDnsZoneId = $zone.ResourceId

$config = New-AzPrivateDnsZoneConfig -Name $zoneName `
 -PrivateDnsZoneId $PrivateDnsZoneId

## Create a DNS zone group
New-AzPrivateDnsZoneGroup -ResourceGroupName $ResourceGroupName `
 -PrivateEndpointName $PrivateEndpointName `
 -Name "MyPrivateZoneGroup" `
 -PrivateDnsZoneConfig $config
```

### Fetch the private IP addresses

After the private endpoint is provisioned, you can query the IP addresses and the FQDN mapping by using the following PowerShell script:

```azurepowershell-interactive
$pe = Get-AzPrivateEndpoint -Name MyPrivateEndpoint -ResourceGroupName myResourceGroup
$networkInterface = Get-AzNetworkInterface -ResourceId $pe.NetworkInterfaces[0].Id
foreach ($IPConfiguration in $networkInterface.IpConfigurations)
{
    Write-Host $IPConfiguration.PrivateIpAddress ":" $IPConfiguration.PrivateLinkConnectionProperties.Fqdns
}
```

## Create a private endpoint by using Azure CLI

Run the following Azure CLI script to create a private endpoint named *myPrivateEndpoint* for an existing Azure Cosmos DB account. Replace the variable values with the details for your environment.

```azurecli-interactive
# Resource group where the Azure Cosmos DB account and virtual network resources are located
ResourceGroupName="myResourceGroup"

# Subscription ID where the Azure Cosmos DB account and virtual network resources are located
SubscriptionId="<your Azure subscription ID>"

# Name of the existing Azure Cosmos DB account
CosmosDbAccountName="mycosmosaccount"

# API type of your Azure Cosmos DB account: Sql, SqlDedicated, MongoDB, Cassandra, Gremlin, or Table
CosmosDbSubResourceType="Sql"

# Name of the virtual network to create
VNetName="myVnet"

# Name of the subnet to create
SubnetName="mySubnet"

# Name of the private endpoint to create
PrivateEndpointName="myPrivateEndpoint"

# Name of the private endpoint connection to create
PrivateConnectionName="myConnection"

az network vnet create \
 --name $VNetName \
 --resource-group $ResourceGroupName \
 --subnet-name $SubnetName

az network vnet subnet update \
 --name $SubnetName \
 --resource-group $ResourceGroupName \
 --vnet-name $VNetName \
 --disable-private-endpoint-network-policies true

az network private-endpoint create \
    --name $PrivateEndpointName \
    --resource-group $ResourceGroupName \
    --vnet-name $VNetName  \
    --subnet $SubnetName \
    --private-connection-resource-id "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.DocumentDB/databaseAccounts/$CosmosDbAccountName" \
    --group-ids $CosmosDbSubResourceType \
    --connection-name $PrivateConnectionName
```

### Integrate the private endpoint with a private DNS zone

After you create the private endpoint, you can integrate it with a private DNS zone by using the following Azure CLI script:

```azurecli-interactive
#Zone name differs based on the API type and group ID you are using. 
zoneName="privatelink.documents.azure.com"

az network private-dns zone create --resource-group $ResourceGroupName \
   --name  $zoneName

az network private-dns link vnet create --resource-group $ResourceGroupName \
   --zone-name  $zoneName\
   --name myzonelink \
   --virtual-network $VNetName \
   --registration-enabled false 

#Create a DNS zone group
az network private-endpoint dns-zone-group create \
   --resource-group $ResourceGroupName \
   --endpoint-name $PrivateEndpointName \
   --name "MyPrivateZoneGroup" \
   --private-dns-zone $zoneName \
   --zone-name "myzone"
```

## Create a private endpoint by using a Resource Manager template

You can set up Private Link by creating a private endpoint in a virtual network subnet. You achieve this by using an Azure Resource Manager template.

Use the following code to create a Resource Manager template named *PrivateEndpoint_template.json*. This template creates a private endpoint for an existing Azure Cosmos DB vAPI for NoSQL account in an existing virtual network.

### [Bicep](#tab/arm-bicep)

```bicep
@description('Location for all resources.')
param location string = resourceGroup().location
param privateEndpointName string
param resourceId string
param groupId string
param subnetId string

resource privateEndpoint 'Microsoft.Network/privateEndpoints@2019-04-01' = {
  name: privateEndpointName
  location: location
  properties: {
    subnet: {
      id: subnetId
    }
    privateLinkServiceConnections: [
      {
        name: 'MyConnection'
        properties: {
          privateLinkServiceId: resourceId
          groupIds: [
            groupId
          ]
          requestMessage: ''
        }
      }
    ]
  }
}

output privateEndpointNetworkInterface string = privateEndpoint.properties.networkInterfaces[0].id
```

### [JSON](#tab/arm-json)

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
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

---

**Define the parameters file for the template**

Create a parameters file for the template, and name it *PrivateEndpoint_parameters.json*. Add the following code to the parameters file:

### [Bicep / JSON](#tab/arm-bicep+arm-json)

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
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

---

**Deploy the template by using a PowerShell script**

Create a PowerShell script by using the following code. Before you run the script, replace the subscription ID, resource group name, and other variable values with the details for your environment.

```azurepowershell-interactive
### This script creates a private endpoint for an existing Azure Cosmos DB account in an existing virtual network

## Step 1: Fill in these details. Replace the variable values with the details for your environment.
$SubscriptionId = "<your Azure subscription ID>"
# Resource group where the Azure Cosmos DB account and virtual network resources are located
$ResourceGroupName = "myResourceGroup"
# Name of the Azure Cosmos DB account
$CosmosDbAccountName = "mycosmosaccount"
# API type of the Azure Cosmos DB account. It can be one of the following: "Sql", "SqlDedicated", "MongoDB", "Cassandra", "Gremlin", "Table"
$CosmosDbSubResourceType = "Sql"
# Name of the existing virtual network
$VNetName = "myVnet"
# Name of the target subnet in the virtual network
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
    -GroupId $CosmosDbSubResourceType `
    -PrivateEndpointName $PrivateEndpointName

$deploymentOutput
```

In the PowerShell script, the `GroupId` variable can contain only one value. That value is the API type of the account. Allowed values are: `Sql`, `SqlDedicated`, `MongoDB`, `Cassandra`, `Gremlin`, and `Table`. Some Azure Cosmos DB account types are accessible through multiple APIs. For example:

* The API for NoSQL accounts has an added option for accounts configured to use the [dedicated gateway](./dedicated-gateway.md).
* The API for Gremlin accounts can be accessed from both Gremlin and API for NoSQL accounts.
* The API for Table accounts can be accessed from both Table and API for NoSQL accounts.

For those accounts, you must create one private endpoint for each API type. If you're creating a private endpoint for `SqlDedicated`, you only need to add a second endpoint for `Sql` if you want to also connect to your account using the standard gateway. The corresponding API type is specified in the `GroupId` array.

After the template is deployed successfully, you can see an output similar to what the following image shows. The `provisioningState` value is `Succeeded` if the private endpoints are set up correctly.

:::image type="content" source="./media/how-to-configure-private-endpoints/resource-manager-template-deployment-output.png" alt-text="Screenshot of deployment output for the Resource Manager template.":::

After the template is deployed, the private IP addresses are reserved within the subnet. The firewall rule of the Azure Cosmos DB account is configured to accept connections from the private endpoint only.

### Integrate the private endpoint with a private DNS zone

Use the following code to create a Resource Manager template named *PrivateZone_template.json*. This template creates a private DNS zone for an existing Azure Cosmos DB API for NoSQL account in an existing virtual network.

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "privateZoneName": {
            "type": "string"
        },
        "VNetId": {
            "type": "string"
        }        
    },
    "resources": [
        {
            "name": "[parameters('privateZoneName')]",
            "type": "Microsoft.Network/privateDnsZones",
            "apiVersion": "2018-09-01",
            "location": "global",
            "properties": {                
            }
        },
        {
            "type": "Microsoft.Network/privateDnsZones/virtualNetworkLinks",
            "apiVersion": "2018-09-01",
            "name": "[concat(parameters('privateZoneName'), '/myvnetlink')]",
            "location": "global",
            "dependsOn": [
                "[resourceId('Microsoft.Network/privateDnsZones', parameters('privateZoneName'))]"
            ],
            "properties": {
                "registrationEnabled": false,
                "virtualNetwork": {
                    "id": "[parameters('VNetId')]"
                }
            }
        }        
    ]
}
```

**Define the parameters file for the template**

Create the following two parameters file for the template. Create the *PrivateZone_parameters.json* with the following code:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "privateZoneName": {
            "value": ""
        },
        "VNetId": {
            "value": ""
        }
    }
}
```

Use the following code to create a Resource Manager template named *PrivateZoneGroup_template.json*. This template creates a private DNS zone group for an existing Azure Cosmos DB API for NoSQL account in an existing virtual network.

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "privateZoneName": {
            "type": "string"
        },
        "PrivateEndpointDnsGroupName": {
            "value": "string"
        },
        "privateEndpointName":{
            "value": "string"
        }        
    },
    "resources": [
        {
            "type": "Microsoft.Network/privateEndpoints/privateDnsZoneGroups",
            "apiVersion": "2020-06-01",
            "name": "[parameters('PrivateEndpointDnsGroupName')]",
            "location": "global",
            "dependsOn": [
                "[resourceId('Microsoft.Network/privateDnsZones', parameters('privateZoneName'))]",
                "[variables('privateEndpointName')]"
            ],
          "properties": {
            "privateDnsZoneConfigs": [
              {
                "name": "config1",
                "properties": {
                  "privateDnsZoneId": "[resourceId('Microsoft.Network/privateDnsZones', parameters('privateZoneName'))]"
                }
              }
            ]
          }
        }
    ]
}
```

**Define the parameters file for the template**

Create the following two parameters file for the template. Create the *PrivateZoneGroup_parameters.json*. with the following code:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "privateZoneName": {
            "value": ""
        },
        "PrivateEndpointDnsGroupName": {
            "value": ""
        },
        "privateEndpointName":{
            "value": ""
        }
    }
}
```

**Deploy the template by using a PowerShell script**

Create a PowerShell script by using the following code. Before you run the script, replace the subscription ID, resource group name, and other variable values with the details for your environment.

```azurepowershell-interactive
### This script:
### - creates a private zone
### - creates a private endpoint for an existing Azure Cosmos DB account in an existing VNet
### - maps the private endpoint to the private zone

## Step 1: Fill in these details. Replace the variable values with the details for your environment.
$SubscriptionId = "<your Azure subscription ID>"
# Resource group where the Azure Cosmos DB account and virtual network resources are located
$ResourceGroupName = "myResourceGroup"
# Name of the Azure Cosmos DB account
$CosmosDbAccountName = "mycosmosaccount"
# API type of the Azure Cosmos DB account. It can be one of the following: "Sql", "SqlDedicated", "MongoDB", "Cassandra", "Gremlin", "Table"
$CosmosDbSubResourceType = "Sql"
# Name of the existing virtual network
$VNetName = "myVnet"
# Name of the target subnet in the virtual network
$SubnetName = "mySubnet"
# Name of the private zone to create
$PrivateZoneName = "myPrivateZone.documents.azure.com"
# Name of the private endpoint to create
$PrivateEndpointName = "myPrivateEndpoint"

# Name of the DNS zone group to create
$PrivateEndpointDnsGroupName = "myPrivateDNSZoneGroup"

$cosmosDbResourceId = "/subscriptions/$($SubscriptionId)/resourceGroups/$($ResourceGroupName)/providers/Microsoft.DocumentDB/databaseAccounts/$($CosmosDbAccountName)"
$VNetResourceId = "/subscriptions/$($SubscriptionId)/resourceGroups/$($ResourceGroupName)/providers/Microsoft.Network/virtualNetworks/$($VNetName)"
$SubnetResourceId = "$($VNetResourceId)/subnets/$($SubnetName)"
$PrivateZoneTemplateFilePath = "PrivateZone_template.json"
$PrivateZoneParametersFilePath = "PrivateZone_parameters.json"
$PrivateEndpointTemplateFilePath = "PrivateEndpoint_template.json"
$PrivateEndpointParametersFilePath = "PrivateEndpoint_parameters.json"
$PrivateZoneGroupTemplateFilePath = "PrivateZoneGroup_template.json"
$PrivateZoneGroupParametersFilePath = "PrivateZoneGroup_parameters.json"

## Step 2: Login your Azure account and select the target subscription
Login-AzAccount 
Select-AzSubscription -SubscriptionId $subscriptionId

## Step 3: Make sure private endpoint network policies are disabled in the subnet
$VirtualNetwork= Get-AzVirtualNetwork -Name "$VNetName" -ResourceGroupName "$ResourceGroupName"
($virtualNetwork | Select -ExpandProperty subnets | Where-Object  {$_.Name -eq "$SubnetName"} ).PrivateEndpointNetworkPolicies = "Disabled"
$virtualNetwork | Set-AzVirtualNetwork

## Step 4: Create the private zone
New-AzResourceGroupDeployment -Name "PrivateZoneDeployment" `
    -ResourceGroupName $ResourceGroupName `
    -TemplateFile $PrivateZoneTemplateFilePath `
    -TemplateParameterFile $PrivateZoneParametersFilePath `
    -PrivateZoneName $PrivateZoneName `
    -VNetId $VNetResourceId

## Step 5: Create the private endpoint
Write-Output "Deploying private endpoint on $($resourceGroupName)"
$deploymentOutput = New-AzResourceGroupDeployment -Name "PrivateCosmosDbEndpointDeployment" `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile $PrivateEndpointTemplateFilePath `
    -TemplateParameterFile $PrivateEndpointParametersFilePath `
    -SubnetId $SubnetResourceId `
    -ResourceId $CosmosDbResourceId `
    -GroupId $CosmosDbSubResourceType `
    -PrivateEndpointName $PrivateEndpointName
$deploymentOutput

## Step 6: Create the private zone
New-AzResourceGroupDeployment -Name "PrivateZoneGroupDeployment" `
    -ResourceGroupName $ResourceGroupName `
    -TemplateFile $PrivateZoneGroupTemplateFilePath `
    -TemplateParameterFile $PrivateZoneGroupParametersFilePath `
    -PrivateZoneName $PrivateZoneName `
    -PrivateEndpointName $PrivateEndpointName`
    -PrivateEndpointDnsGroupName $PrivateEndpointDnsGroupName

```

## Configure custom DNS

You should use a private DNS zone within the subnet where you've created the private endpoint. Configure the endpoints so that each private IP address is mapped to a DNS entry. See the *fqdns* property in the response shown earlier.

When you're creating the private endpoint, you can integrate it with a private DNS zone in Azure. If you choose to instead use a custom DNS zone, you have to configure it to add DNS records for all private IP addresses reserved for the private endpoint.

> [!IMPORTANT]
> It's the DNS resolution of your requests that determines whether these requests go over your private endpoints, or take the standard public route. Make sure that your local DNS correctly references the private IP addressed mapped by your private endpoint.

## Private Link combined with firewall rules

The following situations and outcomes are possible when you use Private Link in combination with firewall rules:

* If you don't configure any firewall rules, then by default, all traffic can access an Azure Cosmos DB account.

* If you configure public traffic or a service endpoint and you create private endpoints, then different types of incoming traffic are authorized by the corresponding type of firewall rule. If a private endpoint is configured in a subnet where service endpoint is also configured:
  * traffic to the database account mapped by the private endpoint is routed via private endpoint,
  * traffic to other database accounts from the subnet is routed via service endpoint.

* If you don't configure any public traffic or service endpoint and you create private endpoints, then the Azure Cosmos DB account is accessible only through the private endpoints. If you don't configure public traffic or a service endpoint, after all approved private endpoints are rejected or deleted, the account is open to the entire network unless `PublicNetworkAccess` is set to *Disabled*.

## Blocking public network access during account creation

As described in the previous section, and unless specific firewall rules have been set, adding a private endpoint makes your Azure Cosmos DB account accessible through private endpoints only. This means that the Azure Cosmos DB account could be reached from public traffic after it's created and before a private endpoint gets added. To make sure that public network access is disabled even before the creation of private endpoints, you can set the `publicNetworkAccess` flag to *Disabled* during account creation. Note that this flag takes precedence over any IP or virtual network rule. All public and virtual network traffic is blocked when the flag is set to *Disabled*, even if the source IP or virtual network is allowed in the firewall configuration.

For an example showing how to use this flag, see [this Azure Resource Manager template](https://azure.microsoft.com/resources/templates/cosmosdb-private-endpoint).

## Adding private endpoints to an existing Azure Cosmos DB account with no downtime

By default, adding a private endpoint to an existing account results in a short downtime of approximately five minutes. Follow these instructions to avoid this downtime:

1. Add IP or virtual network rules to your firewall configuration to explicitly allow your client connections.
1. Wait for 10 minutes to ensure that the configuration update is applied.
1. Configure your new private endpoint.
1. Remove the firewall rules set in step 1.

> [!NOTE]
> If you have running applications using the Azure Cosmos DB SDKs, there might be transient timeouts during the configuration update. Make sure your application is designed to be [resilient to transient connectivity failures](./nosql/conceptual-resilient-sdk-applications.md) and have retry logic in place in case it's needed.

## Port range when using direct mode

When you use Private Link with an Azure Cosmos DB account through a direct mode connection, you need to ensure that the full range of TCP ports (0 - 65535) is open.

## Update a private endpoint when you add or remove a region

There are three regions for Azure Cosmos DB account deployments: *West US*, *Central US*, and *West Europe*. When you create a private endpoint for your account, four private IPs are reserved in the subnet. There's one IP for each of the three regions, and there's one IP for the global region-agnostic endpoint. Later, you might add a new region to the Azure Cosmos DB account. The private DNS zone is updated as follows:

- **If private DNS zone group is used:**

  If you use a private DNS zone group, the private DNS zone is automatically updated when the private endpoint is updated. In the previous example, after adding a new region, the private DNS zone is automatically updated.

- **If private DNS zone group isn't used:**

  If you don't use a private DNS zone group, adding or removing regions to an Azure Cosmos DB account requires you to add or remove DNS entries for that account. After regions have been added or removed, you can update the subnet's private DNS zone to reflect the added or removed DNS entries and their corresponding private IP addresses.

  In the previous example, after adding the new region, you need to add a corresponding DNS record to either your private DNS zone or your custom DNS. You can use the same steps when you remove a region. After removing the region, you need to remove the corresponding DNS record from either your private DNS zone or your custom DNS.

## Current limitations

The following limitations apply when you use Private Link with an Azure Cosmos DB account:

* You can't have more than 200 private endpoints on a single Azure Cosmos DB account.

* When you use Private Link with an Azure Cosmos DB account through a direct mode connection, you can use only the TCP protocol. The HTTP protocol isn't currently supported.

* When you use Azure Cosmos DB's API for a MongoDB account, a private endpoint is supported for accounts on server version 3.6 or higher (that is, accounts using the endpoint in the format `*.mongo.cosmos.azure.com`). Private Link isn't supported for accounts on server version 3.2 (that is, accounts using the endpoint in the format `*.documents.azure.com`). To use Private Link, you should migrate old accounts to the new version.

* When you use Azure Cosmos DB's API for a MongoDB account that has a Private Link, tools and libraries must support Service Name Identification (SNI) or pass the `appName` parameter from the connection string to properly connect. Some older tools and libraries might not be compatible with the Private Link feature.

* A network administrator should be granted at least the `Microsoft.DocumentDB/databaseAccounts/PrivateEndpointConnectionsApproval/action` permission at the Azure Cosmos DB account scope to create automatically approved private endpoints.

* Currently, you can't approve a rejected private endpoint connection. Instead, re-create the private endpoint to resume the private connectivity. The Azure Cosmos DB private link service automatically approves the re-created private endpoint.

### Limitations to private DNS zone integration

Unless you're using a private DNS zone group, DNS records in the private DNS zone aren't removed automatically when you delete a private endpoint or you remove a region from the Azure Cosmos DB account. You must manually remove the DNS records before:

* Adding a new private endpoint linked to this private DNS zone.
* Adding a new region to any database account that has private endpoints linked to this private DNS zone.

If you don't clean up the DNS records, unexpected data plane issues might happen. These issues include data outage to regions added after private endpoint removal or region removal.

## Next steps

To learn more about Azure Cosmos DB security features, see the following articles:

* To configure a firewall for Azure Cosmos DB, see [Firewall support](how-to-configure-firewall.md).

* To learn how to configure a virtual network service endpoint for your Azure Cosmos DB account, see [Configure access from virtual networks](how-to-configure-vnet-service-endpoint.md).

* To learn more about Private Link, see the [Azure Private Link](../private-link/private-link-overview.md) documentation.
