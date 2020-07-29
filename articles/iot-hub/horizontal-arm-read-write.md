---
title: Use an ARM template to create an Azure IoT Hub then send messages to the hub, routing them automatically to Azure Storage
description: Use an ARM template to create an Azure IoT Hub then send messages to the hub, routing them automatically to Azure Storage
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.author: robinsh
ms.topic: conceptual
ms.date: 07/20/2020
---
# Quickstart: Deploy an Azure IoT Hub and a storage account using an ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to create an IoT Hub that will route messages to Azure Storage, and a storage account to hold them. After manually adding a virtual IoT device to the hub to submit the messages, you configure that connection information in the arm-read-write application to submit messages to the hub using that device. The hub has the routing configured, so the messages sent to the hub are automatically routed by the hub to the storage account. At the end of this quickstart, you can open the storage account and see the messages sent.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.
<!--ROBIN fix this-->
[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-notification-hub%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) account before you begin.

## Review the template
<!--ROBIN fix this-->

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-notification-hub/).

<!--ROBIN fix this-->
:::code language="json" source="~/quickstart-templates/101-notification-hub/azuredeploy.json" range="1-45" highlight="22-40":::

* [Microsoft.NotificationHubs/namespaces](/azure/templates/microsoft.notificationhubs/namespaces)
* [Microsoft.NotificationHubs/namespaces/notificationHubs](/azure/templates/microsoft.notificationhubs/namespaces/notificationhubs)


## Overview

1. Start the process of creating the resources by loading the ARM template. Click [here](wherever). how to specify the resource group?

1. Download and unzip the c# IoT samples zip file which is [here](https://Azure-Samples/azure-iot-samples-csharp)

1. Open a text editor such as notepad and paste the following into it. Then we'll retrieve the values needed.

```cmd
SET ENV_HUB_URI = <hub-name-goes-here>.azure.devices.net
SET ENV_DEVICE_KEY = "device-key-goes-here"
SET ENV_DEVICE_ID = "Contoso-Test-Device"
```

1. Log into the (Azure portal)[http://portal.azure.com]. Select **RESOURCE GROUPS** and then select the resource group you selected for this quickstart. You see the IoT Hub and storage account that were created when you loaded the ARM template.

1. Select the hub. Then select the name of the hub and paste it into <hub-name-goes-here> in the environment variable file.

1. In the IoT Hub pane, look through the properties and select **IOT DEVICES**. On the right side of the screen, select + DEVICES (whatever) to add a new device. This quickstart uses **Contoso-Test-Device**. Save the device and then open that screen again to retrieve the device key. Select either the primary or secondary key and copy it to the clipboard, then paste it into device-key-goes-here in the environment variables files.

1. Set the device id to "Contoso-Device-ID" (unless you changed it in the ARM template). 
 
1. Save the environment variables file, using a file extension of `cmd`. Copy this to the solution folder where the project arm-read-write.csproj resides. Copy each row and paste it into the command-line in the CMD window and select Enter to execute the command. Do this for each of the environment variables. When you're finished, type in the command SET and select Enter -- it shows all the active variables, including the three you just set up.

1. DO NOT CLOSE THE CMD WINDOW. Since the application is a .NET Core application, you can run it without opening the code. 

1. In the CMD window, type the following command.

    DOTNET RUN ARM-READ-WRITE

The application starts running, and shows the messages as it sends each one to the IoT Hub. The Iot Hub finds the routing configuration and routes the messages to the storage account. Let the app run for 10 to 15 minutes, then press Enter one or twice until it stops. 

** Check the results

1. Log in to the (portal)[https://portal.azure.com] and select the Resource Group, then select the Storage account.

1. Drill down into the storage account until you find files, similar to this:

{screenshot}

1. Click on a file and select Save As and save the file to a location you can find it later. It will have a name that's numeric, like 47. Add ".txt" to the end to make it easier to open it.

1. Select the file to open it. Each row is a different message sent to the IoT Hub. 

** You have created an IoT Hub and a storage account, and run a program to write messages to the hub. The messages are then routed to the storage account. 

-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------


- The TOC node must use **displayName** and have at least **Resource Manager** as a value to enable the TOC search box.

  ![TOC title and display name](./media/contribute-how-to-write-resource-manager-quickstart/toc-title-displayname.png)


### H1

- The **H1** must begin with **Quickstart:** and include the words **ARM template**.

> [!NOTE]
> The style guide team confirmed that for the H1 **ARM template** is preferred because it's more concise and better suited to search results.
what the fuck does that mean? Don't start it with "Quickstart" etc??


### First H2: Prerequisites

**get a free azure account**

### Second H2: Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/<templateName>).
  
- After the first sentence, add a JSON code fence that links to the quickstart template. Customers have provided feedback that they prefer to see the whole template. We recommend you include the entire template in your article. If your template is too long to show in the quickstart (more than 250 lines), you can instead add a sentence that says: `The template for this article is too long to show here. To view the template, see [azuredeploy.json](link to template's raw output)`.

  The syntax for the code fence is:

//
//```text
//:::code language="json" source="~/quickstart-templates/<TEMPLATE NAME>/azuredeploy.json" range="000-000"
//highlight="000-000":::
//```

- After the JSON code fence, a list of each `resourceType` from the JSON must exist with a link to the template reference starting with **/azure/templates**. List the `resourceType` links in the same order as in the template.
I DON'T EVEN KNOW WHAT THAT MEANS 

    ![list resource types](./media/contribute-how-to-write-resource-manager-quickstart/list-resource-types.png)

    The URL usually appears as, for example, `https://docs.microsoft.com/azure/templates/microsoft.network/loadbalancers` for `loadbalancer` of `Microsoft.Network`.

    > [!NOTE]
    > Remove the API version from the URL so that the URL redirects to the latest version.

### Third H2: Deploy the template

One of the following options must be included:

- **CLI**: An Azure CLI interactive code fence must contain `az deployment group create`. For example:

  ```azurecli-interactive
  read -p "Enter a project name that is used for generating resource names:" projectName &&
  read -p "Enter the location (i.e. centralus):" location &&
  templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json" &&
  resourceGroupName="${projectName}rg" &&
  az group create --name $resourceGroupName --location "$location" &&
  az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri &&
  echo "Press [ENTER] to continue ..." &&
  read
  ```


- **Portal**: Use a button with the description **Deploy to Azure** and the shared image **../media/template-deployments/deploy-to-azure.svg**. Please use this shared image, instead of an image in one of your folders, so it can be easily updated in the future. The template link starts with `https://portal.azure.com/#create/Microsoft.Template/uri/`:

### Fourth H2: Review deployed resources

open the portal, find the resource group, open the storage account using the storage explorer...

This heading must be titled **Review deployed resources** or **Validate the deployment**. Include at least one method that displays the deployed resources. Use a portal screenshot of the resources, or interactive code fences for Azure CLI (`azurecli-interactive`) or Azure PowerShell (`azurepowershell-interactive`).

### Fifth H2: Clean up resources

The **Clean up resources** section includes a paragraph that explains how to delete unneeded resources. Include at least one method that shows how to clean up resources. Use a portal screenshot, or interactive code fences for Azure CLI (`azurecli-interactive`) or Azure PowerShell (`azurepowershell-interactive`).

### Sixth H2: Next steps

Make the next steps similar to other [quickstarts](contribute-how-to-mvc-quickstart.md) and use a blue button to link to the next article for your service. Or direct readers to [Tutorial: Create and deploy your first ARM template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template) to follow the process of creating a template.

```markdown
> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template)
```



//https://github.com/Azure/azure-quickstart-templates