---
title: Test VM network throughput by using NTTTCP
description: Use the NTTTCP tool to test network bandwidth and throughput performance for Windows and Linux VMs on a virtual network.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 03/23/2023
ms.author: allensu
---

# Test VM network throughput by using NTTTCP

This article describes how to use the free NTTTCP tool from Microsoft to test network bandwidth and throughput performance on Azure Windows or Linux virtual machines (VMs). A tool like NTTTCP targets the network for testing and minimizes the use of other resources that could affect performance.

## Prerequisites

To test throughput, you need two VMs of the same size to function as *sender* and *receiver*. The two VMs should be in the same [proximity placement group](/azure/virtual-machines/co-location) or [availability set](/azure/virtual-machines/availability-set-overview), so you can use their internal IP addresses and exclude load balancers from the test.

Note the number of VM cores and the receiver VM IP address to use in the commands. Both the sender and receiver commands use the receiver's IP address.

>[!NOTE]
>Testing by using a virtual IP (VIP) is possible, but is beyond the scope of this article.

## Test throughput with Windows VMs or Linux VMs

You can test throughput from Windows VMs by using [NTTTCP](https://github.com/microsoft/ntttcp) or from Linux VMs by using [NTTTCP-for-Linux](https://github.com/Microsoft/ntttcp-for-linux).

# [Windows](#tab/windows)

### Set up NTTTCP and test configuration

1. On both the sender and receiver VMs, [download the latest version of NTTTCP](https://github.com/microsoft/ntttcp/releases/latest) into a separate folder like *c:\\tools*.

1. On the receiver VM, create a Windows Defender Firewall `allow` rule to allow the NTTTCP traffic to arrive. It's easier to allow *nttcp.exe* by name than to allow specific inbound TCP ports. Run the following command, replacing `c:\tools` with your download path for *ntttcp.exe* if different.

   ```cmd
   netsh advfirewall firewall add rule program=c:\tools\ntttcp.exe name="ntttcp" protocol=any dir=in action=allow enable=yes profile=ANY
   ```

1. To confirm your configuration, test a single Transfer Control Protocol (TCP) stream for 10 seconds by running the following commands:

   - On the receiver VM, run `ntttcp -r -t 10 -P 1`.
   - On the sender VM, run `ntttcp -s<receiver IP address> -t 10 -n 1 -P 1`.

   >[!NOTE]
   >Use the preceding commands only to test configuration.

   >[!TIP]
   >When you run the test for the first time to verify setup, use a short test duration to get quick feedback. Once you verify the tool is working, extend the test duration to 300 seconds for the most accurate results.

### Run throughput tests

Run *ntttcp.exe* from the Windows command line, not from PowerShell. Run the test for 300 seconds, or five minutes, on both the sender and receiver VMs. The sender and receiver must specify the same test duration for the `-t` parameter.

1. On the receiver VM, run the following command, replacing the `<number of VM cores>`, and `<receiver IP address>` placeholders with your own values.

   ```cmd
   ntttcp -r -m [<number of VM cores> x 2],*,<receiver IP address> -t 300
   ```

   The following example shows a command for a VM with four cores and an IP address of `10.0.0.4`.

   `ntttcp -r -m 8,*,10.0.0.4 -t 300`

1. On the sender VM, run the following command. The sender and receiver commands differ only in the `-s` or `-r` parameter that designates the sender or receiver VM.

   ```cmd
   ntttcp -s -m [<number of VM cores> x 2],*,<receiver IP address> -t 300
   ```

   The following example shows the sender command for a receiver IP address of `10.0.0.4`.
   
   ```cmd
   ntttcp -s -m 8,*,10.0.0.4 -t 300 
   ```

1. Wait for the results.

# [Linux](#tab/linux)

### Prepare VMs and install NTTTCP-for-Linux

To measure throughput from Linux machines, use [NTTTCP-for-Linux](https://github.com/Microsoft/ntttcp-for-linux).

1. Prepare both the sender and receiver VMs for NTTTCP-for-Linux by running the following commands, depending on your distro:

   - For **CentOS**, install `gcc` and `git`.

     ``` bash
     yum install gcc -y  
     yum install git -y
     ```

   - For **Ubuntu**, install `build-essential` and `git`.

     ``` bash
     apt-get -y install build-essential  
     apt-get -y install git
     ```

   - For **SUSE**, install `git-core`, `gcc`, and `make`.

     ``` bash
     zypper in -y git-core gcc make
     ```

1. Make and install NTTTCP-for-Linux.

   ``` bash
   git clone https://github.com/Microsoft/ntttcp-for-linux
   cd ntttcp-for-linux/src
   make && make install
   ```

### Run throughput tests

Run the NTTTCP test for 300 seconds, or five minutes, on both the sender VM and the receiver VM. The sender and receiver must specify the same test duration for the `-t` parameter. Test duration defaults to 60 seconds if you don't specify a time parameter.

1. On the receiver VM, run the following command:

   ``` bash
   ntttcp -r -t 300
   ```

1. On the sender VM, run the following command. This example shows a sender command for a receiver IP address of `10.0.0.4`.

   ``` bash
   ntttcp -s10.0.0.4 -t 300
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

## Test Cloud Service instances

Add the following section to *ServiceDefinition.csdef*:

```xml
<Endpoints>
  <InternalEndpoint name="Endpoint3" protocol="any" />
</Endpoints> 
```

## Next steps

- [Optimize network throughput for Azure virtual machines](virtual-network-optimize-network-bandwidth.md).
- [Virtual machine network bandwidth](virtual-machine-network-throughput.md).
- [Test VM network latency](virtual-network-test-latency.md)
- [Azure Virtual Network frequently asked questions (FAQ)](virtual-networks-faq.md)
