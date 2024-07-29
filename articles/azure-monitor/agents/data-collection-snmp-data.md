---
title: Collect SNMP trap data with Azure Monitor Agent
description: Learn how to collect SNMP trap data and send the data to Azure Monitor Logs using Azure Monitor Agent.  
ms.topic: how-to
ms.date: 07/12/2024
ms.reviewer: jeffwo

---

# Collect SNMP trap data with Azure Monitor Agent

Simple Network Management Protocol (SNMP) is a widely deployed management protocol for monitoring and configuring Linux devices and appliances. This article describes how to collect SNMP trap data and send it to a Log Analytics workspace using Azure Monitor Agent.
  
You can collect SNMP data in two ways: 

- **Polls** - The managing system polls an SNMP agent to gather values for specific properties. Polls are most often used for stateful health detection and collecting performance metrics.
- **Traps** - An SNMP agent forwards events or notifications to a managing system. Traps are most often used as event notifications.

Azure Monitor agent can't collect SNMP data directly, but you can send this data to one of the following data sources that Azure Monitor agent can collect:

- Syslog. The data is stored in the `Syslog` table with your other syslog data collected by Azure Monitor agent.
- Text file. The data is stored in a custom table that you create. Using a transformation, you can parse the data and store it in a structured format.

:::image type="content" source="media/data-collection-snmp-data/snmp-data-collection.png" lightbox="media/data-collection-snmp-data/snmp-data-collection.png" alt-text="Diagram showing collection of SNMP data by sending it to Syslog or a text file which is then collected by Azure Monitor agent." border="false":::

## Prerequisites


- A Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).

-  Management Information Base (MIB) files for the devices you are monitoring.
    
    SNMP identifies monitored properties using Object Identifier (OID) values, which are defined and described in vendor-provided MIB files.  The device vendor typically provides MIB files. If you don't have the MIB files, you can find the files for many vendors on third-party websites. Some vendors maintain a single MIB for all devices, while others have hundreds of MIB files. 

    Place all MIB files for each device that sends SNMP traps in `/usr/share/snmp/mibs`, the default directory for MIB files. This enables logging SNMP trap fields with meaningful names instead of OIDs. To load an MIB file correctly, snmptrapd must load all dependent MIBs. Be sure to check the snmptrapd log file after loading MIBs to ensure that there are no missing dependencies in parsing your MIB files.  

- A Linux server with an SNMP trap receiver.

    This article uses **snmptrapd**, an SNMP trap receiver from the [Net-SNMP](https://www.net-snmp.org/) agent, which most Linux distributions provide. However, there are many other SNMP trap receiver services you can use. It's important that the SNMP trap receiver you use can load MIB files for your environment, so that the properties in the SNMP trap message have meaningful names instead of OIDs.  

    The snmptrapd configuration procedure may vary between Linux distributions. For more information on snmptrapd configuration, including guidance on configuring for SNMP v3 authentication, see the [Net-SNMP documentation](https://www.net-snmp.org/docs/man/snmptrapd.conf.html).  

    
 
## Set up the trap receiver log options and format


To set up the snmptrapd trap receiver on a Red Hat Enterprise Linux 7 or Oracle Linux 7 server:

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


    
To edit the output behavior configuration of snmptrapd: 

1. Open the `/etc/snmp/snmptrapd.conf` file: 
    
    ```bash
    sudo vi /etc/sysconfig/snmptrapd
    ```    

2. Configure the output destination such as in the following example configuration:   

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

Depending on where you sent SNMP events, use the guidance at one of the following to collect the data with Azure Monitor Agent:

- [Collect Syslog events with Azure Monitor Agent](./data-collection-syslog.md)
- [Collect logs from a text file with Azure Monitor Agent](./data-collection-log-text.md)


## Next steps

Learn more about: 

- [Azure Monitor Agent](azure-monitor-agent-overview.md).
- [Data collection rules](../essentials/data-collection-rule-overview.md).
- [Best practices for cost management in Azure Monitor](../best-practices-cost.md). 
