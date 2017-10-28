---
title: Deploy a VM using C# and a Resource Manager template | Microsoft Docs
description: Learn to how to use C# and a Resource Manager template to deploy an Azure VM.
services: virtual-machines-windows
documentationcenter: ''
author: davidmu1
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: bfba66e8-c923-4df2-900a-0c2643b81240
ms.service: virtual-machines-windows
ms.workload: na
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 03/01/2017
ms.author: davidmu

---
# Deploy an Azure Virtual Machine using C# and a Resource Manager template
This article shows you how to deploy an Azure Resource Manager template using C#. The [template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-windows/azuredeploy.json) deploys a single virtual machine running Windows Server in a new virtual network with a single subnet.

For a detailed description of the virtual machine resource, see [Virtual machines in an Azure Resource Manager template](template-description.md). For more information about all the resources in a template, see [Azure Resource Manager template walkthrough](../../azure-resource-manager/resource-manager-template-walkthrough.md).

It takes about 10 minutes to do these steps.

## Step 1: Create a Visual Studio project

In this step, you make sure that Visual Studio is installed and you create a console application used to deploy the template.

1. If you haven't already, install [Visual Studio](https://www.visualstudio.com/).
2. In Visual Studio, click **File** > **New** > **Project**.
3. In **Templates** > **Visual C#**, select **Console App (.NET Framework)**, enter the name and location of the project, and then click **OK**.

## Step 2: Install libraries

NuGet packages are the easiest way to install the libraries that you need to finish these steps. You need the Azure Resource Manager Library and the Active Directory Authentication Library to create the resources. To get these libraries in Visual Studio, do these steps:

1. Right-click the project name in the Solution Explorer, click **Manage NuGet Packages for Solution...**, and then click **Browse**.
2. Type *Microsoft.IdentityModel.Clients.ActiveDirectory* in the search box, select your project, click **Install**, and then follow the instructions to install the package.
3. At the top of the page, select **Include Prerelease**. Type *Microsoft.Azure.Management.ResourceManager* in the search box, click **Install**, and then follow the instructions to install the package.

Now you're ready to start using the libraries to create your application.

## Step 3: Create credentials used to authenticate requests

Before you start this step, make sure that you have access to an [Active Directory service principal](../../resource-group-authenticate-service-principal.md). From the service principal, you acquire a token for authenticating requests to Azure Resource Manager.

1. Open the Program.cs file for the project that you created, and then add these using statements to the existing statements at top of the file:

    ```
    using Microsoft.Azure;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Microsoft.Azure.Management.ResourceManager;
    using Microsoft.Azure.Management.ResourceManager.Models;
    using Microsoft.Rest;
    using System.IO;
    ```

2. Add this method to the Program class to get the token that's needed to create the credentials:

    ```
    private static async Task<AuthenticationResult> GetAccessTokenAsync()
    {
      var cc = new ClientCredential("client-id", "client-secret");
      var context = new AuthenticationContext("https://login.windows.net/tenant-id");
      var token = await context.AcquireTokenAsync("https://management.azure.com/", cc);
      if (token == null)
      {
        throw new InvalidOperationException("Could not get the token.");
      } 
      return token;
    }
    ```

    Replace these values:
    
    - *client-id* with the identifier of the Azure Active Directory application. You can find this identifier on the Properties blade of your AD application. To find your AD application in the Azure portal, click **Azure Active Directory** in the resource menu, and then click **App registrations**.
    - *client-secret* with the access key of the AD application. You can find this identifier on the Properties blade of your AD application.
    - *tenant-id* with the tenant identifier of your subscription. You can find the tenant identifier on the Properties blade for Azure Active Directory in the Azure portal. It is labeled *Directory ID*.

3. To call the method that you just added, add this code to the Main method:

    ```
    var token = GetAccessTokenAsync();
    var credential = new TokenCredentials(token.Result.AccessToken);
    ```

4. Save the Program.cs file.

## Step 4: Create a resource group

Although you can create a resource group from a template, the template that you use from the gallery doesn't create one. In this step, you add the code to create a resource group.

1. To specify values for the application, add variables to the Main method of the Program class:

    ```
    var groupName = "myResourceGroup";
    var subscriptionId = "subsciptionId";
    var deploymentName = "deploymentName";
    var location = "location";
    ```

    Replace these values:
    
    - *myResourceGroup* with the name of the resource group being created.
    - *subscriptionId* with your subscription identifier. You can find the subscription identifier on the Subscriptions blade of the Azure portal.
    - *deploymentName* with the name of the deployment.
    - *location* with the [Azure region](https://azure.microsoft.com/regions/) where you want to create the resources.

2. To create the resource group, add this method to the Program class:

    ```
    public static async Task<ResourceGroup> CreateResourceGroupAsync(
      TokenCredentials credential,
      string groupName,
      string subscriptionId,
      string location)
    {
      var resourceManagementClient = new ResourceManagementClient(credential)
        { SubscriptionId = subscriptionId };

      Console.WriteLine("Creating the resource group...");
      var resourceGroup = new ResourceGroup { Location = location };
      return await resourceManagementClient.ResourceGroups.CreateOrUpdateAsync(
        groupName, 
        resourceGroup);
    }
    ```

3. To call the method that you just added, add this code to the Main method:

    ```
    var rgResult = CreateResourceGroupAsync(
      credential,
      groupName,
      subscriptionId,
      location);
    Console.WriteLine(rgResult.Result.Properties.ProvisioningState);
    Console.ReadLine();
    ```

## Step 5: Create a parameters file

To specify values for the resource parameters that are defined in the template, you create a parameters file that contains the values. The parameters file is used when you deploy the template. The template that you are using from the gallery expects values for *adminUserName*, *adminPassword*, and *dnsLabelPrefix* parameters.

In Visual Studio, do these steps:

1. Right-click the project name in Solution Explorer, click **Add** > **New Item**.
2. Click **Web**, select **JSON File**, enter *Parameters.json* for the name, and then click **Add**.
3. Open the Parameters.json file and then add this JSON content:

    ```
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "adminUserName": { "value": "mytestacct1" },
        "adminPassword": { "value": "mytestpass1" },
        "dnsLabelPrefix": { "value": "mydns1" }
      }
    }
    ```

    Replace the parameter values with values that work in your environment.

4. Save the Parameters.json file.

## Step 6: Deploy a template

In this example, you deploy a template from the Azure template gallery and supply parameter values to it from the local file that you created. 

1. To deploy the template, add this method to the Program class:

    ```
    public static async Task<DeploymentExtended> CreateTemplateDeploymentAsync(
      TokenCredentials credential,
      string groupName,
      string deploymentName,
      string subscriptionId)
    {
    
      var resourceManagementClient = new ResourceManagementClient(credential)
        { SubscriptionId = subscriptionId };

      Console.WriteLine("Creating the template deployment...");
      var deployment = new Deployment();
      deployment.Properties = new DeploymentProperties
        {
          Mode = DeploymentMode.Incremental,
          TemplateLink = new TemplateLink("https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-windows/azuredeploy.json"),
          Parameters = File.ReadAllText("..\\..\\Parameters.json")
        };
      
      return await resourceManagementClient.Deployments.CreateOrUpdateAsync(
        groupName,
        deploymentName,
        deployment
      );
    }
    ```

    You could also deploy a template from a local folder by using the Template property instead of the TemplateLink property.

2. To call the method that you just added, add this code to the Main method:

    ```
    var dpResult = CreateTemplateDeploymentAsync(
      credential,
      groupName,
      deploymentName,
      subscriptionId);
    Console.WriteLine(dpResult.Result.Properties.ProvisioningState);
    Console.ReadLine();
    ```

## Step 7: Delete the resources

Because you are charged for resources used in Azure, it is always good practice to delete resources that are no longer needed. You don’t need to delete each resource separately from a resource group. Delete the resource group and all its resources are automatically deleted.

1. To delete the resource group, add this method to the Program class:

   ```
   public static async void DeleteResourceGroupAsync(
     TokenCredentials credential,
     string groupName,
     string subscriptionId)
   {
     Console.WriteLine("Deleting resource group...");
     var resourceManagementClient = new ResourceManagementClient(credential)
       { SubscriptionId = subscriptionId };
     await resourceManagementClient.ResourceGroups.DeleteAsync(groupName);
   }
   ```

2. To call the method that you just added, add this code to the Main method:

   ```
   DeleteResourceGroupAsync(
     credential,
     groupName,
     subscriptionId);
   Console.ReadLine();
   ```

## Step 8: Run the console application

It should take about five minutes for this console application to run completely from start to finish. 

1. To run the console application, click **Start** in Visual Studio, and then sign in to Azure AD using the same credentials that you use with your subscription.

2. Press **Enter** after the *Succeeded* status appears. 

    You should also see **1 Succeeded** under Deployments on the Overview blade for your resource group in the Azure portal.

3. Before you press **Enter** to start deleting resources, you could take a few minutes to verify the creation of the resources in the Azure portal. Click the deployment status to see information about the deployment.

## Next Steps
* If there were issues with the deployment, a next step would be to look at [Troubleshoot common Azure deployment errors with Azure Resource Manager](../../resource-manager-common-deployment-errors.md).
* Learn how to deploy a virtual machine and its supporting resources by reviewing [Deploy an Azure Virtual Machine Using C#](csharp.md).
