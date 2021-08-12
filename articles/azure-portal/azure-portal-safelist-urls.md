---
title: Allow the Azure portal URLs on your firewall or proxy server
description: To optimize connectivity between your network and the Azure portal and its services, we recommend you add these URLs to your allowlist.
ms.date: 06/21/2021
ms.topic: conceptual
---

# Allow the Azure portal URLs on your firewall or proxy server

To optimize connectivity between your network and the Azure portal and its services, we recommend you add specific Azure portal URLs to your allowlist. Doing so can improve performance and connectivity between your local- or wide-area network and the Azure cloud.

Network administrators often deploy proxy servers, firewalls, or other devices, which can help secure and give control over how users access the internet. Rules designed to protect users can sometimes block or slow down legitimate business-related internet traffic. This traffic includes communications between you and Azure over the URLs listed here.

> [!TIP]
> For help diagnosing issues with network connections to these domains, check https://portal.azure.com/selfhelp.

## Azure portal URLs for proxy bypass

The URL endpoints to allow for the Azure portal are specific to the Azure cloud where your organization is deployed. To allow network traffic to these endpoints to bypass restrictions, select your cloud, then add the list of URLs to your proxy server or firewall. We do not recommend adding any additional portal-related URLs aside from those listed here, although you may want to add URLs related to other Microsoft products and services.

#### [Public Cloud](#tab/public-cloud)

```
*.aadcdn.microsoftonline-p.com
*.aka.ms
*.applicationinsights.io
*.azure.com
*.azure.net
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
