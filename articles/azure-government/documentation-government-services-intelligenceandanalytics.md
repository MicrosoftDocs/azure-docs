---
title: 'Azure Government Intelligence + Analytics | Microsoft Docs'
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: Azure-Government
cloud: gov
documentationcenter: ''
author: MeganYount
manager: zakramer
editor: ''

ms.assetid: 4b7720c1-699e-432b-9246-6e49fb77f497
ms.service: multiple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 12/06/2016
ms.author: MeganYount

---
# Azure Government Intelligence + Analytics
This article outlines the intelligence and analytics services, variations, and considerations for the Azure Government environment.

## Azure HDInsight
HDInsight is generally available in Azure Government.

### Variations
The following HDInsight features are not currently available in Azure Government.

* HDInsight is not available on Windows.
* Azure Data Lake Store is not currently available in Azure Government. Azure Blob Storage is the only available storage option at this time.
* Azure Active Directory Domain Services integration is not yet available. To create secure Hadoop clusters without Active Directory Domain Services, select one of the following setup scenarios:

1. HDINSIGHT INTEGRATED WITH ACTIVE DIRECTORY RUNNING ON AZURE IAAS

  This is by far the simplest architecture for integrating HDInsight with active directory. The architecture diagram is provided below. In this architecture, you will have your active directory domain controller running on a (or multiple) VMs in Azure. Usually these VMs will be within a Virtual network. You can setup a new Virtual network within which you can place your HDInsight cluster. For HDInsight to have a line of sight to the active directory, you will need to peer these virtual networks using [VNET to VNET peering] (https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-create-vnetpeering-arm-portal). 
  
  Pre-requisites that need to be setup on active directory
     * An Organizational unit must be created, within which you want to place the HDInsight cluster VMs and the service principals used by the cluster. 
     * LDAPS must be setup for communicating with the active directory. The certificate used to setup LDAPS must be a real certificate (not a self-signed certificate).
     * Reverse DNS zones must be created on the domain for the IP address range of the HDI Subnet.
     * A service account, or a user account is needed, which will be used to create the HDInsight cluster. This account must have the following permissions
        * Permissions to create service principal objects and machine objects within the organizational unit.
        * Permissions to create reverse DNS proxy rules.
        * Permissions to join machines to the active directory domain.
        
2. HDINSIGHT INTEGRATED WITH AN ON-PREMISES ACTIVE DIRECTORY VIA VPN SETUP
  
  This architecture is like the architecture #1. The only difference is that in this case, your active directory is on-premises and the line of sight for HDInsight to active directory is via a [VPN connection from Azure to on-premises network] (https://docs.microsoft.com/en-us/azure/expressroute/expressroute-introduction). The architecture diagram for this setup is shown below. 
  
  Pre-requisites that need to be setup on the on-premises active directory
     * An Organizational unit must be created, within which you want to place the HDInsight cluster VMs and the service principals used by the cluster.
     * LDAPS must be setup for communicating with the active directory. The certificate used to setup LDAPS must be a real certificate (not a self-signed certificate).
     * Reverse DNS zones must be created on the domain for the IP address range of the HDI Subnet.
     * A service account, or a user account is needed, which will be used to create the HDInsight cluster. This account must have the following permissions
        * Permissions to create service principal objects and machine objects within the organizational unit.
        * Permissions to create reverse DNS proxy rules.
        * Permissions to join machines to the active directory domain.


The URLs for Log Analytics are different in Azure Government:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| HDInsight Cluster | \*.azurehdinsight.net | \*.azurehdinsight.us |

For more information, see [Azure HDInsight public documentation](../hdinsight/hdinsight-hadoop-introduction.md).


## Next Steps
For supplemental information and updates subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
