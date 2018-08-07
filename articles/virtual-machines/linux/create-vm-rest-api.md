---
title: Create a Linux virtual machine with the Azure REST API | Microsoft Docs
description: Learn how to create a Linux virtual machine in Azure that uses Managed Disks and SSH authentication with Azure REST API.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/05/2018
ms.author: cynthn

---

# Create a Linux virtual machine that uses SSH authentication with the REST API

A virtual machine (VM) in Azure is defined by various parameters such as location, hardware size, operating system image, and logon credentials. This article shows you how to use the REST API to create a Linux virtual machine that uses SSH authentication.

To create or update a virtual machine, use the following *PUT* operation:

``` http
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2017-12-01
```

## Create a request

To create the *PUT* request, the `{subscription-id}` parameter is required. If you have multiple subscriptions, see [Working with multiple subscriptions](/cli/azure/manage-azure-subscriptions-azure-cli?view=azure-cli-latest#working-with-multiple-subscriptions). You define a `{resourceGroupName}` and `{vmName}` for your resources, along with the `api-version` parameter. This article uses `api-version=2017-12-01`.

The following headers are required:

| Request header   | Description |
|------------------|-----------------|
| *Content-Type:*  | Required. Set to `application/json`. |
| *Authorization:* | Required. Set to a valid `Bearer` [access token](https://docs.microsoft.com/rest/api/azure/#authorization-code-grant-interactive-clients). |

For more information about how to create the request, see [Components of a REST API request/response](/rest/api/azure/#components-of-a-rest-api-requestresponse).

## Create the request body

The following common definitions are used to build a request body:

| Name                       | Required | Type                                                                                | Description  |
|----------------------------|----------|-------------------------------------------------------------------------------------|--------------|
| location                   | True     | string                                                                              | Resource location. |
| name                       |          | string                                                                              | Name for the virtual machine. |
| properties.hardwareProfile |          | [HardwareProfile](/rest/api/compute/virtualmachines/createorupdate#hardwareprofile) | Specifies the hardware settings for the virtual machine. |
| properties.storageProfile  |          | [StorageProfile](/rest/api/compute/virtualmachines/createorupdate#storageprofile)   | Specifies the storage settings for the virtual machine disks. |
| properties.osProfile       |          | [OSProfile](/rest/api/compute/virtualmachines/createorupdate#osprofile)             | Specifies the operating system settings for the virtual machine. |
| properties.networkProfile  |          | [NetworkProfile](/rest/api/compute/virtualmachines/createorupdate#networkprofile)   | Specifies the network interfaces of the virtual machine. |

For a complete list of the available definitions in the request body, see [Virtual machines create or update request body defintions](/rest/api/compute/virtualmachines/createorupdate#definitions).

### Example request body

The following example request body defines an Ubuntu 18.04-LTS image that uses Premium managed disks. SSH public key authentication is used, and the VM uses an existing virtual network interface card (NIC) that you have [previously created](../../virtual-network/virtual-network-network-interface.md). Provide your SSH public key in the *osProfile.linuxConfiguration.ssh.publicKeys.keyData* field. If needed, you can [generate an SSH key pair](mac-create-ssh-keys.md).

```json
{
  "location": "eastus",
  "properties": {
    "hardwareProfile": {
      "vmSize": "Standard_DS1_v2"
    },
    "storageProfile": {
      "imageReference": {
        "sku": "18.04-LTS",
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

## Responses

There are two successful responses for the operation to create or update a virtual machine:

| Name        | Type                                                                              | Description |
|-------------|-----------------------------------------------------------------------------------|-------------|
| 200 OK      | [VirtualMachine](/rest/api/compute/virtualmachines/createorupdate#virtualmachine) | OK          |
| 201 Created | [VirtualMachine](/rest/api/compute/virtualmachines/createorupdate#virtualmachine) | Created     |

For more information about REST API responses, see [Process the response message](/rest/api/azure/#process-the-response-message).

### Example response

A condensed *201 Created* response from the previous example request body that creates a VM shows a *vmId* has been assigned and the *provisioningState* is *Creating*:

```json
{
    "vmId": "e0de9b84-a506-4b95-9623-00a425d05c90",
    "provisioningState": "Creating"
}
```

## Next steps

For more information on the Azure REST APIs or other management tools such as Azure CLI 2.0 or Azure PowerShell, see the following:

- [Azure Compute provider REST API](/rest/api/compute/)
- [Get started with Azure REST API](/rest/api/azure/)
- [Azure CLI 2.0](/cli/azure/)
- [Azure PowerShell module](/powershell/azure/overview)
