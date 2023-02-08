---
title: Major Version Upgrade  - Azure Database for PostgreSQL - Flexible Server Preview
description: Learn about the concepts of in-place major version upgrade with Azure Database for PostgreSQL - Flexible Server
author: kabharati
ms.author: kabharati
ms.reviewer: maghan
ms.date: 02/08/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Major Version Upgrade with PostgreSQL Flexible Server Preview

[!INCLUDE [applies-to-postgresql-Flexible-server](../includes/applies-to-postgresql-Flexible-server.md)]


## Overview
Azure Database for PostgreSQL Flexible server supports PostgreSQL versions 11, 12,13, and 14. Postgres community releases a new major version containing new features about once a year. Additionally, major version receives periodic bug fixes in the form of minor releases. Minor version upgrades include changes that are backward-compatible with existing applications. Azure Database for PostgreSQL Flexible service periodically updates the minor versions during customer’s maintenance window. Major version upgrades are more complicated than minor version upgrades as they can include internal changes and new features which may not be backward-compatible with existing applications. 

Flexible Server Postgres has now introduced in-place major version upgrade feature that performs an in-place upgrade of the server with just a click.This simplifies the process of upgrading the server to a higher version with a short downtime minimizing the disruption to users and applications accessing the server. In-place upgrades are a simpler way to upgrade the major version of the instance, as they retain the server name and other settings of the current server after the upgrade, and don't require data migration or changes to the application connection strings. In-place upgrades are faster and involve shorter downtime than data migration. 


## Process

Here are some of the important considerations with in-place major version upgrade. 

1. During in-place major version upgrade process,  Flexible Server runs a pre-check procedure to identify any potential issues that might cause the upgrade to fail. If the pre-check finds any incompatibilities, it creates a log event showing that the upgrade pre-check failed, along with an error message. 

2. If the pre-check is successful, then Flexible Server automatically takes an implicit backup just before starting the upgrade. This backup can be used to restore the database instance to its previous version if there is an upgrade error. 

3. Flexible Server uses  **pg_upgrade** utility to perform in-place major version upgrades and provides the flexibility to skip versions and upgrade directly to higher versions. 

4. During an in-place major version upgrade of a High Availability (HA) enabled server, the service disables HA, performs the upgrade on the primary server, and then re-enables HA after the upgrade is complete. 

5. Most extensions are automatically upgraded to higher versions during an in-place major version upgrade, with some exceptions. Please refer limitations section for additional details. 

6. In-place major version upgrade process for Flexible server automatically deploys the latest supported minor version. 

7. In place major version upgrade process is an offline operation and it involves a short downtime.  

8. Long-running transactions or high workload before the upgrade might increase the time taken to shut down the database and increase upgrade time. 

9. If the in-place major version upgrade fail for any reason then the service always restores the server to previous state using backup taken as part of step 2.

10. Once the in-place major version upgrade is successful, there are no automated ways to revert to the earlier version. However, you can perform a Point-In-Time Recovery (PITR) to a time prior to the upgrade to restore the previous 
version of the database instance. 

## How to Perform in-place major version upgrade: 

It is recommended to perform a dry run of the in-place major version upgrade in a test environment before upgrading the production server. This allows you to identify any application incompatibilities and validate that the upgrade will complete successfully before upgrading the production environment. You can achieve this by performing a Point-In-Time Recovery (PITR) of your production server and testing the upgrade in the test environment. Addressing these issues before the production upgrade minimizes downtime and ensures a smooth upgrade process. 

**Steps**

1. You can perform in-place major version upgrade using Azure portal or CLI (command-line interface).  Click the **Upgrade** button in Overview blade.




  :::image type="content" source="media/concepts-major-version-upgrade/upgrade-tab.png" alt-text="Diagram of Upgrade tab to perform in-place major version upgrade.":::




2. You'll see an option to select the major version of your choice, you also have an option to skip versions to directly upgrade to higher versions. Choose the version and click **Upgrade**. 




:::image type="content" source="media/concepts-major-version-upgrade/set-postgresql-version.png" alt-text="Diagram of PostgreSQL version to Upgrade.":::




3. During upgrade, users have to wait for the process to complete. You can resume accessing the server once the server is back online. 




:::image type="content" source="media/concepts-major-version-upgrade/deployment-progress.png" alt-text="Diagram of deployment progress for major version upgrade.":::






4. Once the upgrade is successful you'll see the message below, and you can expand the **Deployment details** tab and click **Operation details** to get more information about upgrade process like duration, provisioning state etc. 






:::image type="content" source="media/concepts-major-version-upgrade/deployment-success.png" alt-text="Diagram of successful deployment of for major version upgrade.":::





5. You can click on the **Go to resource** tab to validate your upgrade. You'll notice that server name remains unchanged and PostgreSQL version upgraded to desired higher version with the latest minor version. 





:::image type="content" source="media/concepts-major-version-upgrade/upgrade- verification.png" alt-text="Diagram of Upgraded version to Flexible server after major version upgrade.":::





## Next steps

- To learn how to create and populate Azure AD, and then configure Azure AD with Azure Database for PostgreSQL, see [Configure and sign in with Azure AD for Azure Database for PostgreSQL](how-to-configure-sign-in-azure-ad-authentication.md).
- To learn how to manage Azure AD users for Flexible Server, see [Manage Azure Active Directory users - Azure Database for PostgreSQL - Flexible Server](how-to-manage-azure-ad-users.md).

<!--Image references-->

[1]: ./media/concepts-azure-ad-authentication/authentication-flow.png
[2]: ./media/concepts-azure-ad-authentication/admin-structure.png
