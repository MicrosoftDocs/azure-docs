---
title: Configure and use applications with managed identity on a Service Fabric managed cluster
description: Learn how to configure, and use an application with managed identity on an Azure Resource Manager (ARM) template deployed Azure Service Fabric managed cluster.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-arm-template
services: service-fabric
ms.date: 07/11/2022
---

# Deploy an application with Managed Identity to a Service Fabric managed cluster

To deploy a Service Fabric application with managed identity, the application needs to be deployed through Azure Resource Manager, typically with an Azure Resource Manager template. For more information on how to deploy Service Fabric application through Azure Resource Manager, see [Deploy an application to a managed cluster using Azure Resource Manager](how-to-managed-cluster-app-deployment-template.md).

> [!NOTE] 
> 
> Applications which are not deployed as an Azure resource **cannot** have Managed Identities. 
>
> Service Fabric application deployment with Managed Identity is supported with API version `"2021-05-01"` on managed clusters.

Sample managed cluster templates are available here: [Service Fabric managed cluster templates](https://github.com/Azure-Samples/service-fabric-cluster-templates)

## Managed identity support in Service Fabric managed cluster

When a Service Fabric application is configured with [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) and deployed to the cluster it will trigger automatic configuration of the *Managed Identity Token Service* on the Service Fabric managed cluster. This service is responsible for the authentication of Service Fabric applications using their managed identities, and for obtaining access tokens on their behalf. Once the service is enabled, you can see it in Service Fabric Explorer under the **System** section in the left pane, running under the name **fabric:/System/ManagedIdentityTokenService**.

>[!NOTE]
>The first time an application is deployed with Managed Identities you should expect to see a one-time longer deployment due to the automatic cluster configuration change. You should expect this to take from 15 minutes for a zonal cluster to 45 minutes for a zone-spanning cluster. If there are any other deployments in flight, MITS configuration will wait for those to complete first.

Application resource supports assignment of both SystemAssigned or UserAssigned and assignment can be done as shown in below snippet.

```json
{
  "type": "Microsoft.ServiceFabric/managedclusters/applications",
  "apiVersion": "2021-05-01",
  "identity": {
    "type": "SystemAssigned",
    "userAssignedIdentities": {}
  },
}

```
[Complete JSON reference](/azure/templates/microsoft.servicefabric/2021-05-01/managedclusters/applications?tabs=json)

## User-Assigned Identity

To enable application with User-Assigned identity, first add the **identity** property to the application resource with type **userAssigned** and the referenced user-assigned identities. Then add a **managedIdentities** section inside the **properties** section for the **application** resource which contains a list of friendly name to principalId mapping for each of the user-assigned identities. For more information about User Assigned Identities see [Create, list or delete a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-powershell.md).

### Application template

To enable application with User Assigned identity, first add **identity** property to the application resource with type **userAssigned** and the referenced user assigned identities, then add a **managedIdentities** object inside the **properties** section that contains a list of friendly name to principalId mapping for each of the user assigned identities.

```json
{
  "apiVersion": "2021-05-01",
  "type": "Microsoft.ServiceFabric/managedclusters/applications",
  "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'))]",
  "location": "[resourceGroup().location]",
  "dependsOn": [
    "[parameters('applicationVersion')]",
    "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('userAssignedIdentityName'))]"
  ],
  "identity": {
    "type" : "userAssigned",
    "userAssignedIdentities": {
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('userAssignedIdentityName'))]": {}
    }
  },
  "properties": {
    "version": "[parameters('applicationVersion')]",
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

## System-assigned managed identity

### Application template

To enable application with a system-assigned managed identity, add the **identity** property to the application resource, with type **systemAssigned** as shown in the example below:

```json
    {
      "apiVersion": "2021-05-01",
      "type": "Microsoft.ServiceFabric/managedclusters/applications",
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
```
This property declares (to Azure Resource Manager, and the Managed Identity and Service Fabric Resource Providers, respectively, that this resource shall have an implicit (`system assigned`) managed identity.

### Application and service package

1. Update the application manifest to add a **ManagedIdentity** element in the **Principals** section, containing a single entry as shown below:

    **ApplicationManifest.xml**

    ```xml
    <Principals>
      <ManagedIdentities>
        <ManagedIdentity Name="SystemAssigned" />
      </ManagedIdentities>
    </Principals>
    ```
    This maps the identity assigned to the application as a resource to a friendly name, for further assignment to the services comprising the application. 

2. In the **ServiceManifestImport** section corresponding to the service that is being assigned the managed identity, add an **IdentityBindingPolicy** element, as indicated below:

    **ApplicationManifest.xml**

      ```xml
        <ServiceManifestImport>
          <Policies>
            <IdentityBindingPolicy ServiceIdentityRef="WebAdmin" ApplicationIdentityRef="SystemAssigned" />
          </Policies>
        </ServiceManifestImport>
      ```

    This element assigns the identity of the application to the service; without this assignment, the service will not be able to access the identity of the application. In the snippet above, the `SystemAssigned` identity (which is a reserved keyword) is mapped to the service's definition under the friendly name `WebAdmin`.

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

## Next steps
* [Granting a Service Fabric application's managed identity access to Azure resources on a Service Fabric managed cluster](how-to-managed-cluster-grant-access-other-resources.md)
* [Leverage the managed identity of a Service Fabric application from service code](how-to-managed-identity-service-fabric-app-code.md)
