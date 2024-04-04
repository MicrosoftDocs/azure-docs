---
title: Troubleshoot data labeling project creation
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot and resolve issues when creating your data labeling project.
author: kvijaykannan
ms.author: vkann
ms.reviewer: sgilley
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.date: 03/07/2024
ms.topic: troubleshooting
#customer intent: To troubleshoot and resolve issues that occur when creating your data labeling project.
---

# Troubleshoot problems during creation of a data labeling project 

If you have errors that occur while creating a data labeling project try the following troubleshooting steps.

## Add Storage Blob Data Contributor access to the workspace identity

In many cases, an error creating the project could be due to access issues. To resolve access problems, add the Storage Blob Data Contributor role to the workspace identity with these steps:

1. Select the storage account in the Azure portal.

    1. In [Azure Machine Learning studio](https://ml.azure.com), on the top right banner, select the workspace name.
    1. At the bottom of the section that appears, select **View all properties in Azure portal**.

        :::image type="content" source="media/how-to-troubleshoot-data-labeling/view-all-properties.png" alt-text="Screenshot shows where to access View all properties in Azure portal.":::
    
    1. In the Azure portal page for your workspace, select link for **Storage**.
        
        :::image type="content" source="media/how-to-troubleshoot-data-labeling/select-storage.png" alt-text="Screenshot shows link for storage in Azure portal.":::

1. <a name="add"></a> Add role assignment.
    
    1. In the storage account left menu, select **Access Control (IAM)**.
    1. In the top toolbar of the Access control settings, select **+ Add** then **Add role assignment**.

        :::image type="content" source="media/how-to-troubleshoot-data-labeling/add-role-assignment.png" alt-text="Screenshot shows adding the role assignment.":::

    1. Search for "Storage Blob Data Contributor."
    1. Select **Storage Blob Data Contributor** from the list of roles.
    1. Select **Next**.

        :::image type="content" source="media/how-to-troubleshoot-data-labeling/storage-blob-data-contributor.png" alt-text="Screenshot shows Storage Blob Data Contributor role.":::

1. Select members.

    1. In the Members page, select **+Select members**.
    1. Search for your workspace identity.  
        1. By default, the workspace identity is the same as the workspace name.
        1. If the workspace was created with user assigned identity, search for the user identity name.
    1. Select the **Enterprise application** with the workspace identity name.
    1. Select the **Select** button at the bottom of the page.

        :::image type="content" source="media/how-to-troubleshoot-data-labeling/select-members.png" alt-text="Screenshot shows selecting members.":::

1. Review and assign the role.
    
    1. Select **Review + assign** to review the entry.
    1. Select **Review + assign** again and wait for the assignment to complete.

## Set access for external datastore

If the data for your labeling project is accessed from an external datastore, set access for that datastore as well as the default datastore.  

1. Navigate to the external datastore in the [Azure portal](https://portal.azure.com).
1. Follow steps above starting with [Add role assignment](#add) to add the Storage Blob Data Contributor role to the workspace identity.

## Set datastore to use workspace managed identity

When your workspace is secured with a virtual network, use these steps to set the datastore to use the workspace managed identity:

1. In Azure Machine Learning studio, on the left menu, select **Data**.
1. On the top tabs, select **Datastores**.
1. Select the datastore you're using to access data in your labeling project.
1. On the top toolbar, select **Update authentication**.
1. Toggle on the entry for "Use workspace managed identity for data preview and profiling in Azure Machine Learning studio."

## Related resources

For information on how to troubleshoot project management issues, see [Troubleshoot project management issues](how-to-manage-labeling-projects.md#troubleshoot-issues).
