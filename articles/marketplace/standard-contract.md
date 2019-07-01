---
title: Standard Contract | Azure
description: Standard Contract in Azure Marketplace and AppSource
services: Azure, Marketplace, Compute, Storage, Networking

author: qianw211


ms.service: marketplace
ms.topic: article
ms.date: 02/27/2019
ms.author: ellacroi

---
# Standard Contract

To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a Standard Contract template in order to help facilitate a transaction in the marketplace. Rather than crafting custom terms and conditions, Azure Marketplace publishers can choose to offer their software under the Standard Contract, which customers only need to vet and accept once. The Standard Contract can be found here: [https://go.microsoft.com/fwlink/?linkid=2041178](https://go.microsoft.com/fwlink/?linkid=2041178). 

The terms and conditions for an offering are defined on the Marketplace tab when creating an offer in the Cloud Partner Portal. The Standard Contract option is enabled by changing the setting to Yes.

![Enabling Standard Contract option](media/marketplace-publishers-guide/standard-contract.png)

>[!Note] 
>If you choose to use the Standard Contract, separate terms and conditions are still required for the [Cloud Solution Provider](./cloud-solution-providers.md) channel.

## Standard Contract Amendments

Standard Contract Amendments allow publishers to select the standard contract for simplicity, and also customize the terms of the offering. Customers can trust the standard contract if they have reviewed it previously, and can focus on the amendment delta to reduce procurement time.  

Standard Contract Amendments add unique terms and conditions to the standard contract:

* Enable publishers to offer software under a standardized set of common terms and condition to simplify procurement for customers.
* Alternatively, publishers can submit their own language for customer agreements.
* Standard contract terms can also be applied when the offer is sold through CSP Partners.

When entering html text terms of use, **Get-AzureRmMarketplaceTerms** will return blob url to a text file that includes Standard Contract and Amendments.  In Ibiza, AMP UX, three separate links will be shown: 

* Standard Contract. 
* Universal Amendment: applicable to all customers.
* Custom Amendment: customer specific, returned only to users related to the **TenantIds**. 

Here is a [sample **Get-AzureRmMarketplaceTerms** output](https://storelegalterms.blob.core.windows.net/legalterms/3E5ED_legalterms_COGNOSYS%253a24UBUNTU%253a2D16%253a2D04%253a2DLTS%253a24UBUNTU%253a2D16%253a2D04%253a2DLTS%253a2427FVO2MPC55MPGBEJRXXQM4W2VTE3GBGVC7UGJDAHK2JBTXIJGX2BCNPFKKHZ6JSDNI722BEZU67VEK5UVZPE5NWOM6MWNUPNKST4JY.txt ) for an offer with Standard Contract.

---
