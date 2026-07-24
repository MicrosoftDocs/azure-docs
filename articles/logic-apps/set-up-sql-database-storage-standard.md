---
title: Set Up SQL Database Storage for Standard Workflows
description: Set up SQL database storage for Standard workflows in Azure Logic Apps to manage artifacts, state, and run history. Gain control over performance and predictable costs.
services: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.update-cycle: 1095-days
ms.date: 04/03/2026
ms.custom: sfi-image-nochange
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to set up my own SQL database for storage to save artifacts, state, and run history for Standard workflows, including hybrid deployment.
---

# Set up SQL database storage for Standard workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](includes/logic-apps-sku-standard.md)]

Standard logic app workflows require a storage provider for artifacts, state, and runtime data. When you need granular and flexible control over runtime behavior, throughput, scaling, performance, and management, set up a SQL database as your storage provider. You have this option whether your logic app workflows run in single-tenant Azure Logic apps, App Service Environment v3, or your own infrastructure.

This guide shows why and how to set up SQL database storage during logic app creation in the Azure portal or deployment by using Visual Studio Code.

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
| Reuse existing SQL environments. | Choose SQL if you own SQL licenses you want to reuse or modernize onto the cloud. You also might want to apply Azure Hybrid Benefits to your logic app integrations. |
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

   You must have an identity with the permissions to create and manage workflow artifacts in the target SQL database. For example, an administrator has the required permissions to create and manage these artifacts.
   
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

   :::image type="content" source="media/set-up-sql-database-storage-standard/find-logic-app-resource-template.png" alt-text="Screenshot shows the Azure portal search box with logic apps entered and selected category named Logic apps." lightbox="media/set-up-sql-database-storage-standard/find-logic-app-resource-template.png":::

1. On the **Logic apps** page toolbar, select **Create**.

1. On the **Create Logic App** page, under **Standard**, select the hosting option you want.

1. On the **Basics** tab, provide the following information, which varies based on your selected hosting option:

   For all hosting options, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | The Azure subscription for your logic app. |
   | **Resource Group** | Yes | <*Azure-resource-group-name*> | The Azure resource group for your logic app and related resources. The name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a resource group named `Fabrikam-Workflows-RG`. |
   | **Type** | Yes | **Standard** | This logic app type follows the [Standard usage, billing, and pricing model](logic-apps-pricing.md#standard-pricing). |
   | **Logic App name** | Yes | <*logic-app-name*> | The name for your logic app. This resource name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a logic app named `Fabrikam-Workflows`. <br><br>**Note**: Your logic app's name automatically gets the suffix, `.azurewebsites.net`, because the Standard logic app resource is powered by the single-tenant Azure Logic Apps runtime, which uses the Azure Functions extensibility model and is hosted as an extension on the Azure Functions runtime. Azure Functions uses the same app naming convention. |

   - For the **Workflow Service Plan** hosting option, provide the following information:

     | Property | Required | Value | Description |
     |----------|----------|-------|-------------|
     | **Region** | Yes | <*Azure-region*> | The Azure region where to deploy your resource group and resources. |
     | **Windows Plan** | Yes | <*plan-name*> | The plan name to use. Either select an existing plan name or enter a name for a new plan. <br><br>This example uses the name **My-App-Service-Plan**. <br><br>**Note**: Don't choose a Linux-based App Service plan. Only the Windows-based App Service plan is supported. |
     | **Pricing plan** | Yes | <*pricing-tier*> | The [pricing tier](../app-service/overview-hosting-plans.md) for your logic app and workflows. Your selection affects the pricing, compute, memory, and storage for your logic app and workflows. <br><br>For more information, see [Hosting plans and pricing tiers](logic-apps-pricing.md#standard-pricing). |

     The following example shows the **Create Logic App** page and the **Basics** tab for a Standard logic app resource with the **Workflow Service Plan** hosting option:

     :::image type="content" source="media/set-up-sql-database-storage-standard/create-logic-app-workflow-service-plan.png" alt-text="Screenshot shows Azure portal and Create Logic App page with Basics tab for the Workflow Service Plan option." lightbox="media/set-up-sql-database-storage-standard/create-logic-app-workflow-service-plan.png":::

   - For the **App Service Environment V3** hosting option, provide the following information:

     | Property | Required | Value | Description |
     |----------|----------|-------|-------------|
     | **Region** | Yes | <*ASE-name*> | The [ASEv3](../app-service/environment/overview.md) resource where to deploy your resource group and resources. |
     | **Windows Plan** | Yes | <*plan-name*> | The plan name to use. Either select an existing plan name or enter a name for a new plan. <br><br>This example uses the name **My-App-Service-Plan**. <br><br>**Note**: Don't choose a Linux-based App Service plan. Only the Windows-based App Service plan is supported. |
     | **Pricing plan** | Yes | <*pricing-tier*> | The [pricing tier](../app-service/overview-hosting-plans.md) for the ASEv3. Your selection affects the pricing, compute, memory, and storage for your logic app and workflows. <br><br>For more information, see [Hosting plans and pricing tiers](logic-apps-pricing.md#standard-pricing). |

     The following example shows the **Create Logic App** page and the **Basics** tab for a Standard logic app resource with the **App Service Environment V3** hosting option:

     :::image type="content" source="media/set-up-sql-database-storage-standard/create-logic-app-service-environment.png" alt-text="Screenshot shows Azure portal and Create Logic App page with Basics tab for the App Service Environment V3 option." lightbox="media/set-up-sql-database-storage-standard/create-logic-app-service-environment.png":::

   - For the **Hybrid** hosting option, provide the following information:

     | Property | Required | Value | Description |
     |----------|----------|-------|-------------|
     | **Region** | Yes | <*container-app-connected-environment-region*> | The Azure region for the container app connected environment where to deploy your resource group and resources. |
     | **Configure storage settings** | No | Not applicable | Continue to the storage settings. |

     The following example shows the **Create Logic App** page and the **Basics** tab for a Standard logic app resource with the **Hybrid** hosting option:

     :::image type="content" source="media/set-up-sql-database-storage-standard/create-logic-app-hybrid.png" alt-text="Screenshot shows Azure portal and Create Logic App page with Basics tab for the Hybrid option." lightbox="media/set-up-sql-database-storage-standard/create-logic-app-hybrid.png":::

1. When you're ready, select **Next: Storage**. On the **Storage** tab, provide the following information about the storage solution, based on your selected hosting option.

   - For the **Workflow Service Plan** and **App Service Environment V3** hosting options, provide the following information:

     | Property | Required | Value | Description |
     |----------|----------|-------|-------------|
     | **Storage type** | Yes | **SQL and Azure Storage** | The storage for workflow artifacts and data. <br><br>- If you selected a custom location as your region, select **SQL**. <br><br>- If you selected an Azure region or ASEv3 location, select **SQL and Azure Storage**. <br><br>**Note**: If you're deploying to an Azure region, you still need an Azure Storage account. This requirement completes the one-time hosting of the logic app configuration on the Azure Logic Apps platform. The workflow's definition, state, run history, and other runtime artifacts are stored in your SQL database. <br><br>For deployments to a custom location hosted on an Azure Arc cluster, you only need a SQL database for storage. |
     | **Storage account** | Yes | <*Azure-storage-account-name*> | The [Azure Storage account](../storage/common/storage-account-overview.md) for storage transactions. <br><br>This resource name must be unique across regions and have 3-24 characters with only numbers and lowercase letters. Either select an existing account or create a new account. <br><br>This example creates a storage account named `fabrikamstorageacct`. |
     | **SQL connection string** | Yes | <*sql-connection-string*> | Your SQL connection string, which currently supports only SQL authentication, not OAuth or managed identity authentication. <br><br>**Note**: Make sure that you enter a correct connection string because Azure portal doesn't validate this string for you. |

     The following example shows the **Create Logic App** page with the **Storage** tab for the **Workflow Service Plan** and **App Service Environment V3** options:

     :::image type="content" source="media/set-up-sql-database-storage-standard/sql-storage-details.png" alt-text="Screenshot shows the Storage tab for the Workflow Service Plan and App Service Environment V3." lightbox="media/set-up-sql-database-storage-standard/sql-storage-details.png":::

   - For the **Hybrid** hosting option, provide the following information:

     | Property | Required | Value | Description |
     |----------|----------|-------|-------------|
     | **SQL connection string** | Yes | <*sql-connection-string*> | Your SQL connection string, which currently supports only SQL authentication, not OAuth or managed identity authentication. <br><br>**Note**: Make sure that you enter a correct connection string because Azure portal doesn't validate this string for you. |
     | **Host name** | Yes | <*host-name*> | The name for the host where you store your artifacts. Enter a fully qualified domain name or the IP address for your Server Message Block (SMB) server, for example, `mystorage.file.core.windows.net` or `121.0.0.1` respectively. |
     | **File share path** | Yes | <*file-share-path* > | The path for the file share where you store your artifacts. Include the file path and any subfolders. |
     | **User name** | Yes | <*host-user-name*> | Your user name to access the host. Enter either **<*domain*>\\<*username*>** or **<*username*>** if the domain is `localhost`. |
     | **Password** | Yes | <*host-user-password*>| Your password to access the host. |

     The following example shows the **Create Logic App** page with the **Storage** tab for the **Hybrid** option:

     :::image type="content" source="media/set-up-sql-database-storage-standard/sql-storage-details-hybrid.png" alt-text="Screenshot shows the Storage tab for the Hybrid option." lightbox="media/set-up-sql-database-storage-standard/sql-storage-details-hybrid.png":::

1. Finish the remaining creation steps, based on the corresponding path:

   - [Create Standard workflows in single-tenant Azure Logic Apps](create-single-tenant-workflows-azure-portal.md)
   - [Create Standard workflows for hybrid deployment on your own infrastructure](create-standard-workflows-hybrid-deployment.md)

When you're done, your new logic app resource and workflow is live in Azure and uses your SQL database as a storage provider.

<a name="set-up-sql-local-dev"></a>

## Set up SQL for local development in Visual Studio Code

The following steps show how to set up SQL as a storage provider for local development and testing in Visual Studio Code:

1. Set up your development environment to work with single-tenant Azure Logic Apps.

   1. Meet the [prerequisites](create-single-tenant-workflows-visual-studio-code.md#prerequisites) to work in Visual Studio Code with the Azure Logic Apps (Standard) extension.

   1. [Set up Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#set-up) to work with the Azure Logic Apps (Standard) extension.

   1. In Visual Studio Code, [connect to your Azure account](create-single-tenant-workflows-visual-studio-code.md#connect-azure-account) and [create a blank logic app project](create-single-tenant-workflows-visual-studio-code.md#create-project).

1. In Visual Studio Code, open the Explorer pane, if not already open.

1. In the Explorer pane, at your logic app project's root, move your mouse pointer over any blank area under the project's files and folders, open the shortcut menu, and select **Use SQL storage for your logic app project**.

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
  > Local SQL Express doesn't work with logic apps deployed and hosted in Azure.

<a name="deploy-new-logic-app-visual-studio-code"></a>

### Set up SQL for new Standard logic app resource deployment

1. In Visual Studio Code, open the Explorer pane, if not already open.

1. In the Explorer pane, at your logic app project's root, move your mouse pointer over any blank area under the project's files and folders, open the shortcut menu, and select **Deploy to logic app**.

1. If prompted, select the Azure subscription for your logic app deployment.

1. From the list that Visual Studio Code opens, make sure to select the advanced option for **Create new Logic App (Standard) in Azure Advanced**. Otherwise, you're not prompted to set up SQL.

   :::image type="content" source="media/set-up-sql-database-storage-standard/select-create-logic-app-advanced.png" alt-text="Screenshot shows selected deployment option to create new Standard logic app in Azure Advanced." lightbox="media/set-up-sql-database-storage-standard/select-create-logic-app-advanced.png":::

1. When prompted, enter a globally unique name for your new logic app, which is the name for the Standard logic app resource. This example uses `Fabrikam-Workflows-App`.

   :::image type="content" source="media/set-up-sql-database-storage-standard/enter-logic-app-name.png" alt-text="Screenshot shows prompt for a globally unique name for your logic app." lightbox="media/set-up-sql-database-storage-standard/enter-logic-app-name.png":::

1. Select a location for your logic app. You can also start typing to filter the list.

   To deploy to Azure, select the Azure region where you want to deploy. If you created an App Service Environment v3 (ASEv3) resource and want to deploy there, select your ASEv3.

   The following example shows the location list filtered to **West US**.

   :::image type="content" source="media/set-up-sql-database-storage-standard/select-location.png" alt-text="Screenshot shows the prompt to select a deployment location with Azure regions and custom location for Azure Arc deployments.":::

1. Select the hosting plan type for your new logic app.

   1. Based on your target deployment location, select the hosting plan type:
   
      | Location | Select |
      |----------|--------|
      | An Azure region | **Workflow Standard** |
      | App Service Environment v3 | **App Service Plan** and then select your ASEv3 resource. |
      | A connected environment for your own infrastructure | **Hybrid**, and then continue to the step where you select an Azure resource group. |

      :::image type="content" source="media/set-up-sql-database-storage-standard/select-hosting-plan.png" alt-text="Screenshot shows the prompt to select Workflow Standard or App Service Plan.":::
   
   1. Either enter a name for your plan, or select an existing plan.

      This example selects **Create new App Service Plan** as no existing plans are available.

      :::image type="content" source="media/set-up-sql-database-storage-standard/create-app-service-plan.png" alt-text="Screenshot shows the prompt to enter a name for new hosting plan and selected option to Create new App Service plan.":::

1. Enter a name for your hosting plan, and then select a pricing tier for your selected plan.

   For more information, see [Hosting plans and pricing tiers](logic-apps-pricing.md#standard-pricing).

1. When you're prompted for an Azure resource group, for optimal performance, select the same Azure resource group as your project for your deployment.

   > [!NOTE]
   >
   > Although you can create or choose a different resource group, doing so might affect performance. If you create or choose a different resource group, but cancel after the confirmation prompt appears, your deployment is also canceled.

1. If you selected **Hybrid**, select the **Connected Environment** to use.

1. When you're prompted to select a storage account for your logic app, choose one of the following options:

   - If you selected a custom location, select the **SQL** option.

   - If you want to deploy to Azure, select the **SQL and Azure Storage** option.

     > [!NOTE]
     >
     > This option is required only for Azure deployments. In Azure, Azure Storage is required to complete a one-time hosting of the logic app configuration on the Azure Logic Apps platform. The ongoing workflow state, run history, and other runtime artifacts are stored in your SQL database.
     >
     > For deployments to a custom location that's hosted on an Azure Arc cluster, you only need a SQL database for storage.  

1. At the prompt, select **Create new storage account** or an existing storage account, if available.

   :::image type="content" source="media/set-up-sql-database-storage-standard/create-storage.png" alt-text="Screenshot shows the Azure: Logic Apps (Standard) pane and a prompt to create or select a storage account.":::

1. At the SQL storage confirmation prompt, select **Yes**. At the connection string prompt, enter your SQL connection string.

   > [!NOTE]
   >
   > Make sure that you enter a correct connection string because Visual Studio Code doesn't validate this string for you.

   :::image type="content" source="media/set-up-sql-database-storage-standard/enter-sql-connection-string.png" alt-text="Screenshot shows Visual Studio Code and SQL connection string prompt.":::

1. Finish the remaining deployment steps in [Publish to a new Standard logic app resource](create-single-tenant-workflows-visual-studio-code.md#publish-new-logic-app).

When you're done, your new logic app resource and workflow is live in Azure and uses your SQL database as a storage provider.

## Validate deployments

After you deploy your Standard logic app resource to Azure, you can check whether your settings are correct:

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. On the resource navigation menu, under **Settings**, select **Configuration**.

1. On the **Configuration** pane, under **Application settings**, find the **Workflows.Sql.ConnectionString** app setting, and confirm that your SQL connection string appears and is correct.

1. In your SQL environment, confirm that the SQL tables were created with the schema name starting with **'dt'** and **'dq'**.

For example, the following screenshot shows the tables that the single-tenant Azure Logic Apps runtime created for a logic app resource with a single workflow:

:::image type="content" source="media/set-up-sql-database-storage-standard/runtime-created-tables-sql.png" alt-text="Screenshot shows SQL tables created by the single-tenant Azure Logic Apps runtime.":::

The single-tenant Azure Logic Apps runtime also creates user-defined table types. For example, the following screenshot shows user-defined table types that the single-tenant Azure Logic Apps runtime created for a logic app resource with a single workflow:

:::image type="content" source="media/set-up-sql-database-storage-standard/runtime-created-user-defined-tables-sql.png" alt-text="Screenshot shows SQL user-defined table types created by the single-tenant Azure Logic Apps runtime.":::

## Related content

- [What is Azure Logic Apps?](logic-apps-overview.md)
- [Single-tenant versus multitenant in Azure Logic Apps](single-tenant-overview-compare.md)
- [Create Standard workflows in Azure Logic Apps with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)
- [Edit host and app settings for Standard logic apps](edit-app-settings-host-settings.md)
