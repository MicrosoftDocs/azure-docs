---
title: Resource naming guidelines for Microsoft Discovery
description: Learn the naming rules and best practices for Microsoft Discovery resources, including character limits, allowed characters, and patterns for each resource type.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: concept-article
ms.date: 03/12/2026
---

# Resource naming guidelines for Microsoft Discovery

Microsoft Discovery includes multiple resource types, some with dependencies on resources in other resource providers. By understanding resource naming constraints, you can improve clarity, prevent conflicts, enable automation, and support governance and security.

In this article, you learn the naming rules for all resource types within Microsoft Discovery. This guidance helps you make informed decisions and avoid deployment errors.

## General naming guidelines

The following rules apply to all Microsoft Discovery resources unless a resource-specific section states otherwise:

- **Uniqueness:** Resource names must be unique within their scope (subscription or resource group).
- **Predictability:** Use consistent naming patterns to facilitate automation and integration.
- **Allowed characters:** Names must use only alphanumeric characters. Names must not start with a number.
- **Case sensitivity:** Resource names are case-insensitive but must be entered and stored in lowercase for consistency.
- **Length:** Each resource type defines its own minimum and maximum length. Exceeding those limits results in a deployment error.
- **No spaces or special characters:** Resource names can't include whitespace or special characters, except for hyphens (`-`) unless stated otherwise.
- **No consecutive separators:** Multiple hyphens, underscores, or other separators must not appear consecutively.

## Managed Resource Group naming conventions

When certain Discovery resources are created, corresponding Managed Resource Groups (MRGs) are automatically provisioned to host the service components required to support those resources. The following naming conventions apply to these MRGs:

| Resource type | Naming convention | Example |
|---|---|---|
| Microsoft Discovery Workspace | `mrg-dwsp-<customer-provided-name>-<6-char-random-sequence>` | `mrg-dwsp-testWorkspace-abcdef` |
| Microsoft Discovery Bookshelf | `mrg-dbksf-<customer-provided-name>-<6-char-random-sequence>` | `mrg-dbksf-testBookshelf-lmnopq` |
| Microsoft Discovery Supercomputer | `mrg-dscmp-<customer-provided-name>-<6-char-random-sequence>` | `mrg-dscmp-testSC-abcxyz` |

## Resource-specific naming rules

The following sections describe the naming rules for each Microsoft Discovery resource type.

### Workspaces

The workspace name is also used as the workspace endpoint subdomain name.

| Property | Value |
|---|---|
| Allowed characters | Lowercase letters (`a`–`z`), digits (`0`–`9`), hyphens (`-`) |
| Length | 3–24 characters |
| Pattern | Must start with a letter; Can include digits and hyphens; must end with a letter or digit |
| Examples | `workspace01`, `workspace-main` |

### Projects

| Property | Value |
|---|---|
| Allowed characters | Lowercase letters, digits, hyphens (`-`) |
| Length | 3–12 characters |
| Pattern | Must start with a letter; hyphens can be used as word separators |
| Examples | `ai-project`, `adhesives01` |

### Supercomputers

| Property | Value |
|---|---|
| Allowed characters | Lowercase letters, digits, hyphens (`-`) |
| Length | 3–24 characters |
| Pattern | Must start with a letter; hyphens are allowed as separators; must end with a letter or digit |
| Examples | `quantum-supercomputer`, `supercomputer01` |

### NodePools

| Property | Value |
|---|---|
| Allowed characters | Lowercase letters (`a`–`z`), digits (`0`–`9`), hyphens (`-`) |
| Length | 3–12 characters |
| Pattern | Must start with a letter; Can include digits and hyphens; must end with a letter or digit |
| Examples | `nodepool01`, `gpu-nodepool` |

### Tools

| Property | Value |
|---|---|
| Allowed characters | Uppercase or lowercase letters, digits, hyphens (`-`) |
| Length | 3–24 characters |
| Pattern | Must start with a letter; hyphens are used as separators; must end with a letter or digit |
| Examples | `adft-tool`, `mol-toolkit` |

### Agents

| Property | Value |
|---|---|
| Allowed characters | Uppercase or lowercase letters, digits, hyphens (`-`) |
| Length | 3–63 characters |
| Pattern | Must start and end with an alphanumeric character (letter or digit); hyphens can be used in the middle |
| Examples | `search-agent`, `crawler-agent` |

### Storage Containers

| Property | Value |
|---|---|
| Allowed characters | Lowercase letters, digits, hyphens (`-`) |
| Length | 3–24 characters |
| Pattern | Must start and end with a letter; hyphens are optional word dividers |
| Examples | `contoso-datacontainer`, `archivecontainer` |

### Storage Assets

| Property | Value |
|---|---|
| Allowed characters | Lowercase letters (`a`–`z`), digits (`0`–`9`), hyphens (`-`) |
| Length | 3–24 characters |
| Pattern | Must start with a letter; Can include digits and hyphens; must end with a letter or digit |
| Examples | `input-molecules-01`, `outputData` |

### Investigations

| Property | Value |
|---|---|
| Allowed characters | Lowercase letters, digits, hyphens (`-`) |
| Length | 1–20 characters |
| Pattern | Must start and end with a letter; hyphens serve as word separators |
| Examples | `chemistry-investigation`, `anomaly-investigation` |

## Internationalization and localization

Use English terms and ASCII characters for all resource names to ensure maximum compatibility across systems and global regions. If localization is necessary, use a mapping table or metadata field rather than encoding localized names directly in the resource name.

## Validation and error handling

All resource names are validated before creation or modification. Validation includes:

- **Syntax checking:** Length, allowed characters, and prohibition on consecutive separators.
- **Uniqueness checking:** Verified within the appropriate scope (subscription or resource group).

When using the Azure portal or Microsoft Discovery Studio, explicit error messages appear in real time when a naming constraint is violated. Correct the input according to the rules for the specific resource type before retrying.

## Related content

- [Overview of Microsoft Discovery](overview-what-is-microsoft-discovery.md)
