---
title: Set up an external identity source for NSX-T Data Center
description: Learn how to use Azure VMware Solution to set up an external identity source for VMware NSX-T Data Center.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 11/06/2023
ms.custom: engagement-fy23
---

# Set up an external identity source for NSX-T Data Center

In this article, learn how to configure an external identity source for VMware NSX-T Data Center in an instance of Azure VMware Solution. You can set up NSX-T Data Center to use an external Lightweight Directory Access Protocol (LDAP) directory service to authenticate users. A user can sign in by using their Windows Server Active Directory account credentials or credentials from a third-party LDAP server. Then the account can be assigned an NSX-T Data Center role, like in an on-premises environment, to provide role-based access control (RBAC) for each NSX-T Data Center user.

![Screenshot that shows NSX-T Data Center connectivity to the LDAP (Windows Server Active Directory) server.](./media/nsxt/azure-vmware-solution-to-ldap-server.jpg)

## Prerequisites

- A working connection from your Windows Server Active Directory network to your Azure VMware Solution private cloud.
- A network path from your Windows Server Active Directory server to the management network of the instance of Azure VMware Solution in which NSX-T Data Center is deployed.
- A Windows Server Active Directory domain controller that has a valid certificate. The certificate can be issued by a [Windows Server Active Directory Certificate Services Certificate Authority (CA)](https://social.technet.microsoft.com/wiki/contents/articles/2980.ldap-over-ssl-ldaps-certificate.aspx) or by a [third-party CA](/troubleshoot/windows-server/identity/enable-ldap-over-ssl-3rd-certification-authority).

   A recommended practice is to use two domain controllers that are located in the same Azure region as the Azure VMware Solution software-defined datacenter (SDDC).

   > [!NOTE]
   > Self-sign certificates are not recommended for production environments.

- An account that has Administrator permissions.
- Correctly configured Azure VMware Solution DNS zones and DNS servers. For more information, see [Configure NSX-T Data Center DNS for resolution to your Windows Server Active Directory domain and set up DNS forwarder for Azure VMware Solution](configure-dns-azure-vmware-solution.md).

> [!NOTE]
> For more information about Secure LDAP (LDAPS) and certificate issuance, see your security or identity management team.

## Configure NSX-T Data Center to use Windows Server Active Directory as an LDAPS identity source

1. Sign in to NSX Manager, and then go to **System** > **User Management** > **LDAP** > **Add Identity Source**.

   ![Screenshot that shows NSX Manager with the options highlighted.](./media/nsxt/configure-nsx-t-pic-1.png)

1. Enter values for **Name**, **Domain Name (FQDN)**, **Type**, and **Base DN**.  Optionally, add a description.

   The base DN is the container where your user accounts are kept. The base DN is the starting point that an LDAP server uses when it searches for users in an authentication request. For example, **CN=users,dc=azfta,dc=com**.

   > [!NOTE]
   > You can use more than one directory as an LDAP provider. For example, if you have multiple Windows Server Azure Directory domains and you use Azure VMware Solution as a way to consolidate workloads.

   ![Screenshot that shows the User Management Add Identity Source page in NSX Manager.](./media/nsxt/configure-nsx-t-pic-2.png)

1. Next, under **LDAP Servers**, select **Set** as shown in the preceding screenshot.

1. On **Set LDAP Server**, select **Add LDAP Server**, and then enter or select the following values:

    | Field                | Explanation|
    |----------------------|------------|
    | Hostname/IP          | Enter the LDAP server’s FQDN or IP address. For example, `azfta-dc01.azfta.com` or `10.5.4.4`. |
    | LDAP Protocol        | Select **LDAPS**. |
    | Port Choose 636     | Leave the default secure LDAP port. |
    | Enabled              | Leave as **Yes**. |
    | Use StartTLS        | Required only if you are using standard (non-secure) LDAP. |
    | Bind Identity        | Use your account that has domain administrator permissions. For example, `<admin@contoso.com>`. |
    | Password            | Enter the password for the LDAP server. This is the password that you use with the example `<admin@contoso.com>` account. |
    | Certificate          | Leave empty (see step 6). |

   ![Screenshot that shows the Set LDAP Server page to add an LDAP server.](./media/nsxt/configure-nsx-t-pic-3.png)

1. After the page updates and displays a connection status, select **Add, and then select **Apply**.

   ![Screenshot that shows successful certificate retrieval details.](./media/nsxt/configure-nsx-t-pic-4.png)

1. On **User Management**, select **Save** to complete the changes.

1. To add a second domain controller or another external identity provider, go back to step 1.

>[!NOTE]
> A best practice is to have two domain controllers to act as LDAP servers. You can also put the LDAP servers behind a load balancer.

## Assign other NSX-T Data Center roles to Windows Server Active Directory identities

After you add an external identity, you can assign NSX-T Data Center Roles to Windows Server Active Directory security groups based on your organization's security controls.

1. Sign in to NSX Manager and go to **System** > **Users Management** > **User Role Assignment** > **Add**.

   ![Screenshot of the NSX-T System, User Management screen.](./media/nsxt/configure-nsx-t-pic-5.png)

1. Select **Add** > **Role Assignment for LDAP**.  

    1. Select the external identity provider. This is the identity provider that you selected in step 3 in the preceding section.  “NSX-T External Identity Provider”

    1. Enter the first few characters of the user's name, sign-in ID, or a group name to search the LDAP directory. Then select a user or group from the list of results.

    1. Select a role. In this example, assign the FTAdmin the role of **CloudAdmin**.

    1. Select **Save**.

   ![Screenshot of the NSX-T, System, User Management, ADD user screen.](./media/nsxt/configure-nsx-t-pic-6.png)

1. Under **User Role Assignment**, verify that the permissions assignment is displayed.

   ![Screenshot of the NSX-T User Management confirming user has been added.](./media/nsxt/configure-nsx-t-pic-7.png)

Users should now be able to sign in to NSX-T Manager by using their Windows Server Active Directory credentials.

## Related content

Now that you configured the external source, learn more:

- [Configure an external identity source for vCenter Server](configure-identity-source-vcenter.md)
- [Azure VMware Solution identity concepts](concepts-identity.md)
- [VMware product documentation](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-DB5A44F1-6E1D-4E5C-8B50-D6161FFA5BD2.html)
