---
title: Azure API Management - stv1 platform retirement (August 2024) | Microsoft Docs
description: Azure API Management is retiring the stv1 compute platform effective 31 August 2024. If your API Management instance is hosted on the stv1 platform, you must migrate to the stv2 platform.
services: api-management
documentationcenter: ''
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 01/10/2023
ms.author: danlep
---

# stv1 platform retirement (August 2024)

As a cloud platform-as-a-service (PaaS), Azure API Management abstracts many details of the infrastructure used to host and run your service. **The infrastructure associated with the API Management `stv1` compute platform version will be retired effective 31 August 2024.** A more current compute platform version (`stv2`) is already available, and provides enhanced service capabilities. 

The following table summarizes the compute platforms currently used for instances in the different API Management service tiers. 

| Version | Description | Architecture | Tiers |
| -------| ----------| ----------- | ---- |
| `stv2` | Single-tenant v2 | Azure-allocated compute infrastructure that supports availability zones, private endpoints | Developer, Basic, Standard, Premium<sup>1</sup> |
| `stv1` |  Single-tenant v1 | Azure-allocated compute infrastructure |  Developer, Basic, Standard, Premium | 
| `mtv1` | Multi-tenant v1 |  Shared infrastructure that supports native autoscaling and scaling down to zero in times of no traffic |  Consumption |

To take advantage of upcoming features, we're recommending that customers migrate their Azure API Management instances from the `stv1` compute platform to the `stv2` compute platform. The `stv2` compute platform comes with additional features and improvements such as support for Azure Private Link and other networking features. 

New instances created in service tiers other than the Consumption tier are mostly hosted on the `stv2` platform already. Existing instances on the `stv1` compute platform will continue to work normally until the retirement date, but those instances won’t receive the latest features available to the `stv2` platform. Support for `stv1` instances will be retired by 31 August 2024.  

## Is my service affected by this?

If the value of the `platformVersion` property of your service is `stv1`, it is hosted on the `stv1` platform. See [How do I know which platform hosts my API Management instance?](../compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance)

## What is the deadline for the change?

Support for API Management instances hosted on the `stv1` platform will be retired by 31 August 2024.

After 31 August 2024, any instance hosted on the `stv1` platform won't be supported, and could experience system outages. 

## What do I need to do?

**Migrate all your existing instances hosted on the `stv1` compute platform to the `stv2` compute platform by 31 August 2024.**  

If you have existing instances hosted on the `stv1` platform, you can follow our [migration guide](../migrate-stv1-to-stv2.md) which provides all the details to ensure a successful migration. 

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/apim/retirement/stv1). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

1. For **Summary**, type a description of your issue, for example, "stv1 retirement". 
1. Under **Issue type**, select **Technical**.  
1. Under **Subscription**, select your subscription.  
1. Under **Service**, select **My services**, then select **API Management Service**. 
1. Under **Resource**, select the Azure resource that you’re creating a support request for.  
1. For **Problem type**, select **Administration and Management**. 
1. For **Problem subtype**, select **Upgrade, Scale or SKU Changes**. 

## Next steps

See all [upcoming breaking changes and feature retirements](overview.md).