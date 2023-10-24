---
title: Autodetect OPC UA assets
description: How to autodetect OPC UA assets by using Azure IoT OPC UA Broker Preview
author: timlt
ms.author: timlt
# ms.subservice: opcua-broker
ms.topic: how-to 
ms.date: 10/24/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to to autodetect assets in my  
# industrial edge environment so that I can reduce manual configuration overhead. 
---

# Autodetect OPC UA assets

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to autodetect OPC UA assets by using Akri together with OPC UA Broker Preview. 

## Features supported

The following features are supported to autodetect OPC UA assets:

| Feature                                                                                                                                                                                          | Supported  | Symbol     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | :-------:  |
| Connect using lowest security profile                                                                                                                                                            | Supported  |     ✅     |
| Accept and trust all OPC UA Server certificates                                                                                                                                                  | Supported  |     ✅     |
| Use self-signed OPC UA Client certificate                                                                                                                                                        | Supported  |     ✅     |
| Asset detection defined in the [Asset Management Basics specification](http://reference.opcfoundation.org/AMB/v101/docs/)                                                                        | Supported  |     ✅     |
| Detection of Assets and automatic configuration of OPC UA nodes as telemetry for detected assets [OPC UA Devices specification](https://reference.opcfoundation.org/DI/v104/docs/)               | Supported  |     ✅     |
| Detection of Assets and automatic configuration of OPC UA events as telemetry for detected assets [DeviceHealth Interface specification](https://reference.opcfoundation.org/DI/v104/docs/4.5.4) | Supported  |     ✅     |

## Detect and create assets
Akri uses OPC UA asset detection to generate `AssetType` and `Asset` custom resources.  These custom resources are used for [OPC UA Device Integration (DI) specification](https://reference.opcfoundation.org/DI/v104/docs/) compliant assets in the address space of an OPC UA server.

### Install Akri

To use asset detection, first install [Akri](https://github.com/project-akri/akri). For more information on installing Akri, see the [Using Akri](https://docs.akri.sh/user-guide/getting-started) documentation.

You can install Akri as shown in the following code:

# [bash](#tab/bash)

```bash
helm repo add akri-helm-charts https://project-akri.github.io/akri/
helm upgrade -i akri akri-helm-charts/akri -n akri --create-namespace --set kubernetesDistro=k8s
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm repo add akri-helm-charts https://project-akri.github.io/akri/
helm upgrade -i akri akri-helm-charts/akri -n akri --create-namespace --set kubernetesDistro=k8s
```
---

After you install Akri, install the Akri pods `agent` and `controller`, and run them in the `akri` namespace. To verify a successful installation, run the following command:

# [bash](#tab/bash)

```bash
kubectl get -o wide -n akri pods
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
kubectl get -o wide -n akri pods
```
---

The output of the command shows the Akri pods running:

```console
NAME                                          READY   STATUS    RESTARTS          AGE    IP          NODE             NOMINATED NODE   READINESS GATES
akri-agent-daemonset-jrx9t                    1/1     Running   124 (3m18s ago)   2d3h   10.1.0.87   docker-desktop   <none>           <none>
akri-controller-deployment-57c5dc7dc5-b5qjg   1/1     Running   124 (3m56s ago)   2d3h   10.1.0.86   docker-desktop   <none>           <none>
```

The Akri agent and controller should be visible are ready to start a discovery handler.

### Deploy a discovery handler

To deploy the custom OPC UA discovery handler with asset detection, use the following custom resource YAML file to specify the discovery URL of the OPC UA Server. The current version of the discovery handler only supports no security `UseSecurity=false` and requires `autoAcceptUntrustedCertificates=true`. The specified server contains a sample address model that uses the Robotics companion specification, which is based on the DI specification.  This sample address model is required for asset detection. The Robot contains five assets with observable variables and a `DeviceHealth` node that is automatically detected for monitoring. You can specify other servers by providing the `endpointUrl` and ensuring that a security `None` profile is enabled.

```yml
kubernetesDistro: k8s

# https://docs.akri.sh/development/handler-development
custom:
  configuration:
    enabled: true
    name: akri-opcua-asset
    discoveryHandlerName: opcua-asset
    discoveryDetails: |
      opcuaDiscoveryMethod:
        - asset:
            endpointUrl: "opc.tcp://opcplc-000000.opcuabroker:50000"
            useSecurity: false
            autoAcceptUntrustedCertificates: true

  discovery:
    enabled: true
    name: akri-opcua-asset-discovery
    image:
      repository: {{% oub-registry %}}/opcuabroker/discovery-handler
      tag: latest
      pullPolicy: Always
    useNetworkConnection: true
    port: 80
    resources:
      memoryRequest: 64Mi
      cpuRequest: 10m
      memoryLimit: 512Mi
      cpuLimit: 100m
```

> [!div class="mx-tdBreakAll"]
> | Name                              | Mandatory         | Datatype | Default | Comment                 |
> | --------------------------------- | ----------------- | -------- | ------- | ---------------------   |
> | `EndpointUrl`                     | true              | String   | null    | The OPC UA endpoint URL to use for Asset discovery                                                                                                                                                                                           |
> | `AutoAcceptUntrustedCertificates` | true ¹            | Boolean  | false   | Whether the client auto accepts untrusted certificates. A certificate can only be auto-accepted as trusted if no non-suppressible errors occurred during chain validation. For example, a certificate with incomplete chain is not accepted. |
> | `UseSecurity`                     | true ¹            | Boolean  | true    | Whether the client should use a secure connection                                                                                                                                                                                            |
> | `UserName`                        | false             | String   | null    | The username for user authentication. ²                                                                                                                                                                                           |
> | `Password`                        | false             | String   | null    | The user password for user authentication. ²                                                                                                                                                                                      |

¹ The current version of the discovery handler only supports no security `UseSecurity=false` and requires `autoAcceptUntrustedCertificates=true`.  
² Temporary implementation until Akri can pass K8S secrets.

You can store the YAML file you created previously on your computer as *opcuadiscovery.yaml* and execute the following command to activate the discovery.

# [bash](#tab/bash)

```bash
helm upgrade -i akri akri-helm-charts/akri -n akri -f opcuadiscovery.yaml
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm upgrade -i akri akri-helm-charts/akri -n akri -f opcuadiscovery.yaml
```
---

A successful helm upgrade outputs the following messages:

```console
Release "akri" has been upgraded. Happy Helming!
NAME: akri
LAST DEPLOYED: Thu Mar  2 15:39:15 2023
NAMESPACE: akri
STATUS: deployed
REVISION: 51
TEST SUITE: None
NOTES:
...
```

To check the pods again for the asset discovery container and confirm it's deployed: 

# [bash](#tab/bash)

```bash
kubectl get -o wide -n akri pods
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
kubectl get -o wide -n akri pods
```
---

The output of the command contains the `akri-opcua-asset-discovery` pod that was created: 

```console
NAME                                         READY   STATUS              RESTARTS   AGE     IP          NODE             NOMINATED NODE   READINESS GATES
akri-agent-daemonset-42tdp                   1/1     Running             0          5m37s   10.1.0.92   docker-desktop   <none>           <none>
akri-controller-deployment-d4f7847b6-64zxh   1/1     Running             0          6m8s    10.1.0.91   docker-desktop   <none>           <none>
akri-opcua-asset-discovery-daemonset-5q2ts   0/1     ContainerCreating   0          5s      <none>      docker-desktop   <none>           <none>
```

A log from the `akri-opcua-asset-discovery` pod shows after a few seconds that the discovery handler registered with Akri:

```console
2023-06-07 10:45:27.395 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Akri OPC UA Asset Detection (0.2.0-alpha.203+Branch.main.Sha.cd4045345ad0d148cca4098b68fc7da5b307ce13) is starting with the process id: 1
2023-06-07 10:45:27.695 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Got IP address of the pod from POD_IP environment variable.
2023-06-07 10:45:28.695 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Registered with Akri system with Name opcua-asset for http://10.1.0.92:80 with type: Network as shared: True
2023-06-07 10:45:28.696 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Press CTRL+C to exit
```

After one minute, Akri issues the first discovery request based on the configuration in the custom resource `opcuadiscovery.yaml`.

```console
2023-06-07 12:49:17.344 +00:00 dbug: Grpc.AspNetCore.Server.ServerCallHandler[10]
      => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
      Reading message.
2023-06-07 12:49:18.046 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
      => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
      Got discover request opcuaDiscoveryMethod:
        - asset:
            endpointUrl: "opc.tcp://opcplc-000000.opcuabroker:50000"
            useSecurity: false
            autoAcceptUntrustedCertificates: true
       from ipv6:[::ffff:10.1.7.47]:39708
2023-06-07 12:49:20.238 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
      => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
      Start asset discovery
2023-06-07 12:49:20.242 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
      => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
      Discovering OPC UA endpoint opc.tcp://opcplc-000000.opcuabroker:50000 using Asset Discovery
...
2023-06-07 14:20:03.905 +00:00 info: OpcUa.Common.Dtdl.DtdlGenerator[6901]
      => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
      Created DTDL_2 model for boiler_1 with 35 telemetries in 0 ms
2023-06-07 14:20:04.208 +00:00 info: OpcUa.AssetDiscovery.Akri.CustomResources.CustomResourcesManager[0]
      => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
      Generated 1 asset CRs from discoveryUrl opc.tcp://opcplc-000000.opcuabroker:50000
2023-06-07 14:20:04.208 +00:00 info: OpcUa.Common.Client.OpcUaClient[1005]
      => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
      Session ns=8;i=1828048901 is closing
...
2023-06-07 14:20:05.002 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
      => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
      Sending response to caller ...
2023-06-07 14:20:05.003 +00:00 dbug: Grpc.AspNetCore.Server.ServerCallHandler[15]
      => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
      Sending message.
2023-06-07 14:20:05.004 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
      => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
      Sent successfully

```

After the discovery finishes, the result is sent back to Akri to create the Akri instance custom resource with asset information and observable variables. The discovery handler repeats the discovery every 10 minutes to detect changes on the server.

You can inspect the Akri instance custom resource with an editor in OpenLens, for example, under the CustomResources/akri.sh/Instance.  For example, the following code block shows the JSON encoded result of the asset detection with the information of the observable variables of axis-1:

```json
  "spec": {
    "displayName": "axis_1",
    "description": "",
    "dataPoints": [
        {
            "capabilityId": "dtmi:microsoft:e4i:axis_1:ActualPosition_6020;1",
            "dataSource": "nsu=http://vdma.org/OPCRoboticsTestServer/;i=6020",
            "observabilityMode": "none"
        },
        {
            "capabilityId": "dtmi:microsoft:e4i:axis_1:ActualAcceleration_6022;1",
            "dataSource": "nsu=http://vdma.org/OPCRoboticsTestServer/;i=6022",
            "observabilityMode": "none"
        },
        {
            "capabilityId": "dtmi:microsoft:e4i:axis_1:ActualSpeed_6024;1",
            "dataSource": "nsu=http://vdma.org/OPCRoboticsTestServer/;i=6024",
            "observabilityMode": "none"
        },
        {
            "capabilityId": "dtmi:microsoft:e4i:axis_1:Mass_6050;1",
            "dataSource": "nsu=http://vdma.org/OPCRoboticsTestServer/;i=6050",
            "observabilityMode": "none"
        }
    ],
    "assetEndpointProfileUri": "opc-ua-broker-opcplc-opcuabroker-50000",
    "assetType": "axis-1"
  }
```

The OPC UA Connector supervisor watches for new Akri instance custom resources of type `opc-ua-asset` and generates the initial `AssetType` and `Asset` custom resources for them. You can modify these custom resources to extend publishing for more data points, or to add OPC UA Broker observability settings.

## Next step

In this article, you learned how to autodetect assets by using Akri.  Here's a suggested next step for working with assets:
> [!div class="nextstepaction"]
> [Process telemetry using OPC UA Broker](howto-process-telemetry-using-opcua-broker.md)