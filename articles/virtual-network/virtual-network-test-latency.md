---
title: Test Azure virtual machine network latency in an Azure virtual network | Microsoft Docs
description: Learn how to test network latency between Azure virtual machines on a virtual network
services: virtual-network
documentationcenter: na
author: steveesp
manager: Marina Lipshteyn
editor: ''

ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/29/2019
ms.author: steveesp

---



# Test VM network latency

To achieve the most accurate results, measure your Azure virtual machine (VM) network latency with a tool that's designed for the task. Publicly available tools such as SockPerf (for Linux) and latte.exe (for Windows) can isolate and measure network latency while excluding other types of latency, such as application latency. These tools focus on the kind of network traffic that affects application performance (namely, Transmission Control Protocol [TCP] and User Datagram Protocol [UDP] traffic). 

Other common connectivity tools, such as Ping, might measure latency, but their results might not represent the network traffic that's used in real workloads. That's because most of these tools employ the Internet Control Message Protocol (ICMP), which can be treated differently from application traffic and whose results might not apply to workloads that use TCP and UDP. 

For accurate network latency testing of the protocols used by most applications, SockPerf (for Linux) and latte.exe (for Windows) produce the most relevant results. This article covers both of these tools.

## Overview

By using two VMs, one as sender and one as receiver, you create a two-way communications channel. With this approach, you can send and receive packets in both directions and measure the round-trip time (RTT).

You can use this approach to measure network latency between two VMs or even between two physical computers. Latency measurements can be useful for the following scenarios:

- Establish a benchmark for network latency between the deployed VMs.
- Compare the effects of changes in network latency after related changes are made to:
  - Operating system (OS) or network stack software, including configuration changes.
  - A VM deployment method, such as deploying to an availability zone or proximity placement group (PPG).
  - VM properties, such as Accelerated Networking or size changes.
  - A virtual network, such as routing or filtering changes.

### Tools for testing
To measure latency, you have two different tool options:

* For Windows-based systems: [latte.exe (Windows)](https://gallery.technet.microsoft.com/Latte-The-Windows-tool-for-ac33093b)
* For Linux-based systems: [SockPerf (Linux)](https://github.com/mellanox/sockperf)

By using these tools, you help ensure that only TCP or UDP payload delivery times are measured and not ICMP (Ping) or other packet types that aren't used by applications and don't affect their performance.

### Tips for creating an optimal VM configuration

When you create your VM configuration, keep in mind the following recommendations:
- Use the latest version of Windows or Linux.
- Enable Accelerated Networking for best results.
- Deploy VMs with an [Azure proximity placement group](https://docs.microsoft.com/azure/virtual-machines/linux/co-location).
- Larger VMs generally perform better than smaller VMs.

### Tips for analysis

As you're analyzing test results, keep in mind the following recommendations:

- Establish a baseline early, as soon as deployment, configuration, and optimizations are complete.
- Always compare new results to a baseline or, otherwise, from one test to another with controlled changes.
- Repeat tests whenever changes are observed or planned.


## Test VMs that are running Windows

### Get latte.exe onto the VMs

Download the [latest version of latte.exe](https://gallery.technet.microsoft.com/Latte-The-Windows-tool-for-ac33093b).

Consider putting latte.exe in separate folder, such as *c:\tools*.

### Allow latte.exe through Windows Defender Firewall

On the *receiver*, create an Allow rule on Windows Defender Firewall to allow the latte.exe traffic to arrive. It's easiest to allow the entire latte.exe program by name rather than to allow specific TCP ports inbound.

Allow latte.exe through Windows Defender Firewall by running the following command:

```cmd
netsh advfirewall firewall add rule program=<path>\latte.exe name="Latte" protocol=any dir=in action=allow enable=yes profile=ANY
```

For example, if you copied latte.exe to the *c:\tools* folder, this would be the command:

`netsh advfirewall firewall add rule program=c:\tools\latte.exe name="Latte" protocol=any dir=in action=allow enable=yes profile=ANY`

### Run latency tests

* On the *receiver*, start latte.exe (run it from the CMD window, not from PowerShell):

    ```cmd
    latte -a <Receiver IP address>:<port> -i <iterations>
    ```

    Around 65,000 iterations is long enough to return representative results.

    Any available port number is fine.

    If the VM has an IP address of 10.0.0.4, the command would look like this:

    `latte -a 10.0.0.4:5005 -i 65100`

* On the *sender*, start latte.exe (run it from the CMD window, not from PowerShell):

    ```cmd
    latte -c -a <Receiver IP address>:<port> -i <iterations>
    ```

    The resulting command is the same as on the receiver, except with the addition of&nbsp;*-c* to indicate that this is the *client*, or *sender*:

    `latte -c -a 10.0.0.4:5005 -i 65100`

Wait for the results. Depending on how far apart the VMs are, the test could take a few minutes to finish. Consider starting with fewer iterations to test for success before running longer tests.

## Test VMs that are running Linux

To test VMs that are running Linux, use [SockPerf](https://github.com/mellanox/sockperf).

### Install SockPerf on the VMs

On the Linux VMs, both *sender* and *receiver*, run the following commands to prepare SockPerf on the VMs. Commands are provided for the major distros.

#### For Red Hat Enterprise Linux (RHEL)/CentOS

Run the following commands:

```bash
#RHEL/CentOS - Install Git and other helpful tools
    sudo yum install gcc -y -q
    sudo yum install git -y -q
    sudo yum install gcc-c++ -y
    sudo yum install ncurses-devel -y
    sudo yum install -y automake
    sudo yum install -y autoconf
```

#### For Ubuntu

Run the following commands:

```bash
#Ubuntu - Install Git and other helpful tools
    sudo apt-get install build-essential -y
    sudo apt-get install git -y -q
    sudo apt-get install -y autotools-dev
    sudo apt-get install -y automake
    sudo apt-get install -y autoconf
```

#### For all distros

Copy, compile, and install SockPerf according to the following steps:

```bash
#Bash - all distros

#From bash command line (assumes Git is installed)
git clone https://github.com/mellanox/sockperf
cd sockperf/
./autogen.sh
./configure --prefix=

#make is slower, may take several minutes
make

#make install is fast
sudo make install
```

### Run SockPerf on the VMs

After the SockPerf installation is complete, the VMs are ready to run the latency tests. 

First, start SockPerf on the *receiver*.

Any available port number is fine. In this example, we use port 12345:

```bash
#Server/Receiver - assumes server's IP is 10.0.0.4:
sudo sockperf sr --tcp -i 10.0.0.4 -p 12345
```

Now that the server is listening, the client can begin sending packets to the server on the port on which it is listening (in this case, 12345).

About 100 seconds is long enough to return representative results, as shown in the following example:

```bash
#Client/Sender - assumes server's IP is 10.0.0.4:
sockperf ping-pong -i 10.0.0.4 --tcp -m 350 -t 101 -p 12345  --full-rtt
```

Wait for the results. Depending on how far apart the VMs are, the number of iterations will vary. To test for success before you run longer tests, consider starting with shorter tests of about 5 seconds.

This SockPerf example uses a 350-byte message size, which is typical for an average packet. You can adjust the size higher or lower to achieve results that more accurately represent the workload that's running on your VMs.


## Next steps
* Improve latency with an [Azure proximity placement group](https://docs.microsoft.com/azure/virtual-machines/linux/co-location).
* Learn how to [Optimize networking for VMs](../virtual-network/virtual-network-optimize-network-bandwidth.md) for your scenario.
* Read about [how bandwidth is allocated to virtual machines](../virtual-network/virtual-machine-network-throughput.md).
* For more information, see [Azure Virtual Network FAQ](../virtual-network/virtual-networks-faq.md).
