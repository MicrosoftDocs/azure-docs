---
title: At-scale migration of ASP.NET web apps to Azure App Service using Azure Migrate
description: At-scale migration of ASP.NET web apps to Azure App Service using Azure Migrate
author: vineetvikram
ms.author: vivikram
ms.service: #Required; service per approved list. slug assigned by ACOM.
ms.topic: tutorial
ms.date: 06/21/2022
ms.custom: template-tutorial
---

# Tutorial: At-scale migration of ASP.NET web apps to Azure App Service using Azure Migrate

This article shows you how to migrate ASP.NET web apps at-scale to [Azure App Service](https://azure.microsoft.com/services/app-service/) using Azure Migrate.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Migrate ASP.NET web apps at-scale to [Azure App Service](https://azure.microsoft.com/services/app-service/) using integrated flow in Azure Migrate.
> * Change migration decision for web apps.
> * Change App Service plan for web apps.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin this tutorial, you should:

1. [Complete the first tutorial](./tutorial-discover-vmware.md) to discover web apps running in your VMware environment.
2. [Complete the second tutorial](./tutorial-assess-webapps.md) to assess web apps to determine their readiness status for migration to [Azure App Service](https://azure.microsoft.com/services/app-service/). It's mandatory to assess web apps in order to migrate them using the integrated flow.
3. Go to the already created project or [create a new project](./create-manage-projects.md)

## Migrate web apps

Once web apps are assessed, they can be migrated using the integrated migration flow in Azure Migrate.

- You can select up to 5 App Service Plans as part of single migration   
- Currently we don't support selecting existing App service plans during the migration flow  
- You can migrate web apps up to max 2 GB in size including content stored in mapped virtual directory 
- Currently we don't support migrating UNC directory content 
- You need Windows PowerShell 4.0 installed on servers hosting the IIS web servers from which you plan to migrate ASP.NET web apps to Azure App Services 
- Currently the migration flow doesn't support VNet integrated scenarios 

1. In the Azure Migrate project > **Servers, databases and web apps**, **Migration tools** > **Migration and modernization**, select **Replicate**.

    :::image type="content" source="./media/tutorial-migrate-webapps/select-replicate.png" alt-text="Screenshot on selecting Replicate option.":::

1. In **Specify intent**, > **What do you want to migrate?**, select **ASP.NET web apps**.
1. In **Where do you want to migrate to?**, select **Azure App Service native**.
1. In **Virtualization type**, select **VMware vSphere**.
1. In **Select assessment**, select the assessment you want to use to migrate web apps and then select the **Continue** button.

:::image type="content" source="./media/tutorial-migrate-webapps/specify-intent.png" alt-text="Screenshot of Specify intent.":::

1. Next, you need to specify the Azure App Service details where the apps will be hosted. In the **Basics** tab, under **Project details**, select **Subscription**, **Resource Group**, and **Region** where the web apps will be hosted. Under **Storage**, select the **Storage account** for an intermediate storage location during the migration process. Next, select the **Next: Web Apps >** button.

    :::image type="content" source="./media/tutorial-migrate-webapps/web-apps-basics.png" alt-text="Screenshot of Azure Migrate Web Apps Basics tab":::

1. In the **Web Apps** tab, review the web apps you'd like to migrate.

    :::image type="content" source="./media/tutorial-migrate-webapps/select-web-apps.png" alt-text="Screenshot of Azure Migrate Web Apps tab":::

    > [!NOTE]
    > Apps with the status of "Ready" are tagged for migration by default. Apps tagged as "Ready with conditions" can be migrated by updating "Will Migrate" to **Yes** as shown in the next few steps.
    >

1. Select the web apps to migrate and then select **Edit**.

    :::image type="content" source="./media/tutorial-migrate-webapps/web-apps-edit-multiple.png" alt-text="Screenshot of Azure Migrate selected web apps":::

1. In **Edit apps**, under **Will migrate**, select **Yes**, and then select the **App Service Plan** and **Pricing tier** of where the apps will be hosted. Next, select the **Ok** button.

    > [!NOTE]
    > Up to 5 App Service Plans can be migrated at a time.
    >

    :::image type="content" source="./media/tutorial-migrate-webapps/edit-multiple-details.png" alt-text="Screenshot of Azure Migrate Edit apps":::

1. Select the **Next: App Service Plans >** button.
1. In the **App Service Plans** tab, verify the App Service Plan details.

    > [!NOTE]
    >
    > Depending on your web app requirements, you may wish to edit the number of apps in an App Service Plan or update the pricing tier. Follow these steps to update these details:
    >1. Select the **Edit** button ![Screenshot of Azure Migrate web apps edit icon](./media/tutorial-migrate-webapps/edit-icon.png)
    >
    >1. In **Edit plan** , select the **Target name** and **Pricing tier**, then select the **Ok** button.
    >
    >     :::image type="content" source="./media/tutorial-migrate-webapps/app-service-plan-edit-details.png" alt-text="Screenshot of App Service Plan Edit details":::

1. Once the App Service Plans are verified, select the **Next: Review + create** button.
1. Azure Migrate will now validate the migration settings. Validation may take a few minutes to run. Once complete, review the details and select **Migrate**. 

    > [!NOTE]
    > To download the migration summary, select the **Download CSV** button.
    >

Once the migration is initiated, you can track the status using Azure Resource Manager Deployment Experience as shown below.

    :::image type="content" source="./media/tutorial-migrate-webapps/web-apps-deployments.png" alt-text="Screenshot of Azure Migrate deployment":::

## Post migration steps

Once you have successfully completed migration, you may explore the following steps based on web app specific requirement(s): 

- Map existing custom DNS name - Azure App Service 
- Secure a custom DNS with a TLS/SSL binding - Azure App Service 
- Securely connect to Azure resources - Azure App Service 
- Deployment best practices - Azure App Service 
- Security recommendations - Azure App Service 
- Networking features - Azure App Service 
- Monitor App Service with Azure Monitor - Azure App Service 
- Configure Azure AD authentication - Azure App Service 

## Next steps

Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Azure Cloud Adoption Framework.
