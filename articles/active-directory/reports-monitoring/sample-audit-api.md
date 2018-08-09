---
title: Azure Active Directory reporting audit API samples | Microsoft Docs
description: How to get started with the Azure Active Directory Reporting API
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: de8b8ec3-49b3-4aa8-93fb-e38f52c99743
ms.service: active-directory
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 05/30/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---
# Azure Active Directory reporting audit API samples
This article is part of a collection of articles about the Azure Active Directory reporting API.  
Azure AD reporting provides you with an API that enables you to access audit data using code or related tools.
The scope of this article is to provide you with sample code for the **audit API**.

See:

* [Audit logs](overview-reports.md#activity-reports) for more conceptual information
* [Getting started with the Azure Active Directory Reporting API](concept-reporting-api.md) for more information about the reporting API.

For questions, issues or feedback, please contact [AAD Reporting Help](mailto:aadreportinghelp@microsoft.com).


## Prerequisites
Before you can use the samples in this article, you need to complete the [prerequisites to access the Azure AD reporting API](howto-configure-prerequisites-for-reporting-api.md).  

## Known issue
App Auth will not work if your tenant is in the EU region. Please use User Auth for accessing the Audit API as a workaround until we fix the issue. 

## PowerShell script


```powershell

# This script will require the Web Application and permissions setup in Azure Active Directory
$clientID       = "<appid>"             # ApplicationId
$clientSecret   = "<key>"         # Should be a ~44 character string insert your info here
$loginURL       = "https://login.windows.net/"
$tenantdomain   = "<domain>"            # For example, contoso.onmicrosoft.com
$msgraphEndpoint = "https://graph.microsoft.com"
$countOfAuditDocsToBeSavedInAFile = 2000
	
# Get an Oauth 2 access token based on client id, secret and tenant domain
$body       = @{grant_type="client_credentials";resource=$msgraphEndpoint;client_id=$clientID;client_secret=$clientSecret}
$oauth      = Invoke-RestMethod -Method Post -Uri $loginURL/$tenantdomain/oauth2/token?api-version=1.0 -Body $body
	
if ($oauth.access_token -ne $null) {
    $headerParams = @{'Authorization'="$($oauth.token_type) $($oauth.access_token)"}
	
    $url = "$msgraphEndpoint/beta/auditLogs/directoryAudits"
    Write-Output "Fetching data using Uri: $url"
	$i=0
	$docCount=0
	Do{
		$myReport = (Invoke-WebRequest -UseBasicParsing -Headers $headerParams -Uri $url)
		$jsonReport = ($myReport.Content | ConvertFrom-Json).value
		$fetchedRecordCount = $jsonReport.Count
		$docCount = $docCount + $fetchedRecordCount
		$totalFetchedRecordCount = $totalFetchedRecordCount + $fetchedRecordCount
		Write-Output "Fetched $fetchedRecordCount records and saved into Audits$i.json"
		if($docCount -le $countOfAuditDocsToBeSavedInAFile)
		{
			$myReport.Content | Out-File -FilePath Audits$i.json -append  -Force 		
		}
		else
		{			
			$docCount=0
			$i = $i+1
		}
			
		#Get url from next link
		$url = ($myReport.Content | ConvertFrom-Json).'@odata.nextLink'			
	}while($url -ne $null)
	Write-Output "Total Fetched record count is : $totalFetchedRecordCount"
				
} else {
    Write-Host "ERROR: No Access Token"
}

```

### Executing the PowerShell script
Once you finish editing the script, run it and verify that the expected data from the Audit logs report is returned.

The script returns output from the audit report in JSON format. It also creates an `Audits.json` file with the same output. You can experiment by modifying the script to return data from other reports, and comment out the output formats that you do not need.





## Next steps
* Would you like to customize the samples in this article? Check out the [Azure Active Directory audit API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/directoryaudit). 
* If you want to see a complete overview of using the Azure Active Directory reporting API, see [Getting started with the Azure Active Directory reporting API](concept-reporting-api.md).
* If you would like to find out more about Azure Active Directory reporting, see the [Azure Active Directory Reporting Guide](overview-reports.md).  

