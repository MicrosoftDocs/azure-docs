<properties linkid="dev-nodejs-worker-app-with-socketio" urlDisplayName="App Using Socket.IO" pageTitle="Node.js application using Socket.io - Windows Azure tutorial" metaKeywords="Azure Node.js socket.io tutorial, Azure Node.js socket.io, Azure Node.js tutorial" metaDescription="A tutorial that demonstrates using socket.io in a node.js application hosted on Windows Azure" metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

# Build a Node.js Chat Application with Socket.IO on a Windows Azure Cloud Service

Socket.IO provides realtime communication between between your node.js
server and clients. This tutorial will walk you through hosting a
socket.IO based chat application on Windows Azure. For more information
on Socket.IO, see [http://socket.io/].

A screenshot of the completed application is below:

![A browser window displaying the service hosted on Windows Azure][completed-app]  



## Create a Cloud Service Project

The following steps create the cloud service project that will host the Socket.IO application.

1. From the **Start Menu** or **Start Screen**, search for **Windows Azure PowerShell**. Finally, right-click **Windows Azure PowerShell** and select **Run As Administrator**.

	![Windows Azure PowerShell icon][powershell-menu]

	<div chunk="../Chunks/install-dev-tools.md" />

2. Change directories to the **c:\\node** directory and then enter the following commands to create a new solution named **chatapp** and a worker role named **WorkerRole1**:

		PS C:\node> New-AzureServiceProject chatapp
		PS C:\Node> Add-AzureNodeWorkerRole

	You will see the following response:

	![The output of the new-azureservice and add-azurenodeworkerrole
    cmdlets][add-workerrole]

## Download the Chat Example

For this project, we will use the chat example from the [Socket.IO
GitHub repository]. Perform the following steps to download the example
and add it to the project you previously created.

1.  Create a local copy of the repository by using the **Clone** button. You may also use the **ZIP** button to download the project.

    ![A browser window viewing https://github.com/LearnBoost/socket.io/tree/master/examples/chat, with the ZIP download icon highlighted][chat-example-view]

3.  Navigate the directory structure of the local repository until you arrive at the **examples\\chat**
    directory. Copy the contents of this directory to the
    **C:\\node\\chatapp\\WorkerRole1** directory created earlier.

    ![Explorer, displaying the contents of the examples\\chat directory extracted from the archive][chat-contents]

    The highlighted items in the screenshot above are the files copied from the **examples\\chat** directory

4.  In the **C:\\node\\chatapp\\WorkerRole1** directory, delete the **server.js** file, and then rename the **app.js** file to **server.js**. This removes the default **server.js** file created previously by the **Add-AzureNodeWorkerRole** cmdlet and replaces it with the application file from the chat example.

### Modify Server.js and Install Modules

Before testing the application in the Windows Azure emulator, we must
make some minor modifications. Perform the following steps to the
server.js file:

1.  Open the server.js file in Notepad or other text editor.

2.  Find the **Module dependencies** section at the beginning of server.js and change the line containing **sio = require('..//..//lib//socket.io')** to **sio = require('socket.io')** as shown below:

		var express = require('express')
  		, stylus = require('stylus')
  		, nib = require('nib')
		//, sio = require('..//..//lib//socket.io'); //Original
  		, sio = require('socket.io');                //Updated

3.  To ensure the application listens on the correct port, open
    server.js in Notepad or your favorite editor, and then change the
    following line by replacing **3000** with **process.env.port** as shown below:

        //app.listen(3000, function () {            //Original
		app.listen(process.env.port, function () {  //Updated
		  var addr = app.address();
		  console.log('   app listening on http://' + addr.address + ':' + addr.port);
		});

After saving the changes to server.js, use the following steps to
install required modules, and then test the application in the Windows
Azure emulator:

1.  Using **Windows Azure PowerShell**, change directories to the **C:\\node\\chatapp\\WorkerRole1** directory and use the following command to install the modules required by this application:

        PS C:\node\chatapp\WorkerRole1> npm install

    This will install the modules listed in the package.json file. After
    the command completes, you should see output similar to the
    following:

    ![The output of the npm install command][]

4.  Since this example was originally a part of the Socket.IO GitHub
    repository, and directly referenced the Socket.IO library by
    relative path, Socket.IO was not referenced in the package.json
    file, so we must install it by issuing the following command:

        PS C:\node\chatapp\WorkerRole1> npm install socket.io -save

### Test and Deploy

1.  Launch the emulator by issuing the following command:

        PS C:\node\chatapp\WorkerRole1> Start-AzureEmulator -Launch

2.  When the browser window opens, enter a nickname and then hit enter.
    This will all you to post messages as a specific nickname. To test
    multi-user functionality, open additional browser windows using the
    same URL and enter different nicknames.

    ![Two browser windows displaying chat messages from User1 and User2][]

3.  After testing the application, stop the emulator by issuing the
    following command:

        PS C:\node\chatapp\WorkerRole1> Stop-AzureEmulator

4.  To deploy the application to Windows Azure, use the
    **Publish-AzureServiceProject** cmdlet. For example:

        PS C:\node\chatapp\WorkerRole1> Publish-AzureServiceProject -ServiceName mychatapp -Location "East US" -Launch

	<div class="dev-callout">
	<strong>Note</strong>
	<p>Be sure to use a unique name, otherwise the publish process will fail. After the deployment has completed, the browser will open and navigate to the deployed service.</p>
	<p>If you receive an error stating that the provided subscription name doesn't exist in the imported publish profile, you must download and import the publishing profile for your subscription before deploying to Windows Azure. See the <b>Deploying the Application to Windows Azure</b> section of <a href="https://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/">Build and deploy a Node.js application to a Windows Azure Cloud Service</a></p>
	</div>

    ![A browser window displaying the service hosted on Windows Azure][completed-app]

	<div class="dev-callout">
	<strong>Note</strong>
	<p>If you receive an error stating that the provided subscription name doesn't exist in the imported publish profile, you must download and import the publishing profile for your subscription before deploying to Windows Azure. See the <b>Deploying the Application to Windows Azure</b> section of <a href="https://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/">Build and deploy a Node.js application to a Windows Azure Cloud Service</a></p>
	</div>

Your application is now running on Windows Azure, and can relay chat
messages between different clients using Socket.IO.

<div class="dev-callout">
<strong>Note</strong>
<p>For simplicity, this sample is limited to chatting between users connected to the same instance. This means that if the cloud service creates two worker role instances, users will only be able to chat with others connected to the same worker role instance. To scale the application to work with multiple role instances, you could use a technology like Service Bus to share the Socket.IO store state across instances. For examples, see the Service Bus Queues and Topics usage samples in the <a href="https://github.com/WindowsAzure/azure-sdk-for-node">Windows Azure SDK for Node.js GitHub repository</a>.</p>
</div>

##Next steps

In this tutorial you learned how to create a basic chat application hosted in a Windows Azure Cloud Service. To learn how to host this application in a Windows Azure Web Site, see [Build a Node.js Chat Application with Socket.IO on a Windows Azure Web Site][chatwebsite].

  [chatwebsite]: /en-us/develop/nodejs/tutorials/website-using-socketio/

  [http://socket.io/]: http://socket.io/
  [Windows Azure SLA]: http://www.windowsazure.com/en-us/support/sla/
  [Windows Azure SDK for Node.js GitHub repository]: https://github.com/WindowsAzure/azure-sdk-for-node
  [completed-app]: ../Media/socketio-10.png
  [Windows Azure SDK for Node.js]: https://www.windowsazure.com/en-us/develop/nodejs/
  [Node.js Web Application]: https://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/
  [Socket.IO GitHub repository]: https://github.com/LearnBoost/socket.io
  [Windows Azure Considerations]: #windowsazureconsiderations
  [Hosting the Chat Example in a Worker Role]: #hostingthechatexampleinawebrole
  [Summary and Next Steps]: #summary
  [powershell-menu]: ../../Shared/Media/azure-powershell-start.png
  [mkdir]: ../Media/getting-started-6.png
  [add-workerrole]: ../media/socketio-1.png
  [chat example]: https://github.com/LearnBoost/socket.io/tree/master/examples/chat
  [chat-example-view]: ../Media/socketio-2.PNG
  [zip-folder]: ../Media/socketio-3.PNG
  [workerrole-folder]: ../Media/socketio-4.PNG
  [chat-contents]: ../media/socketio-5.png
  [The output of the npm install command]: ../media/socketio-7.png
  [Two browser windows displaying chat messages from User1 and User2]: ../media/socketio-8.png
  [The output of the Publish-AzureService command]: ../media/socketio-9.png
  [dependencies]: ../media/module-dependencies.png