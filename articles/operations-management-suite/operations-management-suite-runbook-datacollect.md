---
title: Collecting Log Analytics data with a runbook | Microsoft Docs
description: 
services: log-analytics
documentationcenter: ''
author: bwren
manager: jwhit
editor: ''

ms.assetid: a831fd90-3f55-423b-8b20-ccbaaac2ca75
ms.service: operations-management-suite
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/30/2017
ms.author: bwren

---
# Collect data in Log Analytics with an Azure Automation runbook
The [HTTP Data Collector API]() can be used to collect custom data in Log Analytics.  A common method to perform this data collection is using a runbook in Azure Automation.  The runbook collects data from some source which can be any service accessible from a runbook.  This could be a resource in Azure, in another cloud, or available on the public Internet.  

## Technologies in scenario

- Log Analytics
- HTTP Data Collector API
- Azure Automation 

## Prerequisites
- Log Analytics workspace
- Azure automation account

## Scenario description
Runbooks in Azure Automation are written in PowerShell or PowerShell Workflow.  We'll use PowerShell for this example.



## Process

### 1. Install Data Collector API module
Every request from the HTTP Data Collector API must be formatted appropriately and include an authorization header.  You can make this simpler and reduce the amount of code required by using a module that provides these functions.  One module that you can use is [OMSIngestionAPI module](https://www.powershellgallery.com/packages/OMSIngestionAPI) in the PowerShell Gallery.

To use a module in a runbook, it must be installed in your Automation account.  Any runbook in the same account can then use the functions in the module.

You can install a new module by selecting **Assets** > **Modules** > **Add a module** in your Automation account.  If you're installing a module from the PowerShell Gallery, you can just click on the **Deploy to Azure Automation** button which will launch the Azure portal to install the module.

![IngestionAPI module screenshot]()

### 2. Determine how to collect data
Runbooks are PowerShell scripts or workflows so you need to be able to connect to the application or service that you're monitoring and collect the data you need with PowerShell.  You can typically figure this out working from a local PowerShell command line or script before moving that code into a runbook.

You also need to determine how you will provide authentication if the application or service requires it.  You can use [variable assets]() in Azure Automation to store information such as username and password.  Variables can be encrypted to safely store sensitive information.  

You can also store logon credentials in [credential assets]() which have multiple properties related to a particular connection type.  You're limited to a particular set of connection types though unless you create your own [integration module]().

If you're connecting 

### 3. Write Script
#### a. Collect workspace ID and keys
There are basically two ways to provide information to a runbook.  First is through [parameters]() where you provide a values every time the script is run.  The other is through [variable assets]() which allow you to store a value that can be used by multiple runbooks in the same Automation account](). 

Every request from the HTTP Data Collector API requires the ID and key of the OMS workspace.  Sending this information to the runbook through a parameter is probably not ideal since you would have to provide the same values any time a runbook writing to the workspace was started.  Variable assets are ideal to store this information.  

The following image shows a string variable for the workspace ID and an encrypted string variable for the key.

![Automation variables]()

The runbook retrieves these values using the following code. The script variables can then be used with calls to the Data Collector API.

	$workspaceId = Get-AutomationVariable -Name 'WorkspaceID'
	$workspaceKey  = Get-AutomationVariable -Name 'WorkspaceKey'

#### b. Collect data
The bulk of your runbook will be collecting the information from the external service or application that you're monitoring.  It will use PowerShell code to connect to the service or application in order to collect the data it requires.  l


#### c. Convert to json
#### d. Submit

### 4. Test
Azure Automation provides a test environment that you can use to test your script before publishing it.  The script still runs, and data will be written to the Log Analytics repository.  


### 5. Schedule













#### b. Collect data



#### c. Convert data to json 
Data submitted to Log Analytics with the Data Collector API must be formatted in Json which may not be its format when you collect it.

The cmdlet ```ConvertTo-Json``` is typically useful to perform this conversion.

#### d. Submit to Log Analytics 
You submit data to Log Analytics 

## Log Analytics cmdlets
Using the Data Collector API does not require any Log Analytics cmdlets.   


## Example
Following is an example script that uses this method to collect stock quotes 

	$VerbosePreference = "Continue"
	
	$customerId = Get-AutomationVariable -Name 'Stocks-WorkspaceID'
	$sharedKey  = Get-AutomationVariable -Name 'Stocks-WorkspaceKey'
	
	$logType = "StockQuote"
	$fields = "sl1d1t1c1ohgvp"
	$symbols = Get-AutomationVariable -Name 'Stocks-SymbolList'
	Write-Verbose "Symbols: $symbols"
	
	$uri = "http://finance.yahoo.com/d/quotes.csv?s=" + ($symbols -join '+') + "&f=$fields&e=.csv"
	
	try {
	    $response = Invoke-RestMethod -Uri $uri
	}
	Catch
	{
	    $ErrorMessage = $_.Exception.Message
		Write-Error "Error retrieving quotes: $ErrorMessage"
	    Exit
	}
	
	$header = "Symbol","LastTrade","LastTradeDate","LastTradeTime","Change","Open","DayHigh","DayLow","Volume","PreviousClose"
	
	try {
	    $quotes = ConvertFrom-Csv -InputObject $response -Header $header
	}
	Catch
	{
	    Write-Error $Error[0].Exception.Message
	    Exit
	}
	
	
	$data = @()
	foreach ($quote in $quotes)
	{
	    $d = New-Object PSObject -Property @{
	        Symbol = [string]$quote.Symbol
	        LastTrade = [Single]$quote.LastTrade
	        Change = [Single]$quote.Change
	        Open = [Single]$quote.Open
	        DayHigh = [Single]$quote.DayHigh
	        DayLow = [Single]$quote.DayLow
	        Volume = [Single]$quote.Volume
	        PreviousClose = [Single]$quote.PreviousClose
	        LastTradeDate = [String]$quote.LastTradeDate
	        LastTradeTime = [String]$quote.LastTradeTime
	        LastTradeDateTime = ((Get-Date -Date ($quote.LastTradeDate + ' ' + $quote.LastTradeTime)).AddHours(5)).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
	    }
	
	    Write-Verbose "Quote: $d"
	    $data += $d 
	
	}
	
	
	$body = ConvertTo-Json  $data 
	Write-Verbose "Body: $body"
	
	try {
	    Send-OMSAPIIngestionFile -customerId $customerId -sharedKey $sharedKey -body $body -logType $logType -TimeStampField LastTradeDateTime 
	}
	Catch
	{
	    $ErrorMessage = $_.Exception.Message
		Write-Error "Error submitting data: $ErrorMessage"
	    Exit
	}


## Resource Manager template
If you want to install this sample in your own OMS environment, you can use the 


## Next steps
- Use the [Log Search API](log-analytics-log-search-api.md) to retrieve data from the Log Analytics repository.






You pass information into runbooks either through [parameters]() or [variable assets]().  You provide values from parameters when you start the runbook, while variables allow you to store the information in one place to be used by multiple runbooks.

The runbook will at least require the ID and key of the Log Analytics workspace that you're writing data to.  You may require other values specific to the data that you're collecting.  
