---
title: include file
description: Learn how to use the Number Management Java SDK to configure direct routing.
services: azure-communication-services
author: boris-bazilevskiy
ms.service: azure-communication-services
ms.subservice: pstn
ms.date: 06/01/2023
ms.topic: include
ms.custom: include file
ms.author: nikuklic
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or later.
- [Apache Maven](https://maven.apache.org/download.cgi).
- A deployed Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- The fully qualified domain name (FQDN) and port number of a session border controller (SBC) in an operational telephony system.
- The [verified domain name](../../../how-tos/telephony/domain-validation.md) of the SBC FQDN.

## Final code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/DirectRouting).

You can also find more usage examples for `SipRoutingClient` on [GitHub](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/communication/azure-communication-phonenumbers/src/samples/java/com/azure/communication/phonenumbers/siprouting/AsyncClientJavaDocCodeSnippets.java).

## Create a Java application

Open your terminal or command window. Go to the directory where you want to create your Java application. Then, run the command to generate the Java project from the *maven-archetype-quickstart* template:

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The `generate` task created a directory with the same name as  the `artifactId` value. Under this directory, the *src/main/java* directory contains the project source code, the *src/test/java* directory contains the test source, and the *pom.xml* file is the project's Project Object Model (POM).

## Install the package

Open the *pom.xml* file in your text editor. Add the following dependency elements to the group of dependencies:

```xml
<dependencies>
	<dependency>
		<groupId>com.azure</groupId>
		<artifactId>azure-communication-phonenumbers</artifactId>
		<version>1.1.0</version>
	</dependency>
</dependencies>
```

## Set up the app framework

From the project directory:

1. Go to the */src/main/java/com/communication/quickstart* directory.
1. Open the *App.java* file in your editor.
1. Replace the `System.out.println("Hello world!");` statement.
1. Add `import` directives.

Use the following code to begin:

```java
import com.azure.communication.phonenumbers.siprouting.SipRoutingAsyncClient;
import com.azure.communication.phonenumbers.siprouting.SipRoutingClientBuilder;
import com.azure.communication.phonenumbers.siprouting.models.SipTrunk;
import com.azure.communication.phonenumbers.siprouting.models.SipTrunkRoute;
import static java.util.Arrays.asList;

public class App
{
    public static void main( String[] args ) throws IOException
    {
        System.out.println("Azure Communication Services - Direct Routing Quickstart");
        // Quickstart code goes here
    }
}
```

## Authenticate the client

With `SipRoutingClientBuilder`, you can use Microsoft Entra authentication:

```java
// You can find your endpoint and access key from your resource in the Azure portal
String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";

SipRoutingAsyncClient sipRoutingAsyncClient = new SipRoutingClientBuilder()
    .endpoint(endpoint)
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

Alternatively, use the endpoint and access key from the communication resource to authenticate:

```java
// You can find your connection string from your resource in the Azure portal
String connectionString = "endpoint=https://<RESOURCE_NAME>.communication.azure.com/;accesskey=<ACCESS_KEY>";

SipRoutingAsyncClient sipRoutingAsyncClient = new SipRoutingClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```

## Set up a direct routing configuration

In the [prerequisites](#prerequisites), you verified domain ownership. The next steps are to create trunks (add SBCs) and create voice routes.

### Create or update trunks

Azure Communication Services direct routing allows communication with registered SBCs only. To register an SBC, you need its FQDN and port:

```java
sipRoutingAsyncClient.setTrunksWithResponse(asList(
	new SipTrunk("sbc.us.contoso.com", 5061),
	new SipTrunk("sbc.eu.contoso.com", 5061)
)).block();
```

### Create or update routes

Provide routing rules for outbound calls. Each rule consists of two parts: a regex pattern that should match a dialed phone number, and the FQDN of a registered trunk where the call is routed.

The order of routes determines the priority of routes. The first route that matches the regex will be picked for a call.

In this example, you create one route for numbers that start with `+1` and a second route for numbers that start with just `+`:

```java
sipRoutingAsyncClient.setRoutes(asList(
	new SipTrunkRoute("UsRoute", "^\\+1(\\d{10})$").setTrunks(asList("sbc.us.contoso.com")),
	new SipTrunkRoute("DefaultRoute", "^\\+\\d+$").setTrunks(asList("sbc.us.contoso.com", "sbc.eu.contoso.com"))
)).block();
```

## Update a direct routing configuration

You can update the properties of a specific trunk by overwriting the record with the same FQDN. For example, you can set a new SBC port value:

``` java
sipRoutingClient.setTrunk(new SipTrunk("sbc.us.contoso.com", 5063));
```

You use the same method to create and update routing rules. When you update routes, send all of them in a single update. The new routing configuration fully overwrites the former one.

## Remove a direct routing configuration

You can't edit or remove a single voice route. You should overwrite the entire voice routing configuration. Here's an example of an empty list that removes all the routes and trunks.

Add two imports:

```java
import java.util.Collections;
import java.util.List;
```

Use the following code to delete a direct routing configuration:

```java
//delete all configured voice routes
System.out.println("Delete all routes");
List<SipTrunkRoute> routes = Collections.<SipTrunkRoute> emptyList();
sipRoutingAsyncClient.setRoutes(routes).block();

//delete all trunks
System.out.println("Delete all trunks");
List<SipTrunk> trunks = Collections.<SipTrunk> emptyList();
sipRoutingAsyncClient.setTrunksWithResponse(trunks).block();
```

You can use the following example to delete a single trunk (SBC), if no voice routes are using it. If the SBC is listed in any voice route, delete that route first.

``` java
sipRoutingClient.deleteTrunk("sbc.us.contoso.com");
```

## Run the code

Go to the directory that contains the *pom.xml* file and compile the project by using the following `mvn` command:

``` console
  mvn clean compile
```

Then, build the package:

``` console
  mvn package
```

Run the following `mvn` command to run the app:

``` console
  mvn exec:java -Dexec.mainClass="com.communication.quickstart.App" -Dexec.cleanupDaemonThreads=false
```
