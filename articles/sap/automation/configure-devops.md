---
title: Configure Azure DevOps for SAP Deployment Automation
description: Configure Azure DevOps Services for SAP Deployment Automation Framework to set up projects, pipelines, service connections, and variable groups for SAP deployments.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 03/19/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom:
  - devx-track-arm-template
  - devx-track-azurecli
  - sfi-ropc-nochange
# Customer intent: As a DevOps engineer, I want to configure Azure DevOps Services for the SAP Deployment Automation Framework so that I can automate deployment and management of SAP applications across different environments.
---

# Configure Azure DevOps Services for SAP Deployment Automation Framework

This article shows how to configure Azure DevOps Services to run SAP Deployment Automation Framework pipelines. This configuration helps you standardize and repeat SAP infrastructure deployment, software acquisition, and configuration tasks across environments.

You set up the Azure DevOps project assets, service connections, pipelines, permissions, and variable groups that the framework requires. After you complete these steps, you can run deployments and ongoing SAP environment operations from Azure DevOps Services.

## Choose a configuration method

Use this table to choose the setup path for your environment.

| Method | Best when | Main outcome |
| --- | --- | --- |
| Automated configuration scripts | You want to bootstrap project artifacts quickly and use framework defaults. | Scripts create the Azure DevOps project, service connections, and baseline deployment assets. |
| Manual Azure DevOps configuration | You need full control over repository import, service connections, and pipeline definitions. | You create and configure each Azure DevOps component step by step. |

## Prerequisites

- An Azure subscription and permissions to create resources, managed identities, and service principals.
- An Azure DevOps organization where you can create projects, pipelines, service connections, and variable groups.
- Azure CLI installed and updated on your local workstation (`az upgrade`).
- Windows PowerShell for running the provided scripts.
- Credentials for SAP support (S-user) if you plan to run SAP software acquisition pipelines.

## Sign in to Azure DevOps Services

To use Azure DevOps Services, you need an Azure DevOps organization. An organization is used to connect groups of related projects. Use your work or school account to automatically connect your organization to your Microsoft Entra ID. To create an account, open [Azure DevOps](https://dev.azure.com) and either sign in or create a new account.

## Configure Azure DevOps by using automation scripts

Use this procedure when you want the framework scripts to create the Azure DevOps project, service connections, and baseline artifacts for the control plane.

1. Open PowerShell and copy the following script.
1. Update all parameter values so it matches your environment.
1. Run the script. The script opens browser windows for authentication and for tasks in Azure DevOps.

   > [!IMPORTANT]
   > Run the following steps on your local workstation. Also ensure that you have the latest Azure CLI installed by running the `az upgrade` command.

   ```powershell
   # Azure DevOps Configuration
   $AzureDevOpsOrganizationUrl = "https://dev.azure.com/ORGANIZATIONNAME"

   # Azure Infrastructure Configuration
   $ControlPlaneCode = "MGMT"
   $ControlPlaneRegionCode = "SECE"
   $Location = "swedencentral"

   $ControlPlaneName = "$ControlPlaneCode-$ControlPlaneRegionCode-DEP01"

   $AzureDevOpsProjectName = "SDAF-" + $ControlPlaneCode + "-" + $ControlPlaneRegionCode

   $ControlPlaneSubscriptionId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   $TenantId = "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"

   # SAP Support Credentials
   $Env:SUserName = "SXXXXXXXX"
   $Env:Password = Read-Host "Please enter your SUserName password" -AsSecureString

   $MSIResourceGroupName = "SDAF-MSIs"
   # Azure DevOps Agent Configuration
   $AgentPoolName = "SDAF-$ControlPlaneCode-$ControlPlaneRegionCode-POOL"

   #Repository information
   $repo = "Azure/sap-automation"
   $branch = "main"

   Remove-Module SDAFUtilities -ErrorAction SilentlyContinue

   # Import required modules
   $url="https://raw.githubusercontent.com/$repo/refs/heads/$branch/deploy/scripts/pwsh/Output/SDAFUtilities/SDAFUtilities.psm1"

   Write-Host "Downloading SDAFUtilities module from $url" -ForegroundColor Green

   Invoke-WebRequest -Uri $url -OutFile "SDAFUtilities.psm1"
   Unblock-File -Path ".\SDAFUtilities.psm1"

   Import-Module ".\SDAFUtilities.psm1"

   # Create Managed Identity
   $ManagedServiceIdentity = New-SDAFUserAssignedIdentity `
       -ManagedIdentityName "$ControlPlaneName" `
       -ResourceGroupName $MSIResourceGroupName `
       -SubscriptionId $ControlPlaneSubscriptionId `
       -Location $Location `
       -Verbose

   # Create Azure DevOps Project with Managed Identity
   New-SDAFADOProject `
       -AdoOrganization $AzureDevOpsOrganizationUrl `
       -AdoProject $AzureDevOpsProjectName `
       -TenantId $TenantId `
       -ControlPlaneCode $ControlPlaneCode `
       -ControlPlaneSubscriptionId $ControlPlaneSubscriptionId `
       -ControlPlaneName $ControlPlaneName `
       -AuthenticationMethod 'Managed Identity' `
       -AgentPoolName $AgentPoolName `
       -ManagedIdentityObjectId $ManagedServiceIdentity.PrincipalId `
       -CreateConnections `
       -EnableWebApp `
       -GitHubRepoName $repo `
       -BranchName $branch -Verbose

   Write-Output "Azure DevOps Project '$AzureDevOpsProjectName' created successfully."
   Write-Output "Managed Identity Id: $($ManagedServiceIdentity.Id)"
   Write-Output "Agent Pool Name: $AgentPoolName"
   ```

1. In Azure DevOps, validate that:

   - The project was created
   - The repository was populated
   - The pipelines were created

1. Decide where Terraform and Ansible code runs from:

   - Run code directly from GitHub.
   - Import and run code from repositories in your Azure DevOps project.

### Configure artifacts for a new workload zone

Run this procedure after the control plane project is available.

1. Open PowerShell and copy the following script.
1. Update all parameter values so it matches your environment.
1. Run the script.

Use the following script to deploy the artifacts that are needed to support a new workload zone. This process creates the variable group and the service connection in Azure DevOps and, optionally, the deployment service principal.

```powershell
# Azure DevOps Configuration
$AzureDevOpsOrganizationUrl = "https://dev.azure.com/ORGANIZATIONNAME"

# Azure Infrastructure Configuration
$ControlPlaneCode = "MGMT"
$ControlPlaneRegionCode = "SECE"
$Location = "swedencentral"

$ControlPlaneName = "$ControlPlaneCode-$ControlPlaneRegionCode-DEP01"

$ManagedIdentityName = "$ControlPlaneName"
$MSIResourceGroupName = "SDAF-MSIs"

$AzureDevOpsProjectName = "SDAF-" + $ControlPlaneCode + "-" + $ControlPlaneRegionCode

$ControlPlaneSubscriptionId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$WorkloadSubscriptionId = "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz"
$TenantId = "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"

$WorkloadCode = "TEST"
$WorkloadRegionCode = "SECE"
$WorkloadZoneCode = $WorkloadCode + "-" + $WorkloadRegionCode + "-SAP01"

Remove-Module SDAFUtilities -ErrorAction SilentlyContinue
# Import required modules
#Repository information
$repo = "Azure/sap-automation"
$branch = "main"

Remove-Module SDAFUtilities -ErrorAction SilentlyContinue
# Import required modules
$url="https://raw.githubusercontent.com/$repo/refs/heads/$branch/deploy/scripts/pwsh/Output/SDAFUtilities/SDAFUtilities.psm1"

Write-Host "Downloading SDAFUtilities module from $url" -ForegroundColor Green

Invoke-WebRequest -Uri $url -OutFile "SDAFUtilities.psm1"
Unblock-File -Path ".\SDAFUtilities.psm1"

Import-Module ".\SDAFUtilities.psm1"

# Get Managed Identity
$ManagedServiceIdentity = Get-SDAFUserAssignedIdentity `
    -ManagedIdentityName $ManagedIdentityName `
    -ResourceGroupName $MSIResourceGroupName `
    -SubscriptionId $ControlPlaneSubscriptionId `
    -Verbose
Write-Output "Managed Identity Id: $($ManagedServiceIdentity.Id)"

New-SDAFADOWorkloadZone `
    -AdoOrganization $AzureDevOpsOrganizationUrl `
    -AdoProject $AzureDevOpsProjectName `
    -TenantId $TenantId `
    -ControlPlaneCode $ControlPlaneCode `
    -WorkloadZoneCode $WorkloadZoneCode `
    -WorkloadZoneSubscriptionId $WorkloadSubscriptionId `
    -AuthenticationMethod 'Managed Identity' `
    -ManagedIdentityObjectId $ManagedServiceIdentity.PrincipalId `
    -ManagedIdentityId $ManagedServiceIdentity.IdentityId `
    -ControlPlaneSubscriptionId $ControlPlaneSubscriptionId `
    -CreateConnections `
    -Verbose
```

In Azure DevOps, confirm that the workload zone variable group and service connection were created.

### Create a sample control plane configuration

To generate an initial control plane configuration, run the **Create Sample Deployer Configuration** pipeline.

1. In Azure DevOps, open the pipeline and select **Run**.
1. Select the appropriate Azure region.
1. Set optional component flags, such as Azure Firewall, Azure Bastion, and Configuration App Service.
1. Validate that the generated sample files were added to your configuration repository.

## Manual configuration of Azure DevOps Services for SAP Deployment Automation Framework

Use this path when you want to create and configure project assets manually instead of using the automation scripts.

### Create a new project

1. Open [Azure DevOps](https://dev.azure.com).
1. Select **New Project** and enter project details.

   The project contains Azure Repos and Azure Pipelines for deployment activities.

1. If you don't see **New Project**, verify that you have permission to create projects in the organization.
1. Record the project URL. You use this URL in **Configure the Azure DevOps Services self-hosted agent manually**.

### Import the repository

1. Go to **Repositories** and select **Import a repository**.
1. Import the [sap-automation-bootstrap repository](https://github.com/Azure/sap-automation-bootstrap.git).
1. If import fails, continue with **Create the repository for manual import** and **Manually import the repository content by using a local clone**.

For more information, see [Import a repository](/azure/devops/repos/git/import-git-repository?view=azure-devops&preserve-view=true).

### Create the repository for manual import

Only do this step if direct import is unavailable.

1. In **Repos**, under **Project settings**, select **Create**.
1. Select repository type **Git**.
1. Enter a repository name, such as **SAP Configuration Repository**.

### Clone the repository

1. In **Repos** > **Files**, select **Clone**.
1. Clone the repository to a local folder.

   :::image type="content" source="./media/devops/automation-repo-clone.png" alt-text="Screenshot of Azure DevOps with a repository ready for cloning.":::

For more information, see [Clone a repository](/azure/devops/repos/git/clone?view=azure-devops#clone-an-azure-repos-git-repo&preserve-view=true).

### Manually import the repository content by using a local clone

1. Download [sap-automation-samples](https://github.com/Azure/sap-automation-samples) as a `.zip` file.
1. Extract the archive and copy the content into the root of your local clone.
1. Open the local folder in Visual Studio Code and verify that source control shows pending changes.

   :::image type="content" source="./media/devops/automation-vscode-changes.png" alt-text="Screenshot of Visual Studio Code showing pending source control changes after files are copied.":::

1. Commit the imported content, for example with message **Import from GitHub**.
1. Select **Sync Changes** to push changes back to Azure Repos.

### Choose the source for the Terraform and Ansible code

You can either run the SAP Deployment Automation Framework code directly from GitHub or you can import it locally.

#### Run the code from a local repository

If you want to run the SAP Deployment Automation Framework code from the local Azure DevOps project, you need to create a separate code repository and a configuration repository in the Azure DevOps project:

- **Name of configuration repository**: `Same as the DevOps Project name`. Source is the [sap-automation-bootstrap repository](https://github.com/Azure/sap-automation-bootstrap.git).
- **Name of code repository**: `sap-automation`. Source is the [sap-automation repository](https://github.com/Azure/sap-automation.git).
- **Name of sample and template repository**: `sap-samples`. Source is the [sap-automation-samples repository](https://github.com/Azure/sap-automation-samples.git).

#### Run the code directly from GitHub

If you want to run the code directly from GitHub, you need to provide credentials for Azure DevOps to be able to pull the content from GitHub.

#### Create the GitHub service connection

To pull the code from GitHub, you need a GitHub service connection. For more information, see [Manage service connections](/azure/devops/pipelines/library/service-endpoints?view=azure-devops&preserve-view=true).

1. In Azure DevOps, go to **Project Settings** > **Pipelines** > **Service connections**.

   :::image type="content" source="./media/devops/automation-create-service-connection.png" alt-text="Screenshot that shows how to create a service connection for GitHub in Azure DevOps.":::

1. Select **GitHub** as the service connection type.
1. In **OAuth Configuration**, select **Azure Pipelines**.
1. Select **Authorize** and sign in to GitHub.
1. Enter a connection name, for example **SDAF Connection to GitHub**.
1. Select **Grant access permission to all pipelines**.
1. Select **Save**.

## Set up an app registration for the web app (optional)

The automation framework can provision a web app as part of the control plane. If you want to use the web app, create an app registration first.

Open an Azure Cloud Shell, then run the following commands for your shell environment:

# [Linux](#tab/linux)

Replace `MGMT` with your environment, as necessary.

```bash
echo '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]' >> manifest.json

TF_VAR_app_registration_app_id=$(az ad app create --display-name MGMT-webapp-registration --enable-id-token-issuance true --sign-in-audience AzureADMyOrg --required-resource-access @manifest.json --query "appId" | tr -d '"')

echo $TF_VAR_app_registration_app_id

app_registration_client_secret=$(az ad app credential reset --id $TF_VAR_app_registration_app_id --append --query "password" -o tsv)

echo "Store app_registration_client_secret in a secure location such as Azure Key Vault or an Azure DevOps secret variable. Don't store it in plain text files or source control."

rm manifest.json
```

# [Windows](#tab/windows)

Replace `MGMT` with your environment, as necessary.

```powershell
Add-Content -Path manifest.json -Value '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]'

$TF_VAR_app_registration_app_id=(az ad app create --display-name MGMT-webapp-registration --enable-id-token-issuance true --sign-in-audience AzureADMyOrg --required-resource-access .\manifest.json --query "appId").Replace('"',"")

echo $TF_VAR_app_registration_app_id

$app_registration_client_secret=(az ad app credential reset --id $TF_VAR_app_registration_app_id --append --query "password" -o tsv)

Write-Host "Store app_registration_client_secret in a secure location such as Azure Key Vault or an Azure DevOps secret variable. Don't store it in plain text files or source control."

del manifest.json
```

---

Store the app registration ID and generated client secret in a secure location, such as Azure Key Vault or Azure DevOps secret variables. Don't store credentials in plain text files, screenshots, or source control.

## Create Azure Pipelines

Azure Pipelines are implemented as YAML files in the repository. Create each pipeline from the corresponding YAML path.

1. In Azure DevOps, go to **Pipelines** and select **New pipeline**.
1. Select **Azure Repos Git**.
1. Select the root repository (same name as the project).
1. Select **Existing Azure Pipelines YAML file**.
1. For each pipeline in the following table, select the YAML path, save the pipeline, and rename it to the listed display name.

| Pipeline | YAML path | Display name |
| --- | --- | --- |
| Control plane deployment | `pipelines/01-deploy-control-plane.yml` | Control plane deployment |
| SAP workload zone deployment | `pipelines/02-sap-workload-zone.yml` | SAP workload zone deployment |
| SAP system deployment (infrastructure) | `pipelines/03-sap-system-deployment.yml` | SAP system deployment (infrastructure) |
| SAP software acquisition | `deploy/pipelines/04-sap-software-download.yml` | SAP software acquisition |
| SAP configuration and software installation | `pipelines/05-DB-and-SAP-installation.yml` | SAP configuration and software installation |
| Deployment removal | `pipelines/10-remover-terraform.yml` | Deployment removal |
| Deployment removal using Azure Resource Manager | `pipelines/11-remover-arm-fallback.yml` | Deployment removal using ARM processor |
| Control plane removal | `pipelines/12-remove-control-plane.yml` | Control plane removal |
| Repository updater | `pipelines/20-update-ado-repository.yml` | Repository updater |

The **Repository updater** pipeline updates your Azure DevOps repository when you want to consume changes from `sap-automation`.

> [!NOTE]
> Use the **Deployment removal using Azure Resource Manager** pipeline only as a last resort. Removing only resource groups can leave remnants that complicate redeployments.

## Import the cleanup task from Visual Studio Marketplace

The pipelines use a custom task to perform cleanup activities post deployment. You can install the custom task from [Post Build Cleanup](https://marketplace.visualstudio.com/items?itemName=mspremier.PostBuildCleanup). Install it to your Azure DevOps organization before you run the pipelines.

## Preparations for a self-hosted agent

1. Create an agent pool by going to **Organizational Settings**. Under the **Pipelines** section, select **Agent Pools** > **Add Pool**. Select **Self-hosted** as the pool type. Name the pool to align with the control plane environment. For example, use `MGMT-WEEU-POOL`. Ensure that **Grant access permission to all pipelines** is selected and select **Create** to create the pool.

1. Sign in with the user account you plan to use in your [Azure DevOps](https://dev.azure.com) organization.

1. From your home page, open your user settings and select **Personal access tokens**.

   :::image type="content" source="./media/devops/automation-select-personal-access-tokens.jpg" alt-text="Screenshot of Azure DevOps user settings where the personal access tokens option is highlighted.":::

1. Create a personal access token with these settings:

   - **Agent Pools**: Select **Read & manage**.
   - **Build**: Select **Read & execute**.
   - **Code**: Select **Read & write**.
   - **Variable Groups**: Select **Read, create, & manage**.

   Store the token in a secure location. Don't store the token value in plain text files, screenshots, terminal logs, or source control.

   :::image type="content" source="./media/devops/automation-new-pat.png" alt-text="Screenshot of the new personal access token page with the required scopes configured.":::

## Configure variable groups

The deployment pipelines are configured to use a set of predefined parameter values defined by using variable groups.

### Common variables

Common variables are used by all the deployment pipelines. They're stored in a variable group called `SDAF-General`.

Create a new variable group named `SDAF-General` by using the **Library** page in the **Pipelines** section. Add the following variables:

| Variable                           | Value                                   | Notes                                                                                       |
| ---------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| Deployment_Configuration_Path      | WORKSPACES                              | For testing the sample configuration, use `samples/WORKSPACES` instead of WORKSPACES.        |
| Branch                             | main                                    |                                                                                             |
| S-Username                         | `<SAP Support user account name>`       |                                                                                             |
| S-Password                         | `<SAP Support user password>`           | Change the variable type to secret by selecting the lock icon.                                   |
| `tf_version`                       | 1.6.0                                   | The Terraform version to use. See [Terraform download](https://www.terraform.io/downloads).  |

Save the variables.

Alternatively, you can use the Azure DevOps CLI to set up the groups.

```bash
s-user="<SAP Support user account name>"

az devops login

az pipelines variable-group create --name SDAF-General --variables ANSIBLE_HOST_KEY_CHECKING=false Deployment_Configuration_Path=WORKSPACES Branch=main S-Username=$s-user tf_version=1.6.0 --output yaml
```

After you create the group, add `S-Password` as a secret variable in Azure DevOps instead of passing the value on the command line.

Remember to assign permissions for all pipelines by using **Pipeline permissions**.

### Environment-specific variables

Because each environment might have different deployment credentials, you need to create a variable group per environment. For example, use `SDAF-MGMT`, `SDAF-DEV`, and `SDAF-QA`.

Create a new variable group named `SDAF-MGMT` for the control plane environment by using the **Library** page in the **Pipelines** section. Add the following variables:

| Variable                        | Value                                                              | Notes                                                    |
| ------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------- |
| Agent                           | `Azure Pipelines` or the name of the agent pool                    | Use the agent pool created in **Preparations for a self-hosted agent**.         |
| CP_ARM_CLIENT_ID                | `Service principal application ID`                                |                                                          |
| CP_ARM_OBJECT_ID                | `Service principal object ID`                                |                                                          |
| CP_ARM_CLIENT_SECRET            | `Service principal password`                                      | Change the variable type to secret by selecting the lock icon. |
| CP_ARM_SUBSCRIPTION_ID          | `Target subscription ID`                                          |                                                          |
| CP_ARM_TENANT_ID                | `Tenant ID` for the service principal                             |                                                          |
| AZURE_CONNECTION_NAME           | Connection name created in **Create a service connection**                                |                                                          |
| sap_fqdn                        | SAP fully qualified domain name, for example, `sap.contoso.net`    | Only needed if Private DNS isn't used.                   |
| FENCING_SPN_ID                  | `Service principal application ID` for the fencing agent          | Required for highly available deployments that use a service principal for the fencing agent.               |
| FENCING_SPN_PWD                 | `Service principal password` for the fencing agent                | Required for highly available deployments that use a service principal for the fencing agent.               |
| FENCING_SPN_TENANT              | `Service principal tenant ID` for the fencing agent               | Required for highly available deployments that use a service principal for the fencing agent.               |
| PAT                             | `<Personal Access Token>`                                          | Use the personal token created in **Preparations for a self-hosted agent**, and set the variable type to secret by selecting the lock icon.      |
| POOL                            | `<Agent Pool name>`                                                | The agent pool to use for this environment.               |
| APP_REGISTRATION_APP_ID         | `App registration application ID`                                  | Required if deploying the web app.                        |
| WEB_APP_CLIENT_SECRET           | `App registration password`                                        | Required if deploying the web app.                        |
| SDAF_GENERAL_GROUP_ID           | The group ID for the SDAF-General group                            | The ID can be retrieved from the URL parameter `variableGroupId` when accessing the variable group by using a browser. For example: `variableGroupId=8`. |
| WORKLOADZONE_PIPELINE_ID        | The ID for the `SAP workload zone deployment` pipeline             | The ID can be retrieved from the URL parameter `definitionId` from the pipeline page in Azure DevOps. For example: `definitionId=31`. |
| SYSTEM_PIPELINE_ID              | The ID for the `SAP system deployment (infrastructure)` pipeline   | The ID can be retrieved from the URL parameter `definitionId` from the pipeline page in Azure DevOps. For example: `definitionId=32`. |

Save the variables.

Remember to assign permissions for all pipelines by using **Pipeline permissions**.

When you use the web app, ensure that the Build Service has at least Contribute permissions.

You can use the clone functionality to create the next environment variable group. APP_REGISTRATION_APP_ID, WEB_APP_CLIENT_SECRET, SDAF_GENERAL_GROUP_ID, WORKLOADZONE_PIPELINE_ID and SYSTEM_PIPELINE_ID are only needed for the SDAF-MGMT group.

## Create a service connection

To remove the Azure resources, you need an Azure Resource Manager service connection. For more information, see [Manage service connections](/azure/devops/pipelines/library/service-endpoints?view=azure-devops&preserve-view=true).

1. In Azure DevOps, go to **Project Settings** > **Pipelines** > **Service connections**.

   :::image type="content" source="./media/devops/automation-create-service-connection.png" alt-text="Screenshot showing how to create a service connection in Azure DevOps.":::

1. Select **Azure Resource Manager** and then select **Service principal (manual)**.
1. Enter the target subscription (typically the control plane subscription) and service principal values.
1. Select **Verify** to validate credentials.
1. Enter a connection name, for example `Connection to MGMT subscription`.
1. Select **Grant access permission to all pipelines**.
1. Select **Verify and save**.

For more information on creating a service principal, see [Create a service principal](deploy-control-plane.md#prepare-the-deployment-credentials).

## Grant repository permissions

Most of the pipelines add files to the Azure Repos and therefore require pull permissions. On **Project Settings**, under the **Repositories** section, select the **Security** tab of the source code repository and assign Contribute permissions to the `Build Service`.

1. Go to **Project Settings** > **Repositories**.
1. Open the source repository **Security** tab.
1. Grant **Contribute** permission to `Build Service`.

   :::image type="content" source="./media/devops/automation-repo-permissions.png" alt-text="Screenshot of Azure DevOps repository security settings with Build Service permissions.":::

## Deploy the control plane

1. If newly created pipelines aren't visible, select **Recent** and then return to **All**.
1. Open the **Control plane deployment** pipeline.
1. Enter configuration names for the deployer and SAP library.
1. Select **Run**.
1. If you want to deploy the configuration web app, select **Deploy the configuration web application**.

### Configure the Azure DevOps Services self-hosted agent manually

Manual configuration is only needed if the Azure DevOps Services agent isn't automatically configured. Check that the agent pool is empty before you proceed.

To connect to the deployer:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to the resource group that contains the deployer virtual machine (VM).

1. Connect to the VM by using Azure Bastion.

1. The default username is **azureadm**.

1. Select **SSH Private Key from Azure Key Vault**.

1. Select the subscription that contains the control plane.

1. Select the deployer key vault.

1. From the list of secrets, select the secret that ends with **-sshkey**.

1. Connect to the VM.

To configure the deployer, run the following script:

```bash
mkdir -p ~/Azure_SAP_Automated_Deployment

cd ~/Azure_SAP_Automated_Deployment

git clone https://github.com/Azure/sap-automation.git

cd sap-automation/deploy/scripts

./configure_deployer.sh
```

To set up the Azure DevOps agent, reboot the deployer, reconnect, and run the following script:

```bash
cd ~/Azure_SAP_Automated_Deployment/

$DEPLOYMENT_REPO_PATH/deploy/scripts/setup_ado.sh
```

Accept the license and, when you're prompted for the server URL, enter the Azure DevOps project URL that you recorded in **Create a new project**. For authentication, select **PAT** and enter the personal access token (PAT) value that you created in **Preparations for a self-hosted agent**.

When prompted, enter the agent pool name that you created in **Preparations for a self-hosted agent** (for example, `MGMT-WEEU-POOL`). Accept the default agent name and the default work folder name. The agent is now configured and starts.

## Deploy the control plane web application

Selecting the `deploy the web app infrastructure` parameter when you run the control plane deployment pipeline provisions the infrastructure necessary for hosting the web app. The **Deploy web app** pipeline publishes the application's software to that infrastructure.

1. Run the control plane deployment pipeline with `deploy the web app infrastructure` enabled.
1. Wait for deployment to complete.
1. Open the **Extensions** tab and complete the post-deployment configuration.
1. Update app registration `reply-url` values.

As a result of running the control plane pipeline, part of the web app URL that is needed is stored in a variable named `WEBAPP_URL_BASE` in your environment-specific variable group. At any time, you can update the URLs of the registered application web app by using the following command.

This command updates the app registration homepage URL and redirect Uniform Resource Identifiers (URIs) for the deployed control plane web app.

# [Linux](#tab/linux)

```bash
webapp_url_base=<WEBAPP_URL_BASE>
az ad app update --id $TF_VAR_app_registration_app_id --web-home-page-url https://${webapp_url_base}.azurewebsites.net --web-redirect-uris https://${webapp_url_base}.azurewebsites.net/ https://${webapp_url_base}.azurewebsites.net/.auth/login/aad/callback
```

# [Windows](#tab/windows)

```powershell
$webapp_url_base="<WEBAPP_URL_BASE>"
az ad app update --id $TF_VAR_app_registration_app_id --web-home-page-url https://${webapp_url_base}.azurewebsites.net --web-redirect-uris https://${webapp_url_base}.azurewebsites.net/ https://${webapp_url_base}.azurewebsites.net/.auth/login/aad/callback
```

---

Grant **Reader** at subscription scope to the app service system-assigned managed identity:

- Open the app service resource.
- Select **Identity**.
- On **System assigned**, select **Azure role assignments** > **Add role assignment**.
- Select scope **Subscription** and role **Reader**, then select **Save**.

You should now be able to visit the web app and use it to deploy SAP workload zones and SAP system infrastructure.

## Next step

> [!div class="nextstepaction"]
> [Azure DevOps hands-on lab](devops-tutorial.md)
