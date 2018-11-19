---
title: Governance of Azure DevTest Labs infrastructure
description: This article provides guidance for governance of Azure DevTest Labs infrastructure. 
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

# Governance of Azure DevTest Labs infrastructure - Company policy and compliance
This article provides guidance on governing company policy and compliance for Azure DevTest Labs infrastructure. 

## Public vs. private artifact repository

### Question
When should an organization use a public artifact repository vs. private artifact repository in DevTest Labs?

### Answer
The [public artifact repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts) provides an initial set of software packages that are most commonly used. It helps with rapid deployment without having to invest time to reproduce common developer tools and add-ins. You can choose to deploy their own private repository. You can use a public and a private repository in parallel. You may also choose to disable the public repository. The criteria to deploy a private repository should be driven by the following questions and considerations:

- Does the organization have a requirement to have corporate licensed software as part of their DevTest Labs offering? If the answer is yes, then a private repository should be created.
- Does the organization develop custom software that provides a specific operation, which is required as part of the overall provisioning process? If the answer is yes, then a private repository should be deployed.
- If organization's governance policy requires isolation, and external repositories are not under direct configuration management by the organization, a private artifact repository should be deployed. As part of this process, an initial copy of the public repository can be copied and integrated with the private repository. Then, the public repository can be disabled so that no one within the organization can access it anymore. This approach forces all users within the organization to have only a single repository that is approved by the organization and minimize configuration drift.

### Single repository or multiple repositories 

### Question
Should an organization plan for a single repository or allow multiple repositories?

### Answer
As part of your organization's overall governance and configuration management strategy, we recommend that you use a centralized repository. When you use multiple repositories, they may become silos of unmanaged software over the time. With a central repository, multiple teams can consume artifacts from this repository for their projects. It enforces standardization, security, ease of management, and eliminates the duplication of efforts. As part of the centralization, the following actions are recommended practices for long-term management and sustainability:

- Associate the Visual Studio Team Services with the same Azure Active Directory tenant that the Azure subscription is using for authentication and authorization.
- Create a group named **All DevTest Labs Developers** in Azure Active Directory that is centrally managed. Any developer who contributes to artifact development should be placed in this group.
- The same Azure Active Directory group can be used to provide access to the Visual Studio Team Services repository and to the lab.
- In Visual Studio Team Services, branching or forking should be used to a separate an in-development repository from the primary production repository. Content is only added to the master branch with a pull request after a proper code review. Once the code reviewer approves the change, a lead developer, who is responsible for maintenance of the master branch, merges the updated code. 

## Corporate security policies

### Question
How can an organization ensure corporate security policies are in place?

### Answer
An organization may achieve it by doing the following actions:

1. Developing and publishing a comprehensive security policy. The policy articulates the rules of acceptable use associated with the using software, cloud assets. It also defines what clearly violates the policy. 
2. Develop a custom image, custom artifacts, and a deployment process that allows for orchestration within the security realm that is defined with active directory. This approach enforces the corporate boundary and sets a common set of environmental controls. These controls against the environment a developer can consider as they develop and follow a secure development lifecycle as part of their overall process. The objective also is to provide an environment that is not overly restrictive that may hinder development, but a reasonable set of controls. The group policies at the organization unit (OU) that contains lab virtual machines could be a subset of the total group policies that are found in production. Alternatively, they can be an additional set to properly mitigate any identified risks.

## Data integrity

### Question
How can an organization ensure data integrity to ensure that remoting developers can't remove code or introduce malware or unapproved software?

### Answer
There are several layers of control to mitigate the threat from external consultants, contractors, or employees that are remoting in to collaborate in DevTest Labs. 

As stated previously, the first step must have an acceptable use policy drafted and defined that clearly outlines the consequences when someone violates the policy. 

The first layer of controls for remote access is to apply a remote access policy through a VPN connection that is not directly connected to the lab. 

The second layer of controls is to apply a set of group policy objects that prevent copy and paste through remote desktop. A network policy could be implemented to not allow outbound services from the environment such as FTP and RDP services out of the environment. User-defined routing could force all Azure network traffic back to on-premises, but the routing could not account for all URLs that might allow uploading of data unless controlled through a proxy to scan content and sessions. Public IPs could be restricted within the virtual network supporting DevTest Labs to not allow bridging of an external network resource.

Ultimately, the same type of restrictions needs to be applied across the organization, which would have to also account for all possible methods of removable media or external URLs that could accept a post of content. Consult with your security professional to review and implement a security policy. For more recommendations, see [Microsoft Cyber Security](https://www.microsoft.com/security/default.aspx?&WT.srch=1&wt.mc_id=AID623240_SEM_sNYnsZDs).


## Next steps
See [Application migration and integration](devtest-lab-guidance-governance-application-migration-integration.md).