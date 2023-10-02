---
title: Manage lab users
titleSuffix: Azure Lab Services
description: Learn how to manage lab users in Azure Lab Services. Configure the number of lab users, manage user registrations, and specify the number of hours they can use their lab VM.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 06/30/2023
---

# Manage lab users in Azure Lab Services

This article describes how to manage lab users in Azure Lab Services. Learn how to add users to a lab, manage their registration status, and how to specify the number of hours they can use the virtual machine (VM).

Azure Lab Services supports different options for managing the list of lab users:

- Add users manually to the lab by specifying their email address. Optionally, you can upload a CSV file with email addresses.
- Synchronize the list of users with an Azure Active Directory (Azure AD) group.
- Integrate with Microsoft Teams or Canvas and synchronize the user list with the team (Teams) or course (Canvas) membership.

When you add users to a lab based on their email address, lab users will first need to register for the lab by using a lab registration link. This registration process is a one-time operation. After a lab users registers for the lab, they can access their lab in the Azure Lab Services website.

When you use Teams, Canvas, or an Azure AD group, Azure Lab Services automatically grants users access to the lab and assigns a lab VM based on their membership in Microsoft or Canvas. In this case, you don't have to specify the lab user list, and users don't have to register for the lab.

By default, access to a lab is restricted. Only users that are in the list of lab users can register for a lab, and get access to the lab virtual machine (VM). You can disable restricted access for a lab, which lets any user register for a lab if they have the registration link.

Azure Lab Services supports up to 400 users per lab.
## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]
[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

## Manage lab users

# [Add users manually](#tab/manual)

### Add users

You can add lab users manually by providing their email address in the lab configuration or by uploading a CSV file.

Azure Lab Services supports different email account types when registering for a lab:

- An organizational email account that's provided by your Azure Active Directory instance.
- A Microsoft-domain email account, such as *outlook.com*, *hotmail.com*, *msn.com*, or *live.com*.
- A non-Microsoft email account, such as one provided by Yahoo! or Google. You need to link your account with a Microsoft account.
- A GitHub account. You need to link your account with a Microsoft account.

Learn more about the [supported account types](./how-to-access-lab-virtual-machine.md#user-account-types).

#### Add users by email address

1. In the [Azure Lab Services website](https://labs.azure.com/), select the lab you want to work with.

1. Select **Users**, and then select **Add users manually**.

    :::image type="content" source="./media/how-to-manage-lab-users/add-users-manually.png" alt-text="Screenshot that shows how to add users manually.":::

1. Select **Add by email address**, enter the users' email addresses on separate lines or on a single line separated by semicolons.

    :::image type="content" source="./media/how-to-manage-lab-users/add-users-email-addresses.png" alt-text="Screenshot that shows how to add users' email addresses in the Lab Services website." lightbox="./media/how-to-manage-lab-users/add-users-email-addresses.png":::

1. Select **Add**.

    The list displays the email addresses and registration status of the lab users. After a user registers for the lab, the list also displays the user's name.

    :::image type="content" source="./media/how-to-manage-lab-users/list-of-added-users.png" alt-text="Screenshot that shows the lab user list in the Lab Services website." lightbox="./media/how-to-manage-lab-users/list-of-added-users.png":::

#### Add users by uploading a CSV file

You can also add users by uploading a CSV file that contains their email addresses.

You use a CSV text file to store comma-separated (CSV) tabular data (numbers and text). Instead of storing information in columns fields (such as in spreadsheets), a CSV file stores information separated by commas. Each line in a CSV file has the same number of comma-separated *fields*. You can use Microsoft Excel to easily create and edit CSV files.

1. Use Microsoft Excel or a text editor of your choice, to create a CSV file with the users' email addresses in one column.

    :::image type="content" source="./media/how-to-manage-lab-users/csv-file-with-users.png" alt-text="Screenshot that shows the list of users in a CSV file.":::

1. In the [Azure Lab Services website](https://labs.azure.com/), select the lab you want to work with.

1. Select **Users**, select **Add users**, and then select **Upload CSV**.

1. Select the CSV file with the users' email addresses, and then select **Open**. 

    The **Add users** page shows the email address list from the CSV file.

1. Select **Add**.

    The **Users** page now shows the list of lab users you uploaded.

    :::image type="content" source="./media/how-to-manage-lab-users/list-of-added-users.png" alt-text="Screenshot that shows the list of added users in the Users page in the Lab Services website." lightbox="./media/how-to-manage-lab-users/list-of-added-users.png":::

### Send invitations to users

If the **Restrict access** option is enabled for the lab, only listed users can use the registration link to register to the lab. This option is enabled by default.

To send a registration link to new users, use one of the methods in the following sections.

#### Invite all users

You can invite all users to the lab by sending an email via the Azure Lab Services website. The email contains the lab registration link, and an optional message.

> [!TIP]
> When you register for a lab, you aren't given the option to create a new Microsoft account. It's recommended that you include this sign-up link, `https://signup.live.com`, in the lab registration email when you invite users who have non-Microsoft accounts.

To invite all users:

1. In the [Azure Lab Services website](https://labs.azure.com/), select the lab you want to work with.

1. Select **Users**, and then select **Invite all**.

    :::image type="content" source="./media/how-to-manage-lab-users/invite-all-button.png" alt-text="Screenshot that shows the Users page in the Azure Lab Services website, highlighting the Invite all button." lightbox="./media/how-to-manage-lab-users/invite-all-button.png":::

1. In the **Send invitation by email** window, enter an optional message, and then select **Send**.

    The email automatically includes the registration link. To get and save the registration link separately, select the ellipsis (**...**) at the top of the **Users** pane, and then select **Registration link**.

    :::image type="content" source="./media/how-to-manage-lab-users/send-email.png" alt-text="Screenshot that shows the Send registration link by email window in the Azure Lab Services website." lightbox="./media/how-to-manage-lab-users/send-email.png":::

    The **Invitation** column of the **Users** list displays the invitation status for each added user. The status should change to **Sending** and then to **Sent on \<date>**.

#### Invite selected users

To invite selected users and send them a lab registration link:

1. In the [Azure Lab Services website](https://labs.azure.com/), select the lab you want to work with.

1. Select **Users**, and then select one or more users from the list.

1. In the row for the user you selected, select the **envelope** icon or, on the toolbar, select **Invite**.

    :::image type="content" source="./media/how-to-manage-lab-users/invite-selected-users.png" alt-text="Screenshot that shows how to invite selected users to a lab in the Azure Lab Services website." lightbox="./media/how-to-manage-lab-users/invite-selected-users.png":::

1. In the **Send invitation by email** window, enter an optional **message**, and then select **Send**.

    :::image type="content" source="./media/how-to-manage-lab-users/send-invitation-to-selected-users.png" alt-text="Screenshot that shows the Send invitation email for selected users in the Azure Lab Services website." lightbox="./media/how-to-manage-lab-users/send-invitation-to-selected-users.png":::

    The **Users** pane displays the status of this operation in the **Invitation** column of the table. The invitation email includes the registration link that users can use to register with the lab.

#### Get the registration link

You can get the lab registration link from the Azure Lab Services website, and send it by using your own email application.

1. In the [Azure Lab Services website](https://labs.azure.com/), select the lab you want to work with.

1. Select **Users**, and then select **Registration link**.

    :::image type="content" source="./media/how-to-manage-lab-users/registration-link-button.png" alt-text="Screenshot that shows how to get the lab registration link in the Azure Lab Services website." lightbox="./media/how-to-manage-lab-users/registration-link-button.png":::

1. In the **User registration** window, select **Copy**, and then select **Done**.

    :::image type="content" source="./media/how-to-manage-lab-users/registration-link.png" alt-text="Screenshot that shows the User registration window in the Azure Lab Services website." lightbox="./media/how-to-manage-lab-users/registration-link.png":::

    The link is copied to the clipboard. In your email application, paste the registration link, and then send the email to a user so that they can register for the class.

### View registered users

To view the list of lab users that have already registered for the lab by using the lab registration link:

1. In the [Azure Lab Services website](https://labs.azure.com/), select the lab you want to work with.

1. Select **Users** to view the list of lab users.

    The list shows the list of lab users with their registration status. The user status should show **Registered**, and their name should also be available after registration.

    > [!NOTE]
    > If you [republish a lab](how-to-create-manage-template.md#publish-the-template-vm) or [Reimage VMs](how-to-manage-vm-pool.md#reimage-lab-vms), the users remain registered for the labs' VMs.  However, the contents of the VMs will be deleted and the VMs will be recreated with the template VM's image.

# [Azure AD group](#tab/aad)

You can manage the lab user list by synchronizing the lab with an Azure AD group. When you use an Azure AD group, you don't have to manually add or delete users in the lab settings. Add or remove users in Teams or Canvas to assign or remove access for a user to a lab VM.

You can create an Azure AD group within your organization's Azure AD to manage access to organizational resources and cloud-based apps. To learn more, see [Azure AD groups](../active-directory/fundamentals/active-directory-manage-groups.md). If your organization uses Microsoft Office 365 or Azure services, your organization already has admins who manage your Azure Active Directory.

Lab users don't have to register for their lab and a lab VM is automatically assigned. Lab users can [access the lab directly from the Azure Lab Services website](./how-to-access-lab-virtual-machine.md).

### Synchronize the lab user list with Azure AD group

When you sync a lab with an Azure AD group, Azure Lab Services pulls all users inside the Azure AD group into the lab as lab users. Only people in the Azure AD group have access to the lab. The user list automatically refreshes every 24 hours to match the latest membership of the Azure AD group. You can also manually synchronize the list of lab users at any time.

The option to synchronize the list of lab users with an Azure AD group is only available if you haven't added users to the lab manually or through a CSV import yet. Make sure there are no users in the lab user list.

To sync a lab with an existing Azure AD group:

1. Sign in to the [Azure Lab Services website](https://labs.azure.com/).

1. Select your lab.

1. In the left pane, select **Users**, and then select **Sync from group**.

    :::image type="content" source="./media/how-to-manage-lab-users/add-users-sync-group.png" alt-text="Screenshot that shows how to add users by syncing from an Azure AD group.":::

1. Select the Azure AD group you want to sync users with from the list of groups.

    If you don't see any Azure AD groups in the list, this could be because of the following reasons:

    - You're a guest user in Azure Active Directory (usually if you're outside the organization that owns the Azure AD), and you're not allowed to search for groups inside the Azure AD. In this case, you can't add an Azure AD group to the lab.
    - Azure AD groups you created through Microsoft Teams don't show up in this list. You can add the Azure Lab Services app inside Microsoft Teams to create and manage labs directly from within Microsoft Teams. Learn more about [managing a lab’s user list from within Teams](./how-to-manage-labs-within-teams.md#manage-lab-user-lists-in-teams).

1. Select **Add** to sync the lab users with the Azure AD group.

    Azure Lab Services automatically pulls the list of users from Azure AD, and refreshes the list every 24 hours.

    Optionally, you can select **Sync** in the **Users** tab to manually synchronize to the latest changes in the Azure AD group.

### Automatic VM management based on Azure AD group

When you synchronize a lab with an Azure AD group, Azure Lab Services automatically manages the number of lab VMs based on the number of users in the Azure AD group.

When a user is added to the Azure AD group, Azure Lab Services automatically adds a lab VM for that user. When a user is no longer a member of the Azure AD group, the lab VM for that user is automatically deleted from the lab.

You can't manually add or remove lab users, or update the lab capacity when synchronizing with an Azure AD group.

# [Teams](#tab/teams)

When you create a lab in Teams, Azure Lab Services automatically grants users access to the lab based on their team membership in Teams. When you use Teams, you can't manually add or delete users in the lab settings. Add or remove users to a team to assign or remove access for a user to a lab VM.

Lab users don't have to register for their lab and a lab VM is automatically assigned. Lab users can [access the lab directly from within Teams](./how-to-access-lab-virtual-machine.md).

Before you can use labs in Teams, follow these steps to [configure Teams for using Azure Lab Services](./how-to-configure-teams-for-lab-plans.md).

### Synchronize the lab user list with Teams

Azure Lab Services automatically synchronizes the membership information with the lab user list every 24 hours. Lab creators can select **Sync** in the **Users** tab to manually trigger a sync, for example when the team membership is updated.

:::image type="content" source="./media/how-to-manage-lab-users/sync-users.png" alt-text="Screenshot that shows how to manually sync users with Azure Lab Services in Teams.":::

### Automatic VM management based on team membership

When you create labs in Teams, Azure Lab Services also automatically manages the number of lab VMs based on the number of users in the team.

When a user is added in Teams, Azure Lab Services automatically adds a lab VM for that user. When a user is no longer a member, the lab VM for that user is automatically deleted from the lab.

You can't manually add or remove lab users, or update the lab capacity when creating labs in Teams.

# [Canvas](#tab/canvas)

When you create a lab in Canvas, Azure Lab Services automatically grants users access to the lab based on their course membership in Canvas. When you use Canvas, you can't manually add or delete users in the lab settings. Add or remove users for a course in Canvas to assign or remove access for a user to a lab VM.

Lab users don't have to register for their lab and a lab VM is automatically assigned. Lab users can [access the lab directly from within Canvas](./how-to-access-lab-virtual-machine.md).

Before you can use labs in Canvas, follow these steps to [configure Canvas for using Azure Lab Services](./how-to-configure-canvas-for-lab-plans.md).

### Synchronize the lab user list with Canvas

Azure Lab Services automatically synchronizes the membership information with the lab user list every 24 hours. Lab creators can select **Sync** in the **Users** tab to manually trigger a sync, for example when the course membership is updated.

:::image type="content" source="./media/how-to-manage-lab-users/sync-users.png" alt-text="Screenshot that shows how to manually sync users with Azure Lab Services in Canvas.":::

### Automatic VM management based on course membership

When you create labs in Canvas, Azure Lab Services also automatically manages the number of lab VMs based on the number of users in the course.

When a user is added in Canvas, Azure Lab Services automatically adds a lab VM for that user. When a user is no longer a member, the lab VM for that user is automatically deleted from the lab.

You can't manually add or remove lab users, or update the lab capacity when creating labs in Canvas.

---

## Set quotas for users

Quota hours enable lab users to use the lab for a number of hours outside of scheduled lab times. For example, users might access the lab to complete their homework. Learn more about [quota hours](./classroom-labs-concepts.md#quota).

You can set an hour quota for a user in one of two ways:

1. In the **Users** pane, select **Quota per user: \<number> hour(s)** on the toolbar.

1. In the **Quota per user** window, specify the number of hours you want to give to each user outside the scheduled time.

    :::image type="content" source="./media/how-to-manage-lab-users/quota-per-user.png" alt-text="Screenshot that shows the Quota per user window in the Azure Lab Services website." lightbox="./media/how-to-manage-lab-users/quota-per-user.png":::

    > [!IMPORTANT]
    > The [scheduled running time of VMs](how-to-create-schedules.md) does not count against the quota that's allotted to a user. The quota is for the time outside of scheduled hours that a user spends on VMs.

### Set additional quotas for specific users

You can specify extra quota hours for individual users, beyond the quotas you define at the lab level. For example, if you set the quota for all users to 10 hours and set an additional quota of 5 hours for a specific user, that user gets 15 (10 + 5) hours of quota. If you change the common quota later to, say, 15, the user gets 20 (15 + 5) hours of quota.

Remember that this overall quota is outside the scheduled time. The time that a user spends on a lab VM during the scheduled time doesn't count against this quota.

To set additional quotas for a user:

1. In the **Users** pane, select one or more users from the list, and then select **Adjust quota** on the toolbar.

1. In the **Adjust quota** window, enter the number of additional lab hours you want to grant to the selected users, and then select **Apply**.

    :::image type="content" source="./media/how-to-manage-lab-users/additional-quota.png" alt-text="Screenshot that shows the Adjust quota window in the Azure Lab Services website." lightbox="./media/how-to-manage-lab-users/additional-quota.png":::

1. Select **Apply** to save the changes.

    Notice that the user list shows the updated quota hours for the users you selected.

## Export the list of users to a CSV file

To export the list of users for a lab:

1. Select the lab you want to work with.

1. Select **Users**.

1. On the toolbar, select the ellipsis (**...**), and then select **Export CSV**.

    :::image type="content" source="./media/how-to-manage-lab-users/users-export-csv.png" alt-text="Screenshot that shows how to export the list of lab users to a CSV file in the Azure Lab Services website." lightbox="./media/how-to-manage-lab-users/users-export-csv.png":::

## Next steps

- Learn how to [add lab schedules](./how-to-create-schedules.md)
- Learn how to [manage lab VM pools](./how-to-manage-vm-pool.md)
- Learn how to [access a lab VM](./how-to-access-lab-virtual-machine.md)
