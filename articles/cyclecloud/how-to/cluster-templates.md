---
title: Cluster Templates
description: Use or build cluster templates within Azure CycleCloud. See configuration notation, cluster template parameters, machine types, spot virtual machines, and more.
author: adriankjohnson
ms.date: 06/30/2025
ms.author: adjohnso
ms.topic: how-to
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
---

# Cluster templates

Azure CycleCloud uses templates to define cluster configurations. CycleCloud includes many templates by default. For a full list of supported templates, see [GitHub](https://github.com/Azure?q=cyclecloud). You can create new templates or customize existing ones. For example, you might customize an existing template to take advantage of [Spot VMs](/azure/virtual-machines/windows/spot-vms), or add a VPC to extend your own network.

## Configuration notation

Azure CycleCloud cluster templates let you add one or more **[[[configuration]]]**
sections to a node or node array. These sections specify software configuration
options for the nodes that CycleCloud starts. Use dotted notation to specify
the attributes you want to configure:

``` ini
[[node scheduler]]
  [[[configuration]]]
  cycle_server.admin.name = poweruser
  cycle_server.admin.pass = super_secret
  cycle_server.http_port = 8080
  cycle_server.https_port = 8443
```

You can also use `prefix` notation to specify a configuration section and save typing.
The same configuration could also be written as:

``` ini
[[node scheduler]]
  [[[configuration cycle_server]]]
  admin.name = poweruser
  admin.pass = super_secret
  http_port = 8080
  https_port = 8443
```

A node or node array can also contain multiple configuration sections if needed:

``` ini
[[node scheduler]]
  [[[configuration]]]
  run_list = role[sge_scheduler_node]

  [[[configuration cycle_server.admin]]]
  name = poweruser
  pass = super_secret
```

## Cluster template parameters

Cluster templates can contain parameters that you use to change the values for certain parts of a cluster. You don't need to modify the template itself. This feature is especially useful when you want to create many similar clusters with minor differences, such as deploying development and production environments. To specify a parameter within a cluster template, prefix a variable with a '$'. A basic template example (non-functional) with some parameters could look like:

``` ini
# template.txt
[cluster gridengine]

  [[node scheduler]]
  MachineType = $machine_type

    [[[configuration]]]
    gridengine.slots = $slots
```

This template defines two parameters: `$machine_type` and `$slots`. With this template, you can create text files that contain the values for these parameters in both the dev and prod environments. You can use either JSON format or Java properties file format for the parameters file:

``` JSON
# dev-params.json
{
  "machine_type": "H16r",
  "slots": 2
}

# prod-params.properties
machine_type = Standard_D4v3
slots = 8
```

This example creates a JSON file containing the parameters for dev and a .properties file containing the values for production.

> [!NOTE]
> The filename suffix for your parameters file is important! If you use JSON, name your file `foo.json`. If you use Java properties, end your file name with `.properties`. Incorrectly named parameter files won't import properly.

Now you can import the template using the parameters file to fill in the missing pieces:

```azurecli-interactive
cyclecloud import_cluster gridengine-dev -f template.txt -p dev-params.json -c gridengine

cyclecloud import_cluster gridengine-prod -f template.txt -p prod-params.properties -c gridengine
```

You can also define some or all of the parameters within the cluster template itself:

``` ini
# template.txt
[cluster gridengine]

  [[node scheduler]]
  MachineType = $machine_type

    [[[configuration]]]
    gridengine.slots = $slots

[parameters]
  [[parameter machine_type]]
  DefaultValue = Standard_D4v3

  [[parameter slots]]
  DefaultValue = 2
```

The template defines default values for each parameter (we used the dev values as defaults).

You can now import the template without a parameters file, and the dev values are used automatically. When it's time to create a prod cluster, use the prod-params.properties file to overwrite the values specified inside the template file itself.

> [!NOTE]
> Parameter names can include any letters, numbers, and underscores.

Parameter references in the template can take one of two forms:

`$param`: Uses the value of a single parameter named `param`.

`${expr}`: Evaluates `expr` in the context of all parameters, which lets you compute dynamic values. For example:

``` parameters
Attribute = ${(a > b ? a : b) * 100}
```

This expression takes the larger of two parameters, `a` and `b`, and multiplies it by 100.
The expression is interpreted and evaluated according to the [ClassAd language specification](http://research.cs.wisc.edu/htcondor/classad/refman.pdf).

If a parameter reference exists by itself, the value of the parameter is used,
which supports non-string types like booleans, integers, and nested structures such as lists.
However, if the reference is embedded in other text, its value is converted and included in a string.
For example, suppose `param` is defined as `456` and referenced in two places:

* Attribute1 = $param
* Attribute2 = 123$param

The value of `Attribute1` is the number `456`, but the value of `Attribute2` is the string `"123456"`. `${param}` works the same as `$param`, so you can use it to include parameter references in more complex situations:

* Attribute3 = 123$param789
* Attribute4 = 123${param}789

`Attribute3` looks for the parameter named `param789`, but `Attribute4` uses the value of `param` to get `"123456789"`.

## Machine types

Azure CycleCloud supports multiple machine types through the `MachineType` attribute. The solution tries to get capacity in the order you list.

## Cluster init specs

The Azure CycleCloud web application lets you select cluster init project specs when you create a new cluster. Set up the project specs within the cluster template:

``` ini
[parameter ClusterInitSpecs]
Label = Cluster-Init
Description = Cluster init specs to apply to nodes
ParameterType = Cloud.ClusterInitSpecs

[cluster demo]

  [[node defaults]]
  AdditionalClusterInitSpecs = $ClusterInitSpecs

      [[[cluster-init myproject:myspec:1.0.0]]]
```

After adding this parameter to your cluster template, you can use the file picker to select the right project specs when you create a cluster.

## Spot virtual machines

To reduce the cost of your workloads, set `Interruptible` to `true`. This setting flags your instance as a spot virtual machine and enables it to use surplus capacity when available. Keep in mind that these instances aren't always available and can be preempted at any time, so they might not be appropriate for your workload.

By default, when you set `Interruptible` to true, the instance uses spot virtual machines with a max price set to -1. This setting means the instance isn't evicted based on price. The price for the instance is the current price for spot virtual machines or the price for a standard instance, whichever is less, as long as there's capacity and quota available. To set a custom max price, use the `MaxPrice` attribute on the desired node or node array.

``` ini
[cluster demo]

  [[nodearray execute]]
  Interruptible = true
  MaxPrice = 0.2
```

## Lookup tables

You can have one parameter reference another and compute a certain value with a lookup table. For example, suppose you have a parameter for the image to use, with two choices in this case:

``` ini
[[parameter MachineImage]]
    Label = Image
    DefaultValue = image-1000
    Description = Ubuntu 22.04
    Config.Plugin = pico.control.AutoCompleteDropdown
    [[[list Config.Entries]]]
        Name = image-1000
        Label = Ubuntu 20.04
    [[[list Config.Entries]]]
        Name = image-2000
            Label = Ubuntu 22.04
```

You can also get the OS version of the chosen image and use it for other configuration by making e a parameter whose value is a lookup table of values:

``` ini
[[parameter AmiLookup]]
  ParameterType = hidden
  [[[record DefaultValue]]]
      image-1000 = Ubuntu 20.04
      image-2000 = Ubuntu 22.04
```

This parameter is hidden, so it doesn't appear in the UI.

You can get the OS version used for the chosen image anywhere else in the cluster definition:

``` ini
[[node node]]
[[[configuration]]]
version = ${AmiLookup[MachineImage]}
```

## GUI integration

Defining parameters within the cluster template enables you to take advantage of the Azure CycleCloud GUI. For example, when defining parameters, use the following attributes to assist in GUI creation:

``` ini
# template.txt
[cluster gridengine]

  [[node scheduler]]
  MachineType = $machine_type

    [[[configuration]]]
    gridengine.slots = $slots

[parameters]
  [[parameter machine_type]]
  DefaultValue = Standard_D4v3
  Label = Machine Type
  Description = MachineType to use for the Grid Engine scheduler node
  ParameterType = Cloud.MachineType

  [[parameter slots]]
  DefaultValue = 2
  Description = The number of slots for Grid Engine to report for the node
```

The GUI includes the **Label** and **Description** attributes, which appear in the GUI, as well as the optional **ParameterType** attribute. The **ParameterType** attribute allows custom UI elements to be displayed. In the preceding example, the `Cloud.MachineType` value displays a dropdown containing all of the available machine types. The other ParameterType values are:

| Parameter Type    | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| Cloud.MachineType | Displays a dropdown containing all available machine types.              |
| Cloud.Credentials | Displays a dropdown containing all of the available credentials.         |
| Cloud.Region      | Displays a dropdown containing all available regions.                    |

## Chef Server support

Azure CycleCloud supports [ChefServer](https://docs.chef.io/server_components.html).

Create the file `chefserver.json` and add your credentials. `ValidationKey`
corresponds to the `validation.pem` file for your chef server. You also must provide the
`validation_client_name` if you change it from the default value of `chef-validator`:

``` JSON
{
"AdType" : "Cloud.Locker",
"ValidationKey" : "YOURVALIDATION.PEMHERE",
"ValidationClientName" : "chef-validator",
"Credentials" : "default",
"Location" : "https://mychefserver",
"ChefRepoType" : "chefserver",
"LockerType" : "chefrepo",
"Name" : "chefrepo",
"AccountId" : "default",
"Shared" : false
}
```

Next, place the file in the directory `/opt/cycle_server/config/data`. The server automatically imports the file.

## Custom user images in templates

Azure CycleCloud supports custom images in templates. You can specify the image ID (resource ID) directly with `ImageId`, or you can add the image to the image registry. When you add the image to the registry, you can reference it with either `Image` or `ImageName` on your node. The image appears in the **image dropdown** on the cluster creation page.

Images in the image registry consist of a `Package` record that identifies the contents of the logical image and one or more corresponding `Artifact` records that specify the actual image ID in the appropriate cloud provider. For example, a custom image with R installed on it might consist of this Package record:

``` ini
AdType = "Package"
Name = "r_execute"
Version = "2.1.1"
PackageType = "image"
Label = "R"
```

When you add that record, you can specify the image by including either `Image = R` or `ImageName = r_execute` in the cluster template.

If this image existed as a single virtual machine in **East US** with an ID of `/subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage`, you need to store the following artifact:

``` ini
AdType = "Artifact"
Package = "r_execute"
Version = "2.1.1"
Name = "az/useast"
Provider = "az"
ImageId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage"
```

You must specify `Provider` on the artifact.

You can add as many artifacts as you want for a given image package, but you must include all the artifacts required to use that image in all the locations you want (one per cloud provider account, regions, projects, and so on). The name of the artifact isn't important, except that it must be unique to all artifacts for a given package and version. We usually recommend using a combination of the provider and provider-specific details, such as the region. CycleCloud automatically picks the right artifact to match the provider and any provider-specific details, but it uses the Provider attribute (and Region, and so on) rather than parsing the Name.

If you add more than one image package with the same name, each package must have a different version number. When you start an instance, CycleCloud automatically selects the image with the highest version number. It treats the version number as a dotted string and compares each part as a number. To override this behavior, specify `ImageVersion` on the node as either a literal version number (for example, `1.2`) or a wildcard version number (for example, `1.x`).
