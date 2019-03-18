---
title: Troubleshoot Azure Load Balancer
titlesuffix: Azure Load Balancer
description: Troubleshoot known issues with Azure Load Balancer
services: load-balancer
documentationcenter: na
author: chadmath
manager: cshepard
ms.custom: seodoc18
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/09/2018
ms.author: genli
---

# Troubleshoot Azure Load Balancer

[!INCLUDE [load-balancer-basic-sku-include.md](../../includes/load-balancer-basic-sku-include.md)]

This page provides troubleshooting information for common Azure Load Balancer questions. When the Load Balancer connectivity is unavailable, the most common symptoms are as follows: 
- VMs behind the Load Balancer are not responding to health probes 
- VMs behind the Load Balancer are not responding to the traffic on the configured port

## Symptom: VMs behind the Load Balancer are not responding to health probes
For the backend servers to participate in the load balancer set, they must pass the probe check. For more information about health probes, see [Understanding Load Balancer Probes](load-balancer-custom-probe-overview.md). 

The Load Balancer backend pool VMs may not be responding to the probes due to any of the following reasons: 
- Load Balancer backend pool VM is unhealthy 
- Load Balancer backend pool VM is not listening on the probe port 
- Firewall, or a network security group is blocking the port on the Load Balancer backend pool VMs 
- Other misconfigurations in Load Balancer

### Cause 1: Load Balancer backend pool VM is unhealthy 

**Validation and resolution**

To resolve this issue, log in to the participating VMs, and check if the VM state is healthy, and can respond to **PsPing** or **TCPing** from another VM in the pool. If the VM is unhealthy, or is unable to respond to the probe, you must rectify the issue and get the VM back to a healthy state before it can participate in load balancing.

### Cause 2: Load Balancer backend pool VM is not listening on the probe port
If the VM is healthy, but is not responding to the probe, then one possible reason could be that the probe port is not open on the participating VM, or the VM is not listening on that port.

**Validation and resolution**

1. Log in to the backend VM. 
2. Open a command prompt and run the following command to validate there is an application listening on the probe port:   
            netstat -an
3. If the port state is not listed as **LISTENING**, configure the proper port. 
4. Alternatively, select another port, that is listed as **LISTENING**, and update load balancer configuration accordingly.              

### Cause 3: Firewall, or a network security group is blocking the port on the load balancer backend pool VMs  
If the firewall on the VM is blocking the probe port, or one or more network security groups configured on the subnet or on the VM, is not allowing the probe to reach the port, the VM is unable to respond to the health probe.          

**Validation and resolution**

* If the firewall is enabled, check if it is configured to allow the probe port. If not, configure the firewall to allow traffic on the probe port, and test again. 
* From the list of network security groups, check if the incoming or outgoing traffic on the probe port has interference. 
* Also, check if a **Deny All** network security groups rule on the NIC of the VM or the subnet that has a higher priority than the default rule that allows LB probes & traffic (network security groups must allow Load Balancer IP of 168.63.129.16). 
* If any of these rules are blocking the probe traffic, remove and reconfigure the rules to allow the probe traffic.  
* Test if the VM has now started responding to the health probes. 

### Cause 4: Other misconfigurations in Load Balancer
If all the preceding causes seem to be validated and resolved correctly, and the backend VM still does not respond to the health probe, then manually test for connectivity, and collect some traces to understand the connectivity.

**Validation and resolution**

* Use **Psping** from one of the other VMs within the VNet to test the probe port response (example: .\psping.exe -t 10.0.0.4:3389) and record results. 
* Use **TCPing** from one of the other VMs within the VNet to test the probe port response (example: .\tcping.exe 10.0.0.4 3389) and record results. 
* If no response is received in these ping tests, then
    - Run a simultaneous Netsh trace on the target backend pool VM and another test VM from the same VNet. Now, run a PsPing test for some time, collect some network traces, and then stop the test. 
    - Analyze the network capture and see if there are both incoming and outgoing packets related to the ping query. 
        - If no incoming packets are observed on the backend pool VM, there is potentially a network security groups or UDR mis-configuration blocking the traffic. 
        - If no outgoing packets are observed on the backend pool VM, the VM needs to be checked for any unrelated issues (for example, Application blocking the probe port). 
    - Verify if the probe packets are being forced to another destination (possibly via UDR settings) before reaching the load balancer. This can cause the traffic to never reach the backend VM. 
* Change the probe type (for example, HTTP to TCP), and configure the corresponding port in network security groups ACLs and firewall to validate if the issue is with the configuration of probe response. For more information about health probe configuration, see [Endpoint Load Balancing health probe configuration](https://blogs.msdn.microsoft.com/mast/2016/01/26/endpoint-load-balancing-heath-probe-configuration-details/).

## Symptom: VMs behind Load Balancer are not responding to traffic on the configured data port

If a backend pool VM is listed as healthy and responds to the health probes, but is still not participating in the Load Balancing, or is not responding to the data traffic, it may be due to any of the following reasons: 
* Load Balancer Backend pool VM is not listening on the data port 
* Network security group is blocking the port on the Load Balancer backend pool VM  
* Accessing the Load Balancer from the same VM and NIC 
* Accessing the Internet Load Balancer frontend from the participating Load Balancer backend pool VM 

### Cause 1: Load Balancer backend pool VM is not listening on the data port 
If a VM does not respond to the data traffic, it may be because either the target port is not open on the participating VM, or, the VM is not listening on that port. 

**Validation and resolution**

1. Log in to the backend VM. 
2. Open a command prompt and run the following command to validate there is an application listening on the data port:  
            netstat -an 
3. If the port is not listed with State “LISTENING”, configure the proper listener port 
4. If the port is marked as Listening, then check the target application on that port for any possible issues. 

### Cause 2: Network security group is blocking the port on the Load Balancer backend pool VM  

If one or more network security groups configured on the subnet or on the VM, is blocking the source IP or port, then the VM is unable to respond.

* List the network security groups configured on the backend VM. For more information, see [Manage network security groups](../virtual-network/manage-network-security-group.md).
* From the list of network security groups, check if:
    - the incoming or outgoing traffic on the data port has interference. 
    - a **Deny All** network security group rule on the NIC of the VM or the subnet that has a higher priority that the default rule that allows Load Balancer probes and traffic (network security groups must allow Load Balancer IP of 168.63.129.16, that is probe port) 
* If any of the rules are blocking the traffic, remove and reconfigure those rules to allow the data traffic.  
* Test if the VM has now started to respond to the health probes.

### Cause 3: Accessing the Load Balancer from the same VM and Network interface 

If your application hosted in the backend VM of a Load Balancer is trying to access another application hosted in the same backend VM over the same Network Interface, it is an unsupported scenario and will fail. 

**Resolution**
You can resolve this issue via one of the following methods:
* Configure separate backend pool VMs per application. 
* Configure the application in dual NIC VMs so each application was using its own Network interface and IP address. 

### Cause 4: Accessing the internal Load Balancer frontend from the participating Load Balancer backend pool VM

If an internal Load Balancer is configured inside a VNet, and one of the participant backend VMs is trying to access the internal Load Balancer frontend, failures can occur when the flow is mapped to the originating VM. This scenario is not supported. Review [limitations](load-balancer-overview.md#limitations) for a detailed discussion.

**Resolution**
There are several ways to unblock this scenario, including using a proxy. Evaluate Application Gateway or other 3rd party proxies (for example, nginx or haproxy). For more information about Application Gateway, see [Overview of Application Gateway](../application-gateway/application-gateway-introduction.md)

## Additional network captures
If you decide to open a support case, collect the following information for a quicker resolution. Choose a single backend VM to perform the following tests:
- Use Psping from one of the backend VMs within the VNet to test the probe port response (example: psping 10.0.0.4:3389) and record results. 
- If no response is received in these ping tests, run a simultaneous Netsh trace on the backend VM and the VNet test VM while you run PsPing then stop the Netsh trace. 
  
## Next steps

If the preceding steps do not resolve the issue, open a [support ticket](https://azure.microsoft.com/support/options/).

