---
title: Troubleshoot Azure Automation Desired State Configuration (DSC)
description: This article provides information on troubleshooting Desired State Configuration (DSC)
services: automation
ms.service: automation
ms.subservice:
author: mgoedtel
ms.author: magoedte
ms.date: 04/16/2019
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot issues with Azure Automation Desired State Configuration (DSC)

This article provides information on troubleshooting issues with Desired State Configuration (DSC).

## Diagnosing an issue

When you have errors while compiling or deploying configurations in Azure State Configuration, here are a few steps to help you diagnose the issue.

### 1. Ensure that your configuration compiles successfully on the local machine

Azure State Configuration is built on PowerShell DSC. You can find the documentation for the DSC language and syntax in the [PowerShell DSC Docs](https://docs.microsoft.com/powershell/scripting/overview).

By compiling your DSC configuration on your local machine, you can discover and resolve common errors, such as:

   - Missing modules
   - Syntax errors
   - Logic errors

### 2. View DSC logs on your node

If your configuration compiles successfully, but fails when applied to a node, you can find detailed information in the DSC logs. For information about where to find these logs, see [Where are the DSC Event Logs](/powershell/scripting/dsc/troubleshooting/troubleshooting#where-are-dsc-event-logs).

The [xDscDiagnostics](https://github.com/PowerShell/xDscDiagnostics) module can assist you in parsing detailed information from the DSC logs. If you contact support, they require these logs to diagnose your issue.

You can install the xDscDiagnostics module on your local machine using the instructions found in [Install the stable version module](https://github.com/PowerShell/xDscDiagnostics#install-the-stable-version-module).

To install the xDscDiagnostics module on your Azure machine, use [Invoke-AzVMRunCommand](/powershell/module/azurerm.compute/invoke-azurermvmruncommand). You can also use the **Run command** option from the portal, by following the steps found in [Run PowerShell scripts in your Windows VM with Run Command](../../virtual-machines/windows/run-command.md).

For information on using xDscDiagnostics, see [Using xDscDiagnostics to analyze DSC logs](/powershell/scripting/dsc/troubleshooting/troubleshooting#using-xdscdiagnostics-to-analyze-dsc-logs). See also [xDscDiagnostics Cmdlets](https://github.com/PowerShell/xDscDiagnostics#cmdlets).

### 3. Ensure that nodes and the Automation workspace have required modules

DSC depends on modules installed on the node. When using Azure Automation State Configuration, import any required modules into your Automation account using the steps listed in [Import Modules](../shared-resources/modules.md#importing-modules). Configurations can also have a dependency on specific versions of modules. For more information, see [Troubleshoot Modules](shared-resources.md#modules).

## Common errors when working with DSC

### <a name="unsupported-characters"></a>Scenario: A configuration with special characters cannot be deleted from the portal

#### Issue

When attempting to delete a DSC configuration from the portal, you see the following error:

```error
An error occurred while deleting the DSC configuration '<name>'.  Error-details: The argument configurationName with the value <name> is not valid.  Valid configuration names can contain only letters,  numbers, and underscores.  The name must start with a letter.  The length of the name must be between 1 and 64 characters.
```

#### Cause

This error is a temporary issue that is planned to be resolved.

#### Resolution

* Use the Az Cmdlet "Remove-AzAutomationDscConfiguration" to delete the configuration.
* The documentation for this cmdlet hasn't been updated yet.  Until then, refer to the documentation for the AzureRM module.
  * [Remove-AzureRmAutomationDSCConfiguration](/powershell/module/azurerm.automation/Remove-AzureRmAutomationDscConfiguration)

### <a name="failed-to-register-agent"></a>Scenario: Failed to register Dsc Agent

#### Issue

When attempting to run `Set-DscLocalConfigurationManager` or another DSC cmdlet you receive the error:

```error
Registration of the Dsc Agent with the server
https://<location>-agentservice-prod-1.azure-automation.net/accounts/00000000-0000-0000-0000-000000000000 failed. The
underlying error is: Failed to register Dsc Agent with AgentId 00000000-0000-0000-0000-000000000000 with the server htt
ps://<location>-agentservice-prod-1.azure-automation.net/accounts/00000000-0000-0000-0000-000000000000/Nodes(AgentId='00000000-0000-0000-0000-000000000000'). .
    + CategoryInfo          : InvalidResult: (root/Microsoft/...gurationManager:String) [], CimException
    + FullyQualifiedErrorId : RegisterDscAgentCommandFailed,Microsoft.PowerShell.DesiredStateConfiguration.Commands.Re
   gisterDscAgentCommand
    + PSComputerName        : <computerName>
```

#### Cause

This error is normally caused by a firewall, the machine being behind a proxy server, or other network errors.

#### Resolution

Verify your machine has access to the proper endpoints for Azure Automation DSC and try again. For a list of ports and addresses needed, see [network planning](../automation-dsc-overview.md#network-planning)

### <a name="unauthorized"><a/>Scenario: Status reports return response code "Unauthorized"

#### Issue

When registering a Node with State Configuration (DSC) you receive one of the following error messages:

```error
The attempt to send status report to the server https://{your Automation account URL}/accounts/xxxxxxxxxxxxxxxxxxxxxx/Nodes(AgentId='xxxxxxxxxxxxxxxxxxxxxxxxx')/SendReport returned unexpected response code Unauthorized.
```

```error
VM has reported a failure when processing extension 'Microsoft.Powershell.DSC / Registration of the Dsc Agent with the server failed.
```

### Cause

This issue is caused by a bad or expired certificate.  For more information, see [Certificate expiration and reregistration](../automation-dsc-onboarding.md#re-register-a-node).

### Resolution

Follow the steps listed below to re-register the failing DSC node.

First, un-register the node using the following steps.

1. From the Azure portal, under **Home** -> **Automation Accounts**-> {Your Automation account} -> **State configuration (DSC)**
2. Click "Nodes", and click on the node having trouble.
3. Click "Unregister" to un-register the node.

Second, uninstall the DSC extension from the node.

1. From the Azure portal, under **Home** -> **Virtual Machine** -> {Failing node} -> **Extensions**
2. Click "Microsoft.Powershell.DSC".
3. Click "Uninstall", to uninstall the PowerShell DSC extension.

Third, remove all bad or expired certificates from the node.

On the failing node from an elevated Powershell Prompt, run the following:

```powershell
$certs = @()
$certs += dir cert:\localmachine\my | ?{$_.FriendlyName -like "DSC"}
$certs += dir cert:\localmachine\my | ?{$_.FriendlyName -like "DSC-OaaS Client Authentication"}
$certs += dir cert:\localmachine\CA | ?{$_.subject -like "CN=AzureDSCExtension*"}
"";"== DSC Certificates found: " + $certs.Count
$certs | FL ThumbPrint,FriendlyName,Subject
If (($certs.Count) -gt 0)
{ 
    ForEach ($Cert in $certs) 
    {
        RD -LiteralPath ($Cert.Pspath) 
    }
}
```

Finally, re-register the failing node using the following steps.

1. From the Azure portal, under **Home** -> **Automation Accounts** -> {Your Automation account} -> **State configuration (DSC)**
2. Click "Nodes".
3. Click the "Add" button.
4. Select the failing node.
5. Click "Connect", and select your desired options.

### <a name="failed-not-found"></a>Scenario: Node is in failed status with a "Not found" error

#### Issue

The node has a report with **Failed** status and containing the error:

```error
The attempt to get the action from server https://<url>//accounts/<account-id>/Nodes(AgentId=<agent-id>)/GetDscAction failed because a valid configuration <guid> cannot be found.
```

#### Cause

This error typically occurs when the node is assigned to a configuration name (for example, ABC) instead of a node configuration name (for example, ABC.WebServer).

#### Resolution

* Make sure that you're assigning the node with "node configuration name" and not the "configuration name".
* You can assign a node configuration to a node using Azure portal or with a PowerShell cmdlet.

  * To assign a node configuration to a node using Azure portal, open the **DSC Nodes** page, then select a node and click on **Assign node configuration** button.
  * To assign a node configuration to a node using PowerShell cmdlet, use **Set-AzureRmAutomationDscNode** cmdlet

### <a name="no-mof-files"></a>Scenario: No node configurations (MOF files) were produced when a configuration is compiled

#### Issue

Your DSC compilation job suspends with the error:

```error
Compilation completed successfully, but no node configuration.mofs were generated.
```

#### Cause

When the expression following the **Node** keyword in the DSC configuration evaluates to `$null`, then no node configurations are produced.

#### Resolution

Any of the following solutions fix the problem:

* Make sure that the expression next to the **Node** keyword in the configuration definition isn't evaluating to $null.
* If you are passing ConfigurationData when compiling the configuration, make sure that you are passing the expected values that the configuration requires from [ConfigurationData](../automation-dsc-compile.md).

### <a name="dsc-in-progress"></a>Scenario: The DSC node report becomes stuck "in progress" state

#### Issue

The DSC agent outputs:

```error
No instance found with given property values
```

#### Cause

You have upgraded your WMF version and have corrupted WMI.

#### Resolution

To fix the issue, follow the instructions in the [DSC known issues and limitations](https://docs.microsoft.com/powershell/scripting/wmf/known-issues/known-issues-dsc) article.

### <a name="issue-using-credential"></a>Scenario: Unable to use a credential in a DSC configuration

#### Issue

Your DSC compilation job was suspended with the error:

```error
System.InvalidOperationException error processing property 'Credential' of type <some resource name>: Converting and storing an encrypted password as plaintext is allowed only if PSDscAllowPlainTextPassword is set to true.
```

#### Cause

You've used a credential in a configuration but didn't provide proper **ConfigurationData** to set **PSDscAllowPlainTextPassword** to true for each node configuration.

#### Resolution

* Make sure to pass in the proper **ConfigurationData** to set **PSDscAllowPlainTextPassword** to true for each node configuration that is mentioned in the configuration. For more information, see [Compiling DSC configurations in Azure Automation State Configuration](../automation-dsc-compile.md).

### <a name="failure-processing-extension"></a>Scenario: Onboarding from dsc extension, "Failure processing extension" error

#### Issue

When onboarding using DSC extension, a failure occurs containing the error:

```error
VM has reported a failure when processing extension 'Microsoft.Powershell.DSC'. Error message: \"DSC COnfiguration 'RegistrationMetaConfigV2' completed with error(s). Following are the first few: Registration of the Dsc Agent with the server <url> failed. The underlying error is: The attempt to register Dsc Agent with Agent Id <ID> with the server <url> return unexpected response code BadRequest. .\".
```

#### Cause

This error typically occurs when the node is assigned a node configuration name that does not exist in the service.

#### Resolution

* Make sure that you're assigning the node with a node configuration name that exactly matches the name in the service.
* You can choose to not include the node configuration name, which will result in onboarding the node but not assigning a node configuration

### <a name="cross-subscription"></a>Scenario: Registering a node with PowerShell returns the error "One or more errors occurred"

#### Issue

When registering a node using `Register-AzAutomationDSCNode` or `Register-AzureRMAutomationDSCNode`, you receive the following error.

```error
One or more errors occurred.
```

#### Cause

This error occurs when you attempt to register a node that lives in a separate subscription than the Automation account.

#### Resolution

Treat the cross-subscription node as though it lives in a separate cloud, or on-premise.

Follow the steps below to register the node.

* Windows - [Physical/virtual Windows machines on-premises, or in a cloud other than Azure/AWS](../automation-dsc-onboarding.md#onboard-physicalvirtual-windows-machines-on-premises-or-in-a-cloud-other-than-azure).
* Linux - [Physical/virtual Linux machines on-premises, or in a cloud other than Azure](../automation-dsc-onboarding.md#onboard-physicalvirtual-linux-machines-on-premises-or-in-a-cloud-other-than-azure).

### <a name="agent-has-a-problem"></a>Scenario: Error message - "Provisioning Failed"

#### Issue

When registering a node, you see the error:

```error
Provisioning has failed
```

#### Cause

This message occurs when there is a connectivity issue between the node and Azure.

#### Resolution

Determine whether your node is in a private virtual network or has other issues connecting to Azure.

For more information, see [Troubleshoot errors when onboarding solutions](onboarding.md).

### <a name="failure-linux-temp-noexec"></a>Scenario: Applying a configuration in Linux, a failure occurs with a general error

#### Issue

When applying a configuration in Linux, a failure occurs containing the error:

```error
This event indicates that failure happens when LCM is processing the configuration. ErrorId is 1. ErrorDetail is The SendConfigurationApply function did not succeed.. ResourceId is [resource]name and SourceInfo is ::nnn::n::resource. ErrorMessage is A general error occurred, not covered by a more specific error code..
```

#### Cause

Customers have identified that if the `/tmp` location is set to `noexec`, the current version of DSC will fail to apply configurations.

#### Resolution

* Remove the `noexec` option from the `/tmp` location.

### <a name="compilation-node-name-overlap"></a>Scenario: Node configuration names that overlap could result in bad release

#### Issue

If a single configuration script is used to generate multiple node configurations, and some of the node configurations have a name that is a subset of others, an issue in the compilation service could result in assigning the wrong configuration.  This only occurs when using a single script to generate configurations with configuration data per node, and only when the name overlap occurs at the beginning of the string.

Example, if a single configuration script is used to generate configurations based on node data passed as a hashtable using cmdlets, and the node data includes a server named "server" and "1server".

#### Cause

Known issue with the compilation service.

#### Resolution

The best workaround would be to compile locally or in a CI/CD pipeline and upload the MOF files directly to the service.  If compilation in the service is a requirement, the next best workaround would be to split the compilation jobs so there is no overlap in names.

### <a name="gateway-timeout"></a>Scenario: Gateway timeout error on DSC configuration upload

#### Issue

You receive a `GatewayTimeout` error when uploading a DSC configuration. 

#### Cause

DSC configurations that take a long time to compile can cause this error.

#### Resolution

You can make your DSC configurations parse faster by explicitly including the `ModuleName` parameter for any `Import-DscResource` calls. For more information, see [Using Import-DSCResource](https://docs.microsoft.com/powershell/scripting/dsc/configurations/import-dscresource?view=powershell-5.1).

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
