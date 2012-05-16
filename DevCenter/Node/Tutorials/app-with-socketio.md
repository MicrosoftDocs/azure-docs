<properties linkid="dev-nodejs-worker-app-with-socketio" urldisplayname="App Using Socket.IO" headerexpose="" pagetitle="Node.js Application using Socket.io" metakeywords="Azure Node.js socket.io tutorial, Azure Node.js socket.io, Azure Node.js tutorial" footerexpose="" metadescription="A tutorial that demonstrates using socket.io in a node.js application hosted on Windows Azure" umbraconavihide="0" disquscomments="1"></properties>

# Node.js Application using Socket.io

Socket.io provides realtime communication between between your node.js
server and clients. This tutorial will walk you through hosting a
socket.io based chat application on Windows Azure. For more information
on Socket.io, see [http://socket.io/][].

**Note:** The sample in this tutorial demonstrates using the Socket.IO
API on Windows Azure. For simplicity, the sample is limited to running
with a single Windows Azure worker role instance. This means that it
should not be used in a production setting, because production
applications must have at least two instances of each role in order to
meet the [Windows Azure Compute SLA][]. To scale the application to work
with multiple role instances, you could use a technology like Service
Bus to share the socket.io store state across instances. For examples,
see the Service Bus Queues and Topics usage samples in the [Windows
Azure SDK for Node.js GitHub repository][].

A screenshot of the completed application is below:

![A browser window displaying the service hosted on Windows Azure][]

## Objectives

In this tutorial you will learn how to:

-   Take into account Windows Azure specific considerations for
    Socket.io
-   Create a Windows Azure worker role application

## Key Technologies

-   Windows Azure Cloud Apps
-   Node.js Socket.IO library

## Setup

This tutorial assumes that you have installed the [Windows Azure SDK for
Node.js][] and have downloaded and installed the publishing settings for
your Windows Azure subscription. If you have not performed these tasks,
the [Node.js Web Application][] tutorial will guide you through this
process.

## Tutorial Segments

1.  [Windows Azure Considerations][]
2.  [Hosting the Chat Example in a Worker Role][]
3.  [Summary and Next Steps][]

## Windows Azure Considerations

When an application is hosted on Windows Azure, it only has access to
the ports configured in the ServiceDefinition.csdef file. By default,
the projects created using the **New-AzureService** cmdlet provided by
the [Windows Azure SDK for Node.js][] open port 80. However when running
the project in the Windows Azure emulator this port may be modified to a
different port such as 81. To ensure that your application always
receives traffic on correct port, you should use **process.env.port**,
which will be mapped to the correct port at runtime. For example:

    app.listen(process.env.port);

If your node application runs in a Web role (created using the
**Add-AzureNodeWebRole** cmdlet,) you must configure Socket.io to use a
transport other than WebSocket. This is because the Web role makes use
of IIS7, which doesn’t currently support WebSockets. The following is an
example of configuring Socket.io to use long-polling:

    io.configure(function () {
      io.set("transports", ["xhr-polling"]);
      io.set("polling duration", 10);
    });

**Note**: This tutorial uses a Worker role, so the above Web role
specific configuration is not used.

## Hosting the Chat Example in a Worker Role

The following steps will guide you through the process of creating a
Windows Azure deployment project that will host the Socket.io chat
example in a Worker role.

### Create a Project

1.  On the **Start** menu, click **All Programs, Windows Azure SDK
    Node.js - November 2011**, right-click **Windows Azure PowerShell**, and then select **Run As Administrator**. Opening your
    Windows PowerShell environment this way ensures that all of the Node
    command-line tools are available. Running with elevated privileges
    avoids extra prompts when working with the Windows Azure Emulator.

    ![The Windows start menu, expanded, selected on the Windows Azure
    PowerShell for Node.js item][]

2.  Create a new **node** directory on your C drive, and change to the
    c:\\node directory:

    ![A console prompt displaying mkdir c:\\node and then cd \\node][]

3.  Enter the following commands to create a new solution named
    **chatapp** and a worker role named **WorkerRole1**:

        PS C:\node> New-AzureService chatapp
        PS C:\node\chatapp> Add-AzureNodeWorkerRole

    You will see the following response:

    ![The output of the new-azureservice and add-azurenodeworkerrole
    cmdlets][]

### Download the Chat Example

For this project, we will use the [chat example][] from the Socket.io
GitHub repository. Perform the following steps to download the example
and add it to the project you previously created.

1.  Click the **ZIP** button to download a .zip archive of the project.

    ![A browser window viewing
    https://github.com/LearnBoost/socket.io/tree/master/examples/chat,
    with the ZIP download icon highlighted][]

2.  In Windows Explorer, right click the downloaded .zip file and select
    **Extract All**. When prompted, select a directory to extract the
    files to and then click Extract. The folder containing the extracted
    files should open.

    ![The Extract Compressed (Zipped) Folders dialog][]

3.  Navigate the folder structure until you arrive at the examples\\chat
    folder. Copy the contents of this folder to the
    C:\\node\\chatapp\\WorkerRole1 folder created earlier.

    ![Explorer, displaying the contents of the examples\\chat folder extracted from the archive][]

    After the copy operation completes, the contents of the WorkerRole1
    folder should appear as follows:

    ![Explorer, displaying the contents of the WorkerRole1 folder; app.js, index.jade, node.exe, package.json, server.js, setup\_worker.cmd and a public folder][]

4.  In the C:\\node\\chatapp\\WorkerRole1 folder, delete the server.js
    file, and then rename the app.js file to server.js. This removes the
    default server.js file created previously by the
    **Add-AzureNodeWorkerRole** cmdlet and replaces it with the
    application file from the chat example.

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
    the node\_modules folder when the application is run.

3.  To ensure the application listens on the correct port, open
    server.js in Notepad or your favorite editor, and then change the
    following line by replacing **3000** with **process.env.port**:

        app.listen(3000, function () {

4.  Also remove the line that begins with **console.log** as this is not
    useful when running in the Windows Azure emulator or after
    deployment to Windows Azure.

After saving the changes to server.js, use the following steps to
install required modules, and then test the application in the Windows
Azure emulator:

1.  If it is not already open, start the **Windows Azure PowerShell for
    Node.js** from the Start menu by expanding **All Programs, Windows
    Azure SDK Node.js - November 2011**, right-click **Windows Azure
    PowerShell for Node.js**, and then select **Run As Administrator**.

2.  Change directories to the folder containing your application. For
    example, C:\\node\\chatapp\\WorkerRole1.

3.  To install the modules required by this application, use the
    following npm command:

        PS C:\node\chatapp\WorkerRole1> npm install

    This will install the modules listed in the package.json file. After
    the command completes, you should see output similar to the
    following:

    ![The output of the npm install command][]

4.  Since this example was originally a part of the Socket.io GitHub
    repository, and directly referenced the Socket.io library by
    relative path, Socket.io was not referenced in the package.json
    file, so we must install it by issuing the following command:

        PS C:\node\chatapp\WorkerRole1> npm install socket.io

### Test and Deploy

1.  Launch the emulator by issuing the following command:

        PS C:\node\chatapp\WorkerRole1> Start-AzureEmulator -launch

    **Note**: If the browser window does not open automatically, you can
    manually open it and browse to the address returned by the
    **Start-AzureEmulator** command.

2.  When the browser window opens, enter a nickname and then hit enter.
    This will all you to post messages as a specific nickname. To test
    multi-user functionality, open additional browser windows using the
    same URL and enter different nicknames.

    ![Two browser windows displaying chat messages from User1 and
    User2][]

3.  After testing the application, stop the emulator by issuing the
    following command:

        PS C:\node\chatapp\WorkerRole1> Start-AzureEmulator -launch

4.  To deploy the application to Windows Azure, use the
    **Publish-AzureService** cmdlet. For example:

        PS C:\node\chatapp\WorkerRole1> Publish-AzureService -name chatapp -location "North Central US" -launch

    Be sure to use a unique name, otherwise the publish process will
    fail. After publishing is complete, you should see the following
    response.

    ![The output of the Publish-AzureService command][]

    After the deployment has completed, the browser will open and
    navigate to the deployed service.

    ![A browser window displaying the service hosted on Windows Azure][]

Your application is now running on Windows Azure, and can relay chat
messages between different clients using Socket.io.

## <a name="summary"> </a>Summary and Next Steps

In this tutorial, you learned how to host a sample chat application in a
Windows Azure worker role and use the Socket.io library to provide
realtime communication between between your Node.js server and clients.

### Next Steps

-   Learn more about web roles and worker roles by reading the
    conceptual overviews at <a>Creating a Hosted Service for Windows
    Azure</a>.
-   Explore more Windows Azure features in the <a>Windows Azure How-to
    Guides for Node.js</a>
-   Complete more end-to-end <a>Node.js tutorials</a>

  [http://socket.io/]: http://socket.io/
  [Windows Azure Compute SLA]: http://www.windowsazure.com/en-us/support/sla/
  [Windows Azure SDK for Node.js GitHub repository]: https://github.com/WindowsAzure/azure-sdk-for-node
  [A browser window displaying the service hosted on Windows Azure]: /media/nodejs/dev-nodejs-socketio-10.png
  [Windows Azure SDK for Node.js]: https://www.windowsazure.com/en-us/develop/nodejs/
  [Node.js Web Application]: https://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/
  [Windows Azure Considerations]: #windowsazureconsiderations
  [Hosting the Chat Example in a Worker Role]: #hostingthechatexampleinawebrole
  [Summary and Next Steps]: #summary
  [The Windows start menu, expanded, selected on the Windows Azure PowerShell for Node.js item]: ../../../DevCenter/Node/Media/node7.png
  [A console prompt displaying mkdir c:\\node and then cd \\node]: ../../../DevCenter/Node/Media/getting-started-6.png
  [The output of the new-azureservice and add-azurenodeworkerrole cmdlets]: /media/nodejs/dev-nodejs-socketio-1.png
  [chat example]: https://github.com/LearnBoost/socket.io/tree/master/examples/chat
  [A browser window viewing https://github.com/LearnBoost/socket.io/tree/master/examples/chat, with the ZIP download icon highlighted]: ../../../DevCenter/Node/Media/socketio-2.PNG
  [The Extract Compressed (Zipped) Folders dialog]: ../../../DevCenter/Node/Media/socketio-3.PNG
  [Explorer, displaying the contents of the examples\\chat folder extracted from the archive]: ../../../DevCenter/Node/Media/socketio-4.PNG
  [Explorer, displaying the contents of the WorkerRole1 folder; app.js, index.jade, node.exe, package.json, server.js, setup\_worker.cmd and a public folder]: /media/nodejs/dev-nodejs-socketio-5.png
  [The output of the npm install command]: /media/nodejs/dev-nodejs-socketio-7.png
  [Two browser windows displaying chat messages from User1 and User2]: /media/nodejs/dev-nodejs-socketio-8.png
  [The output of the Publish-AzureService command]: /media/nodejs/dev-nodejs-socketio-9.png
