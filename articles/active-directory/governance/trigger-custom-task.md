---
title: Trigger Logic Apps based on custom task extensions
description: Trigger Logic Apps based on custom task extensions
author: owinfreyATL
ms.author: owinfrey
manager: rkarlin
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 07/05/2022
ms.custom: template-howto 
---


# Trigger Logic Apps based on custom task extensions (preview)

Lifecycle Workflows can be used to trigger custom tasks via an extension to Azure Logic Apps. This can be used to extend the capabilities of Lifecycle Workflow beyond the built-in tasks. 

The steps in this guide for Triggering a Logic app based on custom task extension are as follows:

- Create an Azure Logic App
- Configure the Azure Logic App so it's compatible with Lifecycle workflows
- Build your custom business logic within your Azure Logic App
- Create a lifecycle workflow customTaskExtension  holding necessary information about the Azure Logic App
- Update or create a Lifecycle workflow with the “Run a custom task extension” task, referencing your created customTaskExtension

For more information about Lifecycle Workflows extensibility, see: [Workflow Extensibility](lifecycle-workflow-extensibility.md).


## Create a Logic App

First you must create a Logic App so it can be integrated into your Lifecycle workflow. If you already have an existing Logic App, you may skip this section and configure it for use with Lifecycle Workflows here: Configure Logic Apps for LCW use.

To create a Logic App, you'd follow these steps:


1. Sign in to the [Azure portal](https://portal.azure.com). 

1. On the Azure Portal page, select **Logic Apps**.

1. On the Logic Apps page, select **Add**.
    :::image type="content" source="media/trigger-custom-task/lcw-add-logic-app.png" alt-text="Add Logic App LCW":::
1. For **Plan type**, select **Consumption** so that you view only the settings that apply to the Consumption plan-based logic app type

1. Enter the **Subscription**, **Resource Group**, **Logic App Name**, and **Resource Group** for your Logic App. Select your preferred **Region** and select **Workflow** for the Publish option.

1. Select **Review + create**.
    :::image type="content" source="media/trigger-custom-task/lcw-create-logic-app.png" alt-text="lcw create logic app":::
1. On the validation page that appears, confirm all the information that you provided, and  select **Create**.


> [!NOTE]
> The Logic App must be made within the same tenant as the custom task extension. For a list of compatible roles for Logic Apps with Lifecycle Workflows, see: [Logic App parameters required for integration with the custom task extension](lifecycle-workflow-extensibility.md#logic-app-parameters-required-for-integration-with-the-custom-task-extension).

## Configure Logic Apps for LCW use

Once you have a Logic app you want to use with Lifecycle Workflows, you must make it compatible to run with the **Create a Custom Task Extension** task, this requires:

- Configuring the logic app trigger
- Configure the callback action (only applicable to the callback scenario)
- Enable system assigned managed identity.
- Configure AuthZ policies.

> [!NOTE]
> For our public preview we will provide a UI and a deployment script that will automate the following steps.

To configure those you'll follow these steps:

1. Open the Logic App you want to use with Lifecycle Workflow. Logic Apps may greet you with an introduction screen, which you can close with the X in the upper right corner.

1. On the left of the screen select **Logic App code view**.

1. In the editor paste the following code:
```LCW Logic App code view template
{
  "definition": {
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "actions": {
      "HTTP": {
        "inputs": {
          "authentication": {
            "audience": "https://graph.microsoft.com",
            "type": "ManagedServiceIdentity"
          },
          "body": {
            "data": {
              "operationStatus": "Completed"
            },
            "source": "sample",
            "type": "lifecycleEvent"
          },
          "method": "POST",
          "uri": "https://graph.microsoft.com/beta@{triggerBody()?['data']?['callbackUriPath']}"
        },
        "runAfter": {},
        "type": "Http"
      }
    },
    "contentVersion": "1.0.0.0",
    "outputs": {},
    "parameters": {},
    "triggers": {
      "manual": {
        "inputs": {
          "schema": {
            "properties": {
              "data": {
                "properties": {
                  "callbackUriPath": {
                    "description": "CallbackUriPath used for Resume Action",
                    "title": "Data.CallbackUriPath",
                    "type": "string"
                  },
                  "subject": {
                    "properties": {
                      "displayName": {
                        "description": "DisplayName of the Subject",
                        "title": "Subject.DisplayName",
                        "type": "string"
                      },
                      "email": {
                        "description": "Email of the Subject",
                        "title": "Subject.Email",
                        "type": "string"
                      },
                      "id": {
                        "description": "Id of the Subject",
                        "title": "Subject.Id",
                        "type": "string"
                      },
                      "manager": {
                        "properties": {
                          "displayName": {
                            "description": "DisplayName parameter for Manager",
                            "title": "Manager.DisplayName",
                            "type": "string"
                          },
                          "email": {
                            "description": "Mail parameter for Manager",
                            "title": "Manager.Mail",
                            "type": "string"
                          },
                          "id": {
                            "description": "Id parameter for Manager",
                            "title": "Manager.Id",
                            "type": "string"
                          }
                        },
                        "type": "object"
                      },
                      "userPrincipalName": {
                        "description": "UserPrincipalName of the Subject",
                        "title": "Subject.UserPrincipalName",
                        "type": "string"
                      }
                    },
                    "type": "object"
                  },
                  "task": {
                    "properties": {
                      "displayName": {
                        "description": "DisplayName for Task Object",
                        "title": "Task.DisplayName",
                        "type": "string"
                      },
                      "id": {
                        "description": "Id for Task Object",
                        "title": "Task.Id",
                        "type": "string"
                      }
                    },
                    "type": "object"
                  },
                  "taskProcessingResult": {
                    "properties": {
                      "createdDateTime": {
                        "description": "CreatedDateTime for TaskProcessingResult Object",
                        "title": "TaskProcessingResult.CreatedDateTime",
                        "type": "string"
                      },
                      "id": {
                        "description": "Id for TaskProcessingResult Object",
                        "title": "TaskProcessingResult.Id",
                        "type": "string"
                      }
                    },
                    "type": "object"
                  },
                  "workflow": {
                    "properties": {
                      "displayName": {
                        "description": "DisplayName for Workflow Object",
                        "title": "Workflow.DisplayName",
                        "type": "string"
                      },
                      "id": {
                        "description": "Id for Workflow Object",
                        "title": "Workflow.Id",
                        "type": "string"
                      },
                      "workflowVerson": {
                        "description": "WorkflowVersion for Workflow Object",
                        "title": "Workflow.WorkflowVersion",
                        "type": "integer"
                      }
                    },
                    "type": "object"
                  }
                },
                "type": "object"
              },
              "source": {
                "description": "Context in which an event happened",
                "title": "Request.Source",
                "type": "string"
              },
              "type": {
                "description": "Value describing the type of event related to the originating occurrence.",
                "title": "Request.Type",
                "type": "string"
              }
            },
            "type": "object"
          }
        },
        "kind": "Http",
        "type": "Request"
      }
    }
  },
  "parameters": {}
}
    
```
1. Select Save.

1. Switch to the **Logic app designer** and inspect the configured trigger and callback action. To build your custom business logic, add other actions between the trigger and callback action. If you're only interested in the fire-and-forget scenario, you may remove the callback action.

1. On the left of the screen select **Identity**. 

1. Under the system assigned tab enable the status to register it with Azure Active Directory.

1. Select Save.    

1. For Logic Apps authorization policy, we'll need the managed identities **Application ID**. Since the Azure portal only shows the Object ID, we need to look up the Application ID. You can search for the managed identity by Object ID under **Enterprise Applications in the Azure AD Portal** to find the required Application ID.
 :::image type="content" source="media/trigger-custom-task/lcw-enterprise-applications-portal.png" alt-text="lcw enterprise applications portal":::
1. Go back to the logic app you created, and select **Authorization**.

1. Create a new authorization policy based on the table below:

|Claim  |Value  |
|---------|---------|
|Issuer     |  https://sts.windows.net/(Tenant ID)/       |
|Audience     | Application ID of your Logic Apps Managed Identity       |
|appID     |  ce79fdc4-cd1d-4ea5-8139-e74d7dbe0bb7   |


1. Save the Authorization policy.
> [!NOTE]
> Due to a current bug in the Logic Apps UI you may have to save the authorization policy after each claim before adding another.

> [!CAUTION]
> Please pay attention to the details as minor differences can lead to problems later.
-	For Issuer, ensure you did include the slash after your Tenant ID
-	For Audience, ensure you're using the Application ID and not the Object ID of your Managed Identity
-	For appid, ensure the custom claim is “appid” in all lowercase. The appid value represents Lifecycle Workflows and is always the same.

  

## Linking Lifecycle Workflows with Logic Apps using Microsoft Graph

After creating and configuring a Logic App, we can now integrate it with Lifecycle Workflows. As outlined in the high-level steps we first need to create the customTaskExtension and afterwards, we can reference the customTaskExtension in our “Run a custom task extension” task.

The API call for creating a customTaskExtension is as follows:
```http
POST https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/customTaskExtensions
Content-type: application/json

{
    "displayName": "<Custom task extension name>",
    "description": "<description for custom task extension>",
    "callbackConfiguration": {
        "@odata.type": "#microsoft.graph.identityGovernance.customTaskExtensionCallbackConfiguration",
        "durationBeforeTimeout": "PT1H"
    },
    "endpointConfiguration": {
        "@odata.type": "#microsoft.graph.logicAppTriggerEndpointConfiguration",
        "subscriptionId": "<Your Azure subscription>",
        "resourceGroupName": "<Resource group where the Logic App is located>",
        "logicAppWorkflowName": "<Logic App workflow name>"
    },
    "authenticationConfiguration": {
        "@odata.type": "#microsoft.graph.azureAdTokenAuthentication",
        "resourceId": " f9c5dc6b-d72b-4226-8ccd-801f7a290428"
    },
    "clientConfiguration": {
        "timeoutInMilliseconds": 1000,
        "maximumRetries": 1
    }
}
```
> [!NOTE]
> To create a custom task extension instance that does not wait for a response from the logic app, remove the **callbackConfiguration** parameter.

For detailed information about the parameters required for the custom task extension, see [Parameters required for Custom task extension](lifecycle-workflow-extensibility.md#parameters-required-for-custom-task-extension).
                               



After the task is created, you can run the following GET call to retrieve its details:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleManagement/customTaskExtensions
```

An example response is as follows:
 ```Example Custom Task Extension return
{
  "@odata.context": "https://graph.microsoft.com/beta/$metadata#identityGovernance/lifecycleManagement/customTaskExtensions",
  "@odata.count": 1,
  "value": [
    {
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#identityGovernance/lifecycleManagement/customTaskExtensions",
    "@odata.count": 1,
    "value": [
        {
            "id": "def9685c-e0f6-45aa-8fe8-a9f7ee6d30d6",
            "displayName": "My Custom Task Extension",
            "description": "My Custom Task Extension to test Lifecycle workflows Logic App integration",
            "createdDateTime": "2022-06-28T10:47:08.9359567Z",
            "lastModifiedDateTime": "2022-06-28T10:47:08.936017Z",
            "endpointConfiguration": {
                "@odata.type": "#microsoft.graph.logicAppTriggerEndpointConfiguration",
                "subscriptionId": "c500b67c-e9b7-4ad2-a90d-77d41385ae55",
                "resourceGroupName": "RG-LCM",
                "logicAppWorkflowName": "LcwDocsTest"
            },
            "authenticationConfiguration": {
                "@odata.type": "#microsoft.graph.azureAdTokenAuthentication",
                "resourceId": "f74118f0-849a-457d-a7e4-ee97eab6017a"
            },
            "clientConfiguration": {
                "maximumRetries": 1,
                "timeoutInMilliseconds": 1000
            },
            "callbackConfiguration": {
                "@odata.type": "#microsoft.graph.identityGovernance.customTaskExtensionCallbackConfiguration",
                "timeoutDuration": "PT1H"
            }
        }
    ]
}

```

You'll then take the custom extension **id**, and use it as the value in the customTaskExtensionId parameter for the custom task example here:

> [!NOTE]
> The new “Run a Custom Task Extension” task is already available in the Private Preview UI.

```Example of Custom Task extension task
"tasks":[
    {
	"taskDefinitionId": "4262b724-8dba-4fad-afc3-43fcbb497a0e",
	"continueOnError": false,
	"displayName": "<Custom Task Extension displayName>",
	"description": "<Custom Task Extension description>",
	"isEnabled": true,
	"arguments": [
		{
			"name": "customTaskExtensionID",
			"value": "<ID of your Custom Task Extension>"
		}
	]
}


```

With the custom task created, you're able to add it as a task in your workflow.


## Next steps

- [Lifecycle workflow extensibility (Preview)](lifecycle-workflow-extensibility.md)
- [Manage Workflow Versions](manage-workflow-tasks.md)
