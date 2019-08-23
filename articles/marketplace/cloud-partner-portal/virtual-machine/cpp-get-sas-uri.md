---
title: Get shared access signature URI for your Microsoft Azure-based VM image | Azure Marketplace
description: Explains how to get the shared access signature (SAS) URI for your VM image.
services: Azure, Marketplace, Cloud Partner Portal, 
author: pbutlerm
ms.service: marketplace
ms.topic: article
ms.date: 10/19/2018
ms.author: pabutler
---

# Get shared access signature URI for your VM image

During the publishing process, you must provide a uniform resource identifier (URI) for each virtual hard disk (VHD) associated with your SKUs. Microsoft needs access to these VHDs during the certification process. This article explains how to generate a shared access signature (SAS) URI for each VHD. You will enter this URI in the **SKUs** tab in the Cloud Partner Portal. 

When generating SAS URIs for your VHDs, adhere to the following requirements:

- Only unmanaged VHDs are supported.
- `List` and `Read`­ permissions are sufficient. Do *not* provide `Write` or `Delete` access.
- The duration for access (*expiry date*) should be a minimum of three weeks from when the SAS URI is created.
- To safeguard against UTC time variations, set the start date to one day before the current date. For example, if the current date is October 6, 2014, select 10/5/2014.

## Generate the SAS URL

The SAS URL can be generated in two common ways using the following tools:

-	Microsoft Storage Explorer - Graphical tool available for Windows, macOS, and Linux
-	Microsoft Azure CLI - Recommended for non-Windows OSs and automated or continuous integration environments


### Azure CLI

Use the following steps to generate a SAS URI with Azure CLI.

1. Download and install the [Microsoft Azure CLI](https://azure.microsoft.com/documentation/articles/xplat-cli-install/).  Versions are available for Windows, macOS, and various distros of Linux. 
2. Create a PowerShell file (`.ps1` file extension), copy in the following code, then save it locally.

   ``` powershell
   az storage container generate-sas --connection-string 'DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net' --name <vhd-name> --permissions rl --start '<start-date>' --expiry '<expiry-date>'
   ```
    
3. Edit the file to supply the following parameter values.  Dates should be provided in UTC datetime format, for example `10-25-2016T00:00:00Z`.
   - `<account-name>` - Your Azure storage account name
   - `<account-key>` - Your Azure storage account key
   - `<vhd-name>` - Your VHD name
   - `<start-date>` - Permission start date for VHD access. Provide a date one day before the current date. 
   - `<expiry-date>` - Permission expiration date for VHD access.  Provide a date at least three weeks beyond the current date. 
 
   The following example shows proper parameter values (at the time of this writing).

   ``` powershell
       az storage container generate-sas --connection-string 'DefaultEndpointsProtocol=https;AccountName=st00009;AccountKey=6L7OWFrlabs7Jn23OaR3rvY5RykpLCNHJhxsbn9ONc+bkCq9z/VNUPNYZRKoEV1FXSrvhqq3aMIDI7N3bSSvPg==;EndpointSuffix=core.windows.net' --name vhds --permissions rl --start '2017-11-06T00:00:00Z' --expiry '2018-08-20T00:00:00Z'
   ```
 
4. Save the changes to this PowerShell script.
5. Run this script, using administrative privileges, to generate a *SAS connection string* for container level access.  You can use two basic approaches:
   - Run the script from the console.  For example, in Windows, write-click on the script and select **Run as administrator**.
   - Run the script from a PowerShell script editor, such as the [Windows PowerShell ISE](https://docs.microsoft.com/powershell/scripting/core-powershell/ise/introducing-the-windows-powershell-ise), using administrative privileges. 
     The following demonstrates a SAS connection string being generated within this editor. 

     ![SAS URI generation in PowerShell ISE](./media/publishvm_032.png)

6. Copy the resulting SAS connection string and save it to a text file in a secure location.  You will edit this string to add the associated VHD location information to it to create the final SAS URI. 
7. In the Azure portal, navigate to the blob storage that contains the VHD associated with the newly generated URI.
8. Copy the URL value of the **Blob service endpoint**, as shown below.

    ![Blob service endpoint in Azure portal](./media/publishvm_033.png)

9. Edit the text file with the SAS connection string from step 6.  You will construct the complete SAS URI using the following format:

    `<blob-service-endpoint-url>` + `/vhds/` + `<vhd-name>?` + `<sas-connection-string>`

    For example, if the name of the VDH is `TestRGVM2.vhd`, then the resulting SAS URI would be:

    `https://catech123.blob.core.windows.net/vhds/TestRGVM2.vhd?st=2018-05-06T07%3A00%3A00Z&se=2019-08-02T07%3A00%3A00Z&sp=rl&sv=2017-04-17&sr=c&sig=wnEw9RfVKeSmVgqDfsDvC9IHhis4x0fc9Hu%2FW4yvBxk%3D`

Repeat these steps for each VHD in the SKUs you plan to publish.


### Microsoft Storage Explorer

Use the following steps to generate a SAS URI with the Microsoft Azure Storage Explorer.

1. Download and install the [Microsoft Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).
2. Open the explorer and, in the left-hand menubar, click on the **Add Account** icon.  The **Connect to Azure Storage** dialog box is displayed.
3. Select **Add an Azure Account** and click **Sign in**.  Continue the required steps to sign into your Azure account.
4. In the left-hand **Explorer** pane, navigate to your **Storage Accounts** and expand this node.
5. Right-click on your VHD and select **Get Share Access Signature** from the context menu. 

    ![Get SAS item in Azure Explorer](./media/publishvm_034.png)

6. The **Shared Access Signature** dialog is displayed. Enter values for the following fields:
   - **Start time** - Permission start date for VHD access. Provide a date that is one day before the current date.
   - **Expiry time** - Permission expiration date for VHD access.  Provide a date at least three weeks beyond the current date.
   - **Permissions** - Select the `Read` and `List` permissions. 

     ![SAS dialog in Azure Explorer](./media/publishvm_035.png)

7. Click **Create** to create the associated SAS URI for this VHD.  The dialog now displays details about this operation. 
8. Copy the **URL** value and save it to a text file in a secure location. 

    ![SAS URI create in Azure Explorer](./media/publishvm_036.png)

    This generated SAS URL is for container-level access.  To make it specific, the associated VHD name must be added to it.

9. Edit the text file. Insert your VHD name after the `vhds` string in the SAS URL (include a leading forward slash).  The final SAS URI should be of the format:

    `<blob-service-endpoint-url>` + `/vhds/` + `<vhd-name>?` + `<sas-connection-string>`

    For example, if the name of the VDH is `TestRGVM2.vhd`, then the resulting SAS URI would be:

    `https://catech123.blob.core.windows.net/vhds/TestRGVM2.vhd?st=2018-05-06T07%3A00%3A00Z&se=2019-08-02T07%3A00%3A00Z&sp=rl&sv=2017-04-17&sr=c&sig=wnEw9RfVKeSmVgqDfsDvC9IHhis4x0fc9Hu%2FW4yvBxk%3D`

Repeat these steps for each VHD in the SKUs you plan to publish.


## Verify the SAS URI

Review and verify each generated SAS URI by using the following checklist.  Verify that:
- The URI is of the form:
        `<blob-service-endpoint-url>` + `/vhds/` + `<vhd-name>?` + `<sas-connection-string>`
- The URI contains your VHD image filename, including the filename extension ".vhd".
- Towards the middle of the URI, `sp=rl` appears. This string indicates that `Read` and `List` access is specified.
- After that point, `sr=c` also appears. This string indicates that container-level access is specified.
- Copy and paste the URI into a browser to begin to download the associated blob.  (You can cancel the operation before the download completes.)


## Next steps

If you are having difficulties generating a SAS URI, then see [Common SAS URL issues](./cpp-common-sas-url-issues.md).  Otherwise, save the SAS URI(s) to a secure location for later use. It will be required to [publish your VM offer](./cpp-publish-offer.md) in the Cloud Partner Portal.
