---
title: Tools
description: In this section, you will find a collection of tools that can help you interact with the API.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/22/2021
ms.topic: article
---
# Tools

There are several tools available to help you interact with the API.
## C\# SDK

Query the Log Analytics Workspace using the  [C\# SDK](https://www.nuget.org/packages/Microsoft.Azure.OperationalInsights/). The SDK supports the full query language.

> [!NOTE]
> Due to the limitations of OpenAPI Specification 2.0, all row values are interpreted as strings. When processing query data, you may need to leverage the column definitions for each column, which indicate the type that can be parsed from each row. You can find the list of data types at <https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/operationalinsights/Microsoft.Azure.OperationalInsights/src>

> You can use the [Microsoft.Rest.ClientRuntime.Azure.Authentication](https://www.nuget.org/packages/Microsoft.Rest.ClientRuntime.Azure.Authentication/) package for easier authentication with AAD instead of your own implementation of ServiceClientCredentials.

### Sample

```
    using System;
    using Microsoft.Azure.OperationalInsights;
    using Microsoft.Rest.Azure.Authentication;
    
    namespace QuerySample
    {
        class Program
        {
            static void Main(string[] args)
            {
                var workspaceId = "<your workspace ID>";
                var clientId = "<your client ID>";
                var clientSecret = "<your client secret>";
    
                var domain = "<your AAD domain>";
                var authEndpoint = "https://login.microsoftonline.com";
                var tokenAudience = "https://api.loganalytics.io/";
    
                var adSettings = new ActiveDirectoryServiceSettings
                {
                    AuthenticationEndpoint = new Uri(authEndpoint),
                    TokenAudience = new Uri(tokenAudience),
                    ValidateAuthority = true
                };
    
                var creds = ApplicationTokenProvider.LoginSilentAsync(domain, clientId, clientSecret, adSettings).GetAwaiter().GetResult();
    
                var client = new OperationalInsightsDataClient(creds);
                client.WorkspaceId = workspaceId;
    
                var results = client.Query("union * | take 5");
    
                Console.WriteLine(results);
    
                // TODO process the results
            }
        }
    }
```

## PowerShell Cmdlets

A cmdlet for querying is available as part of [Azure PowerShell](/powershell/azure/overview?view=azurermps-5.4.0&preserve-view=true). Follow the instructions for installing the cmdlets [here](/powershell/azure/install-azurerm-ps?view=azurermps-5.4.0&preserve-view=true). Login to Azure PowerShell using `Login-AzureRmAccount` or `Add-AzureRmAccount` before running the query cmdlet. See the [Azure PowerShell documentation](/powershell/module/azurerm.operationalinsights/Invoke-AzureRmOperationalInsightsQuery?view=azurermps-5.4.0&preserve-view=true) on this cmdlet for more information.

### Github

Azure PowerShell is developed in a [public Github repo](https://github.com/Azure/azure-powershell). Within the repo, our cmdlet may be found [here](https://github.com/Azure/azure-powershell/blob/preview/src/ResourceManager/OperationalInsights/Commands.OperationalInsights/Query/InvokeOperationalInsightsQuery.cs). If you find an issue, feel free to file an [issue](https://github.com/Azure/azure-powershell/issues)\!

### Basics

```
    C:\ Get-Help Invoke-AzureRmOperationalInsightsQuery -Detailed
    
    NAME
        Invoke-AzureRmOperationalInsightsQuery
        
    SYNOPSIS
        Returns search results based on the specified parameters.
        
        
    SYNTAX
        Invoke-AzureRmOperationalInsightsQuery [-AsJob] [-DefaultProfile <IAzureContextContainer>] [-IncludeRender] 
        [-IncludeStatistics] -Query <String> [-Timespan <TimeSpan>] [-Wait <Int32>] -Workspace <PSWorkspace> 
        [<CommonParameters>]
        
        Invoke-AzureRmOperationalInsightsQuery [-AsJob] [-DefaultProfile <IAzureContextContainer>] [-IncludeRender] 
        [-IncludeStatistics] -Query <String> [-Timespan <TimeSpan>] [-Wait <Int32>] -WorkspaceId <String> 
        [<CommonParameters>]
        
        
    DESCRIPTION
        The Invoke-AzureRmOperationalInsightsQuery cmdlet returns the search results based on the specified parameters.
        
        You can access the status of the search in the Metadata property of the returned object. If the status is Pending, 
        then the search has not completed, and the results will be from the archive.
        
        You can retrieve the results of the search from the Value property of the returned object.
```

### Parameters

``` 
PARAMETERS
    -AsJob [<SwitchParameter>]
        Run cmdlet in the background
        
    -DefaultProfile <IAzureContextContainer>
        The credentials, account, tenant, and subscription used for communication with azure.
        
    -IncludeRender [<SwitchParameter>]
        If specified, rendering information for metric queries will be included in the response.
        
    -IncludeStatistics [<SwitchParameter>]
        If specified, query statistics will be included in the response.
        
    -Query <String>
        The query to execute.
        
    -Timespan <TimeSpan>
        The timespan to bound the query by.
        
    -Wait <Int32>
        Puts an upper bound on the amount of time the server will spend processing the query. See: 
        https://dev.loganalytics.io/documentation/Using-the-API/Timeouts
        
    -Workspace <PSWorkspace>
        The workspace
        
    -WorkspaceId <String>
        The workspace ID.
        
    <CommonParameters>
        This cmdlet supports the common parameters: Verbose, Debug,
        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
        OutBuffer, PipelineVariable, and OutVariable. For more information, see 
        about_CommonParameters (https:/go.microsoft.com/fwlink/?LinkID=113216). 
```

### Examples

``` 
    Example 1: Get search results using a query

    PS C:\> $queryResults = Invoke-AzureRmOperationalInsightsQuery -WorkspaceId "63613592-b6f7-4c3d-a390-22ba13102111" 
    -Query "union * | take 10"
    PS C:\> $queryResults.Results
    ...
```

Once invoked, $queryResults.Results will contain all of the resulting rows from your query.

``` 
    Example 2: Convert $results.Result IEnumberable to an array
  
    PS C:\> $queryResults = Invoke-AzureRmOperationalInsightsQuery -WorkspaceId "63613592-b6f7-4c3d-a390-22ba13102111" 
    -Query "union * | take 10"
    PS C:\> $resultsArray = [System.Linq.Enumerable]::ToArray($results.Results)
    ...
```

Some queries can result in very large data sets being returned. Because of this, the default behavior of the cmdlet is to return an IEnumerable to reduce memory costs. If you'd prefer to have an array of results, you can use the LINQ Enumerable.ToArray() extension method to convert the IEnumerable to an array.

``` 
    Example 3: Get search results using a query over a specific timeframe
    
    PS C:\> $queryResults = Invoke-AzureRmOperationalInsightsQuery -WorkspaceId "63613592-b6f7-4c3d-a390-22ba13102111" 
    -Query "union * | take 10" -Timespan (New-TimeSpan -Hours 24)
    PS C:\> $queryResults.Results
    ... 
```

The results from this query will be limited to the past 24 hours.

``` 
    Example 4: Include render & statistics in query result
    
    PS C:\> $queryResults = Invoke-AzureRmOperationalInsightsQuery -WorkspaceId "63613592-b6f7-4c3d-a390-22ba13102111" 
    -Query "union * | take 10" -IncludeRender -IncludeStatistics
    PS C:\> $queryResults.Results
    ...
    PS C:\> $queryResults.Render
    ...
    PS C:\> $queryResults.Statistics
    ...
```

See [Request options](prefer-options.md)for details on the render and statistics info.

```
    REMARKS
        To see the examples, type: "get-help Invoke-AzureRmOperationalInsightsQuery -examples".
        For more information, type: "get-help Invoke-AzureRmOperationalInsightsQuery -detailed".
        For technical information, type: "get-help Invoke-AzureRmOperationalInsightsQuery -full".
```
