---
title:  | Microsoft Docs
description: Learn how to create a Hadoop on HDInsight cluster in a secured Azure Virtual Network.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/23/2017
ms.author: larryfr

---

# Hadoop on HDInsight in a secure Azure Virtual Network

Learn how to create a Hadoop on HDInsight cluster in a secured Azure Virtual Network. The steps in this document walk through creating the following configuration:

* No inbound access from the internet.

    > [!IMPORTANT]
    > There are several IP addresses that must be allowed access to the virtual network. These IP addresses are part of the Azure cloud, and provide health and management services for HDInsight. For a list of IP addresses for specific Azure regions, see the [TBD]() document.

* A VPN gateway for client access to the virtual network.

> [!IMPORTANT]
> Outbound access is not restricted. HDInsight must be able to access Azure resources such as Azure Storage, Data Lake Store, and SQL Database. These resources cannot be created inside a Virtual Network.

## Things that do not work

* PowerShell, Data Lake tools for VS, other Microsoft client tools for HDInsight. These almost universally are configured to use the public gateway. Which isn't available in a secure configuration.

* Dynamic name resolution. It requires a lot of networking knowledge to configure a custom DNS server in the vnet to forward requests with a DNS server on your local network.

## Step 1: Create the resource group

## Step 2: Create the virtual network

Link to network documents for more info.

## Step 3: Create a Network Security Group

Link to Network documents for more info. Link to IPs in the existing HDInsight document. Maybe extract those into an include so we can easily reuse in both spots without manual duplication.

## Step 4: Create a VPN gateway

Link to network documents for more info.

Challenges:

* Name resolution. There is no automatic name resolution between the virtual network and clients.

A poor man's solution is to enumerate the IP address of the cluster head nodes and add an entry to the local hosts file.

Other thoughts on making a 'good' experience here?

## Step 5: Create storage for HDInsight

Discuss blob vs. adls and provide info for each

## Step 6: Create a SQL Database for HDInsight

Metastore: Why you want to use an external one

## Step 7: Create HDInsight

Should we create an edge node? We recommend it as a way to reduce load on headnodes

## Example: Azure Resource Manager Template

Have an example template that does everything the steps do. User would just modify the NSG rules for it maybe.

## Task: Using SSH

## Task: Using Web UIs

## Task: Using REST APIs

## Next steps