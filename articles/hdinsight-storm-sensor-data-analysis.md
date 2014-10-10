<properties title="Analyzing sensor data with Storm and HDInsight" pageTitle="Analyzing sensor data with Apache Storm and Microsoft Azure HDInsight (Hadoop)" description="Learn how to use  Apache Storm to process sensor data in realtime with HDInsight (Hadoop)" metaKeywords="Azure hdinsight storm, Azure hdinsight realtime, azure hadoop storm, azure hadoop realtime, azure hadoop real-time, azure hdinsight real-time" services="hdinsight" solutions="" documentationCenter="big-data" authors="larryfr" videoId="" scriptId="" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/30/2014" ms.author="larryfr" />

#Analyzing sensor data with Storm and HDInsight (Hadoop)

Learn how to use build a solution that uses an HDInsight Storm cluster to process sensor data from Azure Event Hub. During processing, the Storm topology will store all data into an HDInsight HBase cluster. The topology will also use SignalR to provide information to a web-based dashboard.

[insert diagram]

##Prerequisites

* An Azure subscription

* Visual Studio with the [Microsoft Azure SDK for .NET](http://azure.microsoft.com/en-us/downloads/archive-net-downloads/)

* [Java]

* [Maven]

* [Git]

> [WACOM.NOTE] A complete version of this project is available at [github location].

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

<!-- commenting until this works
##Create the virtual network

An Azure Virtual Network allows the Storm cluster to communicate directly with the HBase cluster, without having to go through public gateways into and out of the Azure datacenter. This reduces latency between the systems.

[PowerShell]
-->

##Configure Event Hub

Event Hub is used to receive sensor data from sensors. Since not everyone has access to temperature sensors, use the following script to populate Event Hub with data.

[needs:]
* create
* delete
* send
* send-error

##Send messages to Event Hub

To send messages to Event Hub, we will use an ASP.NET application.

1. In Visual Studio, create a new **Windows Desktop** project and select the **Console Application** project template. Name the project **SendEvents** and then click **OK**.

2. In **Solution Explorer**, right-click **SendEvents** and then select **Manage NuGet packages**.

3. In **Manage NuGet Packages**, search for **Microsoft Azure Service Bus**. Install the **Microsoft Azure Service Bus** package. Accept the license agreement and, after the package has installed, **Close** the package manager.




##Create the Storm cluster

Use the following PowerShell script to create a new HDInsight Storm cluster.

[PowerShell]

> [WACOM.NOTE] The clusters created by this script have only one node each, in order to minimize costs. In a production scenario, each cluster would have multiple nodes.

After running the script, it should return the following information. Save this, as it will be used when developing and deploying the Storm topology.

	* DNS suffix for each cluster

##Develop the Storm topology

> [WACOM.NOTE] The steps in this section should be performed on your local development environment.

###Download and build external dependencies

One of the nice things provided by Maven is the ability to declare dependencies that are automatically downloaded from the Maven repository. However not everything is available through the repository. For this project, two of the dependencies must be downloaded and built locally. After that, they can be added to a local Maven repository for the project.

####Download and build the Event Hub spout

In order to receive data from Event Hub, we will use the [name-tbd] spout. Since this spout is contained in a separate project, we will need to download and build it. Later, we will include this in our topology project as a dependency.

1. Open a command prompt, Bash session, Terminal session, or whatever you use to type commands on your system.

[include steps to download the spout

5. Use the following to build the spout and create a new JAR file containing the spout and dependencies.

	mvn package

6. Use the following command to install the package into the local Maven store. This will allow us to easily add it as a reference in the Storm project in a later step.

		mvn install:install-file -Dfile=target\eventhubs-storm-spout-0.9-jar-with-dependencies.jar -DgroupId=com.microsoft.eventhubs -DartifactId=eventhubs-storm-spout -Dversion=0.9 -Dpackaging=jar

####Download and build the SignalR client

In order to send data to the dashboard, we will use the SignalR client SDK for Java. Since this is contained in a separate project, we will need to download and build it. Later, we will include this in our topology project as a dependency.

1. Open a command prompt, Bash session, Terminal session, or whatever you use to type commands on your system.

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

		mvn archetype:generate -DarchetypeArtifactId=maven-archetype-quickstart -DgroupId=com.microsoft.examples -DartifactId=Temperature -DinteractiveMode=false

	This command will...

	* Create a new directory using the specified *artifactId*. In this case, **Temperature**.
	* Create a **pom.xml** file, which contains Maven information for this project.
	* Create a **src** directory structure, which contains some basic code and tests.

###Add dependencies and plugins

1. Using a text editor, open the **pom.xml** file, and add the following to the **&lt;dependencies>** section. You can add them at the end of the section, after the dependency for junit.

		<dependency>
	      <groupId>org.apache.storm</groupId>
	      <artifactId>storm-core</artifactId>
	      <version>0.9.1-incubating</version>
	      <!-- keep storm out of the jar-with-dependencies -->
	      <scope>provided</scope>
	    </dependency>
	    <dependency>
	      <groupId>org.slf4j</groupId>
	      <artifactId>slf4j-api</groupId>
	      <version>1.7.7</version>
	      <!-- keep slf4j out of the jar-with-dependencies -->
	      <scope>provided</scope>
	    </dependency>
		<dependency>
          <groupId>com.microsoft.eventhubs</groupId>
          <artifactId>eventhubs-storm-spout</artifactId>
          <version>0.9</version>
    	</dependency>
		<dependency>
	      <groupId>microsoft.aspnet.signalr</groupId>
	      <artifactId>signalr-client-sdk</artifactId>
	      <version>1.0</version>
	    </dependency>
	    <dependency>
	      <groupId>com.google.code.gson</groupId>
	      <artifactId>gson</artifactId>
	      <version>2.2.2</version>
	    </dependency>

	[finalize list of dependencies]

	This adds dependencies for...

	* eventhubs-storm-spout - the Event Hub spout we compiled earlier
	* signalr-client-sdk - the SignalR client we compiled earlier
	* gson - this is a dependency of the SignalR client, and will also be used to create JSON when writing to SignalR.
	* storm-core - provides core functionality for Storm applications
	* slf4j - provides logging capabilities

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

	[finalize plugins list]

	This tells Maven to do the following when building the project:

	* Include the **/conf/Config.properties** file. This file will be created later, but it will contain configuration information for connecting to Azure Event Hub.
	* Use the **maven-compiler-plugin** to compile the application.
	* Use the **maven-shade-plugin** to build an uberjar or fat jar, which contains this project and any required dependencies.
	* Use the **exec-maven-plugin**, which allows you to run the application locally without a Hadoop cluster.

###Add the Event Hub spout configuration file

1. In the **Temperature** directory, create a new directory named **conf**.

2. In the **conf** directory, create a new file named **Config.properties** and add the following as the file contents.

		eventhubspout.username = <the policy name>

		eventhubspout.password = <the policy SAS key>
		
		eventhubspout.namespace = <the namespace of your event hub>
		
		eventhubspout.entitypath = temperature
		
		eventhubspout.partitions.count = < the number of partitions>
		
		# if not provided, will use storm's zookeeper settings
		# zookeeper.connectionstring=localhost:2181
		
		eventhubspout.checkpoint.interval = 10
		
		eventhub.receiver.credits = 1024

	[add text about getting the values above from the create event hub steps]

3. Save the file.

###Add the bolts



###Define the topology

1. In the **\temperature\src\main\java\com\microsoft\examples\temperature** directory, create a new file named **TemperatureTopology.java**.

2. Open the **TemperatureTopology.java** file and use the following as the contents.

		[code goes here]

##Test locally

mvn compile exec:java -Dstorm.topology=com.microsoft.examples.Temperature