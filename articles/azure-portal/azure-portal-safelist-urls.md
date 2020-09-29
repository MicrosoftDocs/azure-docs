---
title: Safelist the Azure portal URLs on your firewall or proxy server
description: Add these URLs to proxy server bypass to communicate with the Azure portal and its services
services: azure-portal
keywords:
author: mgblythe
ms.author: mblythe
ms.date: 04/10/2020
ms.topic: conceptual

ms.service: azure-portal
manager:  mtillman
---

# Safelist the Azure portal URLs on your firewall or proxy server

You can configure on-premises security devices to bypass security restrictions for the Azure portal URLs. This configuration can improve performance and connectivity between your local- or wide-area network and the Azure cloud.

Network administrators often deploy proxy servers, firewalls, or other devices. These devices help secure and give control over how users access the internet. Rules designed to protect users can sometimes block or slow down legitimate business-related internet traffic. This traffic includes communications between you and Azure. To optimize connectivity between your network and the Azure portal and its services, we recommend you add Azure portal URLs to your safelist.

## Azure portal URLs for proxy bypass

The URL endpoints to safelist for the Azure portal are specific to the Azure cloud where your organization is deployed. To allow network traffic to these endpoints to bypass restrictions, select your cloud. Then add the list of URLs to your proxy server or firewall.

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
*.applicationinsights.us
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
