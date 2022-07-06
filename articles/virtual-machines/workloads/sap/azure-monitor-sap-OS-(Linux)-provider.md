---
title: Azure Monitor for SAP Solutions providers - Os Linux Provider | Microsoft Docs
description: This article provides details to configure OS Linux Provider for Azure monitor for SAP solutions.
author: sujaj
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: article
ms.date: 07/06/2022
ms.author: sujaj

---


## Create Operation System (OS) provider

> **Note**       
 > Applicable for Linux OS only 

> [!Note]
> This content would apply to both new and classic version of Azure Monitor for SAP solutions.


> **Important pre-requisite**      
 >  To configure an OS (Linux) provider, install [node-exporter is 1.3.0](https://prometheus.io/download/#node_exporter) in each host (BareMetal or virtual machine) you want to monitor. [Learn more](https://github.com/prometheus/node_exporter).    


1. Select Add provider, and then:   

     a.  For Type, select OS (Linux)       
     b. For **Name**, enter a name that will be the identifier for the BareMetal instance           
     c. For **Node Exporter Endpoint**, enter **http://IP:9100/metrics**         

> **Important**         
> Use the private IP address of the Linux host. Ensure that the host and Azure Monitor for SAP resource are in the same virtual network.     
>        
> Firewall port 9100 should be opened on the Linux host. If you're using firewall-cmd, use the following commands:       
>      _firewall-cmd_ _--permanent_ _--add-port=9100/tcp_        
>      _firewall-cmd_ _--reload_
>     
> If you're using ufw, use the following commands:      
>      _ufw_ _allow_ _9100/tcp_           
>      _ufw_ _reload_      
>      
> If the Linux host is an Azure virtual machine (VM), ensure that all applicable network security groups allow inbound traffic at port 9100 from VirtualNetwork as the source.         

2. When you're finished, select **Add provider**. Continue to add providers as needed, or select **Review + create** to complete the deployment.