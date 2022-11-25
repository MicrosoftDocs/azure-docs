---
title: What is Microsoft Dev Box Preview?
titleSuffix: Microsoft Dev Box Preview
description: Microsoft Dev Box Preview gives you self-service access to high-performance, preconfigured, and ready-to-code cloud-based workstations.
services: dev-box
ms.service: dev-box
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 10/12/2022
adobe-target: true
---

# What is Microsoft Dev Box Preview?

Microsoft Dev Box gives you self-service access to high-performance, preconfigured, and ready-to-code cloud-based workstations called dev boxes. You can set up dev boxes with the tools, source code, and pre-built binaries specific to your project, so you can immediately start work. Whether you’re a developer, tester, or QA professional, you can use dev boxes in your day-to-day workflows. 

The Dev Box service was designed with three distinct personas in mind: dev infra admins, project admins, and dev box users. 

Dev infra admins are responsible for providing developer infrastructure and tools to the dev teams. Dev infra admins create and manage dev centers, which represent the units of organization within an enterprise. Any user with sufficient permissions on the subscription or resource group can create a dev center. Dev infra admins create projects and define the images that are used to create dev boxes. Dev box image definitions can use any developer IDE, SDK, or internal tool that runs on Windows. 

Project admins are experienced developers with in depth knowledge of their projects who can assist with day-to-day administrative tasks. Project admins create and manage dev box pools, enabling developers in different regions to self-serve dev boxes. 

Dev box users are members of a development team. They can self-serve one or more dev boxes on demand from a set of dev box pools that have been enabled for the project. Dev box users can work on multiple projects or tasks by creating multiple dev boxes.  

Microsoft Dev Box bridges the gap between development teams and IT, bringing control of project resources closer to the development team. 

## Key capabilities
### For development teams
- **Get started quickly** 
    - Create multiple dev boxes from a predefined pool whenever you need them and delete them when you're done. 
    - Use separate dev boxes for separate projects or tasks. 
- **Use multiple dev boxes to isolate and parallelize work** 
    - Tasks that take considerable time, like a full rebuild before submitting a PR can run in the background while you use a different dev box to start the next task. 
    - Safely test changes in your code, or make significant edits without affecting your primary workspace.
- **Access from anywhere** 
    - Dev boxes can be accessed from any device and from any OS. Use a web browser while on the road or remote desktop from your Windows, Mac, or Linux desktop. 

### For dev managers
- **Use dev box pools to separate workloads** 
    - Create dev box pools, add appropriate dev box definitions, and assign access for only dev box users working on those specific projects. 
    - Each pool brings together a SKU, an image, and a network configuration that automatically joins the dev box to your native Azure Active Directory (Azure AD) or Active Directory domain. This combination gives teams flexibility to define specific development environments for any scenario.
- **Control costs**
    - Dev Box brings cost control within the reach of project admins. 
- **Team scenarios**
    - Create dev boxes for various roles on a team. Standard dev boxes might be configured with admin rights, giving full-time developers greater control, while more restricted permissions are applied for contractors.

### For dev infrastructure admins
- **Configure dev centers**
    - Create dev centers and define the SKUs and images that the development teams use to self-serve dev boxes. 
- **Configure the network connection**
    - Define the network configuration that the development teams consume. The network connection defines the region where the dev box is created.
- **Manage projects**
    - Grant access to the development team so that they can self-serve dev boxes.

### For IT admins 
- **Manage Dev Boxes like any other device**
    - Dev boxes are automatically enrolled in Intune. Use Microsoft Endpoint Manager Portal to manage the dev boxes just like any other device on your network.  
    - Keep all Windows devices up to date by using Intune’s expedited quality updates to deploy zero-day patches across your organization. 
    - If a dev box is compromised, you can isolate it while helping the dev box user get back up and running on a new dev box.
- **Provide secure access in a secure environment**
    - Access controls in Azure AD enable you to organize access by project or user type. You can automatically:
        - Join dev boxes natively to an Azure AD or Active Directory domain.
        - Set conditional access policies that require users to connect via a compliant device.
        - Require multi-factor authentication (MFA) sign-in.
        - Configure risk-based sign-in policies for Dev Boxes that access sensitive source code and customer data.    


## Next steps

Start using Microsoft Dev Box:
- [Quickstart: Configure the Microsoft Dev Box Preview service](./quickstart-configure-dev-box-service.md)
- [Quickstart: Configure a Microsoft Dev Box Preview project](./quickstart-configure-dev-box-project.md)
- [Quickstart: Create a Dev Box](./quickstart-create-dev-box.md)
