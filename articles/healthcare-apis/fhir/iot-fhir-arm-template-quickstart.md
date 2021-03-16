---
title: 'Quickstart: Deploy Azure IoT Connector for FHIR (preview) using an ARM template'
description: In this quickstart, learn how to deploy Azure IoT Connector for FHIR (preview) using an Azure Resource Manager template (ARM template).
author: rbhaiya
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: quickstart
ms.author: rabhaiya
ms.date: 01/21/2021
---

# Quickstart: Use an Azure Resource Manager (ARM) template to deploy Azure IoT Connector for FHIR (preview)

In this quickstart, you'll learn how to use an Azure Resource Manager template (ARM template) to deploy Azure IoT Connector for Fast Healthcare Interoperability Resources (FHIR&#174;)*, a feature of Azure API for FHIR. To deploy a working instance of Azure IoT Connector for FHIR, this template also deploys a parent Azure API for FHIR service and an Azure IoT Central application that  exports telemetry from a device simulator to Azure IoT Connector for FHIR. You can execute ARM template to deploy Azure IoT Connector for FHIR through the Azure portal, PowerShell, or CLI.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal once you sign in.

[:::image type="content" source="../../media/template-deployments/deploy-to-azure.svg" alt-text="Deploy to Azure an Azure IoT Connector for FHIR using an ARM template in the Azure portal.":::](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2Fiomt-fhir%2Fmaster%2Fdeploy%2Ftemplates%2Fmanaged%2Fazuredeploy.json)

## Prerequisites

# [Portal](#tab/azure-portal)

An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).

# [PowerShell](#tab/PowerShell)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally, [Azure PowerShell](/powershell/azure/install-az-ps).

# [CLI](#tab/CLI)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally:
    * A Bash shell (such as Git Bash, which is included in [Git for Windows](https://gitforwindows.org)).
    * [Azure CLI](/cli/azure/install-azure-cli).

---

## Review the template

The [template](https://raw.githubusercontent.com/microsoft/iomt-fhir/master/deploy/templates/managed/azuredeploy.json) defines following Azure resources:

* **Microsoft.HealthcareApis/services**
* **Microsoft.HealthcareApis/services/iomtconnectors**
* **Microsoft.IoTCentral/IoTApps**

## Deploy the template

# [Portal](#tab/azure-portal)

Select the following link to deploy the Azure IoT Connector for FHIR using the ARM template in the Azure portal:

[:::image type="content" source="../../media/template-deployments/deploy-to-azure.svg" alt-text="Deploy to Azure an Azure IoT Connector for FHIR service using the ARM template in the Azure portal.":::](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2Fiomt-fhir%2Fmaster%2Fdeploy%2Ftemplates%2Fmanaged%2Fazuredeploy.json)

On the **Deploy Azure API for FHIR** page:

1. If you want, change the **Subscription** from the default to a different subscription.

2. For **Resource group**, select **Create new**, enter a name for the new resource group, and select **OK**.

3. If you created a new resource group, select a **Region** for the resource group.

4. Enter a name for your new Azure API for FHIR instance in **FHIR Service Name**.

5. Choose the **Location** for your Azure API for FHIR. The location can be the same as or different from the region of the resource group.

6. Provide a name for your Azure IoT Connector for FHIR instance in **Iot Connector Name**.

7. Provide a name for a connection created within Azure IoT Connector for FHIR in **Connection Name**. This connection is used by Azure IoT Central application to push simulated device telemetry into Azure IoT Connector for FHIR.

8. Enter a name for your new Azure IoT Central application in **Iot Central Name**. This application will use *Continuous patient monitoring* template to simulate a device.

9. Choose the location of your IoT Central application from **IoT Central Location** drop-down. 

10. Select **Review + create**.

11. Read the terms and conditions, and then select **Create**.

# [PowerShell](#tab/PowerShell)

> [!NOTE]
> If you want to run the PowerShell scripts locally, first enter `Connect-AzAccount` to set up your Azure credentials.

If the `Microsoft.HealthcareApis` resource provider isn't already registered for your subscription, you can register it with the following interactive code. To run the code in Azure Cloud Shell, select **Try it** at the upper corner of any code block.

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.HealthcareApis
```

If the `Microsoft.IoTCentral` resource provider isn't already registered for your subscription, you can register it with the following interactive code. To run the code in Azure Cloud Shell, select **Try it** at the upper corner of any code block.

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.IoTCentral
```

Use the following code to deploy the Azure IoT Connector for FHIR service using the ARM template.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter a name for the new resource group to contain the service"
$resourceGroupRegion = Read-Host -Prompt "Enter an Azure region (for example, centralus) for the resource group"
$fhirServiceName = Read-Host -Prompt "Enter a name for the new Azure API for FHIR service"
$location = Read-Host -Prompt "Enter an Azure region (for example, westus2) for the service"
$iotConnectorName = Read-Host -Prompt "Enter a name for the new Azure IoT Connector for FHIR"
$connectionName = Read-Host -Prompt "Enter a name for the connection with Azure IoT Connector for FHIR"
$iotCentralName = Read-Host -Prompt "Enter a name for the new Azure IoT Central Application"
$iotCentralLocation = Read-Host -Prompt "Enter a location for the new Azure IoT Central Application"

Write-Verbose "New-AzResourceGroup -Name $resourceGroupName -Location $resourceGroupRegion" -Verbose
New-AzResourceGroup -Name $resourceGroupName -Location $resourceGroupRegion
Write-Verbose "Run New-AzResourceGroupDeployment to create an Azure IoT Connector for FHIR service using an ARM template" -Verbose
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
    -TemplateUri https://raw.githubusercontent.com/microsoft/iomt-fhir/master/deploy/templates/managed/azuredeploy.json `
    -fhirServiceName $fhirServiceName `
    -location $location
    -iotConnectorName $iotConnectorName
    -connectionName $connectionName
    -iotCentralName $iotCentralName
    -iotCentralLocation $iotCentralLocation
Read-Host "Press [ENTER] to continue"
```

# [CLI](#tab/CLI)

If the `Microsoft.HealthcareApis` resource provider isn't already registered for your subscription, you can register it with the following interactive code. To run the code in Azure Cloud Shell, select **Try it** at the upper corner of any code block.

```azurecli-interactive
az extension add --name healthcareapis
```

If the `Microsoft.IoTCentral` resource provider isn't already registered for your subscription, you can register it with the following interactive code.

```azurecli-interactive
az extension add --name azure-iot
```

Use the following code to deploy the Azure IoT Connector for FHIR service using the ARM template.

```azurecli-interactive
read -p "Enter a name for the new resource group to contain the service: " resourceGroupName &&
read -p "Enter an Azure region (for example, centralus) for the resource group: " resourceGroupRegion &&
read -p "Enter a name for the new Azure API for FHIR service: " fhirServiceName &&
read -p "Enter an Azure region (for example, westus2) for the service: " location &&
read -p "Enter a name for the new Azure IoT Connector for FHIR: " iotConnectorName &&
read -p "Enter a name for the connection with Azure IoT Connector for FHIR: " connectionName &&
read -p "Enter a name for the new Azure IoT Central Application: " iotCentralName &&
read -p "Enter a location for the new Azure IoT Central Application: " iotCentralLocation &&

params='fhirServiceName='$fhirServiceName' location='$location' iotConnectorName='$iotConnectorName' connectionName='$connectionName' iotCentralName='$iotCentralName' iotCentralLocation='$iotCentralLocation &&
echo "CREATE RESOURCE GROUP:  az group create --name $resourceGroupName --location $resourceGroupRegion" &&
az group create --name $resourceGroupName --location $resourceGroupRegion &&
echo "RUN az deployment group create, which creates an Azure IoT Connector for FHIR service using an ARM template" &&
az deployment group create --resource-group $resourceGroupName --parameters $params --template-uri https://raw.githubusercontent.com/microsoft/iomt-fhir/master/deploy/templates/managed/azuredeploy.json &&
read -p "Press [ENTER] to continue: "
```

---

> [!NOTE]
> The deployment takes a few minutes to complete. Note the names for the Azure API for FHIR service, Azure IoT Central application, and the resource group, which you use to review the deployed resources later.

## Review deployed resources

# [Portal](#tab/azure-portal)

Follow these steps to see an overview of your new Azure API for FHIR service:

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure API for FHIR**.

2. In the FHIR list, select your new service. The **Overview** page for the new Azure API for FHIR service appears.

3. To validate that the new FHIR API account is provisioned, select the link next to **FHIR metadata endpoint** to fetch the FHIR API capability statement. The link has a format of `https://<service-name>.azurehealthcareapis.com/metadata`. If the account is provisioned, a large JSON file is displayed.

4. To validate that the new Azure IoT Connector for FHIR is provisioned, select the **IoT Connector (preview)** from left navigation menu to open the **IoT Connectors** page. The page must show the provisioned Azure IoT Connector for FHIR with *Status* value as *Online*, *Connections* value as *1*, and both *Device mapping* and *FHIR mapping* show *Success* icon.

5. In the [Azure portal](https://portal.azure.com), search for and select **IoT Central Applications**.

6. In the list of IoT Central Applications, select your new service. The **Overview** page for the new IoT Central application appears.

# [PowerShell](#tab/PowerShell)

Run the following interactive code to view details about your Azure API for FHIR service. You'll have to enter the name of the new FHIR service and the resource group.

```azurepowershell-interactive
$fhirServiceName = Read-Host -Prompt "Enter the name of your Azure API for FHIR service"
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Write-Verbose "Get-AzHealthcareApisService -ResourceGroupName $resourceGroupName -Name $serviceName" -Verbose
Get-AzHealthcareApisService -ResourceGroupName $resourceGroupName -Name $serviceName
Read-Host "Press [ENTER] to fetch the FHIR API capability statement, which shows that the new FHIR service has been provisioned"

$requestUri="https://" + $fhirServiceName + ".azurehealthcareapis.com/metadata"
$metadata = Invoke-WebRequest -Uri $requestUri
$metadata.RawContent
Read-Host "Press [ENTER] to continue"
```

> [!NOTE]
> Azure IoT Connector for FHIR doesn't provide PowerShell commands at this time. To validate your Azure IoT Connector for FHIR has been provisioned correctly, use the validation process provided in the **Portal** tab.

Run the following interactive code to view details about your Azure IoT Central application. You'll have to enter the name of the new IoT Central application and the resource group.

```azurepowershell-interactive
$iotCentralName = Read-Host -Prompt "Enter the name of your Azure IoT Central application"
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Write-Verbose "Get-AzIotCentralApp -ResourceGroupName $resourceGroupName -Name $iotCentralName" -Verbose
Get-AzIotCentralApp -ResourceGroupName $resourceGroupName -Name $iotCentralName
```

# [CLI](#tab/CLI)

Run the following interactive code to view details about your Azure API for FHIR service. You'll have to enter the name of the new FHIR service and the resource group.

```azurecli-interactive
read -p "Enter the name of your Azure API for FHIR service: " fhirServiceName &&
read -p "Enter the resource group name: " resourceGroupName &&
echo "SHOW SERVICE DETAILS:  az healthcareapis service show --resource-group $resourceGroupName --resource-name $fhirServiceName" &&
az healthcareapis service show --resource-group $resourceGroupName --resource-name $fhirServiceName &&
read -p "Press [ENTER] to fetch the FHIR API capability statement, which shows that the new service has been provisioned: " &&
requestUrl='https://'$fhirServiceName'.azurehealthcareapis.com/metadata' &&
curl --url $requestUrl &&
read -p "Press [ENTER] to continue: "
```

> [!NOTE]
> Azure IoT Connector for FHIR doesn't provide CLI commands at this time. To validate your Azure IoT Connector for FHIR has been provisioned correctly, use the validation process provided in the **Portal** tab.

Run the following interactive code to view details about your Azure IoT Central application. You'll have to enter the name of the new IoT Central application and the resource group.

```azurecli-interactive
read -p "Enter the name of your IoT Central application: " iotCentralName &&
read -p "Enter the resource group name: " resourceGroupName &&
echo "SHOW SERVICE DETAILS:  az iot central app show -g $resourceGroupName -n $iotCentralName" &&
az iot central app show -g $resourceGroupName -n $iotCentralName &&
```

---

## Connect your IoT data with the Azure IoT Connector for FHIR (preview)
> [!IMPORTANT]
> The Device mapping template provided in this guide is designed to work with Data Export (legacy) within IoT Central.

IoT Central application currently doesn't provide ARM template or PowerShell and CLI commands to set data export. So, follow the instructions below using Azure portal.  

Once you've deployed your IoT Central application, your two out-of-the-box simulated devices will start generating telemetry. For this tutorial, we'll ingest the telemetry from *Smart Vitals Patch* simulator into FHIR via the Azure IoT Connector for FHIR. To export your IoT data to the Azure IoT Connector for FHIR, we'll want to [set up a Data export (legacy) within IoT Central](../../iot-central/core/howto-export-data-legacy.md). On the Data export (legacy) page:
- Pick *Azure Event Hubs* as the export destination.
- Select *Use a connection string* value for **Event Hubs namespace** field.
- Provide Azure IoT Connector for FHIR's connection string obtained in a previous step for the **Connection String** field.
- Keep **Telemetry** option *On* for **Data to Export** field.

---

## View device data in Azure API for FHIR

You can view the FHIR-based Observation resource(s) created by Azure IoT Connector for FHIR on your FHIR server using Postman. Set up your [Postman to access Azure API for FHIR](access-fhir-postman-tutorial.md) and make a `GET` request to `https://your-fhir-server-url/Observation?code=http://loinc.org|8867-4` to view Observation FHIR resources with heart rate value.

> [!TIP]
> Ensure that your user has appropriate access to Azure API for FHIR data plane. Use [Azure role-based access control (Azure RBAC)](configure-azure-rbac.md) to assign required data plane roles.

---

## Clean up resources

When it's no longer needed, delete the resource group, which deletes the resources in the resource group.

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Resource groups**.

2. In the resource group list, choose the name of your resource group.

3. In the **Overview** page of your resource group, select **Delete resource group**.

4. In the confirmation dialog box, type the name of your resource group, and then select **Delete**.

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the name of the resource group to delete"
Write-Verbose "Remove-AzResourceGroup -Name $resourceGroupName" -Verbose
Remove-AzResourceGroup -Name $resourceGroupName
Read-Host "Press [ENTER] to continue"
```

# [CLI](#tab/CLI)

```azurecli-interactive
read -p "Enter the name of the resource group to delete: " resourceGroupName &&
echo "DELETE A RESOURCE GROUP (AND ITS RESOURCES):  az group delete --name $resourceGroupName" &&
az group delete --name $resourceGroupName &&
read -p "Press [ENTER] to continue: "
```

---

For a step-by-step tutorial that guides you through the process of creating an ARM template, see the [tutorial to create and deploy your first ARM template](../../azure-resource-manager/templates/template-tutorial-create-first-template.md)

## Next steps

In this quickstart guide, you've deployed Azure IoT Connector for FHIR feature in your Azure API for FHIR resource. Select from below next steps to learn more about Azure IoT Connector for FHIR:

Understand different stages of data flow within Azure IoT Connector for FHIR.

>[!div class="nextstepaction"]
>[Azure IoT Connector for FHIR data flow](iot-data-flow.md)

Learn how to configure IoT Connector using device and FHIR mapping templates.

>[!div class="nextstepaction"]
>[Azure IoT Connector for FHIR mapping templates](iot-mapping-templates.md)

*In the Azure portal, Azure IoT Connector for FHIR is referred to as IoT Connector (preview). FHIR is a registered trademark of HL7 and is used with the permission of HL7.
