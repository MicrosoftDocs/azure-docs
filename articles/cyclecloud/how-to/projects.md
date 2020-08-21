---
title: Projects
description: Learn about projects in Azure CycleCloud. A project is a collection of resources which define node configurations. Projects contain specs.
author: KimliW
ms.date: 04/01/2018
ms.author: adjohnso
---

# Projects

A **project** is a collection of resources which define node configurations. Projects contain **specs**. When a node starts, it is configured by processing and running a sequence of specs.

Azure CycleCloud uses projects to manage clustered applications, such as batch schedulers. In the CycleCloud HPCPack, the project is a `hn` spec and `cn` spec which define the configurations and recipes for HPCPack headnode and computenode.

Below is a partial node definition. The docker-registry node will run three specs: bind spec from the okta project version 1.3.0, as well as core and registry specs from the docker project version 2.0.0:

``` ini
[[node docker-registry]]
    Locker = base-storage
    [[[cluster-init okta:bind:1.3.0]]]
    [[[cluster-init docker:core:2.0.0]]]
    [[[cluster-init docker:registry:2.0.0]]]
```

The trailing tag is the project version number.

``` ini
[[[cluster-init <project>:<spec>:<project version>]]]
```

A **locker** is a reference to a storage account container and credential. Nodes have a default locker, so this attribute is not strictly necessary.

Azure CycleCloud uses a shorthand for storage accounts, so _https://mystorage.blob.core.windows.net/mycontainer_ can be written as _az://mystorage/mycontainer_.

The node will download each project it references from the locker using the pogo tool:

```azurecli-interactive
pogo get az://mystorage/mycontainer/projects/okta/1.3.0/bind
```

If a project is defined on a node but does not exist in the expected storage location then the node will report a `Software Installation Failure` to CycleCloud.

CycleCloud has internal projects that run by default on all nodes to perform special volume and network handling and setup communication to CycleCloud. These internal projects are mirrored to the locker automatically.  

The user is responsible to mirroring any additional projects to the locker. The [CycleCloud CLI](~/cli.md) has methods to compose projects:

```azurecli-interactive
cyclecloud project init myproject
```

and mirror:

```azurecli-interactive
cyclecloud project init mylocker
```

projects to lockers.  

Specs are made up of python, shell, or powershell scripts.

## Create a New Project

To create a new project, use the CLI command `cyclecloud project init myproject`, where `myproject` is the name of the project you wish to create. This will create a project called "myproject", with a single spec named "default" that you can change. The directory tree will be created with skeleton files you will amend to include your own information.

### Directory Structure

The following directories will be created by the project command:

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

The **templates** directory will hold your cluster templates, while **specs** will contain the specifications defining your project. **spec** has two subdirectories: cluster-init and custom chef. cluster-init contains directories which have special meaning, such as the **scripts** directory (contains scripts that are executed in lexicographical order on the node), **files** (raw data files to will be put on the node), and **tests** (contains tests to be run when a cluster is started in testing mode).

The custom chef subdirectory has three directories: **site-cookbooks** (for cookbook definitions), **data_bags** (databag definitions), and **roles** (chef role definition files).

## project.ini

``project.ini`` is the file containing all the metadata for your project. It can contain:

| Parameter | Description                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| name      | Name of the project. Words must be separated by dashes, e.g. order-66-2018                                    |
| label     | Name of the project. Long name (with spaces) of the cluster for display purposes.                             |
| type      | Three options: scheduler, application, <blank>. Determines the type of project and generates the appropriate template. Default: application |
| version   | Format: x.x.x                                                                                                 |

## Lockers

Project contents are stored within a **locker**. You can upload the contents of your project to any locker defined in your CycleCloud install via the command `cyclecloud project upload (locker)`, where (locker) is the name of a cloud storage locker in your CycleCloud install. This locker will be set as the default target. Alternatively, you can see what lockers are available to you with the command `cyclecloud locker list`. Details about a specific locker can be viewed with `cyclecloud locker show (locker)`.

If you add more than one locker, you can set your default with `cyclecloud project default_target (locker)`, then simply run `cyclecloud project upload`. You can also set a global default locker that can be shared by projects with the command `cyclecloud project default locker (locker) -global`.

> [!NOTE]
> Default lockers will be stored in the cyclecloud config file (usually located in ~/.cycle/config.ini),
> not in the project.ini. This is done to allow project.ini to be version controlled.

Uploading your project contents will zip the chef directories and sync both chef and cluster init to your target locker. These will be stored at:

* (locker)/projects/(project)/(version)/(spec_name)/cluster-init
* (locker)/projects/(project)/(version)/(spec_name)/chef

## Blob Download

Use `project download` to download all blobs referenced in the project.ini to your local blobs directory. The command uses the `[locker]` parameter and will attempt to download blobs listed in project.ini from the locker to local storage. An error will be returned if the files cannot be located.

## Project Setup

## Specs

When creating a new project, a single default spec is defined. You can add additional specs to your project via the `cyclecloud project add_spec` command.

## Versioning

By default, all projects have a **version** of 1.0.0. You can set a custom version as you develop and deploy projects by setting `version=x.y.z` in the _project.ini_ file.

For example, if "locker_url" was "az://my-account/my-container/projects", project was named "Order66", version was "1.6.9", and the spec is "default", your url would be:

* _az://my-account/my-container/projects/Order66/1.6.9/default/cluster-init_
* _az://my-account/my-container/projects/Order66/1.6.9/default/chef_

## Blobs

There are two types of blob: **project blobs** and **user blobs**.

### Project Blobs

Project Blobs are binary files provided by the author of the project with the assumption that they can be distributed (i.e. a binary file for an open source project you are legally allowed to redistribute). Project Blobs go into the "blobs" directory of a project, and when uploaded to a locker they will be located at _/project/blobs_.

To add blobs to projects, add the file(s) to your _project.ini_:

``` ini
[[blobs optionalname]]
  Files = projectblob1.tgz, projectblob2.tgz, projectblob3.tgz
```

Multiple blobs can be separated by a comma. You can also specify the relative path to the project's blob directory.

### User Blobs

User Blobs are binary files that the author of the project cannot legally redistribute, such as UGE binaries. These files are not packaged with the project, but instead must be staged to the locker manually. The files will be located at _/blobs/my-project/my-blob.tgz_. User Blobs do not need to be defined in the project.ini.

To download any blob, use the `jetpack download` command from the CLI, or the `jetpack_download` Chef resource. CycleCloud will look for the user blob first. If that file is not located, the project level blob will be used.

> [!NOTE]
> It is possible to override a project blob with a user blob of the same name.

## Specify Project within a Cluster Template

Project syntax allows you to specify multiple specs on your nodes. To define a project, use the following:

``` ini
[[[cluster-init myspec]]]
  Project = myproject # inferred from name
  Version = x.y.z
  Spec = default  # (alternatively, you can name your own spec to be used here)
  Locker = default  # (optional, will use default locker for node)
```

> [!NOTE]
> The name specified after 'spec' can be anything, but can and should be used as a shortcut to define some > common properties.

You can also apply multiple specs to a given node as follows:

``` ini
[[node master]]
  [[[cluster-init myspec]]]
  Project = myproject
  Version = x.y.z
  Spec = default  # (alternatively, you can name your own spec to be used here)
  Locker = default  # (optional, will use default locker for node)

[[[cluster-init otherspec]]]
Project = otherproject
Version = a.b.c
Spec = otherspec  # (optional)
```

By separating the project name, spec name, and version with colons, CycleCloud can parse those values into the appropriate `Project/Version/Spec` settings automatically:

``` ini
[[node master]]
  AdditionalClusterInitSpecs = $ClusterInitSpecs
  [[[cluster-init myproject:myspec:x.y.z]]]
  [[[cluster-init otherproject:otherspec:a.b.c]]]
```

Specs can also be inherited between nodes. For example, you can share a common spec between all nodes, then run a custom spec on the master node:

``` ini
[[node defaults]]
[[[cluster-init my-project:common:1.0.0]]]
Order = 2 # optional
[[node master]]
[[[cluster-init my-project:master:1.0.0]]]
Order = 1 # optional

[[nodearray execute]]
[[[cluster-init my-project:execute:1.0.0]]]
   Order = 1 # optional
```

This would apply both the `common` and `master` specs to the master node, while only applying the `common` and `execute` specs to the execute nodearray.

By default, the specs will be run in the order they are shown in the template, running inherited specs first. `Order` is an optional integer set to a default of 1000, and can be used to define the order of the specs.

If only one name is specified in the `[[[cluster-init]]]` definition, it will be assumed to be the spec name. For example:

``` ini
[[[cluster-init myspec]]]
Project = myproject
Version = 1.0.0
```

is a valid spec setup in which `Spec=myspec` is implied by the name.

## run_list

You can specify a runlist at the project or spec level within your project.ini:

``` ini
[spec master]
run_list = role[a], recipe[b]
```

When a node includes the spec "master", the run_list defined will be automatically appended to any previously-defined runlist. For example, if my run_list defined under `[configuration]` was `run_list = recipe[test]`, the final runlist would be `run_list = recipe[cyclecloud], recipe[test], role[a], recipe[b], recipe[cluster_init]`.

You can also overwrite a runlist at the spec level on a node. This will replace any run_list included in the project.ini. For example, if we changed the node definition to the following:

``` ini
[cluster-init test-project:master:1.0.0]
run_list = recipe[different-test]
```

The runlist defined in the project would be ignored, and the above would be used instead. The final runlist on the node would then be `run_list = recipe[cyclecloud], recipe[test], recipe[different-test], recipe[cluster_init]`.

> [!NOTE]
> runlists are specific to chef and do not apply otherwise.

## File Locations

The zipped chef files will be downloaded during the bootstrapping phase of node startup. They are downloaded to *$JETPACK_HOME/system/chef/tarballs* and unzipped to *$JETPACK_HOME/system/chef/chef-repo/*, and used when converging the node.

> [!NOTE]
> To run custom cookbooks, you MUST specify them in the run_list for the node.

The cluster-init files will be downloaded to */mnt/cluster-init/(project)/(spec)/*. For "my-project" and "my-spec", you will see your scripts, files, and tests located in */mnt/cluster-init/my-project/my-spec*.

## Syncing Projects

CycleCloud projects can be synced from mirrors into cluster local cloud storage. Set a SourceLocker attribute on a `[cluster-init]` section within your template. The name of the locker specified will be used as the source of the project, and contents will synced to the your locker at cluster start. You can also use the name of the locker as the first part of the cluster-init name. For example, if the source locker was "cyclecloud", the following two definitions are the same:

``` ini
[cluster-init my-project:my-spect:1.2.3]
  SourceLocker=cyclecloud

[cluster-init cyclecloud/my-proect:my-spec:1.2.3]
```

## Large File Storage

Projects supports large files. At the top level of a newly created project you will see a "blobs" directory for your large files (blobs). Please note that blobs placed in this directory have a specific purpose, and will act differently than the items within the "files" directory.

Items within the "blobs" directory are spec and version independent: anything in "blobs" can be shared between specs or project versions. As an example, an installer for a program that changes infrequently can be stored within "blobs" and referenced within your *project.ini*. As you iterate on versions of your project, that single file remains the same and is only copied into your cloud storage once, which saves on transfer and storage cost.

To add a blob, simply place a file into the "blobs" directory and edit your *project.ini* to reference that file:

``` ini
[blobs]
  Files=big_file1.tgz
```

When you use the `project upload` command, all blobs referenced in the project.ini will be transferred into cloud storage.

## Log Files

Log files generated when running cluster-init are located in *$JETPACK_HOME/logs/cluster-init/(project)/(spec)*.

## Run Files

When a cluster-init script is run successfully, a file is placed in */mnt/cluster-init/.run/(project)/(spec)* to ensure it isn't run again on a subsequent converge. If you want to run the script again, delete the appropriate file in this directory.

## Script Directories

When CycleCloud executes scripts in the scripts directory, it will add environment variables to the path and name of the spec and project directories:

``` script
CYCLECLOUD_PROJECT_NAME
CYCLECLOUD_PROJECT_PATH
CYCLECLOUD_SPEC_NAME
CYCLECLOUD_SPEC_PATH
```

On linux, a project named "test-project" with a spec of "default" would have paths as follows:

``` script
CYCLECLOUD_PROJECT_NAME = test-project
CYCLECLOUD_PROJECT_PATH = /mnt/cluster-init/test-project
CYCLECLOUD_SPEC_NAME = default
CYCLECLOUD_SPEC_PATH = /mnt/cluster-init/test-project/default
```

## Run Scripts Only

To run ONLY the cluster-init scripts:

```azurecli-interactive
jetpack converge --cluster-init
```

Output from the command will both go to STDOUT as well as jetpack.log. Each script will also have its output logged to:

``` outfile
      $JETPACK_HOME/logs/cluster-init/(project)/(spec)/scripts/(script.sh).out
```

## Custom chef and Composable Specs

Each spec has a chef directory in it. Before a converge, each spec will be untarred and extracted into the local chef-repo, replacing any existing cookbooks, roles, and data bags with the same name(s). This is done in the order the specs are defined, so in the case of a naming collision, the last defined spec will always win.

## jetpack download

To download a blob within a cluster-init script, use the command `jetpack download (filename)` to pull it from the blobs directory. Running this command from a cluster-init script will determine the project and base URL for you. To use it in a non-cluster-init context, you will need to specify the project (see --help for more information).

For chef users, a `jetpack_download` LWRP has been created:

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
