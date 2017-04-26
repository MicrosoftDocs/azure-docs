---
title: Certificate assets in Azure Automation | Microsoft Docs
description: Certificates can be stored securely in Azure Automation so they can be accessed by runbooks or DSC configurations to authenticate against Azure and third party resources.  This article explains the details of certificates and how to work with them in both textual and graphical authoring.
services: automation
documentationcenter: ''
author: mgoedtel
manager: stevenka
editor: tysonn

ms.assetid: ac9c22ae-501f-42b9-9543-ac841cf2cc36
ms.service: automation
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/19/2016
ms.author: magoedte;bwren
---

# Certificate assets in Azure Automation

Certificates can be stored securely in Azure Automation so they can be accessed by runbooks or DSC configurations using the **Get-AzureRmAutomationRmCertificate** activity for Azure Resource Manager resources. This allows you to create runbooks and DSC configurations that use certificates for authentication or adds them to Azure or third party resources.

> [!NOTE] 
> Secure assets in Azure Automation include credentials, certificates, connections, and encrypted variables. These assets are encrypted and stored in the Azure Automation using a unique key that is generated for each automation account. This key is encrypted by a master certificate and stored in Azure Automation. Before storing a secure asset, the key for the automation account is decrypted using the master certificate and then used to encrypt the asset.
> 

## Windows PowerShell Cmdlets

The cmdlets in the following table are used to create and manage automation certificate assets with Windows PowerShell. They ship as part of the [Azure PowerShell module](../powershell-install-configure.md) which is available for use in Automation runbooks and DSC configurations.

|Cmdlets|Description|
|:---|:---|
|[Get-AzureRmAutomationCertificate](https://msdn.microsoft.com/library/mt603765.aspx)|Retrieves information about a certificate to use in a runbook or DSC configuration. You can only retrieve the certificate itself from Get-AutomationCertificate activity.|
|[New-AzureRmAutomationCertificate](https://msdn.microsoft.com/library/mt603604.aspx)|Creates a new certificate into Azure Automation.|
[Remove-AzureRmAutomationCertificate](https://msdn.microsoft.com/library/mt603529.aspx)|Removes a certificate from Azure Automation.|Creates a new certificate into Azure Automation.
|[Set-AzureRmAutomationCertificate](https://msdn.microsoft.com/library/mt603760.aspx)|Sets the properties for an existing certificate including uploading the certificate file and setting the password for a .pfx.|
|[Add-AzureCertificate](https://msdn.microsoft.com/library/azure/dn495214.aspx)|Uploads a service certificate for the specified cloud service.|


## Creating a new certificate

When you create a new certificate, you upload a .cer or .pfx file to Azure Automation. If you mark the certificate as exportable, then you can transfer it out of the Azure Automation certificate store. If it is not exportable, then it can only be used for signing within the runbook or DSC configuration.


### To create a new certificate with the Azure portal

1. From your Automation account, click the **Assets** tile to open the **Assets** blade.
1. Click the **Certificates** tile to open the **Certificates** blade.
1. Click **Add a certificate** at the top of the blade.
2. Type a name for the certificate in the **Name** box.
2. Click **Select a file** under **Upload a certificate file** to browse for a .cer or .pfx file.  If you select a .pfx file, specify a password and whether it should be allowed to be exported.
1. Click **Create** to save the new certificate asset.


### To create a new certificate with Windows PowerShell

The following example demonstrates how to create a new Automation certificate and mark it exportable. This imports an existing .pfx file.

	$certName = 'MyCertificate'
	$certPath = '.\MyCert.pfx'
	$certPwd = ConvertTo-SecureString -String 'P@$$w0rd' -AsPlainText -Force
    $ResourceGroup = "ResourceGroup01"
	
	New-AzureRmAutomationCertificate -AutomationAccountName "MyAutomationAccount" -Name $certName -Path $certPath –Password $certPwd -Exportable -ResourceGroupName $ResourceGroup

## Using a certificate

You must use the **Get-AutomationCertificate** activity to use a certificate. You cannot use the [Get-AzureRmAutomationCertificate](https://msdn.microsoft.com/library/mt603765.aspx) cmdlet since it returns information about the certificate asset but not the certificate itself.

### Textual runbook sample

The following sample code shows how to add a certificate to a cloud service in a runbook. In this sample, the password is retrieved from an encrypted automation variable.

	$serviceName = 'MyCloudService'
	$cert = Get-AutomationCertificate -Name 'MyCertificate'
	$certPwd = Get-AzureRmAutomationVariable -ResourceGroupName "ResouceGroup01" `
    –AutomationAccountName "MyAutomationAccount" –Name 'MyCertPassword'
	Add-AzureCertificate -ServiceName $serviceName -CertToDeploy $cert

### Graphical runbook sample

You add a **Get-AutomationCertificate** to a graphical runbook by right-clicking on the certificate in the Library pane of the graphical editor and selecting **Add to canvas**.

![Add certificate to the canvas](media/automation-certificates/automation-certificate-add-to-canvas.png)

The following image shows an example of using a certificate in a graphical runbook.  This is the same example shown above for adding a certificate to a cloud service from a textual runbook.

![Example Graphical Authoring ](media/automation-certificates/graphical-runbook-add-certificate.png)


## Next steps

- To learn more about working with links to control the logical flow of activities your runbook is designed to perform, see [Links in graphical authoring](automation-graphical-authoring-intro.md#links-and-workflow). 
