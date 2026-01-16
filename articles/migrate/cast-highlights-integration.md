--- 
title: Integrate application code scan reports from CAST highlights  
description: Pull code scan insights from CAST highlights in Azure Migrate application assessments and review the application report 
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate 
ms.topic: concept-article 
ms.date: 04/24/2024 
ms.custom: engagement-fy24 
monikerRange:
# Customer intent: "As an application owner, I want to identify and evaluate code changes required for modernizing my applications in Azure Migrate, so that I can deploy the best migration strategy for a smooth transition to Azure."
--- 

# Overview

Integrating CAST Highlight with Azure Migrate allows you to import code-level insights into your cloud migration assessments. This enriches the Azure Migrate application assessment with data on code **cloud readiness** (such as cloud blocker patterns, code complexity, and required changes), helping you decide if an application needs to be refactored or can be replatformed as-is.


## Prerequisites

- **CAST Highlight account**: Active account with applications created and scanned. All relevant code scans should be completed in CAST Highlight before importing results into Azure Migrate.
- **CAST credentials**: Obtain the CAST Highlight **Company Code** (Identifier) and **API Token** for your organization. If you don’t have an API token, you can use your CAST Highlight username and password instead.
- **Azure Migrate project with discovered Applications**: Ensure the application you want to analyze is represented in an Azure Migrate project (in the **Applications** inventory or included in an **Application Assessment**).


## Steps to Add CAST Highlight Code Insights in Azure Migrate

1. **Go to Azure Migrate & Select Application**
   - In the Azure Migrate portal, navigate to your project.
   - Go to **Servers, Databases & Web Apps > Applications** (under **Discovery and Assessment**).
   - Locate the application (or group of VMs) you want to enrich with code insights.
   - You can start integration from:
     - The **Applications** list (select one or multiple applications).
     - An **Application Assessment** (open the assessment’s details).

1. **Click “Add code insights”**
   - On the Applications inventory toolbar (or in the assessment details page), click **Add code insights**.
   - If you selected multiple applications, code insights will be added to each one, one by one.

1. **Enter CAST Highlight Credentials**
   - A dialog will appear asking for CAST Highlight details:
     - **Company Code**: Enter your CAST Highlight Company Identifier.
     - **Authentication**: Choose API token (recommended) or user credentials.
   - After entering these, click **Connect** or **Authenticate**.

1. **Map to CAST Highlight Application (if prompted)**
   - Azure Migrate retrieves a list of applications from CAST Highlight.
   - It attempts to match the Azure Migrate application with the CAST Highlight application of the same name.
   - If multiple or no matches are found, select the correct CAST Highlight application from the dropdown.

1. **Import Code Insights**
   - Click **Add** (or **Import**) to start importing code insights.
   - Azure Migrate fetches CAST Highlight scan data for the application.
   - You may see a status indicator (e.g., “Importing code insights…”).

1. **Review the Assessment Results**
   - After import, review the updated Azure Migrate assessment:
     - **Code-based Findings**: List of cloud blockers or required code changes (e.g., unsupported libraries, hard-coded paths).
     - **Impact on Migration Strategy**: The recommended migration strategy may change (e.g., to **Refactor** if significant code changes are needed).
     - **Readiness Score**: The application’s readiness for various target platforms may be updated.
     - **Cost and Effort**: Code insights may inform the estimated effort to remediate the app.

1. **Iterate as Needed**
   - CAST Highlight data in Azure Migrate is a snapshot. If you address code issues and rescan in CAST, you can **Update code insights** in Azure Migrate to update the assessment.



> [!Note]
>  - **Applicability**: Code insights integration supports modernization scenarios (assessments targeting Azure VMs or Azure VMware). For direct PaaS assessments, the feature may not appear.
>  - **One-way Integration**: Once added, code insights cannot be removed—only updated with new data. To undo, delete and recreate the assessment.
>  - **Data Security**: No source code is transferred to Azure Migrate. Only metadata and analysis results are imported.
>  - **Use of Insights**: Imported insights guide migration planning. They don’t automatically change any code. Plan remediation work for identified issues as part of your migration timeline.


By following these steps, you’ll successfully integrate CAST Highlight with Azure Migrate. Your application’s assessment will combine infrastructure and detailed code analysis, providing a holistic view for migration and modernization planning.