---
title: Azure Automation services overview
description: This article tells what Azure Automation services are and how to use it to automate the lifecycle of infrastructure and applications.
services: automation
keywords: azure automation services, automanage, Bicep, Blueprints, Guest Config, Policy, Functions
ms.date: 03/04/2022
ms.topic: overview
---

# Choose the right automation services in Azure

This article explains various automation services offered in the Azure environment. These services can automate business and operational processes and solve integration problems amongst multiple services, systems, and processes. They can define input, action, activity to be performed, conditions, error handling, and output generation. Using these services you can run various activites on a schedule or do a manual demand-based execution. Each service has its unique advantages and target audience.
Using these services, you can shift effort from manually performing operational tasks towards building automation for these tasks, including:

- Reduce time to perform an action
- Reduce risk in performing the action
- Increased human capacity for further innovation
- Standardize operations

## Categories in Automation operations
Automation is mainly required in three broad categories of operations.

- **Deployment & management of resources** - create and configure programmatically using automation or infrastructure as code tooling to deliver repeatable and consistent deployment and management of cloud resources. For example, an Azure Network Security Group can be deployed, and security group rules are created using an Azure Resource Manager template or an automation script.

- **Responding to external events** - based on a critical external event such as responding to database changes, taking action as per the  inputs given to a web page and so on, you can diagnose and resolve issues.

- **Complex Orchestration** - by integrating with first or third party products, you can define an end to end automation workflows.

## What are these services

Multiple Azure services can fulfil the above requirements. Each service has its benefits and limitations, and customers can use multiple services to meet their automation requirements.  

**Deployment & management of resources**
  - Azure ARM templates/Bicep
  - Azure Blueprints
  - Azure Automation
  - Azure Automanage for machine configuration and management.

**Responding to external events** 
  - Azure Functions
  - Azure Automation
  - Azure Policy Guest Config to take an action when there is a change in the compliance state of resource.

**Complex Orchestration & integration with 1st or 3rd party products** 
  - Azure Logic Apps
  - Azure Functions or Azure Automation. Azure Logic app has over 400+ connectors to other services, including Azure Automation and Azure Functions which could be leveraged to meet complex automation scenarios.

:::image type="content" source="media/automation-services/automation-services-overview.png" alt-text="Screenshot shows an Overview of Automation services.":::


## Deploy and manage Automation services

### Azure Resource Manager template or BICEP 

Azure Resource Manager and Azure BICEP provide a language to develop repeatable and consistent deployment templates for Azure resources.
BICEP is a simple declarative language to provision infrastructure on Azure that can leverage ARM template knowledge and investments. It has a simple syntax, doesn't use JSON, is modular where it takes abstract common blocks of configuration into reusable elements. As an open source, it provides transparency, encourages community participation and an integration with Policy as Code is possible.

The Azure Blueprints define a repeatable set of Azure resources that implements and adheres to an organization's standards, patterns, and requirements. [Learn more](/azure/azure-resource-manager/bicep/overview?tabs=bicep).

**Scenarios**
- Create, manage, and update infrastructure resources, such as virtual machines, networks, storage accounts, containers and so on.
- Deploy apps, add tags, assign policies, assign role-based access control all declaratively as code and integrated with your CI\CD tools. 
- Manage multiple environments such as production, non-production and disaster recovery.
- Deploy resources consistently and reliably at a scale.

**Users**
- Application Developers, Infrastructure Administrators, DevOps Engineers using Azure for the first time or using Azure as their primary cloud.
- IT Engineer\Cloud Architect responsible for cloud infrastructure deployment.


### [Azure Automation](/azure/automation/overview)

Orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment. 
It provides a persistent shared assets including variables, connections, objects that allows orchestration of complex jobs. [Learn more](/azure/automation/automation-runbook-gallery)

**Scenarios**
- Schedule tasks, for example – Stop dev/test VMs or services at night and turn on during the day.
- Response to alerts such as system alerts, service alerts, high CPU/memory alerts, create ServiceNow tickets, and so on 
- Hybrid automation where you can manage automate on-premises servers such as SQL Server, Active Directory and so on. 
- Azure resource life-cycle management and governance includes resource provisioning, de-provisioning, adding correct tags, locks, NSGs and so on.

**Users**
- IT administrators, System administrators, IT operations administrators who are skilled at using PowerShell or Python based scripting.
- Infrastructure administrators manage the on-premises infrastructure using scripts or executing long-running jobs such as month-end operations on servers running on-premises. 

### Azure Automation based in-guest management

**Configuration management** 

Collects inventory & tracks changes in your environment. [Learn more](/azure/automation/change-tracking/overview).
You can configure desired the state of your machines and discover\correct configuration drift. [Learn more](/azure/automation/automation-dsc-overview).

**Update management** 
Assess compliance of servers and can schedule update installation on your machines. [Learn more](/azure/automation/update-management/overview)

**Scenarios**
- Detect and alert on software, services, file & registry changes to your machines, vigilant on everything installed in your servers. 
- Assess and install updates on your servers using Azure Update management
- Configure the desired state of your servers and ensure they stay compliant. 

**Users**
- Central IT\Infrastructure Administrators\Auditors looking for regulatory requirements at scale & ensuring end state of severs looks as desired, patched and audited.


### Azure Automanage (Preview)

Replaces repetitive, day-to-day operational tasks with an exception-only management model, where a healthy, steady-state of VM is equal to hands-free management.

**Linux and Windows support** 
- You can intelligently onboard virtual machines to select best practices Azure services
- It allows you to configure each service per Azure best practices automatically.
- It supports customization of best practice services through VM Best practices template for Dev\Test and Production workload.
- You can monitor for drift and correct it when detected
- It provides a simple experience (point, click, set, forget. [Learn more](/azure/automanage/automanage-virtual-machines).

**Scenarios**
- Automatically configures guest operating system per Microsoft baseline configuration.
- Automatically detects for drift and corrects it across a VM’s entire lifecycle.
- Aims at a hands-free management of machines. 


**Users**
- The IT Administrators, Infra Administrators, IT Operations Administrators are responsible for managing server workload, day to day admin tasks such as backup, disaster recovery, security updates, responding to security threats, and so on. across Azure and on-premise.
- Developers who do not wish to manage servers or spend the time on fewer priority tasks.


## Respond to events in Automation workflow

### Azure Policy based Guest Configuration

Azure Policy based Guest configuration is the next iteration of Azure Automation State configuration. 
You can check on what is installed in:
  - The next iteration of [Azure Automation State Configuration](/azure/automation/automation-dsc-overview).
  - For known-bad apps, protocols certificates, administrator privileges, and health of agents.
  - For customer-authored content [Learn more](/azure/governance/policy/concepts/guest-configuration-policy-effects)

**Scenarios**
- Obtain compliance data that may include : 
   - The configuration of the operating system – files, registry, and services
   - Application configuration or presence
   - Check environment settings
- Audit or deploy settings to all machines (Set) in scope either reactively to existing machines or proactively to new machines as they are deployed.
- Respond to policy events to provide [remediation on demand or continuous remediation.](/azure/governance/policy/concepts/guest-configuration-policy-effects#remediation-on-demand-applyandmonitor)

**Users**
- The Central IT, Infrastructure Administrators, Auditors (Cloud custodians) are working towards the regulatory requirements at scale and ensuring that servers' end state looks as desired.
- The application teams validate compliance before releasing change.


### Azure Automation - Process Automation

Orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment.
- It provides persistent shared assets, including variables, connections, objects, that allows orchestration of complex jobs.
- You can invoke a runbook on the basis of [Azure Monitor alert](/azure/automation/automation-create-alert-triggered-runbook) or through a [webhook](/azure/automation/automation-webhooks). 

**Scenarios**
- Respond to system alerts, service alerts, high CPU/memory alerts, create ServiceNow tickets, and so on.
- Hybrid automation scenarios where you can manage automate on-premises servers such as SQL Server, Active Directory and so on based on an external event. 
- Azure resource life-cycle management and governance that includes Resource provisioning, deprovisioning, adding correct tags, locks, NSGs and so on based on Azure monitor alerts. 

**Users**
- IT administrators, System administrators, IT operations administrators who are skilled at using PowerShell or Python based scripting.


### Azure functions

Provides a serverless automation platform that allows you to write code to react to critical events without worrying about the underlying platform. 
- You can use a variety of languages so that you can write functions in a language of your choice such as C#, Java, JavaScript, PowerShell, or Python and focus on specific pieces of code.
- It allows you to orchestrate complex workflows through durable functions. [Learn more](/azure/azure-functions/functions-overview)

**Scenarios**
- Respond to events on resources: such as add tags to resource group basis cost center, when VM is deleted etc.
- Set scheduled tasks such as setting a pattern to stop and start a VM at a specific time, reading blob storage content at regular intervals etc.
- Process Azure alerts to send the team’s event when the CPU activity spikes to 90%.
- Orchestrate with external systems such as M365.
- Respond to database changes.

**Users**
- The Application developers who are skilled in coding languages such as C#, F#, PHP, Java, JavaScript, PowerShell, or Python.
- Cloud Architects who build serverless Micro-services based applications.


## Orchestrate complex jobs in Azure Automation

### Azure logic apps

Logic Apps is a platform for creating and running complex orchestration workflows that integrate your apps, data, services, and systems. [Learn more](/azure/logic-apps/logic-apps-overview).
  - Allows you to build smart integrations between 1st party and 3rd party apps, services and systems running across on-premises, hybrid and cloud native.
  - Allows you to use managed connectors from a 450+ and growing Azure connectors ecosystem to use in your workflows.
  - Provides a first-class support for enterprise integration and B2B scenarios.
  - Flexibility to visually create and edit workflows - Low Code\no code approach 
  - Runs only in the cloud.
  - Provides a large collection of ready made actions and triggers.

**Scenarios**
- Schedule and send email notifications using Office 365 when a specific event happens. For example, a new file is uploaded.
- Route and process customer orders across on-premises systems and cloud services
- Move uploaded files from an SFTP or FTP server to Azure Storage.
- Monitor tweets, analyze the sentiment, and create alerts or tasks for items that need review.

**Users**
- The Pro integrators and developers, IT professionals who would want to use low code/no code option for Advanced integration scenarios to external systems or APIs.


### Azure Automation - Process Automation

Orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment. It provides persistent shared assets, including variables, connections, objects, that allows orchestration of complex jobs. [Learn more](/azure/automation/overview)

**Scenarios**

Azure resource life-cycle management and governance which includes Resource provisioning, de-provisioning, adding correct tags, locks, NSGs and so on through runbooks that are triggered from ITSM alerts.
- Use hybrid worker as a bridge from cloud to on-premises enabling resource\user management on-premise.
- Execute complex disaster recovery workflows through Automation runbooks.
- Execute automation runbooks as part of Logic apps workflow through Azure Automation Connector. 

**Users**
- IT administrators, System administrators, IT operations administrators who are skilled at using PowerShell or Python based scripting.
- Infrastructure Administrators managing on-premises infrastructure using scripts or executing long running jobs such as month-end operations on servers running on-premises.


### Azure functions

A serverless automation platform that allows you to write code to react to critical events without worrying about the underlying platform.[Learn more](/azure/azure-functions/functions-overview).
- It provides a variety of languages so that you can write functions in a language of your choice such as C#, Java, JavaScript, PowerShell, or Python and focus on specific pieces of code.
- You can orchestrate complex workflows through [durable functions](/azure-functions/durable/durable-functions-overview?tabs=csharp).

**Scenarios**
- Respond to events on resources : such as add tags to resource group basis cost center, when VM is deleted etc.
- Set scheduled tasks such as setting a pattern to stop and start a VM at a specific time, reading blob storage content at regular intervals etc.
- Process Azure alerts where you can send team’s event when the CPU activity spikes to 90%.
- Orchestrate with external systems such as M365
- Executes Azure Function as part of Logic apps workflow through Azure Function Connector.

**Users**
- Application Developers who are skilled in coding languages such as C#, F#, PHP, Java, JavaScript, PowerShell, or Python.
- Cloud Architects who build serverless Micro-services based applications.

## Next steps
- To learn on how to securely execute the automation jobs, see [Best practices for security in Azure Automation](/azure/automation/automation-security-guidelines).
