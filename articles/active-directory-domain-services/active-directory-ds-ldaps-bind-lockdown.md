---
title: Bind using Secure LDAP (LDAPS) to an Azure AD Domain Services managed domain | Microsoft Docs
description: Bind to an Azure AD Domain Services managed domain using secure LDAP (LDAPS)
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mtillman
editor: curtand

ms.assetid: 6871374a-0300-4275-9a45-a39a52c65ae4
ms.service: active-directory
ms.component: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: maheshu

---
# Bind to an Azure AD Domain Services managed domain using secure LDAP (LDAPS)

## Before you begin
Complete [Task 4 - configure DNS to access the managed domain from the internet](active-directory-ds-ldaps-configure-dns.md).


## Task 5: Bind to the managed domain over LDAP using LDP.exe
You can use the LDP.exe tool, which is included in the Remote Server Administration tools package to bind and search over LDAP.

First, open LDP and connect to the managed domain. Click **Connection** and click **Connect...** in the menu. Specify the DNS domain name of the managed domain. Specify the port to use for connections. For LDAP connections, use port 389. For LDAPS connections, use port 636. Click **OK** button to connect to the managed domain.

Next, bind to the managed domain. Click **Connection** and click **Bind...** in the menu. Provide the credentials of a user account belonging to the 'AAD DC Administrators' group.

Select **View**, and then select **Tree** in the menu. Leave the Base DN field blank, and click OK. Navigate to the container that you want to search, right-click the container, and select Search.

> [!TIP]
> - Users and groups synchronized from Azure AD are stored in the **AADDC Users** container. The search path for this container looks like ```CN=AADDC\ Users,DC=CONTOSO100,DC=COM```.
> - Computer accounts for computers joined to the managed domain are stored in the **AADDC Computers** container. The search path for this container looks like ```CN=AADDC\ Computers,DC=CONTOSO100,DC=COM```.
>
>

More information - [LDAP query basics](https://technet.microsoft.com/library/aa996205.aspx)


## Task 6: Lock down secure LDAP access to your managed domain over the internet
> [!NOTE]
> If you have not enabled LDAPS access to the managed domain over the internet, skip this configuration task.
>
>

Before you begin this task, complete the steps outlined in [Task 3](active-directory-ds-admin-guide-configure-secure-ldap-enable-ldaps.md).

When you enable LDAPS access over the internet to your managed domain, it creates a security threat. The managed domain is reachable from the internet at the port used for secure LDAP (that is, port 636). You can choose to restrict access to the managed domain to specific known IP addresses. Create a network security group (NSG) and associate it with the subnet where you have enabled Azure AD Domain Services.

The sample NSG in the following table locks down secure LDAP access over the internet. The rules in the NSG allow inbound secure LDAP access over TCP port 636 only from a specified set of IP addresses. The default 'DenyAll' rule applies to all other inbound traffic from the internet. The NSG rule to allow LDAPS access over the internet from specified IP addresses has a higher priority than the DenyAll NSG rule.

![Sample NSG to secure LDAPS access over the internet](./media/active-directory-domain-services-admin-guide/secure-ldap-sample-nsg.png)

**More information** - [Network security groups](../virtual-network/security-overview.md).


## Related content
* [Azure AD Domain Services - Getting Started guide](active-directory-ds-getting-started.md)
* [Administer an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-administer-domain.md)
* [LDAP query basics](https://technet.microsoft.com/library/aa996205.aspx)
* [Administer Group Policy on an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-administer-group-policy.md)
* [Network security groups](../virtual-network/security-overview.md)
* [Create a Network Security Group](../virtual-network/tutorial-filter-network-traffic.md)


## Next step
[Troubleshoot secure LDAP on a managed domain](active-directory-ds-ldaps-troubleshoot.md)
