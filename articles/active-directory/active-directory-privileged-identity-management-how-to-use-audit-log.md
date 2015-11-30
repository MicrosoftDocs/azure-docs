<properties
   pageTitle="Azure Privileged Identity Management: How To Use the Audit Log"
   description="Learn how to use the audit log in the Azure Privileged Identity Management extension."
   services="active-directory"
   documentationCenter=""
   authors="IHenkel"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="na"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="09/21/2015"
   ms.author="inhenk"/>

# Azure Privileged Identity Management: How To Use the Audit Log

## Using the Audit Log
You can use the Privileged Identity Management audio log to see all of the user assignments and activations within a given time period.

## Navigating to the Audit Log
You can access the audit log by clicking Audit history in the PIM dashboard.

## The Audit Log Graph
You can use the audit log view the total activations, max activations per day, and average activations per day in a line graph.  You can also filter the data by role if there is more than one role in the audit history.

Sort by time, action, or role using the **time**, **action** or **role** buttons.

## The Audit Log List
The columns in the audit log list are:

- **Requestor** - who requested the role activation.
- **User** - the user of the role activation.
- **Role** - the role assigned to the user.
- **Action** - the actions taken with the role/user.
- **Time** - when the action occurred.
- **Reasoning** - if any text was entered into the reason field during activation, it will show up here.
- **Expiration** - if the expiration year is 9999 then the user has the role permanently.

## Filtering the Audit Log

You can also filter the information that shows up in the audit log by clicking the **Filter** button.  The **Update chart parameters blade** will appear.

### Change the date range
Change the time range of the audit log by selecting one of the **Today**, **Past Week**, **Past Month**, or **Custom** buttons.
When you choose the **Custom** button, you will be given a **From** date field and a **To** date field to specify the range of dates wanted for the log.  You can either enter the dates in MM/DD/YYYY format or click on the **calendar** icon and choose the date from a calendar.

### Change the roles included in the log

Check or uncheck the **Role** checkbox next to each role you want included or excluded from the log.

Once you have all the filters for the audit log set, click update to filter the data in the log.  If the data doesn't appear right away, click the **Refresh** button.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
