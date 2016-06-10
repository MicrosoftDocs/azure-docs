<properties 
	pageTitle="How to use Azure blob storage with the WebJobs SDK" 
	description="Learn how to use Azure blob storage with the WebJobs SDK. Trigger a process when a new blob appears in a container and handle 'poison blobs'." 
	services="app-service\web, storage" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="06/01/2016" 
	ms.author="tdykstra"/>

# How to use Azure blob storage with the WebJobs SDK

## Overview

This guide provides C# code samples that show how to trigger a process when an Azure blob is created or updated. The code samples use [WebJobs SDK](websites-dotnet-webjobs-sdk.md) version 1.x.

For code samples that show how to create blobs, see [How to use Azure queue storage with the WebJobs SDK](websites-dotnet-webjobs-sdk-storage-queues-how-to.md). 
		
The guide assumes you know [how to create a WebJob project in Visual Studio with connection strings that point to your storage account](websites-dotnet-webjobs-sdk-get-started.md) or to [multiple storage accounts](https://github.com/Azure/azure-webjobs-sdk/blob/master/test/Microsoft.Azure.WebJobs.Host.EndToEndTests/MultipleStorageAccountsEndToEndTests.cs).

## <a id="trigger"></a> How to trigger a function when a blob is created or updated

This section shows how to use the `BlobTrigger` attribute. 

> [AZURE.NOTE] The WebJobs SDK scans log files to watch for new or changed blobs. This process is not real-time; a function might not get triggered until several minutes or longer after the blob is created. In addition, [storage logs are created on a "best efforts"](https://msdn.microsoft.com/library/azure/hh343262.aspx) basis; there is no guarantee that all events will be captured. Under some conditions, logs might be missed. If the speed and reliability limitations of blob triggers are not acceptable for your application, the recommended method is to create a queue message when you create the blob, and use the [QueueTrigger](websites-dotnet-webjobs-sdk-storage-queues-how-to.md#trigger) attribute instead of the `BlobTrigger` attribute on the function that processes the blob.

### Single placeholder for blob name with extension  

The following code sample copies text blobs that appear in the *input* container to the *output* container:

		public static void CopyBlob([BlobTrigger("input/{name}")] TextReader input,
		    [Blob("output/{name}")] out string output)
		{
		    output = input.ReadToEnd();
		}

The attribute constructor takes a string parameter that specifies the container name and a placeholder for the blob name. In this example, if a blob named *Blob1.txt* is created in the *input* container, the function creates a blob named *Blob1.txt* in the *output* container. 

You can specify a name pattern with the blob name placeholder, as shown in the following code sample:

		public static void CopyBlob([BlobTrigger("input/original-{name}")] TextReader input,
		    [Blob("output/copy-{name}")] out string output)
		{
		    output = input.ReadToEnd();
		}

This code copies only blobs that have names beginning with "original-". For example, *original-Blob1.txt* in the *input* container is copied to *copy-Blob1.txt* in the *output* container.

If you need to specify a name pattern for blob names that have curly braces in the name, double the curly braces. For example, if you want to find blobs in the *images* container that have names like this:

		{20140101}-soundfile.mp3

use this for your pattern:

		images/{{20140101}}-{name}

In the example, the *name* placeholder value would be *soundfile.mp3*. 

### Separate blob name and extension placeholders

The following code sample changes the file extension as it copies blobs that appear in the *input* container to the *output* container. The code logs the extension of the *input* blob and sets the extension of the *output* blob to *.txt*.

		public static void CopyBlobToTxtFile([BlobTrigger("input/{name}.{ext}")] TextReader input,
		    [Blob("output/{name}.txt")] out string output,
		    string name,
		    string ext,
		    TextWriter logger)
		{
		    logger.WriteLine("Blob name:" + name);
		    logger.WriteLine("Blob extension:" + ext);
		    output = input.ReadToEnd();
		}

## <a id="types"></a> Types that you can bind to blobs

You can use the `BlobTrigger` attribute on the following types:

* `string`
* `TextReader`
* `Stream`
* `ICloudBlob`
* `CloudBlockBlob`
* `CloudPageBlob`
* `CloudBlobContainer`
* `CloudBlobDirectory`
* `IEnumerable<CloudBlockBlob>`
* `IEnumerable<CloudPageBlob>`
* Other types deserialized by [ICloudBlobStreamBinder](#icbsb) 

If you want to work directly with the Azure storage account, you can also add a `CloudStorageAccount` parameter to the method signature.

For examples, see the [blob binding code in the azure-webjobs-sdk repository on GitHub.com](https://github.com/Azure/azure-webjobs-sdk/blob/master/test/Microsoft.Azure.WebJobs.Host.EndToEndTests/BlobBindingEndToEndTests.cs).

## <a id="string"></a> Getting text blob content by binding to string

If text blobs are expected, `BlobTrigger` can be applied to a `string` parameter. The following code sample binds a text blob to a `string` parameter named `logMessage`. The function uses that parameter to write the contents of the blob to the WebJobs SDK dashboard. 
 
		public static void WriteLog([BlobTrigger("input/{name}")] string logMessage,
		    string name, 
		    TextWriter logger)
		{
		     logger.WriteLine("Blob name: {0}", name);
		     logger.WriteLine("Content:");
		     logger.WriteLine(logMessage);
		}

## <a id="icbsb"></a> Getting serialized blob content by using ICloudBlobStreamBinder

The following code sample uses a class that implements `ICloudBlobStreamBinder` to enable the `BlobTrigger` attribute to bind a blob to the `WebImage` type.

		public static void WaterMark(
		    [BlobTrigger("images3/{name}")] WebImage input,
		    [Blob("images3-watermarked/{name}")] out WebImage output)
		{
		    output = input.AddTextWatermark("WebJobs SDK", 
		        horizontalAlign: "Center", verticalAlign: "Middle",
		        fontSize: 48, opacity: 50);
		}
		public static void Resize(
		    [BlobTrigger("images3-watermarked/{name}")] WebImage input,
		    [Blob("images3-resized/{name}")] out WebImage output)
		{
		    var width = 180;
		    var height = Convert.ToInt32(input.Height * 180 / input.Width);
		    output = input.Resize(width, height);
		}

The `WebImage` binding code is provided in a `WebImageBinder` class that derives from `ICloudBlobStreamBinder`.

		public class WebImageBinder : ICloudBlobStreamBinder<WebImage>
		{
		    public Task<WebImage> ReadFromStreamAsync(Stream input, 
		        System.Threading.CancellationToken cancellationToken)
		    {
		        return Task.FromResult<WebImage>(new WebImage(input));
		    }
		    public Task WriteToStreamAsync(WebImage value, Stream output,
		        System.Threading.CancellationToken cancellationToken)
		    {
		        var bytes = value.GetBytes();
		        return output.WriteAsync(bytes, 0, bytes.Length, cancellationToken);
		    }
		}

## Getting the blob path for the triggering blob

To get the container name and blob name of the blob that has triggered the function, include a `blobTrigger` string parameter in the function signature.

		public static void WriteLog([BlobTrigger("input/{name}")] string logMessage,
		    string name,
		    string blobTrigger,
		    TextWriter logger)
		{
		     logger.WriteLine("Full blob path: {0}", blobTrigger);
		     logger.WriteLine("Content:");
		     logger.WriteLine(logMessage);
		}


## <a id="poison"></a> How to handle poison blobs

When a `BlobTrigger` function fails, the SDK calls it again, in case the failure was caused by a transient error. If the failure is caused by the content of the blob, the function fails every time it tries to process the blob. By default, the SDK calls a function up to 5 times for a given blob. If the fifth try fails, the SDK adds a message to a queue named *webjobs-blobtrigger-poison*.

The maximum number of retries is configurable. The same [MaxDequeueCount](websites-dotnet-webjobs-sdk-storage-queues-how-to.md#configqueue) setting is used for poison blob handling and poison queue message handling. 

The queue message for poison blobs is a JSON object that contains the following properties:

* FunctionId (in the format *{WebJob name}*.Functions.*{Function name}*, for example: WebJob1.Functions.CopyBlob)
* BlobType ("BlockBlob" or "PageBlob")
* ContainerName
* BlobName
* ETag (a blob version identifier, for example: "0x8D1DC6E70A277EF")

In the following code sample, the `CopyBlob` function has code that causes it to fail every time it's called. After the SDK calls it for the maximum number of retries, a message is created on the poison blob queue, and that message is processed by the `LogPoisonBlob` function. 

		public static void CopyBlob([BlobTrigger("input/{name}")] TextReader input,
		    [Blob("textblobs/output-{name}")] out string output)
		{
		    throw new Exception("Exception for testing poison blob handling");
		    output = input.ReadToEnd();
		}
		
		public static void LogPoisonBlob(
		[QueueTrigger("webjobs-blobtrigger-poison")] PoisonBlobMessage message,
		    TextWriter logger)
		{
		    logger.WriteLine("FunctionId: {0}", message.FunctionId);
		    logger.WriteLine("BlobType: {0}", message.BlobType);
		    logger.WriteLine("ContainerName: {0}", message.ContainerName);
		    logger.WriteLine("BlobName: {0}", message.BlobName);
		    logger.WriteLine("ETag: {0}", message.ETag);
		}

The SDK automatically deserializes the JSON message. Here is the `PoisonBlobMessage` class: 

		public class PoisonBlobMessage
		{
		    public string FunctionId { get; set; }
		    public string BlobType { get; set; }
		    public string ContainerName { get; set; }
		    public string BlobName { get; set; }
		    public string ETag { get; set; }
		}

### <a id="polling"></a> Blob polling algorithm

The WebJobs SDK scans all containers specified by `BlobTrigger` attributes at application start. In a large storage account this scan can take some time, so it might be a while before new blobs are found and `BlobTrigger` functions are executed.

To detect new or changed blobs after application start, the SDK periodically reads from the blob storage logs. The blob logs are buffered and only get physically written every 10 minutes or so, so there may be significant delay after a blob is created or updated before the corresponding `BlobTrigger` function executes. 

There is an exception for blobs that you create by using the `Blob` attribute. When the WebJobs SDK creates a new blob, it passes the new blob immediately to any matching `BlobTrigger` functions. Therefore if you have a chain of blob inputs and outputs, the SDK can process them efficiently. But if you want low latency running your blob processing functions for blobs that are created or updated by other means, we recommend using `QueueTrigger` rather than `BlobTrigger`.

### <a id="receipts"></a> Blob receipts

The WebJobs SDK makes sure that no `BlobTrigger` function gets called more than once for the same new or updated blob. It does this by maintaining *blob receipts* in order to determine if a given blob version has been processed.

Blob receipts are stored in a container named *azure-webjobs-hosts* in the Azure storage account specified by the AzureWebJobsStorage connection string. A blob receipt has the following  information:

* The function that was called for the blob ("*{WebJob name}*.Functions.*{Function name}*", for example: "WebJob1.Functions.CopyBlob")
* The container name
* The blob type ("BlockBlob" or "PageBlob")
* The blob name
* The ETag (a blob version identifier, for example: "0x8D1DC6E70A277EF")

If you want to force reprocessing of a blob, you can manually delete the blob receipt for that blob from the *azure-webjobs-hosts* container.

## <a id="queues"></a>Related topics covered by the queues article

For information about how to handle blob processing triggered by a queue message, or for WebJobs SDK scenarios not specific to blob processing, see [How to use Azure queue storage with the WebJobs SDK](websites-dotnet-webjobs-sdk-storage-queues-how-to.md). 

Related topics covered in that article include the following:

* Async functions
* Multiple instances
* Graceful shutdown
* Use WebJobs SDK attributes in the body of a function
* Set the SDK connection strings in code.
* Set values for WebJobs SDK constructor parameters in code
* Configure `MaxDequeueCount` for poison blob handling.
* Trigger a function manually
* Write logs

## <a id="nextsteps"></a> Next steps

This guide has provided code samples that show how to handle common scenarios for working with Azure blobs. For more information about how to use Azure WebJobs and the WebJobs SDK, see [Azure WebJobs Recommended Resources](http://go.microsoft.com/fwlink/?linkid=390226).
 
