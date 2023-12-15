---
title: Migrating from physical labs to the cloud
titleSuffix: Azure Lab Services
description: Learn about the benefits and considerations for migrating from physical labs to Azure Lab Services. Understand how to configure your labs to optimize costs.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 01/31/2023
---

# Considerations for migrating from physical labs to Azure Lab Services

Azure Lab Services enables you to provide lab environments that users can access from anywhere, any time of the day. When you migrate from physical labs to Azure Lab Services, you should reassess your lab structure to minimize costs and optimize the experience for lab creators and users. In this article, you learn about the considerations and benefits of migrating from physical labs to Azure Lab Services.

## Considerations for moving to Azure Lab Services

When you migrate physical labs to Azure Lab Services, you should consider the following aspects:

- What is the lab structure? Are labs used for different purposes (shared lab), such as multiple classes, or are they dedicated (single-purpose lab)?
- What are the software requirements for the lab?
- What are the lab hardware requirements? A shared lab has to accommodate the needs for all usage scenarios and therefore has higher requirements.

To optimally benefit, you need to reassess the lab and image contents as a whole. It's not recommended to reuse the same lab image from your physical lab as-is.

## Lab structure

Usually a physical lab is shared by students from multiple classes. As a result, all of the classes’ software applications are installed together at once on each lab computer. When a class uses the lab, students only run a subset of the applications that are relevant to their class.

This type of physical computer lab often leads to increased hardware requirements:

- A large disk size may be required to install the combined set of applications that are needed by the classes that are sharing the lab.
- Some applications require more processing power compared to others, or require specialized processors, such as a GPU. By installing multiple applications on the same lab computer, each computer must have sufficient hardware to run the most compute-intensive applications.

This level of hardware is wasted for classes that only use the lab to run applications that require less memory, compute power, or disk space.

Azure Lab Services is designed to use hardware more efficiently, so that you only pay for what your users actually need and use. With Azure Lab Services, labs are structured to be more granular:

- One lab is created for each class (or session of a class).
- On the lab’s image, only the software applications that are needed by that specific class are installed.

This structure helps to identify the optimal VM size for each class based on the specific workload, and helps to reduce the disk size requirements (Azure Lab Services’ currently supports a disk size of 127 GB).

When you use Azure Lab Services, it's recommended that you use single-purpose labs.

Learn more about [how to structure labs](./administrator-guide.md#lab) in the Azure Lab Services administrator guide.

## Benefits

There are multiple benefits of using single-purpose labs (for example, one class per lab):

- Optimize costs by selecting the right VM size for each lab. See the below [example use case and cost analysis](#example-use-case).

- Lab VMs only contain the software that is needed for their purpose. This simplifies the set-up and maintenance of labs by lab creators, and provides more clarity for lab users.

- Access to each individual lab is controlled. Lab users are only granted access to labs and software they need. Learn how to [add and manage lab users](./how-to-manage-lab-users.md).

- Further optimize costs by taking advantage of the following features:

    - [Schedules](./how-to-create-schedules.md) are used to automatically start and stop all VMs within a lab according to each class’s schedule. 
    - [Quotas](./how-to-manage-lab-users.md#set-quotas-for-users) allow you to control the amount of time that each class’s students can access VMs outside of their scheduled hours.

## Example use case

Consider the following physical lab configuration, where the lab is shared by multiple classes:

- An engineering class that uses [SolidWorks](./class-type-solidworks.md) with 100 students enrolled. 
- A math class that uses [MATLAB](./class-type-matlab.md) that also has 100 students enrolled. 

Since our physical lab is shared by these two classes, each lab computer has both SolidWorks and MATLAB installed, along with various other common applications, such as Word, or Excel. Also, it’s important to note that SolidWorks is more compute-intensive since it typically requires a GPU.

To move this physical lab to Azure Lab Services:

- Create two labs: one for the engineering class and another for the math class.
- Create two VM images: one with SolidWorks installed and another with MATLAB.

Because SolidWorks requires a GPU, the engineering lab uses the **Small GPU (Visualization)** VM size. The lab for math class only requires a **Medium** VM size.

The following image shows how the lab structure changes when moving this physical lab to Azure Lab Services.

:::image type="content" source="./media/concept-migrating-physical-labs/physical-lab-to-lab-services.png" alt-text="Diagram that shows both the physical lab structure and the target lab structure in Azure Lab Services." lightbox="./media/concept-migrating-physical-labs/physical-lab-to-lab-services.png":::

### Cost analysis

In this example, the cost per usage hour for the two VM sizes is substantially different:

- Small GPU (Visualization): provides high compute-power and as a result, the cost is 160 lab units per hour.
- Medium: provides less compute power but is suitable for many types of classes. The cost is only 55 lab units per hour.

By using separate labs and assigning the smallest appropriate VM size for each lab, you can save on the total cost for running the labs.

Consider a usage scenario where student uses their VM for a total of 10 hours:

- A single lab using the Small GPU (Visualization) size that is shared by students from both the engineering and math classes is estimated to have the following usage:

    10 hours * 200 students * 160 lab units/hour = 320000 lab units

- Separate labs that use the Small GPU (Visualization) size for engineering and Medium size for math are estimated to have the following usage:

    - Engineering class lab: 10 hours * 100 students * 160 lab units/hour = 160000

    - Math class lab: 10 hours * 100 students * 55 lab units/hour  = 55000

    The total of both the engineering and math labs is 215000.

By using a more granular lab structure, the total savings for running the labs are 33%. Also, keep in mind that you only pay for the number of hours that your students actually use their VMs. If students use their VMs less, the actual costs are lower.

>[!IMPORTANT]
> The cost estimate is for example purposes only. For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Prepare for migrating to Azure Lab Services

When you start using Azure Lab Services, IT and faculty should coordinate early in the planning process to: 

- Identify the specific software applications that each class requires. Learn more about [lab software requirements](./setup-guide.md#what-software-requirements-does-the-class-have).
- Understand the workloads that students perform using the lab. 

This information is needed to choose the appropriate VM size when you create a lab and to set up the image on the template VM. Learn more about [VM sizing in Azure Lab Services](./administrator-guide.md#vm-sizing).

To ensure that you choose the appropriate VM size, we recommend starting with the minimum VM size that meets the hardware requirements for your applications.  Then, have faculty connect to a lab VM to validate common workloads that students perform to ensure the performance and experience is sufficient.  It’s helpful to refer to the [Class Types](./class-types.md), which show real-world examples of how to set up applications for classes along with the recommended VM size.

Also, [Azure Compute Gallery](./how-to-use-shared-image-gallery.md) is useful for creating and storing custom images. A compute gallery enables you to create an image once and reuse it to create multiple labs.

## Conclusion

Azure Lab Services provides many benefits for optimizing the cost of running your labs, simplifying set-up and maintenance, and having fine-grained access control. To optimally benefit, it's recommended to structure your labs in Azure Lab Services to have a single purpose. For example, create a separate lab for each classroom training.

## Next steps

- Get started by [creating a lab plan](./quick-create-lab-plan-portal.md).
- Understand [cost estimation and analysis](./cost-management-guide.md).
- Understand the [lab requirements for a lab](./setup-guide.md#understand-the-lab-requirements-of-your-class).
- Learn more about [VM sizing in Azure Lab Services](./administrator-guide.md#vm-sizing).