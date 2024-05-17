---
title: Azure built-in roles for AI + machine learning - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the AI + machine learning category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure built-in roles for AI + machine learning

This article lists the Azure built-in roles in the AI + machine learning category.


## AzureML Compute Operator

Can access and perform CRUD operations on Machine Learning Services managed compute resources (including Notebook VMs).

[Learn more](/azure/machine-learning/how-to-assign-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/computes/* |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/notebooks/vm/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can access and perform CRUD operations on Machine Learning Services managed compute resources (including Notebook VMs).",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e503ece1-11d0-4e8e-8e2c-7a6c3bf38815",
  "name": "e503ece1-11d0-4e8e-8e2c-7a6c3bf38815",
  "permissions": [
    {
      "actions": [
        "Microsoft.MachineLearningServices/workspaces/computes/*",
        "Microsoft.MachineLearningServices/workspaces/notebooks/vm/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AzureML Compute Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AzureML Data Scientist

Can perform all actions within an Azure Machine Learning workspace, except for creating or deleting compute resources and modifying the workspace itself.

[Learn more](/azure/machine-learning/how-to-assign-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/read |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/action |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/delete |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/write |  |
> | **NotActions** |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/delete | Deletes the Machine Learning Services Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/write | Creates or updates a Machine Learning Services Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/computes/*/write |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/computes/*/delete |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/computes/listKeys/action | List secrets for compute resources in Machine Learning Services Workspace |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/listKeys/action | List secrets for a Machine Learning Services Workspace |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/hubs/write | Creates or updates a Machine Learning Services Hub Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/hubs/delete | Deletes the Machine Learning Services Hub Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/featurestores/write | Creates or Updates the Machine Learning Services FeatureStore(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/featurestores/delete | Deletes the Machine Learning Services FeatureStore(s) |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can perform all actions within an Azure Machine Learning workspace, except for creating or deleting compute resources and modifying the workspace itself.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f6c7c914-8db3-469d-8ca1-694a8f32e121",
  "name": "f6c7c914-8db3-469d-8ca1-694a8f32e121",
  "permissions": [
    {
      "actions": [
        "Microsoft.MachineLearningServices/workspaces/*/read",
        "Microsoft.MachineLearningServices/workspaces/*/action",
        "Microsoft.MachineLearningServices/workspaces/*/delete",
        "Microsoft.MachineLearningServices/workspaces/*/write"
      ],
      "notActions": [
        "Microsoft.MachineLearningServices/workspaces/delete",
        "Microsoft.MachineLearningServices/workspaces/write",
        "Microsoft.MachineLearningServices/workspaces/computes/*/write",
        "Microsoft.MachineLearningServices/workspaces/computes/*/delete",
        "Microsoft.MachineLearningServices/workspaces/computes/listKeys/action",
        "Microsoft.MachineLearningServices/workspaces/listKeys/action",
        "Microsoft.MachineLearningServices/workspaces/hubs/write",
        "Microsoft.MachineLearningServices/workspaces/hubs/delete",
        "Microsoft.MachineLearningServices/workspaces/featurestores/write",
        "Microsoft.MachineLearningServices/workspaces/featurestores/delete"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AzureML Data Scientist",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Contributor

Lets you create, read, update, delete and manage keys of Cognitive Services.

[Learn more](/azure/ai-services/openai/how-to/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/* |  |
> | [Microsoft.Features](../permissions/management-and-governance.md#microsoftfeatures)/features/read | Gets the features of a subscription. |
> | [Microsoft.Features](../permissions/management-and-governance.md#microsoftfeatures)/providers/features/read | Gets the feature of a subscription in a given resource provider. |
> | [Microsoft.Features](../permissions/management-and-governance.md#microsoftfeatures)/providers/features/register/action | Registers the feature for a subscription in a given resource provider. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/diagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/logDefinitions/read | Read log definitions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricdefinitions/read | Read metric definitions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/* |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you create, read, update, delete and manage keys of Cognitive Services.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/25fbc0a9-bd7c-42a3-aa1a-3b75d497ee68",
  "name": "25fbc0a9-bd7c-42a3-aa1a-3b75d497ee68",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.CognitiveServices/*",
        "Microsoft.Features/features/read",
        "Microsoft.Features/providers/features/read",
        "Microsoft.Features/providers/features/register/action",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/diagnosticSettings/*",
        "Microsoft.Insights/logDefinitions/read",
        "Microsoft.Insights/metricdefinitions/read",
        "Microsoft.Insights/metrics/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Custom Vision Contributor

Full access to the project, including the ability to view, create, edit, or delete projects.

[Learn more](/azure/ai-services/custom-vision-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access to the project, including the ability to view, create, edit, or delete projects.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/c1ff6cc2-c111-46fe-8896-e0ef812ad9f3",
  "name": "c1ff6cc2-c111-46fe-8896-e0ef812ad9f3",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Custom Vision Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Custom Vision Deployment

Publish, unpublish or export models. Deployment can view the project but can't update.

[Learn more](/azure/ai-services/custom-vision-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/predictions/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/iterations/publish/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/iterations/export/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/quicktest/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/classify/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/detect/* |  |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/export/read | Exports a project. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Publish, unpublish or export models. Deployment can view the project but can't update.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5c4089e1-6d96-4d2f-b296-c1bc7137275f",
  "name": "5c4089e1-6d96-4d2f-b296-c1bc7137275f",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/*/read",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/predictions/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/publish/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/export/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/quicktest/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/classify/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/detect/*"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/export/read"
      ]
    }
  ],
  "roleName": "Cognitive Services Custom Vision Deployment",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Custom Vision Labeler

View, edit training images and create, add, remove, or delete the image tags. Labelers can view the project but can't update anything other than training images and tags.

[Learn more](/azure/ai-services/custom-vision-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/predictions/query/action | Get images that were sent to your prediction endpoint. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/images/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/tags/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/images/suggested/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/tagsandregions/suggestions/action | This API will get suggested tags and regions for an array/batch of untagged images along with confidences for the tags. It returns an empty array if no tags are found. |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/export/read | Exports a project. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View, edit training images and create, add, remove, or delete the image tags. Labelers can view the project but can't update anything other than training images and tags.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/88424f51-ebe7-446f-bc41-7fa16989e96c",
  "name": "88424f51-ebe7-446f-bc41-7fa16989e96c",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/*/read",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/predictions/query/action",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/images/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/tags/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/images/suggested/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/tagsandregions/suggestions/action"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/export/read"
      ]
    }
  ],
  "roleName": "Cognitive Services Custom Vision Labeler",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Custom Vision Reader

Read-only actions in the project. Readers can't create or update the project.

[Learn more](/azure/ai-services/custom-vision-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/predictions/query/action | Get images that were sent to your prediction endpoint. |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/export/read | Exports a project. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read-only actions in the project. Readers can't create or update the project.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/93586559-c37d-4a6b-ba08-b9f0940c2d73",
  "name": "93586559-c37d-4a6b-ba08-b9f0940c2d73",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/*/read",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/predictions/query/action"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/export/read"
      ]
    }
  ],
  "roleName": "Cognitive Services Custom Vision Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Custom Vision Trainer

View, edit projects and train the models, including the ability to publish, unpublish, export the models. Trainers can't create or delete the project.

[Learn more](/azure/ai-services/custom-vision-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/* |  |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/action | Create a project. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/delete | Delete a specific project. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/import/action | Imports a project. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/export/read | Exports a project. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View, edit projects and train the models, including the ability to publish, unpublish, export the models. Trainers can't create or delete the project.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0a5ae4ab-0d65-4eeb-be61-29fc9b54394b",
  "name": "0a5ae4ab-0d65-4eeb-be61-29fc9b54394b",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/*"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/action",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/delete",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/import/action",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/export/read"
      ]
    }
  ],
  "roleName": "Cognitive Services Custom Vision Trainer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Data Reader (Preview)

Lets you read Cognitive Services data.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read Cognitive Services data.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b59867f0-fa02-499b-be73-45a86b5b3e1c",
  "name": "b59867f0-fa02-499b-be73-45a86b5b3e1c",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Data Reader (Preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Face Recognizer

Lets you perform detect, verify, identify, group, and find similar operations on Face API. This role does not allow create or delete operations, which makes it well suited for endpoints that only need inferencing capabilities, following 'least privilege' best practices.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/detect/action | Detect human faces in an image, return face rectangles, and optionally with faceIds, landmarks, and attributes. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/verify/action | Verify whether two faces belong to a same person or whether one face belongs to a person. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/identify/action | 1-to-many identification to find the closest matches of the specific query person face from a person group or large person group. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/group/action | Divide candidate faces into groups based on face similarity. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/findsimilars/action | Given query face's faceId, to search the similar-looking faces from a faceId array, a face list or a large face list. faceId |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/detectliveness/multimodal/action | <p>Performs liveness detection on a target face in a sequence of infrared, color and/or depth images, and returns the liveness classification of the target face as either &lsquo;real face&rsquo;, &lsquo;spoof face&rsquo;, or &lsquo;uncertain&rsquo; if a classification cannot be made with the given inputs.</p> |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/detectliveness/singlemodal/action | <p>Performs liveness detection on a target face in a sequence of images of the same modality (e.g. color or infrared), and returns the liveness classification of the target face as either &lsquo;real face&rsquo;, &lsquo;spoof face&rsquo;, or &lsquo;uncertain&rsquo; if a classification cannot be made with the given inputs.</p> |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/detectlivenesswithverify/singlemodal/action | Detects liveness of a target face in a sequence of images of the same stream type (e.g. color) and then compares with VerifyImage to return confidence score for identity scenarios. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/*/sessions/action |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/*/sessions/delete |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/*/sessions/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/*/sessions/audit/read |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you perform detect, verify, identify, group, and find similar operations on Face API. This role does not allow create or delete operations, which makes it well suited for endpoints that only need inferencing capabilities, following 'least privilege' best practices.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/9894cab4-e18a-44aa-828b-cb588cd6f2d7",
  "name": "9894cab4-e18a-44aa-828b-cb588cd6f2d7",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/Face/detect/action",
        "Microsoft.CognitiveServices/accounts/Face/verify/action",
        "Microsoft.CognitiveServices/accounts/Face/identify/action",
        "Microsoft.CognitiveServices/accounts/Face/group/action",
        "Microsoft.CognitiveServices/accounts/Face/findsimilars/action",
        "Microsoft.CognitiveServices/accounts/Face/detectliveness/multimodal/action",
        "Microsoft.CognitiveServices/accounts/Face/detectliveness/singlemodal/action",
        "Microsoft.CognitiveServices/accounts/Face/detectlivenesswithverify/singlemodal/action",
        "Microsoft.CognitiveServices/accounts/Face/*/sessions/action",
        "Microsoft.CognitiveServices/accounts/Face/*/sessions/delete",
        "Microsoft.CognitiveServices/accounts/Face/*/sessions/read",
        "Microsoft.CognitiveServices/accounts/Face/*/sessions/audit/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Face Recognizer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Metrics Advisor Administrator

Full access to the project, including the system level configuration.

[Learn more](/azure/ai-services/metrics-advisor/how-tos/alerts)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/MetricsAdvisor/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access to the project, including the system level configuration.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/cb43c632-a144-4ec5-977c-e80c4affc34a",
  "name": "cb43c632-a144-4ec5-977c-e80c4affc34a",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/MetricsAdvisor/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Metrics Advisor Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services OpenAI Contributor

Full access including the ability to fine-tune, deploy and generate text

[Learn more](/azure/ai-services/openai/how-to/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/deployments/write | Writes deployments. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/deployments/delete | Deletes deployments. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/raiPolicies/read | Gets all applicable policies under the account including default policies. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/raiPolicies/write | Create or update a custom Responsible AI policy. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/raiPolicies/delete | Deletes a custom Responsible AI policy that's not referenced by an existing deployment. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/commitmentplans/read | Reads commitment plans. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/commitmentplans/write | Writes commitment plans. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/commitmentplans/delete | Deletes commitment plans. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access including the ability to fine-tune, deploy and generate text",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a001fd3d-188f-4b5d-821b-7da978bf7442",
  "name": "a001fd3d-188f-4b5d-821b-7da978bf7442",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.CognitiveServices/accounts/deployments/write",
        "Microsoft.CognitiveServices/accounts/deployments/delete",
        "Microsoft.CognitiveServices/accounts/raiPolicies/read",
        "Microsoft.CognitiveServices/accounts/raiPolicies/write",
        "Microsoft.CognitiveServices/accounts/raiPolicies/delete",
        "Microsoft.CognitiveServices/accounts/commitmentplans/read",
        "Microsoft.CognitiveServices/accounts/commitmentplans/write",
        "Microsoft.CognitiveServices/accounts/commitmentplans/delete",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/OpenAI/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services OpenAI Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services OpenAI User

Read access to view files, models, deployments. The ability to create completion and embedding calls.

[Learn more](/azure/ai-services/openai/how-to/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/engines/completions/action | Create a completion from a chosen model |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/engines/search/action | Search for the most relevant documents using the current engine. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/engines/generate/action | (Intended for browsers only.) Stream generated text from the model via GET request. This method is provided because the browser-native EventSource method can only send GET requests. It supports a more limited set of configuration options than the POST variant. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/audio/action | Return the transcript or translation for a given audio file. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/search/action | Search for the most relevant documents using the current engine. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/completions/action | Create a completion from a chosen model. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/chat/completions/action | Creates a completion for the chat message |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/extensions/chat/completions/action | Creates a completion for the chat message with extensions |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/embeddings/action | Return the embeddings for a given prompt. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/images/generations/action | Create image generations. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Ability to view files, models, deployments. Readers can't make any changes They can inference and create images",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5e0bd9bd-7b93-4f28-af87-19fc36ad61bd",
  "name": "5e0bd9bd-7b93-4f28-af87-19fc36ad61bd",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/OpenAI/*/read",
        "Microsoft.CognitiveServices/accounts/OpenAI/engines/completions/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/engines/search/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/engines/generate/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/audio/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/search/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/completions/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/chat/completions/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/extensions/chat/completions/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/embeddings/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/images/generations/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services OpenAI User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services QnA Maker Editor

Let's you create, edit, import and export a KB. You cannot publish or delete a KB.

[Learn more](/azure/ai-services/qnamaker/)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebaser. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/create/write | Asynchronous operation to create a new knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/write | Asynchronous operation to modify a knowledgebase or Replace knowledgebase contents. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/train/action | Train call to add suggestions to the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/alterations/write | Replace alterations data. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointkeys/refreshkeys/action | Re-generates an endpoint key. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointsettings/read | Gets endpoint settings for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointsettings/write | Update endpoint seettings for an endpoint. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/operations/read | Gets details of a specific long running operation. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebaser. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/create/write | Asynchronous operation to create a new knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/write | Asynchronous operation to modify a knowledgebase or Replace knowledgebase contents. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/train/action | Train call to add suggestions to the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/alterations/write | Replace alterations data. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointkeys/refreshkeys/action | Re-generates an endpoint key. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointsettings/read | Gets endpoint settings for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointsettings/write | Update endpoint seettings for an endpoint. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/operations/read | Gets details of a specific long running operation. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebaser. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/create/write | Asynchronous operation to create a new knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/write | Asynchronous operation to modify a knowledgebase or Replace knowledgebase contents. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/train/action | Train call to add suggestions to the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/alterations/write | Replace alterations data. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointkeys/refreshkeys/action | Re-generates an endpoint key. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointsettings/read | Gets endpoint settings for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointsettings/write | Update endpoint seettings for an endpoint. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/operations/read | Gets details of a specific long running operation. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Let's you create, edit, import and export a KB. You cannot publish or delete a KB.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f4cc2bf9-21be-47a1-bdf1-5c5804381025",
  "name": "f4cc2bf9-21be-47a1-bdf1-5c5804381025",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/create/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/train/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker/alterations/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/alterations/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointkeys/refreshkeys/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointsettings/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointsettings/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker/operations/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/create/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/train/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/alterations/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/alterations/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointkeys/refreshkeys/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointsettings/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointsettings/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/operations/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/create/write",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/write",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/train/action",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/alterations/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/alterations/write",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointkeys/refreshkeys/action",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointsettings/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointsettings/write",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/operations/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services QnA Maker Editor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services QnA Maker Reader

Let's you read and test a KB only.

[Learn more](/azure/ai-services/qnamaker/)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebaser. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointsettings/read | Gets endpoint settings for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebaser. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointsettings/read | Gets endpoint settings for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebaser. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointsettings/read | Gets endpoint settings for an endpoint |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Let's you read and test a KB only.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/466ccd10-b268-4a11-b098-b4849f024126",
  "name": "466ccd10-b268-4a11-b098-b4849f024126",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker/alterations/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointsettings/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/alterations/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointsettings/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/alterations/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointsettings/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services QnA Maker Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Usages Reader

Minimal permission to view Cognitive Services usages.

[Learn more](/azure/ai-services/openai/how-to/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/locations/usages/read | Read all usages data |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Minimal permission to view Cognitive Services usages.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/bba48692-92b0-4667-a9ad-c31c7b334ac2",
  "name": "bba48692-92b0-4667-a9ad-c31c7b334ac2",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/locations/usages/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Usages Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services User

Lets you read and list keys of Cognitive Services.

[Learn more](/azure/ai-services/authentication)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/listkeys/action | List keys |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/read | Read a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/diagnosticSettings/read | Read a resource diagnostic setting |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/logDefinitions/read | Read log definitions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricdefinitions/read | Read metric definitions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read and list keys of Cognitive Services.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a97b65f3-24c7-4388-baec-2e87135dc908",
  "name": "a97b65f3-24c7-4388-baec-2e87135dc908",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.CognitiveServices/accounts/listkeys/action",
        "Microsoft.Insights/alertRules/read",
        "Microsoft.Insights/diagnosticSettings/read",
        "Microsoft.Insights/logDefinitions/read",
        "Microsoft.Insights/metricdefinitions/read",
        "Microsoft.Insights/metrics/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Search Index Data Contributor

Grants full access to Azure Cognitive Search index data.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Search](../permissions/ai-machine-learning.md#microsoftsearch)/searchServices/indexes/documents/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants full access to Azure Cognitive Search index data.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8ebe5a00-799e-43f5-93ac-243d3dce84a7",
  "name": "8ebe5a00-799e-43f5-93ac-243d3dce84a7",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Search/searchServices/indexes/documents/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Search Index Data Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Search Index Data Reader

Grants read access to Azure Cognitive Search index data.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Search](../permissions/ai-machine-learning.md#microsoftsearch)/searchServices/indexes/documents/read | Read documents or suggested query terms from an index. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants read access to Azure Cognitive Search index data.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/1407120a-92aa-4202-b7e9-c0e197c71c8f",
  "name": "1407120a-92aa-4202-b7e9-c0e197c71c8f",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Search/searchServices/indexes/documents/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Search Index Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Search Service Contributor

Lets you manage Search services, but not access to them.

[Learn more](/azure/search/search-security-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Search](../permissions/ai-machine-learning.md#microsoftsearch)/searchServices/* | Create and manage search services |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Search services, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7ca78c08-252a-4471-8644-bb5ff32d4ba0",
  "name": "7ca78c08-252a-4471-8644-bb5ff32d4ba0",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Search/searchServices/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Search Service Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)
