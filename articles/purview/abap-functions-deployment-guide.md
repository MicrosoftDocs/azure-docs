---
title: SAP ABAP function module deployment guide - Microsoft Purview
description: This article outlines the steps to deploy the ABAP function module in your SAP server.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 08/03/2022
---

# SAP ABAP function module deployment guide

When you scan [SAP ECC](register-scan-sapecc-source.md), [SAP S/4HANA](register-scan-saps4hana-source.md), and [SAP BW](register-scan-sap-bw.md) sources in Microsoft Purview, you need to create the dependent ABAP function module in your SAP server. Microsoft Purview invokes this function module to extract the metadata from your SAP system during scan.

This article describes the steps required to deploy this module.

> [!Note]
> The following instructions were compiled based on the SAP GUI v. 7.2.

## Prerequisites

Download the SAP ABAP function module source code from the Microsoft Purview governance portal. After you register a source for [SAP ECC](register-scan-sapecc-source.md), [SAP S/4HANA](register-scan-saps4hana-source.md), or [SAP BW](register-scan-sap-bw.md), you can find a download link on top as shown in the following image. You can also see the link when you create a new scan or edit a scan.

:::image type="content" source="media/abap-functions-deployment-guide/download-abap-code.png" alt-text="Screenshot that shows the download link for the ABAP function module source code from the Microsoft Purview governance portal." border="true":::

## Deploy the module

Follow the instructions to deploy a module.

### Create a package

This step is optional, and an existing package can be used.

1. Sign in to the SAP server and open **Object Navigator** (SE80 transaction).

1. Select **Package** from the list and enter a name for the new package. For example, use **Z\_MITI**. Then select **Display**.

1. In the **Create Package** window, select **Yes**. In the **Package Builder: Create Package** window, enter a value in the **Short Description** box. Select the **Continue** icon.

1. In the **Prompt for local Workbench request** window, select **Own Requests**. Select the **development** request.

### Create a function group

1. In **Object Navigator**, select **Function Group** from the list and enter a name in the input box. For example, use **Z\_MITI\_FGROUP**. Select the **View** icon.

1. In the **Create Object** window, select **yes** to create a new function group.

1. Enter a description in the **Short Text** box and select **Save**.

1. Select a package that was prepared in the **Create a Package** step, and select **Save**.

1. Confirm a request by selecting **Continue**.

1. Activate the function group.

### Create the ABAP function module

1. After the function group is created, select it.

1. Select and hold (or right-click) the function group name in the repository browser. Select **Create** and then select **Function Module**.

1. In the **Function module** box, enter **Z_MITI_DOWNLOAD** in case of SAP ECC or S/4HANA and **Z_MITI_BW_DOWNLOAD** in case of SAP BW. Enter a description in the **Short Text** box.

After the module is created, specify the following information:

1. Go to the **Attributes** tab.

1. Under **Processing Type**, select **Remote-Enabled Module**.

   :::image type="content" source="media/abap-functions-deployment-guide/processing-type.png" alt-text="Screenshot that shows registering the sources option as Remote-Enabled Module." border="true":::

1. Go to the **Source code** tab. There are two ways to deploy code for the function:

   1. On the main menu, upload the text file you downloaded from the Microsoft Purview governance portal as described in [Prerequisites](#prerequisites). To do so, select **Utilities** > **More Utilities** > **Upload/Download** > **Upload**.

   1. Alternatively, open the file and copy and paste the contents in the **Source code** area.

1. Go to the **Import** tab and create the following parameters:

   1.  *P\_AREA TYPE DD02L-TABNAME* (**Optional** = True)

   1.  *P\_LOCAL\_PATH TYPE STRING* (**Optional** = True)

   1.  *P\_LANGUAGE TYPE L001TAB-DATA DEFAULT \'E\'*

   1.  *ROWSKIPS TYPE SO\_INT DEFAULT 0*

   1.  *ROWCOUNT TYPE SO\_INT DEFAULT 0*

   > [!Note]
   > Select the **Pass Value** checkbox for all the parameters.

   :::image type="content" source="media/abap-functions-deployment-guide/import.png" alt-text="Screenshot that shows registering the sources option as Import parameters." border="true":::

1. Go to the **Tables** tab and define *EXPORT_TABLE LIKE TAB512*.

   :::image type="content" source="media/abap-functions-deployment-guide/export-table.png" alt-text="Screenshot that shows the Tables tab." border="true":::

1. Go to the **Exceptions** tab and define the exception *E_EXP_GUI_DOWNLOADFAILED*.

   :::image type="content" source="media/abap-functions-deployment-guide/exceptions.png" alt-text="Screenshot that shows the Exceptions tab." border="true":::

1. Save the function by selecting **Ctrl+S**. Or select **Function module** and then select **Save** on the main menu.

1. Select the **Activate** icon on the toolbar and then select **Continue**. You can also select **Ctrl+F3**. If prompted, select the generated includes to be activated along with the main function module.

### Test the function

After you finish the previous steps, test the function:

1. Open the **Z_MITI_DOWNLOAD** or **Z_MITI_BW_DOWNLOAD** function module you created.

1. On the main menu, select **Function Module** > **Test** > **Test Function Module**. You can also select **F8**.

1. Enter a path to the folder on the local file system in the parameter *P\_LOCAL\_PATH*. Then select the **Execute** icon on the toolbar. You can also select **F8**.

1. Enter the name of the area of interest in the **P\_AREA** field if a file with metadata must be downloaded or updated. After the function finishes working, the folder indicated in the *P\_LOCAL\_PATH* parameter must contain several files with metadata inside. The names of files mimic areas that can be specified in the **P\_AREA** field.

The function finishes its execution and metadata is downloaded much faster if it's launched on the machine that has a high-speed network connection with the SAP server.

## Next steps

- [Connect to and manage SAP ECC source](register-scan-sapecc-source.md)
- [Connect to and manage SAP S/4HANA source](register-scan-saps4hana-source.md)
- [Connect to and manage SAP Business Warehouse (BW) source](register-scan-sap-bw.md)
