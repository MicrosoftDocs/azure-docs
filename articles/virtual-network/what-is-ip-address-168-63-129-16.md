---
title: Azure IP Address 168.63.129.16 Overview
description: Discover how Azure IP address 168.63.129.16 facilitates communication between virtual machines and Azure platform resources. Learn configuration, troubleshooting, and security considerations for optimal performance.
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 07/25/2025
ms.author: allensu
# Customer intent: As a network engineer, I want to understand the function and significance of IP address 168.63.129.16, so that I can ensure proper configuration and communication for my Azure resources.
---

# Azure IP address 168.63.129.16 overview

Azure IP address 168.63.129.16 is a virtual public IP address that facilitates communication channels to Azure platform resources. Customers can define any address space for their private virtual network in Azure. Therefore, the Azure platform resources must be presented as a unique public IP address. This virtual public IP address facilitates the following operations:

- Enables the virtual machine Agent to communicate with the Azure platform to signal that it is in a "Ready" state.
- Enables communication with the DNS virtual server to provide filtered name resolution to the resources (such as virtual machine) that don't have a custom DNS server. This filtering makes sure that customers can resolve only the hostnames of their resources.
- Enables [health probes from Azure Load Balancer](../load-balancer/load-balancer-custom-probe-overview.md) to determine the health state of virtual machines.
- Enables the virtual machine to obtain a dynamic IP address from the DHCP service in Azure.
- Enables Guest Agent heartbeat messages for the PaaS role.

## Scope of Azure IP address 168.63.129.16

The public IP address 168.63.129.16 is used in all regions and all national clouds. Microsoft owns this special public IP address and it doesn't change. We recommend that you allow this IP address in any local (in the virtual machine) firewall policies (outbound direction). The communication between this special IP address and the resources is safe because only the internal Azure platform can source a message from this IP address. If this address is blocked, unexpected behavior can occur in various scenarios. 168.63.129.16 is a [virtual IP of the host node](./network-security-groups-overview.md#azure-platform-considerations) and as such it isn't subject to user defined routes.

- The virtual machine Agent requires outbound communication over ports 80/tcp and 32526/tcp with WireServer (168.63.129.16). These ports should be open in the local firewall on the virtual machine. The communication on these ports with 168.63.129.16 isn't subject to the configured network security groups. The traffic must always come from the primary network interface of the virtual machine.
- 168.63.129.16 can provide DNS services to the virtual machine. If DNS services provided by 168.63.129.16 isn't desired, outbound traffic to 168.63.129.16 ports 53/udp and 53/tcp can be blocked in the local firewall on the virtual machine.

  By default DNS communication isn't subject to the configured network security groups unless targeted using the [AzurePlatformDNS](../virtual-network/service-tags-overview.md#available-service-tags) service tag. To block DNS traffic to Azure DNS through NSG, create an outbound rule to deny traffic to [AzurePlatformDNS](../virtual-network/service-tags-overview.md#available-service-tags). Specify **"Any"** as **"Source"**, **"*"** as **"Destination port ranges"**, **"Any"** as protocol and **"Deny"** as action.

  Additionally, the IP address 168.63.129.16 doesn't support reverse DNS lookup. This means if you try to retrieve the Fully Qualified Domain Name (FQDN) using reverse lookup commands like `host`, `nslookup`, or `dig -x` on 168.63.129.16, an FQDN isn't received.
- When the virtual machine is part of a load balancer backend pool, [health probe](../load-balancer/load-balancer-custom-probe-overview.md) communication should be allowed to originate from 168.63.129.16. The default network security group configuration has a rule that allows this communication. This rule uses the [AzureLoadBalancer](../virtual-network/service-tags-overview.md#available-service-tags) service tag. If desired, this traffic can be blocked by configuring the network security group. The configuration of the block result in probes that fail.

## Troubleshoot Azure IP connectivity

> [!NOTE]
> Execution of the following tests must be run as Administrator (Windows) and Root (Linux) to ensure accurate results.

### [Windows](#tab/windows)

You can test communication to 168.63.129.16 by using the following tests with PowerShell.

```powershell
$Params = @{
  ComputerName = "168.63.129.16"
  Port         = 80
}
Test-NetConnection @Params

$Params.Port = 32526
Test-NetConnection @Params

$Headers = @{
  Metadata = "true"
}
Invoke-RestMethod -Headers $Headers -Method GET -Uri "http://168.63.129.16/?comp=versions"
```

Results should return as follows.

```output
Test-NetConnection -ComputerName 168.63.129.16 -Port 80
ComputerName     : 168.63.129.16
RemoteAddress    : 168.63.129.16
RemotePort       : 80
InterfaceAlias   : Ethernet
SourceAddress    : 10.0.0.4
TcpTestSucceeded : True
```

```output
Test-NetConnection -ComputerName 168.63.129.16 -Port 32526
ComputerName     : 168.63.129.16
RemoteAddress    : 168.63.129.16
RemotePort       : 32526
InterfaceAlias   : Ethernet
SourceAddress    : 10.0.0.4
TcpTestSucceeded : True
```

```output
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -Uri http://168.63.129.16/?comp=versions
xml                            Versions
---                            --------
version="1.0" encoding="utf-8" Versions
```

You can also test communication to 168.63.129.16 by using `telnet` or `psping`.

If successful, telnet should connect and the file that is created is empty.

```powershell
telnet 168.63.129.16 80 >> C:\<<EDIT-DIRECTORY>>\168-63-129-16_test-port80.txt
telnet 168.63.129.16 32526 >> C:\<<EDIT-DIRECTORY>>\168-63-129-16_test--port32526.txt
```

```powershell
Psping 168.63.129.16:80 >> C:\<<EDIT-DIRECTORY>>\168-63-129-16_test--port80.txt
Psping 168.63.129.16:32526 >> C:\<<EDIT-DIRECTORY>>\168-63-129-16_test-port32526.txt
```

### [Linux](#tab/linux)

On Linux, you can test communication to 168.63.129.16 by using the following tests.

```bash
echo "Testing 80 168.63.129.16 Port 80" > 168-63-129-16_test.txt
traceroute -T -p 80 168.63.129.16 >> 168-63-129-16_test.txt
echo "Testing 80 168.63.129.16 Port 32526" >> 168-63-129-16_test.txt
traceroute -T -p 32526 168.63.129.16 >> 168-63-129-16_test.txt
echo "Test 168.63.129.16 Versions"  >> 168-63-129-16_test.txt
curl http://168.63.129.16/?comp=versions >> 168-63-129-16_test.txt
```

Results inside 168-63-129-16_test.txt should return as follows.

```output
traceroute -T -p 80 168.63.129.16
traceroute to 168.63.129.16 (168.63.129.16), 30 hops max, 60 byte packets
1  168.63.129.16 (168.63.129.16)  0.974 ms  1.085 ms  1.078 ms

traceroute -T -p 32526 168.63.129.16
traceroute to 168.63.129.16 (168.63.129.16), 30 hops max, 60 byte packets
1  168.63.129.16 (168.63.129.16)  0.883 ms  1.004 ms  1.010 ms

curl http://168.63.129.16/?comp=versions
<?xml version="1.0" encoding="utf-8"?>
<Versions>
<Preferred>
<Version>2015-04-05</Version>
</Preferred>
<Supported>
<Version>2015-04-05</Version>
<Version>2012-11-30</Version>
<Version>2012-09-15</Version>
<Version>2012-05-15</Version>
<Version>2011-12-31</Version>
<Version>2011-10-15</Version>
<Version>2011-08-31</Version>
<Version>2011-04-07</Version>
<Version>2010-12-15</Version>
<Version>2010-28-10</Version>
</Supported>
```

---

## Next steps

- [Security groups](./network-security-groups-overview.md)
- [Create, change, or delete a network security group](manage-network-security-group.md)
