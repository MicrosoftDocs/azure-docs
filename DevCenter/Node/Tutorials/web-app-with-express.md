<properties linkid="dev-nodejs-basic-web-app-with-express" urldisplayname="Web App With Express" headerexpose="" pagetitle="Web App With Express" metakeywords="Azure Node.js hello world tutorial, Azure Node.js hello world, Azure Node.js Getting Started tutorial, Azure Node.js tutorial, Azure Node.js Express tutorial" footerexpose="" metadescription="An tutorial that builds on the Web app tutorial, and demonstrates how to use the Express module" umbraconavihide="0" disquscomments="1"></properties>

# Node.js Web Application using Express

Node.js includes a minimal set of functionality in the core runtime.
Developers often use 3rd party modules to provide additional
functionality when developing a Node.js application. In this tutorial
you will extend the application created in the [Node.js Web
Application] tutorial by using modules.

This tutorial assumes that you have completed the [Node.js Web
Application] tutorial.

You will learn:

-   How to use node package manager (npm) to install a module
-   How to use the Express module

A screenshot of the complted application is below:

![A web browser displaying Welcome to Express in Windows Azure][]

## Installing Modules

Node modules can be installed using the node package manager. The
command format used to install a module using the package manager is
**npm install modulename**. Packages installed in this way are stored
in the **node\_modules** folder in the directory the command is ran in.
Node automatically looks for modules within the **node\_modules** folder
in the application folder, so it is important that you run the npm
command from the folder that contains your application when installing
modules.

Perform the following steps to add the Express module to the application
you created through the [Node.js Web Application][] tutorial.

1.  If it is not already open, start the Windows Azure PowerShell from the **Start** menu by expanding **All Programs, Windows
    Azure**, right-click **Windows Azure
    PowerShell**, and then select **Run As Administrator**.

2.  Change directories to the folder containing your application. For
    example, C:\\node\\tasklist\\WebRole1.

3.  Install the Express module by issuing the following command:

        PS C:\node\tasklist\WebRole1> npm install express -g

    **Note**: The '-g' parameter installs the express scaffolding so that it is globally available. You will use this command in the next section to generate the scaffolding for this application.

    The output of the npm command should look similar to the result
    below. You can see the list of modules installed as well as any
    dependencies.

    ![Windows PowerShell displaying the output of the npm install express command.][]

## Generating an Express Application

The Express ([expressjs.com][]) module provides a web framework for
building MVC applications. It provides APIs for processing HTTP requests
and supports view template engines for generating HTTP responses. It
also includes a various tools and add-ons required by MVC applications,
including the ability to generate basic MVC scaffolding for a web
application.

Perform the following steps to replace the existing application with one
generated using the Express scaffolding tool.

1.  To create an Express web application using the scaffolding tool,
    enter the command below:

        PS C:\node\tasklist\WebRole1> express

2.  You are prompted to overwrite your earlier application. Enter **y**
    or **yes** to continue. Express generates the app.js file and a
    folder structure for building your application.

    ![The output of the express command][express-command]

3.  Delete your existing server.js and rename the generated app.js file
    to server.js. by entering the commands below. This is required
    because the Windows Azure WebRole in our application is configured
    to dispatch HTTP requests to server.js.

        PS C:\node\tasklist\WebRole1> del server.js
        PS C:\node\tasklist\WebRole1> ren app.js server.js

4.  View the directory contents:

        PS C:\node\tasklist\WebRole1> ls

    ![Directory listing of the WebRole1 folder.][]

    Note that several files and folders have been created as part of the
    Express scaffolding, including the package.json file which defines
    additional dependencies required for this application.

5.  To install additional dependencies defined in the package.json file,
    enter the following command:

        PS C:\node\tasklist\WebRole1> npm install

    ![The output of the npm install command][]

6.  Open the server.js file in Notepad, using the following command:

        PS C:\node\tasklist\WebRole1> notepad server.js

7.  Replace the last two lines of the file with the code below.

        app.listen(process.env.port);

    ![The contents of server.js with the app.listen(3000); and console.log lines selected.][]

    This configures Node to listen on the environment PORT value
    provided by Windows Azure when published to the cloud.

    **Note**: At the time of this writing, express scaffolding sometimes
    generated LF-only line breaks (Unix-style). If you’re experiencing
    this, you can open the file in WordPad or Visual Studio and save,
    thereby replacing LF with CRLF line breaks. Save the server.js file.

8.  Use the following command to run the application in the Windows
    Azure emulator:

        PS C:\node\tasklist\WebRole1> Start-AzureEmulator -launch

    ![A web page containing welcome to express.][]

## Modifying the View

Now you’ll modify the view to display the message “Welcome to Express in
Windows Azure”.

1.  Enter the following command to open the index.jade file:

        PS C:\node\tasklist\WebRole1> notepad views/index.jade

    ![The contents of the index.jade file.][]

    As mentioned earlier, Jade is the view engine you are using here.
    Notice that it uses a style that does not require any tags. For more
    information on the Jade view engine, see [http://jade-lang.com][].

2.  Modify the last line of text by appending **in Windows Azure**.

    ![The index.jade file, the last line reads: p Welcome to \#{title}
    in Windows Azure][]

3.  Save the file and exit Notepad.

4.  Refresh your browser and you will see your changes.

    ![A browser window, the page contains Welcome to Express in Windows
    Azure][express-page]

## Creating a New View

For the task list application add a new Home view. This view will
display existing tasks and allow adding new tasks and marking tasks as
completed. For now, the view just has a static placeholder.

1.  From the Windows Azure Powershell window, enter the following
    command to create a new home view template.

        PS C:\node\tasklist\WebRole1> notepad views/home.jade

2.  Select “Yes” to create the new file. Paste the contents below into
    home.jade. Save the file and close it.

        h1= title
        p A work in progress.

3.  In order to have your app handle the home request you will modify
    the server.js adding a route entry for **/home**. First open
    server.js.

        PS C:\node\tasklist\WebRole1> notepad server.js

4.  Add the home route after the default route as shown below:

    ![The server.js file, with the app.get('/', routes.index); line highlighted][]

        app.get('/home', function(req, res){
          res.render('home', {
            title: 'Home'
          });
        });

    The **app.get** call tells node to handle requests using an HTTP
    GET. The first parameter of the function call specifies which URL
    should be handled, in this case **/home**. Next a callback is
    provided for handling the actual request. The first parameter is the
    incoming request, the second parameter is the response. The next
    line instructs Express to render **home.jade** (.jade is not
    required) passing in **Home** as the title.

5.  Browse the Express hello world application running in the emulator,
    navigating to the new Home view you just added.

        PS C:\node\tasklist\WebRole1> start http://localhost:81/home

    ![The web browser displaying the home page, which states A work in progress][]

## Re-Publishing the Application To Windows Azure

Now that we augmented the Hello World application to use Express, you
can publish it to Windows Azure by updating the deployment to the
existing hosted service. In the Windows Azure PowerShell window, call the
**Publish-AzureService** cmdlet to redeploy your hosted service to
Windows Azure.

    PS C:\node\tasklist\WebRole1> Publish-AzureServiceProject -launch

Since there is a previous deployment of this application, Windows Azure
performs an in-place update. As such, the cmdlet completes faster than
the initial deployment. After the deployment is complete, you see the
following response:

![The output of the publish command][]

As before, because you specified the **–launch** option, the browser
opens and displays your application running in Windows Azure when
publishing is completed.

![A web browser displaying the Express page. The URL indicates it is now hosted on Windows Azure.][A web browser displaying Welcome to Express in Windows Azure]

  [Node.js Web Application]: http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/
  [A web browser displaying Welcome to Express in Windows Azure]: ../Media/node36.png
  [Windows PowerShell displaying the output of the npm install express command.]: ../Media/getting-started-16storage.png
  [expressjs.com]: http://expressjs.com/
  [express-command]: ../Media/node23.png
  [Directory listing of the WebRole1 folder.]: ../Media/getting-started-17.png
  [The output of the npm install command]: ../Media/node26.png
  [The contents of server.js with the app.listen(3000); and console.log lines selected.]: ../../../DevCenter/Node/Media/node27.png
  [A web page containing welcome to express.]: ../Media/node28.png
  [The contents of the index.jade file.]: ../Media/getting-started-19.png
  [http://jade-lang.com]: http://jade-lang.com
  [The index.jade file, the last line reads: p Welcome to \#{title} in Windows Azure]: ../Media/node31.png
  [express-page]: ../Media/node32.png
  [The server.js file, with the app.get('/', routes.index); line highlighted]: ../Media/node33.png
  [The web browser displaying the home page, which states A work in progress]: ../Media/node34.png
  [The output of the publish command]: ../Media/node35.png
