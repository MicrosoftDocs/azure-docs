---
title: 'Azure Active Directory Domain Services: Troubleshooting Network Security Group Configuration | Microsoft Docs'
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
ms.date: 01/09/2018
ms.author: ergreenl

---
# Azure AD Domain Services - Troubleshooting Network Security Group Configuration



## AADDS104: Network error

**Message:** *We are unable to reach the domain controllers for this domain. This may happen if a network security group (NSG) configured on your virtual network blocks us from access to the managed domain. Another possible reason for your domain to be unreachable is if there is a user defined route that blocks incoming traffic from the internet.*

The most common cause of network errors for Azure AD Domain Services can be attributed to incorrect NSG configurations. To ensure that Microsoft can service and maintain you managed domain, you must use a Network Security Group (NSG) to allow access to [specific ports](active-directory-ds-networking.md#ports-required-for-azure-ad-domain-services) inside your subnet. If these ports are blocked, Microsoft cannot access the resources it needs, which may be detrimental to your service. While creating your NSG, keep these ports open to ensure no interruption in service.

### Creating a default NSG using PowerShell

Preceding are steps you can use to create an NSG using PowerShell that keeps all of the ports needed to run Azure AD Domain Services open while denying any other unwanted access.

1. Install [Azure AD Powershell](https://docs.microsoft.com/en-us/powershell/azure/active-directory/install-adv2?toc=%2Fazure%2Factive-directory-domain-services%2Ftoc.json&view=azureadps-2.0).
2.


> [!NOTE] This default NSG does not lock down access to the port used for Secure LDAP. To find out how to create a rule for this port, visit [this article](active-directory-ds-troubleshooting-ldaps.md).


### Adding a rule to a Network Security group using the Azure portal
Follow these steps to create rules in your Network security group using the Azure portal.
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
