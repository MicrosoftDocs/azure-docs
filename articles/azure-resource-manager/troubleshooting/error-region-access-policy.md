---
title: Resolve location ineligible errors
description: Learn how to resolve location ineligible errors.
ms.topic: troubleshooting
ms.date: 05/07/2025
---

# Resolve location ineligible errors

This article provides information about the location ineligible error that might occur when you attempt to create new resources in an Azure region.

## Symptom

The following error message is returned when you attempt to create a new resource in an Azure region using an Azure Resource Manager (ARM) template, Azure CLI, or Azure PowerShell. Or, you might see this error in Azure portal when you select an Azure region in the region drop-down while attempting to create a new resource.

```Output
The selected region is currently not accepting new customers: https://aka.ms/locationineligible
```

## Cause

To prioritize resources for existing customers in an Azure region, Microsoft may restrict access for customers without resources in that location. If you attempt to create resources in a region where this policy applies and your tenant is new to that region, you receive this error message. This policy is currently in effect for the following region(s):

- West Europe

## Solution

If you receive this message, there are two possible solutions:

- **Select an alternative region:** Most users should select a different Azure region to deploy their resources into.
- **Submit a remediation request:** If one or more subscriptions in your tenant have resources already deployed to the Azure region, or there's a clear business need for country-specific data sovereignty, then contact Microsoft support by using the following steps:

> [!NOTE]
> Remember that a remediation request should only be submitted to Microsoft support if there is a clear requirement for deploying resources to the Azure region. Otherwise, please choose a different Azure region for your deployment.

1. Sign in to the Azure portal by selecting [this link](https://portal.azure.com/#create/Microsoft.Support/Parameters/%7B%0A%09%22subId%22%3A%20%22%22%2C%0A%09%22pesId%22%3A%20%2206bfd9d3-516b-d5c6-5802-169c800dec89%22%2C%0A%09%22supportTopicId%22%3A%20%22de9828b5-622d-15db-8ad0-b4fe9590cef8%22%2C%0A%09%22contextInfo%22%3A%20%22Unable%20to%20access%20Azure%20regions%22%2C%0A%09%22caller%22%3A%20%22accessazureregionsdeeplink%22%2C%0A%09%22severity%22%3A%20%222%22%0A%7D).
1. In **How can we help you?** enter **region access**, and then select **Go**.
1. In **Which service are you having an issue with?** select **Service and subscription limits (quotas)**, and then select **Next**.
1. Select **Create a support request**.
1. Select your **Subscription**, and in **Quota type**, select **Unable to access West Europe region**, and then select **Next**

    :::image type="content" source="./media/error-region-access-policy/azure-support-troubleshooting-new-support-request.png" alt-text="Screenshot of new support request.":::
