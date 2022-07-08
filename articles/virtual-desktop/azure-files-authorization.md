---
title: How to authorize an Azure Virtual Desktop host pool for Azure Files - Azure
description: How to authorize an Azure Virtual Desktop host pool to use Azure Files.
author: Heidilohr
ms.topic: how-to
ms.date: 08/19/2021
ms.author: helohr
manager: femila
---

# Authorize an account for Azure Files

This article will show you how to authorize an Azure Virtual Desktop host pool to use Azure Files.

## Requirements

Before you get started, you'll need the following things:

- An Active Directory Domain Services (AD DS) account synced to Azure Active Directory (Azure AD)
- Permissions to create a group in AD DS
- A storage account and the permissions needed to create a new storage account, if necessary
- A virtual machine (VM) or physical machine joined to AD DS that you have permission to access
- An Azure Virtual Desktop host pool in which all session hosts have been domain joined

## Create a security group in Active Directory Domain Services

First, you'll need to create a security group in AD DS. This security group will be used in later steps to grant share-level and New Technology File System (NTFS) file share permissions.

>[!NOTE]
>If you have an existing security group you'd prefer to use, select the name of that group instead of creating a new group.

To create a security group:

1. Open a remote session with the VM or physical machine joined to AD DS that you want to add to the security group.

2. Open **Active Directory Users and Computers**.

3. Under the domain node, right-click the name of your machine. In the drop-down menu, select **New** > **Group**.

4. In the **New Object – Group** window, enter the name of the new group, then select the following values:

    - For **Group scope**, select **Global**
    - For **Group type**, select **Security**

5. Right-click on the new group and select **Properties**.

6. In the **Properties** window, select the **Members** tab.

7. Select **Add…**.

8. In the **Select Users, Contacts, Computers, Service Accounts, or Groups** window, select **Object Types…** > **Computers**. When you're finished, select **OK**.

9. In the **Enter the object names to select** window, enter the names of all session hosts you want to include in the security group.

10. Select **Check Names**, then select the name of the session host you want to use from the list that appears.

11. Select **OK**, then select **Apply**.

>[!NOTE]
>New security groups may take up to 1 hour to sync with Azure AD.

## Create a storage account

If you haven't created a storage account already, follow the directions in [Create a storage account](../storage/common/storage-account-create.md) first. When you create a new storage account, make sure to also create a new file share.

>[!NOTE]
>If you're creating a **Premium** storage account make sure **Account Kind** is set to **FileStorage**.

## Get RBAC permissions

To get RBAC permissions:

1. Select the storage account you want to use.

2. Select **Access Control (IAM)**, then select **Add**. Next, select **Add role assignments** from the drop-down menu.

3. In the **Add role assignment** screen, select the following values:

    - For **Role**, select **Storage File Data SMB Share Contributor**.
    - For **Assign access to**, select **User, Group, or Service Principal**.
    - For **Subscription**, select **Based on your environment**.
    - For **Select**, select the name of the Active Directory group that contains your session hosts.

4. Select **Save**.

## Join your storage account to AD DS

Next, you'll need to join storage account to AD DS. To join your account to AD DS:

1. Open a remote session in a VM or physical machine joined to AD DS.

      >[!NOTE]
      > Run the script using an on-premises AD DS credential that is synced to your Azure AD. The on-premises AD DS credential must have either storage account owner or contributor Azure role permissions.

2. Download and unzip [the latest version on AzFilesHybrid](https://github.com/Azure-Samples/azure-files-samples/releases).

3. Open **PowerShell** in elevated mode.

4. Run the following cmdlet to set the execution policy:
    
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
    ```

5. Next, go to the folder where you unzipped AzfileHybrid and run this command:

    ```powershell
    .\\CopyToPSPath.ps1
    ```

6. After that, import the AzFilesHybrid module by running this cmdlet:
   
   ```powershell
   Import-Module -Name AzFilesHybrid
   ```

7. Next, run this cmdlet to connect to Azure AD:
   
   ```powershell
   Connect-AzAccount
   ```

8. Set the following parameters, making sure to replace the placeholders with the values relevant to your scenario:

    ```powershell
    $SubscriptionId = "<your-subscription-id-here>"

    $ResourceGroupName = "<resource-group-name-here>"

    $StorageAccountName = "<storage-account-name-here>"
    ```

9.  Finally, run this command:

    ```powershell
    Join-AzStorageAccountForAuth `

    -ResourceGroupName $ResourceGroupName `

    -StorageAccountName $StorageAccountName `

    -DomainAccountType "ComputerAccount" `

    -OrganizationalUnitDistinguishedName "<ou-here>" `

    -EncryptionType "'RC4','AES256'"
    ```

## Get NTFS-level permissions

In order to authenticate with AD DS computer accounts against an Azure Files storage account, we must also assign NTFS-level permissions in addition to the RBAC permission we set up earlier.

To assign NTFS permissions:

1. Open the Azure portal and navigate to the storage account that we added to AD DS.

2. Select **Access keys** and copy the value in the **Key1** field.

3. Start a remote session in the VM or physical machine joined to AD DS.

4. Open a command prompt in elevated mode.

5. Run the following command, with the placeholders replaced with the values relevant to your deployment:

    ```cmd
    net use <desired-drive-letter>:
    \\<storage-account-name>.file.core.windows.net\<share-name>
    /user:Azure\<storage-account-name> <storage-account-key>
    ```

    >[!NOTE]
    >When you run this command, the output should say "The command completed successfully." If not, check your input and try again.

6. Open **File Explorer** and find the drive letter you used in the command in step 5.

7. Right-click the drive letter, then select **Properties** > **Security** from the drop-down menu.

8. Select **Edit**, then select **Add…**.

    >[!NOTE]
    >Make sure that domain name matches your AD DS domain name. If it doesn’t, then that means the storage account hasn't been domain joined. You'll need to use a domain-joined account in order to continue.

9. If prompted, enter your admin credentials.

10. In the **Select Users, Computers, Service Accounts, or Groups** window, enter the name of the group from [Create a security group in Active Directory Domain Services](#create-a-security-group-in-active-directory-domain-services).

11. Select **OK**. After that, confirm the group has the **Read & execute** permission. If the group has permissions, the "Allow" check box should be selected, as shown in the following image:

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Security window. Under a list marked "Permissions," the "Read & execute" permission has a green check mark under the "Allow" column.](media/read-and-execute.png)

12. Add the Active Directory group with the computer accounts with **Read & execute** permissions to the security group.

13. Select **Apply**. If you see a Windows Security prompt, select **Yes** to confirm your changes.

## Next steps

If you run into any issues after setup, check out our [Azure Files troubleshooting article](troubleshoot-authorization.md).