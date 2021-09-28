---
title: Exchange EDIFACT messages in B2B workflows
description: Exchange EDIFACT messages between partners by creating workflows with Azure Logic Apps and Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 09/29/2021
---

# Exchange EDIFACT messages using workflows in Azure Logic Apps

To send and receive EDIFACT messages in workflows that you create using Azure Logic Apps, use the **EDIFACT** connector, which provides triggers and actions that support and manage EDIFACT communication.

This article shows how to add the EDIFACT encoding and decoding actions to an existing logic app workflow. Although you can use any trigger to start your workflow, the examples use the [Request](../connectors/connectors-native-reqres.md) trigger. For more information about the **EDIFACT** connector's triggers, actions, and limits version, review the [connector's reference page](/connectors/edifact/) as documented by the connector's Swagger file.

## Limits

For information about the EDIFACT connector limits for workflows running in [multi-tenant Azure Logic Apps, single-tenant Azure Logic Apps, or the integration service environment (ISE)](logic-apps-overview.md#resource-environment-differences), review the [B2B protocol limits for message sizes](logic-apps-limits-and-config.md#b2b-protocol-limits). For example, in an [integration service environment (ISE)](connect-virtual-network-vnet-isolated-environment-overview.md), the ISE version for this connector uses the [B2B message limits for ISE](logic-apps-limits-and-config.md#b2b-protocol-limits).

## Connector reference

For technical information about the **EDIFACT** connector, review the [connector's reference page](/connectors/edifact/), which describes the triggers, actions, and limits as documented by the connector's Swagger file.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An [integration account resource](logic-apps-enterprise-integration-create-integration-account.md) where you define and store artifacts, such as trading partners, agreements, certificates, and so on, for use in your enterprise integration and B2B workflows. This resource has to meet the following requirements:

  * Is associated with the same Azure subscription as your logic app resource.

  * Exists in the same location or Azure region as your logic app resource.

  * When you use the [**Logic App (Consumption)** resource type](logic-apps-overview.md#resource-environment-differences) and the **EDIFACT** operations, your logic app resource doesn't need a link to your integration account. However, you still need this account to store artifacts, such as partners, agreements, and certificates, along with using the EDIFACT, [X12](logic-apps-enterprise-integration-x12.md), or [AS2](logic-apps-enterprise-integration-as2.md) operations. Your integration account still has to meet other requirements, such as using the same Azure subscription and existing in the same location as your logic app resource.

  * When you use the [**Logic App (Standard)** resource type](logic-apps-overview.md#resource-environment-differences) and the **EDIFACT** operations, your workflow requires a connection to your integration account that you create directly from your workflow when you add the AS2 operation.

* At least two [trading partners](logic-apps-enterprise-integration-partners.md) in your integration account. The definitions for both partners must use the same *business identity* qualifier, which is **ZZZ - Mutually Defined** for this scenario.

* An [EDIFACT agreement](logic-apps-enterprise-integration-agreements.md) in your integration account between the trading partners that participate in your workflow. Each agreement requires a host partner and a guest partner. The content in the messages between you and the other partner must match the agreement type.

  > [!IMPORTANT]
  > The EDIFACT connector supports only UTF-8 characters. If your output contains 
  > unexpected characters, check that your EDIFACT messages use the UTF-8 character set.

* The logic app resource and workflow where you want to use the EDIFACT operations.

  If you're new to logic apps, review [What is Azure Logic Apps](logic-apps-overview.md) and [Quickstart: Create your first logic app](quickstart-create-first-logic-app-workflow.md).

<a name="encode"></a>

## Encode EDIFACT messages

### [Consumption](#tab/consumption)

### [Standard](#tab/standard)

---

<a name="decode"></a>

## Decode EDIFACT messages

### [Consumption](#tab/consumption)

### [Standard](#tab/standard)

---

## Handle UNH2.5 segments in EDIFACT documents

In an EDIFACT document, the [UNH2.5 segment](logic-apps-enterprise-integration-edifact-message-settings.md#receive-settings-schemas) is used for used for schema lookup. For example, in this sample EDIFACT message, the UNH field is `EAN008`:

`UNH+SSDD1+ORDERS:D:03B:UN:EAN008`

To handle an EDIFACT document or process an EDIFACT message that has a UN2.5 segment, follow these steps:

1. Update or deploy a schema that has the UNH2.5 root node name.

   For example, suppose the schema root name for the sample UNH field is `EFACT_D03B_ORDERS_EAN008`. For each `D03B_ORDERS` that has a different UNH2.5 segment, you have to deploy an individual schema.

1. In the [Azure portal](https://portal.azure.com), add the schema to your integration account resource or logic app resource, which is based on whether you're working with the **Logic App (Consumption)** or **Logic App (Standard)** resource type respectively.

1. Whether you're using the EDIFACT decoding or encoding action, upload your schema and set up the schema settings in your EDIFACT agreement's **Receive Settings** or **Send Settings** sections respectively.

1. To edit your EDIFACT agreement, on the **Agreements** pane, select your agreement. On the **Agreements** pane's toolbar, select **Edit as JSON**.

   * In the agreement's `receiveAgreement` section, find the `schemaReferences` section, and add the UNH2.5 value.

     ![Screenshot showing the Azure portal with an EDIFACT agreement's "receiveAgreement" section in the JSON editor, and the "schemaReferences" section is highlighted.](./media/logic-apps-enterprise-integration-edifact/agreement-receive-schema-references.png)

   * In the agreement's `sendAgreement`section, find the `schemaReferences` section, and add the UNH2.5 value.

     ![Screenshot showing the Azure portal with an EDIFACT agreement's "sendAgreement" section in the JSON editor, and the "schemaReferences" section is highlighted.](./media/logic-apps-enterprise-integration-edifact/agreement-send-schema-references.png)

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
