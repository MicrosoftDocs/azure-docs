---
title: Azure Service Fabric application and cluster best practices
description: Best practices and design considerations for managing clusters, apps, and services using Azure Service Fabric.
author: peterpogorski

ms.topic: conceptual
ms.date: 06/18/2019
ms.author: pepogors
---

# Azure Service Fabric application and cluster best practices

This article provides links to best practices for managing Azure Service Fabric applications and clusters. We highly recommend that you implement these practices to optimize the reliability of your production environment. Use one of the [Service Fabric cluster templates](https://github.com/Azure-Samples/service-fabric-cluster-templates) to begin designing your production solution, or update your existing template to incorporate these practices.

## Security

* [Best practices for security](service-fabric-best-practices-security.md)

## Networking

* [Best practices for networking](service-fabric-best-practices-networking.md)

## Compute planning and scaling

* [Best practices for compute scaling](service-fabric-best-practices-capacity-scaling.md)
* [Compute capacity planning](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity)

## Infrastructure as code

* [Best practices for implementing infrastructure as code](service-fabric-best-practices-infrastructure-as-code.md)

## Monitoring and diagnostics

* [Best practices for cluster monitoring and diagnostics](service-fabric-best-practices-monitoring.md)

## Application design

* [Best practices for application design](service-fabric-best-practices-applications.md)

## Checklist

After you implement the practices suggested in the previous sections, ensure that you've integrated all the best practices in the production readiness checklist:
* [Azure Service Fabric production readiness checklist](https://docs.microsoft.com/azure/service-fabric/service-fabric-production-readiness-checklist)

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Troubleshoot Service Fabric: [Troubleshooting guides](https://github.com/Azure/Service-Fabric-Troubleshooting-Guides)