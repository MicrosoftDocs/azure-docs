---
title: Automation Services
description: Automation scenarios in Azure and related services
services: automation
ms.subservice: 
ms.topic: overview
ms.date: 1/17/2022
ms.custom: references_regions
---

# Automation Services Overview

![Automation scenarios in Azure and related services](automation-services.png)

## Infrastructure as code - ARM/BICEP

### Capabilities

- Simple declarative language to provision infrastructure on Azure.
- Leverage ARM template knowledge and investments.
- Use simple syntax without JSON. 
- Abstract common blocks of configuration into reusable elements.
- Open Source: Transparency and community.
- Integration with Policy as Code, Azure Blueprints.

### Usage scenarios

- Create, manage, and update infrastructure resources such as virtual machines, networks, storage account, containers etc., deploy apps, add tags, assign policies, assign role-based access control all declaratively as code integrated with your CI/CD tools.  
- Manage multiple environments like production, non-prod & disaster recovery.
- Deploy resources consistently and reliably  at scale.

### Target audience

An Application Developer/Infrastructure Admin/DevOps Engineer using Azure for the first time or using Azure as their primary cloud. 

## Azure Automation

### Capabilities

**Process Automation** - Orchestrate repetitive processes using graphical, PowerShell, and Python runbooks in the cloud or hybrid environment. 

### Usage scenarios

**Scenario** | **Task**
--- | ---
**Scheduled tasks** | For example: Stop dev/test VMs or services at night and turn on during the day.
**Responding to alerts** | System alerts, service alerts, high CPU/memory alerts, create ServiceNow tickets, etc.
**Hybrid Automation** | Managing/automating on-prem services and servers like SQL server, Active Directory, etc.
**Azure resource lifecycle management & Governance** | Resource provisioning and deprovisioning, adding correct tags, locks, NSGs, etc.

### Target audience

- IT Admins/System Admin/IT Operations Admin skilled at using PowerShell or Python-based scripting. 
- Infrastructure Admins managing on-prem infrastructure using scripts or executing long running jobs like month-end operations on servers running on-prem.

## Azure Automation based in-guest management

### Capabilities

- **Configuration Management**
    - Collect inventory & Track changes in your environment.
    - Configure desired state of your machines and discover/correct configuration drift.

- **Update Management**
    - Assess compliance of servers.
    - Schedule update installation.

### Usage scenarios

- Detect and alert on software, services, file & registry changes to your machines and know what is installed in your servers. 
- **Patch management** - Assess and install updates on your servers.
- Configure desired state of your servers and ensure they stay compliant. 

## Azure Policy based in-guest management

### Capabilities

- Next iteration of Azure Automation State Configuration.
- Apply policies to audit settings inside servers - The Azure Policy can audit settings inside a machine, both for machines running in Azure and Arc Connected Machines for information such as:
    - What is installed, check for harmful apps, protocols
    - Certificates, admin privileges, health of agents
    - Customer-authored content


### Usage scenarios

- Get compliance data that may include: 

    - The configuration of the operating system - files, registry, services, etc. 
    - Application configuration or presence.
    - Check environment settings.
    - Set Windows server as per Group Policy baseline.

### Target audience

- Central IT/Infrastructure Admins/Auditors(Cloud custodian) looking for regulatory requirements at scale, and ensuring end state of servers looks as desired. 
- Application teams validating compliance before releasing change.

## Azure Functions

### Capabilities

- **Deliver event-based automation** - "Compute on demand" to react to critical events. 
- Focus on the pieces of code that matter most to you and write functions in a language of your choice like C#, Java, JavaScript, PowerShell, or Python. 
- Durable Functions to orchestrate complex workflows. 


### Usage scenarios

- Respond to events on resources such as adding tags to resource group basis cost centre when a VM is deleted.
- **Scheduled tasks** - Patterns like stopping a VM at night and starting it in the morning, reading Blob Storage content at regular intervals, etc.
- **Process Azure alerts** - Patterns like sending a team's event when the CPU activity spikes to 90%. 
- Orchestrate with external systems such as M365.

### Target audience

- Application Developers skilled in coding languages like C#, F#, PHP, Java, JavaScript, PowerShell, or Python. 
- Cloud Architects building serverless Microservices based applications.

## Azure Logic Apps

### Capabilities

- Build "Smart" Integrations between 1st party and 3rd party apps, services, and systems running across on-premises, hybrid, and cloud native.
- Use managed connectors from a 450+ and growing Azure connectors ecosystem to use in your workflows.
- First-class support for enterprise integration and B2B scenarios.
- Visually create and edit workflows - Low Code/no code approach.
 
### Usage scenarios

- Schedule and send email notifications using Office 365 when a specific event happens, for example, when a new file is uploaded.
- Route and process customer orders across on-premises systems and cloud services.
- Move uploaded files from an SFTP or FTP server to Azure Storage.
- Monitor tweets, analyze the sentiment, and create alerts or tasks for items that need review.


### Target audience

- Pro integrators and developers, IT pros who would want to use low code/no code option for Advanced integration scenarios to external systems or APIs.


## Azure Automanage

### Capabilities

- Azure Automanage replaces repetitive, day-to-day operational tasks with an exception-only management model, where a healthy, steady state of VM is equal to hands free management.
- Linux and Windows supported
- VM Best practices template for Dev/Test and Production workload.
- Point-and-click onboarding portal experience

### Usage scenarios

- Automatically configures guest operating system according to Microsoft baseline configuration.
- Automatically detect for drift and corrects for it across a VM's entire lifecycle.


### Target audience

- IT Admins/Infra Admins/IT Operations Admin responsible for managing server workload, day to day admin tasks like backup, disaster recovery, security updates, responding to security threats, etc. across Azure and on-prem. 
- Developers who do not want to manage servers or spend their time on menial tasks.

