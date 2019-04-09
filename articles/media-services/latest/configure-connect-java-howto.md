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

In this article, the Visual Studio Code is used to develop an app.

## Prerequisites

- Follow [Writing Java with Visual Studio Code](https://code.visualstudio.com/docs/java/java-tutorial) to install:

   - JDK
   - Apache Maven
   - Java Extension Pack
- Make sure to set `JAVA_HOME` and `PATH` environment variables to the install locations of the JDK and Apache Maven.
- [Create a Media Services account](create-account-cli-how-to.md). Be sure to remember the resource group name and the Media Services account name.

Also review:

- [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java)
- [Java Project Management in VS Code](https://code.visualstudio.com/docs/java/java-project)

## Create a Maven project

Open a command line tool and `cd` to a directory where  you want to create the project.
    
```
mvn archetype:generate -DgroupId=com.azure.ams -DartifactId=testAzureApp -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

When you run the command, the `pom.xml`, `App.java`, and other files are created. 

## Add dependencies

1. In Visual Studio Code, open the folder where your project is. 
1. Find and open the `pom.xml`. 
1. Add the needed dependencies. One of them is [com.microsoft.azure.mediaservices.v2018_07_01:azure-mgmt-media](https://search.maven.org/artifact/com.microsoft.azure.mediaservices.v2018_07_01/azure-mgmt-media/1.0.0-beta/jar).

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

## Create credentials

Before you start this step, follow the steps in the [Access APIs](access-api-cli-how-to.md) topic. Record the application ID (client ID), the authentication key (secret), and the tenant ID that you need in a later step.

### Create the authorization file

1. Create a file named `azureauth.properties` and add these properties to it:

   ```
   subscription=00000000-6753-4ca2-b1ae-193798e2c9d8
   client=0000000-3c20-4055-a140-fa9ecf9156a3
   key=0000000-06ea-45e2-b011-15b1f3702628
   tenant=0000000-86f1-41af-91ab-2d7cd011db47
   managementURI=https\://management.core.windows.net/
   baseURL=https\://management.azure.com/
   authURL=https\://login.windows.net/
   graphURL=https\://graph.windows.net/
   ```

    Replace **&lt;subscription-id&gt;**, **&lt;application-id&gt;**, **&lt;authentication-key&gt;**, and **&lt;tenant-id&gt;** with the values you got from the [Access APIs](access-api-cli-how-to.md) topic.
2. Save the file.

### Create the management client

1. Open the `App.java` file under `src\main\java\com\azure\ams` and make sure this package statement is at the top:

    ```java
    package com.azure.ams;
    ```

2. Under the package statement, add these import statements:
   
   ```java
   import com.microsoft.azure.arm.resources.Region;
   import com.microsoft.azure.credentials.ApplicationTokenCredentials;
   import com.microsoft.azure.management.Azure;
   import com.microsoft.azure.management.mediaservices.v2018_07_01.implementation.*;
   import com.microsoft.rest.LogLevel;
   import java.io.File;
   ```
2. To create the Active Directory credentials that you need to make requests, add this code to the main method of the App class:
   
    ```java
    try {
        // Add the path where your azureauth.properties file is located.
        final File credFile = new File("/Users/username/javatest/testAzureApp/azureauth.properties");
        Azure azure = Azure.configure()
            .withLogLevel(LogLevel.BASIC)
            .authenticate(credFile)
            .withDefaultSubscription();


          //    MediaServices azureMediaServicesClient = 
          //  new MediaServiceInner(azure);
          
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
