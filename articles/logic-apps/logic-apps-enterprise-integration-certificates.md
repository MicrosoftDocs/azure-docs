---
title: Add Certificates to Secure B2B Messages in Workflows
description: Add certificates to secure business-to-business (B2B) messages in workflows for Azure Logic Apps.
services: azure-logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewers: estfan, azla
ms.topic: how-to
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 04/10/2026
ms.custom: sfi-im6ge-nochange
# Customer intent: As an integration developer who works with Azure Logic Apps, I want to improve security for B2B messages by adding certificates to use in my workflows.
---

# Add certificates to secure B2B messages in workflows for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Business-to-business (B2B) integrations often exchange messages with sensitive data such as purchase orders, invoices, and trading partner agreements. Without proper encryption and signing, these messages are vulnerable to tampering and impersonation. To address this risk, you can add security *certificates* for B2B actions to use in your workflows. Certificates are digital documents that perform the following tasks:

- Validate the partner identities in message exchanges.
- Encrypt or decrypt messages so only the intended partner can read them.
- Digitally sign messages so the receiver can verify the sender.

This guide shows how to add certificates and set up agreements to specify the certificates for B2B actions to use. For AS2 messages, the agreement settings control the certificates that AS2 actions automatically use. Your workflow actions don't have to do anything else to use certificates.

> [!NOTE]
>
> The AS2 pipeline handles security, certificates, and nonrepudiation, and the AS2 protocol requires encryption and digital signatures. For AS2 messages, you set up certificates at the agreement level. AS2 agreements have **Send Settings** and **Receive Settings** that expose certificate settings for this purpose. For more information, see [Reference for AS2 message settings in Azure Logic Apps](logic-apps-enterprise-integration-as2-message-settings.md).
>
> Other pipelines and protocols such as X12, EDIFACT, and RosettaNet handle security at other levels, for example, at the transport or adapter level. These agreements have **Send Settings** and **Receive Settings** that expose settings to define the message format, structure, and processing rules. EDI pipelines such as X12 and EDIFACT handle parsing, validation, and acknowledgments. For more information, see:
>
> - [Reference for EDIFACT message settings in Azure Logic Apps](logic-apps-enterprise-integration-edifact-message-settings.md)
> - [Reference for X12 message settings in Azure Logic Apps](logic-apps-enterprise-integration-x12-message-settings.md)
> - [Exchange RosettaNET messages in workflows with Azure Logic Apps](logic-apps-enterprise-integration-rosettanet.md)

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An [integration account resource](enterprise-integration/create-integration-account.md).

  You use this resource to define and store B2B artifacts for enterprise integration and B2B workflows.

  - Both your integration account and logic app resource must exist in the same Azure subscription and Azure region.

  - Your integration account needs to have the following B2B artifacts:

    - Two or more [trading partners](logic-apps-enterprise-integration-partners.md), usually your organization and at least one other organization.

    - An [agreement between these partners](logic-apps-enterprise-integration-agreements.md).

      - Each agreement requires a host partner and a guest partner. Usually, your organization is the host partner, while another organization is the guest partner.

      - Both partners must use the same or compatible *business identity* qualifier that's appropriate for the agreement type, for example, AS2.

- The certificates from your guest partner organizations and for your host partner organization. You can use the following certificates:

  | Type | Description |
  |------|-------------|
  | [Private or *self-signed* certificate](https://en.wikipedia.org/wiki/Self-signed_certificate) | A certificate (.pfx) file that you create to handle the following tasks for your organization: <br><br>- Decrypt the messages that your partner sends you. <br>- Digitally sign the messages that you send to your partner. <br><br>This certificate requires that you add a corresponding private key to a key vault in Azure for decrypting and signing your messages. For more information, continue reading for the relevant prerequisites. |
  | [Public certificate](https://en.wikipedia.org/wiki/Public_key_certificate) | A certificate (.cer) file to handle the following tasks for your guest partner: <br><br>- Encrypt the messages that you send to your partner. <br>- Validate the digital signature on the messages your partner sends to you. <br><br>You can purchase these certificates from a public internet [certificate authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority). Partner certificates don't require private keys, so you can use public-only certificates for this purpose. |

  For private certificates, complete the following requirements:

  1. In [Azure Key Vault](/azure/key-vault/general/overview), create a key vault resource, [add a private key](/azure/key-vault/certificates/certificate-scenarios#import-a-certificate), and get the key name.

  1. Authorize Azure Logic Apps to perform operations on your key vault.

     To grant access to the Azure Logic Apps service principal, use Azure role-based access control to manage access to your key vault. For more information, see [Provide access to Key Vault keys, certificates, and secrets with Azure role-based access control](/azure/key-vault/general/rbac-guide).

     > [!NOTE]
     >
     > If you use access policies with your key vault, consider [migrating to the Azure role-based access control permission model](/azure/key-vault/general/rbac-migration).
     >
     > If you receive the error **"Please authorize logic apps to perform operations on key vault by granting access for the logic apps service principal '7cd684f4-8a78-49b0-91ec-6a35d38739ba' for 'list', 'get', 'decrypt' and 'sign' operations."**, your certificate might not have the **Key Usage** property set to **Data Encipherment**. If so, you might need to recreate the certificate and set the **Key Usage** property to **Data Encipherment**.
     >
     > To check your certificate, open the certificate, select the **Details** tab, and review the **Key Usage** property.

  1. In your integration account, [add a public certificate](#add-public-certificate) that's associated with the private key in your key vault.

- The logic app resource and workflow where you want to use the certificate.

  - The workflow can start with any trigger that works best for your scenario.

  - [Link your integration account](enterprise-integration/create-integration-account.md#link-account) to your logic app resource.

    This link is required for Consumption logic apps, but optional for Standard logic apps. However, linking lets you share the same integration account and B2B artifacts across multiple Consumption and Standard logic apps.

  For more information, see:

  - [Create Consumption logic app workflows in the Azure portal](quickstart-create-example-consumption-workflow.md)
  - [Create Standard logic app workflows in the Azure portal](create-single-tenant-workflows-azure-portal.md)

<a name="add-private-certificate"></a>

## Add your private certificate

To add your organization's certificate to your integration account, follow these steps:

1. Confirm that you met the [prerequisites for private keys](#prerequisites), including adding the corresponding public certificate to your key vault.

1. In the [Azure portal](https://portal.azure.com) search box, enter `integration accounts`, and then select **Integration accounts**.

1. From the **Integration accounts** page, select the integration account where you want to add your certificate.

1. On the integration account sidebar, under **Settings**, select **Certificates**.

1. On the **Certificates** page toolbar, select **Add**.

1. On the **Add Certificate** pane, provide the following information:

   | Property | Required | Value | Description |
   | -------- | -------- | ----- | ----------- |
   | **Name** | Yes | <*certificate-name*> | The certificate name. |
   | **Certificate Type** | Yes | **Private** | The certificate type. |
   | **Certificate** | Yes | <*certificate-file-name*> | 1. Next to the **Certificate** box, select the folder icon. <br>2. Find and select the certificate (.pfx) file that's associated with the private key in your key vault, and then select **Open**. |
   | **Resource Group** | Yes | <*integration-account-resource-group*> | The integration account resource group. |
   | **Key Vault** | Yes | <*key-vault-name*> | The key vault name. |
   | **Key name** | Yes | <*key-name*> | The private key name. |

   The following example shows sample private certificate information:

   :::image type="content" source="media/logic-apps-enterprise-integration-certificates/private-certificate-details.png" alt-text="Screenshot shows the Azure portal, integration account, Certificates page toolbar with Add selected, and the Add Certificate pane with private certificate details.":::

1. When you finish, select **OK**.

   After Azure validates your selection, your certificate appears on the **Certificates** page, for example:

   :::image type="content" source="media/logic-apps-enterprise-integration-certificates/new-private-certificate.png" alt-text="Screenshot that shows the integration account and Certificates page with the private certificate.":::

<a name="add-public-certificate"></a>

## Add partner public certificate

To add your partner's public certificate to your integration account, follow these steps:

1. In the [Azure portal](https://portal.azure.com) search box, enter `integration accounts`, and then select **Integration accounts**.

1. From the **Integration accounts** page, select the integration account where you want to add your certificate.

1. On the integration account sidebar, under **Settings**, select **Certificates**.

1. On the **Certificates** page toolbar, select **Add**.

1. On the **Add Certificate** pane, provide the following information:

   | Property | Required | Value | Description |
   | -------- | -------- | ----- | ----------- |
   | **Name** | Yes | <*certificate-name*> | The certificate name. |
   | **Certificate Type** | Yes | **Public** | The certificate type. |
   | **Certificate** | Yes | <*certificate-file-name*> | 1. Next to the **Certificate** box, select the folder icon. <br>2. Find and select your partner's certificate (.cer) file, and then select **Open**. |

   The following example shows sample public certificate information:

   :::image type="content" source="media/logic-apps-enterprise-integration-certificates/public-certificate-details.png" alt-text="Screenshot shows the Azure portal, integration account, Certificates page toolbar with Add selected, and the Add Certificate pane with public certificate details.":::

1. When you finish, select **OK**.

   After Azure validates your selection, your certificate appears on the **Certificates** page, for example:

   :::image type="content" source="media/logic-apps-enterprise-integration-certificates/new-public-certificate.png" alt-text="Screenshot shows the integration account and the Certificates page with the public certificate.":::

## Set up certificates for AS2 agreements

After you add the certificates you want, AS2 agreements require that you manually specify the certificates to use in the agreement's [**Receive Settings** and **Send Settings** for signing and encrypting messages](logic-apps-enterprise-integration-as2-message-settings.md).

To complete this task, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your integration account.

1. On the integration account sidebar, under **Settings**, select **Agreements**.

1. On the **Agreements** page, select the AS2 agreement. On the **Agreements** page toolbar, select **Edit**.

1. On the **Edit** pane, select the following options and provide the required information, based on the capability you want to enable:

   | Settings pane | Description |
   |---------------|-------------|
   | **Receive Settings** | - **Message should be signed**: Select this option, and then select the certificate to validate your partner's signature on received messages. <br><br>- **Message should be encrypted**: Select this option, and then select the certificate for decrypting messages from your partner. |
   | **Send Settings** | - **Enable message signing**: Select this option, and then select the algorithm and certificate to sign the messages that you send. <br><br>- **Enable message encryption**: Select this option, and then select the algorithm and certificate for encrypting messages that you send. |

   For more information, see [Reference for AS2 message settings in Azure Logic Apps](logic-apps-enterprise-integration-as2-message-settings.md).

## Related content

- [Exchange AS2 messages in B2B workflows using Azure Logic Apps](logic-apps-enterprise-integration-as2.md)
- [Exchange EDIFACT messages in B2B workflows using Azure Logic Apps](logic-apps-enterprise-integration-edifact.md)
- [Exchange X12 messages in B2B workflows using Azure Logic Apps](logic-apps-enterprise-integration-x12.md)
- [Exchange RosettaNet messages in B2B workflows using Azure Logic Apps](logic-apps-enterprise-integration-rosettanet.md)
