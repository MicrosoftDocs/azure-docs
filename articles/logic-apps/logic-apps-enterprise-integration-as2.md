---
title: Exchange AS2 messages in B2B workflows
description: Exchange AS2 messages between partners by creating workflows with Azure Logic Apps and Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/20/2022
---

# Exchange AS2 messages using workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To send and receive AS2 messages in workflows that you create using Azure Logic Apps, use the **AS2** connector, which provides triggers and actions that support and manage AS2 (version 1.2) communication. This article shows how to add the AS2 encoding and decoding actions to an existing logic app workflow. Although you can use any trigger to start your workflow, the examples in this article use the [Request](../connectors/connectors-native-reqres.md) trigger.

* If you're working with Consumption logic app workflows and don't need tracking capabilities, use the **AS2 (v2)** connector, rather than the original **AS2** connector, which is being deprecated.

  Except for tracking, the **AS2 (v2)** connector provides the same capabilities as the original version, runs natively with the Azure Logic Apps runtime, and offers significant performance improvements in message size, throughput, and latency. Also, the v2 connector doesn't require that you create a connection to your integration account. Instead, as described in the prerequisites, make sure that you link your integration account to the logic app resource where you plan to use the connector.

* If you're working with Standard logic app workflows and don't need tracking capabilities, use the **AS2 (v2)** built-in connector. Otherwise, the original **AS2** managed connector is available, but is being deprecated.

  Except for tracking, the **AS2 (v2)** connector provides the same capabilities as the original version, runs natively with the Azure Logic Apps runtime, and offers significant performance improvements in message size, throughput, and latency. The v2 connector doesn't require that you create a connection to your integration account. Instead, as described in the prerequisites, make sure that you link your integration account to the logic app resource where you plan to use the connector.

## Connector technical reference

The AS2 connector has different versions, based on [logic app type and host environment](../logic-apps/logic-apps-overview.md#resource-environment-differences).

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Consumption** | Multi-tenant Azure Logic Apps | Managed connector (Standard class). For more information, review the following documentation: <br><br>- [Original AS2 managed connector reference](/connectors/as2/) <br>- [AS2 (v2) managed connector operations](#as2-v2-operations) <br>- [B2B protocol limits for message sizes](logic-apps-limits-and-config.md#b2b-protocol-limits) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Consumption** | Integration service environment (ISE) | Managed connector (Standard class) and ISE version, which has different message limits than the Standard class. For more information, review the following documentation: <br><br>- [AS2 original managed connector reference](/connectors/as2/) <br>- [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Managed connector (Azure-hosted) and built-in connector. The built-in version differs in the following ways: <br><br>- The built-in version provides only actions, not triggers. You can use the original AS2 trigger or a different trigger. <br><br>- The built-in version can directly access Azure virtual networks. You don't need an on-premises data gateway.<br><br>For more information, review the following documentation: <br><br>- <br><br>- [Original AS2 managed connector reference](/connectors/as2/) <br>- [AS2 (v2) built-in connector operations](#as2-v2-operations) section later in this article <br>- [Built-in connectors in Azure Logic Apps](built-in.md) |

<a name="as-v2-operations"></a>

## AS2 (v2) operations

The **AS2 (v2)** connector has no triggers. The following table describes the actions that the **AS2 (v2)** connector provides for establishing security and reliability when transmitting messages:

| Action | Description |
|--------|-------------|
| [**AS2 Encode** action](#encode) | Provides encryption, digital signing, and acknowledgments through Message Disposition Notifications (MDN), which help support non-repudiation. For example, this action applies AS2/HTTP headers and performs the following tasks when configured: <br><br>- Sign outgoing messages. <br>- Encrypt outgoing messages. <br>- Compress the message. <br>- Transmit the file name in the MIME header. |
| [**AS2 Decode** action](#decode) | Provide decryption, digital signing, and acknowledgments through Message Disposition Notifications (MDN). For example, this action performs the following tasks when configured: <br><br>- Process AS2/HTTP headers. <br>- Reconcile received MDNs with the original outbound messages. <br>- Update and correlate records in the non-repudiation database. <br>- Write records for AS2 status reporting. <br>- Output payload contents as base64-encoded.  <br>-  Determine whether MDNs are required. Based on the AS2 agreement, determine whether MDNs should be synchronous or asynchronous. <br>- Generate synchronous or asynchronous MDNs based on the AS2 agreement. <br>- Set the correlation tokens and properties on MDNs. <br>- Verify the signature. <br>- Decrypt the messages. <br>- Decompress the message. <br>- Check and disallow message ID duplicates. |

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The logic app resource and workflow where you want to use the AS2 operations.

* An [integration account resource](logic-apps-enterprise-integration-create-integration-account.md) to define and store artifacts for use in enterprise integration and B2B workflows.

  > [!IMPORTANT]
  >
  > To work together, both your integration account and logic app resource must exist in the same Azure subscription and Azure region.

* At least two [trading partners](logic-apps-enterprise-integration-partners.md) in your integration account. The definitions for both partners must use the same *business identity* qualifier, which is **AS2Identity** for this scenario.

* An [AS2 agreement](logic-apps-enterprise-integration-agreements.md) in your integration account between the trading partners that participate in your workflow. Each agreement requires a host partner and a guest partner. The content in the messages between you and the other partner must match the agreement type.

* Based on whether you're working on a Consumption or Standard logic app workflow, your logic app resource requires a [link to your integration account](logic-apps-enterprise-integration-create-integration-account.md?tabs=consumption#link-account).

  * If you're working on a Consumption logic app workflow with the **AS2 (v2)** managed connector operations, your logic app resource doesn't need a link to your integration account.

  * If you're working on a Standard logic app workflow, you can link your logic app resource to your integration account, upload maps and schemas directly to your logic app resource, or both, based on the following scenarios:

    * If you already have an integration account with the artifacts that you need or want to use, you can link your integration account to multiple Standard logic app resources where you want to use the artifacts. That way, you don't have to upload schemas to each individual logic app. For more information, review [Link your logic app resource to your integration account](logic-apps-enterprise-integration-create-integration-account.md?tabs=standard#link-account).

  * When you use the [**Logic App (Standard)** resource type](logic-apps-overview.md#resource-environment-differences) and the original **AS2** operations, your workflow requires a connection to your integration account that you create directly from your workflow when you add the AS2 operation.

* If you use [Azure Key Vault](../key-vault/general/overview.md) for certificate management, check that your vault keys permit the **Encrypt** and **Decrypt** operations. Otherwise, the encoding and decoding actions fail.

  1. In the Azure portal, open your key vault. On the key vault menu, under **Settings**, select **Keys**.

  1. On the **Keys** pane, select your key. On the **Versions** pane, select the key version that you're using.

  1. On the **Key Version** pane, under **Permitted operations**, confirm that the **Encrypt** and **Decrypt** operations are selected, for example:

     ![Screenshot showing the Azure portal with the key vault, key, and key version panes open, which has the "Encrypt" and "Decrypt" operations selected.](media/logic-apps-enterprise-integration-as2/key-vault-permitted-operations.png)

<a name="encode"></a>

## Encode AS2 messages

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app resource and workflow in the designer.

1. On the designer, under the trigger or action where you want to add the AS2 action, select **New step**.

1. Under the **Choose an operation** search box, select **All**. In the search box, enter `as2 encode`. Select the action named **AS2 Encode**.

   ![Screenshot showing the Azure portal, workflow designer, and "AS2 Encode" action selected.](./media/logic-apps-enterprise-integration-as2/select-as2-encode.png)

1. After the AS2 operation appears on the designer, provide information for the following properties:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Message to encode** | Yes | The message payload |
   | **AS2 from** | Yes | The business identifier for the message sender as specified by your AS2 agreement |
   | **AS2 to** | Yes | The business identifier for the message receiver as specified by your AS2 agreement |
   ||||

   For example, the message payload is the **Body** content output from the Request trigger:

   ![Screenshot showing the "AS2 Encode" action with the message encoding properties.](./media/logic-apps-enterprise-integration-as2/as2-message-encode-details.png)

   > [!TIP]
   > If you experience problems when sending signed or encrypted messages, consider trying different SHA256 algorithm formats. 
   > The AS2 specification doesn't provide any information about SHA256 formats, so each provider uses their own implementation or format.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your logic app resource and workflow in the designer.

1. On the designer, under the trigger or action where you want to add the AS2 action, select **Insert a new step** (plus sign), and then select **Add an action**.

1. Under the **Choose an operation** search box, select **Azure**. In the search box, enter `as2 encode`. Select the action named **Encode to AS2 message**.

   ![Screenshot showing the Azure portal, workflow designer, and "Encode to AS2 message" operation selected.](./media/logic-apps-enterprise-integration-as2/select-encode-as2-message.png)

1. When prompted to create a connection to your integration account, provide the following information:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Connection name** | Yes | A name for the connection |
   | **Integration account** | Yes | From the list of available integration accounts, select the account to use. |
   ||||

   For example:

   ![Screenshot showing the "Encode to AS2 message" connection pane.](./media/logic-apps-enterprise-integration-as2/create-as2-encode-connection-standard.png)

1. When you're done, select **Create**.

1. After the AS2 details pane appears on the designer, provide information for the following properties:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Message to encode** | Yes | The message payload |
   | **AS2 from** | Yes | The business identifier for the message sender as specified by your AS2 agreement |
   | **AS2 to** | Yes | The business identifier for the message receiver as specified by your AS2 agreement |
   ||||

   For example, the message payload is the **Body** content output from the Request trigger:

   ![Screenshot showing the "AS2 Encode" operation with the message encoding properties.](./media/logic-apps-enterprise-integration-as2/encode-as2-message-details.png)

   > [!TIP]
   > If you experience problems when sending signed or encrypted messages, consider trying different SHA256 algorithm formats. 
   > The AS2 specification doesn't provide any information about SHA256 formats, so each provider uses their own implementation or format.

---

<a name="decode"></a>

## Decode AS2 messages

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app resource and workflow in the designer.

1. On the designer, under the trigger or action where you want to add the AS2 action, select **New step**. This example uses the [Request](../connectors/connectors-native-reqres.md) trigger.

1. Under the **Choose an operation** search box, select **All**. In the search box, enter `as2 decode`. Select the action named **AS2 Decode**.

   ![Screenshot showing the Azure portal, workflow designer, and "AS2 Decode" operation selected.](media/logic-apps-enterprise-integration-as2/select-as2-decode.png)

1. In the AS2 operation shape, select the values for the **Message to encode** and the **Message headers** properties from the previous trigger or action outputs.

   In this example, you can select the outputs from the Request trigger.

   ![Screenshot showing the Azure portal, workflow designer, and "AS2 Decode" operation with the "Body" and "Headers" output selected from the Request trigger.](media/logic-apps-enterprise-integration-as2/as2-message-decode-details.png)

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your logic app resource and workflow in the designer.

1. On the designer, under the trigger or action where you want to add the AS2 action, select **Insert a new step** (plus sign), and then select **Add an action**.

1. Under the **Choose an operation** search box, select **Azure**. In the search box, enter `as2 decode`. Select the action named **Decode AS2 message**.

   ![Screenshot showing the Azure portal, workflow designer, and "Decode AS2 message" operation selected.](./media/logic-apps-enterprise-integration-as2/select-decode-as2-message.png)

1. When prompted to create a connection to your integration account, provide the following information:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Connection name** | Yes | A name for the connection |
   | **Integration account** | Yes | From the list of available integration accounts, select the account to use. |
   ||||

   For example:

   ![Screenshot showing the "Decode AS2 message" connection pane.](./media/logic-apps-enterprise-integration-as2/create-as2-decode-connection-standard.png)

1. When you're done, select **Create**.

1. In the AS2 details pane, select the values for the **Message to encode** and the **Message headers** properties from the previous trigger or action outputs.

   In this example, you can select the outputs from the Request trigger.

   ![Screenshot showing the Azure portal, workflow designer, and "Decode AS2 message" operation with the "Body" and "Headers" output selected from the Request trigger.](media/logic-apps-enterprise-integration-as2/decode-as2-message-details.png)

---

## Sample

To try deploying a fully operational logic app and sample AS2 (v2) scenario, review the [AS2 (v2) logic app template and scenario](https://azure.microsoft.com/resources/templates/logic-app-as2-send-receive/).

## Next steps

* Learn about other [connectors for Azure Logic Apps](../connectors/apis-list.md)
