---
title: Integrate with Active Directory - Microsoft Defender for IoT
description: Configure the sensor or on-premises management console to work with Active Directory. 
ms.date: 05/17/2022
ms.topic: how-to
---

# Integrate with Active Directory servers

Configure the sensor or on-premises management console to work with Active Directory. This allows Active Directory users to access the Microsoft Defender for IoT consoles by using their Active Directory credentials.

> [!Note]
> LDAP v3 is supported.

Two types of LDAP-based authentication are supported:

- **Full authentication**: User details are retrieved from the LDAP server. Examples are the first name, last name, email, and user permissions.

- **Trusted user**: Only the user password is retrieved. Other user details that are retrieved are based on users defined in the sensor.

For more information, see [networking requirements](how-to-set-up-your-network.md#other-firewall-rules-for-external-services-optional).

## Active Directory and Defender for IoT permissions

You can associate Active Directory groups defined here with specific permission levels. For example, configure a specific Active Directory group and assign Read-only permissions to all users in the group.

## Active Directory configuration guidelines

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
   | Primary domain | Set the domain name (for example, `subdomain.domain.com`) |
   | Connection type | Set the authentication type: LDAPS/NTLMv3 (Recommended), LDAP/NTLMv3 or LDAP/SASL-MD5 |
   | Active Directory groups | Enter the group names that are defined in your Active Directory configuration on the LDAP server. You can enter a group name that you'll associate with Admin, Security Analyst and Read-only permission levels. Use these groups when creating new sensor users.|
   | Trusted endpoints | To add a trusted domain, add the domain name and the connection type of a trusted domain. <br />You can configure trusted endpoints only for users who were defined under users. |

    ### Active Directory groups for the on-premises management console

    If you're creating Active Directory groups for on-premises management console users, you must create an Access Group rule for each Active Directory group. On-premises management console Active Directory credentials won't work if an Access Group rule doesn't exist for the Active Directory user group. For more information, see [Define global access control](how-to-define-global-user-access-control.md).

1. Select **Save**.

1. To add a trusted server, select **Add Server** and configure another server.


## Next steps

For more information, see [how to create and manage users](./how-to-create-and-manage-users.md).
