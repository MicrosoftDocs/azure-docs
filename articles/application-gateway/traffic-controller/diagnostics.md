---
title: Diagnostic Logs for Traffic Controller
titlesuffix: Azure Application Load Balancer
description: Learn how to enable access logs for Traffic Controller
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: article
ms.date: 5/1/2023
ms.author: greglin
---

# Diagnostic logs for Traffic Controller

Learn how to troubleshoot common problems in Traffic Controller.

You can monitor Azure Traffic Controller resources in the following ways:

* Logs: Logs allow for performance, access, and other data to be saved or consumed from a resource for monitoring purposes.

* Metrics: Traffic Controller has several metrics that help you verify your system is performing as expected.

## Diagnostic logs

You can use different types of logs in Azure to manage and troubleshoot Traffic Controllers. You can access some of these logs through the portal. All logs can be extracted from Azure Blob storage and viewed in different tools, such as [Azure Monitor logs](../../azure-monitor/logs/data-platform-logs.md), Excel, and Power BI. You can learn more about the different types of logs from the following list:

* **Activity log**: You can use [Azure activity logs](../../azure-monitor/essentials/activity-log.md) (formerly known as operational logs and audit logs) to view all operations that are submitted to your Azure subscription, and their status. Activity log entries are collected by default, and you can view them in the Azure portal.
* **Access log**: You can use this log to view Traffic Controller access patterns and analyze important information. This includes the caller's IP, requested URL, response latency, return code, and bytes in and out. An access log is collected every 60 seconds. The data may be stored in a storage account, log analytics workspace, or event hub that is specified at time of enable logging.

### Configure access log

...

### Access log format

Each access of Traffic Controller is logged in JSON format as shown below.

