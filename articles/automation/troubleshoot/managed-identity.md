---
title: Troubleshoot Azure Automation managed identity issues (preview)
description: This article tells how to troubleshoot and resolve issues when using a managed identity with an Automation account.
services: automation
ms.subservice:
ms.date: 06/28/2021
ms.topic: troubleshooting
---

# Troubleshoot Azure Automation managed identity issues (preview)

This article discusses solutions to problems that you might encounter when you use a managed identity with your Automation account. For general information about using managed identity with Automation accounts, see [Azure Automation account authentication overview](../automation-security-overview.md#managed-identities-preview).

## Scenario: Fail to get MSI token for account

### Issue

When working with a user-assigned managed identity in your Automation account, you receive an error similar to: `Failed to get MSI token for account a123456b-1234-12a3-123a-aa123456aa0b`.

### Cause

Using a user-assigned managed identity before enabling a system-assigned managed identity for your Automation account.

### Resolution

Enable a system-assigned managed identity for your Automation account. Then use the user-assigned managed identity.  

## Scenario: Attempt to use managed identity with Automation account fails

### Issue

When you try to work with managed identities in your Automation account, you encounter an error like this:

```error
Connect-AzureRMAccount : An error occurred while sending the request. At line:2 char:1 + Connect-AzureRMAccount -Identity + 
CategoryInfo : CloseError: (:) [Connect-AzureRmAccount], HttpRequestException + FullyQualifiedErrorId : Microsoft.Azure.Commands.Profile.ConnectAzureRmAccountCommand
```

### Cause

The most common cause for this is that you didn't enable the identity before trying to use it. To verify this, run the following PowerShell runbook in the affected Automation account.

```powershell
resource= "?resource=https://management.azure.com/"
$url = $env:IDENTITY_ENDPOINT + $resource
$Headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$Headers.Add("X-IDENTITY-HEADER", $env:IDENTITY_HEADER)
$Headers.Add("Metadata", "True")

try
{
    $Response = Invoke-RestMethod -Uri $url -Method 'GET' -Headers $Headers
}
catch
{
    $StatusCode = $_.Exception.Response.StatusCode.value__
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    
    Write-Output "Request Failed with Status: $StatusCode, Message: $responseBody"
}
```

If the issue is that you didn't enable the identity before trying to use it, you should see a result similar to this:

`Request Failed with Status: 400, Message: {"Message":"No managed identity was found for Automation account xxxxxxxxxxxx"}`

### Resolution

You must enable an identity for your Automation account before you can use the managed identity service. See [Enable a managed identity for your Azure Automation account (preview)](../enable-managed-identity-for-automation.md)

## Next steps

If this article doesn't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport). This is the official Microsoft Azure account for connecting the Azure community to the right resources: answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.