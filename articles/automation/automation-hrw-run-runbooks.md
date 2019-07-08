---
title: Run runbooks on Azure Automation Hybrid Runbook Worker
description: This article provides information about running runbooks on machines in your local datacenter or cloud provider with the Hybrid Runbook Worker role.
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 01/29/2019
ms.topic: conceptual
manager: carmonm
---
# Running runbooks on a Hybrid Runbook Worker

There's no difference in the structure of runbooks that run in Azure Automation and runbooks that run on a Hybrid Runbook Worker. Runbooks that you use with each most likely differ significantly. This difference is because runbooks that target a Hybrid Runbook Worker typically manage resources on the local computer itself or against resources in the local environment where it's deployed. Runbooks in Azure Automation typically manage resources in the Azure cloud.

When you author runbooks to run on a Hybrid Runbook Worker, you should edit and test the runbooks within the machine that hosts the Hybrid worker. The host machine has all of the PowerShell modules and network access you need to manage and access the local resources. Once a runbook is tested on the Hybrid worker machine, you can then upload it to the Azure Automation environment where it's available to run in the Hybrid worker. It's important to know that jobs that run under the Local System account for Windows or a special user account `nxautomation` on Linux. This behavior can introduce subtle differences when authoring runbooks for a Hybrid Runbook Worker. These changes should be reviewed when you're writing your runbooks.

## Starting a runbook on Hybrid Runbook Worker

[Starting a Runbook in Azure Automation](automation-starting-a-runbook.md) describes different methods for starting a runbook. Hybrid Runbook Worker adds a **RunOn** option where you can specify the name of a Hybrid Runbook Worker Group. When a group is specified, then the runbook is retrieved and run by one of the workers in that group. If this option isn't specified, then it's run in Azure Automation as normal.

When you start a runbook in the Azure portal, you're presented with a **Run on** option where you can select **Azure** or **Hybrid Worker**. If you select **Hybrid Worker**, then you can select the group from a dropdown.

Use the **RunOn** parameter. You can use the following command to start a runbook named Test-Runbook on a Hybrid Runbook Worker Group named MyHybridGroup using Windows PowerShell.

```azurepowershell-interactive
Start-AzureRmAutomationRunbook –AutomationAccountName "MyAutomationAccount" –Name "Test-Runbook" -RunOn "MyHybridGroup"
```

> [!NOTE]
> The **RunOn** parameter was added to the **Start-AzureAutomationRunbook** cmdlet in version 0.9.1 of Microsoft Azure PowerShell. You should [download the latest version](https://azure.microsoft.com/downloads/) if you have an earlier one installed. You only need to install this version on a workstation where you are starting the runbook from PowerShell. You do not need to install it on the worker computer unless you intend to start runbooks from that computer"

## Runbook permissions

Runbooks running on a Hybrid Runbook Worker can't use the same method that is typically used for runbooks authenticating to Azure resources, since they're accessing resources not in Azure. The runbook can either provide its own authentication to local resources, or can configure authentication using [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-arm.md#grant-your-vm-access-to-a-resource-group-in-resource-manager
). You can also specify a RunAs account to provide a user context for all runbooks.

### Runbook authentication

By default, runbooks run in the context of the Local System account for Windows and a special user account `nxautomation` for Linux on the on-premises computer, so they must provide their own authentication to resources that they access.

You can use [Credential](automation-credentials.md) and [Certificate](automation-certificates.md) assets in your runbook with cmdlets that allow you to specify credentials so you can authenticate to different resources. The following example shows a portion of a runbook that restarts a computer. It retrieves credentials from a credential asset and the name of the computer from a variable asset and then uses these values with the Restart-Computer cmdlet.

```powershell
$Cred = Get-AutomationPSCredential -Name "MyCredential"
$Computer = Get-AutomationVariable -Name "ComputerName"

Restart-Computer -ComputerName $Computer -Credential $Cred
```

You can also use [InlineScript](automation-powershell-workflow.md#inlinescript), which  allows you to run blocks of code on another computer with credentials, which are specified by the [PSCredential common parameter](/powershell/module/psworkflow/about/about_workflowcommonparameters).

### RunAs account

By default the Hybrid Runbook Worker uses Local System for Windows and a special user account `nxautomation` for Linux to execute runbooks. Instead of having runbooks provide their own authentication to local resources, you can specify a **RunAs** account for a Hybrid worker group. You specify a [credential asset](automation-credentials.md) that has access to local resources, and all runbooks run under these credentials when running on a Hybrid Runbook Worker in the group.

The user name for the credential must be in one of the following formats:

* domain\username
* username@domain
* username (for accounts local to the on-premises computer)

Use the following procedure to specify a RunAs account for a Hybrid worker group:

1. Create a [credential asset](automation-credentials.md) with access to local resources.
2. Open the Automation account in the Azure portal.
3. Select the **Hybrid Worker Groups** tile, and then select the group.
4. Select **All settings** and then **Hybrid worker group settings**.
5. Change **Run As** from **Default** to **Custom**.
6. Select the credential and click **Save**.

### <a name="managed-identities-for-azure-resources"></a>Managed Identities for Azure Resources

Hybrid Runbook Workers running on Azure virtual machines can use managed identities for Azure resources to authenticate to Azure resources. There are many benefits to using managed identities for Azure resources over Run As accounts.

* No need to export the Run As certificate and then import it to Hybrid Runbook Worker
* No need to renew the certificate used by the Run As account
* No need to handle the Run As connection object in your runbook code

To use a managed identity for Azure resources on a Hybrid Runbook worker, you need to complete the following steps:

1. Create an Azure VM
2. [Configure managed identities for Azure resources on your VM](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#enable-system-assigned-managed-identity-on-an-existing-vm)
3. [Grant your VM access to a resource group in Resource Manager](../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-arm.md#grant-your-vm-access-to-a-resource-group-in-resource-manager)
4. [Get an access token using the VM's system-assigned managed identity](../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-arm.md#get-an-access-token-using-the-vms-system-assigned-managed-identity-and-use-it-to-call-azure-resource-manager)
5. [Install the Windows Hybrid Runbook Worker](automation-windows-hrw-install.md#installing-the-windows-hybrid-runbook-worker) on the virtual machine.

Once the preceding steps are complete, you can use `Connect-AzureRmAccount -Identity` in the runbook to authenticate to Azure resources. This configuration reduces the need to use a Run As Account and manage the certificate for the Run As account.

```powershell
# Connect to Azure using the Managed identities for Azure resources identity configured on the Azure VM that is hosting the hybrid runbook worker
Connect-AzureRmAccount -Identity

# Get all VM names from the subscription
Get-AzureRmVm | Select Name
```

### <a name="runas-script"></a>Automation Run As account

As part of your automated build process for deploying resources in Azure, you may require access to on-premises systems to support a task or set of steps in your deployment sequence. To support authentication against Azure using the Run As account, you need to install the Run As account certificate.

The following PowerShell runbook, **Export-RunAsCertificateToHybridWorker**, exports the Run As certificate from your Azure Automation account and downloads and imports it into the local machine certificate store on a Hybrid worker, which is connected to the same account. Once that step is completed, it verifies the worker can successfully authenticate to Azure using the Run As account.

```azurepowershell-interactive
<#PSScriptInfo
.VERSION 1.0
.GUID 3a796b9a-623d-499d-86c8-c249f10a6986
.AUTHOR Azure Automation Team
.COMPANYNAME Microsoft
.COPYRIGHT
.TAGS Azure Automation
.LICENSEURI
.PROJECTURI
.ICONURI
.EXTERNALMODULEDEPENDENCIES
.REQUIREDSCRIPTS
.EXTERNALSCRIPTDEPENDENCIES
.RELEASENOTES
#>

<#
.SYNOPSIS
Exports the Run As certificate from an Azure Automation account to a hybrid worker in that account.

.DESCRIPTION
This runbook exports the Run As certificate from an Azure Automation account to a hybrid worker in that account.
Run this runbook in the hybrid worker where you want the certificate installed.
This allows the use of the AzureRunAsConnection to authenticate to Azure and manage Azure resources from runbooks running in the hybrid worker.

.EXAMPLE
.\Export-RunAsCertificateToHybridWorker

.NOTES
AUTHOR: Azure Automation Team
LASTEDIT: 2016.10.13
#>

# Generate the password used for this certificate
Add-Type -AssemblyName System.Web -ErrorAction SilentlyContinue | Out-Null
$Password = [System.Web.Security.Membership]::GeneratePassword(25, 10)

# Stop on errors
$ErrorActionPreference = 'stop'

# Get the management certificate that will be used to make calls into Azure Service Management resources
$RunAsCert = Get-AutomationCertificate -Name "AzureRunAsCertificate"

# location to store temporary certificate in the Automation service host
$CertPath = Join-Path $env:temp  "AzureRunAsCertificate.pfx"

# Save the certificate
$Cert = $RunAsCert.Export("pfx",$Password)
Set-Content -Value $Cert -Path $CertPath -Force -Encoding Byte | Write-Verbose

Write-Output ("Importing certificate into $env:computername local machine root store from " + $CertPath)
$SecurePassword = ConvertTo-SecureString $Password -AsPlainText -Force
Import-PfxCertificate -FilePath $CertPath -CertStoreLocation Cert:\LocalMachine\My -Password $SecurePassword -Exportable | Write-Verbose

# Test that authentication to Azure Resource Manager is working
$RunAsConnection = Get-AutomationConnection -Name "AzureRunAsConnection"

Connect-AzureRmAccount `
    -ServicePrincipal `
    -TenantId $RunAsConnection.TenantId `
    -ApplicationId $RunAsConnection.ApplicationId `
    -CertificateThumbprint $RunAsConnection.CertificateThumbprint | Write-Verbose

Set-AzureRmContext -SubscriptionId $RunAsConnection.SubscriptionID | Write-Verbose

# List automation accounts to confirm Azure Resource Manager calls are working
Get-AzureRmAutomationAccount | Select-Object AutomationAccountName
```

> [!IMPORTANT]
> **Add-AzureRmAccount** is now an alias for **Connect-AzureRMAccount**. When searching your library items, if you do not see **Connect-AzureRMAccount**, you can use **Add-AzureRmAccount**, or you can update your modules in your Automation Account.

Save the *Export-RunAsCertificateToHybridWorker* runbook to your computer with a `.ps1` extension. Import it into your Automation account and edit the runbook, changing the value of the variable `$Password` with your own password. Publish and then run the runbook. Target the Hybrid Worker group that will run and authenticate runbooks using the Run As account. The job stream reports the attempt to import the certificate into the local machine store, and follows with multiple lines. This behavior depends on how many Automation accounts you define in your subscription and if authentication is successful.

## Job behavior

Jobs are handled slightly different on Hybrid Runbook Workers than they're when they run on Azure sandboxes. One key difference is that there's no limit on job duration on Hybrid Runbook Workers. Runbooks ran in Azure sandboxes are limited to 3 hours because of [fair share](automation-runbook-execution.md#fair-share). For a long-running runbook, you want to make sure that it's resilient to possible restart. For example, if the machine that hosts the Hybrid worker reboots. If the Hybrid worker host machine reboots, then any running runbook job restarts from the beginning, or from the last checkpoint for PowerShell Workflow runbooks. After a runbook job is restarted more than 3 times, then it's suspended.

## Run only signed Runbooks

Hybrid Runbook Workers can be configured to run only signed runbooks with some configuration. The following section describes how to set up your Hybrid Runbook Workers to run signed [Windows Hybrid Runbook Worker](#windows-hybrid-runbook-worker) and [Linux Hybrid Runbook Worker](#linux-hybrid-runbook-worker)

> [!NOTE]
> Once you have configured a Hybrid Runbook Worker to run only signed runbooks, runbooks that have **not** been signed will fail to execute on the worker.

### Windows Hybrid Runbook Worker

#### Create Signing Certificate

The following example creates a self-signed certificate that can be used for signing runbooks. The sample creates the certificate and exports it. The certificate is imported into the Hybrid Runbook Workers later. The thumbprint is returned as well, this value is used later to reference the certificate.

```powershell
# Create a self-signed certificate that can be used for code signing
$SigningCert = New-SelfSignedCertificate -CertStoreLocation cert:\LocalMachine\my `
                                        -Subject "CN=contoso.com" `
                                        -KeyAlgorithm RSA `
                                        -KeyLength 2048 `
                                        -Provider "Microsoft Enhanced RSA and AES Cryptographic Provider" `
                                        -KeyExportPolicy Exportable `
                                        -KeyUsage DigitalSignature `
                                        -Type CodeSigningCert


# Export the certificate so that it can be imported to the hybrid workers
Export-Certificate -Cert $SigningCert -FilePath .\hybridworkersigningcertificate.cer

# Import the certificate into the trusted root store so the certificate chain can be validated
Import-Certificate -FilePath .\hybridworkersigningcertificate.cer -CertStoreLocation Cert:\LocalMachine\Root

# Retrieve the thumbprint for later use
$SigningCert.Thumbprint
```

#### Configure the Hybrid Runbook Workers

Copy the certificate created to each Hybrid Runbook Worker in a group. Run the following script to import the certificate and configure the Hybrid Worker to use signature validation on runbooks.

```powershell
# Install the certificate into a location that will be used for validation.
New-Item -Path Cert:\LocalMachine\AutomationHybridStore
Import-Certificate -FilePath .\hybridworkersigningcertificate.cer -CertStoreLocation Cert:\LocalMachine\AutomationHybridStore

# Import the certificate into the trusted root store so the certificate chain can be validated
Import-Certificate -FilePath .\hybridworkersigningcertificate.cer -CertStoreLocation Cert:\LocalMachine\Root

# Configure the hybrid worker to use signature validation on runbooks.
Set-HybridRunbookWorkerSignatureValidation -Enable $true -TrustedCertStoreLocation "Cert:\LocalMachine\AutomationHybridStore"
```

#### Sign your Runbooks using the certificate

With the Hybrid Runbook workers configured to use only signed runbooks, you must sign runbooks that are to be used on the Hybrid Runbook Worker. Use the following sample PowerShell to sign your runbooks.

```powershell
$SigningCert = ( Get-ChildItem -Path cert:\LocalMachine\My\<CertificateThumbprint>)
Set-AuthenticodeSignature .\TestRunbook.ps1 -Certificate $SigningCert
```

When the runbook has been signed, it must be imported into your Automation Account and published with the signature block. To learn how to import runbooks, see [Importing a runbook from a file into Azure Automation](manage-runbooks.md#import-a-runbook).

### Linux Hybrid Runbook Worker

To sign runbooks on a Linux Hybrid Runbook Worker, your Hybrid Runbook Worker needs to have the [GPG](https://gnupg.org/index.html) executable present on the machine.

#### Create a GPG keyring and keypair

To create the keyring and keypair you'll need to use the Hybrid Runbook Worker account `nxautomation`.

Use `sudo` to sign in as the `nxautomation` account.

```bash
sudo su – nxautomation
```

Once using the `nxautomation` account, generate the gpg keypair.

```bash
sudo gpg --generate-key
```

GPG will guide you through the steps to create the keypair. You'll need to provide a name, an email address, expiration time, passphrase, and wait for enough entropy on the machine for the key to be generated.

Because the GPG directory was generated with sudo, you need to change its owner to `nxautomation`. 

Run the following command to change the owner.

```bash
sudo chown -R nxautomation ~/.gnupg
```

#### Make the keyring available the Hybrid Runbook Worker

Once the keyring is created, you'll need to make it available to the Hybrid Runbook Worker. Modify the settings file `/var/opt/microsoft/omsagent/state/automationworker/diy/worker.conf` to include the following example under the section `[worker-optional]`

```bash
gpg_public_keyring_path = /var/opt/microsoft/omsagent/run/.gnupg/pubring.kbx
```

#### Verify signature validation is on

If signature validation has been disabled on the machine, you’ll need to turn it on. Run the following command to enable signature validation. Replacing `<LogAnalyticsworkspaceId>` with your workspace ID.

```bash
sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/require_runbook_signature.py --true <LogAnalyticsworkspaceId>
```

#### Sign a runbook

Once signature validation is configured, you can use the following command to sign a runbook:

```bash
gpg –-clear-sign <runbook name>
```

The signed runbook will have the name `<runbook name>.asc`.

The signed runbook can now be uploaded to Azure Automation, and can be executed like a regular runbook.

## Next steps

* To learn more about the different methods that can be used to start a runbook, see [Starting a Runbook in Azure Automation](automation-starting-a-runbook.md).
* To understand the different ways to work with PowerShell runbooks in Azure Automation using the textual editor, see [Editing a Runbook in Azure Automation](automation-edit-textual-runbook.md)
* If your runbooks aren't completing successfully, review the troubleshooting guide on [runbook execution failures](troubleshoot/hybrid-runbook-worker.md#runbook-execution-fails).