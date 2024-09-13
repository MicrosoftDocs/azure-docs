---
title: Extend Azure DevTest Labs with Azure Functions
description: Learn how to extend Azure DevTest Labs by using Azure Functions, and build, publish, and test a sample function application.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/18/2024
ms.custom: UpdateFrequency2

#customer intent: As a developer, I want to use Azure Functions with Azure DevTest Labs so I can extend the supported scenarios available in DevTest Labs.
---

# Use Azure Functions to extend Azure DevTest Labs

[Azure Functions](../azure-functions/functions-overview.md) is a serverless computing platform in Azure. You can use Functions to support extra scenarios in Azure DevTest Labs. When you use Functions in a solution with DevTest Labs, you can augment the existing service features with your own custom code. 

This article shows how to extend DevTest Labs built-in functionality to provide a top-level summary of virtual machines (VMs) in a lab. Here are some other scenarios you can support by extending DevTest Labs with Functions:

- [Configure your lab to use a remote desktop gateway](configure-lab-remote-desktop-gateway.md)
- Enable compliance reporting for your lab on the internal support page
- Allow users to complete operations that require increased permissions in the subscription
- [Start workflows based on DevTest Labs events](https://github.com/RogerBestMsft/DTL-SecureArtifactData)

The following sections provide step-by-step instructions for setting up the Azure Resources needed to update the **Internal support** page in DevTest Labs. This walkthrough provides one example for how to extend DevTest Labs. You can use this pattern for other scenarios.

## Explore sample scenario

The sample walkthrough in this article extends DevTest Labs by using Functions to support the following features:

- Provide a top-level summary of all VMs in a lab
- Enable lab users to see virtual machine (VM) details, including operating system, owner, and applied artifacts
- Offer a quick way to apply the [Windows Update](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-install-windows-updates) artifact

The scenario implements two Azure functions:

- `UpdateInternalSupportPage`: Queries DevTest Labs and updates the internal support page directly with details about the lab VMs.
- `ApplyWindowsUpdateArtifact`: Applies the **Windows update** artifact to all VMs in the lab, as needed.

The following diagram demonstrates the overall flow of function behavior in the scenario:

:::image type="content" source="./media/extend-devtest-labs-azure-functions/flow.png" border="false" alt-text="Diagram that demonstrates the overall flow to extend Azure DevTest Labs with Azure Functions for the sample scenario." lightbox="./media/extend-devtest-labs-azure-functions/flow.png":::

- When the user browses to the **Internal support** page in DevTest Labs, they see a prepopulated page with information about lab VMs, lab owners, and support contacts.  

- When the user selects the **Select here to refresh** option, the page calls the Azure function `UpdateInternalSupportPage`. This function queries DevTest Labs for information and then refreshes the **Internal support** page with the latest information.

- When a VM doesn't have a recent **Windows update** artifact, the user can select the ***Run Windows update** option for the VM. The page calls the Azure Function `ApplyWindowsUpdateArtifact`. This function checks whether the VM is running, and if so, applies the [Windows Update](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-install-windows-updates) artifact directly.

## Prerequisites

- To work with the sample in this walkthrough, you need a service principal that has permission to the subscription that contains the lab. The service principal must use password-based authentication. If you already have a service principal that you can use in this walkthrough, you can continue to the [next section](#download-sample-and-build-solution-in-visual-studio).

   1. To get the service principal, you can use the [Azure CLI](/cli/azure/azure-cli-sp-tutorial-1), [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps), or the [Azure portal](/entra/identity-platform/howto-create-service-principal-portal). 

   1. After you have the service principal, copy and save the application ID, key, and tenant ID values. You use the values later in the walkthrough. 

## Download sample and build solution in Visual Studio

The source code for the sample is located in the [DevTest Labs Internal Support Page integration with Azure Functions](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/AzureFunctions) GitHub repository. The sample files support both C# and PowerShell implementations.

After you have the service principal, you're ready to get the sample source:

1. Copy the [C# Azure Functions sample](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/AzureFunctions/CSharp) to your local system. You can clone or download the [Azure DevTest Labs Archive repository](https://github.com/Azure/azure-devtestlab/archive/master.zip).  

1. Open the sample solution in Visual Studio.

1. As needed, install the **Azure development** workload for Visual Studio by selecting **Tools** > **Get Tools and Features**:

   :::image type="content" source="./media/extend-devtest-labs-azure-functions/azure-development-workload-vs.png" alt-text="Screenshot that shows how to install the Azure development workload in Visual Studio.":::

1. Select **Build** > **Build Solution** to complete the process.

## Deploy sample to Azure

The next step is to deploy the sample Function application to Azure:

1. In Visual Studio, open the **Solution Explorer** window.

1. Right-click the **AzureFunctions** project, and then select **Publish**.

1. Complete the Wizard steps to publish a new or existing Azure Function App:

   :::image type="content" source="./media/extend-devtest-labs-azure-functions/publish-dialog.png" border="false" alt-text="Screenshot that shows the Publish dialog for an Azure Function app in Visual Studio." lightbox="./media/extend-devtest-labs-azure-functions/publish-dialog-large.png":::

   For detailed information on developing and deploying Azure Functions applications in Visual Studio, see [Develop Azure Functions by using Visual Studio](../azure-functions/functions-develop-vs.md).

## Get function URL

After you publish the Function app, you need to get URLs for the functions from the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to the **Function App** page, and select the Function app that you created in Visual Studio.

1. On the **Overview** page for the Function app, locate the **Functions** section and select one of the functions: **UpdateInternalSupportPage** or **ApplyWindowsUpdateArtifact**:

   :::image type="content" source="./media/extend-devtest-labs-azure-functions/select-function.png"  alt-text="Screenshot that shows how to access the Azure functions for the Function app in the Azure portal." lightbox="./media/extend-devtest-labs-azure-functions/select-function.png":::

1. On the **Code + Test** page for the Azure function, select **Get function URL**.

1. On the **Get Function URL** pane, use the **Copy** action to copy the desired URL to your clipboard:

   :::image type="content" source="./media/extend-devtest-labs-azure-functions/function-url.png" alt-text="Screenshot that shows how to copy the URL for the function in the Azure portal." lightbox="./media/extend-devtest-labs-azure-functions/function-url.png":::

1. Save the copied URL for later use.

1. Repeat these steps for the other Azure function. 

## Update application settings

In addition to the URL for each function, you also need to update information about the service principal, including the application ID, key, and tenant ID.

Follow these steps to update the required application settings in Visual Studio:

1. In Visual Studio, return to the **Publish** page for the **AzureFunctions** project.

1. In the **Hosting** section, select **More actions** (...), and then select **Manage Azure App Service settings**:

   :::image type="content" source="./media/extend-devtest-labs-azure-functions/manage-settings.png" alt-text="Screenshot that shows how to manage the Azure App Service settings from the Publish page for the Function app." lightbox="./media/extend-devtest-labs-azure-functions/manage-settings-large.png":::

1. On the **Application settings** dialog, update the **Remote** value for the following settings:

   - **AzureFunctionUrl_ApplyUpdates**
   - **AzureFunctionUrl_UpdateSupportPage**
   - **WindowsUpdateAllowedDays** (default to 7)
   - **ServicePrincipal_AppId**
   - **ServicePrincipal_Key**
   - **ServicePrincipal_Tenant**

   :::image type="content" source="./media/extend-devtest-labs-azure-functions/application-settings.png" alt-text="Screenshot that shows how to update the Azure App Service Function application settings in Visual Studio." lightbox="./media/extend-devtest-labs-azure-functions/application-settings-large.png":::

1. Select **OK**.

## Test Azure function

The last step is to test the Azure function:

1. In the [Azure portal](https://portal.azure.com), go to the **Function App** page, and select the Function app that you created in Visual Studio.

1. On the **Overview** page for the Function app, locate the **Functions** section and select the **UpdateInternalSupportPage** function.

1. On the **Code + Test** page for the Azure function, select **Test / Run**.

1. On the **Test / Run** pane, enter values for the route properties: `LABNAME`, `RESOURCEGROUPNAME`, and `SUBSCRIPTIONID`:

   :::image type="content" source="./media/extend-devtest-labs-azure-functions/test-function.png" alt-text="Screenshot that shows how to enter the property values for the function test." lightbox="./media/extend-devtest-labs-azure-functions/test-function.png":::

1. Select **Run** to execute the function. The function test updates the internal support page of the specified lab. It also includes an option for users to directly call the function next time.

## Related content

- Explore [DevTest Labs enterprise reference architecture](devtest-lab-reference-architecture.md)
- [Scale up your DevTest Labs infrastructure](devtest-lab-guidance-scale.md)
- [Automate DevTest Labs with PowerShell](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Modules/Library/Tests)
