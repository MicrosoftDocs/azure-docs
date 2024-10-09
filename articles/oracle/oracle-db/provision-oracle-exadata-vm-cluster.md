---
title: Provision an Exadata VM Cluster
description: Provision an Exadata VM Cluster.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 6/07/2024
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---


# Provision an Exadata VM Cluster

Provisioning an Oracle Exadata VM Cluster requires the existence of an Oracle Exadata Infrastructure, and is a prerequisite for Oracle Exadata Databases that runs on the cluster.

> [!NOTE]
> Review the [Troubleshoot provisioning issues](provision-troubleshoot-oracle-database.md), specifically the IP Address Requirement Differences, to ensure you have all the information needed for a successful provisioning flow.

1. You provision Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources from the OracleDB@Azure blade. By default, the Oracle Exadata Infrastructure tab is selected. To create an Oracle Exadata VM Cluster resource, select that tab first.
1. Select the **+ Create** icon at the top of the blade to begin the provisioning flow.
1. Check that you're using the **Create** Oracle Exadata VM Cluster flow. If not, exit the flow.
1. From the **Basics** tab of the Create Oracle Exadata VM Cluster flow, enter the following information.

      >[!NOTE]
      > Before you can provision an Oracle Exadata VM Cluster, you must have a provisioned Oracle Exadata Infrastructure, which you'll assign for your Oracle Exadata VM Cluster.

   1. Select the Microsoft Azure subscription to which the Oracle Exadata VM Cluster will be provisioned.
   1. Select an existing **Resource group** or select the **Create new** link to create and use a new Resource group for this resource.
   1. Enter a unique **Name** for the Oracle Exadata VM Cluster on this subscription.
   1. Select the **Region** where this Oracle Exadata Infrastructure is provisioned. 
       >[!NOTE] 
       >The regions where the OracleDB@Azure service is available are limited, and you should assign the Oracle Exadata VM Cluster to the same region as the parent Oracle Exadata Infrastructure.
   1. The **Cluster name** should match the Name to avoid other naming conflicts.
   1. Select the existing **Exadata infrastructure** that is the parent for your Oracle Exadata VM Cluster.
   1. The **License type** is either **License included** or **Bring your own license (BYOL)**. Your selection affects your billing.
   1. The default **Time zone** is UTC. There's also an option to **Select another time zone**.
   1. If you choose the **Select another time zone** option, two more required fields open, **Region or country** and **Selected time zone**. Both of these fields are drop-down lists with selectable values. Once you select the **Region or country**, the **Selected time zone** is populated with the available values for that **Region or country**.
   1. The **Grid Infrastructure Version** is selectable based on your previous selections. The **Grid Infrastructure Version** limits the Oracle Database versions that the Oracle Exadata VM Cluster supports.
   1. If selected, the **Choose Exadata Image version** checkbox allows you to select whether or not to **Include Exadata Image minor versions** as selectable, and then to choose the specific **Exadata Image version** from the drop-down field based on whether or not you allowed **Include Exadata Image minor versions**.
   1. The **SSH public key source** can be selected to **Generate new key pair**, **Use existing key stored in Azure**, or **Use existing public key**. If you select **Generate new key pair**, you must give your newly generated key a unique name. If you select **Use existing key stored in Azure**, you must select that key from a dropdown of defined key for your subscription. If you select **Use existing public key**, you must provide an RSA public key in sing-line format (starting with "ssh-rsa") or the multi-line PEM format. You can generate SSH keys using ssh-keygen or Linux and OS X, or PuTTYGen on Windows.
   1. Select Next to continue.
1. From the **Configuration** tab of the Create Oracle Exadata VM Cluster flow, enter the following information.
   1. The **Change database servers** checkbox is optional. If selected, it allows you to select a minimum of two (2) database servers for VM cluster placement. Maximum resources vary based on allocation per VM cluster based on the number of database servers. Select from the available configurations.
   1. **Database servers** and **System Model** fields are read-only and based on the available resources.
   1. The **OCPU count per VM**, **Memory per VM**, and **Local storage per VM** are limited by the Oracle Exadata Infrastructure.
   1. **Total requested OCPU count**, **Total requested memory**, and **Total local storage** are computed based on the local values that you accept or select.
   1. **Usable Exadata Storage (TB)** is limited by the Oracle Exadata Infrastructure.
   1. **Use Exadata sparse snapshots**, **Use local backups**, and **Usable storage allocation** are options that can only be set at this time before the Oracle Exadata VM Cluster has been provisioned.
   1. Select **Next** to continue.

1. From the **Networking** tab of the Create Oracle Exadata VM Cluster flow, enter the following information.
   1. The **Virtual network** is limited based on the **Subscription** and **Resource group** that you selected earlier in the provisioning flow.
   1. The **Client subnet** is selectable based on the selected **Virtual network**.
   1. To use a custom DNS domain, select the **Custom DNS** checkbox. If unchecked, the Oracle Exadata VM Cluster uses the default domain, oraclevcn.com.
   1. If checked, a list of existing DNS private views from OCI is presented. Select the view to use. To create a new private view and zones, see [Private DNS](https://docs.oracle.com/iaas/Content/DNS/Tasks/privatedns.htm).
   1. Enter the **Host name** prefix. The prefix forms the first portion of the Oracle Exadata VM Cluster host name.
   1. The **Host domain name** and **Host and domain URL** for your Oracle Exadata VM Cluster are read-only and populated with derived naming.
   1. Within the **Network ingress rules** section, the **Add additional network ingress rules** checkbox allows you to define addition ingress CIDR rules. Other network CIDR ranges (such as application or hub subnet ranges) can be added, during provisioning, to the network security group (NSG) ingress rules for the VM cluster. The selected virtual network's CIDR is added by default. CIDR ranges are specified. The port can be a single port, port range (for example, 80-8080), a comma-delimited list of ports (for example, 80,8080), or any combination of these port ranges. This only updates the OCI network security group ingress rules. Microsoft Azure virtual network security rules must be updated in the specific virtual network in Microsoft Azure.
   1. Select **Next** to continue.
1. From the **Diagnostics Collection** tab of the Create Oracle Exadata VM Cluster flow allows you to specify the diagnostic events, health monitoring, and incident logs and tracing that Oracle can use to identify, track, and resolve issues. Select **Next** to continue.
1. From the **Consent** tab of the **Create Oracle Exadata VM Cluster** flow, you must agree to the terms of service, privacy policy, and agree to access permissions. Select **Next** to continue.
1. From the **Tags** tab of the Create Oracle Exadata VM Cluster flow, you can define Microsoft Azure tags. **NOTE:** These tags aren't propagated to the Oracle Cloud Infrastructure (OCI) portal. Select **Next** to continue.
1. From the **Review + create** tab of the Create Oracle Exadata VM Cluster flow, a short validation process is run to check the values that you entered from the previous steps. If the validation fails, you must correct any errors before you can start the provisioning process.
1. Select the **Create** button to start the provisioning flow.
1. Return to the Oracle Exadata VM Cluster blade to monitor and manage the state of your Oracle Exadata VM Cluster environments.