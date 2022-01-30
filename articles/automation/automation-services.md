---
title: Azure Automation services overview
description: This article tells what Azure Automation services are and how to use it to automate the lifecycle of infrastructure and applications.
services: automation
keywords: azure automation services, automanage, Bicep, Blueprints, Guest Config, Policy, Functions
ms.date: 10/25/2021
ms.topic: services overview
---

# Automation services

 his article  explains various automation services offered in the Azure portfolio. 
All of these services can automate business and operational  processes and can solve integration problems amongst various services, system and processes. They can all define input, action or activity to be performed, conditions, error handling, and output generation. You can run them on a schedule or trigger or do a manual demand-based execution. Each service has its unique advantages and target audience.
Using these services, you can shift effort from manually performing operational tasks towards building automation for these tasks. In doing so, you achieve so much, including:

- Reduce time to perform an action.
- Reduce risk in performing the action.
- Increased human capacity for further innovation.
- Standardize operations

Automation is mainly required in 3 broad categories of operations **Deployment & management of resources** - Many services can be created and configured programmatically using automation or infrastructure as code tooling to deliver repeatable and consistent deployment and management of cloud resources. For example, an Azure Network Security Group can be deployed, and security group rules created using an Azure Resource Manager template. Or using an automation script.

- **Responding to external events** – to diagnose and resolve issues on the basis of critical external event like responding to database changes , taking action on the basis of inputs given to a web page etc.
- **Complex Orchestration** - Integration with 1st or 3rd party products to define end to end automation workflows.

There are multiple Azure services that can fulfill the above requirements. Each service has its own pros and cons and customers can use multiple services together to meet their automation requirements.

- **Deployment & management of resources** – Use Azure ARM templates\Bicep , Azure Blueprints , Azure Automation, Azure Automanage
- **Responding to external events** – Use Azure Functions, Azure Policy, Guest Config, Azure Automation.
- **Complex Orchestration & integration with 1st or 3rd party products** – Use Azure Logic Apps, Azure Functions or Azure Automation. Azure Logic app has over 400+ connectors to other services which could be leveraged to meet complex automation scenarios.

:::image type="content" source="media/automation-services/automation-services-overview.png" alt-text="Screenshot shows an Overview of Automation services.":::

## What are these services

### Infrastructure as code

- **ARM/BICEP** -  a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources [Learn more](/azure/azure-resource-manager/bicep/overview?tabs=bicep)

- **Azure Automation** – Orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment . Provides persistent shared assets including variables, connections, objects which allows orchestration of complex jobs [Learn more](/azure/automation/automation-runbook-gallery) 

## Automation

### Azure Automation based in-guest management

- **Configuration Management** –  allows you to write, manage, and compile PowerShell Desired State Configuration (DSC) configurations for nodes in any cloud or on-premises datacenter. [Learn more](/azure/automation/automation-dsc-overview).

- **Update Management** - allows you to manage operating system updates for your Windows and Linux virtual machines in Azure, physical or VMs in on-premises environments, and in other cloud environments. [Learn more](/azure/automation/update-management/overview).


### Azure Policy based in guest configuration

- **Azure Automation State Configuration** – allows you to create, import and compile configurations, enable machines to manage, and view reports. [Learn more](/azure/automation/automation-dsc-getting-started).

- **Azure Logic Apps** - cloud-based platform for creating and running automated workflows that integrate your apps, data, services, and systems. [Learn more](/azure/logic-apps/logic-apps-overview).

## Azure Automanage

- **Azure Automanage** - a service that eliminates the need to discover, know how to onboard, and how to configure certain services in Azure that would benefit your virtual machine. [Learn more](/azure/automanage/automanage-virtual-machines#overview).
