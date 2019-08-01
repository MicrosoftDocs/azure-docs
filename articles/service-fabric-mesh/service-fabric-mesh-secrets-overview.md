---
title: Storing and Using Azure Service Fabric Mesh Application Secrets | Microsoft Docs
description: Storing and using Service Fabric Mesh Secrets.
services: service-fabric-mesh
keywords: secrets
author: v-steg
ms.author: jeconnoc
ms.date: 10/25/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: jeconnoc
#Customer intent: As a developer, I need to securely deploy Secrets to my Service Fabric Mesh application.
---

# Service Fabric Mesh application secrets
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
