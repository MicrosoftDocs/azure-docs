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

Certificate signing often is a challenge for organizations. The process involves obtaining certificates, securing them, and operationalizing a secure way to integrate certificates into build pipelines.

Trusted Signing is Microsoft fully managed, end-to-end signing solution that simplifies the certificate signing process and helps third-party developers more easily build and distribute applications. This is part of the Microsoft commitment to an open, inclusive, and secure ecosystem.

## Features

The Trusted Signing service has these features:

- Simplifies the signing process through an intuitive experience in Azure.
- Zero-touch certificate lifecycle management that is FIPS 140-2 Level 3 certified HSMs.
- Provides integrations with leading developer toolsets.
- Supports Public Trust, Public Trust test, Private Trust, and CI policy signing scenarios.
- Includes a timestamping service.
- Offers content-confidential signing. Your file never leaves your endpoint, and you get digest signing that is fast and reliable.

## Resource structure

The following figure shows a high-level overview of the Trusted Signing resource structure:

:::image type="content" source="media/trusted-signing-resource-structure-overview.png" alt-text="Diagram that shows the Trusted Signing service resource group and certificate profile structure." border="false":::

You create a resource group within an Azure subscription. You then create a Trusted Signing account within the resource group.

A Trusted Signing account contains two resources:

- Identity validation
- Certificate profile

You can choose between two types of accounts (depending on the SKU you choose):

- Basic
- Premium

## Related content

- Learn more about the [Trusted Signing resource structure](./concept-trusted-signing-resources-roles.md).
- Learn more about [signing integrations](how-to-signing-integrations.md).
- Complete the quickstart to [set up Trusted Signing](quickstart.md).
