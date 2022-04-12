---
title: Migrate an Azure Spring Cloud Basic or Standard tier instance to Enterprise Tier
titleSuffix: Azure Spring Cloud Enterprise Tier
description: How to migrate an Azure Spring Cloud Basic or Standard tier instance to Enterprise Tier
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 04/12/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Migrate an Azure Spring Cloud Basic or Standard tier instance to Enterprise Tier

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article tells you how to migrate an existing application in Basic or Standard tier to Enterprise tier.

If you already have an Azure Spring Cloud Basic or Standard tier instance and want to migrate it to Enterprise tier, you need to [provision a new Enterprise Tier instance](./quickstart-provision-service-instance-enterprise.md). However, you don't have to change any code in your applications.

VMware Tanzu components will replace the OSS Spring Cloud components in Enterprise tier to provide more feature support.

## Application Configuration Service for Tanzu

In Enterprise tier, Application Configuration Service is provided to support externalized configuration for your apps. Managed Spring Cloud Config Server is not available in Enterprise tier and only available in Basic and Standard tiers of Azure Spring Cloud. Please refer to [Use Application Configuration Service for Tanzu](./how-to-enterprise-application-configuration-service.md) for more information.

## Service Registry for Tanzu

[Service Registry](https://docs.pivotal.io/spring-cloud-services/2-1/common/service-registry/index.html) is one of the proprietary VMware Tanzu components. It provides your apps with an implementation of the Service Discovery pattern, one of the key tenets of a microservice-based architecture. Please refer to [Use Tanzu Service Registry](./how-to-enterprise-service-registry.md) for more information.

## Spring Cloud Gateway for Tanzu

[Spring Cloud Gateway for Tanzu](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/index.html) is one of the commercial VMware Tanzu components. It's based on the open-source Spring Cloud Gateway project. Spring Cloud Gateway for Tanzu handles cross-cutting concerns for API development teams, such as Single Sign-On (SSO), access control, rate-limiting, resiliency, security, and more. Please refer to [Use Spring Cloud Gateway for Tanzu](./how-to-use-enterprise-spring-cloud-gateway.md) for more information.

## Next steps

- [Azure Spring Cloud](index.yml)
