---
title: "Migrate MySQL on-premises to Azure Database for MySQL: Summary"
description: "This document has covered several topics related to migrating an application from on-premises MySQL to Azure Database for MySQL."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: rothja
ms.author: jroth
ms.reviewer: maghan
ms.custom:
ms.date: 06/21/2021
---

# Migrate MySQL on-premises to Azure Database for MySQL: Summary

[!INCLUDE[applies-to-mysql-single-flexible-server](../../includes/applies-to-mysql-single-flexible-server.md)]

## Prerequisites

[Security](13-security.md)

## Overview

This document has covered several topics related to migrating an application from on-premises MySQL to Azure Database for MySQL. We covered how to begin and assess the project all the way to application cut over.

The migration team needs to review the topics carefully as the choices made can have project timeline effects. The total cost of ownership is enticing given the many enterprise ready features provided.

The migration project approach is important. The team needs to assess the application and database complexity to determine the amount of conversion time. Conversion tools help make the transition easier, but there have always been an element of manual review and updates required. Scripting out pre-migration tasks and post migration testing is important.

Application architecture and design can provide strong indicators as to the level of effort required. For example, applications utilizing ORM frameworks can be great candidates, especially if the business logic is contained in the application instead of database objects.

In the end, several tools exist in the marketplace ranging from free to commercial. This document covered the steps required if the team plans a database migration using one of the more popular open-source tool options. Whichever path that is chosen, Microsoft and the MySQL community have the tools and expertise to make the database migration successful.

## Questions and Feedback

For any questions or suggestions about working with Azure Database for MySQL, send an email to the Azure Database for MySQL Team (AskAzureDBforMySQL@service.microsoft.com). 

> [!Important]
> The Azure Database for MySQL Team address is for general questions only and not for support tickets.

In addition, consider these points of contact as appropriate:

  - To contact Azure Support or fix an issue with your account, [file a ticket from the Azure portal. ](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview)

  - To provide feedback or to request new features, create an entry via [UserVoice.](https://feedback.azure.com/d365community/forum/47b1e71d-ee24-ec11-b6e6-000d3a4f0da0)
fwill
## Find a partner to help migrate

This guide can be overwhelming, but don’t fret\! There are many experts in the community with a proven migration track record. [Search for a Microsoft Partner](https://www.microsoft.com/solution-providers/home) or [Microsoft MVP](https://mvp.microsoft.com/MvpSearch) to help with finding the most appropriate migration strategy. You aren't alone\!

You can also browse the technical forums and social groups for more detailed real-world information:

  - [Microsoft Community Forum ](/answers/topics/azure-database-mysql.html)

  - [Azure Database for MySQL Tech Community ](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/bg-p/ADforMySQL)

  - [StackOverflow for Azure MySQL ](https://stackoverflow.com/questions/tagged/azure-database-mysql)

  - [Azure Facebook Group ](https://www.facebook.com/groups/MsftAzure)

  - [LinkedIn Azure Group ](https://www.linkedin.com/groups/2733961/)

  - [LinkedIn Azure Developers Group ](https://www.linkedin.com/groups/1731317/)

## Next steps

To deploy a sample application with an end-to-end MySQL migration guide and to review available server parameters, visit the [appendix](15-appendix.md).
