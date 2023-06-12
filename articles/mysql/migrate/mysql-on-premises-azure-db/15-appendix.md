---
title: "MySQL on-premises to Azure Database for MySQL sample applications"
description: "Download extra documentation we created for this Migration Guide and learn how to configure."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: rothja
ms.author: jroth
ms.reviewer: maghan
ms.custom: devx-track-arm-template
ms.date: 06/21/2021
---

# Migrate MySQL on-premises to Azure Database for MySQL sample applications

[!INCLUDE[applies-to-mysql-single-flexible-server](../../includes/applies-to-mysql-single-flexible-server.md)]

## Overview

This article explains how to deploy a sample application with an end-to-end MySQL migration guide and to review available server parameters.

## Environment setup

[Download more documentation](https://github.com/Azure/azure-mysql/blob/master/MigrationGuide/MySQL%20Migration%20Guide_v1.1%20Appendix%20A.pdf) we created for this Migration Guide and learn how to configure an environment to perform the guide’s migration steps for the sample [conference demo application.](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide/sample-app).

## Azure Resource Manager (ARM) templates

### Secure

The ARM template deploys all resources with private endpoints. The ARM template effectively removes any access to the PaaS services from the internet.

[Secure ARM template](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide/arm-templates/ExampleWithMigration)

### Non-secure

The ARM template deploys resources using standard deployment where all resources are available from the internet.

[Non-secure ARM template](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide/arm-templates/ExampleWithMigrationSecure)

## Default server parameters MySQL 5.5 and Azure Database for MySQL

You can find the [full listing of default server parameters of MySQL 5.5 and Azure Database for MySQL](https://github.com/Azure/azure-mysql/blob/master/MigrationGuide/MySQL%20Migration%20Guide_v1.1%20Appendix%20C.pdf) in our GitHub repository.
