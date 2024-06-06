---
title: Provision an Exadata VM Cluster for Oracle Database@Azure
description: Provision an Exadata VM Cluster for Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 6/07/2024
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---


# Provision an Exadata VM Cluster for Oracle Database@Azure

Provisioning an Oracle Exadata VM Cluster requires the existence of an Oracle Exadata Infrastructure, and is a prerequisite for Oracle Exadata Databases that runs on the cluster.

> [!NOTE]
> Review the [Provisioning Troubleshooting](https://docs.oracle.com/en-us/iaas/odaaz/odaaz-provisioningtroubleshooting.html#GUID-DACCA740-025E-4466-8BB7-AC8C1D23E450), specifically the IP Address Requirement Differences, to ensure you have all the information needed for a successful provisioning flow.

1. You provision Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources from the OracleDB@Azure blade. By default, the Oracle Exadata Infrastructure tab is selected. To create a Oracle Exadata VM Cluster resource, select that tab first.
1. Select the __+ Create__ icon at the top of the blade to begin the provisioning flow.
1. Check that you are using the __Create__ Oracle Exadata VM Cluster flow. If not, exit the flow.
1. From the __Basics__ tab of the Create Oracle Exadata VM Cluster flow, enter the following information. __NOTE:__ Before you can provision an Oracle Exadata VM Cluster, you must have a provisioned Oracle Exadata Infrastructure which you will assign for your Oracle Exadata VM Cluster.
   1. Select the Microsoft Azure subscription to which the Oracle Exadata VM Cluster will be provisioned.
   1. Select an existing __Resource group__ or select the __Create new__ link to create and use a new Resource group for this resource.
   1. Enter a unique __Name__ for the Oracle Exadata VM Cluster on this subscription.
   1. Select the __Region__ where this Oracle Exadata Infrastructure will be provisioned. __NOTE:__ The regions where the OracleDB@Azure service is available are limited, and you should assign the Oracle Exadata VM Cluster to the same region as the parent Oracle Exadata Infrastructure.
   1. The __Cluster name__ should match the Name to avoid additional naming conflicts.
   1. Select the existing __Exadata infrastructure__ that will be the parent for your Oracle Exadata VM Cluster.
   1. The __License type__ is either __License included__ or __Bring your own license (BYOL)__. Your selection will affect your billing.
   1. The default __Time zone__ is UTC. There is also an option to __Select another time zone__.
   1. If you choose the __Select another time zone__ option, two additional required fields will open, __Region or country__ and __Selected time zone__. Both of these fields are drop-down lists with selectable values. Once you select the __Region or country__, the __Selected time zone__ will be populated with the available values for that __Region or country__.
   1. The __Grid Infrastructure Version__ is selectable based on your previous selections. The __Grid Infrastructure Version__ limits the Oracle Database versions that the Oracle Exadata VM Cluster supports.
   1. If selected, the __Choose Exadata Image version__ checkbox allows you to select whether or not to __Include Exadata Image minor versions__ as selectable, and then to choose the specific __Exadata Image version__ from the drop-down field based on whether or not you allowed __Include Exadata Image minor versions__.
   1. The __SSH public key source__ can be selected to __Generate new key pair__, __Use existing key stored in Azure__, or __Use existing public key__. If you select __Generate new key pair__, you must give your newly generated key a unique name. If you select __Use existing key stored in Azure__, you must select that key from a dropdown of defined key for your subscription. If you select __Use existing public key__, you must provide an RSA public key in sing-line format (starting with "ssh-rsa") or the multi-line PEM format. You can generate SSH keys using ssh-keygen or Linux and OS X, or PuTTYGen on Windows.
   1. Select Next to continue.
1. From the __Configuration__ tab of the Create Oracle Exadata VM Cluster flow, enter the following information.
   1. The __Change database servers__ checkbox is optional. If selected, it allows you to select a minimum of two (2) database servers for VM cluster placement. Maximum resources vary based on allocation per VM cluster based on the number of database servers. Select from the available configurations.
   1. __Database servers__ and __System Model__ fields are read-only and based on the available resources.
   1. The __OCPU count per VM__, __Memory per VM__, and __Local storage per VM__ are limited by the Oracle Exadata Infrastructure.
   1. __Total requested OCPU count__, __Total requested memory__, and __Total local storage__ are computed based on the local values that you accept or select.
   1. __Usable Exadata Storage (TB)__ is limited by the Oracle Exadata Infrastructure.
   1. __Use Exadata sparse snapshots__, __Use local backups__, and __Usable storage allocation__ are options that can only be set at this time before the Oracle Exadata VM Cluster has been provisioned.
   1. Select __Next__ to continue.
1. From the __Networking__ tab of the Create Oracle Exadata VM Cluster flow, enter the following information.
   1. The __Virtual network__ is limited based on the __Subscription__ and __Resource group__ that you selected earlier in the provisioning flow.
   1. The __Client subnet__ is selectable based on the selected __Virtual network__.
   1. To use a custom DNS domain, select the __Custom DNS__ checkbox. If unchecked, the Oracle Exadata VM Cluster uses the default domain, oraclevcn.com.
   1. If checked, a list of existing DNS private views from OCI is presented. Select the view to use. To create a new private view and zones, see [Private DNS](https://docs.oracle.com/iaas/Content/DNS/Tasks/privatedns.htm).
   1. Enter the __Host name__ prefix. The prefix forms forms the first portion of the Oracle Exadata VM Cluster host name.
   1. The __Host domain name__ and __Host and domain URL__ for your Oracle Exadata VM Cluster are read-only and populated with derived naming.
   1. Within the __Network ingress rules__ section, the __Add additional network ingress rules__ checkbox allows you to define addition ingress CIDR rules. Additional network CIDR ranges (such as application or hub subnet ranges) can be added, during provisioning, to the network security group (NSG) ingress rules for the VM cluster. The selected virtual network's CIDR is added by default. CIDR ranges are specified. The port can be a single port, port range (for example, 80-8080), a comma-delimited list of ports (for example, 80,8080), or any combination of these. This only updates the OCI network security group ingress rules. Microsoft Azure VNet network security rules must be updated in the specific VNet in Microsoft Azure.
   1. Select __Next__ to continue.
1. From the __Diagnostics Collection__ tab of the Create Oracle Exadata VM Cluster flow allow you to specify the diagnostic events, health monitoring, and incident logs and tracing that Oracle can use to identify, track, and resolve issues. Select __Next__ to continue.
1. From the __Consent__ tab of the Create Oracle Exadata VM Cluster flow, you must agree to the terms of service, privacy policy, and agree to access permissions. Select __Next__ to continue.
1. From the __Tags__ tab of the Create Oracle Exadata VM Cluster flow, you can define Microsoft Azure tags. __NOTE:__ These tags are not propagated to the Oracle Cloud Infrastructure (OCI) portal. Select __Next__ to continue.
1. From the __Review _+ create__ tab of the Create Oracle Exadata VM Cluster flow, a short validation process is run to check the values that you entered from the previous steps. If the validation fails, you must correct any errors before you can start the provisioning process.
1. Select the __Create__ button to start the provisioning flow.
1. Return to the Oracle Exadata VM Cluster blade to monitor and manage the state of your Oracle Exadata VM Cluster environments.