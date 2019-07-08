---
title: Troubleshoot Secure LDAP (LDAPS) in Azure AD Domain Services | Microsoft Docs
description: Troubleshoot Secure LDAP (LDAPS) for an Azure AD Domain Services managed domain
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager: daveba
editor: curtand

ms.assetid: 445c60da-e115-447b-841d-96739975bdf6
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/20/2019
ms.author: iainfou

---
# Troubleshoot Secure LDAP (LDAPS) for an Azure AD Domain Services managed domain

## Connection issues
If you have trouble connecting to the managed domain using secure LDAP:

* The issuer chain of the secure LDAP certificate must be trusted on the client. You may choose to add the Root certification authority to the trusted root certificate store on the client to establish the trust.
* Verify that the LDAP client (for example, ldp.exe) connects to the secure LDAP endpoint using a DNS name, not the IP address.
* Check the DNS name the LDAP client connects to. It must resolve to the public IP address for secure LDAP on the managed domain.
* Verify the secure LDAP certificate for your managed domain has the DNS name in the Subject or the Subject Alternative Names attribute.
* The NSG settings for the virtual network must allow the traffic to port 636 from the internet. This step applies only if you've enabled secure LDAP access over the internet.


## Need help?
If you still have trouble connecting to the managed domain using secure LDAP, [contact the product team](contact-us.md) for help. Include the following information to help diagnose the issue better:
* A screenshot of ldp.exe making the connection and failing.
* Your Azure AD tenant ID, and the DNS domain name of your managed domain.
* Exact user name that you're trying to bind as.


## Related content
* [Azure AD Domain Services - Getting Started guide](create-instance.md)
* [Manage an Azure AD Domain Services domain](manage-domain.md)
* [LDAP query basics](https://technet.microsoft.com/library/aa996205.aspx)
* [Manage Group Policy for Azure AD Domain Services](manage-group-policy.md)
* [Network security groups](../virtual-network/security-overview.md)
* [Create a Network Security Group](../virtual-network/tutorial-filter-network-traffic.md)
