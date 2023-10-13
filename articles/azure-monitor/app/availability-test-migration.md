---
title: Migrate from Azure Monitor Application Insights classic URL ping tests to standard tests
description: How to migrate from Azure Monitor Application Insights classic availability URL ping tests to standard tests.
ms.topic:    conceptual
ms.custom: devx-track-azurepowershell
ms.date: 10/11/2023
ms.reviewer: cogoodson
---

# Migrate availability tests

In this article, we guide you through the process of migrating from [classic URL ping tests](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) to the modern and efficient [standard tests](availability-standard-tests.md).

We simplify this process by providing clear step-by-step instructions to ensure a seamless transition and equip your applications with the most up-to-date monitoring capabilities.

## Migrate classic URL ping tests to standard tests

The following steps walk you through the process of creating [standard tests](availability-standard-tests.md) that replicate the functionality of your [URL ping tests](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability). It allows you to more easily start using the advanced features of [standard tests](availability-standard-tests.md) using your previously created [URL ping tests](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability).

> [!IMPORTANT]
> 
> On September 30th, 2026, **[URL ping tests](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) retire**. Transition to **[standard tests](/editor/availability-standard-tests.md)** before then.
> 
> - A cost is associated with running **[standard tests](/editor/availability-standard-tests.md)**. Once you create a **[standard test](/editor/availability-standard-tests.md)**, you will be charged for test executions.
> - Refer to **[Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/#pricing)** before starting this process.

### Prerequisites

- Any [URL ping test](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) within Application Insights
- [Azure PowerShell](/powershell/azure/get-started-azureps) access

### Steps

1.	Connect to your subscription with Azure PowerShell (Connect-AzAccount + Set-AzContext).

2.	List all URL ping tests in the current subscription:

    ```azurepowershell
    Get-AzApplicationInsightsWebTest | `
    Where-Object { $_.WebTestKind -eq "ping" } | `
    Format-Table -Property ResourceGroupName,Name,WebTestKind,Enabled;
    ```

3.	Find the URL Ping Test you want to migrate and record its resource group and name.

4.	The following commands create a standard test with the same logic as the URL ping test:

    ```azurepowershell
    $resourceGroup = "pingTestResourceGroup";
    $appInsightsComponent = "componentName";
    $pingTestName = "pingTestName";
    $newStandardTestName = "newStandardTestName";
    
    $componentId = (Get-AzApplicationInsights -ResourceGroupName $resourceGroup -Name $appInsightsComponent).Id;
    $pingTest = Get-AzApplicationInsightsWebTest -ResourceGroupName $resourceGroup -Name $pingTestName;
    $pingTestRequest = ([xml]$pingTest.ConfigurationWebTest).WebTest.Items.Request;
    $pingTestValidationRule = ([xml]$pingTest.ConfigurationWebTest).WebTest.ValidationRules.ValidationRule;
    
    $dynamicParameters = @{};
    
    if ($pingTestRequest.IgnoreHttpStatusCode -eq [bool]::FalseString) {
    
    $dynamicParameters["RuleExpectedHttpStatusCode"] = [convert]::ToInt32($pingTestRequest.ExpectedHttpStatusCode, 10);
    
    }
    
    if ($pingTestValidationRule -and $pingTestValidationRule.DisplayName -eq "Find Text" `
    
    -and $pingTestValidationRule.RuleParameters.RuleParameter[0].Name -eq "FindText" `
    -and $pingTestValidationRule.RuleParameters.RuleParameter[0].Value) {
    $dynamicParameters["ContentMatch"] = $pingTestValidationRule.RuleParameters.RuleParameter[0].Value;
    $dynamicParameters["ContentPassIfTextFound"] = $true;
    }
    
    New-AzApplicationInsightsWebTest @dynamicParameters -ResourceGroupName $resourceGroup -Name $newStandardTestName `
    -Location $pingTest.Location -Kind 'standard' -Tag @{ "hidden-link:$componentId" = "Resource" } -TestName $newStandardTestName `
    -RequestUrl $pingTestRequest.Url -RequestHttpVerb "GET" -GeoLocation $pingTest.PropertiesLocations -Frequency $pingTest.Frequency `
    -Timeout $pingTest.Timeout -RetryEnabled:$pingTest.RetryEnabled -Enabled:$pingTest.Enabled `
    -RequestParseDependent:($pingTestRequest.ParseDependentRequests -eq [bool]::TrueString);
    
    ```

5. The new standard test doesn't have alert rules by default, so it doesn't create noisy alerts. No changes are made to your URL ping test so you can continue to rely on it for alerts.
6. Once you have validated the functionality of the new standard test, [update your alert rules](/azure/azure-monitor/alerts/alerts-manage-alert-rules) that reference the URL ping test to reference the standard test instead. Then you disable or delete the URL ping test.
7. To delete a URL ping test with Azure PowerShell, you can use this command:

    ```azurepowershell
    Remove-AzApplicationInsightsWebTest -ResourceGroupName $resourceGroup -Name $pingTestName;
    ```

## FAQ

#### When should I use these commands?

Migrate URL ping tests to standard tests now to take advantage of new capabilities.

#### Do these steps work for both HTTP and HTTPS endpoints?

Yes, these commands work for both HTTP and HTTPS endpoints, which are used in your URL ping Tests.

## More Information

* [Standard tests](availability-standard-tests.md)
* [Availability alerts](availability-alerts.md)
* [Troubleshooting](troubleshoot-availability.md)
* [Web tests Azure Resource Manager template](/azure/templates/microsoft.insights/webtests?tabs=json)
* [Web test REST API](/rest/api/application-insights/web-tests)