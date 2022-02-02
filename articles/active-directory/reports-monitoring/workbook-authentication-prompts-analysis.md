---

title: Authentication prompts analysis workbook in  Azure AD | Microsoft Docs
description: Learn how to use the authentication prompts analysis workbook.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: karenho
editor: ''

ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 02/02/2022
ms.author: markvi
ms.reviewer: sarbar 

ms.collection: M365-identity-device-management
---

# Authentication prompts analysis workbook

As an IT Pro, you want the right information about authentication prompts in your environment so that you can detect unexpected prompts and investigate further. Providing you with this type of information is the goal of the **authentication prompts analysis workbook**. 


This article provides you with an overview of this workbook.


## Description

![Workbook category](./media/workbook-sensitive-operations-report/workbook-category.png)

Have you recently asked yourself: “why are my users getting so many prompts?”

Have you recently heard about complains from your users about getting too many authentication prompts?

Over prompting users:

- Impacts their productivity and often leads users getting phished for MFA. To be clear, MFA is essential! We are not talking about if you should require MFA but how frequently you should prompt your users.

- Can be caused by a misconfigured application, an over aggressive prompts policy or worst case, a cyber-attack. 
 
The Authentication prompts analysis workbook identifies various types of authentication prompts based on different pivots including users, applications, operating system, processes and more.

You can use this workbook in the following scenarios:

- You received aggregated feedback of too many prompts.
- To detect over prompting attributed to one specific authentication method, policy application, or device.
- To view authentication prompt counts of high-profile users.
- To track legacy TLS and other authentication process details.

 
 

## Sections

This workbook breaks down authentication prompts by: 

- Method
- Device state
- Application
- User
- Status
- Operating System
- Process detail
- Policy


![Authentication prompts by authentication method](./media/workbook-authentication-prompts-analysis/authentication-prompts-by-authentication-method.png)



In many environments, the most used apps are business productivity apps. Anything that isn’t expected should be investigated. The charts below show authentication prompts by application as well as the average, median and additional information that help with investigations including timestamp, and request id.



![Authentication prompts by application](./media/workbook-authentication-prompts-analysis/authentication-prompts-by-application.png)


![Prompts by application](./media/workbook-authentication-prompts-analysis/prompts-by-authentication-method.png)


The workbook also helps track impactful ways to improve your users’ experience and reduce prompts as well as the relative percentage.  


![Recommendations for reducing prompts](./media/workbook-authentication-prompts-analysis/recommendations-for-reducing-prompts.png)


  


## Filters


Take advantage of the filters for more granular views of the data: 


![Filter](./media/workbook-authentication-prompts-analysis/filters.png)

Filtering for a specific user that has a lot of authentication requests or only showing applications with sign-in failures can also lead to interesting findings to continue to remediate. 

## Best practices


If data is not showing up or seems to be showing up incorrectly, please confirm that you have set the **Log Analytics Workspace** and **Subscriptions** on the proper resources.


![Set workspace and subscriptions](./media/workbook-authentication-prompts-analysis/workspace-and-subscriptions.png)

If the visuals are taking too much time to load, try reducing the Time filter to 24 hours or less.

![Set filter](./media/workbook-authentication-prompts-analysis/set-filter.png)




## Next steps

- To understand more about the different policies that impact MFA prompts, see [Optimize reauthentication prompts and understand session lifetime for Azure AD Multi-Factor Authentication](../authentication/concepts-azure-multi-factor-authentication-prompts-session-lifetime.md). 

- To learn more about the different vulnerabilities of different MFA methods, see [All your creds are belong to us!](https://aka.ms/allyourcreds).

- To learn how to move users from telecom-based methods to the Authenticator app, see [How to run a registration campaign to set up Microsoft Authenticator - Microsoft Authenticator app](../authentication/how-to-mfa-registration-campaign.md).

