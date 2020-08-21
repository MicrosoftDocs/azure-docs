---
title: Cluster Templates
description: Use or build cluster templates within Azure CycleCloud. See configuration notation, cluster template parameters, machine types, spot virtual machines, and more.
author: adriankjohnson
ms.date: 07/17/2019
ms.author: adjohnso
---

# Cluster Templates

Azure CycleCloud uses templates to define cluster configurations. A number of templates are included in CycleCloud by default and a full list of supported templates is [available in GitHub](https://github.com/Azure?q=cyclecloud). You can create new templates or you can customize existing ones. For instance, you may want to customize an existing template to take advantage of [Spot VMs](https://docs.microsoft.com/azure/virtual-machines/windows/spot-vms), or you might want to add a VPC to extend your own network.

## Configuration Notation

Azure CycleCloud cluster templates all have the option of having one or more **[[[configuration]]]**
sections which belong to a node or nodearray. These sections specify software configuration
options about the nodes being started by CycleCloud. Dotted notation is used to specify
the attributes you wish to configure:

``` ini
[[node master]]
  [[[configuration]]]
  cycle_server.admin.name = poweruser
  cycle_server.admin.pass = super_secret
  cycle_server.http_port = 8080
  cycle_server.https_port = 8443
```

You can also specify a configuration section using `prefix` notation to save typing.
The same configuration could also be written as:

``` ini
[[node master]]
  [[[configuration cycle_server]]]
  admin.name = poweruser
  admin.pass = super_secret
  http_port = 8080
  https_port = 8443
```

A node/nodearray can also contain multiple configuration sections if needed:

``` ini
[[node master]]
  [[[configuration]]]
  run_list = role[sge_master_node]

  [[[configuration cycle_server.admin]]]
  name = poweruser
  pass = super_secret
```

## Cluster Template Parameters

Cluster templates can contain parameters that alter the values of certain parts of a cluster without having to modify the template itself. This is particularly useful in cases where many similar clusters with minor differences are desired such as deploying development and production environments. The syntax for specifying a parameter within a cluster template is to prefix a variable with a '$'. A basic template example (non-functional) with some parameters could look like:

``` ini
# template.txt
[cluster gridengine]

  [[node master]]
  MachineType = $machine_type

    [[[configuration]]]
    gridengine.slots = $slots
```

This template defines two parameters: `$machine_type` and `$slots`. Using this template, you can define text files containing the values of the parameters in both the dev and prod environments. The parameters file can be in either JSON format or a Java properties file format:

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

This will create a JSON file containing the parameters for dev and a .properties file containing the values for production.

> [!NOTE]
> The filename suffix for your parameters file is important! If using JSON, your file must be named `foo.json`. If using Java properties, your file must end with `.properties`. Incorrectly named parameter files will not import properly.

You can now import the template using the parameters file to fill in the missing pieces:

```azurecli-interactive
cyclecloud import_cluster gridengine-dev -f template.txt -p dev-params.json -c gridengine

cyclecloud import_cluster gridengine-prod -f template.txt -p prod-params.properties -c gridengine
```

It is also possible to define some or all of the parameters within the cluster template itself:

``` ini
# template.txt
[cluster gridengine]

  [[node master]]
  MachineType = $machine_type

    [[[configuration]]]
    gridengine.slots = $slots

[parameters]
  [[parameter machine_type]]
  DefaultValue = Standard_D4v3

  [[parameter slots]]
  DefaultValue = 2
```

The default values for each parameter are defined within the template (we used the 'dev' values as defaults).

It is now possible to import the template without a parameters file, and the 'dev' values will be
used automatically. When it is time to create a 'prod' cluster, you can use the prod-params.properties file to overwrite the values specified inside the template file itself.

> [!NOTE]
> Parameter names can include any letters, numbers, and underscores.

Parameter references in the template can take one of two forms:

`$param`: Uses the value of a single parameter named `param`

`${expr}`: Evaluates `expr` in the context of all parameters, which lets you compute dynamic values. For example:

``` parameters
Attribute = ${(a > b ? a : b) * 100}
```

This would take the larger of two parameters, `a` and `b`, and multiply it by 100.
The expression is interpreted and evaluated according to the [ClassAd language specification](http://research.cs.wisc.edu/htcondor/classad/refman.pdf).

If a parameter reference exists by itself, the value of the parameter is used,
which supports non-string types like booleans, integers, and nested structures such as lists.
However, if the reference is embedded in other text, its value is converted and included in a string.
For example, suppose `param` is defined as `456` and referenced in two places:

* Attribute1 = $param
* Attribute2 = 123$param

The value of `Attribute1` would be the number `456`, but the value of `Attribute2` would be the string `"123456"`. Note that `${param}` is identical to `$param`, which allows you to embed parameter references in more complex situations:

* Attribute3 = 123$param789
* Attribute4 = 123${param}789

`Attribute3` would look for the parameter named `param789`, but Attribute4 would use the value of `param` to get `"123456789"`.

## Machine Types

Azure CycleCloud supports multiple machine types via the `MachineType` attribute. It will attempt to acquire capacity in the order listed.

## Cluster Init Specs

The Azure CycleCloud web application allows users to select cluster-init project specs when creating a new cluster. The project specs are set up within the cluster template:

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

Once this parameter has been added to your cluster template, your user can use the file picker to select the appropriate project specs when creating a new cluster.

## Spot Virtual Machines

To reduce the cost of your workloads, you can set `Interruptible = true`. This will flag your instance as Spot, and will use surplus capacity when available. It is important to note that these instances are not always available and can be preempted at any time, meaning they are not always appropriate for your workload.

By default, setting `Interruptible` to true will use spot instances with a max price set to -1; this means the instance won't be evicted based on price. The price for the instance will be the current price for Spot or the price for a standard instance, whichever is less, as long as there is capacity and quota available. If you would like to set a custom max price, use the `MaxPrice` attribute on the desired node or nodearray.

``` ini
[cluster demo]

  [[nodearray execute]]
  Interruptible = true
  MaxPrice = 0.2
```

## Lookup Tables

You can have one parameter reference another and compute a certain value with a lookup table. For example, suppose you have a parameter for the image to use, with two choices in this case:

``` ini
[[parameter MachineImage]]
    Label = Image
    DefaultValue = image-1000
    Description = CentOS 5.10
    Config.Plugin = pico.control.AutoCompleteDropdown
    [[[list Config.Entries]]]
        Name = image-1000
        Label = CentOS 5.10
    [[[list Config.Entries]]]
        Name = image-2000
            Label = CentOS 6.5
```

You can also get the OS version of the chosen image and use it for other configuration by making e a parameter whose value is a lookup table of values:

``` ini
[[parameter AmiLookup]]
  ParameterType = hidden
  [[[record DefaultValue]]]
      image-1000 = CentOS_5.10
      image-2000 = CentOS_6.5
```

Note that this is hidden, so that it does not appear in the UI.

You can get the OS version used for the chosen image anywhere else in the cluster definition:

``` ini
[[node node]]
[[[configuration]]]
version = ${AmiLookup[MachineImage]}
```

## GUI Integration

Defining parameters within the cluster template enables one to take advantage of the Azure CycleCloud GUI. As an example, when defining parameters the following attributes can be used to assist in GUI creation:

``` ini
# template.txt
[cluster gridengine]

  [[node master]]
  MachineType = $machine_type

    [[[configuration]]]
    gridengine.slots = $slots

[parameters]
  [[parameter machine_type]]
  DefaultValue = Standard_D4v3
  Label = Machine Type
  Description = MachineType to use for the Grid Engine master node
  ParameterType = Cloud.MachineType

  [[parameter slots]]
  DefaultValue = 2
  Description = The number of slots for Grid Engine to report for the node
```

The "Label" and "Description" attributes are included which will appear in the GUI as well as the
optional "ParameterType" attribute. The "ParameterType" allows custom UI elements to be displayed.
In the example above the "Cloud.MachineType" value will display a dropdown containing
all of the available machine types. The other ParameterType values are:

| Parameter Type    | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| Cloud.MachineType | Displays a dropdown containing all available machine types.              |
| Cloud.Credentials | Displays a dropdown containing all of the available credentials.         |
| Cloud.Region      | Displays a dropdown containing all available regions.                    |

## Chef Server Support

Azure CycleCloud suports [ChefServer](https://docs.chef.io/server_components.html).

Create the file `chefserver.json` and add your credentials. `ValidationKey`
corresponds to the validation.pem file for your chef server. You also must prove the
`validation_client_name` if you have changed it from the default value of "chef-validator":

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

Next, place the file in the directory `/opt/cycle_server/config/data`. It will be imported automatically.

## Custom User Images in Templates

Azure CycleCloud supports custom images in templates. Specify the image ID (resource ID) directly with `ImageId`, or add the image to the image registry. When the image is in the registry, reference it with either `Image` or `ImageName` on your node. It will appear in the **image dropdown** on the cluster creation page.

Images in the image registry consist of a `Package` record that identifies the contents of the logical image and one or more corresponding `Artifact` records that specify the actual image id in the appropriate cloud provider. For example, a custom image with R installed on it might consist of this Package record:

``` ini
AdType = "Package"
Name = "r_execute"
Version = "2.1.1"
PackageType = "image"
Label = "R"
```

Once you add that record, you can specify that image by including either `Image = R` or `ImageName = r_execute` in the cluster template.

If this image existed as a single Virtual Machine in useast with an id of `/subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage`, it would need to have the following artifact stored:

``` ini
AdType = "Artifact"
Package = "r_execute"
Version = "2.1.1"
Name = "az/useast"
Provider = "az"
ImageId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage"
```

You must specify `Provider` on the artifact.

You can add as many artifacts as you want for a given image package, but you must include all the artifacts required to use that image in all the "locations" you want (one per cloud provider account, regions, projects, etc). The name of the artifact is not important, except that it must be unique to all artifacts for a given package and version. Using a combination of the provider and provider-specific details (eg region) is usually recommended. CycleCloud automatically picks the right artifact to match the provider and any provider-specific details, but it uses the Provider attribute (and Region, etc) rather than parsing the Name.

If you add more than one image package with the same name, they must have different version numbers. When starting an instance, CycleCloud will automatically pick the image with the highest version number, by treating the version number as a dotted string and comparing each part as a number. To override this, specify `ImageVersion` on the node, as either a literal (eg `1.2`) or a wildcard (`1.x`).
