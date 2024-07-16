---
title: Remove an Azure Site Recovery replication appliance
description: Learn how to remove an Azure Site Recovery replication appliance using the Azure portal.
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: how-to
ms.date: 07/04/2024
ms.author: ankitadutta
---

# How to Delete the Replication Appliance


## Overview

The Azure Site Recovery replication appliance is a virtual machine that runs on-premises and replicates data from your on-premises servers to Azure for disaster recovery purposes. You can delete the appliance from the Azure portal, when you no longer need it. 

This article provides a step-by-step guide for removing the Azure Site Recovery replication appliance from the Azure portal.


## Before you begin

There are two ways to remove the replication appliance: **delete** and **reset**. If all the components of the appliance are in a healthy state and the appliance is still accessible, you're allowed to only *reset* the appliance. Resetting moves the appliance to its factory state, enabling it to be associated with any Recovery Service vault again. 

If all the appliance components are in a critical state and there's no connectivity with the appliance, it can be *deleted* from the Azure portal. Before deleting the Recovery Services vault, you must also *remove infrastructure* to ensure that all the resources created in the background for replication and appliance registration are also removed. However, before you delete the Azure Site Recovery replication appliance, you must complete some preparatory steps to avoid errors.


## Prerequisites

Before you delete the Azure Site Recovery replication appliance, ensure that you *disable replication of all servers* using the Azure Site Recovery replication appliance. To do this, go to Azure portal, select the Recovery Services vault > *Replicated items* blade. Select the servers you want to stop replicating, select **Stop replication**, and confirm the action.


### Delete an unhealthy appliance

You can only delete the Azure Site Recovery replication appliance from the Azure portal if all components are in a critical state and the appliance is no longer accessible.

> [!IMPORTANT]
> The appliance must be unhealthy (in a critical state) for at least 30 minutes before it is eligible for deletion. If the appliance is healthy, you can only reset it. Ensure that you have disabled replication for all servers before deleting the appliance.


To delete an appliance, follow these steps:

1. Sign in to the Azure portal.
2. Go to the *Recovery Services vault* > *Site Recovery infrastructure* (under **Manage**), select Azure Site Recovery *replication appliances* under **For VMware & Physical machines**.
3. For the Azure Site Recovery replication appliance you want to delete, select **Delete** from its menu.

    :::image type="content" source="./media/delete-appliance/delete.png" alt-text="Screenshot of Site Recovery appliance page.":::

1. Confirm that no replicated items are associated with the replication appliance. If there are replicated items associated, a pop-up appears to block the appliance deletion.

    :::image type="content" source="./media/delete-appliance/notification.png" alt-text="Screenshot of pop-up notification.":::

1. If no replicated items are associated with the appliance, a pop-up appears to inform you about the Microsoft Entra ID Apps that must be deleted. Note these App IDs and proceed with deletion.


### Post delete appliance

After successfully deleting the Azure Site Recovery replication appliance, you can:

- Free up resources used by the Azure Site Recovery replication appliance, such as the storage account, network interface, and public IP address.
- Delete the Recovery Services vault if it is no longer needed.
- Remove Microsoft Entra Apps with the Azure Site Recovery replication appliance. To do this, go to Azure portal > *Microsoft Entra ID* > *App registrations* under the *Manage* blade. Select the app that you should delete, and select **Delete** then confirm the action. You can learn the app names by following the steps [here](#delete-an-unhealthy-appliance).


## Reset a healthy appliance

You can only reset the Azure Site Recovery replication appliance if all components are in a healthy state. To reset the appliance, follow these steps:

1. On the Azure portal, go to the appliance you want to reset. 
    Ensure that no replicated items are associated with this appliance.
1. On **Microsoft Azure Appliance Configuration Manager**, go to the *Reset appliance* section and select **Reset**.
1. If no machines are associated with the appliance, the reset begins.
1. Once completed successfully, ensure the following:
   - Open `Services.msc` and restart the service `World Wide Web Publishing Service`.
   - Clear the cache for Microsoft Edge or other browsers being used. Restart the browser after the cache cleanup. Learn more [here](https://www.microsoft.com/edge/learning-center/how-to-manage-and-clear-your-cache-and-cookies).
   - Restart the machine.


## Next steps

In this article, you learned how to delete the Azure Site Recovery replication appliance from the Azure portal. You can now free up the associated resources and delete the Recovery Services vault as needed.