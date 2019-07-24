---
title: Service Fabric Azure Files Volume Driver (Preview) | Microsoft Docs
description: Service Fabric supports using Azure Files to backup volumes from your container. This is currently in preview.
services: service-fabric
documentationcenter: other
author: aljo-microsoft
manager: chackdan
editor: ''

ms.assetid: ab49c4b9-74a8-4907-b75b-8d2ee84c6d90
ms.service: service-fabric
ms.devlang: other
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 6/10/2018
ms.author: subramar
---

# Service Fabric Azure Files Volume Driver (Preview)
The Azure Files volume plugin is a [Docker volume plugin](https://docs.docker.com/engine/extend/plugins_volume/) that provides [Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction) based volumes for Docker containers. This Docker volume plugin is packaged as a Service Fabric application that can be deployed to Service Fabric clusters. It's purpose is to provide Azure Files based volumes for other Service Fabric container applications that are deployed to the cluster.

> [!NOTE]
> Version 6.4.571.9590 of the Azure Files volume plugin is a preview release that is available with this document. As a preview release, it is **not** supported for use in production environments.
>

## Prerequisites
* The Windows version of the Azure Files volume plugin works on [Windows Server version 1709](https://docs.microsoft.com/windows-server/get-started/whats-new-in-windows-server-1709), [Windows 10 version 1709](https://docs.microsoft.com/windows/whats-new/whats-new-windows-10-version-1709) or later operating systems only. The Linux version of the Azure Files volume plugin works on all operating system versions supported by Service Fabric.

* The Azure Files volume plugin only works on Service Fabric version 6.2 and newer.

* Follow the instructions in the [Azure Files documentation](https://docs.microsoft.com/azure/storage/files/storage-how-to-create-file-share) to create a file share for the Service Fabric container application to use as volume.

* You will need [Powershell with the Service Fabric module](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started) or [SFCTL](https://docs.microsoft.com/azure/service-fabric/service-fabric-cli) installed.

* If you are using hyperv containers, the following snippets need to be added in the ClusterManifest (local cluster) or fabricSettings section in your ARM template (Azure cluster) or ClusterConfig.json (standalone cluster). You will need  the volume name and the port that the volume listens to on the cluster. 

In the ClusterManifest, the following needs to be added in the Hosting section. In this example, the volume name is **sfazurefile** and the port it listens to on the cluster is **19100**.  

``` xml 
<Section Name="Hosting">
  <Parameter Name="VolumePluginPorts" Value="sfazurefile:19100" />
</Section>
```

In the fabricSettings section in your ARM template (for Azure deployments) or ClusterConfig.json (for standalone deployments), the following snippet needs to be added. 

```json
"fabricSettings": [
  {
    "name": "Hosting",
    "parameters": [
      {
          "name": "VolumePluginPorts",
          "value": "sfazurefile:19100"
      }
    ]
  }
]
```


## Deploy the Service Fabric Azure Files application

The Service Fabric application that provides the volumes for your containers can be downloaded from the following [link](https://download.microsoft.com/download/C/0/3/C0373AA9-DEFA-48CF-9EBE-994CA2A5FA2F/AzureFilesVolumePlugin.6.4.571.9590.zip). The application can be deployed to the cluster via [PowerShell](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications), [CLI](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-lifecycle-sfctl) or [FabricClient APIs](https://docs.microsoft.com/azure/service-fabric/service-fabric-deploy-remove-applications-fabricclient).

1. Using the command line, change directory to the root directory of the application package downloaded.

    ```powershell
    cd .\AzureFilesVolume\
    ```

    ```bash
    cd ~/AzureFilesVolume
    ```

2. Copy the application package to the image store
Run the command below with the appropriate value for [ApplicationPackagePath] and [ImageStoreConnectionString]:

    ```powershell
    Copy-ServiceFabricApplicationPackage -ApplicationPackagePath [ApplicationPackagePath] -ImageStoreConnectionString [ImageStoreConnectionString] -ApplicationPackagePathInImageStore AzureFilesVolumePlugin
    ```

    ```bash
    sfctl cluster select --endpoint https://testcluster.westus.cloudapp.azure.com:19080 --pem test.pem --no-verify
    sfctl application upload --path [ApplicationPackagePath] --show-progress
    ```

3. Register the application type

    ```powershell
    Register-ServiceFabricApplicationType -ApplicationPathInImageStore AzureFilesVolumePlugin
    ```

    ```bash
    sfctl application provision --application-type-build-path [ApplicationPackagePath]
    ```

4. Create the application
    In the command to create the application below, note the **ListenPort** application parameter. This value specified for this application parameter is the port on which the Azure Files volume plugin listens for requests from the Docker daemon. It is important to ensure that the port provided to the application match the VolumePluginPorts in the ClusterManifest and does not conflict with any other port that the cluster or your applications use.

    ```powershell
    New-ServiceFabricApplication -ApplicationName fabric:/AzureFilesVolumePluginApp -ApplicationTypeName AzureFilesVolumePluginType -ApplicationTypeVersion 6.4.571.9590 -ApplicationParameter @{ListenPort='19100'}
    ```

    ```bash
    sfctl application create --app-name fabric:/AzureFilesVolumePluginApp --app-type AzureFilesVolumePluginType --app-version 6.4.571.9590 --parameter '{"ListenPort":"19100"}'
    ```

> [!NOTE]
> 
> Windows Server 2016 Datacenter does not support mapping SMB mounts to containers ([That is only supported on Windows Server version 1709](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/container-storage)). This constraint prevents network volume mapping and Azure Files volume drivers on versions older than 1709.

### Deploy the application on a local development cluster
The default service instance count for the Azure Files volume plugin application is -1, which means that there is an instance of the service deployed to each node in the cluster. However, when deploying the Azure Files volume plugin application on a local development cluster, the service instance count should be specified as 1. This can be done via the **InstanceCount** application parameter. Therefore, the command for deploying the Azure Files volume plugin application on a local development cluster is:

```powershell
New-ServiceFabricApplication -ApplicationName fabric:/AzureFilesVolumePluginApp -ApplicationTypeName AzureFilesVolumePluginType -ApplicationTypeVersion 6.4.571.9590 -ApplicationParameter @{ListenPort='19100';InstanceCount='1'}
```

```bash
sfctl application create --app-name fabric:/AzureFilesVolumePluginApp --app-type AzureFilesVolumePluginType --app-version 6.4.571.9590 --parameter '{"ListenPort": "19100","InstanceCount": "1"}'
```
## Configure your applications to use the volume
The following snippet shows how an Azure Files based volume can be specified in the application manifest of your application. The specific element of interest is the **Volume** tag:

```xml
?xml version="1.0" encoding="UTF-8"?>
<ApplicationManifest ApplicationTypeName="WinNodeJsApp" ApplicationTypeVersion="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
    <Description>Calculator Application</Description>
    <Parameters>
      <Parameter Name="ServiceInstanceCount" DefaultValue="3"></Parameter>
      <Parameter Name="MyCpuShares" DefaultValue="3"></Parameter>
      <Parameter Name="MyStorageVar" DefaultValue="c:\tmp"></Parameter>
    </Parameters>
    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="NodeServicePackage" ServiceManifestVersion="1.0"/>
     <Policies>
       <ContainerHostPolicies CodePackageRef="NodeService.Code" Isolation="hyperv">
            <PortBinding ContainerPort="8905" EndpointRef="Endpoint1"/>
            <RepositoryCredentials PasswordEncrypted="false" Password="****" AccountName="test"/>
            <Volume Source="azfiles" Destination="c:\VolumeTest\Data" Driver="sfazurefile">
                <DriverOption Name="shareName" Value="" />
                <DriverOption Name="storageAccountName" Value="" />
                <DriverOption Name="storageAccountKey" Value="" />
                <DriverOption Name="storageAccountFQDN" Value="" />
            </Volume>
       </ContainerHostPolicies>
   </Policies>
    </ServiceManifestImport>
    <ServiceTemplates>
        <StatelessService ServiceTypeName="StatelessNodeService" InstanceCount="5">
            <SingletonPartition></SingletonPartition>
        </StatelessService>
    </ServiceTemplates>
</ApplicationManifest>
```

The driver name for the Azure Files volume plugin is **sfazurefile**. This value is set for the **Driver** attribute of the **Volume** element in the application manifest.

In the **Volume** element in the snippet above, the Azure Files volume plugin requires the following tags:
- **Source** - This is the name of the volume. The user can pick any name for their volume.
- **Destination** - This tag is the location that the volume is mapped to within the running container. Thus, your destination can't be a location that already exists within your container

As shown in the **DriverOption** elements in the snippet above, the Azure Files volume plugin supports the following driver options:
- **shareName** - Name of the Azure Files file share that provides the volume for the container.
- **storageAccountName** - Name of the Azure storage account that contains the Azure Files file share.
- **storageAccountKey** - Access key for the Azure storage account that contains the Azure Files file share.
- **storageAccountFQDN** - Domain name associated with the storage account. If storageAccountFQDN is not specified, domain name will be formed by using the default suffix(.file.core.windows.net) with the storageAccountName.  

    ```xml
    - Example1: 
        <DriverOption Name="shareName" Value="myshare1" />
        <DriverOption Name="storageAccountName" Value="myaccount1" />
        <DriverOption Name="storageAccountKey" Value="mykey1" />
        <!-- storageAccountFQDN will be "myaccount1.file.core.windows.net" -->
    - Example2: 
        <DriverOption Name="shareName" Value="myshare2" />
        <DriverOption Name="storageAccountName" Value="myaccount2" />
        <DriverOption Name="storageAccountKey" Value="mykey2" />
        <DriverOption Name="storageAccountFQDN" Value="myaccount2.file.core.chinacloudapi.cn" />
    ```

## Using your own volume or logging driver
Service Fabric also allows the usage of your own custom [volume](https://docs.docker.com/engine/extend/plugins_volume/) or [logging](https://docs.docker.com/engine/admin/logging/overview/) drivers. If the Docker volume/logging driver is not installed on the cluster, you can install it manually by using the RDP/SSH protocols. You can perform the install with these protocols through a [virtual machine scale set start-up script](https://azure.microsoft.com/resources/templates/201-vmss-custom-script-windows/) or an [SetupEntryPoint script](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-model).

An example of the script to install the [Docker volume driver for Azure](https://docs.docker.com/docker-for-azure/persistent-data-volumes/) is as follows:

```bash
docker plugin install --alias azure --grant-all-permissions docker4x/cloudstor:17.09.0-ce-azure1  \
    CLOUD_PLATFORM=AZURE \
    AZURE_STORAGE_ACCOUNT="[MY-STORAGE-ACCOUNT-NAME]" \
    AZURE_STORAGE_ACCOUNT_KEY="[MY-STORAGE-ACCOUNT-KEY]" \
    DEBUG=1
```

In your applications, to use the volume or logging driver you installed, you would have to specify the appropriate values in the **Volume** and **LogConfig** elements under **ContainerHostPolicies** in your application manifest.

```xml
<ContainerHostPolicies CodePackageRef="NodeService.Code" Isolation="hyperv">
    <PortBinding ContainerPort="8905" EndpointRef="Endpoint1"/>
    <RepositoryCredentials PasswordEncrypted="false" Password="****" AccountName="test"/>
    <LogConfig Driver="[YOUR_LOG_DRIVER]" >
        <DriverOption Name="test" Value="vale"/>
    </LogConfig>
    <Volume Source="c:\workspace" Destination="c:\testmountlocation1" IsReadOnly="false"></Volume>
    <Volume Source="[MyStorageVar]" Destination="c:\testmountlocation2" IsReadOnly="true"> </Volume>
    <Volume Source="myvolume1" Destination="c:\testmountlocation2" Driver="[YOUR_VOLUME_DRIVER]" IsReadOnly="true">
        <DriverOption Name="[name]" Value="[value]"/>
    </Volume>
</ContainerHostPolicies>
```

When specifying a volume plug-in, Service Fabric automatically creates the volume by using the specified parameters. The **Source** tag for the **Volume** element is the name of the volume and the **Driver** tag specifies the volume driver plug-in. The **Destination** tag is the location that the **Source** is mapped to within the running container. Thus, your destination can't be a location that already exists within your container. Options can be specified by using the **DriverOption** tag as follows:

```xml
<Volume Source="myvolume1" Destination="c:\testmountlocation4" Driver="azure" IsReadOnly="true">
           <DriverOption Name="share" Value="models"/>
</Volume>
```

Application parameters are supported for volumes as shown in the preceding manifest snippet (look for `MyStorageVar` for an example use).

If a Docker log driver is specified, you have to deploy agents (or containers) to handle the logs in the cluster. The **DriverOption** tag can be used to specify options for the log driver.

## Next steps
* To see container samples, including the volume driver, please visit the [Service Fabric container samples](https://github.com/Azure-Samples/service-fabric-containers)
* To deploy containers to a Service Fabric cluster, refer the article [Deploy a container on Service Fabric](service-fabric-deploy-container.md)
