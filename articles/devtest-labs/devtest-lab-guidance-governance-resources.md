---
title: Governance of Azure DevTest Labs infrastructure
description: This article addresses the alignment and management of resources for Azure DevTest Labs within your organization. 
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/15/2023
ms.reviewer: christianreddington,anthdela,juselph
ms.custom: UpdateFrequency2
---

# Governance of Azure DevTest Labs infrastructure
This article addresses the alignment and management of resources for DevTest Labs within your organization. 

## Resources
### Align DevTest Labs resources within an Azure subscription 

Before an organization begins to use Azure for general application development, IT planners should first review how to introduce the capability as part of their overall portfolio of services. Areas for review should address the following concerns:

- How to measure the cost associated with the application development lifecycle?
- How does the organization align the proposed service offering with the corporate security policy? 
- Is segmentation required to separate the development and production environments? 
- What controls are introduced for long term ease of management, stability, and growth?

The **first recommended practice** is to review organizations' Azure taxonomy where the divisions between production and development subscriptions are outlined. In the following diagram, the suggested taxonomy allows for a logical separation of development/testing and production environments. With this approach, an organization can introduce billing codes to track costs associated with each environment separately. For more information, see [Prescriptive subscription governance](/azure/architecture/cloud-adoption/appendix/azure-scaffold). Additionally, you can use [Azure tags](../azure-resource-manager/management/tag-resources.md) to organize resources for tracking and billing purposes.

The **second recommended practice** is to enable the DevTest subscription within the Azure Enterprise portal. It allows an organization to run client operating systems that aren't typically available in an Azure enterprise subscription. Then, use enterprise software where you pay only for the compute and don't worry about licensing. It ensures that the billing for designated services, including gallery images in IaaS such as Microsoft SQL Server, is based on consumption only. Details about the Azure DevTest subscription can be found [here](https://azure.microsoft.com/offers/ms-azr-0148p/) for Enterprise Agreement (EA) customers and [here](https://azure.microsoft.com/offers/ms-azr-0023p/) for Pay as you Go customers.

:::image type="content" source="media/devtest-lab-guidance-governance/resource-alignment-with-subscriptions.png" alt-text="Diagram showing how resources alignment with subscriptions.":::

This model provides an organization the flexibility to deploy Azure DevTest Labs at scale. An organization can support hundreds of labs for various business units with 100 to 1000 virtual machines running in parallel. It promotes the notion of a centralized enterprise lab solution that can share the same principles of configuration management and security controls.

This model also ensures that the organization doesn't exhaust their resource limits associated with their Azure subscription. For details about subscription and service limits, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md). The DevTest Labs provisioning process can consume large number of resource groups. You can request for limits to be increased through a support request in the Azure DevTest subscription. The resources within the production subscription aren't affected as the development subscription grows in use. For more information on scaling DevTest Labs, see [Scale quotas and limits in DevTest Labs](devtest-lab-scale-lab.md).

A common subscription level limit that needs to be accounted for is how the network IP range assignments are allocated to support both production and development subscriptions. These assignments should account for growth over time (assuming on-premises connectivity or another networking topology that requires the enterprise to manage their networking stack instead of defaulting to Azure’s implementation). The recommended practice is to have a few virtual networks that have a large IP address prefix assigned and divided with many large subnets rather than to have multiple virtual networks with small subnets. For example, with 10 subscriptions, you can define 10 virtual networks (one for each subscription). All labs that don’t require isolation can share the same subnet on the subscription’s virtual network.

### Number of users per lab and labs per organization

Business units and development groups that are associated with the same development project should be associated with the same lab. It allows for same types of policies, images, and shutdown policies to be applied to both groups. 

You may also need to consider geographic boundaries. For example, developers in the north east United States (US) may use a lab provisioned in East US2. And, developers in Dallas, Texas, and Denver, Colorado may be directed to use a resource in US South Central. If there's a collaborative effort with an external third party, they could be assigned to a lab that isn't used by internal developers. 

You may also use a lab for a specific project within Azure DevOps Projects. Then, you apply security through a specified Microsoft Entra group, which allows access to both set of resources. The virtual network assigned to the lab can be another boundary to consolidate users.

### Preventing the deletion of resources

Set permissions at the lab level so that only authorized users can delete resources or change lab policies. Developers should be placed within the **DevTest Labs Users** group. The lead developer or the infrastructure lead should be the **DevTest Labs Owner**. We recommend that you have only two lab owners. This policy extends towards the code repository to avoid corruption. Lab uses have rights to use resources but can't update lab policies. See the following article that lists the roles and rights that each built-in group has within a lab: [Add owners and users in Azure DevTest Labs](devtest-lab-add-devtest-user.md).

## Manage cost and ownership
Cost and ownership are primary concerns when you consider building your development and test environments. In this section, you find information that helps you optimize for cost and align ownership across your environment.

### Optimize for cost

Several built-in features of DevTest Labs help you optimize for cost. See [cost management, thresholds](devtest-lab-configure-cost-management.md) [,and policies](devtest-lab-set-lab-policy.md) articles to limit activities of your users. 

If you use DevTest Labs for development and test workloads, consider using the [Enterprise Dev/Test Subscription Benefit](https://azure.microsoft.com/offers/ms-azr-0148p/) that's part of your Enterprise Agreement. Or if you're a Pay as you Go customer, consider the [Pay-as-you go DevTest offer](https://azure.microsoft.com/offers/ms-azr-0023p/).

This approach provides several advantages:

- Special lower Dev/Test rates on Windows virtual machines, cloud services, HDInsight, App Service, and Logic Apps
- Great Enterprise Agreement (EA) rates on other Azure services
- Access to exclusive Dev/Test images in the Gallery, including Windows 8.1 and Windows 10
 
Only active Visual Studio subscribers (standard subscriptions, annual cloud subscriptions, and monthly cloud subscriptions) can use Azure resources running within an enterprise Dev/Test subscription. However, end users can access the application to provide feedback or do acceptance testing. You can use resources within this subscription only for developing and testing applications. There's no uptime guarantee.

If you decide to use the DevTest offer, use this benefit exclusively for development and testing your applications. Usage within the subscription doesn't carry a financially backed SLA, except for the use of Azure DevOps and HockeyApp.

### Define role-based access across your organization

Central IT should own only what's necessary, and enable the project and application teams to have the needed level of control. Typically, it means that central IT owns the subscription and handles core IT functions such as networking configurations. The set of **owners** for a subscription should be small. These owners can nominate other owners when there's a need, or apply subscription-level policies, for example “No Public IP”.

There may be a subset of users that require access across a subscription, such as Tier 1 or Tier 2 support. In this case, we recommend that you give these users the **contributor** access so that they can manage the resources, but not provide user access or adjust policies.

DevTest Labs resource owners should be close to the project or application team. These owners understand machine and software requirements. In most organizations, the owner of the DevTest Labs resource is the project or development lead. This owner can manage users and policies within the lab environment and can manage all virtual machines in the DevTest Labs environment.

Add project and application team members to the DevTest Labs Users role. These users can create virtual machines, in line with lab and subscription-level policies. Users can also manage their own virtual machines, but can't manage virtual machines that belong to other users.

For more information, see [Azure enterprise scaffold – prescriptive subscription governance](/azure/architecture/cloud-adoption/appendix/azure-scaffold).

## Company policy and compliance
This section provides guidance on governing company policy and compliance for Azure DevTest Labs infrastructure. 

### Public vs. private artifact repository

The [public artifact repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts) provides an initial set of software packages that are most commonly used. It helps with rapid deployment without having to invest time to reproduce common developer tools and add-ins. You can choose to deploy their own private repository. You can use a public and a private repository in parallel. You may also choose to disable the public repository. The criteria to deploy a private repository should be driven by the following questions and considerations:

- Does the organization have a requirement to have corporate licensed software as part of their DevTest Labs offering? If the answer is yes, then a private repository should be created.
- Does the organization develop custom software that provides a specific operation, which is required as part of the overall provisioning process? If the answer is yes, then a private repository should be deployed.
- If organization's governance policy requires isolation, and external repositories aren't under direct configuration management by the organization, a private artifact repository should be deployed. As part of this process, an initial copy of the public repository can be copied and integrated with the private repository. Then, the public repository can be disabled so that no one within the organization can access it anymore. This approach forces all users within the organization to have only a single repository that is approved by the organization and minimize configuration drift.

#### Single repository or multiple repositories 

As part of your organization's overall governance and configuration management strategy, we recommend that you use a centralized repository. When you use multiple repositories, they may become silos of unmanaged software over the time. With a central repository, multiple teams can consume artifacts from this repository for their projects. It enforces standardization, security, ease of management, and eliminates the duplication of efforts. As part of the centralization, the following actions are recommended practices for long-term management and sustainability:

- Associate the Azure Repos with the same Microsoft Entra tenant that the Azure subscription is using for authentication and authorization.
- Create a group named **All DevTest Labs Developers** in Microsoft Entra ID that is centrally managed. Any developer who contributes to artifact development should be placed in this group.
- The same Microsoft Entra group can be used to provide access to the Azure Repos repository and to the lab.
- In Azure Repos, branching or forking should be used to a separate an in-development repository from the primary production repository. Content is only added to the main branch with a pull request after a proper code review. Once the code reviewer approves the change, a lead developer, who is responsible for maintenance of the main branch, merges the updated code. 

### Corporate security policies

An organization may apply corporate security policies by:

- Developing and publishing a comprehensive security policy. The policy articulates the rules of acceptable use associated with the using software, cloud assets. It also defines what clearly violates the policy. 
- Developing a custom image, custom artifacts, and a deployment process that allows for orchestration within the security realm that is defined with active directory. This approach enforces the corporate boundary and sets a common set of environmental controls. These controls against the environment a developer can consider as they develop and follow a secure development lifecycle as part of their overall process. The objective also is to provide an environment that isn't overly restrictive that may hinder development, but a reasonable set of controls. The group policies at the organization unit (OU) that contains lab virtual machines could be a subset of the total group policies that are found in production. Alternatively, they can be another set to properly mitigate any identified risks.

### Data integrity

An organization can ensure data integrity to ensure that remoting developers can't remove code or introduce malware or unapproved software. There are several layers of control to mitigate the threat from external consultants, contractors, or employees remoting in to collaborate in DevTest Labs. 

As stated previously, the first step must have an acceptable use policy drafted and defined that clearly outlines the consequences when someone violates the policy. 

The first layer of controls for remote access is to apply a remote access policy through a VPN connection that isn't directly connected to the lab. 

The second layer of controls is to apply a set of group policy objects that prevent copy and paste through remote desktop. A network policy could be implemented to not allow outbound services from the environment such as FTP and RDP services out of the environment. User-defined routing could force all Azure network traffic back to on-premises, but the routing couldn't account for all URLs that might allow uploading of data unless controlled through a proxy to scan content and sessions. Public IPs could be restricted within the virtual network supporting DevTest Labs to not allow bridging of an external network resource.

Ultimately, the same type of restrictions needs to be applied across the organization, which would have to also account for all possible methods of removable media or external URLs that could accept a post of content. Consult with your security professional to review and implement a security policy. For more recommendations, see [Microsoft Cyber Security](https://www.microsoft.com/security/default.aspx?&WT.srch=1&wt.mc_id=AID623240_SEM_sNYnsZDs).

## Application migration and integration
Once your development/test lab environment has been established, you need to think about the following questions:

- How do you use the environment within your project team?
- How do you ensure that you follow any required organizational policies, and maintain the agility to add value to your application?

### Azure Marketplace images vs. custom images

Azure Marketplace should be used by default unless you have specific concerns or organizational requirements. Some common examples include;

- Complex software setup that requires an application to be included as part of the base image.
- Installation and setup of an application could take many hours, which aren't an efficient use of compute time to be added on an Azure Marketplace image.
- Developers and testers require access to a virtual machine quickly, and want to minimize the setup time of a new virtual machine.
- Compliance or regulatory conditions (for example, security policies) that must be in place for all machines.

Consider using custom images carefully. Custom images introduce extra complexity, as you now have to manage VHD files for those underlying base images. You also need to routinely patch those base images with software updates. These updates include new operating system (OS) updates, and any updates or configuration changes needed for the software package itself.

### Formula vs. custom image

Typically, the deciding factor in this scenario is cost and reuse.

You can reduce cost by creating a custom image if:
- Many users or labs require the image.
- The required image has a lot of software on top of the base image.

This solution means that you create the image once. A custom image reduces the setup time of the virtual machine. You don't incur costs from running the virtual machine during setup.

Another factor is the frequency of changes to your software package. If you run daily builds and require that software to be on your users' virtual machines, consider using a formula instead of a custom image.

### Patterns to set up network configuration

When you ensure that development and test virtual machines are unable to reach the public internet There are two aspects to consider – inbound and outbound traffic.

**Inbound traffic** – If the virtual machine doesn't have a public IP address, then the internet can't reach it. A common approach is to set a subscription-level policy that no user can create a public IP address.

**Outbound traffic** – If you want to prevent virtual machines from going directly to the public internet, and force traffic through a corporate firewall, you can route traffic on-premises via Azure ExpressRoute or VPN, by using forced routing.

> [!NOTE]
> If you have a proxy server that blocks traffic without proxy settings, do not forget to add exceptions to the lab’s artifact storage account, .

You could also use network security groups for virtual machines or subnets. This step adds another layer of protection to allow or block traffic.

### New vs. existing virtual network

If your VMs need to interact with existing infrastructure, you should consider using an existing virtual network inside your DevTest Labs environment. If you use ExpressRoute, minimize the number of virtual networks and subnets so you don't fragment the IP address space assigned to your subscriptions. Also consider using the virtual network peering pattern here (Hub-Spoke model). This approach enables virtual network and subnet communication across subscriptions within a given region.

Each DevTest Labs environment could have its own virtual network, but there are [limits](../azure-resource-manager/management/azure-subscription-service-limits.md) on the number of virtual networks per subscription. The default amount is 50, though this limit can be raised to 100.

### Shared, public, or private IP

If you use a site-to-site VPN or Express Route, consider using private IPs so that your machines are accessible via your internal network, and inaccessible over public internet.

> [!NOTE]
> Lab owners can change this subnet policy to ensure that no one accidentally creates public IP addresses for their VMs. The subscription owner should create a subscription policy preventing public IPs from being created.

When using shared public IPs, the virtual machines in a lab share a public IP address. This approach can be helpful when you need to avoid breaching the limits on public IP addresses for a given subscription.

### Lab limits

There are several lab limits that you should be aware of. These limits are described in the following sections.
#### Limits of labs per subscription

There isn't a specific limit on the number of labs that can be created per subscription. However, the amount of resources used per subscription is limited. You can read about the [limits and quotas for Azure subscriptions](../azure-resource-manager/management/azure-subscription-service-limits.md) and [how to increase these limits](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests).
          
#### Limits of VMs per lab          
 
There's no specific limit on the number of VMs that can be created per lab. However, the resources (VM cores, public IP addresses, and so on) that are used are limited per subscription. You can read about the [limits and quotas for Azure subscriptions](../azure-resource-manager/management/azure-subscription-service-limits.md) and [how to increase these limits](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests).
          
#### Limits of number of virtual machines per user or lab

When you consider the number of virtual machines per user or per lab, there are three main concerns:

- The **overall cost** that the team can spend on resources in the lab. It’s easy to spin up many machines. To control costs, one mechanism is to limit the number of VMs per user or per lab
- The total number of virtual machines in a lab is impacted by the [subscription level quotas](../azure-resource-manager/management/azure-subscription-service-limits.md) available. One of the upper limits is 800 resource groups per subscription. DevTest Labs currently creates a new resource group for each VM (unless shared public IPs are used). If there are 10 labs in a subscription, labs could fit approximately 79 virtual machines in each lab (800 upper limit – 10 resource groups for the 10 labs themselves) = 79 virtual machines per lab.
- If the lab is connected to on-premises via Express Route (for example), there are **defined IP address spaces available** for the VNet/Subnet. To ensure that VMs in the lab don't fail to be created (error: can’t get IP address), lab owners can specify the max VMs per lab aligned with the IP address space available.

### Use Resource Manager templates

Deploy your Resource Manager templates by using the steps in [Use Azure DevTest Labs for test environments](devtest-lab-test-env.md). Basically, you check your Resource Manager templates into an Azure Repos or GitHub Git repository, and add a [private repository for your templates](devtest-lab-test-env.md) to the lab.

This scenario may not be useful if you're using DevTest Labs to host development machines. Use this scenario to build a staging environment that's representative of production.

The number of virtual machines per lab or per user option only limits the number of machines natively created in the lab itself. This option doesn't limit creation by any environments with Resource Manager templates.
