<properties linkid="dev-nodejs-worker-app-with-socketio" urldisplayname="App Using Socket.IO" headerexpose="" pagetitle="Node.js Application using Socket.io" metakeywords="Azure Node.js socket.io tutorial, Azure Node.js socket.io, Azure Node.js tutorial" footerexpose="" metadescription="A tutorial that demonstrates using socket.io in a node.js application hosted on Windows Azure" umbraconavihide="0" disquscomments="1"></properties>

# Building a Node.js Chat Application using Socket.io

Socket.io provides realtime communication between between your node.js
server and clients. This tutorial will walk you through hosting a
socket.io based chat application on Windows Azure. For more information
on Socket.io, see [http://socket.io/].

A screenshot of the completed application is below:

![A browser window displaying the service hosted on Windows Azure][completed-app]  



## Create a cloud service project

The following steps create the cloud service project that will host the socket.io application.

1. From the **Start Menu** or **Start Screen**, search for **Windows Azure PowerShell**. Finally, right-click **Windows Azure PowerShell** and select **Run As Administrator**.

	![Windows Azure PowerShell icon][powershell-menu]

	<div class="dev-callout">
	<strong>Note</strong>
	<p>If Windows Azure PowerShell does not appear when searching from the Start Menu or Start Screen, you must install the <a href="http://go.microsoft.com/fwlink/?LinkId=254279&clcid=0x409">Windows Azure SDK for Node.js</a>.</p>
	</div>

2. Change directories to the **c:\\node** directory and then enter the following commands to create a new solution named **chatapp** and a worker role named **WorkerRole1**:

		PS C:\node> New-AzureServiceProject chatapp
		PS C:\Node> Add-AzureNodeWorkerRole

	You will see the following response:

	![The output of the new-azureservice and add-azurenodeworkerrole
    cmdlets][add-workerrole]

## Download the Chat Example

For this project, we will use the chat example from the [Socket.io
GitHub repository]. Perform the following steps to download the example
and add it to the project you previously created.

1.  Create a local copy of the repository by using the **Clone** button. You may also use the **ZIP** button to download the project.

    ![A browser window viewing https://github.com/LearnBoost/socket.io/tree/master/examples/chat, with the ZIP download icon highlighted][chat-example-view]

	<div class="dev-callout">
	<strong>Note</strong>
	<p>If you download a .zip archive of the project, you must extract the archive before continuing.</p>
	</div>

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

2.  Modifiy the require statement for socket.io by removing the
    ‘../../lib/’ from the beginning of the string. The modified
    statement should appear as:

        , sio = require('socket.io');

    This will ensure that the socket.io library is correctly loaded from
    the node\_modules directory when the application is run.

3.  To ensure the application listens on the correct port, open
    server.js in Notepad or your favorite editor, and then change the
    following line by replacing **3000** with **process.env.port**:

        app.listen(3000, function () {

After saving the changes to server.js, use the following steps to
install required modules, and then test the application in the Windows
Azure emulator:

1.  Using **Windows Azure PowerShell**, change directories to the **C:\\Node\\Chatapp\\WorkerRole1** directory and use the following command to install the modules required by this application:

        PS C:\node\chatapp\WorkerRole1> npm install

    This will install the modules listed in the package.json file. After
    the command completes, you should see output similar to the
    following:

    ![The output of the npm install command][]

4.  Since this example was originally a part of the Socket.io GitHub
    repository, and directly referenced the Socket.io library by
    relative path, Socket.io was not referenced in the package.json
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

    Be sure to use a unique name, otherwise the publish process will
    fail. After the deployment has completed, the browser will open and
    navigate to the deployed service.

    ![A browser window displaying the service hosted on Windows Azure][completed-app]

	<div class="dev-callout">
	<strong>Note</strong>
	<p>If you receive an error stating that the provided subscription name doesn't exist in the imported publish profile, you must download and import the publishing profile for your subscription before deploying to Windows Azure. See the <b>Deploying the Application to Windows Azure</b> section of <a href="https://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/">Build and deploy a Node.js application to a Windows Azure Cloud Service</a></p>
	</div>

Your application is now running on Windows Azure, and can relay chat
messages between different clients using Socket.io.

<div class="dev-callout">
<strong>Note</strong>
<p>For simplicity, this sample is limited to chatting between users connected to the same instance. This means that if the cloud service creates two worker role instances, users will only be able to chat with others connected to the same worker role instance. To scale the application to work with multiple role instances, you could use a technology like Service Bus to share the socket.io store state across instances. For examples, see the Service Bus Queues and Topics usage samples in the <a href="https://github.com/WindowsAzure/azure-sdk-for-node">Windows Azure SDK for Node.js GitHub repository</a>.</p>
</div>

  [http://socket.io/]: http://socket.io/
  [Windows Azure SLA]: http://www.windowsazure.com/en-us/support/sla/
  [Windows Azure SDK for Node.js GitHub repository]: https://github.com/WindowsAzure/azure-sdk-for-node
  [completed-app]: ../Media/socketio-10.png
  [Windows Azure SDK for Node.js]: https://www.windowsazure.com/en-us/develop/nodejs/
  [Node.js Web Application]: https://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/
  [Socket.io GitHub repository]: https://github.com/LearnBoost/socket.io
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