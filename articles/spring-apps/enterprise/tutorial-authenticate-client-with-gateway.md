---
title: Tutorial - Authenticate Client with Spring Cloud Gateway on Azure Spring Apps
description: Learn how to authenticate client with Spring Cloud Gateway on Azure Spring Apps.
author: KarlErickson
ms.service: azure-spring-apps
ms.topic: tutorial
ms.date: 08/28/2024
ms.author: v-shilichen
ms.custom: devx-track-java, devx-track-extended-java, mode-other, engagement-fy23
---

# Tutorial: Authenticate client with Spring Cloud Gateway on Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Standard consumption and dedicated (Preview) 

This quickstart shows you how to secure communication between a client application and a microservice application that is hosted on Azure Spring Apps and shielded with a Spring Cloud Gateway app. The client application is verified as a security principal to initiate contact with the microservice deployed on Azure Spring Apps, using the app built with [Spring Cloud Gateway](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/). This method employs Spring Cloud Gateway's Token Relay and Spring Security's Resource Server features for the processes of authentication and authorization, realized through the execution of the [OAuth 2.0 client credentials flow](/entra/identity-platform/v2-oauth2-client-creds-grant-flow).

The following list shows the composition of the sample project:

- Books SPA: This Single Page Application (SPA), hosted locally, interacts with the Books microservice for adding or searching for books.
- Books microservice:
  - A Spring Cloud Gateway app hosted in Azure Spring Apps. This app operates as a gateway to the Books RESTful APIs.
  - A Spring Boot RESTful API app hosted in Azure Spring Apps. This app stores the book information in an H2 database. The Books service exposes two REST endpoints to write and read books.

## 1. Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- A Microsoft Entra tenant. For more information on how to create a Microsoft Entra tenant, see [Quickstart: Create a new tenant in Microsoft Entra ID](/entra/fundamentals/create-new-tenant).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher.
- Install [Node.js](https://nodejs.org).

[!INCLUDE [deploy-rest-api-app-with-basic-standard-plan](includes/tutorial-authenticate-client-with-gateway/authenticate-client-with-gateway-consumption-plan.md)]

## 5. Validate the app

You can access the Books SPA app that communicates with the Books RESTful APIs through the `gateway-service` app.

1. Go to `http://localhost:3000` in your browser to access the application.

1. Enter values for **Author** and **Title**, and then select **Add Book**. You see a response similar to the following example:

   ```output
   Book added successfully: {"id":1,"author":"Jeff Black","title":"Spring In Action"}
   ```

[!INCLUDE [clean-up-resources](includes/tutorial-authenticate-client-with-gateway/clean-up-resources.md)]

## 7. Next steps

> [!div class="nextstepaction"]
> [Structured application log for Azure Spring Apps](../basic-standard/structured-app-log.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](../basic-standard/how-to-custom-domain.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Set up Azure Spring Apps CI/CD with GitHub Actions](../basic-standard/how-to-github-actions.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Set up Azure Spring Apps CI/CD with Azure DevOps](../basic-standard/how-to-cicd.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Use managed identities for applications in Azure Spring Apps](../basic-standard/how-to-use-managed-identities.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Run microservice apps (Pet Clinic)](../basic-standard/quickstart-sample-app-introduction.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Run polyglot apps on Enterprise plan (ACME Fitness Store)](./quickstart-sample-app-acme-fitness-store-introduction.md)

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/azure-spring-apps-samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
