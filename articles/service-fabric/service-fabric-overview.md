---
title: Overview of Azure Service Fabric
description: Service Fabric is a distributed systems platform for building scalable, reliable, and easily managed microservices.
ms.topic: overview
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Overview of Azure Service Fabric

Azure Service Fabric is a [distributed systems platform](#container-orchestration) that makes it easy to package, deploy, and manage scalable and reliable microservices and containers. Service Fabric also addresses the significant challenges in [developing and managing](#application-lifecycle-management) cloud native applications.

A key differentiator of Service Fabric is its strong focus on building stateful services. You can use the Service Fabric [programming model](#stateless-and-stateful-microservices) or run containerized stateful services written in any language or code. You can create [Service Fabric clusters anywhere](#any-os-any-cloud), including Windows Server and Linux on premises and other public clouds, in addition to Azure.

![The Service Fabric platform provides lifecycle management, availability, orchestration, programming models, health and monitoring, dev and ops tooling, and autoscaling--in Azure, on premises, in other clouds, and on your dev machine][Image1]

Service Fabric powers many Microsoft services today, including Azure SQL Database, Azure Cosmos DB, Cortana, Microsoft Power BI, Microsoft Intune, Azure Event Hubs, Azure IoT Hub, Dynamics 365, Skype for Business, and many core Azure services.

## Container orchestration

Service Fabric is Microsoft's [container orchestrator](service-fabric-cluster-resource-manager-introduction.md) for deploying and managing microservices across a cluster of machines, benefiting from the lessons learned running  Microsoft services at massive scale. Service Fabric can deploy applications in seconds, at high density with hundreds or thousands of applications or containers per machine. With Service Fabric, you can mix both services in processes and services in containers in the same application.

[Learn more about Service Fabric](service-fabric-content-roadmap.md) core concepts, programming models, application lifecycle, testing, clusters, and health monitoring.

## Stateless and stateful microservices

Service Fabric provides a sophisticated, lightweight runtime that supports stateless and stateful microservices. A key differentiator of Service Fabric is its robust support for building stateful services, either with Service Fabric [built-in programming models](service-fabric-choose-framework.md) or  containerized stateful services.

Learn more about [application scenarios](service-fabric-application-scenarios.md) that benefit from Service Fabric stateful services.

## Application lifecycle management

Service Fabric provides support for the full application lifecycle and CI/CD of cloud applications including containers: development through deployment, daily monitoring, management, and maintenance, to eventual decommissioning. Service Fabric is integrated with CI/CD tools such as [Azure Pipelines](https://www.visualstudio.com/team-services/), [Jenkins](https://jenkins.io/index.html), and [Octopus Deploy](https://octopus.com/) and can be used with any other popular CI/CD tool.

For more information about application lifecycle management, read [Application lifecycle](service-fabric-application-lifecycle.md). For deploying existing applications to Service Fabric, see [Deploy a guest executable](service-fabric-deploy-existing-app.md).

## Any OS, any cloud

You can create clusters for Service Fabric in many environments, including [Azure or on premises](service-fabric-deploy-anywhere.md), on [Windows Server or Linux](service-fabric-linux-windows-differences.md). You can even create clusters on other public clouds. The development environment in the Service Fabric SDK is identical to the production environment, with no emulators involved. In other words, what runs on your local development cluster is what deploys to your clusters in other environments.

For [Windows development](service-fabric-get-started.md), the Service Fabric .NET SDK is integrated with Visual Studio and PowerShell. For [Linux development](service-fabric-get-started-linux.md), the Service Fabric Java SDK is integrated with Eclipse, and Yeoman is used to generate templates for Java, .NET Core, and container applications.

## Compliance

Azure Service Fabric Resource Provider is available in all Azure regions and is compliant with all Azure compliance certifications, including: SOC, ISO, PCI DSS, HIPAA, and GDPR. For a complete list, see
[Microsoft compliance offerings](/compliance/regulatory/offering-home).

## Next steps

Create and deploy your first application on Azure Service Fabric:

> [!div class="nextstepaction"]
> [Service Fabric quickstart][sf-quickstart]

[Image1]: media/service-fabric-overview/Service-Fabric-Overview.png
[sf-quickstart]: ./service-fabric-quickstart-dotnet.md
