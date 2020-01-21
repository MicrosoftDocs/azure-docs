---
title: Safelist the Azure portal URLs | Microsoft Docs
description: Add these URLs to proxy server bypass to communicate with the Azure portal and its services
services: azure-portal
keywords:
author: mgblythe
ms.author: mblythe
ms.date: 09/13/2019
ms.topic: conceptual

ms.service: azure-portal
manager:  mtillman
---
# Safelist the Azure portal URLs on your firewall or proxy server

For good performance and connectivity between your local- or wide-area network and the Azure cloud, configure on-premises security devices to bypass security restrictions for the Azure portal URLs. Network administrators often deploy proxy servers, firewalls, or other devices to help secure and give control over how users access the internet. However, rules designed to protect users can sometimes block or slow down legitimate business-related internet traffic, including communications between you and Azure. To optimize connectivity between your network and the Azure portal and its services, we recommend you add Azure portal URLs to your safelist.

## Azure portal URLs for proxy bypass

The URL endpoints to safelist for the Azure portal are specific to the Azure cloud where your organization is deployed. Select your cloud, then add the list of URLs to your proxy server or firewall to allow network traffic to these endpoints to bypass restrictions.

#### [Public Cloud](#tab/public-cloud)
```
*.aadcdn.microsoftonline-p.com
*.aka.ms
*.applicationinsights.io
*.azure.com
*.azure.net
*.azureafd.net
*.azure-api.net
*.azuredatalakestore.net
*.azureedge.net
*.loganalytics.io
*.microsoft.com
*.microsoftonline.com
*.microsoftonline-p.com
*.msauth.net
*.msftauth.net
*.trafficmanager.net
*.visualstudio.com
*.windows.net
*.windows-int.net
```

#### [U.S. Government Cloud](#tab/us-government-cloud)
```
*.azure.us
*.loganalytics.us
*.microsoft.us
*.microsoftonline.us
*.msauth.net
*.usgovcloudapi.net
*.usgovtrafficmanager.net
*.windowsazure.us
```

#### [China Government Cloud](#tab/china-government-cloud)
```
*.azure.cn
*.microsoft.cn
*.microsoftonline.cn
*.chinacloudapi.cn
*.trafficmanager.cn
*.chinacloudsites.cn
*.windowsazure.cn
```
---

> [!NOTE]
> Traffic to these endpoints uses standard TCP ports for HTTP (80) and HTTPS (443).
>
>
## Next steps

Need to safelist IP addresses? Download the list of Microsoft Azure datacenter IP ranges for your cloud:

* [Worldwide](https://www.microsoft.com/download/details.aspx?id=56519)
* [U.S. Government](https://www.microsoft.com/download/details.aspx?id=57063)
* [Germany](https://www.microsoft.com/download/details.aspx?id=57064)
* [China](https://www.microsoft.com/download/details.aspx?id=57062)

Other Microsoft services use additional URLs and IP addresses for connectivity. To optimize network connectivity for Microsoft 365 services, see [Set up your network for Office 365](/office365/enterprise/set-up-network-for-office-365).
