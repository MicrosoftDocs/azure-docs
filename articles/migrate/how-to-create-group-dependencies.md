---
title: Create an assessment using group dependency mapping with Azure Migrate | Microsoft Docs
description: Describes how to create an assessment using machine dependencies with the Azure Migrate service.
services: migrate
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 0527e34e-a078-405e-aeb9-c91a5808112a
ms.service: migrate
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/25/2017
ms.author: raynew
---

# Assess a group using group dependency mapping

This article describes how to create a group of machines for assessment by [Azure Migrate](migrate-overview.md), using group dependency mapping. Azure Migrate assesses each machine in the group to check whether it's suitable for migration to Azure, and provides sizing and cost estimations for running the machine in Azure.

Using this method you create a group, and then review its dependencies in order to refine it. Reviewing group dependencies allows you to create groups with higher confidence. You're aware of all the dependencies that exist for every machine in the group, before you run an assessment.

## Prepare machines for dependency mapping
We recommend that you prepare every machine you're going to include in the group for dependency mapping. To do this, you need to download and install the Microsoft Monitoring Agent (MMA), and the Dependency agent, on each on-premises VM. In addition, if you have machines with no internet connectivity, you need to download and install OMS gateway. Learn more.

### Download and install the VM agents
1. In **Overview**, click **Manage** > **Machines**, and select the required machine.
2. In the **Dependencies** column, click **Install agents**. 
3. On the **Dependencies** page, download and install the Microsoft Monitoring Agent (MMA), and the Dependency agent on each VM you want to evaluate.
4. Copy the workspace ID and key. You need these when you install the MMA on the on-premises machine.

### Install the Microsoft Monitoring Agent
To install the agent on a Windows machine:

1. Double-click the downloaded agent.
2. On the **Welcome** page, click **Next**. On the **License Terms** page, click **I Agree** to accept the license.
3. In **Destination Folder**, keep or modify the default installation folder > **Next**. 
4. In **Agent Setup Options**, select **Azure Log Analytics (OMS)** > **Next**. 
5. Click **Add** to add a new OMS workspace. Paste in the workspace ID and key that you copied from the portal. Click **Next**.


To install the agent on a Linux machine:

1. Transfer the appropriate bundle (x86 or x64) to your Linux computer using scp/sftp.
2. Install the bundle by using the --install argument.

    ```sudo sh ./omsagent-<version>.universal.x64.sh --install -w <workspace id> -s <workspace key>```


## Install the Dependency agent
1. To install the Dependency agent on a Windows machine, double-click the setup file and follow the wizard.
2. To install the Dependency agent on a Linux machine, install as root using the following command: 
    ```sh InstallDependencyAgent-Linux64.bin```

## Create a group using group dependency mapping

1. In the **Dashboard** of the Azure Migrate project, click **Groups** > **+Group**, and specify a group name.
2. Add one or more machines to the group, and click **Create**. 
3. After the group is created, you can modify it by adding and removing machines.

    ![Add or remove machines](./media/how-to-create-group-dependencies/add-remove.png)

4. On the group page, click **View Dependencies**, to open the **Dependencies** map.
5. Review machine settings, including:
    - Whether the MMA and the dependency agent are installed, and whether the machine has been discovered.
    - The guest operating system running on the machine.
    - Incoming and outbound IP connections and ports.
    - Processes running on machines.
    - Dependencies between machines.
6. To view more granular dependencies, click the time range to modify it. By default, the range is an hour. You can modify the time range, or specify start and end dates, and duration.
7. Use Ctrl+Click to add and remove machines from the map. Note that adding and removing machines from a group invalidates past assessments for it.
8. Select **Create a new assessment** if you want to run an assessment for the group.
9. Click **OK** to save the group settings.

    ![Create a group with machine dependencies](./media/how-to-create-group-dependencies/create-group.png)

## Next steps

[Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
