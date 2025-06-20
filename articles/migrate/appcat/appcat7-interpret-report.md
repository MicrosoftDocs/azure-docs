---
title: Azure Migrate Application and Code Assessment for Java Version 7
description: Learn how to use the next generation of Azure Migrate application and code assessment tool to determine readiness to migrate any type of Java application to Azure.
author: KarlErickson
ms.author: karler
ms.reviewer: brborges
ms.service: azure
ms.custom:
  - devx-track-java
  - devx-track-extended-java
  - build-2025
ms.topic: overview
ms.date: 01/15/2025
#customer intent: As a developer, I want to assess my Java application so that I can understand its readiness for migration to Azure.
---

# Interpret the AppCAT report

The assessment report provides a categorized issue list of various aspects of Azure readiness, cloud native, and Java modernization that you need to address to successfully migrate the application to Azure.

Each *Issue* is categorized by severity - **Mandatory**, **Optional**, or **Potential** - and includes the number of impacted lines of code.

The **Dependencies** and **Technologies** tabs display the libraries and technologies used within the application.

:::image type="content" source="media/java/appcat-7-report-assessment.png" alt-text="Screenshot of the AppCAT assessment report." lightbox="media/java/appcat-7-report-assessment.png":::

### Detailed information for a specific issue

For each issue, you can get more information (the issue detail, the content of the rule, and so on) just by selecting it. You also get the list of all the files affected by this issue.

:::image type="content" source="media/java/appcat-7-report-assessment-detail.png" alt-text="Screenshot of the AppCAT issue detail report." lightbox="media/java/appcat-7-report-assessment-detail.png":::

Then, for each file or class affected by the issue, you can jump into the source code to highlight the line of code that created the issue.

:::image type="content" source="media/java/appcat-7-report-assessment-code.png" alt-text="Screenshot of the AppCAT issue code report." lightbox="media/java/appcat-7-report-assessment-code.png":::

## Next steps

> [!div class="nextstepaction"]
> [Understand more on CLI usage](appcat7-cli-guide.md)
