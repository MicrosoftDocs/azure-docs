<properties
	pageTitle="Log in to Azure from the CLI | Microsoft Azure"
	description="Connect to your Azure subscription from the Azure Command-Line Interface (Azure CLI) for Mac, Linux, and Windows"
	editor="tysonn"
	manager="timlt"
	documentationCenter=""
	authors="dlepow"
	services="virtual-machines-linux,virtual-network,storage,azure-resource-manager"
	tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="multiple"
	ms.workload="multiple"
	ms.tgt_pltfrm="vm-multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/13/2016"
	ms.author="danlep"/>

# Connect to an Azure subscription from the Azure Command-Line Interface (Azure CLI)

The Azure CLI is a set of open-source, cross-platform commands for working with the Azure platform. This article describes ways to provide your Azure account credentials to connect the Azure CLI to your Azure subscription. If you haven't already installed the CLI, see [Install the Azure CLI](xplat-cli-install.md). If you don't have an Azure subscription, you can create a [free account](http://azure.microsoft.com/free/) in just a couple of minutes. 

There are two ways to connect to your subscription from the Azure CLI:

* **Log in to Azure using a work or school account or a Microsoft account identity** - Use the `azure login` command with either type of account identity to authenticate through Azure Active Directory. Most customers creating new Azure deployments should use this method. With certain accounts, the `azure login` command requires you to log in interactively through a web portal. 

    Also use the `azure login` command to authenticate a service principal for an Azure Active Directory application, which is useful for running automated services. 
    
    After logging in with a supported account identity, you can use either Azure Resource Manager mode or Azure Service Management mode CLI commands.

* **Download and use a publish settings file** - This installs a certificate on your local computer that allows you to perform management tasks for as long as the subscription and the certificate are valid. 

    This method only allows you to use Azure Service Management mode CLI commands.

>[AZURE.NOTE] If you are using a version of the Azure CLI that is prior to version 0.9.10, you can use the `azure login` command only with a work or school account; Microsoft account identities do not work. However, if you want, you can [create a work or school ID from your Microsoft account ID](virtual-machines/virtual-machines-windows-create-aad-work-id.md). 

For background about different account identities and Azure subscriptions, see [How Azure subscriptions are associated with Azure Active Directory](./active-directory/active-directory-how-subscriptions-associated-directory.md).

## Use azure login to authenticate interactively

Use the `azure login` command -- without any arguments -- to authenticate interactively with either:

- a work or school account identity (also called an *organizational account*) that requires multifactor authentication, or
- a Microsoft account identity when you want to access Resource Manager mode commands

> [AZURE.NOTE]  In both cases, authentication and authorization are performed using Azure Active Directory. If you use a Microsoft account identity, the log in process accesses your Azure Active Directory default domain. (If you signed up for a free Azure account, you might not be aware that Azure Active Directory created a default domain for your account.)

Interactively logging in is easy: type `azure login` and follow the prompts as shown below:

	azure login                                                                                                                                                                                         
	info:    Executing command login
	info:    To sign in, use a web browser to open the page http://aka.ms/devicelogin. Enter the code XXXXXXXXX to authenticate. 

Copy the code offered to you, above, and open a browser to http://aka.ms/devicelogin (or other page if specified). Enter the code, and then you are prompted to enter the username and password for the identity you want to use. When that process completes, the command shell completes the log in process. It might look something like:

	info:    Added subscription Visual Studio Ultimate with MSDN
	info:    Added subscription Azure Free Trial
	info:    Setting subscription "Visual Studio Ultimate with MSDN" as default
	+
	info:    login command OK

## Use azure login with a username and password


Use the `azure login` command with a username parameter or with both a username and a password to authenticate when you want to use a work or school account that doesn't require multifactor authentication. The following example passes the username of an organizational account:

	azure login -u ahmet@contoso.onmicrosoft.com
	info:    Executing command login
	Password: *********
	|info:    Added subscription Visual Studio Ultimate with MSDN
	+
	info:    login command OK

Enter your password when prompted.

If this is your first time logging in with these credentials, you are asked to verify that you wish to cache an authentication token. This prompt also occurs if you have previously used the `azure logout` command (described later in the article). To bypass this prompt for automation scenarios, run `azure login` with the `-q` parameter.

   

## Use azure login with a service principal

If you've created a service principal for an Active Directory application, and the service principal has permissions on your subscription, you can use the `azure login` command to authenticate the service principal. Depending on your scenario, you could provide the credentials of the service principal as explicit parameters of the `azure login` command, or through a CLI script or application code. You can also use a certificate to authenticate the service principal non-interactively for automation scenarios. For details and examples, see [Authenticating a service principal with Azure Resource Manager](resource-group-authenticate-service-principal.md).

## Use a publish settings file

If you only need to use the Azure Service Management mode CLI commands (for example, to deploy Azure VMs in the classic deployment model), you can connect using a publish settings file.

* **To download the publish settings file** for your account, use the following command (available only in Service Management mode):

		azure account download

    This opens your default browser and prompts you to sign in to the [Azure classic portal](https://manage.windowsazure.com). After you sign in, a `.publishsettings` file downloads. Make note of where this file is saved.

    > [AZURE.NOTE] If your account is associated with multiple Azure Active Directory tenants, you may be prompted to select which Active Directory you wish to download a publish settings file for.

    Once selected using the download page, or by visiting the Azure classic portal, the selected Active Directory becomes the default used by the classic portal and download page. Once a default has been established, you will see the text '__click here to return to the selection page__' at the top of the download page. Use the provided link to return to the selection page.

* **To import the publish settings file**, run the following command:

		azure account import <path to your .publishsettings file>

	>[AZURE.IMPORTANT]After importing your publish settings, you should delete the `.publishsettings` file. It is no longer required by the Azure CLI and presents a security risk as it could be used to gain access to your subscription.

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

Once you are connected to your Azure subscription, you can start using the Azure CLI commands to work with Azure resources.

## CLI command modes

The Azure CLI provides two command modes for working with Azure resources, with different command sets:

* **Resource Manager mode** - for working with Azure resources in the Resource Manager deployment model. To set this mode, run `azure config mode arm`.

* **Service Management mode** - for working with Azure resources in the classic deployment model. To set this mode, run `azure config mode asm`.

When first installed, the CLI is in Service Management mode.

>[AZURE.NOTE]The Resource Manager mode and Service Management mode are mutually exclusive. That is, resources created in one mode cannot be managed from the other mode.

## Storage of CLI settings

Whether you log in with the `azure login` command or import publish settings, your CLI profile and logs are stored in a `.azure` directory located in your `user` directory. Your `user` directory is protected by your operating system; however, it is recommended that you take additional steps to encrypt your `user` directory. You can do so in the following ways:

* On Windows, modify the directory properties or use BitLocker.
* On Mac, turn on FileVault for the directory.
* On Ubuntu, use the Encrypted Home directory feature. Other Linux distributions offer similar features.

## Logging out

To log out, use the following command:

	azure logout -u <username>

If the subscriptions associated with the account were only authenticated with Active Directory, logging out deletes the subscription information from the local profile. However, if a publish settings file had also been imported for the subscriptions, logging out only deletes Active Directory related information from the local profile.
## Next steps

* To use Azure CLI commands, see [Azure CLI commands in Resource Manager mode](./virtual-machines/azure-cli-arm-commands.md) and [Azure CLI commands in Service Management mode](virtual-machines-command-line-tools.md).

* To learn more about the Azure CLI, download source code, report problems, or contribute to the project, visit the [GitHub repository for the Azure CLI](https://github.com/azure/azure-xplat-cli).

* If you encounter problems using the Azure CLI, or Azure, visit the [Azure Forums](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurescripting).


