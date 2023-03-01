---
title: User data for Azure Virtual Machine
description: Allow customer to insert script or other metadata into an Azure virtual machine at provision time.
services: virtual-machines-linux
author: ningk
manager: rogardle
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 02/28/2023
ms.author: ningk
ms.reviewer: azmetadata, mattmcinnes
---

# User Data for Azure Virtual Machine 

User data allows you to pass your own scripts or metadata to your virtual machine.

## What is "user data"

User data is a set of scripts or other metadata that's inserted to an Azure virtual machine at provision time. Any application on the virtual machine can access the user data from the Azure Instance Metadata Service (IMDS) after provision. 

User data is a new version of [custom data](./custom-data.md)  and it offers added benefits:

* User data can be retrieved from Azure Instance Metadata Service(IMDS) after provision.

* User data is persistent. It will be available during the lifetime of the VM.

* User data can be updated from outside the VM, without stopping or rebooting the VM.

* User data can be queried via GET VM/VMSS API with $expand option.

 In addition, if user data isn't added at provision time, you can still add it after provision.

**Security warning**

> [!WARNING]
> User data will not be encrypted, and any process on the VM can query this data. You should not store confidential information in user data.

Make sure you get the latest Azure Resource Manager API to use the new user data features. The contents should be base64 encoded before passed to the API. The size can't exceed 64 KB.

## Create user data for Azure VM/VMSS

**Adding user data when creating new VM**

Use [this Azure Resource Manager template](https://aka.ms/ImdsUserDataArmTemplate) to create a new VM with user data.
If you're using rest API, for single VMs, add 'UserData' to the "properties" section with the PUT request to create the VM.

```json
{
  "name": "testVM",
  "location": "West US",
  "properties": {
    "hardwareProfile": {
      "vmSize": "Standard_A1"
    },
    "storageProfile": {
      "osDisk": {
        "osType": "Windows",
        "name": "osDisk",
        "createOption": "Attach",
        "vhd": {
          "uri": "http://myaccount.blob.core.windows.net/container/directory/blob.vhd"
        }
      }
    },
    "userData": "c2FtcGxlIHVzZXJEYXRh",
    "networkProfile": { "networkInterfaces" : [ { "name" : "nic1" } ] },
  }
}
```

**Adding user data when you create new Virtual Machine Scale Set**

Using rest API, add 'UserData' to the "virtualMachineProfile" section with the PUT request when creating the Virtual Machine Scale Set.
```json
{
  "location": "West US",
  "sku": {
    "name": "Standard_A1",
    "capacity": 1
  },
  "properties": {
    "upgradePolicy": {
      "mode": "Automatic"
    },
    "virtualMachineProfile": {
      "userData": "VXNlckRhdGE=",
      "osProfile": {
        "computerNamePrefix": "TestVM",
        "adminUsername": "TestUserName",
        "windowsConfiguration": {
          "provisionVMAgent": true,
          "timeZone": "Dateline Standard Time"
        }
      },
      "storageProfile": {
        "osDisk": {
          "createOption": "FromImage",
          "caching": "ReadOnly"
        },
        "imageReference": {
          "publisher": "publisher",
          "offer": "offer",
          "sku": "sku",
          "version": "1.2.3"
        }
      },
      "networkProfile": {"networkInterfaceConfigurations":[{"name":"nicconfig1","properties":{"ipConfigurations":[{"name":"ip1","properties":{"subnet":{"id":"vmssSubnet0"}}}]}}]},
      "diagnosticsProfile": {
        "bootDiagnostics": {
          "enabled": true,
          "storageUri": "https://crputest.blob.core.windows.net"
        }
      }
    },
    "provisioningState": 0,
    "overprovision": false,
    "uniqueId": "00000000-0000-0000-0000-000000000000"
  }
}
```


## Retrieving user data

Applications running inside the VM can retrieve user data from IMDS endpoint. For details, see [IMDS sample code here.](./linux/instance-metadata-service.md?tabs=linux#get-user-data)

Customers can retrieve existing value of user data via rest API
using \$expand=userData endpoint (request body can be left empty).

Single VMs:

`GET "/subscriptions/{guid}/resourceGroups/{RGName}/providers/Microsoft.Compute/virtualMachines/{VMName}?$expand=userData"`

Virtual Machine Scale Set:

`GET "/subscriptions/{guid}/resourceGroups/{RGName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMSSName}?$expand=userData"`

Virtual Machine Scale Set VM:

` GET "/subscriptions/{guid}/resourceGroups/{RGName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMSSName}/virtualmachines/{vmss instance id}?$expand=userData" `

## Updating user data

With REST API, you can use a normal PUT or PATCH request to update the user data. The user data is updated without the need to stop or reboot the VM.

`PUT
"/subscriptions/{guid}/resourceGroups/{RGName}/providers/Microsoft.Compute/ virtualMachines/{VMName}
`

`PATCH
"/subscriptions/{guid}/resourceGroups/{RGName}/providers/Microsoft.Compute/ virtualMachines/{VMName}
`

The VM.Properties in these requests should contain your desired UserData field, like this:

```json
"properties": {
        "hardwareProfile": {
          "vmSize": "Standard_D1_v2"
        },
        "storageProfile": {
          "imageReference": {
            "sku": "2016-Datacenter",
            "publisher": "MicrosoftWindowsServer",
            "version": "latest",
            "offer": "WindowsServer"
          },
          "osDisk": {
            "caching": "ReadWrite",
            "managedDisk": {
              "storageAccountType": "StandardSSD_LRS"
            },
            "name": "vmOSdisk",
            "createOption": "FromImage"
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
        },
        "osProfile": {
          "adminUsername": "{your-username}",
          "computerName": "{vm-name}",
          "adminPassword": "{your-password}"
        },
        "diagnosticsProfile": {
          "bootDiagnostics": {
            "storageUri": "http://{existing-storage-account-name}.blob.core.windows.net",
            "enabled": true
          }
        },
        "userData": "U29tZSBDdXN0b20gRGF0YQ=="
      } 
```
> [!NOTE]
> If you pass in an empty string for "userData" in this case, the user data is deleted.

## User data and custom data

Custom data continues to work the same way as today. Note you can't retrieve custom data from IMDS. 

## Adding user data to an existing VM 

If you have an existing VM/VMSS without user data, you can still add user data to this VM by using the updating commands,  as described in the ["Updating the User data"](#updating-user-data) section. Make sure you upgrade to the latest version of Azure Resource Manger API.

## Next steps 
 
Try out [Azure Instance Metadata Service](./linux/instance-metadata-service.md), learn how to get the VM instance metadata and user data from its endpoint. 
