---
# Required metadata
# For more information, see https://learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata
# For valid values of ms.service, ms.prod, and ms.topic, see https://learn.microsoft.com/en-us/help/platform/metadata-taxonomies

title:       # Add a title for the browser tab
description: # Add a meaningful description for search results
author:      eshanchomsft # GitHub alias
ms.author:   echowdhury # Microsoft alias
ms.service:  # Add the ms.service or ms.prod value
# ms.prod:   # To use ms.prod, uncomment it and delete ms.service
ms.topic:    # Add the ms.topic value
ms.date:     05/18/2026
---

# Benchmarking Elastic SAN Performance

Parameters:

-b4K – 4 KB I/O size
-r – Random I/O pattern
-t8 – Eight threads
-o64 – Queue depth of 64 per thread
-w0 – 100% read workload
-d120 – 120 second runtime
-c100G – 100GB test file

Image: DiskSpd random read output
Results:





















I/O PatternI/O SizeThreads per VMQueue DepthIOPS AchievedMBps AchievedRandom (Read 100%)4K8512~77,959~304 MB/s
This workload represents small-block, IOPS-intensive scenarios, such as transactional databases and metadata-heavy applications where low-latency, high-frequency operations are critical.

Throughput intensive workload example
Windows (DiskSpd)
PowerShelldiskspd.exe -c100G -b1M -si -o32 -t4 -w0 -d120 -Sh -L E:\esan_test.datShow more lines
Image: DiskSpd sequential read output
Parameters:

-b1M → 1 MB I/O size
-si → Sequential access pattern
-t4 → Four threads
-o32 → Queue depth per thread
-w0 → 100% read workload
-d120 → 120second runtime
-c100G → 100 GB test file

Results:





















I/O PatternI/O SizeThreads per VMQueue DepthIOPS AchievedMBps AchievedSequential (Read 100%)1M4128~1567.44~1,567.44 MB/s
This workload represents throughput-oriented scenarios, such as large-scale data processing, backup, and file scanning workloads where bandwidth utilization is the primary requirement.

FIO
FIO is a commonly used tool for benchmarking storage on Linux virtual machines. It allows you to configure I/O size, access pattern, and concurrency to simulate different workload scenarios. It spawns worker threads or processes to perform the specified I/O operations.
Before starting, download FIO and install it on your virtual machine.
Shellapt-get updateapt-get install fio``Show more lines
Baseline test parameters (FIO)

Block size (--bs): Defines the size of each I/O operation
Queue depth (--iodepth): Specifies the number of outstanding I/O operations per job
Threads (--numjobs): Controls the number of parallel worker jobs issuing I/O
Access pattern (--rw): Determines the type of I/O (random or sequential read/write)
Test duration (--runtime, --time_based): Controls how long the test runs
File size (--size): Specifies the size of the test file
Direct I/O (--direct): Bypasses OS caching to measure storage performance
Aggregated results (--group_reporting): Combines results into a single summary


I/O intensive workload example
Shellfio name=randread rw=randread bs=4k iodepth=64 numjobs=8 size=100G time_based runtime=120 direct=1 ioengine=libaio group_reporting filename=/mnt/esan/testfileShow more lines
Parameters:

bs=4k — 4 KB I/O size
rw=randread — Random read workload (100% read)
numjobs=8 — Eight parallel threads
iodepth=64 — Queue depth per thread
runtime=120 — 2-minute test duration
size=100G — Test file size
direct=1 — Bypass OS cache

Image: fio random read output
Results:





















I/O PatternI/O SizeThreads per VMQueue DepthIOPS AchievedMBps AchievedRandom (Read 100%)4K851281.8K~320 MB/s
This workload models IOPS-driven application patterns, where high concurrency and small I/O sizes stress the storage system’s ability to handle large numbers of operations per second.

Throughput intensive workload example (Linux)
Shellfio name=readseq rw=read bs=1M iodepth=32 numjobs=4 size=100G time_based runtime=120 direct=1 ioengine=libaio group_reporting filename=/mnt/esan/testfileShow more lines
Parameters:

bs=1M — 1 MB I/O size
rw=read — Sequential read workload
numjobs=4 — Four parallel threads
iodepth=32 — Queue depth per thread
runtime=120 — 2-minute test duration
size=100G — Test file size
direct=1 — Bypass OS cache

Image: fio sequential read output
Results:





















I/O PatternI/O SizeThreads per VMQueue DepthIOPS AchievedMBps AchievedSequential (Read 100%)1M4128~1,488~1,488 MB/s

Next steps


Review Elastic SAN performance behavior and allocation:
https://learn.microsoft.com/en-us/azure/storage/elastic-san/elastic-san-performance


Review configuration guidance and optimizations:
https://learn.microsoft.com/en-us/azure/storage/elastic-san/elastic-san-best-practices


Review scale targets:
https://learn.microsoft.com/en-us/azure/storage/elastic-san/elastic-san-scale-targets


Learn how to connect from Linux:
https://learn.microsoft.com/en-us/azure/storage/elastic-san/elastic-san-connect-linux


Review Elastic SAN metrics:
https://learn.microsoft.com/en-us/azure/storage/elastic-san/elastic-san-metrics
