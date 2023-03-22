---
title: Test network latency between Azure VMs
description: Learn how to test network latency between Azure virtual machines on a virtual network.
services: virtual-network
author: asudbring
manager: Marina Lipshteyn
ms.service: virtual-network
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 03/21/2023
ms.author: allensu
---

# Test network latency between Azure VMs

This article describes how to test network latency between Azure virtual machines (VMs) by using the publicly-available tools [Latte](https://github.com/microsoft/latte) for Windows or [SockPerf](https://github.com/mellanox/sockperf) for Linux.

For the most accurate results, you should measure VM network latency with a tool that's designed for the task and excludes other types of latency, such as application latency. Latte and SockPerf provide the most relevant network latency results by focusing on Transmission Control Protocol [TCP] and User Datagram Protocol [UDP] traffic. Most applications use these protocols, and they have the greatest effect on application performance.

Many other common network latency test tools, such as Ping, don't measure the type of network traffic that's used in real workloads. Most of these tools use Internet Control Message Protocol (ICMP), which most applications don't use and which can be treated differently from application traffic. These test results might not apply to workloads that use TCP and UDP.

Tools like Latte or SockPerf measure only TCP or UDP payload delivery times. These tools don't measure ICMP or other packet types that aren't used by applications and don't affect application performance.

## Network latency testing process and best practices

Latte or SockPerf use the following approach to measure network latency between two physical or virtual computers:

1. Create a two-way communications channel between the computers by alternately designating one as sender and one as receiver.
1. Send and receive packets in both directions and measure the round-trip time (RTT).

### Optimal VM configuration

To optimize network latency, observe the following recommendations when you create your VMs:

- Use the latest version of Windows or Linux.
- Enable Accelerated Networking for increased performance.
- Deploy VMs within an [Azure proximity placement group](../virtual-machines/co-location.md).
- Create larger VMs for better performance.

### Recommended testing process

Use the following process to test and analyze network latency results:

1. Use network latency measurements to establish a benchmark for network latency between deployed VMs. Take a network latency baseline measurement as soon as you complete VM deployment, configuration, and optimizations.

1. Test the effect on network latency of any changes to:
   - Operating system (OS) or network stack software, including configuration changes.
   - VM deployment method, such as deploying to an availability zone or proximity placement group (PPG).
   - VM properties, such as Accelerated Networking or size changes.
   - The virtual network, such as routing or filtering changes.

1. Always compare new test results to the baseline or to the last test result after controlled changes.

1. Repeat tests whenever you observe or deploy changes.

- 
## Test VMs with Latte or SockPerf

1. [Download the latest version of latte.exe](https://github.com/microsoft/latte/releases/download/v0/latte.exe) into a separate folder on your computer, such as *c:\\tools*.

1. On the *receiver* VM, create a Windows Defender Firewall `allow` rule to allow the Latte traffic to arrive through Windows Defender Firewall. It's easiest to allow the *latte.exe* program by name rather than to allow specific inbound TCP ports. In the command, replace the `<path>` placeholder with the path you downloaded *latte.exe* to, such as *c:\\tools\\*.

   ```cmd
   netsh advfirewall firewall add rule program=<path>latte.exe name="Latte" protocol=any dir=in action=allow enable=yes profile=ANY
   ```

1. Start *latte.exe* from the Windows command line, not from PowerShell. Replace the `<receiver IP address>`, `<port>`, and `<iterations>` placeholders with your own values.

   ```cmd
   latte -a <receiver IP address>:<port> -i <iterations>
   ```

   - Around 65,000 iterations is long enough to return representative results.
   - Any available port number is fine.

   For a VM with an IP address of `10.0.0.4`, the command might look like:<br><br>`latte -a 10.0.0.4:5005 -i 65100`

1. On the *sender* VM, start *latte.exe* from the command line. The command is the same as on the receiver, except with `-c` added to indicate that this is the *client*, or sender.

   ```cmd
   latte -c -a <receiver IP address>:<port> -i <iterations>
```

   Again replace the `<receiver IP address>`, `<port>`, and `<iterations>` placeholders with your own values, for example:
   
   `latte -c -a 10.0.0.4:5005 -i 65100`

1. Wait for the results. Depending on how far apart the VMs are, the test could take a few minutes to finish. Consider starting with fewer iterations to test for success before running longer tests.

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
    sudo yum install -y libtool
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
    sudo apt-get install -y libtool
    sudo apt update
    sudo apt upgrade
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
* Improve latency with an [Azure proximity placement group](../virtual-machines/co-location.md).
* Learn how to [Optimize networking for VMs](../virtual-network/virtual-network-optimize-network-bandwidth.md) for your scenario.
* Read about [how bandwidth is allocated to virtual machines](../virtual-network/virtual-machine-network-throughput.md).
* For more information, see [Azure Virtual Network FAQ](../virtual-network/virtual-networks-faq.md).
