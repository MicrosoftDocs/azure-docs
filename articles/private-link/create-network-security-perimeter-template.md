---
title: Quickstart - Create a network security perimeter - ARM Template
description: Learn how to create a network security perimeter for an Azure resource using the Azure Resource Manager template. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: quickstart
ms.date: 11/04/2024
ms.custom: subject-armqs, mode-arm, template-quickstart, devx-track-arm-template
#CustomerIntent: As a network administrator, I want to create a network security perimeter for an Azure resource in the Azure Resource Manager template, so that I can control the network traffic to and from the resource.
---

# # Quickstart - Create a network security perimeter - ARM Template

Get started with network security perimeter by creating a network security perimeter for an Azure key vault using Azure Resource Manager (ARM) template. A [network security perimeter](network-security-perimeter-concepts.md) allows [Azure Platform as a Service (PaaS)](./network-security-perimeter-concepts.md#onboarded-private-link-resources) resources to communicate within an explicit trusted boundary. You create and update a PaaS resource's association in a network security perimeter profile. Then you create and update network security perimeter access rules. When you're finished, you delete all resources created in this quicks.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

You can also create a network security perimeter by using the [Azure portal](create-network-security-perimeter-portal.md), [Azure PowerShell](create-network-security-perimeter-powershell.md), or the [Azure CLI](create-network-security-perimeter-cli.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button here. The ARM template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fnetwork-security-perimeter-create%2Fazuredeploy.json":::

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [network-security-perimeter-add-preview](../../includes/network-security-perimeter-add-preview.md)]

## Review the template

This template creates a private endpoint for an instance of Azure SQL Database.

The template that this quickstart uses is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/network-security-perimeter-create/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/network-security-perimeter-create/azuredeploy.json":::

The template defines multiple Azure resources:

- [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): The instance of Key Vault with the sample database.
- [**Microsoft.Network/networkSecurityPerimeters**](/azure/templates/microsoft.network/networksecurityperimeters): The network security perimeter that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/profiles**](/azure/templates/microsoft.network/networksecurityperimeters/profiles): The network security perimeter profile that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/profiles/accessRules**](/azure/templates/microsoft.network/networksecurityperimeters/profiles/accessrules): The access rules that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/resourceAssociations**](/azure/templates/microsoft.network/networksecurityperimeters/resourceassociations): The resource associations that you use to access the instance of Key Vault.

## Deploy the template

Deploy the ARM template to Azure by doing the following:

1. Sign in to Azure and open the ARM template by selecting the **Deploy to Azure** button here. The template creates the network security perimeter and an Azure Key Vault instance.



1. Select your resource group or create a new one.
1. Enter the SQL administrator sign-in name and password.
1. Enter the virtual machine administrator username and password.
1. Read the terms and conditions statement. If you agree, select **I agree to the terms and conditions stated above**, and then select **Purchase**. The deployment can take 20 minutes or longer to complete.

## Validate the deployment

> [!NOTE]
> The ARM template generates a unique name for the virtual machine myVm<b>{uniqueid}</b> resource, and for the SQL Database sqlserver<b>{uniqueid}</b> resource. Substitute your generated value for **{uniqueid}**.

### Connect to a VM from the internet

Connect to the VM _myVm{uniqueid}_ from the internet by doing the following:

1. In the portal's search bar, enter _myVm{uniqueid}_.

1. Select **Connect**. **Connect to virtual machine** opens.

1. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (RDP) file and downloads it to your computer.

1. Open the downloaded RDP file.

   a. If you're prompted, select **Connect**.  
   b. Enter the username and password that you specified when you created the VM.

      > [!NOTE]
      > You might need to select **More choices** > **Use a different account** to specify the credentials you entered when you created the VM.

1. Select **OK**.

   You might receive a certificate warning during the sign-in process. If you do, select **Yes** or **Continue**.

1. After the VM desktop appears, minimize it to go back to your local desktop.

### Access the SQL Database server privately from the VM

To connect to the SQL Database server from the VM by using the private endpoint, do the following:

1.  On the Remote Desktop of _myVM{uniqueid}_, open PowerShell.
1.  Run the following command: 

    `nslookup sqlserver{uniqueid}.database.windows.net` 

    You'll receive a message that's similar to this one:

    ```
      Server:  UnKnown
      Address:  168.63.129.16
      Non-authoritative answer:
      Name:    sqlserver.privatelink.database.windows.net
      Address:  10.0.0.5
      Aliases:  sqlserver.database.windows.net
    ```

1.  Install SQL Server Management Studio.

1.  On the **Connect to server** pane, do the following:
    - For **Server type**, select **Database Engine**.
    - For **Server name**, select **sqlserver{uniqueid}.database.windows.net**.
    - For **Username**, enter the username that was provided earlier.
    - For **Password**, enter the password that was provided earlier.
    - For **Remember password**, select **Yes**.

1. Select **Connect**.
1. On the left pane, select **Databases**. Optionally, you can create or query information from _sample-db_.
1. Close the Remote Desktop connection to _myVm{uniqueid}_.

## Clean up resources

When you no longer need the resources that you created with the private endpoint, delete the resource group. Doing so removes the private endpoint and all the related resources.

To delete the resource group, run the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> [What is Azure Private Link?](private-link-overview.md#availability)
