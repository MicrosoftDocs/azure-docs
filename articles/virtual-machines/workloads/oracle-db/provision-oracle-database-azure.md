---
title: Provision and manage Oracle Database@Azure
description: Provision and Manage Oracle Database@Azure.
author: jjaygbay1
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 04/16/2023
ms.author: jacobjaygbay

---

# Provision and manage Oracle Database@Azure

Oracle Database@Azure offers you a seamless integration of Oracle resources within the Microsoft Azure cloud environment.

:::image type="content" source="media/ODAAZMain.png" alt-text="Diagram showing the starting page for accessing Oracle Database@Azure from the Microsoft Azure portal.":::

You access the OracleDB@Azure service through the Microsoft Azure portal.

:::image type="content" source="media/ODAAZStart.png" alt-text="Diagram showing the second page for accessing Oracle Database@Azure from the Microsoft Azure portal.":::

From here, you create and manage Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources with direct access to the Oracle Cloud Infrastructure (OCI) portal for creation and management of Oracle Exadata Databases, including all Container Databases (CDBs) and Pluggable Databases (PDBs).

## Other information

For more information on specific database articles beyond their implementation and use within Oracle Database@Azure, see the following:
* [Exadata Database Service on Dedicated Infrastructure](https://docs.oracle.com/en/engineered-systems/exadata-cloud-service/ecscm/index.html#Oracle%C2%AE-Cloud)
* [Manage Databases on Exadata Cloud Infrastructure](https://docs.oracle.com/en/engineered-systems/exadata-cloud-service/ecscm/manage-databases.html#GUID-51424A67-C26A-48AD-8CBA-B015F88F841A)

## Create a resource

You can use the Oracle Database@Azure portal to provision Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources with direct access to the Oracle Cloud Infrastructure (OCI) portal for creation and management of Oracle Exadata Databases, including all Container Databases (CDBs) and Pluggable Databases (PDBs).

From the OracleDB@Azure blade, you can provision Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources.

:::image type="content" source="media/ODAAZExaInf01.png" alt-text="Diagram showing next page to access Oracle Database@Azure from the Microsoft Azure portal.":::

1. By default, the Oracle Exadata Infrastructure tab is selected.
1. To create an Oracle Exadata VM Cluster resource, select that tab first.
1. Select the + Create at the top to create a resource.
1. You can also select the Create buttons for either an Oracle Exadata Infrastructure or an Oracle Exadata VM Cluster.

## Provision Exadata infrastructure

Provisioning Oracle Exadata Infrastructure is a time-consuming process. Provisioning an Oracle Exadata Infrastructure is a prerequisite for provisioning Oracle Exadata VM Clusters and any Oracle Exadata Databases.

1. To provision an Oracle Exadata Infrastructure, start at the Oracle Database@Azure blade with the Oracle Exadata Infrastructure tab selected. Select the + Create icon.

    :::image type="content" source="media/ODAAZExaInf01.png" alt-text="Diagram showing the select and Create icon":::
 

1. From the Basics tab of the Create Oracle Exadata Infrastructure flow, enter the following information.

    :::image type="content" source="media/ODAAZExaInf02.png" alt-text="Diagram showing the basics Tab of the Create Oracle Exadata Infrastructure Flow":::

    1. Select the Microsoft Azure subscription to which the Oracle Exadata Infrastructure will be provisioned.
    1. Select an existing Resource group or select the Create new link to create and use a new Resource group for this resource.
    1. Enter a unique Name for the Oracle Exadata Infrastructure on this subscription.
    1. Select the Region where this Oracle Exadata Infrastructure is provisioned. 
     >[!Note] 
     > The regions where the OracleDB@Azure service is available are > limited.
    1. Select the Availability zone where this Oracle Exadata Infrastructure is provisioned. 
     >[!NOTE] 
     >The availability zones where the OracleDB@Azure service is available are limited.
    1. The Oracle Cloud account name field is display-only. If the name isn't showing correctly, your OracleDB@Azure account setup isn't successfully completed.
1. From the Configuration tab of the Create Oracle Exadata Infrastructure flow, enter the following information.

    :::image type="content" source="media/ODAAZExaInf03.png" alt-text="Diagram showing the basics Tab of the the configuration Tab of the Create Oracle Exadata Infrastructure Flow":::

    1. From the dropdown list, select the Exadata infrastructure model you want to use for this deployment. 
        >[!NOTE] 
        >Not all Oracle Exadata Infrastructure models are available. For more information, see [Oracle Exadata Infrastructure Models](https://docs.oracle.com/en-us/iaas/exadatacloud/exacs/ecs-ovr-x8m-scable-infra.html).
    1. The Database servers selector can be used to select a range from 2 to 32.
    1. The Storage servers selector can be used to select a range from 3 to 64.
    1. The OCPUs and Storage fields are automatically updated based on the settings of the Database servers and Storage servers selectors.
1. From the Maintenance tab of the Create Oracle Exadata Infrastructure flow, enter the following information. 
     :::image type="content" source="media/ODAAZExaInf04b.png" alt-text="Diagram showing the basics Tab of the the configuration Tab of the expanded Custom Maintence Schedule":::      
    1. The Maintenance method is selectable to either **Rolling** or **Non-rolling** based on your patching preferences.
    1. By default, the Maintenance schedule is set to **No preference**.
    1. If you select **Specify a schedule** for the **Maintenance schedule**, other options open for you to tailor a maintenance schedule that meets your requirements. Each of these selections requires at least one option in each field.
    1. You can enter up to 10 Names and Email addresses that are used as contacts for the maintenance process.
1. From the Consent tab of the Create Oracle Exadata Infrastructure flow, you must agree to the terms of service, privacy policy, and agree to access permissions.

    :::image type="content" source="media/ODAAZExaInf05.png" alt-text="Diagram showing the basics Tab of the the consent Tab of the Create Oracle Exadata Infrastructure Flow":::

1. From the Tags tab of the Create Oracle Exadata Infrastructure flow, you can define Microsoft Azure tags. 
    >[!NOTE]
    >These tags are not propagated to the Oracle Cloud Infrastructure (OCI) portal. 

     :::image type="content" source="media/ODAAZExaInf06.png" alt-text="Diagram showing the basics tags tab of the Create Oracle Exadata Infrastructure Flow":::

1. From the Review _+ create tab of the Create Oracle Exadata Infrastructure flow, a short validation process is run to check the values that you entered from the previous steps. If the validation fails, you must correct any errors before you can start the provisioning process.
 
     :::image type="content" source="media/ODAAZExaInf07.png" alt-text="Diagram showing validation succeeded":::

## Provision an Exadata VM Cluster

Provisioning an Oracle Exadata VM Cluster requires the existence of an Oracle Exadata Infrastructure, and is a prerequisite for Oracle Exadata Databases that runs on the cluster.

1. To provision an Oracle Exadata VM Cluster, start at the OracleDB@Azure blade with the Oracle Exadata VM Cluster tab selected. Select the + Create icon.

     :::image type="content" source="media/ODAAZExaVM01.png" alt-text="Diagram showing the Oracle Database@Azure Blade":::

1. From the Basics tab of the Create Oracle Exadata VM Cluster flow, enter the following information. NOTE: Before you can provision an Oracle Exadata VM Cluster, you must have a provisioned Oracle Exadata Infrastructure, which you assign for your Oracle Exadata VM Cluster. 

     :::image type="content" source="media/ODAAZExaVM02.png" alt-text="Diagram showing the Basics Tab of the Create Oracle Exadata VM Cluster Flow":::

   1. Select the Microsoft Azure subscription to which the Oracle Exadata VM Cluster will be provisioned.
    1. Select an existing Resource group or select the Create new link to create and use a new Resource group for this resource.
    1. Enter a unique Name for the Oracle Exadata VM Cluster on this subscription.
    1. Select the Region where this Oracle Exadata Infrastructure is provisioned. 
         >[!NOTE]
         >The regions where the OracleDB@Azure service is available are limited, and you should assign the Oracle Exadata VM Cluster to the same region as the parent Oracle Exadata Infrastructure.
    1. The Cluster name should match the Name to avoid other naming conflicts.
    1. Select the existing Exadata infrastructure that is the parent for your Oracle Exadata VM Cluster.
    1. The License type is either License Included or Bring your own license (BYOL). Your selection affects your billing.
    1. The default Time zone is UTC. Other time zones are available.
    1. The Grid Infrastructure Version is selectable but limited based on your previous selections.
    1. The SSH public key source can be selected to Generate new key pair, Use existing key stored in Azure, or Use existing public key. If you select Generate new key pair, you must give your newly generated key a unique name. If you select Use existing key stored in Azure, you must select that key from a dropdown of defined key for your subscription. If you select Use existing public key, you must provide an RSA public key in sing-line format (starting with "ssh-rsa") or the multi-line PEM format. You can generate SSH keys using ssh-keygen or Linux and OS X, or PuTTYGen on Windows.
1. From the Configuration tab of the Create Oracle Exadata VM Cluster flow, enter the following information. 

     :::image type="content" source="media/ODAAZExaVM03.png" alt-text="Diagram showing the Configuration Tab of the Create Oracle Exadata VM Cluster Flow"::: 

   1. The options for Compute count, DbSystem shape, OCPU count per VM, Memory per VM, and Local storage per VM are limited by the Oracle Exadata Infrastructure.
    1. Total requested OCPU count, Total requested memory, and Total local storage are computed based on the local values that you accept or select.
    1. Usable Exadata Storage (TB) is limited by the Oracle Exadata Infrastructure.1. Use Exadata sparse snapshots, Use local backups, and Usable storage allocation are options that can only be set at this time before the Oracle Exadata VM Cluster has been provisioned.
1. From the Networking tab of the Create Oracle Exadata VM Cluster flow, enter the following information. 

      :::image type="content" source="media/ODAAZExaVM04b.png" alt-text="Diagram showing the expanded Options for Private DNS Service"::: 

   1. The Virtual network is limited based on the Subscription and Resource group that you selected earlier in the provisioning flow.
    1. The Client subnet is selectable based on the selected Virtual network.
    1. By default, the Use private DNS service checkbox isn't selected. When not selected, you must enter a Host name prefix for your Oracle Exadata VM Cluster.
    1. If the Use private DNS service checkbox selected, you must enter Private view, Private zone, Host name prefix, Host domain name, and Host and domain URL for your Oracle Exadata VM Cluster. Private view and Private zone are dropdown selections based on your Subscription and Region. Host domain name is entered, and Host and domain URL is derived based on Host name prefix and Host domain name.
1. Use the Diagnostics Collection tab of the Create Oracle Exadata VM Cluster to specify the diagnostic events, health monitoring, and incident logs and tracing that Oracle can use to identify, track, and resolve issues. 

    :::image type="content" source="media/ODAAZExaVM05.png" alt-text="Diagram showing the diagnostics collection of the Create Oracle Exadata VM Cluster Flow"::: 

1. From the Consent tab of the Create Oracle Exadata VM Cluster flow, you must agree to the terms of service, privacy policy, and agree to access permissions.
Consent Tab of the Create Oracle Exadata VM Cluster Flow.

    :::image type="content" source="media/ODAAZExaVM06.png" alt-text="Diagram showing the Consent Tab of the Create Oracle Exadata VM Cluster Flow"::: 

1. From the Tags tab of the Create Oracle Exadata VM Cluster flow, you can define Microsoft Azure tags.

     >[!NOTE]
     > These tags are not propagated to the Oracle Cloud Infrastructure (OCI) portal. !

    :::image type="content" source="media/ODAAZExaVM07.png" alt-text="Diagram showing the Tags Tab of the Create Oracle Exadata VM Cluster Flow"::: 

1. From the Review _+ create tab of the Create Oracle Exadata VM Cluster flow, a short validation process is run to check the values that you entered from the previous steps. If the validation fails, you must correct any errors before you can start the provisioning process. 

    :::image type="content" source="media/ODAAZExaVM08.png" alt-text="Diagram showing Validation Succeeded"::: 

## Troubleshooting

Use the information in this section to resolve common errors and provisioning issues in the Oracle Database@Azure. The issues covered in this guide don't cover general issues related to Oracle Database@Azure configuration, settings, and account setup. For that troubleshooting guide, see the [xref-here](http://link-to-be-determined.com) guide.