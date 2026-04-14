---
title: Chef Orchestration in Azure CycleCloud
description: Learn about Chef orchestration in Azure CycleCloud. Chef is a configuration management tool that automates the deployment and management of applications and infrastructure.
author: dougclayton
ms.author: doclayto
ms.date: 09/23/2025
ms.update-cycle: 1095-days
ms.custom: compute-evergreen
---

# Chef orchestration

[Chef](https://www.chef.io) is a configuration management tool that automates the deployment and management of applications and infrastructure. It uses a domain-specific language (DSL) for writing system configuration "recipes." These recipes are stored in "cookbooks" that can be shared and reused across different systems.

Each cluster-init spec can reference one or more [Chef roles](https://docs.chef.io/roles.html) and/or [cookbook recipes](https://docs.chef.io/recipes.html) that need to be executed on the booting VM. 

> [!NOTE]
> CycleCloud uses Chef in a stand-alone mode that doesn't rely on a centralized Chef server. The set of Chef cookbooks needed to prepare each VM are downloaded from the Azure Storage Account along with the rest of the files in the project.

## Project Structure

The **specs** directory in a project can also contain a **chef** subdirectory.
This directory contains three directories: **site-cookbooks** (for cookbook definitions), **data_bags** (data bag definitions), and **roles** (Chef role definition files):

``` directories
      myproject
          ├── specs
          │   ├── default
          │     └── chef
          │         ├── site-cookbooks
          │         ├── data_bags
          │         └── roles
```

## Chef Runlists

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

## Custom Chef and composable specs

Each spec can contain a **chef** directory. Before you converge a node, the process untars and extracts each spec into the local chef-repo, replacing any existing cookbooks, roles, and data bags with matching names. The process follows the order in which you define the specs, so the last defined spec wins if there's a naming conflict.

## File locations

When you upload your project contents, CycleCloud zips the three custom Chef directories and syncs them to your target locker, at `(locker)/projects/(project)/(version)/(spec_name)/chef`.


The node downloads the zipped Chef files during the bootstrapping phase of node startup. The node downloads the files to `$JETPACK_HOME/system/chef/tarballs*`, unzips them to `$JETPACK_HOME/system/chef/chef-repo/`, and uses them to converge the node.

> [!NOTE]
> To run custom cookbooks, you must add them to the run_list for the node.


## Jetpack download resource provider

The following example shows how to create a `jetpack_download` lightweight resource provider for Chef users:

``` ini
jetpack_download "big-file1.tgz" do
  project "my-project"
  end
```

In Chef, the default download location is `#{node[:jetpack][:downloads]}`. To change the file destination, use the following code:

``` ini
jetpack_download "foo.tgz" do
  project "my-project"
  dest "/tmp/download.tgz"
end
```

When you use the command within Chef, you must specify the project.
