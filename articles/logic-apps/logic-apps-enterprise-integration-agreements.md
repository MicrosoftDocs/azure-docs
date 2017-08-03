---
title: Agreements for B2B communication - Azure Logic Apps | Microsoft Docs
description: Create agreements so partners can communicate in B2B scenarios for Azure Logic Apps and the Enterprise Integration Pack
services: logic-apps
documentationcenter: .net,nodejs,java
author: msftman
manager: anneta
editor: cgronlun

ms.assetid: 447ffb8e-3e91-4403-872b-2f496495899d
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/29/2016
ms.author: LADocs

---
# Partner agreements for B2B communication with Azure Logic Apps and Enterprise Integration Pack

Agreements let business entities communicate seamlessly using industry standard protocols and are the cornerstone for business-to-business (B2B) communication. 
When enabling B2B scenarios for logic apps with the Enterprise Integration Pack, 
an agreement is a communications arrangement between B2B trading partners. 
This agreement is based on the communications that the partners want to 
establish and is protocol or transport-specific.

Enterprise integration supports these protocol or transport standards:

* [AS2](logic-apps-enterprise-integration-as2.md)
* [X12](logic-apps-enterprise-integration-x12.md)
* [EDIFACT](logic-apps-enterprise-integration-edifact.md)

## Why use agreements

Here are some common benefits when using agreements:

* Enables different organizations and businesses to exchange information in a well-known format.
* Improves efficiency when conducting B2B transactions
* Easy to create, manage, and use when creating enterprise integration apps

## How to create agreements

* [Create an AS2 agreement](logic-apps-enterprise-integration-as2.md)
* [Create an X12 agreement](logic-apps-enterprise-integration-x12.md)
* [Create an EDIFACT agreement](logic-apps-enterprise-integration-edifact.md)

## How to use an agreement

You can create 
[logic apps](logic-apps-what-are-logic-apps.md "Learn about Logic apps") with B2B capabilities by using an agreement that you created.

## How to edit an agreement

You can edit any agreement by following these steps:

1. Select the integration account that has the agreement you want to update.

2. Choose the **Agreements** tile.

3. On the **Agreements** blade, select the agreement.

4. Choose **Edit**. Make your changes.

5. To save your changes, choose **OK**.

## How to delete an agreement

You can delete any agreement by following these steps:

1. Select the integration account that has the agreement you want to delete.
2. Choose the **Agreements** tile.
3. On the **Agreements** blade, select the agreement.
4. Choose **Delete**.
5. Confirm that you want to delete the selected agreement.

	The Agreements blade no longer shows the deleted agreement.

## Next steps
* [Create an AS2 agreement](logic-apps-enterprise-integration-as2.md)
