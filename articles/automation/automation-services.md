---
title: Azure Automation services overview
description: This article tells what Azure Automation services are and how to use it to automate the lifecycle of infrastructure and applications.
services: automation
keywords: azure automation services, automanage, Bicep, Blueprints, Guest Config, Policy, Functions
ms.date: 10/25/2021
ms.topic: overview
---

# Choose the right automation services in Azure

This article explains various automation services offered in the Azure portfolio. All these services can automate business and operational  processes and can solve integration problems amongst various services, system, and processes. They can all define input, action or activity to be performed, conditions, error handling, and output generation. You can run them on a schedule or trigger or do a manual demand-based execution. Each service has its unique advantages and target audience.
Using these services, you can shift effort from manually performing operational tasks towards building automation for these tasks. In doing so, you achieve much, including:

- Reduce time to perform an action.
- Reduce risk in performing the action.
- Increased human capacity for further innovation.
- Standardize operations

Automation is mainly required in 3 broad categories of operations:

- **Deployment & management of resources** – Create and configure programmatically using automation or infrastructure as code tooling to deliver repeatable and consistent deployment and management of cloud resources. For example, an Azure Network Security Group can be deployed, and security group rules created using an Azure Resource Manager template or by using an automation script.

- **Responding to external events** – Diagnose and resolve issues on the basis of critical external event like responding to database changes, taking action on the basis of inputs given to a web page etc.

- **Complex Orchestration** – Integrate with 1st or 3rd party products to define end to end automation workflows.

There are multiple Azure services that can fulfill the above requirements. Each service has its own pros and cons and customers can use multiple services together to meet their automation requirements.

- **Deployment & management of resources** – You can use Azure ARM templates\Bicep, Azure Blueprints, Azure Automation, Azure Automanage for machine configuration and management.
- **Responding to external events** – You can use Azure Functions, Azure Automation or Azure Policy Guest Config to take an action when there is a change in the compliance state of resource.
- **Complex Orchestration & integration with 1st or 3rd party products** – You can use Azure Logic Apps, Azure Functions or Azure Automation. Azure Logic app has over 400+ connectors to other services, including Azure Automation and Azure Functions which could be leveraged to meet complex automation scenarios.

:::image type="content" source="media/automation-services/automation-services-overview.png" alt-text="Screenshot shows an Overview of Automation services.":::

## What are these services 

### Deploy and Manage

### Azure Resource Manager template or BICEP (Infrastructure as Code approach)

- A simple declarative language to provision infrastructure on Azure.
- Leverage ARM template knowledge and investments. 
- Simple syntax without the use of JSON.
- Modular - abstract common blocks of config into reusable elements.
- Open Source - Transparency and community
- Integration with Policy as Code.
- Azure Blueprints to define a repeatable set of Azure resources that implements and adheres to an organization's standards, patterns, and requirements.
- [Learn more](/azure/azure-resource-manager/bicep/overview?tabs=bicep).

# [Scenarios](#tab/scenarios-arm)
- Create, manage, and update infrastructure resources, such as virtual machines, networks, storage account, containers etc.
- Deploy apps, add tags, assign policies, assign role-based access control all declaratively as code and integrated with your CI\CD tools. 
- Manage multiple environments like production, non-production and disaster recovery.
- Deploy resources consistently and reliably at a scale.

# [Users](#tab/users-arm)
- Application Developers\Infrastructure Admins\DevOps Engineers using Azure for the first time or using Azure as their primary cloud.
- IT Engineer\Cloud Architect responsible for cloud infrastructure deployment.

---

#### [Azure Automation](/azure/automation/overview)

- Orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment. 
- Provides persistent shared assets including variables, connections, objects, which allows orchestration of complex jobs [Learn more](/azure/automation/automation-runbook-gallery)

# [Scenarios](#tab/scenarios-aa)
- Schedule tasks for example – Stop dev/test VMs or services at night and turn on during day.
- Response to alerts such as system alerts, service alerts, high CPU/memory alerts, create ServiceNow tickets, etc. 
- Hybrid automation where you can manage, automate on-premises servers like SQL server, Active Directory etc. 
- Azure resource life-cycle management and governance which includes resource provisioning, deprovisioning, adding correct tags, locks, NSGs etc.

# [Users](#tab/users-aa)
- IT admins, System admins, IT operations admins who are skilled at using PowerShell or Python based scripting.
- Infrastructure Admins managing on-prem infrastructure using scripts or executing long running jobs like month-end operations on servers running on-prem. 

---
#### Azure Automation based in-guest management

**Configuration management** 
- Collect inventory & track changes in your environment. [Learn more](/azure/automation/change-tracking/overview).
- Configure desired state of your machines and discover\correct configuration drift. [Learn more](/azure/automation/automation-dsc-overview).

**Update management** 
- Assess compliance of servers.
- Schedule update installation. [Learn more](/azure/automation/update-management/overview)

# [Scenarios](#tab/scenarios-inguest)
- Detect and alert on software, services, file & registry changes to your machines, know what's installed in your servers. 
- **Patch management** -  assess and install updates on your servers.
- Configure desired state of your servers and ensure they stay complaint. 

# [Users](#tab/users-inguest)
- Central IT\Infrastructure Admins\Auditors looking for regulatory requirements at scale & ensuring end state of severs looks as desired, patched and audited.


#### Azure Automanage (Preview)
- Replaces repetitive, day-to-day operational tasks with an exception-only management model, where a healthy , steady state of VM is equal to hands free management.

**Linux and Windows support** 
- Intelligently onboards virtual machines to select best practices Azure services
- Automatically configures each service per Azure best practices
- Supports customization of best practice services through VM Best practices template for Dev\Test and Production workload.
- Monitors for drift and corrects for it when detected
- Provides a simple experience (point, click, set, forget)
- [Learn more](/azure/automanage/automanage-virtual-machines).

# [Scenarios](#tab/scenarios-automanage)
- Automatically configure guest operating system per Microsoft baseline configuration.
- Automatically detects for drift and corrects for it across a VM’s entire lifecycle.
- Aims at a hands free management of machines. 


# [Users](#tab/users-automanage)
- The IT Admins/Infra Admins/IT Operations Admins who are responsible for managing server workload, day to day admin tasks like backup, disaster recovery, security updates, responding to security threats, etc. across Azure and on-premise.
- Developers who do not wish to manage servers or spend the time on less priority tasks.

---

### Respond

#### Azure Policy based Guest Configuration
- Next iteration of [Azure Automation State Configuration](/azure/automation/automation-dsc-overview).
- Azure Policy's guest configuration feature provides native capability to audit or configure operating system settings as code, both for machines running in Azure and hybrid [Arc-enabled machines] (/azure/azure-arc/servers/overview). The feature can be used directly per-machine, or at-scale orchestrated by Azure Policy.
- What is installed, check for known-bad apps, protocols
- Certificates, admin privileges, health of agents
- Customer-authored content [Learn more](/azure/governance/policy/concepts/guest-configuration-policy-effects)

# [Scenarios](#tab/scenarios-guestconfig)
- Obtain compliance data that may include : 
   - The configuration of the operating system – files, registry, and services
   - Application configuration or presence
   - Check environment settings
- Audit or deploy settings to all machines (Set) in scope either reactively to existing machines or proactively to new machines as they are deployed.
- Respond to policy events to provide [remediation on demand or continuous remediation.](/azure/governance/policy/concepts/guest-configuration-policy-effects#remediation-on-demand-applyandmonitor)

# [Users](#tab/users-guestconfig)
- The Central IT/Infrastructure Admins/Auditors (Cloud custodian) who are working towards the regulatory requirements at scale,and ensure that end state of servers looks as desired.
- The application teams validating compliance before releasing change.

---

#### Azure Automation (Process Automation)

- Orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment.
- Provides persistent shared assets including variables, connections, objects, which allows orchestration of complex jobs.
- Invoke a runbook on the basis of [Azure Monitor alert](/azure/automation/automation-create-alert-triggered-runbook) or through a [webhook](/azure/automation/automation-webhooks). 

# [Scenarios](#tab/scenarios-pa)
- Respond to alerts such as system alerts, service alerts, high CPU/memory alerts, create ServiceNow tickets, etc.
- Hybrid automation scenarios where you can manage, automate on-premises servers like SQL server, Active Directory etc on the basis of an external event. 
- Azure resource life-cycle management and governance which includes Resource provisioning, deprovisioning, adding correct tags, locks, NSGs etc on the basis of Azure monitor alerts. 

# [Users](#tab/users-pa)
- IT admins, System admins, IT operations admins who are skilled at using PowerShell or Python based scripting.

---

### Azure Functions

- Provides a serverless automation platform that allows you to write code to react to critical events, without having to worry about the underlying platform. 
- Provides a variety of Languages so that you can write functions in a language of your choice such as C#, Java, JavaScript, PowerShell, or Python and focus on specific piece of code.
- Orchestrate complex workflows through durable functions. [Learn more](/azure/azure-functions/functions-overview)

# [Scenarios](#tab/scenarios-functions)
- Respond to events on resources : such as add tags to resource group basis cost center, when VM is deleted etc.
- Set scheduled tasks such as set a pattern to stop and start a VM at a specific time, read blob storage content at regular intervals etc.
- Process Azure alerts – you can send team’s event when the CPU activity spikes to 90%.
- Orchestrate with external systems such as M365.
- Respond to database changes.

# [Users](#tab/users-functions)
- The Application Developers who are skilled in coding languages like C#, F#, PHP, Java, JavaScript, PowerShell, or Python.
- Cloud Architects who build serverless Micro-services based applications.

---

### Orchestrate

#### Azure logic apps
- Logic apps is a platform for creating and running complex orchestration workflows that integrate your apps, data, services, and systems. [Learn more](/azure/logic-apps/logic-apps-overview).
  - Build “Smart” Integrations between 1st party and 3rd party apps, services and systems running across on-premises, hybrid and cloud native.
  - Use managed connectors from a 450+ and growing Azure connectors ecosystem to use in your workflows.
  - First-class support for enterprise integration and B2B scenarios.
  - Visually create and edit workflows - Low Code\no code approach 
  - Runs only in the cloud.
  - Provides a large collection of ready made actions and triggers.

# [Scenarios](#tab/scenarios-logic)
- Schedule and send email notifications using Office 365 when a specific event happens, for example, a new file is uploaded.
- Route and process customer orders across on-premises systems and cloud services
- Move uploaded files from an SFTP or FTP server to Azure Storage.
- Monitor tweets, analyze the sentiment, and create alerts or tasks for items that need review.

# [Users](#tab/users-logic)
- The Pro integrators and developers, IT professionals who would want to use low code/no code option for Advanced integration scenarios to external systems or APIs.

---

#### Azure Automation - Process Automation
- Orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment.
- Provides persistent shared assets including variables, connections, objects, which allows orchestration of complex jobs. [Learn more](/azure/automation/overview)

# [Scenarios](#tab/scenarios-apa)

- Azure resource life-cycle management and governance which includes Resource provisioning, deprovisioning, adding correct tags, locks, NSGs etc. through runbooks that get triggered from ITSM alerts.
- Use hybrid worker as a bridge from cloud to on-premises enabling resource\user management on-premise.
- Executes complex disaster recovery workflows through Automation runbooks.
- Executes automation runbooks as part of Logic apps workflow through Azure Automation Connector. 

# [Users](#tab/users-apa)
- IT admins, System admins, IT operations admins who are skilled at using PowerShell or Python based scripting.
- Infrastructure Admins managing on-prem infrastructure using scripts or executing long running jobs like month-end operations on servers running on-prem.

---

#### Azure Functions

- Provides a serverless automation platform that allows you to write code to react to critical events, without having to worry about the underlying platform.[Learn more](/azure/azure-functions/functions-overview).
- Provides a variety of Languages so that you can write functions in a language of your choice such as C#, Java, JavaScript, PowerShell, or Python and focus on specific piece of code.
- Orchestrate complex workflows through [durable functions](/azure-functions/durable/durable-functions-overview?tabs=csharp).

# [Scenarios](#tab/scenarios-afunctions)
- Respond to events on resources : such as add tags to resource group basis cost center, when VM is deleted etc.
- Set scheduled tasks such as set a pattern to stop and start a VM at a specific time, read blob storage content at regular intervals etc.
- Process Azure alerts – you can send team’s event when the CPU activity spikes to 90%.
- Orchestrate with external systems such as M365
- Executes Azure Function as part of Logic apps workflow through Azure Function Connector.

# [Users](#tab/users-afunctions)
- The Application Developers who are skilled in coding languages like C#, F#, PHP, Java, JavaScript, PowerShell, or Python.
- Cloud Architects who build serverless Micro-services based applications.

---

## Next steps
