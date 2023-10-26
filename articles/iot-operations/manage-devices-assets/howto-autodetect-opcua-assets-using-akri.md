---
title: Autodetect assets using Azure IoT Akri
description: How to autodetect OPC UA assets by using Azure IoT Akri Preview
author: timlt
ms.author: timlt
# ms.subservice: akri
ms.topic: how-to 
ms.date: 10/26/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to autodetect and create assets in my  
# industrial edge environment so that I can reduce manual configuration overhead. 
---

# Create and detect assets using Azure IoT Akri Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to autodetect OPC UA assets. You deploy a sample OPC PLC server, and configure it to autodetect OPC UA assets by using Azure IoT Akri. The capability to autodetect assets simplifies the process of manually configuring assets from the cloud and onboarding them to your cluster.  

Azure IoT Akri enables you to detect and create `Assets` in the address space of an OPC UA Server. The OPC UA asset detection generates `AssetType` and `Asset` Kubernetes custom resources (CRs) for [OPC UA Device Integration (DI) specification](https://reference.opcfoundation.org/DI/v104/docs/) compliant `Assets`.  

## Prerequisites

- Azure IoT Operations Preview installed. The installation includes Azure IoT Akri. For more information, see [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).
- Optionally, you can install or uninstall Azure IoT Akri individually. For details, see [Install or uninstall Azure IoT Akri Preview](howto-install-akri.md).

## Features supported

The OPC UA client used for asset detection supports several options to connect to an OPC UA Server and detect assets. The following table summarizes supported features:

| Feature                                                                                                                                                                                          | Supported  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------:  |
| Connect using lowest security profile                                                                                                                                                            |     ✅     |
| Accept and trust all OPC UA server certificates                                                                                                                                                  |     ✅     |
| Use self-signed OPC UA client certificate                                                                                                                                                        |     ✅     |
| Asset detection defined in the [Asset Management Basics specification](http://reference.opcfoundation.org/AMB/v101/docs/)                                                                        |     ✅     |
| Detection of assets and automatic configuration of OPC UA nodes as telemetry for detected assets [OPC UA Devices specification](https://reference.opcfoundation.org/DI/v104/docs/)               |     ✅     |
| Detection of assets and automatic configuration of OPC UA events as telemetry for detected assets [DeviceHealth Interface specification](https://reference.opcfoundation.org/DI/v104/docs/4.5.4) |     ✅     |

## Deploy a sample OPC PLC server
To get started, deploy a sample implementation of OPC PLC server containers. For more details, learn about [containers and their parameters](https://github.com/Azure-Samples/iot-edge-opc-plc). The sample uses the template provided to deploy OPC PLC server container instances to Azure.

1. To deploy the OPC PLC server, browse to [Azure IoT Edge OPC PLC sample's readme](https://github.com/Azure-Samples/iot-edge-opc-plc) and select **Deploy to Azure**. 

1. To change the parameters of your OPC PLC server, select **Edit Template**. For more information about the parameters, see the [OPC PLC server sample readme](https://github.com/Azure-Samples/iot-edge-opc-plc). If you want to create two OPC PLC servers, set `Number of Simulation` to `2`.

1. Select **Review and Create**, then select **Create** to deploy your servers on Azure.

1. To confirm that your OPC UA servers are running, check to see that the container instances have started on your Azure portal.

## Deploy OPC UA discovery handler
If you installed Azure IoT Akri as described in [Prerequisites](#prerequisites), you already have the Akri agent running on the cluster.  The next task is to deploy the OPC UA discovery handler as a Kubernetes DaemonSet on your cluster. 

1. Copy and paste the following contents into an empty file, and save it as `opcua-discovery.yaml`.

    ```yml
    apiVersion: apps/v1
    kind: DaemonSet
    metadata:
    name: akri-opcua-asset-discovery-daemonset
    spec:
    selector:
          matchLabels:
          name: akri-opcua-asset-discovery
    template:
          metadata:
          labels:
          name: akri-opcua-asset-discovery
          spec:
          containers:
          - name: akri-opcua-asset-discovery
          image: "e4ipreview.azurecr.io/e4i/workload/akri-opc-ua-asset-discovery:latest"
          imagePullPolicy: Always
          resources:
                requests:
                memory: 64Mi
                cpu: 10m
                limits:
                memory: 512Mi
                cpu: 100m
          ports:
          - name: discovery
                containerPort: 80
          env:
          - name: POD_IP
                valueFrom:
                fieldRef:
                fieldPath: status.podIP
          - name: DISCOVERY_HANDLERS_DIRECTORY
                value: /var/lib/akri
          volumeMounts:
          - name: discovery-handlers
                mountPath: /var/lib/akri
          volumes:
          - name: discovery-handlers
          hostPath:
                path: /var/lib/akri
    ```

1. To deploy the custom OPC UA discovery handler with asset detection, in this step you create a YAML configuration file using the values described in this step. Before you create the file, note the following configuration details:

    - The configuration specifies the discovery URL of the OPC UA Server. The current version of the discovery handler only supports no security `UseSecurity=false` and requires `autoAcceptUntrustedCertificates=true`.
    - The specified server contains a sample address model that uses the Robotics companion specification, which is based on the DI specification.  A model that uses these specifications is required for asset detection. The Robot contains five assets with observable variables and a `DeviceHealth` node that is automatically detected for monitoring.
    - You can specify other servers by providing the `endpointUrl` and ensuring that a security `None` profile is enabled.
    - To enable Azure IoT Akri to discover the servers, confirm that you specified the correct discovery endpoint URL during installation.
    - Discovery URLs appear as `opc.tcp://<FQDN>:50000/`. To find the FQDNs of your OPC PLC servers, navigate to your deployments in the Azure portal. For each server, copy and paste the **FQDN** value into your discovery URLs. The following example demonstrates discovery of two OPC PLC servers. You can add the asset parameters for each OPC PLC server.  If you only have one OPC PLC server, delete one of the assets.
    
    The following screenshot shows a section from an example deployment in Azure portal, with the **FQDN** value highlighted:
    :::image type="content" source="media/howto-create-and-detect-assets-using-akri/akri-opc-plc-fqdn.png" alt-text="Screenshot that shows a section from a deployment in Azure portal with the FQDN field highlighted.":::
    

    > [!div class="mx-tdBreakAll"]
    > | Name                              | Mandatory         | Datatype | Default | Comment                                                                                                                                                                                                                                      |
    > | --------------------------------- | ----------------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    > | `EndpointUrl`                     | true              | String   | null    | The OPC UA endpoint URL to use for asset discovery                                                                                                                                                                                           |
    > | `AutoAcceptUntrustedCertificates` | true ¹ | Boolean  | false   | Whether the client auto accepts untrusted certificates. A certificate can only be auto-accepted as trusted if no non-suppressible errors occurred during chain validation. For example, a certificate with incomplete chain is not accepted. |
    > | `UseSecurity`                     | true ¹ | Boolean  | true    | Whether the client should use a secure connection                                                                                                                                                                                            |
    > | `UserName`                        | false             | String   | null    | The username for user authentication. ²                                                                                                                                                                                           |
    > | `Password`                        | false             | String   | null    | The user password for user authentication. ²                                                                                                                                                                                      |
    
    ¹ The current version of the discovery handler only supports no security `UseSecurity=false` and requires `autoAcceptUntrustedCertificates=true`.  
    ² Temporary implementation until Azure IoT Akri can pass K8S secrets.


    To create the YAML configuration file, copy and paste the following content into a new file, and save it as `opcua-configuration.yaml`.

    ```yml
    apiVersion: akri.sh/v0
    kind: Configuration
    metadata:
    name: akri-opcua-asset
    spec:
    discoveryHandler: 
          name: opcua-asset
          discoveryDetails: "opcuaDiscoveryMethod:\n  - asset:\n      endpointUrl: \"opc.tcp://<INSERT FQDN #1>.io:50000\"\n      useSecurity: false\n      autoAcceptUntrustedCertificates: true\n  - asset:\n      endpointUrl: \"opc.tcp://<INSERT FQDN #2>:50000\"\n      useSecurity: false\n      autoAcceptUntrustedCertificates: true      \n"
    brokerProperties: {}
    capacity: 1
    ```



1. To apply the YAML files to the deployment and start to discover the OPC PLC servers, run the following commands:

    ```bash
    kubectl apply -f opcua-discovery.yaml -n azure-iot-operations
    kubectl apply -f opcua-configuration.yaml -n azure-iot-operations
    ```

1. To confirm that the asset discovery container is deployed and started, check the pods with the following command: 

    ```bash
    kubectl get -o wide -n azure-iot-operations pods
    ```

    The output of the command contains the `akri-opcua-asset-discovery` pod that was created:

    ```console
    NAME                                         READY   STATUS              RESTARTS   AGE     IP          NODE             NOMINATED NODE   READINESS GATES
    akri-agent-daemonset-42tdp                   1/1     Running             0          5m37s   10.1.0.92   docker-desktop   <none>           <none>
    akri-controller-deployment-d4f7847b6-64zxh   1/1     Running             0          6m8s    10.1.0.91   docker-desktop   <none>           <none>
    akri-opcua-asset-discovery-daemonset-5q2ts   0/1     ContainerCreating   0          5s      <none>      docker-desktop   <none>           <none>
    ```

    A log from the `akri-opcua-asset-discovery` pod indicates after a few seconds that the discovery handler registered itself with Azure IoT Akri:

    ```console
    2023-06-07 10:45:27.395 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Akri OPC UA Asset Detection (0.2.0-alpha.203+Branch.main.Sha.cd4045345ad0d148cca4098b68fc7da5b307ce13) is starting with the process id: 1
    2023-06-07 10:45:27.695 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Got IP address of the pod from POD_IP environment variable.
    2023-06-07 10:45:28.695 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Registered with Akri system with Name opcua-asset for http://10.1.0.92:80 with type: Network as shared: True
    2023-06-07 10:45:28.696 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Press CTRL+C to exit
    ```

    After about a minute, Azure IoT Akri issues the first discovery request based on the configuration:

    ```console
    2023-06-07 12:49:17.344 +00:00 dbug: Grpc.AspNetCore.Server.ServerCallHandler[10]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Reading message.
    2023-06-07 12:49:18.046 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Got discover request opcuaDiscoveryMethod:
            - asset:
                endpointUrl: "opc.tcp://opcplc-000000.alice-springs:50000"
                useSecurity: false
                autoAcceptUntrustedCertificates: true
           from ipv6:[::ffff:10.1.7.47]:39708
    2023-06-07 12:49:20.238 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Start asset discovery
    2023-06-07 12:49:20.242 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Discovering OPC UA endpoint opc.tcp://opcplc-000000.alice-springs:50000 using Asset Discovery
    ...
    2023-06-07 14:20:03.905 +00:00 info: OpcUa.Common.Dtdl.DtdlGenerator[6901]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Created DTDL_2 model for boiler_1 with 35 telemetries in 0 ms
    2023-06-07 14:20:04.208 +00:00 info: OpcUa.AssetDiscovery.Akri.CustomResources.CustomResourcesManager[0]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Generated 1 asset CRs from discoveryUrl opc.tcp://opcplc-000000.alice-springs:50000
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

    After the discovery is completed, the result is sent back to Azure IoT Akri to create an Akri instance custom resource with asset information and observable variables. The discovery handler repeats the discovery every 10 minutes to detect changes on the server.

1. To view the discovered Azure IoT Akri instances, run the following command:

    ```bash
    kubectl get akrii -A
    ```

    You can inspect the instance custom resource by using an editor such as OpenLens, under `CustomResources/akri.sh/Instance`.

    For example, the following snippet shows the JSON encoded result of the asset detection with the information of the observable variables of axis-1:

    ```json
      "spec": {
        "name": "axis_1",
        "description": "",
        "dataPoints": [
            {
                "schemaPath": "dtmi:microsoft:e4i:axis_1:ActualPosition_6020;1",
                "dataSource": "nsu=http://vdma.org/OPCRoboticsTestServer/;i=6020",
                "observabilityMode": "none"
            },
            {
                "schemaPath": "dtmi:microsoft:e4i:axis_1:ActualAcceleration_6022;1",
                "dataSource": "nsu=http://vdma.org/OPCRoboticsTestServer/;i=6022",
                "observabilityMode": "none"
            },
            {
                "schemaPath": "dtmi:microsoft:e4i:axis_1:ActualSpeed_6024;1",
                "dataSource": "nsu=http://vdma.org/OPCRoboticsTestServer/;i=6024",
                "observabilityMode": "none"
            },
            {
                "schemaPath": "dtmi:microsoft:e4i:axis_1:Mass_6050;1",
                "dataSource": "nsu=http://vdma.org/OPCRoboticsTestServer/;i=6050",
                "observabilityMode": "none"
            }
        ],
        "sourceModule": "opc-ua-broker-opcplc-alice-springs-50000",
        "type": "axis-1"
      }
    ```

    The OPC UA Connector supervisor watches for new Azure IoT Akri instance custom resources of type `opc-ua-asset`, and generates the initial asset types and asset custom resources for them. You can modify asset custom resources to add settings such as extending publishing for more data points, or to add OPC UA Broker observability settings.


## Related content

- [Azure IoT Akri overview](concept-akri-overview.md)