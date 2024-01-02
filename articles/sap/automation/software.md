---
title: Download SAP software for the automation framework
description: Download the SAP software to your Azure environment by using Ansible playbooks to use SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-ansible
---

# Download SAP software

You need a copy of the SAP software before you can use [SAP Deployment Automation Framework](deployment-framework.md). [Prepare your Azure environment](#configure-a-key-vault) so that you can put the SAP media in your storage account. Then, [download the SAP software by using Ansible playbooks](#download-sap-software).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An SAP user account (SAP-User or S-User account) with software download privileges.

## Configure a key vault

First, configure your deployer key vault secrets. For this example configuration, the resource group is `DEMO-EUS2-DEP00-INFRASTRUCTURE` or `DEMO-SCUS-DEP00-INFRASTRUCTURE`.

1. [Sign in to the Azure CLI](/cli/azure/authenticate-azure-cli) with the account you want to use.

    ```azurecli
    az login
    ```

1. Add a secret with the username for your SAP user account. Replace `<keyvault-name>` with the name of your deployer key vault. Also replace `<sap-username>` with your SAP username.

    ```azurecli
    export key_vault=<vaultID>
    sap_username=<sap-username>

    az keyvault secret set --name "S-Username" --vault-name $key_vault --value "${sap_username}";
    ```

1. Add a secret with the password for your SAP user account. Replace `<keyvault-name>` with the name of your deployer key vault. Also replace `<sap-password>` with your SAP password.

    ```azurecli
    sap_user_password="<sap-password>
    az keyvault secret set --name "S-Password" --vault-name "${key_vault}" --value "${sap_user_password}";
    ```

1. Two other secrets are needed in this step for the storage account. The automation framework automatically sets up `sapbits`. It's always a good practice to verify whether they existed in your deployer key vault or not.

    ```text
    sapbits-access-key
    sapbits-location-base-path
    ```

## Download SAP software

Next, [configure your SAP parameters file](#configure-the-parameters-file) for the download process. Then, [download the SAP software by using Ansible playbooks](#download-sap-software).

### Configure the parameters file

To configure the SAP parameters file:

1. Create a new directory called `BOMS`.

    ```bash
    mkdir -p ~/Azure_SAP_Automated_Deployment/WORKSPACES/BOMS; cd $_
    ```

1. Create the SAP parameters YAML file.

    ```bash
    cat <<EOF > sap-parameters.yaml
    ---
    bom_base_name:               S41909SPS03_v0010ms
    kv_name: Name of your Management/Control Plane keyvault
    ..
    EOF
    ```

1. Open `sap-parameters.yaml` in an editor.

    ```bash
    vi sap-parameters.yaml
    ``` 

1. Update the following parameters:

    1. Change the value of `bom_base_name` to `S41909SPS03_v0010ms`.

    1. Change the value of `kv_name` to the name of the deployer key vault.
   
    1. (If needed) Change the value of `secret_prefix` to match the prefix in your environment (for example, `DEV-WEEU-SAP`).

### Run the Ansible playbooks

You're ready to run the Ansible playbooks. One way you can run the playbooks is to use the validator test menu.

1. Run the download menu script:

    ```bash
    ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/download_menu.sh
    ```

1. Select the playbook to run. For example:
    
    ```text
    1) BoM Downloader
    2) Quit
    Please select playbook: 
    ```

Another option is to run the Ansible playbooks by using the `ansible-playbook` command.

```bash
ansible-playbook                                                                                   \
  --user        azureadm                                                                           \
  --extra-vars="@sap-parameters.yaml"                                                              \
  ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_bom_downloader.yaml
```

## Next step

> [!div class="nextstepaction"]
> [Deploy the SAP infrastructure](deploy-system.md)
