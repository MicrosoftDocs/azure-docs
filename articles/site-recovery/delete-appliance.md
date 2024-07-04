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

The Azure Site Recovery replication appliance is a virtual machine that runs on-premises and replicates data from your on-premises servers to Azure. It is used for disaster recovery purposes. If you no longer need the Azure Site Recovery replication appliance, you can delete it from the Azure portal. 
This article provides a step-by-step guide for removing the Azure Site Recovery replication appliance from the Azure portal.


## Before you begin

There are two ways to remove the replication appliance: **delete** and **reset**. If all the components of the appliance are in a healthy state and the appliance is still accessible, only resetting the appliance will be allowed. Resetting moves the appliance to its factory state, enabling it to be associated with any Recovery Service vault again. If all the appliance components are in a critical state and there is no connectivity with the appliance, it can be deleted from the Azure portal.

Before deleting the Recovery Services vault, you must also **Remove infrastructure** to ensure that all the resources created in the background for replication and appliance registration are also removed. However, before you delete the Azure Site Recovery replication appliance, you need to complete some preparatory steps to avoid errors.


## Prerequisites

Before you delete the Azure Site Recovery replication appliance, ensure that you have completed the following tasks:

- **Disable replication of all servers** using the Azure Site Recovery replication appliance. From the Azure portal, select the Recovery Services vault > *Replicated items* blade. Select the servers you want to stop replicating, click on **Stop replication**, and confirm the action.
- **Remove the Microsoft Entra Apps** associated with the Azure Site Recovery replication appliance. From the Azure portal, go to *Microsoft Entra ID* > *App registrations* under the *Manage* blade. Select the app that you should delete, click on **Delete**, and confirm the action. You can learn the app names by following the steps [here](#).

## Reset Appliance

You can only reset the Azure Site Recovery replication appliance if all components are in a healthy state. Follow these steps:
1. On the Azure Portal, navigate to the appliance you want to reset. Ensure that no replicated items are associated with this appliance.
2. On **Microsoft Azure Appliance Configuration Manager**, navigate to the *Reset appliance* section. Click on **Reset**.
3. If no machines are associated with the appliance, the reset will begin.
4. Once completed successfully:
   - Open `Services.msc` and restart the service `World Wide Web Publishing Service`.
   - Clear the cache for Microsoft Edge or other browsers being used. Restart the browser after the cache cleanup. Learn more [here](#).
   - Restart the machine.

### Delete the Appliance

You can only delete the Azure Site Recovery replication appliance from the Azure portal if all components are in a critical state, and the appliance is no longer accessible. Follow these steps:

1. Sign in to the Azure portal.
2. Navigate to the *Recovery Services vault* > *Site Recovery infrastructure* (under Manage) > *ASR replication appliances* (under For VMware & Physical machines).
3. For the Azure Site Recovery replication appliance you want to delete, click on **Delete** from its menu.
4. Confirm that no replicated items are associated with the replication appliance. If so, a pop-up will block appliance deletion.
5. If no replicated items are associated with the appliance, a pop-up will inform you about the Entra ID Apps that need to be deleted. Note these App IDs and proceed with deletion.


After successfully deleting the Azure Site Recovery replication appliance:

1. Free up resources used by the Azure Site Recovery replication appliance, such as the storage account, network interface, and public IP address.
2. Delete the Recovery Services vault if it is no longer needed.


## Next Steps

In this article, you learned how to delete the Azure Site Recovery replication appliance from the Azure portal. You can now free up the associated resources and delete the Recovery Services vault as needed.