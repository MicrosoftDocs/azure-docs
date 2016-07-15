<properties
   pageTitle="Getting started with the Azure AD Reporting API | Microsoft Azure"
   description="How to get started with the Azure Active Directory Reporting API"
   services="active-directory"
   documentationCenter=""
   authors="dhanyahk"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="06/28/2016"
   ms.author="dhanyahk"/>

# Getting started with the Azure Active Directory Reporting API

*This documentation is part of the [Azure Active Directory Reporting Guide](active-directory-reporting-guide.md).*

Azure Active Directory (AD) provides a variety of activity, security and audit reports. This data can be consumed through the Azure classic portal, but can also be very useful in a many other applications, such as SIEM systems, audit, and business intelligence tools.

The [Azure AD Reporting APIs](https://msdn.microsoft.com/library/azure/ad/graph/howto/azure-ad-reports-and-events-preview) provide programmatic access to these data through a set of REST-based APIs that can be called from a variety programming languages and tools.

This article will walk you through the process of calling the Azure AD Reporting APIs using PowerShell. You can modify the sample PowerShell script to access data from any of the available reports in JSON, XML or text format, as your scenario requires.

To use this sample, you will need an [Azure Active Directory](active-directory-whatis.md) tenant.

## Creating an Azure AD application to access the API

The Reporting API uses [OAuth](https://msdn.microsoft.com/library/azure/dn645545.aspx) to authorize access to the web APIs. To access information from your directory, you must create an application in your Azure AD tenant, and grant it appropriate permissions to access the Azure AD data.


### Register an Azure AD application
In order to complete the Azure AD application registration work, you must sign in to the Azure classic portal with an Azure subscription administrator account that is also a member of the Global Administrator directory role in your Azure AD tenant. This is because you will be registering the Azure AD application with permissions that require registration/consent using an account with Global Administrator privileges. 

> [AZURE.IMPORTANT] Applications running under credentials with "admin" privileges like this can be very powerful, so please be sure to keep the application's ID/secret credentials secure.


1. Navigate to the [Azure classic portal](https://manage.windowsazure.com/).
2. Navigate into your Azure AD tenant, on the **Active Directory** extension along the left pane.
3. Navigate to the **Applications** tab.
4. On the bottom bar, click **Add**.
	- Click "Add an application my organization is developing".
	- **Name**: Any name is fine. Something like "Reporting API Application" is recommended.
	- **Type**: Select "Web application and/or Web API".
	- Click the arrow to move to the next page.
	- **Sign-on URL**: ```https://localhost```.
	- **App ID URI**: ```https://localhost/ReportingApiApp```.
	- Click the check mark to finish adding the application.

### Grant your application permission to use the API
1. Navigate to the **Applications** tab.
2. Navigate to your newly created application.
3. Click the **Configure** tab.
4. In the "Permissions to Other Applications" section:  
	- For the "Windows Azure Active Directory" resource (permissions to the Azure AD Graph API), click the "Application Permissions" drop down list, select **Read directory data**.  

        > [AZURE.IMPORTANT] Be sure to specify the correct permissions here. Apply "Application Permissions" and not "Delegated Permissions", otherwise the application will not get the permission level it needs in order to access the Reporting API and your script will receive a *"Unable to check Directory Read access for appId"* error.  


5. Click **Save** on the bottom bar.

### Get your directory ID, client ID, and client secret

The steps below will walk you through obtaining your application's client ID and client secret.  You will also need to know your tenant name, it can be either your *.onmicrosoft.com or a custom domain name.  Copy these values into a separate place; you'll use them to modify the script later.

#### Get your Azure AD tenant's domain name
1. Navigate into your Azure AD tenant, on the **Active Directory** extension along the left pane.
2. Navigate to the **Domains** tab.
4. Your tenant's "<tenant-name>.onmicrosoft.com" domain name will be shown, along with any custom domain names if they've been configured.

#### Get the application's client ID
1. Navigate to the **Applications** tab.
2. Navigate to your newly created application.
3. Navigate to the **Configure** tab.
4. Your application's client ID is listed on the **Client ID** field.

#### Get the application's client secret
1. Navigate to the **Applications** tab.
2. Navigate to your newly created application.
3. Navigate to the **Configure** tab.
4. Generate a new secret key for your application by selecting a duration in the "Keys" section.
5. The key will be displayed upon saving. Make sure to copy it and paste it into a safe location, because there is no way to retrieve it later.

## Modify the script
Edit one of the scripts below to work with your directory by replacing $ClientID, $ClientSecret and $tenantdomain with the correct values from the sections above.

### PowerShell Script
    # This script will require registration of a Web Application in Azure Active Directory (see https://azure.microsoft.com/documentation/articles/active-directory-reporting-api-getting-started/)

    # Constants
    $ClientID       = "your-client-application-id-here"       # Insert your application's Client ID, a Globally Unique ID (registered by Global Admin)
    $ClientSecret   = "your-client-application-secret-here"   # Insert your application's Client Key/Secret string
    $loginURL       = "https://login.microsoftonline.com"     # AAD Instance; for example https://login.microsoftonline.com
    $tenantdomain   = "your-tenant-domain.onmicrosoft.com"    # AAD Tenant; for example, contoso.onmicrosoft.com
    $resource       = "https://graph.windows.net"             # Azure AD Graph API resource URI
    $7daysago       = "{0:s}" -f (get-date).AddDays(-7) + "Z" # Use 'AddMinutes(-5)' to decrement minutes, for example
    Write-Output "Searching for events starting $7daysago"

    # Create HTTP header, get an OAuth2 access token based on client id, secret and tenant domain
    $body       = @{grant_type="client_credentials";resource=$resource;client_id=$ClientID;client_secret=$ClientSecret}
    $oauth      = Invoke-RestMethod -Method Post -Uri $loginURL/$tenantdomain/oauth2/token?api-version=1.0 -Body $body

    # Parse auditEvents report items, save output to file(s): auditEventsX.json, where X = 0 thru n for number of nextLink pages
    if ($oauth.access_token -ne $null) {   
        $i=0
        $headerParams = @{'Authorization'="$($oauth.token_type) $($oauth.access_token)"}
        $url = 'https://graph.windows.net/' + $tenantdomain + '/reports/auditEvents?api-version=beta&$filter=eventTime gt ' + $7daysago

        # loop through each query page (1 through n)
        Do{
            # display each event on the console window
            Write-Output "Fetching data using Uri: $url"
            $myReport = (Invoke-WebRequest -UseBasicParsing -Headers $headerParams -Uri $url)
            foreach ($event in ($myReport.Content | ConvertFrom-Json).value) {
                Write-Output ($event | ConvertTo-Json)
            }
        
            # save the query page to an output file
            Write-Output "Save the output to a file auditEvents$i.json"
            $myReport.Content | Out-File -FilePath auditEvents$i.json -Force
            $url = ($myReport.Content | ConvertFrom-Json).'@odata.nextLink'
            $i = $i+1
        } while($url -ne $null)
    } else {
        Write-Host "ERROR: No Access Token"
        }

    Write-Host "Press any key to continue ..."
    $x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

### Bash Script

    #!/bin/bash

    # Author: Ken Hoff (kenhoff@microsoft.com)
    # Date: 2015.08.20
    # NOTE: This script requires jq (https://stedolan.github.io/jq/)

    CLIENT_ID="your-application-client-id-here"         # Should be a ~35 character string insert your info here
    CLIENT_SECRET="your-application-client-secret-here" # Should be a ~44 character string insert your info here
    LOGIN_URL="https://login.windows.net"
    TENANT_DOMAIN="your-directory-name-here.onmicrosoft.com"    # For example, contoso.onmicrosoft.com

    TOKEN_INFO=$(curl -s --data-urlencode "grant_type=client_credentials" --data-urlencode "client_id=$CLIENT_ID" --data-urlencode "client_secret=$CLIENT_SECRET" "$LOGIN_URL/$TENANT_DOMAIN/oauth2/token?api-version=1.0")

    TOKEN_TYPE=$(echo $TOKEN_INFO | ./jq-win64.exe -r '.token_type')
    ACCESS_TOKEN=$(echo $TOKEN_INFO | ./jq-win64.exe -r '.access_token')

    # get yesterday's date

    YESTERDAY=$(date --date='1 day ago' +'%Y-%m-%d')

    URL="https://graph.windows.net/$TENANT_DOMAIN/reports/auditEvents?api-version=beta&$filter=eventTime%20gt%20$YESTERDAY"


    REPORT=$(curl -s --header "Authorization: $TOKEN_TYPE $ACCESS_TOKEN" $URL)

    echo $REPORT | ./jq-win64.exe -r '.value' | ./jq-win64.exe -r ".[]"

### Python
	# Author: Michael McLaughlin (michmcla@microsoft.com)
	# Date: January 20, 2016
	# This requires the Python Requests module: http://docs.python-requests.org

	import requests
	import datetime
	import sys

	client_id = 'your-application-client-id-here'
	client_secret = 'your-application-client-secret-here'
	login_url = 'https://login.windows.net/'
	tenant_domain = 'your-directory-name-here.onmicrosoft.com'

	# Get an OAuth access token
	bodyvals = {'client_id': client_id,
	            'client_secret': client_secret,
	            'grant_type': 'client_credentials'}

	request_url = login_url + tenant_domain + '/oauth2/token?api-version=1.0'
	token_response = requests.post(request_url, data=bodyvals)

	access_token = token_response.json().get('access_token')
	token_type = token_response.json().get('token_type')

	if access_token is None or token_type is None:
	    print "ERROR: Couldn't get access token"
	    sys.exit(1)

	# Use the access token to make the API request
	yesterday = datetime.date.strftime(datetime.date.today() - datetime.timedelta(days=1), '%Y-%m-%d')

	header_params = {'Authorization': token_type + ' ' + access_token}
	request_string = 'https://graph.windows.net/' + tenant_domain + '/reports/auditEvents?api-version=beta&$filter=eventTime%20gt%20' + yesterday   
	response = requests.get(request_string, headers = header_params)

	if response.status_code is 200:
	    print response.content
	else:
	    print 'ERROR: API request failed'


## Execute the script
Once you finish editing the script, run it and verify that the expected data from the AuditEvents report is returned.

The script returns output from the auditEvents report in JSON format. It also creates an `auditEvents.json` file with the same output. You can experiment by modifying the script to return data from other reports, and comment out the output formats that you do not need.

## Notes

- There is no limit on the number of events returned by the Azure AD Reporting API (using OData pagination).
- For retention limits on reporting data, check out [Reporting Retention Policies](active-directory-reporting-retention.md).


## Next Steps
- Curious about which security, audit, and activity reports are available? Check out [Azure AD Security, Audit, and Activity Reports](active-directory-view-access-usage-reports.md). You can also see all of the available Azure AD Graph API endpoints by navigating to [https://graph.windows.net/tenant-name/reports/$metadata?api-version=beta](https://graph.windows.net/tenant-name/reports/$metadata?api-version=beta), which are documented in the [Azure AD Reports and Events (Preview)](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-reports-and-events-preview) article.
- See [Azure AD Audit Report Events](active-directory-reporting-audit-events.md) for more details on the Audit Report
- See [Azure AD Reports and Events (Preview)](https://msdn.microsoft.com/library/azure/ad/graph/howto/azure-ad-reports-and-events-preview) for more details on the Azure AD Graph API REST service.
