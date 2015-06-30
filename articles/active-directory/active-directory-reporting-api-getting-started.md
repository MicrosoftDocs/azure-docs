<properties
   pageTitle="Getting started with the Azure AD Reporting API"
   description="How to get started with the Azure Active Directory Reporting API"
   services="active-directory"
   documentationCenter=""
   authors="yossibanai"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="05/22/2015"
   ms.author="yossib"/>


# Getting started with the Azure AD Reporting API

Azure Active Directory provides a variety of activity, security and audit reports. This data can be consumed through the Azure portal, but can also be very useful in a many other applications, such as SIEM systems, audit, and business intelligence tools.

The Azure AD Reporting APIs provide programmatic access to these data through a set of REST-based APIs that can be called from a variety programming languages and tools.

This article will walk you through the process of calling the Azure AD Reporting APIs using PowerShell. You can modify the sample PowerShell script to access data from any of the available reports in JSON, XML or text format, as your scenario requires.

To use this sample, you will need an [Azure Active Directory](active-directory-whatis.md)

## Creating an Azure AD application to access the API

The Reporting API uses [OAuth](https://msdn.microsoft.com/library/azure/dn645545.aspx) to authorize access to the web APIs. To access information from your directory, you must create an application in your Active Directory, and grant it appropriate permissions to access the AAD data.


### Create an application
- Navigate to the [Azure Management Portal](https://manage.windowsazure.com/).
- Navigate into your directory.
- Navigate into applications.
- On the bottom bar, click "Add".
	- Click "Add an application my organization is developing".
	- **Name**: Any name is fine. Something like "Reporting API Application" is recommended.
	- **Type**: Select "Web application and/or Web API".
	- Click the arrow to move to the next page.
	- **Sign-on URL**: ```http://localhost```.
	- **App ID URI**: ```http://localhost```.
	- Click the checkmark to finish adding the application.

### Grant your application permission to use the API
- Navigate to the Applications tab.
- Navigate to your newly created application.
- Click the **Configure** tab.
- In the "Permissions to Other Applications" section:
	- In the microsoft Azure Active Directory > Application Permissions, select **Read directory data**.
- Click **Save** on the bottom bar.


### Get your directory ID, client ID, and client secret

The steps below will walk you through obtaining your application's client ID and client secret.  You will also need to know your tenant name, it can be either your *.onmicrosoft.com or a custom domain name.  Copy these into a separate place; you'll use them to modify the script.

#### Application Client ID
- Navigate to the Applications tab.
- Navigate to your newly created application.
- Navigate to the **Configure** tab.
- Your application's client ID is listed on the **Client ID** field.

#### Application client secret
- Navigate to the Applications tab.
- Navigate to your newly created application.
- Navigate to the Configure tab.
- Generate a new secret key for your application by selecting a duration in the "Keys" section.
- The key will be displayed upon saving. Make sure to copy it and paste it into a safe location, because there is no way to retrieve it later.


## Modify the script
To edit the PowerShell script below to work with your directory, replace $ClientID, $ClientSecret and $tenantdomain with the correct values from “Delegating Access in Azure AD”.

    # This script will require the Web Application and permissions setup in Azure Active Directory
    $ClientID      = <<YOUR CLIENT ID HERE>>                # Should be a ~35 character string insert your info here
    $ClientSecret  = "<<YOUR CLIENT SECRET HERE>>"          # Should be a ~44 character string insert your info here
    $loginURL      = "https://login.windows.net"
    $tenantdomain  = "<<YOUR TENANT NAME HERE>>"            # For example, contoso.onmicrosoft.com

    # Get an Oauth 2 access token based on client id, secret and tenant domain
    $body          = @{grant_type="client_credentials";resource=$resource;client_id=$ClientID;client_secret=$ClientSecret}
    $oauth         = Invoke-RestMethod -Method Post -Uri $loginURL/$tenantdomain/oauth2/token?api-version=1.0 -Body $body

    if ($oauth.access_token -ne $null) {
        $headerParams  = @{'Authorization'="$($oauth.token_type) $($oauth.access_token)"}

        # Returns a list of all the available reports
        Write-host List of available reports
        Write-host =========================
        $allReports = (Invoke-WebRequest -Headers $headerParams -Uri "https://graph.windows.net/$tenantdomain/reports?api-version=beta")
        Write-host $allReports.Content

        Write-host
        Write-host Data from the AccountProvisioningEvents report
        Write-host ====================================================
        Write-host
        # Returns a JSON document for the "accountProvisioningEvents" report
        $myReport = (Invoke-WebRequest -Headers $headerParams -Uri "https://graph.windows.net/$tenantdomain/reports/accountProvisioningEvents?api-version=beta")
        Write-host $myReport.Content

        Write-host
        Write-host Data from the AuditEvents report with datetime filter
        Write-host ====================================================
        Write-host
        # Returns a JSON document for the "auditEvents" report
        $myReport = (Invoke-WebRequest -Headers $headerParams -Uri "https://graph.windows.net/$tenantdomain/reports/auditEvents?api-version=beta&$filter=eventTime gt 2015-05-20")
        Write-host $myReport.Content

        # Options for other output formats

        # to output the JSON use following line
        $myReport.Content | Out-File -FilePath accountProvisioningEvents.json -Force

        # to output the content to a name value list
        ($myReport.Content | ConvertFrom-Json).value | Out-File -FilePath accountProvisioningEvents.txt -Force

        # to output the content in XML use the following line
        (($myReport.Content | ConvertFrom-Json).value | ConvertTo-Xml).InnerXml | Out-File -FilePath accountProvisioningEvents.xml -Force

    } else {
        Write-Host "ERROR: No Access Token"
        }


## Execute the script
Once you finish editing the script, run it and verify that the expected data from the is returned.

The script returns lists all the available reports, and returns output from the AccountProvisioningEvents report in the PowerShell window in JSON format. It also creates files with the same output in JSON, text and XML. You can comment experiment with modifying the script to return data from other reports, and comment out the output formats that you do not need.


## Next Steps
- Curious about what security, audit, and activity reports are available? Check out [Azure AD Security, Audit, and Activity Reports](active-directory-view-access-usage-reports.md)
- See [Azure AD Audit Report Events](active-directory-reporting-audit-events.md) for more details on the Audit Report
- See [Azure AD Reports and Events (Preview)](https://msdn.microsoft.com/library/azure/mt126081.aspx) for more details on the Graph API REST service
 