
## Size table definitions

* Storage capacity is shown in units of GiB or 1024^3 bytes. When comparing disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB
* Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
* Data disks can operate in cached or uncached modes.  For cached data disk operation, the host cache mode is set to **ReadOnly** or **ReadWrite**.  For uncached data disk operation, the host cache mode is set to **None**.
* Maximum network bandwidth is the maximum aggregated bandwidth allocated and assigned per VM type. The maximum bandwidth provides guidance for selecting the right VM type to ensure adequate network capacity is available. When moving between Low, Moderate, High and Very High, the throughput will increase accordingly. Actual network performance will depend on many factors including network and application loads, and application network settings.