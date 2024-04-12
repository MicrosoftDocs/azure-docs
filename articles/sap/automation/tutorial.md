---
title: 'Tutorial: Deploy SAP Deployment Automation Framework'
description: Learn how to use SAP Deployment Automation Framework for enterprise scale.
author: hdamecharla
ms.author: hdamecharla
ms.reviewer: kimforss
ms.date: 12/15/2023
ms.topic: tutorial
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-azurecli
---

# Tutorial: Deploy SAP Deployment Automation Framework for enterprise scale

This tutorial shows you how to perform deployments by using [SAP Deployment Automation Framework](deployment-framework.md). This example uses Azure Cloud Shell to deploy the control plane infrastructure. The deployer virtual machine (VM) creates the remaining infrastructure and SAP HANA configurations.

In this tutorial, you perform the following tasks:

> [!div class="checklist"]
> * Deploy the control plane (deployer infrastructure and library).
> * Deploy the workload zone (landscape and system).
> * Download/Upload Bill of Materials.
> * Configure standard and SAP-specific operating system settings.
> * Install the HANA database.
> * Install the SAP Central Services (SCS) server.
> * Load the HANA database.
> * Install the primary application server.

There are three main steps of an SAP deployment on Azure with the automation framework:

1. Prepare the region. You deploy components to support the SAP automation framework in a specified Azure region. In this step, you:
   1. Create the deployment environment.
   1. Create shared storage for Terraform state files.
   1. Create shared storage for SAP installation media.

1. Prepare the workload zone. You deploy the workload zone components, such as the virtual network and key vaults.

1. Deploy the system. You deploy the infrastructure for the SAP system.

There are several workflows in the deployment automation process. This tutorial focuses on one workflow for ease of deployment. You can deploy this workflow, the SAP S4 HANA standalone environment, by using Bash. This tutorial describes the general hierarchy and different phases of the deployment.

### Environment overview

SAP Deployment Automation Framework has two main components:

- Deployment infrastructure (control plane)
- SAP infrastructure (SAP workload)

The following diagram shows the dependency between the control plane and the application plane.

 :::image type="content" source="media/devops/automation-devops-tutorial-design.png" alt-text="Diagram that shows the DevOps tutorial infrastructure design.":::

The framework uses Terraform for infrastructure deployment and Ansible for the operating system and application configuration. The following diagram shows the logical separation of the control plane and workload zone.

:::image type="content" source="./media/deployment-framework/automation-diagram-full.png" alt-text="Diagram that shows the SAP Deployment Automation Framework environment.":::

#### Management zone

The management zone contains the control plane infrastructure from which other environments are deployed. After the management zone is deployed, you rarely, if ever, need to redeploy.

:::image type="content" source="./media/deployment-framework/control-plane.png" alt-text="Diagram that shows the control plane.":::

The *deployer* is the execution engine of the SAP automation framework. This preconfigured VM is used for executing Terraform and Ansible commands.

The *SAP Library* provides the persistent storage for the Terraform state files and the downloaded SAP installation media for the control plane.

You configure the deployer and the library in a Terraform `.tfvars` variable file. For more information, see [Configure the control plane](configure-control-plane.md).

#### Workload zone

An SAP application typically has multiple deployment tiers. For example, you might have development, quality assurance, and production tiers. SAP Deployment Automation Framework calls these tiers workload zones.

:::image type="content" source="./media/deployment-framework/workload-zone.png" alt-text="Diagram that shows the workload zone.":::

The *SAP workload zone* contains the networking and shared components for the SAP VMs. These components include route tables, network security groups, and virtual networks. The landscape provides the opportunity to divide deployments into different environments. For more information, see [Configure the workload zone](configure-workload-zone.md).

The system deployment consists of the VMs to run the SAP application, including the web, app, and database tiers. For more information, see [Configure the SAP system](configure-system.md).

### Prerequisites

The [SAP Deployment Automation Framework repository](https://github.com/Azure/sap-automation) is available on GitHub.

You need to deploy Azure Bastion or use a Secure Shell (SSH) client to connect to the deployer. Use any SSH client that you feel comfortable with.

#### Review the Azure subscription quota

Ensure that your Azure subscription has a sufficient core quote for DdSV4 and EdsV4 family SKUs in the elected region. About 50 cores available for each VM family should suffice.

#### S-User account for SAP software download

A valid SAP user account (SAP-User or S-User account) with software download privileges is required to download the SAP software.

## Set up Cloud Shell

1. Go to [Azure Cloud Shell](https://shell.azure.com).

1. Sign in to your Azure account.

    ```cloudshell-interactive
    az login
    ```

   Authenticate your sign-in. Don't close the window until you're prompted.

1. Validate your active subscription and record your subscription ID:

    ```cloudshell-interactive
    az account list --query "[?isDefault].{Name: name, CloudName: cloudName, SubscriptionId: id, State: state, IsDefault: isDefault}" --output=table
    ```

    Or:

    ```cloudshell-interactive
    az account list --output=table | grep True
    ```

1. If necessary, change your active subscription.

    ```cloudshell-interactive
    az account set --subscription <Subscription ID>
    ```

    Validate that your active subscription changed.

    ```cloudshell-interactive
    az account list --query "[?isDefault].{Name: name, CloudName: cloudName, SubscriptionId: id, State: state, IsDefault: isDefault}" --output=table
    ```

1. Optionally, remove all the deployment artifacts. Use this command when you want to remove all remnants of previous deployment artifacts.

    ```cloudshell-interactive

    cd ~

    rm -rf Azure_SAP_Automated_Deployment .sap_deployment_automation .terraform.d
    ```

1. Create the deployment folder and clone the repository.

    ```cloudshell-interactive
    mkdir -p ${HOME}/Azure_SAP_Automated_Deployment; cd $_

    git clone https://github.com/Azure/sap-automation-bootstrap.git config

    git clone https://github.com/Azure/sap-automation.git sap-automation

    git clone https://github.com/Azure/sap-automation-samples.git samples

    cp -Rp samples/Terraform/WORKSPACES ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES

    ```

1. Optionally, validate the versions of Terraform and the Azure CLI available on your instance of Cloud Shell.

    ```cloudshell-interactive
    ./sap-automation/deploy/scripts/helpers/check_workstation.sh
    ```

    To run the automation framework, update to the following versions:

    - `az` version 2.5.0 or higher.
    - `terraform` version 1.5 or higher. [Upgrade by using the Terraform instructions](https://www.terraform.io/upgrade-guides/0-12.html), as necessary.

## Create a service principal

The SAP automation deployment framework uses service principals for deployment. Create a service principal for your control plane deployment. Make sure to use an account with permissions to create service principals.

When you choose a name for your service principal, make sure that the name is unique within your Azure tenant.

1. Give the service principal Contributor and User Access Administrator permissions.

    ```cloudshell-interactive
    export    ARM_SUBSCRIPTION_ID="<subscriptionId>"
    export control_plane_env_code="LAB"

    az ad sp create-for-rbac --role="Contributor"           \
      --scopes="/subscriptions/${ARM_SUBSCRIPTION_ID}"      \
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

1. Copy down the output details. Make sure to save the values for `appId`, `password`, and `Tenant`.

    The output maps to the following parameters. You use these parameters in later steps, with automation commands.

    | Parameter input name | Output name |
    |--------------------------|-----------------|
    | `spn_id`                 | `appId`         |
    | `spn_secret`             | `password`      |
    | `tenant_id`              | `tenant`        |

1. Optionally, assign the User Access Administrator role to the service principal.

    ```cloudshell-interactive
    export appId="<appId>"

    az role assignment create --assignee ${appId}   \
      --role "User Access Administrator"            \
      --scope /subscriptions/${ARM_SUBSCRIPTION_ID}
    ```

> [!IMPORTANT]
> If you don't assign the User Access Administrator role to the service principal, you can't assign permissions by using the automation.

## Configure the control plane web application credentials

As a part of the SAP automation framework control plane, you can optionally create an interactive web application that assists you in creating the required configuration files.

:::image type="content" source="./media/deployment-framework/webapp-front-page.png" alt-text="Screenshot that shows the web app front page.":::

### Create an app registration

If you want to use the web app, you must first create an app registration for authentication purposes. Open Cloud Shell and run the following commands:

Replace LAB with your environment, as necessary.

```bash
export            env_code="LAB"
 
 
echo '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]' >> manifest.json
 
export TF_VAR_app_registration_app_id=$(az ad app create \
    --display-name ${env_code}-webapp-registration       \
    --enable-id-token-issuance true                      \
    --sign-in-audience AzureADMyOrg                      \
    --required-resource-access @manifest.json            \
    --query "appId" --output tsv )
 
#remove the placeholder manifest.json
rm manifest.json
 
export TF_VAR_webapp_client_secret=$(az ad app credential reset \
    --id $TF_VAR_app_registration_app_id --append               \
    --query "password" --output tsv )
 
export TF_use_webapp=true
 
 
echo "App registration ID:  ${TF_VAR_app_registration_app_id}"
echo "App registration password:  ${TF_VAR_webapp_client_secret}"
```

>[!NOTE]
>Ensure that you're logged on by using a user account that has the required permissions to create application registrations. For more information about app registrations, see [Create an app registration](/cli/azure/ad/app#az-ad-app-create).
>

Copy down the output details. Make sure to save the values for `App registration ID` and `App registration password`.

The output maps to the following parameters. You use these parameters in later steps, with automation commands.

| Parameter input name      | Output name                       |
| ------------------------- | --------------------------------- |
| `app_registration_app_id` | `App registration ID`             |
| `webapp_client_secret`    | `App registration password`       |

## View configuration files

1. Open Visual Studio Code from Cloud Shell.

    ```cloudshell-interactive
    cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES
    code .
    ```

1. Expand the `WORKSPACES` directory. There are six subfolders: `CONFIGURATION`, `DEPLOYER`, `LANDSCAPE`, `LIBRARY`, `SYSTEM`, and `BOMS`. Expand each of these folders to find regional deployment configuration files.

1. Find the Terraform variable files in the appropriate subfolder. For example, the `DEPLOYER` Terraform variable file might look like this example:

    ```terraform
    # The environment value is a mandatory field, it is used for partitioning the environments, for example, PROD and NP.
    environment = "LAB"
    # The location/region value is a mandatory field, it is used to control where the resources are deployed
    location = "swedencentral"

    # management_network_address_space is the address space for management virtual network
    management_network_address_space = "10.10.20.0/25"
    # management_subnet_address_prefix is the address prefix for the management subnet
    management_subnet_address_prefix = "10.10.20.64/28"

    # management_firewall_subnet_address_prefix is the address prefix for the firewall subnet
    management_firewall_subnet_address_prefix = "10.10.20.0/26"
    firewall_deployment = true

    # management_bastion_subnet_address_prefix is the address prefix for the bastion subnet
    management_bastion_subnet_address_prefix = "10.10.20.128/26"
    bastion_deployment = true

    # deployer_enable_public_ip controls if the deployer Virtual machines will have Public IPs
    deployer_enable_public_ip = true

    # deployer_count defines how many deployer VMs will be deployed
    deployer_count = 1

    # use_service_endpoint defines that the management subnets have service endpoints enabled
    use_service_endpoint = true

    # use_private_endpoint defines that the storage accounts and key vaults have private endpoints enabled
    use_private_endpoint = false

    # enable_firewall_for_keyvaults_and_storage defines that the storage accounts and key vaults have firewall enabled
    enable_firewall_for_keyvaults_and_storage = false

    # public_network_access_enabled controls if storage account and key vaults have public network access enabled
    public_network_access_enabled = true

    ```

    Note the Terraform variable file locations for future edits during deployment.

1. Find the Terraform variable files for the SAP Library in the appropriate subfolder. For example, the `LIBRARY` Terraform variable file might look like this example:

    ```terraform
    # The environment value is a mandatory field, it is used for partitioning the environments, for example, PROD and NP.
    environment = "LAB"
    # The location/region value is a mandatory field, it is used to control where the resources are deployed
    location = "swedencentral"

    #Defines the DNS suffix for the resources
    dns_label = "lab.sdaf.contoso.net"

    # use_private_endpoint defines that the storage accounts and key vaults have private endpoints enabled
    use_private_endpoint = false
    ```

    Note the Terraform variable file locations for future edits during deployment.

> [!IMPORTANT]
> Ensure that the `dns_label` matches your instance of Azure Private DNS.

## Deploy the control plane

Use the [deploy_controlplane.sh](bash/deploy-controlplane.md) script to deploy the deployer and library. These deployment pieces make up the control plane for a chosen automation area.

The deployment goes through cycles of deploying the infrastructure, refreshing the state, and uploading the Terraform state files to the library storage account. All of these steps are packaged into a single deployment script. The script needs the location of the configuration file for the deployer and library, and some other parameters.

For example, choose **West Europe** as the deployment location, with the four-character name `SECE`, as previously described. The sample deployer configuration file `LAB-SECE-DEP05-INFRASTRUCTURE.tfvars` is in the `${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/DEPLOYER/LAB-SECE-DEP05-INFRASTRUCTURE` folder.

The sample SAP Library configuration file `LAB-SECE-SAP_LIBRARY.tfvars` is in the `${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/LIBRARY/LAB-SECE-SAP_LIBRARY` folder.

1. Set the environment variables for the service principal:

    ```bash
    
    export ARM_SUBSCRIPTION_ID="<subscriptionId>"
    export       ARM_CLIENT_ID="<appId>"
    export   ARM_CLIENT_SECRET="<password>"
    export       ARM_TENANT_ID="<tenantId>"
    
    ```
    
    If you're running the script from a workstation that isn't part of the deployment network or from Cloud Shell, you can use the following command to set the environment variable for allowing connectivity from your IP address:
    
    ```bash
    export TF_VAR_Agent_IP=<your-public-ip-address>
    ```
    
    If you're deploying the configuration web application, you need to also set the following environment variables:
    
    ```bash
    
    export TF_VAR_app_registration_app_id=<appRegistrationId>
    export    TF_VAR_webapp_client_secret=<appRegistrationPassword>
    export                  TF_use_webapp=true
    ```

1. Create the deployer and the SAP Library and add the service principal details to the deployment key vault by using this script:
    
    ```bash
    
    export            env_code="LAB"
    export           vnet_code="DEP05"
    export         region_code="SECE"
    
    export     DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
    export         CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES"
    export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
    
    cd $CONFIG_REPO_PATH
    
    az login --service-principal -u "${ARM_CLIENT_ID}" -p="${ARM_CLIENT_SECRET}" --tenant "${ARM_TENANT_ID}"
    
    deployer_parameter_file="${CONFIG_REPO_PATH}/DEPLOYER/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE.tfvars"
    library_parameter_file="${CONFIG_REPO_PATH}/LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars"
    
    ${SAP_AUTOMATION_REPO_PATH}/deploy/scripts/deploy_controlplane.sh  \
        --deployer_parameter_file "${deployer_parameter_file}"         \
        --library_parameter_file "${library_parameter_file}"           \
        --subscription "${ARM_SUBSCRIPTION_ID}"                        \
        --spn_id "${ARM_CLIENT_ID}"                                    \
        --spn_secret "${ARM_CLIENT_SECRET}"                            \
        --tenant_id "${ARM_TENANT_ID}"
    
    ```

    If you run into authentication issues, run `az logout` to sign out and clear the `token-cache`. Then run `az login` to reauthenticate.
    
    Wait for the automation framework to run the Terraform operations `plan` and `apply`.
    
    The deployment of the deployer might run for about 15 to 20 minutes.
    
    You need to note some values for upcoming steps. Look for this text block in the output:
    
    ```text
    #########################################################################################
    #                                                                                       #
    #  Please save these values:                                                            #
    #     - Key Vault: LABSECEDEP05user39B                                                  #
    #     - Deployer IP: x.x.x.x                                                            #
    #     - Storage Account: labsecetfstate53e                                              #
    #     - Web Application Name: lab-sece-sapdeployment39B                                 #
    #     - App registration Id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx                       #
    #                                                                                       #
    #########################################################################################
    ```

1. Go to the [Azure portal](https://portal.azure.com).

    Select **Resource groups**. Look for new resource groups for the deployer infrastructure and library. For example, you might see `LAB-[region]-DEP05-INFRASTRUCTURE` and `LAB-[region]-SAP_LIBRARY`.

    The contents of the deployer and SAP Library resource group are shown here.

    :::image type="content" source="media/tutorial/deployer-resource-group.png" alt-text="Screenshot that shows deployer resources.":::

    :::image type="content" source="media/tutorial/sap-library-resource-group.png" alt-text="Screenshot that shows library resources.":::

    The Terraform state file is now placed in the storage account whose name contains `tfstate`. The storage account has a container named `tfstate` with the deployer and library state files. The contents of the `tfstate` container after a successful control plane deployment are shown here.

    :::image type="content" source="media/tutorial/terraform-state-files.png" alt-text="Screenshot that shows the control plane Terraform state files.":::

### Common issues and solutions

Here are some troubleshooting tips:

- If you get the following error for the deployer module creation, make sure that you're in the `WORKSPACES` directory when you run the script:

    ```text
    Incorrect parameter file.
    The file must contain the environment attribute!!
    ```

- The following error is transient. Rerun the same command, `deploy_controlplane.sh`.

    ```text
    Error: file provisioner error
    ..
    timeout - last error: dial tcp
    ```

- If you have authentication issues directly after you run the script `deploy_controlplane.sh`, run this command:

    ```azurecli
    az logout

    az login
    ```

## Connect to the deployer VM

After the control plane is deployed, the Terraform state is stored by using the remote back-end `azurerm`. All secrets for connecting to the deployer VM are available in a key vault in the deployer's resource group.

To connect to your deployer VM:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select or search for **Key vaults**.

1. On the **Key vault** page, find the deployer key vault. The name starts with `LAB[REGION]DEP05user`. Filter by **Resource group** or **Location**, if necessary.

1. On the **Settings** section in the left pane, select **Secrets**.

1. Find and select the secret that contains **sshkey**. It might look like `LAB-[REGION]-DEP05-sshkey`.

1. On the secret's page, select the current version. Then, copy the secret value.

1. Open a plain text editor. Copy in the secret value.

1. Save the file where you keep SSH keys. For example, use `C:\\Users\\<your-username>\\.ssh`.

1. Save the file. If you're prompted to **Save as type**, select **All files** if **SSH** isn't an option. For example, use `deployer.ssh`.

1. Connect to the deployer VM through any SSH client, such as Visual Studio Code. Use the public IP address you noted earlier and the SSH key you downloaded. For instructions on how to connect to the deployer by using Visual Studio Code, see [Connect to the deployer by using Visual Studio Code](tools-configuration.md#configure-visual-studio-code). If you're using PuTTY, convert the SSH key file first by using PuTTYGen.

> [!NOTE]
>The default username is *azureadm*.
>
> Ensure that the file you use to save the SSH key can save the file by using the correct format, that is, without carriage return (CR) characters. Use Visual Studio Code or Notepad++.

After you're connected to the deployer VM, you can download the SAP software by using the Bill of Materials (BOM).

## Connect to the deployer VM when you're not using a public IP

For deployments without public IP connectivity, direct connectivity over the internet isn't allowed. In these cases, you can use an Azure Bastion jump box or you can perform the next step from a computer that has connectivity to the Azure virtual network.

The following example uses Azure Bastion.

To connect to the deployer:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to the resource group that contains the deployer VM.

1. Connect to the VM by using Azure Bastion.

1. The default username is **azureadm**.

1. Select **SSH Private Key from Azure Key Vault**.

1. Select the subscription that contains the control plane.

1. Select the deployer key vault.

1. From the list of secrets, select the secret that ends with **-sshkey**.

1. Connect to the VM.

The rest of the tasks must be executed on the deployer.

## Secure the control plane

The control plane is the most critical part of the SAP automation framework. It's important to secure the control plane. The following steps help you secure the control plane.

You should update the control plane `tfvars` file to enable private endpoints and to block public access to the storage accounts and key vaults.

1. To copy the control plane configuration files to the deployer VM, you can use the `sync_deployer.sh` script. Sign in to the deployer VM and update the following command to use your Terraform state storage account name. Then, run the following script:

    ```bash
    
    terraform_state_storage_account=labsecetfstate###
    
    cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES
    
    ../sap-automation/deploy/scripts/sync_deployer.sh --storageaccountname $terraform_state_storage_account --state_subscription $ARM_SUBSCRIPTION_ID
    
    
    ```

    This command copies the `tfvars` configuration files from the SAP Library's storage account to the deployer VM.

1. Change the configuration files for the control plane to:

    ```terraform
    
        # use_private_endpoint defines that the storage accounts and key vaults have private endpoints enabled
        use_private_endpoint = true
    
        # enable_firewall_for_keyvaults_and_storage defines that the storage accounts and key vaults have firewall enabled
        enable_firewall_for_keyvaults_and_storage = true
    
        # public_network_access_enabled controls if storage account and key vaults have public network access enabled
        public_network_access_enabled = false
        
        #if you want to use the webapp
        use_webapp=true 
    
    ```

1. Rerun the deployment to apply the changes. Update the storage account name and key vault name in the script.

    ```bash
    
    export ARM_SUBSCRIPTION_ID="<subscriptionId>"
    export       ARM_CLIENT_ID="<appId>"
    export   ARM_CLIENT_SECRET="<password>"
    export       ARM_TENANT_ID="<tenantId>"
    
    ```

1. Create the deployer and the SAP Library.

    ```bash
    
    export            env_code="LAB"
    export           vnet_code="DEP05"
    export         region_code="SECE"
    
    terraform_state_storage_account=labsecetfstate###
                         vault_name="LABSECEDEP05user###"
    
    export     DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
    export         CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES"
    export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
    
    cd $CONFIG_REPO_PATH
    
    deployer_parameter_file="${CONFIG_REPO_PATH}/DEPLOYER/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE.tfvars"
     library_parameter_file="${CONFIG_REPO_PATH}/LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars"
    
    az logout 
    az login --service-principal -u "${ARM_CLIENT_ID}" -p="${ARM_CLIENT_SECRET}" --tenant "${ARM_TENANT_ID}"
    
    ${SAP_AUTOMATION_REPO_PATH}/deploy/scripts/deploy_controlplane.sh  \
        --deployer_parameter_file "${deployer_parameter_file}"         \
        --library_parameter_file "${library_parameter_file}"           \
        --subscription "${ARM_SUBSCRIPTION_ID}"                        \
        --storageaccountname "${terraform_state_storage_account}"      \
        --vault "${vault_name}"
    ```
    
## Deploy the web application

You can deploy the web application by using the following script:

```bash
export            env_code="LAB"
export           vnet_code="DEP05"
export         region_code="SECE"
export         webapp_name="<webAppName>"
export              app_id="<appRegistrationId>"
export           webapp_id="<webAppId>"

export DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"

cd $DEPLOYMENT_REPO_PATH
cd Webapp/SDAF

dotnet build SDAFWebApp.csproj
dotnet publish SDAFWebApp.csproj --output publish
cd publish

zip -r SDAF.zip .

az webapp deploy --resource-group ${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE --name $webapp_name --src-path SDAF.zip --type zip

az ad app update --id $app_id --web-home-page-url https://$webapp_name.azurewebsites.net --web-redirect-uris https://$webapp_name.azurewebsites.net/ https://$webapp_name.azurewebsites.net/.auth/login/aad/callback
az role assignment create --assignee $webapp_id --role reader --subscription $ARM_SUBSCRIPTION_ID --scope /subscriptions/$ARM_SUBSCRIPTION_ID
az webapp restart --resource-group ${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE --name $webapp_name 

```

## Collect workload zone information

1. Collect the following information in a text editor. This information was collected at the end of the "Deploy the control plane" phase.

    1. The name of the Terraform state file storage account in the library resource group:
        - Following from the preceding example, the resource group is `LAB-SECE-SAP_LIBRARY`.
        - The name of the storage account contains `labsecetfstate`.

    1. The name of the key vault in the deployer resource group:
        - Following from the preceding example, the resource group is `LAB-SECE-DEP05-INFRASTRUCTURE`.
        - The name of the key vault contains `LABSECEDEP05user`.

    1. The public IP address of the deployer VM. Go to your deployer's resource group, open the deployer VM, and copy the public IP address.

1. You need to collect the following piece of information:

    1. The name of the deployer state file is found under the library resource group:
        - Select **Library resource group** > **State storage account** > **Containers** > `tfstate`. Copy the name of the deployer state file.
        - Following from the preceding example, the name of the blob is `LAB-SECE-DEP05-INFRASTRUCTURE.terraform.tfstate`.

1. If necessary, register the service principal. For this tutorial, this step isn't needed.

    The first time an environment is instantiated, a service principal must be registered. In this tutorial, the control plane is in the `LAB` environment and the workload zone is also in `LAB`. For this reason, a service principal must be registered for the `LAB` environment.

    ```bash
    export ARM_SUBSCRIPTION_ID="<subscriptionId>"
    export       ARM_CLIENT_ID="<appID>"
    export   ARM_CLIENT_SECRET="<password>"
    export       ARM_TENANT_ID="<tenant>"
    export           key_vault="<vaultName>"
    export            env_code="LAB"
    export         region_code="SECE"

    export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
    export         CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES"

    ```

    ```bash
    
    ${SAP_AUTOMATION_REPO_PATH}/deploy/scripts/set_secrets.sh \
        --environment "${env_code}"                           \
        --region "${region_code}"                             \
        --vault "${key_vault}"                                \
        --subscription "${ARM_SUBSCRIPTION_ID}"               \
        --spn_id "${ARM_CLIENT_ID}"                           \
        --spn_secret "${ARM_CLIENT_SECRET}"                   \
        --tenant_id "${ARM_TENANT_ID}"
    ```

## Prepare the workload zone deployment

Connect to your deployer VM for the following steps. A copy of the repo is now there.

## Deploy the workload zone

Use the [install_workloadzone](bash/install-workloadzone.md) script to deploy the SAP workload zone.

1. On the deployer VM, go to the `Azure_SAP_Automated_Deployment` folder.

    ```bash
    cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/LAB-SECE-SAP04-INFRASTRUCTURE
    ```

1. Optionally, open the workload zone configuration file and, if needed, change the network logical name to match the network name.

1. Start deployment of the workload zone. The details that you collected earlier are needed here:

   - Name of the deployer `tfstate` file (found in the `tfstate` container)
   - Name of the `tfstate` storage account
   - Name of the deployer key vault

```bash

export     ARM_SUBSCRIPTION_ID="<subscriptionId>"
export           ARM_CLIENT_ID="<appId>"
export       ARM_CLIENT_SECRET="<password>"
export           ARM_TENANT_ID="<tenantId>"
```

```bash
export       deployer_env_code="LAB"
export            sap_env_code="LAB"
export             region_code="SECE"

export      deployer_vnet_code="DEP05"
export               vnet_code="SAP04"

export tfstate_storage_account="<storageaccountName>"
export               key_vault="<vaultName>"

export CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES"
export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"

az login --service-principal -u "${ARM_CLIENT_ID}" -p="${ARM_CLIENT_SECRET}" --tenant "${ARM_TENANT_ID}"

cd "${CONFIG_REPO_PATH}/LANDSCAPE/${sap_env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE"

parameterFile="${sap_env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE.tfvars"
deployerState="${deployer_env_code}-${region_code}-${deployer_vnet_code}-INFRASTRUCTURE.terraform.tfstate"

$SAP_AUTOMATION_REPO_PATH/deploy/scripts/install_workloadzone.sh  \
    --parameterfile "${parameterFile}"                            \
    --deployer_environment "${deployer_env_code}"                 \
    --deployer_tfstate_key  "${deployerState}"                    \
    --keyvault "${key_vault}"                                     \
    --storageaccountname "${tfstate_storage_account}"             \
    --subscription "${ARM_SUBSCRIPTION_ID}"                       \
    --spn_id "${ARM_CLIENT_ID}"                                   \
    --spn_secret "${ARM_CLIENT_SECRET}"                           \
    --tenant_id "${ARM_TENANT_ID}"
```

The workload zone deployment should start automatically.

Wait for the deployment to finish. The new resource group appears in the Azure portal.

## Prepare to deploy the SAP system infrastructure

Connect to your deployer VM for the following steps. A copy of the repo is now there.

Go into the `WORKSPACES/SYSTEM` folder and copy the sample configuration files to use from the repository.

## Deploy the SAP system infrastructure

After the workload zone is finished, you can deploy the SAP system infrastructure resources. The SAP system creates your VMs and supporting components for your SAP application. Use the [installer.sh](bash/installer.md) script to deploy the SAP system.

The SAP system deploys:

- The database tier, which deploys database VMs and their disks and an Azure Standard Load Balancer instance. You can run HANA databases or AnyDB databases in this tier.
- The SCS tier, which deploys a customer-defined number of VMs and an Azure Standard Load Balancer instance.
- The application tier, which deploys the VMs and their disks.
- The Web Dispatcher tier.

Deploy the SAP system.

```bash

export             sap_env_code="LAB"
export              region_code="SECE"
export                vnet_code="SAP04"
export                      SID="L00"

export         CONFIG_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES"
export SAP_AUTOMATION_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"

cd ${CONFIG_REPO_PATH}/SYSTEM/${sap_env_code}-${region_code}-${vnet_code}-${SID}

${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh                             \
    --parameterfile "${sap_env_code}-${region_code}-${vnet_code}-${SID}.tfvars" \
    --type sap_system
```

Check that the system resource group is now in the Azure portal.

## Get SAP software by using the Bill of Materials

The automation framework gives you tools to download software from SAP by using the SAP BOM. The software is downloaded to the SAP Library, which acts as the archive for all media required to deploy SAP.

The SAP BOM mimics the SAP maintenance planner. There are relevant product identifiers and a set of download URLs.

A sample extract of a BOM file looks like this example:

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

For this example configuration, the resource group is `LAB-SECE-DEP05-INFRASTRUCTURE`. The deployer key vault name contains `LABSECEDEP05user` in the name. You use this information to configure your deployer's key vault secrets.

1. Connect to your deployer VM for the following steps. A copy of the repo is now there.

1. Add a secret with the username for your SAP user account. Replace `<vaultName>` with the name of your deployer key vault. Also replace `<sap-username>` with your SAP username.

    ```bash
    export key_vault=<vaultName>
        sap_username=<sap-username>

    az keyvault secret set --name "S-Username" --vault-name $key_vault --value "${sap_username}";
    ```

1. Add a secret with the password for your SAP user account. Replace `<vaultName>` with your deployer key vault name and replace `<sap-password>` with your SAP password.

    > [!NOTE]
    > The use of single quotation marks when you set `sap_user_password` is important. The use of special characters in the password can otherwise cause unpredictable results.

    ```azurecli
    sap_user_password='<sap-password>'

    az keyvault secret set --name "S-Password" --vault-name "${key_vault}" --value="${sap_user_password}";
    ```

1. Configure your SAP parameters file for the download process. Then, download the SAP software by using Ansible playbooks. Run the following commands:

    ```bash
    cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES
    mkdir BOMS
    cd BOMS

    vi sap-parameters.yaml
    ```

1. Update the `bom_base_name` with the name BOM. Replace `<Deployer KeyVault Name>` with the name of the Azure key vault for the deployer resource group.

    Your file should look similar to the following example configuration:

    ```yaml

    bom_base_name:                 S42022SPS00_v0001ms
    deployer_kv_name:              <vaultName>
    BOM_directory:                 ${HOME}/Azure_SAP_Automated_Deployment/samples/SAP

    ```

1. Run the Ansible playbook to download the software. One way you can run the playbooks is to use the **Downloader** menu. Run the `download_menu` script.

    ```bash
    ${HOME}/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/download_menu.sh
    ```

1. Select which playbooks to run.

    ```bash
    1) BoM Downloader
    3) Quit
    Please select playbook:
    ```

    Select the playbook `1) BoM Downloader` to download the SAP software described in the BOM file into the storage account. Check that the `sapbits` container has all your media for installation.

    You can run the playbook by using the configuration menu or directly from the command line.

    ```bash
    
    cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/BOMS/
    
    export           ANSIBLE_PRIVATE_KEY_FILE=sshkey
    
    playbook_options=(
            --inventory-file="${sap_sid}_hosts.yaml"
            --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
            --extra-vars="_workspace_directory=`pwd`"
            --extra-vars="@sap-parameters.yaml"
            --extra-vars="bom_processing=true"
            "${@}"
    )
    
    # Run the playbook to retrieve the ssh key from the Azure key vault
    ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml
    
    # Run the playbook to perform the Operating System configuration
    ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_bom_downloader.yaml

    
    ```

    If you want, you can also pass the SAP User credentials as parameters.

    ```bash
    
    cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/BOMS/

    sap_username=<sap-username>
    sap_user_password='<sap-password>'
    
    export           ANSIBLE_PRIVATE_KEY_FILE=sshkey
    
    playbook_options=(
            --inventory-file="${sap_sid}_hosts.yaml"
            --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
            --extra-vars="_workspace_directory=`pwd`"
            --extra-vars="@sap-parameters.yaml"
            --extra-vars="s_user=${sap_username}"
            --extra-vars="s_password=${sap_user_password}"
            --extra-vars="bom_processing=true"
            "${@}"
    )
    
    # Run the playbook to retrieve the ssh key from the Azure key vault
    ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml
    
    # Run the playbook to perform the Operating System configuration
    ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_bom_downloader.yaml

    
    ```

## SAP application installation

The SAP application installation happens through Ansible playbooks.

Go to the system deployment folder.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/
```

Make sure you have the following files in the current folders: `sap-parameters.yaml` and `L00_host.yaml`.

For a standalone SAP S/4HANA system, there are eight playbooks to run in sequence. One way you can run the playbooks is to use the configuration menu.

Run the `configuration_menu` script.

```bash
${HOME}/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/configuration_menu.sh
```

:::image type="content" source="./media/tutorial/configuration-menu.png" alt-text="Diagram that shows the SAP Deployment Automation Ansible configuration menu." lightbox="./media/tutorial/configuration-menu.png":::

Choose the playbooks to run.

### Playbook: Base operating system configuration

This playbook performs the generic operating system configuration setup on all the machines, which includes configuration of software repositories, packages, and services.

You can run the playbook by using the configuration menu or the command line.

```bash

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                            sap_sid=L00
export           ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to perform the Operating System configuration
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_01_os_base_config.yaml

```

### Playbook: SAP-specific operating system configuration

This playbook performs the SAP operating system configuration setup on all the machines. The steps include creation of volume groups and file systems and configuration of software repositories, packages, and services.

You can run the playbook by using the configuration menu or the command line.

```bash

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                            sap_sid=L00
export           ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to perform the SAP Specific Operating System configuration
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_02_os_sap_specific_config.yaml

```

### Playbook: BOM processing

This playbook downloads the SAP software to the SCS VM.

You can run the playbook by using the configuration menu or the command line.

```bash

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to download the software from the SAP Library
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_03_bom_processing.yaml

```

### Playbook: SCS installation

This playbook installs SAP Central Services. For highly available configurations, the playbook also installs the SAP ERS instance and configures Pacemaker.

You can run the playbook by using the configuration menu or the command line.

```bash

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to download the software from the SAP Library
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_00_00_sap_scs_install.yaml

```

### Playbook: Database instance installation

This playbook installs the database instances.

You can run the playbook by using the configuration menu or the command line.

```bash

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to download the software from the SAP Library
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_04_00_00_db_install.yaml

```

### Playbook: Database load

This playbook invokes the database load task from the primary application server.

You can run the playbook by using the configuration menu or the command line.

```bash

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to download the software from the SAP Library
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_01_sap_dbload.yaml

```

### Playbook: Database high-availability setup

This playbook configures the database high availability. For HANA, it entails HANA system replication and Pacemaker for the HANA database.

You can run the playbook by using the configuration menu or the command line.

```bash

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to download the software from the SAP Library
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_04_00_01_db_ha.yaml

```

### Playbook: Primary application server installation

This playbook installs the primary application server.
You can run the playbook by using the configuration menu or the command line.

```bash

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to download the software from the SAP Library
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_02_sap_pas_install.yaml

```

### Playbook: Application server installations

This playbook installs the application servers.
You can run the playbook by using the configuration menu or the command line.

```bash

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to download the software from the SAP Library
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_02_sap_app_install.yaml

```

### Playbook: Web Dispatcher installations

This playbook installs the Web Dispatchers.
You can run the playbook by using the configuration menu or the command line.

You've now deployed and configured a standalone HANA system. If you need to configure a highly available (HA) SAP HANA database, run the HANA HA playbook.

```bash

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/LAB-SECE-SAP04-L00/

export                   sap_sid=L00
export  ANSIBLE_PRIVATE_KEY_FILE=sshkey

playbook_options=(
        --inventory-file="${sap_sid}_hosts.yaml"
        --private-key=${ANSIBLE_PRIVATE_KEY_FILE}
        --extra-vars="_workspace_directory=`pwd`"
        --extra-vars ansible_ssh_pass='{{ lookup("env", "ANSIBLE_PASSWORD") }}'
        --extra-vars="@sap-parameters.yaml"
        "${@}"
)

# Run the playbook to retrieve the ssh key from the Azure key vault
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/pb_get-sshkey.yaml

# Run the playbook to download the software from the SAP Library
ansible-playbook "${playbook_options[@]}" ~/Azure_SAP_Automated_Deployment/sap-automation/deploy/ansible/playbook_05_04_sap_web_install.yaml

```

## Clean up the installation

It's important to clean up your SAP installation from this tutorial after you're finished. Otherwise, you continue to incur costs related to the resources.

To remove the entire SAP infrastructure you deployed, you need to:

> [!div class="checklist"]
> * Remove the SAP system infrastructure resources.
> * Remove all workload zones (the landscape).
> * Remove the control plane.

Run the removal of your SAP infrastructure resources and workload zones from the deployer VM. Run the removal of the control plane from Cloud Shell.

Before you begin, sign in to your Azure account. Then, check that you're in the correct subscription.

### Remove the SAP infrastructure

Go to the `LAB-SECE-SAP01-L00` subfolder inside the `SYSTEM` folder. Then, run this command:

```bash
export  sap_env_code="LAB"
export   region_code="SECE"
export sap_vnet_code="SAP04"

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/${sap_env_code}-${region_code}-${sap_vnet_code}-L00

${DEPLOYMENT_REPO_PATH}/deploy/scripts/remover.sh                   \
  --parameterfile "${sap_env_code}-${region_code}-${sap_vnet_code}-L00.tfvars" \
  --type sap_system
```

### Remove the SAP workload zone

Go to the `LAB-XXXX-SAP01-INFRASTRUCTURE` subfolder inside the `LANDSCAPE` folder. Then, run the following command:

```bash

export  sap_env_code="LAB"
export   region_code="SECE"
export sap_vnet_code="SAP01"

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/${sap_env_code}-${region_code}-${sap_vnet_code}-INFRASTRUCTURE

${DEPLOYMENT_REPO_PATH}/deploy/scripts/remover.sh                                       \
      --parameterfile ${sap_env_code}-${region_code}-${sap_vnet_code}-INFRASTRUCTURE.tfvars \
      --type sap_landscape
```

### Remove the control plane

Sign in to [Cloud Shell](https://shell.azure.com).

Go to the `WORKSPACES` folder.

```bash
cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES/
```

Export the following two environment variables:

```bash
export DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation"
export ARM_SUBSCRIPTION_ID="<subscriptionId>"
```

Run the following command:

```bash
export region_code="SECE"
export    env_code="LAB"
export   vnet_code="DEP05"

cd ${HOME}/Azure_SAP_Automated_Deployment/WORKSPACES
${DEPLOYMENT_REPO_PATH}/deploy/scripts/remove_controlplane.sh                                                                                                \
    --deployer_parameter_file DEPLOYER/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE/${env_code}-${region_code}-${vnet_code}-INFRASTRUCTURE.tfvars  \
    --library_parameter_file LIBRARY/${env_code}-${region_code}-SAP_LIBRARY/${env_code}-${region_code}-SAP_LIBRARY.tfvars
```

Verify that all resources are cleaned up.

## Next step

> [!div class="nextstepaction"]
> [Configure the control plane](configure-control-plane.md)
