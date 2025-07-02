---
title: Common Issues - Resolving Cookbooks
description: Azure CycleCloud common issue - Resolving Cookbooks
author: adriankjohnson
ms.date: 06/30/2025
ms.author: adjohnso
---
# Common issues: Error resolving Chef cookbooks or Chef::Exceptions:RecipeNotFound

## Possible error messages

- `Error resolving Chef cookbooks - No such cookbook: {FOO}`
- `Chef::Exceptions::RecipeNotFound: could not find recipe bar for cookbook {FOO}`

## Resolution

When a node starts with jetpack, it loads Chef cookbooks from different sources. Jetpack copies these cookbooks to `/opt/cycle/jetpack/system/chef/chef-repo/cookbooks`. If you see this error, it means jetpack didn't load the cookbook from any of the possible sources. These sources include projects that the cluster-init specs reference for the node and CycleCloud internal cookbooks.

The node's _configuration.run_list_ determines which cookbooks you need. You might see `run_list = recipe[foo]` or `= recipe[foo::bar]`. Both run_lists specify the `foo` cookbook and either the `default` or `bar` recipe in those cookbooks.

Check that the cookbook exists in the project

1. Check that the `foo` cookbook exists in the project.
1. Check that the `foo` cookbook contains the `bar` recipe.
1. Make sure you uploaded the project containing `foo` to the storage locker.
1. Make sure you reference the spec in the cluster-init for the node.
1. Make sure the version of the spec reference by the node matches the version of the spec containing the cookbook.

`RecipeNotFound` indicates that the cookbook can be found, but that the cookbook is missing a designated recipe.

## More information

Learn more about [CycleCloud Projects](~/articles/cyclecloud/how-to/projects.md).

