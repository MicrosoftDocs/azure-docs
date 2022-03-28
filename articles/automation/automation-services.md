---
title: Azure Automation services overview
description: This article tells what Azure Automation services are and how to use it to automate the lifecycle of infrastructure and applications.
services: automation
keywords: azure automation services, automanage, Bicep, Blueprints, Guest Config, Policy, Functions
ms.date: 03/04/2022
ms.topic: overview
---

# Choose the Automation services in Azure

This article explains various Automation services offered in the Azure environment. These services can automate business and operational processes and solve integration problems amongst multiple services, systems, and processes. Automation services can define input, action, activity to be performed, conditions, error handling, and output generation. Using these services you can run various activities on a schedule or do a manual demand-based execution. Each service has its unique advantages and target audience.
Using these services, you can shift effort from manually performing operational tasks towards building automation for these tasks, including:

- Reduce time to perform an action
- Reduce risk in performing the action
- Increased human capacity for further innovation
- Standardize operations

## Categories in Automation operations
Automation is required in three broad categories of operations:

- **Deployment and management of resources** —create and configure programmatically using automation or infrastructure as code tooling to deliver repeatable and consistent deployment and management of cloud resources. For example, an Azure Network Security Group can be deployed, and security group rules are created using an Azure Resource Manager template or an automation script.

- **Response to external events** —based on a critical external event such as responding to database changes, acting as per the  inputs given to a web page, and so on, you can diagnose and resolve issues.

- **Complex Orchestration** —by integrating with first or third party products, you can define an end to end automation workflows.

## Azure services for Automation

Multiple Azure services can fulfill the above requirements. Each service has its benefits and limitations, and customers can use multiple services to meet their automation requirements.  

**Deployment and management of resources**
  - Azure Resource Manager (ARM) templates with Bicep
  - Azure Blueprints
  - Azure Automation
  - Azure Automanage (for machine configuration and management.)

**Responding to external events** 
  - Azure Functions
  - Azure Automation
  - Azure Policy Guest Config (to take an action when there's a change in the compliance state of resource.)

**Complex Orchestration and integration with 1st or 3rd party products** 
  - Azure Logic Apps
  - Azure Functions or Azure Automation. (Azure Logic app has over 400+ connectors to other services, including Azure Automation and Azure Functions, which could be used to meet complex automation scenarios.)


  :::image type="content" source="media/automation-services/automation-services-overview.png" alt-text="Screenshot shows an Overview of Automation services.":::


## Deploy and manage Automation services

### Azure Resource Manager (ARM) template

Azure Resource Manager provides a language to develop repeatable and consistent deployment templates for Azure resources. The template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. It uses declarative syntax, which lets you state what you intend to deploy without having to write the sequence of programming commands to create it. In the template, you specify the resources to deploy and the properties for those resources. [Learn more](/azure/azure-resource-manager/templates/overview).

### Bicep

We've introduced a new language named [Bicep](/azure/azure-resource-manager/bicep/overview) that offers the same capabilities as ARM templates but with a syntax that's easier to use. Each Bicep file is automatically converted to an ARM template during deployment. If you're considering infrastructure as code options, we recommend Bicep. For more information, see [What is Bicep?](/azure/azure-resource-manager/bicep/overview)

The following table describes the scenarios and users for ARM template and Bicep:

  **Scenarios** | **Users**
  --- | ---
  | Create, manage, and update infrastructure resources, such as virtual machines, networks, storage accounts, containers and so on. </br> </br> Deploy apps, add tags, assign policies, assign role-based access control all declaratively as code and integrated with your CI\CD tools. </br> </br> Manage multiple environments such as production, non-production, and disaster recovery. </br> </br> Deploy resources consistently and reliably at a scale.| Application Developers, Infrastructure Administrators, DevOps Engineers using Azure for the first time or using Azure as their primary cloud. </br> </br> IT Engineer\Cloud Architect responsible for cloud infrastructure deployment.


### Azure Blueprints (Preview)

 Azure Blueprints (Preview) define a repeatable set of Azure resources that implements and adheres to an organization's standards, patterns, and requirements. Blueprints are a declarative way to orchestrate the deployment of various resource templates and other artifacts such as, Role assignments, Policy assignments, ARM templates and Resource groups. [Learn more](/azure/governance/blueprints/overview).

  **Scenarios** | **Users**
  --- | ---
  | Create, manage, and update infrastructure resources to ensure that the deployed infrastructure meets the organization compliance standards. </br> </br> Audit and track Azure deployments.| Auditors and central information technology groups responsible to ensure that the deployed Azure infrastructure meets the organization compliance standards.


 
### [Azure Automation](/azure/automation/overview)

Orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment. 
It provides a persistent shared assets including variables, connections, objects that allow orchestration of complex jobs. [Learn more](/azure/automation/automation-runbook-gallery).

  **Scenarios** | **Users**
  --- | ---
  | Schedule tasks, for example – Stop dev/test VMs or services at night and turn on during the day. </br> </br> Response to alerts such as system alerts, service alerts, high CPU/memory alerts, create ServiceNow tickets, and so on. </br> </br> Hybrid automation where you can manage to automate on-premises servers such as SQL Server, Active Directory and so on. </br> </br> Azure resource life-cycle management and governance include resource provisioning, de-provisioning, adding correct tags, locks, NSGs and so on. | IT administrators, System administrators, IT operations administrators who are skilled at using PowerShell or Python based scripting. </br> </br> Infrastructure administrators manage the on-premises infrastructure using scripts or executing long-running jobs such as month-end operations on servers running on-premises. 

### Azure Automation based in-guest management

**Configuration management** : Collects inventory and tracks changes in your environment. [Learn more](/azure/automation/change-tracking/overview).
You can configure desired the state of your machines to discover and correct configuration drift. [Learn more](/azure/automation/automation-dsc-overview).

**Update management** : Assess compliance of servers and can schedule update installation on your machines. [Learn more](/azure/automation/update-management/overview).

  **Scenarios** | **Users**
  --- | ---
  | Detect and alert on software, services, file and registry changes to your machines, vigilant on everything installed in your servers. </br> </br> Assess and install updates on your servers using Azure Update management. </br> </br> Configure the desired state of your servers and ensure they stay compliant. | </br> </br> Central IT\Infrastructure Administrators\Auditors looking for regulatory requirements at scale and ensuring end state of severs looks as desired, patched and audited.


### Azure Automanage (Preview)

Replaces repetitive, day-to-day operational tasks with an exception-only management model, where a healthy, steady-state of VM is equal to hands-free management. [Learn more](/azure/automanage/automanage-virtual-machines).

  **Linux and Windows support** 
  - You can intelligently onboard virtual machines to select best practices Azure services.
  - It allows you to configure each service per Azure best practices automatically.
  - It supports customization of best practice services through VM Best practices template for Dev\Test and Production workload.
  - You can monitor for drift and correct it when detected.
  - It provides a simple experience (point, select, set, and forget). 

  **Scenarios** | **Users**
  --- | ---
  | Automatically configures guest operating system per Microsoft baseline configuration. </br> </br> Automatically detects for drift and corrects it across a VM’s entire lifecycle. </br> </br> Aims at a hands-free management of machines. | The IT Administrators, Infra Administrators, IT Operations Administrators are responsible for managing server workload, day to day admin tasks such as backup, disaster recovery, security updates, responding to security threats, and so on across Azure and on-premise. </br> </br> Developers who do not wish to manage servers or spend the time on fewer priority tasks.


## Respond to events in Automation workflow

### Azure Policy based Guest Configuration

Azure Policy based Guest configuration is the next iteration of Azure Automation State configuration. [Learn more](/azure/governance/policy/concepts/guest-configuration-policy-effects). 

  You can check on what is installed in:

  - The next iteration of [Azure Automation State Configuration](/azure/automation/automation-dsc-overview).
  - For known-bad apps, protocols certificates, administrator privileges, and health of agents.
  - For customer-authored content. 

  **Scenarios** | **Users**
  --- | ---
  | Obtain compliance data that may include: The configuration of the operating system – files, registry, and services, Application configuration or presence, Check environment settings. </br> </br> Audit or deploy settings to all machines (Set) in scope either reactively to existing machines or proactively to new machines as they are deployed. </br> </br> Respond to policy events to provide [remediation on demand or continuous remediation.](/azure/governance/policy/concepts/guest-configuration-policy-effects#remediation-on-demand-applyandmonitor) |  The Central IT, Infrastructure Administrators, Auditors (Cloud custodians) are working towards the regulatory requirements at scale and ensuring that servers' end state looks as desired. </br> </br> The application teams validate compliance before releasing change. 


### Azure Automation - Process Automation

Orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment. [Learn more](/azure/automation/automation-runbook-types?). 

  - It provides persistent shared assets, including variables, connections, objects, that allows orchestration of complex jobs. 
  - You can invoke a runbook on the basis of [Azure Monitor alert](/azure/automation/automation-create-alert-triggered-runbook) or through a [webhook](/azure/automation/automation-webhooks). 

  **Scenarios** | **Users**
  --- | ---
  | Respond to system alerts, service alerts, high CPU/memory alerts, create ServiceNow tickets, and so on. </br> </br> Hybrid automation scenarios where you can manage automate on-premises servers such as SQL Server, Active Directory and so on based on an external event.</br> </br> Azure resource life-cycle management and governance that includes Resource provisioning, deprovisioning, adding correct tags, locks, NSGs and so on based on Azure monitor alerts. | IT administrators, System administrators, IT operations administrators who are skilled at using PowerShell or Python based scripting.


### Azure functions

Provides a serverless automation platform that allows you to write code to react to critical events without worrying about the underlying platform. [Learn more](/azure/azure-functions/functions-overview).

  - You can use a variety of languages so that you can write functions in a language of your choice such as C#, Java, JavaScript, PowerShell, or Python and focus on specific pieces of code.
  - It allows you to orchestrate complex workflows through durable functions. 

  **Scenarios** | **Users**
  --- | ---
  | Respond to events on resources: such as add tags to resource group basis cost center, when VM is deleted etc. </br> </br> Set scheduled tasks such as setting a pattern to stop and start a VM at a specific time, reading blob storage content at regular intervals etc. </br> </br> Process Azure alerts to send the team’s event when the CPU activity spikes to 90%. </br> </br> Orchestrate with external systems such as Microsoft 365. </br> </br> Respond to database changes. | The Application developers who are skilled in coding languages such as C#, F#, PHP, Java, JavaScript, PowerShell, or Python. </br> </br> Cloud Architects who build serverless Micro-services based applications.


## Orchestrate complex jobs in Azure Automation

### Azure logic apps

Logic Apps is a platform for creating and running complex orchestration workflows that integrate your apps, data, services, and systems. [Learn more](/azure/logic-apps/logic-apps-overview).

  - Allows you to build smart integrations between 1st party and 3rd party apps, services and systems running across on-premises, hybrid and cloud native.
  - Allows you to use managed connectors from a 450+ and growing Azure connectors ecosystem to use in your workflows.
  - Provides a first-class support for enterprise integration and B2B scenarios.
  - Flexibility to visually create and edit workflows - Low Code\no code approach 
  - Runs only in the cloud.
  - Provides a large collection of ready made actions and triggers.

  **Scenarios** | **Users**
  --- | ---
  | Schedule and send email notifications using Office 365 when a specific event happens. For example, a new file is uploaded. </br> </br> Route and process customer orders across on-premises systems and cloud services. </br></br> Move uploaded files from an SFTP or FTP server to Azure Storage. </br> </br> Monitor tweets, analyze the sentiment, and create alerts or tasks for items that need review. | The Pro integrators and developers, IT professionals who would want to use low code/no code option for Advanced integration scenarios to external systems or APIs.


### Azure Automation - Process Automation

Orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment. It provides persistent shared assets, including variables, connections, objects, that allows orchestration of complex jobs. [Learn more](/azure/automation/overview).

  **Scenarios** | **Users**
  --- | ---
  | Azure resource life-cycle management and governance which includes Resource provisioning, de-provisioning, adding correct tags, locks, NSGs and so on through runbooks that are triggered from ITSM alerts. </br></br> Use hybrid worker as a bridge from cloud to on-premises enabling resource\user management on-premise. </br></br> Execute complex disaster recovery workflows through Automation runbooks. </br></br> Execute automation runbooks as part of Logic apps workflow through Azure Automation Connector. | IT administrators, System administrators, IT operations administrators who are skilled at using PowerShell or Python based scripting. </br> </br> Infrastructure Administrators managing on-premises infrastructure using scripts or executing long running jobs such as month-end operations on servers running on-premises.


### Azure functions

A serverless automation platform that allows you to write code to react to critical events without worrying about the underlying platform. [Learn more](/azure/azure-functions/functions-overview).

  - It provides a variety of languages so that you can write functions in a language of your choice such as C#, Java, JavaScript, PowerShell, or Python and focus on specific pieces of code.
  - You can orchestrate complex workflows through [durable functions](/azure-functions/durable/durable-functions-overview?tabs=csharp).

  **Scenarios** | **Users**
  --- | ---
  | Respond to events on resources : such as add tags to resource group basis cost center, when VM is deleted etc. </br> </br> Set scheduled tasks such as setting a pattern to stop and start a VM at a specific time, reading blob storage content at regular intervals etc. </br> </br> Process Azure alerts where you can send team’s event when the CPU activity spikes to 90%. </br> </br> Orchestrate with external systems such as Microsoft 365. </br> </br>Executes Azure Function as part of Logic apps workflow through Azure Function Connector. | Application Developers who are skilled in coding languages such as C#, F#, PHP, Java, JavaScript, PowerShell, or Python. </br> </br> Cloud Architects who build serverless Micro-services based applications.

## Next steps
- To learn on how to securely execute the automation jobs, see [best practices for security in Azure Automation](/azure/automation/automation-security-guidelines).
