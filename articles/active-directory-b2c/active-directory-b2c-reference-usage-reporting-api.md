---
title: 'Azure Active Directory B2C: Usage Reporting API Samples and Definitions | Microsoft Docs'
description: Guide and sample on how to get reports on B2C Tenant users, authentications, and MFA.
services: active-directory-b2c
documentationcenter: dev-center-name
author: rojasja
manager: mbaldwin


ms.service: active-directory-b2c
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/08/2017
ms.author: joroja

---
# Accessing usage reports in Azure AD B2C via the reporting API

Azure Active Directory B2C, provides login and MFA-based authentication for all the end users of your family of applications across Identity Providers.  Knowing the number of users registered in the tenant, the providers they used to register, and the number of authentications by type, answers questions like:
* How many users from each type of Identity Provider (for example, Microsoft Account, LinkedIn) have registered in the last 10 days?
* How many Multi-Factor-Authentications have completed successfully in the last month?
* How many login-based authentications were completed this month? Per day? Per application?
* How can I approximate the expected monthly cost of my B2C Tenant activity?

This article focuses on reports most closely tied to billing activity, which is based on number of users, number of billable login-based authentications and number of multi-factor authentications.


## Prerequisites to access the Azure AD reporting API
Before you get started, you need to complete the [Prerequisites to access the Azure AD reporting APIs](https://azure.microsoft.com/documentation/articles/active-directory-reporting-api-getting-started/).  Create an application, obtain a secret for it, and grant it access rights to your Azure AD B2C tenant’s reports. *Bash script* and *Python script* examples are also provided here.

## PowerShell script
This script demonstrates the four usage reports using the **TimeStamp** parameter and the **-ApplicationId** filter.

```powershell
# This script will require the Web Application and permissions setup in Azure Active Directory

# Constants
$ClientID      = "your-client-application-id-here"  
$ClientSecret  = "your-client-application-secret-here"
$loginURL      = "https://login.windows.net"
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
**tenantUserCount** – Count of the number of users in the tenant by type of Identity Provider per day in the last 30 days. (optionally, a TimeStamp filter provides User Counts from a specified date to the current date). Report provides:
 * TotalUserCount = Count of all user objects
 * OtherUserCount = # of AAD Directory users (non-B2C users)
 * LocalUserCount = # of B2C user accounts created with credentials local to the B2C Tenant

**AlternateIdUserCount** = # of B2C users registered with external Identity providers (for example, facebook, Microsoft Account, other AAD tenants - aka OrgId)

**b2cAuthenticationCountSummary** – Sum the daily count of billable authentications over the last 30 days by day and by type of authentication flow

**b2cAuthenticationCount** -Count the Number of authentications within a time period. Default is last 30 days.  (optional: beginning and ending TimeStamp (s) define a specific period of counts desired) Output includes a StartTimeStamp (earliest date of activity for this tenant) and EndTimeStamp (latest update)

**b2cMfaRequestCountSummary** - Sum the daily count of Multi-Factor Authentications by day and by type of MFA (SMS or Voice)


## Limitations
* User count data is refreshed every 24 to 48 hours.  Authentications are updated several times a day.
* When using the ApplicationId filter, an empty report response may be due to one of following conditions:
 * The Application Id does not exist in the tenant. Make sure it is correct.
 * The Application Id exists, but no data was found in the reporting period. Review your date time parameters.


## Next steps
### Estimating your Azure AD monthly bill.
When combined with [the most current Azure AD B2C pricing available](https://azure.microsoft.com/pricing/details/active-directory-b2c/), you can estimate daily, weekly, and monthly Azure consumption.  An estimate is especially useful as you plan changes in tenant behavior which may impact overall cost.  Actual costs can be reviewed under your [linked Azure Subscription.](active-directory-b2c-how-to-enable-billing.md)

### Options for other output formats
```powershell
# to output to JSON use following line in the PowerShell sample
$myReport.Content | Out-File -FilePath b2cUserJourneySummaryEvents.json -Force

# to output the content to a name value list
($myReport.Content | ConvertFrom-Json).value | Out-File -FilePath name-your-file.txt -Force

# to output the content in XML use the following line
(($myReport.Content | ConvertFrom-Json).value | ConvertTo-Xml).InnerXml | Out-File -FilePath name-your-file.xml -Force
```
