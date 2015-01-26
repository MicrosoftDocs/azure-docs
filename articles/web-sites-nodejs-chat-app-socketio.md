<properties pageTitle="Node.js Website using Socket.io - Azure tutorial" description="A tutorial that demonstrates using socket.io in a node.js website hosted on Azure." services="web-sites" documentationCenter="nodejs" authors="blackmist" manager="wpickett" editor="mollybos"/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="nodejs" ms.topic="article" ms.date="09/17/2014" ms.author="larryfr"/>




#Build a Node.js Chat Application with Socket.IO on an Azure Website

Socket.IO provides real-time communication between your node.js server and clients using WebSockets. It also supports fallback to other transports (such as long polling,) that work with older browsers. This tutorial will walk you through hosting a Socket.IO based chat application as an Azure Website. For more information on Socket.IO, see [http://socket.io/][socketio].

> [AZURE.NOTE] The procedures in this task apply to Azure Websites; for Cloud Services, see <a href="http://www.windowsazure.com/en-us/develop/nodejs/tutorials/app-using-socketio/">Build a Node.js Chat Application with Socket.IO on an Azure Cloud Service</a>.


## <a id="Download"></a>Download the Chat Example

For this project, we will use the chat example from the [Socket.IO
GitHub repository]. Perform the following steps to download the example
and add it to the project you previously created.

1.  Download a [ZIP or GZ archived release][release] of the Socket.IO project (version 1.0.6 was used for this document)


3.  Extract the archive and copy the **examples\\chat**
    directory to a new location. For example, 
    **\\node\\chat**.

## <a id="Modify"></a>Modify App.js and Install Modules

Before deploying the application to Azure, we must
make some minor modifications.

1.  Rename the **index.js** file to **app.js**. This allows Azure to detect that this is a Node.js application.

1.  Open the **app.js** file in Notepad or other text editor.

2.  Find the **Module dependencies** section at the beginning of app.js and change the line containing `var io = require('../..')(server);` to `var io = require('socket.io')(server);` as shown below:

		var express = require('express');
		var app = express();
		var server = require('http').createServer(app);
		// var io = require('../..')(server);
		var io = require('socket.io')(server);
		var port = process.env.PORT || 3000;


After saving the changes to app.js, use the following steps to
install required modules::

1.  From the command-line, change directories to the **\\node\\chat** directory and use the following command to install the modules required by this application:

        npm install

    This will install the modules listed in the package.json file. After
    the command completes, you should see output similar to the
    following:

	    express@3.4.8 node_modules\express
		├── methods@0.1.0
		├── merge-descriptors@0.0.1
		├── debug@0.8.1
		├── cookie-signature@1.0.1
		├── range-parser@0.0.4
		├── fresh@0.2.0
		├── buffer-crc32@0.2.1
		├── cookie@0.1.0
		├── mkdirp@0.3.5
		├── commander@1.3.2 (keypress@0.1.0)
		├── send@0.1.4 (mime@1.2.11)
		└── connect@2.12.0 (uid2@0.0.3, pause@0.0.1, qs@0.6.6, bytes@0.2.1, raw-body@1.1.2, batch@0.5.0, negotiator@0.3.0, multiparty@2.2.0)

2.  Since this example was originally a part of the Socket.IO GitHub
    repository, and directly referenced the Socket.IO library by
    relative path, Socket.IO was not referenced in the package.json
    file, so we must install it by issuing the following command:

        npm install socket.io@1.0.6 -save

	> [AZURE.NOTE] While newer versions of Socket.IO may work with the steps in this article, it was tested with version 1.0.6.

## <a id="Publish"></a>Create an Azure Website

Follow these steps to create an Azure Website, enable Git publishing, and then enable WebSocket support for the website.

> [AZURE.NOTE] To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account  in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A7171371E" target="_blank">Azure Free Trial</a>.

1. From the command-line, change directories to the **\\node\chat** directory and use the following command to create a new Azure Website and enable a Git repository for the website and the local directory. This will also create a Git remote named 'azure'.

		azure site create mysitename --git

	You must replace 'mysitename' with a unique name for your website.

2. Commit the existing files to the local repository by using the following commands:

		git add .
		git commit -m "Initial commit"

3. Push the files to the Azure Website repository with the following command:

		git push azure master

	You will receive status messages as modules are imported on the server. Once this process has completed, the application will be hosted on your Azure Website.

 	> [AZURE.NOTE] During module installation, you may notice errors that 'The imported project ... was not found'. These can safely be ignored.

4. Socket.IO uses WebSockets, which are not enabled by default on Azure. To enable web sockets, use the following command:

		azure site set -w

	If prompted, enter the name of the website.

	>[AZURE.NOTE]
	>The 'azure site set -w' command will only work with version 0.7.4 or higher of the Azure Cross-Platform Command-Line Interface. You can also enable WebSocket support using the Azure Management Portal.
	>
	>To enable WebSockets using the [Azure Management Portal](https://manage.windowsazure.com), select the Configure page for your website, select 'ON' for the Web Sockets entry, and then click Save.
	>	
	>![websockets](./media/web-sites-nodejs-chat-app-socketio/websockets.png)
	
5. To view the website on Azure, use the following command to launch your web browser and navigate to the hosted website:

		azure site browse

Your application is now running on Azure, and can relay chat
messages between different clients using Socket.IO.

> [AZURE.NOTE] For simplicity, this sample is limited to chatting between users connected to the same instance. This means that if the cloud service creates two worker role instances, users will only be able to chat with others connected to the same worker role instance. To scale the application to work with multiple role instances, you could use a technology like Service Bus to share the Socket.IO store state across instances. For examples, see the Service Bus Queues and Topics usage samples in the <a href="https://github.com/WindowsAzure/azure-sdk-for-node">Azure SDK for Node.js GitHub repository</a>.

##Scale out

Socket.IO applications can be scaled out by using an __adapter__ to distribute messages and events between multiple application instances. While there are several adapters available, the [socket.io-redis](https://github.com/automattic/socket.io-redis) adapter can be easily used with the Azure Redis Cache feature.

> [AZURE.NOTE] An additional requirement for scaling out a Socket.IO solution is support for sticky sessions. Sticky sessions are enabled by default for Azure Websites through Azure Request Routing. For more information, see [Instance Affinity in Azure Web Sites](http://azure.microsoft.com/blog/2013/11/18/disabling-arrs-instance-affinity-in-windows-azure-web-sites/)

###Create a Redis cache

Perform the steps in [Create a cache in Azure Redis Cache](http://go.microsoft.com/fwlink/p/?linkid=398592&clcid=0x409) to create a new cache.

> [AZURE.NOTE] Save the __Host name__ and __Primary key__ for your cache, as these will be needed in the next steps.

###Add the redis and socket.io-redis modules

1. From a command-line, change to the __\\node\\chat__ directory and use the following command.

		npm install socket.io-redis@0.1.3 redis@0.11.0 --save

	> [AZURE.NOTE] The versions specified in this command are the versions used when testing this article.

2. Modify the __app.js__ file to add the following lines immediately after `var io = require('socket.io')(server);`

		var pub = require('redis').createClient(6379,'redishostname', {auth_pass: 'rediskey', return_buffers: true});
		var sub = require('redis').createClient(6379,'redishostname', {auth_pass: 'rediskey', return_buffers: true});
		
		var redis = require('socket.io-redis');
		io.adapter(redis({pubClient: pub, subClient: sub}));


	Replace __redishostname__ and __rediskey__ with the host name and key for your Redis cache.

	This will create a publish and subscribe client to the Redis cache created previously. The clients are then used with the adapter to configure Socket.IO to use the Redis cache for passing messages and events between instances of your application

	> [AZURE.NOTE] While the __socket.io-redis__ adapter can communicate directly to Redis, the current version (as of 7/14/2014) does not support the authentication required by Azure Redis cache. So the initial connection is created using the __redis__ module, then the client is passed to the __socket.io-redis__ adapter.
	> 
	> While Azure Redis Cache supports secure connections using port 6380, the modules used in this example do not support secure connections as of 7/14/2014. The above code uses the default, unsecure port of 6380.

3. Save the modified __app.js__

###Commit changes and redeploy

From the command-line in the __\\node\\chat__ directory, use the following commands to commit changes and redeploy the application.

	git add .
	git commit -m "implementing scale out"
	git push azure master

Once the changes have been pushed to the server, you can scale your site across multiple instances by using the following command.

	azure site scale instances --instances #

Where __#__ is the number of instances to create. 

You can connect to your website from multiple browsers or computers to verify that messages are correctly sent to all clients.

##<a id="tshooting"></a>Troubleshooting

###Connection limits

Azure Websites is available in multiple SKUs, which determine the resources available to your site. This includes the number of allowed WebSocket connections. For more information, see the [Web Sites Pricing page][pricing].

###Messages aren't being sent using WebSockets

If client browsers keep falling back to long polling instead of using WebSockets, it may be because of one of the following.

* **Try limiting the transport to just WebSockets**

	In order for Socket.IO to use WebSockets as the messaging transport, both the server and client must support WebSockets. If one or the other does not, Socket.IO will negotiate another transport, such as long polling. The default list of transports used by Socket.IO is ` websocket, htmlfile, xhr-polling, jsonp-polling`. You can force it to only use WebSockets by adding the following code to the **app.js** file, after the line containing `, nicknames = {};`.

		io.configure(function() {
		  io.set('transports', ['websocket']);
		});

	> [AZURE.NOTE] Note that older browsers that do not support WebSockets will not be able to connect to the site while the above code is active, as it restricts communication to WebSockets only.

* **Use SSL**

	WebSockets relies on some lesser used HTTP headers, such as the **Upgrade** header. Some intermediate network devices, such as web proxies, may remove these headers. To avoid this problem, you can establish the WebSocket connection over SSL.

	An easy way to accomplish this is to configure Socket.IO to `match origin protocol`. This instructs Socket.IO to secure WebSockets communication the same as the originating HTTP/HTTPS request for the web page. If a browser uses an HTTPS URL to visit your website, subsequent WebSocket communications through Socket.IO will be secured over SSL.

	To modify this example to enable this configuration, add the following code to the **app.js** file after the line containing `, nicknames = {};`.

		io.configure(function() {
		  io.set('match origin protocol', true);
		});

* **Verify web.config settings**

	Azure Websites that host Node.js applications use the **web.config** file to route incoming requests to the Node.js application. For WebSockets to function correctly with Node.js applications, the **web.config** must contain the following entry.

		<webSocket enabled="false"/>

	This disables the IIS WebSockets module, which includes its own implementation of WebSockets and conflicts with Node.js specific WebSocket modules such as Socket.IO. If this line is not present, or is set to `true`, this may be the reason that the WebSocket transport is not working for your application.

	Normally, Node.js applications do not include a **web.config** file, so Azure Websites will automatically generate one for Node.js applications when they are deployed. Since this file is automatically generated on the server, you must use the FTP or FTPS URL for your website to view this file. You can find the FTP and FTPS URLs for your site in the Azure Management portal by selecting your website, and then the **Dashboard** link. The URLs are displayed in the **quick glance** section.

	> [AZURE.NOTE] The **web.config** file is only generated by Azure Websites if your application does not provide one. If you provide a **web.config** file in the root of your application project, it will be used by Azure Websites.

	If the entry is not present, or is set to a value of `true`, then you should create a **web.config** in the root of your Node.js application and specify a value of `false`.  For reference, the below is a default **web.config** for an application that uses **app.js** as the entry point.

		<?xml version="1.0" encoding="utf-8"?>
		<!--
		     This configuration file is required if iisnode is used to run node processes behind
		     IIS or IIS Express.  For more information, visit:
		
		     https://github.com/tjanczuk/iisnode/blob/master/src/samples/configuration/web.config
		-->
		
		<configuration>
		  <system.webServer>
		    <!-- Visit http://blogs.msdn.com/b/windowsazure/archive/2013/11/14/introduction-to-websockets-on-windows-azure-web-sites.aspx for more information on WebSocket support -->
		    <webSocket enabled="false" />
		    <handlers>
		      <!-- Indicates that the server.js file is a node.js site to be handled by the iisnode module -->
		      <add name="iisnode" path="app.js" verb="*" modules="iisnode"/>
		    </handlers>
		    <rewrite>
		      <rules>
		        <!-- Do not interfere with requests for node-inspector debugging -->
		        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
		          <match url="^app.js\/debug[\/]?" />
		        </rule>
		
		        <!-- First we consider whether the incoming URL matches a physical file in the /public folder -->
		        <rule name="StaticContent">
		          <action type="Rewrite" url="public{REQUEST_URI}"/>
		        </rule>
		
		        <!-- All other URLs are mapped to the node.js site entry point -->
		        <rule name="DynamicContent">
		          <conditions>
		            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
		          </conditions>
		          <action type="Rewrite" url="app.js"/>
		        </rule>
		      </rules>
		    </rewrite>
		    <!--
		      You can control how Node is hosted within IIS using the following options:
		        * watchedFiles: semi-colon separated list of files that will be watched for changes to restart the server
		        * node_env: will be propagated to node as NODE_ENV environment variable
		        * debuggingEnabled - controls whether the built-in debugger is enabled
		
		      See https://github.com/tjanczuk/iisnode/blob/master/src/samples/configuration/web.config for a full list of options
		    -->
		    <!--<iisnode watchedFiles="web.config;*.js"/>-->
		  </system.webServer>
		</configuration>

	> [AZURE.NOTE] If your application uses an entry point other than **app.js**, you must replace all occurrences of **app.js** with the correct entry point. For example, replacing **app.js** with **server.js**.

##Next steps

In this tutorial you learned how to create a chat application hosted in an Azure Website. You can also host this application as an Azure Cloud Service. For steps on how to accomplish this, see [Build a Node.js Chat Application with Socket.IO on an Azure Cloud Service][cloudservice].

[socketio]: http://socket.io/
[completed-app]: ./media/web-sites-nodejs-chat-app-socketio/websitesocketcomplete.png
[Socket.IO GitHub repository]: https://github.com/Automattic/socket.io
[release]: https://github.com/Automattic/socket.io/releases
[cloudservice]: /en-us/develop/nodejs/tutorials/app-using-socketio/

[chat-example-view]: ./media/web-sites-nodejs-chat-app-socketio/socketio-2.png
[npm-output]: ./media/web-sites-nodejs-chat-app-socketio/socketio-7.png
[pricing]: /en-us/pricing/details/web-sites/