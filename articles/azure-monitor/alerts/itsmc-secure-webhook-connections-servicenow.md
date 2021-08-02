---
title: IT Service Management Connector - Secure Export in Azure Monitor - Configuration with ServiceNow
description: This article shows you how to connect your ITSM products/services with ServiceNow on Secure Export in Azure Monitor.
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
* You have the supported version of The ServiceNow Event Management - ITOM (version New York or later).
* [Application](https://store.servicenow.com/sn_appstore_store.do#!/store/application/ac4c9c57dbb1d090561b186c1396191a/1.3.1?referer=%2Fstore%2Fsearch%3Flistingtype%3Dallintegrations%25253Bancillary_app%25253Bcertified_apps%25253Bcontent%25253Bindustry_solution%25253Boem%25253Butility%26q%3DEvent%2520Management%2520Connectors&sl=sh) installed on ServiceNow instance.

## Configure the ServiceNow connection

1. Use the link https://(instance name).service-now.com/api/sn_em_connector/em/inbound_event?source=azuremonitor the URI for the secure export definition.

2. Follow the instructions according to the version:
   * [Quebec](https://docs.servicenow.com/bundle/quebec-it-operations-management/page/product/event-management/concept/azure-integration.html)
   * [Paris](https://docs.servicenow.com/bundle/paris-it-operations-management/page/product/event-management/concept/azure-integration.html)
   * [Orlando](https://docs.servicenow.com/bundle/orlando-it-operations-management/page/product/event-management/concept/azure-integration.html)
   * [New York](https://docs.servicenow.com/bundle/newyork-it-operations-management/page/product/event-management/concept/azure-integration.html)
