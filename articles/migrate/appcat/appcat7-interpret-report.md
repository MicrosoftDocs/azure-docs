---
title: Interpret the AppCAT 7 Report
description: Azure Migrate application and code assessment tool - Interpret AppCAT report.
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

This article guides you through the AppCAT report to help you well understand it for assessing the migration readiness of your Java application to Azure. The report provides a comprehensive overview of the application and its components. You can use this report to gain insights into the structure and dependencies of the application, and to determine its suitability for replatform and modernization.

## Application list view
The landing page of the report presents a overall view of all analyzed applications. From here, you can navigate to individual application reports to explore detailed findings.

:::image type="content" source="media/java/appcat-7-report-applist.png" alt-text="app list of the AppCAT assessment report." lightbox="media/java/appcat-7-report-applist.png":::

## Application view

The application report consists of 3 sections:

- **Application Information**: Reveals the basic information of your application including Java version, framework, build tool, etc.
- **Issue Summary**: shows the issue overview for three domains with percentage on issue criticality.
- The detail report is organized into 4 sub sections:
  - **Issues**: Provides a concise summary of all issues that require attention.
  - **Dependencies**: Displays all Java-packaged dependencies found within the application.
  - **Technologies**: Displays all embedded libraries grouped by functionality, allowing you to quickly view the technologies used in the application.
  - **Insights**: Detailed files and information to better understand detected technologies.

:::image type="content" source="media/java/appcat-7-report-app.png" alt-text="app view of the AppCAT assessment report." lightbox="media/java/appcat-7-report-app.png":::

### Issues

Access this part by clicking the Issues tab. It provides a categorized issue list of various aspects of Azure readiness, cloud native, and Java modernization that you need to address to successfully migrate the application to Azure. Learn more about domain and criticality via below sections.

| Domain             | Description                                                                                    |
|--------------------|------------------------------------------------------------------------------------------------|
| Azure readiness    | Identifies app dependencies and suggests equivalent Azure solutions                            |
| cloud native       | Assesses how well the app follows cloud-native practices like scalability and containerization |
| Java modernization | Identifies JDK and framework issues for version upgrade                                        |

| Criticality | Description                                                |
|-------------|------------------------------------------------------------|
| Mandatory   | Issues that must be fixed for migration to Azure           |
| Potential   | Issues that might impact migration and need review         |
| Optional    | Low-impact issues; fixing them is recommended but optional |

:::image type="content" source="media/java/appcat-7-report-issues.png" alt-text="issues of the AppCAT assessment report." lightbox="media/java/appcat-7-report-issues.png":::

Each reported issue can be expanded, by clicking on the title, to obtain additional details. The following information is provided:

- A list of files where the incidents occurred, along with the number of code lines impacted. If the file is a Java source file, then clicking the filename will direct you to the corresponding Source report.
- A detailed description of the issue. This description outlines the problem, provides any known solutions, and references supporting documentation regarding either the issue or resolution.

:::image type="content" source="media/java/appcat-7-report-issue-detail.png" alt-text="issue detail of the AppCAT assessment report." lightbox="media/java/appcat-7-report-issue-detail.png":::

:::image type="content" source="media/java/appcat-7-report-issue-code.png" alt-text="issue code of the AppCAT issue code report." lightbox="media/java/appcat-7-report-issue-code.png":::

### Technologies

Access this part by clicking the Technologies tab. The report lists the occurrences of technologies, grouped by function, in the analyzed application. It is an overview of the technologies found in the application, and is designed to assist users in quickly understanding each application's purpose.

:::image type="content" source="media/java/appcat-7-report-technologies.png" alt-text="technologies of the AppCAT assessment report." lightbox="media/java/appcat-7-report-technologies.png":::

### Dependencies

Access this part by clicking the Dependencies tab. Displays all Java-packaged dependencies found within the application.

:::image type="content" source="media/java/appcat-7-report-dependencies.png" alt-text="dependencies of the AppCAT assessment report." lightbox="media/java/appcat-7-report-dependencies.png":::

### Insights

Access this part by clicking the Insights tab. Detailed files and information to better understand detected technologies.

:::image type="content" source="media/java/appcat-7-report-insights.png" alt-text="Insights of the AppCAT assessment report." lightbox="media/java/appcat-7-report-insights.png":::

## Next steps

- [CLI Command Guide for AppCAT 7](appcat7-cli-guide.md)
