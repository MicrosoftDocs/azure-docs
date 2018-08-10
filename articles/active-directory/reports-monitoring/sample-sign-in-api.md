---
title: Azure Active Directory sign-in activity report API samples | Microsoft Docs
description: How to get started with the Azure Active Directory Reporting API
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: c41c1489-726b-4d3f-81d6-83beb932df9c
ms.service: active-directory
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 05/31/2018
ms.author: priyamo
ms.reviewer: dhanyahk 

---
# Azure Active Directory sign-in activity report API samples
This article is part of a collection of articles about the Azure Active Directory reporting API.  
Azure AD reporting provides you with an API that enables you to access sign-in activity data using code or related tools.  
The scope of this Article is to provide you with sample code for the **sign-in activity API**.

See:

* [Audit logs](overview-reports.md#activity-reports)  for more conceptual information
* [Getting started with the Azure Active Directory Reporting API](concept-reporting-api.md) for more information about the reporting API.


## Prerequisites
Before you can use the samples in this article, you need to complete the [prerequisites to access the Azure AD reporting API](howto-configure-prerequisites-for-reporting-api.md).  

## PowerShell script

```powershell

# This script will require the Web Application and permissions setup in Azure Active Directory
$clientID       = "<appid>"             # ApplicationId
$clientSecret   = "<key>"         # Should be a ~44 character string insert your info here
$loginURL       = "https://login.windows.net/"
$tenantdomain   = "<domain>"            # For example, contoso.onmicrosoft.com
$msgraphEndpoint = "https://graph.microsoft.com"
$countOfSignInDocsToBeSavedInAFile = 2000
	
# Get an Oauth 2 access token based on client id, secret and tenant domain
$body       = @{grant_type="client_credentials";resource=$msgraphEndpoint;client_id=$clientID;client_secret=$clientSecret}
$oauth      = Invoke-RestMethod -Method Post -Uri $loginURL/$tenantdomain/oauth2/token?api-version=1.0 -Body $body
	
if ($oauth.access_token -ne $null) {
    $headerParams = @{'Authorization'="$($oauth.token_type) $($oauth.access_token)"}
	
    $url = "$msgraphEndpoint/beta/auditLogs/signIns"
    Write-Output "Fetching data using Uri: $url"
	$i=0
	$docCount=0
	Do{
		$myReport = (Invoke-WebRequest -UseBasicParsing -Headers $headerParams -Uri $url)
		$jsonReport = ($myReport.Content | ConvertFrom-Json).value
		$fetchedRecordCount = $jsonReport.Count
		$docCount = $docCount + $fetchedRecordCount
		$totalFetchedRecordCount = $totalFetchedRecordCount + $fetchedRecordCount
		Write-Output "Fetched $fetchedRecordCount records and saved into SignIns$i.json"
		if($docCount -le $countOfSignInDocsToBeSavedInAFile)
		{
			$myReport.Content | Out-File -FilePath SignIns$i.json -append  -Force 		
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




## Executing the script
Once you finish editing the script, run it and verify that the expected data from the sign-in logs report is returned.

The script returns output from the sign-in report in JSON format. It also creates an `SignIns.json` file with the same output. You can experiment by modifying the script to return data from other reports, and comment out the output formats that you do not need.

## Next Steps
* Would you like to customize the samples in this article? Check out the [Azure Active Directory sign-in activity API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/signin). 
* If you want to see a complete overview of using the Azure Active Directory reporting API, see [Getting started with the Azure Active Directory reporting API](concept-reporting-api.md).
* If you would like to find out more about Azure Active Directory reporting, see the [Azure Active Directory Reporting Guide](overview-reports.md).  

