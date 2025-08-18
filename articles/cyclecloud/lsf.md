---
title: IBM Spectrum LSF Integration
description: LSF scheduler configuration in Azure CycleCloud.
author: mvrequa
ms.date: 06/10/2025
ms.author: mirequa
---

# IBM Spectrum LSF

Starting in LSF 10.1 FixPack 9 (10.1.0.9), Azure CycleCloud is a native provider
for Resource Connector. IBM provides [documentation](https://www.ibm.com/support/knowledgecenter/en/SSWRJV_10.1.0/lsf_resource_connector/lsf_rc_cycle_config.html). These resources provide instruction on configuring the LSF primary node to connect to CycleCloud.

LSF is an IBM licensed product. To use LSF in CycleCloud, you need an entitlement file that IBM provides to their customers.
> [!NOTE]
> LSF is an IBM licensed product. To use LSF in CycleCloud, you need an entitlement file that IBM provides to its customers. Add the LSF binaries and entitlement file to the `blobs/` directory to use the fully automated cluster or the VM image builder in this project.
To use the fully automated cluster or the VM image builder in this project, add the LSF binaries and entitlement file to the `blobs/` directory.

## Supported scenarios of the CycleCloud LSF cluster type

LSF can "borrow" hosts from Azure to run jobs in an on-demand way, adding and 
removing hosts as needed. The LSF 
cluster type is flexible to handle several scenarios in a single cluster:

1. High throughput jobs (CPU & GPU)
2. Tightly coupled (MPI, CPU & GPU)
3. Low Priority

Handle these scenarios by configuring multiple node arrays and LSF properties. CycleCloud preconfigures the node arrays. Proper configuration of LSF enables the various job scenarios.

When you configure LSF in accordance with these recommendations, you can use `bsub` resource requirements `-R` in the following manner:

Use the `placementGroup` resource to run a job with InfiniBand connected network.

```
-R "span[ptile=2] select[nodearray=='ondemandmpi' && cyclecloudmpi] same[placementgroup]"
```

For GPUs, we recommend using LSF support for extended GPU syntax. Typically, you add
these attributes to _lsf.conf_: `LSB_GPU_NEW_SYNTAX=extend` and `LSF_GPU_AUTOCONFIG=Y`. With support
for extended syntax enabled, use the placementGroup along with `-gpu` to run a tightly coupled job with GPU 
acceleration.

```
-R "span[ptile=1] select[nodearray=='gpumpi' && cyclecloudmpi] same[placementgroup]" -gpu "num=2:mode=shared:j_exclusive=yes"
```

Run GPU enabled jobs in a parallel manner.

```
-R "select[nodearray=='gpu' && !cyclecloudmpi && !cyclecloudlowprio]" -gpu "num=1:mode=shared:j_exclusive=yes"
```

Run a large burst job on low priority VMs.

```
-J myArr[1000] -R "select[nodearray=='lowprio' && cyclecloudlowprio]"
```

## Configuring LSF for the CycleCloud LSF Cluster type

To enable these scenarios, add shared
resource types to _lsb.shared_.

``` 
   cyclecloudhost  Boolean  ()       ()       (instances from Azure CycleCloud)
   cyclecloudmpi  Boolean   ()       ()       (instances that support MPI placement)
   cyclecloudlowprio  Boolean ()     ()       (instances that low priority / interruptible from Azure CycleCloud)
   nodearray  String     ()       ()       (nodearray from CycleCloud)
   placementgroup String ()       ()       (id used to note locality of machines)
   instanceid String     ()       ()       (unique host identifier)
```

You might be able to leave out `cyclecloudlowprio`, but it provides an extra check that jobs are running on their intended VM tenancy.

### LSF Provider Template for CycleCloud

The LSF CycleCloud provider exposes configurations
through the provider template. These configurations are a subset of the complete configuration of the nodearray.

Here's an example LSF template for Cyclecloud from _cyclecloudprov_templates.json_:

``` json
{
    "templateId": "ondemand",
    "attributes": {
        "type": ["String", "X86_64"],
        "ncores": ["Numeric", "44"],
        "ncpus": ["Numeric", "44"],
        "mem": ["Numeric", "327830"],
        "cyclecloudhost": ["Boolean", "1"],
        "nodearray" : ["String", "ondemand"]
    },
    "priority" : 250,
    "nodeArray": "ondemand",
    "vmType" : "Standard_HC44rs",
    "subnetId" : "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azurecyclecloud-lab/providers/Microsoft.Network/virtualNetworks/hpc-network/subnets/compute",
    "imageId" : "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/azurecyclecloud-lab/providers/Microsoft.Compute/images/lsf-worker-a4bc2f10",
    "maxNumber": 500,
    "keyPairLocation": "/opt/cycle_server/.ssh/id_rsa_admin.pem",
    "customScriptUri": "https://aka.ms/user_data.sh",
    "userData": "nodearray_name=ondemand"
}
```

### LSF Template Attributes for CycleCloud

The LSF provider template doesn't expose all nodearray attributes. These attributes are considered overrides of the CycleCloud nodearray configuration. The only required LSF template attributes are:

* `templateId`
* `nodeArray`

You can omit other attributes or they might not be necessary at all. CycleCloud infers these attributes:

* `imageId` - Azure VM Image, for example, `"/subscriptions/xxxxxxxx-xxxx-xxxx-xxx-xxxxxxxxxxxx/resourceGroups/my-images-rg/providers/Microsoft.Compute/images/lsf-execute-201910230416-80a9a87f"` - override for CycleCloud cluster configuration.
* `subnetId` - Azure subnet, for example, `"resource_group/vnet/subnet"` - override for CycleCloud cluster configuration.
* `vmType` - for example, `"Standard_HC44rs"` - override for CycleCloud cluster configuration.
* `keyPairLocation` - for example, `"~/.ssh/id_rsa_beta"` - override for CycleCloud cluster configuration.
* customScriptUri - For example, `http://10.1.0.4/user_data.sh`. No script if not specified.
* userData - For example, `"nodearray_name=gpumpi;placement_group_id=gpumpipg1"`. Empty if not specified.

### A Note on PlacementGroups

Azure datacenters have InfiniBand network capability for HPC scenarios. Unlike the normal Ethernet, these networks have limited span. "PlacementGroups" describe the InfiniBand network extents. If VMs reside in the same placement group and are special InfiniBand-enabled VM types, they share an InfiniBand network.

These placement groups necessitate special handling in LSF and CycleCloud.

Here's an example LSF template for CycleCloud from _cyclecloudprov_templates.json_:

```json
{
  "templateId": "ondemandmpi-1",
  "attributes": {
    "nodearray": ["String", "ondemandmpi" ],
    "zone": [  "String",  "westus2"],
    "mem": [  "Numeric",  8192.0],
    "ncpus": [  "Numeric",  2],
    "cyclecloudmpi": [  "Boolean",  1],
    "placementgroup": [  "String",  "ondemandmpipg1"],
    "ncores": [  "Numeric",  2],
    "cyclecloudhost": [  "Boolean",  1],
    "type": [  "String",  "X86_64"],
    "cyclecloudlowprio": [  "Boolean",  0]
  },
  "maxNumber": 40,
  "nodeArray": "ondemandmpi",
  "placementGroupName": "ondemandmpipg1",
  "priority": 448,
  "customScriptUri": "https://aka.ms/user_data.sh",
  "userData" : "nodearray_name=ondemandmpi;placement_group_id=ondemandmpipg1"
}
```

The `placementGroupName` in this file can be anything but determines the name of the placementGroup in CycleCloud. Any nodes borrowed from CycleCloud from this template reside in this placementGroup and, if they're InfiniBand-enabled VMs, share an IB network.

The `placementGroupName` property matches the host attribute `placementgroup`. This match is
intentional and necessary. Set the
`placement_group_id` property in `userData` for use in _user_data.sh_ at 
host start time.
 The `ondemandmpi` attribute might seem extraneous but is used to 
prevent this job from 
matching on hosts where `placementGroup` is undefined.

When you use placement groups, the value of the `Azure.MaxScaleSetSize` property determines the maximum placement group size.
This property indirectly limits how many nodes
you can add to a placement group but LSF doesn't consider it. Set
`MaxNumber` of the LSF template equal to `Azure.MaxScaleSetSize` in the cluster template.

### _user_data.sh_

The template provides two attributes for executing a _user_data.sh_ script: `customScriptUri` and `userData`. These attributes are the URI and custom environment variables of the user-managed script that runs at node startup. The `customScriptUri` can't require authentication because an anonymous CURL command downloads the script. Use this script to:

1. Configure the worker LSF daemons, particularly `LSF_LOCAL_RESOURCES` and `LSF_MASTER_LIST`.
    - If `LSF_TOP` is on a shared filesystem, it's useful to make a local copy of `lsf.conf` and set the `LSF_ENVDIR` variable before starting the daemons.
2. Start the lim, res, and sbatch daemons.

The CycleCloud provider sets some default environment variables. 

* rc_account
* template_id 
* providerName
* clustername
* cyclecloud_nodeid (set this variable to `instanceId` resource)

Other user data variables that can be useful in managing resources in the CycleCloud provider are:

* nodearray_name
* placement_group_id

> [!NOTE]
> Even though Windows is an officially supported LSF platform, CycleCloud doesn't support running LSF on Windows at this time.
