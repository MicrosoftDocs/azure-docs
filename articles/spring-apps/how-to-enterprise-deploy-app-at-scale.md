---
title: Scale out to deploy over 500 and up to 1000 application instances using Azure Spring Apps Enterprise
description: Learn how to deploy applications at scale in the Enterprise plan for Azure Spring Apps and learn about the restrictions.
author: karlerickson
ms.author: xiading
ms.service: spring-apps
ms.topic: how-to
ms.date: 07/05/2023
---

# Scale out to deploy over 500 and up to 1000 application instances using Azure Spring Apps Enterprise

This article applies to ❌ Basic/Standard ✔️ Enterprise

This article guides you on deploying up to 1000 application instances in Azure Spring Apps Enterprise. The feature supporting deployment of more than 500 instances is currently in Preview. This article outlines the limitations during the Preview stage. The Enterprise plan, crafted for handling substantial production workloads, supports a maximum of 1000 application instances per service. However, we recommend using a maximum of 500 instances in your production environment.

## Definition

The Azure Spring Apps Enterprise plan supports up to 1000 application instances per service instance. The number of application instances is the sum of all the application instances in the service instance. For example, if you have 100 applications in the service instance and each application has 10 replicas, then the total number of application instances is 1000.

## Configure proper subnet ranges

When you deploy Azure Spring Apps in an Azure virtual network, you need to configure the proper subnet ranges for your apps and services. The subnet ranges determine how many IP addresses are available for your apps and services to use. If the subnet ranges are too small, you might run out of IP addresses and encounter errors or failures.

To avoid this problem, you should reserve subnet ranges that are large enough to support the number of application instances. For subnets, Azure reserves five IP addresses, and Azure Spring Apps requires at least three IP addresses. We recommend that you reserve at least the `/24` subnet ranges for the apps subnet.

For more information about how to deploy an Azure Spring Apps instance in your virtual network, see [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).

## Restrictions

Support for 1000 app instances is currently in the preview stage. The following sections describe the restrictions that you should understand when you try this feature.

### VMware Tanzu Build Service

VMware Tanzu Build Service automates container creation, management, and governance at enterprise scale. Tanzu Build Service uses the buildpacks project to turn application source code into container images.

The builder is a Tanzu Build Service resource, which contains a set of buildpacks and a stack used in the process of building source code. The build number using the same builder should be less than 200. Otherwise, it's hard to reconcile all builds when the builder updates.

The builds are generated when you deploy apps. We recommend that you create multiple customized builders to deploy apps when you have more than 200 apps or deployments.

### Application Configuration Service for Tanzu

Application Configuration Service for Tanzu is a central place to manage external properties for applications across all environments. This service is offered in two versions: Gen1 and Gen2. The Gen1 version mainly serves existing customers for backward compatibility purpose. Gen2 uses flux as the back end to communicate with Git repositories. Gen2 provides better performance compared to Gen1.

The following table shows the benchmark for refresh times under different numbers of patterns. Be sure to carefully control the configuration pattern number based on these values to avoid unacceptable refresh performance.

| Application Configuration Service generation | Duration to refresh under 100 patterns | Duration to refresh under 250 patterns | Duration to refresh under 500 patterns |
|----------------------------------------------|----------------------------------------|----------------------------------------|----------------------------------------|
| Gen1                                         | 330s                                   | 840s                                   | 1500s                                  |
| Gen2                                         | 13s                                    | 100s                                   | 378s                                   |

### Spring Cloud Gateway for VMware Tanzu

Spring Cloud Gateway for VMware Tanzu handles the cross-cutting concerns for API development teams, such as single sign-on (SSO), access control, rate-limiting, resiliency, security, and more. You can accelerate API delivery using modern cloud native patterns using your choice of programming language for API development. Spring Cloud Gateway is a critical component for a microservices architecture.

The performance of the gateway is closely related to the number of routes. In general, we recommend that you don't exceed 500 routes. When the gateway can't handle some requests with reasonably low latency or without errors, it can stress a gateway instance's performance.

Spring Cloud Gateway is able to handle a high volume of traffic. To support the traffic, you should consider increasing the memory requested for API gateway instances so that each pod can handle more requests per second. To configure autoscale rules for the gateway to perform best when demand changes, see the [Set up autoscale settings for VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md#set-up-autoscale-settings) section in [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

Spring Cloud Gateway supports rolling restarts to ensure zero downtime and disruption. However, the current version of the gateway has a limitation that when it's rolling restarted, it may take longer to synchronize a large number of routes. This situation can cause incomplete route updates during the process. We're actively working on fixing this limitation and will provide an update through our documentation.

## Next steps

- [Build and deploy apps to Azure Spring Apps](quickstart-deploy-apps.md)
- [Scale an application in Azure Spring Apps](how-to-scale-manual.md)
