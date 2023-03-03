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

> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/TBDlink)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- A deployed Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- Fully qualified domain name (FQDN) and port number of a Session Border Controller (SBC) in operational telephony system

## Setting Up

### Create a new Java application

Open your terminal or command window. Navigate to the directory where you'd like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

You'll notice that the 'generate' task created a directory with the same name as the `artifactId`. Under this directory, the src/main/java directory contains the project source code, the `src/test/java directory` contains the test source, and the **pom.xml** file is the project's Project Object Model, or POM.

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
<!-- embedme ./src/samples/java/com/azure/communication/phonenumbers/ReadmeSamples.java#L52-L62 -->
```java
// You can find your endpoint and access key from your resource in the Azure portal
String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";

SipRoutingAsyncClient sipRoutingAsyncClient = new SipRoutingClientBuilder()
    .endpoint(endpoint)
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

Alternatively, using the endpoint and access key from the communication resource to authenticate is also possible.
<!-- embedme ./src/samples/java/com/azure/communication/phonenumbers/ReadmeSamples.java#L30-L41 -->
```java
// You can find your connection string from your resource in the Azure portal
String connectionString = "endpoint=https://<RESOURCE_NAME>.communication.azure.com/;accesskey=<ACCESS_KEY>";

SipRoutingAsyncClient sipRoutingAsyncClient = new SipRoutingClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```


## Setup Direct Routing configuration

### Verify Domain Ownership

[How To: Domain validation](../../../how-tos/telephony/domain-validation.md)

### Create Trunks

Register your SBCs by providing their fully qualified domain names and port numbers.

```java

sipRoutingAsyncClient.setTrunksWithResponse(asList(
	new SipTrunk("sbc.us.contoso.com", 1234),
	new SipTrunk("sbc.eu.contoso.com", 1234)
)).block();

```

### Create Routes

For outbound calling routing rules should be provided. Each rule consists of two parts: regex pattern that should match destination phone number, and FQDN of registered trunk where call will be routed to when matched.

```java

sipRoutingAsyncClient.setRoutes(asList(
	new SipTrunkRoute("UsRoute", "^\\+1(\\d{10})$").setTrunks(asList("sbc.us.contoso.com")),
	new SipTrunkRoute("DefaultRoute", "^\\+\\d+$").setTrunks(asList("sbc.us.contoso.com", "sbc.eu.contoso.com"))
)).block();

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

## Updating existing configuration

## Removing a direct routing configuration


> [!NOTE]
> More usage examples for SipRoutingClient can be found [here](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/communication/azure-communication-phonenumbers/src/samples/java/com/azure/communication/phonenumbers/siprouting/AsyncClientJavaDocCodeSnippets.java).
