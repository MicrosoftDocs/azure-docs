---
title: include file
description: include file
services: azure-communication-services
author: tomaschladek
manager: nmurav
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/20/2020
ms.topic: include
ms.custom: include file
ms.author: tchladek
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](https://docs.microsoft.com/java/azure/jdk/?view=azure-java-stable&preserve-view=true) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- A deployed Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

## Setting Up

### Create a new Java application

Open your terminal or command window and navigate to the directory where you'd like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

You'll notice that the 'generate' task created a directory with the same name as the `artifactId`. Under this directory, the src/main/java directory contains the project source code, the `src/test/java directory` contains the test source, and the `pom.xml` file is the project's Project Object Model, or POM.

### Install the package

Open the **pom.xml** file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-administration</artifactId>
    <version>1.0.0-beta.2</version> 
</dependency>
```

### Set up the app framework

From the project directory:

1. Navigate to the */src/main/java/com/communication/quickstart* directory
1. Open the *App.java* file in your editor
1. Replace the `System.out.println("Hello world!");` statement
1. Add `import` directives

Use the following code to begin:

```java
import com.azure.communication.administration.*;
import com.azure.communication.common.*;
import java.io.*;
import java.util.*;
import java.time.*;

import com.azure.core.http.*;

public class App
{
    public static void main( String[] args ) throws IOException
    {
        System.out.println("Azure Communication Services - Access Tokens Quickstart");
        // Quickstart code goes here
    }
}
```

## Authenticate the client

Instantiate a `CommunicationIdentityClient` with your resource's access key and endpoint. Learn how to [manage you resource's connection string](../create-communication-resource.md#store-your-connection-string).

Add the following code to the `main` method:

```java
// Your can find your endpoint and access key from your resource in the Azure Portal
String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";
String accessKey = "SECRET";

// Create an HttpClient builder of your choice and customize it
// Use com.azure.core.http.netty.NettyAsyncHttpClientBuilder if that suits your needs
// -> Add "import com.azure.core.http.netty.*;"
// -> Add azure-core-http-netty dependency to file pom.xml

HttpClient httpClient = new NettyAsyncHttpClientBuilder().build();

CommunicationIdentityClient communicationIdentityClient = new CommunicationIdentityClientBuilder()
    .endpoint(endpoint)
    .credential(new CommunicationClientCredential(accessKey))
    .httpClient(httpClient)
    .buildClient();
```

You can initialize the client with any custom HTTP client the implements the `com.azure.core.http.HttpClient` interface. The above code demonstrates use of the [Azure Core Netty HTTP client](https://docs.microsoft.com/java/api/overview/azure/core-http-netty-readme?view=azure-java-stable&preserve-view=true) that is provided by `azure-core`.

## Create an identity

Azure Communication Services maintains a lightweight identity directory. Use the `createUser` method to create a new entry in the directory with a unique `Id`. You should maintain a mapping between your application's users and Communication Services generated identities (e.g. by storing them in your application server's database).

```java
CommunicationUser identity = communicationIdentityClient.createUser();
System.out.println("\nCreated an identity with ID: " + identity.getId());
```

## Issue access tokens

Use the `issueToken` method to issue an access token for a Communication Services identity. Parameter `scopes` defines set of actions, which are authorized to be performed with the access token. See the [list of supported actions](../../concepts/authentication.md). New instance of parameter `user` can be constructed with the identity's ID, which you are suppose to store and map to your application's users.

```java
// Issue an access token with the "voip" scope for an identity
List<String> scopes = new ArrayList<>(Arrays.asList("voip"));
CommunicationUserToken response = communicationIdentityClient.issueToken(identity, scopes);
OffsetDateTime expiresOn = response.getExpiresOn();
String token = response.getToken();
String identityId = response.getUser().getId();
System.out.println("\nIssued a access token with 'voip' scope for identity with ID: " + identityId + ": " + token);
```

Access tokens are short-lived credentials that need to be reissued in order to prevent your application's users from experiencing service disruptions. The `expiresAt` response property indicates the lifetime of the access token.

## Refresh access tokens

To refresh an access token, use the `CommunicationUser` object to re-issue:

```java  
// Value existingIdentity represents identity of Azure Communication Services stored during identity creation
CommunicationUser identity = new CommunicationUser(existingIdentity);
response = communicationIdentityClient.issueToken(identity, scopes);
```

## Revoke access tokens

In some cases, you may need to explicitly revoke access tokens, for example, when an application's user changes the password they use to authenticate to your service. Use the `revokeTokens` method to invalidate all of a access tokens.

```java  
communicationIdentityClient.revokeTokens(identity, OffsetDateTime.now());
System.out.println("\nRevoked access tokens for the user with ID: " + identity.getId());
```

## Delete an identity

Deleting an identity revokes all active access tokens and prevents you from issuing subsequent access tokens for the identity. It also removes all the persisted content associated with the identity.

```java
communicationIdentityClient.deleteUser(identity);
System.out.println("\nSuccessfully deleted the identity with ID: " + identity.getId());
```

## Run the code

Navigate to the directory containing the *pom.xml* file and compile the project by using the following `mvn` command.

```console
mvn compile
```

Then, build the package.

```console
mvn package
```

Run the following `mvn` command to execute the app.

```console
mvn exec:java -Dexec.mainClass="com.communication.quickstart.App" -Dexec.cleanupDaemonThreads=false
```
