---
title: Azure API Management CAPTCHA endpoint change (September 2025) | Microsoft Docs
description: Azure API Management is updating the CAPTCHA endpoint. If your service is hosted in an Azure virtual network, you may need to update network settings to continue using the developer portal.
services: api-management
documentationcenter: ''
author: mikebudzynski
ms.service: api-management
ms.topic: reference
ms.date: 09/06/2022
ms.author: mibudz
---

# CAPTCHA endpoint update (September 2025)

On 30 September, 2025 as part of our continuing work to increase the resiliency of API Management services, we're permanently changing the CAPTCHA endpoint used by the developer portal. 

This change will have no effect on the availability of your API Management service. However, you may have to take steps described below to continue using the developer portal beyond 30 September, 2025.

## Is my service affected by this change?

Your service may be impacted by this change if:

* Your API Management service is running inside an Azure virtual network.
* You use the Azure API Management developer portal.

Follow the steps below to confirm if your network restricts connectivity to the new CAPTCHA endpoint.

1. Navigate to your API Management service in the Azure portal.
2. Select **Network** from the menu and go to the **Network status tab**.
3. Check the status for the **Captcha endpoint**. Your service is impacted if the status isn't **Success**.

## What is the deadline for the change?

The CAPTCHA endpoint will permanently change on 30 September, 2025. Complete all required networking changes before then.

After 30 September 2025, if you prefer not to make changes to your network configuration, your services will continue to run but the developer portal sign-up and password reset functionality will no longer work.

## What do I need to do?

Update the virtual network configuration to allow connectivity to the new CAPTCHA hostnames. 

| Environment | Endpoint |
| --- | --- |
| Global Azure cloud | `partner.prod.repmap.microsoft.com` |
| USGov | `partner.prod.repmap.microsoft.us` |

The new CAPTCHA endpoints provide the same functionality as the previous endpoints.

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/apim/azureqa/change/captcha-2022). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

1. For **Summary**, type a description of your issue, for example, "stv1 retirement". 
1. Under **Issue type**, select **Technical**.  
1. Under **Subscription**, select your subscription.  
1. Under **Service**, select **My services**, then select **API Management Service**. 
1. Under **Resource**, select the Azure resource that you’re creating a support request for.  
1. For **Problem type**, select **General configuration**. 
1. For **Problem subtype**, select **VNET integration**.

## More information

* [Virtual Network](../../virtual-network/index.yml)
* [API Management VNet Reference](../virtual-network-reference.md)
* [Microsoft Q&A](/answers/topics/azure-api-management.html)


## Next steps

See all [upcoming breaking changes and feature retirements](overview.md).