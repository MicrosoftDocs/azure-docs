---
title: Change SKU selection 
description: How-to change your SKU for Trusted Signing account. 
author: mehasharma 
ms.author: mesharm 
ms.service: trusted-signing 
ms.topic: how-to 
ms.date: 05/30/2024 
---


# Select or change Trusted Signing SKU (Pricing tier)

Trusted Signing provides a choice between two pricing tiers: Basic and Premium. Both tiers are tailored to offer the service at an optimal cost, suitable for any signing scenario.  

## SKU (Pricing tier) overview

Each pricing tier provides varying options for the number of certificate profile types available and the monthly allocation of signatures. 

|        Account level       | Basic  | Premium     |
| :------------------- | :------------------- |:---------------|
| Price(monthly)              | **$9.99 / account**              | **$99.99 / account**  |
| Quota (signatures / month)             | 5,000              | 100,000  |
| Price after quota is reached             | $0.005 / signature               | $0.005 / signature   |
| Certificate Profiles             | 1 of each available type               | 10 of each available type  |
| Public-Trust Signing             | Yes               | Yes  |
| Private-Trust Signing             | Yes               | Yes  |
                        
**Note**: The pricing tier is also referred to as the SKU.


## Change SKU

You can change the SKU for a Trusted Signing account at any time by upgrading to Premium or downgrading to Basic. This change can be done from both the Azure portal and from Azure CLI. 

- SKU updates are effective from next billing cycle.
- SKU limitations for updated SKU are enforced after the update is successful.
- Downgrade to Basic: 
    - The Basic SKU allows only one certificate profile of each type. For example, if you have two certificate profiles of type Public Trust, you need to delete any one profile to be eligible to downgrade. Same applies for other certificate profile types as well.
- Upgrade to Premium:  
    - There are no limitations when you upgrade to the Premium SKU from Basic SKU. 
- After changing the SKU, you're required to manually refresh the Account Overview section to see the updated SKU under SKU (Pricing tier). (This limitation is known, and being actively worked on to resolve). 

# [Azure portal](#tab/sku-portal)

To change the SKU (Pricing tier) from the Azure portal, follow these steps:

1. Sign in to the Azure portal.
2. Navigate to your Trusting Signing account in the Azure portal.
3. On the account Overview page, locate the current **SKU (Pricing tier)**. 
4. Select the current SKU selection hyperlink. Your current selection is highlighted in the "choose pricing tier" window.
5. Select the SKU you want to update to (for example, downgrade to Basic or upgrade to Premium) and select **Update**. 

 
# [Azure CLI](#tab/sku-cli)

To change the SKU with Azure CLI, use the following command: 

```
az trustedsigning update -n MyAccount -g MyResourceGroup --sku Premium
```
---

## Cost Management and Billing

**Cost Management**

View and estimate the cost of your Trusted Signing resource usage.  
1. In the Azure portal, search **Subscriptions**.
2. Select the **Subscription**, where you have created Trusted Signing resources.
3. Select Cost Management from the menu on the left. Learn more about using [Cost Management](https://learn.microsoft.com/azure/cost-management-billing/costs/).
4. For Trusted Signing, you can see costs associated to your Trusted Signing account.  

**Billing**

View Invoice for Trusted Signing service. 
1. In the Azure portal, search **Subscriptions**.
2. Select the **Subscription**, where you have created Trusted Signing resources.
3. Select Billing from the menu on the left. Learn more about [Billing](https://learn.microsoft.com/azure/cost-management-billing/manage/).