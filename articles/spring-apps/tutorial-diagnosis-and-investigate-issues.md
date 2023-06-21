---
title: "Tutorial - Diagnosis and investigate issues on Azure Spring Apps"
description: Learn how to diagnosis and investigate issues on Azure Spring Apps.
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: tutorial
ms.date: 06/20/2023
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Tutorial: Diagnosis and investigate issues on Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ❌ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ❌ Enterprise

This article shows you how to diagnosis your production services and investigate production issues on Azure Spring Apps, we use the well-known sample app [PetClinic](https://github.com/azure-samples/spring-petclinic-microservices) as a production program, the following is a further explanation in conjunction with [Deploy microservice applications to Azure Spring Apps](./quickstart-deploy-microservice-apps.md) and [Run microservice apps(Pet Clinic) with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md).
[Log Analytics](../azure-monitor/logs/log-analytics-overview.md) and [Application Insights](../azure-monitor/insights/insights-overview.md) are deeply integrated with Azure Spring Apps, 
you can use Log Analytics diagnosis your application with variously log queries, and use Application Insights investigate production issues.

## 1. Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Complete the previous quickstart in this series: [Deploy microservice applications to Azure Spring Apps](./quickstart-deploy-microservice-apps.md) and [Run microservice apps(Pet Clinic) with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md).

  1. Make sure that both the `Enable logs of Diagnostic settings` and `Application Insights` functions are enabled on the Azure Spring Apps instance.

  1. Make sure that the applications that need to link to the database have activated the mysql file through the environment variable:
     - On the **Configuration** page, select **Environment variables** tab page, enter `SPRING_PROFILES_ACTIVE` for **Key**, enter `mysql` for **Value**, then select **Save**

     :::image type="content" source="../../media/tutorial-diagnosis-and-investigate-issues/app-config-env.png" alt-text="Screenshot of Azure portal showing config env for Azure Spring Apps instance" lightbox="../../media/tutorial-diagnosis-and-investigate-issues/app-config-env.png":::

     - Repeat the configuration steps of `customers-service` above to configure the following applications:
     
         - `vets-service`
         - `visits-service`

  1. Make sure that applications `customers-service`, `vets-service` and `visits-service` are all configured with a validated service connector linking to MySQL.

## 6. Monitor your application with the dashboard


## 7. Diagnosis your application with Log Analytics
### 8.1. Log query

## 8. Investigate production issues with Application Insights
### 8.1. Investigate request performance issues
#### 8.2. Investigate request failures

[!INCLUDE [clean-up-resources-portal](includes/tutorial-diagnosis-and-investigate-issues/clean-up-resources.md)]

## 10. Next steps
[Set up a staging environment](../spring-apps/how-to-staging-environment.md)
[Custom domain and enable the HTTPS](../spring-apps/tutorial-custom-domain-and-enable-https.md)
