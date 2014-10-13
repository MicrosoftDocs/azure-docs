<properties title="Analyzing sensor data with Storm and HDInsight" pageTitle="Analyzing sensor data with Apache Storm and Microsoft Azure HDInsight (Hadoop)" description="Learn how to use  Apache Storm to process sensor data in realtime with HDInsight (Hadoop)" metaKeywords="Azure hdinsight storm, Azure hdinsight realtime, azure hadoop storm, azure hadoop realtime, azure hadoop real-time, azure hdinsight real-time" services="hdinsight" solutions="" documentationCenter="big-data" authors="larryfr" videoId="" scriptId="" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/30/2014" ms.author="larryfr" />

#Analyzing sensor data with Storm and HDInsight (Hadoop)

Learn how to use build a solution that uses an HDInsight Storm cluster to process sensor data from Azure Event Hub. During processing, the Storm topology will store all data into an HDInsight HBase cluster. The topology will also use SignalR to provide information to a web-based dashboard.

[insert diagram]

> [AZURE.NOTE] A complete version of this project is available at [github location].

##Prerequisites

* An Azure subscription

* An HDInsight Storm cluster

* Visual Studio with the [Microsoft Azure SDK for .NET](http://azure.microsoft.com/en-us/downloads/archive-net-downloads/)

* [Java and JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

* [Maven](http://maven.apache.org/what-is-maven.html)

* [Git](http://git-scm.com/)

> [AZURE.NOTE] Java, the JDK, Maven, and Git are also available through the [Chocolatey NuGet](http://chocolatey.org/) package manager.

##Create the dashboard

The dashboard is used to display near-real time sensor information. In this case, the dashboard is an ASP.NET application hosted in an Azure Website. The application's primary purpose is to serve as a [SignalR](http://www.asp.net/signalr/overview/getting-started/introduction-to-signalr) hub that receives information from the Storm topology as it processes messages.

The website also contains a static index.html file, which also connects to SignalR, and uses D3.js to graph the data transmitted by the Storm topology.

> [WACOM.NOTE] While you could also use raw WebSockets instead of SignalR, WebSockets does not provide a built-in scaling mechanism if you need to scale out the web site. SignalR can be scaled using [TBD].
>
> For an example of using a Storm topology to communicate with a Python website using raw WebSockets, see the [Storm Tweet Sentiment D3 Visualization](https://github.com/P7h/StormTweetsSentimentD3Viz) project.

1. In Visual Studio, create a new C# application using the **ASP.NET Web Application** project template. Name the new application **Dashboard**.

2. In the **New ASP.NET Project** window, select the **Empty** application template. In the **Windows Azure** section, select **Host in the cloud** and **Web site**. Finally, click **Ok**.

	> [AZURE.NOTE] If prompted, sign in to your Azure subscription.

3. In the **Configure Windows Azure Site** dialog, enter a **Site name** and **Region** for your web site, then click **OK**. This will create the Azure Website that will host the dashboard.

3. In **Solution Explorer**, right-click the project and then select **Add | SignalR Hub Class (v2)**. Name the class **DashHub.cs** and add it to the project. This will contain the SignalR hub that is used to communicate data between HDInsight and the dashboard web page.

	> [AZURE.NOTE] If you are using Visual Studio 2012, the **SignalR Hub Class (v2)** template will not be available. You can add a plain **Class** called DashHub instead. You will also need to manually install the SignalR package by opening the **Tools | Library Package Manager | Package Manager Console and running the following command:
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
		            minValue = 0,                            //global vars for holding values coming in from signalr
		            maxValue = 0,
		            now = new Date(Date.now() - duration),   //Now
		            //fill an array of arrays with dummy data to start the chart
		            //each item in the top-level array is a line
		            //each item in the line arrays represents a Y coordinate and color
					//In this case, top line = min values (in blue), bottom line = max values (in red)
		            data = [
		                d3.range(n).map(function () { return { value: 0, color: 'blue' }; }),
		                d3.range(n).map(function () { return { value: 0, color: 'red' }; })
		            ];

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
		            //set the color to the color defined in the data
		            var path = linegroup.selectAll(".line")
		              .data(data)
		              .enter().append("path")
		              .attr("class", "line")
		              .attr("d", line)
		              .style("stroke", function (d, i) { return d[i].color; });

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
		                //stuff it in the global vars
		                minValue = incomingData.low;
		                maxValue = incomingData.high;
		            };
		            //start listening
		            $.connection.hub.start();
		            //tick for D3 graphics
		            tick();


		            function tick() {
		                // update the domains
		                now = new Date();
		                x.domain([now - (n - 2) * duration, now - duration]);

		                //push the (presumably) fresh data in the globals onto
		                //the arrays that define the lines.
		                data[0].push({ value: minValue, color: 'blue' });
		                data[1].push({ value: maxValue, color: 'red' });

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

15. The dashboard expects JSON formatted data, with a low and high value. For example **{"low":30, "high":80}**. Enter some test values on the **test.html** page, while the dashboard is open in another page. Note that the red (high) and blue (low) graph lines are drawn using the values you enter.

##Configure Event Hub

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

##Send messages to Event Hub

Event Hub is used to receive sensor data from sensors. Since there isn't an easy, standard set of sensors available to everyone, a .NET application is used to generate random numbers.

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

		namespace SendEvents
		{
		    class Program
		    {
		        static int numberOfMessages = 1000; // The number of messages to send
		        static int numberOfDevices = 10;    // The number of devices to send from

		        static string eventHubName = "the event hub name";
		        static string eventHubNamespace = "service bus namespace";
		        static string sharedAccessPolicyName = "shared access policy with write access";
		        static string sharedAccessPolicyKey = "key for the policy";

		        static void Main(string[] args)
		        {
					// Create a messaging factory based on the policy and namespace
		            var settings = new MessagingFactorySettings()
		            {
		                TokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider(sharedAccessPolicyName, sharedAccessPolicyKey),
		                TransportType = TransportType.Amqp
		            };
		            var factory = MessagingFactory.Create(
		                 ServiceBusEnvironment.CreateServiceUri("sb", eventHubNamespace, ""), settings);

					// Create the Event Hub client
		            EventHubClient client = factory.CreateEventHubClient(eventHubName);

		            try
		            {
		                List<Task> tasks = new List<Task>();
		                // Send messages to Event Hub
		                Console.WriteLine("Sending messages to Event Hub {0}", client.Path);
		                Random random = new Random();
		                for (int i = 0; i < numberOfMessages; ++i)
		                {
		                    // Create the device/temperature values randomly
		                   Event info = new Event() { DeviceId = random.Next(numberOfDevices), Temperature = random.Next(100) };
							// Serialize to JSON
		                    var serializedString = JsonConvert.SerializeObject(info);
		                    EventData data = new EventData(Encoding.UTF8.GetBytes(serializedString))
		                    {
		                        PartitionKey = info.DeviceId.ToString()
		                    };

		                    // Set user properties if needed
		                    data.Properties.Add("Type", "Telemetry_" + DateTime.Now.ToLongTimeString());
		                    //OutputMessageInfo("SENDING: ", data, info);

		                    // Send the metric to Event Hub
		                    tasks.Add(client.SendAsync(data));
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
	<tr><td>eventHubName</td><td>The name of your event hub. For example, **temperature**.</td></tr>
	<tr><td>eventHubNamespace</td><td>The namespace of your event hub. For example, **sensors-ns**.</td></tr>
	<tr><td>sharedAccessPolicyName</td><td>The policy you created with send access. For example, **devices**.</td></tr>
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
		        public int DeviceId { get; set; }
		        [DataMember]
		        public int Temperature { get; set; }
		    }
		}

	This class describes the data we are sending - a DeviceID and a Temperature value.

6. **Save All**, then run the application to populate Event Hub with messages.

##Create the Storm cluster

If you have not already created an HDInsight Storm cluster, see [Getting started using Storm with HDInsight](/en-us/documentation/articles/hdinsight-storm-getting-started.md) for steps on provisioning an HDInsight Storm cluster, as well as how to enable and connect to the cluster using Remote Desktop.

##Develop the Storm topology

> [WACOM.NOTE] The steps in this section should be performed on your local development environment.

###Download and build external dependencies

Several of the dependencies used in this project must be downloaded and built individually, then installed into the local Maven repository on your development environment. In this section you will download and install.

* The Event Hub spout that reads messages from Event Hub.

* The SignalR Java client SDK

####Download and build the Event Hub spout

In order to receive data from Event Hub, we will use the **eventhubs-storm-spout**.

[TBD - download from cluster or from GitHub?]

5. Use the following to build the spout and create a new JAR file containing the spout and dependencies.

	mvn package

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

	[finalize list of dependencies]

	This adds dependencies for...

	* eventhubs-storm-spout - the Event Hub spout
	* signalr-client-sdk - the SignalR client
	* gson - this is a dependency of the SignalR client, and will also be used to create JSON when writing to SignalR
	* storm-core - provides core functionality for Storm applications
	* slf4j - provides logging capabilities and used by eventhubs-storm-spout
	* curator-framework - used by the eventhubs-storm-spout
	* storm-core - core classes for Storm

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
		        </includes>
		      </resource>
		    </resources>
		  </build>

	This tells Maven to do the following when building the project:

	* Include the **/conf/Config.properties** resource file. This file will be created later, but it will contain configuration information for connecting to Azure Event Hub.
	* Use the **maven-compiler-plugin** to compile the application.
	* Use the **maven-shade-plugin** to build an uberjar or fat jar, which contains this project and any required dependencies.
	* Use the **exec-maven-plugin**, which allows you to run the application locally without a Hadoop cluster.

###Add the Event Hub spout configuration file

1. In the **Temperature** directory, create a new directory named **conf**.

2. In the **conf** directory, create a new file named **Config.properties** and add the following as the file contents.

		eventhubspout.username = <the name of the 'listen' policy>

		eventhubspout.password = <the key of the 'listen' policy>

		eventhubspout.namespace = <the event hub namespace>

		eventhubspout.entitypath = <the name of the event hub>

		eventhubspout.partitions.count = <the number of partitions for the event hub>

		# if not provided, will use storm's zookeeper settings
		# zookeeper.connectionstring=localhost:2181

		eventhubspout.checkpoint.interval = 10

		eventhub.receiver.credits = 1024

	Replace the **username**, **password**, **namespace**, **entitypath** and **count** with values for your Event Hub.

3. Save the file.

###Add helpers

1. In the **\temperaturemonitor\src\main\java\com\microsoft\examples** directory, create a new directory named **helpers**.

2. In the **helpers** directory, create two new files:

	* **EventHubMessage.java** - defines the event hub message format

	* **SignalRMessage.java** - defines the format of the message sent to SignalR

3. Use the following as the contents of the **EventHubMessage.java** file.

		package com.microsoft.examples;

		public class EventHubMessage {
		  int DeviceId;
		  int Temperature;
		}

4. Use the following as the contents of the **SignalRMessage.java** file.

		package com.microsoft.examples;

		public class SignalRMessage {
		  int low;
		  int high;
		}

5. Save and close these files.

###Add the bolts

1. In the **\temperaturemonitor\src\main\java\com\microsoft\examples** directory, create a new directory named **bolts**.

2. In the **bolts** directory, create a new file named **DashboardBolt.java**.

3. Use the following as the contents of the **DashboardBolt.java** file.

		package com.microsoft.examples;

		import backtype.storm.topology.BasicOutputCollector;
		import backtype.storm.topology.OutputFieldsDeclarer;
		import backtype.storm.topology.base.BaseBasicBolt;
		import backtype.storm.tuple.Tuple;
		import backtype.storm.tuple.Fields;
		import backtype.storm.tuple.Values;
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
		  private HubConnection conn;
		  private HubProxy proxy;
		  private int low;
		  private int high;

		  //Declare output fields
		  @Override
		  public void declareOutputFields(OutputFieldsDeclarer declarer) {
		    //no stream output - we talk directly to SignalR
		  }

		  @Override
		  public Map<String, Object> getComponentConfiguration() {
		    // configure how often a tick tuple will be sent to our bolt
		    Config conf = new Config();
		      conf.put(Config.TOPOLOGY_TICK_TUPLE_FREQ_SECS, 3);
		      return conf;
		  }

		  //received tick tuple?
		  protected static boolean isTickTuple(Tuple tuple) {
		    return tuple.getSourceComponent().equals(Constants.SYSTEM_COMPONENT_ID)
		        && tuple.getSourceStreamId().equals(Constants.SYSTEM_TICK_STREAM_ID);
		  }

		  @Override
		  public void prepare(Map config, TopologyContext context) {
		    //set  low/high to values that we know will be overwritten
		    high = -500;
		    low = 500;

		    // Connect to the server
		    conn = new HubConnection("http://yourwebsiteaddress");
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
		      if (isTickTuple(tuple)) {
		        SignalRMessage srMessage = new SignalRMessage();
		        //set the low/high for this interval
		        srMessage.low = low;
		        srMessage.high = high;
		        //send it as JSON
		        proxy.invoke("send", gson.toJson(srMessage));
		        //reset high/low so they will be overwritten for the next set
		        high = -500;
		        low = 500;
		        return;
		      }
		      //If it's not a tick tuple
		      //Get value by location, since we only have one
		      //string coming in each tuple
		      String value = tuple.getString(0);
		      //Convert it from JSON to an object
		      EventHubMessage evMessage = gson.fromJson(value, EventHubMessage.class);
		      //check temperature against current low/high for this batch
		      //set as new high/low if it's higher or lower
		      int temp = evMessage.Temperature;
		      if (temp > high) {
		        high = temp;
		      }
		      if (temp < low) {
		        low = temp;
		      }

		    } catch (Exception e) {
		       // LOG.error("Bolt execute error: {}", e);
		       collector.reportError(e);
		    }
		  }
		}

	Replace `http://yourwebsiteaddress` with the address of the Azure Website that you published the dashboard to earlier. For example, http://mydashboard.azurewebsites.net.

	This defines a bolt that reads that:

	* Configures a **tick tuple** to be sent every 3 seconds

	* Reads the incoming stream

	* If the tuple **is not** a tick tuple, we assume it contains device and temperature information and try to load it. We then see if the temperature is higher or lower than the current high and low values. If it is, we set the high or low to the temperature.

	* If the tuple **is** a tick tuple, we create a message with the current high and low values, and send it to the SignalR hub using the website address. This should happen every 3 seconds when a tick tuple occurs

2. Save and close the file.

###Define the topology

1. In the **\temperaturemonitor\src\main\java\com\microsoft\examples** directory, create a new file named **Temperature.java**.

2. Open the **Temperature.java** file and use the following as the contents.

		package com.microsoft.examples;

		import backtype.storm.Config;
		import backtype.storm.LocalCluster;
		import backtype.storm.StormSubmitter;
		import backtype.storm.task.OutputCollector;
		import backtype.storm.task.TopologyContext;
		import backtype.storm.topology.OutputFieldsDeclarer;
		import backtype.storm.topology.TopologyBuilder;
		import backtype.storm.topology.base.BaseRichBolt;
		import backtype.storm.tuple.Fields;
		import backtype.storm.tuple.Tuple;
		import backtype.storm.tuple.Values;
		import backtype.storm.utils.Utils;

		import backtype.storm.generated.StormTopology;
		import backtype.storm.topology.TopologyBuilder;

		import java.util.Map;

		import com.microsoft.eventhubs.spout.EventHubSpout;
		import com.microsoft.eventhubs.spout.EventHubSpoutConfig;

		import java.io.FileReader;
		import java.util.Properties;


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
		  protected StormTopology buildTopology(EventHubSpout eventHubSpout) {
		    TopologyBuilder topologyBuilder = new TopologyBuilder();
		    // Name the spout 'EventHubsSpout', and set it to create
		    // as many as we have partition counts in the config file
		    topologyBuilder.setSpout("EventHubsSpout", eventHubSpout, spoutConfig.getPartitionCount())
		      .setNumTasks(spoutConfig.getPartitionCount());
		    // Create the dashboard, but just one since we don't want to flood SignalR with
		    // multiple bolts sending to it every 3 seconds.
		    // Set it to accept a stream from 'EventHubsSpout'
		    topologyBuilder.setBolt("dashboard", new DashboardBolt(), spoutConfig.getPartitionCount())
		      .localOrShuffleGrouping("EventHubsSpout").setNumTasks(1);
		    return topologyBuilder.createTopology();
		  }

		  protected void submitTopology(String[] args, StormTopology topology) throws Exception {
		    Config config = new Config();
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
		    EventHubSpout eventHubSpout = createEventHubSpout();
		    StormTopology topology = buildTopology(eventHubSpout);
		    submitTopology(args, topology);
		  }

		  public static void main(String[] args) throws Exception {
		    Temperature scenario = new Temperature();
		    scenario.runScenario(args);
		  }
		}

##Test locally

To compile and test the file on your development machine, use the following command.

	mvn compile exec:java -Dstorm.topology=com.microsoft.examples.Temperature

This will start the topology, read files from Event Hub, and send them to the dashboard running in Azure Websites. You should open the dashboard in a browser before starting the application. To stop the application, use CTRL-C.

##Package and deploy the topology to HDInsight

Use the following steps to run the Temperature topology on your HDInsight Storm Cluster.

1. Use the following command to create a JAR package from your project.

		mvn package

	This will create a file named **TemperatureMonitor-1.0-SNAPSHOT.jar** in the **target** directory of your project.

1. Connect to your HDInsight Storm cluster using Remote Desktop, and copy the **TemperatureMonitor-1.0-SNAPSHOT.jar** file to the **c:\apps\dist\storm&lt;version number>** directory.

2. Use the **HDInsight Command Line** icon on the cluster desktop to open a new command prompt, and use the following commands to run the topology.

		cd %storm_home%
		bin\storm jar TemperatureMonitor-1.0-SNAPSHOT.jar com.microsoft.examples.Temperature Temperature

3. Once the topology has started, you can use the **Storm UI** icon on the desktop to view the status of the topology. For more information on using the **Storm UI**, see [Getting started using Storm with HDInsight](/en-us/documentation/articles/hdinsight-storm-getting-started.md).

4. To stop the topology