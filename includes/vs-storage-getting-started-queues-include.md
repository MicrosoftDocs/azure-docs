#####Create a Queue
A **CloudQueueClient** object lets you get reference objects for queues. The following code creates a **CloudQueueClient** object. All code in this topic uses a storage connection string stored in the Azure application's service configuration. There are also other ways to create a **CloudStorageAccount** object. See the [CloudStorageAccount](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.cloudstorageaccount_methods.aspx "CloudStorageAccount") documentation for details.

	// Create the queue client.
	CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

Use the **queueClient** object to get a reference to the queue you want to use. The code tries to reference a queue named “myqueue.” If it can’t find a queue with that name, it creates one.

	// Get a reference to a queue named “myqueue”.
	CloudQueue queue = queueClient.GetQueueReference("myqueue");

	// If the queue isn’t already there, then create it.
	queue.CreateIfNotExists();

**NOTE:** Use this code block in front of the code in the following sections.

#####Insert a Message into a Queue
To insert a message into an existing queue, first create a new **CloudQueueMessage** object. Next, call the AddMessage() method. A **CloudQueueMessage** object can be created from either a string (in UTF-8 format) or a byte array. Here is code which creates a queue (if it doesn't exist) and inserts the message 'Hello, World'.

	// Create a message and add it to the queue.
	CloudQueueMessage message = new CloudQueueMessage("Hello, World");
	queue.AddMessage(message);

#####Peek at the Next Message
You can peek at the message in the front of a queue without removing it from the queue by calling the PeekMessage() method.

	// Peek at the next message in the queue.
	CloudQueueMessage peekedMessage = queue.PeekMessage();

	// Display the message.
	Console.WriteLine(peekedMessage.AsString);

#####Remove the Next Message
Your code can remove (de-queue) a message from a queue in two steps. 


1. Call GetMessage() to get the next message in a queue. A message returned from GetMessage() becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. 
2.	To finish removing the message from the queue, call DeleteMessage(). 

This two-step process of removing a message assures that if your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. The following code calls DeleteMessage() right after the message has been processed.

	// Get the next message in the queue.
	CloudQueueMessage retrievedMessage = queue.GetMessage();

	// Process the message in less than 30 seconds, and then delete the message.
	queue.DeleteMessage(retrievedMessage);

[Learn more about Azure Storage](http://azure.microsoft.com/documentation/services/storage/)
See also [Browsing Storage Resources in Server Explorer](http://msdn.microsoft.com/library/azure/ff683677.aspx).