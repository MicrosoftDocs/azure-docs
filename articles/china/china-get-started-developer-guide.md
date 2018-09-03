---
title: Developer guide for Azure China 21Vianet | Microsoft Docs
description: Microsoft provides tools to help developers create and deploy cloud applications to global Azure and to Azure China 21Vianet. Learn which services and features are available on both global Azure and Azure china, and also which features may not be available in China.
services: china
cloud: na
documentationcenter: na
author: v-wimarc
manager: edprice

ms.assetid: na
ms.service: china
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/29/2017
ms.author: v-wimarc

---
# Developer guide for Azure China 21Vianet
Microsoft provides tools to help developers create and deploy cloud applications to the global Microsoft Azure services ("global Azure") and Microsoft Azure operated by 21Vianet (Azure China 21Vianet). Most of the currently available technical content, such as the [Azure Documentation Center](https://azure.microsoft.com/documentation/), assumes that applications are being developed for global Azure, so it’s important to learn which [services and features](https://www.azure.cn/home/features/products-by-region) are available in Microsoft Azure China 21Vianet.

When referring to publicly available content for global Azure services, make sure to adapt the steps or customize any sample code that specifies settings for global Azure services. For example, customize the [Azure service endpoints](#Check-endpoints-in-Azure).

## Migrate existing applications and workloads
Migrating an application or workload hosted elsewhere takes time and planning. To migrate to Microsoft Azure China 21Vianet:
- [Move virtual machines](/azure/china/china-how-to-rehost) from classic Azure Service Manager (ASM) to Azure Resource Manager.
- [Refactor an existing application that is hosted in another cloud provider](/azure/china/china-how-to-refactor) for a better, faster migration. 
- [Rehost an existing application that is hosted in global Azure](/azure/china/china-how-to-rehost).
- [Run a trial migration using the Global Connection Toolkit](https://github.com/Azure/AzureGlobalConnectionToolkit) in your testing environment to help mitigate the migration risks.

## Develop for Azure users
If you’re accustomed to developing cloud services for users in other regions, make sure you consider the following user expectations in China:
- **Mobile first:** Mobile devices, not PCs, are considered the source of the online world. Make sure your design strategy is mobile-centric.
- **QR codes and screen-scanning behavior:** Websites, print ads, business cards, and other media commonly include QR codes. Include QR codes in your website header and footer so visitors can quickly load the site’s mobile version on their phones.
- **Content localization:** Localizing is more than just translating content. Take time to understand the digital environment of your target market and the cultural ramifications of your business decisions, then tailor your content accordingly. 

## Use social sites and media services in China
Commonly used western social media sites and services may be blocked in China. When operating a web presence in China:
- Avoid connecting to Google services on your website’s front end. Google, along with all of its services, is blocked in China. For best results, your site may need to avoid using Google services. For example, replace Google Maps with Baidu Maps, and use self-hosted fonts instead of Google fonts.
- Do not embed videos from YouTube or Vimeo. Both services are blocked in China. Host your video locally or on Chinese video hosting sites, such as Youku, Qiyi, Tudou, or use Azure Media Services. Optimize your site for Baidu, the most-frequently used search engine in China, using a search engine optimization (SEO) audit tool.
- Create a China-specific social network presence. Globally popular social networks, such as Facebook, Twitter, and Instagram, are blocked. Create a social marketing strategy specifically tailored for the social networks in China, such as WeChat and Sina Weibo. Azure doesn’t currently offer local social network integration (that is, a social identity provider).

## Check endpoints in Azure
Microsoft Azure China 21Vianet differs from global Azure, so any Azure service endpoints from global Azure sources, such sample code or published documentation, must be changed. 

The following table shows the endpoints to change. 

See also:
- [Developer Notes for Azure in China Applications](https://msdn.microsoft.com/library/azure/dn578439.aspx)
- [Azure Datacenter IP Ranges in China](https://www.microsoft.com/download/details.aspx?id=42064) 
- [Developers Guide](https://www.azure.cn/documentation/articles/developerdifferences/#dev-guide) (in Chinese).


| Service category                      | Global Azure URI                                                                                                        | Azure URI (in China)                                                                                                                                  |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Azure (in general)                    | \*.windows.net                                                                                                          | \*.chinacloudapi.cn                                                                                                                                   |
| Azure compute                         | \*.cloudapp.net                                                                                                         | \*.chinacloudapp.cn                                                                                                                                   |
| Azure storage                         | \*.blob.core.windows.net \*.queue.core.windows.net \*.table.core.windows.net                                            | \*.blob.core.chinacloudapi.cn \*.queue.core.chinacloudapi.cn \*.table.core.chinacloudapi.cn                                                           |
| Azure service management              | https://management.core.windows.net                                                                                     | [https://management.core.chinacloudapi.cn](https://management.core.chinacloudapi.cn/)                                                                 |
| Azure Resource Manager          | [https://management.azure.com](https://management.azure.com/)                                                           | [https://management.chinacloudapi.cn](https://management.chinacloudapi.cn/)                                                                           |
| Azure management portal               | [https://portal.azure.com](https://portal.azure.com/) | [https://portal.azure.cn](https://portal.azure.cn/)                                   |
| SQL Database                          | \*.database.windows.net                                                                                                 | \*.database.chinacloudapi.cn                                                                                                                          |
| SQL Azure DB management API           | [https://management.database.windows.net](https://management.database.windows.net/)                                     | [https://management.database.chinacloudapi.cn](https://management.database.chinacloudapi.cn/)                                                         |
| Azure Service Bus                     | \*.servicebus.windows.net                                                                                               | \*.servicebus.chinacloudapi.cn                                                                                                                        |
| Azure Access Control Service          | \*.accesscontrol.windows.net                                                                                            | \*.accesscontrol.chinacloudapi.cn                                                                                                                     |
| Azure HDInsight                       | \*.azurehdinsight.net                                                                                                   | \*.azurehdinsight.cn                                                                                                                                  |
| SQL DB import/export service endpoint |                                                                                                                         |  1. China East [https://sh1prod-dacsvc.chinacloudapp.cn/dacwebservice.svc](https://sh1prod-dacsvc.chinacloudapp.cn/dacwebservice.svc) <br>2. China North [https://bj1prod-dacsvc.chinacloudapp.cn/dacwebservice.svc](https://bj1prod-dacsvc.chinacloudapp.cn/dacwebservice.svc) |
| MySQL PaaS                            |                                                                                                                         | \*.mysqldb.chinacloudapi.cn                                                                                                                           |
| Azure Service Fabric cluster          | \*.cloudapp.azure.com                                                                                                   | \*.chinaeast.chinacloudapp.cn                                                                                                                         |
| Azure Active Directory (AD)           | \*.onmicrosoft.com                                                                                                      | \*.partner.onmschina.cn                                                                                                                               |
| Azure AD logon                        | [https://login.windows.net](https://login.windows.net/)                                                                 | [https://login.chinacloudapi.cn](https://login.chinacloudapi.cn/)                                                                                     |
| Azure AD Graph API                    | [https://graph.windows.net](https://graph.windows.net/)                                                                 | [https://graph.chinacloudapi.cn](https://graph.chinacloudapi.cn/)                                                                                     |
| Cognitive Services                    | <https://api.projectoxford.ai/face/v1.0>                                                                                | <https://api.cognitive.azure.cn/face/v1.0>                                                                                                            |
| Azure Key Vault API                    | \*.vault.azure.net                                                                                                      | \*.vault.azure.cn                                                                                                                                      |
| Logon with PowerShell: <br>- Classic Azure <br>- Azure Resource Manager  <br>- Azure AD|    - Add-AzureAccount<br>- Connect-AzureRmAccount <br> - Connect-msolservice                                                                                                                       |  - Add-AzureAccount -Environment AzureChinaCloud  <br> - Connect-AzureRmAccount -Environment AzureChinaCloud <br>- Connect-msolservice -AzureEnvironment AzureChinaCloud |               |                                                                                                                         |
 |


## Next steps
- [Developers Guide](https://www.azure.cn/documentation/articles/developerdifferences/#dev-guide) (in Chinese)
- [Azure Datacenter IP Ranges in China](https://www.microsoft.com/download/details.aspx?id=42064)
- [Manage performance and connectivity](/azure/china/china-how-to-manage-performance)
- [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/)
