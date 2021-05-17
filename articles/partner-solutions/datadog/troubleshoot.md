---
title: Troubleshooting for Datadog - Azure partner solutions
description: This article provides information about troubleshooting for Datadog on Azure.
ms.service: partner-services
ms.topic: conceptual
ms.date: 02/19/2021
author: tfitzmac
ms.author: tomfitz
---

# Troubleshooting Datadog on Azure

This document contains information about troubleshooting your solutions that use Datadog.

## Purchase errors

* Purchase fails because a valid credit card isn't connected to the Azure subscription or a payment method isn't associated with the subscription.

  Use a different Azure subscription. Or, add or update the credit card or payment method for the subscription. For more information, see [updating the credit and payment method](../../cost-management-billing/manage/change-credit-card.md).

* The EA subscription doesn't allow Marketplace purchases.

  Use a different subscription. Or, check if your EA subscription is enabled for Marketplace purchase. For more information, see [Enable Marketplace purchases](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases). If those options don't solve the problem, contact [Datadog support](https://www.datadoghq.com/support).

## Unable to create Datadog resource

To set up the Azure Datadog integration, you must have **Owner** access on the Azure subscription. Ensure you have the appropriate access before starting the setup.

## Single sign-on errors

**Unable to save Single sign-on settings** - This error happens where there's another Enterprise app that is using the Datadog SAML identifier. To find which app is using it, select **Edit** on the Basic SAML Configuration section.

To resolve this issue, either disable the other app or use the other app as the Enterprise app to set up SAML SSO with Datadog. If you decide to use the other app, ensure the app has the [required settings](create.md#configure-single-sign-on).

**App not showing in Single sign-on setting page** - First, search for the application ID. If no result is shown, check the SAML settings of the app. The grid only shows apps with correct SAML settings. 

The Identifier URL must be `https://us3.datadoghq.com/account/saml/metadata.xml`.

The reply URL must be `https://us3.datadoghq.com/account/saml/assertion`.

The following image shows the correct values.
  
:::image type="content" source="media/troubleshoot/troubleshooting.png" alt-text="Check SAML settings for the Datadog application in AAD." border="true":::

**Guest users invited to the tenant are unable to access Single sign-on** - Some users have two email addresses in Azure portal. Typically, one email is the user principal name (UPN) and the other email is an alternative email.

When inviting guest user, use the home tenant UPN. By using the UPN, you keep the email address in-sync during the Single sign-on process. You can find the UPN by looking for the email address in the top-right corner of the user's Azure portal.
  
## Logs not being emitted

Only resources listed in the Azure Monitor resource log categories emit logs to Datadog. To verify whether the resource is emitting logs to Datadog, navigate to Azure diagnostic setting for the specific resource. Verify that there's a Datadog diagnostic setting.

:::image type="content" source="media/troubleshoot/diagnostic-setting.png" alt-text="Datadog diagnostic setting on the Azure resource" border="true":::

## Metrics not being emitted

The Datadog resource is assigned a **Monitoring Reader** role in the appropriate Azure subscription. This role enables the Datadog resource to collect metrics and send those metrics to Datadog.

To verify the resource has the correct role assignment, open the Azure portal and select the subscription. In the left pane, select **Access Control (IAM)**. Search for the Datadog resource name. Confirm that the Datadog resource has the **Monitoring Reader** role assignment, as shown below.

:::image type="content" source="media/troubleshoot/datadog-role-assignment.png" alt-text="Datadog role assignment in the Azure subscription" border="true":::

## Datadog agent installation fails

The Azure Datadog integration provides you the ability to install Datadog agent on a virtual machine or app service. For configuring the Datadog agent, the API key selected as **Default Key** in the API Keys screen is used. If a default key isn't selected, the Datadog agent installation will fail.

If the Datadog agent has been configured with an incorrect key, navigate to the API keys screen and change the **Default Key**. You'll have to uninstall the Datadog agent and reinstall it to configure the virtual machine with the new API keys.

## Next steps

Learn about [managing your instance](manage.md) of Datadog.
