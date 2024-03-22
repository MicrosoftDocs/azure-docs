---
title: Sync a GitHub repository in Workflow Orchestration Manager
description: This article provides step-by-step instructions for how to sync a GitHub repository by using Workflow Orchestration Manager in Azure Data Factory.
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.topic: how-to
ms.date: 09/19/2023
---

# Sync a GitHub repository in Workflow Orchestration Manager

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

> [!NOTE]
> Workflow Orchestration Manager is powered by Apache Airflow.

In this article, you learn how to synchronize your GitHub repository in Azure Data Factory Workflow Orchestration Manager in two different ways:

- By using **Enable git sync** in the Workflow Orchestration Manager UI.
- By using the Rest API.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin. Create or select an existing [Data Factory](https://azure.microsoft.com/products/data-factory#get-started) instance in a [region where the Workflow Orchestration Manager preview is supported](concepts-workflow-orchestration-manager.md#region-availability-public-preview).
- **GitHub repository**: You need access to a GitHub repository.

## Use the Workflow Orchestration Manager UI

To sync your GitHub repository by using the Workflow Orchestration Manager UI:

1. Ensure that your repository contains the necessary folders and files:
   - **Dags/**: For Apache Airflow directed acyclic graphs (DAGs) (required).
   - **Plugins/**: For integrating external features to Airflow.

     :::image type="content" source="media/airflow-git-sync-repository/airflow-folders.png" alt-text="Screenshot that shows the Airflow folders structure in GitHub.":::

1. When you create a Workflow Orchestration Manager integration runtime, select **Enable git sync** in the **Airflow environment setup** dialog.

   :::image type="content" source="media/airflow-git-sync-repository/enable-git-sync.png" alt-text="Screenshot that shows the Enable git sync checkbox in the Airflow environment setup dialog that appears during creation of an Airflow integration runtime.":::

1. Select one of the following supported Git service types:
   - **GitHub**
   - **ADO**
   - **GitLab**
   - **BitBucket**

   :::image type="content" source="media/airflow-git-sync-repository/git-service-type.png" alt-text="Screenshot that shows the Git service type selection dropdown in the  environment setup dialog that appears during creation of an Workflow Orchestration Manager integration runtime.":::

1. Select a credential type:

   - **None** (for a public repo): When you select this option, make sure that your repository's visibility is public. Then fill out the details:
     - **Git repo url** (required): The clone URL for the GitHub repository you want.
     - **Git branch** (required): The current branch, where the Git repository you want is located.
   - **Git personal access token**:
     After you select this option for a personal access token (PAT), fill out the remaining fields based on the selected **Git service type**:
     - GitHub personal access token
     - ADO personal access token
     - GitLab personal access token
     - BitBucket personal access token

     :::image type="content" source="media/airflow-git-sync-repository/git-pat-credentials.png" alt-text="Screenshot that shows the Git PAT credential options in the Airflow environment setup dialog that appears during creation of an AWorkflow Orchestration Manager integration runtime.":::
   - **SPN** ([service principal name](https://devblogs.microsoft.com/devops/introducing-service-principal-and-managed-identity-support-on-azure-devops/)): Only ADO supports this credential type.
     After you select this option, fill out the remaining fields based on the selected **Git service type**:
     - **Git repo url** (required): The clone URL to the Git repository to sync.
     - **Git branch** (required): The branch in the repository to sync.
     - **Service principal app id** (required): The service principal app ID with access to the ADO repo to sync.
     - **Service principal secret** (required): A manually generated secret in the service principal whose value is used to authenticate and access the ADO repo.
     - **Service principal tenant id** (required): The service principal tenant ID.

     :::image type="content" source="media/airflow-git-sync-repository/git-spn-credentials.png" alt-text="Screenshot that shows the Git SPN credential options in the Airflow environment setup dialog that appears during creation of an Workflow Orchestration Manager integration runtime.":::

1. Fill in the rest of the fields with the required information.
1. Select **Create**.

## Use the REST API

To sync your GitHub repository by using the Rest API:

- **Method**: PUT
- **URL**: ```https://management.azure.com/subscriptions/<subscriptionid>/resourcegroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<datafactoryName>/integrationruntimes/<airflowEnvName>?api-version=2018-06-01```
- **URI parameters**:

  |Name  |In  |Required  |Type  |Description  |
  |---------|---------|---------|---------|---------|
  |Subscription Id     | path        | True        | string        | Subscription identifier        |
  |ResourceGroup Name     |  path       | True        | string        | Resource group name (Regex pattern: ```^[-\w\._\(\)]+$```)        |
  |dataFactoryName     |  path       | True        | string        | Name of the Azure Data Factory (Regex pattern: ```^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$```        |
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
  |airflowVersion | string | Supported version Apache Airflow. For example, 2.4.3. |
  |airflowRequirements | Array\<string\> | Python libraries you want to use. For example, ["flask-bcrypy=0.7.1"]. Can be a comma-delimited list. |
  |airflowEnvironmentVariables | Object (Key/Value pair) | Environment variables you want to use. For example, { "SAMPLE_ENV_NAME": "test" }. |
  |gitSyncProperties | gitSyncProperty | Git configuration properties. |
  |enableAADIntegration | boolean | Allows Microsoft Entra ID to log in to Workflow Orchestration Manager. |
  |userName | string or null | Username for Basic Authentication. |
  |password | string or null | Password for Basic Authentication. |

- **Git sync property**:

  |Name  |Type  |Description  |
  |---------|---------|---------|
  |gitServiceType | string | The Git service where your desired repository is located. Values are GitHub, ADO, GitLab, or BitBucket. |
  |gitCredentialType | string | Type of Git credential. Values are PAT (for personal access token), SPN (supported only by ADO), and None. |
  |repo | string | Repository link. |
  |branch | string | Branch to use in the repository. |
  |username | string | GitHub username. |
  |Credential | string | Value of the PAT. |
  |tenantId | string | The service principal tenant ID (supported only by ADO). |

- **Responses**:

  |Name  |Status code  |Type  |Description |
  |---------|---------|---------|----------|
  |Accepted | 200 | [Factory](/rest/api/datafactory/factories/get?tabs=HTTP#factory) | OK |
  |Unauthorized | 401 | [Cloud Error](/rest/api/datafactory/factories/get?tabs=HTTP#clouderror) | Array with more error details |

### Examples

Review the following examples.

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
  }
  ```

- Git sync properties for ADO with service principal:

  ```rest
  "gitSyncProperties":  {
          "gitServiceType": "ADO",
          "gitCredentialType": "SPN",
          "repo":  <repo url>,
          "branch": <repo branch to sync>,
          "username": < service principal app id >,
          "credential": <service principal secret value>
          "tenantId": <service principal tenant id>
  }
  ```

- Git sync properties for a GitHub public repo:

  ```rest
  "gitSyncProperties":  {
          "gitServiceType": "Github",
          "gitCredentialType": "None",
          "repo":  <repo url>,
          "branch": <repo branch to sync>
  }
  ```

## Import a private package with Git sync

This optional process only applies when you use private packages.

This process assumes that your private package was autosynced via Git sync. You add the package as a requirement in the Workflow Orchestration Manager UI along with the path prefix `/opt/airflow/git/\<repoName\>/`, if you're connecting to an ADO repo. Use `/opt/airflow/git/\<repoName\>.git/` for all other Git services.

For example, if your private package is in `/dags/test/private.whl` in a GitHub repo, you should add the requirement `/opt/airflow/git/\<repoName\>.git/dags/test/private.whl` in the Workflow Orchestration Manager environment.

:::image type="content" source="media/airflow-git-sync-repository/airflow-private-package.png" alt-text="Screenshot that shows the Airflow requirements section in the Airflow environment setup dialog that appears during creation of an Workflow Orchestration Manager integration runtime.":::

## Related content

- [Run an existing pipeline with Workflow Orchestration Manager](tutorial-run-existing-pipeline-with-airflow.md)
- [Workflow Orchestration Manager pricing](airflow-pricing.md)
- [Change the password for Workflow Orchestration Manager environment](password-change-airflow.md)
