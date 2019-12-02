---
title: Deploy custom policies with Azure DevOps
titleSuffix: Azure AD B2C
description: Learn how to deploy Azure AD B2C custom policies in a CI/CD pipeline by using Azure DevOps.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/25/2019
ms.author: marsma
ms.subservice: B2C
---

# Deploy custom policies from an Azure DevOps pipeline

By using a continuous integration and delivery (CI/CD) pipeline that you set up in [Azure DevOps](https://azure.microsoft.com/overview/devops/), you can include your Azure AD B2C custom policies in your software delivery and code control automation. As you deploy to different Azure AD B2C environments, for example dev, test, and production, we recommend that you remove manual processes and perform automated testing by using Azure DevOps.

There are three primary steps required for enabling Azure DevOps to manage custom policies within Azure AD B2C:

1. Create a web application registration in your Azure AD B2C tenant
1. Configure your Azure DevOps Git repository
1. Configure your Azure DevOps release pipeline

> [!IMPORTANT]
> Managing Azure AD B2C custom policies currently uses **preview** operations available on Microsoft Graph API `/beta` endpoint. Use of these APIs in production applications is not supported. For more information, see the [Microsoft Graph REST API beta endpoint reference](https://docs.microsoft.com/graph/api/overview?toc=./ref/toc.json&view=graph-rest-beta).

## Prerequisites

* [Azure AD B2C tenant](tutorial-create-tenant.md), and credentials for a user in the directory with the *Global Admin* role
* [Azure DevOps pipeline](https://azure.microsoft.com/services/devops/pipelines/), and access to an Azure DevOps project

## Client credentials grant flow

The scenario described here makes use of service-to-service calls between Azure DevOps and Azure AD B2C by using the OAuth 2.0 [client credentials grant flow](../active-directory/develop/v1-oauth2-client-creds-grant-flow.md). This grant flow permits a web service like Azure DevOps (the confidential client) to use its own credentials instead of impersonating a user to authenticate when calling another web service, which is the Microsoft Graph API in this case.

Azure DevOps obtains a token non-interactively, then makes requests to the Microsoft Graph API.

## Register an application for management tasks

Start by creating an application registration that your PowerShell scripts executed by Azure DevOps will use for communicating with Azure AD B2C. If you already have an application registration that you use for automation tasks, you can skip this section.

### Register application

[!INCLUDE [active-directory-b2c-appreg-mgmt](../../includes/active-directory-b2c-appreg-mgmt.md)]

### Create client secret

[!INCLUDE [active-directory-b2c-client-secret](../../includes/active-directory-b2c-client-secret.md)]

## Configure an Azure DevOps Git repository

With a management application registration completed, you're ready to configure a repository for your policy files.

1. Sign in to your Azure DevOps organization and navigate to your project.
1. In your project, navigate to **Repos** and select the **Files** page. Select an existing Repo or create one for this exercise.
1. Create a folder named *B2CAssets*. You can remove the required README.md later, if you like.
1. Add your Azure AD B2C policy files to the *B2CAssets* folder. This includes the *TrustFrameworkBase.xml*, *TrustFrameWorkExtensions.xml*, *SignUpOrSignin.xml*, *ProfileEdit.xml*, *PasswordReset.xml*, and any other policies you've created. Record the filename of each Azure AD B2C policy file for use in a later step (they're used as PowerShell script arguments).
1. Create a folder named *Scripts* in the root directory of the repository.
1. Paste the following PowerShell script into a file named *DeployToB2c.ps1* in the newly created *Scripts* folder. The script acquires a token from Azure AD and calls the Microsoft Graph API to upload the policies within the B2CAssets folder to your Azure AD B2C tenant.

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
        $ErrResp = $streamReader.ReadToEnd()
        $streamReader.Close()

        $ErrResp

        exit 1
    }

    exit 0
    ```

## Configure your Azure DevOps release pipeline

1. Sign in to your Azure DevOps organization and navigate to your project.
1. In your project, navigate to the **Releases** page under **Pipelines**. Then choose the action to create a new pipeline.
    - Select **New** then Select **New release pipeline**
1. Select **Empty Job** at the top of navigation pane to choose a template.
1. In the next screen, enter a name for the stage such as 'DeployCustomPolicies' and close window.
1. Select **Add an artifact** to the pipeline. For this guide, follow prompts and choose your repo.
    - Under **Select repository**, choose the repo that you generated the previous **Scripts** folder
    - Choose the correct branch for **Default branch**
    - You may leave default value for **"Default version** for 'Latest form the default branch'
1. Once complete, select **Add**
1. Switch to **Variables** tab.
1. Add following variables under **Pipeline variables**:
    - **Name:** clientId <br/>
    **Value:** 'applicationId of the app you created earlier'
    - **Name:** clientSecret <br/>
    **Value:** 'password of the app you created earlier' from the application **Keys**.
        - Please make sure to change variable type to 'Secret' by selecting the lock icon next to Value field.
    - **Name:** tenantId <br/>
    **Value:** 'yourtenant.onmicrosoft.com'
        - Also known as the default domain name

1. Switch to **Tasks** tab.
1. Select Agent job, and then select '+' to add a task to the Agent job. From right side search for 'PowerShell' and add it. There might be multiple 'PowerShell' tasks, such as Azure PowerShell etc. Please choose the one which says just **PowerShell** and select **Add**.
    1. Select newly added 'PowerShell Script' task.
    1. Enter following values
        - **Task Version:** 1.* or 2.* Decide the correct version based on [release notes](https://docs.microsoft.com/windows/win32/taskschd/what-s-new-in-task-scheduler).
        - **Display Name:** 'name of the specific policy that you are targeting to upload Example: 'B2C_1A_TrustFrameworkBase'
        - **Type:** File Path
        - **Script Path:** Click on the "..." icon and Navigate to the 'DeployToB2C.ps1' file. Select this file.
        - **Arguments:** <br/>
        -ClientID $(clientId) -ClientSecret $(clientSecret) -TenantId $(tenantId) -PolicyId B2C_1A_TrustFrameworkBase -PathToFile $(System.DefaultWorkingDirectory)/B2CAssets/TrustFrameworkBase.xml <br/>
            PolicyId is not the filename and instead is a value stored with the XML policy. This is located at the beginning of policy file. See Example:
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
1. Save the Agent job.

This example uploads only one policy. Update the **Arguments** for each **Agent job** between the different policies. Specifically, the '-PolicyId' and '-PathToFile' parameters.

Try running one Agent job successfully before creating new ones.

When running the agents and uploading the policy files, ensure they're uploaded in this order:

1. *TrustFrameworkBase.xml*
1. *TrustFrameworkExtensions.xml*
1. *SignUpOrSignin.xml*
1. *ProfileEdit.xml*
1. *PasswordReset.xml*

The Identity Experience Framework enforces this order as the file structure is built on a hierarchical chain.

## Test your new pipeline

To test your release pipeline:

1. Select **Pipelines** and then **Builds**
1. Select the specific pipeline called "DeployCustomPolicies" or your newly named pipeline
1. At the top right of the screen, select the button **Queued** and click **Run**

## Next steps

* Learn more about the [Azure AD Graph API](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog)
* Learn more about [Azure AD Graph API permission scopes](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-permission-scopes)
* Learn more about [Service to service calls using client credentials](https://docs.microsoft.com/en-us/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow)
* Learn how to get started with [Azure DevOps](https://docs.microsoft.com/azure/devops/user-guide/?view=azure-devops)
