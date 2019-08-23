---
title: Extend Azure DevTest Labs using Azure Functions | Microsoft Docs
description: Learn how to extend Azure DevTest Labs using Azure Functions. 
services: devtest-lab,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/22/2019
ms.author: spelluru

---
## Use Azure Functions to extend DevTest Labs
You can use Azure Functions to support additional scenarios beyond the scenarios already supported by DevTest Labs. Azure Functions can be used to extend the built-in functionality of the services to meet business-specific needs. The following list provides some of the possible scenarios. This article shows you how to implement one of those sample scenarios.

- Provide a top-level summary of virtual machines (VMs) in the Lab
- [Configure a lab to use a remote desktop gateway](configure-lab-remote-desktop-gateway.md)
- Compliance reporting on the internal support page
- Enable users to complete operations that require increased permissions in the subscription
- [Listening to DevTest Labs events and initiating workflows based on them](https://github.com/RogerBestMsft/DTL-SecureArtifactData)

## Overview
[Azure Functions](../azure-functions/functions-overview.md) is a serverless computing platform in Azure. Using Azure Functions in a solution with DevTest Labs enables us to augment the existing features with our own custom code. For more information on Azure Functions, see [Azure Functions documentation](../azure-functions/functions-overview.md). To illustrate how Azure Functions can help fulfill your requirements or complete scenarios in DevTest Labs, this article uses an example of providing a top-level summary of VMs in the Lab as follows:

**Example requirement/scenario**: Users are easily able to see details about all VMs in a lab including the operating system, owner, and any applied artifacts.  In addition, if the **Apply Windows Updates** artifact hasn't been recently applied, there is an easy way to apply it.

To complete the scenario, you will use two functions as described in the following diagram.  The source code for these sample functions is located in the [DevTest Labs GitHub repository](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/AzureFunctions) (both C# and PowerShell implementations are available).

- **UpdateInternalSupportPage**: This function queries DevTest Labs and updates the internal support page directly with details about the virtual machines.
- **ApplyWindowsUpdateArtifact**: For a VM in a lab, this function applies the **Windows Update** artifact.

![Overall flow](./media/extend-devtest-labs-azure-functions/flow.png)

## How it works
When users select the **Internal Support** page in DevTest Labs, they have a pre-populated page with information about VMs, lab owners, and support contacts.  

When you select the **Click Here to Refresh** button, the page calls the first Azure function: **UpdateInternalSupportPage**. The function queries the lab for information and then rewrites the **Internal Support** page with the new information.


There’s an additional action that can be taken, for any VMs that haven’t recently applied the Windows Update artifact, there will be a button to apply windows updates.  

When you select the ***Run Windows Update** button for a VM, the page calls the second Azure Function: **ApplyWindowsUpdateArtifact**. This function checks whether the virtual machine is running and if so, applies the [Windows Update](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-install-windows-updates) artifact directly.

## Step-by-step Walkthrough
This section provides step-by-step instructions for setting up Azure Resources needed to enable updating the **Internal Support** page. This walkthrough provides one example of extending DevTest Labs. There are many other ways to use this pattern for other scenarios.

### Step 1: Create a service principal 
The first step is to get a service principal with permission to the subscription that contains the lab. For the example, the service principal must use password-based authentication. It can be done with [Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest), [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps?view=azps-2.5.0), or the [Azure portal](../active-directory/develop/howto-create-service-principal-portal.md). If you already have a service principal to use, you can skip this step.

### Step 2: Download the sample and open in Visual Studio 2019
Download a copy of the [C# Azure Functions sample](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/AzureFunctions/CSharp) locally (either by cloning the repository locally or downloading the repository from [here](https://github.com/Azure/azure-devtestlab/archive/master.zip)).  

1. Open the sample solution with Visual Studio 2019.  
1. Install the **Azure development** workload for Visual Studio if you don't have it already installed. It can be installed via **Tools** -> **Get Tools and Features** menu item).

    ![Azure development workload](./media/extend-devtest-labs-azure-functions/azure-development-workload-vs.png)
1. Build the solution. Select **Build** -> **Build Solution** menu item.

### Step 3: Deploy the sample to Azure
In Visual Studio, In the **Solution Explorer** window, right-click the **AzureFunctions** project, and then select **Publish**. Follow the wizard to complete publishing to either a new or an existing Azure Function App. For detailed information on developing and deploying Azure functions using Visual Studio, see [Develop Azure Functions using Visual Studio](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-vs).

![Publish dialog](./media/extend-devtest-labs-azure-functions/publish-dialog.png)


### Step 4:  Gather application settings
Once the functions are published, you need the full function URLs from the Azure portal. Navigate to the [Azure portal](https://portal.azure.com). Find the function app and select **Get function URL** for each of the azure functions and copy the links.

![Azure functions URLs](./media/extend-devtest-labs-azure-functions/function-url.png)

The function URLs should look like the following examples:

- `https://<functionname>.azurewebsites.net/api/subscriptions/{SUBSCRIPTIONID}/resourceGroups/{RESOURCEGROUPNAME}/providers/Microsoft.DevTestLab/labs/{LABNAME}?code=<secretkey>`
- `https://<functionname>.azurewebsites.net/api/subscriptions/{SUBSCRIPTIONID}/resourceGroups/{RESOURCEGROUPNAME}/providers/Microsoft.DevTestLab/labs/{LABNAME}/virtualmachines/{VIRTUALMACHINENAME}?code=<secretkey>`

You will also need additional information such as the service principal, application ID and key, and tenant ID.


### Step 5:  Update Application Settings
In Visual Studio, after publishing the Azure Function, select the **Edit Azure App Service Settings** under **Actions**. Update the following application settings (remote):

- AzureFunctionUrl_ApplyUpdates
- AzureFunctionUrl_UpdateSupportPage
- WindowsUpdateAllowedDays (default to 7)
- ServicePrincipal_AppId
- ServicePrincipal_Key
- ServicePrincipal_Tenant

    ![Application settings](./media/extend-devtest-labs-azure-functions/application-settings.png)

### Step 6: Test the Azure function
The last step in getting the solution is to test the Azure function.  

1. Navigate to the **UpdateInternalSupportPage** function in the function app created in the step 3. 
1. Select **Test** on the right side of the page. 
1. Enter in the route properties (LABNAME, RESOURCEGROUPNAME, and SUBSCRIPTIONID).
1. Select **Run** to execute the function.  

    This function will update the internal support page of the specified lab. It also includes a button for users to directly call the function next time

    ![Test function](./media/extend-devtest-labs-azure-functions/test-function.png)

## Next steps
Azure Functions can help extend the functionality of DevTest Labs beyond what’s already built-in and help customers meet their unique requirements for their teams. This pattern can be extended & expanded further to cover even more.  To learn more about DevTest Labs, see the following articles: 

- [DevTest Labs Enterprise Reference Architecture](devtest-lab-reference-architecture.md)
- [Frequently Asked Questions](devtest-lab-faq.md)
- [Scaling up DevTest Labs](devtest-lab-guidance-scale.md)
- [Automating DevTest Labs with PowerShell](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Modules/Library/Tests)








