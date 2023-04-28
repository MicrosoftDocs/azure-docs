---
title: Define agreements between partners in workflows
description: Add agreements between partners in your integration account for workflows in Azure Logic Apps using the Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/23/2022
---

# Add agreements between partners in integration accounts for workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

After you add partners to your integration account, specify how partners exchange messages by defining [*agreements*](logic-apps-enterprise-integration-agreements.md) in your integration account. Agreements help organizations communicate seamlessly with each other by defining the specific industry-standard protocol for exchanging messages and by providing the following shared benefits:

* Enable organizations to exchange information by using a well-known format.

* Improve efficiency when conducting business-to-business (B2B) transactions.

* Make creating, managing, and using agreements easy for building enterprise integration solutions.

An agreement requires a *host partner*, which is always your organization, and a *guest partner*, which is the organization that exchanges messages with your organization. The guest partner can be another company, or even a department in your own organization. Using this agreement, you specify how to handle inbound and outbound messages from the host partner's perspective.

This article shows how to create and manage an agreement, which you can then use to exchange B2B messages with another partner by using the AS2, X12, EDIFACT, or RosettaNet operations.

If you're new to logic apps, review [What is Azure Logic Apps](logic-apps-overview.md)? For more information about B2B enterprise integration, review [B2B enterprise integration workflows with Azure Logic Apps and Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md).

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An [integration account resource](logic-apps-enterprise-integration-create-integration-account.md) where you define and store artifacts, such as trading partners, agreements, certificates, and so on, for use in your enterprise integration and B2B workflows. This resource has to meet the following requirements:

  * Is associated with the same Azure subscription as your logic app resource.

  * Exists in the same location or Azure region as your logic app resource.

  * If you're using the [**Logic App (Consumption)** resource type](logic-apps-overview.md#resource-environment-differences), your integration account requires a [link to your logic app resource](logic-apps-enterprise-integration-create-integration-account.md#link-account) before you can use artifacts in your workflow.

  * If you're using the [**Logic App (Standard)** resource type](logic-apps-overview.md#resource-environment-differences), your integration account doesn't need a link to your logic app resource but is still required to store other artifacts, such as partners, agreements, and certificates, along with using the [AS2](logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), and [EDIFACT](logic-apps-enterprise-integration-edifact.md) operations. Your integration account still has to meet other requirements, such as using the same Azure subscription and existing in the same location as your logic app resource.

  > [!NOTE]
  > Currently, only the **Logic App (Consumption)** resource type supports [RosettaNet](logic-apps-enterprise-integration-rosettanet.md) operations. 
  > The **Logic App (Standard)** resource type doesn't include [RosettaNet](logic-apps-enterprise-integration-rosettanet.md) operations.

* At least two [trading partners](logic-apps-enterprise-integration-partners.md) in your integration account. An agreement requires a host partner and a guest partner. Also, an agreement requires that both partners use the same or compatible *business identity* qualifier that's appropriate for an AS2, X12, EDIFACT, or RosettaNet agreement.

* Optionally, the logic app resource and workflow where you want to use the agreement to exchange messages. The workflow requires any trigger that starts your logic app's workflow.

If you're new to logic apps, review [What is Azure Logic Apps](logic-apps-overview.md) and [Create an example Consumption logic app workflow](quickstart-create-example-consumption-workflow.md).

## Add an agreement

1. In the [Azure portal](https://portal.azure.com) search box, enter `integration accounts`, and select **Integration accounts**.

1. Under **Integration accounts**, select the integration account where you want to add your partners.

1. On the integration account menu, under **Settings**, select **Agreements**.

1. On the **Agreements** pane, select **Add**.

1. On the **Add** pane, provide the following information about the agreement:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Name** | Yes | <*agreement-name*> | The name for your agreement |
   | **Agreement type** | Yes | **AS2**, **X12**, **EDIFACT**, or **RosettaNet** | The protocol type for your agreement. When you create your agreement file, the content in that file must match the agreement type. |
   | **Host Partner** | Yes | <*host-partner-name*> | The host partner represents your organization |
   | **Host Identity** | Yes | <*host-partner-identifier*> | The host partner's identifier |
   | **Guest Partner** | Yes | <*guest-partner-name*> | The guest partner represents the organization that communicates with your organization |
   | **Guest Identity** | Yes | <*guest-partner-identifier*> | The guest partner's identifier |
   | **Receive Settings** | Varies | Varies | These properties specify how the host partner receives inbound messages from the guest partner in the agreement. For more information, review the respective agreement type: <p>- [AS2 message settings](logic-apps-enterprise-integration-as2-message-settings.md) <br>- [EDIFACT message settings](logic-apps-enterprise-integration-edifact.md) <br>- [X12 message settings](logic-apps-enterprise-integration-x12.md) |
   | **Send Settings** | Varies | Varies | These properties specify how the host partner sends outbound messages to the guest partner in the agreement. For more information, review the respective agreement type: <p>- [AS2 message settings](logic-apps-enterprise-integration-as2-message-settings.md) <br>- [EDIFACT message settings](logic-apps-enterprise-integration-edifact.md) <br>- [X12 message settings](logic-apps-enterprise-integration-x12.md) |
   | **RosettaNet PIP references** | Varies | Varies | This pane specifies information about one or more Partner Interface Processes (PIP) to use RosettaNet messages. For more information, review [Exchange RosettaNet messages](logic-apps-enterprise-integration-rosettanet.md). |
   |||||

   > [!IMPORTANT]
   > The resolution for an agreement depends on matching the following items that are defined in the partner and inbound message:
   >
   > * The sender's qualifier and identifier
   > * The receiver's qualifier and identifier
   >
   > If these values change for your partner, make sure that you update the agreement too.

1. When you're done, select **OK**.

   Your agreement now appears on the **Agreements** list.

## Edit an agreement

1. In the [Azure portal](https://portal.azure.com) search box, enter `integration accounts`, and select **Integration accounts**.

1. Under **Integration accounts**, select the integration account where you want to add your partners.

1. On the integration account menu, under **Settings**, select **Agreements**.

1. On the **Agreements** pane, select your agreement, select **Edit**, and make your changes.

1. When you're done, select **OK**.

## Delete an agreement

1. In the [Azure portal](https://portal.azure.com) search box, enter `integration accounts`, and select **Integration accounts**.

1. Under **Integration accounts**, select the integration account where you want to add your partners.

1. On the integration account menu, under **Settings**, select **Agreements**.

1. On the **Agreements** pane, select the agreement to delete, and then select **Delete**.

1. To confirm that you want to delete the agreement, select **Yes**.

## Next steps

* [Exchange AS2 messages](logic-apps-enterprise-integration-as2.md)
* [Exchange EDIFACT messages](logic-apps-enterprise-integration-edifact.md)
* [Exchange X12 messages](logic-apps-enterprise-integration-x12.md)
* [Exchange RosettaNet messages](logic-apps-enterprise-integration-rosettanet.md)
