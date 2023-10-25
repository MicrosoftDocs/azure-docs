---
title: include file
description: Java mute participant
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 03/19/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp)
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- [Java Development Kit](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Create a new Java application

In your terminal or command window, navigate to the directory where you would like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template. 

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The command above creates a directory with the same name as `artifactId` argument. Under this directory, `src/main/java` directory contains the project source code, `src/test/java` directory contains the test source. 

You'll notice that the 'generate' step created a directory with the same name as the artifactId. Under this directory, `src/main/java` directory contains source code, `src/test/java` directory contains tests, and `pom.xml` file is the project's Project Object Model, or POM.

Update your applications POM file to use Java 8 or higher.

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

## Configure Azure SDK dev feed

Since the Call Automation SDK version used in this quickstart isn't yet available in Maven Central Repository, we need to add an Azure Artifacts development feed, which contains the latest version of Call Automation SDK.

Add the [azure-sdk-for-java feed](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java) to your `pom.xml`. Follow the instructions after clicking the "Connect to Feed" button.

## Add package references

In your POM file, add the following reference for the project. 

**azure-communication-callingserver**

Azure Communication Services Call Automation SDK package is retrieved from the Azure SDK Dev Feed configured above.

``` xml 
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-callautomation</artifactId>
  <version>1.0.0-alpha.20230317.1</version>
</dependency>
```

## Update App.java with code

In your editor of choice, open App.java file and update it with the code provided in [Update app.java with code](../../../quickstarts/call-automation/callflows-for-customer-interactions.md) section.

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/callflows-for-customer-interactions.md). In this quickstart, we'll answer an incoming call.


## Mute participant during a call 

``` java
var target = new CommunicationUserIdentifier(ACS_USER_ID); 
var callConnectionAsync = callAutomationClientAsync.getCallConnectionAsync(CALL_CONNECTION_ID); 
callConnectionAsync.muteParticipantsAsync(target).block();
```

## Participant muted event

``` json
{
  "id": "9dff6ffa-a496-4279-979d-f6455cb88b22",
  "source": "calling/callConnections/401f3500-08a0-4e9e-b844-61a65c845a0b",
  "type": "Microsoft.Communication.ParticipantsUpdated",
  "data": {
    "participants": [
      {
        "identifier": {
          "rawId": "<ACS_USER_ID>",
          "kind": "communicationUser",
          "communicationUser": {
            "id": "<ACS_USER_ID>"
          }
        },
        "isMuted": true
      },
      {
        "identifier": {
          "rawId": "<ACS_USER_ID>",
          "kind": "communicationUser",
          "communicationUser": {
            "id": "<ACS_USER_ID>"
          }
        },
        "isMuted": false
      },
      {
        "identifier": {
          "rawId": "<ACS_USER_ID>",
          "kind": "communicationUser",
          "communicationUser": {
            "id": "<ACS_USER_ID>"
          }
        },
        "isMuted": false
      }
    ],
    "sequenceNumber": 4,
    "callConnectionId": "401f3500-08a0-4e9e-b844-61a65c845a0b",
    "serverCallId": "aHR0cHM6Ly9hcGkuZmxpZ2h0cHJveHkuc2t5cGUuY29tL2FwaS92Mi9jcC9jb252LXVzZWEyLTAxLmNvbnYuc2t5cGUuY29tL2NvbnYvRkhjV1lURXFZMENUY0VKUlJ3VHc1UT9pPTQmZT02MzgxNDkzMTEwNDk0NTM2ODQ=",
    "correlationId": "e47198fb-1798-4f3e-b245-4fd06569ad5c"
  },
  "time": "2023-03-21T17:22:35.4300007+00:00",
  "specversion": "1.0",
  "datacontenttype": "application/json",
  "subject": "calling/callConnections/401f3500-08a0-4e9e-b844-61a65c845a0b"
}
```
