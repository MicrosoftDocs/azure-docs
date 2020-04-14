---
title: Loading Custom Models
description: Ingest custom models to be rendered by Azure Remote Rendering
author: michael-house
ms.author: v-mihous
ms.date: 04/09/2020
ms.topic: tutorial
---

# Tutorial: Loading Custom Models

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Configure Azure Blob Storage for model ingestion.
> * Upload and process models for rendering.

## Prerequisites

* This tutorial builds on top of [Tutorial: Viewing a Remotely Rendered Model](..\1-view-a-model\view-a-model.md).

## Provision Blob Storage in Azure and custom model ingestion

Follow the steps specified in the [Quickstart: Convert a model for rendering](..\..\..\quickstarts\convert-model.md). Ignore the **Insert new model into Quickstart Sample App** section for the purpose of this tutorial. Once you have your ingested model's *Shared Access Signature (SAS)* URI, continue to the next step below.

## Loading and rendering a custom model

1. Create a new GameObject in the scene and name it appropriately.
1. Add the *RemoteRenderedModel* script to the newly created GameObject.\
 ![Add RemoteRenderedModel component](./media/add-remoterenderedmodel-script.png)
1. Position the GameObject in front of the camera
1. Ensure **AutomaticallyLoad** is turned on.
1. Press **Play** in the Unity Editor to test the application.

You will see the Console panel begin to populate with the current state and eventually model loading progress messages. Your custom model will then load into the scene.

## Next steps

You can now load your own models into Azure Remote Rendering and view them in your application. Next the tutorials will guide you through manipulating your models

> [!div class="nextstepaction"]
> [Next: Manipulating models](../3-manipulate-models/manipulate-models.md)
