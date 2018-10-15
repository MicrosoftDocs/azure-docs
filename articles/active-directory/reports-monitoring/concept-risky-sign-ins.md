---

title: Risky sign-ins report in the Azure Active Directory portal | Microsoft Docs
description: Learn about the risky sign-ins report in the Azure Active Directory portal
services: active-directory
author: priyamohanram
manager: mtillman

ms.assetid: 7728fcd7-3dd5-4b99-a0e4-949c69788c0f
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 11/14/2017
ms.author: priyamo
ms.reviewer: dhanyahk

---
# Risky sign-ins report in the Azure Active Directory portal

With the security reports in Azure Active Directory (Azure AD) you can gain insights into the probability of compromised user accounts in your environment. 

Azure AD detects suspicious actions that are related to your user accounts. For each detected action, a record called *risk event* is created. For more details, see [Azure Active Directory risk events](concept-risk-events.md). 

The detected risk events are used to calculate:

- **Risky sign-ins** - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account. For more details, see [How to configure the sign-in risk policy](../identity-protection/howto-sign-in-risk-policy.md). 

- **Users flagged for risk** - A risky user is an indicator for a user account that might have been compromised. For more details, see [How to configure the user risk policy](../identity-protection/howto-user-risk-policy.md).  

In [the Azure portal](https://portal.azure.com), you can find the security reports on the **Azure Active Directory** blade in the **Security** section. 

![Risky Sign-ins](./media/concept-risky-sign-ins/10.png)

## Who can access the risky sign-ins report?

The risky sign-ins reports are available to users in the following roles:

- Security Administrator
- Global Administrator
- Security Reader

To learn how to assign administrative roles to a user in Azure Active Directory, see [View and assign administrator roles in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-manage-roles-portal).

## What Azure AD license do you need to access a security report?  

All editions of Azure Active Directory provide you with risky sign-ins reports.  
However, the level of report granularity varies between the editions: 

- In the **Azure Active Directory Free and Basic editions**, you already get a list of risky sign-ins. 

- The **Azure Active Directory Premium 1** edition extends this model by also enabling you to examine some of the underlying risk events that have been detected for each report. 

- The **Azure Active Directory Premium 2** edition provides you with the most detailed information about all underlying risk events and it also enables you to configure security policies that automatically respond to configured risk levels.

## Azure Active Directory free and basic edition

The Azure Active Directory free and basic editions provide you with a list of risky sign-ins that have been detected for your users. This report lists:

- **User** - The name of the user that was used during the sign-in operation
- **IP** - The IP address of the device that was used to connect to Azure Active Directory
- **Location** - The location used to connect to Azure Active Directory
- **Sign-in time** - The time when the sign-in was performed
- **Status** - The status of the sign-in


![Risky Sign-ins](./media/concept-risky-sign-ins/01.png)

Based on your investigation of the risky sign-in, you can provide feedback to Azure Active Directory in form of the following actions:

- Resolve
- Mark as false positive
- Ignore
- Reactivate

![Risky Sign-ins](./media/concept-risky-sign-ins/21.png)



This report provides you with an option to:

- Search resources
- Download the report data


![Risky Sign-ins](./media/concept-risky-sign-ins/93.png)


## Azure Active Directory premium editions

The risky sign-ins report in the Azure Active Directory premium editions provides you with:

- Aggregated information about the [risk event types](concept-risk-events.md) that have been detected

- An option to download the report


![Risky Sign-ins](./media/concept-risky-sign-ins/456.png)


When you select a risk event, you get a detailed report view for this risk event that enables you to:

- An option to configure a [user risk remediation policy](../identity-protection/howto-user-risk-policy.md)  

- Review the detection timeline for the risk event  

- Review a list of users for which this risk event has been detected

- Manually close risk events. 


![Risky Sign-ins](./media/concept-risky-sign-ins/457.png)

When you select a user, you get a detailed report view for this user that enables you to:

- Open the All sign-ins view

- Reset the user's password

- Dismiss all events

- Investigate reported risk events for the user. 


![Risky Sign-ins](./media/concept-risky-sign-ins/324.png)


To investigate a risk event, select one from the list.  
This opens the **Details** blade for this risk event. On the **Details** blade, you have the option to either manually close a risk event or reactivate a manually closed risk event. 


![Risky Sign-ins](./media/concept-risky-sign-ins/325.png)





## Next steps

- For more information about Azure Active Directory Identity Protection, see [Azure Active Directory Identity Protection](../active-directory-identityprotection.md).

