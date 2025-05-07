---
title: Common Issues - Resolving Cookbooks
description: Azure CycleCloud common issue - Resolving Cookbooks
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Error resolving Chef cookbooks or Chef::Exceptions:RecipeNotFound

## Possible Error Messages

- `Error resolving Chef cookbooks - No such cookbook: {FOO}`
- `Chef::Exceptions::RecipeNotFound: could not find recipe bar for cookbook {FOO}`

## Resolution

Node startup with jetpack will load Chef cookbooks from various sources. The cookbooks will be copied to `/opt/cycle/jetpack/system/chef/chef-repo/cookbooks`. Encountering this error indicates that jetpack did not load the cookbook from any of the potential sources. The sources include projects, referenced in the cluster-init specs for the node, and CycleCloud internal cookbooks.

The required cookbooks are derived from the node _configuration.run_list_. You may see `run_list = recipe[foo]` or `= recipe[foo::bar]`. These run_lists both specify the `foo` cookbook and either the `default` or `bar` recipe in those cookbooks.

Make sure the cookbook exists in the project

1. Make sure the cookbook `foo` exists in the project.
1. Make sure the cookbook `foo` contains the recipe `bar`.
1. Make sure the project containing `foo` has been uploaded to the storage locker.
1. Make sure the spec is referenced in the cluster-init for the node.
1. Make sure the version of the spec reference by the node is the same as the version of the spec containing the cookbook.

`RecipeNotFound` indicates that the cookbook can be found, but that the cookbook is missing a designated recipe.

## More Information

Lean more about [CycleCloud Projects](~/articles/cyclecloud/how-to/projects.md)

