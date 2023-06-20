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

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to diagnosis your production services and investigate production issues on Azure Spring Apps, we use the well-known sample app [PetClinic](https://github.com/azure-samples/spring-petclinic-microservices) as a production program, let's make further explanations in conjunction with [Run microservice apps(Pet Clinic) with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md).
[Log Analytics](../azure-monitor/logs/log-analytics-overview.md) and [Application Insights](../azure-monitor/insights/insights-overview.md) are deeply integrated with Azure Spring Apps, 
you can use Log Analytics diagnosis your application with variously log queries, and use Application Insights investigate production issues.

## 1. Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## 2. Prepare Spring Project

1. The sample project is ready on GitHub. Clone sample project by using the following command:

   ```bash
   git clone git@github.com:Azure-Samples/spring-petclinic-microservices.git
   ```

1. Follow the steps in the [Structured application log](../spring-apps/structured-app-log.md) to structure the application log for each module.

1. Build the sample project by using the following commands:

   ```bash
   cd spring-petclinic-microservices
   ./mvnw -P spring-apps clean package
   ```

1. The external configuration repository is ready on GitHub, and the address is `https://github.com/azure-samples/spring-petclinic-microservices-config`.

## 3. Prepare the cloud environment

### 3.1 Sign in to the Azure portal

Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2 Provision an instance of Azure Spring Apps
#### Enable Log Analytics and Application Insights
#### Create apps
    - Set env for spring profile mysql

### 3.3 Provision an instance of Azure Database for MySQL server

### 3.4 Connect app instances to Azure Database for MySQL server

### 3.5 Provision an instance of shared dashboard
#### Custom your application dashboard

#### Add quickstart chart for app
#### Add availability chart
#### Add server exception, dependency failure and failed request chart
#### Add request and response chart
#### Add app level chart
#### Add database active connection chart

### 3.6 Provision alert rules

#### Action groups
#### Alert rules

## 4. Deploy the app to Azure Spring Apps
use maven plugin to deploy the app to Azure Spring Apps

## 5. Validate the apps
(access your application to generate some logs and metrics)

### 5.1. Monitor your application with the dashboard
#### View your app live metrics
#### View your app running status
#### View errors
#### View traffic
#### View your app health

### 5.2. Diagnosis your application with Log Analytics
#### Log query

### 5.3. Investigate production issues with Application Insights
#### Investigate request performance issues
#### Investigate request failures

[!INCLUDE [clean-up-resources-portal](includes/tutorial-diagnosis-and-investigate-issues/clean-up-resources.md)]

## 7. Next steps
[Set up a staging environment](../spring-apps/how-to-staging-environment.md)
[Custom domain and enable the HTTPS](../spring-apps/tutorial-custom-domain-and-enable-https.md)
