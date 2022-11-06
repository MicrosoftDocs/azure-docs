---
title: Exchange RosettaNet messages
description: Exchange RosettaNet messages for B2B enterprise integration using Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 11/03/2022
#Customer intent: As a logic apps developer, I want to send and receive RosettaNet messages using workflows in Azure Logic Apps so that I can use a standardized process to share business information with partners.
---

# Exchange RosettaNet messages for B2B integration using workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

To send and receive RosettaNet messages in workflows that you create using Azure Logic Apps, you can use the RosettaNet connector, which provides actions that manage and support communication that follows RosettaNet standards. RosettaNet is a non-profit consortium that has established standard processes for sharing business information. These standards are commonly used for supply chain processes and are widespread in the semiconductor, electronics, and logistics industries. The RosettaNet consortium creates and maintains Partner Interface Processes (PIPs), which provide common business process definitions for all RosettaNet message exchanges. RosettaNet is based on XML and defines message guidelines, interfaces for business processes, and implementation frameworks for communication between companies. For more information, visit the [RosettaNet site](https://resources.gs1us.org).

The connector is based on the RosettaNet Implementation Framework (RNIF) version 2.0.01 and supports all PIPs defined by this version. RNIF is an open network application framework that enables business partners to collaboratively run RosettaNet PIPs. This framework defines the message structure, the need for acknowledgments, Multipurpose Internet Mail Extensions (MIME) encoding, and the digital signature. Communication with the partner can be synchronous or asynchronous. The connector provides the following capabilities:

* Receive or decode RosettaNet messages.
* Send or encode RosettaNet messages.
* Wait for the response and generation of Notification of Failure.

This how-to guide shows how to send and receive RosettaNet messages in workflows using Azure Logic Apps and the RosettaNet connector by completing the following tasks: 

* Add a PIP process configuration, if you don't have one already.
* Create a RosettaNet agreement.
* Add an action that receives or decodes RosettaNet messages.
* Add an action that sends or encodes RosettaNet messages.

## RosettaNet concepts

The following concepts and terms are unique to the RosettaNet specification and are important to know when you build RosettaNet-based integration workflows:

* **PIP**

  The RosettaNet organization creates and maintains PIPs, which provide common business process definitions for all RosettaNet message exchanges. Each PIP specification provides a document type definition (DTD) file and a message guideline document. The DTD file defines the service-content message structure. The message guideline document, which is a human-readable HTML file, specifies element-level constraints. Together, these files provide a complete definition of the business process.

   PIPs are categorized by a high-level business function, or cluster, and a subfunction, or segment. For example, "3A4" is the PIP for Purchase Order, while "3" is the Order Management function, and "3A" is the Quote & Order Entry subfunction. For more information, visit the [RosettaNet site](https://resources.gs1us.org).

* **Action**

  Part of a PIP, action messages are business messages that are exchanged between partners.

* **Signal**

   Part of a PIP, signal messages are acknowledgments that are sent in response to action messages.

* **Single action and double action**

  For a single-action PIP, the only response is an acknowledgment signal message. For a double-action PIP, the initiator receives a response message and replies with an acknowledgment in addition to the single-action message flow.

## Connector technical reference

The RosettaNet connector is available only for Consumption logic app workflows.

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Consumption** | Multi-tenant Azure Logic Apps | **RosettaNet** managed connector (Standard class). The **RosettaNet** connector provides only actions, but you can use any trigger that works for your scenario. For more information, review [RosettaNet managed connector operations](#rosettanet-operations) <br>- [B2B protocol limits for message sizes](logic-apps-limits-and-config.md#b2b-protocol-limits) <br>- [Managed connectors in Azure Logic Apps](../connectors/managed.md) |
| **Consumption** | Integration service environment (ISE) | **AS2 (v2)** and **AS2** managed connectors (Standard class) and **AS2** ISE version, which has different message limits than the Standard class.  The **AS2 (v2)** connector provides only actions, but you can use any trigger that works for your scenario. For more information, review the following documentation: <br><br>- [AS2 managed connector reference](/connectors/as2/) <br>- [AS2 (v2) managed connector operations](#as2-v2-operations) <br>- [ISE message limits](logic-apps-limits-and-config.md#message-size-limits) <br>- [Managed connectors in Azure Logic Apps](../connectors/managed.md) |


## Prerequisites

* An Azure account and subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) for storing your agreement and other business-to-business (B2B) artifacts. This integration account must be associated with your Azure subscription.

* At least two [partners](../logic-apps/logic-apps-enterprise-integration-partners.md) that are defined in your integration account and configured with the **DUNS** qualifier under **Business Identities** in the Azure portal.

* Optional [certificates](../logic-apps/logic-apps-enterprise-integration-certificates.md) for encrypting, decrypting, or signing the messages that you upload to the integration account. Certificates are required only if you use signing or encryption.

<a name="add-pip"></a>

## Add PIP process configuration

To send or receive RosettaNet messages, your integration account requires a PIP process configuration, if you don't have one already. The process configuration stores all the PIP configuration characteristics. You can then reference this configuration when you create an agreement with a partner.

1. In the [Azure portal](https://portal.azure.com), go to your integration account.

1. On the integration account navigation menu, under **Settings**, select **RosettaNet PIP**.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/select-rosettanet-tile.png" alt-text="Screenshot of the Azure portal and the the integration account page. On the navigation menu, 'RosettaNet PIP' is selected.":::

1. Under **RosettaNet PIP**, select **Add**. Under **Add Partner Interface Process**, enter your PIP details.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/add-rosettanet-pip.png" alt-text="Screenshot of the 'RosettaNet PIP' page, with 'Add' selected. Under 'Add Partner Interface Process,' there are boxes for the name, code, and version.":::

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Name** | Yes | Your PIP name. |
   | **PIP Code** | Yes | The three-digit PIP code. For more information, see [RosettaNet PIPs](/biztalk/adapters-and-accelerators/accelerator-rosettanet/rosettanet-pips). |
   | **PIP Version** | Yes | The PIP version number, which depends on your selected PIP code. |

   For more information about these PIP properties, visit the [RosettaNet website](https://resources.gs1us.org/RosettaNet-Standards/Standards-Library/PIP-Directory#1043208-pipsreg).

1. When you're done, select **OK** to create the PIP configuration.

1. To view or edit the process configuration, select the PIP, and select **Edit as JSON**.

   All process configuration settings come from the PIP's specifications. Logic Apps populates most of the settings with the default values that are the most typically used values for these properties.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/edit-rosettanet-pip.png" alt-text="Screenshot of the RosettaNet PIP page, with 'Edit as JSON' and a PIP selected. Under 'Edit as JSON,' encoded PIP properties are visible.":::

1. Confirm that the settings correspond to the values in the appropriate PIP specification and meet your business needs. If necessary, update the values in JSON and save those changes.

## Create RosettaNet agreement

1. In the [Azure portal](https://portal.azure.com), go to your integration account.

1. On the integration account navigation menu, under **Settings**, select **Agreements**.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/select-agreement-tile.png" alt-text="Screenshot of an integration account page in the Azure portal. On the navigation menu, 'Agreements' is selected.":::

1. Under **Agreements**, select **Add**. Under **Add**, enter your agreement details.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/add-agreement-details.png" alt-text="Screenshot of the 'Agreements' page, with 'Add' selected. Under 'Add,' there are boxes for the agreement name and type and for partner information.":::

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Name** | Yes | The name of the agreement. |
   | **Agreement type** | Yes | The type of the agreement. Select **RosettaNet**. |
   | **Host Partner** | Yes | The organization that configures the agreement. An agreement requires both a host and guest partner. |
   | **Host Identity** | Yes | An identifier for the host partner. |
   | **Guest Partner** | Yes | The organization that's doing business with the host partner. An agreement requires both a host and guest partner. |
   | **Guest Identity** | Yes | An identifier for the guest partner. |
   | **Receive Settings** | Varies | Properties that apply to all messages received by the host partner. |
   | **Send Settings** | Varies | Properties that apply to all messages sent by the host partner. |  
   | **RosettaNet PIP references** | Yes | The PIP references for the agreement. All RosettaNet messages require PIP configurations. |
   ||||

1. To set up your agreement for receiving incoming messages from the guest partner, select **Receive Settings**.

   1. To enable signing or encryption for incoming messages, under **Message**, select **Message should be signed** or **Message should be encrypted**, respectively.

      | Property | Required | Description |
      |----------|----------|-------------|
      | **Message should be signed** | No | The option to sign incoming messages with the selected certificate |
      | **Certificate** | Yes, if signing is enabled | The certificate to use for signing |
      | **Enable message encryption** | No | The option to encrypt incoming messages with the selected certificate |
      | **Certificate** | Yes, if encryption is enabled | The certificate to use for encryption |
      ||||

   1. Under each selection, select the [certificate](./logic-apps-enterprise-integration-certificates.md) in your integration account that you want to use for signing or encryption.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/add-agreement-receive-details.png" alt-text="Screenshot of the 'Receive Settings' page, with options for signing and encrypting messages and entering certificates.":::

1. To set up your agreement for sending messages to the guest partner, select **Send Settings**.

   1. To enable signing or encryption for outgoing messages, under **Messages**, select **Enable message signing** or **Enable message encryption**, respectively. Under each selection, select the algorithm and [certificate](./logic-apps-enterprise-integration-certificates.md) in your integration account that you want to use for signing or encryption.

      | Property | Required | Description |
      |----------|----------|-------------|
      | **Enable message signing** | No | The option to sign outgoing messages with the selected signing algorithm and certificate |
      | **Signing Algorithm** | Yes, if signing is enabled | The signing algorithm to use, based on the selected certificate |
      | **Certificate** | Yes, if signing is enabled | The certificate to use for signing |
      | **Enable message encryption** | No | The option to encrypt outgoing messages with the selected encryption algorithm and certificate |
      | **Encryption Algorithm** | Yes, if encryption is enabled | The encryption algorithm to use, based on the selected certificate |
      | **Certificate** | Yes, if encryption is enabled | The certificate to use for encryption |
      ||||

   1. Under **Endpoints**, specify the required URLs to use for sending action messages and acknowledgments.

      | Property | Required | Description |
      |----------|----------|-------------|
      | **Action URL** |  Yes | The URL to use for sending action messages. The URL is a required field for both synchronous and asynchronous messages. |
      | **Acknowledgment URL** | Yes | The URL to use for sending acknowledgment messages. The URL is a required field for asynchronous messages. |
      ||||

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/add-agreement-send-details.png" alt-text="Screenshot of the 'Send Settings' page, with options for signing and encrypting messages and for entering algorithms, certificates, and endpoints.":::

1. To set up your agreement with the RosettaNet PIP references for partners, select **RosettaNet PIP references**. Under **PIP Name**, select the name of the PIP that you created earlier.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/add-agreement-pip-details.png" alt-text="Screenshot that shows a table of PIP information that has one row. That row contains default values except the name, 'MyPIPConfig,' which is selected.":::

   Your selection populates the remaining properties, which are based on the PIP that you set up in your integration account. If necessary, you can change the **PIP Role**.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/add-agreement-selected-pip.png" alt-text="Screenshot that shows a table of PIP information. A row for the PIP called 'MyPIPConfig' contains accurate information.":::

After you complete these steps, you're ready to send or receive RosettaNet messages.

## RosettaNet templates

To accelerate development and recommend integration patterns, you can use logic app templates for decoding and encoding RosettaNet messages. When you create a logic app workflow, you can select from the template gallery in the designer. You can also find these templates in the [GitHub repository for Azure Logic Apps](https://github.com/Azure/logicapps).

:::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/decode-encode-rosettanet-templates.png" alt-text="Screenshot of the designer. The 'Enterprise Integration' category and templates for decoding and encoding RosettaNet messages are selected.":::

## Receive or decode RosettaNet messages

1. [Create a blank logic app workflow](quickstart-create-first-logic-app-workflow.md).

1. [Link your integration account](logic-apps-enterprise-integration-create-integration-account.md#link-account) to your logic app resource.

1. Before you can add an action to decode the RosettaNet message, you must add a trigger for starting your logic app workflow, such as a request trigger.

1. After you add the trigger, select **New step**.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/request-trigger.png" alt-text="Screenshot of the designer. Under an HTTP action, 'New step' is selected.":::

1. In the search box, enter **rosettanet**, and then select the action named **RosettaNet Decode**.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/select-decode-rosettanet-action.png" alt-text="Screenshot of the designer. Under 'Choose an operation,' the search box contains 'rosettanet,' and the RosettaNet Decode action is selected.":::

1. Enter the information for the action's properties:

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/decode-action-details.png" alt-text="Screenshot of the designer. In the RosettaNet Decode action, boxes are available for the message, the headers, and the role.":::

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Message** | Yes | The RosettaNet message to decode  |
   | **Headers** | Yes | The HTTP headers that provide the values for the version, which is the RNIF version, and the response type, which indicates the communication type between the partners and can be synchronous or asynchronous |
   | **Role** | Yes | The role of the host partner in the PIP |
   ||||

   The output of the RosettaNet Decode action includes **Outbound signal**. You can encode this output and return it to the partner, or you can take any other action on this output.

## Send or encode RosettaNet messages

1. [Create a blank logic app workflow](quickstart-create-first-logic-app-workflow.md).

1. [Link your integration account](logic-apps-enterprise-integration-create-integration-account.md#link-account) to your logic app resource.

1. Before you can add an action to encode the RosettaNet message, you must add a trigger for starting your logic app workflow, such as a request trigger.

1. After you add the trigger, select **New step**.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/request-trigger.png" alt-text="Screenshot of the designer. Under an HTTP action that's a request trigger, 'New step' is selected.":::

1. In the search box, enter **rosettanet**, and select the action named **RosettaNet Encode**.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/select-encode-rosettanet-action.png" alt-text="Screenshot of the designer. Under 'Choose an operation,' the search box contains 'rosettanet,' and the RosettaNet Encode action is selected.":::

1. Enter the information for the action's properties:

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/encode-action-details.png" alt-text="Screenshot of a RosettaNet Encode action in the designer with boxes for the message, the partners, PIP information, the message type, and the role.":::

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Message** | Yes | The RosettaNet message to encode  |
   | **Host partner** | Yes | The host partner name |
   | **Guest partner** | Yes | The guest partner name |
   | **PIP code** | Yes | The PIP code |
   | **PIP version** | Yes | The PIP version |  
   | **PIP instance identity** | Yes | The unique identifier for this PIP message |  
   | **Message type** | Yes | The type of the message to encode |  
   | **Role** | Yes | The role of the host partner |
   ||||

   The encoded message is now ready to send to the partner.

1. To send the encoded message, the following example uses the **HTTP** action, which is renamed "HTTP - Send encoded message to partner."

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/send-rosettanet-message-to-partner.png" alt-text="Screenshot of an HTTP action in the designer that's titled 'HTTP - Send encoded message to partner.' URI, header, and body values are filled in.":::

   According to RosettaNet standards, business transactions are considered complete only when all the steps defined by the PIP are complete.

1. After the host sends the encoded message to a partner, the host waits for the signal and acknowledgment. To accomplish this task, add the **RosettaNet wait for response** action.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/rosettanet-wait-for-response-action.png" alt-text="Screenshot of a RosettaNet wait for response action in the designer with boxes for the body, PIP instance identity, retry count, and role.":::

   The duration to use for waiting and the number of retries are based on the PIP configuration in your integration account. If the response isn't received, a Notification of Failure is generated. To handle retries, always put the **Encode** and **Wait for response** actions in an **Until** loop.

   :::image type="content" source="media/logic-apps-enterprise-integration-rosettanet/rosettanet-loop.png" alt-text="Screenshot of the designer. An until loop contains actions for encoding and sending messages and for waiting for responses.":::

## Next steps

* Learn how to validate and transform messages, and learn about other message operations with the [Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md).
* Learn about other [Logic Apps connectors](../connectors/apis-list.md).
