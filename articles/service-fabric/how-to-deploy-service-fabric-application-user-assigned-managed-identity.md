---
title: Deploy app with a user-assigned managed identity
description: This article shows you how to deploy Service Fabric application with a user-assigned managed identity
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---
# Deploy Service Fabric application with a User-Assigned Managed Identity

To deploy a Service Fabric application with managed identity, the application needs to be deployed through Azure Resource Manager, typically with an Azure Resource Manager template. For more information on how to deploy Service Fabric application through Azure Resource Manager, see [Manage applications and services as Azure Resource Manager resources](service-fabric-application-arm-resource.md).

> [!NOTE] 
> 
> Applications which are not deployed as an Azure resource **cannot** have Managed Identities. 
>
> Service Fabric application deployment with Managed Identity is supported with API version `"2019-06-01-preview"`. You can also use the same API version for application type, application type version and service resources.
>

## User-Assigned Identity

To enable application with User-Assigned identity, first add the **identity** property to the application resource with type **userAssigned** and the referenced user-assigned identities. Then add a **managedIdentities** section inside the **properties** section for the **application** resource which contains a list of friendly name to principalId mapping for each of the user-assigned identities. For more information about User Assigned Identities see [Create, list or delete a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-powershell.md).

### Application template

To enable application with User Assigned identity, first add **identity** property to the application resource with type **userAssigned** and the referenced user assigned identities, then add a **managedIdentities** object inside the **properties** section that contains a list of friendly name to principalId mapping for each of the user assigned identities.

```json
{
  "apiVersion": "2019-06-01-preview",
  "type": "Microsoft.ServiceFabric/clusters/applications",
  "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'))]",
  "location": "[resourceGroup().location]",
  "dependsOn": [
    "[concat('Microsoft.ServiceFabric/clusters/', parameters('clusterName'), '/applicationTypes/', parameters('applicationTypeName'), '/versions/', parameters('applicationTypeVersion'))]",
    "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('userAssignedIdentityName'))]"
  ],
  "identity": {
    "type" : "userAssigned",
    "userAssignedIdentities": {
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('userAssignedIdentityName'))]": {}
    }
  },
  "properties": {
    "typeName": "[parameters('applicationTypeName')]",
    "typeVersion": "[parameters('applicationTypeVersion')]",
    "parameters": {
    },
    "managedIdentities": [
      {
        "name" : "[parameters('userAssignedIdentityName')]",
        "principalId" : "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('userAssignedIdentityName')), '2018-11-30').principalId]"
      }
    ]
  }
}
```

In the example above the resource name of the user assigned identity is being used as the friendly name of the managed identity for the application. The following examples assume the actual friendly name is "AdminUser".

### Application package

1. For each identity defined in the `managedIdentities` section in the Azure Resource Manager template, add a `<ManagedIdentity>` tag in the application manifest under **Principals** section. The `Name` attribute needs to match the `name` property defined in the `managedIdentities` section.

    **ApplicationManifest.xml**

    ```xml
      <Principals>
        <ManagedIdentities>
          <ManagedIdentity Name="AdminUser" />
        </ManagedIdentities>
      </Principals>
    ```

2. In the **ServiceManifestImport** section, add a **IdentityBindingPolicy** for the service that uses the Managed Identity. This policy maps the `AdminUser` identity to a service-specific identity name that needs to be added into the service manifest later on.

    **ApplicationManifest.xml**

    ```xml
      <ServiceManifestImport>
        <Policies>
          <IdentityBindingPolicy ServiceIdentityRef="WebAdmin" ApplicationIdentityRef="AdminUser" />
        </Policies>
      </ServiceManifestImport>
    ```

3. Update the service manifest to add a **ManagedIdentity** inside the **Resources** section with the name matching the `ServiceIdentityRef` in the `IdentityBindingPolicy` of the application manifest:

    **ServiceManifest.xml**

    ```xml
      <Resources>
        ...
        <ManagedIdentities DefaultIdentity="WebAdmin">
          <ManagedIdentity Name="WebAdmin" />
        </ManagedIdentities>
      </Resources>
    ```

## Next steps

* [How to use Managed Identity in Service Fabric application code](how-to-managed-identity-service-fabric-app-code.md)
* [How to Grant Service Fabric application access to other Azure resources](how-to-grant-access-other-resources.md)
