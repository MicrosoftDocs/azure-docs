# How to Use the Queue Storage Service from PHP

This guide will show you how to perform common scenarios using the Windows Azure Queue storage service. The samples are written using classes from the Windows SDK for PHP. The scenarios covered include **inserting**, **peeking**, **getting**, and **deleting** queue messages, as well as **creating and deleting queues**. For more information on queues, see the [Next Steps](#NextSteps) section.

##What is Queue Storage

	(TODO: Reference appropriate content "chunk".)

##Table of Contents

* [Concepts](#concepts)
* [Create a Windows Azure Storage Account](#create-account)
* [Create a PHP Application](#create-app)
* [Configure Your Application to Access Queue Storage](#configure-app)
* [Setup a Windows Azure Storage Connection String](#connection-string)
* [How to Create a Queue](#create-queue)
* [How to Add a Message to a Queue](#add-message)
* [How to Peek at the Next Message](#peek-message)
* [How to De-queue the Next Message](#dequeue-message)
* [How to Change the Contents of a Queued Message](#change-message)
* [Additional Options for De-queuing Messages](#additional-options)
* [How To: Get Queue Length](#get-queue-length)
* [How To: Delete a Queue](#delete-queue)
* [Next Steps](#next-steps)

<h2 id="concepts">Concepts</h2>

	(TODO: Reference appropriate content "chunk".)

<h2 id="create-account">Create a Windows Azure Storage Account</h2>

	(TODO: Reference appropriate content "chunk".)

<h2 id="create-app">Create a PHP Application</h2>

The only requirement for creating a PHP application that accesses the Windows Azure Queue storage service is the referencing of classes from the Windows Azure SDK for PHP from within your code. You can use any development tools to create your application, including Notepad.

In this guide, you will use storage features which can be called within a PHP application locally, or in code running within a Windows Azure web role, worker role, or web site. We assume you have downloaded and installed PHP, followed the instructions in [Download the Windows Azure SDK for PHP] [download], and have created a Windows Azure storage account in your Windows Azure subscription.


<h2 id="configure-app">Configure your Application to Access Queue Storage</h2>

To use the Windows Azure storage APIs to access queues, you need to:

1. Reference the `Autoload.php` file (from the Windows Azure SDK for PHP) using the [require_once] [require_once] statement, and
2. Reference any classes you might use.

The following example shows how to include the `Autoload.php` file and references some of the classes you might use with the Queue API:

	require_once 'Autoload.php';
	
	use WindowsAzure\Core\Configuration;
	use WindowsAzure\Services\Core\Models\ServiceProperties;
	use WindowsAzure\Services\Queue\QueueRestProxy;
	use WindowsAzure\Services\Queue\QueueService;
	use WindowsAzure\Services\Queue\QueueSettings;
	use WindowsAzure\Services\Queue\Models\ListQueuesOptions;
	use WindowsAzure\Services\Queue\Models\ListQueuesResult;
	use WindowsAzure\Services\Queue\Models\CreateQueueOptions;
	use WindowsAzure\Services\Queue\Models\GetQueueMetadataResult;
	use WindowsAzure\Services\Queue\Models\ListMessagesResult;
	use WindowsAzure\Services\Queue\Models\ListMessagesOptions;
	use WindowsAzure\Services\Queue\Models\PeekMessagesResult;
	use WindowsAzure\Services\Queue\Models\PeekMessagesOptions;
	use WindowsAzure\Services\Queue\Models\UpdateMessageResult;
	use WindowsAzure\Services\Queue\Models\QueueServiceOptions;

In the examples below, the `require_once` statement will be shown always, but only the classes necessary for the example to execute will be referenced.

<h2 id="connection-string">Setup a Windows Azure Storage Connection</h2>

A Windows Azure Queue storage client uses a **Configuration** object for storing connection string information. After creating a new **Configuration** object, you must set properties for the name of your storage account, the primary access key, and the queue URI for the storage account listed in the Management Portal. This example shows how you can create a new configuration object and set these properties:

	require_once 'Autoload.php';

	use WindowsAzure\Core\Configuration;
	use WindowsAzure\Services\Queue\QueueSettings;
	
	$storage_account_name = "your_storage_account_name";
	$storage_account_key = "your_storage_account_key";
	$storage_account_URI = "http://your_storage_account_name.queue.core.windows.net"
	
	$config = new Configuration();
	$config->setProperty(QueueSettings::ACCOUNT_NAME, $storage_account_name);
	$config->setProperty(QueueSettings::ACCOUNT_KEY, $storgae_account_key);
	$config->setProperty(QueueSettings::URI, $storage_account_URI);

You will pass this `Configuration` instance (`$config`) to other objects when using the Queue API.

<h2 id="create-queue">How to Create a Queue</h2>

A **QueueService** object lets you create a queue with the **createQueue** method. When creating a queue, you can set options on the queue, but doing so is not required. (The example below shows how to set metadata on a queue.)

	require_once 'Autoload.php';

	use WindowsAzure\Services\Queue\QueueService;
	use WindowsAzure\Services\Queue\Models\CreateQueueOptions;
	
	// Create queue service proxy.
	$queue_proxy = QueueService::create($config);
	
	// OPTIONAL: Set queue metadata.
	$createQueueOptions = new CreateQueueOptions();
	$createQueueOptions->addMetaData("key1", "value1");
	$createQueueOptions->addMetaData("key2", "value2");
	
	try	{
		// Create queue.
		$queue_proxy->createQueue("myqueue", $createQueueOptions);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}


<h2 id="add-message">How to Add a Message to a Queue</h2>

To add a message to a queue, use you call **QueueService->createMessage**. The method takes the queue name, the message text, and message options (which are optional).

	require_once 'Autoload.php';

	use WindowsAzure\Services\Queue\QueueService;
	use WindowsAzure\Services\Queue\Models\CreateMessageOptions;

	// Create queue service proxy.
	$queue_proxy = QueueService::create($config);
	
	// OPTIONAL: Set message options.
	$message_options = new CreateMessageOptions();
	$message_options->setVisibilityTimeoutInSeconds(60); // Default is 0. Max value is 7 days.
	$message_options->setTimeToLiveInSeconds(3600); // Default and max value are 7 days.
	
	try	{
		// Create message.
		$queue_proxy->createMessage("myqueue", "Hello World!", $message_options);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2 id="peek-message">How to Peek at the Next Message</h2>

You can peek at a message (or messages) at the front of a queue without removing it from the queue by calling **QueueService->peekMessages**. By default, **peekMessage** method returns a single message, but you can change that value with the **PeekMessagesOptions->setNumberOfMessages** method.

	require_once 'Autoload.php';

	use WindowsAzure\Services\Queue\QueueService;
	use WindowsAzure\Services\Queue\Models\PeekMessagesResult;
	use WindowsAzure\Services\Queue\Models\PeekMessagesOptions;

	// Create queue service proxy.
	$queue_proxy = QueueService::create($config);
	
	// OPTIONAL: Set peek message options.
	$message_options = new PeekMessagesOptions();
	$message_options->setNumberOfMessages(1); // Default value is 1.
	
	try	{
		$peekMessagesResult = $queue_proxy->peekMessages("myqueue", $message_options); // Returns a PeekMessagesResult object
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}
	
	$messages = $peekMessagesResult->getQueueMessages(); // Array of AzureQueueMessage objects

	// View messages.
	$messageCount = count($messages);
	if($messageCount <= 0){
		echo "There are no messages.<br />";
	}
	else{
		foreach($messages as $message)	{
			echo "Peeked message:<br />";
			echo "Message ID: ".$message->getMessageId()."<br />";
			echo "Insertion date: ".date_format($message->getInsertionDate(), 'Y-m-d H:i:s')."<br />";
			echo "Message text: ".$message->getMessageText()."<br /><br />";
		}
	}

<h2 id="dequeue-message">How to De-queue the Next Message</h2>

Your code removes a message from a queue in two steps. First, you call **QueueService->listMessages**, which makes the message invisible to any other code reading from the queue. By default, this message will stay invisible for 30 seconds (if the code is not deleted in this time period, it will be put back on the queue). To finish removing the message from the queue, you must call **QueueService->deleteMessage**. This two-step process of removing a message assures that when your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls **deleteMessage** right after the message has been processed.

	require_once 'Autoload.php';

	use WindowsAzure\Services\Queue\QueueService;
	use WindowsAzure\Services\Queue\Models\ListMessageOptions;
	use WindowsAzure\Services\Queue\Models\QueueServiceOptions;

	// Create queue service proxy.
	$queue_proxy = QueueService::create($config);
	
	// OPTIONAL: Set List Message Options
	$options = new ListMessagesOptions();
	// Set options here.
	
	// Get message.
	$listMessagesResult = $queue_proxy->listMessages("myqueue", $options); // Returns a ListMessagesResult object
	$messages = $listMessagesResult->getQueueMessages(); // Array of AzureQueueMessage objects
	$message = $messages[0];
	
	/* ---------------------
		Process message.
	   --------------------- */
	
	// Get message ID and pop receipt.
	$messageId = $message->getMessageId();
	$popReceipt = $message->getPopReceipt();
	
	try	{
		// Delete message.
		$queue_proxy->deleteMessage("myqueue", $messageId, $popReceipt);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2 id="change-message">How to Change the Contents of a Queued Message</h2>

You can change the contents of a message in-place in the queue by calling **QueueService->updateMessage**. If the message represents a work task, you could use this feature to update the status of the work task. The following code updates the queue message with new contents, and sets the visibility timeout to extend another 60 seconds. This saves the state of work associated with the message, and gives the client another minute to continue working on the message. You could use this technique to track multi-step workflows on queue messages, without having to start over from the beginning if a processing step fails due to hardware or software failure. Typically, you would keep a retry count as well, and if the message is retried more than n times, you would delete it. This protects against a message that triggers an application error each time it is processed.

	require_once 'Autoload.php';

	use WindowsAzure\Services\Queue\QueueService;
	use WindowsAzure\Services\Queue\Models\ListMessagesOptions;
	use WindowsAzure\Services\Queue\Models\QueueServiceOptions;

	// Create queue service proxy.
	$queue_proxy = QueueService::create($config);
	
	// Get message.
	$listMessagesResult = $queue_proxy->listMessages("myqueue"); // Returns a ListMessagesResult object
	$messages = $listMessagesResult->getQueueMessages(); // Array of AzureQueueMessage objects
	$message = $messages[0];
	
	// Define new message properties.
	$new_message_text = "New message text.";
	$new_visibility_timeout = 5; // Measured in seconds.
	
	// Get message ID and pop receipt.
	$messageId = $message->getMessageId();
	$popReceipt = $message->getPopReceipt();
	
	try	{
		// Update message.
		$queue_proxy->updateMessage("myqueue", $messageId, $popReceipt, $new_message_text, $new_visibility_timeout);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2 id="additional-options">Additional Options for De-queuing Messages</h2>

There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message. The following code example uses the getMessages method to get 16 messages in one call. Then it processes each message using a **for** loop. It also sets the invisibility timeout to five minutes for each message.

	require_once 'Autoload.php';

	use WindowsAzure\Services\Queue\QueueService;
	use WindowsAzure\Services\Queue\Models\ListMessagesOptions;
	use WindowsAzure\Services\Queue\Models\QueueServiceOptions;

	// Create queue service proxy.
	$queue_proxy = QueueService::create($config);
	
	// Set list message options. 
	$message_options = new ListMessagesOptions();
	$message_options->setVisibilityTimeoutInSeconds(300); // Overrides the existing visibility timeout.
	$message_options->setNumberOfMessages(16); // The number of messages to retrieve.
	
	// Get messages.
	$listMessagesResult = $queue_proxy->listMessages("myqueue", $message_options); // Returns a ListMessagesResult object
	$messages = $listMessagesResult->getQueueMessages(); // Array of AzureQueueMessage objects

	foreach($messages as $message){
		
		/* ---------------------
			Process message.
		--------------------- */
	
		// Get message ID and pop receipt.
		$messageId = $message->getMessageId();
		$popReceipt = $message->getPopReceipt();
		
		// Delete message.
		$queue_proxy->deleteMessage("myqueue", $messageId, $popReceipt);	   
	}

<h2 id="get-queue-length">How To: Get Queue Length</h2>

You can get an estimate of the number of messages in a queue. The **QueueService->getQueueMetadata** method asks the queue service to return metadata about the queue. Calling the **getApproximateMessageCount** method on the returned object provides a count of how many messages are in a queue. The count is only approximate because messages can be added or removed after the queue service responds to your request.

	require_once 'Autoload.php';

	use WindowsAzure\Services\Queue\QueueService;

	// Create queue service proxy.
	$queue_proxy = QueueService::create($config);
	
	try	{
		// Get queue metadata.
		$queue_metadata = $queue_proxy->getQueueMetadata("myqueue"); // Returns a GetQueueMetadataResult object
		$approx_msg_count = $queue_metadata->getApproximateMessageCount();
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}
	
	echo $approx_msg_count;

<h2 id="delete-queue">How To: Delete a Queue</h2>

To delete a queue and all the messages contained in it, call the **QueueService->deleteQueue** method.

	require_once 'Autoload.php';

	use WindowsAzure\Services\Queue\QueueService;

	// Create queue service proxy.
	$queue_proxy = QueueService::create($config);
	
	try	{
		// Delete queue.
		$queue_proxy->deleteQueue("myqueue");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}


<h2 id="next-steps">Next Steps</h2>

Now that you’ve learned the basics of blob storage, follow these links to learn how to do more complex storage tasks.

- See the MSDN Reference: [Storing and Accessing Data in Windows Azure] []
- Visit the Windows Azure Storage Team Blog: <http://blogs.msdn.com/b/windowsazurestorage/>

[download]: http://this.link.doesnt.exist.yet
[require_once]: http://www.php.net/manual/en/function.require-once.php
[Windows Azure Management Portal]: http://windows.azure.com/
[Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx