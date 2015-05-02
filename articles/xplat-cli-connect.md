<properties
	pageTitle="Log in from the Azure CLI for Mac, Linux, and Windows"
	description="Connect to Azure subscription from the Azure CLI for Mac, Linux, and Windows"
	editor="tysonn"
	manager="timlt"
	documentationCenter=""
	authors="dsk-2015"
	services=""/>

<tags
	ms.service="multiple"
	ms.workload="multiple"
	ms.tgt_pltfrm="command-line-interface"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/29/2015"
	ms.author="dkshir"/>

# Connect to an Azure subscription from the Azure CLI for Mac, Linux, and Windows

The Azure CLI for Mac, Linux, and Windows (also called the _xplat-cli_) is a set of open source, cross-platform commands for working with the Azure Platform. This document describes how to connect to your Azure subscription from the xplat-cli. For installation instructions, see [Install Azure CLI for Mac, Linux, and Windows](xplat-cli-install.md).

<a id="configure"></a>
## How to connect to your Azure subscription

Most commands provided by the xplat-cli require a connection to an Azure account. There are two ways to configure the xplat-cli to work with your subscription:

* Log in to Azure using a work or school account (also called an organizational account). This uses Azure Active Directory to authenticate the credentials.

or

* Download and use a publish settings file. This installs a certificate that allows you to perform management tasks for as long as the subscription and the certificate are valid.

For more information about authentication and subscription management, see ["What's the difference between account-based authentication and certificate-based authentication"][authandsub].

If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][free-trial].

> [AZURE.NOTE] The most flexible and advanced Azure services use the Azure Resource Manager or the [ARM mode](xplat-cli-azure-resource-manager.md). The ARM mode requires connecting to Azure using a work or school account, with the log in method described below.

### Use the log in method

The login method only works with a work or school account. This account is managed by your organization, and defined in your organization's Azure Active Directory.

> [AZURE.NOTE] If you do not currently have a work or school account, and are using a personal account to log in to your Azure subscription, you can easily create one using the following steps.
>
> 1. Login to the [Azure Portal][portal], and select **Active Directory**.
>
> 2. If no directory exists, select **Create your directory** and provide the requested information.
>
> 3. Select your directory and add a new user. This new user is a work or school account.
>
>     During the creation of the user, you will be supplied with both an e-mail address for the user and a temporary password. Save this information as it is needed later.
>
> 4. From the Azure portal, select **Settings** and then select **Administrators**. Select **Add**, and add the new user as a co-administrator. This allows the work or school account to manage your Azure subscription.
>
> 5. Finally, log out of the Azure portal and then log back in using the new work or school account. If this is the first time logging in with this account, you will be prompted to change the password.
>
> 6. Make sure you see your subscriptions when you log in as the work or school account.
>
>For more information on work or school accounts, see [Sign up for Microsoft Azure as an Organization][signuporg].

To log in from the xplat-cli using a work or school account, use the following command:

	azure login -u <username>

and enter your password when prompted for.

> [AZURE.NOTE] If this is the first time you have logged in with these credentials, you will receive a prompt asking you to verify that you wish to cache an authentication token. This prompt will also occur if you have previously used the `azure logout` command described below. To bypass this prompt for automation scenarios, use the `-q` parameter with the `azure login` command.

To log out, use the following command:

	azure logout -u <username>

> [AZURE.NOTE] If the subscriptions associated with the account were only authenticated with Active Directory, logging out will delete the subscription information from the local profile. However, if a publish settings file had also been imported for the subscriptions, logging out will only delete the Active Directory related information from the local profile.

### Use the publish settings file method

> [AZURE.NOTE] If you connect using this method, you can only use the Azure Service Management (or the ASM mode) commands.

To download the publish settings for your account, use the following command:

	azure account download

This will open your default browser and prompt you to sign in to the [Azure Portal][portal]. After signing in, a `.publishsettings` file will be downloaded. Make note of where this file is saved.

> [AZURE.NOTE] If your account is associated with multiple Azure Active Directory tenants, you may be prompted to select which Active Directory you wish to download a publish settings file for.
>
> Once selected using the download page, or by visiting the Azure Portal, the selected Active Directory becomes the default used by the portal and download page. Once a default has been established, you will see the text '__click here to return to the selection page__' at the top of the download page. Use the provided link to return to the selection page.

Next, import the `.publishsettings` file by running the following command:

	azure account import <path to your .publishsettings file>

After importing your publish settings, you should delete the `.publishsettings` file, as it is no longer required by the Command-Line Tools and presents a security risk as it can be used to gain access to your subscription.

> [AZURE.NOTE] Whether you login with a work or school account or import publish settings, the information for accessing your Azure subscription is stored in a `.azure` directory located in your `user` directory. Your `user` directory is protected by your operating system; however, it is recommended that you take additional steps to encrypt your `user` directory. You can do so in the following ways:
>
> * On Windows, modify the directory properties or use BitLocker.
> * On Mac, turn on FileVault for the directory.
> * On Ubuntu, use the Encrypted Home directory feature. Other Linux distributions offer equivalent features.

### Multiple subscriptions

If you have multiple Azure subscriptions, connecting to Azure will grant access to all subscriptions associated with your credentials. One subscription will be selected as the default, and used by the xplat-cli when performing operations. You can view the subscriptions, as well as which one is the default, using the `azure account list` command. This command will return information similar to the following:

	info:    Executing command account list
	data:    Name              Id                                    Current
	data:    ----------------  ------------------------------------  -------
	data:    Azure-sub-1       ####################################  true
	data:    Azure-sub-2       ####################################  false

In the above list, the **Current** column indicates the current default subscription as Azure-sub-1. To change the default subscription, use the `azure account set` command, and specify the subscription that you wish to be the default. For example:

	azure account set Azure-sub-2

This will change the default subscription to Azure-sub-2.

> [AZURE.NOTE] Changing the default subscription takes effect immediately, and is a global change; new xplat-commands, whether you run them from the same command-line instance or a different instance, will use the new default subscription.

If you wish to use a non-default subscription with the xplat-cli, but don't want to change the current default, you can use the `--subscription` option for the command and provide the name of the subscription you wish to use for the operation.

Once you are connected to your Azure subscription, you can start using the xplat-cli commands. For more information, see [How to use the Azure CLI for Mac, Linux, and Windows](xplat-cli.md).

<a id="additional-resources"></a>
## Additional resources

* [Using the Azure CLI with the Service Management (or ASM mode) commands][xplatasm]

* [Using the Azure CLI with the Resource Management (or ARM mode) commands][xplatarm]

* For more information on the xplat-cli, to download source code, report problems, or contribute to the project, visit the [GitHub repository for the Azure Cross-Platform Command-Line Interface](https://github.com/WindowsAzure/azure-sdk-tools-xplat).

* If you encounter problems using the xplat-cli, or Azure, visit the [Azure Forums](http://social.msdn.microsoft.com/Forums/windowsazure/home).

* For more information on Azure, see [http://azure.microsoft.com/](http://azure.microsoft.com).





[authandsub]: http://msdn.microsoft.com/library/windowsazure/hh531793.aspx#BKMK_AccountVCert
[free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/
[portal]: https://manage.windowsazure.com
[signuporg]: http://azure.microsoft.com/en-us/documentation/articles/sign-up-organization/
[xplatasm]: virtual-machines-command-line-tools.md
[xplatarm]: xplat-cli-azure-resource-manager.md
