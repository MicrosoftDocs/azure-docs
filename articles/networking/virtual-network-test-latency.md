---
title: Test Azure Virtual Machine network latency in an Azure Virtual Network | Microsoft Docs
titleSuffix: Azure Virtual Network latency
description: Learn how to test network latency between Azure VMs on a virtual network
services: virtual-network
documentationcenter: na
author: steveesp
manager: Marina Lipshteyn
editor: ''

ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/29/2019
ms.author: steveesp

---



# Testing Network Latency

Measuring network latency with a tool that is designed for the task will give the most accurate results. Publicly available tools like SockPerf (for Linux) and Latte (for Windows) are examples of tools that can isolate and measure network latency while excluding other types of latency, such as application latency. These tools focus on the kind of network traffic that affects application performance, namely TCP and UDP. Other common connectivity tools, like ping, may sometimes be used for measuring latency but those results may not be representative of network traffic used in real workloads. That&#39;s because most of these tools employ the ICMP protocol, which can be treated differently from application traffic, and the results may not be applicable to workloads that use TCP and UDP. For accurate network latency testing of protocols used by most applications, SockPerf (for Linux) and Latte (for Windows) produce the most relevant results. This document covers both of these tools.

## Overview

Using two VMs, one as sender and one as receiver, a two-way communications channel is created to send and receive packets in both directions to measure the round-trip time (RTT).

These steps can be used to measure network latency between two Virtual Machines (VMs) or even between two physical computers. Latency measurements can be useful for the following scenarios:

- Establish a benchmark for network latency between the deployed VMs
- Compare the effects of changes in network latency after related changes are made to:
  - OS or network stack software, including configuration changes
  - VM deployment method, such as deploying to a Zone or PPG
  - VM properties, like Accelerated Networking or size changes
  - Virtual network, such as routing or filtering changes

### Tools for testing
To measure latency we have two different options, one for Windows-based systems, and one for Linux-based systems

For Windows: latte.exe (Windows)
[https://gallery.technet.microsoft.com/Latte-The-Windows-tool-for-ac33093b](https://gallery.technet.microsoft.com/Latte-The-Windows-tool-for-ac33093b)

For Linux: SockPerf (Linux)
[https://github.com/mellanox/sockperf](https://github.com/mellanox/sockperf)

Using these tools ensures that only TCP or UDP payload delivery times are measured and not ICMP (Ping) or other packet types that aren't used by applications and don't affect their performance.

### Tips for an optimal VM configuration:

- Use the latest version of Windows or Linux
- Enable Accelerated Networking for best results
- Deploy VMs with [Azure Proximity Placement Group](https://docs.microsoft.com/azure/virtual-machines/linux/co-location)
- Larger VMs generally perform better than smaller VMs

### Tips for analysis

- Establish a baseline early, as soon as deployment, configuration, and optimizations are complete
- Always compare new results to a baseline or otherwise from one test to another with controlled changes
- Repeat tests whenever changes are observed or planned


## Testing VMs running Windows:

## Get Latte.exe onto the VMs

Download the latest version: [https://gallery.technet.microsoft.com/Latte-The-Windows-tool-for-ac33093b](https://gallery.technet.microsoft.com/Latte-The-Windows-tool-for-ac33093b)

Consider putting Latte.exe in separate folder, like c:\tools

## Allow Latte.exe through the Windows firewall

On the RECEIVER, create an Allow rule on the Windows Firewall to allow the Latte.exe traffic to arrive. It's easiest to allow the entire Latte.exe program by name rather than to allow specific TCP ports inbound.

Allow Latte.exe through the Windows Firewall like this:

netsh advfirewall firewall add rule program=\<PATH\>\\latte.exe name=&quot;Latte&quot; protocol=any dir=in action=allow enable=yes profile=ANY


For example, if you copied latte.exe to the &quot;c:\\tools&quot; folder, this would be the command:

```cmd
netsh advfirewall firewall add rule program=c:\tools\latte.exe name="Latte" protocol=any dir=in action=allow enable=yes profile=ANY
```

## Running latency tests

Start latte.exe on the RECEIVER (run from CMD, not from PowerShell):

latte -a &lt;Receiver IP address&gt;:&lt;port&gt; -i &lt;iterations&gt;

Around 65k iterations is long enough to return representative results.

Any available port number is fine.

If the VM has an IP address of 10.0.0.4, it would look like this:

```cmd
latte -a 10.0.0.4:5005 -i 65100
```

Start latte.exe on the SENDER (run from CMD, not from PowerShell):

latte -c -a \<Receiver IP address\>:\<port\> -i \<iterations\>


The resulting command is the same as on the receiver except with the addition of &quot;-c&quot; to indicate that this is the &quot;client&quot; or sender:

```cmd
latte -c -a 10.0.0.4:5005 -i 65100
```

Wait for the results. Depending on how far apart the VMs are, it could take a few minutes to complete. Consider starting with fewer iterations to test for success before running longer tests.



## Testing VMs running Linux

Use SockPerf. It is available from [https://github.com/mellanox/sockperf](https://github.com/mellanox/sockperf)

### Install SockPerf on the VMs

​On the Linux VMs (both SENDER and RECEIVER), run these commands to prepare SockPerf on your VMs. Commands are provided for the major distros.

#### For RHEL / CentOS, follow these steps:
```bash
#CentOS / RHEL - Install GIT and other helpful tools
    sudo yum install gcc -y -q
    sudo yum install git -y -q
    sudo yum install gcc-c++ -y
    sudo yum install ncurses-devel -y
    sudo yum install -y automake
    sudo yum install -y autoconf
```

#### For Ubuntu, follow these steps:
```bash
#Ubuntu - Install GIT and other helpful tools
    sudo apt-get install build-essential -y
    sudo apt-get install git -y -q
    sudo apt-get install -y autotools-dev
    sudo apt-get install -y automake
    sudo apt-get install -y autoconf
```

#### For all distros, copy, compile and install SockPerf according to the following steps:
```bash
#Bash - all distros

#From bash command line (assumes git is installed)
git clone https://github.com/mellanox/sockperf
cd sockperf/
./autogen.sh
./configure --prefix=

#make is slower, may take several minutes
make

#make install is fast
sudo make install
```

### Run SockPerf on the VMs​

With the SockPerf installation complete, the VMs are ready to run the latency tests. 

First, start SockPerf on the RECEIVER.

Any available port number is fine. In this example we use port 12345:
```bash
#Server/Receiver - assumes server's IP is 10.0.0.4:
sudo sockperf sr --tcp -i 10.0.0.4 -p 12345
```
Now that the server is listening, the client can begin sending packets to the server on the port on which it is listening, 12345 in this case.

About 100 seconds is long enough to return representative results as shown in the following example:
```bash
#Client/Sender - assumes server's IP is 10.0.0.4:
sockperf ping-pong -i 10.0.0.4 --tcp -m 350 -t 101 -p 12345  --full-rtt
```

Wait for the results. Depending on how far apart the VMs are, the number of iterations will vary. Consider starting with shorter tests of about 5 seconds to test for success before running longer tests.

This SockPerf example uses a 350 byte message size because it is a typical average size packet. The message size can be adjusted higher or lower to achieve results that more accurately represent the workload that will be running on the VMs.


## Next steps
* Improve latency with [Azure Proximity Placement Group](https://docs.microsoft.com/azure/virtual-machines/linux/co-location)
* Learn about how to [Optimize networking for VMs](../virtual-network/virtual-network-optimize-network-bandwidth.md) for your scenario.
* Read about how [bandwidth is allocated to virtual machines](../virtual-network/virtual-machine-network-throughput.md)
* Learn more with [Azure Virtual Network frequently asked questions (FAQ)](../virtual-network/virtual-networks-faq.md)
