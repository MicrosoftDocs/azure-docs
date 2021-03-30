---
title: Add new publishers to the commercial marketplace program
description: How to add new publishers to the commercial marketplace program for a Microsoft commercial marketplace account in Partner Center.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 03/31/2021
author: parthpandyaMSFT
ms.author: parthp
ms.custom: contperf-fy21q2
---

# Add new publishers to the commercial markeplace program

**Appropriate roles**

- Owner
- Manager

An organization can have multiple publishers associated with a commercial marketplace account.

>[!NOTE]
>Before you add a new publisher, review your list of existing publishers by signing in to Partner Center and selecting **Settings** > **Account Settings**. Then in the left-nav, under **Organization profile**, select **Identifiers**. The publishers on your account are listed under **Publisher**.

There are two ways to add a publisher, depending on whether you are part of a publisher account:

- [Add a publisher if you are part of a publisher account](#add-a-publisher-if-you-are-part-of-a-publisher-account)
- [Add a publisher if you are not part of a publisher account](#add-a-publisher-if-you-are-not-part-of-a-publisher-account)

## Add a publisher if you are part of a publisher account

A user who is part of an existing publisher account can add publishers.

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
1. In the top-right, select **Settings** > **Account settings**.
1. Under **Organization Profile**, select **Identifiers**.
1. In the **Publisher** section, select **Add publisher**.

After you add a publisher, to work in the context of this account, you can switch to it using the account picker in the left navigation. Once you switch to this publisher account, you can assign appropriate user roles and permissions to your users, so they can have access to the commercial marketplace program on this publisher account.

## Add a publisher if you are not part of a publisher account

Users who are not part of a publisher account and are from the same Azure Active Directory tenant can use these steps to add a new publisher.

1. Kick off the sign-up flow at [Microsoft Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) and select the **Build** box.
2. Select **Sign in with a work account**, and enter your work email address.
3. Select the **Add Publisher** button.
4. Choose the MPN ID that you want to associate with the publisher.
5. Update the **Publisher details** on the form.

   * **Publisher name**: The name that's displayed in the commercial marketplace with the offer.  
   * **PublisherID**: An identifier that's used by Partner Center to uniquely identify the publisher. The default value for this field maps to an existing and unique Publisher ID in the system. Because the Publisher ID can't be reused, this field needs to be updated.  
   * **Contact information**: Update the contact information when necessary.

After this process is completed, go to the commercial marketplace account that's listed in the left pane to manage the newly created publisher. If you don't see the commercial marketplace account, refresh the page. The new publisher appears in the **Publishers** list.

## Next steps

- [Manage your commercial marketplace account in Partner Center](manage-account.md)
- [What is the Microsoft commercial marketplace?](overview.md)
