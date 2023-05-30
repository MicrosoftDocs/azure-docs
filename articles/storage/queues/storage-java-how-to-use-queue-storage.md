---
title: How to use Queue Storage from Java
titleSuffix: Azure Storage
description: Learn how to use Queue Storage to create and delete queues. Learn to insert, peek, get, and delete messages with the Azure Storage client library for Java.
author: normesta
ms.author: normesta
ms.reviewer: dineshm
ms.date: 08/19/2020
ms.topic: how-to
ms.service: storage
ms.subservice: queues
ms.devlang: java
ms.custom: devx-track-java
---

# How to use Queue Storage from Java

[!INCLUDE [storage-selector-queue-include](../../../includes/storage-selector-queue-include.md)]

## Overview

This guide will show you how to code for common scenarios using the Azure Queue Storage service. The samples are written in Java and use the [Azure Storage SDK for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage). Scenarios include **inserting**, **peeking**, **getting**, and **deleting** queue messages. Code for **creating** and **deleting** queues is also covered. For more information on queues, see the [Next steps](#next-steps) section.

[!INCLUDE [storage-queue-concepts-include](../../../includes/storage-queue-concepts-include.md)]

[!INCLUDE [storage-create-account-include](../../../includes/storage-create-account-include.md)]

## Create a Java application

First, verify that your development system meets the prerequisites listed in [Azure Queue Storage client library v12 for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-queue).

To create a Java application named `queues-how-to-v12`:

1. In a console window (such as cmd, PowerShell, or Bash), use Maven to create a new console app with the name `queues-how-to-v12`. Type the following `mvn` command to create a "hello world" Java project.

   ```bash
    mvn archetype:generate \
        --define interactiveMode=n \
        --define groupId=com.queues.howto \
        --define artifactId=queues-howto-v12 \
        --define archetypeArtifactId=maven-archetype-quickstart \
        --define archetypeVersion=1.4
   ```

   ```powershell
   mvn archetype:generate `
       --define interactiveMode=n `
       --define groupId=com.queues.howto `
       --define artifactId=queues-howto-v12 `
       --define archetypeArtifactId=maven-archetype-quickstart `
       --define archetypeVersion=1.4
   ```

1. The output from generating the project should look something like this:

   ```console
   [INFO] Scanning for projects...
   [INFO]
   [INFO] ------------------< org.apache.maven:standalone-pom >-------------------
   [INFO] Building Maven Stub Project (No POM) 1
   [INFO] --------------------------------[ pom ]---------------------------------
   [INFO]
   [INFO] >>> maven-archetype-plugin:3.1.2:generate (default-cli) > generate-sources @ standalone-pom >>>
   [INFO]
   [INFO] <<< maven-archetype-plugin:3.1.2:generate (default-cli) < generate-sources @ standalone-pom <<<
   [INFO]
   [INFO]
   [INFO] --- maven-archetype-plugin:3.1.2:generate (default-cli) @ standalone-pom ---
   [INFO] Generating project in Batch mode
   [INFO] ----------------------------------------------------------------------------
   [INFO] Using following parameters for creating project from Archetype: maven-archetype-quickstart:1.4
   [INFO] ----------------------------------------------------------------------------
   [INFO] Parameter: groupId, Value: com.queues.howto
   [INFO] Parameter: artifactId, Value: queues-howto-v12
   [INFO] Parameter: version, Value: 1.0-SNAPSHOT
   [INFO] Parameter: package, Value: com.queues.howto
   [INFO] Parameter: packageInPathFormat, Value: com/queues/howto
   [INFO] Parameter: version, Value: 1.0-SNAPSHOT
   [INFO] Parameter: package, Value: com.queues.howto
   [INFO] Parameter: groupId, Value: com.queues.howto
   [INFO] Parameter: artifactId, Value: queues-howto-v12
   [INFO] Project created from Archetype in dir: C:\queues\queues-howto-v12
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ------------------------------------------------------------------------
   [INFO] Total time:  6.775 s
   [INFO] Finished at: 2020-08-17T15:27:31-07:00
   [INFO] ------------------------------------------------------------------------
   ```

1. Switch to the newly created `queues-howto-v12` directory.

   ```console
   cd queues-howto-v12
   ```

### Install the package

Open the `pom.xml` file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-storage-queue</artifactId>
  <version>12.6.0</version>
</dependency>
```

## Configure your application to access Queue Storage

Add the following import statements to the top of the Java file where you want to use Azure Storage APIs to access queues:

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_ImportStatements":::

## Set up an Azure Storage connection string

An Azure Storage client uses a storage connection string for accessing data management services. Get the name and the primary access key for your storage account listed in the [Azure portal](https://portal.azure.com). Use them as the `AccountName` and `AccountKey` values in the connection string. This example shows how you can declare a static field to hold the connection string:

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_ConnectionString":::

The following samples assume that you have a `String` object containing the storage connection string.

## How to: Create a queue

A `QueueClient` object contains the operations for interacting with a queue. The following code creates a `QueueClient` object. Use the `QueueClient` object to create the queue you want to use.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_CreateQueue":::

## How to: Add a message to a queue

To insert a message into an existing queue, call the `sendMessage` method. A message can be either a string (in UTF-8 format) or a byte array. Here is code that sends a string message into the queue.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_AddMessage":::

## How to: Peek at the next message

You can peek at the message in the front of a queue without removing it from the queue by calling `peekMessage`.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_PeekMessage":::

## How to: Change the contents of a queued message

You can change the contents of a message in-place in the queue. If the message represents a work task, you could use this feature to update the status. The following code updates a queue message with new contents and sets the visibility timeout to extend another 30 seconds. Extending the visibility timeout gives the client another 30 seconds to continue working on the message. You could keep a retry count, as well. If the message is retried more than *n* times, you would delete it. This scenario protects against a message that triggers an application error each time it's processed.

The following code sample searches through the queue of messages, locates the first message content that matches a search string, modifies the message content, and exits.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_UpdateSearchMessage":::

The following code sample updates just the first visible message in the queue.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_UpdateFirstMessage":::

## How to: Get the queue length

You can get an estimate of the number of messages in a queue.

The `getProperties` method returns several values including the number of messages currently in a queue. The count is only approximate because messages can be added or removed after your request. The `getApproximateMessageCount` method returns the last value retrieved by the call to `getProperties`, without calling Queue Storage.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_GetQueueLength":::

## How to: Dequeue the next message

Your code dequeues a message from a queue in two steps. When you call `receiveMessage`, you get the next message in a queue. A message returned from `receiveMessage` becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call `deleteMessage`. If your code fails to process a message, this two-step process ensures that you can get the same message and try again. Your code calls `deleteMessage` right after the message has been processed.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_DequeueMessage":::

## Additional options for dequeuing messages

There are two ways to customize message retrieval from a queue. First, get a batch of messages (up to 32). Second, set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message.

The following code example uses the `receiveMessages` method to get 20 messages in one call. Then it processes each message using a `for` loop. It also sets the invisibility timeout to five minutes (300 seconds) for each message. The timeout starts for all messages at the same time. When five minutes have passed since the call to `receiveMessages`, any messages not deleted will become visible again.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_DequeueMessages":::

## How to: List the queues

To obtain a list of the current queues, call the `QueueServiceClient.listQueues()` method, which will return a collection of `QueueItem` objects.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_ListQueues":::

## How to: Delete a queue

To delete a queue and all the messages contained in it, call the `delete` method on the `QueueClient` object.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_DeleteMessageQueue":::

[!INCLUDE [storage-check-out-samples-java](../../../includes/storage-check-out-samples-java.md)]

## Next steps

Now that you've learned the basics of Queue Storage, follow these links to learn about more complex storage tasks.

- [Azure Storage SDK for Java](https://github.com/Azure/Azure-SDK-for-Java)
- [Azure Storage client SDK reference](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage)
- [Azure Storage services REST API](/rest/api/storageservices/)
- [Azure Storage team blog](https://techcommunity.Microsoft.com/t5/Azure-storage/bg-p/azurestorageblog)

For related code samples using deprecated Java version 8 SDKs, see [Code samples using Java version 8](queues-v8-samples-java.md).
