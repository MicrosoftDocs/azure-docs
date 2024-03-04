---
title: "Google Workspace (G Suite) (using Azure Functions) connector for Microsoft Sentinel"
description: "Learn how to install the connector Google Workspace (G Suite) (using Azure Functions) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Google Workspace (G Suite) (using Azure Functions) connector for Microsoft Sentinel

The [Google Workspace](https://workspace.google.com/) data connector provides the capability to ingest Google Workspace Activity events into Microsoft Sentinel through the REST API. The connector provides ability to get [events](https://developers.google.com/admin-sdk/reports/v1/reference/activities) which helps to examine potential security risks, analyze your team's use of collaboration, diagnose configuration problems, track who signs in and when, analyze administrator activity, understand how users create and share content, and more review events in your org.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Azure function app code** | https://aka.ms/sentinel-GWorkspaceReportsAPI-functionapp |
| **Log Analytics table(s)** | GWorkspace_ReportsAPI_admin_CL<br/> GWorkspace_ReportsAPI_calendar_CL<br/> GWorkspace_ReportsAPI_drive_CL<br/> GWorkspace_ReportsAPI_login_CL<br/> GWorkspace_ReportsAPI_mobile_CL<br/> GWorkspace_ReportsAPI_token_CL<br/> GWorkspace_ReportsAPI_user_accounts_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**Google Workspace Events - All Activities**
   ```kusto
GWorkspaceActivityReports
 
   | sort by TimeGenerated desc
   ```

**Google Workspace Events - Admin Activity**
   ```kusto
GWorkspace_ReportsAPI_admin_CL
 
   | sort by TimeGenerated desc
   ```

**Google Workspace Events - Calendar Activity**
   ```kusto
GWorkspace_ReportsAPI_calendar_CL
 
   | sort by TimeGenerated desc
   ```

**Google Workspace Events - Drive Activity**
   ```kusto
GWorkspace_ReportsAPI_drive_CL
 
   | sort by TimeGenerated desc
   ```

**Google Workspace Events - Login Activity**
   ```kusto
GWorkspace_ReportsAPI_login_CL
 
   | sort by TimeGenerated desc
   ```

**Google Workspace Events - Mobile Activity**
   ```kusto
GWorkspace_ReportsAPI_mobile_CL
 
   | sort by TimeGenerated desc
   ```

**Google Workspace Events - Token Activity**
   ```kusto
GWorkspace_ReportsAPI_token_CL
 
   | sort by TimeGenerated desc
   ```

**Google Workspace Events - User Accounts Activity**
   ```kusto
GWorkspace_ReportsAPI_user_accounts_CL
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Google Workspace (G Suite) (using Azure Functions) make sure you have: 

- **Microsoft.Web/sites permissions**: Read and write permissions to Azure Functions to create a Function App is required. [See the documentation to learn more about Azure Functions](/azure/azure-functions/).
- **REST API Credentials/permissions**: **GooglePickleString** is required for REST API. [See the documentation to learn more about API](https://developers.google.com/admin-sdk/reports/v1/reference/activities). Please find the instructions to obtain the credentials in the configuration section below. You can check all [requirements and follow the instructions](https://developers.google.com/admin-sdk/reports/v1/quickstart/python) from here as well.


## Vendor installation instructions


> [!NOTE]
   >  This connector uses Azure Functions to connect to the Google Reports API to pull its logs into Microsoft Sentinel. This might result in additional data ingestion costs. Check the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) for details.


>**(Optional Step)** Securely store workspace and API authorization key(s) or token(s) in Azure Key Vault. Azure Key Vault provides a secure mechanism to store and retrieve key values. [Follow these instructions](/azure/app-service/app-service-key-vault-references) to use Azure Key Vault with an Azure Function App.


**NOTE:** This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias GWorkspaceReports and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/GoogleWorkspaceReports/Parsers/GWorkspaceActivityReports), on the second line of the query, enter the hostname(s) of your GWorkspaceReports device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.


**STEP 1 - Ensure the prerequisites to obtain the Google Pickel String**




1. [Python 3 or above](https://www.python.org/downloads/) is installed.
2. The [pip package management tool](https://www.geeksforgeeks.org/download-and-install-pip-latest-version/) is available.
3. A Google Workspace domain with [API access enabled](https://support.google.com/a/answer/7281227?visit_id=637889155425319296-3895555646&rd=1).
4. A Google account in that domain with administrator privileges.


**STEP 2 - Configuration steps for the Google Reports API**

1. Login to Google cloud console with your Workspace Admin credentials https://console.cloud.google.com.
2. Using the search option (available at the top middle), Search for ***APIs & Services***
3. From ***APIs & Services*** -> ***Enabled APIs & Services***, enable **Admin SDK API** for this project.
 4. Go to ***APIs & Services*** -> ***OAuth Consent Screen***. If not already configured, create a OAuth Consent Screen with the following steps:
	 1. Provide App Name and other mandatory information.
	 2. Add authorized domains with API Access Enabled.
	 3. In Scopes section, add **Admin SDK API** scope.
	 4. In Test Users section, make sure the domain admin account is added.
 5. Go to ***APIs & Services*** -> ***Credentials*** and create OAuth 2.0 Client ID
	 1. Click on Create Credentials on the top and select Oauth client Id.
	 2. Select Web Application from the Application Type drop down.
	 3. Provide a suitable name to the Web App and add http://localhost:8081/ as one of the Authorized redirect URIs.
	 4. Once you click Create, download the JSON from the pop-up that appears. Rename this file to "**credentials.json**".
 6. To fetch Google Pickel String, run the [python script](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/GoogleWorkspaceReports/Data%20Connectors/get_google_pickle_string.py) from the same folder where credentials.json is saved.
	 1. When popped up for sign-in, use the domain admin account credentials to login.
>**Note:** This script is supported only on Windows operating system.
 7. From the output of the previous step, copy Google Pickle String (contained within single quotation marks) and keep it handy. It will be needed on Function App deployment step.


**STEP 3 - Choose ONE from the following two deployment options to deploy the connector and the associated Azure Function**

>**IMPORTANT:** Before deploying the Workspace data connector, have the Workspace ID and Workspace Primary Key (can be copied from the following), as well as the Workspace GooglePickleString readily available.



Option 1 - Azure Resource Manager (ARM) Template

Use this method for automated deployment of the Google Workspace data connector using an ARM Template.

1. Click the **Deploy to Azure** button below. 

	[![Deploy To Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/sentinelgworkspaceazuredeploy)
2. Select the preferred **Subscription**, **Resource Group** and **Location**. 
3. Enter the **Workspace ID**, **Workspace Key**, **GooglePickleString** and deploy. 
4. Mark the checkbox labeled **I agree to the terms and conditions stated above**. 
5. Click **Purchase** to deploy.

Option 2 - Manual Deployment of Azure Functions

Use the following step-by-step instructions to deploy the Google Workspace data connector manually with Azure Functions (Deployment via Visual Studio Code).


**1. Deploy a Function App**

> **NOTE:** You will need to [prepare VS code](/azure/azure-functions/functions-create-first-function-python#prerequisites) for Azure function development.

1. Download the [Azure Function App](https://aka.ms/sentinel-GWorkspaceReportsAPI-functionapp) file. Extract archive to your local development computer.
2. Start VS Code. Choose File in the main menu and select Open Folder.
3. Select the top level folder from extracted files.
4. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app** button.
If you aren't already signed in, choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure**
If you're already signed in, go to the next step.
5. Provide the following information at the prompts:

	a. **Select folder:** Choose a folder from your workspace or browse to one that contains your function app.

	b. **Select Subscription:** Choose the subscription to use.

	c. Select **Create new Function App in Azure** (Don't choose the Advanced option)

	d. **Enter a globally unique name for the function app:** Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions. (e.g. GWorkspaceXXXXX).

	e. **Select a runtime:** Choose Python 3.8.

	f. Select a location for new resources. For better performance and lower costs choose the same [region](https://azure.microsoft.com/regions/) where Microsoft Sentinel is located.

6. Deployment will begin. A notification is displayed after your function app is created and the deployment package is applied.
7. Go to Azure Portal for the Function App configuration.


**2. Configure the Function App**

1. In the Function App, select the Function App Name and select **Configuration**.
2. In the **Application settings** tab, select ** New application setting**.
3. Add each of the following application settings individually, with their respective string values (case-sensitive): 
		GooglePickleString
		WorkspaceID
		WorkspaceKey
		logAnalyticsUri (optional)
4. (Optional) Change the default delays if required. 

	> **NOTE:** The following default values for ingestion delays have been added for different set of logs from Google Workspace based on Google [documentation](https://support.google.com/a/answer/7061566). These can be modified based on environmental requirements. 
		 Fetch Delay - 10 minutes 
		 Calendar Fetch Delay - 6 hours 
		 Chat Fetch Delay - 1 day 
		 User Accounts Fetch Delay - 3 hours 
		 Login Fetch Delay - 6 hours  

5. Use logAnalyticsUri to override the log analytics API endpoint for dedicated cloud. For example, for public cloud, leave the value empty; for Azure GovUS cloud environment, specify the value in the following format: `https://<CustomerId>.ods.opinsights.azure.us`. 
6. Once all application settings have been entered, click **Save**.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-googleworkspacereports?tab=Overview) in the Azure Marketplace.
