---
title: Stream Azure Active Directory logs to Azure Monitor logs
description: Learn how to integrate Azure Active Directory logs with Azure Monitor logs
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 02/02/2023
ms.author: sarahlipsey
ms.reviewer: besiler
ms.collection: M365-identity-device-management
---

# Integrate Azure AD logs with Azure Monitor logs

Using **Diagnostic settings** in Azure Active Directory (Azure AD), you can integrate logs with Azure Monitor so your sign-in activity and the audit trail of changes within your tenant can be analyzed along with other Azure data. 

This article provides the steps to integrate Azure Active Directory (Azure AD) logs with Azure Monitor.

Use the integration of Azure AD activity logs and Azure Monitor to perform the following tasks:

 * Compare your Azure AD sign-in logs against security logs published by Microsoft Defender for Cloud.
  
 * Troubleshoot performance bottlenecks on your application’s sign-in page by correlating application performance data from Azure Application Insights.

 * Analyze the Identity Protection risky users and risk detections logs to detect threats in your environment.
 
 * Identify sign-ins from applications still using the Active Directory Authentication Library (ADAL) for authentication. [Learn about the ADAL end-of-support plan.](../develop/msal-migration.md)

> [!NOTE]
> Integrating Azure Active Directory logs with Azure Monitor will automatically enable the Azure Active Directory data connector within Microsoft Sentinel.

This Microsoft Ignite 2018 session video shows the benefits of integrating Azure AD logs and Azure Monitor in practical scenarios:

> [!VIDEO https://www.youtube.com/embed/MP5IaCTwkQg?start=1894]

## How do I access it? 

To use this feature, you need:

* An Azure subscription. If you don't have an Azure subscription, you can [sign up for a free trial](https://azure.microsoft.com/free/).
* An Azure AD Premium P1 or P2 tenant. You can find the license type of your tenant on the [Overview](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) page in Azure AD.
* **Global Administrator** or **Security Administrator** access for the Azure AD tenant.
* A **Log Analytics workspace** in your Azure subscription. Learn how to [create a Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md).

## Send logs to Azure Monitor

Follow the steps below to send logs from Azure Active Directory to Azure Monitor. Looking for how to set up Log Analytics workspace for Azure resources outside of Azure AD? Check out the [Collect and view resource logs for Azure Monitor](../../azure-monitor/essentials/diagnostic-settings.md) article.

1. Sign in to the [Azure portal](https://portal.azure.com) as a **Security Administrator** or **Global Administrator**.

1. Go to **Azure Active Directory** > **Diagnostic settings**. You can also select **Export Settings** from either the **Audit Logs** or **Sign-ins** page.

1. Select **+ Add diagnostic setting** to create a new integration or select **Edit setting** for an existing integration.

1. Enter a **Diagnostic setting name**. If you're editing an existing integration, you can't change the name.

1. Any or all of the following logs can be sent to the Log Analytics workspace. Some logs may be in public preview but still visible in the portal.
    * `AuditLogs`
    * `SignInLogs`
    * `NonInteractiveUserSignInLogs`
    * `ServicePrincipalSignInLogs`
    * `ManagedIdentitySignInLogs`
    * `ProvisioningLogs`
    * `ADFSSignInLogs` Active Directory Federation Services (ADFS)
    * `RiskyUsers`
    * `UserRiskEvents`
	* `RiskyServicePrincipals`
	* `ServicePrincipalRiskEvents`

1.  The following logs are in preview but still visible in Azure AD. At this time, selecting these options will not add new logs to your workspace unless your organization was included in the preview.
    * `EnrichedOffice365AuditLogs`
    * `MicrosoftGraphActivityLogs`
    * `NetworkAccessTrafficLogs`

1. Select the **Destination details** for where you'd like to send the logs. Choose any or all of the following destinations. Additional fields appear, depending on your selection.

    * **Send to Log Analytics workspace:** Select the appropriate details from the menus that appear.
    * **Archive to a storage account:** Provide the number of days you'd like to retain the data in the **Retention days** boxes that appear next to the log categories. Select the appropriate details from the menus that appear.
    * **Stream to an event hub:** Select the appropriate details from the menus that appear.
    * **Send to partner solution:** Select the appropriate details from the menus that appear.

1. Select **Save** to save the setting.

    ![Screenshot of the Diagnostics settings with some destination details shown.](./media/howto-integrate-activity-logs-with-log-analytics/Configure.png)

If you do not see logs appearing in the selected destination after 15 minutes, sign out and back into Azure to refresh the logs.

## Next steps

* [Analyze Azure AD activity logs with Azure Monitor logs](howto-analyze-activity-logs-log-analytics.md)
* [Learn about the data sources you can analyze with Azure Monitor](../../azure-monitor/data-sources.md)
* [Automate creating diagnostic settings with Azure Policy](../../azure-monitor/essentials/diagnostic-settings-policy.md)


