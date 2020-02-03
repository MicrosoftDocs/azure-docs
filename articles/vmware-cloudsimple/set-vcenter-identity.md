--- 
title: Azure VMware Solution by CloudSimple - Set up vCenter identity sources on Private Cloud
description: Describes how to set up your Private Cloud vCenter to authenticate with Active Directory for  VMware administrators to access vCenter
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 08/15/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Set up vCenter identity sources to use Active Directory

## About VMware vCenter identity sources

VMware vCenter supports different identity sources for authentication of users who access vCenter.  Your CloudSimple Private Cloud vCenter can be set up to authenticate with Active Directory for your VMware administrators to access vCenter. When the setup is complete, the **cloudowner** user can add users from the identity source to vCenter.  

You can set up your Active Directory domain and domain controllers in any of the following ways:

* Active Directory domain and domain controllers running on-premises
* Active Directory domain and domain controllers running on Azure as virtual machines in your Azure subscription
* New Active Directory domain and domain controllers running in your Private Cloud
* Azure Active Directory service

This guide explains the tasks to set up Active Directory domain and domain controllers running either on-premises or as virtual machines in your subscriptions.  If you would like to use Azure AD as the identity source, refer to [Use Azure AD as an identity provider for vCenter on CloudSimple Private Cloud](azure-ad.md) for detailed instructions in setting up the identity source.

Before [adding an identity source](#add-an-identity-source-on-vcenter), temporarily [escalate your vCenter privileges](escalate-private-cloud-privileges.md).

> [!CAUTION]
> New users must be added only to *Cloud-Owner-Group*, *Cloud-Global-Cluster-Admin-Group*, *Cloud-Global-Storage-Admin-Group*, *Cloud-Global-Network-Admin-Group* or, *Cloud-Global-VM-Admin-Group*.  Users added to *Administrators* group will be removed automatically.  Only service accounts must be added to *Administrators* group and service accounts must not be used to sign in to vSphere web UI.	


## Identity source options

* [Add on-premises Active Directory as a single sign-on identity source](#add-on-premises-active-directory-as-a-single-sign-on-identity-source)
* [Set Up New Active Directory on a Private Cloud](#set-up-new-active-directory-on-a-private-cloud)
* [Set Up Active Directory on Azure](#set-up-active-directory-on-azure)

## Add On-Premises Active Directory as a Single Sign-On Identity Source

To set up your on-premises Active Directory as a Single Sign-On identity source, you need:

* [Site-to-Site VPN connection](vpn-gateway.md#set-up-a-site-to-site-vpn-gateway) from your on-premises datacenter to your Private Cloud.
* On-premises DNS server IP added to vCenter and Platform Services Controller (PSC).

Use the information in the following table when setting up your Active Directory domain.

| **Option** | **Description** |
|------------|-----------------|
| **Name** | Name of the identity source. |
| **Base DN for users** | Base distinguished name for users. |
| **Domain name** | FDQN of the domain, for example, example.com. Do not provide an IP address in this text box. |
| **Domain alias** | The domain NetBIOS name. Add the NetBIOS name of the Active Directory domain as an alias of the identity source if you are using SSPI authentications. |
| **Base DN for groups** | The base distinguished name for groups. |
| **Primary Server URL** | Primary domain controller LDAP server for the domain.<br><br>Use the format `ldap://hostname:port` or `ldaps://hostname:port`. The port is typically 389 for LDAP connections and 636 for LDAPS connections. For Active Directory multi-domain controller deployments, the port is typically 3268 for LDAP and 3269 for LDAPS.<br><br>A certificate that establishes trust for the LDAPS endpoint of the Active Directory server is required when you use `ldaps://` in the primary or secondary LDAP URL. |
| **Secondary server URL** | Address of a secondary domain controller LDAP server that is used for failover. |
| **Choose certificate** | If you want to use LDAPS with your Active Directory LDAP Server or OpenLDAP Server identity source, a Choose certificate button appears after you type `ldaps://` in the URL text box. A secondary URL is not required. |
| **Username** | ID of a user in the domain who has a minimum of read-only access to Base DN for users and groups. |
| **Password** | Password of the user who is specified by Username. |

When you have the information in the previous table, you can add your on-premises Active Directory as a Single Sign-On identity source on vCenter.

> [!TIP]
> You'll find more information on Single Sign-On identity sources on the [VMware documentation page](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.psc.doc/GUID-B23B1360-8838-4FF2-B074-71643C4CB040.html).

## Set Up new Active Directory on a Private Cloud

You can set up a new Active Directory domain on your Private Cloud and use it as an identity source for Single Sign-On.  The Active Directory domain can be a part of an existing Active Directory forest or can be set up as an independent forest.

### New Active Directory forest and domain

To set up a new Active Directory forest and domain, you need:

* One or more virtual machines running Microsoft Windows Server to use as domain controllers for the new Active Directory forest and domain.
* One or more virtual machines running DNS service for name resolution.

See [Install a New Windows Server 2012 Active Directory Forest](https://docs.microsoft.com/windows-server/identity/ad-ds/deploy/install-a-new-windows-server-2012-active-directory-forest--level-200-) for detailed steps.

> [!TIP]
> For high availability of services, we recommend setting up multiple domain controllers and DNS servers.

After setting up the Active Directory forest and domain, you can [add an identity source on vCenter](#add-an-identity-source-on-vcenter) for your new Active Directory.

### New Active Directory domain in an existing Active Directory forest

To set up a new Active Directory domain in an existing Active Directory forest, you need:

* Site-to-Site VPN connection to your Active Directory forest location.
* DNS Server to resolve the name of your existing Active Directory forest.

See [Install a new Windows Server 2012 Active Directory child or tree domain](https://docs.microsoft.com/windows-server/identity/ad-ds/deploy/install-a-new-windows-server-2012-active-directory-child-or-tree-domain--level-200-) for detailed steps.

After setting up the Active Directory domain, you can [add an identity source on vCenter](#add-an-identity-source-on-vcenter) for your new Active Directory.

## Set up Active Directory on Azure

Active Directory running on Azure is similar to Active Directory running on-premises.  To set up Active Directory running on Azure as a Single Sign-On identity source on vCenter, the vCenter server and PSC must have network connectivity to the Azure Virtual Network where Active Directory services are running.  You can establish this connectivity using [Azure Virtual Network Connection using ExpressRoute](azure-expressroute-connection.md) from the Azure virtual network where Active Directory Services are running to CloudSimple Private Cloud.

After the network connection is established, follow the steps in [Add On-Premises Active Directory as a Single Sign-On Identity Source](#add-on-premises-active-directory-as-a-single-sign-on-identity-source) to add it as an Identity Source.  

## Add an identity source on vCenter

1. [Escalate privileges](escalate-private-cloud-privileges.md) on your Private Cloud.

2. Sign in to the vCenter for your Private Cloud.

3. Select **Home > Administration**.

    ![Administration](media/OnPremAD01.png)

4. Select **Single Sign On > Configuration**.

    ![Single Sign On](media/OnPremAD02.png)

5. Open the **Identity Sources** tab and click **+** to add a new identity source.

    ![Identity Sources](media/OnPremAD03.png)

6. Select **Active Directory as an LDAP Server** and click **Next**.

    ![Active Directory](media/OnPremAD04.png)

7. Specify the identity source parameters for your environment and click **Next**.

    ![Active Directory](media/OnPremAD05.png)

8. Review the settings and click **Finish**.
