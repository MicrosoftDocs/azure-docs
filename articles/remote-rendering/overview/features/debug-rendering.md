---
title: Debug Rendering
description: Overview of server-side debugging rendering effects
author: jumeder
ms.author: jumeder
ms.date: 06/15/2020
ms.topic: article
ms.custom: devx-track-csharp
---

# Debug Rendering

The debug rendering API provides a range of global options to alter server-side rendering with different debugging effects.

## Available debug rendering effects

|Setting                          | Effect                               |
|---------------------------------|:-------------------------------------|
|Frame counter                    | Renders a text overlay into the top-left corner of the frame. The text shows the current server-side frame ID, which is continuously incremented as rendering proceeds. |
|Polygon count                    | Renders a text overlay into the top-left corner of the frame. The text shows the currently rendered amount of polygons, the same value as queried by [Server-side performance queries](performance-queries.md)| 
|Wireframe                        | If enabled, all object geometry loaded on the server will be rendered in wireframe mode. Only the edges of polygons will be rasterized in this mode. |

The following code enables these debugging effects:

```cs
void EnableDebugRenderingEffects(RenderingSession session, bool highlight)
{
    DebugRenderingSettings settings = session.Connection.DebugRenderingSettings;

    // Enable frame counter text overlay on the server side rendering
    settings.RenderFrameCount = true;

    // Enable triangle-/point count text overlay on the server side rendering
    settings.RenderPrimitiveCount = true;

    // Enable wireframe rendering of object geometry on the server
    settings.RenderWireframe = true;
}
```

```cpp
void EnableDebugRenderingEffects(ApiHandle<RenderingSession> session, bool highlight)
{
    ApiHandle<DebugRenderingSettings> settings = session->Connection()->GetDebugRenderingSettings();

    // Enable frame counter text overlay on the server side rendering
    settings->SetRenderFrameCount(true);

    // Enable triangle-/point count text overlay on the server side rendering
    settings->SetRenderPrimitiveCount(true);

    // Enable wireframe rendering of object geometry on the server
    settings->SetRenderWireframe(true);
}
```

![Debug rendering](./media/debug-rendering.png)

> [!NOTE]
> All debug rendering effects are global settings that affect the whole frame.

## Use cases

The debug rendering API is intended for simple debugging tasks, like verifying the service connection is actually up and running correctly. The text rendering options directly affect the down-streamed video frames. Enabling them verifies if new frames are received and video-decoded correctly.

However, the provided effects do no give any detailed introspection into service health. The [Server-side performance queries](performance-queries.md) are recommended for this use case.

## Performance considerations

* Enabling the text overlays incurs little to no performance overhead.
* Enabling the wireframe mode does incur a non-trivial performance overhead, though it may vary depending on the scene. For complex scenes, this mode can cause the frame rate to drop below the 60-Hz target.

## API documentation

* [C++ RenderingConnection::DebugRenderingSettings()](/cpp/api/remote-rendering/renderingconnection#debugrenderingsettings)

## Next steps

* [Rendering modes](../../concepts/rendering-modes.md)
* [Server-side performance queries](performance-queries.md)