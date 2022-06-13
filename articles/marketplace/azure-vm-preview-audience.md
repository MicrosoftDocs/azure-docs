---
title: Add a preview audience for a virtual machine offer on Azure Marketplace
description: Add a preview audience for a virtual machine offer on Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.reviewer: amhindma
ms.date: 03/08/2022
---

# Add a preview audience for a virtual machine offer

On the **Preview audience** page (select from the left-nav menu in Partner Center), configure a limited *Preview audience* to be authorized to validate your offer before publishing it live to the broader commercial marketplace audience. When you publish your offer, preview links will be made available to the members of the preview audience that you specified. Only the preview audience you configure will be able to access the preview links and verify the details of your offer preview before you sign off to **Go live**.

Preview links are not available for hidden plans. For hidden plans, the preview audience can test the offer via the command prompt.

> [!NOTE]
> Previews are not supported by offers configured to be available to the [Cloud Solution Provider (CSP) program](cloud-solution-providers.md).

Your preview audience is identified by **Azure subscription IDs**, along with an optional **Description** for each. Neither of these fields can be seen by customers. You can find your Azure subscription ID on the **[Subscriptions](https://go.microsoft.com/fwlink/?LinkId=2122490)** page in the Azure portal.

Add at least one Azure subscription ID, either individually or by uploading a CSV file. If your offer is already live, you can still modify the preview audience for testing changes or updates to your offer.

> [!IMPORTANT]
> Any changes made to the preview audience for your offer must be saved and will only take effect after you republish your offer.

> [!NOTE]
> A preview audience differs from a private audience. A preview audience is a list of subscription IDs that can test and validate your offer. This includes any private plans, before they are made available to your users. In contrast, when making an offer private, you need to specify a private audience to restrict visibility of your offer to customers of your choosing. A private audience (defined on the **Pricing and Availability** page for each of your plans) is a list of subscription IDs and/or tenant IDs that will have access to a particular plan after the offer is live.

After configuring the preview audience, select **Save draft** before continuing to the next tab in the left-nav menu, **Plan overview**.

## Next steps

- [Create plans](azure-vm-plan-overview.md)
