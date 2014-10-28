<properties title="Analyzing sensor data with Storm and HDInsight" pageTitle="Analyzing sensor data with Apache Storm and Microsoft Azure HDInsight (Hadoop)" description="Learn how to use  Apache Storm to process sensor data in realtime with HDInsight (Hadoop)" metaKeywords="Azure hdinsight storm, Azure hdinsight realtime, azure hadoop storm, azure hadoop realtime, azure hadoop real-time, azure hdinsight real-time" services="hdinsight" solutions="" documentationCenter="big-data" authors="larryfr" videoId="" scriptId="" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/30/2014" ms.author="larryfr" />

#Analyzing sensor data with Storm and HBase in HDInsight (Hadoop)

Learn how to use build a solution that uses an HDInsight Storm cluster to process sensor data from Azure Event Hub. During processing, the Storm topology will store incoming data into an HBase cluster. The topology will also use SignalR to provide near-real-time information through a web-based dashboard hosted on Azure Websites.

> [AZURE.NOTE] A complete version of this project is available at [https://github.com/Blackmist/hdinsight-eventhub-example](https://github.com/Blackmist/hdinsight-eventhub-example).

##Prerequisites

* An Azure subscription

* Visual Studio with the [Microsoft Azure SDK for .NET](http://azure.microsoft.com/en-us/downloads/archive-net-downloads/)

* [Java and JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

* [Maven](http://maven.apache.org/what-is-maven.html)

* [Git](http://git-scm.com/)

> [AZURE.NOTE] Java, the JDK, Maven, and Git are also available through the [Chocolatey NuGet](http://chocolatey.org/) package manager.

##Create the dashboard

The dashboard is used to display near-real time sensor information. In this case, the dashboard is an ASP.NET application hosted in an Azure Website. The application's primary purpose is to serve as a [SignalR](http://www.asp.net/signalr/overview/getting-started/introduction-to-signalr) hub that receives information from the Storm topology as it processes messages.

The website also contains a static index.html file, which also connects to SignalR, and uses D3.js to graph the data transmitted by the Storm topology.

> [WACOM.NOTE] While you could also use raw WebSockets instead of SignalR, WebSockets does not provide a built-in scaling mechanism if you need to scale out the web site. SignalR can be scaled using Azure Service Bus ([http://www.asp.net/signalr/overview/performance/scaleout-with-windows-azure-service-bus](http://www.asp.net/signalr/overview/performance/scaleout-with-windows-azure-service-bus)).
>
> For an example of using a Storm topology to communicate with a Python website using raw WebSockets, see the [Storm Tweet Sentiment D3 Visualization](https://github.com/P7h/StormTweetsSentimentD3Viz) project.

1. In Visual Studio, create a new C# application using the **ASP.NET Web Application** project template. Name the new application **Dashboard**.

2. In the **New ASP.NET Project** window, select the **Empty** application template. In the **Windows Azure** section, select **Host in the cloud** and **Web site**. Finally, click **Ok**.

	> [AZURE.NOTE] If prompted, sign in to your Azure subscription.

3. In the **Configure Windows Azure Site** dialog, enter a **Site name** and **Region** for your web site, then click **OK**. This will create the Azure Website that will host the dashboard.

3. In **Solution Explorer**, right-click the project and then select **Add | SignalR Hub Class (v2)**. Name the class **DashHub.cs** and add it to the project. This will contain the SignalR hub that is used to communicate data between HDInsight and the dashboard web page.

	> [AZURE.NOTE] If you are using Visual Studio 2012, the **SignalR Hub Class (v2)** template will not be available. You can add a plain **Class** called DashHub instead. You will also need to manually install the SignalR package by opening the **Tools | Library Package Manager | Package Manager Console** and running the following command:
	>
	> `install-package Microsoft.AspNet.SignalR`

4. Replace the code in **DashHub.cs** with the following.

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Web;
		using Microsoft.AspNet.SignalR;

		namespace dashboard
		{
		    public class DashHub : Hub
		    {
		        public void Send(string message)
		        {
		            // Call the broadcastMessage method to update clients.
		            Clients.All.broadcastMessage(message);
		        }
		    }
		}

5. In **Solution Explorer**, right-click the project and then select **Add | OWIN Startup Class**. Name the new class **Startup.cs**.

	> [AZURE.NOTE] If you are using Visual Studio 2012, the **OWIN Startup Class** template will not be available. You can create a **Class** called Startup instead.

6. Replace the contents of **Startup.cs** with the following.

		using System;
		using System.Threading.Tasks;
		using Microsoft.Owin;
		using Owin;

		[assembly: OwinStartup(typeof(dashboard.Startup))]

		namespace dashboard
		{
		    public class Startup
		    {
		        public void Configuration(IAppBuilder app)
		        {
		            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
		            app.MapSignalR();
		        }
		    }
		}

7. In **Solution Explorer**, right-click the project and then click **Add | HTML Page**. Name the new page **index.html**. This page will contain the realtime dashboard for this project. It will receive information from DashHub and display a graph using D3.js.

8. In **Solution Explorer**, right-click on **index.html** and select **Set as Start Page**.

10. Replace the code in the **index.html** file with the following.

		<!DOCTYPE html>
		<html xmlns="http://www.w3.org/1999/xhtml">
		<head>
		    <title>Dashboard</title>
		    <style>
		
		        .x.axis line {
		            shape-rendering: auto;
		        }
		
		        .line {
		            fill: none;
		            stroke-width: 1.5px;
		        }
		
		    </style>
		    <!--Script references. -->
		    <!--Reference the jQuery library. -->
		    <script src="Scripts/jquery-1.10.2.min.js"></script>
		    <!--Reference the SignalR library. -->
		    <script src="Scripts/jquery.signalR-2.0.2.min.js"></script>
		    <!--Reference the autogenerated SignalR hub script. -->
		    <script src="signalr/hubs"></script>
		    <!--Reference d3.js.-->
		    <script src="http://d3js.org/d3.v3.min.js"></script>
		</head>
		<body>
		    <script>
		        $(function () {
		            //Huge thanks to Mike Bostok for his Path Transitions article - http://bost.ocks.org/mike/path/
		            var n = 243,                                 //number of x coordinates in the graph
		            duration = 750,                          //duration for transitions
		            deviceValue=[0,0,0,0,0,0,0,0,0,0],       //temp holding for each device value
		            now = new Date(Date.now() - duration),   //Now
		            //fill an array of arrays with dummy data to start the chart
		            //each item in the top-level array is a line
		            //each item in the line arrays represents the X coordinate across a graph
		            //The 'value' within each line array represents the Y coordinate for that point
		            data = [                                 
		                d3.range(n).map(function () { return { value: 0 }; }),
		                d3.range(n).map(function () { return { value: 0 }; }),
		                d3.range(n).map(function () { return { value: 0 }; }),
		                d3.range(n).map(function () { return { value: 0 }; }),
		                d3.range(n).map(function () { return { value: 0 }; }),
		                d3.range(n).map(function () { return { value: 0 }; }),
		                d3.range(n).map(function () { return { value: 0 }; }),
		                d3.range(n).map(function () { return { value: 0 }; }),
		                d3.range(n).map(function () { return { value: 0 }; }),
		                d3.range(n).map(function () { return { value: 0 }; }),
		                d3.range(n).map(function () { return { value: 0 }; })
		            ];
		
		            //Color scale for 10 items
		            var color = d3.scale.category10();
		            //The domain for color (the device IDs)
		            var devices = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
		            //This will auto-generate colors for this range of IDs
		            color.domain(devices);
		
		            //set margins and figure out width/height
		            var margin = {top: 6, right: 0, bottom: 20, left: 40},
		                width = 960 - margin.right,
		                height = 240 - margin.top - margin.bottom;
		
		            //the time scale for the X axis
		            var x = d3.time.scale()
		                .domain([now - (n - 2) * duration, now - duration])
		                .range([0, width]);
		
		            //the numerical scale for the Y axis
		            var y = d3.scale.linear()
		                .domain([100, 0])
		                .range([0, height]);
		
		            //The line, which is really just a
		            //couple functions that we can pass data to
		            //in order to get back x/y coords.
		            var line = d3.svg.line()
		                .interpolate("basis")
		                .x(function (d, i) { return x(now - (n - 1 - i) * duration); })
		                .y(function (d, i) { return y(d.value); });
		
		            //Find the HTML body element and add a child SVG element
		            var svg = d3.select("body").append("svg")
		                .attr("width", width + margin.left + margin.right)
		                .attr("height", height + margin.top + margin.bottom)
		              .append("g")
		                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		            //Define a clipping path, because we need to clip
		            //the graph to render only the bits we want to see
		            //as it moves
		            svg.append("defs").append("clipPath")
		                .attr("id", "clip")
		              .append("rect")
		                .attr("width", width)
		                .attr("height", height);
		
		            //Append the x axis
		            var axis = svg.append("g")
		                .attr("class", "x axis")
		                .attr("transform", "translate(0," + height + ")")
		                .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));
		
		            //append the y axis
		            var yaxis = svg.append("g")
		                .attr("class", "y axis")
		                .call(y.axis = d3.svg.axis().scale(y).orient("left").ticks(5));
		
		            //append the clipping path
		            var linegroup = svg.append("g")
		              .attr("clip-path", "url(#clip)");
		
		            //magic. Select all paths with a class of .line
		            //if they don't exist, make them.
		            //use the points in the line object to define
		            //the paths
		            //set the color to the cooresponding auto-generated coclor
		            var path = linegroup.selectAll(".line")
		              .data(data)
		              .enter().append("path")
		              .attr("class", "line")
		              .attr("d", line)
		              .style("stroke", function (d, i) { return color(i); });
		
		            //We need to transition the graph after all
		            //lines have been updated. There's no
		            //built-in for this, so this function
		            //does reference counting on end events
		            //for each line, then applies whatever
		            //callback when all are finished.
		            function endall(transition, callback) {
		                var n = 0;
		                transition
		                    .each(function () { ++n; })
		                    .each("end", function () { if (!--n) callback.apply(this, arguments); });
		            }
		
		            //wire up the SignalR client and listen for messages
		            var chat = $.connection.dashHub;
		            chat.client.broadcastMessage = function (message) {
		                //parse the JSON data
		                var incomingData = JSON.parse(message);
		                //stuff it in the global array slot for the device ID
		                deviceValue[incomingData.device] = incomingData.temperature;
		
		            };
		            //start listening
		            $.connection.hub.start();
		            //tick for D3 graphics
		            tick();
		
		            function tick() {
		                // update the domains
		                now = new Date();
		                x.domain([now - (n - 2) * duration, now - duration]);
		    
		                //push the (presumably) fresh data deviceValue array onto
		                //the arrays that define the lines.
		                for (i = 0; i < 10; i++) {
		                    data[i].push({ value: deviceValue[i] });
		                    //data[1].push({ value: maxValue });
		                }
		                //slide the x-axis left
		                axis.transition()
		                    .duration(duration)
		                    .ease("linear")
		                    .call(x.axis);
		
		                //Update the paths based on the updated line data
		                //and slide left
		                path
		                    .attr("d", line)
		                    .attr("transform", null)
		                .transition()
		                    .duration(duration)
		                    .ease("linear")
		                    .attr("transform", "translate(" + x(now - (n - 1) * duration) + ",0)")
		                    .call(endall, tick);
		    
		                // pop the old data point off the front
		                // of the arrays
		                for (var i = 0; i < data.length; i++) {
		                    data[i].shift();
		                };
		            };
		         })()
		        </script>
		    </body>
		</html>

	> [AZURE.NOTE] A later version of the SignalR scripts may be installed by the package manager. Verify that the script references below correspond to the versions of the script files in the project (they will be different if you added SignalR using NuGet rather than adding a hub.)

11. In **Solution Explorer**, right-click the project and then click **Add | HTML Page**. Name the new page **test.html**. This page can be used to test DashHub and the dashboard by sending and receiving messages.

11. Replace the code in the **test.html** file with the following.

		<!DOCTYPE html>
		<html>
		<head>
		    <title>Test</title>
		    <style type="text/css">
		        .container {
		            background-color: #99CCFF;
		            border: thick solid #808080;
		            padding: 20px;
		            margin: 20px;
		        }
		    </style>
		</head>
		<body>
		    <div class="container">
		        <input type="text" id="message" />
		        <input type="button" id="sendmessage" value="Send" />
		        <input type="hidden" id="displayname" />
		        <ul id="discussion"></ul>
		    </div>
		    <!--Script references. -->
		    <!--Reference the jQuery library. -->
		    <script src="Scripts/jquery-1.10.2.min.js"></script>
		    <!--Reference the SignalR library. -->
		    <script src="Scripts/jquery.signalR-2.0.2.min.js"></script>
		    <!--Reference the autogenerated SignalR hub script. -->
		    <script src="signalr/hubs"></script>
		    <!--Add script to update the page and send messages.-->
		    <script type="text/javascript">
		        $(function () {
		            // Declare a proxy to reference the hub.
		            var chat = $.connection.dashHub;
		            // Create a function that the hub can call to broadcast messages.
		            chat.client.broadcastMessage = function (message) {
		                // Html encode display the message.
		                var encodedMsg = $('<div />').text(message).html();
		                // Add the message to the page.
		                $('#discussion').append('<li>' + encodedMsg + '</li>');
		            };
		            // Set initial focus to message input box.
		            $('#message').focus();
		            // Start the connection.
		            $.connection.hub.start().done(function () {
		                $('#sendmessage').click(function () {
		                    // Call the Send method on the hub.
		                    chat.server.send($('#message').val());
		                    // Clear text box and reset focus for next comment.
		                    $('#message').val('').focus();
		                });
		            });
		        });
		    </script>
		</body>
		</html>

11. **Save All** for the project.

12. In **Solution Explorer**, right-click on the **Dashboard** project and select **Publish**. Select the website you created for this project, then click **Publish**.

13. Once the site has been published, a web page should open displaying a moving timeline.

###Test the dashboard

14. To verify that SignalR is working, and that the dashboard will display graph lines for data sent to SignalR, open a new browser window to the **test.html** page on this website. For example, **http://mydashboard.azurewebsites.net/test.html**.

15. The dashboard expects JSON formatted data, with a **device id** and **temperature** value. For example **{"device":0, "temperature":80}**. Enter some test values on the **test.html** page, using device IDs 0 through 9, while the dashboard is open in another page. Note that the lines for each device ID are drawn using a different color.

##Configure Event Hub

Event Hub is used to receive messages (events) from the sensors. Use the following steps to create a new Event Hub.

1. From the [Azure Portal](https://manage.windowsazure.com), select **NEW | Service Bus | Event Hub | Custom Create**.

2. On the **Add a new Event Hub** dialog, enter an **Event Hub Name**, select the **Region** to create the hub in, and either create a new namespace or select an existing one. Finally, click the **Arrow**.

2. On the **Configure Event Hub** dialog, enter the **Partition count** and **Message Retention** values. For this example, use a partition count of 10 and a message retention of 1.

3. Once the event hub has been created, select the namespace, then select **Event Hubs**. Finally, select the event hub you created earlier.

4. Select **Configure**, then create two new access policies using the following information.

	<table>
	<tr><th>Name</th><th>Permissions</th></tr>
	<tr><td>devices</td><td>Send</td></tr>
	<tr><td>storm</td><td>Listen</td></tr>
	</table>

	After creating permissions, select the **Save** icon at the bottom of the page. This creates the shared access policies that will be used to send messages to, and read messages from, this hub.

5. After saving the policies, use the **Shared access key generator** at the bottom of the page to retrieve the key for both the **devices** and **storm** policies. Save these as they will be used later.

###Send messages to Event Hub

Since there isn't an easy, standard set of sensors available to everyone, a .NET application is used to generate random numbers. The .NET application created using the steps below will generate events for 10 devices every second, until you stop the application by pressing a key.

1. In Visual Studio, create a new **Windows Desktop** project and select the **Console Application** project template. Name the project **SendEvents** and then click **OK**.

2. In **Solution Explorer**, right-click **SendEvents** and then select **Manage NuGet packages**.

3. In **Manage NuGet Packages**, search for and install the following packages.

	* **Microsoft Azure Service Bus**
	* **JSON.Net**

	After the packages have been installed, **Close** the package manager.

4. Replace the contents of **Program.cs** with the following.

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Text;
		using System.Threading.Tasks;
		using Microsoft.ServiceBus.Messaging;
		using Newtonsoft.Json;
		using Microsoft.ServiceBus;
		using System.Threading;
		
		namespace SendEvents
		{
		    class Program
		    {
		
		        static int numberOfDevices = 10;
		        static string eventHubName = "temperature";
		        static string eventHubNamespace = "namespace";
		        static string sharedAccessPolicyName = "devices";
		        static string sharedAccessPolicyKey = "key for devices policy";
		
		        static void Main(string[] args)
		        {
		            var settings = new MessagingFactorySettings()
		            {
		                TokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider(sharedAccessPolicyName, sharedAccessPolicyKey),
		                TransportType = TransportType.Amqp
		            };
		            var factory = MessagingFactory.Create(
		                 ServiceBusEnvironment.CreateServiceUri("sb", eventHubNamespace, ""), settings);
		
		            EventHubClient client = factory.CreateEventHubClient(eventHubName);
		 
		            try
		            {
		
		                List<Task> tasks = new List<Task>();
		                // Send messages to Event Hub
		                Console.WriteLine("Sending messages to Event Hub {0}", client.Path);
		                Random random = new Random();
		                //for (int i = 0; i < numberOfMessages; ++i)
		                while(!Console.KeyAvailable)
		                {
		                    // One event per device
		                    for(int devices = 0; devices < numberOfDevices; devices++)
		                    {
		                        // Create the device/temperature metric
		                        Event info = new Event() { 
		                            TimeStamp = DateTime.UtcNow,
		                            DeviceId = random.Next(numberOfDevices),
		                            Temperature = random.Next(100)
		                        };
		                        // Serialize to JSON
		                        var serializedString = JsonConvert.SerializeObject(info);
		                        Console.WriteLine(serializedString);
		                        EventData data = new EventData(Encoding.UTF8.GetBytes(serializedString))
		                        {
		                            PartitionKey = info.DeviceId.ToString()
		                        };
		
		                        // Send the metric to Event Hub
		                        tasks.Add(client.SendAsync(data));
		                    }
		                    // Sleep a second
		                    Thread.Sleep(1000);
		                };
		
		                Task.WaitAll(tasks.ToArray());
		            }
		            catch (Exception exp)
		            {
		                Console.WriteLine("Error on send: " + exp.Message);
		            }
		
		        }
		    }
		}

	For now, you will receive a warning on lines that reference the Event class. Ignore these for now.

4. In the **Program.cs** file, set the value of the following variables at the beginning of the file to the corresponding values retrieved from your Event Hub in the Azure Management Portal.

	<table>
	<tr><th>Set this...</th><th>To this...</th></tr>
	<tr><td>eventHubName</td><td>The name of your event hub. For example, <strong>temperature</strong>.</td></tr>
	<tr><td>eventHubNamespace</td><td>The namespace of your event hub. For example, <strong>sensors-ns</strong>.</td></tr>
	<tr><td>sharedAccessPolicyName</td><td>The policy you created with send access. For example, <strong>devices</strong>.</td></tr>
	<tr><td>sharedAccessPolicyKey</td><td>The key for the policy with send access.</td></tr>
	</table>

4. In **Solution Explorer**, right-click **SendEvents** and **Add | Class**. Name the new class **Event.cs**. This will describe the message sent to Event Hub.

5. Replace the contents of **Event.cs** with the following.

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Runtime.Serialization;
		using System.Text;
		using System.Threading.Tasks;

		namespace SendEvents
		{
		    [DataContract]
		    public class Event
		    {
		    	[DataMember]
		    	public DateTime TimeStamp { get; set; }
		        [DataMember]
		        public int DeviceId { get; set; }
		        [DataMember]
		        public int Temperature { get; set; }
		    }
		}

	This class describes the data we are sending - the TimeStamp, a DeviceID and a Temperature value.

6. **Save All**, then run the application to populate Event Hub with messages.

##Create an Azure Virtual Network

In order for the topology running on the Storm cluster to communicate directly with HBase, you must provision both servers into an Azure Virtual Network.

1. Sign in to the [Azure Management portal][azure-portal].

2. On the bottom of the page, click **+NEW**, click **Network Services**, click **Virtual Network**, and then click **Quick Create**.

3. Type or select the following values:

	- **Name**: The name of your virtual network.
	- **Address space**: Choose an address space for the virtual network that is large enough to provide addresses for all nodes in the cluster. Otherwise the provision will fail.
	- **Maximum VM count**: Choose one of the Maximum VM counts.
	- **Location**: The location must be the same as the HBase cluster that you will create.
	- **DNS server**: This article uses internal DNS server provided by Azure, therefore you can choose **None**. More advanced networking configuration with custom DNS servers are also supported. For the detailed guidance, see [http://msdn.microsoft.com/library/azure/jj156088.aspx](http://msdn.microsoft.com/library/azure/jj156088.aspx).

4. Click **Create a Virtual Network**. The new virtual network name will appear in the list. Wait until the Status column shows **Created**.

5. In the main pane, click the virtual network you just created.

6. On the top of the page, click **DASHBOARD**.

7. Under **quick glance**, make a note of **VIRTUAL NETWORK ID**. You will need it when provisioning the Storm and HBase clusters.

8. On the top of the page, click **CONFIGURE**.

9. On the bottom of the page, the default subnet name is **Subnet-1**. Use the **add subnet** button to add **Subnet-2**. These subnets will house the Storm and HBase clusters.

	> [WACOM.NOTE] In this article, we will be using clusters with only one node. If you are creating multi-node clusters, you must verify the **CIDR(ADDRESS COUNT)** for the subnet that will be used for the cluster. The address count must be greater than the number of worker nodes plus seven (Gateway: 2, Headnode: 2, Zookeeper: 3). For example, if you need a 10 node HBase cluster, the address count for the subnet must be greater than 17 (10+7). Otherwise the deployment will fail.
	>
	> It is highly recommended to designate a single subnet for one cluster. 

11. Click **Save** on the bottom of the page.

##Create the HDInsight Storm cluster

1. Sign in to the [Azure Management Portal][azureportal]

2. Click **HDInsight** on the left, and then **+NEW** in the lower left corner of the page.

3. Click on the HDInsight icon in the second column, and then select **Custom**.

4. On the **Cluster Details** page, enter the name of the new cluster, and select **Storm** for the **Cluster Type**. Select the arrow to continue.

5. Enter 1 for the number of **Data Nodes** to use for this cluster. For **Region/Virtual Network**, select the Azure Virtual Network created earlier. For **Virtual Network Subnets**, select **Subnet-2**.

	> [WACOM.NOTE] To minimize the cost for the cluster used for this article, reduce the **Cluster Size** to 1, and delete the cluster after you have finished using it.

6. Enter the administrator **User Name** and **Password**, then select the arrow to continue.

4. For **Storage Account**, select **Create New Storage** or select an existing storage account. Select or enter the **Account Name** and **Default container** to use. Click on the check icon on the lower left to create the Storm cluster.

##Create the HDInsight HBase cluster

1. Sign in to the [Azure Management Portal][azureportal]

2. Click **HDInsight** on the left, and then **+NEW** in the lower left corner of the page.

3. Click on the HDInsight icon in the second column, and then select **Custom**.

4. On the **Cluster Details** page, enter the name of the new cluster, and select **HBase** for the **Cluster Type**. Select the arrow to continue.

5. Enter 1 for the number of **Data Nodes** to use for this cluster. For **Region/Virtual Network**, select the Azure Virtual Network created earlier. For **Virtual Network Subnets**, select **Subnet-1**.

	> [WACOM.NOTE] To minimize the cost for the cluster used for this article, reduce the **Cluster Size** to 1, and delete the cluster after you have finished using it.

6. Enter the administrator **User Name** and **Password**, then select the arrow to continue.

4. For **Storage Account**, select **Create New Storage** or select an existing storage account. Select or enter the **Account Name** and **Default container** to use. Click on the check icon on the lower left to create the Storm cluster.

	> [WACOM.NOTE] You should use a different container than the one used for the Storm cluster.

###Enable remote desktop

For this tutorial, we must use remote desktop to access the Storm and HBase clusters. Use these steps to enable Remote Desktop on both.

1. Sign in to the [Azure Management Portal][azureportal].

2. On the left, select **HDInsight**, then select your Storm cluster from the list. Finally, select **Configure** at the top of the page.

3. At the bottom of the page, select **Enable Remote**. When prompted enter a user name, password, and a date when Remote Desktop access will expire. Click the checkmark to enable Remote Desktop.

Once Remote Desktop has been enabled, you can select **Connect** at the bottom of the page. Follow the prompts to connect to the cluster.

###Discover the HBase DNS suffix

In order to write to HBase from the Storm cluster, you must use the fully qualified domain name (FQDN) for the HBase cluster. Use the following steps to discover this information.

1. Connect to the HBase cluster using Remote Desktop.

2. After connecting to the cluster, open the Hadoop Command Line and run the **ipconfig** command to obtain the DNS suffix. The **Connection-specific DNS Suffix** will contain the suffix value. For example, **mycluster.b4.internal.cloudapp.net**. Save this information.

##Develop the Storm topology

> [WACOM.NOTE] The steps in this section should be performed on your local development environment.

###Download and build external dependencies

Several of the dependencies used in this project must be downloaded and built individually, then installed into the local Maven repository on your development environment. In this section you will download and install.

* The Event Hub spout that reads messages from Event Hub.

* The SignalR Java client SDK

####Download and build the Event Hub spout

In order to receive data from Event Hub, we will use the **eventhubs-storm-spout**.

1. Use Remote Desktop to connect to your Storm cluster, then copy the **%STORM_HOME%\examples\eventhubspout\eventhubs-storm-spout-0.9-jar-with-dependencies.jar** file to your local development environment. This contains the **events-storm-spout**.

6. Use the following command to install the package into the local Maven store. This will allow us to easily add it as a reference in the Storm project in a later step.

		mvn install:install-file -Dfile=target\eventhubs-storm-spout-0.9-jar-with-dependencies.jar -DgroupId=com.microsoft.eventhubs -DartifactId=eventhubs-storm-spout -Dversion=0.9 -Dpackaging=jar

####Download and build the SignalR client

To send messages to the ASP.NET Dashboard, use the [SignalR client SDK for Java](https://github.com/SignalR/java-client).

1. Open a command prompt.

2. Change directories to where you want to download and store the SignalR client SDK project.

3. Use the following command to download the project from GitHub.

	git clone https://github.com/SignalR/java-client

4. Change directories into the **java-client\signalr-client-sdk** directory and compile the project into a JAR file using the following commands.

		cd java-client\signalr-client-sdk
		mvn package

	> [WACOM.NOTE] If you receive an error that the **gson** dependency cannot be downloaded, remove the following lines from the **java-client\signalr-client-sdk\pom.xml** file.
	> ```<repositories>
<repository>
<id>central</id>
<name>Central</name>
<url>http://maven.eclipse.org/build</url>
</repository>
</repositories>
```
	> Removing these lines will cause Maven to pull the file from the central repository (the default behavior.) To force Maven to retry the repository, use the `-U` command. For example, `mvn package -U`

6. Use the following command to install the package into the local Maven store. This will allow us to easily add it as a reference in the Storm project in a later step.

		mvn install:install-file -Dfile=target\signalr-client-sdk-1.0.jar -DgroupId=microsoft.aspnet.signalr -DartifactId=signalr-client-sdk -Dversion=1.0 -Dpackaging=jar

###Scaffold the Storm topology project

Now that we have installed the Event Hub spout and SignalR client into the local repository, use Maven to create the scaffolding for the Storm topology project.

1. Open a command prompt, Bash session, Terminal session, or whatever you use to type commands on your system.

2. Change directories to the location you wish to create this project. For example, if you have a directory you store all your code projects.

3. Use the following Maven command to create basic scaffolding for your application.

		mvn archetype:generate -DarchetypeArtifactId=maven-archetype-quickstart -DgroupId=com.microsoft.examples -DartifactId=TemperatureMonitor -DinteractiveMode=false

	This command will...

	* Create a new directory using the specified *artifactId*. In this case, **Temperature**.
	* Create a **pom.xml** file, which contains Maven information for this project.
	* Create a **src** directory structure, which contains some basic code and tests.

###Add dependencies and plugins

Next, modify the **pom.xml** to reference the dependencies for this project, as well as the Maven plugins to use when building and packaging.

1. Using a text editor, open the **pom.xml** file, and add the following to the **&lt;dependencies>** section. You can add them at the end of the section, after the dependency for junit.

		<dependency>
	      <groupId>org.apache.storm</groupId>
	      <artifactId>storm-core</artifactId>
	      <version>0.9.2-incubating</version>
	      <!-- keep storm out of the jar-with-dependencies -->
	      <scope>provided</scope>
	    </dependency>
	    <dependency>
	      <groupId>microsoft.aspnet.signalr</groupId>
	      <artifactId>signalr-client-sdk</artifactId>
	      <version>1.0</version>
	    </dependency>
	    <dependency>
	      <groupId>com.microsoft.eventhubs</groupId>
	      <artifactId>eventhubs-storm-spout</artifactId>
	      <version>0.9</version>
	    </dependency>
	    <dependency>
	      <groupId>com.google.code.gson</groupId>
	      <artifactId>gson</artifactId>
	      <version>2.2.2</version>
	    </dependency>
		<dependency>
      	  <groupId>com.github.ptgoetz</groupId>
      	  <artifactId>storm-hbase</artifactId>
      	  <version>0.1.2</version>
    	</dependency>
	    <dependency>
	      <groupId>com.netflix.curator</groupId>
	      <artifactId>curator-framework</artifactId>
	      <version>1.3.3</version>
	      <exclusions>
	        <exclusion>
	          <groupId>log4j</groupId>
	            <artifactId>log4j</artifactId>
	          </exclusion>
	        <exclusion>
	          <groupId>org.slf4j</groupId>
	            <artifactId>slf4j-log4j12</artifactId>
	        </exclusion>
	      </exclusions>
	      <scope>provided</scope>
	    </dependency>

	This adds dependencies for...

	* eventhubs-storm-spout - the Event Hub spout
	* signalr-client-sdk - the SignalR client
	* gson - this is a dependency of the SignalR client, and will also be used to create JSON when writing to SignalR
	* storm-core - provides core functionality for Storm applications
	* slf4j - provides logging capabilities and used by eventhubs-storm-spout
	* curator-framework - used by the eventhubs-storm-spout
	* storm-core - core classes for Storm
	* storm-hbase - classes that allow writing to HBase

	> [WACOM.NOTE] Note that some dependencies are marked with a scope of **provided** to indicate that these dependencies should be downloaded from the Maven repository and used to build and test the application locally, but that they will also be available in your runtime environment and do not need to be compiled and included in the JAR created by this project.

2. At the end of the **pom.xml** file, right before the **&lt;/project>** entry, add the following.

		  <build>
		    <plugins>
		      <plugin>
		        <groupId>org.apache.maven.plugins</groupId>
		        <artifactId>maven-compiler-plugin</artifactId>
		        <version>2.3.2</version>
		        <configuration>
		          <source>1.7</source>
		          <target>1.7</target>
		        </configuration>
		      </plugin>
		      <plugin>
		        <groupId>org.apache.maven.plugins</groupId>
		        <artifactId>maven-shade-plugin</artifactId>
		        <version>2.3</version>
		        <configuration>
		          <transformers>
		            <transformer implementation="org.apache.maven.plugins.shade.resource.ApacheLicenseResourceTransformer">
		            </transformer>
		          </transformers>
		        </configuration>
		        <executions>
		          <execution>
		            <phase>package</phase>
		            <goals>
		              <goal>shade</goal>
		            </goals>
		          </execution>
		        </executions>
		      </plugin>
		      <plugin>
		        <groupId>org.codehaus.mojo</groupId>
		        <artifactId>exec-maven-plugin</artifactId>
		        <version>1.2.1</version>
		        <executions>
		          <execution>
		          <goals>
		            <goal>exec</goal>
		          </goals>
		          </execution>
		        </executions>
		        <configuration>
		          <executable>java</executable>
		          <includeProjectDependencies>true</includeProjectDependencies>
		          <includePluginDependencies>false</includePluginDependencies>
		          <classpathScope>compile</classpathScope>
		          <mainClass>${storm.topology}</mainClass>
		        </configuration>
		      </plugin>
		    </plugins>
		    <resources>
		      <resource>
		        <directory>${basedir}/conf</directory>
		        <filtering>false</filtering>
		        <includes>
		          <include>Config.properties</include>
				  <include>hbase-site.xml</include>
		        </includes>
		      </resource>
		    </resources>
		  </build>

	This tells Maven to do the following when building the project:

	* Include the **/conf/Config.properties** resource file. This file will be created later, but it will contain configuration information for connecting to Azure Event Hub.
	* Include the **/conf/hbase-site.xml** resource file. This file will be created later, but it will contain information on how to connect to HBase
	* Use the **maven-compiler-plugin** to compile the application.
	* Use the **maven-shade-plugin** to build an uberjar or fat jar, which contains this project and any required dependencies.
	* Use the **exec-maven-plugin**, which allows you to run the application locally without a Hadoop cluster.

###Add configuration files

**eventhubs-storm-spout** reads configuration information from a **Config.properties** file. This tells it what Event Hub to connect to. While you can specify a configuration file when starting the topology on a cluster, including one in the project gives you a known default configuration.

1. In the **Temperature** directory, create a new directory named **conf**.

2. In the **conf** directory, create two new files:

	* **Config.properties** - contains settings for event hub
	* **hbase-site.xml** - contains settings for connecting to hbase

3. Use the following as the contents for the **Config.properties** file.

		eventhubspout.username = storm

		eventhubspout.password = <the key of the 'storm' policy>

		eventhubspout.namespace = <the event hub namespace>

		eventhubspout.entitypath = temperature

		eventhubspout.partitions.count = <the number of partitions for the event hub>

		# if not provided, will use storm's zookeeper settings
		# zookeeper.connectionstring=localhost:2181

		eventhubspout.checkpoint.interval = 10

		eventhub.receiver.credits = 1024

	Replace the **password** with the key for the **storm** policy created earlier on Event Hub. Replace **namespace** with the namespace of your Event Hub.

3. Use the following as the contents for the **hbase-site.xml** file.

		<?xml version="1.0"?>
		<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
		<!--
		/**
		 * Copyright 2010 The Apache Software Foundation
		 *
		 * Licensed to the Apache Software Foundation (ASF) under one
		 * or more contributor license agreements.  See the NOTICE file
		 * distributed with this work for additional information
		 * regarding copyright ownership.  The ASF licenses this file
		 * to you under the Apache License, Version 2.0 (the
		 * "License"); you may not use this file except in compliance
		 * with the License.  You may obtain a copy of the License at
		 *
		 *     http://www.apache.org/licenses/LICENSE-2.0
		 *
		 * Unless required by applicable law or agreed to in writing, software
		 * distributed under the License is distributed on an "AS IS" BASIS,
		 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		 * See the License for the specific language governing permissions and
		 * limitations under the License.
		 */
		-->
		<configuration>
		  <property>
		    <name>hbase.cluster.distributed</name>
		    <value>true</value>
		  </property>
		  <property>
		    <name>hbase.zookeeper.quorum</name>
		    <value>zookeeper0.suffix,zookeeper1.suffix,zookeeper2.suffix</value>
		  </property>
		  <property>
		    <name>hbase.zookeeper.property.clientPort</name>
		    <value>2181</value>
		  </property>
		</configuration>

3. In the **hbase-site.xml** file, replace the **suffix** value for the zookeeper entries with the DNS suffix you retrieved earlier for HBase. For example, **zookeeper0.mycluster.b4.internal.cloudapp.net, zookeeper1.mycluster.b4.internal.cloudapp.net, zookeeper2.mycluster.b4.internal.cloudapp.net**.

3. Save the files.

###Add helpers

To support serialization to and from JSON, we need some helper classes that define the object structure.

1. In the **\temperaturemonitor\src\main\java\com\microsoft\examples** directory, create a new directory named **helpers**.

2. In the **helpers** directory, create two new files:

	* **EventHubMessage.java** - defines the event hub message format

	* **SignalRMessage.java** - defines the format of the message sent to SignalR

3. Use the following as the contents of the **EventHubMessage.java** file.

		package com.microsoft.examples;

		public class EventHubMessage {
		  String TimeStamp;
		  int DeviceId;
		  int Temperature;
		}

4. Use the following as the contents of the **SignalRMessage.java** file.

		package com.microsoft.examples;

		public class SignalRMessage {
		  int device;
		  int temperature;
		}

5. Save and close these files.

###Add bolts

Bolts do the main processing in a topology. For this topology there are three bolts, though one is the hbase-bolt, which will be downloaded automatically when the project is built.

1. In the **\temperaturemonitor\src\main\java\com\microsoft\examples** directory, create a new directory named **bolts**.

2. In the **bolts** directory, create two new files:

	* **ParserBolt.java** - parses the incoming message from Event Hub into individual fields, then emits two streams
	* **DashboardBolt.java** - logs information to the web dashboard via SignalR

2. Use the following as the contents of the **ParserBolt.java** file.

		package com.microsoft.examples;
		
		import backtype.storm.topology.base.BaseBasicBolt;
		import backtype.storm.topology.BasicOutputCollector;
		import backtype.storm.topology.OutputFieldsDeclarer;
		import backtype.storm.tuple.Tuple;
		import backtype.storm.tuple.Fields;
		import backtype.storm.tuple.Values;
		
		import com.google.gson.Gson;
		import com.google.gson.GsonBuilder;
		
		public class ParserBolt extends BaseBasicBolt {
		
		  //Declare output fields & streams
		  //hbasestream is all fields, and goes to hbase
		  //dashstream is just the device and temperature, and goes to the dashboard
		  @Override
		  public void declareOutputFields(OutputFieldsDeclarer declarer) {
		    declarer.declareStream("hbasestream", new Fields("timestamp", "deviceid", "temperature"));
		    declarer.declareStream("dashstream", new Fields("deviceid", "temperature"));
		  }
		
		  //Process tuples
		  @Override
		  public void execute(Tuple tuple, BasicOutputCollector collector) {
		    Gson gson = new Gson();
		    //Should only be one tuple, which is the JSON message from the spout
		    String value = tuple.getString(0);
		
		    //Convert it from JSON to an object
		    EventHubMessage evMessage = gson.fromJson(value, EventHubMessage.class);
		    
		    //Pull out the values and emit as a stream
		    String timestamp = evMessage.TimeStamp;
		    int deviceid = evMessage.DeviceId;
		    int temperature = evMessage.Temperature;
		    collector.emit("hbasestream", new Values(timestamp, deviceid, temperature));
		    collector.emit("dashstream", new Values(deviceid, temperature));
		  }
		}

3. Use the following as the contents of the **DashboardBolt.java** file.

		package com.microsoft.examples;
		
		import backtype.storm.topology.BasicOutputCollector;
		import backtype.storm.topology.OutputFieldsDeclarer;
		import backtype.storm.topology.base.BaseBasicBolt;
		import backtype.storm.tuple.Tuple;
		import backtype.storm.task.TopologyContext;
		import backtype.storm.Config;
		import backtype.storm.Constants;
		
		import microsoft.aspnet.signalr.client.Action;
		import microsoft.aspnet.signalr.client.ErrorCallback;
		import microsoft.aspnet.signalr.client.LogLevel;
		import microsoft.aspnet.signalr.client.Logger;
		import microsoft.aspnet.signalr.client.MessageReceivedHandler;
		import microsoft.aspnet.signalr.client.hubs.HubConnection;
		import microsoft.aspnet.signalr.client.hubs.HubProxy;
		
		import com.google.gson.Gson;
		import com.google.gson.GsonBuilder;
		
		import java.util.Map;
		
		public class DashboardBolt extends BaseBasicBolt {
		  //Connection and proxy for SignalR hub
		  private HubConnection conn;
		  private HubProxy proxy;
		
		  //Declare output fields
		  @Override
		  public void declareOutputFields(OutputFieldsDeclarer declarer) {
		    //no stream output - we talk directly to SignalR
		  }
		
		  @Override
		  public void prepare(Map config, TopologyContext context) {
		
		    // Connect to the DashHub SignalR server
		    conn = new HubConnection("http://dashboard.azurewebsites.net/");
		    // Create the hub proxy
		    proxy = conn.createHubProxy("DashHub");
		    // Subscribe to the error event
		    conn.error(new ErrorCallback() {
		      @Override
		      public void onError(Throwable error) {
		        error.printStackTrace();
		      }
		    });
		    // Subscribe to the connected event
		    conn.connected(new Runnable() {
		      @Override
		      public void run() {
		        System.out.println("CONNECTED");
		      }
		    });
		    // Subscribe to the closed event
		    conn.closed(new Runnable() {
		      @Override
		      public void run() {
		        System.out.println("DISCONNECTED");
		      }
		    });
		    // Start the connection
		    conn.start()
		      .done(new Action<Void>() {
		        @Override
		        public void run(Void obj) throws Exception {
		          System.out.println("Done Connecting!");
		        }
		    });
		  }
		
		  //Process tuples
		  @Override
		  public void execute(Tuple tuple, BasicOutputCollector collector) {
		    Gson gson = new Gson();
		    try {
		      //Get the deviceid and temperature by field name
		      int deviceid = tuple.getIntegerByField("deviceid");
		      int temperature = tuple.getIntegerByField("temperature");
		      //Construct the SignalR message
		      SignalRMessage srMessage = new SignalRMessage();
		      srMessage.device = deviceid;
		      srMessage.temperature = temperature;
		      // send it as JSON
		      proxy.invoke("send", gson.toJson(srMessage));
		    } catch (Exception e) {
		       // LOG.error("Bolt execute error: {}", e);
		       collector.reportError(e);
		    }
		  }
		}

	Replace `http://yourwebsiteaddress` with the address of the Azure Website that you published the dashboard to earlier. For example, http://mydashboard.azurewebsites.net.

2. Save and close the files.

###Define the topology

The topology describes how data flows between the spouts and bolts in a topology, as well as degree of parallelism for the topology and the components within it.

1. In the **\temperaturemonitor\src\main\java\com\microsoft\examples** directory, create a new file named **Temperature.java**.

2. Open the **Temperature.java** file and use the following as the contents.

		package com.microsoft.examples;
		
		import backtype.storm.Config;
		import backtype.storm.LocalCluster;
		import backtype.storm.StormSubmitter;
		import backtype.storm.generated.StormTopology;
		import backtype.storm.topology.TopologyBuilder;
		import backtype.storm.tuple.Fields;
		import com.microsoft.eventhubs.spout.EventHubSpout;
		import com.microsoft.eventhubs.spout.EventHubSpoutConfig;
		
		import java.io.FileReader;
		import java.util.Properties;
		
		//hbase
		import org.apache.storm.hbase.bolt.mapper.SimpleHBaseMapper;
		import org.apache.storm.hbase.bolt.HBaseBolt;
		import java.util.Map;
		import java.util.HashMap;
		import backtype.storm.tuple.Fields;
		
		public class Temperature
		{
		  protected EventHubSpoutConfig spoutConfig;
		  protected int numWorkers;
		
		  // Reads the configuration information for the Event Hub spout
		  protected void readEHConfig(String[] args) throws Exception {
		    Properties properties = new Properties();
		    if(args.length > 1) {
		      properties.load(new FileReader(args[1]));
		    }
		    else {
		      properties.load(Temperature.class.getClassLoader().getResourceAsStream(
		        "Config.properties"));
		    }
		
		    String username = properties.getProperty("eventhubspout.username");
		    String password = properties.getProperty("eventhubspout.password");
		    String namespaceName = properties.getProperty("eventhubspout.namespace");
		    String entityPath = properties.getProperty("eventhubspout.entitypath");
		    String zkEndpointAddress = properties.getProperty("zookeeper.connectionstring");
		    int partitionCount = Integer.parseInt(properties.getProperty("eventhubspout.partitions.count"));
		    int checkpointIntervalInSeconds = Integer.parseInt(properties.getProperty("eventhubspout.checkpoint.interval"));
		    int receiverCredits = Integer.parseInt(properties.getProperty("eventhub.receiver.credits"));
		    System.out.println("Eventhub spout config: ");
		    System.out.println("  partition count: " + partitionCount);
		    System.out.println("  checkpoint interval: " + checkpointIntervalInSeconds);
		    System.out.println("  receiver credits: " + receiverCredits);
		    spoutConfig = new EventHubSpoutConfig(username, password,
		      namespaceName, entityPath, partitionCount, zkEndpointAddress,
		      checkpointIntervalInSeconds, receiverCredits);
		
		    //set the number of workers to be the same as partition number.
		    //the idea is to have a spout and a partial count bolt co-exist in one
		    //worker to avoid shuffling messages across workers in storm cluster.
		    numWorkers = spoutConfig.getPartitionCount();
		    
		    if(args.length > 0) {
		      //set topology name so that sample Trident topology can use it as stream name.
		      spoutConfig.setTopologyName(args[0]);
		    }
		  }
		
		  // Create the spout using the configuration
		  protected EventHubSpout createEventHubSpout() {
		    EventHubSpout eventHubSpout = new EventHubSpout(spoutConfig);
		    return eventHubSpout;
		  }
		
		  // Build the topology
		  protected StormTopology buildTopology(EventHubSpout eventHubSpout, SimpleHBaseMapper mapper) {
		    TopologyBuilder topologyBuilder = new TopologyBuilder();
		    // Name the spout 'EventHubsSpout', and set it to create
		    // as many as we have partition counts in the config file
		    topologyBuilder.setSpout("EventHub", eventHubSpout, spoutConfig.getPartitionCount())
		      .setNumTasks(spoutConfig.getPartitionCount());
		    // Create the parser bolt, which subscribes to the stream from EventHub
		    topologyBuilder.setBolt("Parser", new ParserBolt(), spoutConfig.getPartitionCount())
		      .localOrShuffleGrouping("EventHub").setNumTasks(spoutConfig.getPartitionCount());
		    // Create the dashboard bolt, which subscribes to the stream from Parser
		    topologyBuilder.setBolt("Dashboard", new DashboardBolt(), spoutConfig.getPartitionCount())
		      .fieldsGrouping("Parser", "dashstream", new Fields("deviceid")).setNumTasks(spoutConfig.getPartitionCount());
		    // Create the HBase bolt, which subscribes to the stream from Parser
		    // WARNING - uncomment the following two lines when deploying
			// leave commented when testing locally
			// topologyBuilder.setBolt("HBase", new HBaseBolt("SensorData", mapper).withConfigKey("hbase.conf"), spoutConfig.getPartitionCount())
		    //  .fieldsGrouping("Parser", "hbasestream", new Fields("deviceid")).setNumTasks(spoutConfig.getPartitionCount());
		    return topologyBuilder.createTopology();
		  }
		
		  protected void submitTopology(String[] args, StormTopology topology, Config config) throws Exception {
		    // Config config = new Config();
		    config.setDebug(false);
		
		    //Enable metrics
		    config.registerMetricsConsumer(backtype.storm.metric.LoggingMetricsConsumer.class, 1);
		
		    // Is this running locally, or on an HDInsight cluster?
		    if (args != null && args.length > 0) {
		      config.setNumWorkers(numWorkers);
		      StormSubmitter.submitTopology(args[0], config, topology);
		    } else {
		      config.setMaxTaskParallelism(2);
		
		      LocalCluster localCluster = new LocalCluster();
		      localCluster.submitTopology("test", config, topology);
		
		      Thread.sleep(5000000);
		
		      localCluster.shutdown();
		    }
		  }
		
		  // Loads the configuration, creates the spout, builds the topology,
		  // and then submits it
		  protected void runScenario(String[] args) throws Exception{
		    readEHConfig(args);
		    Config config = new Config();
		
		    //hbase configuration
		    Map<String, Object> hbConf = new HashMap<String, Object>();
		    if(args.length > 0) {
		      hbConf.put("hbase.rootdir", args[0]);
		    }
		    config.put("hbase.conf", hbConf);
		    SimpleHBaseMapper mapper = new SimpleHBaseMapper()
		          .withRowKeyField("deviceid")
		          .withColumnFields(new Fields("timestamp", "temperature"))
		          .withColumnFamily("cf");
		
		    EventHubSpout eventHubSpout = createEventHubSpout();
		    StormTopology topology = buildTopology(eventHubSpout, mapper);
		    submitTopology(args, topology, config);
		  }
		
		  public static void main(String[] args) throws Exception {
		    Temperature scenario = new Temperature();
		    scenario.runScenario(args);
		  }
		}

	> [AZURE.NOTE] Note that the lines for the **HBaseBolt** are commented out. This is because the next step is to run the topology locally. Since the HBaseBolt talks directly to HBase, this will return errors if it is enabled. Unless you've configured a virtual network with a DNS server and joined your local machine to the virtual network also.

###Test the topology locally

To compile and test the file on your development machine, use the following steps.

1. Start the **SendEvent** .NET application to begin sending events, so that we have something to read from Event Hub.

2. Open a web browser to the web dashboard you deployed earlier into an Azure Website. This will allow you to see the graph plot the values as they flow through the topology

2. Start the topology locally using the following command

	mvn compile exec:java -Dstorm.topology=com.microsoft.examples.Temperature

	This will start the topology, read files from Event Hub, and send them to the dashboard running in Azure Websites. You should see lines appear in the web dashboard.

3. After verifying that this works, stop the topology by entering Ctrl-C. To stop the SendEvent app, select the window and press any key.

###Enable the HBaseBolt and prepare HBase

1. Open the **Temperature.java** file and remove the comment (//) from the following lines:

		//topologyBuilder.setBolt("HBase", new HBaseBolt("SensorData", mapper).withConfigKey("hbase.conf"), spoutConfig.getPartitionCount())
    	//  .fieldsGrouping("Parser", "hbasestream", new Fields("deviceid")).setNumTasks(spoutConfig.getPartitionCount());

	This enables the HBase bolt.

2. Save **Temperature.java**.

3. Using Remote Desktop, connect to the HBase cluster.

4. From the desktop, start the HDInsight Command Line and enter the following commands.

		cd %hbase_home%
		bin\hbase shell

5. From the HBase shell, enter the following command to create a table that sensor data will be stored in.

		create 'SensorData', 'cf'

6. Verify that the table contains no data by entering the following command.

		scan 'SensorData'

Leave this prompt open in the HBase shell for now.

##Package and deploy the topology to HDInsight

On your development environment, use the following steps to run the Temperature topology on your HDInsight Storm Cluster.
	
1. Use the following command to create a JAR package from your project.

		mvn package

	This will create a file named **TemperatureMonitor-1.0-SNAPSHOT.jar** in the **target** directory of your project.

2. On your local development machine, start the **SendEvents** .NET application, so that we have some events to read.

1. Connect to your HDInsight Storm cluster using Remote Desktop, and copy the **TemperatureMonitor-1.0-SNAPSHOT.jar** file to the **c:\apps\dist\storm&lt;version number>** directory.

2. Use the **HDInsight Command Line** icon on the cluster desktop to open a new command prompt, and use the following commands to run the topology.

		cd %storm_home%
		bin\storm jar TemperatureMonitor-1.0-SNAPSHOT.jar com.microsoft.examples.Temperature Temperature

3. Once the topology has started, it may be a few seconds before items begin appearing on the web dashboard.

3. After items have appeared on the dashboard, switch to the Remote Desktop session on the HBase cluster.

4. From the HBase shell, enter the following command.

		scan 'SensorData'

	Note that this now returns several rows of data that have been written by the Storm topology.

5. To stop the topology, go to the Remote Desktop session with the Storm cluster and enter the following in the HDInsight Command Line.

		bin\storm kill Temperature

	After a few seconds, the topology will stop.

##Summary

You have now learned how to use Storm to read data from Event Hub, store data in HBase, and display information from Storm on an external dashboard using SignalR and D3.js.

* For more information on Apache Storm, see [https://storm.incubator.apache.org/](https://storm.incubator.apache.org/)

* For more information on HBase with HDInsight, see the [HBase with HDInsight Overview](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-overview/)

* For more information on SignalR, see [ASP.NET SignalR](http://signalr.net/)

* For more information on D3.js, see [D3.js - Data Driven Documents](http://d3js.org/)

* For information on creating topologies in .NET, see [Develop streaming data processing applications with SCP.NET and C# on Storm in HDInsight](/en-us/documentation/articles/hdinsight-hadoop-storm-scpdotnet-csharp-develop-streaming-data-processing-application/)

[azure-portal]: https://manage.windowsazure.com/
