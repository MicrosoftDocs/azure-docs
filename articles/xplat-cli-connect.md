<properties
	pageTitle="Log in to Azure from the CLI | Microsoft Azure"
	description="Connect to your Azure subscription from the Azure Command-Line Interface (Azure CLI) for Mac, Linux, and Windows"
	editor="tysonn"
	manager="timlt"
	documentationCenter=""
	authors="dlepow"
	services=""
	tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="multiple"
	ms.workload="multiple"
	ms.tgt_pltfrm="command-line-interface"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/27/2015"
	ms.author="danlep"/>

# Connect to an Azure subscription from the Azure Command-Line Interface (Azure CLI)

The Azure CLI is a set of open-source, cross-platform commands for working with the Azure platform. This article describes how to connect to your Azure subscription from the Azure CLI to use all of the CLI commands. If you haven't already installed the CLI, see [Install the Azure CLI](xplat-cli-install.md).


[AZURE.INCLUDE [learn-about-deployment-models](../includes/learn-about-deployment-models-both-include.md)]


There are two ways to connect to your subscription from the Azure CLI:

* **Log in to Azure using a work or school account or a Microsoft account identity** - This uses either type of account identity to authenticate. Starting with CLI version 0.9.9, the CLI supports interactive authentication for accounts that have enabled multi-factor authentication. After logging in interactively, you can use either Resource Manager or classic (Service Management) commands.

* **Download and use a publish settings file** - This installs a certificate that allows you to perform management tasks for as long as the subscription and the certificate are valid. This method only allows you to use classic (Service Management) commands.

For more information about authentication and subscription management, see [What's the difference between account-based authentication and certificate-based authentication][authandsub].

If you don't have an Azure account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][free-trial].


## Use the interactive log in method

Use the `azure login` command -- without any arguments -- to authenticate interactively with either:

- a work or school account identity that requires multi-factor authentication, or
- a Microsoft account identity when you want to access Resource Manager deployment mode functionality

> [AZURE.NOTE]  In both cases, authentication and authorization is performed using Azure Active Directory, in the case of Microsoft accounts by accessing your Azure Active Directory default domain. (If you signed up for a free trial, you may not be aware that Azure Active Directory created a default domain for your account.)

Interactively logging in is easy; type `azure login` and follow the prompts as shown below:

	azure login                                                                                                                                                                                         
	info:    Executing command login
	info:    To sign in, use a web browser to open the page http://aka.ms/devicelogin. Enter the code B4MGHQS7K to authenticate. If you're signing in as an Azure AD application, use the --username and --password parameters.
	
Copy the code offered to you, above, and open a browser to http://aka.ms/devicelogin. Enter the code, and you will be prompted to enter the username and password for the identity you want to use. When that process completes, the command shell will complete th log in process. It might look something like:
	
	info:    Added subscription Visual Studio Ultimate with MSDN
	info:    Added subscription Azure Free Trial
	info:    Setting subscription "Visual Studio Ultimate with MSDN" as default
	+
	info:    login command OK

## Using non-interactive log in with a work or school account

The non-interactive log in method only works with a work or school account, also called an *organizational account*. This account is managed by your organization, and defined in your organization's Azure Active Directory. You can [create an orgnizational account](#create-an-organizational-account) if you don't have one, or you can [a work or school ID from your Microsoft account id](./virtual-machines/resource-group-create-work-id-from-personal.md). This requires you to specify either a username or a username and a password to the `azure login` command, like so:

	azure login -u ahmet@contoso.onmicrosoft.com
	info:    Executing command login
	Password: *********
	|info:    Added subscription Visual Studio Ultimate with MSDN
	+
	info:    login command OK
	
Enter your password when prompted.

	If this is your first time logging in with these credentials, you are asked to verify that you wish to cache an authentication token. This prompt also occurs if you have previously used the `azure logout` command (described below). To bypass this prompt for automation scenarios, run `azure login` with the `-q` parameter.

* **To log out**, use the following command:

		azure logout -u <username>

	If the subscriptions associated with the account were only authenticated with Active Directory, logging out deletes the subscription information from the local profile. However, if a publish settings file had also been imported for the subscriptions, logging out only deletes Active Directory related information from the local profile.

## Use the publish settings file method

If you only need to use the classic (Service Management) CLI commands, you can connect using a publish settings file.

* **To download the publish settings file** for your account, use the following command:

		azure account download

This opens your default browser and prompts you to sign in to the [Azure Portal][portal]. After you sign in, a `.publishsettings` file downloads. Make note of where this file is saved.

	> [AZURE.NOTE] If your account is associated with multiple Azure Active Directory tenants, you may be prompted to select which Active Directory you wish to download a publish settings file for.
	>
	> Once selected using the download page, or by visiting the Azure Portal, the selected Active Directory becomes the default used by the portal and download page. Once a default has been established, you will see the text '__click here to return to the selection page__' at the top of the download page. Use the provided link to return to the selection page.

* **To import the publish settings file**, run the following command:

		azure account import <path to your .publishsettings file>
	
	After importing your publish settings, you should delete the `.publishsettings` file, as it is no longer required by the Azure CLI and presents a security risk as it can be used to gain access to your subscription.


## Multiple subscriptions

If you have multiple Azure subscriptions, connecting to Azure will grant access to all subscriptions associated with your credentials. One subscription is selected as the default, and used by the Azure CLI when performing operations. You can view the subscriptions, as well as which one is the default, using the `azure account list` command. This command returns information similar to the following:

	info:    Executing command account list
	data:    Name              Id                                    Current
	data:    ----------------  ------------------------------------  -------
	data:    Azure-sub-1       ####################################  true
	data:    Azure-sub-2       ####################################  false

In the above list, the **Current** column indicates the current default subscription as Azure-sub-1. To change the default subscription, use the `azure account set` command, and specify the subscription that you wish to be the default. For example:

	azure account set Azure-sub-2

This changes the default subscription to Azure-sub-2.

> [AZURE.NOTE] Changing the default subscription takes effect immediately, and is a global change; new Azure CLI commands, whether you run them from the same command-line instance or a different instance, use the new default subscription.

If you wish to use a non-default subscription with the Azure CLI, but don't want to change the current default, you can use the `--subscription` option for the command and provide the name of the subscription you wish to use for the operation.

Once you are connected to your Azure subscription, you can start using the Azure CLI commands. For more information, see [How to use the Azure CLI](xplat-cli-install.md).

## Storage of CLI settings

Whether you log in with a work or school account or import publish settings, your CLI profile and logs are stored in a `.azure` directory located in your `user` directory. Your `user` directory is protected by your operating system; however, it is recommended that you take additional steps to encrypt your `user` directory. You can do so in the following ways:

* On Windows, modify the directory properties or use BitLocker.
* On Mac, turn on FileVault for the directory.
* On Ubuntu, use the Encrypted Home directory feature. Other Linux distributions offer similar features.

## Additional resources

* [Using the Azure CLI with the Service Management (classic) commands][cliasm]

* [Using the Azure CLI with the Resource Manager commands][cliarm]

* To learn more about the Azure CLI, download source code, report problems, or contribute to the project, visit the [GitHub repository for the Azure CLI](https://github.com/azure/azure-xplat-cli).

* If you encounter problems using the Azure CLI, or Azure, visit the [Azure Forums](http://social.msdn.microsoft.com/Forums/windowsazure/home).





[authandsub]: http://msdn.microsoft.com/library/windowsazure/hh531793.aspx#BKMK_AccountVCert
[free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/
[portal]: https://manage.windowsazure.com
[signuporg]: http://azure.microsoft.com/en-us/documentation/articles/sign-up-organization/
[cliasm]: virtual-machines/virtual-machines-command-line-tools.md
[cliarm]: virtual-machines/xplat-cli-azure-resource-manager.md

