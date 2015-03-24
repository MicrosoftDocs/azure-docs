<properties 
   pageTitle="Connections"
   description="Connections"
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

# Connections

An Automation connection asset contains the information required to connect to an external service or application from a runbook.  This may include information required for authentication such as a username and password in addition to connection information such as a URL or a port. The value of a connection is keeping all of the properties for connecting to a particular application in one asset as opposed to creating multiple variables. The user can edit the values for a connection in one place, and you can pass the name of a connection to a runbook in a single parameter. The properties for a connection can be accessed in the runbook with the **Get-AutomationConnection** activity.

When you create a connection, you must specify a *connection type*. The connection type is a template that defines a set of properties. The connection defines values for each property defined in its connection type. Connection types are added to Azure Automation in automation modules. The only connection types that are available when you create a connection are those defined in automation modules installed in your automation account.

>[AZURE.NOTE] Secure assets in Azure Automation include credentials, certificates, connections, and encrypted variables. These assets are encrypted and stored in the Azure Automation using a unique key that is generated for each automation account. This key is encrypted by a master certificate and stored in Azure Automation. Before storing a secure asset, the key for the automation account is decrypted using the master certificate and then used to encrypt the asset.

## Windows PowerShell Cmdlets

The cmdlets in the following table are used to create and manage Automation connections with Windows PowerShell They ship as part of the [Azure PowerShell module](http://aka.ms/runbookauthor/azurepowershell) which is available for use in Automation runbooks..

|Cmdlet|Description|
|:---|:---|
|[Get-AzureAutomationConnection](http://aka.ms/runbookauthor/cmdlet/getazureconnection)|Retrieves a connection. Includes a hashtable with the values of the connection’s fields.|
|[New-AzureAutomationConnection](http://aka.ms/runbookauthor/cmdlet/newazureconnection)|Creates a new connection.|
|[Remove-AzureAutomationConnection](http://aka.ms/runbookauthor/cmdlet/removeazureconnection)|Remove an existing connection.|
|[Set-AzureAutomationConnectionFieldValue](http://aka.ms/runbookauthor/cmdlet/setazureconnection)|Sets the value of a particular field for an existing connection.|

## Runbook Activities

The activities in the following table are used to access connections in a runbook.

|Activities|Description|
|---|---|
|Get-AutomationConnection|Gets a connection to use in a runbook. Returns a hashtable with the properties of the connection.|

You should avoid using variables in the –Name parameter of **Get- AutomationConnection** since this can complicate discovering dependencies between runbooks and connection assets at design time.

## Creating a New Connection

### To create a new connection with the management portal

To create a new connection in the management portal, see [To create a new asset with the Azure Management Portal](../automation-assets#CreateAsset).

### To create a new connection with Windows PowerShell

Create a new connection with Windows PowerShell using the [New-AzureAutomationConnection](http://aka.ms/runbookauthor/cmdlet/newazureconnection) cmdlet. This cmdlet has a parameter named **ConnectionFieldValues** that expects a [hash table](http://go.microsoft.com/fwlink/?LinkID=324844) defining values for each of the properties defined by the connection type.

The following sample commands create a new connection with the name MyConnection.  It uses a connection type called MyConnectionType that has two properties named **UserName** and **Password**.

	$connectionName = "MyConnection"
	$connectionUserName = "MyUser"
	$connectionPassword = "P@ssw0rd"
	$url = "http://mysite.contoso.com"
	$fieldValues = @{"UserName"=$ connectionUserName;"Password"=$ connectionPassword;"Url"=$url} 
	
	New-AzureAutomationConnection –AutomationAccountName "MyAutomationAccount" –Name $connectionName –ConnectionTypeName "MyConnectionType" –ConnectionFieldValues $fieldValues

## Using a connection in a runbook

You retrieve a connection in a runbook with the **Get-AutomationConnection** cmdlet.  This activity retrieves the values of the different fields in the connection and returns them as a [hash table](http://go.microsoft.com/fwlink/?LinkID=324844) which can then be used with the appropriate commands in the runbook.

The following sample commands shows how to retrieve the properties of the connection in the previous example and assign to variables in a runbook.

	$con = Get-AutomationConnection -Name 'MyConnection'
	$userName = $con.UserName
	$password = $con.Password
	$url = $con.url

## See Also

[Automation Assets](../automation-assets)
