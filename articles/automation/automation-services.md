---
title: Azure Automation services overview
description: This article tells what Azure Automation services are and how to use it to automate the lifecycle of infrastructure and applications.
services: automation
keywords: azure automation services, automanage, Bicep, Blueprints, Guest Config, Policy, Functions
ms.date: 03/04/2022
ms.topic: overview
---

# Choose the right automation services in Azure

This article explains various automation services offered in the Azure portfolio. All these services can automate business and operational processes and can solve integration problems amongst various services, system, and processes. They can all define input, action or activity to be performed, conditions, error handling, and output generation. You can run them on a schedule or trigger or do a manual demand-based execution. Each service has its unique advantages and target audience.
Using these services, you can shift effort from manually performing operational tasks towards building automation for these tasks including:

- Reduce time to perform an action
- Reduce risk in performing the action
- Increased human capacity for further innovation
- Standardize operations

## Categories in Automation operations

Automation is mainly required in three broad categories of operations.

### Deployment & management of resources
 You can create and configure programmatically using automation or infrastructure as code tooling to deliver repeatable and consistent deployment and management of cloud resources. For example, an Azure Network Security Group can be deployed, and security group rules are created using an Azure Resource Manager template or by using an automation script.

### Responding to external events
On the basis of critical external event like responding to database changes, taking action on the basis of inputs given to a web page etc, you can diagnose and resolve issues.

### Complex Orchestration
BY integrating with first or third party products, you can define end to end automation workflows.

## What are these services

There are multiple Azure services that can fulfill the above requirements. Each service has its own benefits and limitations and customers can use multiple services together to meet their automation requirements. 

**Deployment & management of resources**
  - Azure ARM templates\Bicep
  - Azure Blueprints
  - Azure Automation
  - Azure Automanage for machine configuration and management.

**Responding to external events** 
  - Azure Functions
  - Azure Automation or Azure Policy Guest Config to take an action when there is a change in the compliance state of resource.

**Complex Orchestration & integration with 1st or 3rd party products** 
  - Azure Logic Apps
  - Azure Functions or Azure Automation. 
  - Azure Logic app has over 400+ connectors to other services, including Azure Automation and Azure Functions which could be leveraged to meet complex automation scenarios.

:::image type="content" source="media/automation-services/automation-services-overview.png" alt-text="Screenshot shows an Overview of Automation services.":::


## Deploy and Manage

### Azure Resource Manager template or BICEP (Infrastructure as Code approach)

- It is a simple declarative language to provision infrastructure on Azure.
- It can leverage ARM template knowledge and investments. 
- It has a simple syntax without the use of JSON.
- It is modular, takes abstract common blocks of configuration into reusable elements.
- As an open Source, it provides transparency and encourages community participation.
- An integration with Policy as Code is possible.
- The Azure Blueprints define a repeatable set of Azure resources that implements and adheres to an organization's standards, patterns, and requirements.
- [Learn more](/azure/azure-resource-manager/bicep/overview?tabs=bicep).

# [Scenarios](#tab/scenarios-arm)
- Create, manage, and update infrastructure resources, such as virtual machines, networks, storage account, containers etc.
- Deploy apps, add tags, assign policies, assign role-based access control all declaratively as code and integrated with your CI\CD tools. 
- Manage multiple environments like production, non-production and disaster recovery.
- Deploy resources consistently and reliably at a scale.

# [Users](#tab/users-arm)
- Application Developers, Infrastructure Adminstrators, DevOps Engineers using Azure for the first time or using Azure as their primary cloud.
- IT Engineer\Cloud Architect responsible for cloud infrastructure deployment.

---

### [Azure Automation](/azure/automation/overview)

- You can orchestrate repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment. 
- It provides a persistent shared assets including variables, connections, objects, which allows orchestration of complex jobs [Learn more](/azure/automation/automation-runbook-gallery)

# [Scenarios](#tab/scenarios-aa)
- Schedule tasks for example – Stop dev/test VMs or services at night and turn on during day.
- Response to alerts such as system alerts, service alerts, high CPU/memory alerts, create ServiceNow tickets, etc. 
- Hybrid automation where you can manage, automate on-premises servers like SQL server, Active Directory etc. 
- Azure resource life-cycle management and governance that includes resource provisioning, deprovisioning, adding correct tags, locks, NSGs etc.

# [Users](#tab/users-aa)
- IT administrators, System administrators, IT operations administrators who are skilled at using PowerShell or Python based scripting.
- Infrastructure administrators managing the on premises infrastructure using scripts or executing long running jobs such as month-end operations on servers running on premises. 

---
### Azure Automation based in-guest management

**Configuration management** 
- It collects inventory & tracks changes in your environment. [Learn more](/azure/automation/change-tracking/overview).
- You can configure desired state of your machines and discover\correct configuration drift. [Learn more](/azure/automation/automation-dsc-overview).

**Update management** 
- You can assess compliance of servers.
- You can schedule update installation on your machines. [Learn more](/azure/automation/update-management/overview)

# [Scenarios](#tab/scenarios-inguest)
- Detect and alert on software, services, file & registry changes to your machines, vigilant on everything installed in your servers. 
**Patch management** 
- Assess and install updates on your servers.
- Configure desired state of your servers and ensure they stay complaint. 

# [Users](#tab/users-inguest)
- Central IT\Infrastructure Administrators\Auditors looking for regulatory requirements at scale & ensuring end state of severs looks as desired, patched and audited.

---

### Azure Automanage (Preview)
- You can replace repetitive, day-to-day operational tasks with an exception-only management model, where a healthy, steady state of VM is equal to hands free management.

**Linux and Windows support** 
- You can intelligently onboards virtual machines to select best practices Azure services
- It allows you to automatically configures each service per Azure best practices
- It supports customization of best practice services through VM Best practices template for Dev\Test and Production workload.
- You can monitors for drift and correct it when detected
- It provides a simple experience (point, click, set, forget)
- [Learn more](/azure/automanage/automanage-virtual-machines).

# [Scenarios](#tab/scenarios-automanage)
- Automatically configures guest operating system per Microsoft baseline configuration.
- Automatically detects for drift and corrects it across a VM’s entire lifecycle.
- Aims at a hands free management of machines. 


# [Users](#tab/users-automanage)
- The IT Administrators, Infra Administrators, IT Operations Administrators who are responsible for managing server workload, day to day admin tasks like backup, disaster recovery, security updates, responding to security threats, etc. across Azure and on-premise.
- Developers who do not wish to manage servers or spend the time on less priority tasks.

---

## Respond

### Azure Policy based Guest Configuration
The Azure Policy's guest configuration feature provides native capability to audit or configure operating system settings as code, both for machines running in Azure and hybrid [Arc-enabled machines] (/azure/azure-arc/servers/overview). The feature can be used directly per-machine, or at-scale orchestrated by Azure Policy.
- You can set the next iteration of [Azure Automation State Configuration](/azure/automation/automation-dsc-overview).
- You are aware on what is installed, and can check for known-bad apps, protocols certificates, administrator privileges, and health of agents.
- Customer-authored content [Learn more](/azure/governance/policy/concepts/guest-configuration-policy-effects)

# [Scenarios](#tab/scenarios-guestconfig)
- Obtain compliance data that may include : 
   - The configuration of the operating system – files, registry, and services
   - Application configuration or presence
   - Check environment settings
- Audit or deploy settings to all machines (Set) in scope either reactively to existing machines or proactively to new machines as they are deployed.
- Respond to policy events to provide [remediation on demand or continuous remediation.](/azure/governance/policy/concepts/guest-configuration-policy-effects#remediation-on-demand-applyandmonitor)

# [Users](#tab/users-guestconfig)
- The Central IT, Infrastructure Administrators, Auditors (Cloud custodian) who are working towards the regulatory requirements at scale,and ensure that end state of servers looks as desired.
- The application teams validating compliance before releasing change.

---

### Azure Automation (Process Automation)

- You can orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment.
- It provides persistent shared assets including variables, connections, objects, that allows orchestration of complex jobs.
- You can invoke a runbook on the basis of [Azure Monitor alert](/azure/automation/automation-create-alert-triggered-runbook) or through a [webhook](/azure/automation/automation-webhooks). 

# [Scenarios](#tab/scenarios-pa)
- Respond to alerts such as system alerts, service alerts, high CPU/memory alerts, create ServiceNow tickets, etc.
- Hybrid automation scenarios where you can manage, automate on-premises servers like SQL server, Active Directory etc on the basis of an external event. 
- Azure resource life-cycle management and governance which includes Resource provisioning, deprovisioning, adding correct tags, locks, NSGs etc on the basis of Azure monitor alerts. 

# [Users](#tab/users-pa)
- IT administrators, System administrators, IT operations administrators who are skilled at using PowerShell or Python based scripting.

---

### Azure Functions

Provides a serverless automation platform that allows you to write code to react to critical events, without having to worry about the underlying platform. 
- You can use a variety of languages so that you can write functions in a language of your choice such as C#, Java, JavaScript, PowerShell, or Python and focus on specific piece of code.
- It allows you to orchestrate complex workflows through durable functions. [Learn more](/azure/azure-functions/functions-overview)

# [Scenarios](#tab/scenarios-functions)
- Respond to events on resources : such as add tags to resource group basis cost center, when VM is deleted etc.
- Set scheduled tasks such as set a pattern to stop and start a VM at a specific time, read blob storage content at regular intervals etc.
- Process Azure alerts where you can send team’s event when the CPU activity spikes to 90%.
- Orchestrate with external systems such as M365.
- Respond to database changes.

# [Users](#tab/users-functions)
- The Application Developers who are skilled in coding languages like C#, F#, PHP, Java, JavaScript, PowerShell, or Python.
- Cloud Architects who build serverless Micro-services based applications.

---

## Orchestrate

### Azure logic apps
Logic apps is a platform for creating and running complex orchestration workflows that integrate your apps, data, services, and systems. [Learn more](/azure/logic-apps/logic-apps-overview).
  - It allows you to build smart integrations between 1st party and 3rd party apps, services and systems running across on-premises, hybrid and cloud native.
  - You can use managed connectors from a 450+ and growing Azure connectors ecosystem to use in your workflows.
  - It gives a first-class support for enterprise integration and B2B scenarios.
  - You can visually create and edit workflows - Low Code\no code approach 
  - It runs only in the cloud.
  - It provides a large collection of ready made actions and triggers.

# [Scenarios](#tab/scenarios-logic)
- Schedule and send email notifications using Office 365 when a specific event happens, for example, a new file is uploaded.
- Route and process customer orders across on-premises systems and cloud services
- Move uploaded files from an SFTP or FTP server to Azure Storage.
- Monitor tweets, analyze the sentiment, and create alerts or tasks for items that need review.

# [Users](#tab/users-logic)
- The Pro integrators and developers, IT professionals who would want to use low code/no code option for Advanced integration scenarios to external systems or APIs.

---

### Azure Automation - Process Automation
- You can orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment.
- It provides persistent shared assets including variables, connections, objects, that allows orchestration of complex jobs. [Learn more](/azure/automation/overview)

# [Scenarios](#tab/scenarios-apa)

- Azure resource life-cycle management and governance which includes Resource provisioning, deprovisioning, adding correct tags, locks, NSGs etc. through runbooks that get triggered from ITSM alerts.
- Use hybrid worker as a bridge from cloud to on-premises enabling resource\user management on-premise.
- Execute complex disaster recovery workflows through Automation runbooks.
- Execute automation runbooks as part of Logic apps workflow through Azure Automation Connector. 

# [Users](#tab/users-apa)
- IT administrators, System administrators, IT operations administrators who are skilled at using PowerShell or Python based scripting.
- Infrastructure Administrators managing on-premises infrastructure using scripts or executing long running jobs like month-end operations on servers running on-premises.

---

### Azure Functions

- It is a serverless automation platform that allows you to write code to react to critical events, without having to worry about the underlying platform.[Learn more](/azure/azure-functions/functions-overview).
- It provides a variety of languages so that you can write functions in a language of your choice such as C#, Java, JavaScript, PowerShell, or Python and focus on specific piece of code.
- You can orchestrate complex workflows through [durable functions](/azure-functions/durable/durable-functions-overview?tabs=csharp).

# [Scenarios](#tab/scenarios-afunctions)
- Respond to events on resources : such as add tags to resource group basis cost center, when VM is deleted etc.
- Set scheduled tasks such as set a pattern to stop and start a VM at a specific time, read blob storage content at regular intervals etc.
- Process Azure alerts where you can send team’s event when the CPU activity spikes to 90%.
- Orchestrate with external systems such as M365
- Executes Azure Function as part of Logic apps workflow through Azure Function Connector.

# [Users](#tab/users-afunctions)
- The Application Developers who are skilled in coding languages like C#, F#, PHP, Java, JavaScript, PowerShell, or Python.
- Cloud Architects who build serverless Micro-services based applications.

---

## Next steps
* To learn on how to securely execute the automation jobs, see [Best practices for security in Azure Automation](/azure/automation/automation-security-guidelines).
