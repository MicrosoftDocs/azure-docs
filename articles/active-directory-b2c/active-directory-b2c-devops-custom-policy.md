---
title: How to use the Azure AD Graph API
description: The Azure Active Directory (Azure AD) Graph API provides programmatic access to Azure AD through OData REST API endpoints. Applications can use Azure AD Graph API to perform create, read, update, and delete (CRUD) operations on directory data and objects.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/18/2019
ms.author: marsma
ms.subservice: B2C
---

# How to: Deploy custom policies from your Azure DevOps pipeline

Continuous Integration and Delivery (CI/CD) Pipeline allows an enterprise to automate the software delivery processes and code control. As you deploy between the different Azure AD B2C environments (Dev, QA, and Production), it is recommended to remove manual processes to improve the overall operations of your team such that errors are minimized and automated testing can be performed.

[Azure DevOps](https://azure.microsoft.com/en-us/overview/devops/) unifies people, process, and technology across development and IT, and can be integrated with your Azure AD B2C policy management. Deployment scripts can be integrated by making use of Service-to-Service calls between Azure DevOps and Azure AD B2C via the [Client Credential Grant Flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow).

The OAuth 2.0 Client Credentials Grant Flow permits a web service (confidential client) to use its own credentials instead of impersonating a user, to authenticate when calling another web service. In this scenario, the client, Azure DevOps, is acting as a middle-tier web service. Using these instructions will allow you to use the client credential flow to obtain a token and make requests to the Microsoft Graph API.  For more information about OAuth 2.0 client credentials grant visit [Service to service calls using client credentials (shared secret or certificate)](https://docs.microsoft.com/en-us/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow)

There are three steps to configure Azure DevOps to manage custom policies within Azure AD B2C:

1. Create a web application in Azure Active Directory within the Azure AD B2C tenant
2. Configure your Azure DevOps git repository
3. Configure your Azure DevOps release pipeline

## Prerequisites

* An Azure AD subscription with an [Azure AD B2C tenant](https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant) setup.
* An [Azure DevOps pipeline](https://azure.microsoft.com/en-us/services/devops/pipelines/) with access to a specific Azure DevOps Project
* An Azure AD admin credential which has permissions for Application Registration creation and the ability to consent as an Administrator. The latter will require a Global Administrator.

## Graph API versions

Performing Create, Read, Update, Delete (CRUD) operations against Azure AD B2C custom policies uses the Beta endpoint of the [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/overview?view=graph-rest-beta).

   > [!Important]
   > API's under the `beta` version in the Microsoft Graph are subject to change. Use of these APIs in production applications is not supported. Visit [Microsoft Graph beta endpoint reference](https://docs.microsoft.com/en-us/graph/api/overview?toc=./ref/toc.json&view=graph-rest-beta) to get started.

## Configure a web application in Azure Active Directory
1) Sign in to [Azure Portal](https://portal.azure.com/) using your Azure AD admin credentials

2) Navigate to your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory for your Azure AD B2C environment.

3) In the left panel, select **Azure Active Directory** icon.

4) From the left menu blade, select **App registrations (Legacy)**. Select the **New application registration** from the action bar.

5) Enter the configurations as suggested below and select **'Create'**.

    i. **Name** : Enter the name of the application
    
    ii. **Application type** :  Web app / API

    iii. **Sign-on URL** : Enter the sign-on URL of the application

    > [!NOTE]
    > If you do not have an application URL yet, you can use https://jwt.ms for testing

6) After the application is created, Select **'Settings'** and then **'Required Permissions'** under the API Access subsection.

7) Select **'Add'**. And then **'Select an API'** from the new blade.

8) Select **'Microsoft Graph'** from the list and then click **'Select'** button.

9) You will be redirected to the 'Select permissions' within Add API access blade. From **APPLICATION PERMISSIONS**, check *'Read and write your organization's trust framework policies'*.

10) Choose **'Select'** at the bottom, and then **'Done'**

11) Select **'Grant permissions'** to grant newly selected permissions consent to the application

12) In the dialogue box, select **'Yes'** to accept these permissions

    > [!NOTE]
    > If you do not select **'Grant permissions'** and accept the newly configured permissions, no new permissions will be granted.  While the permissions may have been configured, they are not active.

####  Create password for the new app.
1. In settings for the app, select **'Keys'**.

1. Under **'Passwords'** section, enter a description such as *'devopskey'* and select an expiration duration; Then select **'Save'**. 

1. A value for the password will be shown, copy and paste it in a safe place. This is a sensitive piece of information.

    > [!NOTE]
    > After exiting the **Keys** blade, you will no be able to read the **Value** of the key that you just generated. This is why it is important to secure this value during this step.

1. Navigate to the overview page of this specific registered application, and copy the **'Application ID'**. It will be used in next steps.

## Configure your Azure DevOps git repository
1. Sign in to your Azure DevOps organization and navigate to your project.

1. In your project, navigate to **Repos** and select the **'Files'** page. 

    > [!NOTE]
    > Select either an existing Repo or create a new one for this exercise.

1. Create a folder called 'B2CAssets'

    > [!NOTE] 
    > When creating a new Folder, it is required to create a "Readme.md" file. You can later remove this file if needed.

1. Add your all Azure AD B2C Policies under the B2CAssets folder. This includes the TrustFrameworkBase.xml, TrustFrameWorkExtensions.xml, SignUpOrSignin.xml, ProfileEdit.xml, PasswordReset.xml and any other created policies.

    >[!NOTE]
    > It is important to keep record of the filename of each Azure AD B2C policy. In a later step, this is used in the arguments within the script.

1. Create a folder with name **'Scripts'** within the root directory of the repository 

1. Copy the PowerShell Script sample below and create a new .PS1 file called **'DeployToB2c.ps1'** within the newly created **'Scripts'** folder.

    > [!NOTE] The script acquires a token from Azure AD based and calls Microsoft Graph API to upload the policies within the B2CAssets folder to your Azure AD B2C tenant.

```powershell
[Cmdletbinding()]
Param(
    [Parameter(Mandatory=$true)][string]$ClientID,
    [Parameter(Mandatory=$true)][string]$ClientSecret,
    [Parameter(Mandatory=$true)][string]$TenantId,
    [Parameter(Mandatory=$true)][string]$PolicyId,
    [Parameter(Mandatory=$true)][string]$PathToFile    
)

try{
    $body = @{grant_type="client_credentials";scope="https://graph.microsoft.com/.default";client_id=$ClientID;client_secret=$ClientSecret}

    $response=Invoke-RestMethod -Uri https://login.microsoftonline.com/$TenantId/oauth2/v2.0/token -Method Post -Body $body
    $token=$response.access_token

    $headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
    $headers.Add("Content-Type", 'application/xml')
    $headers.Add("Authorization", 'Bearer ' + $token)

    $graphuri = 'https://graph.microsoft.com/beta/trustframework/policies/'+$PolicyId+'/$value'
    $policycontent = Get-Content $PathToFile
    $response=Invoke-RestMethod -Uri $graphuri -Method Put -Body $policycontent -Headers $headers

    Write-Host "Policy" $PolicyId "uploaded successfully."
}
catch 
{
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
1. In your project, navigate to the **'Releases'** page under **'Pipelines'**. Then choose the action to create a new pipeline.
    - Select **'New'** then Select **'New release pipeline'**
1. Select **'Empty Job'** at the top of navigation pane to choose a template.
1. In the next screen, enter a name for the stage such as 'DeployCustomPolicies' and close window.
1. Select **'Add an artifact'** to the pipeline. For this guide, follow prompts and choose your repo. 
    - Under **'Select repository'**, choose the repo that you generated the previous **'Scripts'** folder 
    - Choose the correct branch for **'Default branch'**
    - You may leave default value for **"Default version** for 'Latest form the default branch'
1. Once complete, select **'Add'**
1. Switch to **'Variables'** tab.
1. Add following variables under **'Pipeline variables'**:
    - **Name:** clientId <br/>
    **Value:** 'applicationId of the app you created earlier'
    - **Name:** clientSecret <br/> 
    **Value:** 'password of the app you created earlier' from the application **Keys**. 
        - Please make sure to change variable type to 'Secret' by selecting the lock icon next to Value field. 
    - **Name:** tenantId <br/>
    **Value:** 'yourtenant.onmicrosoft.com'
        - Also known as the default domain name
    
1. Switch to **Tasks** tab.
1. Select Agent job, and then select '+' to add a task to the Agent job. From right side search for 'PowerShell' and add it. There might be multiple 'PowerShell' tasks, such as Azure PowerShell etc. Please choose the one which says just **'PowerShell'** and select **'Add'**.
    1. Select newly added 'PowerShell Script' task.
    1. Enter following values 
        - **Task Version:** 1.* or 2.* Decide the correct version based on [release notes](https://docs.microsoft.com/en-us/windows/win32/taskschd/what-s-new-in-task-scheduler).
        - **Display Name:** 'name of the specific policy that you are targeting to upload Example: 'B2C_1A_TrustFrameworkBase'
        - **Type:** File Path
        - **Script Path:** Click on the "..." icon and Navigate to the 'DeployToB2C.ps1' file. Select this file. 
        - **Arguments:** <br/>
        -ClientID $(clientId) -ClientSecret $(clientSecret) -TenantId $(tenantId) -PolicyId B2C_1A_TrustFrameworkBase -PathToFile $(System.DefaultWorkingDirectory)/B2CAssets/TrustFrameworkBase.xml <br/>
            > [!NOTE] PolicyId is not the filename and instead is a value stored with the XML policy. This is located at the beginning of policy file. See Example:
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


This sample uploads only one policy.
> [!NOTE] Remember to update the **Arguments** for each **Agent job** between the different policies. Specifically, the '-PolicyId' and '-PathToFile' parameters. <br/> <br/>
> Try running one Agent job successfully before creating new ones.

When running the agents and uploading the policy files, ensure they are in this order:

1. *TrustFrameworkBase.xml*
1. *TrustFrameworkExtensions.xml*
1. *SignUpOrSignin.xml*
1. *ProfileEdit.xml*
1. *PasswordReset.xml*
    
    > [!NOTE] 
    > The Identity Experience Framework will enforce this as the file structure is built on a hierarchical chain.



## Test your new pipeline

To test your release pipeline:

1. Select **Pipelines** and then **Builds**
1. Select the specific pipeline called "DeployCustomPolicies" or your newly named pipeline
1. At the top right of the screen, select the button **'Queued'** and click **'Run'**

## Next steps

* Learn more about the [Azure AD Graph API](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog)
* Learn more about [Azure AD Graph API permission scopes](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-permission-scopes)
* Learn more about [Service to service calls using client credentials](https://docs.microsoft.com/en-us/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow)
* Learn how to get started with [Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/user-guide/?view=azure-devops)