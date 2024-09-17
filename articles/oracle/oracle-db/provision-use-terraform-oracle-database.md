---
title: Use HashiCorp Terraform to provision Oracle Database@Azure
description: Use HashiCorp Terraform to provision Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 6/07/2024
ms.custom: engagement-fy23, devx-track-terraform
ms.author: jacobjaygbay
---

# Use HashiCorp Terraform to provision Oracle Database@Azure

You can provision and manage resources for Oracle Database@Azure using the Terraform tool that enables you to provision and manage infrastructure in Oracle Cloud Infrastructure (OCI).

The OCI mechanism for Terraform provisioning and management is done via JSON scripts. Here are sample scripts.

>[!NOTE]
>This document describes examples of provisioning and management of Oracle Database@Azure resources through Terraform provider AzAPI. See the [The AzAPI TF provider resources and data sources](https://registry.terraform.io/providers/Azure/azapi/latest/docs).

The API spec version used in the examples is "2023-09-01-preview" as denoted in the "type" field in the examples. This is changed to the public version when it's made available.

## Create an Oracle Exadata Infrastructure

```
resource "azapi_resource" "resource_group" {
  type     = "Microsoft.Resources/resourceGroups@2023-07-01"
  name     = "ExampleRG"
  location = "eastus"
}

// OperationId: CloudExadataInfrastructures_CreateOrUpdate, CloudExadataInfrastructures_Get, CloudExadataInfrastructures_Delete
// PUT /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudExadataInfrastructures/{cloudexadatainfrastructurename}
resource "azapi_resource" "cloudExadataInfrastructure" {
  type      = "Oracle.Database/cloudExadataInfrastructures@2023-09-01-preview"
  parent_id = azapi_resource.resource_group.id
  name      = "ExampleName"
  body = jsonencode({
    "location" : "eastus",
    "zones" : [
      "2"
    ],
    "tags" : {
      "createdby" : "ExampleName"
    },
    "properties" : {
      "computeCount" : 2,
      "displayName" : "ExampleName",
      "maintenanceWindow" : {
        "leadTimeInWeeks" : 0,
        "preference" : "NoPreference",
        "patchingMode" : "Rolling"
      },
      "shape" : "Exadata.X9M",
      "storageCount" : 3
    }
  })
  schema_validation_enabled = false
}
```

## List Oracle Exadata Infrastructures by subscription

```

data "azapi_resource" "subscription" {
  type                   = "Microsoft.Resources/subscriptions@2020-06-01"
  response_export_values = ["*"]
}

// OperationId: CloudExadataInfrastructures_ListBySubscription
// GET /subscriptions/{subscriptionId}/providers/Oracle.Database/cloudExadataInfrastructures
data "azapi_resource_list" "listCloudExadataInfrastructuresBySubscription" {
  type       = "Oracle.Database/cloudExadataInfrastructures@2023-09-01-preview"
  parent_id  = data.azapi_resource.subscription.id
}
```

## List Oracle Exadata Infrastructures by Resource Group

```

data "azurerm_resource_group" "example" {
  name = "existing"
}

// OperationId: CloudExadataInfrastructures_ListByResourceGroup
// GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudExadataInfrastructures
data "azapi_resource_list" "listCloudExadataInfrastructuresByResourceGroup" {
  type       = "Oracle.Database/cloudExadataInfrastructures@2023-09-01-preview"
  parent_id  = azurerm_resource_group.example.id
}
```

## Patch an Oracle Exadata Infrastructure

> [!NOTE]
> Only Microsoft Azure tags on the resource can be updated through the AzAPI provider.

```

data "azapi_resource" "subscription" {
  type                   = "Microsoft.Resources/subscriptions@2020-06-01"
  response_export_values = ["*"]
}

// OperationId: CloudExadataInfrastructures_Update
// PATCH /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudExadataInfrastructures/{cloudexadatainfrastructurename}
resource "azapi_resource_action" "patch_cloudExadataInfrastructure" {
  type        = "Oracle.Database/cloudExadataInfrastructures@2023-09-01-preview"
  resource_id = azapi_resource.cloudExadataInfrastructure.id
  action      = ""
  method      = "PATCH"
  body = jsonencode({
    "tags" : {
      "updatedby" : "ExampleName"
    }
  })
}
```

## List Database Servers on an Oracle Exadata Infrastructure

```

// OperationId: DbServers_Get
// GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudExadataInfrastructures/{cloudexadatainfrastructurename}/dbServers/{dbserverocid}
data "azapi_resource" "dbServer" {
  type      = "Oracle.Database/cloudExadataInfrastructures/dbServers@2023-09-01-preview"
  parent_id = azapi_resource.cloudExadataInfrastructure.id
  name      = var.resource_name
}
```

## Create an Oracle Exadata virtual machine cluster

```

resource "azapi_resource" "resource_group" {
  type     = "Microsoft.Resources/resourceGroups@2023-07-01"
  name     = "ExampleRG"  location = "eastus"
}

// OperationId: CloudExadataInfrastructures_CreateOrUpdate, CloudExadataInfrastructures_Get, CloudExadataInfrastructures_Delete
// PUT /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudExadataInfrastructures/{cloudexadatainfrastructurename}
resource "azapi_resource" "cloudExadataInfrastructure" {
  type      = "Oracle.Database/cloudExadataInfrastructures@2023-09-01-preview"
  parent_id = azapi_resource.resource_group.id
  name      = "ExampleName"
  body = jsonencode({
    "location" : "eastus",
    "zones" : [
      "2"
    ],
    "tags" : {
      "createdby" : "ExampleName"
    },
    "properties" : {
      "computeCount" : 2,
      "displayName" : "ExampleName",
      "maintenanceWindow" : {
        "leadTimeInWeeks" : 0,
        "preference" : "NoPreference",
        "patchingMode" : "Rolling"
      },
      "shape" : "Exadata.X9M",
      "storageCount" : 3
    }
  })
  schema_validation_enabled = false
}

//-------------VMCluster resources ------------
// OperationId: CloudVmClusters_CreateOrUpdate, CloudVmClusters_Get, CloudVmClusters_Delete
// PUT GET DELETE /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudVmClusters/{cloudvmclustername}
resource "azapi_resource" "cloudVmCluster" {
  type                      = "Oracle.Database/cloudVmClusters@2023-09-01-preview"
  parent_id                 = azapi_resource.resourceGroup.id
  name                      = local.exa_cluster_name
  schema_validation_enabled = false
  depends_on                = [azapi_resource.cloudExadataInfrastructure]
  body                      = jsonencode({
    "properties": {
        "dataStorageSizeInTbs": 1000,
        "dbNodeStorageSizeInGbs": 1000,
        "memorySizeInGbs": 1000,
        "timeZone": "UTC",
        "hostname": "hostname1",
        "domain": "domain1",
        "cpuCoreCount": 2,
        "ocpuCount": 3,
        "clusterName": "cluster1",
        "dataStoragePercentage": 100,
        "isLocalBackupEnabled": false,
        "cloudExadataInfrastructureId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg000/providers/Oracle.Database/cloudExadataInfrastructures/infra1",
        "isSparseDiskgroupEnabled": false,
        "sshPublicKeys": [
          "ssh-key 1"
        ],
        "nsgCidrs": [
          {
            "source": "10.0.0.0/16",
            "destinationPortRange": {
              "min": 1520,
              "max": 1522
            }
          },
          {
            "source": "10.10.0.0/24"
          }
        ],
        "licenseModel": "LicenseIncluded",
        "scanListenerPortTcp": 1050,
        "scanListenerPortTcpSsl": 1025,
        "vnetId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg000/providers/Microsoft.Network/virtualNetworks/vnet1",
        "giVersion": "19.0.0.0",
        "subnetId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg000/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
        "backupSubnetCidr": "172.17.5.0/24",
        "dataCollectionOptions": {
          "isDiagnosticsEventsEnabled": false,
          "isHealthMonitoringEnabled": false,
          "isIncidentLogsEnabled": false
        },
        "displayName": "cluster 1",
        "dbServers": [
          "ocid1..aaaa"
        ]
      },
      "location": "eastus"
    }
})
  response_export_values = ["properties.ocid"]
}
```

## List Oracle Exadata virtual machine clusters by subscription

```

data "azapi_resource" "subscription" {
  type                   = "Microsoft.Resources/subscriptions@2020-06-01"
  response_export_values = ["*"]
}

// OperationId: CloudExadataInfrastructures_ListBySubscription
// GET /subscriptions/{subscriptionId}/providers/Oracle.Database/cloudExadataInfrastructures
data "azapi_resource_list" "listCloudExadataInfrastructuresBySubscription" {
  type       = "Oracle.Database/cloudVmClusters@2023-09-01-preview"
  parent_id  = data.azapi_resource.subscription.id
}
```

## List Oracle Exadata VM Clusters by Resource Group

```
data "azurerm_resource_group" "example" {
  name = "existing"
}

// OperationId: CloudExadataInfrastructures_ListByResourceGroup
// GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudExadataInfrastructures
data "azapi_resource_list" "listCloudExadataInfrastructuresByResourceGroup" {
  type       = "Oracle.Database/cloudVmClusters@2023-09-01-preview"
  parent_id  = azurerm_resource_group.example.id
}
```

## List Database Nodes on an Oracle Exadata VM Cluster

```

// OperationId: DbNodes_Get
// GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudVmClusters/{cloudvmclustername}/dbNodes/{dbnodeocid}
data "azapi_resource" "dbNode" {
  type      = "Oracle.Database/cloudVmClusters/dbNodes@2023-09-01-preview"
  parent_id = azapi_resource.cloudVmCluster.id. // VM Cluster Id
  name      = var.resource_name
}
```

## Add a Virtual Network Address to an Oracle Exadata VM Cluster

```
// OperationId: VirtualNetworkAddresses_CreateOrUpdate, VirtualNetworkAddresses_Get, VirtualNetworkAddresses_Delete
// PUT GET DELETE /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudVmClusters/{cloudvmclustername}/virtualNetworkAddresses/{virtualnetworkaddressname}
resource "azapi_resource" "virtualNetworkAddress" {
  type                      = "Oracle.Database/cloudVmClusters/virtualNetworkAddresses@2023-09-01-preview"
  parent_id                 = azapi_resource.cloudVmCluster.id
  name                      = var.resource_name
  body = jsonencode({
    "properties": {
        "ipAddress": "192.168.0.1",
        "vmOcid": "ocid1..aaaa"
      }
  })
  schema_validation_enabled = false
}
```

## List Virtual Network Addresses on an Oracle Exadata VM Cluster

```

// OperationId: VirtualNetworkAddresses_ListByCloudVmCluster
// GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudVmClusters/{cloudvmclustername}/virtualNetworkAddresses
data "azapi_resource_list" "listVirtualNetworkAddressesByCloudVmCluster" {
  type       = "Oracle.Database/cloudVmClusters/virtualNetworkAddresses@2023-09-01-preview"
  parent_id  = azapi_resource.cloudVmCluster.id
}
```

## List an Oracle Exadata Database shape

```

data "azapi_resource_id" "location" {
  type      = "Oracle.Database/locations@2023-12-12"
  parent_id = data.azapi_resource.subscription.id
  name      = "eastus"
}

// OperationId: DbSystemShapes_Get
// GET /subscriptions/{subscriptionId}/providers/Oracle.Database/locations/{location}/dbSystemShapes/{dbsystemshapename}
data "azapi_resource" "dbSystemShape" {
  type      = "Oracle.Database/locations/dbSystemShapes@2023-09-01-preview"
  parent_id = data.azapi_resource_id.location.id
  name      = var.resource_name
}
```

## List Oracle Exadata Database Shapes by location

```

// OperationId: DbSystemShapes_ListByLocation
// GET /subscriptions/{subscriptionId}/providers/Oracle.Database/locations/{location}/dbSystemShapes
data "azapi_resource_list" "listDbSystemShapesByLocation" {
  type       = "Oracle.Database/locations/dbSystemShapes@2023-09-01-preview"
  parent_id  = data.azapi_resource_id.location.id
}
```

## Terraform script to test the examples

>[!NOTE]
>The following script creates an Oracle Exadata Infrastructure and an Oracle Exadata VM Cluster using the AzAPI Terraform provider followed by creating an Oracle Database deployment using the OCI Terraform provider [https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/database_db_home](https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/database_db_home).

```

terraform {
  required_providers {
    azapi = {
      source = "Azure/azapi"
    }
    oci = {
      source = "oracle/oci"
    }
  }
}

provider "azapi" {
  skip_provider_registration = false
}

provider "oci" {
  user_ocid        = <user_ocid>
  fingerprint      = <user_fingerprint>
  tenancy_ocid     = <oci_tenancy_ocid>
  region           = "us-ashburn-1"
  private_key_path = <Path to API Key>
}

locals {
  resource_group_name = "TestResourceGroup"
  user                = "Username"
  location            = "eastus"
}

resource "azapi_resource" "resource_group" {
  type     = "Microsoft.Resources/resourceGroups@2023-07-01"
  name     = local.resource_group_name
  location = local.location
}

resource "azapi_resource" "virtual_network" {
  type      = "Microsoft.Network/virtualNetworks@2023-04-01"
  name      = "${local.resource_group_name}_vnet"
  location  = local.location
  parent_id = azapi_resource.resource_group.id
  body = jsonencode({
    properties = {
      addressSpace = {
        addressPrefixes = [
          "10.0.0.0/16"
        ]
      }
      subnets = [
        {
          name = "delegated"
          properties = {
            addressPrefix = "10.0.1.0/24"
            delegations = [
              {
                name = "Oracle.Database.networkAttachments"
                properties = {
                  serviceName = "Oracle.Database/networkAttachments"
                }
              }
            ]
          }
        }
      ]
    }
  })
}

data "azapi_resource_list" "listVirtualNetwork" {
  type                   = "Microsoft.Network/virtualNetworks/subnets@2023-09-01"
  parent_id              = azapi_resource.virtual_network.id
  depends_on             = [azapi_resource.virtual_network]
  response_export_values = ["*"]
}

resource "tls_private_key" "generated_ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "azapi_resource" "ssh_public_key" {
  type      = "Microsoft.Compute/sshPublicKeys@2023-09-01"
  name      = "${local.resource_group_name}_key"
  location  = local.location
  parent_id = azapi_resource.resource_group.id
  body = jsonencode({
    properties = {
      publicKey = "${tls_private_key.generated_ssh_key.public_key_openssh}"
    }
  })
}

// OperationId: CloudExadataInfrastructures_CreateOrUpdate, CloudExadataInfrastructures_Get, CloudExadataInfrastructures_Delete
// PUT /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudExadataInfrastructures/{cloudexadatainfrastructurename}
resource "azapi_resource" "cloudExadataInfrastructure" {
  type      = "Oracle.Database/cloudExadataInfrastructures@2023-09-01-preview"
  parent_id = azapi_resource.resource_group.id
  name      = "OFake_terraform_deploy_infra_${local.resource_group_name}"
  timeouts {
    create = "1h30m"
    delete = "20m"
  }
  body = jsonencode({
    "location" : "${local.location}",
    "zones" : [
      "2"
    ],
    "tags" : {
      "createdby" : "${local.user}"
    },
    "properties" : {
      "computeCount" : 2,
      "displayName" : "OFake_terraform_deploy_infra_${local.resource_group_name}",
      "maintenanceWindow" : {
        "leadTimeInWeeks" : 0,
        "preference" : "NoPreference",
        "patchingMode" : "Rolling"
      },
      "shape" : "Exadata.X9M",
      "storageCount" : 3
    }

  })
  schema_validation_enabled = false
}

// OperationId: DbServers_ListByCloudExadataInfrastructure
// GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudExadataInfrastructures/{cloudexadatainfrastructurename}/dbServers
data "azapi_resource_list" "listDbServersByCloudExadataInfrastructure" {
  type                   = "Oracle.Database/cloudExadataInfrastructures/dbServers@2023-09-01-preview"
  parent_id              = azapi_resource.cloudExadataInfrastructure.id
  depends_on             = [azapi_resource.cloudExadataInfrastructure]
  response_export_values = ["*"]
}

// OperationId: CloudVmClusters_CreateOrUpdate, CloudVmClusters_Get, CloudVmClusters_Delete
// PUT /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Oracle.Database/cloudVmClusters/{cloudvmclustername}
resource "azapi_resource" "cloudVmCluster" {
  type                      = "Oracle.Database/cloudVmClusters@2023-09-01-preview"
  parent_id                 = azapi_resource.resource_group.id
  name                      = "OFake_terraform_deploy_cluster_${local.resource_group_name}"
  schema_validation_enabled = false
  depends_on                = [azapi_resource.cloudExadataInfrastructure]
  timeouts {
    create = "1h30m"
    delete = "20m"
  }
  body = jsonencode({
    "location" : "${local.location}",
    "tags" : {
      "createdby" : "${local.user}"
    },
    "properties" : {
      "subnetId" : "${jsondecode(data.azapi_resource_list.listVirtualNetwork.output).value[0].id}"
      "cloudExadataInfrastructureId" : "${azapi_resource.cloudExadataInfrastructure.id}"
      "cpuCoreCount" : 4
      "dataCollectionOptions" : {
        "isDiagnosticsEventsEnabled" : true,
        "isHealthMonitoringEnabled" : true,
        "isIncidentLogsEnabled" : true
      },
      "dataStoragePercentage" : 80,
      "dataStorageSizeInTbs" : 2,
      "dbNodeStorageSizeInGbs" : 120,
      "dbServers" : [
        "${jsondecode(data.azapi_resource_list.listDbServersByCloudExadataInfrastructure.output).value[0].properties.ocid}",
        "${jsondecode(data.azapi_resource_list.listDbServersByCloudExadataInfrastructure.output).value[1].properties.ocid}"
      ]
      "displayName" : "OFake_terraform_deploy_cluster_${local.resource_group_name}",
      "giVersion" : "19.0.0.0",
      "hostname" : "${local.user}",
      "isLocalBackupEnabled" : false,
      "isSparseDiskgroupEnabled" : false,
      "licenseModel" : "LicenseIncluded",
      "memorySizeInGbs" : 60,
      "sshPublicKeys" : ["${tls_private_key.generated_ssh_key.public_key_openssh}"],
      "timeZone" : "UTC",
      "vnetId" : "${azapi_resource.virtual_network.id}",
      "provisioningState" : "Succeeded"
    }
  })
  response_export_values = ["properties.ocid"]
}

resource "oci_database_db_home" "exa_db_home" {
  source        = "VM_CLUSTER_NEW"
  vm_cluster_id = jsondecode(azapi_resource.cloudVmCluster.output).properties.ocid
  db_version    = "19.20.0.0"
  display_name  = "TFDBHOME"

  database {
    db_name        = "TFCDB"
    pdb_name       = "TFPDB"
    admin_password = "TestPass#2024#"
    db_workload    = "OLTP"
  }
  depends_on = [azapi_resource.cloudVmCluster]
}
```
