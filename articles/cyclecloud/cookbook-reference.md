---
title: Cookbook Reference
description: See reference information for Chef Cookbooks in Azure CycleCloud. Understand basic Chef concepts, attributes, and the thunderball resource.
author: adriankjohnson
ms.topic: reference
ms.date: 03/09/2020
ms.author: adjohnso
---

# Common Cookbooks Reference

Azure CycleCloud clusters are built and configured using a combination of a base machine image, CycleCloud Cluster Init, and the Chef infrastructure automation framework.

Only very advanced CycleCloud users will need to understand how to build Chef cookbooks.  However, many users will benefit from a basic knowledge of how CycleCloud uses Chef.  In particular, users should understand the concept of a `run_list`, `recipe`, and Chef `attributes`.

## Basic Chef Concepts

Each `node` in a CycleCloud cluster is initialized by following a Chef `run_list`.  The `run_list` is an ordered set of features or `recipes` to be applied to initialize the node.  The `recipes` themselves implement the low-level system operations required to apply the feature.  `Cookbooks` are collections of `recipes` that make up a feature.  `Cookbooks` and `recipes` are parameterized by Chef `attributes` to allow further customization and configuration of the feature.

CycleCloud ships with a set of pre-defined cluster templates which can be used to provision a set of cluster types that is sufficient for many users. And, further customization is easily accomplished using Cluster-Init. So most users will never need to modify `run_lists` or build their own `recipes` and `cookbooks`.

However, CycleCloud clusters are provisioned using a set of *Common Cookbooks* available to all CycleCloud clusters, and those `cookbooks` have a set of `attributes` which users may wish to customize. Some of the most commonly used `attributes` are documented below.

> [!NOTE]
> Prefer Cluster Template features to direct modification of Chef attributes.

Common Cookbook attributes are subject to change. Attribute settings are commonly superceded as the features they control are made available as more general/powerful features of CycleCloud itself. If a customization is available in both the Cluster Template and via a Chef attribute, always prefer the Cluster Template method since it is the more general solution.

For more information on the Opscode Chef framework itself, see the [Opscode website](https://docs.opscode.com/).

## Using Chef Attributes

Chef `attributes` configure the operation of the `run_list` for an individual node or node array. They should be set in the node's `[[[configuration]]]` sub-section. For example, to set the CycleServer Admin Password for a node configured to run CycleServer:

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
from cloud services to nodes. thunderball automatically handles retrying failed download and
supports multiple configurations. By default, thunderball will download a file from the CycleCloud
package repository and writes it to `$JETPACK_HOME/system/chef/cache/thunderballs`. An example
using the default configuration:

``` txt
thunderball "condor" do
    url "cycle/condor-8.2.9.tgz"
end
```

The table below lists all of the attributes of the thunderball resource.

| Attribute  | Description                                                                      |
| ---------- | -------------------------------------------------------------------------------- |
| checksum   | SHA256 checksum for the artifact to be downloaded.                               |
| client     | Command line client to use. Defaults to `:pogo`.                                 |
| config     | Custom thunderball configuration to use.                                         |
| dest_file  | The file path to download to. `storedir` is ignored when `dest_file` is in use.  |
| storedir   | Location files are downloaded to. Defaults to `thunderball.storedir`.            |
| url        | The location of the file to be downloaded (full or partial).                     |

Custom configuration sections can be used in order to download objects from another repository.

| Attribute   | Description |
| ---------   | ----------- |
| base        | Base URL.   |
| client      | Command line tool to interact with provider.  |
| endpoint    | URL endpoint to use.   |
| filename    | Config file to use.   |
| password    | Password for Azure.  |
| proxy_host  | Host to use as proxy.    |
| proxy_port  | Port to use for proxy.  |
| user        | Local system user that will use this configuration. Configuration file is placed in this user's home directory (`filename` is ignored when this is used) |
| username    | Access_key/username for Azure.  |