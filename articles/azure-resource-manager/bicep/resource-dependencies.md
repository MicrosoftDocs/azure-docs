---
title: Set resource dependencies in Bicep
description: Describes how to specify the order resources are deployed.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 02/03/2022
---

# Resource dependencies in Bicep

When deploying resources, you may need to make sure some resources exist before other resources. For example, you need a logical SQL server before deploying a database. You establish this relationship by marking one resource as dependent on the other resource. Order of resource deployment can be influenced in two ways: [implicit dependency](#implicit-dependency) and [explicit dependency](#explicit-dependency)

Azure Resource Manager evaluates the dependencies between resources, and deploys them in their dependent order. When resources aren't dependent on each other, Resource Manager deploys them in parallel. You only need to define dependencies for resources that are deployed in the same Bicep file.

## Implicit dependency

An implicit dependency is created when one resource declaration references another resource in the same deployment. For example, *dnsZone* is referenced by the second resource definition in the following example:

```bicep
resource dnsZone 'Microsoft.Network/dnszones@2018-05-01' = {
  name: 'myZone'
  location: 'global'
}

resource otherResource 'Microsoft.Example/examples@2020-06-01' = {
  name: 'exampleResource'
  properties: {
    // get read-only DNS zone property
    nameServers: dnsZone.properties.nameServers
  }
}
```

A nested resource also has an implicit dependency on its containing resource.

```bicep
resource myParent 'My.Rp/parentType@2020-01-01' = {
  name: 'myParent'
  location: 'West US'

  // depends on 'myParent' implicitly
  resource myChild 'childType' = {
    name: 'myChild'
  }
}
```

When an implicit dependency exists, **don't add an explicit dependency**.

For more information about nested resources, see [Set name and type for child resources in Bicep](./child-resource-name-type.md).

## Explicit dependency

An explicit dependency is declared with the `dependsOn` property. The property accepts an array of resource identifiers, so you can specify more than one dependency.

The following example shows a DNS zone named `otherZone` that depends on a DNS zone named `dnsZone`:

```bicep
resource dnsZone 'Microsoft.Network/dnszones@2018-05-01' = {
  name: 'demoeZone1'
  location: 'global'
}

resource otherZone 'Microsoft.Network/dnszones@2018-05-01' = {
  name: 'demoZone2'
  location: 'global'
  dependsOn: [
    dnsZone
  ]
}
```

While you may be inclined to use `dependsOn` to map relationships between your resources, it's important to understand why you're doing it. For example, to document how resources are interconnected, `dependsOn` isn't the right approach. You can't query which resources were defined in the `dependsOn` element after deployment. Setting unnecessary dependencies slows deployment time because Resource Manager can't deploy those resources in parallel.

Even though explicit dependencies are sometimes required, the need for them is rare. In most cases, you can use a symbolic name to imply the dependency between resources. If you find yourself setting explicit dependencies, you should consider if there's a way to remove it.

## Visualize dependencies

Visual Studio Code provides a tool for visualizing the dependencies. Open a Bicep file in Visual Studio Code, and then select the visualizer button on the upper left corner.  The following screenshot shows the dependencies of a virtual machine.

:::image type="content" source="./media/resource-declaration/bicep-resource-visualizer.png" alt-text="Screenshot of Visual Studio Code Bicep resource visualizer":::

## Next steps

- To conditionally deploy a resource, see [Conditional deployment in Bicep](./conditional-resource-deployment.md).
