---
title: Create a Cluster
description: Different ways of creating a cluster in cyclecloud
author: dpwatrous
ms.date: 07/01/2025
ms.author: dawatrou
---

# Create a new cluster

You can create new clusters through the CycleCloud CLI or a web browser. You create clusters from [templates](../cluster-references/cluster-template-reference.md). These templates might be text files on disk or files you imported into the CycleCloud application server.

This article shows how to create a new cluster from an existing template. For more information, see [How to use CycleCloud cluster templates](../how-to/cluster-templates.md).

## Using a web browser

Select **Add** in the lower left of the clusters page. You see a list of icons. Each icon represents a cluster template that you can use to create a new cluster. If you want to import a new cluster template so that it appears on this page, see [Importing a Cluster Template](#importing-a-cluster-template). Select one of the templates and enter a unique name for the new cluster.

::: moniker range="=cyclecloud-7"
![CycleCloud Create New Cluster Screen](../images/version-7/create-cluster-selection.png)
:::

::: moniker range="=cyclecloud-8"
![CycleCloud Create New Cluster Screen](../images/version-8/create-cluster-selection.png)
:::

Fill out the new cluster form and select **Save** to create the new cluster. You can change these values later by using **Edit** on the cluster page, though most changes require terminating the cluster first.

::: moniker range=">=cyclecloud-8"

The cluster form is based on two things: the [cluster parameters](../how-to/cluster-templates.md#cluster-template-parameters), which are grouped into sections, and automatic sections that CycleCloud adds.

:::

### Cluster parameters

The parameters in the form vary based on the cluster template, but the following parameters are commonly required:

- **Region** determines the region for the nodes in the cluster. Changing the region might also affect the types of VMs that are available, as well as the capacity and quota.

- **Subnet ID** controls the virtual network and subnet where nodes start. You can create new subnets through the Azure portal or CLI. The portal automatically detects new subnets after a short time.

- **Max Cores** limits the number of nodes that autoscale based on the total number of running cores.

- **Credentials** associate with a single subscription and might change the values of many other cluster options. For example, when you select credentials associated with Azure Government, you limit the available regions.

- **Return Proxy** if checked, nodes communicate back to the CycleCloud application server through a proxy running on the cluster head node. Select this option if the cluster nodes can't directly access CycleCloud through the network.

::: moniker range="=cyclecloud-7"
![CycleCloud New Cluster Form](../images/version-7/create-cluster-form.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"
![CycleCloud New Cluster Form](../images/version-8/create-cluster-form.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"

### Standard cluster sections

CycleCloud 8 automatically adds standard cluster sections to the **Create** and **Edit** form for every cluster, regardless of type. The cluster template itself doesn't specify these sections, and you can't import or export them as parameters.

* CycleCloud 8.0+ includes a Cloud-init section
* CycleCloud 8.5+ includes a Security section

These sections let you edit certain settings for the node arrays and the standalone nodes defined in the cluster template. (It doesn't include nodes created from the node arrays, such as execute nodes.) 
The default for new clusters is to use the same values across all standalone nodes and node arrays, but you can choose to use different values for each.

**Separate settings for each standalone node and node array:**
![CycleCloud Separate Node Array Settings](../images/cluster-edit-separate.png)

**Shared settings used for all standalone nodes and node arrays:**
![CycleCloud Shared Node Array Settings](../images/cluster-edit-shared.png)

If the values match across all standalone nodes and node arrays, the **Apply to all** setting is activated.

> [!WARNING]
> When you toggle the **Apply to all** setting and select **Save**, you update all standalone nodes and node arrays with the new settings in the form.

## Using the CycleCloud CLI

You can create a cluster from the [CycleCloud CLI](../cli.md) in two ways: from an imported template or from a template file on disk. In either case, you need to provide any required cluster parameters as a JSON file.

The easiest way to generate a JSON file for use in the CLI is to create a cluster using your web browser and export its parameters with the `export_parameters` command. [Read more about cluster template parameters.](../how-to/cluster-templates.md#cluster-template-parameters)

To export parameters from a cluster named `existing-cluster`, run:

``` CLI
cyclecloud export_parameters existing-cluster > params.json
```

### Creating a new cluster from an imported template

If you already imported the cluster template into CycleCloud, you can run the `create_cluster` command to create a cluster. To create a new cluster named `new-cluster` from a template named `Example`, run:

``` CLI
cyclecloud create_cluster Example new-cluster -p params.json
```

### Creating a new cluster from a template file

If the cluster template exists as a file on disk, you can run the `import_cluster` command to create a cluster. To create a new cluster from a template file named `example-template.txt`, run:

``` CLI
cyclecloud import_cluster -f example-template.txt -p params.json
```

This command uses the name of the cluster in the template file, but you can specify your own name. If the cluster in the file is named `Example`, and you want to create a new cluster named `new-cluster`, run:

``` CLI
cyclecloud import_cluster new-cluster -c Example -f example-template.txt -p params.json
```

## Import a cluster template

To create a cluster with a web browser or the `create_cluster` CLI command, you need to import the template file into CycleCloud. The following examples use the following template file, named *example-template.txt*:

``` ini
[cluster Example]

    [[node scheduler]]
    ImageName = OpenLogic:CentOS:7.5:latest
    Region = $Region
    MachineType = $MachineType
    SubnetId = $SubnetId
    Credentials = $Credentials

[parameters Settings]

    [[parameter Region]]
    Description = Deployment Location
    ParameterType = Cloud.Region
    DefaultValue = westus2

    [[parameter MachineType]]
    Label = VM Type
    ParameterType = Cloud.MachineType
    DefaultValue = Standard_D12_v2

    [[parameter SubnetId]]
    Label = Subnet ID
    ParameterType = Azure.Subnet
    Required = True

    [[parameter Credentials]]
    ParameterType = Cloud.Credentials
```

To import the **Example** template, run the following command:

``` CLI
cyclecloud import_cluster -t -f example-template.txt
```

You can now create the template with a web browser or the `create_cluster` CLI command. During import, you can also specify a name that differs from the name in the file. To import the template with the name **Contoso** instead of **Example**, run:

``` CLI
cyclecloud import_cluster "Contoso" -c Example -t -f ./example-template.txt
```

> [!NOTE]
> Various attributes inside the cluster template affect how the template appears in the browser. For example, the template uses the "IconUrl" attribute to specify the icon it displays, and it uses the "Category" attribute for the heading above the template. For a full list of the supported attributes, see [Build a New Cluster Template](~/articles/cyclecloud/cluster-references/cluster-reference.md).
