---
title: Lab Services administrator guide
description: This guide helps administrators who create and manage lab plans by using Azure Lab Services. 
ms.topic: how-to
ms.date: 08/28/2023
ms.custom: devdivchpfy22
---

# Azure Lab Services - Administrator guide

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

> [!NOTE]
> If you're still using lab accounts, see [Administrator guide when using lab accounts](administrator-guide-1.md).

Information technology (IT) administrators who manage a university's cloud resources are ordinarily responsible for setting up the lab plan for their school. After they have set up a lab plan, administrators or educators create the labs that are associated with the lab plan. This article provides a high-level overview of the Azure resources that are involved and the guidance for creating them.

Depending on the settings for creating a lab plan, some resources are either hosted in your subscription or in a subscription managed by Azure Lab Services.

- Lab VMs are hosted in an Azure subscription that is owned by Azure Lab Services.
- Lab plans, labs, compute galleries, and image versions and are hosted within your subscription.
- If using advanced networking, the virtual network and network-related resources for lab VMs are hosted within your subscription. Otherwise, the virtual network is hosted in a subscription managed by Azure Lab Services.
- You can have your lab plans, labs, and the compute galleries in the same or different resource group.

For more information about the architecture, see [Labs architecture fundamentals](./classroom-labs-fundamentals.md).

## Subscription

Your university might have one or more Azure subscriptions. You use subscriptions to manage billing and security for all Azure resources and services that are used within it, including lab plans and labs.

The relationship between a lab plan and its subscription is important because:

- Billing is reported through the subscription that contains the lab plan.
- You can grant users in the subscription's Microsoft Entra tenant the ability to manage Azure Lab Services lab plans and labs. You can add someone as a lab plan owner, lab plan contributor, lab creator, or lab owner. For more information about built-in RBAC roles, see [Manage identity](#rbac-roles).

Labs virtual machines (VMs) are managed and hosted for you within a subscription that is owned by Azure Lab Services.

## Resource group

A subscription contains one or more resource groups. Resource groups are used to create logical groupings of Azure resources that are used together within the same solution.  

When you create a lab plan, you must configure the resource group that contains the lab plan. Name your resource group carefully.  Labs are grouped by resource group name in the Lab Services web portal: [https://labs.azure.com](https://labs.azure.com).

A resource group is also required when you create an [Azure Compute Gallery](#azure-compute-gallery). You can place your lab plan and compute gallery in the same resource group or in two separate resource groups. You might want to take this second approach if you plan to share the compute gallery across various solutions.

We recommend that you invest time up front to plan the structure of your resource groups.  It's *not* possible to change a lab plan or compute gallery resource group once it's created. If you need to change the resource group for these resources, you need to delete and re-create them.

## Lab plan

A lab plan set of configurations that influence the creation of a lab.  A lab plan can be associated with zero or more labs. When you're getting started with Azure Lab Services, it's most common to have a single lab plan. As your lab usage scales up, you can choose to create more lab plans later.

The following list highlights scenarios where more than one lab plan might be beneficial:

- **Manage different policy requirements across labs**

  When you create a lab plan, you set policies that apply to all newly created labs, such as:

  - The Azure virtual network with shared resources that the lab can access. For example, you might have a set of labs that need access to a license server within a virtual network.
  - The virtual machine images that the labs can use to create VMs. For example, you might have a set of labs that need access to the [Data Science VM for Linux](https://azuremarketplace.microsoft.com/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux) Azure Marketplace image.

  If each of your labs has unique policy requirements, it might be beneficial to create separate lab plans for managing each lab separately.

- **Isolate pilot labs from active or production labs**
  
  You might have cases where you want to pilot policy changes for a lab plan without potentially affecting your active labs. In this type of scenario, creating a separate lab plan for piloting purposes allows you to isolate changes.

## Lab

A lab contains VMs that are each assigned to a single student.  In general, you can expect to:

- Have one lab for each class.
- Create a new set of labs for each semester, quarter, or other academic system you're using. For classes that need to use the same image, you should use a [compute gallery](#azure-compute-gallery). This way, you can reuse images across labs and academic periods.

When you're determining how to structure your labs, consider the following points:

- **All VMs within a lab are deployed with the same image that's published.**

    As a result, if you have a class that requires different lab images to be published at the same time, a separate lab must be created for each image.
  
- **The usage quota is set at the lab level and applies to all users within the lab**

    To set different quotas for users, you must create separate labs. However, it's possible to add more hours to specific users after you have set the quota.
  
- **The startup or shutdown schedule is set at the lab level and applies to all VMs within the lab**

    Similar to quota setting, if you need to set different schedules for users, you need to create a separate lab for each schedule.

By default, each lab has its own virtual network.  If you have [advanced networking enabled](how-to-connect-vnet-injection.md), each lab uses the specified network.

## Azure Compute Gallery

An Azure Compute Gallery is attached to a lab plan and serves as a central repository for storing images. An image is saved in the gallery when an educator chooses to export it from a lab's template VM. Each time an educator makes changes to the template VM and exports it, new image definitions and\or versions are created in the gallery.  

Educators can publish an image version from the compute gallery when they create a new lab. Although the gallery stores multiple versions of an image, educators can select only the most recent version during lab creation.  The most recent version is chosen based on the highest value of MajorVersion, then MinorVersion, then Patch.  For more information about versioning, see [Image versions](../virtual-machines/shared-image-galleries.md#image-versions).

The compute gallery is an optional resource that you might not need immediately if you're starting with only a few labs. However, a compute gallery offers many benefits that are helpful as you scale up to more labs:

- **You can save and manage versions of a template VM image**

    It's useful to create a custom image or make changes (software, configuration, and so on) to an image from the Azure Marketplace gallery.  For example, it's common for educators to require different software or tooling be installed. Rather than requiring students to manually install these prerequisites on their own, different versions of the template VM image can be exported to the compute gallery. You can then use these image versions when you create new labs.

- **You can share and reuse template VM images across labs**

    You can save and reuse an image so that you don't have to configure it from scratch each time that you create a new lab. For example, if multiple classes need to use the same image, you can create it once and export it to the compute gallery so that it can be shared across labs.

- **You can upload your own custom images from other environments outside of labs**

    You can [upload custom images other environments outside of the context of labs](how-to-attach-detach-shared-image-gallery.md).  For example, you can upload images from your own physical lab environment or from an Azure VM into compute gallery.  Once an image is imported into the gallery, you can then use the images to create labs.

To logically group compute gallery images, you can do either of the following methods:

- Create multiple compute galleries. Each lab plan can connect to only one compute gallery, so this option also requires you to create multiple lab plans.
- Use a single compute gallery that is shared by multiple lab plans. In this case, each lab plan can enable only images that are applicable to the labs in that plan.

## Naming

As you get started with Azure Lab Services, we recommend that you establish naming conventions for Azure and Azure Lab Services related resources. For resource naming restrictions, see [Microsoft.LabServices naming rules and restrictions](../azure-resource-manager/management/resource-name-rules.md#microsoftlabservices).  Although the naming conventions that you establish is unique to the needs of your organization, the following table provides general guidelines:

| Resource type | Role | Suggested pattern | Examples |
| ------------- | ---- | ----------------- | -------- |
| Resource group | Contains one or more lab plans, labs and/or compute galleries. | rg-labs-{org-name}-{env}-{instance}, rg-labs-{dept-name}-{env}-{instance} | rg-labs-contoso-pilot, rg-labs--math-prod-001 |
| Lab plan | Template for newly created labs. | lp-{org-name}-{env}-{instance}, lp-{dept-name}-{env}-{instance} | lp-contoso, lp-contoso-pilot, lp-math-001 |
| Lab | Contains one or more student VMs. | {class-name}-{time}-{educator} | CS101-Fall2021, CS101-Fall2021-JohnDoe |
| Azure Compute Gallery | Contains one or more VM image versions | sig-{org-name}-{env}-{instance}, sig-{dept-name}-{env}-{instance} | sig-contoso-001, sig-math-prod |

In the proceeding table, we used some terms and tokens in the suggested name patterns.  Let's go over those terms in a little more detail.

| Pattern term/token | Definition | Example |
| ------------ | ---------- | ------- |
| {org-name} | Token for organization short name with no spaces. | contoso |
| {dept-name} | Token for short name of department in organization. | math, bio, cs |
| {env} | Token for environment name | prod for production, pilot for small test |
| {instance} | Number to identify instance if multiple resources created. | 001, 123 |
| {class-name} | Token for short name or code for class being supported. | CS101, Bio101 |
| {educator} | Alias of educator running the lab. | johndoe |
| {time} | Token for short name (with no spaces) for time the class is being offered. | Spring2021, Dec2021|
| rg | Indicates resource is a resource group. | |
| lp | Indicates resource is a lab plan. | |
| sig | Indicates resource is a compute gallery. | |

For more information about naming other Azure resources, see [Naming conventions for Azure resources](/azure/architecture/best-practices/naming-conventions).

## Regions

When you set up your Azure Lab Services resources, you're required to provide a region or location of the data center that hosts the resources. Lab plans can enable one or more regions in which labs might be created. The next sections describe how a region or location might affect each resource that is involved with setting up a lab.

- **Resource group**. The region specifies the datacenter where information about a resource group is stored. Azure resources can be in a different region than the resource group they're in.
- **Lab plan**. A lab plan's location indicates the region that a resource exists in.  When a lab plan is connected to your own virtual network, the network must be in the same region as the lab plan. Also, labs are created in the same Azure region as that virtual network.
- **Lab**.  The location that a lab exists in varies, and doesn't need to be in the same location as the lab plan. Administrators control which regions labs can be created in through the lab plan settings. A general rule is to set a resource's region to one that is closest to its users. For labs, this means creating the lab that is closest to your students. For online courses whose students are located all over the world, use your best judgment to create a lab that is centrally located. Or you can split a class into multiple labs according to your students' regions.

> [!NOTE]
> To help ensure that a region has sufficient VM capacity, it's important to first [request capacity](capacity-limits.md#request-a-limit-increase).

## VM sizing

When administrators or lab creators create a lab, they can choose from various VM sizes, depending on the needs of their classroom. The availability of specific VM sizes depends on the region that your lab plan is located in. Learn how you can [request additional capacity](./how-to-request-capacity-increase.md).

For information on VM sizes and their cost, see the [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

### Default VM sizes

| Size | Minimum vCPUs | Minimum memory: GiB | Series | Suggested use |
| ---- | ----- |  ----- | ------ | ------------- |
| Small| 2 | 4 | [Standard_F2s_v2](../virtual-machines/fsv2-series.md) | Best suited for command line, opening web browser, low-traffic web servers, small to medium databases. |
| Medium | 4 | 8 | [Standard_F4s_v2](../virtual-machines/fsv2-series.md) | Best suited for relational databases, in-memory caching, and analytics. |
| Medium (nested virtualization) | 4  | 16 | [Standard_D4s_v4](../virtual-machines/dv4-dsv4-series.md) | Best suited for relational databases, in-memory caching, and analytics.  This size also supports nested virtualization.
| Large | 8 | 16  |  [Standard_F8s_v2](../virtual-machines/fsv2-series.md) | Best suited for applications that need faster CPUs, better local disk performance, large databases, large memory caches. |
| Large (nested virtualization) | 8 | 32 | [Standard_D8s_v4](../virtual-machines/dv4-dsv4-series.md) | Best suited for applications that need faster CPUs, better local disk performance, large databases, large memory caches.  This size also supports nested virtualization. |
| Small GPU (Compute) | 8 | 56 | [Standard_NC8as_T4_v3](../virtual-machines/nct4-v3-series.md) | Best suited for computer-intensive applications such as AI and deep learning. |
| Small GPU (visualization) | 8 | 28 | [Standard_NVas_v4](../virtual-machines/nvv4-series.md) | (Windows only) Best suited for remote visualization, streaming, gaming, and encoding using frameworks such as OpenGL and DirectX. |
| Medium GPU (visualization) | 12 | 112 | [Standard_NV12s_v3](../virtual-machines/nvv3-series.md)  | (Windows only) Best suited for remote visualization, streaming, gaming, and encoding using frameworks such as OpenGL and DirectX. |

### Alternative VM sizes

To better serve you in locations where there's high demand, you can select from a list of *alternative* VM sizes.

| Size | Minimum vCPUs | Minimum memory: GiB | Series | Suggested use |
| ---- | ----- |  ----- | ------ | ------------- |
| Alternative Small GPU (Compute) | 6 | 112 | [Standard_NC6s_v3](../virtual-machines/ncv3-series.md) | Best suited for computer-intensive applications such as AI and deep learning. |
| Alternative Small GPU (Visualization) | 6 | 55 | [Standard_NV6ads_A10_v5](../virtual-machines/nva10v5-series.md) | (Windows only) Best suited for remote visualization, streaming, gaming, and encoding using frameworks such as OpenGL and DirectX. |
| Alternative Medium GPU (Visualization) | 12 | 110 | [Standard_NV12ads_A10_v5](../virtual-machines/nva10v5-series.md) | (Windows only) Best suited for remote visualization, streaming, gaming, and encoding using frameworks such as OpenGL and DirectX. |

### Classic VM sizes

When you create a lab plan and you still have lab accounts in your Azure subscription, then you can select from the list of VM sizes that were available for lab accounts. In the Azure Lab Services user interface, these VM sizes are marked as *classic* VM sizes.

| Size | Minimum vCPUs | Minimum memory: GiB | Series | Suggested use |
| ---- | ----- |  ----- | ------ | ------------- |
| Classic Small | 2 | 4 | [Standard_A2_v2](../virtual-machines/av2-series.md) | Best suited for command line, opening web browser, low-traffic web servers, small to medium databases. |
| Classic Medium | 4 | 8 | [Standard_A4_v2](../virtual-machines/av2-series.md) | Best suited for relational databases, in-memory caching, and analytics. |
| Classic Large | 8 | 16  |  [Standard_A8_v2](../virtual-machines/av2-series.md) | Best suited for applications that need faster CPUs, better local disk performance, large databases, large memory caches. |
| Classic Medium (Nested virtualization) | 4  | 16 | [Standard_D4s_v3](../virtual-machines/dv3-dsv3-series.md) | Best suited for relational databases, in-memory caching, and analytics.  This size also supports nested virtualization.
| Classic Large (Nested virtualization) | 8 | 32 | [Standard_D8s_v3](../virtual-machines/dv3-dsv3-series.md) | Best suited for applications that need faster CPUs, better local disk performance, large databases, large memory caches.  This size also supports nested virtualization. |
| Classic Small GPU (Compute) | 6 | 56 | [Standard_NC6](../virtual-machines/nc-series.md) | Best suited for computer-intensive applications such as AI and deep learning. |
| Classic Small GPU (Visualization) | 6 | 56 | [Standard_NV6](../virtual-machines/nv-series.md) | Best suited for remote visualization, streaming, gaming, and encoding using frameworks such as OpenGL and DirectX. |
| Classic Medium GPU (Visualization) | 12 | 112 | [Standard_NV12s_v3](../virtual-machines/nvv3-series.md) | Best suited for remote visualization, streaming, gaming, and encoding using frameworks such as OpenGL and DirectX. |

## RBAC roles

Azure Lab Services provides built-in Azure role-based access control (Azure RBAC) for common management scenarios in Azure Lab Services. An individual who has a profile in Microsoft Entra ID can assign these Azure roles to users, groups, service principals, or managed identities to grant or deny access to resources and operations on Azure Lab Services resources. This article describes the different built-in roles that Azure Lab Services supports.

Learn more about [Azure role-based access control in Azure Lab Services](./concept-lab-services-role-based-access-control.md).

## Content filtering

Your school might need to do content filtering to prevent students from accessing inappropriate websites.  For example, to comply with the [Children's Internet Protection Act (CIPA)](https://www.fcc.gov/consumers/guides/childrens-internet-protection-act).  Azure Lab Services doesn't offer built-in support for content filtering, and doesn't support network-level filtering.

Schools typically approach content filtering by installing third-party software that performs content filtering on each computer. To install third-party content filtering software on each computer, you should install the software on each lab's template VM. 

There are a few key points to highlight as part of this solution:

- If you plan to use the [autoshutdown settings](./cost-management-guide.md#automatic-shutdown-settings-for-cost-control), you need to unblock several Azure host names with the third party software.  The autoshutdown settings use a diagnostic extension that must be able to communicate back to Lab Services.  Otherwise, the autoshutdown settings fail to enable for the lab.
- You might also want to have each student use a nonadmin account on their VM so that they can't uninstall the content filtering software.  Adding a nonadmin account must be done when creating the lab.

Learn more about the [supported networking scenarios in Azure Lab Services](./concept-lab-services-supported-networking-scenarios.md), such as content filtering.

If your school needs to do content filtering, contact us via the [Azure Lab Services' Q&A](https://aka.ms/azlabs/questions) for more information.

## Endpoint management

Many endpoint management tools, such as [Microsoft Configuration Manager](https://techcommunity.microsoft.com/t5/azure-lab-services/configuration-manager-azure-lab-services/ba-p/1754407), require Windows VMs to have unique machine security identifiers (SIDs).  Using SysPrep to create a *generalized* image typically ensures that each Windows machine has a new, unique machine SID generated when the VM boots from the image.

With Lab Services, if you create a lab with a template, the lab VMs have the same SID. Even if you use a *generalized* image to create a lab, the template VM and lab user VMs all have the same machine SID.  The VMs have the same SID because the template VM's image is in a *specialized* state when it's published to create the student VMs.

To obtain lab VMs with unique SID, create a lab without a template VM.  You must use a *generalized* image from the Azure Marketplace or an attached Azure Compute Gallery.  To use your own Azure Compute Gallery, see [Attach or detach a compute gallery in Azure Lab Services](how-to-attach-detach-shared-image-gallery.md).  The machine SIDs can be verified by using a tool such as [PsGetSid](/sysinternals/downloads/psgetsid).

If you plan to use an endpoint management tool or similar software, we recommend that you don't use template VMs for your labs.

<a name='azure-ad-registerjoin-hybrid-azure-ad-join-or-ad-domain-join'></a>

## Microsoft Entra register/join, Microsoft Entra hybrid join, or AD domain join
To make labs easy to set up and manage, Azure Lab Services is designed with *no* requirement to register/join lab VMs to either Active Directory (AD) or Microsoft Entra ID.  As a result, Azure Lab Services *doesn’t* currently offer built-in support to register/join lab VMs.  Although it's possible to Microsoft Entra register/join, Microsoft Entra hybrid join, or AD domain join lab VMs using other mechanisms, we do *not* recommend that you attempt to register/join lab VMs to either Active Directory or Microsoft Entra ID due to product limitations.

## Pricing

### Azure Lab Services

To learn about pricing, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

Billing entries in Microsoft Cost Management are per lab VM. Tags for lab plan ID and lab name are automatically added to each entry for more flexible analysis and budgeting.

### Azure Compute gallery

You also need to consider the pricing for the compute gallery service if you plan to use compute galleries for storing and managing image versions.

Creating a compute gallery and attaching it to your lab plan is free. No cost is incurred until you save an image version to the gallery. The pricing for using a compute gallery is ordinarily fairly negligible, but it's important to understand how it's calculated, because it isn't included in the pricing for Azure Lab Services.  

#### Storage charges

To store image versions, a compute gallery uses standard hard disk drive (HDD) managed disks by default.  We recommend using HDD-managed disks when using compute gallery with Lab Services.  The size of the HDD-managed disk that is used depends on the size of the image version that is being stored.  Lab Services supports image and disk sizes up to 128 GB.  To learn about pricing, see [Managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

Azure Lab Services doesn't support attaching extra disks to a lab template or lab VM.

#### Replication and network egress charges

When you save an image version by using a lab template VM, Azure Lab Services first stores it in a source region.  However, you'll most likely need to replicate the source image version to one or more target regions.

A network egress charge occurs when an image version is replicated from the source region to other target regions. The amount charged is based on the size of the image version when the image's data is initially transferred outbound from the source region.  For pricing details, see [Bandwidth pricing details](https://azure.microsoft.com/pricing/details/bandwidth/).

Egress charges might be waived for [Education Solutions](https://www.microsoft.com/licensing/licensing-programs/licensing-for-industries?rtc=1&activetab=licensing-for-industries-pivot:primaryr3) customers. To learn more, contact your account manager.

For more information, see "What data transfer programs exist for academic customers and how do I qualify?" in the FAQ section of the [Programs for educational institutions](https://azure.microsoft.com/pricing/details/bandwidth/) page.

For information about costs to store images and their replications, see [billing in an Azure Compute Gallery](../virtual-machines/shared-image-galleries.md).

#### Cost management

It's important for lab plan administrators to manage costs by routinely deleting unneeded image versions from the gallery.

Be wary of removing replication to specific regions as a way to reduce the costs.  Replication changes might have adverse effects on the ability of Azure Lab Services to publish VMs from images saved within a compute gallery.

## Next steps

For more information about setting up and managing labs, see:

- [Configure a lab plan](lab-plan-setup-guide.md)  
- [Configure a lab](setup-guide.md)
- [Manage costs for labs](cost-management-guide.md)
