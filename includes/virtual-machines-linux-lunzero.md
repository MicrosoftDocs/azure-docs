When adding data disks to a Linux VM, you may encounter errors if a disk does not exist at LUN 0. If you are adding a disk manually using the `azure vm disk attach-new` command and you specify a LUN rather than allow the Azure platform to determine the appropriate LUN, take care that a disk already exists / will exist at LUN 0. Consider the following example showing a snippet of the output from `lsscsi`:

```bash
[5:0:0:0]    disk    Msft     Virtual Disk     1.0   /dev/sdc 
[5:0:0:1]    disk    Msft     Virtual Disk     1.0   /dev/sdd 
```

The two data disks exist at LUN 0 and LUN 1 based on the last value in the first column that indicates `[host:channel:target:lun]`. If you had manually specified the first disk be added at LUN 1 and the second disk at LUN 2 you may not see the disks correctly from within your VM.

> [AZURE.NOTE] The Azure `host` value is 5 in these examples, but this may vary depending on the type of storage you select.

This is not an Azure problem, but the way in which the Linux kernel follows the SCSI specifications. When the Linux kernel scans the SCSI bus for attached devices, a device must be found at LUN 0 in order for the system to continue scanning for additional devices. As such:

- Review the output of `lsscsi` after adding a data disk to verify that you have a disk at LUN 0.
- If your disk does not show up correctly within your VM, verify a disk exists at LUN 0.