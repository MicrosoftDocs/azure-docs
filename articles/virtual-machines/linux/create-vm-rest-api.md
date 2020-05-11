---
title: Create a Linux VM with the REST API 
description: Learn how to create a Linux virtual machine in Azure that uses Managed Disks and SSH authentication with Azure REST API.
author: cynthn
ms.service: virtual-machines-linux
ms.topic: article
ms.date: 06/05/2018
ms.author: cynthn

---

# Create a Linux virtual machine that uses SSH authentication with the REST API

A Linux virtual machine (VM) in Azure consists of various resources such as disks and network interfaces and defines parameters such as location, size and operating system image and authentication settings.

You can create a Linux VM via the Azure portal, Azure CLI 2.0, many Azure SDKs, Azure Resource Manager templates and many third-party tools such as Ansible or Terraform. All these tools ultimately use the REST API to create the Linux VM.

This article shows you how to use the REST API to create a Linux VM running Ubuntu 18.04-LTS with managed disks and SSH authentication.

## Before you start

Before you create and submit the request, you will need:

* The `{subscription-id}` for your subscription
  * If you have multiple subscriptions, see [Working with multiple subscriptions](/cli/azure/manage-azure-subscriptions-azure-cli?view=azure-cli-latest)
* A `{resourceGroupName}` you've created ahead of time
* A [virtual network interface](../../virtual-network/virtual-network-network-interface.md) in the same resource group
* An SSH key pair (you can [generate a new one](mac-create-ssh-keys.md) if you don't have one)

## Request basics

To create or update a virtual machine, use the following *PUT* operation:

``` http
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2017-12-01
```

In addition to the `{subscription-id}` and `{resourceGroupName}` parameters, you'll need to specify the `{vmName}` (`api-version` is optional, but this article was tested with `api-version=2017-12-01`)

The following headers are required:

| Request header   | Description |
|------------------|-----------------|
| *Content-Type:*  | Required. Set to `application/json`. |
| *Authorization:* | Required. Set to a valid `Bearer` [access token](https://docs.microsoft.com/rest/api/azure/#authorization-code-grant-interactive-clients). |

For general information about working with REST API requests, see [Components of a REST API request/response](/rest/api/azure/#components-of-a-rest-api-requestresponse).

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

An example request body is below. Make sure you specify the VM name in the `{computerName}` and `{name}` parameters, the name of the network interface you've created under `networkInterfaces`, your username in `adminUsername` and `path`, and the *public* portion of your SSH keypair (located in, for example, `~/.ssh/id_rsa.pub`) in `keyData`. Other parameters you might want to modify include `location` and `vmSize`.  

```json
{
  "location": "eastus",
  "name": "{vmName}",
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
      "computerName": "{vmName}",
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
          "id": "/subscriptions/{subscription-id}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
          "properties": {
            "primary": true
          }
        }
      ]
    }
  }
}
```

For a complete list of the available definitions in the request body, see [Virtual machines create or update request body definitions](/rest/api/compute/virtualmachines/createorupdate#definitions).

## Sending the request

You may use the client of your preference for sending this HTTP request. You may also use an [in-browser tool](https://docs.microsoft.com/rest/api/compute/virtualmachines/createorupdate) by clicking the **Try it** button.

### Responses

There are two successful responses for the operation to create or update a virtual machine:

| Name        | Type                                                                              | Description |
|-------------|-----------------------------------------------------------------------------------|-------------|
| 200 OK      | [VirtualMachine](/rest/api/compute/virtualmachines/createorupdate#virtualmachine) | OK          |
| 201 Created | [VirtualMachine](/rest/api/compute/virtualmachines/createorupdate#virtualmachine) | Created     |

A condensed *201 Created* response from the previous example request body that creates a VM shows a *vmId* has been assigned and the *provisioningState* is *Creating*:

```json
{
    "vmId": "e0de9b84-a506-4b95-9623-00a425d05c90",
    "provisioningState": "Creating"
}
```

For more information about REST API responses, see [Process the response message](/rest/api/azure/#process-the-response-message).

## Next steps

For more information on the Azure REST APIs or other management tools such as Azure CLI or Azure PowerShell, see the following:

- [Azure Compute provider REST API](/rest/api/compute/)
- [Get started with Azure REST API](/rest/api/azure/)
- [Azure CLI](/cli/azure/)
- [Azure PowerShell module](/powershell/azure/overview)
