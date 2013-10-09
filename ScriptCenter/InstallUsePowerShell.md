<properties linkid="Install-Config-Windows-Azure-PowerShell" urlDisplayName="Windows Azure PowerShell" pageTitle="How to install and configure Windows Azure PowerShell" metaDescription="Learn how to install and configure Windows Azure PowerShell." umbracoNaviHide="0" disqusComments="1" writer="kathydav" editor="tysonn" manager="jeffreyg" /> 

# How to install and configure Windows Azure PowerShell#

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/manage/install-and-configure-windows-powershell/" title="PowerShell" class="current">PowerShell</a><a href="/en-us/manage/install-and-configure-cli/" title="Cross-Platform CLI">Cross-Platform CLI</a></div>

You can use Windows PowerShell to perform a variety of tasks in Windows Azure, either interactively at a command prompt or automatically through scripts. Windows Azure PowerShell is a module that provides cmdlets to manage Windows Azure through Windows PowerShell. You can use the cmdlets to create, test, deploy, and manage solutions and services delivered through the Windows Azure platform. In most cases, you can using the cmdlets to perform the same tasks that you can perform through the Windows Azure Management Portal. For example, you can create and configure cloud services, virtual machines, virtual networks, and websites. 

The module is distributed as a downloadable file and the source code is managed through a publicly available repository. A link to the downloadable files is provided in the installation instructions later in this topic. For information about the source code, see [Windows Azure PowerShell code repository](https://github.com/WindowsAzure/azure-sdk-tools).

This guide provides basic information about installing and setting up Windows Azure PowerShell to manage the Windows Azure platform.

## Table of contents
  
 * [Prerequisites for using Windows Azure PowerShell](#Prereq)
 * [How to: Install Windows Azure PowerShell](#Install)  
 * [How to: Connect to your subscription](#Connect)
 * [How to use the cmdlets: An example](#Ex)
 * [Getting Help](#Help)
 * [Additional Resources](#Resources)  


### <a id="Prereq"></a>Prerequisites for using Windows Azure PowerShell

Windows Azure is a subscription-based platform. This means that a subscription is required to use the platform. In most cases, it also means that the cmdlets require subscription information to perform the tasks with your subscription. (Some of the storage-related cmdlets can be used without this information.) You provide this by configuring your computer to connect to your subscription. Instructions are provided in this article, under "How to: Connect to your subscription."

**Note**: A variety of subscription options are available. For information, see [Get Started with Windows Azure](http://go.microsoft.com/fwlink/p/?LinkId=320795).

When you install the module, the installer checks your system for the required software and installs all dependencies, such as the correct version of Windows PowerShell and .NET Framework. 

<h2> <a id="Install"></a>How to: Install Windows Azure PowerShell</h2>

You can download and install the Windows Azure PowerShell module by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?LinkId=320376). When prompted, click **Run**. The Microsoft Web Platform Installer loads, with the  **Windows Azure PowerShell** module available for installation. The Web Platform Installer installs all dependencies for the Windows Azure PowerShell cmdlets. Follow the prompts to complete the installation.

For more information about the command-line tools available for Windows Azure, see [Command-line tools]( http://go.microsoft.com/fwlink/?LinkId=320796).

Installing the module also installs a customized console for Windows Azure PowerShell. You can run the cmdlets from either the standard Windows PowerShell console or the Windows Azure PowerShell console.

The method you use to open either console depends on the version of Windows you're running:

- On a computer running at least Windows 8 or Windows Server 2012, you can use the built-in Search. From the Start screen, begin typing **power**. This produces a scoped list of apps that includes Windows PowerShell and Windows Azure PowerShell. Click either app to open the console window. (To pin the app to the Start screen, right-click the icon.)

- On a computer running a version earlier than Windows 8 or Windows Server 2012, you can use the Start menu. From the **Start** menu, click **All Programs**, click **Windows Azure**, and then click **Windows Azure PowerShell**.


<h2><a id="Connect"></a>How to: Connect to your subscription</h2>

Use of Windows Azure requires a subscription. If you don't have a subscription, see [Get Started with Windows Azure](http://go.microsoft.com/fwlink/p/?LinkId=320795).

The cmdlets require your subscription information so that it can be used to manage your services. As of the .0.7 release of the module, there are two ways of providing this information. You can use download and use a certificate that contains the information, or you can log in to Windows Azure using your Microsoft account (either a personal ID or an organizational ID). When you use a Microsoft account, authentication is performed using Windows Azure Active Directory (Windows Azure AD). 

To help you choose the authentication method that's appropriate for your needs, consider the following:

- When you use the log-in method, you don't need to download or import the subscription information expires after 8 hours. After that time, you'll need to log in again. This method makes it easier to manage access to a subscription, but may disrupt automation. 
- When you use the certificate method, the subscription information is available as long as the subscription is valid. This method makes it easier to use automation for long-running tasks. After you download and import the information, you don't need to provide it again. However, this method makes it harder to manage access to a shared subscription, such as when more than one person is authorized to access the account.    

For more information about authentication and subscription management in Windows Azure, see [this article](http://go.microsoft.com/fwlink/?LinkId=324796).

<h3>Use the log-in method</h3>

1. Sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com) using the credentials for your Windows Azure account.

2. Open the Windows Azure PowerShell console, as instructed in [How to: Install Windows Azure PowerShell](#Install).

3. Type the following command:

    `Add-AzureAccount`
4. A sign-in window opens. Type the email address associated with your Microsoft account.

5. A second sign-in window opens. Type the password. Windows Azure authenticates and saves the credential information, and then closes the window.

<h3>Use the certificate method</h3>

The Windows Azure PowerShell module includes cmdlets that help you download and import the certificate.

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
about your subscriptions, you can get it from the <a href="http://manage.windowsazure.com/">Windows Azure Management Portal</a> or the <a href="http://go.microsoft.com/fwlink/p/?LinkId=324875">Microsoft Online Services Customer Portal</a>.</p> 
</div>

1. Sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com) using the credentials for your Windows Azure account.

2. Open the Windows Azure PowerShell console, as instructed in [How to: Install Windows Azure PowerShell](#Install).

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

<h3> View subscription details</h3>
To view the subscription information, type:

	`Get-AzureSubscription`

## <a id="Ex"></a>How to use the cmdlets: An example ##

After you've installed the module and configured your computer to connect to your subscription, you can create a website as a example that shows how to use the cmdlets.

1. Open the Windows Azure PowerShell shell, unless it's already open.

2. Determine a name to give the site. You'll need to use a name that conforms to DNS naming conventions. Valid names can contain only letters 'a' through 'z', numbers '0' through '9', and can also the hyphen ('-'). The name also must be unique within Windows Azure. An easy way to create a unique name is to use a form of your account name.

	After you pick a name, type a command similar to the following. For example, to create a website using your account and a number so you can use this convention more than once, type the following, substituting your account name:

	`New-AzureWebsite account-name-1`

	The cmdlet creates the website, and then lists information about the new website.

3. To check the state of the website, type:

	`Get-AzureWebsite`

	The cmdlet lists the name and state, and host name of the new website. 

	**Note**: Run as shown, this command lists information about all the websites associated with the current subscription. 

4. Websites are started after they are created. To stop the website, type:

	`Stop-AzureWebsite -Name account-name-1`

5. Run the Get-AzureWebsite command again to verify that the site's state is 'stopped'.
  
5. To complete this test, you can delete the website. Type:  

	`Remove-AzureWebsite -Name account-name-1`

	Confirm the removal to complete the task.

##<a id="Help"></a>Getting Help##

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
		<td>help &lt;<b>language</b>&gt;-dev</td>
		<td>Lists cmdlets for developing and managing applications in a specific language. For example, help node-dev, help php-dev, or help python-dev.</td>
    </tr>
	    <tr align="left" valign="top">
		<td>help &lt;<b>cmdlet</b>&gt;</td>
		<td>Displays help about a Windows PowerShell cmdlet.</td>
    </tr>
    <tr align="left" valign="top">
		<td>help &lt;<b>cmdlet</b>&gt; -parameter *</td>
		<td>Displays parameter definitions for a cmdlet. For example, help get-azuresubscription -parameter *</td>
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


## <a id="Resources"></a>Additional Resources ##

These are some of the resources available that you can use to learn to use Windows Azure and Windows PowerShell. 

- To provide feedback about the cmdlets, report issues, or access the source code, see [Windows Azure PowerShell code repository](https://github.com/WindowsAzure/azure-sdk-tools).

- To learn about the Windows PowerShell command line and scripting environment, see the [TechNet Script Center](http://go.microsoft.com/fwlink/p/?LinkId=320211).

- For information about installing, learning, using, and customizing Windows PowerShell, see [Scripting with Windows PowerShell](http://go.microsoft.com/fwlink/p/?LinkId=320210).

- For information about what scripts are and how to run them in Windows PowerShell, see [Running Scripts](http://go.microsoft.com/fwlink/p/?LinkId=320627). This article includes basic information about creating scripts and configuring your computer to run scripts. 

- For information about cmdlets for Windows Azure AD, see [Manage Windows Azure AD using Windows PowerShell](http://go.microsoft.com/fwlink/p/?LinkId=320628).



  [Get-AzurePublishSettings]: http://msdn.microsoft.com/en-us/library/windowsazure/hh757270(vs.103).aspx
  [Import-AzurePublishSettings]: http://msdn.microsoft.com/en-us/library/windowsazure/hh757264(vs.103).aspx
  [Microsoft Online Services Customer Portal]: https://mocp.microsoftonline.com/site/default.aspx
 
  

