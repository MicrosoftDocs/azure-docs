---
title: Introduction to the Fitness Store Sample App
titleSuffix: Azure Spring Apps Enterprise plan
description: Describes the sample app used in this series of quickstarts for deployment to the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: azure-spring-apps
ms.topic: quickstart
ms.date: 06/27/2024
ms.custom: devx-track-java
---

# Introduction to the Fitness Store sample app

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This quickstart describes the [fitness store](https://github.com/Azure-Samples/acme-fitness-store) sample application, which shows you how to deploy polyglot apps to an Azure Spring Apps Enterprise plan instance. You see how polyglot applications are built and deployed using Azure Spring Apps Enterprise plan capabilities. These capabilities include Tanzu Build Service, Service Discovery, externalized configuration with Application Configuration Service, application routing with Spring Cloud Gateway, logs, metrics, and distributed tracing.

The following diagram shows a common application architecture:

:::image type="content" source="media/quickstart-sample-app-acme-fitness-store-introduction/architecture.png" alt-text="Diagram that shows the architecture of the Fitness Store application." lightbox="media/quickstart-sample-app-acme-fitness-store-introduction/architecture.png" border="false":::

This architecture shows an application composed of smaller applications with a gateway, multiple databases, security services, monitoring, and automation.

This quickstart applies this architecture to a Fitness Store application. This application is composed of the following services split up by domain:

- Four Java Spring Boot applications:
  - **Catalog Service** contains an API for fetching available products.
  - **Payment Service** validates and processes payments for users' orders.
  - **Identity Service** provides reference to the authenticated user.
  - **Assist Service** provides AI functionality to the fitness store.

- One Python application:
  - **Cart Service** manages users' items that have been selected for purchase.

- One ASP.NET Core application:
  - **Order Service** places orders to buy products that are in the users' carts.

- One NodeJS and static HTML application:
  - **Frontend** is the shopping application that depends on the other services.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md)
