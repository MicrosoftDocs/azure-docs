---  
title: Billing options in the Azure Marketplace | Azure
description: Billing options in the Azure Marketplace for publishers.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
documentationcenter:
author: jm-aditi-ms
manager: pabutler
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 06/05/2018
ms.author: ellacroi

---  

# Billing options in the Azure Marketplace

This article describes billing options that are available in the [Azure Marketplace](https://azuremarketplace.microsoft.com).

## Commercial considerations in the Marketplace
The Marketplace doesn't share revenue for the following listing types: 
*   List
*   Trial
*   Transact using the Bring Your Own License (BYOL) billing model

You aren't billed additional fees for participating in storefronts in the Marketplace.

For more information, see [Microsoft Azure Marketplace Participation Policies](https://azure.microsoft.com/support/legal/marketplace/participation-policies).  

## Pay-As-You-Go and BYOL billing options
When you use a Pay-As-You-Go billing model as a publishing option, your usage-based software licensing revenue is shared in an 80%/20% split between you and Microsoft. You can price a single offer both by using Pay-As-You-Go and BYOL billing models. The two billing models coexist at the offer level as separate SKUs. You configure the billing models in your offer in the Cloud Partner Portal. 

Consider the following examples:
*   If you enable the Pay-As-You-Go option, you have the following result:
    | Your license cost | $1.00 per hour |
    |:--- |:--- |
    | Azure usage cost (D1/1-Core) | $0.14 per hour |
    | *Customer is billed by Microsoft* | *$1.14 per hour* |

    In this scenario, Microsoft bills $1.14 per hour for use of your published VM image:
    | Microsoft bills | $1.14 per hour |
    |:--- |:--- |
    | Microsoft pays you 80% of your license cost | $0.80 per hour |
    | Microsoft keeps 20% of your license cost | $0.20 per hour |
    | Microsoft keeps the Azure usage cost | $0.14 per hour |

*   If you enable the BYOL option, you have the following result:
    | Your license cost | License fee negotiated and billed by you |
    |:--- |:--- |
    | Azure usage cost (D1/1-Core) | $0.14 per hour |
    | *Customer is billed by Microsoft* | *$0.14 per hour* |

    In this scenario, Microsoft bills $0.14 per hour for use of your published VM image: 
    | Microsoft bills | $0.14 per hour |
    |:--- |:--- |
    | Microsoft keeps the Azure usage cost | $0.14 per hour |
    | Microsoft keeps 0% of your license cost | $0.00 per hour |

## Single billing and payment methods
An important benefit of using the Transact publishing option in the Marketplace is that your licensing costs and Azure usage are single-billed directly to your customer.

In this scenario, Microsoft bills and collects on your behalf. Microsoft billing removes the requirement for you to create your own procurement relationship with your customer. Single billing might save you time and resources. It also might help you focus on landing the sale instead of on collecting the bill. 

## Enterprise Agreement  
If you're a Microsoft Enterprise Agreement customer, you can use your Enterprise Agreement to pay for Microsoft products. You can be billed for products, including for your Azure usage. Using your Enterprise Agreement to pay is designed for organizations that want to license software and cloud services for three or more years. You spread out payments instead of making one upfront payment. If you use a Pay-As-You-Go publishing option, the billing for your software licensing costs follows the quarterly Enterprise Agreement overage billing cycle.  

### Monetary commitment
If you're an Enterprise Agreement customer, you can add Azure to your agreement. You add Azure to your agreement by making an upfront monetary commitment to Azure. Your monetary commitment is consumed throughout the year. Your commitment includes any combination of usage of Azure services.

## Next steps
Review the [Azure Marketplace and AppSource publishing guide](./marketplace-publishers-guide.md).
