---
title: How to create a WebPubSubServiceClient with Java and Azure Identity
description: How to create a WebPubSubServiceClient with Java and Azure Identity
author: terencefan

ms.author: tefa
ms.date: 11/15/2021
ms.service: azure-web-pubsub
ms.custom: devx-track-extended-java
ms.topic: how-to
---

# How to create a `WebPubSubServiceClient` with Java and Azure Identity

This how-to guide shows you how to create a `WebPubSubServiceClient` using Microsoft Entra ID in Java.

## Requirements

- Add [azure-identity](https://mvnrepository.com/artifact/com.azure/azure-identity) dependency in your `pom.xml`.

  ```xml
  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.4.1</version>
  </dependency>
  ```

  > [!Tip]
  > Latest version can be found on this [page](https://mvnrepository.com/artifact/com.azure/azure-identity)

  See [Azure authentication with Java and Azure Identity](/azure/developer/java/sdk/identity) to learn more.

- Add [azure-messaging-webpubsub](https://mvnrepository.com/artifact/com.azure/azure-messaging-webpubsub) dependency in your `pom.xml`.

  ```xml
  <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-messaging-webpubsub</artifactId>
      <version>1.0.0</version>
  </dependency>
  ```

  > [!Tip]
  > Latest version can be found on this [page](https://mvnrepository.com/artifact/com.azure/azure-messaging-webpubsub)

## Sample codes

1. Create a `TokenCredential` with Azure Identity SDK.

   ```java
   package com.webpubsub.tutorial;

   import com.azure.core.credential.TokenCredential;
   import com.azure.identity.DefaultAzureCredentialBuilder;

   public class App {

       public static void main(String[] args) {
           TokenCredential credential = new DefaultAzureCredentialBuilder().build();
       }
   }
   ```

   `credential` can be any class that inherits from `TokenCredential` class.

   - EnvironmentCredential
   - ClientSecretCredential
   - ClientCertificateCredential
   - ManagedIdentityCredential
   - VisualStudioCredential
   - VisualStudioCodeCredential
   - AzureCliCredential

   To learn more, see [Azure Identity client library for Java](/java/api/overview/azure/identity-readme)

2. Then create a `client` with `endpoint`, `hub`, and `credential`.

   ```Java
   package com.webpubsub.tutorial;

   import com.azure.core.credential.TokenCredential;
   import com.azure.identity.DefaultAzureCredentialBuilder;
   import com.azure.messaging.webpubsub.WebPubSubServiceClient;
   import com.azure.messaging.webpubsub.WebPubSubServiceClientBuilder;

   public class App {
       public static void main(String[] args) {

           TokenCredential credential = new DefaultAzureCredentialBuilder().build();

           // create the service client
           WebPubSubServiceClient client = new WebPubSubServiceClientBuilder()
                   .endpoint("<endpoint>")
                   .credential(credential)
                   .hub("<hub>")
                   .buildClient();
       }
   }
   ```

   Learn how to use this client, see [Azure Web PubSub service client library for Java](/java/api/overview/azure/messaging-webpubsub-readme)

## Complete sample

- [Simple chatroom with Microsoft Entra authorization](https://github.com/Azure/azure-webpubsub/tree/main/samples/java/chatapp-aad)
