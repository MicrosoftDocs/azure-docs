---
title: Prepare for Deployment
description: Describes how to deploy FarmBeats
author: uhabiba04
ms.topic: article
ms.date: 10/25/2019
ms.author: v-umha
ms.service: backup
---


# Prepare for Deployment - Azure FarmBeats

  This article describes how to set up Azure FarmBeats. FarmBeats is an industry-specific, extensible solution for data-driven farming that enables seamless provisioning and sensor devices connectivity to Azure cloud, telemetry data collection and aggregation from various sensors such as cameras, drones, soil sensors, and management of devices from the cloud which includes infrastructure and services in Azure for the IoT-ready (Internet of Things) devices to an extendible web and mobile app to provide visualization, alerts and insights.

  Azure FarmBeats has the following two components:

  1. **Datahub** - Datahub is the platform layer of Azure FarmBeats that lets you build, store, process data and draw insights from existing or new data pipelines. This platform layer is useful to run and build your agriculture data pipelines and models.
  2. **Accelerator** - Accelerator is the solution layer of FarmBeats that has built-in application to illustrate the capabilities of FarmBeats using the pre-created agriculture models. This solution layer lets you create farm boundaries and draw insights from the agriculture data within the context of the farm boundary.

  Following is the duration of the time and expenses to deploy FarmBeats:

  1. Time required to deploy Azure FarmBeats- 30 minutes1. Time required to deploy Azure FarmBeats- 30 minutes
  2. Cost of a deployment: The overall cost incurred for FarmBeats product will vary based on the usage, but the steady state cost is approximately:

    -	Datahub: $500/month
    - Accelerator: $100/month

    Azure FarmBeats deployment creates the below listed resources within your subscription:

|S.No  |Resource Name  |FarmBeats Component  |
|---------|---------|---------|
|1  |       Azure Cosmos DB   |  Datahub       |
|2  |    Application Insights      |     Datahub/Accelerator     |
|3  |Azure Cache for Redis   |Datahub   |
|4  |       Azure KeyVault    |  Datahub/ Accelerator        |
|5  |    Time Series Insights       |     Datahub      |
|6 |      EventHub Namespace    |  Datahub       |
|7  |    Azure Data Factory V2       |     Datahub/ Accelerator      |
|8  |Batch account    |Datahub   |
|9  |       Storage account     |  Datahub/ Accelerator        |
|10  |    Logic app        |     Datahub      |
|11  |    API connection        |     Datahub      |
|12|      App service      |  Datahub/Accelerator       |
|13 |    App service plan        |     Datahub/ Accelerator      |
|14 |Azure Maps account     |Accelerator    |
|15 |       Time Series Insights      |  Datahub     |

  Azure FarmBeats is available for you to download from the Azure Marketplace. You can access it directly from Azure portal.  

## Prepare

  Access permission you require on Azure portal for deploying Azure FarmBeats:
  -	Tenant: Read Access
  - Subscription: contributor to owner
  -	Resource group: owner

  Before initiating the deployment, ensure you have the following ready:

  1. Sentinel account
  2. Azure Active Directory (app registration)
  3. Azure FarmBeats


## Create a sentinel account    

  An account with Sentinel  helps you to download the Sentinel Satellite imagery from their official website to your device. Follow these steps to create a free account:

  1. Go to https://scihub.copernicus.eu/dhus/#/self-registration
    - In the registration page, provide a First Name, Last name, Username, Password, and Email

  2.  In the **Select Domain** drop-down menu, select the option **Land**.
  3.	In the **Select Usage** drop-down menu, select the option **Education**.
  4.	In the **Select Country** drop-down menu, select your **Country**.
  5.	Select **Register** to complete the registration process.

A verification email will be sent to the registered email address for confirmation. Click the link and confirm. Your registration process is complete.


## Create Azure Active Directory (AAD) app registration
  For authentication and authorization on Azure FarmBeats, you must have an Azure active directory app registration which:

  - Case 1: Installer can create automatically (provided you have the required tenant, subscription and resource group access permissions)
  - Case 2: You can create and configure before deploying Azure FarmBeats (requires manual steps).

  **For Case 1**: The installer assumes that you have the rights to create an Azure active directory application registration within the desired subscription. You can try this by creating a test AAD app registration (Login to portal >> Azure active directory >> app registration >> New registration). If yes, you can directly move to the next segment- marketplace offer creation.

  **For Case 2**: This is a preferred step when you do not have enough rights to create and configure an AAD app registration within your subscription. Request your IT admin to use the custom script available at this link: https://aka.ms/PPCreateAADappregistration  which will help him/her automatically generate and configure the AAD app registration on the Azure portal. As an output to running this custom script using PowerShell environment the IT admin will need to share an Azure Active Directory Application Client ID and password secret with you. Make a note of these in a notepad file.

  Use the following steps to run the AAD application registration script:

  1.	Click this link: https://aka.ms/PPCreateAADappregistration.
  2.	Sign in on Azure portal and login to your desired subscription and AD tenant.
  3.	Launch CloudShell from the top navigation of the Azure portal.

      ![Project Farm Beats](./media/prepare-for-deployment/navigation-bar.png)

  4.	First-time users will be prompted to select a subscription to create a storage account and Microsoft Azure Files share. Select **Create storage**.
  5.	First-time will be prompted with a choice of preferred shell experience- Bash or Power Shell. Choose PowerShell.
  6.	In CloudShell enter the below commands to run the script.

      ![Project Farm Beats](./media/prepare-for-deployment/command-line.png)
  7.	Make note of the AAD application ID and client secret to share with the person deploying Azure FarmBeats.

## Create Azure FarmBeats offer on marketplace

  Use these steps to create Azure FarmBeats offer on the marketplace:

  1. Sign in to the **Azure portal** and select your account in the top-right corner, and switch to the desired Azure AD tenant where you want to deploy Microsoft FarmBeats.
  2. Click **Search/Marketplace** or click **Create Resources**/type **FarmBeats** to view the offer details. Download the guides available via aka.ms hyperlinks at this page before proceeding to the next steps.
  3.	Click **CREATE** and enter the following information:
    - Enter Subscription name.
    - Enter an existing Resource group name (empty resource group only) or create a new resource group for deploying Azure FarmBeats. Make note of this resource group to enter within the input.json file at a later stage.
    - Enter the Region you want to install FarmBeats into.

  |  | location |
  |--- | ---|
  | | Central US, West Europe, East US 2, North Europe, West US, Southeast Asia, East US, Australia East, West US 2. |

  	  ![Project Farm Beats](./media/prepare-for-deployment/create-farm-beats-on-market-place.png)

3. Click **OK** which will redirect you to the Terms of use page. Review the standard marketplace terms or click  FarmBeats specific Terms of use hyperlink.
5. Select **Close**, click the ‘I agree’ checkbox and then select **Create**.
6. You have now successfully signed Azure FarmBeats’s End-user License agreement (EULA) on the marketplace. To proceed with the deployment, continue to read this guide.


## Deploy

### Prepare Input.Json file

  This will be your input file to Azure Cloudshell and parameters whose values are specified within this file before uploading will not be prompted during deployment, therefore saving you some time.  

  > [!NOTE]
  >Parameters you miss to provide a value for within input.json will be prompted during deployment.


  Below are the parameters you need to get familiar with for preparing your input.json file:

|Command | Description|
|--- | ---|
|“sku”  | Provides a choice to download either or both the components of FarmBeats. Enter "**onlydatabhub**" for installing Datahub. Enter "**both**" for installing Datahub+Accelerator SKU|
|“subscriptionId”  | Azure portal Subscription ID within which product needs to be deployed into.|
|“datahubResourceGroup”  | Enter the Resource group name for Datahub resources.|
|“datahubLocation” | Enter the location where you would like to store the Datahub resources.|
|“acceleratorWebsiteName”  |Enter the unique URL prefix to name your Datahub swagger website. The default is datahub resource group name. Press enter to proceed with the default value.|
|“acceleratorResourceGroup”  | Enter the Resource group name for Datahub resources. |
|“acceleratorLocation”  | Enter the location to for storing the Datahub resources
“acceleratorWebsiteName”  | Enter the unique URL prefix to name your Accelerator website. The default is accelerator resource group name. Press enter to proceed with the default value.|
|''sentinelUsername'' | User name to login into: https://scihub.copernicus.eu/dhus/#/self-registration.|
|“sentinelPassword”  | Password to login into: https://scihub.copernicus.eu/dhus/#/self-registration.|
|“farmbeatsAppId"  | Values to be shared by Team FarmBeats.  |
|"farmbeatsPassword"  | Values to be shared by Team FarmBeats.|
|“notificationEmailAddress”  | Enter an email address, which will receive the notifications for any alerts which you will configure within Datahub.|
|“upda"aadAppClientId" "  |V[Optional] Parameter to be included within Input.Json only if AAD app already exists.  - True/False. False for a first-time installation and True for Upgrade scenario.|
|"aadAppClientId"  | [**Optional**] Parameter to be included within Input.Json only if AAD app already exists.  |
|"aadAppClientSecret"   | [Optional] Parameter to be included within Input.Json only if AAD app already exists.|


```
*aad- Azure Active Directory
Sample Json input
{  
   "sku":"both", 
   "subscriptionId":"da9xxxec-dxxf-4xxc-xxx21-xxx3ee7xxxxx", 
   "datahubResourceGroup":"dummy-test-dh1", 
   "datahubLocation":"westus2", 
   "datahubWebsiteName":"dummy-test-dh1", 
   "acceleratorResourceGroup":" dummy-test-acc1", 
   "acceleratorLocation":"westus2", 
   "acceleratorWebsiteName":" dummy-test-acc1", 
   "sentinelUsername":"dummy-dev", 
   "farmbeatsAppId":"c3cb3xxx-27xx-4xxb-8xx6-3xxx2xxdxxx5c", 
   "notificationEmailAddress":" dummy@microsoft.com", 
   "updateIfExists":true*

```
 
## Deploy within Cloudshell (browser-based command line)

  As part of the marketplace workflow you have created one Resource Group and signed the End-user License Agreement, which can be reviewed once again as part of the actual deployment. The deployment will be done via Azure Cloudshell (Browser-based command line) using Bash environment.  

  > [!NOTE]
  >CloudShell session expires in case of inactivity for more than 20 minutes. Make sure to complete the below deployment at a time.


  1.	Sign into **Azure** portal and login to the desired subscription and AD tenant
  2.	Launch **Cloud Shell** from the top navigation of the **Azure** portal.

    ![Project Farm Beats](./media/deploy-with-in-cloudshell/navigation-bar.png)

  3.	Select a subscription to create a storage account and Microsoft Azure Files share.
  4.	Select **Create storage**.
  5.	Select the environment drop-down from the left-hand side of shell window, which says **Bash**.

      ![Project Farm Beats](./media/deploy-with-in-cloudshell/bash-1.png)

#### Deployment scenario 1- Installer creates the AAD (you have AD tenant read permissions)  

    Download the input json file from this link: https://aka.ms/PPInputJsonTemplate:

    ![Project Farm Beats](./media/deploy-with-in-cloudshell/deploy-scenario-1.png)

    1. Open the downloaded file in a notepad and pPopulate the file by entering the values. Note: You can skip this step and the inputs will prompt at run-time.
    2. Save the file and make a note of the path (on your local computer).  
    3. Go to Azure CloudShell and once again you are successfully authenticated, click the upload button (see highlighted icon in below snip) and upload the input.json file to Cloudshell storage. You need not pass the Azure Active Directory (AAD) parameter within the json as installer will be creating and configuring the AAD app registration for you.

      ![Project Farm Beats](./media/deploy-with-in-cloudshell/bash-2.png)

    4. Type or paste the “Deployment Command” into the CloudShell. Make sure to modify the path to input. Json file and press enter.  

      ![Project Farm Beats](./media/deploy-with-in-cloudshell/deploy-screnario-1-1.png)

      The script automatically downloads all dependencies, builds the deployer.
      Then you will be prompted to agree to Azure FarmBeats End-user license agreement (ELUA)
        - Enter ‘Y’ if you agree and you will proceed to the next step.
        - Enter ‘N’ if you do not agree to the terms and the deployment will terminate.

      Then you will be prompted to enter an access token for the deployment. Copy the code generated and login to https://microsoft.com/devicelogin with your Azure credentials.
      > [!NOTE]
      >This code will expire in the next 60 minutes. If so, you can restart by typing the “Deployment command” again.

    5.	On the next prompt, enter Sentinel password
        - FarmBeats App password
    6.	The installer will now validate and start creating the , which can take about 20 minutes.
    7.	Once the deployment goes through successfully, you will receive the below output links:
      - Datahub URL: Swagger link to try FarmBeats APIs
      - Accelerator URL: User Interface to explore FarmBeats Smart Farm Accelerator.
      - Deployer log file- saves logs during deployment and can be used for troubleshooting.

    > [!NOTE]
    > Please make note of these and do keep the deployment log file path handy for later use.

#### Deployment scenario 2- Existing Azure Active Directory app registration used to deploy

1.	Download input json from here: https://aka.ms/PPInputJsonTemplate
    Include the Azure Application Client ID and password within the input.json, save it.

    ![Project Farm Beats](./media/deploy-with-in-cloudshell/deploy-scenario-2.png)

2.	Make note of the path to your input.json file (on your local computer).
3.	Go to Azure CloudShell once again and once you are successfully authenticated, click the upload button (see highlighted icon in below snip) and upload the input.json file to     CloudShell  storage.

  ![Project Farm Beats](./media/deploy-with-in-cloudshell/bash-2.png)

4.	Type or paste the *Deployment Command* into the CloudShell. Make sure to modify the path to input. Json file and press enter.

  ![Project Farm Beats](./media/deploy-with-in-cloudshell/deploy-screnario-1-1.png)

5.	The script automatically downloads all dependencies, builds the deployer.
6.	You will be prompted to agree to the Azure FarmBeats End-user license agreement (EULA).
  - Enter ‘Y’ if you agree and you will proceed to the next step.
  - Enter ‘N’ if you do not agree to the terms and the deployment will terminate.
7.	You will be prompted to enter an access token for the deployment. Copy the code generated and login to https://microsoft.com/devicelogin with your Azure credentials.

  > [!NOTE]
  >This code will expire in the next 60 minutes. If so, you can restart by typing the “Deployment command” again.

6.	The installer will now validate and start creating the resources which can take about 20 minutes. (Please keep the session active on Cloudshell during this time).
7.	Once the deployment goes through successfully you will receive the below output links:
   - Datahub URL: Swagger link to try FarmBeats APIs
   - Accelerator URL: User Interface to explore FarmBeats Smart Farm Accelerator.
   - Deployer log file- saves logs during deployment and can be used for troubleshooting.

### Troubleshoot

 If you are facing challenges during the installation of Azure FarmBeats, refer to the below list of commonly known issues and their resolution to troubleshoot at your end. In case if you need further help write to us at farmbeatssupport@microsoft.com (add a link awaiting inputs) include deployer.log file on this email.

 **Downloade the deployer.log file**

 1.	Click the below highlighted icon and click **Download** option from the drop-down.

    ![Project Farm Beats](./media/prepare-for-deployment/bash-2.png)

2.	On the next screen enter the path to your deployer.log file. For example farmbeats-deployer.log.

**Commonly known issues**

**Azure Active Directory related issues:**

**Error**: Could not update required settings to AAD App d41axx40-xx21-4fbd-8xxf-97xxx9e2xxc0: Insufficient privileges to complete the operation... Please ensure that above settings are configured properly for the AAD App.

**Meaning**: The AAD app registration configuration didn’t happen properly.

**Corrective action**: Ask the IT administrator (having tenant read access) to use the script here: https://aka.ms/PPCreateAADappregistration for generating the Azure Active Directory application registration. This script will automatically take care of the configuration steps.

**Error**: Could not create new Active Directory Application “dummyname” in this tenant: Another object with the same value for property identifier URIs already exists

**Meaning**: AAD application registration with the same name already exists.

**Corrective action**: Delete the existing AAD application registration or reuse it for installation. If you are reusing the existing AAD please pass the Application ID and client secret to the installer and redeploy.

**Batch related issues**:

**Error**: The regional account quota of Batch Accounts for the specified subscription has been reached.

**Meaning**: Increase the quota or delete unused batch accounts and re-run the deployment.

**Corrective action**: Try using a new region which has batch availability or delete unused batch accounts and then redeploy.

**Azure permissions related issues**:

**Error**: You do not have permission to assign Contributor role to e709bc39-3fb9-4705-93c7-1d83920a96a0 at scope: /subscriptions/da9091ec-d18f-456c-9c21-5783ee7f4645/resourceGroups/dips-test-dh1. Please ensure that you are an owner of the Datahub and Accelerator Resource Group(s).

**Meaning**: You might not have enough permission at Azure tenant, subscription or resource group level.

**Correction action**: The above issue arises as you do not have permission to create resource groups. You can request subscription owner to create resource groups and grant you owner access for these. Try deploying again.

**ResourceManager related issues**:

**Error**: Long running operation failed with error: "Invalid status code with response body
```
"{"error":{"code":"ExpiredAuthenticationToken","message":"The access token expiry UTC time '10/23/2019 3:54:29 PM' is earlier than current UTC time '10/23/2019 3:54:44 PM'."}}" occurred when polling for operation status.".

**Corrective action**: This issue happens when the resource manager hangs during the deployment.
```

1.	Cancel the deployment
Go to your resource group > Deployments > select deployment (resource-group-name)-datahub > Cancel
2.	Run the installe again

**input.json related issues**:

**Error**: Error reading input from input.json file

**Corrective action**: This issue mostly arises due to miss in specifying the correct input json path or name to the installer. Make appropriate corrections and retry redeploying.

**Error**: Error parsing json input.

**Corrective action**: This issue mostly arises due to incorrect values within the input json file. Reevaluate your input json file and correct values or syntax of this file as necessary. Retry deploying.

**Login related issues**:

**Error**: Entry not found in cache.

**Corrective action**: In this case, run the installer again and when it asks you to login, open the login url - https://microsoft.com/devicelogin
, add a property “domainId” in your input json file and set its value to the domain/tenant ID which you will use for this deployment. The interactive login attempts to authenticate you into all the tenants you have access to, specifying the domainId will authenticate you into only that domain.

**Error**: You get an email alert referring to High CPU Usage Alert.

**Corrective Action**:

1.	Go to your FarmBeats Datahub Resource Group.
2.	Click the App service.  
3.	Go to Scale up (App Service plan) and select an appropriate pricing tier  
	(Refer: https://azure.microsoft.com/en-us/pricing/details/app-service/windows/ )



## Validate deployment (Sanity testing)

### Datahub

Once the Datahub installation is complete, you will receive the URL to access FarmBeats APIs via Swagger interface in the format: <https://<datahub-website-name>.azurewebsites.net/>
1. To login via swagger, copy and paste the URL in the browser.
2.	Login with Azure portal credentials used for the deployment.
3.	Sanity test (Optional):
  - Able to successfully login to the Swagger portal using the Datahub link, which you received as an output to a successful deployment.
  - Extended types Get API- Click “Try it out /Execute”
        - You should receive the server response Code 200 and not an exception such as 403 “unauthorized user”.

### Accelerator

Once the Accelerator installation is complete you will receive the URL to access FarmBeats User-Interface in the format: <*https://<**accelerator-website-name**>.azurewebsites.net/*>
1. To login via accelerator, copy and paste the URL in the browser.
2. Login with Azure portal credentials
3. Sanity test (Optional):
  - Able to successfully login to the accelerator portal using the Accelerator link which you received as an output to a successful deployment.
  - Click **Create farm**
  - Under the icon “?” access the FarmBeats guides using the **Get started** button.


## Post deployment

### Configure O365connector in Azure portal

**Adding users to your deployment**


Now that you have access to a fully functional FarmBeats Datahub and/or Accelerator you can grant access to more people to try this platform out. While we are working towards providing application support for adding more users, you can still use the Datahub for adding as many users as you’d like. Steps outlined below will help you in doing so:

Before you add a user, you need their Azure AD Object ID and Azure tenant ID below steps will help you on how you can access these from the Azure portal:

1.	Sign in on Azure portal
2.	Select your account in the top-right corner, and switch to the desired Azure AD tenant where you want to deploy Microsoft FarmBeats.  
3.	From the left blade on your screen click the Azure Active Directory:
  In **Users** tab, in the Search menu type the desired name and click it > *Profile > Identity > Object ID* (copy this ID)
  In **Properties** tab, under Directory Properties capture the Directory ID

### Add this object ID as a valid deployment user now:

1.	Login to your datahub swagger URL, which will look like the URL below:
<https://demo-farmbeats.azurewebsites.net/swagger/index.html>
2.	On the Datahub swagger page, you will be view Object models (7) and objects (15). Scroll down to go to object ‘Role, which will further expose APIs (4)- **Get, Post, Get, Delete**

Click the Get/ RoleAssignment for role assignments >> Click Try it out >> Click Execute >> scroll down to Responses

**Expected outcome** - The above steps will result in fetching all the assigned Roles by far active on this deployment. Under Server Response if you see Code 200- Success as an output you are on the right track and in Response Body you will see a list of IDs getting populated over a period of time as you will keep adding more users to your deployment.


```
{"roleDefinitionId": "a400a0xx-f67c-42b7-ba9a-f73d8c67e4xx",
      "objectId": "0714517d-eef4-4603-xxe1-e190842cc7xx",
      "objectIdType": "UserID",
      "tenantId": "72f988xx-86f1-41af-91ab-2d7cd011dbxx"
    }
```
3.	Copy the input between the curly brackets { } and make a note of this in your notepad.
4.	Modify this input string by inputting your captured Azure AD Object ID and Tenant ID in this input string

```
{"roleDefinitionId": "a400a0xx-f67c-42b7-ba9a-f73d8c67e4xx",
      "objectId": "0714517d-eef4-4603-xxe1-e190842cc7xx",
      "objectIdType": "UserID",
      "tenantId": "72f988xx-86f1-41af-91ab-2d7cd011dbxx"
    }

```
5.	click the Post/ RoleAssignment for creating a new user within your deployment >> click *Try it out >> Input-Description: Paste the modified input string from the above table >> click Execute >> scroll down to Responses*

**Expected outcome**: Code 200- Success will indicate the API request went well. You can again repeat Step 3- Get/ Role Assignment and input your Object ID to view if the user was added successfully to the deployment or not.

## Enable Partner (Sensor/Imagery) Integration

To enable partner integration for Sensor or Imagery data, you need to provide your partner with the following values/credentials from your FarmBeats instance:
1. API Endpoint (Your datahub url)
2. Tenant ID
3. Client ID
4. Client Secret
5. EventHub Connection String (applicable only for Sensor partner)

Please follow the following steps to generate the above values.

1.	Download **this script** and extract it in on your local drive. You will find two files inside this zip.
2.	Sign in to https://portal.azure.com/ and open Cloud Shell (This option is available on the top right bar of the portal)

  ![Project Farm Beats](./media/prepare-for-deployment/navigation-bar.png)

3.	Ensure the environment is set to “Power Shell” - Sometimes by default it is set to Bash.
4.	Upload the 2 files (from step 1 above) in your Cloud Shell.
5.	Go to the directory where the files were uploaded (Usually it gets uploaded to the home directory - /home<username>)
6.	Run the script by writing the following command:
  ./generateCredentials.ps1
7.	Follow the onscreen instructions.


## Upgrade

The steps for upgrade are similar to the first-time installation as the following:

1.	Sign in on Azure portal and login to your desired subscription and AD tenant
2.	Launch Cloud Shell from the top navigation of the Azure portal.

  ![Project Farm Beats](./media/deploy-with-in-cloudshell/navigation-bar.png)

3.	Select a subscription to create a storage account and Microsoft Azure Files share.
4.	Select **Create storage**.
5.	Select the environment drop-down from the left-hand side of shell, which says Bash.

  ![Project Farm Beats](./media/deploy-with-in-cloudshell/bash-1.png)

6.	Make changes to your input.json file only if needed and upload to the Azure CloudShell. For example- you can update your notification email address if required.
7. Make note of the path to your input.json file (on your local computer).
8.	Go to Azure CloudShell once again and once you are successfully authenticated, click the upload button (see highlighted icon in below snip) and upload the input.json file to CloudShell storage.

	![Project Farm Beats](./media/prepare-for-deployment/bash-2.png)

9.	Type or paste the “Deployment Command” into the Cloudshell. Make sure to modify the path to input. json file and press enter.

  > [!NOTE]
  > wget -N -O farmbeats-installer.sh https://aka.ms/FB_1.2.0 && bash farmbeats-installer.sh /home/dummyuser/input.json

10.	The Installer will automatically prompt the required inputs on run-time:
   - Enter an access token for deployment. Copy the code generated and login to https://microsoft.com/devicelogin with your Azure credentials.
(Important: This code will expire in the next 60 minutes. If so, you can restart by typing the “Deployment command” again.)
  - Sentinel password.
11.	The installer will now validate and start creating the resources which can take about ~20 minutes.
12.	Once the deployment goes through successfully you will receive the below output links:
  - Datahub URL: Swagger link to try FarmBeats APIs.
  - Accelerator URL: User Interface to explore FarmBeats Smart Farm Accelerator.
  - Deployer log file:  saves logs during deployment and can be used for troubleshooting.

> [!NOTE]
> Please make note of these and do keep the deployment log file path handy for later use.

## Uninstall

Currently we do not support automated uninstallation of FarmBeats via installer. To remove single or both components of FarmBeats that is Datahub Accelerator, you are required to visit Azure portal and delete the pertinent Resource groups and/or resources manually. Follow the steps to uninstall

If you have deployed Datahub and Accelerator in two independent resource groups, follow the steps for uninstallation:

1.	Sign into the Azure Portal.
2.	Select your account in the top-right corner, and switch to the desired Azure AD tenant where you want to deploy Microsoft FarmBeats.

> [!NOTE]
>As Datahub is the fundamental layer of FarmBeats which is required for Accelerator to operate properly, deleting Datahub alone will make Accelerator dis-functional and you will not be able to use the Accelerator alone any longer. Hence if you would like to continue using FarmBeats you are recommended to only uninstall Accelerator resource group.

3.	On the left blade, click to the Resource groups option and now type in the name of your desired Datahub/Accelerator resource group, which you would like to remove.
4.	Click the resource group name and this will open another blade containing the option of Delete resource group. Since deletion is a two-step process on Azure to prevent any mistakes, you will be required to type the name of the resource group again for certainty.
5.	Click Delete to remove the resource group and all the underlying resources all at once.
6.	Alternatively, you can delete each resource manually, which can be cumbersome, and we strongly advise against it.
7.	Similarly, to delete/uninstall Datahub you can go to the Resource group directly on Azure and delete the resource group from there.


## Next steps
