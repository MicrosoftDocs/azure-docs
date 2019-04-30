---
title: Tag Nodes in Azure CycleCloud | Microsoft Docs
description: Using node tags in Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---
# Tag Nodes

Azure CycleCloud will automatically create and add three tags to each node: a name, the cluster name, and the owner. These tags are meant to make it easier to audit ownership of the nodes when using non-CycleCloud tools.

| Tag         | Description                                                                |
| ----------- | -------------------------------------------------------------------------- |
| Name        | Full CycleCloud name of the node.                                          |
| ClusterName | Name of the CycleCloud cluster the node is running in.                     |
| CycleOwner  | Which user started the node, using the format username@site_name:site_id   |

The `CycleOwner` tag uses this format: [username]@[site_name]:[site_id], where username is the CycleCloud user that started the node, site_name is the user defined name of the CycleCloud installation, and site_id is the CycleCloud Site ID that identifies the CycleCloud installation. For example, a cluster named "Demo" with a node called "master" started by "username" running on CycleCloud site "mysite" with id "92xy4vgh" would have the following tags created automatically:

``` ini
Name => "Demo: master"
ClusterName => "Demo"
CycleOwner => "username@mysite:92xy4vgh"
```

Within a resource that supports [Resource Manager Operations](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags) you can create additional tags to assign to the instance by specifying them with a node definition inside your template:

``` ini
[cluster Demo]
  [[node master]]
    tags.Application = my application
    tags.CustomValue = 57
    tags.Custom Text = Hello world
```

Creating a node with this definition will result in three additional tags being set on the node:

``` ini
Name => "Demo: master"
ClusterName => "Demo"
Application => "my application"
CustomValue => "57"
Custom Text => "Hello world"
```

### Restrictions

There are limits on the number and format of tags applied to each Virtual Machine. Please review the [Tagging Azure Resources](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags) documentation for full details.

Do not include quote marks or periods in your tag names.

Please note that resources created with the Azure classic portal cannot use tags.
