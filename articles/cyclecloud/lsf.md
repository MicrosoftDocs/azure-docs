---
title: IBM Spectrum LSF Integration
description: LSF scheduler configuration in Azure CycleCloud.
author: mvrequa
ms.date: 11/01/2019
ms.author: mirequa
---

# IBM Spectrum LSF

Starting in LSF 10.1 FixPack 9 (10.1.0.9) Azure CycleCloud is a native provider
for Resource Connector. IBM provides [documentation](https://www.ibm.com/support/knowledgecenter/en/SSWRJV_10.1.0/lsf_resource_connector/lsf_rc_cycle_config.html). These resources provide instruction on configuring the LSF Master node to connect to CycleCloud.

LSF is an IBM licensed product; using LSF in CycleCloud requires an entitlement file that IBM provides to their customers.
> [!NOTE]
> LSF is an IBM licensed product; using LSF in CycleCloud requires an entitlement file that IBM provides to its customers. The LSF binaries and entitlement file must be added to the blobs/ directory to use the fully automated cluster or the VM image builder in this project.
To use the fully automated cluster, or the vm image builder in this project LSF binaries and entitlement file must be added to the blobs/ directory.

## Supported Scenarios of the CycleCloud LSF Cluster type

LSF can "borrow" hosts from Azure to run jobs in an on-demand way, adding and 
removing hosts as needed. The LSF 
cluster type is flexible to handle several scenarios in a single cluster:

1. High throughput jobs (CPU & GPU)
2. Tightly coupled (MPI, CPU & GPU)
3. Low Priority

These scenarios are handled by configuration of multiple nodearrays and LSF properties in concert. The nodearrays are pre-configured in  CycleCloud. Proper configuration of LSF enables the various job scenarios.

When LSF is configured in accordance with these recommendations, `bsub` resource requirements `-R` can be used in the following manner:

Use the placementGroup resource to run a job with InfiniBand connected network.

```
-R "span[ptile=2] select[nodearray=='ondemandmpi' && cyclecloudmpi] same[placementgroup]"
```

For GPUs we recommend using LSF support for extended GPU syntax. Typically requires adding two
attributes to _lsf.conf_: `LSB_GPU_NEW_SYNTAX=extend` and `LSF_GPU_AUTOCONFIG=Y`. With support
for extended syntax enabled, use the placementGroup along with `-gpu` to run a tightly coupled job with GPU 
acceleration.

```
-R "span[ptile=1] select[nodearray=='gpumpi' && cyclecloudmpi] same[placementgroup]" -gpu "num=2:mode=shared:j_exclusive=yes"
```

Run GPU enabled jobs in a parallel manner.

```
-R "select[nodearray=='gpu' && !cyclecloudmpi && !cyclecloudlowprio]" -gpu "num=1:mode=shared:j_exclusive=yes"
```

Run a large burst job on lowpriority VMs.

```
-J myArr[1000] -R "select[nodearray=='lowprio' && cyclecloudlowprio]"
```

## Configuring LSF for the CycleCloud LSF Cluster type

To enable these scenarios as described, add a number of shared
resource types to _lsb.shared_.

``` 
   cyclecloudhost  Boolean  ()       ()       (instances from Azure CycleCloud)
   cyclecloudmpi  Boolean   ()       ()       (instances that support MPI placement)
   cyclecloudlowprio  Boolean ()     ()       (instances that low priority / interruptible from Azure CycleCloud)
   nodearray  String     ()       ()       (nodearray from CycleCloud)
   placementgroup String ()       ()       (id used to note locality of machines)
   instanceid String     ()       ()       (unique host identifier)
```

It's possible that `cyclecloudlowprio` can be left out, but it provides an additional check that jobs are running on their intended VM tenancy.

### LSF Provider Template for CycleCloud

The LSF CycleCloud provider exposes a number of configurations
through the provider template. These configurations are a subset of the complete configuration of the nodearray.

Here is an example LSF template for Cyclecloud from _cyclecloudprov_templates.json_:

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

Not all nodearray attributes are exposed by the LSF provider template.
These can be considered overrides of the CycleCloud
nodearray configuration. The only required LSF template are:

* templateId
* nodeArray

Others are inferred from the CycleCloud configuration, can be omitted, or aren't necessary at all.

* imageId - Azure VM Image eg. `"/subscriptions/xxxxxxxx-xxxx-xxxx-xxx-xxxxxxxxxxxx/resourceGroups/my-images-rg/providers/Microsoft.Compute/images/lsf-execute-201910230416-80a9a87f"` override for CycleCloud cluster configuration.
* subnetId - Azure subnet eg. `"resource_group/vnet/subnet"` override for CycleCloud cluster configuration.
* vmType - eg. `"Standard_HC44rs"` override for CycleCloud cluster configuration.
* keyPairLocation - eg. `"~/.ssh/id_rsa_beta"` override for CycleCloud cluster configuration.
* customScriptUri - eg. "http://10.1.0.4/user_data.sh", no script if not specified.
* userData - eg. `"nodearray_name=gpumpi;placement_group_id=gpumpipg1"` empty if not specified.

### A Note on PlacementGroups

Azure Datacenters have Infiniband network capability for HPC scenarios. These
networks, unlike the normal ethernet, have limited span. The Infiniband network
extents are described by "PlacementGroups". If VMs reside in the same placement
group and are special Infiniband-enabled VM Types, then they will share an 
Infiniband network. 

These placement groups necessitate special handling in LSF and CycleCloud.

Here is an example LSF template for Cyclecloud from _cyclecloudprov_templates.json_:

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

The `placementGroupName` in this file can be anything but will determine the 
name of the placementGroup in CycleCloud. Any nodes borrowed from CycleCloud 
from this template will reside in this placementGroup and, if they're Infiniband-enabled VMs, will share an IB network.

Note that `placementGroupName` matches the host attribute `placementgroup`, this
intentional and necessary. Also that the
`placement_group_id` is set in `userData` to be used in _user_data.sh_ at 
host start time.
 The `ondemandmpi` attribute may seem extraneous but is used to 
prevent this job from 
matching on hosts where `placementGroup` is undefined.

Often when using placement groups there will be a maximum placement group size determined
by the `Azure.MaxScaleSetSize` property. This property indirectly limits how many nodes
may be added to a placement group but is not considered by LSF. It's therefore important to set
`MaxNumber` of the LSF template equal to `Azure.MaxScaleSetSize` in the cluster template.

### _user_data.sh_

The template provides attributes for executing a _user_data.sh_ script; `customScriptUri` and `userData`. These are the URI and custom environment variables of the user-managed script running at node startup. This script is downloaded by annonymous CURL command, so `customScriptUri` requiring authentication fail. Use this script to:

1. Configure the worker LSF daemons; particularly `LSF_LOCAL_RESOURCES` and `LSF_MASTER_LIST`
    - If `LSF_TOP` is on a shared filesystem, it can be useful to make a local copy of `lsf.conf` and set the `LSF_ENVDIR` variable before starting the daemons.
2. Start the lim, res and sbatch daemons.

There are some default environment variables set by the CycleCloud provider. 

* rc_account
* template_id 
* providerName
* clustername 
* cyclecloud_nodeid (recommended to set this to `instanceId` resource)

Other user data variables that can be useful in managing resources in the CycleCloud provider are:

* nodearray_name
* placement_group_id

> [!NOTE]
> Even though Windows is an officially supported LSF platform, CycleCloud does not support running LSF on Windows at this time.
