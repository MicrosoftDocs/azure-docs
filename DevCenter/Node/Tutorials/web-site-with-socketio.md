<properties linkid="dev-nodejs-socketio-web-site" urlDisplayName="Socket.IO Web Site" pageTitle="Build a Node.js web site with Socket.IO - Windows Azure tutorial" metaKeywords="node.js, socket.io, windows azure, web sites" metaDescription="Learn how to use the Socket.IO module in a Node.js application hosted in a Windows Azure Web Site" metaCanonical="http://www.windowsazure.com/en-us/develop/net/web-site-with-socketio" umbracoNaviHide="0" disqusComments="1" writer="larryfr" editor="mollybos" manager="paulettm" /> 

#Build a Node.js Chat Application with Socket.IO on a Windows Azure Web Site

Socket.IO provides real-time communication between your node.js server and clients. This tutorial will walk you through hosting a Socket.IO based chat application as a Windows Azure Web Site. For more information on Socket.IO, see [http://socket.io/].

<div class="dev-callout"> 
<b>Note</b> 
	<p>The procedures in this task apply to Windows Azure Web Sites; for Cloud Services, see <a href="http://www.windowsazure.com/en-us/develop/nodejs/tutorials/app-using-socketio/">Build a Node.js Chat Application with Socket.IO on a Windows Azure Cloud Service</a>.</p> 
</div>

A screenshot of the completed application is below:

![A browser displaying the chat application][completed-app]

## <a id="Download"></a>Download the Chat Example

For this project, we will use the chat example from the [Socket.IO
GitHub repository]. Perform the following steps to download the example
and add it to the project you previously created.

1.  Create a local copy of the repository by using the **Clone** button. You may also use the **ZIP** button to download the project.

    ![A browser window viewing https://github.com/LearnBoost/socket.io/tree/master/examples/chat, with the ZIP download icon highlighted][chat-example-view]

3.  Navigate the directory structure of the local repository until you arrive at the **examples\\chat**
    directory. Copy the contents of this directory to a seperate directory such as
    **\\node\\chat**.

## <a id="Modify"></a>Modify App.js and Install Modules

Before deploying the application to Windows Azure, we must
make some minor modifications. Perform the following steps to the
app.js file:

1.  Open the app.js file in Notepad or other text editor.

2.  Find the **Module dependencies** section at the beginning of app.js and change the line containing **sio = require('..//..//lib//socket.io')** to **sio = require('socket.io')** as shown below:

		var express = require('express')
  		, stylus = require('stylus')
  		, nib = require('nib')
		//, sio = require('..//..//lib//socket.io'); //Original
  		, sio = require('socket.io');                //Updated

3.  Since Windows Azure Web Sites does not currently support WebSockets, add the following code to force long-polling:

		var io = sio.listen(app) //Original
		  , nicknames = {};      //Original

		io.configure(function () {                //Added
		  io.set('transports', ['xhr-polling']);  //Added
		});                                       //Added

	<div class="dev-callout"> 
	<b>Note</b> 
		<p>The Cloud Services version of this tutorial does support using WebSockets. For more information, see <a href="http://www.windowsazure.com/en-us/develop/nodejs/tutorials/app-using-socketio/">Build a Node.js Chat Application with Socket.IO on a Windows Azure Cloud Service</a>.</p> 
	</div>

3.  To ensure the application listens on the correct port, open
    app.js in Notepad or your favorite editor, and then change the
    following line by replacing **3000** with **process.env.PORT** as shown below:

        //app.listen(3000, function () {            //Original
		app.listen(process.env.PORT, function () {  //Updated
		  var addr = app.address();
		  console.log('   app listening on http://' + addr.address + ':' + addr.port);
		});

After saving the changes to app.js, use the following steps to
install required modules::

1.  From the command-line, change directories to the **\\node\\chat** directory and use the following command to install the modules required by this application:

        npm install

    This will install the modules listed in the package.json file. After
    the command completes, you should see output similar to the
    following:

    ![The output of the npm install command][]

2.  Since this example was originally a part of the Socket.IO GitHub
    repository, and directly referenced the Socket.IO library by
    relative path, Socket.IO was not referenced in the package.json
    file, so we must install it by issuing the following command:

        npm install socket.io -save

## <a id="Publish"></a>Create a Windows Azure Web Site and enable Git publishing

Follow these steps to create a Windows Azure Web Site, and then enable Git publishing for the web site.

<div class="dev-callout"><strong>Note</strong>
<p>To complete this tutorial, you need a Windows Azure account that has the Windows Azure Web Sites feature enabled.</p>
<ul>
<li>If you don't have an account, you can create a free trial account  in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A7171371E" target="_blank">Windows Azure Free Trial</a>.</li>
<li>If you have an existing account but need to enable the Windows Azure Web Sites preview, see <a href="../create-a-windows-azure-account/#enable" target="_blank">Enable Windows Azure preview features</a>.</li>
</ul>
</div>

1. From the command-line, change directories to the **\\node\chat** directory and use the following command to create a new Windows Azure Web Site and enable a Git repository for the web site and the local directory. This will also create a Git remote named 'azure'.

		azure site create mysitename --git

	You must replace 'mysitename' with a unique name for your web site.

2. Commit the existing files to the local reposotiry by using the following commands:

		git add .
		git commit -m "Initial commit"

3. Push the files to the Windows Azure Web Site repository with the following command:

		git push azure master

	You will receive status messages as modules are imported on the server. Once this process has completed, the application will be hosted on your Windows Azure Web Site.

 	<div class="dev-callout">
	<b>Note</b>
	<p>During module installation, you may notice errors that 'The imported project ... was not found'. These can safely be ignored.</p>
	</div>

4. To view the web site on Windows Azure, use the following command to launch your web browser and navigate to the hosted web site:

		azure site browse


[http://socket.io/]: http://socket.io/
[completed-app]: ../media/websitesocketcomplete.png
[Socket.IO GitHub repository]: https://github.com/LearnBoost/socket.io
[chat-example-view]: ../Media/socketio-2.PNG
[The output of the npm install command]: ../media/socketio-7.png