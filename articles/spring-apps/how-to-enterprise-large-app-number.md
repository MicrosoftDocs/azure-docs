---
title: How to deploy applications at scale in Azure Spring Apps in the Enterprise plan
description: Learn how to deploy applications at scale in the Enterprise plan for Azure Spring Apps and what's the restrictions in it.
author: karlerickson
ms.author: xiading
ms.service: spring-apps
ms.topic: how-to
ms.date: 06/17/2023
---

# Deploy applications at scale in Azure Spring Apps in the Enterprise plan (Preview)

This article applies to ❌ Basic/Standard ✔️ Enterprise

The Enterprise plan is designed for running large-scale production workloads. It supports up to 1000 application instances per service instance. This article shows how to deploy large number of applications in the Enterprise plan for Azure Spring Apps and what kind of restrictions are there under preview stage.

## Definition

It supports up to 1000 application instances per service instance in the Enterprise plan for Azure Spring Apps. The number of application instances is the sum of all the application instances in the service instance. For example, if you have 100 applications in the service instance, each application has 10 replicas, then the total number of application instances is 1000. 

## Configure proper subnet-ranges
If you would like to deploy an Azure Spring Apps instance in your virtual network, you need to follow [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md). 
Note that in order to support the large workload, the subnet-ranges should be large enough to support the number of application instances. For subnets, Azure reserves five IP addresses, and Azure Spring Apps requires at least three IP addresses. It is recommended to preserve at least /24 subnet-ranges for apps subnet.

## Restrictions

The support of 1000 app instances is under preview stage now and below are the restrictions that you should understand well in trying out.

### VMware Tanzu® Build Service™ 

The Builds number using the same builder should less than 200. Otherwise, it's hard to reconcile all builds when the builder updates.

The Builds can be generated when you deploy apps. We recommend to create multiple customized builders to deploy apps when you have more than 200 apps/deployments.

### Application Configuration Service for Tanzu

Application Configuration Service for Tanzu is a central place to manage external properties for applications across all environments. It is offered in two versions: Gen1 and Gen2.  Gen1 version mainly serves for existing customers for back compatibility purpose while Gen2 uses flux as the backend to communicate with git repositories and provides much better performance comparing with Gen1.

Below is the benchmark to the refresh time under different number of patterns. Please carefully control the configuration pattern number based on it to avoid unacceptable refresh performance.

| Application Configuration Service Generation  | Duration to refresh under 100 patterns |  Duration to refresh under 250 patterns  | Duration to refresh under 500 patterns |
|------|---------|----------|--------|
| Gen1 |  330s   |   840s   |  1500s |
| Gen2 |   13s   |   100s   |   378s |


### Spring Cloud Gateway for VMware Tanzu

Spring Cloud Gateway for VMware Tanzu handles the cross-cutting concerns for API development teams, such as single sign-on (SSO), access control, rate-limiting, resiliency, security, and more. You can accelerate API delivery using modern cloud native patterns using your choice of programming language for API development. It is a critical component for microservices architecture.

The performance of the gateway is closely related to the number of routes. In general, we do not recommend exceeding 500 routes. When some of those requests cannot be handled with reasonably low latency or without errors, this can stress an gateway instance's performance. If you handle a high volume of traffic, you may consider to increasing memory requested for API gateway instances so that each pod can handle more requests per second.
Additionally, the current version of the gateway has a limitation that when it is rolling restarted, it may take longer to synchronize a large number of routes, resulting in incomplete route updates during the process. We are actively working on fixing this limitation and will provide an update through our documentation.

---

## Next steps

- [Build and deploy apps to Azure Spring Apps](quickstart-deploy-apps.md)
- [Scale an application in Azure Spring Apps](how-to-scale-manual.md)
