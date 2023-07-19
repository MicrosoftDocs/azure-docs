---
title: Tutorial - Authenticate client with gateway on Azure Spring Apps
description: Learn how to authenticate client with gateway on Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 07/21/2023
ms.author: v-shilichen
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Authenticate client with gateway on Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ❌ Basic/Standard ❌ Enterprise

This article explains how to secure communication between a client application and a microservice application 
that is hosted on Azure Spring Apps and shielded behind a gateway app. The client application 
will be verified as a security principal to initiate contact with the microservice deployed 
on Azure Spring Apps, via the app built with [Spring Cloud Gateway](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/). The methodology employs Spring Cloud 
Gateway's Token Relay feature, and Spring Security's Resource Server feature for the processes of authentication and authorization, realized through 
the execution of the [client credentials flow](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md).

- [Books SPA](https://github.com/moarychan/azure-spring-apps-sso-client-credential/tree/main/spa): This Single Page Application (SPA), hosted locally, interacts with the Books Microservice for adding or searching for books.
- Books Microservice:
    - A Spring Cloud Gateway app hosted in Azure Spring Apps, this app operates as a gateway to the Books RESTful API. 
    - A Spring Boot RESTful app hosted in Azure Spring Apps. It stores book information in an H2 database. The Books service exposes two REST endpoints to write and read books.

## 1. Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- An Azure AD instance. For instructions on creating one, see [Quickstart: Create a new tenant in Azure AD](../active-directory/fundamentals/create-new-tenant.md).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher.
- Install [Node.js](https://nodejs.org).

[!INCLUDE [deploy-rest-api-app-with-basic-standard-plan](includes/tutorial-authenticate-client-with-gateway/authenticate-client-with-gateway-consumption-plan.md)]

## 5. Validate the app

Now we can access the Books SPA app that communicates with the Books RESTful API through the `gateway-service` app.

1. Go to `http://localhost:3000` in your browser to access the application.

1. Enter for **Author** and **Title**, and select **Add Book**, then you will see the below response:

   ```text
   Book added successfully: {"id":2,"author":"Jeff Black","title":"Spring In Action"}
   ```

[!INCLUDE [clean-up-resources](includes/tutorial-authenticate-client-with-gateway/clean-up-resources.md)]

## 7. Next steps

> [!div class="nextstepaction"]
> [Structured application log for Azure Spring Apps](./structured-app-log.md)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](./how-to-custom-domain.md)

> [!div class="nextstepaction"]
> [Set up Azure Spring Apps CI/CD with GitHub Actions](./how-to-github-actions.md)

> [!div class="nextstepaction"]
> [Set up Azure Spring Apps CI/CD with Azure DevOps](./how-to-cicd.md)

> [!div class="nextstepaction"]
> [Use managed identities for applications in Azure Spring Apps](./how-to-use-managed-identities.md)

> [!div class="nextstepaction"]
> [Run microservice apps(Pet Clinic)](./quickstart-sample-app-introduction.md)

> [!div class="nextstepaction"]
> [Run polyglot apps on Enterprise plan (ACME Fitness Store)](./quickstart-sample-app-acme-fitness-store-introduction.md)

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
