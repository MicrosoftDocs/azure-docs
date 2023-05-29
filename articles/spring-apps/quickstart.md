---
title: Quickstart - Deploy your first application to Azure Spring Apps
description: Describes how to deploy an application to Azure Spring Apps.
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: quickstart
ms.date: 03/21/2022
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
zone_pivot_groups: spring-apps-plan-selection
---

# Quickstart: Deploy your first application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

This article explains how to deploy a small application to run on Azure Spring Apps.

The application code used in this tutorial is a simple app. When you've completed this example, the application is accessible online, and you can manage it through the Azure portal.

[!INCLUDE [prerequisites](includes/quickstart/prerequisites.md)]

::: zone pivot="sc-consumption-plan"

[!INCLUDE [deploy-app-with-standard-consumption-plan](includes/quickstart/deploy-app-with-standard-consumption-plan.md)]

::: zone-end

::: zone pivot="sc-standard"

[!INCLUDE [deploy-app-with-basic-standard-plan](includes/quickstart/deploy-app-with-basic-standard-plan.md)]

::: zone-end

::: zone pivot="sc-enterprise"

[!INCLUDE [deploy-app-with-enterprise-plan](includes/quickstart/deploy-app-with-enterprise-plan.md)]

::: zone-end

## 5 Validation

After deployment, you can access the app at `https://<your-Azure-Spring-Apps-instance-name>-demo.azuremicroservices.io`, then you will get the response `Hello World`.

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart/clean-up-resources.md)]

## 7 Next steps

In this quickstart, you learned how to build and deploy a Spring app in an Azure Spring Apps service instance. You also learned how to deploy an app with a public endpoint, and how to clean up resources.

You have access to powerful logs, metrics, and distributed tracing capability from the Azure portal. For more information, see [Quickstart: Monitoring Azure Spring Apps apps with logs, metrics, and tracing](./quickstart-logs-metrics-tracing.md).

To learn how to use more Azure Spring capabilities, advance to the quickstart series that deploys a sample application to Azure Spring Apps:

> [!div class="nextstepaction"]
> [Introduction to the sample app](./quickstart-sample-app-introduction.md)

::: zone pivot="sc-consumption-plan"

To learn how to create a Standard consumption and dedicated plan in Azure Spring Apps for app deployment, advance to the Standard consumption and dedicated quickstart series:

> [!div class="nextstepaction"]
> [Provision an Azure Spring Apps Standard consumption and dedicated plan service instance](./quickstart-provision-standard-consumption-service-instance.md)

::: zone-end

For a packaged app template with Azure Spring Apps infrastructure provisioned using Bicep, see [Spring Boot PetClinic Microservices Application Deployed to Azure Spring Apps](https://github.com/Azure-Samples/apptemplates-microservices-spring-app-on-AzureSpringApps).

More samples are available on GitHub: [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
