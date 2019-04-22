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
ms.date: 02/11/2019
ms.author: spelluru
ms.reviewer: christianreddington,anthdela,juselph

---

# Governance of Azure DevTest Labs infrastructure - Resources
This article addresses the alignment and management of resources for DevTest Labs within your organization. 

## Align within an Azure subscription 

### Question
How do I align DevTest Labs resources within an Azure subscription?

### Answer
Before an organization begins to use Azure for general application development, IT planners should first review how to introduce the capability as part of their overall portfolio of services. Areas for review should address the following concerns:

- How to measure the cost associated with the application development lifecycle?
- How does the organization align the proposed service offering with the corporate security policy? 
- Is segmentation required to separate the development and production environments? 
- What controls are introduced for long term ease of management, stability, and growth?

The **first recommended practice** is to review organizations' Azure taxonomy where the divisions between production and development subscriptions are outlined. In the following diagram, the suggested taxonomy allows for a logical separation of development/testing and production environments. With this approach, an organization can introduce billing codes to track costs associated with each environment separately. For more information, see [Prescriptive subscription governance](/azure/architecture/cloud-adoption/appendix/azure-scaffold). Additionally, you can use [Azure tags](../azure-resource-manager/resource-group-using-tags.md) to organize resources for tracking and billing purposes.

The **second recommended practice** is to enable the DevTest subscription within the Azure Enterprise portal. It allows an organization to run client operating systems that are not typically available in an Azure enterprise subscription. Then, use enterprise software where you pay only for the compute and not don't worry about licensing. It ensures that the billing for designated services, including gallery images in IaaS such as Microsoft SQL Server, is based on consumption only. Details about the Azure DevTest subscription can be found [here](https://azure.microsoft.com/offers/ms-azr-0148p/) for Enterprise Agreement (EA) customers and [here](https://azure.microsoft.com/offers/ms-azr-0023p/) for Pay as you Go customers.

![Resource alignment with subscriptions](./media/devtest-lab-guidance-governance/resource-alignment-with-subscriptions.png)

This model provides an organization the flexibility to deploy Azure DevTest Labs at scale. An organization can support hundreds of labs for various business units with 100 to 1000 virtual machines running in parallel. It promotes the notion of a centralized enterprise lab solution that can share the same principles of configuration management and security controls.

This model also ensures that the organization does not exhaust their resource limits associated with their Azure subscription. For details about subscription and service limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md). The DevTest Labs provisioning process can consume large number of resource groups. You can request for limits to be increased through a support request in the Azure DevTest subscription. The resources within the production subscription are not affected as the development subscription grows in use. For more information on scaling DevTest Labs, see [Scale quotas and limits in DevTest Labs](devtest-lab-scale-lab.md).

A common subscription level limit that needs to be accounted for is how the network IP range assignments are allocated to support both production and development subscriptions. These assignments should account for growth over time (assuming on-premises connectivity or another networking topology that requires the enterprise to manage their networking stack instead of defaulting to Azure’s implementation). The recommended practice is to have a few virtual networks that have a large IP address prefix assigned and divided with many large subnets rather than to have multiple virtual networks with small subnets. For example, with 10 subscriptions, you can define 10 virtual networks (one for each subscription). All labs that don’t require isolation can share the same subnet on the subscription’s vnet.

## Maintain naming conventions

### Question
How do I maintain a naming convention across my DevTest Labs environment?

### Answer
You may want to extend current enterprise naming conventions to Azure operations and make them consistent across the DevTest Labs environment.

When deploying DevTest Labs, we recommend that you have specific starting policies. You deploy these policies by a central script and JSON templates to enforce consistency. Naming policies can be implemented through Azure policies applied at the subscription level. For JSON samples for Azure Policy, see [Azure Policy samples](../governance/policy/samples/index.md).

## Number of users per lab and labs per organization

### Question 
How do I determine the ratio of users per lab and the overall number of labs needed across an organization?

### Answer
We recommend that business units and development groups that are associated with the same development project are associated with the same lab. It allows for same types of policies, images, and shutdown policies to be applied to both groups. 

You may also need to consider geographic boundaries. For example, developers in the north east United States (US) may use a lab provisioned in East US2. And, developers in Dallas, Texas, and Denver, Colorado may be directed to use a resource in US South Central. If there is a collaborative effort with an external third party, they could be assigned to a lab that is not used by internal developers. 

You may also use a lab for a specific project within Azure DevOps projects. Then, you apply security through a specified Azure Active Directory group, which allows access to both set of resources. The virtual network assigned to the lab can be another boundary to consolidate users.

## Deletion of resources

### Question
How can we prevent the deletion of resources within a lab?

### Answer
We recommend that you set proper permissions at the lab level so that only authorized users can delete resources or change lab policies. Developers should be placed within the **DevTest Labs Users** group. The lead developer or the infrastructure lead should be the **DevTest Labs Owner**. We recommend that you have only two lab owners. This policy extends towards the code repository to avoid corruption. Lab uses have rights to use resources but cannot update lab policies. See the following article that lists the roles and rights that each built-in group has within a lab: [Add owners and users in Azure DevTest Labs](devtest-lab-add-devtest-user.md).

## Move lab to another resource group 

### Question
Is it supported to move a lab into another Resource Group?

### Answer
Yes. Navigate to the Resource Group page from the home page for your lab. Then, select **Move** on the toolbar, and select the lab you want to move to a different resource group. When you create a lab, a resource group is automatically created for you. However, you may want to move the lab to a different resource group that follows the enterprise naming conventions. 

## Next steps
See [Manage cost and ownership](devtest-lab-guidance-governance-cost-ownership.md).
