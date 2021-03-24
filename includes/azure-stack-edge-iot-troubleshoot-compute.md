---
author: v-dalc
ms.service: databox
ms.author: alkohli
ms.topic: include
ms.date: 03/23/2021
---

Use the IoT Edge agent runtime responses to troubleshoot compute-related errors. Here is a list of possible responses:

* 200 - OK
* 400 - The deployment configuration is malformed or invalid.
* 417 - The device doesn't have a deployment configuration set.
* 412 - The schema version in the deployment configuration is invalid.
* 406 - The IoT Edge device is offline or not sending status reports.
* 500 - An error occurred in the IoT Edge runtime.

For more information, see [IoT Edge Agent](../articles/iot-edge/iot-edge-runtime.md?preserve-view=true&view=iotedge-2018-06#iot-edge-agent).

The following error is related to the IoT Edge service on your Azure Stack Edge Pro device.

### Compute modules have Unknown status and can't be used

#### Error description

All modules on the device show Unknown status and can't be used. The Unknown status persists through a reboot.<!--Original Support ticket relates to trying to deploy a container app on a Hub. Based on the work item, I assume the error description should not be that specific, and that the error applies to Azure Stack Edge Devices, which is the focus of this troubleshooting.-->

#### Suggested solution

Delete the IoT Edge service, and then redeploy the module(s). For more information, see [Remove IoT Edge service](../articles/databox-online/azure-stack-edge-j-series-manage-compute.md#remove-iot-edge-service).


### Modules show as running but are not working

#### Error description

The runtime status of module shows as running but the expected outcomes are not seen. 

This condition could be because of an issue with module route configuration that is not working or `edgehub` is not routing messages as expected. You can check the `edgehub` logs. If you see that there are errors such as failing to connect to the IoT Hub service, then the most common reason is the connectivity issues. The connectivity issues could be because the AMPQ port that is used as a default port by IoT Hub service for communication is blocked or the web proxy server is blocking these messages.

#### Suggested solution

Take the following steps:
1. To resolve the error, go to the IoT Hub resource for your device and then select your Edge device. 
1. Go to **Set modules > Runtime settings**. 
1. Add the `Upstream protocol` environment variable and assign it a value of `AMQPWS`. The messages configured in this case are sent over WebSockets via port 443.

### Modules show as running but do not have an IP assigned

#### Error description

The runtime status of module shows as running but the containerized app does not have an IP assigned. 

This condition is because the range of IPs that you have provided for Kubernetes external service IPs is not sufficient. You need to extend this range to ensure that each container or VM that you deployed are covered.

#### Suggested solution

In the local web UI of your device, do the following steps:
1. Go to the **Compute** page. Select the port for which you enabled the compute network. 
1. Enter a static, contiguous range of IPs for **Kubernetes external service IPs**. You need 1 IP for `edgehub` service. Additionally, you need one IP for each IoT Edge module and for each VM you'll deploy. 
1. Select **Apply**. The changed IP range should take effect immediately.

For more information, see [Change external service IPs for containers](../articles/databox-online/azure-stack-edge-j-series-manage-compute.md#change-external-service-ips-for-containers).

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

By default, the IoT service type is of type load balancer and assigned externally facing IP addresses. You may not want an external-facing IP address for your application. You may need to expose the pods within the KUbernetes cluster for access as other pods and not as an externally exposed load balancer service. 

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
