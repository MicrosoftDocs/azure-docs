---
title:       Migrate Availability Tests - Azure Monitor Application Insights
description: Migrate from Azure Monitor Application Insights classic availability tests
ms.topic:    conceptual
ms.date:     07/19/2023
ms.reviewer: cogoodson
---

# Migrate availability tests

In this article, we guide you through the process of migrating from classic URL ping tests to the more modern and efficient standard tests.

We simplify this process by providing clear step-by-step instructions to ensure a seamless transition and equip your applications with the most up-to-date monitoring capabilities.

## Migrate URL ping (classic) tests to standard tests

The following steps walk you through the process of creating Standard tests that replicate the functionality of your URL ping tests. It allows you to more easily start using the advanced features of [standard tests](standard-tests.md) using your previously created URL ping tests.

> [!NOTE]
> A cost is associated with running standard tests. Once you create a standard test, you will be charged for test executions.
> Refer to [Azure Monitor pricing](https://azure.microsoft.com/en-gb/pricing/details/monitor/#pricing) before starting this process.

# Prerequisites

1. Any URL ping test within Application Insights
2. PowerShell access

# Steps

1.	Connect to your subscription with Azure PowerShell (Connect-AzAccount + Set-AzContext).
2.	List all URL ping tests in a resource group:

```azurepowershell
$resourceGroup = "myResourceGroup";
Get-AzApplicationInsightsWebTest -ResourceGroupName $resourceGroup | `
    Where-Object { $_.WebTestKind -eq "ping" };
```
3.	Find the URL ping Test you want to migrate and record its name.
4.	The following commands create a standard test with the same logic as the URL ping test:

```azurepowershell
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
6. Once you have validated the functionality of the new Standard test, [update your alert rules](/azure/azure-monitor/alerts/alerts-manage-alert-rules) that reference the URL ping test to reference the Standard test instead. Then you disable or delete the URL ping test.
7. To delete a URL ping test with Azure PowerShell, you can use this command:

```azurepowershell
Remove-AzApplicationInsightsWebTest -ResourceGroupName $resourceGroup -Name $pingTestName;
```

## FAQ

1. When should I use these commands?

We recommend using these commands to migrate a URL ping test to a standard test and take advantage of the available capabilities. Remember, this migration is optional.

2. Do these commands delete the existing test?

No, these commands only create a new standard test and allow you to validate the standard test is performing as expected based on the existing URL ping test.  If you would like to remove the URL ping test later, you can use the [Web Test Rest API](/rest/api/application-insights/web-tests).

3. Do these steps work for both HTTP and HTTPS endpoints?

Yes, these commands work for both HTTP and HTTPS endpoints, which are used in your URL ping Tests.

## More Information

* [Standard tests](standard-tests.md)
* [Availability alerts](availability-alerts.md)
* [Troubleshooting](troubleshoot-availability.md)
* [Web tests Azure Resource Manager template](/azure/templates/microsoft.insights/webtests?tabs=json)
* [Web test REST API](/rest/api/application-insights/web-tests)