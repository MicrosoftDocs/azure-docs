---
title: Troubleshoot Elastic Cloud on Azure - Azure Native Integration
description: Diagnose and resolve common issues with Elastic Cloud on Azure - including creation failures, Marketplace purchase errors, missing logs, and diagnostic settings that won't turn off.
ms.topic: troubleshooting-general
ms.date: 02/03/2026
ms.custom: sfi-image-nochange
#customer intent: As an Azure developer or cloud engineer, I want to troubleshoot common issues with my Elastic resource on Azure so I can restore search, observability, or security monitoring.
---

# Troubleshoot Elastic Cloud on Azure

This article helps you diagnose and resolve common issues with Elastic Cloud on Azure. Use the quick reference table to jump to the matching scenario.

## Quick diagnostic reference

| Symptom | Likely cause | Section |
|---------|-------------|---------|
| Can't create an Elastic resource | Missing Owner or Contributor role on the subscription | [Unable to create](#unable-to-create-an-elastic-resource) |
| Marketplace purchase fails | Spending limits, unsupported subscription type, or region restrictions | [Marketplace purchase errors](#marketplace-purchase-errors) |
| Logs aren't appearing in Elastic | Resource type unsupported, diagnostic settings limit reached, or tag rules exclude the resource | [Logs not emitting](#logs-not-being-emitted-to-elastic) |
| Diagnostic settings won't turn off | Delete lock on the resource or resource group | [Diagnostic settings active after disabling](#diagnostic-settings-are-active-even-after-disabling) |
| Want to request a new feature | — | [Suggest a feature](#suggest-a-feature) |

## Unable to create an Elastic resource

To create the Elastic resource you must have **Owner** or **Contributor** access on the Azure subscription. Confirm your role before starting setup.

To verify your role assignment:

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the subscription.
2. Select **Access control (IAM)** > **View my access**.
3. Confirm you have the **Owner** or **Contributor** role. If not, request it from your subscription administrator.

For step-by-step guidance, see [check your access](../../role-based-access-control/check-access.md).

## Marketplace purchase errors

[!INCLUDE [marketplace-purchase-errors](../includes/marketplace-purchase-errors.md)]

If those options don't solve the problem, contact [Elastic support](https://support.elastic.co/).

## Logs not being emitted to Elastic

If Azure resource logs aren't appearing in Elastic, check these common causes:

| Cause | How to verify | Fix |
|-------|--------------|-----|
| Resource type doesn't support log export | Check [supported resource log categories](/azure/azure-monitor/essentials/resource-logs-categories) | No fix; only supported resource types can emit logs |
| Diagnostic settings limit reached | Check the resource's diagnostic settings in the Azure portal (maximum five per resource) | Remove an unused diagnostic setting. See [diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings?tabs=portal) |
| Tag rules exclude the resource | Check rules in **Elastic deployment configuration** > **Logs & metrics** | Update tag rules to include the resource. See [tag rules for sending logs](../metrics-logs.md#tag-rules-for-sending-logs) for include/exclude examples |
| Metrics export via diagnostic settings | N/A | Azure Monitor diagnostic settings don't support metric export for partner solutions. Use platform metrics from the Elastic resource instead |

To check whether a specific resource is emitting logs:

1. Navigate to the resource in the [Azure portal](https://portal.azure.com/).
2. Open [Diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings) and verify an Elastic diagnostic setting is present and enabled.

:::image type="content" source="media/troubleshoot/check-diagnostic-setting.png" alt-text="Screenshot of how to check the diagnostic setting for an Azure resource.":::

## Diagnostic settings are active even after disabling

If logs continue to be emitted and diagnostic settings remain active on monitored resources after the Elastic resource is disabled or tag rules are modified to exclude resources, a **delete lock** on the resource or resource group is likely preventing cleanup.

To resolve:

1. Navigate to the resource or resource group in the [Azure portal](https://portal.azure.com/) and select **Locks** from the service menu.
2. Remove the delete lock.
3. If the lock was removed after the Elastic resource was already deleted, manually clean up the remaining diagnostic settings to stop log forwarding.

[!INCLUDE [diagnostic-settings](../includes/diagnostic-settings.md)]

## Suggest a feature

To suggest a new feature for the Elastic integration with Azure, select the **Suggest a feature** link at the top of the Elastic resource overview page.

:::image type="content" source="media/troubleshoot/suggest-a-feature.png" alt-text="Screenshot of suggesting a feature for the Elastic integration with Azure.":::

This link takes you to the **Developer community forum** where you can submit a new feature request, or view, upvote, and comment on existing suggestions.

## Get support

- Contact [Elastic support](https://support.elastic.co/) for Elastic product issues.
- [Create an Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) for Azure platform issues (deployment failures, role assignments, resource provider registration).

## Next steps

- [Manage your Elastic resource](manage.md)
- [Create an Elastic resource](create.md)

  > [!div class="nextstepaction"]
  > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Elastic%2Fmonitors)
  >
  > [!div class="nextstepaction"]
  > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/elastic.ec-azure-pp?tab=Overview)

