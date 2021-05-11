---

title: Register using CSP Partner information with Cloudyn in Azure
description: Learn details about the registration process used by partners to onboard their customers to the Cloudyn portal.
author: bandersmsft
ms.author: banders
ms.date: 10/23/2020
ms.topic: quickstart
ms.custom: seodec18
ms.service: cost-management-billing
ms.subservice: cloudyn
ms.reviewer: benshy
ROBOTS: NOINDEX
---

# Register with the CSP Partner program and view cost data

As a CSP partner and a registered Cloudyn user, you can view and analyze your cloud spend in Cloudyn. [Azure Cost Management is natively available for direct partners](../costs/get-started-partners.md) who have onboarded their customers to a Microsoft Customer Agreement and have purchased an Azure Plan.

Your registration provides access to the Cloudyn portal. This quickstart details the registration process needed to create a Cloudyn trial subscription and sign in to the Cloudyn portal.

[!INCLUDE [cloudyn-note](../../../includes/cloudyn-note.md)]

## Configure indirect CSP access in Cloudyn

By default, the Partner Center API is only accessible to direct CSPs. However, a direct CSP provider can configure access for their indirect CSP customers or partners using entity groups in Cloudyn.

To enable access for indirect CSP customers or partners, complete the following steps to segment indirect CSP data by using Cloudyn entity groups. Then, assign the appropriate user permissions to the entity groups.

1. Create an entity group with the information at [Create entities](tutorial-user-access.md#create-and-manage-entities).
2. Follow the steps at [Assigning subscriptions to Cost Entities](https://www.youtube.com/watch?v=d9uTWSdoQYo). Associate the indirect CSP customer's account and their Azure subscriptions to the entity that you create previously.
3. Follow the steps at [Create a user with admin access](tutorial-user-access.md#create-a-user-with-admin-access) to create a user account with Admin access. Then, ensure the user account has admin access to the specific entities that you created previously for the indirect account.

Indirect CSP partners sign in to the Cloudyn portal using the accounts that you created for them.


[!INCLUDE [cost-management-create-account-view-data](../../../includes/cost-management-create-account-view-data.md)]

## Next steps

In this quickstart, you used your CSP information to register with Cloudyn. You also signed into the Cloudyn portal and started viewing cost data. To learn more about Cloudyn, continue to the tutorial for Cloudyn.

> [!div class="nextstepaction"]
> [Review usage and costs](tutorial-review-usage.md)