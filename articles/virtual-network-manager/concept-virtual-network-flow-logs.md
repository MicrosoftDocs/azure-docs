---
title: Monitoring Security Admin Rules with Virtual Network Flow Logs
description: This article covers using Network Watcher and Virtual Network Flow Logs to monitor traffic through security admin rules in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: conceptual
ms.service: virtual-network-manager
ms.date: 08/11/2023
---

# Monitoring Azure Virtual Network Manager with Virtual Network Flow Logs

Monitoring traffic is critical to understanding how your network is performing and to troubleshoot issues. Administrators can utilize Virtual Network Flow Logs to show whether traffic is flowing through or blocked on a VNet by an [security admin rule]. Virtual Network Flow Logs are a feature of Network Watcher. You can use Virtual Network Flow Logs to monitor traffic to and from your virtual networks. 

## Virtual Network Flow Logs

Currently, you'll need to enable Virtual Network Flow Logs on each VNet you want to monitor. You can enable Virtual Network Flow Logs on a VNet by using PowerShell or the Azure CLI.

Here is an example of a flow log


## Next steps

- Learn more about [Event log options for Azure Virtual Network Manager](concept-event-logs.md).