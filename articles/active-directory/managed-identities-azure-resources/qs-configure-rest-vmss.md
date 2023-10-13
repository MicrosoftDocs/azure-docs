---
title: Configure managed identities on Azure virtual machine scale set using REST
description: Step-by-step instructions for configuring a system and user-assigned managed identities on an Azure virtual machine scale set using CURL to make REST API calls.
services: active-directory
documentationcenter: 
author: barclayn
manager: amycolannino
editor: 
ms.service: active-directory
ms.subservice: msi
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/25/2023
ms.author: barclayn
ms.collection: M365-identity-device-management
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Configure managed identities for Azure resources on a virtual machine scale set using REST API calls

Managed identities for Azure resources provide Azure services with an automatically managed system identity in Microsoft Entra ID. You can use this identity to authenticate to any service that supports Microsoft Entra authentication, without having credentials in your code. 

In this article, using CURL to make calls to the Azure Resource Manager REST endpoint, you learn how to perform the following managed identities for Azure resources operations on a virtual machine scale set:

- Enable and disable the system-assigned managed identity on an Azure virtual machine scale set
- Add and remove a user-assigned managed identity on an Azure virtual machine scale set

If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, see [What are managed identities for Azure resources?](overview.md). To learn about system-assigned and user-assigned managed identity types, see [Managed identity types](overview.md#managed-identity-types).

- To perform the management operations in this article, your account needs the following Azure role assignments:

  - [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) to create a virtual machine scale set and enable and remove system and/or user-assigned managed identity from a virtual machine scale set.

  - [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role to create a user-assigned managed identity.

  - [Managed Identity Operator](/azure/role-based-access-control/built-in-roles#managed-identity-operator) role to assign and remove a user-assigned identity from and to a virtual machine scale set.

  > [!NOTE]
  > No additional Microsoft Entra directory role assignments required.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## System-assigned managed identity

In this section, you learn how to enable and disable system-assigned managed identity on a virtual machine scale set using CURL to make calls to the Azure Resource Manager REST endpoint.

### Enable system-assigned managed identity during creation of a virtual machine scale set

To create a virtual machine scale set with system-assigned managed identity enabled, you need create a virtual machine scale set and retrieve an access token to use CURL to call the Resource Manager endpoint with the system-assigned managed identity type value.

1. Create a [resource group](/azure/azure-resource-manager/management/overview#terminology) for containment and deployment of your virtual machine scale set and its related resources, using [az group create](/cli/azure/group/#az-group-create). You can skip this step if you already have resource group you would like to use instead:

   ```azurecli-interactive 
   az group create --name myResourceGroup --location westus
   ```

2. Create a [network interface](/cli/azure/network/nic#az-network-nic-create) for your virtual machine scale set:

   ```azurecli-interactive
    az network nic create -g myResourceGroup --vnet-name myVnet --subnet mySubnet -n myNic
   ```

3. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your virtual machine scale set with a system-assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ``` 

4. Using Azure Cloud Shell, create a virtual machine scale set using CURL to call the Azure Resource Manager REST endpoint. The following example creates a virtual machine scale set named *myVMSS* in the *myResourceGroup* with a system-assigned managed identity, as identified in the request body by the value `"identity":{"type":"SystemAssigned"}`. Replace `<ACCESS TOKEN>` with the value you received in the previous step when you requested a Bearer access token and the `<SUBSCRIPTION ID>` value as appropriate for your environment.

   ```bash   
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01' -X PUT -d '{"sku":{"tier":"Standard","capacity":3,"name":"Standard_D1_v2"},"location":"eastus","identity":{"type":"SystemAssigned"},"properties":{"overprovision":true,"virtualMachineProfile":{"storageProfile":{"imageReference":{"sku":"2016-Datacenter","publisher":"MicrosoftWindowsServer","version":"latest","offer":"WindowsServer"},"osDisk":{"caching":"ReadWrite","managedDisk":{"storageAccountType":"StandardSSD_LRS"},"createOption":"FromImage"}},"osProfile":{"computerNamePrefix":"myVMSS","adminUsername":"azureuser","adminPassword":"myPassword12"},"networkProfile":{"networkInterfaceConfigurations":[{"name":"myVMSS","properties":{"primary":true,"enableIPForwarding":true,"ipConfigurations":[{"name":"myVMSS","properties":{"subnet":{"id":"/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet"}}}]}}]}},"upgradePolicy":{"mode":"Manual"}}}' -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PUT https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. | 

   **Request body**

   ```JSON
    {
       "sku":{
          "tier":"Standard",
          "capacity":3,
          "name":"Standard_D1_v2"
       },
       "location":"eastus",
       "identity":{
          "type":"SystemAssigned"
       },
       "properties":{
          "overprovision":true,
          "virtualMachineProfile":{
             "storageProfile":{
                "imageReference":{
                   "sku":"2016-Datacenter",
                   "publisher":"MicrosoftWindowsServer",
                   "version":"latest",
                   "offer":"WindowsServer"
                },
                "osDisk":{
                   "caching":"ReadWrite",
                   "managedDisk":{
                      "storageAccountType":"StandardSSD_LRS"
                   },
                   "createOption":"FromImage"
                }
             },
             "osProfile":{
                "computerNamePrefix":"myVMSS",
                "adminUsername":"azureuser",
                "adminPassword":"myPassword12"
             },
             "networkProfile":{
                "networkInterfaceConfigurations":[
                   {
                      "name":"myVMSS",
                      "properties":{
                         "primary":true,
                         "enableIPForwarding":true,
                         "ipConfigurations":[
                            {
                               "name":"myVMSS",
                               "properties":{
                                  "subnet":{
                                     "id":"/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet"
                                  }
                               }
                            }
                         ]
                      }
                   }
                ]
             }
          },
          "upgradePolicy":{
             "mode":"Manual"
          }
       }
    }  
   ```  

### Enable system-assigned managed identity on an existing virtual machine scale set

To enable system-assigned managed identity on an existing virtual machine scale set, you need to acquire an access token and then use CURL to call the Resource Manager REST endpoint to update the identity type.

1. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your virtual machine scale set with a system-assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ```

2. Use the following CURL command to call the Azure Resource Manager REST endpoint to enable system-assigned managed identity on your virtual machine scale set as identified in the request body by the value `{"identity":{"type":"SystemAssigned"}` for a virtual machine scale set named *myVMSS*.  Replace `<ACCESS TOKEN>` with the value you received in the previous step when you requested a Bearer access token and the `<SUBSCRIPTION ID>` value as appropriate for your environment.
   
   > [!IMPORTANT]
   > To ensure you don't delete any existing user-assigned managed identities that are assigned to the virtual machine scale set, you need to list the user-assigned managed identities by using this CURL command: `curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachineScaleSets/<VMSS NAME>?api-version=2018-06-01' -H "Authorization: Bearer <ACCESS TOKEN>"`. If you have any user-assigned managed identities assigned to the virtual machine scale set as identified in the `identity` value in the response, skip to step 3 that shows you how to retain user-assigned managed identities while enabling system-assigned managed identity on your virtual machine scale set.

   ```bash
    curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01' -X PATCH -d '{"identity":{"type":"SystemAssigned"}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. | 

   **Request body**

   ```JSON
    {
       "identity":{
          "type":"SystemAssigned"
       }
    }
   ```

3. To enable system-assigned managed identity on a virtual machine scale set with existing user-assigned managed identities, you need to add `SystemAssigned` to the `type` value.  
   
   For example, if your virtual machine scale set has the user-assigned managed identities `ID1` and `ID2` assigned to it, and you would like to add system-assigned managed identity to the virtual machine scale set, use the following CURL call. Replace `<ACCESS TOKEN>` and `<SUBSCRIPTION ID>` with values appropriate to your environment.

   API version `2018-06-01` stores user-assigned managed identities in the `userAssignedIdentities` value in a dictionary format as opposed to the `identityIds` value in an array format used in API version `2017-12-01`.
   
   **API VERSION 2018-06-01**

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01' -X PATCH -d '{"identity":{"type":"SystemAssigned,UserAssigned", "userAssignedIdentities":{"/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1":{},"/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2":{}}}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. |
 
   **Request body**

   ```JSON
    {
       "identity":{
          "type":"SystemAssigned,UserAssigned",
          "userAssignedIdentities":{
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1":{
             },
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2":{
    
             }
          }
       }
    }
   ```
   
   **API VERSION 2017-12-01**

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"SystemAssigned,UserAssigned", "identityIds":["/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1","/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2"]}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2017-12-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. | 

   **Request body**

   ```JSON
    {
       "identity":{
          "type":"SystemAssigned,UserAssigned",
          "identityIds":[
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1",
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2"
          ]
       }
    }
   ```

### Disable system-assigned managed identity from a virtual machine scale set

To disable a system-assigned identity on an existing virtual machine scale set, you need to acquire an access token and then use CURL to call the Resource Manager REST endpoint to update the identity type to `None`.

1. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your virtual machine scale set with a system-assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ```

2. Update the virtual machine scale set using CURL to call the Azure Resource Manager REST endpoint to disable system-assigned managed identity.  The following example disables system-assigned managed identity as identified in the request body by the value `{"identity":{"type":"None"}}` from a virtual machine scale set named *myVMSS*.  Replace `<ACCESS TOKEN>` with the value you received in the previous step when you requested a Bearer access token and the `<SUBSCRIPTION ID>` value as appropriate for your environment.

   > [!IMPORTANT]
   > To ensure you don't delete any existing user-assigned managed identities that are assigned to the virtual machine scale set, you need to list the user-assigned managed identities by using this CURL command: `curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachineScaleSets/<VMSS NAME>?api-version=2018-06-01' -H "Authorization: Bearer <ACCESS TOKEN>"`. If you have any user-assigned managed identity assigned to the virtual machine scale set, skip to step 3 that shows you how retain the user-assigned managed identities while removing the system-assigned managed identity from your virtual machine scale set.

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01' -X PATCH -d '{"identity":{"type":"None"}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. | 

   **Request body**

   ```JSON
    {
       "identity":{
          "type":"None"
       }
    }
   ```

   To remove system-assigned managed identity from a virtual machine scale set that has user-assigned managed identities, remove `SystemAssigned` from the `{"identity":{"type:" "}}` value while keeping the `UserAssigned` value and the `userAssignedIdentities` dictionary values if you are using **API version 2018-06-01**. If you are using **API version 2017-12-01** or earlier, keep the `identityIds` array.

## User-assigned managed identity

In this section, you learn how to add and remove user-assigned managed identity on a virtual machine scale set using CURL to make calls to the Azure Resource Manager REST endpoint.

### Assign a user-assigned managed identity during the creation of a virtual machine scale set

1. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your virtual machine scale set with a system-assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ```

2. Create a [network interface](/cli/azure/network/nic#az-network-nic-create) for your virtual machine scale set:

   ```azurecli-interactive
    az network nic create -g myResourceGroup --vnet-name myVnet --subnet mySubnet -n myNic
   ```

3. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your virtual machine scale set with a system-assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ``` 

4. Create a user-assigned managed identity using the instructions found here: [Create a user-assigned managed identity](how-to-manage-ua-identity-rest.md#create-a-user-assigned-managed-identity).

5. Create a virtual machine scale set using CURL to call the Azure Resource Manager REST endpoint. The following example creates a virtual machine scale set named *myVMSS* in the resource group *myResourceGroup* with a user-assigned managed identity `ID1`, as identified in the request body by the value `"identity":{"type":"UserAssigned"}`. Replace `<ACCESS TOKEN>` with the value you received in the previous step when you requested a Bearer access token and the `<SUBSCRIPTION ID>` value as appropriate for your environment.
 
   **API VERSION 2018-06-01**

   ```bash   
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01' -X PUT -d '{"sku":{"tier":"Standard","capacity":3,"name":"Standard_D1_v2"},"location":"eastus","identity":{"type":"UserAssigned","userAssignedIdentities":{"/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1":{}}},"properties":{"overprovision":true,"virtualMachineProfile":{"storageProfile":{"imageReference":{"sku":"2016-Datacenter","publisher":"MicrosoftWindowsServer","version":"latest","offer":"WindowsServer"},"osDisk":{"caching":"ReadWrite","managedDisk":{"storageAccountType":"StandardSSD_LRS"},"createOption":"FromImage"}},"osProfile":{"computerNamePrefix":"myVMSS","adminUsername":"azureuser","adminPassword":"myPassword12"},"networkProfile":{"networkInterfaceConfigurations":[{"name":"myVMSS","properties":{"primary":true,"enableIPForwarding":true,"ipConfigurations":[{"name":"myVMSS","properties":{"subnet":{"id":"/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet"}}}]}}]}},"upgradePolicy":{"mode":"Manual"}}}' -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PUT https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. | 

   **Request body**

   ```JSON
    {
       "sku":{
          "tier":"Standard",
          "capacity":3,
          "name":"Standard_D1_v2"
       },
       "location":"eastus",
       "identity":{
          "type":"UserAssigned",
          "userAssignedIdentities":{
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1":{
    
             }
          }
       },
       "properties":{
          "overprovision":true,
          "virtualMachineProfile":{
             "storageProfile":{
                "imageReference":{
                   "sku":"2016-Datacenter",
                   "publisher":"MicrosoftWindowsServer",
                   "version":"latest",
                   "offer":"WindowsServer"
                },
                "osDisk":{
                   "caching":"ReadWrite",
                   "managedDisk":{
                      "storageAccountType":"StandardSSD_LRS"
                   },
                   "createOption":"FromImage"
                }
             },
             "osProfile":{
                "computerNamePrefix":"myVMSS",
                "adminUsername":"azureuser",
                "adminPassword":"myPassword12"
             },
             "networkProfile":{
                "networkInterfaceConfigurations":[
                   {
                      "name":"myVMSS",
                      "properties":{
                         "primary":true,
                         "enableIPForwarding":true,
                         "ipConfigurations":[
                            {
                               "name":"myVMSS",
                               "properties":{
                                  "subnet":{
                                     "id":"/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet"
                                  }
                               }
                            }
                         ]
                      }
                   }
                ]
             }
          },
          "upgradePolicy":{
             "mode":"Manual"
          }
       }
    }
   ```   

   **API VERSION 2017-12-01**

   ```bash   
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2017-12-01' -X PUT -d '{"sku":{"tier":"Standard","capacity":3,"name":"Standard_D1_v2"},"location":"eastus","identity":{"type":"UserAssigned","identityIds":["/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"]},"properties":{"overprovision":true,"virtualMachineProfile":{"storageProfile":{"imageReference":{"sku":"2016-Datacenter","publisher":"MicrosoftWindowsServer","version":"latest","offer":"WindowsServer"},"osDisk":{"caching":"ReadWrite","managedDisk":{"storageAccountType":"StandardSSD_LRS"},"createOption":"FromImage"}},"osProfile":{"computerNamePrefix":"myVMSS","adminUsername":"azureuser","adminPassword":"myPassword12"},"networkProfile":{"networkInterfaceConfigurations":[{"name":"myVMSS","properties":{"primary":true,"enableIPForwarding":true,"ipConfigurations":[{"name":"myVMSS","properties":{"subnet":{"id":"/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet"}}}]}}]}},"upgradePolicy":{"mode":"Manual"}}}' -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PUT https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2017-12-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. |
 
   **Request body**

   ```JSON
    {
       "sku":{
          "tier":"Standard",
          "capacity":3,
          "name":"Standard_D1_v2"
       },
       "location":"eastus",
       "identity":{
          "type":"UserAssigned",
          "identityIds":[
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"
          ]
       },
       "properties":{
          "overprovision":true,
          "virtualMachineProfile":{
             "storageProfile":{
                "imageReference":{
                   "sku":"2016-Datacenter",
                   "publisher":"MicrosoftWindowsServer",
                   "version":"latest",
                   "offer":"WindowsServer"
                },
                "osDisk":{
                   "caching":"ReadWrite",
                   "managedDisk":{
                      "storageAccountType":"StandardSSD_LRS"
                   },
                   "createOption":"FromImage"
                }
             },
             "osProfile":{
                "computerNamePrefix":"myVMSS",
                "adminUsername":"azureuser",
                "adminPassword":"myPassword12"
             },
             "networkProfile":{
                "networkInterfaceConfigurations":[
                   {
                      "name":"myVMSS",
                      "properties":{
                         "primary":true,
                         "enableIPForwarding":true,
                         "ipConfigurations":[
                            {
                               "name":"myVMSS",
                               "properties":{
                                  "subnet":{
                                     "id":"/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet"
                                  }
                               }
                            }
                         ]
                      }
                   }
                ]
             }
          },
          "upgradePolicy":{
             "mode":"Manual"
          }
       }
    }
   ```

### Assign a user-assigned managed identity to an existing Azure virtual machine scale set

1. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your virtual machine scale set with a system-assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ```

2.  Create a user-assigned managed identity using the instructions found here, [Create a user-assigned managed identity](how-to-manage-ua-identity-rest.md#create-a-user-assigned-managed-identity).

3. To ensure you don't delete existing user or system-assigned managed identities that are assigned to the virtual machine scale set, you need to list the identity types assigned to the virtual machine scale set by using the following CURL command. If you have managed identities assigned to the virtual machine scale set, they are listed in the `identity` value.

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachineScaleSets/<VMSS NAME>?api-version=2018-06-01' -H "Authorization: Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   GET https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachineScaleSets/<VMSS NAME>?api-version=2018-06-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Authorization*     | Required. Set to a valid `Bearer` access token. |   
 

4. If you don't have any user or system-assigned managed identities assigned to your virtual machine scale set, use the following CURL command to call the Azure Resource Manager REST endpoint to assign the first user-assigned managed identity to the virtual machine scale set.  If you have a user or system-assigned managed identity(s) assigned to the virtual machine scale set, skip to step 5 that shows you how to add multiple user-assigned managed identities to a virtual machine scale set while also maintaining the system-assigned managed identity.

   The following example assigns a user-assigned managed identity, `ID1` to a virtual machine scale set named *myVMSS* in the resource group *myResourceGroup*.  Replace `<ACCESS TOKEN>` with the value you received in the previous step when you requested a Bearer access token and the `<SUBSCRIPTION ID>` value as appropriate for your environment.

   **API VERSION 2018-06-01**

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-12-01' -X PATCH -d '{"identity":{"type":"userAssigned", "userAssignedIdentities":{"/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1":{}}}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-12-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. | 

   **Request body**

   ```JSON
    {
       "identity":{
          "type":"userAssigned",
          "userAssignedIdentities":{
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1":{
    
             }
          }
       }
    }
   ``` 
    
   **API VERSION 2017-12-01**

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"userAssigned", "identityIds":["/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"]}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2017-12-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. | 

   **Request body**

   ```JSON
    {
       "identity":{
          "type":"userAssigned",
          "identityIds":[
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"
          ]
       }
    }
   ```  

5. If you have an existing user-assigned or system-assigned managed identity assigned to your virtual machine scale set:
   
   **API VERSION 2018-06-01**

   Add the user-assigned managed identity to the `userAssignedIdentities` dictionary value.

   For example, if you have system-assigned managed identity and the user-assigned managed identity `ID1` currently assigned to your virtual machine scale and would like to add the user-assigned managed identity `ID2` to it:

   ```bash
   curl  'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01' -X PATCH -d '{"identity":{"type":"SystemAssigned, UserAssigned", "userAssignedIdentities":{"/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1":{},"/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2":{}}}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. | 

   **Request body**

   ```JSON
    {
       "identity":{
          "type":"SystemAssigned, UserAssigned",
          "userAssignedIdentities":{
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1":{
    
             },
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2":{
    
             }
          }
       }
    }
   ```

   **API VERSION 2017-12-01**

   Retain the user-assigned managed identities you would like to keep in the `identityIds` array value while adding the new user-assigned managed identity.

   For example, if you have system-assigned identity and the user-assigned managed identity `ID1` currently assigned to your virtual machine scale set and would like to add the user-assigned managed identity `ID2` to it:

   ```bash
   curl  'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"SystemAssigned, UserAssigned", "identityIds":["/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1","/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2"]}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2017-12-01 HTTP/1.1
   ```

    **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. | 

   **Request body**

   ```JSON
    {
       "identity":{
          "type":"SystemAssigned, UserAssigned",
          "identityIds":[
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1",
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2"
          ]
       }
    }
   ```

### Remove a user-assigned managed identity from a virtual machine scale set

1. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your virtual machine scale set with a system-assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ```

2. To ensure you don't delete any existing user-assigned managed identities that you would like to keep assigned to the virtual machine scale set or remove the system-assigned managed identity, you need to list the managed identities by using the following CURL command:

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachineScaleSets/<VMSS NAME>?api-version=2018-06-01' -H "Authorization: Bearer <ACCESS TOKEN>" 
   ```

   ```HTTP
   GET https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachineScaleSets/<VMSS NAME>?api-version=2018-06-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Authorization*     | Required. Set to a valid `Bearer` access token. |
   
   If you have managed identities assigned to the VM, they are listed in the response in the `identity` value. 
    
   For example, if you have user-assigned managed identities `ID1` and `ID2` assigned to your virtual machine scale set, and you only want to keep `ID1` assigned and retain the system-assigned managed identity:

   **API VERSION 2018-06-01**

   Add `null` to the user-assigned managed identity you would like to remove:

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01' -X PATCH -d '{"identity":{"type":"SystemAssigned, UserAssigned", "userAssignedIdentities":{"/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2":null}}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

   ```HTTP
   PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. | 

   **Request body**

   ```JSON
    {
       "identity":{
          "type":"SystemAssigned, UserAssigned",
          "userAssignedIdentities":{
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2":null
          }
       }
    }
   ```

   **API VERSION 2017-12-01**

   Retain only the user-assigned managed identity(s) you would like to keep in the `identityIds` array:

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"SystemAssigned,UserAssigned", "identityIds":["/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"]}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```   

   ```HTTP
   PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2017-12-01 HTTP/1.1
   ```

   **Request headers**

   |Request header  |Description  |
   |---------|---------|
   |*Content-Type*     | Required. Set to `application/json`.        |
   |*Authorization*     | Required. Set to a valid `Bearer` access token. | 

   **Request body**

   ```JSON
    {
       "identity":{
          "type":"SystemAssigned,UserAssigned",
          "identityIds":[
             "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"
          ]
       }
    }
   ```

If your virtual machine scale set has both system-assigned and user-assigned managed identities, you can remove all the user-assigned managed identities by switching to use only system-assigned using the following command:

```bash
curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01' -X PATCH -d '{"identity":{"type":"SystemAssigned"}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
```

```HTTP
PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01 HTTP/1.1
```

**Request headers**

|Request header  |Description  |
|---------|---------|
|*Content-Type*     | Required. Set to `application/json`.        |
|*Authorization*     | Required. Set to a valid `Bearer` access token. | 

**Request body**

```JSON
{
   "identity":{
      "type":"SystemAssigned"
   }
}
```
    
If your virtual machine scale set has only user-assigned managed identities and you would like to remove them all, use the following command:

```bash
curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01' -X PATCH -d '{"identity":{"type":"None"}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
```

```HTTP
PATCH https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myVMSS?api-version=2018-06-01 HTTP/1.1
```

**Request headers**

|Request header  |Description  |
|---------|---------|
|*Content-Type*     | Required. Set to `application/json`.        |
|*Authorization*     | Required. Set to a valid `Bearer` access token. | 

**Request body**

```JSON
{
   "identity":{
      "type":"None"
   }
}
```

## Next steps

For information on how to create, list, or delete user-assigned managed identities using REST see:

- [Create, list, or delete a user-assigned managed identity using REST API calls](how-to-manage-ua-identity-rest.md)
