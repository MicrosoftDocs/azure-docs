<properties
   pageTitle="What is Azure Analysis Services | Microsoft Azure"
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
![BI developer tools](./media/analysis-services-overview/aas-overview-dev-tools.png)

When creating data models for Azure Analysis Services, you use the same tools as for SQL Server Analysis Services. Author and deploy tabular models by using the latest versions of [SQL Server Data Tools (SSDT)](https://msdn.microsoft.com/library/mt204009.aspx) or by using [Azure Powershell](../powershell-install-configure.md) and [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) templates in [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx).

## Connect to any data source

![Data sources](./media/analysis-services-overview/aas-overview-data-sources.png)

Azure Analysis Services supports connecting to data from about any data source on-premises in your organization or in the cloud. Combine data from both on-premises and cloud data sources for a hybrid BI solution.

Because your Azure Analysis Services server is in the cloud, connecting to cloud data sources is seamless. When connecting to on-premises data sources, the [On-premises data gateway](analysis-services-gateway.md) ensures fast, secure connections with your Analysis Services server in the cloud.  

## Explore your data from anywhere
Connect and [get data](analysis-services-connect.md) from your servers from about anywhere. Azure Analysis Services supports connecting from Power BI Desktop, Excel, custom apps, and browser based tools.

![Data visualizations](./media/analysis-services-overview/aas-overview-visualization.png)


## Secure

#### User authentication
User authentication for Azure Analysis services is handled by [Azure Active Directory (AAD)](../active-directory/active-directory-whatis.md). When attempting to login to an Azure Analysis Services database, users  login with an organization account identity with access to the database they are trying to access. These user identities must be members of the default Azure Active Directory for the subscription where the Azure Analysis Services server resides. [Directory integration](https://technet.microsoft.com/library/jj573653.aspx) between AAD and an on-premises Active Directory is a great way to get your on-premises users access to an Azure Analysis Services database, but isn't required for all scenarios.

Users login with the user principal name (UPN) of their account and their password. When synchronized with an on-premises Active Directory, the user’s UPN is often their organizational email address.

Permissions for managing the Azure Analysis Services server resource is handled by assigning users to roles within you Azure subscription. By default, subscription administrators have owner permissions to the server resource in Azure. Additional users can be added by using the Azure management portal or through Azure Resource Manager.

#### Data security
Azure Analysis Services utilizes Azure Blob storage to persist storage and metadata for Analysis Services databases. Data files within Blob are encrypted using Azure Blob Server Side Encryption (SSE). When using Direct Query mode, only metadata is stored; the actual data is accessed from the data source at query time.

#### On-premises data sources
Secure access to data which resides on-premises in your organization can be achieved by installing and configuring an [On-premises data gateway](analysis-services-gateway.md). Gateways provide access to data for both Direct Query and cached storage modes. When an Azure Analysis Services model connects to an on-premises data source, a query is created along with the encrypted credentials for the on-premises data source. The gateway cloud service analyzes the query and pushes the request to an Azure Service Bus. The on-premises gateway polls the Azure Service Bus for pending requests. The gateway then gets the query, decrypts the credentials, and connects to the data source for execution. The results are then sent from the data source, back to the gateway and then on to the Azure Analysis Services database.

Azure Analysis Services is governed by the [Microsoft Online Services Terms](http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31) and the [Microsoft Online Services Privacy Statement](https://www.microsoft.com/EN-US/privacystatement/OnlineServices/Default.aspx).
To learn more about Azure Security, see the [Microsoft Trust Center](https://www.microsoft.com/trustcenter/Security/AzureSecurity).




## Get help
Azure Analysis Services is simple to set up and to manage. You can find all of the info you need to create and manage a server here. When creating a data model to deploy to your server, it's much the same as it is for creating a data model you deploy to an on-premises server. There's an extensive library of conceptual, procedural, tutorials, and reference articles for [Analysis Services on MSDN](https://msdn.microsoft.com/library/bb522607.aspx).

Things are changing rapidly. You can always get the latest information on the [Analysis Services blog](https://blogs.msdn.microsoft.com/analysisservices/). And, be sure to join the community on the Azure Analysis Services forum.

We want your feedback. If you have questions or suggestions about the documentation, be sure to add Disqus comments at the bottom of an article.
If you have suggestions or feature requests, be sure to check out feedback on UserVoice.

## Next steps
Now that you know more about Azure Analysis Services, it's time to get started. Learn how to [create](analysis-services-create-server.md) an Analysis Services server in Azure and [deploy a tabular model](analysis-services-deploy.md).
