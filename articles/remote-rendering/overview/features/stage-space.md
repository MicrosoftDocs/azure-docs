---
title: Stage space
description: Describes stage space settings and use cases
author: christophermanthei
ms.author: chmant
ms.date: 03/07/2020
ms.topic: article
ms.custom: devx-track-csharp
---

# Stage space

When running ARR on a device that provides head-tracking data like the HoloLens 2, the head pose is sent to both the user application and the server. The space in which the head transform is defined in is called the *stage space*.

To align local and remote content, it is assumed that the stage space and the world space are identical on both client and server. If the user decides to add an additional transform on top of the camera, it needs to be sent to the server as well to align local and remote content correctly.

Typical reasons for moving the stage space are [world locking tools](https://microsoft.github.io/MixedReality-WorldLockingTools-Unity/README.html) or other real world anchoring techniques as well as moving a virtual character in VR.

> [!CAUTION]
> EXPERIMENTAL: This feature is experimental and will change over time. Thus updating to newer client SDK versions may require additional work to upgrade the code. The current implementation will break local/remote content alignment for a brief moment when changing the stage space origin.

## Stage space best practices

As the feature is still experimental, it has a few caveats that need to be considered. Every time the stage space transform is changed, local and remote content will not align anymore until the client receives a new video frame that has incorporated the new stage space transform. Thus, the following should be taken into account:

1. Avoid continuous locomotion. As continuous locomotion changes the stage space transform every frame, local and remote content will be misaligned until locomotion stops.
1. Prefer teleport for locomotion. To better hide the misalignment, consider using fade-to-black during the transition and teleport instantly instead of animating the transform.

> [!IMPORTANT]
> In the [desktop simulation](../../concepts/graphics-bindings.md) the world-space location of the camera is provided by the user application. In this case, setting the stage space origin must be skipped as it is already multiplied into the camera transform.

## Stage space settings

To inform the server that an additional transform is applied to the stage space, its origin defined by a position and a rotation in world space need to be sent over. This setting can be accessed via *stage space setting*.

```cs
void ChangeStageSpace(RenderingSession session)
{
    StageSpaceSettings settings = session.Connection.StageSpaceSettings;

    // Set position and rotation to the world-space transform of the stage space.
    settings.Position = new Double3(0, 0, 0);
    settings.Rotation = new Quaternion(0, 0, 0, 1);
}
```

```cpp
void ChangeStageSpace(ApiHandle<RenderingSession> session)
{
    ApiHandle<StageSpaceSettings> settings = session->Connection()->GetStageSpaceSettings();

    // Set position and rotation to the world-space transform of the stage space.
    settings->SetPosition({0, 0, 0});
    settings->SetRotation({0, 0, 0, 1});
}
```

## Unity stage space script

The Unity integration provides a script called **StageSpace** that can be added to the camera's parent GameObject. Once present, this script will take care of setting the stage space origin.

## Next steps

* [Graphics binding](../../concepts/graphics-bindings.md)
* [Late stage reprojection](late-stage-reprojection.md)
