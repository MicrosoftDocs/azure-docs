---
title: Set up Azure Service Fabric Linux cluster on WSL2 linux distribution inside Windows 
description: This article covers how to set up Service Fabric Linux clusters inside WSL2 linux distribution running on Windows development machines. This approach is useful for cross platform development.  

ms.topic: conceptual
ms.date: 10/31/2021

# Maintainer notes: Keep these documents in sync:
# service-fabric-get-started-linux.md
# service-fabric-get-started-mac.md
# service-fabric-local-linux-cluster-windows.md
# service-fabric-local-linux-cluster-windows-wsl2.md
---
# Set up a Linux Service Fabric cluster on your Windows developer machine

This document covers how to set up a local Linux Service Fabric cluster on a Windows development machine. Setting up a local Linux cluster is useful to quickly test applications targeted for Linux clusters but are developed on a Windows machine.

## Prerequisites
Linux-based Service Fabric clusters do not run directly on Windows, but to enable cross-platform prototyping we have provided a way to deploy Service Fabric Cluster inside Linux distribution via WSL2 (Windows Subsystem for Linux) for Windows.

Before you get started, you need:

* WSL2 Setup in Windows(https://docs.microsoft.com/en-us/windows/wsl/install) and esnure WSL 2 as default version
* Setup Ubuntu 18.04 Linux Distribution from Microsoft Store

>[!TIP]
> To install WSL2 on your Windows machine, follow the steps in the [WSL documentation](https://docs.microsoft.com/en-us/windows/wsl/install). After installing, please ensure installation of Ubuntu-18.04, make it your default distribution and it should be up and running.
>

## Setup Service Fabric SDK inside Linux Distribution
Service Fabric Setup can not be done in WSL2 Linux Distribution straight forward the way it is done in standard linux OS as systemd as PID1 is not running inside VM and systemd as PID1 is a prerequisite for SF SDK to work successfully. 
To enable systemd as PID1 is systemd-genie is used as work around. More details about systemd-genie can be found here https://github.com/arkane-systems/genie

## Script installation

For convenience, a script is provided to install the Service Fabric runtime and the Service Fabric common SDK along with the [**sfctl** CLI](service-fabric-cli.md). Running the script assumes you agree to the licenses for all the software that is being installed. Alternatively you may run the [Manual installation](#manual-installation) steps in the next section which will present associated licenses as well as the components being installed.

After the script runs successfully, you can skip to [Set up a local cluster](#set-up-a-local-cluster).

```bash
sudo curl -s https://raw.githubusercontent.com/Azure/service-fabric-scripts-and-templates/master/scripts/SetupServiceFabric/SetupServiceFabric.sh | sudo bash
```

## Manual installation
For manual installation of the Service Fabric runtime and common SDK, follow the rest of this guide.

1. Open a terminal.

2. Login into WSL2 Linux Distribution

3. Setup systemd-genie as mentioned in this guide https://github.com/arkane-systems/genie (if systemd-genie is aleady setup, you can jump to next step)

4. Enter into genie namespace using genie -s

5. Inside genie namespace, SF SDK can be installed as standard linux sf installation as mentioned under Script Installation or Manual Installation setps in [Set up a linux local cluster](#service-fabric-get-started-linux)

6. Post successful installation, make sure Service Fabric Version installed on Windows host is >= 5.2.186

7. In host Windows, You can manage your Linux Local Cluster via Local Cluster Manager or you can do the same via deployment scripts prodivded as part of SDK, but make sure WSL2 distribution, systemd-genie in running state while using LCM for Linux Cluster.

8. Open a web browser and go to Service Fabric Explorer (http://localhost:19080/Explorer). When the cluster starts, you see the Service Fabric Explorer dashboard. It might take several minutes for the cluster to be completely set up. 
   If your browser fails to open the URL or if Service Fabric Explorer doesn't show that the system is ready, wait a few minutes and try again. You can also see the cluster in ServiceFabricExplorer provided in SD SDK.

9. Once Cluster is up and running, you can connect to local cluster in Powershell or visual Studio similar to Windows Local Cluster.

## Manual installation with custom ServiceFabric and ServieFabricSdkCommon Debian Package
For manual installation of the Service Fabric runtime and common SDK from custom or downloaded debian packages, follow the rest of this guide.

1. Open a terminal.

2. Login into WSL2 Linux Distribution

3. Clone setup file

```bash
sudo curl -s https://raw.githubusercontent.com/Azure/service-fabric-scripts-and-templates/master/scripts/SetupServiceFabric/SetupServiceFabric.sh > SetupServiceFabric.sh
```

4. Make the file executable

```bash
sudo chmod +x SetupServiceFabric.sh
```

5. Run setup script with local debian packages path. If debian packages are located in Windows host, provide a valid path for linux.
   If packages are located inside VM, then path can be provided as it is, however if they are located inside Windows host at C:\Users\testuser\Downloads\servicefabric.deb and C:\Users\testuser\Downloads\servicefabric_sdkcommon.deb then paths need to be updated and script should called as mentioned below:


```bash
sudo ./SetupServiceFabric.sh --servicefabricruntime=/mnt/c/Users/testuser/Downloads/servicefabric.deb --servicefabricsdk=/mnt/c/Users/testuser/Downloads/servicefabric_sdkcommon.deb
```


### Known Limitations 
 
 The following are known limitations of the local cluster running inside Linux Distribution : 
 
 * Currently Ubuntu-18.04 distribution is only supported.
 * To have a well integrated experience with Local Cluster Manager, Visual Studio from host OS, it is recommended to do manager cluster from windows host only via scripts or local cluster manager.

### Frequently Asked Questions
 
 The following are known limitations of the local cluster running inside Linux Distribution : 
 
 * Currently Ubuntu-18.04 distribution is only supported.
 * To have a well integrated experience with Local Cluster Manager, Visual Studio from host OS, it is recommended to do manager cluster from windows host only via scripts or local cluster manager.


## Next steps
* [Create and deploy your first Service Fabric Java application on Linux using Yeoman](service-fabric-create-your-first-linux-application-with-java.md)
* Get started with [Eclipse](./service-fabric-get-started-eclipse.md)
* Check out other [Java samples](https://github.com/Azure-Samples/service-fabric-java-getting-started)
* Learn about [Service Fabric support options](service-fabric-support.md)


<!-- Image references -->

[publishdialog]: ./media/service-fabric-manage-multiple-environment-app-configuration/publish-dialog-choose-app-config.png
[app-parameters-solution-explorer]:./media/service-fabric-manage-multiple-environment-app-configuration/app-parameters-in-solution-explorer.png
