---
title: Azure Service Fabric - Set up an application with Managed Identity | Microsoft Docs
description: This article shows you how to set up a Service Fabric application with Managed Identity
services: service-fabric
author: athinanthny

ms.service: service-fabric
ms.topic: article
ms.date: 07/25/2019
ms.author: atsenthi
---

# Deploy Service Fabric application with Managed Identity

To deploy a Service Fabric application with Managed Identity, the application needs to be deployed through Azure Resource Manager, typically with an Azure Resource Manager template. Applications created / deployed with the native Service Fabric API cannot have Managed Identities. For more information on how to deploy Service Fabric application through Azure Resource Manager, refer to [Manage applications and services as Azure Resource Manager resources](service-fabric-application-arm-resource.md).

> [!NOTE] 
> Service Fabric application deployment with Managed Identity is supported with API version `"2019-06-01-preview"`. You can also use the same API version for application type, application type version and service resources.

## System Assigned identity

### Application template

To enable application with System Assigned identity, add **identity** property to the application resource with type **systemAssigned** as shown in the example below:


    {
      "apiVersion": "2019-06-01-preview",
      "type": "Microsoft.ServiceFabric/clusters/applications",
      "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'))]",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[concat('Microsoft.ServiceFabric/clusters/', parameters('clusterName'), '/applicationTypes/', parameters('applicationTypeName'), '/versions/', parameters('applicationTypeVersion'))]"
      ],
      "identity": {
        "type" : "systemAssigned"
      },
      "properties": {
        "typeName": "[parameters('applicationTypeName')]",
        "typeVersion": "[parameters('applicationTypeVersion')]",
        "parameters": {
        }
      }
    }

### Application and service package

1. Update the application manifest to add a **ManagedIdentity** with name `SystemAssigned` in the **Principals** section.

**ApplicationManifest.xml**

```xml
<Principals>
  <ManagedIdentities>
    <ManagedIdentity Name="SystemAssigned" />
  </ManagedIdentities>
</Principals>
```

2. In the **ServiceManifestImport** section, for the service that uses the Managed Identity add a **IdentityBindingPolicy**, which maps the `SystemAssigned` identity to an identity name to be added to the service later. This enables the service to use the `SystemAssigned` identity of the application.

**ApplicationManifest.xml**

  ```xml
    <ServiceManifestImport>
      <Policies>
        <IdentityBindingPolicy ServiceIdentityRef="WebAdmin" ApplicationIdentityRef="SystemAssigned" />
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

## User-assigned identity

### Application template

To enable an application with a user-assigned identity, first add **identity** property to the application resource with type **userAssigned** and the referenced user-assigned identities, then add a **managedIdentities** object inside the **properties** section which contains a list of friendly name to principalId mapping for each of the user assigned identities.

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

In the example above, the resource name of the user-assigned identity is being used as the friendly name of the managed identity for the application. The following examples assume the actual friendly name is "AdminUser".

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

2. In the **ServiceManifestImport** section, for the service that uses the Managed Identity, add a **IdentityBindingPolicy**, which maps the `AdminUser` identity to the identity name that needs to added to the service manifest later on.

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

TODO: add link to full sample

## Next steps

* [How to Deploy Service Fabric Application with User-Managed Identity](how-to-deploy-service-fabric-application-user-managed-identity.md)

* [How to Deploy Service Fabric Application with System-Managed Identity](how-to-deploy-service-fabric-application-managed-identity.md)

## Related articles
* [How to Grant Service Fabric Application with User Managed Identity to Access Other Azure Resources](how-to-grant-access-other-resources.md)
