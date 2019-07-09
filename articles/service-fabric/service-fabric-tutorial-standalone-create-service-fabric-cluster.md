---
title: Tutorial install Service Fabric standalone client - Azure Service Fabric | Microsoft Docs
description: In this tutorial you learn how to install the Service Fabric standalone client on the cluster you created in the previous tutorial article.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: chackdan
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/11/2018
ms.author: dekapur
ms.custom: mvc
---
# Tutorial: Install and create Service Fabric cluster

Service Fabric standalone clusters offer you the option to choose your own environment and create a cluster as part of the "any OS, any cloud" approach that Service Fabric is taking. In this tutorial series, you create a standalone cluster hosted on AWS or Azure and install an application into it.

This tutorial is part two of a series. This tutorial walks you through the steps for creating a Service Fabric standalone cluster.

In part two of the series, you learn how to:

> [!div class="checklist"]
> * Download & install the Service Fabric standalone package
> * Create the Service Fabric cluster
> * Connect to the Service Fabric cluster

## Download the Service Fabric for Windows Server package

Service Fabric provides a setup package to create Service Fabric standalone clusters.  [Download the setup package](https://go.microsoft.com/fwlink/?LinkId=730690) on your local computer.  Once it has successfully downloaded copy it over the RDP connection to your VM, and paste it on the Desktop.

Select the zip file and open the context menu and select **Extract All** > **Extract**.  As you extract the files, you will generate a folder on the desktop that is the same as the zip file name.

If you want to get more detail on the [contents of the setup package](service-fabric-cluster-standalone-package-contents.md).

## Set up your configuration file

You're building a three-node windows cluster, so you need to modify the `ClusterConfig.Unsecure.MultiMachine.json` file.

Next, update the three ipAddress lines which occur in the file on lines 8, 15, and 22 to the IP Addresses for each of the instances.

After updating the nodes, they appear as follows:

```json
        {
            "nodeName": "vm0",
            "ipAddress": "172.31.27.1",
            "nodeTypeRef": "NodeType0",
            "faultDomain": "fd:/dc1/r0",
            "upgradeDomain": "UD0"
        }
```

Then you need to update a couple of the properties.  On line 34, you need to modify the connection string for the diagnostic store it should look like this `"connectionstring": "C:\\ProgramData\\SF\\DiagnosticsStore"`

Finally, in the `nodeTypes` section of the configuration add a new section to map the ephemeral ports that windows will use.  The configuration file should look like the following:

```json
"applicationPorts": {
    "startPort": "20001",
    "endPort": "20031"
},
"ephemeralPorts": {
    "startPort": "20606",
    "endPort": "20861"
},
"isPrimary": true
```

## Validate the environment

The *TestConfiguration.ps1* script in the standalone package is used as a best practices analyzer to validate whether a cluster can be deployed on a given environment. [Deployment preparation](service-fabric-cluster-standalone-deployment-preparation.md) lists the pre-requisites and environment requirements. Run the script to verify if you can create the development cluster:

```powershell
cd .\Desktop\Microsoft.Azure.ServiceFabric.WindowsServer.6.2.274.9494\
.\TestConfiguration.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.MultiMachine.json
```

You should see output like below. If the bottom field "Passed" is returned as `True`, sanity checks have passed and the cluster looks to be deployable based on the input configuration.

```powershell
Trace folder already exists. Traces will be written to existing trace folder: C:\Users\Administrator\Desktop\Microsoft.Azure.ServiceFabric.WindowsServer.6.2.274.9494\DeploymentTraces
Running Best Practices Analyzer...
Best Practices Analyzer completed successfully.


LocalAdminPrivilege        : True
IsJsonValid                : True
IsCabValid                 :
RequiredPortsOpen          : True
RemoteRegistryAvailable    : True
FirewallAvailable          : True
RpcCheckPassed             : True
NoConflictingInstallations : True
FabricInstallable          : True
DataDrivesAvailable        : True
NoDomainController         : True
Passed                     : True
```

## Create the cluster

Once you have a successfully validated your cluster config run the *CreateServiceFabricCluster.ps1* script to deploy the Service Fabric cluster to the virtual machines in the configuration file.

```powershell
.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.MultiMachine.json -AcceptEULA
```

If it all works, you'll get output that looks like this:

```powershell
Your cluster is successfully created! You can connect and manage your cluster using Microsoft Azure Service Fabric Explorer or PowerShell. To connect through PowerShell, run 'Connect-ServiceFabricCluster [ClusterConnectionEndpoint]'.
```

> [!NOTE]
> Deployment traces are written to the VM/machine on which you ran the CreateServiceFabricCluster.ps1 PowerShell script. These can be found in the subfolder DeploymentTraces, based in the directory from which the script was run. To see if Service Fabric was deployed correctly to a machine, find the installed files in the FabricDataRoot directory, as detailed in the cluster configuration file FabricSettings section (by default c:\ProgramData\SF). As well, FabricHost.exe and Fabric.exe processes can be seen running in Task Manager.
>
>

### Bring up Service Fabric Explorer

Now you can connect to the cluster with Service Fabric Explorer either directly from one of the machines with http:\//localhost:19080/Explorer/index.html or remotely with http:\//<*IPAddressofaMachine*>:19080/Explorer/index.html.

## Add and remove nodes

You can add or remove nodes to your standalone Service Fabric cluster as your business needs change. See [Add or Remove nodes to a Service Fabric standalone cluster](service-fabric-cluster-windows-server-add-remove-nodes.md) for detailed steps.

## Next steps

In part two of the series, you learned about uploading large amounts of random data to a storage account in parallel, such as how to:

> [!div class="checklist"]
> * Configure the connection string
> * Build the application
> * Run the application
> * Validate the number of connections

Advance to part three of the series to install an application into the cluster you created.

> [!div class="nextstepaction"]
> [Install the application into the service fabric cluster](service-fabric-tutorial-standalone-install-an-application.md)

<!--Image references-->
[Trusted Zone]: ./media/service-fabric-cluster-creation-for-windows-server/TrustedZone.png
