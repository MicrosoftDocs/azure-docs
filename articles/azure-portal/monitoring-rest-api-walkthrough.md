<properties
	pageTitle="Azure Monitoring REST API Walkthrough"
	description="How to authenticate requests to and use the Azure Monitoring REST API."
	authors="mcollier, rboucher"
	manager=""
	editor=""
	services="monitoring-and-diagnostics"
	documentationCenter="monitoring-and-diagnostics"/>

<tags
	ms.service="monitoring-and-diagnostics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/22/2016"
	ms.author="mcollier"/>

# Azure Monitoring REST API Walkthrough
This article shows you how to perform authentication so your code can use the [Microsoft Azure Insights REST API Reference](https://msdn.microsoft.com/library/azure/dn931943.aspx).         

The Azure Insights API makes it possible to programmatically retrieve the available default metric definitions (the type of metric such as CPU Time, Requests, etc.), granularity, and metric values. Once retrieved, the data can be saved in a separate data store such as Azure SQL Database, DocumentDB, or Azure Data Lake. From there additional analysis can be performed as needed.

>[AZURE.NOTE] The Azure Insights API is NOT the same as [Application Insights](https://azure.microsoft.com/services/application-insights/).

Besides working with various metric data points, the Insights API makes it possible to execute various options list alert rules, view activity logs, and much more. For a full list of available operations, see the [Microsoft Azure Insights REST API Reference](https://msdn.microsoft.com/library/azure/dn931943.aspx).

## Authenticating Azure Insights Requests

The first step is to authenticate the request.

All the tasks executed against the Azure Insights API use the Azure Resource Manager authentication model. Therefore, all requests must be authenticated with Azure Active Directory (Azure AD). One approach to authenticate the client application is to create an Azure AD service principal and retrieve the authentication (JWT) token. The following sample script demonstrates creating an Azure AD service principal via PowerShell. For a more detailed walk-through, refer to the documentation on [using Azure PowerShell to create a service principal to access resources](../resource-group-authenticate-service-principal.md#authenticate-service-principal-with-password—powershell). It is also possible to [create a service principle via the Azure portal](../resource-group-create-service-principal-portal.md).

```PowerShell
$subscriptionId = "{azure-subscription-id}"
$resourceGroupName = "{resource-group-name}"
$location = "centralus"

# Authenticate to a specific Azure subscription.
Login-AzureRmAccount -SubscriptionId $subscriptionId

# Password for the service principal
$pwd = "{service-principal-password}"

# Create a new Azure AD application
$azureAdApplication = New-AzureRmADApplication `
                        -DisplayName "My Azure Insights" `
                        -HomePage "https://localhost/azure-insights" `
                        -IdentifierUris "https://localhost/azure-insights" `
                        -Password $pwd

# Create a new service principal associated with the designated application
New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

# Assign Reader role to the newly created service principal
New-AzureRmRoleAssignment -RoleDefinitionName Reader `
                          -ServicePrincipalName $azureAdApplication.ApplicationId.Guid

```

To query the Azure Insights API, the client application should use the previously created service principal to authenticate. The following example PowerShell script shows one approach, using the Active Directory Authentication Library (ADAL) to help get the JWT authentication token. The JWT token is passed as part of an HTTP Authorization parameter in requests to the Azure Insights API.

```PowerShell
$azureAdApplication = Get-AzureRmADApplication -IdentifierUri "https://localhost/azure-insights"

$subscription = Get-AzureRmSubscription -SubscriptionId $subscriptionId

$clientId = $azureAdApplication.ApplicationId.Guid
$tenantId = $subscription.TenantId
$authUrl = "https://login.windows.net/${tenantId}"

$AuthContext = [Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext]$authUrl
$cred = New-Object -TypeName Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential -ArgumentList ($clientId, $pwd)
 
$result = $AuthContext.AcquireToken("https://management.core.windows.net/", $cred)

# Build an array of HTTP header values 
$authHeader = @{
'Content-Type'='application/json'
'Accept'='application/json'
'Authorization'=$result.CreateAuthorizationHeader()
}
``` 

Once the authentication setup step is complete, queries can then be executed against the Azure Insights REST API. There are two helpful queries:
1. List the metric definitions for a resource
2. Retrieve the metric values

## Retrieve Metric Definitions

```PowerShell
$request = "https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/${resourceProviderNamespace}/${resourceType}/${resourceName}/metricDefinitions?api-version=2014-04-01"
Invoke-RestMethod -Uri $request `
                  -Headers $authHeader `
                  -Method Get `
                  -Verbose
```
For an Azure Web App, the metric definitions would appear similar to the following screenshot.

![Alt "JSON view of metric definition response."](./media/monitoring-rest-api-walkthrough/available_metric_definitions_json_response.png)


For more information, see the [List the metric definitions for a resource in Azure Insights REST API](https://msdn.microsoft.com/library/azure/dn931939.aspx) documentation. 

## Retrieve Metric Values
Once the available metric definitions are known, it is then possible to retrieve the related metric values. Use the metric’s name ‘value’ (not the ‘localizedValue’) for any filtering requests (for example, retrieve the ‘CpuTime’ and ‘Requests’ metric data points). 

>[AZURE.NOTE] The request / response information for this API call does not appear as an available task at [https://msdn.microsoft.com/library/azure/dn931930.aspx](https://msdn.microsoft.com/library/azure/dn931930.aspx). However, it is possible to do so, and the request URI is similar to that of listing the metric definitions.

**Method**: GET

**Request URI**: https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider-namespace}/{resource-type}/{resource-name}/metrics?api-version=2014-04-01&$filter={filter}

For example, to retrieve the Average Response Time data points for the period from September 14, 2016 to September 15, 2016 with a granularity of one hour (all times should be indicated as UTC), the request URI would be as follows:

```PowerShell
$filter = "(name.value eq 'AverageResponseTime') and timeGrain eq duration'PT1H' and startTime eq 2016-09-14T00:00:00.0000000Z and endTime eq 2016-09-15T00:00:00.0000000Z"
$request = "https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/${resourceProviderNamespace}/${resourceType}/${resourceName}/metrics?api-version=2014-04-01&`$filter=${filter}"
Invoke-RestMethod -Uri $request `
                  -Headers $authHeader `
                  -Method Get `
                  -Verbose
```

The result would appear similar to the example following screenshot.

![Alt "JSON response showing Average Response Time metric value"](./media/monitoring-rest-api-walkthrough/avg_response_time_metric_json_response.png)

To retrieve multiple data points, add the metric definition names to the filter, as seen in the following example:

```PowerShell
$filter = "(name.value eq 'AverageResponseTime' or name.value eq 'Requests') and timeGrain eq duration'PT1M' and startTime eq 2016-09-09T10:00:00.0000000Z and endTime eq 2016-09-09T16:00:00.0000000Z"
$request = "https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/${resourceProviderNamespace}/${resourceType}/${resourceName}/metrics?api-version=2014-04-01&`$filter=${filter}"
Invoke-RestMethod -Uri $request `
                  -Headers $authHeader `
                  -Method Get `
                  -Verbose
```

## Retrieve Activity Log Data
In addition to working with metric definitions and related values, it is also possible to retrieve additional interesting insights related to Azure resources. As an example, it is possible to programmatically retrieve [Azure management event data (activity or audit logs)](https://msdn.microsoft.com/library/azure/dn931927.aspx).

```PowerShell
$resourceProviderNamespace = "microsoft.insights"
$resourceType = "eventtypes"
$filter = "eventTimestamp ge '2016-09-09T00:00:00Z' and eventTimestamp le '2016-09-12T00:00:00Z'"
$request = "https://management.azure.com/subscriptions/${subscriptionId}/providers/${resourceProviderNamespace}/${resourceType}/management/values?api-version=2014-04-01&`$filter=${filter}"
(Invoke-RestMethod -Uri $request `
                   -Headers $authHeader `
                   -Method Get `
                   -Verbose).Value | ConvertTo-Json
```

Using the REST API can really help to understand the available metric definitions, granularity, and related values. That information is very helpful when using the [Azure Insights Management Library](https://msdn.microsoft.com/library/azure/mt417623.aspx).

## Retrieving Metrics via the Insights Management Library

Just like working with the REST API, the first step in working with the management library is to authenticate. This can be done by using the ADAL to retrieve the JWT token from Azure AD. Assuming the Azure AD service principal is already configured, retrieving the token can be as simple as the code shown in the following sample.

```csharp
private static string GetAccessToken()
{
    var authenticationContext = new AuthenticationContext(string.Format("https://login.windows.net/{0}", _tenantId));
    var credential = new ClientCredential(_applicationId, _applicationPwd);
    var result = authenticationContext.AcquireToken("https://management.core.windows.net/", credential);
    if (result == null)
    {
        throw new InvalidOperationException("Failed to obtain the JWT token");
    }
    string token = result.AccessToken;
    return token;
}
```

The primary class for working with the Insights API is the [InsightsClient](https://msdn.microsoft.com/library/azure/microsoft.azure.insights.insightsclient.aspx). This class exposes functionality to retrieve the available metric definitions and metric values, as seen in the sample code below.

```csharp
private static MetricListResponse GetResourceMetrics(TokenCloudCredentials credentials, string resourceUri, string filter, TimeSpan period, string duration)
{
    var dateTimeFormat = "yyy-MM-ddTHH:mmZ";

    string start = DateTime.UtcNow.Subtract(period).ToString(dateTimeFormat);
    string end = DateTime.UtcNow.ToString(dateTimeFormat);

    StringBuilder sb = new StringBuilder(filter);
    if (!string.IsNullOrEmpty(filter))
    {
        sb.Append(" and ");
    }
    sb.AppendFormat("startTime eq {0} and endTime eq {1}", start, end);
    sb.AppendFormat(" and timeGrain eq duration'{0}'", duration);

    using (var client = new InsightsClient(credentials))
    {
        return client.MetricOperations.GetMetrics(resourceUri, sb.ToString());
    }
}

private static MetricDefinitionListResponse GetAvailableMetricDefinitions(TokenCloudCredentials credentials, string resourceUri)
{
    using (var client = new InsightsClient(credentials))
    {
        return client.MetricDefinitionOperations.GetMetricDefinitions(resourceUri, null);
    }
}
```

For the preceding code, the resource URI to use is the full path to the desired Azure resource. For example, to query against an Azure Web App, the resource URI would be:

*/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{site-name}/*

>[AZURE.NOTE] To find the resource URI for a desired resource, one helpful approach is to use the [Azure Resource Explorer](https://resources.azure.com) tool. Navigate to the desired resource and then look at the URI shown, as in the following screenshot.

![Alt "Azure Resource Explorer"](./media/monitoring-rest-api-walkthrough/azure_resource_explorer.png)


## Next steps
* Review the [Overview of Monitoring](../monitoring-overview.md)
* Review the [Microsoft Azure Insights REST API Reference](https://msdn.microsoft.com/library/azure/dn931943.aspx)
