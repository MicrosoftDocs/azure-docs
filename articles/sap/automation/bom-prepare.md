---
title: Prepare Bill of Materials for automation
description: How to prepare a full SAP Bill of Materials (BOM) for use with the SAP on Azure Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 05/07/2023
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Prepare SAP BOM

The [SAP on Azure Deployment Automation Framework](deployment-framework.md) uses a Bill of Materials (BOM). The BOM helps configure your SAP systems. 

The automation framework's GitHub repository contains a set of [Sample BOMs](https://github.com/Azure/SAP-automation-samples/tree/main/SAP) that you can use to get started. It is also possible to create BOMs for other SAP Applications and databases. 

If you want to generate a BOM that includes permalinks, [follow the steps for creating this type of BOM](#permalinks).

> [!NOTE]
> This guide covers advanced deployment topics. For a basic explanation of how to deploy the automation framework, see the [get started guide](get-started.md) instead.

## Prerequisites

- [Get, download, and prepare your SAP installation media and related files](bom-get-files.md) if you haven't already done so.
    - SAP Application (DB) or HANA media in your Azure storage account.
- A YAML editor for working with the BOM file.
- Application installation templates for: 
    - SAP Central Services (SCS)
    - The SAP Primary Application Server (PAS)
    - The SAP Additional Application Server (AAS)
- Downloads of necessary stack files to the folder you created for [acquiring SAP media](bom-get-files.md#acquire-media). For more information, see the [basic BOM preparation how-to guide](bom-prepare.md).
- A copy of your [SAP Download Basket manifest](bom-get-files.md#get-download-basket-manifest) (`DownloadBasket.json`), downloaded to the [folder you created for acquiring SAP media](bom-get-files.md#acquire-media).
    - An installation of the [Postman utility](https://www.postman.com/downloads/).
- An Azure subscription. If you don't already have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An SAP account with permissions to work with the database you want to use.
- A system that runs Linux-type commands for [validating the BOM](#validate-bom). Install the commands `yamllint` and `ansible-lint` on the system.

## Scripted creation process

This process automates the same steps as the [manual BOM creation process](#manual-creation-process). Review the [script limitations](#script-limitations) before using this process.

1. Navigate to your stack files folder.

    ```bash
    cd stackfiles
    ```

1. Run the BOM generation script. Replace the example path with the correct path to your utilities folder. For example:

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/deploy/scripts/generate_bom.sh >../bom.yml
    ```

1. For the product parameter (`product`), enter the SAP product name. For example, `SAP_S4HANA_1809_SP4`. If you don't enter a value, the script attempts to determine the name from the stack XML file.

1. Open the generated `bom.yml` file for review.

1. Review the templates section (`templates`). Make sure the `file` and `override_target_location` values are correct. If necessary, edit and comment out those lines. For example:

    ```yml
    templates:
      # - name:     "S4HANA_2020_ISS_v001 ini file"
      #   file:     S4HANA_2020_ISS_v001.inifile.params
      #   override_target_location: "{{ target_media_location }}/config"
    ```

1. Review the stack files section (`stackfiles`). Make sure the item names and files are correct. If necessary, edit those lines.

## Script limitations

The [scripted BOM creation process](#scripted-creation-process) has the following limitations.

The scripting has a hard-coded dependency on HANA2. Edit your BOM file manually to match the required dependency name. For example:

```yml
dependencies:
  - name: "HANA2"
```

There are no defaults for the media parameters `override_target_filename:`, `override_target_location`, and `version:`. Edit your BOM file manually to change these parameters. For example:

```yml
   - name:     SAPCAR
     archive:  SAPCAR_1320-80000935.EXE
     override_target_filename: SAPCAR.EXE

   - name: "SWPM20SP07"
     archive: "SWPM20SP07_2-80003424.SAR"
     override_target_filename: SWPM.SAR
     sapurl: "https://softwaredownloads.sap.com/file/0020000001812632020"
```

The script only generates entries for media files that the SAP Maintenance Planner identifies. This limitation occurs because it processes the stack `.xsl` file. If you add any files to your download basket separately, such as through SAP Launchpad, you must [add those files to the BOM manually](#manual-creation-process).

## Manual creation process

You can create your BOM through the following manual process. Another option is to use the [scripted creation process](#scripted-creation-process) to do the same steps.

1. Open the downloads folder you created for [acquiring SAP media](bom-get-files.md#acquire-media)

1. Create an empty YAML file named `bom.yml`.

1. Open `bom.yml` in an editor.

1. Add a BOM header with names for the build and target. The `name` value must be the same as the BOM folder name in your storage account. For example:

    ```yml
    name:    'S4HANA_2020_ISS_v001'
    target:  'ABAP PLATFORM 2020'
    ```

1. Add a defaults section with the target location. Use the path to the folder on the target server where you want to copy installation files. Typically, use `{{ target_media_location }}` as follows:

    ```yml
    defaults:
      target_location: "{{ target_media_location }}/download_basket"
    ```

1. Add a product identifiers section. You populate these values later as part of the template preparation. For example:

    ```yml
    product_ids:
      scs:
      db:
      pas:
      aas:
      web:
    ```

1. Add a materials section to specify the list of required materials. Add any dependencies on other BOMs in this section. For example:

    ```yml
    materials:
    dependencies:
        - name:     HANA2
    ```

1. Get a list of media to include in your BOM.

    1. Open your download basket spreadsheet. This file renders as XML.

    1. Format the XML content to be human readable, if necessary.

    1. For each item in the download basket, note the `String` and `Number` data. The `String` data provides the file name (for example, `igshelper_17-10010245.sar`) and a friendly description (for example, `SAP IGS Fonts and Textures`). You'll record the `Number` data after each entry in your BOM. 

1. Add the list of media to `bom.yml`. The order of these items doesn't matter, however, you might want to group related items together for readability. Add `SAPCAR` separately, even though your SAP download basket contains this utility. For example:

    ```yml
    media:
        - name:     SAPCAR
          archive:  SAPCAR_1320-80000935.EXE
    
        name: "SAP IGS Fonts and Textures"
          archive: "igshelper_17-10010245.sar"
          # 61489
    
        <...>
    ```

1. Optionally, if you need to override the target media location, add the parameter `override_target_location` to a media item. For example, `override_target_location: "{{ target_media_location }}/config"`.

1. Add a blank templates section.

    ```yml
    templates:
    ```

1. Create a stack files section. For example:

    ```yml
    stackfiles:
      - name: Download Basket JSON Manifest
         file: downloadbasket.json
    
      - name: Download Basket Spreadsheet
         file: MP_Excel_2001017452_20201030_SWC.xls
    ```

1. Save your changes to `bom.yml`.

### Permalinks

You can automatically generate a basic BOM that functions. However, the BOM doesn't create permanent URLs (permalinks) to the SAP media by default. If you want to create permalinks, you need to do more steps before you [acquire the SAP media](bom-get-files.md#acquire-media). 

> [!NOTE]
> Manual generation of a full SAP BOM with permalinks takes about twice as long as [preparing a basic BOM manually](#manual-creation-process). 

To generate a BOM with permalinks:

1. Open `DownloadBasket.json` in your editor.

1. For each result, note the contents of the `Value` line. For example:

    ```json
         "Value": "0020000000703122018|SP_B|SAP IGS Fonts and Textures|61489|1|20201023150931|0"
    ```

1. Copy down the first and fourth values separated by vertical bars.

    1. The first value is the file number. For example, `0020000000703122018`.

    1. The fourth value is the number you'll use to match with your media list. For example, `61489`.

    1. Optionally, copy down the second value, which denotes the file type. For example, `SP_B` for kernel binary files, `SPAT` for non-kernel binary files, and `CD` for database exports.

1. Use the fourth value as a key to match your download basket to your media list. Match the values (for example, `61489`) with the values you added as comments for the media items (for example, `# 61489`).

1. For each matching entry in `bom.yml`, add a new value for the SAP URL. For the URL, use `https://softwaredownloads.sap.com/file/` plus the third value for that item (for example, `0020000000703122018`). For example:

    ```yml
    - name: "SAP IGS Fonts and Textures"
      archive: "igshelper_17-10010245.sar"
      sapurl: "https://softwaredownloads.sap.com/file/0020000000703122018"
    ```

## Example BOM file

The following sample is a small part of an example BOM file for S/4HANA 1909 SP2. 

```yml
step|BOM Content

---

name:    'S4HANA_2020_ISS_v001'
target:  'ABAP PLATFORM 2020'

defaults:
  target_location: "{{ target_media_location }}/download_basket"

product_ids:
  scs:
  db:
  pas:
  aas:
  web:

materials:
dependencies:
    - name:     HANA2

media:
    - name:     SAPCAR
      archive:  SAPCAR_1320-80000935.EXE

    - name:     SWPM
      archive:  SWPM20SP06_6-80003424.SAR

    - name:     SAP IGS HELPER
      archive:  igshelper_17-10010245.sar

    - name:     SAP HR 6.08
      archive:  SAP_HR608.SAR

    - name:     S4COREOP 104
      archive:  S4COREOP104.SAR

templates:
    - name:     "S4HANA_2020_ISS_v001 ini file"
      file:     S4HANA_2020_ISS_v001.inifile.params
      override_target_location: "{{ target_media_location }}/config"

stackfiles:
    - name: Download Basket JSON Manifest
      file: downloadbasket.json
      override_target_location: "{{ target_media_location }}/config"

    - name: Download Basket Spreadsheet
      file: MP_Excel_2001017452_20201030_SWC.xls
      override_target_location: "{{ target_media_location }}/config"

    - name: Download Basket Plan doc
      file: MP_Plan_2001017452_20201030_.pdf
      override_target_location: "{{ target_media_location }}/config"

    - name: Download Basket Stack text
      file: MP_Stack_2001017452_20201030_.txt
      override_target_location: "{{ target_media_location }}/config"

    - name: Download Basket Stack XML
      file: MP_Stack_2001017452_20201030_.xml
      override_target_location: "{{ target_media_location }}/config"

    - name: Download Basket permalinks
      file: myDownloadBasketFiles.txt
      override_target_location: "{{ target_media_location }}/config"
```

## Validate BOM

You can validate your BOM structure from any OS that runs Linux-type commands. For Windows, use Windows Subsystem for Linux (WSL). Another option is to run the validation from your deployer if there's a copy of the BOM file there.


1. Run the validation script `check_bom.sh` from the directory containing your BOM. For example:

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/deploy/scripts/check_bom.sh bom.yml
    ```

1. Review the output. 

### Successful validation

A successful validation shows the following output. You already installed `yamllint` and `ansible-lint` commands in the [prerequisites](#prerequisites). 

```output
... yamllint [ok]
... ansible-lint [ok]
... bom structure [ok]
```

### Unsuccessful validation

An unsuccessful validation contains error information. For example:

```output
../documentation/ansible/system-design-deployment/examples/S4HANA_2020_ISS_v001/bom_with_errors.yml
  178:16    error    too many spaces after colon  (colons)
  179:16    error    too many spaces after colon  (colons)
  180:16    error    too many spaces after colon  (colons)
    
... yamllint [errors]
... ansible-lint [ok]
  - Expected to find key 'defaults' in 'bom' (Check name: S4HANA_2020_ISS_v001)
  - Unexpected key 'default in 'bom' (Check name: S4HANA_2020_ISS_v001)
  - Unexpected key 'overide_target_location in 'bom.materials.stackfiles' (Check name: Download Basket Stack text)
... bom structure [errors]
```

## Upload your BOM

To use the BOM with permalinks:

1. [Validate the BOM](#validate-bom).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Under **Azure services**, select **Resource groups**. Or, enter `resource groups` in the search bar. 

1. Select the resource group for your SAP Library.

1. On the resource group page, select the storage account `saplib` in the **Resources** table.

1. On the storage account page's menu, select **Containers** under **Data storage**.

1. Select the `sap bits` container.

1. On the container page, upload your archives and tools.

    1. Select the **Upload** button.

    1. Select **Select a file**.

    1. Navigate to the download directory that you created previously.

## Next steps

> [!div class="nextstepaction"]
> [How to generate SAP Application BOM](bom-templates-db.md)
