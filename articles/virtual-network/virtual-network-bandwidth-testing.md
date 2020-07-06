---
title: Testing Azure VM network throughput
titlesuffix: Azure Virtual Network
description: Learn how to test Azure virtual machine network throughput.
services: virtual-network
documentationcenter: na
author: steveesp
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/21/2017
ms.author: steveesp

---

# Bandwidth/Throughput testing (NTTTCP)

When testing network throughput performance in Azure, it's best to use a tool that targets the network for testing and minimizes the use of other resources that could impact performance. NTTTCP is recommended.

Copy the tool to two Azure VMs of the same size. One VM functions as SENDER
and the other as RECEIVER.

#### Deploying VMs for testing
For the purposes of this test, the two VMs should be in either the same Cloud Service or the same Availability Set so that we can use their internal IPs and exclude the Load Balancers from the test. It is possible to test with the VIP but this kind of testing is outside the scope of this document.

Make a note of the RECEIVER's IP address. Let's call that IP "a.b.c.r"

Make a note of the number of cores on the VM. Let's call this "\#num\_cores"

Run the NTTTCP test for 300 seconds (or 5 minutes) on the sender VM and receiver VM.

Tip: When setting up this test for the first time, you might try a shorter test period to get feedback sooner. Once the tool is working as expected, extend the test period to 300 seconds for the most accurate results.

> [!NOTE]
> The sender **and** receiver must specify **the same** test duration
parameter (-t).

To test a single TCP stream for 10 seconds:

Receiver parameters: ntttcp -r -t 10 -P 1

Sender parameters: ntttcp -s10.27.33.7 -t 10 -n 1 -P 1

> [!NOTE]
> The preceding sample should only be used to confirm your configuration. Valid examples of testing are covered later in this document.

## Testing VMs running WINDOWS:

#### Get NTTTCP onto the VMs.

Download the latest version:
<https://gallery.technet.microsoft.com/NTttcp-Version-528-Now-f8b12769>

Or search for it if moved: <https://www.bing.com/search?q=ntttcp+download>\< -- should be first hit

Consider putting NTTTCP in separate folder, like c:\\tools

#### Allow NTTTCP through the Windows firewall
On the RECEIVER, create an Allow rule on the Windows Firewall to allow the
NTTTCP traffic to arrive. It's easiest to allow the entire NTTTCP program by
name rather than to allow specific TCP ports inbound.

Allow ntttcp through the Windows Firewall like this:

netsh advfirewall firewall add rule program=\<PATH\>\\ntttcp.exe name="ntttcp" protocol=any dir=in action=allow enable=yes profile=ANY

For example, if you copied ntttcp.exe to the "c:\\tools" folder, this would be the command: 

netsh advfirewall firewall add rule program=c:\\tools\\ntttcp.exe name="ntttcp" protocol=any dir=in action=allow enable=yes profile=ANY

#### Running NTTTCP tests

Start NTTTCP on the RECEIVER (**run from CMD**, not from PowerShell):

ntttcp -r –m [2\*\#num\_cores],\*,a.b.c.r -t 300

If the VM has four cores and an IP address of 10.0.0.4, it would look like this:

ntttcp -r –m 8,\*,10.0.0.4 -t 300


Start NTTTCP on the SENDER (**run from CMD**, not from PowerShell):

ntttcp -s –m 8,\*,10.0.0.4 -t 300 

Wait for the results.


## Testing VMs running LINUX:

Use nttcp-for-linux. It is available from <https://github.com/Microsoft/ntttcp-for-linux>

On the Linux VMs (both SENDER and RECEIVER), run these commands to prepare ntttcp-for-linux on your VMs:

CentOS - Install Git:
``` bash
  yum install gcc -y  
  yum install git -y
```
Ubuntu - Install Git:
``` bash
 apt-get -y install build-essential  
 apt-get -y install git
```
Make and Install on both:
``` bash
 git clone https://github.com/Microsoft/ntttcp-for-linux
 cd ntttcp-for-linux/src
 make && make install
```

As in the Windows example, we assume the Linux RECEIVER's IP is 10.0.0.4

Start NTTTCP-for-Linux on the RECEIVER:

``` bash
ntttcp -r -t 300
```

And on the SENDER, run:

``` bash
ntttcp -s10.0.0.4 -t 300
```
 
Test length defaults to 60 seconds if no time parameter is given

## Testing between VMs running Windows and LINUX:

On this scenarios we should enable the no-sync mode so the test can run. This is done by using the **-N flag** for Linux, and **-ns flag** for Windows.

#### From Linux to Windows:

Receiver \<Windows>:

``` bash
ntttcp -r -m <2 x nr cores>,*,<Windows server IP>
```

Sender \<Linux> :

``` bash
ntttcp -s -m <2 x nr cores>,*,<Windows server IP> -N -t 300
```

#### From Windows to Linux:

Receiver \<Linux>:

``` bash
ntttcp -r -m <2 x nr cores>,*,<Linux server IP>
```

Sender \<Windows>:

``` bash
ntttcp -s -m <2 x nr cores>,*,<Linux  server IP> -ns -t 300
```
## Testing Cloud Service Instances:
You need to add following section into your ServiceDefinition.csdef
```xml
<Endpoints>
  <InternalEndpoint name="Endpoint3" protocol="any" />
</Endpoints> 
```

## Next steps
* Depending on results, there may be room to [Optimize network throughput machines](virtual-network-optimize-network-bandwidth.md) for your scenario.
* Read about how [bandwidth is allocated to virtual machines](virtual-machine-network-throughput.md)
* Learn more with [Azure Virtual Network frequently asked questions (FAQ)](virtual-networks-faq.md)
