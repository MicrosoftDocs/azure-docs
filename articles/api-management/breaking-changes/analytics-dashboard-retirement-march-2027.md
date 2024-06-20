---
title: Azure API Management - Analytics dashboard retirement (March 2027)
description: Azure API Management is replacing the built-in API analytics dashboard as of March 2027. An equivalent dashboard is available based on an Azure Monitor Workbook.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 05/16/2024
ms.author: danlep
---

# Built-in API analytics dashboard retirement (March 2027)

[!INCLUDE [premium-dev-standard-basic.md](../../../includes/api-management-availability-premium-dev-standard-basic.md)]

Effective 15 March 2027, the dashboard and reports associated with API Management built-in analytics will be retired. To replace them, a new version of API analytics has been introduced using Azure Monitor Log Analytics workbooks.  
  
## Is my service affected by this?

The Premium, Standard, Basic, and Developer tiers of API Management provide a [built-in analytics dashboard](../howto-use-analytics.md#legacy-built-in-analytics) and reports ("legacy built-in analytics") for each API Management instance. As of early 2024, API Management also provides identical API analytics using an [Azure Monitor-based dashboard](../howto-use-analytics.md#azure-monitor-based-dashboard) that aggregates data in an Azure Log Analytics workspace. The Azure Monitor-based dashboard is now the recommended solution for viewing API Management analytics data in the portal.

## What is the deadline for the change?
After 15 March 2027, the legacy built-in analytics will not be supported. Both the legacy built-in analytics and Azure Monitor-based analytics will be available in parallel for a period of time to allow for a smooth transition to the Azure Monitor-based implementation.

## What do I need to do?

From now through 15 March 2027, you will have access to both implementations in the Azure portal, featuring identical dashboards and reports. We recommend that you start using the Azure Monitor-based dashboard to view your API Management analytics data. To use the Azure Monitor-based dashboard, configure a Log Analytics workspace as a data source for API Management gateway logs. For more information, see [Tutorial: Monitor published APIs](../api-management-howto-use-azure-monitor.md).

When an option to do so becomes available, we recommend disabling the legacy analytics dashboard to improve the capacity performance of your API Management instance. We recommend pursuing this change proactively before the retirement date.

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](/answers). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

1. Under **Issue type**, select **Technical**.  
1. Under **Subscription**, select your subscription.  
1. Under **Service**, select **My services**, then select **API Management Service**. 
1. Under **Resource**, select the Azure resource that you’re creating a support request for.  
1. For **Summary**, type a description of your issue, for example, "built-in analytics". 

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).
