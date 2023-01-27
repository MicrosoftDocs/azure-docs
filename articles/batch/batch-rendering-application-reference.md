---
title: Use rendering applications
description: How to use rendering applications with Azure Batch. This article provides a brief description of how to run each rendering application.
ms.date: 08/02/2018
ms.topic: how-to
---

# Rendering applications

Rendering applications are used by creating Batch jobs and tasks. The task command line property specifies the appropriate command line and parameters.  The easiest way to create the job tasks is to use the Batch Explorer templates as specified in [this article](./batch-rendering-using.md#using-batch-explorer).  The templates can be viewed and modified versions created if necessary.

This article provides a brief description of how to run each rendering application.

## Rendering with Autodesk 3ds Max

### Renderer support

In addition to the renderers built into 3ds Max, the following renderers are available on the rendering VM images and can be referenced by the 3ds Max scene file:

* Autodesk Arnold
* Chaos Group V-Ray

### Task command line

Invoke the `3dsmaxcmdio.exe` application to perform command line rendering on a pool node.  This application is on the path when the task is run. The `3dsmaxcmdio.exe` application has the same available parameters as the `3dsmaxcmd.exe` application, which is documented in the [3ds Max help documentation](https://help.autodesk.com/view/3DSMAX/2018/ENU/) (Rendering | Command-Line Rendering section).

For example:

```
3dsmaxcmdio.exe -v:5 -rfw:0 -start:{0} -end:{0} -bitmapPath:"%AZ_BATCH_JOB_PREP_WORKING_DIR%\sceneassets\images" -outputName:dragon.jpg -w:1280 -h:720 "%AZ_BATCH_JOB_PREP_WORKING_DIR%\scenes\dragon.max"
```

Notes:

* Great care must be taken to ensure the asset files are found.  Ensure the paths are correct and relative using the **Asset Tracking** window, or use the `-bitmapPath` parameter on the command line.
* See if there are issues with the render, such as inability to find assets, by checking the `stdout.txt` file written by 3ds Max when the task is run.

### Batch Explorer templates

Pool and job templates can be accessed from the **Gallery** in Batch Explorer.  The template source files are available in the [Batch Explorer data repository on GitHub](https://github.com/Azure/BatchExplorer-data/tree/master/ncj/3dsmax).

## Rendering with Autodesk Maya

### Renderer support

In addition to the renderers built into Maya, the following renderers are available on the rendering VM images and can be referenced by the 3ds Max scene file:

* Autodesk Arnold
* Chaos Group V-Ray

### Task command line

The `renderer.exe` command-line renderer is used in the task command line. The command-line renderer is documented in [Maya help](https://help.autodesk.com/view/MAYAUL/2018/ENU/?guid=GUID-EB558BC0-5C2B-439C-9B00-F97BCB9688E4).

In the following example, a job preparation task is used to copy the scene files and assets to the job preparation working directory, an output folder is used to store the rendering image, and frame 10 is rendered.

```
render -renderer sw -proj "%AZ_BATCH_JOB_PREP_WORKING_DIR%" -verb -rd "%AZ_BATCH_TASK_WORKING_DIR%\output" -s 10 -e 10 -x 1920 -y 1080 "%AZ_BATCH_JOB_PREP_WORKING_DIR%\scene-file.ma"
```

For V-Ray rendering, the Maya scene file would normally specify V-Ray as the renderer.  It can also be specified on the command line:

```
render -renderer vray -proj "%AZ_BATCH_JOB_PREP_WORKING_DIR%" -verb -rd "%AZ_BATCH_TASK_WORKING_DIR%\output" -s 10 -e 10 -x 1920 -y 1080 "%AZ_BATCH_JOB_PREP_WORKING_DIR%\scene-file.ma"
```

For Arnold rendering, the Maya scene file would normally specify Arnold as the renderer.  It can also be specified on the command line:

```
render -renderer arnold -proj "%AZ_BATCH_JOB_PREP_WORKING_DIR%" -verb -rd "%AZ_BATCH_TASK_WORKING_DIR%\output" -s 10 -e 10 -x 1920 -y 1080 "%AZ_BATCH_JOB_PREP_WORKING_DIR%\scene-file.ma"
```

### Batch Explorer templates

Pool and job templates can be accessed from the **Gallery** in Batch Explorer.  The template source files are available in the [Batch Explorer data repository on GitHub](https://github.com/Azure/BatchExplorer-data/tree/master/ncj/maya).

## Next steps

Use the pool and job templates from the [data repository in GitHub](https://github.com/Azure/BatchExplorer-data/tree/master/ncj) using Batch Explorer.  When required, create new templates or modify one of the supplied templates.
