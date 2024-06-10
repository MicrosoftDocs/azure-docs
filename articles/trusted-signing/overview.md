---
title: What is Trusted Signing?
description: Learn about the Trusted Signing service in Azure. 
author: microsoftshawarma
ms.author: rakiasegev
ms.topic: overview
ms.service: trusted-signing
ms.date: 03/21/2024
ms.custom: template-overview
---

# What is Trusted Signing?

Certificate signing can be a challenge for organizations. The process involves getting certificates, securing them, and operationalizing a secure way to integrate certificates into build pipelines.

Trusted Signing is a Microsoft fully managed, end-to-end signing solution that simplifies the certificate signing process and helps partner developers more easily build and distribute applications. Trusted Signing is part of the Microsoft commitment to an open, inclusive, and secure ecosystem.

## Features

The Trusted Signing service:

- Simplifies the signing process through an intuitive experience in Azure.
- Provides zero-touch certificate lifecycle management inside FIPS 140-2 Level 3 certified HSMs.
- Integrates with leading developer toolsets.
- Supports Public Trust, Private Trust, virtualization-based security (VBS) enclave, code integrity (CI) policy, and test signing scenarios.
- Includes a timestamping service.
- Offers content-confidential signing. Your file never leaves your endpoint, and you get digest signing that is fast and reliable.

## Resource structure

The following figure shows a high-level overview of the Trusted Signing resource structure:

:::image type="content" source="media/trusted-signing-resource-structure-overview.png" alt-text="Diagram that shows the Trusted Signing service resource group and certificate profile structure." border="false":::

You create a resource group in an Azure subscription. Then you create a Trusted Signing account inside the resource group.

A Trusted Signing account contains two resources:

- Identity validation
- Certificate profile

You can choose between two types of accounts:

- Basic SKU
- Premium SKU

## Related content

- Learn more about the [Trusted Signing resource structure](./concept-trusted-signing-resources-roles.md).
- Learn more about [signing integrations](how-to-signing-integrations.md) for the Trusted Signing service.
- Complete the quickstart to [set up Trusted Signing](quickstart.md).
