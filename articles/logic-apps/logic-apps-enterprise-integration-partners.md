---
title: Define trading partners for workflows
description: Add trading partners to your integration account for workflows in Azure Logic Apps using the Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 09/16/2021
---

# Add trading partners to integration accounts for workflows in Azure Logic Apps

To represent your organization and others in business-to-business (B2B) enterprise integration workflows, create each participant in a business relationship as a *trading partner* in your [integration account](logic-apps-enterprise-integration-create-integration-account.md). Partners are business entities that participate in B2B transactions and can exchange messages with each other.

> [!IMPORTANT]
> Before your define these partners, have a conversation with your partners about how to identify and validate the messages 
> that you send each other. After you agree on these details, you're ready to create partners in your integration account.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An [integration account resource](logic-apps-enterprise-integration-create-integration-account.md) where you define and store artifacts, such as trading partners, agreements, certificates, and so on, for use in your enterprise integration and B2B workflows. This resource has to meet the following requirements:

  * Is associated with the same Azure subscription as your logic app resource.

  * Exists in the same location or Azure region as your logic app resource.

  * If you're using the [**Logic App (Consumption)** resource type](logic-apps-overview.md#resource-type-and-host-environment-differences), your integration account requires a [link to your logic app resource](logic-apps-enterprise-integration-create-integration-account.md#link-account) before you can use artifacts in your workflow.

  * If you're using the [**Logic App (Standard)** resource type](logic-apps-overview.md#resource-type-and-host-environment-differences), your integration account doesn't need a link to your logic app resource but is still required to store other artifacts, such as partners, agreements, and certificates, along with using the [AS2](logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), [EDIFACT](logic-apps-enterprise-integration-edifact.md), and [RosettaNet](logic-apps-enterprise-integration-rosettanet.md) operations. Your integration account still has to meet other requirements, such as using the same Azure subscription and existing in the same location as your logic app.

## Add a partner

1. In the [Azure portal](https://portal.azure.com) search box, enter `integration accounts`, and select **Integration accounts**.

1. Under **Integration accounts**, select the integration account where you want to add your partners.

1. On the integration account menu, under **Settings**, select **Partners**.

1. On the **Partners** pane, select **Add**.

1. On the **Add Partner** pane, provide information about the partner as described in the following table:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Name** | Yes | The partner's name |
   | **Qualifier** | Yes | The authenticating body that provides unique business identities to organizations, for example, **D-U-N-S (Dun & Bradstreet)**. <p>Partners can opt for a mutually defined business identity. For these scenarios, select **Mutually Defined** for EDIFACT or **Mutually Defined (X12)** for X12. <p>For RosettaNet, select only **DUNS**, which is the standard. |
   | **Value** | Yes | A value that identifies the documents that your logic apps receive. <p>For RosettaNet, this value must be a nine-digit number that corresponds to the DUNS number. |
   ||||

   > [!NOTE]
   > For partners that use RosettaNet, you can provide more information, such as partner classification and contact information, by creating these partners first and then [editing them afterwards](#edit-partner).

1. When you're done, select **OK**.

   Your partner now appears on the **Partners** list.

<a name="edit-partner"></a>

## Edit a partner

1. In the [Azure portal](https://portal.azure.com), open your integration account.

1. On the integration account menu, under **Settings**, select **Partners**.

1. On the **Partners** pane, select the partner, select **Edit**, and make your changes.

   For partners that use RosettaNet, under **RosettaNet Partner Properties**, you can provide more information as described in the following table:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Partner Classification** | No | The partner's organization type |
   | **Supply chain code** | No | The partner's supply chain code, for example, "Information Technology" or "Electronic Components" |
   | **Contact Name** | No | The partner's contact name |
   | **Email** | No | The partner's email address |
   | **Fax** | No | The partner's fax number |
   | **Telephone** | No | The partner's phone number |
   ||||

1. When you're done, select **OK**.

## Delete a partner

1. In the [Azure portal](https://portal.azure.com), open your integration account.

1. On the integration account menu, under **Settings**, select **Partners**.

1. On the **Partners** pane, select the partner to delete, and then select **Delete**.

## Next steps

* [Add agreements between partners](logic-apps-enterprise-integration-agreements.md)