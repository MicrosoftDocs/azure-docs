---
title: azcmagent genkey CLI reference
description: Syntax for the azcmagent genkey command line tool
ms.topic: reference
ms.date: 04/20/2023
---

# azcmagent genkey

Generates a private-public key pair that can be used to onboard a machine asynchronously. This command is used when connecting a server to an Azure Arc-enabled virtual machine offering (VMware vSphere, Azure Stack HCI, or System Center VMM). It is not intended for use by end users.

## Usage

```
azcmagent genkey [flags]
```

## Examples

Generate a key pair and print the public key to the console.

```
azcmagent genkey
```

## Flags

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]
