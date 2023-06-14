---
title: Add a managed identity to a Service Fabric managed cluster node type
description: This article shows how to add a managed identity to a Service Fabric managed cluster node type
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-azurepowershell
services: service-fabric
ms.date: 07/11/2022
---

# Add a managed identity to a Service Fabric managed cluster node type

Each node type in a Service Fabric managed cluster is backed by a virtual machine scale set. To allow managed identities to be used with a managed cluster node type, a property `vmManagedIdentity` has been added to node type definitions containing a list of identities that may be used, `userAssignedIdentities`. Functionality mirrors how managed identities can be used in non-managed clusters, such as using a managed identity with the [Azure Key Vault virtual machine scale set extension](../virtual-machines/extensions/key-vault-windows.md).

For an example of a Service Fabric managed cluster deployment that makes use of managed identity on a node type, see [these templates](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-1-NT-MI). The example has two templates:

1. **Managed identity and role assignment**: Template to create the managed identity and the role assignment to allow Service Fabric RP to assign the identity to the managed cluster's virtual machine scale set. This should be deployed only once before using the managed identity on the node type resource.

2. **Managed cluster and node type**: Template for the service fabric managed cluster and node type resources using the managed identity created before.

> [!NOTE]
> Only user-assigned identities are currently supported for this feature.

> [!NOTE]
> See [Configure and use applications with managed identity on a Service Fabric managed cluster](./how-to-managed-cluster-application-managed-identity.md) for application configuration.

## Prerequisites

Before you begin:

* If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
* If you plan to use PowerShell, [install](/cli/azure/install-azure-cli) the Azure CLI to run CLI reference commands.

## 1. Create identity and role Assignment

### Create a user-assigned managed identity

A user-assigned managed identity can be defined in the resources section of an Azure Resource Manager (ARM) template for creation upon deployment:

```JSON
{
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
  "name": "[parameters('userAssignedIdentityName')]",
  "apiVersion": "2018-11-30",
  "location": "[resourceGroup().location]"
}
```

or created via PowerShell:

```powershell
New-AzResourceGroup -Name <managedIdentityRGName> -Location <location>
New-AzUserAssignedIdentity -ResourceGroupName <managedIdentityRGName> -Name <userAssignedIdentityName>
```

### Add a role assignment with Service Fabric Resource Provider

Add a role assignment to the managed identity with the Service Fabric Resource Provider application. This assignment allows Service Fabric Resource Provider to assign the identity, created on the previous step, to the managed cluster's virtual machine scale set. This is a one time action

Get service principal for Service Fabric Resource Provider application:

```powershell
Login-AzAccount
Select-AzSubscription -SubscriptionId <SubId>
Get-AzADServicePrincipal -DisplayName "Azure Service Fabric Resource Provider"
```

> [!NOTE]
> Make sure you are in the correct subscription, the principal ID will change if the subscription is in a different tenant.

```powershell
ServicePrincipalNames : {74cb6831-0dbb-4be1-8206-fd4df301cdc2}
ApplicationId         : 74cb6831-0dbb-4be1-8206-fd4df301cdc2
ObjectType            : ServicePrincipal
DisplayName           : Azure Service Fabric Resource Provider
Id                    : 00000000-0000-0000-0000-000000000000
```

Use the **Id** of the previous output as **principalId** and the role definition ID bellow as **roleDefinitionId** where applicable on the template or PowerShell command:

|Role definition name|Role definition ID|
|----|-------------------------------------|
|Managed Identity Operator|f1a07417-d97a-45cb-824c-7a7467783830|


This role assignment can be defined in the resources section template using the Principal ID and role definition ID:

```json
{
  "type": "Microsoft.Authorization/roleAssignments",
  "apiVersion": "2020-04-01-preview",
  "name": "[parameters('vmIdentityRoleNameGuid')]",
  "scope": "[concat('Microsoft.ManagedIdentity/userAssignedIdentities', '/', parameters('userAssignedIdentityName'))]",
  "dependsOn": [
    "[concat('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('userAssignedIdentityName'))]"
  ],
  "properties": {
    "roleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'f1a07417-d97a-45cb-824c-7a7467783830')]",
    "principalId": "<Service Fabric Resource Provider ID>"
  }
}
```
> [!NOTE]
> vmIdentityRoleNameGuid should be a valid GUID. If you deploy again the same template including this role assignment, make sure the GUID is the same as the one originally used or remove this resource as it just needs to be created once.

or created via PowerShell using the principal ID and role definition name:

```powershell
New-AzRoleAssignment -PrincipalId "<Service Fabric Resource Provider ID>" -RoleDefinitionName "Managed Identity Operator" -Scope "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<userAssignedIdentityName>"
```

### Deploy managed identity and role assignment.
Run the New-AzResourceGroupDeployment cmdlet to create the managed identity and add the role assignment:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName <managedIdentityRGName> -TemplateFile ".\MangedIdentityAndSfrpRoleAssignment.json" -TemplateParameterFile ".\MangedIdentityAndSfrpRoleAssignment.Parameters.json" -Verbose
```

## 2. Assign identity to the node type resource

### Add managed identity properties to node type definition

Finally, add the `vmManagedIdentity` and `userAssignedIdentities` properties to the managed cluster's node type definition with the full resource ID of the identity created on the first step. Be sure to use **2021-05-01** or later for the `apiVersion`.

```json
{
  "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
  "apiVersion": "2021-05-01",
  "properties": {
    "isPrimary": true,
    "vmInstanceCount": 5,
    "dataDiskSizeGB": 100,
    "vmSize": "Standard_D2_v2",
    "vmImagePublisher": "MicrosoftWindowsServer",
    "vmImageOffer": "WindowsServer",
    "vmImageSku": "2019-Datacenter",
    "vmImageVersion": "latest",
    "vmManagedIdentity": {
      "userAssignedIdentities": [
        "[parameters('userAssignedIdentityResourceId')]"
      ]
    }
  }
}
```

### Deploy the node type resource assigning the identity

Run the New-AzResourceGroupDeployment cmdlet to deploy the service fabric managed clusters template that assigns the managed identity to the node type resource.

```powershell
New-AzResourceGroupDeployment -ResourceGroupName <sfmcRGName> -TemplateFile ".\SfmcVmMangedIdentity.json" -TemplateParameterFile ".\SfmcVmMangedIdentity.Parameters.json" -Verbose
```

After deployment, the created managed identity has been added to the designated node type's virtual machine scale set and can be used as expected, just like in any non-managed cluster.

## Troubleshooting

Failure to properly add a role assignment will be met with the following error on deployment:

:::image type="content" source="media/how-to-managed-identity-managed-cluster-vmss/role-assignment-error.png" alt-text="Azure portal deployment error showing the client with SFRP's object/application ID not having permission to perform identity management activity":::

In this case, make sure the role assignment is created successfully with Role "Managed Identity Operator". The role assignment can be found on the Azure portal under access control of the managed identity resource as show below.

:::image type="content" source="media/how-to-managed-identity-managed-cluster-vmss/role-assignment-portal.png" alt-text="Role assignment properties for Service Fabric Resource provider on the user-assigned managed identity shown in the Azure portal":::

## Next Steps

> [!div class="nextstepaction"]
> [Deploy an app to a Service Fabric managed cluster](./tutorial-managed-cluster-deploy-app.md)
