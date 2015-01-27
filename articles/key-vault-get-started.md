<properties 
	pageTitle="Get Started with Azure Key Vault | Overview" 
	description="Use this tutorial to help you get started with Azure Key Vault to create a hardened container (a vault) in Azure, to store and manage cryptographic keys and secrets in Azure." 
	services="Key-Vault" 
	documentationCenter="" 
	authors="cabailey" 
	manager="mbaldwin"/>

<tags 
	ms.service="key-vault" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/12/2015" 
	ms.author="cabailey"/>

# Get Started with Azure Key Vault #

Use this tutorial to help you get started with Azure Key Vault—currently in Preview—to create a hardened container (a vault) in Azure, to store and manage cryptographic keys and secrets in Azure. It walks you through the process of using Windows PowerShell to create a vault that contains a key or password that you can then use with an Azure application. It then shows you how an application can then use that key or password.

**Estimated time to complete:** 20 minutes

>[AZURE.NOTE]  This tutorial does not include instructions how to write the Azure application that one of the steps includes, which shows how to authorize an application to use a key or secret in the key vault.
>
>During the Preview period, you cannot configure Azure Key Vault in the Azure Management Portal. Instead, use these Azure PowerShell instructions.

For overview information about Azure Key Vault, see [What is Azure Key Vault?](http://go.microsoft.com/fwlink/?LinkId=521401)

## Prerequisites ##

To complete this tutorial, you must have the following:

- A subscription to Microsoft Azure. If you do not have one, you can sign up for a [free trial](http://azure.microsoft.com/en-us/pricing/free-trial).
- Azure PowerShell version 0.8.13 or later. To install the latest version and associate it with your Azure subscription, see [How to install and configure Windows Azure PowerShell](http://www.windowsazure.com/en-us/documentation/articles/install-configure-powershell/).
- Scripts that make common tasks for Azure Key Vault easier. Download these from the [Azure Script Center] (http://go.microsoft.com/fwlink/?LinkId=521539). 
- An application that will be configured to use the key or password that you create in this tutorial. A sample application is available from [this website](http://go.microsoft.com/fwlink/?LinkId=521527). For instructions, see the accompanying Readme file.


This tutorial is designed for Windows PowerShell beginners, but it assumes that you understand the basic concepts, such as modules, cmdlets, and sessions. For more information about Windows PowerShell, see [Getting Started with Windows PowerShell](http://technet.microsoft.com/en-us/library/hh857337.aspx).

To get detailed help for any cmdlet that you see in this tutorial, use the Get-Help cmdlet. 

	Get-Help <cmdlet-name> -Detailed

For example, to get help for the Add-AzureAccount cmdlet, type:

	Get-Help Add-AzureAccount -Detailed

You can also read the following tutorials to get familiar with Azure Resource Manager in Windows PowerShell:

- [How to install and configure Azure PowerShell](http://azure.microsoft.com/en-us/documentation/articles/install-configure-powershell/)
- [Using Windows PowerShell with Resource Manager](http://azure.microsoft.com/en-us/documentation/articles/powershell-azure-resource-manager/)

## In this tutorial ##

* [Connect to your subscriptions](#connect)
* [Load the Key Vault scripts](#scripts)
* [Create a key vault](#create)
* [Add a key or secret to the key vault](#add)
* [Register an application to use the key or secret](#register) 
* [Authorize the application to use the key or secret](#authorize)
* [If you want to use a hardware security module (HSM)](#HSM)
* [Delete the key vault and associated keys and secrets](#delete)
* [Other Azure PowerShell cmdlets](#other)
* [Next steps](#next)

## <a id="connect"></a>Connect to your subscriptions ##

Start an Azure PowerShell session and sign in to your Azure account with the following command:  

    Add-AzureAccount

In the pop-up browser window, enter your Azure account user name and password. Windows PowerShell will get all the subscriptions that are associated with this account and by default, uses the first one.

If you have multiple subscriptions and want to specify a specific one to use for Azure Key Vault, type the following to see the subscriptions for your account:

    Get-AzureSubscription

Then, to specify the subscription to use, type:

    Select-AzureSubscription -SubscriptionName <subscription name>

For more information about configuring Azure PowerShell, see  [How to install and configure Azure PowerShell](http://azure.microsoft.com/en-us/documentation/articles/install-configure-powershell/).

## <a id="scripts"></a>Load the Key Vault scripts ##

If you haven't already done so, [download the scripts](http://go.microsoft.com/fwlink/?LinkId=521539) and unblock the "Azure Key Vault Powershell scripts.zip" file by right-clicking it, **Properties**, **Unblock**. Then extract the zip file to a local folder on your computer. 

Before you load the script module into your Azure PowerShell session, set the execution policy:

	Set-ExecutionPolicy RemoteSigned -Scope Process

Then load the script module into your Azure PowerShell session. For example, if you extracted the scripts to a folder named C:\KeyVaultScripts, type:
	
	import-module C:\KeyVaultScripts\KeyVaultManager

The Key Vault cmdlets and scripts require Azure Resource Manager, so type the following to switch to Azure Resource Manager mode:

	Switch-AzureMode AzureResourceManager

## <a id="create"></a>Create a key vault ##

Use the [New-AzureKeyVault](http://go.microsoft.com/fwlink/?LinkId=522255) script to create a key vault. This script has three mandatory parameters: a **resource group name**, a **key vault name**, and the **geographic location**.

For example, if you use the  vault name of **ContosoKeyVault**, the resource group name of **ContosoResourceGroup**, and the location of **East Asia**, type:

    New-AzureKeyVault -VaultName 'ContosoKeyVault' -ResourceGroupName 'ContosoResourceGroup' -Location 'East Asia' 

The output of this script shows properties of the key vault that you’ve just created. The two most important properties are:

- **Name**: In the example this is ContosoKeyVault. You will use this name for other Key Vault cmdlets.
- **vaultUri**: In the example this is https://contosokeyvault.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

Your Azure account is now authorized to perform any operations on this key vault. As yet, nobody else is.

## <a id="add"></a>Add a key or secret to the key vault ##

If you want Azure Key Vault to create a software-protected key for you, use the [Add-AzureKeyVaultKey](http://go.microsoft.com/fwlink/?LinkId=520396) cmdlet, and type the following:

    $key = Add-AzureKeyVaultKey -VaultName 'ContosoKeyVault' -Name 'ContosoFirstKey' -Destination 'Software'


However, if you have an existing software-protected key in a .PFX file saved to your C:\ drive in a file named softkey.pfx that you want to upload to Azure Key Vault, type the following to set the variable **securepfxpwd** for a password of **123** for the .PFX file:

    $securepfxpwd = ConvertTo-SecureString –String '123' –AsPlainText –Force

Then type the following to import the key from the .PFX file, which protects the key by software in the Key Vault service:

    $key = Add-AzureKeyVaultKey -VaultName 'ContosoKeyVault' -Name 'ContosoFirstKey' -KeyFilePath 'c:\softkey.pfx' -KeyFilePassword $securepfxpwd


You can now reference this key that you created or uploaded to Azure Key Vault, by using its URI. For example: **https://ContosoKeyVault.vault.azure.net/Keys/ContosoFirstKey/a10f5336-9d93-44a3-9e26-e86e3488b768**  

To display the URI for this key, type:

	$Key.key.kid

To add a secret to the vault, which is a password named SQLPassword and that has the value of Pa$$w0rd to Azure Key Vault, first convert the value of Pa$$w0rd to a secure string by typing the following:

	$secretvalue = ConvertTo-SecureString 'Pa$$w0rd' -AsPlainText -Force

Then, type the following:

	$secret = Set-AzureKeyVaultSecret -VaultName 'ContosoKeyVault' -Name 'SQLPassword' -SecretValue $secretvalue

You can now reference this password that you added to Azure Key Vault, by using its URI. For example: **https://ContosoVault.vault.azure.net/Secrets/778c3e43-3fdb-4cdf-b58e-7f501eb41d68** 

To display the URI for this secret, type:

	$secret.Id

Let’s view the key or secret that you just created:

- To view your key, type: `Get-AzureKeyVaultKey –VaultName 'ContosoKeyVault'`
- To view your secret, type: `Get-AzureKeyVaultSecret –VaultName 'ContosoKeyVault'`

Now, your key vault and key or secret is ready for applications to use. You must authorize applications to use them.  

## <a id="register"></a>Register an application with Azure Active Directory ##

This step would usually be done by a developer, on a separate computer. It is not specific to Azure Key Vault but is included here, for completeness.

For more information about registering applications for Azure Key Vault, download and read the white paper, [Microsoft Azure Key Vault Access Control](http://go.microsoft.com/fwlink/?LinkId=523968).

>[AZURE.IMPORTANT] To complete the tutorial, your account, the vault, and the application that you will register in this step must all be in the same Azure directory.

Applications that use a key vault must authenticate by using a token from Azure Active Directory. To do this, the owner of the application must first register the application in their Azure Active Directory. At the end of registration, the application owner gets the following values:


- An **Application ID** (also known as a Client ID) and **authentication key** (also known as the shared secret). The application must present both these values to Azure Active Directory, to get a token. How the application is configured to do this depends on the application. For the Key Vault sample application, the application owner sets these values in the app.config file.



To register the application in Azure Active Directory:

1. Sign in to the Azure Management Portal.
2. On the left, click **Active Directory**, and then select the directory in which you will register your application. <br> <br> Note: You must select the same directory that contains the Azure subscription with which you created your key vault. If you do not know which directory this is, click **Settings**, identify the subscription with which you created your key vault, and note the name of the directory displayed in the last column.

3. Click **APPLICATIONS**. If no apps have been added to your directory, this page will show only the **Add an App** link. Click the link, or alternatively, you can click the **ADD** on the command bar.
4.	In the **ADD APPLICATION** wizard, on the **What do you want to do?** page, click **Add an application my organization is developing**.
5.	On the **Tell us about your application** page, specify a name for your application and select **WEB APPLICATION AND/OR WEB API** (the default). Click the Next icon.
6.	On the **App properties** page, specify the **SIGN-ON URL** and **APP ID URI** for your web application. If your application does not have these values, you can make them up for this step (for example, you could specify http://test1.contoso.com for both boxes). It does not matter if these sites exist; what is important is that the app ID URI for each application is different for every application in your directory. The directory uses this string to identify your app.
7.	Click the Complete icon to save your changes in the wizard.
8.	On the Quick Start page, click **CONFIGURE**. 
9.	Scroll to the **keys** section, select the duration, and then click **SAVE**. The page refreshes and now shows a key value. You must configure your application with this key value and the **CLIENT ID** value. (Instructions for this configuration will be application-specific.)
10.	Copy the client ID value from this page, which you will use in the next step to set permissions on your vault.




## <a id="authorize"></a>Authorize the application to use the key or secret ##


To authorize the application to access the key or secret in the vault, use the [Set-AzureKeyVaultAccessPolicy](http://go.microsoft.com/fwlink/?LinkId=522257) script. 

For example, if your vault name is ContosoKeyVault and the application you want to authorize has a client ID of 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed, and you want to authorize the application to decrypt and sign with keys in your vault, then run the following:

	Set-AzureKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -ServicePrincipalName 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed -PermissionsToKeys decrypt,sign



## <a id="HSM"></a>If you want to use a hardware security module (HSM) ##

For added assurance, you can import or generate keys in hardware security modules (HSMs) that never leave the HSM boundary. The HSMs are certified to FIPS 140-2 Level 2 and Common Criteria EAL4+. If this requirement doesn't apply to you, skip this section and go to [Delete the key vault and associated keys and secrets](#delete).

To create these HSM-protected keys, you must have a [vault subscription that supports HSM-protected keys](http://go.microsoft.com/fwlink/?linkid=512521).


When you create the vault, add the 'SKU' parameter:

	New-AzureKeyVault -VaultName 'ContosoKeyVaultHSM' -ResourceGroupName 'ContosoResourceGroup' -Location 'East Asia' -SKU 'Premium'

You can add software-protected keys (as shown earlier) and HSM-protected keys to this vault. To create an HSM-protected key, set the Destination parameter to 'HSM':

	$key = Add-AzureKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -Name 'ContosoFirstHSMKey' -Destination 'HSM'

You can use the following command to import a key from a .PFX file on your computer. This command imports the key into HSMs in the Key Vault service:

	$key = Add-AzureKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -Name 'ContosoFirstHSMKey' -KeyFilePath 'c:\softkey.pfx' -KeyFilePassword $securepfxpwd -Destination 'HSM'

The next command imports a “bring your own key" (BYOK) package. This lets you  generate your key in your local HSM, and transfer it to HSMs in the Key Vault service, without the key leaving the HSM boundary:

	$key = Add-AzureKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -Name 'ContosoFirstHSMKey' -KeyFilePath 'c:\ITByok.byok' -Destination 'HSM'

For more detailed instructions about how to generate this BYOK package, see [How to use HSM-Protected Keys with Azure Key Vault](http://go.microsoft.com/fwlink/?LinkId=522252).

## <a id="delete"></a>Delete the key vault and associated keys and secrets ##

If you no longer need the key vault and the key or secret that it contains, you can delete the key vault by using the [Remove-AzureKeyVault]( http://go.microsoft.com/fwlink/?LinkId=522256) script:

	Remove-AzureKeyVault -VaultName 'ContosoKeyVault'

Or, you can delete an entire Azure resource group, which includes the key vault and any other resources that you included in that group:

	Remove-AzureResourceGroup -ResourceGroupName 'ContosoResourceGroup'


## <a id="other"></a>Other Azure PowerShell Cmdlets ##

Other commands that you might useful for managing Azure Key Vault:

- `$Keys = Get-AzureKeyVaultKey`: This command lists a tabular display of all keys and selected properties.
- `$Keys[0]`: This command displays a full list of properties for the specified key
- `Get-AzureKeyVaultSecret`: This command lists a tabular display of all secret names and selected properties.
- `Remove-AzureKeyVaultKey -KeyURI 'https://ContosoKeyVault.vault.azure.net/Keys/a10f5336-9d93-44a3-9e26-e86e3488b768'`: Example how to remove a specific key.
- `Remove-AzureKeyVaultSecret -SecretURI https://ContosoKeyVault.vault.azure.net/Secrets/a10f5336-9d93-44a3-9e26-e86e3488b768`: Example how to remove a specific secret.






## <a id="next"></a>Next steps ##

For more information, see the white paper [Azure Key Vault Concepts and Practices](http://go.microsoft.com/fwlink/?LinkID=521861).

For a list of Windows PowerShell cmdlets and scripts for Azure Key Vault, see [Azure Key Vault Cmdlets](http://go.microsoft.com/fwlink/?LinkId=521403) and [Azure Key Vault Manager Cmdlets](http://go.microsoft.com/fwlink/?LinkId=522582). 

For programming references, see [Azure Key Vault REST API Reference](http://go.microsoft.com/fwlink/?LinkId=518560 ) and [Azure Key Vault C# API Reference](http://go.microsoft.com/fwlink/?LinkId=518561).


