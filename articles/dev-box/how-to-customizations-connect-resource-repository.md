---
title: Use Customizations to Connect to Azure Resources or Clone Private Repositories
description: Discover how to use fetch Azure Key Vault secrets by using team and user customization files to enhance security and simplify workflows.
#customer intent: As a platform engineer, I want to configure Azure Key Vault secrets so that my development teams can securely access private repositories during Dev Box customization.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/10/2025
  - ai-gen-description
ms.topic: how-to
ms.date: 07/22/2025
---

# Connect to Azure resources or clone private repositories by using customizations

You can use secrets from your Azure key vault in your YAML customizations to clone private repositories, or with any task you author that requires an access token. For example, in a team customization file, you can use a personal access token (PAT) stored in a key vault to access a private repository.

## Use key vault secrets in customization files

To use a secret, like a PAT, in your customization files, store your PAT as a key vault secret. 

Both team and user customizations support fetching secrets from a key vault. Team customizations, also known as image definition files, define the base image for the dev box with the `image` parameter, and list the tasks that run when a dev box is created. User customizations list the tasks that run when a dev box is created. The following examples show how to use a key vault secret in both types of customizations.

To configure key vault secrets for use in your team or user customizations, ensure that your dev center project's managed identity has the Key Vault Secrets User role on your key vault.

To configure key vault secrets for use in user customizations, you need to additionally:

1. Ensure that your dev center project's managed identity has the Key Vault Reader role and the Key Vault Secrets User role on your key vault.
2. Grant the Key Vault Secrets User role for the key vault secret to each user or user group that should be able to consume the secret during the customization of a dev box. The user or group granted the role must include the managed identity for the dev center, the admin's user account, and any user or group that needs the secret during dev box customization.

You can use a key vault secret in-line with the built-in PowerShell task: 

```yml
$schema: "1.0" 
image: microsoftwindowsdesktop_windows-ent-cpc_win11-24H2-ent-cpc 
tasks:  
- name: git-clone
    description: Clone this repository into C:\Workspaces 
    parameters: 
    command: MyCommand –MyParam '{{KEY_VAULT_SECRET_URI}}' 
```
This example shows an image definition file. The `KEY_VAULT_SECRET_URI` is the URI of the secret in your key vault. 

You can reference the secret in your YAML customization in the following format, which uses the `git-clone` task as an example:

```yml
$schema: "1.0"
tasks:
  - name: git-clone
    description: Clone this repository into C:\Workspaces
    parameters:
      repositoryUrl: https://myazdo.visualstudio.com/MyProject/_git/myrepo
      directory: C:\Workspaces
      pat: '{{KEY_VAULT_SECRET_URI}}'
```
This example shows a user customization file. There is no `image` specified.

User customizations let you obtain an Azure DevOps token to clone private repositories without explicitly specifying a PAT from the key vault. The service automatically exchanges your Azure token for an Azure DevOps token at run time.  

```yml
$schema: "1.0" 
tasks: 
  - name: git-clone 
    description: Clone this repository into C:\Workspaces 
    parameters: 
      repositoryUrl: https://myazdo.visualstudio.com/MyProject/_git/myrepo 
      directory: C:\Workspaces 
      pat: '{{ado://YOUR_ORG_NAME}}' 
``` 

The Dev Box VS Code extension and Dev Box CLI don't support hydrating secrets in the inner-loop testing workflow for customizations. 

### Configure key vault access

The dev center needs access to your key vault. Because dev centers don't support service tags, if your key vault is private, let trusted Microsoft services bypass the firewall.

:::image type="content" source="media/how-to-customizations-connect-resource-repository/trusted-services-bypass-firewall.png" alt-text="Screenshot that shows the option to allow trusted Microsoft services to bypass the firewall in Azure Key Vault settings." lightbox="media/how-to-customizations-connect-resource-repository/trusted-services-bypass-firewall.png":::

To learn how to let trusted Microsoft services bypass the firewall, see [Configure Azure Key Vault networking settings](/azure/key-vault/general/how-to-azure-key-vault-network-security).


## Authenticate to Azure resources with service principals

Service principals let you securely authenticate to Azure resources exposing user credentials. You can create a Service Principal, assign the necessary role assignments, and use it to authenticate in a customization tasks, hydrating its credentials at customization time using the existing secrets feature. The next section explains the steps.

1. Create a service principal in Azure Active Directory (Azure AD), and assign it the necessary roles for the resources you want to use.

   The output is a JSON object containing the service principal's *appId*, *displayName*, *password*, and *tenant*, which are used for authentication and authorization in Azure Automation scenarios.

   ```azurecli
   $ az ad sp create-for-rbac -n DevBoxCustomizationsTest
    
   {
     "appId": "...",
     "displayName": "DevBoxCustomizationsTest",
     "password": "...",
     "tenant": "..."
   }
   ```

1. Store the password returned above in a Key Vault secret, like this: `https://mykeyvault.vault.azure.net/secrets/password`

1. On the Key Vault, grant the *Key Vault Secrets User* role to the project identity.

Now you can authenticate in customization tasks, hydrating the service principal password from the Key Vault at customization time.

### Example: Download a file from Azure Storage
The following example shows you how to download a file from storage account. The YAML snippet defines a Dev Box customization that performs two main tasks:

1. Installs the Azure CLI using the winget package manager.

1. Runs a PowerShell script that:
   - Logs in to Azure using a service principal, with the password securely retrieved from Azure Key Vault.
   - Downloads a blob (file) from an Azure Storage account using the authenticated session.

   ```yaml
   $schema: "1.0"
   name: "devbox-customization"
   tasks:
     - name: ~/winget
       parameters:
         package: Microsoft.AzureCLI
     - name: ~/powershell
       parameters:
         command: |
           az login --service-principal `
             --username <appId> `
             --password {{https://mykeyvault.vault.azure.net/secrets/password}} `
             --tenant <tenantId>
           az storage blob download `
             --account-name <storage_account_name> `
             --container-name <container_name> `
             --name <blob_name> `
             --file <local_file_path> `
             --auth-mode login
   ```

This setup lets you automate secure use of Azure resources during Dev Box provisioning without exposing credentials in the script.

### Example: Download an artifact from Azure DevOps
Download build artifacts from Azure DevOps (ADO) by using a service principal for authentication. Add the service principal's Application ID (appId) as a user in your Azure DevOps organization, and assign it to the **Readers** group. This step gives the necessary permissions to use build artifacts.

After you configure these steps, use the service principal credentials in customization tasks to authenticate and download artifacts securely from Azure DevOps.

#### Add a service principal to an Azure DevOps organization

To add a service principal to your Azure DevOps organization:

1. Sign in to your Azure DevOps organization, and open **Organization settings**.
1. In the menu, select **Users**.
1. On the **Users** page, select **Add users**.
1. In the **Add new users** dialog, enter the following information:

   :::image type="content" source="media/how-to-customizations-connect-resource-repository/dev-box-customizations-devops-add-user.png" alt-text="Screenshot of the Add new users dialog in Azure DevOps, showing fields for user email, access level, project, and group assignment." lightbox="media/how-to-customizations-connect-resource-repository/dev-box-customizations-devops-add-user.png":::

      - **Users**: Enter the service principal's Application ID (appId) as the user email.
   - **Access Level**: Select **Basic**.
   - **Add to project**: Select the project where you want to add the service principal.
   - **Azure DevOps groups**: Assign the service principal to the **Readers** group.

1. Complete the process to grant the necessary permissions.

For details on how to add users to DevOps organizations, see [Add organization users and manage access](/azure/devops/organizations/accounts/add-organization-users).

## Related content

- Learn how to [Set and retrieve a secret from Azure Key Vault using the Azure portal](/azure/key-vault/secrets/quick-create-portal).
- Learn how to [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).
- Learn how to [Use service principals & managed identities in Azure DevOps](/azure/devops/integrate/get-started/authentication/service-principal-managed-identity).
