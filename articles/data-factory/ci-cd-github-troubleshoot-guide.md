---
title: Troubleshoot CI-CD, Azure DevOps, and GitHub issues in ADF
titleSuffix: Azure Data Factory & Synapse Analytics
description: Use different methods to troubleshoot CI-CD issues in ADF. 
author: ssabat
ms.author: susabat
ms.reviewer: susabat
ms.service: data-factory
ms.custom: synapse
ms.topic: troubleshooting
ms.date: 06/27/2021
---

# Troubleshoot CI-CD, Azure DevOps, and GitHub issues in ADF 

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

In this article, let us explore common troubleshooting methods for Continuous Integration-Continuous Deployment (CI-CD), Azure DevOps and GitHub issues in Azure Data Factory.

If you have questions or issues in using source control or DevOps techniques, here are a few articles you may find useful:

- Refer to [Source Control in ADF](source-control.md) to learn how source control is practiced in ADF. 
- Refer to  [CI-CD in ADF](continuous-integration-deployment.md) to learn more about how DevOps CI-CD is practiced in ADF.

## Common errors and messages

### Connect to Git repository failed due to different tenant

#### Issue

Sometimes you encounter Authentication issues like HTTP status 401. Especially when you have multiple tenants with guest account, things could become more complicated.

#### Cause

What we have observed is that the token was obtained from the original tenant, but ADF is in guest tenant and trying to use the token to visit DevOps in guest tenant. This is not the expected behavior.

#### Recommendation

You should use the token issued from guest tenant. For example, you have to assign the same Azure Active Directory to be your guest tenant and your DevOps, so it can correctly set token behavior and use the correct tenant.

### Template parameters in the parameters file are not valid

#### Issue

If we delete a trigger in Dev branch, which is already available in Test or Production branch with **same** configuration (like frequency and interval), then release pipeline deployment succeeds and corresponding trigger will be deleted in respective environments. But if you have **different** configuration (like frequency and interval) for trigger in Test/Production environments and if you delete the same trigger in Dev, then deployment fails with an error.

#### Cause

CI/CD Pipeline fails with the following error:

`
2020-07-20T11:19:02.1276769Z ##[error]Deployment template validation failed: 'The template parameters 'Trigger_Salesforce_properties_typeProperties_recurrence_frequency, Trigger_Salesforce_properties_typeProperties_recurrence_interval, Trigger_Salesforce_properties_typeProperties_recurrence_startTime, Trigger_Salesforce_properties_typeProperties_recurrence_timeZone' in the parameters file are not valid; they are not present in the original template and can therefore not be provided at deployment time. The only supported parameters for this template are 'factoryName, PlanonDWH_connectionString, PlanonKeyVault_properties_typeProperties_baseUrl
`

#### Recommendation

The error occurs because we often delete a trigger, which is parameterized, therefore, the parameters will not be available in the Azure Resource Manager (ARM) template (because the trigger does not exist anymore). Since the parameter is not in the ARM template anymore, we have to update the overridden parameters in the DevOps pipeline. Otherwise, each time the parameters in the ARM template change, they must update the overridden parameters in the DevOps pipeline (in the deployment task).

### Updating property type is not supported

#### Issue

CI/CD release pipeline failing with the following error:

```output
2020-07-06T09:50:50.8716614Z There were errors in your deployment. Error code: DeploymentFailed.
2020-07-06T09:50:50.8760242Z ##[error]At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/DeployOperations for usage details.
2020-07-06T09:50:50.8771655Z ##[error]Details:
2020-07-06T09:50:50.8772837Z ##[error]DataFactoryPropertyUpdateNotSupported: Updating property type is not supported.
2020-07-06T09:50:50.8774148Z ##[error]DataFactoryPropertyUpdateNotSupported: Updating property type is not supported.
2020-07-06T09:50:50.8775530Z ##[error]Check out the troubleshooting guide to see if your issue is addressed: https://docs.microsoft.com/azure/devops/pipelines/tasks/deploy/azure-resource-group-deployment#troubleshooting
2020-07-06T09:50:50.8776801Z ##[error]Task failed while creating or updating the template deployment.
```

#### Cause

This error is due to an integration runtime with the same name in the target factory but with a different type. Integration Runtime needs to be of the same type during deployment.

#### Recommendation

- Refer to the [Best Practices for CI/CD](continuous-integration-deployment.md#best-practices-for-cicd)

- Integration runtimes don't change often and are similar across all stages in your CI/CD, so Data Factory expects you to have the same name and type of integration runtime across all stages of CI/CD. If the name and types & properties are different, make sure to match the source and target integration runtime configuration and then deploy the release pipeline.

- If you want to share integration runtimes across all stages, consider using a ternary factory just to contain the shared integration runtimes. You can use this shared factory in all of your environments as a linked integration runtime type.

### Document creation or update failed because of invalid reference

#### Issue

When trying to publish changes to a Data Factory, you get following error message:

`
"error": {
        "code": "BadRequest",
        "message": "The document creation or update failed because of invalid reference '<entity>'.",
        "target": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/<rgname>/providers/Microsoft.DataFactory/factories/<datafactory>/pipelines/<pipeline>",
        "details": null
    }
`
### Cause

You have detached the Git configuration and set it up again with the "Import resources" flag selected, which sets the Data Factory as "in sync". This means no change during  publication..

#### Resolution

Detach Git configuration and set it up again, and make sure NOT to check the "import existing resources" checkbox.

### Data Factory move failing from one resource group to another

#### Issue

You are unable to move Data Factory from one Resource Group to another, failing with the following error:

`
{
    "code": "ResourceMoveProviderValidationFailed",
    "message": "Resource move validation failed. Please see details. Diagnostic information: timestamp 'xxxxxxxxxxxxZ', subscription id 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', tracking id 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', request correlation id 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.",
    "details": [
        {
            "code": "BadRequest",
            "target": "Microsoft.DataFactory/factories",
            "message": "One of the resources contain integration runtimes that are either SSIS-IRs in starting/started/stopping state, or Self-Hosted IRs which are shared with other resources. Resource move is not supported for those resources."
        }
    ]
}
`

#### Resolution

You can delete the SSIS-IR and Shared IRs to allow the move operation. If you do not want to delete the integration runtimes, then the best way is to follow the copy and clone document to do the copy and after it's done, delete the old Data Factory.

###  Unable to export and import ARM template

#### Issue

Unable to export and import ARM template. No error was on the portal, however, in the browser trace, you  could see the following error:

`Failed to load resource: the server responded with a status code of 401 (Unauthorized)`

#### Cause

You have created a customer role as the user and it did not have the necessary permission. When the factory is loaded in the UI, a series of exposure control values for the factory is checked. In this case, the user's access role does not have permission to access *queryFeaturesValue* API. To access this API, the global parameters feature is turned off. The ARM export code path is partly relying on the global parameters feature.

#### Resolution

In order to resolve the issue, you need to add the following permission to your role: *Microsoft.DataFactory/factories/queryFeaturesValue/action*. This permission should be included by default in the "Data Factory Contributor" role.

###  Cannot automate publishing for CI/CD 

#### Cause

Until recently, only way to publish ADF pipeline for deployments was using ADF Portal button click. Now, you can make the process automatic. 

#### Resolution

CI/CD process has been enhanced. The **Automated** publish feature takes, validates, and exports all ARM template features from the ADF UX. It makes the logic consumable via a publicly available npm package [@microsoft/azure-data-factory-utilities](https://www.npmjs.com/package/@microsoft/azure-data-factory-utilities). This method allows you to programmatically trigger these actions instead of having to go to the ADF UI and do a button click. This method gives  your CI/CD pipelines a **true** continuous integration experience. Follow [ADF CI/CD Publishing Improvements](./continuous-integration-deployment-improvements.md) for details. 

###  Cannot publish because of 4-MB ARM template limit  

#### Issue

You cannot deploy because you hit Azure Resource Manager limit of 4-MB total template size. You need a solution to deploy after crossing the limit. 

#### Cause

Azure Resource Manager restricts template size to be 4-MB. Limit the size of your template to 4-MB, and each parameter file to 64 KB. The 4-MB limit applies to the final state of the template after it has been expanded with iterative resource definitions, and values for variables and parameters. But, you have crossed the limit. 

#### Resolution

For small to medium solutions, a single template is easier to understand and maintain. You can see all the resources and values in a single file. For advanced scenarios, linked templates enable you to break down the solution into targeted components. Follow best practice at [Using Linked and Nested Templates](../azure-resource-manager/templates/linked-templates.md?tabs=azure-powershell).

### Cannot connect to GIT Enterprise  

##### Issue

You cannot connect to GIT Enterprise because of permission issues. You can see error like **422 - Unprocessable Entity.**

#### Cause

* You have not configured Oauth for ADF. 
* Your URL is misconfigured. The repoConfiguration should be of type [FactoryGitHubConfiguration](/dotnet/api/microsoft.azure.management.datafactory.models.factorygithubconfiguration?view=azure-dotnet&preserve-view=true)

#### Resolution 

You  grant  Oauth access to ADF at first. Then, you have to use correct URL to connect to GIT Enterprise. The configuration must be set to the customer organization(s). For example, ADF will try *https://hostname/api/v3/search/repositories?q=user%3&lt;customer credential&gt;....* at first and fail. Then, it will try *https://hostname/api/v3/orgs/&lt;org&gt;/&lt;repo&gt;...*, and succeed.  
 
### Cannot recover from a deleted data factory

#### Issue
Customer deleted Data factory or the resource group containing the Data Factory. Customer would like to know how to restore a deleted data factory.

#### Cause

It is possible to recover the Data Factory only if the customer has Source control configured (DevOps or Git). This action will bring all the latest published resource and **will not** restore the unpublished pipeline, dataset, and linked service. If there is no Source control, recovering a Deleted Data Factory from backend is not possible because once the service receives deleted command, the instance is deleted, and no backup has been stored.

#### Resolution

To recover the Deleted Data Factory that has Source Control refer the steps below:

 * Create a new Azure Data Factory.

 * Reconfigure Git with the same settings, but make sure to import existing Data Factory resources to the selected repository, and choose New branch.

 * Create a pull request to merge the changes to the collaboration branch and publish.

 * If customer had a Self-hosted Integration Runtime in deleted ADF, they will have to create a new instance in new ADF, also uninstall, and reinstall the instance on their On-prem machine/VM with the new key obtained. After setup of IR is completed, customer will have to change the Linked Service to point to new IR and test the connection or it will fail with error **invalid reference.**

### Cannot deploy to different stage using automatic publish method

#### Issue
Customer followed all necessary steps like installing NPM package and setting up a higher stage using Azure DevOps and ADF. But, deployment is not happening.

#### Cause

While npm packages can be consumed in various ways, one of the primary benefits is being consumed via Azure Pipeline. On each merge into your collaboration branch, a pipeline can be triggered that first validates all of the code and then exports the ARM template into a build artifact that can be consumed by a release pipeline. In Starter pipeline,  YAML file should be valid and complete.


#### Resolution

Following section is not valid because package.json folder is not valid.

```
- task: Npm@1
  inputs:
    command: 'custom'
    workingDir: '$(Build.Repository.LocalPath)/<folder-of-the-package.json-file>' #replace with the package.json folder
    customCommand: 'run build validate $(Build.Repository.LocalPath) /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testResourceGroup/providers/Microsoft.DataFactory/factories/yourFactoryName'
  displayName: 'Validate'
```
It should have DataFactory included in customCommand like *'run build validate $(Build.Repository.LocalPath)/DataFactory/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testResourceGroup/providers/Microsoft.DataFactory/factories/yourFactoryName'*. Make sure the generated YAML file for higher stage should have required JSON artifacts.

### Git Repository or Purview Connection Disconnected

#### Issue
When deploying your Data Factory, your git repository or purview connection is disconnected.

#### Cause
If you have **Include in ARM template** selected for deploying global parameters, your factory is included in the ARM template. As a result, other factory properties will be removed upon deployment.

#### Resolution
Unselect **Include in ARM template** and deploy global parameters with PowerShell as described in Global parameters in CI/CD. 
 
### Extra  left "[" displayed in published JSON file

#### Issue
When publishing ADF with DevOps, there is one more left "[" displayed. ADF adds one more left "[" in ARMTemplate in DevOps automatically. You will see expression like "[[" in JSON file.

#### Cause
Because [ is a reserved character for ARM, an extra [ is added automatically to escape "[".

#### Resolution
This is normal behavior during ADF publishing process for CI/CD.
 
### Perform **CI/CD** during  progress/queued stage of pipeline run

#### Issue
You want to perform CI/CD during progress and queuing stage of pipeline run.

#### Cause
When pipeline is in progress/queued stage, you have to monitor the pipeline and  activities at first. Then, you can decide to wait until pipeline to finish or you can cancel the pipeline run. 
 
#### Resolution
You can monitor the pipeline using **SDK**, **Azure Monitor** or [ADF Monitor](./monitor-visually.md). Then, you can follow [ADF CI/CD Best Practices](./continuous-integration-deployment.md#best-practices-for-cicd) to guide you further. 

### Perform **UNIT TESTING** during ADF development and deployment

#### Issue
You want to perform unit testing during development and deployment of ADF pipelines.

#### Cause
During development and deployment cycles, you may want to unit test your pipeline before you manually or automatically publish your pipeline. Test automation allows you to run more tests, in less time, with guaranteed repeatability. Automatically re-testing all your ADF pipelines before deployment gives you some protection against regression faults. Automated testing is a key component of CI/CD software development approaches: inclusion of automated tests in CI/CD deployment pipelines for Azure Data Factory can significantly improve quality. In long run, tested ADF pipeline artifacts are reused saving you cost and time.  
 
#### Resolution
Because customers may have different unit testing requirements with different skill sets, usual practice is to follow following steps:

1. Setup Azure DevOps CI/CD project or develop  .NET/PYTHON/REST type SDK driven test strategy.
2. For CI/CD, create build artifact containing all scripts and deploy resources in release pipeline. For SDK driven approach, develop Test units using PyTest in Python,  C# **Nunit** using .NET  SDK and so on.
3. Run unit tests as part of release pipeline or independently with ADF Python/PowerShell/.NET/REST SDK. 

For example, you want to delete duplicates in a file and then store curated file as table in a database. To test the pipeline, you set up a CI/CD project using Azure DevOps.
You set up a TEST pipeline stage where you deploy your developed pipeline. You configure TEST stage to run Python tests for making sure table data is what you expected. If you do not use CI/CD, you use **Nunit** to trigger deployed pipelines with tests you want. Once you are satisfied with the results, you can finally publish the pipeline to a production data factory. 


## Next steps

For more help with troubleshooting, try the following resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Stack overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
