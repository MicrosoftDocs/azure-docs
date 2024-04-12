---
title: Modernize ASP.NET web apps to Azure App Service code
description: At-scale migration of ASP.NET web apps to Azure App Service using Azure Migrate
author: vineetvikram
ms.author: vivikram
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 02/28/2023
ms.custom: template-tutorial
---

# Modernize ASP.NET web apps to Azure App Service code

This article shows you how to migrate ASP.NET web apps at-scale to [Azure App Service](https://azure.microsoft.com/services/app-service/) using Azure Migrate.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible and don't show all possible settings and paths.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Migrate ASP.NET web apps at-scale to [Azure App Service](https://azure.microsoft.com/services/app-service/) using integrated flow in Azure Migrate.
> * Change migration plans for web apps.
> * Change App Service plan for web apps.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin this tutorial, you should:

1. [Complete the first tutorial](./tutorial-discover-vmware.md) to discover web apps running in your VMware environment.
2. [Complete the second tutorial](./tutorial-assess-webapps.md) to assess web apps to determine their readiness status for migration to [Azure App Service](https://azure.microsoft.com/services/app-service/). It's necessary to assess web apps in order to migrate them using the integrated flow.
3. Go to the existing project or [create a new project](./create-manage-projects.md).

## Migrate web apps

Once the web apps are assessed, you can migrate them using the integrated migration flow in Azure Migrate.

  - You can select up to five App Service Plans as part of a single migration.  
  - Currently, we don't support selecting existing App Service Plans during the migration flow. 
 - You can migrate web apps up to a maximum size of 2 GB, including content stored in the mapped virtual directory.
 - Currently, we don't support migrating UNC directory content.
 - You need Windows PowerShell 4.0 installed on servers hosting the IIS web servers from which you plan to migrate ASP.NET web apps to Azure App Services. 
  - Currently, the migration flow doesn't support VNet integrated scenarios.

To migrate the web apps, perform these steps:
1. In the Azure Migrate project > **Servers, databases and web apps** > **Migration tools** > **Migration and modernization**, select **Replicate**.

    :::image type="content" source="./media/tutorial-modernize-asp-net-appservice-code/select-replicate.png" alt-text="Screenshot of the Replicate option selected.":::

1. In **Specify intent**, > **What do you want to migrate?**, select **ASP.NET web apps**.
1. In **Where do you want to migrate to?**, select **Azure App Service native**.
1. In **Virtualization type**, select **VMware vSphere**.
1. In **Select assessment**, select the assessment you want to use to migrate web apps and then select the **Continue** button. Specify the Azure App Service details where the apps will be hosted.

   :::image type="content" source="./media/tutorial-modernize-asp-net-appservice-code/specify-intent.png" alt-text="Screenshot of selected intent."::: 

1. In **Basics**, under **Project details**, select the **Subscription**, **Resource Group**, and **Region** where the web apps will be hosted, from the drop-down. Under **Storage**, select the **Storage account** for an intermediate storage location during the migration process. Select **Next: Web Apps >**.

   :::image type="content" source="./media/tutorial-modernize-asp-net-appservice-code/web-apps-basics.png" alt-text="Screenshot of Azure Migrate Web Apps Basics screen.":::

1. In the **Web Apps** section, review the web apps you'd like to migrate.

   :::image type="content" source="./media/tutorial-modernize-asp-net-appservice-code/select-web-apps.png" alt-text="Screenshot of Azure Migrate Web Apps screen.":::

   > [!NOTE]
   > Apps with the Ready status are tagged for migration by default. Apps tagged as *Ready with conditions* can be migrated by selecting **Yes** in **Will migrate?**.

   1. Select the web apps to migrate and select **Edit**.

      :::image type="content" source="./media/tutorial-modernize-asp-net-appservice-code/web-apps-edit-multiple.png" alt-text="Screenshot of Azure Migrate selected web apps.":::

   1. In **Edit apps**, under **Will migrate?**, select **Yes**, and select the **App Service Plan** and **Pricing tier** of where the apps will be hosted. Next, select the **Ok** button.

      > [!NOTE]
      > Up to five App Service plans can be migrated at a time.

      :::image type="content" source="./media/tutorial-modernize-asp-net-appservice-code/edit-multiple-details.png" alt-text="Screenshot of Azure Migrate Edit apps.":::

      Select the **Next: App Service Plans >** button.
1. In the **App Service Plans** section, verify the App Service Plan details.

     > [!NOTE]
     > Depending on your web app requirements, you can edit the number of apps in an App Service plan or update the pricing tier. Follow these steps to update these details:
     > 1. Select the **Edit** button.
     > 1. In **Edit plan**, select the **Target name** and **Pricing tier**, then select **Ok**.
     >    :::image type="content" source="./media/tutorial-modernize-asp-net-appservice-code/app-service-plan-edit-details.png" alt-text="Screenshot of App Service Plan Edit details.":::

1. Once the App Service Plans are verified, select **Next: Review + create**.
1. Azure Migrate will now validate the migration settings. Validation may take a few minutes to run. Once complete, review the details and select **Migrate**. 

    > [!NOTE]
    > To download the migration summary, select the **Download CSV** button.

Once the migration is initiated, you can track the status using the Azure Resource Manager Deployment Experience as shown below:

   :::image type="content" source="./media/tutorial-modernize-asp-net-appservice-code/web-apps-deployments.png" alt-text="Screenshot of Azure Migrate deployment.":::

## Post-migration steps

Once you have successfully completed migration, you may explore the following steps based on web app specific requirement(s): 

- [Map existing custom DNS name](../app-service/app-service-web-tutorial-custom-domain.md).
- [Secure a custom DNS with a TLS/SSL binding](../app-service/configure-ssl-bindings.md).
- [Securely connect to Azure resources](../app-service/tutorial-connect-overview.md)
- [Deployment best practices](../app-service/deploy-best-practices.md).
- [Security recommendations](../app-service/security-recommendations.md).
- [Networking features](../app-service/networking-features.md).
- [Monitor App Service with Azure Monitor](../app-service/monitor-app-service.md).
- [Configure Microsoft Entra authentication](../app-service/configure-authentication-provider-aad.md).


## Next steps

- Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Azure Cloud Adoption Framework.
- [Review best practices](../app-service/deploy-best-practices.md) for deploying to Azure App service.
