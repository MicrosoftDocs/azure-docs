---
title: Provision Exadata Infrastructure for Oracle Database@Azure
description: Provision Exadata Infrastructure for Oracle Database@Azure
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 6/07/2024
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---

# Provision Exadata Infrastructure

Provisioning Oracle Exadata Infrastructure is a time-consuming process. Provisioning an Oracle Exadata Infrastructure is a prerequisite for provisioning Oracle Exadata VM Clusters and any Oracle Exadata Databases.

[!NOTE]
Review the [Provisioning Troubleshooting](https://docs.oracle.com/en-us/iaas/odaaz/odaaz-provisioningtroubleshooting.html#GUID-DACCA740-025E-4466-8BB7-AC8C1D23E450), specifically the IP Address Requirement Differences, to ensure you have all the information needed for a successful provisioning flow.

1. Provision your Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources from the OracleDB@Azure blade. By default, the Oracle Exadata Infrastructure tab is selected. To create a Oracle Exadata VM Cluster resource, select that tab first.
1. Select the __+ Create__ icon at the top of the blade to begin the provisioning flow.
1. Check that you are the __Create__ Oracle Exadata Infrastructure flow. If not, exit the flow.
1. From the __Basics__ tab of the Create Oracle Exadata Infrastructure flow, enter the following information.
   1. Select the Microsoft Azure subscription to which the Oracle Exadata Infrastructure will be provisioned and billed.
   1. Select an existing __Resource group__ or select the __Create new__ link to create and use a new Resource group for this resource. A resouce group is a collection of resources sharing the same lifecycle, permissions, and policies.
   1. Enter a unique __Name__ for the Oracle Exadata Infrastructure on this subscription.
   1. Select the __Region__ where this Oracle Exadata Infrastructure will be provisioned. __NOTE:__ The regions where the OracleDB@Azure service is available are limited.
   1. Select the __Availability zone__ where this Oracle Exadata Infrastructure will be provisioned. __NOTE:__ The availability zones where the OracleDB@Azure service is available are limited.
   1. The __Oracle Cloud account name__ field is display-only. If the name is not showing correctly, your OracleDB@Azure account setup has not been successfully completed.
   1. Select __Next__ to continue.
1. From the __Configuration__ tab of the Create Oracle Exadata Infrastructure flow, enter the following information.
   1. From the dropdown list, select the __Exadata infrastructure model__ you want to use for this deployment. __NOTE:__ Not all Oracle Exadata Infrastructure models are available. For more information, see [Oracle Exadata Infrastructure Models](https://docs.oracle.com/iaas/exadatacloud/exacs/ecs-ovr-x8m-scable-infra.html#GUID-15EB1E00-3898-4718-AD94-81BDE271C843).
   1. The __Database servers__ selector can be used to select a range from 2 to 32.
   1. The __Storage servers__ selector can be used to select a range from 3 to 64.
   1. The __OCPUs__ and __Storage__ fields are automatically updated based on the settings of the Database servers and Storage servers selectors.
   1. Select __Next__ to continue.
1. From the __Maintenance__ tab of the Create Oracle Exadata Infrastructure flow, enter the following information.
   1. The __Maintenance method__ is selectable to either Rolling or Non-rolling based on your patching preferences.
   1. By default, the __Maintenance schedule__ is set to __No preference__.
   1. If you select __Specify a schedule for the Maintenance schedule__, additional options open for you to tailor a maintenance schedule that meets your requirements. Each of these selections requires at least one option in each field.
   1. You can then enter up to 10 __Names__ and __Email addresses__ that are used as contacts for the maintenance process.
   1. Select __Next__ to continue.
1. From the __Consent__ tab of the Create Oracle Exadata Infrastructure flow, you must agree to the terms of service, privacy policy, and agree to access permissions. Once accepted, select __Next__ to continue.
1. From the __Tags__ tab of the Create Oracle Exadata Infrastructure flow, you define Microsoft Azure tags. __NOTE:__ These tags are not propagated to the Oracle Cloud Infrastructure (OCI) portal. Once you have created the tags, if any, for your environment, select __Next__ to continue.
1. From the __Review _+__ create tab of the Create Oracle Exadata Infrastructure flow, a short validation process is run to check the values that you entered from the previous steps. If the validation fails, you must correct any errors before you can start the provisioning process.
1. Select the __Create__ button to start the provisioning flow.
1. Return to the Oracle Exadata Infrastructure blade to monitor and manage the state of your Oracle Exadata Infrastructure environments.