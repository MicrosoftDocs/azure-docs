---
title: Integrate Healthcare Systems with HL7 and MLLP in Standard Workflows
description: Create healthcare integration solutions using Health Level 7 (HL7) and Minimal Lower Layer Protocol (MLLP) connector operations with Standard workflows in Azure Logic Apps.
ms.service: azure-logic-apps
author: haroldcampos
ms.author: hcampos
ms.topic: how-to
ms.update-cycle: 365-days
ms.date: 09/16/2026
#Customer intent: As an automation and integration developer who works with Azure Logic Apps, I want to create healthcare integrations using HL7 and MLLP connector operations in Standard workflows.
---

# Build HL7 and MLLP healthcare integrations with Standard workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

To build automated integrations for healthcare systems or migrate from BizTalk Server to Azure Logic Apps, use the **HL7** and **MLLP** built-in connector operations in Standard logic app workflows. This connector lets your healthcare organization continue to use their existing healthcare solutions and create new healthcare integrations in Azure Logic Apps.

This guide shows how to use the **HL7** and **MLLP** connector operations in Standard workflows. In this guide, the examples use the Azure portal, but you can create Standard workflows with these operations in [Visual Studio Code](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code).

## Healthcare integrations with Azure Logic Apps

Healthcare organizations are complex businesses with different departments that work together. For example, hospitals have areas like admissions, doctors, nursing stations, laboratories, and billing. Each area produces and uses various kinds of data. For example, this information includes patients, medical procedures, medications, and billing charges, which multiple departments must often share. Healthcare systems face major challenges in providing efficient ways for departments to exchange this data with each other.

The Health Level 7 (HL7) protocol v2.x family defines widely adopted messaging standards across clinical systems such as EHR, LIS, RIS, and HIS. The protocol facilitates communication by providing data exchange standards across healthcare apps. These standards eliminate or reduce custom interface programming and program maintenance. The Minimal Lower Layer Protocol (MLLP) provides a lightweight TCP/IP framing and acknowledgment pattern (ACK/NACK) for transporting HL7 v2.x messages. Healthcare systems worldwide use MLLP as a transport protocol for HL7 v2.x messaging.

Despite modern standards such as Fast Healthcare Interoperability Resources (FHIR), HL7 v2.x continues to dominate in real-time clinical workflows, such as admission, discharge, and transfer (ADT), lab results handling, and billing processing, for the following key reasons:

| Reason | Description |
| --- | --- |
| Interoperability backbone | HL7 v2.x is deeply embedded in existing clinical systems. MLLP provides a simple, reliable framing mechanism over TCP/IP. |
| Acknowledgment support | ACK/NACK patterns help ensure delivery confirmation critical for patient safety and auditability. |
| Low complexity | Text-based, predictable segments simplify development and maintenance versus more complex service-based protocols. |

Common HL7 message types include:

:::image type="content" source="media/integrate-healthcare-systems/hl7-messages.png" alt-text="Conceptual diagram shows common HL7 message types such as ADT, ORM, ORU, EFT, and EPR." lightbox="media/integrate-healthcare-systems/hl7-messages.png":::

- ADT: Admission, discharge, and transfer
- EPR: Electronic patient record
- ORM: General order message
- ORU: Unsolicited observation results
- DFT: Detailed financial transaction

## Connector technical reference

### [HL7](#tab/hl7)

The HL7 connector operations are generally available and supported in all Standard workflows.

### Operations

| Operation | Type | Description | Parameters |
| --- | --- | --- | --- |
| **Encode HL7** | Action | Convert XML to a flat file. | - **Message to encode**: The HL7 message to encode. Required, String <br>- **Header to encode**: The HL7 header to encode. Required, String |
| **Decode HL7** | Action | Convert an individual or batch HL7 flat file to XML. | **Message to decode**: The individual or batch HL7 message to decode. Required, String |

### Supported and unsupported behaviors

| Support level | Behavior |
| --- | --- |
| Supported | - v2.X message handling with validation up to v2.6 and BizTalk schema releases up to v2.6. <br>- Individual message processing. <br>- Batch message decoding, also known as HL7 debatching. <br>- Acknowledgment parsing for versions 2.4, 2.5, and 2.6. <br>- Only need to upload message schema. <br>- Z segments support requires updating schema with Z segments node. |
| Unsupported | - ACK generation and ACK support for versions lower than 2.4. <br>- MSH overrides and partner specific configuration. <br>- Z segments support without schema updates. Dynamic discovery isn't supported. |

### [MLLP](#tab/mllp)

The MLLP connector operations are in public preview and subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

| Operation | Type | Description | Parameters |
| --- | --- | --- | --- |
| **Receive HL7 message from MLLP server** | Trigger | Waits to receive an HL7 message. For two-way communication, the trigger can keep the connection open while the workflow prepares a response. | **Two-way (Request-Response)**: Keep the connection open so the workflow can return a synchronous response on the same port. Optional, Boolean |
| **Send HL7 message to MLLP server** | Action | Send an HL7 message. | **HL7 message body**: The HL7 message to send. Required, String |
| **Send MLLP response** | Action | Send a synchronous response to the originating system on the same connection and port. | - **Correlation ID**: The correlation ID from the MLLP receive trigger. Required, String <br>- **Response message body**: The MLLP response message to send. Required, String |

---

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Access to the healthcare system that you want to integrate.

- An [integration account resource](/azure/logic-apps/enterprise-integration/create-integration-account) to define and store artifacts for use with enterprise integrations and B2B workflows.

  - Both your integration account and logic app resource must exist in the same Azure subscription and Azure region.

  - Before you start working with HL7 or MLLP operations, you must [link your Standard logic app to your integration account](/azure/logic-apps/enterprise-integration/create-integration-account?tabs=standard#link-account).

### [HL7](#tab/hl7)

- HL7 flat file schema and all the BizTalk schemas that your HL7 schema references.

  You must [upload all these schemas to your integration account](/azure/logic-apps/logic-apps-enterprise-integration-schemas?tabs=standard#add-schema-to-integration-account). However, unlike BizTalk Server, you don't need to upload the following common schemas:

  - Message headers: *MSH_25_GLO_DEF.xsd*
  - Acknowledgments: *ACK_24_GLO_DEF.xsd* and *ACK_25_GLO_DEF.xsd*

  The following example shows the *ADT_A01_231_GLO_DEF.xsd* schema and the following dependencies:

  - *datatypes_21.xsd*
  - *segments_21.xsd*
  - *tablevalues_21.xsd*

  :::image type="content" source="media/integrate-healthcare-systems/integration-schemas.png" alt-text="Screenshot that shows an integration account with HL7 schemas." lightbox="media/integrate-healthcare-systems/integration-schemas.png":::

- A Standard logic app resource and workflow to use for your healthcare integration. See [Create Standard logic app workflows in Azure Logic Apps](/azure/logic-apps/create-single-tenant-workflows-azure-portal).

  The HL7 connector doesn't have triggers, so you can use any trigger that works for your scenario. For example, you can use the **MLLP** trigger named **Receive HL7 message from MLLP server**. To use this trigger, you need a blank workflow.

  This guide uses the **Request** trigger named **When an HTTP request is received**. You can then add HL7 connector actions.

### [MLLP](#tab/mllp)

- A Standard logic app resource that uses the hybrid deployment option.

  - MLLP is a raw TCP protocol and not HTTP-based, so MLLP connector operations are available only for Standard workflows created with the hybrid deployment.

   - To use the **MLLP** trigger named **Receive HL7 message from MLLP server**, you need an empty workflow.

   - On your logic app, you need to open custom TCP/IP ports to exchange MLLP messages. Azure Logic Apps requires these ports and acts as a listener on the configured port.

    To open these ports, follow these steps:

    1. On your logic app sidebar, under **Settings**, select **Ingress**.

    1. On the **Ingress** page, select **Ingress**.

    1. Find and expand the **Additional TCP ports** section.

    1. For each port that handles MLLP messages, specify the **Target port** value and the **Ingress traffic** type.

    For more information, see [Control inbound traffic to your logic app](/azure/logic-apps/create-standard-workflows-hybrid-deployment?tabs=azure-portal).

---

## Limitations

In this release, the following limitations apply:

### [HL7](#tab/hl7)

- The HL7 connector requires that you upload your schemas to an integration account.

### [MLLP](#tab/mllp)

- The **Receive HL7 message from MLLP server** trigger is available only in Standard logic app workflows created with the hybrid deployment option.

- Two-way synchronous MLLP communication on the same connection and port is currently in public preview. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

---

<a name="encode-hl7"></a>

## Add an Encode HL7 action

Follow these steps to add the **Encode HL7** action and set up the necessary parameters:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open your workflow in the designer.

1. If your workflow doesn't have a trigger, follow the [general steps](/azure/logic-apps/add-trigger-action-workflow?tabs=standard#add-trigger) to add the trigger that best suits your scenario.

   This example continues with the **Request** trigger named **When an HTTP request is received**, for example:

   :::image type="content" source="media/integrate-healthcare-systems/request-trigger.png" alt-text="Screenshot that shows the Azure portal, Standard workflow designer, and Request trigger." lightbox="media/integrate-healthcare-systems/request-trigger.png":::

1. Follow the [general steps](/azure/logic-apps/add-trigger-action-workflow?tabs=standard#add-action) to add the **HL7** built-in connector action named **Encode HL7**.

1. On the designer, select the added action, if not selected. In the action pane, provide the following information:

   | Parameter | Required | Value | Description |
   | --- | --- | --- | --- |
   | **Message to encode** | Yes | <*message-to-encode*> | The HL7 message content to encode. |
   | **Header to encode** | Yes | <*header-to-encode*> | The HL7 message header to encode. |

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/encode-hl7.png" alt-text="Screenshot that shows the Encode HL7 action parameters." lightbox="media/integrate-healthcare-systems/encode-hl7.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

<a name="decode-hl7"></a>

## Add a Decode HL7 action

Follow these steps to add the **Decode HL7** action and set up the necessary parameters:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open your workflow in the designer.

1. If your workflow doesn't have a trigger, follow the [general steps](/azure/logic-apps/add-trigger-action-workflow?tabs=standard#add-trigger) to add the trigger that best suits your scenario.

   This example continues with the **Request** trigger named **When an HTTP request is received**, for example:

   :::image type="content" source="media/integrate-healthcare-systems/request-trigger.png" alt-text="Screenshot that shows the Azure portal, Standard workflow, and Request trigger." lightbox="media/integrate-healthcare-systems/request-trigger.png":::

1. Follow the [general steps](/azure/logic-apps/add-trigger-action-workflow?tabs=standard#add-action) to add the **HL7** built-in connector action named **Decode HL7**.

1. On the designer, select the added action, if not selected. In the action pane, provide the following information:

   | Parameter | Required | Value | Description |
   | --- | --- | --- | --- |
   | **Message to decode** | Yes | <*message-to-decode*> | The individual or batch HL7 message content to decode. |

   > [!NOTE]
   >
   > During parsing, unrecognized segments are generally used when the corresponding segment definition or node can't be resolved from the schema.

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/decode-hl7.png" alt-text="Screenshot that shows the Decode HL7 action parameters." lightbox="media/integrate-healthcare-systems/decode-hl7.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

<a name="receive-message-mllp"></a>

## Add a Receive HL7 message from MLLP server trigger

Follow these steps to add the **Receive HL7 message from MLLP server** trigger. You can add this trigger only to Standard logic app workflows that use the hybrid deployment:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open your blank workflow in the designer.

1. Follow the [general steps](/azure/logic-apps/add-trigger-action-workflow?tabs=standard#add-trigger) to add the **MLLP** built-in trigger named **Receive HL7 message from MLLP server**.

1. On the designer, select the trigger. In the connection pane, provide the following information:

   | Parameter | Required | Value | Description |
   | --- | --- | --- | --- |
   | **Connection Name** | Yes | <*connection-name*> | The name to use for the connection. |
   | **MLLP Server Host Name Or Address** | Yes | <*mllp-host*> | The MLLP host. |
   | **Port Number** | Yes | <*mllp-port*> | The MLLP TCP/IP port. |

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/connection-receive-message-mllp.png" alt-text="Screenshot that shows a Standard workflow and connection pane for the Receive HL7 message from MLLP server trigger." lightbox="media/integrate-healthcare-systems/connection-receive-message-mllp.png":::

1. When you're done, select **Create new**.

1. Save your workflow. On the designer toolbar, select **Save**.

### Receive and respond synchronously on the same port

To receive an MLLP message and synchronously return a response on the same connection and port, follow these steps:

1. On the designer, select the **Receive HL7 message from MLLP server** trigger.

1. On the **Parameters** tab, from the **Advanced parameters** list, select **Two-way (Request-Response)**.

   > [!NOTE]
   >
   > Two-way synchronous MLLP communication is currently in public preview and subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

1. Set **Two-way (Request-Response)** to **Yes**.

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/mllp-receive-two-way.png" alt-text="Screenshot that shows a Standard workflow, Receive HL7 message from MLLP server action, and Two-way (Request-Response) parameter." lightbox="media/integrate-healthcare-systems/mllp-receive-two-way.png":::

1. Add any actions needed to process the received message and prepare the response.

1. Follow the [general steps](/azure/logic-apps/add-trigger-action-workflow?tabs=standard#add-action) to add the **MLLP** built-in action named **Send MLLP response**.

1. On the **Parameters** tab, provide the following information:

   | Parameter | Required | Value | Description |
   | --- | --- | --- | --- |
   | **Correlation ID** | Yes | **Correlation ID** | From the dynamic content list, select the **Correlation ID** output from the MLLP receive trigger. This value identifies the connection where the response is sent. |
   | **Response message body** | Yes | <*response-message*> | The MLLP response message, such as an HL7 acknowledgment (ACK), to return to the originating system. |

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/mllp-send-two-way.png" alt-text="Screenshot that shows a Standard workflow and Send MLLP response action with the Correlation ID and Response message body parameters." lightbox="media/integrate-healthcare-systems/mllp-send-two-way.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

<a name="add-action"></a>

## Add a Send HL7 message to MLLP server action

Follow these steps to add the **Send HL7 message to MLLP server** action and set up the necessary parameters:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open your workflow in the designer.

1. If your workflow doesn't have a trigger, follow the [general steps](/azure/logic-apps/add-trigger-action-workflow?tabs=standard#add-trigger) to add the trigger that best suits your scenario.

   This example continues with the **Request** trigger named **When an HTTP request is received**, for example:

   :::image type="content" source="media/integrate-healthcare-systems/request-trigger.png" alt-text="Screenshot that shows the Azure portal, Standard workflow, and Request trigger." lightbox="media/integrate-healthcare-systems/request-trigger.png":::

1. Follow the [general steps](/azure/logic-apps/add-trigger-action-workflow?tabs=standard#add-action) to add the **MLLP** built-in action named **Send HL7 message to MLLP server**.

1. On the designer, select the action. In the connection pane, provide the following information:

   | Parameter | Required | Value | Description |
   | --- | --- | --- | --- |
   | **Connection Name** | Yes | <*connection-name*> | The name to use for the connection. |
   | **MLLP Server Host Name Or Address** | Yes | <*mllp-host*> | The MLLP host. |
   | **Port Number** | Yes | <*mllp-port*> | The MLLP TCP/IP port. |

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/connection-send-message-mllp.png" alt-text="Screenshot that shows a Standard workflow and connection pane for the Send HL7 message to MLLP server action." lightbox="media/integrate-healthcare-systems/connection-send-message-mllp.png":::

1. When you're done, select **Create new**.

1. On the designer, select the action. In the action pane, provide the following information:

   | Parameter | Required | Value | Description |
   | --- | --- | --- | --- |
   | **HL7 message body** | Yes | <*input-message*> | The HL7 message to send. |

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/mllp-send-message.png" alt-text="Screenshot that shows the Send HL7 message to MLLP server action parameters." lightbox="media/integrate-healthcare-systems/mllp-send-message.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

## BizTalk migration notes

Since the first BizTalk Server release, Microsoft provides support for healthcare scenarios. BizTalk Server helps organizations develop business processes across healthcare computer systems by using Microsoft BizTalk Accelerator for HL7 (BTAHL7), the HL7 standard, and the Minimal Lower Layer Protocol (MLLP) for messaging.

BizTalk Server uses a disassembler pipeline to split HL7 messages into header, body, and custom segments. Azure Logic Apps exposes these messages as fixed outputs. This behavior simplifies HL7 message handling by avoiding multipart message complexity unless the number of parts varies.

The following table compares BizTalk Server with Standard logic app workflows in single-tenant Azure Logic Apps:

| Aspect | BizTalk Server | Standard workflows |
| --- | --- | --- |
| Pipeline disassembly | Separates header, body, and custom segments. | Action outputs directly provide structured values. |
| Schemas | HL7 schemas plus global header or ACK schemas uploaded. | Upload HL7 message schemas and dependencies. Doesn't require header or ACK common schemas. |
| ACK handling | Generation and parsing through pipeline components. | Parsing for HL7 ACK/NACK (2.4–2.6). Generation isn't supported. |
| Z segments | Supported through schema customization. | Supported when Z segments exist in uploaded schema, but without dynamic discovery. |

## Related content

- [Create Standard logic app workflows in Azure Logic Apps](/azure/logic-apps/create-single-tenant-workflows-azure-portal)
- [Create Standard logic app workflows for hybrid deployment on your own infrastructure](/azure/logic-apps/create-standard-workflows-hybrid-deployment)
