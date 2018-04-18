---
title: HPC Pack cluster with Azure Active Directory | Microsoft Docs
description: Learn how to integrate a Microsoft HPC Pack 2016 cluster in Azure with Azure Active Directory
services: virtual-machines-windows
documentationcenter: ''
author: dlepow
manager: jeconnoc


ms.assetid: 9edf9559-db02-438b-8268-a6cba7b5c8b7
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-multiple
ms.workload: big-compute
ms.date: 11/16/2017
ms.author: danlep

---
# Manage an HPC Pack cluster in Azure using Azure Active Directory
[Microsoft HPC Pack 2016](https://technet.microsoft.com/library/cc514029) supports integration with [Azure Active Directory](../../active-directory/index.md) (Azure AD) for administrators who deploy an HPC Pack cluster in Azure.



Follow the steps in this article for the following high level tasks: 
* Manually integrate your HPC Pack cluster with your Azure AD tenant
* Manage and schedule jobs in your HPC Pack cluster in Azure 

Integrating an HPC Pack cluster solution with Azure AD follows standard steps to integrate other applications and services. This article assumes you are familiar with basic user management in Azure AD. For more information and background, see the [Azure Active Directory documentation](../../active-directory/index.md) and the following section.

## Benefits of integration


Azure Active Directory (Azure AD) is a multi-tenant cloud-based directory and identity management service that provides single sign-on (SSO) access to cloud solutions.

Integration of an HPC Pack cluster with Azure AD can help you achieve the following goals:

* Remove the traditional Active Directory domain controller from the HPC Pack cluster. This can help reduce the costs of maintaining the cluster if this is not necessary for your business, and speed-up the deployment process.
* Leverage the following benefits that are brought by Azure AD:
    *   Single sign-on 
    *   Using a local AD identity for the HPC Pack cluster in Azure 

    ![Azure Active Directory environment](./media/hpcpack-cluster-active-directory/aad.png)


## Prerequisites
* **HPC Pack 2016 cluster deployed in Azure virtual machines** - For steps, see [Deploy an HPC Pack 2016 cluster in Azure](hpcpack-2016-cluster.md). You need the DNS
  name of the head node and the credentials of a cluster administrator to
  complete the steps in this article.

  > [!NOTE]
  > Azure Active Directory integration is not supported in versions of HPC Pack before HPC Pack 2016.



* **Client computer** - You need a Windows or Windows Server client computer to  run HPC Pack client utilities. If you only want to use the HPC Pack web portal or REST API to submit jobs, you can use any client computer of your choice.

* **HPC Pack client utilities** - Install the HPC Pack client utilities on the client computer, using the free installation package available from the Microsoft Download Center.


## Step 1: Register the HPC cluster server with your Azure AD tenant
1. Sign in to the [Azure portal](https://portal.azure.com).
2. If your account gives you access to more than one Azure AD tenant, click your account in the top right corner. Then set your portal session to the desired tenant. You must have permission to access resources in the directory. 
3. Click **Azure Active Directory** in the left Services navigation pane, click **Users and groups**, and make sure there are user accounts already created or configured.
4. In **Azure Active Directory**, click **App registrations** > **New application registration**. Enter the following information:
    * **Name** - HPCPackClusterServer
    * **Application type** - Select **Web app / API**
    * **Sign-on URL**- The base URL for the sample, which is by default `https://hpcserver`
    * Click **Create**.
5. After the app is added, select it in the **App registrations** list. Then click **Settings** > **Properties**. Enter the following information:
    * Select **Yes** for **Multi-tenanted**.
    * Change **App ID URI** to `https://<Directory_name>/<application_name>`. Replace `<Directory_name`> with the full name of your Azure AD tenant, for example, `hpclocal.onmicrosoft.com`, and replace `<application_name>` with the name you chose previously.
6. Click **Save**. When saving completes, on the app page, click **Manifest**. Edit the manifest by locating the `appRoles` setting and adding the following application role, and then click **Save**:

  ```json
  "appRoles": [
     {
     "allowedMemberTypes": [
         "User",
         "Application"
     ],
     "displayName": "HpcAdminMirror",
     "id": "61e10148-16a8-432a-b86d-ef620c3e48ef",
     "isEnabled": true,
     "description": "HpcAdminMirror",
     "value": "HpcAdminMirror"
     },
     {
     "allowedMemberTypes": [
         "User",
         "Application"
     ],
     "description": "HpcUsers",
     "displayName": "HpcUsers",
     "id": "91e10148-16a8-432a-b86d-ef620c3e48ef",
     "isEnabled": true,
     "value": "HpcUsers"
     }
  ],
  ```
7. In **Azure Active Directory**, click **Enterprise applications** > **All applications**. Select **HPCPackClusterServer** from the list.
8. Click **Properties**, and change **User assignment required** to **Yes**. Click **Save**.
9. Click **Users and groups** > **Add user**. Select a user and select a role, and then click **Assign**. Assign one of the available roles (HpcUsers or HpcAdminMirror) to the user. Repeat this step with additional users in the directory. For background information about cluster users, see [Managing Cluster Users](https://technet.microsoft.com/library/ff919335(v=ws.11).aspx).


## Step 2: Register the HPC cluster client with your Azure AD tenant

1. Sign in to the [Azure portal](https://portal.azure.com).
2. If your account gives you access to more than one Azure AD tenant, click your account in the top right corner. Then set your portal session to the desired tenant. You must have permission to access resources in the directory. 
3. In **Azure Active Directory**, click **App registrations** > **New application registration**. Enter the following information:

    * **Name** - HPCPackClusterClient    
    * **Application type** - Select **Native**
    * **Redirect URI** - `http://hpcclient`
    * Click **Create**

4. After the app is added, select it in the **App registrations** list. Copy the **Application ID** value and save it. You need this later when configuring your application.

5. Click **Settings** > **Required permissions** > **Add** > **Select an API**. Search and select the HpcPackClusterServer application (created in Step 1).

6. In the **Enable Access** page, select **Access HpcClusterServer**. Then click **Done**.


## Step 3: Configure the HPC cluster

1. Connect to the HPC Pack 2016 head node in Azure.

2. Start HPC PowerShell.

3. Run the following command:

    ```powershell

    Set-HpcClusterRegistry -SupportAAD true -AADInstance https://login.microsoftonline.com/ -AADAppName HpcPackClusterServer -AADTenant <your AAD tenant name> -AADClientAppId <client ID> -AADClientAppRedirectUri http://hpcclient
    ```
    where

    * `AADTenant` specifies the Azure AD tenant name, such as `hpclocal.onmicrosoft.com`
    * `AADClientAppId` specifies the Application ID for the app created in Step 2.

4. Do one of the following, depending on the head node configuration:

    * In a single head node HPC Pack cluster, restart the HpcScheduler service.

    * In an HPC Pack cluster with multiple head nodes, run the following PowerShell commands on the head node to restart the HpcSchedulerStateful service:

    ```powershell
    Connect-ServiceFabricCluster

    Move-ServiceFabricPrimaryReplica –ServiceName "fabric:/HpcApplication/SchedulerStatefulService"

    ```

## Step 4: Manage and submit jobs from the client

To install the HPC Pack client utilities on your computer, download the
HPC Pack 2016 setup files (full installation) from the Microsoft Download
Center. When you begin the installation, choose the setup option for the **HPC Pack client utilities**.

To prepare the client computer, install the certificate used during [HPC cluster setup](hpcpack-2016-cluster.md) on the client computer. Use standard Windows certificate management procedures to install the public certificate to the **Certificates – Current user** > **Trusted Root Certification Authorities** store. 

You can now run the HPC Pack commands or use the HPC Pack Job manager GUI to submit and manage cluster jobs by using the Azure AD account. For job submission options, see [Submit HPC jobs to an HPC Pack cluster in Azure](hpcpack-cluster-submit-jobs.md#step-3-run-test-jobs-on-the-cluster).

> [!NOTE]
> When you try to connect to the HPC Pack cluster in Azure for the first time, a popup windows appears. Enter your Azure AD credentials to log in. The token is then cached. Later connections to the cluster in Azure use the cached token unless authentication changes or the cache is cleared.
>
  
For example, after completing the previous steps, you can query for jobs from an on-premises client as follows:

```powershell 
Get-HpcJob –State All –Scheduler https://<Azure load balancer DNS name> -Owner <Azure AD account>
```

## Useful cmdlets for job submission with Azure AD integration 

### Manage the local token cache

HPC Pack 2016 provides the following HPC PowerShell cmdlets to manage the local token cache. These cmdlets are useful for submitting jobs non-interactively. See the following example:

```powershell
Remove-HpcTokenCache

$SecurePassword = "<password>" | ConvertTo-SecureString -AsPlainText -Force

Set-HpcTokenCache -UserName <AADUsername> -Password $SecurePassword -scheduler https://<Azure load balancer DNS name> 
```

### Set the credentials for submitting jobs using the Azure AD account 

Sometimes, you may want to run the job under the HPC cluster user (for a domain-joined HPC cluster, run as one domain user; for a non-domain-joined HPC cluster, run as one local user on the head node).

1. Use the following commands to set the credentials:

    ```powershell
    $localUser = "<username>"

    $localUserPassword="<password>"

    $secpasswd = ConvertTo-SecureString $localUserPassword -AsPlainText -Force

    $mycreds = New-Object System.Management.Automation.PSCredential ($localUser, $secpasswd)

    Set-HpcJobCredential -Credential $mycreds -Scheduler https://<Azure load balancer DNS name>
    ```

2. Then submit the job as follows. The job/task runs under $localUser on the compute nodes.

    ```powershell
    $emptycreds = New-Object System.Management.Automation.PSCredential ($localUser, (new-object System.Security.SecureString))
    ...
    $job = New-HpcJob –Scheduler https://<Azure load balancer DNS name>

    Add-HpcTask -Job $job -CommandLine "ping localhost" -Scheduler https://<Azure load balancer DNS name>

    Submit-HpcJob -Job $job -Scheduler https://<Azure load balancer DNS name> -Credential $emptycreds
    ```
    
   If `–Credential` is not specified with `Submit-HpcJob`, the job or task runs under a local mapped user as the Azure AD account. (The HPC cluster creates a local user with the same name as the Azure AD account to run the task.)
    
3. Set extended data for the Azure AD account. This is useful when running an MPI job on Linux nodes using the Azure AD account.

   * Set extended data for the Azure AD account itself

      ```powershell
      Set-HpcJobCredential -Scheduler https://<Azure load balancer DNS name> -ExtendedData <data> -AadUser
      ```
      
   * Set extended data and run as HPC cluster user
   
      ```powershell
      Set-HpcJobCredential -Credential $mycreds -Scheduler https://<Azure load balancer DNS name> -ExtendedData <data>
      ```

