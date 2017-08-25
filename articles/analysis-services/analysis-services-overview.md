---
title: What is Azure Analysis Services | Microsoft Docs
description: Get the big picture of Analysis Services in Azure.
services: analysis-services
documentationcenter: ''
author: minewiskan
manager: erikre
editor: ''
tags: ''

ms.assetid: 83d7a29c-57ae-4aa0-8327-72dd8f00247d
ms.service: analysis-services
ms.devlang: NA
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: na
ms.date: 08/01/2017
ms.author: owend

---
# What is Azure Analysis Services?
![Azure Analysis Services](./media/analysis-services-overview/aas-overview-aas-icon.png)

Azure Analysis Services provides enterprise-grade data modeling in the cloud. It is a fully managed platform as a service (PaaS), integrated with Azure data platform services. 

With Analysis Services, you can mashup and combine data from multiple sources, define metrics, and secure your data in a single, trusted semantic data model. The data model provides an easier and faster way for your users to browse massive amounts of data with client applications like Power BI, Excel, Reporting Services,  third-party, and custom apps.

![Data sources](./media/analysis-services-overview/aas-overview-data-sources.png)

Check out [this video](https://sec.ch9.ms/ch9/d6dd/a1cda46b-ef03-4cea-8f11-68da23c5d6dd/AzureASoverview_high.mp4) to learn how Azure Analysis Services fits in with Microsoft's overall BI capabilities, and how you can benefit from getting your data models into the cloud.

## Built on SQL Server Analysis Services
Azure Analysis Services is compatible with many great features already in SQL Server Analysis Services Enterprise Edition. Azure Analysis Services supports tabular models at the 1200 and 1400  [compatibility levels](analysis-services-compat-level.md). Partitions, row-level security, bi-directional relationships, and translations are all supported. In-memory and DirectQuery modes mean lightning fast queries over massive and complex datasets.

Tabular models offer rapid development and are highly customizable. For developers, tabular models include the Tabular Object Model (TOM) to describe model objects. TOM is exposed in JSON through the [Tabular Model Scripting Language (TMSL)](https://docs.microsoft.com/sql/analysis-services/tabular-model-scripting-language-tmsl-reference) and the AMO data definition language through the [Microsoft.AnalysisServices.Tabular](https://msdn.microsoft.com/library/microsoft.analysisservices.tabular.aspx) namespace.

## Better with Azure
Azure Analysis Services integrates with many Azure services enabling you to build sophisticated analytics solutions. Integration with [Azure Active Directory](../active-directory/active-directory-whatis.md) provides secure, role-based access to your critical data. Integrate with [Azure Data Factory](../data-factory/data-factory-introduction.md) pipelines by including an activity that loads data into the model. [Azure Automation](../automation/automation-intro.md) and [Azure Functions](../azure-functions/functions-overview.md) can be used for lightweight orchestration of models using custom code.

## Get up and running quickly
In Azure portal, you can [create a server](analysis-services-create-server.md) within minutes. And, with Azure Resource Manager [templates](../azure-resource-manager/resource-manager-create-first-template.md) and PowerShell, you can provision servers using a declarative template. With a single template, you can deploy multiple services along with other Azure components such as storage accounts and Azure Functions. 

Once you have a server created, you can create a tabular model right in Azure portal. With the new (preview) [Web designer feature](analysis-services-create-model-portal.md), you can connect to an Azure SQL Database, Azure SQL Data Warehouse data source, or import a Power BI Desktop .pbix file. Relationships between tables are created automatically, and you can create measures or edit the model.bim file in json format right from your browser.

## Scale to your needs
Azure Analysis Services is available in Developer, Basic, and Standard tiers. Within each tier, plan costs vary according to processing power, QPUs, and memory size. When you create a server, you select a plan within a tier. You can change plans up or down within the same tier, or upgrade to a higher tier, but you cannot downgrade from a higher tier to a lower tier.

Scale up, scale down, or pause your server. Use the Azure portal or have total control on-the-fly by using PowerShell. You only pay for what you use. To learn more about the different plans and tiers, and use the pricing calculator to determine the right plan for you, see [Azure Analysis Services Pricing](https://azure.microsoft.com/pricing/details/analysis-services/).

## Keep your data close
Azure Analysis Services servers can be created in the following [Azure regions](https://azure.microsoft.com/regions/):

| Americas | Europe | Asia Pacific |
|----------|--------|--------------|
|  Brazil South<br> Canada Central<br> East US 2<br> North Central US<br> South Central US<br> West Central US<br> West US | North Europe<br> UK South<br> West Europe |   Australia Southeast<br> Japan East<br> Southeast Asia<br> West India  |

New regions are being added all the time, so this list might be incomplete. You choose a location when you create your server in Azure portal or by using Azure Resource Manager templates. To get the best performance, choose a location nearest your largest user base. Assure [high availability](analysis-services-bcdr.md) by deploying your models on redundant servers in multiple regions.

## Migrate your existing tabular models
If you already have existing on-premises SQL Server Analysis Services model solutions, you can migrate to Azure Analysis Services without significant changes. To migrate, you can use SSDT to deploy your model to your server. Or, in SSMS, you can use backup and restore or TMSL.

If you have on-premises data sources, you  need to install and configure an [On-premises data gateway](analysis-services-gateway.md). If you have roles and role members already configured, your roles migrate, but you have to readd role members by using SSMS or PowerShell.

## Connect to popular data sources
Azure Analysis Services supports [connecting to data sources](analysis-services-datasource.md) on-premises in your organization and in the cloud. Combine data from both on-premises and cloud data sources for a hybrid solution. 

New tabular 1400 models use the modern Get Data feature in SSDT, based on the M formula query language. With Get Data, you have more data transformation and mashup features, and the ability to create and edit your own advanced M formula language queries. For example, with tabular 1400 models, you can model on data files in Azure Blob Storage.

## Use the tools you already know

![BI developer tools](./media/analysis-services-overview/aas-overview-dev-tools.png)

#### SQL Server Data Tools (SSDT) for Visual Studio
Develop and deploy models with the free [SQL Server Data Tools (SSDT) for Visual Studio](https://msdn.microsoft.com/library/mt204009.aspx). SSDT includes Analysis Services project templates that get you up and going quickly. SSDT now includes the modern Get Data datasource query and mashup functionality for tabular 1400 models. If you're familiar with Get Data in Power BI Desktop and Excel 2016, you already know how easy it is to create highly customized data source queries.

#### Sql Server Management Studio
Manage your servers and model databases by using [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx). Connect to your servers in the cloud. Run TMSL scripts right from the XMLA query window, and automate tasks by using TMSL scripts. New features and functionality happen fast - SSMS is updated monthly.

#### PowerShell
Server resource management tasks like creating servers, suspending or resuming server operations, or changing the service level (tier) use Azure Resource Manager (AzureRM) cmdlets. Other tasks for managing databases such as adding or removing role members, processing, or running TMSL scripts use cmdlets in the SqlServer module. Both AzureRM and SQLServer modules are available in the [PowerShell gallery](https://www.powershellgallery.com/).


## Your data is secure
![Data visualizations](./media/analysis-services-overview/aas-overview-secure.png)

#### Authentication
User authentication for Azure Analysis services is handled by [Azure Active Directory (AAD)](../active-directory/active-directory-whatis.md). When attempting to log in to an Azure Analysis Services database, users use an organization account identity with access to the database they are trying to access. These user identities must be members of the default Azure Active Directory for the subscription where the Azure Analysis Services server resides. To learn more, see [Authentication and user permissions](analysis-services-manage-users.md).

#### Data security
Azure Analysis Services utilizes Azure Blob storage to persist storage and metadata for Analysis Services databases. Data files within Blob are encrypted using Azure Blob Server Side Encryption (SSE). When using Direct Query mode, only metadata is stored. The actual data is accessed from the data source at query time.

#### On-premises data sources
Secure access to data residing on-premises in your organization is achieved by installing and configuring an [On-premises data gateway](analysis-services-gateway.md). Gateways provide access to data for both Direct Query and in-memory modes. When an Azure Analysis Services model connects to an on-premises data source, a query is created along with the encrypted credentials for the on-premises data source. The gateway cloud service analyzes the query and pushes the request to an Azure Service Bus. The on-premises gateway polls the Azure Service Bus for pending requests. The gateway then gets the query, decrypts the credentials, and connects to the data source for execution. The results are then sent from the data source, back to the gateway and then on to the Azure Analysis Services database.

Azure Analysis Services is governed by the [Microsoft Online Services Terms](http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31) and the [Microsoft Online Services Privacy Statement](https://www.microsoft.com/privacystatement/OnlineServices/Default.aspx).
To learn more about Azure Security, see the [Microsoft Trust Center](https://www.microsoft.com/trustcenter/Security/AzureSecurity).

## Supports the latest client tools
![Data visualizations](./media/analysis-services-overview/aas-overview-clients.png)

Modern data exploration and visualization tools like Power BI, Excel, and  third-party tools provide users with highly interactive and visually rich insights into your model data.

Clients use MSOLAP, AMO, or ADOMD [client libraries](analysis-services-data-providers.md) to connect to Analysis Services servers. Microsoft client applications like Power BI Desktop and Excel install all three client libraries. But keep in mind, depending on the version or frequency of updates, client libraries may not be the latest versions required by Azure Analysis Services. The same applies to custom applications or other interfaces such as AsCmd, TOM, ADOMD.NET. These applications typically require manually installing the libraries as part of a package.


## Get help

#### Documentation
Azure Analysis Services is simple to set up and to manage. You can find all the info you need to create and manage your server services here. When creating a data model to deploy to your server, it's much the same as it is for creating a data model you deploy to an on-premises server. There's an extensive library of conceptual, procedural, tutorials, and reference articles at [Analysis Services](https://docs.microsoft.com/sql/analysis-services/analysis-services).

#### Videos
Check out helpful videos at [Azure Analysis Services on Channel 9](https://channel9.msdn.com/series/Azure-Analysis-Services).

#### Blogs
Things are changing rapidly. You can always get the latest information on the [Analysis Services team blog](https://blogs.msdn.microsoft.com/analysisservices/) and [Azure blog](https://azure.microsoft.com/blog/).

#### Community
Analysis Services has a vibrant community of users. Join the conversation on [Azure Analysis Services forum](https://aka.ms/azureanalysisservicesforum).

## Feedback
Have suggestions or feature requests? Be sure to leave your comments on [Azure Analysis Services Feedback](https://aka.ms/azureanalysisservicesfeedback).

Have suggestions about the documentation? You can add comments using Livefyre at the bottom of each article.

## Next steps
Now that you know more about Azure Analysis Services, it's time to get started. Learn how to [create a server](analysis-services-create-server.md) in Azure. When your server is ready, step through the [Adventure Works tutorial](tutorials/aas-adventure-works-tutorial.md) to learn how to create a fully functional tabular model and deploy it to your server.
