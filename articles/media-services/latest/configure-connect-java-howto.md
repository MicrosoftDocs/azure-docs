---
title: Connect to Azure Media Services v3 API - Java
description: Learn how to connect to Media Services v3 API with Java.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/08/2019
ms.author: juliako

---
# Connect to Media Services v3 API - Java

This article shows you how to connect to the Azure Media Services v3 Java SDK using the service principal sign in method.

## Prerequisites

- Follow [Writing Java with Visual Studio Code](https://code.visualstudio.com/docs/java/java-tutorial) to install:

   - JDK
   - Maven
   - Java Extension Pack
- Make sure to set JAVA_HOME environment variable to the install location of the JDK
- [Create a Media Services account](create-account-cli-how-to.md). Be sure to remember the resource group name and the Media Services account name.

Also review:

- [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java)
- [Java Project Management in VS Code](https://code.visualstudio.com/docs/java/java-project)

## Create a Maven project

Create a new folder and the project by running the following commands:
    
 ```
 mkdir java-azure-test
 cd java-azure-test
    
 mvn archetype:generate -DgroupId=com.azure.ams -DartifactId=testAzureApp -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
 ```

## Add dependencies

The following packages should be specified:

|Package|Description|
|---|---|
|[com.microsoft.azure.mediaservices.v2018_07_01:azure-mgmt-media](https://search.maven.org/artifact/com.microsoft.azure.mediaservices.v2018_07_01/azure-mgmt-media/1.0.0-beta/jar)|Azure Media Services SDK. |

1. Under the `testAzureApp` folder, open the `pom.xml` file and add the build configuration to &lt;project&gt; to enable the building of your application:

    ```xml
    <build>
      <plugins>
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>exec-maven-plugin</artifactId>
            <configuration>
                <mainClass>com.azure.ams.testAzureApp.App</mainClass>
            </configuration>
        </plugin>
      </plugins>
    </build>
    ```

2. Add the dependencies that are needed to access the Azure Java SDK. 

    ```xml
    <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure</artifactId>
      <version>1.1.0</version>
    </dependency>
    <dependency>
      <groupId>com.microsoft.azure.mediaservices.v2018_07_01</groupId>
      <artifactId>azure-mgmt-media</artifactId>
      <version>1.0.0-beta-2</version>
    </dependency>
        <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-mgmt-resources</artifactId>
      <version>1.1.0</version>
    </dependency>
    <dependency>
      <groupId>com.microsoft.azure.v2</groupId>
      <artifactId>azure-client-authentication</artifactId>
      <version>2.0.0-java7-beta1</version>
    </dependency>
    ```
3. Save the file.

## Create credentials

Before you start this step, follow the steps in the [Access APIs](access-api-cli-how-to.md) topic. Record the application ID (client ID), the authentication key (secret), and the tenant ID that you need in a later step.

### Create the authorization file

1. Create a file named `azureauth.properties` and add these properties to it:

    ```
    subscription=<subscription-id>
    client=<application-id>
    key=<authentication-key>
    tenant=<tenant-id>
    managementURI=https://management.core.windows.net/
    baseURL=https://management.azure.com/
    authURL=https://login.windows.net/
    graphURL=https://graph.windows.net/
    ```

    Replace **&lt;subscription-id&gt;**, **&lt;application-id&gt;**, **&lt;authentication-key&gt;**, and **&lt;tenant-id&gt;** with the values you got from the [Access APIs](access-api-cli-how-to.md) topic.
2. Save the file.

### Create the management client

1. Open the `App.java` file under `src\main\java\com\azure\ams` and make sure this package statement is at the top:

    ```java
    package com.azure.ams.testAzureApp;
    ```

2. Under the package statement, add these import statements:
   
    ```java
    importcom.microsoft.azure.arm.resources.Region;
    import com.microsoft.azure.credentials.ApplicationTokenCredentials;
    import com.microsoft.azure.management.Azure;
    import com.microsoft.azure.management.mediaservices.v2018_07_01;
    import com.microsoft.rest.RestClient;
    import java.io.*;
    ```
2. To create the Active Directory credentials that you need to make requests, add this code to the main method of the App class:
   
    ```java
    try {
        final File credFile = new File("path to the azureauth.properties file");
        Azure azure = Azure.configure()
            .withLogLevel(LogLevel.BASIC)
            .authenticate(credFile)
            .withDefaultSubscription();


       // ApplicationTokenCredentials creds = new ApplicationTokenCredentials(_clientId, _tenantId, _clientSecret, null);
       //  _adlsClient = new DataLakeStoreAccountManagementClientImpl(creds);

    } catch (Exception e) {
        System.out.println(e.getMessage());
        e.printStackTrace();
    }

    ```

## Next steps

- [Media Services concepts](concepts-overview.md)
- [Java SDK](https://aka.ms/ams-v3-java-sdk)
- [Java reference](https://aka.ms/ams-v3-java-ref)
- [https://search.maven.org/](https://search.maven.org/)
