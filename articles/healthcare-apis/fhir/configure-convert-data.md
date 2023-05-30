---
title: Configure convert-data using the Azure portal - Azure Health Data Services
description: Learn how to configure convert-data using the Azure portal.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 05/30/2022
ms.author: jasteppe
---

# Configure convert-data

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

In this article, you learn how to configure convert-data to convert your existing data to FHIR R4 data using the Azure portal.

## Customize templates

You can use the [FHIR Converter Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) to customize templates according to your specific requirements. The extension provides an interactive editing experience and makes it easy to download Microsoft-published templates and sample data.

> [!NOTE]
> FHIR Converter extension for Visual Studio Code is available for HL7v2, C-CDA and JSON Liquid templates. FHIR STU3 to FHIR R4 Liquid templates are currently not supported. 

## Host your own templates

We recommend that you host your own copy of templates in an Azure Container Registry instance. Hosting your own templates and using them for `$convert-data` operations involves the following six steps:

1. [Create an Azure Container Registry instance](#step-1-create-an-azure-container-registry-instance)
2. [Push the templates to your Azure Container Registry instance](#step-2-push-the-templates-to-your-azure-container-registry-instance)
3. [Enable Azure Managed Identity in your FHIR service instance](#step-3-enable-azure-managed-identity-in-your-fhir-service-instance)
4. [Provide Azure Container Registry access to the FHIR service managed identity](#step-4-provide-azure-container-registry-access-to-the-fhir-service-managed-identity)
5. [Register the Azure Container Registry server in the FHIR service](#step-5-register-the-azure-container-registry-server-in-the-fhir-service)
6. [Configure the Azure Container Registry firewall for secure access](#step-6-configure-the-azure-container-registry-firewall-for-secure-access)

### Step 1: Create an Azure Container Registry instance

Read the [Introduction to container registries in Azure](../../container-registry/container-registry-intro.md) and follow the instructions for creating your own Azure Container Registry instance. We recommend that you place your Azure Container Registry instance in the same resource group as your FHIR service.

### Step 2: Push the templates to your Azure Container Registry instance

After you create an Azure Container Registry instance, you can use the **FHIR Converter: Push Templates** command in the [FHIR Converter extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-health-fhir-converter) to push your custom templates to your Azure Container Registry instance. Alternatively, you can use the [Template Management CLI tool](https://github.com/microsoft/FHIR-Converter/blob/main/docs/TemplateManagementCLI.md) for this purpose.

### Step 3: Enable Azure Managed Identity in your FHIR service instance

1. Go to your instance of the FHIR service in the Azure portal, and then select the **Identity** option.

2. Change the status to **On** to enable Managed Identity in the FHIR service.

   ![Screenshot of the FHIR pane for enabling the Managed Identity feature.](media/convert-data/fhir-mi-enabled.png#lightbox)

### Step 4: Provide Azure Container Registry access to the FHIR service managed identity

1. In your resource group, go to your **Container Registry** instance, and then select the **Access control (IAM)** tab.

2. Select **Add** > **Add role assignment**. If the **Add role assignment** option is unavailable, ask your Azure administrator to grant you the permissions for performing this task.

   ![Screenshot of the "Access control" pane and the "Add role assignment" menu.](../../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

   :::image type="content" source="../../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot of the 'Access control' pane and the 'Add role assignment' menu.":::

3. On the **Role** pane, select the [AcrPull](../../role-based-access-control/built-in-roles.md#acrpull) role.

   [![Screenshot showing the "Add role assignment" pane.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)](../../../includes/role-based-access-control/media/add-role-assignment-page.png#lightbox)

4. On the **Members** tab, select **Managed identity**, and then select **Select members**.

5. Select your Azure subscription.

6. Select **System-assigned managed identity**, and then select the FHIR service you're working with.

7. On the **Review + assign** tab, select **Review + assign** to assign the role.

For more information about assigning roles in the Azure portal, see [Azure built-in roles](../../role-based-access-control/role-assignments-portal.md).

### Step 5: Register the Azure Container Registry server in the FHIR service

You can register the Azure Container Registry server by using the Azure portal or the Azure CLI.

To use the Azure portal:

1. In your FHIR service instance, under **Data transformation**, go to the **Artifacts** pane. A list of currently registered Azure Container Registry servers is displayed. 
3. Select **Add** and then, in the dropdown list, select your registry server. 
4. Select **Save**. 

It might take a few minutes for the registration to take effect.

**NOTES FROM WILL TO DISCUSS REGARDING THIS SECTION**

From personal experience this command seems to only work for Gen1 Azure API for FHIR and I do not think it works for Gen2 FHIR Service so we should probably remove this CLI section. This CLI command seems to always be trying to add the login-servers to a resource /services (Gen1). I don't think there is a Gen2 equivalent... maybe another developer on the team with more experience with $convert can confirm... I couldn't find anything. Feel free to test out the command as well.


Here's the CLI docs which show that az healthcareapis acr add are for Azure API for FHIR: https://learn.microsoft.com/cli/azure/healthcareapis/acr?view=azure-cli-latest.

I think the closest thing for fhir service (Gen2) would be to run a fhir service create command and pass in the login servers: https://learn.microsoft.com/cli/azure/healthcareapis/workspace/fhir-service?view=azure-cli-latest#az-healthcareapis-workspace-fhir-service-create

To use the Azure CLI:

You can register up to 20 Azure Container Registry servers in the FHIR service.

1. Install the Azure Health Data Services CLI, if needed, by running the following command:

    ```azurecli
    az extension add -n healthcareapis
    ```

2. Register the Azure Container Registry servers to the FHIR service by doing either of the following steps:

   * To register a single Azure Container Registry server, run:

      ```azurecli
      az healthcareapis acr add --login-servers "fhiracr2021.azurecr.io" --resource-group fhir-test --resource-name fhirtest2021
      ```

   * To register multiple Azure Container Registry servers, run:

     ```azurecli
     az healthcareapis acr add --login-servers "fhiracr2021.azurecr.io fhiracr2020.azurecr.io" --resource-group fhir-test --resource-name fhirtest2021
     ```

### Step 6: Configure the Azure Container Registry firewall for secure access

1. In the Azure portal, on the left pane, select **Networking** for the Azure Container Registry instance.

   ![Screenshot of the "Networking" pane for configuring an Azure Container Registry firewall.](media/convert-data/networking-container-registry.png#lightbox)

2. On the **Public access** tab, select **Selected networks**. 

3. In the **Firewall** section, specify the IP address in the **Address range** box. 

Add IP ranges to allow access from the internet or your on-premises networks. 

The following table lists the IP addresses for the Azure regions where the FHIR service is available:

| Azure region         | Public IP address |
|:---------------------|:------------------|
| Australia East       | 20.53.47.210      |
| Brazil South         | 191.238.72.227    |
| Canada Central       | 20.48.197.161     |
| Central India        | 20.192.47.66      |
| East US              | 20.62.134.242, 20.62.134.244, 20.62.134.245 |
| East US 2            | 20.62.60.115, 20.62.60.116, 20.62.60.117 |
| France Central       | 51.138.211.19     |
| Germany North        | 51.116.60.240     |
| Germany West Central | 20.52.88.224      |
| Japan East           | 20.191.167.146    |
| Japan West           | 20.189.228.225    |
| Korea Central        | 20.194.75.193     |
| North Central US     | 52.162.111.130, 20.51.0.209 |
| North Europe         | 52.146.137.179    |
| Qatar Central        | 20.21.36.225      |
| South Africa North   | 102.133.220.199   |
| South Central US     | 20.65.134.83      |
| Southeast Asia       | 20.195.67.208     |
| Sweden Central       | 51.12.28.100      |
| Switzerland North    | 51.107.247.97     |
| UK South             | 51.143.213.211    |
| UK West              | 51.140.210.86     |
| West Central US      | 13.71.199.119     |
| West Europe          | 20.61.103.243, 20.61.103.244 |
| West US 2            | 20.51.13.80, 20.51.13.84, 20.51.13.85 |
| West US 3            | 20.150.245.165 |

> [!NOTE]
> The preceding steps are similar to the configuration steps in [Configure export settings and set up a storage account](./configure-export-data.md).

For private network access (that is, a private link), you can also disable the public network access to your Azure Container Registry instance. To do so:

1. In the Azure portal container registry, select **Networking**.
2. Select the **Public access** tab, select **Disabled**, and then select **Allow trusted Microsoft services to access this container registry**.

![Screenshot of the "Networking" pane for disabling public network access to an Azure Container Registry instance.](media/convert-data/configure-private-network-container-registry.png#lightbox)

### Verify the `$convert-data` operation

Make a call to the `$convert-data` API by specifying your template reference in the `templateCollectionReference` parameter:

`<RegistryServer>/<imageName>@<imageDigest>`

You should receive a `Bundle` response that contains the health data converted into the FHIR format.

## Next steps

In this article, you've learned about the `$convert-data` endpoint for converting health data to FHIR by using the FHIR service in Azure Health Data Services. For information about how to export FHIR data from the FHIR service, see:
 
>[!div class="nextstepaction"]
>[Export data](export-data.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
