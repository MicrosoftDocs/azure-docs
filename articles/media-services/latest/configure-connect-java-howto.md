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
ms.date: 04/18/2019
ms.author: juliako

---
# Connect to Media Services v3 API - Java

This article shows you how to connect to the Azure Media Services v3 Java SDK using the service principal sign in method.

In this article, the Visual Studio Code is used to develop the sample app.

## Prerequisites

- Follow [Writing Java with Visual Studio Code](https://code.visualstudio.com/docs/java/java-tutorial) to install:

   - JDK
   - Apache Maven
   - Java Extension Pack
- Make sure to set `JAVA_HOME` and `PATH` environment variables.
- [Create a Media Services account](create-account-cli-how-to.md). Be sure to remember the resource group name and the Media Services account name.
- Follow the steps in the [Access APIs](access-api-cli-how-to.md) topic. Record the subscription ID, application ID (client ID), the authentication key (secret), and the tenant ID that you need in a later step.

Also review:

- [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java)
- [Java Project Management in VS Code](https://code.visualstudio.com/docs/java/java-project)

## Create a Maven project

Open a command-line tool and `cd` to a directory where  you want to create the project.
    
```
mvn archetype:generate -DgroupId=com.azure.ams -DartifactId=testAzureApp -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

When you run the command, the `pom.xml`, `App.java`, and other files are created. 

## Add dependencies

1. In Visual Studio Code, open the folder where your project is
1. Find and open the `pom.xml`
1. Add the needed dependencies

    ```xml
   <dependency>
     <groupId>com.microsoft.azure.mediaservices.v2018_07_01</groupId>
     <artifactId>azure-mgmt-media</artifactId>
     <version>1.0.0-beta-3</version>
   </dependency>
   <dependency>
     <groupId>com.microsoft.rest</groupId>
     <artifactId>client-runtime</artifactId>
     <version>1.6.6</version>
   </dependency>
   <dependency>
     <groupId>com.microsoft.azure</groupId>
     <artifactId>azure-client-authentication</artifactId>
     <version>1.6.6</version>
   </dependency>
    ```

## Connect to the Java client

1. Open the `App.java` file under `src\main\java\com\azure\ams` and make sure your package is included at the top:

    ```java
    package com.azure.ams;
    ```
1. Under the package statement, add these import statements:
   
   ```java
   import com.microsoft.azure.AzureEnvironment;
   import com.microsoft.azure.credentials.ApplicationTokenCredentials;
   import com.microsoft.azure.management.mediaservices.v2018_07_01.implementation.MediaManager;
   import com.microsoft.rest.LogLevel;
   ```
1. To create the Active Directory credentials that you need to make requests, add following code to the main method of the App class and set the values that you got from [Access APIs](access-api-cli-how-to.md):
   
   ```java
   final String clientId = "00000000-0000-0000-0000-000000000000";
   final String tenantId = "00000000-0000-0000-0000-000000000000";
   final String clientSecret = "00000000-0000-0000-0000-000000000000";
   final String subscriptionId = "00000000-0000-0000-0000-000000000000";

   try {
      ApplicationTokenCredentials credentials = new ApplicationTokenCredentials(clientId, tenantId, clientSecret, AzureEnvironment.AZURE);
      credentials.withDefaultSubscriptionId(subscriptionId);

      MediaManager manager = MediaManager
              .configure()
              .withLogLevel(LogLevel.BODY_AND_HEADERS)
              .authenticate(credentials, credentials.defaultSubscriptionId());
      System.out.println("signed in");
   }
   catch (Exception e) {
      System.out.println("Exception encountered.");
      System.out.println(e.toString());
   }
   ```
1. Run the app.

## See also

- [Media Services concepts](concepts-overview.md)
- [Java SDK](https://aka.ms/ams-v3-java-sdk)
- [Java reference](https://aka.ms/ams-v3-java-ref)
- [com.microsoft.azure.mediaservices.v2018_07_01:azure-mgmt-media](https://search.maven.org/artifact/com.microsoft.azure.mediaservices.v2018_07_01/azure-mgmt-media/1.0.0-beta/jar)

## Next steps

You can now include `import com.microsoft.azure.management.mediaservices.v2018_07_01.*;` and start manipulating entities.
