<properties linkid="mobile-services-store-scripts-in-source-control" urlDisplayName="Store server scripts in source control" pageTitle="Store server scripts in source control - Windows Azure Mobile Services" metaKeywords=""  writer="glenga" metaDescription="Learn how to store your server script files and modules in a local Git repo on your computer." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Store server scripts in source control and use NPM

This topic shows you how to set up source control for the first time in Windows Azure Mobile Services to store your server scripts in a Git repository. Scripts and other JavaScript code files can be promoted from your local repository to your production mobile service. 

The tutorial guides you through the following steps:

1. [Enable source control in your mobile service].
2. [Install Git and create the local repository].
3. [Deploy updated script files to your mobile service].
<li><a href="#use-npm">Use a NPM module in your server script</a>.</li>

To complete this tutorial, you must have already created a mobile service by completing either the [Get started with Mobile Services] or the [Get started with data] tutorial.

<h2><a name="enable-source-control"></a><span class="short-header">Enable source control</span>Enable source control in your mobile service</h2>

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your mobile service.

   ![][0]

2. Click the **Dashboard** tab, then under **Quick glance**, click **Set up source control**, and click **Yes** to confirm.

   ![][1]

    <div class="dev-callout"><b>Note</b>
	<p>Source control a preview feature. We recommend that you backup your script files regulary, even though they are stored in Mobile Services.</p><p>Only a subscription owner can enable source control. Co-administrators are not provided with this option in the portal.</p>
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
	<p>On some operating systems, both a command-line and GUI version of Git will are available. The instructions provided in this article use the command-line version.</p>
	</div>

2. Open a command-line, such as **GitBash** (Windows) or **Bash** (Unix Shell). On OS X systems you can access the command-line through the **Terminal** application.

3. From the command line, change to the directory where you will store your scripts. For example, `cd scriptsources`.

4. Use the following command to create a local copy of your new Git repository, replacing `<your_git_URL>` with the URL of the Git repository for your mobile service:

		git clone <your_git_URL>

5. When prompted, type in the user name and password that you set when you enabled source control in your mobile service. After successful authentication, you will see a series of responses like this:

		remote: Counting objects: 8, done.
		remote: Compressing objects: 100% (4/4), done.
		remote: Total 8 (delta 1), reused 0 (delta 0)
		Unpacking objects: 100% (8/8), done.

6. Browse to the directory from which you ran the `git clone` command, and notice the following directory structure:

	![4][]

	In this case, a new directory was created with the name of the mobile service, which is the local repository for the data service. The .\service\table subfolder contains a TodoItem.json file, which contains a JSON representation of the operation permissions on the TodoItem table. For more information, see [Source control].

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

<h2><a name="use-npm"></a><span class="short-header">Use NPM</span>Use a NPM module in your server script</h2>
<p>Source control support also allows you to add any Node.js module you need in the scripts beyond the fixed set provided by Mobile Services. For example, you can assign unique GUID identifiers for your tasks on the server. To accomplish this, you need to use Node.js <a href="https://npmjs.org/package/node-uuid">node-uuid</a> module. Ensure you have Node.js by following the steps <a href="http://nodejs.org/">here</a> (preferably Node.js 0.6.20, although newer versions should work).</p>

<ol>
<li>Navigate to the .\service  folder and install the <strong>node-uuid</strong> module by running the following command.<br />
<pre class="prettyprint">npm install node-uuid</pre></li>
<li>Now browse to the .\service\table subfolder, open the todoitem.insert.js file and modify it as follows:<br/>
<pre class="prettyprint">function insert(item, user, request) {
    var uuid = reuire('node-uuid');
    item.uuid = uuid.v1();
    request.execute();
    console.log(item);
}</pre>
The code adds a uuid column to the table, populating it with unique GUID identifiers.</li>
<li>Just like in the previous section, in the Git command prompt, type the following command to commit and push your changes to your mobile service:
<pre class="prettyprint">$ git add .
$ git commit –m "added node-uuid module”
$ git push origin master
</pre>
This will commit and push both the added node-uuid module as well as the changes to the todoitem.insert.js script.</li>


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