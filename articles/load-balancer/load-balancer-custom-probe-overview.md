<properties 
   pageTitle="Load balancer custom probes and monitoring health status | Microsoft Azure"
   description="Learn how to use custom probes for Azure load balancer to monitor instances behind a load balancer"
   services="load-balancer"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="01/21/2016"
   ms.author="joaoma" />


# Load balancer probes 

Azure Load Balancer offers the capability to monitor the health of the server instances using probes. When a probe fails to respond, Azure Load Balancer stops sending new connections to the unhealthy instance. The existing connections are not affected and new connections are sent to healthy instances.

A TCP or HTTP custom probes must be configured when you use virtual machines behind a load balancer. Cloud service roles (worker roles and web roles) are the only server instances with guest agent probe monitoring.
 
## Understanding probe count and timeout

The probe behavior depends on the number of successful / failed probes required to mark an instance Up/Down. This is calculated by SuccessFailCount =  Timeout / Frequency. For portal, the Timeout is set to two times the value of Frequency (Timeout = Frequency * 2).

The probe configuration of all load balanced instances for an endpoint (load balanced set) must be the same.  This means you cannot have a different probe configuration (i.e. local port, timeout, etc.) for each role instance or virtual machine in the same hosted service for a particular endpoint combination.


>[AZURE.IMPORTANT] A load balancer probe  uses an IP address 168.63.129.16. This public IP address is used to facilitate a communication channel to internal platform resources for the bring-your-own IP Virtual Network scenario. The virtual public IP address 168.63.129.16 is used in all regions and will not change. It is recommended for the IP address to be allowed in any local firewall policies. It should not be considered a security risk as only the internal Azure platform can source a message from that address.  Not doing so will result unexpected behavior in a variety of scenarios like configuring the same IP address range of 168.63.129.16 and  having duplicated IP address.  


## Types of probes

### Guest Agent probe

For cloud services only. Azure Load Balancer utilizes the Guest Agent inside the virtual machine, listens and responds with an HTTP 200 OK response only when the instance is in the Ready state (ie. The instance is not in the Busy, Recycling, Stopping, etc states). 

Check out [configuring the service definition file (csdef) for health probes](https://msdn.microsoft.com/library/azure/jj151530.asp) or [get started creating an internet facing load balancer for cloud services](load-balancer-get-started-internet-classic-cloud.md#check-load-balancer-health-status-for-cloud-services) for more information. 
 
### What would make a guest agent probe to mark an instance as unhealthy?

If the Guest Agent fails to respond with HTTP 200 OK, the Azure Load Balancer marks the instance as unresponsive and stops sending traffic to that instance. The Azure Load Balancer will continue to ping the instance, and if the Guest Agent responds with an HTTP 200, the Azure Load Balancer will send traffic to that instance again.

When you use a web role, the web site code typically runs in w3wp.exe, which is not monitored by the Azure fabric or guest agent,  so failures in w3wp.exe (eg. HTTP 500 responses) will not be reported to the guest agent, and the load balancer will not know to take that instance out of rotation.


### HTTP custom probe

The custom HTTP load balancer probe overrides the default guest agent probe and allows you to create your own custom logic to determine the health of the role instance. The load balancer probes your endpoint (every 15 seconds, by default) and the instance is considered in the load balancer rotation if it responds with a HTTP 200 within the timeout period (default of 31 seconds). This can be useful to implement your own logic to remove instances from load balancer rotation, for example, returning a non-200 status if the instance is above 90% CPU. For web roles using w3wp.exe, this also means you get automatic monitoring of your website since failures in your website code will return a non-200 status to the load balancer probe. 

>[AZURE.NOTE] HTTP custom probe supports relative paths and HTTP protocol only. HTTPS is not supported.


### What would make an HTTP custom probe mark an instance as unhealthy? 

- The HTTP application returns an HTTP response code other than 200 (i.e. 403, 404, 500, etc.). This is a positive acknowledgment that the application instance wants to be taken out of service right away.

-  In the event the HTTP server does not respond at all after the timeout period. Note that depending on timeout value set, this might mean multiple probe requests go unanswered before marking probe as down (i.e. SuccessFailCount probes are sent).
- 	When the server closes the connection via a TCP reset.

### TCP custom probe

TCP probes are initiating a connection by performing a three-way  handshake to the defined port. 

### What would make a TCP custom probe mark an instance as unhealthy?

- In the event the TCP server does not respond at all after the timeout period. It will depend on the number of failed probe requests, which were configured to go unanswered before marking probe as down.
- 	It receives a TCP reset from the role instance.

Check out [get started creating an Internet facing load balancer for resource manager](load-balancer-get-started-internet-arm-ps.md#create-lb-rules-nat-rules-a-probe-and-a-load-balancer) to understand how to configure an HTTP health probe or TCP probe.

## Adding healthy instances back to the load balancer

TCP and HTTP probes are considered healthy and mark the role instance as healthy when:

- Upon the first time the VM boots and the LB gets a positive probe.
- The number SuccessFailCount (see above) is defining the value of successful probes required to mark the role instance as healthy. If a role instance was removed, SuccessFailCount in a row successful probes are required to mark role instance as UP.

>[AZURE.NOTE] If the health of a role instance is fluctuating, the Azure Load balancer is waiting longer before putting the role instance back in the healthy state. This is done via policy to protect the user and the infrastructure.

## Log analytics for load balancer

You can use [log analytics for load balancer](load-balancer-monitor-log.md) to check for probe health status and probe count. Logging can be used with Power BI or Operation Insights to provide statistics of the load balancer health status.
 


