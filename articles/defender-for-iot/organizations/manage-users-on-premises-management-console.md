---
title: Create and manage users on an on-premises management console - Microsoft Defender for IoT
description: Create and manage users on a Microsoft Defender for IoT on-premises management console.
ms.date: 09/11/2022
ms.topic: how-to
---

# Create and manage users on an on-premises management console

Microsoft Defender for IoT provides tools for managing user access in the [Azure portal](manage-users-portal.md), the [OT network sensor](manage-users-sensor.md), and the on-premises management console.

This article describes how to manage on-premises users directly on an on-premises management console.

## Default privileged users

By default, each on-premises management console is installed with the privileged *cyberx* and *support* users, which have access to advanced tools for troubleshooting and setup.

When setting up a sensor for the first time, sign in with one of these user credentials, create an initial user with an **Administrator** role, and then create extra users for security analysts and read-only users.

For more information, see [Install OT monitoring software](how-to-install-software.md#install-ot-monitoring-software) and [Default privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users).

## Add new on-premises management console users

This procedure describes how to create new users for an on-premises management console, and is available for the *cyberx* and *support* users, and any user with the **Administrator** role.

**To add a user**:

1. Sign in to the on-premises management console and select **Users** > **+ Add user**.

1. Select **Create user** and then define the following values:

    |Name  |Description  |
    |---------|---------|
    |**Username**     |  Enter a username.       |
    |**Email**     |   Enter the user's email address.      |
    |**First Name**     |    Enter the user's first name.     |
    |**Last Name**     |   Enter the user's last name.      |
    |**Role**     |  Select a user role. For more information, see [On-premises user roles](roles-on-premises.md#on-premises-user-roles).      |
    |**Remote Sites Access Group**     | Available for the on-premises management console only.   <br><br> Select either **All** to assign the user to all global access groups, or **Specific** to assign them to a specific group only, and then select the group from the drop-down list.   <br><br>For more information, see [Define global access permission for on-premises users](#define-global-access-permission-for-on-premises-users).  |
    |**Password**     |   Select the user type, either **Local** or **Active Directory User**. <br><br>For local users, enter a password for the user. Password requirements include: <br>- At least eight characters<br>- Both lowercase and uppercase alphabetic characters<br>- At least one numbers<br>- At least one symbol<br><br>Integrating with Active Discovery lets you associate groups of users with specific permission levels. For more information, see [Integrate on-premises users with Active Directory](#integrate-on-premises-users-with-active-directory).|

1. Select **Save** when you're done.

> [!TIP]
> Enhance user access control by [creating global access groups](#define-global-access-permission-for-on-premises-users) on an on-premises management console. For cloud-connected sensors, you can also control user access to Azure portal features by [applying site-based access control](manage-users-portal.md).
>
> Both methods provide administrators with extra control over the users who can manage and analyze device detections, especially in large organizations with complex user permissions or global security policies.

## Control user session timeouts

<!--validate this procedure-->

By default, on-premises users are signed out of their sessions after 30 minutes of inactivity. Administrator users can use the local CLI to either turn this feature on or off, or to adjust the inactivity thresholds.

For more information, see [Work with Defender for IoT CLI commands](references-work-with-defender-for-iot-cli-commands.md).

> [!NOTE]
> Any changes made to user session timeouts are reset to defaults when you update the [OT monitoring software](update-ot-software.md).


**To control user session timeouts by CLI**:

1. On your on-premises management console, sign in as an **Administrator** user.

1. Run:

    ```cli
    sudo nano /var/cyberx/properties/authentication
    ```

    The following output appears:

    ```cli
    infinity_session_expiration = true
    session_expiration_default_seconds = 0
    # half an hour in seconds (comment)
    session_expiration_admin_seconds = 1800
    # a day in seconds
    session_expiration_security_analyst_seconds = 1800
    # a week in seconds
    session_expiration_read_only_users_seconds = 1800
    ```

1. Do either of the following:

    - To turn off user session timeouts entirely, change `infinity_session_expiration = true` to `infinity_session_expiration = false`. Change it back to turn it back on again.
    - To adjust an inactivity timeout period, adjust the `= <number>` value to the required time, in seconds.


### Reset a user's password

<!--validate this procedure-->
Users with an administrator role can change passwords for other users who have either the **Security Analyst** or **Read-only** role.

Administrator users cannot change their own passwords, and must contact a user who has access to either the *cyberx* or *support* user to have their passwords reset.

This procedure is not supported for users with **Security analyst** or **Read-only** roles. [On-premises user roles](roles-on-premises.md#on-premises-user-roles).

**To reset a user's password on the sensor**:

1. Sign into the sensor as either the *cyberx* or *support* user, or another user with the **Administrator** role.

1. Select **Users** from the left, and locate the user whose password needs to be changed.

1. At the right of that user row, do one of the following:

    - On the sensor console, select the options (**...**) menu > **Edit**.
    - On the on-premises management console, select the **Edit** button.

1. In the **Change password** pane that appears, enter and confirm the new password.

    Passwords must be at least 16 characters, contain lowercase and uppercase alphabetic characters, numbers, and one of the following symbols: **#%*+,-./:=?@[]^_{}~**

1. Select **Update** when you're done.

### Recover a password

<!--validate this procedure-->

The *cyberx* and *support* users can recover passwords for users on sensors or an on-premises management console.

This procedure is not supported for users with **Security analyst** or **Read-only** roles. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

**To recover a password**:

1. Start signing in to your sensor or on-premises management console. On the sign-in screen, select **Password recovery**. <!--For example: TBD-->

1. Select either **CyberX** or **Support** from the drop-down menu, and copy the unique identifier code to the clipboard.

    :::image type="content" source="media/how-to-create-and-manage-users/password-recovery-screen.png" alt-text="Screenshot of selecting either the Defender for IoT user or the support user.":::

1. On the Azure portal:

    1. Go to the Defender for IoT **Sites and Sensors** page.

    1. From the Azure toolbar, select the **Subscription Filter** icon :::image type="icon" source="media/password-recovery-images/subscription-icon.png" border="false":::  and make sure that the subscription your sensor is connected to is selected.

    1. Select the **More Actions** drop down menu, and select **Recover on-premises management console password**.

        :::image type="content" source="media/how-to-create-and-manage-users/recover-password.png" alt-text="Screenshot of the recover on-premises management console password option.":::

    1. Enter the unique identifier that you received on the **Password recovery** screen from either the sensor or the on-premises management console, and then select **Recover**. The `password_recovery.zip` file is downloaded.

        :::image type="content" source="media/how-to-create-and-manage-users/enter-identifier.png" alt-text="Screenshot of entering enter the unique identifier and then selecting recover." lightbox="media/how-to-create-and-manage-users/enter-identifier.png":::

       [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. Back on the sensor or on-premises management console, on the **Password recovery** screen, select **Upload**.

1. In the **Upload Password Recovery File** dialog, select **Browse** to locate your `password_recovery.zip` file, or drag the `password_recovery.zip` to the window.

    > [!NOTE]
    > An error message may appear indicating the file is invalid. To fix this error message, ensure you selected the right subscription before downloading the `password_recovery.zip` and download it again.

1. Select **Next** > you user account. A system-generated password for your management console appears for you to use.

## Define global access permission for on-premises users

Large organizations often have a complex user permissions model based on global organizational structures. To manage your on-premises Defender for IoT users, use a global business topology that's based on business units, regions, and sites, and then define user access permissions around those entities.

> [!TIP]
> Access groups and rules help to implement zero-trust strategies by controlling where users manage and analyze devices on Defender for IoT sensors and the on-premises management console. For more information, see [Gain insight into global, regional, and local threats](how-to-gain-insight-into-global-regional-and-local-threats.md).
>

### Create on-premises access groups

Create *user access groups* to establish global access control across Defender for IoT on-premises resources. Each access group includes rules about the users that can access specific entities in your business topology, including business units, regions, and sites.

For example, the following diagram shows how you can allow security analysts from an Active Directory group to access all West European automotive and glass production lines, along with a plastics line in one region:

:::image type="content" source="media/how-to-define-global-user-access-control/sa-diagram.png" alt-text="Diagram of the Security Analyst Active Directory group.":::

**Prerequisites**:

You must have administrator access to an on-premises management console to create access groups.

Before you create access groups, we also recommend that you:

- Carefully set up your business topology. For more information about business topology, see [Work with site map views](how-to-gain-insight-into-global-regional-and-local-threats.md#work-with-site-map-views).

    - For a rule to be successfully applied, you must assign sensors to zones in the **Site Management** window.

- Plan which users are associated with the access groups that you create. Two options are available for assigning users to access groups:

  - **Assign groups of Active Directory groups**: Verify that you set up an Active Directory instance to integrate with the on-premises management console.

  - **Assign local users**: Verify that you created users. For more information, see [Add new on-premises management console users](#add-new-on-premises-management-console-users).


> [!NOTE]
> Users with **Administrator** roles can't be assigned to access groups, and have access to all business topology entities by default.

**To create access groups**:

<!--validate this procedure, use consistent language for UI elements-->

1. Sign in to the on-premises management console as user with an **Administrator** role.

1. Select **Access Groups** from the left navigation menu, and then select **Add** :::image type="icon" source="media/how-to-define-global-user-access-control/add-icon.png" border="false":::.

1. In the **Add Access Group** dialog box, enter a meaningful name for the access group, with a maximum of 64 characters.

1. Add users with one or both of the following methods:

    - If the **Assign an Active Directory Group** option appears, assign an Active Directory group of users to this access group as needed. For example:

       :::image type="content" source="media/how-to-define-global-user-access-control/add-access-group.png" alt-text="Assign an Active Directory group in the Create Access Group dialog box.":::

       If the option doesn't appear, and you want to include Active Directory groups in access groups, select **System Settings**. On the **Integrations** pane, define the groups you want to include, in lowercase and exactly as they appear in the Active Directory configuration.

    - Add local users by assigning users in the **Users** pane.

    If you have previously created access groups and rules, you can assign users to multiple groups at the same time.

1. Select **ADD RULE**, and then select the business topology options that you want to include in the access group. The options that appear  in the **Add Rule** dialog are the entities that you'd created in the **Enterprise View** and **Site Management** pages. For example:

   :::image type="content" source="media/how-to-define-global-user-access-control/add-rule.png" alt-text="Add a rule to your system.":::

    If they don't otherwise exist yet, default global business units and regions are created for the first group you create, which you can edit as needed. If you don't select any business units or regions, users in the access group will have access to all business topology entities.

    Each rule can include only one element per type. For example, you can assign one business unit, one region, and one site for each rule. If you want the same users to have access to multiple business units, in different regions, create more rules for the group. When an access group contains several rules, the rule logic aggregates all rules using an AND logic.

Any rules you create are listed in the **Add Access Group** dialog box, where you can edit them further or delete them as needed. For example:

:::image type="content" source="media/how-to-define-global-user-access-control/edit-access-groups.png" alt-text="View and edit all of your access groups from this window.":::

> [!IMPORTANT]
> If you later modify a topology entity and the change affects the rule logic, the rule is automatically deleted. If modifications to topology entities affect rule logic so that all rules are deleted, the access group remains but users won't be able to sign in to the on-premises management console. Instead, users are notified to contact their on-premises management console administrator for help signing in.


## Integrate on-premises users with Active Directory

Allow Active Directory users to sign in to your sensors or an on-premises management console by configuring the integration with Active Directory. You can also create Active Directory groups and assign specific user permissions to all users in that group, such as if you want a specific group of users to have read-only permissions.

The Defender for IoT Active Directory integration supports LDAP v3 and the following types of LDAP-based authentication.

- **Full authentication**: User details are retrieved from the LDAP server. Examples are the first name, last name, email, and user permissions.

- **Trusted user**: Only the user password is retrieved. Other user details that are retrieved are based on users defined in the sensor.

For more information, see [Other firewall rules for external services (optional)](how-to-set-up-your-network.md#other-firewall-rules-for-external-services-optional).

**To integrate with Active Directory**:

1. Sign in to your sensor console or on-premises management console as an **Administrator** user.

1. From the left navigation menu, select **System Settings**, and then select one of the following:

    - On the sensor console: Expand the **Integrations** area and then select **Active Directory**.
    - On the on-premises management console: Scroll down to the **Management console integrations** area on the right, and then select **Active Directory**.

1. Toggle on or select the **Active Directory Integration Enabled** option, depending on where you're configuring the integration.

1. Enter the following values for an Active Directory server:

    - **Domain Controller FQDN**: The fully qualified domain name (FQDN), exactly as it appears on your LDAP server. For example, enter `host1.subdomain.domain.com`.

    - **Domain Controller Port**: The port on which your LDAP is configured.

    - **Primary Domain**: The domain name, such as `subdomain.domain.com`, and then select the connection type for your LDAP configuration.

        Supported connection types include: **LDAPS/NTLMv3** (recommended), **LDAP/NTLMv3**, or **LDAP/SASL-MD5**

    - **Active Directory Groups**: Select **+ Add** to add an Active Directory group to each permission level listed, as needed. When you enter a group name, make sure that you enter the group name as it's defined in your Active Directory configuration on the LDAP server. Then, make sure to use these groups when creating new sensor users from Active Directory.

        Supported permission levels include **Read-only**, **Security Analyst**, **Admin**, and **Trusted Domains**.

        Add groups as **Trusted endpoints** in a separate row from the other Active Directory groups. To add a trusted domain, add the domain name and the connection type of a trusted domain. You can configure trusted endpoints only for users who were defined under users. <!--validate this-->

    Select **+ Add Server** to add another server and enter its values as needed, and **Save** when you're done.

    > [!IMPORTANT]
    > When entering LDAP parameters:
    >
    > - Define values exactly as they appear in Active directory, except for the case.
    > - User lowercase only, even if the configuration in Active Directory uses uppercase.
    > - LDAP and LDAPS can't be configured for the same domain. However, you can configure each in different domains and then use them at the same time.
    >

1. Create access group rules for on-premises console users. If you configure Active Directory groups for on-premises management console users, you must also create an access group rule for each Active Directory group. Active Directory credentials won't work for on-premises management console users without a corresponding access group rule. For more information, see [Define global access permission for on-premises users](#define-global-access-permission-for-on-premises-users).

## Next steps

For more information, see:

- [Track on-premises user activity](track-user-activity.md)
- [Manage users for OT network security](manage-users-portal.md)