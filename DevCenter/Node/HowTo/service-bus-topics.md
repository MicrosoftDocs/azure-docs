<properties
umbracoNaviHide=0
pageTitle=Service Bus Topics - How To - Node.js - Develop
metaKeywords=Service Bus topics Node.js, getting started service bus topics node.js, getting started service bus subscriptions node.j
metaDescription=
linkid=dev-nodejs-how-to-service-bus-topics
urlDisplayName=Service Bus Topics
headerExpose=
footerExpose=
disqusComments=1
/>
<h1 id="How_to_Use_Service_Bus_TopicsSubscriptions">How to Use Service Bus Topics/Subscriptions</h1>
<p>This guide will show you how to use Service Bus topics and subscriptions from Node.js applications. The scenarios covered include <strong>creating topics and subscriptions, creating subscription filters, sending messages</strong> to a topic, <strong>receiving messages from a subscription</strong>, and <strong>deleting topics and subscriptions</strong>. For more information on topics and subscriptions, see the <a href="#nextsteps">Next Steps</a> section.</p>
<h2 id="Table_of_Contents">Table of Contents</h2>
<ul>
<li><a href="#What_are_Service_Bus_Topics_and_Subscriptions">What are Service Bus Topics and Subscriptions</a></li>
<li><a href="#Create_a_Service_Namespace">Create a Service Namespace</a></li>
<li><a href="#Obtain_the_Default_Management_Credentials_for_the_Namespace">Obtain the Default Management Credentials for the Namespace</a></li>
<li><a href="#Create_a_Nodejs_Application">Create a Node.js Application</a></li>
<li><a href="#Configure_Your_Application_to_Use_Service_Bus">Configure Your Application to Use Service Bus</a></li>
<li><a href="#How_to_Create_a_Topic">How to: Create a Topic</a></li>
<li><a href="#How_to_Create_Subscriptions">How to: Create Subscriptions</a></li>
<li><a href="#How_to_Send_Messages_to_a_Topic">How to: Send Messages to a Topic</a></li>
<li><a href="#How_to_Receive_Messages_from_a_Subscription">How to: Receive Messages from a Subscription</a></li>
<li><a href="#How_to_Handle_Application_Crashes_and_Unreadable_Messages">How to: Handle Application Crashes and Unreadable Messages</a></li>
<li><a href="#How_to_Delete_Topics_and_Subscriptions">How to: Delete Topics and Subscriptions</a></li>
<li><a href="#Next_Steps">Next Steps</a></li>
</ul>
<h2 id="What_are_Service_Bus_Topics_and_Subscriptions">What are Service Bus Topics and Subscriptions</h2>
<p>Service Bus topics and subscriptions support a <strong>publish/subscribe messaging communication</strong> model. When using topics and subscriptions, components of a distributed application do not communicate directly with each other, they instead exchange messages via a topic, which acts as an intermediary.</p>
<p><img src="/media/net/dev-net-how-to-sb-topics-01.png" alt="Topic Concepts"/></p>
<p>In contrast to Service Bus queues, where each message is processed by a single consumer, topics and subscriptions provide a <strong>one-to-many</strong> form of communication, using a publish/subscribe pattern. It is possible to register multiple subscriptions to a topic. When a message is sent to a topic, it is then made available to each subscription to handle/process independently.</p>
<p>A topic subscription resembles a virtual queue that receives copies of the messages that were sent to the topic. You can optionally register filter rules for a topic on a per-subscription basis, which allows you to filter/restrict which messages to a topic are received by which topic subscriptions.</p>
<p>Service Bus topics and subscriptions enable you to scale to process a very large number of messages across a very large number of users and applications.</p>
<h2 id="Create_a_Service_Namespace">Create a Service Namespace</h2>
<p>To begin using Service Bus topics and subscriptions in Windows Azure, you must first create a service namespace. A service namespace provides a scoping container for addressing Service Bus resources within your application.</p>
<p>To create a service namespace:</p>
<ol>
<li>
<p>Log on to the <a href="http://windows.azure.com">Windows Azure Management Portal</a>.</p>
</li>
<li>
<p>In the lower left navigation pane of the Management Portal, click <strong>Service Bus, Access Control &amp; Caching</strong>.</p>
</li>
<li>
<p>In the upper left pane of the Management Portal, click the <strong>Service Bus</strong> node, and then click the <strong>New</strong> button.</p>
<p><img src="/media/net/dev-net-how-to-sb-queues-03.png" alt="image"/></p>
</li>
<li>
<p>In the <strong>Create a new Service Namespace</strong> dialog, enter a <strong>Namespace</strong>, and then to make sure that it is unique, click the <strong>Check Availability</strong> button.</p>
<p><img src="/media/net/dev-net-how-to-sb-queues-04.png" alt="image"/></p>
</li>
<li>
<p>After making sure the <strong>Namespace</strong> name is available, choose the country or region in which your namespace should be hosted (make sure you use the same <strong>Country/Region</strong> in which you are deploying your compute resources), and then click the <strong>Create Namespace</strong> button.</p>
</li>
</ol>
<p>The namespace you created will then appear in the Management Portal and takes a moment to activate. Wait until the status is <strong>Active</strong> before moving on.</p>
<h2 id="Obtain_the_Default_Management_Credentials_for_the_Namespace">Obtain the Default Management Credentials for the Namespace</h2>
<p>In order to perform management operations, such as creating a topic or subscription, on the new namespace, you need to obtain the management credentials for the namespace.</p>
<ol>
<li>
<p>In the left navigation pane, click the <strong>Service Bus</strong> node to display the list of available namespaces:</p>
<p><img src="/media/net/dev-net-how-to-sb-queues-03.png" alt="image"/></p>
</li>
<li>
<p>Select the namespace you just created from the list shown:</p>
<p><img src="/media/net/dev-net-how-to-sb-queues-05.png" alt="image"/></p>
</li>
<li>
<p>The right-hand <strong>Properties</strong> pane will list the properties for the new namespace:</p>
<p><img src="/media/net/dev-net-how-to-sb-queues-06.png" alt="image"/></p>
</li>
<li>
<p>The <strong>Default Key</strong> is hidden. Click the <strong>View</strong> button to display the security credentials:</p>
<p><img src="/media/net/dev-net-how-to-sb-queues-07.png" alt="image"/></p>
</li>
<li>
<p>Make a note of the <strong>Default Issuer</strong> and the <strong>Default Key</strong> as you will use this information below to perform operations with the namespace.</p>
</li>
</ol>
<h2 id="Create_a_Nodejs_Application">Create a Node.js Application</h2>
<p>Create a new application using the <strong>Windows PowerShell for Node.js</strong> command window at the location c:\node\sbtopicss\WebRole1. For instructions on how to use the PowerShell commands to create a blank application, see Node.js Web Application.</p>
<p><strong>Note</strong>: Several steps in this article are performed using the tools provided by the <strong>Windows Azure SDK for Node.js</strong>, however the information provided should generally be applicable to applications created using other tools. The previous step simply creates a basic server.js file at c:\node\sbtopicss\WebRole1.</p>
<h2 id="Configure_Your_Application_to_Use_Service_Bus">Configure Your Application to Use Service Bus</h2>
<p>To use Windows Azure Service Bus, you need to download and use the Node.js azure package. This includes a set of convenience libraries that communicate with the Service Bus REST services.</p>
<h3 id="Use_Node_Package_Manager_NPM_to_obtain_the_package">Use Node Package Manager (NPM) to obtain the package</h3>
<ol>
<li>
<p>Use the <strong>Windows PowerShell for Node.js</strong> command window to navigate to the <strong>c:\node\sbtopicss\WebRole1</strong> folder where you created your sample application.</p>
</li>
<li>
<p>Type <strong>npm install azure</strong> in the command window, which should result in the following output:</p>
<pre class="prettyprint">azure@0.5.2 ./node_modules/azure
├── dateformat@1.0.2-1.2.3
├── xmlbuilder@0.3.1
├── mime@1.2.5
├── xml2js@0.1.13
├── log@1.3.0
├── qs@0.4.2
└── sax@0.3.5</pre>
</li>
<li>
<p>You can manually run the <strong>ls</strong> command to verify that a <strong>node_modules</strong> folder was created. Inside that folder find the <strong>azure</strong> package, which contains the libraries you need to access Service Bus topics.</p>
</li>
</ol>
<h3 id="Import_the_module">Import the module</h3>
<p>Using Notepad or another text editor, add the following to the top of the <strong>server.js</strong> file of the application:</p>
<pre class="prettyprint">var azure = require('azure');</pre>
<h3 id="Setup_a_Windows_Azure_Service_Bus_Connection">Setup a Windows Azure Service Bus Connection</h3>
<p>You must use the namespace and default key values to connect to the Service Bus topic. These values can be specified programmatically within your application, or read from the following environment variables at runtime:</p>
<ul>
<li>AZURE_SERVICEBUS_NAMESPACE</li>
<li>AZURE_SERVICEBUS_ACCESS_KEY</li>
</ul>
<p>You can also store these values in the configuration files created by the <strong>Windows Azure PowerShell for Node.js</strong> commands. In this how-to, you use the <strong>Web.Cloud.Config</strong> and <strong>Web.Config</strong> files, which are created when you create a Windows Azure Web role:</p>
<ol>
<li>
<p>Use a text editor to open <strong>c:\node\sbtopics\WebRole1\Web.cloud.config</strong></p>
</li>
<li>
<p>Add the following inside the <strong>configuration</strong> element</p>
<pre class="prettyprint">&lt;appSettings&gt;
&lt;add key="AZURE_SERVICEBUS_NAMESPACE" value="your Service Bus namespace"/&gt;
&lt;add key="AZURE_SERVICEBUS_ACCESS_KEY" value="your default key"/&gt;
&lt;/appSettings&gt;
</pre>
</li>
</ol>
<p>You are now ready to write code against Service Bus.</p>
<h2 id="How_to_Create_a_Topic">How to Create a Topic</h2>
<p>The <strong>ServiceBusService</strong> object lets you work with topics. The following code creates a <strong>ServiceBusService</strong> object. Add it near the top of the <strong>server.js</strong> file, after the statement to import the azure module:</p>
<pre class="prettyprint">var serviceBusService = azure.createServiceBusService();</pre>
<p>By calling <strong>createTopicIfNotExists</strong> on the <strong>ServiceBusService</strong> object, the specified topic will be returned (if it exists,) or a new topic with the specified name will be created. The following code uses <strong>createTopicIfNotExists</strong> to create or connect to the topic named 'MyTopic':</p>
<pre class="prettyprint">serviceBusService.createTopicIfNotExists('MyTopic',function(error){
    if(!error){
        // Topic was created or exists
        console.log('topic created or exists.');
    }
});</pre>
<p><strong>createServiceBusService</strong> also supports additional options, which allow you to override default topic settings such as message time to live or maximum topic size. The following example shows demonstrates setting the maximum topic size to 5GB a time to live of 1 minute:</p>
<pre class="prettyprint">var topicOptions = {
        MaxSizeInMegabytes: '5120',
        DefaultMessageTimeToLive: 'PT1M'
    };

serviceBusService.createTopicIfNotExists('MyTopic', topicOptions, function(error){
    if(!error){
        // topic was created or exists
    }
});</pre>
<h2 id="How_to_Create_Subscriptions">How to Create Subscriptions</h2>
<p>Topic subscriptions are also created with the <strong>ServiceBusService</strong> object. Subscriptions are named and can have an optional filter that restricts the set of messages delivered to the subscription's virtual queue.</p>
<p><strong>Note</strong>: Subscriptions are persistent and will continue to exist until either they, or the topic they are associated with, are deleted. If your application contains logic to create a subscription, it should first check if the subscription already exists by using the <strong>getSubscription</strong> method.</p>
<h3 id="Create_a_Subscription_with_the_default_MatchAll_Filter">Create a Subscription with the default (MatchAll) Filter</h3>
<p>The <strong>MatchAll</strong> filter is the default filter that is used if no filter is specified when a new subscription is created. When the <strong>MatchAll</strong> filter is used, all messages published to the topic are placed in the subscription's virtual queue. The following example creates a subscription named 'AllMessages' and uses the default <strong>MatchAll</strong> filter.</p>
<pre class="prettyprint">serviceBusService.createSubscription('MyTopic','AllMessages',function(error){
    if(!error){
        // subscription created
    }
});</pre>
<h3 id="Create_Subscriptions_with_Filters">Create Subscriptions with Filters</h3>
<p>You can also setup filters that allow you to scope which messages sent to a topic should show up within a specific topic subscription.</p>
<p>The most flexible type of filter supported by subscriptions is the <strong>SqlFilter</strong>, which implements a subset of SQL92. SQL filters operate on the properties of the messages that are published to the topic. For more details about the expressions that can be used with a SQL filter, review the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.sqlexpression.aspx">SqlFilter.SqlExpression</a> syntax.</p>
<p>Filters can be added to a subscription by using the <strong>createRule</strong> method of the <strong>ServiceBusService</strong> object. This method allows you to add new filters to an existing subscription.</p>
<p><strong>Note</strong>: Since the default filter is applied automatically to all new subscriptions, you must first remove the default filter or the <strong>MatchAll</strong> will override any other filters you may specify. You can remove the default rule by using the <strong>deleteRule</strong> method of the <strong>ServiceBusService</strong> object.</p>
<p>The example below creates a subscription named 'HighMessages' with a <strong>SqlFilter</strong> that only selects messages that have a custom <strong>messagenumber</strong> property greater than 3:</p>
<pre class="prettyprint">serviceBusService.createSubscription('MyTopic', 'HighMessages', function (error){
    if(!error){
        // subscription created
        rule.create();
    }
});
var rule={
    deleteDefault: function(){
        serviceBusClient.deleteRule('MyTopic',
            'HighMessages', 
            azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME, 
            rule.handleError);
    },
    create: function(){
        var ruleOptions = {
            sqlExpressionFilter: 'messagenumber &gt; 3'
        };
        rule.deleteDefault();
        serviceBusClient.createRule('MyTopic', 
            'HighMessages', 
            'HighMessageFilter', 
            ruleOptions, 
            rule.handleError);
    },
    handleError: function(error){
        if(error){
            console.log(error)
        }
    }
}</pre>
<p>Similarly, the following example creates a subscription named 'LowMessages' with a <strong>SqlFilter</strong> that only selects messages that have a <strong>messagenumber</strong> property less than or equal to 3:</p>
<pre class="prettyprint">serviceBusService.createSubscription('MyTopic', 'LowMessages', function (error){
    if(!error){
        // subscription created
        rule.create();
    }
});
var rule={
    deleteDefault: function(){
        serviceBusClient.deleteRule('MyTopic',
            'LowMessages', 
            azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME, 
            rule.handleError);
    },
    create: function(){
        var ruleOptions = {
            sqlExpressionFilter: 'messagenumber &lt;= 3'
        };
        rule.deleteDefault();
        serviceBusClient.createRule('MyTopic', 
            'LowMessages', 
            'LowMessageFilter', 
            ruleOptions, 
            rule.handleError);
    },
    handleError: function(error){
        if(error){
            console.log(error)
        }
    }
}</pre>
<p>When a message is now sent to 'MyTopic', it will always be delivered to receivers subscribed to the 'AllMessages' topic subscription, and selectively delivered to receivers subscribed to the 'HighMessages' and 'LowMessages' topic subscriptions (depending upon the message content).</p>
<h2 id="How_to_Send_Messages_to_a_Topic">How to Send Messages to a Topic</h2>
<p>To send a message to a Service Bus topic, your application must use the <strong>sendTopicMessage</strong> method of the <strong>ServiceBusService</strong> object. Messages sent to Service Bus Topics are <strong>BrokeredMessage</strong> objects. <strong>BrokeredMessage</strong> objects have a set of standard properties (such as <strong>Label</strong> and <strong>TimeToLive</strong>), a dictionary that is used to hold custom application specific properties, and a body of string data. An application can set the body of the message by passing a string value to the <strong>sendTopicMessage</strong> and any required standard properties will be populated by default values.</p>
<p>The following example demonstrates how to send five test messages to 'MyTopic'. Note that the <strong>messagenumber</strong> property value of each message varies on the iteration of the loop (this will determine which subscriptions receive it):</p>
<pre class="prettyprint">var message = {
    body: '',
    customProperties: {
        messagenumber: 0
    }
}

for (i = 0;i &lt; 5;i++) {
    message.customProperties.messagenumber=i;
    message.body='This is Message #'+i;
    serviceBusClient.sendTopicMessage(topic, message, function(error) {
      if (error) {
        console.log(error);
      }
    });
}</pre>
<p>Service Bus topics support a maximum message size of 256 MB (the header, which includes the standard and custom application properties, can have a maximum size of 64 MB). There is no limit on the number of messages held in a topic but there is a cap on the total size of the messages held by a topic. This topic size is defined at creation time, with an upper limit of 5 GB.</p>
<h2 id="How_to_Receive_Messages_from_a_Subscription">How to Receive Messages from a Subscription</h2>
<p>Messages are received from a subscription using the <strong>receiveSubscriptionMessage</strong> method on the <strong>ServiceBusService</strong> object. By default, messages are deleted from the subscription as they are read; however, you can read (peek) and lock the message without deleting it from the subscription by setting the optional parameter <strong>isPeekLock</strong> to <strong>true</strong>.</p>
<p>The default behavior of reading and deleting the message as part of the receive operation is the simplest model, and works best for scenarios in which an application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.</p>
<p>If the <strong>isPeekLock</strong> parameter is set to <strong>true</strong>, the receive becomes a two stage operation, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling <strong>deleteMessage</strong> method and providing the message to be deleted as a parameter. The <strong>deleteMessage</strong> method will mark the message as being consumed and remove it from the subscription.</p>
<p>The example below demonstrates how messages can be received and processed using <strong>receiveSubscriptionMessage</strong>. The example first receives and deletes a message from the 'LowMessages' subscription, and then receives a message from the 'HighMessages' subscription using <strong>isPeekLock</strong> set to true. It then deletes the message using <strong>deleteMessage</strong>:</p>
<pre class="prettyprint">serviceBusService.receiveSubscriptionMessage('MyTopic', 'LowMessages', function(error, receivedMessage){
    if(!error){
        // Message received and deleted
        console.log(receivedMessage);
    }
});
serviceBusService.receiveSubscriptionMessage('MyTopic', 'HighMessages', { isPeekLock: true }, function(error, lockedMessage){
    if(!error){
        // Message received and locked
        console.log(lockedMessage);
        serviceBusService.deleteMessage(lockedMessage, function (deleteError){
            if(!deleteError){
                // Message deleted
                console.log('message has been deleted.');
            }
        }
    }
});
</pre>
<h2 id="How_to_Handle_Application_Crashes_and_Unreadable_Messages">How to Handle Application Crashes and Unreadable Messages</h2>
<p>Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the <strong>unlockMessage</strong> method on the <strong>ServiceBusService</strong> object. This will cause Service Bus to unlock the message within the subscription and make it available to be received again, either by the same consuming application or by another consuming application.</p>
<p>There is also a timeout associated with a message locked within the subscription, and if the application fails to process the message before the lock timeout expires (e.g., if the application crashes), then Service Bus will unlock the message automatically and make it available to be received again.</p>
<p>In the event that the application crashes after processing the message but before the <strong>deleteMessage</strong> method is called, then the message will be redelivered to the application when it restarts. This is often called <strong>At Least Once Processing</strong>, that is, each message will be processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. This is often achieved using the <strong>MessageId</strong> property of the message, which will remain constant across delivery attempts.</p>
<h2 id="How_to_Delete_Topics_and_Subscriptions">How to Delete Topics and Subscriptions</h2>
<p>Topics and subscriptions are persistent, and must be explicitly deleted either through the Windows Azure Management portal or programmatically. The example below demonstrates how to delete the topic named 'MyTopic':</p>
<pre class="prettyprint">serviceBusService.deleteTopic('MyTopic', function (error) {
    if (error) {
        console.log(error);
    }
});</pre>
<p>Deleting a topic will also delete any subscriptions that are registered with the topic. Subscriptions can also be deleted independently. The following code demonstrates how to delete a subscription named 'HighMessages' from the 'MyTopic' topic:</p>
<pre class="prettyprint">serviceBusService.deleteSubscription('MyTopic', 'HighMessages', function (error) {
    if(error) {
        console.log(error);
    }
});</pre>
<h2 id="Next_Steps">Next Steps</h2>
<p>Now that you've learned the basics of Service Bus topics, follow these links to learn more.</p>
<ul>
<li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/hh367516.aspx">Queues, Topics, and Subscriptions</a>.</li>
<li>API reference for <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.aspx">SqlFilter</a>.</li>
</ul>