---
title: Cut planes
description: Explains what cut planes are and how they can be created through API
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Cut planes

A cut plane is a visual feature that clips each pixel on one side of a virtual, infinite plane thus revealing the inside of a mesh.
The following image shows a car model with a horizontal cut plane added on the right side:

![Cut plane](./media/cutplane-1.png)

Each cut plane effect can have an arbitrary spatial location and orientation in the scene.
For presentation purposes, there are some additional parameters that affect the visuals of the cut itself, such as fading color and fading distance. It is also important to note that each cut plane affects all remotely rendered objects likewise - there is currently no way to exclude meshes or mesh parts.

## Adding cut planes to the scene programmatically

Since a cut plane is implemented as a component, it must be attached to a game object. This game object serves as the spatial location and orientation of the plane. Here is some code to create a new cut plane component programmatically:

```cs
    // Get the connected azure session via application logic
    AzureSession session = GetRenderingSession();

    CutPlaneComponent cutplane = (CutPlaneComponent)session.Actions.CreateComponent(ObjectType.CutPlaneComponent, OwnerEntity);
    cutPlane.Normal = Axis.X; // normal points along the positive x-axis of the owner object's orientation
    cutPlane.FadeColor = new ColorUb(255,0,0,128); // fade to 50% red
    cutPlane.FadeLength = 0.05f; // gradient width: 5cm

```

## Performance considerations

Cut planes do not come for free. Each active cut plane adds a small fixed cost to the rendering but usually this is not noticeable since the rendering performance increases substantially as scene objects are cut. Still, in light of this fact it is a best practice to disable or delete cut planes if they are unused instead of, for example, moving them far away from the objects. Respectively, performance will be unaffected if no cut plane is enabled.

## Cut plane properties

The following properties are exposed on a cut plane component:

### Enabling

As with all other components, cut planes support enabling and disabling. The result of disabling a cut plane will be comparable to deleting the cut plane i.e. it won't be applied to the scene anymore. In contrast to deletion, disabled cut planes still retain their properties and will be applied again if re-enabled. Currently, there is a limit of eight globally enabled cut planes, meaning newly created cut planes won't be automatically enabled if this limit is already reached and the enabling of existing disabled cut planes will fail. To be able to enable another cut plane again one or more currently enabled cut planes will need to be disabled.

### Normal

The normal is a cartesian direction (+X,-X,+Y,-Y,+Z,-Z) that determines the orientation and clipping hemisphere of the plane relative to its owner game object's transformation. This property is redundant in a sense that the same can be achieved by rotating the owner object accordingly, however changing the normal might be useful to easily flip the clipping hemisphere.

### Fading Color

A 4-component color that defines color (RGB) and intensity (alpha) for the mixing color close to the edge. There is a mixing gradient of definable width that fades the mesh into the fading color. If the alpha portion of the color is set to 100%, the fading color will be fully opaque at the edge. If the alpha portion is 0, no fading is applied.

### Fade Length

Determines the width of the color mixing gradient at the edge, measured in world units.