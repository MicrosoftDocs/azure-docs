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

If the subscription doesn’t have any WVD resources, it won’t show up in the Insights settings.

If you do not have read access to the correct subscriptions, it won’t show up. Talk to the subscription owner to request read access.

## My data is not populating Windows Virtual Desktop Insights properly

First, verify that your configuration is set up properly with the Configuration Workbook. To revisit how to use the configuration workbook, see the How to document (this will work for new environments AND existing environments to point out if you are missing any data points). If you are missing counters or events, the visuals reliant on those data points will not be able to function.

If you are having trouble using the Configuration Workbook, all setup requirements can be manually enabled with the “learn more” links in the How To document.

If the Configuration Workbook has verified that you are not missing any data, and you are still seeing issues with how your data is visualized, there may be an issue in the query or the data sources. TODO: What's the recommended action here?

If you are troubleshooting a live issue with a user and do not see the relevant data in Insights, please note that Azure Monitor has a 15 minute latency for populating log data. To learn more see [Log data ingestion time in Azure Monitor](.../azure-monitor/platform/data-ingestion-time.md).

## I want to customize Windows Virtual Desktop Insights

Windows Virtual Desktop Insights is built on top of Azure Monitor Workbooks. Workbooks allows you to save a copy of the Windows Virtual Desktop workbook template and make your own customizations.

Customized templates won't update when the product group updates the original template. This is by design in the workbooks tool, you will need to save a copy of the updated template and re-build your customizations to adopt updates. For more information, see [Troubleshooting workbook-based insights](../azure-monitor/insights/troubleshoot-workbooks.md) and the [Workbooks overview](../azure-monitor/platform/workbooks-overview.md).

## The data I need isn't available

Looking for a data point to help diagnose an issue? Send us feedback!

Here are some of the requests we are already aware of:

- Expand the Time to Connect metric
- Profile Storage and FSLogix information
- Cost tracking and projections
- User’s gateway connection region

## Known issues

These are the issues we're currently aware of and working to fix:

- You can currently only select one subscription, resource group, and host pool to monitor at a time. Because of this, when using the User Reports section to understand a user’s experience, you need to verify that you have the correct host pool that the user has been using or their data will not populate the visuals.

- IT admins have to input subscription, resource groups, and host pool preferences each time they open Insights, it’s not possible to save favorite settings unless you save a custom template of the workbook.

- There is no way to export the data in Insights to excel.

- All Severity 1 Azure Monitor alerts for the selected subscription will surface in the Overview page, even those unrelated to Windows Virtual Desktop. This is by design, as alerts from sources on the subscription may impact Windows Virtual Desktop.

- Error messages are difficult to understand: Today, some error messages are not user friendly and due to the ever-evolving state of errors, not all errors are captured in documentation.

## Next steps

If you're unsure how to interpret the data, check out the references. If you want to learn more about common terms, check out our glossary.

<!---Add new articles once I have links--->