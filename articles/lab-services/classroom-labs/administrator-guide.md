---
title: Azure Lab Services - Administrator guide | Microsoft Docs
description: This guide helps administrators who create and manage lab accounts using Azure Lab Services. 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/19/2019
ms.author: spelluru

---
# Azure Lab Services - Administrator guide
Information Technology (IT) administrators who manage an organization’s cloud resources are also typically responsible for setting up the lab account for their organization. Administrators or educators create classroom labs in the lab account. This article provides a high-level overview of the Azure resources involved and the guidance for creating them.

![High-level view of Azure resources in a lab account](../media/administrator-guide/high-level-view.png)

- Classroom labs are hosted within an Azure subscription owned by Azure Lab Services
- Lab accounts, shared image gallery, and image versions are hosted within your subscription
- You can have you lab account and the shard image gallery in the same resource group. In this diagram, they are in different resource groups. 

## Subscription
Your organization has one or more Azure subscriptions. A subscription is used to manage billing and security for all Azure resources\services that are used within it, including lab accounts.

The relationship between a lab account and its subscription is important because:

- Billing is reported through the subscription that contains the lab account.
- You can give users in the Azure Active Directory (AD) tenant associated with the subscription the access to Azure Lab Services. You can add the user either as a lab account owner\contributor or as a classroom lab creator.

Classroom labs and their virtual machines (VMs) are managed entirely for you. To be specific, they're hosted within a dedicated subscription owned by Azure Lab Services.

## Resource group
A subscription contains one or more resource groups. Resource groups are used to create logical groupings of Azure resources that are used together within the same solution.  

When you create a lab account, you must configure the resource group that contains the lab account. 

A resource group is also required when creating a [shared image gallery](#shared-image-gallery). You may choose to put your lab account and shared image gallery in two separate resource groups, which is typical if you plan to share the image gallery across different solutions. Or, you may choose to put them in the same resource group.

When you create a lab account, and automatically create and attach a shared image gallery at the same time, the lab account and the shared image gallery are created in separate resource groups by default. You'll see this behavior when using the steps described in this tutorial: [Configure shared image gallery at the time of lab account creation](how-to-attach-detach-shared-image-gallery.md#configure-at-the-time-of-lab-account-creation). The image at the top of this article also uses this configuration. 

We recommend investing time up front to plan out the structure of your resource groups since it's not possible to change a lab account’s or shared image gallery’s resource group once it’s created. If you need to change the resource group for these resources, you'll need to delete and recreate your lab account and\or shared image gallery.

## Lab account
A Lab account serves as a container for one or more classroom labs. When getting started with Azure Lab Services, it’s common to only have a single lab account. As your lab usage scales, you may later choose to create more lab accounts.

The following list highlights scenarios where more than one lab account may be beneficial:

- **Manage different policy requirements across classroom labs** 

    When you set up a lab account, you set policies that apply to all classroom labs under the lab account, such as:
    - The Azure virtual network with shared resources that the classroom lab can access. For example, you may have a set of classroom labs that need access to a shared data set within a virtual network.
    - The virtual machine (VM) images that the classroom labs can use to create VMs. For example, you may have a set of classroom labs that need access to the [Data Science VM for Linux](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.linux-data-science-vm-ubuntu) Marketplace image.  

    If you have classroom labs that have unique policy requirements from one another, it may be beneficial to create separate lab accounts to manage these classroom labs separately.
- **Restrict lab creators’ access to specific classroom labs**  

    When a user is added as a lab creator, they're given access to all classroom labs within the lab account including the labs that are created by other lab creators. To restrict lab creators to managing specific labs, you can create separate lab accounts to restrict the scope of their access. For example, you may create a separate lab account for each department within a university. For example: one lab account for the Science department, and another for the Math department, and so on.   
- **Separate budget by lab account**

    Rather than having all classroom lab costs reported for a single lab account, you may need to have a more clearly separated budget. Continuing with the example in the above bullet, you could create a lab account for each university department to separate the budget accordingly. Using Azure Cost Management, you can then view the cost for each individual lab account.
- **Isolate pilot labs from active labs**

    You may have cases where you want to pilot policy changes to a lab account without potentially impacting active labs. In this type of scenario, creating a separate lab account for piloting purposes allows you to isolate changes. 

## Classroom lab
A classroom Lab contains one or more virtual machines (VMs) that are each assigned to a specific student. In general, you can expect to:

- Have one classroom lab for each class.
- Create a new set of classroom labs each semester (or for each time frame your class is offered).Typically for classes that have the same image needs, you would use a [shared image gallery](#shared-image-gallery) to share images across labs and semesters.

Consider the following points when determining how to structure your classroom labs:

- **All VMs within a classroom lab are deployed with the same image that's published**. As a result, if you have a class that requires different lab images be published at the same time, separate classroom labs must be created for each one.
- **Usage quota is set at the lab level and applies to all users within the lab**. For example, you may have a set of educators that need access to a class’s VMs to prepare for teaching, but the educators only require a 10-hour quota while students enrolled in the class require a 40-hour quota. To set different quotas for users, you must create separate classroom labs. However, it's possible to add more hours to a specific user after you have set the quota.
- **The startup or shutdown schedule is set at the lab level and applies to all VMs within the lab**. Similar to the previous point, if you need to set different schedules for users, you need to create separate classroom labs. 

## Shared image gallery
A shared image gallery is attached to a lab account and serves as a central repository for storing images. An image is saved in the gallery when an educator chooses to save from a classroom lab’s template virtual machine (VM). Each time an educator makes changes to the template VM and saves, new versions of the image are saved while maintaining previous versions.

Instructors can publish an image version from the shared image gallery when they create a new classroom lab. Although the gallery can store multiple versions of an image, educators can only select the latest version during lab creation.

Shared image gallery is an optional resource that you may not need immediately when starting with only a few classroom labs. However, using shared image gallery has many benefits that are helpful as you scale to having more classroom labs:

- **Enables you to save and manage versions of a template VM image**.

    It's useful when creating a custom image or making changes (software, configuration, and so on.) to an image from the public Marketplace gallery.  For example, it’s common for educators to require different software\tooling be installed. Rather than requiring students to manually install these pre-requisites on their own, different versions of the template VM image can be saved to a shared image gallery. These image versions can then be used when creating new classroom labs.
- **Enables sharing\reuse of template VM images across classroom labs**.

    It prevents you from having to configure an image from scratch each time that you create a new classroom lab. For example, if multiple classes are being offered that need the same image, this image only needs to be created once and saved in the shared image gallery so that it can be shared across Classroom Labs.
- **Ensures image availability through replication**.

    When saving to the shared image gallery from a classroom lab, your image is automatically replicated to other regions within the same geography. In the case that there's an outage for a region, publishing of the template VM in your classroom lab isn't impacted by using an image replica in other regions. Furthermore, it helps with performance in multi-VM publishing scenarios by spreading out to use different replicas.

To logically group shared images, you have a couple of options:

- Create multiple shared image galleries. Each lab account can only connect to one shared image gallery, so this option will also require you to create multiple lab accounts.
- Or, you can use a single shared image gallery that's shared by multiple lab accounts. In this case, each lab account can enable only those images that are applicable to the classroom labs that it contains.

## Naming
As you get started with Azure Lab Services, we recommend that you establish naming conventions for resource groups, lab accounts, classroom labs, and the shared image gallery. While the naming conventions that you establish will be unique to the needs of your organization, the following table outlines general guidelines.

| Resource type | Role | Suggested pattern | Examples |
| ------------- | ---- | ----------------- | -------- | 
| Resource group | Contains one or more lab accounts and one or more shared image galleries | \<organization short name\>-\<environment\>-rg<ul><li>**Organization short name** identifies the name of the organization that the resource group supports</li><li>**Environment** identifies the environment for the resource, such as Test or Production</li><li>**Rg** stands for the resource type: resource group.</li></ul> | contosouniversitylabs-rg<br/>contosouniversitylabs-test-rg<br/>contosouniversitylabs-prod-rg |
| Lab account | Contains one or more labs | \<organization short name\>-\<environment\>-la<ul><li>**Organization short name** identifies the name of the organization that the resource group supports</li><li>**Environment** identifies the environment for the resource, such as Test or Production</li><li>**La** stands for the resource type: lab account.</li></ul> | contosouniversitylabs-la<br/>mathdeptlabs-la<br/>sciencedeptlabs-test-la<br/>sciencedeptlabs-prod-la |
| Classroom lab | Contains one or more VMs |\<class name\>-\<timeframe\>-\<educator identifier\><ul><li>**Class name** identifies the name of the class the lab supports.</li><li>**Timeframe** identifies the timeframe in which the class is offered.</li>**Education identifier** identifies the educator that owns the lab.</li></ul> | CS1234-fall2019-johndoe<br/>CS1234-spring2019-johndoe | 
| Shared image gallery | Contains one or more VM image versions | \<organization short name\>gallery | contosouniversitylabsgallery |

For more information on naming other Azure resources, see [Naming conventions for Azure resources](/azure/architecture/best-practices/naming-conventions).

## Regions or locations
When setting up your Azure Lab Services’ resources, you're required to provide a region, or location, of the data center that will host the resource. Here are more details on how region\location impacts each of the following resources used in your Lab Services deployment:

- **Resource group**

    The region specifies the data center where information about the resource group is stored. Azure resources contained within the resource group can be in different regions from their parent.
- **Lab account or classroom lab**

    The lab account’s location indicates the region for this resource. Classroom labs created in the lab account may be deployed to any region within the same geography. The specific region that the lab’s VMs are deployed to is automatically selected based on capacity available in the region at that time.  
    If an administrator allows lab creators to choose their classroom lab’s location, the locations that are available for selection are based on available regional capacity when creating the lab.

    The location of the classroom lab also determines which VM compute sizes are available for selection. Certain compute sizes are only available within specific locations.
- **Shared image gallery**

    The region indicates the source region where the first image version is stored before it’s automatically replicated to target regions.
    
A general rule is to set a resource’s region\location to one that is closest to its users. For classroom labs, it means creating the classroom lab closest to your students. For online courses where students are located all over the world, you need to use your best judgment to create a classroom lab that's centrally located. Or, split a class into multiple classroom labs based on your students’ region.

## VM sizing
When administrators or lab creators create a classroom lab, they can choose from the following VM sizes based on the needs of their classroom. Remember that the compute sizes that are available depend on the region that your lab account is located in:

| Size | Specs | Suggested use |
| ---- | ----- | ------------- |
| Small| <ul><li>2 Cores</li><li>3.5 GB RAM</li></ul> | This size is best suited for command line, opening web browser, low traffic web servers, small to medium databases. |
| Medium | <ul><li>4 Cores</li><li>7 GB RAM</li></ul> | This size is best suited for relational databases, in-memory caching, and analytics. |
| Medium (Nested virtualization) | <ul><li>4 Cores</li><li>16 GB RAM</li></ul> | This size is best suited for relational databases, in-memory caching, and analytics.  This size also supports nested virtualization. |
| Large | <ul><li>8 Cores</li><li>32 GB RAM</li></ul> | This size is best suited for applications that need faster CPUs, better local disk performance, large databases, large memory caches.  This size also supports nested virtualization. |
| Small GPU (Visualization) | <ul><li>6 Cores</li><li>56 GB RAM</li> | This size is best suited for remote visualization, streaming, gaming, encoding using frameworks such as OpenGL and DirectX. |
| Small GPU (Compute) | <ul><li>6 Cores</li><li>56 GB RAM</li></ul> |This size is best suited for computer-intensive applications like Artificial Intelligence and Deep Learning. |
| Medium GPU (Visualization) | <ul><li>12 Cores</li><li>112 GB RAM</li></ul> | This size is best suited for remote visualization, streaming, gaming, encoding using frameworks such as OpenGL and DirectX. |

## Manage identity
There are two types of roles that a lab account administrator may have:

- **Owner**

    An administrator that's assigned the **Owner** role has full access to the lab account including the right to grant other users access to the lab account and add lab creators. The administrator that creates the lab account by default is added as the owner.
- **Contributor**

    An administrator that's assigned the Contributor role can change lab account settings, but they cannot grant access to other users; nor, can they add lab creators.

When you attach a shared image gallery to a lab account, access is automatically given to both the administrator and lab creators so that they can view and save images in the gallery. 

## Pricing

### Azure Lab Services
The pricing for Azure Lab Services is described in the following article: [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

You also need to consider the pricing for the shared image gallery if you plan to use it for storing and managing image versions. 

### Shared image gallery
Creating a shared image gallery and attaching it to your lab account is free. Costs aren't incurred until you save an image version to the gallery. Typically, the pricing for using a shared image gallery is fairly negligible, but it’s important to understand how it's calculated since it isn't included in the pricing for Azure Lab Services.  

### Storage charges
To store image versions, a shared image gallery uses standard HDD-managed disks. The size of the HDD-managed disk that's used depends on the size of the image version being stored. See the following article to view the pricing: [Managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/).


### Replication and network egress charges
When you save an image version using a classroom lab’s template virtual machine (VM), Lab Services first stores it in a source region and then automatically replicates the source image version to one or more target regions. It’s important to note that Azure Lab Services automatically replicates the source image version to all target regions within the geolocation where the classroom lab is located. For example, if your classroom lab is in the U.S. geolocation, an image version is replicated to each of the eight regions that exist within the U.S.

A network egress charge occurs when an image version is replicated from the source region to additional target regions. The amount charged is based on the size of the image version when the image’s data is initially transferred outbound from the source region.  For pricing details, refer to the following article: [Bandwidth pricing details](https://azure.microsoft.com/pricing/details/bandwidth/).

[Education solutions](https://www.microsoft.com/licensing/licensing-programs/licensing-for-industries?rtc=1&activetab=licensing-for-industries-pivot:primaryr3) customers may be waived from paying egress charges. Speak with your account manager to learn more.  For more information,  see **refer to the FAQ** section in the linked document, specifically the question “What data transfer programs exist for academic customers and how do I qualify?”).

### Pricing example
To recap the pricing described above, let’s look at an example of saving our template VM image to shared image gallery. Assume the following scenarios:

- You have one custom VM image.
- You're saving two versions of the image.
- Your lab is in the U.S., which has a total of eight regions.
- Each image version is 32 GB in size; as a result, the HDD-managed disk price is $1.54 per month.

The total cost is estimated as:

Number of images × number of versions × number of replicas × managed disk price

In this  example, the cost is:

1 custom image (32 GB) x 2 versions x 8 U.S. regions x $1.54 = $24.64 per month

### Cost management
It’s important for lab account administrator to manage costs by routinely deleting unneeded image versions from the gallery. 

You shouldn't delete replication to specific regions as a way to reduce the costs (this option exists in shared image gallery). Replication changes may have adverse effects on Azure Lab Service’s ability to publish VMs from images saved within a shared image gallery.

## Next steps
See the tutorial for step-by-step instructions to create a lab account and a lab: [Tutorial: set up a lab account](tutorial-setup-lab-account.md)
