---
title: Import SQL BACPAC files with templates
description: Learn how to use Azure SQL Database extensions to import SQL BACPAC files with Azure Resource Manager templates (ARM templates).
ms.date: 03/20/2024
ms.topic: tutorial
ms.custom: devx-track-arm-template
#Customer intent: As a database administrator I want use ARM templates so that I can import a SQL BACPAC file.
---

# Tutorial: Import SQL BACPAC files with ARM templates

Learn how to use Azure SQL Database extensions to import a [BACPAC](/sql/relational-databases/data-tier-applications/data-tier-applications#bacpac) file with Azure Resource Manager templates (ARM templates). Deployment artifacts are any files, in addition to the main template files, that are needed to complete a deployment. The BACPAC file is an artifact.

In this tutorial, you create a template to deploy a [logical SQL server](/azure/azure-sql/database/logical-servers) and a single database and import a BACPAC file. For information about how to deploy Azure virtual machine extensions by using ARM templates, see [Tutorial: Deploy virtual machine extensions with ARM templates](./template-tutorial-deploy-vm-extensions.md).

This tutorial covers the following tasks:

> [!div class="checklist"]
>
> - Prepare a BACPAC file.
> - Open a quickstart template.
> - Edit the template.
> - Deploy the template.
> - Verify the deployment.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this article, you need:

- Visual Studio Code with the Resource Manager Tools extension. See [Quickstart: Create ARM templates with Visual Studio Code](./quickstart-create-templates-use-visual-studio-code.md).
- To increase security, use a generated password for the server administrator account. You can use [Azure Cloud Shell](../../cloud-shell/overview.md) to run the following command in PowerShell or Bash:

    ```shell
    openssl rand -base64 32
    ```

    To learn more, run `man openssl rand` to open the manual page.

    Azure Key Vault is designed to safeguard cryptographic keys and other secrets. For more information, see [Tutorial: Integrate Azure Key Vault in ARM template deployment](./template-tutorial-use-key-vault.md). We also recommend you to update your password every three months.

## Prepare a BACPAC file

A BACPAC file is shared in [GitHub](https://github.com/Azure/azure-docs-json-samples/raw/master/tutorial-sql-extension/SQLDatabaseExtension.bacpac). To create your own, see [Export a database from Azure SQL Database to a BACPAC file](/azure/azure-sql/database/database-export). If you choose to publish the file to your own location, you must update the template later in the tutorial.

The BACPAC file must be stored in an Azure Storage account before it can be imported with an ARM template. The following PowerShell script prepares the BACPAC file with these steps:

- Download the BACPAC file.
- Create an Azure Storage account.
- Create a storage account blob container.
- Upload the BACPAC file to the container.
- Display the storage account key, blob URL, resource group name, and location.

1. Select **Try It** to open Cloud Shell. Then copy and paste the following PowerShell script into the shell window.

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used to generate Azure resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"

    $resourceGroupName = "${projectName}rg"
    $storageAccountName = "${projectName}store"
    $containerName = "bacpacfiles"
    $bacpacFileName = "SQLDatabaseExtension.bacpac"
    $bacpacUrl = "https://github.com/Azure/azure-docs-json-samples/raw/master/tutorial-sql-extension/SQLDatabaseExtension.bacpac"

    # Download the bacpac file
    Invoke-WebRequest -Uri $bacpacUrl -OutFile "$HOME/$bacpacFileName"

    # Create a resource group
    New-AzResourceGroup -Name $resourceGroupName -Location $location

    # Create a storage account
    $storageAccount = New-AzStorageAccount -ResourceGroupName $resourceGroupName `
                                           -Name $storageAccountName `
                                           -SkuName Standard_LRS `
                                           -Location $location
    $storageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName `
                                                  -Name $storageAccountName).Value[0]

    # Create a container
    New-AzStorageContainer -Name $containerName -Context $storageAccount.Context

    # Upload the BACPAC file to the container
    Set-AzStorageBlobContent -File $HOME/$bacpacFileName `
                             -Container $containerName `
                             -Blob $bacpacFileName `
                             -Context $storageAccount.Context

    Write-Host "The project name:        $projectName `
      The location:            $location `
      The storage account key: $storageAccountKey `
      The BACPAC file URL:     https://$storageAccountName.blob.core.windows.net/$containerName/$bacpacFileName `
      "

    Write-Host "Press [ENTER] to continue ..."
    ```

1. Save the storage account key, BACPAC file URL, project name, and location. You'll use those values when you deploy the template later in this tutorial.

## Open a quickstart template

The template used in this tutorial is stored in [GitHub](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/tutorial-sql-extension/azuredeploy.json).

1. From Visual Studio Code, select **File** > **Open File**.
1. In **File name**, paste the following URL:

    ```url
    https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/tutorial-sql-extension/azuredeploy.json
    ```

1. Select **Open** to open the file.

    There are two resources defined in the template:

   - `Microsoft.Sql/servers`. See the [template reference](/azure/templates/microsoft.sql/servers).
   - `Microsoft.SQL.servers/databases`. See the [template reference](/azure/templates/microsoft.sql/servers/databases).

     It's helpful to get some basic understanding of the template before you customize it.

1. Select **File** > **Save As** to save a copy of the file to your local computer with the name _azuredeploy.json_.

## Edit the template

1. Add two parameters at the end of the `parameters` section to set the storage account key and the BACPAC URL.

    ```json
        "storageAccountKey": {
          "type":"string",
          "metadata":{
            "description": "Specifies the key of the storage account where the BACPAC file is stored."
          }
        },
        "bacpacUrl": {
          "type":"string",
          "metadata":{
            "description": "Specifies the URL of the BACPAC file."
          }
        }
    ```

    Add a comma after the `adminPassword` property's closing curly brace (`}`). To format the JSON file from Visual Studio Code, select **Shift+Alt+F**.

1. Add two resources to the template.

    - To allow the SQL Database extension to import BACPAC files, you must allow traffic from Azure services. When the SQL server is deployed, the firewall rule turns on the setting for **Allow Azure services and resources to access this server**.

      Add the following firewall rule under the server definition:

        ```json
        "resources": [
          {
            "type": "firewallrules",
            "apiVersion": "2021-02-01-preview",
            "name": "AllowAllAzureIps",
            "location": "[parameters('location')]",
            "dependsOn": [
              "[parameters('databaseServerName')]"
            ],
            "properties": {
              "startIpAddress": "0.0.0.0",
              "endIpAddress": "0.0.0.0"
            }
          }
        ]
        ```

        The following example shows the updated template:

        :::image type="content" source="media/template-tutorial-deploy-sql-extensions-bacpac/resource-manager-tutorial-deploy-sql-extensions-bacpac-firewall.png" alt-text="Screenshot of the template with firewall definition.":::

    - Add a SQL Database extension resource to the database definition with the following JSON:

        ```json
        "resources": [
          {
            "type": "extensions",
            "apiVersion": "2014-04-01",
            "name": "Import",
            "dependsOn": [
              "[resourceId('Microsoft.Sql/servers/databases', parameters('databaseServerName'), parameters('databaseName'))]"
            ],
            "properties": {
              "storageKeyType": "StorageAccessKey",
              "storageKey": "[parameters('storageAccountKey')]",
              "storageUri": "[parameters('bacpacUrl')]",
              "administratorLogin": "[parameters('adminUser')]",
              "administratorLoginPassword": "[parameters('adminPassword')]",
              "operationMode": "Import"
            }
          }
        ]
        ```

        The following example shows the updated template:

        :::image type="content" source="media/template-tutorial-deploy-sql-extensions-bacpac/resource-manager-tutorial-deploy-sql-extensions-bacpac.png" alt-text="Screenshot of the template with SQL Database extension.":::

        To understand the resource definition, see the API version's [SQL Database extension reference](/azure/templates/microsoft.sql/servers/databases/extensions). The following are some important elements:

        - `dependsOn`: The extension resource must be created after the database has been created.
        - `storageKeyType`: Specify the type of the storage key to use. The value can be either `StorageAccessKey` or `SharedAccessKey`. Use `StorageAccessKey` in this tutorial.
        - `storageKey`: Specify the key for the storage account where the BACPAC file is stored. If the storage key type is `SharedAccessKey`, it must be preceded with a "?".
        - `storageUri`: Specify the URL of the BACPAC file stored in a storage account.
        - `administratorLogin`: The SQL administrator's account name.
        - `administratorLoginPassword`: The SQL administrator's password. To use a generated password, see [Prerequisites](#prerequisites).

The following example shows the completed template:

[!code-json[](~/resourcemanager-templates/tutorial-sql-extension/azuredeploy2.json?range=1-106&highlight=38-49,62-76,86-103)]

## Deploy the template

Use the project name and location that were used when you prepared the BACPAC file. That puts all resources in the same resource group, which is helpful when you delete resources.

1. Sign in to [Cloud Shell](https://shell.azure.com).
1. Select **PowerShell** from the upper left corner.

    :::image type="content" source="media/template-tutorial-deploy-sql-extensions-bacpac/cloud-shell-select.png" alt-text="Screenshot of Azure Cloud Shell in PowerShell with the option to upload a file.":::

1. Select **Upload/Download files** and upload your _azuredeploy.json_ file.
1. To deploy the template, copy and paste the following script into the shell window.

    ```azurepowershell
    $projectName = Read-Host -Prompt "Enter the same project name that is used earlier"
    $adminUsername = Read-Host -Prompt "Enter the SQL admin username"
    $adminPassword = Read-Host -Prompt "Enter the admin password" -AsSecureString
    $storageAccountKey = Read-Host -Prompt "Enter the storage account key"
    $bacpacUrl = Read-Host -Prompt "Enter the URL of the BACPAC file"
    $resourceGroupName = "${projectName}rg"

    New-AzResourceGroupDeployment `
        -ResourceGroupName $resourceGroupName `
        -adminUser $adminUsername `
        -adminPassword $adminPassword `
        -TemplateFile "$HOME/azuredeploy.json" `
        -storageAccountKey $storageAccountKey `
        -bacpacUrl $bacpacUrl

    Write-Host "Press [ENTER] to continue ..."
    ```

## Verify the deployment

To access the server from your client computer, you need to add a firewall rule. Your client's IP address and the IP address that's used to connect to the server might be different because of network address translation (NAT). For more information, see [Create and manage IP firewall rules](/azure/azure-sql/database/firewall-configure#create-and-manage-ip-firewall-rules).

For example, when you sign in to **Query editor** a message is displayed that the IP address isn't allowed. The address is different from your client's IP address because of NAT. Select the message's link to add a firewall rule for the IP address. When you're finished, you can delete the IP address from the server's **Firewalls and virtual networks** settings.

In the Azure portal, from the resource group select the database. Select **Query editor (preview)**, and enter the administrator credentials. You'll see two tables were imported into the database.

:::image type="content" source="./media/template-tutorial-deploy-sql-extensions-bacpac/resource-manager-tutorial-deploy-sql-extensions-bacpac-query-editor.png" alt-text="Screenshot of the Query editor (preview) in Azure portal.":::

## Clean up resources

When the Azure resources you deployed are no longer needed, delete the resource group. The resource group, storage account, SQL server, and SQL databases are deleted.

1. In the Azure portal, enter **Resource groups** in the search box.
1. In the **Filter by name** field, enter the resource group name.
1. Select the resource group name.
1. Select **Delete resource group**.
1. To confirm the deletion, enter the resource group name and select **Delete**.

## Next steps

In this tutorial, you deployed a server and a database and imported a BACPAC file. To learn how to troubleshoot template deployment, see:

> [!div class="nextstepaction"]
> [Troubleshoot ARM template deployments](../troubleshooting/quickstart-troubleshoot-arm-deployment.md)
