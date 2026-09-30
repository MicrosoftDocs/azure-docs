---
title: Troubleshooting for Datadog
description: This article provides information about troubleshooting for Datadog on Azure.
author: pdjokar96
ms.author: piyushdash
ms.topic: troubleshooting-general
ms.date: 01/29/2026
ms.custom: sfi-image-nochange
---

# Troubleshoot Datadog on Azure

This article helps you diagnose and resolve common issues with the Datadog Azure Native Integration. Use the quick reference table below to jump to the issue you're experiencing.

## Quick diagnostic reference

| Symptom | Likely cause | Section |
|---------|-------------|---------|
| Can't create a Datadog resource | Missing Owner role on subscription | [Unable to create](#unable-to-create-datadog) |
| Marketplace purchase fails | Spending limits, unsupported subscription type, or region restrictions | [Marketplace purchase errors](#marketplace-purchase-errors) |
| Logs aren't appearing in Datadog | Resource type not supported, diagnostic settings limit reached, or tag rules exclude the resource | [Logs not emitting](#logs-not-being-emitted) |
| Metrics aren't appearing in Datadog | Missing Monitoring Reader role assignment | [Metrics not emitting](#metrics-not-being-emitted) |
| SSO settings can't be saved | Conflicting Enterprise app using the same SAML identifier | [SSO errors](#single-sign-on-errors) |
| Agent installation fails | No default API key selected | [Agent installation fails](#datadog-agent-installation-fails) |
| Diagnostic settings won't turn off | Delete lock on resource or resource group | [Diagnostic settings active after disabling](#diagnostic-settings-are-active-even-after-disabling-the-datadog-resource-or-applying-necessary-tag-rules) |

## Marketplace purchase errors

[!INCLUDE [marketplace-purchase-errors](../includes/marketplace-purchase-errors.md)]

If those options don't solve the problem, contact [Datadog support](https://www.datadoghq.com/support).

## Unable to create Datadog

To set up the Azure Datadog integration, you must have **Owner** access on the Azure subscription. Ensure you have the appropriate access before starting the setup.

To verify your role assignment:

1. Open the Azure portal and navigate to the subscription.
2. Select **Access Control (IAM)** > **View my access**.
3. Confirm you have the **Owner** role. If not, request it from your subscription administrator.

## Single sign-on errors

### Unable to save single sign-on settings

This error happens when another Enterprise app is using the Datadog SAML identifier. To find which app is using it, select **Edit** on the Basic SAML Configuration section.

To fix this issue, either:
- Disable the other app, or
- Use the other app as the Enterprise app to set up SAML SSO with Datadog. If you decide to use the other app, ensure the app has the [required settings](prerequisites.md#add-enterprise-application).

### App not showing in single sign-on setting page

First, search for the application ID. If no result is shown, check the SAML settings of the app. The grid only shows apps with correct SAML settings.

Verify these SAML values are set correctly:

| Setting | Required value |
|---------|---------------|
| Identifier URL | `https://us3.datadoghq.com/account/saml/metadata.xml` |
| Reply URL | `https://us3.datadoghq.com/account/saml/assertion` |

### Guest users can't access single sign-on

Some users have two email addresses in the Azure portal. Typically, one email is the user principal name (UPN), and the other email is an alternative email.

When inviting a guest user, use the home tenant UPN. By using the UPN, you keep the email address in-sync during the single sign-on process. You can find the UPN by looking for the email address in the top-right corner of the user's Azure portal.

## Logs not being emitted

If Azure resource logs aren't appearing in Datadog, check these common causes:

| Cause | How to verify | Fix |
|-------|--------------|-----|
| Resource type doesn't support log export | Check [supported resource log categories](/azure/azure-monitor/essentials/resource-logs-categories) | No fix; only supported resource types can emit logs |
| Diagnostic settings limit reached | Check the resource's diagnostic settings in the Azure portal (maximum 5 per resource) | Remove an unused diagnostic setting. See [diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings?tabs=portal) |
| Tag rules exclude the resource | Check your tag rules in **Datadog organization configurations > Metrics and Logs** | Update tag rules to include the resource |
| Metrics export via diagnostic settings | N/A | Azure Monitor diagnostic settings don't support metric export for partner solutions. Use platform metrics instead |

To check whether a specific resource is emitting logs:

1. Navigate to the Azure diagnostic setting for the specific resource.
2. Check that there's a Datadog diagnostic setting present and enabled.

## Metrics not being emitted

The Datadog resource requires a **Monitoring Reader** role assignment in the appropriate Azure subscription to collect and forward metrics.

To verify the role assignment:

1. Open the Azure portal and select the subscription.
2. Select **Access Control (IAM)** in the left pane.
3. Search for the Datadog resource name.
4. Confirm the Datadog resource has the **Monitoring Reader** role assignment.

If the role assignment is missing, it may indicate an issue during resource creation. Try [deleting](manage.md#delete-a-resource) and recreating the Datadog resource.

## Datadog agent installation fails

The Azure Datadog integration uses the API key selected as **Default Key** in the API Keys screen to configure the Datadog agent. If a default key isn't selected, the agent installation fails.

To resolve:

1. Navigate to your Datadog resource in the Azure portal.
2. Select **Settings > Keys** from the service menu.
3. Ensure one API key is set as the **Default Key**.
4. If the agent was installed with an incorrect key, uninstall and reinstall it. The new default key is used automatically.

## Diagnostic settings are active even after disabling the Datadog resource or applying necessary tag rules

If logs continue to be emitted and diagnostic settings remain active on monitored resources after the Datadog resource is disabled or tag rules are modified, a **delete lock** on the resource or resource group is likely preventing cleanup.

To resolve:

1. Check for locks on the resource or resource group: go to the resource in the Azure portal and select **Locks** from the service menu.
2. Remove the delete lock.
3. If the lock was removed after the Datadog resource was deleted, you must manually clean up diagnostic settings to stop log forwarding.

[!INCLUDE [diagnostic-settings](../includes/diagnostic-settings.md)]

## Get support

Contact [Datadog support](https://www.datadoghq.com/support) for product-specific issues.

For Azure platform issues (deployment failures, role assignments, resource provider registration), [create an Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- [Manage your Datadog resource](manage.md)
- [Create a Datadog resource](create.md)

  > [!div class="nextstepaction"]
  > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors)
  >
  > [!div class="nextstepaction"]
  > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview)
