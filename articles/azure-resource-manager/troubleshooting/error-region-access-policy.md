---
title: Location Ineligible
description: Information about 'location ineligible' error
ms.topic: troubleshooting
ms.date: 09/02/2024
---

# Information about Location Ineligible error

This article provides information about the 'location ineligible' error that might occur when you attempt to create new resources in certain Azure regions.

## Symptom

The following error message is returned when you attempt to create a new resource in Azure's West Europe region using an Azure Resource Manager (ARM) template, Azure CLI, or Azure PowerShell. Or, you might see this error in Azure Portal when you select West Europe in the region drop-down while attempting to create a new resource.

```Output
The selected region is currently not accepting new customers: https://aka.ms/locationineligible
```

## Cause

To maximize access for Azure customers already deployed in an Azure location, Microsoft will sometimes restrict access for customers not using that location. This policy is currently in effect for Azure's West Europe region. Thus, when you attempt to create resources in West Europe under a tenant that is new to this region, you will recieve the error message mentioned above.

## Solution

If you recieve this message, there are two possible solutions:

- Select an alternative region: Most users should choose a different Azure region to deploy resources.
- Submit a remediation request: If one or more subscriptions in your tenant have resources already deployed to West Europe, or there is a clear business need for country-specific data sovereignty, then contact Microsoft support by following the steps outlined below.

> [!NOTE]
> Remember that a remediation request should only be submitted to Microsoft support if there is a clear requirement for deploying resources in the West Europe region. Otherwise, please choose a different Azure region for your deployment.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Help + support** and start a new support request by clicking on **Create a support request**.

1. Search for "region access" and select **Service and subscription limits (quotas)**.

1. Click on **Next** and then click on **Create a support request**.

1. A new support request form should open with **Issue type** pre-selected as **Service and subscription limits (quotas)**.

1. Select your **Subscription** from the drop-down list. 

1. For **Quota type**, select **Unable to access West Europe region** from the drop-down list.

1. Click on **Next** and complete the support request form. Microsoft Customer Support will use the requested contact method as needed to complete the process.

---
