---
title: How to develop a custom machine configuration package
description: Learn how to author and validate custom machine configuration packages to audit and enforce state.
ms.date: 02/01/2024
ms.topic: how-to
---
# How to develop a custom machine configuration package

Before you begin, it's a good idea to read the overview page for [machine configuration][01].

Machine configuration uses [Desired State Configuration][02] (DSC) when auditing and configuring
both Windows and Linux. The DSC configuration defines the condition that the machine should be in.

> [!IMPORTANT]
> Custom packages that audit the state of an environment and apply configurations are in Generally
> Available (GA) support status. However, the following limitations apply:
>
> To use machine configuration packages that apply configurations, Azure VM guest configuration
> extension version 1.26.24 or later, or Arc agent 1.10.0 or later, is required.
>
> The **GuestConfiguration** module is only available on Ubuntu 18 and later. However, the package
> and policies produced by the module can be used on any Linux distribution and version supported
> in Azure or Arc.
>
> Testing packages on macOS isn't available.
>
> Don't use secrets or confidential information in custom content packages.

Use the following steps to develop your own configuration for managing the state of an Azure or
non-Azure machine.

1. [Set up a machine configuration authoring environment][03]
1. [Create a custom machine configuration package artifact][04]
1. [Test the package artifact][05]
1. [Publish the package artifact][06]
1. [Sign the package artifact][07]

<!-- Link reference definitions -->
[01]: ../../overview.md
[02]: /powershell/dsc/overview
[03]: ./1-set-up-authoring-environment.md
[04]: ./2-create-package.md
[05]: ./3-test-package.md
[06]: ./4-publish-package.md
[07]: ./5-sign-package.md
