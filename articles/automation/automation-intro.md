---
title: An introduction to Azure Automation
description: This article tells what Azure Automation is and how to use it to automate the lifecycle of infrastructure and applications.
services: automation
ms.subservice: process-automation
keywords: azure automation, DSC, powershell, state configuration, update management, change tracking, DSC, inventory, runbooks, python, graphical
ms.date: 10/18/2018
ms.custom: mvc
ms.topic: overview
---
# An introduction to Azure Automation

Azure Automation delivers a cloud-based automation and configuration service that supports consistent management across your Azure and non-Azure environments. It comprises process automation, configuration management, update management, shared capabilities, and heterogeneous features. Automation gives you complete control during deployment, operations, and decommissioning of workloads and resources.

![Automation capabilities](media/automation-overview/automation-overview.png)

## Process Automation

Process Automation in Azure Automation allows you to automate frequent, time-consuming, and error-prone cloud management tasks. This service helps you focus on work that adds business value. By reducing errors and boosting efficiency, it also helps to lower your operational costs. The process automation operating environment is detailed in [Runbook execution in Azure Automation](automation-runbook-execution.md).

Process automation supports the integration of Azure services and other public systems required in deploying, configuring, and managing your end-to-end processes. The service allows you to author [runbooks](automation-runbook-types.md) graphically, in PowerShell, or using Python. By using a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md), you can unify management by orchestrating across on-premises environments. [Webhooks](automation-webhooks.md) let you fulfill requests and ensure continuous delivery and operations by triggering automation from ITSM, DevOps, and monitoring systems. 

## Configuration Management

Configuration Management in Azure Automation allows access to two features:

* Change Tracking and Inventory
* Azure Automation State Configuration

### Change Tracking and Inventory

Change Tracking and Inventory combines change tracking and inventory functions to allow you to track virtual machine and server infrastructure changes. The service supports change tracking across services, daemons, software, registry, and files in your environment to help you diagnose unwanted changes and raise alerts. Inventory support allows you to query in-guest resources for visibility into installed applications and other configuration items. For details of this feature, see [Change Tracking and Inventory](change-tracking.md).

### Azure Automation State Configuration

[Azure Automation State Configuration](automation-dsc-overview.md) is a cloud-based feature for PowerShell desired state configuration (DSC) that provides services for enterprise environments. Using this feature, you can manage your DSC resources in Azure Automation and apply configurations to virtual or physical machines from a DSC pull server in the Azure cloud. 

## Update management

Azure Automation includes the [Update Management](automation-update-management.md) feature for Windows and Linux systems across hybrid environments. Update Management gives you visibility into update compliance across Azure and other clouds, and on-premises. The feature allows you to create scheduled deployments that orchestrate the installation of updates within a defined maintenance window. If an update shouldn't be installed on a machine, you can use Update Management functionality to exclude it from a deployment.

## Shared capabilities

Azure Automation offers a number of shared capabilities, including shared resources, role-based access control, flexible scheduling, source control integration, auditing, and tagging.

### <a name="shared-resources"></a>Shared resources

Azure Automation consists of a set of shared resources that make it easier to automate and configure your environments at scale.

* **[Schedules](automation-schedules.md)** - Trigger Automation operations at predefined times.
* **[Modules](automation-integration-modules.md)** - Manage Azure and other systems. You can import modules into the Automation account for Microsoft, third-party, community, and custom-defined cmdlets and DSC resources.
* **[Modules gallery](automation-runbook-gallery.md)** - Supports native integration with the PowerShell Gallery to let you view runbooks and import them into the Automation account. The gallery allows you to quickly get started integrating and authoring your processes from PowerShell gallery and Microsoft Script Center.
* **[Python 2 packages](python-packages.md)** - Support Python 2 runbooks for your Automation account.
* **[Credentials](automation-credentials.md)** - Securely store sensitive information that runbooks and configurations can use at runtime.
* **[Connections](automation-connections.md)** - Store name-value pairs of common information for connections to systems. The module author defines connections in runbooks and configurations for use at runtime.
* **[Certificates](automation-certificates.md)** - Define information to be used in authentication and securing of deployed resources when accessed by runbooks or DSC configurations at runtime. 
* **[Variables](automation-variables.md)** - Hold content that can be used across runbooks and configurations. You can change variable values without having to modify any of the runbooks or configurations that reference them.

### Role-based access control

Azure Automation supports role-based access control (RBAC) to regulate access to the Automation account and its resources. To learn more about configuring RBAC on your Automation account, runbooks, and jobs, see [Role-based access control for Azure Automation](automation-role-based-access-control.md).

### Source control integration

Azure Automation supports [source control integration](source-control-integration.md). This feature promotes configuration as code where runbooks or configurations can be checked into a source control system.

## Heterogeneous support (Windows and Linux)

Automation is designed to work across your hybrid cloud environment and also your Windows and Linux systems. It delivers a consistent way to automate and configure deployed workloads and the operating systems that run them.

## Common scenarios for Automation

Azure Automation supports management throughout the lifecycle of your infrastructure and applications. Common scenarios include:

* **Write runbooks** - Author PowerShell, PowerShell Workflow, graphical, Python 2, and DSC runbooks in common languages. 
* **Build and deploy resources** - Deploy virtual machines across a hybrid environment using runbooks and Azure Resource Manager templates. Integrate into development tools, such as Jenkins and Azure DevOps.
* **Configure VMs** - Assess and configure Windows and Linux machines with configurations for the infrastructure and application.
* **Share knowledge** - Transfer knowledge into the system on how your organization delivers and maintains workloads. 
* **Retrieve inventory** - Get a complete inventory of deployed resources for targeting, reporting, and compliance. 
* **Find changes** - Identify changes that can cause misconfiguration and improve operational compliance.
* **Monitor** - Isolate machine changes that are causing issues and remediate or escalate them to management systems.
* **Protect** - Quarantine machines if security alerts are raised. Set in-guest requirements.
* **Govern** - Set up RBAC for teams. Recover unused resources.

[!INCLUDE [azure-lighthouse-supported-service](../../includes/azure-lighthouse-supported-service.md)]

## Pricing for Azure Automation

You can review the prices associated with Azure Automation on the [pricing](https://azure.microsoft.com/pricing/details/automation/) page.

## Next steps

> [!div class="nextstepaction"]
> [Create an Automation account](automation-quickstart-create-account.md)