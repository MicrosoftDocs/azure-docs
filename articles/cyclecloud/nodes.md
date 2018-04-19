# Nodes and Node Arrays

Clusters consist of nodes, which define a single instance, and node arrays, which can be automatically scaled on demand. Node arrays support two size limits: ``MaxCount``, which limits how many instances to start, and
``MaxCoreCount``, which limits how many cores to start. The ``MaxCount`` and ``MaxCoreCount`` limits can also be set on the cluster to keep the size of clusters as a whole bounded. These maximums are hard limits, meaning no nodes will be started at any time if they would violate these constraints. That being said, neither setting will terminate existing instances.

To ensure you get the capacity you need, node arrays can span multiple machine types and availability zones. For example, this cluster definition will try to get instances from three different instance types and two availability zones::

  [parameters]

    [[parameter executeMachineType]]
    Value = c3.8xlarge, c3.4xlarge, c3.2xlarge
    Autoselect = true

    [[parameter zone]]
    Value = us-east-1a, us-east-1b
    Autoselect = true

  [cluster demo]
  Autoscale = true

    [[nodearray execute]]
    MachineType = $executeMachineType
    Zone = $zone

There are several things to note here. First, the parameters must be declared with ``Autoselect=true``. The names of the the parameters themselves do not matter. You can make either the machine type or the zone (or both) into parameters as needed (if you are launching nodes into a VPC environment, you can specify ``Subnet`` instead of ``Zone``). This supports either on-demand instances or spot instances. If you use spot prices with multiple instance types, set ``BidPricePerCore`` instead of ``BidPrice`` to bid an amount scaled by the number of cores the chosen instance has.

.. note::
  If the parameter value comes from an external `.properties` file, it currently must be specified in the formal extended syntax::

    machineType := { "c3.8xlarge", "c3.4xlarge", "c3.2xlarge" }

When the array is scaled up, instances are chosen from the set of listed machine types and zones.
CycleCloud initially bids evenly across all specified possibilities, and as it gets "out-of-capacity"
results from the cloud provider, it automatically shifts to your machine-type/zone combinations
that are currently providing instances. If it is unable to get all the instances requested,
it will periodically cycle through all combinations (including ones that were previously unavailable)
in an attempt to get sufficient capacity.

The machine types and zones (or subnets) specified are considered to all be of equal acceptability,
and CycleCloud will distribute requests across all of them. Support for expressing a
preference for certain zones or machine types is not currently available.
