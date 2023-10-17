---
title: Sync a GitHub repository with Managed Airflow
description: This article provides step-by-step instructions for how to sync a GitHub repository using Managed Airflow in Azure Data Factory.
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.topic: how-to
ms.date: 09/19/2023
---

# Sync a GitHub repository with Managed Airflow in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

While you can certainly manually create and update Directed Acyclic Graph (DAG) files for Azure Managed Apache Airflow using the Azure Storage or using the [Azure CLI](/azure/storage/blobs/storage-quickstart-blobs-cli), many organizations prefer to streamline their processes using a Continuous Integration and Continuous Delivery (CI/CD) approach. In this scenario, each commit made to the source code repository triggers an automated workflow that synchronizes the code with the designated DAGs folder within Azure Managed Apache Airflow.

In this guide, you will learn how to synchronize your GitHub repository in Managed Airflow in two different ways.

- Using the Git Sync feature in the Managed Airflow UI
- Using the Rest API

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin. Create or select an existing [Data Factory](https://azure.microsoft.com/products/data-factory#get-started) in a [region where the Managed Airflow preview is supported](concept-managed-airflow.md#region-availability-public-preview).
- **Access to a GitHub repository**

## Using the Managed Airflow UI

The following steps describe how to sync your GitHub repository using Managed Airflow UI:

1. Ensure your repository contains the necessary folders and files.
   - **Dags/** - for Apache Airflow Dags (required)
   - **Plugins/** - for integrating external features to Airflow.
     :::image type="content" source="media/airflow-git-sync-repository/airflow-folders.png" alt-text="Screenshot showing the Airflow folders structure in GitHub.":::

1. While creating an Airflow integrated runtime (IR), select **Enable git sync** on the Airflow environment setup dialog.

   :::image type="content" source="media/airflow-git-sync-repository/enable-git-sync.png" alt-text="Screenshot showing the Enable git sync checkbox on the Airflow environment setup dialog that appears during creation of an Airflow IR.":::

1. Select one of the following supported git service types:
   - GitHub
   - ADO
   - GitLab
   - Bitbucket
   
   :::image type="content" source="media/airflow-git-sync-repository/git-service-type.png" alt-text="Screenshot showing the Git service type selection dropdown on the Airflow environment setup dialog that appears during creation of an Airflow IR.":::

1. Select credential type:

   - **None** (for a public repo) 
     When you select this option, make sure to make your repository’s visibility is public. Once you select this option, fill out the details: 
     - **Git Repo URL** (required): The clone URL for your desired GitHub repository
     - **Git branch** (required): The current branch, where your desired git repository is located
   - **PAT** (Personal Access Token)
     Once you select this option, fill out the remaining fields based upon on the selected Git Service type:
     - GitHub Personal Access Token
     - ADO Personal Access Token
     - GitLab Personal Access Token
     - Bitbucket Personal Access Token
     :::image type="content" source="media/airflow-git-sync-repository/git-pat-credentials.png" alt-text="Screenshot showing the Git PAT credential options on the Airflow environment setup dialog that appears during creation of an Airflow IR.":::
   - **SPN** ([Service Principal Name](https://devblogs.microsoft.com/devops/introducing-service-principal-and-managed-identity-support-on-azure-devops/) - Only ADO supports this credential type.)
     Once you select this option, fill out the remaining fields based upon on the selected **Git service type**:
     - **Git repo URL** (Required): The clone URL to the git repository to sync
     - **Git branch** (Required): The branch in the repository to sync
     - **Service principal app id** (Required): The service principal app id with access to the ADO repo to sync
     - **Service principal secret** (Required): A manually generated secret in service principal whose value is to be used to authenticate and access the ADO repo
     - **Service principal tenant id** (Required): The service principal tenant id
     :::image type="content" source="media/airflow-git-sync-repository/git-spn-credentials.png" alt-text="Screenshot showing the Git SPN credential options on the Airflow environment setup dialog that appears during creation of an Airflow IR.":::

1. Fill in the rest of the fields with the required information.
1. Select Create.

## Using the REST API

The following steps describe how to sync your GitHub repository using the Rest APIs:

- **Method**: PUT
- **URL**: ```https://management.azure.com/subscriptions/<subscriptionid>/resourcegroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<datafactoryName>/integrationruntimes/<airflowEnvName>?api-version=2018-06-01```
- **URI parameters**:

  |Name  |In  |Required  |Type  |Description  |
  |---------|---------|---------|---------|---------|
  |Subscription Id     | path        | True        | string        | Subscription identifier        |
  |ResourceGroup Name     |  path       | True        | string        | Resource group name (Regex pattern: ```^[-\w\._\(\)]+$```)        |
  |dataFactoryName     |  path       | True        | string        | Name of the Azure Data Factory (Regex pattern: ```^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$```        |
  |airflowEnvName     | path        | True        | string        | Name of the Managed Airflow environment        |
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

- **Type property**

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |computeProperties     |computeProperty         |Configuration of the compute type used for the environment.         |
  |airflowProperties     |airflowProperty         |Configuration of the Airflow properties for the environment.         |

- **Compute property**

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |location     |string         |The Airflow integrated runtime location defaults to the data factory region. To create an integrated runtime in a different region, create a new data factory in the required region.         |
  | computeSize | string |The size of the compute node you want your Airflow environment to run on. Example: “Large”, “Small”. 3 nodes are allocated initially. |
  | extraNodes | integer |Each extra node adds 3 more workers. |

- **Airflow property**

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |airflowVersion | string | Current version of Airflow (Example: 2.4.3) |
  |airflowRequirements | Array\<string\> | Python libraries you wish to use. Example: ["flask-bcrypy=0.7.1"]. Can be a comma delimited list. |
  |airflowEnvironmentVariables | Object (Key/Value pair) | Environment variables you wish to use. Example: { “SAMPLE_ENV_NAME”: “test” } | 
  |gitSyncProperties | gitSyncProperty | Git configuration properties |
  |enableAADIntegration | boolean | Allows Microsoft Entra ID to login to Airflow |
  |userName | string or null | Username for Basic Authentication |
  |password | string or null | Password for Basic Authentication |

- **Git sync property**

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |gitServiceType | string | The Git service your desired repo is located in. Values: GitHub, AOD, GitLab, or BitBucket |
  |gitCredentialType | string | Type of Git credential. Values: PAT (for Personal Access Token), SPN (supported only by ADO), None |
  |repo | string | Repository link |
  |branch | string | Branch to use in the repository |
  |username | string | GitHub username |
  |Credential | string | Value of the Personal Access Token |
  |tenantId | string | The service principal tenant id (supported only by ADO) |

- **Responses**

  |Name  |Status code  |Type  |Description |
  |---------|---------|---------|----------|
  |Accepted | 200 | [Factory](/rest/api/datafactory/factories/get?tabs=HTTP#factory) | OK |
  |Unauthorized | 401 | [Cloud Error](/rest/api/datafactory/factories/get?tabs=HTTP#clouderror) | Array with additional error details |

### Examples

Sample request:

```rest
HTTP
PUT https://management.azure.com/subscriptions/222f1459-6ebd-4896-82ab-652d5f6883cf/resourcegroups/abnarain-rg/providers/Microsoft.DataFactory/factories/ambika-df/integrationruntimes/sample-2?api-version=2018-06-01
```

Sample Body:

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

Sample Response:

```rest
Status code: 200 OK
```

Response Body:

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

Here are some API payload examples:

- Git sync properties for GitHub with PAT: 
  ```rest
  "gitSyncProperties":  {
          "gitServiceType": "Github",
          "gitCredentialType": "PAT",
          "repo":  <repo url>,
          "branch": <repo branch to sync>,
          "username": <username>,
          "credential": <personal access token>
  }
  ```
 
- Git sync properties for ADO with PAT: 
  ```rest
  "gitSyncProperties":  {
          "gitServiceType": "ADO",
          "gitCredentialType": "PAT",
          "repo":  <repo url>,
          "branch": <repo branch to sync>,
          "username": <username>,
          "credential": <personal access token>
  }```
 
- Git sync properties for ADO with Service Principal: 
  ```rest
  "gitSyncProperties":  {
          "gitServiceType": "ADO",
          "gitCredentialType": "SPN",
          "repo":  <repo url>,
          "branch": <repo branch to sync>,
          "username": < service principal app id >,
          "credential": <service principal secret value>
          "tenantId": <service principal tenant id>
  }```
 
- Git sync properties for GitHub public repo: 
  ```rest
  "gitSyncProperties":  {
          "gitServiceType": "Github",
          "gitCredentialType": "None",
          "repo":  <repo url>,
          "branch": <repo branch to sync>
  }```

## Importing a private package with git-sync (Optional - only applies when using private packages)

Assuming your private package has already been auto synced via git-sync, all you need to do is add the package as a requirement in the data factory Airflow UI along with the path prefix _/opt/airflow/git/\<repoName\>/__ if you are connecting to an ADO repo or _/opt/airflow/git/\<repoName\>.git/_ for all other git services. For example, if your private package is in _/dags/test/private.whl_ in a GitHub repo, then you should add the requirement _/opt/airflow/git/\<repoName\>.git/dags/test/private.whl_ to the Airflow environment.

:::image type="content" source="media/airflow-git-sync-repository/airflow-private-package.png" alt-text="Screenshot showing the Airflow requirements section on the Airflow environment setup dialog that appears during creation of an Airflow IR.":::

## Next steps

- [Run an existing pipeline with Managed Airflow](tutorial-run-existing-pipeline-with-airflow.md)
- [Managed Airflow pricing](airflow-pricing.md)
- [How to change the password for Managed Airflow environments](password-change-airflow.md)
