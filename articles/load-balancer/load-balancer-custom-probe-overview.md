---
title: Use Load Balancer custom probes to monitor health status | Microsoft Docs
description: Learn how to use custom probes for Azure Load Balancer to monitor instances behind Load Balancer
services: load-balancer
documentationcenter: na
author: KumudD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 46b152c5-6a27-4bfc-bea3-05de9ce06a57
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/13/2018
ms.author: kumud
---

# Understand Load Balancer probes

Azure Load Balancer uses health probes to determine which backend pool instance should receive new flows.   You can use health probes to detect the failure of an application on a backend instance.  You can also use the health probe response from your application to signal to Load Balancer whether to continue to send new flows or stop sending new flows to a backend instance to manage load or planned downtime.

Health probes govern whether new flows are established to healthy backend instances. When a health probe fails, Load Balancer stops sending new flows to the respective unhealthy instance.  Established TCP connections continue after health probe failure.  Existing UDP flows will move the from the unhealthy instance to another instance in the backend pool.

If all probes for a backend pool fail, Basic Load Balancers will terminate all exisiting TCP flows to the backend pool whereas Standard Load balancer will permit established TCP flows to continue; no new flows will be sent to the backend pool.  All existing UDP flows will terminate for Basic and Standard Load Balancers when all probes for a backend pool fail.

Cloud service roles (worker roles and web roles) use a guest agent for probe monitoring. TCP or HTTP custom health probes must be configured when you use Cloud Services with IaaS VMs behind Load Balancer.

## Understand probe count and timeout

Probe behavior depends on:

* The number of successful probes that allow an instance to be labeled as up.
* The number of failed probes that cause an instance to be labeled as down.

The timeout and frequency values set in SuccessFailCount determine whether an instance is confirmed to be running or not running. In the Azure portal, the timeout is set to two times the value of the frequency.

The probe configuration of all load-balanced instances for an endpoint (that is, a load-balanced set) must be the same. You can't have a different probe configuration for each role instance or VM in the same hosted service for a particular endpoint combination. For example, each instance must have identical local ports and timeouts.

> [!IMPORTANT]
> A load balancer probe uses the IP address 168.63.129.16. This public IP address facilitates communication to internal platform resources for the bring-your-own-IP Azure Virtual Network scenario. The virtual public IP address 168.63.129.16 is used in all regions, and it doesn't change. We recommend that you allow this IP address in any local firewall policies. It should not be considered a security risk because only the internal Azure platform can source a message from that address. If you don't allow this IP address in your firewall policies, unexpected behavior occurs in a variety of scenarios. The behavior includes configuring the same IP address range of 168.63.129.16 and duplicating IP addresses.

## Learn about the types of probes

### Guest agent probe

A guest agent probe is available for Azure Cloud Services only. Load Balancer utilizes the guest agent inside the VM. It then listens and responds with an HTTP 200 OK response only when the instance is in the Ready state. (Other states are Busy, Recycling, or Stopping.)

For more information, see [Configure the service definition file (csdef) for health probes](https://msdn.microsoft.com/library/azure/ee758710.aspx) or [Get started by creating a public load balancer for cloud services](load-balancer-get-started-internet-classic-cloud.md#check-load-balancer-health-status-for-cloud-services).

### What makes a guest agent probe mark an instance as unhealthy?

If the guest agent fails to respond with HTTP 200 OK, the load balancer marks the instance as unresponsive. It then stops sending traffic to that instance. The load balancer continues to ping the instance. If the guest agent responds with an HTTP 200, the load balancer sends traffic to that instance again.

When you use a web role, the website code typically runs in w3wp.exe, which isn't monitored by the Azure fabric or guest agent. Failures in w3wp.exe (for example, HTTP 500 responses) aren't reported to the guest agent. Consequently, the load balancer doesn't take that instance out of rotation.

### HTTP custom probe

The HTTP custom probe overrides the default guest agent probe. You can create your own custom logic to determine the health of the role instance. The load balancer probes your endpoint every 15 seconds, by default. The instance is considered to be in the load balancer rotation if it responds with an HTTP 200 within the timeout period. The timeout period is 31 seconds by default.

An HTTP custom probe can be useful if you want to implement your own logic to remove instances from load balancer rotation. For example, you might decide to remove an instance if it's above 90% CPU and returns a non-200 status. If you have web roles that use w3wp.exe, you also get automatic monitoring of your website. Failures in your website code return a non-200 status to the load balancer probe.

> [!NOTE]
> The HTTP custom probe supports relative paths and HTTP protocol only. HTTPS isn't supported.

### What makes an HTTP custom probe mark an instance as unhealthy?

* The HTTP application returns an HTTP response code other than 200 (for example, 403, 404, or 500). This positive acknowledgment alerts you to take the application instance out of service right away.
* The HTTP server doesn't respond at all after the timeout period. Depending on the timeout value that is set, multiple probe requests might go unanswered before the probe gets marked as not running (that is, before SuccessFailCount probes are sent).
* The server closes the connection via a TCP reset.

### TCP custom probe

TCP custom probes initiate a connection by performing a three-way handshake with the defined port.

### What makes a TCP custom probe mark an instance as unhealthy?

* The TCP server doesn't respond at all after the timeout period. When the probe is marked as not running depends on the number of failed probe requests that were configured to go unanswered before marking the probe as not running.
* The probe receives a TCP reset from the role instance.

For more information about how to configure an HTTP health probe or a TCP probe, see [Get started creating a public load balancer in Resource Manager by using PowerShell](load-balancer-get-started-internet-arm-ps.md).

## Add healthy instances back into the load balancer rotation

TCP and HTTP probes are considered healthy and mark the role instance as healthy when:

* The load balancer gets a positive probe the first time the VM boots.
* The number for SuccessFailCount (described earlier) defines the value of successful probes that are required to mark the role instance as healthy. If a role instance was removed, the number of successful, successive probes must equal or exceed the value of SuccessFailCount to mark the role instance as running.

> [!NOTE]
> If the health of a role instance fluctuates, the load balancer waits longer before it puts the role instance back in the healthy state. This extra wait time protects the user and the infrastructure and is an intentional policy.

## Use log analytics for a load balancer

You can use [log analytics](load-balancer-monitor-log.md) to check on the load balancer probe health status and probe count. Logging can be used with Power BI or Azure Operational Insights to provide statistics about load balancer health status.
