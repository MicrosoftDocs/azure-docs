---
title: Azure Active Directory sign-in activity report API samples | Microsoft Docs
description: How to get started with the Azure Active Directory Reporting API
services: active-directory
documentationcenter: ''
author: dhanyahk
manager: femila
editor: ''

ms.assetid: c41c1489-726b-4d3f-81d6-83beb932df9c
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/16/2017
ms.author: dhanyahk;markvi

---
# Azure Active Directory sign-in activity report API samples
This topic is part of a collection of topics about the Azure Active Directory reporting API.  
Azure AD reporting provides you with an API that enables you to access sign-in activity data using code or related tools.  
The scope of this topic is to provide you with sample code for the **sign-in activity API**.

See:

* [Audit logs](active-directory-reporting-azure-portal.md#audit-logs)  for more conceptual information
* [Getting started with the Azure Active Directory Reporting API](active-directory-reporting-api-getting-started.md) for more information about the reporting API.

For questions, issues or feedback, please contact [AAD Reporting Help](mailto:aadreportinghelp@microsoft.com).

## Prerequisites
Before you can use the samples in this topic, you need to complete the [prerequisites to access the Azure AD reporting API](active-directory-reporting-api-prerequisites.md).  

## PowerShell script
    # This script will require the Web Application and permissions setup in Azure Active Directory
    $ClientID       = "<clientId>"             # Should be a ~35 character string insert your info here
    $ClientSecret   = "<clientSecret>"         # Should be a ~44 character string insert your info here
    $loginURL       = "https://login.windows.net/"
    $tenantdomain   = "<tenantDomain>"
    $ daterange            # For example, contoso.onmicrosoft.com

    $7daysago = "{0:s}" -f (get-date).AddDays(-7) + "Z"
    # or, AddMinutes(-5)

    Write-Output $7daysago

    # Get an Oauth 2 access token based on client id, secret and tenant domain
    $body       = @{grant_type="client_credentials";resource=$resource;client_id=$ClientID;client_secret=$ClientSecret}

    $oauth      = Invoke-RestMethod -Method Post -Uri $loginURL/$tenantdomain/oauth2/token?api-version=1.0 -Body $body

    if ($oauth.access_token -ne $null) {
    $headerParams = @{'Authorization'="$($oauth.token_type) $($oauth.access_token)"}

    $url = "https://graph.windows.net/$tenantdomain/activities/signinEvents?api-version=beta&`$filter=signinDateTime ge $7daysago"

    $i=0

    Do{
        Write-Output "Fetching data using Uri: $url"
        $myReport = (Invoke-WebRequest -UseBasicParsing -Headers $headerParams -Uri $url)
        Write-Output "Save the output to a file SigninActivities$i.json"
        Write-Output "---------------------------------------------"
        $myReport.Content | Out-File -FilePath SigninActivities$i.json -Force
        $url = ($myReport.Content | ConvertFrom-Json).'@odata.nextLink'
        $i = $i+1
    } while($url -ne $null)

    } else {

        Write-Host "ERROR: No Access Token"
    }




## Executing the script
Once you finish editing the script, run it and verify that the expected data from the Audit logs report is returned.

The script returns output from the sign-in report in JSON format. It also creates an `SigninActivities.json` file with the same output. You can experiment by modifying the script to return data from other reports, and comment out the output formats that you do not need.

## Next Steps
* Would you like to customize the samples in this topic? Check out the [Azure Active Directory sign-in activity API reference](active-directory-reporting-api-sign-in-activity-reference.md). 
* If you want to see a complete overview of using the Azure Active Directory reporting API, see [Getting started with the Azure Active Directory reporting API](active-directory-reporting-api-getting-started.md).
* If you would like to find out more about Azure Active Directory reporting, see the [Azure Active Directory Reporting Guide](active-directory-reporting-guide.md).  

