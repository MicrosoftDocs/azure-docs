---
title: Cut planes
description: Explains what cut planes are and how to use them
author: jakrams
ms.author: jakras
ms.date: 02/06/2020
ms.topic: article
---

# Cut planes

A *cut plane* is a visual feature that clips pixels on one side of a virtual plane, revealing the inside of [meshes](../../concepts/meshes.md).
The image below demonstrates the effect. The left shows the original mesh, on the right one can look inside the mesh:

![Cut plane](./media/cutplane-1.png)

## Limitations

* For the time being, Azure Remote Rendering supports a **maximum of eight active cut planes**. You may create more cut plane components, but if you try to enable more simultaneously, it will ignore the activation. Disable other planes first if you want to switch which component should affect the scene.
* Each cut plane affects all remotely rendered objects. There is currently no way to exclude specific objects or mesh parts.
* Cut planes are purely a visual feature, they don't affect the outcome of [spatial queries](spatial-queries.md). If you do want to ray cast into a cut-open mesh, you can adjust the starting point of the ray to be on the cut plane. This way the ray can only hit visible parts.

## Performance considerations

Each active cut plane incurs a small cost during rendering. Disable or delete cut planes when they aren't needed.

## CutPlaneComponent

You add a cut plane to the scene by creating a *CutPlaneComponent*. The location and orientation of the plane is determined by the component's owner [entity](../../concepts/entities.md).

```cs
void CreateCutPlane(AzureSession session, Entity ownerEntity)
{
    CutPlaneComponent cutPlane = (CutPlaneComponent)session.Actions.CreateComponent(ObjectType.CutPlaneComponent, ownerEntity);
    cutPlane.Normal = Axis.X; // normal points along the positive x-axis of the owner object's orientation
    cutPlane.FadeColor = new Color4Ub(255, 0, 0, 128); // fade to 50% red
    cutPlane.FadeLength = 0.05f; // gradient width: 5cm
}
```

```cpp
void CreateCutPlane(ApiHandle<AzureSession> session, ApiHandle<Entity> ownerEntity)
{
    ApiHandle<CutPlaneComponent> cutPlane = session->Actions()->CreateComponent(ObjectType::CutPlaneComponent, ownerEntity)->as<CutPlaneComponent>();;
    cutPlane->Normal(Axis::X); // normal points along the positive x-axis of the owner object's orientation
    Color4Ub fadeColor;
    fadeColor.channels = { 255, 0, 0, 128 }; // fade to 50% red
    cutPlane->FadeColor(fadeColor);
    cutPlane->FadeLength(0.05f); // gradient width: 5cm
}
```


### CutPlaneComponent properties

The following properties are exposed on a cut plane component:

* `Enabled`: You can temporarily switch off cut planes by disabling the component. Disabled cut planes don't incur rendering overhead and also don't count against the global cut plane limit.

* `Normal`: Specifies which direction (+X,-X,+Y,-Y,+Z,-Z) is used as the plane normal. This direction is relative to the owner entity's orientation. Move and rotate the owner entity for exact placement.

* `FadeColor` and `FadeLength`:

  If the alpha value of *FadeColor* is non-zero, pixels close to the cut plane will fade towards the RGB part of FadeColor. The strength of the alpha channel determines whether it will fade fully towards the fade color or only partially. *FadeLength* defines over which distance this fade will take place.

## Next steps

* [Single sided rendering](single-sided-rendering.md)
* [Spatial queries](spatial-queries.md)
