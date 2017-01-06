


D11-15 – v2

D11-14 – v1



## G-series

G-series VMs offer the most memory and run on hosts that have Intel Xeon E5 V3 family processors.

| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_G1 |2 |28 |384 |4 |4 x 500 |1 / high |
| Standard_G2 |4 |56 |768 |8 |8 x 500 |2 / high |
| Standard_G3 |8 |112 |1,536 |16 |16 x 500 |4 / very high |
| Standard_G4 |16 |224 |3,072 |32 |32 x 500 |8 / extremely high |
| Standard_G5 |32 |448 |6,144 |64 |64 x 500 |8 / extremely high |

<br>

## GS-series*
| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max cached disk throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_GS1 |2 |28 |56 |4 |10,000 / 100 (264) |5,000 / 125 |1 / high |
| Standard_GS2 |4 |56 |112 |8 |20,000 / 200 (528) |10,000 / 250 |2 / High |
| Standard_GS3 |8 |112 |224 |16 |40,000 / 400 (1,056) |20,000 / 500 |4 / very high |
| Standard_GS4 |16 |224 |448 |32 |80,000 / 800 (2,112) |40,000 / 1,000 |8 / extremely high |
| Standard_GS5 |32 |448 |896 |64 |160,000 / 1,600 (4,224) |80,000 / 2,000 |8 / extremely high |

MBps = 10^6 bytes per second, and GiB = 1024^3 bytes.

*The maximum disk throughput (IOPS or MBps) possible with a GS series VM may be limited by the number, size and striping of the attached disk(s). 

<br>




