--- 
title: Azure VMware Solutions by CloudSimple - Secure Private Cloud 
description: Describes how to secure Azure VMware Solutions by CloudSimple Private Cloud 
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 08/19/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# How to secure your Private Cloud environment

Define role-based access control (RBAC) for CloudSimple Service, CloudSimple portal, and Private Cloud from Azure.  Users, groups, and roles for accessing vCenter of Private Cloud are specified using VMware SSO.  

## RBAC for CloudSimple service

Creation of CloudSimple service requires **Owner** or **Contributor** role on the Azure subscription.  By default, all owners and contributors can create a CloudSimple service and access CloudSimple portal for creating and managing Private Clouds.  Only one CloudSimple service can be created per region.  To restrict access to specific administrators, follow the procedure below.

1. Create a CloudSimple Service in a new **resource group** on Azure portal
2. Specify RBAC for the resource group.
3. Purchase nodes and use the same resource group as CloudSimple service

Only the users who have **Owner** or **Contributor** privileges on the resource group will see the CloudSimple service and launch CloudSimple portal.

For more information, see [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).

## RBAC for Private Cloud vCenter

A default user `CloudOwner@cloudsimple.local` is created in the vCenter SSO domain when a Private Cloud is created.  CloudOwner user has privileges for managing vCenter. Additional identity sources are added to the vCenter SSO for giving access to different users.  Pre-defined roles and groups are set up on the vCenter that can be used to add additional users.

### Add new users to vCenter

1. [Escalate privileges](escalate-private-cloud-privileges.md) for **CloudOwner\@cloudsimple.local** user on the Private Cloud.
2. Sign into vCenter using **CloudOwner\@cloudsimple.local**
3. [Add vCenter Single Sign-On Users](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.security.doc/GUID-72BFF98C-C530-4C50-BF31-B5779D2A4BBB.html).
4. Add users to [vCenter single sign-on groups](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.security.doc/GUID-CDEA6F32-7581-4615-8572-E0B44C11D80D.html).

For more information about pre-defined roles and groups, see [CloudSimple Private Cloud permission model of VMware vCenter](learn-private-cloud-permissions.md) article.

### Add new identity sources

You can add additional identity providers for vCenter SSO domain of your Private Cloud.  Identity providers provide authentication and vCenter SSO groups provide authorization for users.

* [Use Active Directory as an identity provider](set-vcenter-identity.md) on Private Cloud vCenter.
* [Use Azure AD as an identity provider](azure-ad.md) on Private Cloud vCenter

1. [Escalate privileges](escalate-private-cloud-privileges.md) for **CloudOwner\@cloudsimple.local** user on the Private Cloud.
2. Sign into vCenter using **CloudOwner\@cloudsimple.local**
3. Add users from the identity provider to [vCenter single sign-on groups](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.security.doc/GUID-CDEA6F32-7581-4615-8572-E0B44C11D80D.html).

## Secure network on your Private Cloud environment

Private Cloud environment's network security is controlled by securing network access and controlling network traffic between resources.

### Access to Private Cloud resources

Private Cloud vCenter and resources access is over a secure network connection:

* **[ExpressRoute connection](on-premises-connection.md)**. ExpressRoute provides a secure, high-bandwidth, low-latency connection from your on-premises environment.  Using the connection allows your on-premises services, networks, and users to access your Private Cloud vCenter.
* **[Site-to-Site VPN gateway](vpn-gateway.md)**. Site-to-Site VPN gives access to your Private Cloud resources from on-premises through a secure tunnel.  You specify which on-premises networks can send and receive network traffic to your Private Cloud.
* **[Point-to-Site VPN gateway](vpn-gateway.md#set-up-a-site-to-site-vpn-gateway)**. Use Point-to-Site VPN connection for quick remote access to your Private Cloud vCenter.

### Control network traffic in Private Cloud

Firewall tables and rules control network traffic in the Private Cloud.  The firewall table allows you to control network traffic between a source network or IP address and a destination network or IP address based on the combination of rules defined in the table.

1. Create a [firewall table](firewall.md#add-a-new-firewall-table).
2. [Add rules](firewall.md#create-a-firewall-rule) to the firewall table.
3. [Attach a firewall table to a VLAN/subnet](firewall.md#attach-vlans-subnet).
