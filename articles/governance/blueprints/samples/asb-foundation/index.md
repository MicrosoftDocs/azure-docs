---
title: Azure Security Benchmark Foundation blueprint sample overview
description: Overview and architecture of the Azure Security Benchmark Foundation blueprint sample.
ms.date: 01/13/2020
ms.topic: sample
---
# Overview of the Azure Security Benchmark Foundation blueprint sample

The Azure Security Benchmark Foundation blueprint [TBD]

## Architecture

The Azure Security Benchmark Foundation blueprint sample deploys [TBD]

[NEED REFERENCE ARCHITECTURE IMAGE]

[NEED DESCRIPTION OF COMPONENTS / AZURE SERVICES]

This implementation incorporates several Azure services used to provide a secure, fully monitored,
enterprise-ready foundation. This environment is composed of:

- An [Azure Key Vault](../../../../key-vault/general/overview.md) instance used to host secrets
  used for the VMs deployed in the shared services environment
- Deploy [Log Analytics](../../../../azure-monitor/overview.md) is deployed to ensure all actions
  and services log to a central location from the moment you start your secure deployment in to
  [Storage Accounts](../../../../storage/common/storage-introduction.md) for diagnostic logging
- Deploy [Azure Security Center](../../../../security-center/security-center-introduction.md) (standard
  version) provides threat protection for your migrated workloads
- The blueprint also defines and deploys [Azure Policy](../../../policy/overview.md) definitions:
  - Policy definitions:
    - Tagging (CostCenter) applied to resources groups
    - Append resources in resource group with the CostCenter Tag
    - Allowed Azure Region for Resources and Resource Groups
    - Allowed Storage Account SKUs (choose while deploying)
    - Allowed Azure VM SKUs (choose while deploying)
    - Require Network Watcher to be deployed 
    - Require Azure Storage Account Secure transfer Encryption
    - Deny resource types (choose while deploying)  
  - Policy initiatives:
    - Enable Monitoring in Azure Security Center (100+ policy definitions)

> [!NOTE]
> The Azure Security Benchmark Foundation lays out a foundational architecture for workloads.
> You still need to deploy workloads behind this foundational architecture.

## Next steps

You've reviewed the overview and architecture of the Azure Security Benchmark Foundation blueprint sample.

> [!div class="nextstepaction"]
> [Azure Security Benchmark Foundation blueprint - Deploy steps](./deploy.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).