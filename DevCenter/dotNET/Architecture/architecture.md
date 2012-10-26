<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="15208" umbversionid="1fd9dd87-daa8-4679-ac5d-3dd7cdaaa35f" ismacro="true" umb_chunkname="DotNetLandingLeft" umb_chunkpath="devcenter/Menu" umb_hide="0" umb_macroalias="AzureChunkDisplayer" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>
<h1 id="menu-dotnet-guidance">Architecture</h1>
<p class="subheading">Learn how to implement common design patterns in Windows Azure applications.</p>
<h2>Data</h2>
<h3>Command Query Responsibility Segregation (CQRS)</h3>
<p>The Command Query Responsibility Segregation (CQRS) pattern is a higher level pattern that separates database read and write operations into separate services. In the pattern, operations should be either commands or queries. A query returns data and does not alter the state of the object; a command changes the state of an object but does not return any data. The benefit is that you have a better understanding what does, and what does not, change the state in your system.</p>
<p><strong>Related articles:</strong></p>
<ul>
<li><a href="http://msdn.microsoft.com/en-us/library/jj554200">CQRS Journey (Patterns &amp; Practices)</a></li>
</ul>
<h2>Fault tolerance</h2>
<h3>Transient error handling</h3>
<p>Transient faults are errors that occur because of some temporary condition such as network connectivity issues or service unavailability. Typically, if you retry the operation that resulted in a transient error a short time later, you find that the error has disappeared. The Transient Fault Handling Application Block encapsulates information about the transient faults that can occur when you use the SQL Database, Service Bus or Windows Azure Storage.</p>
<p><strong>Related articles:</strong></p>
<ul>
<li><a href="http://msdn.microsoft.com/en-us/library/hh680934(PandP.50).aspx">Transient Fault Handling Application Block (Patterns &amp; Practices)</a></li>
<li><a href="http://social.technet.microsoft.com/wiki/contents/articles/4235.retry-logic-for-transient-failures-in-windows-azure-sql-database-en-us.aspx">Retry Logic for Transient Failures in SQL Database</a></li>
<li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh851746.aspx">Handling transient communication errors in Service Bus brokered messaging</a></li>
</ul>
<h3>Managing database throttling</h3>
<p>SQL Database provides a large-scale, multi-tenant database service on shared resources. To provide a good experience to all customers, SQL Database sometimes throttles work or closes connections to prevent a machine from becoming overloaded. There are several techniques you can use to ensure that your application is not negatively impacted by throttling</p>
<p><strong>Related articles:</strong></p>
<ul>
<li><a href="http://social.technet.microsoft.com/wiki/contents/articles/1541.windows-azure-sql-database-connection-management-en-us.aspx">Windows Azure SQL Database Connection Management</a></li>
<li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/jj717232.aspx">Best Practices for the Design of Large-Scale Services on Windows Azure Cloud Services: Shared resources and throttling</a></li>
</ul>
<h2>Messaging</h2>
<h3>Queues: guarantee message delivery and distribute work</h3>
<p>You can use queues in Windows Azure to support asynchronous communication between components. A component in an application can post a message to a queue. Other components can pick up the message and process it. The queue provides durable persistence between components, as well as benefits for load-leveling, load-balancing, and scaling.</p>
<p><strong>Related articles:</strong></p>
<ul>
<li><a href="http://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-queues/">How to use Service Bus queues</a></li>
<li><a href="http://www.windowsazure.com/en-us/develop/net/how-to-guides/queue-service/">How to use the queue storage service</a></li>
<li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh767287.aspx">Windows Azure Queues and Windows Azure Service Bus Queues - Compared and Contrasted</a></li>
<li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh697709.aspx">Best Practices for Maximizing Scalability and Cost Effectiveness of Queue-Based Messaging Solutions on Windows Azure</a></li>
<li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh545245.aspx">Best Practices for Leveraging Windows Azure Service Bus Brokered Messaging API</a></li>
</ul>
<h3>Publish/subscribe pattern</h3>
<p>Publish/subscribe is a messaging model where all subscribed components receive a notification when a message arrives. Windows Azure Topics and Subscriptions provide a pub/sub messaging model. Messages are sent to a topic in the same way as they are sent to a queue. However, messages are not received from the topic directly; they are received from subscriptions.</p>
<p><strong>Related articles:</strong></p>
<ul>
<li><a href="http://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-topics/">How to Use Service Bus Topics/Subscriptions</a></li>
<li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh545245.aspx">Best Practices for Leveraging Windows Azure Service Bus Brokered Messaging API</a></li>
</ul>
<h2>Scaling</h2>
<h3>Autoscaling</h3>
<p>One of the benefits of a Windows Azure cloud service application is that you can easily scale individual components as your application's usage changes. The Autoscaling Application Block from the Microsoft Enterprise Library 5.0 Integration Pack for Windows Azure provides tools that let you automatically scale your cloud service. You can use performance counters to understand your app's performance, and then write rules that will automatically scale your app to adjust for specified targets and thresholds.</p>
<p><strong>Related articles:</strong></p>
<ul>
<li><a href="http://msdn.microsoft.com/en-us/library/hh680892(v=PandP.50).aspx">The Autoscaling Application Block (Patterns &amp; Practices)</a></li>
</ul>
<h2>State</h2>
<h3>Store state information in caching</h3>
<p>Stateless apps require state to be cached and retrieved from durable stores. As an example, ASP.NET cookies can be used to store state. Those cookies can be stored in Caching, globally available to all web role instances.</p>
<p><strong>Related articles:</strong></p>
<ul>
<li><a href="http://www.windowsazure.com/en-us/develop/net/how-to-guides/cache/#store-session">How to: Store ASP.NET session state in the cache</a></li>
</ul>