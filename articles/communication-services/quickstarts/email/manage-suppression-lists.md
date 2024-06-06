---
title: Manage domain suppression lists in Azure Communication Services using the Azure portal
titleSuffix: An Azure Communication Services quick start guide.
description: Learn about managing domain suppression lists in Azure Communication Services using the Azure portal
author: matthohn-msft
manager: koagbakp
services: azure-communication-services
ms.author: matthohn
ms.date: 03/21/2024
ms.topic: quickstart
ms.service: azure-communication-services
---

# Quickstart: How to manage suppression lists for an Azure Communication Email Domain using the Azure portal

In this quick start, you learn how to manage suppression lists for an Azure Communication Email Domain using the Azure portal.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource ready to provision domains. [Get started creating an Email Communication Resource](./create-email-communication-resource.md).
- An [Azure Managed Domain](./add-azure-managed-domains.md) or [Custom Domain](./add-custom-verified-domains.md) provisioned and ready to send emails.

Once you have a domain provisioned, you're ready to start configuring your resource.

1. Navigate to the Domains configuration page of your EmailService resource.
:::image type="content" source="./media/manage-suppression-list-provisioned-domains.png" alt-text="Screenshot that highlights an email service with a provisioned domain.":::

2. Select on the link for your provisioned domain, under the Domain name column.
3. Then navigate to the Suppression Lists configuration page of your domain resource.
:::image type="content" source="./media/manage-suppression-list-blade.png" alt-text="Screenshot that highlights the Suppression List configuration page on a domains resource.":::

4. Select your desired domain from the dropdown list. You see entry in the dropdown for each sender username that is provisioned for the domains. For more information, see here for more details on [SenderUsername management](add-multiple-senders-mgmt-sdks.md).
:::image type="content" source="./media/manage-suppression-list-select-sender-domain.png" alt-text="Screenshot that highlights the dropdown list of mail from email addresses.":::

5. Once you choose a sender username to create the list for, either select the Add button or the Create new Suppression List button.
:::image type="content" source="./media/manage-suppression-list-add-new-list.png" alt-text="Screenshot that highlights the options to add a new suppression list for a mail from address.":::

6. Once you have a SuppressionList created, you see options to add a new recipient or upload a CSV of contacts.
:::image type="content" source="./media/manage-suppression-list-add-recipients.png" alt-text="Screenshot that highlights the options to add a recipient to a suppression.":::

7. Adding a single user shows the Added Recipient flyout. Here you can enter the recipients email address and some basic contact information.
:::image type="content" source="./media/manage-suppression-list-add-single-recipient-flyout.png" alt-text="Screenshot that highlights the Added Recipient flyout.":::

8. Choose the upload CSV option, if you don't want to add a single recipient at a time. When you select on Upload CSV File, the import csv flyout is shown. Here you can select a CSV file from your machine.
:::image type="content" source="./media/manage-suppression-list-import-csv.png" alt-text="Screenshot that highlights the import CSV flyout.":::

9. Checks with existing records are done for the selected CSV.
:::image type="content" source="./media/manage-suppression-list-import-csv-conflicts.png" alt-text="Screenshot showing the import conflicts that need to be resolved.":::

10. Finally, confirm the import and conflicts are resolved.
:::image type="content" source="./media/manage-suppression-list-import-csv-confirm.png" alt-text="Screenshot that import summary and confirmation page.":::

11. Export, edit, or remove recipients from the list view page.
:::image type="content" source="./media/manage-suppression-list-recipients.png" alt-text="Screenshot that highlights the suppression list recipients view.":::

12. Edit or delete recipients from the Edit Recipient flyout.
:::image type="content" source="./media/manage-suppression-list-edit-recipient.png" alt-text="Screenshot that highlights the edited recipient flyout.":::

## Next steps

- [Quickstart: Manage Domain Suppression Lists in Azure Communication Services using the Management Client Libraries](./manage-suppression-list-management-sdks.md)
- [Send Mail with Azure Communication Services](./send-email.md)
