---
title: Certificate assets in Azure Automation
description: Certificates are securely in Azure Automation so they can be accessed by runbooks or DSC configurations to authenticate against Azure and third-party resources.  This article explains the details of certificates and how to work with them in both textual and graphical authoring.
services: automation
ms.service: automation
ms.subservice: shared-capabilities
author: bobbytreed
ms.author: robreed
ms.date: 04/02/2019
ms.topic: conceptual
manager: carmonm
---

# Certificate assets in Azure Automation

Certificates are stored securely in Azure Automation so they can be accessed by runbooks or DSC configurations using the **Get-AzureRmAutomationCertificate** activity for Azure Resource Manager resources. This capability allows you to create runbooks and DSC configurations that use certificates for authentication or adds them to Azure or third-party resources.

>[!NOTE]
>Secure assets in Azure Automation include credentials, certificates, connections, and encrypted variables. These assets are encrypted and stored in Azure Automation using a unique key that is generated for each automation account. This key is stored in a system managed Key Vault. Before storing a secure asset, the key is loaded from Key Vault and then used to encrypt the asset. This process is managed by Azure Automation.

## AzureRM PowerShell cmdlets

For AzureRM, the cmdlets in the following table are used to create and manage automation credential assets with Windows PowerShell. They ship as part of the [AzureRM.Automation module](/powershell/azure/overview), which is available for use in Automation runbooks and DSC configurations.

|Cmdlets|Description|
|:---|:---|
|[Get-AzureRmAutomationCertificate](/powershell/module/azurerm.automation/get-azurermautomationcertificate)|Retrieves information about a certificate to use in a runbook or DSC configuration. You can only retrieve the certificate itself from Get-AutomationCertificate activity.|
|[New-AzureRmAutomationCertificate](/powershell/module/azurerm.automation/new-azurermautomationcertificate)|Creates a new certificate into Azure Automation.|
[Remove-AzureRmAutomationCertificate](/powershell/module/azurerm.automation/remove-azurermautomationcertificate)|Removes a certificate from Azure Automation.|
|[Set-AzureRmAutomationCertificate](/powershell/module/azurerm.automation/set-azurermautomationcertificate)|Sets the properties for an existing certificate including uploading the certificate file and setting the password for a .pfx.|
|[Add-AzureCertificate](/powershell/module/servicemanagement/azure/add-azurecertificate)|Uploads a service certificate for the specified cloud service.|

## Activities

The activities in the following table are used to access certificates in a runbook and DSC configurations.

| Activities | Description |
|:---|:---|
|Get-AutomationCertificate|Gets a certificate to use in a runbook or DSC configuration. Returns a [System.Security.Cryptography.X509Certificates.X509Certificate2](/dotnet/api/system.security.cryptography.x509certificates.x509certificate2) object.|

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

When you create a new certificate, you upload a .cer or .pfx file to Azure Automation. If you mark the certificate as exportable, then you can transfer it out of the Azure Automation certificate store. If it isn't exportable, then it can only be used for signing within the runbook or DSC configuration. Azure Automation requires the certificate to have the provider: **Microsoft Enhanced RSA and AES Cryptographic Provider**.

### To create a new certificate with the Azure portal

1. From your Automation account, click the **Assets** tile to open the **Assets** page.
2. Click the **Certificates** tile to open the **Certificates** page.
3. Click **Add a certificate** at the top of the page.
4. Type a name for the certificate in the **Name** box.
5. To browse for a .cer or .pfx file, click **Select a file** under **Upload a certificate file**. If you select a .pfx file, specify a password and whether it can be exported.
6. Click **Create** to save the new certificate asset.

### To create a new certificate with PowerShell

The following example demonstrates how to create a new Automation certificate and mark it exportable. This imports an existing .pfx file.

```powershell-interactive
$certificateName = 'MyCertificate'
$PfxCertPath = '.\MyCert.pfx'
$CertificatePassword = ConvertTo-SecureString -String 'P@$$w0rd' -AsPlainText -Force
$ResourceGroup = "ResourceGroup01"

New-AzureRmAutomationCertificate -AutomationAccountName "MyAutomationAccount" -Name $certificateName -Path $PfxCertPath –Password $CertificatePassword -Exportable -ResourceGroupName $ResourceGroup
```

### Create a new certificate with Resource Manager template

The following example demonstrates how to deploy a certificate to your Automation Account using a Resource Manager template through PowerShell:

```powershell-interactive
$AutomationAccountName = "<automation account name>"
$PfxCertPath = '<PFX cert path'
$CertificatePassword = '<password>'
$certificateName = '<certificate name>'
$AutomationAccountName = '<automation account name>'
$flags = [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable `
    -bor [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::PersistKeySet `
    -bor [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::MachineKeySet
# Load the certificate into memory
$PfxCert = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList @($PfxCertPath, $CertificatePassword, $flags)
# Export the certificate and convert into base 64 string
$Base64Value = [System.Convert]::ToBase64String($PfxCert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pkcs12))
$Thumbprint = $PfxCert.Thumbprint


$json = @"
{
    '`$schema': 'https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#',
    'contentVersion': '1.0.0.0',
    'resources': [
        {
            'name': '$AutomationAccountName/$certificateName',
            'type': 'Microsoft.Automation/automationAccounts/certificates',
            'apiVersion': '2015-10-31',
            'properties': {
                'base64Value': '$Base64Value',
                'thumbprint': '$Thumbprint',
                'isExportable': true
            }
        }
    ]
}
"@

$json | out-file .\template.json
New-AzureRmResourceGroupDeployment -Name NewCert -ResourceGroupName TestAzureAuto -TemplateFile .\template.json
```

## Using a certificate

To use a certificate, use the **Get-AutomationCertificate** activity. You can't use the [Get-AzureRmAutomationCertificate](/powershell/module/azurerm.automation/get-azurermautomationcertificate) cmdlet since it returns information about the certificate asset but not the certificate itself.

### Textual runbook sample

The following sample code shows how to add a certificate to a cloud service in a runbook. In this sample, the password is retrieved from an encrypted automation variable.

```powershell-interactive
$serviceName = 'MyCloudService'
$cert = Get-AutomationCertificate -Name 'MyCertificate'
$certPwd = Get-AzureRmAutomationVariable -ResourceGroupName "ResourceGroup01" `
–AutomationAccountName "MyAutomationAccount" –Name 'MyCertPassword'
Add-AzureCertificate -ServiceName $serviceName -CertToDeploy $cert
```

### Graphical runbook sample

You add a **Get-AutomationCertificate** to a graphical runbook by right-clicking on the certificate in the Library pane and selecting **Add to canvas**.

![Add certificate to the canvas](../media/certificates/automation-certificate-add-to-canvas.png)

The following image shows an example of using a certificate in a graphical runbook. This is the same as the preceding example that shows how to add a certificate to a cloud service from a textual runbook.

![Example Graphical Authoring](../media/certificates/graphical-runbook-add-certificate.png)

### Python2 sample

The following sample shows how to access certificates in Python2 runbooks.

```python
# get a reference to the Azure Automation certificate
cert = automationassets.get_automation_certificate("AzureRunAsCertificate")

# returns the binary cert content  
print cert
```

## Next steps

- To learn more about working with links to control the logical flow of activities your runbook is designed to perform, see [Links in graphical authoring](../automation-graphical-authoring-intro.md#links-and-workflow). 
