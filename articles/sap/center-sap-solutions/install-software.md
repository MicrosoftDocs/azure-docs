---
title: Install SAP software
description: Learn how to install SAP software on an SAP system that you created using Azure Center for SAP solutions. You can either install the SAP software with  Azure Center for SAP solutions, or install the software outside the service and detect the installed system.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 02/03/2023
author: sagarkeswani
ms.author: sagarkeswani
#Customer intent: As a developer, I want to install SAP software so that I can use Azure Center for SAP solutions.
---

# Install SAP software





After you've created infrastructure for your new SAP system using *Azure Center for SAP solutions*, you need to install the SAP software.

In this how-to guide, you'll learn two ways to install the SAP software for your system. Choose whichever method is appropriate for your use case. You can either:

- [Install the SAP software through Azure Center for SAP solutions directly using the installation wizard](#install-sap-with-azure-center-for-sap-solutions).
- [Install the SAP software outside of Azure Center for SAP solutions, then detect the installed system from the service](#install-sap-through-outside-method).

## Prerequisites

Review the prerequisites for your preferred installation method: [through the Azure Center for SAP solutions installation wizard](#prerequisites-for-wizard-installation) or [through an outside method](#prerequisites-for-outside-installation)

### Prerequisites for wizard installation

- An Azure subscription.
- An Azure account with **Contributor** role access to the subscriptions and resource groups in which the Virtual Instance for SAP solutions exists.
- A user-assigned managed identity with **Storage Blob Data Reader** and **Reader and Data Access** roles on the Storage Account which has the SAP software. 
- A [network set up for your SAP deployment](prepare-network.md).
- A deployment of S/4HANA infrastructure.
- If you are installing an SAP System through Azure Center for SAP solutions, you should have the SAP installation media available in a storage account. For more information, see [how to download the SAP installation media](get-sap-installation-media.md).
- If you're installing a Highly Available (HA) SAP system, get the Service Principal identifier (SPN ID) and password to authorize the Azure fence agent (fencing device) against Azure resources. For more information, see [Use Azure CLI to create a Microsoft Entra app and configure it to access Media Services API](/azure/sap/workloads/high-availability-guide-suse-pacemaker#using-service-principal). 
    - For an example, see the Red Hat documentation for [Creating a Microsoft Entra Application](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/deploying_red_hat_enterprise_linux_7_on_public_cloud_platforms/configuring-rhel-high-availability-on-azure_cloud-content#azure-create-an-azure-directory-application-in-ha_configuring-rhel-high-availability-on-azure).
    - To avoid frequent password expiry, use the Azure Command-Line Interface (Azure CLI) to create the Service Principal identifier and password instead of the Azure portal. 

### Prerequisites for outside installation

- An Azure subscription.
- An Azure account with **Contributor** role access to the subscriptions and resource groups in which the Virtual Instance for SAP solutions exists.
- A user-assigned managed identity that you created during infrastructure deployment with **Contributor** role access on the subscription, or on all resource groups (compute, network and storage) that the SAP System is a part of.
- Infrastructure for the SAP system that you previously created through Azure Center for SAP solution. Don't make any changes to this infrastructure. 
- An SAP System (and underlying infrastructure resources) that is up and running.
- Optionally, you can add fully installed application servers to the system before detecting the SAP software; then, the SAP system with additional application servers will also be detected. 
    - If you add additional application servers to this Virtual Instance for SAP solutions after infrastructure deployment, the previously created user-assigned managed identity also needs **Contributor** role access on the subscription or on the resource group under which this new application server exists.
    - The number of application virtual machines installed should not be less than the number created during the infrastructure deployment phase in Azure Center for SAP solutions. You can still detect additional application servers.

Only the following scenarios are supported for this installation method:

- Infrastructure for S4/HANA was created through Azure Center for SAP solutions. The S4/HANA application was installed outside Azure Center for SAP solutions through a different tool.
- Only S4/HANA installation done outside Azure Center for SAP solutions can be detected. If you have installed a different SAP Application than S4/HANA, the detection will fail.
- If you want a fresh installation of S4/HANA software on the infrastructure deployed by Azure Center for SAP solutions, use the wizard installation option instead.

## Install SAP with Azure Center for SAP solutions

To install the SAP software directly, use the Azure Center for SAP solutions installation wizard.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Virtual Instance for SAP solutions**.

1. Select your Virtual Instance for SAP solutions instance.

1. On the **Overview** page for the Virtual Instance for SAP solutions resource, select **Install SAP software**.

1. In the **Prerequisites** tab of the wizard, review the prerequisites. Then, select **Next**.

1. On the **Software** tab, provide information about your SAP media.

    1. For **Have you uploaded the software to an Azure storage account?**, select **Yes**.

    1. For **Software version**, use the **SAP S/4HANA 1909 SPS03** or **SAP S/4HANA 2020 SPS 03** or **SAP S/4HANA 2021 ISS 00** or **S/4 HANA 2022 ISS 00** . Please note only those versions will light up which are supported with the OS version that was used to deploy the infrastructure previously. 

    1. For **BOM directory location**, select **Browse** and find the path to your BOM file. For example, `https://<your-storage-account>.blob.core.windows.net/sapbits/sapfiles/boms/S41909SPS03_v0010ms.yaml`.

    1. For High Availability (HA) systems only, enter the client identifier for the STONITH Fencing Agent service principal for **Fencing client ID**.

    1. For High Availability (HA) systems only, enter the password for the Fencing Agent service principal for **Fencing client password**.

    1. Select **Next**.

1. On the **Review + install** tab, review the software settings. 

1. Select **Install** to proceed with installation. 

1. Wait for the installation to complete. The process takes approximately three hours. You can see the progress, along with estimated times for each step, in the wizard.

1. After the installation completes, sign in with your SAP system credentials. To find the SAP system and HANA DB credentials for the newly installed system, see [how to manage a Virtual Instance for SAP solutions](manage-virtual-instance.md).

## Install SAP through outside method

If you install the SAP software elsewhere, you need to detect the software installation and update your Virtual Instance for SAP solutions metadata.

1. Sign in to the [Azure portal](https://portal.azure.com). Make sure to sign in with an Azure account that has **Contributor** role access to the subscription or resource groups where the SAP system exists.

1. Search for and select **Azure Center for SAP solutions** in the Azure portal's search bar.

1. Select **Virtual Instances for SAP solutions**. Then select the Virtual Instance for SAP solutions resource that you want to detect.

1. On the resource's overview page, select **Confirm already installed software**. Read all the instructions, then select **Confirm**. Extensions will now be installed on ASCS, APP and DB virtual machines and start discovering SAP metadata.

1. Wait for the Virtual Instance for SAP solutions resource to be detected and populated with the metadata. The process completes after all SAP system components have been detected. 

1. Review the Virtual Instance for SAP solutions resource in the Azure portal. The resource page now shows the SAP system resources, and information about the system.


## Limitations

The following are known limitations and issues.

### Application servers

You can install a maximum of 10 Application Servers, excluding the Primary Application Server. 

### SAP package version changes

When SAP changes the version of packages for a component in the BOM, you might encounter problems with the automated installation shell script. It's recommended to download your SAP installation media as soon as possible to avoid issues.

If you encounter this problem, follow these steps: 

1. Download a new valid package from the SAP software downloads page.

1. Upload the new package in the `archives` folder of your Azure Storage account.

1. Update the following contents in the BOM file(s) that reference the updated component.

    - `name` to the new package name
    - `archive` to the new package name and extension
    - `checksum` to the new checksum
    - `filename` to the new shortened package name
    - `permissions` to `0755`
    - `url` to the new SAP download URL

1. Reupload the BOM file(s) in the subfolder (`S41909SPS03_v0011ms` or `S42020SPS03_v0003ms` or `S4HANA_2021_ISS_v0001ms` or `S42022SPS00_v0001ms`) of the `boms` folder 

### Special characters like $ in S-user password is not accepted while downloading the BOM. 

1. Clone the SAP automation repository. For more information, see [how to download the SAP installation media](get-sap-installation-media.md).

    ```git bash
    git clone https://github.com/Azure/sap-automation.git
    ```

1. Before running the Ansible playbook set the SPASS environment variable below. Single quotes should be present in the command.

    ```bash
    export SPASS='password_with_special_chars'
    ```
1. Run the Ansible playbook:

    ```azurecli
    ansible-playbook ./sap-automation/deploy/ansible/playbook_bom_downloader.yaml -e "bom_base_name=S41909SPS03_v0011ms" -e "deployer_kv_name=dummy_value" -e "s_user=<username>" -e "s_password=$SPASS" -e "sapbits_access_key=<storageAccountAccessKey>" -e "sapbits_location_base_path=<containerBasePath>"
     ```
  
    - For `<username>`, use your SAP username.
    - For `<bom_base_name>`, use the SAP Version you want to install i.e. **_S41909SPS03_v0011ms_** or **_S42020SPS03_v0003ms_** or **_S4HANA_2021_ISS_v0001ms_** or **_S42022SPS00_v0001ms_**
    - For `<storageAccountAccessKey>`, use your storage account's access key. You found this value in the Download SAP media section
    - For `<containerBasePath>`, use the path to your `sapbits` container. You found this value in the Download SAP media section. The format is `https://<your-storage-account>.blob.core.windows.net/sapbits`

## Next steps

- [Find SAP and HANA passwords](manage-virtual-instance.md) through Azure Center for SAP solutions
- [Monitor SAP system from Azure portal](monitor-portal.md)
- [Manage a Virtual Instance for SAP solutions](manage-virtual-instance.md)
