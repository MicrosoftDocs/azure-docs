---
title: Configure a custom response page for Azure Web Application Firewall
description: This article provides information on how to configure a custom response page for Azure Web Application Firewall.
services: web-application-firewall
ms.topic: article
author: duongau
ms.service: web-application-firewall
ms.date: 02/26/2024
ms.author: duongau 
---

# Configure a custom response page for Azure Web Application Firewall

This article describes how to configure a custom response page when Azure Web Application Firewall (WAF) blocks a request.

By default, when WAF blocks a request, it returns a *403 Forbidden* response with the message *The request is blocked*. The default message includes the tracking reference string that is used to link to [log entries](application-gateway-waf-metrics.md). You can configure a custom response status code and message with a reference string for your use case.

## Configure custom responses

You can configure custom responses for WAF by using the Azure portal, PowerShell, or the Azure CLI.

#### [Portal](#tab/browser) 

## Create a new WAF policy with a custom response

1. In the Azure portal, select **+ Create a resource**, and search for and select **Web Application Firewall (WAF)**. Then select **Create**.

1. On the **Basic** tab, enter or select the following information and then select **Policy settings** tab:
   - **Policy for**: Select **Regional WAF (Application Gateway)**.
   - **Subscription**: Select the subscription for the WAF.
   - **Resource group**: Select the resource group for the WAF.
   - **Policy name**: Enter a name for the WAF policy.
   - **Policy state**: Select the checkbox to enable the policy.
   - *Policy mode*: Select **Prevention** or **Detection**.

1. On the **Policy settings** page, you can configure the block response status code and message. 

    :::image type="content" source="../media/custom-response-code/policy-settings.png" alt-text="Screenshot of the custom response code settings under the policy settings tab during creation.":::

   - **Block response status code**: Enter the status code for the block response. The default is *403*.
   - **Block response body**: Enter the message for the block response.

1. Complete the rest of the settings and then select **Review + create**. Review the settings and then select **Create**.

## Configure existing WAF policy with a custom response

1. Navigate to the WAF policy that you want to update.

1. Expand the *Settings* section and then select **Policy settings**.

1. On the **Policy settings** page, you can configure the block response status code and message. 

    :::image type="content" source="../media/custom-response-code/update-policy-settings.png" alt-text="Screenshot of updating the custom response code settings under the policy settings tab.":::

   - **Block response status code**: Enter the status code for the block response. The default is *403*.
   - **Block response body**: Enter the message for the block response.

#### [PowerShell](#tab/powershell)

## Create a new WAF policy with a custom response

1. Use the [New-AzApplicationGatewayFirewallPolicySettings](/powershell/module/az.network/new-azapplicationgatewayfirewallpolicysetting) to create the policy settings for the WAF policy.

    ```azurepowershell-interactive
    $policySettings = New-AzApplicationGatewayFirewallPolicySetting `
        -Mode Prevention `
        -State Enabled `
        -CustomBlockResponseStatusCode 405 `
        -CustomBlockResponseBody "Unauthorized access. The request is blocked."
    ```

1. Use the [New-AzApplicationGatewayFirewallPolicy](/powershell/module/az.network/new-azapplicationgatewayfirewallpolicy) cmdlet to create a new WAF policy with custom response settings.

    ``` azurepowershell-interactive
    New-AzApplicationGatewayFirewallPolicy `
        -Name myWAFPolicy `
        -ResourceGroupName myResourceGroup `
        -Location EastUS `
        -PolicySetting $policySettings
    ```

## Configure existing WAF policy with a custom response

1. Use the [New-AzApplicationGatewayFirewallPolicySettings](/powershell/module/az.network/new-azapplicationgatewayfirewallpolicysetting) to create the policy settings for the WAF policy.

    ```azurepowershell-interactive
    $policySettings = New-AzApplicationGatewayFirewallPolicySetting `
        -CustomBlockResponseStatusCode 406 `
        -CustomBlockResponseBody "Access denied. The request is blocked."
    ```

1. Use the [Set-AzApplicationGatewayFirewallPolicySetting](/powershell/module/az.network/set-azapplicationgatewayfirewallpolicysetting) cmdlet to update the custom response settings for an existing WAF policy.

```azurepowershell-interactive
Set-AzApplicationGatewayFirewallPolicySetting `
    -Name myWAFPolicy `
    -ResourceGroupName myResourceGroup `
    -PolicySetting $policySettings
```

#### [Azure CLI](#tab/azurecli)

## Create a new WAF policy with a custom response

Use the [az network application-gateway waf-policy create](/cli/azure/network/application-gateway/waf-policy) command to create a new WAF policy with custom response settings. The custom body must be base64 encoded.

```azurecli-interactive
az network application-gateway waf-policy create \
	--name myWAFPolicy \
	--resource-group myResourceGroup \
	--location eastus \
	--type OWASP \
	--version 3.2 \
	--policy-settings custom-status-code=405 custom-body=VW5hdXRob3JpemVkIGFjY2Vzcy4gVGhlIHJlcXVlc3QgaXMgYmxvY2tlZC4= state=enabled
```

## Configure existing WAF policy with a custom response

Use the [az network application-gateway waf-policy policy-setting update](/cli/azure/network/application-gateway/waf-policy?view=azure-cli-latest#az-network-application-gateway-waf-policy-update) command to update the custom response settings for an existing WAF policy. The custom body must be base64 encoded.

```azurecli-interactive
az network application-gateway waf-policy policy-setting update \
	--policy-name myWAFPolicy6 \
	--resource-group AzureResourceGroup \
    --custom-status-code 406 \
	--custom-body=QWNjZXNzIGRlbmllZC4gVGhlIHJlcXVlc3QgaXMgYmxvY2tlZC4=	
```

## Next steps

- Learn more about [Azure Web Application Firewall logs](web-application-firewall-logs.md).