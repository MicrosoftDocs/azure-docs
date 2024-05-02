---
title: Technical onboarding guide for Bright Security (preview)
description: Learn how to use Bright Security with Microsoft Defender for Cloud to enhance your application security testing.
ms.date: 05/02/2024
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
---

# Bright Security technical onboarding guide

Bright provides a developer-centric enterprise Dynamic Application Security Testing (DAST) solution. It scans applications and APIs from the outside-in, mimicking how a hacker would approach the application, and automatically tests for vulnerabilities that bad actors could use to exploit.

Unlike legacy DAST tools designed exclusively for expert security users after the application is already in production, Bright’s tool was built to be "developer-first." It was designed to empower developers to create more secure applications and APIs starting in early development phases and across all stages leading up to and including production so that vulnerabilities are caught and remediated as early as possible. Scans can start as early as the Unit Testing phase in the software development lifecycle and progress from there to find as many vulnerabilities as possible early in the development lifecycle. Remediating vulnerabilities early saves significant developer time and reduces risk.

The solution is both developer and AppSec friendly and has unique capabilities including quick setup, minimal false positives, developer focused remediation suggestions, the ability to run the solution from a UI, or CLI, and seamless integration with the developer toolchain.

## Security testing approach

Bright API security validation is based on three main phases:

1. Map the API attack surface. Bright can parse and learn the exact valid structure of REST and GraphQL APIs, from an OAS file (swagger) or an Introspection (GraphQL schema description). In addition, Bright can learn API content from Postman collections and HAR files. These methods provide a comprehensive way to visualize the attack surface.
1. Conduct an attack simulation on the discovered APIs. Once the baseline of the API behavior is known (in step 1), Bright manipulates the requests (payloads, endpoint parameters, and so on) and automatically analyzes the response, verifying the correct response code and the content of the response payload to ensure no vulnerability exists. The attack simulations include OWASP API top 10, NIST, business logic tests, and more.
1. Bright provides a clear indication of any found vulnerability, including screenshots to ease the triage and investigation of the issue and suggestions on how to remediate that vulnerability.

## Enablement

Bright’s solutions can be purchased via the Azure Marketplace by following [this link](https://azuremarketplace.microsoft.com/marketplace/apps/brightsec.bright-dast?tab=Overview).

## Connect your DevOps environments to Microsoft Defender for Cloud

This feature requires connecting your DevOps environment to Defender for Cloud.

See [how to onboard your GitHub organizations](quickstart-onboard-github.md).

See [how to onboard your Azure DevOps organizations](quickstart-onboard-devops.md).

## Configure Bright Security API security testing scan

### For GitHub environments

> [!NOTE]
> For additional details on how to configure Bright Security for GitHub Actions along with links to sample GitHub Action workflows, see [GitHub Actions](https://docs.brightsec.com/docs/github-actions).

Install the Bright Security plugin within your CI/CD pipeline by completing the following step:

1. Sign in to GitHub.
1. Select a repository you want to configure the GitHub action to.
1. Select **Actions**.
1. Select **New Workflow**.
1. Filter by searching for *NeuraLegion* in the search box.
1. Select **Configure** for the NeuraLegion workflow.
1. If the APIs to be tested are in an internal environment that requires authentication, create an authentication object following the instructions in [Creating authentication](https://docs.brightsec.com/docs/creating-authentication).
1. Define a discovery of the APIs to be tested following the instructions in [Discovery](https://docs.brightsec.com/docs/discovery).
1. Run the attack simulation by following the instructions in [Creating a modern scan](https://docs.brightsec.com/docs/creating-a-modern-scan).
1. Select **Commit changes**. You can either directly commit to the main branch or create a pull request. We recommend following GitHub best practices by creating a PR, as the default workflow launches when a PR is opened against the main branch.
1. Select **Actions** and verify the new action is running.
1. After the workflow completes, select **Security**, then select **Code scanning** to view the results.
1. Select a Code Scanning alert detected by Neuralegion. You can also filter by tool in the Code scanning tab. Filter on *Neuralegion*.

You now verified that the Bright Security (Neuralegion GitHub workflow) security scan results are showing in GitHub Code Scanning. Next, verify that these scan results are available within Defender for Cloud. It might take up to 30 minutes for results to show in Defender for Cloud.

**Navigate to Defender for Cloud**:

1. Select **Recommendations**.
1. Filter by searching for **API security testing**.
1. Select the recommendation **GitHub repositories should have API security testing findings resolved**.

:::image type="content" source="media/onboarding-guide-stackhawk/github-recommendations-result.png" alt-text="Screenshot of GitHub repositories should have API security testing findings resolved recommendation." lightbox="media/onboarding-guide-stackhawk/github-recommendations-result.png":::

### For Azure DevOps environments

> [!NOTE]
> For additional details on how to configure Bright Security forAzure DevOps along with links to sample Azure DevOps workflows, see [Azure Pipelines](https://docs.brightsec.com/docs/azure-pipelines).

1. Install the [NexPloit DevOps Integration](https://marketplace.visualstudio.com/items?itemName=Neuralegion.nexploit) on your Azure DevOps organization.
1. Create a new Pipeline within your Azure DevOps project. For a tutorial for creating your first pipeline, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline).
1. Edit the created pipeline. Follow the steps outlined in [Azure DevOps Integration](https://docs.brightsec.com/docs/azure-devops-integration).
1. Run the pipeline.
1. To verify the results are being published correctly in Azure DevOps, validate that *NeuraLegion_ScanReport.SARIF* is being uploaded to the Build Artifacts under the *CodeAnalysisLogs* folder.

    :::image type="content" source="media/onboarding-guide-bright/artifacts-uploaded.png" alt-text="Screenshot of NeuraLegion_ScanReport.SARIF uploaded to Build Artifacts.":::

1. You completed the onboarding process. Next verify the results show in Defender for Cloud.

**Navigate to Defender for Cloud**:

1. Select **Recommendations**.
1. Filter by searching for **API security testing**.
1. Select the recommendation **Azure DevOps repositories should have API security testing findings resolved**.

:::image type="content" source="media/onboarding-guide-42crunch/azure-devops-recommendation.png" alt-text="Screenshot of Azure DevOps repositories should have API security testing findings resolved recommendation." lightbox="media/onboarding-guide-42crunch/azure-devops-recommendation.png":::

## Related content

[Microsoft Defender for APIs overview](defender-for-apis-introduction.md)
