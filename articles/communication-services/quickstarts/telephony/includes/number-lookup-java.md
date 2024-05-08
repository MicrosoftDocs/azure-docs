Get started with the Phone Numbers client library for Java to look up operator information for phone numbers, which can be used to determine whether and how to communicate with that phone number. Follow these steps to install the package and look up operator information about a phone number.

> [!NOTE]
> Find the code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/LookupNumber).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

### Prerequisite check

In a terminal or command window, run the `mvn -v` command to check that Maven is installed.

## Setting up

To set up an environment for sending lookup queries, take the steps in the following sections.

### Create a new Java application

In a terminal or command window, navigate to the directory where you'd like to create your Java application. Run the following command to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.lookup.quickstart -DartifactId=communication-lookup-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The 'generate' task creates a directory with the same name as the `artifactId`. Under this directory, the src/main/java directory contains the project source code, the `src/test/java directory` contains the test source, and the `pom.xml` file is the project's Project Object Model, or POM.

### Connect to dev package feed
The public preview version of the SDK is published to a dev package feed. To connect to the dev feed, open the **pom.xml** file in your text editor and add the dev repo to **both** your pom.xml's `<repositories>` and `<distributionManagement>` sections that you can add if they don't already exist.

```xml
<repository>
  <id>azure-sdk-for-java</id>
  <url>https://pkgs.dev.azure.com/azure-sdk/public/_packaging/azure-sdk-for-java/maven/v1</url>
  <releases>
    <enabled>true</enabled>
  </releases>
  <snapshots>
    <enabled>true</enabled>
  </snapshots>
</repository>
```

You may need to add or edit the `settings.xml` file in `${user.home}/.m2`

```xml
<server>
  <id>azure-sdk-for-java</id>
  <username>azure-sdk</username>
  <password>[PERSONAL_ACCESS_TOKEN]</password>
</server>
```

You can generate a [Personal Access Token](https://dev.azure.com/azure-sdk/_details/security/tokens) with _Packaging_ read & write scopes and paste it into the `<password>` tag.

More detailed information and other options for connecting to the dev feed can be found [here](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java/connect).

### Install the package
Add the following dependency elements to the group of dependencies in the **pom.xml** file.

```xml
<dependencies>
  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-common</artifactId>
    <version>1.0.0</version>
  </dependency>

  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-phonenumbers</artifactId>
    <version>1.2.0-beta.3</version>
  </dependency>

  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.2.3</version>
  </dependency>

  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-core</artifactId>
    <version>1.41.0</version>
  </dependency>
</dependencies>
```

Check the `properties` section to ensure your project is targeting Maven version 1.8 or above.

```xml
<properties>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  <maven.compiler.source>1.8</maven.compiler.source>
  <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

## Code examples

### Set up the app framework

From the project directory:

1. Navigate to the */src/main/java/com/communication/lookup/quickstart* directory
1. Open the *App.java* file in your editor
1. Replace the `System.out.println("Hello world!");` statement
1. Add `import` directives

Use the following code to begin:

```java
package com.communication.lookup.quickstart;

import com.azure.communication.phonenumbers.*;
import com.azure.communication.phonenumbers.models.*;
import com.azure.core.http.rest.*;
import com.azure.core.util.Context;
import com.azure.identity.*;
import java.io.*;
import java.util.ArrayList;

public class App
{
    public static void main( String[] args ) throws IOException
    {
        System.out.println("Azure Communication Services - Number Lookup Quickstart");
        // Quickstart code goes here
    }
}
```

### Authenticate the client

The client can be authenticated using a connection string acquired from an Azure Communication Services resource in the [Azure portal](https://portal.azure.com). Using a `COMMUNICATION_SERVICES_CONNECTION_STRING` environment variable is recommended to avoid putting your connection string in plain text within your code. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).
<!-- embedme ./src/samples/java/com/azure/communication/phonenumbers/ReadmeSamples.java#L30-L41 -->
```java
// This code retrieves your connection string from an environment variable
String connectionString = System.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING");

PhoneNumbersClient phoneNumberClient = new PhoneNumbersClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```

Alternatively, you can authenticate using Microsoft Entra authentication. Using the `DefaultAzureCredentialBuilder` is the easiest way to get started with Microsoft Entra ID. You can acquire your resource name from an Azure Communication Services resource in the [Azure portal](https://portal.azure.com).
<!-- embedme ./src/samples/java/com/azure/communication/phonenumbers/ReadmeSamples.java#L52-L62 -->
```java
// You can find your resource name from your resource in the Azure portal
String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";

PhoneNumbersClient phoneNumberClient = new PhoneNumbersClientBuilder()
    .endpoint(endpoint)
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

### Look up phone number formatting

To look up the national and international formatting for a number, call `searchOperatorInformation` from the `PhoneNumbersClient`.

```java
ArrayList<String> phoneNumbers = new ArrayList<String>();
phoneNumbers.add("<target-phone-number>");

// Use the free number lookup functionality to get number formatting information
OperatorInformationResult formattingResult = phoneNumberClient.searchOperatorInformation(phoneNumbers);
OperatorInformation formattingInfo = formattingResult.getValues().get(0);
```

Replace `<target-phone-number>` with the phone number you're looking up, usually a number you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123.

### Look up operator information for a number

To search for a phone number's operator information, call `searchOperatorInformationWithResponse` from the `PhoneNumbersClient`, passing `true` for the `IncludeAdditionalOperatorDetails` option.

```java
OperatorInformationOptions options = new OperatorInformationOptions();
options.setIncludeAdditionalOperatorDetails(true);
Response<OperatorInformationResult> result = phoneNumberClient.searchOperatorInformationWithResponse(phoneNumbers, options, Context.NONE);
OperatorInformation operatorInfo = result.getValue().getValues().get(0);
```

> [!WARNING]
> Using this functionality will incur a charge to your account.

### Use operator information

You can now use the operator information. For this quickstart guide, we can print some of the details to the console.

First, we can print details about the number format.

```java
System.out.println(formattingInfo.getPhoneNumber() + " is formatted "
    + formattingInfo.getInternationalFormat() + " internationally, and "
    + formattingInfo.getNationalFormat() + " nationally");
```

Next, we can print details about the phone number and operator.

```java
String numberType = operatorInfo.getNumberType() == null ? "unknown" : operatorInfo.getNumberType().toString();
String operatorName = "an unknown operator";
if (operatorInfo.getOperatorDetails()!= null && operatorInfo.getOperatorDetails().getName() != null)
{
    operatorName = operatorInfo.getOperatorDetails().getName();
}
System.out.println(operatorInfo.getPhoneNumber() + " is a " + numberType + " number, operated in "
    + operatorInfo.getIsoCountryCode() + " by " + operatorName);
```

You may also use the operator information to determine whether to send an SMS. For more information on sending an SMS, see the [SMS Quickstart](../../sms/send.md).

## Run the code

Run the application from your terminal or command window with the following commands:
Navigate to the directory containing the *pom.xml* file and compile the project.

```console
mvn compile
```

Then, build the package.

```console
mvn package
```

To execute the app, use the `mvn` command.

```console
mvn exec:java -D"exec.mainClass"="com.communication.lookup.quickstart.App" -D"exec.cleanupDaemonThreads"="false"
```

## Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/LookupNumber).
