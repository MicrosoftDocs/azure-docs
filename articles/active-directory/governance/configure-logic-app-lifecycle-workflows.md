---
title: Configure a Logic App for Lifecycle Workflow use
description: Configure an Azure Logic App for use with Lifecycle Workflows 
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.topic: reference
ms.date: 08/28/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---



# Configure a Logic App for Lifecycle Workflow use (Preview)

Before you can use an existing Azure Logic App with the custom task extension feature of Lifecycle Workflows, it must first be made compatible. This reference guide provides a list of steps that must be taken to make the Azure Logic App compatible. For a guide on creating a new compatible Logic App via the Lifecycle Workflows portal, see [Trigger Logic Apps based on custom task extensions (preview)](trigger-custom-task.md).

## Configure existing Logic Apps for LCW use

Making an Azure Logic app compatible to run with the **Custom Task Extension** requires the following steps:

- Configure the logic app trigger
- Configure the callback action (only applicable to the callback scenario)
- Enable system assigned managed identity.
- Configure AuthZ policies.

To configure those you'll follow these steps:

1. Open the Azure Logic App you want to use with Lifecycle Workflow. Logic Apps may greet you with an introduction screen, which you can close with the X in the upper right corner.

1. On the left of the screen, select **Logic App code view**.

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

1. Switch to the **Logic App designer** and inspect the configured trigger and callback action. To build your custom business logic, add other actions between the trigger and callback action. If you're only interested in the fire-and-forget scenario, you may remove the callback action.

1. On the left of the screen, select **Identity**. 

1. Under the system assigned tab, enable the status to register it with Azure Active Directory.

1. Select Save.    

1. For Logic Apps authorization policy, we'll need the managed identities **Application ID**. Since the Azure portal only shows the Object ID, we need to look up the Application ID. You can search for the managed identity by Object ID under **Enterprise Applications in the Azure AD Portal** to find the required Application ID.

1. Go back to the logic app you created, and select **Authorization**.

1. Create two authorization policies based on the tables below:

    Policy name: AzureADLifecycleWorkflowsAuthPolicy   
    
    |Claim  |Value  |
    |---------|---------|
    |Issuer     |  https://sts.windows.net/(Tenant ID)/       |
    |Audience     | Application ID of your Logic Apps Managed Identity       |
    |appid     |  ce79fdc4-cd1d-4ea5-8139-e74d7dbe0bb7   |

    Policy name: AzureADLifecycleWorkflowsAuthPolicyV2App   
 
    |Claim  |Value  |
    |---------|---------|
    |Issuer     |  https://login.microsoftonline.com/(Tenant ID)/v2.0       |
    |Audience     | Application ID of your Logic Apps Managed Identity       |
    |azp     |  ce79fdc4-cd1d-4ea5-8139-e74d7dbe0bb7   |

1. Save the Authorization policy.
> [!NOTE]
> Due to a current bug in the Logic Apps UI you may have to save the authorization policy after each claim before adding another.

> [!CAUTION]
> Please pay attention to the details as minor differences can lead to problems later.
-	For Issuer, ensure you did include the slash after your Tenant ID
-	For Audience, ensure you're using the Application ID and not the Object ID of your Managed Identity
-	For appid, ensure the custom claim is “appid” in all lowercase. The appid value represents Lifecycle Workflows and is always the same.

## Using the Logic App with Lifecycle Workflows

Now that your Logic app is configured for use with Lifecycle Workflows, you can create a custom task extension via UI or API and use it in a Lifecycle Workflow.

## Next steps

- [Lifecycle workflow extensibility (Preview)](lifecycle-workflow-extensibility.md)
- [Manage Workflow Versions](manage-workflow-tasks.md)
