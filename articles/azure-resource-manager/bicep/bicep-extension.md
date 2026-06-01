---
title: Use extensions in Bicep
description: This article describes how to use Bicep extensions.
ms.topic: article
ms.custom:
  - devx-track-bicep
  - build-2025
ms.date: 06/01/2026
---

# Use Bicep extensions

Bicep was initially created to enhance the authoring experience compared to Azure Resource Manager JSON templates, simplifying the deployment and management of Azure resources. Bicep extensions build on this foundation, enabling Bicep files to reference resources beyond the scope of Azure Resource Manager. This article describes how to use Bicep extensions.

The syntax for importing Bicep extensions is:

```bicep
extension <extension-name>
```

The syntax for importing Bicep extensions, which require configuration is:

```bicep
extension <extension-name> with {
  <extension-properties>
}
```

For examples, see [Bicep Kubernetes extension](./bicep-kubernetes-extension.md) and [Microsoft Graph extension](https://aka.ms/graphbicep).

## Troubleshooting

Your deployment might fail with a 401 AuthenticationFailed error when you attempts to use the Graph extension (or any Bicep extension requiring the [OAuth On-Behalf-Of flow](/entra/identity-platform/v2-oauth2-on-behalf-of-flow.md) ) within a nested module under specific conditions.

This limitation occurs specifically when the nested module meets one of the following criteria:

- It is configured as a Template Spec.
- It utilizes [templateLink](), where the parent template is authored manually rather than generated via Bicep.

In these scenarios, the required authentication handshake for the extension can't be completed, leading to the deployment failure.

As a workaround, you can import the extension at the root Bicep file level. For example:

```bicep
extension microsoftGraphV1

module graphModule 'ts/mySpecs:graph-module:1.0.0' = { // Uses the Graph extension internally
  params: {
    ...
  }
}
```

## Related content

- To learn about Bicep data types, see [Data types](./data-types.md).
- To learn about Bicep functions, see [Bicep functions](./bicep-functions.md).
- To learn how to use the Bicep Kubernetes extension, see [Bicep Kubernetes extension](./bicep-kubernetes-extension.md).
- To go through a Kubernetes extension tutorial, see [Quickstart: Deploy Azure applications to Azure Kubernetes Services by using the Bicep Kubernetes extension](/azure/aks/learn/quick-kubernetes-deploy-bicep-kubernetes-extension).
- To learn about the Microsoft Graph extension, see [Microsoft Graph extension](https://aka.ms/graphbicep).
