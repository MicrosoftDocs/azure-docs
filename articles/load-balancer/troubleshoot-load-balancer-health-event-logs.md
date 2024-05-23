---
title: Troubleshoot load balancer health event logs
titleSuffix: Azure Load Balancer
description: 
author: mbender-ms
ms.service: load-balancer
ms.topic: troubleshooting
ms.date: 05/21/2024
ms.author: mbender
---

# Troubleshoot load balancer health event logs

In this article, you'll learn how to troubleshoot common health event logs for Azure Load Balancer. It covers the a number of common health event logs that you may encounter when using Azure Load Balancer.

## DataPathAvailabilityWarning event

The Data Path Availability metric of your load balancer has dropped below 90% due to potential platform issues. This can also be caused by reaching other Azure platform limits.

### Sample event

```plaintext
Warning - DataPathAvailabilityWarning: The data path availability for frontend IP 20.29.152.178 is below 90% on the following ports: 80. To mitigate this issue, please refer to aka.ms/lbhealth for more detailed event definitions and troubleshooting guidance.
```

### Troubleshooting steps
1. Confirm at least 1 backend instance is responding to the health probe configured to the associated load balancing rule (note: the rule is indicated by the frontend IP, protocol, and port provided in the event description).
   1. If yes, go to next step for Azure status.
   2. If no, please refer to [Troubleshoot Azure Load Balancer health probe status](load-balancer-troubleshoot-health-probe-status.md) | for more detailed troubleshooting steps
1. Please visit [Azure status](https://azure.status.microsoft/en-us/status) to identify if there are any known Azure platform or infrastructure issue that may be affecting your load balancer resource. 
1. If you are observing these events in your logs, and you are experiencing ongoing connectivity issues, please reach out to Azure support for further investigation.

## DataPathAvailabilityCritical event

The DataPathAvailability metric of your load balancer has dropped below 25% due to potential platform issues. This can also be caused by reaching other Azure platform limits.

### Sample event
    
```plaintext
    Critical - DataPathAvailabilityCritical: The data path availability for frontend IP {FrontendIPAddress} is below 25% on the following ports: {LoadBalancingRulePorts}. To mitigate this issue, please refer to aka.ms/lbhealth for more detailed event definitions and troubleshooting guidance.
```

### Troubleshooting steps

1. Confirm at least 1 backend instance is responding to the health probe configured to the associated load balancing rule (note: the rule is indicated by the frontend IP, protocol, and port provided in the event description)
   1. If yes, go to next step for Azure status.
   2. If no, please refer to Troubleshoot Azure Load Balancer health probe status | Microsoft Learn for more detailed troubleshooting steps
2.	Please visit Azure status to identify if there are any known Azure platform or infrastructure issue that may be affecting your load balancer resource. 
3.	If you are observing these events in your logs, and you are experiencing ongoing connectivity issues, please reach out to Azure support for further investigation.

## NoHealthyBackends event
The backend instances of your load balancer is not responding to health probes. This is typically caused by misconfiguration of the load balancer or the backend instances. Common reasons include:
- A firewall or NSG rules are blocking the health probe IP or port(s).
- The application is not listening on the configured health probe port or the health probe is configured to the wrong port.
- An HTTP health probe is configured but the application is not responding with 200 OK status code.

### Sample event

```plaintext
Critical - NoHealthyBackends: the frontend IP {FrontendIPAddress} is completely unreachable because all backend instances configured to the following protocol:port {Protocol:Port, Protocol:Port,...} are not responding to health probes. Please review the associated health probe configuration(s) and ensure that at least one of the backend instances are responding to the health probes on the configured ports. To mitigate this issue, please refer to aka.ms/lbhealth for more detailed event definitions and troubleshooting guidance.
```

### Troubleshooting steps
1. Refer to [Troubleshoot Azure Load Balancer health probe status](load-balancer-troubleshoot-health-probe-status.md) | for common reasons why your backend instances may not be responding to the configured health probes.

## HighSnatPortUsage event
This event indicates you are approaching SNAT port exhaustion on specific backend instances. You may need to review your outbound connectivity architecture. 

### Sample event

```plaintext
Warning - High SNAT Port Usage: Backend IP {BackendIPAddress} is utilizing more than 75% of SNAT ports allocated from frontend IP {FrontendIPAddress} and is at-risk for SNAT port exhaustion. To reduce the risk of SNAT exhaustion, please refer to aka.ms/lbhealth for more detailed event definitions and troubleshooting guidance.
```
### Troubleshooting steps
1. For more information about Azure’s common outbound connectivity options, see [Source Network Address Translation (SNAT) for outbound connections - Azure Load Balancer](.).
2. For production scenarios, we recommend leveraging NAT Gateway for your outbound connectivity needs. NAT Gateway provides dynamic SNAT allocation, therefore reducing the risk of failed connections due to SNAT port exhaustion. For detailed steps on improving your outbound connectivity architecture, refer to the Troubleshooting steps section under the SnatPortExhaustion event section in this article.

## SnatPortExhaustion event
This event indicates that one or more backend instances have exhausted all allocated SNAT ports.

### Sample event

```plaintext
Critical - SNATPortExhaustion: Backend IP {BackendIPAddress} has exhausted all SNAT ports allocated to it.  One of the frontend IPs where the backend IP gets SNAT port is {FrontendIPAddress}. To reduce the risk of SNAT exhaustion, please refer to aka.ms/lbhealth for more detailed event definitions and troubleshooting guidance.
```

### Troubleshooting steps

1. To resolve SNAT exhaustion issues, we recommend leveraging NAT Gateway instead. To learn more about how NAT Gateway mitigates the risk of SNAT port exhaustion, see more on [Source Network Address Translation (SNAT) with Azure NAT Gateway](https://docs.microsoft.com/learn/modules/source-network-address-translation-snat-azure-nat-gateway/).
2. If you’re currently leveraging load balancer outbound rules and would like to migrate to using NAT Gateway instead, see [Tutorial: Migrate outbound access to NAT gateway](https://docs.microsoft.com/learn/modules/migrate-outbound-access-nat-gateway/).
3. To identify the impact connections due to SNAT port exhaustion:
    1. Go to Monitoring > Metrics
    2. Select the metric SNAT Connection Count with aggregation Sum
    3. Select Apply splitting with the value Connection State
    4. Connection State = Failed indicates the number of failed connections due to SNAT port exhaustion.
 
### Alternative solutions
1.	Ensure you have configured outbound rules via manual port allocation and are allocating the maximum number of ports possible
2.	Add additional public IPs to your Load Balancer or NAT Gateway

## Next steps
In this article, you learned how to troubleshoot each Azure Load Balancer health event types.

For more information about Azure Load Balancer health event logs and health event types, or how to collect, analyze, and create alerts using these logs, see:

> [!div class="nextstepaction"]
> [> [!div class="nextstepaction"]
> [Azure Load Balancer health event logs](/load-balancer-health-event-logs.md)
> [Learn to monitor and alert with Azure Load Balancer health event logs](monitor-alert-load-balancer-health-event-logs.md)
