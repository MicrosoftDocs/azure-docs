---
title: Add Code Insights by Using GitHub Copilot Modernization
description: Learn how to add code insights by using GitHub Copilot modernization and get a more accurate modernization strategy.
ms.topic: how-to
author: sudesai
ms.author: sudesai
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 10/23/2025
ms.custom: engagement-fy24
# Customer intent: As a cloud administrator, I want to add code insights by using GitHub Copilot modernization so that I can improve assessments.
---


# Add code insights by using GitHub Copilot modernization (preview)

This article describes how to add code insights by using GitHub Copilot modernization when you're migrating applications to Azure services. Adding code insights helps you better assess migration readiness and get recommendations for migration strategies based on the code changes identified during the scan.

Code insights for web apps provide changes required to modernize them to Azure Kubernetes Service (AKS) and Azure App Service. Code changes for an application are an aggregate of code changes for its child web apps.

In this article, you learn how to:

- Generate a GitHub Copilot code assessment report for web apps.
- Add code insights for web apps from an application inventory and assessment pages.
- Add code insights for web apps from a web app inventory and assessment pages.
- View code insights.

You can add code insights by using any of the following methods:

- **Use the GitHub Copilot Modernize CLI**. Use this method to run an at-scale assessment for multiple web apps simultaneously, with automated report upload to Azure Migrate. This approach allows cloud administrators and application developers to collaborate while adhering to their organization's code security guidelines.
- **Upload by using a ZIP file**. Use this method when you already have a code scan report or permissions to generate one. It requires manual mapping of reports to each web app.
- **Request a report through a GitHub issue**. Use this method when you can't generate a code insights report yourself or you don't have access to the code repository.

> [!NOTE]
> Code insights aren't currently supported through private endpoints.

## Run at-scale code assessments by using the GitHub Copilot Modernize CLI

Using the GitHub Copilot Modernize CLI enables at-scale code assessment for multiple applications and web apps, with source code spread across multiple repositories.

First, you download a configuration file from Azure Migrate that contains details of all the web apps. You then update the mapping of web apps to repositories and run the assessment by using the GitHub Copilot Modernize CLI. Code changes are automatically mapped back to Azure Migrate for the corresponding applications and web apps.

### Prerequisites for Azure Migrate users

- An Azure Migrate project with successful discovery of applications and web apps.
- ASP.NET or Java web apps. These types of web apps are supported.
- Azure App Service or Azure Kubernetes Service. Code insights are supported for these Azure targets.

### Prerequisites for GitHub Copilot Modernize CLI users

- A GitHub Copilot Free, Pro, Pro+, Business, or Enterprise license.
- Installation of the Azure CLI and GitHub Copilot Modernize CLI. Sign in to Azure and GitHub Copilot.
- The [Decide and Plan Expert role](/azure/migrate/prepare-azure-accounts) or higher privileges to the Azure Migrate project.

For detailed installation steps, see the Modernize CLI [instructions](/azure/developer/github-copilot-app-modernization/modernization-agent/quickstart).

### Download the configuration file from Azure Migrate

1. Generate the configuration file by using any of these methods:

    - On the Azure Migrate **Overview** page, under **Explore Applications**, select **Applications**.
    - On the Azure Migrate **Overview** page, under **Explore inventory**, select **Web apps**.
    - On the Azure Migrate **Overview** page, under **Decide and Plan**, select **Assessments**. Choose the relevant application assessment or web app assessment.

1. Select the applications or web apps for which you want to add code insights. Then select **Add code insights** > **GitHub Copilot modernization**.

    :::image type="content" source="./media/add-copilot-code-insights/github-copilot-modernization.png" alt-text="Screenshot that shows the selection of the GitHub Copilot modernization option." lightbox="./media/add-copilot-code-insights/github-copilot-modernization.png":::

1. By default, **At scale code assessment with automated report upload** is selected to add code changes by using the GitHub Copilot Modernize CLI.

1. Review the list of web apps. You can remove the web apps for which you don't need code insights.

1. Select **Download** to generate a JSON file that contains details of all the web apps to be assessed and placeholders to add repository information. The download might take a few seconds to finish.

    :::image type="content" source="./media/add-copilot-code-insights/download-configuration.png" alt-text="Screenshot that shows the download configuration option." lightbox="./media/add-copilot-code-insights/download-configuration.png":::

### Run the configuration file in the Modernize CLI

1. Before you run the configuration file in the Modernize CLI, you must update the file with the code repository name and path for each web app. The file has two sections: `apps` and `repos`.

    :::image type="content" source="./media/add-copilot-code-insights/code-repository.png" alt-text="Screenshot that shows how to update the file with the code repository name and path for each web app." lightbox="./media/add-copilot-code-insights/code-repository.png":::

1. In the `apps` section, review the web app name, hosting server, parent application, and framework version.

1. In the `apps` section, in the `repos` property, replace `<sample-git-repo>` and `<sample-local-repo>` with the name of the repository that's associated with the web app. You can mention names of multiple GitHub repositories and local paths.

1. In the `repos` section, update the same repository names as described in the previous step. Then replace `<https://github.com/<sample-org>/<sample-repo>.git>` with the path to the GitHub repository. The branch field is optional. If the repository is stored locally, replace `</absolute/path/to/project>` with path details.

1. Repeat the preceding steps for all web apps in the configuration file.

1. Open the GitHub Copilot Modernize CLI. Authenticate to GitHub Copilot and Azure by using `gh auth login` and `az login`. Ensure that the user running the Modernize CLI has the Decide and Plan Expert role assigned for the Azure Migrate project.

1. Run `modernize assess --source <local path to configuration file>`. The code assessment might take a few minutes to finish.

1. After a successful code assessment, reports are automatically pushed to Azure Migrate. You receive the message `Distribution complete: m/n app(s) distributed`.

1. Code changes are automatically updated for the selected applications and web apps in Azure Migrate.

## View code insights

1. To view code insights for applications, go to **Explore applications** > **Applications**. In the **Code changes** column, select **Available**.

    :::image type="content" source="./media/add-copilot-code-insights/code-changes.png" alt-text="Screenshot that shows how to select code change options in the Applications pane." lightbox="./media/add-copilot-code-insights/code-changes.png":::

1. To view code insights for web apps, go to **Explore inventory** > **Web apps**. In the **Code changes** column, select **Available**.

1. If you already created an assessment for the applications or web apps for which you added code insights, that assessment is outdated. Recalculate the assessment to view code insights. You can find code changes under **View details** for each assessment.

1. Review the code changes by selecting the relevant tab: **Issues, Warnings**, or **Information**. These tabs provide a summarized view of code changes across the web apps in the assessment.

1. The list provides actionable remediation guidance and estimated effort for code fixes. GitHub Copilot effort is estimated at approximately 40% of the manual effort required.

    :::image type="content" source="./media/add-copilot-code-insights/code-scan-details.png" alt-text="Screenshot that shows the summarized view of code changes across the web apps in an assessment." lightbox="./media/add-copilot-code-insights/code-scan-details.png":::

1. If you already created the assessment, code changes appear only for the recommended target, and the readiness and migration strategy might change. If the required code changes are significant, readiness might change from **Ready** to **Ready with conditions**.

## Manually upload code scan reports by using a ZIP file

You can generate a code scan report manually and upload it as a ZIP file to Azure Migrate.

### Prerequisites

- Web apps for which you want to generate a code scan report

### Generate a GitHub Copilot code assessment report

You can generate a code assessment report by using the GitHub Copilot modernization extension or the AppCAT CLI.

#### GitHub Copilot modernization extension

1. Install the [GitHub Copilot modernization extension](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure) in Visual Studio Code.

1. Open the source code of your web app from the GitHub repository. You must have permissions to the code repository.

1. On the sidebar, select **GitHub Copilot modernization**. In the **ASSESSMENT** section, select **Migrate to Azure** or **Run Assessment**.

1. When the assessment finishes, you can download the **report.json** file to the location of your choice.

1. Create a ZIP file for all the reports that you want to add.

#### AppCAT CLI

1. Install AppCAT:

    - For .NET, use the command
    `dotnet tool install --global Microsoft.AppCAT.Tool`. For detailed instructions, see [Install the .NET global tool](/dotnet/azure/migration/appcat/install#install-the-net-global-tool).
    - For guidance on assessing Java projects, see [Assess a Java project using AppCAT 7](/azure/migrate/appcat/appcat-7-quickstart?tabs=windows#download-and-install).

1. Generate AppCAT reports for all assessed web apps:

   - For .NET applications, use the .NET CLI to analyze applications. For more details, see [Analyze applications with the .NET CLI](/dotnet/azure/migration/appcat/dotnet-cli).
   - To run AppCAT against a sample Java project, see [Run AppCAT against a sample Java project](/azure/migrate/appcat/appcat-7-quickstart?tabs=windows#run-appcat-against-a-sample-java-project).

1. Create a ZIP file for all the reports that you want to add.

### Upload the ZIP file

1. Add a code assessment report by using any of these methods:

    - On the Azure Migrate **Overview** page, under **Explore inventory**, select **Web apps**.
    - On the Azure Migrate **Overview** page, under **Explore Applications**, select **Applications**.
    - On the Azure Migrate **Overview** page, under **Decide and Plan**, select **Assessments**. Choose the application assessment or web app assessment.

1. Select the applications or web apps for which you want to add code insights. Then select **Add code insights** > **GitHub Copilot modernization**.

1. Select **Single code assessment with manual report upload**.

    :::image type="content" source="./media/add-copilot-code-insights/single-code-assessment.png" alt-text="Screenshot that shows selecting single code assessment with manual report upload." lightbox="./media/add-copilot-code-insights/single-code-assessment.png":::

1. In the **Add Code Insights** pane, select **Upload a ZIP file**.

1. Select **Browse**. Select the location of the ZIP file that contains the reports to import, and then select **Upload**. Wait for the upload and validation to finish.

    :::image type="content" source="./media/add-copilot-code-insights/upload-github-copilot-assessment.png" alt-text="Screenshot that shows how to upload the ZIP file that contains the reports to import." lightbox="./media/add-copilot-code-insights/upload-github-copilot-assessment.png":::

1. In the list of web apps, select the **Code insights report** dropdown list, and then view the uploaded reports under **Uploaded from .ZIP file**.

    :::image type="content" source="./media/add-copilot-code-insights/code-insights-reports.png" alt-text="Screenshot that shows how to view a code insights report." lightbox="./media/add-copilot-code-insights/code-insights-reports.png":::

1. Select the appropriate report to map to the corresponding web app. Repeat these steps for all required web apps.

1. Select **Add** and wait for the process to finish. Code insights reports are automatically mapped to all Azure targets.

    :::image type="content" source="./media/add-copilot-code-insights/code-insights.png" alt-text="Screenshot that shows how code insights reports are automatically mapped to all Azure targets." lightbox="./media/add-copilot-code-insights/code-insights.png":::

1. After the mapping is complete, the **Code changes** column on pages for applications and web apps shows **Available**. All assessments for the selected applications or web apps are marked as outdated. Select **Recalculate** to start recalculation.

1. On the page for the applications or web apps, select **Available** to view code insights. If code changes are included, the page displays the number of changes for the recommended Azure target.

## Request a report via GitHub

Requesting a report via GitHub connects Azure Migrate to a GitHub repository by using the provided connection details and automatically creates an issue in that repository. By using the GitHub Copilot modernization extension, you can scan your code and upload reports directly to the related GitHub issue.

After you update the issue, Azure Migrate automatically attaches the code scan reports to the associated web applications. This approach allows cloud administrators and developers to collaborate while maintaining security boundaries for application code.

### Prerequisites

- Ensure that a web app assessment exists for each web app, because you can add code scan reports only to an existing assessment.
- Provide information about the GitHub repository required for integration with Azure Migrate, to allow automatic requests and synchronization of code scan reports.
- Provide GitHub application details with permissions to create issues and read comments in the target repository.

### Create a new GitHub app

1. In the upper-right corner of the GitHub page, select your profile picture.

1. Go to your account settings:

    - For an app owned by a personal account, select **Your organization** and then select **Settings** to the right of the organization.
    - For an app owned by an enterprise:
      - If you use enterprise managed users, select **Your enterprise** to go directly to the enterprise account settings.
      - If you use personal accounts, select **Your enterprises** and then select **Settings** to the right of the enterprise.

1. Go to the GitHub app settings:

    - For an app owned by a personal account or organization, select **Developer settings** on the sidebar. Then select **GitHub Apps** > **New GitHub App**.
    - For an app owned by an enterprise, go to **Settings** on the sidebar. Then select **GitHub Apps** > **New GitHub App**.

    :::image type="content" source="./media/add-copilot-code-insights/new-github-app.png" alt-text="Screenshot that shows how to select a new GitHub app." lightbox="./media/add-copilot-code-insights/new-github-app.png":::

1. Provide the following details to set up your new GitHub app:

    1. Under **GitHub App name**, enter a name for your app.
    1. Under **Homepage URL**, provide the complete URL. This URL serves as a placeholder and isn't used in this process.
  
    :::image type="content" source="./media/add-copilot-code-insights/register-new-github.png" alt-text="Screenshot that shows details for registering a new GitHub app, including the home page URL." lightbox="./media/add-copilot-code-insights/register-new-github.png":::

1. Ensure that **Expire user authorization tokens** is selected.

1. Under **Webhook**, clear the **Active** checkbox.
  
    :::image type="content" source="./media/add-copilot-code-insights/active-webhook.png" alt-text="Screenshot that shows how to deselect the active webhook." lightbox="./media/add-copilot-code-insights/active-webhook.png":::

1. Under **Permissions**, select **Repository permissions**. Then select the following permissions for the app.
  
    | Resource | Permissions |
    | --- | --- |
    | Issues | Read and write |
    | Metadata | Read-only |
    | Webhook | Read and write |

1. Under **Where can this GitHub App be installed?**, select **Only on this account** or **Any account**.

1. Select **Create GitHub App**.

    :::image type="content" source="./media/add-copilot-code-insights/permissions.png" alt-text="Screenshot that shows available permissions and the button for creating a GitHub app." lightbox="./media/add-copilot-code-insights/permissions.png":::

### Install the GitHub app in your repository

1. Go to the GitHub app that you created.

1. Select **Install App**.

1. Select an account, and then select **Install**. Use the account that contains the repository for creating issues and uploading code scan reports.

    :::image type="content" source="./media/add-copilot-code-insights/select-repository.png" alt-text="Screenshot that shows how to select an account for app installation." lightbox="./media/add-copilot-code-insights/select-repository.png":::

1. Select **Only select repositories**, and then select the appropriate repositories from **Select repositories**. You can select multiple repositories. When you finish, select **Install**.

    :::image type="content" source="./media/add-copilot-code-insights/install.png" alt-text="Screenshot that shows how to install a selected repository." lightbox="./media/add-copilot-code-insights/install.png":::

1. After the installation finishes, note the browser URL that contains the installation ID. For example: `https://github.com/settings/installations/<installationID>`.

#### Get GitHub app details and the private key to create a GitHub connection

Collect the following GitHub app details and private key, and create a GitHub connection in Azure Migrate.

1. Go to the GitHub app that you created and select **Edit**.

1. Under **General** > **About**, find the **App ID** value and note it.

1. Scroll down to **Private keys** and select **Generate a private key**.

    > [!NOTE]
    > Rotate the private key every 90 days for security. If you generate a new private key, you must re-create the connection because updating the key isn't currently supported.

1. The new private key file is downloaded to your machine automatically.

1. To find the **Installation ID** value, go to **Install App** and select **Settings** next to the account where the app is installed.

1. After the installation finishes, note the browser URL that contains the installation ID. For example: `https://github.com/settings/installations/<installationID>`.

#### Request a code scan report for a web app and an application assessment by using a GitHub issue

1. Add a code assessment report by using any of these methods:

    - On the Azure Migrate **Overview** page, under **Explore inventory**, select **Web apps**.
    - On the Azure Migrate **Overview** page, under **Explore Applications**, select **Applications**.
    - On the Azure Migrate **Overview** page, under **Decide and Plan**, select **Assessments**. Choose the application assessment or web app assessment.
1. Under **Add code insights**, select **Using GitHub Copilot assessment**.

    :::image type="content" source="./media/add-copilot-code-insights/github-copilot-assessment.png" alt-text="Screenshot that shows how to add code insights by using a GitHub copilot assessment." lightbox="./media/add-copilot-code-insights/github-copilot-assessment.png":::

1. In the **Add code insights** pane, select **Create GitHub connection**.

1. In the **Create new GitHub connection** pane, provide the following details:

    | Field | Details |
    | --- | --- |
    | **Connection name** | Provide a name for the connection. This name appears in the list when you add a report to the web app. |
    | **GitHub repository URL** | Specify the GitHub repository for creating an issue to request a code scan report. Upload the code scan report to this issue by using GitHub Copilot. </br> </br> Use this repository only to create GitHub issues and read code scan reports from those issues. You don't need to include application code in this repository. |
    | **App ID** | Enter the app ID of the GitHub app that you created, to allow Azure Migrate access. |
    | **Private Key** | Copy all the contents of the private key file that you generated for your GitHub app. |
    | **Installation ID** | Enter the installation ID of the GitHub app installed on the repository that you specified earlier. |

1. After you add the details, select **Create connection**.

   :::image type="content" source="./media/add-copilot-code-insights/github-create-connections.png" alt-text="Screenshot that shows how to create a GitHub connection." lightbox="./media/add-copilot-code-insights/github-create-connections.png":::

1. Wait until the connection is successfully created, and then select **Close**.

1. On the **Add code insights** pane in the web app, in the list, select **Request report via GitHub**.

1. In the **Add insights via GitHub** pane, select the appropriate connection name, and then select **Request**.

    :::image type="content" source="./media/add-copilot-code-insights/request-report-via-github.png" alt-text="Screenshot that shows how to request a report via GitHub." lightbox="./media/add-copilot-code-insights/request-report-via-github.png":::

1. Azure Migrate creates a GitHub issue in the repository that you specified in the connection details.

1. When the code scan report is uploaded to the GitHub issue, Azure Migrate automatically maps the report to the web app and corresponding applications.

1. After the mapping is complete, the **Code changes** column on pages for applications and web apps shows **Available**. All assessments for the selected applications or web apps are marked as outdated. Select **Recalculate** to start recalculation.

1. On the page for the applications or web apps, select **Available** to view code insights. If code changes are included, the page displays the number of changes for the recommended Azure target.

#### Generate a code scan report by using the GitHub Copilot modernization extension

1. Generate a code scan report:

   - For .NET, follow the steps in [Assess and migrate a .NET project with GitHub Copilot modernization for .NET](/dotnet/azure/migration/appmod/quickstart).
   - For Java, follow the steps in [Assess and migrate a Java project using GitHub Copilot modernization](/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate).

1. Upload the report to a GitHub issue by using the prompt in GitHub Copilot.

## Troubleshoot

This section helps you resolve problems related to code insights in Azure Migrate.

### GitHub Copilot Modernize CLI

**Unable to generate a configuration file**: Select at least one web app or one application with web apps to generate code insights.

**Unable to generate a code assessment in the GitHub Copilot Modernize CLI**: Ensure that the installation is complete, you met the [prerequisites](/azure/developer/github-copilot-app-modernization/modernization-agent/quickstart), and the user has permissions to the source code repository.

**Unable to view code changes in Azure Migrate**: If you successfully generated code insights by using the Modernize CLI but you can't view code changes in Azure Migrate, follow these guidelines to view code changes:

- Ensure that code assessment is completed successfully for all web apps.
- Ensure that the user running the Modernize CLI has Decide and Plan Expert role permissions to the Azure Migrate project.
- Ensure that the relevant web apps are included in the downloaded configuration file.
- Ensure that the framework of web apps in the configuration file is the same as the mapped code repository.

### ZIP file

#### Failure to upload reports as a ZIP file

Follow these guidelines to successfully import paths and upload ZIP files without errors.

Upload a ZIP file that meets these requirements:

- It contains only JSON files.
- It's less than 50 MB. If it's uncompressed, it's less than 500 MB.
- It contains fewer than 100 files.
- It doesn't contain nested ZIP files.

Errors might appear if the uploaded ZIP file doesn't meet the required constraints. Here are some examples.

| Error | Reason |
| ----- | ----- |
| The uploaded blob content type `%Value;` isn't supported. | The uploaded file isn't a ZIP file. |
| Zip contains too many files (`%FileCount;`). Limit is `%MaxFileCount;`. | The ZIP file contains more than 100 files. |
| Total uncompressed size `%UncompressedSize;MB` of uploaded ZIP file exceeds limit of `%MaxUncompressedSize;MB`. | The uncompressed size of the ZIP file exceeds 500 MB. |
| Zip entry `%EntryName;` is invalid (possible path traversal). | A file name in the ZIP file contains path traversal characters such as `../../.*`. |
| The uploaded ZIP file is empty and contains no valid files. | The ZIP file doesn't contain any files. |

If you get any of these errors, remove the invalid or extra files and re-create the ZIP file before uploading it again.

#### Partial files or no files accepted for report generation

Even if the ZIP file meets all guidelines and is processed, the reports might not appear for every file in it. The reason can be JSON schema incompatibility or unsupported targets in the report file.

When this problem occurs, Azure Migrate uses content from valid files to generate the report. Files that fail validation return errors like the following examples.

| Error | Reason |
| ----- | ----- |
| The report content is invalid or not in the expected JSON format. | The JSON report schema is invalid or incompatible. |
| The report doesn't contain supported targets for the specified framework. | The report includes targets that Azure Migrate doesn't support. AppCAT supports many targets, but Azure Migrate supports only a subset. |

When you encounter these errors, regenerate the report with the correct configuration and upload it again by using a separate import flow.

## Related content

- [Create a web app assessment for modernization](review-web-app-assessment.md)
