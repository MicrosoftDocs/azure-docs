---
title: Technical onboarding guide for StackHawk (preview)
description: Learn how to use StackHawk with Microsoft Defender for Cloud to enhance your application security testing.
ms.date: 05/02/2024
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
---

# StackHawk technical onboarding guide

StackHawk makes API and application security testing part of software delivery. The StackHawk platform offers engineering teams the ability to find and fix application bugs at any stage of software development and gives Security teams insight into the security posture of applications and APIs being developed.

## Security testing approach

StackHawk is a modern Dynamic Application Security Testing (DAST) and API security testing tool that runs in CI/CD, enabling developers to quickly find and fix security issues before they hit production.

StackHawk's modern DAST approach with an emphasis on shifting security left changes the way organizations develop and test applications today. An essential next step to helping security teams shift left is understanding what APIs they have, where they live, and who they belong to. StackHawk incorporates generative AI technology into its tool for discovering security issues with code in GitHub repositories. It can identify hidden APIs within source code and describe associated problems via natural language responses.

## Enablement

Microsoft customers looking to prioritize application security now have a seamless path with StackHawk. The StackHawk platform is intricately woven into the Microsoft ecosystem, allowing developers to explore multiple paths tailored to their needs, whether orchestrating workflows through GitHub Actions or Azure DevOps. Once Microsoft Defender for API is mapped to a GitHub or ADO repo, developers can turn on SARIF to take advantage of StackHawk’s advanced security tooling.

Developers can [activate a free trial of StackHawk](https://auth.stackhawk.com/signup) and run a Hawkscan, and explore multiple paths tailored to their needs, whether orchestrating workflows through GitHub Actions or Azure DevOps.

When expanding out of the free tier, Microsoft customers can [purchase StackHawk through the Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/stackhawkinc1614363947577.stackhawk?tab=overview) to reduce or completely eliminate procurement time.

## Connect your DevOps environments to Microsoft Defender for Cloud

This feature requires connecting your DevOps environment to Defender for Cloud.

See [how to onboard your GitHub organizations](quickstart-onboard-github.md).

See [how to onboard your Azure DevOps organizations](quickstart-onboard-devops.md).

## Configure StackHawk API security testing scan

### For GitHub Actions CI/CD environments

1. To use the [StackHawk HawkScan Action](https://github.com/marketplace/actions/stackhawk-hawkscan-action), make sure you're logged into [GitHub](https://github.com/login), and have a [StackHawk account](http://auth.stackhawk.com/signup).
1. From GitHub, you can use a GitHub repository with a defined GitHub Actions workflow process already in place, or create a new workflow. We scan this GitHub repository for API vulnerabilities as part of the GitHub Actions workflow.

   > [!NOTE]
   > Ideally you should select to scan a GitHub repository that corresponds to a dynamic web API. This can be a REST, GraphQL or gRPC API. HawkScan works better with a discoverable API specification file like an [OpenAPI specification](https://docs.stackhawk.com/hawkscan/configuration/openapi-configuration.html), and with [authenticated scanning](https://docs.stackhawk.com/hawkscan/authenticated-scanning/). StackHawk provides [JavaSpringVulny](https://github.com/kaakaww/javaspringvulny/) as an example vulnerable API you can fork and try, if you don’t have your own vulnerable web API to scan.

1. From StackHawk, make sure you collected your API Key and have a StackHawk Application created, and the *stackhawk.yml* scan configuration checked into your GitHub repository.
1. Go to [StackHawk HawkScan Action](https://github.com/marketplace/actions/stackhawk-hawkscan-action) to view the details of the StackHawk HawkScan Action for GitHub Actions CI/CD. From your repository */settings/secrets/actions* page, assign your StackHawk API Key to `HAWK_API_KEY`. Then to add it to your GitHub actions workflow, add the following step to your build:

   ```yml
   # Make sure your app.host web application is started and accessible before you scan.
   #  - name: Start Web Application
   #     run: docker run --rm --detach --publish 8080:80 --name my_web_app nginx
      - name: API Scan with StackHawk
         uses: stackhawk/hawkscan-action@v2.1.3
         with:
         apiKey: ${{ secrets.HAWK_API_KEY }}
         env:
            SARIF_ARTIFACT: true
   ```

    This starts HawkScan on the runner pointed at the app.host defined in the *stackhawk.yml*. Be sure to include `with.env.SARIF_ARTIFACT: true` to get the SARIF output from the scan. The HawkScan action has more documented configuration inputs. You can see an example of the action in use [here](https://github.com/kaakaww/javaspringvulny/blob/main/.github/workflows/hawkscan.yml#L21-L32).

1. You can also follow these steps to add *stackhawk/hawkscan-action* to a new workflow action:

   1. Sign in to GitHub.
   1. Select a GitHub repository you want to configure the GitHub action to.
   1. Select **Actions**.
   1. Select **New Workflow**.
   1. Filter by searching for *StackHawk HawkScan* in the search box.
   1. Select **Configure** for the *StackHawk* workflow.
   1. Modify the sample workflow in the editor. Review the [GitHub Actions documentation](https://docs.stackhawk.com/continuous-integration/github-actions/).
   1. Select **Commit changes**. You can either directly commit to the main branch or create a pull request. We recommend following GitHub best practices by creating a PR, as the default workflow launches when a PR is opened against the main branch.
   1. Select **Actions** and verify the new action is running.
   1. After the workflow is completed, select **Security**, then select **Code scanning** to view the results.
   1. Select a Code Scanning alert detected by StackHawk. You can also filter by tool in the Code scanning tab. Filter on **StackHawk**.

1. You now verified that the StackHawk security scan results are showing in GitHub Code Scanning. Next, verify that these scan results are available within Defender for Cloud. It might take up to 30 minutes for results to show in Defender for Cloud.

**Navigate to Defender for Cloud**:

1. Select **Recommendations**.
1. Filter by searching for **API security testing**.
1. Select the recommendation **GitHub repositories should have API security testing findings resolved**.

:::image type="content" source="media/onboarding-guide-stackhawk/github-recommendations-result.png" alt-text="Screenshot of GitHub repositories should have API security testing findings resolved recommendation." lightbox="media/onboarding-guide-stackhawk/github-recommendations-result.png":::

### For Azure Pipelines environments

1. To use the [StackHawk HawkScan extension](https://marketplace.visualstudio.com/items?itemName=StackHawk.stackhawk-extensions), make sure you're logged into Azure Pipelines (`https://dev.azure.com/{yourorganization}`), and have a [StackHawk account](http://auth.stackhawk.com/signup).
1. From Azure Pipelines, you can use a defined pipeline with a defined *azure-pipelines.yml* process already in place, or create a new workflow. We scan this Azure DevOps repository for API vulnerabilities as part of the *azure-pipelines.yml* workflow.

   :::image type="content" source="media/onboarding-guide-stackhawk/hawkscan-tasks.png" alt-text="Screenshot of tasks to install and run HawkScan.":::

1. Once the HawkScan extension is added to your Azure DevOps Organization, you can use the `HawkScanInstall` task and the `RunHawkScan` task to add HawkScan to your runner and kick off HawkScan as separate steps.

   ```yml
   - task: HawkScanInstall@1.2.8
      inputs:
      version: "3.7.0"
      installerType: "msi"

   # start your web application in the background
   # - script: |
   #    curl -Ls https://GitHub.com/kaakaww/javaspringvulny/releases/download/0.2.0/java-spring-vuly-0.2.0.jar -o ./java-spring-vuly-0.2.0.jar
   #    java -jar ./java-spring-vuly-0.2.0.jar &


   - task: RunHawkScan@1.2.8
      inputs:
      configFile: "stackhawk.yml"
      version: "3.7.0"
      env:
      HAWK_API_KEY: $(HAWK_API_KEY) # use variables in the azure devops ui to configure secrets and env vars
      APP_ENV: $(imageName)
      APP_ID: $(appId)
      SARIF_ARTIFACT: true
   ```

   This installs HawkScan on the runner pointed at the app.host defined in *stackhawk.yml*. Be sure to include `env.SARIF_ARTIFACT: true` on the task specification to get the SARIF output from the scan. The HawkScan action has more documented configuration inputs. You can see an example of the action in use [here](https://github.com/kaakaww/javaspringvulny/blob/main/azure-pipelines.yml).

1. Install the [HawkScan](https://marketplace.visualstudio.com/items?itemName=StackHawk.stackhawk-extensions) extension on your Azure DevOps organization.

   1. Visit the StackHawk website and [sign up for a free trial](https://auth.stackhawk.com/signup).
   1. For Windows developers, reference this [sample app for building software on Windows](https://github.com/kaakaww/javaspringvulny/blob/main/azure-pipelines.yml).
   1. Review the [HawkScan and Azure Pipelines documentation](https://docs.stackhawk.com/continuous-integration/azure/azure-pipelines.html).

1. Create a new Pipeline or clone [StackHawk’s sample app](https://github.com/kaakaww/javaspringvulny/blob/main/ci-examples/azure-devops/azure-pipelines.yml) within your Azure DevOps project. For a tutorial for creating your first pipeline, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline).
1. Run the pipeline.
1. To verify the results are being published correctly in Azure DevOps, validate that *stackhawk.sarif* is being uploaded to the Build Artifacts under the *CodeAnalysisLogs* folder.

   :::image type="content" source="media/onboarding-guide-stackhawk/artifacts-upload.png" alt-text="Screenshot of stackhawk.sarif uploaded to Build Artifacts.":::

1. You completed the onboarding process. Next verify the results shown in Defender for Cloud.

**Navigate to Defender for Cloud**:

1. Select **Recommendations**.
1. Filter by searching for **API security testing**.
1. Select the recommendation **Azure DevOps repositories should have API security testing findings resolved**.

:::image type="content" source="media/onboarding-guide-42crunch/azure-devops-recommendation.png" alt-text="Screenshot of Azure DevOps repositories should have API security testing findings resolved recommendation." lightbox="media/onboarding-guide-42crunch/azure-devops-recommendation.png":::

## FAQ

### How is StackHawk licensed?

StackHawk is licensed based on the number of code contributors that are provisioned on the platform. For more information on the pricing model, visit the [Azure Marketplace listing](https://azuremarketplace.microsoft.com/marketplace/apps/stackhawkinc1614363947577.stackhawk?tab=overview). For custom pricing, EULA, or a private contract, contact <marketplace-orders@stackhawk.com>.

### Is StackHawk available on the Azure Marketplace?

Yes, StackHawk is available for purchase on the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/stackhawkinc1614363947577.stackhawk?tab=overview).

### If I purchase StackHawk from Azure Marketplace, does it count towards my Microsoft Azure Consumption Commitment (MACC)?

Yes, purchases of [StackHawk](https://azuremarketplace.microsoft.com/marketplace/apps/stackhawkinc1614363947577.stackhawk?tab=overview) through the Azure Marketplace count towards your Microsoft Azure Consumption Commitments (MACC).

## Related content

[Microsoft Defender for APIs overview](defender-for-apis-introduction.md)
