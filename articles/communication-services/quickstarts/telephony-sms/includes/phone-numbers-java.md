## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).- A deployed Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

## Setting Up

### Create a new Java application

Open your terminal or command window. Navigate to the directory where you'd like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

You'll notice that the 'generate' task created a directory with the same name as the `artifactId`. Under this directory, the src/main/java directory contains the project source code, the `src/test/java directory` contains the test source, and the `pom.xml` file is the project's Project Object Model, or POM.

### Install the package

Open the **pom.xml** file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-phonenumbers</artifactId>
    <version>1.0.0-beta.5</version> 
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
import com.azure.communication.phonenumbers.*;
import com.azure.communication.common.*;
import java.io.*;
import java.util.*;
import java.time.*;

import com.azure.core.http.*;

public class App
{
    public static void main( String[] args ) throws IOException
    {
        System.out.println("Azure Communication Services - Phone Numbers Quickstart");
        // Quickstart code goes here
    }
}
```

## Authenticate the Phone Numbers Client

The PhoneNumberClientBuilder is enabled to use Azure Active Directory Authentication
<!-- embedme ./src/samples/java/com/azure/communication/phonenumbers/ReadmeSamples.java#L52-L62 -->
```java
// You can find your endpoint and access key from your resource in the Azure Portal
String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";

// Create an HttpClient builder of your choice and customize it
HttpClient httpClient = new NettyAsyncHttpClientBuilder().build();

PhoneNumbersClient phoneNumberClient = new PhoneNumbersClientBuilder()
    .endpoint(endpoint)
    .credential(new DefaultAzureCredentialBuilder().build())
    .httpClient(httpClient)
    .buildClient();
```

Alternatively, using the endpoint and access key from the communication resource to authenticate is also posible.
<!-- embedme ./src/samples/java/com/azure/communication/phonenumbers/ReadmeSamples.java#L30-L41 -->
```java
// You can find your connection string from your resource in the Azure Portal
String connectionString = "https://<RESOURCE_NAME>.communication.azure.com/;accesskey=<ACCESS_KEY>";

// Create an HttpClient builder of your choice and customize it
HttpClient httpClient = new NettyAsyncHttpClientBuilder().build();

PhoneNumbersClient phoneNumberClient = new PhoneNumbersClientBuilder()
    .connectionString(connectionString)
    .httpClient(httpClient)
    .buildClient();
```

### Search for Available Phone Numbers

In order to purchase phone numbers, you must first search for available phone numbers. To search for phone numbers, provide the area code, assignment type, [phone number capabilities](../../../concepts/telephony-sms/plan-solution.md#phone-number-capabilities-in-azure-communication-services), [phone number type](../../../concepts/telephony-sms/plan-solution.md#phone-number-types-in-azure-communication-services), and quantity. Note that for the toll-free phone number type, providing the area code is optional.

```java
PhoneNumberSearchRequest searchRequest = new PhoneNumberSearchRequest();
searchRequest
    .setAreaCode("800") // Area code is optional for toll free numbers
    .setAssignmentType(PhoneNumberAssignmentType.PERSON)
    .setCapabilities(new PhoneNumberCapabilities()
        .setCalling(PhoneNumberCapabilityValue.INBOUND)
        .setSms(PhoneNumberCapabilityValue.INBOUND_OUTBOUND))
    .setPhoneNumberType(PhoneNumberType.GEOGRAPHIC)
    .setQuantity(1); // Quantity is optional, default is 1

PhoneNumberSearchResult searchResult = phoneNumberClient.beginSearchAvailablePhoneNumbers("US", searchRequest, Context.NONE).getFinalResult();

System.out.println("Searched phone numbers: " + Arrays.toString(searchResult.getPhoneNumbers().toArray()));
```

### Purchase Phone Numbers

The result of searching for phone numbers is a PhoneNumberSearchResult. This contains a `searchId` which can be passed to the purchase numbers API to acquire the numbers in the search. Note that calling the purchase phone numbers API will result in a charge to your Azure Account.

```java
PollResponse<PhoneNumberOperation> purchaseResponse = phoneNumberClient.beginPurchasePhoneNumbers(searchResult.getSearchId(), Context.NONE).waitForCompletion();
System.out.println("Purchase phone numbers operation is: " + purchaseResponse.getStatus());
```

### Get Phone Number(s)

After a purchasing number, you can retrieve it from the client. 
```java
AcquiredPhoneNumber phoneNumber = phoneNumberClient.getPhoneNumber("+18001234567");
System.out.println("Phone Number Country Code: " + phoneNumber.getCountryCode());
```

You can also retrieve all the acquired phone numbers.
``` java
PagedIterable<AcquiredPhoneNumber> phoneNumbers = createPhoneNumberClient().listPhoneNumbers(Context.NONE);
AcquiredPhoneNumber phoneNumber = phoneNumbers.iterator().next();
System.out.println("Phone Number Country Code: " + phoneNumber.getCountryCode());
```

### Update Phone Number Capabilities

With a purchased number, you can update the capabilities.
```java
PhoneNumberCapabilitiesRequest capabilitiesRequest = new PhoneNumberCapabilitiesRequest();
capabilitiesRequest
    .setCalling(PhoneNumberCapabilityValue.INBOUND)
    .setSms(PhoneNumberCapabilityValue.INBOUND);
AcquiredPhoneNumber phoneNumber = phoneNumberClient.beginUpdatePhoneNumberCapabilities("+18001234567", capabilitiesRequest, Context.NONE).getFinalResult();

System.out.println("Phone Number Calling capabilities: " + phoneNumber.getCapabilities().getCalling());
System.out.println("Phone Number SMS capabilities: " + phoneNumber.getCapabilities().getSms());
```

### Release Phone Number

You can release a purchased phone number.
```java
PollResponse<PhoneNumberOperation> releaseResponse = 
    phoneNumberClient.beginReleasePhoneNumber("+18001234567", Context.NONE).waitForCompletion();
System.out.println("Release phone number operation is: " + releaseResponse.getStatus());
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

The output of the app describes each action that is completed:
<!---cSpell:disable --->
```console
Azure Communication Services - Phone Numbers Quickstart

Searched phone numbers: [+18001234567]

Purchase phone numbers operation is: SUCCESSFULLY_COMPLETED

Phone Number Country Code: US

Phone Number Calling capabilities: inbound

Phone Number SMS capabilities: inbound

Release phone number operation is: SUCCESSFULLY_COMPLETED

```
<!---cSpell:enable --->