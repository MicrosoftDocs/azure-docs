---
title: Shared access signature URI for VM images - Azure Marketplace
description: Generate a shared access signature (SAS) URI for your virtual hard disks (VHD) in Azure Marketplace.
author: anbene
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/09/2020
ms.author: mingshen
---

# Get shared access signature URI for your VM image

This article describes how to generate a shared access signature (SAS) uniform resource identifier (URI) for each virtual hard disk (VHD).

During the publishing process, you must provide a URI for each VHD that's associated with your plans. These plans were previously referred to as SKUs, or stock keeping units. Microsoft needs access to these VHDs during the certification process. You'll enter this URI on the **Plans** tab in Partner Center.

When generating SAS URIs for your VHDs, follow these requirements:

* Only unmanaged VHDs are supported.
* Only `List` and `Read` permissions are required. Don't provide Write or Delete access.
* The duration for access (expiry date) should be a minimum of three weeks from when the SAS URI is created.
* To protect against UTC time changes, set the start date to one day before the current date. For example, if the current date is October 6, 2019, select 10/5/2019.

## Generate the SAS address

There are two common tools used to create an SAS address (URL):

* **Microsoft Storage Explorer** – Graphical tool available for Windows, macOS, and Linux.
* **Microsoft Azure CLI** – Recommended for non-Windows operating systems and automated or continuous integration environments.

### Use Microsoft Storage Explorer

1. Download and install [Microsoft Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).
2. Open the explorer and, in the left menu, select **Add Account**. The **Connect to Azure Storage** dialog box appears.
3. Select **Add an Azure Account** and then **Sign in**. Complete the required steps to sign into your Azure account.
4. In the left-**Explorer** pane, go to your **Storage Accounts** and expand this node.
5. Right-click your VHD and then select **Get Share Access Signature**.
6. The **Shared Access Signature** dialog box appears. Complete the following fields:

    * **Start time** – Permission start date for VHD access. Provide a date that is one day before the current date.
    * **Expiry time** – Permission expiration date for VHD access. Provide a date that's at least three weeks beyond the current date.
    * **Permissions** – Select the Read and List permissions.
    * **Container-level** – Check the **Generate container-level shared access signature URI** check box.

        :::image type="content" source="media/create-sas-uri-storage-explorer.png" alt-text="Illustrates the Shared Access Signature dialog box":::

7. To create the associated SAS URI for this VHD, select **Create**. The dialog box refreshes and shows details about this operation.
8. Copy the **URI** and save it to a text file in a secure location.

    :::image type="content" source="media/create-sas-uri-shared-access-signature-details.png" alt-text="Illustrates the Shared Access Signature details box":::

    This generated SAS URI is for container-level access. To make it specific, edit the text file to add the VHD name (next step).

9. Insert your VHD name after the vhds string in the SAS URI (include a forward slash). The final SAS URI should look like this:

    `<blob-service-endpoint-url> + /vhds/ + <vhd-name>? + <sas-connection-string>`
    For example, if the name of the VDH is `TestRGVM2.vhd`, then the resulting SAS URI would be:

    `https://catech123.blob.core.windows.net/vhds/TestRGVM2.vhd?st=2018-05-06T07%3A00%3A00Z&se=2019-08-02T07%3A00%3A00Z&sp=rl&sv=2017-04-17&sr=c&sig=wnEw9RfVKeSmVgqDfsDvC9IHhis4x0fc9Hu%2FW4yvBxk%3D`

10. Repeat these steps for each VHD in the plans you will publish.

### Using Azure CLI

1. Download and install [Microsoft Azure CLI](https://azure.microsoft.com/documentation/articles/xplat-cli-install/). Versions are available for Windows, macOS, and various distros of Linux.
2. Create a PowerShell file (.ps1 file extension), copy in the following code, then save it locally.

    ```PowerShell
    az storage container generate-sas --connection-string 'DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net' --name <vhd-name> --permissions rl --start '<start-date>' --expiry '<expiry-date>'
    ```

3. Edit the file to use the following parameter values. Provide dates in UTC datetime format, such as `2020-04-01T00:00:00Z`.

    * `<account-name>` – Your Azure storage account name
    * `<account-key>` – Your Azure storage account key
    * `<vhd-name>` – Your VHD name
    * `<start-date>` – Permission start date for VHD access. Provide a date one day before the current date.
    * `<expiry-date>` – Permission expiration date for VHD access. Provide a date at least three weeks after the current date.

    This example shows proper parameter values (at the time of this writing):

    ```PowerShell
    az storage container generate-sas --connection-string 'DefaultEndpointsProtocol=https;AccountName=st00009;AccountKey=6L7OWFrlabs7Jn23OaR3rvY5RykpLCNHJhxsbn9ONc+bkCq9z/VNUPNYZRKoEV1FXSrvhqq3aMIDI7N3bSSvPg==;EndpointSuffix=core.windows.net' --name vhds --permissions rl --start '2020-04-01T00:00:00Z' --expiry '2021-04-01T00:00:00Z'
    ```

4. Save the changes.
5. Using one of the following methods, run this script with administrative privileges to create a **SAS connection string** for container-level access:

    * Run the script from the console. In Windows, right-click the script and select **Run as administrator**.
    * Run the script from a PowerShell script editor such as [Windows PowerShell ISE](https://docs.microsoft.com/powershell/scripting/components/ise/introducing-the-windows-powershell-ise). This screen shows the creation of a SAS connection string within this editor:

     :::image type="content" source="media/create-sas-uri-power-shell-ise.png" alt-text="Illustrates the creation of a SAS connection string with Windows PowerShell ISE":::

6. Copy the SAS connection string and save it to a text file in a secure location. Edit this string to add the VHD location information to create the final SAS URI.
7. In the Azure portal, go to the blob storage that includes the VHD associated with the new URI.
8. Copy the URL of the **Blob service endpoint**, as shown in the following screenshot

    :::image type="content" source="media/create-sas-uri-blob-endpoint.png" alt-text="Illustrates the Blob service endpoint":::

9. Edit the text file with the SAS connection string from step 6. Create the complete SAS URI using this format:

    `<blob-service-endpoint-url> + /vhds/ + <vhd-name>? + <sas-connection-string>`

    For example, if the name of the VHD is `TestRGVM2.vhd`, the SAS URI will be:

    `https://catech123.blob.core.windows.net/vhds/TestRGVM2.vhd?st=2018-05-06T07%3A00%3A00Z&se=2019-08-02T07%3A00%3A00Z&sp=rl&sv=2017-04-17&sr=c&sig=wnEw9RfVKeSmVgqDfsDvC9IHhis4x0fc9Hu%2FW4yvBxk%3D`

Repeat these steps for each VHD in the SKUs you plan to publish.

## Verify the SAS URI

Review each created SAS URI by using the following checklist to verify that:

* The URI looks like this: `<blob-service-endpoint-url>` + `/vhds/` + `<vhd-name>?` + `<sas-connection-string>`
* The URI includes your VHD image filename, including the filename extension ".vhd".
* `sp=rl` appears near the middle of your URI. This string shows that `Read` and `List` access is specified.
* When `sr=c` appears, this means that container-level access is specified.
* Copy and paste the URI into a browser to test-download the blob (you can cancel the operation before the download completes).

## Next step

If you have difficulties creating an SAS URI, see [Common SAS URL issues](https://docs.microsoft.com/azure/marketplace/partner-center-portal/common-sas-uri-issues). Otherwise, save the SAS URI(s) to a secure location for later use. You'll need it to publish your VM offer in Partner Center.

* [Create an Azure Virtual Machine offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/azure-vm-create-offer)
