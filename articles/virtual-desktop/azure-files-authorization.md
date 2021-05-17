# Authorize an account for Azure FIles.

This article will tell you how to authenticate a Windows Virtual Desktop host pool for Azure Files.

## Requirements

Before you get started, you'll need the following things:

-   An Active Directory Domain Services (AD DS) account synced to Azure Active Directory (Azure AD)
-   Permissions to create a group in AD DS
-   A storage account and the permissions needed to create a new storage account, if required
-   A virtual machine (VM) or physical machine joined to AD DS, as well as the required permissions to access it
-   A Windows Virtual Desktop host pool in which all session hosts have been domain joined

Process overview
----------------

1. Create AD DS security group.

2. Add the computer accounts for all session hosts as members of the group

3. Synch AD DS group to Azure AD

4. Create storage account

5. Create file share under the storage account

6. Join storage account to AD DS

7. Assign the AD DS group that has been synched to Azure AD, the Storage File
    Data SMB Share Contributor role assignment on the storage account

8. Mount file share on any session host

9. Grant NTFS permissions on the file share to the AD DS group

## Create a group in Active Directory Domain Services

This group will be used in later steps to grant share level and NTFS (files share) permissions.

1. Remote into the VM or physical machine joined to AD DS.

2. Open the **Active Directory Users and Computers** utility.

3. Under the domain node right-click and select **New**, and then **Group**.

>   **Note**: it is not mandatory to create a new group, an existing group can
>   be used.

1. In the **New Object – Group** enter group name and select:

    1. Group scope: Global

    2. Group type: Security

2. Right-click on the new group and select **Properties.**

3. In the properties screen select the **Members** tab.

4. Select **Add…**

5. In the **Select Users, Contacts, Computers, Service Accounts, or Groups** dialog select **Object Types…** and select **Computers.** Select **OK.**

6. In the **Enter the object names to select** enter the names of all session hosts.

7. Select **Check Names** and if multiple entries are present select the “correct” one from the results dialog.

8. Select **Ok**, then select **Apply**.

>[!NOTE]
>If this is a new group it may take up to 1 hour to sync with Azure AD.

## Create a storage account

If you haven't created a storage account already, follow the directions for how to create a storage account in the Azure portal in [Create a storage account](../storage/common/storage-account-create.md). When you create a new storage account, make sure to also create a new file share.

>[!NOTE]
>If you're creating a **Premium** storage account make sure **Account Kind** is set to **FileStorage.**

![](media/0d7d5be429505166b3cb590db41c7d34.png)

## Get RBAC permissions

To get RBAC permissions:

1. Select the desired storage account

2. Select **Access Control (IAM)** and then **Add.** From the drop down select **Add role assignments.**

![](media/a4a78f167eab9602b5555c76c58254f3.png)

3. In the **Add role assignment** screen:

    - Role: **Storage File Data SMB Share Contributor**
    - Assign access to: **User, Group, or Service Principal**
    - Subscription: **Based on your environment**
    - Select: **pick the AD group that you created which contains your session hosts**

    ![](media/4890d22e04a668a1bb354b23b8366271.png)

4. Select **Save**.

## Join your storage account to AD DS

In this step we are going to join our storage account to AD DS. The full article
is available [here](https://github.com/Azure-Samples/azure-files-samples/releases). Please note our steps here have been modified to achieve the desired scenario.

1. Remote into the VM or physical machine joined to AD DS.

>[!NOTE]
> Run the script using an on-premises AD DS credential that is synced to your Azure AD. The on-premises AD DS credential must have either the storage account owner or the contributor Azure role permissions.

1. Download and unzip the latest version on AzFilesHybrid from [here](https://github.com/Azure-Samples/azure-files-samples/releases).

2. Open **PowerShell** in elevated mode.

3. Run the following command to set the execution policy:
    
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
    ```

4. Navigate to where AzfileHybrid was unzipped and run

    ```powershell
    .\\CopyToPSPath.ps1
    ```

5. Import the AzFilesHybrid module via Import-Module -Name AzFilesHybrid

6. Connect to Azure AD via Connect-AzAccount

7. Set the following parameters according to your setup:

    ```powershell
    $SubscriptionId = "<your-subscription-id-here>"

    $ResourceGroupName = "<resource-group-name-here>"

    $StorageAccountName = "<storage-account-name-here>"
    ```

8. Run **Join-AzStorageAccountForAuth**

    ```powershell
    Join-AzStorageAccountForAuth `

    -ResourceGroupName $ResourceGroupName `

    -StorageAccountName $StorageAccountName `

    -DomainAccountType "ComputerAccount" `

    -OrganizationalUnitDistinguishedName "<ou-here>" `

    -EncryptionType "'RC4','AES256'"
    ```

9. The output of the above command must look like the screenshot below. If it doesn’t, joining the storage account to AD DS was not successful.

    ![](media/af03d4aa7a60e0173b112cc1d728be27.png)

## Get NTFS-level permissions

To be able to authenticate with AD DS computer accounts against an Azure Files storage account, we must also assign NTFS level permission in addition to the RBAC permission we set up earlier.

1. Open the Azure portal and navigate to the storage account that we added to AD DS.

2. Select **Access keys** and copy **Key1**

![](media/be74c591246fa5fea3ee6fd93c0dfcfa.png)

1. Remote into the VM or physical machine joined to AD DS.

2. Open command prompt in elevated mode.

3. Execute the following command replacing the values in it with those applicable to your environment:

    ```cmd
    net use <desired-drive-letter>:
    \\<storage-account-name>.file.core.windows.net\<share-name>
    /user:Azure\<storage-account-name> <storage-account-key>
    ```

    >[!NOTE]
    >Make sure that the output of the command above says "The command completed successfully." If not, repeat and verify input.

1. Open **File Explorer** and find the drive letter specified in the command above.

2. Right-click on the drive letter and select **Properties** and then **Security**.

3. Select **Edit** and after that **Add…**

    ![](media/5a31fca5eb0ee15e44cd1b6f34dc8ead.png)

    >[!NOTE]
    >Make sure that domain name matches your AD DS domain name, if it doesn’t the storage account has not been domain joined.

4. If prompted, enter admin credentials.

5. In the **Select Users, Computers, Service Accounts, or Groups** window enter the name of the group we created in the **Create Group in AD DS** section.

6. Select **OK** and confirm the group has **Read & execute** permissions.

    ![](media/6fcc4b07786ed735f594b4978b886e2f.png)

7. Add the AD group with the computer accounts with **Read & execute** permissions.

8. Select **Apply** and if prompted by **Windows Security** confirm by pressing **Yes.**

