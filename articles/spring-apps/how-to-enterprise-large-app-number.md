---
title: How to deploy applications at scale in Azure Spring Apps in the Enterprise plan
description: Learn how to deploy applications at scale in the Enterprise plan for Azure Spring Apps and learn about the restrictions.
author: karlerickson
ms.author: xiading
ms.service: spring-apps
ms.topic: how-to
ms.date: 06/26/2023
---

# Deploy applications at scale in Azure Spring Apps in the Enterprise plan (Preview)

This article applies to ❌ Basic/Standard ✔️ Enterprise

This article shows you how to deploy a large number of applications in the Enterprise plan for Azure Spring Apps. The article also explains what kind of restrictions there are in the preview stage. The Enterprise plan is designed for running large-scale production workloads, and it supports up to 1000 application instances per service instance. For your production environment, 500 is still the recommended maximum application instance count.

## Definition

The Azure Spring Apps Enterprise plan supports up to 1000 application instances per service instance. The number of application instances is the sum of all the application instances in the service instance. For example, if you have 100 applications in the service instance and each application has 10 replicas, then the total number of application instances is 1000.

## Configure proper subnet ranges

If you'd like to deploy an Azure Spring Apps instance in your virtual network, follow the instructions in [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).

To support the large workload, the subnet ranges should be large enough to support the number of application instances. For subnets, Azure reserves five IP addresses, and Azure Spring Apps requires at least three IP addresses. We recommend that you preserve at least the `/24` subnet ranges for the apps subnet.

## Restrictions

Support for 1000 app instances is currently in the preview stage. The following sections describe the restrictions that you should understand when you try this feature.

### VMware Tanzu® Build Service™

The build number using the same builder should be less than 200. Otherwise, it's hard to reconcile all builds when the builder updates.

The builds are generated when you deploy apps. We recommend that you create multiple customized builders to deploy apps when you have more than 200 apps or deployments.

### Application Configuration Service for Tanzu

Application Configuration Service for Tanzu is a central place to manage external properties for applications across all environments. This service is offered in two versions: Gen1 and Gen2. The Gen1 version mainly serves existing customers for backward compatibility purpose. Gen2 uses flux as the back end to communicate with Git repositories. Gen2 provides better performance compared with Gen1.

The following table shows the benchmark for refresh times under different numbers of patterns. Be sure to carefully control the configuration pattern number based on these values to avoid unacceptable refresh performance.

| Application Configuration Service Generation | Duration to refresh under 100 patterns | Duration to refresh under 250 patterns | Duration to refresh under 500 patterns |
|----------------------------------------------|----------------------------------------|----------------------------------------|----------------------------------------|
| Gen1                                         | 330s                                   | 840s                                   | 1500s                                  |
| Gen2                                         | 13s                                    | 100s                                   | 378s                                   |

### Spring Cloud Gateway for VMware Tanzu

Spring Cloud Gateway for VMware Tanzu handles the cross-cutting concerns for API development teams, such as single sign-on (SSO), access control, rate-limiting, resiliency, security, and more. You can accelerate API delivery using modern cloud native patterns using your choice of programming language for API development. Spring Cloud Gateway is a critical component for a microservices architecture.

The performance of the gateway is closely related to the number of routes. In general, we recommend that you don't exceed 500 routes. When the gateway can't handle some requests with reasonably low latency or without errors, it can stress a gateway instance's performance. If you handle a high volume of traffic, you should consider increasing the memory requested for API gateway instances so that each pod can handle more requests per second.

Also, the current version of the gateway has a limitation that when it's rolling restarted, it may take longer to synchronize a large number of routes. This situation can cause incomplete route updates during the process. We're actively working on fixing this limitation and will provide an update through our documentation.

## Next steps

- [Build and deploy apps to Azure Spring Apps](quickstart-deploy-apps.md)
- [Scale an application in Azure Spring Apps](how-to-scale-manual.md)
