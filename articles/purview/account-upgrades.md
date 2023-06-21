---
title: Get ready for the next enhancement in Microsoft Purview
description: A new experience is coming to Microsoft Purview. This article provides the steps you need to take to try it out!
author: tomilolaabiodun
ms.author: toabiodu
ms.service: purview
ms.topic: how-to
ms.date: 06/16/2023
---

# Get ready for the next enhancement in Microsoft Purview

>[!NOTE]
>This new experience will be available within the next few weeks. Account owners and root collection admins will receive an email when it has been made available for your organization.

You spoke, we listened! Get ready for your next Microsoft Purview enhancement. We're rolling this new experience out to our customers to try. When it's available for your organization, your account owners and root collection admins will receive an email, and can follow these steps to enable the new experience!

The new experience is an enhancement to the current Microsoft Purview, and doesn't impact your information already stored in Microsoft Purview or your ability to use our APIs.

## How can you use our new experience?

The new experience is automatically available once your organization has been enabled, but getting started with it depends on your organization's current structure.
Follow one of these guides below:

- [You only have one Microsoft Purview account](#one-microsoft-purview-account)
  - [Your account region maps to your tenant region](#your-region-maps-to-an-available-region)
  - [Your account region doesn't match your tenant region](#your-region-doesnt-map-to-an-available-region)
- [You have multiple Microsoft Purview accounts](#multiple-microsoft-purview-accounts)

### One Microsoft Purview account

#### Your region maps to an available region

If your Microsoft Purview account's region matches with a currently available region, you're automatically able to use the new experience! No upgrade required.

To access it, you can either:

- Select the note at the top of the Microsoft Purview accounts page.
- Select the toggle in the Microsoft Purview governance portal.
    :::image type="content" source="./media/account-upgrades/switch.png" alt-text="Screenshot of the toggle to switch to the new experience.":::

#### Your region doesn't map to an available region

1. Have an account owner or root collection admin select the **Upgrade** button in the Azure portal, Microsoft Purview portal, or upgrade email.

1. If your account is in a different region than your tenant, an admin needs to confirm set up.

    :::image type="content" source="./media/account-upgrades/different-region.png" alt-text="Screenshot showing the different region confirmation pop-up window.":::

    >[!NOTE]
    >If you want to use a different region, you will either need to cancel and wait for upcoming region related features, or cancel and create a new Microsoft Purview account in one of the [available regions](#regions).
1. After confirmation, the new portal will launch.
1. You can take the tour and begin exploring the new Microsoft Purview experience!

>[!TIP]
>You can switch between the classic and new experiences using the toggle at the top of the portal.
>:::image type="content" source="./media/account-upgrades/switch.png" alt-text="Screenshot of the toggle to switch between the new and classic experiences after upgrading.":::

### Multiple Microsoft Purview accounts

1. Have an account owner or root collection admin select the **Upgrade** button in the Azure portal, Microsoft Purview portal, or upgrade email.
1. The new experience requires a tenant-level/organization-wide account that is the primary account for your organization. Select an existing account to upgrade it to be your organization-wide account.
    >[!NOTE]
    >This does not affect your other Microsoft Purview accounts, or their data. In the future, their information will also be made available in the primary account.

    :::image type="content" source="./media/account-upgrades/selected-account.png" alt-text="Screenshot of the pop up window for selecting an organization wide primary account.":::

1. If the account you select is in a different region than your tenant, an admin needs to confirm set up.

    :::image type="content" source="./media/account-upgrades/selected-account-different-region.png" alt-text="Screenshot of confirmation for selecting an account in a region that's different from your tenant region.":::

    >[!NOTE]
    >If you want to use a different [region](#regions), you will either need to cancel and select or create a different Microsoft Purview account, or cancel and wait for upcoming region related features.
1. After confirmation, the new portal will launch.
1. You can take the tour and begin exploring the new Microsoft Purview experience!

>[!TIP]
>You can switch between the classic and new experiences using the toggle at the top of the portal.
> :::image type="content" source="./media/account-upgrades/switch.png" alt-text="Screenshot of the toggle to switch between the new and classic experiences.":::

## Regions

These are the regions that are currently available for the new experience:

## Next steps

Stay tuned for updates! Until then, make use of Microsoft Purview's other features:

- [Create an account](create-microsoft-purview-portal.md)
- [Share and receive data](quickstart-data-share.md)
- [Data lineage](concept-data-lineage.md)
- [Data owner policies](concept-policies-data-owner.md)
- [Classification](concept-classification.md)
