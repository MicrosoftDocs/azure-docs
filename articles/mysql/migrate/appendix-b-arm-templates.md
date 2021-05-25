---
title: "Appendix B: ARM Templates"
description: "This template will deploy all resources with private endpoints."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: markingmyname
ms.author: maghan
ms.reviewer: ""
ms.custom:
ms.date: 05/05/2021
---

# Appendix B: ARM Templates

### Secure

This template will deploy all resources with private endpoints. This effectively removes any access to the PaaS services from the internet.

[ARM Template ](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide/arm-templates/ExampleWithMigration)

### Non-Secure

This template will deploy resources using standard deployment where all resources are available from the internet.

[ARM Template ](https://github.com/Azure/azure-mysql/tree/master/MigrationGuide/arm-templates/ExampleWithMigrationSecure)  


> [!div class="nextstepaction"]
> [Appendix C: Default server parameters](./appendix-c-default-server-parameters-mysql-55-and-azure-database-for-mysql.md)