---
title: A Microsoft Entra application proxy application takes too long to load
description: Troubleshoot page load performance issues with Microsoft Entra application proxy
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/14/2023
ms.author: kenwith
ms.reviewer: asteen
---

# An Application Proxy application takes too long to load

This article helps you to understand why a Microsoft Entra application proxy application may take a long time to load. It also explains what you can do to resolve this issue.

## Overview
Although your applications are working, they can experience a long latency. There might be network topology tweaks that you can make to improve speed. For an evaluation of different topologies, see the [network considerations document](application-proxy-network-topology.md).

Besides network topology, there are currently no further recommendations for performance tuning. As the Application Proxy service expands it might come to a data center that is physically closer. The closer proximity might help with latency. For a list of Azure data centers, see the [latency test page](http://www.azurespeed.com/Azure/Latency). 

## Next steps
[Work with existing on-premises proxy servers](application-proxy-configure-connectors-with-proxy-servers.md)
