---
title: Location Ineligible
description: Information about 'location ineligible' error
ms.topic: troubleshooting
ms.date: 09/02/2024
---

# Information about Location Ineligible error

This article provides information about the 'location ineligible' error that might occur when you attempt to create new resources in certain Azure regions.

## Symptom

The following error message is returned when you attempt to create a new resource in an Azure region using an Azure Resource Manager (ARM) template, Azure CLI, or Azure PowerShell. Or, you might see this error in Azure Portal when you select an Azure region in the region drop-down while attempting to create a new resource.

```Output
The selected region is currently not accepting new customers: https://aka.ms/locationineligible
```

## Cause

To prioritize resources for existing customers in an Azure region, Microsoft will sometimes restrict access to customers with no resources in that location.  When you attempt to create resources in an Azure region where this policy is in place and under a tenant that is new to the region, you will receive the error message above.

This policy is currently in effect for the following region(s):

- West Europe

## Solution

If you recieve this message, there are two possible solutions:

- Select an alternative region: Most users should select a different Azure region to deploy their resources into.
- Submit a remediation request: If one or more subscriptions in your tenant have resources already deployed to the Azure region, or there is a clear business need for country-specific data sovereignty, then contact Microsoft support by following the steps outlined below.

> [!NOTE]
> Remember that a remediation request should only be submitted to Microsoft support if there is a clear requirement for deploying resources to the Azure region. Otherwise, please choose a different Azure region for your deployment.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Help + support** and start a new support request by clicking on **Create a support request**.

1. Search for "region access" and select **Service and subscription limits (quotas)**.

1. Click on **Next** and then click on **Create a support request**.

1. A new support request form should open with **Issue type** pre-selected as **Service and subscription limits (quotas)**.

1. Select your **Subscription** from the drop-down list. 

1. For **Quota type**, select **Unable to access West Europe region** from the drop-down list.

1. Click on **Next** and complete the support request form. Microsoft Customer Support will use the requested contact method as needed to complete the process.

---
