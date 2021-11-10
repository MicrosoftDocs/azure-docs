---
title: 'Path selection with Azure Route Server'
description: Learn about how Azure Route Server enables path selection for your network virtual appliance.
services: route-server
author: duongau
ms.service: route-server
ms.topic: conceptual
ms.date: 11/03/2021
ms.author: duau
---

# Path selection with Azure Route Server

Azure Route Server allows you to advertise your on-premises network connected either by VPN or ExpressRoute to a network virtual appliance (NVA) in Azure. The communication between the NVA and on-premises resources will utilize the same path on the return when Azure resources wants to send traffic. In this article, we'll talk about how Azure Route Server enables path selection which allows you to configure your NVA to have a preference in routing when communicating with your on-premises network.

