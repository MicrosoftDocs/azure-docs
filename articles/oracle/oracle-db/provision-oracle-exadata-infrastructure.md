---
title: Provision Exadata infrastructure for Oracle Database@Azure
description: Provision Exadata infrastructure for Oracle Database@Azure
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 6/07/2024
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---

# Provision Exadata infrastructure

Provisioning Oracle Exadata Infrastructure is a time-consuming process. Provisioning an Oracle Exadata Infrastructure is a prerequisite for provisioning Oracle Exadata VM Clusters and any Oracle Exadata Databases.

  > [!NOTE]
  > To ensure you have all the information needed for a successful provisioning flow, review the [Troubleshoot provisioning issues](provision-troubleshoot-oracle-database.md) document specifically the IP Address Requirement Differences.

1. Provision your Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources from the OracleDB@Azure blade. By default, the Oracle Exadata Infrastructure tab is selected. To create an Oracle Exadata VM Cluster resource, select that tab first.
1. Select the **+ Create** icon at the top of the blade to begin the provisioning flow.
1. Check that you're the **Create** Oracle Exadata Infrastructure flow. If not, exit the flow.
1. From the **Basics** tab of the Create Oracle Exadata Infrastructure flow, enter the following information.
   1. Select the Microsoft Azure subscription to which the Oracle Exadata Infrastructure will be provisioned and billed.
   1. Select an existing **Resource group** or select the **Create new** link to create and use a new Resource group for this resource. A resource group is a collection of resources sharing the same lifecycle, permissions, and policies.
   1. Enter a unique **Name** for the Oracle Exadata Infrastructure on this subscription.
   1. Select the **Region** where this Oracle Exadata Infrastructure is provisioned. 
       >[!NOTE] 
       > The regions where the OracleDB@Azure service is available are limited.
   1. Select the **Availability zone** where this Oracle Exadata Infrastructure is provisioned.
       > [!NOTE]
       > The availability zones where the OracleDB@Azure service is available are limited.
   1. The **Oracle Cloud account name** field is display-only. If the name isn't showing correctly, your OracleDB@Azure account setup hasn't been successfully completed.
   1. Select **Next** to continue.
1. From the **Configuration** tab of the Create Oracle Exadata Infrastructure flow, enter the following information.
   1. From the dropdown list, select the **Exadata infrastructure model** you want to use for this deployment. **NOTE:** Not all Oracle Exadata Infrastructure models are available. For more information, see [Oracle Exadata Infrastructure Models](https://docs.oracle.com/iaas/exadatacloud/exacs/ecs-ovr-x8m-scable-infra.html#GUID-15EB1E00-3898-4718-AD94-81BDE271C843).
   1. The **Database servers** selector can be used to select a range from 2 to 32.
   1. The **Storage servers** selector can be used to select a range from 3 to 64.
   1. The **OCPUs** and **Storage** fields are automatically updated based on the settings of the Database servers and Storage servers selectors.
   1. Select **Next** to continue.
1. From the **Maintenance** tab of the Create Oracle Exadata Infrastructure flow, enter the following information.
   1. The **Maintenance method** is selectable to either Rolling or Nonrolling based on your patching preferences.
   1. By default, the **Maintenance schedule** is set to **No preference**.
   1. If you select **Specify a schedule for the Maintenance schedule**, other options open for you to tailor a maintenance schedule that meets your requirements. Each of these selections requires at least one option in each field.
   1. You can then enter up to 10 **Names** and **Email addresses** that are used as contacts for the maintenance process.
   1. Select **Next** to continue.
1. From the **Consent** tab of the Create Oracle Exadata Infrastructure flow, you must agree to the terms of service, privacy policy, and agree to access permissions. Once accepted, select **Next** to continue.
1. From the **Tags** tab of the Create Oracle Exadata Infrastructure flow, you define Microsoft Azure tags.

    >[!NOTE]
    > These tags aren't propagated to the Oracle Cloud Infrastructure (OCI) portal.

1. After you create the tags, if any, for your environment, select **Next** to continue.
1. From the **Review _+** create tab of the Create Oracle Exadata Infrastructure flow, a short validation process is run to check the values that you entered from the previous steps. If the validation fails, you must correct any errors before you can start the provisioning process.
1. Select the **Create** button to start the provisioning flow.
1. Return to the Oracle Exadata Infrastructure blade to monitor and manage the state of your Oracle Exadata Infrastructure environments.