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

## <a name="add-blob-access"></a> Add Storage Blob Data Contributor access 

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

If the data for your labeling project is accessed from an external datastore, set access for that datastore and the default datastore. 

1. Navigate to the external datastore in the [Azure portal](https://portal.azure.com).
1. Follow the previous steps, starting with [Add role assignment](#add) to add the Storage Blob Data Contributor role to the workspace identity.

## Set datastore to use workspace managed identity

When your workspace is secured with a virtual network, use these steps to set the datastore to use the workspace managed identity:

1. In Azure Machine Learning studio, on the left menu, select **Data**.
1. On the top tabs, select **Datastores**.
1. Select the datastore you're using to access data in your labeling project.
1. On the top toolbar, select **Update authentication**.
1. Toggle on the entry for "Use workspace managed identity for data preview and profiling in Azure Machine Learning studio."

## When data preprocessing fails

Another possible issue with creating a data labeling project is when data preprocessing fails. You'll see an error that looks like this:

:::image type="content" source="media/how-to-troubleshoot-data-labeling/data-error.png" alt-text="Screenshot shows a data preprocessing error.":::

This error can occur when you use a v1 tabular dataset as your data source. The project first converts this data. Data access errors can cause this conversion to fail. To resolve this issue, check the way your datastore saves credentials for data access.

1. In the left menu of your workspace, select **Data**.
1. On the top tab, select **Datastores**.
1. Select the datastore where your v1 tabular data is stored.
1. On the top toolbar, select **Update authentication**.
1. If the toggle for **Save credentials with the datastore for data access** is **On**, verify that the Authentication type and values are correct.
1. If the toggle for **Save credentials with the datastore for data access** is **Off**, follow the rest of these steps to ensure that the compute cluster can access the data.

When the **Save credentials with the datastore for data access** is **Off**, the compute cluster that runs the conversion job needs access to the datastore. To ensure that the compute cluster can access the data, find the compute cluster name and assign a managed identity, follow these steps: 

1. In the left menu, select **Jobs**.
1. Select experiment which includes the name **Labeling ConvertTabularDataset**.
1. If you see a failed job, select the job. (If you see a successful job, the conversion was successful.)
1. In the Overview section, at the bottom of the page is the **Compute** section. Select the **Target** compute cluster.
1. On the details page for the compute cluster, at the bottom of the page is the **Managed identity** section. If the compute cluster doesn't have an identity, select the **Edit** tool to assign a system-assigned or managed identity.

Once you have the compute cluster name with a managed identity, assign the Storage Blob Data Contributor role to the compute cluster. 

Follow the previous steps to [Add Storage Blob Data Contributor access](#add-blob-access). But this time, you'll be selecting the compute resource in the **Select members** section, so that the compute cluster has access to the datastore.

* If you're using a system-assigned identity, search for the compute name by using the workspace name, followed by `/computes/` followed by the compute name. For example, if the workspace name is `myworkspace` and the compute name is `mycompute`, search for `myworkspace/computes/mycompute` to select the member.
* If you're using a user-assigned identity, search for the user-assigned identity name.

## Related resources

For information on how to troubleshoot project management issues, see [Troubleshoot project management issues](how-to-manage-labeling-projects.md#troubleshoot-issues).
