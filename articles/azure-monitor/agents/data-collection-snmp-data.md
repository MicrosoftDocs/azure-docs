---
title: Collect SNMP data with with Azure Monitor Agent
description: Learn how to use Azure Monitor Agent to collect SNMP data.  
ms.topic: conceptual
ms.date: 06/22/2022
ms.reviewer: shseth

---

# Collect SNMP data with with Azure Monitor Agent
  
The Simple Network Management Protocol (SNMP) is a widely-deployed management protocol for monitoring and configuring devices. While higher-level management protocols and daemons are typically used for servers, SNMP is often a viable option for monitoring devices and appliances.  
  
SNMP data can be collected in two ways: with “polls” - where a managing system probes an SNMP agent to gather values for specific properties, or with “traps” – where an SNMP agent forwards events or notifications to a managing system. Traps are most often used as event notifications, while polls are more appropriate for stateful health detection or collecting performance metrics.  
  
Whether with Polls or Traps, SNMP properties are identified with an Object Identifier (OID) value. OIDs are defined and described in vendor-provided Management Information Base (MIB) files.  
  
With the highly extensible OMS Agent for Linux, you can collect SNMP data from traps or polls for integration with OMS Log Analytics.

## Collecting SNMP Traps with OMS
  
There are many choices for SNMP trap receiver services available, but a very good SNMP trap receiver is provided with most Linux distributions: **snmptrapd** from the [Net-SNMP](https://www.net-snmp.org/) agent. It’s important that an SNMP trap receiver can load MIB files for your environment, so that the properties (fields) in the SNMP trap message are described with their name, instead of an OID.  
  
### Install snmptrapd

To install and enable snmptrapd on a CentOS 7, Red Hat Enterprise Linux 7, Oracle Linux 7 server use the following commands: `#Install the SNMP agentsudo yum install net-snmp#Enable the servicesudo systemctl enable snmptrapd#Allow UDP 162 through the firewall:sudo firewall-cmd --zone=public --add-port=162/udp --permanent`

### Configure snmptrapd
  
There are a few configuration steps required to configure snmptrapd. These will vary a bit by Linux distribution. The examples below apply specifically to Red Hat Enterprise Linux, CentOS, or Oracle Linux.  
  
The first configuration step is to authorize “community” strings (SNMP v1 & v2 authentication strings). For more information on snmptrapd configuration, including guidance on configuring for SNMP v3 authentication, see the [Net-SNMP documentation](https://www.net-snmp.org/docs/man/snmptrapd.conf.html).  
  
**Edit snmptrapd.conf:** `sudo vi /etc/snmp/snmptrapd.conf`  
  
To allow all traps for all OIDs, from all sources, with a community string of “public” – ensure that the following line exists in your snmptrapd.conf file: `authCommunity log,execute,net public`

## Import MIB files

  
For SNMP trap fields to be logged with their names (instead of OID), MIB files must be imported by snmptrapd. The default directory location for mibs is */usr/share/snmp/mibs*. For each device that will be sending SNMP traps, you will want to copy all relevant MIBs to this directory. MIB files are typically provided by the device vendor, but third party websites like [www.mibdepot.com](https://www.mibdepot.com/) and [www.oidview.com](https://www.oidview.com/) provide MIBs to download for many vendors. Some vendors, like APC, maintain a single MIB for all devices, while others, like Cisco, have many [hundreds of mibs](https://tools.cisco.com/ITDIT/MIBS/servlet/index). For snmptrapd to correctly load a MIB, all dependent MIBs must also be loaded. Be sure to check the snmptrapd log file after loading MIBs to ensure that there are no missing dependencies in parsing your MIB files.  

### Configure snmptrapd output
  
To get SNMP traps from snmptrapd to the OMS Agent for collection, we have two options. Snmptrapd can forward incoming traps to syslog, which will be collected by the OMS agent as long as the [syslog facility is configured for collection](https://azure.microsoft.com/en-us/documentation/articles/log-analytics-data-sources-syslog/). Alternatively, snmptrapd can write the syslog messages to a file, which can be *tailed* and parsed by the OMS Agent for Linux for collection. This latter option may be preferable, as we can send the SNMP traps as a new datatype rather than sending as syslog events.  
  
On Red Hat, CentOS, and Oracle Linux, the output behavior of snmptrapd is configured in /etc/sysconfig/snmptrapd (*sudo vi /etc/sysconfig/snmptrapd)* .  
  
Here’s an example configuration:  
  
`# snmptrapd command line options# '-f' is implicitly added by snmptrapd systemd unit file# OPTIONS="-Lsd"OPTIONS="-m ALL -Ls2 -Lf /var/log/snmptrapd -F 'snmptrap \\t %a \\t %B \\t %y/%m/%l %h:%j:%k \\t %N \\t %W \\t %q \\t %T \\t %W \\t %v \\n'"`  
  
The options in this example configuration are:  

  - **-m ALL** Load all MIB files in the default directories
  - **-Ls2** Output traps to syslog, to the Local2 facility
  - **-Lf /var/log/snmptrapd** Log traps to the file /var/log/snmptrapd
  - **-F** Define the format for the traps written to the log file

  
More on output options can be found [here](https://www.net-snmp.org/docs/man/snmpcmd.html). Description of the formatting options can be found [here](https://www.net-snmp.org/docs/man/snmptrapd.html). It should be noted that snmptrapd logs both traps and daemon messages (e.g. service stop/start) to the same log file. In the example, I’ve defined the format to start with the word “snmptrap,” this makes it easy to filter just snmptraps from the log later.  
  