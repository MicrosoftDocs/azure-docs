---
title: Run runbooks on Azure Automation Hybrid Runbook Worker
description: This article provides information about running runbooks on machines in your local datacenter or cloud provider with the Hybrid Runbook Worker role.
services: automation
ms.subservice: process-automation
ms.date: 01/29/2019
ms.topic: conceptual
---
# Running runbooks on a Hybrid Runbook Worker

Runbooks that target a Hybrid Runbook Worker typically manage resources on the local computer or against resources in the local environment where the worker is deployed. Runbooks in Azure Automation typically manage resources in the Azure cloud. Even though they are used differently, runbooks that run in Azure Automation and runbooks that run on a Hybrid Runbook Worker are identical in structure.

When you author a runbook to run on a Hybrid Runbook Worker, you should edit and test the runbook on the machine that hosts the worker. The host machine has all the PowerShell modules and network access required to manage and access the local resources. Once you test the runbook on the Hybrid Runbook Worker machine, you can then upload it to the Azure Automation environment, where it can be run on the worker. 

>[!NOTE]
>This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [Introducing the new Azure PowerShell Az module](https://docs.microsoft.com/powershell/azure/new-azureps-module-az?view=azps-3.5.0). For Az module installation instructions on your Hybrid Runbook Worker, see [Install the Azure PowerShell Module](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.5.0). For your Automation account, you can update your modules to the latest version using [How to update Azure PowerShell modules in Azure Automation](automation-update-azure-modules.md).

## Runbook permissions for a Hybrid Runbook Worker

As they are accessing non-Azure resources, runbooks running on a Hybrid Runbook Worker can't use the authentication mechanism typically used by runbooks authenticating to Azure resources. A runbook either provides its own authentication to local resources, or configures authentication using [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-arm.md#grant-your-vm-access-to-a-resource-group-in-resource-manager). You can also specify a Run As account to provide a user context for all runbooks.

### Runbook authentication

By default, runbooks run on the local computer. For Windows, they run in the context of the local System account. For Linux, they run in the context of the special user account **nxautomation**. In either scenario, the runbooks must provide their own authentication to resources that they access.

You can use [Credential](automation-credentials.md) and [Certificate](automation-certificates.md) assets in your runbook with cmdlets that allow you to specify credentials so that the runbook can authenticate to different resources. The following example shows a portion of a runbook that restarts a computer. It retrieves credentials from a credential asset and the name of the computer from a variable asset and then uses these values with the `Restart-Computer` cmdlet.

```powershell
$Cred = Get-AutomationPSCredential -Name "MyCredential"
$Computer = Get-AutomationVariable -Name "ComputerName"

Restart-Computer -ComputerName $Computer -Credential $Cred
```

You can also use an [InlineScript](automation-powershell-workflow.md#inlinescript) activity. `InlineScript` allows you to run blocks of code on another computer with credentials specified by the [PSCredential common parameter](/powershell/module/psworkflow/about/about_workflowcommonparameters).

### Run As account

Instead of having your runbook provide its own authentication to local resources, you can specify a Run As account for a Hybrid Runbook Worker group. To do this, you must define a [credential asset](automation-credentials.md) that has access to local resources. These resources include certificate stores and all runbooks run under these credentials on a Hybrid Runbook Worker in the group.

The user name for the credential must be in one of the following formats:

* domain\username
* username@domain
* username (for accounts local to the on-premises computer)

Use the following procedure to specify a Run As account for a Hybrid Runbook Worker group.

1. Create a [credential asset](automation-credentials.md) with access to local resources.
2. Open the Automation account in the Azure portal.
3. Select the **Hybrid Worker Groups** tile, and then select the group.
4. Select **All settings**, followed by **Hybrid worker group settings**.
5. Change the value of **Run As** from **Default** to **Custom**.
6. Select the credential and click **Save**.

### <a name="managed-identities-for-azure-resources"></a>Managed Identities for Azure Resources

Hybrid Runbook Workers on Azure virtual machines can use managed identities for Azure resources to authenticate to Azure resources. Using managed identities for Azure resources instead of Run As accounts provides benefits because you don't need to:

* Export the Run As certificate and then import it into the Hybrid Runbook Worker.
* Renew the certificate used by the Run As account.
* Handle the Run As connection object in your runbook code.

Follow the next steps to use a managed identity for Azure resources on a Hybrid Runbook Worker.

1. Create an Azure VM.
2. Configure managed identities for Azure resources on the VM. See [Configure managed identities for Azure resources on a VM using the Azure portal](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#enable-system-assigned-managed-identity-on-an-existing-vm).
3. Give the VM access to a resource group in Resource Manager. Refer to [Use a Windows VM system-assigned managed identity to access Resource Manager](../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-arm.md#grant-your-vm-access-to-a-resource-group-in-resource-manager).
4. Install the Hybrid Runbook worker on the VM. See [Deploy a Windows Hybrid Runbook Worker](automation-windows-hrw-install.md).
5. Update the runbook to use the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-3.5.0) cmdlet with the `Identity` parameter to authenticate to Azure resources. This configuration reduces the need to use a Run As account and perform the associated account management.

```powershell
    # Connect to Azure using the managed identities for Azure resources identity configured on the Azure VM that is hosting the hybrid runbook worker
    Connect-AzAccount -Identity

    # Get all VM names from the subscription
    Get-AzVM | Select Name
```

> [!NOTE]
> `Connect-AzAccount -Identity` works for a Hybrid Runbook Worker using a system-assigned identity and a single user-assigned identity. If you use multiple user-assigned identities on the Hybrid Runbook Worker, your runbook must specify the *AccountId* parameter for `Connect-AzAccount` to select a specific user-assigned identity.

### <a name="runas-script"></a>Automation Run As account

As part of your automated build process for deploying resources in Azure, you might require access to on-premises systems to support a task or set of steps in your deployment sequence. To provide authentication against Azure using the Run As account, you must install the Run As account certificate.

The following PowerShell runbook, called **Export-RunAsCertificateToHybridWorker**, exports the Run As certificate from your Azure Automation account. The runbook downloads and imports the certificate into the local machine certificate store on a Hybrid Runbook Worker that is connected to the same account. Once it completes that step, the runbook verifies that the worker can successfully authenticate to Azure using the Run As account.

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
This runbook exports the Run As certificate from an Azure Automation account to a hybrid worker in that account. Run this runbook on the hybrid worker where you want the certificate installed. This allows the use of the AzureRunAsConnection to authenticate to Azure and manage Azure resources from runbooks running on the hybrid worker.

.EXAMPLE
.\Export-RunAsCertificateToHybridWorker

.NOTES
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

# Test to see if authentication to Azure Resource Manager is working
$RunAsConnection = Get-AutomationConnection -Name "AzureRunAsConnection"

Connect-AzAccount `
    -ServicePrincipal `
    -Tenant $RunAsConnection.TenantId `
    -ApplicationId $RunAsConnection.ApplicationId `
    -CertificateThumbprint $RunAsConnection.CertificateThumbprint | Write-Verbose

Set-AzContext -Subscription $RunAsConnection.SubscriptionID | Write-Verbose

# List automation accounts to confirm that Azure Resource Manager calls are working
Get-AzAutomationAccount | Select-Object AutomationAccountName
```

>[!NOTE]
>For PowerShell runbooks, `Add-AzAccount` and `Add-AzureRMAccount` are aliases for `Connect-AzAccount`. When searching your library items, if you do not see `Connect-AzAccount`, you can use `Add-AzAccount`, or you can update your modules in your Automation account.

To finish preparing the Run As account:

1. Save the **Export-RunAsCertificateToHybridWorker** runbook to your computer with a **.ps1** extension.
2. Import it into your Automation account.
3. Edit the runbook, changing the value of the `Password` variable o your own password. 
4. Publish the runbook.
5. Run the runbook, targeting the Hybrid Runbook Worker group that runs and authenticates runbooks using the Run As account. 
6. Examine the job stream to see that it reports the attempt to import the certificate into the local machine store, and follows with multiple lines. This behavior depends on how many Automation accounts you define in your subscription and the degree of success of the authentication.

## Job behavior on Hybrid Runbook Workers

Azure Automation handles jobs on Hybrid Runbook Workers somewhat differently from jobs run in Azure sandboxes. One key difference is that there's no limit on job duration on the runbook workers. Runbooks run in Azure sandboxes are limited to three hours because of [fair share](automation-runbook-execution.md#fair-share).

For a long-running runbook, you want to make sure that it's resilient to possible restart, for example, if the machine that hosts the worker reboots. If the Hybrid Runbook Worker host machine reboots, any running runbook job restarts from the beginning, or from the last checkpoint for PowerShell Workflow runbooks. After a runbook job is restarted more than three times, it is suspended.

Remember that jobs for Hybrid Runbook Workers run under the local System account on Windows or the **nxautomation** account on Linux. For Linux, you must ensure that the **nxautomation** account has access to the location where the runbook modules are stored. When you use the [Install-Module](/powershell/module/powershellget/install-module) cmdlet, be sure to specify AllUsers for the `Scope` parameter to ensure that the **nxautomation** account has access. For more information on PowerShell on Linux, see [Known Issues for PowerShell on Non-Windows Platforms](https://docs.microsoft.com/powershell/scripting/whats-new/known-issues-ps6?view=powershell-6#known-issues-for-powershell-on-non-windows-platforms).

## Starting a runbook on a Hybrid Runbook Worker

[Starting a runbook in Azure Automation](automation-starting-a-runbook.md) describes different methods for starting a runbook. Startup for a runbook on a Hybrid Runbook Worker uses a **Run on** option that allows you to specify the name of a Hybrid Runbook Worker group. When a group is specified, one of the workers in that group retrieves and runs the runbook. If your runbook does not specify this option, Azure Automation runs the runbook as usual.

When you start a runbook in the Azure portal, you're presented with the **Run on** option for which you can select **Azure** or **Hybrid Worker**. If you select **Hybrid Worker**, you can choose the Hybrid Runbook Worker group from a dropdown.

Use the `RunOn` parameter with the `Start-AzureAutomationRunbook` cmdlet. The following example uses Windows PowerShell to start a runbook named **Test-Runbook** on a Hybrid Runbook Worker group named MyHybridGroup.

```azurepowershell-interactive
Start-AzureAutomationRunbook –AutomationAccountName "MyAutomationAccount" –Name "Test-Runbook" -RunOn "MyHybridGroup"
```

> [!NOTE]
> The `RunOn` parameter was added to `Start-AzureAutomationRunbook` in version 0.9.1 of Microsoft Azure PowerShell. You should [download the latest version](https://azure.microsoft.com/downloads/) if you have an earlier one installed. Only install this version on the workstation where you are starting the runbook from PowerShell. You do not need to install it on the Hybrid Runbook Worker computer unless you intend to start runbooks from this computer.

## Working with signed runbooks on a Windows Hybrid Runbook Worker

You can configure a Windows Hybrid Runbook Worker to run only signed runbooks.

> [!IMPORTANT]
> Once you have configured a Hybrid Runbook Worker to run only signed runbooks, runbooks that have not been signed will fail to execute on the worker.

### Create Signing Certificate

The following example creates a self-signed certificate that can be used for signing runbooks. This code creates the certificate and exports it so that the Hybrid Runbook Worker can import it later. The thumbprint is also returned for later use in referencing the certificate.

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

### Import certificate and configure workers for signature validation

Copy the certificate that you have created to each Hybrid Runbook Worker in a group. Run the following script to import the certificate and configure the workers to use signature validation on runbooks.

```powershell
# Install the certificate into a location that will be used for validation.
New-Item -Path Cert:\LocalMachine\AutomationHybridStore
Import-Certificate -FilePath .\hybridworkersigningcertificate.cer -CertStoreLocation Cert:\LocalMachine\AutomationHybridStore

# Import the certificate into the trusted root store so the certificate chain can be validated
Import-Certificate -FilePath .\hybridworkersigningcertificate.cer -CertStoreLocation Cert:\LocalMachine\Root

# Configure the hybrid worker to use signature validation on runbooks.
Set-HybridRunbookWorkerSignatureValidation -Enable $true -TrustedCertStoreLocation "Cert:\LocalMachine\AutomationHybridStore"
```

### Sign your runbooks using the certificate

With the Hybrid Runbook Workers configured to use only signed runbooks, you must sign runbooks that are to be used on the Hybrid Runbook Worker. Use the following sample PowerShell code to sign these runbooks.

```powershell
$SigningCert = ( Get-ChildItem -Path cert:\LocalMachine\My\<CertificateThumbprint>)
Set-AuthenticodeSignature .\TestRunbook.ps1 -Certificate $SigningCert
```

When a runbook has been signed, you must import it into your Automation account and publish it with the signature block. To learn how to import runbooks, see [Importing a runbook from a file into Azure Automation](manage-runbooks.md#importing-a-runbook).

## Working with signed runbooks on a Linux Hybrid Runbook Worker

To be able to work with signed runbooks, a Linux Hybrid Runbook Worker must have the [GPG](https://gnupg.org/index.html) executable on the local machine.

> [!IMPORTANT]
> Once you have configured a Hybrid Runbook Worker to run only signed runbooks, runbooks that have not been signed will fail to execute on the worker.

### Create a GPG keyring and keypair

To create the GPG keyring and keypair, use the Hybrid Runbook Worker **nxautomation** account.

1. Use the sudo application to sign in as the **nxautomation** account.

    ```bash
    sudo su – nxautomation
    ```

2. Once you are using **nxautomation**, generate the GPG keypair. GPG guides you through the steps. You must provide name, email address, expiration time, and passphrase. Then you wait until there is enough entropy on the machine for the key to be generated.

    ```bash
    sudo gpg --generate-key
    ```

3. Because the GPG directory was generated with sudo, you must change its owner to **nxautomation** using the following command.

    ```bash
    sudo chown -R nxautomation ~/.gnupg
    ```

### Make the keyring available to the Hybrid Runbook Worker

Once the keyring has been created, make it available to the Hybrid Runbook Worker. Modify the settings file **/var/opt/microsoft/omsagent/state/automationworker/diy/worker.conf** to include the following example code under the file section `[worker-optional]`.

```bash
gpg_public_keyring_path = /var/opt/microsoft/omsagent/run/.gnupg/pubring.kbx
```

### Verify that signature validation is on

If signature validation has been disabled on the machine, you must turn it on by running the following sudo command. Replace `<LogAnalyticsworkspaceId>` with your workspace ID.

```bash
sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/require_runbook_signature.py --true <LogAnalyticsworkspaceId>
```

### Sign a runbook

Once you have configured signature validation, use the following GPG command to sign a runbook.

```bash
gpg –-clear-sign <runbook name>
```

The signed runbook is called `<runbook name>.asc`.

You can now upload the signed runbook to Azure Automation and execute it like a regular runbook.

## Next steps

* To learn more about the methods for starting a runbook, see [Starting a Runbook in Azure Automation](automation-starting-a-runbook.md).
* To understand how to use the textual editor to work with PowerShell runbooks in Azure Automation, see [Editing a Runbook in Azure Automation](automation-edit-textual-runbook.md).
* If your runbooks aren't completing successfully, review the troubleshooting guide for [runbook execution failures](troubleshoot/hybrid-runbook-worker.md#runbook-execution-fails).
* For more information on PowerShell, including language reference and learning modules, refer to the [PowerShell Docs](https://docs.microsoft.com/powershell/scripting/overview).
