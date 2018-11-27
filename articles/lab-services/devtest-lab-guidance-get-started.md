---
title: Get started with using Azure DevTest Labs
description: This article provides the primary scnearios for using Azure DevTest Labs and two general paths to start using the service in your organization. 
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/03/2018
ms.author: spelluru

---

# Get started with using Azure DevTest Labs
Once you decide to explore DevTest Labs, there are two general paths forward – Proof of Concept vs Scaled Deployment. 

A **scaled deployment** consists of weeks/months of reviewing and planning with an intent of deploying DevTest Labs to the entire enterprise that has hundreds or thousands of developers. 

A **proof of concept deployment** focuses on a concentrated effort from a single team to establish organizational value. While it can be tempting to think of a scaled deployment, the approach tends to fail more often than the proof of concept option. Therefore, we recommend that you start small, learn from the first team, repeat the same approach with two to three additional teams, and then plan for a scaled deployment based on the knowledge gained. For a successful proof of concept, we recommend that you pick one or two teams, and identify their scenarios (dev environment vs test environments), document their current use cases, and deploy DevTest Labs. 

## Scenarios
There are three primary scenarios for a DevTest Labs implementation: 

- Developer desktops
- Test environments
- Labs/training/hackathon

## Developer desktops
Developers often have different requirements for development machines for different projects. With DevTest Labs, developers can have access to on-demand VMs that are pre-configured to suit their most common scenarios. DevTest Labs provides the following benefits:

- Organizations can provide common development and testing environments ensuring consistency across teams
- Developers can quickly provision their development machines on demand
- Developers can provision resources in a self-service way without needing subscription-level permissions
- IT or admins can pre-define the networking topology and developers can directly leverage it in a simple and intuitive way without requiring any special access
- Developers can easily customize their development machines as needed
- Administrators can control costs by ensuring that:
    - Developers cannot get more VMs than they need for development
    - VMs are shut down when not in use
    - Only allowing a subset of VM instance sizes for the specific workloads

## Test environments
Creating and managing test environments across an enterprise can require a significant effort. With DevTest Labs, test environments can be easily created, updated, or duplicated, which allows teams to access a fully configured environment when it’s needed. In this scenario, DevTest Labs provides the following benefits:

- Testers can test the latest version of their application by quickly provisioning Windows and Linux environments by using reusable templates and artifacts.
- Testers can scale up their load testing by provisioning multiple test agents
- Admins can connect the lab to VSTS to enable DevOps scenarios
- Administrators can control costs by ensuring that:
    - Testers cannot get more VMs than they need
    - VMs are shut down when not in use
    - Only allowing a subset of VM instance sizes for the specific workloads

## Labs, workshops, trainings, and hackathons  
A lab in Azure DevTest Labs acts as a great container for transient activities like workshops, hands-on labs, training, or hackathons. The service allows you to create a lab where you can provide custom templates that each trainee can use to create identical and isolated environments for training. You can apply policies to ensure that training environments are available to each trainee only when they need them and contain enough resources - such as virtual machines - required for the training. Finally, you can easily share the lab with trainees, which they can access in one click. After the class has concluded, it’s easy to delete the lab and all the related resources.


## Next steps
See the next article in this series: [Scale up your DevTest Labs deployment](devtest-lab-guidance-scale.md)
