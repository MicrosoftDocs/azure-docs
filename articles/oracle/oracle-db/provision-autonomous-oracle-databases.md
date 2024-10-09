---
title: Provision Oracle Autonomous Databases
description: Provision Oracle Autonomous Databases.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 06/3/2024
ms.custom: engagement-fy24
ms.author: jacobjaygbay
---

# Provision Oracle Autonomous Databases

This article discusses how to provision and conduct basic management functions for an Oracle Autonomous Database Serverless instance from the Oracle Autonomous Database@Azure blade. More management functions are available within the Oracle Cloud Infrastructure (OCI) portal available via the link to that Oracle Autonomous Database from the Oracle Autonomous Database@Azure blade.

1. Provision an Oracle Autonomous Database instance from the Microsoft Azure portal. Select the Oracle Autonomous Database@Azure blade.
1. There are two paths to begin the Oracle Autonomous Database instance provisioning flow.
    1. From the Oracle Autonomous Database@Azure application Home, select the **Create an Oracle Autonomous Database** button.
    2. From the Oracle Autonomous Database blade, select the **+ Create** at the top of the blade. The Oracle Autonomous Database@Azure blade shows all your existing Autonomous Databases along with their current status. Selecting a specific Autonomous Database shows you detailed information of that instance.

1. From the **Basics** tab of the Create Oracle Autonomous Database flow, enter the following information.
    1. The **Subscription** field is a drop-down containing the current subscription, plus any other subscriptions that your account can access.
    1. The **Resource group** field is a drop-down containing the existing resource groups.
    1. To create a new Resource group, select the **Create new** link.
    1. Enter a **Name** for your Oracle Autonomous Database Serverless instance. This name must be unique within your subscription.
    1. Select the **Region**. The current region is automatically selected. If your subscription has access to other regions, those regions appear in the drop-down list.
    1. Select the **Next** button to continue the provisioning flow.
1. From the **Configuration** tab of the Created Oracle Autonomous Database flow, enter the following information.
    1. The **Workload type** is a drop-down list that provides all the options for your Oracle Autonomous Database Serverless instance. Select the appropriate option from the list.
    1. The **Database version** is a drop-down list that allows you to select the options provided by your subscription and the currently supported versions of Oracle Autonomous Database Serverless.
    1. The **ECPU count** is a slider UI that allows setting the ECPU count from 2 to 512.
    1. The **Compute auto scaling** checkbox allows you to option for your Oracle Autonomous Database to scale its computing allocation automatically up to 512. By default, this is selected.
    1. The **Storage** is a slider UI that allows setting the Storage allocation from 1 TB to 383 TB or 20 GB to 393,216 GB.
    1. The **Storage unit size** radio button allows you to select whether your storage is allocated in GB or TB.
    1. The **Storage auto scaling** checkbox allows you to option for your Oracle Autonomous Database to scale its storage allocation automatically up to 383 TB or 393,216 GB. By default, this is unselected.
    1. The **Backup retention period in days** is a slider UI that allows setting the backup retention days to vary from 1 to 60.
    1. The **Username** is a read-only field that is set to **ADMIN**.
    1. Enter a password for your **ADMIN** account. Passwords must be nonempty, between 12 and 60 characters, and contain at least one uppercase letter, one lowercase letter, and one number. The password can't contain the double quote (") character or the username ADMIN.
    1. The **Confirm password** field must match your previously entered password.
    1. The **License type** is a drop-down list of available license types, **License included** and **Bring your own license**. Select the one that is needed for your subscription.
    1. If you select the **Advanced options** checkbox, two (2) other fields appear, **Character set** and **National character set**. These are drop-down lists of the available character set options for your database. If you select the Advanced options checkbox, select the appropriate Character set and National character set for your database.
    1. Select the **Next** button to continue the provisioning flow.

1. From the **Networking** tab of the Create Oracle Autonomous Database flow, enter the following information.
    1. Access type drop-down allows you to select Secure access from everywhere, Managed private virtual network IP only, or Secure access from allowed IPs.
    1. For Secure access from everywhere, the Require mutual TLS (mTLS) authentication is selected and can't be unselected.
    1. For Managed private virtual network IP only, the Require mutual TLS (mTLS) authentication is unselected by default and can be selected if desired. Additionally, the Virtual network and Subnet drop-downs allow you to select from existing resources, and they're required for Managed private virtual network IP only access.
    1. For Secure access from allowed IPs, the Require mutual TLS (mTLS) authentication is unselected by default and can be selected if desired. The Access control rule must be entered in the IP addresses/CIDR blocks field using individual IP addresses, IP address ranges, or CIDR notation.
    1. Select the Next button to continue the provisioning flow.
1. From the Maintenance tab of the Create Oracle Autonomous Database flow, enter the following information.
    1. The Maintenance patch level is a read-only field. Your Oracle Autonomous Database is patched on a regular and as-needed basis. This patching is done in a manner that should be unnoticeable to you. Regular means that the typical patch schedule is applied. For more information, see [View Patch and Maintenance Window Information, Set the Patch Level](https://docs.oracle.com/iaas/autonomous-database-serverless/doc/maintenance-windows-patching.html).
    1. You can enter up to 10 contact email addresses for notification of unplanned maintenance events.
    1. Select the Next button to continue the provisioning flow.
1. From the **Consent tab** of the Create Oracle Autonomous Database flow, review the Oracle terms of use and the Oracle privacy policy. When reviewed, select the I agree to the terms of service checkbox to continue. Select the Next button to continue the provisioning flow.
1. From the Tags tab of the Create Oracle Autonomous Database flow, set one or more tags to enable easier management and tracking of multiple Oracle Autonomous Databases. For more information, see [Use tags to organize your Azure resources and management hierarchy](/azure/azure-resource-manager/management/tag-resources?wt.mc_id=azuremachinelearning_inproduct_portal_utilities-tags-tab).
1. From the Review + Create tab of the Create Oracle Autonomous Database flow, check the field values you have entered. Validation occurs as you enter this page, and all validations must pass for the provisioning to be started. Even if the validation passes, it's possible you entered some of the values incorrectly.
1. Once your validations complete successfully and you have reviewed the values, select the **Create** button to start the provisioning process.
1. The provisioning process starts. You return to the Oracle Autonomous Database@Azure blade. You can see the status of your provisioning processes. Assuming your process succeeds, select that successful entry in the list.
1. This is the basic information for your Oracle Autonomous Database Serverless instance. You can perform functions shared with Microsoft Azure. For most administrative functions for the database, select the Go to OCI link under the OCI Database URL field.
1. For the complete documentation on using an Oracle Autonomous Database, see [Using Oracle Autonomous Database Serverless](https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/autonomous-intro-adb.html#GUID-8EAA5AE6-397D-4E9A-9BD0-3E37A0345E24).