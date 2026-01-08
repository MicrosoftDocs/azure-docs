---
title: What is Artifact Signing?
description: Learn about Artifact Signing in Azure. 
author: TacoTechSharma
ms.author: mesharm
ms.topic: overview
ms.service: trusted-signing
ms.date: 01/02/2026
ms.custom:
  - template-overview
  - sfi-image-nochange
---

# What is Artifact Signing?

Certificate signing can be a challenge for organizations. The process involves getting certificates, securing them, and operationalizing a secure way to integrate certificates into build pipelines.

Artifact Signing is a Microsoft fully managed, end-to-end signing solution that simplifies the certificate signing process and helps partner developers more easily build and distribute applications. Artifact Signing is part of the Microsoft commitment to an open, inclusive, and secure ecosystem.

## Features

The Artifact Signing service:

- Simplifies the signing process through an intuitive experience in Azure.
- Provides zero-touch certificate lifecycle management inside FIPS 140-2 Level 3 certified HSMs.
- Integrates with leading developer toolsets.
- Supports Public Trust, Private Trust, virtualization-based security (VBS) enclave, code integrity (CI) policy, and test signing scenarios.
- Includes a timestamping service.
- Offers content-confidential signing. Your file never leaves your endpoint, and you get digest signing that is fast and reliable.

## Resource structure

The following figure shows a high-level overview of the Artifact Signing resource structure:

:::image type="content" source="media/artifact-signing-resource-structure-overview.png" alt-text="Diagram that shows the Artifact Signing resource group and certificate profile structure." border="false":::

You create a resource group in an Azure subscription. Then you create an Artifact Signing account inside the resource group.

An Artifact Signing account contains two resources:

- Identity validation
- Certificate profile

You can choose between two types of accounts:

- Basic SKU
- Premium SKU

## Related content

- Learn more about the [Artifact Signing resource structure](./concept-resources-roles.md).
- Learn more about [signing integrations](how-to-signing-integrations.md) for Artifact Signing.
- Complete the quickstart to [set up Artifact Signing](quickstart.md).
