---
title: Azure Service Fabric Docker Compose Preview | Microsoft Docs
description: Azure Service Fabric accepts Docker Compose format to make it easier to orchestrate exsiting containers using Service Fabric. This support is currently in preview.
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
ms.date: 8/9/2017
ms.author: subramar
---

# Using volume plugins and logging drivers in your container
Service Fabric supports specifying [Docker volume plugins](https://docs.docker.com/engine/extend/plugins_volume/) and [Docker logging drivers](https://docs.docker.com/engine/admin/logging/overview/) for your container service.  This will enable you to persist your data in [Azure Files](https://azure.microsoft.com/en-us/services/storage/files/) even if you container is moved or restarted on a different host.

Currently, there are only volume drivers for Linux containers as shown below.  If you are using Windows containers, it is possible to map a volume to a Azure Files [SMB3 share](https://blogs.msdn.microsoft.com/clustering/2017/08/10/container-storage-support-with-cluster-shared-volumes-csv-storage-spaces-direct-s2d-smb-global-mapping/) without a volume driver using the latest 1709 version of Windows Server. This would require updating your Virtual Machines in your cluster to the Windows Server 1709 version.


## Install volume/logging driver

If the Docker volume/logging driver is not installed on the machine, install it manually through RDP/SSH-ing into the machine, through a [VMSS start-up script](https://azure.microsoft.com/en-us/resources/templates/201-vmss-custom-script-windows/) or using a [SetupEntryPoint](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-application-model#describe-a-service) script. Choosing one of the methods mentioned, you can write a script to install the [Docker Volume Driver for Azure](https://docs.docker.com/docker-for-azure/persistent-data-volumes/):


```bash
docker plugin install --alias azure --grant-all-permissions docker4x/cloudstor:17.09.0-ce-azure1  \
    CLOUD_PLATFORM=AZURE \
    AZURE_STORAGE_ACCOUNT="[MY-STORAGE-ACCOUNT-NAME]" \
    AZURE_STORAGE_ACCOUNT_KEY="[MY-STORAGE-ACCOUNT-KEY]" \
    DEBUG=1
```

## Specify the plugin or driver in the manifest
The plugins are specified in the application manifest as shown in the following manifest:

```xml
?xml version="1.0" encoding="UTF-8"?>
<ApplicationManifest ApplicationTypeName="WinNodeJsApp" ApplicationTypeVersion="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <Description>Calculator Application</Description>
    <Parameters>
        <Parameter Name="ServiceInstanceCount" DefaultValue="3"></Parameter>
      <Parameter Name="MyCpuShares" DefaultValue="3"></Parameter>
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
        <Volume Source="d:\myfolder" Destination="c:\testmountlocation2" IsReadOnly="true"> </Volume>
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

In the preceding example, the `Source` tag for the `Volume` refers to the source folder. The source folder could be a folder in the VM that hosts the containers or a persistent remote store. The `Destination` tag is the location that the `Source` is mapped to within the running container.  Thus, your destination cannot be an already existing location within your container.

When specifying a volume plugin, Service Fabric automatically creates the volume using the parameters specified. The `Source` tag is the name of the volume, and the `Driver` tag specifies the volume driver plugin. Options can be specified using the `DriverOption` tag as shown in the following snippet:

```xml
<Volume Source="myvolume1" Destination="c:\testmountlocation4" Driver="azure" IsReadOnly="true">
           <DriverOption Name="share" Value="models"/>
</Volume>
```
If a Docker log driver is specified, it is necessary to deploy agents (or containers) to handle the logs in the cluster.  The `DriverOption` tag can be used to specify log driver options as well.

Refer to the following articles to deploy containers to a Service Fabric cluster:


[Deploy a container on Service Fabric](service-fabric-deploy-container.md)

