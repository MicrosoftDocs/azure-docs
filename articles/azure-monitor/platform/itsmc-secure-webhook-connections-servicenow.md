---
title: IT Service Management Connector - Secure Export in Azure Monitor - Configuration with ServiceNow
description: This article shows you how to connect your ITSM products/services with ServiceNow on Secure Export in Azure Monitor.
ms.subservice: logs
ms.topic: conceptual
author: nolavime
ms.author: v-jysur
ms.date: 12/31/2020

---


# Connect ServiceNow to Azure Monitor

The following sections provide details about how to connect your ServiceNow product and Secure Export in Azure.

## Prerequisites

Ensure that you've met the following prerequisites:

* Azure AD is registered.
* You have the supported version of The ServiceNow Event Management - ITOM (version Orlando or later).

## Configure the ServiceNow connection

1. Use the link https://(instance name).service-now.com/api/sn_em_connector/em/inbound_event?source=azuremonitor the URI for the secure export definition.

2. Follow the instructions according to the version:
   * [Paris](https://docs.servicenow.com/bundle/paris-it-operations-management/page/product/event-management/task/azure-events-authentication.html)
   * [Orlando](https://docs.servicenow.com/bundle/orlando-it-operations-management/page/product/event-management/task/azure-events-authentication.html)
   * [New York](https://docs.servicenow.com/bundle/newyork-it-operations-management/page/product/event-management/task/azure-events-authentication.html)