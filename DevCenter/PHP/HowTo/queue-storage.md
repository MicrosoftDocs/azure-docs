# How to Use the Queue Service from PHP

This guide will show you how to perform common scenarios using the Windows Azure Queue service. The samples are written using classes from the Windows SDK for PHP. The scenarios covered include **inserting**, **peeking**, **getting**, and **deleting** queue messages, as well as **creating and deleting queues**. For more information on queues, see the [Next Steps](#NextSteps) section.

##What is Queue the Windows Azure Queue Service

	(TODO: Reference appropriate content "chunk".)

##Table of Contents

* [Concepts](#concepts)
* [Create a Windows Azure Storage Account](#create-account)
* [Create a PHP Application](#create-app)
* [Configure Your Application to the Queue Service](#configure-app)
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

The only requirement for creating a PHP application that accesses the Windows Azure Queue service is the referencing of classes from the Windows Azure SDK for PHP from within your code. You can use any development tools to create your application, including Notepad.

In this guide, you will use Queue service features which can be called within a PHP application locally, or in code running within a Windows Azure web role, worker role, or web site. We assume you have downloaded and installed PHP, followed the instructions in [Download the Windows Azure SDK for PHP] [download], and have created a Windows Azure storage account in your Windows Azure subscription.


<h2 id="configure-app">Configure your Application to Access the Queue Service</h2>

To use the Windows Azure Queue service APIs to access queues, you need to:

1. Reference the `WindowsAzure.php` file (from the Windows Azure SDK for PHP) using the [require_once] [require_once] statement, and
2. Reference any classes you might use.

The following example shows how to include the `WindowsAzure.php` file and reference the **QueueService** class:

	require_once 'WindowsAzure.php';

	use WindowsAzure\Queue\QueueService;
	
In the examples below, the `require_once` statement will be shown always, but only the classes necessary for the example to execute will be referenced.

<h2 id="connection-string">Setup a Windows Azure Storage Connection</h2>

A Windows Azure Queue service client uses a **Configuration** object for storing connection string information. After creating a new **Configuration** object, you must set properties for the name of your storage account, the access key, and the queue URI for the storage account listed in the Management Portal. The following example shows how you can create a new configuration object and set these properties. Note that the full URI (including `http://`) for your storage account must be used when setting the account URI.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Common\Configuration;
	use WindowsAzure\Queue\QueueSettings;
	
	$config = new Configuration();
	$config->setProperty(QueueSettings::ACCOUNT_NAME, "your_storage_account_name");
	$config->setProperty(QueueSettings::ACCOUNT_KEY, "your_storage_account_key");
	$config->setProperty(QueueSettings::URI, "http://your_storage_account_name.queue.core.windows.net");

You will pass this `Configuration` instance (`$config`) to other objects when using the Queue API.

<h2 id="create-queue">How to Create a Queue</h2>

A **QueueService** object lets you create a queue with the **createQueue** method. When creating a queue, you can set options on the queue, but doing so is not required. (The example below shows how to set metadata on a queue.)

	require_once 'WindowsAzure.php';

	use WindowsAzure\Queue\QueueService;
	use WindowsAzure\Queue\Models\CreateQueueOptions;
	use WindowsAzure\Common\Internal\ServiceException;
	
	// Create queue REST proxy.
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
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

**Note**: You should not rely on case sensetivity for metadata keys. All keys are read from the service in lowercase.

<h2 id="add-message">How to Add a Message to a Queue</h2>

To add a message to a queue, use **IQueue->createMessage**. The method takes the queue name, the message text, and message options (which are optional).

	require_once 'WindowsAzure.php';

	use WindowsAzure\Queue\QueueService;
	use WindowsAzure\Queue\Models\CreateMessageOptions;
	use WindowsAzure\Common\Internal\ServiceException;

	// Create queue REST proxy.
	$queue_proxy = QueueService::create($config);
	
	try	{
		// Create message.
		$queue_proxy->createMessage("myqueue", "Hello World!");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2 id="peek-message">How to Peek at the Next Message</h2>

You can peek at a message (or messages) at the front of a queue without removing it from the queue by calling **IQueue->peekMessages**. By default, **peekMessage** method returns a single message, but you can change that value with the **PeekMessagesOptions->setNumberOfMessages** method.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Queue\QueueService;
	use WindowsAzure\Queue\Models\PeekMessagesOptions;
	use WindowsAzure\Common\Internal\ServiceException;

	// Create queue REST proxy.
	$queue_proxy = QueueService::create($config);
	
	// OPTIONAL: Set peek message options.
	$message_options = new PeekMessagesOptions();
	$message_options->setNumberOfMessages(1); // Default value is 1.
	
	try	{
		$peekMessagesResult = $queue_proxy->peekMessages("myqueue", $message_options);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}
	
	$messages = $peekMessagesResult->getQueueMessages();

	// View messages.
	$messageCount = count($messages);
	if($messageCount <= 0){
		echo "There are no messages.<br />";
	}
	else{
		foreach($messages as $message)	{
			echo "Peeked message:<br />";
			echo "Message Id: ".$message->getMessageId()."<br />";
			echo "Insertion date: ".date_format($message->getInsertionDate(), 'Y-m-d H:i:s')."<br />";
			echo "Message text: ".$message->getMessageText()."<br /><br />";
		}
	}

<h2 id="dequeue-message">How to De-queue the Next Message</h2>

Your code removes a message from a queue in two steps. First, you call **IQueue->listMessages**, which makes the message invisible to any other code reading from the queue. By default, this message will stay invisible for 30 seconds (if the message is not deleted in this time period, it will become visible on the queue again). To finish removing the message from the queue, you must call **IQueue->deleteMessage**. This two-step process of removing a message assures that when your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls **deleteMessage** right after the message has been processed.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Queue\QueueService;
	use WindowsAzure\Common\Internal\ServiceException;

	// Create queue REST proxy.
	$queue_proxy = QueueService::create($config);
	
	// Get message.
	$listMessagesResult = $queue_proxy->listMessages("myqueue");
	$messages = $listMessagesResult->getQueueMessages();
	$message = $messages[0];
	
	/* ---------------------
		Process message.
	   --------------------- */
	
	// Get message Id and pop receipt.
	$messageId = $message->getMessageId();
	$popReceipt = $message->getPopReceipt();
	
	try	{
		// Delete message.
		$queue_proxy->deleteMessage("myqueue", $messageId, $popReceipt);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2 id="change-message">How to Change the Contents of a Queued Message</h2>

You can change the contents of a message in-place in the queue by calling **IQueue->updateMessage**. If the message represents a work task, you could use this feature to update the status of the work task. The following code updates the queue message with new contents, and sets the visibility timeout to extend another 60 seconds. This saves the state of work associated with the message, and gives the client another minute to continue working on the message. You could use this technique to track multi-step workflows on queue messages, without having to start over from the beginning if a processing step fails due to hardware or software failure. Typically, you would keep a retry count as well, and if the message is retried more than n times, you would delete it. This protects against a message that triggers an application error each time it is processed.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Queue\QueueService;
	use WindowsAzure\Common\Internal\ServiceException;	

	// Create queue REST proxy.
	$queue_proxy = QueueService::create($config);
	
	// Get message.
	$listMessagesResult = $queue_proxy->listMessages("myqueue");
	$messages = $listMessagesResult->getQueueMessages();
	$message = $messages[0];
	
	// Define new message properties.
	$new_message_text = "New message text.";
	$new_visibility_timeout = 5; // Measured in seconds. 
	
	// Get message Id and pop receipt.
	$messageId = $message->getMessageId();
	$popReceipt = $message->getPopReceipt();
	
	try	{
		// Update message.
		$queue_proxy->updateMessage("myqueue", $messageId, $popReceipt, $new_message_text, $new_visibility_timeout);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2 id="additional-options">Additional Options for De-queuing Messages</h2>

There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter visibility timeout, allowing your code more or less time to fully process each message. The following code example uses the **getMessages** method to get 16 messages in one call. Then it processes each message using a **for** loop. It also sets the invisibility timeout to five minutes for each message.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Queue\QueueService;
	use WindowsAzure\Queue\Models\ListMessagesOptions;
	use WindowsAzure\Common\Internal\ServiceException;

	// Create queue REST proxy.
	$queue_proxy = QueueService::create($config);
	
	// Set list message options. 
	$message_options = new ListMessagesOptions();
	$message_options->setVisibilityTimeoutInSeconds(300); 
	$message_options->setNumberOfMessages(16);
	
	// Get messages.
	try{
		$listMessagesResult = $queue_proxy->listMessages("myqueue", $message_options); 
		$messages = $listMessagesResult->getQueueMessages(); 

		foreach($messages as $message){
			
			/* ---------------------
				Process message.
			--------------------- */
		
			// Get message Id and pop receipt.
			$messageId = $message->getMessageId();
			$popReceipt = $message->getPopReceipt();
			
			// Delete message.
			$queue_proxy->deleteMessage("myqueue", $messageId, $popReceipt);   
		}
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2 id="get-queue-length">How To: Get Queue Length</h2>

You can get an estimate of the number of messages in a queue. The **IQueue->getQueueMetadata** method asks the queue service to return metadata about the queue. Calling the **getApproximateMessageCount** method on the returned object provides a count of how many messages are in a queue. The count is only approximate because messages can be added or removed after the queue service responds to your request.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Queue\QueueService;
	use WindowsAzure\Common\Internal\ServiceException;

	// Create queue REST proxy.
	$queue_proxy = QueueService::create($config);
	
	try	{
		// Get queue metadata.
		$queue_metadata = $queue_proxy->getQueueMetadata("myqueue");
		$approx_msg_count = $queue_metadata->getApproximateMessageCount();
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}
	
	echo $approx_msg_count;

<h2 id="delete-queue">How To: Delete a Queue</h2>

To delete a queue and all the messages contained in it, call the **IQueue->deleteQueue** method.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Queue\QueueService;
	use WindowsAzure\Common\Internal\ServiceException;

	// Create queue REST proxy.
	$queue_proxy = QueueService::create($config);
	
	try	{
		// Delete queue.
		$queue_proxy->deleteQueue("myqueue");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}


<h2 id="next-steps">Next Steps</h2>

Now that you’ve learned the basics of the Windows Azure Queue service, follow these links to learn how to do more complex storage tasks.

- See the MSDN Reference: [Storing and Accessing Data in Windows Azure] []
- Visit the Windows Azure Storage Team Blog: <http://blogs.msdn.com/b/windowsazurestorage/>

[download]: http://this.link.doesnt.exist.yet
[require_once]: http://www.php.net/manual/en/function.require-once.php
[Windows Azure Management Portal]: http://windows.azure.com/
[Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx