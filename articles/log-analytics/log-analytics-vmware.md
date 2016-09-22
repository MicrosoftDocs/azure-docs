<properties
	pageTitle="VMware solution in Log Analytics | Microsoft Azure"
	description="Learn about how the VMware solution can help manage logs and monitor ESXi hosts."
	services="log-analytics"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/21/2016"
	ms.author="banders"/>

# VMware (Preview) solution in Log Analytics

The VMware solution in Log Analytics is a solution that helps you create a centralized logging and monitoring approach for large VMware logs. This article describes how you can troubleshoot, capture, and manage the ESXi hosts in a single location using the solution. With the solution, you can see detailed data for all your ESXi hosts in a single location. You can see top event counts, status, and trends of VM and ESXi hosts provided through the ESXi host logs. You can troubleshoot by viewing and searching centralized ESXi host logs. And, you can create alerts based on log search queries.

## Installing and configuring the solution

Use the following information to install and configure the solution.

- Add the VMware solution to your OMS workspace using the process described in [Add Log Analytics solutions from the Solutions Gallery](log-analytics-add-solutions.md).

#### Supported VMware ESXi hosts
vSphere ESXi Host 5.5 and 6.0

#### Prepare a Linux server
Create a Linux operating system VM to receive all syslog data from the ESXi hosts. The [OMS Linux Agent](log-analytics-linux-agents.md) is the collection point for all ESXi host syslog data. You can use multiple ESXi hosts to forward logs to a single Linux server, as in the following example.  

   ![syslog flow](./media/log-analytics-vmware/diagram.png)

### Configure syslog collection

1. Set up syslog forwarding for VSphere. For detailed information to help set up syslog forwarding, see [Configuring syslog on ESXi 5.x and 6.0 (2003322)](https://kb.vmware.com/selfservice/microsites/search.do?language=en_US&cmd=displayKC&externalId=2003322). Go to **ESXi Host Configuration** > **Software** > **Advanced Settings** > **Syslog**.
  ![vsphereconfig](./media/log-analytics-vmware/vsphere1.png)  

2. In the *Syslog.global.logHost* field, add your Linux server and the port number *1514*. For example, `tcp://hostname:1514` or `tcp://123.456.789.101:1514`

3. Open the ESXi host firewall for syslog. **ESXi Host Configuration** > **Software** > **Security Profile** > **Firewall** and open **Properties**.  

    ![vspherefw](./media/log-analytics-vmware/vsphere2.png)  

    ![vspherefwproperties](./media/log-analytics-vmware/vsphere3.png)  

4. Check the vSphere Console to verify that that syslog is properly set up. Confirm on the ESXI host that port **1514** is configured.

5. Test the connectivity between the Linux server and the ESXi host by using the `nc` command on the ESXi Host. For example:

    ```
    [root@ESXiHost:~] nc -z 123.456.789.101 1514
    Connection to 123.456.789.101 1514 port [tcp/*] succeeded!
    ```

6. Download and install the OMS Agent for Linux on the Linux server. See [documentation for OMS Agent for Linux](https://github.com/Microsoft/OMS-Agent-for-Linux) for more information.

7. In the OMS Portal, perform a log search for `Type=VMware_CL`. When OMS collects the syslog data, it retains the syslog format. In the portal, some specific fields are captured, such as *Hostname* and *ProcessName*.  

    ![type](./media/log-analytics-vmware/type.png)  

    If your view log search results are similar to the image above, you're set to use the OMS VMware solution dashboard.  

## VMware solution overview

The VMware tile appears in the OMS portal. It provides a high-level view of any failures. When you click the tile, you go into a dashboard view.

![tile](./media/log-analytics-vmware/tile.png)

#### Navigate the dashboard view

In the **VMware** dashboard view, blades are organized by:

- Failure Status Count
- Top Host by Event Counts
- Top Event Counts
- Virtual Machine Activities
- ESXi Host Disk Events


![solution1](./media/log-analytics-vmware/solutionview1-1.png)

![solution2](./media/log-analytics-vmware/solutionview1-2.png)

Click any blade to open Log Analytics search pane that shows detailed information specific for the blade.

From here, you can edit the search query to modify it for something specific. For a tutorial on the basics of OMS search, check out the [OMS log search tutorial.](log-analytics-log-searches.md)

#### Find ESXi host events

A single ESXi host generates multiple logs, based on their processes. The VMware solution centralizes them and summarizes the event counts. This centralized view helps you understand which ESXi host has a high volume of events and what events occur most frequently in your environment.

![event](./media/log-analytics-vmware/events.png)

You can drill further by clicking an ESXi host or an event type.

When you click an ESXi host name, you view information from that ESXi host. If you want to narrow results with the event type, add `“ProcessName_s=EVENT TYPE”` in your search query. You can select **ProcessName** in the search filter. That narrows the information for you.

![drill](./media/log-analytics-vmware/eventhostdrilldown.png)

#### Find high VM activities

A virtual machine can be created and deleted on any ESXi host. It's helpful for an administrator to identify how many VMs an ESXi host creates. That in-turn, helps to understand performance and capacity planning. Keeping track of VM activity events is crucial when managing your environment.

![drill](./media/log-analytics-vmware/vmactivities1.png)

If you want to see additional ESXi host VM creation data, click an ESXi host name.

![drill](./media/log-analytics-vmware/createvm.png)

#### Common search queries

The solution includes other useful queries that can help you manage your ESXi hosts, such as high storage space, storage latency, and path failure.

![queries](./media/log-analytics-vmware/queries.png)

#### Save queries

Saving search queries is a standard feature in OMS and can help you keep any queries that you’ve found useful. After you create a query that you find useful, save it by clicking the **Favorites**. A saved query lets you easily reuse it later from the [My Dashboard](log-analytics-dashboards.md) page where you can create your own custom dashboards.

![DockerDashboardView](./media/log-analytics-vmware/dockerdashboardview.png)

#### Create alerts from queries

After you’ve created your queries, you might want to use the queries to alert you when specific events occur. See [Alerts in Log Analytics](log-analytics-alerts.md) for information about how to create alerts. For examples of alerting queries and other query examples, see the [Monitor VMware using OMS Log Analytics](https://blogs.technet.microsoft.com/msoms/2016/06/15/monitor-vmware-using-oms-log-analytics) blog post.


## Next steps

- Use [Log Searches](log-analytics-log-searches.md) in Log Analytics to view detailed VMware host data.
- [Create your own dashboards](log-analytics-dashboards.md) showing VMware host data.
- [Create alerts](log-analytics-alerts.md) when specific VMware host events occur.
