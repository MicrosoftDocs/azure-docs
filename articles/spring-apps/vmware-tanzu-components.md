---
title: VMware Tanzu components in the Azure Spring Apps Enterprise plan
description: Learn about VMware Tanzu components in the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: taoxu
ms.service: spring-apps
ms.topic: conceptual
ms.date: 06/01/2023
ms.custom: devx-track-java, event-tier1-build-2022, engagement-fy23, references_regions
---

# VMware Tanzu components in the Azure Spring Apps Enterprise plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article describes the VMware Tanzu components offered by the Azure Spring Apps Enterprise plan.

VMware Tanzu components are commercial products in the VMware Tanzu Application Platform, which is an application development platform with a rich set of developer tools. In the Azure Spring Apps Enterprise plan, you develop with Tanzu components as managed resources with no extra operational costs. You can use Tanzu components for a wide range of developer scenarios, including the following scenarios:

- Routing requests.
- Managing APIs.
- Managing application configuration.
- Registering and discovering services.
- Monitoring applications in real-time.
- Accelerating development with project templates.

The Azure Spring Apps Enterprise plan offers the following components:

- VMware Tanzu Build Service
- Spring Cloud Gateway for VMware Tanzu
- API portal for VMware Tanzu
- Application Configuration Service for VMware Tanzu
- VMware Tanzu Service Registry
- Application Live View for VMware Tanzu
- Application Accelerator for VMware Tanzu

You also have the flexibility to enable only the components that you need at any time.

## Tanzu Build Service

Tanzu Build Service uses the open-source Cloud Native Buildpacks project to turn polyglot application source code into container images. These container images facilitate quick deployment into the public cloud for your Spring, Java, NodeJS, Python, Go, and .NET Core applications.

Tanzu Build Service provides the following benefits:

- Automates container creation, management, and governance at enterprise scale.
- Offers a high-level abstraction and balance of control for building applications.
- Reduces the operational burden on developers.
- Supports enterprise IT operators who manage applications at scale.

For more information, see [Use Tanzu Build Service](how-to-enterprise-build-service.md).

## Spring Cloud Gateway

Spring Cloud Gateway is an API gateway solution based on the open-source Spring Cloud Gateway project. You can simplify the routing for internal or external API requests to application services that expose APIs. Spring Cloud Gateway addresses cross-cutting considerations for applications that operate behind the gateway. These considerations include securing, routing, rate limiting, caching, monitoring, resiliency, and hiding applications. You can configure the following features:

- Single sign-on integration with your preferred identity provider without any additional code or dependencies.
- Dynamic routing rules to applications without any application redeployment.
- Request throttling without any backing services.

For more information, see [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

## API Portal

API portal enables you to find APIs you can use in your own applications. You can view detailed API documentation and try out an API to see if it meets your needs. API portal assembles APIs exposed by Spring Cloud Gateway.

For more information, see [Use API portal for VMware Tanzu](how-to-use-enterprise-api-portal.md).

## Application Configuration Service

Application Configuration Service provides runtime configuration to Spring Boot applications and polyglot applications. Configuration management is hosted in Git repositories to generate runtime configuration properties for applications.

For more information, see [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md).

## Tanzu Service Registry

Tanzu Service Registry provides service registry and discovery capabilities for microservices-based applications and is fully compatible with Eureka server.

For more information, see [Use Tanzu Service Registry](how-to-enterprise-service-registry.md).

## Application Live View

Application Live View is a lightweight insight and troubleshooting tool that helps application developers and operators look inside running applications. Application Live View is based on the concept of Spring Boot Actuators. The application provides information from inside the running processes by using endpoints. Application Live View uses those endpoints to get the data from the application and interact with it.

For more information, see [Use Application Live View with the Azure Spring Apps Enterprise plan](how-to-use-application-live-view.md).

## Application Accelerator

Application Accelerator helps application developers and operators create application accelerators. Accelerators are templates that codify best practices and ensure that important configurations and structures are in place. Developers can bootstrap their applications and immediately get started with feature development. Application operators can create custom accelerators that reflect their desired architectures and configurations and enable fleets of developers to use them. Application Accelerator helps ease operator concerns about whether developers are implementing their best practices.

For more information, see [Use VMware Tanzu Application Accelerator with the Azure Spring Apps Enterprise plan](how-to-use-accelerator.md).

## Next steps

- [Launch your first app](./quickstart.md)
