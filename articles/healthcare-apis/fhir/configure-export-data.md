---
title: Configure export settings in the FHIR service - Azure Healthcare APIs
description: This article describes how to configure export settings in the FHIR service
author: ranvijaykumar
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.custom: references_regions
ms.date: 01/14/2022
ms.author: cavoeg
---

# Configure export settings and set up a storage account

The FHIR service supports the $export command that allows you to export the data out of the FHIR service account to a storage account.

The three steps below are used in configuring export data in the FHIR service:

- Enable managed identity for the FHIR service.
- Create an Azure storage account or use an existing storage account, and then grant permissions to the FHIR service to access them.
- Select the storage account in the FHIR service as the destination.

## Enable managed identity on the FHIR service

The first step in configuring the FHIR service for export is to enable system wide managed identity on the service, which will be used to grant the service to access the storage account. For more information about managed identities in Azure, see [About managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

In this step, browse to your FHIR service in the Azure portal, and select the **Identity** blade. Select the **Status** option to **On** , and then click **Save**. **Yes** and **No** buttons will display. Select **Yes** to enable the managed identity for FHIR service. Once the system identity has been enabled, you will see a system assigned GUID value. 

[ ![Enable Managed Identity](media/export-data/fhir-mi-enabled.png) ](media/export-data/fhir-mi-enabled.png#lightbox)


## Assign permissions to the FHIR service to access the storage account

Browse to the **Access Control (IAM)** in the storage account, and then select **Add role assignment**. If the add role assignment option is grayed out, you will need to ask your Azure Administrator to assign you permission to perform this task.

For more information about assigning roles in the Azure portal, see [Azure built-in roles](../../role-based-access-control/role-assignments-portal.md).

Add the role [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) to the FHIR service, and then select **Save**.

[![Screen shot showing user interface of Add role assignment page.](../../../includes/role-based-access-control/media/add-role-assignment-page.png) ](../../../includes/role-based-access-control/media/add-role-assignment-page.png#lightbox)

Now you're ready to select the storage account in the FHIR service as a default storage account for export.

## Specify the export storage account for the FHIR service

The final step is to assign the Azure storage account that the FHIR service will use to export the data to.

> [!NOTE]
> If you haven't assigned storage access permissions to the FHIR service, the export operations ($export) will fail.

To do this, select the  **Export** blade in FHIR service service and select the storage account. To search for the storage account, enter its name in the text field. You can also search for your storage account by using the available filters **Name**, **Resource group**, or **Region**. 

[![Screen shot showing user interface of FHIR Export Storage.](media/export-data/fhir-export-storage.png) ](media/export-data/fhir-export-storage.png#lightbox)

After you've completed this final step, you're ready to export the data using $export command.

> [!Note]
> Only storage accounts in the same subscription as that for FHIR service are allowed to be registered as the destination for $export operations.

## Use Azure storage accounts behind firewalls

FHIR service supports a secure export operation. Choose one of the two options below:

* Allowing FHIR service as a Microsoft Trusted Service to access the Azure storage account.

* Allowing specific IP addresses associated with FHIR service to access the Azure storage account. 
This option provides two different configurations depending on whether the storage account is in the same location as, or is in a different location from that of the FHIR service.

### Allowing FHIR service as a Microsoft Trusted Service

Select a storage account from the Azure portal, and then select the **Networking** blade. Select **Selected networks** under the **Firewalls and virtual networks** tab.

  :::image type="content" source="media/export-data/storage-networking-1.png" alt-text="Screenshot of Azure Storage Networking Settings." lightbox="media/export-data/storage-networking-1.png":::
  
Select **Microsoft.HealthcareApis/workspaces** from the **Resource type** dropdown list and your workspace from the **Instance name** dropdown list.

Under the **Exceptions** section, select the box **Allow trusted Microsoft services to access this storage account** and save the setting. 

:::image type="content" source="media/export-data/exceptions.png" alt-text="Allow trusted Microsoft services to access this storage account.":::

Next, specify the FHIR service instance in the selected workspace instance for the storage account using the PowerShell command. 

```
$subscription="xxx"
$tenantId = "xxx"
$resourceGroupName = "xxx"
$storageaccountName = "xxx"
$workspacename="xxx"
$fhirname="xxx"
$resourceId = "/subscriptions/$subscription/resourceGroups/$resourcegroup/providers/Microsoft.HealthcareApis/workspaces/$workspacename/fhirservices/$fhirname"

Add-AzStorageAccountNetworkRule -ResourceGroupName $resourceGroupName -Name $storageaccountName -TenantId $tenantId -ResourceId $resourceId
```

You can see that the networking setting for the storage account shows **two selected** in the **Instance name** dropdown list. One is linked to the workspace instance and the second is linked to the FHIR service instance.

  :::image type="content" source="media/export-data/storage-networking-2.png" alt-text="Screenshot of Azure Storage Networking Settings with resource type and instance names." lightbox="media/export-data/storage-networking-2.png":::

Note that you'll need to install "Add-AzStorageAccountNetworkRule" using an administrator account. For more information, see [Configure Azure Storage firewalls and virtual networks](../../storage/common/storage-network-security.md)

`
Install-Module Az.Storage -Repository PsGallery -AllowClobber -Force 
` 

You're now ready to export FHIR data to the storage account securely. Note that the storage account is on selected networks and is not publicly accessible. To access the files, you can either enable and use private endpoints for the storage account, or enable all networks for the storage account to access the data there if possible.

> [!IMPORTANT]
> The user interface will be updated later to allow you to select the Resource type for FHIR service and a specific service instance.

### Allowing specific IP addresses for the Azure storage account in a different region

Select **Networking** of the Azure storage account from the
portal. 
   
Select **Selected networks**. Under the Firewall section, specify the IP address in the **Address range** box. Add IP ranges to
allow access from the internet or your on-premises networks. You can
find the IP address in the table below for the Azure region where the
FHIR service is provisioned.

|**Azure Region**         |**Public IP Address** |
|:----------------------|:-------------------|
| Australia East       | 20.53.44.80       |
| Canada Central       | 20.48.192.84      |
| Central US           | 52.182.208.31     |
| East US              | 20.62.128.148     |
| East US 2            | 20.49.102.228     |
| East US 2 EUAP       | 20.39.26.254      |
| Germany North        | 51.116.51.33      |
| Germany West Central | 51.116.146.216    |
| Japan East           | 20.191.160.26     |
| Korea Central        | 20.41.69.51       |
| North Central US     | 20.49.114.188     |
| North Europe         | 52.146.131.52     |
| South Africa North   | 102.133.220.197   |
| South Central US     | 13.73.254.220     |
| Southeast Asia       | 23.98.108.42      |
| Switzerland North    | 51.107.60.95      |
| UK South             | 51.104.30.170     |
| UK West              | 51.137.164.94     |
| West Central US      | 52.150.156.44     |
| West Europe          | 20.61.98.66       |
| West US 2            | 40.64.135.77      |

> [!NOTE]
> The above steps are similar to the configuration steps described in the document How to convert data to FHIR (Preview). For more information, see [Host and use templates](./convert-data.md#host-and-use-templates)

### Allowing specific IP addresses for the Azure storage account in the same region

The configuration process is the same as above except a specific IP
address range in Classless Inter-Domain Routing (CIDR) format is used instead, 100.64.0.0/10. The reason why the IP address range, which includes 100.64.0.0 – 100.127.255.255, must be specified is because the actual IP address used by the service varies, but will be within the range, for each $export request.

> [!Note] 
> It is possible that a private IP address within the range of 10.0.2.0/24 may be used instead. In that case, the $export operation will not succeed. You can retry the $export request, but there is no guarantee that an IP address within the range of 100.64.0.0/10 will be used next time. That's the known networking behavior by design. The alternative is to configure the storage account in a different region.

## Next steps

In this article, you learned about the three steps in configuring export settings that allow you to export data out of FHIR service account to a storage account. For more information about the Bulk Export feature that allows data to be exported from the FHIR service, see 

>[!div class="nextstepaction"]
>[How to export FHIR data](export-data.md)
