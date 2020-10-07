---
title: Azure Lab Services - Administrator guide | Microsoft Docs
description: This guide helps administrators who create and manage lab accounts using Azure Lab Services. 
ms.topic: article
ms.date: 06/26/2020
---

# Azure Lab Services - Administrator guide
Information Technology (IT) administrators who manage a university's cloud resources are typically responsible for setting up the lab account for their school. Once a lab account is set up, administrators or educators create classroom labs that are contained within the lab account. This article provides a high-level overview of the Azure resources involved and the guidance for creating them.

![High-level view of Azure resources in a lab account](./media/administrator-guide/high-level-view.png)

- Classroom labs are hosted within an Azure subscription owned by Azure Lab Services.
- Lab accounts, shared image gallery, and image versions are hosted within your subscription.
- You can have your lab account and the shared image gallery in the same resource group. In this diagram, they are in different resource groups. 

## Subscription
Your university has one or more Azure subscriptions. A subscription is used to manage billing and security for all Azure resources\services that are used within it, including lab accounts.

The relationship between a lab account and its subscription is important because:

- Billing is reported through the subscription that contains the lab account.
- You can give users in the subscription's Azure Active Directory (AD) tenant access to Azure Lab Services. You can add a user as a lab account owner\contributor, classroom lab creator, or classroom lab owner.

Classroom labs and their virtual machines (VMs) are managed and hosted for you within a subscription owned by Azure Lab Services.

## Resource group
A subscription contains one or more resource groups. Resource groups are used to create logical groupings of Azure resources that are used together within the same solution.  

When you create a lab account, you must configure the resource group that contains the lab account. 

A resource group is also required when creating a [shared image gallery](#shared-image-gallery). You may choose to put your lab account and shared image gallery in two separate resource groups, which is typical if you plan to share the image gallery across different solutions. Or, you may choose to put them in the same resource group.

When you create a lab account, you can automatically create and attach a shared image gallery at the same time.  This option results in the lab account and the shared image gallery being created in separate resource groups. You'll see this behavior when using the steps described in this tutorial: [Configure shared image gallery at the time of lab account creation](how-to-attach-detach-shared-image-gallery.md#configure-at-the-time-of-lab-account-creation). The image at the top of this article also uses this configuration. 

We recommend investing time up front to plan the structure of your resource groups since it's *not* possible to change a lab account's or shared image gallery's resource group once it's created. If you need to change the resource group for these resources, you'll need to delete and recreate your lab account and\or shared image gallery.

## Lab account

A lab account serves as a container for one or more classroom labs. When getting started with Azure Lab Services, it's common to only have a single lab account. As your lab usage scales, you may later choose to create more lab accounts.

The following list highlights scenarios where more than one lab account may be beneficial:

- **Manage different policy requirements across classroom labs**

    When you set up a lab account, you set policies that apply to *all* classroom labs under the lab account, such as:
    - The Azure virtual network with shared resources that the classroom lab can access. For example, you may have a set of classroom labs that need access to a shared data set within a virtual network.
    - The virtual machine (VM) images that the classroom labs can use to create VMs. For example, you may have a set of classroom labs that need access to the [Data Science VM for Linux](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804) Marketplace image.

    If you have classroom labs that have unique policy requirements from one another, it may be beneficial to create separate lab accounts to manage these classroom labs separately.

- **Separate budget by lab account**
  
    Instead of reporting all classroom lab costs through a single lab account, you may need a more clearly separated budget. For example, you can create lab accounts for your university's Math department, Computer Science department, and so forth, to separate the budget across departments.  You can then view the cost for each individual lab account using [Azure Cost Management](https://docs.microsoft.com/azure/cost-management-billing/cost-management-billing-overview).

- **Isolate pilot labs from active\production labs**
  
    You may have cases where you want to pilot policy changes for a lab account without potentially impacting active\production labs. In this type of scenario, creating a separate lab account for piloting purposes allows you to isolate changes. 

## Classroom lab

A classroom lab contains virtual machines (VMs) that are each assigned to a single student.  In general, you can expect to:

- Have one classroom lab for each class.
- Create a new set of classroom labs each semester (or for each time frame your class is offered). Typically for classes that have the same image needs, you should use a [shared image gallery](#shared-image-gallery) to reuse images across labs and semesters.

Consider the following points when determining how to structure your classroom labs:

- **All VMs within a classroom lab are deployed with the same image that's published**

    As a result, if you have a class that requires different lab images be published at the same time, separate classroom labs must be created for each one.
  
- **Usage quota is set at the lab level and applies to all users within the lab**

    To set different quotas for users, you must create separate classroom labs. However, it's possible to add more hours to a specific user after you have set the quota.
  
- **The startup or shutdown schedule is set at the lab level and applies to all VMs within the lab**

    Similar to the previous point, if you need to set different schedules for users, you need to create separate classroom labs.

By default, each classroom lab will have its own virtual network.  If you have vnet peering enabled, each classroom lab will have its own subnet peered to the specified virtual network.

## Shared image gallery

A shared image gallery is attached to a lab account and serves as a central repository for storing images. An image is saved in the gallery when an educator chooses to export from a classroom lab's template virtual machine (VM). Each time an educator makes changes to the template VM and exports, new versions of the image are saved while maintaining previous versions.

Instructors can publish an image version from the shared image gallery when they create a new classroom lab. Although the gallery stores multiple versions of an image, educators can only select the latest version during lab creation.

Shared image gallery is an optional resource that you may not need immediately when starting with only a few classroom labs. However, using shared image gallery has many benefits that are helpful as you scale to having more classroom labs:

- **Enables you to save and manage versions of a template VM image**

    It's useful to create a custom image or make changes (software, configuration, and so on) to an image from the public Marketplace gallery.  For example, it's common for educators to require different software\tooling be installed. Rather than requiring students to manually install these pre-requisites on their own, different versions of the template VM image can be exported to a shared image gallery. These image versions can then be used when creating new classroom labs.
- **Enables sharing\reuse of template VM images across classroom labs**

    You can save and reuse an image so that you don't have to configure the image from scratch each time that you create a new classroom lab. For example, if multiple classes are being offered that need the same image, this image only needs to be created once and exported to the shared image gallery so that it can be shared across classroom labs.
- **Ensures image availability through replication**

    When you save to the shared image gallery from a classroom lab, your image is automatically replicated to other [regions within the same geography](https://azure.microsoft.com/global-infrastructure/regions/). In the case that there's an outage for a region, publishing the image to your classroom lab isn't affected since an image replica from another region can be used.  Publishing VMs from multiple replicas can also help with performance.

To logically group shared images, you have a couple of options:

- Create multiple shared image galleries. Each lab account can only connect to one shared image gallery, so this option will also require you to create multiple lab accounts.
- Or, you can use a single shared image gallery that's shared by multiple lab accounts. In this case, each lab account can enable only those images that are applicable to the classroom labs that it contains.

## Naming

As you get started with Azure Lab Services, we recommend that you establish naming conventions for resource groups, lab accounts, classroom labs, and the shared image gallery. While the naming conventions that you establish will be unique to the needs of your organization, the following table outlines general guidelines.

| Resource type | Role | Suggested pattern | Examples |
| ------------- | ---- | ----------------- | -------- | 
| Resource group | Contains one or more lab accounts and one or more shared image galleries | \<organization short name\>-\<environment\>-rg<ul><li>**Organization short name** identifies the name of the organization that the resource group supports</li><li>**Environment** identifies the environment for the resource, such as Pilot or Production</li><li>**Rg** stands for the resource type: resource group.</li></ul> | contosouniversitylabs-rg<br/>contosouniversitylabs-pilot-rg<br/>contosouniversitylabs-prod-rg |
| Lab account | Contains one or more labs | \<organization short name\>-\<environment\>-la<ul><li>**Organization short name** identifies the name of the organization that the resource group supports</li><li>**Environment** identifies the environment for the resource, such as Pilot or Production</li><li>**La** stands for the resource type: lab account.</li></ul> | contosouniversitylabs-la<br/>mathdeptlabs-la<br/>sciencedeptlabs-pilot-la<br/>sciencedeptlabs-prod-la |
| Classroom lab | Contains one or more VMs |\<class name\>-\<timeframe\>-\<educator identifier\><ul><li>**Class name** identifies the name of the class the lab supports.</li><li>**Timeframe** identifies the timeframe in which the class is offered.</li>**Education identifier** identifies the educator that owns the lab.</li></ul> | CS1234-fall2019-johndoe<br/>CS1234-spring2019-johndoe |
| Shared image gallery | Contains one or more VM image versions | \<organization short name\>gallery | contosouniversitylabsgallery |

For more information on naming other Azure resources, see [Naming conventions for Azure resources](/azure/architecture/best-practices/naming-conventions).

## Regions\locations

When setting up your Azure Lab Services' resources, you're required to provide a region (or location) of the data center that will host the resource. Here are more details on how region impacts each of the resources involved with setting up a lab.

### Resource group

The region specifies the data center where information about the resource group is stored. Azure resources contained within the resource group can be in different regions from their parent.

### Lab account

A lab account's location indicates the region that this resource exists in.  

### Classroom lab

The location that a classroom lab exists in varies based on the following factors:

  - **Lab account is peered to a virtual network (VNet)**
  
    A lab account can be [peered with a VNet](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-connect-peer-virtual-network) when they are in the same region.  When a lab account is peered with a VNet, classroom labs are automatically created in the same region as both the lab account and VNet.

    > [!NOTE]
    > When a lab account is peered with a VNet, the setting to **Allow lab creator to pick lab location** is disabled. Additional information can be found about this setting in the article: [Allow lab creator to pick location for the lab](https://docs.microsoft.com/azure/lab-services/classroom-labs/allow-lab-creator-pick-lab-location).
    
  - **No VNet is peered ***and*** lab creators aren't allowed to pick the lab location**
  
    When there is **no** VNet peered with the lab account *and* [lab creators are **not** allowed to pick the lab location](https://docs.microsoft.com/azure/lab-services/classroom-labs/allow-lab-creator-pick-lab-location), classroom labs are automatically created in a region that has available VM capacity.  Specifically, Azure Lab Services looks for availability in [regions that are within the same geography as the lab account](https://azure.microsoft.com/global-infrastructure/regions).

  - **No VNet is peered ***and*** lab creators are allowed to pick the lab location**
       
    When there is **no** VNet peered and [lab creators are allowed to pick the lab location](https://docs.microsoft.com/azure/lab-services/classroom-labs/allow-lab-creator-pick-lab-location), the locations that can be selected by the lab creator are based on available capacity.

> [!NOTE]
> To help ensure that there is sufficient VM capacity for a region, it's important that you first request capacity through the lab account or when creating the lab.

A general rule is to set a resource's region to one that is closest to its users. For classroom labs, this means creating the classroom lab closest to your students. For online courses where students are located all over the world, you need to use your best judgment to create a classroom lab that's centrally located. Or, split a class into multiple classroom labs based on your students' region.

### Shared image gallery

The region indicates the source region where the first image version is stored before it's automatically replicated to target regions.

## VM sizing

When administrators or lab creators create a classroom lab, they can choose from the following VM sizes based on the needs of their classroom. Remember that the compute sizes that are available depend on the region that your lab account is located in:

| Size | Specs | Series | Suggested use |
| ---- | ----- | ------ | ------------- |
| Small| <ul><li>2 Cores</li><li>3.5 GB RAM</li> | [Standard_A2_v2](https://docs.microsoft.com/azure/virtual-machines/av2-series?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json) | This size is best suited for command line, opening web browser, low traffic web servers, small to medium databases. |
| Medium | <ul><li>4 Cores</li><li>7 GB RAM</li> | [Standard_A4_v2](https://docs.microsoft.com/azure/virtual-machines/av2-series?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json) | This size is best suited for relational databases, in-memory caching, and analytics. |
| Medium (Nested virtualization) | <ul><li>4 Cores</li><li>16 GB RAM</li></ul> | [Standard_D4s_v3](https://docs.microsoft.com/azure/virtual-machines/dv3-dsv3-series?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json#dsv3-series) | This size is best suited for relational databases, in-memory caching, and analytics.
| Large | <ul><li>8 Cores</li><li>16 GB RAM</li></ul>  | [Standard_A8_v2](https://docs.microsoft.com/azure/virtual-machines/av2-series) | This size is best suited for applications that need faster CPUs, better local disk performance, large databases, large memory caches.  This size also supports nested virtualization. |
| Large (Nested Virtualization) | <ul><li>8 Cores</li><li>16 GB RAM</li></ul>  | [Standard_A8_v2](https://docs.microsoft.com/azure/virtual-machines/av2-series) | This size is best suited for applications that need faster CPUs, better local disk performance, large databases, large memory caches. |
| Small GPU (Visualization) | <ul><li>6 Cores</li><li>56 GB RAM</li>  | [Standard_NV6](https://docs.microsoft.com/azure/virtual-machines/nv-series) | This size is best suited for remote visualization, streaming, gaming, encoding using frameworks such as OpenGL and DirectX. |
| Small GPU (Compute) | <ul><li>6 Cores</li><li>56 GB RAM</li></ul>  | [Standard_NC6](https://docs.microsoft.com/azure/virtual-machines/nc-series) |This size is best suited for computer-intensive applications like Artificial Intelligence and Deep Learning. |
| Medium GPU (Visualization) | <ul><li>12 Cores</li><li>112 GB RAM</li></ul>  | [Standard_NV12](https://docs.microsoft.com/azure/virtual-machines/nv-series?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json) | This size is best suited for remote visualization, streaming, gaming, encoding using frameworks such as OpenGL and DirectX. |

## Manage identity

Using [Azure's role based access control](https://docs.microsoft.com/azure/role-based-access-control/overview), the following roles can be assigned to give access to lab accounts and classroom labs:

- **Lab account owner**

    The administrator that creates the lab account is automatically added to the lab account's **Owner** role.  An administrator that's assigned the **Owner** role can:
     - Change the lab account's settings.
     - Give other administrators access to the lab account as owners or contributors.
     - Give educators access to classroom labs as creators, owners, or contributors.
     - Create and manage all classroom labs within in the lab account.

- **Lab account contributor**

    An administrator that's assigned the **Contributor** role can:
    - Change the lab account's settings.
    - Create and manage all classroom labs within the lab account.

    However, they *cannot* give other users access to either lab accounts or classroom labs.

- **Classroom lab creator**

    To create classroom labs within a lab account, an educator must be a member of the **Lab Creator** role.  When an educator creates a classroom lab, they are automatically added as an owner of the lab.  Refer to the tutorial on how to [add a user to the **Lab Creator** role](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-lab-account#add-a-user-to-the-lab-creator-role). 

- **Classroom lab owner\contributor**
  
    An educator can view and change a classroom lab's settings when they are a member of either a lab's **Owner** or **Contributor** role; they must also be a member of the lab account's **Reader** role.

    A key difference between a lab's **Owner** and **Contributor** roles is that a contributor *cannot* give other users access to manage the lab - only owners can give other users access to manage the lab.

    In addition, an educator *cannot* create new classroom labs unless they are also a member of the **Lab Creator** role.

- **Shared image gallery**

    When you attach a shared image gallery to a lab account, lab account owners\contributors and lab creators\owners\contributors are automatically given access to view and save images in the gallery.

Here are some tips to help with assigning roles:
   - Typically, only administrators should be members of a lab account's **Owner** or **Contributor** roles; you may have more than one owner\contributor.
   - To give an educator the ability to create new classroom labs and manage the labs that they create; you only need to assign access to the **Lab Creator** role.
   - To give an educator the ability to manage specific classroom labs, but *not* the ability to create new labs; you should assign access to either the **Owner** or **Contributor** role for each of the classroom labs that they will manage.  For example, you may want to allow both a professor and a teaching assistant to co-own a classroom lab.  Refer to the guide on how to [add a user as an owner to a classroom lab](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-add-user-lab-owner).

## Pricing

### Azure Lab Services

The pricing for Azure Lab Services is described in the following article: [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

You also need to consider the pricing for the shared image gallery if you plan to use it for storing and managing image versions. 

### Shared image gallery

Creating a shared image gallery and attaching it to your lab account is free. Costs aren't incurred until you save an image version to the gallery. Typically, the pricing for using a shared image gallery is fairly negligible, but it's important to understand how it's calculated since it isn't included in the pricing for Azure Lab Services.  

#### Storage charges

To store image versions, a shared image gallery uses standard HDD-managed disks. The size of the HDD-managed disk that's used depends on the size of the image version being stored. See the following article to view the pricing: [Managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

#### Replication and network egress charges

When you save an image version using a classroom lab's template virtual machine (VM), Azure Lab Services first stores it in a source region and then automatically replicates the source image version to one or more target regions. It's important to note that Azure Lab Services automatically replicates the source image version to all target [regions within the geography](https://azure.microsoft.com/global-infrastructure/regions/) where the classroom lab is located. For example, if your classroom lab is in the U.S. geography, an image version is replicated to each of the eight regions that exist within the U.S.

A network egress charge occurs when an image version is replicated from the source region to additional target regions. The amount charged is based on the size of the image version when the image's data is initially transferred outbound from the source region.  For pricing details, refer to the following article: [Bandwidth pricing details](https://azure.microsoft.com/pricing/details/bandwidth/).

[Education solutions](https://www.microsoft.com/licensing/licensing-programs/licensing-for-industries?rtc=1&activetab=licensing-for-industries-pivot:primaryr3) customers may be waived from paying egress charges. Speak with your account manager to learn more.  For more information, see **refer to the FAQ** section in the linked document, specifically the question "What data transfer programs exist for academic customers and how do I qualify?".

#### Pricing example

To recap the pricing described above, let's look at an example of saving our template VM image to shared image gallery. Assume the following scenarios:

- You have one custom VM image.
- You're saving two versions of the image.
- Your lab is in the U.S., which has a total of eight regions.
- Each image version is 32 GB in size; as a result, the HDD-managed disk price is $1.54 per month.

The total cost is estimated as:

Number of images × number of versions × number of replicas × managed disk price

In this  example, the cost is:

1 custom image (32 GB) x 2 versions x 8 U.S. regions x $1.54 = $24.64 per month

#### Cost management

It's important for lab account administrator to manage costs by routinely deleting unneeded image versions from the gallery. 

You shouldn't delete replication to specific regions as a way to reduce the costs (this option exists in shared image gallery). Replication changes may have adverse effects on Azure Lab Service's ability to publish VMs from images saved within a shared image gallery.

## Next steps

See the tutorial for step-by-step instructions to create a lab account and a lab: [Set Up Guide](tutorial-setup-lab-account.md)
