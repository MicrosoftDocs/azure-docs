
The Ls-series is optimized for workloads that require low latency temporary storage, like NoSQL databases including Cassandra, MongoDB, Cloudera, and Redis. The Ls-series offers up to 32 vCPUs, using the [Intel® Xeon® processor E5 v3 family](http://www.intel.com/content/www/us/en/processors/xeon/xeon-e5-solutions.html). The Ls-series gets the same CPU performance as the G/GS-Series and comes with 8 GiB of memory per vCPU.  

## Ls-series

ACU: 180-240
 
| Size          | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network performance (Mbps) | 
|---------------|-----------|-------------|--------------------------|----------------|-------------------------------------------------------------|-------------------------------------------|------------------------------| 
| Standard_L4s  | 4    | 32   | 678   | 8              | NA / NA (0)          | 5,000 / 125                               | 2 / 4000       | 
| Standard_L8s  | 8    | 64   | 1,388 | 16             | NA / NA (0)          | 10,000 / 250                              | 4 / 8000  | 
| Standard_L16s | 16   | 128  | 2,807 | 32             | NA / NA (0)          | 20,000 / 500                              | 8 / 6000 - 16000 &#8224; | 
| Standard_L32s* | 32 | 256  | 5,630 | 64             | NA / NA (0)          | 40,000 / 1,000                            | 8 / 20000 | 
 

The maximum disk throughput  possible with Ls-series VMs may be limited by the number, size, and striping of any attached disks. For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/storage/common/storage-premium-storage.md). 

*Instance is isolated to hardware dedicated to a single customer.

