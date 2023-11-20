---
title: Troubleshooting for Datadog
description: This article provides information about troubleshooting for Datadog on Azure.
author: flang-msft

ms.author: franlanglois
ms.topic: conceptual
ms.date: 01/06/2023
---

# Fix common errors for Datadog - An Azure Native ISV Service

This document contains information about troubleshooting your solutions that use Datadog - An Azure Native ISV Service.

## Purchase errors

[!INCLUDE [marketplace-purchase-errors](../includes/marketplace-purchase-errors.md)]

If those options don't solve the problem, contact [Datadog support](https://www.datadoghq.com/support).

## Unable to create Datadog - An Azure Native ISV Service resource

To set up the Azure Datadog integration, you must have **Owner** access on the Azure subscription. Ensure you have the appropriate access before starting the setup.

## Single sign-on errors

- **Unable to save Single sign-on settings** 
   - This error happens where there's another Enterprise app that is using the Datadog SAML identifier. To find which app is using it, select **Edit** on the Basic SAML Configuration section.

   To resolve this issue, either disable the other app or use the other app as the Enterprise app to set up SAML SSO with Datadog. If you decide to use the other app, ensure the app has the [required settings](create.md#configure-single-sign-on).

- **App not showing in Single sign-on setting page** 
   - First, search for the application ID. If no result is shown, check the SAML settings of the app. The grid only shows apps with correct SAML settings. 

     The Identifier URL must be `https://us3.datadoghq.com/account/saml/metadata.xml`.
     
     The reply URL must be `https://us3.datadoghq.com/account/saml/assertion`.
        
    The following image shows the correct values.
  
    :::image type="content" source="media/troubleshoot/troubleshooting.png" alt-text="Check SAML settings for the Datadog application in Azure A D." border="true":::

- **Guest users invited to the tenant are unable to access Single sign-on** 
   - Some users have two email addresses in Azure portal. Typically, one email is the user principal name (UPN) and the other email is an alternative email.

   When inviting guest user, use the home tenant UPN. By using the UPN, you keep the email address in-sync during the Single sign-on process. You can find the UPN by looking for the email address in the top-right corner of the user's Azure portal.
  
## Logs not being emitted

- Only resources listed in the Azure Monitor resource log categories emit logs to Datadog. 

    To verify whether the resource is emitting logs to Datadog: 

    1. Navigate to Azure diagnostic setting for the specific resource. 

    1. Verify that there's a Datadog diagnostic setting.

     :::image type="content" source="media/troubleshoot/diagnostic-setting.png" alt-text="Datadog diagnostic setting on the Azure resource" border="true":::

- Resource doesn't support sending logs. Only resource types with monitoring log categories can be configured to send logs. For more information, see [supported categories](../../azure-monitor/essentials/resource-logs-categories.md).

- Limit of five diagnostic settings reached. Each Azure resource can have a maximum of five diagnostic settings. For more information, see [diagnostic settings](../../azure-monitor/essentials/diagnostic-settings.md?tabs=portal).

- Export of Metrics data isn't supported currently by the partner solutions under Azure Monitor diagnostic settings. 

## Metrics not being emitted

The Datadog resource is assigned a **Monitoring Reader** role in the appropriate Azure subscription. This role enables the Datadog resource to collect metrics and send those metrics to Datadog.

To verify the resource has the correct role assignment, open the Azure portal and select the subscription. In the left pane, select **Access Control (IAM)**. Search for the Datadog resource name. Confirm that the Datadog resource has the **Monitoring Reader** role assignment.

:::image type="content" source="media/troubleshoot/datadog-role-assignment.png" alt-text="Datadog role assignment in the Azure subscription" border="true":::

## Datadog agent installation fails

The Azure Datadog integration provides you the ability to install Datadog agent on a virtual machine or app service. The API key selected as **Default Key** in the API Keys screen is used to configure the Datadog agent. If a default key isn't selected, the Datadog agent installation fails.

If the Datadog agent has been configured with an incorrect key, navigate to the API keys screen and change the **Default Key**. You'll have to uninstall the Datadog agent and reinstall it to configure the virtual machine with the new API keys.

## Next steps

- Learn about [managing your instance](manage.md) of Datadog.
- Get started with Datadog – An Azure Native ISV Service on

  > [!div class="nextstepaction"]
  > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors)

  > [!div class="nextstepaction"]
  > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview)
