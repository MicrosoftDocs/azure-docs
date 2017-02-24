


## A-series

| Size | CPU cores | Memory: GiB | Local HDD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_A0* |1 |0.768 |20 |1 |1x500 |1 / low |
| Standard_A1 |1 |1.75 |70 |2 |2x500 |1 / moderate |
| Standard_A2 |2 |3.5 |135 |4 |4x500 |1 / moderate |
| Standard_A3 |4 |7 |285 |8 |8x500 |2 / high |
| Standard_A4 |8 |14 |605 |16 |16x500 |4 / high |
| Standard_A5 |2 |14 |135 |4 |4X500 |1 / moderate |
| Standard_A6 |4 |28 |285 |8 |8x500 |2 / high |
| Standard_A7 |8 |56 |605 |16 |16x500 |4 / high |
<br>

*The A0 size is over-subscribed on the physical hardware. For this specific size only, other customer deployments may impact the performance of your running workload. The relative performance is outlined below as the expected baseline, subject to an approximate variability of 15 percent.

### Standard A0 - A4 using CLI and PowerShell
In the classic deployment model, some VM size names are slightly different in CLI and PowerShell:

* Standard_A0 is ExtraSmall 
* Standard_A1 is Small
* Standard_A2 is Medium
* Standard_A3 is Large
* Standard_A4 is ExtraLarge

## Av2-series

| Size            | CPU cores | Memory: GiB | Local SSD: GiB | Max local disk throughput: IOPS / Read MBps / Write MBps | Max data disks / throughput: IOPS | Max NICs / Network bandwidth |
|-----------------|-----------|-------------|----------------|----------------------------------------------------------|-----------------------------------|------------------------------|
| Standard_A1_v2  | 1         | 2           | 10             | 1000 / 20 / 10                                           | 2 / 2x500                         | 1 / moderate                 |
| Standard_A2_v2  | 2         | 4           | 20             | 2000 / 40 / 20                                           | 4 / 4x500                         | 2 / moderate                 |
| Standard_A4_v2  | 4         | 8           | 40             | 4000 / 80 / 40                                           | 8 / 8x500                         | 4 / high                     |
| Standard_A8_v2  | 8         | 16          | 80             | 8000 / 160 / 80                                          | 16 / 16x500                       | 8 / high                     |
| Standard_A2m_v2 | 2         | 16          | 20             | 2000 / 40 / 20                                           | 4 / 4X500                         | 2 / moderate                 |
| Standard_A4m_v2 | 4         | 32          | 40             | 4000 / 80 / 40                                           | 8 / 8x500                         | 4 / high                     |
| Standard_A8m_v2 | 8         | 64          | 80             | 8000 / 160 / 80                                          | 16 / 16x500                       | 8 / high                     |

<br>

## D-series

| Size         | CPU cores | Memory: GiB | Local SSD: GiB | Max local disk throughput: IOPS / Read MBps / Write MBps | Max data disks / throughput: IOPS | Max NICs / Network bandwidth |
|--------------|-----------|-------------|----------------|----------------------------------------------------------|-----------------------------------|------------------------------|
| Standard_D1  | 1         | 3.5         | 50             | 3000 / 46 / 23                                           | 2 / 2x500                         | 1 / moderate                 |
| Standard_D2  | 2         | 7           | 100            | 6000 / 93 / 46                                           | 4 / 4x500                         | 2 / high                     |
| Standard_D3  | 4         | 14          | 200            | 12000 / 187 / 93                                         | 8 / 8x500                         | 4 / high                     |
| Standard_D4  | 8         | 28          | 400            | 24000 / 375 / 187                                        | 16 / 16x500                       | 8 / high                     |

<br>

## Dv2-series


| Size              | CPU cores | Memory: GiB | Local SSD: GiB | Max local disk throughput: IOPS / Read MBps / Write MBps | Max data disks / throughput: IOPS | Max NICs / Network bandwidth |
|-------------------|-----------|-------------|----------------|----------------------------------------------------------|-----------------------------------|------------------------------|
| Standard_D1_v2    | 1         | 3.5         | 50             | 3000 / 46 / 23                                           | 2 / 2x500                         | 1 / moderate                 |
| Standard_D2_v2    | 2         | 7           | 100            | 6000 / 93 / 46                                           | 4 / 4x500                         | 2 / high                     |
| Standard_D3_v2    | 4         | 14          | 200            | 12000 / 187 / 93                                         | 8 / 8x500                         | 4 / high                     |
| Standard_D4_v2    | 8         | 28          | 400            | 24000 / 375 / 187                                        | 16 / 16x500                       | 8 / high                     |
| Standard_D5_v2    | 16        | 56          | 800            | 48000 / 750 / 375                                        | 32 / 32x500                       | 8 / extremely high           |

<br>

