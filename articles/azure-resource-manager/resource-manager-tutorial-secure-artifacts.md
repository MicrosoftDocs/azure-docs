---
title: Secure artifacts in Azure Resource Manager template deployments | Microsoft Docs
description: Learn how to secure the artifacts used in your Azure Resource Manager templates.
services: azure-resource-manager
documentationcenter: ''
author: mumian
manager: dougeby
editor: 

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 11/26/2018
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Secure artifacts in Azure Resource Manager template deployments

Learn how to secure the artifacts used in your Azure Resource Manager templates using Azure Storage account with shared access signatures (SAS). The template used in the tutorial is the same as the one developed in [Tutorial: Import SQL BACPAC files with Azure Resource Manager templates](./resource-manager-tutorial-deploy-sql-extensions-bacpac.md). The templates calls a SQL BACPAC file stored in an Azure storage account with public access. In this tutorial, you use SAS to grant limited access to the BACPAC file in your storage account. For more information about SAS, see [Using shared access signatures (SAS)](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Prepare a BACPAC file
> * Open a Quickstart template
> * Edit the template
> * Deploy the template
> * Verify the deployment

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this article, you need:

* [Visual Studio Code](https://code.visualstudio.com/) with the Resource Manager Tools extension. See [Install the extension
](./resource-manager-quickstart-create-templates-use-visual-studio-code.md#prerequisites).
* Review [](). The template used in this tutorial is the one developed in [](). It is helpful to review that tutorial, especially if you are new to the template development.
* To increase security, use a generated password for the SQL Server administrator account. Here is a sample for generating a password:

    ```azurecli-interactive
    openssl rand -base64 32
    ```
    Azure Key Vault is designed to safeguard cryptographic keys and other secrets. For more information, see [Tutorial: Integrate Azure Key Vault in Resource Manager Template deployment](./resource-manager-tutorial-use-key-vault.md). We also recommend you to update your password every three months.

## Prepare a BACPAC file

There are three procedures in this section:

* Create a storage account
* Upload the BACPAC file
* Retrieve the SAS 

Download the BACPAC file, https://armtutorials.blob.core.windows.net/sqlextensionbacpac/SQLDatabaseExtension.bacpac, and save the file to your local computer with the same name, **SQLDatabaseExtension.bacpac**.

### Create a storage account###

1. Select the following image to open a Resource Manager template in the Azure portal.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-storage-account-create%2fazuredeploy.json" target="_blank"><img src="./media/resource-manager-tutorial-secure-artifacts/deploy-to-azure.png" alt="Deploy to Azure"></a>
2. Enter the following properties:

    * **Subscription**: Enter your Azure subscription.
    * **Resource Group**: Create a new Azure Resource Group, or select an existing Resource Group.  A Resource Group is for management purpose.  It is a container for objects.
    * **Location**: Select a region.
    * **Storage Account Type**: use the default value which is **Standard_LRS**.
    * **Location**: Use the default value.
    * **I agree to the terms and conditions started above**: (selected)
3. Select **Purchase**.
4. Select the notification icon (the bell icon) on the upper right corner of the portal to see the deployment status.
5. After the storage account is deployed sucessfully, select **Go to resource group** from the notification pane.
6. Select the storage account to open it.  You shall see only one storage account in the resource group.
7. Select the **Blobs** tile.
8. Select **+ Container**.
9. Enter the following values:

    * **Name**: enter **sqlbacpac**
    * **Public access level**: use the default value, **Private no anonymous access**.
10. Select **OK**.
11. Select **sqlbacpac** to open the newly created container.
12. Select **Upload**.
13. Enter the following values:

    * **Files**: Following the instructions to select the bacpac file you downloaded earlier. The default name is **SQLDatabaseExtension.bacpac**.
    * **Authentication type**: Select **SAS**.  *SAS* is the default value.
14. Select **Upload**.  Once the file is uploaded successfully, the file name shall be listed in the container.
15. Right-click **SQLDatabaseExtension.bacpac** from the container, and then select **Generate SAS**.
16. Enter the following values:

    * **Permission**: Use the default, **Read**.
    * **Start and expiry date/time**: use the default values.  The default value gives you eight hours to use the SAS token.
    * **Allowed IP addresses**: 
    * **Allowed protocols**: use the default value: **HTTPS**.
    * **Signing key**: use the default value: **Key 1**.
17. Select **Generate blob SAS token and URL**.
18. Make a copy of both **Blob SAS token** and **Blob SAS URL**

- sp=r&st=2018-11-27T16:49:00Z&se=2018-11-28T00:49:00Z&spr=https&sv=2017-11-09&sig=qDl04Uar9Zi9ICH2SvXNcCNthUygIQIRdFmqQvvBmto%3D&sr=b
- https://avtigyz23vqm4standardsa.blob.core.windows.net/sqlbacpac/SQLDatabaseExtension.bacpac?sp=r&st=2018-11-27T16:49:00Z&se=2018-11-28T00:49:00Z&spr=https&sv=2017-11-09&sig=qDl04Uar9Zi9ICH2SvXNcCNthUygIQIRdFmqQvvBmto%3D&sr=b

  https://avtigyz23vqm4standardsa.blob.core.windows.net/sqlbacpac/SQLDatabaseExtension.bacpac sp=r&amp;amp;st=2018-11-27T16:49:00Z&amp;amp;se=2018-11-28T00:49:00Z&amp;amp;spr=https&amp;amp;sv=2017-11-09&amp;amp;sig=qDl04Uar9Zi9ICH2SvXNcCNthUygIQIRdFmqQvvBmto%3D&amp;amp;sr=b
## Open a Quickstart template

Azure QuickStart Templates is a repository for Resource Manager templates. Instead of creating a template from scratch, you can find a sample template and customize it. The template used in this tutorial is called [Deploy an Azure SQL Server with Threat Detection](https://azure.microsoft.com/resources/templates/201-sql-threat-detection-server-policy-optional-db/).

1. From Visual Studio Code, select **File**>**Open File**.
2. In **File name**, paste the following URL:

    ```url
    https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-sql-threat-detection-server-policy-optional-db/azuredeploy.json
    ```
3. Select **Open** to open the file.

    There are three resources defined in the template:

    * `Microsoft.Sql/servers`. See the [template reference](https://docs.microsoft.com/azure/templates/microsoft.sql/servers).
    * `Microsoft.SQL/servers/securityAlertPolicies`. See the [template reference](https://docs.microsoft.com/azure/templates/microsoft.sql/servers/securityalertpolicies).
    * `Microsoft.SQL.servers/databases`.  See the [template reference](https://docs.microsoft.com/azure/templates/microsoft.sql/servers/databases).
    It is helpful to get some basic understanding of the template before customizing it.
4. Select **File**>**Save As** to save a copy of the file to your local computer with the name **azuredeploy.json**.

## Edit the template

You need to add two additional resources to the template.

* To allow the SQL database extension to import BACPAC files, you need to allow access to Azure services. Add the following JSON to the SQL server definition:

    ```json
    {
        "type": "firewallrules",
        "name": "AllowAllAzureIps",
        "location": "[parameters('location')]",
        "apiVersion": "2014-04-01",
        "dependsOn": [
            "[variables('databaseServerName')]"
        ],
        "properties": {
            "startIpAddress": "0.0.0.0",
            "endIpAddress": "0.0.0.0"
        }
    }
    ```

    The template shall look like:

    ![Azure Resource Manager deploy sql extensions BACPAC](./media/resource-manager-tutorial-deploy-sql-extensions-bacpac/resource-manager-tutorial-deploy-sql-extensions-bacpac-firewall.png)

* Add a SQL Database extension resource to the database definition with the following JSON:

    ```json
    "resources": [
        {
            "name": "Import",
            "type": "extensions",
            "apiVersion": "2014-04-01",
            "dependsOn": [
                "[resourceId('Microsoft.Sql/servers/databases', variables('databaseServerName'), variables('databaseName'))]"
            ],
            "properties": {
                "storageKeyType": "SharedAccessKey",
                "storageKey": "?",
                "storageUri": "https://armtutorials.blob.core.windows.net/sqlextensionbacpac/SQLDatabaseExtension.bacpac",
                "administratorLogin": "[variables('databaseServerAdminLogin')]",
                "administratorLoginPassword": "[variables('databaseServerAdminLoginPassword')]",
                "operationMode": "Import",
            }
        }
    ]
    ```

    The template shall look like:

    ![Azure Resource Manager deploy sql extensions BACPAC](./media/resource-manager-tutorial-deploy-sql-extensions-bacpac/resource-manager-tutorial-deploy-sql-extensions-bacpac.png)

    To understand the resource definition, see the [SQL Database extension reference](https://docs.microsoft.com/azure/templates/microsoft.sql/servers/databases/extensions). The following are some important elements:

    * **dependsOn**: The extension resource must be created after the SQL database has been created.
    * **storageKeyType**: The type of the storage key to use. The value can be either `StorageAccessKey` or `SharedAccessKey`. Because the provided BACPAC file is shared on an Azure Storage account with public access, `SharedAccessKey' is used here.
    * **storageKey**: The storage key to use. If storage key type is SharedAccessKey, it must be preceded with a "?."
    * **storageUri**: The storage uri to use. If you choose not to use the BACPAC file provided, you need to update the values.
    * **administratorLoginPassword**: The password of the SQL administrator. It is recommended to use a generated password. See [Prerequisites](#prerequisites).

## Deploy the template

Refer to the [Deploy the template](./resource-manager-tutorial-create-multiple-instances.md#deploy-the-template) section for the deployment procedure. Use the following PowerShell deployment script instead:

```azurepowershell
$deploymentName = Read-Host -Prompt "Enter the name for this deployment"
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$adminUsername = Read-Host -Prompt "Enter the virtual machine admin username"
$adminPassword = Read-Host -Prompt "Enter the admin password" -AsSecureString

New-AzureRmResourceGroup -Name $resourceGroupName -Location $location
New-AzureRmResourceGroupDeployment -Name $deploymentName `
    -ResourceGroupName $resourceGroupName `
    -adminUser $adminUsername `
    -adminPassword $adminPassword `
    -TemplateFile azuredeploy.json
```

It is recommended to use a generated password. See [Prerequisites](#prerequisites).

## Verify the deployment

In the portal, select the SQL database from the newly deployed resource group. Select **Query editor (preview)**, and then enter the administrator credentials. You shall see two tables imported into the database:

![Azure Resource Manager deploy sql extensions BACPAC](./media/resource-manager-tutorial-deploy-sql-extensions-bacpac/resource-manager-tutorial-deploy-sql-extensions-bacpac-query-editor.png)

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.  You shall see a total of six resources in the resource group.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you deployed a SQL Server, a SQL Database, and imported a BACPAC file. To learn how to deploy Azure resources across multiple regions, and how to use safe deployment practices, see

> [!div class="nextstepaction"]
> [Use Azure Deployment Manager](./resource-manager-tutorial-deploy-vm-extensions.md)
