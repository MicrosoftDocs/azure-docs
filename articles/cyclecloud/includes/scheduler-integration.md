CycleCloud supports a standard set of autostop attributes across schedulers:

| Attribute                                             | Description                                                                                               |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| cyclecloud.cluster.autoscale.stop_enabled             | Enables autostop on this node. [true/false]                                                            |
| cyclecloud.cluster.autoscale.idle_time_after_jobs     | The amount of time (in seconds) for a node to sit idle after completing jobs before it autostops.    |
| cyclecloud.cluster.autoscale.idle_time_before_jobs    | The amount of time (in seconds) for a node to sit idle before completing jobs before it autostops.   |
