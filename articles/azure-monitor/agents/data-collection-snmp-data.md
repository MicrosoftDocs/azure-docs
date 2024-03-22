---
title: Collect SNMP trap data with Azure Monitor Agent
description: Learn how to collect SNMP trap data and send the data to Azure Monitor Logs using Azure Monitor Agent.  
ms.topic: how-to
ms.date: 07/19/2023
ms.reviewer: jeffwo

---

# Collect SNMP trap data with Azure Monitor Agent

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).
  
Simple Network Management Protocol (SNMP) is a widely-deployed management protocol for monitoring and configuring Linux devices and appliances.  
  
You can collect SNMP data in two ways: 

- **Polls** - The managing system polls an SNMP agent to gather values for specific properties.
- **Traps** - An SNMP agent forwards events or notifications to a managing system. 

Traps are most often used as event notifications, while polls are more appropriate for stateful health detection and collecting performance metrics.  
  
You can use Azure Monitor Agent to collect SNMP traps as syslog events or as events logged in a text file.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up the trap receiver log options and format 
> * Configure the trap receiver to send traps to syslog or text file
> * Collect SNMP traps using Azure Monitor Agent

## Prerequisites

To complete this tutorial, you need: 

- A Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).

-  Management Information Base (MIB) files for the devices you are monitoring.
    
    SNMP identifies monitored properties using Object Identifier (OID) values, which are defined and described in vendor-provided MIB files.  

    The device vendor typically provides MIB files. If you don't have the MIB files, you can find the files for many vendors on third-party websites.

    Place all MIB files for each device that sends SNMP traps in `/usr/share/snmp/mibs`, the default directory for MIB files. This enables logging SNMP trap fields with meaningful names instead of OIDs. 

    Some vendors maintain a single MIB for all devices, while others have hundreds of MIB files. To load an MIB file correctly, snmptrapd must load all dependent MIBs. Be sure to check the snmptrapd log file after loading MIBs to ensure that there are no missing dependencies in parsing your MIB files.  

- A Linux server with an SNMP trap receiver.

    In this article, we use **snmptrapd**, an SNMP trap receiver from the [Net-SNMP](https://www.net-snmp.org/) agent, which most Linux distributions provide. However, there are many other SNMP trap receiver services you can use.

    The snmptrapd configuration procedure may vary between Linux distributions. For more information on snmptrapd configuration, including guidance on configuring for SNMP v3 authentication, see the [Net-SNMP documentation](https://www.net-snmp.org/docs/man/snmptrapd.conf.html).  

    It's important that the SNMP trap receiver you use can load MIB files for your environment, so that the properties in the SNMP trap message have meaningful names instead of OIDs.  
 
## Set up the trap receiver log options and format

To set up the snmptrapd trap receiver on a CentOS 7, Red Hat Enterprise Linux 7, Oracle Linux 7 server:

1. Install and enable snmptrapd: 

    ```bash
    #Install the SNMP agent
    sudo yum install net-snmp
    #Enable the service
    sudo systemctl enable snmptrapd
    #Allow UDP 162 through the firewall
    sudo firewall-cmd --zone=public --add-port=162/udp --permanent
    ```

1. Authorize community strings (SNMP v1 and v2 authentication strings) and define the format for the traps written to the log file: 
  
    1. Open `snmptrapd.conf`: 
    
        ```bash
        sudo vi /etc/snmp/snmptrapd.conf  
        ```        

    1.  Add these lines to your `snmptrapd.conf` file: 
    
        ```bash
        # Allow all traps for all OIDs, from all sources, with a community string of public
        authCommunity log,execute,net public
        # Format logs for collection by Azure Monitor Agent
        format2 snmptrap %a %B %y/%m/%l %h:%j:%k %N %W %q %T %W %v \n
        ```

        > [!NOTE]
        > snmptrapd logs both traps and daemon messages - for example, service stop and start - to the same log file. In the example above, we’ve defined the log format to start with the word “snmptrap” to make it easy to filter snmptraps from the log later on. 
## Configure the trap receiver to send trap data to syslog or text file

There are two ways snmptrapd can send SNMP traps to Azure Monitor Agent: 

- Forward incoming traps to syslog, which you can set as the data source for Azure Monitor Agent. 

- Write the syslog messages to a file, which Azure Monitor Agent can *tail* and parse. This option allows you to send the SNMP traps as a new datatype rather than sending as syslog events.  
    
To edit the output behavior configuration of snmptrapd: 

1. Open the `/etc/snmp/snmptrapd.conf` file: 
    
    ```bash
    sudo vi /etc/sysconfig/snmptrapd
    ```    

1. Configure the output destination.

   Here's an example configuration:   

    ```bash        
    # snmptrapd command line options
    # '-f' is implicitly added by snmptrapd systemd unit file
    # OPTIONS="-Lsd"
    OPTIONS="-m ALL -Ls2 -Lf /var/log/snmptrapd"
    ```  
        
    The options in this example configuration are:  
    
    - `-m ALL` - Load all MIB files in the default directory.
    - `-Ls2` - Output traps to syslog, to the Local2 facility.
    - `-Lf /var/log/snmptrapd` - Log traps to the `/var/log/snmptrapd` file. 
    
> [!NOTE]   
> See Net-SNMP documentation for more information about [how to set output options](https://www.net-snmp.org/docs/man/snmpcmd.html) and [how to set formatting options](https://www.net-snmp.org/docs/man/snmptrapd.html). 
    
## Collect SNMP traps using Azure Monitor Agent

If you configured snmptrapd to send events to syslog, follow the steps described in [Collect events and performance counters with Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md). Make sure to select **Linux syslog** as the data source when you define the data collection rule for Azure Monitor Agent.

If you configured snmptrapd to write events to a file, follow the steps described in [Collect text logs with Azure Monitor Agent](../agents/data-collection-text-log.md).

## Next steps

Learn more about: 

- [Azure Monitor Agent](azure-monitor-agent-overview.md).
- [Data collection rules](../essentials/data-collection-rule-overview.md).
- [Best practices for cost management in Azure Monitor](../best-practices-cost.md). 
