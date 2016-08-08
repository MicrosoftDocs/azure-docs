<properties
   pageTitle="Azure Active Directory Reporting: Getting started | Microsoft Azure"
   description="Lists the various available reports in Azure Active Directory reporting"
   services="active-directory"
   documentationCenter=""
   authors="markusvi"
   manager="femila"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="08/08/2016"
   ms.author="markvi"/>

# Azure Active Directory reporting - preview

With Azure Active Directory reporting, you get all the information you need to determine how your environment is doing.

There are two main areas of reporting:

- **Sign-in activities** – Information about the usage of managed applications and user sign-in activities 

- **System activities** - Audit information about users and group management, your managed applications and directory activities 

Depending on the scope of the data you are looking for, you can access these reports either by clicking **User management** or **Enterprise applications** in the left navigation bar of the Azure management portal. 


 

## Sign-in activities

With the information provided by the user sign-in report, you find answers to questions such as:

- What is the sign-in pattern of a user?
- How many users have users signed-in over a week?
- What’s the status of these sign-ins?

Your entry point to this data is the user sign-in graph in the **Overview** section under **User management**. 

 ![Reporting](./media/active-directory-reporting/05.png "Reporting")

The user sign-in graph shows weekly aggregations of sign ins for all users in a given time period. The default for the time period is 30 days. 
 

![Reporting](./media/active-directory-reporting/02.png "Reporting")
 

When you click on a day in the sign-in graph, you get a detailed list of the sign-in activities.

![Reporting](./media/active-directory-reporting/03.png "Reporting")
 

Each row in the sign-in activities list gives you the detailed information about the selected sign-in such as:

- Who has signed-in?

- What was the related UPN?

- What application was the target of the sign-in?

- What is the IP address of the sign-in?

- What was the status of the sign-in?


While the overview section provides you with an aggregated view of all user sign-ins, you can also scope the data around a specific user, groups or applications.



With an application centric view of your sign-in data, you can answer questions such as:

- Who is using my applications?

- What are the top 3 applications in your organization?

- I have recently rolled-out an application. How is it doing?

Your entry point to this data is the top 3 applications in your organization within the last 30 days report in the **Overview** section under **Enterprise applications**.

 ![Reporting](./media/active-directory-reporting/06.png "Reporting")

Like in the case of user sign-in data, you can scope the application data around specific applications.


## System activities

The auditing reports in Azure Active Directory provide records of system activities for compliance.

There are two main audit views in the Azure portal:

- User and group related activities  

- Application activities  

You can filter an audit report by a date or a target resource type such as a specific application, a user or group and you can group them by activity.

\<screenshot\>


With user and group-based audit reports, you can get answers to questions such as:

- What types of updates have been applied the users?

- How many users were changed?

- How many passwords were changed? 

- What has an administrator done in a directory?

- What are the groups that have been added?

- Are there groups with membership changes?

- Have the owners of group been changed? 



With application-based audit reports, you can get answers to questions such as:

- What are the applications that have been added?

- What are the applications that have been removed?

- Has a service principle for an application changed?

- Have the names of applications been changed? 

For a complete list of audit report activities, see the [list of audit report events](active-directory-reporting-audit-events.md#list-of-audit-report-events).

