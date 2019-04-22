---
title: Azure CycleCloud and Managed Identities | Microsoft Docs
description: How to use Managed Identities with Azure CycleCloud.
author: rokeptne
ms.date: 02/05/2019
ms.author: rokeptne
---

# Using Managed Identities

When Azure CycleCloud has been installed on an Azure VM with a Managed Identity assigned to it, the **Create Cloud Provider Account** dialog will behave slightly differently. There will be a new checkbox for **Managed Identity** and the **Subscription ID** will be pre-populated with the subscription of the host VM.

![Create Cloud Provider Account Managed Identities](~/images/create-account-managed-identity.png)

It is still possible to enter the standard set of credentials by simply unchecking the **Managed Identity** checkbox. Upon doing so, the standard fields will be added to the form. Additionally, it is perfectly acceptable to use a separate **Subscription ID**; the provided value is just for convenience.

## Create a custom role and managed identity for CycleCloud

CycleCloud automates many calls to the Azure Resource Manager for the purposes
of managing HPC clusters. This automation requires certain permissions to be granted
to CycleCloud. It's recommended to use a [VM with a managed identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm#user-assigned-managed-identity) for this purpose. A sufficient policy for most CycleCloud features is posted below.

```json
{
    "assignableScopes": [
      "/"
    ],
    "description": "CycleCloud Orchestrator Role",
    "permissions": [
      {
        "actions": [
          "Microsoft.Compute/*/read",
          "Microsoft.Compute/availabilitySets/*",
          "Microsoft.Compute/virtualMachines/*",
          "Microsoft.Network/*/read",
          "Microsoft.Network/networkInterfaces/*",  
          "Microsoft.Network/virtualNetworks/read",
          "Microsoft.Network/virtualNetworks/subnets/read",
          "Microsoft.Network/virtualNetworks/subnets/join/action",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Resources/subscriptions/resourcegroups/resources/read",
          "Microsoft.Storage/storageAccounts/write",
          "Microsoft.Storage/storageAccounts/blobServices/containers/delete",
          "Microsoft.Storage/storageAccounts/blobServices/containers/read",
          "Microsoft.Storage/storageAccounts/blobServices/containers/write",
          "Microsoft.Compute/locations/usages/read",
          "Microsoft.Commerce/RateCard/read",
          "Microsoft.Storage/*/read",
          "Microsoft.Storage/storageAccounts/read",  
          "Microsoft.Storage/storageAccounts/listKeys/action",
          "Microsoft.Storage/storageAccounts/write"
        ],
        "dataActions": [
          "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete",
          "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
          "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
        ],
        "notActions": [],
        "notDataActions": []
      }
    ],
    "Name": "CycleCloud",
    "roleType": "CustomRole",
    "type": "Microsoft.Authorization/roleDefinitions"
}
```

A role can be created from the role definitions via the [Azure CLI](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli)
.  Use this role to create a role definition within the Azure Tenant. Once the
role exists in the tenant, assign the role to an identity with proper scope.

Below is the basic flow using the Azure cli.

* Create a custom role definition: 
`az role definition create --role-definition role.json`
* Create user identity: 
`az identity create --name <name>`
* Assign the custom role to the identity with proper scope: 
`az role assignment create --role <CycleCloudRole> --assignee-object-id <identity-id> --scope <subscription>` 

Now the custom role is assigned and scoped to the identity and can be used with a VM.