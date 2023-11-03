---
title: Technical onboarding guide for 42Crunch
description: Learn using 42Crunch with Microsoft Defender.
ms.date: 11/05/2023
author: dcurwin
ms.author: dacurwin
ms.topic: overview
---

# Overview

42Crunch enables a standardized approach to securing APIs that automates the enforcement of API security compliance across distributed development and security teams. The 42Crunch API security platform empowers developers to build security from the integrated development environment (IDE) into the CI/CD pipeline. This seamless DevSecOps approach to API security reduces governance costs and accelerates the delivery of secure APIs.

## Security testing approach

Unlike traditional DAST tools that are used to scan web and mobile applications, 42Crunch runs a set of tests that are precisely crafted and targeted against each API based on their specific design. Using the OpenAPI definition (i.e., Swagger) file as the primary source, the 42Crunch scan engine runs a battery of tests that validate how closely the API conforms to the intended design. This **Conformance Scan** identifies various security issues including OWASP top 10 vulnerabilities, improper response codes, and schema violations. These issues are reported with rich context including possible exploit scenarios and remediation guidance.

Scans can run automatically as part of a CI/CD pipeline or manually through an IDE or the 42Crunch cloud platform.

Because scan coverage and effectiveness are largely determined by the quality of the API specification, it's important to ensure that your OpenAPI specification is well-defined. 42Crunch **Audit** performs a static analysis of the OpenAPI specification file aimed at helping the developer to improve the security and quality of the specification. The Audit determines a composite security score from 0-100 for each specification file. As developers remediate security and semantic issues identified by the Audit, the score improves. 42Crunch recommends an [Audit score of at least 70 before running a conformance scan](https://docs.42crunch.com/latest/content/concepts/data_dictionaries.htm).

## Enablement

Through relying on the 42Crunch [Audit](https://42crunch.com/api-security-audit) and [Scan](https://42crunch.com/api-conformance-scan/) services, developers can proactively test and harden APIs within their CI/CD pipelines through static and dynamic testing of APIs against the top OWASP API risks and Open API specification best practices. With this preview, the security scan results from 42Crunch are now available within Defender for Cloud, ensuring central security teams have visibility into the health of APIs within the MDC recommendation experience, and can take governance steps natively available through MDC recommendations, including assigning owners and setting due dates for remediation.

## Connect your GitHub repositories to Microsoft Defender for Cloud

To complete this step, follow the instructions in [Quickstart: Connect your GitHub repositories to Microsoft Defender for Cloud](quickstart-onboard-github.md). If you already have a GitHub repository connected to Microsoft Defender for Cloud, you can skip this step.

## Configure 42Crunch audit service

The REST API Static Security Testing action locates REST API contracts that follow the OpenAPI Specification (OAS, formerly known as Swagger) and runs thorough security checks on them. Both OAS v2 and v3 are supported, in both JSON and YAML format.

The action is powered by [42Crunch API Security Audit](https://docs.42crunch.com/latest/content/concepts/api_contract_security_audit.htm). Security Audit performs a static analysis of the API definition that includes more than 300 checks on best practices and potential vulnerabilities on how the API defines authentication, authorization, transport, and request/response schemas.

Install the 42Crunch API Security Audit plugin within your CI/CD pipeline through completing the following steps:

1. Sign in to GitHub.
1. Select a repository you want to configure the GitHub action to.
1. Select **Actions**

   :::image type="content" source="media/onboarding-guide-42crunch/actions.png" alt-text="Screenshot showing GitHub actions screen." lightbox="media/onboarding-guide-42crunch/actions.png":::

1. Select **New Workflow**

   :::image type="content" source="media/onboarding-guide-42crunch/new-workflow.png" alt-text="Screenshot showing new workflow selection." lightbox="media/onboarding-guide-42crunch/new-workflow.png":::

To create a new default workflow:

1. Choose "Setup a workflow yourself"
1. Rename the workflow from main.yaml to 42crunch-audit.yml
1. Go to https://github.com/marketplace/actions/42crunch-rest-api-static-security-testing?version=v3#full-workflow-example.
1. Copy the full sample workflow and paste it in the workflow editor.

> [!NOTE]
> This workflow assumes you have GitHub Code Scanning enabled. Set the **upload-to-code-scanning** option to **false** if you don't.

   :::image type="content" source="media/onboarding-guide-42crunch/workflow-editor.png" alt-text="Screenshot showing GitHub workflow editor." lightbox="media/onboarding-guide-42crunch/workflow-editor.png":::

1. Select **Commit changes**. You can either directly commit to the main branch or create a pull request. We would recommend following GitHub best practices by creating a PR, as the default workflow will launch when a PR is opened against the main branch.
1. Select **Actions** and verify the new action is running.

   :::image type="content" source="media/onboarding-guide-42crunch/new-action.png" alt-text="Screenshow showing new action running." lightbox="media/onboarding-guide-42crunch/new-action.png":::

1. After the workflow has completed, select **Security**, then select **Code scanning** to view the results.

   :::image type="content" source="media/onboarding-guide-42crunch/security-code-scanning.png" alt-text="Screenshot showin security code scanning." lightbox="media/onboarding-guide-42crunch/security-code-scanning.png":::

1. Select a Code Scanning alert detected by 42Crunch REST API Static Security Testing. You can also filter by tool in the Code scanning tab. Filter on **42Crunch REST API Static Security Testing**.

   :::image type="content" source="media/onboarding-guide-42crunch/code-scanning-alert.png" alt-text="Screenshot showing code scanning alert." lightbox="media/onboarding-guide-42crunch/code-scanning-alert.png":::

Now you have verified that the audit results are showing in GitHub Code Scanning. Next, we'll verify these audit results are available within Defender for Cloud. It might take up to 30 minutes for results to show in Defender for Cloud.

## Navigate to Defender for Cloud

1. Select **Recommendations**.
1. Select **All recommendations**.
1. Filter by searching for **API security testing**.
1. Select the recommendation **GitHub repositories should have API security testing findings resolved**.

The selected recommendation shows all 42Crunch audit findings. You have completed the onboarding for the 42Crunch Audit step.

:::image type="content" source="media/onboarding-guide-42crunch/recommendations.png" alt-text="Screenshot showing API recommendations." lightbox="media/onboarding-guide-42crunch/recommendations.png":::

:::image type="content" source="media/onboarding-guide-42crunch/api-recommendations.png" alt-text="Screenshot showing API summary." lightbox="media/onboarding-guide-42crunch/api-recommendations.png":::

## Configure 42Crunch scan service

API Scan continually scans the API to ensure conformance to the OpenAPI contract and detect vulnerabilities at testing time. It detects OWASP API Security Top 10 issues early in the API lifecycle and validates that your APIs can handle unexpected requests.

The scan requires a non-production live API endpoint as well as required credentials (API key/access token). [Follow these steps](https://docs.42crunch.com/latest/content/tutorials/tutorials.htm) to configure the 42Crunch scan.

## FAQ

### How does 42Crunch help developers identify and remediate API security issues?

The 42Crunch security audit and conformance scan identify potential vulnerabilities that exist in APIs early on in the development lifecycle. Scan results include rich context including a description of the vulnerability and associated exploit as well as detailed remediation guidance. Scans can be executed automatically in the CI/CD platform or incrementally by the developer within their IDE through one of the [42Crunch IDE extensions](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi).

### Can 42Crunch be used to enforce compliance with minimum quality and security standards for developers?

Yes. 42Crunch includes the ability to enforce compliance through the use of [Security Quality Gates (SQG)](https://docs.42crunch.com/latest/content/concepts/security_quality_gates.htm). SQGs are comprised of certain criteria that must be met to successfully pass an Audit or Scan. For example, an SQG can ensure that an Audit or Scan with one or more critical severity issues does not pass. In CI/CD, the 42Crunch Audit or Scan can be configured to fail a build if it fails to pass an SQG, thus requiring a developer to resolve the underlying issue before pushing their code.

The free version of 42Crunch uses default SQGs for both Audit and Scan whereas the paid enterprise version allows for customization of SQGs and tags which allow SQGs to be applied selectively to groupings of APIs.

### What data is stored within 42Crunch's SaaS service?

A limited free trial version of the 42Crunch security audit and conformance scan can be deployed in CI/CD which generates reports locally without the need for a 42Crunch SaaS connection. For this
version there is no data shared with the 42Crunch platform.

For the full enterprise version of the 42Crunch platform, the following data is stored in the SaaS platform:

- First name, Last name, email addresses of users of the 42Crunch platform.
- OpenAPI/Swagger files (descriptions of customer APIs).
- Reports that are generated during the security audit and conformance scan tasks performed by 42Crunch.

### How is 42Crunch licensed?

42Crunch is licensed based on a combination of the number of APIs and the number of developers that are provisioned on the platform. See the marketplace listing referred to below for example pricing bundles. Custom pricing is available through private offers on the Azure commercial marketplace. For a custom quote, please reach out to sales@42crunch.com.

### What's the difference between the free and paid version of 42Crunch?

42Crunch offers both a free limited version and paid enterprise version of the security audit and conformance scan.

For the free version of 42Crunch, the 42Crunch CI/CD plugins work standalone, with no requirement to login to the 42Crunch platform. Audit and scanning results are then made available in Microsoft Defender for Cloud as well as within the CI/CD platform. Audits and scans are limited to up to 25 executions per month each, per repo, with a maximum of 3 repositories.

For the paid enterprise version of 42Crunch, audits and scans are still executed locally in CI/CD but can be synced with the 42Crunch platform service where customers can make use of several advanced features including customizable security quality gates, data dictionaries, and tagging. While the enterprise version is licensed for a certain number of APIs, there are no limits to the number of audits and scans that can be run on a monthly basis.

### Is 42Crunch available on the Azure commercial marketplace?

Yes, 42Crunch is [available for purchase on the Microsoft commercial marketplace here](https://azuremarketplace.microsoft.com/marketplace/apps/42crunch1580391915541.42crunch_developer_first_api_security_platform).

Note that purchases of 42Crunch made through the Azure commercial marketplace count towards your Minimum Azure Consumption Commitments (MACC).

## Next steps

[Microsoft Defender for APIs overview](defender-for-apis-introduction.md)
