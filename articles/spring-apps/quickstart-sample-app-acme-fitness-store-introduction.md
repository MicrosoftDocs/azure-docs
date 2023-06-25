---
title: Introduction to the Fitness Store sample app
titleSuffix: Azure Spring Apps Enterprise plan
description: Describes the sample app used in this series of quickstarts for deployment to the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-apps
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java
---

# Introduction to the Fitness Store sample app

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This quickstart describes the [fitness store](https://github.com/Azure-Samples/acme-fitness-store) sample application, which shows you how to deploy polyglot apps to an Azure Spring Apps Enterprise plan instance. You see how polyglot applications are built and deployed using Azure Spring Apps Enterprise plan capabilities. These capabilities include Tanzu Build Service, Service Discovery, externalized configuration with Application Configuration Service, application routing with Spring Cloud Gateway, logs, metrics, and distributed tracing.

The following diagram shows a common application architecture:

:::image type="content" source="media/quickstart-sample-app-acme-fitness-store-introduction/architecture.png" alt-text="Diagram showing the architecture of the Fitness Store application." lightbox="media/quickstart-sample-app-acme-fitness-store-introduction/architecture.png" border="false":::

This architecture shows an application composed of smaller applications with a gateway, multiple databases, security services, monitoring, and automation.

This quickstart applies this architecture to a Fitness Store application. This application is composed of the following services split up by domain:

- Three Java Spring Boot applications:
  - **Catalog Service** contains an API for fetching available products.
  - **Payment Service** validates and processes payments for users' orders.
  - **Identity Service** provides reference to the authenticated user.

- One Python application:
  - **Cart Service** manages users' items that have been selected for purchase.

- One ASP.NET Core application:
  - **Order Service** places orders to buy products that are in the users' carts.

- One NodeJS and static HTML application:
  - **Frontend** is the shopping application that depends on the other services.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md)
