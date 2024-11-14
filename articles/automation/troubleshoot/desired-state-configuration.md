---
title: Troubleshoot Azure Automation State Configuration issues
description: This article tells how to troubleshoot and resolve Azure Automation State Configuration issues.
services: automation
ms.subservice:
ms.date: 10/22/2024
ms.topic: troubleshooting
ms.custom: linux-related-content
---

# Troubleshoot Azure Automation State Configuration issues

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

[!INCLUDE [automation-dsc-linux-retirement-announcement](../includes/automation-dsc-linux-retirement-announcement.md)]

This article provides information on troubleshooting and resolving issues that occur while you
compile or deploy configurations in Azure Automation State Configuration. For general information
about the State Configuration feature, see [Azure Automation State Configuration overview][05].

## Diagnose an issue

When you receive a compilation or deployment error for configuration, here are a few steps to help
you diagnose the issue.

### 1. Ensure that your configuration compiles successfully on the local machine

Azure Automation State Configuration is built on PowerShell Desired State Configuration (DSC). You
can find the documentation for the DSC language and syntax in the [PowerShell DSC Docs][20].

By compiling a DSC configuration on your local machine, you can discover and resolve common errors,
such as:

- Missing modules.
- Syntax errors.
- Logic errors.

### 2. View DSC logs on your node

If your configuration compiles successfully, but fails when applied to a node, you can find detailed
information in the DSC logs. For information about where to find these logs, see
[Where are the DSC Event Logs][13].

The [xDscDiagnostics][24] module can assist you in parsing detailed information from the DSC logs.
If you contact support, they require these logs to diagnose your issue.

You can install the `xDscDiagnostics` module on your local machine by following the instructions in
[Install the stable version module][26].

To install the `xDscDiagnostics` module on your Azure machine, use [Invoke-AzVMRunCommand][17]. You
can also use the **Run command** option in the Azure portal by following the steps in
[Run PowerShell scripts in your Windows VM with Run Command][10].

For information on using **xDscDiagnostics**, see [Using xDscDiagnostics to analyze DSC logs][12].
See also [xDscDiagnostics Cmdlets][25].

### 3. Ensure that the nodes and the Automation workspace have required modules

DSC depends on modules installed on the node. When you use Azure Automation State Configuration,
import any required modules into your Automation account by following the steps in
[Import Modules][09]. Configurations can also have a dependency on specific versions of modules. For
more information, see [Troubleshoot modules][29].

## <a name="unsupported-characters"></a>Scenario: A configuration with special characters can't be deleted from the portal

### Issue

When you attempt to delete a DSC configuration from the portal, you see the following error:

```error
An error occurred while deleting the DSC configuration '<name>'. Error-details: The argument
configurationName with the value <name> is not valid. Valid configuration names can contain only
letters, numbers, and underscores. The name must start with a letter. The length of the name must be
between 1 and 64 characters.
```

### Cause

This error is a temporary issue. Try again later.

### Resolution

Use the [Remove-AzAutomationDscConfiguration][15] cmdlet to delete the configuration.

## <a name="failed-to-register-agent"></a>Scenario: Failed to register the DSC Agent

### Issue

You receive an error when you use [Set-DscLocalConfigurationManager][19] or another DSC cmdlet.

```error
Registration of the Dsc Agent with the server
https://<location>-agentservice-prod-1.azure-automation.net/accounts/00000000-0000-0000-0000-000000000000
failed. The underlying error is: Failed to register Dsc Agent with AgentId
00000000-0000-0000-0000-000000000000 with the server
https://<location>-agentservice-prod-1.azure-automation.net/accounts/00000000-0000-0000-0000-000000000000/Nodes(AgentId='00000000-0000-0000-0000-000000000000').
    + CategoryInfo          : InvalidResult: (root/Microsoft/...gurationManager:String) [], CimException
    + FullyQualifiedErrorId : RegisterDscAgentCommandFailed,Microsoft.PowerShell.DesiredStateConfiguration.Commands.RegisterDscAgentCommand
    + PSComputerName        : <computerName>
```

### Cause

Network problem can cause this error. Check your firewall settings or if the machine being behind a
proxy server.

### Resolution

Verify that your machine has access to the proper endpoints for DSC and try again. For a list of
ports and addresses needed, see [Network planning][06].

## <a name="unauthorized"></a>Scenario: Status reports return the response code Unauthorized

### Issue

When you register a node with Azure Automation State Configuration, you receive one of the following
error messages:

```error
The attempt to send status report to the server https://{your Automation account
URL}/accounts/xxxxxxxxxxxxxxxxxxxxxx/Nodes(AgentId='xxxxxxxxxxxxxxxxxxxxxxxxx')/SendReport returned
unexpected response code Unauthorized.
```

```error
VM has reported a failure when processing extension 'Microsoft.Powershell.DSC / Registration of the
Dsc Agent with the server failed.
```

### Cause

The following are the possible causes:

- A bad or expired certificate. See [Re-register a node][04].

- A proxy configuration that isn't allowing access to `*.azure-automation.net`. For more
  information, see [Configuration of private networks][06].

- When you disable local authentication in Azure Automation. See
  [Disable local authentication][07]. To fix it, see [Re-enable local authentication][08].

- Client computer time is many minutes inaccurate from actual time. Use the following command to
  check the time: `w32tm /stripchart /computer:time.windows.com /samples:6`.

### Resolution

Use the following steps to reregister the failing DSC node.

#### Step 1: Unregister the node

1. In the Azure portal, go to **Home** > **Automation Accounts** > (your Automation account) >
   **State configuration (DSC)**.
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

1. In the Azure portal, go to **Home** > **Automation Accounts** > (your Automation account) >
   **State configuration (DSC)**.
1. Select **Nodes**.
1. Select **Add**.
1. Select the failing node.
1. Select **Connect**, and select your desired options.

## <a name="failed-not-found"></a>Scenario: Node is in failed status with a "Not found" error

### Issue

The node has a report with Failed status and contains the error:

```error
The attempt to get the action from server
https://<url>//accounts/<account-id>/Nodes(AgentId=<agent-id>)/GetDscAction failed because a valid
configuration <guid> cannot be found.
```

### Cause

This error typically occurs when the node is assigned to a configuration name, for example, **ABC**,
instead of a node configuration (MOF file) name, for example, **ABC.WebServer**.

### Resolution

* Make sure that you're assigning the node with the node configuration name and not the
  configuration name.
* You can assign a node configuration to a node by using the Azure portal or with a PowerShell
  cmdlet.
  * In the Azure portal, go to **Home** > **Automation Accounts** > (your Automation account) >
    **State configuration (DSC)**. Then select a node and select **Assign node configuration**.
  * Use the [Set-AzAutomationDscNode][16] cmdlet.

## <a name="no-mof-files"></a>Scenario: No node configurations (MOF files) were produced when a configuration was compiled

### Issue

Your DSC compilation job suspends with the error:

```error
Compilation completed successfully, but no node configuration **.mof** files were generated.
```

### Cause

When the expression following the `Node` keyword in the DSC configuration evaluates to `$null`, no
node configurations are produced.

### Resolution

Use one of the following solutions to fix the problem:

* Make sure that the expression next to the `Node` keyword in the configuration definition isn't
  evaluating to Null.
* If you're passing [ConfigurationData][01] when you compile the configuration, make sure that
  you're passing the values that the configuration expects from the configuration data.

## <a name="dsc-in-progress"></a>Scenario: The DSC node report becomes stuck in the In Progress state

### Issue

The DSC agent outputs:

```error
No instance found with given property values
```

### Cause

This problem can occur if Windows Management Instrumentation (WMI) is corrupted on the node.

### Resolution

Follow the instructions in [DSC known issues and limitations][21].

## <a name="issue-using-credential"></a>Scenario: Unable to use a credential in a DSC configuration

### Issue

Your DSC compilation job suspended with the error:

```error
System.InvalidOperationException error processing property 'Credential' of type <some resource
name>: Converting and storing an encrypted password as plaintext is allowed only if
PSDscAllowPlainTextPassword is set to true.
```

### Cause

This problem can occur when you use a credential in a configuration but didn't provide proper
`ConfigurationData` to set `PSDscAllowPlainTextPassword` to true for each node configuration.

### Resolution

Make sure to pass in the proper `ConfigurationData`, setting `PSDscAllowPlainTextPassword` to true
for each node configuration. See
[Compiling DSC configurations in Azure Automation State Configuration][01].

## <a name="failure-processing-extension"></a>Scenario: "Failure processing extension" error when enabling a machine from a DSC extension

### Issue

When you enable a machine by using a DSC extension, a failure occurs that contains the error:

```error
VM has reported a failure when processing extension 'Microsoft.Powershell.DSC'. Error message: \"DSC
COnfiguration 'RegistrationMetaConfigV2' completed with error(s). Following are the first few:
Registration of the Dsc Agent with the server <url> failed. The underlying error is: The attempt to
register Dsc Agent with Agent Id <ID> with the server <url> return unexpected response code
BadRequest. .\".
```

### Cause

This error typically occurs when the node is assigned a node configuration name that doesn't exist
in the service.

### Resolution

Make sure that the node name that exactly matches the name in the service, or don't include the node
configuration name. This enables the node but doesn't assign a node configuration.

## <a name="cross-subscription"></a>Scenario: "One or more errors occurred" error when registering a node by using PowerShell

### Issue

When you register a node by using [Register-AzAutomationDSCNode][14] or
[Register-AzureRMAutomationDSCNode][18], you receive the following error:

```error
One or more errors occurred.
```

### Cause

This error occurs when you try to register a node in a subscription different from the one used by
the Automation account.

### Resolution

Treat the cross-subscription node as a node defined for a separate cloud or on-premises. Register
the node by using one of these options for enabling machines:

* Windows: [Physical/virtual Windows machines on-premises, or in a cloud other than Azure/AWS][03].
* Linux: [Physical/virtual Linux machines on-premises, or in a cloud other than Azure][02].

## <a name="agent-has-a-problem"></a>Scenario: "Provisioning has failed" error message

### Issue

When you register a node, you see the error:

```error
Provisioning has failed
```

### Cause

This message occurs when there's an issue with connectivity between the node and Azure.

### Resolution

Determine if your node is in a virtual private network (VPN) or has other issues connecting to
Azure. See [Troubleshoot feature deployment issues][28].

## <a name="failure-linux-temp-noexec"></a>Scenario: Failure with a general error when applying a configuration in Linux

### Issue

When you apply a configuration in Linux, a failure occurs that contains the error:

```error
This event indicates that failure happens when LCM is processing the configuration. ErrorId is 1.
ErrorDetail is The SendConfigurationApply function did not succeed.. ResourceId is [resource]name
and SourceInfo is ::nnn::n::resource. ErrorMessage is A general error occurred, not covered by a
more specific error code..
```

### Cause

If the **/tmp** location is set to `noexec`, the current version of DSC fails to apply
configurations.

### Resolution

Remove the `noexec` option from the **/tmp** location.

## <a name="compilation-node-name-overlap"></a>Scenario: Node configuration names that overlap can result in a bad release

### Issue

When you use a single configuration script to generate multiple node configurations and some node
configuration names are subsets of other names, the compilation service can end up assigning the
wrong configuration. This issue only occurs when you use a single script to generate configurations
with configuration data per node, and only when the name overlap occurs at the beginning of the
string. An example is a single configuration script used to generate configurations based on node
data passed as a hashtable using cmdlets, and the node data includes servers named **server** and
**1server**.

### Cause

This is a known issue with the compilation service.

### Resolution

The best workaround is to compile locally or in a CI/CD pipeline and upload the node configuration
MOF files directly to the service. If compilation in the service is a requirement, the next best
workaround is to split the compilation jobs so that there's no overlap in names.

## <a name="gateway-timeout"></a>Scenario: Gateway timeout error on DSC configuration upload

#### Issue

You receive a `GatewayTimeout` error when you upload a DSC configuration.

### Cause

DSC configurations that take a long time to compile can cause this error.

### Resolution

You can make your DSC configurations parse faster by explicitly including the `ModuleName` parameter
for any [Import-DSCResource][11] calls.

## Scenario: Error while onboarding a machine

#### Issue

You receive a `agent has a problem` error when you onboard a machine.

### Cause

This is a known issue. You can't assign the same configuration again as the node remains in pending
state.

### Resolution

To work around the problem, apply a different test configuration and try the original configuration
again.

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following support
channels:

* Get answers from Azure experts through [Azure Forums][22].
* Connect with [@AzureSupport][27], the official Microsoft Azure account for improving customer
  experience. Azure Support connects the Azure community to answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site][23], and select **Get Support**.

<!-- link references -->
[01]: ../automation-dsc-compile.md
[02]: ../automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines
[03]: ../automation-dsc-onboarding.md#enable-physicalvirtual-windows-machines
[04]: ../automation-dsc-onboarding.md#re-register-a-node
[05]: ../automation-dsc-overview.md
[06]: ../automation-dsc-overview.md#network-planning
[07]: ../disable-local-authentication.md
[08]: ../disable-local-authentication.md#re-enable-local-authentication
[09]: ../shared-resources/modules.md#import-modules
[10]: /azure/virtual-machines/windows/run-command
[11]: /powershell/dsc/configurations/import-dscresource
[12]: /powershell/dsc/troubleshooting/troubleshooting#using-xdscdiagnostics-to-analyze-dsc-logs
[13]: /powershell/dsc/troubleshooting/troubleshooting#where-are-dsc-event-logs
[14]: /powershell/module/az.automation/register-azautomationdscnode
[15]: /powershell/module/Az.Automation/Remove-AzAutomationDscConfiguration
[16]: /powershell/module/Az.Automation/Set-AzAutomationDscNode
[17]: /powershell/module/az.compute/invoke-azvmruncommand
[18]: /powershell/module/azurerm.automation/register-azurermautomationdscnode
[19]: /powershell/module/psdesiredstateconfiguration/set-dsclocalconfigurationmanager
[20]: /powershell/scripting/overview
[21]: /powershell/scripting/wmf/known-issues/known-issues-dsc
[22]: https://azure.microsoft.com/support/forums/
[23]: https://azure.microsoft.com/support/options/
[24]: https://github.com/PowerShell/xDscDiagnostics
[25]: https://github.com/PowerShell/xDscDiagnostics#cmdlets
[26]: https://github.com/PowerShell/xDscDiagnostics#install-the-stable-version-module
[27]: https://x.com/azuresupport
[28]: onboarding.md
[29]: shared-resources.md#modules
