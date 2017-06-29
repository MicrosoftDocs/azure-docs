---
title: Connect Storage Explorer to an Azure Stack subscription
description: Learn how to connect Storage Exporer to an  Azure Stack subscription
services: azure-stack
documentationcenter: ''
author: xiaofmao
manager:
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 7/10/2017
ms.author: xiaofmao

---
# Connect Storage Explorer to an Azure Stack subscription

Azure Storage Explorer (Preview) is a standalone app that enables you to easily work with Azure Stack Storage data on Windows, macOS, and Linux. There are several tools avaialble to move data to and from Azure Stack Storage. For more information, see [Data transfer tools for Azure Stack storage](azure-stack-storage-transfer.md).

In this article, you learn how to connect to your Azure Stack storage accounts using Storage Explorer. 

Azure Stack requires Storage Explorer version 0.8.13. If you haven't installed it yet, [download](https://go.microsoft.com/fwlink/?LinkId=809306) Storage Explorer version 0.8.13 and install it.

> [!WARNING]
> Do not update Storage Explorer if you are prompted with an available update. To work with Azure Stack, you must continue to use version 0.8.13. 

After you connect to your Azure Stack subscription, you can use the [Azure Storage Explorer articles](../vs-azure-tools-storage-manage-with-storage-explorer.md) to work with your Azure Stack data. 

## Connect to an Azure Stack subscription

You need access to the Azure Stack host machine's desktop or a VPN connection for Storage Explorer to access the Azure Stack subscription. To learn how to set up a VPN connection to Azure Stack, see [Connect to Azure Stack with VPN](azure-stack-connect-azure-stack.md#connect-with-vpn).

For Azure Stack Development Kit, you need to export the Azure Stack authority root certificate. To do so:

1. Open `mmc.exe` on an Azure Stack host machine, or a local machine with a VPN connection to Azure Stack. 

2. In **File**, select **Add/Remove Snap-in**, and then add **Certificates** to manage **Computer account** of **Local Computer**.

    ![Load the Azure Stack root certificate through mmc.exe][25]   

3. Under **Console Root\Certificated (Local Computer)\Trusted Root Certification Authorities\Certificates** find **AzureStackCertificationAuthority**. 

    If you see multiple copies of this certificate, select the first one.

4. Right-click the certificate, select **All Tasks** > **Export**, and then follow the instructions to export the certificate with **Base-64 encoded X.509 (.CER)**.  

    The exported certificate will be used in the next step.   

    ![Export the root Azure Stack authority root certificate][26]   

5. In Storage Explorer (Preview), on the **Edit** menu, point to **SSL Certificates**, and then select **Import Certificates**. Use the file picker dialog box to find and open the certificate that you exported in the previous step.  

    After importing, you are prompted to restart Storage Explorer.

    ![Import the certificate into Storage Explorer (Preview)][27]

6. After Storage Explorer (Preview) restarts, select the **Edit** menu, and then ensure that **Target Azure Stack** is selected. If it is not selected, select it, and then restart Storage Explorer for the change to take effect. This configuration is required for compatibility with your Azure Stack environment.

    ![Ensure Target Azure Stack is selected][28]

7. In the left pane, select **Manage Accounts**.  
    All the Microsoft accounts that you are signed in to are displayed.

8. To connect to the Azure Stack account, select **Add an account**.

    ![Add an Azure Stack account][29]

9. In the **Connect to Azure Storage** dialog box, under **Azure environment**, select **Create Custom Environment**, and then click **Next**.

10. To sign in with the Azure Stack account that's associated with at least one active Azure Stack subscription, fill in the **Sign in to a Custom Cloud ETestnvironment** dialog box.  

    The details for each field are as follows:

    * **Environment name**: The field can be customized by user.
    * **Authority**: The value should be https://login.windows.net.
    * **Sign in resource id**: Retrieve the value by executing one of the following PowerShell scripts:

        If you are a cloud administrator:

        ```powershell
        PowerShell (Invoke-RestMethod -Uri https://adminmanagement.local.azurestack.external/metadata/endpoints?api-version=1.0 -Method Get).authentication.audiences[0]
        ```

        If you are a tenant:

        ```powershell
        PowerShell (Invoke-RestMethod -Uri https://management.local.azurestack.external/metadata/endpoints?api-version=1.0 -Method Get).authentication.audiences[0]
        ```

    * **Graph endpoint**: The value should be https://graph.windows.net.
    * **ARM resource id**: Use the same value as **Sign in resource id**.
    * **ARM resource endpoint**: The samples of Azure Resource Manager resource endpoints:

        * For cloud administrator: https://adminmanagement.local.azurestack.external   
        * For tenant: https://management.local.azurestack.external
 
    * **Tenant Ids**: Optional. The value is given only when the directory must be specified.

12. After you successfully sign in with an Azure Stack account, the left pane is populated with the Azure Stack subscriptions associated with that account. Select the Azure Stack subscriptions that you want to work with, and then select **Apply**. (Selecting or clearing the **All subscriptions** check box toggles selecting all or none of the listed Azure Stack subscriptions.)

    ![Select the Azure Stack subscriptions after filling out the Custom Cloud Environment dialog box][30]  
    The left pane displays the storage accounts associated with the selected Azure Stack subscriptions.

    ![List of storage accounts including Azure Stack subscription accounts][31]

## Next steps
* [Get started with Storage Explorer (Preview)](../vs-azure-tools-storage-manage-with-storage-explorer.md)
* [Azure Stack Storage: differences and considerations](azure-stack-acs-differences.md)


* To learn more about Azure Storage, see [Introduction to Microsoft Azure Storage](..\storage\storage-introduction.md)

[25]: ./media/azure-stack-storage-connect-se/add-certificate-azure-stack.png
[26]: ./media/azure-stack-storage-connect-se/export-root-cert-azure-stack.png
[27]: ./media/azure-stack-storage-connect-se/import-azure-stack-cert-storage-explorer.png
[28]: ./media/azure-stack-storage-connect-se/select-target-azure-stack.png
[29]: ./media/azure-stack-storage-connect-se/add-azure-stack-account.png
[30]: ./media/azure-stack-storage-connect-se/select-accounts-azure-stack.png
[31]: ./media/azure-stack-storage-connect-se/azure-stack-storage-account-list.png
