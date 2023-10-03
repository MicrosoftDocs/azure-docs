---
title: Automate continuous integration with GitHub Actions
description: Learn how to automate continuous integration in Azure Data Factory with GitHub Actions.
ms.service: data-factory
ms.subservice: ci-cd
ms.custom: devx-track-arm-template
author: olmoloce
ms.author: olmoloce
ms.reviewer: kromerm
ms.topic: conceptual
ms.date: 08/29/2023 
---

# Automate continuous integration and delivery using GitHub Actions

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this guide, we show how to do continuous integration and delivery in Azure Data Factory with GitHub Actions. This is done using workflows. A workflow is defined by a YAML file that contains the various steps and parameters that make up the workflow. 

The workflow leverages the [automated publishing capability](continuous-integration-delivery-improvements.md) of Azure Data Factory. And the [Azure Data Factory Deploy Action](https://github.com/marketplace/actions/data-factory-deploy) from the GitHub Marketplace that uses the [pre- and post-deployment script](continuous-integration-delivery-sample-script.md).  

## Requirements

- Azure Subscription - if you don't have one, create a [free Azure account](https://azure.microsoft.com/free/) before you begin. 

- Azure Data Factory - you need two instances, one development instance that is the source of changes. And a second one where changes are propagated with the workflow. If you don't have an existing Data Factory instance, follow this [tutorial](quickstart-create-data-factory.md) to create one. 

- GitHub repository integration set up - if you don't have a GitHub repository connected to your development Data Factory, follow the [tutorial](source-control.md#github-settings) to connect it.  

## Create a user-assigned managed identity

You need credentials that authenticate and authorize GitHub Actions to deploy your ARM template to the target Data Factory. We leverage a user-assigned managed identity (UAMI) with [workload identity federation](../active-directory/workload-identities/workload-identity-federation.md). Using workload identity federation allows you to access Azure Active Directory (Azure AD) protected resources without needing to manage secrets. In this scenario, GitHub Actions are able to access the Azure resource group and deploy the target Data Factory instance. 

Follow the tutorial to [create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity). Once the UAMI is created, browse to the Overview page and take a note of the Subscription ID and Client ID. We need these values later.

## Configure the workload identity federation 

1. Follow the tutorial to [configure a federated identity credential on a user-assigned managed identity](../active-directory/workload-identities/workload-identity-federation-create-trust-user-assigned-managed-identity.md#configure-a-federated-identity-credential-on-a-user-assigned-managed-identity). 

    Here is an example of a federated identity configuration:
   
    :::image type="content" source="media/continuous-integration-delivery-github-actions/add-federated-credential.png" lightbox="media/continuous-integration-delivery-github-actions/add-federated-credential.png"alt-text="Screenshot of adding Federated Credential in Azure Portal.":::

2. After creating the credential, navigate to Azure Active Directory Overview page and take a note of the tenant ID. We need this value later. 

3. Browse to the Resource Group containing the target Data Factory instance and assign the UAMI the [Data Factory Contributor role](concepts-roles-permissions.md#roles-and-requirements). 

> [!IMPORTANT]
> In order to avoid authorization errors during deployment, be sure to assign the Data Factory Contributor role at the Resource Group level containing the target Data Factory instance.

## Configure the GitHub secrets 

You need to provide your application's Client ID, Tenant ID and Subscription ID to the login action. These values can be stored in GitHub secrets and referenced in your workflow. 
1. Open your GitHub repository and go to Settings.
   
   :::image type="content" source="media/continuous-integration-delivery-github-actions/github-settings.png" lightbox="media/continuous-integration-delivery-github-actions/github-settings.png" alt-text="Screenshot of navigating to GitHub Settings.":::

2. Select Security -> Secrets and variables -> Actions.
   
   :::image type="content" source="media/continuous-integration-delivery-github-actions/github-secrets.png" lightbox="media/continuous-integration-delivery-github-actions/github-secrets.png" alt-text="Screenshot of navigating to GitHub Secrets.":::

3. Create secrets for AZURE_CLIENT_ID, AZURE_TENANT_ID, and AZURE_SUBSCRIPTION_ID. Use these values from your Azure Active Directory application for your GitHub secrets:
   
   | GitHub Secret | Azure Active Directory Application |
   |---------------|----------------------------|
   | AZURE_CLIENT_ID | Application (client) ID |
   | AZURE_TENANT_ID | Directory (tenant) ID |
   | AZURE_SUBSCRIPTION_ID | Subscription ID |

4. Save each secret by selecting Add secret. 

## Create the workflow that deploys the Data Factory ARM template 

At this point, you must have a Data Factory instance with git integration set up. If not, follow the links in the Requirements section. 

The workflow is composed of two jobs: 

- **A build job** which uses the npm package [@microsoft/azure-data-factory-utilities](https://www.npmjs.com/package/@microsoft/azure-data-factory-utilities) to (1) validate all the Data Factory resources in the repository. You get the same validation errors as when "Validate All" is selected in Data Factory Studio. And (2) export the ARM template that is later used to deploy to the QA or Staging environment. 
- **A release job** which takes the exported ARM template artifact and deploys it to the higher environment Data Factory instance. 

1. Navigate to the repository connected to your Data Factory, under your root folder (ADFroot in the below example) create a build folder where you store the package.json file: 

    ```json
    {
        "scripts":{
            "build":"node node_modules/@microsoft/azure-data-factory-utilities/lib/index"
        },
        "dependencies":{
            "@microsoft/azure-data-factory-utilities":"^1.0.0"
        }
    }
    ```
    
    The setup should look like:
   
    :::image type="content" source="media/continuous-integration-delivery-github-actions/saving-package-json-file.png" lightbox="media/continuous-integration-delivery-github-actions/saving-package-json-file.png" alt-text="Screenshot of saving the package.json file in GitHub.":::

> [!IMPORTANT]
> Make sure to place the build folder under the root folder of your connected repository. In the above example and workflow, the root folder is ADFroot. If you are not sure what is your root folder, navigate to your Data Factory instance, Manage tab -> Git configuration -> Root folder.

2. Navigate to the Actions tab -> New workflow
   
   :::image type="content" source="media/continuous-integration-delivery-github-actions/new-workflow.png" lightbox="media/continuous-integration-delivery-github-actions/new-workflow.png" alt-text="Screenshot of creating a new workflow in GitHub.":::

3. Paste the workflow YAML. 

```yml
on:
  push:
    branches:
    - main

permissions:
      id-token: write
      contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:

    - uses: actions/checkout@v3
# Installs Node and the npm packages saved in your package.json file in the build
    - name: Setup Node.js environment
      uses: actions/setup-node@v3.4.1
      with:
        node-version: 14.x
        
    - name: install ADF Utilities package
      run: npm install
      working-directory: ${{github.workspace}}/ADFroot/build  # (1) provide the folder location of the package.json file
        
# Validates all of the Data Factory resources in the repository. You'll get the same validation errors as when "Validate All" is selected.
    - name: Validate
      run: npm run build validate ${{github.workspace}}/ADFroot/ /subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<ADFname> # (2) The validate command needs the root folder location of your repository where all the objects are stored. And the 2nd parameter is the resourceID of the ADF instance 
      working-directory: ${{github.workspace}}/ADFroot/build
 

    - name: Validate and Generate ARM template
      run: npm run build export ${{github.workspace}}/ADFroot/ /subscriptions/<subID>/resourceGroups/<resourceGroupName>/providers/Microsoft.DataFactory/factories/<ADFname> "ExportedArmTemplate"  # (3) The build command, as validate, needs the root folder location of your repository where all the objects are stored. And the 2nd parameter is the resourceID of the ADF instance. The 3rd parameter is the exported ARM template artifact name 
      working-directory: ${{github.workspace}}/ADFroot/build
 
# In order to leverage the artifact in another job, we need to upload it with the upload action 
    - name: upload artifact
      uses: actions/upload-artifact@v3
      with:
        name: ExportedArmTemplate # (4) use the same artifact name you used in the previous export step
        path: ${{github.workspace}}/ADFroot/build/ExportedArmTemplate
        
  release:
    needs: build
    runs-on: ubuntu-latest
    steps:
    
 # we 1st download the previously uploaded artifact so we can leverage it later in the release job     
      - name: Download a Build Artifact
        uses: actions/download-artifact@v3.0.2
        with:
          name: ExportedArmTemplate # (5) Artifact name 


      - name: Login via Az module
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
          enable-AzPSSession: true 

      - name: data-factory-deploy
        uses: Azure/data-factory-deploy-action@v1.2.0
        with:
          resourceGroupName: # (6) your target ADF resource group name
          dataFactoryName: # (7) your target ADF name
          armTemplateFile: # (8) ARM template file name ARMTemplateForFactory.json
          armTemplateParametersFile: # (9) ARM template parameters file name ARMTemplateParametersForFactory.json
          additionalParameters: # (10) Parameters which will be replaced in the ARM template. Expected format 'key1=value key2=value keyN=value'. At the minimum here you should provide the target ADF name parameter. Check the ARMTemplateParametersForFactory.json file for all the parameters that are expected in your scenario       
```

Let’s walk together through the workflow. It contains parameters that are numbered for your convenience and comments describe what each expects. 

For the build job, there are four parameters you need to provide. For more detailed information about these, check the npm package [Azure Data Factory utilities](https://www.npmjs.com/package/@microsoft/azure-data-factory-utilities) documentation.

> [!TIP]
> Use the same artifact name in the Export, Upload and Download actions. 

In the Release job, there are the next six parameters you need to supply. For more details about these, please check the [Azure Data Factory Deploy Action GitHub Marketplace listing](https://github.com/marketplace/actions/data-factory-deploy). 

## Monitor the workflow execution 

Let’s test the setup by making some changes in the development Data Factory instance. Create a feature branch and make some changes. Then make a pull request to the main branch. This triggers the workflow to execute. 

1. To check it, browse to the repository -> Actions -> and identify your workflow.
   
   :::image type="content" source="media/continuous-integration-delivery-github-actions/monitoring-workflow.png" lightbox="media/continuous-integration-delivery-github-actions/monitoring-workflow.png" alt-text="Screenshot showing monitoring a workflow in GitHub.":::

2. You can further drill down into each run, see the jobs composing it and their statuses and duration, as well as the Artifact created by the run. In our scenario, this is the ARM template created in the build job.
    
   :::image type="content" source="media/continuous-integration-delivery-github-actions/monitoring-jobs.png" lightbox="media/continuous-integration-delivery-github-actions/monitoring-jobs.png" alt-text="Screenshot showing monitoring jobs in GitHub.":::

3. You can further drill down by navigating to a job and its steps.
   
   :::image type="content" source="media/continuous-integration-delivery-github-actions/monitoring-release-job.png" lightbox="media/continuous-integration-delivery-github-actions/monitoring-release-job.png" alt-text="Screenshot showing monitoring the release job in GitHub.":::

4. You can also navigate to the target Data Factory instance to which you deployed changes to and make sure it reflects the latest changes.

## Next steps

- [Continuous integration and delivery overview](continuous-integration-delivery.md)
- [Manually promote a Resource Manager template to each environment](continuous-integration-delivery-manual-promotion.md)
- [Use custom parameters with a Resource Manager template](continuous-integration-delivery-resource-manager-custom-parameters.md)
- [Linked Resource Manager templates](continuous-integration-delivery-linked-templates.md)
- [Using a hotfix production environment](continuous-integration-delivery-hotfix-environment.md)
- [Sample pre- and post-deployment script](continuous-integration-delivery-sample-script.md)
