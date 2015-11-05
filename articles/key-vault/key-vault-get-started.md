<properties
	pageTitle="Get started with Azure Key Vault | Microsoft Azure"
	description="Use this tutorial to help you get started with Azure Key Vault to create a hardened container in Azure, to store and manage cryptographic keys and secrets in Azure."
	services="key-vault"
	documentationCenter=""
	authors="cabailey"
	manager="mbaldwin"
	tags="azure-resource-manager"/>

<tags
	ms.service="key-vault"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="10/14/2015"
	ms.author="cabailey"/>

# Get started with Azure Key Vault #
Azure Key Vault is available in most regions. For more information, see the [Key Vault pricing page](../../../../pricing/details/key-vault/).

## Introduction  
Use this tutorial to help you get started with Azure Key Vault to create a hardened container (a vault) in Azure, to store and manage cryptographic keys and secrets in Azure. It walks you through the process of using Azure PowerShell to create a vault that contains a key or password that you can then use with an Azure application. It then shows you how an application can use that key or password.

*Estimated time to complete:** 20 minutes

>[AZURE.NOTE]  This tutorial does not include instructions for how to write the Azure application that one of the steps includes, namely how to authorize an application to use a key or secret in the key vault.
>
>Currently, you cannot configure Azure Key Vault in the Azure portal. Instead, use these Azure PowerShell instructions. Or, for Cross-Platform Command-Line Interface instructions, see [this equivalent tutorial](key-vault-manage-with-cli.md).

For overview information about Azure Key Vault, see [What is Azure Key Vault?](key-vault-whatis.md)

## Prerequisites

To complete this tutorial, you must have the following:

- A subscription to Microsoft Azure. If you do not have one, you can sign up for a [free trial](../../../../pricing/free-trial).
- Azure PowerShell version 0.9.1 through 0.9.8. To install Azure PowerShell and associate it with your Azure subscription, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).
- An application that will be configured to use the key or password that you create in this tutorial. A sample application is available from the [Microsoft Download Center](http://www.microsoft.com/en-us/download/details.aspx?id=45343). For instructions, see the accompanying Readme file.


This tutorial is designed for Azure PowerShell beginners, but it assumes that you understand the basic concepts, such as modules, cmdlets, and sessions. For more information, see [Getting started with Windows PowerShell](https://technet.microsoft.com/library/hh857337.aspx).

To get detailed help for any cmdlet that you see in this tutorial, use the **Get-Help** cmdlet.

	Get-Help <cmdlet-name> -Detailed

For example, to get help for the **Add-AzureAccount** cmdlet, type:

	Get-Help Add-AzureAccount -Detailed

You can also read the following tutorials to get familiar with Azure Resource Manager in Azure PowerShell:

- [How to install and configure Azure PowerShell](../powershell-install-configure.md)
- [Using Azure PowerShell with Resource Manager](../powershell-azure-resource-manager.md)


## <a id="connect"></a>Connect to your subscriptions ##

Start an Azure PowerShell session and sign in to your Azure account with the following command:  

    Add-AzureAccount

In the pop-up browser window, enter your Azure account user name and password. Azure PowerShell will get all the subscriptions that are associated with this account and by default, uses the first one.

If you have multiple subscriptions and want to specify a specific one to use for Azure Key Vault, type the following to see the subscriptions for your account:

    Get-AzureSubscription

Then, to specify the subscription to use, type:

    Select-AzureSubscription -SubscriptionName <subscription name>

For more information about configuring Azure PowerShell, see  [How to install and configure Azure PowerShell](../powershell-install-configure.md).

## <a id="switch"></a>Switch to using Azure Resource Manager ##

The versions of Azure Key Vault cmdlets in this tutorial require Azure Resource Manager, so type the following to switch to Azure Resource Manager mode:

	Switch-AzureMode AzureResourceManager

## <a id="resource"></a>Create a new resource group ##

When you use Azure Resource Manager, all related resources are created inside a resource group. We will create a new resource group named **ContosoResourceGroup** for this tutorial:

	New-AzureResourceGroup –Name 'ContosoResourceGroup' –Location 'East Asia'

For the **-Location** parameter, use the command [Get-AzureLocation](https://msdn.microsoft.com/library/azure/dn654582.aspx) to identify how to specify an alternative location to the one in this example. If you need more information, type: `Get-Help Get-AzureLocation`


## <a id="vault"></a>Create a key vault ##

Use the [New-AzureKeyVault](https://msdn.microsoft.com/library/azure/dn903602\(v=azure.98\).aspx) cmdlet to create a key vault. This cmdlet has three mandatory parameters: a **resource group name**, a **key vault name**, and the **geographic location**.

For example, if you use the vault name of **ContosoKeyVault**, the resource group name of **ContosoResourceGroup**, and the location of **East Asia**, type:

    New-AzureKeyVault -VaultName 'ContosoKeyVault' -ResourceGroupName 'ContosoResourceGroup' -Location 'East Asia'

The output of this cmdlet shows properties of the key vault that you’ve just created. The two most important properties are:

- **Name**: In the example, this is **ContosoKeyVault**. You will use this name for other Key Vault cmdlets.
- **vaultUri**: In the example, this is https://contosokeyvault.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

Your Azure account is now authorized to perform any operations on this key vault. As yet, nobody else is.

## <a id="add"></a>Add a key or secret to the key vault ##

If you want Azure Key Vault to create a software-protected key for you, use the [Add-AzureKeyVaultKey](https://msdn.microsoft.com/library/azure/dn868048\(v=azure.98\).aspx) cmdlet, and type the following:

    $key = Add-AzureKeyVaultKey -VaultName 'ContosoKeyVault' -Name 'ContosoFirstKey' -Destination 'Software'

However, if you have an existing software-protected key in a .PFX file saved to your C:\ drive in a file named softkey.pfx that you want to upload to Azure Key Vault, type the following to set the variable **securepfxpwd** for a password of **123** for the .PFX file:

    $securepfxpwd = ConvertTo-SecureString –String '123' –AsPlainText –Force

Then type the following to import the key from the .PFX file, which protects the key by software in the Key Vault service:

    $key = Add-AzureKeyVaultKey -VaultName 'ContosoKeyVault' -Name 'ContosoFirstKey' -KeyFilePath 'c:\softkey.pfx' -KeyFilePassword $securepfxpwd


You can now reference this key that you created or uploaded to Azure Key Vault, by using its URI. Use **https://ContosoKeyVault.vault.azure.net/keys/ContosoFirstKey** to always get the current version, and use **https://ContosoKeyVault.vault.azure.net/keys/ContosoFirstKey/cgacf4f763ar42ffb0a1gca546aygd87** to get this specific version.  

To display the URI for this key, type:

	$Key.key.kid

To add a secret to the vault, which is a password named SQLPassword and has the value of Pa$$w0rd to Azure Key Vault, first convert the value of Pa$$w0rd to a secure string by typing the following:

	$secretvalue = ConvertTo-SecureString 'Pa$$w0rd' -AsPlainText -Force

Then, type the following:

	$secret = Set-AzureKeyVaultSecret -VaultName 'ContosoKeyVault' -Name 'SQLPassword' -SecretValue $secretvalue

You can now reference this password that you added to Azure Key Vault, by using its URI. Use **https://ContosoVault.vault.azure.net/secrets/SQLPassword** to always get the current version, and use **https://ContosoVault.vault.azure.net/secrets/SQLPassword/90018dbb96a84117a0d2847ef8e7189d** to get this specific version.

To display the URI for this secret, type:

	$secret.Id

Let’s view the key or secret that you just created:

- To view your key, type: `Get-AzureKeyVaultKey –VaultName 'ContosoKeyVault'`
- To view your secret, type: `Get-AzureKeyVaultSecret –VaultName 'ContosoKeyVault'`

Now, your key vault and key or secret is ready for applications to use. You must authorize applications to use them.  

## <a id="register"></a>Register an application with Azure Active Directory ##

This step would usually be done by a developer, on a separate computer. It is not specific to Azure Key Vault, but is included here for completeness.


>[AZURE.IMPORTANT] To complete the tutorial, your account, the vault, and the application that you will register in this step must all be in the same Azure directory.

Applications that use a key vault must authenticate by using a token from Azure Active Directory. To do this, the owner of the application must first register the application in their Azure Active Directory. At the end of registration, the application owner gets the following values:


- An **Application ID** (also known as a Client ID) and **authentication key** (also known as the shared secret). The application must present both these values to Azure Active Directory, to get a token. How the application is configured to do this depends on the application. For the Key Vault sample application, the application owner sets these values in the app.config file.

To register the application in Azure Active Directory:

1. Sign in to the Azure portal.
2. On the left, click **Active Directory**, and then select the directory in which you will register your application. <br> <br> **Note:** You must select the same directory that contains the Azure subscription with which you created your key vault. If you do not know which directory this is, click **Settings**, identify the subscription with which you created your key vault, and note the name of the directory displayed in the last column.

3. Click **APPLICATIONS**. If no apps have been added to your directory, this page shows only the **Add an App** link. Click the link, or alternatively, you can click **ADD** on the command bar.
4.	In the **ADD APPLICATION** wizard, on the **What do you want to do?** page, click **Add an application my organization is developing**.
5.	On the **Tell us about your application** page, specify a name for your application, and then select **WEB APPLICATION AND/OR WEB API** (the default). Click the **Next** icon.
6.	On the **App properties** page, specify the **SIGN-ON URL** and **APP ID URI** for your web application. If your application does not have these values, you can make them up for this step (for example, you could specify http://test1.contoso.com for both boxes). It does not matter if these sites exist; what is important is that the app ID URI for each application is different for every application in your directory. The directory uses this string to identify your app.
7.	Click the **Complete** icon to save your changes in the wizard.
8.	On the **Quick Start** page, click **CONFIGURE**.
9.	Scroll to the **keys** section, select the duration, and then click **SAVE**. The page refreshes and now shows a key value. You must configure your application with this key value and the **CLIENT ID** value. (Instructions for this configuration will be application-specific.)
10.	Copy the client ID value from this page, which you will use in the next step to set permissions on your vault.

## <a id="authorize"></a>Authorize the application to use the key or secret ##

To authorize the application to access the key or secret in the vault, use the
 [Set-AzureKeyVaultAccessPolicy](https://msdn.microsoft.com/library/azure/dn903607\(v=azure.98\).aspx) cmdlet.

For example, if your vault name is **ContosoKeyVault** and the application you want to authorize has a client ID of 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed, and you want to authorize the application to decrypt and sign with keys in your vault, run the following:


	Set-AzureKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -ServicePrincipalName 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed -PermissionsToKeys decrypt,sign

If you want to authorize that same application to read secrets in your vault, run the following:


	Set-AzureKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -ServicePrincipalName 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed -PermissionsToSecrets Get

## <a id="HSM"></a>If you want to use a hardware security module (HSM) ##

For added assurance, you can import or generate keys in hardware security modules (HSMs) that never leave the HSM boundary. The HSMs are FIPS 140-2 Level 2 validated. If this requirement doesn't apply to you, skip this section and go to [Delete the key vault and associated keys and secrets](#delete).

To create these HSM-protected keys, you must have a [vault subscription that supports HSM-protected keys](../../../pricing/free-trial).


When you create the vault, add the **-SKU** parameter:


	New-AzureKeyVault -VaultName 'ContosoKeyVaultHSM' -ResourceGroupName 'ContosoResourceGroup' -Location 'East Asia' -SKU 'Premium'



You can add software-protected keys (as shown earlier) and HSM-protected keys to this vault. To create an HSM-protected key, set the **-Destination** parameter to 'HSM':

	$key = Add-AzureKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -Name 'ContosoFirstHSMKey' -Destination 'HSM'

You can use the following command to import a key from a .PFX file on your computer. This command imports the key into HSMs in the Key Vault service:

	$key = Add-AzureKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -Name 'ContosoFirstHSMKey' -KeyFilePath 'c:\softkey.pfx' -KeyFilePassword $securepfxpwd -Destination 'HSM'


The next command imports a “bring your own key" (BYOK) package. This lets you generate your key in your local HSM, and transfer it to HSMs in the Key Vault service, without the key leaving the HSM boundary:

	$key = Add-AzureKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -Name 'ContosoFirstHSMKey' -KeyFilePath 'c:\ITByok.byok' -Destination 'HSM'

For more detailed instructions about how to generate this BYOK package, see [How to generate and transfer HSM-protected keys for Azure Key Vault](key-vault-hsm-protected-keys.md).

## <a id="delete"></a>Delete the key vault and associated keys and secrets ##

If you no longer need the key vault and the key or secret that it contains, you can delete the key vault by using the [Remove-AzureKeyVault](https://msdn.microsoft.com/library/azure/dn903603\(v=azure.98\).aspx) cmdlet:

	Remove-AzureKeyVault -VaultName 'ContosoKeyVault'

Or, you can delete an entire Azure resource group, which includes the key vault and any other resources that you included in that group:

	Remove-AzureResourceGroup -ResourceGroupName 'ContosoResourceGroup'


## <a id="other"></a>Other Azure PowerShell Cmdlets ##

Other commands that you might find useful for managing Azure Key Vault:

- `$Keys = Get-AzureKeyVaultKey -VaultName 'ContosoKeyVault'`: This command gets a tabular display of all keys and selected properties.
- `$Keys[0]`: This command displays a full list of properties for the specified key
- `Get-AzureKeyVaultSecret`: This command lists a tabular display of all secret names and selected properties.
- `Remove-AzureKeyVaultKey -VaultName 'ContosoKeyVault' -Name 'ContosoFirstKey'`: Example how to remove a specific key.
- `Remove-AzureKeyVaultSecret -VaultName 'ContosoKeyVault' -Name 'SQLPassword'`: Example how to remove a specific secret.


## <a id="next"></a>Next steps ##

For a follow-up tutorial that uses Azure Key Vault in a web application, see [Use Azure Key Vault from a Web Application](key-vault-use-from-web-application.md).

For a list of Azure PowerShell cmdlets for Azure Key Vault, see [Azure Key Vault Cmdlets](https://msdn.microsoft.com/library/azure/dn868052\(v=azure.98\).aspx). 

If you want to try the new version of Azure PowerShell (version 1.0) that is currently in preview, you no longer need to run `Switch-AzureMode AzureResourceManager` and some of the Key Vault cmdlets are renamed. For more information about this preview version, see the [Azure PowerShell 1.0 Preview](https://azure.microsoft.com/en-us/blog/azps-1-0-pre/) post on the Microsoft Azure blog. For a list of the Key Vault cmdlets for this version of Azure PowerShell, see [Azure Key Vault Cmdlets](https://msdn.microsoft.com/library/azure/dn868052.aspx). If you install this new version of Azure PowerShell, you can use the instructions in this tutorial with the following changes:

* Do not run **Switch-AzureMode AzureResourceManager**
* Instead of **New-AzureKeyVault**, run `New-AzureRMKeyVault`
* Instead of **Get-AzureKeyVault**, run `Get-AzureRMKeyVault`
* Instead of **Remove-AzureKeyVault**, run `Remove-AzureRMKeyVault`
* Instead of **Set-AzureKeyVaultAccessPolicy**, run `Set-AzureRMKeyVaultAccessPolicy`   

For programming references, see [the Azure Key Vault developer's guide](key-vault-developers-guide.md).
