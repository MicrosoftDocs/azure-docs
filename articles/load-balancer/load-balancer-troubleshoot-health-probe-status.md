---
title: Troubleshoot Azure Load Balancer health probe status
description: Learn how to troubleshoot known issues with Azure Load Balancer health probe status.
services: load-balancer
author: mbender-ms
manager: KumudD
ms.service: load-balancer
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.date: 05/31/2023
ms.author: mbender
ms.custom: engagement-fy23
---

# Troubleshoot Azure Load Balancer health probe status

This page provides troubleshooting information common Azure Load Balancer health probe questions.

## Symptom: VMs behind the Load Balancer aren't responding to health probes
For the backend servers to participate in the load balancer set, they must pass the probe check. For more information about health probes, see [Understanding Load Balancer Probes](load-balancer-custom-probe-overview.md). 

The Load Balancer backend pool VMs may not be responding to the probes due to any of the following reasons: 
- Load Balancer backend pool VM is unhealthy 
- Load Balancer backend pool VM isn't listening on the probe port
- Firewall, or a network security group is blocking the port on the Load Balancer backend pool VMs 
- Other misconfigurations in Load Balancer

### Cause 1: Load Balancer backend pool VM is unhealthy

**Validation and resolution**

To resolve this issue, sign-in to the participating VMs, and check if the VM state is healthy, and can respond to **PsPing** or **TCPing** from another VM in the pool. If the VM is unhealthy, or is unable to respond to the probe, you must rectify the issue and get the VM back to a healthy state before it can participate in load balancing.

### Cause 2: Load Balancer backend pool VM isn't listening on the probe port
If the VM is healthy, but isn't responding to the probe, then one possible reason could be that the probe port isn't open on the participating VM, or the VM isn't listening on that port.

**Validation and resolution**

1. Sign-in to the backend VM.
2. Open a command prompt and run the following command to validate there's an application listening on the probe port:
            netstat -an
3. If the port state isn't listed as **LISTENING**, configure the proper port. 
4. Alternatively, select another port that is listed as LISTENING and update load balancer configuration accordingly.

### Cause 3: Firewall, or a network security group is blocking the port on the load balancer backend pool VMs
If the firewall on the VM is blocking the probe port, or one or more network security groups configured on the subnet or on the VM, isn't allowing the probe to reach the port, the VM is unable to respond to the health probe.

**Validation and resolution**

1. If the firewall is enabled, check if it's configured to allow the probe port. If not, configure the firewall to allow traffic on the probe port, and test again.
- Check to make sure your VM firewall isn't blocking probe traffic originating from IP address `168.63.129.16`
- You can check listening ports by running `netstat -a` from a Windows command prompt or `netstat -l` from a Linux terminal
- You can query your firewall profiles to check whether your policies are blocking incoming traffic by running `netsh advfirewall show allprofiles | more` from a Windows commands prompt or `sudo iptables -L` from a Linux terminal to see all configured firewall rules.
- More details on troubleshooting firewall issues for Azure VMs, see [Azure VM Guest OS firewall is blocking inbound traffic](/troubleshoot/azure/virtual-machines/guest-os-firewall-blocking-inbound-traffic).
2. From the list of network security groups, check if the incoming or outgoing traffic on the probe port has interference.
3. Also, check if a **Deny All** network security groups rule on the NIC of the VM or the subnet that has a higher priority than the default rule that allows LB probes & traffic (network security groups must allow Load Balancer IP of 168.63.129.16).
4. If any of these rules are blocking the probe traffic, remove and reconfigure the rules to allow the probe traffic.  
5. Test if the VM has now started responding to the health probes.

### Cause 4: Other misconfigurations in Load Balancer
If all the preceding causes seem to be validated and resolved correctly, and the backend VM still doesn't respond to the health probe, then manually test for connectivity, and collect some traces to understand the connectivity.

**Validation and resolution**

1. Use **Psping** from one of the other VMs within the VNet to test the probe port response (example: .\psping.exe -t 10.0.0.4:3389) and record results. 
2. Use **TCPing** from one of the other VMs within the VNet to test the probe port response (example: .\tcping.exe 10.0.0.4 3389) and record results. 
3. If no response is received in these ping tests, then
    - Run a simultaneous Netsh trace on the target backend pool VM and another test VM from the same VNet. Now, run a PsPing test for some time, collect some network traces, and then stop the test. 
    - Analyze the network capture and see if there are both incoming and outgoing packets related to the ping query. 
        - If no incoming packets are observed on the backend pool VM, there's potentially a network security groups or UDR mis-configuration blocking the traffic. 
        - If no outgoing packets are observed on the backend pool VM, the VM needs to be checked for any unrelated issues (for example, Application blocking the probe port). 
    - Verify if the probe packets are being forced to another destination (possibly via UDR settings) before reaching the load balancer. This can cause the traffic to never reach the backend VM. 
4. Change the probe type (for example, HTTP to TCP), and configure the corresponding port in network security groups ACLs and firewall to validate if the issue is with the configuration of probe response. For more information about health probe configuration, see [Endpoint Load Balancing health probe configuration](/archive/blogs/mast/endpoint-load-balancing-heath-probe-configuration-details).

## Next steps

If the preceding steps don't resolve the issue, open a [support ticket](https://azure.microsoft.com/support/options/).
