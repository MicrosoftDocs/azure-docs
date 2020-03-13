---
title: Linux performance tools
titleSuffix: Azure Kubernetes Service
description: Learn how to troubleshoot and resolve common problems when using Azure Kubernetes Service (AKS)
services: container-service
author: alexeldeib

ms.service: container-service
ms.topic: troubleshooting
ms.date: 02/10/2020
ms.author: aleldeib
---

# Linux Performance Troubleshooting

Resource exhaustion on Linux machines is a common issue and can manifest through a wide variety of symptoms. This document provides a high-level overview of the tools available to help diagnose such issues.

Many of these tools accept an interval on which to produce rolling output. This output format typically makes spotting patterns much easier. Where accepted, the example invocation will include `[interval]`.

Many of these tools have an extensive history and wide set of configuration options. This page provides only a simple subset of invocations to highlight common problems. The canonical source of information is always the reference documentation for each particular tool. That documentation will be much more thorough than what is provided here.

## Guidance

Be systematic in your approach to investigating performance issues. Two common approaches are USE (utilization, saturation, errors) and RED (rate, errors, duration). RED is typically used in the context of services for request-based monitoring. USE is typically used for monitoring resources: for each resource in a machine, monitor utilization, saturation, and errors. The four main kinds of resources on any machine are cpu, memory, disk, and network. High utilization, saturation, or error rates for any of these resources indicates a possible problem with the system. When a problem exists, investigate the root cause: why is disk IO latency high? Are the disks or virtual machine SKU throttled? What processes are writing to the devices, and to what files?

Some examples of common issues and indicators to diagnose them:
- IOPS throttling: use iostat to measure per-device IOPS. Ensure no individual disk is above its limit, and the sum for all disks is less than the limit for the virtual machine.
- Bandwidth throttling: use iostat as for IOPS, but measuring read/write throughput. Ensure both per-device and aggregate throughput are below the bandwidth limits.
- SNAT exhaustion: this can manifest as high active (outbound) connections in SAR. 
- Packet loss: this can be measured by proxy via TCP retransmit count relative to sent/received count. Both `sar` and `netstat` can show this information.

## General

These tools are general purpose and cover basic system information. They are a good starting point for further investigation.

### uptime

```
$ uptime
 19:32:33 up 17 days, 12:36,  0 users,  load average: 0.21, 0.77, 0.69
```

uptime provides system uptime and 1, 5, and 15-minute load averages. These load averages roughly correspond to threads doing work or waiting for uninterruptible work to complete. In absolute these numbers can be difficult to interpret, but measured over time they can tell us useful information:

- 1-minute average > 5-minute average means load is increasing.
- 1-minute average < 5-minute average means load is decreasing.

uptime can also illuminate why information is not available: the issue may have resolved on its own or by a restart before the user could access the machine.

Load averages higher than the number of CPU threads available may indicate a performance issue with a given workload.

### dmesg

```
$ dmesg | tail 
$ dmesg --level=err | tail
```

dmesg dumps the kernel buffer. Events like OOMKill add an entry to the kernel buffer. Finding an OOMKill or other resource exhaustion messages in dmesg logs is a strong indicator of a problem.

### top

```
$ top
Tasks: 249 total,   1 running, 158 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.2 us,  1.3 sy,  0.0 ni, 95.4 id,  1.0 wa,  0.0 hi,  0.2 si,  0.0 st
KiB Mem : 65949064 total, 43415136 free,  2349328 used, 20184600 buff/cache
KiB Swap:        0 total,        0 free,        0 used. 62739060 avail Mem

   PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
116004 root      20   0  144400  41124  27028 S  11.8  0.1 248:45.45 coredns
  4503 root      20   0 1677980 167964  89464 S   5.9  0.3   1326:25 kubelet
     1 root      20   0  120212   6404   4044 S   0.0  0.0  48:20.38 systemd
     ...
```

`top` provides a broad overview of current system state. The headers provide some useful aggregate information:

- state of tasks: running, sleeping, stopped.
- CPU utilization, in this case mostly showing idle time.
- total, free, and used system memory.

`top` may miss short-lived processes; alternatives like `htop` and `atop` provide similar interfaces while fixing some of these shortcomings.

## CPU

These tools provide CPU utilization information. This is especially useful with rolling output, where patterns become easy to spot.

### mpstat

```
$ mpstat -P ALL [interval]
Linux 4.15.0-1064-azure (aks-main-10212767-vmss000001)  02/10/20        _x86_64_        (8 CPU)

19:49:03     CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
19:49:04     all    1.01    0.00    0.63    2.14    0.00    0.13    0.00    0.00    0.00   96.11
19:49:04       0    1.01    0.00    1.01   17.17    0.00    0.00    0.00    0.00    0.00   80.81
19:49:04       1    1.98    0.00    0.99    0.00    0.00    0.00    0.00    0.00    0.00   97.03
19:49:04       2    1.01    0.00    0.00    0.00    0.00    1.01    0.00    0.00    0.00   97.98
19:49:04       3    0.00    0.00    0.99    0.00    0.00    0.99    0.00    0.00    0.00   98.02
19:49:04       4    1.98    0.00    1.98    0.00    0.00    0.00    0.00    0.00    0.00   96.04
19:49:04       5    1.00    0.00    1.00    0.00    0.00    0.00    0.00    0.00    0.00   98.00
19:49:04       6    1.00    0.00    1.00    0.00    0.00    0.00    0.00    0.00    0.00   98.00
19:49:04       7    1.98    0.00    0.99    0.00    0.00    0.00    0.00    0.00    0.00   97.03
```

`mpstat` prints similar CPU information to top, but broken down by CPU thread. Seeing all cores at once can be useful for detecting highly imbalanced CPU usage, for example when a single threaded application uses one core at 100% utilization. This problem may be more difficult to spot when aggregated over all CPUs in the system.

### vmstat

```
$ vmstat [interval]
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 2  0      0 43300372 545716 19691456    0    0     3    50    3    3  2  1 95  1  0
```

`vmstat` provides similar information `mpstat` and `top`, enumerating number of processes waiting on CPU (r column), memory statistics, and percent of CPU time spent in each work state.

## Memory

Memory is a very important, and thankfully easy, resource to track. Some tools can report both CPU and memory, like `vmstat`. But tools like `free` may still be useful for quick debugging.

### free

```
$ free -m
              total        used        free      shared  buff/cache   available
Mem:          64403        2338       42485           1       19579       61223
Swap:             0           0           0
```

`free` presents basic information about total memory as well as used and free memory. `vmstat` may be more useful even for basic memory analysis due to its ability to provide rolling output.

## Disk

These tools measure disk IOPS, wait queues, and total throughput. 

### iostat

```
$ iostat -xy [interval] [count]
$ iostat -xy 1 1
Linux 4.15.0-1064-azure (aks-main-10212767-vmss000001)  02/10/20        _x86_64_        (8 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           3.42    0.00    2.92    1.90    0.00   91.76

Device:         rrqm/s   wrqm/s     r/s     w/s    rkB/s    wkB/s avgrq-sz avgqu-sz   await r_await w_await  svctm  %util
loop0             0.00     0.00    0.00    0.00     0.00     0.00     0.00     0.00    0.00    0.00    0.00   0.00   0.00
sdb               0.00     0.00    0.00    0.00     0.00     0.00     0.00     0.00    0.00    0.00    0.00   0.00   0.00
sda               0.00    56.00    0.00   65.00     0.00   504.00    15.51     0.01    3.02    0.00    3.02   0.12   0.80
scd0              0.00     0.00    0.00    0.00     0.00     0.00     0.00     0.00    0.00    0.00    0.00   0.00   0.00
```

`iostat` provides deep insights into disk utilization. This invocation passes `-x` for extended statistics, `-y` to skip the initial output printing system averages since boot, and `1 1` to specify we want 1-second interval, ending after one block of output. 

`iostat` exposes many useful statistics:

- `r/s` and `w/s` are reads per second and writes per second. The sum of these values is IOPS.
- `rkB/s` and `wkB/s` are kilobytes read/written per second. The sum of these values is throughput.
- `await` is the average iowait time in milliseconds for queued requests.
- `avgqu-sz` is the average queue size over the provided interval.

On an Azure VM:

- the sum of `r/s` and `w/s` for an individual block device may not exceed that disk's SKU limits.
- the sum of `rkB/s` and `wkB/s`  for an individual block device may not exceed that disk's SKU limits
- the sum of `r/s` and `w/s` for all block devices may not exceed the limits for the VM SKU.
- the sum of  `rkB/s` and `wkB/s for all block devices may not exceed the limits for the VM SKU.

Note that the OS disk counts as a managed disk of the smallest SKU corresponding to its capacity. For example, a 1024GB OS Disk corresponds to a P30 disk. Ephemeral OS disks and temporary disks do not have individual disk limits; they are only limited by the full VM limits.

Non-zero values of await or avgqu-sz are also good indicators of IO contention.

## Network

These tools measure network statistics like throughput, transmission failures, and utilization. Deeper analysis can expose fine-grained TCP statistics about congestion and dropped packets.

### sar

```
$ sar -n DEV [interval]
22:36:57        IFACE   rxpck/s   txpck/s    rxkB/s    txkB/s   rxcmp/s   txcmp/s  rxmcst/s   %ifutil
22:36:58      docker0      0.00      0.00      0.00      0.00      0.00      0.00      0.00      0.00
22:36:58    azv604be75d832      1.00      9.00      0.06      1.04      0.00      0.00      0.00      0.00
22:36:58       azure0     68.00     79.00     27.79     52.79      0.00      0.00      0.00      0.00
22:36:58    azv4a8e7704a5b    202.00    207.00     37.51     21.86      0.00      0.00      0.00      0.00
22:36:58    azve83c28f6d1c     21.00     30.00     24.12      4.11      0.00      0.00      0.00      0.00
22:36:58         eth0    314.00    321.00     70.87    163.28      0.00      0.00      0.00      0.00
22:36:58    azva3128390bff     12.00     20.00      1.14      2.29      0.00      0.00      0.00      0.00
22:36:58    azvf46c95ddea3     10.00     18.00     31.47      1.36      0.00      0.00      0.00      0.00
22:36:58       enP1s1     74.00    374.00     29.36    166.94      0.00      0.00      0.00      0.00
22:36:58           lo      0.00      0.00      0.00      0.00      0.00      0.00      0.00      0.00
22:36:58    azvdbf16b0b2fc      9.00     19.00      3.36      1.18      0.00      0.00      0.00      0.00
```

`sar` is a powerful tool for a wide range of analysis. While this example uses its ability to measure network stats, it is equally powerful for measuring CPU and memory consumption. This example invokes `sar` with `-n` flag to specify the `DEV` (network device) keyword, displaying network throughput by device.

- The sum of `rxKb/s` and `txKb/s` is total throughput for a given device. When this value exceeds the limit for the provisioned Azure NIC, workloads on the machine will experience increased network latency.
- `%ifutil` measures utilization for a given device. As this value approaches 100%, workloads will experience increased network latency.

```
$ sar -n TCP,ETCP [interval]
Linux 4.15.0-1064-azure (aks-main-10212767-vmss000001)  02/10/20        _x86_64_        (8 CPU)

22:50:08     active/s passive/s    iseg/s    oseg/s
22:50:09         2.00      0.00     19.00     24.00

22:50:08     atmptf/s  estres/s retrans/s isegerr/s   orsts/s
22:50:09         0.00      0.00      0.00      0.00      0.00

Average:     active/s passive/s    iseg/s    oseg/s
Average:         2.00      0.00     19.00     24.00

Average:     atmptf/s  estres/s retrans/s isegerr/s   orsts/s
Average:         0.00      0.00      0.00      0.00      0.00
```

This invocation of `sar` uses the `TCP,ETCP` keywords to examine TCP connections. The third column of the last row, "retrans", is the number of TCP retransmits per second. High values for this field indicate an unreliable network connection. In The first and third rows, "active" means a connection originated from the local device, while "remote" indicates an incoming connection.  A common issue on Azure is SNAT port exhaustion, which `sar` can help detect. SNAT port exhaustion would manifest as high "active" values, since the problem is due to a high rate of outbound, locally-initiated TCP connections.

As `sar` takes an interval, it prints rolling output and then prints final rows of output containing the average results from the invocation.

### netstat

```
$ netstat -s
Ip:
    71046295 total packets received
    78 forwarded
    0 incoming packets discarded
    71046066 incoming packets delivered
    83774622 requests sent out
    40 outgoing packets dropped
Icmp:
    103 ICMP messages received
    0 input ICMP message failed.
    ICMP input histogram:
        destination unreachable: 103
    412802 ICMP messages sent
    0 ICMP messages failed
    ICMP output histogram:
        destination unreachable: 412802
IcmpMsg:
        InType3: 103
        OutType3: 412802
Tcp:
    11487089 active connections openings
    592 passive connection openings
    1137 failed connection attempts
    404 connection resets received
    17 connections established
    70880911 segments received
    95242567 segments send out
    176658 segments retransmited
    3 bad segments received.
    163295 resets sent
Udp:
    164968 packets received
    84 packets to unknown port received.
    0 packet receive errors
    165082 packets sent
UdpLite:
TcpExt:
    5 resets received for embryonic SYN_RECV sockets
    1670559 TCP sockets finished time wait in fast timer
    95 packets rejects in established connections because of timestamp
    756870 delayed acks sent
    2236 delayed acks further delayed because of locked socket
    Quick ack mode was activated 479 times
    11983969 packet headers predicted
    25061447 acknowledgments not containing data payload received
    5596263 predicted acknowledgments
    19 times recovered from packet loss by selective acknowledgements
    Detected reordering 114 times using SACK
    Detected reordering 4 times using time stamp
    5 congestion windows fully recovered without slow start
    1 congestion windows partially recovered using Hoe heuristic
    5 congestion windows recovered without slow start by DSACK
    111 congestion windows recovered without slow start after partial ack
    73 fast retransmits
    26 retransmits in slow start
    311 other TCP timeouts
    TCPLossProbes: 198845
    TCPLossProbeRecovery: 147
    480 DSACKs sent for old packets
    175310 DSACKs received
    316 connections reset due to unexpected data
    272 connections reset due to early user close
    5 connections aborted due to timeout
    TCPDSACKIgnoredNoUndo: 8498
    TCPSpuriousRTOs: 1
    TCPSackShifted: 3
    TCPSackMerged: 9
    TCPSackShiftFallback: 177
    IPReversePathFilter: 4
    TCPRcvCoalesce: 1501457
    TCPOFOQueue: 9898
    TCPChallengeACK: 342
    TCPSYNChallenge: 3
    TCPSpuriousRtxHostQueues: 17
    TCPAutoCorking: 2315642
    TCPFromZeroWindowAdv: 483
    TCPToZeroWindowAdv: 483
    TCPWantZeroWindowAdv: 115
    TCPSynRetrans: 885
    TCPOrigDataSent: 51140171
    TCPHystartTrainDetect: 349
    TCPHystartTrainCwnd: 7045
    TCPHystartDelayDetect: 26
    TCPHystartDelayCwnd: 862
    TCPACKSkippedPAWS: 3
    TCPACKSkippedSeq: 4
    TCPKeepAlive: 62517
IpExt:
    InOctets: 36416951539
    OutOctets: 41520580596
    InNoECTPkts: 86631440
    InECT0Pkts: 14
```

`netstat` can introspect a wide variety of network stats, here invoked with summary output. There are many useful fields here depending on the issue. One useful field in the TCP section is "failed connection attempts". This may be an indication of SNAT port exhaustion or other issues making outbound connections. A high rate of retransmitted segments (also under the TCP section) may indicate issues with packet delivery. 
