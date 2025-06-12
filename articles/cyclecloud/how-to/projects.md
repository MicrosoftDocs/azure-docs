---
title: Projects
description: Learn about projects in Azure CycleCloud. A project is a collection of resources which define node configurations. Projects contain specs.
author: KimliW
ms.date: 04/01/2018
ms.author: adjohnso
---

# Projects

A **project** is a collection of resources which define node configurations. Projects contain **specs**. When a node starts, it is configured by processing and running a sequence of specs.

Azure CycleCloud uses projects to manage clustered applications, such as batch schedulers. In the CycleCloud HPCPack, the project is `hn` and `cn` specs that define the configurations and recipes for HPCPack headnode and computenode.

In the following partial node definition, the docker-registry node runs three specs: `bind` spec from Okta project version 1.3.0, plus `core` and `registry` specs from the docker project version 2.0.0:

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

A **locker** is a reference to a storage account container and credential. Nodes have a default locker, so this attribute isn't strictly necessary.

Azure CycleCloud uses a shorthand for storage accounts, so _`https://mystorage.blob.core.windows.net/mycontainer`_ can be written as _az://mystorage/mycontainer_.

The node uses the pogo tool to download each project it references from the locker:

```azurecli-interactive
pogo get az://mystorage/mycontainer/projects/okta/1.3.0/bind
```

If a project is defined on a node but doesn't exist in the expected storage location, then the node reports a `Software Installation Failure` to CycleCloud.

CycleCloud has internal projects that run by default on all nodes to perform special volume and network handling and setup communication to CycleCloud. These internal projects are mirrored to the locker automatically.  

The user is responsible for mirroring any additional projects to the locker. The [CycleCloud CLI](~/articles/cyclecloud/cli.md) has methods to compose projects:

```azurecli-interactive
cyclecloud project init myproject
```

and mirror projects to lockers:

```azurecli-interactive
cyclecloud project init mylocker
```

Specs are made up of python, shell, or PowerShell scripts.

## Create a New Project

To create a new project, use the CLI command `cyclecloud project init myproject` where `myproject` is the name of the project you wish to create. `myproject` has one `default` spec that you can change. The directory tree is created with skeleton files that you amend to include your own information.

### Directory Structure

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

The **templates** directory holds your cluster templates, while **specs** contains the specifications defining your project. **spec** has two subdirectories: cluster-init and custom chef. Cluster-init contains directories with special meaning, including the **scripts** directory (contains scripts that are executed in lexicographical order on the node), **files** (contains raw data files that are placed on the node), and **tests** (contains tests that run when a cluster is started in testing mode).

The custom chef subdirectory has three directories: **site-cookbooks** (for cookbook definitions), **data_bags** (data bag definitions), and **roles** (chef role definition files).

## project.ini

`_project.ini_` is the file containing all the metadata for your project. It can contain:

| Parameter | Description                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| name      | Name of the project, and dashes must separate words; e.g., order-66-2018.                                    |
| label     | Name of the project; a long cluster name (with spaces) is for display purposes.                             |
| type      | Three options: scheduler, application, \<blank\>. This parameter determines the type of project and generates the appropriate template. Default: application. |
| version   | Format: x.x.x                                                                                                 |

## Lockers

Project contents are stored within a **locker**. You can upload the contents of your project to any locker defined in your CycleCloud install via the command `cyclecloud project upload (locker)`, where (locker) is the name of a cloud storage locker in your CycleCloud install. This locker is set as the default target. Alternatively, you can see what lockers are available to you with the command `cyclecloud locker list`. Details about a specific locker can be viewed with `cyclecloud locker show (locker)`.

If you add more than one locker, you can set your default with `cyclecloud project default_target (locker)`, and then run `cyclecloud project upload`. You can also use the `cyclecloud project default locker (locker) -global` command to set a global default locker for projects to share.

> [!NOTE]
> Default lockers are stored in the CycleCloud config file, usually located in _~/.cycle/config.ini_ and not the _project.ini_ file. This setup allows _project.ini_ version control.

Uploading your project contents zips the three custom chef directories and syncs both custom chef and cluster-init to your target locker. These are stored within:

* (locker)/projects/(project)/(version)/(spec_name)/cluster-init
* (locker)/projects/(project)/(version)/(spec_name)/chef

## Blob Download

Use `project download` to download all blobs referenced in _project.ini_ to your local blobs directory. The command uses the `[locker]` parameter and attempts to download blobs listed in _project.ini_ from the locker to local storage. An error is returned if the files can't be located.

## Project Setup

## Specs

When creating a new project, one `default` spec is defined. You can use the `cyclecloud project add_spec` command to add additional specs to your project.

## Versioning

By default, all projects have a **version** of 1.0.0. You can set a custom version as you develop and deploy projects by setting `version=x.y.z` in the _project.ini_ file.

For example, if locker_url is `az://my-account/my-container/projects`, the project name is "Order66", the version is 1.6.9, and the spec is `default`, your url is:

* _az://my-account/my-container/projects/Order66/1.6.9/default/cluster-init_
* _az://my-account/my-container/projects/Order66/1.6.9/default/chef_

## Blobs

There are two types of blob: **project blobs** and **user blobs**.

### Project Blobs

Project authors provide project blobs, which are binary files that are allowed to be distributed (i.e., binary files for an open-source project someone is legally allowed to redistribute). Project blobs go into the `blobs` directory of a project and are located in `/project/blobs` when uploaded to a locker.

To add blobs to projects, add the files to your _project.ini_:

``` ini
[[blobs optionalname]]
  Files = projectblob1.tgz, projectblob2.tgz, projectblob3.tgz
```

Multiple blobs can be separated by a comma. You can also specify the relative path to the project's blob directory.

### User Blobs

User blobs are binary files, such as Univa Grid Engine binaries, that the author of the project can't legally redistribute. These files aren't packaged with the project and must be staged manually to the locker. The files are located in _/blobs/my-project/my-blob.tgz_. User Blobs don't need to be defined in _project.ini_.

To download any blob, use the `jetpack download` command from the CLI or the `jetpack_download` Chef resource. CycleCloud looks for the user blob first and uses the project-level blob if it can't locate the file.

> [!NOTE]
> It is possible to override a project blob with a user blob of the same name.

## Specify Project within a Cluster Template

Project syntax allows you to specify multiple specs on your nodes. To define a project, use the following:

``` ini
[[[cluster-init myspec]]]
  Project = myproject # inferred from name
  Version = x.y.z
  Spec = default  # (alternatively, you can name your own spec to be used here)
  Locker = default  # (optional; uses the default locker for node)
```

> [!NOTE]
> The name specified after `spec` can be anything but can and should be used as a shortcut to define some common properties.

The following example demonstrates how you can also apply multiple specs to a given node:

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

CycleCloud uses colons to separate the project name, spec name, and version and automatically parse those values into the appropriate `Project/Version/Spec` settings:

``` ini
[[node scheduler]]
  AdditionalClusterInitSpecs = $ClusterInitSpecs
  [[[cluster-init myproject:myspec:x.y.z]]]
  [[[cluster-init otherproject:otherspec:a.b.c]]]
```

Specs can also be inherited between nodes. For example, you can share a common spec between all nodes, and then run a custom spec on the scheduler node:

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

This process applies both the `common` and `scheduler` specs to the scheduler node, only applying the `common` and `execute` specs to the `execute` nodearray.

By default, the specs run in the order they're shown in the template, and inherited specs run first. `Order` is an optional integer with a default of 1,000 that can define the order of the specs.

If only one name is specified in the `[[[cluster-init]]]` definition, it's assumed to be the spec name. The following spec setup is valid and where the name denotes `Spec=myspec`:

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

When a node includes the `scheduler` spec, the run_list defined automatically appends to any previously defined run_list. For example, if the run_list defined under `[configuration]` was `run_list = recipe[test]`, the final run_list is `run_list = recipe[cyclecloud], recipe[test], role[a], recipe[b], recipe[cluster_init]`.

You can also overwrite a run_list at the spec level on a node. This replace any run_list included in _project.ini_. For example, you can change the node definition to the following:

``` ini
[cluster-init test-project:scheduler:1.0.0]
run_list = recipe[different-test]
```

Using this run_list causes the run_list defined in the project to be ignored. The final run_list on the node becomes `run_list = recipe[cyclecloud], recipe[test], recipe[different-test], recipe[cluster_init]`.

> [!NOTE]
> Runlists are specific to chef and don't apply otherwise.

## File Locations

The zipped chef files downloaded during the bootstrapping phase of node startup. They download to `$JETPACK_HOME/system/chef/tarballs*`, unzip to `$JETPACK_HOME/system/chef/chef-repo/`, and are used for converging the node.

> [!NOTE]
> To run custom cookbooks, you must specify them in the run_list for the node.

The cluster-init files are downloaded to `/mnt/cluster-init/(project)/(spec)/`. For `my-project` and `my-spec`, your scripts, files, and tests are located in `/mnt/cluster-init/my-project/my-spec`.

## Syncing Projects

CycleCloud projects can be synced from mirrors into cluster local cloud storage. Set a SourceLocker attribute on a `[cluster-init]` section within your template. The name of the locker specified is used as the source of the project, and contents sync to your locker at cluster start. You can also use the name of the locker as the first part of the `cluster-init` name. For example, if the source locker is `cyclecloud`, the following two definitions are the same:

``` ini
[cluster-init my-project:my-spect:1.2.3]
  SourceLocker=cyclecloud

[cluster-init cyclecloud/my-proect:my-spec:1.2.3]
```

## Large File Storage

Projects support large files. At the top level of a newly created project, you'll see a `blobs` directory for your large files (blobs). Please note that blobs placed in this directory have a specific purpose and act differently than the items within the `files` directory.

Items within the `blobs` directory act independently of specs and versions. Anything in blobs can be shared between specs or project versions. For example, an installer for a program that changes infrequently can be stored within blobs and referenced within your *project.ini*. As you iterate on versions of your project, that single file remains the same and copies to your cloud storage once, which saves on transfer and storage costs.

To add a blob, place a file into the `blobs` directory, and edit your *project.ini* to reference that file:

``` ini
[blobs]
  Files=big_file1.tgz
```

When you use the `project upload` command, all blobs referenced in *project.ini* transfer to cloud storage.

## Log Files

Log files generated when running cluster-init are located in `$JETPACK_HOME/logs/cluster-init/(project)/(spec)`.

## Run Files

When a cluster-init script runs successfully, a file is placed in `/mnt/cluster-init/.run/(project)/(spec)` to ensure it doesn't run again on a subsequent converge. If you want to run the script again, delete the appropriate file in this directory.

## Script Directories

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

To run ONLY cluster-init scripts:

```azurecli-interactive
jetpack converge --cluster-init
```

Output from the command goes to STDOUT and as _jetpack.log_. Each script's output is also logged to:

``` outfile
      $JETPACK_HOME/logs/cluster-init/(project)/(spec)/scripts/(script.sh).out
```

## Custom chef and Composable Specs

Each spec contains a chef directory. Before a converge, each spec is untarred and extracted into the local chef-repo, replacing any existing cookbooks, roles, and data bags with matching names. This is done in the order the specs are defined so that the last defined spec always wins in the case of a naming conflict.

## jetpack download

To download a blob within a cluster-init script, use the command `jetpack download (filename)` to pull it from the `blobs` directory. Running this command from a cluster-init script determines the project and base URL for you. To use it in a non-cluster-init context, you need to specify the project (see --help for more information).

The following example demonstrates how to create a `jetpack_download` lightweight resource provider for chef users:

``` ini
jetpack_download "big-file1.tgz" do
  project "my-project"
  end
```

In chef, the default download location is `#{node[:jetpack][:downloads]}`. To change the file destination, use the following:

``` ini
jetpack_download "foo.tgz" do
  project "my-project"
  dest "/tmp/download.tgz"
end
```

When used within chef, you must specify the project.
