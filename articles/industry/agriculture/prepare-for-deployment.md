---
title: Deploy Azure FarmBeats
description: This article describes how to deploy Azure FarmBeats.
author: uhabiba04
ms.topic: article
ms.date: 11/04/2019
ms.author: v-umha
---

# Deploy Azure FarmBeats

This article describes how to set up Azure FarmBeats.

Azure FarmBeats is an industry-specific, extensible solution for data-driven farming that enables seamless provisioning and sensor-device connectivity to the Azure cloud, telemetry data collection, and aggregation. Azure FarmBeats includes a variety of sensors, such as cameras, drones, and soil sensors. With Azure FarmBeats, you can manage devices from the cloud, which includes managing infrastructure and services in Azure for IoT-ready devices and using an extensible web and mobile app to provide visualization, alerts, and insights.

> [!NOTE]
> Azure FarmBeats is supported only in public cloud environments. For more information, see [What is a public cloud?](https://azure.microsoft.com/overview/what-is-a-public-cloud/).

Azure FarmBeats has the following two components:

- **Datahub**: The platform layer of Azure FarmBeats, which lets you build, store, process data, and draw insights from existing or new data pipelines. This platform layer is useful to run and build your agriculture data pipelines and models.

- **Accelerator**: The solution layer of Azure FarmBeats, which has a built-in application to illustrate the capabilities of Azure FarmBeats using the pre-created agriculture models. This solution layer lets you create farm boundaries and draw insights from the agriculture data within the context of the farm boundary.

A quick deployment of Azure FarmBeats should take less than an hour. Costs for Datahub and Accelerator vary, depending on usage.

## Deployed resources

Azure FarmBeats deployment creates the following resources within your subscription:

| Serial. no.  | Resource name  | FarmBeats component  |
|---------|---------|---------|
|1  |       Azure Cosmos DB   |  Datahub       |
|2  |    Application Insights      |     Datahub/Accelerator     |
|3  |Azure Cache for Redis   |Datahub   |
|4  |       Azure Key Vault    |  Datahub/Accelerator        |
|5  |    Azure Time Series Insights       |     Datahub      |
|6 |      Azure Event Hub Namespace    |  Datahub       |
|7  |    Azure Data Factory V2       |     Datahub/Accelerator      |
|8  |Batch account    |Datahub   |
|9  |       Storage account     |  Datahub/Accelerator        |
|10  |    Logic app        |     Datahub      |
|11  |    API connection        |     Datahub      |
|12|      Azure App Service      |  Datahub/Accelerator       |
|13 |    App service plan        |     Datahub/Accelerator      |
|14 |Azure Maps account     |Accelerator    |

Azure FarmBeats is available for download in Azure Marketplace, which you can access directly from the Azure portal.  

## Create an Azure FarmBeats offer in Azure Marketplace

To create an Azure FarmBeats offer in Azure Marketplace, do the following:

1. Sign in to the Azure portal, select your account at the top right, and then switch to the Azure Active Directory (Azure AD) tenant where you want to deploy Azure FarmBeats.
2. Azure FarmBeats is available in Azure Marketplace. On the **Azure Marketplace** page, select **Get it Now**.
3. Select **Create**.

> [!NOTE]
> Completion of the offer in Azure Marketplace is only a part of the setup. To complete the deployment of Azure FarmBeats in your Azure subscription, follow the instructions in the next sections.

## Prepare

Before you can deploy Azure FarmBeats, you need the following permissions:

- **Tenant**: Read access
- **Subscription**: Contributor or owner
- **Resource group**: Owner

## Before you begin

Before you start the deployment, ensure that the following prerequisites are in place:

- A Sentinel account
- An Azure AD app registration

## Create a Sentinel account    

An account with Sentinel helps you to download the Sentinel satellite imagery from their official website to your device. To create a free account, do the following:

1. Go to the [Sentinel account registration page](https://scihub.copernicus.eu/dhus/#/self-registration).
1. On the registration form, provide your first name, last name, username, password, and email address.

A verification email will be sent to the registered email address for confirmation. Select the link to confirm your email address. Your registration process is complete.

## Create an Azure AD app registration

For authentication and authorization on Azure FarmBeats, you must have an Azure AD app registration. You can create it in either of two ways:

* **Option 1**: Installer can create the registration automatically, provided that you have the required tenant, subscription, and resource group access permissions. If these permissions are in place, continue to the ["Prepare the input.json file"](#prepare-the-inputjson-file) section.

* **Option 2**: You can create and configure the registration manually before you deploy Azure FarmBeats. We recommend this method when you don't have the required permissions to create and configure an Azure AD app registration within your subscription. Ask your administrator to use the [custom script](https://aka.ms/FarmBeatsAADScript), which will help the IT admin automatically generate and configure the Azure AD app registration on the Azure portal. As an output to running this custom script using PowerShell environment the IT admin needs to share an Azure AD Application Client ID and password secret with you. Make a note of these values.

    To run the Azure AD app registration script, do the following:

    1. Download the [script](https://aka.ms/FarmBeatsAADScript).
    1. Sign in to the Azure portal, and select your subscription and Azure AD tenant.
    1. Launch Cloud Shell from the toolbar at the top of the Azure portal.

        ![Project FarmBeats](./media/prepare-for-deployment/navigation-bar-1.png)

    1. If you're a first-time user, you're prompted to select a subscription to create a storage account and Microsoft Azure Files share. Select **Create storage**.
    1. First-time users are also offered a choice of shell experiences, Bash or PowerShell. Choose PowerShell.
    1. Upload the script (from step 1) to Cloud Shell, and note the location of the uploaded file.

        > [!NOTE]
        > By default, the file is uploaded to your home directory.

        Use the following script:

        ```azurepowershell-interactive
        ./create_aad_script.ps1
        ```
    1. Make a note of the Azure AD application ID and client secret to share with the person who's deploying Azure FarmBeats.

### Prepare the input.json file

As part of the installation, create an *input.json* file, as shown here:

```json
{  
    "sku":"both",
    "subscriptionId":"da9xxxec-dxxf-4xxc-xxx21-xxx3ee7xxxxx",
    "datahubResourceGroup":"dummy-test-dh1",
    "location":"westus2",
    "datahubWebsiteName":"dummy-test-dh1",
    "acceleratorResourceGroup":" dummy-test-acc1",
    "acceleratorWebsiteName":" dummy-test-acc1",
    "sentinelUsername":"dummy-dev",
    "notificationEmailAddress":"dummy@yourorg.com",
    "updateIfExists":true
}
```

This file is your input file to Azure Cloud Shell. It contains the parameters whose values are used during the installation. All parameters in the JSON file need to be replaced with appropriate values or removed. It they're removed, the installer will prompt you during installation.

Before you prepare the file, review the parameters in the following table:

|Command | Description|
|--- | ---|
|sku  | Provides a choice to download either or both of the components of Azure FarmBeats. It specifies which components to download. To install only Datahub, use "onlydatabhub". To install Datahub and Accelerator, use "both".|
|subscriptionId | Specifies the subscription for installing Azure FarmBeats.|
|datahubResourceGroup| The resource group name for your Datahub resources.|
|location |The location where you want to create the resources.|
|acceleratorWebsiteName |The unique URL prefix to name your Datahub instance.|
|acceleratorResourceGroup  | The unique URL prefix to name your Accelerator website.|
|datahubWebsiteName  | The unique URL prefix to name your Datahub website. |
|sentinelUsername | The username to sign in with (for example, `https://scihub.copernicus.eu/dhus/#/self-registration`).|
|notificationEmailAddress  | The email address to receive the notifications for any alerts that you configure within your Datahub instance.|
|updateIfExists| (Optional) A parameter to include within the *input.json* file only if you want to upgrade an existing Azure FarmBeats instance. For an upgrade, other details, such as the resource group names and locations, need to be the same.|
|aadAppClientId | (Optional) A parameter to include within the *input.json* file only if the Azure AD app already exists.  |
|aadAppClientSecret  | (Optional) A parameter to include within the *input.json* file only if the Azure AD app already exists.|

## Deploy the app within Cloud Shell

As part of the previously discussed marketplace workflow, you must have created one resource group and signed the “license terms” agreement, which you can review again as part of the actual deployment. You can deploy the app via the Cloud Shell browser-based command-line interface by using the Bash environment. To deploy via Cloud Shell, continue to the next sections.

> [!NOTE]
> Inactive Cloud Shell sessions expire after 20 minutes. Try to complete the deployment within this time.

1. Sign in to the Azure portal, and select the subscription and Azure tenant you want to use.
1. Launch Cloud Shell from the toolbar at the top of the Azure portal.
1. If you're using Cloud Shell for the first time, you're prompted to select a subscription to create a storage account and an Azure Files share.
1. Select **Create Storage**.  
1. For the environment select **Bash** (not PowerShell).

## Deployment scenario 1

In this scenario, which is described earlier in "Option 1," Installer creates the Azure AD app registration automatically. You deploy FarmBeats by doing the following:

1. Copy the following sample JSON template, and save it as *input.json*. Be sure to make a note of the file path on your local computer.

    ```json
    {  
       "sku":"both", 
       "subscriptionId":"da9xxxec-dxxf-4xxc-xxx21-xxx3ee7xxxxx", 
       "datahubResourceGroup":"dummy-test-dh1", 
       "location":"eastus2", 
       "datahubWebsiteName":"dummy-test-dh1", 
       "acceleratorResourceGroup":" dummy-test-acc1",   
       "acceleratorWebsiteName":" dummy-test-acc1", 
       "sentinelUsername":"dummy-dev", 
       "notificationEmailAddress":" dummy@microsoft.com", 
       "updateIfExists":true 
    }
    ```

1. Open Azure Cloud Shell. After successful authentication, select the **Upload** button (highlighted in the following image), and then upload the *input.json* file to Cloud Shell storage.  

    ![Project FarmBeats](./media/prepare-for-deployment/bash-2-1.png)

1. Go to your home directory in Cloud Shell. By default, the directory name is */home/\<username>*.
1. In Cloud Shell, enter the following command. Be sure to modify the path to the *input.json* file, and then select the Enter key.

   ```bash
      wget -O farmbeats-installer.sh https://aka.ms/AzureFarmbeatsInstallerScript && bash farmbeats-installer.sh /home/<username>/input.json
    ```
     The installer automatically downloads all dependencies and builds the deployer. You're prompted to agree to the Azure FarmBeats license terms.

     - If you agree, enter **Y** to proceed to the next step.
     - If you do not agree, enter **N**, and the deployment will be terminated.

1. At the prompt, enter an access token for the deployment. Copy the generated code, and log in to the [device login page](https://microsoft.com/devicelogin) with your Azure credentials.

    > [!NOTE]
    > The token expires after 60 minutes. If it expires, you can restart by retyping the deployment command.

1. At the prompt, enter your Sentinel account password.

   The installer validates and starts the deployment, which can take about 20 minutes.

   After the deployment finishes successfully, you'll receive the following output links:

    - **Datahub URL**: The Swagger link for trying Azure FarmBeats APIs.
    - **Accelerator URL**: The user interface for exploring Azure FarmBeats Smart Farm Accelerator.
    - **Deployer log file**: The log file that's created during deployment. You can use it for troubleshooting, if necessary.

## Deployment scenario 2

In this scenario, which is described earlier in "Option 2," you use your existing Azure Active Directory app registration to deploy FarmBeats by doing the following:

1. Copy the following JSON file, which includes the Azure Application Client ID and password in the *input.json* file, and save it. Be sure to make a note of the file path on your local computer.

    ```json
   {

   "sku":"both",
   "subscriptionId":"daxx9xxx-d18f-4xxc-9c21-5xx3exxxxx45",
   "datahubResourceGroup":"dummy-test-dh1",   
   "location":"westus2",   
   "datahubWebsiteName":"dummy-test-dh1",   
   "acceleratorResourceGroup":"dummy-test-acc1",   
   "acceleratorWebsiteName":"dummy-test-acc1",   
   "sentinelUsername":"dummy-dev",
   "notificationEmailAddress":"dummyuser@org1.com",
   "updateIfExists": true,
   "aadAppClientId": "lmtlemlemylmylkmerkywmkm823",
   "aadAppClientSecret": "Kxxxqxxxxu*kxcxxx3Yxxu5xx/db[xxx"

   }
   ```

1. Go to Azure Cloud Shell again, and you're successfully authenticated.
1. Select the **Upload** button (highlighted in the following image), and then upload the *input.json* file to Cloud Shell storage.

    ![Project FarmBeats](./media/prepare-for-deployment/bash-2-1.png)

1. Go to your home directory in Cloud Shell. By default, the directory name is */home/\<username>*.
1. In Cloud Shell, enter the following command. Be sure to modify the path to the *input.json* file, and then select the Enter key.

    ```bash
    wget -O farmbeats-installer.sh https://aka.ms/AzureFarmbeatsInstallerScript && bash farmbeats-installer.sh /home/<username>/input.json
    ```

     The installer automatically downloads all dependencies and builds the deployer. You're prompted to agree to the Azure FarmBeats license terms.

     - If you agree, enter **Y** to proceed to the next step.
     - If you do not agree, enter **N**, and the deployment will be terminated.

1. At the prompt, enter an access token for the deployment. Copy the generated code, and log in to the [device login page](https://microsoft.com/devicelogin) with your Azure credentials.

   The installer validates and starts the deployment, which can take about 20 minutes.

   After the deployment finishes successfully, you'll receive the following output links:

    - **Datahub URL**: The Swagger link for trying Azure FarmBeats APIs.
    - **Accelerator URL**: The user interface for exploring Azure FarmBeats Smart Farm Accelerator.
    - **Deployer log file**: The log file that's created during deployment. You can use it for troubleshooting, if necessary.

If you encounter any issues, review [Troubleshoot](troubleshoot-project-farmbeats.md).


## Validate the deployment

### Datahub

After the Datahub installation is complete, you'll receive the URL to access Azure FarmBeats APIs via the Swagger interface in the format https://\<yourdatahub-website-name>.azurewebsites.net/swagger.

1. To sign in via Swagger, copy and paste the URL in your browser.
2. Sign in with your Azure portal credentials.
3. You can see the swagger and perform all REST operations on the Azure FarmBeats   APIs. This indicates successful deployment of Azure FarmBeats.

### Accelerator

After the Accelerator installation is complete, you'll receive the URL to access the Azure FarmBeats user interface in the format https://\<accelerator-website-name>.azurewebsites.net.

1. To sign in from Accelerator, copy and paste the URL in your browser.
1. Sign in with your Azure portal credentials.

## Upgrade

The instructions for upgrade are similar to those for the first-time installation. Do the following:

1. Sign in to the Azure portal, and then select your desired subscription and Azure tenant.
1. Open Cloud Shell from the top navigation of the Azure portal.

   ![Project FarmBeats](./media/prepare-for-deployment/navigation-bar-1.png)

1. In the **Environment** drop-down list at the left, select **Bash**.
1. If necessary, make changes to your *input.json* file, and then upload it to Cloud Shell. For example, you can update your email address for the notification you want to receive.
1. Type or paste the following two commands into Cloud Shell. Be sure to modify the *input.json* file path, and then select the Enter key.

    ```bash
    wget -O farmbeats-installer.sh https://aka.ms/AzureFarmbeatsInstallerScript && bash farmbeats-installer.sh /home/<username>/input.json
    ```

   The installer automatically prompts you for the required inputs at runtime.

1. Enter an access token for deployment. Copy the generated code, and sign in to the [device login page](https://microsoft.com/devicelogin) with your Azure credentials.
1. Enter your Sentinel password.

   The installer now validates and starts creating the resources, which can take about 20 minutes.

   After the deployment finishes successfully, you'll receive the following output links:
    - **Datahub URL**: The Swagger link for trying Azure FarmBeats APIs.
    - **Accelerator URL**: The user interface for exploring Azure FarmBeats Smart Farm Accelerator.
    - **Deployer log file**: The log file that's created during deployment. You can use it for troubleshooting, if necessary.

> [!NOTE]
> Make note of the preceding values for future use.


## Uninstall

Currently, we don't support automated uninstallation of Azure FarmBeats by using the installer. To remove Datahub or Accelerator, in the Azure portal, delete the resource group in which these components are installed, or delete the resources manually.

For example, if you deployed Datahub and Accelerator in two different resource groups, you can delete those resource groups as follows:

1. Sign in to the Azure portal.
1. Select your account at the top right, and switch to the Azure AD tenant where you want to deploy Azure FarmBeats.

   > [!NOTE]
   > Datahub is necessary for Accelerator to work properly. We don’t recommend uninstalling Datahub without also uninstalling Accelerator.

1. Select **Resource Groups**, and then enter the name of the Datahub or Accelerator resource group that you want to delete.
1. Select the resource group name. Retype the name to confirm it, and then select **Delete** to remove the resource group and all its underlying resources.
   Alternatively, you can delete each resource manually, a method that we don't recommend.
1. To delete or uninstall Datahub, go to the resource group directly on Azure, and then delete the resource group from there.

## Next steps

You've learned how to deploy Azure FarmBeats. Next, learn how to [create FarmBeats farms](manage-farms.md#create-farms).
