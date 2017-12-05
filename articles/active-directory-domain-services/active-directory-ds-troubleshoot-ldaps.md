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

Lastly, you should create a rule with the lowest priority to deny any other access. This rule is a fail-safe and secures your domain and applies to all other inbound traffic from the internet.

### Adding rules to your Network Security groups
Follow these steps to create rules in your Network security group
1. Navigate to the Azure portal (https://portal.azure.com/)
2. Click on **More Services** and search for **Network security groups**.
3. Choose the NSG associated with your domain from the table.
4. Under Settings in the left-hand navigation, click either **Inbound security rules** or **Outbound security rules**.
5. Create the rule by clicking **Add** and filling in the Information
6. Verify your rule has been created by locating it in the rules table.

### Secure LDAP Port

When secure LDAP is enabled, we recommend creating additional rules to allow inbound LDAPS access only from certain IP addresses. These rules protect your domain from brute force attacks that could pose a security threat. Port 636 allows access to your managed domain. Here is how to update your NSG to allow access for Secure LDAP:

1. Navigate to the Azure portal (https://portal.azure.com/)
2. Click on **More Services** and search for **Network security groups**.
3. Choose the NSG associated with your domain from the table.
4. Click on **Inbound security rules**
5. Create the port 636 rule
   1. Click **Add** on the navigation bar.
   2. Choose **IP Addresses** for the resources
   3. Specify the Source port ranges for this rule.
   4. Input "636" for Destination port ranges.
   5. Protocol is **TCP**.
   6. Give the rule an appropriate name, description, and priority.
   7. Click **OK**.
6. Verify that your rule has been created.

### Sample NSG
The following table depicts a sample NSG that would keep your managed domain secure while allowing Microsoft to monitor, manage, and update information.

**sample nsg pic here**

## Contact Us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
