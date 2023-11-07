---
title: 'Quickstart: Create an Azure Database for MySQL - Flexible Server - Bicep'
description: In this Quickstart, learn how to create an Azure Database for MySQL - Flexible Server by using Bicep.
ms.service: mysql
ms.subservice: flexible-server
ms.custom: devx-track-bicep
ms.topic: quickstart
author: shreyaaithal
ms.author: shaithal
ms.date: 02/16/2023
---

# Quickstart: Use a Bicep file to create an Azure Database for MySQL - Flexible Server

[!INCLUDE [applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[!INCLUDE [About Azure Database for MySQL - Flexible Server](../includes/azure-database-for-mysql-flexible-server-abstract.md)]

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

- An Azure account with an active subscription.

[!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

## Create server with public access

Create a **main.bicep** file and a **CreateFirewallRules.bicep** file with the following content to create a server using public access connectivity method and also create a database on the server. Update the **firewallRules** default value if needed.

**main.bicep**

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

@description('Provide an array of firewall rules to be applied to the MySQL server.')
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

@description('The tier of the particular SKU. High Availability is available only for GeneralPurpose and MemoryOptimized sku.')
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

@description('Availability Zone information of the server. (Leave blank for No Preference).')
param availabilityZone string = '1'

@description('High availability mode for a server : Disabled, SameZone, or ZoneRedundant')
@allowed([
  'Disabled'
  'SameZone'
  'ZoneRedundant'
])
param haEnabled string = 'Disabled'

@description('Availability zone of the standby server.')
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

**CreateFirewallRules.bicep**

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

Save the two Bicep files in the same directly.

## Create a server with private access

Create an **main.bicep** file with the following content to create a server using private access connectivity method inside a virtual network.

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

@description('Provide the tier of the particular SKU. High Availability is available only for GeneralPurpose and MemoryOptimized sku.')
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

@description('Provide the availability zone information of the server. (Leave blank for No Preference).')
param availabilityZone string = '1'

@description('Provide the high availability mode for a server : Disabled, SameZone, or ZoneRedundant')
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

Deploy the Bicep file using either Azure CLI or Azure PowerShell.

# [CLI](#tab/CLI)

```azurecli
az group create --name exampleRG --location eastus
az deployment group create --resource-group exampleRG --template-file main.bicep
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name exampleRG -Location eastus
New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile main.bicep
```

---

Follow the instructions to enter the parameter values. When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Follow these steps to verify if your server was created in the resource group.

# [CLI](#tab/CLI)

```azurecli
az resource list --resource-group exampleRG

```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Get-AzResource -ResourceGroupName exampleRG
```
---

## Clean up resources

To delete the resource group and the resources contained in the resource group:

# [CLI](#tab/CLI)

```azurecli
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

For a step-by-step tutorial that guides you through the process of creating an ARM template, see:

> [!div class="nextstepaction"]
> [Quickstart: Create Bicep files with Visual Studio Code](../../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md)

For a step-by-step tutorial to build an app with App Service using MySQL, see:

> [!div class="nextstepaction"]
> [Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md)
