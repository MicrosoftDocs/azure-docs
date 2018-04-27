---
title: Azure Service Fabric Docker Compose (Preview) | Microsoft Docs
description: Azure Service Fabric accepts the Docker Compose format to make it easier to orchestrate existing containers by using Service Fabric. Support for Docker Compose is currently in preview.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: timlt
editor: ''

ms.assetid: ab49c4b9-74a8-4907-b75b-8d2ee84c6d90
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 2/23/2018
ms.author: subramar
---

# Use Docker volume plug-ins and logging drivers in your container
Azure Service Fabric supports specifying [Docker volume plug-ins](https://docs.docker.com/engine/extend/plugins_volume/) and [Docker logging drivers](https://docs.docker.com/engine/admin/logging/overview/) for your container service. You can persist your data in [Azure Files](https://azure.microsoft.com/services/storage/files/) when your container is moved or restarted on a different host.

Only volume drivers for Linux containers are currently supported. If you're using Windows containers, you can map a volume to an Azure Files [SMB3 share](https://blogs.msdn.microsoft.com/clustering/2017/08/10/container-storage-support-with-cluster-shared-volumes-csv-storage-spaces-direct-s2d-smb-global-mapping/) without a volume driver. For this mapping, update your virtual machines (VMs) in your cluster to the latest Windows Server 1709 version.


## Install the Docker volume/logging driver

If the Docker volume/logging driver is not installed on the machine, you can install it manually by using the RDP/SSH protocols. You can perform the install with these protocols through a [virtual machine scale set start-up script](https://azure.microsoft.com/resources/templates/201-vmss-custom-script-windows/) or an [SetupEntryPoint script](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-model#describe-a-service).

An example of the script to install the [Docker volume driver for Azure](https://docs.docker.com/docker-for-azure/persistent-data-volumes/) is as follows:

```bash
docker plugin install --alias azure --grant-all-permissions docker4x/cloudstor:17.09.0-ce-azure1  \
    CLOUD_PLATFORM=AZURE \
    AZURE_STORAGE_ACCOUNT="[MY-STORAGE-ACCOUNT-NAME]" \
    AZURE_STORAGE_ACCOUNT_KEY="[MY-STORAGE-ACCOUNT-KEY]" \
    DEBUG=1
```

> [!NOTE]
> Windows Server 2016 Datacenter does not support mapping SMB mounts to containers ([That is only supported on Windows Server version 1709](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/container-storage)). This constraint prevents network volume mapping and Azure Files volume drivers on versions older than 1709. 
>   


## Specify the plug-in or driver in the manifest
The plug-ins are specified in the application manifest as follows:

```xml
?xml version="1.0" encoding="UTF-8"?>
<ApplicationManifest ApplicationTypeName="WinNodeJsApp" ApplicationTypeVersion="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
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
        <LogConfig Driver="etwlogs" >
          <DriverOption Name="test" Value="vale"/>
        </LogConfig>
        <Volume Source="c:\workspace" Destination="c:\testmountlocation1" IsReadOnly="false"></Volume>
        <Volume Source="[MyStorageVar]" Destination="c:\testmountlocation2" IsReadOnly="true"> </Volume>
        <Volume Source="myvolume1" Destination="c:\testmountlocation2" Driver="azure" IsReadOnly="true">
           <DriverOption Name="share" Value="models"/>
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

The **Source** tag for the **Volume** element refers to the source folder. The source folder can be a folder in the VM that hosts the containers or a persistent remote store. The **Destination** tag is the location that the **Source** is mapped to within the running container. Thus, your destination can't be a location that already exists within your container.

Application parameters are supported for volumes as shown in the preceding manifest snippet (look for `MyStoreVar` for an example use).

When specifying a volume plug-in, Service Fabric automatically creates the volume by using the specified parameters. The **Source** tag is the name of the volume and the **Driver** tag specifies the volume driver plug-in. Options can be specified by using the **DriverOption** tag as follows:

```xml
<Volume Source="myvolume1" Destination="c:\testmountlocation4" Driver="azure" IsReadOnly="true">
           <DriverOption Name="share" Value="models"/>
</Volume>
```
If a Docker log driver is specified, you have to deploy agents (or containers) to handle the logs in the cluster. The **DriverOption** tag can be used to specify options for the log driver.

## Next steps
To deploy containers to a Service Fabric cluster, refer the article [Deploy a container on Service Fabric](service-fabric-deploy-container.md).
