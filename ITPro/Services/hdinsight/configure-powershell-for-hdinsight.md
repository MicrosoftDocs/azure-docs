<properties linkid="manage-services-hdinsight-configure-powershell-for-hdinsight" urlDisplayName="HDInsight Administration" pageTitle="Install and configure PowerShell for HDInsight - Windows Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" metaDescription="Learn how to install and configure PowerShell to use with the HDInsight service." umbracoNaviHide="0" disqusComments="1" writer="jgao" editor="cgronlun" manager="paulettm" />

#Install and configure PowerShell for HDInsight

 This article provides basic information about installing and configuring workstations to manage HDInsight clusters using PowerShell.

**Prerequisites:**

Before you begin this article, you must have the following:

- A Windows Azure subscription. Windows Azure is a subscription-based platform. The HDInsight PowerShell cmdlets perform the tasks with your subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

##In this article

- [Install Windows Azure PowerShell](#azure-cmdlets)
- [Install Windows Azure HDInsight PowerShell Tools](#hdinsight-cmdlets)
- [Connect to your Windows Azure subscription](#connect)
- [Select Azure subscription](#selectsubscription)
- [Run PowerShell scripts](#runscripts)
- [Getting help](#help)
- [Additional resource](#resource)
- [See also](#seealso)

## <a id="azure-cmdlet"></a>Install Windows Azure PowerShell
*Windows PowerShell* can be used to perform a variety of tasks in Windows Azure, either interactively at a command prompt or automatically through scripts. *Windows Azure PowerShell* is a module that provides cmdlets to manage Windows Azure through Windows PowerShell. 



**To install Windows Azure PowerShell**

1. Open Internet Explorer, and browse to the [Windows Azure Downloads][powershell-download] page.
2. Click **Run** from the bottom of the page to run the installation package.

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>When you install the module, the installer checks your system for the required software and installs all dependencies, such as the correct version of Windows PowerShell and .NET Framework.</p> 
	</div>

Installing the module also installs a customized console for Windows Azure PowerShell. You can run the cmdlets from either the standard Windows PowerShell console or the Windows Azure PowerShell console.




**To open Windows Azure PowerShell console from a computer running at least Windows 8 or Windows Server 2012**

1. From the Start screen, begin typing **power**. This produces a scoped list of apps that includes Windows PowerShell and Windows Azure PowerShell. 
2. Click either app to open the console window. 
3. To pin the app to the Start screen, right-click the icon.

**To open Windows Azure PowerShell console from a computer running a version earlier than Windows 8 or Windows Server 2012**

1. Click the **Start** menu. 
2. Click **All Programs**, click **Windows Azure**, and then click **Windows Azure PowerShell**.

##<a id="hdinsight-cmdlets"></a>Install Windows Azure HDInsight PowerShell Tools

*Windows Azure HDInsight PowerShell Tools* is a PowerShell module that provides additional cmdlets to manage HDInsight clusters. You can use HDInsight PowerShell cmdlets to provision clusters, manage clusters, and submit Hadoop jobs. 


**To install Windows Azure HDInsight PowerShell Tools**

1. Open Internet Explorer, and then browse to [Microsoft .NET SDK for Hadoop][hdinsight-cmdlets-download] to download the package.
2. Click **Run** from the bottom of the page to run the installation package.

































##<a id="connect"></a>Connect to your subscription

The cmdlets require your Windows Azure subscription information so that it can be used to manage your services. This information is provided by downloading and then importing it for use by the cmdlets:

- The **Get-AzurePublishSettingsFile** cmdlet opens a web page on the [Windows Azure Management Portal][azure-management-portal] from which you can download the subscription information. The information is contained in a .publishsettings file.

- The **Import-AzurePublishSettingsFile** cmdlet imports the .publishsettings file for use by the module. This file includes a management certificate that has security credentials.


<div class="dev-callout"> 
<b>Important</b> 
<p>The publish settings file contains sensitive information. It is recommended that you delete the file or take additional steps to encrypt the user folder that contains the file. On Windows, modify the folder properties or use BitLocker.</p> 
</div>


**To download and import publishsettings**

1. Sign in to the [Windows Azure Management Portal][azure-management-portal] using the credentials for your Windows Azure account.
2. Open the Windows Azure PowerShell console, as instructed in [Install Windows Azure PowerShell](#azure-cmdlets).
3. Run the following command to download the publishsettings file:

		Get-AzurePublishSettingsFile

4. When prompted, download and save the publishing profile and note the path and name of the .publishsettings file. This information is required when you run the Import-AzurePublishSettingsFile cmdlet to import the settings. The default location and file name format is:
	
		C:\Users\<UserProfile>\Desktop\[MySubscription-…]-downloadDate-credentials.publishsettings
	
5. Run a command similar to the following, substituting your Windows account name and the path and file name for the placeholders:

		Import-AzurePublishSettingsFile C:\Users\<UserProfile>\Downloads\<SubscriptionName>-credentials.publishsettings
		
6. To view the subscription information, type:

		Get-AzureSubscription

<div class="dev-callout"> 
<b>Note</b> 
<p>If you are added to other subscriptions as a co-administrator after you import your publish settings, you'll need to repeat this process to download a new .publishsettings file, and then import those settings. For information about adding co-administrators to help manage services for a subscription, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg456328.aspx">Add and Remove Co-Administrators for Your Windows Azure Subscriptions</a>.</p> 
</div>



##<a id="selectsubscription"></a> Select Azure subscription

When managing your cluster and you have multiple subscriptions, it is advisable to select the default subscription.

The following is a sample script for selectting Azure subscription:

	$subscriptionName = "<SubscriptionName>"

	# Select Azure subscription
	Select-AzureSubscription $subscriptionName

	# Show the current subscription name
	Get-AzureSubscription -Current | %{$_.SubscriptionName}



##<a id="runscripts"></a> Run PowerShell scripts

There are two ways to run the PowerShell scripts.  

- Copy and paste the modified script directly into the Windows Azure PowerShell console window. Each line of the script requires a carridge return to excute. You may need to press ENTER to execute the last line of the script.
- Save the modified script as a file with the .ps1 extension, and run the script file from the Windows Azure PowerShell windows. Before you can run a script, you must run the following command from an elevated command prompt to set the execution policy to *RemoteSigned*:

		Set-ExecutionPolicy RemoteSigned

	For more information see [Running Windows PowerShell Scripts][powershell-run-script].

	The Windows PowerShell execution policy determines the conditions under which configuration files and scripts are run. The Windows Azure PowerShell cmdlets need the execution policy set to a value of *RemoteSigned*, *Unrestricted*, or *Bypass*. For more information on the execution policies, see [About_Execution_Policies](http://technet.microsoft.com/en-us/library/dd347641).
	





##<a id="help"></a>Getting help

These resources provide help for specific cmdlets:

- From within the console, you can use the built-in Help system. The **Get-Help** cmdlet provides access to this system. The following table provides some examples of commands you can use to get Help. You can get more information from within the console by typing **help**.

	<table border="1">
	<tr><td>Command</td><td>Result</td></tr>
	<tr><td>help</td><td>Describes how to use the Help system.<br/>
	Note: The description includes some information about Help files that does not apply to the Windows Azure module. Specifically, Help files are installed when the module is installed. They are not available for download separately.</td></tr>
	<tr><td>help azure</td><td>Lists all cmdlets in the Windows Azure PowerShell module.</td></tr>
	<tr><td>help &lt;language>-dev</td><td>	Lists cmdlets for developing and managing applications in a specific language. For example, help node-dev, help php-dev, or help python-dev.</td></tr>
	<tr><td>help &lt;cmdlet></td><td>Displays help about a Windows PowerShell cmdlet.</td></tr>
	<tr><td>help &lt;cmdlet> -parameter *</td><td>Displays parameter definitions for a cmdlet. <br/>For example, help get-azuresubscription -parameter *</td></tr>
	<tr><td>help &lt;cmdlet> -examples</td><td>Displays the syntax and description of example commands for a cmdlet.</td></tr>
	<tr><td>help &lt;cmdlet> -full</td><td>Displays technical requirements for a cmdlet.</td></tr>
	</table>
	
- Reference information about the cmdlets in the Windows Azure PowerShell module is also available in the Windows Azure library. For information, see [Windows Azure Cmdlet Reference][azure-cmdlet-reference].

For help from the community, try these popular forums:

- [Windows Azure forum on MSDN][azure-msdn-forum]
- [StackOverflow][stockoverflow]

##<a id="resource"></a>Additional resources

These are some of the resources available that you can use to learn to use Windows Azure and Windows PowerShell.

- To provide feedback about the cmdlets, report issues, or access the source code, see [Windows Azure PowerShell code repository][powershell-repository].

- To learn about the Windows PowerShell command line and scripting environment, see the [TechNet Script Center][powershell-technet-script-center].

- For information about installing, learning, using, and customizing Windows PowerShell, see [Scripting with Windows PowerShell][powershell-scripting].

- For information about what scripts are and how to run them in Windows PowerShell, see [Running Scripts][powershell-running-scripts]. This article includes basic information about creating scripts and configuring your computer to run scripts.

##<a id="seealso"></a>See also

- [Administer HDInsight using PowerShell][hdinsight-admin-powershell]
- [Provision HDInsight clusters][hdinsight-provision]
- [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
- [How to install and configure Windows Azure PowerShell][powershell-how-to-install]

[stockoverflow]: http://go.microsoft.com/fwlink/?linkid=320213&clcid=0x409
[microsoft-web-platform-installer]: http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409

[hdinsight-cmdlets-download]: http://go.microsoft.com/fwlink/?LinkID=325563
[hdinsight-admin-powershell]: /en-us/manage/services/hdinsight/administer-hdinsight-using-powershell/
[hdinsight-provision]: /en-us/manage/services/hdinsight/provision-hdinsight-clusters/
[hdinsight-submit-jobs]: /en-us/manage/services/hdinsight/submit-hadoop-jobs-programmatically/

[azure-purchase-options]: https://www.windowsazure.com/en-us/pricing/purchase-options/
[azure-member-offers]: https://www.windowsazure.com/en-us/pricing/member-offers/
[azure-free-trial]: https://www.windowsazure.com/en-us/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/

[azure-cmdlet-reference]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554330.aspx
[azure-msdn-forum]: http://go.microsoft.com/fwlink/p/?linkid=320212&clcid=0x409

[powershell-download]: http://go.microsoft.com/fwlink/p/?linkid=320376 
[powershell-about-profiles]: http://go.microsoft.com/fwlink/?LinkID=113729
[powershell-how-to-install]: http://www.windowsazure.com/en-us/manage/install-and-configure-windows-powershell/
[powershell-repository]: https://github.com/WindowsAzure/azure-sdk-tools
[powershell-technet-script-center]: http://go.microsoft.com/fwlink/p/?linkid=320211&clcid=0x409
[powershell-scripting]: http://go.microsoft.com/fwlink/p/?linkid=320210&clcid=0x409
[powershell-running-scripts]: http://go.microsoft.com/fwlink/p/?linkid=320627&clcid=0x409
[powershell-run-script]: http://technet.microsoft.com/en-us/library/ee176949.aspx
