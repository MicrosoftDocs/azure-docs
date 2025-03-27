---
title: Arc enable discovered inventory in Azure Migrate
description: Describes how to enable arc in Azure Migrate
author: SnehaSudhirG
ms.author: anjalimishra
ms.service: azure-migrate
ms.topic: how-to
ms.date: 10/14/2024

---

# Enable Arc on Migrate inventory 


This article describes how to view the Arc status of your Migrate discovered inventory and Arc enable your on-premises servers discovered in your datacenter with Azure Migrate: Discovery and assessment tool’s [appliance-based discovery](how-to-set-up-appliance-vmware.md).  

The [Azure Migrate appliance](migrate-appliance.md) is a lightweight appliance that the Azure Migrate: Discovery and assessment tool uses to discover servers running in vCenter Server and to send server configuration and performance metadata to Azure. 

## Prerequisites 

- Make sure you've [created](create-manage-projects.md) an Azure Migrate project. You can also reuse an existing project to use this capability. 
- Once you've created a project, the Azure Migrate: Discovery and assessment tool is automatically [added](how-to-create-assessment.md) to the project. 
- Discover your IT estate using Azure Migrate appliance. Follow our tutorials for [VMware](./tutorial-discover-vmware.md) or [Hyper-V](tutorial-discover-hyper-v.md) or [Physical/Bare-metal](tutorial-discover-physical.md) or other clouds to try out these steps. 

## Overview 

The Arc-enable Migrate Inventory helps you view the Arc status of inventory discovered in Azure Migrate and navigate you to Arc center, if you want to Arc-enable your servers. This integration provides unified management experience, enabling better control and visibility over the migration process along with managing the remaining on-premises inventory. It includes these features:  

- Allows you to view the Arc status of a server, if it's Arc-enabled or not. 
- Directs you to download the Arc onboarding script from the Migrate inventory screen and run it on individual machines using your preferred automation method. 

### Arc status in Azure Migrate
 
To view the Arc Status in Azure Migrate, follow these steps:

1. In **Servers, databases and web apps**, select **Discovered servers**.
The **Discovered servers** page lists all the machines discovered. You can see the **Sync Arc Status** option here. 

   :::image type="content" source="./media/how-to-arc-enable-inventory/discovered-servers-inline.png" alt-text="Screenshot of the discovered servers." lightbox="./media/how-to-arc-enable-inventory/discovered-servers-expanded.png":::
 
2. Select **Sync Arc Status**. Azure Migrate refreshes your discovered inventory. It compares this data with the data available in Azure Resource Graph via the Azure Hybrid Connected Resource Provider. Here, the machine’s BIOS ID is used to map machines in Migrate inventory against Azure Arc inventory. Once a unique match is found, this machine ID is saved in the Migrate inventory, providing seamless tracking and further status updates. 

   :::image type="content" source="./media/how-to-arc-enable-inventory/discovered-items-arc-inline.png" alt-text="Screenshot of the discovered items with Arc button." lightbox="./media/how-to-arc-enable-inventory/discovered-items-arc-expanded.png":::

3. To sync the Arc Status of a particular machine, select the **Arc Status** of that machine and you'll be directed to the details of Arc Status. You can review and sync the Arc status from here. You can add this column to the view, if the column isn't visible. 

   :::image type="content" source="./media/how-to-arc-enable-inventory/arc-status-inline.png" alt-text="Screenshot of the Arc status panel." lightbox="./media/how-to-arc-enable-inventory/arc-status-expanded.png":::

> [!Note] 
> Once the refresh job is completed, the Arc discovery status is updated. 

The **Completed** Arc discovery status indicates that the machine was checked against the Arc inventory, but it might or might not be onboarded to Azure Arc. 

The Arc status has two states. If a machine is Arc-enabled, the Migrate inventory syncs with it and the status is updated as **Enabled** else it's marked **Not enabled**.

### Enable Arc from Azure Migrate

To enable Arc for Azure Migrate discovered inventory, follow these steps:  

1. In **Servers, databases and web apps**, select **Discovered items**.

2. Navigate to **Enable Arc** and select **Generate onboarding script**. 
 
   :::image type="content" source="./media/how-to-arc-enable-inventory/onboard-script-inline.png" alt-text="Screenshot of the generate onboarding script button." lightbox="./media/how-to-arc-enable-inventory/onboard-script-expanded.png":::

   You'll be directed to add the project and server details. Once you enter all the required details, you'll be able to download and run the script. 

   :::image type="content" source="./media/how-to-arc-enable-inventory/download-script-inline.png" alt-text="Screenshot of the download script button." lightbox="./media/how-to-arc-enable-inventory/download-script-expanded.png":::
 
For more information on how to Arc enable your inventory,  

- [Arc-enable your machines at scale](/azure/azure-arc/servers/onboard-service-principal) 
- [Arc enable your servers](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm) 
- [Azure Arc-enabled Servers](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm) 

## Next steps 

- After successfully enabling Arc for the migration inventory, you can: 

   - Regularly monitor the resources to ensure optimal performance. 
   - Update and refine policies as needed to adapt to changing requirements. 
   - Plan for periodic reviews and audits to maintain the integrity of the migration inventory. 
- [Learn more](/azure/azure-arc/overview) about Azure Arc. 