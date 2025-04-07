---
title: Tagging Nodes
description: Learn about tagging nodes in Azure CycleCloud. CycleCloud automatically adds Azure tags to resources created from nodes.
author: adriankjohnson
ms.date: 2/7/2025
ms.author: adjohnso
---

# Tag Nodes

Azure CycleCloud will automatically create and add three tags to each node: a name, the cluster name, and the owner. These tags are meant to make it easier to audit ownership of the nodes when using non-CycleCloud tools.

| Tag                  | Description                                                                            |
| -------------------- | -------------------------------------------------------------------------------------- |
| ClusterName          | Name of the CycleCloud cluster the node is running in                                  |
| Name                 | Name of the node (for head node resources only)                                        |
| CycleOwner           | The user that started the node                                                         |
| LaunchTime           | The time that this resource was created                                                |
| ClusterId            | A identifier for the cluster (Available on CycleCloud v8.2 or earlier)                                    |
| CycleCloudCluster    | A globally unique name for the cluster (Available from CycleCloud v8.2 onwards)        |
| CycleCloudNodeArray  | A globally unique name for the nodearray, if it comes from a nodearray (Available from CycleCloud v8.2 onwards)     |

The formats for the encoded tags are as follows:
- `CycleCloudCluster`: /sites/[site_id]/clusters/[cluster_name]
- `CycleCloudNodearray`: /sites/[site_id]/clusters/[cluster_name]/nodearrays/[nodearray_name]
- `CycleOwner`: [cluster_name]\([username]@[site_name]:[site_id]\)

The parameters referenced above are defined as:
- `username`: the CycleCloud user that started the node
- `site_name`: the user-defined name of the CycleCloud installation
- `site_id`: the CycleCloud site id that uniquely identifies the CycleCloud installation
- `cluster_name`: the name of the cluster
- `nodearray`: the name of the nodearray the node is in

For example, a node called "scheduler" in a cluster named "Demo" started by "username" running on CycleCloud site "mysite" with id "92xy4vgh" would have the following tags created automatically on the VM, nic and disk:

``` ini
Name => "scheduler"
ClusterName => "Demo"
CycleCloudCluster => "/sites/92xy4vgh/clusters/Demo"
CycleOwner => "username@mysite:92xy4vgh"
ClusterId => "Demo(username@mysite:92xy4vgh)"
```

Nodes in the "Compute" nodearray would get an additional tag:
``` ini
CycleCloudNodeArray => "/sites/92xy4vgh/clusters/Demo/nodearrays/Compute"
```

#::: moniker range=">=cyclecloud-8"
> [!NOTE]
> The CycleCloudCluster and CycleCloudNodeArray tags were added in 8.2 to make it easier to get costs from Azure Cost Management, using a standard format also used for 
> the subject of [events sent to Event Grid](~/articles/cyclecloud/events.md#subject). The value for ClusterId is not constant over time, since the site name and owner can be changed.
#::: moniker-end


Within a resource that supports [Resource Manager Operations](/azure/azure-resource-manager/resource-group-using-tags) you can create additional tags to assign to the instance by specifying them with a node definition inside your template:

``` ini
[cluster Demo]
  [[node scheduler]]
    tags.Application = my application
    tags.CustomValue = 57
    tags.CustomText = Hello world
```

Creating a node with this definition will result in three additional tags being set on the node in addition to the standard tags:

``` ini
Application => "my application"
CustomValue => "57"
CustomText => "Hello world"
```

## Restrictions

There are limits on the number and format of tags applied to each Virtual Machine. Please review the [Limitations on tagging Azure Resources documentation](/azure/azure-resource-manager/management/tag-resources#limitations) for full details.

Do not include quotation marks or periods in your tag names.

> [!NOTE]
> Tag names in CycleCloud cannot contain the following characters: `.` `"` `:` `=`
> If a tag needs to include a period ('.'), use the notation Tag == ['tag.subtag'=value]. For instance, if you want to create a tag named compute.node, you should use Tag == ['compute.node'=value].
> 
> Also, following are some alternatives to the notation Tag == ['tag.subtag'=value] for defining tags with periods:
> - **Underscores**: Use underscores instead of periods, e.g., Tag == ['compute_node'=value].
> - **CamelCase**: Combine the main tag and subtag without separators, e.g., Tag == ['computeNode'=value].
> - **Nested Tags**: Represent the hierarchical structure, e.g., Tag == ['compute'={'node'=value}].
> - **Colon Separator**: Use a colon instead of a period, e.g., Tag == ['compute:node'=value].


## Further Reading

* [Tagging Reference docs](~/articles/cyclecloud/cluster-references/node-nodearray-reference.md#tags)
