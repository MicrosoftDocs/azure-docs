---
title: "MySQL on-premises to Azure Database for MySQL migration guide Appendix B: ARM Templates"
description: "This template will deploy all resources with private endpoints."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: arunkumarthiags
ms.author: arthiaga
ms.reviewer: maghan
ms.custom:
ms.date: 05/26/2021
---

# MySQL on-premises to Azure Database for MySQL migration guide Appendix B: ARM Templates

### Secure

This template will deploy all resources with private endpoints. This effectively removes any access to the PaaS services from the internet.

[ARM Template ](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide/arm-templates/ExampleWithMigration)

### Non-Secure

This template will deploy resources using standard deployment where all resources are available from the internet.

[ARM Template ](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide/arm-templates/ExampleWithMigrationSecure)