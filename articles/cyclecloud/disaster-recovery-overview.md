# Disaster Recovery Overview

Azure CycleCloud is the cornerstone of your high performance computational grid, so including plans
for keeping CycleCloud running in the event of a disaster is important. There are two disaster recovery options for CycleCloud, each with a template disaster recovery script to place into your organization's disaster recovery guide.

## Synchronization

This option requires separate hardware to host a cold instance of Azure CycleCloud,
and second license for CycleCloud on the secondary hardware. The hot
CycleCloud instance is mirrored to the cold hardware, and keeps the automatic backups from CycleCloud
in sync on a fairly regular basis. In the event of a disaster you restore the cold instance from a recent backup and bring it to life.

## Virtualization

Running CycleCloud under the control of virtualization software allows you to take snapshots of CycleCloud at regular intervals. The snapshots are copied to remote hardware and, in the event of a disaster, can resume the CycleCloud virtual machine on the secondary hardware using the most recent snapshot.
