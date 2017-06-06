---
title: How to use the audit log in Azure AD Privileged Identity Management | Microsoft Docs
description: Learn how to use the audit log in the Azure Privileged Identity Management extension.
services: active-directory
documentationcenter: ''
author: billmath
manager: femila
editor: ''

ms.assetid: 5d13a6dd-1fcb-4e76-82fb-cb2f4f0e4357
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/14/2017
ms.author: billmath
ms.custom: pim

---
# Using the audit log in PIM
You can use the Privileged Identity Management (PIM) audit log to see all the user assignments and activations within a given time period. If you want to see the full audit history of activity in your tenant, including administrator, end user, and synchronization activity, you can use the [Azure Active Directory access and usage reports.](active-directory-view-access-usage-reports.md)

## Navigate to the audit log
From the [Azure portal](https://portal.azure.com) dashboard, select the **Azure AD Privileged Identity Management** app. From there, access the audit log by clicking **Manage privileged roles** > **Audit history** in the PIM dashboard.

## The audit log graph
You can use the audit log to view the total activations, max activations per day, and average activations per day in a line graph.  You can also filter the data by role if there is more than one role in the audit history.

Use the **time**, **action**, and **role** buttons to sort the log.

## The audit log list
The columns in the audit log list are:

* **Requestor** - the user who requested the role activation or change.  If the value is "Azure System", check the Azure audit log for more information.
* **User** - the user who is activating or assigned to a role.
* **Role** - the role assigned or activated by the user.
* **Action** - the actions taken by the requestor. This can include assignment, unassignment, activation, or deactivation.
* **Time** - when the action occurred.
* **Reasoning** - if any text was entered into the reason field during activation, it will show up here.
* **Expiration** - only relevant for activation of roles.

## Filter the audit log
You can filter the information that shows up in the audit log by clicking the **Filter** button.  The **Update chart parameters blade** will appear.

After you set the filters, click **Update** to filter the data in the log.  If the data doesn't appear right away, refresh the page.

### Change the date range
Use the **Today**, **Past Week**, **Past Month**, or **Custom** buttons to change the time range of the audit log.

When you choose the **Custom** button, you will be given a **From** date field and a **To** date field to specify a range of dates for the log.  You can either enter the dates in MM/DD/YYYY format or click on the **calendar** icon and choose the date from a calendar.

### Change the roles included in the log
Check or uncheck the **Role** checkbox next to each role to include or exclude it from the log.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[!INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

