
The Ls-series is optimized for workloads that require low latency local storage, like NoSQL databases (for example, Cassandra, MongoDB, Cloudera, and Redis). The Ls-series offers up to 32 CPU cores, using the [Intel® Xeon® processor E5 v3 family](http://www.intel.com/content/www/us/en/processors/xeon/xeon-e5-solutions.html). This is the same CPU performance as the G/GS-Series and comes with 8 GiB of memory per CPU core.  

## Ls-series

ACU: 180-240
 
| Size          | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max cached and local disk throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Network bandwidth | 
|---------------|-----------|-------------|--------------------------|----------------|-------------------------------------------------------------|-------------------------------------------|------------------------------| 
| Standard_L4s  | 4    | 32   | 678   | 8              | NA / NA (0)          | 5,000 / 125                               | 2 / high       | 
| Standard_L8s  | 8    | 64   | 1,388 | 16             | NA / NA (0)          | 10,000 / 250                              | 4 / very high  | 
| Standard_L16s | 16   | 128  | 2,807 | 32             | NA / NA (0)          | 20,000 / 500                              | 8 / extremely high | 
| Standard_L32s** | 32 | 256  | 5,630 | 64             | NA / NA (0)          | 40,000 / 1,000                            | 8 / extremely high | 
 
MBps = 10^6 bytes per second, and GiB = 1024^3 bytes. 

*The maximum disk throughput (IOPS or MBps) possible with a Ls-series VM may be limited by the number, size, and striping of the attached disk(s). For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/storage-premium-storage.md). 

**Instance is isolated to hardware dedicated to a single customer.