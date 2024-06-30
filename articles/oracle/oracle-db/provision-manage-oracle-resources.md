---
title: Manage resources for Oracle Database@Azure
description: Manage resources for Oracle Database@Azure
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 6/07/2024
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---
# Manage resources for Oracle Database@Azure

After you provision an OracleDB@Azure resource, for example an Oracle Exadata Infrastructure or an Oracle Exadata VM Cluster, you can use the Microsoft Azure blade for a limited set of management functions. That limited set of management functions is described in this document.

## Common management functions from the Microsoft Azure Blade

The following management functions are available for all resources from the Microsoft Azure blade for that resource.

* **Access the resource blade**.
   1. From the Microsoft Azure portal, select OracleDB@Azure application.
   1. From the left menu, select the resource type. For example, select **Oracle Exadata Database@Azure** or **Oracle Autonomous Database@Azure**.
   1. If the blade lists and manages several resources, select the resource type at the top of the blade. For example, the **Oracle Exadata Database@Azure** blade accesses both Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources.
* **List and see the status for all the resources of the same type.**
   1. Follow the steps to access the resource blade.
   1. Resources are shown in the list as **Succeeded**, **Failed**, or **Provisioning**.
   1. Access the specifics of that resource by selecting the link in the **Name** field in the table.
* **Provision a new resource of the same type.**
   1. Follow the steps to access the resource blade.
   1. Select the **+ Create** icon at the top of the blade.
   1. Follow the provisioning flow for the resource.
* **Refresh the blade's info to see recent changes to the resource.**
   1. Follow the steps to access the resource blade.
   1. Select the **Refresh** icon at the top of the blade.
   1. Wait for the blade to reload.
* **Remove the resource.**
   1. Follow the steps to access the resource blade.
   1. You can remove a single or multiple resources from the blade by selecting the checkbox on the left side of the table. Once you have selected the resource(s) to remove, you can then select the **Delete** icon at the top of the blade.
   1. You can also remove a single resource by selecting the link to the resource from the **Name** field in the table. From the resource's detail page, select the **Delete** icon at the top of the blade.
* **Move the resource to a new resource group.**
   1. Follow the steps to access the resource blade.
   1. Select the link to the resource from the **Name** field in the table.
   1. From the resource's overview page, select the **Move** link on the Resource group field.
   1. From the **Move resources** page, use the drop-down field for **Resource group** to select an existing resource group.
   1. To create and use a new resource group, select the **Create new** link below the Resource group field. Enter a new resource group name in the **Name** field. Select the **OK** button to save your new resource group and use it. Select the **Cancel** button to return without creating a new resource group.
* **Move the resource to a new subscription.**

   > [!NOTE]
   > You must have access to another Microsoft Azure subscription, and that subscription must have been setup for access to OracleDB@Azure. If both of these conditions are not met, you will not be able to successfully move the resource to another subscription.

   1. Follow the steps to access the resource blade.
   1. Select the link to the resource from the Name field in the table.
   1. From the resource's overview page, select the **Move** link on the Subscription field.
   1. From the **Move resources** page, use the drop-down field for **Subscription** to select an existing subscription.
   1. You can also simultaneously move the resource group for the resource. To do this, note the steps in the **Move the resource to a new resource group** tasks. **Add, manage, or delete tags for the resource.**
   1. Follow the steps to access the resource blade.
   1. Select the link to the resource from the Name field in the table.
   1. From the resource's overview page, select the **Edit** link on the **Tags** field.
   1. To create a new tag, enter values in the **Name** and **Value** fields.
   1. To edit an existing tag, change the value in the existing tag's **Value** field.
   1. To delete an existing tag, select the **Trashcan** icon at the right-side of the tag.

## Manage resource allocation for Oracle Autonomous Database Serverless instances

The following management functions are available for Oracle Autonomous Database Serverless instances from the Microsoft Azure blade for that resource.

> [!NOTE]
> You can only change the resource allocation settings for Oracle Autonomous Database Serverless instances using these steps. This does not apply to any other resource type.

Follow the following steps to access the Oracle Autonomous Database@Azure blade.

   1. Select the link to the resource from the **Name** field in the table.
   1. From the resource's overview page, select the **Setting** link left-menu, and then the **Resource allocation** link.
   1. Select the **Manage** button at the top of the Resource allocation page.
   1. From the **Manage resource allocation** window, you can set the **ECPU count** from 2 to 512. The **Compute auto scaling** checkbox allows you to enable your Oracle Autonomous Database to scale its computing allocation automatically up to 512. The **Storage** is a slider UI that allows setting the Storage allocation from 1 TB to 384 TB. The **Storage auto scaling** checkbox allows you to enable your Oracle Autonomous Database to scale its storage allocation automatically up to 384 TB.
   1. After you have set or reviewed the fields, select the **Apply** or **Cancel** button as appropriate.

* **Use the OCI console for complete management of the resource.**

   1. Follow the steps to access the resource blade.
   1. Select the link to the resource from the **Name** field in the table.
   1. From the resource's detail page, select the **Go to OCI** link on the **OCI Database URL** field.
   1. Log in to OCI.
   1. Manage the resource from within the OCI console.