<properties title="How to use the queue service (PHP) - Azure feature guide" pageTitle="How to use the queue service (PHP) | Microsoft Azure" metaKeywords="Azure Queue Service messaging PHP" description="Learn how to use the Azure Queue service to create and delete queues, and insert, get, and delete messages. Samples written in PHP." documentationCenter="PHP" services="storage" authors="tamram" manager="adinah" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="PHP" ms.topic="article" ms.date="11/24/2014" ms.author="tomfitz" />

# How to use the Queue service from PHP

This guide will show you how to perform common scenarios using the Azure Queue service. The samples are written using classes from the Windows SDK for PHP. The scenarios covered include **inserting**, **peeking**, **getting**, and **deleting** queue messages, as well as **creating and deleting queues**. For more information on queues, see the [Next Steps](#NextSteps) section.

##Table of contents

* [What is Queue Storage](#what-is)
* [Concepts](#concepts)
* [Create an Azure storage account](#create-account)
* [Create a PHP application](#create-app)
* [Configure your application to the Queue service](#configure-app)
* [Setup an Azure Storage connection](#connection-string)
* [How to: Create a queue](#create-queue)
* [How to: Add a message to a queue](#add-message)
* [How to: Peek at the next message](#peek-message)
* [How to: De-queue the next message](#dequeue-message)
* [How to: Change the contents of a queued message](#change-message)
* [Additional options for de-queuing messages](#additional-options)
* [How to: Get queue length](#get-queue-length)
* [How to: Delete a queue](#delete-queue)
* [Next steps](#next-steps)

[WACOM.INCLUDE [howto-queue-storage](../includes/howto-queue-storage.md)]

<h2><a id="create-account"></a>Create an Azure storage account</h2>

[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]

<h2><a id="create-app"></a>Create a PHP application</h2>

The only requirement for creating a PHP application that accesses the Azure Queue service is the referencing of classes from the Azure SDK for PHP from within your code. You can use any development tools to create your application, including Notepad.

In this guide, you will use Queue service features which can be called within a PHP application locally, or in code running within an Azure web role, worker role, or website.

<h2><a id="GetClientLibrary"></a>Get the Azure Client Libraries</h2>

[WACOM.INCLUDE [get-client-libraries](../includes/get-client-libraries.md)]

<h2><a id="configure-app"></a>Configure your application to access the Queue service</h2>

To use the Azure Queue service APIs, you need to:

1. Reference the autoloader file using the [require_once][require_once] statement, and
2. Reference any classes you might use.

The following example shows how to include the autoloader file and reference the **ServicesBuilder** class.

> [WACOM.NOTE]
> This example (and other examples in this article) assume you have installed the PHP Client Libraries for Azure via Composer. If you installed the libraries manually or as a PEAR package, you will need to reference the `WindowsAzure.php` autoloader file.

	require_once 'vendor\autoload.php';
	use WindowsAzure\Common\ServicesBuilder;


In the examples below, the `require_once` statement will be shown always, but only the classes necessary for the example to execute will be referenced.

<h2><a id="connection-string"></a>Setup an Azure storage connection</h2>

To instantiate an Azure Queue service client you must first have a valid connection string. The format for the queue service connection string is:

For accessing a live service:

	DefaultEndpointsProtocol=[http|https];AccountName=[yourAccount];AccountKey=[yourKey]

For accessing the emulator storage:

	UseDevelopmentStorage=true


To create any Azure service client you need to use the **ServicesBuilder** class. You can:

* pass the connection string directly to it or
* use the **CloudConfigurationManager (CCM)** to check multiple external sources for the connection string:
	* by default it comes with support for one external source - environmental variables
	* you can add new sources by extending the **ConnectionStringSource** class

For the examples outlined here, the connection string will be passed directly.

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;

	$queueRestProxy = ServicesBuilder::getInstance()->createQueueService($connectionString);


<h2><a id="create-queue"></a>How to: Create a queue</h2>

A **QueueRestProxy** object lets you create a queue with the **createQueue** method. When creating a queue, you can set options on the queue, but doing so is not required. (The example below shows how to set metadata on a queue.)

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;
	use WindowsAzure\Queue\Models\CreateQueueOptions;
	
	// Create queue REST proxy.
	$queueRestProxy = ServicesBuilder::getInstance()->createQueueService($connectionString);
	
	// OPTIONAL: Set queue metadata.
	$createQueueOptions = new CreateQueueOptions();
	$createQueueOptions->addMetaData("key1", "value1");
	$createQueueOptions->addMetaData("key2", "value2");
	
	try	{
		// Create queue.
		$queueRestProxy->createQueue("myqueue", $createQueueOptions);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

> [WACOM.NOTE]
> You should not rely on case sensitivity for metadata keys. All keys are read from the service in lowercase.


<h2><a id="add-message"></a>How to: Add a message to a queue</h2>

To add a message to a queue, use **QueueRestProxy->createMessage**. The method takes the queue name, the message text, and message options (which are optional).

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;
	use WindowsAzure\Queue\Models\CreateMessageOptions;

	// Create queue REST proxy.
	$queueRestProxy = ServicesBuilder::getInstance()->createQueueService($connectionString);
	
	try	{
		// Create message.
		$builder = new ServicesBuilder();
		$queueRestProxy->createMessage("myqueue", "Hello World!");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2><a id="peek-message"></a>How to: Peek at the next message</h2>

You can peek at a message (or messages) at the front of a queue without removing it from the queue by calling **QueueRestProxy->peekMessages**. By default, **peekMessage** method returns a single message, but you can change that value with the **PeekMessagesOptions->setNumberOfMessages** method.

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;
	use WindowsAzure\Queue\Models\PeekMessagesOptions;

	// Create queue REST proxy.
	$queueRestProxy = ServicesBuilder::getInstance()->createQueueService($connectionString);
	
	// OPTIONAL: Set peek message options.
	$message_options = new PeekMessagesOptions();
	$message_options->setNumberOfMessages(1); // Default value is 1.
	
	try	{
		$peekMessagesResult = $queueRestProxy->peekMessages("myqueue", $message_options);
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
			echo "Date: ".date_format($message->getInsertionDate(), 'Y-m-d')."<br />";
			echo "Message text: ".$message->getMessageText()."<br /><br />";
		}
	}

<h2><a id="dequeue-message"></a>How to: De-queue the next message</h2>

Your code removes a message from a queue in two steps. First, you call **QueueRestProxy->listMessages**, which makes the message invisible to any other code reading from the queue. By default, this message will stay invisible for 30 seconds (if the message is not deleted in this time period, it will become visible on the queue again). To finish removing the message from the queue, you must call **QueueRestProxy->deleteMessage**. This two-step process of removing a message assures that when your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls **deleteMessage** right after the message has been processed.

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;

	// Create queue REST proxy.
	$queueRestProxy = ServicesBuilder::getInstance()->createQueueService($connectionString);
	
	// Get message.
	$listMessagesResult = $queueRestProxy->listMessages("myqueue");
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
		$queueRestProxy->deleteMessage("myqueue", $messageId, $popReceipt);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2><a id="change-message"></a>How to: Change the contents of a queued message</h2>

You can change the contents of a message in-place in the queue by calling **QueueRestProxy->updateMessage**. If the message represents a work task, you could use this feature to update the status of the work task. The following code updates the queue message with new contents, and sets the visibility timeout to extend another 60 seconds. This saves the state of work associated with the message, and gives the client another minute to continue working on the message. You could use this technique to track multi-step workflows on queue messages, without having to start over from the beginning if a processing step fails due to hardware or software failure. Typically, you would keep a retry count as well, and if the message is retried more than n times, you would delete it. This protects against a message that triggers an application error each time it is processed.

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;	

	// Create queue REST proxy.
	$queueRestProxy = ServicesBuilder::getInstance()->createQueueService($connectionString);
	
	// Get message.
	$listMessagesResult = $queueRestProxy->listMessages("myqueue");
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
		$queueRestProxy->updateMessage("myqueue", 
									$messageId, 
									$popReceipt, 
									$new_message_text, 
									$new_visibility_timeout);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2><a id="additional-options"></a>Additional options for de-queuing messages</h2>

There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter visibility timeout, allowing your code more or less time to fully process each message. The following code example uses the **getMessages** method to get 16 messages in one call. Then it processes each message using a **for** loop. It also sets the invisibility timeout to five minutes for each message.

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;
	use WindowsAzure\Queue\Models\ListMessagesOptions;

	// Create queue REST proxy.
	$queueRestProxy = ServicesBuilder::getInstance()->createQueueService($connectionString);
	
	// Set list message options. 
	$message_options = new ListMessagesOptions();
	$message_options->setVisibilityTimeoutInSeconds(300); 
	$message_options->setNumberOfMessages(16);
	
	// Get messages.
	try{
		$listMessagesResult = $queueRestProxy->listMessages("myqueue", 
														 $message_options); 
		$messages = $listMessagesResult->getQueueMessages(); 

		foreach($messages as $message){
			
			/* ---------------------
				Process message.
			--------------------- */
		
			// Get message Id and pop receipt.
			$messageId = $message->getMessageId();
			$popReceipt = $message->getPopReceipt();
			
			// Delete message.
			$queueRestProxy->deleteMessage("myqueue", $messageId, $popReceipt);   
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

<h2><a id="get-queue-length"></a>How to: Get queue length</h2>

You can get an estimate of the number of messages in a queue. The **QueueRestProxy->getQueueMetadata** method asks the queue service to return metadata about the queue. Calling the **getApproximateMessageCount** method on the returned object provides a count of how many messages are in a queue. The count is only approximate because messages can be added or removed after the queue service responds to your request.

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;

	// Create queue REST proxy.
	$queueRestProxy = ServicesBuilder::getInstance()->createQueueService($connectionString);
	
	try	{
		// Get queue metadata.
		$queue_metadata = $queueRestProxy->getQueueMetadata("myqueue");
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

<h2><a id="delete-queue"></a>How to: Delete a queue</h2>

To delete a queue and all the messages contained in it, call the **QueueRestProxy->deleteQueue** method.

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use WindowsAzure\Common\ServiceException;

	// Create queue REST proxy.
	$queueRestProxy = ServicesBuilder::getInstance()->createQueueService($connectionString);
	
	try	{
		// Delete queue.
		$queueRestProxy->deleteQueue("myqueue");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179446.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}


<h2><a id="next-steps"></a>Next steps</h2>

Now that you've learned the basics of the Azure Queue service, follow these links to learn how to do more complex storage tasks.

- See the MSDN Reference: [Storing and Accessing Data in Azure] []
- Visit the Azure Storage Team Blog: <http://blogs.msdn.com/b/windowsazurestorage/>

[download]: http://go.microsoft.com/fwlink/?LinkID=252473
[require_once]: http://www.php.net/manual/en/function.require-once.php
[Azure Management Portal]: http://manage.windowsazure.com/
[Storing and Accessing Data in Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
