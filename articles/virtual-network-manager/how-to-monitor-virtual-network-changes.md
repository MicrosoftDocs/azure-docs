---
title: Monitoring Azure Virtual Network Manager for virtual network changes
description: This article describes how to monitor Azure Virtual Network Manager with Azure Monitor.
author: mbender-ms
ms.author: mbender
ms.topic: how-to
ms.service: azure-virtual-network-manager
ms.date: 04/12/2023
---

# Monitoring Azure Virtual Network Manager for virtual network changes

When configurations are changed in Azure Virtual Network Manager, this can impact virtual networks that are associated with network groups in your instance. With Azure Monitor, you can monitor Azure Virtual Network Manager for virtual network changes. 

In this article, you'll learn how to monitor Azure Virtual Network Manager for virtual network changes with Log Analytics or a storage account. 

## Prerequisites

- [Azure Virtual Network Manager](../concept-virtual-network-manager.md) is enabled on your subscription.
- [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview) is enabled on your subscription.
-  You deployed either a [Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md). or a [storage account](../storage/common/storage-account-create.md) to monitor Azure Virtual Network Manager.

## Accessing Azure Virtual Network Manager logs

### How to access event logs with Log Analytics 

1. Navigate to the network manager you want to obtain the logs of.
1. Under the Monitoring section, select the Diagnostic settings blade.
1. Select Add diagnostic setting and select the option to send the logs to your Log Analytics workspace. 

### How to access event logs with a storage account
1. Navigate to the network manager you want to obtain the logs of.
1. Under the Monitoring section, select the Diagnostic settings blade.
1. Select Add diagnostic setting and select the option to archive the logs to your storage account.
1. Navigate to your storage account and select the Storage browser blade. 