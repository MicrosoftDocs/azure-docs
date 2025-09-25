---
title: Configure custom responses for Azure Application Gateway
titleSuffix: Azure Web Application Firewall
description: Learn how to configure a custom response code and body (message) when Azure Web Application Firewall on Azure Application Gateway blocks a request.
author: YaakobiEden  
ms.author: edenyaakobi
ms.service: azure-web-application-firewall
ms.topic: how-to
ms.date: 08/24/2025
---

# Configure custom response code and body for Azure Application Gateway WAF

By default, when Azure Web Application Firewall (WAF) on Azure Application Gateway blocks a request due to a matched rule, it returns a 403 status code with the message "The request is blocked." You can customize the response by configuring a custom status code and message to better suit your use case.

This article shows you how to configure a custom response page when Azure Application Gateway's Web Application Firewall (WAF) blocks a request using the Azure portal. You can also configure custom responses using the [Azure CLI](/cli/azure/network/application-gateway/waf-policy/policy-setting) or PowerShell. 

## Configure a custom response status code and message

To customize the response status code and body, take the following steps:

1. Go to your Application Gateway WAF policy in the Azure portal.

1. Under **Settings**, select **Policy settings**.

1. Enter the custom response status code and response body in **Block response status code** and **Block response body** respectively.

    :::image type="content" source="../media/configure-custom-response-code/application-gateway-custom-response-settings.png" alt-text="Screenshot that shows Azure Web Application Firewall policy settings." lightbox="../media/configure-custom-response-code/application-gateway-custom-response-settings.png":::

1. Select **Save**.

In this example, we changed the default 403 response code to 429 and set a brief message stating, *The request has been blocked*.

:::image type="content" source="../media/configure-custom-response-code/application-gateway-custom-response.png" alt-text="Screenshot that shows a custom response example.":::

## Related content

- [Azure Web Application Firewall policy](policy-overview.md)
- [Create Web Application Firewall policies for Application Gateway](create-waf-policy-ag.md)
- [Azure Web Application Firewall on Application Gateway](ag-overview.md)
