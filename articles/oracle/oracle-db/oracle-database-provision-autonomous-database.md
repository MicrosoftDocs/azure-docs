---
title: Provision Oracle Autonomous Database
description: Learn how to provision an instance of Oracle Autonomous Database in Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Provision an instance of Oracle Autonomous Database

You provision and manage basic functions for an Oracle Autonomous Database instance on the Oracle Autonomous Database@Azure pane in the Azure portal. More management functions are available in the Oracle Cloud Infrastructure (OCI) console via the link to that database on the Oracle Autonomous Database@Azure pane.

## Prerequisites

The following prerequisites must be completed before you can provision Oracle Exadata services:

- An existing Azure subscription.
- An Azure virtual network with a subnet delegated to the Oracle Database@Azure service (`Oracle.Database/networkAttachments`).
- Permissions in Azure to create resources in the region, with the following conditions:
  - No policies that prohibit the creation of resources without tags, because the OracleSubscription resource is created automatically without tags during onboarding.
  - No policies that enforce naming conventions, because the OracleSubscription resource is created automatically with a default resource name.
- Oracle Database@Azure purchased in the Azure portal.
- An OCI account.

For more information, including optional steps, see [Onboard Oracle Database@Azure](https://docs.oracle.com/iaas/Content/database-at-azure/oaaonboard.htm).

## Provision Oracle Autonomous Database in Azure

To provision an Oracle Autonomous Database instance:

1. Go to the Azure portal.
1. Choose an option to begin provisioning your instance of Oracle Autonomous Database:

   1. On the Oracle Autonomous Database@Azure application home pane, select **Create an Oracle Autonomous Database**.
   1. On the **Oracle Autonomous Database@Azure** pane, select **Create**. The **Oracle Autonomous Database@Azure** pane shows all your existing instances of Oracle Autonomous Database@Azure and current status. To see detailed information about an instance of Oracle Autonomous Database@Azure, select the instance in the list.

1. On the **Basics** tab, enter or select the following information:

   1. For **Subscription**, select the relevant subscription.
   1. For **Resource group**, select an existing resource group, or select the **Create new** link to create a new resource group.
   1. For **Name**, enter a name for your Oracle Autonomous Database Serverless instance. The name must be unique within your subscription.
   1. For **Region**, select the Azure region to use. The current region is automatically selected. If your subscription has access to other regions, the regions appear in the list.
   1. Select **Next**.

1. On the **Configuration** tab, enter or select the following information:

   1. For **Workload type**, select the appropropriate option for your Oracle Autonomous Database Serverless instance.
   1. For **Database version**, select the options that are provided based on your subscription and the currently supported versions of Oracle Autonomous Database Serverless.
   1. For **ECPU count**, select an Elastic Compute Processing Unit (ECPU) count from 2 to 512.
   1. Select or clear the **Compute auto scaling** checkbox for the option to scale your Oracle Autonomous Database computing allocation automatically up to 512. By default, the checkbox is selected.
   1. For **Storage**, set the storage allocation from 1 TB to 383 TB or from 20 GB to 393,216 GB.
   1. For **Storage unit size**, select the option to allocate your storage in GB or TB.
   1. You select or clear the **Storage auto scaling** checkbox for the option to scale your Oracle Autonomous Database storage allocation automatically up to 383 TB or 393,216 GB. By default, the checkbox is cleared.
   1. For **Backup retention period in days**, set the backup retention days from 1 day to 60 days.
   1. The **Username** is a read-only field that is set to **ADMIN**.
   1. Enter a required password for your **ADMIN** account. The password must be from 12 to 60 characters, and it must contain at least one uppercase letter, one lowercase letter, and one number. The password can't contain the double quote (`"`) character or `ADMIN`.
   1. For **Confirmed password**, enter a password that matches your previously entered password.
   1. For **License type**, select a license type that is required for your subscription.
   1. If you select the **Advanced options** checkbox, select the appropriate settings for **Character set** and **National character set** for your database.
   1. Select **Next**.

1. On the **Networking** tab, enter or select the following information:

   1. Currently, **Access type** is set only to **Managed private virtual network IP only**.
   1. For **Managed private virtual network IP only**, you can optionally select the **Require mutual TLS (mTLS) authentication** the checkbox.
   1. For **Virtual network** and **Subnet**, select existing resources.

       > [!NOTE]
       > The selected virtual network must have one subnet delegated to the Oracle.Database/networkAttachments service.

   1. Select **Next**.

1. On the **Maintenance** tab, enter or select the following information:

   1. The **Maintenance patch level** is a read-only field. Your Oracle Autonomous Database is patched on a regular and as-needed basis. This patching is done in a manner that should be unnoticeable to you. **Regular** means that the typical patch schedule is applied. For more information, see [View patch and maintenance window information](https://docs.oracle.com/iaas/autonomous-database-serverless/doc/maintenance-windows-patching.html).
   1. Enter up to 10 contact email addresses for notification of unplanned maintenance events.
   1. Select **Next**.

1. On the **Consent** tab, review the Oracle terms of use and the Oracle privacy policy. Select the **I agree to the terms of service** checkbox, and then select **Next**.

1. On the **Tags** tab, optionally set one or more tags to for easier management and tracking of multiple instances of Autonomous Database. For more information, see [Use tags to organize your Azure resources and management hierarchy](https://go.microsoft.com/fwlink/?linkid=873112). Then select **Next**.

1. On the **Review + Create** tab, check the field values you entered. Validation automatically occurs on this pane. All validations must pass for the provisioning to start. Even if the validation passes, verify the settings.

1. After your validation is successful and you review your settings, select **Create** to start the provisioning process.

1. On the **Oracle Autonomous Database@Azure** pane, you can view the status of your provisioning process. When the provisioning process succeeds, select the entry in the list.

1. The basic information for your Oracle Autonomous Database Serverless instance is shown. You can complete functions that are shared with Azure. For most administrative functions for the database, under **OCI Database URL**, select the **Go to OCI** link.

For the complete Oracle documentation, see [Using Oracle Autonomous Database Serverless](https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/autonomous-intro-adb.html#GUID-8EAA5AE6-397D-4E9A-9BD0-3E37A0345E24).
