---
title: Troubleshoot load balancer health event logs
titleSuffix: Azure Load Balancer
description: Learn how to troubleshoot load balancer health event log types.
author: mbender-ms
ms.service: load-balancer
ms.topic: troubleshooting
ms.date: 05/24/2024
ms.author: mbender
ms.custom: references_regions
---

# Troubleshoot load balancer health event logs

In this article, you learn how to troubleshoot common health event logs for Azure Load Balancer. It covers many common health event logs that you can encounter when using Azure Load Balancer.

## DataPathAvailabilityWarning event

The Data Path Availability metric of your load balancer dropped below 90% due to potential platform issues. This event can also be caused by reaching other Azure platform limits.

### Sample event

```plaintext
Warning - DataPathAvailabilityWarning: The data path availability for frontend IP 20.29.152.178 is below 90% on the following ports: 80. To mitigate this issue, please refer to aka.ms/lbhealth for more detailed event definitions and troubleshooting guidance.
```

### Troubleshooting steps
1. Confirm at least one backend instance is responding to the health probe configured to the associated load balancing rule.  The rule includes the frontend IP, protocol, and port provided in the event description.
   1. If yes, go to next step for Azure status.
   2. If no, refer to [Troubleshoot Azure Load Balancer health probe status](load-balancer-troubleshoot-health-probe-status.md) | for more detailed troubleshooting steps.
1. Visit [Azure status](https://azure.status.microsoft/en-us/status) to identify if there are any known Azure platform or infrastructure issue that can be affecting your load balancer resource.
2. Reach out to Azure support for further investigation if you're observing these events in your logs and you're experiencing ongoing connectivity issues.

## DataPathAvailabilityCritical event

The DataPathAvailability metric of your load balancer dropped below 25% due to potential platform issues. This event can also be caused by reaching other Azure platform limits.

### Sample event
    
```plaintext
    Critical - DataPathAvailabilityCritical: The data path availability for frontend IP {FrontendIPAddress} is below 25% on the following ports: {LoadBalancingRulePorts}. To mitigate this issue, please refer to aka.ms/lbhealth for more detailed event definitions and troubleshooting guidance.
```

### Troubleshooting steps

1. Confirm at least one backend instance is responding to the health probe configured to the associated load balancing rule. The rule includes the frontend IP, protocol, and port provided in the event description.
   1. If yes, go to next step for Azure status.
   2. If no, refer to Troubleshoot Azure Load Balancer health probe status | Microsoft Learn for more detailed troubleshooting steps.
2.	Visit Azure status to identify if there are any known Azure platform or infrastructure issue that can be affecting your load balancer resource. 
3.	Reach out to Azure support for further investigation if you're observing these events in your logs and you're experiencing ongoing connectivity issues.

## NoHealthyBackends event
The backend instances of your load balancer aren't responding to health probes. The misconfiguration of the load balancer or the backend instances can cause this event. Common reasons include:
- A firewall or network security group rules are blocking the health probe IP or ports.
- The application isn't listening on the configured health probe port or the health probe is configured to the wrong port.
- An HTTP health probe is configured but the application isn't responding with 200 OK status code.

### Sample event

```plaintext
Critical - NoHealthyBackends: the frontend IP {FrontendIPAddress} is completely unreachable because all backend instances configured to the following protocol:port {Protocol:Port, Protocol:Port,...} are not responding to health probes. Please review the associated health probe configuration(s) and ensure that at least one of the backend instances are responding to the health probes on the configured ports. To mitigate this issue, please refer to aka.ms/lbhealth for more detailed event definitions and troubleshooting guidance.
```

### Troubleshooting steps
Refer to [Troubleshoot Azure Load Balancer health probe status](load-balancer-troubleshoot-health-probe-status.md) | for common reasons why your backend instances aren't responding to the configured health probes.

## HighSnatPortUsage event
This event indicates you're approaching SNAT port exhaustion on specific backend instances. You want to review your outbound connectivity architecture.

### Sample event

```plaintext
Warning - High SNAT Port Usage: Backend IP {BackendIPAddress} is utilizing more than 75% of SNAT ports allocated from frontend IP {FrontendIPAddress} and is at-risk for SNAT port exhaustion. To reduce the risk of SNAT exhaustion, please refer to aka.ms/lbhealth for more detailed event definitions and troubleshooting guidance.
```
### Troubleshooting steps
- For more information about Azure’s common outbound connectivity options, see [Source Network Address Translation (SNAT) for outbound connections - Azure Load Balancer](./load-balancer-outbound-connections.md).
- For production scenarios, we recommend using NAT Gateway for your outbound connectivity needs. NAT Gateway provides dynamic SNAT allocation, therefore reducing the risk of failed connections due to SNAT port exhaustion. For detailed steps on improving your outbound connectivity architecture, refer to the Troubleshooting steps section under the SnatPortExhaustion event section in this article.

## SnatPortExhaustion event
This event indicates that all allocated SNAT ports are exhausted for one or more backend instances have exhausted. 

### Sample event

```plaintext
Critical - SNATPortExhaustion: Backend IP {BackendIPAddress} has exhausted all SNAT ports allocated to it.  One of the frontend IPs where the backend IP gets SNAT port is {FrontendIPAddress}. To reduce the risk of SNAT exhaustion, please refer to aka.ms/lbhealth for more detailed event definitions and troubleshooting guidance.
```

### Troubleshooting steps

1. To resolve SNAT exhaustion issues, we recommend using NAT Gateway instead. To learn more about how NAT Gateway mitigates the risk of SNAT port exhaustion, see more on [Source Network Address Translation (SNAT) with Azure NAT Gateway](../nat-gateway/nat-gateway-snat.md).
2. If you’re currently using load balancer outbound rules and would like to migrate to using NAT Gateway instead, see [Tutorial: Migrate outbound access to NAT gateway](../nat-gateway/tutorial-migrate-outbound-nat.md).
3. To identify the impacted connections due to SNAT port exhaustion:
    1. In the Azure portal, select your load balancer resource.
    2. On the load balancer **Overview**, select to **Monitoring** > **Metrics** in the left-hand menu.
    3. In the **Metrics** window, select the **metric** of **SNAT Connection Count** and **aggregation** of **Sum**.
    4. Select **Apply splitting** and select the value of **Connection State**.
    5. If the **Connection State** equals **Failed**, this indicates the number of failed connections due to SNAT port exhaustion.
 
### Alternative solutions
1.	Ensure you configured outbound rules via manual port allocation and are allocating the maximum number of ports possible.
2.	Add extra public IPs to your Load Balancer or NAT Gateway.

## Next steps
In this article, you learned how to troubleshoot each Azure Load Balancer health event type.

For more information about Azure Load Balancer health event logs and health event types, or how to collect, analyze, and create alerts using these logs, see:

- [Azure Load Balancer health event logs](load-balancer-health-event-logs.md)
- [Learn to monitor and alert with Azure Load Balancer health event logs](load-balancer-monitor-alert-health-event-logs.md)
