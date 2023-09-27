---
title: Discover Spring Boot applications running in your datacenter with Azure Migrate Discovery and assessment
description: Learn how to Discover Spring Boot applications running in your datacenter by using the Azure Migrate Discovery and assessment tool.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: tutorial
ms.date: 06/08/2023
ms.custom: mvc, subject-rbac-steps, engagement-fy23
---

# Tutorial: Discover Spring Boot applications running in your datacenter

This article describes how to discover Spring Boot applications running on servers in your datacenter, using Azure Migrate: Discovery and assessment tool. The discovery process is completely agentless, that is, no agents are installed on the target servers.

In this tutorial, you learn how to:
- Set up Kubernetes based appliance for discovery of Spring Boot applications
- Configure the appliance and initiate continuous discovery 


**Note:**

Tutorials show you the quickest path for trying out a scenario. They use default options where possible.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

- Before you follow this tutorial to discover Spring Boot applications, make sure you've performed server discovery using the Azure Migrate appliance using the following tutorials:
   - [Discover servers running in a VMware environment](https://learn.microsoft.com/azure/migrate/tutorial-discover-vmware)
   - [Discover servers running in Hyper-V environment](https://learn.microsoft.com/azure/migrate/tutorial-discover-hyper-v)
   - [Discover physical servers](https://learn.microsoft.com/azure/migrate/tutorial-discover-physical)
   - [Discover AWS instances](https://learn.microsoft.com/azure/migrate/tutorial-discover-aws)
   - [Discover GCP instances](https://learn.microsoft.com/azure/migrate/tutorial-discover-gcp)
- Ensure that you have performed software inventory by providing the server credentials on the appliance configuration manager. [Learn more](https://learn.microsoft.com/en-us/azure/migrate/how-to-discover-applications).


## Set up Kubernetes-based appliance

After you have performed server discovery and software inventory using the Azure Migrate appliance, you can enable discovery of Spring Boot applications by setting up a Kubernetes appliance as follows:

### Onboard Kubernetes-based appliance

1. Go to [Azure portal](https://aka.ms/migrate/springboot). Sign in with your Azure account and search for Azure Migrate.
2. On the **Overview** page > **Servers, databases and web apps**, select **Discover, assess and migrate**.
1. Select the project where you have set up the Azure Migrate appliance as part of prerequisites above.
1. You would see a message above Azure Migrate: Discovery and assessment tile to onboard a Kubernetes-based appliance to enable discovery of Spring Boot applications.

   ![Screenshot of the Assessment tools screen.](./media/tutorial-discover-spring-boot/spring-overview.png)

5.	You can proceed by selecting the link on the message which will help you get started with onboarding Kubernetes-based appliance.

   ![Screenshot of the onboard Kubernetes screen.](./media/tutorial-discover-spring-boot/spring-kubernetes-onboarding.png)

6.	In Step 1: Choose an appliance, you can select from the 2 options:
    - Option 1: **Install appliance using packaged Kubernetes cluster** - This option is selected by default as it is the recommended approach where the users can use the installer script to download and install a Kubernetes cluster on a Linux server on-premises set up the appliance.
    - Option 2: **Bring your own Kubernetes cluster** - You can choose to bring your own Kubernetes cluster running on-premises, connect it to Azure Arc and then use the installer script to set up the appliance.

#### Install appliance using packaged Kubernetes cluster (recommended)

1.	In Step 2: **Provide appliance details for Azure Migrate**, the appliance name is pre-populated, but you can choose to provide your own friendly name to the appliance.
2.	You can select a Key Vault from the drop-down or **Create new** Key Vault. This Key Vault is used to process the credentials provided in the project to start discovery of Spring Boot applications.

   **Note:**

   The Key Vault can be chosen or created in the same subscription and region as that of the Azure Migrate Project. When creating/selecting KV, make sure it does not have purge protection enabled else there be issues in processing of credentials through the Key Vault.

3.	After providing the appliance name and Key Vault, select “Generate script” to generate an installer script that you can copy and paste on a Linux server on-premises. Before executing the script, ensure that you meet the following prerequisites on the Linux server:

**Support** | **Details**
---- | ----
**Supported Linux OS** | Ubuntu 20.04, RHEL 9
**Hardware configuration required** | 6 GB RAM, with 30GB storage, 4 Core CPU
**Network Requirements** | Access to the following endpoints: <br/><br/> - api.snapcraft.io <br/><br/> - https://dc.services.visualstudio.com/v2/track <br/><br/> - https://learn.microsoft.com/azure/azure-arc/kubernetes/network-requirements?tabs=azure-cloud <br/><br/> - https://learn.microsoft.com/cli/azure/azure-cli-endpoints?tabs=azure-cloud

4.	After copying the script, you can go to your Linux server, save the script as Deploy.sh on the server.

#### Bring your own Kubernetes cluster (alternate option)

1.	In Step 2: Choose connected cluster, you need to select an existing Azure Arc connected cluster from your subscription. If you do not have an existing connected cluster, you can Arc enable a Kubernetes cluster running on-premises by following steps here.

**Note:**

You can only select an existing connected cluster, deployed in the same region as that of your Azure Migrate project

2.	In Step 3: Provide appliance details for Azure Migrate, the appliance name is pre-populated, but you can choose to provide your own friendly name to the appliance.
  
   ![Screenshot of the onboard Kubernetes cluster screen.](./media/tutorial-discover-spring-boot/spring-kubernetes-cluster.png)

3.	You can select a Key Vault from the drop-down or “Create new” Key Vault. This Key Vault is used to process the credentials provided in the project to start discovery of Spring Boot applications.

**Note:**

The Key Vault can be chosen or created in the same subscription and region as that of the Azure Migrate Project. When creating/selecting KV, make sure it does not have purge protection enabled else there be issues in processing of credentials through the Key Vault.

4.	After providing the appliance name and Key Vault, select “Generate script” to generate an installer script that you can copy and paste on a Linux server on-premises. Before executing the script, ensure that you meet the following prerequisites on the Linux server:

**Support** | **Details**
---- | ----
**Supported Linux OS** | Ubuntu 20.04, RHEL 9
**Hardware configuration required** | 6 GB RAM, with 30GB storage, 4 Core CPU
**Network Requirements** | Access to the following endpoints: <br/><br/> https://dc.services.visualstudio.com/v2/track <br/><br/> https://learn.microsoft.com/cli/azure/azure-cli-endpoints?tabs=azure-cloud

5.	After copying the script, you can go to your Linux server, save the script as *Deploy.sh* on the server.

#### Execute the installer script

After you have saved the script on the Linux server, you can follow these steps:

**Note:**

- If you have chosen to deploy a packaged K8s cluster and are running the installation script on any other Linux OS except Ubuntu than please ensure to install the snap module by following the instructions [here](https://snapcraft.io/docs/installing-snap-on-red-hat), before executing the script.
- Also, ensure that you have curl installed on the server. For Ubuntu, you can install it using the command `sudo apt-get install curl`, and for other OS (RHEL/Centos), you can use the `yum install curl` command.


1.	Open the Terminal on the server and execute the following command to execute the script as a root user:
`sudo su -`
2.	Change directory to where you have saved the script and execute the script using the `bash deploy.sh` command.
3.	Follow the instructions in the script and login in with your Azure user account when prompted.
4.	The script performs the following steps:
    1. 	Installing required CLI extensions
    2. Registering Azure Resource Providers
    3. Checking for prerequisites like connectivity to required endpoints
    4. Setting up MicroK8s Kubernetes cluster
    5. Install the required operators on the cluster
    6. Creating the required Migrate resources

After successful completion of script execution, you can go to the portal to configure the appliance. 

**Note:** 

If you encounter any issue during script execution, you need to run the script in “delete” mode by adding the following after line # 19 in the ‘deploy.sh’ script:

export DELETE= “true”

![Screenshot of the script.](./media/tutorial-discover-spring-boot/spring-script.png)

The “delete” mode will help clean up any existing components installed on the server so that you can do a fresh installation. After running the script in “delete” mode, remove the line from script and execute it again in the default mode.

## Configure Kubernetes-based appliance

After successfully setting up the appliance using the installer script, you need to configure the appliance by following these steps:
1.	Go to the Azure Migrate project where you started onboarding of the Kubernetes-based appliance.
2.	On thw **Azure Migrate: Discovery and assessment** tile, select the appliance count for **Pending action** under appliances summary. 

![Screenshot of pending action in appliances.](./media/tutorial-discover-spring-boot/spring-configure-kubernetes.png)
 
3.	You will be navigated to the **Overview** > **Manage** > **Appliances** page with a filtered list of appliances with pending action.
4.	Find the Kubernetes-based appliance that you have just set up and select **Credentials unavailable** status to configure the appliance.
 
![Screenshot of credentials unavailable message.](./media/tutorial-discover-spring-boot/spring-kubernetes-appliance.png)

5.	You will be navigated to the **Manage credentials** page where you need to add credentials to initiate discovery of Spring Boot applications, running on your servers.
6.	Select **Add credentials** and choose a credential type from Linux (Non-domain) or Domain credentials, provide a friendly name, username and password and click **Save**.

   **Note:** 

   The credentials added on the portal are processed via the Azure Key Vault chosen in the initial steps of onboarding the Kubernetes-based appliance. The credentials are then synced (saved in an encrypted format) to the Kubernetes cluster on the appliance and removed from the Azure Key Vault.

After the credentials have been successfully synced, they would be used for discovery of the specific workload in the next discovery cycle. 

7.	After adding a credential, you need to refresh the page to see the **Sync status** of the credential. If status is **Incomplete**, you can click on the status to review the error encountered and take the recommended action.
After the credentials have been successfully synced, wait for 24 hours before you can review the discovered inventory by filtering for the specific workload in the **Discovered servers** page.

**Note:** 

You can add/update credentials any time by navigating to **Azure Migrate: Discovery and assessment** > **Overview** > **Manage** > **Appliances** page, selecting **Manage credentials** from the options available with the Kubernetes-based appliance:

![Screenshot of Manage credentials option.](./media/tutorial-discover-spring-boot/spring-kubernetes-manage.png)