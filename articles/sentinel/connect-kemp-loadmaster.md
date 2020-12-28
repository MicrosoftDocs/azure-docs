---
title: Connect Kemp LoadMaster data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Kemp LoadMaster data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: daveRendon
manager:
editor: ''

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/28/2020
ms.author:

---
# Connect Kemp LoadMaster data to Azure Sentinel

This article explains how to connect your Kemp LoadMaster data to Azure Sentinel. Kemp LoadMaster allows you to easily send the logs to Azure Sentinel, to view dashboards, create custom alerts, and improve investigation.


Using Kemp LoadMaster on Azure Sentinel will provide you more insights into your organization’s application usage, and will enhance its application experience.

### Pre-requisites
- At least 1 LoadMaster previously provisioned – https://azuremarketplace.microsoft.com/en-us/marketplace/apps/kemptech.vlm-azure
- A virtual machine – Ubuntu preferred to receive and forward logs
- A Log Analytics workspace


## Forward Kemp LoadMaster logs.
Your Kemp LoadMaster could be running on-premises or in the cloud(Azure or AWS), first, we need to configure Kemp LoadMaster to forward Syslog messages in CEF format to your Azure workspace.

To forward the logs we have to go to the LoadMaster UI under System Configuration > Logging Options > Syslog Options and provide the IP address of the external Syslog.

In the case of failure of any LoadMaster, logs will not be available, therefore it is recommended to set up an external Syslog server.

> [!NOTE]
> From Kemp docs:
> An external Syslog server can capture all the logs the LoadMaster is already reporting and send it to the Syslog server via UDP port 514 by default.  You can now use other ports other than 514 as of firmware 7.2.38.0.
> The Syslog server can capture on 6 different Hosts.
> - Emergency Host – The system is unusable and requires immediate attention
> - Critical Host – Should be corrected immediately but indicates failure in a primary system
> - Error Host – Non-urgent failures but should be looked at ASAP
> - Warn Host – Not an error, but an indication that an error will occur if action is not taken
> - Notice Host – Events that are unusual but not error conditions – no immediate action required
> - Info Host – Normal operational messages – may be harvested for reporting

When applying IPs to these fields it is important to remember that the fields cascade up. You only have to configure “info host” if you wish everything to be reported to your server.  You can add multiple IPs in these fields by space separating the IPs.

In this case, we assume you have provisioned a virtual machine in Azure (Ubuntu) in an availability set that will receive the logs from the LoadMaster. This way, in case of any failure on the LoadMaster you can still have visibility from the logs before the failure happens.

![Image of Kemp LoadMaster](https://wikiazure.com/wp-content/uploads/2020/10/02-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

## Create Azure Sentinel workspace and integrate data connectors.

Now let’s go to the Azure Portal and create a new Azure Sentinel workspace. Note that I have previously created a log analytics workspace.

You can refer to the Azure documentation for a quickstart to on-board Azure Sentinel – (http://bit.ly/az-sentinel)

![Image of Kemp LoadMaster](https://wikiazure.com/wp-content/uploads/2020/10/03-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Click on data connectors, look for Syslog and select the Syslog connector from Microsoft as shown below:

![Image of Connectors](https://wikiazure.com/wp-content/uploads/2020/10/04-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)


Now select the option to install the agent on an Azure Linux Virtual Machine:

![Image of Connectors](https://wikiazure.com/wp-content/uploads/2020/10/05-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Then select the Ubuntu virtual machine:

![Image of Connectors](https://wikiazure.com/wp-content/uploads/2020/10/06-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Now connect your VM:


![Image of Connector](https://wikiazure.com/wp-content/uploads/2020/10/07-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)


Once you have connected your VM, now go to the advanced settings and click on the “data” option then go to Syslog and then look for the logs you want to add, you need to type the log file name as shown below:

![Image of Connector](https://wikiazure.com/wp-content/uploads/2020/10/08-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Once you have provided the syslogs that will be collected click on save:

![Image of Connector](https://wikiazure.com/wp-content/uploads/2020/10/09-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

You should see a notification like below:


![Image of successful configuration](https://wikiazure.com/wp-content/uploads/2020/10/010-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

## Integrate Common Event Format(CEF) connector
Now go back to the Azure sentinel data connectors and look for the common event format(CEF) and click on “open connector page” as shown below:

![Image of successful configuration](https://wikiazure.com/wp-content/uploads/2020/10/011-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Now let’s proceed to install the CEF agent on the Linux virtual machine, you should be able to see the command that will help you with the installation of the CEF collector:

![Image of successful configuration](https://wikiazure.com/wp-content/uploads/2020/10/012-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Run the command to install and apply the CEF collector:

![Image of CEF collector installation](https://wikiazure.com/wp-content/uploads/2020/10/013-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Once your agent is installed on your Azure Linux VM, let’s proceed to verify the connectivity.



## Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Log Analytics. Azure will provide you with the command to test the connectivity:

![Image of the validation process](https://wikiazure.com/wp-content/uploads/2020/10/014-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Run the command that Azure provides to validate connectivity, after a couple of seconds you should be able to see that the configuration is valid:

![Image of CEF collector installation](https://wikiazure.com/wp-content/uploads/2020/10/016-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Note: To TCP dump manually execute the following command – ‘tcpdump -A -ni any port 514 -vv’ on the Ubuntu VM

It may take about 20 minutes until the connection streams data to your workspace.

After a few minutes, you should be able to see the message “completed troubleshooting”

Azure Sentinel will initially show you a dashboard including the potential malicious events

![Image of CEF collector installation](https://wikiazure.com/wp-content/uploads/2020/10/018-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

## Custom queries on Azure Sentinel
You can also create custom log queries to help you to fully leverage the value of the data collected. Now click on “Logs”

![Image of CEF collector installation](https://wikiazure.com/wp-content/uploads/2020/10/020-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Once you are on the Query page, we will create custom queries, you can check the queries from this Github repo:

https://github.com/daveRendon/kemp/tree/master/azure-sentinel/scripts

**Note: you must enable the checkbox on the LoadMaster as shown below

![Image of CEF collector installation](https://wikiazure.com/wp-content/uploads/2020/10/021-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Here's a quick example of a query using ESP CEF logs:

```
//This script parses out all the fields for the ESP CEF logs and presents them to the user.
CommonSecurityLog
| where DeviceVendor == "Kemp"
| extend ExtFields = split(AdditionalExtensions, ';')
| extend VSInfo = split(ExtFields[0], "=")[1]
| extend VSIP = split(VSInfo, ":")[0]
| extend VSPort = split(VSInfo, ":")[1]
| extend Event = split(ExtFields[1], "=")[1]
| extend SourceIP = case( DeviceEventClassID !in (6, 14, 15), split(ExtFields[2], "=")[1], DeviceEventClassID == 6, split(ExtFields[3], "=")[1], SourceIP)
| extend SourcePort = iff ( DeviceEventClassID in (1, 2, 3, 4, 5, 11, 12, 13, 16, 17), split(ExtFields[3], "=")[1], "")
| extend DestinationIP = iff ( DeviceEventClassID in (4, 5), split(ExtFields[4], "=")[1], "")
| extend DestinationPort = iff ( DeviceEventClassID in (4, 5), split(ExtFields[5], "=")[1], "")
| extend AwaitingRemoteAddress = iff ( DeviceEventClassID == 3, split(ExtFields[4], "=")[1], "")
| extend RequestMethod = iff( DeviceEventClassID in (11, 12), split(ExtFields[4], "=")[1], "")
| extend RequestURL = iff( DeviceEventClassID in (11, 12), split(ExtFields[5], "=")[1], "")
| extend user_ext = split(ExtFields[6], "=")
| extend User = case( DeviceEventClassID == 6, split(ExtFields[2], "=")[1], DeviceEventClassID in (7, 8, 9, 10), split(ExtFields[3], "=")[1], DeviceEventClassID in (11, 12), iff( user_ext[0] == "user", user_ext[1], ""), "")
| extend user_agent_ext = split(ExtFields[7], "=")
| extend UserAgent = iff( DeviceEventClassID in (11, 12), case ( user_ext[0] == "useragent", user_ext[1], user_agent_ext[0] == "useragent", user_agent_ext[1], ""), "")
| extend Resource = case( DeviceEventClassID == 15, split(ExtFields[2], "=") [1], DeviceEventClassID in (16, 17), split(ExtFields[4], "=")[1], "")
| extend DTCode = iff ( DeviceEventClassID == 13, split(ExtFields[4], "=")[1], "")
| project format_datetime(TimeGenerated, "yyyy-MM-dd HH:mm:ss"), DeviceVendor, DeviceProduct, DeviceEventClassID, LogSeverity, Message, Event, VSIP, VSPort, SourceIP, SourcePort, DestinationIP, DestinationPort, AwaitingRemoteAddress, User, UserAgent, Resource, RequestMethod, RequestURL, DTCode
```

Use the query above and run it, you should be able to see the ESP(Edge Security Pack)  logs and additional fields:

- Time Generated
- Virtual Service IP
- Virtual Service Port
- Source IP
- Port, etc

![Image of CEF collector installation](https://wikiazure.com/wp-content/uploads/2020/10/022-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)

Once you have your queries in place you can also pin the results to a dashboard and create your custom dashboard as shown below:

![Image of CEF collector installation](https://wikiazure.com/wp-content/uploads/2020/10/023-Connect-Kemp-LoadMaster-data-to-Azure-Sentinel.jpg)


## Next steps
In this document, you learned how to connect Kemp LoadMaster data to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.

