---
title: Safelist the Azure portal URLs | Microsoft Docs 
description: Add these URLs to proxy server bypass to communicate with the Azure portal and its services
services: azure-portal
keywords: 
author: kfollis
ms.author: kfollis
ms.date: 06/13/2019
ms.topic: conceptual

ms.service: azure-portal
manager:  mtillman
---
# Safelist the Azure portal URLs on your firewall or proxy server

For good performance and connectivity between your local- or wide-area network and the Azure cloud, configure on-premises security devices to bypass security restrictions for the Azure portal URLs. Network administrators often deploy proxy servers, firewalls, or other devices to help secure and give control over how users access the internet. However, rules designed to protect users can sometimes block or slow down legitimate business-related internet traffic, including communications between you and Azure. To optimize connectivity between your network and the Azure portal and its services, we recommend you add Azure portal URLs to your safelist.

## Azure portal URLs for proxy bypass

Add the following list of URLs to your proxy server or firewall to allow network traffic to these endpoints to bypass restrictions:

* *.aadcdn.microsoftonline-p.com
* *.aimon.applicationinsights.io
* *.azure.com
* *.azuredatalakestore.net
* *.azureedge.net
* *.exp.azure.com
* *.ext.azure.com
* *.gfx.ms
* *.account.microsoft.com
* *.hosting.portal.azure.net
* *.marketplaceapi.microsoft.com
* *.microsoftonline.com
* *.msauth.net
* *.msftauth.net
* *.portal.azure.com
* *.portalext.visualstudio.com
* *.sts.microsoft.com
* *.vortex.data.microsoft.com
* *.vscommerce.visualstudio.com
* *.vssps.visualstudio.com
* *.wpc.azureedge.net

> [!NOTE]
> Traffic to these endpoints uses standard TCP ports for HTTP (80) and HTTPS (443).
>
>
## Next steps

* Need to safelist IP addresses? Download the list of [Microsoft Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).
* Other Microsoft services use additional URLs and IP addresses for connectivity. To optimize network connectivity for Microsoft 365 services, see [Set up your network for Office 365](/office365/enterprise/set-up-network-for-office-365).
