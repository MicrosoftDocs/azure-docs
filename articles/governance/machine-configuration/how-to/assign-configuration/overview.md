---
title: How to create a machine configuration assignment using templates
description: Learn how to deploy configurations to machines using different template tools.
ms.date: 05/08/2025
ms.topic: how-to
ms.custom:
---

# How to create a machine configuration assignment using templates

The best way to [assign machine configuration packages][01] to multiple machines is using
[Azure Policy][02]. You can also assign machine configuration packages to a single machine.

## Built-in and custom configurations

To assign a machine configuration package to a single machine, modify the following examples. There
are two scenarios for each tool.

- Apply a custom configuration to a machine using a link to a package that you [published][03].
- Apply a [built-in][10] configuration to a machine, such as an Azure baseline.

See the following articles for examples of assigning configurations using different tools:

- [How to assign a configuration using an Azure Resource Manager template][05]
- [How to assign a configuration using Bicep][06]
- [How to assign a configuration using Terraform][08]
- [How to assign a configuration using the Rest API][07]

## Next steps

- [Develop a custom package][04] for machine configuration.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][02] for at-scale
  management of your environment.
- [Assign your custom policy definition][09] using Azure portal.

<!-- link references -->
[01]: ../../concepts/assignments.md
[02]: ../create-policy-definition.md
[03]: ../develop-custom-package/4-publish-package.md
[04]: ../develop-custom-package/overview.md
[05]: ./azure-resource-manager.md
[06]: ./bicep.md
[07]: ./rest-api.md
[08]: ./terraform.md
[09]: /azure/governance/policy/assign-policy-portal
[10]: /azure/governance/policy/samples/built-in-packages
