---
title: Tutorial - Send custom logs to Azure Monitor Logs using resource manager templates
description: Tutorial on how to send custom logs to a Log Analytics workspace in Azure Monitor using resource manager templates.
ms.subservice: logs
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 01/19/2022
---

# Tutorial: Send custom logs to Azure Monitor Logs using resource manager templates (preview)
[Custom logs](custom-logs-overview.md) in Azure Monitor allow you to send custom data to any table in a Log Analytics workspace with a REST API. This tutorial walks through configuration of a new table and a sample application to send custom logs to Azure Monitor using resource manager templates.

> [!NOTE]
> This tutorial uses resource manager templates and REST API to configure custom logs. See [Tutorial: Send custom logs to Azure Monitor Logs using the Azure portal (preview)](tutorial-custom-logs.md) for a similar tutorial using the Azure portal.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create a custom table in a Log Analytics workspace
> * Create a data collection endpoint to receive data over HTTP
> * Create a data collection rule that transforms incoming data to match the schema of the target table
> * Create a sample application to send custom data to Azure Monitor


> [!NOTE]
> This tutorial uses PowerShell from Azure Cloud Shell to make REST API calls using the Azure Monitor **Tables** API and the Azure portal to install resource manager templates. You can use any other method to make these calls.

## Prerequisites
To complete this tutorial, you need the following: 

- Log Analytics workspace where you have at least contributor rights. 
- Permissions to create Data Collection Rule objects.


## Overview of tutorial
We'll use a PowerShell script to send sample data over HTTP to the API endpoint.

The Data Collection Endpoint uses standard Azure Resource Manager (ARM) authentication. 


For this tutorial, a new table called "MyTable_CL" will be created. Note that any completely custom table name must end in "_CL". Also note that it is possible to ingest data directly into most system tables - simply skip this step and reference the required system table in steps 4 and 7 instead of this custom one. 

## Configure application
You need to start by registering an Azure Active Directory application to authenticate against the API. Any ARM authentication scheme is supported, but we'll follow the [Client Credential Grant Flow scheme](../../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) for this tutorial.

From the **Azure Active Directory** menu in the Azure portal, select **App registrations** and then **New registration**.

:::image type="content" source="media/tutorial-custom-logs/new-app-registration.png" lightbox="media/tutorial-custom-logs/new-app-registration.png" alt-text="Screenshot for app registration":::

Give the application a name and change the tenancy scope if the default is not appropriate for your environment. A **Redirect URI** isn't required.

:::image type="content" source="media/tutorial-custom-logs/new-app-name.png" lightbox="media/tutorial-custom-logs/new-app-name.png" alt-text="Screenshot for app details":::

Once registered, you can view the details of the application. Note the **Application (client) ID** and the **Directory (tenant) ID**. You'll need these values later in the process.

:::image type="content" source="media/tutorial-custom-logs/new-app-id.png" lightbox="media/tutorial-custom-logs/new-app-id.png" alt-text="Screenshot for app id":::

You now need to generate an application client secret, which is similar to creating a password to use with a username. Select **Certificates & secrets** and then **New client secret**. Give the secret a name to identify its purpose and select an **Expires** duration. *1 year* is selected here although for a production implementation, you would follow best practices for a secret rotation procedure or use a more secure authentication mode such a certificate.

:::image type="content" source="media/tutorial-custom-logs/new-app-secret.png" lightbox="media/tutorial-custom-logs/new-app-secret.png" alt-text="Screenshot for new app secret":::

Click **Add** to save the secret and then note the **Value**. Ensure that you record this value since You can't recover it once you navigate away from this page. Use the same security measures as you would for safekeeping a password as it's the functional equivalent.

:::image type="content" source="media/tutorial-custom-logs/new-app-secret-value.png" lightbox="media/tutorial-custom-logs/new-app-secret-value.png" alt-text="Screenshot for new app secret value":::


## Collect workspace information
Navigate to your workspace in the **Log Analytics workspaces** menu in the Azure Portal. From the **Properties** page, copy the **Resource ID** and save it for later use.

:::image type="content" source="media/tutorial-custom-logs-api/workspace-resource-id.png" lightbox="media/tutorial-custom-logs-api/workspace-resource-id.png" alt-text="Screenshot for workspace resource ID":::

## Create new table in Log Analytics workspace
The custom table must be created before you can send data to it. The table for this tutorial will include three columns, as described in the resource manager template below. The  `name`, `type`, and `description` properties are mandatory for each column. ; The properties `isHidden` and `isDefaultDisplay` both default to `false` if not explicitly specified. Possible data types are `string`, `int`, `long`, `real`, `boolean`, `dateTime`, `guid`, and `dynamic`.

Use the **Tables - Update** API to create the table with the PowerShell code below. 

> [!IMPORTANT]
> Custom tables must use a suffix of *_CL*.

Click the **Cloud Shell** button in the Azure portal and ensure the environment is set to **PowerShell**.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/open-cloud-shell.png" lightbox="media/tutorial-ingestion-time-transformations-api/open-cloud-shell.png" alt-text="Screenshot of opening cloud shell":::

Copy the following PowerShell code and replace the **Path** parameter with the **Resource ID** of your workspace. Paste it into the cloud shell prompt to run it.

```PowerShell
$tableParams = @'
{
    "properties": {
        "schema": {
            "name": "MyTable_CL",
            "columns": [
                {
                    "name": "TimeGenerated",
                    "type": "datetime",
                    "description": "The time at which the data was generated"
                },
                {
                    "name": "AdditionalContext",
                    "type": "dynamic",
                    "description": "Additional message properties"
                },
                {
                    "name": "ExtendedColumn",
                    "type": "string",
                    "description": "An additional column extended at ingestion time"
                }
            ]
        }
    }
}
'@

Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}/tables/MyTable_CL?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
```


## Create data collection endpoint
A [data collection endpoint (DCE)](../essentials/data-collection-endpoint-overview.md) is required to accept the data being sent to Azure Monitor. Once you configure the DCE and link it to a data collection rule, you can send data over HTTP from your application. The DCE must be located in the same region as the Log Analytics Workspace where the data will be sent. 

In the Azure portal's search box, type in *template* and then select **Deploy a custom template**.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/deploy-custom-template.png" alt-text="Screenshot to deploy custom template":::

Click **Build your own template in the editor**.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/build-custom-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/build-custom-template.png" alt-text="Screenshot to build template in the editor":::

Paste the resource manager template below into the editor and then click **Save**.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/edit-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/edit-template.png" alt-text="Screenshot to edit resource manager template":::


```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "dataCollectionEndpointName": {
            "type": "string",
            "metadata": {
                "description": "Specifies the name of the Data Collection Endpoint to create."
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "westus2",
            "allowedValues": [
                "westus2",
                "eastus2",
                "eastus2euap"
            ],
            "metadata": {
                "description": "Specifies the location in which to create the Data Collection Endpoint."
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.Insights/dataCollectionEndpoints",
            "name": "[parameters('dataCollectionEndpointName')]",
            "location": "[parameters('location')]",
            "apiVersion": "2021-04-01",
            "properties": {
                "networkAcls": {
                  "publicNetworkAccess": "Enabled"
                }
            }
        }
    ],
    "outputs": {
        "dataCollectionEndpointId": {
            "type": "string",
            "value": "[resourceId('Microsoft.Insights/dataCollectionEndpoints', parameters('dataCollectionEndpointName'))]"
        }
    }
}
```

On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the data collection rule and then provide values a **Name** for the data collection endpoint. The **Location** should be the same location as the workspace. The **Region** will already be populated and is used for the location of the data collection endpoint.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/custom-deployment-values.png" lightbox="media/tutorial-ingestion-time-transformations-api/custom-deployment-values.png" alt-text="Screenshot to edit  custom deployment values":::

Click **Review + create** and then **Create** when you review the details.

Once the DCE is created, select it so you can view its properties. Note the **Logs ingestion** URI since you'll need this in a later step.

:::image type="content" source="media/tutorial-custom-logs-api/data-collection-endpoint-overview.png" lightbox="media/tutorial-custom-logs-api/data-collection-endpoint-overview.png" alt-text="Screenshot for data collection endpoint uri":::

Click **JSON View** to view other details for the data collection endpoint. Copy the **Resource ID**.

:::image type="content" source="media/tutorial-custom-logs-api/data-collection-endpoint-json.png" lightbox="media/tutorial-custom-logs-api/data-collection-endpoint-json.png" alt-text="Screenshot for data collection endpoint resource ID":::


## Create data collection rule
The data collection rule is the component of Azure Monitor that configures ingestion collection. In this case, the schema of data that being sent to the HTTP endpoint, the transformation that will be applied to it, and the destination workspace and table the transformed data will be sent to.

In the Azure portal's search box, type in *template* and then select **Deploy a custom template**.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/deploy-custom-template.png" alt-text="Screenshot to deploy custom template":::

Click **Build your own template in the editor**.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/build-custom-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/build-custom-template.png" alt-text="Screenshot to build template in the editor":::

Paste the resource manager template below into the editor and then click **Save**.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/edit-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/edit-template.png" alt-text="Screenshot to edit resource manager template":::

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "dataCollectionRuleName": {
            "type": "string",
            "metadata": {
                "description": "Specifies the name of the Data Collection Rule to create."
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "westus2",
            "allowedValues": [
                "westus2",
                "eastus2",
                "eastus2euap"
            ],
            "metadata": {
                "description": "Specifies the location in which to create the Data Collection Rule."
            }
        },
        "workspaceResourceId": {
            "type": "string",
            "metadata": {
                "description": "Specifies the Azure resource ID of the Log Analytics workspace to use."
            }
        },
        "endpointResourceId": {
            "type": "string",
            "metadata": {
                "description": "Specifies the Azure resource ID of the Data Collection Endpoint to use."
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.Insights/dataCollectionRules",
            "name": "[parameters('dataCollectionRuleName')]",
            "location": "[parameters('location')]",
            "apiVersion": "2021-09-01-preview",
            "properties": {
                "dataCollectionEndpointId": "[parameters('endpointResourceId')]",
                "streamDeclarations": {
                    "Custom-MyTableRawData": {
                        "columns": [
                            {
                                "name": "Time",
                                "type": "datetime"
                            },
                            {
                                "name": "Computer",
                                "type": "string"
                            },
                            {
                                "name": "AdditionalContext",
                                "type": "string"
                            }
                        ]
                    }
                },
                "destinations": {
                    "logAnalytics": [
                        {
                            "workspaceResourceId": "[parameters('workspaceResourceId')]",
                            "name": "clv2ws1"
                        }
                    ]
                },
                "dataFlows": [
                    {
                        "streams": [
                            "Custom-MyTableRawData"
                        ],
                        "destinations": [
                            "clv2ws1"
                        ],
                        "transformKql": "source | extend jsonContext = parse_json(AdditionalContext) | project TimeGenerated = Time, Computer, AdditionalContext = jsonContext, ExtendedColumn=tostring(jsonContext.CounterName)",
                        "outputStream": "Custom-MyTable_CL"
                    }
                ]
            }
        }
    ],
    "outputs": {
        "dataCollectionRuleId": {
            "type": "string",
            "value": "[resourceId('Microsoft.Insights/dataCollectionRules', parameters('dataCollectionRuleName'))]"
        }
    }
}
```

On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the data collection rule and then provide values defined in the template. This includes a **Name** for the data collection rule and the **Workspace Resource ID** that you collected in a previous step. The **Location** should be the same location as the workspace. The **Region** will already be populated and is used for the location of the data collection rule.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/custom-deployment-values.png" lightbox="media/tutorial-ingestion-time-transformations-api/custom-deployment-values.png" alt-text="Screenshot to edit  custom deployment values":::

Click **Review + create** and then **Create** when you review the details.

When the deployment is complete, expand the **Deployment details** box and click on your data collection rule to view its details. Click **JSON View**.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/data-collection-rule-details.png" lightbox="media/tutorial-ingestion-time-transformations-api/data-collection-rule-details.png" alt-text="Screenshot for data collection rule details":::

Copy the **Resource ID** for the data collection rule. You'll use this in the next step.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/data-collection-rule-json-view.png" lightbox="media/tutorial-ingestion-time-transformations-api/data-collection-rule-json-view.png" alt-text="Screenshot for data collection rule JSON view":::

## Assign permissions to data collection rule
Now that the data collection rule has been created, the application needs to be given permission to it. This will allow any application using the correct application ID and application key to send data to the new data collection endpoint, have that data processed with the nee data collection rule, and then stored in the Log Analytics workspace.

From the data collection rule in the Azure portal, select **Access Control (IAM)** amd then **Add role assignment**. 

:::image type="content" source="media/tutorial-custom-logs/add-role-assignment.png" lightbox="media/tutorial-custom-logs/custom-log-create.png" alt-text="Screenshot for adding custom role assignment to DCR":::

Select **Monitoring Metrics Publisher** and click **Next**.  You could instead create a custom action with the `Microsoft.Insights/Telemetry/Write` data action. 

:::image type="content" source="media/tutorial-custom-logs/add-role-assignment-select-role.png" lightbox="media/tutorial-custom-logs/add-role-assignment-select-role.png" alt-text="Screenshot for selecting role for DCR role assignment":::

Select **User, group, or service principal** for **Assign access to** and click **Select members**. Select the application that you created and click **Select**.

:::image type="content" source="media/tutorial-custom-logs/add-role-assignment-select-member.png" lightbox="media/tutorial-custom-logs/add-role-assignment-select-member.png" alt-text="Screenshot for selecting members for DCR role assignment":::


Click **Review + assign** and verify the details before saving your role assignment.

:::image type="content" source="media/tutorial-custom-logs/add-role-assignment-save.png" lightbox="media/tutorial-custom-logs/add-role-assignment-save.png" alt-text="Screenshot for saving DCR role assignment":::

## Test custom log ingestion
Ingestion is a straightforward POST call to the Data Collection Endpoint via HTTP. Details are as follows:

#### Endpoint URI
The endpoint URI follows the shape below, where both the `Data Collection Endpoint` and `DCR Immutable ID` are ones we noted earlier:
```
{Data Collection Endpoint URI}/dataCollectionRules/{DCR Immutable ID}/streams/{Stream Name}?api-version=2021-11-01-preview
```

#### Headers
Two headers are required at a minimum:  
```
Authorization:  Bearer {Bearer token obtained through the Client Credentials Flow} 
Content-Type:   application/json
```

Optionally, for performance optimization, the GZip compression scheme is supported. To use it, you can specify a `Content-Encoding: gzip` header after GZip-encoding your body. Also optionally, but very useful, you can include a `x-ms-client-request-id` header set to a string-formatted GUID; this request ID can then be looked up by Microsoft for any troubleshooting purposes.  

#### Body
 The custom data be sent will be in the body of a POST call to the Data Collection we noted earlier. The shape of the data that we send will be a JSON array with the following three fields - the ones matching the _columns_ section in the DCR we provisioned:  

| Field name | Type |
| --- | --- |
| Time | DateTime |
| Computer | String |
| AdditionalContext | String |  

A sample set of data is shown in the staticData variable in the code below.

#### Sample code
The following PowerShell code demonstrates how to send data to the endpoint using HTTP REST fundamentals. Simply replace the parameters in the "step 0" section with those you noted earlier, and if desired, replacing the sample data in the "step 2" section with your own.  

```powershell
##################
### Step 0: set parameters required for the rest of the script
##################
#information needed to authenticate to AAD and obtain a bearer token
$tenantId = "19caa212-0847-..."; #the tenant ID in which the Data Collection Endpoint resides
$appId = "b7f0e67a-..."; #the app ID created and granted permissions
$appSecret = "74dJ..."; #the secret created for the above app

#information needed to send data to the DCR endpoint
$dcrImmutableId = "dcr-10f6..."; #the immutableId property of the DCR object
$dceEndpoint = "https://[...].westus2-1.ingest.monitor.azure.com"; #the endpoint property of the Data Collection Endpoint object

##################
### Step 1: obtain a bearer token that we'll later use to authenticate against the DCR endpoint
##################
$scope= [System.Web.HttpUtility]::UrlEncode("https://monitor.azure.com//.default")   
$body = "client_id=$appId&scope=$scope&client_secret=$appSecret&grant_type=client_credentials";
$headers = @{"Content-Type"="application/x-www-form-urlencoded"};
$uri = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"

$bearerToken = (Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers).access_token
### If the above line throws an 'Unable to find type [System.Web.HttpUtility].' error, execute the line below separately from the rest of the code
# Add-Type -AssemblyName System.Web

##################
### Step 2: load up some data... in this case, generate some static data to send
##################
$currentTime = Get-Date ([datetime]::UtcNow) -Format O
$staticData = @"
[
  {
    "Time": "$currentTime",
    "Computer": "Computer1",
    "AdditionalContext": {
				"InstanceName": "user1",
				"TimeZone": "Pacific Time",
				"Level": 4,
        "CounterName": "AppMetric1",
        "CounterValue": 15.3    
    }
  },
  {
    "Time": "$currentTime",
    "Computer": "Computer2",
    "AdditionalContext": {
				"InstanceName": "user2",
				"TimeZone": "Central Time",
				"Level": 3,
        "CounterName": "AppMetric1",
        "CounterValue": 23.5     
    }
  }
]
"@;

##################
### Step 3: send the data to Log Analytics via the DCR!
##################
$body = $staticData;
$headers = @{"Authorization"="Bearer $bearerToken";"Content-Type"="application/json"};
$uri = "$dceEndpoint/dataCollectionRules/$dcrImmutableId/streams/Custom-MyTableRawData?api-version=2021-11-01-preview"

$uploadResponse = Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers -TransferEncoding "GZip"
```

If you receive an `Unable to find type [System.Web.HttpUtility].` error, run the last line in section 1 of the script for a fix and execute it directly. Executing it uncommented as part of the script will not resolve the issue - the command must be executed separately.   

After executing this script, you should see a `HTTP - 200 OK` response, and in just a few minutes, the data arrive to your Log Analytics workspace.

## Next steps