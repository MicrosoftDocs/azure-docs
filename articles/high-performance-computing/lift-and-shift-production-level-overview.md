---
title: "Production-level environment migration guide overview"
description: Learn about what a production-level environment migration entails.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Production-level environment migration guide overview

When you move an HPC infrastructure from the on-premises environment to the cloud, there are various aspects to be taken into account. This document provides guidance on how to create such HPC environment in the cloud. We recommend
a two-phase approach. First, a proof-of-concept, and then a production-level environment. Once the production environment is up and running, only certain components should be modified over time, including changes on VM types and storage capabilities to best meet the varying requirements of users, projects, and business.

In this article and the following articles, we guide you through a product-level environment migration.

## Prerequisites

You need an Azure subscription to provision cloud resources.

## Migrating from on-premises to the cloud: production level

After the proof-of-concept phase, planning is required to get ready for creating a production-level HPC environment. This new environment can represent part of the on-premises infrastructure (for example, an HPC cluster from a group of clusters or queue/partition from an existing cluster), or the entire computing capability.

Due to component dependencies, the deployment of this HPC cloud environment is based on a sequence of deployments, which consists of:

1. Basic infrastructure, which includes creation of a resource group, network access and
   network security rules;
1. Base services, which include identity management, job scheduler and resource;
   provisioner, along with their respective configurations;
1. Storage;
1. Compute nodes' specifications;
1. End user entry point.

In the following articles, we cover each deployment step and the components involved. In the descriptions of the components, we highlight their relevant dependencies in more detail. It's also worth noting that the component deployment steps can be executed in several ways. We provide a few tips to help get started with the deployment components via the Azure portal. But at a production level, we recommend the creation of an environment deployer that leverages infrastructure-as-code (for example, via bicep, Terraform, or Azure CLI). By doing so, one can create an environment in an automated and replicable fashion.

For each step, certain topics need to be assessed before starting the migration process.
