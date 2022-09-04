---
title: Manage users for OT network security
description: Learn how to manage user permissions in the Azure portal and for the OT monitoring sensors or on-premises management consoles.
ms.date: 09/04/2022
ms.topic: how-to
---

# Manage users for OT network security

Microsoft Defender for IoT provides tools both in the Azure portal and on-premises for managing user access across Defender for IoT resources.

## Define user access control from the Azure portal

Defender for IoT in the Azure portal is integrated in directly to Azure Active Directory, and administrators can add user access by subscription. At this level, you can define permissions for configuring Defender for IoT, adding and updating pricing plans, and accessing data about your sites and sensors in the Azure portal.

For OT network monitoring specifically, administrators can also grant access at the site level for viewing specific device data in the Azure portal, such as device inventory and alerts.

**To define access control per site**:

1. In the Azure portal, go to the **Defender for IoT** > **Sites and sensors** page, and select the site where you want to assign permissions.

    Site-based access control is not relevant or supported for default sites, such as the **BuiltIn-Enterprise** site.

1. In the **Edit site** pane that appears on the right, select **Manage site access control (Preview)**.

    An **Access control** page opens in Defender for IoT for your site. This **Access control** page is the same interface as is available directly from the **Access control** tab on any Azure resource.

For example, use the **Access control** page in Defender for IoT to do any of the following for the selected site:

- Check your own access to the site
- Check access to the site for other users, groups, service principals, or managed identities
- Grant access to the site for others
- View current role assignments on the site
- View role assignments that have been denied specific actions for the site
- View a full list of roles available for the site

For more information, see [Tutorial: Grant a user access to Azure resources using the Azure portal](/azure/role-based-access-control/quickstart-assign-role-user-portal).

## Create and manage on-premises users

Roles on the OT monitoring sensors and the on-premises management console are designed to facilitate granular, secure access to Defender for IoT on-premises resources.

By default, each sensor and on-premises management console is installed with a *cyberx, support* and *cyberx_host* user. These users have access to advanced tools for troubleshooting and setup. Administrator users should sign in with these user credentials, create an admin user, and then create extra users for security analysts and read-only users.

> [!NOTE]
> Enhance on-premises user access control by assigning users to [specific access groups](#define-on-premises-global-user-access-control). Access groups are assigned to zones, sites, regions, and business units where a sensor is located, and provide specific control over which users are able to manage and analyze device detections from the sensors or an on-premises management console. For example, large organizations might use access groups for complex user permissions or together with a global organizational security policy.

### Define on-premises users

<!--validate this procedure-->
This procedure is available to the default *cyberx*, *support*, and *administrator* users.

**To add a user**:

1. Sign in to the sensor console or an on-premises management console, and select **Users**. For example:

     :::image type="content" source="media/how-to-create-and-manage-users/users-pane.png" alt-text="Screenshot of the Users pane for creating users.":::

1. Select **Create user** and then define the following values:

   - **Username**: Enter a username.
   - **Email**: Enter the user's email address.
   - **First Name**: Enter the user's first name.
   - **Last Name**: Enter the user's last name.
   - **Role**: Define the user's role. For more information, see [Role-based permissions](#role-based-permissions).
   - **Access Group**: If you're creating a user for the on-premises management console, define the user's access group. For more information, see [Define global access control](how-to-define-global-user-access-control.md).
   - **Password**: Select the user type as follows:
     - **Local User**: Define a password for the user of a sensor or an on-premises management console. Password must have at least eight characters and contain lowercase and uppercase alphabetic characters, numbers, and symbols.
     - **Active Directory User**: You can allow users to sign in to the sensor or management console by using Active Directory credentials. Defined Active Directory groups can be associated with specific permission levels. For example, configure a specific Active Directory group and assign all users in the group to the Read-only user type.

1. Select **Save** when you're done.

### Control user session timeouts

<!--validate this procedure-->

By default, on-premises users are signed out of their sessions after 30 minutes of inactivity. Administrator users can use the local CLI to either turn this feature on or off, or to adjust the inactivity thresholds.

> [!NOTE]
> Any changes made to user session timeouts are reset to defaults when you update the OT monitoring software. For more information, see [Update Defender for IoT OT monitoring software](update-ot-software.md).

**To control user session timeouts by CLI**:

1. On your sensor or the on-premises management console, sign in as an administrator user.

1. Run:

    ```cli
    `sudo nano /var/cyberx/properties/authentication`
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

### Track user activity

Track user activity on a sensor's event timeline, or by viewing audit logs generated on an on-premises management console.

- **The timeline** displays the event or affected device, and the time and date that the user carried out the activity.

- **Audit logs** record key activity data at the time of occurrence. Use audit logs generated on the on-premises management console to understand which changes were made, when, and by whom.

#### View user activity on the sensor's Event Timeline

Select **Event Timeline** from the sensor side menu. If needed, verify that  **User Operations** filter is set to **Show**.

For example:

:::image type="content" source="media/how-to-create-and-manage-users/track-user-activity.png" alt-text="Screenshot of the Event timeline showing a user that signed in to Defender for IoT.":::

Use the filters or search using CTRL+F to find the information of interest to you.

#### View audit log data on the on-premises management console

In the on-premises management console, select **System Settings > System Statistics**, and then select **Audit log**.

The dialog displays data from the currently active audit log. For example:

For example:

:::image type="content" source="media/how-to-create-and-manage-users/view-audit-logs.png" alt-text="Screenshot of the on-premises management console showing audit logs." lightbox="media/how-to-create-and-manage-users/view-audit-logs.png":::

New audit logs are generated at every 10 MB. One previous log is stored in addition to the current active log file.

Audit logs include the following data:

| Action | Information logged |
|--|--|
| **Learn, and remediation of alerts** | Alert ID |
| **Password changes** | User, User ID |
| **Login** | User |
| **User creation** | User, User role |
| **Password reset** | User name |
| **Exclusion rules-Creation**| Rule summary |
| **Exclusion rules-Editing**| Rule ID, Rule Summary |
| **Exclusion rules-Deletion** | Rule ID |
| **Management Console Upgrade** | The upgrade file used |
| **Sensor upgrade retry** | Sensor ID |
| **Uploaded TI package** | No additional information recorded. |


> [!TIP]
> You may also want to export your audit logs to send them to the support team for extra troubleshooting. For more information, see [Export audit logs for troubleshooting](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md#export-audit-logs-for-troubleshooting)
>

### Change a user's password

Users with an administrator role can change passwords for other users who have either the **Security Analyst** or **Read-only** role.

Administrator users cannot change their own passwords, and must contact a user who has access to either the *cyberx* or *support* user to have their passwords reset.

This procedure is not available for users with **Security analyst** or **Read-only** roles.

**To reset a user's password on the sensor**:

1. Sign into the sensor as either the *cyberx* or *support* user, or another user with the **Administrator** role.

1. Select **Users** from the left, and locate the user whose password needs to be changed.

1. At the right of that user row, do one of the following:

    - On the sensor console, select the options (**...**) menu > **Edit**.
    - On the on-premises management console, select the **Edit** button.

1. In the **Change password** pane that appears, enter and confirm the new password.

    Passwords must be at least 16 characters, contain lowercase and uppercase alphabetic characters, numbers and one of the following symbols: #%*+,-./:=?@[]^_{}~

1. Select **Update** when you're done.

### Recover a password

The *cyberx* and *support* users can recover passwords for users on sensor or on-premises management console.

**To recover a password**:

1. Start signing in to your sensor or on-premises management console. On the sign-in screen, select **Password recovery**. For example: TBD

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



## Define on-premises global user access control

In large organizations, user permissions can be complex and might be determined by a global organizational structure, in addition to the standard site and zone structure.

To support the demand for user access permissions that are global and more complex, you can create a global business topology that's based on business units, regions, and sites. Then you can define user access permissions around these entities.

Working with access tools for business topology helps organizations implement zero-trust strategies by better controlling where users manage and analyze devices in the Microsoft Defender for IoT platform.

### About access groups

Global access control is established through the creation of user access groups. Access groups consist of rules regarding which users can access specific business entities. Working with groups lets you control view and configuration access to Defender for IoT for specific user roles at relevant business units, regions, and sites.

For example, allow security analysts from an Active Directory group to access all West European automotive and glass production lines, along with a plastics line in one region.

:::image type="content" source="media/how-to-define-global-user-access-control/sa-diagram.png" alt-text="Diagram of the Security Analyst Active Directory group.":::

Before you create access groups, we recommend that you:

- Carefully set up your business topology. For more information about business topology, see [Work with site map views](how-to-gain-insight-into-global-regional-and-local-threats.md#work-with-site-map-views).

- Plan which users are associated with the access groups that you create. Two options are available for assigning users to access groups:

  - **Assign groups of Active Directory groups**: Verify that you set up an Active Directory instance to integrate with the on-premises management console.
  
  - **Assign local users**: Verify that you created users. For more information, see [Define users](how-to-create-and-manage-users.md#define-users).

Admin users can't be assigned to access groups. These users have access to all business topology entities by default.

### Create access groups

This section describes how to create access groups. Default global business units and regions are created for the first group that you create. You can edit the default entities when you define your first group.

To create groups:

1. Select **Access Groups** from the side menu of the on-premises management console.

2. Select :::image type="icon" source="media/how-to-define-global-user-access-control/add-icon.png" border="false":::. In the **Add Access Group** dialog box, enter a name for the access group. The console supports 64 characters. Assign the name in a way that will help you easily distinguish this group from other groups.

   :::image type="content" source="media/how-to-define-global-user-access-control/add-access-group.png" alt-text="The Add Access Group dialog box where you create access groups.":::

3. If the **Assign an Active Directory Group** option appears, you can assign one Active Directory group of users to this access group.

   :::image type="content" source="media/how-to-define-global-user-access-control/add-access-group.png" alt-text="Assign an Active Directory group in the Create Access Group dialog box.":::

   If the option doesn't appear, and you want to include Active Directory groups in access groups, select **System Settings**. On the **Integrations** pane, define the groups. Enter a group name exactly as it appears in the Active Directory configurations, and in lowercase.

5. On the **Users** pane, assign as many users as required to the group. You can also assign users to different groups. If you work this way, you must create and save the access group and rules, and then assign users to the group from the **Users** pane.

   :::image type="content" source="media/how-to-define-global-user-access-control/role-management.png" alt-text="Manage your users' roles and assign them as needed.":::

6. Create rules in the **Add Rules for *name*** dialog box based on your business topology's access requirements. Options that appear here are based on the topology that you designed in the **Enterprise View** and **Site Management** windows. 

   You can create more than one rule per group. You might need to create more than one rule per group when you're working with complex access granularity at multiple sites. 

   :::image type="content" source="media/how-to-define-global-user-access-control/add-rule.png" alt-text="Add a rule to your system.":::

The rules that you create appear in the **Add Access Group** dialog box. There, you can delete or edit them.

:::image type="content" source="media/how-to-define-global-user-access-control/edit-access-groups.png" alt-text="View and edit all of your access groups from this window.":::

#### About rules

When you're creating rules, be aware of the following information:

- When an access group contains several rules, the rule logic aggregates all rules. For example, the rules use AND logic, not OR logic.

- For a rule to be successfully applied, you must assign sensors to zones in the **Site Management** window.

- You can assign only one element per rule. For example, you can assign one business unit, one region, and one site for each rule. Create more rules for the group if, for example, you want users in one Active Directory group to have access to different business units in different regions.

- If you change an entity and the change affects the rule logic, the rule will be deleted. If changes made to a topology entity affect the rule logic such that all rules are deleted, the access group remains but the users can't sign in to the on-premises management console. Users are notified to contact their administrator to sign in.

- If no business unit or region is selected, users will have access to all defined business units and regions.

## Integrate with Active Directory

Configure the sensor or on-premises management console to work with Active Directory. This allows Active Directory users to access the Microsoft Defender for IoT consoles by using their Active Directory credentials.

> [!Note]
> LDAP v3 is supported.

Two types of LDAP-based authentication are supported:

- **Full authentication**: User details are retrieved from the LDAP server. Examples are the first name, last name, email, and user permissions.

- **Trusted user**: Only the user password is retrieved. Other user details that are retrieved are based on users defined in the sensor.

For more information, see [networking requirements](how-to-set-up-your-network.md#other-firewall-rules-for-external-services-optional).

### Active Directory and Defender for IoT permissions

You can associate Active Directory groups defined here with specific permission levels. For example, configure a specific Active Directory group and assign Read-only permissions to all users in the group.

### Active Directory configuration guidelines

- You must define the LDAP parameters here exactly as they appear in Active Directory.
- For all the Active Directory parameters, use lowercase only. Use lowercase even when the configurations in Active Directory use uppercase.
- You can't configure both LDAP and LDAPS for the same domain. You can, however, use both for different domains at the same time.

**To configure Active Directory**:

1. From the left pane, select **System Settings**.
1. Select **Integrations** and then select **Active Directory**.
:::image type="content" source="media/how-to-create-and-manage-users/active-directory-configuration.png" alt-text="Screenshot of the Active Directory configuration dialog box.":::

1. Enable the **Active Directory Integration Enabled** toggle.

1. Set the Active Directory server parameters, as follows:

   | Server parameter | Description |
   |--|--|
   | Domain controller FQDN | Set the fully qualified domain name (FQDN) exactly as it appears on your LDAP server. For example, enter `host1.subdomain.domain.com`. |
   | Domain controller port | Define the port on which your LDAP is configured. |
   | Primary domain | Set the domain name (for example, `subdomain.domain.com`) and the connection type according to your LDAP configuration. |
   | Active Directory groups | Enter the group names that are defined in your Active Directory configuration on the LDAP server. You can enter a group name that you'll associate with Admin, Security Analyst and Read-only permission levels. Use these groups when creating new sensor users.|
   | Trusted domains | To add a trusted domain, add the domain name and the connection type of a trusted domain. <br />You can configure trusted domains only for users who were defined under users. |

    ### Active Directory groups for the on-premises management console

    If you're creating Active Directory groups for on-premises management console users, you must create an Access Group rule for each Active Directory group. On-premises management console Active Directory credentials won't work if an Access Group rule doesn't exist for the Active Directory user group. For more information, see [Define global access control](how-to-define-global-user-access-control.md).

1. Select **Save**.

1. To add a trusted server, select **Add Server** and configure another server.



## Next steps

- [Activate and set up your sensor](how-to-activate-and-set-up-your-sensor.md)

- [Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md)

- [Track sensor activity](how-to-track-sensor-activity.md)

- [Integrate with Active Directory servers](integrate-with-active-directory.md)