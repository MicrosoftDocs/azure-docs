---
title: Use Application Health extension with Azure Virtual Machines
description: Learn how to use the Application Health extension to monitor the health of your applications deployed on Azure virtual machines.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: hilarywang
author: hilaryw29
ms.date: 11/30/2023
---

# Using Application Health extension with Azure Virtual Machines
Monitoring your application health is an important signal for managing your VMs. Azure Virtual Machines provide support for Automatic VM Guest Patching, which rely on health monitoring of the individual instances to safely update your VMs. 

This article describes how you can use the two types of Application Health extension, **Binary Health States** or **Rich Health States**, to monitor the health of your applications deployed on Azure virtual machines.

## Prerequisites

This article assumes that you're familiar with:
-	Azure virtual machine [extensions](../virtual-machines/extensions/overview.md)

> [!CAUTION]
> Application Health Extension expects to receive a consistent probe response at the configured port `tcp` or request path `http/https` in order to label a VM as *Healthy*. If no application is running on the VM, or you're unable to configure a probe response, your VM is going to show up as *Unhealthy*.

## When to use the Application Health extension
Application Health Extension reports on application health from inside the Virtual Machine. The extension probes on a local application endpoint and will update the health status based on TCP/HTTP(S) responses received from the application. This health status is used by Azure to monitor and detect patching failures during [Automatic VM Guest Patching](https://learn.microsoft.com/en-us/azure/virtual-machines/automatic-vm-guest-patching).

## Binary versus Rich Health States

Application Health Extensions has two options available: **Binary Health States** and **Rich Health States**. The following table highlights some key differences between the two options. See the end of this section for general recommendations.

| Features | Binary Health States | Rich Health States |
| -------- | -------------------- | ------------------ |
| Available Health States | Two available states: *Healthy*, *Unhealthy* | Four available states: *Healthy*, *Unhealthy*, *Initializing*, *Unknown*<sup>1</sup> |
| Sending Health Signals | Health signals are sent through HTTP/HTTPS response codes or TCP connections. | Health signals on HTTP/HTTPS protocol are sent through the probe response code and response body. Health signals through TCP protocol remain unchanged from Binary Health States. |
| Identifying *Unhealthy* Instances | Instances will automatically fall into *Unhealthy* state if a *Healthy* signal isn't received from the application. An *Unhealthy* instance can indicate either an issue with the extension configuration (for example, unreachable endpoint) or an issue with the application (for example, non-200 status code). | Instances will only go into an *Unhealthy* state if the application emits an *Unhealthy* probe response. Users are responsible for implementing custom logic to identify and flag instances with *Unhealthy* applications<sup>2</sup>. Instances with incorrect extension settings (for example, unreachable endpoint) or invalid health probe responses will fall under the *Unknown* state<sup>2</sup>. |
| *Initializing* state for newly created instances | *Initializing* state isn't available. Newly created instances may take some time before settling into a steady state. | *Initializing* state allows newly created instances to settle into a steady Health State before surfacing the health state as _Healthy_, _Unhealthy_, or _Unknown_. |
| HTTP/HTTPS protocol | Supported | Supported |
| TCP protocol | Supported | Limited Support – *Unknown* state is unavailable on TCP protocol. See [Rich Health States protocol table](#rich-health-states) for Health State behaviors on TCP. |

<sup>1</sup> The *Unknown* state is unavailable on TCP protocol. 
<sup>2</sup> Only applicable for HTTP/HTTPS protocol. TCP protocol will follow the same process of identifying *Unhealthy* instances as in Binary Health States. 

In general, you should use **Binary Health States** if:
- You're not interested in configuring custom logic to identify and flag an unhealthy instance 
- You don't require an *initializing* grace period for newly created instances

You should use **Rich Health States** if:
- You send health signals through HTTP/HTTPS protocol and can submit health information through the probe response body 
- You would like to use custom logic to identify and mark unhealthy instances 
- You would like to set an *initializing* grace period for newly created instances

## Binary Health States

Binary Health State reporting contains two Health States, *Healthy* and *Unhealthy*. The following tables provide a brief description for how the Health States are configured. 

**HTTP/HTTPS Protocol**

| Protocol | Health State | Description |
| -------- | ------------ | ----------- |
| http/https | Healthy | To send a *Healthy* signal, the application is expected to return a 200 response code. |
| http/https | Unhealthy | The instance will be marked as *Unhealthy* if a 200 response code isn't received from the application. |

**TCP Protocol**

| Protocol | Health State | Description |
| -------- | ------------ | ----------- |
| TCP | Healthy | To send a *Healthy* signal, a successful handshake must be made with the provided application endpoint. |
| TCP | Unhealthy | The instance will be marked as *Unhealthy* if a failed or incomplete handshake occurred with the provided application endpoint. |

Some scenarios that may result in an *Unhealthy* state include: 
- When the application endpoint returns a non-200 status code 
- When there's no application endpoint configured inside the virtual machine to provide application health status 
- When the application endpoint is incorrectly configured 
- When the application endpoint isn't reachable 
