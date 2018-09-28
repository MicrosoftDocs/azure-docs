---
title: "Azure Cloud Services Def. LoadBalancerProbe Schema | Microsoft Docs"
ms.custom: ""
ms.date: "04/14/2015"
services: cloud-services
ms.reviewer: ""
ms.service: "cloud-services"
ms.suite: ""
ms.tgt_pltfrm: ""
ms.topic: "reference"
ms.assetid: 113374a8-8072-4994-9d99-de391a91e6ea
caps.latest.revision: 14
author: "jpconnock"
ms.author: "jeconnoc"
manager: "timlt"
---
# Azure Cloud Services Definition LoadBalancerProbe Schema
The load balancer probe is a customer defined health probe of UDP endpoints and endpoints in role instances. The `LoadBalancerProbe` is not a standalone element; it is combined with the web role or worker role in a service definition file. A `LoadBalancerProbe` can be used by more than one role.

The default extension for the service definition file is .csdef.

## The function of a load balancer probe
The Azure Load Balancer is responsible for routing incoming traffic to your role instances. The load balancer determines which instances can receive traffic by regularly probing each instance in order to determine the health of that instance. The load balancer probes every instance multiple times per minute. There are two different options for providing instance health to the load balancer – the default load balancer probe, or a custom load balancer probe, which is implemented by defining the LoadBalancerProbe in the .csdef file.

The default load balancer probe utilizes the Guest Agent inside the virtual machine, which listens and responds with an HTTP 200 OK response only when the instance is in the Ready state (like when the instance is not in the Busy, Recycling, Stopping, etc. states). If the Guest Agent fails to respond with HTTP 200 OK, the Azure Load Balancer marks the instance as unresponsive and stops sending traffic to that instance. The Azure Load Balancer continues to ping the instance, and if the Guest Agent responds with an HTTP 200, the Azure Load Balancer sends traffic to that instance again. When using a web role your website code typically runs in w3wp.exe which is not monitored by the Azure fabric or guest agent, which means failures in w3wp.exe (eg. HTTP 500 responses) is not be reported to the guest agent and the load balancer does not know to take that instance out of rotation.

The custom load balancer probe overrides the default guest agent probe and allows you to create your own custom logic to determine the health of the role instance. The load balancer regularly probes your endpoint (every 15 seconds, by default) and the instance is be considered in rotation if it responds with a TCP ACK or HTTP 200 within the timeout period (default of 31 seconds). This can be useful to implement your own logic to remove instances from load balancer rotation, for example returning a non-200 status if the instance is above 90% CPU. For web roles using w3wp.exe, this also means you get automatic monitoring of your website, since failures in your website code return a non-200 status to the load balancer probe. If you do not define a LoadBalancerProbe in the .csdef file, then the default load balancer behavior (as previously described) is be used.

If you use a custom load balancer probe, you must ensure that your logic takes into consideration the RoleEnvironment.OnStop method. When using the default load balancer probe, the instance is taken out of rotation prior to OnStop being called, but a custom load balancer probe can continue to return a 200 OK during the OnStop event. If you are using the OnStop event to clean up cache, stop service, or otherwise making changes that can affect the runtime behavior of your service, then you need to ensure that your custom load balancer probe logic removes the instance from rotation.

## Basic service definition schema for a load balancer probe
 The basic format of a service definition file containing a load balancer probe is as follows.

```xml
<ServiceDefinition …>
   <LoadBalancerProbes>
      <LoadBalancerProbe name="<load-balancer-probe-name>" protocol="[http|tcp]" path="<uri-for-checking-health-status-of-vm>" port="<port-number>" intervalInSeconds="<interval-in-seconds>" timeoutInSeconds="<timeout-in-seconds>"/>
   </LoadBalancerProbes>
</ServiceDefinition>
```

## Schema elements
The `LoadBalancerProbes` element of the service definition file includes the following elements:

- [LoadBalancerProbes Element](#LoadBalancerProbes)
- [LoadBalancerProbe Element](#LoadBalancerProbe)

##  <a name="LoadBalancerProbes"></a> LoadBalancerProbes Element
The `LoadBalancerProbes` element describes the collection of load balancer probes. This element is the parent element of the [LoadBalancerProbe Element](#LoadBalancerProbe). 

##  <a name="LoadBalancerProbe"></a> LoadBalancerProbe Element
The `LoadBalancerProbe` element defines the health probe for a model. You can define multiple load balancer probes. 

The following table describes the attributes of the `LoadBalancerProbe` element:

|Attribute|Type|Description|
| ------------------- | -------- | -----------------|
| `name`              | `string` | Required. The name of the load balancer probe. The name must be unique.|
| `protocol`          | `string` | Required. Specifies the protocol of the end point. Possible values are `http` or `tcp`. If `tcp` is specified, a received ACK is required for the probe to be successful. If `http` is specified, a 200 OK response from the specified URI is required for the probe to be successful.|
| `path`              | `string` | The URI used for requesting health status from the VM. `path` is required if `protocol` is set to `http`. Otherwise, it is not allowed.<br /><br /> There is no default value.|
| `port`              | `integer` | Optional. The port for communicating the probe. This is optional for any endpoint, as the same port will then be used for the probe. You can configure a different port for their probing, as well. Possible values range from 1 to 65535, inclusive.<br /><br /> The default value is set by the endpoint.|
| `intervalInSeconds` | `integer` | Optional. The interval, in seconds, for how frequently to probe the endpoint for health status. Typically, the interval is slightly less than half the allocated timeout period (in seconds) which allows two full probes before taking the instance out of rotation.<br /><br /> The default value is 15, the minimum value is 5.|
| `timeoutInSeconds`  | `integer` | Optional. The timeout period, in seconds, applied to the probe where no response will result in stopping further traffic from being delivered to the endpoint. This value allows endpoints to be taken out of rotation faster or slower than the typical times used in Azure (which are the defaults).<br /><br /> The default value is 31, the minimum value is 11.|

## See Also
[Cloud Service (classic) Definition Schema](schema-csdef-file.md)