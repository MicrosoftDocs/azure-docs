---
title: "Starter Kit #1 - Scan data into Babylon"
description: This article describes how to scan data into your Babylon instance. 
author: viseshag
ms.author: viseshag
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 09/10/2020
# Customer intent: As a data steward or catalog administrator, I need to understand how to scan data into the catalog.
---

# Starter Kit #1 - Scan data into Babylon

The starter kit gives you a quick tour of how Babylon works and what it can do. To make it easy for you to experiment and explore, the starter kit creates a *simulated data estate* for you. The client-side code will:
* Create an Azure Blob storage account. 
* Populate that account with test data. 
* Create an Azure Data Lake Storage Gen2 account. 
* Create an Azure Data Factory instance. 
* Associate the Data Factory instance to Babylon. 
* Set up and trigger a copy activity pipeline between the Blob storage and Data Lake Storage Gen2 accounts. 
* Push the associated lineage from Data Factory to Babylon. 

After this infrastructure is created, the starter kit  then walks you through setting up scans on the Azure Blob storage and Data Lake Storage Gen2 accounts. This environment is reused through the rest of the tutorial.

![Daigram showing the Azure resources created by the starter kit.](./media/starter-kit-tutorial-1/image1.png)

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create a Babylon instance.
> * Have the right setup to complete this tutorial and the next tutorials in the series.
> * Scan data into a catalog.

> [!NOTE]
> If you're blocked at any point, send an email to BabylonDiscussion\@microsoft.com.

## Prerequisites

* The starter kit requires running client-side code
that works only on Windows. If this requirement prevents you from running the starter kit, contact
BabylonDiscussion\@microsoft.com.

* [Create a Babylon account](create-catalog-portal.md)

## Install and set up the starter kit

### What the starter kit client software does

Running the starter kit script does the following steps on your behalf:

1. Creates an Azure Data Factory account.
    {YourResourceGroupName}**adcfactory** is the name of the factory
    that will be created in your subscription.
1. Associates the newly created Azure Data Factory account to the Data Catalog
    instance whose name you passed in.
1. Creates an Azure Blob storage account. {YourResourceGroupName}**adcblob** is
    the name of the blob that's created in your subscription. The script then
    populates the new Blob storage account with simulated .tsv, .csv, .ssv, and .json data.
    The data is stored inside a folder structure with the form *yyyy/mm/dd/foo*.csv.
1. Creates an Azure Data Lake Storage Gen2 account. {YourResourceGroupName}**adcadls**
    is the name of the Data Lake Storage Gen2 account that will be created in your
    subscription.
1. Triggers a Data Factory copy activity in your newly created Azure Data Factory
    account to copy data from the newly created Blob storage account to the Data Lake Storage Gen2
    account.
1. Pushes the lineage associated with the copy activity into the
    catalog.

### Prepare your Windows machine to run the starter kit's client software

Use the following steps to set up the starter kit on your Windows machine:

1. [Download the .zip file](./Assets/starterKitV2.zip) that contains the starter kit to your computer under a local folder. Once you navigate to this link, select the **Download** button.

    ![The download screen](./media/starter-kit-tutorial-1/image8.png)
1. Extract the contents of the .zip file to a location of your choice. An example is C:\\CatalogStarterKit\\StarterKit.
1. Select the **Start** menu and type **PowerShell**. Right-click **Windows PowerShell** and select **Run as administrator**.

   ![Shortcut menu command for starting PowerShell in admin mode](./media/starter-kit-tutorial-1/image9.png)
1. In the PowerShell window, paste the following command and replace *{PathtoStarterKit}* with the folder path of the extracted file. Then select the Enter key.

   ```dir -Path "*\{PathtoStarterkit\}"* -Recurse | Unblock-File```

   For example:

   ```dir -Path C:\CatalogStarterKit\Starterkit -Recurse | Unblock-File```

1. In the PowerShell window, paste the following command and select the Enter key to install the Azure cmdlets.

   ```Install-Module -Name Az -AllowClobber -Scope CurrentUser```
1. If you get the prompt "NuGet provider is required to continue," type **Y** and select the Enter key.

   ![Example NuGet warning](./media/starter-kit-tutorial-1/image11.png)
1. If you get an "Untrusted repository" prompt, then type **A** and select the Enter key.

   ![Example of untrusted repository prompt](./media/starter-kit-tutorial-1/image12.png)

It might take up to a minute for PowerShell to install the
required modules. When that's done, you're ready to run the catalog
scripts documented in the next section.

## Run the starter kit script

### <a id="collecting-data" /> Collect the data needed to run the script
Before you run the PowerShell scripts to bootstrap the catalog,
use the following steps to get the values for arguments to be
used later in the script. 

Make a note of all these values in
Notepad or elsewhere.

- Tenant ID 
  - In the [Azure portal](https://portal.azure.com), select the hamburger ( ![hamburger icon](./media/starter-kit-tutorial-1/image13.png) ) menu in the upper-left corner, and then select **Azure Active Directory**. Scroll down to the **Manage** section, select **Properties**, and then select the copy icon ( ![copy icon](./media/starter-kit-tutorial-1/image14.png) ) for  **Directory ID**. That's your tenant ID. Save this value.
- SubscriptionId
  - Go to the [Azure portal](https://portal.azure.com). In the search bar, search for the name of the Babylon instance that you created, and select its entry in the search results. In the overview section, you'll see the GUID for the subscription ID. Make a note of the value.
  
    >[!NOTE]
    > Make sure you're using the same subscription as the one in which you created the catalog. This is the same subscription that we placed in the allow list for you.
- PathtoStarterKit
  - The Windows file folder path in which the starter kit's .zip file is downloaded and extracted.
- Data catalog name
  - The name of the Babylon account that you created in [Create a Babylon account](create-catalog-portal.md).
- ResourceGroup
  - Enter a new resource group name. Resource group names must be unique with your subscription, all lowercase, and made up of only A-Z and 0-9 characters.

> [!IMPORTANT]
> If your organization has a strict policy on naming resource groups (for example, it must contain special characters), override it or reach out to <BabylonDiscussion@microsoft.com> for a workaround.

### Make sure the person who is running the scripts has the right permissions on the catalog

> [!NOTE]
> If you created the Babylon account yourself, you're automatically an admin and at least an Azure contributor, so you can skip this section.

Make sure that the person running the
script is added as an admin to the Babylon account created in [Create a Babylon account](create-catalog-portal.md). 
Use the following steps to add them as an admin:

1. On the catalog home page, select the **Management Center** icon on the left. You can browse to the catalog home page via one of these methods:
   - Go to https://web.babylon.azure.com/resource/<Your Babylon's Name>.
   - Go to https://portal.azure.com, search for your Babylon's name, select the Babylon's name, and then select the **Launch babylon account** button. 
1. Select the **Access permissions** section in the Management Center.

   ![Add/Remove Administrators tab in the Management Center](./media/starter-kit-tutorial-1/image15.png)
1.  Select **Add** at the top of the page, select **Catalog administrator**, enter the name or email of the person you want to add, and then select **Apply**.

### Run the client-side setup scripts

After the catalog configuration is complete, run the scripts in this
section to create the assets.

1. __Go to the starter kit folder__: In the PowerShell window, paste the following command. Replace *{PathtoStarterKit}* with the folder path of the *extracted file*, and then select the Enter key. 

   ```
   cd *{PathtoStarterKit}*
   ```

1. __Allow yourself to run PowerShell scripts__: Run the following command to make sure you can run the PowerShell script: 
    
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted
   ```

1. __Connect to Azure__: Paste the following command in the
    PowerShell window, replace the *{TenantID}* and *{SubsID}* placeholders, and then press Enter. Be sure to connect to the same subscription as the one you created earlier for your catalog.

   ```powershell
   .\\RunStarterKit.ps1 -ConnectToAzure -TenantId {TenantID}
   -SubscriptionId {SubsID}
   ```

   You might be requested to sign in by using your Azure Active Directory credentials as follows:

   ![Microsoft authentication dialog box](./media/starter-kit-tutorial-1/image16.png)

1. __Ingest data__: Paste the following command in the PowerShell window. Replace the *{CatalogName}*, *{TenantID}*, *{SubsID}*, and *{NewResourceGroupName}* placeholders with the [previously collected values](#collecting-data). Running the command will run the starter kit.

   ```powershell
   .\\RunStarterKit.ps1 -CatalogName {CatalogName} -TenantId
   {TenantID} -SubscriptionId {SubsID} -ResourceGroup
   {NewResourceGroupName}
   ```

It can take up to 10 minutes for the environment to be set up. During this time, you might see various pop-up windows, but no further
action is required from you while the code is running. Be sure not to close the BlobDataCreator.exe
window until it finishes. When it finishes, the window automatically closes.

When you get the line "Executing Copy pipeline
xxxxxxxxxx-487e-4fc4-9628-92dd8c2c732b," wait for another
instance of BlobDataCreator.exe to start and finish running. This window
will automatically close when it's done.

After the process has finished, a resource group by the name you gave
while running the PowerShell command will have been created. The Azure Data Factory,
Blob storage, and Data Lake Storage Gen2 accounts will all be in this
resource group. The group will be contained in the specific subscription.

