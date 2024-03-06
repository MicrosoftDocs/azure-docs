---
title: Azure API Management - Analytics dashboard retirement (March 2027)
description: Azure API Management is retiring the built-in API analytics dashboard as of March 2027. An equivalent dashboard is available based on an Azure Monitor Workbook.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 03/05/2024
ms.author: danlep
---

# API analytics dashboard retirement (March 2027)

As of 15 March 2027, Azure API Management will retire the built-in analytics dashboard available in the Azure portal. A new version of the dashboard will be introduced in early 2024 using Azure Monitor Workbooks, and the same dashboards and reports will be available using Log Analytics.
  
## Is my service affected by this?

[Built-in API analytics](../howto-use-analytics.md) is a feature of the Premium, Standard, Basic, and Developer tiers of API Management, and includes an Analytics dashboard available for each API Management instance in the Azure portal. A new version of the dashboards will be introduced in early 2024 using Azure Monitor Workbooks. The same dashboards and reports will be reproduced in the portal using Log Analytics. Both the old and new versions of the dashboards will be available in parallel for a period of time to allow for a smooth transition.

## What is the deadline for the change?

The built-in Analytics dashboard will no longer be available after 15 March 2027.

## What do I need to do?

From now through 15 March 2027, you will have access to both implementations in the Azure portal, featuring identical dashboards and reports. To view reports with the new implementation, you will need to add a Log Analytics workspace. For details, see the [documentation](https://aka.ms/builtinanalyticsv2-doc). 

Later, we will offer the option to disable the original Analytics dashboard. You are encouraged to do this, and disabling the Analytics dashboard will improve the capacity performance of you your API Management instance. After the retirement date, only the dashboards and reports using Log Analytics will be available.

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://learn.microsoft.com/answers). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

1. Under **Issue type**, select **Technical**.  
1. Under **Subscription**, select your subscription.  
1. Under **Service**, select **My services**, then select **API Management Service**. 
1. Under **Resource**, select the Azure resource that you’re creating a support request for.  
1. For **Summary**, type a description of your issue, for example, "built-in analytics". 


## Related content

See all [upcoming breaking changes and feature retirements](overview.md).
