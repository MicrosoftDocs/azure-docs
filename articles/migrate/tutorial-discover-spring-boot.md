---
title: Discover Spring Boot applications running in your datacenter with Azure Migrate Discovery and assessment
description: Learn how to Discover Spring Boot applications running in your datacenter by using the Azure Migrate Discovery and assessment tool.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: tutorial
ms.date: 09/28/2023
ms.custom: mvc, subject-rbac-steps, engagement-fy23
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

## Prerequisites

- Before you follow this tutorial to discover Spring Boot applications, make sure you've performed server discovery using the Azure Migrate appliance using the following tutorials:
   - [Discover servers running in a VMware environment](tutorial-discover-vmware.md)
   - [Discover servers running in Hyper-V environment](tutorial-discover-hyper-v.md)
   - [Discover physical servers](tutorial-discover-physical.md)
   - [Discover AWS instances](tutorial-discover-aws.md)
   - [Discover GCP instances](tutorial-discover-gcp.md)
- Ensure that you have performed software inventory by providing the server credentials on the appliance configuration manager. [Learn more](how-to-discover-applications.md).


## Set up Kubernetes-based appliance

After you have performed server discovery and software inventory using the Azure Migrate appliance, you can enable discovery of Spring Boot applications by setting up a Kubernetes appliance as follows:

### Onboard Kubernetes-based appliance

1. Go to the [Azure portal](https://aka.ms/migrate/springboot). Sign in with your Azure account and search for Azure Migrate.
2. On the **Overview** page > **Servers, databases and web apps**, select **Discover, assess and migrate**.
1. Select the project where you have set up the Azure Migrate appliance as part of prerequisites above.
1. You would see a message above Azure Migrate: Discovery and assessment tile to onboard a Kubernetes-based appliance to enable discovery of Spring Boot applications.
5.	You can proceed by selecting the link on the message, which will help you get started with onboarding Kubernetes-based appliance.
6.	In Step 1: Set up an appliance, select **Bring your own Kubernetes cluster** - You must bring your own Kubernetes cluster running on-premises, connect it to Azure Arc and use the installer script to set up the appliance.

**Support** | **Details**
---- | ----
**Validated Kubernetes distros** | See [Azure Arc-enabled Kubernetes validation](https://learn.microsoft.com/azure/azure-arc/kubernetes/validation-program).
**Hardware configuration required** | 6 GB RAM, with 30GB storage, 4 Core CPU
**Network Requirements** | Access to the following endpoints: <br/><br/> - api.snapcraft.io <br/><br/> - https://dc.services.visualstudio.com/v2/track <br/><br/> - [Azure Arc-enabled Kubernetes network requirements](https://learn.microsoft.com/azure/azure-arc/kubernetes/network-requirements?tabs=azure-cloud) <br/><br/> - [Azure CLI endpoints for proxy bypass](https://learn.microsoft.com/cli/azure/azure-cli-endpoints?tabs=azure-cloud)

#### Bring your own Kubernetes cluster (alternate option)

1.	In **Step 2: Choose connected cluster**, you need to select an existing Azure Arc connected cluster from your subscription. If you do not have an existing connected cluster, you can Arc enable a Kubernetes cluster running on-premises by following the steps [here](https://learn.microsoft.com/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli).

    > [!Note]
    > You can only select an existing connected cluster, deployed in the same region as that of your Azure Migrate project

2.	In Step 3: Provide appliance details for Azure Migrate, the appliance name is pre-populated, but you can choose to provide your own friendly name to the appliance.

3.	You can select a key vault from the drop-down or **Create new** key vault. This key vault is used to process the credentials provided in the project to start discovery of Spring Boot applications.

    > [!Note]
    > The Key Vault can be chosen or created in the same subscription and region as that of the Azure Migrate project. When creating/selecting a key vault, make sure that purge protection is disabled else there be will issues in processing of credentials through the key vault.

4.	After providing the appliance name and key vault, select **Generate script** to generate an installer script that you can copy and paste on a Linux server on-premises. Before executing the script, ensure that you meet the following prerequisites on the Linux server:

    **Support** | **Details**
    ---- | ----
    **Supported Linux OS** | Ubuntu 20.04, RHEL 9
    **Hardware configuration required** | 6 GB RAM, with 30GB storage, 4 Core CPU
    **Network Requirements** | Access to the following endpoints: <br/><br/> https://dc.services.visualstudio.com/v2/track <br/><br/> [Azure CLI endpoints for proxy bypass](https://learn.microsoft.com/cli/azure/azure-cli-endpoints?tabs=azure-cloud)

5.	After copying the script, go to your Linux server, save the script as *Deploy.sh* on the server.

#### Execute the installer script

After you have saved the script on the Linux server, follow these steps:

> [!Note]
> - If you have chosen to deploy a packaged Kubernetes cluster and are running the installation script on any other Linux OS except Ubuntu, ensure to install the snap module by following the instructions [here](https://snapcraft.io/docs/installing-snap-on-red-hat), before executing the script.
> - Also, ensure that you have curl installed on the server. For Ubuntu, you can install it using the command `sudo apt-get install curl`, and for other OS (RHEL/Centos), you can use the `yum install curl` command.


1.	Open the terminal on the server and execute the following command to execute the script as a root user:
`sudo su -`
2.	Change directory to where you have saved the script and execute the script using the `bash deploy.sh` command.
3.	Follow the instructions in the script and sign in with your Azure user account when prompted.
4.	The script performs the following steps:
    1. Installing required CLI extensions.
    2. Registering Azure Resource Providers.
    3. Checking for prerequisites like connectivity to required endpoints.
    4. Setting up MicroK8s Kubernetes cluster.
    5. Installing the required operators on the cluster.
    6. Creating the required Migrate resources.

After the script is executed successfully, configure the appliance through the portal. 

> [!Note] 
> If you encounter any issue during script execution, you need to run the script in *delete* mode by adding the following after line #19 in the `deploy.sh` script:
>
> export DELETE= “true”

The *delete* mode helps to clean up any existing components installed on the server so that you can do a fresh installation. After running the script in *delete* mode, remove the line from the script and execute it again in the default mode.

## Configure Kubernetes-based appliance

After successfully setting up the appliance using the installer script, you need to configure the appliance by following these steps:
1.	Go to the Azure Migrate project where you started onboarding the Kubernetes-based appliance.
2.	On the **Azure Migrate: Discovery and assessment** tile, select the appliance count for **Pending action** under appliances summary. 
3.	In **Overview** > **Manage** > **Appliances**, a filtered list of appliances appears with actions pending.
4.	Find the Kubernetes-based appliance that you have just set up and select **Credentials unavailable** status to configure the appliance.
5.	In the **Manage credentials** page, add the credentials to initiate discovery of the Spring Boot applications running on your servers.
6.	Select **Add credentials**, choose a credential type from Linux (non-domain) or Domain credentials, provide a friendly name, username, and password. Select **Save**.

   >[!Note]
   > - The credentials added on the portal are processed via the Azure Key Vault chosen in the initial steps of onboarding the Kubernetes-based appliance. The credentials are then synced (saved in an encrypted format) to the Kubernetes cluster on the appliance and removed from the Azure Key Vault.
  > - After the credentials have been successfully synced, they would be used for discovery of the specific workload in the next discovery cycle. 

7.	After adding a credential, you need to refresh the page to see the **Sync status** of the credential. If status is **Incomplete**, you can select the status to review the error encountered and take the recommended action.
After the credentials have been successfully synced, wait for 24 hours before you can review the discovered inventory by filtering for the specific workload in the **Discovered servers** page.

> [!Note]
> You can add/update credentials any time by navigating to **Azure Migrate: Discovery and assessment** > **Overview** > **Manage** > **Appliances** page, selecting **Manage credentials** from the options available in the Kubernetes-based appliance.

## Next steps
- [Assess Spring Boot](tutorial-assess-spring-boot.md) apps for migration.
- [Review the data](discovered-metadata.md#collected-data-for-physical-servers) that the appliance collects during discovery.