---
title: Troubleshoot Windows Virtual Desktop Insights - Azure
description: How to troubleshoot issues with Windows Virtual Desktop Insights.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 11/30/2020
ms.author: helohr
manager: lizross
---
# Troubleshoot Windows Virtual Desktop Insights

This article presents known issues and solutions for common problems in Windows Virtual Desktop Insights.

## The subscription I want to monitor doesn't appear 

If the subscription doesn’t have any Windows Virtual Desktop resources, it won’t show up in the Insights settings.

If you don't have read access to the correct subscriptions, it won’t show up. To solve this issue, contact your subscription owner and ask for read access.

## My data isn't displaying properly

If your data isn't displaying properly, something may have happened during the Insights configuration process. First, make sure you've filled out all fields in the configuration workbook as described in [Doc name](). You can change settings for both new and existing environments at any time. If you're missing any counters or events, the data associated with them won't appear in the Azure portal.

<!--Put link to doc here when it's available.-->

If you're not missing any information but your data still isn't displaying properly, there may be an issue in the query or the data sources. TODO: What's the recommended action here?

<!--Ask Logan to fill this out.-->

Finally, you may want to wait for 15 minutes and refresh the feed. Azure Monitor has a 15 minute latency period for populating log data. To learn more, see [Log data ingestion time in Azure Monitor](.../azure-monitor/platform/data-ingestion-time.md).

## I want to customize Windows Virtual Desktop Insights

Windows Virtual Desktop Insights uses Azure Monitor Workbooks. Workbooks lets you save a copy of the Windows Virtual Desktop workbook template and make your own customizations.

Customized templates won't update when the product group updates the original template. This is by design in the workbooks tool, you will need to save a copy of the updated template and re-build your customizations to adopt updates. For more information, see [Troubleshooting workbook-based insights](../azure-monitor/insights/troubleshoot-workbooks.md) and the [Workbooks overview](../azure-monitor/platform/workbooks-overview.md).

## The data I need isn't available

Can't find a data point to help diagnose an issue? Send us feedback!

<!--How will users give us feedback?-->

Here are some requests from users that we're already aware of:

- Expand the Time to Connect metric
- Profile Storage and FSLogix information
- Cost tracking and projections
- User’s gateway connection region

<!--This doesn't really feel like a proper troubleshooting section. We usually put our requests for feedback at the end of an article, too.-->

## Known issues

These are the issues we're currently aware of and working to fix:

- You can currently only select one subscription, resource group, and host pool to monitor at a time. Because of this, when using the User Reports page to understand a user’s experience, you need to verify that you have the correct host pool that the user has been using or their data will not populate the visuals.

- It's not currently possible to save favorite settings in Insights unless you save a custom template of the workbook. This means that IT admins will have to enter their subscription name, resource group names, and host pool preferences every time they open Insights.

- There currently isn't a way to export Insights data into Excel.

- All high priority Azure Monitor alerts for all products within the selected subscription will appear in the Overview page. This is by design, as alerts from other products in the subscription may impact Windows Virtual Desktop.

- Some error messages are not phrased in a user-friendly way, and due to the feature being in public preview, not all error messages are described in the documentation.

## Next steps

If you're unsure how to interpret the data, check out the references. If you want to learn more about common terms, check out our glossary.

<!---Add new articles once I have links--->