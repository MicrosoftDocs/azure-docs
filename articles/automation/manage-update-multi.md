---
title: Manage updates for multiple Azure virtual machines | Microsoft Docs
description: Onboard Azure virtual machines to manage updates.
services: operations-management-suite
documentationcenter: ''
author: eslesar
manager: carmonm
editor: ''

ms.assetid: 
ms.service: operations-management-suite
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/25/2017
ms.author: eslesar
---

# Manage updates for multiple Azure virtual machines

Update management allows you to manage updates and patches for your Azure virtual machines.
From your [Azure Automation]((../automation-offering-get-started.md)) account, you can quickly onboard virtual machines, assess the status of available updates, schedule installation of required updates, and review deployment results to verify updates were applied successfully to all virtual machines for which
Update management is enabled.

## Prerequisites

To complete the steps in this guide, you will need:

* An Azure Automation account. For instructions on creating an Azure Automation Run As account, see [Azure Run As Account](automation-sec-configure-azure-runas-account.md).
* An Azure Resource Manager virtual machine (not Classic). For instructions on creating a VM, see 
  [Create your first Windows virtual machine in the Azure portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md)