--- 
title: Azure VMware Solutions (AVS) - Secure AVS Private Cloud 
description: Describes how to secure Azure VMware Solutions (AVS) Private Cloud 
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 08/19/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# How to secure your AVS Private Cloud environment

Define role-based access control (RBAC) for AVS Service, AVS portal, and AVS Private Cloud from Azure. Users, groups, and roles for accessing vCenter of AVS Private Cloud are specified using VMware SSO. 

## RBAC for AVS service

Creation of AVS service requires **Owner** or **Contributor** role on the Azure subscription. By default, all owners and contributors can create an AVS service and access AVS portal for creating and managing AVS Private Clouds. Only one AVS service can be created per region. To restrict access to specific administrators, follow the procedure below.

1. Create an AVS Service in a new **resource group** on Azure portal
2. Specify RBAC for the resource group.
3. Purchase nodes and use the same resource group as AVS service

Only the users who have **Owner** or **Contributor** privileges on the resource group will see the AVS service and launch AVS portal.

For more information about RBAC, see [What is role-based access control (RBAC) for Azure resources](../role-based-access-control/overview.md).

## RBAC for AVS Private Cloud vCenter

A default user `CloudOwner@AVS.local` is created in the vCenter SSO domain when an AVS Private Cloud is created. CloudOwner user has privileges for managing vCenter. Additional identity sources are added to the vCenter SSO for giving access to different users. Pre-defined roles and groups are set up on the vCenter that can be used to add additional users.

### Add new users to vCenter

1. [Escalate privileges](escalate-private-cloud-privileges.md) for **CloudOwner@AVS.local** user on the AVS Private Cloud.
2. Sign into vCenter using **CloudOwner@AVS.local**
3. [Add vCenter Single Sign-On Users](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.security.doc/GUID-72BFF98C-C530-4C50-BF31-B5779D2A4BBB.html).
4. Add users to [vCenter single sign-on groups](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.security.doc/GUID-CDEA6F32-7581-4615-8572-E0B44C11D80D.html).

For more information about pre-defined roles and groups, see [AVS Private Cloud permission model of VMware vCenter](learn-private-cloud-permissions.md) article.

### Add new identity sources

You can add additional identity providers for vCenter SSO domain of your AVS Private Cloud. Identity providers provide authentication and vCenter SSO groups provide authorization for users.

* [Use Active Directory as an identity provider](set-vcenter-identity.md) on AVS Private Cloud vCenter.
* [Use Azure AD as an identity provider](azure-ad.md) on AVS Private Cloud vCenter

1. [Escalate privileges](escalate-private-cloud-privileges.md) for **CloudOwner@AVS.local** user on the AVS Private Cloud.
2. Sign into vCenter using **CloudOwner@AVS.local**
3. Add users from the identity provider to [vCenter single sign-on groups](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.security.doc/GUID-CDEA6F32-7581-4615-8572-E0B44C11D80D.html).

## Secure network on your AVS Private Cloud environment

AVS Private Cloud environment's network security is controlled by securing network access and controlling network traffic between resources.

### Access to AVS Private Cloud resources

AVS Private Cloud vCenter and resources access is over a secure network connection:

* **[ExpressRoute connection](on-premises-connection.md)**. ExpressRoute provides a secure, high-bandwidth, low-latency connection from your on-premises environment. Using the connection allows your on-premises services, networks, and users to access your AVS Private Cloud vCenter.
* **[Site-to-Site VPN gateway](vpn-gateway.md)**. Site-to-Site VPN gives access to your AVS Private Cloud resources from on-premises through a secure tunnel. You specify which on-premises networks can send and receive network traffic to your AVS Private Cloud.
* **[Point-to-Site VPN gateway](vpn-gateway.md#set-up-a-site-to-site-vpn-gateway)**. Use Point-to-Site VPN connection for quick remote access to your AVS Private Cloud vCenter.

### Control network traffic in AVS Private Cloud

Firewall tables and rules control network traffic in the AVS Private Cloud. The firewall table allows you to control network traffic between a source network or IP address and a destination network or IP address based on the combination of rules defined in the table.

1. Create a [firewall table](firewall.md#add-a-new-firewall-table).
2. [Add rules](firewall.md#create-a-firewall-rule) to the firewall table.
3. [Attach a firewall table to a VLAN/subnet](firewall.md#attach-vlanssubnet.
