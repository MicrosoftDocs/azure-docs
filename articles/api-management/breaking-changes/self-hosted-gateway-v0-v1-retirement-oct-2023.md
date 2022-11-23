---
title: Azure API Management - Self-hosted gateway v0/v1 retirement (October 2023) | Microsoft Docs
description: Azure API Management is retiring the v0 and v1 versions of the self-hosted gateway container image, effective 1 October 2023. If you've deployed one of these versions, you must migrate to the v2 version of the self-hosted gateway.
services: api-management
documentationcenter: ''
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 09/06/2022
ms.author: danlep
---

# Support ending for Azure API Management self-hosted gateway version 0 and version 1 container images (October 2023)

The [self-hosted gateway](../self-hosted-gateway-overview.md) is an optional, containerized version of the default managed gateway included in every API Management service. On 1 October 2023 we're removing support for the v0 and v1 versions of the self-hosted gateway container image. If you've deployed the self-hosted gateway using either of these container images, you need to take the steps below to continue using the self-hosted gateway by migrating to the v2 container image and configuration API.

## Is my service affected by this?

Your service is affected by this change if:

* Your service is in the Developer or Premium service tier.
* You have deployed a self-hosted gateway using the version v0 or v1 of the self-hosted gateway [container image](../self-hosted-gateway-migration-guide.md#using-the-new-configuration-api).

### Assessing impact with Azure Advisor

In order to make the migration easier, we have introduced new Azure Advisor recommendations:

- **Use self-hosted gateway v2** recommendation - Identifies Azure API Management instances where the usage of self-hosted gateway v0.x or v1.x was identified.
- **Use Configuration API v2 for self-hosted gateways** recommendation - Identifies Azure API Management instances where the usage of Configuration API v1 for self-hosted gateway was identified.

We highly recommend customers to use ["All Recommendations" overview in Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/All) to determine if a migration is required. Use the filtering options to see if one of the above recommendations is present.

## What is the deadline for the change?

**Support for the v1 configuration API and for the v0 and v1 container images of the self-hosted gateway will retire on 1 October 2023.**   

Version 2 of the configuration API and container image is already available, and includes the following improvements:  

* A new configuration API that removes the dependency on Azure Storage, unless you're using request tracing or quotas. 

* New container images, and new container image tags to let you choose the best way to try our gateway and deploy it in production. 

If you are using version 0 or version 1 of the self-hosted gateway, you will need to manually migrate your container images to the newest v2 image and switch to the v2 configuration API.

## What do I need to do?

Migrate all your existing deployments of the self-hosted gateway using version 0 or version 1 to the newest v2 container image and v2 configuration API by 1 October 2023.

Follow the [migration guide](../self-hosted-gateway-migration-guide.md) for a successful migration.

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/apim/retirement/shgwv0v1). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

1. For **Summary**, type a description of your issue, for example, "stv1 retirement". 
1. Under **Issue type**, select **Technical**.  
1. Under **Subscription**, select your subscription.  
1. Under **Service**, select **My services**, then select **API Management Service**. 
1. Under **Resource**, select the Azure resource that you’re creating a support request for.  
1. For **Summary**, type a description of your issue, for example, "v1/v0 retirement".
1. For **Problem type**, select **Self-hosted gateway**. 
1. For **Problem subtype**, select **Administration, Configuration and Deployment**. 

## Next steps

See all [upcoming breaking changes and feature retirements](overview.md).
