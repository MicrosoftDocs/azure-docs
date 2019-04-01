---
title: Deploy Azure Stack App Service in a highly available configuration | Microsoft Docs
description: Learn how to deploy App Service in Azure Stack using a highly available configuration.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: 
ms.date: 03/23/2019
ms.author: jeffgilb
ms.reviewer: anwestg
ms.lastreviewed: 03/23/2019
---

# Deploy App Service in a highly available configuration

This article shows how to use Azure Stack marketplace items to deploy App Service for Azure Stack in a highly available configuration. In addition to available marketplace items, this solution also uses the [appservice-fileshare-sqlserver-ha](https://github.com/Azure/azurestack-quickstart-templates/tree/master/appservice-fileserver-sqlserver-ha) Azure Stack Quickstart template. This template automates the creation of a highly available infrastructure for hosting the App Service resource provider. App Service is then installed on this highly available VM infrastructure. 

## Deploy the highly available App Service infrastructure VMs
The [appservice-fileshare-sqlserver-ha](https://github.com/Azure/azurestack-quickstart-templates/tree/master/appservice-fileserver-sqlserver-ha) Azure Stack Quickstart template simplifies the deployment of App Service in a highly available configuration. It should be deployed in the Default Provider Subscription. 

When used to create a custom resource in Azure Stack, the template creates:
- A virtual network and required subnets.
- Network security groups for file server, SQL Server, and Active Directory Domain Services (AD DS) subnets.
- Storage accounts for VM disks and cluster cloud witness.
- One internal load balancer for SQL VMs with private IP bound to the SQL AlwaysOn listener.
- Three availability sets for the AD DS, file server cluster, and the SQL cluster.
- Two node SQL cluster.
- Two node file server cluster.
- Two domain controllers.

### Required Azure Stack marketplace items
Before using this template, ensure that the following [Azure Stack marketplace items](azure-stack-marketplace-azure-items.md) are available in your Azure Stack instance:

- Windows Server 2016 Datacenter Core Image (for AD DS and file server VMs)
- SQL Server 2016 SP2 on Windows Server 2016 (Enterprise)
- Latest SQL IaaS Extension 
- Latest PowerShell Desired State Configuration Extension 

> [!TIP]
> Review [the template readme file](https://github.com/Azure/azurestack-quickstart-templates/tree/master/appservice-fileserver-sqlserver-ha) on GitHub for additional details on template requirements and default values. 

### Deploy the App Service infrastructure
Use the steps in this section to create a custom deployment using the **appservice-fileshare-sqlserver-ha** Azure Stack Quickstart template.

1. [!INCLUDE [azs-admin-portal](../../includes/azs-admin-portal.md)]

2. Select **\+** **Create a resource** > **Custom**, and then **Template deployment**.

   ![Custom template deployment](media/app-service-deploy-ha/1.png)


3. On the **Custom deployment** blade, select **Edit template** > **Quickstart template** and then use the drop-down list of available custom templates to select the **appservice-fileshare-sqlserver-ha** template, click **OK**, and then **Save**.

   ![Select the appservice-fileshare-sqlserver-ha QuickStart template](media/app-service-deploy-ha/2.png)

4. On the **Custom deployment** blade, select **Edit parameters** and scroll down to review the default template values. Modify these values as necessary to provide all required parameter information and then click **OK**.<br><br> At a minimum, provide complex passwords for the ADMINPASSWORD, FILESHAREOWNERPASSWORD, FILESHAREUSERPASSWORD, SQLSERVERSERVICEACCOUNTPASSWORD, and SQLLOGINPASSWORD parameters.
    
   ![Edit custom deployment parameters](media/app-service-deploy-ha/3.png)

5. On the **Custom deployment** blade, ensure **Default Provider Subscription** is selected as the subscription to use and then create a new resource group, or select an existing resource group, for the custom deployment.<br><br> Next, select the resource group location (**local** for ASDK installations) and then click **Create**. The custom deployment settings will be validated before template deployment starts.

    ![Create custom deployment](media/app-service-deploy-ha/4.png)

6. In the administration portal, select **Resource groups** and then the name of the resource group you created for the custom deployment (**app-service-ha** in this example). View the status of the deployment to ensure all deployments have completed successfully.

   > [!NOTE]
   > The template deployment will take about an hour to complete.

   [![](media/app-service-deploy-ha/5-sm.png "Review template deployment status")](media/app-service-deploy-ha/5-lg.png#lightbox)


### Record template outputs
After the template deployment completes successfully, record the template deployment outputs. You will need to provide this information when running the App Service installer. 

Ensure you record each of these output values:
- FileSharePath
- FileShareOwner
- FileShareUser
- SQLserver
- SQLuser

Follow these steps to discover the template output values:

1. [!INCLUDE [azs-admin-portal](../../includes/azs-admin-portal.md)]

2. In the administration portal, select **Resource groups** and then the name of the resource group you created for the custom deployment (**app-service-ha** in this example). 

3. Click **Deployments** and select **Microsoft.Template**.

    ![Microsoft.Template deployment](media/app-service-deploy-ha/6.png)

4. After selecting the **Microsoft.Template** deployment, select **Outputs** and record the template parameter output. This information will be required when deploying App Service.

    ![Parameter output](media/app-service-deploy-ha/7.png)


## Deploy App Service in a highly available configuration
Follow the steps in this section to deploy App Service for Azure Stack in a highly available configuration based on the [appservice-fileshare-sqlserver-ha](https://github.com/Azure/azurestack-quickstart-templates/tree/master/appservice-fileserver-sqlserver-ha) Azure Stack Quickstart template. 

After you install the App Service resource provider, you can include it in your offers and plans. Users can then subscribe to get the service and start creating applications.

> [!IMPORTANT]
> Before you run the resource provider installer, make sure that you've read the release notes, which accompany each App Service release, to learn about new functionality, fixes, and any known issues which could affect your deployment.

### Prerequisites
Before you can run the App Service installer, several steps are required as described in the [Before you get started with App Service on Azure Stack article](azure-stack-app-service-before-you-get-started.md):

> [!TIP]
> Not all steps described in the before you get started article are required because the template deploymnet configures the infrastructure VMs for you. 

- [Download the App Service installer and helper scripts](azure-stack-app-service-before-you-get-started.md#download-the-installer-and-helper-scripts).
- [Download the latest custom script extension to the Azure Stack marketplace](azure-stack-app-service-before-you-get-started.md#syndicate-the-custom-script-extension-from-the-marketplace).
- [Generate required certificates](azure-stack-app-service-before-you-get-started.md#get-certificates).
- Create the ID Application based on the identify provider you've chosen for Azure Stack. An ID Application can be made for either [Azure AD](azure-stack-app-service-before-you-get-started.md#create-an-azure-active-directory-application) or [Active Directory Federation Services](azure-stack-app-service-before-you-get-started.md#create-an-active-directory-federation-services-application) and record the application ID.
- Ensure that you have added the Windows Server 2016 Datacenter image to the Azure Stack marketplace. This is required for App Service installation.

### Deploy App Service in highly available configuration
Installing the App Service resource provider takes at least an hour. The length of time needed depends on how many role instances you deploy. During the deployment, the installer runs the following tasks:

- Create a blob container in the specified Azure Stack storage account.
- Create a DNS zone and entries for App Service.
- Register the App Service resource provider.
- Register the App Service gallery items.

To deploy App Service resource provider, follow these steps:

1. Run the previously downloaded App Service installer (**appservice.exe**) as an administrator from a computer that can access the Azure Stack Admin Azure Resource Management Endpoint.

2. Select **Deploy App Service or upgrade to the latest version**.

    ![Deploy or upgrade](media/app-service-deploy-ha/01.png)

3. Accept Microsoft licensing terms and click **Next**.

    ![Microsoft licensing terms](media/app-service-deploy-ha/02.png)

4. Accept non-Microsoft licensing terms and click **Next**.

    ![Non-Microsoft licensing terms](media/app-service-deploy-ha/03.png)

5. Provide the App Service cloud endpoint configuration for your Azure Stack environment.

    ![App Service cloud endpoint configuration](media/app-service-deploy-ha/04.png)

6. **Connect** to the Azure Stack subscription to be used for the installation and choose the location. 

    ![Connect to the Azure Stack subscription](media/app-service-deploy-ha/05.png)

7. Select **Use existing VNet and Subnets** and the **Resource Group Name** for the resource group used to deploy the highly available template.<br><br>Next, select the virtual network created as part of the template deployment and then select the appropriate role subnets from the drop-down list options. 

    ![Vnet selection](media/app-service-deploy-ha/06.png)

8. Provide the previously recorded template outputs information for the file share path and file share owner parameters. When finished, click **Next**.

    ![File share output information](media/app-service-deploy-ha/07.png)

9. Because the machine being used to install App Service is not located on the same VNet as the file server being used to host the App Service file share, you will not be able to resolve the name. **This is expected behavior**.<br><br>Verify that the information entered for the file share UNC path and accounts information is correct and press **Yes** on the alert dialog to continue App Service installation.

    ![Expected error dialog](media/app-service-deploy-ha/08.png)

    If you chose to deploy into an existing virtual network and an internal IP address to connect to your file server, you must add an outbound security rule, enabling SMB traffic between the worker subnet and the file server. Go to the WorkersNsg in the administration portal and add an outbound security rule with the following properties:
    - Source: Any
    - Source port range: *
    - Destination: IP Addresses
    - Destination IP address range: Range of IPs for your file server
    - Destination port range: 445
    - Protocol: TCP
    - Action: Allow
    - Priority: 700
    - Name: Outbound_Allow_SMB445

10. Provide the Identity Application ID and the path and passwords to the identity certificates and click **Next**:
    - Identity application certificate (in the format of **sso.appservice.local.azurestack.external.pfx**)
    - Azure Resource Manager root certificate (**AzureStackCertificationAuthority.cer**)

    ![ID application certificate and root certificate](media/app-service-deploy-ha/008.png)

10. Next, provide the remaining required information for the following certificates and click **Next**:
    - Default Azure Stack SSL certificate (in the format of **_.appservice.local.azurestack.external.pfx**)
    - API SSL certificate (in the format of **api.appservice.local.azurestack.external.pfx**)
    - Publisher certificate (in the form of **ftp.appservice.local.azurestack.external.pfx**) 

    ![Additional configuration certificates](media/app-service-deploy-ha/09.png)

11. Provide the SQL Server connection information using the SQL Server connection information from the high availability template deployment outputs:

    ![SQL Server connection information](media/app-service-deploy-ha/10.png)

12. Because the machine being used to install App Service is not located on the same VNet as the SQL server being used to host the App Service databases, you will not be able to resolve the name.  **This is expected behavior**.<br><br>Verify that the information entered for the SQL Server name and accounts information is correct and press **Yes** to continue App Service installation. Click **Next**.

    ![SQL Server connection information](media/app-service-deploy-ha/11.png)

13. Accept the default role configuration values or change to the recommended values and click **Next**.<br><br>We recommend that the default values for the App Service infrastructure role instances be changed as follows for highly available configurations:

    |Role|Default|Highly available recommendation|
    |-----|-----|-----|
    |Controller Role|2|2|
    |Management Role|1|3|
    |Publisher Role|1|3|
    |FrontEnd Role|1|3|
    |Shared Worker Role|1|10|
    |     |     |     |

    ![Infrastructure role instance values](media/app-service-deploy-ha/12.png)

    > [!NOTE]
    > Changing from the default values to those recommended in this tutoral increases the hardware requirements for installing App Service. A total of 26 cores and 46,592 MB of RAM is needed to support the recommended 21 VMs instead of the default 18 cores and 32,256 MB of RAM for 15 VMs.

14. Select the platform image to use for installing the App Service infrastructure VMs and click **Next**:

    ![Platform image selection](media/app-service-deploy-ha/13.png)

15. Provide App Service infrastructure role credential information to be used and click **Next**:

    ![Infrastructure role credentials](media/app-service-deploy-ha/14.png)

16. Review the information to be used to deploy App Service and click **Next** to begin deployment. 

    ![Review installation summary](media/app-service-deploy-ha/15.png)

17. Review the App Service deployment progress. This can take over an hour depending on your specific deployment configuration and hardware. After the installer successfully finishes, select **Exit**.

    ![Setup complete](media/app-service-deploy-ha/16.png)


## Next steps

[Scale out App Service](azure-stack-app-service-add-worker-roles.md). You might need to add additional App Service infrastructure role workers to meet expected application demand in your environment. By default, App Service on Azure Stack supports free and shared worker tiers. To add other worker tiers, you need to add more worker roles.

[Configure deployment sources](azure-stack-app-service-configure-deployment-sources.md). Additional configuration is required to support on-demand deployment from multiple source control providers like GitHub, BitBucket, OneDrive, and DropBox.

[Back up App Service](app-service-back-up.md). After successfully deploying, and configuring App Service, you should ensure all components necessary for disaster recovery are backed up to prevent data loss and avoid unnecessary service downtime during recovery operations.