---
title: Exchange AS2 messages in B2B workflows
description: Exchange AS2 messages between trading by creating workflows using Azure Logic Apps and Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: article
ms.date: 09/27/2021
---

# Exchange AS2 messages using workflows in Azure Logic Apps

To send and receive AS2 messages in workflows that you create using Azure Logic Apps, use the **AS2** connector, which provides triggers and actions that support and manage AS2 (version 1.2) communication.

* If you're working with the **Logic App (Consumption)** resource type and don't need tracking capabilities, use the **AS2 (v2)** connector, rather than the original **AS2** connector, which is being deprecated.

  Except for tracking, the v2 connector provides better performance, the same capabilities as the original version, is native to the Azure Logic Apps runtime, and has significant performance improvements in message size, throughput, and latency. Also, the v2 connector doesn't require that you create a connection to your integration account. Instead, as described in the prerequisites, make sure that you link your integration account to the logic app resource where you plan to use the connector.

* If you're working with the **Logic App (Standard)** resource type, only the original **AS2** connector is currently available.

For example, to establish security and reliability when transmitting messages, you can use the following actions:

### [Consumption](#tab/consumption)

* [**AS2 Encode** action](#encode) for providing encryption, digital signing, and acknowledgments through Message Disposition Notifications (MDN), which help support non-repudiation. For example, this action applies AS2/HTTP headers and performs these tasks when configured:

  * Signs outgoing messages.
  * Encrypts outgoing messages.
  * Compresses the message.
  * Transmits the file name in the MIME header.

* [**AS2 Decode** action](#decode) for providing decryption, digital signing, and acknowledgments through Message Disposition Notifications (MDN). For example, this action performs these tasks:

  * Processes AS2/HTTP headers.
  * Reconciles received MDNs with the original outbound messages.
  * Updates and correlates records in the non-repudiation database.
  * Writes records for AS2 status reporting.
  * Outputs payload contents as base64-encoded.
  * Determines whether MDNs are required. Based on the AS2 agreement, determines whether MDNs should be synchronous or asynchronous.
  * Generates synchronous or asynchronous MDNs based on the AS2 agreement.
  * Sets the correlation tokens and properties on MDNs.

  This action also performs these tasks when configured:

  * Verifies the signature.
  * Decrypts the messages.
  * Decompresses the message.
  * Check and disallow message ID duplicates.

### [Standard](#tab/standard)


This article shows how to add the AS2 encoding and decoding actions to an existing logic app workflow.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An [integration account resource](logic-apps-enterprise-integration-create-integration-account.md) where you define and store artifacts, such as trading partners, agreements, certificates, and so on, for use in your enterprise integration and B2B workflows. This resource has to meet the following requirements:

  * Is associated with the same Azure subscription as your logic app resource.

  * Exists in the same location or Azure region as your logic app resource.

  * If you're using the [**Logic App (Consumption)** resource type](logic-apps-overview.md#resource-type-and-host-environment-differences), your integration account requires a [link to your logic app resource](logic-apps-enterprise-integration-create-integration-account.md#link-account) before you can use artifacts in your workflow.

  * If you're using the [**Logic App (Standard)** resource type](logic-apps-overview.md#resource-type-and-host-environment-differences), your integration account doesn't need a link to your logic app resource but is still required to store other artifacts, such as partners, agreements, and certificates, along with using the [AS2](logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), or [EDIFACT](logic-apps-enterprise-integration-edifact.md) operations. Your integration account still has to meet other requirements, such as using the same Azure subscription and existing in the same location as your logic app resource.

  > [!NOTE]
  > Currently, only the **Logic App (Consumption)** resource type supports [RosettaNet](logic-apps-enterprise-integration-rosettanet.md) operations. 
  > The **Logic App (Standard)** resource type doesn't include [RosettaNet](logic-apps-enterprise-integration-rosettanet.md) operations.

* At least two [trading partners](logic-apps-enterprise-integration-partners.md) in your integration account. The definitions for both partners must use the same *business identity* qualifier, which is AS2 for this scenario.

* An [AS2 agreement](logic-apps-enterprise-integration-agreements.md) in your integration account between the trading partners that participate in your workflow. Each agreement requires a host partner and a guest partner.

* The logic app resource and workflow where you want to use the AS2 operations and the trigger that you want to use for starting your workflow. The AS2 connector provides only actions, not triggers. This example uses the [Request](../connectors/connectors-native-reqres.md) trigger.

  If you're new to logic apps, review [What is Azure Logic Apps](logic-apps/logic-apps-overview.md) and [Quickstart: Create your first logic app](quickstart-create-first-logic-app-workflow.md).

* If you use [Azure Key Vault](../key-vault/general/overview.md) for certificate management, check that your vault keys permit the **Encrypt** and **Decrypt** operations. Otherwise, the encoding and decoding actions fail.

  In the Azure portal, go to the key in your key vault, review your key's **Permitted operations**, and confirm that the **Encrypt** and **Decrypt** operations are selected, for example:

  ![Check vault key operations](media/logic-apps-enterprise-integration-as2/key-vault-permitted-operations.png)

<a name="encode"></a>

## Encode AS2 messages

1. If you haven't already, in the [Azure portal](https://portal.azure.com), open your logic app in the Logic App Designer.

1. In the designer, add a new action to your logic app.

1. Under **Choose an action** and the search box, select **All**. In the search box, enter "as2 encode", and make sure that you select the AS2 (v2) action: **AS2 Encode**

   ![Select "AS2 Encode"](./media/logic-apps-enterprise-integration-as2/select-as2-encode.png)

1. Now provide information for these properties:

   | Property | Description |
   |----------|-------------|
   | **Message to encode** | The message payload |
   | **AS2 from** | The identifier for the message sender as specified by your AS2 agreement |
   | **AS2 to** | The identifier for the message receiver as specified by your AS2 agreement |
   |||

   For example:

   ![Message encoding properties](./media/logic-apps-enterprise-integration-as2/as2-message-encoding-details.png)

> [!TIP]
> If you experience problems when sending signed or encrypted messages, consider trying different SHA256 algorithm formats. 
> The AS2 specification doesn't provide any information about SHA256 formats, so each provider uses their own implementation or format.

<a name="decode"></a>

## Decode AS2 messages

1. If you haven't already, in the [Azure portal](https://portal.azure.com), open your logic app in the Logic App Designer.

1. In the designer, add a new action to your logic app.

1. Under **Choose an action** and the search box, select **All**. In the search box, enter "as2 decode", and make sure that you select the AS2 (v2) action: **AS2 Decode**

   ![Select "AS2 Decode"](media/logic-apps-enterprise-integration-as2/select-as2-decode.png)

1. For the **Message to encode** and the **Message headers** properties, select these values from previous trigger or action outputs.

   For example, suppose your logic app receives messages through a Request trigger. You can select the outputs from that trigger.

   ![Select Body and Headers from Request outputs](media/logic-apps-enterprise-integration-as2/as2-message-decoding-details.png)

## Sample

To try deploying a fully operational logic app and sample AS2 scenario, see the [AS2 logic app template and scenario](https://azure.microsoft.com/resources/templates/logic-app-as2-send-receive/).

## Connector reference

For more technical details about this connector, such as actions and limits as described by the connector's Swagger file, see the [connector's reference page](/connectors/as2/). 

> [!NOTE]
> For logic apps in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), 
> this connector's ISE-labeled version uses the [B2B message limits for ISE](../logic-apps/logic-apps-limits-and-config.md#b2b-protocol-limits).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
