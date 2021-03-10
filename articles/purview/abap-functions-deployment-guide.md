---
title: Metadata extraction ABAP function module in SAP R3 - Azure Purview
description: This article outlines the steps to deploy ABAP function module in SAP Server
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 11/13/2020
---

# Deploy the metadata extraction ABAP function module for the SAP R3 family of bridges

This article outlines the steps to deploy the ABAP function module in SAP Server.

## Overview

The SAP Business Suite 4 HANA (S/4HANA), ECC, and R/3 ERP bridge can be used to extract metadata from the SAP Server. This is achieved by placing ABAP function module on the SAP server. This
function module is remotely accessible by the bridge to query and download (as a text file) the metadata containing within the SAP server.

When executed, the bridge then either:

1. Imports metadata from an existing file already downloaded locally from a previous bridge execution.

2. Invokes the ABAP module API, wait for the download, and then import metadata from that file.

This document details the steps required to deploy this module.

> [!Note]
> The following instructions were compiled based on the SAP GUI v.7.2

## Deployment of the Module

### Create a Package

This step is optional, and an existing package can be used.

1. Log in to the SAP S/4HANA or SAP ECC server and open **Object Navigator** (SE80 transaction).

2. Select option **Package** from the list and enter a name for the new package (for example, Z\_MITI) then press button **Display**.

3. Select **Yes** in the **Create Package** window. Consequently, a window **Package Builder: Create Package** opens. Enter value into **Short Description** field and select the **Continue** icon.

4. Select **Own Requests** in the **Prompt for local Workbench request** window. Select **development** request.

### Create a Function Group

In Object Navigator select **Function Group** from the list and type its name in the input field below (for example, Z\_MITI\_FGROUP). Select the **View** icon.

1. In **Create Object** window, select **yes** to create a new function group.

2. Specify an appropriate description in the **Short text** field and press button **Save**.

3. Choose a package which was prepared in the previous step **Create a Package** and select **Save**.

4. Confirm a request by pressing icon **Continue**.

5. Activate the Function Group.

### Create the ABAP Function Module

1. Once the function group is created, select it.

2. Right-click on the function group name in repository browser, and select **Create**, then **Function Module**.

3. In the **Function Module** field, enter `Z_MITI_DOWNLOAD`. Populate **Short text** input with proper description.

When the module has been created, specify the following information:

1. Navigate to the **Attributes** tab.

2. Select **Processing Type** as **Remote-Enabled Function Module**.

   :::image type="content" source="media/abap-functions-deployment-guide/processing-type.png" alt-text="Register sources option - Remote-Enabled Function Module" border="true":::

3. Navigate to the **Source code** tab. There are two ways how to deploy code for the function:

   a. From the main menu, upload the text file [Z\_MITI\_DOWNLOAD](https://github.com/Azure/Purview-Samples/tree/master/connectors/sap) file. To do so, select **Utilities**, **More Utilities**, then **Upload/Download**, then **Upload**.

   b. Alternatively, open the file, copy its content and paste into **Source code** area.

4. Navigate to the **Import** tab and create the following parameters:

   a.  P\_AREA TYPE DD02L-TABNAME (Optional = True)

   b.  *P\_LOCAL\_PATH TYPE STRING* (Optional = True)

   c.  *P\_LANGUAGE TYPE L001TAB-DATA DEFAULT \'E\'*

   d.  *ROWSKIPS TYPE SO\_INT DEFAULT 0*

   e.  *ROWCOUNT TYPE SO\_INT DEFAULT 0*

   > [!Note]
   > Choose **Pass Value** for all of them

   :::image type="content" source="media/abap-functions-deployment-guide/import.png" alt-text="Register sources option - Import parameters" border="true":::

5. Navigate to the "Tables" tab and define the following:

   `EXPORT_TABLE LIKE TAB512`

   :::image type="content" source="media/abap-functions-deployment-guide/export-table.png" alt-text="Register sources options - Tables tab" border="true":::

6. Navigate to the **Exceptions** tab and define the following exception: `E_EXP_GUI_DOWNLOADFAILED`

   :::image type="content" source="media/abap-functions-deployment-guide/exceptions.png" alt-text="Register sources options - Exceptions tab" border="true":::

7. Save the function (press ctrl+S or choose **Function Module**, then **Save** in the main menu).

8. Click **Activate** icon on the toolbar (ctrl+F3) and select  **Continue** button in dialog window. If prompted, you should select  the generated includes to be activated along with the main function module.

### Testing the Function

When all the previous steps are completed, follow the below steps to test the function:

1. Open Z\_MITI\_DOWNLOAD function module.

2. Choose **Function Module**, then **Test**, then **Test Function Module** from the main menu (or press F8).

3. Enter a path to the folder on the local file system into parameter P\_LOCAL\_PATH and press **Execute** icon on the toolbar (or press F8).

4. Put the name of the area of interest into P\_AREA field if a file with metadata must be downloaded or updated. When the function finishes working, the folder which has been indicated in P\_LOCAL\_PATH parameter must contain several files with metadata inside. The names of files mimic areas which can be specified in P\_AREA field.

The function will finish its execution and metadata will be downloaded much faster in case of launching it on the machine which has high-speed network connection with SAP S/4HANA or ECC server.

## Next steps

- [Register and scan SAP ECC source](register-scan-sapecc-source.md)
- [Register and scan SAP S/4HANA source](register-scan-saps4hana-source.md)
