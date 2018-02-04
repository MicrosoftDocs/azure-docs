---
title: Usage report infrastructure in Azure Stack | Microsoft Docs
description: Type the description in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 9D36AE95-FB99-4BE6-9F30-60F50C1CF561
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/01/2018
ms.author: mabrigg

---

# Usage reporting infrastructure in Azure Stack

*Applies to: Azure Stack integrated systems*

## Usage reporting infrastructure

Azure Stack includes the infrastructure needed to track usage as it occurs and forward it to Azure, where Azure Commerce processes it and charges it against Azure subscriptions, in the same way as usage that takes place in the public Azure cloud.

You should be aware that certain concepts are consistent between Azure and  - Azure Stack has local subscriptions, which fulfill a similar role to Azure subscription, but are only valid locally. Local subscriptions are mapped to Azure subscriptions when usage is forwarded to Azure.

Azure Stack has local usage meters; local usage is mapped to the meters used in Azure commerce, but the meter IDs are different, and there are more meters available locally than the one Microsoft uses for billing.

There are some differences between how services are priced in Azure Stack and Azure. For example, in Azure Stack, VMs are charged only based on vcore/hours, with the same rate for all VM series, unlike Azure (the reason is that in Azure the different prices reflect different hardware; in Azure Stack, the customer procures the hardware, so there is no reason to charge different rates for different VM classes).

You can find out about the Azure Stack meters used in Commerce and their prices in Partner Center, in the same way as you would do for Azure services:

1. In Partner Center, go to the Dashboard menu > **Pricing and offers**.
2. Under Usage-based services, select **Current**.
3. Open the **Azure in Global CSP price list** spreadsheet.
4. Filter on **Region = Azure Stack**.

## Charging the right subscriptions: the importance of registration

We have seen that Azure Stack usage data is forwarded to Azure Commerce and billed to Azure subscription. You may wonder: how does Commerce know which subscription to charge?

Another question you may have is: when an Azure Stack is going to be shared among multiple end customers (multiple AAD tenants from an identity point of view), there is a need to report each customer’s usage on a different subscription.How does Azure Stack deal with multitenancy (the ability to support different organizations on the same Azure Stack)? Can you report each end customer’s usage to the customer’s subscription? The answer is yes, and here is how. 

Azure Stack supports these requirements using a feature called registration. A registration is an object, stored in Azure, which documents which Azure subscription(s) to use to charge for a given Azure Stack.

For each Azure Stack, there is going to be one default subscription and as many tenant subscriptions as needed:

 - The default subscription is an Azure subscription that is charged if there is no tenant-specific subscription. It must be the first to be registered. For multi-tenant usage reporting to work, the subscription must be a CSP or CSPSS subscription.

 - Then, the registration is updated with an Azure subscription for each tenant that is going to use the Azure Stack. Tenant subscriptions must be of the CSP type and must roll up to the partner who owns the default subscription (in other words, you cannot register someone else’s customers!).
When usage information is forwarded to Azure, a service in Azure consults the registration and maps each tenant’s usage to the appropriate tenant subscription. If a tenant has not been registered, that usage goes to the default subscription for the Azure Stack from which it originated.
Since tenant subscriptions are CSP subscriptions, their bill is sent to the CSP partner, and usage information is not visible to the end customer.

## Next steps

To learn about X, see [X]().
