#<Command>
az ams account create --name your-media-services-account-name --resource-group your-resource-group-name --mi-system-assigned --storage-account your-storage-account-name
#</Command>

#<Return>
{
  "encryption": {
    "keyVaultProperties": null,
    "type": "SystemKey"
  },
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mediatest1rg/providers/Microsoft.Media/mediaservices/mediatest1acc",
  "identity": {
    "principalId": "00000000-0000-0000-0000-000000000000",
    "tenantId": "00000000-0000-0000-0000-000000000000",
    "type": "SystemAssigned"
  },
  "location": "West US 2",
  "mediaServiceId": "00000000-0000-0000-0000-000000000000",
  "name": "mediatest1acc",
  "resourceGroup": "mediatest1rg",
  "storageAccounts": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/your-resource-group/providers/Microsoft.Storage/storageAccounts/your-stroage-account",
      "resourceGroup": "mediatest1rg",
      "type": "Primary"
    }
  ],
  "storageAuthentication": "System",
  "systemData": {
    "createdAt": "2021-05-14T21:25:12.3492071Z",
    "createdBy": "you@example.com",
    "createdByType": "User",
    "lastModifiedAt": "2021-05-14T21:25:12.3492071Z",
    "lastModifiedBy": "you@example.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "Microsoft.Media/mediaservices"
}
#</Return>
