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

## Deploy and Manage

### Azure Resource Manager template or BICEP (Infrastructure as Code approach)

- A simple declarative language to provision infrastructure on Azure.
- Leverage ARM template knowledge and investments. 
- Simple syntax without the use of JSON.
- Modular - abstract common blocks of config into reusable elements.
- Open Source - Transparency and community
- Integration with Policy as Code.
- Azure Blueprints to define a repeatable set of Azure resources that implements and adheres to an organization's standards, patterns, and requirements.
- [Learn more](/azure/azure-resource-manager/bicep/overview?tabs=bicep).

# [Scenarios](#tab/scenarios-deploy)
- Create, manage, and update infrastructure resources, such as virtual machines, networks, storage account, containers etc.
- Deploy apps, add tags, assign policies, assign role-based access control all declaratively as code and integrated with your CI\CD tools. 
- Manage multiple environments like production, non-production and disaster recovery.
- Deploy resources consistently and reliably at a scale.

# [Users](#tab/users-deploy)
- Application Developers\Infrastructure Admins\DevOps Engineers using Azure for the first time or using Azure as their primary cloud.
- IT Engineer\Cloud Architect responsible for cloud infrastructure deployment.

---

**Services** | **Description** | **Scenarios** | **Users**
--- | --- |--- | --- |
**Azure Resource Manager template or BICEP (Infrastructure as Code approach)** | - Simple declarative language to provision infrastructure on Azure. </br> - Leverage ARM template knowledge and investments. </br> - Simple syntax without the use of JSON. </br> - Modular: Abstract common blocks of config into reusable elements </br> Open Source: Transparency and community </br> - ntegration with Policy as Code , Azure Blueprints to define a repeatable set of Azure resources that implements and adheres to an organization's standards, patterns, and requirements. </br>[Learn more](/azure/azure-resource-manager/bicep/overview?tabs=bicep). | - Create, manage, and update infrastructure resources, such as virtual machines, networks, storage account, containers etc. </br> - Deploy apps, add tags, assign policies, assign role-based access control all declaratively as code and integrated with your CI\CD tools. </br> Manage multiple environments like production, non-production and disaster recovery. </br> Deploy resources consistently and reliably at a scale. | - Application Developers\Infrastructure Admins\DevOps Engineers using Azure for the first time or using Azure as their primary cloud. </br> IT Engineer\Cloud Architect responsible for cloud infrastructure deployment.  
**[Azure Automation](/azure/automation/overview)** | - Orchestrates repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment. </br> - Provides persistent shared assets including variables, connections, objects, which allows orchestration of complex jobs [Learn more](/azure/automation/automation-runbook-gallery). | - Schedule tasks for example – Stop dev/test VMs or services at night and turn on during day. </br>- Response to alerts such as system alerts, service alerts, high CPU/memory alerts, create ServiceNow tickets, etc. </br> - Hybrid automation where you can manage, automate on-premises servers like SQL server, Active Directory etc. </br> - Azure resource life-cycle management and governance which includes resource provisioning, deprovisioning, adding correct tags, locks, NSGs etc. | - IT admins, System admins, IT operations admins who are skilled at using PowerShell or Python based scripting. </br> - Infrastructure Admins managing on-prem infrastructure using scripts or executing long running jobs like month-end operations on servers running on-prem. |
|**Azure Automanage for machine configuration management** | A service that eliminates the need to discover, know how to onboard, and how to configure certain services in Azure that would benefit your virtual machine. [Learn more](/azure/automanage/automanage-virtual-machines#overview). |Replaces repetitive, day-to-day operational tasks with an exception-only management model, where a healthy, steady state of VM is equal to hands free management. </br></br> It supports Windows and Linux operating systems. </br></br> Provides VM best practices template for Dev/Test and Production workload. </br></br>It has a point and click onboarding portal experience. | The IT Admins/Infra Admins/IT Operations Admins who are responsible for managing server workload, day to day admin tasks like backup, disaster recovery, security updates, responding to security threats, etc. across Azure and on-premise. </br></br> Developers who do not wish to manage servers or spend the time on less priority tasks.


### Respond

**Services** | **Description** | **Features** | **Audience**
--- | --- |--- | --- |
  **Configuration Management** | Allows you to write, manage, and compile PowerShell Desired State Configuration (DSC) configurations for nodes in any cloud or on-premises datacenter. [Learn more](/azure/automation/automation-dsc-overview).| You can collect inventory & track changes in your environment. </br></br> By configuring the desired state of your machines, you can discover and correct configuration drift. |
  **Update Management** | Allows you to manage operating system updates for your Windows and Linux virtual machines in Azure, physical or VMs in on-premises environments, and in other cloud environments. [Learn more](/azure/automation/update-management/overview). | You can assess the compliance of servers and schedule the update installation. </br></br> You can know what is installed in your servers, detect and configure alerts on software services, file and registry changes on your various machines. </br></br> You can assess and install updates on your servers. </br></br> To stay compliant, you can configure the desired state of your servers.|
 **Azure Automation State Configuration** | Allows you to create, import and compile configurations, enable machines to manage, and view reports. [Learn more](/azure/automation/automation-dsc-getting-started).|
 **Azure Policy** | | You can apply policies for the audit settings inside servers including the machines running in Azure and Arc connected machines. </br></br>You can check for the harmful apps, protocols, and the installed applications – the certificates, admin privileges, health of agents and so on.</br></br>You can set Windows server as per Group policy baseline. | The Central IT/Infrastructure Admins/Auditors (Cloud custodian) who are working towards the regulatory requirements at scale,and ensure that end state of servers looks as desired. </br></br> The application teams validating compliance before releasing change.|
 **Azure Functions**  |  |Deliver event based automation where you can compute on demand to react to critical events. </br></br> Language choice so that you can write functions in a language of your choice such as C#, Java, JavaScript, PowerShell, or Python and focus on specific piece of code. </br></br> Orchestrate complex workflows through durable functions. </br></br> Set scheduled tasks such as set a pattern to stop and start a VM at a specific time, read blob storage content at regular intervals etc. </br></br> Process Azure alerts – you can send team’s event when the CPU activity spikes to 90%. | The Application Developers who are skilled in coding languages like C#, F#, PHP, Java, JavaScript, PowerShell, or Python. </br></br> Cloud Architects who build serverless Micro-services based applications.  


### Orchestrate

**Services** | **Description** | **Features** | **Audience**
--- | --- |--- | --- |
**Azure Logic Apps** | A cloud-based platform for creating and running automated workflows that integrate your apps, data, services, and systems. [Learn more](/azure/logic-apps/logic-apps-overview).| Build "Smart" Integrations between 1st party and 3rd party apps, services, and systems running across on-premises, hybrid, and cloud native. </br></br> Use managed connectors from a 450+ and growing Azure connectors ecosystem to use in your workflows. </br></br> Provide first-class support for enterprise integration and B2B scenarios.</br></br> Visually create and edit workflows with low Code/no code approach | The Pro integrators and developers, IT professionals who would want to use low code/no code option for Advanced integration scenarios to external systems or APIs.| 



