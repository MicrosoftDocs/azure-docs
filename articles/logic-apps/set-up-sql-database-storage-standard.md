---
title: Set Up SQL Database Storage for Standard Workflows
description: Learn to set up a SQL database as the storage provider for Standard workflows, including hybrid deployment, in Azure Logic Apps. Store artifacts, state, and run history. Gain granular control over performance and predictable costs.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.date: 11/30/2025
ms.custom: sfi-image-nochange
#Customer intent: As an integration developer working with Azure Logic Apps, I want to set up my own SQL database for storage to save artifacts, state, and run history for Standard workflows, including hybrid deployment.
---

# Set up SQL database storage for Standard workflows in Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Whether you create Standard logic apps hosted in Azure Logic Apps, App Service Environment v3, or your own infrastructure, you always need a storage provider to save workflow artifacts, state, and runtime data. When you set up your own SQL database as the storage provider, you get more flexibility and control over your workflow runtime environment, throughput, scaling, performance, and management.

This guide describes why and how to set up a SQL database as the storage provider. You can complete this task during logic app creation with the Azure portal or deployment with Visual Studio Code.

<a name="why-sql"></a>

## Why set up SQL database storage

A SQL database provides the following benefits:

| Benefit | Description |
|---------|-------------|
| **Portability** | SQL has many form factors, including virtual machines, Platform as a Service (PaaS), and containers. You can run SQL databases almost anywhere that you might want to run logic app workflows. |
| **Control** | SQL provides granular control over database throughput, performance, and scaling during particular periods or for specific workloads. SQL pricing is based on CPU usage and throughput, which provides more predictable pricing than Azure Storage where costs are based on each operation. |
| **Reuse existing assets** | Apply familiar Microsoft tools and assets for modern integrations with SQL. Reuse assets across traditional on-premises deployments and modern cloud implementations with Azure Hybrid Benefits. SQL also provides mature and well-supported tooling, such as SQL Server Management Studio (SSMS), command-line interfaces, and SDKs. |
| **Compliance** | SQL provides more options than Azure Storage for you to back up, restore, fail over, and build in redundancies. You can apply the same enterprise-grade mechanisms as other enterprise applications to your logic app's storage. |

<a name="when-sql"></a>

## When to choose SQL

The following table describes scenarios when you might choose SQL:

| Scenario | Recommended storage |
|----------|---------------------|
| Run Standard logic app workflows in Azure with more control over storage throughput and performance. | Choose SQL because Azure Storage doesn't provide tools to fine-tune throughput and performance. |
| Run Standard workflows in hybrid environments, including on-premises or bring-your-own infrastructure. For more information, see: <br><br>- [Set up your own infrastructure for Standard logic apps for hybrid deployment](set-up-standard-workflows-hybrid-deployment-requirements.md) <br>- [Create Standard workflows for hybrid deployment](create-standard-workflows-hybrid-deployment.md) | Choose SQL because you can decide where to host your SQL database, for example, on-premises, on a virtual machine, in a container, or multicloud environment. Consider running your logic app workflows close to the systems you want to integrate, or reducing your dependency on the cloud.   |
| Depend on predictable storage costs. | Choose SQL when you want more control over scaling costs. SQL costs are based on each compute and input-output operations per second (IOPs). Azure Storage costs are based on numbers of operations, which might work better for small workloads that scale to zero. |
| Prefer SQL over Azure Storage. | SQL is a well-known and reliable ecosystem where you can apply the same governance and management across your logic apps behind-the-scenes operations. |
| Reuse existing SQL environments. | Choose SQL if you already own SQL licenses that you want to reuse or modernize onto the cloud. You also might want to apply Azure Hybrid Benefits to your logic app integrations. |
| Everything else | Choose Azure Storage, which is the default storage provider. |

## Prerequisites

- An Azure account and active subscription. [Get a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A SQL server and database environment for your logic app. However, before you set up your environment, complete the following steps:

  1. Create a SQL server instance.

     Supported SQL server editions:

     - [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads)

     - [Azure SQL Database](https://azure.microsoft.com/products/azure-sql/database/)

     - [Azure SQL Managed Instance](https://azure.microsoft.com/products/azure-sql/managed-instance/) and others

  1. If your SQL server is supported and hosted on Azure, make sure to set up the following permissions:

     1. In [Azure portal](https://portal.azure.com), go to your SQL server resource.

     1. On the server sidebar, under **Security**, select **Firewalls and virtual networks**.

     1. On the opened pane, under **Allow Azure services and resources to access this server**, select **Yes**.

     1. Save your changes.

  1. If your SQL server isn't hosted on Azure, make sure that any firewalls or network settings allow Azure services and resources to access your server and database.

  1. If you have SQL Express for local development, connect to the default named instance `localhost\SQLExpress`.

  1. Create or reuse an existing database.

     You must have an active, viable database before you can set up SQL Storage Provider.

  1. Follow the [steps to set up your SQL environment](#set-up-sql-environment) in this article.

  1. For local development, you need [Visual Studio Code](https://code.visualstudio.com/Download) locally installed on your computer.

     > [!NOTE]
     >
     > Make sure to install the [latest Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools/releases) and that you have SQL support by choosing the Microsoft Installer (MSI), which is `func-cli-X.X.XXXX-x*.msi`. For more information about Visual Studio Code requirements, see [Create Standard workflows in Azure Logic Apps with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

<a name="set-up-sql-environment"></a>

## Set up your SQL environment

1. Before you set up SQL Storage Provider, confirm that you finished the required steps in the [Prerequisites](#prerequisites).

1. Set up permissions for your SQL server.

   SQL Storage Provider currently supports SQL authentication through connection strings. You can also choose Windows Authentication for local development and testing. At this time, support for Microsoft Entra ID and managed identities isn't available.

   You must have an identity with the permissions to create and manage workflow artifacts in the target SQL database. For example, an administrator has all the required permissions to create and manage these artifacts.
   
   The following list describes the artifacts that the Azure Logic Apps runtime tries to create with the SQL connection string that you provide. Make sure that the identity in the SQL connection string has the necessary permissions to create the following artifacts:

   - Create and delete the following schemas: `dt`, `dc`, and `dq`.
   - Add, alter, and delete tables in these schemas.
   - Add, alter, and delete user-defined table types in these schemas.

   For more information about targeted permissions, see [SQL server permissions in the Database Engine](/sql/relational-databases/security/permissions-database-engine).

   > [!IMPORTANT]
   >
   > When you have sensitive information, such as connection strings that include usernames and passwords, make sure to choose the most secure authentication flow available. Microsoft recommends that you authenticate access to Azure resources with a [managed identity](/entra/identity/managed-identities-azure-resources/overview) when possible, and assign a role that has the least privilege necessary.
   >
   > If this capability is unavailable, make sure to secure connection strings through other measures, such as [Azure Key Vault](/azure/key-vault/general/overview), which you can add to your [app settings](edit-app-settings-host-settings.md). You can then [directly reference secure strings](../app-service/app-service-key-vault-references.md), such as connection strings and keys. Similar to ARM templates, where you can define environment variables at deployment time, you can define app settings in your [logic app workflow definition](/azure/templates/microsoft.logic/workflows). You can then capture dynamically generated infrastructure values, such as connection endpoints, storage strings, and more. For more information, see [Application types for the Microsoft identity platform](/entra/identity-platform/v2-app-types).

1. Connect to your SQL server and database.

   - Make sure your SQL database allows necessary access for development.

   - If you have an Azure SQL database, complete the following requirements:

     - For local development and testing, explicitly allow connections from your local computer's IP address. You can [set your IP firewall rules in Azure SQL Server](/azure/azure-sql/database/network-access-controls-overview#ip-firewall-rules).

     - In the [Azure portal](https://portal.azure.com), permit your logic app resource to access the SQL database with a provided connection string by [allowing Azure services](/azure/azure-sql/database/network-access-controls-overview#allow-azure-services).

     - Set up any other [SQL database network access controls](/azure/azure-sql/database/network-access-controls-overview) as necessary for your scenario.

   - If you have Azure SQL Managed Instance, allow Azure services (`logicapp`) to [connect to your SQL database through secured public endpoints](/azure/azure-sql/managed-instance/public-endpoint-overview).

<a name="set-up-sql-logic-app-creation-azure-portal"></a>

## Set up SQL during creation in the Azure portal

When you create your Standard logic app, you can set up SQL as your storage provider.

1. In the [Azure portal](https://portal.azure.com) search box, enter `logic apps`, and select **Logic apps**.

   :::image type="content" source="media/set-up-sql-database-storage-standard/find-logic-app-resource-template.png" alt-text="Screenshot shows the Azure portal search box with logic apps as search term and selected category named Logic apps." lightbox="media/set-up-sql-database-storage-standard/find-logic-app-resource-template.png":::

1. On the **Logic apps** page toolbar, select **Add**.

1. On the **Create Logic App** page, under **Standard**, select the hosting option that you want.

1. On the **Basics** tab, provide the following information, which can vary based on your selections:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | The Azure subscription for your logic app. |
   | **Resource Group** | Yes | <*Azure-resource-group-name*> | The Azure resource group for your logic app and related resources. The name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a resource group named `Fabrikam-Workflows-RG`. |
   | **Type** | Yes | **Standard** | This logic app type follows the [Standard usage, billing, and pricing model](logic-apps-pricing.md#standard-pricing). |
   | **Logic App name** | Yes | <*logic-app-name*> | The name for your logic app. This resource name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a logic app named `Fabrikam-Workflows`. <br><br>**Note**: Your logic app's name automatically gets the suffix, `.azurewebsites.net`, because the Standard logic app resource is powered by the single-tenant Azure Logic Apps runtime, which uses the Azure Functions extensibility model and is hosted as an extension on the Azure Functions runtime. Azure Functions uses the same app naming convention. |
   | **Region** | Yes | <*Azure-region*> | The location for your resource group and resources. This example deploys the sample logic app to Azure and uses **West US**. <br><br>- To deploy to an [ASEv3](../app-service/environment/overview.md) resource, which must first exist, select that environment resource from the **Region** list. |
   | **Windows Plan** | Yes | <*plan-name*> | The plan name to use. Either select an existing plan name or provide a name for a new plan. <br><br>This example uses the name **My-App-Service-Plan**. <br><br>**Note**: Don't choose a Linux-based App Service plan. Only the Windows-based App Service plan is supported. |
   | **Pricing plan** | Yes | <*pricing-tier*> | The [pricing tier](../app-service/overview-hosting-plans.md) for your logic app and workflows. Your selection affects the pricing, compute, memory, and storage for your logic app and workflows. <br><br>For more information, see [Hosting plans and pricing tiers](logic-apps-pricing.md#standard-pricing). |

   The following example shows the **Create Logic App** page with the **Basics** tab:

   :::image type="content" source="media/set-up-sql-database-storage-standard/create-logic-app-resource-portal.png" alt-text="Screenshot shows Azure portal and Create Logic App page with Basics tab." lightbox="media/set-up-sql-database-storage-standard/create-logic-app-resource-portal.png":::

1. When you're ready, select **Next: Storage**. On the **Storage** tab, provide the following information about the storage solution and hosting plan for your logic app.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Storage type** | Yes | **SQL and Azure Storage** | The storage for workflow artifacts and data. <br><br>- If you selected a custom location as your region, select **SQL**. <br><br>- If you selected an Azure region or ASEv3 location, select **SQL and Azure Storage**. <br><br>**Note**: If you're deploying to an Azure region, you still need an Azure Storage account. This requirement completes the one-time hosting of the logic app configuration on the Azure Logic Apps platform. The workflow's definition, state, run history, and other runtime artifacts are stored in your SQL database. <br><br>For deployments to a custom location hosted on an Azure Arc cluster, you only need a SQL database for storage. |
   | **Storage account** | Yes | <*Azure-storage-account-name*> | The [Azure Storage account](../storage/common/storage-account-overview.md) for storage transactions. <br><br>This resource name must be unique across regions and have 3-24 characters with only numbers and lowercase letters. Either select an existing account or create a new account. <br><br>This example creates a storage account named `fabrikamstorageacct`. |
   | **SQL connection string** | Yes | <*sql-connection-string*> | Your SQL connection string, which currently supports only SQL authentication, not OAuth or managed identity authentication. <br><br>**Note**: Make sure that you enter a correct connection string because Azure portal won't validate this string for you. |

   The following example shows the **Create Logic App** page with the **Storage** tab:

   :::image type="content" source="media/set-up-sql-database-storage-standard/set-up-sql-storage-details.png" alt-text="Screenshot shows Azure portal and Create Logic App page with the Storage tab." lightbox="media/set-up-sql-database-storage-standard/set-up-sql-storage-details.png":::

1. Finish the remaining creation steps in [Create an example Standard workflow in single-tenant Azure Logic Apps](create-single-tenant-workflows-azure-portal.md).

When you're done, your new logic app resource and workflow is live in Azure and uses your SQL database as a storage provider.

<a name="set-up-sql-local-dev"></a>

## Set up SQL for local development in Visual Studio Code

The following steps show how to set up SQL as a storage provider for local development and testing in Visual Studio Code:

1. Set up your development environment to work with single-tenant Azure Logic Apps.

   1. Meet the [prerequisites](create-single-tenant-workflows-visual-studio-code.md#prerequisites) to work in Visual Studio Code with the Azure Logic Apps (Standard) extension.

   1. [Set up Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#set-up) to work with the Azure Logic Apps (Standard) extension.

   1. In Visual Studio Code, [connect to your Azure account](create-single-tenant-workflows-visual-studio-code.md#connect-azure-account) and [create a blank logic app project](create-single-tenant-workflows-visual-studio-code.md#create-project).

1. In Visual Studio Code, open the Explorer pane, if not already open.

1. In the Explorer pane, at your logic app project's root, move your mouse pointer over any blank area under all the project's files and folders, open the shortcut menu, and select **Use SQL storage for your logic app project**.

   :::image type="content" source="media/set-up-sql-database-storage-standard/use-sql-storage-logic-app-project.png" alt-text="Screenshot shows Visual Studio Code, Explorer pane, and mouse pointer at project root in blank area, opened shortcut menu, and selected option for Use SQL storage for your logic app project." lightbox="media/set-up-sql-database-storage-standard/use-sql-storage-logic-app-project.png":::

1. When the prompt appears, enter your SQL connection string. You can choose a local SQL Express instance or any other SQL database that you have.

   :::image type="content" source="media/set-up-sql-database-storage-standard/enter-sql-connection-string.png" alt-text="Screenshot shows SQL connection string prompt." lightbox="media/set-up-sql-database-storage-standard/enter-sql-connection-string.png":::

   After confirmation, Visual Studio Code creates the following setting in your project's *local.settings.json* file. You can update this setting at any time.

   :::image type="content" source="media/set-up-sql-database-storage-standard/local-settings-json-file.png" alt-text="Screenshot shows logic app project and open file named local.settings.json with SQL connection string setting." lightbox="media/set-up-sql-database-storage-standard/local-settings-json-file.png":::

<a name="set-up-sql-logic-app-deployment-visual-studio-code"></a>

## Set up SQL during deployment from Visual Studio Code

You can directly publish your logic app project from Visual Studio Code to Azure. This action deploys your logic app project to a Standard logic app resource.

- If you're publishing your project as a new Standard logic app resource in Azure, and you want a SQL database as a storage provider, enter your SQL connection string when you publish your app. For complete steps, follow [Set up SQL for new logic app deployment](#deploy-new-logic-app-visual-studio-code).

- If you already set up your SQL settings, you can publish your logic app project to an already deployed a Standard logic app resource in Azure. This action overwrites your existing logic app.

  > [!NOTE]
  >
  > Local SQL Express won't work with logic apps deployed and hosted in Azure.

<a name="deploy-new-logic-app-visual-studio-code"></a>

### Set up SQL for new Standard logic app resource deployment

1. In Visual Studio Code, open the Explorer pane, if not already open.

1. In the Explorer pane, at your logic app project's root, move your mouse pointer over any blank area under all the project's files and folders, open the shortcut menu, and select **Deploy to logic app**.

1. If prompted, select the Azure subscription for your logic app deployment.

1. From the list that Visual Studio Code opens, make sure to select the advanced option for **Create new Logic App (Standard) in Azure Advanced**. Otherwise, you're not prompted to set up SQL.

   :::image type="content" source="media/set-up-sql-database-storage-standard/select-create-logic-app-advanced.png" alt-text="Screenshot shows selected deployment option to create new Standard logic app in Azure Advanced." lightbox="media/set-up-sql-database-storage-standard/select-create-logic-app-advanced.png":::

1. When prompted, provide a globally unique name for your new logic app, which is the name for the Standard logic app resource. This example uses `Fabrikam-Workflows-App`.

   :::image type="content" source="media/set-up-sql-database-storage-standard/enter-logic-app-name.png" alt-text="Screenshot shows prompt for a globally unique name for your logic app." lightbox="media/set-up-sql-database-storage-standard/enter-logic-app-name.png":::

1. Select a location for your logic app. You can also start typing to filter the list.

   - To deploy to Azure, select the Azure region where you want to deploy. If you created an App Service Environment v3 (ASEv3) resource and want to deploy there, select your ASEv3.

   The following example shows the location list filtered to **West US**.

   ![Screenshot that shows the prompt to select a deployment location with available Azure regions and custom location for Azure Arc deployments.](./media/set-up-sql-database-storage-standard/select-location.png)

1. Select the hosting plan type for your new logic app.

   1. If you selected an ASEv3 as your app's location, select **App Service Plan**, and then select your ASEv3 resource. Otherwise, select **Workflow Standard**.

      ![Screenshot that shows the prompt to select 'Workflow Standard' or 'App Service Plan'.](./media/set-up-sql-database-storage-standard/select-hosting-plan.png)

   1. Either create a name for your plan, or select an existing plan.

      This example selects **Create new App Service Plan** as no existing plans are available.

      ![Screenshot that shows the prompt to create a name for hosting plan with "Create new App Service plan" selected.](./media/set-up-sql-database-storage-standard/create-app-service-plan.png)

1. Provide a name for your hosting plan, and then select a pricing tier for your selected plan.

   For more information, see [Hosting plans and pricing tiers](logic-apps-pricing.md#standard-pricing).

1. When you're prompted for an Azure resource group, for optimal performance, select the same Azure resource group as your project for your deployment.

   > [!NOTE]
   >
   > Although you can create or choose a different resource group, doing so might affect performance. If you create or choose a different resource group, but cancel after the confirmation prompt appears, your deployment is also canceled.

1. When you're prompted to select a storage account for your logic app, choose one of the following options:

   - If you selected a custom location, select the **SQL** option.

   - If you want to deploy to Azure, select the **SQL and Azure Storage** option.

     > [!NOTE]
     >
     > This option is required only for Azure deployments. In Azure, Azure Storage is required to complete a one-time hosting of the logic app configuration on the Azure Logic Apps platform. The ongoing workflow state, run history, and other runtime artifacts are stored in your SQL database.
     >
     > For deployments to a custom location that's hosted on an Azure Arc cluster, you only need a SQL database for storage.  

1. When prompted, select **Create new storage account** or an existing storage account, if available.

   ![Screenshot that shows the "Azure: Logic Apps (Standard)" pane and a prompt to create or select a storage account.](./media/set-up-sql-database-storage-standard/create-storage.png)

1. At the SQL storage confirmation prompt, select **Yes**. At the connection string prompt, enter your SQL connection string.

   > [!NOTE]
   > Make sure that you enter a correct connection string because Visual Studio Code won't validate this string for you.

   ![Screenshot showing Visual Studio Code and SQL connection string prompt.](./media/set-up-sql-database-storage-standard/enter-sql-connection-string.png)

1. Finish the remaining deployment steps in [Publish to a new Standard logic app resource](create-single-tenant-workflows-visual-studio-code.md#publish-new-logic-app).

When you're done, your new logic app resource and workflow is live in Azure and uses your SQL database as a storage provider.

## Validate deployments

After you deploy your Standard logic app resource to Azure, you can check whether your settings are correct:

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. On the resource navigation menu, under **Settings**, select **Configuration**.

1. On the **Configuration** pane, under **Application settings**, find the **Workflows.Sql.ConnectionString** app setting, and confirm that your SQL connection string appears and is correct.

1. In your SQL environment, confirm that the SQL tables were created with the schema name starting with 'dt' and 'dq'.

For example, the following screenshot shows the tables that the single-tenant Azure Logic Apps runtime created for a logic app resource with a single workflow:

![Screenshot showing SQL tables created by the single-tenant Azure Logic Apps runtime.](./media/set-up-sql-database-storage-standard/runtime-created-tables-sql.png)

The single-tenant Azure Logic Apps service also creates user-defined table types. For example, the following screenshot shows user-defined table types that the single-tenant Azure Logic Apps runtime created for a logic app resource with a single workflow:

![Screenshot showing SQL user-defined table types created by the single-tenant Azure Logic Apps runtime.](./media/set-up-sql-database-storage-standard/runtime-created-user-defined-tables-sql.png)

## Related content

- [What is Azure Logic Apps?](logic-apps-overview.md)
- [Single-tenant versus multitenant in Azure Logic Apps](single-tenant-overview-compare.md)
- [Create Standard workflows in Azure Logic Apps with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)
- [Edit host and app settings for Standard logic apps](edit-app-settings-host-settings.md)
