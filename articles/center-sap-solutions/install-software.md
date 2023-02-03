---
title: Install SAP software (preview)
description: Learn how to install software on your SAP system created using Azure Center for SAP solutions.
ms.service: azure-center-sap-solutions
ms.topic: how-to
ms.date: 10/19/2022
author: lauradolan
ms.author: ladolan
#Customer intent: As a developer, I want to install SAP software so that I can use Azure Center for SAP solutions.
---

# Install SAP software (preview)

[!INCLUDE [Preview content notice](./includes/preview.md)]

After you've created infrastructure for your new SAP system using *Azure Center for SAP solutions*, you need to install the SAP software.

In this how-to guide, you'll learn how to install the SAP system whose infrastructure was created through ACSS. You can either [install the SAP software through ACSS with ACSS installation wizard](#option-1-install-software-through-ACSS) or [Install the SAP software outside ACSS and detect the installed system ](#option-2-install-software-outside-ACSS). 


## Option 1: Install software through ACSS

Please go through the pre-requisites before beginning the SAP installation on ACSS.

## Prerequisites

- An Azure subscription.
- An Azure account with **Contributor** role access to the subscriptions and resource groups in which the VIS exists.
- A **User-assigned managed identity** with **Storage Blob Data Reader** and **Reader and Data Access** roles on the Storage Account which has the SAP software. 
- A [network set up for your infrastructure deployment](prepare-network.md).
- A deployment of S/4HANA infrastructure.
- The SSH private key for the virtual machines in the SAP system. You generated this key during the infrastructure deployment.
- If you are installing a SAP System through ACSS, you should have the SAP installation media available in a storage account. You can refer [this section](acquire-sap-installation-media.md) to learn how to acquire the SAP installation media.
- If you're installing a Highly Available (HA) SAP system, get the Service Principal identifier (SPN ID) and password to authorize the Azure fence agent (fencing device) against Azure resources. For more information, see [Use Azure CLI to create an Azure AD app and configure it to access Media Services API](/azure/media-services/previous/media-services-cli-create-and-configure-aad-app). For an example, see the Red Hat documentation for [Creating an Azure Active Directory Application](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/deploying_red_hat_enterprise_linux_7_on_public_cloud_platforms/configuring-rhel-high-availability-on-azure_cloud-content#azure-create-an-azure-directory-application-in-ha_configuring-rhel-high-availability-on-azure).
    
    To avoid frequent password expiry, use the Azure Command-Line Interface (Azure CLI) to create the Service Principal identifier and password instead of the Azure portal. 


## Install Software

To install the SAP software on Azure, use the Azure Center for SAP solutions installation wizard.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Virtual Instance for SAP solutions**.

1. Select your Virtual Instance for SAP solutions (VIS) instance.

1. On the **Overview** page for the VIS resource, select **Install SAP software**.

1. In the **Prerequisites** tab of the wizard, review the prerequisites. Then, select **Next**.

1. On the **Software** tab, provide information about your SAP media.

    1. For **Have you uploaded the software to an Azure storage account?**, select **Yes**.

    1. For **Software version**, use the **SAP S/4HANA 1909 SPS03** or **SAP S/4HANA 2020 SPS 03** or **SAP S/4HANA 2021 ISS 00** . Please note only those versions will light up which are supported with the OS version that was used to deploy the infrastructure previously. 

    1. For **BOM directory location**, select **Browse** and find the path to your BOM file. For example, `https://<your-storage-account>.blob.core.windows.net/sapbits/sapfiles/boms/S41909SPS03_v0010ms.yaml`.

    1. For High Availability (HA) systems only, enter the client identifier for the STONITH Fencing Agent service principal for **Fencing client ID**.

    1. For High Availability (HA) systems only, enter the password for the Fencing Agent service principal for **Fencing client password**.

    1. Select **Next**.

1. On the **Review + install** tab, review the software settings. 

1. Select **Install** to proceed with installation. 

1. Wait for the installation to complete. The process takes approximately three hours. You can see the progress, along with estimated times for each step, in the wizard.

1. After the installation completes, sign in with your SAP system credentials. Refer to [this section](manage-virtual-instance.md) to find the SAP system and HANA DB credentials for the newly installed system.



## Option 2: Install Software Outside ACSS

Please go through the pre-requisites before starting to detect an already installed SAP system through ACSS.

## Prerequisites

- An Azure subscription.
- An Azure account with **Contributor** role access to the subscriptions and resource groups in which the VIS exists.
- A previously created User-assigned managed identity during infrastructure deployment which has "Contributor role" access on the Subscription or atleast on all resource groups(Compute, Network, Storage) which the SAP System is part of.
- Infrastructure for the SAP System has been created through Azure Center for SAP Solutions and **has not been changed**. However, you can add fully installed application servers to the system before clicking "Detect" and the SAP system with additional application servers wil also be detected. 
- If you have added additional application servers to this Virtual Instance for SAP Solutions since infrastructure deployment, the previously created user assigned managed identity shall have the Contributor role access on the Subscription or atleast on the resource group under which this new application server resides in.
- The number of application virtual machines installed should not be less than the number created during the infrastructure deployment phase in ACSS . However, as noted previously, you can have additional application servers installed which will also be detected.
- SAP System (and underlying infrastructure resources) is up and running


## Supported Scenarios

Only the following scenarios are supported -

- Infrastructure for S4/HANA was created through ACSS and S4/HANA Application was installed outside ACSS ( through a different tool)
- Only S4/HANA installation done outside ACSS can be detected. If you have installed a different SAP Application than S4/HANA, the detection will fail.
- If you want to install a fresh S4/HANA software on the infrastructure deployed by ACSS, use the "Install SAP Software with ACSS" option instead.


## Detect Software

To detect a SAP Software installed outside ACSS and update the VIS metadata:

1. Sign in to the [Azure portal](https://portal.azure.com). Make sure to sign in with an Azure account that has Contributor role access to the subscription or resource groups where the SAP system exists.

1. Search for and select Azure Center for SAP solutions in the Azure portal's search bar.

1. Select Virtual Instances for SAP Solutions to select the VIS you have installed already and want to detect

1. On the VIS overview page, click "confirm already installed software"

    1. Read all the instructions and click Confirm

1. This will install extension on ASCS, APP and DB Virtual machines and start discovering SAP metadata.

1. Wait for the VIS resource to be detected and populated with the metadata. The VIS detection will be completed after all SAP system components have been detected. 

You can now review the VIS resource in the Azure portal. The resource page shows the SAP system resources, and information about the system.


## Limitations

The following are known limitations and issues.

### Application Servers

You can install a maximum of 10 Application Servers, excluding the Primary Application Server. 

### SAP package version changes

1. When SAP changes the version of packages for a component in the BOM, you might encounter problems with the automated installation shell script. It's recommended to download your SAP installation media as soon as possible to avoid issues.

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

1. Reupload the BOM file(s) in the subfolder (`S41909SPS03_v0011ms` or `S42020SPS03_v0003ms` or `S4HANA_2021_ISS_v0001ms`) of the "boms" folder 

### Special characters like $ in S-user password is not accepted while downloading the BOM. 

1. Follow the step by step instructions upto cloning the 'SAP Automation repository from GitHub' in **Download SAP media** section.

1. Before running the Ansible playbook set the SPASS environment variable below. Single quotes should be present in the below command

    ```bash
    export SPASS='password_with_special_chars'
    ```
1. Then run the ansible playbook

```azurecli
    ansible-playbook ./sap-automation/deploy/ansible/playbook_bom_downloader.yaml -e "bom_base_name=S41909SPS03_v0011ms" -e "deployer_kv_name=dummy_value" -e "s_user=<username>" -e "s_password=$SPASS" -e "sapbits_access_key=<storageAccountAccessKey>" -e "sapbits_location_base_path=<containerBasePath>"
 ```
  
- For `<username>`, use your SAP username.
- For `<bom_base_name>`, use the SAP Version you want to install i.e. **_S41909SPS03_v0011ms_** or **_S42020SPS03_v0003ms_** or **_S4HANA_2021_ISS_v0001ms_**
- For `<storageAccountAccessKey>`, use your storage account's access key. You found this value in the Download SAP media section
- For `<containerBasePath>`, use the path to your `sapbits` container. You found this value in the Download SAP media section.

  The format is `https://<your-storage-account>.blob.core.windows.net/sapbits`

This should resolve the problem and you can proceed with next steps as described in the section.
## Next steps

- [Monitor SAP system from Azure portal](monitor-portal.md)
- [Manage a VIS](manage-virtual-instance.md)
