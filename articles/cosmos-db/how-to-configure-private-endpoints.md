---
title: Configure Private Links to use with Azure Cosmos accounts
description: Learn how to set up a Private Links to access an Azure Cosmos account using a private IP address in a virtual network. 
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: thweiss
---

# Configure Private Links to use with Azure Cosmos accounts (Preview)

A Private Link lets you expose Azure Cosmos accounts behind the private IP addresses in a virtual network. The key advantage of this feature is that network administrators can restrict access to Azure Cosmos account from the configured private IP addresses only within the scope of a virtual network. With this feature,  the risks of data exfiltration are reduced.

Additionally, Private Links allow Azure Cosmos accounts to be accessible from within the virtual network or any peered virtual network. Private Link-mapped resources are also accessible from on premises over private peering through VPN or ExpressRoute.

## Create a private link using Resource Manager template

You can set up Private Links by creating a private endpoint in a virtual network subnet. This is achieved by using an Azure Resource Manager template. Create a Resource Manager template named "PrivateEndpoint_template.json" with the following code. This template creates a private endpoint for an existing Azure Cosmos SQL API account in an existing virtual network:

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

Next create a PowerShell script with the following code:

```powershell
### This script creates a private endpoint for an existing Cosmos DB account in an existing VNet

## Step 1: Fill in these details
$SubscriptionId = "<your Azure subscription ID>"
# Resource group where the Cosmos DB and VNet resources live
$ResourceGroupName = "cdbrg"
# Name of the Cosmos DB account
$CosmosDbAccountName = "sqlcdb2"
# API type of the Cosmos DB account: Sql or MongoDB or Cassandra or Gremlin or Table or Etcd
$CosmosDbApiType = "Sql"
# Name of the existing VNet
$VNetName = "cdbVnet2"
# Name of the target subnet in the VNet
$SubnetName = "cdbSubnet2"
# Name of the private endpoint to create
$PrivateEndpointName = "cdbPrivateEndpoint3"

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

In the PowerShell script, the "GroupId" variable can only contain one value, which is the API type of the account. Allowed values are- SQL, MongoDB, Cassandra, Gremlin, Table, and Etcd. Some Azure Cosmos account types are accessible through multiple APIs. For example:

* A Gremlin API account can be accessed from both Gremlin and SQL API accounts.
* A Table API account can be accessed from both Table and SQL API accounts.

For such accounts, you must create one private endpoint for each API type, with the corresponding API type specified in the "GroupId" array.

After the template is deployed successfully, you can see an output similar to what is shown in the following image. The provisioningState value is "Succeeded" if the private endpoints are set up correctly.

![Resource Manager template deployment output](./media/how-to-configure-private-endpoints/resource-manager-template-deployment-output.png)

After the template is deployed, the private IP addresses are reserved within the subnet. And the Azure Cosmos DB's firewall is configured to accept connections from the private endpoint only.

## Fetch the private IP addresses

After the private endpoint is provisioned, it is possible to query the IP addresses. The result returns information about the newly created private endpoint, including the "ID" of "networkInterfaces".

**Request**	

```
\ARMClient.exe get https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Network/privateEndpoints/<private-endpoint-id>?api-version=2019-02-01
```

**Response**

```json
…
"networkInterfaces": [
   {
     "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Network/networkInterfaces/<network-interface-id>"
   }
 ]
…
```

To fetch the list of all private IP addresses associated with the new private endpoint, we can issue another GET request on the network interface ID:

**Request**	

```
.\ARMClient.exe get https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Network/networkInterfaces/<network-interface-id>
```

**Response**

```json
{
  …
  "ipConfigurations": [
    {
    …
        "privateIPAddress": "10.0.0.16",
          "fqdns": [
            "<cosmos-db-account>.documents.azure.com"
          ]
    …
    },
    {
    …
        "privateIPAddress": "10.0.0.17",
         "fqdns": [
           "<cosmos-db-account>-northcentralus.documents.azure.com"
          ]
          …
    }
   …
  ]
}
```

You can also view the IP addresses from Azure portal. Select All resources, search for the private endpoint you created earlier in this case it's "dbPrivateEndpoint3" and select the Overview tab to see the DNS settings and IP addresses:

![Private IP addresses in Azure portal](./media/how-to-configure-private-endpoints/private-ip-addresses-portal.png)

Multiple IP addresses are created per private endpoint:

* One for the global (region-agnostic) endpoint of the Azure Cosmos account.
* One for each region where the Azure Cosmos account is deployed.

## Configure private DNS

During the preview of Private Links, you should use a private DNS within the subnet where the private endpoint has been created. And configure the endpoints so that each of the private IP addresses is mapped to a DNS entry (see the "fqdns" property in the response shown above).

## Firewall configuration with Private Links

* If no firewall rule is configured, an Azure Cosmos account is by default accessible to all the traffic.

* If public traffic or service endpoint firewall rules are configured, and private endpoints are created, different types of incoming traffic are authorized by the corresponding type of firewall rule.

* If no public traffic or service endpoint firewall rule is configured, and private endpoints are created, the Azure Cosmos account is accessible only through the private endpoints. Even after all the private endpoints are deleted, the account is not accessible to any traffic unless the private endpoint evaluation is disabled. You can disable it by updating the Azure Cosmos account's Resource Manager template and setting the `accountPrivateEndpointConnectionEnabled` property to `false`:

**Request**

```
.\ARMClient.exe put https://management.azure.com/<cosmos-db-account-id>
{
    …
    "properties": {
    "provisioningState": "Succeeded",
    "documentEndpoint": "…",
    "cassandraEndpoint": "…",
    "accountPrivateEndpointConnectionEnabled": false
    …
}
```

## Adding or removing Azure Cosmos DB regions

Adding or removing regions to an Azure Cosmos account requires you to add or remove DNS entries for that account. These changes should be updated accordingly in the private endpoint. Currently you should manually make this change by using the following steps:

1. The Azure Cosmos DB administrator adds or removes regions. Then the network administrators are notified about the pending changes. The private endpoint mapped to an Azure Cosmos account sees its "ActionsRequired" properties changed from "None" to "Recreate". Then the network administrator updates the private endpoint by issuing a PUT request with the same Resource Manager payload used to create it.

1. After this operation, the subnet's private DNS also has to be updated to reflect the added or removed DNS entries and their corresponding private IP addresses.

## Current limitations
The following limitations apply to the use of Private Links:
* MongoDB accounts that are using endpoints in the format "xxx.documents.azure.com" don't work with Private Links. You should migrate the database account to use "xxx.mongo.cosmos.azure.com" endpoints.

* MongoDB accounts using "xxx.mongo.cosmos.azure.com" endpoints can have Private Links support only if the `appName=<account name>` parameter is specified. For example: `replicaSet=globaldb&appName=mydbaccountname`.

* A virtual network can't be moved or deleted if it contains Private Links.

* An Azure Cosmos account can't be deleted if it is attached to a private endpoint.

* An Azure Cosmos account can't be failed over to a region that's not mapped to all private endpoints attached to it. For more information, see Adding or removing regions in the previous section.

* A network administrator should be granted at least the "*/PrivateEndpointConnectionsApproval" permission at the Azure Cosmos account scope by an administrator to create private endpoints.

## Next steps

To learn more about the other Azure Cosmos DB security features, see the following article:

* To configure a firewall for Azure Cosmos DB, see the [Firewall support](firewall-support.md) article.

* [How to configure virtual network service endpoint for your Azure Cosmos account.](how-to-configure-vnet-service-endpoint.md)
