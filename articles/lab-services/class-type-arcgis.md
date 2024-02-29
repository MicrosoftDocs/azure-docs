---
title: Set up a lab for ArcMap\ArcGIS Desktop with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab for classes using ArcGIS. 
author: nicolela
ms.topic: how-to
ms.date: 02/28/2022
ms.custom: devdivchpfy22
ms.service: lab-services
---

# Set up a lab for ArcMap\ArcGIS Desktop

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

[ArcGIS](https://www.esri.com/en-us/arcgis/products/arcgis-solutions/overview) is a type of geographic information system (GIS).  ArcGIS is used to make\analyze maps and work with geographic data that is provided by the [Environmental Systems Research Institute](https://www.esri.com/home) (ESRI).  Although ArcGIS Desktop includes several applications, this article shows how to set up labs for using ArcMap.  [ArcMap](https://desktop.arcgis.com/en/arcmap/latest/map/main/what-is-arcmap-.htm) is used to make, edit, and analyze 2D maps.

To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Licensing server

One type of licensing that ArcGIS Desktop offers is [concurrent use licenses](https://desktop.arcgis.com/en/license-manager/latest/license-manager-basics.htm). This licensing requires you to install ArcGIS License Manager on your license server. The License Manager keeps track of the number of copies of software that can be run at the same time. For more information on setting up the License Manager on your server, see the [License Manager Guide](https://desktop.arcgis.com/en/license-manager/latest/welcome.htm).

The license server is located in either your on-premises network or hosted on an Azure virtual machine within an Azure virtual network.  After your license server is set up, you'll need to [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md) with your lab plan.

> [!IMPORTANT]
> [Advanced networking](how-to-connect-vnet-injection.md) must be enabled during the creation of your lab plan. It can't be added later.

For more information, see [Set up a license server as a shared resource](how-to-create-a-lab-with-shared-resource.md).

## Lab configuration

When you get an Azure subscription, you can create a new lab plan in Azure Lab Services. For more information about creating a new lab plan, see the tutorial on [how to set up a lab plan](./quick-create-resources.md). If you're using a ArcGIS License Manager on a license server, enable [advanced networking](how-to-connect-vnet-injection.md) when creating your lab plan. You can also use an existing lab plan.

### Lab plan settings

Enable your lab plan settings as described in the following table.  For more information about how to enable Azure Marketplace images, see [Specify the Azure Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab plan setting | Instructions |
| ------------------- | ------------ |
|Marketplace image| Enable the Windows 10 Pro or Windows 10 Pro N image, if not done already.|

### Lab settings

For instructions on how to create a lab, see [Tutorial: Set up a lab](tutorial-setup-lab.md). Use the following settings when creating the lab.

| Lab setting | Value and description |
| ------------ | ------------------ |
|Virtual Machine Size| **Medium**.  Best suited for relational databases, in-memory caching, and analytics.|  

The recommended size of the virtual machine (VM) for using ArcGIS Desktop depends on the applications, extensions, and the specific versions that students will use. The VM size also depends on the workloads that students are expected to perform. For more information on how to identify the VM size, see [ArcGIS Desktop system requirements](https://desktop.arcgis.com/en/system-requirements/latest/arcgis-desktop-system-requirements.htm) article. When you've identified a potential VM size, we recommend that you test your students' workloads to ensure adequate performance.

In this article, we recommend that you use [**Medium** VM size](administrator-guide.md#vm-sizing) for version [10.7.1 of ArcMap](https://desktop.arcgis.com/en/system-requirements/10.7/arcgis-desktop-system-requirements.htm), assuming that no other ArcGIS Desktop extensions are used. However, depending on the needs of your class, you might require a **Large**, **Small GPU (Visualization)**, or **Medium GPU (Visualization)** VM size. For example, the [Spatial Analyst extension](https://desktop.arcgis.com/en/arcmap/latest/tools/spatial-analyst-toolbox/gpu-processing-with-spatial-analyst.htm) that is included with ArcGIS Desktop supports a GPU for enhanced performance, but doesn't require using a GPU.

### Auto-shutdown and disconnect settings

A lab's [auto-shutdown and disconnect settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control) ensure a student's VM is shut down when it's not being used. These settings should be set according to the types of workloads that your student performs so that their VM doesn't shut down in the middle of their work. For example, the **Disconnect users when virtual machines are idle** setting disconnects the student from their RDP session after no mouse or keyboard inputs have been detected for a specified amount of time. This setting must allow sufficient time for workloads where the student isn't actively using the mouse or keyboard, such as to run long queries or wait for rendering.

For ArcGIS, we recommend the following values for these settings:

| Setting | Value |
|-|-|
| Disconnect users when virtual machines are idle | 30 minutes after idle state is detected |
| Shut down virtual machines when users disconnect | 15 minutes after user disconnects |

## Template machine configuration

The steps in this section show how to set up the template VM:

1. Start the template VM and connect to the machine using RDP.

2. Download and install the ArcGIS Desktop components using instructions from by ESRI. These steps include assigning the license manager for concurrent use licensing:
    - [Introduction to installing and configuring ArcGIS Desktop](https://desktop.arcgis.com/en/arcmap/latest/get-started/installation-guide/introduction.htm)

3. Set up external backup storage for students.  Students can save files directly to their assigned VM since all changes that they make are saved across sessions. However, we recommend that students back up their work to storage that is external from their VM for a few reasons:
    - To enable students to access their work after the class and lab ends.  
    - In case the student gets their VM into a bad state and their image needs to be [reimaged](how-to-manage-vm-pool.md#reimage-lab-vms).

    With ArcGIS, each student should back up the following files at the end of each work session:

    - mxd file, which stores the layout information for a project.
    - File geodatabases, which store all data produced by ArcGIS.
    - Any other data that the student might be using such as raster files, shapefiles, GeoTIFF, etc.

    We recommend using OneDrive for backup storage. To set up OneDrive on the template VM, follow the steps in the article [Install and configure OneDrive](how-to-prepare-windows-template.md#install-and-configure-onedrive).

## Cost

Let's cover a possible cost estimate for this class. This estimate doesn't include the cost of running the license server. We'll use a class of 25 students. There are 20 hours of scheduled class time. Also, each student gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we selected was **Medium**, which is 42 lab units.

25 lab users \* (20 scheduled hours + 10 quota hours) \* 42 Lab Units * 0.01 USD per hour = 315.00 USD

> [!IMPORTANT]
> Cost estimate is for example purposes only.  For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).  

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]