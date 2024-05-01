---
title: What is Trusted Signing?
description: Learn about the Trusted Signing service. 
author: microsoftshawarma
ms.author: rakiasegev
ms.topic: overview
ms.service: azure-code-signing
ms.date: 03/21/2024
ms.custom: template-overview
---

# What is Trusted Signing?

Certificate signing is often a challenge. The process involves obtaining certificates, securing them, and operationalizing a secure way to integrate certificates with build pipelines.

Trusted Signing is a Microsoft fully managed, end-to-end signing solution that simplifies the process and empowers third-party developers to easily build and distribute applications. This is part of the Microsoft commitment to an open, inclusive, and secure ecosystem.

## Features

* Simplifies the signing process with an intuitive experience in Azure.
* Zero-touch certificate lifecycle management that is FIPS 140-2 Level 3 compliant.
* Integrations into leading developer toolsets.
* Supports Public Trust, Test, Private Trust, and CI policy signing scenarios.
* Timestamping service.
* Content-confidential signing, so your file never leaves your endpoint and you get digest signing that is fast and reliable.

## Resource structure

Here’s a high-level overview of the service’s resource structure:

![Diagram of Azure Code Signing resource group and cert profiles.](./media/trusted-signing-resource-structure-overview.png)

* You create a resource group within a subscription. You then create a Trusted Signing account within the resource group.
* Two resources within an account:
  * Identity validation
  * Certificate profile
* Two types of accounts (depending on the SKU you choose):
  * Basic
  * Premium

## Next steps

* [Learn more about the Trusted Signing resource structure](./concept-trusted-signing-resources-roles.md).
* [Learn more about the signing integrations](how-to-signing-integrations.md).
* [Get started with Trusted Signing](quickstart.md).
