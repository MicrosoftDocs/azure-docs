---
title: Usage reporting API samples and definitions in Azure Active Directory B2C | Microsoft Docs
description: Guide and samples on getting reports on Azure AD B2C tenant users, authentications, and multi-factor authentications.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.date: 08/04/2017
ms.author: marsma
ms.subservice: B2C
---

# Accessing usage reports in Azure AD B2C via the reporting API

Azure Active Directory B2C (Azure AD B2C) provides authentication based on user sign-in and Azure Multi-Factor Authentication. Authentication is provided for end users of your application family across identity providers. When you know the number of users registered in the tenant, the providers they used to register, and the number of authentications by type, you can answer questions like:
* How many users from each type of identity provider (for example, a Microsoft or LinkedIn account) have registered in the last 10 days?
* How many authentications using Multi-Factor Authentication have completed successfully in the last month?
* How many sign-in-based authentications were completed this month? Per day? Per application?
* How can I estimate the expected monthly cost of my Azure AD B2C tenant activity?

This article focuses on reports tied to billing activity, which is based on the number of users, billable sign-in-based authentications, and multi-factor authentications.


## Prerequisites
Before you get started, you need to complete the steps in [Prerequisites to access the Azure AD reporting APIs](https://azure.microsoft.com/documentation/articles/active-directory-reporting-api-getting-started/). Create an application, obtain a secret for it, and grant it access rights to your Azure AD B2C tenant’s reports. *Bash script* and *Python script* examples are also provided here. 

## PowerShell script
This script demonstrates the creation of four usage reports by using the `TimeStamp` parameter and the `ApplicationId` filter.

```powershell
# This script will require the Web Application and permissions setup in Azure Active Directory

# Constants
$ClientID      = "your-client-application-id-here"  
$ClientSecret  = "your-client-application-secret-here"
$loginURL      = "https://login.microsoftonline.com"
$tenantdomain  = "your-b2c-tenant-domain.onmicrosoft.com"  
# Get an Oauth 2 access token based on client id, secret and tenant domain
$body          = @{grant_type="client_credentials";resource=$resource;client_id=$ClientID;client_secret=$ClientSecret}
$oauth         = Invoke-RestMethod -Method Post -Uri $loginURL/$tenantdomain/oauth2/token?api-version=1.0 -Body $body
if ($oauth.access_token -ne $null) {
    $headerParams  = @{'Authorization'="$($oauth.token_type) $($oauth.access_token)"}

    Write-host Data from the tenantUserCount report
    Write-host ====================================================
	 # Returns a JSON document for the report
    $myReport = (Invoke-WebRequest -Headers $headerParams -Uri "https://graph.windows.net/$tenantdomain/reports/tenantUserCount?api-version=beta")
    Write-host $myReport.Content

    Write-host Data from the tenantUserCount report with datetime filter
    Write-host ====================================================
    $myReport = (Invoke-WebRequest -Headers $headerParams -Uri "https://graph.windows.net/$tenantdomain/reports/tenantUserCount?%24filter=TimeStamp+gt+2016-10-15&api-version=beta")
    Write-host $myReport.Content

    Write-host Data from the b2cAuthenticationCountSummary report
    Write-host ====================================================
    $myReport = (Invoke-WebRequest -Headers $headerParams -Uri "https://graph.windows.net/$tenantdomain/reports/b2cAuthenticationCountSummary?api-version=beta")
    Write-host $myReport.Content

	Write-host Data from the b2cAuthenticationCount report with datetime filter
    Write-host ====================================================
    $myReport = (Invoke-WebRequest -Headers $headerParams -Uri "https://graph.windows.net/$tenantdomain/reports/b2cAuthenticationCount?%24filter=TimeStamp+gt+2016-09-20+and+TimeStamp+lt+2016-10-03&api-version=beta")
    Write-host $myReport.Content

	Write-host Data from the b2cAuthenticationCount report with ApplicationId filter
    Write-host ====================================================
    # Returns a JSON document for the " " report
        $myReport = (Invoke-WebRequest -Headers $headerParams -Uri "https://graph.windows.net/$tenantdomain/reports/b2cAuthenticationCount?%24filter=ApplicationId+eq+ada78934-a6da-4e69-b816-10de0d79db1d&api-version=beta")
    Write-host $myReport.Content

	Write-host Data from the b2cMfaRequestCountSummary
    Write-host ====================================================
    $myReport = (Invoke-WebRequest -Headers $headerParams -Uri "https://graph.windows.net/$tenantdomain/reports/b2cMfaRequestCountSummary?api-version=beta")
    Write-host $myReport.Content

    Write-host Data from the b2cMfaRequestCount report with datetime filter
    Write-host ====================================================
    $myReport = (Invoke-WebRequest -Headers $headerParams -Uri "https://graph.windows.net/$tenantdomain/reports/b2cMfaRequestCount?%24filter=TimeStamp+gt+2016-09-10+and+TimeStamp+lt+2016-10-04&api-version=beta")
    Write-host $myReport.Content

	Write-host Data from the b2cMfaRequestCount report with ApplicationId filter
    Write-host ====================================================
   	$myReport = (Invoke-WebRequest -Headers $headerParams -Uri "https://graph.windows.net/$tenantdomain/reports/b2cMfaRequestCountSummary?%24filter=ApplicationId+eq+ada78934-a6da-4e69-b816-10de0d79db1d&api-version=beta")
	 Write-host $myReport.Content

} else {
    Write-Host "ERROR: No Access Token"
    }
```


## Usage report definitions
* **tenantUserCount**: The number of users in the tenant by type of identity provider, per day in the last 30 days. (Optionally, a `TimeStamp` filter provides user counts from a specified date to the current date). The report provides:
  * **TotalUserCount**: The number of all user objects.
  * **OtherUserCount**: The number of Azure Active Directory users (not Azure AD B2C users).
  * **LocalUserCount**: The number of Azure AD B2C user accounts created with credentials local to the Azure AD B2C tenant.

* **AlternateIdUserCount**: The number of Azure AD B2C users registered with external identity providers (for example, Facebook, a Microsoft account, or another Azure Active Directory tenant, also referred to as an `OrgId`).

* **b2cAuthenticationCountSummary**: Summary of the daily number of billable authentications over the last 30 days, by day and type of authentication flow.

* **b2cAuthenticationCount**: The number of authentications within a time period. The default is the last 30 days.  (Optional: The beginning and ending `TimeStamp` parameters define a specific time period.) The output includes `StartTimeStamp` (earliest date of activity for this tenant) and `EndTimeStamp` (latest update).

* **b2cMfaRequestCountSummary**: Summary of the daily number of multi-factor authentications, by day and type (SMS or voice).


## Limitations
User count data is refreshed every 24 to 48 hours. Authentications are updated several times a day. When using the `ApplicationId` filter, an empty report response can be due to one of following conditions:
  * The application ID does not exist in the tenant. Make sure it is correct.
  * The application ID exists, but no data was found in the reporting period. Review your date/time parameters.


## Next steps
### Monthly bill estimates for Azure AD
When combined with [the most current Azure AD B2C pricing available](https://azure.microsoft.com/pricing/details/active-directory-b2c/), you can estimate daily, weekly, and monthly Azure consumption.  An estimate is especially useful when you plan for changes in tenant behavior that might impact overall cost. You can review actual costs in your [linked Azure subscription](active-directory-b2c-how-to-enable-billing.md).

### Options for other output formats
The following code shows examples of sending output to JSON, a name value list, and XML:
```powershell
# to output to JSON use following line in the PowerShell sample
$myReport.Content | Out-File -FilePath name-your-file.json -Force

# to output the content to a name value list
($myReport.Content | ConvertFrom-Json).value | Out-File -FilePath name-your-file.txt -Force

# to output the content in XML use the following line
(($myReport.Content | ConvertFrom-Json).value | ConvertTo-Xml).InnerXml | Out-File -FilePath name-your-file.xml -Force
```
