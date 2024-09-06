---
title: Migrate Azure Spring Apps to Azure Container Apps
description: The complete overview guide for Azure Spring Apps migration to Azure Container Apps.
author: KarlErickson
ms.service: azure-spring-apps
ms.topic: overview
ms.date: 09/05/2024
ms.author: seal
ms.custom: devx-track-java, devx-track-extended-java
#Customer intent: As an Azure Cloud user, I want to deploy, run, and monitor Spring applications.
---

# Migrate Azure Spring Apps to Azure Container Apps

This article describes when and how to migrate Azure Spring Apps to Azure Container Apps. To consolidate cloud-native benefits and streamline all features, Azure Spring Apps, including consumption and dedicated, basic standard, and enterprise plans, is retiring. On September 17, 2024, consumption and dedicated plan (preview) enters its six month sunset period and retires in March 2025.

Use Azure Container Apps as the main destination for your migration. Azure Container Apps is a fully managed, serverless container platform for polyglot apps and offers enhanced Java features previously available in Azure Spring Apps.

With one easy step, you can migrate from Azure Spring Apps consumption & dedicated plan to Azure Container Apps. Select the **Migrate** button in the Azure portal and confirm the action. 

:::image type="content" source="/media/overview-migration-guide/consumption-plan-migration-button.png" alt-text="Screenshot of the Azure portal that shows the Migrate button." border="false" lightbox="/media/overview-migration-guide/consumption-plan-migration-button.png":::

:::image type="content" source="/media/overview-migration-guide/consumption-plan-migration-confirmation.png" alt-text="Screenshot of the Migrate to Azure Container Apps message with Yes option highlighted." border="false" lightbox="/media/overview-migration-guide/consumption-plan-migration-confirmation.png":::

This feature is available mid-October 2024 and you can start the migration process as soon as it's available.

Once the migration finishes, the app appears as a standard app inside Azure Container Apps application, with the Java development stack turned on. With this option enabled, you get access to Java specific [metrics](../../container-apps/java-metrics.md) and [logs](../../container-apps/java-dynamic-log-level.md) to monitor and troubleshoot your apps.

## Frequently asked questions

The following section addresses several questions you might have about the migration process.

### What happens if I don't take any actions by March 30, 2025?

Your Azure Spring Apps is automatically migrated to Azure Container Apps.

### How do I continue to use Azure Container Apps consumption & dedicated plan?

You can continue to run existing apps until March 30, 2025, but you won't be able to create new apps and service instances after September 17, 2024.

### How can I get help if the migration process fails?

To create a support request, use the following list to fill out the form on the Azure portal:

- **Issue type**: Select **Technical**.
- **Subscription**: Select your subscription.
- **Service**: Select **Azure Spring Apps**.
- **Resource**: Select your Azure Spring Apps resource.
- **Summary**: Type a description of your issue.
- **Problem type**: Select **My issue is not listed**.

### Do I need to manually create Spring Cloud Config and Spring Cloud Eureka in Azure Container Apps?

Yes, you must recreate Spring Cloud Config and Spring Cloud Eureka in Azure Container Apps. Both Spring Cloud Config and Spring Cloud Eureka are also managed components in Azure Container Apps, but there are some experiential differences. For more information, see [Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps](../../container-apps/java-eureka-server.md) and [Tutorial: Connect to a managed Config Server for Spring in Azure Container Apps](../../container-apps/java-config-server.md).

If you need assistance creating and migrating Spring Cloud Config and Spring Cloud Eureka to Azure Container Apps, create a support request.

### Any downtime during the migration process?

There's no downtime unless you're using Spring Cloud Config and Spring Cloud Eureka, which you must manually recreate in Azure Container Apps.

### What happens to apps that have in-flight transactions during the migration?

All in-flight transactions execute without any interruptions, unless you're using Spring Cloud Config and Spring Cloud Eureka, which you must manually recreate in Azure Container Apps.

### Any change in IP address/FQDN after the migration?

There's no change. All IP addresses/FQDN remains the same after the migration.

### I’m using persistent storage. How do I recreate them in Azure Container Apps?

Persistent storage migrates automatically to Azure Container Apps.

### What are the pricing implications when moving to Azure Container Apps?

Azure Container Apps has the same pricing structure as Azure Spring Apps for the consumption and dedicated plan. Charges for active and idle CPU/memory use, along with virtual machine SKUs in dedicated workloads, are identical in Azure Spring Apps and Azure Container Apps. The monthly free grant also applies directly to Azure Container Apps.

The only exception to the rule is number of requests for managed Java components are billed in Azure Container Apps consumption plan. 

The following table describes the differences:

| Resources used for managed Java components | Azure Spring Apps consumption plan | Azure Container Apps consumption plan |
|--------------------------------------------|------------------------------------|---------------------------------------|
| Eureka active CPU                          |                                    | No change.                            |
| Eureka idle CPU                            |                                    | No change.                            |
| Config Server active CPU                   |                                    | No change.                            |
| Config Server idle CPU                     |                                    | No change.                            |
| One million requests made to Eureka        | No extra cost.                     | $0.4 USD (estimated price)            |
| One million requests made to Config Server | No extra cost.                     | $0.4 USD (estimated price)            |

With Azure Container Apps, you can apply Azure savings plan and save upto 15% with one year commitment and upto 17% with three year commitment, as shown in the following table:

| Resources used for user apps                 | Azure Spring Apps | Azure Container Apps dedicated workload profile with one year savings plan |
|----------------------------------------------|-------------------|----------------------------------------------------------------------------|
| Resources used in consumption plan           | Advertised price. | 15% off advertised price.                                                  |
| Resources used in dedicated workload profile | Advertised price. | 15% off advertised price.                                                  |

### How do I continue to use my own virtual network in Azure Container Apps?

There's no change to the virtual network experience. You can continue using your own virtual network.

### How do I migrate my apps to the consumption plan or the consumption and dedicated plan with workload profiles in Azure Container Apps?

There's a direct mapping between the service plans in Azure Spring Apps and Azure Container Apps. If your app is currently running on the consumption plan, it moves to the consumption only plan in Azure Container Apps. If your app is currently running on a consumption and dedicated workload profile, it transitions to the corresponding workload profile in Azure Container Apps.

### How can I continue to keep my deployment pipelines/workflow working?

Your deployment pipelines/workflow must point to Azure Container Apps to work properly.

### How do I continue to make my automation scripts work using Azure CLI? 

Azure CLI scripts must change to make them work in Azure Container Apps. For more information, see [az containerapp](https://learn.microsoft.com/cli/azure/containerapp?view=azure-cli-latest&preserve-view=true). 

### Are there plans to retire any other Azure Spring Apps SKUs?
  
Yes, other Azure Spring Apps plans are also retiring. For more information, see [Placeholder](https://aka.ms/asaretirement).
