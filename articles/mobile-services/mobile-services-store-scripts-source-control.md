<properties
	pageTitle="Store JavaScript backend project code in source control | Azure Mobile Services"
	description="Learn how to store your server script files and modules in a local Git repo on your computer."
	services="mobile-services"
	documentationCenter=""
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="glenga"/>

# Store your mobile service project code in source control

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

&nbsp;


> [AZURE.SELECTOR]
- [.NET backend](mobile-services-dotnet-backend-store-code-source-control.md)
- [Javascript backend](mobile-services-store-scripts-source-control.md)

This topic shows you how to use the source control provided by Azure Mobile Services to store your server scripts. Scripts and other JavaScript backend code files can be promoted from your local Git repository to your production mobile service. It also shows how to define shared code that can be required by multiple scripts and how to use the package.json file to add Node.js modules to your mobile service.

To complete this tutorial, you must have already created a mobile service by completing the [Get started with Mobile Services] tutorial.

##<a name="enable-source-control"></a>Enable source control in your mobile service

[AZURE.INCLUDE [mobile-services-enable-source-control](../../includes/mobile-services-enable-source-control.md)]

##<a name="clone-repo"></a>Install Git and create the local repository

1. Install Git on your local computer.

	The steps required to install Git vary between operating systems. See [Installing Git] for operating system specific distributions and installation guidance.

	> [AZURE.NOTE]
	> On some operating systems, both a command-line and GUI version of Git are available. The instructions provided in this article use the command-line version.

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

	![4][4]

	In this case, a new directory is created with the name of the mobile service, which is the local repository for the data service.

7. Open the .\service\table subfolder and notice that it contains a TodoItem.json file, which is a JSON representation of the operation permissions on the TodoItem table.

	When server scripts have been defined on this table, you will also have one or more files named <code>TodoItem._&lt;operation&gt;_.js</code> that contain the scripts for the given table operation. Scheduler and custom API scripts are maintained in separate folders with those respective names. For more information, see [Source control].

Now that you have created your local repository, you can make changes to server scripts and push the changes back to the mobile service.

##<a name="deploy-scripts"></a>Deploy updated script files to your mobile service

1. Browse to the .\service\table subfolder, and if a file todoitem.insert.js files doesn't already exist, create it now.

2. Open the new file todoitem.insert.js in a text editor and paste in the following code and save your changes:

		function insert(item, user, request) {
		    request.execute();
		    console.log(JSON.stringify(item, null, 4));
		}

	This code simply writes the inserted item to the log. If this file already contains code, simply add some valid JavaScript code to this file, such as a call to `console.log()`, then save your changes.

3. In the Git command prompt, type the following command to start tracking the new script file:

		$ git add .


4. Type the following command to commit changes:

		$ git commit -m "updated the insert script"

5. Type the following command to upload the changes to the remote repository:

		$ git push origin master

	You should see a series of commands that indicates that the commit is deployed to the mobile service.

6. Back in the [Azure classic portal], click the **Data** tab, then click the **TodoItem** table, click  **Script**, then select the **Insert** operation. Notice that the displayed insert operation script is the same as the JavaScript code that you just uploaded to the repository.

##<a name="use-npm"></a>Leverage shared code and Node.js modules in your server scripts

Mobile Services provides access to the full set of core Node.js modules, which you can use in your code by using the **require** function. Your mobile service can also use Node.js modules that are not part of the core Node.js package, and you can even define your own shared code as Node.js modules. For more information about creating modules, see [Modules] in the Node.js API reference documentation.

The recommended way to add Node.js modules to your mobile service is by adding references to the service's package.json file. Next, you will add the [node-uuid] Node.js module to your mobile service by updating the package.json file. When the update is pushed to Azure, the mobile service is restarted and the module is installed. This module is then used to generate a new GUID value for the **uuid** property on inserted items.

2. Navigate to the `.\service` folder of your local Git repository, and open the package.json file in a text editor, and add the following field to the **dependencies** object:

		"node-uuid": "~1.4.3"

	>[AZURE.NOTE]This update to the package.json file will cause a restart in your mobile service after the commit is pushed.

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
		$ git commit -m "added node-uuid module"
		$ git push origin master

	This adds the new file, commits your changes, and pushes the new node-uuid module and changes to the todoitem.insert.js script to your mobile service.

## <a name="next-steps"> </a>Next steps

Now that you have completed this tutorial you know how to store your scripts in source control. Consider learning more about working with server scripts and with custom APIs:

+ [Work with server scripts in Mobile Services]
	<br/>Shows how to work with server scripts, job scheduler, and custom APIs.

<!-- Anchors. -->
[Enable source control in your mobile service]: #enable-source-control
[Install Git and create the local repository]: #clone-repo
[Deploy updated script files to your mobile service]: #deploy-scripts
[Leverage shared code and Node.js modules in your server scripts]: #use-npm

<!-- Images. -->
[4]: ./media/mobile-services-store-scripts-source-control/mobile-source-local-repo.png
[5]: ./media/mobile-services-store-scripts-source-control/mobile-portal-data-tables.png
[6]: ./media/mobile-services-store-scripts-source-control/mobile-insert-script-source-control.png

<!-- URLs. -->
[Git website]: http://git-scm.com
[Source control]: http://msdn.microsoft.com/library/windowsazure/c25aaede-c1f0-4004-8b78-113708761643
[Installing Git]: http://git-scm.com/book/en/Getting-Started-Installing-Git
[Get started with Mobile Services]: mobile-services-ios-get-started.md
[Work with server scripts in Mobile Services]: mobile-services-how-to-use-server-scripts.md
[Azure classic portal]: https://manage.windowsazure.com/
[Modules]: http://nodejs.org/api/modules.html
[node-uuid]: https://npmjs.org/package/node-uuid
