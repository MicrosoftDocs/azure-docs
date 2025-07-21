---
title: Tagging Nodes
description: Learn about tagging nodes in Azure CycleCloud. CycleCloud automatically adds Azure tags to resources created from nodes.
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# Tag nodes

Azure CycleCloud automatically creates and adds three tags to each node: a name, the cluster name, and the owner. These tags make it easier to audit ownership of the nodes when using non-CycleCloud tools.

| Tag               | Description                                                                            |
| ----------------- | -------------------------------------------------------------------------------------- |
| ClusterName       | Name of the CycleCloud cluster the node is running in                                  |
| Name              | Name of the node (for head node resources only)                                        |
| CycleOwner        | The user that starts the node                                                         |
| LaunchTime        | The time that you create this resource                                                |
| ClusterId         | An identifier for the cluster (Available on CycleCloud v8.2 or earlier)                                    |
| CycleCloudCluster | A globally unique name for the cluster (Available from CycleCloud v8.2 onwards)        |
| CycleCloudNodeArray  | A globally unique name for the node array, if it comes from a node array (Available from CycleCloud v8.2 onwards)     |

The formats for the encoded tags are as follows:
- `CycleCloudCluster`: /sites/[site_id]/clusters/[cluster_name]
- `CycleCloudNodearray`: /sites/[site_id]/clusters/[cluster_name]/nodearrays/[nodearray_name]
- `CycleOwner`: [cluster_name]\([username]@[site_name]:[site_id]\)

The parameters referenced earlier are defined as:
- `username`: the CycleCloud user that starts the node.
- `site_name`: the user-defined name of the CycleCloud installation.
- `site_id`: the CycleCloud site ID that uniquely identifies the CycleCloud installation.
- `cluster_name`: the name of the cluster.
- `nodearray`: the name of the node array the node is in.

For example, a node called **scheduler** in a cluster named **Demo** that you start with **username** running on a CycleCloud site **mysite** with the ID **92xy4vgh** automatically has the following tags on the VM, nic, and disk resources:

``` ini
Name => "scheduler"
ClusterName => "Demo"
CycleCloudCluster => "/sites/92xy4vgh/clusters/Demo"
CycleOwner => "username@mysite:92xy4vgh"
ClusterId => "Demo(username@mysite:92xy4vgh)"
```

Nodes in the **Compute** node array get an extra tag:

``` ini
CycleCloudNodeArray => "/sites/92xy4vgh/clusters/Demo/nodearrays/Compute"
```

#::: moniker range=">=cyclecloud-8"
> [!NOTE]
> We added the CycleCloudCluster and CycleCloudNodeArray tags in version 8.2 to make it easier to get costs from Microsoft Cost Management. These tags use a standard format that's also used for the subject of [events sent to Event Grid](~/articles/cyclecloud/events.md#subject). The value for ClusterId isn't constant over time because the site name and owner can change.
#::: moniker-end


Within a resource that supports [Resource Manager Operations](/azure/azure-resource-manager/resource-group-using-tags), you can create extra tags to assign to the instance by specifying them with a node definition inside your template:

``` ini
[cluster Demo]
  [[node scheduler]]
    tags.Application = my application
    tags.CustomValue = 57
    tags.CustomText = Hello world
```

Creating a node with this definition results in three extra tags being set on the node along with the standard tags:

``` ini
Application => "my application"
CustomValue => "57"
CustomText => "Hello world"
```

## Restrictions

There are limits on the number and format of tags you can apply to each virtual machine. For more information, see [Limitations on tagging Azure Resources](/azure/azure-resource-manager/management/tag-resources#limitations).

Don't include quotation marks or periods in your tag names.

> [!NOTE]
> Tag names in CycleCloud can't contain the following characters: `.` `"` `:` `=`
> If a tag needs to include a period ('.'), use the notation Tag == ['tag.subtag'=value]. For example, if you want to create a tag named compute.node, use Tag == ['compute.node'=value].
> 
> You can also use these alternatives to the notation Tag == ['tag.subtag'=value] for defining tags with periods:
> - **Underscores**: Use underscores instead of periods, such as Tag == ['compute_node'=value].
> - **CamelCase**: Combine the main tag and subtag without separators, such as `Tag == ['computeNode'=value]`.
> - **Nested Tags**: Represent the hierarchical structure, such as `Tag == ['compute'={'node'=value}]`.
> - **Colon Separator**: Use a colon instead of a period, such as `Tag == ['compute:node'=value]`.


## Further reading

* [Tagging Reference docs](~/articles/cyclecloud/cluster-references/node-nodearray-reference.md#tags)
