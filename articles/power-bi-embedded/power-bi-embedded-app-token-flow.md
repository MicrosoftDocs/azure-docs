<properties
   pageTitle="Authenticating and authorizing with Power BI Embedded"
   description="Authenticating and authorizing with Power BI Embedded"
   services="power-bi-embedded"
   documentationCenter=""
   authors="minewiskan"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi"
   ms.date="07/01/2016"
   ms.author="owend"/>

# Authenticating and authorizing with Power BI Embedded

The Power BI Embedded service uses **Keys** and **App Tokens** for authentication and authorization, instead of explicit end-user authentication. In this model, your application manages authentication and authorization for your end-users. When necessary, your app creates and sends the App Tokens that tells our service to render the requested report. This design doesn't require your app to use Azure Active Directory for user authentication and authorization, although you still can.

## Two ways to authenticate

**Key** -  You can use keys for all Power BI Embedded REST API calls. The keys can be found in the **Azure portal** by clicking on **All settings** and then **Access keys**. Always treat your key as if it were a password. These keys have permissions to make any REST API call on a particular workspace collection.

To use a key on a REST call, add the following authorization header:            

    Authorization: AppKey {your key}

**App token** - App tokens are used for all embedding requests. They’re designed to be run client-side, so they're restricted to a single report and it’s best practice to set an expiration time.

App tokens are a JWT (JSON Web Token) that is signed by one of your keys.

Your app token can contain the following claims:

| Claim      | Description        |
|--------------|------------|
| **ver**      | The version of the app token. 1.0.0 is the current version.       |
| **aud**      | The intended recipient of the token. For Power BI Embedded use: “https://analysis.windows.net/powerbi/api”.  |
| **iss**      |  A string indicating the application which issued the token.    |
| **type**     | The type of app token which is being created. Current the only supported type is **embed**.   |
| **wcn**      | Workspace collection name the token is being issued for.  |
| **wid**      | Workspace ID the token is being issued for.  |
| **rid**      | Report ID the token is being issued for.     |
| **username** (optional) |  Used with RLS, this is a string that can help identify the user when applying RLS rules. |
| **roles** (optional)   |   A string containing the roles to select when applying Row Level Security rules. If passing more than one role, they should be passed as a sting array.    |
| **exp** (optional)    |   Indicates the time in which the token will expire. These should be passed in as Unix timestamps.   |
| **nbf** (optional)    |   Indicates the time in which the token starts being valid. These should be passed in as Unix timestamps.   |

A sample app token will look like this:

![](media\power-bi-embedded-app-token-flow\power-bi-embedded-app-token-flow-sample-coded.png)


When decoded, it will look like this:

![](media\power-bi-embedded-app-token-flow\power-bi-embedded-app-token-flow-sample-decoded.png)


## Here's how the flow works

1. Copy the API keys to your application. You can get the keys in **Azure Portal**.

    ![](media\powerbi-embedded-get-started-sample\azure-portal.png)

2. Token asserts a claim and has an expiration time.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-2.png)

3. Token gets signed with an API access keys.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-3.png)

4. User requests to view a report.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-4.png)

5.	Token is validated with an API access keys.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-5.png)

6.	Power BI Embedded sends a report to user.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-6.png)

After **Power BI Embedded** sends a report to the user, the user can view the report in your custom app. For example, if you imported the [Analyzing Sales Data PBIX sample](http://download.microsoft.com/download/1/4/E/14EDED28-6C58-4055-A65C-23B4DA81C4DE/Analyzing_Sales_Data.pbix), the sample web app would look like this:

![](media\powerbi-embedded-get-started-sample\sample-web-app.png)

## See Also
- [Get started with Microsoft Power BI Embedded sample](power-bi-embedded-get-started-sample.md)
- [Common Microsoft Power BI Embedded scenarios](power-bi-embedded-scenarios.md)
- [Get started with Microsoft Power BI Embedded](power-bi-embedded-get-started.md)
