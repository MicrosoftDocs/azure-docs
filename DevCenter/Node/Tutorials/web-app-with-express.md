<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-nodejs-basic-web-app-with-express" urlDisplayName="Web App With Express" headerExpose="" pageTitle="Web App With Express" metaKeywords="Azure Node.js hello world tutorial, Azure Node.js hello world, Azure Node.js Getting Started tutorial, Azure Node.js tutorial, Azure Node.js Express tutorial" footerExpose="" metaDescription="An tutorial that builds on the Web app tutorial, and demonstrates how to use the Express module" umbracoNaviHide="0" disqusComments="1" />
  <h1 id="node.jswebapplicationusingexpress">Node.js Web Application using Express</h1>
  <p>Node.js includes a minimal set of functionality in the core runtime. Developers often use 3rd party modules to provide additional functionality when developing a Node.js application. In this tutorial you will extend the application created in the <a href="http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/">Node.js Web Application</a> tutorial by using modules.</p>
  <p>This tutorial assumes that you have completed the <a href="http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/">Node.js Web Application</a> tutorial.</p>
  <p>You will learn:</p>
  <ul>
    <li>How to use node package manager (npm) to install a module</li>
    <li>How to use the Express module</li>
  </ul>
  <p>A screenshot of the complted application is below:</p>
  <img src="../../../DevCenter/Node/Media/node36.png" alt="A web browser displaying Welcome to Express in Windows Azure" />
  <h2 id="installingmodules">Installing Modules</h2>
  <p>Node modules can be installed using the node package manager. The command format used to install a module using the package manager is <em>npm install &lt;module_name&gt;</em>. Packages installed in this way are stored in the <strong>node_modules</strong> folder in the directory the command is ran in. Node automatically looks for modules within the <strong>node_modules</strong> folder in the application folder, so it is important that you run the npm command from the folder that contains your application when installing modules.</p>
  <p>Perform the following steps to add the Express module to the application you created through the <a href="http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/">Node.js Web Application</a> tutorial.</p>
  <ol>
    <li>
      <p>If it is not already open, start the Windows Azure PowerShell for Node.js from the <strong>Start</strong> menu by expanding <strong>All Programs, Windows Azure SDK Node.js - November 2011</strong>, right-click <strong>Windows Azure PowerShell for Node.js</strong>, and then select <strong>Run As Administrator</strong>.</p>
    </li>
    <li>
      <p>Change directories to the folder containing your application. For example, C:\node\tasklist\WebRole1.</p>
    </li>
    <li>
      <p>Install the Express module by issuing the following command:</p>
      <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; npm install express
</pre>
      <p>
        <strong>Note</strong>: By default, the command above installs the latest version of the modules. This tutorial was created with Express version 2.5.5. If you encounter problems using a newer version of Express, you can install the 2.5.5 version by using <strong>npm install express@2.5.5</strong>.</p>
      <p>The output of the npm command should look similar to the result below. You can see the list of modules installed as well as any dependencies.</p>
      <p>
        <img src="../../../DevCenter/Node/Media/getting-started-16storage.png" alt="Windows PowerShell displaying the output of the npm install express command." />
      </p>
    </li>
  </ol>
  <h2 id="generatinganexpressapplication">Generating an Express Application</h2>
  <p>The Express (<a href="http://expressjs.com/">expressjs.com</a>) module provides a web framework for building MVC applications. It provides APIs for processing HTTP requests and supports view template engines for generating HTTP responses. It also includes a various tools and add-ons required by MVC applications, including the ability to generate basic MVC scaffolding for a web application.</p>
  <p>Perform the following steps to replace the existing application with one generated using the Express scaffolding tool.</p>
  <ol>
    <li>
      <p>To create an Express web application using the scaffolding tool, enter the command below:</p>
      <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; .\node_modules\.bin\express
</pre>
    </li>
    <li>
      <p>You are prompted to overwrite your earlier application. Enter <strong>y</strong> or <strong>yes</strong> to continue. Express generates the app.js file and a folder structure for building your application.</p>
      <img src="../../../DevCenter/Node/Media/node23.png" alt="The output of the .\node_modules\.bin\express command." />
    </li>
    <li>
      <p>Delete your existing server.js and rename the generated app.js file to server.js. by entering the commands below. This is required because the Windows Azure WebRole in our application is configured to dispatch HTTP requests to server.js.</p>
      <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; del server.js
PS C:\node\tasklist\WebRole1&gt; ren app.js server.js
</pre>
    </li>
    <li>
      <p>View the directory contents:</p>
      <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; ls
</pre>
      <img src="../../../DevCenter/Node/Media/getting-started-17.png" alt="Directory listing of the WebRole1 folder." />
      <p>Note that several files and folders have been created as part of the Express scaffolding, including the package.json file which defines additional dependencies required for this application.</p>
    </li>
    <li>
      <p>To install additional dependencies defined in the package.json file, enter the following command:</p>
      <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; npm install
</pre>
      <img src="../../../DevCenter/Node/Media/node26.png" alt="The output of the npm install command" />
    </li>
    <li>
      <p>Open the server.js file in Notepad, using the following command:</p>
      <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; notepad server.js
</pre>
    </li>
    <li>
      <p>Replace the last two lines of the file with the code below.</p>
      <pre class="prettyprint">app.listen(process.env.port);
</pre>
      <img src="../../../DevCenter/Node/Media/node27.png" alt="The contents of server.js with the app.listen(3000); and console.log lines selected." />
      <p>This configures Node to listen on the environment PORT value provided by Windows Azure when published to the cloud.</p>
      <p>
        <strong>Note</strong>: At the time of this writing, express scaffolding sometimes generated LF-only line breaks (Unix-style). If you’re experiencing this, you can open the file in WordPad or Visual Studio and save, thereby replacing LF with CRLF line breaks. Save the server.js file.</p>
    </li>
    <li>
      <p>Use the following command to run the application in the Windows Azure emulator:</p>
      <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; Start-AzureEmulator -launch
</pre>
      <img src="../../../DevCenter/Node/Media/node28.png" alt="A web page containing welcome to express." />
    </li>
  </ol>
  <h2 id="modifyingtheview">Modifying the View</h2>
  <p>Now you’ll modify the view to display the message “Welcome to Express in Windows Azure”.</p>
  <ol>
    <li>
      <p>Enter the following command to open the index.jade file:</p>
      <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; notepad views/index.jade
</pre>
      <img src="../../../DevCenter/Node/Media/getting-started-19.png" alt="The contents of the index.jade file." />
      <p>As mentioned earlier, Jade is the view engine you are using here. Notice that it uses a style that does not require any tags. For more information on the Jade view engine, see <a href="http://jade-lang.com">http://jade-lang.com</a>.</p>
    </li>
    <li>
      <p>Modify the last line of text by appending <strong>in Windows Azure</strong>.</p>
      <img src="../../../DevCenter/Node/Media/node31.png" alt="The index.jade file, the last line reads: p Welcome to #{title} in Windows Azure" />
    </li>
    <li>
      <p>Save the file and exit Notepad.</p>
    </li>
    <li>
      <p>Refresh your browser and you will see your changes.</p>
      <img src="../../../DevCenter/Node/Media/node32.png" alt="A browser window, the page contains Welcome to Express in Windows Azure" />
    </li>
  </ol>
  <h2 id="creatinganewview">Creating a New View</h2>
  <p>For the task list application add a new Home view. This view will display existing tasks and allow adding new tasks and marking tasks as completed. For now, the view just has a static placeholder.</p>
  <ol>
    <li>
      <p>From the Windows Azure Powershell window, enter the following command to create a new home view template.</p>
      <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; notepad views/home.jade
</pre>
    </li>
    <li>
      <p>Select “Yes” to create the new file. Paste the contents below into home.jade. Save the file and close it.</p>
      <pre class="prettyprint">h1= title
p A work in progress.
</pre>
    </li>
    <li>
      <p>In order to have your app handle the home request you will modify the server.js adding a route entry for <strong>/home</strong>. First open server.js.</p>
      <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; notepad server.js
</pre>
    </li>
    <li>
      <p>Add the home route after the default route as shown below:</p>
      <img src="../../../DevCenter/Node/Media/node33.png" alt="The server.js file, with the app.get('/', routes.index); line highlighted" />
      <pre class="prettyprint">app.get('/home', function(req, res){
  res.render('home', {
    title: 'Home'
  });
});
</pre>
      <p>The <strong>app.get</strong> call tells node to handle requests using an HTTP GET. The first parameter of the function call specifies which URL should be handled, in this case <strong>/home</strong>. Next a callback is provided for handling the actual request. The first parameter is the incoming request, the second parameter is the response. The next line instructs Express to render <strong>home.jade</strong> (.jade is not required) passing in <strong>Home</strong> as the title.</p>
    </li>
    <li>
      <p>Browse the Express hello world application running in the emulator, navigating to the new Home view you just added.</p>
      <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; start http://localhost:81/home
</pre>
      <img src="../../../DevCenter/Node/Media/node34.png" alt="The web browser displaying the home page, which states A work in progress" />
    </li>
  </ol>
  <h2 id="re-publishingtheapplicationtowindowsazure">Re-Publishing the Application To Windows Azure</h2>
  <p>Now that we augmented the Hello World application to use Express, you can publish it to Windows Azure by updating the deployment to the existing hosted service. In the Windows PowerShell window, call the <strong>Publish-AzureService</strong> cmdlet to redeploy your hosted service to Windows Azure.</p>
  <pre class="prettyprint">PS C:\node\tasklist\WebRole1&gt; Publish-AzureService -launch
</pre>
  <p>Since there is a previous deployment of this application, Windows Azure performs an in-place update. As such, the cmdlet completes faster than the initial deployment. After the deployment is complete, you see the following response:</p>
  <p>
    <img src="../../../DevCenter/Node/Media/node35.png" alt="The output of the publish command" />
  </p>
  <p>As before, because you specified the <strong>–launch</strong> option, the browser opens and displays your application running in Windows Azure when publishing is completed.</p>
  <p>
    <img src="../../../DevCenter/Node/Media/node36.png" alt="A web browser displaying the Express page. The URL indicates it is now hosted on Windows Azure." />
  </p>
</body>