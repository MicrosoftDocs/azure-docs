---
title: "MySQL on-premises to Azure Database for MySQL migration guide appendix"
description: "Download extra documentation we created for this Migration Guide and learn how to configure."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: arunkumarthiags
ms.author: arthiaga
ms.reviewer: maghan
ms.custom:
ms.date: 05/26/2021
---

# MySQL on-premises to Azure Database for MySQL migration guide appendix

This article explains how to deploy a sample application with an end-to-end MySQL migration guide and to review available server parameters.
## Environment setup

[Download more documentation](https://github.com/Azure/azure-mysql/blob/master/MigrationGuide/MySQL%20Migration%20Guide_v1.1%20Appendix%20A.pdf) we created for this Migration Guide and learn how to configure an environment to perform the guide’s migration steps for the sample [conference demo application.](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide/sample-app).

## ARM templates

### Secure

The ARM template deploys all resources with private endpoints. The ARM template effectively removes any access to the PaaS services from the internet.

[ARM template](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide/arm-templates/ExampleWithMigration)

### Non-Secure

The ARM template deploys resources using standard deployment where all resources are available from the internet.

[ARM Template](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide/arm-templates/ExampleWithMigrationSecure)

## Default server parameters MySQL 5.5 and Azure Database for MySQL

You can find the [full listing of default server parameters of MySQL 5.5 and Azure Database for MySQL](https://github.com/Azure/azure-mysql/blob/master/MigrationGuide/MySQL%20Migration%20Guide_v1.1%20Appendix%20C.pdf) in our GitHub repository.