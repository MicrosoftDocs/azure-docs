---
title: Azure Service Fabric - Deploy an Azure Service Fabric application with a user-assigned managed identity | Microsoft Docs
description: This article shows you how to assign a user-assigned identity to an Azure Service Fabric application
services: service-fabric
author: athinanthny

ms.service: service-fabric
ms.topic: article
ms.date: 07/25/2019
ms.author: atsenthi
---
# Deploy Service Fabric application with a user-assigned managed identity
Managed identities in Service Fabric are only supported for applications deployed as Azure resources, via Azure Resource Manager. This is typically done using an Azure Resource Manager template. Applications created or deployed directly to a Service Fabric cluster (for instance, by using the native Service Fabric API) cannot be assigned or use managed identities. For more information on how to deploy Service Fabric applications through Azure Resource Manager, refer to [Manage applications and services as Azure Resource Manager resources](service-fabric-application-arm-resource.md).

> [!NOTE] 
> Deployment of Service Fabric applications with managed identities are supported starting with API version `"2019-06-01-preview"`. You can also use the same API version for application type, application type version and service resources.

## User Assigned identity

### Application template
To enable application with a user-assigned managed identity, add the **identity** property to the application resource, with type **userAssigned** as shown in the example below; follow this by adding a **managedIdentities** object inside the **properties** section which contains a mapping of friendly names to service principal identifiers for each of the user-assigned identities.

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

This declares (to ARM, and the Managed Identity and Service Fabric Resource Providers, respectively, that this resource shall be assigned an identity resource (`user assigned`) as its managed identity. In our example, the friendly name we'll use for this identity is `AdminUser`.

### Application package

1. For each identity defined in the `managedIdentities` section in the Azure Resource Manager template, add a `<ManagedIdentity>` in the application manifest under **Principals** section. The `Name` attribute needs to match the `name` property defined in the `managedIdentities` section.

  **ApplicationManifest.xml**

  ```xml
    <Principals>
      <ManagedIdentities>
        <ManagedIdentity Name="AdminUser" />
      </ManagedIdentities>
    </Principals>
  ```
This maps the identity assigned to the application as a resource to a friendly name, for further assignment to the services comprising the application. 

2. In the **ServiceManifestImport** section corresponding to the service which is being assigned the managed identity, add an **IdentityBindingPolicy** element, as indicated below:

**ApplicationManifest.xml**

  ```xml
    <ServiceManifestImport>
      <Policies>
        <IdentityBindingPolicy ServiceIdentityRef="WebAdmin" ApplicationIdentityRef="AdminUser" />
      </Policies>
    </ServiceManifestImport>
  ```

This assigns the identity of the application to the service; without this assignment, the service will not have access to any identity. In the snippet above, the `AdminUser` identity is mapped to the service's definition under the friendly name `WebAdmin`.

3. Update the service manifest to add a **ManagedIdentity** element inside the **Resources** section with the name matching the value of the `ServiceIdentityRef` setting from the `IdentityBindingPolicy` definition in the application manifest:

**ServiceManifest.xml**

  ```xml
    <Resources>
      ...
      <ManagedIdentities DefaultIdentity="WebAdmin">
        <ManagedIdentity Name="WebAdmin" />
      </ManagedIdentities>
    </Resources>
  ```
This is the equivalent mapping of an identity to a service as described above, but from the perspective of the service definition. The identity is referenced here by its friendly name (`WebAdmin`), as declared in the application manifest.
  
## Related articles

* Review [managed identity support](./concepts-managed-identity.md) in Azure Service Fabric

* [Deploy a new](./configure-new-azure-service-fabric-enable-managed-identity.md) Azure Service Fabric cluster with managed identity support 

* [Enable managed identity](./configure-existing-cluster-enable-managed-identity-token-service.md) in an existing Azure Service Fabric cluster

* Leverage a Service Fabric application's [managed identity from source code](./how-to-managed-identity-service-fabric-app-code.md)

* [Deploy an Azure Service Fabric application with a system-assigned managed identity](./how-to-deploy-service-fabric-application-system-assigned-managed-identity.md)

* [Grant an Azure Service Fabric application access to other Azure resources](./how-to-grant-access-other-resources.md)
