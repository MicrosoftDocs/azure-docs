---
author: v-dalc
ms.service: databox
ms.author: alkohli
ms.topic: include
ms.date: 04/06/2022
---

### Compute modules have Unknown status and can't be used

#### Error description

All modules on the device show Unknown status and can't be used. The Unknown status persists through a reboot.<!--Original Support ticket relates to trying to deploy a container app on a Hub. Based on the work item, I assume the error description should not be that specific, and that the error applies to Azure Stack Edge Devices, which is the focus of this troubleshooting.-->

#### Suggested solution

Delete the IoT Edge service, and then redeploy the module(s). For more information, see [Remove IoT Edge service](../articles/databox-online/azure-stack-edge-gpu-manage-compute.md#remove-iot-edge-service).


### Modules show as running but aren't working

#### Error description

The runtime status of the module shows as running, but you don't see the expected outcomes. 

This condition may be caused by a module route configuration that's not working, or `edgehub` may not be routing messages as expected. You can check the `edgehub` logs. If you see errors such as failing to connect to the IoT Hub service, then the most common reason is the connectivity issues. The connectivity issues could occur because the AMPQ port that the IoT Hub service is using as a default port for communication is blocked or the web proxy server is blocking these messages.

#### Suggested solution

Take the following steps:
1. To resolve the error, go to the IoT Hub resource for your device and then select your Edge device. 
1. Go to **Set modules > Runtime settings**. 
1. Add the `Upstream protocol` environment variable and assign it a value of `AMQPWS`. The messages configured in this case are sent over WebSockets via port 443.

### Modules show as running but don't have an IP assigned

#### Error description

The runtime status of the module shows as running, but the containerized app doesn't have an IP address assigned. 

This condition happens because the range of IPs you provided for Kubernetes external service IPs isn't sufficient. Extend this range to ensure that each container or VM that you deployed is covered.

#### Suggested solution

In the local web UI of your device, do the following steps:
1. Go to the **Compute** page. Select the port for which you enabled the compute network. 
1. Enter a static, contiguous range of IPs for **Kubernetes external service IPs**. You need one IP for `edgehub` service. Additionally, you need one IP for each IoT Edge module and for each VM you'll deploy. 
1. Select **Apply**. The changed IP range should take effect immediately.

For more information, see [Change external service IPs for containers](../articles/databox-online/azure-stack-edge-gpu-manage-compute.md#change-external-service-ips-for-containers).

### Configure static IPs for IoT Edge modules

#### Problem description

Kubernetes assigns dynamic IPs to each IoT Edge module on your Azure Stack Edge Pro GPU device. A method is needed to configure static IPs for the modules.

#### Suggested solution

You can specify fixed IP addresses for your IoT Edge modules via the K8s-experimental section as described below: 

```yaml
{
  "k8s-experimental": {
    "serviceOptions" : {
      "loadBalancerIP" : "100.23.201.78",
      "type" : "LoadBalancer"
    }
  }
}
```
### Expose Kubernetes service as cluster IP service for internal communication

#### Problem description

By default, the IoT service type is **load balancer**, and the service is assigned externally facing IP addresses. If an application needs Kubernetes pods within the Kubernetes cluster to access other pods in the cluster, you may need to configure the service as a cluster IP service instead of a load balancer service. For more information, see [Kubernetes networking on your Azure Stack Edge Pro GPU device](../articles/databox-online/azure-stack-edge-gpu-kubernetes-networking.md).

#### Suggested solution

You can use the create options via the K8s-experimental section. The following service option should work with port bindings.

```yaml
{
"k8s-experimental": {
  "serviceOptions" : {
    "type" : "ClusterIP"
    }
  }
}
```
### Not able to create or update IoT role

#### Problem description

When configuring the IoT device during setup, you may see the following error: 

>*(Http status code: 400) Could not create or update IoT role on \<YourDeviceName>\. An error occurred with the error code {NO_PARAM}. For more information, refer to the error code details (https://aka.ms/dbe-error-codes). If the error persists, contact Microsoft Support*.

#### Suggested solution

If your datacenter firewall is restricting or filtering traffic based on source IPs or MAC addresses, make sure that the compute IPs (Kubernetes node IPs) and MAC addresses are on the allowed list. The MAC addresses can be specified by running the `Set-HcsMacAddressPool` cmdlet on the PowerShell interface of the device.