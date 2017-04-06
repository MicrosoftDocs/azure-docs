---
title: Log in to Azure from the CLI | Microsoft Docs
description: Connect to your Azure subscription from the Azure Command-Line Interface (Azure CLI) for Mac, Linux, and Windows
editor: tysonn
manager: timlt
documentationcenter: ''
author: squillace
services: virtual-machines-linux,virtual-network,storage,azure-resource-manager
tags: azure-resource-manager,azure-service-management

ms.assetid: ed856527-d75e-4e16-93fb-253dafad209d
ms.service: multiple
ms.workload: multiple
ms.tgt_pltfrm: vm-multiple
ms.devlang: na
ms.topic: article
ms.date: 10/04/2016
ms.author: rasquill
"\"/": ''

---
# Log in to Azure from the Azure CLI
The Azure CLI is a set of open-source, cross-platform commands for working with Azure resources. This article describes the different ways to provide your Azure account credentials to connect the Azure CLI to your Azure subscription:

* Run the `azure login` CLI command to authenticate through Azure Active Directory. This method gives you access to CLI commands in both [command modes](#cli-command-modes). When you run the command without additional options, `azure login` prompts you to continue logging in interactively through a web portal. For additional `azure login` command options, see the scenarios in this article, or type `azure login --help`.
* If you only need to use Azure Service Management mode CLI commands (not recommended for most new deployments), you can download and install a publish settings file on your computer.

If you haven't already installed the CLI, see [Install the Azure CLI](cli-install-nodejs.md). If you don't have an Azure subscription, you can create a [free account](http://azure.microsoft.com/free/) in just a couple of minutes.

For background about different account identities and Azure subscriptions, see [How Azure subscriptions are associated with Azure Active Directory](active-directory/active-directory-how-subscriptions-associated-directory.md).

## Scenario 1: azure login with interactive login
With certain accounts, the CLI requires you to run `azure login` and then continue the login process with a web browser through a web portal, a process called *interactive login*. A common reason is when you have a work or school account (also called an *organizational account*) that is set up to require multifactor authentication. Also use interactive login with your Microsoft account, when you want to use Resource Manager mode commands.

Interactive login is easy: type `azure login` -- without any options -- as shown in the following example:

```
azure login
```                                                                                             

The output appears something like the following:

```         
info:    Executing command login
info:    To sign in, use a web browser to open the page http://aka.ms/devicelogin. Enter the code XXXXXXXXX to authenticate.
```
Copy the code offered to you in the command output, and open a browser to http://aka.ms/devicelogin, or other page if specified. (You can open a browser on the same computer, or on a different computer or device.) Enter the code, and then you are prompted to enter the username and password for the identity you want to use. When that process completes, the command shell completes the login. It might look something like:

    info:    Added subscription Visual Studio Ultimate with MSDN
    info:    Added subscription Azure Free Trial
    info:    Setting subscription "Visual Studio Ultimate with MSDN" as default
    +
    info:    login command OK

> [!NOTE]
> With interactive login, authentication and authorization are performed using Azure Active Directory. If you use a Microsoft account identity, the login process accesses your Azure Active Directory default domain. (If you signed up for a free Azure account, Azure Active Directory automatically created a default domain for your account.)
>
>

## Scenario 2: azure login with a username and password
Use the `azure login` command with the username (`-u`) parameter to authenticate when you want to use a work or school account that doesn't require multifactor authentication. You are prompted at the command line for the password (or you can optionally pass the password as an additional parameter of the `azure login` command). The following example passes the username of an organizational account:

    azure login -u myUserName@contoso.onmicrosoft.com

You are then prompted to enter your password:

    info:    Executing command login
    Password: *********

The login process then completes.

    info:    Added subscription Visual Studio Ultimate with MSDN
    +
    info:    login command OK

If this is your first time logging in with these credentials, you are asked to verify that you wish to cache an authentication token. This prompt also occurs if you previously used the `azure logout` command (described later in the article). To bypass this prompt for automation scenarios, run `azure login` with the `-q` parameter.

## Scenario 3: azure login with a service principal
If you create a service principal for an Active Directory application, and the service principal has permissions on your subscription, you can use the `azure login` command to authenticate the service principal. Depending on your scenario, you could provide the credentials of the service principal as explicit parameters of the `azure login` command. For example, the following command passes the service principal name and Active Directory tenant ID:

    azure login -u https://www.contoso.org/example --service-principal --tenant myTenantID

You are then prompted to provide the password. You can also provide the credentials through a CLI script or application code, or use a certificate to authenticate the service principal non-interactively for automation scenarios. For details and examples, see [Authenticating a service principal with Azure Resource Manager](resource-group-authenticate-service-principal-cli.md).

## Scenario 4: Use a publish settings file
If you only need to use the Azure Service Management mode CLI commands (for example, to deploy Azure VMs in the classic deployment model), you can connect using a publish settings file. This method installs a certificate on your local computer that allows you to perform management tasks for as long as the subscription and the certificate are valid.

* **To download the publish settings file** for your account, ensure that the CLI is in Service Management mode by typing `azure config mode asm`. Then run the following command:

        azure account download

This opens your default browser and prompts you to sign in to the [Azure classic portal](https://manage.windowsazure.com). After you sign in, a `.publishsettings` file downloads. Make note of where this file is saved.

> [!NOTE]
> If your account is associated with multiple Azure Active Directory tenants, you may be prompted to select which Active Directory you wish to download a publish settings file for.
>
>

Once selected using the download page, or by visiting the Azure classic portal, the selected Active Directory becomes the default used by the classic portal and download page. Once a default has been established, you see the text '**click here to return to the selection page**' at the top of the download page. Use the provided link to return to the selection page.

* **To import the publish settings file**, run the following command:

        azure account import <path to your .publishsettings file>

> [!IMPORTANT]
> After importing your publish settings, you should delete the `.publishsettings` file. It is no longer required by the Azure CLI and presents a security risk as it could be used to gain access to your subscription.
>
>

## CLI command modes
The Azure CLI provides two command modes for working with Azure resources, with different command sets:

* **Resource Manager mode** - for working with Azure resources in the Resource Manager deployment model. To set this mode, run `azure config mode arm`.
* **Service Management mode** - for working with Azure resources in the classic deployment model. To set this mode, run `azure config mode asm`.

When first installed, the current release of the CLI is in Resource Manager mode.

> [!NOTE]
> The Resource Manager mode and Service Management mode are mutually exclusive. That is, resources created in one mode cannot be managed from the other mode.
>
>

## Multiple subscriptions
If you have multiple Azure subscriptions, connecting to Azure grants access to all subscriptions associated with your credentials. One subscription is selected as the default, and used by the Azure CLI when performing operations. You can view the subscriptions, including the current default subscription, using the `azure account list` command. This command returns information similar to the following:

    info:    Executing command account list
    data:    Name              Id                                    Current
    data:    ----------------  ------------------------------------  -------
    data:    Azure-sub-1       ####################################  true
    data:    Azure-sub-2       ####################################  false

In the preceding list, the **Current** column indicates the current default subscription as Azure-sub-1. To change the default subscription, use the `azure account set` command, and specify the subscription that you wish to be the default. For example:

    azure account set Azure-sub-2

This changes the default subscription to Azure-sub-2.

> [!NOTE]
> Changing the default subscription takes effect immediately, and is a global change; new Azure CLI commands, whether you run them from the same command-line instance or a different instance, use the new default subscription.
>
>

If you wish to use a non-default subscription with the Azure CLI, but don't want to change the current default, you can use the `--subscription` option for the command and provide the name of the subscription you wish to use for the operation.

Once you are connected to your Azure subscription, you can start using the Azure CLI commands to work with Azure resources.

## Storage of CLI settings
Whether you log in with the `azure login` command or import publish settings, your CLI profile and logs are stored in a `.azure` directory located in your `user` directory. Your `user` directory is protected by your operating system. However, we recommend that you take additional steps to encrypt your `user` directory. You can do so in the following ways:

* On Windows, modify the directory properties or use BitLocker.
* On Mac, turn on FileVault for the directory.
* On Ubuntu, use the Encrypted Home directory feature. Other Linux distributions offer similar features.

## Logging out
To log out, use the following command:

    azure logout -u <username>

If the subscriptions associated with the account are only authenticated with Active Directory, logging out deletes the subscription information from the local profile. However, if a publish settings file was also imported for the subscriptions, logging out only deletes Active Directory related information from the local profile.

## Next steps
* To use Azure CLI commands, see [Azure CLI commands in Resource Manager mode](virtual-machines/azure-cli-arm-commands.md) and [Azure CLI commands in Service Management mode](https://docs.microsoft.com/cli/azure/get-started-with-az-cli2).
* To learn more about the Azure CLI, download source code, report problems, or contribute to the project, visit the [GitHub repository for the Azure CLI](https://github.com/azure/azure-xplat-cli).
* If you encounter problems using the Azure CLI, or Azure, visit the [Azure Forums](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurescripting).
