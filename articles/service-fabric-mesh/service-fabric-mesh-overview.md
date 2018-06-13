---
title: Overview of Azure Service Fabric Mesh
description: An overview of Azure Service Fabric Mesh. With Service Fabric Mesh, you can deploy and scale your application without worrying about the infrastructure needs of your application.
services: Azure Service Fabric Mesh
keywords: 
author: rwike77
ms.author: ryanwi
ms.date: 06/12/2018
ms.topic: overview
ms.service: service-fabric-mesh
manager: timlt
#Customer intent: As a developer, I want to deploy and manage services in containers on a serverless platform.
---

# What is Service Fabric Mesh?

Azure Service Fabric Mesh is a fully managed service that enables developers to deploy containerized applications without managing virtual machines, storage, or networking. Applications hosted on Service Fabric Mesh run and scale without you worrying about the infrastructure powering it.  Service Fabric Mesh consists of clusters of thousands of machines at geo-scale.  These clusters span Azure availabilty zones and regions for high availability and reliability. Simply upload your code and specify scale, availability requirements, and resource limits.  Service Fabric Mesh automatically allocates the infrastructure needed by your application and also handles infrastructure failures, making sure your applications are highly-available.  All cluster operations are hidden from the developer.  You only need to care about the health and responsiveness of your application, not the infrastructure.  

[!INCLUDE [preview note](./includes/include-preview-note.md)]

This article provides an overview of the key benefits of Service Fabric Mesh.

## Great developer experience
tooling in Visual Studio and Visual Studio Code.

You can:
- "Lift and shift" existing applications into containers.  Take advantage of containerization to modernize your legacy applications. 
- Build new microservices applications in containers. Deploy new applications at scale and integrate with other Azure services or legacy applications running in containers. Each containerized microservice is part of a secure, network isolated application with resource governance policies defined for CPU cores, memory, disk space, and more.
- Integrate with and extend existing applications without making changes to those applications. Bring your own virtual network that provides connectivity to the existing application from the new application.  
- Modernize your existing Cloud Services applications by migrating into containers.  

## Simple operational lifecycle
Easily manage running applications including application upgrades and versioning, monitoring applications and debugging in production environments. These applications can just be a single container instance or can consist of multiple containers isolated within their own network. It also includes the operational experience of running container efficiently, with fast deployment, placement and failover times .

You can:

- Deploy and manage applications without having to explicitly provision and manage infrastructure.  Service Fabric Mesh provisions, upgrades, patches, and maintains the underlying clusters for you.
- Setup continous itegration using the integrated tooling to easily package and deploy applications.
- containers, services and applications are ARM resources and so the customer can leverage all the features that any ARM resources get like audit trail and RBAC
- use the portal, ARM or CLI/PS to deploy and manage resources. 
- platform emits operational and diagnostic traces for the resources it supports, the Customer can use the application insights integration (default) or plug their own tool of choice to set up operational monitoring and alerting. 
-  application model emits detailed application diagnostics information out of the box that is routed to application insights (default). A customer can either choose to use application insights to access the application diagnostics or can plug their own tool of choice. 
- optimize the resources usage by specifying auto-scale rules for the containers, in the application definition.  
- enable chaos testing on the applications they have deployed in seabreeze. Customers can use the Fault Injection to generate controlled Chaos for verification of the services ability to handle various failures in production.
- supports containers with multiple IPs, in addition to providing an isolated VNET per application. This provides the customer with ability to isolate the network traffic to and from the containers. This becomes a very powerful capability when combined with Hyper-V containers, in providing network isolation and security boundaries for applications.

## Mission critical platform and applications

You can:
- use the platform for HA, scale in/out, discoverability, orchestration, message routing, reliable messaging, no-downtime upgrades, security/secrets management, Disaster recovery, state management, configuration management, and distributed transactions
- capabilities are exposed via REST endpoints with ability to generate language specific bindings via Swagger. The customers applications take advantage of the platform capabilities via REST of published language bindings. 
- perform multi-region application deployments for geo-reliability across a geo-political region
- achieve all the Security and Compliance benchmarks that Azure achieves. To start with it would archive the ones that the service fabric service already has achieved. This will ensure that the customer can confidently bet on seabreeze as a compliant and secure platform. 

## Next steps

It only takes a few steps to deploy a sample project with the Azure CLI. For more information, see [Deploy a container](service-fabric-mesh-quickstart-deploy-container.md). 

If you're using Visual Studio, try the [Create an ASP.NET Core website](service-fabric-mesh-tutorial-create-dotnetcore.md) tutorial.



<!-- Links -->

[service-fabric-overview]: ../service-fabric/service-fabric-overview.md