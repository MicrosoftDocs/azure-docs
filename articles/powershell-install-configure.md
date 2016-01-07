<properties
	pageTitle="How to install and configure Azure PowerShell"
	description="Learn how to install and configure Azure PowerShell."
	editor="tysonn"
	manager="stevenka"
	documentationCenter=""
	services=""
	authors="coreyp-at-msft"/>

<tags
	ms.service="multiple"
	ms.workload="multiple"
	ms.tgt_pltfrm="powershell"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/02/2015"
	ms.author="coreyp"/>

# How to install and configure Azure PowerShell#

<div class="dev-center-tutorial-selector sublanding"><a href="/manage/install-and-configure-windows-powershell/" title="PowerShell" class="current">PowerShell</a><a href="/manage/install-and-configure-cli/" title="Azure CLI">Azure  CLI</a></div>

##What is Azure PowerShell?#
Azure PowerShell is a module that provides cmdlets to manage Azure with Windows PowerShell. You can use the cmdlets to create, test, deploy, and manage solutions and services delivered through the Azure platform. In most cases, the cmdlets can be used for the same tasks as the Azure Management Portal, such as creating and configuring cloud services, virtual machines, virtual networks, and web apps.

<a id="Install"></a>
## Step 1: Install
Following are the two methods by which you can install Azure PowerShell. You can install it either from WebPI, or the PowerShell Gallery:
> [AZURE.NOTE] You may need to reboot after installation in order to see all of the commands in the Windows PowerShell Integrated Scripting Environment (ISE).
###Installing Azure PowerShell from WebPI

Installing Azure PowerShell 1.0 and greater from WebPI is the same as it was for 0.9.x. Download [Azure Powershell](http://aka.ms/webpi-azps) and start the install. If you have Azure PowerShell 0.9.x installed, you will be prompted to uninstall 0.9.x. If you installed Azure PowerShell modules from PowerShell Gallery, the installer requires you to remove the modules before installation to ensure a consistent Azure PowerShell environment.

If you installed Azure PowerShell via PowerShell Gallery but would instead want to use the WebPI installation, run the following commands before installing from WebPI.

    # Uninstall the AzureRM component modules
    Uninstall-AzureRM

    # Uninstall AzureRM module
    Uninstall-Module AzureRM

    # Uninstall the Azure module
    Uninstall-Module Azure

    # Or, you can remove all Azure modules
    # Uninstall-Module Azure* -Force

> [AZURE.NOTE] There is a known issue with PowerShell **$env:PSModulePath** that occurs when installing from WebPI. If your computer requires a restart due to system updates or other installations, it may cause the **$env:PSModulePath** to not include the path where Azure PowerShell is installed. This can be corrected by restarting the machine or adding the Azure PowerShell path to the **$env:PSModulePath**.

> [AZURE.NOTE] If you have installed the PowerShell Gallery Azure modules, you will be asked to uninstall them. This is to prevent confussion about which modules you have installed and where they are located. PowerShell Gallery modules will normally install in **%ProgramFiles%\WindowsPowerShell\Modules**. In contrast, the WebPI installer will install the Azure modules in **%ProgramFiles%\Microsoft SDKs\Azure\PowerShell\**. **PowerShellGet** will uninstall modules and leave behind locked .dlls and their folders if a module dependency is loaded when it's being uninstalled. If you have uninstalled your PowerShell Gallery modules and still receive the error on install, remove the Azure* folders in your **%ProgramFiles%\WindowsPowerShell\Modules** folder.

###Installing Azure PowerShell from the Gallery

Install Azure PowerShell 1.0 or greater from the Gallery using the following commands:

    # Install the Azure Resource Manager modules from the PowerShell Gallery
    Install-Module AzureRM
    Install-AzureRM

    # Install the Azure Service Management module from the PowerShell Gallery
    Install-Module Azure

    # Import AzureRM modules for the given version manifest in the AzureRM module
    Import-AzureRM

    # Import Azure Service Management module
    Import-Module Azure

####More about these commands

- **Install-Module AzureRM** installs a bootstrapping module for the AzureRM modules. This module contains cmdlets to help update, uninstall and import the AzureRM modules in a safe and consistent way. The AzureRM module contains a list of modules and the version range (min and max) required to ensure no breaking changes will be introduced for the major version of AzureRM. For more information on semantic versioning, see [semver.org](http://semver.org). This means you can author your cmdlets using a specific version of AzureRM and know that all of the modules installed via the bootstrapper, will introduce no breaking changes.
- **Install-AzureRM** installs all of the modules declared in the bootstrapping module.
- **Install-Module Azure** installs the Azure module. This module is the Service Management module from Azure PowerShell 0.9.x. This should have no major changes and be interchangeable for the previous version of the Azure module.
- **Import-AzureRM** imports all of the modules in the AzureRM module's list of modules and versions. This ensures that the Azure PowerShell modules that are loaded are within the version range required by the AzureRM module.
- **Import-Module Azure** imports the Azure Service Management module. Note, the Azure module and the AzureRM modules are loaded into your PowerShell session and can both be used together.


## Step 2: Start
The module installs a customized console for Azure PowerShell. You can run the cmdlets from the standard Windows PowerShell console, or from the Azure PowerShell console.
The method you use to open either console depends on the version of Windows you're running:

- On a computer running at least Windows 8 or Windows Server 2012, you can use the built-in Search. From the **Start** screen, begin typing power. This returns a scoped list of apps that includes Windows PowerShell and Azure PowerShell. To open the console, click either app. (To pin the app to the **Start** screen, right-click the icon.)

- On a computer running a version earlier than Windows 8 or Windows Server 2012, use the **Start menu**. From the **Start** menu, click **All Programs**, click **Azure**, and then click **Azure PowerShell**.

You can also run the **Windows PowerShell ISE** to use menu items and keyboard shortcuts to perform many of the same tasks that you would perform in the Windows PowerShell console. To use the ISE, in the Windows PowerShell console, Cmd.exe, or in the **Run** box, type, **powershell_ise.exe**.

###Commands to help you get started

    # To make sure the Azure PowerShell module is available after you install
    Get-Module –ListAvailable 
	
	# If the Azure PowerShell module is not listed when you run Get-Module, you may need to import it
    Import-Module Azure 
	
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

    # To import the Azure.Storage data plane module (blob, queue, table)
    Import-Module Azure.Storage

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

> 1. Login to the [Azure Management Portal](https://manage.windowsazure.com), and click on **Active Directory**.

> 2. If no directory exists, select **Create your directory** and provide the requested information.

> 3. Select your directory and add a new user. This new user can sign in using a work or school account. During the creation of the user, you will be supplied with both an e-mail address for the user and a temporary password. Save this information, as it is used in step 5 below.

> 4. From the management portal, select **Settings** and then select **Administrators**. Select **Add**, and add the new user as a co-administrator. This allows the work or school account to manage your Azure subscription.

> 5. Finally, log out of the Azure portal and then log back in using the work or school account. If this is the first time logging in with this account, you will be prompted to change the password.

> For more information on signing up for Microsoft Azure with a work or school account, see [Sign up for Microsoft Azure as an Organization](sign-up-organization.md).

> For more information about authentication and subscription management in Azure, see [Manage Accounts, Subscriptions, and Administrative Roles](http://go.microsoft.com/fwlink/?LinkId=324796).

### View account and subscription details

You can have multiple accounts and subscriptions available for use by Azure PowerShell. You can add multiple accounts by running **Add-AzureAccount** more than once.

To display the available Azure accounts, type **Get-AzureAccount**.

To display your Azure subscriptions, type **Get-AzureSubscription**.

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

