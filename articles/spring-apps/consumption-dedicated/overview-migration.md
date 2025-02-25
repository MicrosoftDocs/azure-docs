---
title: Migrate Azure Spring Apps Standard Consumption and Dedicated Plan to Azure Container Apps
description: The complete overview guide for migrating Azure Spring Apps Standard consumption and dedicated plan to Azure Container Apps, including steps, benefits, and frequently asked questions.
author: KarlErickson
ms.service: azure-spring-apps
ms.topic: overview
ms.date: 09/30/2024
ms.author: seal
ms.custom: devx-track-java, devx-track-extended-java
#Customer intent: As an Azure Cloud user, I want to deploy, run, and monitor Spring applications.
---

# Migrate Azure Spring Apps Standard consumption and dedicated plan to Azure Container Apps

This article describes when and how to migrate Azure Spring Apps Standard consumption and dedicated plan (currently in Public Preview only) to Azure Container Apps. To consolidate cloud-native benefits and streamline our offerings, the Azure Spring Apps service is retiring, including the Standard consumption and dedicated (preview), Basic, Standard, and Enterprise plans. The Standard consumption and dedicated plan (preview) enters its six-month sunset period on September 30, 2024 and retires in March 2025.

We recommend Azure Container Apps as the best destination for your migration. Azure Container Apps is a fully managed, serverless container platform for polyglot apps and offers enhanced Java features previously available in Azure Spring Apps.

We've introduced a migration feature to ease the transition from the Azure Spring Apps Standard consumption and dedicated plan (preview) to Azure Container Apps. Select **Migrate** in the Azure portal and confirm the action.

:::image type="content" source="media/overview-migration/consumption-plan-migration-button.png" alt-text="Screenshot of the Azure portal that shows the Migrate button." lightbox="media/overview-migration/consumption-plan-migration-button.png":::

:::image type="content" source="media/overview-migration/consumption-plan-migration-confirmation.png" alt-text="Screenshot of the Migrate to Azure Container Apps dialog box." lightbox="media/overview-migration/consumption-plan-migration-confirmation.png":::

After the migration finishes, the app appears as a standard app inside Azure Container Apps, with the Java development stack turned on. With this option enabled, you get access to Java specific metrics and logs to monitor and troubleshoot your apps. For more information, see [Java metrics for Java apps in Azure Container Apps](../../container-apps/java-metrics.md) and [Set dynamic logger level to troubleshoot Java applications in Azure Container Apps](../../container-apps/java-dynamic-log-level.md).

The following video announces the general availability of Java experiences on Azure Container Apps:

<br>

> [!VIDEO https://www.youtube.com/embed/-T90dC2CCPA]

## Frequently asked questions

The following section addresses several questions you might have about the migration process.

### Are there plans to retire any other Azure Spring Apps SKUs?

Yes, other Azure Spring Apps plans are also retiring, with a three-year sunset period. For more information, see the [Azure Spring Apps retirement announcement](../basic-standard/retirement-announcement.md?toc=/azure/spring-apps/consumption-dedicated/toc.json&bc=/azure/spring-apps/consumption-dedicated/breadcrumb/toc.json).

### What happens if I don't take any actions by March 30, 2025?

Your apps are automatically migrated to Azure Container Apps.

### Can I continue to use the Azure Spring Apps Standard consumption and dedicated plan?

You can continue to run existing apps until March 30, 2025, but you can't create new apps and service instances after September 30, 2024.

### How can I get help if the migration process fails?

Fill out the support request form on the Azure portal, using the following values:

- For **Issue type**, select **Technical**.
- For **Subscription**, select your subscription.
- For **Service**, select **Azure Spring Apps**.
- For **Resource**, select your Azure Spring Apps resource.
- For **Summary**, type a description of your issue.
- For **Problem type**, select **My issue is not listed**.

### Do I need to manually create Spring Cloud Config Server and Spring Cloud Service Registry instances in Azure Container Apps?

Yes, you must recreate Spring Cloud Config Server and Spring Cloud Service Registry instances in Azure Container Apps. Both Spring Cloud Config Server and Spring Cloud Service Registry are also managed components in Azure Container Apps, but there are some experiential differences. For more information, see [Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps](../../container-apps/java-eureka-server.md) and [Tutorial: Connect to a managed Config Server for Spring in Azure Container Apps](../../container-apps/java-config-server.md).

If you need assistance creating and migrating Spring Cloud Config Server and Spring Cloud Service Registry to Azure Container Apps, create a support request.

### Is there any downtime during the migration process?

There's no downtime unless you're using Spring Cloud Config Server and Spring Cloud Service Registry, which you must manually recreate in Azure Container Apps.

### What happens to apps that have in-flight transactions during the migration?

All in-flight transactions execute without any interruptions, unless you're using Spring Cloud Config Server and Spring Cloud Service Registry, which you must manually recreate in Azure Container Apps.

### Is there any change in IP address/FQDN after the migration?

There's no change. All IP addresses/FQDNs remain the same after the migration.

### I'm using persistent storage. How do I recreate it in Azure Container Apps?

Persistent storage migrates automatically to Azure Container Apps.

### What are the pricing implications when moving to Azure Container Apps?

Azure Container Apps has the same pricing structure as Azure Spring Apps for the consumption and dedicated plans. Charges for active and idle CPU/memory use, along with virtual machine SKUs in dedicated workloads, are identical in Azure Spring Apps and Azure Container Apps. The monthly free grant also applies directly to Azure Container Apps. The only exception to the rule is number of requests for managed Java components are billed in Azure Container Apps consumption plan.

The following table describes the differences:

| Resources used for managed Java components                 | Azure Spring Apps Standard consumption plan | Azure Container Apps consumption plan                                                            |
|------------------------------------------------------------|---------------------------------------------|--------------------------------------------------------------------------------------------------|
| Spring Cloud Service Registry active CPU                   | No change.                                  | No change.                                                                                       |
| Spring Cloud Service Registry idle CPU                     | No change.                                  | No change.                                                                                       |
| Spring Cloud Config Server active CPU                      | No change.                                  | No change.                                                                                       |
| Spring Cloud Config Server idle CPU                        | No change.                                  | No change.                                                                                       |
| One million requests made to Spring Cloud Service Registry | No extra cost.                              | See [Azure Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/). |
| One million requests made to Spring Cloud Config Server    | No extra cost.                              | See [Azure Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/). |

Also, with Azure Container Apps, you can take advantage of the Azure savings plan and benefit from savings through commitment. For more information, see [Azure savings plan for compute](https://azure.microsoft.com/pricing/offers/savings-plan-compute/).

### How do I continue to use my own virtual network in Azure Container Apps?

There's no change to the virtual network experience. You can continue using your own virtual network.

### Will my app be migrated to the consumption plan or the consumption and dedicated plan with workload profiles in Azure Container Apps?

There's a direct mapping between the service plans in Azure Spring Apps and Azure Container Apps. If your app is currently running on the consumption plan, it moves to the consumption only plan in Azure Container Apps. If your app is currently running on a consumption and dedicated workload profile, it transitions to the corresponding workload profile in Azure Container Apps.

### How can I continue to keep my deployment pipelines/workflow working?

Your deployment pipelines/workflow must point to Azure Container Apps to work properly. For more information, see [Introducing more ways to deploy Azure Container Apps](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/introducing-more-ways-to-deploy-azure-container-apps/ba-p/3678390).

### How do I continue to make my automation scripts work using Azure CLI?

Azure CLI scripts must change to make them work in Azure Container Apps. For more information, see [az containerapp](/cli/azure/containerapp).


