---
title: Set an external identity source for VMware NSX
description: Learn how to use Azure VMware Solution to set an external identity source for VMware NSX.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/29/2024
ms.custom: engagement-fy23
---

# Set an external identity source for VMware NSX

In this article, learn how to set up an external identity source for VMware NSX in an instance of Azure VMware Solution.

You can set up NSX to use an external Lightweight Directory Access Protocol (LDAP) directory service to authenticate users. A user can sign in by using their Windows Server Active Directory account credentials or credentials from a third-party LDAP server. Then, the account can be assigned an NSX role, like in an on-premises environment, to provide role-based access for NSX users.

:::image type="content" source="media/nsxt/azure-vmware-solution-to-ldap-server.png" alt-text="Screenshot that shows NSX connectivity to the LDAP Windows Server Active Directory server." lightbox="media/nsxt/azure-vmware-solution-to-ldap-server.png":::

## Prerequisites

- A working connection from your Windows Server Active Directory network to your Azure VMware Solution private cloud.
- A network path from your Windows Server Active Directory server to the management network of the instance of Azure VMware Solution in which NSX is deployed.
- A Windows Server Active Directory domain controller that has a valid certificate. The certificate can be issued by a [Windows Server Active Directory Certificate Services Certificate Authority (CA)](https://social.technet.microsoft.com/wiki/contents/articles/2980.ldap-over-ssl-ldaps-certificate.aspx) or by a [third-party CA](/troubleshoot/windows-server/identity/enable-ldap-over-ssl-3rd-certification-authority).

   We recommend that you use two domain controllers that are located in the same Azure region as the Azure VMware Solution software-defined datacenter.

   > [!NOTE]
   > Self-signed certificates are not recommended for production environments.

- An account that has Administrator permissions.
- Azure VMware Solution DNS zones and DNS servers that are correctly configured. For more information, see [Configure NSX DNS for resolution to your Windows Server Active Directory domain and set up DNS forwarder](configure-dns-azure-vmware-solution.md).

> [!NOTE]
> For more information about Secure LDAP (LDAPS) and certificate issuance, contact your security team or your identity management team.

## Use Windows Server Active Directory as an LDAPS identity source

1. Sign in to NSX Manager, and then go to **System** > **User Management** > **LDAP** > **Add Identity Source**.

   :::image type="content" source="media/nsxt/configure-nsx-t-pic-1.png" alt-text="Screenshot that shows NSX Manager with the options highlighted.":::

1. Enter values for **Name**, **Domain Name (FQDN)**, **Type**, and **Base DN**.  You can add a description (optional).

   The base DN is the container where your user accounts are kept. The base DN is the starting point that an LDAP server uses when it searches for users in an authentication request. For example, **CN=users,dc=azfta,dc=com**.

   > [!NOTE]
   > You can use more than one directory as an LDAP provider. An example is if you have multiple Windows Server Azure Directory domains, and you use Azure VMware Solution as a way to consolidate workloads.

   :::image type="content" source="media/nsxt/configure-nsx-t-pic-2.png" alt-text="Screenshot that shows the User Management Add Identity Source page in NSX Manager." lightbox="media/nsxt/configure-nsx-t-pic-2.png":::

1. Next, under **LDAP Servers**, select **Set** as shown in the preceding screenshot.

1. On **Set LDAP Server**, select **Add LDAP Server**, and then enter or select values for the following items:

    | Name                | Action |
    |----------------------|------------|
    | **Hostname/IP**          | Enter the LDAP server’s FQDN or IP address. For example, **azfta-dc01.azfta.com** or **10.5.4.4**. |
    | **LDAP Protocol**        | Select **LDAPS**. |
    | **Port**     | Leave the default secure LDAP port. |
    | **Enabled**              | Leave as **Yes**. |
    | **Use Start TLS**        | Required only if you use standard (unsecured) LDAP. |
    | **Bind Identity**        | Use your account that has domain Administrator permissions. For example, `<admin@contoso.com>`. |
    | **Password**            | Enter the password for the LDAP server. This password is the one that you use with the example `<admin@contoso.com>` account. |
    | **Certificate**          | Leave empty (see step 6). |

   :::image type="content" source="media/nsxt/configure-nsx-t-pic-3.png" alt-text="Screenshot that shows the Set LDAP Server page to add an LDAP server.":::

1. After the page updates and displays a connection status, select **Add**, and then select **Apply**.

   :::image type="content" source="media/nsxt/configure-nsx-t-pic-4.png" alt-text="Screenshot that shows details of a successful certificate retrieval.":::

1. On **User Management**, select **Save** to complete the changes.

1. To add a second domain controller or another external identity provider, return to step 1.

> [!NOTE]
> A recommended practice is to have two domain controllers to act as LDAP servers. You can also put the LDAP servers behind a load balancer.

## Assign roles to Windows Server Active Directory identities

After you add an external identity, you can assign NSX roles to Windows Server Active Directory security groups based on your organization's security controls.

1. In NSX Manager, go to **System** > **User Management** > **User Role Assignment** > **Add**.

   :::image type="content" source="media/nsxt/configure-nsx-t-pic-5.png" alt-text="Screenshot that shows the User Management page in NSX Manager." lightbox="media/nsxt/configure-nsx-t-pic-5.png":::

1. Select **Add** > **Role Assignment for LDAP**.  

   1. Select the external identity provider that you selected in step 3 in the preceding section. For example, **NSX External Identity Provider**.

   1. Enter the first few characters of the user's name, the user's sign-in ID, or a group name to search the LDAP directory. Then select a user or group from the list of results.

   1. Select a role. In this example, assign the FTAdmin user the CloudAdmin role.

   1. Select **Save**.

   :::image type="content" source="media/nsxt/configure-nsx-t-pic-6.png" alt-text="Screenshot that shows the Add User page in NSX Manager." lightbox="media/nsxt/configure-nsx-t-pic-6.png":::

1. Under **User Role Assignment**, verify that the permissions assignment appears.

   :::image type="content" source="media/nsxt/configure-nsx-t-pic-7.png" alt-text="Screenshot that shows the User Management page confirming that the user was added." lightbox="media/nsxt/configure-nsx-t-pic-7.png":::

Your users should now be able to sign in to NSX Manager by using their Windows Server Active Directory credentials.

## Related content

- [Azure VMware Solution identity architecture](architecture-identity.md)
- [Set an external identity source for vCenter Server](configure-identity-source-vcenter.md)
- [VMware product documentation](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/administration/GUID-DB5A44F1-6E1D-4E5C-8B50-D6161FFA5BD2.html)
