---
title: Create and manage users on an OT network sensor - Microsoft Defender for IoT
description: Create and manage on-premises users on a Microsoft Defender for IoT OT network sensor.
ms.date: 09/28/2022
ms.topic: how-to

---
# Create and manage users on an OT network sensor

Microsoft Defender for IoT provides tools for managing user access in the [Azure portal](manage-users-portal.md), on OT network sensors, and on the [on-premises management console](manage-users-on-premises-management-console.md).

This article describes how to manage on-premises users directly on an OT network sensor.

## Default privileged users

By default, each OT network sensor is installed with the privileged *cyberx*, *support*, and *cyberx_host* users, which have access to advanced tools for troubleshooting and setup.

When setting up a sensor for the first time, sign in with one of these user credentials, create an initial user with an **Administrator** role, and then create extra users for security analysts and read-only users.

For more information, see [Install OT monitoring software](how-to-install-software.md#install-ot-monitoring-software) and [Default privileged on-premises users](how-to-install-software.md#default-privileged-on-premises-users).

## Add new OT sensor users

This procedure describes how to create new users for a specific OT network sensor, and is available for the *cyberx* and *support* users, and any user with the **Admin** role.

**To add a user**:

1. Sign in to the sensor console and select **Users** > **+ Add user**.

1. On the **Create a user | Users** page, enter the following details:

    |Name  |Description  |
    |---------|---------|
    |**User name**     |  Enter a meaningful username for the user.       |
    |**Email**     |   Enter the user's email address.      |
    |**First Name**     |    Enter the user's first name.     |
    |**Last Name**     |   Enter the user's last name.      |
    |**Role**     |  Select one of the following user roles: *Admin*, *Security Analyst*, or *Read Only*. For more information, see [On-premises user roles](roles-on-premises.md#on-premises-user-roles).      |
    |**Password**     |   Select the user type, either **Local** or **Active Directory User**. <br><br>For local users, enter a password for the user. Password requirements include: <br>- At least eight characters<br>- Both lowercase and uppercase alphabetic characters<br>- At least one numbers<br>- At least one symbol<br><br>Integrating with Active Discovery lets you associate groups of users with specific permission levels. For more information, see [Integrate on-premises users with Active Directory](#integrate-on-premises-users-with-active-directory).|

1. Select **Save** when you're done.

Your new user is added and is listed on the sensor **Users** page.

## Integrate OT sensor users with Active Directory

Configure an integration between your sensor and Active Directory to:

- Allow Active Directory users to sign in to your sensor
- Use Active Directory groups, with collective permissions assigned to all users in the group

For example, use Active Directory when you have a large number of users that you want to assign Read Only access to, and you want to manage those permissions at the group level.

This procedure is available for the *cyberx* and *support* users, and any user with the **Admin** role.

**To integrate with Active Directory**:

1. Sign in to your OT sensor and select **System Settings** > **Integrations** > **Active Directory**.

1. Toggle on the **Active Directory Integration Enabled** option.

1. Enter the following values for your Active Directory server:

    - **Domain Controller FQDN**: The fully qualified domain name (FQDN), exactly as it appears on your LDAP server. For example, enter `host1.subdomain.domain.com`.

    - **Domain Controller Port**: The port on which your LDAP is configured.

    - **Primary Domain**: The domain name, such as `subdomain.domain.com`, and then select the connection type for your LDAP configuration.

    - **Active Directory Groups**: Select **+ Add** to add an Active Directory group to each permission level listed, as needed.

        When you enter a group name, make sure that you enter the group name exactly as it's defined in your Active Directory configuration on the LDAP server. You'll use these group names when [adding new sensor users](#add-new-ot-sensor-users) with Active Directory.

        Supported permission levels include **Read-only**, **Security Analyst**, **Admin**, and **Trusted Domains**.

    > [!IMPORTANT]
    > When entering LDAP parameters:
    >
    > - Define values exactly as they appear in Active directory, except for the case.
    > - User lowercase only, even if the configuration in Active Directory uses uppercase.
    > - LDAP and LDAPS can't be configured for the same domain. However, you can configure each in different domains and then use them at the same time.
    >

1. To add another Active Directory server, select **+ Add Server** at the top of the page and define those server values.

1. When you've added all your Active Directory servers, select **Save**.

### Supported authentication methods

The Defender for IoT Active Directory integration supports LDAP v3 and the following types of LDAP-based authentication.

- **Full authentication**: User details are retrieved from the LDAP server. Examples are the first name, last name, email, and user permissions.

- **Trusted user**: Only the user password is retrieved. Other user details that are retrieved are based on users defined in the sensor.

For more information, see [Other firewall rules for external services (optional)](how-to-set-up-your-network.md#other-firewall-rules-for-external-services-optional).


### Change a sensor user's password

Users with an **Admin** role can change passwords for other users who have either the **Security Analyst** or **Read-only** role.

Admin users cannot change their own passwords, and must contact a team member who has access to either the *cyberx* or *support* user to have their passwords reset.

This procedure is not supported for users with **Security analyst** or **Read-only** roles. For more information, see [On-premises user roles](roles-on-premises.md#on-premises-user-roles).

**To change a user's password on a sensor**:

1. Sign into the sensor and select **Users**.

1. On the sensor's **Users** page, locate the user whose password needs to be changed.

1. At the right of that user row, select the options (**...**) menu > **Edit** to open the user pane.

1. In the user pane on the right, in the **Change password** area, enter the current password, the new password, and then confirm the new password.

    Password requirements include:

    - At least eight characters
    - Both lowercase and uppercase alphabetic characters
    - At least one numbers
    - At least one symbol

1. Select **Save** when you're done.

### Recover another sensor user's password

This procedure describes how to the *cyberx* or *support* users can recover another user's password on an OT network sensor.

This procedure is not supported for users with **Admin*, **Security analyst** or **Read-only** roles. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md). <!--is it supported for admin users?-->

**To recover a sensor user's password**:

1. Start signing in to the OT network sensor. On the sign-in screen, select **Password recovery**. FOR EXAMPLE: TBD

1. Select either **CyberX** or **Support** from the drop-down menu, depending on how you're signing in, and copy the unique identifier code to the clipboard. For example:

    :::image type="content" source="media/how-to-create-and-manage-users/password-recovery-screen.png" alt-text="Screenshot of selecting either the Defender for IoT user or the support user.":::

1. On the Azure portal:

    1. Go to the Defender for IoT **Sites and Sensors** page.

    1. From the Azure toolbar, select the **Subscription Filter** icon :::image type="icon" source="media/password-recovery-images/subscription-icon.png" border="false":::  and make sure that the subscription your sensor is connected to is selected.

    1. Select the **More Actions** drop down menu, and select **Recover on-premises management console password**. This is the relevant option, even if you're recovering a password for a sensor user.

        :::image type="content" source="media/how-to-create-and-manage-users/recover-password.png" alt-text="Screenshot of the recover on-premises management console password option.":::

    1. Enter the unique identifier that you received on the **Password recovery** screen from either the sensor or the on-premises management console, and then select **Recover**. The `password_recovery.zip` file is downloaded.

        :::image type="content" source="media/how-to-create-and-manage-users/enter-identifier.png" alt-text="Screenshot of entering enter the unique identifier and then selecting recover." lightbox="media/how-to-create-and-manage-users/enter-identifier.png":::

       [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. Back on the sensor or on-premises management console, on the **Password recovery** screen, select **Upload**.

1. In the **Upload Password Recovery File** dialog, select **Browse** to locate your `password_recovery.zip` file, or drag the `password_recovery.zip` to the window.

    > [!NOTE]
    > An error message may appear indicating the file is invalid. To avoid this error message, ensure that you selected the right subscription before downloading the `password_recovery.zip`, and try again.

1. Select **Next** and then select your user account. A system-generated password for your management console appears for you to use.

## Control user session timeouts

By default, on-premises users are signed out of their sessions after 30 minutes of inactivity. Admin users can use the local CLI to either turn this feature on or off, or to adjust the inactivity thresholds.

This procedure describes how to control user session timeouts on a specific sensor, and is available for the *cyberx* and *support* users, and any user with the **Admin** role.

For more information, see [Work with Defender for IoT CLI commands](references-work-with-defender-for-iot-cli-commands.md).

> [!NOTE]
> Any changes made to user session timeouts are reset to defaults when you [update the OT monitoring software](update-ot-software.md).

**To control sensor user session timeouts**:

1. Sign in to your sensor via a terminal and run:

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

1. Do one of the following:

    - **To turn off user session timeouts entirely**, change `infinity_session_expiration = true` to `infinity_session_expiration = false`. Change it back to turn it back on again.

    - **To adjust an inactivity timeout period**, adjust the `= <number>` value to the required time, in seconds.




## Track sensor user activity

TBD

## Next steps

For more information, see:

- [Create and manage users on an on-premises management console](management-users.md)
- [Manage users on the Azure portal](manage-users-portal.md)
