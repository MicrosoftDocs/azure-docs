---
title: Storing and Using Azure Service Fabric Mesh Application Secrets 
description: Service Fabric Mesh supports Secrets as Azure resources. Here’s how to store and manage secrets with your Service Fabric Mesh applications.
author: erikadoyle
ms.author: edoyle
ms.date: 10/25/2018
ms.topic: conceptual
#Customer intent: As a developer, I need to securely deploy Secrets to my Service Fabric Mesh application.
---

# Service Fabric Mesh application secrets

> [!IMPORTANT]
> The preview of Azure Service Fabric Mesh has been retired. New deployments will no longer be permitted through the Service Fabric Mesh API. Support for existing deployments will continue through April 28, 2021.
> 
> For details, see [Azure Service Fabric Mesh Preview Retirement](https://azure.microsoft.com/updates/azure-service-fabric-mesh-preview-retirement/).

Service Fabric Mesh supports Secrets as Azure resources. A Service Fabric Mesh secret can be any sensitive text information such as storage connection strings, passwords, or other values that should be stored and transmitted securely.

![Mesh Secrets Overview][sf-mesh-secrets-overview]

## Mesh secrets resources
A Mesh application Secret consists of:
* A **Secrets** resource, which is a container that stores text secrets. Secrets contained within the **Secrets** resource are stored and transmitted securely.
* One or more **Secrets/Values** resources that are stored in the **Secrets** resource container. Each **Secrets/Values** resource is distinguished by a version number.

## Next steps 
To learn more about Service Fabric Mesh Secrets, see:
- [Manage Service Fabric Mesh Application Secrets](service-fabric-mesh-howto-manage-secrets.md)
- [Introduction to Service Fabric Resource Model](service-fabric-mesh-service-fabric-resources.md)

<!-- pics -->
[sf-mesh-secrets-overview]: ./media/service-fabric-mesh-secrets-overview/MeshAppSecretsOverview.png
