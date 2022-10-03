---
title: Add new publishers to the commercial marketplace program - Azure Marketplace
description: How to add new publishers to the commercial marketplace program for a Microsoft commercial marketplace account in Partner Center.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: sharath-satish-msft
ms.author: shsatish
ms.custom: contperf-fy21q2
ms.date: 01/20/2022
---

# Add new publishers to the commercial marketplace program

**Appropriate roles**

- Owner
- Manager

An organization can have multiple publishers associated with a commercial marketplace account. A user who is part of an existing publisher account can add publishers.

> [!NOTE]
> Before you add a new publisher, review your list of existing publishers by signing into Partner Center and selecting **Settings** > **Account Settings**. Then in the left-menu, under **Organization profile**, select **Identifiers**. The publishers on your account are listed under **Publisher**.

## Add new publishers

1. Sign in to [Partner Center](https://go.microsoft.com/fwlink/?linkid=2165507).
1. In the upper-right, select **Settings** (gear icon) > **Account settings**.
1. Under **Organization Profile**, select **Identifiers**.
1. In the **Publisher** section, select **Add publisher**.
1. Choose the PartnerID (formerly MPN ID) that you want to associate with the publisher.
1. Update the **Publisher details** on the form.

    - **Publisher location**: Select the PartnerID you want to use for this new user.
    - **Publisher name**: The name that's displayed in the commercial marketplace with the offer.  
    - **PublisherID**: An identifier that's used by Partner Center to uniquely identify the publisher. The default value for this field maps to an existing and unique Publisher ID in the system. Because the Publisher ID can't be reused, this field needs to be updated.  
    - **Contact information**: Update the contact information when necessary.

1. Select the **Accept and continue** check box and then select **Save**.

After you add a publisher, to work in the context of this account, you can switch to it using the account picker in the left navigation. Once you switch to this publisher account, you can assign appropriate [user roles and permissions](user-roles.md) to your users, so they can have access to the commercial marketplace program on this publisher account.

## Next steps

- [Manage your commercial marketplace account in Partner Center](manage-account.md)
- [What is the Microsoft commercial marketplace?](overview.md)
