---
title: Replicate a multi-tier IIS based web application using Azure Site Recovery | Microsoft Docs
description: This article describes how to replicate IIS web farm virtual machines using Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: nsoneji
manager: gauravd
editor: 

ms.assetid: 
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2017
ms.author: nisoneji

---
# Replicate a multi-tier IIS based web application using Azure Site Recovery

## Overview


Application software is the engine of business productivity in an organization. Various web applications can serve different purposes in an organization. Some of these like payroll processing, financial applications and customer facing websites can be utmost critical for an organization. It will be important for the organization to have them up and running at all times to prevent loss of productivity and more importantly prevent any damage to the brand image of the organization.

Critical web applications are typically set up as multi-tier applications with the web, database and application on different tiers. Apart from being spread across various tiers, the applications may also be using multiple servers in each tier to load balance the traffic. Moreover, the mappings between various tiers and on the web server may be based on static IP addresses. On failover, some of these mappings will need to be updated, especially, if you have multiple websites configured on the web server. In case of web applications using SSL, certificate bindings will need to be updated.

Traditional non-replication based recovery methods involve backing up of various configuration files, registry settings, bindings, custom components (COM or .NET), content and also certificates and recovering the files through a set of manual steps. These techniques are clearly cumbersome, error prone and not scalable. It is, for example, easily possible for you to forget backing up certificates and be left with no choice but to buy new certificates for the server after failover.

A good disaster recovery solution, should allow modeling of recovery plans around the above complex application architectures and also have the ability to add customized steps to handle application mappings between various tiers hence providing a single-click sure shot solution in the event of a disaster leading to a lower RTO.


This article describes how to protect an IIS based web application using a [Azure Site Recovery](site-recovery-overview.md). This article will cover best practices for replicating a three tier IIS based web application to Azure, how you can do a disaster recovery drill, and how you can failover the application to Azure. 

 
## Prerequisites

Before you start, make sure you understand the following:

1. [Replicating a virtual machine to Azure](site-recovery-vmware-to-azure.md)
1. How to [design a recovery network](site-recovery-network-design.md)
1. [Doing a test failover to Azure](site-recovery-test-failover-azure.md)
1. [Doing a failover to Azure](site-recovery-failover.md)
1. How to [replicate a domain controller](site-recovery-active-directory.md)
1. How to [replicate SQL Server](site-recovery-sql.md)

## Deployment patterns

An IIS based web application typically follows one of the following deployment patterns:

* **Deployment pattern 1** - This deployment pattern will show a catchy picture with a link to an external resource.


* **Deployment pattern 2**


## Site Recovery support

For the purpose of creating this article VMware virtual machines with IIS Server version 7.5 on Windows Server 2012 R2 Enterprise were used. As site recovery replication is application agnostic, the recommendations provided here are expected to hold on following scenarios as well and for different version of IIS.

### Source and target

**Scenario** | **To a secondary site** | **To Azure**
--- | --- | ---
**Hyper-V** | Yes | Yes
**VMware** | Yes | Yes
**Physical server** | No | Yes

## Replicating virtual machines

Follow [this guidance](site-recovery-vmware-to-azure.md) to start replicating the virtual machines to Azure. 

If you are using a static IP then specify the IP that you want the virtual machine to take in the [**Target IP**](./site-recovery-replicate-vmware-to-azure.md#view-and-manage-vm-properties) setting in Compute and Network settings. 

![Target IP](./media/site-recovery-active-directory/DNS-Target-IP.png)


## Creating a recovery plan

A recovery plan allows sequencing the failover of various tiers in a multi-tier application, hence, maintaining application consistency. Follow the below steps while creating a recovery plan for a multi-tier web application. 

### Adding virtual machines to failover groups
A typical multi-tier IIS web application will consist of a database tier with SQL VMs, the web tier constituted by a web server and an application tier. 

1. Create a recovery plan with the virtual machine in the database tier added under Group 1 to ensure that they are shutdown last and brought up first. 

1. Add the virtual machines in the application tier under Group 2 such that they are brought up after the database tier has been brought up.

1. Add the virtual machines in the web tier (with the IIS server) in Group 3 such that they are brought up after the application tier has been brought up.

![Recovery Plan](./media/site-recovery-iis/RecoveryPlan.png)

### Adding scripts to the recovery plan
You may need to do some operation on Azure failover virtual machine post failover to function it correctly. You can automate the post failover process like updating DNS entry, change site binding, change  in connection string  by adding scripts in the recovery plan as below. [Learn more about add script recovery plan](./site-recovery-create-recovery-plans#add-scripts).

#### DNS Update
You need to update the virtual machine site IIS server IP against the host header of the website. If you are using a static IPs for the virtual machines, you need to update the DNS with entries for the IP addresses of the virtual machines. You can add [DNS update](DNS update script path) script to the recovery plan after Group 3 in order to update dependencies for the IIS web application. If you are using dynamic IPs, no more steps are required.  

#### Connection string in an application’s web.config
The connection string specifies the database that the web site communicates with. 

If the connection string carries the name of the database VM, no further steps will be needed post failover and the application will be able to automatically communicate to the DB. Also, if the IP address for the database VM is retained, it will not be needed to update the connection string. If the connection string refers to the database VM using an IP address, it will need to be updated post failover. E.g. the below connection string points to the DB with IP 127.0.1.2 

		<?xml version="1.0" encoding="utf-8"?> 
		<configuration> 
		<connectionStrings> 
		<add name="ConnStringDb1" connectionString="Data Source= 127.0.1.2\SqlExpress; Initial Catalog=TestDB1;Integrated Security=False;" /> 
		</connectionStrings> 
		</configuration>

You can add the [IIS conntection string](IIS-update-Connectionstrin.ps1 path) script to update the connection string. 


####site bindings for the application

Every site consists of binding information that includes the type of binding, the IP address at which the IIS server listens to the requests for the site, the port number and the host names for the site. At the time of a failover, these bindings might need to be updated if there is a change in the IP address associated with them. 

> [NOTE!]
> If you have marked ‘all unassigned’ for the site binding as in the example below, you will not need to update this binding post failover. Also, if the IP address associated with a site is not changed post failover, the site binding need not be updated (Retention of the IP address depends on the network architecture and subnets assigned to the primary and recovery sites and hence may or may not be feasible for your organization.) 

![SSL Binding](./media/site-recovery-iis/SSLBinding.png)

If  you have associated the IP address with a site, you will need to update all site bindings with the new IP address. you can use this [script](script location) to change the site bindings. 


#### load balance
3. Use this [script](scipt-location.md) to attach a load balance on the failed over virtual machine

#### The SSL cert binding for an https connection
Websites can have an associated SSL certificate that helps in ensuring a secure communication between the webserver and the user’s browser. If the website has an https connection and an associated https site binding to the IP address of the IIS server with an SSL cert binding, a new site binding will need to be added for the cert with the IP of the IIS virtual machine post failover. 

The SSL cert can be issued against- 

a) The fully qualified domain name of the website<br>
b) The name of the server<br>
c) A wildcard certificate for the domain name<br>
d) An IP address – If the SSL cert is issued against the IP of the IIS server, another SSL cert needs to be issued against the IP address of the IIS server on the Azure site and an additional SSL binding for this certificate will need to be created. Hence, it is advisable to not use an SSL cert issued against IP. This is a less widely used option and will soon be deprecated as per new CA/browser forum changes.


#### Update the dependency between the web and the application tier
If you have an application specific dependency based on the IP address of the virtual machines, you need to update this dependency post failover.


## Doing a test failover

Follow [this guidance](site-recovery-test-failover-to-azure.md) to do a test failover. Make sure you do this and that before you start.

![TestFailover Job](./media/site-recovery-iis/TestFailoverJob.png)


## Doing a failover

Follow [this guidance](site-recovery-failover.md) when you are doing a failover. Make sure you do this and that before you start.

## Next steps
You can learn more about [replicate other applications](site-recovery-workload.md) using Site Recovery. 
