---
title: Deploy custom policies with Azure Pipelines
titleSuffix: Azure AD B2C
description: Learn how to deploy Azure AD B2C custom policies in a CI/CD pipeline by using Azure Pipelines in Azure DevOps Services.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 02/14/2020
ms.author: mimart
ms.subservice: B2C
---

# Deploy custom policies with Azure Pipelines

By using a continuous integration and delivery (CI/CD) pipeline that you set up in [Azure Pipelines][devops-pipelines], you can include your Azure AD B2C custom policies in your software delivery and code control automation. As you deploy to different Azure AD B2C environments, for example dev, test, and production, we recommend that you remove manual processes and perform automated testing by using Azure Pipelines.

There are three primary steps required for enabling Azure Pipelines to manage custom policies within Azure AD B2C:

1. Create a web application registration in your Azure AD B2C tenant
1. Configure an Azure Repo
1. Configure an Azure Pipeline

> [!IMPORTANT]
> Managing Azure AD B2C custom policies with an Azure Pipeline currently uses **preview** operations available on the Microsoft Graph API `/beta` endpoint. Use of these APIs in production applications is not supported. For more information, see the [Microsoft Graph REST API beta endpoint reference](/graph/api/overview?toc=.%2fref%2ftoc.json&view=graph-rest-beta&preserve-view=true).

## Prerequisites

* [Azure AD B2C tenant](tutorial-create-tenant.md), and credentials for a user in the directory with the [B2C IEF Policy Administrator](../active-directory/roles/permissions-reference.md#b2c-ief-policy-administrator) role
* [Custom policies](tutorial-create-user-flows.md?pivots=b2c-custom-policy) uploaded to your tenant
* [Management app](microsoft-graph-get-started.md) registered in your tenant with the Microsoft Graph API permission *Policy.ReadWrite.TrustFramework*
* [Azure Pipeline](https://azure.microsoft.com/services/devops/pipelines/), and access to an [Azure DevOps Services project][devops-create-project]

## Client credentials grant flow

The scenario described here makes use of service-to-service calls between Azure Pipelines and Azure AD B2C by using the OAuth 2.0 [client credentials grant flow](../active-directory/azuread-dev/v1-oauth2-client-creds-grant-flow.md). This grant flow permits a web service like Azure Pipelines (the confidential client) to use its own credentials instead of impersonating a user to authenticate when calling another web service (the Microsoft Graph API, in this case). Azure Pipelines obtains a token non-interactively, then makes requests to the Microsoft Graph API.

## Register an application for management tasks

As mentioned in [Prerequisites](#prerequisites), you need an application registration that your PowerShell scripts--executed by Azure Pipelines--can use for accessing the resources in your tenant.

If you already have an application registration that you use for automation tasks, ensure it's been granted the **Microsoft Graph** > **Policy** > **Policy.ReadWrite.TrustFramework** permission within the **API Permissions** of the app registration.

For instructions on registering a management application, see [Manage Azure AD B2C with Microsoft Graph](microsoft-graph-get-started.md).

## Configure an Azure Repo

With a management application registered, you're ready to configure a repository for your policy files.

1. Sign in to your Azure DevOps Services organization.
1. [Create a new project][devops-create-project] or select an existing project.
1. In your project, navigate to **Repos** and select the **Files** page. Select an existing repository or create one for this exercise.
1. Create a folder named *B2CAssets*. Name the required placeholder file *README.md* and **Commit** the file. You can remove this file later, if you like.
1. Add your Azure AD B2C policy files to the *B2CAssets* folder. This includes the *TrustFrameworkBase.xml*, *TrustFrameWorkExtensions.xml*, *SignUpOrSignin.xml*, *ProfileEdit.xml*, *PasswordReset.xml*, and any other policies you've created. Record the filename of each Azure AD B2C policy file for use in a later step (they're used as PowerShell script arguments).
1. Create a folder named *Scripts* in the root directory of the repository, name the placeholder file *DeployToB2c.ps1*. Don't commit the file at this point, you'll do so in a later step.
1. Paste the following PowerShell script into *DeployToB2c.ps1*, then **Commit** the file. The script acquires a token from Azure AD and calls the Microsoft Graph API to upload the policies within the *B2CAssets* folder to your Azure AD B2C tenant.

    ```PowerShell
    [Cmdletbinding()]
    Param(
        [Parameter(Mandatory = $true)][string]$ClientID,
        [Parameter(Mandatory = $true)][string]$ClientSecret,
        [Parameter(Mandatory = $true)][string]$TenantId,
        [Parameter(Mandatory = $true)][string]$PolicyId,
        [Parameter(Mandatory = $true)][string]$PathToFile
    )

    try {
        $body = @{grant_type = "client_credentials"; scope = "https://graph.microsoft.com/.default"; client_id = $ClientID; client_secret = $ClientSecret }

        $response = Invoke-RestMethod -Uri https://login.microsoftonline.com/$TenantId/oauth2/v2.0/token -Method Post -Body $body
        $token = $response.access_token

        $headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
        $headers.Add("Content-Type", 'application/xml')
        $headers.Add("Authorization", 'Bearer ' + $token)

        $graphuri = 'https://graph.microsoft.com/beta/trustframework/policies/' + $PolicyId + '/$value'
        $policycontent = Get-Content $PathToFile
        $response = Invoke-RestMethod -Uri $graphuri -Method Put -Body $policycontent -Headers $headers

        Write-Host "Policy" $PolicyId "uploaded successfully."
    }
    catch {
        Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__

        $_

        $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $streamReader.BaseStream.Position = 0
        $streamReader.DiscardBufferedData()
        $errResp = $streamReader.ReadToEnd()
        $streamReader.Close()

        $ErrResp

        exit 1
    }

    exit 0
    ```

## Configure your Azure pipeline

With your repository initialized and populated with your custom policy files, you're ready to set up the release pipeline.

### Create pipeline

1. Sign in to your Azure DevOps Services organization and navigate to your project.
1. In your project, select **Pipelines** > **Releases** > **New pipeline**.
1. Under **Select a template**, select **Empty job**.
1. Enter a **Stage name**, for example *DeployCustomPolicies*, then close the pane.
1. Select **Add an artifact**, and under **Source type**, select **Azure Repository**.
    1. Choose the source repository containing the *Scripts* folder that you populated with the PowerShell script.
    1. Choose a **Default branch**. If you created a new repository in the previous section, the default branch is *master*.
    1. Leave the **Default version** setting of *Latest from the default branch*.
    1. Enter a **Source alias** for the repository. For example, *policyRepo*. Do not include any spaces in the alias name.
1. Select **Add**
1. Rename the pipeline to reflect its intent. For example, *Deploy Custom Policy Pipeline*.
1. Select **Save** to save the pipeline configuration.

### Configure pipeline variables

1. Select the **Variables** tab.
1. Add the following variables under **Pipeline variables** and set their values as specified:

    | Name | Value |
    | ---- | ----- |
    | `clientId` | **Application (client) ID** of the application you registered earlier. |
    | `clientSecret` | The value of the **client secret** that you created earlier. <br /> Change the variable type to **secret** (select the lock icon). |
    | `tenantId` | `your-b2c-tenant.onmicrosoft.com`, where *your-b2c-tenant* is the name of your Azure AD B2C tenant. |

1. Select **Save** to save the variables.

### Add pipeline tasks

Next, add a task to deploy a policy file.

1. Select the **Tasks** tab.
1. Select **Agent job**, and then select the plus sign (**+**) to add a task to the Agent job.
1. Search for and select **PowerShell**. Do not select "Azure PowerShell," "PowerShell on target machines," or another PowerShell entry.
1. Select newly added **PowerShell Script** task.
1. Enter following values for the PowerShell Script task:
    * **Task version**: 2.*
    * **Display name**: The name of the policy that this task should upload. For example, *B2C_1A_TrustFrameworkBase*.
    * **Type**: File Path
    * **Script Path**: Select the ellipsis (***...***), navigate to the *Scripts* folder, and then select the *DeployToB2C.ps1* file.
    * **Arguments:**

        Enter the following values for **Arguments**. Replace `{alias-name}` with the alias you specified in the previous section.

        ```PowerShell
        # Before
        -ClientID $(clientId) -ClientSecret $(clientSecret) -TenantId $(tenantId) -PolicyId B2C_1A_TrustFrameworkBase -PathToFile $(System.DefaultWorkingDirectory)/{alias-name}/B2CAssets/TrustFrameworkBase.xml
        ```

        For example, if the alias you specified is *policyRepo*, the argument line should be:

        ```PowerShell
        # After
        -ClientID $(clientId) -ClientSecret $(clientSecret) -TenantId $(tenantId) -PolicyId B2C_1A_TrustFrameworkBase -PathToFile $(System.DefaultWorkingDirectory)/policyRepo/B2CAssets/TrustFrameworkBase.xml
        ```

1. Select **Save** to save the Agent job.

The task you just added uploads *one* policy file to Azure AD B2C. Before proceeding, manually trigger the job (**Create release**) to ensure that it completes successfully before creating additional tasks.

If the task completes successfully, add deployment tasks by performing the preceding steps for each of the custom policy files. Modify the `-PolicyId` and `-PathToFile` argument values for each policy.

The `PolicyId` is a value found at the start of an XML policy file within the TrustFrameworkPolicy node. For example, the `PolicyId` in the following policy XML is *B2C_1A_TrustFrameworkBase*:

```xml
<TrustFrameworkPolicy
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
PolicySchemaVersion="0.3.0.0"
TenantId="contoso.onmicrosoft.com"
PolicyId= "B2C_1A_TrustFrameworkBase"
PublicPolicyUri="http://contoso.onmicrosoft.com/B2C_1A_TrustFrameworkBase">
```

When running the agents and uploading the policy files, ensure they're uploaded in this order:

1. *TrustFrameworkBase.xml*
1. *TrustFrameworkExtensions.xml*
1. *SignUpOrSignin.xml*
1. *ProfileEdit.xml*
1. *PasswordReset.xml*

The Identity Experience Framework enforces this order as the file structure is built on a hierarchical chain.

## Test your pipeline

To test your release pipeline:

1. Select **Pipelines** and then **Releases**.
1. Select the pipeline you created earlier, for example *DeployCustomPolicies*.
1. Select **Create release**, then select **Create** to queue the release.

You should see a notification banner that says that a release has been queued. To view its status, select the link in the notification banner, or select it in the list on the **Releases** tab.

## Next steps

Learn more about:

* [Service-to-service calls using client credentials](../active-directory/azuread-dev/v1-oauth2-client-creds-grant-flow.md)
* [Azure DevOps Services](/azure/devops/user-guide/)

<!-- LINKS - External -->
[devops]: /azure/devops/
[devops-create-project]:  /azure/devops/organizations/projects/create-project
[devops-pipelines]: /azure/devops/pipelines
