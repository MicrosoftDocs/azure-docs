---

title: What is the sign-in diagnostic for Azure Active Directory?
description: Provides a general overview of the sign-in diagnostic in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: e2b3d8ce-708a-46e4-b474-123792f35526
ms.service: active-directory
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 07/07/2021
ms.author: markvi
ms.reviewer: tspring  

# Customer intent: As an Azure AD administrator, I want a tool that gives me the right level of insights into the sign-in activities in my system so that I can easily diagnose and solve problems when they occur.
ms.collection: M365-identity-device-management
---

# What is the sign-in diagnostic in Azure AD?

Determining the reason for a failed sign-in can quickly become a challenging task. You need to analyze what happened during the sign-in attempt, and research the available recommendations to resolve the issue. Ideally, you want to resolve the issue without involving others such as Microsoft support.

If you are in a situation like this, you can use the sign-in diagnostic in Azure AD, a virtual assistant that helps you investigating sign-ins in Azure AD. 

This article gives you an overview of what the diagnostic is and how you can use it to troubleshoot sign-in related errors. 


## How it works  

In Azure AD, sign-in attempts are controlled by:

- **Who** - The user performing a sign in attempt.
- **How** - How a sign-in attempt was performed.

For example, you can configure conditional access policies that enable administrators to configure all aspects of the tenant when they sign in from the corporate network. But the same user might be blocked when they sign into the same account from an untrusted network. 

Due to the greater flexibility of the system to respond to a sign-in attempt, you might end-up in scenarios where you need to troubleshoot sign-ins. The sign-in diagnostic is a feature that: 

The sign-in diagnostic is a feature that is designed to enable self-diagnosis of sign-in issues by:  

- Analyzing data from sign-in events.  

- Displaying information about what happened.  

- Providing recommendations to resolve problems.  

To start and complete the diagnostic process, you need to:   

1. **Define scope** - Enter information about the sign-in event 

2. **Select event** - Select an event based on the information shared. 

3. **Take action** - Review diagnostic results and perform steps.


### Define scope 

Sharing information about the sign-in event allows the diagnostic to identify the right events for you. Your description can consist of the name of the user, an identifier (correlationId, requestId) and / or a time range. To narrow down further, you can specify an app name. 


### Select event  

Based on your search criteria, Azure AD retrieves all matching sign-in events and presents them in an authentication summary list view.  

![Screenshot showing the authentication summary list.](./media/overview-sign-in-diagnostics/review-sign-ins.png)

You can change the content displayed in the columns based on your preference. Examples are:

- Risk details
- Conditional access status
- Location
- Resource ID
- User type
- Authentication details

### Take action

For the selected sign-in event, you get a diagnostic results. Read through the results to identify action that you can take to fix the problem. These results ad recommended steps shed light on relevant information such as the related policies, sign-in details and supportive documentation. Since it's not always possible to resolve issues without more help, a recommended step might be to open a support ticket. 


![Screenshot showing the authentication summary list.](./media/overview-sign-in-diagnostics/diagnostic-results.png)



## How to access it




To use the diagnostic, you must be signed into the tenant as a global admin or a global reader. If you do not have this level of access, use Privileged Identity Management, PIM, to elevate your access to global admin/reader within the tenant. This will allow you to have temporary access to the diagnostic.  



## Next steps

- [What are Azure Active Directory reports?](overview-reports.md)
- [What is Azure Active Directory monitoring?](overview-monitoring.md)
