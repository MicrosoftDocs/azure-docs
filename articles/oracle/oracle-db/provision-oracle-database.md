---
title: Provision and manage Oracle Database@Azure
description: Provision and Manage Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 12/12/2023
ms.custom: engagement-fy23
ms.author: jacobjaygbay

---

# Provision and manage Oracle Database@Azure

Oracle Database@Azure offers you a seamless integration of Oracle resources within Microsoft Azure.

:::image type="content" source="media/oracle-database-azure-home.png" alt-text="Diagram showing the starting page for accessing Oracle Database@Azure from the Microsoft Azure portal." lightbox="media/oracle-database-azure-home.png":::
 
After accepting the private offer through the Azure Marketplace, navigate to the Oracle Database@Azure service page in the Azure portal to create and manage Oracle Exadata Infrastructure and Oracle Exadata virtual machine Cluster resources with direct access to the Oracle Cloud Infrastructure (OCI) portal to create and manage Oracle Exadata Databases, including all Container Databases (CDBs) and Pluggable Databases (PDBs).

:::image type="content" source="media/oracle-database-azure-start.png" alt-text="Diagram showing the second page for accessing Oracle Database@Azure from the Microsoft Azure portal." lightbox="media/oracle-database-azure-start.png":::

## Additional information

For more information on specific database articles beyond their implementation and use within Oracle Database@Azure, see the following articles:
- [Exadata Database Service on Dedicated Infrastructure](https://docs.oracle.com/en/engineered-systems/exadata-cloud-service/ecscm/index.html#Oracle%C2%AE-Cloud)
 - [Manage Databases on Exadata Cloud Infrastructure](https://docs.oracle.com/en/engineered-systems/exadata-cloud-service/ecscm/manage-databases.html#GUID-51424A67-C26A-48AD-8CBA-B015F88F841A)

## Create an Exadata infrastructure

Navigate to the Oracle Database@Azure service blade, to provision Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources.

:::image type="content" source="media/oracle-database-azure-start.png" alt-text="Diagram showing next page to access Oracle Database@Azure from the Microsoft Azure portal." lightbox="media/oracle-database-azure-start.png":::

1. By default, the Oracle Exadata Infrastructure tab is selected.
1. To create an Oracle Exadata Virtual Machine Cluster resource, select that tab first.
1. Select the + Create at the top to create a resource.
1. You can also select the Create buttons for either an Oracle Exadata Infrastructure or an Oracle Exadata Virtual Machine Cluster.

## Provision Exadata infrastructure

Provisioning Oracle Exadata Infrastructure takes a few hours and is a prerequisite for provisioning Oracle Exadata VM Clusters and any Oracle Exadata Databases.

1. To provision an Oracle Exadata Infrastructure, start at the Oracle Database@Azure blade with the Oracle Exadata Infrastructure tab selected. Select the + Create icon.

    :::image type="content" source="media/oracle-database-azure-infrastructure-01.png" alt-text="Diagram showing the select and Create icon" lightbox="media/oracle-database-azure-infrastructure-01.png":::
 

1. From the Basics tab of the Create Oracle Exadata Infrastructure flow, enter the following information.

    :::image type="content" source="media/oracle-database-azure-infrastructure-02.png" alt-text="Diagram showing the basics Tab of the Create Oracle Exadata Infrastructure Flow" lightbox="media/oracle-database-azure-infrastructure-02.png":::

    1. Select the Microsoft Azure subscription to which the Oracle Exadata Infrastructure is being provisioned.
    1. Select an existing Resource group or select the Create new link to create and use a new Resource group for this resource.
    1. Enter a unique Name for the Oracle Exadata Infrastructure on this subscription.
    1. Select the Region where this Oracle Exadata Infrastructure is provisioned. 
       
    1. Select the Availability zone where this Oracle Exadata Infrastructure is provisioned. 
       >[!NOTE] 
       >Select the same availability zone as your application tier for proximity. Oracle Database@Azure is deployed in at least two availability zones per region.
    1. The Oracle Cloud account name field is display-only. If the name isn't showing correctly, your Oracle Database@Azure account setup isn't successfully completed.
1. From the Configuration tab of the Create Oracle Exadata Infrastructure flow, enter the following information.

    :::image type="content" source="media/oracle-database-azure-infrastructure-03.png" alt-text="Diagram showing the basics Tab of the configuration Tab of the Create Oracle Exadata Infrastructure Flow" lightbox="media/oracle-database-azure-infrastructure-03.png":::

    1. From the dropdown list, select the Exadata infrastructure model you want to use for this deployment. 
        >[!NOTE] 
        > Not all Oracle Exadata Infrastructure models are available. For more information, see [Oracle Exadata Infrastructure Models](https://docs.oracle.com/en-us/iaas/exadatacloud/exacs/ecs-ovr-x8m-scable-infra.html).
    1. Use the database servers selector to select a range from 2 to 32.
    1. Use the storage servers selector to select a range from 3 to 64.
    1. The OCPUs and storage fields are automatically updated based on the settings of the database servers and storage servers selectors.
1. From the Maintenance tab of the Create Oracle Exadata Infrastructure flow, enter the following information. 
     :::image type="content" source="media/oracle-database-azure-infrastructure-04b.png" alt-text="Diagram showing the basics Tab of the the configuration Tab of the expanded Custom Maintenance Schedule" lightbox="media/oracle-database-azure-infrastructure-04b.png":::      
    1. The Maintenance method is selectable to either **Rolling** or **Non-rolling** based on your patching preferences.
    1. By default, the Maintenance schedule is set to **No preference**.
    1. If you select **Specify a schedule** for the **Maintenance schedule**, other options open for you to tailor a maintenance schedule that meets your requirements. Each of these selections requires at least one option in each field.
    1. You can enter up to 10 Names and Email addresses that are used as contacts for the maintenance process.
1. From the Consent tab of the Create Oracle Exadata Infrastructure flow, you must agree to the terms of service, privacy policy, and agree to access permissions.

    :::image type="content" source="media/oracle-database-azure-infrastructure-05.png" alt-text="Diagram showing the basics Tab of the the consent Tab of the Create Oracle Exadata Infrastructure Flow" lightbox="media/oracle-database-azure-infrastructure-05.png":::

1. From the Tags tab of the Create Oracle Exadata Infrastructure flow, you can define Microsoft Azure tags. 
    >[!NOTE]
    >These tags are not propagated to the Oracle Cloud Infrastructure (OCI) portal. 

     :::image type="content" source="media/oracle-database-azure-infrastructure-06.png" alt-text="Diagram showing the Tags tab of the Create Oracle Exadata Infrastructure Flow" lightbox="media/oracle-database-azure-infrastructure-06.png":::

1. From the Review _+ create tab of the Create Oracle Exadata Infrastructure flow, a short validation process is run to check the values that you entered from the previous steps. If the validation fails, you must correct any errors before you can start the provisioning process.
 
     :::image type="content" source="media/oracle-database-azure-infrastructure-07.png" alt-text="Diagram showing validation succeeded" lightbox="media/oracle-database-azure-infrastructure-07.png":::

## Provision an Exadata Virtual Machine Cluster

Once you have provisioned the Oracle Exadata Infrastructure, you now need to create  an Oracle Exadata VM Cluster to run your  Oracle Exadata Databases.

1. To provision an Oracle Exadata Virtual Machine Cluster, start at the OracleDB@Azure blade with the Oracle Exadata Virtual Machine Cluster tab selected. Select the **+ Create** icon.

     :::image type="content" source="media/oracle-database-azure-virtual-machine-01.png" alt-text="Diagram showing the Oracle Database@Azure Blade" lightbox="media/oracle-database-azure-virtual-machine-01.png":::

1. From the Basics tab of the Create Oracle Exadata Virtual Machine Cluster flow, enter the following information. 
    >[!NOTE] 
    > Before you can provision an Oracle Exadata Virtual Machine Cluster, you must have a provisioned Oracle Exadata Infrastructure, which you assign for your Oracle Exadata Virtual Machine Cluster. 

     :::image type="content" source="media/oracle-database-azure-virtual-machine-02.png" alt-text="Diagram showing the Basics Tab of the Create Oracle Exadata Virtual Machine Cluster Flow" lightbox="media/oracle-database-azure-virtual-machine-02.png":::

    1. Select the Microsoft Azure subscription to which the Oracle Exadata Virtual Machine Cluster will be provisioned.
    1. Select an existing Resource group or select the Create new link to create and use a new Resource group for this resource.
    1. Enter a unique Name for the Oracle Exadata Virtual Machine Cluster on this subscription.
    1. Select the Region where this Oracle Exadata Infrastructure is provisioned. 
        >[!NOTE]
        >You should assign the Oracle Exadata VM Cluster to the same region as the parent Oracle Exadata Infrastructure.
    1. The Cluster name should match the Name to avoid other naming conflicts.
    1. Select the existing Exadata infrastructure that is the parent for your Oracle Exadata Virtual Machine Cluster.
    1. The License type is either License Included or Bring your own license (BYOL). Your selection affects your billing.
    1. The default Time zone is UTC. Other time zones are available.
    1. The Grid Infrastructure Version is selectable but limited based on your previous selections.
    1. The SSH public key source can be selected to Generate new key pair, Use existing key stored in Azure, or Use existing public key. If you select Generate new key pair, you must give your newly generated key a unique name. If you select Use existing key stored in Azure, you must select that key from a dropdown of defined key for your subscription. If you select Use existing public key, you must provide an RSA public key in sing-line format (starting with "ssh-rsa") or the multi-line PEM format. You can generate SSH keys using ssh-keygen or Linux and OS X, or PuTTYGen on Windows.
1. From the Configuration tab of the Create Oracle Exadata Virtual Machine Cluster flow, enter the following information. 

     :::image type="content" source="media/oracle-database-azure-virtual-machine-03.png" alt-text="Diagram showing the Configuration Tab of the Create Oracle Exadata Virtual Machine Cluster Flow" lightbox="media/oracle-database-azure-virtual-machine-03.png"::: 

   1. The options for Compute count, DbSystem shape, OCPU count per VM, Memory per VM, and Local storage per Virtual Machine are limited by the Oracle Exadata Infrastructure.
    1. Total requested OCPU count, Total requested memory, and Total local storage are computed based on the local values that you accept or select.
    1. Usable Exadata Storage (TB) is limited by the Oracle Exadata Infrastructure.1. Use Exadata sparse snapshots, Use local backups, and Usable storage allocation are options that can only be set at this time before the Oracle Virtual Machine Cluster has been provisioned.
1. From the **Networking** tab of the Create Oracle Exadata Virtual Machine Cluster flow, enter the following information. 

      :::image type="content" source="media/oracle-database-azure-virtual-machine-04b.png" alt-text="Diagram showing the expanded Options for Private DNS Service" lightbox="media/oracle-database-azure-virtual-machine-04b.png"::: 

    1. Select the virtual network from the **Virtual network** drop-down list. A filtered list for selection based on the Subscription and Resource group that you selected earlier in the provisioning flow displays.
    1. Next select the ``Client subnet`` from the Virtual network selected in step a above. You can only select the subnet that’s delegated to ``Oracle.Database/networkAttachments``.
    1. By default, the Use private DNS service checkbox isn't selected. When not selected, you must enter a Host name prefix for your Oracle Exadata Virtual Machine Cluster.
    1. If the **Use private DNS service** checkbox is selected, you must enter Private view, Private zone, Host name prefix, Host domain name, and Host and domain URL for your Oracle Exadata Virtual Machine Cluster. Private view and Private zone are in the drop-down list selections based on your Subscription and Region. Host domain name is entered, and Host and domain URL is derived based on Host name prefix and Host domain name.
1. Use the **Diagnostics Collection** tab of the **Create Oracle Exadata Virtual Machine Cluster** to specify the diagnostic events, health monitoring, and incident logs and tracing that Oracle can use to identify, track, and resolve issues. 

    :::image type="content" source="media/oracle-database-azure-virtual-machine-05.png" alt-text="Diagram showing the diagnostics collection of the Create Oracle Exadata Virtual Machine Cluster Flow" lightbox="media/oracle-database-azure-virtual-machine-05.png"::: 

1. From the Consent tab of the Create Oracle Exadata Virtual Machine Cluster flow, you must agree to the terms of service, privacy policy, and agree to access permissions.
Consent Tab of the Create Oracle Exadata Virtual Machine Cluster Flow.

    :::image type="content" source="media/oracle-database-azure-virtual-machine-06.png" alt-text="Diagram showing the Consent Tab of the Create Oracle Exadata Virtual Machine Cluster Flow" lightbox="media/oracle-database-azure-virtual-machine-06.png"::: 

1. From the Tags tab of the Create Oracle Exadata Virtual Machine Cluster flow, you can define Microsoft Azure tags.

     >[!NOTE]
     > These tags are not propagated to the Oracle Cloud Infrastructure (OCI) portal.

    :::image type="content" source="media/oracle-database-azure-virtual-machine-07.png" alt-text="Diagram showing the Tags Tab of the Create Oracle Exadata Virtual Machine Cluster flow" lightbox="media/oracle-database-azure-virtual-machine-07.png"::: 

1. From the Review _+ create tab of the Create Oracle Exadata Virtual Machine Cluster flow, a short validation process is run to check the values that you entered from the previous steps. If the validation fails, you must correct any errors before you can start the provisioning process. 

    :::image type="content" source="media/oracle-database-azure-virtual-machine-08.png" alt-text="Diagram showing Validation Succeeded" lightbox="media/oracle-database-azure-virtual-machine-08.png"::: 

1. Now that you have provisioned the Oracle Exadata infrastructure and Virtual Machine Cluster go to the Oracle Cloud Infrastructure (OCI) portal to create and manage Oracle Exadata Databases, including all Container Databases (CDBs) and Pluggable Databases (PDBs).

## Next steps
- [Overview - Oracle Database@Azure](database-overview.md)
- [Onboard with Oracle Database@Azure](onboard-oracle-database.md)
- [Oracle Database@Azure support information](oracle-database-support.md)
- [Network planning for Oracle Database@Azure](oracle-database-network-plan.md)
- [Groups and roles for Oracle Database@Azure](oracle-database-groups-roles.md)
