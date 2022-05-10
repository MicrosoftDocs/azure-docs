---
title: include file
description: include file
services: azure-communication-services
author: gistefan
manager: soricos
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 10/08/2021
ms.topic: include
ms.custom: include file
ms.author: gistefan
---

## Set up prerequisites

- [Java Development Kit (JDK)](/azure/developer/java/fundamentals/java-jdk-install) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Set up

### Create a new Java application

Open your terminal or command window. Navigate to the directory where you'd like to create your Java application. Run the command below to generate the Java project from the `maven-archetype-quickstart` template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

You'll notice that the 'generate' task created a directory with the same name as the `artifactId`. Under this directory, the `src/main/java` directory contains the project source code, the `src/test/java directory` contains the test source, and the `pom.xml` file is the project's Project Object Model, or POM.

### Install the package

Open the `pom.xml` file in your text editor. Add the following dependency elements to the group of dependencies.

```xml
<dependencies>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-communication-identity</artifactId>
        <version>1.2.0-beta.1</version>
    </dependency>
    <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>msal4j</artifactId>
      <version>1.11.0</version>
    </dependency>
</dependencies>
```

### Set up the app framework

From the project directory:

1. Navigate to the `/src/main/java/com/communication/quickstart` directory
1. Open the `App.java` file in your editor
1. Replace the `System.out.println("Hello world!");` statement
1. Add `import` directives

Use the following code to begin:

```java
package com.communication.quickstart;

import com.azure.communication.common.*;
import com.azure.communication.identity.*;
import com.azure.communication.identity.models.*;
import com.azure.core.credential.*;
import com.microsoft.aad.msal4j.IAuthenticationResult;
import com.microsoft.aad.msal4j.InteractiveRequestParameters;
import com.microsoft.aad.msal4j.PublicClientApplication;

import java.io.IOException;
import java.time.*;
import java.util.*;

public class App
{
    public static void main( String[] args ) throws Exception
    {
        System.out.println("Azure Communication Services - Communication access token Quickstart");
        // Quickstart code goes here
    }
}
```

### Step 1: Receive the Azure Active Directory user token via the MSAL library

The first step in the token exchange flow is getting a token for your Teams user by using [Microsoft.Identity.Client](../../../active-directory/develop/reference-v2-libraries.md).

```java
String appId = "<contoso_application_id>";
String authority = "https://login.microsoftonline.com/<contoso_tenant_id>";

PublicClientApplication pca = PublicClientApplication.builder(appId)
        .authority(authority)
        .build();

String redirectUri = "http://localhost";
Set<String> scope = new HashSet<String>();
scope.add("https://auth.msft.communication.azure.com/Teams.ManageCalls");

InteractiveRequestParameters parameters = InteractiveRequestParameters
                    .builder(new URI(redirectUri))
                    .scopes(scope)
                    .build();

IAuthenticationResult result = pca.acquireToken(parameters).get();
```

### Step 2: Initialize the CommunicationIdentityClient

Instantiate a `CommunicationIdentityClient` with your resource's access key and endpoint. Learn how to [manage your resource's connection string](../create-communication-resource.md#store-your-connection-string). In addition, you can initialize the client with any custom HTTP client the implements the `com.azure.core.http.HttpClient` interface.

Add the following code to the `main` method:

```java
//You can find your connection string from your resource in the Azure portal
String connectionString = "<connection_string>";

CommunicationIdentityClient communicationIdentityClient = new CommunicationIdentityClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```

### Step 3: Exchange the Azure AD access token of the Teams User for a Communication Identity access token

Use the `getTokenForTeamsUser` method to issue an access token for the Teams user that can be used with the Azure Communication Services SDKs.

```java
var accessToken = communicationIdentityClient.getTokenForTeamsUser(result.accessToken());
System.out.println("Token: " + accessToken.getToken());
```

## Run the code

Navigate to the directory containing the `pom.xml` file and compile the project by using the following `mvn` command.

Then, build the package.

```console
mvn package
```

Run the following `mvn` command to execute the app.

```console
mvn exec:java -Dexec.mainClass="com.communication.quickstart.App" -Dexec.cleanupDaemonThreads=false
```
