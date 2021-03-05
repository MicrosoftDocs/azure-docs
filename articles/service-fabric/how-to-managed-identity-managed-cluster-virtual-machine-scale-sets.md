---
title: Add a managed identity to a Service Fabric managed cluster node type (preview)
description: This article shows how to add a managed identity to a Service Fabric managed cluster node type
ms.topic: how-to
ms.date: 11/24/2020
ms.custom: references_regions
---

# Add a managed identity to a Service Fabric managed cluster node type (preview)

Each node type in a Service Fabric managed cluster is backed by a virtual machine scale set. To allow managed identities to be used with a managed cluster node type, a property `vmManagedIdentity` has been added to node type definitions containing a list of identities that may be used, `userAssignedIdentities`. Functionality mirrors how managed identities can be used in non-managed clusters, such as using a managed identity with the [Azure Key Vault virtual machine scale set extension](../virtual-machines/extensions/key-vault-windows.md).


For an example of a Service Fabric managed cluster deployment that makes use of managed identity on a node type, see [this template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-1-NT-MI). For a list of supported regions, see the [managed cluster FAQ](./faq-managed-cluster.md#what-regions-are-supported-in-the-preview).

> [!NOTE]
> Only user-assigned identities are currently supported for this feature.

## Prerequisites

Before you begin:

* If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
* If you plan to use PowerShell, [install](/cli/azure/install-azure-cli) the Azure CLI to run CLI reference commands.

## Create a user-assigned managed identity 

A user-assigned managed identity can be defined in the resources section of an Azure Resource Manager (ARM) template for creation upon deployment:

```JSON
{ 
    "type": "Microsoft.ManagedIdentity/userAssignedIdentities", 
    "name": "[parameters('userAssignedIdentityName')]", 
    "apiVersion": "2018-11-30", 
    "location": "[resourceGroup().location]"  
},
```

or created via PowerShell:

```powershell
az group create --name <resourceGroupName> --location <location>
az identity create --name <userAssignedIdentityName> --resource-group <resourceGroupName>
```

## Add a role assignment with Service Fabric Resource Provider

Add a role assignment to the managed identity with the Service Fabric Resource Provider application. This assignment allows Service Fabric Resource Provider to assign the identity to the managed cluster's virtual machine scale set. 

The following values must be used where applicable:

|Name|Corresponding Service Fabric Resource Provider value|
|----|-------------------------------------|
|Application ID|74cb6831-0dbb-4be1-8206-fd4df301cdc2|
|Object ID|fbc587f2-66f5-4459-a027-bcd908b9d278|


|Role definition name|Role definition ID|
|----|-------------------------------------|
|Managed Identity Operator|f1a07417-d97a-45cb-824c-7a7467783830
|



This role assignment can be defined in the resources section using the Object ID and role definition ID:

```JSON
{
    "type": "Microsoft.Authorization/roleAssignments", 
    "apiVersion": "2020-04-01-preview",
    "name": "[parameters('vmIdentityRoleNameGuid')]",
    "scope": "[concat('Microsoft.ManagedIdentity/userAssignedIdentities', '/', parameters('userAssignedIdentityName'))]",
    "dependsOn": [ 
        "[concat('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('userAssignedIdentityName'))]"
    ], 
    "properties": {
        "roleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'f1a07417-d97a-45cb-824c-7a7467783830')]",
        "principalId": "fbc587f2-66f5-4459-a027-bcd908b9d278" 
    } 
}, 
```

or created via PowerShell using either the application ID and role definition ID:

```powershell
New-AzRoleAssignment -ApplicationId 74cb6831-0dbb-4be1-8206-fd4df301cdc2 -RoleDefinitionName "Managed Identity Operator" -Scope "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<userAssignedIdentityName>"
```

or object ID and role definition ID:

```powershell
New-AzRoleAssignment -PrincipalId fbc587f2-66f5-4459-a027-bcd908b9d278 -RoleDefinitionName "Managed Identity Operator" -Scope "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<userAssignedIdentityName>"
```

## Add managed identity properties to node type definition

Finally, add the `vmManagedIdentity` and `userAssignedIdentities` properties to the managed cluster's node type definition. Be sure to use **2021-01-01-preview** or later for the `apiVersion`.

```json

 {
    "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
    "apiVersion": "2021-01-01-preview",
    ...
    "properties": {
        "isPrimary" : true,
        "vmInstanceCount": 5,
        "dataDiskSizeGB": 100,
        "vmSize": "Standard_D2_v2",
        "vmImagePublisher" : "MicrosoftWindowsServer",
        "vmImageOffer" : "WindowsServer",
        "vmImageSku" : "2019-Datacenter",
        "vmImageVersion" : "latest",
        "vmManagedIdentity": {
            "userAssignedIdentities": [
                "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentityName'))]"
            ]
        }
    }
}
```

After deployment, the created managed identity has been added to the designated node type's virtual machine scale set and can be used as expected, just like in any non-managed cluster.

## Troubleshooting

Failure to properly add a role assignment will be met with the following error on deployment:

:::image type="content" source="media/how-to-managed-identity-managed-cluster-vmss/role-assignment-error.png" alt-text="Azure portal deployment error showing the client with SFRP's object/application ID not having permission to perform identity management activity":::

## Next Steps

> [!div class="nextstepaction"]
> [Deploy an app to a Service Fabric managed cluster](./tutorial-managed-cluster-deploy-app.md)