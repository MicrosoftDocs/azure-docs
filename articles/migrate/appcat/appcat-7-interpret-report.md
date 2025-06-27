---
title: Interpret the AppCAT 7 Report
description: Learn how to interpret the AppCAT report.
author: KarlErickson
ms.author: karler
ms.reviewer: brborges
ms.service: azure
ms.custom: devx-track-java, build-2025
ms.topic: overview
ms.date: 06/27/2025
#customer intent: As a developer, I want to assess my Java application so that I can understand its readiness for migration to Azure.
---

# Interpret the AppCAT 7 report

This article guides you through the AppCAT report to help you understand it for assessing the readiness of your Java application for migration to Azure. The report provides a comprehensive overview of the application and its components. You can use this report to gain insights into the structure and dependencies of the application and to determine its suitability for replatforming and modernization.

## Application list view

The landing page of the report presents an overall view of all analyzed applications. From here, you can navigate to individual application reports to explore detailed findings.

:::image type="content" source="media/java/appcat-7-report-applist.png" alt-text="Screenshot of the AppCAT assessment report Applications list." lightbox="media/java/appcat-7-report-applist.png":::

## Application view

The application report consists of the following three sections:

- **Application Information**: reveals the basic information of your application including Java version, framework, build tool, and so on.
- **Issue Summary**: shows the issue overview for three domains with percentages for issue criticality.
- The detail report is organized into the following four subsections:
  - **Issues**: Provides a concise summary of all issues that require attention.
  - **Dependencies**: Displays all Java-packaged dependencies found within the application.
  - **Technologies**: Displays all embedded libraries grouped by functionality, enabling you to quickly view the technologies used in the application.
  - **Insights**: Displays file details and information to help you understand the detected technologies.

:::image type="content" source="media/java/appcat-7-report-app.png" alt-text="Screenshot of the AppCAT assessment report." lightbox="media/java/appcat-7-report-app.png":::

### Issues

Access this part by selecting the **Issues** tab. This tab provides a categorized issues list of various aspects of Azure readiness, cloud native, and Java modernization that you need to address to successfully migrate the application to Azure. The following tables describe the **Domain** and **Criticality** values:

| Domain             | Description                                                                                     |
|--------------------|-------------------------------------------------------------------------------------------------|
| Azure readiness    | Identifies app dependencies and suggests equivalent Azure solutions.                            |
| cloud native       | Assesses how well the app follows cloud-native practices like scalability and containerization. |
| Java modernization | Identifies JDK and framework issues for version upgrade.                                        |

| Criticality | Description                                                 |
|-------------|-------------------------------------------------------------|
| Mandatory   | Issues that must be fixed for migration to Azure.           |
| Potential   | Issues that might impact migration and need review.         |
| Optional    | Low-impact issues. Fixing them is recommended but optional. |

:::image type="content" source="media/java/appcat-7-report-issues.png" alt-text="Screenshot of the AppCAT assessment report Issues tab." lightbox="media/java/appcat-7-report-issues.png":::

For more information, you can expand each reported issue by selecting the title. The report provides the following information:

- A list of files where the incidents occurred, along with the number of code lines impacted. If the file is a Java source file, then selecting the filename directs you to the corresponding source report.
- A detailed description of the issue. This description outlines the problem, provides any known solutions, and references supporting documentation regarding either the issue or resolution.

:::image type="content" source="media/java/appcat-7-report-issue-detail.png" alt-text="Screenshot of the AppCAT assessment report issue details." lightbox="media/java/appcat-7-report-issue-detail.png":::

:::image type="content" source="media/java/appcat-7-report-issue-code.png" alt-text="Screenshot of the AppCAT assessment issue code report." lightbox="media/java/appcat-7-report-issue-code.png":::

### Technologies

Access this part by selecting the **Technologies** tab. The report lists the occurrences of technologies, grouped by function, in the analyzed application. This report is an overview of the technologies found in the application, and is designed to assist you in quickly understanding each application's purpose.

:::image type="content" source="media/java/appcat-7-report-technologies.png" alt-text="Screenshot of the AppCAT assessment report Technologies tab." lightbox="media/java/appcat-7-report-technologies.png":::

### Dependencies

Access this part by selecting the **Dependencies** tab. Displays all Java-packaged dependencies found within the application.

:::image type="content" source="media/java/appcat-7-report-dependencies.png" alt-text="Screenshot of the AppCAT assessment report Dependencies tab." lightbox="media/java/appcat-7-report-dependencies.png":::

### Insights

Access this part by selecting the **Insights** tab. Displays file details and information to help you understand the detected technologies.

:::image type="content" source="media/java/appcat-7-report-insights.png" alt-text="Screenshot of the AppCAT assessment report Insights tab." lightbox="media/java/appcat-7-report-insights.png":::

## Next steps

- [CLI Command Guide for AppCAT 7](appcat7-cli-guide.md)
