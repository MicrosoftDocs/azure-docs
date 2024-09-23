---
title: Provision an autonomous database
description: Learn about how to provision an autonomous database.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---
# Provision an autonomous database

Provisioning and basic management functions for an Oracle Autonomous Database Serverless instance is done from the Oracle Autonomous Database@Azure blade. Additional management functions are available within the Oracle Cloud Infrastructure (OCI) portal available via the link to that Oracle Autonomous Database from the Oracle Autonomous Database@Azure blade.

>[!NOTE] 
> There are prerequisites that must be completed before you can provision Exadata Services. You need to complete the following:

1. An existing Azure subscription
1. An Azure VNet with a subnet delegated to the Oracle Database@Azure service (`Oracle.Database/networkAttachments`)
1. Permissions in Azure to create resources in the region, with the following conditions:
   * No policies prohibiting the creation of resources without tags, because the OracleSubscription resource is created automatically without tags during onboarding.
   * No policies enforcing naming conventions, because the OracleSubscription resource is created automatically with a default resource name.
1. Purchase OracleDB@Azure in the Azure portal.
1. Select your Oracle Cloud Infrastructure (OCI) account.
For more detailed documentation, including optional steps, see [Onboarding with Oracle Database@Azure](https://docs.oracle.com/iaas/Content/database-at-azure/oaaonboard.htm).

1. You provision an Oracle Autonomous Database instance from the Microsoft Azure portal. Select the Oracle Autonomous Database@Azure blade.
1. There are two paths to begin the Oracle Autonomous Database instance provisioning flow.
   1. From the Oracle Autonomous Database@Azure application Home, select the __Create an Oracle Autonomous Database__ button.
   1. From the Oracle Autonomous Database blade, select __+ Create__ at the top of the blade. The Oracle Autonomous Database@Azure blade shows all your existing Autonomous Databases along with their current status. Selecting a specific Autonomous Database shows you that instance's detailed information.
1. From the __Basics__ tab of the Create Oracle Autonomous Database flow, enter the following information.
   1. The __Subscription__ field is a drop-downs containing the current subscription, plus any other subscriptions that your account can access.
   1. The __Resource group__ field is a drop-down containing the existing resource groups.
   1. To create a new __Resource group__, select the __Create new__ link.
   1. Enter a __Name__ for your Oracle Autonomous Database Serverless instance. This name must be unique within your subscription.
   1. Select the __Region__. The current region is automatically selected. If your subscription has access to other regions, those will be available in the drop-down list.
   1. Select __Next__ to continue.
1. From the __Configuration__ tab of the Create Oracle Autonomous Database flow, enter the following information.
   1. The __Workload type__ is a drop-down list that provides all the options for your Oracle Autonomous Database Serverless instance. Select the appropriate option from the list.
   1. The __Database version__ is a drop-down list that allows you to select the options provided by your subscription and the currently supported versions of Oracle Autonomous Database Serverless.
   1. The __ECPU count__ is a slider UI that allows setting the ECPU count from 2 to 512.
   1. The __Compute auto scaling__ checkbox allows you to option for your Oracle Autonomous Database to scale its computing allocation automatically up to 512. By default, this is selected.
   1. __Storage__ is a slider UI that allows setting the Storage allocation from 1 TB to 383 TB or 20 GB to 393216 GB.
   1. The __Storage unit size__ radio button allows you to select whether your storage is allocated in GB or TB.
   1. The __Storage auto scaling__ checkbox allows you to option for your Oracle Autonomous Database to scale its storage allocation automatically up to 383 TB or 393216 GB. By default, this is unselected.
   1. The __Backup retention period in days__ is a slider UI that allows setting the backup retention days to vary from 1 to 60.
   1. The __Username__ is a read-only field that is set to __ADMIN__.
   1. Enter a password for your __ADMIN__ account. Passwords must be non-empty, between 12 and 60 characters, and contain at least one uppercase letter, one lowercase letter, and one number. The password cannot contain the double quote (") character or the username ADMIN.
   1. The __Confirm password__ field must match your previously entered password.
   1. The __License type__ is a drop-down list of available license types, __License included__ and __Bring your own license__. Select the one that is needed for your subscription.
   1. If you select the __Advanced options__ checkbox, two (2) additional fields will appear, __Character set__ and __National character set__. These are drop-down lists of the available character set options for your database. If you select the __Advanced options__ checkbox, select the appropriate __Character set__ and __National character set__ for your database.
   1. Select __Next__ to continue.
1. From the __Networking__ tab of the Create Oracle Autonomous Database flow, enter the following information.
   1. Currently, the __Access type__ drop-down only allows you to select __Managed private virtual network IP only__.
   1. For __Managed private virtual network IP only__, the __Require mutual TLS (mTLS) authentication__ is unselected by default and can be selected if desired. Additionally, the __Virtual network__ and __Subnet__ drop-downs are required and require you to select from existing resources. __NOTE:__ The selected virtual network must have one subnet delegated to the __Oracle.Database/networkAttachments__ service. For additional information, see Delegate a subnet to an Azure service.
   1. Select __Next__ to continue.
1. From the __Maintenance__ tab of the Create Oracle Autonomous Database flow, enter the following information.
   1. The __Maintenance patch level__ is a read-only field. Your Oracle Autonomous Database will be patched on a regular and as-needed basis. This patching is done in a manner that should be unnoticeable to you. __Regular__ means that the typical patch schedule is applied. For more information, see [View Patch and Maintenance Window Information, Set the Patch Level](https://docs.oracle.com/iaas/autonomous-database-serverless/doc/maintenance-windows-patching.html).
   1. You can enter up to 10 contact email addresses for notification of unplanned maintenance events.
   1. Select __Next__ to continue.
1. From the __Consent__ tab of the Create Oracle Autonomous Database flow, review the Oracle terms of use and the Oracle privacy policy. When reviewed, select the __I agree to the terms of service__ checkbox to continue. Select __Next__ to continue.
1. From the __Tags__ tab of the Create Oracle Autonomous Database flow, set one or more tags to enable easier management and tracking of multiple Oracle Autonomous Databases. For more information, see [Use tags to organize your Azure resources and management hierarchy](https://go.microsoft.com/fwlink/?linkid=873112). Select __Next__ to continue.
1. From the __Review + Create__ tab of the Create Oracle Autonomous Database flow, check the field values you have entered. Validation occurs as you enter this page, and all validations must pass for the provisioning to be started. Even if the validation passes, you may have incorrectly entered a value or values.
1. Once your validations complete successfully and you have reviewed the values, select the __Create__ button to start the provisioning process.
1. The provisioning process starts. You return to the Oracle Autonomous Database@Azure blade. You can see the status of your provisioning processes. Assuming your process succeeds, select that entry in the list.
1. This is the basic information for your Oracle Autonomous Database Serverless instance. You can perform functions shared with Microsoft Azure. For most administrative functions for the database, select the __Go to OCI__ link under the __OCI Database URL__ field.
1. For the complete documentation on using an Oracle Autonomous Database, see [Using Oracle Autonomous Database Serverless](https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/autonomous-intro-adb.html#GUID-8EAA5AE6-397D-4E9A-9BD0-3E37A0345E24).