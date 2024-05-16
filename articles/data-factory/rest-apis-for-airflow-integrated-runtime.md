---
title: REST APIs for the Workflow Orchestration Manager integration runtime
description: This article documents the REST APIs for the Workflow Orchestration Manager integration runtime.
ms.service: data-factory
ms.topic: reference
author: nabhishek
ms.author: abnarain
ms.date: 08/09/2023
---

# REST APIs for the Workflow Orchestration Manager integration runtime

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

> [!NOTE]
> Workflow Orchestration Manager is powered by Apache Airflow.

This article documents the REST APIs for the Azure Data Factory Workflow Orchestration Manager integration runtime.

> [!NOTE]
> Workflow Orchestration Manager for Azure Data Factory relies on the open-source Apache Airflow application. You can find documentation and more tutorials for Airflow on the Apache Airflow [Documentation](https://airflow.apache.org/docs/) or [Community](https://airflow.apache.org/community/) webpages.

## Create a new environment

- **Method**: PUT
- **URL**: ```https://management.azure.com/subscriptions/<subscriptionid>/resourcegroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<datafactoryName>/integrationruntimes/<airflowEnvName>?api-version=2018-06-01```
- **URI parameters**:

  |Name  |In  |Required  |Type  |Description  |
  |---------|---------|---------|---------|---------|
  |Subscription Id     | path        | True        | string        | Subscription identifier        |
  |ResourceGroup Name     |  path       | True        | string        | Resource group name (Regex pattern: ```^[-\w\._\(\)]+$```)        |
  |dataFactoryName     |  path       | True        | string        | Name of the Azure Data Factory instance (Regex pattern: ```^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$```        |
  |airflowEnvName     | path        | True        | string        | Name of the Workflow Orchestration Manager environment        |
  |Api-version     | query        | True        | string        | The API version        |

- **Request body (Airflow configuration)**:

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |name     |string         |Name of the Airflow environment         |
  |properties     |propertyType         |Configuration properties for the environment         |

- **Properties type**:

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |Type     |string         |The resource type (**Airflow** in this scenario)         |
  |typeProperties     |typeProperty         |Airflow         |

- **Type property**:

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |computeProperties     |computeProperty         |Configuration of the compute type used for the environment         |
  |airflowProperties     |airflowProperty         |Configuration of the Airflow properties for the environment         |

- **Compute property**:

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |location     |string         |The Airflow integration runtime location defaults to the data factory region. To create an integration runtime in a different region, create a new data factory in the required region.         |
  | computeSize | string |The size of the compute node you want your Airflow environment to run on. Examples are Large or Small. Three nodes are allocated initially. |
  | extraNodes | integer |Each extra node adds three more workers. |

- **Airflow property**:

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |airflowVersion | string | Current version of Airflow. For example, 2.4.3. |
  |airflowRequirements | Array\<string\> | Python libraries you want to use. For example, ["flask-bcrypy=0.7.1"]. Can be a comma-delimited list. |
  |airflowEnvironmentVariables | Object (Key/Value pair) | Environment variables you want to use. For example, { "SAMPLE_ENV_NAME": "test" }. |
  |gitSyncProperties | gitSyncProperty | Git configuration properties. |
  |enableAADIntegration | boolean | Allows Microsoft Entra ID to log in to Airflow. |
  |userName | string or null | Username for Basic Authentication. |
  |password | string or null | Password for Basic Authentication. |

- **Git sync property**:

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |gitServiceType | string | The Git service where your desired repository is located. Values are GitHub, ADO, GitLab, or BitBucket. |
  |gitCredentialType | string | Type of Git credential. Values are PAT (for personal access token) and None. |
  |repo | string | Repository link. |
  |branch | string | Branch to use in the repository. |
  |username | string | GitHub username. |
  |Credential | string | Value of the PAT. |

- **Responses**:

  |Name  |Status code  |Type  |Description |
  |---------|---------|---------|----------|
  |Accepted | 200 | [Factory](/rest/api/datafactory/factories/get?tabs=HTTP#factory) | OK |
  |Unauthorized | 401 | [Cloud Error](/rest/api/datafactory/factories/get?tabs=HTTP#clouderror) | Array with more error details |

## Import DAGs

- **Method**: POST
- **URL**: ```https://management.azure.com/subscriptions/<subscriptionid>/resourcegroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<dataFactoryName>/airflow/sync?api-version=2018-06-01```
- **Request body**:

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |IntegrationRuntimeName | string | Airflow environment name. |
  |LinkedServiceName | string | Azure Blob Storage account name where DAGs to be imported are located. |
  |StorageFolderPath | string | Path to the folder in Azure Blob Storage with the DAGs. |
  |Overwrite | boolean | Overwrite the existing DAGs (Default=True). |
  |CopyFolderStructure | boolean | Controls whether the folder structure is copied or not. |
  |AddRequirementsFromFile | boolean | Add requirements from the DAG files |

- **Responses**:

  |Name  |Status code  |Type  |Description |
  |---------|---------|---------|----------|
  |Accepted | 200 | [Factory](/rest/api/datafactory/factories/get?tabs=HTTP#factory) | OK |
  |Unauthorized | 401 | [Cloud Error](/rest/api/datafactory/factories/get?tabs=HTTP#clouderror) | Array with more error details |

## Examples

Review the following examples.

### Create a new environment by using REST APIs

Sample request:

```rest
HTTP
PUT https://management.azure.com/subscriptions/222f1459-6ebd-4896-82ab-652d5f6883cf/resourcegroups/abnarain-rg/providers/Microsoft.DataFactory/factories/ambika-df/integrationruntimes/sample-2?api-version=2018-06-01
```

Sample body:

```rest
{
   "name": "sample-2",
   "properties": {
      "type": "Airflow",
      "typeProperties": {
         "computeProperties": {
            "location": "East US",
            "computeSize": "Large",
            "extraNodes": 0
         },
         "airflowProperties": {
            "airflowVersion": "2.4.3",
            "airflowEnvironmentVariables": {
               "AIRFLOW__TEST__TEST": "test"
            },
            "airflowRequirements": [
               "apache-airflow-providers-microsoft-azure"
            ],
            "enableAADIntegration": true,
            "userName": null,
            "password": null,
            "airflowEntityReferences": []
         }
      }
   }
}
```

Sample response:

```rest
Status code: 200 OK
```

Response body:

```rest
{
   "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/your-rg/providers/Microsoft.DataFactory/factories/your-df/integrationruntimes/sample-2",
   "name": "sample-2",
   "type": "Microsoft.DataFactory/factories/integrationruntimes",
   "properties": {
      "type": "Airflow",
      "typeProperties": {
         "computeProperties": {
            "location": "East US",
            "computeSize": "Large",
            "extraNodes": 0
         },
         "airflowProperties": {
            "airflowVersion": "2.4.3",
            "pythonVersion": "3.8",
            "airflowEnvironmentVariables": {
               "AIRFLOW__TEST__TEST": "test"
            },
            "airflowWebUrl": "https://e57f7409041692.eastus.airflow.svc.datafactory.azure.com/login/",
            "airflowRequirements": [
               "apache-airflow-providers-microsoft-azure"
            ],
            "airflowEntityReferences": [],
            "packageProviderPath": "plugins",
            "enableAADIntegration": true,
            "enableTriggerers": false
         }
      },
      "state": "Initial"
   },
   "etag": "3402279e-0000-0100-0000-64ecb1cb0000"
}
```

### Import DAGs

Sample request:

```rest
HTTP

POST https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/your-rg/providers/Microsoft.DataFactory/factories/your-df/airflow/sync?api-version=2018-06-01
```

Sample body:

```rest
{
   "IntegrationRuntimeName": "sample-2",
   "LinkedServiceName": "AzureBlobStorage1",
   "StorageFolderPath": "your-container/airflow",
   "CopyFolderStructure": true,
   "Overwrite": true,
   "AddRequirementsFromFile": true
}
```

Sample response:

```rest
Status Code: 202
```
