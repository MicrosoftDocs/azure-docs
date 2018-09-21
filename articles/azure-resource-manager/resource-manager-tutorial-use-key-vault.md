---
title: Integrate Azure Key Vault in Resource Manager template deployment | Microsoft Docs
description: Learn how to use Azure Key Vault to pass secure parameter values during resource manager template deployment
services: azure-resource-manager
documentationcenter: ''
author: mumian
manager: dougeby
editor: tysonn

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 09/19/2018
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: integrate Azure Key Vault in Resource Manager Template deployment

Learn how to retrieve secure values from Azure Key Vault and pass the secret values as parameters during Resource Manager deployment. The value is never exposed because you only reference its Key Vault ID. For more information, see:

- [Use Azure Key Vault to pass secure parameter value during deployment](./resource-manager-keyvault-parameter.md)
- [Access Key Vault secret when deploying Azure Managed Applications](../managed-applications/key-vault-access.md)

In this tutorial, you create a virtual machine and some dependent resources. When creating a virtual machine, you need to provide the administrator username and password. The password is retrieved from Azure Key Vault. 

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Open a quickstart template
> * Explore the template
> * Deploy the template

***jgao: update the task list

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this article, you need:

* [Visual Studio Code](https://code.visualstudio.com/).
* Resource Manager Tools extension.  See [Install the extension
](./resource-manager-quickstart-create-templates-use-visual-studio-code.md#prerequisites)

## Prepare the Key Vault

There are two important conditions that must exist for accessing a Key Vault during template deployment:

* The enabledForTemplateDeployment property of the Key Vault must be true.
* The user deploying the template must have access to the secret. The user must have the Microsoft.KeyVault/vaults/deploy/action permission for the Key Vault. The Owner and Contributor roles both grant this access.

***jgao: talk about how to get the Ad User Id

1. Sign in to the [Azure Cloud Shell](https://shell.azure.com).
2. Switch to your favorite environment, either **PowerShell** or **Bash** from the upper left corner.
3. Run the following Azure PowerShell or Azure CLI command.  Select the tab selector to switch.

    # [CLI](#tab/CLI)
    ```cli
    az ad user show --upn-or-object-id "<YourEmailAddressAssociatedWithYourSubscription>" --query "objectId"
    ```
   
    # [PowerShell](#tab/PowerShell)
    
    ```powershell
    (Get-AzureADUser -ObjectId "<YourEmailAddressAssociatedWithYourSubscription>").ObjectId
    ```
    
    ---

    The output is a GUID number.  It is your Azure AD user object ID. 




1. Select the following image to sign in to Azure and open a template. The template creates a Key Vault and a Key Vault secret.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Farmtutorials.blob.core.windows.net%2Fcreatekeyvault%2FCreateKeyVault.json"><img source="./media/resource-manager-tutorial-use-key-vault/deploy-to-azure.png"></a>

2. Select or enter the following values.  Don't select **Purchase** after you enter the values.

    ![resource manager template Key Vault integration deploy portal](./media/resource-manager-tutorial-use-key-vault/resource-manager-tutorial-create-key-vault-portal.md)

    - Subscription: select an Azure subscription.
    - Resource group: assign a unique name. Write down this name, you use the same resource group to deploy the virtual machine in the next session. Placing both the Key Vault and the virtual machine in the same resource group makes it easier to clean up the resource at the end of the tutorial.
    - Location: select an location.  The default location is **Central US**.
    - Key Vault Name: assign a unique name. 
    - Ad User Id: enter your Azure AD user object ID.
    - Secret Name: The default name is **mAdminPassword**. If you change the secret name here, you need to update the secret name when you deploy the virtual machine.
    - Secret Value: Enter your secret.  The secret is the password used to login to the virtual machine.
    - **I agree to the terms and conditions state above**: Select.
3. Select **Edit parameters** from the top to take a look of the template.
4. Browse to line 37 of the template JSON file:

    ```json
    "enabledForTemplateDeployment": true,
    ```
    `enabledForTemplateDeployment` is a Key Vault property. This property must be true before you can retrieve the secrets from this Key Vault during deployment. To enable the property from the Azure portal, see [Enable template deployment](./managed-applications/key-vault-access#enable-template-deployment.md).
5. Select **Discard** from the bottom of the page. You didn't make any changes.
6. Verify you have provided all the values as shown in the previous screenshot, and then click **Purcahse** at the bottom of the page.
7. Select the bell icon (notification) from the top of the page to open the **Notifications** pane. Wait until the resource is deployed successfully.
8. Select **Go to resource group** from the **Notifications** pane. 
9. Select the Key Vault name to open it.
10. Select **Access policies** from the left pane. You name shall be listed, otherwise you don't have the permission to access the key vault.

    ![resource manager template Key Vault integration access policies](./media/resource-manager-tutorial-use-key-vault/resource-manager-tutorial-key-vault-access-policies.md)    
11. Select **Click to show advanced access policies**. Notice **Enable access to Azure Resource Manager for template deployment** is selected. This is another condition to make the Key Vault integration to work.



Tasks:

1. Create a Key Vault
1. Add a secret to the Key Vault
1. Eanble template deployment

1. Open the [Azure portal](https://portal.azure.com).
2. 
## Open a Quickstart template

Azure QuickStart Templates is a repository for Resource Manager templates. Instead of creating a template from scratch, you can find a sample template and customize it. The template used in this tutorial is called [Deploy a simple Windows VM](https://azure.microsoft.com/resources/templates/101-vm-simple-windows/).

1. From Visual Studio Code, select **File**>**Open File**.
2. In **File name**, paste the following URL:

    ```url
    https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-windows/azuredeploy.json
    ```
3. Select **Open** to open the file.
4. Select **File**>**Save As** to save a copy of the file to your local computer with the name **azuredeploy.json**.

## Explore the template

When you explore the template in this section, try to answer these questions:

- How many Azure resources defined in this template?
- One of the resources is an Azure storage account.  Does the definition look like the one used in the last tutorial?
- Can you find the template references for the resources defined in this template?
- Can you find the dependencies of the resources?

1. From Visual Studio Code, collapse the elements until you only see the first-level elements and the second-level elements inside **resources**:

    ![Visual Studio Code Azure Resource Manager templates](./media/resource-manager-tutorial-create-templates-with-dependent-resources/resource-manager-template-visual-studio-code.png)

    There are five resources defined by the template.
2. Expand the first resource. It is a storage account. The definition shall be identical to the one used at the begining of the last tutorial.

    ![Visual Studio Code Azure Resource Manager templates storage account definition](./media/resource-manager-tutorial-create-templates-with-dependent-resources/resource-manager-template-storage-account-definition.png)

3. Expand the second resource. The resource type is **Microsoft.Network/publicIPAddresses**. To find the template reference, browse to [template reference](https://docs.microsoft.com/azure/templates/), enter **public ip address** or **public ip addresses** in the **Filter by title** field. Compare the resource definition to the template reference.

    ![Visual Studio Code Azure Resource Manager templates public IP address definition](./media/resource-manager-tutorial-create-templates-with-dependent-resources/resource-manager-template-public-ip-address-definition.png)
4. Repeat the last step to find the template references for the other resources defined in this template.  Compare the resource definitions to the references.
5. Expand the fourth resource:

    ![Visual Studio Code Azure Resource Manager templates dependson](./media/resource-manager-tutorial-create-templates-with-dependent-resources/resource-manager-template-visual-studio-code-dependson.png)

    The dependsOn element enables you to define one resource as a dependent on one or more resources. In this example, this resource is a networkInterface.  It depends on two other resources:

    * publicIPAddress
    * virtualNetwork

6. Expand the fifth resource. This resource is a virtual machine. It depends on two other resources:

    * storageAccount
    * networkInterface

The following diagram illustrates the resources and the dependency information for this template:

![Visual Studio Code Azure Resource Manager templates dependency diagram](./media/resource-manager-tutorial-create-templates-with-dependent-resources/resource-manager-template-visual-studio-code-dependency-diagram.png)

By specifying the dependencies, Resource Manager efficiently deploys the solution. It deploys the storage account, public IP address, and virtual network in parallel because they have no dependencies. After the public IP address and virtual network are deployed, the network interface is created. When all other resources are deployed, Resource Manager deploys the virtual machine.

## Deploy the template

There are many methods for deploying templates.  In this tutorial, you use Cloud Shell from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com)
2. Select **Cloud Shell** from the upper right corner as shown in the following image:

    ![Azure portal Cloud shell](./media/resource-manager-tutorial-create-templates-with-dependent-resources/azure-portal-cloud-shell.png)
3. Select **PowerShell** from the upper left corner of the Cloud shell.  You use PowerShell in this tutorial.
4. Select **Restart**
5. Select **Upload file** from the Cloud shell:

    ![Azure portal Cloud shell upload file](./media/resource-manager-tutorial-create-templates-with-dependent-resources/azure-portal-cloud-shell-upload-file.png)
6. Select the file you saved earlier in the tutorial. The default name is **azuredeploy.json**.  If you have a file with the same file name, the old file will be overwritten without any notification.
7. From the Cloud shell, run the following command to verify the file is uploaded successfully. 

    ```shell
    ls
    ```

    ![Azure portal Cloud shell list file](./media/resource-manager-tutorial-create-templates-with-dependent-resources/azure-portal-cloud-shell-list-file.png)

    The file name shown on the screenshot is azuredeploy.json.

8. From the Cloud shell run the following command to verify the content of the JSON file:

    ```shell
    cat azuredeploy.json
    ```
9. From the Cloud shell, run the following PowerShell commands:

    ```powershell
    $resourceGroupName = "<Enter the resource group name>"
    $location = "<Enter the Azure location>"
    $vmAdmin = "<Enter the admin username>"
    $vmPassword = "<Enter the password>"
    $dnsLabelPrefix = "<Enter the prefix>"

    New-AzureRmResourceGroup -Name $resourceGroupName -Location $location
    $vmPW = ConvertTo-SecureString -String $vmPassword -AsPlainText -Force
    New-AzureRmResourceGroupDeployment -Name mydeployment0710 -ResourceGroupName $resourceGroupName `
	    -TemplateFile azuredeploy.json -adminUsername $vmAdmin -adminPassword $vmPW `
	    -dnsLabelPrefix $dnsLabelPrefix
    ```
    Here is the screenshot for a sample deployment:

    ![Azure portal Cloud shell deploy template](./media/resource-manager-tutorial-create-templates-with-dependent-resources/azure-portal-cloud-shell-deploy-template.png)

    On the screenshot, these values are used:

    * **$resourceGroupName**: myresourcegroup0710. 
    * **$location**: eastus2
    * **&lt;DeployName>**: mydeployment0710
    * **&lt;TemplateFile>**: azuredeploy.json
    * **Template parameter**s:

        * **adminUsername**: JohnDole
        * **adminPassword**: Pass@word123
        * **dnsLabelPrefix**: myvm0710

10. Run the following PowerShell command to list the newly created virtual machine:

    ```powershell
    Get-AzureRmVM -Name SimpleWinVM -ResourceGroupName <ResourceGroupName>
    ```

    The virtual machine name is hard-coded as **SimpleWinVM** inside the template.

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.  You shall see a total of six resources in the resource group.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you develop and deploy a template to create a virtual machine, a virtual network, and the dependent resources. To learn more about templates, see [Understand the structure and syntax of Azure Resource Manager Templates](./resource-group-authoring-templates.md).