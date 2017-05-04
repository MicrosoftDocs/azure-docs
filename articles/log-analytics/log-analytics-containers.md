---
title: Containers solution in Azure Log Analytics | Microsoft Docs
description: The Containers solution in Log Analytics helps you view and manage your Docker and Windows container hosts in a single location.
services: log-analytics
documentationcenter: ''
author: bandersmsft
manager: carmonm
editor: ''
ms.assetid: e1e4b52b-92d5-4bfa-8a09-ff8c6b5a9f78
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/24/2017
ms.author: banders

---
# Containers (Preview) solution Log Analytics
This article describes how to set up and use the Containers solution in Log Analytics, which helps you view and manage your Docker and Windows container hosts in a single location. Docker is a software virtualization system used to create containers that automate software deployment to their IT infrastructure.

With the solution, you can see which containers are running on your container hosts and what images are running in the containers. You can view detailed audit information showing commands used with containers. And, you can troubleshoot containers by viewing and searching centralized logs without having to remotely view Docker or Windows hosts. You can find containers that may be noisy and consuming excess resources on a host. And, you can view centralized CPU, memory, storage, and network usage and performance information for containers. On computers running Windows, you can centralize and compare logs from Windows Server, Hyper-V, and Docker containers.

The following diagram shows the relationships between various container hosts and agents with OMS.

![Containers diagram](./media/log-analytics-containers/containers-diagram.png)

## Installing and configuring the solution
Use the following information to install and configure the solution.

Add the Containers solution to your OMS workspace from [Azure marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.ContainersOMS?tab=Overview) or by using the process described in [Add Log Analytics solutions from the Solutions Gallery](log-analytics-add-solutions.md).

There are a few ways to install and use Docker with OMS:

* On supported Linux operating systems, install and run Docker and then install and configure the OMS Agent for Linux.
* On CoreOS, you cannot run the OMS Agent for Linux. Instead, you run a containerized version of the OMS Agent for Linux.
* On Windows Server 2016 and Windows 10, install the Docker Engine and client then connect an agent to gather information and send it to Log Analytics.


You can review the supported Docker and Linux operating system versions for your container host on [GitHub](https://github.com/Microsoft/OMS-docker).

If you have a Kubernetes cluster using the Azure Container Service, learn more at  [Monitor an Azure Container Service cluster with Microsoft Operations Management Suite (OMS)](../container-service/container-service-kubernetes-oms.md).

If you have an Azure Container Service DC/OS cluster, learn more at [Monitor an Azure Container Service DC/OS cluster with Operations Management Suite](../container-service/container-service-monitoring-oms.md).

Review the [Docker Engine on Windows](https://docs.microsoft.com/virtualization/windowscontainers/manage-docker/configure-docker-daemon) article for additional information about how to install and configure your Docker Engines on computers running Windows.

> [!IMPORTANT]
> Docker must be running **before** you install the [OMS Agent for Linux](log-analytics-linux-agents.md) on your container hosts. If you've already installed the agent before installing Docker, you'll need to reinstall the OMS Agent for Linux. For more information about Docker, see the [Docker website](https://www.docker.com).
>
>

You need the following settings configured on your container hosts before you can monitor containers.

## Configure settings for a Linux container host

The following x64 Linux distributions are supported as container hosts:

- Ubuntu 14.04 LTS, 16.04 LTS
- CoreOS(stable)
- Amazon Linux 2016.09.0
- openSUSE 13.2
- CentOS 7
- SLES 12
- RHEL 7.2

After you've installed Docker, use the following settings for your container host to configure the agent for use with Docker. You'll need your [OMS workspace ID and key](log-analytics-linux-agents.md).


### For all Linux container hosts except CoreOS

- Follow the instructions at  [Steps to install the OMS Agent for Linux](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/OMS-Agent-for-Linux.md).

### For all Linux container hosts including CoreOS

Start the OMS container that you want to monitor. Modify and use the following example.

```
sudo docker run --privileged -d -v /var/run/docker.sock:/var/run/docker.sock -e WSID="your workspace id" -e KEY="your key" -h=`hostname` -p 127.0.0.1:25225:25225 --name="omsagent" --restart=always microsoft/oms
```

### Switching from using an installed Linux agent to one in a container
If you previously used the directly-installed agent and want to instead use an agent running in a container, you must first remove OMSAgent. See [Steps to install the OMS Agent for Linux](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/OMS-Agent-for-Linux.md).

## Supported Windows versions

- Windows Server 2016
- Windows 10 Anniversary Edition (Professional or Enterprise)

### Docker versions supported on Windows

- Docker 1.12 – 1.13

### Preparation before installing agents

Before you install agents on computers running Windows, you need to configure the Docker service. The configuration allows the Windows agent or the Log Analytics virtual machine extension to use the Docker TCP socket so that the agents can access the Docker daemon remotely and to capture data for monitoring.

For more information about configuring the Docker daemon with Windows, see [Docker Engine on Windows](https://docs.microsoft.com/virtualization/windowscontainers/manage-docker/configure-docker-daemon).

#### To start Docker and verify its configuration

1.	In Windows PowerShell, enable TCP pipe and named pipe.

    ```
    Stop-Service docker
    dockerd --unregister-service
    dockerd -H npipe:// -H 0.0.0.0:2375 --register-service
    Start-Service docker
    ```

2.	Verify your configuration with netstat. You should see port 2375.

    ```
    PS C:\Users\User1> netstat -a | sls 2375

    TCP    127.0.0.1:2375         Win2016TP5:0           LISTENING
    TCP    127.0.0.1:2375         Win2016TP5:49705       ESTABLISHED
    TCP    127.0.0.1:2375         Win2016TP5:49706       ESTABLISHED
    TCP    127.0.0.1:2375         Win2016TP5:49707       ESTABLISHED
    TCP    127.0.0.1:2375         Win2016TP5:49708       ESTABLISHED
    TCP    127.0.0.1:49705        Win2016TP5:2375        ESTABLISHED
    TCP    127.0.0.1:49706        Win2016TP5:2375        ESTABLISHED
    TCP    127.0.0.1:49707        Win2016TP5:2375        ESTABLISHED
    TCP    127.0.0.1:49708        Win2016TP5:2375        ESTABLISHED
    ```

### Install Windows agents

To enable Windows and Hyper-V container monitoring, install agents on Windows computers that are container hosts. For computers running Windows in your on-premises environment, see [Connect Windows computers to Log Analytics](log-analytics-windows-agents.md). For virtual machines running in Azure,  connect them to Log Analytics using the [virtual machine extension](log-analytics-azure-vm-extension.md).

To verify that the Containers solution is set correctly:

- Check whether the management pack was download properly, look for *ContainerManagement.xxx*.
    - The files should be in the C:\Program Files\Microsoft Monitoring Agent\Agent\Health Service State\Management Packs folder.
- Verify that the OMS Workspace ID is correct by going to **Control Panel** > **System and Security**.
    - Open **Microsoft Monitoring Agent** and verify that the workspace information is correct.


## Containers data collection details
The Containers solution collects various performance metrics and log data from container hosts and containers using agents that you  enable.

The following table shows data collection methods and other details about how data is collected for Containers.

| platform | [OMS Agent for Linux](log-analytics-linux-agents.md) | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
| --- | --- | --- | --- | --- | --- | --- |
| Linux |![Yes](./media/log-analytics-containers/oms-bullet-green.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |every 3 minutes |

| platform | [Windows agent](log-analytics-windows-agents.md) | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
| --- | --- | --- | --- | --- | --- | --- |
| Windows |![Yes](./media/log-analytics-containers/oms-bullet-green.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |every 3 minutes |

| platform | [Log Analytics VM extension](log-analytics-azure-vm-extension.md) | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
| --- | --- | --- | --- | --- | --- | --- |
| Azure |![Yes](./media/log-analytics-containers/oms-bullet-green.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |![No](./media/log-analytics-containers/oms-bullet-red.png) |every 3 minutes |

The following table show examples of data types collected by the Containers solution and the data types that are used in Log Searches and results.

| Data type | Data type in Log Search | Fields |
| --- | --- | --- |
| Performance for hosts and containers | `Type=Perf` | Computer, ObjectName, CounterName &#40;%Processor Time, Disk Reads MB, Disk Writes MB, Memory Usage MB, Network Receive Bytes, Network Send Bytes, Processor Usage sec, Network&#41;, CounterValue,TimeGenerated, CounterPath, SourceSystem |
| Container inventory | `Type=ContainerInventory` | TimeGenerated, Computer, container name, ContainerHostname, Image, ImageTag, ContinerState, ExitCode, EnvironmentVar, Command, CreatedTime, StartedTime, FinishedTime, SourceSystem, ContainerID, ImageID |
| Container image inventory | `Type=ContainerImageInventory` | TimeGenerated, Computer, Image, ImageTag, ImageSize, VirtualSize, Running, Paused, Stopped, Failed, SourceSystem, ImageID, TotalContainer |
| Container log | `Type=ContainerLog` | TimeGenerated, Computer, image ID, container name, LogEntrySource, LogEntry, SourceSystem, ContainerID |
| Container service log | `Type=ContainerServiceLog`  | TimeGenerated, Computer, TimeOfCommand, Image, Command, SourceSystem, ContainerID |

## Monitor containers
After you have the solution enabled in the OMS portal, you'll see the **Containers** tile showing summary information about your container hosts and the containers running in hosts.

![Containers tile](./media/log-analytics-containers/containers-title.png)

The tile shows an overview of how many containers you have in the environment and whether they're failed, running, or stopped.

### Using the Containers dashboard
Click the **Containers** tile. From there you'll see views organized by:

* Container Events
* Errors
* Containers Status
* Container Image Inventory
* CPU and Memory performance

Each pane in the dashboard is a visual representation of a search that is run on collected data.

![Containers dashboard](./media/log-analytics-containers/containers-dash01.png)

![Containers dashboard](./media/log-analytics-containers/containers-dash02.png)

In the **Container Status** blade, click to top area, as shown below.

![Containers status](./media/log-analytics-containers/containers-status.png)

Log Search opens, displaying information about the hosts and containers running in them.

![Log Search for containers](./media/log-analytics-containers/containers-log-search.png)

From here, you can edit the search query to modify it to find the specific information you're interested in. For more information about Log Searches, see [Log searches in Log Analytics](log-analytics-log-searches.md).

For example, you can modify the search query so that it shows all the stopped containers instead of the running containers by changing **Running** to **Stopped** in the search query.

## Troubleshoot by finding a failed container
OMS marks a container as **Failed** if it has exited with a non-zero exit code. You can see an overview of the errors and failures in the environment in the **Failed Containers** blade.

### To find failed containers
1. Click the **Container Events** blade.  
   ![containers events](./media/log-analytics-containers/containers-events.png)
2. Log Search opens, displaying the status of containers, similar to the following.  
   ![containers state](./media/log-analytics-containers/containers-container-state.png)
3. Next, click the failed value to view additional information such as image size and number of stopped and failed images. Expand **show more** to view the image ID.  
   ![failed containers](./media/log-analytics-containers/containers-state-failed.png)
4. Next, find the container that is running this image. Type the following into the search query.
   `Type=ContainerInventory <ImageID>`
   This displays the logs. You can scroll to see the failed container.  
   ![failed containers](./media/log-analytics-containers/containers-failed04.png)

## Search logs for container data
When you're troubleshooting a specific error, it can help to see where it is occurring in your environment. The following log types will help you create queries to return the information you want.

* **ContainerInventory** – Use this type when you want information about container location, what their names are, and what images they're running.
* **ContainerImageInventory** – Use this type when you're trying to find information organized by image and to view image information such as image IDs or sizes.
* **ContainerLog** – Use this type when you want to find specific error log information and entries.
* **ContainerServiceLog** – Use this type when you're trying to find audit trail information for the Docker daemon, such as start, stop, delete, or pull commands.

### To search logs for container data
* Choose an image that you know has failed recently and find the error logs for it. Start by finding a container name that is running that image with a **ContainerInventory** search. For example, search for `Type=ContainerInventory ubuntu Failed`  
    ![Search for Ubuntu containers](./media/log-analytics-containers/search-ubuntu.png)

  Note the name of the container next to **Name**, and search for those logs. In this example, it is `Type=ContainerLog adoring_meitner`.

**View performance information**

When you're beginning to construct queries, it can help to see what's possible first. For example, to see all performance data, try a broad query by typing the following search query.

```
Type=Perf
```

![containers performance](./media/log-analytics-containers/containers-perf01.png)

You can see this in a more graphical form when you click the word **Metrics** in the results.

![containers performance](./media/log-analytics-containers/containers-perf02.png)

You can scope the performance data you're seeing to a specific container by typing the name of it to the right of your query.

```
Type=Perf <containerName>
```

That shows the list of performance metrics that are collected for an individual container.

![containers performance](./media/log-analytics-containers/containers-perf03.png)

## Example log search queries
It's often useful to build queries starting with an example or two and then modifying them to fit your environment. As a starting point, you can experiment with the **Notable Queries** blade to help you build more advanced queries.

![Containers queries](./media/log-analytics-containers/containers-queries.png)

## Saving log search queries
Saving queries is a standard feature in Log Analytics. By saving them, you'll have those that you've found useful handy for future use.

After you create a query that you find useful, save it by clicking **Favorites** at the top of the Log Search page. Then you can easily access it later from the **My Dashboard** page.

## Next steps
* [Search logs](log-analytics-log-searches.md) to view detailed container data records.
