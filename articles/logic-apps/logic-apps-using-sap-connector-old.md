---
title: Migrate between SAP connectors - Azure Logic Apps
description: Learn how to migrate your logic app to the latest SAP connector from the previous SAP connector
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, divswa, LADocs
ms.topic: article
ms.date: 08/30/2019
tags: connectors
---

# Migrate to the latest SAP connector in Azure Logic Apps

This topic applies to the previous SAP connector, which is scheduled for deprecation. Instead, please use or migrate to the [newer and more advanced SAP connector](./logic-apps-using-sap-connector.md), which consolidates both the Application Server and Message Server connectors and helps you avoid having to change the connection type. The newer connector continues to use the SAP .Net connector library (SAP NCo) and is fully compatible with the previous connector.

## 

1. Download the current on-premises data gateway and update your gateway to the latest version.

1. In the logic app that uses the older SAP connector, delete the **Send to SAP** action.

1. Now, add the **Send to SAP** action from the latest SAP connector. Before you can use this action, you must recreate the connection to your SAP system.

1. When you're done, save your logic app.

## Next steps

* [Connect to on-premises systems](../logic-apps/logic-apps-gateway-connection.md) from logic apps
* Learn how to validate, transform, and other message operations with the 
[Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md)
* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
