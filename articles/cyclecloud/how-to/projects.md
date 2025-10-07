---
title: Projects
description: Learn about projects in Azure CycleCloud. A project is a collection of resources that define node configurations. Projects contain specs.
author: dougclayton
ms.author: doclayto
ms.date: 09/23/2025
---

# Projects

A **project** is a collection of resources that define node configurations. Projects contain **specs**. When a node starts, it processes and runs a sequence of specs to configure the node.

Azure CycleCloud uses projects to manage clustered applications, such as batch schedulers. In the CycleCloud HPCPack cluster, the project uses `hn` and `cn` specs to define the configurations and recipes for the HPCPack headnode and compute node.

In the following partial node definition, the docker-registry node runs three specs: the `bind` spec from the Okta project version 1.3.0, and the `core` and `registry` specs from the docker project version 2.0.0:

``` ini
[[node docker-registry]]
    Locker = base-storage
    [[[cluster-init okta:bind:1.3.0]]]
    [[[cluster-init docker:core:2.0.0]]]
    [[[cluster-init docker:registry:2.0.0]]]
```

The trailing tag is the project version number:

``` ini
[[[cluster-init <project>:<spec>:<project version>]]]
```

A **locker** is a reference to a storage account container and credential. Nodes have a default locker, so you don't always need to specify this attribute.

Azure CycleCloud uses a shorthand for storage accounts. For example, you can write _`https://mystorage.blob.core.windows.net/mycontainer`_ as _az://mystorage/mycontainer_.

If you define a project on a node but it doesn't exist in the expected storage location, the node reports a `Software Installation Failure` to CycleCloud.

CycleCloud has internal projects that run by default on all nodes to perform special volume and network handling and setup communication to CycleCloud. The system automatically mirrors these internal projects to the locker.

You're responsible for mirroring any extra projects to the locker. The [CycleCloud CLI](~/articles/cyclecloud/cli.md) offers methods to compose projects:

```azurecli-interactive
cyclecloud project init myproject
```

And, mirror projects to lockers:

```azurecli-interactive
cyclecloud project init mylocker
```

Specs consist of Python, shell, or PowerShell scripts.

## Create a New Project

To create a new project, use the CLI command `cyclecloud project init myproject` where `myproject` is the name of the project you want to create. `myproject` has one `default` spec that you can change. The command creates the directory tree with skeleton files that you update with your own information.

### Directory structure

The project command creates the following directories:

``` directories
      myproject
          ├── project.ini
          ├── blobs
          ├── templates
          ├── specs
          │   ├── default
          │     └── cluster-init
          │        ├── scripts
          │        ├── files
          │        └── tests
```

The **templates** directory holds your cluster templates, while **specs** contains the specifications that define your project. The **specs** directory has a subdirectory named **cluster-init** (but see also [Chef Orchestration](../cluster-references/chef-reference.md)). 
The **cluster-init** directory contains directories with special meanings, including the **scripts** directory (which contains scripts that run in lexicographical order on the node), **files** (which contains raw data files that go on the node), and **tests** (which contains tests that run when you start a cluster in testing mode).

## project.ini

_project.ini_ is the file that contains all the metadata for your project. It can contain:

| Parameter | Description                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| name      | Name of the project. Use dashes to separate words, such as `order-66-2018`.                                  |
| label     | Name of the project. Use a long cluster name with spaces for display purposes.                                |
| type      | Three options: `scheduler`, `application`, or `<blank>`. This parameter determines the type of project and generates the appropriate template. Default: `application`. |
| version   | Format: x.x.|

## Lockers

Project contents are stored within a **locker**. You can upload the contents of your project to any locker defined in your CycleCloud installation by running the command `cyclecloud project upload (locker)`, where `(locker)` is the name of a cloud storage locker in your CycleCloud installation. This locker is the default target. Alternatively, you can run the command `cyclecloud locker list` to see what lockers are available to you. You can view details about a specific locker with `cyclecloud locker show (locker)`.

If you add more than one locker, you can set your default locker with `cyclecloud project default_target (locker)`, and then run `cyclecloud project upload`. You can also set a global default locker for projects to share by running the command `cyclecloud project default locker (locker) -global`.

> [!NOTE]
> Default lockers are stored in the CycleCloud config file, located in _~/.cycle/config.ini_ and not the _project.ini_ file. This setup allows version control for _project.ini_.

When you upload your project contents, CycleCloud syncs the cluster-init contents to your target locker, at `projects/(project)/(version)/(spec_name)/cluster-init`.

## Blob Download

Use `project download` to download all blobs referenced in _project.ini_ to your local blobs directory. The command uses the `[locker]` parameter and tries to download blobs listed in _project.ini_ from the locker to local storage. If the command can't find the files, it returns an error.

## Project Setup

## Specs

When you create a new project, you define one `default` spec. Use the `cyclecloud project add_spec` command to add more specs to your project.

## Versioning

By default, all projects use version 1.0.0. Set a custom version as you develop and deploy projects by setting `version=x.y.z` in the _project.ini_ file.

For example, if the locker_url is `az://my-account/my-container/projects`, the project name is "Order66", the version is 1.6.9, and the spec is `default`, the URL is:

```
az://my-account/my-container/projects/Order66/1.6.9/default
```

## Blobs

There are two types of blobs: **project blobs** and **user blobs**.

### Project Blobs

Project authors provide project blobs, which are binary files that they can distribute (for example, binary files for an open-source project that someone can legally redistribute). Project blobs go into the `blobs` directory of a project and are located in `/project/blobs` when you upload them to a locker.

To add blobs to projects, add the files to your _project.ini_:

``` ini
[[blobs optionalname]]
  Files = projectblob1.tgz, projectblob2.tgz, projectblob3.tgz
```

Separate multiple blobs with a comma. You can also specify the relative path to the project's blob directory.

### User blobs

User blobs are binary files, such as Univa Grid Engine binaries, that the author of the project can't legally redistribute. 
These files are not packaged with the project. Users must manually stage them to their locker. 
The files are located in _/blobs/my-project/_ in the locker (for example, _/blobs/my-project/my-blob.tgz_). You don't need to define user blobs in _project.ini_.

To download any blob, use the `jetpack download` command. CycleCloud looks for the user blob first and uses the project-level blob if it can't locate the file.

> [!NOTE]
> A user blob can override a project blob if they have the same name.

## Specify projects within a cluster template

Specs are defined in your cluster template, using the `[[[cluster-init]]]` [section on a node](../cluster-references/cluster-init-reference.md):

``` ini
[[node defaults]]
[[[cluster-init my-project:common:1.0.0]]]

[[node scheduler]]
[[[cluster-init my-project:scheduler:1.0.0]]]

[[nodearray execute]]
[[[cluster-init my-project:execute:1.0.0]]]
```

This example takes advantage of the `defaults` node definition that all nodes inherit from. 
The scheduler node gets both the `common` and `scheduler` specs, and nodes in the execute node array get both the `common` and `execute` specs.

## File locations

The node downloads the cluster-init files to `/mnt/cluster-init/(project)/(spec)/`. For `my-project` and `my-spec`, your scripts, files, and tests are in `/mnt/cluster-init/my-project/my-spec`.

## Sync projects

You can sync CycleCloud projects from mirrors into cluster local cloud storage. Set a `SourceLocker` attribute on a `[cluster-init]` section within your template. The name of the locker you specify is the source of the project, and the contents sync to your locker when the cluster starts. You can also use the name of the locker as the first part of the `cluster-init` name. For example, if the source locker is `cyclecloud`, the following two definitions are the same:

``` ini
[cluster-init my-project:my-spect:1.2.3]
  SourceLocker=cyclecloud

[cluster-init cyclecloud/my-proect:my-spec:1.2.3]
```

## Large file storage

Projects support large files. At the top level of a newly created project, you see a `blobs` directory for your large files (blobs). Blobs you place in this directory serve a specific purpose and act differently than the items within the `files` directory.

Items within the `blobs` directory act independently of specs and versions. You can share anything in blobs between specs or project versions. For example, you can store an installer for a program that changes infrequently within blobs and reference it within your *project.ini*. As you iterate on versions of your project, that single file remains the same and copies to your cloud storage once, which saves on transfer and storage costs.

To add a blob, place a file into the `blobs` directory, and edit your *project.ini* to reference that file:

``` ini
[blobs]
  Files=big_file1.tgz
```

When you use the `project upload` command, it transfers all blobs referenced in *project.ini* to cloud storage.

## Log files

Log files generated when running cluster-init are located in `$JETPACK_HOME/logs/cluster-init/(project)/(spec)`.

## Run files

When a cluster-init script runs successfully, it places a file in `/mnt/cluster-init/.run/(project)/(spec)` to ensure the script doesn't run again on a subsequent converge. To run the script again, delete the appropriate file in this directory.

## Script directories

When CycleCloud executes scripts in the `scripts` directory, it adds environment variables to the path and name of the `spec` and `project` directories:

``` script
CYCLECLOUD_PROJECT_NAME
CYCLECLOUD_PROJECT_PATH
CYCLECLOUD_SPEC_NAME
CYCLECLOUD_SPEC_PATH
```

On Linux, a project named _test-project_ with a spec of `default` has the following paths:

``` script
CYCLECLOUD_PROJECT_NAME = test-project
CYCLECLOUD_PROJECT_PATH = /mnt/cluster-init/test-project
CYCLECLOUD_SPEC_NAME = default
CYCLECLOUD_SPEC_PATH = /mnt/cluster-init/test-project/default
```

## Run Scripts Only

To run only cluster-init scripts, use the following command:

```azurecli-interactive
jetpack converge --cluster-init
```

The command sends its output to STDOUT and to _jetpack.log_. Each script's output is also logged to:

``` outfile
      $JETPACK_HOME/logs/cluster-init/(project)/(spec)/scripts/(script.sh).out
```

## jetpack download

To download a blob within a cluster-init script, use the command `jetpack download (filename)` to pull it from the `blobs` directory. Running this command from a cluster-init script lets it determine the project and base URL for you. To use it in a non-cluster-init context, you need to specify the project. For more information, use the `--help` option.
