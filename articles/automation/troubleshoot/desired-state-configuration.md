---
title: Troubleshooting issues with Azure Automation Desired State Configuration (DSC)
description: This article provides information on troubleshooting Desired State Configuration (DSC)
services: automation
ms.service: automation
ms.component: 
author: georgewallace
ms.author: gwallace
ms.date: 06/19/2018
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot Desired State Configuration (DSC)

This article provides information on troubleshooting issues with Desired State Configuration (DSC).

## Common errors when working with Desired State Configuration (DSC)

### <a name="failed-not-found"></a>Scenario: Node is in failed status with a "Not found" error

#### Issue

The node has a report with **Failed** status and containing the error:

```
The attempt to get the action from server https://<url>//accounts/<account-id>/Nodes(AgentId=<agent-id>)/GetDscAction failed because a valid configuration <guid> cannot be found.
```

#### Cause

This error typically occurs when the node is assigned to a configuration name (for example, ABC) instead of a node configuration name (for example, ABC.WebServer).

#### Resolution

* Make sure that you are assigning the node with "node configuration name" and not the "configuration name".
* You can assign a node configuration to a node using Azure portal or with a PowerShell cmdlet.

  * In order to assign a node configuration to a node using Azure portal, open the **DSC Nodes** page, then select a node and click on **Assign node configuration** button.  
  * In order to assign a node configuration to a node using PowerShell cmdlet, use **Set-AzureRmAutomationDscNode** cmdlet

### <a name="no-mof-files"></a>Scenario: No node configurations (MOF files) were produced when a configuration is compiled

#### Issue

Your DSC compilation job suspends with the error:

```
Compilation completed successfully, but no node configuration.mofs were generated.
```

#### Cause

When the expression following the **Node** keyword in the DSC configuration evaluates to `$null`, then no node configurations are produced.

#### Resolution

Any of the following solutions fix the problem:

* Make sure that the expression next to the **Node** keyword in the configuration definition is not evaluating to $null.
* If you are passing ConfigurationData when compiling the configuration, make sure that you are passing the expected values that the configuration requires from [ConfigurationData](../automation-dsc-compile.md#configurationdata).

### <a name="dsc-in-progress"></a>Scenario: The DSC node report becomes stuck "in progress" state

#### Issue

The DSC agent outputs:

```
No instance found with given property values
```

#### Cause

You have upgraded your WMF version and have corrupted WMI.

#### Resolution

To fix the issue follow the instructions in the [DSC known issues and limitations](https://msdn.microsoft.com/powershell/wmf/5.0/limitation_dsc) article.

### <a name="issue-using-credential"></a>Scenario: Unable to use a credential in a DSC configuration

#### Issue

Your DSC compilation job was suspended with the error:

```
System.InvalidOperationException error processing property 'Credential' of type <some resource name>: Converting and storing an encrypted password as plaintext is allowed only if PSDscAllowPlainTextPassword is set to true.
```

#### Cause

You have used a credential in a configuration but didn’t provide proper **ConfigurationData** to set **PSDscAllowPlainTextPassword** to true for each node configuration.

#### Resolution

* Make sure to pass in the proper **ConfigurationData** to set **PSDscAllowPlainTextPassword** to true for each node configuration mentioned in the configuration. For more information, see [assets in Azure Automation DSC](../automation-dsc-compile.md#assets).

## Next steps

If you did not see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.