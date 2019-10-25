---
title: Prepare for Deployment
description: Describes how to deploy FarmBeats
author: uhabiba04
ms.topic: article
ms.date: 11/04/2019
ms.author: v-umha
---
# Prepare for Deployment - Azure FarmBeats


This article describes how to set up Azure FarmBeats. Azure FarmBeats is an industry-specific, extensible solution for data-driven farming that enables seamless provisioning and sensor devices connectivity to Azure cloud, telemetry data collection, and aggregation from various sensors such as cameras, drones, soil sensors, and management of devices from the cloud, which includes infrastructure and services in Azure for the IoT-ready (Internet of Things) devices to an extendible web and mobile app to provide visualization, alerts, and insights.

> [!NOTE]
> Azure FarmBeats is supported only in Public Cloud Environments. To know more, click [here](https://azure.microsoft.com/en-in/overview/what-is-a-public-cloud/)


Azure FarmBeats has the following two components:


- **Data hub** - Data hub is the platform layer of Azure FarmBeats that lets you build, store, process data and draw insights from existing or new data pipelines. This platform layer is useful to run and build your agriculture data pipelines and models.

- **Accelerator** - Accelerator is the solution layer of Azure FarmBeats that has built-in application to illustrate the capabilities of Azure FarmBeats using the pre-created agriculture models. This solution layer lets you create farm boundaries and draw insights from the agriculture data within the context of the farm boundary.

Following is the duration of the time and expenses to deploy Azure FarmBeats:

- Time required to deploy Azure FarmBeats- 30 minutes1. Time required to deploy Azure FarmBeats- 30 minutes
- Cost of a deployment: The overall cost incurred for Azure FarmBeats product will vary based on the usage, but the steady state cost is approximately:

  -	Data hub: $500/month
  - Accelerator: $100/month

Azure FarmBeats deployment creates the below listed resources within your subscription:

|S.No  |Resource Name  |Azure FarmBeats Component  |
|---------|---------|---------|
|1  |       Azure Cosmos DB   |  Data hub       |
|2  |    Application Insights      |     Data hub/Accelerator     |
|3  |Azure Cache for Redis   |Data hub   |
|4  |       Azure KeyVault    |  Data hub/ Accelerator        |
|5  |    Time Series Insights       |     Data hub      |
|6 |      EventHub Namespace    |  Data hub       |
|7  |    Azure Data Factory V2       |     Data hub/ Accelerator      |
|8  |Batch account    |Data hub   |
|9  |       Storage account     |  Data hub/ Accelerator        |
|10  |    Logic app        |     Data hub      |
|11  |    API connection        |     Data hub      |
|12|      App service      |  Data hub/Accelerator       |
|13 |    App service plan        |     Data hub/ Accelerator      |
|14 |Azure Maps account     |Accelerator    |
|15 |       Time Series Insights      |  Data hub     |

Azure FarmBeats is available for you to download from the Azure Marketplace. You can access it directly from Azure portal.  

## Prepare

Access permission you require on Azure portal for deploying Azure FarmBeats:

-	Tenant: Read Access
- Subscription: contributor to owner
-	Resource group: owner

Before initiating the deployment, ensure you've the following ready:

- Sentinel account
- Azure Active Directory (app registration)
- Azure FarmBeats

## Create a sentinel account    

An account with Sentinel helps you to download the Sentinel Satellite imagery from their official website to your device. Follow these steps to create a free account:

1. Go to https://scihub.copernicus.eu/dhus/#/self-registration

   - In the registration page, provide a First Name, Last name, Username, Password, and Email

2. In the **Select Domain** drop-down menu, select the option **Land**.

3. In the **Select Usage** drop-down menu, select the option **Education**.

4. In the **Select Country** drop-down menu, select your **Country**.

5. Select **Register** to complete the registration process.

A verification email will be sent to the registered email address for confirmation. Select the link and confirm. Your registration process is complete.


## Create Azure Active Directory (AAD) app registration

For authentication and authorization on Azure FarmBeats, you must have an Azure active directory application registration which:

- Case 1: Installer can create automatically (provided you have the required tenant, subscription, and resource group access permissions)
- Case 2: You can create and configure before deploying Azure FarmBeats (requires manual steps).

**For Case 1**: The installer assumes that you have the rights to create an Azure active directory application registration within the desired subscription. You can try this case by creating a test AAD app registration (Sign in to portal >> Azure active directory >> app registration >> New registration). If yes, you can directly move to the next segment- marketplace offer creation.


**For Case 2**: This method is the preferred step when you don't have enough rights to create and configure an AAD app registration within your subscription. Request your IT admin to use the custom script is available [here](https://aka.ms/Create_AAD_App_Powershell_Script), which will help them automatically generate and configure the AAD app registration on the Azure portal. As an output to
running this custom script using PowerShell environment the IT admin will need to share an Azure Active Directory Application Client ID and password secret with you. Make a note of these values in a notepad file.

Use the following steps to run the AAD application registration script:

1. Get the registration script [here](https://aka.ms/PPCreateAADappregistration).

2. Sign in to Azure portal and select your subscription and AD tenant.

3. Launch Cloud Shell from the top navigation of the Azure portal.

    ![Project Farm Beats](./media/prepare-for-deployment/navigation-bar.png)


4. First-time users will be prompted to select a subscription to create a storage account and Microsoft Azure Files share. Select **Create storage**.

5. First time will be prompted with a choice of preferred shell experience- Bash or Power Shell.Choose PowerShell.

6. In Cloud Shell enter the below commands to run the script.

   ![Project Farm Beats](./media/prepare-for-deployment/command-line.png)

7. Make note of the AAD application ID and client secret to share with the person deploying Azure FarmBeats.

## Create Azure FarmBeats offer on marketplace

Use these steps to create Azure FarmBeats offer on the marketplace:


1. Sign in to the **Azure portal** and select your account in the top-right corner, and switch to
   the Azure AD tenant where you want to deploy Microsoft Azure FarmBeats.

2. Select **Search/Marketplace** or **Create Resources**. Ttype **FarmBeats** to view the offer details. Download the guides available via aka.ms hyperlinks at this page before proceeding to the next steps.

3. Select **CREATE** and enter the following information:

   - Enter Subscription name.
   - Enter an existing Resource group name (empty resource group only) or create a new resource group for deploying Azure FarmBeats. Make note of this resource group to enter within the input.json file at a later stage.
   - Enter the Region you want to install Azure FarmBeats into.


  **Location**: Central US, West Europe, East US 2, North Europe, West US, Southeast Asia, East US, Australia East, West US 2.


  ![Project Farm Beats](./media/prepare-for-deployment/create-farm-beats-on-market-place.png)

1. Select **OK**, which redirects you to the Terms of use page. Review the standard marketplace terms or review the Azure FarmBeats specific Terms of Use hyperlink.

2. Select **Close**, then the "I agree" checkbox and then select **Create**.

3. You have now successfully signed Azure FarmBeats's End-user License agreement (EULA) on the marketplace. To continue with the deployment, follow the next steps in this guide.


## Deploy

This article describes Azure FarmBeats deploy process.


### Prepare Input.Json file

This file is your input file to Azure Cloud Shell and parameters whose values are specified within this file before uploading aren't prompted during deployment, therefore saving you some time.  

> [!NOTE]
> Parameters you miss to provide a value for within input.json will be prompted during deployment.


Below are the parameters you need to get familiar with for preparing your input.json file:

|Command | Description|
|--- | ---|
|“sku”  | Provides a choice to download either or both the components of Azure FarmBeats. Enter "**onlydatabhub**" for installing Data hub. Enter "**both**" for installing Datahub+Accelerator SKU|
|“subscriptionId”  | Azure portal Subscription ID within which product needs to be deployed into.|
|“datahubResourceGroup”  | Enter the Resource group name for Data hub resources.|
|“datahubLocation” | Enter the location where you would like to store the Data hub resources.|
|“acceleratorWebsiteName”  |Enter the unique URL prefix to name your Data hub swagger website. The default is data hub resource group name. Press enter to continue with the default value.|
|“acceleratorResourceGroup”  | Enter the Resource group name for Data hub resources. |
|“acceleratorLocation”  | Enter the location to for storing the Data hub resources

“acceleratorWebsiteName”  | Enter the unique URL prefix to name your Accelerator website. The default is accelerator resource group name. Press enter to continue with the default value.|
|''sentinelUsername'' | User name to sign into: https://scihub.copernicus.eu/dhus/#/self-registration.|
|“sentinelPassword”  | Password to sign into: https://scihub.copernicus.eu/dhus/#/self-registration.|
|“farmbeatsAppId"  | Values to be shared by Team Azure FarmBeats.  |
|"farmbeatsPassword"  | Values to be shared by Team Azure FarmBeats.|
|“notificationEmailAddress”  | Enter an email address to receive the notifications for any alerts that you configure within Data hub.|
|“upda"aadAppClientId" "  |V[Optional] Parameter to be included within Input.Json only if AAD app already exists.  - True/False. False for a first-time installation and True for Upgrade scenario.|
|"aadAppClientId"  | [**Optional**] Parameter to be included within Input.Json only if AAD app already exists.  |
|"aadAppClientSecret"   | [Optional] Parameter to be included within Input.Json only if AAD app already exists.|

aad- Azure Active Directory

Sample Json input:

```json
{  
   "sku":"both", 
   "subscriptionId": "da9xxxec-dxxf-4xxc-xxx21-xxx3ee7xxxxx", 
   "datahubResourceGroup": "dummy-test-dh1", 
   "datahubLocation": "westus2", 
   "datahubWebsiteName": "dummy-test-dh1", 
   "acceleratorResourceGroup": "dummy-test-acc1", 
   "acceleratorLocation": "westus2", 
   "acceleratorWebsiteName": "dummy-test-acc1", 
   "sentinelUsername": "dummy-dev", 
   "farmbeatsAppId": "c3cb3xxx-27xx-4xxb-8xx6-3xxx2xxdxxx5c", 
   "notificationEmailAddress": "dummy@microsoft.com", 
   "updateIfExists": true
}
```
 
## Deploy within Cloud Shell (browser-based command line)

As part of the marketplace workflow you've created one Resource Group and signed the End-user
License Agreement, which can be reviewed once again as part of the actual deployment. The deployment
will be done via Azure Cloud Shell (Browser-based command line) using Bash environment.  

> [!NOTE]
> Cloud Shell session expires in case of inactivity for more than 20 minutes. Make sure to complete
> the below deployment at a time.

1. Sign into **Azure** portal and select the desired subscription and AD tenant.

2. Launch **Cloud Shell** from the top navigation of the **Azure** portal.

   ![Project Farm Beats](./media/deploy-within-cloudshell/navigation-bar.png)

3. Select a subscription to create a storage account and Microsoft Azure Files share.

4. Select **Create storage**.

5. Select the environment drop-down from the left-hand side of shell window, which says **Bash**.


   ![Project Farm Beats](./media/deploy-within-cloudshell/bash-1.png)

#### Deployment scenario 1- Installer creates the AAD (you have AD tenant read permissions)  

Download the input json file from this link: https://aka.ms/PPInputJsonTemplate:

![Project Farm Beats](./media/deploy-within-cloudshell/deploy-scenario-1.png)

1. Open the downloaded file in a notepad and pPopulate the file by entering the values.

> [!NOTE]
> You can skip this step and the inputs will prompt at run-time.

2. Save the file and make a note of the path (on your local computer).  

3. Go to Azure Cloud Shell and once again you're successfully authenticated, select the upload button (see highlighted icon in below snip) and upload the input.json file to Cloud Shellstorage. You need not pass the Azure Active Directory (AAD) parameter within the json as installer will be creating and configuring the AAD app registration for you.

   ![Project Farm Beats](./media/deploy-within-cloudshell/bash-2.png)

4. Type or paste the “Deployment Command” into the Cloud Shell. Make sure to modify the path to input. Json file and press enter.  

   ![Project Farm Beats](./media/deploy-within-cloudshell/deploy-screnario-1-1.png)

   The script automatically downloads all dependencies, builds the deployer. Then you'll be prompted to agree to Azure FarmBeats End-user license agreement (ELUA)

    ![Project Farm Beats](./media/deploy-within-cloudshell/bash-1.png)

#### Deployment scenario 1- Installer creates the AAD (you have AD tenant read permissions)  

  Download the input json file from this [link](https://aka.ms/PPInputJsonTemplate)


  ```
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

  "updateIfExists":true
  }

  ```


  1. Open the downloaded file in a notepad and populate the file by entering the values.

  >[!NOTE]
  > You can skip this step and the inputs will prompt at run-time.

  2. Save the file and make a note of the path (on your local computer).    
  3. Go to Azure CloudShell and once again you are successfully authenticated, click **Upload** (see highlighted icon in below screen) and upload the input.json file to Cloudshell storage. You need not pass the Azure Active Directory (AAD) parameter within the json as installer will be creating and configuring the AAD app registration for you.

    ![Project Farm Beats](./media/deploy-within-cloudshell/bash-2.png)

  4. Type or paste the “Deployment Command” into the CloudShell. Make sure to modify the path to input. Json file and press enter.  

```
wget -N -O farmbeats-installer.sh https://aka.ms/AzureFarmbeatsInstallerScript

```

  The script automatically downloads all dependencies, builds the deployer.

  Then you will be prompted to agree to Azure FarmBeats End-user license agreement (ELUA)
        - Enter ‘Y’ if you agree and you will proceed to the next step.
        - Enter ‘N’ if you do not agree to the terms and the deployment will terminate.

  Then you will be prompted to enter an access token for the deployment. Copy the code generated and login to https://microsoft.com/devicelogin with your Azure credentials

> [!NOTE]
>This code will expire in the next 60 minutes. If so, you can restart by typing the “Deployment command” again.

  5.	On the next prompt, enter Sentinel password
      - Azure FarmBeats App password
  6.	The installer will now validate and start creating the , which can take about 20 minutes.
  7.	Once the deployment goes through successfully, you will receive the below output links:
    - Data hub URL: Swagger link to try Azure FarmBeats APIs
    - Accelerator URL: User Interface to explore Azure FarmBeats Smart Farm Accelerator.
    - Deployer log file- saves logs during deployment and can be used for troubleshooting.

   - Enter 'Y' if you agree and you'll continue to the next step.
   - Enter 'N' if you don't agree to the terms and the deployment will terminate.

   Then you'll be prompted to enter an access token for the deployment. Copy the code generated and
   sign in to https://microsoft.com/devicelogin with your Azure credentials.

   > [!NOTE]
   > This code will expire in the next 60 minutes. If so, you can restart by typing the "Deployment
   > command" again.

1. On the next prompt, enter Sentinel password

   - FarmBeats App password

2. The installer will now validate and start creating the resources, which can take about 20
   minutes.

3. Once the deployment goes through successfully, you'll receive the below output links:

   - Data hub URL: Swagger link to try FarmBeats APIs
   - Accelerator URL: User Interface to explore FarmBeats Smart Farm Accelerator.
   - Deployer log file- saves logs during deployment and can be used for troubleshooting.

   > [!NOTE]
   > Please make note of these and do keep the deployment log file path handy for later use.

#### Deployment scenario 2- Existing Azure Active Directory app registration used to deploy

1. Download input json from here: https://aka.ms/PPInputJsonTemplate
   Include the Azure Application Client ID and password within the input.json, save it.

   ![Project Farm Beats](./media/deploy-within-cloudshell/deploy-scenario-2.png)

2. Make note of the path to your input.json file (on your local computer).
3. Go to Azure Cloud Shell once again and once you're successfully authenticated, select the upload button (see highlighted icon in below snip) and upload the input.json file to Cloud Shell storage.


   ![Project Farm Beats](./media/deploy-within-cloudshell/bash-2.png)

4. Type or paste the *Deployment Command* into the Cloud Shell. Make sure to modify the path to input. Json file and press enter.

    ```
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

5.	Make note of the path to your input.json file (on your local computer).
6.	Go to Azure CloudShell once again and once you are successfully authenticated, click **Upload** (see highlighted icon in below snip) and upload the input.json file to     CloudShell  storage.

   ![Project Farm Beats](./media/deploy-within-cloudshell/deploy-screnario-1-1.png)

7. The script automatically downloads all dependencies, builds the deployer.


8. You'll be prompted to agree to the Azure FarmBeats End-user license agreement (EULA).

   - Enter 'Y' if you agree and you'll continue to the next step.
   - Enter 'N' if you don't agree to the terms and the deployment will terminate.

9. You'll be prompted to enter an access token for the deployment. Copy the code generated and sign
   in to https://microsoft.com/devicelogin with your Azure credentials.

```
wget -N -O farmbeats-installer.sh https://aka.ms/AzureFarmbeatsInstallerScript

```
  > [!NOTE]
  > This code will expire in the next 60 minutes. If so, you can restart by typing the "Deployment > command" again.

10. The installer will now validate and start creating the resources, which can take about 20  minutes. (Please keep the session active on Cloud Shell during this time).

11. Once the deployment goes through successfully, you'll receive the below output links:


   - Data hub URL: Swagger link to try FarmBeats APIs
   - Accelerator URL: User Interface to explore FarmBeats Smart Farm Accelerator.
   - Deployer log file- saves logs during deployment and can be used for troubleshooting.


If you are facing any issues, visit [Troubleshoot](troubleshoot-project-farmbeats.md#deploying-azure-farmbeats) section.


## Validate deployment (Sanity testing)

### Data hub

Once the Data hub installation is complete, you'll receive the URL to access Azure FarmBeats APIs via Swagger interface in the format: <https://<datahub-website-name>.azurewebsites.net/>

1. To sign in via swagger, copy and paste the URL in the browser.

2. Sign in with Azure portal credentials used for the deployment.

3. Sanity test (Optional):

  - Able to successfully log in to the Swagger portal using the Data hub link, which you received as an output to a successful deployment.
  - Extended types Get API- Select "Try it out /Execute"
  - You should receive the server response Code 200 and not an exception such as 403 "unauthorized user".

### Accelerator

Once the Accelerator installation is complete, you'll receive the URL to access FarmBeats
User-Interface in the format: *<https://<accelerator-website-name>.azurewebsites.net/>*

1. To log in via accelerator, copy and paste the URL in the browser.
2. Sign in with Azure portal credentials
3. Sanity test (Optional):

  - Able to successfully sign in to the accelerator portal using the Accelerator link that you received as an output to a successful deployment.
  - Select **Create farm**
  - Under the icon "?" access the FarmBeats guides using the **Get started** button.


## Upgrade

The steps for upgrade are similar to the first-time installation as the following steps:

1. Sign in on Azure portal and select your desired subscription and AD tenant

2. Launch Cloud Shell from the top navigation of the Azure portal.

   ![Project Farm Beats](./media/deploy-within-cloudshell/navigation-bar.png)

3. Select a subscription to create a storage account and Microsoft Azure Files share.

4. Select **Create storage**.

5. Select the environment drop-down from the left-hand side of shell, which says Bash.

   ![Project Farm Beats](./media/deploy-within-cloudshell/bash-1.png)

6. Make changes to your input.json file only if needed and upload to the Azure Cloud Shell. For example, you can update your notification email address.

7. Make note of the path to your input.json file (on your local computer).


8. Go to Azure Cloud Shell once again and once you're successfully authenticated, select the upload button (see highlighted icon in below snip) and upload the input.json file to Cloud Shell storage.

   ![Project Farm Beats](./media/prepare-for-deployment/bash-2.png)

9. Type or paste the "Deployment Command" into the Cloud Shell. Make sure to modify the path to input. json file and press enter.

   > [!NOTE]
   > wget -N -O farmbeats-installer.sh https://aka.ms/FB_1.2.0 && bash farmbeats-installer.sh> /home/dummyuser/input.json

10. The Installer will automatically prompt the required inputs on run-time:

   - Enter an access token for deployment. Copy the code generated and login to
     https://microsoft.com/devicelogin with your Azure credentials.

     > [!NOTE]
     > This code will expire in the next 60 minutes. If so, you can restart by typing the
     > "Deployment command" again.

   - Sentinel password.

11. The installer will now validate and start creating the resources, which can take about ~20 minutes.

12. Once the deployment goes through successfully, you will receive the below output links:

   - Data hub URL: Swagger link to try FarmBeats APIs.
   - Accelerator URL: User Interface to explore FarmBeats Smart Farm Accelerator.
   - Deployer log file:  saves logs during deployment and can be used for troubleshooting.

  > [!NOTE]
  > Please make note of these and do keep the deployment log file path handy for later use.

## Uninstall

Currently we don't support automated uninstallation of FarmBeats via installer. To remove single or both components of FarmBeats that is Data hub Accelerator, you're required to visit Azure portal and delete the pertinent Resource groups and/or resources manually. Follow the steps to uninstall.

If you have deployed Data hub and Accelerator in two independent resource groups, follow the steps for uninstallation:


1. Sign into the Azure portal.

2. Select your account in the top-right corner, and switch to the desired Azure AD tenant where you want to deploy Microsoft FarmBeats.

   > [!NOTE]
   > As Data hub is the fundamental layer of FarmBeats which is required for Accelerator to operate properly, deleting Data hub alone will make Accelerator dis-functional and you will not be able to use the Accelerator alone any longer. Hence if you would like to continue using FarmBeats you are recommended to only uninstall Accelerator resource group.

3. On the left blade, select the Resource groups option and now type in the name of your desired Data hub/Accelerator resource group, which you would like to remove.

4. Select the resource group name, which will open another blade containing the option of Delete resource group. Since deletion is a two-step process on Azure to prevent any mistakes, you'll be required to type the name of the resource group again for certainty.

1. Select **Delete** to remove the resource group and all the underlying resources all at once.

5. Alternatively, you can delete each resource manually, which can be cumbersome, and we strongly advise against it.

6. Similarly, to delete/uninstall Data hub you can go to the Resource group directly on Azure and delete the resource group from there.


## Next steps


For information on how to create farms, see [create farms](manage-farms.md#create-farms).

Now that you have deployed Azure FarmBeats see how to create farms, see [create farms](manage-farms.md#create-farms) to get started
