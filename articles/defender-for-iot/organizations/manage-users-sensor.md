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

For more information, see [Install OT monitoring software](how-to-install-software.md#install-ot-monitoring-software) and [Default privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users).

## Add new OT sensor users

This procedure describes how to create new users for a specific OT network sensor, and is available for the *cyberx*, *support*, and *cyberx_host* users, and any user with the **Admin** role.

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
    |**Password**     |   Select the user type, either **Local** or **Active Directory User**. <br><br>For local users, enter a password for the user. Password requirements include: <br>- At least eight characters<br>- Both lowercase and uppercase alphabetic characters<br>- At least one numbers<br>- At least one symbol<br><br>Integrating with Active Discovery lets you associate groups of users with specific permission levels. For more information, see [Active Directory on the sensor](manage-users-sensor.md#integrate-ot-sensor-users-with-active-directory) and [Active Directory on the on-premises management console](manage-users-on-premises-management-console.md#integrate-on-premises-users-with-active-directory).|

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

        Supported connection types include: **LDAPS/NTLMv3** (recommended), **LDAP/NTLMv3**, or **LDAP/SASL-MD5**


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

### Recover privileged access to a sensor

This procedure descries how to recover privileged access to a sensor, for the *cyberx*, *support*, or *cyberx_host* users. For more information, see [Default privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users)..

**To recover privileged access to a sensor**:

1. Start signing in to the OT network sensor. On the sign-in screen, select the **Reset** link. For example:

    :::image type="content" source="media/manage-users-sensor/reset-privileged-password.png" alt-text="Screenshot of the sensor sign-in screen with the Reset password link.":::

1. In the **Reset password** dialog, from the **Choose user** menu, select the user whose password you're recovering, either **Cyberx**, **Support**, or **CyberX_host**.

1. Copy the unique identifier code that's shown in the **Reset password identifier** to the clipboard. For example:

    :::image type="content" source="media/manage-users-sensor/password-recovery-sensor.png" alt-text="Screenshot of the Reset password dialog on the OT sensor.":::

1. Go the Defender for IoT **Sites and sensors** page in the Azure portal. You may want to open the Azure portal in a new browser tab or window, keeping your sensor console open.

    In your Azure portal settings > **Directories + subscriptions**, make sure that you've selected the subscription where your sensor was onboarded to Defender for IoT.

1. On the **Sites and sensors** page, locate the sensor that you're working with, and select the options menu (**...**) on the right > **Recover my password**. For example:

    :::image type="content" source="media/manage-users-sensor/recover-my-password.png" alt-text="Screenshot of the Recover my password option on the Sites and sensors page.":::

1. In the **Recover** dialog that opens, enter the unique identifier that you've copied to the clipboard from your sensor. A **password_recovery.zip** file is automatically downloaded.

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. Back on the sensor console, on the **Password recovery** screen, select **Upload**, and upload the **password_recovery.zip** file you downloaded from the Azure portal.

    > [!NOTE]
    > If an error message appears, indicating that the file is invalid, you may have had an incorrect subscription selected in your Azure portal settings. Return to Azure, and select the settings icon in the top toolbar. On the **Directories + subscriptions** page, make sure that you've selected the subscription where your sensor was onboarded to Defender for IoT. Then repeat the steps in Azure to download the **password_recovery.zip** file and upload it on the sensor again.

1. Select **Next**. A system-generated password for your management console appears for you to use for the selected user. Make sure to write the password down as it won't be shown again.

1. Select **Next** again to sign into your sensor.

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

## Track sensor user activity with the Event Timeline

This procedure describes how to track user activity on a specific sensor, and is available for the *cyberx*, *support*, and *cyberx_host* users, and any user with the **Admin** role.

**To use the sensor's Event Timeline**:

Sign into the sensor console and select **Event Timeline** from the left-hand menu.

On the **Event Timeline** page, make sure that the **User Operations** filter is set to **Show**. Use other filters or search using CTRL+F to find the information of interest to you.

For example:

:::image type="content" source="media/manage-users-sensor/track-user-activity.png" alt-text="Screenshot of the Event Timeline on the sensor showing user activity.":::

## Next steps

For more information, see:

- [Create and manage users on an on-premises management console](management-users.md)
- [Manage users on the Azure portal](manage-users-portal.md)
