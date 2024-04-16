---
title: Deploy VM extensions with template
description: Learn how to deploy virtual machine extensions with Azure Resource Manager templates (ARM templates).
ms.date: 03/20/2024
ms.topic: tutorial
ms.custom: devx-track-arm-template
---

# Tutorial: Deploy virtual machine extensions with ARM templates

Learn how to use [Azure virtual machine extensions](../../virtual-machines/extensions/features-windows.md) to perform post-deployment configuration and automation tasks on Azure VMs. Many different VM extensions are available for use with Azure VMs. In this tutorial, you deploy a Custom Script extension from an Azure Resource Manager template (ARM template) to run a PowerShell script on a Windows VM. The script installs Web Server on the VM.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Prepare a PowerShell script
> * Open a quickstart template
> * Edit the template
> * Deploy the template

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this article, you need:

* Visual Studio Code with Resource Manager Tools extension. See [Quickstart: Create ARM templates with Visual Studio Code](quickstart-create-templates-use-visual-studio-code.md).
* To increase security, use a generated password for the virtual machine administrator account. You can use [Azure Cloud Shell](../../cloud-shell/overview.md) to run the following command in PowerShell or Bash:

    ```shell
    openssl rand -base64 32
    ```

    To learn more, run `man openssl rand` to open the manual page.

    Azure Key Vault is designed to safeguard cryptographic keys and other secrets. For more information, see [Tutorial: Integrate Azure Key Vault in your ARM template deployment](./template-tutorial-use-key-vault.md). We also recommend that you update your password every three months.

## Prepare a PowerShell script

You can use an inline PowerShell script or a script file. This tutorial shows how to use a script file. A PowerShell script with the following content is shared from [GitHub](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/tutorial-vm-extension/installWebServer.ps1):

```azurepowershell
Install-WindowsFeature -Name Web-Server -IncludeManagementTools
```

If you choose to publish the file to your own location, update the `fileUri` element in the template later in the tutorial.

## Open a quickstart template

Azure Quickstart Templates is a repository for ARM templates. Instead of creating a template from scratch, you can find a sample template and customize it. The template used in this tutorial is called [Deploy a simple Windows VM](https://azure.microsoft.com/resources/templates/vm-simple-windows/).

1. In Visual Studio Code, select **File** > **Open File**.
1. In the **File name** box, paste the following URL:

    ```url
    https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.compute/vm-simple-windows/azuredeploy.json
    ```

1. To open the file, select **Open**.
    The template defines five resources:

   * [**Microsoft.Storage/storageAccounts**](/azure/templates/Microsoft.Storage/storageAccounts).
   * [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses).
   * [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups).
   * [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks).
   * [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces).
   * [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines).

     It's helpful to get some basic understanding of the template before you customize it.

1. Save a copy of the file to your local computer with the name *azuredeploy.json* by selecting **File** > **Save As**.

## Edit the template

Add a virtual machine extension resource to the existing template with the following content:

```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "apiVersion": "2021-04-01",
  "name": "[format('{0}/{1}', variables('vmName'), 'InstallWebServer')]",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[format('Microsoft.Compute/virtualMachines/{0}',variables('vmName'))]"
  ],
  "properties": {
    "publisher": "Microsoft.Compute",
    "type": "CustomScriptExtension",
    "typeHandlerVersion": "1.7",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "fileUris": [
        "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/tutorial-vm-extension/installWebServer.ps1"
      ],
      "commandToExecute": "powershell.exe -ExecutionPolicy Unrestricted -File installWebServer.ps1"
    }
  }
}
```

For more information about this resource definition, see the [extension reference](/azure/templates/microsoft.compute/virtualmachines/extensions). The following are some important elements:

* `name`: Because the extension resource is a child resource of the virtual machine object, the name must have the virtual machine name prefix. See [Set name and type for child resources](child-resource-name-type.md).
* `dependsOn`: Create the extension resource after you've created the virtual machine.
* `fileUris`: The locations where the script files are stored. If you choose not to use the provided location, you need to update the values.
* `commandToExecute`: This command invokes the script.

To use an inline script, remove `fileUris`, and update `commandToExecute` to:

```powershell
powershell.exe Install-WindowsFeature -name Web-Server -IncludeManagementTools && powershell.exe remove-item 'C:\\inetpub\\wwwroot\\iisstart.htm' && powershell.exe Add-Content -Path 'C:\\inetpub\\wwwroot\\iisstart.htm' -Value $('Hello World from ' + $env:computername)
```

This inline script also updates the _iisstart.html_ content.

You must also open the HTTP port so that you can access the web server.

1. Find `securityRules` in the template.
1. Add the following rule next to **default-allow-3389**.

    ```json
    {
      "name": "AllowHTTPInBound",
      "properties": {
        "priority": 1010,
        "access": "Allow",
        "direction": "Inbound",
        "destinationPortRange": "80",
        "protocol": "Tcp",
        "sourcePortRange": "*",
        "sourceAddressPrefix": "*",
        "destinationAddressPrefix": "*"
      }
    }
    ```

## Deploy the template

For the deployment procedure, see the **Deploy the template** section of [Tutorial: Create ARM templates with dependent resources](./template-tutorial-create-templates-with-dependent-resources.md#deploy-the-template). We recommended that you use a generated password for the virtual machine administrator account. See this article's [Prerequisites](#prerequisites) section.

From the Cloud Shell, run the following command to retrieve the public IP address of the VM:

```azurepowershell
(Get-AzPublicIpAddress -ResourceGroupName $resourceGroupName).IpAddress
```

Paste the IP address into a Web browser. The default Internet Information Services (IIS) welcome page opens:

:::image type="content" source="./media/template-tutorial-deploy-vm-extensions/resource-manager-template-deploy-extensions-customer-script-web-server.png" alt-text="Screenshot of the Internet Information Services welcome page.":::

## Clean up resources

When you no longer need the Azure resources you deployed, clean them up by deleting the resource group.

1. In the Azure portal, in the left pane, select **Resource group**.
2. In the **Filter by name** box, enter the resource group name.
3. Select the resource group name.
    Six resources are displayed in the resource group.
4. In the top menu, select **Delete resource group**.

## Next steps

In this tutorial, you deployed a virtual machine and a virtual machine extension. The extension installed the IIS web server on the virtual machine. To learn how to use the Azure SQL Database extension to import a BACPAC file, see:

> [!div class="nextstepaction"]
> [Deploy SQL extensions](./template-tutorial-deploy-sql-extensions-bacpac.md)
