---
title: Define Trading Partners for B2B Workflows
description: Add trading partners to your integration account to build B2B workflows in Azure Logic Apps.
services: azure-logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewers: estfan, azla
ms.topic: how-to
ms.update-cycle: 1095-days
ms.date: 03/13/2026
# Customer intent: As a B2B integration developer who works with Azure Logic Apps, I want to define trading partners who exchange messages in my workflows as artifacts in an integration account.
---

# Add trading partners to integration accounts for workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To represent your organization and others in business-to-business (B2B) enterprise integration workflows, create a *trading partner* in your *integration account* to represent each participant in a business relationship. Partners are business entities that participate in B2B transactions and exchange messages with each other.

> [!IMPORTANT]
>
> Before you define these partners, have a conversation with your partners about how to identify and validate the messages that you send 
> each other. To participate in an agreement and exchange messages with each other, partners in your integration account have to use the 
> same or compatible *business qualifiers*. After you agree on these details, you're ready to create partners in your integration account.

This guide shows how to create and manage partners, which you later use to create *agreements* that define the specific industry-standard protocol for exchanging messages between partners.

For more information, see:

- [B2B enterprise integration workflows with Azure Logic Apps](logic-apps-enterprise-integration-overview.md)
- [Create and manage integration accounts for B2B workflows](enterprise-integration/create-integration-account.md)
- [Add agreements between partners](logic-apps-enterprise-integration-agreements.md)

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

* An [integration account resource](logic-apps-enterprise-integration-create-integration-account.md) where you define and store artifacts, such as trading partners, agreements, certificates, and so on, for use in your enterprise integration and B2B workflows.

  This resource needs to meet the following requirements:

  * Use the same Azure subscription and location or Azure region as your logic app resource.

  * If you have a [Consumption logic app resource](logic-apps-overview.md#resource-environment-differences), your integration account requires a [link to your logic app resource](logic-apps-enterprise-integration-create-integration-account.md#link-account) before you can use artifacts in your workflow.

  * If you have a [Standard logic app resource](logic-apps-overview.md#resource-environment-differences), your integration account doesn't need a link to your logic app resource but is still required to store other artifacts, such as partners, agreements, and certificates, along with using the [AS2](logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), and [EDIFACT](logic-apps-enterprise-integration-edifact.md) operations. Your integration account still has to meet other requirements, such as using the same Azure subscription and existing in the same location as your logic app resource.

<a name="add-partner"></a>

## Add a partner

1. In the [Azure portal](https://portal.azure.com) search box, enter `integration accounts`, and select **Integration accounts**.

1. Under **Integration accounts**, select the integration account where you want to add your partners.

1. On the integration account menu, under **Settings**, select **Partners**.

1. On the **Partners** pane, select **Add**.

1. On the **Add Partner** pane, provide the following information about the partner:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Name** | Yes | The partner's name |
   | **Qualifier** | Yes | The authenticating body that provides unique business identities to organizations, for example, **D-U-N-S (Dun & Bradstreet)**. <p>Partners can opt for a mutually defined business identity. For these scenarios, select **Mutually Defined** for EDIFACT or **Mutually Defined (X12)** for X12. <p>For RosettaNet, select only **DUNS**, which is the standard. <p>**Important**: For partners in your integration account to participate in an agreement and exchange messages with each other, they have to use the same or compatible qualifier. |
   | **Value** | Yes | A value that identifies the documents that your logic apps receive. <p>For partners that use RosettaNet, this value must be a nine-digit number that corresponds to the DUNS number. You can provide more information for RosettaNet partners, such as their classification and contact information, by creating the partners first and then [editing their definitions afterwards](#edit-partner). |

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

1. When you're done, select **OK**.

<a name="delete-partner"></a>

## Delete a partner

1. In the [Azure portal](https://portal.azure.com), open your integration account.

1. On the integration account menu, under **Settings**, select **Partners**.

1. On the **Partners** pane, select the partner to delete, and then select **Delete**.

1. To confirm that you want to delete the partner, select **Yes**.

## Related content

* [Add agreements between partners](logic-apps-enterprise-integration-agreements.md)
