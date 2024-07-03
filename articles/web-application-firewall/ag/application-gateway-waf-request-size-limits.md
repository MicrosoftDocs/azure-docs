---
title: Web application firewall request size limits in Azure Application Gateway - Azure portal
description: This article provides information on Web Application Firewall request size limits in Application Gateway with the Azure portal.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.date: 03/05/2024
ms.author: victorh
ms.topic: conceptual 
---

# Web Application Firewall request and file upload size limits

Web Application Firewall allows you to configure request size limits within a lower and upper boundary. Application Gateways Web Application Firewalls running Core Rule Set 3.2 or later have more request and file upload size controls, including the ability to disable max size enforcement for requests and/or file uploads.


> [!IMPORTANT]
> We are in the process of deploying a new feature for Application Gateway v2 Web Application Firewalls running Core Rule Set 3.2 or later that allows for greater control of your request body size, file upload size, and request body inspection. If you're running Application Gateway v2 Web Application Firewall with Core Rule Set 3.2 or later, and you notice requests getting rejected (or not getting rejected) for a size limit please refer to the troubleshooting steps at the bottom of this page.


## Limits

The request body size field and the file upload size limit are both configurable within the Web Application Firewall. The maximum request body size field is specified in kilobytes and controls overall request size limit excluding any file uploads. The file upload limit field is specified in megabytes and it governs the maximum allowed file upload size. For the request size limits and file upload size limit, see [Application Gateway limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#application-gateway-limits).

For Application Gateway v2 Web Application Firewalls running Core Rule Set 3.2, or newer, the maximum request body size enforcement and max file upload size enforcement can be disabled and the Web Application Firewall will no longer reject a request, or file upload, for being too large. When maximum request body size enforcement and max file upload size enforcement are disabled within the Web Application Firewall, Application Gateway's limits determine the maximum size allowable. For more information, see [Application Gateway limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#application-gateway-limits).

Only requests with Content-Type of *multipart/form-data* are considered for file uploads. For content to be considered as a file upload, it has to be a part of a multipart form with a *filename* header. For all other content types, the request body size limit applies.


>[!NOTE]
>If you're running Core Rule Set 3.2 or later, and you have a high priority custom rule that takes action based on the content of a request's headers, cookies, or URI, this will take precedence over any max request size, or max file upload size, limits. This optimization let's the Web Application Firewall run high priority custom rules that don't require reading the full request first.
>
>**Example:** If you have a custom rule with priority 0 (the highest priority) set to allow a request with the header xyz, even if the request's size is larger than your maximum request size limit, it will get allowed before the max size limit is enforced

## Request body inspection

Web Application Firewall offers a configuration setting to enable or disable the request body inspection. By default, the request body inspection is enabled. If the request body inspection is disabled, Web Application Firewall doesn't evaluate the contents of an HTTP message's body. In such cases, Web Application Firewall continues to enforce Web Application Firewall rules on headers, cookies, and URI. In Web Application Firewalls running Core Rule Set 3.1 (or lower), if the request body inspection is turned off, then maximum request body size field isn't applicable and can't be set. 

For Policy Web Application Firewalls running Core Rule Set 3.2 (or newer), request body inspection can be enabled/disabled independently of request body size enforcement and file upload size limits. Additionally, policy Web Application Firewalls running Core Rule Set 3.2 (or newer) can set the maximum request body inspection limit independently of the maximum request body size. The maximum request body inspection limit tells the Web Application Firewall how deep into a request it should inspect and apply rules; setting a lower value for this field can improve Web Application Firewall performance but may allow for uninspected malicious content to pass through your Web Application Firewall.

For older Web Application Firewalls running Core Rule Set 3.1 (or lower), turning off the request body inspection allows for messages larger than 128 KB to be sent to Web Application Firewall, but the message body isn't inspected for vulnerabilities. For Policy Web Application Firewalls running Core Rule Set 3.2 (or newer), you can achieve the same outcome by disabling maximum request body limit.

When your Web Application Firewall receives a request that's over the size limit, the behavior depends on the mode of your Web Application Firewall and the version of the managed ruleset you use.
- When your Web Application Firewall policy is in prevention mode, Web Application Firewall logs and blocks requests and file uploads that are over the size limits.
- When your Web Application Firewall policy is in detection mode, Web Application Firewall inspects the body up to the limit specified and ignores the rest. If the `Content-Length` header is present and is greater than the file upload limit, Web Application Firewall ignores the entire body and logs the request.

## Troubleshooting

If you're an Application Gateway v2 Web Application Firewall customer running Core Rule Set 3.2 or later and you have issues with requests, or file uploads, getting rejected incorrectly for maximum size, or if you see requests not getting inspected fully, you may need to verify that all values are set correctly. Using PowerShell or the Azure Command Line Interface you can verify what each value is set to, and update any values as needed. 

**Enforce request body inspection**
- PS: "RequestBodyCheck"
- CLI: "request_body_check"
- Controls if your Web Application Firewall will inspect the request body and apply managed and custom rules to the request body traffic per your Web Application Firewall policy’s settings.

**Maximum request body inspection limit (KB)**
- PS: "RequestBodyInspectLimitInKB"
- CLI: "request_body_inspect_limit_in_kb"
- Controls how deep into a request body the Web Application Firewall will inspect and apply managed/custom rules. Generally speaking, you’d want to set this to the max possible setting, but some customers might want to set it to a lower value to improve performance.

**Enforce maximum request body limit**
- PS: "RequestBodyEnforcement"
- CLI: "request_body_enforcement"
- Control if your Web Application Firewall will enforce a max size limit on request bodies; when turned off it will not reject any requests for being too large.

**Maximum request body size (KB)**
- PS: "MaxRequestBodySizeInKB"
- CLI: "max_request_body_size_in_kb"
- Controls how large a request body can be before the Web Application Firewall rejects it for exceeding the max size setting.

**Enforce maximum file upload limit**
- PS: "FileUploadEnforcement"
- CLI: "file_upload_enforcement"
- Controls if your Web Application Firewall will enforce a max size limit on file uploads; when turned off it will not reject any file uploads for being too large.

**Maximum file upload size (MB)**
- PS: "FileUploadLimitInMB"
- CLI: file_upload_limit_in_mb
- Controls how large a file upload can be before the Web Application Firewall rejects it for exceeding the max size setting.

>[!NOTE]
>**"Inspect request body"** previously controlled if the request body was inspected and rules applied as well as if a maximum size limit was enforced on request bodies. Now this is handled by two separate fields that can be turned ON/OFF independently.

### PowerShell

You can use the following PowerShell commands to return your Azure policy and look at its current settings. 

```azurepowershell-interactive
$plcy = Get-AzApplicationGatewayFirewallPolicy -Name <policy-name> -ResourceGroupName <resourcegroup-name>
$plcy.PolicySettings
```

You can use these commands to update the policy settings to the desired values for inspection limit and max size limitation related fields. You can swap out 'RequestBodyEnforcement' in the example below for one of the other values that you want to update.

```azurepowershell-interactive
$plcy = Get-AzApplicationGatewayFirewallPolicy -Name <policy-name> -ResourceGroupName <resourcegroup-name>
$plcy.PolicySettings.RequestBodyEnforcement=false
Set-AzApplicationGatewayFirewallPolicy -InputObject $plcy
```

- [Get Web Application Firewall Policy](/powershell/module/az.network/get-azapplicationgatewayfirewallpolicy)
- [Policy Settings Properties](/dotnet/api/microsoft.azure.commands.network.models.psapplicationgatewaywebapplicationfirewallpolicy.policysettings)
- [Policy Settings Class](/dotnet/api/microsoft.azure.commands.network.models.psapplicationgatewayfirewallpolicysettings)
- [New Policy Settings](/powershell/module/az.network/new-azapplicationgatewayfirewallpolicysetting)

### Command line interface

You can use Azure CLI to return the current values for these fields from your Azure policy settings and update the fields to the desired values using [these commands](/cli/azure/network/application-gateway/waf-policy/policy-setting).

```azurecli-interactive
az network application-gateway waf-policy update --name <WAF Policy name> --resource-group <WAF policy RG> --set policySettings.request_body_inspect_limit_in_kb='2000' policySettings.max_request_body_size_in_kb='2000' policySettings.file_upload_limit_in_mb='3500' --query policySettings -o table
```

**Output:**
```azurecli-interactive
FileUploadEnforcement    FileUploadLimitInMb    MaxRequestBodySizeInKb    Mode       RequestBodyCheck    RequestBodyEnforcement    RequestBodyInspectLimitInKB    State
-----------------------  ---------------------  ------------------------  ---------  ------------------  ------------------------  -----------------------------  -------
True                     3500                   2000                      Detection  True                True                      2000                           Enabled
```

## Next steps

- After you configure your Web Application Firewall settings, you can learn how to view your Web Application Firewall logs. For more information, see [Application Gateway diagnostics](../../application-gateway/application-gateway-diagnostics.md#diagnostic-logging).
- [Learn more about Azure network security](../../networking/security/index.yml)

