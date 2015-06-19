<properties 
	pageTitle="Administering a Mobile Service at the command line - Azure tutorial" 
	description="Learn how to create, deploy, and manage your Azure Mobile Service using command-line tools." 
	services="mobile-services" 
	documentationCenter="Mobile" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="NA" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="04/07/2015" 
	ms.author="glenga"/>

# Automate mobile services with command-line tools 

##Overview

This topic shows you how to use the Azure command-line tools to automate the creation and management of Azure Mobile Services. This topic shows you how to install and get started using the command-line tools and use them to perform key Mobile Services.
 
When combined into a single script or batch file, these individual commands automate the creation, verification, and deletion process of a mobile service. 

This topic covers a selection of common administration tasks supported by the Azure command-line tools. For more information, see [Azure command-line tools documentation][reference-docs].

<!--+  You must download and install the Azure command-line tools to your local machine. To do this, follow the instructions in the first section of this topic. 

+ (Optional) To be able to execute HTTP requests directly from the command-line, you must use cURL or an equivalent tool. cURL runs on a variety of platforms. Locate and install cURL for your specific platform from the <a href=http://go.microsoft.com/fwlink/p/?LinkId=275676 target="_blank">cURL download  page</a>.-->

##Install the Azure Command-Line Tools

The following list contains information for installing the command-line tools, depending on your operating system:

* **Windows**: Download the [Azure Command-Line Tools Installer][windows-installer]. Open the downloaded .msi file and complete the installation steps as you are prompted.

* **Mac**: Download the [Azure SDK Installer][mac-installer]. Open the downloaded .pkg file and complete the installation steps as you are prompted.

* **Linux**: Install the latest version of [Node.js][nodejs-org] (see [Install Node.js via Package Manager][install-node-linux]), then run the following command:

	npm install azure-cli -g

To test the installation, type `azure` at the command prompt. When the installation is successful, you will see a list of all the available `azure` commands.

##How to download and import publish settings

To get started, you must first download and import your publish settings. Then you can use the tools to create and manage Azure Services. To download your publish settings, use the `account download` command:

	azure account download

This opens your default browser and prompts you to sign in to the Management Portal. After signing in, your `.publishsettings` file is downloaded. Note the location of this saved file.

Next, import the `.publishsettings` file by running the following command, replacing `<path-to-settings-file>` with the path to your `.publishsettings` file:

	azure account import <path-to-settings-file>

You can remove all of the information stored by the <code>import</code> command by using the <code>account clear</code> command:

	azure account clear

To see a list of options for `account` commands, use the `-help` option:

	azure account -help

After importing your publish settings, you should delete the `.publishsettings` file for security reasons. For more information, see [How to install the Azure Command-Line Tools for Mac and Linux]. You are now ready to begin creating and managing Azure Mobile Services from the command line or in batch files.  

##How to create a mobile service

You can use the command-line tools to create a new mobile service instance. While creating the mobile service, you also create a SQL Database instance in a new server. 

The following command creates a new mobile service instance in your subscription, where `<service-name>` is the name of the new mobile service, `<server-admin>` is the login name of the new server, and `<server-password>` is the password for the new login:

	azure mobile create <service-name> <server-admin> <server-password>

The `mobile create` command fails when the specified mobile service exists. In your automation scripts, you should attempt to delete a mobile service before attempting to recreate it.

##How to list existing mobile services in a subscription

> [AZURE.NOTE] Commands in the CLI related to "list" and "script" only work with the JavaScript backend. 

The following command returns a list of all the mobile services in an Azure subscription:

	azure mobile list

This command also shows the current state and URL of each mobile service.

##How to delete an existing mobile service

You can use the command-line tools to delete an existing mobile service, along with the related SQL Database and server. The following command deletes the mobile service, where `<service-name>` is the name of the mobile service to delete:

	azure mobile delete <service-name> -a -q

By including `-a` and `-q` parameters, this command also deletes the SQL Database and server used by the mobile service without displaying a prompt.

> [AZURE.NOTE] If you do not specify the <code>-q</code> parameter along with <code>-a</code> or <code>-d</code>, execution is paused and you are prompted to select delete options for your SQL Database. Only use the <code>-a</code> parameter when no other service uses the database or server; otherwise use the <code>-d</code> parameter to only delete data that belongs to the mobile service being deleted.

##How to create a table in the mobile service

The following command creates a table in the specified mobile service, where `<service-name>` is the name of the mobile service and `<table-name>` is the name of the table to create:

	azure mobile table create <service-name> <table-name>

This creates a new table with the default permissions, `application`, for the table operations: `insert`, `read`, `update`, and `delete`. 

The following command creates a new table with public `read` permission but with `delete` permission granted only to administrators:

	azure mobile table create <service-name> <table-name> -p read=public,delete=admin

The following table shows the script permission value compared to the permission value in the [Azure Management Portal].

<table border="1" width="100%"><tr><th>Script value</th><th>Management Portal value</th></tr>
<tr><td><code>public</code></td><td>Everyone</td></tr>
<tr><td><code>application</code> (default)</td><td>Anybody with the application key</td></tr>
<tr><td><code>user</code></td><td>Only authenticated users</td></tr>
<tr><td><code>admin	</code></td><td>Only scripts and admins</td></tr></table>

The `mobile table create` command fails when the specified table already exists. In your automation scripts, you should attempt to delete a table before attempting to recreate it.

##How to list existing tables in a mobile service

The following command returns a list of all of the tables in a mobile service, where `<service-name>` is the name of the mobile service:

	azure mobile table list <service-name>

This command also shows the number of indexes on each table and the number of data rows currently in the table.

##How to delete an existing table from the mobile service

The following command deletes a table from the mobile service, where `<service-name>` is the name of the mobile service and `<table-name>` is the name of the table to delete:

	azure mobile table delete <service-name> <table-name> -q

In automation scripts, use the `-q` parameter to delete the table without displaying a confirmation prompt that blocks execution.

##How to register a script to a table operation

The following command uploads and registers a function to an operation on a table, where `<service-name>` is the name of the mobile service, `<table-name>` is the name of the table, and `<operation>` is the table operation, which can be `read`, `insert`, `update`, or `delete`:

	azure mobile script upload <service-name> table/<table-name>.<operation>.js

Note that this operation uploads a JavaScript (.js) file from the local computer. The name of the file must be composed  from the table and operation names, and it must be located in the `table` subfolder relative to the location where the command is executed. For example, the following operation uploads and registers a new `insert` script that belongs to the `TodoItems` table:

	azure mobile script upload todolist table/todoitems.insert.js

The function declaration in the script file must also match the registered table operation. This means that for an `insert` script, the uploaded script contains a function with the following signature:

	function insert(item, user, request) {
	    ...
	} 

For more information about registering scripts, see [Mobile Services server script reference].

<!-- Anchors. -->
[Download and install the command-line tools]: #install
[Download and import publish settings]: #import
[Create a new mobile service]: #create-service
[Get the master key]: #get-master-key
[Create a new table]: #create-table
[Register a new table script]: #register-script
[Delete an existing table]: #delete-table
[Delete an existing mobile service]: #delete-service
[Test the mobile service]: #test-service
[List mobile services]: #list-services
[List tables]: #list-tables
[Next steps]: #next-steps

<!-- Images. -->











<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/p?LinkId=262293

[Azure Management Portal]: https://manage.windowsazure.com/
[nodejs-org]: http://nodejs.org/
[install-node-linux]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

[mac-installer]: http://go.microsoft.com/fwlink/p?LinkId=252249
[windows-installer]: http://go.microsoft.com/fwlink/p?LinkID=275464
[reference-docs]: http://azure.microsoft.com/documentation/articles/virtual-machines-command-line-tools/#Commands_to_manage_mobile_services
[How to install the Azure Command-Line Tools for Mac and Linux]: http://go.microsoft.com/fwlink/p/?LinkId=275795

