---
title: Storing state in Service Fabric Mesh applications on Azure | Microsoft Docs
description: Learn about reliably storing state in Service Fabric Mesh applications running on Azure.
services: service-fabric-mesh
keywords: 
author: mani-ramaswamy
ms.author: subramar
ms.date: 06/12/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: timlt
---
# Storing application state in Azure Service Fabric Mesh

Azure Service Fabric Mesh is a fully managed service enabling developers to deploy containerized applications without managing virtual machines, storage, or networking resources. Service Fabric Mesh enables developers to easily build stateful services using either built-in low-latency container volume drivers or reliable collections (for example, dictionary or queue) that can be used with any programming model or framework. 

You can bring existing stateful applications using MongoDb, Cassandra or SQL server or write your own applicatoin. State is made highly available within the application with no external dependencies.   

Using the volume driver for your containers, application state is not lost when the container fails over to a new host in Azure.  


To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)