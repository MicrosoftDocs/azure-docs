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
ms.date: 05/14/2017
ms.author: bwren

---
# OMS tutorial - Collect data in Log Analytics with an Azure Automation runbook
You can collect a significant amount of data in Log Analytics from the different [data sources](log-analytics-data-sources.md) collected from agents and also [data collected from Azure](log-analytics-azure-storage.md).  There are a scenarios though where you need to collect data that isn't accessible through these standard sources.

In these cases, you can use the [HTTP Data Collector API]() to write data to Log Analytics from any REST API client.  A common method to perform this data collection is using a runbook in Azure Automation.  The runbook collects data from some source which can be any service or application accessible from a runbook.  It then uses the Data Collector API to write this data to Log Analaytics using a data type custom to your solution.  

This article explains scenario and walks through writing and scheduling a sample runbook.

## Technologies used in scenario

- Log Analytics
- HTTP Data Collector API
- Azure Automation 

## Prerequisites
This scenario requires the following resources configured in your Azure subscription.  

- [Log Analytics workspace](log-analytics-get-started.md).  Can be a free account.
- [Azure automation account](automation-offering-get-started.md).  Can be a free account.


## Overview
Runbooks in Azure Automation are implemented with PowerShell, so we'll start by writing and testing our script in the Azure Automation editor.  Once we verify that we're collecting the required information, we'll write that data to Log Analytics and verify our custom data type.  Finally, we'll create a schedule to start the runbook at regular intervals.

## Process

### 1. Install Data Collector API module
Every [request from the HTTP Data Collector API](log-analytics-data-collector-api.md#create-a-request) must be formatted appropriately and include an authorization header.  You can do this in your runbook, but you can make it simpler and reduce the amount of code required by using a module that provides these functions.  One module that you can use is [OMSIngestionAPI module](https://www.powershellgallery.com/packages/OMSIngestionAPI) in the PowerShell Gallery.

To use a [module](automation-integration-modules.md) in a runbook, it must be installed in your Automation account.  Any runbook in the same account can then use the functions in the module.  You can install a new module by selecting **Assets** > **Modules** > **Add a module** in your Automation account.  

The PowerShell Gallery though gives us a quick option to deploy a module directly to our automation account so we can use that option for our example.
Since we're installing a module from the PowerShell Gallery for our example, you can just click on the **Deploy to Azure Automation** button on the modules page which will launch the Azure portal to install the module.

1. Go to [PowerShell Gallery]().
2. Search for OMSIngestionAPI
3. click on the **Deploy to Azure Automation** button.

![IngestionAPI module screenshot]()

### 3. Create runbook
Azure Automation has an editor in the portal, so we can go ahead and create and edit our runbook there.  Alternatively, you could use another editor such as PowerShell ISE or VS Code, but you would need to copy and paste your script into a runbook later anyway.

1. Navigate to your Automation account.  
2. Click **Runbooks** > **+ Add a runbook** > **Create a new runbook**.
3. For the runbook name, type **collect-stock-quotes**.  For the runbook type, select **PowerShell**.
4. Click **Create** to create the runbook and start the editor.

### 4.  Collect data
The first step in creating your runbook is to determine how you are going to retrieve the required information.  The service that you're accessing may have cmdlets that you can use, or it may be accessible from an API that you can call from PowerShell.

You also need to determine how you will provide authentication if the application or service requires it.  You can use [variable assets]() in Azure Automation to store information such as username and password.  Variables can be encrypted to safely store sensitive information.  

You can also store logon credentials in [credential assets]() which have multiple properties related to a particular connection type.  You're limited to a particular set of connection types though unless you create your own [integration module]().

For our example, we're going to retrieve the information we need with a call to a rest api that doesn't require authentication.

1. Type the following code into your runbook.  This will format an uri for the quote service, call the service, and then return the results.  We're keeping things simple at this point by doing no error checking and hardcoding the stock symbols we want to collect.

	```
	$symbols = "MSFT,GOOG,AAPL"
	$fields = "sl1d1t1c1ohgvp"
	$uri = "http://finance.yahoo.com/d/quotes.csv?s=" + ($symbols -join '+') + "&f=$fields&e=.csv"
	$response = Invoke-RestMethod -Uri $uri
	$response
	```

2. Click **Test pane** to open the runbook in the test pane.
3. Click **Start** to start the runbook.  The runbook will start with a status of **Queued** before it goes to **Running**.  

When the runbook completes, it will display any output from the script.  It should produce output similar to the following.  This verifies that our call works, but it doesn't put our data in the format we need.

![CSV output]()

### 4. Convert data
In order to write data to the Data Collector API, we need it in [Json format](log-analytics-data-collector-api.md#request-body).  The simplest method to do this in PowerShell is the ConvertTo-Json cmdlet.  This cmdlet expects  

but we need to do some conversion first.  If we convert the response, it's going to identify all fields as string values, but we need the numeric fields stored as integers.

The method that we'll use is to first convert the comma delimited response to PSCustomObject using ConvertFrom-CSV.  This cmdlet allows us to provide a header parameter that names each field.  We can then use that collection to create a PSCustomObject for each quote which allows us to specify the datatype for each field.  We can also combine the date and time fields to create a single field that we'll use to set the date and time of the record.

1. Remove the `response` line from the end of the script.
2. Add the following code to the end of the runbook.  This converts the comma delimited output to a PSCustomObject.

	```
	$header = "Symbol","LastTrade","LastTradeDate","LastTradeTime","Change","Open","DayHigh","DayLow","Volume","PreviousClose"
	$quotes = ConvertFrom-Csv -InputObject $response -Header $header
	$quotes
	```
3. Open the test pane and start the runbook again.  Verify that the output is similar to the following.

![]()

4. Remove the $quotes line from the end of the script.
5. Add the following code to the end of the runbook.  This creates a new PSCustomObject with the correct datatypes.

	```
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
        $data += $d 
    }

    $body = ConvertTo-Json  $data 
    $body
	```
3. Open the test pane and start the runbook again.  Verify that the output is similar to the following.  This is the output that we will send to the Data Collector API.

![]()

### 5. Test the data collector
Now that we have the bodt of the response, we can can call the Data Collector API to create a test record.  In addition to the body of the request, we're going to need to provide a name for the record type and the workspace Id and key.  We'll hardcode these values into the script for now.  In a later step, we'll provide these values with a variable.

2. Add the following lines to the top of the script.  Replace the $customerId value with the Workspace ID for the workspace and the $sharedKey value with the primary or secondary key for the workspace.
	```
	$logType = "StockQuote"
	$customerId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
	$sharedKey  = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
	```
3. Replace the `$body` line at the end of the script with the following.  This submits the output to Log Analytics creating a record for each stock quote.  The **TimeStampField** parameter is used to replace the default date time for the record with the specified field in the output data.  We have the **LastTradeDateTime** that we created specifically for this purpose.
	```
	Send-OMSAPIIngestionFile -customerId $customerId -sharedKey $sharedKey -body $body -logType $logType -TimeStampField LastTradeDateTime 
	```
4. 

### 6. Create Automation variables
We have a working script, but we also have some hardcoded values in the script that we should change to make this script more flexible.  We have two options.

- [Parameters](..\automation\automation-runbook-input-parameters.md) are defined in the script.  A value for each needs to be provided every time the script is run.  When you attach a runbook to a schedule, you provide values for each of these parameters.  Parameters are your best option when you have a value that may change different times that you start the runbook.
- [Automation variables](..\automation\automation-variables.md) hold values that can be used by all runbooks in your Automation account.  Automation variables are your best option when you have a value that is typically the same every time you start the runbook or that needs to be shared between different runbooks.

Every request from the HTTP Data Collector API requires the ID and key of the OMS workspace.  Sending this information to the runbook through a parameter is probably not ideal since you would have to provide the same values any time a runbook writing to the workspace was started.  Variable assets are ideal to store this information.  

1. In your Automation account, click **Assets** > **Variables** > **Add a variable**.
2. For the **Name** type in **workspace-id".
3. For the **Type**, select **String**.
4. For **Value**, paste in the workspace ID of the workspace where you will be storing the data.
5. For **Encrypted**, select **No**.
6. Click **Create** to create the variable.
7. Repeat the same process for the workspace key.  Name the variable **workspace-key**, and select **Yes** for **Encrypted**.
8. Change the following code in the runbook to retrieve these values from their Automation variable.

```
$customerId = Get-AutomationVariable -Name 'workspace-id'
$sharedKey  = Get-AutomationVariable -Name 'workspace-key'
```

Our sample has a variable called $symbols that stores the stocks symbols we're going to collect.  We'll use a parameter for this value so that we can potentially create two schedules to collect different symbols at different intervals.

1. 

#### a. Collect workspace ID and keys
There are basically two ways to provide information to a runbook.  First is through [parameters]() where you provide a values every time the script is run.  The other is through [variable assets]() which allow you to store a value that can be used by multiple runbooks in the same Automation account](). 



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
