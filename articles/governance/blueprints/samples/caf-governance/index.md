---
title: Samples - CAF foundation blueprint - Overview
description: Overview and architecture of the CAF foundation blueprint sample.
author: dacoulte
ms.author: dacoulte
ms.date: 06/27/2019
ms.topic: sample
ms.service: blueprints
manager: carmonm
ms.custom: fasttrack-new
---
# Overview of the Microsoft Cloud Adoption Framework for Azure foundation blueprint sample

The Microsoft Cloud Adoption Framework for Azure(CAF) foundation blueprint is a set of controls to help you manage your cloud estate in alignment with the CAF.

## Architecture

The CAF foundation blueprint sample deploys recommended infrastructure resources in Azure that can
be used by organizations to put in place the foundation controls necessary to manage their cloud estate.
This sample will deploy and enforce resources, policies and templates that will allow an organization to confidently get started with Azure.

![CAF foundation, image describes what gets installed as part of CAF guidance for creating a foundation to get started with Azure](../../media/caf-blueprints/caf-governance-architecture.png)

This environment is composed of several Azure services used to provide a secure, fully monitored,
enterprise-ready foundation. This environment is
composed of:

- An [Azure Key Vault](../../../../key-vault/key-vault-whatis.md) instance used to host secrets used
  for the VMs deployed in the shared services environment
- Deploy [Log Analytics](../../../../azure-monitor/overview.md) for the
    entire environment
- Deploy [Azure Security Center](../../../../security-center/security-center-intro.md),
    standard.
- Deploy [Azure Virtual Network](../../../../virtual-network/virtual-networks-overview.md) Hub

The blueprint also defines and deploys [Azure Policies](../../../policy/overview.md), for 
- Tagging (CostCenter) 
    - Tag Resource Group
    - Append resources in resource group with the CostCenter Tag
    - Allowed Azure Region for Resources
	- Allowed Storage Account SKUs
	- Allowed Azure VM SKUs	
	- Allowed Azure Resource Types
	- Require Network Watch to be deployed 
	- Require Azure Storage Account Secure transfer Encryption
 - Initiatives
     - Enable Monitoring in Azure Security Center (78 Policies)

All these elements abide to the proven practices published in the [Azure Architecture Center - Reference Architectures](/azure/architecture/reference-architectures/).

> [!NOTE]
> The CAF foundation lays out a foundational architecture for workloads.
> You still need to deploy workloads behind this foundational architecture.

For more information, see the [Microsoft Cloud Adoption Framework for Azure](/azure/architecture/cloud-adoption/).

## Next steps

You've reviewed the overview and architecture of the CAF foundation blueprint sample.

> [!div class="nextstepaction"]
>  [CAF foundation blueprint - Deploy steps](./deploy.md)

Addition articles about blueprints and how to use them:

- Learn about the [blueprint life-cycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).