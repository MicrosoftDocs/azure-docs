---
title: Set up a lab for ArcMap\ArcGIS Desktop with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab for classes using ArcGIS. 
author: nicolela
ms.topic: article
ms.date: 02/04/2021
ms.author: nicolela
---

# Set up a lab for ArcMap\ArcGIS Desktop

[ArcGIS](https://www.esri.com/en-us/arcgis/products/arcgis-solutions/overview) is a type of geographic information system (GIS).  ArcGIS is used to make\analyze maps and work with geographic data that is provided by the [Environmental Systems Research Institute](https://www.esri.com/en-us/home) (ESRI).  Although ArcGIS Desktop includes several applications, this article shows how to set up labs for using ArcMap.  [ArcMap](https://desktop.arcgis.com/en/arcmap/latest/map/main/what-is-arcmap-.htm) is used to make, edit, and analyze 2D maps.

## Lab configuration

To begin setting up a lab for using ArcMap, you need an Azure subscription and lab account.  If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

After you get an Azure subscription, you can create a new lab account in Azure Lab Services.  For more information about creating a new lab account, see [Set up a lab account](tutorial-setup-lab-account.md).  You can also use an existing lab account.

### Lab account settings

Enable your lab account settings as described in the following table.  For more information about how to enable Azure Marketplace images, see [Specify the Azure Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab account setting | Instructions |
| ------------------- | ------------ |
|Marketplace image| Enable the Windows 10 Pro or Windows 10 Pro N image for use within your lab account.|

### Licensing server

One type of licensing that ArcGIS Desktop offers is [concurrent use licenses](https://desktop.arcgis.com/en/license-manager/latest/license-manager-basics.htm).  This requires that you install ArcGIS License Manager on your license server.  The License Manager keeps track of the number of copies of software that can be run at the same time.  For more information on how to set up the License Manager on your server, see the [License Manager Guide](https://desktop.arcgis.com/en/license-manager/latest/welcome.htm).

The license server is typically located in either your on-premises network or hosted on an Azure virtual machine within an Azure virtual network.  After your license server is set up, you’ll need to [peer the virtual network](./how-to-connect-peer-virtual-network.md) with your [lab account](./tutorial-setup-lab-account.md).  You need to do the network peering before you create the lab so that your lab VMs can access the license server and vice versa.

For more information, see [Set up a license server as a shared resource](how-to-create-a-lab-with-shared-resource.md).

### Lab settings

The size of the virtual machine (VM) that we recommend using for ArcGIS Desktop depends on the applications, extensions, and the specific versions that students will use.  The VM size also depends on the workloads that students are expected to perform.  Refer to [ArcGIS Desktop system requirements](https://desktop.arcgis.com/en/system-requirements/latest/arcgis-desktop-system-requirements.htm) to help with identifying the VM size.  Once you’ve identified the potential VM size, we recommend that you test your students’ workloads to ensure adequate performance.

In this article, we recommend using the [**Medium** VM size](administrator-guide.md#vm-sizing) for version [10.7.1 of ArcMap](https://desktop.arcgis.com/en/system-requirements/10.7/arcgis-desktop-system-requirements.htm), assuming that no other ArcGIS Desktop extensions are used.  However, depending on the needs of your class, you may require a **Large** or even a **Small\Medium GPU (Visualization)** VM size.  For example, the [Spatial Analyst extension](https://desktop.arcgis.com/en/arcmap/latest/tools/spatial-analyst-toolbox/gpu-processing-with-spatial-analyst.htm) that is included with ArcGIS Desktop supports a GPU for enhanced performance, but doesn’t require using a GPU.

| Lab setting | Value and description |
| ------------ | ------------------ |
|Virtual Machine Size| **Medium**.  Best suited for relational databases, in-memory caching, and analytics.|  

### Template machine

The steps in this section show how to set up the template VM:

1.	Start the template VM and connect to the machine using RDP.

2.	Download and install the ArcGIS Desktop components using instructions from by ESRI.  These steps include assigning the license manager for concurrent use licensing: 
    - [Introduction to installing and configuring ArcGIS Desktop](https://desktop.arcgis.com/en/arcmap/latest/get-started/installation-guide/introduction.htm)

3.  Set up external backup storage for students.  Students can save files directly to their assigned VM since all changes that they make are saved across sessions.  However, we recommend that students back up their work to storage that is external from their VM for a few reasons:
    - To enable students to access their work after the class and lab ends.  
    - In case the student gets their VM into a bad state and their image needs to be [reset](how-to-set-virtual-machine-passwords.md#reset-vms).

    With ArcGIS, each student should back up the following files at the end of each work session:

    - mxd file, which stores the layout information for a project.
    - File geodatabases, which store all data produced by ArcGIS.
    - Any other data that the student may be using such as raster files, shapefiles, GeoTIFF, etc.

    We recommend using OneDrive for backup storage.  To set up OneDrive on the template VM, follow the steps in the article [Install and configure OneDrive](how-to-prepare-windows-template.md#install-and-configure-onedrive). 

4.  Finally, [publish](how-to-create-manage-template.md#publish-the-template-vm) the template VM to create the students’ VM.

### Auto-shutdown and disconnect settings

A lab’s [auto-shutdown and disconnect settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control) help make sure that a student’s VM is shut down when it’s not being used.  These settings should be set according to the types of workloads that your students will perform so that their VM doesn’t shut down in the middle of their work.  For example, the **Disconnect users when virtual machines are idle** setting disconnects the student from their RDP session after no mouse or keyboard inputs have been detected for a specified amount of time.  This setting must allow sufficient time for workloads where the student isn't actively using the mouse or keyboard, such as to run long queries or wait for rendering.

For ArcGIS, we recommend the following values for these settings:
- Disconnect users when virtual machines are idle
    - 30 minutes after idle state is detected
- Shut down virtual machines when users disconnect
    - 15 minutes after user disconnects

## Cost

Let's cover a possible cost estimate for this class. This estimate doesn't include the cost of running the license server. We'll use a class of 25 students. There are 20 hours of scheduled class time. Also, each student gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we chose was **Medium**, which is 42 lab units.

25 students \* (20 scheduled hours + 10 quota hours) \* 42 Lab Units * 0.01 USD per hour = 315.00 USD

>[!IMPORTANT]
> Cost estimate is for example purposes only.  For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).  

## Next steps

Next steps are common to setting up any lab.

- [Create and manage a template](how-to-create-manage-template.md)
- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)