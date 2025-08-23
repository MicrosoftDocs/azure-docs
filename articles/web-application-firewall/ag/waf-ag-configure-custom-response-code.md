---
title: Configure custom responses for Azure Web Application Firewall with Application Gateway 
description: Learn how to configure a custom response code and body (message) when Azure Web Application Firewall blocks a request.
author: YaakobiEden  
ms.author: edenyaakobi
ms.service: azure-web-application-firewall
ms.topic: how-to
ms.date: 03/11/2025
---


# Configure custom response code and body for Azure Application Gateway WAF


By default, when Web Application Firewall (WAF) on Application Gateway blocks a request due to a matched rule, it returns a 403 status code with the message "The request is blocked." You can customize the response by configuring a custom status code and message to better suit your use case.

This article shows you how to configure a custom response page when Azure Application Gateway's Web Application Firewall (WAF) blocks a request using the Azure portal. You can also configure custom responses using the [Azure CLI](/cli/azure/network/application-gateway/waf-policy/policy-setting) and PowerShell. 

## Configure a custom response status code and message

To customize the response status code and body, take the following steps:

1. Go to your Application Gateway WAF policy in the Azure portal.

1. Under **Settings**, select **Policy settings**.

1. Enter the custom response status code and response body in **Block response status code** and **Block response body** respectively.



  :::image type="content" source="../media/application-gateway-waf-configure-custom-response-code-and-body/ag-waf-custom-response-settings.png" alt-text="Screenshot that shows Azure Web Application Firewall Policy settings." lightbox="../media/application-gateway-waf-configure-custom-response-code-and-body/ag-waf-custom-response-settings.png":::

4. Select **Save**.

In this example, we changed the default 403 response code to 429 and set a brief message stating, "The request has been blocked".

:::image type="content" source="../media/application-gateway-waf-configure-custom-response-code-and-body/ag-waf-custom-response.png" alt-text="Screenshot that shows a custom response example.":::


## Next steps

Learn more about [Azure Web Application Firewall on Application Gateway](../ag/ag-overview.md).
