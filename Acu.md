---
title: What is Azure Analysis Services?
description: Learn about Azure Analysis Services, a fully managed platform as a service (PaaS) that provides enterprise-grade data models in the cloud.
author: minewiskan
ms.service: azure-analysis-services
ms.topic: overview
ms.date: 02/15/2022
ms.author: owend
ms.reviewer: minewiskan
recommendations: false
#Customer intent: As a BI developer, I want to determine if Azure Analysis Services is the best data modeling platform for our organization.
ms.custom: references_regions
---
# What is Azure Analysis Services?

![Azure Analysis Services](./media/analysis-services-overview/aas-overview-aas-icon.png)

Azure Analysis Services is a fully managed platform as a service (PaaS) that provides enterprise-grade data models in the cloud. Use advanced mashup and modeling features to combine data from multiple data sources, define metrics, and secure your data in a single, trusted tabular semantic data model. The data model provides an easier and faster way for users to perform ad hoc data analysis using tools like Power BI and Excel.

![Data sources](./media/analysis-services-overview/aas-overview-overall.png)

**Video:** Check out [Azure Analysis Services Overview](https://www.youtube.com/watch?v=m1jnG1zIvTo&t=31s) to learn how Azure Analysis Services fits in with Microsoft's overall BI capabilities.

## Get up and running quickly

In Azure portal, you can [create a server](analysis-services-create-server.md) within minutes. And with Azure Resource Manager [templates](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md) and PowerShell, you can create servers using a declarative template. With a single template, you can deploy server resources along with other Azure components such as storage accounts and Azure Functions. 

Azure Analysis Services integrates with many Azure services enabling you to build sophisticated analytics solutions. Integration with [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) provides secure, role-based access to your critical data. Integrate with [Azure Data Factory](../data-factory/introduction.md) pipelines by including an activity that loads data into the model. [Azure Automation](../automation/automation-intro.md) and [Azure Functions](../azure-functions/functions-overview.md) can be used for lightweight orchestration of models using custom code. 

## The right tier when you need it

Azure Analysis Services is available in **Developer**, **Basic**, and **Standard** tiers. Within each tier, plan costs vary according to processing power, Query Processing Units (QPUs), and memory size. When you create a server, you select a plan within a tier. You can change plans up or down within the same tier, or upgrade to a higher tier, but you can't downgrade from a higher tier to a lower tier.

### Developer tier

This tier is recommended for evaluation, development, and test scenarios. A single plan includes the same functionality of the standard tier, but is limited in processing power, QPUs, and memory size. Query replica scale-out *is not available* for this tier. This tier does not offer an SLA.

|Plan  |QPUs  |Memory (GB)  |
|---------|---------|---------|
|D1    |    20     |    3     |


### Basic tier

This tier is recommended for production solutions with smaller tabular models, limited user concurrency, and simple data refresh requirements. Query replica scale-out *is not available* for this tier. Perspectives, multiple partitions, and DirectQuery tabular model features *are not supported* in this tier.  

|Plan  |QPUs  |Memory (GB)  |
|---------|---------|---------|
|B1    |    40     |    10     |
|B2    |    80     |    16     |

### Standard tier

This tier is for mission-critical production applications that require elastic user-concurrency, and have rapidly growing data models. It supports advanced data refresh for near real-time data model updates, and supports all tabular modeling features.

|Plan  |QPUs  |Memory (GB)  |
|---------|---------|---------|
|S0    |    40     |    10     |
|S1    |    100     |    25     |
|S2    |    200     |    50     |
|S4    |    400     |    100     |
|S8 <sup>[1](#naar)</sup>, <sup>[2](#rec)</sup>   |    320    |    200     |
|S9 <sup>[1](#naar)</sup>, <sup>[2](#rec)</sup>    |    640    |    400     |
|S8v2 <sup>[1](#naar)</sup>   |    640     |    200     |
|S9v2 <sup>[1](#naar)</sup>    |    1280    |    400     |

<a name="naar">1</a> - Not available in all regions.   
<a name="rec">2</a> - S8 and S9 are [deprecated](https://azure.microsoft.com/updates/azure-s8-and-s9-analysis-services-skus-retiring-on-31-august-2023/). v2 is recommended. 

## Availability by region

Azure Analysis Services is supported in regions throughout the world. Supported plans and query replica availability depend on the region you choose. Plan and query replica availability can change depending on need and available resources for each region. 

### Americas

|Region  | Supported plans | Query replicas (Standard plans only) |
|---------|---------|:---------:|
|Brazil South     |    B1, B2, S0, S1, S2, S4, D1     |     1    |
|Canada Central    |     B1, B2, S0, S1, S2, S4, D1    |     1    |
|Canada Central     |     S8v2, S9v2   |    1    |
|East US     |     B1, B2, S0, S1, S2, S4, D1    |    1     |
|East US     |     S8v2, S9v2   |    1    |
|East US 2     |     B1, B2, S0, S1, S2, S4, D1   |    7    |
|East US 2     |     S8v2, S9v2   |    1    |
|North Central US     |     B1, B2, S0, S1, S2, S4, D1     |    1     |
|North Central US     |     S8v2, S9v2    |    1     |
|Central US     |    B1, B2, S0, S1, S2, S4, D1     |    1     |
|Central US     |    S8v2, S9v2     |    1     |
|South Central US     |    B1, B2, S0, S1, S2, S4, D1     |    1     |
|South Central US     |    S8v2, S9v2     |    1     |
|West Central US   |     B1, B2, S0, S1, S2, S4, D1    |    3     |
|West US     |    B1, B2, S0, S1, S2, S4, D1    |    7   |
|West US     |    S8v2, S9v2   |    2  |
|West US2    |    B1, B2, S0, S1, S2, S4, D1    |    3   |
|West US2    |    S8v2, S9v2  |    1     |

### Europe

|Region  | Supported plans | Query replicas (Standard plans only) |
|---------|---------|:---------:|
|North Europe     |    B1, B2, S0, S1, S2, S4, D1      |    7     |
|North Europe     |    S8v2, S9v2      |    3     |
|UK South     |    B1, B2, S0, S1, S2, S4, D1      |     1    |
|West Europe     |    B1, B2, S0, S1, S2, S4, D1   |    7    |
|West Europe    |   S8v2, S9v2  |  1  |

### Asia Pacific 

|Region  | Supported plans | Query replicas (Standard plans only) |
|---------|---------|:---------:|
|Australia East     |    B1, B2, S0, S1, S2, S4     |    3     |
|Australia East     |    S8v2, S9v2    |    1     |
|Australia Southeast     | B1, B2, S0, S1, S2, S4, D1       |    1     |
|Japan East     |   B1, B2, S0, S1, S2, S4, D1       |    1     |
|Japan East     |    S8v2, S9v2    |    1     |
|Southeast Asia     |     B1, B2, S0, S1, S2, S4, D1     |   1      |
|Southeast Asia     |     S8v2, S9v2     |   1      |
|West India     |    B1, B2, S0, S1, S2, S4, D1     |    1     |

## Scale to your needs

### Scale up\down, pause, and resume

Go up, down, or pause your server. Use the Azure portal or have total control on-the-fly by using PowerShell. You only pay for what you use.  

### Scale out resources for fast query response

With scale-out, client queries are distributed among multiple *query replicas* in a query pool. Query replicas have synchronized copies of your tabular models. By spreading the query workload, response times during high query workloads can be reduced. Model processing operations can be separated from the query pool, ensuring client queries are not adversely affected by processing operations. 

You can create a query pool with up to seven additional query replicas (eight total, including your server). The number of query replicas you can have in your pool depend on your chosen plan and region. Query replicas cannot be spread outside your server's region. Query replicas are billed at the same rate as your server.

Just like with changing tiers, you can scale out query replicas according to your needs. Configure scale-out in the portal or by using REST APIs. To learn more, see [Azure Analysis Services scale-out](analysis-services-scale-out.md).

## Pricing

Total cost depends on a number of factors. For example, your chosen region, tier, query replicas, and pause/resume. Use the [Azure Analysis Services Pricing](https://azure.microsoft.com/pricing/details/analysis-services/) calculator to determine typical pricing for your region. This tool calculates pricing for a single-server instance for a single region. Keep in mind, query replicas are billed at the same rate as the server. 

## Built on SQL Server Analysis Services

Azure Analysis Services is compatible with many great features already in SQL Server Analysis Services Enterprise Edition. Azure Analysis Services supports tabular models at the 1200 and higher [compatibility levels](/analysis-services/tabular-models/compatibility-level-for-tabular-models-in-analysis-services). Tabular models are relational modeling constructs (model, tables, columns), articulated in tabular metadata object definitions in Tabular Model Scripting Language (TMSL) and Tabular Object Model (TOM) code. Partitions, perspectives, row-level security, bi-directional relationships, and translations are all supported\*. Multidimensional models and PowerPivot for SharePoint *are not* supported in Azure Analysis Services.

Tabular models in both in-memory and DirectQuery modes are supported. In-memory mode (default) tabular models support multiple data sources. Because model data is highly compressed and cached in-memory, this mode provides the fastest query response over large amounts of data. It also provides the greatest flexibility for complex datasets and queries. 

Partitioning enables incremental loads, increases parallelization, and reduces memory consumption. Other advanced data modeling features like calculated tables and all DAX functions are supported. In-memory models must be refreshed (processed) to update cached data from data sources. With Azure service principal support, unattended refresh operations using PowerShell, TOM, TMSL, and REST offer flexibility in making sure your model data is always up-to-date. 

DirectQuery mode* leverages the backend relational database for storage and query execution. Extremely large data sets in single SQL Server, SQL Server Data Warehouse, Azure SQL Database, Azure Synapse Analytics, Oracle, and Teradata data sources are supported. Backend data sets can exceed available server resource memory. Complex data model refresh scenarios aren't needed. There are also some restrictions, such as limited data source types, DAX formula limitations, and some advanced data modeling features aren't supported. Before determining the best mode for you, see [Direct Query mode](/analysis-services/tabular-models/directquery-mode-ssas-tabular).

\* Feature availability depends on tier.

## Supported data sources

Tabular models in Azure Analysis Services support a wide variety of data sources from simple text files to Big Data in Azure Data Lake Store. To learn more, see [Data sources supported in Azure Analysis Services](analysis-services-datasource.md).

## Compatibility level

Compatibility level refers to release-specific behaviors in the Analysis Services engine. Azure Analysis Services supports tabular models at the 1200 and higher compatibility levels. To learn more, see [Compatibility level for tabular models](/analysis-services/tabular-models/compatibility-level-for-tabular-models-in-analysis-services).


## Your data is secure

Azure Analysis Services provides security for your sensitive data at multiple levels. As an Azure service, Analysis Services provides the **Basic** level protection of Distributed denial of service (DDoS) attacks automatically enabled as part of the Azure platform. To learn more, see [Azure DDoS Protection overview](../ddos-protection/ddos-protection-overview.md). 

At the server level, Analysis Services provides firewall, Azure authentication, server administrator roles, and Server-Side Encryption. At the data model level, user roles, row-level, and object-level security ensure your data is safe and gets seen by only those users who are meant to see it.

### Firewall

Azure Analysis Services Firewall blocks all client connections other than those IP addresses specified in rules. By default, firewall protection is not enabled for new servers. It's recommended firewall protection is enabled and rules are configured as part of a server provisioning script or in the portal immediately after the server is created. Configure rules specifying allowed IP addresses by individual client IPs or by range. Power BI (service) connections can also be allowed or blocked. Configure firewall and rules in the portal or by using PowerShell. To learn more, see [Configure a server firewall](analysis-services-qs-firewall.md).

### Authentication

User authentication is handled by [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md). When logging in, users use an organization account identity with role-based access to the database. User identities must be members of the default Azure Active Directory for the subscription that the server is in. To learn more, see [Authentication and user permissions](analysis-services-manage-users.md).

### Data security

Azure Analysis Services uses Azure Blob storage to persist storage and metadata for Analysis Services databases. Data files within Blob are encrypted using [Azure Blob Server Side Encryption (SSE)](../storage/common/storage-service-encryption.md). When using Direct Query mode, only metadata is stored. The actual data is accessed through encrypted protocol from the data source at query time.

Secure access to data sources on-premises in your organization is achieved by installing and configuring an [On-premises data gateway](analysis-services-gateway.md). Gateways provide access to data for both DirectQuery and in-memory modes.

### Roles

Analysis Services uses [role-based authorization](/analysis-services/tabular-models/roles-ssas-tabular) that grants access to server and model database operations, objects, and data. All users who access a server or database do so with their Azure AD user account within an assigned role. The server administrator role is at the server resource level. By default, the account used when creating a server is automatically included in the Server Admins role. Additional user and group accounts are added by using the portal, SSMS, or PowerShell.
  
Non-administrative users who query data are granted access through database roles. A database role is created as a separate object in the database, and applies only to the database in which that role is created. Database roles are defined by (database) Administrator, Read, and Read and Process permissions. User and group accounts are added by using SSMS or PowerShell.

### Row-level security

Tabular models at all compatibility levels support row-level security. Row-level security is configured in the model by using DAX expressions that define the rows in a table, and any rows in the many direction of a related table that a user can query. Row filters using DAX expressions are defined for the Read and Read and Process permissions. 

### Object-level security 

Tabular models at the 1400 and higher compatibility level support object-level security, which includes table-level security and column-level security. Object level security is set in the JSON-based metadata by using TMSL, or TOM. To learn more, see [Object-level security](/analysis-services/tabular-models/object-level-security).

### Automation through service principals

Service principals are an Azure Active Directory application resource you create within your tenant to perform unattended resource and service-level operations. Service principals are used with Azure Automation, PowerShell unattended mode, custom client applications, and web apps to automate common tasks like data refresh, scale up/down, and pause/resume. Permissions are assigned to service principals through role membership. To learn more, see [Automation with service principals](analysis-services-service-principal.md).

### Azure governance

Azure Analysis Services is governed by the [Microsoft Online Services Terms](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31) and the [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement).
To learn more about Azure Security, see the [Microsoft Trust Center](https://www.microsoft.com/trustcenter).

## Use the tools you already know

![BI developer tools](./media/analysis-services-overview/aas-overview-dev-tools.png)

### Visual Studio

Develop and deploy models with Visual Studio with Analysis Services projects. The Analysis Services projects extension includes templates and wizards that get you up and going quickly. The model authoring environment in Visual Studio now includes the modern Get Data data source query and mashup functionality for tabular 1400 and higher models. If you're familiar with Get Data in Power BI Desktop and Excel 2016, you already know how easy it is to create highly customized data source queries. 

Microsoft Analysis Services Projects is available as a free installable VSIX package. [Download from Marketplace](https://marketplace.visualstudio.com/items?itemName=ProBITools.MicrosoftAnalysisServicesModelingProjects). The extension works with any version of Visual Studio 2017 and later, including the free Community edition.

### SQL Server Management Studio

Manage your servers and model databases by using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms). Connect to your servers in the cloud. Run TMSL scripts right from the XMLA query window, and automate tasks by using TMSL scripts and PowerShell. New features and functionality happen fast - SSMS is updated monthly.

### Open-source tools

Analysis Services has a vibrant community of developers who create tools. Be sure to check out [Tabular Editor](https://tabulareditor.github.io/), an open-source tool for creating, maintaining, and managing tabular models using an intuitive, lightweight editor. [DAX Studio](https://daxstudio.org/), is a great open-source tool for DAX authoring, diagnosis, performance tuning, and analysis.

### PowerShell

Server resource management tasks like creating server resources, suspending or resuming server operations, or changing the service level (tier) use Azure PowerShell cmdlets. Other tasks for managing databases such as adding or removing role members, processing, or running TMSL scripts use cmdlets in the SqlServer module. To learn more, see [Manage Azure Analysis Services with PowerShell](analysis-services-powershell.md).

### Object model and scripting

Tabular models offer rapid development and are highly customizable. 
Tabular models include the [Tabular Object Model](/analysis-services/tom/introduction-to-the-tabular-object-model-tom-in-analysis-services-amo) (TOM) to describe model objects. TOM is exposed in JSON through the [Tabular Model Scripting Language (TMSL)](/analysis-services/tmsl/tabular-model-scripting-language-tmsl-reference) and the AMO data definition language through the [Microsoft.AnalysisServices.Tabular](/dotnet/api/microsoft.analysisservices.tabular) namespace. 

## Supports the latest client tools

![Data visualizations](./media/analysis-services-overview/aas-overview-clients.png)

Modern data exploration and visualization tools like Power BI, Excel, Reporting Services, and third-party tools are all supported, providing users with highly interactive and visually rich insights into your model data. 

## Monitoring and diagnostics

Azure Analysis Services is integrated with Azure Monitor metrics, providing an extensive number of resource-specific metrics to help you monitor the performance and health of your servers. To learn more, see [Monitor server metrics](analysis-services-monitor.md). Record metrics with [resource platform logs](../azure-monitor/essentials/platform-logs-overview.md). Monitor and send logs to [Azure Storage](https://azure.microsoft.com/services/storage/), stream them to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/), and export them to [Azure Monitor logs](https://azure.microsoft.com/services/log-analytics/), a service of [Azure](https://www.microsoft.com/cloud-platform/operations-management-suite). To learn more, see [Setup diagnostic logging](analysis-services-logging.md).

Azure Analysis Services also supports using [Dynamic Management Views (DMVs)](/analysis-services/instances/use-dynamic-management-views-dmvs-to-monitor-analysis-services). Based on SQL syntax, DMVs interface schema rowsets that return metadata and monitoring information about server instance.

## Documentation

Documentation specific to Azure Analysis Services is included here. Use the table of contents on the left side of your browser screen to find articles. 

Because tabular models in Azure Analysis Services are much the same as tabular models in SQL Server Analysis Services and Power BI Premium datasets, there's an extensive library of shared data modeling tutorials, conceptual, procedural, developer, and reference articles in [Analysis Services documentation](/analysis-services/?view=azure-analysis-services-current&preserve-view=true). Articles in the shared Analysis Services documentation show if they also apply to Azure Analysis Services by an APPLIES TO banner beneath the title. You can also use the Version selector above the table of contents to see only those articles that apply to the platform you're using.

![Shared documentation](./media/analysis-services-overview/aas-overview-applies-to.png)

### Contribute!

Analysis Services documentation, like this article, is open source. To learn more about how you can contribute, see our [contributor guide](/contribute/). 

Azure Analysis Services documentation also uses [GitHub Issues](/teamblog/a-new-feedback-system-is-coming-to-docs). You can provide feedback about the product or documentation. Use **Feedback** at the bottom of an article. GitHub Issues are not enabled for the shared Analysis Services documentation. 

## Blogs

Things are changing rapidly. Get the latest information on the [Power BI blog](https://powerbi.microsoft.com/blog/category/analysis-services/) and [Azure blog](https://azure.microsoft.com/blog/).

## Q&A

Microsoft [Q&A](/answers/products/) is a technical community platform that provides a rich online experience in answering your technical questions. Join the conversation on [Q&A - Azure Analysis Services forum](/answers/topics/azure-analysis-services.html).

## Next steps

> [!div class="nextstepaction"]
> [Sign up for a Free Azure Trial](https://azure.microsoft.com/offers/ms-azr-0044p/)   

> [!div class="nextstepaction"]
> [Quickstart: Create a server - Portal](analysis-services-create-server.md)   

> [!div class="nextstepaction"]
> [Quickstart: Create a server - PowerShell](analysis-services-create-powershell.md)

# azure-docs
Open source documentation of Microsoft Azure
https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/app-service/quickstart-nodejs.md#L1-L469
take: QI.CEO.AKEPORN SIWILAI.API'

--- 
title: 'Quickstart: Create a Node.js web app' 
 description: Deploy your first Node.js Hello World to Azure App Service in minutes. 
 ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a 
 author: msangapu-msft 
 ms.author: msangapu 
 ms.topic: quickstart 
 ms.custom: mvc, devcenter, seodec18, devdivchpfy22, ignite-2022 
 ms.date: 03/22/2022 
 ms.devlang: javascript 
 #zone_pivot_groups: app-service-ide-oss 
 zone_pivot_groups: app-service-vscode-cli-portal 
 --- 
 # Create a Node.js web app in Azure 
  
 In this quickstart, you'll learn how to create and deploy your first Node.js ([Express](https://www.expressjs.com)) web app to [Azure App Service](overview.md). App Service supports various versions of Node.js on both Linux and Windows.  
  
 This quickstart configures an App Service app in the **Free** tier and incurs no cost for your Azure subscription. 
  
 ## Set up your initial environment 
  
 :::zone target="docs" pivot="development-environment-vscode" 
  
 - Have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-app-service-extension&mktingSource=vscode-tutorial-app-service-extension). 
 - Install [Node.js and npm](https://nodejs.org). Run the command `node --version` to verify that Node.js is installed. 
 - Install [Visual Studio Code](https://code.visualstudio.com/). 
 - The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for Visual Studio Code. 
  <!-- - <a href="https://git-scm.com/" target="_blank">Install Git</a> --> 
  
 ::: zone-end 
  
 :::zone target="docs" pivot="development-environment-cli" 
  
 - Have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-app-service-extension&mktingSource=vscode-tutorial-app-service-extension). 
 - Install [Node.js LTS and npm](https://nodejs.org). Run the command `node --version` to verify that Node.js is installed. 
 - Install <a href="/cli/azure/install-azure-cli" target="_blank">Azure CLI</a>, with which you run commands in any shell to provision and configure Azure resources. 
  
 ::: zone-end 
  
  
 :::zone target="docs" pivot="development-environment-azure-portal" 
  
 - Have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-app-service-extension&mktingSource=vscode-tutorial-app-service-extension). 
 - Install [Node.js LTS and npm](https://nodejs.org). Run the command `node --version` to verify that Node.js is installed. 
 - Have a FTP client (for example, [FileZilla](https://filezilla-project.org)), to connect to your app. 
  
 ::: zone-end 
 ## Create your Node.js application 
  
 In this step, you create a basic Node.js application and ensure it runs on your computer. 
  
 > [!TIP] 
 > If you have already completed the [Node.js tutorial](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial), you can skip ahead to [Deploy to Azure](#deploy-to-azure). 
  
 1. Create a Node.js application using the [Express Generator](https://expressjs.com/starter/generator.html), which is installed by default with Node.js and NPM. 
  
     ```bash 
     npx express-generator myExpressApp --view ejs 
     ``` 
  
 1. Change to the application's directory and install the NPM packages. 
  
     ```bash 
     cd myExpressApp && npm install 
     ``` 
  
 1. Start the development server with debug information. 
  
     ```bash 
     DEBUG=myexpressapp:* npm start 
     ``` 
  
 1. In a browser, navigate to `http://localhost:3000`. You should see something like this: 
  
     ![Running Express Application](./media/quickstart-nodejs/express.png) 
  
 :::zone target="docs" pivot="development-environment-vscode" 
 > [!div class="nextstepaction"] 
 > [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=create-app) 
 ::: zone-end 
  
 ## Deploy to Azure 
  
 Before you continue, ensure that you have all the prerequisites installed and configured. 
  
 > [!NOTE] 
 > For your Node.js application to run in Azure, it needs to listen on the port provided by the `PORT` environment variable. In your generated Express app, this environment variable is already used in the startup script *bin/www* (search for `process.env.PORT`). 
 > 
  
 :::zone target="docs" pivot="development-environment-vscode" 
  
 #### Sign in to Azure 
  
 1. In the terminal, ensure you're in the *myExpressApp* directory, then start Visual Studio Code with the following command: 
  
     ```bash 
     code . 
     ``` 
  
 1. In Visual Studio Code, in the [Activity Bar](https://code.visualstudio.com/docs/getstarted/userinterface), select the **Azure** logo. 
  
 1. In the **App Service** explorer, select **Sign in to Azure...** and follow the instructions. 
  
     In Visual Studio Code, you should see your Azure email address in the Status Bar and your subscription in the **AZURE APP SERVICE** explorer. 
  
     ![sign in to Azure](./media/quickstart-nodejs/sign-in.png) 
  
 > [!div class="nextstepaction"] 
 > [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=getting-started) 
  
 #### Configure the App Service app and deploy code 
  
 1. Select the *myExpressApp* folder. 
  
 # [Deploy to Linux](#tab/linux) 
  
 2. Right-click on App Services and select **Create new Web App**. A Linux container is used by default.  
 1. Type a globally unique name for your web app and press **Enter**. The name must be unique across all of Azure and use only alphanumeric characters ('A-Z', 'a-z', and '0-9') and hyphens ('-'). 
 1. In Select a runtime stack, select the Node.js version you want. An **LTS** version is recommended. 
 1. In Select a pricing tier, select **Free (F1)** and wait for the resources to be provisioned in Azure. 
 1. In the popup **Always deploy the workspace "myExpressApp" to \<app-name>"**, select **Yes**. This way, as long as you're in the same workspace, Visual Studio Code deploys to the same App Service app each time. 
  
     While Visual Studio Code provisions the Azure resources and deploys the code, it shows [progress notifications](https://code.visualstudio.com/api/references/extension-guidelines#notifications). 
  
 1. Once deployment completes, select **Browse Website** in the notification popup. The browser should display the Express default page. 
  
 # [Deploy to Windows](#tab/windows) 
  
 2. Right-click on App Services and select **Create new Web App... Advanced**. 
 1. Type a globally unique name for your web app and press **Enter**. The name must be unique across all of Azure and use only alphanumeric characters ('A-Z', 'a-z', and '0-9') and hyphens ('-'). 
 1. Select **Create a new resource group**, then enter a name for the resource group, such as *AppServiceQS-rg*. 
 1. Select the Node.js version you want. An **LTS** version is recommended. 
 1. Select **Windows** for the operating system. 
 1. Select the location you want to serve your app from. For example, *West Europe*. 
 1. Select **Create new App Service plan**, then enter a name for the plan (such as *AppServiceQS-plan*), then select **F1 Free** for the pricing tier. 
 1. For **Select an Application Insights resource for your app**, select **Skip for now** and wait the resources to be provisioned in Azure. 
 1. In the popup **Always deploy the workspace "myExpressApp" to \<app-name>"**, select **Yes**. This way, as long as you're in the same workspace, Visual Studio Code deploys to the same App Service app each time. 
  
     While Visual Studio Code provisions the Azure resources and deploys the code, it shows [progress notifications](https://code.visualstudio.com/api/references/extension-guidelines#notifications). 
  
     > [!NOTE] 
     > When deployment completes, your Azure app doesn't run yet because your project root doesn't have a *web.config*. Follow the remaining steps to generate it automatically. For more information, see [You do not have permission to view this directory or page](configure-language-nodejs.md#you-do-not-have-permission-to-view-this-directory-or-page). 
  
 1. In the **App Service** explorer in Visual Studio code, expand the node for the new app, right-click **Application Settings**, and select **Add New Setting**: 
  
     ![Add app setting command](media/quickstart-nodejs/add-setting.png) 
  
 1. Enter `SCM_DO_BUILD_DURING_DEPLOYMENT` for the setting key. 
 1. Enter `true` for the setting value. 
  
     This app setting enables build automation at deploy time, which automatically detects the start script and generates the *web.config* with it. 
  
 1. In the **App Service** explorer, select the **Deploy to Web App** icon again, confirm by clicking **Deploy** again. 
 1. Wait for deployment to complete, then select **Browse Website** in the notification popup. The browser should display the Express default page. 
  
 ----- 
  
 > [!div class="nextstepaction"] 
 > [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=deploy-app) 
  
 ::: zone-end 
  
 :::zone target="docs" pivot="development-environment-cli" 
  
 In the terminal, ensure you're in the *myExpressApp* directory, and deploy the code in your local folder (*myExpressApp*) using the [az webapp up](/cli/azure/webapp#az-webapp-up) command: 
  
 # [Deploy to Linux](#tab/linux) 
  
 ```azurecli 
 az webapp up --sku F1 --name <app-name> 
 ``` 
  
 # [Deploy to Windows](#tab/windows) 
  
 ```azurecli 
 az webapp up --sku F1 --name <app-name> --os-type Windows 
 ``` 
  
 ----- 
  
 - If the `az` command isn't recognized, ensure you have the Azure CLI installed as described in [Set up your initial environment](#set-up-your-initial-environment). 
 - Replace `<app_name>` with a name that's unique across all of Azure (*valid characters are `a-z`, `0-9`, and `-`*). A good pattern is to use a combination of your company name and an app identifier. 
 - The `--sku F1` argument creates the web app on the Free pricing tier, which incurs a no cost. 
 - You can optionally include the argument `--location <location-name>` where `<location_name>` is an available Azure region. You can retrieve a list of allowable regions for your Azure account by running the [`az account list-locations`](/cli/azure/appservice#az-appservice-list-locations) command. 
 - The command creates a Linux app for Node.js by default. To create a Windows app instead, use the `--os-type` argument.  
 - If you see the error, "Could not auto-detect the runtime stack of your app," ensure you're running the command in the *myExpressApp* directory (See [Troubleshooting auto-detect issues with az webapp up](https://github.com/Azure/app-service-linux-docs/blob/master/AzWebAppUP/runtime_detection.md)). 
  
 The command may take a few minutes to complete. While running, it provides messages about creating the resource group, the App Service plan, and the app resource, configuring logging, and doing ZIP deployment. It then gives the message, "You can launch the app at http://&lt;app-name&gt;.azurewebsites.net", which is the app's URL on Azure. 
  
 <pre> 
 The webapp '&lt;app-name>' doesn't exist 
 Creating Resource group '&lt;group-name>' ... 
 Resource group creation complete 
 Creating AppServicePlan '&lt;app-service-plan-name>' ... 
 Creating webapp '&lt;app-name>' ... 
 Configuring default logging for the app, if not already enabled 
 Creating zip with contents of dir /home/cephas/myExpressApp ... 
 Getting scm site credentials for zip deployment 
 Starting zip deployment. This operation can take a while to complete ... 
 Deployment endpoint responded with status code 202 
 You can launch the app at http://&lt;app-name>.azurewebsites.net 
 { 
   "URL": "http://&lt;app-name>.azurewebsites.net", 
   "appserviceplan": "&lt;app-service-plan-name>", 
   "location": "centralus", 
   "name": "&lt;app-name>", 
   "os": "&lt;os-type>", 
   "resourcegroup": "&lt;group-name>", 
   "runtime_version": "node|10.14", 
   "runtime_version_detected": "0.0", 
   "sku": "FREE", 
   "src_path": "//home//cephas//myExpressApp" 
 } 
 </pre> 
  
 [!include [az webapp up command note](../../includes/app-service-web-az-webapp-up-note.md)] 
  
 ::: zone-end 
  
 :::zone target="docs" pivot="development-environment-azure-portal" 
 ### Sign in to Azure portal 
  
 Sign in to the Azure portal at https://portal.azure.com. 
  
 ### Create Azure resources 
  
 1. Type **app services** in the search. Under **Services**, select **App Services**. 
  
      :::image type="content" source="./media/quickstart-nodejs/portal-search.png?text=Azure portal search details" alt-text="Screenshot of portal search"::: 
  
 1. In the **App Services** page, select **Create**. 
 1. In the **Basics** tab, under **Project details**, ensure the correct subscription is selected and then select to **Create new** resource group. Type *myResourceGroup* for the name. 
  
     :::image type="content" source="./media/quickstart-nodejs/project-details.png" alt-text="Screenshot of the Project details section showing where you select the Azure subscription and the resource group for the web app"::: 
  
 1. Under **Instance details**, type a globally unique name for your web app and select **Code**. Select *Node 14 LTS* **Runtime stack**, an **Operating System**, and a **Region** you want to serve your app from. 
  
     :::image type="content" source="./media/quickstart-nodejs/instance-details.png" alt-text="Screenshot of the Instance details section where you provide a name for the virtual machine and select its region, image and size"::: 
  
 1. Under **App Service Plan**, select **Create new** App Service Plan. Type *myAppServicePlan* for the name. To change to the Free tier, select **Change size**, select **Dev/Test** tab, select **F1**, and select the **Apply** button at the bottom of the page. 
  
     :::image type="content" source="./media/quickstart-nodejs/app-service-plan-details.png" alt-text="Screenshot of the Administrator account section where you provide the administrator username and password"::: 
  
 1. Select the **Review + create** button at the bottom of the page. 
  
     :::image type="content" source="./media/quickstart-nodejs/review-create.png" alt-text="Screenshot showing the Review and create button at the bottom of the page"::: 
  
 1. After validation runs, select the **Create** button at the bottom of the page. 
  
 1. After deployment is complete, select **Go to resource**. 
  
     :::image type="content" source="./media/quickstart-nodejs/next-steps.png" alt-text="Screenshot showing the next step of going to the resource"::: 
  
 ### Get FTP credentials 
  
 Azure App Service supports [**two types of credentials**](deploy-configure-credentials.md) for FTP/S deployment. These credentials aren't the same as your Azure subscription credentials. In this section, you get the *application-scope credentials* to use with FileZilla. 
  
 1. From the App Service app page, select **Deployment Center** in the left-hand menu and select **FTPS credentials** tab. 
  
     :::image type="content" source="./media/quickstart-nodejs/ftps-deployment-credentials.png" alt-text="FTPS deployment credentials"::: 
  
 1. Open **FileZilla** and create a new site. 
  
 1. From the **FTPS credentials** tab, copy **FTPS endpoint**, **Username**, and **Password** into FileZilla. 
  
     :::image type="content" source="./media/quickstart-nodejs/filezilla-ftps-connection.png" alt-text="FTPS connection details"::: 
  
 1. Select **Connect** in FileZilla. 
   
 ### Deploy files with FTP 
  
 1. Copy all files and directories files to the [**/site/wwwroot** directory](https://github.com/projectkudu/kudu/wiki/File-structure-on-azure) in Azure. 
      
     :::image type="content" source="./media/quickstart-nodejs/filezilla-deploy-files.png" alt-text="FileZilla deploy files"::: 
  
 1. Browse to your app's URL to verify the app is running properly. 
  
 ::: zone-end 
 ## Redeploy updates 
  
 You can deploy changes to this app by making edits in Visual Studio Code, saving your files, and then redeploy to your Azure app. For example: 
  
 1. From the sample project, open *views/index.ejs* and change 
  
     ```html 
     <p>Welcome to <%= title %></p> 
     ``` 
  
     to 
      
     ```html 
     <p>Welcome to Azure</p> 
     ``` 
  
 :::zone target="docs" pivot="development-environment-vscode" 
  
 2. In the **App Service** explorer, select the **Deploy to Web App** icon again, confirm by clicking **Deploy** again. 
  
 1. Wait for deployment to complete, then select **Browse Website** in the notification popup. You should see that the `Welcome to Express` message has been changed to `Welcome to Azure!`. 
  
 ::: zone-end 
  
 :::zone target="docs" pivot="development-environment-cli" 
  
 2. Save your changes, then redeploy the app using the [az webapp up](/cli/azure/webapp#az-webapp-up) command again with no arguments for Linux. Add `--os-type Windows` for Windows: 
  
     ```azurecli 
     az webapp up 
     ``` 
      
     This command uses values that are cached locally in the *.azure/config* file, such as the app name, resource group, and App Service plan. 
      
 1. Once deployment is complete, refresh the webpage `http://<app-name>.azurewebsites.net`. You should see that the `Welcome to Express` message has been changed to `Welcome to Azure!`. 
  
 ::: zone-end 
  
 :::zone target="docs" pivot="development-environment-azure-portal" 
  
 2. Save your changes, then redeploy the app using your FTP client again. 
      
 1. Once deployment is complete, refresh the webpage `http://<app-name>.azurewebsites.net`. You should see that the `Welcome to Express` message has been changed to `Welcome to Azure!`. 
  
 ::: zone-end 
  
 ## Stream Logs 
  
 :::zone target="docs" pivot="development-environment-vscode" 
  
 You can stream log output (calls to `console.log()`) from the Azure app directly in the Visual Studio Code output window. 
  
 1. In the **App Service** explorer, right-click the app node and select **Start Streaming Logs**. 
  
     ![Start Streaming Logs](./media/quickstart-nodejs/view-logs.png) 
  
 1. If asked to restart the app, select **Yes**. Once the app is restarted, the Visual Studio Code output window opens with a connection to the log stream. 
  
 1. After a few seconds, the output window shows a message indicating that you're connected to the log-streaming service. You can generate more output activity by refreshing the page in the browser. 
  
     <pre> 
     Connecting to log stream... 
     2020-03-04T19:29:44  Welcome, you are now connected to log-streaming service. The default timeout is 2 hours. 
     Change the timeout with the App Setting SCM_LOGSTREAM_TIMEOUT (in seconds). 
     </pre> 
  
 > [!div class="nextstepaction"] 
 > [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=tailing-logs) 
  
 ::: zone-end 
  
 :::zone target="docs" pivot="development-environment-cli" 
  
 You can access the console logs generated from inside the app and the container in which it runs. Logs include any output generated by calls to `console.log()`. 
  
 To stream logs, run the [az webapp log tail](/cli/azure/webapp/log#az-webapp-log-tail) command: 
  
 ```azurecli 
 az webapp log tail 
 ``` 
  
 The command uses the resource group name cached in the *.azure/config* file. 
  
 You can also include the `--logs` parameter with then [az webapp up](/cli/azure/webapp#az-webapp-up) command to automatically open the log stream on deployment. 
  
 Refresh the app in the browser to generate console logs, which include messages describing HTTP requests to the app. If no output appears immediately, try again in 30 seconds. 
  
 To stop log streaming at any time, press **Ctrl**+**C** in the terminal. 
  
 ::: zone-end 
  
 :::zone target="docs" pivot="development-environment-azure-portal" 
  
 You can access the console logs generated from inside the app and the container in which it runs. You can stream log output (calls to `console.log()`) from the Node.js app directly in the Azure portal. 
  
 1. In the same **App Service** page for your app, use the left menu to scroll to the *Monitoring* section and select **Log stream**. 
  
     :::image type="content" source="./media/quickstart-nodejs/log-stream.png" alt-text="Screenshot of Log stream in Azure App service."::: 
  
 1. After a few seconds, the output window shows a message indicating that you're connected to the log-streaming service. You can generate more output activity by refreshing the page in the browser. 
  
     <pre> 
     Connecting... 
     2021-10-26T21:04:14  Welcome, you are now connected to log-streaming service. 
     Starting Log Tail -n 10 of existing logs ---- 
     /appsvctmp/volatile/logs/runtime/81b1b83b27ea1c3d598a1cdec28c71c4074ce66c735d0be57f15a8d07cb3178e.log 
     2021-10-26T21:04:08.614384810Z: [INFO] 
     2021-10-26T21:04:08.614393710Z: [INFO]  # Enter the source directory to make sure the script runs where the user expects 
     2021-10-26T21:04:08.614399010Z: [INFO]  cd "/home/site/wwwroot" 
     2021-10-26T21:04:08.614403210Z: [INFO] 
     2021-10-26T21:04:08.614407110Z: [INFO]  export NODE_PATH=/usr/local/lib/node_modules:$NODE_PATH 
     2021-10-26T21:04:08.614411210Z: [INFO]  if [ -z "$PORT" ]; then 
     2021-10-26T21:04:08.614415310Z: [INFO]          export PORT=8080 
     2021-10-26T21:04:08.614419610Z: [INFO]  fi 
     2021-10-26T21:04:08.614423411Z: [INFO] 
     2021-10-26T21:04:08.614427211Z: [INFO]  node /opt/startup/default-static-site.js 
     Ending Log Tail of existing logs --- 
     </pre> 
  
 ::: zone-end 
  
 ## Clean up resources 
  
 :::zone target="docs" pivot="development-environment-vscode" 
  
 In the preceding steps, you created Azure resources in a resource group. The create steps in this quickstart put all the resources in this resource group. To clean up, you just need to remove the resource group. 
  
  
 1. In the Azure extension of Visual Studio, expand the **Resource Groups** explorer. 
  
 1. Expand the subscription, right-click the resource group you created earlier, and select **Delete**. 
  
     :::image type="content" source="media/quickstart-nodejs/clean-up.png" alt-text="Screenshot of the Visual Studio Code navigation to delete a resource that contains App Service resources."::: 
  
 1. When prompted, confirm your deletion by entering the name of the resource group you're deleting. Once you confirm, the resource group is deleted, and you see a [notification](https://code.visualstudio.com/api/references/extension-guidelines#notifications) when it's done. 
  
 > [!div class="nextstepaction"] 
 > [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=clean-up) 
  
 ::: zone-end 
  
 :::zone target="docs" pivot="development-environment-cli" 
  
 In the preceding steps, you created Azure resources in a resource group. The resource group has a name like "appsvc_rg_Linux_CentralUS" depending on your location. 
  
 If you don't expect to need these resources in the future, delete the resource group by running the following command: 
  
 ```azurecli 
 az group delete --no-wait 
 ``` 
  
 The command uses the resource group name cached in the *.azure/config* file. 
  
 The `--no-wait` argument allows the command to return before the operation is complete. 
  
 ::: zone-end 
  
 :::zone target="docs" pivot="development-environment-azure-portal" 
  
 When no longer needed, you can delete the resource group, App service, and all related resources. 
  
 1. From your App Service *overview* page, select the *resource group* you created in the [Create Azure resources](#create-azure-resources) step. 
  
     :::image type="content" source="./media/quickstart-nodejs/resource-group.png" alt-text="Resource group in App Service overview page"::: 
  
 1. From the *resource group* page, select **Delete resource group**. Confirm the name of the resource group to finish deleting the resources. 
  
     :::image type="content" source="./media/quickstart-nodejs/delete-resource-group.png" alt-text="Delete resource group"::: 
  
 ::: zone-end 
  
 ## Next steps 
  
 Congratulations, you've successfully completed this quickstart! 
  
 > [!div class="nextstepaction"] 
 > [Tutorial: Node.js app with MongoDB](tutorial-nodejs-mongodb-app.md) 
  
 > [!div class="nextstepaction"] 
 > [Configure Node.js app](configure-language-nodejs.md) 
  
 Check out the other Azure extensions. 
  
 * [Azure Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) 
 * [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) 
 * [Docker Tools](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) 
 * [Azure CLI Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli) 
 * [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools) 
  
 Or get them all by installing the 
 [Node Pack for Azure](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension pack.
