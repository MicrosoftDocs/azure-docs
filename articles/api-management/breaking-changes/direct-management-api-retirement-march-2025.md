---
title: Azure API Management - Direct management API retirement (March 2025)
description: Azure API Management is retiring its direct management API as of March 2025. Use the Azure Resource Manager-based API instead.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.custom: devx-track-arm-template
ms.topic: reference
ms.date: 05/16/2024
ms.author: danlep
---

# Direct management API retirement (March 2025)

[!INCLUDE [premium-dev-standard-basic.md](../../../includes/api-management-availability-premium-dev-standard-basic.md)]

The direct management API in Azure API Management is deprecated and will be retired effective 15 March 2025. You should discontinue use of the direct management API to configure and manage your API Management instance programmatically, and migrate to the standard Azure Resource Manager-based API instead.

## Is my service affected by this?

A built-in [direct management API](/rest/api/apimanagement/apimanagementrest/api-management-rest) to programmatically manage your API Management instance is disabled by default but can be enabled in the Premium, Standard, Basic, and Developer tiers of API Management. This API is deprecated. While your API Management instance isn't affected by this change, any tool, script, or program that uses the direct management API to interact with the API Management service is affected by this change. You'll be unable to run those tools successfully after the retirement date unless you update the tools to use the standard [Azure Resource Manager-based REST API](/rest/api/apimanagement) for API Management.

## What is the deadline for the change?

The direct management API is deprecated. Support for the direct management API will no longer be available after 15 March 2025.

## What do I need to do?

You should no longer use the direct management API. Before the retirement date, update your tools, scripts, and programs to use equivalent operations in the Azure Resource Manager-based REST API instead. 

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](/answers). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

1. Under **Issue type**, select **Technical**.  
1. Under **Subscription**, select your subscription.  
1. Under **Service**, select **My services**, then select **API Management Service**. 
1. Under **Resource**, select the Azure resource that you’re creating a support request for.  
1. For **Summary**, type a description of your issue, for example, "Direct management API". 

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).
