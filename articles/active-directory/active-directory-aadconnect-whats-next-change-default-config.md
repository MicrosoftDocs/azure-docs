<properties 
	pageTitle="Change Azure AD Connect Default Configuration" 
	description="Learn how to change default configuration for Azure AD Connect." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="swadhwa" 
	editor="curtand"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/28/2015" 
	ms.author="billmath"/>

# Changing the Azure AD Connect default configuration 


The default configuration of Azure AD Connect in most instances is sufficient to easily extend your on-premises directories into the cloud.  However there are certain instances when you may need to modify the default and tailor it to your organizations business logic.  In these instances you can modify the default configuration however there are some things you need to be aware of before you do this.

When you need to change the default configuration, do the following:

- When you need to modify an attribute flow of an “out-of-box” synchronization rule, do not change it. Instead, create a new synchronization rule with a higher precedence (lower numeric value) that contains your required attribute flow.
- Export your custom synchronization rules using the Synchronization Rules Editor. This provides you with a PowerShell script you can use to easily recreate them in the case of a disaster recovery scenario.
- If you need to change the scope or the join setting in an “out-of-box” synchronization rule, document this and reapply the change after upgrading to a newer version of Azure AD Connect. 