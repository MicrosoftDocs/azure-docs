---
title: PowerShell Cmdlets
description: A cmdlet for querying is available as part of Azure PowerShell
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# PowerShell Cmdlets

A cmdlet for querying is available as part of [Azure PowerShell](/powershell/azure/overview?view=azurermps-5.4.0&preserve-view=true). You can follow the instructions for installing them [here](/powershell/azure/install-azurerm-ps?view=azurermps-5.4.0&preserve-view=true). Before attempting to run the query cmdlet, you should login to Azure PowerShell using `Login-AzureRmAccount` or `Add-AzureRmAccount`. See the [Azure PowerShell documentation](/powershell/module/azurerm.operationalinsights/Invoke-AzureRmOperationalInsightsQuery?view=azurermps-5.4.0&preserve-view=true) on this cmdlet for more information.

## Github

Azure PowerShell is developed in a [public Github repo](https://github.com/Azure/azure-powershell). Within the repo, our cmdlet may be found [here](https://github.com/Azure/azure-powershell/blob/preview/src/ResourceManager/OperationalInsights/Commands.OperationalInsights/Query/InvokeOperationalInsightsQuery.cs). If you find an issue, feel free to file an [issue](https://github.com/Azure/azure-powershell/issues)\!

## Basics

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

## Parameters

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

## Examples

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
