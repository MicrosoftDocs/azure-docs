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
ms.date: 09/26/2025
---

# Securely connect to Azure resources or clone private repositories

When you access resources like repositories or Azure resources during the customization process, you need to authenticate securely. You can reference Azure Key Vault secrets in your customization files to avoid exposing sensitive information, and you can use service principals to authenticate to Azure for secure resource access. This article explains how to manage and access resources securely during dev box customization.

## Use key vault secrets in customization files

Use secrets from Azure Key Vault in your YAML customizations to clone private repositories or run tasks that require an access token. For example, in a customization file, use a personal access token (PAT) stored in Azure Key Vault to access a private repository.

Both team and user customizations support fetching secrets from a key vault. Team customizations, which use image definition files, define the base image for the dev box with the `image` parameter, and list the tasks that run when a dev box is created. User customizations list the tasks that run when a dev box is created. 

To use a secret, like a PAT, in your customization files, store it as a key vault secret. The following examples show how to reference a key vault secret in both types of customizations.

### Configure key vault access for customizations

To configure key vault secrets for use in your team or user customizations, make sure the Dev Center project's managed identity has the Key Vault Secrets User role on your key vault.

If your key vault is private, let trusted Microsoft services bypass the firewall because Dev Center doesn't yet support service tags.

The following screenshot shows the option to allow trusted Microsoft services to bypass the firewall in Azure Key Vault settings.

:::image type="content" source="media/how-to-customizations-connect-resource-repository/trusted-services-bypass-firewall.png" alt-text="Screenshot of the option to allow trusted Microsoft services to bypass the firewall in Azure Key Vault settings." lightbox="media/how-to-customizations-connect-resource-repository/trusted-services-bypass-firewall.png":::

To learn more about how to let trusted Microsoft services bypass the firewall, see [Configure Azure Key Vault networking settings](/azure/key-vault/general/how-to-azure-key-vault-network-security).

#### Additional configuration for user customizations

To configure key vault secrets for user customizations, also:

1. Ensure the Dev Center project's managed identity has both the Key Vault Reader and Key Vault Secrets User roles on your key vault.
1. Grant the Key Vault Secrets User role for the secret to each user or group who needs it during dev box customization, including the Dev Center managed identity, admin accounts, and any other required users or groups.

### Team customizations example

This syntax uses a key vault secret (PAT) in an image definition file. The `KEY_VAULT_SECRET_URI` is the URI of the secret in your key vault.

```yaml
$schema: "<SCHEMA_VERSION>"
name: "<IMAGE_DEFINITION_NAME>"
image: "<BASE_IMAGE>"
description: "<DESCRIPTION>"

tasks:
  - name: <TASK_NAME>
    description: <TASK_DESCRIPTION>
    parameters:
      repositoryUrl: <REPOSITORY_URL>
      directory: <DIRECTORY_PATH>
      pat: "{{<KEY_VAULT_SECRET_URI>}}"
```

This example uses the `git-clone` task:

```yaml
$schema: "1.0"
name: "example-image-definition"
image: microsoftvisualstudio_visualstudioplustools_vs-2022-ent-general-win11-m365-gen2
description: "Clones a public example Git repository"

tasks:
  - name: git-clone
    description: Clone this repository into C:\workspaces
    parameters:
      repositoryUrl: https://github.com/example-org/example-repo.git
      directory: C:\workspaces
      pat: "{{https://contoso-vault.vault.azure.net/secrets/github-pat}}"
```

Or, you can reference the secret in-line with a built-in task, as shown in the following example:

```yaml
$schema: "1.0" 
name: "example-image-definition"
image: microsoftvisualstudio_visualstudioplustools_vs-2022-ent-general-win11-m365-gen2
description: "Clones a public example Git repository"

tasks:  
- name: git-clone
    description: Clone this repository into C:\Workspaces 
    parameters: 
    command: MyCommand –MyParam "{{KEY_VAULT_SECRET_URI}}"
```


### User customizations example

User customizations let you obtain an Azure DevOps token to clone private repositories without explicitly specifying a PAT from the key vault. The service automatically exchanges your Azure token for an Azure DevOps token at run time.

This example shows the ADO shorthand (`{{ado://...}}`). The service exchanges your Azure token for an Azure DevOps token at runtime, so you don't need to store a PAT in Key Vault.

```yaml
$schema: "1.0"
tasks:
  - name: git-clone
    description: Clone this repository into C:\workspaces
    parameters:
      repositoryUrl: https://dev.azure.com/example-org/MyProject/_git/example-repo
      directory: C:\workspaces
      pat: '{{ado://example-org}}'
```

The Dev Box Visual Studio Code extension and Dev Box CLI don't support hydrating secrets in the inner-loop testing workflow for customizations.

## Authenticate to Azure resources with service principals

Service principals let you securely authenticate to Azure resources without exposing user credentials. Create a service principal, assign the required roles, and use it to authenticate in a customization task. Hydrate its password from Key Vault at customization time using the existing secrets feature.

1. Create a service principal in Azure Active Directory (Azure AD), and assign it the necessary roles for the resources you want to use.

   The output is a JSON object containing the service principal's *appId*, *displayName*, *password*, and *tenant*, which are used for authentication and authorization in Azure Automation scenarios.

   Example: CLI output when you create a service principal. Store the returned password in Key Vault and grant the Key Vault Secrets User role to the Dev Center project identity so the customization can hydrate the secret at runtime.

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
The following example shows how to download a file from a storage account. The YAML snippet defines a Dev Box customization that performs two main tasks:

1. Installs the Azure CLI using the winget package manager.

1. Runs a PowerShell script that:
   - Logs in to Azure using a service principal, with the password securely retrieved from Azure Key Vault.
   - Downloads a blob (file) from an Azure Storage account using the authenticated session.

   Example: customization that hydrates a service principal password from Key Vault and uses it to authenticate and download a blob from Azure Storage. Store the service principal password in Key Vault and ensure the project identity has Key Vault Secrets User role.

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
Download build artifacts from Azure DevOps (ADO) by using a service principal for authentication. Add the service principal's Application ID (appId) as a user in your Azure DevOps organization, then assign the principal to the **Readers** group. This step gives the necessary permissions to use build artifacts.

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
