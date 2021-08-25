---
title: Deploy a Service Fabric app with system-assigned MI
description: This article shows you how to assign a system-assigned managed identity to an Azure Service Fabric application

ms.topic: article
ms.date: 07/25/2019
---

# Deploy Service Fabric application with system-assigned managed identity

In order to access the managed identity feature for Azure Service Fabric applications, you must first enable the Managed Identity Token Service on the cluster. This service is responsible for the authentication of Service Fabric applications using their managed identities, and for obtaining access tokens on their behalf. Once the service is enabled, you can see it in Service Fabric Explorer under the **System** section in the left pane, running under the name **fabric:/System/ManagedIdentityTokenService** next to other system services.

> [!NOTE] 
> Deployment of Service Fabric applications with managed identities are supported starting with API version `"2019-06-01-preview"`. You can also use the same API version for application type, application type version and service resources. The minimum supported Service Fabric runtime is 6.5 CU2. In additoin, the build / package environment should also have the SF .Net SDK at CU2 or higher

## System-assigned managed identity

### Application template

To enable application with a system-assigned managed identity, add the **identity** property to the application resource, with type **systemAssigned** as shown in the example below:

```json
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

## Next Steps
* Review [managed identity support](./concepts-managed-identity.md) in Azure Service Fabric
* [Deploy a new](./configure-new-azure-service-fabric-enable-managed-identity.md) Azure Service Fabric cluster with managed identity support 
* [Enable managed identity](./configure-existing-cluster-enable-managed-identity-token-service.md) in an existing Azure Service Fabric cluster
* Leverage a Service Fabric application's [managed identity from source code](./how-to-managed-identity-service-fabric-app-code.md)
* [Deploy an Azure Service Fabric application with a user-assigned managed identity](./how-to-deploy-service-fabric-application-user-assigned-managed-identity.md)
* [Grant an Azure Service Fabric application access to other Azure resources](./how-to-grant-access-other-resources.md)
