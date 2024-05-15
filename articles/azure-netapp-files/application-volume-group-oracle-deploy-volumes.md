---
title: Deploy application volume group for Oracle using Azure NetApp Files 
description: Describes how to deploy all required volumes for your Oracle database using Azure NetApp Files application volume group for Oracle. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 10/20/2022
ms.author: anfdocs
---
# Deploy application volume group for Oracle

This article describes how to deploy all required volumes for your Oracle database using Azure NetApp Files application volume group for Oracle.

## Before you begin

You should understand the [requirements and considerations for application volume group for Oracle](application-volume-group-oracle-considerations.md). 

## Register the feature  

Azure NetApp Files application volume group for Oracle is currently in preview. Before using this feature for the first time, you need to register it. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFOracleVolumeGroup 
    ```

2. Check the status of the feature registration: 

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFOracleVolumeGroup
    ```
    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is **Registered** before continuing.

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Steps 

1. From your NetApp account, select **Application volume groups**, and click **+Add Group**.

    [ ![Screenshot that shows how to add a group for Oracle.](./media/volume-hard-quota-guidelines/application-volume-group-oracle-add-group.png) ](./media/volume-hard-quota-guidelines/application-volume-group-oracle-add-group.png#lightbox)

2. In Deployment Type, select **ORACLE** then **Next**. 

3. In the **ORACLE** tab, provide Oracle-specific information:   

    * **Unique System ID (SID)**:    
        Choose a unique identifier that will be used in the naming proposals for all your storage objects and helps to uniquely identify the volumes for this database.
    * **Group name / Group description**:  
        Provide the volume group name and description.
    * **Number of Oracle data volumes (1-8)**:  
        Depending on your sizing and performance requirements of the database you can create a minimum of 1 and up to 8 data volumes. 
    * **Oracle database size in (TiB)**:   
        Specify the total capacity required for your database. If you select more than one database volume, the capacity is distributed evenly among all volumes. You may change each individual volume once the proposals have been created. See Step 8 in this article.
    * **Additional capacity for snapshots (%)**:   
        If you use snapshots for data protection, you need to plan for extra capacity. This field will add an additional size (%) for the data volume.
    * **Oracle database storage throughput (MiB/s)**:   
        Specify the total throughput required for your database. If you select more than one database volume, the throughput is distributed evenly among all volumes. You may change each individual volume once the proposals have been created. See Step in this article.

    Click **Next: Volume Group**.

    [ ![Screenshot that shows the Oracle tag for creating a volume group.](./media/volume-hard-quota-guidelines/application-oracle-tag.png) ](./media/volume-hard-quota-guidelines/application-oracle-tag.png#lightbox)

4. In the **Volume group** tab, provide information for creating the volume group:

    * **Availability options**:  
        There are two **Availability** options. This screenshot is for a volume placement using **Availability Zone**.  
    * **Availability Zone**:  
        Select the zone where Azure NetApp Files is available. In regions without zones, you can select **none**.
    * **Network features**:  
        Select either **Basic** or **Standard** network features. All volumes should use the same network feature. This selection is set for each individual volume.
    * **Capacity pool**:  
        All volumes will be placed in a single manual QoS capacity pool.
    * **Virtual network**:  
        Specify an existing VNet where the VMs are placed. 
    * **Subnet**:  
        Specify the delegated subnet where the IP addresses for the NFS exports will be created. Ensure that you have a delegated subnet with enough free IP addresses.

    Select **Next: Tags**. Continue with Step 6. 

    [ ![Screenshot that shows the Volume Group tag for Oracle.](./media/volume-hard-quota-guidelines/application-volume-group-tag-oracle.png) ](./media/volume-hard-quota-guidelines/application-volume-group-tag-oracle.png#lightbox)

5. If you select **Proximity placement group**, then specify the following information in the **Volume group** tab: 

    * **Availability options**:   
        This screenshot is for a volume placement using **Proximity placement group**.
    * **Proximity placement group**:
        Specify the proximity placement group for all volumes.

    > [!NOTE]
    > The use of proximity placement group requires activation and needs to be requested.

    Select **Next: Tags**. 

    [ ![Screenshot that shows the option for proximity placement group.](./media/volume-hard-quota-guidelines/proximity-placement-group-oracle.png) ](./media/volume-hard-quota-guidelines/proximity-placement-group-oracle.png#lightbox)

6. In the **Tags** section of the Volume Group tab, you can add tags as needed for the volumes.   

    Select **Next: Protocol**. 

    [ ![Screenshot that shows how to add tags for Oracle.](./media/volume-hard-quota-guidelines/application-add-tags-oracle.png) ](./media/volume-hard-quota-guidelines/application-add-tags-oracle.png#lightbox)


7. In the **Protocols** section of the Volume Group tab, you can select the NFS version, modify the Export Policy, and select [LDAP-enabled volumes](configure-ldap-extended-groups.md). These settings need to be common to all volumes. 

    > [!NOTE]
    > For optimal performance, use Oracle dNFS to mount the volumes at the database server. We recommend using NFSv3 as a base for dNFS, but NFSv4.1 is also supported. Check the support documentation of your Azure VM operating system for guidance about which NFS protocol version to use in combination with dNFS and your operating system. 

    Select **Next: Volumes**. 

    [ ![Screenshot that shows the protocols tags for Oracle.](./media/volume-hard-quota-guidelines/application-protocols-tag-oracle.png) ](./media/volume-hard-quota-guidelines/application-protocols-tag-oracle.png#lightbox)

8. The **Volumes** tab summarizes the volumes that are being created with proposed volume name, quota, and throughput. 

    The Volumes tab also shows the zone or proximity placement group in which the volumes are created.

    [ ![Screenshot that shows a list of volumes being created for Oracle.](./media/volume-hard-quota-guidelines/application-volume-list-oracle.png) ](./media/volume-hard-quota-guidelines/application-volume-list-oracle.png#lightbox)

9. In the **Volumes** tab, you can select each volume to view or change the volume details.   

    When you select a volume, you can change the following values in the **Volume-Detail-Basics** tab:

    * **Volume Name**:   
        It's recommended that you retain the suggested naming conventions.
    * **Quota**:   
        The size of the volume.
    * **Throughput**:  
        You can edit the proposed throughput requirements for the selected volume.

    Select **Next: Protocol** to review the protocol settings. 

    [ ![Screenshot that shows the Basics tab of Create a Volume Group page for Oracle.](./media/volume-hard-quota-guidelines/application-create-volume-basics-tab-oracle.png) ](./media/volume-hard-quota-guidelines/application-create-volume-basics-tab-oracle.png#lightbox)


10. In the **Volume Details - Protocol** tab of a volume, the defaults are based on the volume group input you provided previously. You can adjust the file path that is used for mounting the volume, as well as the export policy.

    > [!NOTE]
    > For consistency, consider keeping volume name and file path identical.

    Select **Next: Tags** to review the tags settings. 

    [ ![Screenshot that shows the Volume Details - Protocol tab of Create a Volume Group page for Oracle.](./media/volume-hard-quota-guidelines/application-create-volume-details-protocol-tab-oracle.png) ](./media/volume-hard-quota-guidelines/application-create-volume-details-protocol-tab-oracle.png#lightbox)

11. In the **Volume Detail – Tags** tab of a volume, the defaults are based on the volume group input you provided previously. You can adjust volume specific tags here.

    Select **Volumes** to return to the Volumes tab.

    [ ![Screenshot that shows the Volume Details - Tags tab of Create a Volume Group page for Oracle.](./media/volume-hard-quota-guidelines/application-create-volume-details-tags-tab-oracle.png) ](./media/volume-hard-quota-guidelines/application-create-volume-details-tags-tab-oracle.png#lightbox)

12. The **Volumes Tab** enables you to remove optional volumes.  
    On the Volumes tab, optional volumes are marked with an asterisk (`*`) in front of the name.   
    If you want to remove the optional volumes such as `ORA1-ora-data4` volume or `ORA1-ora-binary` volume from the volume group, select the volume then **Remove volume**. Confirm the removal in the dialog box that appears.

    > [!IMPORTANT]    
    > You cannot add a removed volume back to the volume group again.

    Select **Volumes** after completing the changes of volumes.

    Select **Next: Review + Create**.

    [ ![Screenshot that shows how to remove an optional volume for Oracle.](./media/volume-hard-quota-guidelines/application-volume-remove-oracle.png) ](./media/volume-hard-quota-guidelines/application-volume-remove-oracle.png#lightbox)   

    [ ![Screenshot that shows confirmation about removing an optional volume for Oracle.](./media/volume-hard-quota-guidelines/application-volume-remove-confirm-oracle.png) ](./media/volume-hard-quota-guidelines/application-volume-remove-confirm-oracle.png#lightbox)


13.	The **Review + Create** tab lists all the volumes that will be created. The process also validates the creation.  

    Select **Create Volume Group** to start the volume group creation. 

    [ ![Screenshot that shows the Review and Create tab for Oracle.](./media/volume-hard-quota-guidelines/application-review-create-oracle.png) ](./media/volume-hard-quota-guidelines/application-review-create-oracle.png#lightbox)


14. The **Volume Groups** deployment workflow starts, and the progress is displayed. This process can take a few minutes to complete.

    [ ![Screenshot that shows the Deployment in Progress window for Oracle.](./media/volume-hard-quota-guidelines/application-deployment-in-progress-oracle.png) ](./media/volume-hard-quota-guidelines/application-deployment-in-progress-oracle.png#lightbox)

    Creating a volume group is an "all-or-none" operation. If one volume can't be created, the operation is canceled, and all remaining volumes will be removed also.

    [ ![Screenshot that shows the new volume group for Oracle.](./media/volume-hard-quota-guidelines/application-new-volume-group-oracle.png) ](./media/volume-hard-quota-guidelines/application-new-volume-group-oracle.png#lightbox)


15. Following complete, in **Volumes** you can display the list of volume groups to see the new volume group. You can select the new volume group to see the details and status of each of the volumes being created.

## Next steps

* [Understand application volume group for Oracle](application-volume-group-oracle-introduction.md)
* [Requirements and considerations for application volume group for Oracle](application-volume-group-oracle-considerations.md)
* [Manage volumes in an application volume group for Oracle](application-volume-group-manage-volumes-oracle.md)
* [Configure application volume group for Oracle using REST API](configure-application-volume-oracle-api.md) 
* [Deploy application volume group for Oracle using Azure Resource Manager](configure-application-volume-oracle-azure-resource-manager.md) 
* [Troubleshoot application volume group errors](troubleshoot-application-volume-groups.md)
* [Delete an application volume group](application-volume-group-delete.md)
* [Application volume group FAQs](faq-application-volume-group.md)
