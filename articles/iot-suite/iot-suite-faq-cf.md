---
title: Connected factory solution FAQ - Azure | Microsoft Docs
description: Frequently asked questions for IoT Suite connected factory
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/15/2017
ms.author: corywink

---
# Frequently asked questions for IoT Suite connected factory preconfigured solution

See also, the general [FAQ](iot-suite-faq.md) for IoT Suite.

### Where can I find the source code for the preconfigured solution?

The source code is stored in the following GitHub repository:

* [Connected factory preconfigured solution](https://github.com/Azure/azure-iot-connected-factory)

### What is OPC UA?

OPC Unified Architecture (UA), released in 2008, is a platform-independent, service-oriented interoperability standard. OPC UA is used by various industrial systems and devices such as industry PCs, PLCs, and sensors. OPC UA integrates the functionality of the OPC Classic specifications into one extensible framework with built-in security. It is a standard that is driven by the OPC Foundation. The [OPC Foundation](http://opcfoundation.org/) is a not-for-profit organization with more than 440 members. The goal of the organization is to use OPC specifications to facilitate multi-vendor, multi-platform, secure and reliable interoperability through:

* Infrastructure
* Specifications
* Technology
* Processes

### Why did Microsoft choose OPC UA for the connected factory preconfigured solution?

Microsoft chose OPC UA because it is an open, non-proprietary, platform independent, industry-recognized, and proven standard. It is a requirement for Industrie 4.0 (RAMI4.0) reference architecture solutions ensuring interoperability between a broad set of manufacturing processes and equipment. Microsoft sees demand from our customers to build Industrie 4.0 solutions. Support for OPC UA helps lower the barrier for customers to achieve their goals and provides immediate business value to them.

### How do I add a public IP address to the simulation VM?

You have two options to add the IP address:

* Use the PowerShell script `Simulation/Factory/Add-SimulationPublicIp.ps1` in the [repository](https://github.com/Azure/azure-iot-connected-factory). Pass in your deployment name as a parameter. For a local deployment, use `<your username>ConnFactoryLocal`. The script prints out the IP address of the VM.

* In the Azure portal, locate the resource group of your deployment. Except for a local deployment, the resource group has the name you specified as solution or deployment name. For a local deployment using the build script, the name of the resource group is `<your username>ConnFactoryLocal`. Now add a new **Public IP address** resource to the resource group.

> [!NOTE]
> In either case, ensure you install the latest patches by following the instructions on the [Ubuntu website](https://wiki.ubuntu.com/Security/Upgrades). Keep the installation up to date for as long as your VM is accessible through a public IP address.

### How do I remove the public IP address to the simulation VM?

You have two options to remove the IP address:

* Use the PowerShell script Simulation/Factory/Remove-SimulationPublicIp.ps1 of the [repository](https://github.com/Azure/azure-iot-connected-factory). Pass in your deployment name as a parameter. For a local deployment, use `<your username>ConnFactoryLocal`. The script prints out the IP address of the VM.

* In the Azure portal, locate the resource group of your deployment. Except for a local deployment, the resource group has the name you specified as solution or deployment name. For a local deployment using the build script, the name of the resource group is `<your username>ConnFactoryLocal`. Now remove the **Public IP address** resource from the resource group.

### How do I sign in to the simulation VM?

Signing in to the simulation VM is only supported if you have deployed your solution using the PowerShell script `build.ps1` in the [repository](https://github.com/Azure/azure-iot-connected-factory).

If you deployed the solution from www.azureiotsuite.com, you cannot sign in to the VM. You cannot sign in, because the password is generated randomly and you cannot reset it.

1. Add a public IP address to the VM. See [How do I add a public IP address to the simulation VM?](#how-do-i-remove-the-public-ip-address-to-the-simulation-vm)
1. Create an SSH session to your VM using the IP address of the VM.
1. The username to use is: `docker`.
1. The password to use depends on the version you used to deploy:
    * For solutions deployed using the build.ps1 script before 1 June 2017, the password is: `Passw0rd`.
    * For solutions deployed using the build.ps1 script after 1 June 2017, you can find the password in the `<name of your deployment>.config.user` file. The password is stored in the **VmAdminPassword** setting. The password is generated randomly at deployment time unless you specify it using the `build.ps1` script parameter `-VmAdminPassword`

### How do I stop and start all docker processes in the simulation VM?

1. Sign in to the simulation VM. See [How do I sign in to the simulation VM?](#how-do-i-sign-in-to-the-simulation-vm)
1. To check which containers are active, run: `docker ps`.
1. To stop all simulation containers, run: `./stopsimulation`.
1. To start all simulation containers:
    * Export a shell variable with the name **IOTHUB_CONNECTIONSTRING**. Use the value of the **IotHubOwnerConnectionString** setting in the `<name of your deployment>.config.user` file. For example:

        ```
        export IOTHUB_CONNECTIONSTRING="HostName={yourdeployment}.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey={your key}"
        ```

    * Run `./startsimulation`.

### How do I update the simulation in the VM?

If you have made any changes to the simulation, you can use the PowerShell script `build.ps1` in the [repository](https://github.com/Azure/azure-iot-connected-factory) using the `updatedimulation` command. This script builds all the simulation components, stops the simulation in the VM, uploads, installs, and starts them.

### How do I find out the connection string of the IoT hub used by my solution?

If you deployed your solution with the `build.ps1` script in the [repository](https://github.com/Azure/azure-iot-connected-factory), the connection string is the value of **IotHubOwnerConnectionString** in the `<name of your deployment>.config.user` file.

You can also find the connection string using the Azure portal. In the IoT Hub resource in the resource group of your deployment, locate the connection string settings.

### Which IoT Hub devices does the Connected factory simulation use?

The simulation self registers the following devices:

* proxy.beijing.corp.contoso
* proxy.capetown.corp.contoso
* proxy.mumbai.corp.contoso
* proxy.munich0.corp.contoso
* proxy.rio.corp.contoso
* proxy.seattle.corp.contoso
* publisher.beijing.corp.contoso
* publisher.capetown.corp.contoso
* publisher.mumbai.corp.contoso
* publisher.munich0.corp.contoso
* publisher.rio.corp.contoso
* publisher.seattle.corp.contoso

Using the [DeviceExplorer](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/tools/DeviceExplorer) or [iothub-explorer](https://github.com/azure/iothub-explorer) tool, you can check which devices are registered with the IoT hub your solution is using. To use these tools, you need the connection string for the IoT hub in your deployment.

### How can I get log data from the simulation components?

All components in the simulation log information in to log files. These files can be found in the VM in the folder `home/docker/Logs`. To retrieve the logs, you can use the PowerShell script `Simulation/Factory/Get-SimulationLogs.ps1` in the [repository](https://github.com/Azure/azure-iot-connected-factory).

This script needs to sign in to the VM. You may need to provide credentials for the sign-in. See [How do I sign in to the simulation VM?](#how-do-i-sign-in-to-the-simulation-vm) to find the credentials.

The script adds/removes a public IP address to the VM, if it does not yet have one and removes it. The script puts all log files in an archive and downloads the archive to your development workstation.

Alternatively log in to the VM via SSH and inspect the log files at runtime.

### How can I check if the simulation is sending data to the cloud?

With the [DeviceExplorer](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/tools/DeviceExplorer) or the [iothub-explorer](https://github.com/azure/iothub-explorer) tool, you can inspect the data sent to IoT Hub from certain devices. To use these tools, you need to know the connection string for the IoT hub in your deployment. See [How do I find out the connection string of the IoT hub used by my solution?](#how-do-i-find-out-the-connection-string-of-the-iot-hub-used-by-my-solution)

Inspect the data sent by one of the publisher devices:

* publisher.beijing.corp.contoso
* publisher.capetown.corp.contoso
* publisher.mumbai.corp.contoso
* publisher.munich0.corp.contoso
* publisher.rio.corp.contoso
* publisher.seattle.corp.contoso

If you see no data sent to IoT Hub, then there is an issue with the simulation. As a first analysis step you should analyze the log files of the simulation components. See [How can I get log data from the simulation components?](#how-can-i-get-log-data-from-the-simulation-components) Next, try to stop and start the simulation and if there's still no data sent, update the simulation completely. See [How do I update the simulation in the VM?](#how-do-i-update-the-simulation-in-the-vm)

### Next steps

You can also explore some of the other features and capabilities of the IoT Suite preconfigured solutions:

* [Predictive maintenance preconfigured solution overview](iot-suite-predictive-overview.md)
* [Connected factory preconfigured solution overview](iot-suite-connected-factory-overview.md)
* [IoT security from the ground up](securing-iot-ground-up.md)