<properties
   pageTitle="Load Balancer custom probes and monitoring health status | Microsoft Azure"
   description="Learn how to use custom probes for Azure Load Balancer to monitor instances behind Load Balancer"
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
   ms.date="04/05/2016"
   ms.author="joaoma" />


# Load Balancer probes

Azure Load Balancer offers the capability to monitor the health of server instances by using probes. When a probe fails to respond, Load Balancer stops sending new connections to the unhealthy instance. The existing connections are not affected, and new connections are sent to healthy instances.

TCP or HTTP custom probes must be configured when you use virtual machines behind Load Balancer. Cloud service roles (worker roles and web roles) are the only server instances with guest agent probe monitoring.

## Understand probe count and timeout

Probe behavior depends on:
- The number of successful probes that allow an instance to be labeled as running.
- The number of failed probes that cause an instance to be labeled as not running.

The timeout and frequency value set in  SuccessFailCount determine whether an instance is determined to be running or not running. In the Azure portal, the timeout is set to two times the value of the frequency.

The probe configuration of all load-balanced instances for an endpoint (that is, a load-balanced set) must be the same. This means you cannot have a different probe configuration for each role instance or virtual machine in the same hosted service for a particular endpoint combination. For example, each instance must have identical local ports and timeouts.


>[AZURE.IMPORTANT] A Load Balancer probe uses the IP address 168.63.129.16. This public IP address facilitates communication to internal platform resources for the bring-your-own-IP Azure Virtual Network scenario. The virtual public IP address 168.63.129.16 is used in all regions and will not change. We recommend that you allow this IP address in any local firewall policies. It should not be considered a security risk because only the internal Azure platform can source a message from that address. If you do not do this, there will be unexpected behavior in a variety of scenarios like configuring the same IP address range of 168.63.129.16 and having duplicated IP addresses.   


## Learn about the types of probes

### Guest agent probe

This probe is available for Azure Cloud Services only. Load Balancer utilizes the guest agent inside the virtual machine, and then listens and responds with an HTTP 200 OK response only when the instance is in the Ready state (that is, not in another state such as Busy, Recycling, or Stopping).

For more information, see [Configuring the service definition file (csdef) for health probes](https://msdn.microsoft.com/library/azure/jj151530.asp) or [Get started creating an Internet-facing load balancer for cloud services](load-balancer-get-started-internet-classic-cloud.md#check-load-balancer-health-status-for-cloud-services).

### What makes a guest agent probe mark an instance as unhealthy?

If the guest agent fails to respond with HTTP 200 OK, the Load Balancer marks the instance as unresponsive and stops sending traffic to that instance. Load Balancer continues to ping the instance. If the guest agent responds with an HTTP 200, Load Balancer sends traffic to that instance again.

When you use a web role, the website code typically runs in w3wp.exe, which is not monitored by the Azure fabric or guest agent. This means that failures in w3wp.exe (for example, HTTP 500 responses) will not be reported to the guest agent, and Load Balancer will not take that instance out of rotation.


### HTTP custom probe

The custom HTTP Load Balancer probe overrides the default guest agent probe, which means that you can create your own custom logic to determine the health of the role instance. Load Balancer probes your endpoint every 15 seconds, by default. The instance is considered to be in the Load Balancer rotation if it responds with an HTTP 200 within the timeout period (31 seconds by default).

This can be useful if you want to implement your own logic to remove instances from Load Balancer rotation. For example, you could decide to remove an instance if it is above 90% CPU and returns a non-200 status. If you have web roles that use w3wp.exe, this also means you get automatic monitoring of your website, because failures in your website code will return a non-200 status to the Load Balancer probe.

>[AZURE.NOTE] The HTTP custom probe supports relative paths and HTTP protocol only. HTTPS is not supported.


### What makes an HTTP custom probe mark an instance as unhealthy?

- The HTTP application returns an HTTP response code other than 200 (for example, 403, 404, or 500). This is a positive acknowledgment that the application instance should be taken out of service right away.

-  The HTTP server does not respond at all after the timeout period. Depending on the timeout value that is set, this might mean that multiple probe requests go unanswered before the probe gets marked as not running (that is, before SuccessFailCount probes are sent).
- 	The server closes the connection via a TCP reset.

### TCP custom probe

TCP probes initiate a connection by performing a three-way handshake with the defined port.

### What makes a TCP custom probe mark an instance as unhealthy?

- The TCP server does not respond at all after the timeout period. When the probe is marked as not running depends on the number of failed probe requests that were configured to go unanswered before marking the probe as not running.
- 	The probe receives a TCP reset from the role instance.

For more information about configuring an HTTP health probe or a TCP probe, see [Get started creating an Internet-facing load balancer in Resource Manager using PowerShell](load-balancer-get-started-internet-arm-ps.md#create-lb-rules-nat-rules-a-probe-and-a-load-balancer).

## Add healthy instances back to Load Balancer

TCP and HTTP probes are considered healthy and mark the role instance as healthy when:

-  Load Balancer gets a positive probe the first time the VM boots.
- The number SuccessFailCount (described earlier) defines the value of successful probes that are required to mark the role instance as healthy. If a role instance was removed, the number of successful, successive probes must equal or exceed the value of SuccessFailCount to mark the role instance as running.

>[AZURE.NOTE] If the health of a role instance is fluctuating, Load Balancer waits longer before putting the role instance back in the healthy state. This is done via policy to protect the user and the infrastructure.

## Use log analytics for Load Balancer

You can use [log analytics for Load Balancer](load-balancer-monitor-log.md) to check on the probe health status and probe count. Logging can be used with Power BI or Azure Operational Insights to provide statistics about Load Balancer health status.
