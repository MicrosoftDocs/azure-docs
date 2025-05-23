---
title: Storage - Blobs and Lockers
description: In this article, learn how to use project blobs and user blobs for storage within Azure CycleCloud. Also learn about blob downloading and lockers.
author: KimliW
ms.date: 04/01/2018
ms.author: adjohnso
---

# Blobs and Lockers

Azure CycleCloud supports blobs for project use.

## Blobs

There are two types of blob: **project blobs** and **user blobs**.

### Project Blobs

Project Blobs are binary files provided by the author of the project with the assumption that they can be distributed (i.e. a binary file for an open source project you are legally allowed to redistribute). Project Blobs go into the _blobs_ directory of a project, and when uploaded to a locker they will be located at _/project/blobs_.

To add blobs to projects, add the file(s) to your _project.ini_:

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

Use `project download` to download all blobs referenced in the project.ini to your local blobs directory. The command uses the `[locker]` parameter and will attempt to download blobs listed in project.ini from the locker to local storage. An error will be returned if the files cannot be located.

## Lockers

Project contents are stored within a **locker**, which is an Azure Storage container configured in CycleCloud. To upload a project via the CLI, run `cyclecloud project upload [locker]` from that project's directory. After uploading, your project will be stored in your locker at *projects/[project]/[version]/[spec]*. You can list the currently configured lockers by running `cyclecloud locker list` and show details for a specific locker using `cyclecloud locker show [locker]`.

You can also set a default project from the command line. To do this, run `cyclecloud project default_locker [locker]` from your project's directory. Once this is set, `cyclecloud project upload` will work with no locker specified. To set a global default locker across all of your projects, run `cyclecloud project default_locker --global [locker]`.

> [!NOTE]
> Default lockers are configured via the CycleCloud CLI configuration file (usually located in _~/.cycle/config.ini_),
> not in the _project.ini_. This is done to allow _project.ini_ to be version controlled.
