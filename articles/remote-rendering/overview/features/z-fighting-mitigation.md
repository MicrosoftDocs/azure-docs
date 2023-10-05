---
title: Z-fighting mitigation
description: Learn about techniques to mitigate z-fighting artifacts that occur when surfaces overlap and it isn't clear which one should be rendered on top. 
author: florianborn71
ms.author: flborn
ms.date: 02/06/2020
ms.topic: how-to
ms.custom: 
- devx-track-csharp
- kr2b-contr-experiment
---

# Z-fighting mitigation

When two triangular surfaces overlap, it isn't clear which one should be rendered on top of the other. The result even varies per pixel, resulting in camera view-dependent artifacts. When the camera or the mesh moves, these patterns flicker noticeably. This artifact is called *z-fighting*. For augmented reality and virtual reality applications, the problem is intensified because head-mounted devices naturally always move. To prevent viewer discomfort, Azure Remote Rendering offers z-fighting mitigation functionality.

> [!NOTE]
> The z-fighting mitigation settings have no effect on point cloud rendering.

## Z-fighting mitigation modes

|Situation                        | Result                               |
|---------------------------------|:-------------------------------------|
|Regular z-fighting               |![Screenshot shows no deterministic precedence between red and green quads.](./media/zfighting-0.png)|
|Z-fighting mitigation enabled    |![Screenshot displays the red quad precedence with a solid red rectangle.](./media/zfighting-1.png)|
|Checkerboard highlighting enabled|![Screenshot shows red and green quad toggle preference with a checkerboard pattern rectangle.](./media/zfighting-2.png)|

The following code enables z-fighting mitigation:

```cs
void EnableZFightingMitigation(RenderingSession session, bool highlight)
{
    ZFightingMitigationSettings settings = session.Connection.ZFightingMitigationSettings;

    // enabling z-fighting mitigation
    settings.Enabled = true;

    // enabling checkerboard highlighting of z-fighting potential
    settings.Highlighting = highlight;
}
```

```cpp
void EnableZFightingMitigation(ApiHandle<RenderingSession> session, bool highlight)
{
    ApiHandle<ZFightingMitigationSettings> settings = session->Connection()->GetZFightingMitigationSettings();

    // enabling z-fighting mitigation
    settings->SetEnabled(true);

    // enabling checkerboard highlighting of z-fighting potential
    settings->SetHighlighting(highlight);
}
```

> [!NOTE]
> Z-fighting mitigation is a global setting that affects all rendered meshes.

## Reasons for z-fighting

Z-fighting happens mainly for two reasons:

* When surfaces are far away from the camera, the precision of their depth values degrades and the values become indistinguishable
* When surfaces in a mesh physically overlap

The first problem can always happen and is difficult to eliminate. If this situation happens in your application, make sure that the ratio of the *near plane* distance to the *far plane* distance is as low as practical. For example, a near plane at distance 0.01 and far plane at distance 1000 creates this problem much earlier than having the near plane at 0.1 and the far plane at distance 20.

The second problem is an indication of badly authored content. In the real world, two objects can't be in the same place at the same time. Depending on the application, users might want to know whether overlapping surfaces exist and where they are. For example, a CAD scene of a building that is the basis for a real world construction, shouldn't contain physically impossible surface intersections. To allow for visual inspection, the highlighting mode is available, which displays potential z-fighting as an animated checkerboard pattern.

## Limitations

The provided z-fighting mitigation is a best effort. There's no guarantee that it removes all z-fighting. Also, mitigation prefers one surface over another. When you have surfaces that are too close to each other, the "wrong" surface ends up on top. A common problem case is when text and other decals are applied to a surface. With z-fighting mitigation enabled, these details could easily just vanish.

## Performance considerations

* Enabling z-fighting mitigation incurs little to no performance overhead.
* Additionally enabling the z-fighting overlay does incur a non-trivial performance overhead, though it may vary depending on the scene.

## API documentation

* [C# RenderingConnection.ZFightingMitigationSettings property](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.zfightingmitigationsettings)
* [C++ RenderingConnection::ZFightingMitigationSettings()](/cpp/api/remote-rendering/renderingconnection#zfightingmitigationsettings)

## Next steps

* [Rendering modes](../../concepts/rendering-modes.md)
* [Late stage reprojection](late-stage-reprojection.md)