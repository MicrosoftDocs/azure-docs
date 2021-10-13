---
title: Azure Automation Overview
description: This article tells what Azure Automation is and how to use it to automate the lifecycle of infrastructure and applications.
services: automation
keywords: azure automation, DSC, powershell, state configuration, update management, change tracking, DSC, inventory, runbooks, python, graphical
ms.date: 10/12/2021
ms.topic: overview
---

# What is Azure Automation?

Azure Automation delivers a cloud-based automation, operating system updates, and configuration service that supports consistent management across your Azure and non-Azure environments. It includes process automation, configuration management, update management, shared capabilities, and heterogeneous features. Automation gives you complete control during deployment, operations, and decommissioning of enterprise workloads and resources.

Azure Automation supports three operational categories:

* Deploy and manage - Deliver repeatable and consistent infrastructure as code.
* Response - Create event-based automation to diagnose and resolve issues.
* Orchestrate - Orchestrate and integrate your automation with other Azure or third party services and products.






## Process Automation

Process Automation in Azure Automation allows you to automate frequent, time-consuming, and error-prone management tasks. This service helps you focus on work that adds business value. By reducing errors and boosting efficiency, it also helps to lower your operational costs. The process automation operating environment is detailed in [Runbook execution in Azure Automation](automation-runbook-execution.md).

Process automation supports the integration of Azure services and other third party systems required in deploying, configuring, and managing your end-to-end processes. The service allows you to author graphical, PowerShell and Python [runbooks](automation-runbook-types.md). To run runbooks directly on the Windows or Linux machine or against resources in the on-premises or other cloud environment to manage those local resources, you can deploy a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md) to the machine.

[Webhooks](automation-webhooks.md) let you fulfill requests and ensure continuous delivery and operations by triggering automation from Azure Logic Apps, Azure Function, ITSM product or service, DevOps, and monitoring systems.

## Configuration Management

Configuration Management in Azure Automation allows access to two features:

* Change Tracking and Inventory
* Azure Automation State Configuration

### Change Tracking and Inventory

Change Tracking and Inventory combines functions to allow you to track Linux and Windows virtual machine and server infrastructure changes. The service supports change tracking across services, daemons, software, registry, and files in your environment to help you diagnose unwanted changes and raise alerts. Inventory support allows you to query in-guest resources for visibility into installed applications and other configuration items. For details of this feature, see [Change Tracking and Inventory](change-tracking/overview.md).

### Azure Automation State Configuration

[Azure Automation State Configuration](automation-dsc-overview.md) is a cloud-based feature for PowerShell desired state configuration (DSC) that provides services for enterprise environments. Using this feature, you can manage your DSC resources in Azure Automation and apply configurations to virtual or physical machines from a DSC pull server in the Azure cloud.

## Update management

Azure Automation includes the [Update Management](./update-management/overview.md) feature for Windows and Linux systems across hybrid environments. Update Management gives you visibility into update compliance across Azure and other clouds, and on-premises. The feature allows you to create scheduled deployments that orchestrate the installation of updates within a defined maintenance window. If an update shouldn't be installed on a machine, you can use Update Management functionality to exclude it from a deployment.
