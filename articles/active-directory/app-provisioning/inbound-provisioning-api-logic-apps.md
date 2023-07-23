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

This tutorial describes how to use Azure Logic Apps workflow to implement Microsoft Entra ID [API-driven inbound provisioning](inbound-provisioning-api-concepts.md). Using the steps in this tutorial, you can convert a CSV file containing HR data into a bulk request payload and send it to the Microsoft Entra ID provisioning [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API endpoint. 

## Integration scenario

This tutorial addresses the following integration scenario: 

:::image type="content" source="media/inbound-provisioning-api-logic-apps/logic-apps-integration-overview.png" alt-text="Graphic of Azure Logic Apps-based integration." lightbox="media/inbound-provisioning-api-logic-apps/logic-apps-integration-overview.png":::

* Your system of record generates periodic CSV file exports containing worker data which is available in an Azure File Share. 
* You want to use an Azure Logic Apps workflow to automatically provision records from the CSV file to your target directory (on-premises Active Directory or Microsoft Entra ID). 
* The Azure Logic Apps workflow simply reads data from the CSV file and uploads it to the provisioning API endpoint. The API-driven inbound provisioning app configured in Microsoft Entra ID performs the task of applying your IT managed provisioning rules to create/update/enable/disable accounts in the target directory.

This tutorial uses the Logic Apps deployment template published in the [Microsoft Entra ID inbound provisioning GitHub repository](https://github.com/AzureAD/entra-id-inbound-provisioning/tree/main/LogicApps/CSV2SCIMBulkUpload). It has logic for handling large CSV files and chunking the bulk request to send 50 records in each request. 

> [!NOTE]
> The sample Azure Logic Apps workflow is provided "as-is" for implementation reference. If you have questions related to it or if you'd like to enhance it, please use the [GitHub project repository](https://github.com/AzureAD/entra-id-inbound-provisioning).

## Step 1: Create an Azure Storage account to host the CSV file
The steps documented in this section are optional. If you already have an existing storage account or would like to read the CSV file from another source like SharePoint site or Blob storage, you can tweak the Logic App to use your connector of choice.

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
1. After the execution is complete, you can review what action Logic Apps performed in each iteration.
1. In the final iteration, you should see the Logic Apps upload data to the inbound provisioning API endpoint. Look for `202 Accept` status code. You can copy-paste and verify the bulk upload request.
     :::image type="content" source="media/inbound-provisioning-api-logic-apps/execution-results.png" alt-text="Screenshot of the Logic Apps execution result." lightbox="media/inbound-provisioning-api-logic-apps/execution-results.png":::  

## Next steps
- [Troubleshoot issues with the inbound provisioning API](inbound-provisioning-api-issues.md)
- [API-driven inbound provisioning concepts](inbound-provisioning-api-concepts.md)
- [Frequently asked questions about API-driven inbound provisioning](inbound-provisioning-api-faqs.md)
