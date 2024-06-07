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

* __Access the resource blade.__
   1. From the Microsoft Azure portal, select OracleDB@Azure application.
   1. From the left menu, select the resource type. For example, select __Oracle Exadata Database@Azure__ or __Oracle Autonomous Database@Azure__.
   1. If the blade lists and manages several resources, select the resource type at the top of the blade. For example, the __Oracle Exadata Database@Azure__ blade accesses both Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources.
* __List and see the status for all the resources of the same type.__
   1. Follow the steps to access the resource blade.
   1. Resources are shown in the list as __Succeeded__, __Failed__, or __Provisioning__.
   1. Access the specifics of that resource by selecting the link in the __Name__ field in the table.
* __Provision a new resource of the same type.__
   1. Follow the steps to access the resource blade.
   1. Select the __+ Create__ icon at the top of the blade.
   1. Follow the provisioning flow for the resource.
* __Refresh the blade's info to see recent changes to the resource.__
   1. Follow the steps to access the resource blade.
   1. Select the __Refresh__ icon at the top of the blade.
   1. Wait for the blade to reload.
* __Remove the resource.__
   1. Follow the steps to access the resource blade.
   1. You can remove a single or multiple resources from the blade by selecting the checkbox on the left side of the table. Once you have selected the resource(s) to remove, you can then select the __Delete__ icon at the top of the blade.
   1. You can also remove a single resource by selecting the link to the resource from the __Name__ field in the table. From the resource's detail page, select the __Delete__ icon at the top of the blade.
* __Move the resource to a new resource group.__
   1. Follow the steps to access the resource blade.
   1. Select the link to the resource from the __Name__ field in the table.
   1. From the resource's overview page, select the __Move__ link on the Resource group field.
   1. From the __Move resources__ page, use the drop-down field for __Resource group__ to select an existing resource group.
   1. To create and use a new resource group, select the __Create new__ link below the Resource group field. Enter a new resource group name in the __Name__ field. Select the __OK__ button to save your new resource group and use it. Select the __Cancel__ button to return without creating a new resource group.
* __Move the resource to a new subscription.__

> [!NOTE]
> You must have access to another Microsoft Azure subscription, and that subscription must have been setup for access to OracleDB@Azure. If both of these conditions are not met, you will not be able to successfully move the resource to another subscription.

   1. Follow the steps to access the resource blade.
   1. Select the link to the resource from the Name field in the table.
   1. From the resource's overview page, select the __Move__ link on the Subscription field.
   1. From the __Move resources__ page, use the drop-down field for __Subscription__ to select an existing subscription.
   1. You can also simultaneously move the resource group for the resource. To do this, note the steps in the __Move the resource to a new resource group__ tasks. __Add, manage, or delete tags for the resource.__
   1. Follow the steps to access the resource blade.
   1. Select the link to the resource from the Name field in the table.
   1. From the resource's overview page, select the __Edit__ link on the __Tags__ field.
   1. To create a new tag, enter values in the __Name__ and __Value__ fields.
   1. To edit an existing tag, change the value in the existing tag's __Value__ field.
   1. To delete an existing tag, select the __Trashcan__ icon at the right-side of the tag.
     * __Manage Resource Allocation for Oracle Autonomous Database Serverless Instances.__

> [!NOTE]
> You can only change the resource allocation settings for Oracle Autonomous Database Serverless instances using these steps. This does not apply to any other resource type.

   1. Follow the steps to access the Oracle Autonomous Database@Azure blade.
   1. Select the link to the resource from the __Name__ field in the table.
   1. From the resource's overview page, select the __Setting__ link left-menu, and then the __Resource allocation__ link.
   1. Select the __Manage__ button at the top of the Resource allocation page.
   1. From the __Manage resource allocation__ window, you can set the __ECPU count__ from 2 to 512. The __Compute auto scaling__ checkbox allows you to enable your Oracle Autonomous Database to scale its computing allocation automatically up to 512. The __Storage__ is a slider UI that allows setting the Storage allocation from 1 TB to 384 TB. The __Storage auto scaling__ checkbox allows you to enable your Oracle Autonomous Database to scale its storage allocation automatically up to 384 TB.
   1. After you have set or reviewed the fields, select the __Apply__ or __Cancel__ button as appropriate.
     * __Use the OCI console for complete management of the resource.__
   1. Follow the steps to access the resource blade.
   1. Select the link to the resource from the __Name__ field in the table.
   1. From the resource's detail page, select the __Go to OCI__ link on the __OCI Database URL__ field.
   1. Login to OCI.
   1. Manage the resource from within the OCI console.