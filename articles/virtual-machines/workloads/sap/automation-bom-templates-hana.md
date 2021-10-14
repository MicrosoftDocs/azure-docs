---
title: Generate HANA templates for automation
description: How to generate SAP HANA templates for use with the automation framework using the Bill of Materials (BoM) you created.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: how-to
ms.service: virtual-machines-sap
---

# Generate HANA templates for automation

The [SAP deployment automation framework on Azure](automation-deployment-framework.md) uses a Bill of Materials (BoM). When you [deploy a custom BoM](automation-bom-deploy.md), you need to also create a template for the database. This guide covers SAP HANA templates. There's also a [guide for SAP Application Database (SAP DB) templates](automation-bom-templates-db.md).


## Prerequisites

- [Get, download, and prepare your SAP installation media and related files](automation-bom-get-files.md) if you haven't already done so. Make sure to have the [name of the SAPCAR utility file that you downloaded](automation-bom-get-files.md#acquire-media) available.
- [Prepare your BoM](automation-bom-prepare.md) if you haven't already done so. Make sure to have the BoM file that you created available.
- [Process your BoM](automation-bom-process.md) if you haven't already done so. Make sure to have the configuration details from when you [deployed your infrastructure](automation-bom-process.md#deploy-system-infrastructure). Also check that your application servers have swap space of &gt; 256 MB available.
- An Azure subscription. If you don't already have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An SAP account with permissions to work with the database you want to use.
- Optionally, create a virtual machine (VM) within Azure to use for transferring SAP media from your storage account. This method improves the transfer speed. Make sure you have connectivity between your VM and the target SAP VM. For example, check that your SSH keys are in place.

## Generate templates

1. Sign in to your target VM as the root user (`root`).

1. Make sure the mount point for the installation media already exists:

    ```bash
    mkdir -p /usr/sap/install
    ```
1. Make sure to mount the exported directories. Replace `<SCS-VM-IP>` with the IP address for your SAP Central Services (SCS) VM:

    ```bash
    mount <SCS-VM-IP>:/usr/sap/install /usr/sap/install
    ```

1. Create and go to a temporary directory:

    ```bash
    mkdir /tmp/hana_template; cd $_
    ```

1. Change the permissions for the SAPCAR utility to be executable. Replace `<SAPCAR>.EXE` with the name of the SAPCAR utility version that you downloaded. For example, `SAPCAR_1320-80000935.EXE`.

    ```bash
    chmod +x /usr/sap/install/download_basket/<SAPCAR>.EXE
    ```

1. Extract the HANA server files. Again, replace `<SAPCAR>.EXE` with the name of the SAPCAR utility version that you downloaded. Also replace `<HANA-server>.SAR` with the name of the HANA server file that you downloaded. For example, `IMDB_SERVER20_052_0-80002031.SAR`.

    ```bash
    /usr/sap/install/download_basket/<SAPCAR>.EXE     \
    -manifest SAP_HANA_DATABASE/SIGNATURE.SMF -xf   \
    /usr/sap/install/download_basket/<HANA-server>.SAR
    ```

1. Generate an empty install template and password file using the `hdblcm` tool that you extracted. The automation installation of the SAP HANA database uses the parameter files `<name>.params` and `<name>.params.xml`. Make sure to replace `<name`> with the stack version of your HANA database, such as `HANA_2_00_052_v001`. 


    ```bash
    SAP_HANA_DATABASE/hdblcm --dump_configfile_template=HANA_2_00_052_v001.params
    ```

1. Open your HANA parameter file (`<name>.params`) in an editor. For example, `HANA_2_00_052_v001.params`.

1. Set the components parameter to: `components=all`.

1. Set the hostname parameter to: `hostname={{ ansible_hostname }}`

1. Set the SAP system identifier (SID) parameter to: `sid={{ db_sid | upper }}`.

1. Set the number parameter to: `number={{ db_instance_number }}`

1. Open the HANA parameter XML file (`<name>.params.xml`) in an editor.

1. Set the password values as follows.

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <Passwords>
        <root_password><![CDATA[{{ db_root_password }}]]></root_password>
        <sapadm_password><![CDATA[{{ db_sapadm_password }}]]></sapadm_password>
        <main_password><![CDATA[{{ db_main_password }}]]></master_password>
        <sapadm_password><![CDATA[{{ db_sapadm_password }}]]></sapadm_password>
        <password><![CDATA[{{ db_password }}]]></password>
        <system_user_password><![CDATA[{{ db_system_user_password }}]]></system_user_password>
        <streaming_cluster_manager_password><![CDATA[{{ db_streaming_cluster_manager_password }}]]></streaming_cluster_manager_password>
        <ase_user_password><![CDATA[{{ db_ase_user_password }}]]></ase_user_password>
        <org_manager_password><![CDATA[{{ db_org_manager_password }}]]></org_manager_password>
    </Passwords>
    ```

    1. Replace `db_root_password` with the root password for your database.

    1. Replace `db_sapadm_password` with your SAP administrator password.

    1. Replace `db_main_password` with the main password for your SAP installation.

    1. Replace `db_password` with your database password.

    1. Replace `db_system_user_password` with your system user's password for the database.

    1. Replace `db_streaming_cluster_manager_password` with your streaming cluster manager password.

    1. Replace `db_ase_user_password` with your SAP ASE database password.

    1. Replace `db_org_manager_password` with your organization manager password.

## Upload templates

Next, upload your template files to the SAP Library:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select or search for **Storage accounts**.

1. Select your SAP Library's storage account.

1. On the storage account menu, under **Data storage**, select **File shares**.

1. Select the file share `sapbits`.

1. Select the folder `boms`.

1. Select the correct product folder for the BoM you want to update. For example, `boms/HANA_2_00_052_v001`.

1. If there's not already a directory named `templates`, create the directory. For example, `boms/HANA_2_00_052_v001/templates`.

1. Select the `templates` directory.

1. In the file share menu, select **Upload**.

1. In the **Upload files** pane, under **Files**, select the folder icon next to **Select a file**.

1. Navigate to the VM or other location in which you generated your templates.

1. Select your generated templates. For example, `HANA_2_00_052_v001.params` and `HANA_2_00_052_v001.params.xml`.

1. If you're updating a template, enable the setting **Overwrite if files already exist**.

1. Select **Upload**.

## Next steps

> [!div class="nextstepaction"]
> [Continue deploying your custom SAP BoM](automation-bom-deploy.md)
