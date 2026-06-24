---
title: Known issues for template specs
description: Learn about the known limitations and known issues for Azure Resource Manager template specs, and the recommended workarounds.
ms.topic: troubleshooting-known-issue
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template, devx-track-bicep
ms.date: 06/11/2026
---

# Known issues for template specs

This article lists known limitations and known issues for [Azure Resource Manager template specs](./template-specs.md),
along with recommended workarounds when available.

## Known limitations

- **Maximum size.** The size of a template spec is limited to approximately **2 MB**. If a template
  spec exceeds the limit, you get the **TemplateSpecTooLarge** error code. For large template specs
  with many artifacts, split it into multiple template specs and reference them modularly through
  template links.
- **No Bicep import from the portal.** You can't import a Bicep file from the Azure portal to create
  a template spec resource at this time. Use Azure CLI or Azure PowerShell to create template specs
  from Bicep files. The Bicep files are transpiled into JSON ARM templates before they're stored.
- **Embedded non-template artifacts aren't packaged.** Bicep can embed some project artifacts
  such as PowerShell scripts, CLI scripts, and other binaries by using the
  [`loadTextContent`](./bicep-functions-files.md#loadtextcontent) and
  [`loadFileAsBase64`](./bicep-functions-files.md#loadfileasbase64) functions. Template specs can't
  package these artifacts.

## Known issues

- **`.bicepparam` deployment isn't supported in Azure PowerShell.** You can't use Azure PowerShell
  to deploy a template spec with a [`.bicepparam` file](./parameter-files.md) at this time. Use
  Azure CLI, or supply parameters with a JSON parameters file.

## TemplateSpecTooLarge error

When a template spec exceeds the size limit, you receive an error similar to the following error message:

```error
The size of the template spec content exceeds the maximum limit.
```

To work around the limit, split the template into multiple template specs and reference the linked
templates modularly through template links. For more information, see
[Create a linked template](./template-specs.md).

## Next steps

- [Azure Resource Manager template specs in Bicep](./template-specs.md)
- [Known issues for deployment stacks](./deployment-stacks-known-issues.md)
