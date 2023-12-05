---
title: Get started with manual deployment of automation framework
description: Manually deploy the SAP on Azure Deployment Automation Framework using an example configuration and sample parameter files.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-ansible, devx-track-azurecli
---

# Get started with manual deployment

Along with [automated deployment](get-started.md), you can also do manual deployment of the [SAP on Azure Deployment Automation Framework](deployment-framework.md). Use this example configuration and sample parameter files to get started.

> [!TIP]
> This guide covers only how to perform a **manual** deployment. If you want to get started quickly, see the [**automated** deployment guide](get-started.md) instead.

These steps reference and use the [default naming convention](naming.md) for the automation framework. Example values are also used for naming throughout the code. For example, the deployer name is `DEMO-EUS2-DEP00-INFRASTRUCTURE`. In this example, the environment is a demo (`DEMO`), the region is **East US 2** (`EUS2`), and the deployer virtual network is `DEP00`. 

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure account with privileges to create a service principal. 
- A [download of the SAP software](software.md) in your Azure environment.

## Deployer setup

Before you begin, [check you're in the correct Azure subscription](#check-azure-subscription). Then, set up your deployer:

1. [Download and install Terraform](#download-terraform). 
1. [Clone and configure the automation framework repository](#set-up-repository) on the deployer. 
1. [Initialize Terraform](#initialize-terraform)
1. [Get your SSH keys](#get-ssh-keys) for use in the rest of your deployment.
### Check Azure subscription

Verify that you're using the appropriate Azure subscription:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. [Open Azure Cloud Shell](https://shell.azure.com/).

1. Check that you're in the subscription you want to use:

    ```azurecli-interactive
    az account list --output=table | grep -i true
    ```

1. If necessary, [change the active subscription](/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription) to the subscription you want to use. 

### Download Terraform

Download Terraform to your environment:

1. Create and navigate to a new directory, `bin`.

    ```azurecli-interactive
    mkdir -p ~/bin; cd $_
    ```

1. Retrieve the appropriate Terraform binary. For example:

    ```azurecli-interactive
    wget  https://releases.hashicorp.com/terraform/0.14.7/terraform_0.14.7_linux_amd64.zip
    ```

1. Unzip the Terraform binary. For example:

    ```azurecli-interactive
    unzip terraform_0.14.7_linux_amd64.zip
    ```

1. Verify your Terraform download:

    ```azurecli-interactive
    hash terraform
    ```

1. Create a directory for your SAP automated deployment.

    ```azurecli-interactive
    mkdir -p ~/Azure_SAP_Automated_Deployment; cd $_
    ```

## Set up repository

Clone and configure the [automation framework repository](https://github.com/Azure/sap-automation).

1. Clone the repository from GitHub:

    ```azurecli-interactive
    git clone https://github.com/Azure/sap-automation.git
    ```

1. Navigate to the `sap-automation` folder.

    ```azurecli-interactive
    cd  ~/Azure_SAP_Automated_Deployment/sap-automation
    ```

1. Optionally, check out a different branch than the main branch. The main branch for the repository is the default.
    
    1. Replace `<branch>` with the branch name or commit hash you want to use.

        ```azurecli
        git checkout <branch>
        ```

    1. Check that your branch is at the expected revision.

        ```azurecli-interactive
        git rev-parse HEAD
        ```

### Initialize Terraform

1. Create a working directory. The directory name must observe the [default naming convention](naming.md). For example:

    ```azurecli-interactive
    mkdir -p ~/Azure_SAP_Automated_Deployment/WORKSPACES/DEPLOYER/DEMO-EUS2-DEP00-INFRASTRUCTURE; cd $_
    ```

1. Create the JSON parameter file.

    ```azurecli-interactive
    cat <<EOF > DEMO-EUS2-DEP00-INFRASTRUCTURE.json
    {
      "infrastructure": {
        "environment"                         : "DEMO",
        "region"                              : "eastus2",
        "vnets": {
          "management": {
            "name"                            : "DEP00",
            "address_space"                   : "10.0.0.0/25",
            "subnet_mgmt": {
              "prefix"                        : "10.0.0.64/28"
            },
            "subnet_fw": {
              "prefix"                        : "10.0.0.0/26"
            }
          }
        }
      },
      "options": {
        "enable_deployer_public_ip"           : true
      },
      "firewall_deployment"                   : true
    }
    EOF
    ```

1. Initialize Terraform.

    ```azurecli-interactive
    terraform init  ../../../sap-automation/deploy/terraform/bootstrap/sap_deployer/
    ```

1. Create a Terraform execution plan that follows the default naming convention.

    ```azurecli-interactive
    terraform plan                                                                    \
                    --var-file=DEMO-EUS2-DEP00-INFRASTRUCTURE.json                    \
                    ../../../sap-automation/deploy/terraform/bootstrap/sap_deployer/
    ```

1. Apply your Terraform execution plan to deploy the resources.

    ```azurecli-interactive
    terraform apply --auto-approve                                                    \
                    --var-file=DEMO-EUS2-DEP00-INFRASTRUCTURE.json                    \
                    ../../../sap-automation/deploy/terraform/bootstrap/sap_deployer/
    ```

1. Note the output.

### Get SSH keys

1. Using the output from the [Terraform deployment](#initialize-terraform), note the values for the following fields.

    1. Public IP address: `deployer_public_ip_address`.

    1. Key vault's username: `deployer_kv_user_name`.

    1. Private key vault's name: `deployer_kv_prvt_name`.

    1. Public key's name: `deployer_public_key_secret_name`.

    1. Private key's name: `deployer_private_key_secret_name`.

1. Run the post-processing script.

    ```azurecli-interactive
    ./post_deployment.sh
    ```

1. Extract the private SSH key:
    
    ```azurecli-interactive
    az keyvault secret show               \
      --vault-name DEMOEUS2DEP00userE27   \
      --name DEMO-EUS2-DEP00-sshkey     | \
      jq -r .value > sshkey
    
    ```

1. Extract the public SSH key:
    
    ```azurecli-interactive
    az keyvault secret show               \
      --vault-name DEMOEUS2DEP00userF6A   \
      --name DEMO-EUS2-DEP00-sshkey-pub | \
      jq -r .value > sshkey.pub
    
    ```

1. Download the private and public key pair. In the Cloud Shell menu, select **Upload/Download files** &gt; **Download**.

## Service principal configuration

The deployer uses a service principal to deploy resources into a subscription. 

1. Sign in to the Azure CLI.

    ```azurecli-interactive
    az login
    ```

1. Create a service principal. Be sure to replace `<subscription-id>` with your Azure subscription identifier. Also replace `<sp-name>` with a name for your service principal.

    ```azurecli-interactive
    az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<subscription-id>" --name="<sp-name>"
    ```

1. Note the output, which contains information about the service principal. Copy down the values of the following fields:

    1. Application identifier: `appId`.

    1. Password: `password`.

    1. Tenant identifier: `tenant`.

1. Create a role assignment for the service principal. Make sure to replace `<appId>` with the application identifier you noted in the previous step.

    ```azurecli-interactive
    az role assignment create --assignee <appId> --role "User Access Administrator" --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>
    ```

1. Add keys for the service principal to the key vault as follows. Be sure to replace the placeholder values with the information you noted in previous steps. Replace `<environment>` with the name of your environment, such as `DEMO`. 

    ```azurecli-interactive
    az keyvault secret set --name "<environment>-subscription-id" --vault-name "<deployer_kv_user_name>" --value "<subscription-id>";
    az keyvault secret set --name "<environment>-tenant-id"       --vault-name "<deployer_kv_user_name>" --value "<tenant>";
    az keyvault secret set --name "<environment>-client-id"       --vault-name "<deployer_kv_user_name>" --value "<appId>";
    az keyvault secret set --name "<environment>-client-secret"   --vault-name "<deployer_kv_user_name>" --value "<password>";
    ```

## Library configuration

1. Sign in to the deployer using your SSH client and the SSH keys that you retrieved during the [deployer setup](#get-ssh-keys). If you're using PuTTY as your SSH client, convert the SSH keys to `.ppk` format before using.

1. Navigate to where you cloned the automation framework repository.

    ```bash
    cd  ~/Azure_SAP_Automated_Deployment/sap-automation
    ```

1. Optionally, check out a different branch than the main branch. The main branch for the repository is the default.
    
    1. Replace `<branch>` with the branch name or commit hash you want to use.

        ```azurecli
        git checkout <branch>
        ```

    1. Check that your branch is at the expected revision.

        ```azurecli-interactive
        git rev-parse HEAD
        ```

1. Create a working directory.

    ```bash
    mkdir -p ~/Azure_SAP_Automated_Deployment/WORKSPACES/LIBRARY/DEMO-EUS2-SAP_LIBRARY; cd $_
    ```

1. Create the JSON configuration file.

    ```bash
    cat <<EOF > DEMO-EUS2-SAP_LIBRARY.json
    {
      "infrastructure": {
        "environment"                         : "DEMO",
        "region"                              : "eastus2"
      },
      "deployer": {
        "environment"                         : "DEMO",
        "region"                              : "eastus2",
        "vnet"                                : "DEP00"
      }
    }
    EOF
    ```

1. Initialize Terraform.

    ```bash
    terraform init  ../../../sap-automation/deploy/terraform/bootstrap/sap_library/
    ```

1. Create a Terraform execution plan that follows the default naming convention.

    ```bash
    terraform plan                                                                  \
                --var-file=DEMO-EUS2-SAP_LIBRARY.json                           \
                ../../../sap-automation/deploy/terraform/bootstrap/sap_library

    ```

1. Apply your Terraform execution plan to deploy the resources.

    ```bash
    terraform apply --auto-approve                                                  \
                --var-file=DEMO-EUS2-SAP_LIBRARY.json                           \
                ../../../sap-automation/deploy/terraform/bootstrap/sap_library/

    ```

## Reinitialize deployment

Reinitialize both the [deployer](#reinitialize-deployer) and the [SAP library](#reinitialize-sap-library).

### Reinitialize deployer

1. Stay signed in to your deployer in the SSH client. Or, sign in again. 

1. Navigate to the working directory that you created.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LOCAL/DEMO-EUS2-DEP00-INFRASTRUCTURE
    ```

1. Create another parameter file called `backend`. Again, follow the default naming conventions. For `resource_group_name`, use the name of the resource group where the storage account with your Terraform state files (`.tfstate`) is located. For `storage_account_name`, replace `<tfstate_storage_account_name>` with the name of the storage account from the SAP Library deployment for `.tfstate` files. For `key`, combine the deployer's resource group name with the extension `.terraform.tfstate`. For example:

    ```bash
    cat <<EOF > backend
    resource_group_name   = "DEMO-EUS2-SAP_LIBRARY"
    storage_account_name  = "<tfstate_storage_account_name>"
    container_name        = "tfstate"
    key                   = "DEMO-EUS2-DEP00-INFRASTRUCTURE.terraform.tfstate"
    EOF
    ```

1. Initialize Terraform again.

    ```bash
    terraform init  --backend-config backend                                        \
                    ../../../sap-automation/deploy/terraform/run/sap_deployer/
    ```

1. When prompted **Do you want to copy existing state to the new backend?**, enter `yes`.

1. Remove the local state file.

    ```bash
    rm terraform.tfstate*
    ```

1. Create a Terraform execution plan. Again, follow the default naming conventions. For example:

    ```bash
    terraform plan                                                                  \
                    --var-file=DEMO-EUS2-DEP00-INFRASTRUCTURE.json                  \
                    ../../../sap-automation/deploy/terraform/run/sap_deployer/
    ```
    
1. Apply the Terraform execution plan. For example:

    ```bash
    terraform apply --auto-approve                                                  \
                    --var-file=DEMO-EUS2-DEP00-INFRASTRUCTURE.json                  \
                    ../../../sap-automation/deploy/terraform/run/sap_deployer/
    ```

### Reinitialize SAP Library

1. Stay signed in to your deployer in the SSH client. Or, sign in again. 

1. Navigate to the working directory that you created.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LIBRARY/DEMO-EUS2-SAP_LIBRARY
    ```

1. Create another parameter file called `backend`. Again, follow the default naming conventions. For `resource_group_name`, use the name of the resource group where the storage account with your Terraform state files (`.tfstate`) is located. For `storage_account_name`, replace `<tfstate_storage_account_name>` with the name of the storage account from the SAP Library deployment for `.tfstate` files. For `key`, combine the deployer's resource group name with the extension `.terraform.tfstate`. For example:

    ```bash
    cat <<EOF > backend
    resource_group_name   = "DEMO-EUS2-SAP_LIBRARY"
    storage_account_name  = "<tfstate_storage_account_name>"
    container_name        = "tfstate"
    key                   = "DEMO-EUS2-SAP_LIBRARY.terraform.tfstate"
    EOF
    ```

1. Add a new key-value pair immediately after the opening bracket (`{`) of the parameter file `backend`. For `tfstate_resource_id`, use the resource identifier for the Terraform state file storage account. For `deployer_tfstate_key`, use the key name for the deployer state file. For example:
    
    ```bash
    {
        "tfstate_resource_id"                   : "<identifier>",
        "deployer_tfstate_key"                  : "<key>",
        "infrastructure": {
            ...
    }
    ```

1. Initialize Terraform again.

    ```bash
    terraform init  --backend-config backend                                          \
                    ../../../sap-automation/deploy/terraform/run/sap_library/
    ```

1. When prompted **Do you want to copy existing state to the new backend?**, enter `yes`.

1. Remove the local state file.

    ```bash
    rm terraform.tfstate*
    ```

1. Create a Terraform execution plan. Again, follow the default naming conventions. For example:

    ```bash
    terraform plan                                                                    \
                    --var-file=DEMO-EUS2-SAP_LIBRARY.json                             \
                    ../../../sap-automation/deploy/terraform/run/sap_library/
    ```

1. Apply the Terraform execution plan. For example:

    ```bash
    terraform apply --auto-approve                                                    \
                    --var-file=DEMO-EUS2-SAP_LIBRARY.json                             \
                    ../../../sap-automation/deploy/terraform/run/sap_library/
    ```

## Deploy workload virtual network

Next, deploy the SAP workload virtual network.

1. Stay signed in to your deployer in the SSH client. Or, sign in again. 

1. Create a working directory. Follow the default naming conventions.

    ```bash
    mkdir -p ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEMO-EUS2-SAP00-INFRASTRUCTURE; cd $_
    ```

1. Create a parameter file called `backend`. For `resource_group_name`, use the name of the resource group where the storage account with your Terraform state files (`.tfstate`) is located. For `storage_account_name`, replace `<tfstate_storage_account_name>` with the name of the storage account from the SAP Library deployment for `.tfstate` files. For `key`, combine the deployer's resource group name with the extension `.terraform.tfstate`. For example:

    ```bash
    cat <<EOF > backend
    resource_group_name   = "DEMO-EUS2-SAP_LIBRARY"
    storage_account_name  = "<tfstate_storage_account_name>"
    container_name        = "tfstate"
    key                   = "DEMO-EUS2-SAP00-INFRASTRUCTURE.terraform.tfstate"
    EOF
    ```

1. Initialize Terraform again.

    ```bash
    terraform init  --backend-config backend                                        \
                    ../../../sap-automation/deploy/terraform/run/sap_landscape/
    ```

1. Create a Terraform execution plan. Again, follow the default naming conventions. For example:

    ```bash
    terraform plan                                                                  \
                --var-file=DEMO-EUS2-SAP00-INFRASTRUCTURE.json                  \
                ../../../sap-automation/deploy/terraform/run/sap_landscape/
    ```

1. Apply the Terraform execution plan. For example:

    ```bash
    terraform apply --auto-approve                                                  \
                    --var-file=DEMO-EUS2-SAP00-INFRASTRUCTURE.json                  \
                    ../../../sap-automation/deploy/terraform/run/sap_landscape/
    ```

## SAP deployment unit

Next, set up the SAP deployment unit.

1. Stay signed in to your deployer in the SSH client. Or, sign in again

1. Create a working directory. Follow the default naming conventions.

    ```bash
    mkdir -p ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEMO-EUS2-SAP00-X00; cd $_
    ```

1. Create another parameter file called `backend`. For `resource_group_name`, use the name of the resource group where the storage account with your Terraform state files (`.tfstate`) is located. For `storage_account_name`, replace `<tfstate_storage_account_name>` with the name of the storage account from the SAP Library deployment for `.tfstate` files. For `key`, combine the deployer's resource group name with the extension `.terraform.tfstate`. For example:

    ```bash
    cat <<EOF > backend
    resource_group_name   = "DEMO-EUS2-SAP_LIBRARY"
    storage_account_name  = "<tfstate_storage_account_name>"
    container_name        = "tfstate"
    key                   = "DEMO-EUS2-SAP00-X00.terraform.tfstate"
    EOF
    ```

1. Create a JSON parameter file with input parameters as follows. Make sure to replace the sample values with your own.

    ```bash
    cat <<EOF > DEMO-EUS2-SAP00-X00.json
    {
      "tfstate_resource_id"                   : "<resource-id>",
      "deployer_tfstate_key"                  : "DEMO-EUS2-DEP00-INFRASTRUCTURE.terraform.tfstate",
      "landscape_tfstate_key"                 : "DEMO-EUS2-SAP00-INFRASTRUCTURE.terraform.tfstate",
      "infrastructure": {
        "environment"                         : "DEMO",
        "region"                              : "eastus2",
        "vnets": {
          "sap": {
            "name"                            : "SAP00",
            "subnet_db": {
              "prefix"                        : "0.0.0.0/28"
            },
            "subnet_web": {
              "prefix"                        : "0.0.0.0/28"
            },
            "subnet_app": {
              "prefix"                        : "0.0.0.0/27"
            },
            "subnet_admin": {
              "prefix"                        : "0.0.0.0/27"
            }
          }
        }
      },
      "databases": [
        {
          "platform"                          : "HANA",
          "high_availability"                 : false,
          "size"                              : "S4Demo",
          "os": {
            "publisher"                       : "SUSE",
            "offer"                           : "sles-sap-12-sp5",
            "sku"                             : "gen2",
            "version"                         : "latest"
          }
        }
      ],
      "application": {
        "enable_deployment"                   : true,
        "sid"                                 : "X00",
        "scs_instance_number"                 : "00",
        "ers_instance_number"                 : "10",
        "scs_high_availability"               : false,
        "application_server_count"            : 3,
        "webdispatcher_count"                 : 1,
        "authentication": {
          "type"                              : "key",
          "username"                          : "azureadm"
        }
      }
    }
    EOF
    ```

1. Initialize Terraform again.

    ```bash
    terraform init  --backend-config backend                                        \
                    ../../../sap-automation/deploy/terraform/run/sap_system/
  
    ```

1. Create a Terraform execution plan. Again, follow the default naming conventions. For example:

    ```bash
    terraform plan                                                                  \
                    --var-file=DEMO-EUS2-SAP00-X00.json                             \
                    ../../../sap-automation/deploy/terraform/run/sap_system/
    ```

1. Apply the Terraform execution plan. For example:

    ```bash
    terraform apply --auto-approve                                                  \
                    --var-file=DEMO-EUS2-SAP00-X00.json                             \
                    ../../../sap-automation/deploy/terraform/run/sap_system/
    ```

## Ansible configuration

Configure your setup by executing Ansible playbooks. These playbooks are located in the automation framework repository in `/sap-automation/deploy/ansible`.

| Filename          | Description                        |
| ----------------- | ---------------------------------- |
| `playbook_01_os_base_config.yaml` | Base operating system (OS) configuration |
| `playbook_02_os_sap_specific_config.yaml ` | SAP-specific OS configuration |
| `playbook_03_bom_processing.yaml` | SAP Bill of Materials (BOM) processing software download |
| `playbook_04a_sap_scs_install.yaml   ` | SAP central services (SCS) installation |
| `playbook_05a_hana_db_install.yaml ` | SAP HANA database installation |
| `playbook_06a_sap_dbload.yaml` | Database loader |
| `playbook_06b_sap_pas_install.yaml` | SAP primary application server (PAS) installation |
| `playbook_06c_sap_app_install.yaml` | SAP application server installation |
| `playbook_06d_sap_web_install.yaml` | SAP web dispatcher installation |
| `playbook_06_00_00_pacemaker.yaml` | Pacemaker cluster configuration |
| `playbook_06_00_01_pacemaker_scs.yaml` | Pacemaker configuration for SCS | 
| `playbook_06_00_03_pacemaker_hana.yaml` | Pacemaker configuration for SAP HANA database |

To execute a playbook or multiple playbooks, use the command `ansible-playbook` as follows. Be sure to change all placeholder values to your own information:

- Change `<your-sapbits-path>` to the path to your storage account `sapbits` for the SAP Library.
- Change `<azure-admin>` to your Azure administrator username.
- Change `<ssh-key`> to the private SSH key you want to use.
- Change other values under `--extra-vars` as needed for your settings.

If you experience issues, make sure you've [downloaded the SAP software](software.md) to your Azure environment.

```azurecli-interactive
export           ANSIBLE_HOST_KEY_CHECKING=False
# export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=Yes
# export           ANSIBLE_KEEP_REMOTE_FILES=1


ansible-playbook                                                                                                      \
  --inventory   new-hosts.yaml                                                                                        \
  --user        <azure-admin>                                                                                              \
  --private-key <ssh-key>                                                                                                \
  --extra-vars="{                                                                                                     \
                  \"bom_base_name\":                \"HANA_2_00_053_v001\",                                           \
                  \"download_templates\":           \"false\",                                                        \
                  \"sapbits_location_base_path\":   \"<your-sapbits-path>",        \
                  \"target_media_location\":        \"/usr/sap/install\",                                             \
                  \"sap_sid\":                      \"X00\",                                                          \
                  \"hdb_sid\":                      \"HDB\"                                                           \
                }"                                                                                                    \
~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_00_transition_start_for_sap_install_refactor.yaml     \
~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_01_os_base_config.yaml                       \
~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_02_os_sap_specific_config.yaml               \
~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_03_bom_processing.yaml                       \
~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_04a_sap_scs_install.yaml                     \
~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05a_hana_db_install.yaml                     \
~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_06a_sap_dbload.yaml                          \
~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_06b_sap_pas_install.yaml                     \
~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_06c_sap_app_install.yaml                     \
~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_06d_sap_web_install.yaml

```

## Next steps

> [!div class="nextstepaction"]
> [Get started quickly with an automated deployment](get-started.md)
