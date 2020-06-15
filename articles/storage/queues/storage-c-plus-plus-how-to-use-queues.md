---
title: How to use Queue storage (C++) - Azure Storage
description: Learn how to use the Queue storage service in Azure. Samples are written in C++.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 05/11/2017
ms.service: storage
ms.subservice: queues
ms.topic: how-to
ms.reviewer: cbrooks
---

# How to use Queue Storage from C++
[!INCLUDE [storage-selector-queue-include](../../../includes/storage-selector-queue-include.md)]

[!INCLUDE [storage-try-azure-tools-queues](../../../includes/storage-try-azure-tools-queues.md)]

## Overview
This guide will show you how to perform common scenarios using the Azure Queue storage service. The samples are written in C++ and use the [Azure Storage Client Library for C++](https://github.com/Azure/azure-storage-cpp/blob/master/README.md). The scenarios covered include **inserting**, **peeking**, **getting**, and **deleting** queue messages, as well as **creating and deleting queues**.

> [!NOTE]
> This guide targets the Azure Storage Client Library for C++ version 1.0.0 and above. The recommended version is Storage Client Library 2.2.0, which is available via [NuGet](https://www.nuget.org/packages/wastorage) or [GitHub](https://github.com/Azure/azure-storage-cpp/).
> 
> 

[!INCLUDE [storage-queue-concepts-include](../../../includes/storage-queue-concepts-include.md)]

[!INCLUDE [storage-create-account-include](../../../includes/storage-create-account-include.md)]

## Create a C++ application
In this guide, you will use storage features which can be run within a C++ application.

To do so, you will need to install the Azure Storage Client Library for C++ and create an Azure storage account in your Azure subscription.

To install the Azure Storage Client Library for C++, you can use the following methods:

* **Linux:** Follow the instructions given in the [Azure Storage Client Library for C++ README: Getting Started on Linux](https://github.com/Azure/azure-storage-cpp#getting-started-on-linux) page.
* **Windows:** On Windows, use [vcpkg](https://github.com/microsoft/vcpkg) as the dependency manager. Follow the [quick-start](https://github.com/microsoft/vcpkg#quick-start) to initialize vcpkg. Then, use the following command to install the library:

```powershell
.\vcpkg.exe install azure-storage-cpp
```

You can find a guide for how to build the source code and export to NuGet in the [README](https://github.com/Azure/azure-storage-cpp#download--install) file.

## Configure your application to access Queue Storage
Add the following include statements to the top of the C++ file where you want to use the Azure storage APIs to access queues:  

```cpp
#include <was/storage_account.h>
#include <was/queue.h>
```

## Set up an Azure storage connection string
An Azure storage client uses a storage connection string to store endpoints and credentials for accessing data management services. When running in a client application, you must provide the storage connection string in the following format, using the name of your storage account and the storage access key for the storage account listed in the [Azure Portal](https://portal.azure.com) for the *AccountName* and *AccountKey* values. For information on storage accounts and access keys, see [About Azure Storage Accounts](../common/storage-create-storage-account.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json). This example shows how you can declare a static field to hold the connection string:  

```cpp
// Define the connection-string with your values.
const utility::string_t storage_connection_string(U("DefaultEndpointsProtocol=https;AccountName=your_storage_account;AccountKey=your_storage_account_key"));
```

To test your application in your local Windows computer, you can use the Microsoft Azure [storage emulator](../common/storage-use-emulator.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json) that is installed with the [Azure SDK](https://azure.microsoft.com/downloads/). The storage emulator is a utility that simulates the Blob, Queue, and Table services available in Azure on your local development machine. The following example shows how you can declare a static field to hold the connection string to your local storage emulator:  

```cpp
// Define the connection-string with Azure Storage Emulator.
const utility::string_t storage_connection_string(U("UseDevelopmentStorage=true;"));  
```

To start the Azure storage emulator, select the **Start** button or press the **Windows** key. Begin typing **Azure Storage Emulator**, and select **Microsoft Azure Storage Emulator** from the list of applications.

The following samples assume that you have used one of these two methods to get the storage connection string.

## Retrieve your connection string
You can use the **cloud_storage_account** class to represent your Storage Account information. To retrieve your storage account information from the storage connection string, you can use the **parse** method.

```cpp
// Retrieve storage account from connection string.
azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);
```

## How to: Create a queue
A **cloud_queue_client** object lets you get reference objects for queues. The following code creates a **cloud_queue_client** object.

```cpp
// Retrieve storage account from connection string.
azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

// Create a queue client.
azure::storage::cloud_queue_client queue_client = storage_account.create_cloud_queue_client();
```

Use the **cloud_queue_client** object to get a reference to the queue you want to use. You can create the queue if it doesn't exist.

```cpp
// Retrieve a reference to a queue.
azure::storage::cloud_queue queue = queue_client.get_queue_reference(U("my-sample-queue"));

// Create the queue if it doesn't already exist.
 queue.create_if_not_exists();  
```

## How to: Insert a message into a queue
To insert a message into an existing queue, first create a new **cloud_queue_message**. Next, call the **add_message** method. A **cloud_queue_message** can be created from either a string or a **byte** array. Here is code which creates a queue (if it doesn't exist) and inserts the message 'Hello, World':

```cpp
// Retrieve storage account from connection-string.
azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

// Create the queue client.
azure::storage::cloud_queue_client queue_client = storage_account.create_cloud_queue_client();

// Retrieve a reference to a queue.
azure::storage::cloud_queue queue = queue_client.get_queue_reference(U("my-sample-queue"));

// Create the queue if it doesn't already exist.
queue.create_if_not_exists();

// Create a message and add it to the queue.
azure::storage::cloud_queue_message message1(U("Hello, World"));
queue.add_message(message1);  
```

## How to: Peek at the next message
You can peek at the message in the front of a queue without removing it from the queue by calling the **peek_message** method.

```cpp
// Retrieve storage account from connection-string.
azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

// Create the queue client.
azure::storage::cloud_queue_client queue_client = storage_account.create_cloud_queue_client();

// Retrieve a reference to a queue.
azure::storage::cloud_queue queue = queue_client.get_queue_reference(U("my-sample-queue"));

// Peek at the next message.
azure::storage::cloud_queue_message peeked_message = queue.peek_message();

// Output the message content.
std::wcout << U("Peeked message content: ") << peeked_message.content_as_string() << std::endl;
```

## How to: Change the contents of a queued message
You can change the contents of a message in-place in the queue. If the message represents a work task, you could use this feature to update the status of the work task. The following code updates the queue message with new contents, and sets the visibility timeout to extend another 60 seconds. This saves the state of work associated with the message, and gives the client another minute to continue working on the message. You could use this technique to track multi-step workflows on queue messages, without having to start over from the beginning if a processing step fails due to hardware or software failure. Typically, you would keep a retry count as well, and if the message is retried more than n times, you would delete it. This protects against a message that triggers an application error each time it is processed.

```cpp
// Retrieve storage account from connection-string.
azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

// Create the queue client.
azure::storage::cloud_queue_client queue_client = storage_account.create_cloud_queue_client();

// Retrieve a reference to a queue.
azure::storage::cloud_queue queue = queue_client.get_queue_reference(U("my-sample-queue"));

// Get the message from the queue and update the message contents.
// The visibility timeout "0" means make it visible immediately.
// The visibility timeout "60" means the client can get another minute to continue
// working on the message.
azure::storage::cloud_queue_message changed_message = queue.get_message();

changed_message.set_content(U("Changed message"));
queue.update_message(changed_message, std::chrono::seconds(60), true);

// Output the message content.
std::wcout << U("Changed message content: ") << changed_message.content_as_string() << std::endl;  
```

## How to: De-queue the next message
Your code de-queues a message from a queue in two steps. When you call **get_message**, you get the next message in a queue. A message returned from **get_message** becomes invisible to any other code reading messages from this queue. To finish removing the message from the queue, you must also call **delete_message**. This two-step process of removing a message assures that if your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls **delete_message** right after the message has been processed.

```cpp
// Retrieve storage account from connection-string.
azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

// Create the queue client.
azure::storage::cloud_queue_client queue_client = storage_account.create_cloud_queue_client();

// Retrieve a reference to a queue.
azure::storage::cloud_queue queue = queue_client.get_queue_reference(U("my-sample-queue"));

// Get the next message.
azure::storage::cloud_queue_message dequeued_message = queue.get_message();
std::wcout << U("Dequeued message: ") << dequeued_message.content_as_string() << std::endl;

// Delete the message.
queue.delete_message(dequeued_message);
```

## How to: Leverage additional options for de-queuing messages
There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message. The following code example uses the **get_messages** method to get 20 messages in one call. Then it processes each message using a **for** loop. It also sets the invisibility timeout to five minutes for each message. Note that the 5 minutes starts for all messages at the same time, so after 5 minutes have passed since the call to **get_messages**, any messages which have not been deleted will become visible again.

```cpp
// Retrieve storage account from connection-string.
azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

// Create the queue client.
azure::storage::cloud_queue_client queue_client = storage_account.create_cloud_queue_client();

// Retrieve a reference to a queue.
azure::storage::cloud_queue queue = queue_client.get_queue_reference(U("my-sample-queue"));

// Dequeue some queue messages (maximum 32 at a time) and set their visibility timeout to
// 5 minutes (300 seconds).
azure::storage::queue_request_options options;
azure::storage::operation_context context;

// Retrieve 20 messages from the queue with a visibility timeout of 300 seconds.
std::vector<azure::storage::cloud_queue_message> messages = queue.get_messages(20, std::chrono::seconds(300), options, context);

for (auto it = messages.cbegin(); it != messages.cend(); ++it)
{
    // Display the contents of the message.
    std::wcout << U("Get: ") << it->content_as_string() << std::endl;
}
```

## How to: Get the queue length
You can get an estimate of the number of messages in a queue. The **download_attributes** method asks the Queue service to retrieve the queue attributes, including the message count. The **approximate_message_count** method gets the approximate number of messages in the queue.

```cpp
// Retrieve storage account from connection-string.
azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

// Create the queue client.
azure::storage::cloud_queue_client queue_client = storage_account.create_cloud_queue_client();

// Retrieve a reference to a queue.
azure::storage::cloud_queue queue = queue_client.get_queue_reference(U("my-sample-queue"));

// Fetch the queue attributes.
queue.download_attributes();

// Retrieve the cached approximate message count.
int cachedMessageCount = queue.approximate_message_count();

// Display number of messages.
std::wcout << U("Number of messages in queue: ") << cachedMessageCount << std::endl;  
```

## How to: Delete a queue
To delete a queue and all the messages contained in it, call the **delete_queue_if_exists** method on the queue object.

```cpp
// Retrieve storage account from connection-string.
azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

// Create the queue client.
azure::storage::cloud_queue_client queue_client = storage_account.create_cloud_queue_client();

// Retrieve a reference to a queue.
azure::storage::cloud_queue queue = queue_client.get_queue_reference(U("my-sample-queue"));

// If the queue exists and delete it.
queue.delete_queue_if_exists();  
```

## Next steps
Now that you've learned the basics of Queue storage, follow these links to learn more about Azure Storage.

* [How to use Blob Storage from C++](../blobs/storage-c-plus-plus-how-to-use-blobs.md)
* [How to use Table Storage from C++](../../cosmos-db/table-storage-how-to-use-c-plus.md)
* [List Azure Storage Resources in C++](../common/storage-c-plus-plus-enumeration.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json)
* [Storage Client Library for C++ Reference](https://azure.github.io/azure-storage-cpp)
* [Azure Storage Documentation](https://azure.microsoft.com/documentation/services/storage/)
