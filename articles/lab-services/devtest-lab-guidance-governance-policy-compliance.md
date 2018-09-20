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
ms.date: 09/11/2018
ms.author: spelluru

---

# Governance of Azure DevTest Labs infrastructure - Company policy and compliance

## Public vs. private artifact repository

### Question
When should an organization use the public artifact repository in DevTest Labs and when should a new private artifact repository be created?

### Answer
The public artifact repository that is provided with DevTest Labs provide a rich source of content to help organizations have an initial common set of software packages for rapid deployment and consumption without having to invest time to reproduce common developer tools and “add ins”. An organization can choose to deploy their own private repository. A public and private repository can be used in parallel or an organization may choose to disable the public repository. The criteria to deploy a private repository should be driven by the following questions and considerations:

- Does the organization have a requirement to have corporate licensed software as part of their DevTest Labs offering? If the answer is yes, then a private repository should be created.
- Is the organization developing custom software as part of their application development that provides a specific operation and is required as part of the overall provisioning process? If the answer is yes, then a private repository should be deployed.
- If the organization has developed a governance policy where isolation is required, and external repositories are not under direct configuration management by the organization then a private artifact repository should be deployed. As part of this process an initial copy of the public repository can be copied and integrated with the private repository and the public repository can be disabled so that no one within the organization can access it anymore. This approach forces all users within the organization to have only a single repository that is approved by the organization and minimize configuration drift.

### Single repository or multiple repositories 

### Question
Should an organization plan for a single repository or allow multiple repositories?

### Answer
As part of an organizations overall governance and configuration management strategy the elimination of multiple repositories that may become silos of unmanaged software overtime is advisable as a recommended practice. A central repository where multiple teams may be able to consume for their projects is highly advisable to enforce standardization, security, ease of management, and eliminates the duplication of efforts. As part of the centralization the following are recommended practices for long-term management and sustainability:

- Associate the Visual Studio Team Services with the same Azure Active Directory Tenant that the Azure subscription is using for authentication and authorization.
- Create a “All DevTest Labs Developers” group in Azure Active Directory that is centrally managed. Any developer that is contributing to artifact development should be placed within this group.
- The same “All DevTest Labs Developers” Azure Active Directory group can be used to provide access to the Visual Studio Team Services repository and to the lab.
- In Visual Studio Team Services branching or forking should be used to a separate “in development” repository from the primary production repository. Content is only added to the master branch with a pull request after proper code review. Once the code reviewer has approved the change, the updated content gets merged with the master branch by a lead developer tasked with the maintenance of the master branch.

## Corporate security policies

### Question
How can an organization ensure corporate security policies are in place?

### Answer
An organization may achieve it by first developing and publishing a comprehensive security policy where it articulates the rules of acceptable use associated with the using software, cloud assets, and what clearly violates the policy. The second action that an organization is to develop a custom image, custom artifacts, and a deployment process that allows for orchestration within the security realm that is defined with active directory. This approach enforces the corporate boundary and sets a common set of environmental controls. These controls against the environment a developer can consider as they develop and follow a Secure Development Lifecycle (SDL) as part of their overall process. The objective also should provide an environment that is not overly restrictive that may hinder development, but a reasonable set of controls. The group policies that are targeted against the organization unit (OU) that contains the DevTest Labs virtual machines systems could be a subset of the total group policies that are found in production or an additional set to properly mitigate any identified risks.

## Data integrity

### Question
How can an organization ensure data integrity (DLP) if a developer is remoting in and ensure that they are not removing code (IP) out or introducing malware or unapproved software?

### Answer
There are several layers of control on how this issue can be addressed to mitigate the threat from external consultants, contractors, or employees that are remoting in to collaborate in DevTest Labs. As stated previously the first step must have an acceptable use policy drafted and defined that clearly outlines the consequences when someone violates the policy. Although controls can be implemented to restrict theft within an organization. The first layer of controls for remote access is to apply a remote access policy through a VPN connection that is not directly connected to the lab. The second set of controls would be to apply a set of group policy objects that prevent copy and paste through remote desktop. A network policy could be implemented to not allow outbound services from the environment such as FTP and RDP services out of the environment. User-defined routing could force all Azure network traffic back to on-premises, but this could not account for all URLs that might allow uploading of data unless controlled through a proxy to scan content and sessions. Public IPs could be restricted within the Virtual Network supporting the DevTest Labs to not allow bridging of an external network resource.

Ultimately the same type of restrictions would have to be applied across the organization, which would have to also account for all possible methods of removable media or external URLs that could accept a post of content. Consult with your security professional to review and implement a security policy. Also consult the following site for follow-up recommendations: [Microsoft Cyber Security](https://www.microsoft.com/security/default.aspx?&WT.srch=1&wt.mc_id=AID623240_SEM_sNYnsZDs).


### Next steps
See [Application migration and integration](devtest-lab-create-environment-from-arm.md).