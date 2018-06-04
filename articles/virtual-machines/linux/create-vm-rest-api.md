---
title: Reviewing Security Center policy compliance with Azure REST API | Microsoft Docs
description: Learn how to use Azure REST APIs to review current compliance with Security Center policies.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/04/2018
ms.author: iainfou

---

# Create a Linux virtual machine that uses SSH authentication with the REST APIs

To create or update a virtual machine:

``` http
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM?api-version=2017-12-01
Content-Type: application/json
Authorization: Bearer
```

## URI parameters

The following parameters are required as part of the PUT operation:

| Name                | In    | Required | Type   | Description |
|---------------------|-------|----------|--------|-------------|
| *subscriptionId*    | path  | True     | string | Subscription credentials that uniquely identify Microsoft Azure subscription. The subscription ID forms part of the URI for every service call. |
| *resourceGroupName* | path  | True     | string | The name of the resource group. |
| *vmName*            | path  | True     | string | The name of the virtual machine. |
| *api-version*       | query | True     | string | Client API Version. |

## Request body

The following common definitions are used to build a request body:

| Name                       | Required | Type                                                                                | Description  |
|----------------------------|----------|-------------------------------------------------------------------------------------|--------------|
| location                   | True     | string                                                                              | Resource location |
| name                       |          | string                                                                              | Name for the virtual machine. |
| properties.hardwareProfile |          | [HardwareProfile](/rest/api/compute/virtualmachines/createorupdate#hardwareprofile) | Specifies the hardware settings for the virtual machine. |
| properties.storageProfile  |          | [StorageProfile](/rest/api/compute/virtualmachines/createorupdate#storageprofile)   | Specifies the storage settings for the virtual machine disks. |
| properties.osProfile       |          | [OSProfile](/rest/api/compute/virtualmachines/createorupdate#osprofile)             | Specifies the operating system settings for the virtual machine. |
| properties.networkProfile  |          | [NetworkProfile](/rest/api/compute/virtualmachines/createorupdate#networkprofile)   | Specifies the network interfaces of the virtual machine. |

For a complete list of the available definitions in the request body, see [Virtual machines create or update request body defintions](/rest/api/compute/virtualmachines/createorupdate#definitions)

## Responses

| Name        | Type                                                                              | Description |
|-------------|-----------------------------------------------------------------------------------|-------------|
| 200 OK      | [VirtualMachine](/rest/api/compute/virtualmachines/createorupdate#virtualmachine) | OK          |
| 201 Created | [VirtualMachine](/rest/api/compute/virtualmachines/createorupdate#virtualmachine) | Created     |

## Build a request

The `{subscription-id}` parameter is required. If you have multiple subscriptions, see [Working with multiple subscriptions](https://docs.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli?view=azure-cli-latest#working-with-multiple-subscriptions).

The `api-version` parameter is required. This example uses `api-version=2017-12-01`.

The following headers are required:

|Request header|Description|
|--------------------|-----------------|
|*Content-Type:*|Required. Set to `application/json`.|
|*Authorization:*|Required. Set to a valid `Bearer` [access token](https://docs.microsoft.com/rest/api/azure/#authorization-code-grant-interactive-clients). |

### Example request body

The following example request body defines an Ubuntu 16.04-LTS image that uses Premium managed disks. SSH public key authentication is used, and the VM uses an existing virtual network interface card (NIC):

```json
{
  "location": "eastus",
  "properties": {
    "hardwareProfile": {
      "vmSize": "Standard_DS1_v2"
    },
    "storageProfile": {
      "imageReference": {
        "sku": "16.04-LTS",
        "publisher": "Canonical",
        "version": "latest",
        "offer": "UbuntuServer"
      },
      "osDisk": {
        "caching": "ReadWrite",
        "managedDisk": {
          "storageAccountType": "Premium_LRS"
        },
        "name": "myVMosdisk",
        "createOption": "FromImage"
      }
    },
    "osProfile": {
      "adminUsername": "{your-username}",
      "computerName": "myVM",
      "linuxConfiguration": {
        "ssh": {
          "publicKeys": [
            {
              "path": "/home/{your-username}/.ssh/authorized_keys",
              "keyData": "ssh-rsa AAAAB3NzaC1{snip}mf69/J1"
            }
          ]
        },
        "disablePasswordAuthentication": true
      }
    },
    "networkProfile": {
      "networkInterfaces": [
        {
          "id": "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
          "properties": {
            "primary": true
          }
        }
      ]
    }
  },
  "name": "myVM"
}
```

## Example response

Status code: 200

```json
{
  "id": "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "type": "Microsoft.Compute/virtualMachines",
  "properties": {
    "hardwareProfile": {
      "vmSize": "Standard_DS1_v2"
    },
    "storageProfile": {
      "imageReference": {
        "sku": "16.04-LTS",
        "publisher": "Canonical",
        "version": "latest",
        "offer": "UbuntuServer"
      },
      "osDisk": {
        "osType": "Linux",
        "caching": "ReadWrite",
        "managedDisk": {
          "storageAccountType": "Premium_LRS"
        },
        "name": "myVMosdisk",
        "createOption": "FromImage"
      },
      "dataDisks": []
    },
    "osProfile": {
      "adminUsername": "azureuser",
      "secrets": [],
      "computerName": "myVM",
      "linuxConfiguration": {
        "ssh": {
          "publicKeys": [
            {
              "path": "/home/azureuser/.ssh/authorized_keys",
              "keyData": "ssh-rsa AAAAB3NzaC1{snip}mf69/J1"
            }
          ]
        },
        "disablePasswordAuthentication": true
      }
    },
    "networkProfile": {
      "networkInterfaces": [
        {
          "id": "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myNic",
          "properties": {
            "primary": true
          }
        }
      ]
    },
    "vmId": "e0de9b84-a506-4b95-9623-00a425d05c90",
    "provisioningState": "Creating"
  },
  "name": "myVM",
  "location": "eastus"
}
```

## See also

- [Azure Compute provider REST API](/rest/api/compute/)
- [Get started with Azure REST API](/rest/api/azure/)
- [Azure PowerShell module](/powershell/azure/overview)