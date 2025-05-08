---
title: Configure custom responses for Azure Front Door WAF policy
description: Learn how to configure a custom response code and message when Azure Web Application Firewall blocks a request.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: how-to
ms.date: 05/08/2025
ms.custom: devx-track-azurepowershell
---

# Configure a custom response for Azure Web Application Firewall

In this article, you learn how to configure a custom response page when Azure Web Application Firewall blocks a request.

By default, when Azure Web Application Firewall blocks a request because of a matched rule, it returns a 403 status code with the message "The request is blocked." The default message also includes the tracking reference string that's used to link to [log entries](./waf-front-door-monitor.md) for the request. You can configure a custom response status code and a custom message with a reference string for your use case.

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the Azure PowerShell module. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

---

## Configure a custom response status code and message

# [**Portal**](#tab/portal)

To customize the response status code and body, follow these steps:

1. Go to your Front Door WAF policy in the Azure portal.

1. Under **Settings**, select **Policy settings**.

1. Enter the custom response status code and response body in **Block response status code** and **Block response body** respectively.

:::image type="content" source="../media/waf-front-door-configure-custom-response-code/custom-response-settings.png" alt-text="Screenshot that shows Azure Web Application Firewall Policy settings." lightbox="../media/waf-front-door-configure-custom-response-code/custom-response-settings.png":::

1. Select **Save**.

In the preceding example, we kept the response code as 403 and configured a short "Please contact us" message, as shown in the following image:

:::image type="content" source="../media/waf-front-door-configure-custom-response-code/custom-response.png" alt-text="Screenshot that shows a custom response example.":::

# [**PowerShell**](#tab/powershell)

To customize the response status code and body, use [Update-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/Update-AzFrontDoorWafPolicy) cmdlet.


```azurepowershell-interactive
# modify WAF response body
Update-AzFrontDoorWafPolicy `
-Name 'myWAFPolicy' `
-ResourceGroupName 'myResourceGroup' `
-RequestBodyCheck 'Enabled' `
-RedirectUrl 'https://learn.microsoft.com/en-us/azure/web-application-firewall/' `
-CustomBlockResponseStatusCode '403' `
-CustomBlockResponseBody '<html><head><title>WAF Demo</title></head><body><p><h1><strong>WAF Custom Response Page</strong></h1></p><p>Please contact us with this information:<br>{{azure-ref}}</p></body></html>'
```

---

> [!NOTE]
> `{{azure-ref}}` inserts the unique reference string in the response body. The value matches the TrackingReference field in the `FrontDoorAccessLog` and `FrontDoorWebApplicationFirewallLog` logs.

> [!IMPORTANT]
> If you leave the block response body blank, the WAF returns a *403 Forbidden* response for normal WAF blocks and a *429 Too many requests* for rate limit blocks. 

## Next step

> [!div class="nextstepaction"]
> [Configure a Web Application Firewall rate-limit rule](../afds/waf-front-door-rate-limit-configure.md)
