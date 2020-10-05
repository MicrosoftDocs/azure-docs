---
title: Find Tenant ID, Object ID, and partner association details
description: How to Find the Tenant ID, Object ID, and partner association details of a subscription ID in the Azure marketplace.
ms.service: marketplace
ms.topic: article
author: keferna
ms.author: keferna
ms.date: 10/09/2020
---

# Find Tenant ID, Object ID, and partner association details

This article describes how to find the Tenant ID, Object ID, and partner association details, along with their respective subscription IDs.

>[!Note]
> Only the owner of a subscription has the privileges to perform these steps.

## Find Tenant ID

1. Go to the [Azure portal](https://ms.portal.azure.com/).
2. Select **Azure Active Directory**.

    :::image type="content" source="media/tenant-and-object-id/icon-aad.png" alt-text="The Azure Active Directory icon in Azure portal.":::

3. Select **Groups**. Your Tenant ID is located in the **Tenant information** box.

    :::image type="content" source="media/tenant-and-object-id/select-groups.png" alt-text="Select Groups in Azure portal.":::

## Find subscriptions and roles

1. Go to the Azure portal and select **Azure Active Directory** as noted in steps 1 and 2 above.
2. Select **Subscriptions**.

    :::image type="content" source="media/tenant-and-object-id/icon-azure-subscriptions.png" alt-text="The Subscriptions icon in Azure portal.":::

3. View subscriptions and roles.

    :::image type="content" source="media/tenant-and-object-id/subscriptions-screen.png" alt-text="The Subscriptions screen in Azure portal.":::

## Find Partner ID

1. Navigate to the Subscriptions page as described in the previous section.
2. Select a subscription.
3. Under **Billing**, select **Partner information**.

## Find User (Object ID)

1. Sign in to the [Office 365 Admin Portal](https://portal.office.com/adminportal/home) with an account in the desired tenant with the appropriate administrative rights.
2. In the left-side menu, expand the **Admin Centers** section at the bottom and then select the Azure Active Directory option to launch the admin console in a new browser window.
3. Select **Users**.
4. Browse to or search for the desired user, then select the account name to view the user account’s profile information.
5. The Object ID is located in the Identity section on the right.

    :::image type="content" source="media/tenant-and-object-id/aad-admin-center.png" alt-text="Azure Active Directory admin center.":::

6. Find **role assignments** by selecting **Access control (IAM)** in the left menu, then **Role assignments**.

    :::image type="content" source="https://docs.microsoft.com/azure/role-based-access-control/media/role-assignments-portal/role-assignments.png" alt-text="Role assignments in Azure Active Directory.":::
