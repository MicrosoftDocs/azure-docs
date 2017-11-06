---
title: 'Azure Active Directory Domain Services: Troubleshooting Secure LDAP Configuration | Microsoft Docs'
description: Troubleshooting Secure LDAP and NSG Configuration for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: eringreenlee
manager: mahesh-unnikrishnan
editor:

ms.assetid:
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date:
ms.author: ergreenl

---
# Azure AD Domain Services - Troubleshooting Secure LDAP and NSG Configuration


**some type of introduction sentence**

## Creating the right Network Security Group
To ensure that Microsoft can service and maintain you managed domain, you must use a Network Security Group (NSG) to allow access to specific ports inside your subnet. If these ports are blocked, Microsoft cannot access the resources it needs, which may be detrimental to your service. While creating your NSG, keep these ports open to ensure no interruption in service.

| Port number | Purpose|
|:----------|:------------|
| 443 | Synchronization with your Azure AD tenant |
| 3389 | Management of your domain |
| 5986 | Management of your domain |
| 636 | Secure LDAP (LDAPS) access to your managed domain |

In addition, when secure LDAP is enabled, we recommend creating additional rules to allow inbound LDAPS access only from certain IP addresses. These rules protect your domain from brute force attacks that could pose a security threat.

Lastly, you should create a rule with the lowest priority to deny any other access. This rule is a fail-safe and secures your domain and applies to all other inbound traffic from the internet.


### Sample NSG
The following table depicts a sample NSG that would keep your managed domain secure while allowing Microsoft to monitor, manage, and update information.

**sample nsg pic here**

## Contact Us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
