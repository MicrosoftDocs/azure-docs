---
title: Tag ARO resources using Azure Policy
description: Learn how to tag ARO resources in a cluster's resource group using Azure Policy
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 08/30/2023
author: johnmarco
ms.author: johnmarc
keywords: aro, openshift, cli, tagging
#Customer intent: I need to understand how to use Azure Policy to tag resources in a cluster's resource group.
---

# Tag Azure Red Hat OpenShift resources using Azure Policy

This article shows you how to use Azure Policy to tag the resources in an ARO cluster's resource group. The process involves creating a policy assignment and an ARO cluster through the Azure CLI.

## Create JSON files

Using Azure CLI, follow these steps to create three separate JSON files in your current working directory:

1. Create a JSON file named `rules.json` by copying and pasting the following content:

    ```
    {
      "if": {
        "anyOf": [
          {
            "allOf": [
              {
                "value": "[resourceGroup().name]",
                "equals": "[parameters('resourceGroupName')]"
              }
            ]
          },
          {
            "allOf": [
              {
                "field": "name",
                "equals": "[parameters('resourceGroupName')]"
              },
    {
    	     "field": "type",
    	     "equals": "Microsoft.Resources/subscriptions/resourceGroups"
    }
            ]
          }
        ]
      },
      "then": {
        "details": {
          "operations": [
            {
              "condition": "[not(equals(parameters('tag0')['tag'][0], ''))]",
              "field": "[concat('tags[', parameters('tag0')['tag'][0], ']')]",
              "operation": "addOrReplace",
              "value": "[parameters('tag0')['tag'][1]]"
            },
            {
              "condition": "[not(equals(parameters('tag1')['tag'][0], ''))]",
              "field": "[concat('tags[', parameters('tag1')['tag'][0], ']')]",
              "operation": "addOrReplace",
              "value": "[parameters('tag1')['tag'][1]]"
            },
            {
              "condition": "[not(equals(parameters('tag2')['tag'][0], ''))]",
              "field": "[concat('tags[', parameters('tag2')['tag'][0], ']')]",
              "operation": "addOrReplace",
              "value": "[parameters('tag2')['tag'][1]]"
            },
            {
              "condition": "[not(equals(parameters('tag3')['tag'][0], ''))]",
              "field": "[concat('tags[', parameters('tag3')['tag'][0], ']')]",
              "operation": "addOrReplace",
              "value": "[parameters('tag3')['tag'][1]]"
            },
            {
              "condition": "[not(equals(parameters('tag4')['tag'][0], ''))]",
              "field": "[concat('tags[', parameters('tag4')['tag'][0], ']')]",
              "operation": "addOrReplace",
              "value": "[parameters('tag4')['tag'][1]]"
            },
            {
              "condition": "[not(equals(parameters('tag5')['tag'][0], ''))]",
              "field": "[concat('tags[', parameters('tag5')['tag'][0], ']')]",
              "operation": "addOrReplace",
              "value": "[parameters('tag5')['tag'][1]]"
            },
            {
              "condition": "[not(equals(parameters('tag6')['tag'][0], ''))]",
              "field": "[concat('tags[', parameters('tag6')['tag'][0], ']')]",
              "operation": "addOrReplace",
              "value": "[parameters('tag6')['tag'][1]]"
            },
            {
              "condition": "[not(equals(parameters('tag7')['tag'][0], ''))]",
              "field": "[concat('tags[', parameters('tag7')['tag'][0], ']')]",
              "operation": "addOrReplace",
              "value": "[parameters('tag7')['tag'][1]]"
            },
            {
              "condition": "[not(equals(parameters('tag8')['tag'][0], ''))]",
              "field": "[concat('tags[', parameters('tag8')['tag'][0], ']')]",
              "operation": "addOrReplace",
              "value": "[parameters('tag8')['tag'][1]]"
            },
            {
              "condition": "[not(equals(parameters('tag9')['tag'][0], ''))]",
              "field": "[concat('tags[', parameters('tag9')['tag'][0], ']')]",
              "operation": "addOrReplace",
              "value": "[parameters('tag9')['tag'][1]]"
            }
          ],
          "roleDefinitionIds": [
            "/providers/Microsoft.Authorization/roleDefinitions/4a9ae827-6dc8-4573-8ac7-8239d42aa03f"
          ]
        },
        "effect": "modify"
      }
    }
    ```
    
1. Create a JSON file named `param-defs.json` by copying and pasting the following content:

    ```
    {
      "tag0": {
        "type": "Object",
        "metadata": {
          "displayName": "tag0"
        },
        "defaultValue": {
          "tag": [
            "",
            ""
          ]
        },
        "schema": {
          "type": "object",
          "properties": {
            "tag": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "maxItems": 2,
              "minItems": 2
            }
          }
        }
      },
      "tag1": {
        "type": "Object",
        "metadata": {
          "displayName": "tag1"
        },
        "defaultValue": {
          "tag": [
            "",
            ""
          ]
        },
        "schema": {
          "type": "object",
          "properties": {
            "tag": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "maxItems": 2,
              "minItems": 2
            }
          }
        }
      },
      "tag2": {
        "type": "Object",
        "metadata": {
          "displayName": "tag2"
        },
        "defaultValue": {
          "tag": [
            "",
            ""
          ]
        },
        "schema": {
          "type": "object",
          "properties": {
            "tag": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "maxItems": 2,
              "minItems": 2
            }
          }
        }
      },
      "tag3": {
        "type": "Object",
        "metadata": {
          "displayName": "tag3"
        },
        "defaultValue": {
          "tag": [
            "",
            ""
          ]
        },
        "schema": {
          "type": "object",
          "properties": {
            "tag": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "maxItems": 2,
              "minItems": 2
            }
          }
        }
      },
      "tag4": {
        "type": "Object",
        "metadata": {
          "displayName": "tag4"
        },
        "defaultValue": {
          "tag": [
            "",
            ""
          ]
        },
        "schema": {
          "type": "object",
          "properties": {
            "tag": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "maxItems": 2,
              "minItems": 2
            }
          }
        }
      },
      "tag5": {
        "type": "Object",
        "metadata": {
          "displayName": "tag5"
        },
        "defaultValue": {
          "tag": [
            "",
            ""
          ]
        },
        "schema": {
          "type": "object",
          "properties": {
            "tag": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "maxItems": 2,
              "minItems": 2
            }
          }
        }
      },
      "tag6": {
        "type": "Object",
        "metadata": {
          "displayName": "tag6"
        },
        "defaultValue": {
          "tag": [
            "",
            ""
          ]
        },
        "schema": {
          "type": "object",
          "properties": {
            "tag": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "maxItems": 2,
              "minItems": 2
            }
          }
        }
      },
      "tag7": {
        "type": "Object",
        "metadata": {
          "displayName": "tag7"
        },
        "defaultValue": {
          "tag": [
            "",
            ""
          ]
        },
        "schema": {
          "type": "object",
          "properties": {
            "tag": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "maxItems": 2,
              "minItems": 2
            }
          }
        }
      },
      "tag8": {
        "type": "Object",
        "metadata": {
          "displayName": "tag8"
        },
        "defaultValue": {
          "tag": [
            "",
            ""
          ]
        },
        "schema": {
          "type": "object",
          "properties": {
            "tag": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "maxItems": 2,
              "minItems": 2
            }
          }
        }
      },
      "tag9": {
        "type": "Object",
        "metadata": {
          "displayName": "tag9"
        },
        "defaultValue": {
          "tag": [
            "",
            ""
          ]
        },
        "schema": {
          "type": "object",
          "properties": {
            "tag": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "maxItems": 2,
              "minItems": 2
            }
          }
        }
      },
      "resourceGroupName": {
        "type": "String",
        "metadata": {
          "displayName": "Resource Group Name",
          "description": "The name of the resource group whose resources you'd like to require the tag on"
        }
      }
    }
    ```
    
1. Create a JSON file named `param-values.json` by copying, pasting, **and modifying** the following content:
    
    ```
    {
      "tag0": {
        "value": {
          "tag": [
            "<your tag key here>",
            "<your tag value here>"
          ]
        }
      },
      "resourceGroupName": {
        "value": "<your ARO cluster's managed resource group name here>"
      }
    }
    ```
 
    This JSON file is the only one of the three files that must be modified. In the content, specify the values for the tags you want applied to the cluster's resources.

    > [!IMPORTANT]
    > The file content provided above only provides a value for the `tag0` parameter. The policy allows you to provide up to 10 tags, so if you want to set more than one tag, add values for parameters tag1 through tag 9. Applying more than 10 tags to resources in the managed resource group is not supported.
> 

## Set environmental variables

Open a shell session and run the following commands to set environmental variables to be used in later steps:

```
export AZURE_SUBSCRIPTION_ID=<your Azure subscription ID here>
export POLICY_DEFINITION=<your policy definition name here>
export CLUSTER=<your ARO cluster name here>
export MANAGED_RESOURCE_GROUP=<your ARO cluster's managed resource group name here>

export POLICY_ASSIGNMENT="${POLICY_DEFINITION}-${CLUSTER}"

# This will be used to determine the region in which the policy assignment's managed identity is created.
# (See here for more info about the managed identity: https://learn.microsoft.com/en-us/azure/governance/policy/how-to/remediate-resources?tabs=azure-portal#configure-the-managed-identity)
export LOCATION=<the Azure region you want to use here>
```

## Create the policy definition and assignment

1. Run the following command to create the policy definition:

    ```
    az policy definition create -n $POLICY_DEFINITION \
        --mode All \
        --rules rules.json \
        --params param-defs.json
    ```

1. Run the following command to create the policy assignment:

    ```
     az policy assignment create -n $POLICY_ASSIGNMENT \
    	--policy $POLICY_DEFINITION \
    	--scope "/subscriptions/${AZURE_SUBSCRIPTION_ID}" \
    	--location $LOCATION \
    	--mi-system-assigned \
    	--role "Tag Contributor" \
    	--identity-scope "/subscriptions/${AZURE_SUBSCRIPTION_ID}" \
    	--params param-values.json
    ```
    
## Create the ARO cluster

Follow the [instructions to create a new ARO cluster](tutorial-create-cluster.md). Be sure to pass the parameter `--cluster-resource-group $MANAGED_RESOURCE_GROUP` to the `az aro create` command when creating the cluster.

> [!NOTE]
> The Policy does not apply any tags to the user-supplied virtual network.
> 

## Remediate tags using Azure Policy

You can remediate previously assigned tags and add new tags using an Azure Policy remediation task.

> [!NOTE]
> These instructions assume you've followed the previous steps to create a policy assignment and a cluster, and that you're in the directory containing the JSON files created in those steps.
> 
1. Set some environmental variables to be used in later steps. You can skip this step if you're still in the same shell session you used to create the policy assignment and the cluster:

    ```
    export POLICY_DEFINITION=<your policy definition name here>
    export CLUSTER=<your ARO cluster name here>
    
    export POLICY_ASSIGNMENT="${POLICY_DEFINITION}-${CLUSTER}"
    ```
    
1. Open the file `param-values.json`. Modify existing parameters values and add new parameter values as desired to specify the new set of tags the policy should apply when you run the remediation task. Then run the following command to actually update the parameter values:
 
    ```
    az policy assignment update -n $POLICY_ASSIGNMENT
    	--params param-values.json
    ```
1. Trigger the remediation task:

    ```
    az policy assignment update -n $POLICY_ASSIGNMENT
    	--params param-values.json
    ```

1. Allow the remediation task time to run and observe the tags being updated on the managed resource group and its resources. 
>[!Note]
>Remediation tasks never remove tags—they only add or update tags.
