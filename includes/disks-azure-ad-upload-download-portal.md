---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 07/21/2022
 ms.author: rogarana
 ms.custom: include file
---
If you're using [Azure Active Directory (Azure AD)](../articles/active-directory/fundamentals/active-directory-whatis.md) to control resource access, you can now use it to restrict uploads and downloads of Azure managed disks. This feature is currently in preview. When a user attempts to upload or download a disk, Azure validates the identity of the requesting user in Azure AD, and confirms that user has the required permissions. At a higher level, a system administrator could set a policy at the Azure account or subscription level, to ensure that all disks and snapshots must use Azure AD for uploads or downloads. If you have any questions on securing uploads or downloads with Azure AD, reach out to this email: azuredisks@microsoft .com

### Restrictions
[!INCLUDE [disks-azure-ad-upload-download-restrictions](disks-azure-ad-upload-download-restrictions.md)]
- To download a VHD that is using Azure AD to restrict access, you must access the Azure portal from this link: [https://aka.ms/dataAccessAuthenticationMode](https://aka.ms/dataAccessAuthenticationMode)

### Prerequisites
[!INCLUDE [disks-azure-ad-upload-download-prereqs](disks-azure-ad-upload-download-prereqs.md)]

### Assign RBAC role

To access managed disks secured with Azure AD, the requesting user must have either the [Data Operator for Managed Disks](../articles/role-based-access-control/built-in-roles.md#data-operator-for-managed-disks) role, or a [custom role](../articles/role-based-access-control/custom-roles-portal.md) with the following permissions: 

- **Microsoft.Compute/disks/download/action**
- **Microsoft.Compute/disks/upload/action**
- **Microsoft.Compute/snapshots/download/action**
- **Microsoft.Compute/snapshots/upload/action**

For detailed steps on assigning a role, see the following articles for [portal](../articles/role-based-access-control/role-assignments-portal.md), [PowerShell](../articles/role-based-access-control/role-assignments-powershell.md), or [CLI](../articles/role-based-access-control/role-assignments-cli.md). To create or update a custom role, see the following articles for [portal](../articles/role-based-access-control/custom-roles-portal.md), [PowerShell](../articles/role-based-access-control/role-assignments-powershell.md), or [CLI](../articles/role-based-access-control/role-assignments-cli.md).

### Enable data access authentication mode

# [Portal](#tab/azure-portal)

Enable **data access authentication mode** to restrict access to the disk. You can either enable it when creating the disk, or you can enable it on the **Disk Export** page for existing disks. In order to enable **data access authentication mode** you must access the Azure portal from the following link: [https://aka.ms/dataAccessAuthenticationMode](https://aka.ms/dataAccessAuthenticationMode)

:::image type="content" source="media/disks-azure-ad-upload-download-portal/disks-data-access-auth-mode.png" alt-text="Screenshot of a disk's data access authentication mode checkbox, tick the checkbox to restrict access to the disk, and save your changes." lightbox="media/disks-azure-ad-upload-download-portal/disks-data-access-auth-mode.png":::

# [PowerShell](#tab/azure-powershell)

Set `dataAccessAuthMode` to `"AzureActiveDirectory"` on your disk, in order to download it when it's been secured. Use the following script to update an existing disk, replace the values for `-ResourceGroupName` and `-DiskName` before running the script:

```azurepowershell
New-AzDiskUpdateConfig -DataAccessAuthMode "AzureActiveDirectory" | Update-AzDisk -ResourceGroupName 'yourResourceGroupName' -DiskName 'yourDiskName"
```

# [Azure CLI](#tab/azure-cli)

Set `dataAccessAuthMode` to `"AzureActiveDirectory"` on your disk, in order to download it when it's been secured. Use the following script to update an existing disk, replace the values for `--resource-group` and `--Name` before running the script:

```azurecli
az disk update --name yourDiskName --resource-group yourResourceGroup --data-access-auth-mode AzureActiveDirectory
```

---