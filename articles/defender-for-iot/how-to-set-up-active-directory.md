
# Integrate with active directory servers 

Configure the sensor to work with Active Directory. This allows Active Directory users to access the sensor console using their Active Directory credentials.

Two types of LDAP based authentication are supported:

  - **Full authentication:** User details are retrieved from the LDAP server. For example, the first name, last name, email, and user permissions.

  - **Trusted user:** only the user password is retrieved. Other user details retrieved are based on users defined in the sensor.

## Active Directory and Defender for IoT permissions

Active Directory groups defined here can be associated with specific permission levels. For example, configure a specific Active Directory group and assign all users in the group Read Only permissions. See [Manage Users](./manage-users.md) for details.

**To configure Active Directory:**

1. From the left navigation pane, select **System Settings**.

    :::image type="content" source="media/how-to-setup-active-directory//image299.png" alt-text="System Settings":::

2. In the **System Settings** pane, select **Active Directory**.

    :::image type="content" source="media/how-to-setup-active-directory//image300.png" alt-text="Active Directory":::

3. In the Edit **Active Directory Configuration** dialog box, select **Active Directory Integration Enabled** and select **Save**. The Edit **Active Directory Configuration** dialog box expands, and you can now enter the parameters to configure Active Directory.

    :::image type="content" source="media/how-to-setup-active-directory//image301.png" alt-text="Active Directory Integration":::

    > [!NOTE]
    > - You must define the LDAP parameters here exactly as they appear in Active Directory.
    > -	For all the Active Directory parameters use lower case only, including when the configurations in your Active Directory use upper case.
    > -	You cannot configure both LDAP and LDAPS for the same domain. You can, however, use both for different domains at the same time.

4. Set the Active Directory server parameters, as follows:

| Server parameter | Description |
|--|--|
| Domain Controller FQDN | Set the Fully Qualified Domain Name (FQDN) exactly as it appears on your LDAP server, for example, host1.subdomain.domain.</span>com |
| Domain Controller Port | Define the port on which your LDAP is configured. |
| Primary Domain | Set the Domain Name, for example, subdomain.domain.</span>com, and the Connection Type according to your LDAP configuration. |
| Active Directory Groups | Type the group names that are defined in your Active Directory configuration on the LDAP server. |
| Trusted Domains | To add a trusted domain, add the Domain Name and the Connection Type of a trusted domain. <br />You can configure Trusted Domains only for users that were defined under Users. |

5. Select **Save**.

6. To add a trusted server, select the **Add Server** and configure another server.
