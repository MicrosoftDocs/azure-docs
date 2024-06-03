---
title: 'Quickstart: Create a flexible server by using Bicep'
description: In this quickstart, learn how to deploy a database in an instance of Azure Database for MySQL - Flexible Server by using Bicep.
ms.service: mysql
ms.subservice: flexible-server
ms.custom: devx-track-bicep
ms.topic: quickstart
author: shreyaaithal
ms.author: shaithal
ms.date: 02/16/2023
---

# Quickstart: Create an instance of Azure Database for MySQL - Flexible Server by using a Bicep file

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[!INCLUDE [azure-database-for-mysql-flexible-server-abstract](../includes/azure-database-for-mysql-flexible-server-abstract.md)]

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

- An Azure account with an active subscription.

[!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

## Create a server that has public access

Modify the following code examples to create a *main.bicep* file and a *CreateFirewallRules.bicep* file. Use the files to create an Azure Database for MySQL flexible server that has public access and to create a database on the server. You might need to modify the default value of `firewallRules`.

*main.bicep*:

```bicep
@description('Provide a prefix for creating resource names.')
param resourceNamePrefix string

@description('Provide the location for all the resources.')
param location string = resourceGroup().location

@description('Provide the administrator login username for the flexible server.')
param administratorLogin string

@description('Provide the administrator login password for the flexible server.')
@secure()
param administratorLoginPassword string

@description('Provide an array of firewall rules to apply to the flexible server.')
param firewallRules array = [
  {
    name: 'rule1'
    startIPAddress: '192.168.0.1'
    endIPAddress: '192.168.0.255'
  }
  {
    name: 'rule2'
    startIPAddress: '192.168.1.1'
    endIPAddress: '192.168.1.255'
  }
]

@description('The tier of the particular SKU. High availability mode is available only in the GeneralPurpose and MemoryOptimized SKUs.')
@allowed([
  'Burstable'
  'GeneralPurpose'
  'MemoryOptimized'
])
param serverEdition string = 'Burstable'

@description('Server version')
@allowed([
  '5.7'
  '8.0.21'
])
param version string = '8.0.21'

@description('The availability zone information for the server. (If you don't have a preference, leave blank.)')
param availabilityZone string = '1'

@description('High availability mode for a server: Disabled, SameZone, or ZoneRedundant.')
@allowed([
  'Disabled'
  'SameZone'
  'ZoneRedundant'
])
param haEnabled string = 'Disabled'

@description('The availability zone of the standby server.')
param standbyAvailabilityZone string = '2'

param storageSizeGB int = 20
param storageIops int = 360
@allowed([
  'Enabled'
  'Disabled'
])
param storageAutogrow string = 'Enabled'

@description('The name of the SKU, such as Standard_D32ds_v4.')
param skuName string = 'Standard_B1ms'

param backupRetentionDays int = 7
@allowed([
  'Disabled'
  'Enabled'
])
param geoRedundantBackup string = 'Disabled'

param serverName string = '${resourceNamePrefix}sqlserver'
param databaseName string = '${resourceNamePrefix}mysqldb'

resource server 'Microsoft.DBforMySQL/flexibleServers@2021-12-01-preview' = {
  location: location
  name: serverName
  sku: {
    name: skuName
    tier: serverEdition
  }
  properties: {
    version: version
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    availabilityZone: availabilityZone
    highAvailability: {
      mode: haEnabled
      standbyAvailabilityZone: standbyAvailabilityZone
    }
    storage: {
      storageSizeGB: storageSizeGB
      iops: storageIops
      autoGrow: storageAutogrow
    }
    backup: {
      backupRetentionDays: backupRetentionDays
      geoRedundantBackup: geoRedundantBackup
    }
  }
}

@batchSize(1)
module createFirewallRules './CreateFirewallRules.bicep' = [for i in range(0, ((length(firewallRules) > 0) ? length(firewallRules) : 1)): {
  name: 'firewallRules-${i}'
  params: {
    ip: firewallRules[i]
    serverName: serverName
  }
  dependsOn: [
    server
  ]
}]

resource database 'Microsoft.DBforMySQL/flexibleServers/databases@2021-12-01-preview' = {
  parent: server
  name: databaseName
  properties: {
    charset: 'utf8'
    collation: 'utf8_general_ci'
  }
}
```

*CreateFirewallRules.bicep*:

```bicep
param serverName string
param ip object

resource firewallRules 'Microsoft.DBforMySQL/flexibleServers/firewallRules@2021-12-01-preview' = {
  name: '${serverName}/${ip.name}'
  properties: {
    startIpAddress: ip.startIPAddress
    endIpAddress: ip.endIPAddress
  }
}
```

Save the two Bicep files in the same directory.

## Create a server that has private access

Modify the following code samples to deploy an Azure Database for MySQL flexible server that has private access inside a virtual network:

```bicep
@description('Provide a prefix for creating resource names.')
param resourceNamePrefix string

@description('Provide the location for all the resources.')
param location string = resourceGroup().location

@description('Provide the administrator login name for the MySQL server.')
param administratorLogin string

@description('Provide the administrator login password for the MySQL server.')
@secure()
param administratorLoginPassword string

@description('Provide Virtual Network Address Prefix')
param vnetAddressPrefix string = '10.0.0.0/16'

@description('Provide Subnet Address Prefix')
param subnetPrefix string = '10.0.0.0/24'

@description('Provide the tier of the specific SKU. High availability is available only in the GeneralPurpose and MemoryOptimized SKUs.')
@allowed([
  'Burstable'
  'Generalpurpose'
  'MemoryOptimized'
])
param serverEdition string = 'Burstable'

@description('Provide Server version')
@allowed([
  '5.7'
  '8.0.21'
])
param serverVersion string = '8.0.21'

@description('The availability zone information for the server. (If you don't have a preference, leave blank.)')
param availabilityZone string = '1'

@description('Provide the high availability mode for a server: Disabled, SameZone, or ZoneRedundant.')
@allowed([
  'Disabled'
  'SameZone'
  'ZoneRedundant'
])
param haEnabled string = 'Disabled'

@description('Provide the availability zone of the standby server.')
param standbyAvailabilityZone string = '2'

param storageSizeGB int = 20
param storageIops int = 360
@allowed([
  'Enabled'
  'Disabled'
])
param storageAutogrow string = 'Enabled'

@description('The name of the sku, e.g. Standard_D32ds_v4.')
param skuName string = 'Standard_B1ms'

param backupRetentionDays int = 7
@allowed([
  'Disabled'
  'Enabled'
])
param geoRedundantBackup string = 'Disabled'

var serverName = '${resourceNamePrefix}mysqlserver'
var databaseName = '${resourceNamePrefix}mysqldatabase'
var vnetName = '${resourceNamePrefix}mysqlvnet'
var subnetName = '${resourceNamePrefix}mysqlsubnet'

resource vnet 'Microsoft.Network/virtualNetworks@2022-07-01' = {
  name: vnetName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        vnetAddressPrefix
      ]
    }
  }
}

resource subnet 'Microsoft.Network/virtualNetworks/subnets@2022-07-01' = {
  parent: vnet
  name: subnetName
  properties: {
    addressPrefix: subnetPrefix
    delegations: [
      {
        name: 'MySQLflexibleServers'
        properties: {
          serviceName: 'Microsoft.DBforMySQL/flexibleServers'
        }
      }
    ]
  }
}

resource server 'Microsoft.DBforMySQL/flexibleServers@2021-12-01-preview' = {
  location: location
  name: serverName
  sku: {
    name: skuName
    tier: serverEdition
  }
  properties: {
    version: serverVersion
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    availabilityZone: availabilityZone
    highAvailability: {
      mode: haEnabled
      standbyAvailabilityZone: standbyAvailabilityZone
    }
    storage: {
      storageSizeGB: storageSizeGB
      iops: storageIops
      autoGrow: storageAutogrow
    }
    network: {
      delegatedSubnetResourceId: subnet.id
    }
    backup: {
      backupRetentionDays: backupRetentionDays
      geoRedundantBackup: geoRedundantBackup
    }
  }
}

resource database 'Microsoft.DBforMySQL/flexibleServers/databases@2021-12-01-preview' = {
  parent: server
  name: databaseName
  properties: {
    charset: 'utf8'
    collation: 'utf8_general_ci'
  }
}

```

## Deploy the template

Deploy the Bicep file by using either the Azure CLI or Azure PowerShell.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name exampleRG --location eastus
az deployment group create --resource-group exampleRG --template-file main.bicep
```

# [AzurePowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name exampleRG -Location eastus
New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile main.bicep
```

---

Follow the instructions to enter the parameter values. When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

To verify that your Azure Database for MySQL flexible server was created in the resource group:

# [Azure CLI](#tab/azure-cli)

```azurecli
az resource list --resource-group exampleRG

```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

To delete the resource group and the resources that are contained in the resource group:

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name exampleRG
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---

## Related content

- For a step-by-step tutorial that guides you through the process of creating a Bicep template, see [Quickstart: Create Bicep files by using Visual Studio Code](../../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md).
- For a step-by-step tutorial that shows how to build an app by using Azure App Service and MySQL, see[Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md).
