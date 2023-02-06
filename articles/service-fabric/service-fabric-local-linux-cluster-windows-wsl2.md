---
title: Set up Azure Service Fabric Linux cluster on WSL2 linux distribution inside Windows 
description: This article covers how to set up Service Fabric Linux clusters inside WSL2 linux distribution running on Windows development machines. This approach is useful for cross-platform development.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022

# Maintainer notes: Keep these documents in sync:
# service-fabric-get-started-linux.md
# service-fabric-get-started-mac.md
# service-fabric-local-linux-cluster-windows.md
# service-fabric-local-linux-cluster-windows-wsl2.md
---

# Set up a Linux Service Fabric cluster via WSL2 on your Windows developer machine

This document covers how to set up a local Linux Service Fabric cluster via WSL2 on a Windows development machine. Setting up a local Linux cluster is useful to quickly test applications targeted for Linux clusters but are developed on a Windows machine.

## Prerequisites
Linux based Service Fabric clusters do not run directly on Windows, but to enable cross-platform prototyping we have provided a way to deploy Service Fabric Cluster inside Linux distribution via WSL2 (Windows Subsystem for Linux) for Windows.

Before you get started, you need:

* WSL2 Set up in Windows and ensure WSL 2 as default version
* Set up Ubuntu 18.04 Linux Distribution from Microsoft Store while setting up WSL2

>[!TIP]
> To install WSL2 on your Windows machine, follow the steps in the [WSL documentation](/windows/wsl/install). After installing, please ensure installation of Ubuntu-18.04, make it your default distribution and it should be up and running.
>

## Set up Service Fabric SDK inside Linux Distribution
Service Fabric Setup cannot be done in WSL2 Linux Distribution the way it is done in standard linux OS. Because systemd as PID1 is not running inside VM and systemd as PID1 is a prerequisite for SF SDK to work successfully.
To enable systemd as PID1, systemd-genie is used as work-around. More details about systemd-genie can be found at [systemd genie setup](https://github.com/arkane-systems/genie) Script installation and manual installation steps cover installation of systemd-genie and service fabric sdk both.

## Script installation

For convenience, a script is provided to install the Service Fabric common SDK along with the [**sfctl** CLI](service-fabric-cli.md). Running the script assumes you agree to the licenses for all the software that is being installed. Alternatively you may run the [Manual installation](#manual-installation) steps in the next section, which will present associated licenses and the components being installed.

After the script runs successfully, you can skip to [Set up a local cluster](#set-up-a-local-cluster).

```bash
sudo curl -s https://raw.githubusercontent.com/Azure/service-fabric-scripts-and-templates/master/scripts/SetupServiceFabric/SetupServiceFabric.sh | sudo bash
```

## Manual installation
For manual installation of the Service Fabric runtime and common SDK, follow the rest of this guide.

1. Open a terminal.

2. Login into WSL2 Linux Distribution

3. Set up systemd-genie as mentioned in [systemd genie setup](https://github.com/arkane-systems/genie) (if systemd-genie is already set up, you can jump to next step)

4. Enter into genie namespace using genie -s

5. Inside genie namespace, SF SDK can also be installed as mentioned under Script Installation or Manual Installation steps in [Set up a linux local cluster](service-fabric-get-started-linux.md)

6. Provide sudo privileges to current user by making an entry `<USERNAME\> ALL = (ALL) NOPASSWD:ALL` in /etc/sudoers

## Set up a local cluster
Service Fabric inside WSL2 VM is recommended to manage from host windows

1. Install Service Fabric SDK (version 6.0 or above) in Windows host

2. In Windows, cluster can be managed using ServiceFabricLocalClusterManager tool provided as part of SF SDK

3. Option to manage Linux Local Cluster is enabled only when a. WSL2 VM is running, b. Systemd-genie, servicefabricruntime, and servicefabricsdkcommon packages are properly installed inside VM and c. Systemd-genie is in running state. You can set up or switch to Linux Local Cluster from this tool.

4. Another way of setting up linux cluster is to deploy using cluster setup scripts provided as part SF SDK.

5. Open a web browser and go to Service Fabric Explorer ``http://localhost:19080``. When the cluster starts, you see the Service Fabric Explorer dashboard. It might take several minutes for the cluster to be set up.
   If your browser fails to open the URL or Service Fabric Explorer doesn't show the cluster, wait for a few minutes and try again. You can also see the cluster in ServiceFabricExplorer provided in SF SDK.

6. Once Cluster is up and running, you can connect to local cluster in PowerShell and Visual Studio.


## Manual installation with custom ServiceFabric and ServieFabricSdkCommon Debian Package
For manual installation of the Service Fabric from custom or downloaded debian packages, follow the rest of this guide.

1. Open a terminal.

2. Login into WSL2 Linux Distribution

3. Clone set up file

```bash
sudo curl -s https://raw.githubusercontent.com/Azure/service-fabric-scripts-and-templates/master/scripts/SetupServiceFabric/SetupServiceFabric.sh > SetupServiceFabric.sh
```

4. Make the file executable

```bash
sudo chmod +x SetupServiceFabric.sh
```

5. Run set up script with local debian packages path. Make sure that paths provided are valid. Below is an example:

```bash
sudo ./SetupServiceFabric.sh --servicefabricruntime=/mnt/c/Users/testuser/Downloads/servicefabric.deb --servicefabricsdk=/mnt/c/Users/testuser/Downloads/servicefabric_sdkcommon.deb
```


### Known Limitations 
 
 The following are known limitations of the local cluster running inside Linux Distribution: 
 
 * Currently Ubuntu-18.04 distribution is only supported.
 * To have a seamless experience with Local Cluster Manager and Visual Studio, it is recommended to manage cluster from PowerShell scripts or LocalClusterManager in Windows host.

### Frequently Asked Questions
 
 1. What linux distributions are supported for SF Local Cluster Set up?  
    Currently, only Ubuntu-18.04 is supported for linux local cluster.

 2. Can Windows and Linux SF Cluster be run in parallel with WSL2 setup?  
    No, at one time only one local cluster can be run either in host or in guest VM.

 3. How to deploy one node linux local cluster?  
    One node or five node linux local cluster can be deployed from Local Cluster Manager from the menu options. While deploying from setup script, five node cluster is deployed by default and for one node cluster CreateOneNodeCluster should be passed.

 4. How to connect to Linux Local Cluster in PowerShell and Visual Studio?  
    If linux local cluster is up and running, connect-servicefabriccluster cmdlet should automatically connect to this cluster. Similar Visual Studio will automatically detect this local cluster.
    This cluster can also be connected by providing cluster endpoint in PowerShell or visual studio.

 5. Where is SF Cluster data is located for linux local cluster?  
    If using Ubuntu-18.04 distribution, SF data is located at \\wsl$\Ubuntu-18.04\home\sfuser\sfdevcluster from Windows host.

## Next steps
* Learn about [Service Fabric support options](service-fabric-support.md)
