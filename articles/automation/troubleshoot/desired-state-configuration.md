---
title: Troubleshooting issues with Azure Automation Desired State Configuration (DSC)
description: This article provides information on troubleshooting Desired State Configuration (DSC)
services: automation
ms.service: automation
ms.subservice: 
author: bobbytreed
ms.author: robreed
ms.date: 04/16/2019
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot Desired State Configuration (DSC)

This article provides information on troubleshooting issues with Desired State Configuration (DSC).

## Common errors when working with Desired State Configuration (DSC)

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
* If you are passing ConfigurationData when compiling the configuration, make sure that you are passing the expected values that the configuration requires from [ConfigurationData](../automation-dsc-compile.md#configurationdata).

### <a name="dsc-in-progress"></a>Scenario: The DSC node report becomes stuck "in progress" state

#### Issue

The DSC agent outputs:

```error
No instance found with given property values
```

#### Cause

You have upgraded your WMF version and have corrupted WMI.

#### Resolution

To fix the issue, follow the instructions in the [DSC known issues and limitations](https://msdn.microsoft.com/powershell/wmf/5.0/limitation_dsc) article.

### <a name="issue-using-credential"></a>Scenario: Unable to use a credential in a DSC configuration

#### Issue

Your DSC compilation job was suspended with the error:

```error
System.InvalidOperationException error processing property 'Credential' of type <some resource name>: Converting and storing an encrypted password as plaintext is allowed only if PSDscAllowPlainTextPassword is set to true.
```

#### Cause

You've used a credential in a configuration but didn’t provide proper **ConfigurationData** to set **PSDscAllowPlainTextPassword** to true for each node configuration.

#### Resolution

* Make sure to pass in the proper **ConfigurationData** to set **PSDscAllowPlainTextPassword** to true for each node configuration that is mentioned in the configuration. For more information, see [assets in Azure Automation DSC](../automation-dsc-compile.md#assets).

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

### <a name="failure-linux-temp-noexec"></a>Scenario: Applying a configuration in Linux, a failure occurs with a general error

#### Issue

When applying a configuration in Linux, a failure occurs containing the error:

```error
This event indicates that failure happens when LCM is processing the configuration. ErrorId is 1. ErrorDetail is The SendConfigurationApply function did not succeed.. ResourceId is [resource]name and SourceInfo is ::nnn::n::resource. ErrorMessage is A general error occurred, not covered by a more specific error code..
```

#### Cause

Customers have identified that if the /tmp location is set to noexec, the current version of DSC will fail to apply configurations.

#### Resolution

* Remove the noexec option from the /tmp location.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
