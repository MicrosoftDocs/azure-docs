---
title: Troubleshoot errors onboarding Update Management, Change Tracking, and Inventory
description: Learn how to troubleshoot onboarding errors with the Update Management, Change Tracking, and Inventory solutions
services: automation
author: georgewallace
ms.author: gwallace
ms.date: 06/19/2018
ms.topic: conceptual
ms.service: automation
manager: carmonm
---
# Troubleshoot errors when onboarding solutions

You may encounter errors when onboarding solutions like Update Management or Change Tracking and Inventory. This article describes the various errors that may occur and how to resolve them.

## General Errors

### <a name="computer-grou-query-format-error"></a>Scenario: ComputerGroupQueryFormatError

#### Issue

This error code means that the saved search computer group query used to target the solution was not formatted correctly. 

#### Cause

You may have altered the query, or it may have been altered by the system.

#### Resolution

You can delete the query for this solution, and reonboard the solution, which recreates the query. The query can be found within your workspace, under **Saved searches**. The name of the query is **MicrosoftDefaultComputerGroup**, and the category of the query is the name of the solution associated with this query. If multiple solutions are enabled, the **MicrosoftDefaultComputerGroup** shows multiple times under **Saved Searches**.

### <a name="policy-violation"></a>Scenario: PolicyViolation

#### Issue

This error code means that the deployment failed due to violation of one or more policies.

#### Cause 

A policy is in place that is blocking the operation from completing.

#### Resolution

In order to successfully deploy the solution, you need to consider altering the indicated policy. As there are many different types of policies that can be defined, the specific changes required depend on the policy that is violated. For example, if a policy was defined on a resource group that denied permission to change the contents of certain types of resources within that resource group, you could, for example, do any of the following:

* Remove the policy altogether.
* Try to onboard to a different resource group.
* Revise the policy, by, for example:
  * Re-targeting the policy to a specific resource (such as to a specific Automation account).
  * Revising the set of resources that policy was configured to deny.

Check the notifications in the top right corner of the Azure portal or navigate to the resource group that contains your automation account and select **Deployments** under **Settings** to view the failed deployment. To learn more about Azure Policy visit: [Overview of Azure Policy](../../azure-policy/azure-policy-introduction.md?toc=%2fazure%2fautomation%2ftoc.json).

## <a name="mma-extension-failures"></a>MMA Extension failures

When deploying a solution, a variety of related resources are deployed. One of those resources is the Microsoft Monitoring Agent Extension or Log Analytics Agent for Linux. These are Virtual Machine Extensions installed by the virtual machine’s Guest Agent that is responsible for communicating with the configured Log Analytics Workspace, for the purpose of later coordination of the downloading of binaries and other files that the solution you are onboarding depend on once it begins execution.
You typically first become aware of MMA or Log Analytics Agent for Linux installation failures from a notification appearing in the Notifications Hub. Clicking on that notification gives further information about the specific failure. Navigation to the Resource Groups resource, and then to the Deployments element within it also provides details on the deployment failures that occurred.
Installation of the MMA or Log Analytics Agent for Linux can fail for a variety of reasons, and the steps to take to address these failures vary, depending on the issue. Specific troubleshooting steps follow.

The following section describes various issues that you can encounter when onboarding that cause a failure in the deployment of the MMA extension.

### <a name="webclient-exception"></a>Scenario: An exception occurred during a WebClient request

The MMA extension on the virtual machine is unable to communicate with external resources and deployment fails.

#### Issue

The following are examples of error messages that are returned:

```
Please verify the VM has a running VM agent, and can establish outbound connections to Azure storage.
```

```
'Manifest download error from https://<endpoint>/<endpointId>/Microsoft.EnterpriseCloud.Monitoring_MicrosoftMonitoringAgent_australiaeast_manifest.xml. Error: UnknownError. An exception occurred during a WebClient request.
```

#### Cause

Some potential causes to this error are:

* There is a proxy configured in the VM, that only allows specific ports.

* A firewall setting has blocked access to the required ports and addresses.

#### Resolution

Ensure that you have the proper ports and addresses open for communication. For a list of ports and addresses, see [planning your network](../automation-hybrid-runbook-worker.md#network-planning).

### <a name="transient-environment-issue"></a>Scenario: Install failed due to transient environment issues

The installation of the Microsoft Monitoring Agent extension failed during deployment due to another installation or action blocking the installation

#### Issue

The following are examples of error messages may be returned:

```
The Microsoft Monitoring Agent failed to install on this machine. Please try to uninstall and reinstall the extension. If the issue persists, please contact support.
```

```
'Install failed for plugin (name: Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent, version 1.0.11081.4) with exception Command C:\Packages\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\1.0.11081.4\MMAExtensionInstall.exe of Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent has exited with Exit code: 1618'
```

```
'Install failed for plugin (name: Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent, version 1.0.11081.2) with exception Command C:\Packages\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\1.0.11081.2\MMAExtensionInstall.exe of Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent has exited with Exit code: 1601'
```

#### Cause

Some potential causes to this error are:

* Another installation is in progress
* The system is was triggered to reboot during template deployment

#### Resolution

This error is a transient error in nature. Retry the deployment to install the extension.

### <a name="installation-timeout"></a>Scenario: Installation timeout

The installation of the MMA extension did not complete due to a timeout.

#### Issue

The following is an example of an error message that may be returned:

```
Install failed for plugin (name: Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent, version 1.0.11081.4) with exception Command C:\Packages\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\1.0.11081.4\MMAExtensionInstall.exe of Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent has exited with Exit code: 15614
```

#### Cause

This error is due to the virtual machine being under a heavy load during installation.

### Resolution

Attempt to install the MMA extension when the VM is under a lower load.

## Next steps

If you did not see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
