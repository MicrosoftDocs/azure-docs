---
title: How to use Queue storage from Java - Azure Storage
description: Learn how to use Queue storage to create and delete queues. Learn to insert, peek, get, and delete messages with the Azure Storage client library for Java.
author: mhopkins-msft

ms.custom: devx-track-java
ms.author: mhopkins
ms.date: 08/19/2020
ms.service: storage
ms.subservice: queues
ms.topic: how-to
ms.reviewer: dineshm
---

# How to use Queue storage from Java

[!INCLUDE [storage-selector-queue-include](../../../includes/storage-selector-queue-include.md)]

## Overview

This guide will show you how to code for common scenarios using the Azure Queue storage service. The samples are written in Java and use the [Azure Storage SDK for Java][Azure Storage SDK for Java]. Scenarios include **inserting**, **peeking**, **getting**, and **deleting** queue messages. Code for **creating** and **deleting** queues is also covered. For more information on queues, see the [Next steps](#next-steps) section.

[!INCLUDE [storage-queue-concepts-include](../../../includes/storage-queue-concepts-include.md)]

[!INCLUDE [storage-create-account-include](../../../includes/storage-create-account-include.md)]

## Create a Java application

# [Java v12](#tab/java)

First, verify your development system meets the prerequisites listed in [Azure Queue storage client library for Java v12](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-queue).

To create a Java application named *queues-how-to-v12*:

1. In a console window (such as cmd, PowerShell, or Bash), use Maven to create a new console app with the name *queues-how-to-v12*. Type the following **mvn** command to create a "Hello world!" Java project.

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

1. Switch to the newly created *queues-howto-v12* directory.

   ```console
   cd queues-howto-v12
   ```

### Install the package

Open the *pom.xml* file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-storage-queue</artifactId>
  <version>12.6.0</version>
</dependency>
```

# [Java v8](#tab/java8)

First, verify your development system meets the prerequisites listed in the [Azure Storage SDK for Java v8](https://github.com/azure/azure-storage-java). Follow the instructions for downloading and installing the Azure Storage Libraries for Java. Then you can create a Java application using the examples in this article.

---

## Configure your application to access queue storage

Add the following import statements to the top of the Java file where you want to use Azure storage APIs to access queues:

# [Java v12](#tab/java)

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_ImportStatements":::

# [Java v8](#tab/java8)

```java
// Include the following imports to use queue APIs.
import com.microsoft.azure.storage.*;
import com.microsoft.azure.storage.queue.*;
```

---

## Set up an Azure storage connection string

An Azure storage client uses a storage connection string for accessing data management services. Get the name and the Primary access key for your storage account listed in the [Azure portal](https://portal.azure.com). Use them as the *AccountName* and *AccountKey* values in the connection string. This example shows how you can declare a static field to hold the connection string:

# [Java v12](#tab/java)

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_ConnectionString":::

# [Java v8](#tab/java8)

```java
// Define the connection-string with your values.
final String storageConnectionString =
    "DefaultEndpointsProtocol=https;" +
    "AccountName=your_storage_account;" +
    "AccountKey=your_storage_account_key";
```
You can store this string in the service config file called *ServiceConfiguration.cscfg*. For an app running within a  Microsoft Azure role, access the connection string by calling **RoleEnvironment.getConfigurationSettings**. Here's an example of getting the connection string from a **Setting** element named *StorageConnectionString*:

```java
// Retrieve storage account from connection-string.
String storageConnectionString =
    RoleEnvironment.getConfigurationSettings().get("StorageConnectionString");
```

---

The following samples assume that you have a **String** object containing the storage connection string.

## How to: Create a queue

# [Java v12](#tab/java)

A **QueueClient** object contains the operations for interacting with a queue. The following code creates a **QueueClient** object. Use the **QueueClient** object to create the queue you want to use.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_CreateQueue":::

# [Java v8](#tab/java8)

A **CloudQueueClient** object lets you get reference objects for queues. The following code creates a **CloudQueueClient** object. (Note: There are additional ways to create **CloudStorageAccount** objects; for more information, see **CloudStorageAccount** in the [Azure Storage Client SDK Reference].)

Use the **CloudQueueClient** object to get a reference to the queue you want to use. You can create the queue if it doesn't exist.

```java
try
{
    // Retrieve storage account from connection-string.
    CloudStorageAccount storageAccount =
       CloudStorageAccount.parse(storageConnectionString);

   // Create the queue client.
   CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

   // Retrieve a reference to a queue.
   CloudQueue queue = queueClient.getQueueReference("myqueue");

   // Create the queue if it doesn't already exist.
   queue.createIfNotExists();
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

---

## How to: Add a message to a queue

# [Java v12](#tab/java)

To insert a message into an existing queue, call the **sendMessage** method. A message can be either a string (in UTF-8 format) or a byte array. Here is code that sends a string message into the queue.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_AddMessage":::

# [Java v8](#tab/java8)

To insert a message into an existing queue, first create a new **CloudQueueMessage**. Next, call the **addMessage** method. A **CloudQueueMessage** can be created from either a string (in UTF-8 format) or a byte array. Here is code that creates a queue (if it doesn't exist) and inserts the message "Hello, World".

```java
try
{
    // Retrieve storage account from connection-string.
    CloudStorageAccount storageAccount =
       CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Create the queue if it doesn't already exist.
    queue.createIfNotExists();

    // Create a message and add it to the queue.
    CloudQueueMessage message = new CloudQueueMessage("Hello, World");
    queue.addMessage(message);
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

---

## How to: Peek at the next message

You can peek at the message in the front of a queue without removing it from the queue by calling **peekMessage**.

# [Java v12](#tab/java)

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_PeekMessage":::

# [Java v8](#tab/java8)

```java
try
{
    // Retrieve storage account from connection-string.
    CloudStorageAccount storageAccount =
       CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Peek at the next message.
    CloudQueueMessage peekedMessage = queue.peekMessage();

    // Output the message value.
    if (peekedMessage != null)
    {
      System.out.println(peekedMessage.getMessageContentAsString());
   }
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

---

## How to: Change the contents of a queued message

You can change the contents of a message in-place in the queue. If the message represents a work task, you could use this feature to update the status. The following code updates a queue message with new contents and sets the visibility timeout to extend another 30 seconds. Extending the visibility timeout gives the client another 30 seconds to continue working on the message. You could keep a retry count, as well. If the message is retried more than *n* times, you would delete it. This scenario protects against a message that triggers an application error each time it's processed.

# [Java v12](#tab/java)

The following code sample searches through the queue of messages, locates the first message content that matches a search string, modifies the message content, and exits.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_UpdateSearchMessage":::

# [Java v8](#tab/java8)

The following code sample searches through the queue of messages, locates the first message content that matches "Hello, World", modifies the message content, and exits.

```java
try
{
    // Retrieve storage account from connection-string.
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // The maximum number of messages that can be retrieved is 32.
    final int MAX_NUMBER_OF_MESSAGES_TO_PEEK = 32;

    // Loop through the messages in the queue.
    for (CloudQueueMessage message : queue.retrieveMessages(MAX_NUMBER_OF_MESSAGES_TO_PEEK,1,null,null))
    {
        // Check for a specific string.
        if (message.getMessageContentAsString().equals("Hello, World"))
        {
            // Modify the content of the first matching message.
            message.setMessageContent("Updated contents.");
            // Set it to be visible in 30 seconds.
            EnumSet<MessageUpdateFields> updateFields =
                EnumSet.of(MessageUpdateFields.CONTENT,
                MessageUpdateFields.VISIBILITY);
            // Update the message.
            queue.updateMessage(message, 30, updateFields, null, null);
            break;
        }
    }
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

---

The following code sample updates just the first visible message in the queue.

# [Java v12](#tab/java)

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_UpdateFirstMessage":::

# [Java v8](#tab/java8)

```java
try
{
    // Retrieve storage account from connection-string.
    CloudStorageAccount storageAccount =
       CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Retrieve the first visible message in the queue.
    CloudQueueMessage message = queue.retrieveMessage();

    if (message != null)
    {
        // Modify the message content.
        message.setMessageContent("Updated contents.");
        // Set it to be visible in 60 seconds.
        EnumSet<MessageUpdateFields> updateFields =
            EnumSet.of(MessageUpdateFields.CONTENT,
            MessageUpdateFields.VISIBILITY);
        // Update the message.
        queue.updateMessage(message, 60, updateFields, null, null);
    }
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

---

## How to: Get the queue length

You can get an estimate of the number of messages in a queue.

# [Java v12](#tab/java)

The **getProperties** method asks the Queue service for several current values. One of the values is a count of how many messages are in a queue. The count is only approximate because messages can be added or removed after your request. The **getApproximateMessageCount** method returns the last value retrieved by the call to **getProperties**, without calling the Queue service.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_GetQueueLength":::

# [Java v8](#tab/java8)

The **downloadAttributes** method asks the Queue service for several current values. One of the values is a count of how many messages are in a queue. The count is only approximate because messages can be added or removed after your request. The **getApproximateMessageCount** method returns the last value retrieved by the call to **downloadAttributes**, without calling the Queue service.

```java
try
{
    // Retrieve storage account from connection-string.
    CloudStorageAccount storageAccount =
       CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.getQueueReference("myqueue");

   // Download the approximate message count from the server.
    queue.downloadAttributes();

    // Retrieve the newly cached approximate message count.
    long cachedMessageCount = queue.getApproximateMessageCount();

    // Display the queue length.
    System.out.println(String.format("Queue length: %d", cachedMessageCount));
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

---

## How to: Dequeue the next message

# [Java v12](#tab/java)

Your code dequeues a message from a queue in two steps. When you call **receiveMessage**, you get the next message in a queue. A message returned from **receiveMessage** becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call **deleteMessage**. If your code fails to process a message, this two-step process ensures that you can get the same message and try again. Your code calls **deleteMessage** right after the message has been processed.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_DequeueMessage":::

# [Java v8](#tab/java8)

Your code dequeues a message from a queue in two steps. When you call **retrieveMessage**, you get the next message in a queue. A message returned from **retrieveMessage** becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call **deleteMessage**. If your code fails to process a message, this two-step process ensures that you can get the same message and try again. Your code calls **deleteMessage** right after the message has been processed.

```java
try
{
    // Retrieve storage account from connection-string.
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Retrieve the first visible message in the queue.
    CloudQueueMessage retrievedMessage = queue.retrieveMessage();

    if (retrievedMessage != null)
    {
        // Process the message in less than 30 seconds, and then delete the message.
        queue.deleteMessage(retrievedMessage);
    }
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

---

## Additional options for dequeuing messages

There are two ways to customize message retrieval from a queue. First, get a batch of messages (up to 32). Second, set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message.

# [Java v12](#tab/java)

The following code example uses the **receiveMessages** method to get 20 messages in one call. Then it processes each message using a **for** loop. It also sets the invisibility timeout to five minutes (300 seconds) for each message. The timeout starts for all messages at the same time. When five minutes have passed since the call to **receiveMessages**, any messages not deleted will become visible again.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_DequeueMessages":::

# [Java v8](#tab/java8)

The following code example uses the **retrieveMessages** method to get 20 messages in one call. Then it processes each message using a **for** loop. It also sets the invisibility timeout to five minutes (300 seconds) for each message. The timeout starts for all messages at the same time. When five minutes have passed since the call to **retrieveMessages**, any messages not deleted will become visible again.

```java
try
{
    // Retrieve storage account from connection-string.
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Retrieve 20 messages from the queue with a visibility timeout of 300 seconds.
    for (CloudQueueMessage message : queue.retrieveMessages(20, 300, null, null)) {
        // Do processing for all messages in less than 5 minutes,
        // deleting each message after processing.
        queue.deleteMessage(message);
    }
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

---

## How to: List the queues

# [Java v12](#tab/java)

To obtain a list of the current queues, call the **QueueServiceClient.listQueues()** method, which will return a collection of **QueueItem** objects.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_ListQueues":::

# [Java v8](#tab/java8)

To obtain a list of the current queues, call the **CloudQueueClient.listQueues()** method, which will return a collection of **CloudQueue** objects.

```java
try
{
    // Retrieve storage account from connection-string.
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client.
    CloudQueueClient queueClient =
        storageAccount.createCloudQueueClient();

    // Loop through the collection of queues.
    for (CloudQueue queue : queueClient.listQueues())
    {
        // Output each queue name.
        System.out.println(queue.getName());
    }
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

---

## How to: Delete a queue

# [Java v12](#tab/java)

To delete a queue and all the messages contained in it, call the **delete** method on the **QueueClient** object.

:::code language="java" source="~/azure-storage-snippets/queues/howto/java/java-v12/src/main/java/com/queues/howto/App.java" id="Snippet_DeleteMessageQueue":::

# [Java v8](#tab/java8)

To delete a queue and all the messages contained in it, call the **deleteIfExists** method on the **CloudQueue** object.

```java
try
{
    // Retrieve storage account from connection-string.
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Delete the queue if it exists.
    queue.deleteIfExists();
}
catch (Exception e)
{
    // Output the stack trace.
    e.printStackTrace();
}
```

---

[!INCLUDE [storage-check-out-samples-java](../../../includes/storage-check-out-samples-java.md)]

## Next steps

Now that you've learned the basics of queue storage, follow these links to learn about more complex storage tasks.

* [Azure Storage SDK for Java][Azure Storage SDK for Java]
* [Azure Storage Client SDK Reference][Azure Storage Client SDK Reference]
* [Azure Storage Services REST API][Azure Storage Services REST API]
* [Azure Storage Team Blog][Azure Storage Team Blog]

[Azure SDK for Java]: https://github.com/azure/azure-sdk-for-java
[Azure Storage SDK for Java]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage
[Azure Storage Client SDK Reference]: https://azure.github.io/azure-sdk-for-java/storage.html
[Azure Storage Services REST API]: /rest/api/storageservices/
[Azure Storage Team Blog]: https://techcommunity.microsoft.com/t5/azure-storage/bg-p/AzureStorageBlog
