---
title: "Proof-of-concept migration overview"
description: Learn about what a proof-of-concept migration entails and follow the guide through one.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Proof-of-concept migration overview

When you move an HPC infrastructure from the on-premises environment to the cloud, there are various aspects to be taken into account. This document provides guidance on how to create such HPC environment in the cloud. We recommend
a two-phase approach. First, a proof-of-concept, and then a production-level environment. Once the production environment is up and running, only certain components should be modified over time, including changes on VM types and storage capabilities to best meet the varying requirements of users, projects, and business.

In this article, we guide you through a proof-of-concept migration.

## Prerequisites

You need an Azure subscription to provision cloud resources.

## Migrating from on-premises to the cloud: proof-of-concept (PoC)

We recommend starting with a proof-of-concept (PoC) by provisioning a simple cluster in Azure, using Azure CycleCloud as a resource orchestrator, with one well-known scheduler, such as Slurm, PBS, or LSF. This approach allows one to start understanding Azure technology, assess the functionality of user applications, and investigate performance/costs trade-offs in comparison to the on-premises environment.

If one is flexible with the job scheduler, or already uses Slurm scheduler, we recommend using Azure CycleCloud Slurm workspace, which is an offering that helps create a CycleCloud based cluster, with Slurm scheduler, and the basic setup for networking and storage options available. Some details on this process are available in the Resource Orchestrator section from this document.
