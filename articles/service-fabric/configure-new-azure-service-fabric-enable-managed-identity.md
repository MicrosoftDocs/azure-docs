---
title: Azure Service Fabric - Deploy a new Azure Service Fabric cluster with support for Managed Identity  | Microsoft Docs
description: This article shows you how to create a new Service Fabric cluster with Managed Identity enabled
services: service-fabric
author: athinanthny

ms.service: service-fabric
ms.topic: article
ms.date: 07/25/2019
ms.author: atsenthi
---

# Create a new Azure Service Fabric cluster with Managed Identity support

In order to access the managed identity feature for Azure Service Fabric applications, you must first enable the Managed Identity Token Service on the cluster. This service is responsible for the authentication of Service Fabric applications using their managed identities, and for obtaining access tokens on their behalf. Once the service is enabled, you can see it in Service Fabric Explorer under the **System** section in the left pane, running under the name **fabric:/System/ManagedIdentityTokenService** next to other system services.

> [!NOTE]
> Service Fabric runtime version 6.5.658.9590 or higher is required to enable the **Managed Identity Token Service**.  

## Enable the Managed Identity Token Service 
To enable the Managed Identity Token Service at cluster creation time, you may use the following snippet in an Azure Resource Manager template:

```json
"fabricSettings": [
    {
        "name": "ManagedIdentityTokenService",
        "parameters": [
            {
                "name": "IsEnabled",
                "value": "true"
            }
        ]
    }
]
```

## Errors

If the deployment fails with this message, it means the cluster is not on the required Service Fabric version (the minimum supported runtime is 6.5 CU2):



```json
{
    "code": "ParameterNotAllowed",
    "message": "Section 'ManagedIdentityTokenService' and Parameter 'IsEnabled' is not allowed."
}
```

## Next steps
* [Deploy an Azure Service Fabric application with a system-assigned managed identity](./how-to-deploy-service-fabric-application-system-assigned-managed-identity.md)
* [Deploy an Azure Service Fabric application with a user-assigned managed identity](./how-to-deploy-service-fabric-application-user-assigned-managed-identity.md)
* [Leverage the managed identity of a Service Fabric application from service code](./how-to-managed-identity-service-fabric-app-code.md)
* [Grant an Azure Service Fabric application access to other Azure resources](./how-to-grant-access-other-resources.md)

## Related Articles
* Review [managed identity support](./concepts-managed-identity.md) in Azure Service Fabric

* [Enable managed identity support in an existing Azure Service Fabric cluster](./configure-existing-cluster-enable-managed-identity-token-service.md)
