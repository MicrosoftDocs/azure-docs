---
title: Set up SQL storage for Standard logic app workflows
description: Set up a SQL database to store Logic App (Standard) workflow artifacts, states, and run history in single-tenant Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 11/02/2021
---

# Set up SQL database storage for Standard logic apps in single-tenant Azure Logic Apps (preview)

> [!IMPORTANT]
> This capability is in preview and is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you choose the **Logic App (Standard)** resource type to create workflows that run in single-tenant Azure Logic Apps, App Service Environment v3, or outside Azure, you also need to create an Azure Storage account to save workflow-related artifacts, states, and runtime data. However, if you want more flexibility and control over your logic app workflows' runtime environment, throughput, scaling, performance, and management, you can use the SQL Storage Provider instead for workflow-related storage transactions. SQL doesn't replace Azure Storage as a storage solution for your logic app resources. You can choose to add SQL as the primary storage provider or continue to use only Azure Storage, which is still required for other runtime operations but provides more limited control over throughput, scale, and failover.

This article provides an overview for why you might want to add SQL storage alongside Azure Storage and shows how to set up SQL for storage use either during logic app creation in the Azure portal or during logic app deployment from Visual Studio Code.

If you're new to logic apps, review the following documentation:

- [What is Azure Logic Apps](logic-apps-overview.md)
- [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md)

<a name="why-sql"></a>

## Why use SQL

As the first additional storage option for Azure Logic Apps, SQL provides the following benefits:

| Benefit | Description |
|---------|-------------|
| **Portability** | SQL has many form factors, including virtual machines, Platform as a Service (PaaS), and containers. You can run SQL databases almost anywhere that you might want to run logic app workflows. |
| **Control** | SQL provides granular control over database throughput, performance, and scaling during particular periods or for specific workloads. SQL pricing is based on CPU usage and throughput, which provides more predictable pricing than Azure Storage where costs are based on each operation. |
| **Use existing assets** | If you're familiar with Microsoft tools, you can use their assets for modern integrations with SQL. You can reuse assets across traditional on-premises deployments and modern cloud implementations with Azure Hybrid Benefits. SQL also provides mature and well-supported tooling, such as SQL Server Management Studio (SSMS), command-line interfaces, and SDKs. |
| **Compliance** | SQL provides more options than Azure Storage for you to back up, restore, fail over, and build in redundancies. You can apply the same enterprise-grade mechanisms as other enterprise applications to your logic app's storage. |
|||

<a name="when-use-sql"></a>

## When to use SQL

The following table describes some reasons why you might want to use SQL:

| Scenario | Recommend storage provider |
|----------|----------------------------|
| You want to run logic app workflows in Azure with more control over storage throughput and performance. | Use SQL as your storage provider as Azure Storage doesn't provide tools to fine-tune throughput and performance. |
| You want to run logic app workflows on premises, which you can with [Azure Arc enabled Logic Apps](azure-arc-enabled-logic-apps-overview.md). | Use SQL as your storage provider so that you can choose where to host your SQL database, for example, on premises in a virtual machine, a container, or multi-cloud. Consider running your logic app workflows close to the systems you want to integrate, or reducing your dependency on the cloud.   |
| You want predictable storage costs. | Use SQL as your storage provider when you want more control over scaling costs. SQL costs are based on each compute and input-output operations per second (IOPs). Azure Storage costs are based on numbers of operations, which might work better for small workloads that scale to zero. |
| You prefer to use SQL over Azure Storage. | SQL is a well-known and reliable ecosystem that you can use to apply the same governance and management across your logic apps behind-the-scenes operations. |
| You want to reuse existing SQL environments. | Use SQL as your storage provider if you already own SQL licenses that you want to reuse or modernize onto the cloud. You also might want to use the Azure Hybrid Benefits for your logic app integrations. |
| Everything else | Use Azure Storage as your default storage provider. |
|||

## Prerequisites

- An Azure account and active subscription. If you don't have one already, [sign up for a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A SQL environment to use with your logic app. However, before you set up your environment, complete the following steps:

  1. Create a SQL server instance.

     Supported types include [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads), [Azure SQL database](https://azure.microsoft.com/products/azure-sql/database/), [Azure SQL Managed Instance](https://azure.microsoft.com/products/azure-sql/managed-instance/), and others. If your SQL server isn't on Azure, you have to set up your server to let Azure services connect to your database. If you're using SQL Express for local development, connect to the default named instance `localhost\SQLExpress`.

  1. Create or use an existing database.

     You have to have a usable database before you can set up the SQL Storage Provider.

  1. Now you can follow the [SQL setup steps](#set-up-sql) in this article.

- Optional: [Visual Studio Code](https://code.visualstudio.com/Download) installed on your local computer for local development. For more information, review [Create integration workflows with single-tenant Azure Logic Apps (Standard) in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md).

<a name="set-up-sql-environment"></a>

## Set up your SQL environment

1. Before you set up SQL Storage Provider, complete the required steps in the [Prerequisites](#prerequisites).

1. Set up permissions for your SQL server.

   Currently, the SQL Storage Provider supports SQL authentication in connection strings. You can also use Windows Authentication for local development and testing. At this time, support for Azure Active Directory (Azure AD) and managed identities is not available.

   You must use an identity that has permissions to create and manage logic app artifacts in the target SQL database. For example, an administrator has all the required permissions to create and manage these artifacts. The following list describes the necessary permissions to work with logic app artifacts:

   - Create and delete the following schemas: `dt`, `dc`, and `dq`.
   - Add, alter, and delete tables in these schemas.
   - Add, alter, and delete user-defined table types in these schemas.

   For more information about targeted permissions, review [SQL server permissions in the Database Engine](/sql/relational-databases/security/permissions-database-engine).

1. Connect to SQL.

   - Make sure your SQL database allows necessary access for development.

   - If you're using Azure SQL database, complete the following requirements:

     - For local development and testing, explicitly allow connections from your local computer's IP address. You can [set your IP firewall rules in Azure SQL Server](../azure-sql/database/network-access-controls-overview.md#ip-firewall-rules).

     - In the [Azure portal](https://portal.azure.com), permit your logic app resource to access the SQL database with a provided connection string by [allowing Azure services](../azure-sql/database/network-access-controls-overview.md#allow-azure-services).

     - Set up any other [SQL database network access controls](../azure-sql/database/network-access-controls-overview.md) as necessary for your scenario.

   - If you're using Azure SQL Managed Instance, allow Azure services (`logicapp`) to [connect to your SQL database through secured public endpoints](../azure-sql/managed-instance/public-endpoint-overview.md).

<a name="set-up-sql-logic-app-creation-azure-portal"></a>

## Set up SQL for creation in the Azure portal

When you create your logic app using the **Logic App (Standard)** resource type in Azure, you can set up SQL as your storage provider.

1. In the [Azure portal](https://portal.azure.com), sign in with your Azure account.

1. In the Azure portal search box, enter `logic apps`, and select **Logic apps**.

   ![Screenshot that shows the Azure portal search box with the "logic apps" search term and the "Logic apps" category selected.](./media/set-up-sql-db-storage-single-tenant-standard-workflows/find-logic-app-resource-template.png)

1. On the **Logic apps** page, select **Add**.

1. On the **Create Logic App** page, on the **Basics** tab, provide the following information about your logic app resource:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | The Azure subscription to use for your logic app. |
   | **Resource Group** | Yes | <*Azure-resource-group-name*> | The Azure resource group where you create your logic app and related resources. This resource name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <p><p>This example creates a resource group named `Fabrikam-Workflows-RG`. |
   | **Type** | Yes | **Standard** | This logic app resource type runs in the single-tenant Azure Logic Apps environment and uses the [Standard usage, billing, and pricing model](logic-apps-pricing.md#standard-pricing). |
   | **Logic App name** | Yes | <*logic-app-name*> | The name to use for your logic app. This resource name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <p><p>This example creates a logic app named `Fabrikam-Workflows`. <p><p>**Note**: Your logic app's name automatically gets the suffix, `.azurewebsites.net`, because the **Logic App (Standard)** resource is powered by the single-tenant Azure Logic Apps runtime, which uses the Azure Functions extensibility model and is hosted as an extension on the Azure Functions runtime. Azure Functions uses the same app naming convention. |
   | **Publish** | Yes | <*deployment-environment*> | The deployment destination for your logic app. By default, **Workflow** is selected for deployment to single-tenant Azure Logic Apps. Azure creates an empty logic app resource where you have to add your first workflow. <p><p>**Note**: Currently, the **Docker Container** option requires a [*custom location*](../azure-arc/kubernetes/conceptual-custom-locations.md) on an Azure Arc enabled Kubernetes cluster, which you can use with [Azure Arc enabled Logic Apps (Preview)](azure-arc-enabled-logic-apps-overview.md). The resource locations for your logic app, custom location, and cluster must all be the same. |
   | **Region** | Yes | <*Azure-region*> | The location to use for creating your resource group and resources. This example deploys the sample logic app to Azure and uses **West US**. <p>- If you selected **Docker Container**, select your custom location. <p>- To deploy to an [ASEv3](../app-service/environment/overview.md) resource, which must first exist, select that environment resource from the **Region** list. |
   |||||

   The following example shows the **Create Logic App (Standard)** page:

   ![Screenshot that shows the Azure portal and "Create Logic App" page.](./media/set-up-sql-db-storage-single-tenant-standard-workflows/create-logic-app-resource-portal.png)

1. When you're ready, select **Next: Hosting**. On the **Hosting** tab, provide the following information about the storage solution and hosting plan to use for your logic app.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Storage type** | Yes | **SQL and Azure Storage** | The storage type that you want to use for workflow-related artifacts and data. <p><p>- To use SQL as primary storage and Azure Storage as secondary storage, select **SQL and Azure Storage**. <p><p>- To deploy only to Azure, review [Create an integration workflow with single-tenant Azure Logic Apps (Standard) in the Azure portal](create-single-tenant-workflows-azure-portal.md). <p><p>**Note**: If you're deploying to an Azure region, you still need an Azure storage account, which is used to complete the one-time hosting of the logic app's configuration on the Azure Logic Apps platform. The ongoing workflow state, run history, and other runtime artifacts are stored in your SQL database. <p><p>For deployments to a custom location that's hosted on an Azure Arc cluster, you only need SQL as your storage provider. |
   | **Storage account** | Yes | <*Azure-storage-account-name*> | The [Azure Storage account](../storage/common/storage-account-overview.md) to use for storage transactions. <p><p>This resource name must be unique across regions and have 3-24 characters with only numbers and lowercase letters. Either select an existing account or create a new account. <p><p>This example creates a storage account named `fabrikamstorageacct`. |
   | **SQL connection string** | Your SQL connection string. <p><p>**Note**: Make sure that you enter a correct connection string because Azure portal won't validate this string for you. |
   | **Plan type** | Yes | <*hosting-plan*> | The hosting plan to use for deploying your logic app. <p><p>For more information, review [Hosting plans and pricing tiers](logic-apps-pricing.md#standard-pricing). |
   | **Windows Plan** | Yes | <*plan-name*> | The plan name to use. Either select an existing plan name or provide a name for a new plan. <p><p>This example uses the name `Fabrikam-Service-Plan`. |
   | **SKU and size** | Yes | <*pricing-tier*> | The [pricing tier](../app-service/overview-hosting-plans.md) to use for your logic app. Your selection affects the pricing, compute, memory, and storage that your logic app and workflows use. <p><p>To change the default pricing tier, select **Change size**. You can then select other pricing tiers, based on the workload that you need. <p><p>For more information, review [Hosting plans and pricing tiers](logic-apps-pricing.md#standard-pricing). |
   |||||

1. Finish the remaining creation steps in [Create an integration workflow with single-tenant Azure Logic Apps (Standard) in the Azure portal](create-single-tenant-workflows-azure-portal.md).

When you're done, your new logic app resource and workflow is live in Azure and uses your SQL database as the primary storage provider.

<a name="set-up-sql-local-dev"></a>

## Set up SQL for local development in Visual Studio Code

The following steps show how to set up SQL as a storage provider for local development and testing in Visual Studio Code:

1. Set up your development environment to work with single-tenant Azure Logic Apps.

   1. Meet the [prerequisites](create-single-tenant-workflows-visual-studio-code.md#prerequisites) to work in Visual Studio Code with the Azure Logic Apps (Standard) extension.

   1. [Set up Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#set-up) to work with the Azure Logic Apps (Standard) extension.

   1. In Visual Studio Code, [connect to your Azure account](create-single-tenant-workflows-visual-studio-code.md#connect-azure-account) and [create a blank logic app project](create-single-tenant-workflows-visual-studio-code.md#create-project).

1. In Visual Studio Code, open the Explorer pane. At your project's root, move your mouse pointer over any blank area under all the project's files and folders, open the shortcut menu, and select **Use SQL as a Storage provider**.

   ![Screenshot showing Visual Studio Code, Explorer pane, and mouse pointer at project root in blank area, opened shortcut menu, and "Use SQL as a Storage provider" selected.](./media/set-up-sql-db-storage-single-tenant-standard-workflows/)

1. When the prompt appears, enter your SQL connection string. You can opt to use a local SQL Express instance or any other SQL database that you have.

   ![Screenshot showing Visual Studio Code and SQL connection string prompt.](./media/set-up-sql-db-storage-single-tenant-standard-workflows/)

1. After confirmation, Visual Studio Code creates the following setting in your project's **local.settings.json** folder. You can update this setting at any time.  

   ![Screenshot showing Visual Studio Code, logic app project, and open "local.settings.json" file with SQL connection string setting.](./media/set-up-sql-db-storage-single-tenant-standard-workflows/)

<a name="set-up-sql-logic-app-deployment-visual-studio-code"></a>

## Set up SQL for deployment from Visual Studio Code

You can directly publish your logic app project from Visual Studio Code to Azure. This action deploys your logic app project using the **Logic App (Standard)** resource type.

- If you're deploying your logic app as a new resource in Azure, and you want to use SQL as your primary storage provider, enter your SQL connection string when you publish your app. For complete steps, follow [Set up SQL when deploying new logic apps](#set-up-sql-new-logic-app).

- If you're deploying your logic app to an existing **Logic App (Standard)** resource in Azure, and you already set up your SQL settings, just publish your logic app. This action overwrites your existing logic app, so when the following message appears after you publish, make sure that you select **Upload settings**. For complete steps, follow [Set up SQL when deploying to existing logic apps](#set-up-sql-existing-logic-app).

  ![Screenshot that shows Visual Studio Code and the deployment completed message with "Upload settings" selected.](./media/set-up-sql-db-storage-single-tenant-standard-workflows/select-upload-settings.png)

 After deployment, make sure that you update your connection string because local SQL Express won't work with a logic app that's deployed in Azure.

<a name="deploy-new-logic-app-visual-studio-code"></a>

### Deploy as new Logic App (Standard) resource

1. On the Visual Studio Code Activity Bar, select the Azure icon.

1. On the **Azure: Logic Apps (Standard)** pane toolbar, select **Deploy to Logic App**.

   ![Screenshot that shows the "Azure: Logic Apps (Standard)" pane and "Deploy to Logic App" icon selected.](./media/set-up-sql-db-storage-single-tenant-standard-workflows/deploy-to-logic-app.png)

1. If prompted, select the Azure subscription to use for your logic app deployment.

1. From the list that Visual Studio Code opens, make sure to select the advanced option for **Create new Logic App (Standard) in Azure Advanced**. Otherwise, you're not prompted to set up SQL.

   ![Screenshot that shows the deployment option to "Create new Logic App (Standard) in Azure Advanced" selected.](./media/set-up-sql-db-storage-single-tenant-standard-workflows/select-create-logic-app-advanced.png)

1. Provide a globally unique name for your new logic app, which is the name to use for the Logic App (Standard) resource. This example uses `Fabrikam-Workflows-App`.

   ![Screenshot that shows the prompt for a globally unique name to use for your logic app.](./media/set-up-sql-db-storage-single-tenant-standard-workflows/enter-logic-app-name.png)

1. Specify a hosting plan for your new logic app. Either create a name for your plan, or select an existing plan. This example selects **Create new App Service Plan**.

   ![Screenshot that shows the prompt to create a name for hosting plan with "Create new App Service plan" selected.](./media/set-up-sql-db-storage-single-tenant-standard-workflows/create-app-service-plan.png)

1. Provide a name for your hosting plan, and then select a pricing tier for your selected plan.

   For more information, review [Hosting plans and pricing tiers](logic-apps-pricing.md#standard-pricing).

1. For optimal performance, select the same resource group as your project for the deployment.

   > [!NOTE]
   > Although you can create or use a different resource group, doing so might affect performance. 
   > If you create or choose a different resource group, but cancel after the confirmation prompt appears, 
   > your deployment is also canceled.

1. Select **Create new storage account** or an existing storage account, if available.

   > [!NOTE]
   > This step is required only for Azure deployments. In Azure, Azure Storage is used to complete 
   > the one-time hosting of the logic app's configuration on the Azure Logic Apps platform. The ongoing 
   > workflow state, run history, and other runtime artifacts are stored in your SQL database.
   >
   > For deployments to a custom location that's hosted on an Azure Arc cluster, you only 
   > need SQL as your storage provider.  

   ![Screenshot that shows the "Azure: Logic Apps (Standard)" pane and a prompt to create or select a storage account.](./media/set-up-sql-db-storage-single-tenant-standard-workflows/create-storage-account.png)

1. At the prompts, select **Yes** to confirm SQL setup, and enter your SQL connection string.

   > [!NOTE]
   > Make sure that you enter a correct connection string because Visual Studio Code won't validate this string for you.

1. Finish the remaining deployment steps in [Publish to a new Logic App (Standard) resource](create-single-tenant-workflows-visual-studio-code.md#publish-new-logic-app).

When you're done, your new logic app resource and workflow is live in Azure and uses your SQL database as the primary storage provider.

## Troubleshooting


## Next steps

