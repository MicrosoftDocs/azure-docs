---
title: Projects
description: Learn about projects in Azure CycleCloud. A project is a collection of resources which define node configurations. Projects contain specs.
author: KimliW
ms.date: 07/01/2025
ms.author: adjohnso
---

# Projects

A **project** is a collection of resources that define node configurations. Projects contain **specs**. When a node starts, it processes and runs a sequence of specs to configure the node.

Azure CycleCloud uses projects to manage clustered applications, such as batch schedulers. In the CycleCloud HPCPack, the project uses `hn` and `cn` specs to define the configurations and recipes for the HPCPack headnode and compute node.

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

The node uses the pogo tool to download each project it references from the locker:

```azurecli-interactive
pogo get az://mystorage/mycontainer/projects/okta/1.3.0/bind
```

If you define a project on a node but it doesn't exist in the expected storage location, the node reports a `Software Installation Failure` to CycleCloud.

CycleCloud has internal projects that run by default on all nodes to perform special volume and network handling and setup communication to CycleCloud. The system automatically mirrors these internal projects to the locker.

You're responsible for mirroring any extra projects to the locker. The [CycleCloud CLI](~/articles/cyclecloud/cli.md) offers methods to compose projects:

```azurecli-interactive
cyclecloud project init myproject
```

and mirror projects to lockers:

```azurecli-interactive
cyclecloud project init mylocker
```

Specs consist of Python, shell, or PowerShell scripts.

## Create a New Project

To create a new project, use the CLI command `cyclecloud project init myproject` where `myproject` is the name of the project you want to create. `myproject` has one `default` spec that you can change. The command creates the directory tree with skeleton files that you update with your own information.

### Directory structure

The project command creates the following directories:

``` directories
      \myproject
          ├── project.ini
          ├── blobs
          ├── templates
          ├── specs
          │   ├── default
          │     └── cluster-init
          │        ├── scripts
          │        ├── files
          │        └── tests
          │     └── chef
          │         ├── site-cookbooks
          │         ├── data_bag
          │         └── roles
```

The **templates** directory holds your cluster templates, while **specs** contains the specifications that define your project. The **specs** directory has two subdirectories: **cluster-init** and **custom chef**. The **cluster-init** directory contains directories with special meanings, including the **scripts** directory (contains scripts that run in lexicographical order on the node), **files** (contains raw data files that go on the node), and **tests** (contains tests that run when you start a cluster in testing mode).

The **custom chef** subdirectory has three directories: **site-cookbooks** (for cookbook definitions), **data_bags** (data bag definitions), and **roles** (chef role definition files).

## project.ini

`_project.ini_` is the file that contains all the metadata for your project. It can contain:

| Parameter | Description                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| name      | Name of the project. Use dashes to separate words, such as `order-66-2018`.                                  |
| label     | Name of the project. Use a long cluster name with spaces for display purposes.                                |
| type      | Three options: `scheduler`, `application`, or `<blank>`. This parameter determines the type of project and generates the appropriate template. Default: `application`. |
| version   | Format: x.x.x                                                                                                 |

## Lockers

Project contents are stored within a **locker**. You can upload the contents of your project to any locker defined in your CycleCloud installation by running the command `cyclecloud project upload (locker)`, where `(locker)` is the name of a cloud storage locker in your CycleCloud installation. This locker is the default target. Alternatively, you can run the command `cyclecloud locker list` to see what lockers are available to you. You can view details about a specific locker with `cyclecloud locker show (locker)`.

If you add more than one locker, you can set your default locker with `cyclecloud project default_target (locker)`, and then run `cyclecloud project upload`. You can also set a global default locker for projects to share by running the command `cyclecloud project default locker (locker) -global`.

> [!NOTE]
> Default lockers are stored in the CycleCloud config file, usually located in _~/.cycle/config.ini_ and not the _project.ini_ file. This setup allows version control for _project.ini_.

When you upload your project contents, CycleCloud zips the three custom chef directories and syncs both custom chef and cluster-init to your target locker. These files are stored within:

* `(locker)/projects/(project)/(version)/(spec_name)/cluster-init`
* `(locker)/projects/(project)/(version)/(spec_name)/chef`

## Blob Download

Use `project download` to download all blobs referenced in _project.ini_ to your local blobs directory. The command uses the `[locker]` parameter and tries to download blobs listed in _project.ini_ from the locker to local storage. If the command can't find the files, it returns an error.

## Project Setup

## Specs

When you create a new project, you define one `default` spec. Use the `cyclecloud project add_spec` command to add more specs to your project.

## Versioning

By default, all projects use version 1.0.0. Set a custom version as you develop and deploy projects by setting `version=x.y.z` in the _project.ini_ file.

For example, if the locker_url is `az://my-account/my-container/projects`, the project name is "Order66", the version is 1.6.9, and the spec is `default`, your URLs are:

* _az://my-account/my-container/projects/Order66/1.6.9/default/cluster-init_
* _az://my-account/my-container/projects/Order66/1.6.9/default/chef_

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

User blobs are binary files, such as Univa Grid Engine binaries, that the author of the project can't legally redistribute. You don't package these files with the project. You must manually stage them to the locker. The files are located in _/blobs/my-project/my-blob.tgz_. You don't need to define user blobs in _project.ini_.

To download any blob, use the `jetpack download` command from the CLI or the `jetpack_download` Chef resource. CycleCloud looks for the user blob first and uses the project-level blob if it can't locate the file.

> [!NOTE]
> A user blob can override a project blob if they have the same name.

## Specify project within a cluster template

Project syntax lets you specify multiple specs on your nodes. To define a project, use the following code:

``` ini
[[[cluster-init myspec]]]
  Project = myproject # inferred from name
  Version = x.y.z
  Spec = default  # (alternatively, you can name your own spec to be used here)
  Locker = default  # (optional; uses the default locker for node)
```

> [!NOTE]
> The name you specify after `spec` can be anything. Use it as a shortcut to define some common properties.

The following example shows how you can apply multiple specs to a node:

``` ini
[[node scheduler]]
  [[[cluster-init myspec]]]
  Project = myproject
  Version = x.y.z
  Spec = default  # (alternatively, you can name your own spec to be used here)
  Locker = default  # (optional; uses the default locker for node)

[[[cluster-init otherspec]]]
Project = otherproject
Version = a.b.c
Spec = otherspec  # (optional)
```

CycleCloud uses colons to separate the project name, spec name, and version. It automatically parses those values into the `Project/Version/Spec` settings:

``` ini
[[node scheduler]]
  AdditionalClusterInitSpecs = $ClusterInitSpecs
  [[[cluster-init myproject:myspec:x.y.z]]]
  [[[cluster-init otherproject:otherspec:a.b.c]]]
```

Specs can also be inherited between nodes. For example, you can share a common spec between all nodes, and run a custom spec on the scheduler node:

``` ini
[[node defaults]]
[[[cluster-init my-project:common:1.0.0]]]
Order = 2 # optional
[[node scheduler]]
[[[cluster-init my-project:scheduler:1.0.0]]]
Order = 1 # optional

[[nodearray execute]]
[[[cluster-init my-project:execute:1.0.0]]]
   Order = 1 # optional
```

This process applies both the `common` and `scheduler` specs to the scheduler node, and it applies only the `common` and `execute` specs to the `execute` node array.

By default, the specs run in the order they're shown in the template, and inherited specs run first. `Order` is an optional integer with a default of 1,000 that you can use to set the order of the specs.

If you specify only one name in the `[[[cluster-init]]]` definition, the process assumes it's the spec name. The following spec setup is valid and uses the name `Spec=myspec`:

``` ini
[[[cluster-init myspec]]]
Project = myproject
Version = 1.0.0
```

## run_list

You can specify a run_list at the project or spec level within your _project.ini_:

``` ini
[spec scheduler]
run_list = role[a], recipe[b]
```

When a node includes the `scheduler` spec, the run_list you define automatically appends to any previously defined run_list. For example, if the run_list under `[configuration]` is `run_list = recipe[test]`, the final run_list is `run_list = recipe[cyclecloud], recipe[test], role[a], recipe[b], recipe[cluster_init]`.

You can also overwrite `run_list` at the spec level on a node. This replacement `run_list` removes any `run_list` included in **_project.ini_**. For example, you can change the node definition to the following definition:

``` ini
[cluster-init test-project:scheduler:1.0.0]
run_list = recipe[different-test]
```

Using this run_list causes the run_list defined in the project to be ignored. The final run_list on the node becomes `run_list = recipe[cyclecloud], recipe[test], recipe[different-test], recipe[cluster_init]`.

> [!NOTE]
> Runlists apply only to Chef.

## File locations

The node downloads the zipped Chef files during the bootstrapping phase of node startup. The node downloads the files to `$JETPACK_HOME/system/chef/tarballs*`, unzips them to `$JETPACK_HOME/system/chef/chef-repo/`, and uses them to converge the node.

> [!NOTE]
> To run custom cookbooks, you must add them to the run_list for the node.

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

## Custom chef and composable specs

Each spec contains a chef directory. Before you converge a node, the process untars and extracts each spec into the local chef-repo, replacing any existing cookbooks, roles, and data bags with matching names. The process follows the order in which you define the specs, so the last defined spec wins if there's a naming conflict.

## jetpack download

To download a blob within a cluster-init script, use the command `jetpack download (filename)` to pull it from the `blobs` directory. Running this command from a cluster-init script lets it determine the project and base URL for you. To use it in a non-cluster-init context, you need to specify the project (see --help for more information).

The following example shows how to create a `jetpack_download` lightweight resource provider for chef users:

``` ini
jetpack_download "big-file1.tgz" do
  project "my-project"
  end
```

In chef, the default download location is `#{node[:jetpack][:downloads]}`. To change the file destination, use the following code:

``` ini
jetpack_download "foo.tgz" do
  project "my-project"
  dest "/tmp/download.tgz"
end
```

When you use the command within chef, you must specify the project.
