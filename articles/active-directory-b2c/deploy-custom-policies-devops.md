---
title: Deploy custom policies with Azure Pipelines
titleSuffix: Azure AD B2C
description: Learn how to deploy Azure AD B2C custom policies in a CI/CD pipeline by using Azure Pipelines.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.date: 03/25/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Deploy custom policies with Azure Pipelines

[Azure Pipelines](/azure/devops/pipelines) supports continuous integration (CI) and continuous delivery (CD) to constantly and consistently test, build, and ship a code to any target. This article describes how to automate the deployment process of the Azure Active Directory B2C (Azure AD B2C) [custom policies](user-flow-overview.md) using Azure Pipelines.

> [!IMPORTANT]
> Managing Azure AD B2C custom policies with Azure Pipelines currently uses **preview** operations available on the Microsoft Graph API `/beta` endpoint. Use of these APIs in production applications is not supported. For more information, see the [Microsoft Graph REST API beta endpoint reference](/graph/api/overview?toc=./ref/toc.json&view=graph-rest-beta&preserve-view=true).

## Prerequisites

* Complete the steps in the [Get started with custom policies in Active Directory B2C](tutorial-create-user-flows.md).
* If you haven't created a DevOps organization, create one by following the instructions in [Sign up, sign in to Azure DevOps](/azure/devops/user-guide/sign-up-invite-teammates).  

## Register an application for management tasks

You use PowerShell script to deploy the Azure AD B2C policies. Before the PowerShell script can interact with the [Microsoft Graph API](microsoft-graph-operations.md), create an application registration in your Azure AD B2C tenant. If you haven't already done so, [register a Microsoft Graph application](microsoft-graph-get-started.md).

For the PowerShell script to access data in MS Graph, grant the registered application the relevant [application permissions](/graph/permissions-reference). Granted the **Microsoft Graph** > **Policy** > **Policy.ReadWrite.TrustFramework** permission within the **API Permissions** of the app registration.

## Configure an Azure Repo

With a Microsoft Graph application registered, you're ready to configure a repository for your policy files.

1. Sign in to your [Azure DevOps organization](https://azure.microsoft.com/services/devops/).
1. [Create a new project][devops-create-project], or select an existing project.
1. In your project, navigate to **Repos**, and select **Files**. 
1. Select an existing repository or create one.
1. In the root directory of your repository, create a folder named `B2CAssets`. Add your Azure AD B2C custom policy files to the *B2CAssets* folder.
1. In the root directory of your repository, create a folder named `Scripts`. Create a PowerShell file *DeployToB2C.ps1*. Paste the following PowerShell script into *DeployToB2C.ps1*. 
1. **Commit** and **Push** the changes.

The following script acquires an access token from Microsoft Entra ID. With the token, the script calls the MS Graph API to upload the policies in the *B2CAssets* folder. You can also change the content of the policy before uploading it. For example, replace the `tenant-name.onmicrosoft.com` with your tenant name.

```PowerShell
[Cmdletbinding()]
Param(
    [Parameter(Mandatory = $true)][string]$ClientID,
    [Parameter(Mandatory = $true)][string]$ClientSecret,
    [Parameter(Mandatory = $true)][string]$TenantId,
    [Parameter(Mandatory = $true)][string]$Folder,
    [Parameter(Mandatory = $true)][string]$Files
)

try {
    $body = @{grant_type = "client_credentials"; scope = "https://graph.microsoft.com/.default"; client_id = $ClientID; client_secret = $ClientSecret }

    $response = Invoke-RestMethod -Uri https://login.microsoftonline.com/$TenantId/oauth2/v2.0/token -Method Post -Body $body
    $token = $response.access_token

    $headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
    $headers.Add("Content-Type", 'application/xml')
    $headers.Add("Authorization", 'Bearer ' + $token)

    # Get the list of files to upload
    $filesArray = $Files.Split(",")

    Foreach ($file in $filesArray) {

        $filePath = $Folder + $file.Trim()

        # Check if file exists
        $FileExists = Test-Path -Path $filePath -PathType Leaf

        if ($FileExists) {
            $policycontent = Get-Content $filePath -Encoding UTF8

            # Optional: Change the content of the policy. For example, replace the tenant-name with your tenant name.
            # $policycontent = $policycontent.Replace("your-tenant.onmicrosoft.com", "contoso.onmicrosoft.com")     
    
    
            # Get the policy name from the XML document
            $match = Select-String -InputObject $policycontent  -Pattern '(?<=\bPolicyId=")[^"]*'
    
            If ($match.matches.groups.count -ge 1) {
                $PolicyId = $match.matches.groups[0].value
    
                Write-Host "Uploading the" $PolicyId "policy..."
    
                $graphuri = 'https://graph.microsoft.com/beta/trustframework/policies/' + $PolicyId + '/$value'
                $content = [System.Text.Encoding]::UTF8.GetBytes($policycontent)
                $response = Invoke-RestMethod -Uri $graphuri -Method Put -Body $content -Headers $headers -ContentType "application/xml; charset=utf-8"
    
                Write-Host "Policy" $PolicyId "uploaded successfully."
            }
        }
        else {
            $warning = "File " + $filePath + " couldn't be not found."
            Write-Warning -Message $warning
        }
    }
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

## Configure Azure Pipelines

With your repository initialized and populated with your custom policy files, you're ready to set up the release pipeline. To create a pipeline, follow these steps:

1. In your project, select **Pipelines** > **Releases** > **New pipeline**.
1. Under **Select a template**, select **Empty job**, and then select **Apply**.
1. Enter a **Stage name**, for example *DeployCustomPolicies*, then close the pane.
1. Select **Add an artifact**, and under **Source type**, select **Azure Repository**.
    1. For the **Project**, select your project.
    1. Select the **Source (repository)** that contains the *Scripts* folder.
    1. Select a **Default branch**, for example *master*.
    1. Leave the **Default version** setting of *Latest from the default branch*.
    1. Enter a **Source alias** for the repository. For example, *policyRepo*. 
1. Select **Add**
1. Rename the pipeline to reflect its intent. For example, *Deploy Custom Policy Pipeline*.
1. Select **Save** to save the pipeline configuration.

### Configure pipeline variables

The pipeline variables give you a convenient way to get key bits of data into various parts of the pipeline. The following variables provide information about your Azure AD B2C environment.

| Name | Value |
| ---- | ----- |
| `clientId` | **Application (client) ID** of the application you registered earlier. |
| `clientSecret` | The value of the **client secret** that you created earlier. <br /> Change the variable type to **secret** (select the lock icon). |
| `tenantId` | `your-b2c-tenant.onmicrosoft.com`, where *your-b2c-tenant* is the name of your Azure AD B2C tenant. |

To add pipeline variables, follow these steps:

1. In your pipeline, select the **Variables** tab.
1. Under **Pipeline variables**, add the above variable with their values.
1. Select **Save** to save the variables.

### Add pipeline tasks

A pipeline task is a pre-packaged script that performs an action. Add a task that calls the *DeployToB2C.ps1* PowerShell script.

1. In the pipeline you created, select the **Tasks** tab.
1. Select **Agent job**, and then select the plus sign (**+**) to add a task to the Agent job.
1. Search for and select **PowerShell**. Don't select "Azure PowerShell," "PowerShell on target machines," or another PowerShell entry.
1. Select newly added **PowerShell Script** task.
1. Enter following values for the PowerShell Script task:
    * **Task version**: 2.*
    * **Display name**: The name of the policy that this task should upload. For example, *B2C_1A_TrustFrameworkBase*.
    * **Type**: File Path
    * **Script Path**: Select the ellipsis (***...***), navigate to the *Scripts* folder, and then select the *DeployToB2C.ps1* file.
    * **Arguments**: Enter the following PowerShell script. 


        ```PowerShell
        -ClientID $(clientId) -ClientSecret $(clientSecret) -TenantId $(tenantId) -Folder $(System.DefaultWorkingDirectory)/policyRepo/B2CAssets/ -Files "TrustFrameworkBase.xml,TrustFrameworkLocalization.xml,TrustFrameworkExtensions.xml,SignUpOrSignin.xml,ProfileEdit.xml,PasswordReset.xml"
        ```
        
        The `-Files` parameter is a comma delimiter list of policy files to deploy. Update the list with your policy files.
        
        > [!IMPORTANT]
        >  Ensure the policies are uploaded in the correct order. First the base policy, the extensions policy, then the relying party policies. For example,  `TrustFrameworkBase.xml,TrustFrameworkLocalization.xml,TrustFrameworkExtensions.xml,SignUpOrSignin.xml`.
        
1. Select **Save** to save the Agent job.

## Test your pipeline

To test your release pipeline:

1. Select **Pipelines** and then **Releases**.
1. Select the pipeline you created earlier, for example *DeployCustomPolicies*.
1. Select **Create release**, then select **Create** to queue the release.

You should see a notification banner that says that a release has been queued. To view its status, select the link in the notification banner, or select it in the list on the **Releases** tab.


## Next steps

Learn more about:

* [Service-to-service calls using client credentials](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md)
* [Azure DevOps Services](/azure/devops/get-started/)

<!-- LINKS - External -->
[devops]: /azure/devops/
[devops-create-project]:  /azure/devops/organizations/projects/create-project
[devops-pipelines]: /azure/devops/pipelines/
