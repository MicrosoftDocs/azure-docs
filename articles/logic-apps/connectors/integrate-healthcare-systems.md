---
title: Integrate Healthcare Systems with HL7 in Standard Workflows
description: Learn to create healthcare integration solutions using Health Level 7 (HL7) connector operations with Standard workflows in Azure Logic Apps.
ms.service: azure-logic-apps
author: haroldcampos
ms.author: hcampos
ms.topic: how-to
ms.date: 11/18/2025
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to create healthcare integrations using HL7 connector operations in Standard workflows.
---

# Build HL7 <!--and MLLP-->healthcare integrations with Standard workflows in Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To build automated integrations for healthcare systems or migrate from BizTalk Server to Azure Logic Apps, use the **HL7** <!--and **MLLP**--> built-in connector operations in Standard logic app workflows. This connector lets your healthcare organization continue to use their existing healthcare solutions and create new healthcare integrations in Azure Logic Apps. 

This guide shows how to use the **HL7** <!--and **MLLP**--> connector operations in Standard workflows. In this guide, the examples use the Azure portal, but you can create Standard workflows with these operations in [Visual Studio Code](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code).

## Healthcare integrations with Azure Logic Apps

Healthcare organizations are complex businesses with different departments that work together. For example, hospitals have areas like admissions, doctors, nursing stations, laboratories, and billing. Each area produces and uses various kinds of data. For example, this information includes patients, medical procedures, medications, and billing charges, which multiple departments must often share. Healthcare systems face major challenges in providing efficient ways for departments to exchange this data with each other.

The Health Level 7 (HL7) protocol v2.x family defines widely adopted messaging standards across clinical systems such as EHR, LIS, RIS, and HIS. The protocol facilitates communication by providing data exchange standards across healthcare apps. These standards eliminate or reduce custom interface programming and program maintenance. <!--The Minimal Lower Layer Protocol (MLLP) provides a lightweight TCP/IP framing and acknowledgment pattern (ACK/NACK) for transporting HL7 v2.x messages. Healthcare systems worldwide use MLLP as a transport protocol for HL7 v2.x messaging.-->

Despite modern standards such as Fast Healthcare Interoperability Resources (FHIR), HL7 v2.x continues to dominate in real-time clinical workflows, such as admission, discharge, and transfer (ADT), lab results handling, and billing processing, for the following key reasons:

| Reason | Description |
|--------|-------------|
| Interoperability backbone | HL7 v2.x is deeply embedded in existing clinical systems. <!--MLLP provides a simple, reliable framing mechanism over TCP/IP.--> |
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

<!--### [HL7](#tab/hl7)-->

The HL7 connector operations are available in all Standard workflows.

### Operations

| Operation | Type | Description | Parameters |
|-----------|------|-------------|------------|
| **Encode HL7** | Action | Convert XML to a flat file. | - **Message to encode**: The HL7 message to encode. Required, String <br>- **Header to encode**: The HL7 header to encode. Required, String |
| **Decode HL7** | Action | Convert a flat file to XML. | **Message to decode**: The HL7 message to decode. Required, String |

### Supported and unsupported behaviors

| Support level | Behavior |
|---------------|----------|
| Supported | - v2.X message handling with validation up to v2.6 and BizTalk schema releases up to v2.6. <br>- Individual message processing. <br>- Acknowledgment parsing for versions 2.4, 2.5, and 2.6. <br>- Only need to upload message schema. <br>- Z segments support requires updating schema with Z segments node. |
| Unsupported | - Batch messages processing. <br>- ACK generation and ACK support for versions lower than 2.4. <br>- MSH overrides and partner specific configuration. <br>- Z segments support without schema updates. Dynamic discovery isn't supported. |

<!--### [MLLP](#tab/mllp)

| Operation | Type | Description | Parameters |
|-----------|------|-------------|------------|
| **Receive message** | Trigger | Waits to receive an HL7 message. | None |
| **Send message** | Action | Send an HL7 message. | **Input message**: The HL7 message to send. Required, String |

---
-->

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Access to the healthcare system that you want to integrate.

- An [integration account resource](/azure/logic-apps/enterprise-integration/create-integration-account) to define and store artifacts for use with enterprise integrations and B2B workflows.

  - Both your integration account and logic app resource must exist in the same Azure subscription and Azure region.

  - Before you start working with HL7 or MLLP operations, you must [link your Standard logic app to your integration account](/azure/logic-apps/enterprise-integration/create-integration-account?tabs=standard#link-account).

<!--### [HL7](#tab/hl7)-->

- HL7 flat file schema and all the BizTalk schemas referenced by your HL7 schema.

  You must [upload all these schemas to your integration account](/azure/logic-apps/logic-apps-enterprise-integration-schemas?tabs=standard#add-schema-to-integration-account). However, unlike BizTalk Server, you don't need to upload the following common schemas:

  - Message headers: *MSH_25_GLO_DEF.xsd*
  - Acknowledgments: *ACK_24_GLO_DEF.xsd* and *ACK_25_GLO_DEF.xsd*

  The following example shows the *ADT_A01_231_GLO_DEF.xsd* schema and the following dependencies:

  - *datatypes_21.xsd*
  - *segments_21.xsd*
  - *tablevalues_21.xsd*

  :::image type="content" source="media/integrate-healthcare-systems/integration-schemas.png" alt-text="Screenshot shows integration account with HL7 schemas." lightbox="media/integrate-healthcare-systems/integration-schemas.png"::: 

- A Standard logic app resource and workflow to use for your healthcare integration. See [Create Standard logic app workflows in Azure Logic Apps](/azure/logic-apps/create-single-tenant-workflows-azure-portal).

  The HL7 connector doesn't have triggers, so you can use any trigger that works for your scenario. <!--For example, you can use the **MLLP** trigger named **Receive message**. To use this trigger, you need a blank workflow.-->
  
  This guide uses the **Request** trigger named **When an HTTP request is received**. You can then add HL7 connector actions.

<!--### [MLLP](#tab/mllp)

- A Standard logic app resource that uses the hybrid deployment option.

  - MLLP is a raw TCP protocol and not HTTP-based, so MLLP connector operations are available only for Standard workflows created with the hybrid deployment.

  - To use the **MLLP** trigger named **Receive message**, you need an empty workflow.

  - On your logic app, you need to open custom TCP/IP ports to exchange MLLP messages. Azure Logic Apps requires these ports and acts as a listener on the configured port.
  
    To open these ports, follow these steps:

    1. On your logic app sidebar, under **Settings**, select **Ingress**.

    1. On the **Ingress** page, select **Ingress**.

    1. Find and expand the **Additional TCP ports** section.

    1. For each port that handles MLLP messages, specify the **Target port** value and the **Ingress traffic** type.

    For more information, see [Control inbound traffic to your logic app](/azure/logic-apps/create-standard-workflows-hybrid-deployment?tabs=azure-portal).

---
-->

## Limitations

In this release, the following limitations apply:

<!--### [HL7](#tab/hl7)
-->
- The HL7 connector requires that you upload your schemas to an integration account.

- This implementation supports only single message processing.

<!--### [MLLP](#tab/mllp)

The **Receive message** trigger is available only in Standard logic app workflows created with hybrid deployment option.

---
-->

<a name="encode-hl7"></a>

## Add an Encode HL7 action

Follow these steps to add the **Encode HL7** action and set up the necessary parameters:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open your workflow in the designer.

1. If your workflow doesn't have a trigger, follow the [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-trigger) to add the trigger that best suits your scenario.

   This example continues with the **Request** trigger named **When an HTTP request is received**, for example:

   :::image type="content" source="media/integrate-healthcare-systems/request-trigger.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and Request trigger." lightbox="media/integrate-healthcare-systems/request-trigger.png":::

1. Follow the [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-action) to add the **HL7** built-in connector action named **Encode HL7**.

1. On the designer, select the added action, if not selected. In the action pane, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Message to encode** | Yes | <*message-to-encode*> | The HL7 message content to encode. |
   | **Header to encode** | Yes | <*header-to-encode*> | The HL7 message header to encode. |

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/encode-hl7.png" alt-text="Screenshot shows Encode HL7 action parameters." lightbox="media/integrate-healthcare-systems/encode-hl7.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

<a name="decode-hl7"></a>

## Add a Decode HL7 action

Follow these steps to add the **Decode HL7** action and set up the necessary parameters:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open your workflow in the designer.

1. If your workflow doesn't have a trigger, follow the [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-trigger) to add the trigger that best suits your scenario.

   This example continues with the **Request** trigger named **When an HTTP request is received**, for example:

   :::image type="content" source="media/integrate-healthcare-systems/request-trigger.png" alt-text="Screenshot shows the Azure portal, Standard workflow designer, and Request trigger." lightbox="media/integrate-healthcare-systems/request-trigger.png":::

1. Follow the [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-action) to add the **HL7** built-in connector action named **Decode HL7**.

1. On the designer, select the added action, if not selected. In the action pane, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Message to decode** | Yes | <*message-to-decode*> | The HL7 message content to decode. |

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/decode-hl7.png" alt-text="Screenshot shows the Decode HL7 action parameters." lightbox="media/integrate-healthcare-systems/decode-hl7.png":::

1. Save your workflow. On the designer toolbar, select **Save**.

<!--<a name="receive-message-mllp"></a>

## Add a Receive message trigger for MLLP

Follow these steps to add the **Receive message** trigger only for Standard logic app workflows that use the hybrid deployment:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open your blank workflow in the designer.

1. Follow the [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger) to add the **MLLP** built-in trigger named **Receive message**.

1. On the designer, select the added trigger, if not selected. In the connection pane, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | The name to use for the connection. |
   | **Host** | Yes | <*mllp-host*> | The MLLP host. |
   | **Port** | Yes | <*mllp-port*> | The MLLP TCP/IP port. |

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/connection-mllp-trigger.png" alt-text="Screenshot shows Standard workflow designer and connection pane for MLLP trigger." lightbox="media/integrate-healthcare-systems/connection-mllp-trigger.png":::

1. When you're done, select **Create new**.

1. Save your workflow. On the designer toolbar, select **Save**.

<a name="add-action"></a>

## Add a Send message action for MLLP

Follow these steps to add the **Send message** action and set up the necessary parameters:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open your workflow in the designer.

1. If you workflow doesn't have a trigger, follow the [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-trigger) to add the trigger that best suits your scenario.

   This example continues with the **Request** trigger named **When an HTTP request is received**, for example:

   :::image type="content" source="media/integrate-healthcare-systems/request-trigger.png" alt-text="Screenshot shows the Azure portal, Standard workflow, designer, and Request trigger." lightbox="media/integrate-healthcare-systems/request-trigger.png":::

1. Follow the [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action) to add the **MLLP** built-in action named **Send message**.

1. On the designer, select the added action, if not selected. In the connection pane, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | The name to use for the connection. |
   | **Host** | Yes | <*mllp-host*> | The MLLP host. |
   | **Port** | Yes | <*mllp-port*> | The MLLP TCP/IP port. |

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/connection-mllp-action.png" alt-text="Screenshot shows Standard workflow designer and connection pane for MLLP action." lightbox="media/integrate-healthcare-systems/connection-mllp-action.png":::

1. When you're done, select **Create new**.

1. On the designer, select the added action, if not selected. In the action pane, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Input message** | Yes | <*input-message*> | The HL7 message to send. |

   For example:

   :::image type="content" source="media/integrate-healthcare-systems/mllp-send-message.png" alt-text="Screenshot shows Send message for MLLP parameters." lightbox="media/integrate-healthcare-systems/mllp-send-message.png":::

1. Save your workflow. On the designer toolbar, select **Save**.
-->

## BizTalk migration notes

Since the first BizTalk Server release, Microsoft provides support for healthcare scenarios. BizTalk Server helps organizations develop business processes across healthcare computer systems by using Microsoft BizTalk Accelerator for HL7 (BTAHL7), the HL7 standard, and the Minimal Lower Layer Protocol (MLLP) for messaging.

BizTalk Server uses a disassembler pipeline to split HL7 messages into header, body, and custom segments. Azure Logic Apps exposes these messages as fixed outputs. This behavior simplifies HL7 message handling by avoiding multipart message complexity unless the number of parts varies.

The following table compares BizTalk Server with Standard logic app workflows in single-tenant Azure Logic Apps:

| Aspect | BizTalk Server | Standard workflows |
|--------|----------------|--------------------|
| Pipeline disassembly | Separates header, body, and custom segments. | Action outputs directly provide structured values. |
| Schemas | HL7 schemas + global header or ACK schemas uploaded. | Upload HL7 message schemas and dependencies. Doesn't require header or ACK common schemas. |
| ACK handling | Generation and parsing through pipeline components. | Parsing for HL7 ACK/NACK (2.4–2.6). Generation isn't supported. |
| Z segments | Supported through schema customization. | Supported when Z segments exist in uploaded schema, but without dynamic discovery. |

## Related content

- [Create Standard logic app workflows in Azure Logic Apps](/azure/logic-apps/create-single-tenant-workflows-azure-portal)
- [Create Standard logic app workflows for hybrid deployment on your own infrastructure](/azure/logic-apps/create-standard-workflows-hybrid-deployment)
