---
title: VMware Tanzu components
description: Learn about what are Tanzu components in enterprise tier
author: taoxu0903
ms.author: taoxu0903
ms.service: spring-apps
ms.topic: concept
ms.date: 04/25/2023
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022, engagement-fy23, references_regions
---

# VMware Tanzu components
**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

VMware Tanzu components are commercial products offered in VMware Tanzu Application Platform, which is an application development platform with a rich set of developer tools. In Azure Spring Apps Enterprise, we offer them as managed components with no operation cost from customers to help with a wide range of developer scenarios such as routing requests, managing APIs, managing application configuration, registering and discovering services, monitoring applications in real-time, and accelerating development with project templates.

The following are the Tanzu components we offer:

- Tanzu Build Service
- Application Configuration Service for Tanzu
- Tanzu Service Registry
- Spring Cloud Gateway for Tanzu
- API portal for VMware Tanzu
- Application Live View for VMware Tanzu
- Application Accelerator for VMware Tanzu

We also offer you the flexibility to enable only the ones that you really need at any time. To learn more about each Tanzu component, please refer to the sections below.

## Tanzu Build Service

Tanzu Build Service uses the open-source Cloud Native Build packs project to turn polyglot application source code into container images. It automates container creation, management and governance at enterprise scale. Tanzu Build Service offers a higher-level abstraction for building apps and provides a balance of control that reduces the operational burden on developers and supports enterprise IT operators who manage applications at scale. If you would like to quickly deploy your applications from source code into public cloud for your Spring, Java, NodeJS, Python, Go and .NET Core applications, that's the good choice for you.

You can learn more about it at  [https://learn.microsoft.com/en-us/azure/spring-apps/how-to-enterprise-build-service](https://learn.microsoft.com/en-us/azure/spring-apps/how-to-enterprise-build-service).

## Spring Cloud Gateway

Spring Cloud Gateway is an API gateway solution based on the open-source Spring Cloud Gateway project. It provides a simple means to route internal or external API requests to application services that expose APIs and addresses cross-cutting considerations for applications behind the Gateway such as securing, routing, rate limiting, caching, monitoring, resiliency and hiding applications. You can configure:

- Single sign-on integration with your preferred identity provider without any additional code or dependencies.
- Dynamic routing rules to applications without any application redeployment.
- Request throttling without any backing services.

You can learn more about it at [https://learn.microsoft.com/en-us/azure/spring-apps/how-to-configure-enterprise-spring-cloud-gateway](https://learn.microsoft.com/en-us/azure/spring-apps/how-to-configure-enterprise-spring-cloud-gateway).

## API Portal

API portal enables API consumers to find APIs they can use in their own applications. Consumers can view detailed API documentation and try out an API to see if it meets their needs. API portal assembles APIs exposed by Spring Cloud Gateway.

You can learn more about it at  [https://learn.microsoft.com/en-us/azure/spring-apps/how-to-use-enterprise-api-portal](https://learn.microsoft.com/en-us/azure/spring-apps/how-to-use-enterprise-api-portal?tabs=Portal).

## Application Configuration Service

Application Configuration Service provides runtime configuration to Spring Boot applications and any polyglot applications by enabling configuration management to be hosted in Git repositories on different branches and in directories that could be used to generate runtime configuration properties for applications.

You can learn more about it at  [https://learn.microsoft.com/en-us/azure/spring-apps/how-to-enterprise-application-configuration-service](https://learn.microsoft.com/en-us/azure/spring-apps/how-to-enterprise-application-configuration-service?tabs=Portal).

## Tanzu Service Registry

Tanzu Service Registry provides service registry and discovery capabilities for microservices-based applications and is fully compatible with Eureka server.

You can learn more about it at  [https://learn.microsoft.com/en-us/azure/spring-apps/how-to-enterprise-service-registry](https://learn.microsoft.com/en-us/azure/spring-apps/how-to-enterprise-service-registry?tabs=Portal).

## Application Live View

Application Live View is a lightweight insight and troubleshooting tool that helps application developers and application operators look inside running applications.It is based on the concept of Spring Boot Actuators. The application provides information from inside the running processes by using endpoints. Application Live View uses those endpoints to get the data from the application and to interact with it.

You can learn more about it at  [https://learn.microsoft.com/en-us/azure/spring-apps/how-to-use-application-live-view](https://learn.microsoft.com/en-us/azure/spring-apps/how-to-use-application-live-view?tabs=Portal).

## Application Accelerator

Application Accelerator helps app developers and app operators create application accelerators. Accelerators are templates that codify best practices and ensure that important configurations and structures are in place. Developers can bootstrap their applications and get started with feature development right away. Application operators can create custom accelerators that reflect their desired architectures and configurations and enable fleets of developers to use them. This helps ease operator concerns about whether developers are implementing their best practices.

You can learn more about it at  [https://learn.microsoft.com/en-us/azure/spring-apps/how-to-use-accelerator](https://learn.microsoft.com/en-us/azure/spring-apps/how-to-use-accelerator?tabs=Portal).
