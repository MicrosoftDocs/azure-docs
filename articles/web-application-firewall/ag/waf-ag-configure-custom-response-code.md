---
title: Configure custom responses for Web Application Firewall with Application Gateway 
description: Learn how to configure a custom response code and body (message) when Azure Web Application Firewall blocks a request.
author: edenYaakobi  
ms.author: edenyaakobi
ms.service: azure-web-application-firewall
ms.topic: how-to
ms.date: 03/11/2025
ms.custom:
zone_pivot_groups: 
---

# Configuring Custom Response code and body for Azure Application Gateway WAF

This article explains how to configure a custom response page when Azure Application Gateway's Web Application Firewall (WAF) blocks a request.

By default, when WAF on Application Gateway blocks a request due to a matched rule, it returns a 403 status code with the message "The request is blocked." You can customize the response by configuring a custom status code and message to better suit your use case.

## Configure a custom response status code and message by using the portal

You can customize the response status code and body in the **Policy settings** section of the Azure Web Application Firewall portal.

:::image type="content" source="../media/application-gateway-custom-code-and-body/ag-waf-custom-response-settings.png" alt-text="Screenshot that shows Azure Web Application Firewall Policy settings.":::

In this example, we retained the 403 response code and set a brief message stating, "The request has been blocked" as illustrated in the image below:

:::image type="content" source="../media/application-gateway-custom-code-and-body/ag-waf-custom-response.png" alt-text="Screenshot that shows a custom response example.":::



## Configure a custom response status code and message by using Azure PowerShell

Follow these steps to configure a custom response status code and message using PowerShell. [Learn more](https://learn.microsoft.com/cli/azure/network/application-gateway/waf-policy/policy-setting).


## Configure a custom response status code and message by using Azure CLI 

Follow these steps to configure a custom response status code and message using PowerShell. [Learn more](https://learn.microsoft.com/cli/azure/network/application-gateway/waf-policy/policy-setting).

## Next steps

Learn more about [Azure Web Application Firewall on Application Gatway](../ag/ag-overview.md).
