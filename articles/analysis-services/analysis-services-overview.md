<properties
   pageTitle="What is Azure Analysis Services"
   description="Get the big picture of Analysis Services in Azure."
   services="analysis-services"
   documentationCenter=""
   authors="minewiskan"
   manager="erikre"
   editor=""
   tags=""/>
<tags
   ms.service="analysis-services"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="na"
   ms.date="10/10/2016"
   ms.author="owend"/>

# What is Azure Analysis Services?
![Azure Analysis Services](./media/analysis-services-overview/aas-overview-aas-icon.png)

Built on the proven analytical engine in Microsoft SQL Server Analysis Services, Azure Analysis Services provides enterprise-grade data modeling in the cloud.

> [AZURE.NOTE] Azure Analysis Services is in *preview*. There are some things that just aren't working yet. We're making improvements and adding new features all the time. To get the latest, be sure to keep an eye on our [Analysis Services blog](https://blogs.msdn.microsoft.com/analysisservices/).

## Built on SQL Server Analysis Services
Azure Analysis Services is compatible with the same SQL Server 2016 Analysis Services Enterprise Edition you already know. Azure Analysis Services supports tabular models at the 1200 compatibility level. DirectQuery, partitions, row-level security, bi-directional relationships, and translations are all supported.

## Use the tools you already know
![Data sources](./media/analysis-services-overview/aas-overview-dev-tools.png)

When it comes to creating data models for Azure Analysis Services, you use the same tools as for SQL Server Analysis Services. Author and deploy tabular models by using [SQL Server Data Tools (SSDT)](https://msdn.microsoft.com/library/mt204009.aspx) or by using [Azure Powershell](../powershell-install-configure.md) and [Azure Resource Manager (ARM)](../azure-resource-manager/resource-group-overview.md) templates in [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx).

## Connect to any data source

![Data sources](./media/analysis-services-overview/aas-overview-data-sources.png)

Analysis Services supports [connecting to data](analysis-services-connect.md) from about any data source on-premises in your organization or in the cloud. Combine data from both on-premises and cloud data sources for a hybrid BI solution.

Because your Azure Analysis Services server is in the cloud, connecting to cloud data sources is seamless. When connecting to on-premises data sources, the [On-premises data  gateway](analysis-services-gateway.md) ensures fast, secure connections with your Analysis Services server in the cloud.  

## Explore your data from anywhere
Connect and [get data](analysis-services-connect.md) from your servers from just about anywhere.

![Data visualizations](./media/analysis-services-overview/aas-overview-visualization.png)


## Secure

Azure Analysis Services is governed by the [Microsoft Online Services Terms](http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31) and the [Microsoft Online Services Privacy Statement](https://www.microsoft.com/EN-US/privacystatement/OnlineServices/Default.aspx).

[Azure Active Directory](../active-directory/active-directory-whatis.md) provides single sign-on identity and resource-based access control to your sensitive data. Just like on-premises tabular models, role-based security and row-level security are also supported.
To learn more about Azure Security, see the [Microsoft Trust Center](https://www.microsoft.com/trustcenter/Security/AzureSecurity).


## Get help
Azure Analysis Services is simple to setup and to manage. You'll find all of the info you need to create and manage a server here. When it comes to creating a data model to deploy to your server, it's much the same as it is for creating a data model you  deploy to an on-premises server. There's an extensive library of conceptual, procedural, tutorials, and reference articles for [Analysis Services on MSDN](https://msdn.microsoft.com/library/bb522607.aspx).

Things are changing rapidly. You can always get the latest information on the [Analysis Services blog](https://blogs.msdn.microsoft.com/analysisservices/). And, be sure to join the community on the Azure Analysis Services forum.

We want your feedback. If you have questions or suggestions about the documentation, be sure to add Disqus comments at the bottom of an article.
If you have suggestions or feature requests, be sure to check out feedback on UserVoice.

## Next steps
Now that you know more about Azure Analysis Services, it's time to get started. Learn how to [create](analysis-services-create-server.md) an Analysis Services server in Azure and [deploy a tabular model](analysis-services-deploy.md).
