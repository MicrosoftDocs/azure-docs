<properties
	pageTitle="How to install and configure Azure PowerShell"
	description="Learn how to install and configure Azure PowerShell."
	editor="tysonn"
	manager="dongill"
	documentationCenter=""
	services=""
	authors="coreyp-at-msft"/>

<tags
	ms.service="multiple"
	ms.workload="multiple"
	ms.tgt_pltfrm="powershell"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/22/2016"
	ms.author="coreyp"/>

# How to install and configure Azure PowerShell

<div class="dev-center-tutorial-selector sublanding"><a href="/manage/install-and-configure-windows-powershell/" title="PowerShell" class="current">PowerShell</a><a href="/manage/install-and-configure-cli/" title="Azure CLI">Azure  CLI</a></div>

##What is Azure PowerShell?
Azure PowerShell is a set of modules that provide cmdlets to manage Azure with Windows PowerShell. You can use the cmdlets to create, test, deploy, and manage solutions and services delivered through the Azure platform. In most cases, the cmdlets can be used for the same tasks as the Azure Management Portal, such as creating and configuring cloud services, virtual machines, virtual networks, and web apps.

<a id="Install"></a>
## Step 1: Install

Following are the two methods by which you can install Azure PowerShell. You can install it either from WebPI, or the PowerShell Gallery:

###Installing Azure PowerShell from WebPI

Installing Azure PowerShell 1.0 and greater from WebPI is the same as it was for 0.9.x. Download [Azure PowerShell](http://aka.ms/webpi-azps) and start the install. If you have Azure PowerShell 0.9.x installed, version 0.9.x will be uninstalled as part of the upgrade. If you installed Azure PowerShell modules from PowerShell Gallery, the installer automatically removes the modules before installation to ensure a consistent Azure PowerShell environment.

> [AZURE.NOTE] If you have previously installed Azure modules from the PowerShell Gallery, the installer will automatically remove them. This prevents confusion about which module versions you have installed and where they are located. PowerShell Gallery modules will normally install in **%ProgramFiles%\WindowsPowerShell\Modules**. In contrast, the WebPI installer will install the Azure modules in **%ProgramFiles(x86)%\Microsoft SDKs\Azure\PowerShell\**. If an error occurs during install, you can manually remove the Azure* folders in your **%ProgramFiles%\WindowsPowerShell\Modules** folder, and try the installation again.

Once the installation completes, your ```$env:PSModulePath``` setting should include the directories containing the Azure PowerShell cmdlets.

> [AZURE.NOTE] There is a known issue with PowerShell **$env:PSModulePath** that can occur when installing from WebPI. If your computer requires a restart due to system updates or other installations, it may cause updates **$env:PSModulePath** to not include the path where Azure PowerShell is installed. If this occurs, you may see a 'cmdlet not recognized' message when attempting to use Azure PowerShell cmdlets after the installation or upgrade. If this occurs, restarting the machine should fix the problem.

If you receive a message like the following when attempting to load or execute cmdlets:

```
    PS C:\> Get-AzureRmResource
    Get-AzureRmResource : The term 'Get-AzureRmResource' is not recognized as the name of a cmdlet, function,
    script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is
    correct and try again.
    At line:1 char:1
    + Get-AzureRmResource
    + ~~~~~~~~~~~~~~~~~~~~~~~
        + CategoryInfo          : ObjectNotFound: (get-azurermresourcefork:String) [], CommandNotFoundException
        + FullyQualifiedErrorId : CommandNotFoundException
```

This can be corrected by restarting the machine or importing the cmdlets from C:\Program Files\WindowsPowerShell\Modules\Azure\XXXX\ as following (where XXXX is the version of PowerShell installed:
```
import-module "C:\Program Files\WindowsPowerShell\Modules\Azure\XXXX\azure.psd1"
import-module "C:\Program Files\WindowsPowerShell\Modules\Azure\XXXX\expressroute\expressroute.psd1"
```

###Installing Azure PowerShell from the PowerShell Gallery

Install Azure PowerShell 1.3.0 or greater from the PowerShell Gallery using an elevated Windows PowerShell or PowerShell Integrated Scripting Environment (ISE) prompt using the following commands:

    # Install the Azure Resource Manager modules from the PowerShell Gallery
    Install-Module AzureRM

    # Install the Azure Service Management module from the PowerShell Gallery
    Install-Module Azure

####More about these commands

- **Install-Module AzureRM** installs a rollup module for the Azure Resource Manager cmdlets. The AzureRM module module depends on a particular version range for each Azure Resource Manager module. The included version range assures that no breaking module changes can be included when installing AzureRM modules with the same major version. When you install the AzureRM module, any Azure Resource Manager module that has not previously been installed will be downloaded and installed from the PowerShell Gallery. For more information on the semantic versioning used by Azure PowerShell modules, see [semver.org](http://semver.org). 
- **Install-Module Azure** installs the Azure module. This module is the Service Management module from Azure PowerShell 0.9.x. This should have no major changes and be interchangeable for the previous version of the Azure module.

## Step 2: Start
You can run the cmdlets from the standard Windows PowerShell console, or from PowerShell Integrated Scripting Environment (ISE).
The method you use to open either console depends on the version of Windows you're running:

- On a computer running at least Windows 8 or Windows Server 2012, you can use the built-in Search. From the **Start** screen, begin typing power. This returns a scoped list of apps that includes Windows PowerShell. To open the console, click either app. (To pin the app to the **Start** screen, right-click the icon.)

- On a computer running a version earlier than Windows 8 or Windows Server 2012, use the **Start menu**. From the **Start** menu, click **All Programs**, click  **Accessories**, click the **Windows PowerShell** folder, and then click **Windows PowerShell**.

You can also run the **Windows PowerShell ISE** to use menu items and keyboard shortcuts to perform many of the same tasks that you would perform in the Windows PowerShell console. To use the ISE, in the Windows PowerShell console, Cmd.exe, or in the **Run** box, type, **powershell_ise.exe**.

###Commands to help you get started

    # To make sure the Azure PowerShell module is available after you install
    Get-Module –ListAvailable 
	
    # To login to Azure Resource Manager
    Login-AzureRmAccount

    # You can also use a specific Tenant if you would like a faster login experience
    # Login-AzureRmAccount -TenantId xxxx

    # To view all subscriptions for your account
    Get-AzureRmSubscription

    # To select a default subscription for your current session
    Get-AzureRmSubscription –SubscriptionName “your sub” | Select-AzureRmSubscription

    # View your current Azure PowerShell session context
    # This session state is only applicable to the current session and will not affect other sessions
    Get-AzureRmContext

    # To select the default storage context for your current session
    Set-AzureRmCurrentStorageAccount –ResourceGroupName “your resource group” –StorageAccountName “your storage account name”

    # View your current Azure PowerShell session context
    # Note: the CurrentStorageAccount is now set in your session context
    Get-AzureRmContext

    # To list all of the blobs in all of your containers in all of your accounts
    Get-AzureRmStorageAccount | Get-AzureStorageContainer | Get-AzureStorageBlob


## Step 3: Connect
The cmdlets need your subscription so they can manage your services. You can purchase an Azure subscription if you don't already have one. For instructions, see [How to buy Azure](http://go.microsoft.com/fwlink/p/?LinkId=320795).

1. Type **Login-AzureRmAccount**

2. Type the email address and password associated with your account. Azure authenticates and saves the credential information, and then closes the window.

--OR--

Sign into your work or school account:

    $cred = Get-Credential
    Login-AzureRmAccount -Credential $cred
> [AZURE.NOTE] If you have more than one tenant associated with your organizational account, specify the TenantId parameter:

    $loadersubscription = Get-AzureRmSubscription -SubscriptionName $YourSubscriptionName -TenantId $YourAssociatedSubscriptionTenantId


> [AZURE.NOTE] This non-interactive login method only works with a work or school account. A work or school account is a user that is managed by your work or school, and defined in the Azure Active Directory instance for your work or school. If you do not currently have a work or school account, and are using a Microsoft account to log in to your Azure subscription, you can easily create one using the following steps.

> 1. Login to the [Azure classic portal](https://manage.windowsazure.com), and click on **Active Directory**.

> 2. If no directory exists, select **Create your directory** and provide the requested information.

> 3. Select your directory and add a new user. This new user can sign in using a work or school account. During the creation of the user, you will be supplied with both an e-mail address for the user and a temporary password. Save this information, as it is used in step 5 below.

> 4. From the Azure classic portal, select **Settings** and then select **Administrators**. Select **Add**, and add the new user as a co-administrator. This allows the work or school account to manage your Azure subscription.

> 5. Finally, log out of the Azure classic portal and then log back in using the work or school account. If this is the first time logging in with this account, you will be prompted to change the password.

> For more information on signing up for Microsoft Azure with a work or school account, see [Sign up for Microsoft Azure as an Organization](./active-directory/sign-up-organization.md).

> For more information about authentication and subscription management in Azure, see [Manage Accounts, Subscriptions, and Administrative Roles](http://go.microsoft.com/fwlink/?LinkId=324796).

### View account and subscription details

You can have multiple accounts and subscriptions available for use by Azure PowerShell. You can add multiple accounts by running **Add-AzureRmAccount** more than once.

To display the available Azure accounts, type **Get-AzureAccount**.

To display your Azure subscriptions, type **Get-AzureRmSubscription**.

##<a id="Help"></a>Getting help##

These resources provide help for specific cmdlets:


-   From within the console, you can use the built-in Help system. The **Get-Help** cmdlet provides access to this system. 

- For help from the community, try these popular forums:

 - [Azure forum on MSDN]( http://go.microsoft.com/fwlink/p/?LinkId=320212)
 - [Stackoverflow](http://go.microsoft.com/fwlink/?LinkId=320213)

##Learn More


See the following resources to learn more about using the cmdlets:

For basic instructions about using Windows PowerShell, see [Using Windows PowerShell](http://go.microsoft.com/fwlink/p/?LinkId=321939).

For reference information about the cmdlets, see [Azure Cmdlet Reference](https://msdn.microsoft.com/library/windowsazure/jj554330.aspx).

For sample scripts and instructions to help you learn to use scripting to manage Azure, see the [Script Center](http://go.microsoft.com/fwlink/p/?LinkId=321940).

