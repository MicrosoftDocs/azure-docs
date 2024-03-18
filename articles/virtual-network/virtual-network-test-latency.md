---
title: Test network latency between Azure VMs
description: Learn how to test network latency between Azure virtual machines on a virtual network.
services: virtual-network
author: asudbring
manager: Marina Lipshteyn
ms.service: virtual-network
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 03/23/2023
ms.author: allensu
---

# Test network latency between Azure VMs

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article describes how to test network latency between Azure virtual machines (VMs) by using the publicly available tools [Latte](https://github.com/microsoft/latte) for Windows or [SockPerf](https://github.com/mellanox/sockperf) for Linux.

For the most accurate results, you should measure VM network latency with a tool that's designed for the task and excludes other types of latency, such as application latency. Latte and SockPerf provide the most relevant network latency results by focusing on Transmission Control Protocol (TCP) and User Datagram Protocol (UDP) traffic. Most applications use these protocols, and this traffic has the largest effect on application performance.

Many other common network latency test tools, such as Ping, don't measure TCP or UDP traffic. Tools like Ping use Internet Control Message Protocol (ICMP), which applications don't use. ICMP traffic can be treated differently from application traffic and doesn't directly affect application performance. ICMP test results don't directly apply to workloads that use TCP and UDP.

Latte and SockPerf measure only TCP or UDP payload delivery times. These tools use the following approach to measure network latency between two physical or virtual computers:

1. Create a two-way communications channel between the computers by designating one as sender and one as receiver.
1. Send and receive packets in both directions and measure the round-trip time (RTT).

## Tips and best practices to optimize network latency

To optimize VMs for network latency, observe the following recommendations when you create the VMs:

- Use the latest version of Windows or Linux.
- Enable [Accelerated Networking](accelerated-networking-overview.md) for increased performance.
- Deploy VMs within an [Azure proximity placement group](/azure/virtual-machines/co-location).
- Create larger VMs for better performance.

Use the following best practices to test and analyze network latency:

1. As soon as you finish deploying, configuring, and optimizing network VMs, take baseline network latency measurements between deployed VMs to establish benchmarks.

1. Test the effects on network latency of changing any of the following components:
   - Operating system (OS) or network stack software, including configuration changes.
   - VM deployment method, such as deploying to an availability zone or proximity placement group (PPG).
   - VM properties, such as Accelerated Networking or size changes.
   - Virtual network configuration, such as routing or filtering changes.

1. Always compare new test results to the baseline or to the latest test results before controlled changes.

1. Repeat tests whenever you observe or deploy changes.

## Test VMs with Latte or SockPerf

Use the following procedures to install and test network latency with [Latte](https://github.com/mellanox/sockperf) for Windows or [SockPerf](https://github.com/mellanox/sockperf) for Linux.

# [Windows](#tab/windows)

### Install Latte and configure VMs

1. [Download the latest version of latte.exe](https://github.com/microsoft/latte/releases/download/v0/latte.exe) to both VMs, into a separate folder such as *c:\\tools*.

1. On the *receiver* VM, create a Windows Defender Firewall `allow` rule to allow the Latte traffic to arrive. It's easier to allow the *latte.exe* program by name than to allow specific inbound TCP ports. In the command, replace the `<path>` placeholder with the path you downloaded *latte.exe* to, such as *c:\\tools\\*.

   ```cmd
   netsh advfirewall firewall add rule program=<path>latte.exe name="Latte" protocol=any dir=in action=allow enable=yes profile=ANY
   ```

### Run Latte on the VMs

Run *latte.exe* from the Windows command line, not from PowerShell.

1. On the receiver VM, run the following command, replacing the `<receiver IP address>`, `<port>`, and `<iterations>` placeholders with your own values.

   ```cmd
   latte -a <receiver IP address>:<port> -i <iterations>
   ```

   - Around 65,000 iterations are enough to return representative results.
   - Any available port number is fine.

   The following example shows the command for a VM with an IP address of `10.0.0.4`:<br><br>`latte -a 10.0.0.4:5005 -i 65100`

1. On the *sender* VM, run the same command as on the receiver, except with `-c` added to indicate the *client* or sender VM. Again replace the `<receiver IP address>`, `<port>`, and `<iterations>` placeholders with your own values.

   ```cmd
   latte -c -a <receiver IP address>:<port> -i <iterations>
   ```

   For example:

   `latte -c -a 10.0.0.4:5005 -i 65100`

1. Wait for the results. Depending on how far apart the VMs are, the test could take a few minutes to finish. Consider starting with fewer iterations to test for success before running longer tests.

# [Linux](#tab/linux)

### Prepare VMs

On both the *sender* and *receiver* Linux VMs, run the following commands to prepare for SockPerf, depending on your Linux distro.

- Red Hat Enterprise Linux (RHEL) or CentOS:

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

- Ubuntu:

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

### Copy, compile, and install SockPerf

Copy, compile, and install SockPerf by running the following commands:

```bash
#Bash - all distros

#From bash command line (assumes Git is installed)
git clone https://github.com/mellanox/sockperf
cd sockperf/
./autogen.sh
./configure --prefix=

#make is slow, may take several minutes
make

#make install is fast
sudo make install
```

### Run SockPerf on the VMs

1. After the SockPerf installation is complete, start SockPerf on the *receiver* VM. Any available port number is fine. The following example uses port `12345`. Replace the example IP address of `10.0.0.4` with the IP address of your receiver VM.

   ```bash
   #Server/Receiver for IP 10.0.0.4:
   sudo sockperf sr --tcp -i 10.0.0.4 -p 12345
   ```

1. Now that the receiver is listening, run the following command on the *sender* or client computer to send packets to the receiver on the listening port, in this case `12345`.

   ```bash
   #Client/Sender for IP 10.0.0.4:
   sockperf ping-pong -i 10.0.0.4 --tcp -m 350 -t 101 -p 12345 --full-rtt
   ```

   - The `-t` option sets testing time in seconds. About 100 seconds is long enough to return representative results.
   - The `-m` denotes message size in bytes. A 350-byte message size is typical for an average packet. You can adjust the size to more accurately represent your VM's workloads.

1. Wait for the results. Depending on how far apart the VMs are, the number of iterations varies. To test for success before you run longer tests, consider starting with shorter tests of about five seconds.

---

## Next steps

- Reduce latency with an [Azure proximity placement group](/azure/virtual-machines/co-location).
- [Optimize network throughput for Azure virtual machines](virtual-network-optimize-network-bandwidth.md).
- Allocate [virtual machine network bandwidth](virtual-machine-network-throughput.md).
- [Test bandwidth and throughput](virtual-network-bandwidth-testing.md).
- For more information about Azure virtual networking, see [Azure Virtual Network FAQ](virtual-networks-faq.md).
