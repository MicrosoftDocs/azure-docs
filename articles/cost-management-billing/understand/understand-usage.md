---
title: Understand your detailed usage and charges
description: Learn how to read and understand your detailed usage and charges file. View a list of terms and descriptions used in the file.
author: bandersmsft
ms.reviewer: micflan
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 03/21/2024
ms.author: banders
---

# Understand the terms in your Azure usage and charges file

The detailed usage and charges file contains daily rated usage based on negotiated rates,
purchases (for example, reservations, Marketplace fees), and refunds for the specified period.
Fees don't include credits, taxes, or other charges or discounts. You manually download the usage and charges file.

The information in the usage and charges file is the same information that's [exported from Cost Management](../costs/tutorial-export-acm-data.md). And, it's the same information that's retrieved from the Cost Details API. For more information about choosing a method to get cost details, see [Choose a cost details solution](../automate/usage-details-best-practices.md).

The following table covers which charges are included for each account type.

Account type | Azure usage | Marketplace usage | Purchases | Refunds
--- | --- | --- | --- | ---
Enterprise Agreement (EA) | Yes | Yes | Yes | No
Microsoft Customer Agreement (MCA) | Yes | Yes | Yes | Yes
Pay-as-you-go (PAYG) | Yes | Yes | No | No

To learn more about Marketplace orders (also known as external services), see [Understand your Azure external service charges](understand-azure-marketplace-charges.md).

For download instructions, see [How to get your Azure billing invoice and daily usage data](../manage/download-azure-invoice-daily-usage-date.md).
You can open your usage and charges CSV file in Microsoft Excel or another spreadsheet application.

## List of terms and descriptions

If you want to see a list of all available terms in the usage and charges file, see [Understand cost details data fields](../automate/understand-usage-details-fields.md).

## Ensure charges are correct

To learn more about detailed usage and charges, read about how to understand your [pay-as-you-go](review-individual-bill.md) or [Microsoft Customer Agreement](review-customer-agreement-bill.md) invoice.

## Unexpected usage or charges

If you have usage or charges that you don't recognize, there are several things you can do to help understand why:

- Review the invoice that has charges for the resource
- Review your invoiced charges in Cost analysis
- Find people responsible for the resource and engage with them
- Analyze the audit logs
- Analyze user permissions to the resource's parent scope
- Create an [Azure support request](https://go.microsoft.com/fwlink/?linkid=2083458) to help identify the charges

For more information, see [Analyze unexpected charges](analyze-unexpected-charges.md).

Note that Azure doesn't log most user actions. Instead, Microsoft logs resource usage for billing. If you notice a usage spike in the past and you didn't have logging enabled, Microsoft can't pinpoint the cause. Enable logging for the service that you want to view the increased usage for so that the appropriate technical team can assist you with the issue.

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [View and download your Microsoft Azure invoice](download-azure-invoice.md)
- [View and download your Microsoft Azure usage and charges](download-azure-daily-usage.md)