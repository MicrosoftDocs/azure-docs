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
ms.date: 05/26/2017
ms.author: owend

---
# What is Azure Analysis Services?
![Azure Analysis Services](./media/analysis-services-overview/aas-overview-aas-icon.png)

Azure Analysis Services provides lightning fast


Built on the proven analytics engine in Microsoft SQL Server Analysis Services, Azure Analysis Services provides enterprise-grade data modeling in the cloud. 

Combine data from multiple sources into a single, trusted BI semantic model that’s easy to understand and use. Enable self-service and data discovery for business users by simplifying the view of data and its underlying structure.

![Data sources](./media/analysis-services-overview/aas-overview-data-sources.png)

Check out this video to learn how Azure Analysis Services fits in with Microsoft's overall BI capabilities, and how you can benefit from getting your data models into the cloud.

>[!VIDEO https://channel9.msdn.com/series/Azure-Analysis-Services/Azure-Analysis-Services-overview/player]
>
>


## Provision servers
Use Azure Resource Manager tmplates and PowerShell, you can provision servers using a declarative template. With a single template, you can deploy multiple services along with other components such as storage accounts. You use the same template to repeatedly deploy your application during every stage of the application lifecycle.

To learn more, see [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/resource-group-template-deploy.md).

## Better with Power BI


## Built on SQL Server Analysis Services
Azure Analysis Services is compatible with the same SQL Server Analysis Services Enterprise Edition you already know. Azure Analysis Services supports tabular models at the 1200 or later compatibility levels. DirectQuery, partitions, row-level security, bi-directional relationships, and translations are all supported.

## Use the tools you already know
![BI developer tools](./media/analysis-services-overview/aas-overview-vs.png)

Develop and deploy models with [SQL Server Data Tools (SSDT) for Visual Studio](https://msdn.microsoft.com/library/mt204009.aspx).  


![Management tools](./media/analysis-services-overview/aas-overview-ssms.png)

Manage your servers and model databases by using [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx). And, automate tasks with [Powershell](analysis-services-powershell.md) and [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) templates 

## Supports the latest features
Azure Analysis Services supports tabular models at the 1200 and 1400 Preview compatibility levels. Tabular 1200, first included in SQL Server 2016 Analysis Services, introduced the Tabular Object Model (TOM) to describe model objects. TOM is exposed in JSON through the [Tabular Model Scripting Language (TMSL)](https://docs.microsoft.com/sql/analysis-services/tabular-model-scripting-language-tmsl-reference) and the AMO data definition language through the [Microsoft.AnalysisServices.Tabular](https://msdn.microsoft.com/library/microsoft.analysisservices.tabular.aspx) namespace. 

Tabular 1400 introduces support for Detail Rows, Object-level security, ragged hierarchy support, a modern Get Data experience for data connectivity, and many other enhancements. To take advantage of all the latest features, you need to use the latest [SQL Server Data Tools (SSDT)](https://msdn.microsoft.com/library/mt204009.aspx). Because Tabular 1400 is still in preview, things are changing quickly. To get the latest, check out our [blog post](https://azure.microsoft.com/blog/1400-models-in-azure-as/).

## DirectQuery 

## Pricing
Azure Analysis Services is available in Developer, Basic, and Standard tiers. Within each tier, plan costs vary according to processing power, QPUs, and memory size.

When you create a server, you select a plan within a tier. You can change plans up or down within the same tier, or upgrade to a higher tier, but you cannot downgrade from a higher tier to a lower tier.

![Upgrade tier](./media/analysis-services-overview/aas-overview-tier-up.png)

To learn more about the different plans and tiers, and use the pricing calculator to dermine the right plan for you, see [Azure Analysis Services Pricing](https://azure.microsoft.com/pricing/details/analysis-services/).


## Scale resources
Scale up, scale down, or pause your server. Use the Azure portal or have total control on-the-fly by using PowerShell. You only pay for what you use.

When creating new servers, use the [New-​Azure​Rm​Analysis​Services​Server](https://docs.microsoft.com/en-us/powershell/module/azurerm.analysisservices/new-azurermanalysisservicesserver) cmdlet to set your plan. For existing servers, use [Set-​Azure​Rm​Analysis​Services​Server](https://docs.microsoft.com/en-us/powershell/module/azurerm.analysisservices/set-azurermanalysisservicesserver) cmdlet to change your plan.

Don't use your service all the time? No problem. You can pause by using the portal or with the [Suspend-​Azure​Rm​Analysis​Services​Server](https://docs.microsoft.com/en-us/powershell/module/azurerm.analysisservices/suspend-azurermanalysisservicesserver) cmdlet. Start again with the
[Resume-​Azure​Rm​Analysis​Services​Server](https://docs.microsoft.com/en-us/powershell/module/azurerm.analysisservices/resume-azurermanalysisservicesserver) cmdlet. You only pay for when your server is active.

## Regions
Azure Analysis Services servers can be created in the following [Azure regions](https://azure.microsoft.com/regions/):

| Americas | Europe | Asia Pacific |
|----------|--------|--------------|
|  Brazil South<br> Canada Central<br> East US 2<br> North Central US<br> South Central US<br> West Central US<br> West US | North Europe<br> UK South<br> West Europe |   Australia Southwest<br> Japan East<br> Southeast Asia<br> West India  |

New regions are being added all the time, so this list might be incomplete. You choose a location when you create your server in Azure portal or by using Azure Resource Manager templates. To get the best performance, choose a location nearest your largest user base. Assure [high availability](analysis-services-bcdr.md) by deploying your models on redundant servers in multiple regions.

## Fast query response
Reduce time-to-insights on large and complex datasets. Fast response times mean your BI solution can meet the needs of your business users and keep pace with your business. Connect to real-time operational data using DirectQuery and closely watch the pulse of your business.

## Migrate existing tabular models

## Data sources
Azure Analysis Services support connecting to data sources on-premises in your organization and in the cloud. Combine data from both on-premises and cloud data sources for a hybrid BI solution.

The types of data sources supported differe between tabular 1200 and tabular 1400 models. This is because tabular 1400 models support using the modern Get Data feature in SSDT based on the M formula query language.

Because your server is in the cloud, connecting to cloud data sources is seamless. When connecting to on-premises data sources, the [On-premises data gateway](analysis-services-gateway.md) ensures fast, secure connections with your server in the cloud. To learn more about which on-premises data sources are supported, see [Data sources supported in Azure Analysis Services](analysis-services-datasource.md).

## Explore your data from anywhere
Connect and get data from your servers from about anywhere. Azure Analysis Services supports connecting from Power BI Desktop, Excel, custom apps, and browser-based tools.

![Data visualizations](./media/analysis-services-overview/aas-overview-visualization.png)

## Secure
![Data visualizations](./media/analysis-services-overview/aas-overview-secure.png)

#### Authentication
User authentication for Azure Analysis services is handled by [Azure Active Directory (AAD)](../active-directory/active-directory-whatis.md). When attempting to log in to an Azure Analysis Services database, users use an organization account identity with access to the database they are trying to access. These user identities must be members of the default Azure Active Directory for the subscription where the Azure Analysis Services server resides. To learn more, see [Authentication and user permissions](analysis-services-manage-users.md).

#### Data security
Azure Analysis Services utilizes Azure Blob storage to persist storage and metadata for Analysis Services databases. Data files within Blob are encrypted using Azure Blob Server Side Encryption (SSE). When using Direct Query mode, only metadata is stored. The actual data is accessed from the data source at query time.

#### On-premises data sources
Secure access to data residing on-premises in your organization can be achieved by installing and configuring an [On-premises data gateway](analysis-services-gateway.md). Gateways provide access to data for both Direct Query and in-memory modes. When an Azure Analysis Services model connects to an on-premises data source, a query is created along with the encrypted credentials for the on-premises data source. The gateway cloud service analyzes the query and pushes the request to an Azure Service Bus. The on-premises gateway polls the Azure Service Bus for pending requests. The gateway then gets the query, decrypts the credentials, and connects to the data source for execution. The results are then sent from the data source, back to the gateway and then on to the Azure Analysis Services database.


Azure Analysis Services is governed by the [Microsoft Online Services Terms](http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31) and the [Microsoft Online Services Privacy Statement](https://www.microsoft.com/privacystatement/OnlineServices/Default.aspx).
To learn more about Azure Security, see the [Microsoft Trust Center](https://www.microsoft.com/trustcenter/Security/AzureSecurity).

## Get help

### Documentation
Azure Analysis Services is simple to set up and to manage. You can find all the info you need to create and manage a server here. When creating a data model to deploy to your server, it's much the same as it is for creating a data model you deploy to an on-premises server. There's an extensive library of conceptual, procedural, tutorials, and reference articles at [Analysis Services](https://docs.microsoft.com/sql/analysis-services/analysis-services).

### Videos
Checkout helpful videos at [Azure Analysis Services on Channel 9](https://channel9.msdn.com/series/Azure-Analysis-Services).

### Blogs
Things are changing rapidly. You can always get the latest information on the [Analysis Services team blog](https://blogs.msdn.microsoft.com/analysisservices/) and [Azure blog](https://azure.microsoft.com/blog/).

### Community
Analysis Services has a vibrant community of users. Join the conversation on [Azure Analysis Services forum](https://aka.ms/azureanalysisservicesforum).

## Feedback
Have suggestions or feature requests? Be sure to leave your comments on [Azure Analysis Services Feedback](https://aka.ms/azureanalysisservicesfeedback).

Have suggestions about the documentation? You can add comments using Livefyre at the bottom of each article.

## Next steps
Now that you know more about Azure Analysis Services, it's time to get started. Learn how to [create a server](analysis-services-create-server.md) in Azure and [deploy a tabular model](analysis-services-deploy.md) to it.
