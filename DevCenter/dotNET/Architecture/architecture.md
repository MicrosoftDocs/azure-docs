<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="15208" umbversionid="853660c7-e1ba-4373-b5e6-cc66ad55b2e5" ismacro="true" umb_chunkpath="devcenter/dotnet" umb_macroalias="AzureChunkDisplayer" umb_chunkname="article-left-menu" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>
<h1 id="menu-dotnet-architecture">Architecture</h1>
<p class="subheading">Learn how to design applications and implement common design patterns in Windows Azure.</p>
<h2><a id="overviews"></a>Application architecture overviews</h2>
<h3><a href="http://go.microsoft.com/fwlink/p/?LinkId=272588">Fail-Safe: Guidance for Resilient Cloud Architectures</a></h3>
<p>This article focuses on the architectural considerations for designing scalable and reliable systems. It provides detailed guidance about the following areas:</p>
<ul>
<li>Decomposing an application workload</li>
<li>Establishing a lifecycle model</li>
<li>Establishing an availability model and plan</li>
<li>Identifying failure points and failure modes</li>
<li>Identifying resiliency patterns and resiliency considerations</li>
<li>Designing for operations</li>
</ul>
<h3><a href="http://msdn.microsoft.com/en-us/library/windowsazure/jj717232.aspx">Best Practices for the Design of Large-Scale Services on Windows Azure Cloud Services</a></h3>
<p>A multitenant application is a shared resource that allows separate users, or "tenants," to view the application as though it was their own. This in-depth article provides guidance based on real-world customer scenarios about how to build massively scalable applications on Windows Azure and SQL Database.</p>
<h2>Application patterns</h2>
<h3><a href="/en-us/develop/net/architecture/multi-tenant-web-application-pattern/">Multitenant Applications in Windows Azure</a></h3>
<p>Windows Azure provides many features that allow you to address the key problems encountered when designing a multitenant system, including isolation, storage, connection and security services, networking services, and resource provisioning. This overview describes how Windows Azure supports multitenant apps and introduces a detailed multitenant reference implementation.</p>
<h3><a href="/en-us/develop/net/architecture/load-testing-pattern/">Load Testing in Windows Azure</a></h3>
<p>The primary goal of a load test is to simulate many users accessing a web application at the same time. Windows Azure provides value to your application in its ability to handle an elastic work load. This overview describes how you can apply Windows Azure features to your test rig to reduce your testing costs by leveraging the elastic scaling capabilities in Windows Azure. The article introduces a reference implementation that leverages Windows Azure and Visual Studio Load Test.</p>
<h2><a id="designpatterns"></a>Design patterns: Data</h2>
<h3>Command Query Responsibility Segregation (CQRS)</h3>
<p>The Command Query Responsibility Segregation (CQRS) pattern is a higher level pattern that separates database read and write operations into separate services. In the pattern, operations should be either commands or queries. A query returns data and does not alter the state of the object; a command changes the state of an object but does not return any data. The benefit is that you have a better understanding what does, and what does not, change the state in your system.</p>
<p><strong>Related articles:</strong></p>
<ul>
<li><a href="http://msdn.microsoft.com/en-us/library/jj554200">CQRS Journey (Patterns &amp; Practices)</a></li>
</ul>
<h2>Design patterns: Fault tolerance</h2>
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
<h2>Design patterns: Messaging</h2>
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
<h2>Design patterns: Scaling</h2>
<h3>Autoscaling</h3>
<p>One of the benefits of a Windows Azure cloud service application is that you can easily scale individual components as your application's usage changes. The Autoscaling Application Block from the Microsoft Enterprise Library 5.0 Integration Pack for Windows Azure provides tools that let you automatically scale your cloud service. You can use performance counters to understand your app's performance, and then write rules that will automatically scale your app to adjust for specified targets and thresholds.</p>
<p><strong>Related articles:</strong></p>
<ul>
<li><a href="http://msdn.microsoft.com/en-us/library/hh680892(v=PandP.50).aspx">The Autoscaling Application Block (Patterns &amp; Practices)</a></li>
</ul>
<h2>Design patterns: State</h2>
<h3>Store state information in caching</h3>
<p>Stateless apps require state to be cached and retrieved from durable stores. As an example, ASP.NET cookies can be used to store state. Those cookies can be stored in Caching, globally available to all web role instances.</p>
<p><strong>Related articles:</strong></p>
<ul>
<li><a href="http://www.windowsazure.com/en-us/develop/net/how-to-guides/cache/#store-session">How to: Store ASP.NET session state in the cache</a></li>
</ul>