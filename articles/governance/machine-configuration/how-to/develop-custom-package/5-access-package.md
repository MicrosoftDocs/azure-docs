
# How to provide secure access to custom machine configuration packages
This page provides a guide on how to provide access to Machine Configuration packages stored in Azure storage by using the resource ID of a user-assigned managed identity or a Shared Access Signature (SAS) token. 
# Prerequisites
- Azure subscription
- Azure Storage account with the Machine Configuration package
# Steps to provide access to the package
## Using a User Assigned Identity

**1. Obtain a User-Assigned Managed Identity:**
To start, you need to obtain the existing resourceId a user-assigned managed identity or create a new. This identity will be used by your VMs to access the Azure storage blob. The following PowerShell command creates a new user-assigned managed identity in the specified resource group:
```powershell
$identity = New-AzUserAssignedIdentity -ResourceGroupName "YourResourceGroup" -Name "YourIdentityName"
```
You can also retrieve the resource ID of the user-assigned managed identity that has access to the storage account.
```powershell
$managedIdentityResourceId = (Get-AzUserAssignedIdentity -ResourceGroupName "YourResourceGroup" -Name "YourManagedIdentityName").Id
```

**2. Assign the Managed Identity to Your VMs:**
Next, you need to assign the created managed identity to your VMs. This allows the VMs to use the identity for accessing resources. The following command retrieves the VM and assigns the user-assigned identity to it:
```powershell
$vm = Get-AzVM -ResourceGroupName "YourResourceGroup" -Name "YourVMName"
Set-AzVM -ResourceGroupName "YourResourceGroup" -VMName "YourVMName" -IdentityType UserAssigned -UserAssignedIdentityId $identity.Id
```

**3. Grant the Managed Identity Access to the Blob Storage:**
Now, you need to grant the managed identity read access to the Azure storage blob. This involves assigning the “Storage Blob Data Reader” role to the identity at the scope of the blob container. The following commands retrieve the storage account and create the role assignment:
```powershell
$storageAccount = Get-AzStorageAccount -ResourceGroupName "YourResourceGroup" -Name "YourStorageAccountName"
$scope = $storageAccount.Id + "/blobServices/default/containers/YourContainerName"
New-AzRoleAssignment -ObjectId $identity.PrincipalId -RoleDefinitionName "Storage Blob Data Reader" -Scope $scope
```

**4. Access the Blob Storage from the VMs:**
Finally, from within your VM, you can use the managed identity to access the blob storage. The following commands create a storage context using the connected account and retrieve the blob from the specified container:
```powershell
$context = New-AzStorageContext -StorageAccountName "YourStorageAccountName" -UseConnectedAccount
$blob = Get-AzStorageBlob -Container "YourContainerName" -Blob "YourBlobName" -Context $context
```

This setup ensures that your VMs can securely read from the specified blob container using the user-assigned managed identity. 

## Using a SAS Token 
While this next step is optional, you should add a shared access signature (SAS) token in the URL to ensure secure access to the package. The below example generates a blob SAS token with read access and returns the full blob URI with the shared access signature token. In this example, the token has a time limit of three years.

```powershell
$startTime = Get-Date
$endTime   = $startTime.AddYears(3)

$tokenParams = @{
    StartTime  = $startTime
    ExpiryTime = $endTime
    Container  = 'machine-configuration'
    Blob       = 'MyConfig.zip'
    Permission = 'r'
    Context    = $context
    FullUri    = $true
}
$contentUri = New-AzStorageBlobSASToken @tokenParams
```

# Summary
By using the resource ID of a user-assigned managed identity or SAS token, you can securely provide access to Machine Configuration packages stored in Azure storage. The additional parameters and flags ensure that the package is retrieved using the managed identity and that Azure Arc machines are not included in the policy scope.

# Next Steps
- After creating the policy definition, you can assign it to the appropriate scope (e.g., management group, subscription, resource group) within your Azure environment.
- Remember to monitor the policy compliance status and make any necessary adjustments to your Machine Configuration package or policy assignment to meet your organizational requirements.



