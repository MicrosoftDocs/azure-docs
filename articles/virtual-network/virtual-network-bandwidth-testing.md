---
title: Test VM network throughput by using NTTTCP
description: Use the NTTTCP tool to test network bandwidth and throughput performance for Windows and Linux VMs on a virtual network.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 11/01/2023
ms.author: allensu
---

# Test VM network throughput by using NTTTCP

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article describes how to use the free NTTTCP tool from Microsoft to test network bandwidth and throughput performance on Azure Windows or Linux virtual machines (VMs). A tool like NTTTCP targets the network for testing and minimizes the use of other resources that could affect performance.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Two Windows or Linux virtual machines in Azure. [Create a Windows VM](/azure/virtual-machines/windows/quick-create-portal) or [create a Linux VM](/azure/virtual-machines/linux/quick-create-portal).
    - To test throughput, you need two VMs of the same size to function as *sender* and *receiver*. The two VMs should be in the same [proximity placement group](/azure/virtual-machines/co-location) or [availability set](/azure/virtual-machines/availability-set-overview), so you can use their internal IP addresses and exclude load balancers from the test.
    - Note the number of VM cores and the receiver VM IP address to use in the commands. Both the sender and receiver commands use the receiver's IP address.

>[!NOTE]
>Testing by using a virtual IP (VIP) is possible, but is beyond the scope of this article.

**Examples used in this article**

| Setting | Value |
|---|---|
| Receiver VM IP address | **10.0.0.5** |
| Number of VM cores | **2** |

## Test throughput with Windows VMs or Linux VMs

You can test throughput from Windows VMs by using [NTTTCP](https://github.com/microsoft/ntttcp) or from Linux VMs by using [NTTTCP-for-Linux](https://github.com/Microsoft/ntttcp-for-linux).

# [Windows](#tab/windows)

### Prepare VMs and install NTTTCP-for-Windows

1. On both the sender and receiver VMs, [download the latest version of NTTTCP](https://github.com/microsoft/ntttcp/releases/latest) into a separate folder like **c:\\tools**.

1. Open the Windows command line and navigate to the folder where you downloaded **ntttcp.exe**.

1. On the receiver VM, create a Windows Firewall `allow` rule to allow the NTTTCP traffic to arrive. It's easier to allow **nttcp.exe** by name than to allow specific inbound TCP ports. Run the following command, replacing `c:\tools` with your download path for **ntttcp.exe** if different.

    ```cmd
    netsh advfirewall firewall add rule program=c:\tools\ntttcp.exe name="ntttcp" protocol=any dir=in action=allow enable=yes profile=ANY
    ```

1. To confirm your configuration, use the following commands to test a single Transfer Control Protocol (TCP) stream for 10 seconds on the receiver and sender virtual machines:

    **Receiver VM**

    `ntttcp -r -m [<number of VM cores> x 2],*,<receiver IP address> -t 10 -P 1`

    ```cmd
    ntttcp -r -m 4,*,10.0.0.5 -t 10 -P 1
    ```

    **Sender VM**

    `ntttcp -s -m [<number of VM cores> x 2],*,<receiver IP address> -t 10 -P 1`

    ```cmd
    ntttcp -s -m 4,*,10.0.0.5 -t 10 -P 1
    ```

   >[!NOTE]
   >Use the preceding commands only to test configuration.

   >[!TIP]
   >When you run the test for the first time to verify setup, use a short test duration to get quick feedback. Once you verify the tool is working, extend the test duration to 300 seconds for the most accurate results.

### Run throughput tests

Run the test for 300 seconds, or five minutes, on both the sender and receiver VMs. The sender and receiver must specify the same test duration for the `-t` parameter.

1. On the receiver VM, run the following command, replacing the `<number of VM cores>`, and `<receiver IP address>` placeholders with your own values.

    **`ntttcp -r -m [<number of VM cores> x 2],*,<receiver IP address> -t 300`**

    ```cmd
    ntttcp -r -m 4,*,10.0.0.5 -t 300
    ```

1. On the sender VM, run the following command. The sender and receiver commands differ only in the `-s` or `-r` parameter that designates the sender or receiver VM.

    **`ntttcp -s -m [<number of VM cores> x 2],*,<receiver IP address> -t 300`**

   ```cmd
   ntttcp -s -m 4,*,10.0.0.5 -t 300
   ```

1. Wait for the results.

When the test is complete, the output should be similar as the following example:

```output
C:\tools>ntttcp -s -m 4,*,10.0.0.5 -t 300
Copyright Version 5.39
Network activity progressing...


Thread  Time(s) Throughput(KB/s) Avg B / Compl
======  ======= ================ =============
     0  300.006        29617.328     65536.000
     1  300.006        29267.468     65536.000
     2  300.006        28978.834     65536.000
     3  300.006        29016.806     65536.000


#####  Totals:  #####


   Bytes(MEG)    realtime(s) Avg Frame Size Throughput(MB/s)
================ =========== ============== ================
    34243.000000     300.005       1417.829          114.141


Throughput(Buffers/s) Cycles/Byte       Buffers
===================== =========== =============
             1826.262       7.036    547888.000


DPCs(count/s) Pkts(num/DPC)   Intr(count/s) Pkts(num/intr)
============= ============= =============== ==============
     4218.744         1.708        6055.769          1.190


Packets Sent Packets Received Retransmits Errors Avg. CPU %
============ ================ =========== ====== ==========
    25324915          2161992       60412      0     15.075

```

# [Linux](#tab/linux)

### Prepare VMs and install NTTTCP-for-Linux

To measure throughput from Linux machines, use [NTTTCP-for-Linux](https://github.com/Microsoft/ntttcp-for-linux).

1. Prepare both the sender and receiver VMs for NTTTCP-for-Linux by running the following commands, depending on your distro:

   - For **CentOS**, install `gcc` , `make` and `git`.

     ``` bash
     sudo yum install gcc -y
     sudo yum install git -y
     sudo yum install make -y
     ```

   - For **Ubuntu**, install `build-essential` and `git`.

     ```bash
     sudo apt-get update
     sudo apt-get -y install build-essential
     sudo apt-get -y install git
     ```

   - For **SUSE**, install `git-core`, `gcc`, and `make`.

     ```bash
     sudo zypper in -y git-core gcc make
     ```

1. Make and install NTTTCP-for-Linux.

   ```bash
   git clone https://github.com/Microsoft/ntttcp-for-linux
   cd ntttcp-for-linux/src
   sudo make && sudo make install
   ```

### Run throughput tests

Run the NTTTCP test for 300 seconds, or five minutes, on both the sender VM and the receiver VM. The sender and receiver must specify the same test duration for the `-t` parameter. Test duration defaults to 60 seconds if you don't specify a time parameter.

1. On the receiver VM, run the following command:

   ```bash
   ntttcp -r -m 4,*,10.0.0.5 -t 300
   ```

1. On the sender VM, run the following command. This example shows a sender command for a receiver IP address of `10.0.0.5`.

   ```bash
   ntttcp -s -m 4,*,10.0.0.5 -t 300
   ```

When the test is complete, the output should be similar as the following example:

```output
azureuser@vm-3:~/ntttcp-for-linux/src$ ntttcp -s -m 4,*,10.0.0.5 -t 300
NTTTCP for Linux 1.4.0
---------------------------------------------------------
23:59:01 INFO: 4 threads created
23:59:01 INFO: 4 connections created in 1933 microseconds
23:59:01 INFO: Network activity progressing...
00:04:01 INFO: Test run completed.
00:04:01 INFO: Test cycle finished.
00:04:01 INFO: 4 connections tested
00:04:01 INFO: #####  Totals:  #####
00:04:01 INFO: test duration:300.00 seconds
00:04:01 INFO: total bytes:35750674432
00:04:01 INFO:  throughput:953.35Mbps
00:04:01 INFO:  retrans segs:13889
00:04:01 INFO: cpu cores:2
00:04:01 INFO:  cpu speed:2793.437MHz
00:04:01 INFO:  user:0.16%
00:04:01 INFO:  system:1.60%
00:04:01 INFO:  idle:98.07%
00:04:01 INFO:  iowait:0.05%
00:04:01 INFO:  softirq:0.12%
00:04:01 INFO:  cycles/byte:0.91
00:04:01 INFO: cpu busy (all):3.96%
---------------------------------------------------------
```

---

## Test throughput between a Windows VM and a Linux VM

To run NTTTCP throughput tests between a Windows VM and a Linux VM, enable no-sync mode by using the `-ns` flag on Windows or the `-N` flag on Linux.

# [Windows](#tab/windows)

To test with the Windows VM as the receiver, run the following command:

```cmd
ntttcp -r -m [<number of VM cores> x 2],*,<Linux VM IP address> -t 300
```

To test with the Windows VM as the sender, run the following command:

```cmd
ntttcp -s -m [<number of VM cores> x 2],*,<Linux VM IP address> -ns -t 300
```

# [Linux](#tab/linux)

To test with the Linux VM as the receiver, run the following command:

```bash
ntttcp -r -m [<number of VM cores> x 2],*,<Windows VM IP address> -t 300
```

To test with the Linux VM as the sender, run the following command:

```bash
ntttcp -s -m [<number of VM cores> x 2],*,<Windows VM IP address> -N -t 300
```

---

## Next steps

- [Optimize network throughput for Azure virtual machines](virtual-network-optimize-network-bandwidth.md).

- [Virtual machine network bandwidth](virtual-machine-network-throughput.md).

- [Test VM network latency](virtual-network-test-latency.md)

- [Azure Virtual Network frequently asked questions (FAQ)](virtual-networks-faq.md)
