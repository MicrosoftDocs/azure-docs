<properties linkid="mobile-services-monitor-new-relic" urlDisplayName="Use New Relic to monitor Mobile Services" pageTitle="Store server scripts in source control - Windows Azure Mobile Services" metaKeywords=""  writer="glenga" metaDescription="Learn how to use the New Relic add-on to monitor your mobile service." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

# Use New Relic to monitor Mobile Services

This topic shows you how to configure the third-party New Relic add-on to work with Windows Azure Mobile Services to provide enhanced monitoring of your mobile service. 

The tutorial guides you through the following steps:

1. [Enable source control in your mobile service].
2. [Install Git and create the local repository].
3. [Deploy updated script files to your mobile service].
4. [Leverage shared code and Node.js modules in your server scripts].

To complete this tutorial, you must have already created a mobile service by completing either the [Get started with Mobile Services] or the [Get started with data] tutorial.

<h2><a name="enable-source-control"></a><span class="short-header">Enable source control</span>Enable source control in your mobile service</h2>

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your mobile service.

   ![][0]

2. Click the **Dashboard** tab, then under **Quick glance**, click **Set up source control**, and click **Yes** to confirm.

   ![][1]

    <div class="dev-callout"><b>Note</b>
	<p>Source control is a preview feature. We recommend that you backup your script files regulary, even though they are stored in Mobile Services.</p>
    </div>

3. Supply a **User name**, **New password**, confirm the password, then click the check button. 

  ![][2]

   The Git repository is created in your mobile service. Make a note of the credentials you just supplied; you will use them to access this repository.

4. Click the Configure tab and notice the new **Source control** fields.

   ![][3]

   The URL of the Git repository is displayed. You will use this URL to clone the repository to your local computer.

Now that you have enabled source control in your mobile service, it's time to use Git to clone the repo to your local computer.

<h2><a name="clone-repo"></a><span class="short-header">Clone the repo</span>Install Git and create the local repository</h2>

1. Install Git on your local computer. 

  The steps required to install Git vary between operating systems. See [Installing Git] for operating system specific distributions and installation guidance.

	<div class="dev-callout">
	<strong>Note</strong>
	<p>On some operating systems, both a command-line and GUI version of Git are available. The instructions provided in this article use the command-line version.</p>
	</div>

2. Open a command-line, such as **GitBash** (Windows) or **Bash** (Unix Shell). On OS X systems you can access the command-line through the **Terminal** application.

3. From the command line, change to the directory where you will store your scripts. For example, `cd SourceControl`.

4. Use the following command to create a local copy of your new Git repository, replacing `<your_git_URL>` with the URL of the Git repository for your mobile service:

		git clone <your_git_URL>

5. When prompted, type in the user name and password that you set when you enabled source control in your mobile service. After successful authentication, you will see a series of responses like this:

		remote: Counting objects: 8, done.
		remote: Compressing objects: 100% (4/4), done.
		remote: Total 8 (delta 1), reused 0 (delta 0)
		Unpacking objects: 100% (8/8), done.

6. Browse to the directory from which you ran the `git clone` command, and notice the following directory structure:

	![4][]

	In this case, a new directory is created with the name of the mobile service, which is the local repository for the data service. 

7. Open the .\service\table subfolder and notice that it contains a TodoItem.json file, which is a JSON representation of the operation permissions on the TodoItem table. 

	When server scripts have been defined on this table, you will also have one or more files named <code>TodoItem._&lt;operation&gt;_.js</code> that contain the scripts for the given table operation. Scheduler and custom API scripts are maintained in separate folders with those respective names. For more information, see [Source control].

Now that you have created your local repository, you can make changes to server scripts and push the changes back to the mobile service.

<h2><a name="deploy-scripts"></a><span class="short-header">Deploy scripts</span>Deploy updated script files to your mobile service</h2>

1. Browse to the .\service\table subfolder, and if a file todoitem.insert.js files doesn't already exist, create it now.

2. Open the new file todoitem.insert.js in a text editor and paste in the following code and save your changes:

		function insert(item, user, request) {
		    request.execute();
		    console.log(item);
		}
	
	This code simply writes the inserted item to the log. If this file already contains code, simply add some valid JavaScript code to this file, such as a call to `console.log()`, then save your changes. 

3. In the Git command prompt, type the following command to start tracking the new script file:

		$ git add .
	

4. Type the following command to commit changes:

		$ git commit -m "updated the insert script"

5. Type the following command to upload the changes to the remote repository:

		$ git push origin master
	
	You should see a series of commands that indicates that the commit is deployed to the mobile service.

6. Back in the Management Portal, click the **Data** tab, then click the **TodoItem** table.

   ![][5]

3. Click **Script**, then select the **Insert** operation.

   ![][6]

	Notice that the displayed insert operation script is the same as the JavaScript code that you just uploaded to the repository.

<h2><a name="use-npm"></a><span class="short-header">Shared code and modules</span>Leverage shared code and Node.js modules in your server scripts</h2>
Mobile Services provides access to the full set of core Node.js modules, which you can use in your code by using the **require** function. Your mobile service can also use Node.js modules that are not part of the core Node.js package, and you can even define your own shared code as Node.js modules. For more information about creating modules, see [Modules][Node.js API Documentation: Modules] in the Node.js API reference documentation.

Next, you will add the [node-uuid] Node.js module to your mobile service by using source control and the Node.js package manager (NPM). This module is then used to generate a new GUID value for the **uuid** property on inserted items. 

1. If you haven't already done so, install Node.js on your local computer by following the steps at the <a href="http://nodejs.org/" target="_blank">Node.js web site</a>. 

2. Navigate to the `.\service` folder of your local Git repository, then from the command prompt run the following command:

		npm install node-uuid

	NPM creates the `node_modules` directory in the current location and installs the [node-uuid] module in the `\node-uuid` subdirectory. 

	<div class="dev-callout">
	<strong>Note</strong>
	<p>When <code>node_modules</code> already exists in the directory hierarchy, NPM will create the <code>\node-uuid</code> subdirectory there instead of creating a new <code>node_modules</code> in the repository. In this case, just delete the existing <code>node_modules</code> directory.</p>
	</div>

4. Now browse to the .\service\table subfolder, open the todoitem.insert.js file and modify it as follows:

		function insert(item, user, request) {
		    var uuid = require('node-uuid');
		    item.uuid = uuid.v1();
		    request.execute();
		    console.log(item);
		}

	This code adds a uuid column to the table, populating it with unique GUID identifiers.

5. As in the previous section, type the following command in the Git command prompt: 

		$ git add .
		$ git commit –m "added node-uuid module"
		$ git push origin master
		
	This adds the new file, commits your changes, and pushes the new node-uuid module and changes to the todoitem.insert.js script to your mobile service.

## <a name="next-steps"> </a>Next steps

Now that you have completed this tutorial you know how to store your scripts in source control. Consider learning more about working with server scripts and with custom APIs: 

+ [Work with server scripts in Mobile Services]
	<br/>Shows how to work with server scripts, job scheduler, and custom APIs.

+ [Define a custom API that supports pull notifications] 
	<br/> Shows how to use custom APIs to support periodic notifications that update live tiles in a Windows Store app.

<!-- Anchors. -->
[Enable source control in your mobile service]: #enable-source-control
[Install Git and create the local repository]: #clone-repo
[Deploy updated script files to your mobile service]: #deploy-scripts
[Leverage shared code and Node.js modules in your server scripts]: #use-npm

<!-- Images. -->
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-setup-source-control.png
[2]: ../Media/mobile-source-control-credentials.png
[3]: ../Media/mobile-source-control-configure.png
[4]: ../Media/mobile-source-local-repo.png
[5]: ../Media/mobile-portal-data-tables.png
[6]: ../Media/mobile-insert-script-source-control.png

<!-- URLs. -->
[Git website]: http://git-scm.com
[Source control]: http://msdn.microsoft.com/en-us/library/windowsazure/c25aaede-c1f0-4004-8b78-113708761643
[Installing Git]: http://git-scm.com/book/en/Getting-Started-Installing-Git
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started.md
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-dotnet.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-dotnet.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-dotnet.md
[Authorize users with scripts]: ../tutorials/mobile-services-authorize-users-dotnet.md
[Work with server scripts in Mobile Services]: ../HowTo/mobile-services-work-with-server-scripts.md
[JavaScript and HTML]: ../tutorials/mobile-services-get-started-with-users-js.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Define a custom API that supports pull notifications]: ../tutorials/mobile-services-create-pull-notifications-dotnet.md
[Node.js API Documentation: Modules]: http://nodejs.org/api/modules.html
[node-uuid]: https://npmjs.org/package/node-uuid
