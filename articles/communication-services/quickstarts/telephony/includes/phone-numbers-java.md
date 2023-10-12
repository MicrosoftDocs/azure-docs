> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/PhoneNumbers)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- A deployed Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

## Setting Up

### Create a new Java application

Open your terminal or command window. Navigate to the directory where you'd like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

You'll notice that the 'generate' task created a directory with the same name as the `artifactId`. Under this directory, the src/main/java directory contains the project source code, the `src/test/java directory` contains the test source, and the `pom.xml` file is the project's Project Object Model, or POM.

### Install the package

Open the **pom.xml** file in your text editor. Add the following dependency elements to the group of dependencies.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-common</artifactId>
    <version>1.0.0</version>
</dependency>

<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-phonenumbers</artifactId>
    <version>1.0.0</version>
</dependency>

<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.2.3</version>
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
import com.azure.communication.phonenumbers.models.*;
import com.azure.core.http.rest.*;
import com.azure.core.util.Context;
import com.azure.core.util.polling.LongRunningOperationStatus;
import com.azure.core.util.polling.PollResponse;
import com.azure.core.util.polling.SyncPoller;
import com.azure.identity.*;
import java.io.*;

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

The PhoneNumberClientBuilder is enabled to use Microsoft Entra authentication
<!-- embedme ./src/samples/java/com/azure/communication/phonenumbers/ReadmeSamples.java#L52-L62 -->
```java
// You can find your endpoint and access key from your resource in the Azure portal
String endpoint = "https://<RESOURCE_NAME>.communication.azure.com";

PhoneNumbersClient phoneNumberClient = new PhoneNumbersClientBuilder()
    .endpoint(endpoint)
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

Alternatively, using the endpoint and access key from the communication resource to authenticate is also possible.
<!-- embedme ./src/samples/java/com/azure/communication/phonenumbers/ReadmeSamples.java#L30-L41 -->
```java
// You can find your connection string from your resource in the Azure portal
String connectionString = "endpoint=https://<RESOURCE_NAME>.communication.azure.com/;accesskey=<ACCESS_KEY>";

PhoneNumbersClient phoneNumberClient = new PhoneNumbersClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```

## Manage Phone Numbers

### Search for Available Phone Numbers

In order to purchase phone numbers, you must first search for available phone numbers. To search for phone numbers, provide the area code, assignment type, [phone number capabilities](../../../concepts/telephony/plan-solution.md#phone-number-capabilities-in-azure-communication-services), [phone number type](../../../concepts/telephony/plan-solution.md#phone-number-types-in-azure-communication-services), and quantity. Note that for the toll-free phone number type, providing the area code is optional.

```java
 PhoneNumberCapabilities capabilities = new PhoneNumberCapabilities()
    .setCalling(PhoneNumberCapabilityType.INBOUND)
    .setSms(PhoneNumberCapabilityType.INBOUND_OUTBOUND);
PhoneNumberSearchOptions searchOptions = new PhoneNumberSearchOptions().setAreaCode("833").setQuantity(1);

SyncPoller<PhoneNumberOperation, PhoneNumberSearchResult> poller = phoneNumberClient
    .beginSearchAvailablePhoneNumbers("US", PhoneNumberType.TOLL_FREE, PhoneNumberAssignmentType.APPLICATION, capabilities, searchOptions, Context.NONE);
PollResponse<PhoneNumberOperation> response = poller.waitForCompletion();
String searchId = "";

if (LongRunningOperationStatus.SUCCESSFULLY_COMPLETED == response.getStatus()) {
    PhoneNumberSearchResult searchResult = poller.getFinalResult();
    searchId = searchResult.getSearchId();
    System.out.println("Searched phone numbers: " + searchResult.getPhoneNumbers());
    System.out.println("Search expires by: " + searchResult.getSearchExpiresBy());
    System.out.println("Phone number costs:" + searchResult.getCost().getAmount());
}
```

### Purchase Phone Numbers

The result of searching for phone numbers is a PhoneNumberSearchResult. This contains a `searchId` which can be passed to the purchase numbers API to acquire the numbers in the search. Note that calling the purchase phone numbers API will result in a charge to your Azure Account.

```java
PollResponse<PhoneNumberOperation> purchaseResponse = phoneNumberClient.beginPurchasePhoneNumbers(searchId, Context.NONE).waitForCompletion();
System.out.println("Purchase phone numbers operation is: " + purchaseResponse.getStatus());
```

### Get Phone Number(s)

After a purchasing number, you can retrieve it from the client.
```java
PurchasedPhoneNumber phoneNumber = phoneNumberClient.getPurchasedPhoneNumber("+14255550123");
System.out.println("Phone Number Country Code: " + phoneNumber.getCountryCode());
```

You can also retrieve all the purchased phone numbers.
``` java
PagedIterable<PurchasedPhoneNumber> phoneNumbers = phoneNumberClient.listPurchasedPhoneNumbers(Context.NONE);
PurchasedPhoneNumber phoneNumber = phoneNumbers.iterator().next();
System.out.println("Phone Number Country Code: " + phoneNumber.getCountryCode());
```

### Update Phone Number Capabilities

With a purchased number, you can update the capabilities.
```java
PhoneNumberCapabilities capabilities = new PhoneNumberCapabilities();
capabilities
    .setCalling(PhoneNumberCapabilityType.INBOUND)
    .setSms(PhoneNumberCapabilityType.INBOUND_OUTBOUND);

SyncPoller<PhoneNumberOperation, PurchasedPhoneNumber> poller = phoneNumberClient.beginUpdatePhoneNumberCapabilities("+18001234567", capabilities, Context.NONE);
PollResponse<PhoneNumberOperation> response = poller.waitForCompletion();
if (LongRunningOperationStatus.SUCCESSFULLY_COMPLETED == response.getStatus()) {
    PurchasedPhoneNumber phoneNumber = poller.getFinalResult();
    System.out.println("Phone Number Calling capabilities: " + phoneNumber.getCapabilities().getCalling()); //Phone Number Calling capabilities: inbound
    System.out.println("Phone Number SMS capabilities: " + phoneNumber.getCapabilities().getSms()); //Phone Number SMS capabilities: inbound+outbound
}
```

### Release Phone Number

You can release a purchased phone number.
```java
PollResponse<PhoneNumberOperation> releaseResponse =
    phoneNumberClient.beginReleasePhoneNumber("+14255550123", Context.NONE).waitForCompletion();
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
