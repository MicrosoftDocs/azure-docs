---
title: Discover Spring Boot applications running in your datacenter with Azure Migrate Discovery and assessment
description: Learn how to Discover Spring Boot applications running in your datacenter by using the Azure Migrate Discovery and assessment tool.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: tutorial
ms.date: 03/12/2024
ms.custom: mvc, subject-rbac-steps, engagement-fy24, references_regions
---

# Tutorial: Discover Spring Boot applications running in your datacenter (preview)

This article describes how to discover Spring Boot applications running on servers in your datacenter, using Azure Migrate: Discovery and assessment tool. The discovery process is completely agentless; no agents are installed on the target servers.

In this tutorial, you learn how to:
- Set up Kubernetes based appliance for discovery of Spring Boot applications
- Configure the appliance and initiate continuous discovery 

> [!Note]
> - A Kubernetes-based appliance is required to discover Spring Boot applications. [Learn more](migrate-appliance.md) about scenarios covered by a Windows-based appliance.
> - Tutorials show you the quickest path for trying out a scenario. They use default options where possible.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Supported geographies

|**Geography**|
|----|
|Asia Pacific|
|Korea|
|Japan|
|United States|
|Europe|
|United Kingdom|
|Canada|
|Australia|
|France|

## Prerequisites

- Before you follow this tutorial to discover Spring Boot applications, make sure you've performed server discovery using the Azure Migrate appliance using the following tutorials:
   - [Discover servers running in a VMware environment](tutorial-discover-vmware.md)
   - [Discover servers running in Hyper-V environment](tutorial-discover-hyper-v.md)
   - [Discover physical servers](tutorial-discover-physical.md)
   - [Discover AWS instances](tutorial-discover-aws.md)
   - [Discover GCP instances](tutorial-discover-gcp.md)
- Ensure that you have performed software inventory by providing the server credentials on the appliance configuration manager. [Learn more](how-to-discover-applications.md).
- Only Migrate projects created with Public endpoint connectivity are supported. Private endpoint projects are not supported. 

## Set up Kubernetes-based appliance

After you have performed server discovery and software inventory using the Azure Migrate appliance, you can enable discovery of Spring Boot applications by setting up a Kubernetes appliance as follows:

### Onboard Kubernetes-based appliance

1. Go to the [Azure portal](https://aka.ms/migrate/springboot). Sign in with your Azure account and search for Azure Migrate.
2. On the **Overview** page > **Servers, databases and web apps**, select **Discover, assess and migrate**.
1. Select the project where you have set up the Azure Migrate appliance as part of the prerequisites.
1. You see a message above Azure Migrate: Discovery and assessment tile to onboard a Kubernetes-based appliance to enable discovery of Spring Boot applications.

   :::image type="content" source="./media/tutorial-discover-spring-boot/discover-banner-inline.png" alt-text="Screenshot shows the banner for discovery and assessment of web apps." lightbox="./media/tutorial-discover-spring-boot/discover-banner-expanded.png":::   

5.	You can proceed by selecting the link on the message, which helps you get started with onboarding Kubernetes-based appliance.
    
    > [!Note]
    > We recommend you choose a Kubernetes cluster with disk encryption for its services. [Learn more](#encryption-at-rest) about encrypting data at rest in Kubernetes.

6.	In **Choose an appliance**, you can select one from the following options:

    - **Install appliance using packaged Kubernetes cluster** - This option is selected by default as it is the recommended approach where the users can use the installer script to download and install a Kubernetes cluster on a Linux server on-premises to set up the appliance. 
    - **Bring your own Kubernetes cluster** - You must bring your own Kubernetes cluster running on-premises, connect it to Azure Arc, and use the installer script to set up the appliance.


#### [Install appliance using packaged Kubernetes cluster (recommended)](#tab/K8-package)

1. In **Provide appliance details for Azure Migrate**, the appliance name is pre-populated, but you can choose to provide your own friendly name to the appliance. 

   :::image type="content" source="./media/tutorial-discover-spring-boot/packaged-cluster-inline.png" alt-text="Screenshot that shows the Install appliance using packaged Kubernetes cluster option selected." lightbox="./media/tutorial-discover-spring-boot/packaged-cluster-expanded.png":::


2. Select a Key Vault from the drop-down or **Create new** Key vault. This Key Vault is used to process the credentials provided in the project to start discovery of Spring Boot applications. 

    > [!Note]
    > The Key Vault can be chosen or created in the same subscription and region as that of the Azure Migrate Project. When creating/selecting KV, make sure it does not have purge protection enabled else there be issues in processing of credentials through the Key Vault. 

3. After providing the appliance name and Key Vault, select **Generate script** to generate an installer script that you can copy and paste on a Linux server on-premises. Before executing the script, ensure that you meet the following prerequisites on the Linux server: 

    **Support** | **Details**
    ---- | ----
    **Supported Linux OS** | Ubuntu 20.04, RHEL 9
    **Hardware configuration required** | 8 GB RAM, with 30 GB storage, 4 Core CPU
    **Network Requirements** | Access to the following endpoints: <br/><br/>*.docker.io <br/></br>*.docker.com <br/><br/>api.snapcraft.io <br/><br/> https://dc.services.visualstudio.com/v2/track <br/><br/> [Azure Arc-enabled Kubernetes network requirements](../azure-arc/kubernetes/network-requirements.md) <br/><br/>[Azure CLI endpoints for proxy bypass](/cli/azure/azure-cli-endpoints)

After copying the script, you can go to your Linux server, save the script as *Deploy.sh* on the server. 

#### [Bring your own Kubernetes cluster](#tab/K8-byoc)

1.	In **Choose connected cluster**, you need to select an existing Azure Arc connected cluster from your subscription. If you don't have an existing connected cluster, you can Arc enable a Kubernetes cluster running on-premises by following the steps [here](../azure-arc/kubernetes/quickstart-connect-cluster.md?tabs=azure-cli).

    > [!Note]
    > You can only select an existing connected cluster that's deployed in the same region as your Azure Migrate project.

    :::image type="content" source="./media/tutorial-discover-spring-boot/choose-cluster-inline.png" alt-text="Screenshot displays Choose cluster option in the Onboard Kubernetes appliance screen." lightbox="./media/tutorial-discover-spring-boot/choose-cluster-expanded.png":::

2.	In **Provide appliance details for Azure Migrate**, the appliance name is prepopulated, but you can choose to provide your own friendly name to the appliance.

3.	You can select a Key Vault from the drop-down or **Create new** Key Vault. This Key Vault is used to process the credentials provided in the project to start discovery of Spring Boot applications.

    > [!Note]
    > The Key Vault can be chosen or created in the same subscription and region as that of the Azure Migrate project. When creating/selecting a Key Vault, make sure that purge protection is disabled else there will be issues in processing of credentials through the Key Vault.

4.	After providing the appliance name and Key Vault, select **Generate script** to generate an installer script that you can copy and paste on a Linux server on-premises. Before executing the script, ensure that you meet the following prerequisites on the Linux server:

    **Support** | **Details**
    ---- | ----
    **Supported Linux OS** | Ubuntu 20.04, RHEL 9
    **Hardware configuration required** | 6 GB RAM, with 30 GB storage on root volume, 4 Core CPU
    **Network Requirements** | Access to the following endpoints: <br/><br/> https://dc.services.visualstudio.com/v2/track <br/><br/> [Azure CLI endpoints for proxy bypass](/cli/azure/azure-cli-endpoints)

5.	After copying the script, go to your Linux server, save the script as *Deploy.sh* on the server.
---

### Connect using an outbound proxy server
If your machine is behind an outbound proxy server, requests must be routed via the outbound proxy server. Follow these steps to provide proxy settings:
1.	Open the terminal on the server and execute the following command to set up environment variables as a root user:
    `sudo su -`
2.	On the deployment machine, set the environment variables needed for `deploy.sh` to use the outbound proxy server:
    ```
    export HTTP_PROXY=”<proxy-server-ip-address>:<port>”
    export HTTPS_PROXY=”<proxy-server-ip-address>:<port>”
    export NO_PROXY=””
    ```
3. If your proxy uses a certificate, provide the absolute path to the certificate.
   `export PROXY_CERT=””`

> [!Note] 
> The machine uses proxy details while installing the required prerequisites to run the `deploy.sh` script . It won't override the proxy settings of the Azure Arc-enabled Kubernetes cluster.

### Execute the installer script

#### [Packaged Kubernetes cluster](#tab/K8-package)

After you save the script on the Linux server, follow these steps:

> [!Note]
> This script needs to be run after you connect to a Linux machine on its terminal that has met the networking pre-requisite and OS compatibility.  
> Ensure that you have curl installed on the server. For Ubuntu, you can install it using the command `sudo apt-get install curl`, and for other OS (RHEL/Centos), you can use the command `yum install curl`.  

> [!Important]
> Don't edit the script unless you want to clean up the setup.

1. Open the Terminal on the server and execute the following command to execute the script as a root user: 
    `sudo su -` 

1. Change the directory to where you saved the script and execute the script using command: `bash deploy.sh` 

1. Follow the instructions in the script and sign in with your Azure user account when prompted. 

1. The script performs the following steps: 

    1. Installing required CLI extensions. 
    2. Registering Azure Resource Providers 
    3. Checking for prerequisites like connectivity to required endpoints 
    4. Setting up MicroK8s Kubernetes cluster 
    5. Installing the required operators on the cluster 
    6. Creating the required Migrate resources 
    
1. After the script is executed successfully, configure the appliance through the portal.

#### [Bring your own cluster](#tab/K8-byoc)

After you save the script on the Linux server, follow these steps:

> [!Note]
> - This script needs to be run after you connect to a Linux machine on its terminal that meets the networking prerequisites and OS compatibility. 
> - Ensure that you have curl installed on the server. For Ubuntu, you can install it using the command `sudo apt-get install curl`, and for other OS (RHEL/Centos), you can use the `yum install curl` command.

> [!Important]
> Don't edit the script unless you want to clean up the setup.

1.	Open the terminal on the server and execute the following command to execute the script as a root user:
`sudo su -`
1.	Navigate to the directory where you saved the script and execute the script using the `bash deploy.sh` command.

1.	Follow the instructions in the script and sign in with your Azure user account when prompted.

1.	The script performs the following steps:

    1. Installing required CLI extensions.
    2. Registering Azure Resource Providers.
    3. Checking for prerequisites like connectivity to required endpoints.
    5. Installing the required operators on the cluster.
    6. Creating the required Migrate resources.

1. After the script is executed successfully, configure the appliance through the portal. 
---

### Reinstallation

> [!NOTE]
> If you encounter any issue during script execution, you need to re-run the script and it would resume from last successful state. In case you want to perform a complete fresh install, see [cleanup of setup](#cleanup-of-setup) details before you re-run the script.

## Encryption at rest

#### [Packaged Kubernetes cluster](#tab/cluster)

As you are setting a packaged appliance, we would have shared responsibility to ensure that the secrets are secured.  
- We recommend you choose a Linux VM with disk encryption for its services.

#### [Bring your own Kubernetes cluster](#tab/encrypt-rest)

As you're bringing your own Kubernetes cluster, there's a shared responsibility to ensure that the secrets are secured. 
- We recommend you choose a Kubernetes cluster with disk encryption for its services. 
- [Learn more](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) about encrypting data at rest in Kubernetes.
---

## Configure Kubernetes-based appliance

After successfully setting up the appliance using the installer script, you need to configure the appliance by following these steps:
1.	Go to the Azure Migrate project where you started onboarding the Kubernetes-based appliance.
2.	On the **Azure Migrate: Discovery and assessment** tile, select the appliance count for **Pending action** under appliances summary. 

    :::image type="content" source="./media/tutorial-discover-spring-boot/pending-action-inline.png" alt-text="Screenshot displays the Pending action option." lightbox="./media/tutorial-discover-spring-boot/pending-action-expanded.png":::

3.	In **Overview** > **Manage** > **Appliances**, a filtered list of appliances appears with actions pending.
4.	Find the Kubernetes-based appliance that you set up and select **Credentials unavailable** status to configure the appliance.

    :::image type="content" source="./media/tutorial-discover-spring-boot/appliances-inline.png" alt-text="Screenshot displays the details of the appliance." lightbox="./media/tutorial-discover-spring-boot/appliances-expanded.png":::

5.	In the **Manage credentials** page, add the credentials to initiate discovery of the Spring Boot applications running on your servers.

    :::image type="content" source="./media/tutorial-discover-spring-boot/manage-appliances-inline.png" alt-text="Screenshot displays the Manage credentials option." lightbox="./media/tutorial-discover-spring-boot/manage-appliances-expanded.png":::

6.	Select **Add credentials**, choose a credential type from Linux (non-domain) or Domain credentials, provide a friendly name, username, and password. Select **Save**.

    > [!Note]
    > - The credentials added on the portal are processed via the Azure Key Vault chosen in the initial steps of onboarding the Kubernetes-based appliance. The credentials are then synced (saved in an encrypted format) to the Kubernetes cluster on the appliance and removed from the Azure Key Vault.
    > - After the credentials have been successfully synced, they would be used for discovery of the specific workload in the next discovery cycle. 

7.	After adding a credential, you need to refresh the page to see the **Sync status** of the credential. If status is **Incomplete**, you can select the status to review the error encountered and take the recommended action.
After the credentials have been successfully synced, wait for 24 hours before you can review the discovered inventory by filtering for the specific workload in the **Discovered servers** page.

    > [!Note]
    > You can add/update credentials any time by navigating to **Azure Migrate: Discovery and assessment** > **Overview** > **Manage** > **Appliances** page, selecting **Manage credentials** from the options available in the Kubernetes-based appliance.

## Cleanup of setup

To cleanup, run the following script in delete mode:

In the script generated by the portal, after all the user arguments (after line 19 in the following image), add `export DELETE= “true”` and run the same script again. This will clean up all existing components created during appliance creation.

:::image type="content" source="./media/tutorial-discover-spring-boot/delete-image-inline.png" alt-text="Screenshot shows delete mode." lightbox="./media/tutorial-discover-spring-boot/delete-image-expanded.png":::

## Overview of Discovery results

The **Discovered servers** screen provides the following information:
- Displays all running Spring Boot workloads on your server-based environment.
- Lists the basic information of each server in a table format.

:::image type="content" source="./media/tutorial-discover-spring-boot/discovered-servers-inline.png" alt-text="Screenshot displays the discovered servers." lightbox="./media/tutorial-discover-spring-boot/discovered-servers-expanded.png":::

Select any web app to view its details. The **Web apps** screen provides the following information:
- Provides a comprehensive view of each Spring Boot process on each server.
- Displays the detailed information of each process, including:
  - JDK version and Spring Boot version.
  - Environment variable names and JVM options that are configured.
  - Application configuration and certificate files in use.
  - Location of JAR file for the process on the server.
  - Static content locations and binding ports.

:::image type="content" source="./media/tutorial-discover-spring-boot/web-apps-inline.png" alt-text="Screenshot displays the Web apps screen." lightbox="./media/tutorial-discover-spring-boot/web-apps-expanded.png":::


## Next steps
- [Assess Spring Boot](tutorial-assess-spring-boot.md) apps for migration.
- [Review the data](discovered-metadata.md#collected-data-for-physical-servers) that the appliance collects during discovery.