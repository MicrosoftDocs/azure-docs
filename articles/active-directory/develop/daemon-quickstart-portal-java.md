---
title: "Quickstart: Call Microsoft Graph from a Java daemon"
description: In this quickstart, you learn how a Java app can get an access token and call an API protected by Microsoft identity platform endpoint, using the app's own identity
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 08/22/2022
ROBOTS: NOINDEX
ms.author: owenrichards
ms.custom: aaddev, "scenarios:getting-started", "languages:Java", devx-track-java, mode-api
#Customer intent: As an application developer, I want to learn how my Java app can get an access token and call an API that's protected by Microsoft identity platform endpoint using client credentials flow.
---

# Quickstart: Acquire a token and call Microsoft Graph API from a Java console app using app's identity

> [!div renderon="docs"]
> Welcome! This probably isn't the page you were expecting. While we work on a fix, this link should take you to the right article:
>
> > [Quickstart: Java daemon that calls a protected API](console-app-quickstart.md?pivots=devlang-java)
> 
> We apologize for the inconvenience and appreciate your patience while we work to get this resolved.

> [!div renderon="portal" id="display-on-portal" class="sxs-lookup"]
> # Quickstart: Acquire a token and call Microsoft Graph API from a Java console app using app's identity
>
> In this quickstart, you download and run a code sample that demonstrates how a Java application can get an access token using the app's identity to call the Microsoft Graph API and display a [list of users](/graph/api/user-list) in the directory. The code sample demonstrates how an unattended job or Windows service can run with an application identity, instead of a user's identity.
> 
> ## Prerequisites
> 
> To run this sample, you need:
> 
> - [Java Development Kit (JDK)](https://openjdk.java.net/) 8 or greater
> - [Maven](https://maven.apache.org/)
> 
> > [!div class="sxs-lookup"]
> ### Download and configure the quickstart app
> 
> #### Step 1: Configure the application in Azure portal
> For the code sample for this quickstart to work, you need to create a client secret, and add Graph API's **User.Read.All** application permission.
> 
> <button id="makechanges" class="nextstepaction configure-app-button"> Make these changes for me </button>
>
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-netcore-daemon/green-check.png) Your application is configured with these attributes.
> 
> #### Step 2: Download the Java project
> 
> > [!div class="nextstepaction"]
> > <button id="downloadsample" class="download-sample-button">Download the code sample</button>
>
> > [!div class="sxs-lookup"]
> > > [!NOTE]
> > > `Enter_the_Supported_Account_Info_Here`
> 
> #### Step 3: Admin consent
> 
> If you try to run the application at this point, you'll receive *HTTP 403 - Forbidden* error: `Insufficient privileges to complete the operation`. This error happens because any *app-only permission* requires Admin consent: a global administrator of your directory must give consent to your application. Select one of the options below depending on your role:
> 
> ##### Global tenant administrator
> 
> If you are a global administrator, go to **API Permissions** page select **Grant admin consent for Enter_the_Tenant_Name_Here**.
> > [!div id="apipermissionspage"]
> > [Go to the API Permissions page]()
> 
> ##### Standard user
> 
> If you're a standard user of your tenant, then you need to ask a global administrator to grant admin consent for your application. To do this, give the following URL to your administrator:
> 
> ```url
> https://login.microsoftonline.com/Enter_the_Tenant_Id_Here/adminconsent?client_id=Enter_the_Application_Id_Here
> ```
> #### Step 4: Run the application
> 
> You can test the sample directly by running the main method of ClientCredentialGrant.java from your IDE.
> 
> From your shell or command line:
> 
> ```
> $ mvn clean compile assembly:single
> ```
> 
> This will generate a msal-client-credential-secret-1.0.0.jar file in your /targets directory. Run this using your Java executable like below:
> 
> ```
> $ java -jar msal-client-credential-secret-1.0.0.jar
> ```
> 
> After running, the application should display the list of users in the configured tenant.
> 
> > [!IMPORTANT]
> > This quickstart application uses a client secret to identify itself as confidential client. Because the client secret is added as a plain-text to your project files, for security reasons, it is recommended that you use a certificate instead of a client secret before considering the application as production application. For more information on how to use a certificate, see [these instructions](https://github.com/Azure-Samples/ms-identity-java-daemon/tree/master/msal-client-credential-certificate) in the same GitHub repository for this sample, but in the second folder **msal-client-credential-certificate**.
> 
> ## More information
> 
> ### MSAL Java
> 
> [MSAL Java](https://github.com/AzureAD/microsoft-authentication-library-for-java) is the library used to sign in users and request tokens used to access an API protected by Microsoft identity platform. As described, this quickstart requests tokens by using the application own identity instead of delegated permissions. The authentication flow used in this case is known as *[client credentials oauth flow](v2-oauth2-client-creds-grant-flow.md)*. For more information on how to use MSAL Java with daemon apps, see [this article](scenario-daemon-overview.md).
> 
> Add MSAL4J to your application by using Maven or Gradle to manage your dependencies by making the following changes to the application's pom.xml (Maven) or build.gradle (Gradle) file.
> 
> In pom.xml:
> 
> ```xml
> <dependency>
>     <groupId>com.microsoft.azure</groupId>
>     <artifactId>msal4j</artifactId>
>     <version>1.0.0</version>
> </dependency>
> ```
> 
> In build.gradle:
> 
> ```$xslt
> compile group: 'com.microsoft.azure', name: 'msal4j', version: '1.0.0'
> ```
> 
> ### MSAL initialization
> 
> Add a reference to MSAL for Java by adding the following code to the top of the file where you will be using MSAL4J:
> 
> ```Java
> import com.microsoft.aad.msal4j.*;
> ```
> 
> Then, initialize MSAL using the following code:
> 
> ```Java
> IClientCredential credential = ClientCredentialFactory.createFromSecret(CLIENT_SECRET);
> 
> ConfidentialClientApplication cca =
>         ConfidentialClientApplication
>                 .builder(CLIENT_ID, credential)
>                 .authority(AUTHORITY)
>                 .build();
> ```
> 
> > | Where: |Description |
> > |---------|---------|
> > | `CLIENT_SECRET` | Is the client secret created for the application in Azure portal. |
> > | `CLIENT_ID` | Is the **Application (client) ID** for the application registered in the Azure portal. You can find this value in the app's **Overview** page in the Azure portal. |
> > | `AUTHORITY`    | The STS endpoint for user to authenticate. Usually `https://login.microsoftonline.com/{tenant}` for public cloud, where {tenant} is the name of your tenant or your tenant Id.|
> 
> ### Requesting tokens
> 
> To request a token using app's identity, use `acquireToken` method:
> 
> ```Java
> IAuthenticationResult result;
>      try {
>          SilentParameters silentParameters =
>                  SilentParameters
>                          .builder(SCOPE)
>                          .build();
> 
>          // try to acquire token silently. This call will fail since the token cache does not
>          // have a token for the application you are requesting an access token for
>          result = cca.acquireTokenSilently(silentParameters).join();
>      } catch (Exception ex) {
>          if (ex.getCause() instanceof MsalException) {
> 
>              ClientCredentialParameters parameters =
>                      ClientCredentialParameters
>                              .builder(SCOPE)
>                              .build();
> 
>              // Try to acquire a token. If successful, you should see
>              // the token information printed out to console
>              result = cca.acquireToken(parameters).join();
>          } else {
>              // Handle other exceptions accordingly
>              throw ex;
>          }
>      }
>      return result;
> ```
> 
> > |Where:| Description |
> > |---------|---------|
> > | `SCOPE` | Contains the scopes requested. For confidential clients, this should use the format similar to `{Application ID URI}/.default` to indicate that the scopes being requested are the ones statically defined in the app object set in the Azure portal (for Microsoft Graph, `{Application ID URI}` points to `https://graph.microsoft.com`). For custom web APIs, `{Application ID URI}` is defined under the **Expose an API** section in **App registrations** in the Azure portal.|
> 
> [!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]
> 
> ## Next steps
> 
> To learn more about daemon applications, see the scenario landing page.
> 
> > [!div class="nextstepaction"]
> > [Daemon application that calls web APIs](scenario-daemon-overview.md)
