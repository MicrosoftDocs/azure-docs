---
title:  Enable virtual hardware and VM CRUD capabilities in an SCVMM machine with Arc agent installed
description: Enable virtual hardware and VM CRUD capabilities in an SCVMM machine with Arc agent installed
ms.topic: how-to 
ms.date: 01/05/2024
ms.service: azure-arc
ms.subservice: azure-arc-scvmm
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri
---

# Enable virtual hardware and VM CRUD capabilities in an SCVMM machine with Arc agent installed

In this article, you learn how to enable virtual hardware management and VM CRUD operational ability on an SCVMM VM that has Arc agents installed via the Arc-enabled Servers route.

>[!IMPORTANT]
> This article is applicable only if you've installed Arc agents directly in SCVMM machines before onboarding to Azure Arc-enabled SCVMM by deploying Arc resource bridge. 

## Prerequisites

- An Azure subscription and resource group where you have *Arc ScVmm VM Administrator* role. 
- Your SCVMM management server instance must be [onboarded](quickstart-connect-system-center-virtual-machine-manager-to-arc.md) to Azure Arc.

## Enable virtual hardware management and self-service access to SCVMM VMs with Arc agent installed

1. From your browser, go to [Azure portal](https://portal.azure.com/).

1. Navigate to the Virtual machines inventory page of your SCVMM management servers. The virtual machines that have Arc agent installed via the Arc-enabled Servers route will have **Link to SCVMM management server** status under virtual hardware management.

1. Select **Link to SCVMM management server** to view the pane with the list of all the machines under SCVMM management server with Arc agent installed but not linked to the SCVMM management server in Azure Arc.

1. Choose all the machines that need to be enabled in Azure, and select **Link** to link the machines to SCVMM management server.

1. After you link to SCVMM management server, the virtual hardware status will reflect as **Enabled** for all the VMs, and you can perform virtual hardware operations. 

## Next steps

[Set up and manage self-service access to SCVMM resources](set-up-and-manage-self-service-access-scvmm.md).

