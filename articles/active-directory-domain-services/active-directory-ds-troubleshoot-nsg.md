---
title: 'Azure Active Directory Domain Services: Troubleshooting Netwrok Security Group Configuration | Microsoft Docs'
description: Troubleshooting NSG Configuration for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: eringreenlee
manager:
editor:

ms.assetid: 95f970a7-5867-4108-a87e-471fa0910b8c
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/22/2017
ms.author: ergreenl

---
# Azure AD Domain Services - Troubleshooting Network Security Group Configuration



## Creating the right Network Security Group
To ensure that Microsoft can service and maintain you managed domain, you must use a Network Security Group (NSG) to allow access to [specific ports](active-directory-ds-networking#ports-required-for-azure-ad-domain-services.md) inside your subnet. If these ports are blocked, Microsoft cannot access the resources it needs, which may be detrimental to your service. While creating your NSG, keep these ports open to ensure no interruption in service.

### Creating a "default" NSG

Preceding are steps you can use to create an NSG from scratch that keeps all of the ports needed to run Azure AD Domain Services open while denying any other unwanted access.


### Adding a rule to a Network Security group
Follow these steps to create rules in your Network security group
1. Navigate to the [Network security groups](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FNetworkSecurityGroups) page in the Azure portal
2. Choose the NSG associated with your domain from the table.
3. Under Settings in the left-hand navigation, click either **Inbound security rules** or **Outbound security rules**.
4. Create the rule by clicking **Add** and filling in the information. Click **OK**.
5. Verify your rule has been created by locating it in the rules table.

### Sample NSG
The following table depicts a sample NSG that would keep your managed domain secure while allowing Microsoft to monitor, manage, and update information.

![sample NSG](.\media\active-directory-domain-services-admin-guide\secure-ldap-sample-nsg.png)


## Contact Us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
