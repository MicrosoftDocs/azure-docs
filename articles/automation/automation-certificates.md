---
title: Certificate assets in Azure Automation
description: Certificates can be stored securely in Azure Automation so they can be accessed by runbooks or DSC configurations to authenticate against Azure and third-party resources.  This article explains the details of certificates and how to work with them in both textual and graphical authoring.
services: automation
ms.service: automation
ms.component: shared-capabilities
author: georgewallace
ms.author: gwallace
ms.date: 03/15/2018
ms.topic: conceptual
manager: carmonm
---

# Certificate assets in Azure Automation

Certificates can be stored securely in Azure Automation so they can be accessed by runbooks or DSC configurations using the **Get-AzureRmAutomationCertificate** activity for Azure Resource Manager resources. This capability allows you to create runbooks and DSC configurations that use certificates for authentication or adds them to Azure or third-party resources.

>[!NOTE]
>Secure assets in Azure Automation include credentials, certificates, connections, and encrypted variables. These assets are encrypted and stored in Azure Automation using a unique key that is generated for each automation account. This key is stored in Key Vault. Before storing a secure asset, the key is loaded from Key Vault and then used to encrypt the asset.

## AzureRM PowerShell cmdlets
For AzureRM, the cmdlets in the following table are used to create and manage automation credential assets with Windows PowerShell. They ship as part of the [AzureRM.Automation module](/powershell/azure/overview) which is available for use in Automation runbooks and DSC configurations.

|Cmdlets|Description|
|:---|:---|
|[Get-AzureRmAutomationCertificate](https://docs.microsoft.com/powershell/module/azurerm.automation/get-azurermautomationcertificate)|Retrieves information about a certificate to use in a runbook or DSC configuration. You can only retrieve the certificate itself from Get-AutomationCertificate activity.|
|[New-AzureRmAutomationCertificate](https://docs.microsoft.com/powershell/module/azurerm.automation/new-azurermautomationcertificate)|Creates a new certificate into Azure Automation.|
[Remove-AzureRmAutomationCertificate](https://docs.microsoft.com/powershell/module/azurerm.automation/remove-azurermautomationcertificate)|Removes a certificate from Azure Automation.|Creates a new certificate into Azure Automation.
|[Set-AzureRmAutomationCertificate](https://docs.microsoft.com/powershell/module/azurerm.automation/set-azurermautomationcertificate)|Sets the properties for an existing certificate including uploading the certificate file and setting the password for a .pfx.|
|[Add-AzureCertificate](https://msdn.microsoft.com/library/azure/dn495214.aspx)|Uploads a service certificate for the specified cloud service.|

## Activities
The activities in the following table are used to access certificates in a runbook and DSC configurations.

| Activities | Description |
|:---|:---|
|Get-AutomationCertificate|Gets a certificate to use in a runbook or DSC configuration. Returns a [System.Security.Cryptography.X509Certificates.X509Certificate2](https://msdn.microsoft.com/library/system.security.cryptography.x509certificates.x509certificate2.aspx) object.|

> [!NOTE] 
> You should avoid using variables in the –Name parameter of **Get-AutomationCertificate**  in a runbook or DSC configuration as it complicates discovering dependencies between runbooks or DSC configuration, and Automation variables at design time.

## Python2 functions

The function in the following table is used to access certificates in a Python2 runbook.

| Function | Description |
|:---|:---|
| automationassets.get_automation_certificate | Retrieves information about a certificate asset. |

> [!NOTE]
> You must import the **automationassets** module in the beginning of your Python runbook in order to access the asset functions.

## Creating a new certificate

When you create a new certificate, you upload a .cer or .pfx file to Azure Automation. If you mark the certificate as exportable, then you can transfer it out of the Azure Automation certificate store. If it is not exportable, then it can only be used for signing within the runbook or DSC configuration. Azure Automation requires the certificate to have the provider: **Microsoft Enhanced RSA and AES Cryptographic Provider**.

### To create a new certificate with the Azure portal

1. From your Automation account, click the **Assets** tile to open the **Assets** blade.
1. Click the **Certificates** tile to open the **Certificates** blade.
1. Click **Add a certificate** at the top of the blade.
1. Type a name for the certificate in the **Name** box.
1. To browse for a .cer or .pfx file, click **Select a file** under **Upload a certificate file**. If you select a .pfx file, specify a password and whether it is allowed to be exported.
1. Click **Create** to save the new certificate asset.

### To create a new certificate with Windows PowerShell

The following example demonstrates how to create a new Automation certificate and mark it exportable. This imports an existing .pfx file.

```powershell-interactive
$certName = 'MyCertificate'
$certPath = '.\MyCert.pfx'
$certPwd = ConvertTo-SecureString -String 'P@$$w0rd' -AsPlainText -Force
$ResourceGroup = "ResourceGroup01"

New-AzureRmAutomationCertificate -AutomationAccountName "MyAutomationAccount" -Name $certName -Path $certPath –Password $certPwd -Exportable -ResourceGroupName $ResourceGroup
```

## Using a certificate

To use a certificate, use the **Get-AutomationCertificate** activity. You cannot use the [Get-AzureRmAutomationCertificate](https://docs.microsoft.com/powershell/module/azurerm.automation/get-azurermautomationcertificate?view=azurermps-6.6.0) cmdlet since it returns information about the certificate asset but not the certificate itself.

### Textual runbook sample

The following sample code shows how to add a certificate to a cloud service in a runbook. In this sample, the password is retrieved from an encrypted automation variable.

```powershell-interactive
$serviceName = 'MyCloudService'
$cert = Get-AutomationCertificate -Name 'MyCertificate'
$certPwd = Get-AzureRmAutomationVariable -ResourceGroupName "ResouceGroup01" `
–AutomationAccountName "MyAutomationAccount" –Name 'MyCertPassword'
Add-AzureCertificate -ServiceName $serviceName -CertToDeploy $cert
```

### Graphical runbook sample

You add a **Get-AutomationCertificate** to a graphical runbook by right-clicking on the certificate in the Library pane of the graphical editor and selecting **Add to canvas**.

![Add certificate to the canvas](media/automation-certificates/automation-certificate-add-to-canvas.png)

The following image shows an example of using a certificate in a graphical runbook. This is the same as the preceding example for adding a certificate to a cloud service from a textual runbook.

![Example Graphical Authoring ](media/automation-certificates/graphical-runbook-add-certificate.png)

### Python2 sample
The following sample shows how to access certificates in Python2 runbooks.

```python
# get a reference to the Azure Automation certificate
cert = automationassets.get_automation_certificate("AzureRunAsCertificate")

# returns the binary cert content  
print cert 
```

## Next steps

- To learn more about working with links to control the logical flow of activities your runbook is designed to perform, see [Links in graphical authoring](automation-graphical-authoring-intro.md#links-and-workflow). 
