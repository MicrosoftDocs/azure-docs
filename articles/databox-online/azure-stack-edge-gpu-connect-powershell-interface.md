---
title: Connect to and manage Microsoft Azure Stack Edge device via the Windows PowerShell interface | Microsoft Docs
description: Describes how to connect to and then manage Azure Stack Edge via the Windows PowerShell interface.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 08/28/2020
ms.author: alkohli
---
# Manage an Azure Stack Edge GPU device via Windows PowerShell

Azure Stack Edge solution lets you process data and send it over the network to Azure. This article describes some of the configuration and management tasks for your Azure Stack Edge device. You can use the Azure portal, local web UI, or the Windows PowerShell interface to manage your device.

This article focuses on how you can connect to the PowerShell interface of the device and the tasks you can do using this interface. 


## Connect to the PowerShell interface

[!INCLUDE [Connect to admin runspace](../../includes/data-box-edge-gateway-connect-minishell.md)]

## Create a support package

[!INCLUDE [Create a support package](../../includes/data-box-edge-gateway-create-support-package.md)]

<!--## Upload certificate

[!INCLUDE [Upload certificate](../../includes/data-box-edge-gateway-upload-certificate.md)]

You can also upload IoT Edge certificates to enable a secure connection between your IoT Edge device and the downstream devices that may connect to it. There are three IoT Edge certificates (*.pem* format) that you need to install:

- Root CA certificate or the owner CA
- Device CA certificate
- Device key certificate

The following example shows the usage of this cmdlet to install IoT Edge certificates:

```
Set-HcsCertificate -Scope IotEdge -RootCACertificateFilePath "\\hcfs\root-ca-cert.pem" -DeviceCertificateFilePath "\\hcfs\device-ca-cert.pem\" -DeviceKeyFilePath "\\hcfs\device-key-cert.pem" -Credential "username"
```
When you run this cmdlet, you will be prompted to provide the password for the network share.

For more information on certificates, go to [Azure IoT Edge certificates](https://docs.microsoft.com/azure/iot-edge/iot-edge-certs) or [Install certificates on a gateway](https://docs.microsoft.com/azure/iot-edge/how-to-create-transparent-gateway).-->

## View device information
 
[!INCLUDE [View device information](../../includes/data-box-edge-gateway-view-device-info.md)]

## View GPU driver information

If the compute role is configured on your device, you can also get the GPU driver information via the PowerShell interface. 

1. [Connect to the PowerShell interface](#connect-to-the-powershell-interface).
2. Use the `Get-HcsGpuNvidiaSmi` to get the GPU driver information for your device.

    The following example shows the usage of this cmdlet:

    ```powershell
    Get-HcsGpuNvidiaSmi
    ```
    Make a note of the driver information from the sample output of this cmdlet.

    ```powershell    
    +-----------------------------------------------------------------------------+    
    | NVIDIA-SMI 440.64.00    Driver Version: 440.64.00    CUDA Version: 10.2     |    
    |-------------------------------+----------------------+----------------------+    
    | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |    
    | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |    
    |===============================+======================+======================|    
    |   0  Tesla T4            On   | 000029CE:00:00.0 Off |                    0 |    
    | N/A   60C    P0    29W /  70W |   1539MiB / 15109MiB |      0%      Default |    
    +-------------------------------+----------------------+----------------------+    
    |   1  Tesla T4           On  | 0000AD50:00:00.0 Off |                    0 |
    | N/A   58C    P0    29W /  70W |    330MiB / 15109MiB |      0%      Default |
    +-------------------------------+----------------------+----------------------+
    ```

## Enable Multi-Process Service (MPS)

A Multi-Process Service (MPS) on Nvidia GPUs provides a mechanism where GPUs can be shared by multiple jobs, where each job is allocated some percentage of the GPU's resources. To enable MPS on your Azure Stack Edge device, follow these steps:

1. Before you begin, make sure: that 

    1. You've configured and [Activated your Azure Stack Edge device](azure-stack-edge-gpu-deploy-activate.md) with an Azure Stack Edge/Data Box Gateway resource in Azure.
    1. You've [Configured compute on this device in the Azure portal](azure-stack-edge-deploy-configure-compute.md#configure-compute).
    
1. [Connect to the PowerShell interface](#connect-to-the-powershell-interface).
1. Use the following command to enable MPS on your device.

    ```powershell
    Start-HcsGpuMPS
    ```

## Reset your device

[!INCLUDE [Reset your device](../../includes/data-box-edge-gateway-deactivate-device.md)]

## Get compute logs

If the compute role is configured on your device, you can also get the compute logs via the PowerShell interface.

1. [Connect to the PowerShell interface](#connect-to-the-powershell-interface).
2. Use the `Get-AzureDataBoxEdgeComputeRoleLogs` to get the compute logs for your device.

    The following example shows the usage of this cmdlet:

    ```powershell
    Get-AzureDataBoxEdgeComputeRoleLogs -Path "\\hcsfs\logs\myacct" -Credential "username" -FullLogCollection    
    ```

    Here is a description of the parameters used for the cmdlet:
    - `Path`: Provide a network path to the share where you want to create the compute log package.
    - `Credential`: Provide the username for the network share. When you run this cmdlet, you will need to provide the share password.
    - `FullLogCollection`: This parameter ensures that the log package will contain all the compute logs. By default, the log package contains only a subset of logs.


## Change Kubernetes pod and service subnets

By default, Kubernetes on your Azure Stack Edge device uses subnets 172.27.0.0/16 and 172.28.0.0/16 for pod and service respectively. If these subnets are already in use in your network, then you can run the `Set-HcsKubeClusterNetworkInfo` cmdlet to change these subnets.

You want to perform this configuration before you configure compute from the Azure portal as the Kubernetes cluster is created in this step.

1. Connect to the PowerShell interface of the device.
1. From the PowerShell interface of the device, run:

    `Set-HcsKubeClusterNetworkInfo -PodSubnet <subnet details> -ServiceSubnet <subnet details>`

    Replace the <subnet details> with the subnet range that you want to use. 

1. Once you have run this command, you can use the `Get-HcsKubeClusterNetworkInfo` command to verify that the pod and service subnets have changed.

Here is a sample output for this command.

```powershell
[10.100.10.10]: PS>Set-HcsKubeClusterNetworkInfo -PodSubnet 10.96.0.1/16 -ServiceSubnet 10.97.0.1/16
[10.100.10.10]: PS>Get-HcsKubeClusterNetworkInfo

Id                                   PodSubnet    ServiceSubnet
--                                   ---------    -------------
6dbf23c3-f146-4d57-bdfc-76cad714cfd1 10.96.0.1/16 10.97.0.1/16
[10.100.10.10]: PS>
```


## Debug Kubernetes issues related to IoT Edge

<!--When the Kubernetes cluster is created, there are two system namespaces created: `iotedge` and `azure-arc`. --> 

<!--### Create config file for system namespace

To troubleshoot, first create the `config` file corresponding to the `iotedge` namespace with `aseuser`.

Run the `Get-HcsKubernetesUserConfig -AseUser` command and save the output as `config` file (no file extension). Save the file in the `.kube` folder of your user profile on the local machine.

Following is the sample output of the `Get-HcsKubernetesUserConfig` command.

```PowerShell
[10.100.10.10]: PS>Get-HcsKubernetesUserConfig -AseUser
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN5RENDQWJDZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRJd01EVXhNekl4TkRRME5sb1hEVE13TURVeE1USXhORFEwTmxvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBS0M1CjlJbzRSU2hudG90QUdxdjNTYmRjOVd4UmJDYlRzWXU5S0RQeU9xanVoZE1UUE9PcmROOGNoa0x4NEFyZkZaU1AKZithUmhpdWZqSE56bWhucnkvZlprRGdqQzQzRmV5UHZzcTZXeVVDV0FEK2JBdi9wSkJDbkg2MldoWGNLZ1BVMApqU1k0ZkpXenNFbzBaREhoeUszSGN3MkxkbmdmaEpEanBQRFJBNkRWb2pIaktPb29OT1J1dURvUHpiOTg2dGhUCkZaQXJMZjRvZXRzTEk1ZzFYRTNzZzM1YVhyU0g3N2JPYVVsTGpYTzFYSnpFZlZWZ3BMWE5xR1ZqTXhBMVU2b1MKMXVJL0d1K1ArY
===========CUT=========================================CUT===================
    server: https://compute.myasegpu1.wdshcsso.com:6443
    name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: aseuser
    name: aseuser@kubernetes
current-context: aseuser@kubernetes
kind: Config
preferences: {}
users:
- name: aseuser
    user:
    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMwRENDQWJpZ0F3SUJBZ0lJY1hOTXRPU2VwbG93RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TURBMU1UTXlNVFEwTkRaYUZ3MHlNVEExTVRNeU1UVXhNVEphTUJJeApFREFPQmdOVkJBTVRCMkZ6WlhWelpYSXdnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCCkFRRHVjQ1pKdm9qNFIrc0U3a1EyYmVjNEJkTXdpUEhmU2R2WnNDVVY0aTRRZGY1Yzd0dkE3OVRSZkRLQTY1d08Kd0h0QWdlK3lLK0hIQ1Qyd09RbWtNek1RNjZwVFEzUlE0eVdtRDZHR1cWZWMExBR1hFUUxWWHRuTUdGCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==

[10.100.10.10]: PS>
```
-->

On an Azure Stack Edge device that has the compute role configured, you can troubleshoot or monitor the device using two different set of commands.

- Using `iotedge` commands. These commands are available for basic operations for your device.
- Using `kubectl` commands. These commands are available for an extensive set of operations for your device.

To execute either of the above set of commands, you need to [Connect to the PowerShell interface](#connect-to-the-powershell-interface).

### Use `iotedge` commands

To see a list of available commands, [connect to the PowerShell interface](#connect-to-the-powershell-interface) and use the `iotedge` function.

```powershell
[10.100.10.10]: PS>iotedge -?                                                                                                                           
Usage: iotedge COMMAND

Commands:
   list
   logs
   restart

[10.100.10.10]: PS>
```

The following table has a brief description of the commands available for `iotedge`:

|command  |Description |
|---------|---------|
|`list`     | List modules         |
|`logs`     | Fetch the logs of a module        |
|`restart`     | Stop and restart a module         |


To list all the modules running on your device, use the `iotedge list` command.

Here is a sample output of this command. This command lists all the modules, associated configuration, and the external IPs associated with the modules. For example, you can access the **webserver** app at `https://10.128.44.244`. 


```powershell
[10.100.10.10]: PS>iotedge list

NAME                   STATUS  DESCRIPTION CONFIG                                             EXTERNAL-IP
----                   ------  ----------- ------                                             -----
gettingstartedwithgpus Running Up 10 days  mcr.microsoft.com/intelligentedge/solutions:latest
iotedged               Running Up 10 days  azureiotedge/azureiotedge-iotedged:0.1.0-beta10    <none>
edgehub                Running Up 10 days  mcr.microsoft.com/azureiotedge-hub:1.0             10.128.44.243
edgeagent              Running Up 10 days  azureiotedge/azureiotedge-agent:0.1.0-beta10
webserverapp           Running Up 10 days  nginx:stable                                       10.128.44.244

[10.100.10.10]: PS>
```


### Use kubectl commands

On an Azure Stack Edge device that has the compute role configured, all the `kubectl` commands are available to monitor or troubleshoot modules. To see a list of available commands, run `kubectl --help` from the command window.

```PowerShell
C:\Users\myuser>kubectl --help

kubectl controls the Kubernetes cluster manager.

Find more information at: https://kubernetes.io/docs/reference/kubectl/overview/

Basic Commands (Beginner):
    create         Create a resource from a file or from stdin.
    expose         Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
    run            Run a particular image on the cluster
    set            Set specific features on objects
    run-container  Run a particular image on the cluster. This command is deprecated, use "run" instead
==============CUT=============CUT============CUT========================

Usage:
    kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.
Use "kubectl options" for a list of global command-line options (applies to all commands).

C:\Users\myuser>
```

For a comprehensive list of the `kubectl` commands, go to [`kubectl` cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/).


#### To get IP of service or module exposed outside of Kubernetes cluster

To get the IP of a load balancing service or modules exposed outside of the Kubernetes, run the following command:

`kubectl get svc -n iotedge`

Following is a sample output of the all the services or modules that are exposed outside of the Kubernetes cluster. 


```powershell
[10.100.10.10]: PS>kubectl get svc -n iotedge
NAME           TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                                       AGE
edgehub        LoadBalancer   10.103.52.225   10.128.44.243   443:31987/TCP,5671:32336/TCP,8883:30618/TCP   34h
iotedged       ClusterIP      10.107.236.20   <none>          35000/TCP,35001/TCP                           3d8h
webserverapp   LoadBalancer   10.105.186.35   10.128.44.244   8080:30976/TCP                                16h

[10.100.10.10]: PS>
```
The IP address in the External IP column corresponds to the external endpoint for the service or the module. You can also [Get the external IP in the Kubernetes dashboard](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md#get-ip-address-for-services-or-modules).


#### To check if module deployed successfully

Compute modules are containers that have a business logic implemented. A Kubernetes pod can have multiple containers running. 

To check if a compute module is deployed successfully, connect to the PowerShell interface of the device.
Run the `get pods` command and check if the container (corresponding to the compute module) is running.

To get the list of all the pods running in a specific namespace, run the following command:

`get pods -n <namespace>`

To check the modules deployed via IoT Edge, run the following command:

`get pods -n iotedge`

Following is a sample output of all the pods running in the `iotedge` namespace.

```
[10.100.10.10]: PS>kubectl get pods -n iotedge
NAME                        READY   STATUS    RESTARTS   AGE
edgeagent-cf6d4ffd4-q5l2k   2/2     Running   0          20h
edgehub-8c9dc8788-2mvwv     2/2     Running   0          56m
filemove-66c49984b7-h8lxc   2/2     Running   0          56m
iotedged-675d7f4b5f-9nml4   1/1     Running   0          20h

[10.100.10.10]: PS>
```

The status **Status** indicates that all the pods in the namespace are running and the **Ready** indicates the number of containers deployed in a pod. In the preceding sample, all the pods are running and all the modules deployed in each of the pods are running. 

To check the modules deployed via Azure Arc, run the following command:

`get pods -n azure-arc`

Alternatively, you can [Connect to Kubernetes dashboard to see IoT Edge or Azure Arc deployments](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md#view-module-status).


For a more verbose output of a specific pod for a given namespace, you can run the following command:

`kubectl describe pod <pod name> -n <namespace>` 

The sample output is shown here.

```
[10.100.10.10]: PS>kubectl describe pod filemove-66c49984b7 -n iotedge
Name:           filemove-66c49984b7-h8lxc
Namespace:      iotedge
Priority:       0
Node:           k8s-1hwf613cl-1hwf613/10.139.218.12
Start Time:     Thu, 14 May 2020 12:46:28 -0700
Labels:         net.azure-devices.edge.deviceid=myasegpu-edge
                net.azure-devices.edge.hub=myasegpu2iothub.azure-devices.net
                net.azure-devices.edge.module=filemove
                pod-template-hash=66c49984b7
Annotations:    net.azure-devices.edge.original-moduleid: filemove
Status:         Running
IP:             172.17.75.81
IPs:            <none>
Controlled By:  ReplicaSet/filemove-66c49984b7
Containers:
    proxy:
    Container ID:   docker://fd7975ca78209a633a1f314631042a0892a833b7e942db2e7708b41f03e8daaf
    Image:          azureiotedge/azureiotedge-proxy:0.1.0-beta8
    Image ID:       docker://sha256:5efbf6238f13d24bab9a2b499e5e05bc0c33ab1587d6cf6f289cdbe7aa667563
    Port:           <none>
    Host Port:      <none>
    State:          Running
        Started:      Thu, 14 May 2020 12:46:30 -0700
    Ready:          True
    Restart Count:  0
    Environment:
        PROXY_LOG:  Debug
=============CUT===============================CUT===========================
Volumes:
    config-volume:
    Type:      ConfigMap (a volume populated by a ConfigMap)
    Name:      iotedged-proxy-config
    Optional:  false
    trust-bundle-volume:
    Type:      ConfigMap (a volume populated by a ConfigMap)
    Name:      iotedged-proxy-trust-bundle
    Optional:  false
    myasesmb1local:
    Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
    ClaimName:  myasesmb1local
    ReadOnly:   false
    myasesmb1:
    Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
    ClaimName:  myasesmb1
    ReadOnly:   false
    filemove-token-pzvw8:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  filemove-token-pzvw8
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                    node.kubernetes.io/unreachable:NoExecute for 300s
Events:          <none>


[10.100.10.10]: PS>
```

#### To get container logs

To get the logs for a module, run the following command from the PowerShell interface of the device:

`kubectl logs <pod_name> -n <namespace> --all-containers` 

Because `all-containers` flag will dumps all the logs for all the containers, a good way to see the recent errors is to use the option `--tail 10`.

Following is a sample output. 

```
[10.100.10.10]: PS>kubectl logs filemove-66c49984b7-h8lxc -n iotedge --all-containers --tail 10
DEBUG 2020-05-14T20:40:42Z: loop process - 0 events, 0.000s
DEBUG 2020-05-14T20:40:44Z: loop process - 0 events, 0.000s
DEBUG 2020-05-14T20:40:44Z: loop process - 0 events, 0.000s
DEBUG 2020-05-14T20:40:44Z: loop process - 1 events, 0.000s
DEBUG 2020-05-14T20:40:44Z: loop process - 0 events, 0.000s
DEBUG 2020-05-14T20:42:12Z: loop process - 0 events, 0.000s
DEBUG 2020-05-14T20:42:14Z: loop process - 0 events, 0.000s
DEBUG 2020-05-14T20:42:14Z: loop process - 0 events, 0.000s
DEBUG 2020-05-14T20:42:14Z: loop process - 1 events, 0.000s
DEBUG 2020-05-14T20:42:14Z: loop process - 0 events, 0.000s
05/14/2020 19:46:44: Info: Opening module client connection.
05/14/2020 19:46:45: Info: Open done.
05/14/2020 19:46:45: Info: Initializing with input: /home/input, output: /home/output, protocol: Amqp.
05/14/2020 19:46:45: Info: IoT Hub module client initialized.

[10.100.10.10]: PS>
```



## Exit the remote session

To exit the remote PowerShell session, close the PowerShell window.

## Next steps

- Deploy [Azure Stack Edge](azure-stack-edge-gpu-deploy-prep.md) in Azure portal.
