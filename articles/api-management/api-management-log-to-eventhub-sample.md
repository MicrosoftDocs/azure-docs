<properties
    pageTitle="Monitor your APIs with Azure API Management, Event Hubs and Runscope"
    description="Sample application demonstrating the log-to-eventhub policy by connecting Azure API Management, Azure Event Hubs and Runscope for HTTP  logging and monitoring"
    services="api-management"
    documentationCenter=""
    authors="darrelmiller"
    manager=""
    editor=""/>

<tags
    ms.service="api-management"
    ms.workload="mobile"
    ms.tgt_pltfrm="na"
    ms.devlang="dotnet"
    ms.topic="article"
    ms.date="08/09/2016"
    ms.author="darrmi"/>

# Monitor your APIs with Azure API Management, Event Hubs and Runscope

The [API Management service](api-management-key-concepts.md) provides many capabilities to enhance the processing of HTTP requests sent to your HTTP API. However, the existence of the requests and responses are transient. The request is made and it flows through the API Management service to your backend API. Your API processes the request and a response flows back through to the API consumer. The API Management service keeps some important statistics about the APIs for display in the Publisher portal dashboard, but beyond that, the details are gone.

By using the [log-to-eventhub](https://msdn.microsoft.com/library/azure/dn894085.aspx#log-to-eventhub) [policy](api-management-howto-policies.md) in the API Management service you can send any details from the request and response to an [Azure Event Hub](../event-hubs/event-hubs-what-is-event-hubs.md). There are a variety of reasons why you may want to generate events from HTTP messages being sent to your APIs. Some examples include audit trail of updates, usage analytics, exception alerting and 3rd party integrations.   

This article demonstrates how to capture the entire HTTP request and response message, send it to an Event Hub and then relay that message to a third party service that provides HTTP logging and monitoring services.

## Why Send From API Management Service?
It is possible to write HTTP middleware that can plug into HTTP API frameworks to capture HTTP requests and responses and feed them into logging and monitoring systems. The downside to this approach is the HTTP middleware needs to be integrated into the backend API and must match the platform of the API. If there are multiple APIs then each one must deploy the middleware. Often there are reasons why backend APIs cannot be updated.

Using the Azure API Management service to integrate with logging infrastructure provides a centralized and platform-independent solution. It is also scalable, in part due to the [geo-replication](api-management-howto-deploy-multi-region.md) capabilities of Azure API Management.

## Why send to an Azure Event Hub?
It is a reasonable to ask, why create a policy that is specific to Azure Event Hubs? There are many different places where I might want to log my requests. Why not just send the requests directly to the final destination?  That is an option. However, when making logging requests from an API management service, it is necessary to consider how logging messages will impact the performance of the API. Gradual increases in load can be handled by increasing available instances of system components or by taking advantage of geo-replication. However, short spikes in traffic can cause requests to be significantly delayed if requests to logging infrastructure start to slow under load.

The Azure Event Hubs is designed to ingress huge volumes of data, with capacity for dealing with a far higher number of events than the number of HTTP requests most APIs process. The Event Hub acts as a kind of sophisticated buffer between your API management service and the infrastructure that will store and process the messages. This ensures that your API performance will not suffer due to the logging infrastructure.  

Once the data has been passed to an Event Hub it is persisted and will wait for Event Hub consumers to process it. The Event Hub does not care how it will be processed, it just cares about making sure the message will be successfully delivered.     

Event Hubs have the ability to stream events to multiple consumer groups. This allows events to be processed by completely different systems. This enables supporting many integration scenarios without putting addition delays on the processing of the API request within the API Management service as only one event needs to be generated.

## A policy to send application/http messages
An Event Hub accepts event data as a simple string. The contents of that string are completely up to you. To be able to package up an HTTP request and send it off to Event Hubs we need to format the string with the request or response information. In situations like this, if there is an existing format we can reuse, then we may not have to write our own parsing code. Initially I considered using the [HAR](http://www.softwareishard.com/blog/har-12-spec/) for sending HTTP requests and responses. However, this format is optimized for storing a sequence of HTTP requests in a JSON based format. It contained a number of mandatory elements that added unnecessary complexity for the scenario of passing the HTTP message over the wire.  

An alternative option was to use the `application/http` media type as described in the HTTP specification [RFC 7230](http://tools.ietf.org/html/rfc7230). This media type uses the exact same format that is used to actually send HTTP messages over the wire, but the entire message can be put in the body of another HTTP request. In our case we are just going to use the body as our message to send to Event Hubs. Conveniently, there is a parser that exists in [Microsoft ASP.NET Web API 2.2 Client](https://www.nuget.org/packages/Microsoft.AspNet.WebApi.Client/) libraries that can parse this format and convert it into the native `HttpRequestMessage` and `HttpResponseMessage` objects.

To be able to create this message we need to take advantage of C# based [Policy expressions](https://msdn.microsoft.com/library/azure/dn910913.aspx) in Azure API Management. Here is the policy which sends a HTTP request message to Azure Event Hubs.

       <log-to-eventhub logger-id="conferencelogger" partition-id="0">
       @{
           var requestLine = string.Format("{0} {1} HTTP/1.1\r\n",
                                                       context.Request.Method,
                                                       context.Request.Url.Path + context.Request.Url.QueryString);

           var body = context.Request.Body?.As<string>(true);
           if (body != null && body.Length > 1024)
           {
               body = body.Substring(0, 1024);
           }

           var headers = context.Request.Headers
                                  .Where(h => h.Key != "Authorization" && h.Key != "Ocp-Apim-Subscription-Key")
                                  .Select(h => string.Format("{0}: {1}", h.Key, String.Join(", ", h.Value)))
                                  .ToArray<string>();

           var headerString = (headers.Any()) ? string.Join("\r\n", headers) + "\r\n" : string.Empty;

           return "request:"   + context.Variables["message-id"] + "\n"
                               + requestLine + headerString + "\r\n" + body;
       }
       </log-to-eventhub>

### Policy declaration
There a few particular things worth mentioning about this policy expression. The log-to-eventhub policy has an attribute called logger-id which refers to the name of logger that has been created within the API Management service. The details of how to setup an Event Hub logger in the API Management service can be found in the document [How to log events to Azure Event Hubs in Azure API Management](api-management-howto-log-event-hubs.md). The second attribute is an optional parameter that instructs Event Hubs which partition to store the message in. Event Hubs use partitions to enable scalabilty and require a minimum of two. The ordered delivery of messages is only guaranteed within a partition. If we do not instruct Event Hub in which partition to place the message, it will use a round-robin algorithm to distribute the load. However, that may cause some of our messages to be processed out of order.  

### Partitions
To ensure our messages are delivered to consumers in order and take advantage of the load distribution capability of partitions, I chose to send HTTP request messages to one partition and HTTP response messages to a second partition. This will ensure an even load distribution and we can guarantee that all requests will be consumed in order and all responses will be consumed in order. It is possible for a response to be consumed before the corresponding request, but as that is not a problem as we have a different mechanism for correlating requests to responses and we know that requests always come before responses.

### HTTP payloads
After building the `requestLine` we check to see if the request body should be truncated. The request body is truncated to only 1024. This could be increased, however individual Event Hub messages are limited to 256KB, so it is likely that some HTTP message bodies will not fit in a single message. When doing logging and analytics a significant amount of information can be derived from just the HTTP request line and headers. Also, many API requests only return small bodies and so the loss of information value by truncating large bodies is fairly minimal in comparison to the reduction in transfer, processing and storage costs to keep all body contents. One final note about processing the body is that we need to pass `true` to the As<string>() method because we are reading the body contents, but was also want the backend API to be able to read the body. By passing true to this method we cause the body to be buffered so that it can be read a second time. This is important to be aware of if you have an API that does uploading of very large files or uses long polling. In these cases it would be best to avoid reading the body at all.   

### HTTP headers
HTTP Headers can be simply transferred over into the message format in a simple key/value pair format. We have chosen to strip out certain security sensitive fields, to avoid unnecessarily leaking credential information. It is unlikely that API keys and other credentials would be used for analytics purposes. If we wish to do analysis on the user and the particular product they are using then we could get that from the `context` object and add that to the message.     
### Message Metadata
When building the complete message to send to the event hub, the first line is not actually part of the `application/http` message. The first line is additional metadata consisting of whether the message is a request or response message and a message id which is used to correlate requests to responses. The message id is created by using another policy that looks like this:

    <set-variable name="message-id" value="@(Guid.NewGuid())" />

We could have created the request message, stored that in a variable until the response was returned and then simply sent the request and response as a single message. However, by sending the request and response independently and using a message id to correlate the two, we get a bit more flexibility in the message size, the ability to take advantage of multiple partitions whilst maintaining message order and the request will appear in our logging dashboard sooner. There also may be some scenarios where a valid response is never sent to the event hub, possibly due to a fatal request error in the API Management service, but we still will have a record of the request.

The policy to send the response HTTP message looks very similar to the request and so the complete policy configuration looks like this:

      <policies>
      	<inbound>
      		<set-variable name="message-id" value="@(Guid.NewGuid())" />
      		<log-to-eventhub logger-id="conferencelogger" partition-id="0">
              @{
                  var requestLine = string.Format("{0} {1} HTTP/1.1\r\n",
                                                              context.Request.Method,
                                                              context.Request.Url.Path + context.Request.Url.QueryString);

                  var body = context.Request.Body?.As<string>(true);
                  if (body != null && body.Length > 1024)
                  {
                      body = body.Substring(0, 1024);
                  }

                  var headers = context.Request.Headers
                                       .Where(h => h.Key != "Authorization" && h.Key != "Ocp-Apim-Subscription-Key")
                                       .Select(h => string.Format("{0}: {1}", h.Key, String.Join(", ", h.Value)))
                                       .ToArray<string>();

                  var headerString = (headers.Any()) ? string.Join("\r\n", headers) + "\r\n" : string.Empty;

                  return "request:"   + context.Variables["message-id"] + "\n"
                                      + requestLine + headerString + "\r\n" + body;
              }
          </log-to-eventhub>
      	</inbound>
      	<backend>
      		<forward-request follow-redirects="true" />
      	</backend>
      	<outbound>
      		<log-to-eventhub logger-id="conferencelogger" partition-id="1">
              @{
                  var statusLine = string.Format("HTTP/1.1 {0} {1}\r\n",
                                                      context.Response.StatusCode,
                                                      context.Response.StatusReason);

                  var body = context.Response.Body?.As<string>(true);
                  if (body != null && body.Length > 1024)
                  {
                      body = body.Substring(0, 1024);
                  }

                  var headers = context.Response.Headers
                                                  .Select(h => string.Format("{0}: {1}", h.Key, String.Join(", ", h.Value)))
                                                  .ToArray<string>();

                  var headerString = (headers.Any()) ? string.Join("\r\n", headers) + "\r\n" : string.Empty;

                  return "response:"  + context.Variables["message-id"] + "\n"
                                      + statusLine + headerString + "\r\n" + body;
             }
          </log-to-eventhub>
      	</outbound>
      </policies>

The `set-variable` policy creates a value that is accessible by both the `log-to-eventhub` policy in the `<inbound>` section and the `<outbound>` section.  

## Receiving events from Event Hubs
Events from Azure Event Hub are received using the [AMQP protocol](http://www.amqp.org/). The Microsoft Service Bus team have made client libraries available to make the consuming events easier. There are two different approaches supported, one is being a *Direct Consumer* and the other is using the `EventProcessorHost` class. Examples of these two approaches can be found in the [Event Hubs Programming Guide](../event-hubs/event-hubs-programming-guide.md). The short version of the differences is, `Direct Consumer` gives you complete control and the `EventProcessorHost` does some of the plumbing work for you but makes certain assumptions about how you will process those events.  

### EventProcessorHost
In this sample, we will use the `EventProcessorHost` for simplicity, however it may not the best choice for this particular scenario. `EventProcessorHost` does the hard work of making sure you don't have to worry about threading issues within a particular event processor class. However, in our scenario, we are simply converting the message to another format and passing it along to another service using an async method. There is no need for updating shared state and therefore no risk of threading issues. For most scenarios, `EventProcessorHost` is probably the best choice and it is certainly the easier option.     

### IEventProcessor
The central concept when using `EventProcessorHost` is to create a an implementation of the `IEventProcessor` interface which contains the method `ProcessEventAsync`. The essence of that method is shown here:

  async Task IEventProcessor.ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
      {

           foreach (EventData eventData in messages)
           {
               _Logger.LogInfo(string.Format("Event received from partition: {0} - {1}", context.Lease.PartitionId,eventData.PartitionKey));

               try
               {
                   var httpMessage = HttpMessage.Parse(eventData.GetBodyStream());
                   await _MessageContentProcessor.ProcessHttpMessage(httpMessage);
               }
               catch (Exception ex)
               {
                   _Logger.LogError(ex.Message);
               }
           }
            ... checkpointing code snipped ...
        }

A list of EventData objects are passed into the method and we iterate over that list. The bytes of each method are parsed into a HttpMessage object and that object is passed to an instance of IHttpMessageProcessor.

### HttpMessage
The `HttpMessage` instance contains three pieces of data:

      public class HttpMessage
       {
           public Guid MessageId { get; set; }
           public bool IsRequest { get; set; }
           public HttpRequestMessage HttpRequestMessage { get; set; }
           public HttpResponseMessage HttpResponseMessage { get; set; }

        ... parsing code snipped ...

      }

The `HttpMessage` instance contains a `MessageId` GUID that allows us to connect the HTTP request to the corresponding HTTP response and a boolean value that identifies if the object contains an instance of a HttpRequestMessage and HttpResponseMessage. By using the built in HTTP classes from `System.Net.Http`, I was able to take advantage of the `application/http` parsing code that is included in `System.Net.Http.Formatting`.  

### IHttpMessageProcessor
The `HttpMessage` instance is then forwarded to implementation of `IHttpMessageProcessor` which is an interface I created to decouple the receiving and interpretation of the event from Azure Event Hub and the actual processing of it.


## Forwarding the HTTP message
For this sample, I decided it would be interesting to push the HTTP Request over to [Runscope](http://www.runscope.com). Runscope is a cloud based service that specializes in HTTP debugging, logging and monitoring. They have a free tier, so it is easy to try and it allows us to see the HTTP requests in real-time flowing through our API Management service.

The `IHttpMessageProcessor` implementation looks like this,

      public class RunscopeHttpMessageProcessor : IHttpMessageProcessor
       {
           private HttpClient _HttpClient;
           private ILogger _Logger;
           private string _BucketKey;
           public RunscopeHttpMessageProcessor(HttpClient httpClient, ILogger logger)
           {
               _HttpClient = httpClient;
               var key = Environment.GetEnvironmentVariable("APIMEVENTS-RUNSCOPE-KEY", EnvironmentVariableTarget.User);
               _HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", key);
               _HttpClient.BaseAddress = new Uri("https://api.runscope.com");
               _BucketKey = Environment.GetEnvironmentVariable("APIMEVENTS-RUNSCOPE-BUCKET", EnvironmentVariableTarget.User);
               _Logger = logger;
           }

           public async Task ProcessHttpMessage(HttpMessage message)
           {
               var runscopeMessage = new RunscopeMessage()
               {
                   UniqueIdentifier = message.MessageId
               };

               if (message.IsRequest)
               {
                   _Logger.LogInfo("Sending HTTP request " + message.MessageId.ToString());
                   runscopeMessage.Request = await RunscopeRequest.CreateFromAsync(message.HttpRequestMessage);
               }
               else
               {
                   _Logger.LogInfo("Sending HTTP response " + message.MessageId.ToString());
                   runscopeMessage.Response = await RunscopeResponse.CreateFromAsync(message.HttpResponseMessage);
               }

               var messagesLink = new MessagesLink() { Method = HttpMethod.Post };
               messagesLink.BucketKey = _BucketKey;
               messagesLink.RunscopeMessage = runscopeMessage;
               var runscopeResponse = await _HttpClient.SendAsync(messagesLink.CreateRequest());
               _Logger.LogDebug("Request sent to Runscope");
           }
       }

I was able to take advantage of an [existing client library for Runscope](http://www.nuget.org/packages/Runscope.net.hapikit/0.9.0-alpha) that makes it easy to push `HttpRequestMessage` and `HttpResponseMessage` instances up into their service. In order to access the Runscope API you will need an account and an API Key. Instructions for getting an API key can be found in the [Creating Applications to Access Runscope API](http://blog.runscope.com/posts/creating-applications-to-access-the-runscope-api) screencast.

## Complete sample
The [source code](https://github.com/darrelmiller/ApimEventProcessor) and tests for the sample are on Github. You will need an [API Management Service](api-management-get-started.md), [a connected Event Hub](api-management-howto-log-event-hubs.md), and a [Storage Account](../storage/storage-create-storage-account.md) to run the sample for yourself.   

The sample is just a simple Console application that listens for events coming from Event Hub, converts them into a `HttpRequestMessage` and `HttpResponseMessage` objects and then forwards them on to the Runscope API.

In the following animated image, you can see a request being made to an API in the Developer Portal, the Console application showing the message being received, processed and forwarded and then the request and response showing up in the Runscope Traffic inspector.

![Demonstration of request being forwarded to Runscope](./media/api-management-log-to-eventhub-sample/apim-eventhub-runscope.gif)

## Summary
Azure API Management service provides an ideal place to capture the HTTP traffic travelling to and from your APIs. Azure Event Hubs is a highly scalable, low cost solution for capturing that traffic and feeding it into secondary processing systems for logging, monitoring and other sophisticated analytics. Connecting to 3rd party traffic monitoring systems like Runscope is a simple as a few dozen lines of code.

## Next steps
-	Learn more about Azure Event Hubs
	-	[Get started with Azure Event Hubs](../event-hubs/event-hubs-csharp-ephcs-getstarted.md)
	-	[Receive messages with EventProcessorHost](../event-hubs/event-hubs-csharp-ephcs-getstarted.md#receive-messages-with-eventprocessorhost)
	-	[Event Hubs programming guide](../event-hubs/event-hubs-programming-guide.md)
-	Learn more about API Management and Event Hubs integration
	-	[How to log events to Azure Event Hubs in Azure API Management](api-management-howto-log-event-hubs.md)
	-	[Logger entity reference](https://msdn.microsoft.com/library/azure/mt592020.aspx)
	-	[log-to-eventhub policy reference](https://msdn.microsoft.com/library/azure/dn894085.aspx#log-to-eventhub)
	