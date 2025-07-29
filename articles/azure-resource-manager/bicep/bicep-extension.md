---
title: Use extensions in Bicep
description: This article describes how to use Bicep extensions.
ms.topic: conceptual
ms.custom:
  - devx-track-bicep
  - build-2025
ms.date: 05/14/2025
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

## Related content

- To learn about Bicep data types, see [Data types](./data-types.md).
- To learn about Bicep functions, see [Bicep functions](./bicep-functions.md).
- To learn how to use the Bicep Kubernetes extension, see [Bicep Kubernetes extension](./bicep-kubernetes-extension.md).
- To go through a Kubernetes extension tutorial, see [Quickstart: Deploy Azure applications to Azure Kubernetes Services by using the Bicep Kubernetes extension](/azure/aks/learn/quick-kubernetes-deploy-bicep-kubernetes-extension).
- To learn Microsoft Graph extension, see [Microsoft Graph extension](https://aka.ms/graphbicep).
