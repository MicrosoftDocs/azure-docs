---
title: An Azure Active Directory Application Proxy application takes too long to load
description: Troubleshoot page load performance issues with Azure Active Directory Application Proxy
services: active-directory
author: kenwith
manager: mtillman
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: troubleshooting
ms.date: 07/11/2017
ms.author: kenwith
ms.reviewer: asteen
---

# An Application Proxy application takes too long to load

This article helps you to understand why an Azure AD Application Proxy application may take a long time to load. It also explains what you can do to resolve this issue.

## Overview
Although your applications are working, they can experience a long latency. There might be network topology tweaks that you can make to improve speed. For an evaluation of different topologies, see the [network considerations document](application-proxy-network-topology.md).

Besides network topology, there are currently no further recommendations for performance tuning. As the Application Proxy service expands it might come to a data center that is physically closer. The closer proximity might help with latency. For a list of Azure data centers, see the [latency test page](http://www.azurespeed.com/Azure/Latency). 

## Feedback on Application Proxy data center locations 
There may be Azure data centers that don’t yet include Application Proxy, but would lead to a great latency improvement for you. Send the data center location to aadapfeedback@microsoft.com. Microsoft uses your feedback for expansion plans.

Microsoft is working on additional capabilities to improve latency. As soon as these improvements are available, the documentation will be updated.

## Next steps
[Work with existing on-premises proxy servers](application-proxy-configure-connectors-with-proxy-servers.md)
