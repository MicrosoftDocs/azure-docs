---
title: View Azure reservations as a Cloud Solution Provider
description: Learn how you can view Azure Reservations as a Cloud Solution Provider.
ms.service: cost-management-billing
ms.subservice: reservations
author: bandersmsft
ms.reviewer: primittal
ms.topic: how-to
ms.date: 06/28/2024
ms.author: banders
---

# View Azure reservations as a Cloud Solution Provider (CSP)

Cloud Solution Providers can access reservations that are purchased for their customers. Use the following information to view reservations in the Azure portal.

Reservations don't support roles assigned with Azure Lighthouse. To view reservations, you need to be a global admin or an admin agent in the customer's tenant.

## View reservations

1. Contact your global admin to get yourself added as an **admin agent** in your tenant.
    The option is available to global admins in the Partner Center. It's under **Settings** (the gear symbol on the top right of the page) > **User management**.  
1. After you have admin agent privilege, go to the Azure portal using the **Admin on Behalf Of** link.
1. Navigate to Partner Center > **Customers** > expand customer details > **Microsoft Azure Management Portal**.
1. In the Azure portal, go to **Reservations**.

> [!NOTE]
> Being a guest in the customer's tenant allows you to view reservations. However, guest access prevents you from refunding or exchanging reservations. To make changes to reservations, you must remove guest access from the tenant. Admin agent privilege doesn't override guest access.

- To remove your guest access in the Partner Center, navigate to **My Account** > **[Organizations](https://myaccount.microsoft.com/organizations)** and then select **Leave organization**.

Alternately, ask another user who can access the reservation to add your guest account to the reservation order.

## Related content

- [View Azure reservations](view-reservations.md)