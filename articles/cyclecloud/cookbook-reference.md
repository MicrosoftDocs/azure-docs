---
title: Cookbook Reference
description: See reference information for Chef Cookbooks in Azure CycleCloud. Understand basic Chef concepts, attributes, and the thunderball resource.
author: adriankjohnson
ms.topic: reference
ms.date: 06/10/2025
ms.author: adjohnso
---

# Common cookbooks reference

Azure CycleCloud clusters are built and configured using a combination of a base machine image, CycleCloud Cluster Init, and the Chef infrastructure automation framework.

Only advanced CycleCloud users need to understand how to build Chef cookbooks. However, many users benefit from a basic knowledge of how CycleCloud uses Chef. In particular, users should understand the concept of a `run_list`, `recipe`, and Chef `attributes`.

## Basic Chef concepts

Each `node` in a CycleCloud cluster is initialized by following a Chef `run_list`. The `run_list` is an ordered set of features or `recipes` to apply to initialize the node. The `recipes` contain the implementation of low-level system operations required to apply the feature. `Cookbooks` are collections of `recipes` that make up a feature. `Cookbooks` and `recipes` are parameterized by Chef `attributes` to allow further customization and configuration of the feature.

CycleCloud ships with a set of predefined cluster templates that you can use to provision a set of cluster types that is sufficient for many users. You can easily accomplish further customization using Cluster-Init. So most users never need to modify `run_lists` or build their own `recipes` and `cookbooks`.

However, CycleCloud clusters are provisioned using a set of *Common Cookbooks* available to all CycleCloud clusters. These `cookbooks` have a set of `attributes` that you might want to customize. The following sections document some of the most commonly used `attributes`.

> [!NOTE]
> Prefer Cluster Template features to direct modification of Chef attributes.

Common Cookbook attributes are subject to change. Attribute settings are commonly superseded as the features they control become available as more general or powerful features of CycleCloud. If a customization is available in both the Cluster Template and via a Chef attribute, always prefer the Cluster Template method since it's the more general solution.

For more information on the Opscode Chef framework, see the [Opscode website](https://www.chef.io/).

## Using Chef attributes

Chef `attributes` configure the operation of the `run_list` for an individual node or node array. Set these attributes in the node's `[[[configuration]]]` subsection. For example, the following code sets the CycleServer admin password for a node configured to run CycleServer:

``` ini
[[node cycle_server]]

[[[configuration]]]

run_list = role[monitor], recipe[cyclecloud::searchable], recipe[cfirst], \
recipe[cuser::admins], recipe[cshared::client], recipe[cycle_server::4-2-x], \
recipe[cluster_init], recipe[ccallback::start], recipe[ccallback::stop]

cycle_server.admin.pass=P\@ssw0rd
```

## Thunderball

Cycle Computing provides a Chef resource called `thunderball` to simplify downloading of objects
from cloud services to nodes. Thunderball automatically handles retrying failed downloads and
supports multiple configurations. By default, thunderball downloads a file from the CycleCloud
package repository and writes it to `$JETPACK_HOME/system/chef/cache/thunderballs`. An example
using the default configuration:

``` txt
thunderball "condor" do
    url "cycle/condor-8.2.9.tgz"
end
```

The following table lists all of the attributes of the thunderball resource.

| Attribute  | Description                                                                      |
| ---------- | -------------------------------------------------------------------------------- |
| checksum   | SHA256 checksum for the artifact to be downloaded.                               |
| client     | Command line client to use. Defaults to `:pogo`.                                 |
| config     | Custom thunderball configuration to use.                                         |
| dest_file  | The file path to download to. `storedir` is ignored when `dest_file` is in use.  |
| storedir   | Location files are downloaded to. Defaults to `thunderball.storedir`.            |
| url        | The location of the file to be downloaded (full or partial).                     |

To download objects from another repository, use custom configuration sections.

| Attribute   | Description |
| ---------   | ----------- |
| base        | Base URL.   |
| client      | Command line tool to interact with provider.  |
| endpoint    | URL endpoint to use.   |
| filename    | Config file to use.   |
| password    | Password for Azure.  |
| proxy_host  | Host to use as proxy.    |
| proxy_port  | Port to use for proxy.  |
| user        | Local system user for the configuration. If you specify the `user` attribute, the `filename` attribute is ignored. the user's home directory contains the configuration file. |
| username    | Access_key/username for Azure.  |
