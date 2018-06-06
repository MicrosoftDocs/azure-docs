# Cluster Templates

In Azure CycleCloud, you can create new templates or edit existing ones to take advantage of [interruptible (low-priority)](https://docs.microsoft.com/en-ca/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-low-priority) instances, or VPC to extend your own network into the cloud. The Azure CycleCloud CLI tools ship with some cluster templates already defined, located in the `~/.cycle` directory. For example, the file `sge_template.txt` defines a basic two-node SGE cluster. To create a new cluster, begin by copying the section of the file that defines the `sge` cluster and pasting it to the bottom of the configuration file with a new name. For example, you might copy/modify the section to look like:

      [cluster custom_sge_cluster]
        # Enable autoscaling
        Autoscale = true

        [[node defaults]]
        ImageId = ami-1f57c276

        # Custom keypair
        KeyPair=custom-keypair
        KeyPairLocation=~/.ssh/custom-keypair.pem

        [[node master]]
        # Bigger head node
        MachineType = m1.xlarge
          [[[configuration]]]
          # Removed for brevity

        [[nodearray execute]]
        # Set autoscaling to max out at 10 cores
        MaxCoreCount = 10
        # Start with zero execute nodes to start
        Count = 0
        # Use 2-core machines with $0.10 spot bid for autoscaling
        MachineType = m1.large
        BidPrice = 0.10
          [[[configuration]]]
          # Removed for brevity

By adding the above section a new cluster template called `custom_sge_cluster`, a new cluster is defined which starts with 50 `m1.small` execute nodes, using an `m1.xlarge` for the master node instead of an `m1.small`. To import and run this new cluster type, enter:

    $ cyclecloud import custom_demo_cluster -f ~/.cycle/sge_template.txt -c custom_sge_cluster

    $ cyclecloud start custom_demo_cluster

### Configuration Notation

Azure CycleCloud cluster templates all have the option of having one or more [[[configuration]]]
sections which belong to a node or nodearray. These sections specify software configuration
options about the nodes being started by CycleCloud. Dotted notation is used to specify
the attributes you wish to configure:

    [[node master]]
      [[[configuration]]]
      cycle_server.admin.name = poweruser
      cycle_server.admin.pass = super_secret
      cycle_server.http_port = 8080
      cycle_server.https_port = 8443

You can also specify a configuration section using `prefix` notation to save typing.
The same configuration could also be written as:

    [[node master]]
      [[[configuration cycle_server]]]
      admin.name = poweruser
      admin.pass = super_secret
      http_port = 8080
      https_port = 8443

A node/nodearray can also contain multiple configuration sections if needed:

    [[node master]]
      [[[configuration]]]
      run_list = role[sge_master_node]

      [[[configuration cycle_server.admin]]]
      name = poweruser
      pass = super_secret

### Cluster Template Parameters

Cluster templates can contain parameters that alter the values of certain parts of a cluster
without having to modify the template itself. This is particularly useful in cases where many similar
clusters with minor differences are desired such as deploying development and production environments.
The syntax for specifying a parameter within a cluster template is to prefix a variable with a '$'.
A basic template example (non-functional) with some parameters could look like the following:

    # template.txt
    [cluster gridengine]

      [[node master]]
      MachineType = $machine_type

        [[[configuration]]]
        gridengine.slots = $slots

This template defines two parameters: `$machine_type` and `$slots`. Using this template, you can define text files containing the values of the parameters in both the dev and prod environments. The parameters file can be in either JSON format or a Java properties file format:

    # dev-params.json
    {
      "machine_type": "m1.small",
      "slots": 2
    }

    # prod-params.properties
    machine_type = m1.4xlarge
    slots = 8

This will create a JSON file containing the parameters for dev and a .properties file containing the values for production.

> [!NOTE]
> The filename suffix for your parameters file is important! If using JSON, your file must be named `foo.json`. If using Java properties, your file must end with `.properties`. Incorrectly named parameter files will not import properly.

You can now import the template using the parameters file to fill in the missing pieces:

    $ cyclecloud import_cluster gridengine-dev -f template.txt -p dev-params.json -c gridengine

    $ cyclecloud import_cluster gridengine-prod -f template.txt -p prod-params.properties -c gridengine

It is also possible to define some or all of the parameters within the cluster template itself:

    # template.txt
    [cluster gridengine]

      [[node master]]
      MachineType = $machine_type

        [[[configuration]]]
        gridengine.slots = $slots

    [parameters]
      [[parameter machine_type]]
      DefaultValue = m1.small

      [[parameter slots]]
      DefaultValue = 2

The default values for each parameter are defined within the template (we used the 'dev' values as defaults).
It is now possible to import the template without a parameters file, and the 'dev' values will be
used automatically. When it is time to create a 'prod' cluster, you can use the prod-params.properties
file to overwrite the values specified inside the template file itself.

> [!NOTE]
> Parameter names can include any letters, numbers, and underscores.

Parameter references in the template can take one of two forms:

`$param`: Uses the value of a single parameter named `param`

`${expr}`: Evaluates `expr` in the context of all parameters, which lets you compute dynamic values. For example:

      Attribute = ${(a > b ? a : b) * 100}

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

## Cluster Init Specs

The Azure CycleCloud web application allows users to select cluster-init project specs when creating a new cluster. The project specs are set up within the cluster template:

    [parameter ClusterInitSpecs]
    Label = Cluster-Init
    Description = Cluster init specs to apply to nodes
    ParameterType = Cloud.ClusterInitSpecs

    [cluster demo]

      [[node defaults]]
      AdditionalClusterInitSpecs = $ClusterInitSpecs

        [[[cluster-init myproject:myspec:1.0.0]]]

Once this parameter has been added to your cluster template, your user can use the file picker to select the appropriate project specs when creating a new cluster.

## Low-Priority Virtual Machines

To reduce the cost of your workloads, you can set `interruptible = true`. This will flag your instance as low-priority, and will use surplus capacity when available. It is important to note that these instances are not always available and can be preempted at any time, meaning they are not always appropriate for your workload.

If you have an existing [Azure Batch accoun](https://azure.microsoft.com/en-us/services/batch/), you can add `BatchAccount = foo` to your node. This will allow low-priority VMs via Batch nodes for your job(s).

## Lookup Tables

You can have one parameter reference another and compute a certain value with a lookup table. For example, suppose you have a parameter for the image to use, with two choices in this case:

      [[parameter MachineImage]]
          Label = Image
          DefaultValue = ami-1000
          Description = CentOS 5.10
          Config.Plugin = pico.control.AutoCompleteDropdown
          [[[list Config.Entries]]]
              Name = ami-1000
              Label = CentOS 5.10
          [[[list Config.Entries]]]
              Name = ami-2000
              Label = CentOS 6.5

You can also get the OS version of the chosen image and use it for other configuration by making e a parameter whose value is a lookup table of values:

       [[parameter AmiLookup]]
          ParameterType = hidden
          [[[record DefaultValue]]]
              ami-1000 = CentOS_5.10
              ami-2000 = CentOS_6.5

Note that this is hidden, so that it does not appear in the UI.

You can get the OS version used for the chosen image anywhere else in the cluster definition:

    [[node node]]
    [[[configuration]]]
    version = ${AmiLookup[MachineImage]}

## GUI Integration

Defining parameters within the cluster template enables one to take advantage of the Azure CycleCloud GUI. As an example, when defining parameters the following attributes can be used to assist in GUI creation:

    # template.txt
    [cluster gridengine]

      [[node master]]
      MachineType = $machine_type

        [[[configuration]]]
        gridengine.slots = $slots

    [parameters]
      [[parameter machine_type]]
      DefaultValue = m1.small
      Label = Machine Type
      Description = MachineType to use for the Grid Engine master node
      ParameterType = Cloud.MachineType

      [[parameter slots]]
      DefaultValue = 2
      Description = The number of slots for Grid Engine to report for the node

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

Next, place the file in the directory `/opt/cycle_server/config/data`. It will be imported automatically.

## Custom User Images in Templates

Azure CycleCloud supports custom images in templates. Specify the image ID (resource ID) directly with `ImageId`, or add the image to the image registry. When the image is in the registry, reference it with either `Image` or `ImageName` on your node. It will appear in the **image dropdown** on the cluster creation page.

Images in the image registry consist of a `Package` record that identifies the contents of the logical image and one or more corresponding `Artifact` records that specify the actual image id in the appropriate cloud provider. For example, a custom image with R installed on it might consist of this Package record:

    AdType = "Package"
    Name = "r_execute"
    Version = "2.1.1"
    PackageType = "image"
    Label = "R"

Once you add that record, you can specify that image by including either `Image = R` or `ImageName = r_execute` in the cluster template.

If this image existed as a single Virtual Machine in useast with an id of `/subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage`, it would need to have the following artifact stored:

  AdType = "Artifact"
  Package = "r_execute"
  Version = "2.1.1"
  Name = "az/useast"
  Provider = "az"
  ImageId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage"

You must specify `Provider` on the artifact.

You can add as many artifacts as you want for a given image package, but you must include all the artifacts required to use that image in all the "locations" you want (one per cloud provider account, regions, projects, etc). The name of the artifact is not important, except that it must be unique to all artifacts for a given package and version. Using a combination of the provider and provider-specific details (eg region) is usually recommended. CycleCloud automatically picks the right artifact to match the provider and any provider-specific details, but it uses the Provider attribute (and Region, etc) rather than parsing the Name.

If you add more than one image package with the same name, they must have different version numbers. When starting an instance, CycleCloud will automatically pick the image with the highest version number, by treating the version number as a dotted string and comparing each part as a number. To override this, specify `ImageVersion` on the node, as either a literal (eg `1.2`) or a wildcard (`1.x`).
