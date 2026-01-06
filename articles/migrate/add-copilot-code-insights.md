---
title: Enhancing Web App Assessment With Code Scan Reports for Azure Migration
description: Learn how to install AppCat and run the quickstart to assess and migrate .NET and Java applications using Azure Migrate. Step-by-step guide included.
ms.topic: how-to
author: sudesai
ms.author: sudesai
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 10/23/2025
ms.custom: engagement-fy24
# Customer intent: As a cloud administrator, I want to upload AppCAT scan results as a zip to a web app assessment so that the assessment includes code-based migration insights.
---


#  Add GitHub Copilot Code insights to Web App Assessments (preview)

This article describes how to enhance web app assessments by adding code scan insights using GitHub Copilot assessment when modernizing applications for Azure Kubernetes Service (AKS) or Azure App Service. Adding code insights helps you better assess migration readiness and get recommendations for migration strategies based on the code changes identified during the scan.

In this article, you’ll learn how to: 

- Add code insights to Web app assessments  
- Generate a GitHub Copilot Assessment report using supported methods. 
- View updated assessment along with code insights. 

You can add code insights to web app assessment using either of the following two methods:  

- Upload using zip file.
- Request report through GitHub 

##  Manually upload code scan reports using a Zip File

With this approach, you must generate the code scan report manually and upload it as a .zip file. 

### Prerequisites

- Ensure a web app assessment exists for each required web app because code scan reports can only be added to an existing assessment.
- Have the GitHub Copilot Assessment report ready for web apps you want to update.

#### Generate GitHub Copilot Assessment report

To generate report, complete the following steps:

>[!Note]
>  To upload an assessment report as a ZIP file, use reports from GitHub Copilot App Modernization extension or AppCAT CLI.

**GitHub Copilot App Modernization extension**
1. Install [GitHub Copilot app modernization extension](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure) in Visual Studio Code.
2. Open the source code of your Web application from GitHub repository.
3. On the sidebar, select the GitHub Copilot app modernization pane, where you can select **Migrate to Azure** or **Run Assessment** in the **ASSESSMENT** section.
4. Upon completion of assessment, you can download **report.json** file at the location of your choice.
5. Create a .zip file for all the reports you want to add to assessment.

**AppCAT CLI**

1. Install AppCAT:
    - For .NET use the below command
    `dotnet tool install --global Microsoft.AppCAT.Tool` For detailed instructions, see [Install the .NET global tool](/dotnet/azure/migration/appcat/install#install-the-net-global-tool).
    - For guidance on assessing Java projects, see [Assess a Java project using AppCAT 7](/azure/migrate/appcat/appcat-7-quickstart?tabs=windows#download-and-install).
2. Generate AppCAT Reports
   - After installing AppCAT, generate reports for all assessed web apps: For .NET applications, use the .NET CLI to analyze applications. For more details, see [Analyze applications with the .NET CLI](/dotnet/azure/migration/appcat/dotnet-cli). 
    - For Java applications: To run AppCAT against a sample Java project, see [Run AppCAT against a sample Java project](/azure/migrate/appcat/appcat-7-quickstart?tabs=windows#run-appcat-against-a-sample-java-project).
3. Create a ZIP file for all the reports you want to add to assessment. 

### Upload a ZIP file 

1. On the Azure Migrate **Overview** page under **Decide and Plan** select **Assessments**.
2. Search for the assessment with the **Workloads** filter and select it. 
3. On the assessment **Overview** page, under **Add code insights** select **Using GitHub Copilot assessment**. 

:::image type="content" source="./media/add-copilot-code-insights/using-github-copilot-assessment.png" alt-text="The screenshot shows how to select using GitHub copilot assessment." lightbox="./media/add-copilot-code-insights/using-github-copilot-assessment.png":::

4. In the Add Code Insights page, select **Upload a zip file**.  

:::image type="content" source="./media/add-copilot-code-insights/upload-zip-file.png" alt-text="The screenshot shows how to upload a zip file." lightbox="./media/add-copilot-code-insights/upload-zip-file.png":::

5. Select **Browse**, and select the location of the ZIP file containing reports you want to import and then select **Upload**. Wait for the upload and validation to complete.

:::image type="content" source="./media/add-copilot-code-insights/add-code-insights.png" alt-text="The screenshot shows how to add code insights." lightbox="./media/add-copilot-code-insights/add-code-insights.png":::

6. In the Web app list, under the **GitHub Copilot assessment** report dropdown, view the uploaded reports under **Uploaded from ZIP file**. 

:::image type="content" source="./media/add-copilot-code-insights/upload-from-zip-file.png" alt-text="The screenshot shows how to upload from the zip file." lightbox="./media/add-copilot-code-insights/upload-from-zip-file.png":::

7. Select the appropriate report to map to the corresponding web app. Repeat these steps for all required web app.  
8. After mapping, select **Add** and wait for the process to complete.

:::image type="content" source="./media/add-copilot-code-insights/add.png" alt-text="The screenshot shows how to add web app." lightbox="./media/add-copilot-code-insights/add.png":::
 
9. After mapping is complete the assessment is marked as outdated. Select **Recalculate** to initiate recalculation.
10. After recalculation is complete, review the updated code insights.  

## Request report via GitHub

This method connects Azure Migrate to a GitHub repository using the provided connection details and automatically creates an issue in that repository. By using the GitHub Copilot app modernization extension, you can scan your code and upload reports directly to the related GitHub issue. After updating the issue, Azure Migrate automatically attaches the code scan reports to the associated web applications. This approach allows Cloud administrators and developers to collaborate while maintaining application code security boundaries. 

### Prerequisites

- Ensure a web app assessment exists for each web app because code scan reports can only be added to an existing assessment. 
- Provide information about the GitHub repository required for integration with Azure Migrate to allow automatic requests and synchronization of code scan reports. 
- Provide GitHub application details with permissions to create issues and read comments in the target repository. 

### Create new GitHub app 

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

### GitHub App details and Private key to create GitHub connection

Collate the following GitHub App details and private key to create a GitHub connection in Azure Migrate.

1. Navigate to the GitHub App you created and select **Edit**. 
2. Under **General** > **About**, find the **App ID** and note it. 
3. Scroll down to **Private keys** and select **Generate a private key**. 
 
 >[!Note]
 > Rotate the private key every 90 days for security. If you generate a new private key, you must recreate the connection because updating the key isn’t currently supported.

4. The new private key file downloads automatically to your machine. 
5. To find the **Installation ID**, navigate to **Install App** and select **Settings** next to  the account where the app is installed.  
6. After the installation completes, note the browser URL that contains the installation ID. For example, `https://github.com/settings/installations/<installationID>`

### Request code scan report to web app assessment using GitHub

1. Select **Assessments** on the Azure Migrate project **Overview** page under **Decide and Plan**.
2. Search for the assessment with the **Workloads** filter and select it. 
3. On the assessment **Overview** page.   
4. Under **Add code insights** select **Using GitHub Copilot Assessment**. 

:::image type="content" source="./media/add-copilot-code-insights/github-copilot-assessment.png" alt-text="The screenshot shows how to add code insights by using GitHub copilot assessment." lightbox="./media/add-copilot-code-insights/github-copilot-assessment.png":::

5. In the **Add code insights** page, select **Create GitHub** connection. 

:::image type="content" source="./media/add-copilot-code-insights/github-create-connections.png" alt-text="The screenshot shows how to create GitHub connections." lightbox="./media/add-copilot-code-insights/github-create-connections.png":::

6. In the **Create new GitHub** connection page, provide the following details: 

| Field  | Details  | 
| --- | --- | 
| Connection name  | Provide a name for the connection. This name appears in the list when you add report to the web app.  |    
| GitHub repository URL   |Specify the GitHub repository for creating an issue to request a code scan report. Upload the code scan report to this issue using GitHub Copilot.  </br> </br> Use this repository only to create GitHub issues and read code scan reports from those issues. You don't need to include application code in this repository.  | 
| App ID  | Enter the App ID of the GitHub App you created to allow Azure Migrate access. | 
| Private Key  | Copy all the contents of the private key file you generated for your GitHub App.  |
| Installation ID  | Enter the Installation ID of the GitHub App installed on the repository you specified above.  |

7. After you add the details, select **Create** connection. Wait until the connection is successfully created and then select **Close**.
8. On the **Add code insight** page in the web app, from the list, select **Request report via GitHub**. 
9. In the **Request report via GitHub** page, select the appropriate connection name and then select **Request**.  

:::image type="content" source="./media/add-copilot-code-insights/request-report-via-github.png" alt-text="The screenshot shows how to request report via GitHub." lightbox="./media/add-copilot-code-insights/request-report-via-github.png":::

10. Azure Migrate creates GitHub issue in the repository specified in the connection details. 
11. When the code scan report is uploaded to the GitHub issue, Azure Migrate automatically maps the report to the web app. 
12. After the report is mapped, the assessment is marked as outdated. 
13. Recalculate the assessment to view enhanced results with code insights. 

### Generate code scan report using GitHub Copilot app modernization extension

To generate report, follow the steps:

1. To generate report for .NET follow these steps [Assess and migrate a .NET project with GitHub Copilot app modernization for .NET](/dotnet/azure/migration/appmod/quickstart). 
1. To generate code scan report for Java, follow these steps [Assess a Java project using GitHub Copilot app modernization](/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate). 
1. Once the report is available, upload the report to GitHub issue using below prompt in GitHub Copilot. 
1. upload assessment report to [GitHub Issue URL]  

### View code insights after adding code scan reports

1. Select **Assessments** on the Azure Migrate project **Overview** page under **Decide and Plan**.
1. Search for the assessment with the **Workloads** filter and select it. 
1. On the assessment **Overview** page, select the **Recommended path** tab or **View details** in the recommended path report.  
    This screen displays the distribution of web apps across Azure targets. Select a line item to drill down further.  
1. This screen displays the distribution of the web apps across the Azure targets. Select a line item to drill down further. 
1. Select **View code** changes under **Code** insights.
Review the code changes by selecting the relevant tab: **Issues, Warnings**, or **Information**. These tabs provide a summarized view of code changes across the web apps in the assessment.
1. Select the number in the **Code** changes column for the respective web app to view its changes. 

After you add code scan reports, the readiness and migration strategy for the relevant web app might change based on the identified code changes. If the required code changes required are significant, the webapp's readiness might update from **Ready** to **Ready with conditions**.  

## Troubleshooting 

This section helps resolve issues related to importing paths or uploading zip files that don’t meet the required constraints.

### Upload using Zip file

1. When failed to upload reports as zip file: Follow these guidelines to successfully import paths and upload zip files without errors.

**Unable only Zip files that meet these requirements**:

 - Contains only JSON files.
 - Zip file is less than 50 MB. 
 - Total number of files in zip file is less than 100. 
 - Maximum size of uncompressed zip file is less than 500 MB.
 - Zip file doesn't contain another nested zip file(s).

  You might see errors if the uploaded zip file doesn’t meet the required constraints. Here are some examples:
 
 - The uploaded blob content type '%Value;' isn't supported. - *Occurs when the uploaded file is not a zip file*. 
 - Zip contains too many files (%FileCount;). Limit is %MaxFileCount;. - *Occurs when the zip file contains more than 100 files*. 
 - Total uncompressed size %UncompressedSize; MB of uploaded zip file exceeds limit of %MaxUncompressedSize;MB. - *Occurs when the uncompressed size of the zip file exceeds 500 MB*.
 - Zip entry '%EntryName;' is invalid (possible path traversal). - *Occurs when a file name in the zip contains path traversal characters such as ../../.*  
 - The uploaded zip file is empty and contains no valid files. - *Occurs when the zip file does not contain any files.*

If you see any of these errors, remove the invalid or extra files and recreate the zip file before uploading it again.

2. **Partial files or No files accepted for report generation**: Even if the zip file meets all guidelines and is processed, you might not see the reports for every file in the zip. This can happen due to issues such as JSON schema incompatibility or unsupported targets in the report file.
When this occurs, Azure Migrate uses content from valid files to generate the report. Files that fail validation return errors like:

 - The report content is invalid or not in the expected JSON format. - Occurs when the JSON report schema is invalid or incompatible. 
 - The report doesn't contain supported targets for the specified framework. - Occurs when the report includes targets that Azure Migrate doesn't support. AppCAT supports many targets, but Azure Migrate only supports a subset.

When you encounter these errors, regenerate the report with the correct configuration and upload it again using a separate import flow.

## Next steps

Learn more about [create a web app assessment](review-web-app-assessment.md).
