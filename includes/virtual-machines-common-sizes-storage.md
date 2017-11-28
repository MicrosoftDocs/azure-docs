Storage optimized VM sizes offer high disk throughput and IO, and are ideal for Big Data, SQL, and NoSQL databases. This article provides information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for each size in this grouping. 

The Ls-series offers up to 32 vCPUs, using the [Intel® Xeon® processor E5 v3 family](http://www.intel.com/content/www/us/en/processors/xeon/xeon-e5-solutions.html). The Ls-series gets the same CPU performance as the G/GS-Series and comes with 8 GiB of memory per vCPU.  

## Ls-series

ACU: 180-240
 
| Size          | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS / MBps | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (Mbps) | 
|---------------|-----------|-------------|--------------------------|----------------|-------------------------------------------------------------|-------------------------------------------|------------------------------| 
| Standard_L4s   | 4    | 32   | 678   | 8    | 20,000 / 200   | 10,000 / 250        | 2 / 4,000  | 
| Standard_L8s   | 8    | 64   | 1,388 | 16   | 40,000 / 400   | 20,000 / 500       | 4 / 8,000  | 
| Standard_L16s  | 16   | 128  | 2,807 | 32   | 90.000 / 800   | 10,000 / 1,000       | 8 / 6,000 - 16,000 &#8224; | 
| Standard_L32s* | 32   | 256  | 5,630 | 64   | 160,000 / 1,600   | 90,000 / 2,000     | 8 / 20,000 | 
 

The maximum disk throughput  possible with Ls-series VMs may be limited by the number, size, and striping of any attached disks. For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../articles/virtual-machines/windows/premium-storage.md). 

*Instance is isolated to hardware dedicated to a single customer.

