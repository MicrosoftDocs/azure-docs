---
title: Create and Manage Hybrid Connections | Microsoft Docs
description: Learn how to create a hybrid connection, manage the connection, and install the Hybrid Connection Manager. MABS, WABS
services: biztalk-services
documentationcenter: ''
author: MandiOhlinger
manager: erikre
editor: ''

ms.assetid: aac0546b-3bae-41e0-b874-583491a395ea
ms.service: biztalk-services
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/18/2016
ms.author: ccompy

---
# Create and Manage Hybrid Connections

> [!IMPORTANT]
> BizTalk Hybrid Connections is retired, and replaced by App Service Hybrid Connections. For more information, including how to manage your existing BizTalk Hybrid Connections, see [Azure App Service Hybrid Connections](../app-service/app-service-hybrid-connections.md).

>[!INCLUDE [Use APIs to manage MABS](../../includes/biztalk-services-retirement-azure-classic-portal.md)]

## Overview of the Steps
1. Create a Hybrid Connection by entering the **host name** or **FQDN** of the on-premises resource in your private network.
2. Link your Azure web apps or Azure mobile apps to the Hybrid Connection.
3. Install the Hybrid Connection Manager on your on-premises resource and connect to the specific Hybrid Connection. The Azure portal provides a single-click experience to install and connect.
4. Manage Hybrid Connections and their connection keys.

This topic lists these steps. 

> [!IMPORTANT]
> It is possible to set a Hybrid Connection endpoint to an IP address. If you use an IP address, you may or may not reach the on-premises resource, depending on your client. The Hybrid Connection depends on the client doing a DNS lookup. In most cases, the **client** is your application code. If the client does not perform a DNS lookup, (it does not try to resolve the IP address as if it were a domain name (x.x.x.x)), then traffic is not sent through the Hybrid Connection.
> 
> For example (pseudocode), you define **10.4.5.6** as your on-premises host:
> 
> **The following scenario works:**  
> `Application code -> GetHostByName("10.4.5.6") -> Resolves to 127.0.0.3 -> Connect("127.0.0.3") -> Hybrid Connection -> on-prem host`
> 
> **The following scenario doesn't work:**  
> `Application code -> Connect("10.4.5.6") -> ?? -> No route to host`
> 
> 

## <a name="CreateHybridConnection"></a>Create a Hybrid Connection
A Hybrid Connection can be created in [Azure App Service Hybrid Connections](../app-service/app-service-hybrid-connections.md) **or** using [BizTalk Services REST APIs](https://msdn.microsoft.com/library/azure/dn232347.aspx). 

<!-- **To create Hybrid Connections using Web Apps**, see [Connect Azure Web Apps to an On-Premises Resource](../app-service-web/web-sites-hybrid-connection-get-started.md). You can also install the Hybrid Connection Manager (HCM) from your web app, which is the preferred method.  -->

#### Additional
* Multiple Hybrid Connections can be created. See the [BizTalk Services: Editions Chart](biztalk-editions-feature-chart.md) for the number of connections allowed. 
* Each Hybrid Connection is created with a pair of connection strings: Application keys that SEND and On-premises keys that LISTEN. Each pair has a Primary and a Secondary key. 

## <a name="LinkWebSite"></a>Link your Azure App Service Web App or Mobile App
To link a Web App or Mobile App in Azure App Service to an existing Hybrid Connection, select **use an existing Hybrid Connection** in the Hybrid Connections blade. 
<!-- See [Access on-premises resources using hybrid connections in Azure App Service](../app-service-web/web-sites-hybrid-connection-get-started.md). -->

## <a name="InstallHCM"></a>Install the Hybrid Connection Manager on-premises
After a Hybrid Connection is created, install the Hybrid Connection Manager on the on-premises resource. It can be downloaded from your Azure web apps or from your BizTalk Service. 

[!INCLUDE [Use APIs to manage MABS](../../includes/biztalk-services-retirement-azure-classic-portal.md)]
 
[Azure App Service Hybrid Connections](../app-service/app-service-hybrid-connections.md) is also a good resource.

<!--
You can also download the Hybrid Connection Manager MSI file and copy the file to your on-premises resource. Specific steps:

1. Copy the on-premises primary Connection String. See [Manage Hybrid Connections](#ManageHybridConnection) in this topic for the specific steps.
2. Download the Hybrid Connection Manager MSI file. 
3. On the on-premises resource, install the Hybrid Connection Manager from the MSI file. 
4. Using Windows PowerShell, type: 
> Add-HybridConnection -ConnectionString “*Your On-Premises Connection String that you copied*” 
--> 

#### Additional
* Hybrid Connection Manager can be installed on the following operating systems:
  
  * Windows Server 2008 R2 (.NET Framework 4.5+ and Windows Management Framework 4.0+ required)
  * Windows Server 2012 (Windows Management Framework 4.0+ required)
  * Windows Server 2012 R2
* After you install the Hybrid Connection Manager, the following occurs: 
  
  * The Hybrid Connection hosted on Azure is automatically configured to use the Primary Application Connection String. 
  * The On-Premises resource is automatically configured to use the Primary On-Premises Connection String.
* The Hybrid Connection Manager must use a valid on-premises connection string for authorization. The Azure Web Apps or Mobile Apps must use a valid application connection string for authorization.
* You can scale Hybrid Connections by installing another instance of the Hybrid Connection Manager on another server. Configure the on-premises listener to use the same address as the first on-premises listener. In this situation, the traffic is randomly distributed (round robin) between the active on-premises listeners. 

## <a name="ManageHybridConnection"></a>Manage Hybrid Connections

[!INCLUDE [Use APIs to manage MABS](../../includes/biztalk-services-retirement-azure-classic-portal.md)] 

[Azure App Service Hybrid Connections](../app-service/app-service-hybrid-connections.md) is also a good resource.

#### Copy/regenerate the Hybrid Connection Strings

[!INCLUDE [Use APIs to manage MABS](../../includes/biztalk-services-retirement-azure-classic-portal.md)] 

[Azure App Service Hybrid Connections](../app-service/app-service-hybrid-connections.md) is also a good resource.

#### Use Group Policy to control the on-premises resources used by a Hybrid Connection
1. Download the [Hybrid Connection Manager Administrative Templates](http://www.microsoft.com/download/details.aspx?id=42963).
2. Extract the files.
3. On the computer that modifies group policy, do the following:  
   
   * Copy the .ADMX files to the *%WINROOT%\PolicyDefinitions* folder.
   * Copy the .ADML files to the *%WINROOT%\PolicyDefinitions\en-us* folder.

Once copied, you can use Group Policy Editor to change the policy.

## Next
[Hybrid Connections Overview](integration-hybrid-connection-overview.md)

## See Also
[REST API for Managing BizTalk Services on Microsoft Azure](http://msdn.microsoft.com/library/azure/dn232347.aspx)  
[BizTalk Services: Editions Chart](biztalk-editions-feature-chart.md)  
[Create a BizTalk Service](biztalk-provision-services.md)  
[BizTalk Services: Dashboard, Monitor and Scale tabs](biztalk-dashboard-monitor-scale-tabs.md)

[HybridConnectionTab]: ./media/integration-hybrid-connection-create-manage/WABS_HybridConnectionTab.png
[HCOnPremSetup]: ./media/integration-hybrid-connection-create-manage/WABS_HybridConnectionOnPremSetup.png
[HCManageConnection]: ./media/integration-hybrid-connection-create-manage/WABS_HybridConnectionManageConn.png 
