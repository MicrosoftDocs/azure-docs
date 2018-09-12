---
title: Azure CycleCloud Storage - Blobs and Lockers | Microsoft Docs
description: Project and User Blobs for storage within Azure CycleCloud.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Blobs and Lockers

Azure CycleCloud supports blobs for project use.

## Blobs

There are two types of blob: **project blobs** and **user blobs**.

### Project Blobs

Project Blobs are binary files provided by the author of the project with the assumption that they can be distributed (i.e. a binary file for an open source project you are legally allowed to redistribute). Project Blobs go into the _blobs_ directory of a project, and when uploaded to a locker they will be located at _/project/blobs_.

To add blobs to projects, add the file(s) to your **project.ini**:

``` ini
[[blobs optionalname]]
Files = projectblob1.tgz, projectblob2.tgz, projectblob3.tgz
```

Multiple blobs can be separated by a comma. You can also specify the relative path to the project's blob directory.

### User Blobs

User Blobs are binary files that the author of the project cannot legally redistribute, such as UGE binaries. These files are not packaged with the project, but instead must be staged to the locker manually. The files will be located at _/blobs//my-blob.tgz_. User Blobs do not need to be defined in the _project.ini_.

To download any blob, use the `jetpack download` command from the CLI, or the `jetpack_download` Chef resource. CycleCloud will look for the user blob first. If that file is not located, the project level blob will be used.

> [!NOTE]
> It is possible to override a project blob with a user blob of the same name.

## Blob Download

Use `project download` to download all blobs referenced in the project.ini to your local blobs directory. The command uses the [locker] parameter and will attempt to download blobs listed in project.ini from the locker to local storage. An error will be returned if the files cannot be located.

## Lockers

Project contents are stored within a **locker**. You can upload the contents of your project to any locker defined in your CycleCloud install via the command `cyclecloud project upload (locker)`, where (locker) is the name of a cloud storage locker in your CycleCloud install. This locker will be set as the default target. Alternatively, you can see what lockers are available to you with the command `cyclecloud locker list`. Details about a specific locker can be viewed with `cyclecloud locker show (locker)`.

If you add more than one locker, you can set your default with `cyclecloud project default_target (locker)`, then simply run `cyclecloud project upload`. You can also set a global default locker that can be shared by projects with the command `cyclecloud project default locker (locker) -global`.

> [!NOTE]
> Default lockers will be stored in the CycleCloud config file (usually located in _~/.cycle/config.ini_),
> not in the _project.ini_. This is done to allow _project.ini_ to be version controlled.

Uploading your project contents will zip the chef directories and sync both chef and cluster init to your target locker. These will be stored at:

* (locker)/projects/(project)/(version)/(spec_name)/cluster-init
* (locker)/projects/(project)/(version)/(spec_name)/chef
