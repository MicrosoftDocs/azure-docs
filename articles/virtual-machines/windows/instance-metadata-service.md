---
title: Azure Instance Metadata Service for Windows 
description: Learn about the Azure Instance Metadata Service and how it provides information about currently running virtual machine instances in Windows.
services: virtual-machines
author: KumariSupriya
manager: paulmey
ms.service: virtual-machines
ms.subservice: monitoring
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 03/30/2020
ms.author: sukumari
ms.reviewer: azmetadatadev
---

# Azure Instance Metadata Service

The Azure Instance Metadata Service (IMDS) provides information about currently running virtual machine instances. You can use it to manage and configure your virtual machines.
This information includes the SKU, storage, network configurations, and upcoming maintenance events. For a complete list of the data available, see [metadata APIs](#metadata-apis).


IMDS is available for running instances of virtual machines (VMs) and virtual machine scale set instances. All APIs support VMs created and managed by using [Azure Resource Manager](/rest/api/resources/). Only
the attested and network endpoints support VMs created by using the classic deployment model. The attested endpoint does so only to a limited extent.

IMDS is a REST endpoint that's available at a well-known, non-routable IP address (`169.254.169.254`). You access it only from within the VM. Communication between the VM and IMDS never leaves the host.
Have your HTTP clients bypass web proxies within the VM when querying IMDS, and treat `169.254.169.254` the same as [`168.63.129.16`](../../virtual-network/what-is-ip-address-168-63-129-16.md).

## Security

The IMDS endpoint is accessible only from within the running virtual machine instance on a non-routable IP address. In addition, any request with an `X-Forwarded-For` header is rejected by the service.
Requests must also contain a `Metadata: true` header, to ensure that the actual request was directly intended and not a part of unintentional redirection.

> [!IMPORTANT]
> IMDS isn't a channel for sensitive data. The endpoint is open to all processes on the VM. Consider information exposed through this service as shared information to all applications running inside the VM.

## Usage

### Access Azure Instance Metadata Service

To access IMDS, create a VM from [Azure Resource Manager](/rest/api/resources/) or the [Azure portal](https://portal.azure.com), and use the following samples.
For more examples, see [Azure Instance Metadata Samples](https://github.com/microsoft/azureimds).

Here's the sample code to retrieve all metadata for an instance. To access a specific data source, see the [Metadata API](#metadata-apis) section. 

**Request**

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri http://169.254.169.254/metadata/instance?api-version=2020-09-01 | ConvertTo-Json
```
> [!NOTE]
> The `-NoProxy` flag is only available in PowerShell 6 or later. You can omit the flag if you don't
> have a proxy setup.

**Response**

> [!NOTE]
> The response is a JSON string. Pipe your REST query through the `ConvertTo-Json` cmdlet for pretty-printing.

```json
{
    "compute": {
        "azEnvironment": "AZUREPUBLICCLOUD",
        "isHostCompatibilityLayerVm": "true",
        "licenseType":  "Windows_Client",
        "location": "westus",
        "name": "examplevmname",
        "offer": "Windows",
        "osProfile": {
            "adminUsername": "admin",
            "computerName": "examplevmname",
            "disablePasswordAuthentication": "true"
        },
        "osType": "linux",
        "placementGroupId": "f67c14ab-e92c-408c-ae2d-da15866ec79a",
        "plan": {
            "name": "planName",
            "product": "planProduct",
            "publisher": "planPublisher"
        },
        "platformFaultDomain": "36",
        "platformUpdateDomain": "42",
        "publicKeys": [{
                "keyData": "ssh-rsa 0",
                "path": "/home/user/.ssh/authorized_keys0"
            },
            {
                "keyData": "ssh-rsa 1",
                "path": "/home/user/.ssh/authorized_keys1"
            }
        ],
        "publisher": "RDFE-Test-Microsoft-Windows-Server-Group",
        "resourceGroupName": "macikgo-test-may-23",
        "resourceId": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/macikgo-test-may-23/providers/Microsoft.Compute/virtualMachines/examplevmname",
        "securityProfile": {
            "secureBootEnabled": "true",
            "virtualTpmEnabled": "false"
        },
        "sku": "Windows-Server-2012-R2-Datacenter",
        "storageProfile": {
            "dataDisks": [{
                "caching": "None",
                "createOption": "Empty",
                "diskSizeGB": "1024",
                "image": {
                    "uri": ""
                },
                "lun": "0",
                "managedDisk": {
                    "id": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/macikgo-test-may-23/providers/Microsoft.Compute/disks/exampledatadiskname",
                    "storageAccountType": "Standard_LRS"
                },
                "name": "exampledatadiskname",
                "vhd": {
                    "uri": ""
                },
                "writeAcceleratorEnabled": "false"
            }],
            "imageReference": {
                "id": "",
                "offer": "UbuntuServer",
                "publisher": "Canonical",
                "sku": "16.04.0-LTS",
                "version": "latest"
            },
            "osDisk": {
                "caching": "ReadWrite",
                "createOption": "FromImage",
                "diskSizeGB": "30",
                "diffDiskSettings": {
                    "option": "Local"
                },
                "encryptionSettings": {
                    "enabled": "false"
                },
                "image": {
                    "uri": ""
                },
                "managedDisk": {
                    "id": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/macikgo-test-may-23/providers/Microsoft.Compute/disks/exampleosdiskname",
                    "storageAccountType": "Standard_LRS"
                },
                "name": "exampleosdiskname",
                "osType": "Linux",
                "vhd": {
                    "uri": ""
                },
                "writeAcceleratorEnabled": "false"
            }
        },
        "subscriptionId": "xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx",
        "tags": "baz:bash;foo:bar",
        "version": "15.05.22",
        "vmId": "02aab8a4-74ef-476e-8182-f6d2ba4166a6",
        "vmScaleSetName": "crpteste9vflji9",
        "vmSize": "Standard_A3",
        "zone": ""
    },
    "network": {
        "interface": [{
            "ipv4": {
               "ipAddress": [{
                    "privateIpAddress": "10.144.133.132",
                    "publicIpAddress": ""
                }],
                "subnet": [{
                    "address": "10.144.133.128",
                    "prefix": "26"
                }]
            },
            "ipv6": {
                "ipAddress": [
                 ]
            },
            "macAddress": "0011AAFFBB22"
        }]
    }
}
```

### Data output

By default, IMDS returns data in JSON format (`Content-Type: application/json`). However, some APIs can return data in different formats, if requested.
The following table lists other data formats that APIs might support.

API | Default data format | Other formats
--------|---------------------|--------------
/attested | json | none
/identity | json | none
/instance | json | text
/scheduledevents | json | none

To access a non-default response format, specify the requested format as a query string parameter in the request. For example:

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri "http://169.254.169.254/metadata/instance?api-version=2017-08-01&format=text"
```

> [!NOTE]
> For leaf nodes in `/metadata/instance`, the `format=json` doesn't work. For these queries, `format=text` needs to be explicitly specified because the default format is JSON.

### Version

IMDS is versioned, and specifying the API version in the HTTP request is mandatory.

The supported API versions are: 
- 2017-03-01
- 2017-04-02
- 2017-08-01 
- 2017-10-01
- 2017-12-01 
- 2018-02-01
- 2018-04-02
- 2018-10-01
- 2019-02-01
- 2019-03-11
- 2019-04-30
- 2019-06-01
- 2019-06-04
- 2019-08-01
- 2019-08-15
- 2019-11-01
- 2020-06-01
- 2020-07-15
- 2020-09-01
- 2020-10-01

> [!NOTE]
> Version 2020-10-01 might not yet be available in every region.

As newer versions are added, you can still access older versions for compatibility if your scripts have dependencies on specific data formats.

When you don't specify a version, you get an error, with a list of the newest supported versions.

> [!NOTE]
> The response is a JSON string. The following example indicates the error condition when the version isn't specified. The response is pretty-printed for readability.

**Request**

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri http://169.254.169.254/metadata/instance
```

**Response**

```json
{
    "error": "Bad request. api-version was not specified in the request. For more information refer to aka.ms/azureimds",
    "newest-versions": [
        "2020-10-01",
        "2020-09-01",
        "2020-07-15"
    ]
}
```

## Metadata APIs

IMDS contains multiple APIs representing different data sources.

API | Description | Version introduced
----|-------------|-----------------------
/attested | See [Attested data](#attested-data) | 2018-10-01
/identity | See [Acquire an access token](../../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md) | 2018-02-01
/instance | See [Instance API](#instance-api) | 2017-04-02
/scheduledevents | See [Scheduled events](scheduled-events.md) | 2017-08-01

## Instance API

Instance API exposes the important metadata for the VM instances, including the VM, network, and storage. 
You can access the following categories through `instance/compute`:

Data | Description | Version introduced
-----|-------------|-----------------------
azEnvironment | The Azure environment in which the VM is running. | 2018-10-01
customData | This feature is currently disabled. | 2019-02-01
isHostCompatibilityLayerVm | Identifies if the VM runs on the Host Compatibility Layer. | 2020-06-01
licenseType | The type of license for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit). Note that this is only present for AHB-enabled VMs. | 2020-09-01
location | The Azure region in which the VM is running. | 2017-04-02
name | The name of the VM. | 2017-04-02
offer | Offer information for the VM image. This is only present for images deployed from the Azure image gallery. | 2017-04-02
osProfile.adminUsername | Specifies the name of the admin account. | 2020-07-15
osProfile.computerName | Specifies the name of the computer. | 2020-07-15
osProfile.disablePasswordAuthentication | Specifies if password authentication is disabled. Note that this is only present for Linux VMs. | 2020-10-01
osType | Linux or Windows. | 2017-04-02
placementGroupId | [Placement group](../../virtual-machine-scale-sets/virtual-machine-scale-sets-placement-groups.md) of your virtual machine scale set. | 2017-08-01
plan | [Plan](/rest/api/compute/virtualmachines/createorupdate#plan) containing the name, product, and publisher for a VM if it is an Azure Marketplace image. | 2018-04-02
platformUpdateDomain |  [Update domain](../manage-availability.md) in which the VM is running. | 2017-04-02
platformFaultDomain | [Fault domain](../manage-availability.md) in which the VM is running. | 2017-04-02
provider | The provider of the VM. | 2018-10-01
publicKeys | [Collection of public keys](/rest/api/compute/virtualmachines/createorupdate#sshpublickey) assigned to the VM and paths. | 2018-04-02
publisher | The publisher of the VM image. | 2017-04-02
resourceGroupName | [Resource group](../../azure-resource-manager/management/overview.md) for your VM. | 2017-08-01
resourceId | The [fully qualified](/rest/api/resources/resources/getbyid) ID of the resource. | 2019-03-11
sku | The specific SKU for the VM image. | 2017-04-02
securityProfile.secureBootEnabled | Identifies if UEFI secure boot is enabled on the VM. | 2020-06-01
securityProfile.virtualTpmEnabled | Identifies if the virtual Trusted Platform Module (TPM) is enabled on the VM. | 2020-06-01
storageProfile | See [Storage profile](#storage-metadata). | 2019-06-01
subscriptionId | Azure subscription for the VM. | 2017-08-01
tags | [Tags](../../azure-resource-manager/management/tag-resources.md) for your VM.  | 2017-08-01
tagsList | Tags formatted as a JSON array for easier programmatic parsing.  | 2019-06-04
version | The version of the VM image. | 2017-04-02
vmId | [Unique identifier](https://azure.microsoft.com/blog/accessing-and-using-azure-vm-unique-id/) for the VM. | 2017-04-02
vmScaleSetName | [Virtual machine scale set name](../../virtual-machine-scale-sets/overview.md) of your virtual machine scale set. | 2017-12-01
vmSize | See [VM size](../sizes.md). | 2017-04-02
zone | [Availability Zone](../../availability-zones/az-overview.md) of your VM. | 2017-12-01

### Sample 1: Track a VM running on Azure

As a service provider, you might need to track the number of VMs running your software, or have agents that need to track uniqueness of the VM. To be able to get a unique ID for a VM, use the `vmId` field from IMDS.

**Request**

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri "http://169.254.169.254/metadata/instance/compute/vmId?api-version=2017-08-01&format=text"
```

**Response**

```text
5c08b38e-4d57-4c23-ac45-aca61037f084
```

### Sample 2: Placement of different data replicas

For certain scenarios, placement of different data replicas is of prime importance. For example, [HDFS replica placement](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html#Replica_Placement:_The_First_Baby_Steps)
or container placement via an [orchestrator](https://kubernetes.io/docs/user-guide/node-selection/) might require you to know the `platformFaultDomain` and `platformUpdateDomain` the VM is running on.
You can also use [Availability Zones](../../availability-zones/az-overview.md) for the instances to make these decisions.
You can query this data directly via IMDS.

**Request**

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri "http://169.254.169.254/metadata/instance/compute/platformFaultDomain?api-version=2017-08-01&format=text"
```

**Response**

```text
0
```

### Sample 3: Get more information about the VM during support case

As a service provider, you might get a support call where you want to know more information about the VM. Asking the customer to share the compute metadata can be useful in this case.

**Request**

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri http://169.254.169.254/metadata/instance/compute?api-version=2020-09-01
```

**Response**

> [!NOTE]
> The response is a JSON string. The following example response is pretty-printed for readability.

```json
{
    "azEnvironment": "AZUREPUBLICCLOUD",
    "isHostCompatibilityLayerVm": "true",
    "licenseType":  "Windows_Client",
    "location": "westus",
    "name": "examplevmname",
    "offer": "Windows",
    "osProfile": {
        "adminUsername": "admin",
        "computerName": "examplevmname",
        "disablePasswordAuthentication": "true"
    },
    "osType": "linux",
    "placementGroupId": "f67c14ab-e92c-408c-ae2d-da15866ec79a",
    "plan": {
        "name": "planName",
        "product": "planProduct",
        "publisher": "planPublisher"
    },
    "platformFaultDomain": "36",
    "platformUpdateDomain": "42",
    "publicKeys": [{
            "keyData": "ssh-rsa 0",
            "path": "/home/user/.ssh/authorized_keys0"
        },
        {
            "keyData": "ssh-rsa 1",
            "path": "/home/user/.ssh/authorized_keys1"
        }
    ],
    "publisher": "RDFE-Test-Microsoft-Windows-Server-Group",
    "resourceGroupName": "macikgo-test-may-23",
    "resourceId": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/macikgo-test-may-23/providers/Microsoft.Compute/virtualMachines/examplevmname",
    "securityProfile": {
        "secureBootEnabled": "true",
        "virtualTpmEnabled": "false"
    },
    "sku": "Windows-Server-2012-R2-Datacenter",
    "storageProfile": {
        "dataDisks": [{
            "caching": "None",
            "createOption": "Empty",
            "diskSizeGB": "1024",
            "image": {
                "uri": ""
            },
            "lun": "0",
            "managedDisk": {
                "id": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/macikgo-test-may-23/providers/Microsoft.Compute/disks/exampledatadiskname",
                "storageAccountType": "Standard_LRS"
            },
            "name": "exampledatadiskname",
            "vhd": {
                "uri": ""
            },
            "writeAcceleratorEnabled": "false"
        }],
        "imageReference": {
            "id": "",
            "offer": "UbuntuServer",
            "publisher": "Canonical",
            "sku": "16.04.0-LTS",
            "version": "latest"
        },
        "osDisk": {
            "caching": "ReadWrite",
            "createOption": "FromImage",
            "diskSizeGB": "30",
            "diffDiskSettings": {
                "option": "Local"
            },
            "encryptionSettings": {
                "enabled": "false"
            },
            "image": {
                "uri": ""
            },
            "managedDisk": {
                "id": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/macikgo-test-may-23/providers/Microsoft.Compute/disks/exampleosdiskname",
                "storageAccountType": "Standard_LRS"
            },
            "name": "exampleosdiskname",
            "osType": "Linux",
            "vhd": {
                "uri": ""
            },
            "writeAcceleratorEnabled": "false"
        }
    },
    "subscriptionId": "xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx",
    "tags": "baz:bash;foo:bar",
    "version": "15.05.22",
    "vmId": "02aab8a4-74ef-476e-8182-f6d2ba4166a6",
    "vmScaleSetName": "crpteste9vflji9",
    "vmSize": "Standard_A3",
    "zone": ""
}
```

### Sample 4: Get the Azure environment where the VM is running

Azure has various sovereign clouds, like [Azure Government](https://azure.microsoft.com/overview/clouds/government/). Sometimes you need the Azure environment to make some runtime decisions. The following sample shows you how you can achieve this behavior.

**Request**

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri "http://169.254.169.254/metadata/instance/compute/azEnvironment?api-version=2018-10-01&format=text"
```

**Response**

```text
AzurePublicCloud
```

The cloud and the values of the Azure environment are listed here.

 Cloud   | Azure environment
---------|-----------------
[All generally available global Azure regions](https://azure.microsoft.com/regions/)     | AzurePublicCloud
[Azure Government](https://azure.microsoft.com/overview/clouds/government/)              | AzureUSGovernmentCloud
[Azure China 21Vianet](https://azure.microsoft.com/global-infrastructure/china/)         | AzureChinaCloud
[Azure Germany](https://azure.microsoft.com/overview/clouds/germany/)                    | AzureGermanCloud

## Network metadata 

Network metadata is part of the instance API. The following network categories are available through the `instance/network` endpoint.

Data | Description | Version introduced
-----|-------------|-----------------------
ipv4/privateIpAddress | The local IPv4 address of the VM. | 2017-04-02
ipv4/publicIpAddress | The public IPv4 address of the VM. | 2017-04-02
subnet/address | The subnet address of the VM. | 2017-04-02
subnet/prefix | The subnet prefix. Example: 24 | 2017-04-02
ipv6/ipAddress | The local IPv6 address of the VM. | 2017-04-02
macAddress | The VM mac address. | 2017-04-02

> [!NOTE]
> All API responses are JSON strings. All following example responses are pretty-printed for readability.

#### Sample 1: Retrieve network information

**Request**

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri http://169.254.169.254/metadata/instance/network?api-version=2017-08-01
```

**Response**

```json
{
  "interface": [
    {
      "ipv4": {
        "ipAddress": [
          {
            "privateIpAddress": "10.1.0.4",
            "publicIpAddress": "X.X.X.X"
          }
        ],
        "subnet": [
          {
            "address": "10.1.0.0",
            "prefix": "24"
          }
        ]
      },
      "ipv6": {
        "ipAddress": []
      },
      "macAddress": "000D3AF806EC"
    }
  ]
}

```

#### Sample 2: Retrieve public IP address

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri "http://169.254.169.254/metadata/instance/network/interface/0/ipv4/ipAddress/0/publicIpAddress?api-version=2017-08-01&format=text"
```

## Storage metadata

Storage metadata is part of the instance API, under the `instance/compute/storageProfile` endpoint.
It provides details about the storage disks associated with the VM. 

The storage profile of a VM is divided into three categories: image reference, operating system disk, and data disks.

The image reference object contains the following information about the operating system image:

Data    | Description
--------|-----------------
id      | Resource ID
offer   | Offer of the platform or image
publisher | Image publisher
sku     | Image SKU
version | Version of the platform or image

The operating system disk object contains the following information about the operating system disk used by the VM:

Data    | Description
--------|-----------------
caching | Caching requirements
createOption | Information about how the VM was created
diffDiskSettings | Ephemeral disk settings
diskSizeGB | Size of the disk in GB
encryptionSettings | Encryption settings for the disk
image   | Source user image virtual hard disk
managedDisk | Managed disk parameters
name    | Disk name
osType  | Type of operating system included in the disk
vhd     | Virtual hard disk
writeAcceleratorEnabled | Whether or not `writeAccelerator` is enabled on the disk

The data disks array contains a list of data disks attached to the VM. Each data disk object contains the following information:

Data    | Description
--------|-----------------
caching | Caching requirements
createOption | Information about how the VM was created
diffDiskSettings | Ephemeral disk settings
diskSizeGB | Size of the disk in GB
image   | Source user image virtual hard disk
lun     | Logical unit number of the disk
managedDisk | Managed disk parameters
name    | Disk name
vhd     | Virtual hard disk
writeAcceleratorEnabled | Whether or not `writeAccelerator` is enabled on the disk

The following example shows how to query the VM's storage information.

**Request**

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri http://169.254.169.254/metadata/instance/compute/storageProfile?api-version=2019-06-01
```

**Response**

> [!NOTE]
> The response is a JSON string. The following example response is pretty-printed for readability.

```json
{
    "dataDisks": [
      {
        "caching": "None",
        "createOption": "Empty",
        "diskSizeGB": "1024",
        "image": {
          "uri": ""
        },
        "lun": "0",
        "managedDisk": {
          "id": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/macikgo-test-may-23/providers/Microsoft.Compute/disks/exampledatadiskname",
          "storageAccountType": "Standard_LRS"
        },
        "name": "exampledatadiskname",
        "vhd": {
          "uri": ""
        },
        "writeAcceleratorEnabled": "false"
      }
    ],
    "imageReference": {
      "id": "",
      "offer": "UbuntuServer",
      "publisher": "Canonical",
      "sku": "16.04.0-LTS",
      "version": "latest"
    },
    "osDisk": {
      "caching": "ReadWrite",
      "createOption": "FromImage",
      "diskSizeGB": "30",
      "diffDiskSettings": {
        "option": "Local"
      },
      "encryptionSettings": {
        "enabled": "false"
      },
      "image": {
        "uri": ""
      },
      "managedDisk": {
        "id": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/macikgo-test-may-23/providers/Microsoft.Compute/disks/exampleosdiskname",
        "storageAccountType": "Standard_LRS"
      },
      "name": "exampleosdiskname",
      "osType": "Linux",
      "vhd": {
        "uri": ""
      },
      "writeAcceleratorEnabled": "false"
    }
}
```

## VM tags

VM tags are included the instance API, under the `instance/compute/tags` endpoint.
Tags might have been applied to your Azure VM to logically organize them into a taxonomy. You can retrieve the tags assigned to a VM by using the following request.

**Request**

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri "http://169.254.169.254/metadata/instance/compute/tags?api-version=2018-10-01&format=text"
```

**Response**

```text
Department:IT;Environment:Test;Role:WebRole
```

The `tags` field is a string with the tags delimited by semicolons. This output can be a problem if semicolons are used in the tags themselves. If a parser is written to programmatically extract the tags, you should rely on the `tagsList` field. The `tagsList` field is a JSON array with no delimiters, and consequently it's easier to parse.

**Request**

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri http://169.254.169.254/metadata/instance/compute/tagsList?api-version=2019-06-04
```

**Response**

```json
[
  {
    "name": "Department",
    "value": "IT"
  },
  {
    "name": "Environment",
    "value": "Test"
  },
  {
    "name": "Role",
    "value": "WebRole"
  }
]
```

## Attested data

IMDS helps to provide guarantees that the data provided is coming from Azure. Microsoft signs part of this information, so you can confirm that an image in Azure Marketplace is the one you are running on Azure.

### Sample 1: Get attested data

> [!NOTE]
> All API responses are JSON strings. The following example responses are pretty-printed for readability.

**Request**

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri "http://169.254.169.254/metadata/attested/document?api-version=2018-10-01&nonce=1234567890"
```

> [!NOTE]
> Due to IMDS's caching mechanism, a previously cached `nonce` value might be returned.

`Api-version` is a mandatory field. Refer to the [usage section](#usage) for supported API versions.
`Nonce` is an optional, 10-digit string. If it's not provided, IMDS returns the current Coordinated Universal Time timestamp in its place.

**Response**

```json
{
 "encoding":"pkcs7","signature":"MIIEEgYJKoZIhvcNAQcCoIIEAzCCA/8CAQExDzANBgkqhkiG9w0BAQsFADCBugYJKoZIhvcNAQcBoIGsBIGpeyJub25jZSI6IjEyMzQ1NjY3NjYiLCJwbGFuIjp7Im5hbWUiOiIiLCJwcm9kdWN0IjoiIiwicHVibGlzaGVyIjoiIn0sInRpbWVTdGFtcCI6eyJjcmVhdGVkT24iOiIxMS8yMC8xOCAyMjowNzozOSAtMDAwMCIsImV4cGlyZXNPbiI6IjExLzIwLzE4IDIyOjA4OjI0IC0wMDAwIn0sInZtSWQiOiIifaCCAj8wggI7MIIBpKADAgECAhBnxW5Kh8dslEBA0E2mIBJ0MA0GCSqGSIb3DQEBBAUAMCsxKTAnBgNVBAMTIHRlc3RzdWJkb21haW4ubWV0YWRhdGEuYXp1cmUuY29tMB4XDTE4MTEyMDIxNTc1N1oXDTE4MTIyMDIxNTc1NlowKzEpMCcGA1UEAxMgdGVzdHN1YmRvbWFpbi5tZXRhZGF0YS5henVyZS5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAML/tBo86ENWPzmXZ0kPkX5dY5QZ150mA8lommszE71x2sCLonzv4/UWk4H+jMMWRRwIea2CuQ5RhdWAHvKq6if4okKNt66fxm+YTVz9z0CTfCLmLT+nsdfOAsG1xZppEapC0Cd9vD6NCKyE8aYI1pliaeOnFjG0WvMY04uWz2MdAgMBAAGjYDBeMFwGA1UdAQRVMFOAENnYkHLa04Ut4Mpt7TkJFfyhLTArMSkwJwYDVQQDEyB0ZXN0c3ViZG9tYWluLm1ldGFkYXRhLmF6dXJlLmNvbYIQZ8VuSofHbJRAQNBNpiASdDANBgkqhkiG9w0BAQQFAAOBgQCLSM6aX5Bs1KHCJp4VQtxZPzXF71rVKCocHy3N9PTJQ9Fpnd+bYw2vSpQHg/AiG82WuDFpPReJvr7Pa938mZqW9HUOGjQKK2FYDTg6fXD8pkPdyghlX5boGWAMMrf7bFkup+lsT+n2tRw2wbNknO1tQ0wICtqy2VqzWwLi45RBwTGB6DCB5QIBATA/MCsxKTAnBgNVBAMTIHRlc3RzdWJkb21haW4ubWV0YWRhdGEuYXp1cmUuY29tAhBnxW5Kh8dslEBA0E2mIBJ0MA0GCSqGSIb3DQEBCwUAMA0GCSqGSIb3DQEBAQUABIGAld1BM/yYIqqv8SDE4kjQo3Ul/IKAVR8ETKcve5BAdGSNkTUooUGVniTXeuvDj5NkmazOaKZp9fEtByqqPOyw/nlXaZgOO44HDGiPUJ90xVYmfeK6p9RpJBu6kiKhnnYTelUk5u75phe5ZbMZfBhuPhXmYAdjc7Nmw97nx8NnprQ="
}
```

The signature blob is a [pkcs7](https://aka.ms/pkcs7)-signed version of the document. It contains the certificate used for signing, along with certain VM-specific details. 

For VMs created by using Azure Resource Manager, this includes `vmId`, `sku`, `nonce`, `subscriptionId`, `timeStamp` for creation and expiry of the document, and the plan information about the image. The plan information is only populated for Azure Marketplace images. 

For VMs created by using the classic deployment model, only `vmId` is guaranteed to be populated. You can extract the certificate from the response, and use it to confirm that the response is valid and is coming from Azure.

The document contains the following fields:

Data | Description | Version introduced
-----|-------------|-----------------------
licenseType | Type of license for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit). Note that this is only present for AHB-enabled VMs. | 2020-09-01
nonce | A string that can be optionally provided with the request. If no `nonce` was supplied, the current Coordinated Universal Time timestamp is used. | 2018-10-01
plan | The [Azure Marketplace Image plan](/rest/api/compute/virtualmachines/createorupdate#plan). Contains the plan ID (name), product image or offer (product), and publisher ID (publisher). | 2018-10-01
timestamp/createdOn | The Coordinated Universal Time timestamp for when the signed document was created. | 2018-20-01
timestamp/expiresOn | The Coordinated Universal Time timestamp for when the signed document expires. | 2018-10-01
vmId |  [Unique identifier](https://azure.microsoft.com/blog/accessing-and-using-azure-vm-unique-id/) for the VM. | 2018-10-01
subscriptionId | The Azure subscription for the VM. | 2019-04-30
sku | The specific SKU for the VM image. | 2019-11-01

### Sample 2: Validate that the VM is running in Azure

Vendors in Azure Marketplace want to ensure that their software is licensed to run only in Azure. If someone copies the VHD to an on-premises environment, the vendor needs to be able to detect that. Through IMDS, these vendors can get signed data that guarantees response only from Azure.

```powershell
# Get the signature
$attestedDoc = Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri http://169.254.169.254/metadata/attested/document?api-version=2020-09-01
# Decode the signature
$signature = [System.Convert]::FromBase64String($attestedDoc.signature)
```

Verify that the signature is from Microsoft Azure and check the certificate chain for errors.

```powershell
# Get certificate chain
$cert = [System.Security.Cryptography.X509Certificates.X509Certificate2]($signature)
$chain = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Chain
$chain.Build($cert)
# Print the Subject of each certificate in the chain
foreach($element in $chain.ChainElements)
{
    Write-Host $element.Certificate.Subject
}

# Get the content of the signed document
Add-Type -AssemblyName System.Security
$signedCms = New-Object -TypeName System.Security.Cryptography.Pkcs.SignedCms
$signedCms.Decode($signature);
$content = [System.Text.Encoding]::UTF8.GetString($signedCms.ContentInfo.Content)
Write-Host "Attested data: " $content
$json = $content | ConvertFrom-Json
# Do additional validation here
```

> [!NOTE]
> Due to IMDS's caching mechanism, a previously cached `nonce` value might be returned.

The `nonce` in the signed document can be compared if you provided a `nonce` parameter in the initial request.

> [!NOTE]
> The certificate for the public cloud and each sovereign cloud will be different.

Cloud | Certificate
------|------------
[All generally available global Azure regions](https://azure.microsoft.com/regions/) | *.metadata.azure.com
[Azure Government](https://azure.microsoft.com/overview/clouds/government/)          | *.metadata.azure.us
[Azure China 21Vianet](https://azure.microsoft.com/global-infrastructure/china/)     | *.metadata.azure.cn
[Azure Germany](https://azure.microsoft.com/overview/clouds/germany/)                | *.metadata.microsoftazure.de

> [!NOTE]
> The certificates might not have an exact match of `metadata.azure.com` for the public cloud. For this reason, the certification validation should allow a common name from any `.metadata.azure.com` subdomain.

In cases where the intermediate certificate can't be downloaded due to network constraints during validation, you can pin the intermediate certificate. Note that Azure rolls over the certificates, which is standard PKI practice. You need to update the pinned certificates when rollover happens. Whenever a change to update the intermediate certificate is planned, the Azure blog is updated, and Azure customers are notified. 

You can find the intermediate certificates in the [PKI repository](https://www.microsoft.com/pki/mscorp/cps/default.htm). The intermediate certificates for each of the regions can be different.

> [!NOTE]
> The intermediate certificate for Azure China 21Vianet is from DigiCert Global Root CA, instead of Baltimore.
If you pinned the intermediate certificates for Azure China as part of a root chain authority change, the intermediate certificates must be updated.

## Failover clustering in Windows Server

When you're querying IMDS with failover clustering, it's sometimes necessary to add a route to the routing table. Here's how:

1. Open a command prompt with administrator privileges.

1. Run the following command, and note the address of the Interface for Network Destination (`0.0.0.0`) in the IPv4 Route Table.

```bat
route print
```

> [!NOTE]
> The following example output is from a Windows Server VM with failover cluster enabled. For simplicity, the output contains only the IPv4 Route Table.

```text
IPv4 Route Table
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0         10.0.1.1        10.0.1.10    266
         10.0.1.0  255.255.255.192         On-link         10.0.1.10    266
        10.0.1.10  255.255.255.255         On-link         10.0.1.10    266
        10.0.1.15  255.255.255.255         On-link         10.0.1.10    266
        10.0.1.63  255.255.255.255         On-link         10.0.1.10    266
        127.0.0.0        255.0.0.0         On-link         127.0.0.1    331
        127.0.0.1  255.255.255.255         On-link         127.0.0.1    331
  127.255.255.255  255.255.255.255         On-link         127.0.0.1    331
      169.254.0.0      255.255.0.0         On-link     169.254.1.156    271
    169.254.1.156  255.255.255.255         On-link     169.254.1.156    271
  169.254.255.255  255.255.255.255         On-link     169.254.1.156    271
        224.0.0.0        240.0.0.0         On-link         127.0.0.1    331
        224.0.0.0        240.0.0.0         On-link     169.254.1.156    271
  255.255.255.255  255.255.255.255         On-link         127.0.0.1    331
  255.255.255.255  255.255.255.255         On-link     169.254.1.156    271
  255.255.255.255  255.255.255.255         On-link         10.0.1.10    266
```

Run the following command and use the address of the Interface for Network Destination (`0.0.0.0`), which is (`10.0.1.10`) in this example.

```bat
route add 169.254.169.254/32 10.0.1.10 metric 1 -p
```

## Managed identity

A managed identity, assigned by the system, can be enabled on the VM. You can also assign one or more user-assigned managed identities to the VM.
You can then request tokens for managed identities from IMDS. Use these tokens to authenticate with other Azure services, such as Azure Key Vault.

For detailed steps to enable this feature, see [Acquire an access token](../../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md).

## Scheduled events
You can obtain the status of the scheduled events by using IMDS. Then the user can specify a set of actions to run upon these events. For more information, see [Scheduled events](scheduled-events.md). 

## Regional availability

The service is generally available in all Azure clouds.

## Sample code in different languages

The following table lists samples of calling IMDS by using different languages inside the VM:

Language      | Example
--------------|----------------
C++ (Windows) | https://github.com/Microsoft/azureimds/blob/master/IMDSSample-windows.cpp
C#            | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.cs
Go            | https://github.com/Microsoft/azureimds/blob/master/imdssample.go
Java          | https://github.com/Microsoft/azureimds/blob/master/imdssample.java
NodeJS        | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.js
Perl          | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.pl
PowerShell    | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.ps1
Puppet        | https://github.com/keirans/azuremetadata
Python        | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.py
Ruby          | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.rb
Visual Basic  | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.vb

## Errors and debugging

If there's a data element not found or a malformed request, IMDS returns standard HTTP errors. For example:

HTTP status code | Reason
-----------------|-------
200 OK |
400 Bad Request | Missing `Metadata: true` header, or missing parameter `format=json` when querying a leaf node.
404 Not Found  | The requested element doesn't exist.
405 Method Not Allowed | Only `GET` requests are supported.
410 Gone | Retry after some time for a maximum of 70 seconds.
429 Too Many Requests | The API currently supports a maximum of 5 queries per second.
500 Service Error     | Retry after some time.

### Frequently asked questions

**I am getting the error `400 Bad Request, Required metadata header not specified`. What does this mean?**

IMDS requires the header `Metadata: true` to be passed in the request. Passing this header in the REST call allows access to IMDS.

**Why am I not getting compute information for my VM?**

Currently, IMDS only supports instances created with Azure Resource Manager.

**I created my VM through Azure Resource Manager some time ago. Why am I not seeing compute metadata information?**

If you created your VM after September 2016, add a [tag](../../azure-resource-manager/management/tag-resources.md) to start seeing compute metadata. If you created your VM before September 2016, add or remove extensions or data disks to the VM instance to refresh metadata.

**Why am I not seeing all data populated for a new version?**

If you created your VM after September 2016, add a [tag](../../azure-resource-manager/management/tag-resources.md) to start seeing compute metadata. If you created your VM before September 2016, add or remove extensions or data disks to the VM instance to refresh metadata.

**Why am I getting the error `500 Internal Server Error` or `410 Resource Gone`?**

Retry your request. For more information, see [Transient fault handling](/azure/architecture/best-practices/transient-faults). If the problem persists, create a support issue in the Azure portal for the VM.

**Would this work for virtual machine scale set instances?**

Yes, IMDS is available for virtual machine scale set instances.

**I updated my tags in virtual machine scale sets, but they don't appear in the instances (unlike single instance VMs). Am I doing something wrong?**

Currently tags for virtual machine scale sets only show to the VM on a reboot, reimage, or disk change to the instance.

**Why is my request timed out for my call to the service?**

Metadata calls must be made from the primary IP address assigned to the primary network card of the VM. Additionally, if you've changed your routes, there must be a route for the 169.254.169.254/32 address in your VM's local routing table.
   * <details>
        <summary>Verifying your routing table</summary>

        1. Dump your local routing table and look for the IMDS entry. For example:
            ```console
            > route print
            IPv4 Route Table
            ===========================================================================
            Active Routes:
            Network Destination        Netmask          Gateway       Interface  Metric
                      0.0.0.0          0.0.0.0      172.16.69.1      172.16.69.7     10
                    127.0.0.0        255.0.0.0         On-link         127.0.0.1    331
                    127.0.0.1  255.255.255.255         On-link         127.0.0.1    331
              127.255.255.255  255.255.255.255         On-link         127.0.0.1    331
                168.63.129.16  255.255.255.255      172.16.69.1      172.16.69.7     11
              169.254.169.254  255.255.255.255      172.16.69.1      172.16.69.7     11
            ... (continues) ...
            ```
        1. Verify that a route exists for `169.254.169.254`, and note the corresponding network interface (for example, `172.16.69.7`).
        1. Dump the interface configuration and find the interface that corresponds to the one referenced in the routing table, noting the MAC (physical) address.
            ```console
            > ipconfig /all
            ... (continues) ...
            Ethernet adapter Ethernet:

               Connection-specific DNS Suffix  . : xic3mnxjiefupcwr1mcs1rjiqa.cx.internal.cloudapp.net
               Description . . . . . . . . . . . : Microsoft Hyper-V Network Adapter
               Physical Address. . . . . . . . . : 00-0D-3A-E5-1C-C0
               DHCP Enabled. . . . . . . . . . . : Yes
               Autoconfiguration Enabled . . . . : Yes
               Link-local IPv6 Address . . . . . : fe80::3166:ce5a:2bd5:a6d1%3(Preferred)
               IPv4 Address. . . . . . . . . . . : 172.16.69.7(Preferred)
               Subnet Mask . . . . . . . . . . . : 255.255.255.0
            ... (continues) ...
            ```
        1. Confirm that the interface corresponds to the VM's primary NIC and primary IP. You can find the primary NIC and IP by looking at the network configuration in the Azure portal, or by looking it up with the Azure CLI. Note the public and private IPs (and the MAC address if you're using the CLI). Here's a PowerShell CLI example:
            ```powershell
            $ResourceGroup = '<Resource_Group>'
            $VmName = '<VM_Name>'
            $NicNames = az vm nic list --resource-group $ResourceGroup --vm-name $VmName | ConvertFrom-Json | Foreach-Object { $_.id.Split('/')[-1] }
            foreach($NicName in $NicNames)
            {
                $Nic = az vm nic show --resource-group $ResourceGroup --vm-name $VmName --nic $NicName | ConvertFrom-Json
                Write-Host $NicName, $Nic.primary, $Nic.macAddress
            }
            # Output: wintest767 True 00-0D-3A-E5-1C-C0
            ```
        1. If they don't match, update the routing table so that the primary NIC and IP are targeted.
    </details>

## Support

If you aren't able to get a metadata response after multiple attempts, you can create a support issue in the Azure portal.
For **Problem Type**, select **Management**. For **Category**, select **Instance Metadata Service**.

![Screenshot of Instance Metadata Service support](./media/instance-metadata-service/InstanceMetadata-support.png)

## Next steps

[Acquire an access token for the VM](../../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md)

[Scheduled events](scheduled-events.md)
