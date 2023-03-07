---
title: include file
description: A quickstart on how to use Number Management Java SDK to configure direct routing.
services: azure-communication-services
author: boris-bazilevskiy

ms.service: azure-communication-services
ms.subservice: pstn
ms.date: 03/01/2023
ms.topic: include
ms.custom: include file
ms.author: nikuklic
---

<!-- ## Sample code

You can download the sample app from [GitHub](https://github.com/link.  -->

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- A deployed Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- Fully qualified domain name (FQDN) and port number of a Session Border Controller (SBC) in operational telephony system

## Setting Up

### Create a new Java application

Open your terminal or command window. Navigate to the directory where you'd like to create your Java application. Run the command to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

You notice that the 'generate' task created a directory with the same name as the `artifactId`. Under this directory, the src/main/java directory contains the project source code, the `src/test/java directory` contains the test source, and the **pom.xml** file is the project's Project Object Model, or POM.

### Install the package

Open the **pom.xml** file in your text editor. Add the following dependency elements to the group of dependencies.

```xml
<dependencyManagement>
	<dependencies>
		<dependency>
			<groupId>com.azure</groupId>
			<artifactId>azure-sdk-bom</artifactId>
			<version>1.2.9</version>
			<type>pom</type>
			<scope>import</scope>
		</dependency>
	</dependencies>
</dependencyManagement>
<dependencies>
	<dependency>
		<groupId>com.azure</groupId>
		<artifactId>azure-identity</artifactId>
		<version>1.2.3</version>
	</dependency>
	<dependency>
		<groupId>com.azure</groupId>
		<artifactId>azure-communication-phonenumbers</artifactId>
		<version>1.1.0-beta.14</version>
	</dependency>
</dependencies>
```

### Set up the app framework

From the project directory:

1. Navigate to the */src/main/java/com/communication/quickstart* directory
1. Open the **App.java** file in your editor
1. Replace the `System.out.println("Hello world!");` statement
1. Add `import` directives

Use the following code to begin:

```java
import com.azure.communication.phonenumbers.SipRoutingAsyncClient;
import com.azure.communication.phonenumbers.SipRoutingClientBuilder;
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

The SipRoutingClientBuilder is enabled to use Azure Active Directory Authentication

```java
// You can find your endpoint and access key from your resource in the Azure portal
String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";

SipRoutingAsyncClient sipRoutingAsyncClient = new SipRoutingClientBuilder()
    .endpoint(endpoint)
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

Alternatively, use the endpoint and access key from the communication resource to authenticate.

```java
// You can find your connection string from your resource in the Azure portal
String connectionString = "endpoint=https://<RESOURCE_NAME>.communication.azure.com/;accesskey=<ACCESS_KEY>";

SipRoutingAsyncClient sipRoutingAsyncClient = new SipRoutingClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```

## Setup direct routing configuration

Direct routing configuration consists of:

1. Domain ownership verification - see [prerequisites](#prerequisites)
1. Creating trunks (adding SBCs)
1. Creating voice routes

### Verify domain ownership

In order to create a direct routing configuration, you need to verify that you control a domain for your Session Border Controller Fully Qualified Domain name (FQDN). Refer to [domain validation how-to](../../../how-tos/telephony/domain-validation.md).

### Create or Update Trunks

Azure Communication Services direct routing allows communication with registered SBCs only. To register an SBC, you need its FQDN and port.

```java
sipRoutingAsyncClient.setTrunksWithResponse(asList(
	new SipTrunk("sbc.us.contoso.com", 5061),
	new SipTrunk("sbc.eu.contoso.com", 5061)
)).block();
```

### Create or Update Routes

> [!NOTE]
> Order of routes does matter, as it determines priority of routes. The first route that matches the regex will be picked for a call.

For outbound calling routing rules should be provided. Each rule consists of two parts: regex pattern that should match dialed phone number and FQDN of a registered trunk where call is routed. In this example, we create one route for numbers that start with `+1` and a second route for numbers that start with just `+`.

```java
sipRoutingAsyncClient.setRoutes(asList(
	new SipTrunkRoute("UsRoute", "^\\+1(\\d{10})$").setTrunks(asList("sbc.us.contoso.com")),
	new SipTrunkRoute("DefaultRoute", "^\\+\\d+$").setTrunks(asList("sbc.us.contoso.com", "sbc.eu.contoso.com"))
)).block();
```

### Updating existing configuration

Properties of specific Trunk can be updated by overwriting the record with the same FQDN. For example, you can set new SBC Port value.

``` java
sipRoutingClient.setTrunk(new SipTrunk("sbc.us.contoso.com", 5063));
```

> [!IMPORTANT]
>The same method is used to create and update routing rules. When updating routes, all routes should be sent in single update and routing configuration will be fully overwritten by the new one. 

### Removing a direct routing configuration

You can't edit or remove single voice route. Entire voice routing configuration should be overwritten. Here's the example of an empty list that removes all the routes:

``` java


``` 

You can delete a single trunk (SBC), if it isn't used in any voice route. If SBC is listed in any voice route, that route should be deleted first.

``` java
sipRoutingClient.deleteTrunk("sbc.us.contoso.com");
```

### Run the code

Navigate to the directory containing the **pom.xml** file and compile the project by using the following `mvn` command. 

``` console
	mvn clean compile
```

Then, build the package.

``` console
	mvn package
```

Run the following mvn command to execute the app.

``` console
	mvn exec:java -Dexec.mainClass="com.communication.quickstart.App" -Dexec.cleanupDaemonThreads=false
```

> [!NOTE]
> More usage examples for SipRoutingClient can be found [here](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/communication/azure-communication-phonenumbers/src/samples/java/com/azure/communication/phonenumbers/siprouting/AsyncClientJavaDocCodeSnippets.java).