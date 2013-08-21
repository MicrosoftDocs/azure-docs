<properties linkid="Install-Config-Windows-Azure-PowerShell" urlDisplayName="Windows Azure PowerShell" pageTitle="How to install and configure Windows Azure PowerShell" metaKeywords="Get started Azure PowerShell, Azure PS" metaDescription="Get started using Windows Azure PowerShell." metaCanonical="http://www.windowsazure.com/en-us/develop/net/blob-storage" umbracoNaviHide="0" disqusComments="1" writer="kathydav" editor="tysonn" manager="jeffreyg" /> 

# How to install and use Windows Azure PowerShell#

You can use Windows PowerShell to perform a variety of tasks in Windows Azure, either interactively at a command prompt or automatically through scripts. Windows Azure PowerShell is a module that provides cmdlets to manage Windows Azure through Windows PowerShell. You can use the cmdlets to create, test, deploy, and manage solutions and services delivered through the Windows Azure platform. In most cases, you can using the cmdlets to perform the same tasks that you can perform through the Windows Azure Management Portal. For example, you can create and configure cloud services, virtual machines, virtual networks, and websites. 

The module is distributed as a downloadable file and the source code is managed through a publicly available repository. A link to the downloadable files is provided in the installation instructions later in this topic. For information about the source code, see [Windows Azure PowerShell code repository](https://github.com/WindowsAzure/azure-sdk-tools).

This guide provides basic information about installing and setting up Windows Azure PowerShell to manage the Windows Azure platform.

## Table of contents
  
 * [Prerequisites for using Windows PowerShell with Windows Azure](#Prereq)
 * [How to: Install Windows Azure PowerShell](#Install)  
 * [How to: Connect to your subscription](#Connect)
 * [How to: Create a website as a test](#Test)
 * [Getting Help](#Help)
 * [Additional Resources](#Resources)  


### <a id="Prereq"></a>Prerequisites for using Windows PowerShell with Windows Azure

Windows Azure is a subscription-based platform. This means that a subscription is required to use the platform. In most cases, it also means that the cmdlets require subscription information to perform the tasks with your subscription. (Some of the storage-related cmdlets can be used without this information.) You provide this by configuring your computer to connect to your subscription. Instructions are provided in this article, under "How to: Connect to your subscription."

**Note**: A variety of subscription options are available. For information, see [Get Started with Windows Azure](http://www.windowsazure.com/en-us/pricing/purchase-options/).

When you install the module, the installer checks your system for the required software and installs all dependencies, such as the correct version of Windows PowerShell and .NET Framework. 

<h2> <a id="Install"></a>How to: Install Windows Azure PowerShell</h2>

You can download and install the Windows Azure PowerShell module by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?LinkId=320376). When prompted, click **Run**. The Microsoft Web Platform Installer loads, with the  **Windows Azure PowerShell** module available for installation. The Web Platform Installer installs all dependencies for the Windows Azure PowerShell cmdlets. Follow the prompts to complete the installation.

For more information about the command-line tools available for Windows Azure, see [Command-line tools](http://www.windowsazure.com/en-us/downloads/#cmd-line-tools).

Installing the module also installs a customized console for Windows Azure PowerShell. You can run the cmdlets from either the standard Windows PowerShell console or the Windows Azure PowerShell console.

The method you use to open either console depends on the version of Windows you're running:

- On a computer running at least Windows 8 or Windows Server 2012, you can use the built-in Search. From the Start screen, begin typing **power**. This produces a scoped list of apps that includes Windows PowerShell and Windows Azure PowerShell. Click either app to open the console window. (To pin the app to the Start screen, right-click the icon.)

- On a computer running a version earlier than Windows 8 or Windows Server 2012, you can use the Start menu. From the **Start** menu, click **All Programs**, click **Windows Azure**, and then click **Windows Azure PowerShell**.


<h2><a id="Connect"></a>How to: Connect to your subscription</h2>

To use Windows Azure, you must have a
Windows Azure subscription. If you do not have a Windows Azure
subscription, see [purchase options](http://www.windowsazure.com/en-us/pricing/purchase-options/) for Windows Azure for information.

The cmdlets require your subscription information so that they can be used to manage your services. This information is provided by downloading and then importing it for use by the cmdlets. The Windows Azure PowerShell module includes two cmdlets that help you perform these tasks:

- The **Get-AzurePublishSettingsFile** cmdlet opens a web page on the
[Windows Azure Management Portal]( from which you can
download the subscription information. The information is contained in a .publishsettings file.

- The **Import-AzurePublishSettingsFile** imports the .publishsettings file for use by the module. This file includes a management certificate that has security credentials. 

<div class="dev-callout"> 
<b>Important</b> 
<p>We recommend that you delete the publishing profile that you
downloaded using <b>Get-AzurePublishSettingsFile</b> after you import those
settings. Because the management certificate includes security credentials, it
should not be accessed by unauthorized users. If you need information
about your subscriptions, you can get it from the <a href="http://manage.windowsazure.com/">Windows Azure Management Portal</a> or the <a href="https://mocp.microsoftonline.com/site/default.aspx">Microsoft Online Services Customer Portal</a>.</p> 
</div>

1. Sign in to the Windows Azure portal using the credentials for your Windows Azure account.

2. Open the Windows Azure PowerShell shell, as instructed under "To open Windows Azure PowerShell."

3. Type the following command:

    `Get-AzurePublishSettingsFile`

4. When prompted, download and save the publishing profile and note the path and name of
the .publishsettings file. This information is required when you run the
**Import-AzurePublishSettingsFile** cmdlet to import the settings. The default
location and file name format is:

	C:\\Users\&lt;UserProfile&gt;\\Desktop\\[*MySubscription*-…]-*downloadDate*-credentials.publishsettings

5. Type a command similar to the following, substituting your Windows account name and the path and file name for the placholders:

    Import-AzurePublishSettingsFile C:\Users\&lt;UserProfile&gt;\Downloads\&lt;SubscriptionName&gt;-credentials.publishsettings

**Note**:
If you are added to other subscriptions as a co-administrator after you import your publish settings, you'll need to repeat this
process to download a new .publishsettings file, and then import those
settings. For information about adding co-administrators to help manage
services for a subscription, see [Add and Remove Co-Administrators for Your Windows Azure Subscriptions](http://msdn.microsoft.com/en-us/library/windowsazure/gg456328.aspx).

## How to: Create a website as a test ##

After you've installed the module and configured your computer to connect to your subscription, you can create a website to test that you can use the cmdlets to perform tasks in the Windows Azure platform.

1. Open the Windows Azure PowerShell shell, unless it's already open.

2. Determine a name to give the site, and then type a command similar to the following. For example, to create a website named **MyFirstSite**, type:

	`New-AzureWebsite MyFirstSite`

	The cmdlet creates the website, and then lists information about the new website.

3. To check the state of the website, type:

	`Get-AzureWebsite`

	The cmdlet lists the name and state, and host name of the new website. 

	**Note**: Run as shown, this command lists information about all the websites associated with the current subscription. 

4. Websites are started after they are created. To stop the website, type:

	`Stop-AzureWebsite -Name MyFirstSite`

5. Run the Get-AzureWebsite command again to verify that the site's state is 'stopped'.
  
5. To complete this test, you can delete the website. Type:  

	`Remove-AzureWebsite -Name MyFirstSite`

	Confirm the removal to complete the task.

##Getting Help##

These resources provide help for specific cmdlets: 


-   From within the console, you can use the built-in Help system. The **Get-Help** cmdlet provides access to this system. The following table provides some examples of commands you can use to get Help. You can get more information from within the console by typing **help**.

    <table border="1" cellspacing="4" cellpadding="4">
    <tbody>
    <tr align="left" valign="top">
		<td><b>Command</b></td>
		<td><b>Result</b></td>
    </tr>
    <tr align="left" valign="top">
		<td>help</td>
		<td>Describes how to use the Help system. <p><b>Note</b>: The description includes some information about Help files that does not apply to the Windows Azure module. Specifically, Help files are installed when the module is installed. They are not available for download separately.</p>
</td>
    </tr>
    <tr align="left" valign="top">
		<td>help azure</td>
		<td>Lists all cmdlets in the Windows Azure PowerShell module.</td>
    </tr>
	<tr align="left" valign="top">
		<td>help node-dev</td>
		<td>Lists cmdlets for developing and managing Node.js applications.</td>
    </tr>
	<tr align="left" valign="top">
		<td>help php-dev</td>
		<td>Lists cmdlets for developing and managing PHP applications.</td>
    </tr>
    <tr align="left" valign="top">
		<td>help &lt;<b>cmdlet</b>&gt;</td>
		<td>Displays help about a Windows PowerShell cmdlet.</td>
    </tr>
    <tr align="left" valign="top">
		<td>help &lt;<b>cmdlet</b>&gt; -parameter *</td>
		<td>Displays parameter definitions for a cmdlet.</td>
    </tr>
    <tr align="left" valign="top">
		<td>help &lt;<b>cmdlet</b>&gt; -examples</td>
		<td> Displays the syntax and description of example commands for a cmdlet.</td>
    </tr>
    <tr align="left" valign="top">
		<td>help &lt;<b>cmdlet</b>&gt; -full</td>
		<td>Displays technical requirements for a cmdlet.</td>
    </tr>
    </tbody>
    </table>



- Reference information about the cmdlets in the Windows Azure PowerShell module is also available in the Windows Azure library. For information, see [Windows Azure Cmdlet Reference](http://msdn.microsoft.com/en-us/library/windowsazure/jj554330.aspx).

For help from the community, try these popular forums:

- [Windows Azure forum on MSDN]( http://go.microsoft.com/fwlink/p/?LinkId=320212) 
- [Stackoverflow](http://go.microsoft.com/fwlink/?LinkId=320213)


## Additional Resources ##

These are some of the resources available that you can use to learn to use Windows Azure and Windows PowerShell. 

- To provide feedback about the cmdlets, report issues, or access the source code, see [Windows Azure PowerShell code repository](https://github.com/WindowsAzure/azure-sdk-tools).

- To learn about the Windows PowerShell command line and scripting environment, see the [TechNet Script Center](http://go.microsoft.com/fwlink/p/?LinkId=320211).

- For information about installing, learning, using, and customizing Windows PowerShell, see [Scripting with Windows PowerShell](http://go.microsoft.com/fwlink/p/?LinkId=320210).

- For information about cmdlets for Windows Azure AD, see [Manage Windows Azure AD using Windows PowerShell](http://technet.microsoft.com/en-us/library/jj151815.aspx).

- Link to samples repository on GitHub? [azure-sdk-tools-samples](https://github.com/WindowsAzure/azure-sdk-tools-samples  http://go.microsoft.com/fwlink/p/?LinkId=320206) Or skip because the WindowsAzure.com Script Center will have the links?


  [Using Windows PowerShell]: http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx

  [Windows PowerShell Getting Started Guide]: http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx

  

  [Get-AzurePublishSettings]: http://msdn.microsoft.com/en-us/library/windowsazure/hh757270(vs.103).aspx
  [Import-AzurePublishSettings]: http://msdn.microsoft.com/en-us/library/windowsazure/hh757264(vs.103).aspx
  [Microsoft Online Services Customer Portal]: https://mocp.microsoftonline.com/site/default.aspx
 
  

