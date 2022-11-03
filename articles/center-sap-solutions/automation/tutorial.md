---
title: SAP on Azure Deployment Automation Framework hands-on lab
description: Hands-on lab for the SAP on Azure Deployment Automation Framework.
author: hdamecharla
ms.author: hdamecharla
ms.reviewer: kimforss
ms.date: 12/14/2021
ms.topic: tutorial
ms.service: virtual-machines-sap
---



# Enterprise Scale for SAP on Azure Deployment Automation Framework - Hands-on Lab

This tutorial shows how to do enterprise scaling for deployments using the [SAP on Azure Deployment Automation Framework](automation-deployment-framework.md). This example uses Azure Cloud Shell to deploy the control plane infrastructure. The deployer virtual machine (VM) creates the remaining infrastructure and SAP HANA configurations.

You'll perform the following tasks during this lab:

> [!div class="checklist"]
> * Deploy the Control Plane (Deployer Infrastructure & Library)
> * Deploy the Workload Zone (Landscape, System)
> * Download/Upload BOM
> * Configure standard and SAP-specific OS settings
> * Install HANA DB
> * Install SCS server
> * Load HANA DB
> * Install Primary Application Server

There are three main steps of an SAP deployment on Azure with the automation framework.

1. Preparing the region. This step deploys components to support the SAP automation framework in a specified Azure region. Some parts of this step are:
   1. Creating the deployment environment
   2. Creating shared storage for Terraform state files
   3. Creating shared storage for SAP installation media

2. Preparing the workload zone. This step deploys the workload zone components, such as the virtual network and key vaults.

3. Deploying the system. This step includes the infrastructure for the SAP system.

There are several workflows in the deployment automation process. However, this tutorial focuses on one workflow for ease of deployment. You can deploy this workflow,  the SAP S4 HANA standalone environment, using Bash. The tutorial describes the general hierarchy and different phases of the deployment.



### Environment Overview

The SAP on Azure deployment automation framework has two main components:

- Deployment infrastructure (control plane)
- SAP Infrastructure (SAP Workload)

The following diagram shows the dependency between the control plane and the application plane.

 :::image type="content" source="media/devops/automation-devops-tutorial-design.png" alt-text="DevOps tutorial infrastructure design":::

The framework uses Terraform for infrastructure deployment, and Ansible for the operating system and application configuration. The following diagram shows the logical separation of the control plane and workload zone.

:::image type="content" source="./media/deployment-framework/automation-diagram-full.png" alt-text="Diagram showing the SAP on Azure Deployment Automation Framework environment.":::



#### Management Zone

The management zone contains the control plane infrastructure from which other environments are deployed. Once the management zone is deployed, you rarely, if ever, need to redeploy.

:::image type="content" source="./media/deployment-framework/control-plane.png" alt-text="Diagram Control Plane.":::

The **Deployer** is the execution engine of the SAP automation framework. This  pre-configured virtual machine (VM) is used for executing Terraform and Ansible commands.

The **SAP Library** provides the persistent storage for the Terraform state files and the downloaded SAP installation media for the control plane.

You configure the deployer and library in a Terraform `.tfvars` variable file. See [configuring the control plane](automation-configure-control-plane.md)



#### Workload Zone

An SAP application typically has multiple deployment tiers. For example, you might have development, quality assurance, and production tiers. The SAP on Azure Deployment Automation Framework refers to these tiers as workload zones.

:::image type="content" source="./media/deployment-framework/workload-zone.png" alt-text="Workload zone.":::

The **SAP Workload zone** contains the networking and shared components for the SAP VMs. These components include route tables, network security groups, and virtual networks (VNets). The Landscape provides the opportunity to divide deployments into different environments. See [configuring the workload zone](automation-configure-workload-zone.md)

The system deployment consists of the virtual machines that will be running the SAP application, including the web, app, and database tiers. See [configuring the SAP system](automation-configure-system.md)



## Hands-On Lab



### Prerequisites

The [SAP on Azure Deployment Automation Framework repository](https://github.com/Azure/sap-automation) is available on GitHub.

You need an SSH client to connect to the Deployer. Use any SSH client that you feel comfortable with.



#### Review the Azure Subscription Quota

Ensure that your Microsoft Azure Subscription has a sufficient core quote for DdSV4 & EdsV4 family SKU in the elected region. About 50 cores each available for VM family should suffice.



#### S-User account for SAP software download

A valid SAP user account (SAP-User or S-User account) with software download privileges is required to download the SAP software.



## Set up Cloud Shell

1. Go to [Azure Cloud Shell](https://shell.azure.com)

1. Sign in your Azure account.

    ```cloudshell-interactive
    az login
    ```

    > [!NOTE]
    > Authenticate your login. Don't close the window until you're prompted.


   Validate that your active subscription and record your subscription ID:

    ```cloudshell-interactive
    az account list --query "[?isDefault].{Name: name, CloudName: cloudName, SubscriptionId: id, State: state, IsDefault: isDefault}" --output=table
    ```

    or

    ```cloudshell-interactive
    az account list --output=table | grep True
    ```

1. If necessary, change your active subscription.

    ```cloudshell-interactive
    az account set --subscription <Subscription ID>
    ```

    Validate that your active subscription changed:

    ```cloudshell-interactive
    az account list --query "[?isDefault].{Name: name, CloudName: cloudName, SubscriptionId: id, State: state, IsDefault: isDefault}" --output=table
    ```

1. Optionally remove all the deployment artifacts. Use when you want to remove all remnants of previous deployment artifacts.

    ```cloudshell-interactive

    cd ~

    rm -rf Azure_SAP_Automated_Deployment .sap_deployment_automation .terraform.d
    ```

1. Create the deployment folder and clone the repository.

    ```cloudshell-interactive
    mkdir -p ~/Azure_SAP_Automated_Deployment

    cd ~/Azure_SAP_Automated_Deployment

    git clone https://github.com/Azure/sap-automation.git
    ```

1. Optionally, validate the versions of Terraform and the Azure CLI available on your instance of the Cloud Shell.

    ```cloudshell-interactive
    ./sap-automation/deploy/scripts/helpers/check_workstation.sh
    ```

    To run the automation framework, update to the following versions.

    - `az` version 2.28.0 or higher

    - `terraform` version 1.1.4 or higher. [Upgrade using the Terraform instructions](https://www.terraform.io/upgrade-guides/0-12.html) as necessary.


## Create service principal

The SAP automation deployment framework uses service principals for deployment. Create a service principal for your control plane deployment as follows. Make sure to use an account with permissions to create service principals.

> [!NOTE]
> When choosing the name for your service principal, ensure that the name is unique within your Azure tenant.


1. Give the service principal contributor and user access administrator permissions.

    ```cloudshell-interactive
    export         subscriptionId="<subscriptionId>"
    export control_plane_env_code="MGMT"

    az ad sp create-for-rbac --role="Contributor"           \
      --scopes="/subscriptions/${subscriptionId}"           \
      --name="${control_plane_env_code}-Deployment-Account"
    ```

    Review the output. For example:

    ```json
    {
        "appId": "<AppId>",
        "displayName": "<environment>-Deployment-Account ",
        "name": "<AppId>",
        "password": "<AppSecret>",
        "tenant": "<TenantId>"
    }
    ```

2. Copy down the output details. Make sure to save the values for the following fields: `appId`, `password`, and `Tenant`.

    The output maps to the following parameters. You use these parameters in later steps, with automation commands.

    | **Parameter input name** | **Output name** |
    |--------------------------|-----------------|
    | `spn_id`                 | `appId`         |
    | `spn_secret`             | `password`      |
    | `tenant_id`              | `tenant`        |

3. Optionally assign the **User Access Administrator** role to the service principal.

    ```cloudshell-interactive
    export appId="<appId>"

    az role assignment create --assignee ${appId} \
      --role "User Access Administrator" \
      --scope /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}
    ```

> [!NOTE] 
> If you do not assign the User Access Adminstrator role to the Service Principal you will not be able to assign permissions using the automation.

## View configuration files

> [!IMPORTANT]
> Always treat the GitHub repository as read-only. Work in a copy of the `WORKSPACES` folder to make configuration changes. This method keeps the configuration stable if the repository changes.

1. Copy the sample configurations to a local workspace directory:

    ```cloudshell-interactive
    cd ~/Azure_SAP_Automated_Deployment

    cp -Rp ./sap-automation/training-materials/WORKSPACES .
    ```

2. Open VS Code from Cloud Shell

    ```cloudshell-interactive
    code .
    ```

    > [!NOTE]
    > Does not work in the Safari browser.


    Expand the **WORKSPACES** directory. There are five subfolders: **DEPLOYER**, **LANDSCAPE**, **LIBRARY**, **SYSTEM**, and **BOMS**. Expand each of these folders to find regional deployment configuration files.

    Find the appropriate four-character code that corresponds to the Azure region you're using.

    | Region Name        | Region Code |
    |--------------------|-------------|
    | Australia East     | AUEA        |
    | Canada Central     | CACE        |
    | Central US         | CEUS        |
    | East US            | EAUS        |
    | North Europe       | NOEU        |
    | South Africa North | SANO        |
    | Southeast Asia     | SOEA        |
    | UK South           | UKSO        |
    | West US 2          | WUS2        |

    Find the Terraform variable files in the appropriate subfolder. For example, the **DEPLOYER** terraform variable file might look like:

    ```terraform
    # The environment value is a mandatory field, it is used for partitioning the environments, for example, PROD and NP.
    environment="MGMT"
    # The location/region value is a mandatory field, it is used to control where the resources are deployed
    location="westeurope"

    # management_network_address_space is the address space for management virtual network
    management_network_address_space="10.10.20.0/25"
    # management_subnet_address_prefix is the address prefix for the management subnet
    management_subnet_address_prefix="10.10.20.64/28"
    # management_firewall_subnet_address_prefix is the address prefix for the firewall subnet
    management_firewall_subnet_address_prefix="10.10.20.0/26"

    deployer_enable_public_ip=true
    firewall_deployment=true
    ```

    Note the Terraform variable file locations for future edits during deployment.

## Deploy control plane

Use the [prepare_region](bash/automation-prepare-region.md) script to deploy the Deployer and Library. These deployment pieces make up the
control plane for a chosen automation area.

- The deployment goes through cycles of deploying the infrastructure, refreshing the state, and uploading the Terraform state files to the Library storage account. All of these steps are packaged into a single deployment script. The script needs the location of the configuration file for the Deployer and Library, and some other parameters as follows.

For example, choose **North Europe** as the deployment location, with the four-character name `NOEU` as previously described. The sample deployer configuration file `MGMT-NOEU-DEP00-INFRASTRUCTURE.tfvars` is in the `~/Azure_SAP_Automated_Deployment/WORKSPACES/DEPLOYER/MGMT-NOEU-DEP00-INFRASTRUCTURE` folder.

The sample SAP Library configuration file `MGMT-NOEU-SAP_LIBRARY.tfvars` is in the `~/Azure_SAP_Automated_Deployment/WORKSPACES/LIBRARY/MGMT-NOEU-SAP_LIBRARY` folder.

1. Create the Deployer and the SAP Library and add the Service Principal details to the deployment key vault.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES

    export subscriptionId="<subscriptionId>"
    export         spn_id="<appId>"
    export     spn_secret="<password>"
    export      tenant_id="<tenantId>"
    export       env_code="MGMT"
    export    region_code="<region_code>"

    export DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
    export ARM_SUBSCRIPTION_ID="${subscriptionId}"

    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                                                       \
        --deployer_parameter_file DEPLOYER/${env_code}-${region_code}-DEP00-INFRASTRUCTURE/${env_code}-${region_code}-DEP00-INFRASTRUCTURE.tfvars  \
        --library_parameter_file LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars                      \
        --subscription "${subscriptionId}"                                                                                                         \
        --spn_id "${spn_id}"                                                                                                                       \
        --spn_secret "${spn_secret}"                                                                                                               \
        --tenant_id "${tenant_id}"                                                                                                                 \
        --auto-approve
    ```

    > [!NOTE]
    > If you run into authentication issues,  run `az logout` to log out and clear the `token-cache`, then run `az login` to reauthenticate.

    Wait for the automation framework to run the Terraform operations `plan`, and `apply`.

    The deployment of the deployer might run for about 15-20 minutes.

    > [!IMPORTANT]
    > There will be some values that you need to note for upcoming steps. Please look for this text block in the output.

    ```text
    #########################################################################################
    #                                                                                       #
    #  Please save these values:                                                            #
    #     - Key Vault: MGMTNOEUDEP00user39B                                                 #
    #     - Deployer IP: x.x.x.x                                                            #
    #     - Storage Account: mgmtnoeutfstate53e                                             #
    #                                                                                       #
    #########################################################################################
    ```


1. Go to the [Azure portal](https://portal.azure.com).

    Select **Resource groups**. Look for new resource groups for the deployer infrastructure and library. For example, `MGMT-[region]-DEP00-INFRASTRUCTURE` and `MGMT-[region]-SAP_LIBRARY`.

    The contents of the Deployer and SAP Library resource group are shown below.

    :::image type="content" source="media/tutorial/deployer-resource-group.png" alt-text="Deployer resources":::

    :::image type="content" source="media/tutorial/sap-library-resource-group.png" alt-text="Library resources":::

    The Terraform state file is now placed in the storage account whose name contains 'tfstate'. The storage account has a container named 'tfstate' with the deployer and library state files. The contents of the 'tfstate' container after a successful control plane deployment can be seen below.

    :::image type="content" source="media/tutorial/terraform-state-files.png" alt-text="Control plane tfstate files":::

### Common issues and solutions

- If you get the following error for the deployer module creation, make sure that you're in the **WORKSPACES** directory when you run the script:

    ```text
    Incorrect parameter file.
    The file must contain the environment attribute!!
    ```

- The following error is transient. Rerun the same command, `prepare_region.sh`.

    ```text
    Error: file provisioner error
    ..
    timeout - last error: dial tcp
    ```


- If you have authentication issues directly after running the script `prepare_region.sh`, run:

    ```azurecli
    az logout

    az login
    ```


## Connect to deployer VM

After the control plane is deployed, the Terraform state is stored using a remote backend, `azurerm`. All secrets for connecting to the deployer VM are available in a key vault in the deployer's resource group.

Make sure you can connect to your deployer VM:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select or search for **Key vaults**.

1. On the **Key vault** page, find the deployer key vault. The name starts with `MGMT[REGION]DEP00user`. Filter by the **Resource group** or **Location** if necessary.

1. Select **Secrets** from the **Settings** section in the left pane.

1. Find and select the secret containing **sshkey**. It might look like this: `MGMT-[REGION]-DEP00-sshkey`

1. On the secret's page, select the current version. Then, copy the **Secret value**.

1. Open a plain text editor. Copy in the secret value.

1. Save the file where you keep SSH keys. For example, `C:\\Users\\<your-username>\\.ssh`.

1. Save the file. If you're prompted to **Save as type**, select **All files** if **SSH** isn't an option. For example, use `deployer.ssh`.

1. Connect to the deployer VM through any SSH client such as VSCode. Use the public IP address you noted earlier, and the SSH key you downloaded. For instructions on how to connect to the Deployer using VSCode see [Connecting to Deployer using VSCode](automation-tools-configuration.md#configuring-visual-studio-code). If you're using PuTTY, convert the SSH key file first using PuTTYGen.

> [!NOTE]
>The default username is *azureadm*

- Once connected to the deployer VM, you can now download the SAP software using the Bill of Materials (BOM).

## Connect to deployer VM when not using a public IP

For deployments without public IPs connectivity direct connectivity over the internet is not allowed. In these cases you may use either Azure Bastion, a jump box or perform the next step from a computer that has connectivity to the Azure virtual network.

The following example uses Azure Bastion.

Connect to the deployer by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the resource group containing the deployer virtual machine.

1. Connect to the virtual machine using Azure Bastion.

1. The default username is *azureadm*

1. Choose *SSH Private Key from Azure Key Vault*

1. Select the subscription containing the control plane.

1. Select the deployer key vault.

1. From the list of secrets choose the secret ending with *-sshkey*.

1. Connect to the virtual machine.

Run the following script to configure the deployer.

```bash
mkdir -p ~/Azure_SAP_Automated_Deployment

cd ~/Azure_SAP_Automated_Deployment

git clone https://github.com/Azure/sap-automation.git

cd sap-automation/deploy/scripts

./configure_deployer.sh
```

The script will install Terraform and Ansible and configure the deployer.

> [!IMPORTANT]
> The rest of the tasks need to be executed on the Deployer

## Get SAP software using the Bill of Materials (BOM)

The Automation Framework gives you tools to download software from SAP using the SAP Bill Of Materials (BOM). The software will be downloaded to the SAP library, which acts as the archive for all media required to deploy SAP.

The SAP Bill of Materials (BOM) mimics the SAP maintenance planner. There are relevant product identifiers and a set of download URLs.

A sample extract of a BOM file looks like:

```yaml

---
name:    'S41909SPS03_v0010'
target:  'S/4 HANA 1909 SPS 03'
version: 7

product_ids:
  dbl:       NW_ABAP_DB:S4HANA1909.CORE.HDB.ABAP
  scs:       NW_ABAP_ASCS:S4HANA1909.CORE.HDB.ABAP
  scs_ha:    NW_ABAP_ASCS:S4HANA1909.CORE.HDB.ABAPHA
  pas:       NW_ABAP_CI:S4HANA1909.CORE.HDB.ABAP
  pas_ha:    NW_ABAP_CI:S4HANA1909.CORE.HDB.ABAPHA
  app:       NW_DI:S4HANA1909.CORE.HDB.PD
  app_ha:    NW_DI:S4HANA1909.CORE.HDB.ABAPHA
  web:       NW_Webdispatcher:NW750.IND.PD
  ers:       NW_ERS:S4HANA1909.CORE.HDB.ABAP
  ers_ha:    NW_ERS:S4HANA1909.CORE.HDB.ABAPHA

materials:
  dependencies:
    - name:     HANA_2_00_055_v0005ms

  media:
    # SAPCAR 7.22
    - name:         SAPCAR
      archive:      SAPCAR_1010-70006178.EXE
      checksum:     dff45f8df953ef09dc560ea2689e53d46a14788d5d184834bb56544d342d7b
      filename:     SAPCAR
      permissions:  '0755'
      url:          https://softwaredownloads.sap.com/file/0020000002208852020

    # Kernel
    - name:         "Kernel Part I ; OS: Linux on x86_64 64bit ; DB: Database independent"
```


For this example configuration, the resource group is `MGMT-NOEU-DEP00-INFRASTRUCTURE`. The deployer key vault name would contain `MGMTNOEUDEP00user` in the name. You use this information to configure your deployer's key vault secrets.

1. Connect to your deployer VM for the following steps. A copy of the repo is now there.

1. Add a secret with the username for your SAP user account. Replace `<vaultID>` with the name of your deployer key vault. Also replace `<sap-username>` with your SAP username.

    ```bash
    export key_vault=<vaultID>
    sap_username=<sap-username>

    az keyvault secret set --name "S-Username" --vault-name $key_vault --value "${sap_username}";
    ```

1. Add a secret with the password for your SAP user account. Replace `<vaultID>` with your deployer key vault name, and `<sap-password>` with your SAP password.

    > [!NOTE]
    > The use of single quotes when setting `sap_user_password` is important. The use of special characters in the password can otherwise cause unpredictable results!

    ```azurecli
    sap_user_password='<sap-password>'

    az keyvault secret set --name "S-Password" --vault-name "${key_vault}" --value "${sap_user_password}";
    ```

1. Check the version number of the S/4 1909 SPS03 BOM for the active version.

    Record the results.

    ```bash

    ls -d ${DEPLOYMENT_REPO_PATH}/deploy/ansible/BOM-catalog/S41909SPS03* | xargs basename

    ```

1. Configure your SAP parameters file for the download process. Then, download the SAP software using Ansible playbooks. Execute the following commands:

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES
    cp -Rp ../sap-automation/training-materials/WORKSPACES/BOMS .
    cd BOMS

    vi sap-parameters.yaml
    ```

1. Update the `bom_base_name` with the name BOM previously identified.

    Your file should look similar to the following example configuration:

    ```yaml

    bom_base_name:                 S41909SPS03_v0010ms

    ```

1. Replace `<Deployer KeyVault Name>` with the name of the deployer resource group Azure key vault

    Your file should look similar to the following example configuration:

    ```yaml

    bom_base_name:                 S41909SPS03_v0010ms
    kv_name:                       <Deployer KeyVault Name>

    ```

1. Ensure `check_storage_account` is present and set to `false`. This value controls if the SAP Library will be checked for the file before downloading it from SAP.

    Your file should look similar to the following example configuration:

    ```yaml

    bom_base_name:                 S41909SPS03_v0010
    kv_name:                       <Deployer KeyVault Name>
    check_storage_account:         false

    ```

1. Execute the Ansible playbooks. One way you can execute the playbooks is to use the Downloader menu. Run the download_menu script.

    ```bash
    ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/download_menu.sh
    ```

1. Select which playbooks to execute.

    ```bash
    1) BoM Downloader
    3) Quit
    Please select playbook:
    ```

    Select the playbook `1) BOM Downloader` to download the SAP Software described in the BOM file into the storage account. Check that the `sapbits` container has all your media for installation.

## Collect workload zone information

1. Collect the following information in a text editor:

    > [!NOTE]
    > the following information was collected at the end of the **Deploy the Control Plane** phase.

    1. The name of the Terraform state file storage account in the Library resource group.
        - Following from the example above, the resource group would be *MGMT-NOEU-SAP_LIBRARY*.
        - The name of the storage account would contain *mgmtnoeutfstate*.

    1. The name of the Key Vault in the Deployer resource group.
        - Following from the example above, the resource group would be *MGMT-NOEU-DEP00-INFRASTRUCTURE*.
        - The name of the key vault would contain *MGMTNOEUDEP00user*.

    1. The Public IP address of the Deployer VM. Go to your deployer's resource group, open the deployer VM, and copy the public IP address.

1. Additionally, the following piece of information needs to be collected.

    1. The name of deployer state file can be found under Library resource group
        - Library resource group -> state storage account -> containers -> tfstate -> Copy the **name** of the Deployer state file.
        - Following from the example above, the name of the blob will be: *MGMT-NOEU-DEP00-INFRASTRUCTURE.terraform.tfstate*

1. If necessary, register the SPN

    > [!IMPORTANT]
    > The first time an Environment is instantiated, a SPN must be registered. In this tutorial the Control Plane is in the MGMT environment, and the Workload Zone is in DEV, therefore an SPN must be registered for DEV at this time.

    ```bash
    export subscriptionId="<subscriptionId>"
    export         spn_id="<appID>"
    export     spn_secret="<password>"
    export      tenant_id="<tenant>"
    export      key_vault="<vaultID>"
    export       env_code="DEV"
    export    region_code="<region_code>"

    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/set_secrets.sh     \
        --environment "${env_code}"                           \
        --region "${region_code}"                             \
        --vault "${key_vault}"                                \
        --subscription "${subscriptionId}"                    \
        --spn_id "${spn_id}"                                  \
        --spn_secret "${spn_secret}"                          \
        --tenant_id "${tenant_id}"
    ```

## Prepare the Workload Zone deployment

1. Connect to your deployer VM for the following steps. A copy of the repo is now there.

1. Go to the **sap-automation** folder and optionally refresh the repository.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/sap-automation/

    git pull
    ```

1. Go into the *WORKSPACES/LANDSCAPE* folder and copy the sample configuration files that you'll be using from the repository.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE

    cp -Rp ../../sap-automation/training-materials/WORKSPACES/LANDSCAPE/DEV-[REGION]-SAP01-INFRASTRUCTURE .
    ```


## Deploy the Workload Zone


Use the [install_workloadzone](bash/automation-install_workloadzone.md) script to deploy the SAP workload zone.

1. On the deployer VM, navigate to the `Azure_SAP_Automated_Deployment` folder.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-XXXX-SAP01-INFRASTRUCTURE
    ```

    From the example region 'northeurope', the folder will look like:

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-NOEU-SAP01-INFRASTRUCTURE
    ```

1. **Optionally** Open the workload zone configuration file and if needed change the network logical name to match the network name.

1. Start deployment of the workload zone:

    > [!NOTE]
    > The details, which we collected in earlier will be needed here. These details are:
    >   - Name of the deployer tfstate file (found in the tfstate container)
    >   - Name of the tfstate storage account
    >   - Name of the deployer key vault

    ```bash

    export tfstate_storage_account="<storageaccountName>"
    export       deployer_env_code="MGMT"
    export            sap_env_code="DEV"
    export             region_code="<region_code>"
    export               key_vault="<vaultID>"

    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/${sap_env_code}-${region_code}-SAP01-INFRASTRUCTURE

    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/install_workloadzone.sh                                          \
        --parameterfile ./${sap_env_code}-${region_code}-SAP01-INFRASTRUCTURE.tfvars                        \
        --deployer_environment "${deployer_env_code}"                                                       \
        --deployer_tfstate_key "${deployer_env_code}-${region_code}-DEP00-INFRASTRUCTURE.terraform.tfstate" \
        --keyvault "${key_vault}"                                                                           \
        --storageaccountname "${tfstate_storage_account}"                                                   \
        --auto-approve
    ```

    The workload zone deployment should start automatically.

    Wait for the deployment to finish. The new resource group appears in the Azure portal.


## Prepare to deploy the SAP system infrastructure

1. Connect to your deployer VM for the following steps. A copy of the repo is now there.

1. Go into the *WORKSPACES/SYSTEM* folder and copy the sample configuration files that you'll be using from the repository.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM

    cp -Rp ../../sap-automation/training-materials/WORKSPACES/SYSTEM/DEV-[REGION]-SAP01-X00 .
    ```


## Deploy SAP system infrastructure

Once the Workload zone is complete, you can deploy the SAP system infrastructure resources. The SAP system creates your VMs and supporting components for your SAP application.
Use the [installer.sh](bash/automation-installer.md) script to deploy the SAP system.

The SAP system deploys:

- The database tier, which deploys database VMs and their disks and an Azure Standard Load Balancer. You can run HANA databases or AnyDB databases in this tier.
- The SCS tier, which deploys a customer-defined number of VMs and an Azure Standard Load Balancer.
- The application tier, which deploys the VMs and their disks.
- The web dispatcher tier.

1. Deploy the SAP system.

    ```bash

    export sap_env_code="DEV"
    export  region_code="<region_code>"

    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/${sap_env_code}-${region_code}-SAP01-X00

    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh                  \
      --parameterfile "${sap_env_code}-${region_code}-SAP01-X00.tfvars"  \
      --type sap_system                                                  \
      --auto-approve
    ```

    The deployment command for the `northeurope` example will look like:

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-NOEU-SAP01-X00

    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh  \
      --parameterfile DEV-NOEU-SAP01-X00.tfvars          \
      --type sap_system                                  \
      --auto-approve
    ```

    Check that the system resource group is now in the Azure portal.

## SAP application installation

The SAP application installation happens through Ansible playbooks.

Navigate to the system deployment folder:

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-NOEU-SAP01-X00/
```

Make sure you have the following files in the current folder: `sap-parameters.yaml` and `SID_host.yaml`.

For a standalone SAP S/4HANA system, there are eight playbooks to execute in sequence. One way you can execute the playbooks is to use the Configuration menu.

Run the configuration_menu script.

```bash
~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/configuration_menu.sh
```


Choose the playbooks to execute.

### Playbook: OS Config

This playbook does the generic OS configuration setup on all the machines, which includes configuring of software repositories, packages, services, and so on.

### Playbook: SAP-Specific OS config

This playbook does the SAP OS configuration setup on all the machines. The steps include creation of volume groups, file systems, configuring of software repositories, packages, and services.

### Playbook: BOM Processing

This playbook downloads the SAP software to the SCS virtual machine.

### Playbook: HANA DB Install

This playbook will install the HANA database instances.

### Playbook: SCS Install

This playbook will install SAP Central Services. For highly available configurations, the playbook will also install the SAP ERS instance and configure Pacemaker.

### Playbook: DB Load

This playbook will invoke the database load task from the primary application server.

### Playbook: PAS Install

This playbook will install the primary application server.

### Playbook: APP Install

This playbook will install the application servers.

You've now deployed and configured a stand-alone HANA system, if you need to configure a highly available SAP HANA database run the HANA HA playbook

### Playbook: Hana HA playbook

This playbook will configure HANA System Replication (HSR) and Pacemaker for the HANA database.

## Clean up installation

> [!NOTE]
> It's important to clean up your SAP installation from this tutorial after you're done. Otherwise, you continue to incur costs related to the resources.

To remove the entire SAP infrastructure you deployed, you need to:

> [!div class="checklist"]
> * Remove the SAP system infrastructure resources
> * Remove all workload zones (the Landscape)
> * Remove the control plane

Execute the removal of your SAP infrastructure resources and workload zones from the deployer VM. Execute the removal of the control plane from Cloud Shell.

Before you begin, sign in your Azure account. Then, check that you're in the correct subscription.

### Remove SAP infrastructure

Navigate to the `DEV-NOEU-SAP01-X00` subfolder inside the `SYSTEM` folder. Then, run this command:

```bash
export sap_env_code="DEV"
export  region_code="NOEU"

cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/${sap_env_code}-${region_code}-SAP01-X00

${DEPLOYMENT_REPO_PATH}/deploy/scripts/remover.sh                   \
  --parameterfile "${sap_env_code}-${region_code}-SAP01-X00.tfvars" \
  --type sap_system
```

### Remove SAP workload zone

Navigate to the `DEV-XXXX-SAP01-INFRASTRUCTURE` subfolder inside the `LANDSCAPE` folder. Then, execute the following command.

```bash

export sap_env_code="DEV"
export  region_code="NOEU"

cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/${sap_env_code}-${region_code}-SAP01-INFRASTRUCTURE

${DEPLOYMENT_REPO_PATH}/deploy/scripts/remover.sh                                \
      --parameterfile ${sap_env_code}-${region_code}-SAP01-INFRASTRUCTURE.tfvars \
      --type sap_landscape
```

### Remove control plane

Sign in to [Cloud Shell](https://shell.azure.com).

Go to the `WORKSPACES` folder.

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/
```

Export the following two environment variables.

```bash
export DEPLOYMENT_REPO_PATH="~/Azure_SAP_Automated_Deployment/sap-automation"
export ARM_SUBSCRIPTION_ID="<subscriptionId>"
```

Run the following command.

```bash
export region_code="NOEU"

${DEPLOYMENT_REPO_PATH}/deploy/scripts/remove_region.sh                                                                          \
    --deployer_parameter_file DEPLOYER/MGMT-${region_code}-DEP00-INFRASTRUCTURE/MGMT-${region_code}-DEP00-INFRASTRUCTURE.tfvars  \
    --library_parameter_file LIBRARY/MGMT-${region_code}-SAP_LIBRARY/MGMT-${region_code}-SAP_LIBRARY.tfvars
```

Verify that all resources are cleaned up.

## Next steps

> [!div class="nextstepaction"]
> [Configure control plane](automation-configure-control-plane.md)
