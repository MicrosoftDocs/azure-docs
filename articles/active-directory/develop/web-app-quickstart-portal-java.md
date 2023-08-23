---
title: "Quickstart: Add sign-in with Microsoft to a Java web app"
description: In this quickstart, you'll learn how to add sign-in with Microsoft to a Java web application by using OpenID Connect.
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 08/16/2022
ROBOTS: NOINDEX
ms.author: dmwendia
ms.custom: aaddev, "scenarios:getting-started", "languages:Java", devx-track-java, mode-api, devx-track-extended-java
---
# Quickstart: Add sign-in with Microsoft to a Java web app

> [!div renderon="docs"]
> Welcome! This probably isn't the page you were expecting. While we work on a fix, this link should take you to the right article:
>
> > [Quickstart: Add sign-in with Microsoft to a Java web app](quickstart-web-app-java-sign-in.md)
> 
> We apologize for the inconvenience and appreciate your patience while we work to get this resolved.

> [!div renderon="portal" id="display-on-portal" class="sxs-lookup"]
> # Quickstart: Add sign-in with Microsoft to a Java web app
>
> In this quickstart, you download and run a code sample that demonstrates how a Java web application can sign in users and call the Microsoft Graph API. Users from any Azure Active Directory (Azure AD) organization can sign in to the application.
> 
>  For an overview, see the [diagram of how the sample works](#how-the-sample-works).
> 
> ## Prerequisites
> 
> To run this sample, you need:
> 
> - [Java Development Kit (JDK)](https://openjdk.java.net/) 8 or later.
> - [Maven](https://maven.apache.org/).
> 
> 
> #### Step 1: Configure your application in the Azure portal
> 
> To use the code sample in this quickstart:
> 
> 1. Add reply URLs `https://localhost:8443/msal4jsample/secure/aad` and `https://localhost:8443/msal4jsample/graph/me`.
> 1. Create a client secret.
> 
> <button id="makechanges" class="nextstepaction configure-app-button"> Make these changes for me </button>
> 
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-aspnet-webapp/green-check.png) Your application is configured with these attributes.
> 
> #### Step 2: Download the code sample
> 
> Download the project and extract the .zip file into a folder near the root of your drive. For example, *C:\Azure-Samples*.
> 
> To use HTTPS with localhost, provide the `server.ssl.key` properties. To generate a self-signed certificate, use the keytool utility (included in JRE).
> 
> Here's an example:
> ```
>   keytool -genkeypair -alias testCert -keyalg RSA -storetype PKCS12 -keystore keystore.p12 -storepass password
> 
>   server.ssl.key-store-type=PKCS12
>   server.ssl.key-store=classpath:keystore.p12
>   server.ssl.key-store-password=password
>   server.ssl.key-alias=testCert
>   ```
>   Put the generated keystore file in the *resources* folder.
> 
> > [!div class="nextstepaction"]
> > <button id="downloadsample" class="download-sample-button">Download the code sample</button>
> 
> > [!div class="sxs-lookup"]
> > > [!NOTE]
> > > `Enter_the_Supported_Account_Info_Here`
> 
> > [!div class="sxs-lookup"]
> 
> #### Step 3: Run the code sample
> 
> To run the project, take one of these steps:
> 
> - Run it directly from your IDE by using the embedded Spring Boot server.
> - Package it to a WAR file by using [Maven](https://maven.apache.org/plugins/maven-war-plugin/usage.html), and then deploy it to a J2EE container solution like [Apache Tomcat](http://tomcat.apache.org/).
> 
> ##### Running the project from an IDE
> 
> To run the web application from an IDE, select run, and then go to the home page of the project. For this sample, the standard home page URL is https://localhost:8443.
> 
> 1. On the front page, select the **Login** button to redirect users to Azure Active Directory and prompt them for credentials.
> 
> 1. After users are authenticated, they're redirected to `https://localhost:8443/msal4jsample/secure/aad`. They're now signed in, and the page will show information about the user account. The sample UI has these buttons:
>     - **Sign Out**: Signs the current user out of the application and redirects that user to the home page.
>     - **Show User Info**: Acquires a token for Microsoft Graph and calls Microsoft Graph with a request that contains the token, which returns basic information about the signed-in user.
> 
> ##### Running the project from Tomcat
> 
> If you want to deploy the web sample to Tomcat, make a couple changes to the source code.
> 
> 1. Open *ms-identity-java-webapp/src/main/java/com.microsoft.azure.msalwebsample/MsalWebSampleApplication*.
> 
>     - Delete all source code and replace it with this code:
> 
>       ```Java
>        package com.microsoft.azure.msalwebsample;
> 
>        import org.springframework.boot.SpringApplication;
>        import org.springframework.boot.autoconfigure.SpringBootApplication;
>        import org.springframework.boot.builder.SpringApplicationBuilder;
>        import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
> 
>        @SpringBootApplication
>        public class MsalWebSampleApplication extends SpringBootServletInitializer {
> 
>         public static void main(String[] args) {
>          SpringApplication.run(MsalWebSampleApplication.class, args);
>         }
> 
>         @Override
>         protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
>          return builder.sources(MsalWebSampleApplication.class);
>         }
>        }
>       ```
> 
> 2.   Tomcat's default HTTP port is 8080, but you need an HTTPS connection over port 8443. To configure this setting:
>         - Go to *tomcat/conf/server.xml*.
>         - Search for the `<connector>` tag, and replace the existing connector with this connector:
> 
>           ```xml
>           <Connector
>                    protocol="org.apache.coyote.http11.Http11NioProtocol"
>                    port="8443" maxThreads="200"
>                    scheme="https" secure="true" SSLEnabled="true"
>                    keystoreFile="C:/Path/To/Keystore/File/keystore.p12" keystorePass="KeystorePassword"
>                    clientAuth="false" sslProtocol="TLS"/>
>           ```
> 
> 3. Open a Command Prompt window. Go to the root folder of this sample (where the pom.xml file is located), and run `mvn > package` to build the project.
>     - This command will generate a *msal-web-sample-0.1.0.war* file in your */targets* directory.
>     - Rename this file to *msal4jsample.war*.
>     - Deploy the WAR file by using Tomcat or any other J2EE container solution.
>         - To deploy the msal4jsample.war file, copy it to the */webapps/* directory in your Tomcat installation, and then start the Tomcat server.
> 
> 4. After the file is deployed, go to https://localhost:8443/msal4jsample by using a browser.
> 
> > [!IMPORTANT]
> > This quickstart application uses a client secret to identify itself as a confidential client. Because the client secret is added as plain text to your project files, for security reasons we recommend that you use a certificate instead of a client secret before using the application in a production environment. For more information on how to use a certificate, see [Certificate credentials for application authentication](./active-directory-certificate-credentials.md).
> 
> ## More information
> 
> ### How the sample works
> ![Diagram that shows how the sample app generated by this quickstart works.](media/quickstart-v2-java-webapp/java-quickstart.svg)
> 
> ### Get MSAL
> 
> MSAL for Java (MSAL4J) is the Java library used to sign in users and request tokens that are used to access an API that's protected by the Microsoft identity platform.
> 
> Add MSAL4J to your application by using Maven or Gradle to manage your dependencies by making the following changes to the > application's pom.xml (Maven) or build.gradle (Gradle) file.
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
> ### Initialize MSAL
> 
> Add a reference to MSAL for Java by adding the following code at the start of the file where you'll be using MSAL4J:
> 
> ```Java
> import com.microsoft.aad.msal4j.*;
> ```
> 
> [!INCLUDE [Help and support](./includes/error-handling-and-tips/help-support-include.md)]
> 
> ## Next steps
> 
> For a more in-depth discussion of building web apps that sign in users on the Microsoft identity platform, see the multipart scenario series:
> 
> > [!div class="nextstepaction"]
> > [Scenario: Web app that signs in users](scenario-web-app-sign-user-overview.md?tabs=java)
