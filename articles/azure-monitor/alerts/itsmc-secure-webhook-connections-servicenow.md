---
title: 'ITSM Connector: Configure ServiceNow for Secure Webhook'
description: This article shows you how to connect your IT Service Management products and services with ServiceNow and Secure Webhook in Azure Monitor.
ms.topic: conceptual
ms.date: 06/19/2023
ms.reviewer: nolavime

---

# Connect ServiceNow to Azure Monitor

The following sections provide information about how to connect your ServiceNow product and Secure Webhook in Azure.

## Prerequisites

Ensure that you've met the following prerequisites:

* Azure Active Directory is registered.
* You have the supported version of ServiceNow Event Management - ITOM (version New York or later).
* The [application](https://store.servicenow.com/sn_appstore_store.do#!/store/application/ac4c9c57dbb1d090561b186c1396191a/2.2.0) is installed on the ServiceNow instance.

## Configure the ServiceNow connection

1. Use the link `https://(instance name).service-now.com/api/sn_em_connector/em/inbound_event?source=azuremonitor` to the URI for the Secure Webhook definition.

1. Follow the instructions according to the version:
   * [Tokyo](https://docs.servicenow.com/bundle/tokyo-it-operations-management/page/product/event-management/concept/azure-integration.html)
   * [Rome](https://docs.servicenow.com/bundle/rome-it-operations-management/page/product/event-management/concept/azure-integration.html)
   * [Quebec](https://docs.servicenow.com/bundle/quebec-it-operations-management/page/product/event-management/concept/azure-integration.html)
   * [Paris](https://docs.servicenow.com/bundle/paris-it-operations-management/page/product/event-management/concept/azure-integration.html)
