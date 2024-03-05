---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 03/04/2024
ms.author: sdgilley
---

If you have errors creating a data labeling project, or accessing data once the project is created, try the following two troubleshooting steps:

### Add Storage Blob Data Contributor access to the workspace

In many cases, an error creating the project could be due to access issues. To resolve access problems, add the Storage Blob Data Contributor role to the workspace with these steps:

1. Select the storage account in the Azure portal.

    1. In Azure Machine Learning studio, on the top right banner, select the workspace name.
    1. At the bottom of the section that appears, select **View all properties in Azure portal**.
    1. In the Azure portal page for your workspace, select link for **Storage**.

1. Add role assignment.
    
    1. In the storage account left menu, select **Access Control (IAM)**.
    1. In the top toolbar of the Access control settings, select **+ Add** then **Add role assignment**.
    1. Search for "Storage Blob Data Contributor."
    1. Select **Storage Blob Data Contributor** from the list of roles.
    1. Select **Next**.

1. Select members.

    1. In the Members page, select **+Select members**.
    1. Search for name of workspace.
    1. Select the Enterprise application with the workspace name.
    1. Select the **Select** button at the bottom of the page.

1. Review and assign the role.
    
    1. Select **Review + assign** to review the entry.
    1. Select **Review + assign** again and wait for the assignment to complete.

### Set datastore to use workspace managed identity

When your workspace is secured with a virtual network, use these steps to set the datastore to use the workspace managed identity:

1. In Azure Machine Learning studio, on the left menu, select **Data**.
1. On the top tabs, select **Datastores**.
1. Select the datastore you're using to access data in your labeling project.
1. On the top toolbar, select **Update authentication**.
1. Toggle on the entry for "Use workspace managed identity for data preview and profiling in Azure Machine Learning studio."



