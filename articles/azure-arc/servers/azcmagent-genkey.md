---
title: azcmagent genkey CLI reference
description: Syntax for the azcmagent genkey command line tool
author: rpsqrd
ms.topic: reference
ms.author: ryanpu
ms.date: 04/20/2023
---

# azcmagent genkey

Generates a private-public key pair that can be used to onboard a machine asynchronously. This command is reserved for use by Azure Arc virtual machine offerings and is not intended to be directly called by users.

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
