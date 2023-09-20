---
title: Moving from agent based Dependency Analysis to agentless dependency analysis
description: Learn how to move from agent-based to agentless dependency analysis
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.topic: tutorial
ms.date: 09/20/2023
ms.service: azure-migrate
ms.custom: MVC, engagement-fy23
#Customer intent: As a VMware VM admin, I want to assess my VMware VMs in preparation for migration to Azure VMware Solution (AVS)
---

# Tutorial: Moving from agent-based dependency analysis to agentless dependency analysis

This article describes how to move from agent based dependency analysis to agentless dependency analysis.

## Before you start

- Ensure that you have [created a project](./create-manage-projects.md) with the Azure Migrate: Discovery and assessment tool added to it and discovery completed.
- Review the requirements based on your environment and the appliance you are setting up to perform software inventory:

    Environment | Requirements
    --- | ---
    Servers running in VMware environment | Review [VMware requirements](migrate-support-matrix-vmware.md#vmware-requirements) <br/> Review [appliance requirements](migrate-appliance.md#appliance---vmware)<br/> Review [port access requirements](migrate-support-matrix-vmware.md#port-access-requirements) <br/> Review [agentless dependency analysis requirements](migrate-support-matrix-vmware.md#dependency-analysis-requirements-agentless)
    Servers running in Hyper-V environment | Review [Hyper-V host requirements](migrate-support-matrix-hyper-v.md#hyper-v-host-requirements) <br/> Review [appliance requirements](migrate-appliance.md#appliance---hyper-v)<br/> Review [port access requirements](migrate-support-matrix-hyper-v.md#port-access)<br/> Review [agentless dependency analysis requirements](migrate-support-matrix-hyper-v.md#dependency-analysis-requirements-agentless)
    Physical servers or servers running on other clouds | Review [server requirements](migrate-support-matrix-physical.md#physical-server-requirements) <br/> Review [appliance requirements](migrate-appliance.md#appliance---physical)<br/> Review [port access requirements](migrate-support-matrix-physical.md#port-access)<br/> Review [agentless dependency analysis requirements](migrate-support-matrix-physical.md#dependency-analysis-requirements-agentless)
- Review the Azure URLs that the appliance will need to access in the [public](migrate-appliance.md#public-cloud-urls) and [government clouds](migrate-appliance.md#government-cloud-urls).

## Steps to move from Agent-based Dependency analysis to agentless Dependency analysis
### Scenario 1: Your appliance is already configured with the credentials required for agentless dependency analysis.

 1. You can start [dependency discovery](https://learn.microsoft.com/en-us/azure/migrate/how-to-create-group-machine-dependencies-agentless#start-dependency-discovery).

 2. You can [visualize dependencies](https://learn.microsoft.com/en-us/azure/migrate/how-to-create-group-machine-dependencies-agentless#visualize-dependencies) around six hours after enabling dependency analysis on servers. If you want to simultaneously enable multiple servers for dependency analysis, you can use PowerShell to do so.

### Scenario 2: Your appliance is not configured with the credentials required for agentless dependency analysis.
1. [Add credentials](https://learn.microsoft.com/en-us/azure/migrate/how-to-create-group-machine-dependencies-agentless#add-credentials-and-initiate-discovery) needed for dependency analysis.
2. Wait for 24 hours.
3. Perform steps from 1-2 from Scenario 1.

Refer [Analyze server dependencies (agentless)](https://learn.microsoft.com/en-us/azure/migrate/how-to-create-group-machine-dependencies-agentless) to perform export dependency data, stop dependency discovery, Visualize network connection in powerBI.

## Next steps

- [Group servers](https://learn.microsoft.com/en-us/azure/migrate/how-to-create-a-group) for assessment.
