# (beta) NodeRef

Noderef is rank 1.  Noderef is an internal reference to another CycleCloud node. 

## Examples

```ini
[noderef fsvrlsf]
[[[configuration cyclecloud.mounts.home]]]
        type = nfs
        mountpoint = /shared/home
        export_path = /mnt/raid/home
        address = ${fsvrlsf.instance.privateip}
```