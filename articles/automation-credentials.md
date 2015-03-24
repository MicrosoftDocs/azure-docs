<properties 
   pageTitle="Credentials"
   description="Credentials"
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/16/2015"
   ms.author="bwren" />

# Credentials

An Automation credential asset holds a [PSCredential](http://aka.ms/runbookauthor/pscredential)  object which contains security credentials such as a username and password. Runbooks may use cmdlets that accept a [PSCredential](http://aka.ms/runbookauthor/pscredential) object for authentication, or the runbook may extract the username and password of the [PSCredential](http://aka.ms/runbookauthor/pscredential) object to provide to some application or service requiring authentication. The properties for a credential are stored securely in Azure Automation and can be accessed in the runbook with the [Get-AutomationPSCredential](http://aka.ms/runbookauthor/pscredential) activity.

>[AZURE.NOTE] Secure assets in Azure Automation include credentials, certificates, connections, and encrypted variables. These assets are encrypted and stored in the Azure Automation using a unique key that is generated for each automation account. This key is encrypted by a master certificate and stored in Azure Automation. Before storing a secure asset, the key for the automation account is decrypted using the master certificate and then used to encrypt the asset.

## Windows PowerShell Cmdlets

The cmdlets in the following table are used to create and manage automation credential assets with Windows PowerShell.  They ship as part of the [Azure PowerShell module](http://aka.ms/runbookauthor/azurepowershell) which is available for use in Automation runbooks.

|Cmdlets|Description|
|:---|:---|
|[Get-AzureAutomationCredential](http://aka.ms/runbookauthor/cmdlet/getazurecredential)|Retrieves information about a credential asset. You can only retrieve the credential itself from **Get-AutomationCredential** activity.|
|[New-AzureAutomationCredential](http://aka.ms/runbookauthor/cmdlet/newazurecredential)|Creates a new Automation credential.|
|[Remove- AzureAutomationCredential](http://aka.ms/runbookauthor/cmdlet/removeazurecredential)|Removes an Automation credential.|
|[Set- AzureAutomationCredential](http://aka.ms/runbookauthor/cmdlet/setazurecredential)|Sets the properties for an existing Automation credential.|

## Runbook Activities

The activities in the following table are used to access credentials in a runbook.

|Activities|Description|
|:---|:---|
|Get-AutomationPSCredential|Gets a credential to use in a runbook. Returns a [System.Management.Automation.PSCredential](http://aka.ms/runbookauthor/pscredential) object.|

You should avoid using variables in the –Name parameter of Get-AutomationPSCredential since this can complicate discovering dependencies between runbooks and credential assets at design time.

## Creating a new credential

### To create a new credential with the Management Portal

To create a new credential in the management portal, see [To create a new asset with the Azure Management Portal](../automation-assets#CreateAsset).  Select **PowerShell Credential** for the **Credential Type**.


### To create a new PowerShell credential with Windows PowerShell

The following sample commands show how to create a new automation credential. A PSCredential object is first created with the name and password and then used to create the credential asset. Alternatively, you could use the **Get-Credential** cmdlet to be prompted to type in a name and password.

	$user = "MyDomain\MyUser"
	$pw = ConvertTo-SecureString "PassWord!" -AsPlainText -Force
	$cred = New-Object –TypeName System.Management.Automation.PSCredential –ArgumentList $user, $pw
	New-AzureAutomationCredential -AutomationAccountName "MyAutomationAccount" -Name "MyCredential" -Value $cred

## Using a PowerShell Credential in a Runbook

You retrieve a credential asset in a runbook with the **Get-AutomationPSCredential** activity. This returns a [PSCredential object](http://aka.ms/runbookauthor/pscredential) that you can use with an activity or cmdlet that requires a PSCredential parameter. You can also retrieve the properties of the credential object to use individually. The object has a property for the username and the secure password, or you can use the **GetNetworkCredential** method to return a [NetworkCredential](http://aka.ms/runbookauthor/networkcredential) object that will provide an unsecured version of the password.

The following sample commands show how to use a PowerShell credential in a runbook. In this example, the credential is retrieved and its username and password assigned to variables.

	$myCredential = Get-AutomationPSCredential -Name 'MyCredential'
	$userName = $myCredential.UserName
	$securePassword = $myCredential.Password
	$password = $myCredential.GetNetworkCredential().Password


## See Also

[Automation Assets](../automation-assets)
