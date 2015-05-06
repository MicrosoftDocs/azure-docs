<properties
   pageTitle="Getting started with the Azure AD Reporting API"
   description="How to get started with the Azure Active Directory Reporting API"
   services="active-directory"
   documentationCenter=""
   authors="yossib"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="05/06/2015"
   ms.author="kenhoff"/>


# Getting started with the Azure AD Reporting API

Azure AD includes a Reporting API that allows you to access your security, activity, and audit reports programmatically. It's a REST-based API, which allows you to query data for use in external reporting or compliance situations.

This article will walk you through the necessary steps in order to make your first authenticated HTTP request to the Azure AD Reporting API. 

You will need:

- An [Azure Active Directory](active-directory-whatis)
- A way to make HTTP GET and POST requests; either:
	- a bash shell with [curl](http://curl.haxx.se/)
	- [Postman](https://www.getpostman.com/)
	- [A PowerShell cmdlet that makes HTTP requests](https://technet.microsoft.com/en-us/library/hh849901.aspx)



## Creating an Azure AD application to access the API

In order to authenticate to the Reporting API, we must use the OAuth flow, which requires us to register an application with Azure AD.



### Create an application
- Navigate to the [Azure Management Portal](https://manage.windowsazure.com/)
- Navigate into your directory
- Navigate into applications
- On the bottom bar, click "Add".
	- Click "Add an application my organization is developing".
	- **Name**: Any name is fine. Something like "Reporting API Application" is recommended.
	- **Type**: Select "Web application and/or Web API"
	- Click the arrow to move to the next page
	- **Sign-on URL**: ```http://localhost```
	- **App ID URI**: ```http://localhost```
	- Click the checkmark to finish adding the application.

### Give your application permission to use the API
- Navigate to the Applications tab.
- Navigate to your newly created application.
- Navigate to the Configure tab.
- In the "Permissions to Other Applications" section:
	- Add Windows Azure Active Directory > Application Permissions > enable "Read directory data"
	- Add Windows Azure Service Managment API > Delegated Permissions > enable "Access Azure Service Management"
- Click "Save" on the bottom bar.


### Get your directory ID, client ID, and client secret

Find your application's client ID, client secret, and your directory ID. Copy these IDs and URLs into a separate place; you'll use them in the next steps.

#### Application Client ID
- Navigate to the Applications tab.
- Navigate to your newly created application.
- Navigate to the Configure tab.
- Your application's client ID is listed on the Client ID field.

#### Application client secret
- Navigate to the Applications tab.
- Navigate to your newly created application.
- Navigate to the Configure tab.
- Generate a new secret key for your application by selecting a duration in the "Keys" section.
- The key will be displayed upon saving. Make sure to copy it, because there is no way to retrieve it later.

#### Directory ID
- While signed into the Azure Management Portal, you can find your directory ID in the URL.
- Example URL: ```https://manage.windowsazure.com/@demo.onmicrosoft.com#Workspaces/ActiveDirectoryExtension/Directory/<<YOUR-AZURE-AD-DIRECTORY-ID>>/apps...```

Copy these IDs and URLs into a separate place; you'll use them in later steps.



## Retrieving an OAuth access token from Azure AD

Next, we need to generate an authorization code, which we will use to retrieve an OAuth access token for our request to the Reporting API.



### Get an authorization code

First, you need an authorization code. You can retrieve this by navigating to a specific URL in your browser, signing in as a global administrator in your directory, and retrieving the authorization code from the URL you were redirected to.

- Substitute this URL with your Azure AD Directory ID and your Application Client ID.
	- ```https://login.windows.net/<<INSERT-YOUR-AZURE-AD-DIRECTORY-ID-HERE>>/oauth2/authorize?client_id=<<INSERT-YOUR-APPLICATION-CLIENT-ID-HERE>>&response_type=code```
- After filling in the fields, open a browser window and navigate to the URL. Your browser will be redirected to a URL which contains your access code; there won't be any page content. This is OK. 

- If prompted, sign in as a global administrator in your directory.
	- If you run into issues, you may need to sign out of the Azure Management Portal or Office Portal and try again.
- Inspect the URL for the redirected page. The URL contains your authorization code.
	- ```http://localhost/?code=<<YOUR-AUTHORIZATION-CODE>>&session_state=<<YOUR-SESSION-STATE>>``` 
- Copy ```YOUR-AUTHORIZATION-CODE``` into a separate place; you'll use it in the next step.



### Get an OAuth access token

Next, you'll retrieve your access token by making an HTTP request to an OAuth endpoint using your authorization token. For this example, we'll use a small unix library called [curl](http://curl.haxx.se/); you can also use [Postman](https://www.getpostman.com/) or a [PowerShell cmdlet that can make HTTP requests](https://technet.microsoft.com/en-us/library/hh849901.aspx).

- First, replace ```YOUR-AZURE-AD-DIRECTORY-ID``` with the directory ID you retrieved in a previous step. Then, replace ```YOUR-CLIENT-ID``` with the client ID you retrieved in the previous step. Then, replace ```YOUR-CLIENT-SECRET``` with the client secret you retrieved in the previous step. Finally, replace ```YOUR-AUTHORIZATION-CODE``` with the authorization code you retrieved in the previous step.

```
curl -X POST https://login.windows.net/<<INSERT-YOUR-AZURE-AD-DIRECTORY-ID-HERE>>/oauth2/token  \
	-F redirect_uri=http://localhost
	-F grant_type=authorization_code 
	-F resource=https://management.core.windows.net/
	-F client_id=<<INSERT-YOUR-CLIENT-ID-HERE>>
	-F code=<<INSERT-YOUR-AUTHORIZATION-CODE-HERE>>
	-F client_secret=<<INSERT-YOUR-CLIENT-SECRET-HERE>>
```

- Run the command or make the request using your method of choice.
- You'll recieve a JSON object which includes your access token.

```
{
  "token_type": "Bearer",
  "expires_in": "3600",
  "expires_on": "1428701563",
  "not_before": "1428697663",
  "resource": "https://management.core.windows.net/",
  "access_token": "<<YOUR-ACCESS-TOKEN>>",
  "refresh_token": "AAABA...WjCAA",
  "scope": "user_impersonation",
  "id_token": "eyJ0e...20ifQ."
}
```

- Copy your access token from the JSON object into a separate location; we'll use it to call the Reporting API.



## Make a request to the Reporting API

- Finally, replace ```YOUR-ACCESS-TOKEN``` with your access token in the curl request below.

```
curl -v https://graph.windows.net/<<INSERT-YOUR-DIRECTORY-ID-HERE>>/reports/$metadata?api-version=beta
  -H "x-ms-version: 2013-08-01"
  -H "Authorization: Bearer <<INSERT-YOUR-ACCESS-TOKEN-HERE>>"
```

- Run the command or make the request using your method of choice.
- You'll recieve an OData object containing the contents of your audit report.

```
{
  "@odata.context":"https://graph.windows.net/<<DIRECTORY-ID>>/reports/?api-version=beta/reports/$metadata#auditEvents",
  "value":[
    {
      "id":"SN2GR1RDS104.GRN001.msoprd.msft.net_4515449","timeStampOffset":"2015-04-13T21:27:55.1777659Z","actor":"thekenhoff_outlook.com#EXT#@kenhoffdemo.onmicrosoft.com","action":"Add service principal","target":"04670e0d84264acb86dac2
ff1a94c9d7","actorDetail":"Other=284c417b-805e-493a-ad8e-328ce8d4b18e; UPN=thekenhoff_outlook.com#EXT#@kenhoffdemo.onmicrosoft.com; PUID=1003BFFD8CD09753","targetDetail":"SPN=04670e0d84264acb86dac2ff1a94c9d7","tenantId":"c9b13f49-3c25-43
c0-a84f-57faf131dc2b"
    }
  ]
}
```

- Congratulations!


## Next Steps
- Curious about what security, audit, and activity reports are available? Check out [Azure AD Security, Audit, and Activity Reports](active-directory-view-access-usage-reports)
- [Azure AD Audit Report Events](active-directory-reporting-audit-events)
- For more information on the OAuth flow with Azure AD using curl: [Microsoft Azure REST API + OAuth 2.0](https://ahmetalpbalkan.com/blog/azure-rest-api-with-oauth2/) (external link)
