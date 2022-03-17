---
title: Connect to Azure Media Services v3 API - Java
description: This article describes how to connect to Azure Media Services v3 API with Java.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: quickstart
ms.date: 11/17/2020
ms.custom: devx-track-java, mode-api
ms.author: inhenkel
---
# Connect to Media Services v3 API - Java

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows you how to connect to the Azure Media Services v3 Java SDK using the service principal sign in method.

In this article, the Visual Studio Code is used to develop the sample app.

## Prerequisites

- Follow [Writing Java with Visual Studio Code](https://code.visualstudio.com/docs/java/java-tutorial) to install:

   - JDK
   - Apache Maven
   - Java Extension Pack
- Make sure to set `JAVA_HOME` and `PATH` environment variables.
- [Create a Media Services account](./account-create-how-to.md). Be sure to remember the resource group name and the Media Services account name.
- Follow the steps in the [Access APIs](./access-api-howto.md) topic. Record the subscription ID, application ID (client ID), the authentication key (secret), and the tenant ID that you need in a later step.

Also review:

- [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java)
- [Java Project Management in VS Code](https://code.visualstudio.com/docs/java/java-project)

> [!IMPORTANT]
> Review [naming conventions](media-services-apis-overview.md#naming-conventions).

## Create a Maven project

Open a command-line tool and `cd` to a directory where  you want to create the project.
    
```
mvn archetype:generate -DgroupId=com.azure.ams -DartifactId=testAzureApp -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

When you run the command, the `pom.xml`, `App.java`, and other files are created. 

## Add dependencies

1. In Visual Studio Code, open the folder where your project is
1. Find and open the `pom.xml`
1. Add the needed dependencies.

   See `pom.xml` in the [Video encoding](https://github.com/Azure-Samples/media-services-v3-java/blob/master/VideoEncoding/EncodingWithMESCustomPreset/pom.xml) sample.

## Connect to the Java client

1. Open the `App.java` file under `src\main\java\com\azure\ams` and make sure your package is included at the top:

    ```java
    package com.azure.ams;
    ```
1. Under the package statement, add these import statements:
   
   ```java
   import com.azure.core.management.AzureEnvironment;
   import com.azure.core.management.profile.AzureProfile;
   import com.azure.identity.ClientSecretCredential;
   import com.azure.identity.ClientSecretCredentialBuilder;
   import com.azure.resourcemanager.mediaservices.MediaServicesManager;
   ```
1. To create the Active Directory credentials that you need to make requests, add following code to the main method of the App class and set the values that you got from [Access APIs](./access-api-howto.md):
   
   ```java
   try {
        AzureProfile azureProfile = new AzureProfile("<YOUR_TENANT_ID>", "<YOUR_SUBSCRIPTION_ID>", AzureEnvironment.AZURE);
        ClientSecretCredential clientSecretCredential = new ClientSecretCredentialBuilder()
            .clientId("<YOUR_CLIENT_ID>")
            .clientSecret("<YOUR_CLIENT_SECRET>")
            .tenantId("<YOUR_TENANT_ID>")
            // authority host is optional
            .authorityHost("<AZURE_AUTHORITY_HOST>")
            .build();
        MediaServicesManager mediaServicesManager = MediaServicesManager.authenticate(clientSecretCredential, azureProfile);
        System.out.println("Hello Azure");
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
- [Java reference](/java/api/overview/azure/mediaservices/management)
- [com.azure.resourcemanager.mediaservices](https://mvnrepository.com/artifact/com.azure.resourcemanager/azure-resourcemanager-mediaservices)

## Next steps

You can now include `import com.azure.resourcemanager.mediaservices.*` and start manipulating entities.

For more code examples, see the [Java SDK samples](/samples/azure-samples/media-services-v3-java/azure-media-services-v3-samples-using-java/) repo.
