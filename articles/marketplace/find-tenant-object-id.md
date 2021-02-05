---
title: Find Tenant ID, Object ID, and partner association details in Azure Marketplace
description: How to Find the Tenant ID, Object ID, and partner association details of a subscription ID in the Azure Marketplace.
ms.service: marketplace
ms.topic: article
author: keferna
ms.author: keferna
ms.date: 10/09/2020
---

# Find Tenant ID, Object ID, and partner association details

This article describes how to find the Tenant ID, Object ID, and partner association details, along with their respective subscription IDs.

If you need to get screenshots of these items in Azure Cloud Shell to use for debugging assistance, jump down to [Find Tenant, Object, and Partner ID association for debugging](#find-ids-for-debugging).

>[!Note]
> Only the owner of a subscription has the privileges to perform these steps.

## Find Tenant ID

1. Go to the [Azure portal](https://ms.portal.azure.com/).
2. Select **Azure Active Directory**.

    :::image type="content" source="media/tenant-and-object-id/icon-azure-ad.png" alt-text="The Azure Active Directory icon in Azure portal.":::

3. Select **Overview**. Your Tenant ID should appear under **Basic information**.

    :::image type="content" source="media/tenant-and-object-id/select-groups-1.png" alt-text="Select Groups in Azure portal.":::

## Find subscriptions and roles

1. Go to the Azure portal and select **Azure Active Directory** as noted in steps 1 and 2 above.
2. Select **Subscriptions**.

    :::image type="content" source="media/tenant-and-object-id/icon-azure-subscriptions-1.png" alt-text="The Subscriptions icon in Azure portal.":::

3. View subscriptions and roles.

    :::image type="content" source="media/tenant-and-object-id/subscriptions-screen-1.png" alt-text="The Subscriptions screen in Azure portal.":::

## Find Partner ID

1. Navigate to the Subscriptions page as described in the previous section.
2. Select a subscription.
3. Under **Billing**, select **Partner information**.

    :::image type="content" source="media/tenant-and-object-id/menu-partner-information.png" alt-text="Partner information in the left-nav menu.":::

## Find User (Object ID)

1. Sign in to the [Office 365 Admin Portal](https://portal.office.com/adminportal/home) with an account in the desired tenant with the appropriate administrative rights.
2. In the left-side menu, expand the **Admin Centers** section at the bottom and then select the Azure Active Directory option to launch the admin console in a new browser window.
3. Select **Users**.
4. Browse to or search for the desired user, then select the account name to view the user account’s profile information.
5. The Object ID is located in the Identity section on the right.

    :::image type="content" source="media/tenant-and-object-id/azure-ad-admin-center.png" alt-text="Azure Active Directory admin center.":::

6. Find **role assignments** by selecting **Access control (IAM)** in the left menu, then **Role assignments**.

    :::image type="content" source="https://docs.microsoft.com/azure/role-based-access-control/media/role-assignments-portal/role-assignments.png" alt-text="Role assignments for Azure resources.":::

## Find IDs for debugging

This section describes how to find tenant, object, and partner ID association for debugging purposes.

1. Go to the [Azure portal](https://ms.portal.azure.com/).
2. Open Azure Cloud Shell by selecting the PowerShell icon at the top-right.

    :::image type="content" source="media/tenant-and-object-id/icon-azure-cloud-shell-1.png" alt-text="PowerShell icon at the top right of the screen.":::

3. Select **PowerShell**.

    :::image type="content" source="media/tenant-and-object-id/icon-powershell.png" alt-text="Select the PowerShell link.":::

4. Select the **Subscription** box to choose the one to which the partner is linked, then **Create Storage**. This is a one-time action; if you already have storage set up, proceed to the next step.

    :::image type="content" source="media/tenant-and-object-id/create-storage-window.png" alt-text="Select the Create Storage button.":::

5. Creating (or already having) storage opens the Azure Cloud Shell window.

    :::image type="content" source="media/tenant-and-object-id/cloud-shell-window-1.png" alt-text="The Azure Cloud Shell window.":::

6. For partner association details, install the extension with this command:<br>`az extension add --name managementpartner`.<br>Azure Cloud Shell will note if the extension is already installed:

    :::image type="content" source="media/tenant-and-object-id/cloud-shell-window-2.png" alt-text="The Azure Cloud Shell window showing the extension is already installed.":::

7. Check partner details using this command:<br>`az managementpartner show --partner-id xxxxxx`<br>Example: `az managementpartner show --partner-id 4760962`.<br>Snap a screenshot of the command results, which will look similar to this:

    :::image type="content" source="media/tenant-and-object-id/partner-id-sample-screenshot.png" alt-text="Sample screen showing the results of the prior command to view parter ID.":::

>[!NOTE]
>If multiple subscriptions require a screenshot, use this command to switch between subscriptions:<br>`az account set --subscription "My Demos"`

## Next steps

- [Supported countries and regions](sell-from-countries.md)