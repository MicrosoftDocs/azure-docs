---
title: Storage - Blobs and Lockers
description: In this article, learn how to use project blobs and user blobs for storage within Azure CycleCloud. Also learn about blob downloading and lockers.
author: KimliW
ms.date: 07/01/2025
ms.author: adjohnso
---

# Blobs and Lockers

Azure CycleCloud supports blobs for project use.

## Blobs

There are two types of blobs: **project blobs** and **user blobs**.

### Project blobs

Project blobs are binary files that the project author provides with the assumption that they can be distributed. For example, you can legally redistribute a binary file for an open source project. Project blobs go into the **blobs** directory of a project. When you upload them to a locker, they appear at **/project/blobs**.

To add blobs to projects, add the files to your **project.ini**:

``` ini
[[blobs optionalname]]
Files = projectblob1.tgz, projectblob2.tgz, projectblob3.tgz
```

Separate multiple blobs with a comma. You can also specify the relative path to the project's blob directory.

### User blobs

User blobs are binary files that the project author can't legally redistribute, such as UGE binaries. The project doesn't package these files. You must manually stage them to the locker. You can find these files at _/blobs//my-blob.tgz_. You don't need to define user blobs in the _project.ini_.

To download any blob, use the `jetpack download` command from the CLI, or the `jetpack_download` Chef resource. CycleCloud looks for the user blob first. If it doesn't find that file, it uses the project level blob.

> [!NOTE]
> You can override a project blob with a user blob of the same name.

## Blob download

Use `project download` to download all blobs referenced in the `project.ini` to your local blobs directory. The command uses the `[locker]` parameter and attempts to download blobs listed in `project.ini` from the locker to local storage. You see an error if the command can't find the files.

## Lockers

CycleCloud stores project contents in a **locker**, which is an Azure Storage container that it configures. To upload a project using the CLI, run `cyclecloud project upload [locker]` from the project's directory. After you upload the project, CycleCloud stores your project in your locker at *projects/[project]/[version]/[spec]*. Run `cyclecloud locker list` to list the currently configured lockers. Run `cyclecloud locker show [locker]` to show details for a specific locker.

You can also set a default project locker from the command line. To set the default locker, run `cyclecloud project default_locker [locker]` from your project's directory. Once set, you can run `cyclecloud project upload` without specifying a locker. To set a global default locker for all your projects, run `cyclecloud project default_locker --global [locker]`.

> [!NOTE]
> You configure default lockers in the CycleCloud CLI configuration file (usually located in _~/.cycle/config.ini_), not in the _project.ini_. Keeping this configuration out of the _project.ini_ allows you to version control the _project.ini_.
