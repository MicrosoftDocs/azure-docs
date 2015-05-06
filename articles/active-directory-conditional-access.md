<properties 
	pageTitle="Managing Risk With Conditional Access" 
	description="A topic that explains how to allow anywhere access to specific resources from known devices compliant with policies and disallow access from lost, stolen, non-compliant devices." 
	services="active-directory, virtual-network" 
	documentationCenter="" 
	authors="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"/>

<tags 
	ms.service="active-directory" 
	ms.devlang="na" 
	ms.topic="article" 
    ms.tgt_pltfrm="na" 
    ms.workload="identity" 
	ms.date="05/05/2015" 
	ms.author="Justinha"/>


# Managing Risk With Conditional Access

The current trends of how employees work, how they are productive, and  the means to do their work is fast changing. Employees are bringing in their personal devices to work. On these personal devices, they have apps that they use in their personal, digital lives. And they’re accustomed to the freedom and to the capabilities that this brings to them. They want to use these same applications at work, and they want to have the same flexibility that they have in their personal digital lives in their work life. Today’s corporate employees expect to work from any location, on devices of their choice and seamlessly connect and access business applications.

With this flexibility of enabling users to work where, when, and how they want comes increased risk. Plenty of data point to these devices being stolen, misplaced, or lost. On many of these smartphones and tablets there’s an incredible amount of sensitive and confidential customer and corporate content on it. This is the fine balance that IT Architects, Security Specialists, and IT Administrators are trying to maintain. It’s this balance between enabling users to be productive on all the devices that they love, while delivering the appropriate level of security and protection for the corporate content that resides on these devices.

With the multiple conditional access capabilities offered through Azure Active Directory, Office 365, and Microsoft Intune, IT administrators can solve the following:

- Allow employee anywhere access, without opening the door for everyone on the internet.
- Allow anywhere access to specific resources from known devices compliant with policies.
- Disallow access from lost, stolen, non-compliant devices.

![][1]

## What's next

The following topics discuss each of the different mechanisms available for setting conditional access polices in your organization.

- [Azure Active Directory Device Registration Overview](https://msdn.microsoft.com/library/azure/dn903763.aspx)
- [Setting up On-premises Conditional Access using Azure Active Directory Device Registration](https://msdn.microsoft.com/library/azure/dn788908.aspx)
- [Conditional Access Device Policies for Office 365 services](https://msdn.microsoft.com/library/azure/dn903766.aspx)
- [Azure Conditional Access Preview for SaaS Apps](https://msdn.microsoft.com/library/azure/dn906877.aspx)


<!--Image references-->
[1]: ./media/active-directory-conditional-access/condaccoverviewvsdx1.png
