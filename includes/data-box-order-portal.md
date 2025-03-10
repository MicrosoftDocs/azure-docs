---
author: stevenmatthew
ms.service: azure-databox
ms.subservice: databox
ms.topic: include
ms.date: 04/22/2024
ms.author: shaas
---

To order and device, perform the following steps in the Azure portal:

1. Use your Microsoft Azure credentials to sign in at this URL: [https://portal.azure.com](https://portal.azure.com).
2. Select **+ Create a resource** and search for *Azure Data Box*. Select **Azure Data Box**.

    :::image type="content" source="media/data-box-order-portal/data-box-import-01.png" alt-text="Screenshot of the New section of the Azure portal with Azure Data Box in the search box. The Azure Data Box entry is highlighted.":::

3. Select **Create**.  

   :::image type="content" source="media/data-box-order-portal/data-box-import-02.png" alt-text="Screenshot of Azure Data Box section of the Azure portal. The Create option is highlighted.":::

4. Check whether Data Box service is available in your region. Enter or select the following information, and then select **Apply**.

    |Setting  |Value  |
    |---------|---------|
    |Transfer type     | Select **Import to Azure**.        |
    |Subscription     | Select an Enterprise Agreement (EA), Cloud Solution Provider (CSP), or Azure sponsorship subscription for Data Box service. <br> The subscription is linked to your billing account.       |
    |Resource group | Select an existing resource group. A resource group is a logical container for the resources that can be managed or deployed together. |
    |Source country/region    |    Select the country/region where your data currently resides.         |
    |Destination Azure region     |     Select the Azure region where you want to transfer data. <br> For more information, see [region availability for Data Box](../articles/databox/data-box-overview.md#region-availability) or [region availability for Data Box Heavy](../articles/databox/data-box-heavy-overview.md#region-availability).<br>If the selected source and destination regions cross international country/region borders, Data Box and Data Box Heavy aren't available. |

    :::image type="content" source="media/data-box-order-portal/data-box-import-03.png" alt-text="Screenshot of options to select the Transfer Type, Subscription, Resource Group, and source and destination to start a Data Box order in the Azure portal."::: 

5. Select the **Data Box** product to order, either Data Box, as shown in the provided example, or Data Box Heavy.

    The maximum usable capacity for a single Data Box order is 80 TB. The maximum usable capacity for a single Data Box Heavy order is 770 TB. You can create multiple orders to accommodate larger data sizes.

    
    You can't select either Data Box or Data Box Heavy if:

    - Your selected source and destination regions cross international country/region boundaries.

      To transfer your data across country/region borders, import your data to a destination within the same country/region. After the data import completes, use Azure Import/Export to transfer the data to your desired country/region.

    - Your Azure subscription doesn't support the Data Box product. In some cases, your subscription might not support a Data Box product in a specific country/region.
    
    If you select **Data Box Heavy**, the Data Box team checks device availability within your region and notifies you when you can continue placing the order.

    :::image type="content" source="media/data-box-order-portal/data-box-import-04.png" alt-text="Screenshot showing the screen for selecting an Azure Data Box product. The Select button for Data Box is highlighted." lightbox="media/data-box-order-portal/data-box-import-04-lrg.png":::

6. In **Order**, go to the **Basics** tab. Enter or select the following information. Then select **Next: Data destination>**.

    |Setting  |Value  |
    |---------|---------|
    |Subscription      | The subscription is automatically populated based on your earlier selection.|
    |Resource group    | The resource group you selected previously. |
    |Import order name | Provide a friendly name to track the order. <ul><li>The name can have between 3 to 24 characters that can be a letter, number, or hyphen.</li><li>The name must start and end with a letter or a number.</li></ul>    |

    :::image type="content" source="media/data-box-order-portal/data-box-import-05.png" alt-text="Screenshot showing the Basics screen for a Data Box order with example entries. 'The Basics' tab and 'Next: Data destination' button are highlighted.":::

7. On the **Data destination** screen, select the **Data destination** - either storage accounts or managed disks.

    The **Data destination** tab changes based on your selected destination. See either [To use storage accounts](#to-use-storage-accounts) or [To use managed disks](#to-use-managed-disks) in the following section for instructions.

    #### To use storage accounts

    Select **storage account(s)** as the storage destination. The following screen is displayed.

    :::image type="content" source="media/data-box-order-portal/data-box-import-06.png" alt-text="Screenshot of the Data Destination tab for a Data Box order with a Storage Accounts destination. The Storage Accounts storage destination is highlighted."::: 

    Based on the specified Azure region, select one or more storage accounts from the filtered list of existing storage accounts. Your Data Box can be linked with up to 10 storage accounts. You can also create a new **General-purpose v1**, **General-purpose v2**, or **Blob storage account**.

    - If you select Azure Premium FileStorage accounts, the provisioned quota on the storage account share increases to the size of data being uploaded to the file shares. After the quota is increased, it isn't adjusted again, for example, if for some reason the Data Box can't upload your data.

      This quota is used for billing. After your data is uploaded to the datacenter, you should adjust the quota to meet your needs. For more information, see [Understanding billing](../articles/storage/files/understanding-billing.md).

    - If you're using a **General Purpose v1**, **General Purpose v2**, or **Blob** storage account, the **Enable copy to archive** option is shown. Enabling **Copy to archive** allows you to send your blobs to the archive tier automatically. Any data uploaded to the archive tier remains offline and needs to be rehydrated before it can be read or modified.
    
        When **Copy to archive** is enabled, an extra `Archive` share is available during the copy process. The extra share is available for [SMB, NFS, REST, and data copy service](../articles/databox/data-box-deploy-copy-data.md) methods. 

        :::image type="content" source="media/data-box-order-portal/enable-copy-to-archive.png" alt-text="Screenshot of Enable copy to archive option.":::

    > [!NOTE]
    > Storage accounts with virtual networks are supported. To allow the Data Box service to work with secured storage accounts, enable the trusted services within the storage account network firewall settings. For more information, see how to [Add Azure Data Box as a trusted service](../articles/storage/common/storage-network-security.md#exceptions).

    #### To use managed disks

    When using Data Box to create **Managed disk(s)** from on-premises virtual hard disks (VHDs), you also need to provide the following information:

    |Setting  |Value  |
    |---------|---------|
    |Resource groups     | Create new resource groups if you intend to create managed disks from on-premises VHDs. You can use an existing resource group only if the resource group was created previously when creating a Data Box order for managed disks by the Data Box service. <br> Specify multiple resource groups separated by semi-colons. A maximum of 10 resource groups are supported.|

    :::image type="content" source="media/data-box-order-portal/data-box-import-08.png" alt-text="Screenshot of the Data Destination tab for a Data Box order with a Managed Disks destination. The Data Destination tab, Managed Disks, and Next: Security button are highlighted."::: 

    The storage account specified for managed disks is used as a staging storage account. The Data Box service uploads the VHDs as page blobs to the staging storage account before converting the page blobs to managed disks and moving them to the resource groups. For more information, see [Verify data upload to Azure](../articles/databox/data-box-deploy-picked-up.md#verify-data-has-uploaded-to-azure).

    > [!NOTE]
    > Data Box supports copying only 1 MiB aligned, fixed-size `.vhd` files for creating managed disks. Dynamic VHDs, differencing VHDs, `.vmdk` or `.vhdx` files are not supported.
    >
    > If a page blob isn't successfully converted to a managed disk, it stays in the storage account and you're charged for storage.

8. Select **Next: Security>** to continue.

    The **Security** screen lets you use your own encryption key and your own device and share passwords, and choose to use double encryption.

    All settings on the **Security** screen are optional. If you don't change any settings, the default settings are applied.

    :::image type="content" source="media/data-box-order-portal/data-box-import-09.png" alt-text="Screenshot of the Security tab for a Data Box import Order. The Security tab is highlighted."::: 

9. If you want to use your own customer-managed key to protect the unlock passkey for your new resource, expand **Encryption type**.

    Configuring a customer-managed key for your Azure Data Box is optional. By default, Data Box uses a Microsoft managed key to protect the unlock passkey.

    A customer-managed key doesn't affect how data on the device is encrypted. The key is only used to encrypt the device unlock passkey.

    If you don't want to use a customer-managed key, skip to Step 15.

    :::image type="content" source="media/data-box-order-portal/customer-managed-key-01.png" alt-text="Screenshot of Security tab in the Data Box Order wizard. Encryption Type settings are expanded and highlighted.":::

10. To use a customer-managed key, select **Customer managed key** as the key type. Then choose **Select a key vault and key**.
   
    :::image type="content" source="media/data-box-order-portal/customer-managed-key-02.png" alt-text="Screenshot of Encryption Type settings on the Security tab for a Data Box order. The 'Select a key and key vault' link is highlighted.":::

11. On the **Select key from Azure Key Vault** pane:

    - The **Subscription** is automatically populated.

    - For **Key vault**, you can select an existing key vault from the dropdown list.

      :::image type="content" source="media/data-box-order-portal/customer-managed-key-03.png" alt-text="Screenshot of Encryption type settings on the Security tab for a Data Box order. The 'Customer managed key' option and the 'Select a key and key vault' link are selected."

      Or select **Create new key vault** if you want to create a new key vault. 
    
      :::image type="content" source="media/data-box-order-portal/customer-managed-key-04.png" alt-text="Screenshot of Encryption type settings on the Security tab for a Data Box order. The 'Create new key vault' link is highlighted.":::

      Then, on the **Create key vault** screen, enter the resource group and a key vault name. Ensure that **Soft delete** and **Purge protection** are enabled. Accept all other defaults, and select **Review + Create**.

      :::image type="content" source="media/data-box-order-portal/customer-managed-key-05.png" alt-text="Screenshot of the 'Create Key Vault' screen for a Data Box order. Resource Group and Key Vault Name are highlighted. Soft-Delete and Purge Protection are enabled.":::

      Review the information for your key vault, and select **Create**. Wait for a couple minutes for key vault creation to complete.

      :::image type="content" source="media/data-box-order-portal/customer-managed-key-06.png" alt-text="Screenshot of the Review Plus Create tab of the Create Key Vault wizard for Azure. The Create button is highlighted.":::

12. The **Select a key** pane displays your selected key vault.

    :::image type="content" source="media/data-box-order-portal/customer-managed-key-07.png" alt-text="Screenshot of the 'Select a key' screen in Azure Key Vault. The Key Vault field is highlighted."::: 

    If you want to create a new key, select **Create new key**. You must use an RSA key. The size can be 2048 or greater. Enter a name for your new key, accept the other defaults, and select **Create**.

      :::image type="content" source="media/data-box-order-portal/customer-managed-key-08.png" alt-text="Screenshot of the 'Create a Key' screen in Azure Key Vault with a key name entered. The Name field and the Create button are highlighted."::: 

      You're notified when the key is created in your key vault. Your new key is selected within the **Select a key** pane.

13. Select the **Version** of the key to use, and then choose **Select**.

    :::image type="content" source="media/data-box-order-portal/customer-managed-key-09.png" alt-text="Screenshot of the 'Create a Key' screen in Azure Key Vault. The Version field is highlighted, with available versions displayed.":::

    If you want to create a new key version, select **Create new version**.

    :::image type="content" source="media/data-box-order-portal/customer-managed-key-10.png" alt-text="Screenshot of the Create A Key screen in Azure Key Vault. The Create New Version link is highlighted.":::

    Choose settings for the new key version, and select **Create**.

    :::image type="content" source="media/data-box-order-portal/customer-managed-key-11.png" alt-text="Screenshot of the Create a Key dialog box in Azure Key Vault with example field settings. The Create button is highlighted.":::

    The **Encryption type** settings on the **Security** screen show your key vault and key.

    :::image type="content" source="media/data-box-order-portal/customer-managed-key-12.png" alt-text="Screenshot of the Security tab for a Data Box import order. A key vault and key are highlighted in the Encryption type settings.":::

14. Select a user identity with which to manage access to this resource. Choose **Select a user identity**. In the panel on the right, select the subscription and the managed identity to use. Then choose **Select**.

    A user-assigned managed identity is a stand-alone Azure resource that can be used to manage multiple resources. For more information, see [Managed identity types](../articles/active-directory/managed-identities-azure-resources/overview.md).  

    If you need to create a new managed identity, follow the guidance in [Create, list, delete, or assign a role to a user-assigned managed identity using the Azure portal](../articles/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md).
    
    :::image type="content" source="media/data-box-order-portal/customer-managed-key-13.png" alt-text="Screenshot of Security tab showing 'Select user assigned management identity' panel for a Data Box order. Subscription and Selected Identity fields are highlighted.":::

    The user identity is shown in **Encryption type** settings.

    :::image type="content" source="media/data-box-order-portal/customer-managed-key-14.png" alt-text="Screenshot of the Security tab for a Data Box import order. A selected User Identify is highlighted in the Encryption Type settings.":::

    > [!IMPORTANT]
    > If you use a customer-managed key, you must enable the `Get`, `UnwrapKey`, and `WrapKey` permissions on the key. Without these permissions, order creation will fail. They're also needed during data copy. To set the permissions in Azure CLI, see [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy).


15. If you don't want to use the system-generated passwords that Azure Data Box uses by default, expand **Bring your own password** on the **Security** screen.

    The system-generated passwords are secure, and are recommended unless your organization requires otherwise.

    :::image type="content" source="media/data-box-order-portal/bring-your-own-password-01.png" alt-text="Screenshot of expanded 'Bring your own password' on the Security tab for a Data Box order. Security tab and password options are highlighted."::: 

    - To use your own password for your new device, by **Set preference for the device password**, select **Use your own password**, and type a password that meets the security requirements.
     
     The password must be alphanumeric and contain between 12 to 15 characters. It must also contain at least one uppercase letter, one lowercase letter, one special character, and one number.

     - Allowed special characters: @ # - $ % ^ ! + = ; : _ ( )
     - Characters not allowed: I i L o O 0
   
     :::image type="content" source="media/data-box-order-portal/bring-your-own-password-02.png" alt-text="Screenshot of 'Bring your own password' options on Security tab for a Data Box order. The Use Your Own Password option and Device Password option are highlighted."::: 

 - To use your own passwords for shares:

   1. By **Set preference for share passwords**, select **Use your own passwords** and then **Select passwords for the shares**.
     
       :::image type="content" source="media/data-box-order-portal/bring-your-own-password-03.png" alt-text="Screenshot of options for using your own share passwords on Security tab for a Data Box order. Two options, Use Your Own Passwords and Select Passwords for the Shares, are highlighted."::: 

    1. Type a password for each storage account in the order. The password is used on all shares for the storage account.
    
       The password must be alphanumeric and contain between 12 to 64 characters. It must also contain at least one uppercase letter, one lowercase letter, one special character, and one number.

       - Allowed special characters: @ # - $ % ^ ! + = ; : _ ( )
       - Characters not allowed: I i L o O 0
     
    1. To use the same password for all of the storage accounts, select **Copy to all**. 

    1. When you finish, select **Save**.
     
       :::image type="content" source="media/data-box-order-portal/bring-your-own-password-04.png" alt-text="Screenshot of Set Share Passwords screen for a Data Box order. The Copy To All link and the Save button are highlighted."::: 

    On the **Security** screen, you can use **View or change passwords** to change the passwords.

16. In **Security**, if you want to enable software-based double encryption, expand **Double-encryption (for highly secure environments)**, and select **Enable double encryption for the order**.

    :::image type="content" source="media/data-box-order-portal/double-encryption-01.png" alt-text="Screenshot of Double Encryption options on the Security tab for a Data Box order. The Enable Double Encryption For The Order option and the Next: Contact Details button are highlighted."::: 

    The software-based encryption is performed in addition to the  AES-256 bit encryption of the data on the Data Box.

    > [!NOTE]
    > Enabling this option could make order processing and data copy take longer. You can't change this option after you create your order.

    Select **Next: Contact details>** to continue.

17. In **Contact details**, select **+ Add Address**.

    :::image type="content" source="media/data-box-order-portal/contact-details-01.png" alt-text="Screenshot of Contact Details tab for a Data Box order. The Contact Details tab and the Plus Add Address option are highlighted."::: 

18. On the **Add address** screen, provide your familiar and family name, the name and postal address of the company, and a valid phone number. Select **Validate address**. The service validates the address for service availability and notifies you if service is available for that address.

    :::image type="content" source="media/data-box-order-portal/contact-details-02.png" alt-text="Screenshot of the Add Address screen for a Data Box order. The Ship using options and the Add shipping address option called out."::: 

    If you selected self-managed shipping, you'll receive an email notification after the order is placed successfully. For more information about self-managed shipping, see [Use self-managed shipping](../articles/databox/data-box-portal-customer-managed-shipping.md).

19. Select **Add shipping address** after the shipping details are successfully validated. You're returned to the **Contact details** tab.

20. Beside **Email**, add one or more email addresses. The service sends email notifications regarding any updates to the order status to the specified email addresses.

    We recommend that you use a group email so that you continue to receive notifications if an admin in the group leaves.

    :::image type="content" source="media/data-box-order-portal/contact-details-03.png" alt-text="Screenshot showing the Email section of the Contact Details tab for a Data Box order. The area for typing email addresses and the Review Plus Order button are highlighted."::: 

    Select **Review + Order** to continue.

21. In **Review + Order**:

    1. Review the information in **Review + Order** related to the order, contact details, notification, and privacy terms. 
    
    1. Check the box corresponding to the agreement to privacy terms. When you select the checkbox, the order information is validated.

    1. Once the order is validated, select **Order**.
    
        :::image type="content" source="media/data-box-order-portal/data-box-import-10.png" alt-text="Screenshot of the Review Plus Order tab for a Data Box order. The validation status, terms checkbox, and Order button are highlighted.":::

    The order takes a few minutes to be created appears similar to the provided example. You can select **Go to resource** to open the order.

    :::image type="content" source="media/data-box-order-portal/data-box-import-11.png" alt-text="Screenshot of a completed deployment for a Data Box order. The Go To Resource button is highlighted.":::
