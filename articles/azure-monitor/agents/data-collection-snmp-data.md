---
title: Collect SNMP data with with Azure Monitor Agent
description: Learn how to use Azure Monitor Agent to collect SNMP data.  
ms.topic: how-to
ms.date: 06/22/2022
ms.reviewer: shseth

---

# Collect SNMP data with Azure Monitor Agent
  
The Simple Network Management Protocol (SNMP) is a widely-deployed management protocol for monitoring and configuring devices. While higher-level management protocols and daemons are typically used for servers, SNMP is often a viable option for monitoring devices and appliances.  
  
You can collect SNMP data in two ways: 

- With “polls” - where a managing system probes an SNMP agent to gather values for specific properties
- With “traps” – where an SNMP agent forwards events or notifications to a managing system. 

Traps are most often used as event notifications, while polls are more appropriate for stateful health detection or collecting performance metrics.  
  
SNMP properties are identified with an Object Identifier (OID) value. OIDs are defined and described in vendor-provided Management Information Base (MIB) files.  
  
This article describes how to send SNMP data from traps or polls to Azure Monitor Logs using Azure Monitor Agent for Linux.

## Collect SNMP traps with Azure Monitor Agent
  
Most Linux distributions provide a very good SNMP trap receiver, called **snmptrapd** from the [Net-SNMP](https://www.net-snmp.org/) agent. It's important that an SNMP trap receiver can load MIB files for your environment, so that the properties in the SNMP trap message are described with their name, instead of an OID.  
  
### Install snmptrapd

To install and enable snmptrapd on a CentOS 7, Red Hat Enterprise Linux 7, Oracle Linux 7 server use the following commands: 

```bash
#Install the SNMP agent
sudo yum install net-snmp
#Enable the service
sudo systemctl enable snmptrapd
#Allow UDP 162 through the firewall
sudo firewall-cmd --zone=public --add-port=162/udp --permanent
```

### Configure snmptrapd
  
The steps required to configure snmptrapd vary slightly between Linux distributions. The examples below apply specifically to Red Hat Enterprise Linux, CentOS, or Oracle Linux. For more information on snmptrapd configuration, including guidance on configuring for SNMP v3 authentication, see the [Net-SNMP documentation](https://www.net-snmp.org/docs/man/snmptrapd.conf.html).  
  
1. Authorize community strings (SNMP v1 & v2 authentication strings): 
  
    1. Edit `snmptrapd.conf`: 
    
        ```bash
        sudo vi /etc/snmp/snmptrapd.conf  
        ```        

    1.  Ensure that the following line exists in your `snmptrapd.conf` file to allow all traps for all OIDs, from all sources, with a community string of *public*: `authCommunity log,execute,net public`.

1. To enable logging SNMP trap fields with their names, instead of by OIDs, place all MIB files in `/usr/share/snmp/mibs`, which is the default directory for MIB files. 

    Copy all MIB files to this directory for each device that sends SNMP traps. MIB files are typically provided by the device vendor, but third-party websites like [www.mibdepot.com](https://www.mibdepot.com/) and [www.oidview.com](https://www.oidview.com/) provide MIBs to download for many vendors. Some vendors, like APC, maintain a single MIB for all devices, while others, like Cisco, have many [hundreds of MIB files](https://tools.cisco.com/ITDIT/MIBS/servlet/index). For snmptrapd to correctly load an MIB file, all dependent MIBs must also be loaded. Be sure to check the snmptrapd log file after loading MIBs to ensure that there are no missing dependencies in parsing your MIB files.  

1. Configure snmptrapd output:
  
    There are two ways to send SNMP traps from snmptrapd to Azure Monitor Agent for collection: 

    - Snmptrapd can forward incoming traps to syslog, which Azure Monitor Agent will be collect as long as the [syslog facility is configured for collection](https://azure.microsoft.com/en-us/documentation/articles/log-analytics-data-sources-syslog/). 

    - snmptrapd can write the syslog messages to a file, which can be *tailed* and parsed by Azure Monitor Agent for collection. This option may be preferable, as we can send the SNMP traps as a new datatype rather than sending as syslog events.  
      
    On Red Hat, CentOS, and Oracle Linux, the output behavior of snmptrapd is configured in `/etc/sysconfig/snmptrapd` (`sudo vi /etc/sysconfig/snmptrapd`).  
      
    Here’s an example configuration:  
      
    `# snmptrapd command line options# '-f' is implicitly added by snmptrapd systemd unit file# OPTIONS="-Lsd"OPTIONS="-m ALL -Ls2 -Lf /var/log/snmptrapd"`  
      
    The options in this example configuration are:  
    
      - **-m ALL** Load all MIB files in the default directories
      - **-Ls2** Output traps to syslog, to the Local2 facility
      - **-Lf /var/log/snmptrapd** Log traps to the file /var/log/snmptrapd
      
    More on output options can be found [here](https://www.net-snmp.org/docs/man/snmpcmd.html). Description of the formatting options can be found [here](https://www.net-snmp.org/docs/man/snmptrapd.html). Note that snmptrapd logs both traps and daemon messages - for example, service stop and start - to the same log file. In the example, we’ve defined the format to start with the word “snmptrap” to make it easy to filter snmptraps from the log later on.  
  