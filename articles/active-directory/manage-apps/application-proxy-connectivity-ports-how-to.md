---
title: How to open firewall ports required for an Application Proxy app
description: Find out what ports to open for the Azure AD Application Proxy to work correctly
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 05/21/2018
ms.author: kenwith
ms.reviewer: asteen
ms.collection: M365-identity-device-management
---

# How to open the firewall ports required for an Application Proxy application

To see a full list of the required ports and the function of each port, see the prerequisites section of the [Application Proxy documentation](application-proxy-add-on-premises-application.md). note that Application Proxy only uses outbound ports.

You can also check whether you have all the required ports open by opening the [Connector Ports Test Tool](https://aadap-portcheck.connectorporttest.msappproxy.net/) from your on premises network. More green checkmarks means greater resiliency. 

## App Proxy regions

We are working on a way to let you know which of these regions needs to be green for you. For now, make sure they all are. Central US is also required regardless of which region you are in.

To make sure the tool gives you the right results, be sure to:

-   Open the tool on a browser from the server where you have installed the Connector.

-   Ensure that any proxies or firewalls applicable to your Connector are also applied to this page. This can be done in Internet Explorer by going to **Settings** -&gt; **Internet Options** -&gt; **Connections** -&gt; **LAN Settings**. On this page, you see the field “Use a Proxy Server for your LAN”. Select this box, and put the proxy address into the “Address” field.

## Next steps
[Understand Azure AD Application Proxy connectors](application-proxy-connectors.md)
