---
title: Microsoft identity platform Java web app quickstart | Azure
description: Learn how to implement Microsoft Sign-In on a Java web app using OpenID Connect
services: active-directory
author: sangonzal
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 10/09/2019
ms.author: sagonzal
ms.custom: aaddev, scenarios:getting-started, languages:Java
---

# Quickstart: Add sign-in with Microsoft to a Java web app

In this quickstart, you'll learn how to integrate a Java web application with the Microsoft identity platform. Your app will sign in a user, get an access token to call the Microsoft Graph API, and make a request to the Microsoft Graph API.

When you've completed this quickstart, your application will accept sign-ins of personal Microsoft accounts (including outlook.com, live.com, and others) and work or school accounts from any company or organization that uses Azure Active Directory. (See [How the sample works](#how-the-sample-works) for an illustration.)

## Prerequisites

To run this sample you will need:

- [Java Development Kit (JDK)](https://openjdk.java.net/) 8 or greater, and [Maven](https://maven.apache.org/).

> [!div renderon="docs"]
> ## Register and download your quickstart app
> You have two options to start your quickstart application: express (Option 1), or manual (Option 2)
>
> ### Option 1: Register and auto configure your app and then download your code sample
>
> 1. Go to the [Azure portal - App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/applicationsListBlade/quickStartType/JavaQuickstartPage/sourceType/docs) quickstart experience.
> 1. Enter a name for your application and select **Register**.
> 1. Follow the instructions in the portal's quickstart experience to download the automatically configured application code.
>
> ### Option 2: Register and manually configure your application and code sample
>
> #### Step 1: Register your application
>
> To register your application and manually add the app's registration information to your application, follow these steps:
>
> 1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
> 1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
>
> 1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
> 1. Select **New registration**.
> 1. When the **Register an application** page appears, enter your application's registration information:
>    - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `java-webapp`.
>    - Select **Register**.
> 1. On the **Overview** page, find the **Application (client) ID** and the **Directory (tenant) ID** values of the application. Copy these values for later.
> 1. Select the **Authentication** from the menu, and then add the following information:
>    - Add the **Web** platform configuration.  Add these `https://localhost:8080/msal4jsample/secure/aad` and `https://localhost:8080/msal4jsample/graph/me` as **Redirect URIs**..
>    - Select **Save**.
> 1. Select the **Certificates & secrets** from the menu and in the **Client secrets** section, click on **New client secret**:
>
>    - Type a key description (for instance app secret).
>    - Select a key duration **In 1 year**.
>    - The key value will display when you select **Add**.
>    - Copy the value of the key for later. This key value will not be displayed again, nor retrievable by any other means, so record it as soon as it is visible from the Azure portal.
>
> [!div class="sxs-lookup" renderon="portal"]
> #### Step 1: Configure your application in the Azure portal
>
> For the code sample for this quickstart to work, you need to:
>
> 1. Add reply URLs as `https://localhost:8080/msal4jsample/secure/aad` and `https://localhost:8080/msal4jsample/graph/me`.
> 1. Create a Client Secret.
> > [!div renderon="portal" id="makechanges" class="nextstepaction"]
> > [Make these changes for me]()
>
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-aspnet-webapp/green-check.png) Your application is configured with these attributes.

#### Step 2: Download the code sample
> [!div renderon="docs"]
> [Download the Code Sample](https://github.com/Azure-Samples/ms-identity-java-webapp/archive/master.zip)

> [!div class="sxs-lookup" renderon="portal"]
> Download the project and extract the zip file to a local folder closer to the root folder - for example, **C:\Azure-Samples**
>
> To use https with localhost, fill in the server.ssl.key properties. To generate a self-signed certificate, use the keytool utility (included in JRE).
>
>  ```
>   Example:
>   keytool -genkeypair -alias testCert -keyalg RSA -storetype PKCS12 -keystore keystore.p12 -storepass password
>
>   server.ssl.key-store-type=PKCS12
>   server.ssl.key-store=classpath:keystore.p12
>   server.ssl.key-store-password=password
>   server.ssl.key-alias=testCert
>   ```
>   Put the generated keystore file in the "resources" folder.

> [!div renderon="portal" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/ms-identity-java-webapp/archive/master.zip)

> [!div class="sxs-lookup" renderon="portal"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`

> [!div renderon="docs"]
> #### Step 3: Configure the code sample
> 1. Extract the zip file to a local folder.
> 1. If you use an integrated development environment, open the sample in your favorite IDE (optional).
> 1. Open the application.properties file, which can be found in src/main/resources/ folder and replace the value of the fields *aad.clientId*, *aad.authority* and *aad.secretKey* with the respective values of **Application Id**, **Tenant Id** and **Client Secret** as the following:
>
>    ```file
>    aad.clientId=Enter_the_Application_Id_here
>    aad.authority=https://login.microsoftonline.com/Enter_the_Tenant_Info_Here/
>    aad.secretKey=Enter_the_Client_Secret_Here
>    aad.redirectUriSignin=https://localhost:8080/msal4jsample/secure/aad
>    aad.redirectUriGraph=https://localhost:8080/msal4jsample/graph/me
>    aad.msGraphEndpointHost="https://graph.microsoft.com/"
>    ```
> Where:
>
> - `Enter_the_Application_Id_here` - is the Application Id for the application you registered.
> - `Enter_the_Client_Secret_Here` - is the **Client Secret** you created in **Certificates & Secrets** for the application you registered.
> - `Enter_the_Tenant_Info_Here` - is the **Directory (tenant) ID** value of the application you registered.
> 1. To use https with localhost, fill in the server.ssl.key properties. To generate a self-signed certificate, use the keytool utility (included in JRE).
>
>  ```
>   Example:
>   keytool -genkeypair -alias testCert -keyalg RSA -storetype PKCS12 -keystore keystore.p12 -storepass password
>
>   server.ssl.key-store-type=PKCS12
>   server.ssl.key-store=classpath:keystore.p12
>   server.ssl.key-store-password=password
>   server.ssl.key-alias=testCert
>   ```
>   Put the generated keystore file in the "resources" folder.


> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Run the code sample
> [!div renderon="docs"]
> #### Step 4: Run the code sample

To run the project, you can either:

Run it directly from your IDE by using the embedded spring boot server or package it to a WAR file using [maven](https://maven.apache.org/plugins/maven-war-plugin/usage.html) and deploy it to a J2EE container solution such as [Apache Tomcat](http://tomcat.apache.org/).

##### Running from IDE

If you are running the web application from an IDE, click on run, then navigate to the home page of the project. For this sample, the standard home page URL is https://localhost:8080.

1. On the front page, select the **Login** button to redirect to Azure Active Directory and prompt the user for their credentials.

1. After the user is authenticated, they are redirected to *https://localhost:8080/msal4jsample/secure/aad*. They are now signed in, and the page will show information about the signed-in account. The sample UI has the following buttons:
    - *Sign Out*: Signs the current user out of the application and redirects them to the home page.
    - *Show User Info*: Acquires a token for Microsoft Graph and calls Microsoft Graph with a request containing the token, which returns basic information about the signed-in user.

##### Running from Tomcat

If you would like to deploy the web sample to Tomcat, you will need to make a couple of changes to the source code.

1. Open ms-identity-java-webapp/pom.xml
    - Under `<name>msal-web-sample</name>` add `<packaging>war</packaging>`
    - Add dependency:

         ```xml
         <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-tomcat</artifactId>
          <scope>provided</scope>
         </dependency>
         ```

2. Open ms-identity-java-webapp/src/main/java/com.microsoft.azure.msalwebsample/MsalWebSampleApplication

    - Delete all source code and replace with the following:

   ```Java
    package com.microsoft.azure.msalwebsample;

    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    import org.springframework.boot.builder.SpringApplicationBuilder;
    import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

    @SpringBootApplication
    public class MsalWebSampleApplication extends SpringBootServletInitializer {

     public static void main(String[] args) {
      SpringApplication.run(MsalWebSampleApplication.class, args);
     }

     @Override
     protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
      return builder.sources(MsalWebSampleApplication.class);
     }
    }
   ```

3. Open a command prompt, go to the root folder of the project, and run `mvn package`
    - This will generate a `msal-web-sample-0.1.0.war` file in your /targets directory.
    - Rename this file to `ROOT.war`
    - Deploy this war file using Tomcat or any other J2EE container solution.
        - To deploy on Tomcat container, copy the .war file to the webapps folder under your Tomcat installation and then start the Tomcat server.

This WAR will automatically be hosted at https://localhost:8080/.

> [!IMPORTANT]
> This quickstart application uses a client secret to identify itself as confidential client. Because the client secret is added as a plain-text to your project files, for security reasons it is recommended that you use a certificate instead of a client secret before considering the application as production application. For more information on how to use a certificate, see [Certificate credentials for application authentication](https://docs.microsoft.com/azure/active-directory/develop/active-directory-certificate-credentials).

## More information

### How the sample works
![Shows how the sample app generated by this quickstart works](media/quickstart-v2-java-webapp/java-quickstart.svg)

### Getting MSAL

MSAL for Java (MSAL4J) is the Java library used to sign in users and request tokens used to access an API protected by the Microsoft identity Platform.

Add MSAL4J to your application by using Maven or Gradle to manage your dependencies by making the following changes to the application's pom.xml (Maven) or build.gradle (Gradle) file.

In pom.xml:

```XML
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>msal4j</artifactId>
    <version>1.0.0</version>
</dependency>
```

In build.gradle:

```$xslt
compile group: 'com.microsoft.azure', name: 'msal4j', version: '1.0.0'
```

### MSAL initialization

Add a reference to MSAL for Java by adding the following code to the top of the file where you will be using MSAL4J:

```Java
import com.microsoft.aad.msal4j.*;
```

## Next Steps

Learn more about permissions and consent:

> [!div class="nextstepaction"]
> [Permissions and Consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent)

To know more about the auth flow for this scenario, see the Oauth 2.0 authorization code flow:

> [!div class="nextstepaction"]
> [Authorization Code Oauth flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow)

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]
