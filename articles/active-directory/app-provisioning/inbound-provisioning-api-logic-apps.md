---
title: API-driven inbound provisioning with Azure Logic Apps (Public preview)
description: Learn how to implement API-driven inbound provisioning with Azure Logic Apps.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 07/18/2023
ms.author: jfields
ms.reviewer: cmmdesai
---

# API-driven inbound provisioning with Azure Logic Apps (Public preview)

This tutorial describes how to use Azure Logic Apps workflow to implement Microsoft Entra ID [API-driven inbound provisioning](inbound-provisioning-api-concepts.md). Using the steps in this tutorial, you can convert a CSV file containing HR data into a bulk request payload and send it to the Microsoft Entra ID provisioning [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API endpoint. The article also provides guidance on how the same integration pattern can be used with any system of record.

## Integration scenario

### Business requirement

Your system of record periodically generates CSV file exports containing worker data. You want to implement an integration that reads data from the CSV file and automatically provisions user accounts in your target directory (on-premises Active Directory for hybrid users and Microsoft Entra ID for cloud-only users).

### Implementation requirement

From an implementation perspective:

* You want to use an Azure Logic Apps workflow  to read data from the CSV file exports available in an Azure File Share and send it to the inbound provisioning API endpoint. 
* In your Azure Logic Apps workflow, you don't want to implement the complex logic of comparing identity data between your system of record and target directory. 
* You want to use Microsoft Entra ID provisioning service to apply your IT managed provisioning rules to automatically create/update/enable/disable accounts in the target directory (on-premises Active Directory or Microsoft Entra ID).

:::image type="content" source="media/inbound-provisioning-api-logic-apps/logic-apps-integration-overview.png" alt-text="Graphic of Azure Logic Apps-based integration." lightbox="media/inbound-provisioning-api-logic-apps/logic-apps-integration-overview.png":::

### Integration scenario variations

While this tutorial uses a CSV file as a system of record, you can customize the sample Azure Logic Apps workflow to read data from any system of record. Azure Logic Apps provides a wide range of [built-in connectors](/azure/logic-apps/connectors/built-in/reference) and [managed connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) with pre-built triggers and actions that you can use in your integration workflow. 

Here's a list of enterprise integration scenario variations, where API-driven inbound provisioning can be implemented with a Logic Apps workflow.

|#  |System of record  |Integration guidance on using Logic Apps to read source data |
|---------|---------|---------|
| 1 | Files stored on SFTP server | Use either the [built-in SFTP connector](/azure/logic-apps/connectors/built-in/reference/sftp/) or [managed SFTP SSH connector](/azure/connectors/connectors-sftp-ssh) to read data from  files stored on the SFTP server. |
| 2 | Database table | If you're using an Azure SQL server or on-premises SQL Server, use the [SQL Server](/azure/connectors/connectors-create-api-sqlazure) connector to read your table data. <br> If you're using an Oracle database, use the [Oracle database](/azure/connectors/connectors-create-api-oracledatabase) connector to read your table data. |
| 3 | On-premises and cloud-hosted SAP S/4 HANA or <br> Classic on-premises SAP systems, such as R/3 and ECC | Use the [SAP connector](/azure/logic-apps/logic-apps-using-sap-connector) to retrieve identity data from your SAP system. For examples on how to configure this connector, refer to [common SAP integration scenarios](/azure/logic-apps/sap-create-example-scenario-workflows) using Azure Logic Apps and the SAP connector. |
| 4 | IBM MQ | Use the [IBM MQ connector](/azure/connectors/connectors-create-api-mq) to receive provisioning messages from the queue. |
| 5 | Dynamics 365 Human Resources | Use the [Dataverse connector](/azure/connectors/connect-common-data-service) to read data from [Dataverse tables](/dynamics365/human-resources/hr-developer-entities) used by Microsoft Dynamics 365 Human Resources. |
| 6 | Any system that exposes REST APIs | If you don't find a connector for your system of record in the Logic Apps connector library, You can create your own [custom connector](/azure/logic-apps/logic-apps-create-api-app) to read data from your system of record. |

After reading the source data, apply your pre-processing rules and convert the output from your system of record into a bulk request that can be sent to the Microsoft Entra ID provisioning [bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API endpoint.

> [!IMPORTANT]
> If you'd like to share your API-driven inbound provisioning + Logic Apps integration workflow with the community, create a [Logic app template](/azure/logic-apps/logic-apps-create-azure-resource-manager-templates), document steps on how to use it and submit a pull request for inclusion in the GitHub repository [Entra-ID-Inbound-Provisioning](https://github.com/AzureAD/entra-id-inbound-provisioning). 

## How to use this tutorial

The Logic Apps deployment template published in the [Microsoft Entra ID inbound provisioning GitHub repository](https://github.com/AzureAD/entra-id-inbound-provisioning/tree/main/LogicApps/CSV2SCIMBulkUpload) automates several tasks. It also has logic for handling large CSV files and chunking the bulk request to send 50 records in each request. Here's how you can test it and customize it per your integration requirements. 

> [!NOTE]
> The sample Azure Logic Apps workflow is provided "as-is" for implementation reference. If you have questions related to it or if you'd like to enhance it, please use the [GitHub project repository](https://github.com/AzureAD/entra-id-inbound-provisioning).

|# | Automation task | Implementation guidance | Advanced customization |
|---------|---------|---------|---------|
|1 | Read worker data from the CSV file. | The Logic Apps workflow uses an Azure Function to read the CSV file stored in an Azure File Share. The Azure Function converts CSV data into JSON format. If your CSV file format is different, update the workflow step "Parse JSON" and "Construct SCIMUser". |  If your system of record is different, check guidance provided in the section [Integration scenario variations](#integration-scenario-variations) on how to customize the Logic Apps workflow by using an appropriate connector. |
|2 | Pre-process and convert data to SCIM format.  | By default, the Logic Apps workflow converts each record in the CSV file to a SCIM Core User + Enterprise User representation. If you plan to use custom SCIM schema extensions, update the step "Construct SCIMUser" to include your custom SCIM schema extensions. | If you want to run C# code for advanced formatting and data validation, use [custom Azure Functions](../../logic-apps/logic-apps-azure-functions.md).|
|3 | Use the right authentication method | You can either [use a service principal](inbound-provisioning-api-grant-access.md#configure-a-service-principal)  or [use managed identity](inbound-provisioning-api-grant-access.md#configure-a-managed-identity) to access the inbound provisioning API. Update the step "Send SCIMBulkPayload to API endpoint" with the right authentication method. | - |
|4 | Provision accounts in on-premises Active Directory or Microsoft Entra ID.  | Configure [API-driven inbound provisioning app](inbound-provisioning-api-configure-app.md). This generates a unique [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API endpoint. Update the step "Send SCIMBulkPayload to API endpoint" to use the right bulkUpload API endpoint. | If you plan to use bulk request with custom SCIM schema, then extend the provisioning app schema to include your custom SCIM schema attributes. |
|5 | Scan the provisioning logs and retry provisioning for failed records.  |  This automation is not yet implemented in the sample Logic Apps workflow. To implement it, refer to the [provisioning logs Graph API](/graph/api/resources/provisioningobjectsummary). | - |
|6 | Deploy your Logic Apps based automation to production.  |  Once you have verified your API-driven provisioning flow and customized the Logic Apps workflow to meet your requirements, deploy the automation in your environment. | - |


## Step 1: Create an Azure Storage account to host the CSV file
The steps documented in this section are optional. If you already have an existing storage account or would like to read the CSV file from another source like SharePoint site or Blob storage, update the Logic App to use your connector of choice.

1. Log in to your Azure portal as administrator.
1. Search for "Storage accounts" and create a new storage account. 
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/storage-accounts.png" alt-text="Screenshot of creating new storage account." lightbox="media/inbound-provisioning-api-logic-apps/storage-accounts.png"::: 
1. Assign a resource group and give it a name. 
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/assign-resource-group.png" alt-text="Screenshot of resource group assignment." lightbox="media/inbound-provisioning-api-logic-apps/assign-resource-group.png":::    
1. After the storage account is created, go to the resource.
1. Click on "File share" menu option and create a new file share.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/create-new-file-share.png" alt-text="Screenshot of creating new file share." lightbox="media/inbound-provisioning-api-logic-apps/create-new-file-share.png":::    
1. Verify that the file share creation is successful. 
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/verify-file-share-creation.png" alt-text="Screenshot of file share created." lightbox="media/inbound-provisioning-api-logic-apps/verify-file-share-creation.png":::    
1. Upload a sample CSV file to the file share using the upload option.
1. Here is a screenshot of the columns in the CSV file. 
    :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/columns.png" alt-text="Screenshot of columns in Excel." lightbox="./media/inbound-provisioning-api-powershell/columns.png":::

## Step 2: Configure Azure Function CSV2JSON converter

1. In the browser associated with your Azure portal login, open the GitHub repository URL - https://github.com/joelbyford/CSVtoJSONcore.
1. Click on the link "Deploy to Azure" to deploy this Azure Function to your Azure tenant.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/deploy-azure-function.png" alt-text="Screenshot of deploying Azure Function." lightbox="media/inbound-provisioning-api-logic-apps/deploy-azure-function.png":::    
1. Specify the resource group under which to deploy this Azure function. 
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/azure-function-resource-group.png" alt-text="Screenshot of configuring Azure Function resource group." lightbox="media/inbound-provisioning-api-logic-apps/azure-function-resource-group.png":::  

     If you get the error "[This region has quota of 0 instances](/answers/questions/751909/azure-function-app-region-has-quota-of-0-instances)", try selecting a different region. 
1. Ensure that the deployment of the Azure Function as an App Service is successful. 
1. Go to the resource group and open the WebApp configuration. Ensure it is in "Running" state. Copy the default domain name associated with the Web App.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/web-app-domain-name.png" alt-text="Screenshot of Azure Function Web App domain name." lightbox="media/inbound-provisioning-api-logic-apps/web-app-domain-name.png":::  
1. Open Postman client to test if the CSVtoJSON endpoint works as expected. Paste the domain name copied from the previous step. Use Content-Type of "text/csv" and post a sample CSV file in the request body to the endpoint: `https://[your-domain-name]/csvtojson`
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/postman-call-to-azure-function.png" alt-text="Screenshot of Postman client calling the Azure Function." lightbox="media/inbound-provisioning-api-logic-apps/postman-call-to-azure-function.png":::  
1. If the Azure Function deployment is successful, then in the response you'll get a JSON version of the CSV file with status 200 OK.

     :::image type="content" source="media/inbound-provisioning-api-logic-apps/azure-function-response.png" alt-text="Screenshot of Azure Function response." lightbox="media/inbound-provisioning-api-logic-apps/azure-function-response.png":::  
1. To allow Logic Apps to invoke this Azure Function, in the CORS setting for the WebApp enter asterisk (*) and "Save" the configuration.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/azure-function-cors-setting.png" alt-text="Screenshot of Azure Function CORS setting." lightbox="media/inbound-provisioning-api-logic-apps/azure-function-cors-setting.png":::  

## Step 3: Configure API-driven inbound user provisioning

* Configure [API-driven inbound user provisioning](inbound-provisioning-api-configure-app.md). 

## Step 4: Configure your Azure Logic Apps workflow

1. Click on the button below to deploy the Azure Resource Manager template for the CSV2SCIMBulkUpload Logic Apps workflow.

     [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzureAD%2Fentra-id-inbound-provisioning%2Fmain%2FLogicApps%2FCSV2SCIMBulkUpload%2Fcsv2scimbulkupload-template.json)

1. Under instance details, update the highlighted items, copy-pasting values from the previous steps.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/logic-apps-instance-details.png" alt-text="Screenshot of Azure Logic Apps instance details." lightbox="media/inbound-provisioning-api-logic-apps/logic-apps-instance-details.png":::  
1. For the `Azurefile_access Key` parameter, open your Azure file storage account and copy the access key present under "Security and Networking".  
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/azure-file-access-keys.png" alt-text="Screenshot of Azure File access keys." lightbox="media/inbound-provisioning-api-logic-apps/azure-file-access-keys.png":::  
1. Click on "Review and Create" option to start the deployment.
1. Once the deployment is complete, you'll see the following message.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/logic-apps-deployment-complete.png" alt-text="Screenshot of Azure Logic Apps deployment complete." lightbox="media/inbound-provisioning-api-logic-apps/logic-apps-deployment-complete.png":::  

## Step 5: Configure system assigned managed identity

1. Visit the Settings -> Identity blade of your Logic Apps workflow.
1. Enable **System assigned managed identity**.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/enable-managed-identity.png" alt-text="Screenshot of enabling managed identity." lightbox="media/inbound-provisioning-api-logic-apps/enable-managed-identity.png":::  
1. You'll get a prompt to confirm the use of the managed identity. Click on **Yes**.
1. Grant the managed identity [permissions to perform bulk upload](inbound-provisioning-api-grant-access.md#configure-a-managed-identity).  

## Step 6: Review and adjust the workflow steps

1. Open the Logic App in the designer view.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/designer-view.png" alt-text="Screenshot of Azure Logic Apps designer view." lightbox="media/inbound-provisioning-api-logic-apps/designer-view.png":::  
1. Review the configuration of each step in the workflow to make sure it is correct.
1. Open the "Get file content using path" step and correct it to browse to the Azure File Storage in your tenant.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/get-file-content.png" alt-text="Screenshot of get file content." lightbox="media/inbound-provisioning-api-logic-apps/get-file-content.png":::  
1. Update the connection if required. 
1. Make sure your "Convert CSV to JSON" step is pointing to the right Azure Function Web App instance.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/convert-file-format.png" alt-text="Screenshot of Azure Function call invocation to convert from CSV to JSON." lightbox="media/inbound-provisioning-api-logic-apps/convert-file-format.png":::  
1. If your CSV file content / headers is different, then update the "Parse JSON" step with the JSON output that you can retrieve from your API call to the Azure Function. Use Postman output from Step 2. 
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/parse-json-step.png" alt-text="Screenshot of Parse JSON step." lightbox="media/inbound-provisioning-api-logic-apps/parse-json-step.png":::  
1. In the step "Construct SCIMUser", ensure that the CSV fields map correctly to the SCIM attributes that will be used for processing.

     :::image type="content" source="media/inbound-provisioning-api-logic-apps/construct-scim-user.png" alt-text="Screenshot of Construct SCIM user step." lightbox="media/inbound-provisioning-api-logic-apps/construct-scim-user.png":::  
1. In the step "Send SCIMBulkPayload to API endpoint" ensure you are using the right API endpoint and authentication mechanism.

     :::image type="content" source="media/inbound-provisioning-api-logic-apps/invoke-bulk-upload-api.png" alt-text="Screenshot of invoking bulk upload API with managed identity." lightbox="media/inbound-provisioning-api-logic-apps/invoke-bulk-upload-api.png":::  

## Step 7: Run trigger and test your Logic Apps workflow 

1. In the "Generally Available" version of the Logic Apps designer, click on Run Trigger to manually execute the workflow.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/run-logic-app.png" alt-text="Screenshot of running the Logic App." lightbox="media/inbound-provisioning-api-logic-apps/run-logic-app.png":::  
1. After the execution is complete, review what action Logic Apps performed in each iteration.
1. In the final iteration, you should see the Logic Apps upload data to the inbound provisioning API endpoint. Look for `202 Accept` status code. You can copy-paste and verify the bulk upload request.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/execution-results.png" alt-text="Screenshot of the Logic Apps execution result." lightbox="media/inbound-provisioning-api-logic-apps/execution-results.png":::  

## Next steps
- [Troubleshoot issues with the inbound provisioning API](inbound-provisioning-api-issues.md)
- [API-driven inbound provisioning concepts](inbound-provisioning-api-concepts.md)
- [Frequently asked questions about API-driven inbound provisioning](inbound-provisioning-api-faqs.md)
