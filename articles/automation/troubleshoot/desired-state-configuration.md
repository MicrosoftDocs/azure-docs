---
title: Troubleshoot Azure Automation State Configuration issues
description: This article tells how to troubleshoot and resolve Azure Automation State Configuration issues.
services: automation
ms.service: automation
ms.subservice:
author: mgoedtel
ms.author: magoedte
ms.date: 04/16/2019
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot Azure Automation State Configuration issues

This article provides information on troubleshooting and resolving issues that arise while you compile or deploy configurations in Azure Automation State Configuration. For general information about the State Configuration feature, see [Azure Automation State Configuration overview](../automation-dsc-overview.md).

## Diagnose an issue

When you receive a compilation or deployment error for configuration, here are a few steps to help you diagnose the issue.

### 1. Ensure that your configuration compiles successfully on the local machine

Azure Automation State Configuration is built on PowerShell Desired State Configuration (DSC). You can find the documentation for the DSC language and syntax in the [PowerShell DSC Docs](https://docs.microsoft.com/powershell/scripting/overview).

By compiling a DSC configuration on your local machine, you can discover and resolve common errors, such as:

   - Missing modules.
   - Syntax errors.
   - Logic errors.

### 2. View DSC logs on your node

If your configuration compiles successfully, but fails when applied to a node, you can find detailed information in the DSC logs. For information about where to find these logs, see [Where are the DSC Event Logs](/powershell/scripting/dsc/troubleshooting/troubleshooting#where-are-dsc-event-logs).

The [xDscDiagnostics](https://github.com/PowerShell/xDscDiagnostics) module can assist you in parsing detailed information from the DSC logs. If you contact support, they require these logs to diagnose your issue.

You can install the `xDscDiagnostics` module on your local machine by following the instructions in [Install the stable version module](https://github.com/PowerShell/xDscDiagnostics#install-the-stable-version-module).

To install the `xDscDiagnostics` module on your Azure machine, use [Invoke-AzVMRunCommand](https://docs.microsoft.com/powershell/module/az.compute/invoke-azvmruncommand?view=azps-3.7.0). You can also use the **Run command** option in the Azure portal by following the steps in [Run PowerShell scripts in your Windows VM with Run Command](../../virtual-machines/windows/run-command.md).

For information on using **xDscDiagnostics**, see [Using xDscDiagnostics to analyze DSC logs](/powershell/scripting/dsc/troubleshooting/troubleshooting#using-xdscdiagnostics-to-analyze-dsc-logs). See also [xDscDiagnostics Cmdlets](https://github.com/PowerShell/xDscDiagnostics#cmdlets).

### 3. Ensure that nodes and the Automation workspace have required modules

DSC depends on modules installed on the node. When you use Azure Automation State Configuration, import any required modules into your Automation account by following the steps in [Import Modules](../shared-resources/modules.md#import-modules). Configurations can also have a dependency on specific versions of modules. For more information, see [Troubleshoot modules](shared-resources.md#modules).

## <a name="unsupported-characters"></a>Scenario: A configuration with special characters can't be deleted from the portal

### Issue

When you attempt to delete a DSC configuration from the portal, you see the following error:

```error
An error occurred while deleting the DSC configuration '<name>'.  Error-details: The argument configurationName with the value <name> is not valid.  Valid configuration names can contain only letters,  numbers, and underscores.  The name must start with a letter.  The length of the name must be between 1 and 64 characters.
```

### Cause

This error is a temporary issue that's planned to be resolved.

### Resolution

Use the [Remove-AzAutomationDscConfiguration](https://docs.microsoft.com/powershell/module/Az.Automation/Remove-AzAutomationDscConfiguration?view=azps-3.7.0 cmdlet to delete the configuration.

## <a name="failed-to-register-agent"></a>Scenario: Failed to register the DSC Agent

### Issue

When [Set-DscLocalConfigurationManager](https://docs.microsoft.com/powershell/module/psdesiredstateconfiguration/set-dsclocalconfigurationmanager?view=powershell-5.1) or another DSC cmdlet, you receive the error:

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

### Cause

This error is normally caused by a firewall, the machine being behind a proxy server, or other network errors.

### Resolution

Verify that your machine has access to the proper endpoints for DSC and try again. For a list of ports and addresses needed, see [Network planning](../automation-dsc-overview.md#network-planning).

## <a name="unauthorized"><a/>Scenario: Status reports return the response code Unauthorized

### Issue

When you register a node with Azure Automation State Configuration, you receive one of the following error messages:

```error
The attempt to send status report to the server https://{your Automation account URL}/accounts/xxxxxxxxxxxxxxxxxxxxxx/Nodes(AgentId='xxxxxxxxxxxxxxxxxxxxxxxxx')/SendReport returned unexpected response code Unauthorized.
```

```error
VM has reported a failure when processing extension 'Microsoft.Powershell.DSC / Registration of the Dsc Agent with the server failed.
```

### Cause

This issue is caused by a bad or expired certificate. See [Re-register a node](../automation-dsc-onboarding.md#re-register-a-node).

This issue might also be caused by a proxy configuration not allowing access to ***.azure-automation.net**. For more information, see [Configuration of private networks](../automation-dsc-overview.md#network-planning). 

### Resolution

Use the following steps to reregister the failing DSC node.

#### Step 1: Unregister the node

1. In the Azure portal, go to **Home** > **Automation Accounts** > (your Automation account) > **State configuration (DSC)**.
1. Select **Nodes**, and select the node having trouble.
1. Select **Unregister** to unregister the node.

#### Step 2: Uninstall the DSC extension from the node

1. In the Azure portal, go to **Home** > **Virtual Machine** > (failing node) > **Extensions**.
1. Select **Microsoft.Powershell.DSC**, the PowerShell DSC extension.
1. Select **Uninstall** to uninstall the extension.

#### Step 3: Remove all bad or expired certificates from the node

On the failing node from an elevated PowerShell prompt, run these commands:

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

#### Step 4: Reregister the failing node

1. In the Azure portal, go to **Home** > **Automation Accounts** > (your Automation account) > **State configuration (DSC)**.
1. Select **Nodes**.
1. Select **Add**.
1. Select the failing node.
1. Select **Connect**, and select your desired options.

## <a name="failed-not-found"></a>Scenario: Node is in failed status with a "Not found" error

### Issue

The node has a report with Failed status and contains the error:

```error
The attempt to get the action from server https://<url>//accounts/<account-id>/Nodes(AgentId=<agent-id>)/GetDscAction failed because a valid configuration <guid> cannot be found.
```

### Cause

This error typically occurs when the node is assigned to a configuration name, for example, **ABC**, instead of a node configuration (MOF file) name, for example, **ABC.WebServer**.

### Resolution

* Make sure that you're assigning the node with the node configuration name and not the configuration name.
* You can assign a node configuration to a node by using the Azure portal or with a PowerShell cmdlet.

  * In the Azure portal, go to **Home** > **Automation Accounts** > (your Automation account) > **State configuration (DSC)**. Then select a node and select **Assign node configuration**.
  * Use the [Set-AzAutomationDscNode](https://docs.microsoft.com/powershell/module/Az.Automation/Set-AzAutomationDscNode?view=azps-3.7.0)
 cmdlet.

## <a name="no-mof-files"></a>Scenario: No node configurations (MOF files) were produced when a configuration was compiled

### Issue

Your DSC compilation job suspends with the error:

```error
Compilation completed successfully, but no node configuration **.mof** files were generated.
```

### Cause

When the expression following the `Node` keyword in the DSC configuration evaluates to `$null`, no node configurations are produced.

### Resolution

Use one of the following solutions to fix the problem:

* Make sure that the expression next to the `Node` keyword in the configuration definition isn't evaluating to Null.
* If you're passing [ConfigurationData](../automation-dsc-compile.md) when you compile the configuration, make sure that you're passing the values that the configuration expects from the configuration data.

## <a name="dsc-in-progress"></a>Scenario: The DSC node report becomes stuck in the In Progress state

### Issue

The DSC agent outputs:

```error
No instance found with given property values
```

### Cause

You've upgraded your Windows Management Framework (WMF) version and have corrupted Windows Management Instrumentation (WMI).

### Resolution

Follow the instructions in [DSC known issues and limitations](https://docs.microsoft.com/powershell/scripting/wmf/known-issues/known-issues-dsc).

## <a name="issue-using-credential"></a>Scenario: Unable to use a credential in a DSC configuration

### Issue

Your DSC compilation job suspended with the error:

```error
System.InvalidOperationException error processing property 'Credential' of type <some resource name>: Converting and storing an encrypted password as plaintext is allowed only if PSDscAllowPlainTextPassword is set to true.
```

### Cause

You've used a credential in a configuration but didn't provide proper `ConfigurationData` to set `PSDscAllowPlainTextPassword` to true for each node configuration.

### Resolution

Make sure to pass in the proper `ConfigurationData` to set `PSDscAllowPlainTextPassword` to true for each node configuration that's mentioned in the configuration. See [Compiling DSC configurations in Azure Automation State Configuration](../automation-dsc-compile.md).

## <a name="failure-processing-extension"></a>Scenario: "Failure processing extension" error when enabling a machine from a DSC extension

### Issue

When you enable a machine by using a DSC extension, a failure occurs that contains the error:

```error
VM has reported a failure when processing extension 'Microsoft.Powershell.DSC'. Error message: \"DSC COnfiguration 'RegistrationMetaConfigV2' completed with error(s). Following are the first few: Registration of the Dsc Agent with the server <url> failed. The underlying error is: The attempt to register Dsc Agent with Agent Id <ID> with the server <url> return unexpected response code BadRequest. .\".
```

### Cause

This error typically occurs when the node is assigned a node configuration name that doesn't exist in the service.

### Resolution

* Make sure that you're assigning the node with a name that exactly matches the name in the service.
* You can choose to not include the node configuration name, which results in enabling the node but not assigning a node configuration.

## <a name="cross-subscription"></a>Scenario: "One or more errors occurred" error when registering a node by using PowerShell

### Issue

When you register a node by using [Register-AzAutomationDSCNode](https://docs.microsoft.com/powershell/module/az.automation/register-azautomationdscnode?view=azps-3.7.0) or [Register-AzureRMAutomationDSCNode](https://docs.microsoft.com/powershell/module/azurerm.automation/register-azurermautomationdscnode?view=azurermps-6.13.0), you receive the following error:

```error
One or more errors occurred.
```

### Cause

This error occurs when you try to register a node in a separate subscription from that used by the Automation account.

### Resolution

Treat the cross-subscription node as though it's defined for a separate cloud, or on-premises. Register the node by using one of these options for enabling machines:

* Windows: [Physical/virtual Windows machines on-premises, or in a cloud other than Azure/AWS](../automation-dsc-onboarding.md#enable-physicalvirtual-windows-machines).
* Linux: [Physical/virtual Linux machines on-premises, or in a cloud other than Azure](../automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines).

## <a name="agent-has-a-problem"></a>Scenario: "Provisioning has failed" error message

### Issue

When you register a node, you see the error:

```error
Provisioning has failed
```

### Cause

This message occurs when there's an issue with connectivity between the node and Azure.

### Resolution

Determine if your node is in a virtual private network (VPN) or has other issues connecting to Azure. See [Troubleshoot feature deployment issues](onboarding.md).

## <a name="failure-linux-temp-noexec"></a>Scenario: Failure with a general error when applying a configuration in Linux

### Issue

When you apply a configuration in Linux, a failure occurs that contains the error:

```error
This event indicates that failure happens when LCM is processing the configuration. ErrorId is 1. ErrorDetail is The SendConfigurationApply function did not succeed.. ResourceId is [resource]name and SourceInfo is ::nnn::n::resource. ErrorMessage is A general error occurred, not covered by a more specific error code..
```

### Cause

If the **/tmp** location is set to `noexec`, the current version of DSC fails to apply configurations.

### Resolution

Remove the `noexec` option from the **/tmp** location.

## <a name="compilation-node-name-overlap"></a>Scenario: Node configuration names that overlap can result in a bad release

### Issue

When you use a single configuration script to generate multiple node configurations and some node configuration names are subsets of other names, the compilation service can end up assigning the wrong configuration. This issue only occurs when you use a single script to generate configurations with configuration data per node, and only when the name overlap occurs at the beginning of the string. An example is a single configuration script used to generate configurations based on node data passed as a hashtable using cmdlets, and the node data includes servers named **server** and **1server**.

### Cause

This is a known issue with the compilation service.

### Resolution

The best workaround is to compile locally or in a CI/CD pipeline and upload the node configuration MOF files directly to the service. If compilation in the service is a requirement, the next best workaround is to split the compilation jobs so that there's no overlap in names.

## <a name="gateway-timeout"></a>Scenario: Gateway timeout error on DSC configuration upload

#### Issue

You receive a `GatewayTimeout` error when you upload a DSC configuration. 

### Cause

DSC configurations that take a long time to compile can cause this error.

### Resolution

You can make your DSC configurations parse faster by explicitly including the `ModuleName` parameter for any [Import-DSCResource](https://docs.microsoft.com/powershell/scripting/dsc/configurations/import-dscresource?view=powershell-5.1) calls.

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
