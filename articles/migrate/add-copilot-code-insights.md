---
title: Add code insights using GitHub Copilot modernization
description: Learn how to add code insights using GitHub Copilot modernization and get more accurate modernization strategy
ms.topic: how-to
author: sudesai
ms.author: sudesai
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 10/23/2025
ms.custom: engagement-fy24
# Customer intent: As a cloud administrator, I want to add code insights using GitHub Copilot Modernization and improve assessments.
---


#  Add code insights using GitHub Copilot Modernization (preview)

This article describes how to add code insights using GitHub Copilot modernization when migrating applications to Azure services. Adding code insights helps you better assess migration readiness and get recommendations for migration strategies based on the code changes identified during the scan. Code insights for web apps provide changes required to modernize them to Azure Kubernetes Service (AKS) and Azure App Service.  Code changes for an application are aggregate of code changes for its child web apps.

In this article, you learn how to: 

- Generate GitHub Copilot code assessment report for web apps.
- Add code insights for Web apps from Applications inventory and assessment pages.
- Add code insights for Web apps from Web apps inventory and assessment pages.
- View code insights.

You can add code insights using any of the following three methods:  

- **Using GitHub Copilot Modernize CLI** - Use this method to run at scale assessment for multiple web apps simultaneously, with automated report upload to Azure Migrate. This approach allows Cloud administrators and Application developers to collaborate while adhering to their organization’s code security guidelines. 
- **Upload using ZIP file** - Use this method when you already have a code scan report or have permissions to generate one. It requires manual mapping of reports to each web app.
- **Request report through GitHub issue** - Use this method when you can't generate code insights report yourself or don't have access to code repository. 

> [!NOTE]
> Code insights are currently not supported through Private endpoints.

## Run at-scale code assessments using Modernize CLI

This method enables at-scale code assessment for multiple Applications and Web apps, with source code spread across multiple repositories. You must download a configuration file from Azure Migrate that contains details of all the web apps, update the web app–to–repository mapping, and run it using GitHub Copilot Modernize CLI. Code changes are automatically mapped back to Azure Migrate for the corresponding Web apps and Applications. 

**Prerequisites for Azure Migrate user**
- An Azure Migrate project with successful discovery of Applications and Web apps.
- Supported for .NET and Java web apps
- Code insights are supported for Azure App Service and Azure Kubernetes Service.

**Prerequisites for GitHub Copilot Modernize CLI user**
- A GitHub Copilot Free, Pro, Pro+, Business, or Enterprise license.
- Install Az CLI and GitHub CLI and login to Azure and GitHub Copilot.
- [Decide and Plan expert role](/azure/migrate/prepare-azure-accounts) or higher privileges to Azure Migrate project.

For detailed installation steps, see Modernize CLI [instructions](/azure/developer/github-copilot-app-modernization/modernization-agent/quickstart). 

**Download configuration file from Azure Migrate**
1. You can generate configuration file from any of the following pages:
    - On Azure Migrate **Overview** page, under **Explore Applications**, select **Applications**.
    - On Azure Migrate **Overview** page, under **Explore inventory**, select **Web apps**.
    - On Azure Migrate **Overview** page, under **Decide and Plan**, select **Assessments**. Choose the relevant Application assessment or Web app assessment.
2. Select the Applications or Web apps for which you want to add code insights. Select **Add code insights**, and then choose **GitHub Copilot modernization** from the dropdown.
3. By default, **At scale code assessment with automatic report upload** is selected to add code changes using GitHub Copilot Modernize CLI.
4. Review the list of web apps. You can remove the web apps for which code insights are not required.
5. Select **Download configuration file** to generate a JSON file containing details of all the web apps to be assessed and placeholders to add repository information. It might take few seconds for download to complete.

**Run configuration file in Modernize CLI**
1. Before running the configuration file in Modernize CLI, you must update the file with code repository name and path for each web app. There are two sections in the file - one for `apps` and other for `repos`.
2. In `apps` section, review the Web app name, hosting server, parent Application and Framework version.
3. In `apps` section, in `repos` property, replace `<sample-git-repo>` and `<sample-local-repo>` with name of repository associated with that web app. You can mention names of multiple GitHub repositories and local paths.
4. In `repos` section, update the same repository names as described in the previous step. Then replace `<https://github.com/<sample-org>/<sample-repo>.git>` with the path to GitHub repository. The branch field is optional. If the repository is stored locally, replace `</absolute/path/to/project>` with path details.
5. Repeat the above steps for all web apps in the configuration file.
6. Launch GitHub Copilot Modernize CLI, authenticate to GitHub Copilot and Azure using `gh auth login` and `az login`. Ensure that the user running Modernize CLI has the Decide and Plan expert role assigned for the Azure Migrate project.
7. Run `modernize assess --source <local path to configuration file>`. It might take few minutes for code assessment to complete.  
8. After a successful code assessment, reports are automatically pushed to Azure Migrate. This is indicated through the message `Distribution complete: m/n app(s) distributed`.
9. Code changes are automatically updated for the selected Applications and Webapps in Azure Migrate.

## View code insights
1. To view code insights for Applications, go to **Explore Applications** > **Applications** page and select **Available** under code changes column.
2. To view code insights for Web apps, go to **Explore inventory** > **Webapps** page and select **Available** under code changes column.
3. If assessment is already created for the Applications or Web apps for which code insights have been added, it will get outdated. Recalculate assessment to view code insights. You can find code changes under **View details** for each assessment.
4. Review the code changes by selecting the relevant tab: **Issues, Warnings**, or **Information**. These tabs provide a summarized view of code changes across the web apps in the assessment.
5. If assessment is already created, code changes would be presented only for the recommended target, and readiness and migration strategy might change. If the required code changes are significant, readiness might change from **Ready** to **Ready with conditions**. 

##  Manually upload code scan reports using a ZIP File

With this approach, you must first generate a code scan report manually and upload it as a ZIP file to Azure Migrate. 

**Prerequisites**

- Web apps for which code scan report is to be generated.
- GitHub Copilot code assessment report for selected web apps.

**Generate GitHub Copilot code assessment report**

You can generate code assessment report using GitHub Copilot app Modernization extension or AppCAT CLI.

*GitHub Copilot App Modernization extension*
1. Install [GitHub Copilot app modernization extension](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure) in Visual Studio Code.
2. Open the source code of your Web app from GitHub repository. You must have permissions to the code repository.
3. On the sidebar, select the GitHub Copilot app modernization pane, where you can select **Migrate to Azure** or **Run Assessment** in the **ASSESSMENT** section.
4. Upon completion of assessment, you can download **report.json** file at the location of your choice.
5. Create a ZIP file for all the reports you want to add.

*AppCAT CLI*

1. Install AppCAT:
    - For .NET use the command:
    `dotnet tool install --global Microsoft.AppCAT.Tool` For detailed instructions, see [Install the .NET global tool](/dotnet/azure/migration/appcat/install#install-the-net-global-tool).
    - For guidance on assessing Java projects, see [Assess a Java project using AppCAT 7](/azure/migrate/appcat/appcat-7-quickstart?tabs=windows#download-and-install).
2. Generate AppCAT Reports
   - After installing AppCAT, generate reports for all assessed web apps: For .NET applications, use the .NET CLI to analyze applications. For more details, see [Analyze applications with the .NET CLI](/dotnet/azure/migration/appcat/dotnet-cli). 
    - For Java applications: To run AppCAT against a sample Java project, see [Run AppCAT against a sample Java project](/azure/migrate/appcat/appcat-7-quickstart?tabs=windows#run-appcat-against-a-sample-java-project).
3. Create a ZIP file for all the reports you want to add.

**Upload a ZIP file**

1. You can add code assessment report from any of the following:
    - On the Azure Migrate **Overview** page, under **Explore inventory**, select **Web apps**.
    - On the Azure Migrate **Overview** page, under **Explore Applications**, select **Applications**.
    - On the Azure Migrate **Overview** page, under **Decide and Plan**, select **Assessments**. Choose the Application assessment or Web app assessment. 
2. In **Add code insights** dropdown, select **GitHub Copilot assessment**. 

:::image type="content" source="./media/add-copilot-code-insights/using-github-copilot-assessment.png" alt-text="The screenshot shows how to select using GitHub copilot assessment." lightbox="./media/add-copilot-code-insights/using-github-copilot-assessment.png":::

3. In the Add Code Insights page, select **Upload a ZIP file**.  

:::image type="content" source="./media/add-copilot-code-insights/upload-ZIP-file.png" alt-text="The screenshot shows how to upload a ZIP file." lightbox="./media/add-copilot-code-insights/upload-ZIP-file.png":::

4. Select **Browse**. Select the location of the ZIP file that contains the reports to import, and then select **Upload**. Wait for the upload and validation to complete.

:::image type="content" source="./media/add-copilot-code-insights/add-code-insights.png" alt-text="The screenshot shows how to add code insights." lightbox="./media/add-copilot-code-insights/add-code-insights.png":::

5. In the Web app list, under the **GitHub Copilot assessment** report dropdown, view the uploaded reports under **Uploaded from ZIP file**. 

:::image type="content" source="./media/add-copilot-code-insights/upload-from-ZIP-file.png" alt-text="The screenshot shows how to upload from the ZIP file." lightbox="./media/add-copilot-code-insights/upload-from-ZIP-file.png":::

6. Select the appropriate report to map to the corresponding web app. Repeat these steps for all required web app.  
7. After mapping, select **Add** and wait for the process to complete.

:::image type="content" source="./media/add-copilot-code-insights/add.png" alt-text="The screenshot shows how to add web app." lightbox="./media/add-copilot-code-insights/add.png":::
 
8. After mapping is complete, Code changes column in Applications and Web apps pages shows **Available**. All assessments for the selected web apps or application are marked as outdated. Select **Recalculate** to initiate recalculation.
9. Select **Available** on the Applications or Web apps page to view code insights. If code changes are included, the number of changes for the recommended Azure target are displayed.

## Request report via GitHub

This method connects Azure Migrate to a GitHub repository using the provided connection details and automatically creates an issue in that repository. By using the GitHub Copilot app modernization extension, you can scan your code and upload reports directly to the related GitHub issue. After updating the issue, Azure Migrate automatically attaches the code scan reports to the associated web applications. This approach allows Cloud administrators and developers to collaborate while maintaining application code security boundaries. 

**Prerequisites**

- Ensure that a web app assessment exists for each web app because code scan reports can only be added to an existing assessment. 
- Provide information about the GitHub repository required for integration with Azure Migrate to allow automatic requests and synchronization of code scan reports. 
- Provide GitHub application details with permissions to create issues and read comments in the target repository. 

**Create new GitHub app**

Create a new **GitHub App** by following these steps:

1. In the top right corner of **GitHub** page, select your **profile picture**. 
1. Navigate to your account settings. 
    - For an app owned by a personal account, select **Settings**. 
      - Select **Your organization** and then **Settings** from right of the organization. 
    - For an app owned by an enterprise:  
      - If you use **Enterprise Managed Users**, select **Your enterprise** to go directly to the enterprise account settings. 
      - If you use personal accounts, select **Your enterprises** then select to **Settings** from the right of the enterprise. 
1. Navigate to the **GitHub App** settings. 
    - For an app owned by a personal account or organization:
      - In the left sidebar, select **Developer settings**, and then select **GitHub Apps**. 
    - For an app owned by an enterprise
      - In the left sidebar, under **Settings**, select **GitHub Apps**, and then select **New GitHub App**. 
    
:::image type="content" source="./media/add-copilot-code-insights/new-github-app.png" alt-text="The screenshot shows how to select the new GitHub app." lightbox="./media/add-copilot-code-insights/new-github-app.png":::

4. Provide the following details to set up your new GitHub App: 
5. Under **GitHub App name**, enter a name for your app.  
6. Under **Homepage URL**, provide the complete URL. This URL serves as a placeholder and isn't used in this process. 
  
:::image type="content" source="./media/add-copilot-code-insights/register-new-github.png" alt-text="The screenshot shows the homepage url." lightbox="./media/add-copilot-code-insights/register-new-github.png":::

7. Ensure that **Expire user authorization tokens** is selected.  
8. Deselect **Active** under **Webhook** 
  
:::image type="content" source="./media/add-copilot-code-insights/active-webhook.png" alt-text="The screenshot shows how to deselect the active webhook." lightbox="./media/add-copilot-code-insights/active-webhook.png":::

9. Under **Permissions**, select **Repository permissions** and then select the following permissions for the app. 
  
  | Resource  | Permissions  | 
  | --- | --- | 
  | Issues  | Read and write  | 
  | Metadata  | Read-only  |
  | Webhook   | Read and write  |

10. Under **Where can this GitHub App be installed?**, select **Only on this account** or **Any account**. 
  
:::image type="content" source="./media/add-copilot-code-insights/permissions.png" alt-text="The screenshot shows the available permissions." lightbox="./media/add-copilot-code-insights/permissions.png":::
    
11. Select **Create GitHub App**. 

### Install GitHub app on the repository

Follow these steps to install GitHub App on your repository:

1. Navigate to the **GitHub App** you created. 
2. Select **Install App** 
3. Select an account to install the app, and then select **Install**. Use the account that contains the repository for creating issues and uploading code scan reports. 

:::image type="content" source="./media/add-copilot-code-insights/select-repository.png" alt-text="The screenshot shows how to select appropriate repository." lightbox="./media/add-copilot-code-insights/select-repository.png":::

4. Select **Only select repositories**, then select the appropriate repositories from **Select repositories**. You can select multiple repositories. When finished, select **Install**.

    :::image type="content" source="./media/add-copilot-code-insights/install.png" alt-text="The screenshot shows how to install the selected repository." lightbox="./media/add-copilot-code-insights/install.png":::

5. After the installation completes, note the browser URL that contains the installation ID. For example: `https://github.com/settings/installations/<installationID>`

**GitHub App details and Private key to create GitHub connection**

Collate the following GitHub App details and private key and create a GitHub connection in Azure Migrate.

1. Navigate to the GitHub App you created and select **Edit**. 
2. Under **General** > **About**, find the **App ID** and note it. 
3. Scroll down to **Private keys** and select **Generate a private key**. 
 
 >[!Note]
 > Rotate the private key every 90 days for security. If you generate a new private key, you must recreate the connection because updating the key isn’t currently supported.

4. The new private key file downloads automatically to your machine. 
5. To find the **Installation ID**, navigate to **Install App** and select **Settings** next to  the account where the app is installed.  
6. After the installation completes, note the browser URL that contains the installation ID. For example, `https://github.com/settings/installations/<installationID>`

**Request code scan report for web app and application assessment using GitHub issue**

1. You can add code assessment report from any of the following:
    - On the Azure Migrate **Overview** page under **Explore inventory**, select **Web apps**.
    - On the Azure Migrate **Overview** page under **Explore Applications**, select **Applications**.
    - On the Azure Migrate **Overview** page under **Decide and Plan**, select **Assessments**. Choose the Application assessment or Web app assessment. 
2. Under **Add code insights**, select **Using GitHub Copilot Assessment**. 

:::image type="content" source="./media/add-copilot-code-insights/github-copilot-assessment.png" alt-text="The screenshot shows how to add code insights by using GitHub copilot assessment." lightbox="./media/add-copilot-code-insights/github-copilot-assessment.png":::

3. In the **Add code insights** page, select **Create GitHub** connection. 

:::image type="content" source="./media/add-copilot-code-insights/github-create-connections.png" alt-text="The screenshot shows how to create GitHub connections." lightbox="./media/add-copilot-code-insights/github-create-connections.png":::

4. In the **Create new GitHub** connection page, provide the following details: 

| Field  | Details  | 
| --- | --- | 
| Connection name  | Provide a name for the connection. This name appears in the list when you add report to the web app.  |    
| GitHub repository URL   |Specify the GitHub repository for creating an issue to request a code scan report. Upload the code scan report to this issue using GitHub Copilot.  </br> </br> Use this repository only to create GitHub issues and read code scan reports from those issues. You don't need to include application code in this repository.  | 
| App ID  | Enter the App ID of the GitHub App you created to allow Azure Migrate access. | 
| Private Key  | Copy all the contents of the private key file you generated for your GitHub App.  |
| Installation ID  | Enter the Installation ID of the GitHub App installed on the repository you specified above.  |

5. After you add the details, select **Create** connection. Wait until the connection is successfully created and then select **Close**.
6. On the **Add code insight** page in the web app, from the list, select **Request report via GitHub**. 
7. In the **Request report via GitHub** page, select the appropriate connection name and then select **Request**.  

:::image type="content" source="./media/add-copilot-code-insights/request-report-via-github.png" alt-text="The screenshot shows how to request report via GitHub." lightbox="./media/add-copilot-code-insights/request-report-via-github.png":::

8. Azure Migrate creates GitHub issue in the repository specified in the connection details. 
9. When the code scan report is uploaded to the GitHub issue, Azure Migrate automatically maps the report to the web app and corresponding Applications.
10. After mapping is complete, Code changes column in Applications and Web apps pages shows **Available**. All assessments for the selected web apps or application are marked as outdated. Select **Recalculate** to initiate recalculation.
9. Select **Available** on the Applications or Web apps page to view code insights. If code changes are included, the number of changes for the recommended Azure target are displayed.

**Generate code scan report using GitHub Copilot app modernization extension**

To generate report, follow the steps:

1. To generate report for .NET follow these steps [Assess and migrate a .NET project with GitHub Copilot app modernization for .NET](/dotnet/azure/migration/appmod/quickstart). 
1. To generate code scan report for Java, follow these steps [Assess a Java project using GitHub Copilot app modernization](/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate). 
1. Once the report is available, upload the report to GitHub issue using below prompt in GitHub Copilot. 
1. upload assessment report to [GitHub Issue URL]  

## Troubleshooting 

This section helps resolve issues related to code insights in Azure Migrate.

#### Using GitHub Copilot Modernize CLI

**Unable to generate configuration file**
*Mitigation*: Select atleast one Web app or Applications with web apps to generate code insights. 

**Unable to generate code assessment in GitHub Copilot Modernize CLI**
*Mitigation*: Ensure that the installation is complete and [pre-requisites](/azure/developer/github-copilot-app-modernization/modernization-agent/quickstart) are met, and user has permissions to the source code repository.

**Unable to view code changes in Azure Migrate**
If code insights were generated successfully using Modernize CLI and you are unable to view code changes in Azure Migrate, follow the guidelines to view code changes:
1. Ensure that code assessment is completed successfully for all web apps.
2. Ensure that the user running Modernize CLI has Decide and Plan expert role permissions to the Azure Migrate project.
3. Ensure that the relevant webapps are included in downloaded configuration file.
4. Ensure that the framework of web apps in configuration file is same as the mapped code repository.

#### Upload using Zip file

1. When failed to upload reports as ZIP file: Follow these guidelines to successfully import paths and upload ZIP files without errors.

**Upload Zip files that meet these requirements**:

 - Contains only JSON files.
 - Zip file is less than 50 MB. 
 - Total number of files in ZIP file is less than 100. 
 - Maximum size of uncompressed ZIP file is less than 500 MB.
 - Zip file doesn't contain another nested ZIP files.

  You might see errors if the uploaded ZIP file doesn’t meet the required constraints. Here are some examples:
 
 - The uploaded blob content type '%Value;' isn't supported. - *Occurs when the uploaded file is not a ZIP file*. 
 - Zip contains too many files (%FileCount;). Limit is %MaxFileCount;. - *Occurs when the ZIP file contains more than 100 files*. 
 - Total uncompressed size %UncompressedSize; MB of uploaded ZIP file exceeds limit of %MaxUncompressedSize;MB. - *Occurs when the uncompressed size of the ZIP file exceeds 500 MB*.
 - Zip entry '%EntryName;' is invalid (possible path traversal). - *Occurs when a file name in the ZIP contains path traversal characters such as ../../.*  
 - The uploaded ZIP file is empty and contains no valid files. - *Occurs when the ZIP file does not contain any files.*

If you see any of these errors, remove the invalid or extra files and recreate the ZIP file before uploading it again.

2. **Partial files or No files accepted for report generation**: Even if the ZIP file meets all guidelines and is processed, you might not see the reports for every file in the ZIP. This can happen due to issues such as JSON schema incompatibility or unsupported targets in the report file.
When this occurs, Azure Migrate uses content from valid files to generate the report. Files that fail validation return errors like:

 - The report content is invalid or not in the expected JSON format. - Occurs when the JSON report schema is invalid or incompatible. 
 - The report doesn't contain supported targets for the specified framework. - Occurs when the report includes targets that Azure Migrate doesn't support. AppCAT supports many targets, but Azure Migrate only supports a subset.

When you encounter these errors, regenerate the report with the correct configuration and upload it again using a separate import flow.

## Next steps

Learn more about [create a web app assessment](review-web-app-assessment.md).
