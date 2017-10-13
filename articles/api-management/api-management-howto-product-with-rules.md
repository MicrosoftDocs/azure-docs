---
title: Transform and protect your API with Azure API Management | Microsoft Docs
description: Learn how to protect your API with quotas and throttling (rate-limiting) policies.
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.assetid: 450dc368-d005-401d-ae64-3e1a2229b12f
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/10/2017
ms.author: apimpm

---
# Transform and protect your API 

The tutorial shows how to transform your API so it does not reveal a private backend info. For example, you might want to hide the info about technology stack that is running on the backend. You might also want to hide original URLs that appear in the body of API's HTTP response and instead redirect them to the APIM gateway.

This tutorial also shows you how easy it is to add protection for your backend API by configuring rate limit with Azure API Management. For example, you may want to limit a number of calls the API is called so it is not overused by developers. For more information, see [API Management policies](api-management-policies.md)

![Policies](./media/api-management-howto-product-with-rules/api-management-management-console.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Transform an API to strip response headers
> * Replace original URLs in the body of the API response with APIM gateway URLs
> * Protect an API by adding rate limit policy (throttling)

## Prerequisites

+ [Create an Azure API Management instance](get-started-create-service-instance.md).
+ [Import and publish your first API](import-and-publish.md)
 
## Strip response headers

This section shows how to hide the HTTP headers that you do not want to show to your users. In this example, the following headers get deleted in the HTTP response:

* **X-Powered-By**
* **X-AspNet-Version**

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Browse to your APIM instance.
3. Select the **API** tab.
4. Click **Demo Conference API** from your API list.
5. Select **All operations**.
6. On the top of the screen, select **Design** tab.
7. In the **Outbound processing** window, click the triangle (next to the pencil).
8. Select **Code editor**.
9. In the right window, under **Transformation policies**, click **+ Set HTTP header**.
10. Modify your **<outbound>** code to look like this:

        <set-header name="X-Powered-By" exists-action="delete" />
        <set-header name="X-AspNet-Version" exists-action="delete" />
                
## Replace original URLs in the body of the API response with APIM gateway URLs

This section shows how to hide original URLs that appear in the body of API's HTTP response and instead redirect them to the APIM gateway.

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Browse to your APIM instance.
3. Select the **API** tab.
4. Click **Demo Conference API** from your API list.
5. Select **All operations**.
6. On the top of the screen, select **Design** tab.
7. In the **Outbound processing** window, click the triangle (next to the pencil).
8. Select **Code editor**.
9. In the right window, under **Transformation policies**, click **+ Find and replace string in body**.
10. Modify your **<find-and-replace** code (in the **<outbound>** element) to replace the URL to match your APIM gateway. For example:

        <find-and-replace from="://conferenceapi.azurewebsites.net" to="://apiphany.azure-api.net/conference"/>

## Protect an API by adding rate limit policy (throttling)

This section shows how to add protection for your backend API by configuring rate limitt. For example, you may want to limit a number of calls the API is called so it is not overused by developers. In this example, the limit is set to 3 calls per 15 seconds for each subscription Id. After 15 seconds, a developer can retry calling the API.

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. Browse to your APIM instance.
3. Select the **API** tab.
4. Click **Demo Conference API** from your API list.
5. Select **All operations**.
6. On the top of the screen, select **Design** tab.
7. In the **Inbound processing** window, click the triangle (next to the pencil).
8. Select **Code editor**
9. In the right window, under **Access restriction plicies**, click **+ Limit call rate per key**.
10. Modify your **<rate-limit-by-key** code (in the **<inbound>** element) to the following code.

        <rate-limit-by-key calls="3" renewal-period="15" counter-key="@(context.Subscription.Id)" />
        
## Next steps

> [!div class="nextstepaction"]
> [Monitor your API](api-management-howto-use-azure-monitor.md)