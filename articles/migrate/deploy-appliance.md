---
title: Set up an Azure Migrate applianc
description: Learn how to set up an Azure Migrate appliance to assess and migrate VMware VMs.
ms.topic: article
ms.date: 11/18/2019
---


# Set up an Azure Migrate appliance

This article summarizes options for setting up the Azure Migrate appliance. 

The Azure Migrate appliance is a lightweight appliance deployment on-premises, and is used in a number of scenarios.

**Scenario** | **Details**
--- | ---
Assess VMware VMs with Azure Migrate:Server Assessment | Discover VM apps and dependencies<br/><br/> Collect machine metadata and performance metadata for assessments.
Assess Hyper-V VMs with Azure Migrate:Server Assessment | Discover Hyper-V VMs<br/><br/> Collect machine metadata and performance metadata for assessments.
Assess physical machines | Discover machines as physical servers<br/><br/> Collect machine metadata and performance metadata for assessments.
Replicate VMware VMs with agentless migration. | Replicate VMware VMs without installing anything on the VMs you want to replicate.


## Deployment options

You can deploy the appliance in a couple of ways.

**Scenario** | **Template** | **Script** 
--- | --- | --- | ---
**Assess VMware VMs** | Deploy with a downloaded OVA template.<br/><br/> Learn how to deploy the appliance [using a template](how-to-set-up-appliance-vmware.md), or start the [assessment tutorial](tutorial-prepare-vmware.md) and deploy the appliance with a template during the tutorial.  | Deploy using a PowerShell installer script.<br/><br/>  [Review](deploy-appliance-script.md) appliance script instructions.
**Assess Hyper-V VMs** | Deploy with a downloaded VHD template. <br/><br/> Learn how to deploy the appliance [using a template](how-to-set-up-appliance-vmware.md), or start the [assessment tutorial](tutorial-prepare-vmware.md) and deploy the appliance with a template during the tutorial. | Deploy using a PowerShell installer script.<br/><br/> [Review](deploy-appliance-script.md) appliance script instructions. 
**Assess physical servers** | No template. | Deploy using a PowerShell installer script.<br/><br/> Review [appliance script instructions](how-to-set-up-appliance-physical.md), or start the [assessment tutorial](tutorial-prepare-physical.md), and deploy the appliance during the tutorial.
**Replicate VMware VMs (agentless)** | Deploy with a downloaded OVA template.<br/><br/> If you've already assessed VMs you replicate, then you've already set up the appliance during assessment.<br/><br/> If you replicate VMware VMs without assessing them, learn how to deploy the appliance using a template, or start the [agentless migration tutorial](tutorial-migrate-vmware.md), and deploy the appliance with a template during the tutorial. | Deploy using a PowerShell installer script. <br/><br/> [Review](deploy-appliance-script.md) appliance script instructions. 




## Next steps

[Review](migrate-appliance.md) appliance requirements.